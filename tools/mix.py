"""Mixage d'un épisode : voix + bruitages earshot + pas + ambiances synthétisées, ducking, master −14 LUFS.

Usage : .venv/bin/python tools/mix.py 000-demo
Lit   : public/<id>/voix.wav, public/<id>/mots.json, public/<id>/timeline.json (npx tsx tools/timeline.ts <id>)
Écrit : public/<id>/mix.wav (master stéréo 48 kHz), public/<id>/stems/{voix,fond}.wav (mêmes gains que le master),
        qc/<id>/mix.json (niveaux mesurés). Les bruitages sont mis en cache dans public/<id>/sons/.
Règles (qc/lecons.md) : sons sombres uniquement (tools/sons_autorises.json) ; fond ≥ 10 dB sous la voix
(vérifié et corrigé mot par mot, contrôlé ensuite par tools/qc_audio.py) ; −14 LUFS, true peak < −1 dB.
"""
import hashlib
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy import signal
from scipy.ndimage import minimum_filter1d

SR = 48000
RACINE = Path(__file__).resolve().parent.parent
EARSHOT = RACINE / "tools" / "earshot" / ".venv" / "bin" / "earshot"
CIBLE_LUFS = -14.0
PLAFOND_TP = -1.5  # marge sous −1 dBTP pour l'encodage AAC
VOIX_LUFS = -16.0  # niveau de la voix avant master
ECART_MIN_DB = 12.0  # fond au moins 12 dB sous la voix pendant chaque mot (règle : ≥ 10 dB)

# Niveaux de base (dBFS crête pour les bruitages, RMS pour les ambiances), ajustés par `gain` / `niveau`
BASE_SFX_DB = -8.0  # +4 dB (retour du 24/10 : bruitages trop faibles) ; la voix reste protégée mot par mot
BASE_PAS_DB = -24.0  # pas audibles (retour du 24/10 : « pas assez de bruitages »)
BASE_AMB_DB = {"vent": -36.0, "drone": -37.0, "coeur": -30.0, "ville": -38.0, "eau": -27.0, "glouglou": -27.0, "grincement": -29.0}


def db(x: float) -> float:
    return 20 * np.log10(max(x, 1e-12))


def gain(d: float) -> float:
    return 10 ** (d / 20)


def rng(nom: str) -> np.random.Generator:
    # Hasard reproductible : même épisode = même mixage
    return np.random.default_rng(int(hashlib.sha1(nom.encode()).hexdigest()[:8], 16))


def passe_bas(x: np.ndarray, fc: float, ordre: int = 2) -> np.ndarray:
    return signal.sosfilt(signal.butter(ordre, fc, "low", fs=SR, output="sos"), x)


def passe_bande(x: np.ndarray, f1: float, f2: float, ordre: int = 2) -> np.ndarray:
    return signal.sosfilt(signal.butter(ordre, [f1, f2], "band", fs=SR, output="sos"), x)


def lfo(n: int, freq: float, graine: str, profondeur: float = 1.0) -> np.ndarray:
    """Modulation lente et irrégulière (somme de sinus de phases aléatoires)."""
    r = rng(graine)
    t = np.arange(n) / SR
    m = sum(np.sin(2 * np.pi * freq * k * t + r.uniform(0, 6.28)) / k for k in (1, 1.618, 2.7))
    return 1 + profondeur * m / 1.9


def normaliser_rms(x: np.ndarray, cible_db: float) -> np.ndarray:
    rms = np.sqrt(np.mean(x ** 2)) + 1e-12
    return x * gain(cible_db) / rms


# ---------------- Ambiances synthétisées (toutes sombres) ----------------
def amb_vent(n: int, g: str) -> np.ndarray:
    r = rng(g)
    bruit = np.cumsum(r.standard_normal(n)) * 0.02  # bruit brun
    bruit -= passe_bas(bruit, 20)  # retire la dérive
    corps = passe_bande(bruit, 120, 900) * lfo(n, 0.11, g + "a", 0.7)
    sifflement = passe_bande(r.standard_normal(n), 380, 620, 4) * np.clip(lfo(n, 0.07, g + "s", 1.2) - 0.6, 0, None)
    return normaliser_rms(corps + 0.25 * sifflement, 0)


