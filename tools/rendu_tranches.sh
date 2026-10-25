#!/usr/bin/env bash
# Rendu pleine résolution PAR TRANCHES, qui reprend là où il s'est arrêté (redémarrage de la machine, coupure).
# Les tranches déjà rendues (videos/<ep>/tranches/NN.mp4, sans son) sont gardées ; à la fin : videos/<ep>/rendu.mp4.
# Usage : bash tools/rendu_tranches.sh 001-h72 [images_par_tranche=300]
# Pour le lancer détaché (survit à la fin de la commande) :
#   nohup setsid bash tools/rendu_tranches.sh 001-h72 > videos/001-h72/rendu.log 2>&1 &
set -uo pipefail
cd "$(dirname "$0")/.."
EP="${1:?Episode manquant, ex. : bash tools/rendu_tranches.sh 001-h72}"
PAR="${2:-300}"
COMP=$(npx tsx tools/composition.ts "$EP") || exit 1
OUT="videos/$EP"; T="$OUT/tranches"; mkdir -p "$T"
# Nombre d'images = durée de l'épisode (même calcul que la Composition)
TOTAL=$(npx tsx tools/composition.ts "$EP" --images) || exit 1
N=$(( (TOTAL + PAR - 1) / PAR ))
echo "$(date +%H:%M:%S) $TOTAL images, $N tranches de $PAR"
for ((k = 0; k < N; k++)); do
  F="$T/$(printf %02d $k).mp4"
  [ -s "$F" ] && { echo "tranche $k déjà rendue"; continue; }
  A=$((k * PAR)); B=$(( (k + 1) * PAR - 1 )); [ $B -ge $TOTAL ] && B=$((TOTAL - 1))
  echo "$(date +%H:%M:%S) tranche $k : images $A-$B"
  # CONCURRENCE=n : onglets en parallèle (PC sans carte graphique et 8 Go : 3 au plus, sinon la mémoire sature)
  npx remotion render src/index.ts "$COMP" "$F.tmp.mp4" --frames=$A-$B --muted --log=error ${CONCURRENCE:+--concurrency=$CONCURRENCE} || { echo "ÉCHEC tranche $k"; exit 1; }
  mv "$F.tmp.mp4" "$F"
done
ls "$T"/[0-9][0-9].mp4 | sed "s|^$T/|file '|; s|$|'|" > "$T/liste.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$T/liste.txt" -c copy "$OUT/rendu.mp4" || exit 1
echo "$(date +%H:%M:%S) FIN : $OUT/rendu.mp4 ($(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of csv=p=0 "$OUT/rendu.mp4") images)"
