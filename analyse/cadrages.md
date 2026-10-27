# Cadrages : comment filme @chroniques_flippantes (et comment on filme désormais)

*Étude du 27/10/2026, demande de la chaîne : « analyse les angles de vue des comptes de référence, filme comme eux et
dézoome, c'est trop proche ». Vidéos étudiées : la série « Le dernier métro » (`reference/chroniques_flippantes/`),
dont P1 (3 M de vues) et P2 (1,1 M). Planches : `analyse/cadrages/` (1 image toutes les 3 s). Les vidéos de
@anglemort1_ n'ont pas été copiées sur ce PC : seule leur analyse écrite (`analyse-anglemort.md`) a servi.*

## Ce qu'ils font

- **Personnage petit dans l'image** : sur les images où il y a un personnage, il occupe en médiane **≈ 22 %** de la
  hauteur (P1) et **≈ 38 %** (P2). Le décor (quai, couloir, rame) remplit le reste.
- **Caméra à hauteur d'œil** (légère plongée au plus), **objectif large** : lignes de fuite fortes (quai, néons du
  plafond, rails jaunes), on sent la profondeur et l'espace vide autour du héros (c'est ce qui fait peur).
- **Le personnage au centre**, souvent **en pied** (on voit ses pieds et son ombre au sol), parfois très loin
  au bout du quai (5-15 % de la hauteur) pour montrer qu'il est seul.
- **Gros plans rares** (≈ 14 à 20 % des images avec personnage) et **réservés aux émotions** (la peur, la surprise,
  le sourire de la silhouette) ; les autres gros plans sont des **objets** (téléphone 3 %, affiche des consignes,
  écran du jeu), jamais des visages « par défaut ».
- **Deux personnages** (héros + silhouette) : plan large où l'on voit les deux en entier, l'un derrière l'autre.

## Ce qu'on faisait (mesuré par `tools/qc.ts`)

| Épisode | Personnage médian | Plans larges < 35 % | Gros plans > 60 % |
|---|---|---|---|
| H+72 P1 | 48 % | 22 % | 13 % |
| H+72 P2 | 49 % | 12 % | 31 % |
| H+72 P3 | 41 % | 42 % | 31 % |
| H+72 P4 (1re version) | **55 %** | 23 % | **45 %** |
| **H+72 P4 (recadrée)** | **32 %** | **55 %** | **9 %** |

## Les règles, dans le moteur

- Cadrages types `cadrage.large / pied / deux / moyen / gros` (`src/systeme/camera.ts`) : caméra à hauteur d'œil
  (6-8°), objectif 44-48°, distances 7 / 5 / 6 / 3,6 / 2,6 m (personnage à ≈ 22 / 33 / 27 / 48 / 80 % de la hauteur).
- `tools/qc.ts` mesure la taille du plus grand personnage à chaque image (hors carton de fin et gros plans
  d'objets) et **bloque** si la médiane dépasse **35 %** ou si les gros plans dépassent **15 %** des images
  (`CADRAGE` dans `src/systeme/format.ts`). Le détail seconde par seconde est dans `qc/<épisode>/cadrage.tsv`.
- Gros plan de visage : seulement pour un moment fort (cri, peur, révélation), 1 à 3 s.
- Une pièce filmée de l'intérieur doit être assez grande pour reculer la caméra (≥ 3 m entre la caméra et le
  personnage) : sinon, l'agrandir.
