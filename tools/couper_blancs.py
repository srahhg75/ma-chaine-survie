"""Règle les silences d'une voix off, sans jamais couper dans un mot, puis réaligne.

Usage :
  .venv/bin/python tools/couper_blancs.py videos/NNN-nom/voix_brute.wav --script videos/NNN-nom/script.txt \
      -o public/NNN-nom/voix.wav --mots public/NNN-nom/mots.json

Cibles (entre deux mots, seulement si l'écart est une vraie pause ≥ 0,1 s) :
  - après une virgule / deux-points / point-virgule : 0,18 s
  - fin de phrase (. ? ! …) ou changement de ligne du script : 0,30 s
  - hésitation au milieu d'une phrase (> 0,25 s) : 0,15 s
  - juste avant une phrase-chute (« > » dans le script) : 0,60 s (on ajoute du silence si besoin)
Chaque raccord a un fondu enchaîné de 12 ms ; une coupe n'est faite que dans un trou de parole confirmé
(au moins 40 ms de marge autour de chaque mot reconnu, énergie basse). Ensuite : réalignement -> mots.json.
"""
import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent))
from aligner import aligner, resume  # noqa: E402

SR = 48000
FONDU = int(0.012 * SR)
MARGE = 0.04
PAUSE_MIN = 0.10


def charger(chemin: Path) -> np.ndarray:
    with tempfile.TemporaryDirectory() as d:
        tmp = Path(d) / "x.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(chemin), "-ac", "1", "-ar", str(SR), tmp], check=True)
        audio, _ = sf.read(tmp, dtype="float32")
    return audio


def cible(mot_a: dict, mot_b: dict, phrases: list[dict]) -> float | None:
    if mot_b["phrase"] != mot_a["phrase"] and phrases[mot_b["phrase"]]["chute"]:
        return 0.60
    fin = mot_a["mot"].rstrip("»  ")
    if mot_b["phrase"] != mot_a["phrase"] or fin.endswith((".", "?", "!", "…")):
        return 0.30
    if fin.endswith((",", ":", ";")):
        return 0.18
    return 0.15 if mot_b["debut"] - mot_a["fin"] > 0.25 else None


