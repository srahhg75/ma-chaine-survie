"""Voix provisoire (synthèse MBROLA/espeak-ng) pour monter un épisode avant la vraie voix.
Usage : .venv/bin/python tools/voix_provisoire.py videos/NNN-nom/script.txt videos/NNN-nom/voix_brute.wav
Ne jamais publier une vidéo avec cette voix : elle sert aux brouillons et aux tests.
"""
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from script_format import lire_script, texte_a_lire  # noqa: E402

script, sortie = Path(sys.argv[1]), Path(sys.argv[2])
texte = texte_a_lire(lire_script(script.read_text(encoding="utf-8")))
sortie.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(["espeak-ng", "-v", "mb-fr1", "-s", "165", "-p", "35", "-w", str(sortie)], input=texte.encode("utf-8"), check=True)
print("Voix provisoire :", sortie)
