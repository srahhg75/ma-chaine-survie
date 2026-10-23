#!/usr/bin/env bash
# Rendu final d'un épisode : contrôles bloquants, rendu pleine résolution, master audio, vérifications,
# puis copie dans le dossier « Vidéos TikTok » du bureau.
# Usage : bash tools/final.sh 000-demo
set -uo pipefail
cd "$(dirname "$0")/.."
EP="${1:?Episode manquant, ex. : bash tools/final.sh 000-demo}"
QC="qc/$EP"; OUT="videos/$EP"; mkdir -p "$QC" "$OUT"
etape() { printf "\n\033[1m== %s\033[0m\n" "$1"; }

etape "0. Relire qc/lecons.md"
cat qc/lecons.md

etape "1. Contrôles bloquants"
npx tsc --noEmit || exit 1
npx tsx tools/timeline.ts "$EP" || exit 1
npx tsx tools/qc.ts "$EP" > /dev/null || { echo "Contrôle visuel en échec : voir $QC/rapport_qc.md"; exit 1; }
.venv/bin/python tools/mix.py "$EP" || exit 1
.venv/bin/python tools/qc_audio.py "$EP" > /dev/null || { echo "Contrôle audio en échec : voir $QC/rapport_audio.md"; exit 1; }

etape "2. Rendu pleine résolution"
npx remotion render src/index.ts "ep$EP" "$OUT/rendu.mp4" --log=error || exit 1

etape "3. Encodage final (vidéo x264 ≤ 12 Mb/s + master audio mix.wav en AAC 320 kb/s)"
# Vidéo réencodée en x264 CRF 18 plafonné à 12 Mb/s (le grain rend sinon le fichier énorme : ~46 Mb/s)
ffmpeg -v error -y -i "$OUT/rendu.mp4" -i "public/$EP/mix.wav" -map 0:v -map 1:a -c:v libx264 -crf 18 -maxrate 12M -bufsize 24M -preset slow -pix_fmt yuv420p -profile:v high -c:a aac -b:a 320k -ar 48000 -shortest -movflags +faststart "$OUT/final.mp4" || exit 1
rm -f "$OUT/rendu.mp4"

etape "4. Vérifications du fichier final"
INFO=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of csv=p=0 "$OUT/final.mp4")
DUREE=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/final.mp4")
echo "Image : $INFO ; durée : ${DUREE} s"
[ "$INFO" = "1080,1920,30/1" ] || { echo "ERREUR : format attendu 1080x1920 à 30 i/s"; exit 1; }
if ! grep -q "demonstration: true" "src/episodes/$EP/donnees.ts"; then
  awk -v d="$DUREE" 'BEGIN { exit !(d >= 70 && d <= 120) }' || { echo "ERREUR : durée hors 70-120 s"; exit 1; }
fi
.venv/bin/python tools/verifier_master.py "$OUT/final.mp4" || exit 1

etape "5. Copie dans « Vidéos TikTok » sur le bureau"
BUREAU=""
for d in "$(xdg-user-dir DESKTOP 2>/dev/null)" "$HOME/Bureau" "$HOME/Desktop" "${USERPROFILE:-}/OneDrive/Bureau" "${USERPROFILE:-}/OneDrive/Desktop" "${USERPROFILE:-}/Desktop"; do
  [ -n "$d" ] && [ -d "$d" ] && [ "$d" != "$HOME" ] && { BUREAU="$d"; break; }
done
[ -z "$BUREAU" ] && { BUREAU="$HOME/Desktop"; mkdir -p "$BUREAU"; echo "(aucun bureau trouvé : création de $BUREAU)"; }
mkdir -p "$BUREAU/Vidéos TikTok"
cp "$OUT/final.mp4" "$BUREAU/Vidéos TikTok/$EP.mp4"
echo "Vidéo finale : $OUT/final.mp4"
echo "Copie : $BUREAU/Vidéos TikTok/$EP.mp4"
