"""Télécharge les textures PBR (Poly Haven, licence CC0 : libres d'usage, sans attribution obligatoire).

Usage : .venv/bin/python tools/telecharger_textures.py
Écrit public/textures/<nom>/{couleur,normale,arm}.jpg (arm = occlusion R / rugosité G / métal B, format three.js).
Pour ajouter un matériau : l'ajouter à TEXTURES (identifiant Poly Haven) et à src/systeme/kit3d/pbr.ts.
"""
import json
import urllib.request
from pathlib import Path

RACINE = Path(__file__).resolve().parent.parent
# identifiant Poly Haven -> résolution
TEXTURES = {
    "herringbone_parquet": "2k",  # parquet à bâtons rompus (appartement)
    "painted_plaster_wall": "1k",  # plâtre peint (murs)
    "metal_plate_02": "1k",  # tôle de cabine d'ascenseur
    "rubber_tiles": "1k",  # sol de cabine
    "poly_wool_herringbone": "1k",  # tissu du canapé
    "concrete_wall_006": "1k",  # béton de la cage d'ascenseur
    "laminate_floor_02": "1k",  # bois clair (meubles)
}
CARTES = {"Diffuse": "couleur", "nor_gl": "normale", "arm": "arm"}


def lire(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "studio-survie/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


for nom, res in TEXTURES.items():
    dossier = RACINE / "public" / "textures" / nom
    dossier.mkdir(parents=True, exist_ok=True)
    fichiers = json.loads(lire(f"https://api.polyhaven.com/files/{nom}"))
    for cle, sortie in CARTES.items():
        cible = dossier / f"{sortie}.jpg"
        if cible.exists():
            continue
        cible.write_bytes(lire(fichiers[cle][res]["jpg"]["url"]))
    print(f"ok {nom} ({res})")
(RACINE / "public" / "textures" / "LICENCE.txt").write_text(
    "Textures : Poly Haven (https://polyhaven.com), licence CC0 1.0 (domaine public).\n", encoding="utf-8")
