import { DonneesEpisode } from "../../systeme/episode";

/*
 * TestDA — test de direction artistique (12 s, 3 plans) — ne pas publier.
 * Vue isométrique en hauteur, décor en coupe, 3D stylisée, vraies textures PBR, occlusion ambiante,
 * lumière chaude contre nuit bleue. Script : videos/testda/script.txt (@p1 @p2 @p3 @p4).
 *
 * Repères : cabine centrée en (0, 0), portes au nord (z = -0.75) ; appartement au nord de la cabine.
 */
export const CABINE = { centre: [0, 0] as [number, number], largeur: 1.6, profondeur: 1.5, hauteur: 2.5 };
export const APPART = { centre: [0, -2.95] as [number, number], largeur: 4.6, profondeur: 4.0 };
export const BOUTON_0: [number, number, number] = [-0.73, 0.81, -0.35];
export const PORTES: [number, number, number] = [0.2, 1.05, -0.66];

export const donnees: DonneesEpisode = {
  id: "testda",
  composition: "TestDA",
  titre: "Test de direction artistique",
  demonstration: true,
  dureeFixe: 12,
  post: { bloom: 0.34, seuilBloom: 0.92, vignette: 0.38, grain: 0.035, exposition: 1.3 },
  decor: {
    pieces: [
      {
        id: "cabine",
        centre: CABINE.centre,
        largeur: CABINE.largeur,
        profondeur: CABINE.profondeur,
        hauteur: CABINE.hauteur,
        sol: "beton",
        murs: "beton",
        pbr: { sol: "rubber_tiles", murs: "metal_plate_02", teinteSol: "#5f646b", teinteMurs: "#c8d6e8", motifSol: 0.6, motifMurs: 0.9, metalMurs: 0.35, gainMurs: 2.8, gainSol: 1.6 },
        ouvertures: [{ mur: "nord", type: "passage", centre: 0, largeur: 0.9, hauteur: 2.05 }],
      },
      {
        id: "appartement",
        centre: APPART.centre,
        largeur: APPART.largeur,
        profondeur: APPART.profondeur,
        sol: "parquet",
        murs: "peint",
        pbr: { sol: "herringbone_parquet", murs: "painted_plaster_wall", teinteMurs: "#e2cfb6", motifSol: 1.4, motifMurs: 1.6, gainSol: 1.3, gainMurs: 1.2 },
        ouvertures: [
          { mur: "sud", type: "passage", centre: 0, largeur: 0.9, hauteur: 2.05 },
          { mur: "nord", type: "fenetre", centre: 0.7, largeur: 1.5, hauteur: 1.4, bas: 0.85 },
        ],
      },
    ],
    // Meubles de base (le mobilier détaillé est dans Episode.tsx) : déclarés ici pour les contrôles d'obstacles
    meubles: [
      { type: "canape", position: [-1.85, 0, -3.0], rotation: 90, id: "canape", invisible: true },
      { type: "etagere", position: [-1.0, 0, -4.73], id: "bibliotheque", invisible: true },
      { type: "table", position: [1.35, 0, -2.3], id: "table", invisible: true },
    ],
    exterieur: { ville: { allumees: 0.3, distance: 12 }, neige: { densite: 0.8, vent: 0.4 }, ciel: "nuit" },
  },
  personnages: [
    {
      // Face à la caméra, elle appuie sur le 0 bras tendu sur le côté sans regarder, puis se retourne vers les portes
      id: "heroine",
      variante: "heroine",
      depart: { position: [-0.17, 0, -0.33], orientation: 0 },
      trajet: [{ a: "p2:ouvrent+0.75", position: [-0.12, 0, -0.1], orientation: 180, vitesse: 0.5 }],
      poses: [
        { a: 0.2, pose: "debout" },
        { a: "p1:appuie-0.3", pose: "boutonCote", transition: 0.45 },
        { a: "p1:zero.fin+0.3", pose: "debout", transition: 0.4 },
        { a: "p3:appartement-0.2", pose: "inquiet", transition: 0.35 },
      ],
    },
    {
      // « Quelqu'un » sur le canapé : son double, assis au bord, tourné vers les portes
      id: "double",
      variante: "heroine",
      depart: { position: [-1.4, 0.29, -3.0], orientation: 90 },
      poses: [{ a: 0, pose: "assis" }],
    },
  ],
  camera: [
    // Plan 1 — isométrique (≈ 30° : le mur de la cabine cache encore le double), lente poussée dès la 1re image
    { a: 0, position: [5.9, 6.0, 6.3], cible: [-0.05, 0.75, -0.2], fov: 36 },
    { a: "p1:zero", position: [5.0, 5.0, 5.4], cible: [-0.1, 0.8, -0.25], fov: 36, deplacement: 2.4 },
    // Plan 2 — plus près : son visage, le bouton allumé, les portes qui s'ouvrent derrière elle
    { a: "p2", position: [2.0, 2.4, 2.7], cible: [-0.3, 0.3, -0.45], fov: 38, deplacement: 0.9 },
    // Plan 3 — on s'élève côté est-sud-est : l'appartement entier, le canapé face à nous
    { a: "p3:appartement", position: [6.4, 7.6, 1.7], cible: [-0.45, -0.5, -1.45], fov: 42, deplacement: 1.5, par: [4.8, 9.2, 4.8] },
    { a: "fin+3.2", position: [5.8, 6.9, 1.35], cible: [-0.55, -0.45, -1.55], fov: 40, deplacement: 3.6 },
  ],
  hud: [
    { type: "montre", jour: 1, heure: "23:12", temperature: 19, changements: [{ a: "p3", heure: "23:13" }] },
    { type: "moodles", de: 0.4, a: "p2-0.05", moodles: [{ nom: "fatigue", niveau: 2 }] },
    { type: "etiquette", de: "p2+0.1", a: "p2:hall-0.1", texte: "RDC ?", point: PORTES, style: "ressource" },
    { type: "moodles", de: "p2", a: "p3-0.05", moodles: [{ nom: "panique", niveau: 1 }] },
    { type: "moodles", de: "p3", a: "fin+4", moodles: [{ nom: "panique", niveau: 3 }] },
    { type: "fiche", de: "p4", a: "fin+0.5", icone: "maison", titre: "Appartement 4B", lignes: ["Votre adresse", "Porte fermée ce matin"], cote: "gauche" },
    { type: "carton", de: "fin+0.8", partie: 1, titre: "L'ascenseur", verifie: "23/10/2026" },
  ],
  sons: [
    { a: "p1:zero", id: "knock/desk", gain: -10 },
    { a: "p2", id: "impact/deep", gain: -12 },
    { a: "p2:ouvrent", id: "whoosh_big/thump_deep", gain: -6 },
    { a: "p3", id: "pro_sub_drop/low", gain: -2 },
    { a: "p4:canape", id: "reverse_swell/dark", gain: -5 },
    { a: "fin+0.8", id: "pro_impact/deep", gain: -4 },
  ],
  ambiances: [
    { type: "drone", de: 0, a: "fin+4", niveau: -1 },
    { type: "ville", de: "p2:ouvrent", a: "fin+4", niveau: 0, fondu: 1.5 },
    { type: "coeur", de: "p3", a: "fin+4", niveau: -1, bpm: 84 },
  ],
  sujets: [
    { de: 0, a: "fin", personnage: "heroine", hauteur: 0.7 },
    { de: 0, a: "fin", personnage: "heroine", hauteur: 1.08 },
    { de: "p4", a: "fin", personnage: "double", hauteur: 1.35 },
  ],
};
