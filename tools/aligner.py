"""Alignement mot à mot d'une voix off française avec Vosk (jamais Whisper).

Usage :
  .venv/bin/python tools/aligner.py public/NNN-nom/voix.wav --script videos/NNN-nom/script.txt \
      -o public/NNN-nom/mots.json

Vosk reconnaît la voix (avec ses fautes) ; on aligne ensuite **caractère par caractère** le texte reconnu
sur le texte exact du script (comparaison sans accents ni ponctuation, chiffres lus en lettres). Chaque mot
du script reçoit ainsi ses temps, même si Vosk l'a mal écrit. Les mots introuvables sont interpolés.
Sortie : {"fps", "duree", "phrases": [...], "mots": [...]} (voir src/systeme/mots.ts).
"""
import argparse
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np
from vosk import KaldiRecognizer, Model, SetLogLevel

sys.path.insert(0, str(Path(__file__).resolve().parent))
from script_format import forme_parlee, lire_script  # noqa: E402

RACINE = Path(__file__).resolve().parent.parent
MODELE = RACINE / "tools" / "models" / "vosk-model-small-fr-0.22"
_modele = None


def reconnaitre(chemin: Path) -> tuple[list[dict], float]:
    """Mots reconnus par Vosk : [{"word", "start", "end", "conf"}], durée du fichier."""
    global _modele
    SetLogLevel(-1)
    if _modele is None:
        _modele = Model(str(MODELE))
    with tempfile.TemporaryDirectory() as d:
        tmp = Path(d) / "x.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(chemin), "-ac", "1", "-ar", "16000",
                        "-sample_fmt", "s16", tmp], check=True)
        # fichier fermé avant la suppression du dossier temporaire (sinon Windows refuse de l'effacer)
        with wave.open(str(tmp), "rb") as wf:
            duree = wf.getnframes() / wf.getframerate()
            rec = KaldiRecognizer(_modele, wf.getframerate())
            rec.SetWords(True)
            resultats = []
            while data := wf.readframes(4000):
                if rec.AcceptWaveform(data):
                    resultats.append(json.loads(rec.Result()))
            resultats.append(json.loads(rec.FinalResult()))
    return [w for r in resultats for w in r.get("result", [])], duree


def aligner_caracteres(a: str, b: str) -> list[tuple[int, int]]:
    """Alignement d'édition (Levenshtein) entre deux chaînes ; renvoie les paires (i, j) de la diagonale.
    Chaque ligne de la matrice est calculée en numpy (min cumulé pour la dépendance gauche)."""
    n, m = len(a), len(b)
    A = np.frombuffer(a.encode("ascii"), dtype=np.uint8)
    B = np.frombuffer(b.encode("ascii"), dtype=np.uint8)
    D = np.zeros((n + 1, m + 1), dtype=np.int32)
    D[0] = np.arange(m + 1)
    j = np.arange(m + 1)
    for i in range(1, n + 1):
        cout = (B != A[i - 1]).astype(np.int32)
        tmp = np.empty(m + 1, dtype=np.int32)
        tmp[0] = i
        tmp[1:] = np.minimum(D[i - 1, :-1] + cout, D[i - 1, 1:] + 1)
        D[i] = np.minimum.accumulate(tmp - j) + j
    paires, i, k = [], n, m
    while i > 0 and k > 0:
        diag = D[i - 1, k - 1] + (a[i - 1] != b[k - 1])
        if D[i, k] == diag:
            paires.append((i - 1, k - 1))
            i, k = i - 1, k - 1
        elif D[i, k] == D[i - 1, k] + 1:
            i -= 1
        else:
            k -= 1
    return paires[::-1]


