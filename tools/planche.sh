#!/usr/bin/env bash
# Planches contact à partir des images fixes (qc/<ep>/images/*.png, rendues par tools/images.ts) :
# 10 images par planche (5×2), instant en jaune, zones interdites TikTok en rouge, ligne des sous-titres en jaune.
# Usage : bash tools/planche.sh 001-h72      -> qc/<ep>/planche-img-NN.jpg
set -euo pipefail
cd "$(dirname "$0")/.."
EP="${1:?Episode manquant, ex. : bash tools/planche.sh 001-h72}"
DOSSIER="qc/$EP/images"
TMP=$(mktemp -d)
rm -f "qc/$EP"/planche-img-*.jpg
i=0
for f in $(ls "$DOSSIER"/*.png | grep -v _guide | sort -t/ -k4 -g); do
  nom=$(basename "$f" .png)
  ffmpeg -v error -y -i "$f" -vf "scale=270:480,\
drawbox=x=0:y=0:w=iw:h=45:color=red@0.15:t=fill,drawbox=x=0:y=375:w=iw:h=105:color=red@0.15:t=fill,\
drawbox=x=230:y=45:w=40:h=330:color=red@0.15:t=fill,drawbox=x=0:y=287:w=iw:h=2:color=yellow@0.8:t=fill,\
drawtext=text='${nom}s':x=6:y=50:fontsize=26:fontcolor=yellow:box=1:boxcolor=black@0.7" "$TMP/$(printf %03d $i).png"
  i=$((i + 1))
done
ffmpeg -v error -y -framerate 1 -i "$TMP/%03d.png" -vf "tile=5x2:color=black" -q:v 3 "qc/$EP/planche-img-%02d.jpg"
rm -rf "$TMP"
ls "qc/$EP"/planche-img-*.jpg
