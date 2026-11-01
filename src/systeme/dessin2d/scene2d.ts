import { Alignement } from "../mots";
import { Ancre, image } from "../timeline";
import type { Expression, PoseBras } from "./types2d";

/*
 * Épisode dessiné en 2D (série « L'héritière cachée ») décrit EN DONNÉES, calé sur la voix par les ancres.
 * Repère « scène » : 1080×1920 (le décor dessiné à l'échelle 1). La caméra 2D montre le point (x, y) de la scène
 * au point ECRAN_CADRE de l'image, avec un zoom (1 = toute la scène). Fichier SANS JSX (lu par tools/qc2d.ts).
 */
export const ECRAN_CADRE = { x: 540, y: 880 } as const;

// Plan de caméra : arrive à l'ancre `a` (déplacement doux de `deplacement` s avant), ou coupe nette (`coupe`)
export type Plan2D = { a: Ancre; decor: string; x: number; y: number; zoom: number; coupe?: boolean; deplacement?: number };

// Clé d'un personnage : ce qui change à l'ancre (expression, bras, regard) ; x / y / echelle = il marche jusque-là
// en `duree` s (la marche commence à l'ancre)
export type Cle2D = {
  a: Ancre;
  expr?: Expression;
  brasG?: PoseBras;
  brasD?: PoseBras;
  regard?: number;
  x?: number;
  y?: number;
  echelle?: number;
  duree?: number;
  pale?: boolean;
  rit?: boolean; // bouche qui s'ouvre en rythme (rire), sans voix
};

export type Perso2D = {
  id: string;
  apparence: string; // clé dans les apparences de l'épisode
  decor: string; // le personnage n'existe que dans ce décor
  voix?: string; // prénom de la voix (mots.json) : la bouche bouge sur ses répliques
  x: number;
  y: number; // pieds, en repère scène
  echelle: number;
  de?: Ancre;
  a?: Ancre;
  figurant?: boolean; // passant de l'arrière-plan (pas contrôlé comme sujet)
  ombre?: boolean; // silhouette sombre (visage caché)
  cles: Cle2D[];
};

// Objet : à chaque clé il va (en `duree` s) à (x, y) ; avec `suit`, (x, y) est un décalage depuis les pieds de ce
// personnage, en pixels de scène (objet porté)
export type CleObjet = { a: Ancre; x: number; y: number; rot?: number; etat?: string; duree?: number; suit?: string };
export type Objet2D = { id: string; type: string; decor: string; de?: Ancre; a?: Ancre; cles: CleObjet[] };
export type TypeEffet = "choc" | "tremble" | "flash" | "eclat";
export type Effet2D = { a: Ancre; type: TypeEffet; duree?: number };
// Onomatopée façon webtoon, en repère ÉCRAN (jamais sur un visage, jamais sous les sous-titres)
export type Onomatopee = { de: Ancre; a: Ancre; texte: string; x: number; y: number; couleur?: string; rot?: number; taille?: number };

export type DonneesScene2D = {
  plans: Plan2D[];
  persos: Perso2D[];
  objets: Objet2D[];
  effets: Effet2D[];
  onomatopees: Onomatopee[];
  etats?: Record<string, Ancre>; // états du décor (ex. « portes » : début de l'ouverture), lus par le décor
};

// ---------------------------------------------------------------- résolution (ancres -> images)

const lisse = (u: number) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
const mix = (a: number, b: number, u: number) => a + (b - a) * u;

export type PlanResolu = Plan2D & { fArrivee: number; fDepart: number };
export type Cadre = { decor: string; x: number; y: number; zoom: number; tenu: boolean };

export const resoudrePlans = (plans: Plan2D[], al: Alignement, fps: number): PlanResolu[] => {
  const res: PlanResolu[] = [];
  plans.forEach((p, i) => {
    const fArrivee = i === 0 ? 0 : image(p.a, al, fps);
    const dep = i === 0 || p.coupe ? 0 : (p.deplacement ?? 0.7);
    const fPrec = i === 0 ? 0 : res[i - 1].fArrivee;
    res.push({ ...p, fArrivee, fDepart: Math.max(fPrec, fArrivee - Math.round(dep * fps)) });
  });
  return res;
};

// Cadre de la caméra à l'image f : déplacement lissé, puis une lente poussée (+3 % par plan) pour garder la vie
export const cadreA = (plans: PlanResolu[], f: number): Cadre => {
  let i = 0;
  while (i + 1 < plans.length && f >= plans[i + 1].fDepart) i++;
  const p = plans[i];
  const suivant = plans[i + 1];
  if (suivant && f >= suivant.fDepart && !suivant.coupe) {
    const u = lisse((f - suivant.fDepart) / Math.max(1, suivant.fArrivee - suivant.fDepart));
    return { decor: suivant.decor, x: mix(p.x, suivant.x, u), y: mix(p.y, suivant.y, u), zoom: mix(p.zoom, suivant.zoom, u), tenu: false };
  }
  const fin = suivant ? suivant.fDepart : p.fArrivee + 90;
  const derive = 1 + 0.03 * Math.min(1, (f - p.fArrivee) / Math.max(30, fin - p.fArrivee));
  return { decor: p.decor, x: p.x, y: p.y, zoom: p.zoom * derive, tenu: f >= p.fArrivee };
};