def aligner(voix: Path, script_txt: str, fps: int = 30) -> dict:
    phrases = lire_script(script_txt)
    mots = [m for p in phrases for m in p.mots]
    reconnus, duree = reconnaitre(voix)

    # Chaînes de caractères + correspondance caractère -> mot
    s_chars, s_mot = [], []
    for i, m in enumerate(mots):
        s_chars.append(m.parle)
        s_mot += [i] * len(m.parle)
    r_chars, r_info = [], []
    for k, w in enumerate(reconnus):
        p = forme_parlee(w["word"])
        r_chars.append(p)
        r_info += [(k, o, len(p)) for o in range(len(p))]
    S, R = "".join(s_chars), "".join(r_chars)

    def temps(j: int, fin: bool) -> float:
        k, o, L = r_info[j]
        w = reconnus[k]
        return w["start"] + (o + (1 if fin else 0)) / L * (w["end"] - w["start"])

    debuts, fins = [None] * len(mots), [None] * len(mots)
    egaux, confs = [0] * len(mots), [[] for _ in mots]
    for i, j in (aligner_caracteres(S, R) if S and R else []):
        w = s_mot[i]
        t0, t1 = temps(j, False), temps(j, True)
        debuts[w] = t0 if debuts[w] is None else min(debuts[w], t0)
        fins[w] = t1 if fins[w] is None else max(fins[w], t1)
        if S[i] == R[j]:
            egaux[w] += 1
            confs[w].append(reconnus[r_info[j][0]].get("conf", 1.0))

    sortie = []
    for i, m in enumerate(mots):
        fiable = debuts[i] is not None and egaux[i] >= max(1, 0.5 * len(m.parle))
        sortie.append({
            "mot": m.affiche, "phrase": m.phrase, "style": m.style,
            "debut": debuts[i] if fiable else None, "fin": fins[i] if fiable else None,
            "conf": round(float(np.mean(confs[i])) * egaux[i] / len(m.parle), 2) if fiable else 0.0,
            "source": "vosk" if fiable else "interpole",
        })

    # Interpolation des mots non retrouvés, au prorata de leur longueur
    i = 0
    while i < len(sortie):
        if sortie[i]["debut"] is not None:
            i += 1
            continue
        j = i
        while j < len(sortie) and sortie[j]["debut"] is None:
            j += 1
        t0 = sortie[i - 1]["fin"] if i > 0 else 0.0
        t1 = sortie[j]["debut"] if j < len(sortie) else min(duree, t0 + 0.35 * (j - i))
        longueurs = [len(mots[k].parle) for k in range(i, j)]
        total, cumul = sum(longueurs), 0
        for k in range(i, j):
            sortie[k]["debut"] = t0 + (t1 - t0) * cumul / total
            cumul += longueurs[k - i]
            sortie[k]["fin"] = t0 + (t1 - t0) * cumul / total
        i = j

    # Monotonie et durée minimale, puis images
    for k, w in enumerate(sortie):
        if k and w["debut"] < sortie[k - 1]["fin"]:
            w["debut"] = sortie[k - 1]["fin"]
        w["fin"] = max(w["fin"], w["debut"] + 0.05)
        w["debut"], w["fin"] = round(w["debut"], 3), round(w["fin"], 3)
        w["fDebut"] = round(w["debut"] * fps)
        w["fFin"] = max(w["fDebut"] + 1, round(w["fin"] * fps))

    sortie_phrases = []
    for p in phrases:
        idx = [k for k, w in enumerate(sortie) if w["phrase"] == p.index]
        a, b = sortie[idx[0]], sortie[idx[-1]]
        sortie_phrases.append({"id": p.id, "index": p.index, "chute": p.chute, "voix": p.voix, "texte": p.texte,
                               "debut": a["debut"], "fin": b["fin"], "fDebut": a["fDebut"], "fFin": b["fFin"],
                               "premierMot": idx[0], "dernierMot": idx[-1]})
    return {"fps": fps, "duree": round(duree, 3), "phrases": sortie_phrases, "mots": sortie}


def resume(a: dict) -> str:
    mots = a["mots"]
    interp = sum(m["source"] == "interpole" for m in mots)
    faibles = sum(m["conf"] < 0.6 for m in mots)
    txt = (f"{len(mots)} mots / {len(a['phrases'])} phrases alignés sur {a['duree']:.2f} s ; "
           f"{interp} interpolés, {faibles} peu sûrs (conf < 0.6)")
    if interp > 0.15 * len(mots):
        txt += "\nATTENTION : plus de 15 % de mots interpolés, vérifier la voix ou le script."
    return txt


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("voix", type=Path)
    ap.add_argument("--script", type=Path, required=True)
    ap.add_argument("-o", "--sortie", type=Path, required=True)
    ap.add_argument("--fps", type=int, default=30)
    a = ap.parse_args()
    res = aligner(a.voix, a.script.read_text(encoding="utf-8"), a.fps)
    a.sortie.parent.mkdir(parents=True, exist_ok=True)
    a.sortie.write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
    print(resume(res))


if __name__ == "__main__":
    main()
