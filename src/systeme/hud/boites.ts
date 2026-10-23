import { EtatCamera, project } from "../camera";
import { LARGEUR, Y_SOUS_TITRES, ZONE_SURE } from "../format";
import { clamp } from "../maths";
import { Bloc } from "../mots";
import { ElementHudResolu } from "./types";

// Position de chaque élément du HUD en pixels (1080×1920). Source unique : rendu ET contrôle qualité.
export type Rect = { x: number; y: number; l: number; h: number };

export const HUD = {
  marge: 20,
  montre: { x: ZONE_SURE.gauche, y: 196, l: 300, h: 112 },
  tactique: { x: 380, y: 196, l: ZONE_SURE.droite - 380, h: 112 },
  moodles: { x: ZONE_SURE.gauche, y: 324, taille: 84, ecart: 12 },
  fiche: { l: 400, h: 236 },
  inventaire: { y: 1340, h: 140, case: 112 },
  compte: { l: 300, h: 170, y: 1316 },
  etiquette: { h: 62, parCaractere: 21, rembourrage: 44 },
  carton: { x: 90, y: 520, l: 810, h: 700 },
  sousTitres: { taille: 84, interligne: 96, largeurMax: ZONE_SURE.droite - ZONE_SURE.gauche, parCaractere: 0.7 },
} as const;

export const largeurEtiquette = (texte: string) => HUD.etiquette.rembourrage + HUD.etiquette.parCaractere * texte.length;

// Place un rectangle près d'un point projeté, à droite si possible, en restant dans la zone sûre
const presDuPoint = (px: number, py: number, l: number, h: number): Rect => {
  const droite = px + 40 + l <= ZONE_SURE.droite;
  const x = droite ? px + 40 : px - 40 - l;
  return {
    x: clamp(x, ZONE_SURE.gauche, ZONE_SURE.droite - l),
    y: clamp(py - h - 30, ZONE_SURE.haut + 140, ZONE_SURE.bas - h),
    l,
    h,
  };
};

export const boiteHud = (e: ElementHudResolu, cam?: EtatCamera): Rect & { ancre?: { x: number; y: number } } => {
  switch (e.type) {
    case "montre":
      return { ...HUD.montre };
    case "tactique":
      return { ...HUD.tactique };
    case "moodles": {
      const n = e.moodles.length;
      return { x: HUD.moodles.x, y: HUD.moodles.y, l: n * HUD.moodles.taille + (n - 1) * HUD.moodles.ecart, h: HUD.moodles.taille };
    }
    case "fiche": {
      if (e.point && cam) {
        const p = project(e.point, cam);
        return { ...presDuPoint(p.x, p.y, HUD.fiche.l, HUD.fiche.h), ancre: { x: p.x, y: p.y } };
      }
      // Sans point 3D : sous la montre (gauche) ou sous le bandeau (droite, par défaut)
      // à gauche, elle se place sous les moodles (qui occupent y = 324 à 408)
      const x = e.cote === "gauche" ? ZONE_SURE.gauche : ZONE_SURE.droite - HUD.fiche.l;
      return { x, y: e.cote === "gauche" ? HUD.moodles.y + HUD.moodles.taille + HUD.marge : 336, l: HUD.fiche.l, h: HUD.fiche.h };
    }
    case "inventaire": {
      const l = e.objets.length * HUD.inventaire.case + 24;
      return { x: (LARGEUR - l) / 2 - 40, y: HUD.inventaire.y, l, h: HUD.inventaire.h };
    }
    case "compte":
      return { x: (LARGEUR - HUD.compte.l) / 2 - 40, y: HUD.compte.y, l: HUD.compte.l, h: HUD.compte.h };
    case "etiquette": {
      const l = largeurEtiquette(e.texte);
      if (!cam) return { x: 0, y: 0, l, h: HUD.etiquette.h };
      const p = project(e.point, cam);
      return { ...presDuPoint(p.x, p.y, l, HUD.etiquette.h), ancre: { x: p.x, y: p.y } };
    }
    case "carton":
      return { ...HUD.carton };
  }
};

// Découpe d'un bloc de sous-titres en lignes (estimation de largeur Montserrat 900 majuscules)
export const lignesSousTitre = (bloc: Bloc): string[][] => {
  const max = HUD.sousTitres.largeurMax;
  const cw = HUD.sousTitres.taille * HUD.sousTitres.parCaractere;
  const lignes: string[][] = [[]];
  let largeur = 0;
  for (const m of bloc.mots) {
    const l = (m.mot.length + 1) * cw;
    if (largeur + l > max && lignes[lignes.length - 1].length) {
      lignes.push([]);
      largeur = 0;
    }
    lignes[lignes.length - 1].push(m.mot);
    largeur += l;
  }
  return lignes;
};

export const boiteSousTitre = (bloc: Bloc): Rect => {
  const lignes = lignesSousTitre(bloc);
  const cw = HUD.sousTitres.taille * HUD.sousTitres.parCaractere;
  const l = Math.min(HUD.sousTitres.largeurMax, Math.max(...lignes.map((li) => li.join(" ").length)) * cw);
  const h = lignes.length * HUD.sousTitres.interligne + 16;
  const centre = (ZONE_SURE.gauche + ZONE_SURE.droite) / 2;
  return { x: centre - l / 2, y: Y_SOUS_TITRES - h / 2, l, h };
};

export const chevauche = (a: Rect, b: Rect, marge = 0) =>
  a.x < b.x + b.l + marge && b.x < a.x + a.l + marge && a.y < b.y + b.h + marge && b.y < a.y + a.h + marge;

export const contient = (r: Rect, x: number, y: number, marge = 0) =>
  x > r.x - marge && x < r.x + r.l + marge && y > r.y - marge && y < r.y + r.h + marge;
