#!/usr/bin/env bash
# Réinstalle tout l'outillage du studio (Linux / Mac). Usage : bash tools/installer.sh
# Prérequis : Node.js LTS, Python 3.12, Git, FFmpeg
#   Mac : brew install node python@3.12 git ffmpeg
#   Windows (PowerShell) : winget install OpenJS.NodeJS.LTS Python.Python.3.12 Git.Git Gyan.FFmpeg
set -euo pipefail
cd "$(dirname "$0")/.."
PY=$(command -v python3.12 || command -v python3)

echo "== Paquets Node (Remotion, 3D…)"
npm ci

echo "== Environnement Python principal (.venv)"
[ -d .venv ] || "$PY" -m venv .venv
.venv/bin/python -m pip install -q --upgrade pip
.venv/bin/python -m pip install -q numpy scipy soundfile pyloudnorm vosk

echo "== Modèle Vosk français"
if [ ! -d tools/models/vosk-model-small-fr-0.22 ]; then
  mkdir -p tools/models
  curl -sSfL -o tools/models/vosk-fr.zip https://alphacephei.com/vosk/models/vosk-model-small-fr-0.22.zip
  (cd tools/models && unzip -q vosk-fr.zip && rm vosk-fr.zip)
fi

echo "== earshot (banque de sons + contrôle audio)"
[ -d tools/earshot ] || git clone --depth 1 https://github.com/Leonxlnx/earshot.git tools/earshot
(cd tools/earshot && { [ -d .venv ] || "$PY" -m venv .venv; } \
  && .venv/bin/python -m pip install -q torch --index-url https://download.pytorch.org/whl/cpu \
  && .venv/bin/python -m pip install -q -e ".[mcp]" \
  && .venv/bin/earshot doctor --fetch >/dev/null && .venv/bin/earshot doctor --load | tail -3)

echo "== Polices locales"
npx tsx tools/telecharger_polices.ts

echo "Installation terminée."
