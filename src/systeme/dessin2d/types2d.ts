// Types des personnages 2D (sans JSX : lisibles par les données d'épisode et tools/qc2d.ts)
export type Coiffure = "longue" | "carre" | "courte" | "enfant";
export type Expression = "neutre" | "sourire" | "fache" | "mepris" | "triste" | "choque";
export type Point = [number, number];
// Bras : une pose connue ou des points explicites (coude, poignet), en repère local
export type PoseBras = "bas" | "hanche" | "croise" | "telephone" | "tend" | "porte" | { coude: Point; poignet: Point };

export type Apparence2D = {
  peau: string;
  ombrePeau: string;
  cheveux: string;
  ombreCheveux: string;
  coiffure: Coiffure;
  yeux: string;
  homme?: boolean;
  enfant?: boolean;
  levres?: string;
  haut: string;
  ombreHaut: string;
  bas: string;
  ombreBas: string;
  robe?: boolean; // le bas est une jupe jusqu'aux genoux (jambes nues)
  brasNus?: boolean;
  chaussures: string;
  chemise?: string; // col de chemise visible (costume)
  cravate?: string;
  fourrure?: string; // étole sur les épaules
  bijoux?: string; // boucles d'oreilles + collier
  capuche?: boolean;
  bague?: string; // bague à la main droite (côté droit de l'écran)
};

