"""Vérifie le son d'un fichier vidéo final : −14 LUFS (±1) et true peak < −1 dBTP. Code de sortie 1 sinon.
Usage : .venv/bin/python tools/verifier_master.py videos/NNN-nom/final.mp4
"""
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy import signal

with tempfile.TemporaryDirectory() as d:
    wav = Path(d) / "a.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", sys.argv[1], "-vn", "-ar", "48000", "-c:a", "pcm_f32le", wav], check=True)
    audio, sr = sf.read(wav, always_2d=True)
lufs = pyln.Meter(sr).integrated_loudness(audio)
tp = 20 * np.log10(np.max(np.abs(signal.resample_poly(audio, 4, 1, axis=0))) + 1e-12)
ok = abs(lufs + 14) <= 1 and tp < -1
print(f"Master final : {lufs:.2f} LUFS, true peak {tp:.2f} dBTP -> {'OK' if ok else 'HORS CIBLE (−14 LUFS ±1, TP < −1)'}")
sys.exit(0 if ok else 1)
