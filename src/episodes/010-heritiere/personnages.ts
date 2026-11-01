import { Apparence2D } from "../../systeme/dessin2d/Personnage2D";

// Série « L'héritière cachée » : personnages dessinés en 2D (style webtoon). Mêmes couleurs dans toute la série.
const PEAU = { peau: "#f6dccb", ombrePeau: "#e3b5a0" };

// Clara, l'héroïne : tenue simple (elle se cache), cheveux bruns longs, yeux ambre
export const CLARA: Apparence2D = {
  ...PEAU,
  cheveux: "#4a3229",
  ombreCheveux: "#2f1f1a",
  coiffure: "longue",
  yeux: "#b9773a",
  haut: "#efe5d6",
  ombreHaut: "#d2c3ad",
  bas: "#6f8db3",
  ombreBas: "#55708f",
  chaussures: "#f4f4f4",
};

// Noé, 6 ans, son fils
export const NOE: Apparence2D = {
  ...PEAU,
  enfant: true,
  cheveux: "#4a3229",
  ombreCheveux: "#2f1f1a",
  coiffure: "enfant",
  yeux: "#6a4a2e",
  haut: "#f2c14e",
  ombreHaut: "#d29f32",
  bas: "#3d4a63",
  ombreBas: "#2c3649",
  chaussures: "#e2463a",
  capuche: true,
};

// Victoria, l'autre femme : riche, robe rouge, étole blanche, carré blond, bijoux dorés
export const VICTORIA: Apparence2D = {
  peau: "#f8e1d4",
  ombrePeau: "#e6b8a6",
  cheveux: "#f1d27a",
  ombreCheveux: "#c9a24c",
  coiffure: "carre",
  yeux: "#3f7a8c",
  levres: "#c21f3a",
  haut: "#c8203a",
  ombreHaut: "#981530",
  bas: "#c8203a",
  ombreBas: "#981530",
  robe: true,
  brasNus: true,
  chaussures: "#1d1d24",
  fourrure: "#fbf7f2",
  bijoux: "#e8bf4a",
};

// Enzo, son fils : polo bleu marine, air hautain
export const ENZO: Apparence2D = {
  peau: "#f8e1d4",
  ombrePeau: "#e6b8a6",
  enfant: true,
  cheveux: "#e5c46c",
  ombreCheveux: "#b8943f",
  coiffure: "enfant",
  yeux: "#3f7a8c",
  haut: "#23345e",
  ombreHaut: "#172443",
  bas: "#d9d2c2",
  ombreBas: "#b7ae9b",
  chaussures: "#5a3a26",
};

// Adrien Valmont, le mari aux deux vies : costume bleu nuit
export const ADRIEN: Apparence2D = {
  ...PEAU,
  homme: true,
  cheveux: "#1f1b22",
  ombreCheveux: "#0f0d12",
  coiffure: "courte",
  yeux: "#5b4636",
  haut: "#1e2a44",
  ombreHaut: "#141c30",
  bas: "#1e2a44",
  ombreBas: "#141c30",
  chaussures: "#121216",
  chemise: "#f3f3f5",
  cravate: "#7a1d2e",
};
