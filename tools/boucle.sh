#!/usr/bin/env bash
# Boucle qualité d'un épisode : vérifications automatiques + brouillon en demi-résolution + planches contact.
# Usage : bash tools/boucle.sh 000-demo
# À relancer tant qu'il reste une erreur (et ajouter une leçon dans qc/lecons.md pour chaque erreur trouvée).
set -uo pipefail
cd "$(dirname "$0")/.."
EP="${1:?Episode manquant, ex. : bash tools/boucle.sh 000-demo}"
QC="qc/$EP"; mkdir -p "$QC"
ECHEC=0
etape() { printf "\n\033[1m== %s\033[0m\n" "$1"; }

etape "0. Relire qc/lecons.md (règles en vigueur)"
grep -c "^- " qc/lecons.md | xargs -I{} echo "{} règles/leçons — relire le fichier avant de continuer."

etape "1. Code (TypeScript)"
npx tsc --noEmit || exit 1

etape "2. Timeline (ancres -> instants)"
npx tsx tools/timeline.ts "$EP" || exit 1

etape "3. Contrôle visuel automatique (tools/qc.ts)"
npx tsx tools/qc.ts "$EP" > /dev/null; [ $? -eq 0 ] && echo "OK : aucune erreur" || { ECHEC=1; sed -n '/## Erreurs/,/## Avertissements/p' "$QC/rapport_qc.md"; }

etape "4. Mixage + contrôle audio"
.venv/bin/python tools/mix.py "$EP" || exit 1
.venv/bin/python tools/qc_audio.py "$EP" > /dev/null; [ $? -eq 0 ] && head -3 "$QC/rapport_audio.md" | tail -1 || { ECHEC=1; cat "$QC/rapport_audio.md"; }

etape "5. Brouillon en demi-résolution (sans occlusion ambiante)"
npx remotion render src/index.ts "ep$EP" "$QC/brouillon.mp4" --scale=0.5 --props='{"brouillon":true}' --log=error || exit 1

etape "6. Planches contact (1 image/s, zones interdites en rouge, ligne des sous-titres en jaune)"
rm -f "$QC"/planche-*.jpg
ffmpeg -v error -y -i "$QC/brouillon.mp4" -vf "fps=1,scale=216:384,\
drawbox=x=0:y=0:w=iw:h=36:color=red@0.35:t=fill,drawbox=x=0:y=300:w=iw:h=84:color=red@0.35:t=fill,\
drawbox=x=184:y=36:w=32:h=264:color=red@0.35:t=fill,drawbox=x=0:y=229:w=iw:h=2:color=yellow@0.8:t=fill,\
drawtext=text='%{eif\:t\:d}s':x=6:y=40:fontsize=24:fontcolor=yellow:box=1:boxcolor=black@0.7,tile=5x4" -q:v 3 "$QC/planche-%02d.jpg"
ls "$QC"/planche-*.jpg

etape "7. Écoute (earshot) : loudness et synchro son/image"
tools/earshot/.venv/bin/earshot measure "$QC/brouillon.mp4" | head -1
tools/earshot/.venv/bin/earshot timeline "$QC/brouillon.mp4" --video "$QC/brouillon.mp4" --out "$QC/earshot_timeline.json" > "$QC/earshot_timeline.txt" 2>&1 && head -1 "$QC/earshot_timeline.txt" | cut -c1-600

etape "Bilan"
if [ $ECHEC -eq 0 ]; then echo "Contrôles automatiques OK. Regarder les planches $QC/planche-*.jpg avant le rendu final."; else echo "ERREURS à corriger (voir $QC/rapport_qc.md et $QC/rapport_audio.md)."; fi
exit $ECHEC