export const versEcran = (c: Cadre, x: number, y: number) => ({ x: (x - c.x) * c.zoom + ECRAN_CADRE.x, y: (y - c.y) * c.zoom + ECRAN_CADRE.y });

export type EtatPerso = {
  x: number;
  y: number;
  echelle: number;
  expr: Expression;
  brasG: PoseBras;
  brasD: PoseBras;
  regard: number;
  pale: boolean;
  rit: boolean;
  marche: boolean;
};

export const etatPerso = (p: Perso2D, al: Alignement, fps: number, f: number): EtatPerso => {
  const e: EtatPerso = { x: p.x, y: p.y, echelle: p.echelle, expr: "neutre", brasG: "bas", brasD: "bas", regard: 0, pale: false, rit: false, marche: false };
  for (const c of p.cles) {
    const fc = image(c.a, al, fps);
    if (f < fc) break;
    if (c.expr) e.expr = c.expr;
    if (c.brasG) e.brasG = c.brasG;
    if (c.brasD) e.brasD = c.brasD;
    if (c.regard !== undefined) e.regard = c.regard;
    if (c.pale !== undefined) e.pale = c.pale;
    e.rit = !!c.rit;
    if (c.x !== undefined || c.y !== undefined || c.echelle !== undefined) {
      const d = Math.max(1, Math.round((c.duree ?? 1) * fps));
      const u = Math.min(1, (f - fc) / d);
      const v = lisse(u) * 0.3 + u * 0.7;
      const x0 = e.x;
      const y0 = e.y;
      const k0 = e.echelle;
      e.x = mix(x0, c.x ?? x0, v);
      e.y = mix(y0, c.y ?? y0, v);
      e.echelle = mix(k0, c.echelle ?? k0, v);
      e.marche = u < 1;
    }
  }
  return e;
};

export const present = (p: { de?: Ancre; a?: Ancre }, al: Alignement, fps: number, f: number) =>
  (p.de === undefined || f >= image(p.de, al, fps)) && (p.a === undefined || f < image(p.a, al, fps));

// Ouverture de la bouche : sur les mots de SA voix (≈ 5 syllabes/s, leçon du 25/10), ou en rire
export const ouvertureBouche = (voix: string | undefined, rit: boolean, al: Alignement, t: number) => {
  if (rit) return 0.35 + 0.35 * Math.abs(Math.sin((t * Math.PI) / 0.16));
  if (!voix) return 0;
  const parle = al.mots.some((m) => t >= m.debut && t <= m.fin && al.phrases[m.phrase]?.voix === voix);
  return parle ? 0.18 + 0.32 * Math.abs(Math.sin((t * Math.PI) / 0.2)) : 0;
};

// Hauteur du personnage dessiné (pieds -> haut de la tête), en unités locales
export const HAUTEUR_LOCALE = { adulte: 1000, enfant: 650 } as const;

const posCle = (c: CleObjet, persos: Perso2D[], al: Alignement, fps: number, f: number) => {
  if (!c.suit) return { x: c.x, y: c.y };
  const p = persos.find((q) => q.id === c.suit);
  if (!p) throw new Error(`Objet porté par « ${c.suit} » : personnage inconnu`);
  const e = etatPerso(p, al, fps, f);
  return { x: e.x + c.x * (e.echelle / p.echelle), y: e.y + c.y * (e.echelle / p.echelle) };
};

export const etatObjet = (o: Objet2D, persos: Perso2D[], al: Alignement, fps: number, f: number) => {
  let i = 0;
  while (i + 1 < o.cles.length && f >= image(o.cles[i + 1].a, al, fps)) i++;
  const c = o.cles[i];
  const fc = image(c.a, al, fps);
  const cible = posCle(c, persos, al, fps, f);
  const etat = c.etat ?? "normal";
  if (i === 0) return { ...cible, rot: c.rot ?? 0, etat };
  const prec = o.cles[i - 1];
  const depart = posCle(prec, persos, al, fps, fc);
  const u = Math.min(1, (f - fc) / Math.max(1, Math.round((c.duree ?? 0.3) * fps)));
  const v = u * u; // chute : accélère
  return { x: mix(depart.x, cible.x, v), y: mix(depart.y, cible.y, v), rot: mix(prec.rot ?? 0, c.rot ?? 0, v), etat: u < 1 ? (prec.etat ?? "normal") : etat };
};
