"""Contrôle qualité du son d'un épisode (règles de qc/lecons.md).

Usage : .venv/bin/python tools/qc_audio.py 000-demo      (code de sortie 1 s'il reste une erreur)
Vérifie, à partir des pistes séparées écrites par tools/mix.py :
  - mot par mot : la voix est au moins 10 dB au-dessus du fond (mesure pondérée K, comme la loudness) ;
  - master : −14 LUFS (±1) et true peak < −1 dBTP.
Rapport : qc/<id>/rapport_audio.md
"""
import json
import sys
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy import signal

RACINE = Path(__file__).resolve().parent.parent
ECART_MIN = 10.0


def ponderation_k(x: np.ndarray, sr: int) -> np.ndarray:
    m = pyln.Meter(sr)
    for f in m._filters.values():  # filtres de pondération K de la norme BS.1770
        x = f.apply_filter(x)
    return x


def main() -> None:
    ep = sys.argv[1]
    pub = RACINE / "public" / ep
    voix, sr = sf.read(pub / "stems" / "voix.wav", always_2d=True)
    fond, _ = sf.read(pub / "stems" / "fond.wav", always_2d=True)
    mix, _ = sf.read(pub / "mix.wav", always_2d=True)
    mots = json.loads((pub / "mots.json").read_text(encoding="utf-8"))["mots"]
    vk, fk = ponderation_k(voix.mean(axis=1), sr), ponderation_k(fond.mean(axis=1), sr)

    erreurs, avert, ecarts = [], [], []
    for m in mots:
        i, j = int(m["debut"] * sr), int(m["fin"] * sr)
        if j - i < int(0.03 * sr):
            continue
        lv = 10 * np.log10(np.mean(vk[i:j] ** 2) + 1e-20)
        lf = 10 * np.log10(np.mean(fk[i:j] ** 2) + 1e-20)
        if lv < -60:  # mot sans voix à cet endroit : temps d'alignement douteux
            avert.append(f"« {m['mot']} » à {m['debut']:.2f} s : pas de voix mesurée (alignement à vérifier)")
            continue
        ecarts.append(lv - lf)
        if lv - lf < ECART_MIN:
            erreurs.append(f"« {m['mot']} » à {m['debut']:.2f} s : voix seulement {lv - lf:.1f} dB au-dessus du fond (min {ECART_MIN:.0f})")

    lufs = pyln.Meter(sr).integrated_loudness(mix)
    tp = 20 * np.log10(np.max(np.abs(signal.resample_poly(mix, 4, 1, axis=0))) + 1e-12)
    if abs(lufs + 14) > 1:
        erreurs.append(f"Master à {lufs:.1f} LUFS (cible −14 ±1)")
    if tp >= -1:
        erreurs.append(f"True peak {tp:.2f} dBTP (doit rester < −1)")

    resume = (f"Master {lufs:.2f} LUFS, true peak {tp:.2f} dBTP ; écart voix/fond par mot : "
              f"min {min(ecarts):.1f} dB, médian {np.median(ecarts):.1f} dB ({len(ecarts)} mots)")
    rapport = "\n".join([f"# Contrôle audio — {ep}", "", resume, "", "## Erreurs", *(f"- {e}" for e in erreurs or ["Aucune."]),
                         "", "## Avertissements", *(f"- {a}" for a in avert or ["Aucun."]), ""])
    (RACINE / "qc" / ep).mkdir(parents=True, exist_ok=True)
    (RACINE / "qc" / ep / "rapport_audio.md").write_text(rapport, encoding="utf-8")
    print(rapport)
    sys.exit(1 if erreurs else 0)


if __name__ == "__main__":
    main()
