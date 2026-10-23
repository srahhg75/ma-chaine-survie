"""Alignement mot à mot d'une voix off française avec Vosk (jamais Whisper).

Usage :
  .venv/bin/python tools/aligner.py videos/NNN-nom/voix.wav --script videos/NNN-nom/script.txt \
      -o public/NNN-nom/mots.json

Avec --script, l'orthographe des sous-titres vient du script (Vosk se trompe parfois sur
l'écriture) et seuls les temps viennent de Vosk ; les mots que Vosk n'a pas reconnus
reçoivent un temps interpolé entre leurs voisins (marqués "source": "interpole").
Sortie : {"fps": 30, "duree": s, "mots": [{"mot", "debut", "fin", "fDebut", "fFin", "conf", "source"}]}
"""
import argparse
import difflib
import json
import re
import subprocess
import tempfile
import unicodedata
import wave
from pathlib import Path

from vosk import KaldiRecognizer, Model, SetLogLevel

RACINE = Path(__file__).resolve().parent.parent
MODELE = RACINE / "tools" / "models" / "vosk-model-small-fr-0.22"


def normaliser(m: str) -> str:
    m = unicodedata.normalize("NFD", m.lower())
    m = "".join(c for c in m if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", m)


def mots_du_script(texte: str) -> list[str]:
    # Retire les lignes de commentaire (# ...) et les indications [entre crochets]
    texte = "\n".join(l for l in texte.splitlines() if not l.lstrip().startswith("#"))
    texte = re.sub(r"\[[^\]]*\]", " ", texte)
    # Coupe aussi sur les apostrophes/traits d'union : Vosk renvoie "l'eau" mais "peut-être" en deux mots
    # Typographie française : « matin ? » -> le « ? » reste collé au mot par une espace insécable
    texte = re.sub(r"\s+([?!:;»…])", "\u00a0\\1", texte)
    texte = re.sub(r"«\s+", "«\u00a0", texte)
    return [m for m in re.findall(r"(?:«\u00a0)?[\w’'\-]+(?:\u00a0?[.,!?…:;»])*", texte) if normaliser(m)]


def reconnaitre(chemin: Path) -> tuple[list[dict], float]:
    SetLogLevel(-1)
    with tempfile.TemporaryDirectory() as d:
        tmp = Path(d) / "x.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(chemin), "-ac", "1", "-ar", "16000",
                        "-sample_fmt", "s16", tmp], check=True)
        wf = wave.open(str(tmp), "rb")
        duree = wf.getnframes() / wf.getframerate()
        rec = KaldiRecognizer(Model(str(MODELE)), wf.getframerate())
        rec.SetWords(True)
        resultats = []
        while True:
            data = wf.readframes(4000)
            if not data:
                break
            if rec.AcceptWaveform(data):
                resultats.append(json.loads(rec.Result()))
        resultats.append(json.loads(rec.FinalResult()))
    mots = [w for r in resultats for w in r.get("result", [])]
    return mots, duree


def caler_sur_script(reconnus: list[dict], script: list[str]) -> list[dict]:
    # Comparaison sur des formes "à plat" ; les mots du script avec apostrophe sont découpés
    # en sous-unités pour suivre le découpage de Vosk, puis regroupés.
    unites, proprio = [], []
    for i, m in enumerate(script):
        for part in re.split(r"[’'\-]", m):
            if normaliser(part):
                unites.append(normaliser(part))
                proprio.append(i)
    # Vosk peut garder l'apostrophe collée ("l'eau") : on la découpe pareil
    reco_unites, reco_idx = [], []
    for j, w in enumerate(reconnus):
        for part in re.split(r"[’'\-]", w["word"]):
            if normaliser(part):
                reco_unites.append(normaliser(part))
                reco_idx.append(j)

    temps: dict[int, list[tuple[float, float, float]]] = {}
    sm = difflib.SequenceMatcher(a=unites, b=reco_unites, autojunk=False)
    for op, a0, a1, b0, b1 in sm.get_opcodes():
        if op == "equal" or (op == "replace" and a1 - a0 == b1 - b0):
            for k in range(a1 - a0):
                w = reconnus[reco_idx[b0 + k]]
                temps.setdefault(proprio[a0 + k], []).append((w["start"], w["end"], w.get("conf", 1.0)))

    sortie = []
    for i, m in enumerate(script):
        if i in temps:
            t = temps[i]
            sortie.append({"mot": m, "debut": min(x[0] for x in t), "fin": max(x[1] for x in t),
                           "conf": round(min(x[2] for x in t), 2), "source": "vosk"})
        else:
            sortie.append({"mot": m, "debut": None, "fin": None, "conf": 0.0, "source": "interpole"})

    # Interpolation des trous entre voisins connus
    i = 0
    while i < len(sortie):
        if sortie[i]["debut"] is None:
            j = i
            while j < len(sortie) and sortie[j]["debut"] is None:
                j += 1
            t0 = sortie[i - 1]["fin"] if i > 0 else 0.0
            t1 = sortie[j]["debut"] if j < len(sortie) else t0 + 0.3 * (j - i)
            pas = (t1 - t0) / (j - i)
            for k in range(i, j):
                sortie[k]["debut"] = round(t0 + pas * (k - i), 3)
                sortie[k]["fin"] = round(t0 + pas * (k - i + 1), 3)
            i = j
        else:
            i += 1
    return sortie


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("voix", type=Path)
    ap.add_argument("--script", type=Path)
    ap.add_argument("-o", "--sortie", type=Path, required=True)
    ap.add_argument("--fps", type=int, default=30)
    a = ap.parse_args()

    reconnus, duree = reconnaitre(a.voix)
    if a.script:
        mots = caler_sur_script(reconnus, mots_du_script(a.script.read_text(encoding="utf-8")))
    else:
        mots = [{"mot": w["word"], "debut": w["start"], "fin": w["end"], "conf": round(w.get("conf", 1.0), 2),
                 "source": "vosk"} for w in reconnus]
    for m in mots:
        m["fDebut"] = round(m["debut"] * a.fps)
        m["fFin"] = max(m["fDebut"] + 1, round(m["fin"] * a.fps))

    a.sortie.parent.mkdir(parents=True, exist_ok=True)
    a.sortie.write_text(json.dumps({"fps": a.fps, "duree": round(duree, 3), "mots": mots}, ensure_ascii=False,
                                   indent=1), encoding="utf-8")
    interp = sum(m["source"] == "interpole" for m in mots)
    faibles = sum(m["conf"] < 0.6 for m in mots)
    print(f"{len(mots)} mots alignés sur {duree:.2f} s ; {interp} interpolés, {faibles} peu sûrs (conf < 0.6)")
    if a.script and interp > 0.15 * len(mots):
        print("ATTENTION : plus de 15 % de mots interpolés, vérifier la voix ou le script.")


if __name__ == "__main__":
    main()
