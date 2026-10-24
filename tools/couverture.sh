#!/usr/bin/env bash
# Image de couverture TikTok : image fixe SANS texte (ni HUD ni sous-titres) + titre en Montserrat 900.
# Le texte est placé dans la bande y≈1150-1570 (visible dans la grille du profil, qui recadre en 3:4 au centre).
# Usage : bash tools/couverture.sh 001-h72 14.0 "IL LUI RESTE" "9 LITRES" "H+72 · PARTIE 1"
set -euo pipefail
cd "$(dirname "$0")/.."
EP="${1:?episode}"; T="${2:?instant}"; L1="${3:?ligne 1}"; L2="${4:?ligne 2 (grosse, jaune)}"; L3="${5:-}"
POLICE="qc/$EP/Montserrat-900.ttf"
# La police est « variable » : il faut figer la graisse 900, sinon le texte sort en creux
.venv/bin/python -c "
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
f = TTFont('public/polices/Montserrat-900-latin.woff2')
if 'fvar' in f: f = instancer.instantiateVariableFont(f, {'wght': 900})
f.flavor = None; f.save('$POLICE')"
npx tsx tools/images.ts "$EP" "$T" --sans-texte | tail -1
SRC="qc/$EP/images/${T}_sans-texte.png"
ffmpeg -nostdin -v error -y -i "$SRC" -vf "drawbox=x=0:y=1150:w=iw:h=420:color=black@0.45:t=fill,\
drawtext=fontfile=$POLICE:text='$L1':fontsize=92:fontcolor=white:borderw=8:bordercolor=black:x=(w-tw)/2:y=1180,\
drawtext=fontfile=$POLICE:text='$L2':fontsize=180:fontcolor=0xFFC93C:borderw=12:bordercolor=black:x=(w-tw)/2:y=1280,\
drawtext=fontfile=$POLICE:text='$L3':fontsize=52:fontcolor=white:borderw=6:bordercolor=black:x=(w-tw)/2:y=1490" -q:v 2 "videos/$EP/couverture.jpg"
rm -f "$POLICE"
echo "Couverture : videos/$EP/couverture.jpg"