def amb_drone(n: int, g: str) -> np.ndarray:
    t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * t + p) for f, a, p in ((41.2, 1, 0), (41.5, 0.8, 1), (61.7, 0.45, 2), (82.4, 0.25, 3)))
    x = x * lfo(n, 0.05, g, 0.35)
    x += passe_bas(rng(g).standard_normal(n), 160) * 0.6
    return normaliser_rms(x, 0)


def amb_coeur(n: int, g: str, bpm: float = 70) -> np.ndarray:
    x = np.zeros(n)
    periode = 60 / bpm
    battement = np.arange(int(0.18 * SR)) / SR
    choc = np.sin(2 * np.pi * 48 * battement) * np.exp(-battement * 26)
    choc2 = 0.6 * np.sin(2 * np.pi * 42 * battement) * np.exp(-battement * 30)
    t = 0.0
    while t < n / SR:
        for decal, c in ((0.0, choc), (0.28 * periode, choc2)):
            i = int((t + decal) * SR)
            j = min(n, i + len(c))
            if i < n:
                x[i:j] += c[: j - i]
        t += periode
    return normaliser_rms(passe_bas(x, 180), 0)


def amb_ville(n: int, g: str) -> np.ndarray:
    r = rng(g)
    grondement = passe_bas(np.cumsum(r.standard_normal(n)) * 0.01, 260)
    grondement -= passe_bas(grondement, 25)
    return normaliser_rms(grondement * lfo(n, 0.03, g, 0.4), 0)


# ---------------- Bruitages d'objets synthétisés (absents de la banque earshot) ----------------
def _bulles_aigues(n: int, g: str) -> np.ndarray:
    """Nuage dense de petites bulles aiguës (gouttes qui éclatent) + souffle d'eau."""
    r = rng(g)
    x = passe_bande(r.standard_normal(n), 900, 6000, 2) * 0.35 * lfo(n, 9.0, g + "f", 0.4)
    t = 0.0
    while t < n / SR:
        d = int((0.008 + 0.018 * r.random()) * SR)
        f0 = 700 + 2600 * r.random() ** 1.5
        tt = np.arange(d) / SR
        goutte = np.sin(2 * np.pi * (f0 * tt + f0 * 2.5 * tt * tt / (2 * d / SR))) * np.exp(-tt * 260)
        i = int(t * SR)
        j = min(n, i + d)
        x[i:j] += goutte[: j - i] * (0.3 + r.random())
        t += r.exponential(1 / 220)
    return normaliser_rms(x, 0)


def amb_glouglou(n: int, g: str) -> np.ndarray:
    """Gargouillis (vidange, tuyau qui se vide) : bulles = petits glissandos montants amortis."""
    r = rng(g)
    x = passe_bas(r.standard_normal(n), 300) * 0.25
    t = 0.0
    while t < n / SR:
        d = int((0.03 + 0.05 * r.random()) * SR)
        f0 = 180 + 260 * r.random()
        tt = np.arange(d) / SR
        bulle = np.sin(2 * np.pi * (f0 * tt + (f0 * 1.8) * tt * tt / (2 * d / SR))) * np.exp(-tt * 45)
        i = int(t * SR)
        j = min(n, i + d)
        x[i:j] += bulle[: j - i] * (0.5 + r.random())
        t += 0.04 + 0.12 * r.random()
    return normaliser_rms(x, 0)


