"""Analyse d'une vidéo de référence (étude uniquement : on ne réutilise jamais images, voix ni texte).

Usage : .venv/bin/python tools/analyser_reference.py reference/<chaine>/<fichier>.mp4
Écrit à côté de la vidéo :
  <nom>.ocr.tsv     sous-titres incrustés lus par OCR (début, fin, texte), 6 lectures/s
  <nom>.vosk.json   mots prononcés avec leurs temps (Vosk)
  <nom>.plans.tsv   changements de plan détectés (temps, score)
  <nom>.planche-NN.jpg  planches d'images (1 image/s, 20 par planche, temps incrusté)
"""
import json
import re
import subprocess
import sys
import tempfile
from difflib import SequenceMatcher
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from aligner import reconnaitre  # noqa: E402

LECTURES_PAR_S = 6
# Bande des sous-titres (en fraction de la hauteur) ; large pour attraper 1 à 3 lignes
BANDE = (0.50, 0.70)


def duree(video: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=duration",
                        "-of", "csv=p=0", video], capture_output=True, text=True, check=True)
    return float(r.stdout.strip())


def ocr(video: Path) -> list[tuple[float, float, str]]:
    with tempfile.TemporaryDirectory() as d:
        h0, h1 = BANDE
        # Garde le texte blanc ou gris clair (sous-titres), assombrit le décor, agrandit pour l'OCR
        subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-vf",
                        f"fps={LECTURES_PAR_S},crop=iw:ih*{h1 - h0}:0:ih*{h0},format=gray,"
                        "lutyuv=y='if(gt(val,150),0,255)',scale=iw*0.75:-1", f"{d}/%05d.png"], check=True)
        images = sorted(Path(d).glob("*.png"))
        lectures = []
        for img in images:
            r = subprocess.run(["tesseract", img, "-", "-l", "fra", "--psm", "6"], capture_output=True, text=True)
            texte = re.sub(r"[^\wÀ-ÿ'’?!.,:\- ]", "", " ".join(r.stdout.split())).strip()
            texte = " ".join(m for m in texte.split() if len(m) > 1 or m.lower() in "àaoy")
            lectures.append(texte)
    # Regroupe les lectures identiques/similaires consécutives
    segments: list[list] = []
    for i, t in enumerate(lectures):
        tps = i / LECTURES_PAR_S
        if segments and SequenceMatcher(a=segments[-1][2], b=t).ratio() > 0.8:
            segments[-1][1] = tps + 1 / LECTURES_PAR_S
            if len(t) > len(segments[-1][2]):
                segments[-1][2] = t
        else:
            segments.append([tps, tps + 1 / LECTURES_PAR_S, t])
    return [(a, b, t) for a, b, t in segments if t and b - a >= 0.3]


def plans(video: Path) -> list[tuple[float, float]]:
    r = subprocess.run(["ffmpeg", "-v", "info", "-i", video, "-vf", "scdet=threshold=12", "-an", "-f", "null", "-"],
                       capture_output=True, text=True)
    return [(float(t), float(s)) for s, t in re.findall(r"lavfi\.scd\.score:\s*([\d.]+),\s*lavfi\.scd\.time:\s*([\d.]+)",
                                                         r.stderr)]


def planches(video: Path, base: Path) -> None:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-vf",
                    "fps=1,scale=216:384,drawtext=text='%{eif\\:t\\:d}s':x=6:y=6:fontsize=26:fontcolor=yellow:"
                    "box=1:boxcolor=black@0.7,tile=5x4", "-q:v", "4", f"{base}.planche-%02d.jpg"], check=True)


def main() -> None:
    video = Path(sys.argv[1])
    base = video.with_suffix("")
    d = duree(video)
    segs = ocr(video)
    base.with_suffix(".ocr.tsv").write_text("debut\tfin\ttexte\n" + "".join(f"{a:.2f}\t{b:.2f}\t{t}\n" for a, b, t in segs),
                                            encoding="utf-8")
    mots, _ = reconnaitre(video)
    base.with_suffix(".vosk.json").write_text(json.dumps(mots, ensure_ascii=False, indent=0), encoding="utf-8")
    p = plans(video)
    base.with_suffix(".plans.tsv").write_text("temps\tscore\n" + "".join(f"{t:.2f}\t{s:.1f}\n" for t, s in p))
    planches(video, base)
    parole = (mots[-1]["end"] - mots[0]["start"]) if mots else 0
    print(f"{video.name} : {d:.1f} s, {len(segs)} sous-titres, {len(mots)} mots "
          f"({len(mots) / parole * 60 if parole else 0:.0f} mots/min), {len(p)} changements de plan "
          f"(1 toutes les {d / max(1, len(p)):.1f} s)")


if __name__ == "__main__":
    main()
