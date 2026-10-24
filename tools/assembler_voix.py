"""Assemble les voix d'un épisode dialogué (un fichier par personnage) dans l'ordre du script.

Usage :
  .venv/bin/python tools/assembler_voix.py videos/NNN-nom/script.txt -o videos/NNN-nom/voix_brute.wav

Dans script.txt, `[Prénom]` en tête de phrase = réplique de ce personnage (sinon narrateur). Chaque voix est lue
dans `videos/NNN-nom/<voix>.mp3|wav|m4a` (nom sans accents ni majuscules : narrateur, ines, morel…).
Pour chaque voix : alignement Vosk sur ses seules phrases, découpe de chaque phrase au point le plus calme
avant/après (jamais dans un mot), niveau ramené à celui du narrateur (RMS de la parole), puis assemblage dans
l'ordre du script avec 0,25 s de silence entre deux phrases. `tools/couper_blancs.py` règle ensuite les pauses.
Sortie aussi : `<sortie>.segments.json` (d'où vient chaque phrase).
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent))
from aligner import aligner, reconnaitre, resume  # noqa: E402
from couper_blancs import SR, FONDU, charger, point_calme  # noqa: E402
from script_format import lire_script, sans_accents  # noqa: E402

ECART = 0.25


def fichier_voix(dossier: Path, voix: str) -> Path:
    nom = sans_accents(voix).lower()
    for ext in (".wav", ".mp3", ".m4a"):
        if (f := dossier / f"{nom}{ext}").exists():
            return f
    sys.exit(f"Voix « {voix} » introuvable : déposer {dossier / (nom + '.mp3')}")


def rms_parole(audio: np.ndarray) -> float:
    w = int(0.05 * SR)
    blocs = audio[: len(audio) // w * w].reshape(-1, w)
    e = np.sqrt(np.mean(blocs ** 2, axis=1))
    return float(np.sqrt(np.mean(e[e > np.percentile(e, 60)] ** 2)) + 1e-9)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("script", type=Path)
    ap.add_argument("-o", "--sortie", type=Path, required=True)
    a = ap.parse_args()
    lignes = a.script.read_text(encoding="utf-8").splitlines()
    phrases = lire_script("\n".join(lignes))
    # lignes de script (non vides, non commentaires) dans le même ordre que les phrases
    lignes_ph = [l for l in lignes if l.strip() and not l.strip().startswith("#")]
    voix = list(dict.fromkeys(p.voix for p in phrases))

    morceaux: dict[int, np.ndarray] = {}
    segments = []
    ref = None
    for v in voix:
        f = fichier_voix(a.script.parent, v)
        idx = [p.index for p in phrases if p.voix == v]
        sous_script = "\n".join(lignes_ph[i] for i in idx)
        reconnus, _ = reconnaitre(f)
        print(f"\n[{v}] {f.name} — entendu par Vosk :\n  " + " ".join(w["word"] for w in reconnus))
        al = aligner(f, sous_script)
        print("  " + resume(al).replace("\n", "\n  "))
        audio = charger(f)
        niveau = rms_parole(audio)
        ref = ref or niveau  # le narrateur (1re voix du script) sert de référence
        gain = ref / niveau
        ph = al["phrases"]
        for k, p in enumerate(ph):
            avant = ph[k - 1]["fin"] if k else 0.0
            apres = ph[k + 1]["debut"] if k + 1 < len(ph) else len(audio) / SR
            d = point_calme(audio, max(avant + 0.04, p["debut"] - 0.35), p["debut"] - 0.03) if p["debut"] - avant > 0.1 else p["debut"] - 0.02
            fn = point_calme(audio, p["fin"] + 0.03, min(apres - 0.04, p["fin"] + 0.35)) if apres - p["fin"] > 0.1 else p["fin"] + 0.02
            seg = audio[int(max(d, 0) * SR):int(fn * SR)] * gain
            rampe = np.linspace(0, 1, min(FONDU, len(seg) // 2), dtype=np.float32)
            seg[: len(rampe)] *= rampe
            seg[len(seg) - len(rampe):] *= rampe[::-1]
            morceaux[idx[k]] = seg
            segments.append({"phrase": idx[k], "id": phrases[idx[k]].id, "voix": v, "fichier": f.name,
                             "de": round(d, 3), "a": round(fn, 3), "gain_db": round(20 * np.log10(gain), 1)})

    silence = np.zeros(int(ECART * SR), dtype=np.float32)
    sortie = np.concatenate([x for i in range(len(phrases)) for x in (morceaux[i], silence)])
    crete = np.max(np.abs(sortie))
    if crete > 0.98:
        sortie *= 0.98 / crete
    a.sortie.parent.mkdir(parents=True, exist_ok=True)
    sf.write(a.sortie, sortie, SR, subtype="PCM_24")
    segments.sort(key=lambda s: s["phrase"])
    a.sortie.with_suffix(".segments.json").write_text(json.dumps(segments, ensure_ascii=False, indent=1),
                                                      encoding="utf-8")
    print(f"\nAssemblé : {len(phrases)} phrases, {len(voix)} voix, {len(sortie) / SR:.2f} s -> {a.sortie}")


if __name__ == "__main__":
    main()
