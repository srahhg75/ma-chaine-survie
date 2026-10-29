// Apparence d'un personnage « humain » (données pures : lues par le rendu ET par les données d'épisode).
// Tout reste en formes simples ; ces réglages donnent le réalisme (coupe, couches de vêtements, âge, accessoires).
export type Coiffure = "carre" | "couronne" | "court" | "meches" | "long"; // meches, long : style « adulte »
export type Haut = "pull" | "cardigan" | "polaire" | "tshirt" | "parka";
export type Chaussures = "baskets" | "chaussons" | "bottines";

export type Apparence = {
  femme: boolean;
  age: number; // 0 jeune adulte … 1 âgé (rides, dos voûté, cheveux gris)
  peau: string;
  joues: string; // rose des joues
  iris: string;
  cheveux: string;
  coiffure: Coiffure;
  haut: Haut;
  couleurHaut: string;
  couleurCol: string; // col / t-shirt visible dessous / doublure
  pantalon: string;
  chaussures: Chaussures;
  couleurChaussures: string;
  lunettes: boolean;
  bonnet: string | null; // couleur du bonnet, ou rien
  couleurPompon: string;
  bandeau: string | null; // serre-tête tricoté (couleur), ou rien
  echarpe: string | null;
  sac: string | null; // petit sac à dos de survie
  gants: string | null; // gants (couleur), ou mains nues
};

export const APPARENCE_DEFAUT: Apparence = {
  femme: false,
  age: 0.2,
  peau: "#e8b896",
  joues: "#e48a7a",
  iris: "#5a3a1e",
  cheveux: "#3a2618",
  coiffure: "court",
  haut: "pull",
  couleurHaut: "#5b6b7a",
  couleurCol: "#d9d2c4",
  pantalon: "#2f3542",
  chaussures: "baskets",
  couleurChaussures: "#e9e6df",
  lunettes: false,
  bonnet: null,
  couleurPompon: "#f2ede4",
  bandeau: null,
  echarpe: null,
  sac: null,
  gants: null,
};

// Inès, 34 ans, infirmière de nuit : la tenue de la partie 1 (parka bleu-vert, pantalon prune, bottines marron,
// carré châtain, serre-tête jaune tricoté, écharpe jaune, petit sac à dos)
export const APPARENCE_INES: Partial<Apparence> = {
  femme: true,
  age: 0.15,
  peau: "#f0c39c",
  joues: "#e98d82",
  iris: "#8a4718",
  cheveux: "#6b3a22",
  coiffure: "carre",
  haut: "parka",
  couleurHaut: "#2f6f73",
  couleurCol: "#d9cfbf",
  pantalon: "#3b3046",
  chaussures: "bottines",
  couleurChaussures: "#3f2c22",
  bandeau: "#d9a52b",
  echarpe: "#d9a52b",
  sac: "#7a5236",
};

// Monsieur Morel, ≈ 70 ans, 5e étage : couronne de cheveux gris, lunettes, cardigan moutarde sur chemise, chaussons
export const APPARENCE_MOREL: Partial<Apparence> = {
  femme: false,
  age: 0.9,
  peau: "#e2b294",
  joues: "#d97f74",
  iris: "#4c5a66",
  cheveux: "#e6e4df",
  coiffure: "couronne",
  haut: "cardigan",
  couleurHaut: "#a8812f",
  couleurCol: "#c9d4dc",
  pantalon: "#5a5148",
  chaussures: "chaussons",
  couleurChaussures: "#6b2f2a",
  lunettes: true,
};
