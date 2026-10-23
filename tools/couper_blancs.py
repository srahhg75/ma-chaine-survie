"""Raccourcit les blancs trop longs d'une voix off (sans toucher aux mots).

Usage :
  .venv/bin/python tools/couper_blancs.py videos/NNN-nom/voix_brute.wav videos/NNN-nom/voix.wav
Options : --blanc-max 0.35 (s, au-delà on coupe)  --blanc-garde 0.18 (s, durée gardée)
          --seuil -42 (dBFS, en dessous = silence)

Écrit aussi <sortie>.coupes.json : la liste des coupes (utile pour déboguer).
"""
import argparse
import json
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

SR = 48000


def charger(chemin: Path) -> np.ndarray:
    # Passe par FFmpeg : accepte mp3/wav/m4a, sort du 48 kHz mono.
    with tempfile.TemporaryDirectory() as d:
        tmp = Path(d) / "x.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(chemin), "-ac", "1", "-ar", str(SR), tmp], check=True)
        audio, _ = sf.read(tmp, dtype="float32")
    return audio


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("entree", type=Path)
    ap.add_argument("sortie", type=Path)
    ap.add_argument("--blanc-max", type=float, default=0.35)
    ap.add_argument("--blanc-garde", type=float, default=0.18)
    ap.add_argument("--seuil", type=float, default=-42.0)
    a = ap.parse_args()

    audio = charger(a.entree)
    pas = SR // 100  # trames de 10 ms
    n = len(audio) // pas
    rms = np.sqrt(np.mean(audio[: n * pas].reshape(n, pas) ** 2, axis=1) + 1e-12)
    silence = 20 * np.log10(rms) < a.seuil

    # Plages de silence [debut, fin) en trames
    plages, i = [], 0
    while i < n:
        if silence[i]:
            j = i
            while j < n and silence[j]:
                j += 1
            plages.append((i, j))
            i = j
        else:
            i += 1

    garde = int(a.blanc_garde * 100)
    fondu = int(0.01 * SR)
    morceaux, coupes, curseur = [], [], 0
    for d, f in plages:
        debut_fichier, fin_fichier = d == 0, f == n
        if debut_fichier or fin_fichier:
            # Début/fin : on ne garde que 50 ms de marge
            keep = 5
        elif (f - d) / 100 > a.blanc_max:
            keep = garde
        else:
            continue
        # On garde la moitié du blanc de chaque côté pour ne pas rogner les attaques/fins de mots
        cut_d = d + (0 if debut_fichier else keep // 2)
        cut_f = f - (0 if fin_fichier else keep - keep // 2)
        if debut_fichier:
            cut_f = f - keep
        if fin_fichier:
            cut_d = d + keep
        if cut_f <= cut_d:
            continue
        morceaux.append(audio[curseur : cut_d * pas])
        coupes.append({"de": round(cut_d / 100, 2), "a": round(cut_f / 100, 2)})
        curseur = cut_f * pas
    morceaux.append(audio[curseur:])

    # Assemblage avec micro-fondus (10 ms) pour éviter les clics
    sortie = morceaux[0]
    for m in morceaux[1:]:
        if len(sortie) > fondu and len(m) > fondu:
            rampe = np.linspace(0, 1, fondu, dtype=np.float32)
            croise = sortie[-fondu:] * (1 - rampe) + m[:fondu] * rampe
            sortie = np.concatenate([sortie[:-fondu], croise, m[fondu:]])
        else:
            sortie = np.concatenate([sortie, m])

    a.sortie.parent.mkdir(parents=True, exist_ok=True)
    sf.write(a.sortie, sortie, SR, subtype="PCM_24")
    a.sortie.with_suffix(".coupes.json").write_text(json.dumps(coupes, indent=1), encoding="utf-8")
    avant, apres = len(audio) / SR, len(sortie) / SR
    print(f"Blancs coupés : {len(coupes)} coupes, {avant:.2f} s -> {apres:.2f} s ({avant - apres:.2f} s gagnées)")


if __name__ == "__main__":
    main()
