import { Vec3 } from "../maths";
import type { NomPBR } from "./pbr";

// Description des décors EN DONNÉES : lue par le rendu (Decor.tsx) et par le contrôle qualité (tools/qc.ts).
export type CoteMur = "nord" | "sud" | "est" | "ouest"; // nord = fond (z négatif), sud = devant (z positif)
export type Sol = "parquet" | "carrelage" | "beton" | "moquette";
export type Revetement = "papier" | "beton" | "carrelage" | "peint";

export type Ouverture = {
  mur: CoteMur;
  type: "fenetre" | "porte" | "passage"; // passage = baie sans porte (ex. portes coulissantes dessinées à part)
  centre: number; // position le long du mur depuis son milieu (m) : vers l'est pour nord/sud, vers le nord pour ouest/est
  largeur: number;
  hauteur: number;
  bas?: number; // hauteur de l'allège (fenêtre seulement), défaut 0,9 ; porte et passage partent du sol
};

// Hauteur du bas d'une ouverture : seule une fenêtre a une allège (une porte ou un passage part du sol)
export const basOuverture = (o: Ouverture) => (o.type === "fenetre" ? o.bas ?? 0.9 : 0);

export type DonneesPiece = {
  id: string;
  centre: [number, number]; // x, z du centre du sol
  largeur: number; // selon x
  profondeur: number; // selon z
  hauteur?: number; // défaut 2,6
  sol: Sol;
  murs: Revetement;
  couleurMurs?: string;
  couleurSol?: string;
  devant?: CoteMur[]; // murs arasés (coupe) ; défaut ["sud", "est"]
  hauteurArasee?: number; // défaut 0,22
  ouvertures?: Ouverture[];
  plafonnier?: boolean; // ampoule (éteinte si panne)
  // Vraies textures PBR (public/textures) à la place des textures procédurales ; motif = taille d'un motif en m
  pbr?: { sol?: NomPBR; murs?: NomPBR; teinteSol?: string; teinteMurs?: string; motifSol?: number; motifMurs?: number; metalMurs?: number; gainMurs?: number; gainSol?: number };
};

export type TypeMeuble =
  | "table" | "chaise" | "lit" | "canape" | "etagere" | "frigo" | "placard" | "radiateur" | "tapis"
  | "cuisiniere" | "evier" | "bouteille" | "conserve" | "radio" | "couverture" | "jerrican" | "carton";

export type DonneesMeuble = {
  type: TypeMeuble;
  position: Vec3; // centre au sol (y = hauteur du dessous de l'objet)
  rotation?: number; // degrés autour de y
  couleur?: string;
  echelle?: number;
  id?: string;
  invisible?: boolean; // obstacle déclaré pour les contrôles, dessiné ailleurs (mobilier détaillé de l'épisode)
};

export type DonneesExterieur = {
  ville?: { allumees: number; distance?: number }; // part des fenêtres allumées (0 = panne totale)
  neige?: { densite?: number; vent?: number } | false;
  ciel?: "nuit" | "crepuscule";
};

export type DonneesDecor = {
  pieces: DonneesPiece[];
  meubles: DonneesMeuble[];
  exterieur?: DonneesExterieur;
};

// Encombrement des meubles [largeur x, hauteur y, profondeur z] en mètres (avant rotation/échelle)
export const TAILLES: Record<TypeMeuble, Vec3> = {
  table: [1.2, 0.76, 0.75],
  chaise: [0.44, 0.9, 0.46],
  lit: [1.45, 0.55, 2.0],
  canape: [1.9, 0.82, 0.85],
  etagere: [0.9, 1.8, 0.32],
  frigo: [0.6, 1.75, 0.62],
  placard: [1.0, 2.0, 0.55],
  radiateur: [0.9, 0.6, 0.1],
  tapis: [1.8, 0.01, 1.2],
  cuisiniere: [0.6, 0.88, 0.6],
  evier: [1.2, 0.9, 0.6],
  bouteille: [0.09, 0.32, 0.09],
  conserve: [0.08, 0.11, 0.08],
  radio: [0.28, 0.16, 0.1],
  couverture: [0.45, 0.12, 0.35],
  jerrican: [0.34, 0.45, 0.17],
  carton: [0.5, 0.36, 0.38],
};

export type Boite = { min: Vec3; max: Vec3; nature: "mur" | "meuble"; id: string; plein: boolean };

export const EPAISSEUR_MUR = 0.12;