def amb_grincement(n: int, g: str) -> np.ndarray:
    """Grincement de porte : frottement « colle-glisse » dont la cadence glisse (130 -> 260 Hz) et qui excite
    les résonances du bois ; irrégulier (accroches) comme une vraie charnière."""
    r = rng(g)
    t = np.arange(n) / SR
    glisse = 130 + 130 * (0.5 - 0.5 * np.cos(np.pi * np.clip(t / max(t[-1], 1e-3), 0, 1)))
    taux = glisse * (1 + 0.08 * passe_bas(r.standard_normal(n), 30) / 0.05) * lfo(n, 4.0, g + "a", 0.15)
    phase = np.cumsum(np.maximum(taux, 20)) / SR
    impulsions = (np.diff(np.floor(phase), prepend=0) > 0).astype(float) * (0.6 + 0.4 * r.random(n))
    x = np.zeros(n)
    for f, a, bw in ((520, 1.0, 90), (1150, 0.7, 140), (2300, 0.35, 220), (3400, 0.2, 300)):
        rr = np.exp(-np.pi * bw / SR)
        x += a * signal.lfilter([1.0 - rr], [1, -2 * rr * np.cos(2 * np.pi * f / SR), rr * rr], impulsions)
    x *= np.clip(lfo(n, 2.3, g + "e", 0.6), 0.2, None)
    return normaliser_rms(passe_bande(x, 250, 5000), 0)


def _turbulence(n: int, g: str) -> np.ndarray:
    """Bruit d'eau turbulente : trois bandes modulées par des enveloppes aléatoires rapides."""
    r = rng(g)
    x = np.zeros(n)
    for f1, f2, a in ((300, 900, 0.6), (900, 2200, 1.0), (2200, 5000, 0.7)):
        env = np.abs(passe_bas(r.standard_normal(n), 35))
        env /= env.std() + 1e-9
        x += a * passe_bande(r.standard_normal(n), f1, f2, 2) * (0.4 + env)
    return normaliser_rms(x, 0)


def amb_eau(n: int, g: str) -> np.ndarray:
    """Filet d'eau qui coule (robinet, seau qu'on vide) : turbulence + gargouillis + bulles aiguës.
    Choisi à l'oreille d'earshot (`earshot rank` : meilleure des 5 variantes pour « water running from a tap »)."""
    return normaliser_rms(_turbulence(n, g) + 0.5 * amb_glouglou(n, g + "g") + 0.4 * _bulles_aigues(n, g + "b"), 0)


AMBIANCES = {"vent": amb_vent, "drone": amb_drone, "coeur": amb_coeur, "ville": amb_ville, "eau": amb_eau, "glouglou": amb_glouglou, "grincement": amb_grincement}


def pas(n: int, temps: list[float], g: str) -> np.ndarray:
    """Pas sourds : bruit filtré grave + petit frottement, légèrement variés."""
    x = np.zeros(n)
    r = rng(g)
    d = int(0.12 * SR)
    env = np.exp(-np.arange(d) / SR * 38)
    for k, t in enumerate(temps):
        i = int(t * SR)
        if i >= n:
            continue
        coup = passe_bas(r.standard_normal(d), 260 + 60 * r.random()) * env
        frot = passe_bande(r.standard_normal(d), 900, 2500) * np.exp(-np.arange(d) / SR * 60) * 0.12
        c = (coup + frot) * (0.8 + 0.4 * r.random())
        j = min(n, i + d)
        x[i:j] += c[: j - i]
    return x


# ---------------- Bruitages earshot ----------------
def sons_autorises() -> dict:
    return json.loads((RACINE / "tools" / "sons_autorises.json").read_text(encoding="utf-8"))


def verifier_son(sid: str, regles: dict) -> None:
    ok = any(sid.startswith(p) for p in regles["prefixes_autorises"]) and not any(m in sid for m in regles["mots_interdits"])
    if not ok:
        sys.exit(f"mix.py : son refusé « {sid} » (pas sombre ; voir tools/sons_autorises.json et qc/lecons.md)")


def rendre_son(sid: str, cache: Path, duree: float | None, pitch: str | None) -> tuple[np.ndarray, float]:
    cle = hashlib.sha1(f"{sid}|{duree}|{pitch}".encode()).hexdigest()[:12]
    wav, meta = cache / f"{cle}.wav", cache / f"{cle}.json"
    if not wav.exists():
        cmd = [str(EARSHOT), "sfx", "render", sid, "-o", str(wav), "--out", str(meta), "--peak", "-1"]
        if duree:
            cmd += ["--dur", str(duree)]
        if pitch:
            cmd += ["--pitch", pitch]
        subprocess.run(cmd, check=True, capture_output=True)
    audio, sr = sf.read(wav, dtype="float64", always_2d=True)
    assert sr == SR
    return audio.mean(axis=1), json.loads(meta.read_text())["meta"]["peak_s"]