def point_calme(audio: np.ndarray, t0: float, t1: float) -> float:
    """Instant le plus calme (fenêtre de 20 ms) entre t0 et t1."""
    a, b = int(t0 * SR), int(t1 * SR)
    seg = audio[a:b]
    w = int(0.02 * SR)
    if len(seg) <= w:
        return (t0 + t1) / 2
    e = np.convolve(seg ** 2, np.ones(w) / w, mode="valid")
    return t0 + (int(np.argmin(e)) + w / 2) / SR


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("entree", type=Path)
    ap.add_argument("--script", type=Path, required=True)
    ap.add_argument("-o", "--sortie", type=Path, required=True)
    ap.add_argument("--mots", type=Path, help="écrit le réalignement de la voix coupée (mots.json)")
    ap.add_argument("--fps", type=int, default=30)
    a = ap.parse_args()
    script = a.script.read_text(encoding="utf-8")

    audio = charger(a.entree)
    al = aligner(a.entree, script, a.fps)
    mots, phrases = al["mots"], al["phrases"]
    seuil = 10 ** ((20 * np.log10(np.sqrt(np.mean(audio ** 2)) + 1e-9) - 30) / 20)  # 30 dB sous le niveau moyen

    # Éditions : ("couper", debut, fin) ou ("inserer", instant, duree)
    editions = []
    # Début : 50 ms avant le premier mot ; fin : 250 ms après le dernier
    if mots[0]["debut"] > 0.05 + MARGE:
        editions.append(("couper", 0.0, mots[0]["debut"] - 0.05))
    for ma, mb in zip(mots, mots[1:]):
        if ma["source"] == "interpole" or mb["source"] == "interpole":
            # Temps incertains : on ne coupe rien. Seule exception : la pause avant une chute, insérée au point
            # le plus calme juste avant le 1er mot de la chute (s'il est fiable et si l'endroit est silencieux).
            if mb["source"] == "vosk" and mb["phrase"] != ma["phrase"] and phrases[mb["phrase"]]["chute"]:
                p = point_calme(audio, max(0.0, mb["debut"] - 0.25), mb["debut"] - 0.01)
                fen = audio[int((p - 0.01) * SR):int((p + 0.01) * SR)]
                if len(fen) and np.sqrt(np.mean(fen ** 2)) < seuil * 3:
                    editions.append(("inserer", p, 0.6 - max(0.0, mb["debut"] - p)))
            continue
        ecart = mb["debut"] - ma["fin"]
        c = cible(ma, mb, phrases)
        if c is None or (ecart < PAUSE_MIN and c < 0.6) or abs(ecart - c) < 0.03:
            continue
        z0, z1 = ma["fin"] + MARGE, mb["debut"] - MARGE
        if z1 <= z0:
            if c > ecart:  # pause trop courte avant une chute : insertion entre les deux mots
                editions.append(("inserer", (ma["fin"] + mb["debut"]) / 2, c - ecart))
            continue
        centre = point_calme(audio, z0, z1)
        if c > ecart:
            editions.append(("inserer", centre, c - ecart))
        else:
            enlever = min(ecart - c, z1 - z0)
            d0 = min(max(centre - enlever / 2, z0), z1 - enlever)
            seg = audio[int(d0 * SR):int((d0 + enlever) * SR)]
            if len(seg) and np.sqrt(np.mean(seg ** 2)) < seuil * 3:
                editions.append(("couper", d0, d0 + enlever))
    fin_parole = mots[-1]["fin"] + 0.25
    if len(audio) / SR > fin_parole + MARGE:
        editions.append(("couper", fin_parole, len(audio) / SR))

    # Garde-fou : aucune coupe ne touche un mot
    for e in editions:
        if e[0] == "couper":
            for m in mots:
                assert not (e[1] < m["fin"] and e[2] > m["debut"]), f"coupe dans le mot {m['mot']!r}"

    # Application avec fondus enchaînés
    rampe = np.linspace(0, 1, FONDU, dtype=np.float32)
    morceaux, curseur = [], 0
    for e in sorted(editions, key=lambda e: e[1]):
        if e[0] == "couper":
            s, f = int(e[1] * SR), int(e[2] * SR)
            morceaux.append(audio[curseur:s])
            curseur = f
        else:
            p = int(e[1] * SR)
            morceaux.append(audio[curseur:p])
            morceaux.append(np.zeros(int(e[2] * SR), dtype=np.float32))
            curseur = p
    morceaux.append(audio[curseur:])
    sortie = morceaux[0]
    for m in morceaux[1:]:
        if len(sortie) > FONDU and len(m) > FONDU:
            croise = sortie[-FONDU:] * (1 - rampe) + m[:FONDU] * rampe
            sortie = np.concatenate([sortie[:-FONDU], croise, m[FONDU:]])
        else:
            sortie = np.concatenate([sortie, m])

    a.sortie.parent.mkdir(parents=True, exist_ok=True)
    sf.write(a.sortie, sortie, SR, subtype="PCM_24")
    a.sortie.with_suffix(".coupes.json").write_text(json.dumps(
        [{"type": e[0], "a": round(e[1], 3), "b": round(e[2], 3)} for e in editions], indent=1), encoding="utf-8")
    nb_c = sum(e[0] == "couper" for e in editions)
    nb_i = len(editions) - nb_c
    print(f"Blancs : {nb_c} coupes, {nb_i} ajouts ; {len(audio) / SR:.2f} s -> {len(sortie) / SR:.2f} s")

    if a.mots:
        res = aligner(a.sortie, script, a.fps)
        a.mots.parent.mkdir(parents=True, exist_ok=True)
        a.mots.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
        print("Réalignement :", resume(res))


if __name__ == "__main__":
    main()