// Murs (pleins ou arasés) d'une pièce, en boîtes alignées sur les axes
export const mursPiece = (p: DonneesPiece): (Boite & { cote: CoteMur })[] => {
  const h = p.hauteur ?? 2.6;
  const devant = p.devant ?? ["sud", "est"];
  const ha = p.hauteurArasee ?? 0.22;
  const [cx, cz] = p.centre;
  const L = p.largeur / 2;
  const P = p.profondeur / 2;
  const e = EPAISSEUR_MUR / 2;
  const hauteur = (c: CoteMur) => (devant.includes(c) ? ha : h);
  const boites: Record<CoteMur, [Vec3, Vec3]> = {
    nord: [[cx - L - e, 0, cz - P - e], [cx + L + e, hauteur("nord"), cz - P + e]],
    sud: [[cx - L - e, 0, cz + P - e], [cx + L + e, hauteur("sud"), cz + P + e]],
    ouest: [[cx - L - e, 0, cz - P - e], [cx - L + e, hauteur("ouest"), cz + P + e]],
    est: [[cx + L - e, 0, cz - P - e], [cx + L + e, hauteur("est"), cz + P + e]],
  };
  return (Object.keys(boites) as CoteMur[]).map((cote) => ({
    min: boites[cote][0],
    max: boites[cote][1],
    nature: "mur" as const,
    id: `${p.id}/${cote}`,
    plein: !devant.includes(cote),
    cote,
  }));
};

export const boiteMeuble = (m: DonneesMeuble, i: number): Boite => {
  const [l, h, pr] = TAILLES[m.type].map((x) => x * (m.echelle ?? 1));
  const r = ((m.rotation ?? 0) * Math.PI) / 180;
  const lx = Math.abs(Math.cos(r)) * l + Math.abs(Math.sin(r)) * pr;
  const lz = Math.abs(Math.sin(r)) * l + Math.abs(Math.cos(r)) * pr;
  const [x, y, z] = m.position;
  return { min: [x - lx / 2, y, z - lz / 2], max: [x + lx / 2, y + h, z + lz / 2], nature: "meuble", id: m.id ?? `${m.type}${i}`, plein: true };
};

export const obstacles = (d: DonneesDecor): Boite[] => [
  ...d.pieces.flatMap(mursPiece),
  ...d.meubles.filter((m) => m.type !== "tapis").map(boiteMeuble),
];

export const dansBoite = (p: Vec3, b: Boite, marge = 0) =>
  p[0] > b.min[0] - marge && p[0] < b.max[0] + marge &&
  p[1] > b.min[1] - marge && p[1] < b.max[1] + marge &&
  p[2] > b.min[2] - marge && p[2] < b.max[2] + marge;

// Le segment a→b traverse-t-il la boîte ? (méthode des « slabs »)
export const segmentTraverse = (a: Vec3, b: Vec3, boite: Boite) => {
  let t0 = 0;
  let t1 = 1;
  for (let k = 0; k < 3; k++) {
    const d = b[k] - a[k];
    if (Math.abs(d) < 1e-9) {
      if (a[k] < boite.min[k] || a[k] > boite.max[k]) return false;
      continue;
    }
    let ta = (boite.min[k] - a[k]) / d;
    let tb = (boite.max[k] - a[k]) / d;
    if (ta > tb) [ta, tb] = [tb, ta];
    t0 = Math.max(t0, ta);
    t1 = Math.min(t1, tb);
    if (t0 > t1) return false;
  }
  return true;
};

/*
 * Un personnage (rayon ~0,12 m au sol) est-il DANS un mur, plein ou arasé, en dehors d'une porte/d'un passage ?
 * Renvoie l'identifiant du mur traversé, ou null. Sert au contrôle « Personnage à travers un mur » (tools/qc.ts).
 */
export const murTraverse = (d: DonneesDecor, x: number, z: number, rayon = 0.12): string | null => {
  for (const p of d.pieces) {
    for (const m of mursPiece(p)) {
      const dedans = x > m.min[0] - rayon && x < m.max[0] + rayon && z > m.min[2] - rayon && z < m.max[2] + rayon;
      if (!dedans) continue;
      const selonX = m.cote === "nord" || m.cote === "sud";
      // position le long du mur depuis son milieu : vers l'est (nord/sud), vers le nord (ouest/est)
      const u = selonX ? x - p.centre[0] : -(z - p.centre[1]);
      const libre = (p.ouvertures ?? []).some(
        (o) => o.mur === m.cote && basOuverture(o) === 0 && u > o.centre - o.largeur / 2 + rayon && u < o.centre + o.largeur / 2 - rayon,
      );
      if (!libre) return m.id;
    }
  }
  return null;
};