# ---------------- Master ----------------
def vrai_pic_db(x: np.ndarray) -> float:
    return db(np.max(np.abs(signal.resample_poly(x, 4, 1, axis=0))))


def limiteur(x: np.ndarray, plafond_db: float) -> np.ndarray:
    """Limiteur à anticipation (5 ms) sur les crêtes réelles (suréchantillonnage ×4)."""
    sur = np.abs(signal.resample_poly(x, 4, 1, axis=0)).max(axis=1)
    crete = sur[: 4 * len(x)].reshape(len(x), 4).max(axis=1)
    g = np.minimum(1.0, gain(plafond_db) / np.maximum(crete, 1e-9))
    g = minimum_filter1d(g, size=2 * int(0.005 * SR) + 1, mode="nearest")  # anticipation
    lisse = signal.lfilter([1 - 0.9993], [1, -0.9993], g)  # relâchement doux
    return x * np.minimum(g, lisse)[:, None]


def enveloppe_db(x: np.ndarray, fenetre: float = 0.05) -> np.ndarray:
    w = int(fenetre * SR)
    e = np.sqrt(np.convolve(x ** 2, np.ones(w) / w, mode="same") + 1e-12)
    return 20 * np.log10(e)


def main() -> None:
    ep = sys.argv[1]
    pub = RACINE / "public" / ep
    tl = json.loads((pub / "timeline.json").read_text(encoding="utf-8"))
    mots = json.loads((pub / "mots.json").read_text(encoding="utf-8"))["mots"]
    n = int(np.ceil(tl["duree"] * SR))
    meter = pyln.Meter(SR)

    # Voix
    voix, sr = sf.read(pub / "voix.wav", dtype="float64", always_2d=True)
    assert sr == SR, "voix.wav doit être en 48 kHz (sortie de couper_blancs.py)"
    voix = voix.mean(axis=1)[:n]
    voix = np.pad(voix, (0, n - len(voix)))
    voix *= gain(VOIX_LUFS - meter.integrated_loudness(voix))

    # Bruitages
    regles = sons_autorises()
    cache = pub / "sons"
    cache.mkdir(exist_ok=True)
    sfx = np.zeros(n)
    for s in tl["sons"]:
        verifier_son(s["id"], regles)
        a, apex = rendre_son(s["id"], cache, s.get("duree"), s.get("pitch"))
        i = int((s["t"] - apex) * SR)  # le moment fort tombe sur l'ancre
        a = a * gain(BASE_SFX_DB + 1 - db(np.max(np.abs(a))) + s.get("gain", 0))
        d0, s0 = max(0, i), max(0, -i)
        j = min(n, i + len(a))
        if j > d0:
            sfx[d0:j] += a[s0 : s0 + (j - d0)]

    # Pas
    sfx += pas(n, [p["t"] for p in tl["pas"]], ep + "pas") * gain(BASE_PAS_DB) / 0.1

    # Ambiances (fondus d'entrée/sortie)
    amb = np.zeros(n)
    for k, a in enumerate(tl["ambiances"]):
        i, j = int(a["de"] * SR), min(n, int(a["a"] * SR))
        if j <= i:
            continue
        f = AMBIANCES[a["type"]]
        x = f(j - i, f"{ep}{a['type']}{k}", a["bpm"]) if a["type"] == "coeur" and a.get("bpm") else f(j - i, f"{ep}{a['type']}{k}")
        x *= gain(BASE_AMB_DB[a["type"]] + a.get("niveau", 0))
        fondu = min(int(a.get("fondu", 1.0) * SR), (j - i) // 2)
        if fondu > 0:
            rampe = np.sin(np.linspace(0, np.pi / 2, fondu)) ** 2
            if i > 0:
                x[:fondu] *= rampe
            x[-fondu:] *= rampe[::-1]
        amb[i:j] += x

    # Ducking : le fond baisse quand la voix parle (attaque 30 ms, relâchement 350 ms)
    env_voix = enveloppe_db(voix, 0.03)
    parle = (env_voix > db(np.sqrt(np.mean(voix ** 2))) - 18).astype(float)
    att, rel = np.exp(-1 / (0.03 * SR)), np.exp(-1 / (0.35 * SR))
    lisse = np.zeros(n)
    v = 0.0
    for k in range(0, n, 48):  # calcul par blocs de 1 ms
        cible = parle[k]
        coef = att if cible > v else rel
        v = cible + (v - cible) * coef ** 48
        lisse[k : k + 48] = v
    fond = (amb * gain(-6 * lisse)) + (sfx * gain(-4 * lisse))

    # Garantie mot par mot : le fond reste ≥ ECART_MIN_DB sous la voix (correction locale avec rampes)
    corrections = []
    correction = np.ones(n)
    for m in mots:
        # Fenêtre élargie de 50 ms (temps d'alignement imprécis) ; correction plafonnée à 20 dB
        i, j = max(0, int((m["debut"] - 0.05) * SR)), min(n, int((m["fin"] + 0.05) * SR))
        if j <= i:
            continue
        lv = db(np.sqrt(np.mean(voix[i:j] ** 2)))
        lf = db(np.sqrt(np.mean(fond[i:j] ** 2)))
        if lv - lf < ECART_MIN_DB:
            baisse = min(20.0, ECART_MIN_DB - (lv - lf) + 1)
            r = int(0.04 * SR)
            a0, b0 = max(0, i - r), min(n, j + r)
            fen = np.ones(b0 - a0)
            fen[: i - a0] = np.linspace(1, gain(-baisse), i - a0) if i > a0 else fen[: i - a0]
            fen[i - a0 : j - a0] = gain(-baisse)
            fen[j - a0 :] = np.linspace(gain(-baisse), 1, b0 - j)
            correction[a0:b0] = np.minimum(correction[a0:b0], fen)
            corrections.append({"mot": m["mot"], "t": m["debut"], "baisse_db": round(baisse, 1)})
    fond *= correction

    # Somme, master −14 LUFS et limiteur true peak (itératif : le limiteur fait perdre un peu de loudness)
    # Léger élargissement des ambiances : canal droit mélangé à une copie retardée de 11 ms
    retard = int(0.011 * SR)
    droite = fond.copy()
    droite[retard:] = 0.5 * fond[retard:] + 0.5 * fond[:-retard]
    stereo_fond = np.stack([fond, droite], axis=1)
    voix_st = np.stack([voix, voix], axis=1)
    g = 1.0
    for _ in range(4):
        mix = limiteur((voix_st + stereo_fond) * g, PLAFOND_TP)
        g *= gain(CIBLE_LUFS - meter.integrated_loudness(mix))
    mix = limiteur((voix_st + stereo_fond) * g, PLAFOND_TP)

    (pub / "stems").mkdir(exist_ok=True)
    sf.write(pub / "mix.wav", mix, SR, subtype="PCM_24")
    sf.write(pub / "stems" / "voix.wav", voix_st * g, SR, subtype="PCM_24")
    sf.write(pub / "stems" / "fond.wav", stereo_fond * g, SR, subtype="PCM_24")
    rapport = {
        "lufs": round(meter.integrated_loudness(mix), 2),
        "true_peak_dbtp": round(vrai_pic_db(mix), 2),
        "corrections_mot_par_mot": corrections,
        "sons": [s["id"] for s in tl["sons"]],
        "pas": len(tl["pas"]),
    }
    (RACINE / "qc" / ep).mkdir(parents=True, exist_ok=True)
    (RACINE / "qc" / ep / "mix.json").write_text(json.dumps(rapport, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Mix : {rapport['lufs']} LUFS, true peak {rapport['true_peak_dbtp']} dBTP, {len(tl['sons'])} bruitages, "
          f"{len(tl['pas'])} pas, {len(tl['ambiances'])} ambiances, {len(corrections)} mot(s) protégé(s) -> public/{ep}/mix.wav")


if __name__ == "__main__":
    main()
