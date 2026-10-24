import { plan } from "../../systeme/camera";
import { DonneesEpisode } from "../../systeme/episode";
import { Vec3 } from "../../systeme/maths";

/*
 * H+72 — Partie 1 « Neuf litres ». Script : videos/001-h72/script.txt (découpage : script.md, section 5).
 * Appartement d'Inès au 6e, en coupe, d'ouest en est : salon | cuisine | salle d'eau | entrée.
 * Seuls les murs du fond (nord) et le mur ouest du salon sont entiers : on filme depuis le sud-est.
 * Sous l'appartement : l'immeuble en coupe (5 étages + rez-de-chaussée), la pompe au sous-sol (y ≈ -17,4).
 */
export const ETAGE = 2.9; // hauteur d'un étage (m)
export const SOUS_SOL = -6 * ETAGE; // sol du sous-sol

// Repères (points 3D) partagés par le rendu (Episode.tsx) et les étiquettes du HUD
export const P = {
  robinetCuisine: [0.55, 1.12, -1.36] as Vec3, // bout du bec
  colonne: [1.6, -1.52] as [number, number], // colonne montante (x, z)
  pompe: [1.0, SOUS_SOL + 0.55, -1.0] as Vec3,
  table: [-0.4, 0, 0.45] as Vec3,
  etagere: [-1.15, 0, -1.4] as Vec3,
  wc: [2.15, 0, -1.3] as Vec3,
  lavabo: [2.85, 0, -1.4] as Vec3,
  robinetLavabo: [2.85, 0.98, -1.3] as Vec3,
  tableau: [3.12, 1.32, -1.52] as Vec3,
  placard: [3.85, 0, -1.3] as Vec3, // placard du ballon (porte au sud)
  ballon: [3.85, 1.15, -1.32] as Vec3,
  vanne: [3.68, 0.24, -1.12] as Vec3,
  vidange: [3.98, 0.3, -1.04] as Vec3,
  seau: [3.98, 0, -0.78] as Vec3,
  carafe: [3.62, 0, -0.12] as Vec3, // par terre, à côté du seau (on filtre l'eau vidée dans le seau)
  radiateur: [-3.4, 0.12, -1.5] as Vec3,
  purge: [-2.98, 0.6, -1.45] as Vec3,
  porte: [5.0, 0, -1.6] as Vec3, // porte d'entrée (mur nord de l'entrée), charnière à l'ouest
  verrou: [5.3, 1.02, -1.53] as Vec3,
};

const INES = "ines";

export const donnees: DonneesEpisode = {
  id: "001-h72",
  titre: "H+72 — Partie 1 : Neuf litres",
  queue: 5.5,
  post: { bloom: 0.32, seuilBloom: 0.92, vignette: 0.36, grain: 0.03, exposition: 1.35 },
  decor: {
    pieces: [
      {
        id: "salon",
        centre: [-3.4, 0],
        largeur: 3.4,
        profondeur: 3.2,
        sol: "parquet",
        murs: "peint",
        pbr: { sol: "herringbone_parquet", murs: "painted_plaster_wall", teinteMurs: "#d9c7ae", motifSol: 1.4, motifMurs: 1.6, gainSol: 1.3, gainMurs: 1.2 },
        ouvertures: [{ mur: "nord", type: "fenetre", centre: 0, largeur: 1.4, hauteur: 1.25, bas: 0.95 }, { mur: "est", type: "passage", centre: 0, largeur: 1.0, hauteur: 2.05 }],
      },
      {
        id: "cuisine",
        centre: [0, 0],
        largeur: 3.4,
        profondeur: 3.2,
        sol: "carrelage",
        murs: "peint",
        couleurSol: "#b7ada0",
        devant: ["sud", "est", "ouest"],
        pbr: { murs: "painted_plaster_wall", teinteMurs: "#e6dccb", motifMurs: 1.6, gainMurs: 1.25 },
        ouvertures: [{ mur: "nord", type: "fenetre", centre: 0.55, largeur: 1.0, hauteur: 0.85, bas: 1.32 }, { mur: "ouest", type: "passage", centre: 0, largeur: 1.0, hauteur: 2.05 }, { mur: "est", type: "passage", centre: 0.25, largeur: 1.0, hauteur: 2.05 }],
      },
      {
        id: "salle-eau",
        centre: [3.0, 0],
        largeur: 2.6,
        profondeur: 3.2,
        sol: "carrelage",
        murs: "carrelage",
        couleurSol: "#8f9aa0",
        couleurMurs: "#dfe3e2",
        devant: ["sud", "est", "ouest"],
        // passages vers la cuisine et vers l'entrée (on ne marche jamais à travers une cloison, même arasée)
        ouvertures: [{ mur: "ouest", type: "passage", centre: 0.25, largeur: 1.0, hauteur: 2.05 }, { mur: "est", type: "passage", centre: 0.2, largeur: 1.0, hauteur: 2.05 }],
      },
      {
        id: "entree",
        centre: [5.0, 0],
        largeur: 1.4,
        profondeur: 3.2,
        sol: "parquet",
        murs: "peint",
        devant: ["sud", "est", "ouest"],
        pbr: { sol: "herringbone_parquet", murs: "painted_plaster_wall", teinteMurs: "#cdbfa8", motifSol: 1.4, motifMurs: 1.6, gainSol: 1.2, gainMurs: 1.15 },
        // la porte d'entrée (battant, verrou) est dessinée dans Episode.tsx
        ouvertures: [{ mur: "nord", type: "passage", centre: 0, largeur: 0.92, hauteur: 2.05 }, { mur: "ouest", type: "passage", centre: 0.2, largeur: 1.0, hauteur: 2.05 }],
      },
      {
        // palier de l'immeuble derrière la porte d'entrée (sans lui, la porte ouvrait sur le vide)
        id: "palier",
        centre: [5.0, -2.45],
        largeur: 2.4,
        profondeur: 1.5,
        sol: "beton",
        murs: "beton",
        couleurSol: "#5a5650",
        couleurMurs: "#6a645b",
        devant: ["sud", "est"],
        ouvertures: [{ mur: "sud", type: "passage", centre: 0, largeur: 0.92, hauteur: 2.05 }],
      },
    ],
    meubles: [
      // cuisine
      { type: "evier", position: [0.3, 0, -1.24], id: "evier" },
      { type: "etagere", position: P.etagere, id: "etagere" },
      { type: "cuisiniere", position: [1.2, 0, -1.25], id: "cuisiniere" },
      { type: "table", position: P.table, id: "table", couleur: "#8a6440" },
      { type: "chaise", position: [-1.25, 0, 0.45], rotation: 90, id: "chaise" },
      ...[[-0.93, 0.52], [-0.81, 0.52], [-0.69, 0.52], [-0.93, 0.66], [-0.81, 0.66], [-0.69, 0.66]].map(([x, z], i) => ({ type: "bouteille" as const, position: [x, 0.76, z] as Vec3, id: `bouteille${i}` })),
      // salle d'eau (WC, lavabo et placard du ballon dessinés dans Episode.tsx)
      { type: "chaise", position: P.wc, id: "wc", invisible: true },
      { type: "chaise", position: [P.lavabo[0], 0, -1.42], id: "lavabo", invisible: true },
      { type: "placard", position: P.placard, id: "placard", echelle: 0.85, invisible: true },
      // seau et carafe (dessinés dans Episode.tsx) : obstacles pour les contrôles
      { type: "jerrican", position: [P.seau[0], 0, P.seau[2]], id: "seau", echelle: 0.8, invisible: true },
      { type: "bouteille", position: [P.carafe[0], 0, P.carafe[2]], id: "carafe", echelle: 1.6, invisible: true },
      // salon
      { type: "radiateur", position: P.radiateur, id: "radiateur" },
      { type: "etagere", position: [-4.55, 0, -1.42], id: "bibliotheque", invisible: true },
      { type: "canape", position: [-4.6, 0, 0.55], rotation: 90, id: "canape", invisible: true },
    ],
    exterieur: { ville: { allumees: 0, distance: 13 }, neige: { densite: 0.7, vent: 0.35 }, ciel: "crepuscule" },
  },
  personnages: [
    {
      id: INES,
      variante: "heroine",
      depart: { position: [0.36, 0, -0.72], orientation: 170 },
      trajet: [
        // hook2 : elle se retourne vers la table et ses 6 bouteilles
        { a: "hook2.fin", position: [-0.3, 0, -0.12], orientation: 0, vitesse: 0.9 },
        // t1 : l'étagère des conserves, puis retour à la table
        { a: "t1:manger", position: [-0.72, 0, -0.92], orientation: 205, vitesse: 1.0 },
        { a: "t1a:peches", position: [-0.3, 0, -0.12], orientation: 0, vitesse: 1.1 },
        // t2 : la salle d'eau
        { a: "t2a", position: [1.97, 0, -0.38], orientation: 95, vitesse: 1.3 },
        { a: "t2c:lave", position: [2.62, 0, -0.78], orientation: 0, vitesse: 1.0 },
        { a: "t2d:sale", position: [2.62, 0, -1.04], orientation: -90, vitesse: 0.9 },
        // t3 : le ballon
        { a: "t3:ballon", position: [3.42, 0, -0.55], orientation: 170, vitesse: 1.1 },
        // les 4 gestes : elle se place à côté de chaque élément (jamais devant ce que montre l'étiquette)
        { a: "t3b:coupe", position: [2.62, 0, -0.5], orientation: 145, vitesse: 1.0 },
        { a: "t3c:froide", position: [3.12, 0, -0.8], orientation: 130, vitesse: 1.0 },
        { a: "t3d:robinet", position: [3.52, 0, -0.6], orientation: 235, vitesse: 0.85 },
        { a: "t3e:robinet", position: [3.42, 0, -0.74], orientation: 120, vitesse: 0.8 },
        // pendant l'erreur (radiateurs, au salon) : elle gagne l'entrée, hors champ
        { a: "calme", position: [4.62, 0, -0.32], orientation: 0, vitesse: 0.8 },
        { a: "calme2:ballon", position: [4.6, 0, -0.32], orientation: 270, vitesse: 0.5 },
        // garde : elle sort par la porte d'entrée (nord) et disparaît derrière le mur
        { a: "garde:part", position: [4.95, 0, -1.2], orientation: 180, vitesse: 1.0 },
        { a: "garde:de", position: [4.95, 0, -2.3], orientation: 180, vitesse: 1.3 },
        // retour (J4, 6 h) : elle rentre avec sa lampe, va au placard
        { a: "ouvre", position: [4.6, 0, -0.5], orientation: 220, vitesse: 1.36 },
        { a: "ouvre:bas", position: [3.42, 0, -0.62], orientation: 165, vitesse: 1.4, chemin: [[4.3, 0, -0.2]] },
        { a: "vide:quelqu'un", position: [3.45, 0, -0.6], orientation: 70, vitesse: 0.5 },
      ],
      poses: [
        { a: 0, pose: "mainTendue" },
        { a: "hook2", pose: "debout", transition: 0.4 },
        { a: "promesse2:derniere", pose: "inquiet", transition: 0.4 },
        { a: "t1:mouille", pose: "mainTendue", transition: 0.35 },
        { a: "t1a", pose: "debout", transition: 0.3 },
        { a: "t1a:peches", pose: "mainTendue", transition: 0.3 },
        { a: "t1b", pose: "debout", transition: 0.4 },
        { a: "t1d:sel", pose: "inquiet", transition: 0.4 },
        { a: "t2", pose: "debout", transition: 0.3 },
        { a: "t2c:lave", pose: "accroupi", transition: 0.45 },
        { a: "t2d", pose: "debout", transition: 0.4 },
        { a: "t2e", pose: "mainTendue", transition: 0.35 },
        { a: "t3", pose: "debout", transition: 0.3 },
        { a: "t3b:coupe", pose: "mainTendue", transition: 0.3 },
        { a: "t3c:froide", pose: "accroupi", transition: 0.4 },
        { a: "t3d:robinet", pose: "mainTendue", transition: 0.4 },
        { a: "t3e:vide", pose: "accroupi", transition: 0.4 },
        { a: "t3f", pose: "debout", transition: 0.4 },
        { a: "garde:part", pose: "mainTendue", transition: 0.3 },
        { a: "garde:pour", pose: "debout", transition: 0.3 },
        { a: "ouvre:bas", pose: "accroupi", transition: 0.4 },
        { a: "chute", pose: "debout", transition: 0.4 },
        { a: "chute:vide", pose: "mainTendue", transition: 0.25 },
        { a: "sec", pose: "inquiet", transition: 0.4 },
      ],
      // visage calé sur le texte (le robinet crache, elle a un plan, le doute, la peur à la fin)
      expressions: [
        { a: 0, expression: "inquiet" },
        { a: "hook:air", expression: "surpris", transition: 0.2 },
        { a: "hook2", expression: "inquiet" },
        { a: "promesse", expression: "decide" },
        { a: "t1b:jus", expression: "sourire" },
        { a: "t1c", expression: "decide" },
        { a: "t1d:sel", expression: "inquiet" },
        { a: "t2", expression: "decide" },
        { a: "t2a:chasse", expression: "surpris", transition: 0.2 },
        { a: "t2b", expression: "inquiet" },
        { a: "t2c", expression: "decide" },
        { a: "t2e:vide", expression: "soulage" },
        { a: "t3", expression: "decide" },
        { a: "t3f:retient", expression: "sourire" },
        { a: "calme", expression: "sourire" },
        { a: "garde", expression: "neutre" },
        { a: "retour", expression: "fatigue" },
        { a: "ouvre:bas", expression: "decide" },
        { a: "rien:goutte", expression: "surpris", transition: 0.2 },
        { a: "chute:vide", expression: "peur", transition: 0.15 },
        { a: "sec", expression: "inquiet" },
        { a: "vide:quelqu'un", expression: "peur", transition: 0.2 },
      ],
      lampe: { de: "retour:matin", a: "fin+6", puissance: 0.07 },
    },
    {
      // Fantôme du mauvais réflexe : Inès à genoux qui vide le radiateur du salon dans une bouteille
      id: "fantome-radiateur",
      variante: "heroine",
      depart: { position: [-2.55, 0, -1.18], orientation: -90 },
      poses: [{ a: 0, pose: "accroupi" }],
      fantome: { de: "erreur", a: "erreur4.fin+0.2" },
    },
  ],
  camera: [
    // HOOK — gros plan sur le robinet qui crache de l'air, poussée dès la 1re image
    { a: 0, ...plan(P.robinetCuisine, { azimut: 42, elevation: 30, distance: 1.9, fov: 40, y: 600, x: 560 }) },
    { a: "hook:air", ...plan(P.robinetCuisine, { azimut: 38, elevation: 26, distance: 1.15, fov: 38, y: 620, x: 560 }), deplacement: 1.9 },
    // hook2 — recul : Inès, la table et les 6 bouteilles
    { a: "hook2:neuf", ...plan([-0.3, 0.95, -0.12], { azimut: 18, elevation: 24, distance: 4.3, fov: 40, y: 600 }), deplacement: 0.9 },
    // RÉCAP — on sort : tout l'immeuble, noir, dans la ville sans courant
    { a: "recap1:electricite", position: [7.5, -2.0, 30.0], cible: [0.6, -7.6, 0], fov: 44, deplacement: 1.0, par: [5.0, 4.0, 14.0] },
    // la pompe du sous-sol
    { a: "recap2:pompe", ...plan(P.pompe, { azimut: 35, elevation: 24, distance: 3.6, fov: 40, y: 600 }), deplacement: 1.0 },
    // remontée le long de la colonne d'eau jusqu'au 6e
    { a: "recap3:sixieme", ...plan([0.7, 0.7, -0.7], { azimut: 32, elevation: 22, distance: 6.8, fov: 42, y: 640 }), deplacement: 1.25 },
    // Inès, de face (elle fait sa liste) ; fiche à gauche
    { a: "promesse:connait", ...plan([-0.3, 1.05, -0.12], { azimut: 8, elevation: 12, distance: 3.6, fov: 38, y: 600, x: 690 }), deplacement: 1.0 },
    // « la dernière vaut deux cents litres » : glissement vers le placard fermé de la salle d'eau
    { a: "promesse2:deux", ...plan([3.85, 1.0, -1.05], { azimut: 28, elevation: 18, distance: 3.6, fov: 40, y: 640 }), deplacement: 1.1 },
    // TACTIQUE 1 — l'étagère des conserves
    { a: "t1:mouille", ...plan([-0.95, 0.9, -1.1], { azimut: 24, elevation: 16, distance: 3.6, fov: 40, y: 660 }), deplacement: 1.0 },
    { a: "t1a:sirop", ...plan([-0.3, 0.95, -0.12], { azimut: 14, elevation: 22, distance: 3.9, fov: 40, y: 650 }), deplacement: 0.9 },
    { a: "t1b:jus", ...plan([-0.12, 0.84, 0.33], { azimut: -28, elevation: 38, distance: 1.25, fov: 34, y: 640 }), deplacement: 0.7 },
    { a: "t1c:chips", ...plan([-0.3, 0.85, 0.15], { azimut: 14, elevation: 26, distance: 3.6, fov: 38, y: 640 }), deplacement: 0.7 },
    // TACTIQUE 2 — les toilettes
    { a: "t2:toilettes", ...plan([2.15, 0.8, -0.85], { azimut: 0, elevation: 22, distance: 4.0, fov: 42, y: 660, x: 560 }), deplacement: 1.3 },
    { a: "t2c:lave", ...plan([2.62, 0.72, -0.62], { azimut: 10, elevation: 20, distance: 3.7, fov: 40, y: 660 }), deplacement: 0.9 },
    { a: "t2d:cuvette", ...plan([2.35, 0.7, -1.1], { azimut: -12, elevation: 26, distance: 4.0, fov: 40, y: 660 }), deplacement: 1.0 },
    // TACTIQUE 3 — le ballon (placard qui s'ouvre)
    { a: "t3:ballon", ...plan([3.85, 1.0, -1.3], { azimut: 12, elevation: 15, distance: 3.3, fov: 40, y: 660, x: 560 }), deplacement: 1.7 },
    // les 4 gestes, en un seul plan tenu (étiquettes numérotées)
    { a: "t3b", ...plan([3.28, 0.8, -1.1], { azimut: 10, elevation: 14, distance: 4.6, fov: 46, y: 620, x: 520 }), deplacement: 0.5 },
    { a: "t3f:cafe", ...plan([3.75, 0.2, -0.4], { azimut: 35, elevation: 32, distance: 1.9, fov: 36, y: 640 }), deplacement: 0.5 },
    // ERREUR — les radiateurs du salon (fantôme)
    { a: "erreur:jamais", ...plan([-2.95, 0.45, -1.25], { azimut: -20, elevation: 20, distance: 3.3, fov: 40, y: 640, x: 470 }), deplacement: 1.3 },
    { a: "erreur2:circuit", ...plan([-3.4, 0.45, -1.45], { azimut: -15, elevation: 15, distance: 2.1, fov: 36, y: 640 }), deplacement: 0.8 },
    { a: "erreur3:pleine", ...plan([-2.95, 0.18, -1.3], { azimut: -25, elevation: 25, distance: 1.5, fov: 34, y: 640, x: 600 }), deplacement: 0.6 },
    { a: "erreur4:bouillie", ...plan([-2.95, 0.45, -1.25], { azimut: -20, elevation: 22, distance: 3.7, fov: 40, y: 640, x: 560 }), deplacement: 0.9 },
    // FAUSSE SÉCURITÉ — Inès dans l'entrée, tranquille
    { a: "calme", ...plan([4.62, 1.0, -0.32], { azimut: 15, elevation: 12, distance: 3.5, fov: 38, y: 620, x: 520 }), deplacement: 1.4 },
    { a: "calme2:ballon", ...plan([4.2, 0.9, -0.65], { azimut: -20, elevation: 18, distance: 4.4, fov: 42, y: 640 }), deplacement: 0.8 },
    // la porte qui se referme et le verrou qui tourne (objet planté) ; la nuit passe sur ce plan fixe
    { a: "garde:heures", ...plan(P.verrou, { azimut: 18, elevation: 8, distance: 1.6, fov: 36, y: 640, x: 480 }), deplacement: 0.7 },
    // TWIST — 6 h du matin, elle rentre
    { a: "retour:rentre", ...plan([4.85, 0.95, -1.0], { azimut: 22, elevation: 16, distance: 3.6, fov: 42, y: 620 }), deplacement: 0.6 },
    { a: "ouvre:bas", ...plan([3.65, 0.4, -0.85], { azimut: 25, elevation: 22, distance: 3.6, fov: 38, y: 700 }), deplacement: 0.9 },
    { a: "rien:goutte+0.2", ...plan(P.vidange, { azimut: 15, elevation: 55, distance: 1.2, fov: 32, y: 640 }), deplacement: 0.8 },
    { a: "chute:vide", ...plan([3.85, 1.0, -1.25], { azimut: 20, elevation: 15, distance: 3.0, fov: 40, y: 640 }), deplacement: 1.0 },
    { a: "sec:sec", ...plan([3.85, 0.02, -1.2], { azimut: 12, elevation: 45, distance: 1.7, fov: 36, y: 660 }), deplacement: 1.0 },
    { a: "vide:quelqu'un", ...plan([3.45, 1.0, -0.6], { azimut: 35, elevation: 12, distance: 3.3, fov: 40, y: 600, x: 460 }), deplacement: 0.9 },
    { a: "fin:seule", ...plan(P.verrou, { azimut: 10, elevation: 6, distance: 1.15, fov: 32, y: 640, x: 500 }), deplacement: 1.0 },
    { a: "fin+3.0", ...plan(P.verrou, { azimut: 8, elevation: 5, distance: 0.95, fov: 32, y: 640, x: 500 }), deplacement: 2.0 },
  ],
  hud: [
    {
      type: "montre",
      a: "fin+0.7", // la montre laisse la place au carton de fin
      jour: 3,
      heure: "07:40",
      temperature: 13,
      changements: [
        { a: "calme", heure: "18:05", temperature: 12 },
        { a: "retour", jour: 4, heure: "06:02", temperature: 11 },
      ],
    },
    { type: "inventaire", de: "hook2:neuf", a: "recap1.fin", objets: [{ icone: "eau", quantite: 9, unite: "L" }], surligne: 0 },
    { type: "etiquette", de: "recap2:pompe", a: "recap3-0.25", texte: "Pompe · arrêt", point: P.pompe, style: "danger" },
    { type: "fiche", de: "promesse:connait", a: "promesse2-0.05", icone: "trousse", titre: "Inès", lignes: ["34 ans · infirmière", "6e étage", "Eau : 9 litres"], cote: "gauche" },
    { type: "tactique", de: "t1", a: "t1d.fin", numero: 1, total: 3, titre: "Manger mouillé" },
    { type: "moodles", de: "t1d", a: "t1d.fin+0.4", moodles: [{ nom: "soif", niveau: 2 }] },
    { type: "tactique", de: "t2", a: "t2e.fin", numero: 2, total: 3, titre: "Les toilettes" },
    { type: "inventaire", de: "t2a:neuf", a: "t2b:coup", objets: [{ icone: "eau", quantite: 0, unite: "L" }], surligne: 0 },
    { type: "inventaire", de: "t2b:coup", a: "t2c.fin", objets: [{ icone: "eau", quantite: 9, unite: "L" }] },
    { type: "tactique", de: "t3", a: "t3a.fin", numero: 3, total: 3, titre: "Le ballon d'eau chaude" },
    { type: "fiche", de: "t3a", a: "t3b", icone: "eau", titre: "Ballon", lignes: ["200 litres", "Eau du réseau, potable"], cote: "gauche" },
    { type: "etiquette", de: "t3b+0.1", a: "t3c", texte: "1 · Disjoncteur", point: P.tableau, style: "ressource" },
    { type: "etiquette", de: "t3c", a: "t3d+0.1", texte: "2 · Eau froide", point: P.vanne, style: "ressource" },
    { type: "etiquette", de: "t3d:robinet", a: "t3e+0.4", texte: "3 · Air", point: P.robinetLavabo, style: "ressource" },
    { type: "etiquette", de: "t3e", a: "t3f-0.05", texte: "4 · Vidange", point: P.vidange, style: "ressource" },
    { type: "etiquette", de: "erreur:jamais", a: "erreur2-0.25", texte: "Danger", point: P.purge, style: "danger" },
    { type: "fiche", de: "erreur3", a: "erreur4.fin", icone: "danger", titre: "Eau de radiateur", lignes: ["Produits anti-rouille", "Non potable", "Même bouillie"], cote: "gauche" },
    { type: "etiquette", de: "garde:de", a: "retour:rentre-0.62", texte: "Fermé à clé", point: P.verrou, style: "normal" },
    { type: "carton", de: "fin+0.7", partie: 2, titre: "Le froid", verifie: "23/10/2026", question: "Qui a vidé le ballon ?", choix: ["Un voisin", "Quelqu'un qui a sa clé"] },
  ],
  sons: [
    // ---- transitions et moments forts (sombres) ----
    { a: "hook:air", id: "impact/deep", gain: -12 },
    { a: "hook2:neuf", id: "cut_hit/sub", gain: -10 },
    { a: "recap1:sans", id: "whoosh_big/swell", gain: -7 },
    { a: "recap2:arrete", id: "pro_sub_drop/low", gain: -3 },
    { a: "recap3:sixieme", id: "whoosh_big/deep", gain: -9 },
    { a: "promesse2:deux", id: "reverse_swell/dark", gain: -9 },
    { a: "t1", id: "pro_impact/short", gain: -10 },
    { a: "t1:manger", id: "whoosh_fast/heavy", gain: -12 },
    { a: "t2", id: "pro_impact/short", gain: -10 },
    { a: "t2a:neuf", id: "whoosh_big/thump_deep", gain: -8 },
    { a: "t3", id: "pro_impact/short", gain: -10 },
    { a: "erreur-0.07", id: "cut_hit/sub", gain: -10 },
    { a: "erreur:jamais", id: "pro_impact/deep", gain: -6 },
    { a: "erreur4:potable", id: "downlifter/sub_sink", gain: -9 },
    { a: "calme2-0.21", id: "cut_hit/punch", gain: -13 },
    { a: "retour", id: "whoosh_big/thump_deep", gain: -7 },
    { a: "rien:goutte", id: "riser/dark", gain: -14 },
    { a: "chute:vide.fin", id: "pro_sub_drop/low", gain: -3 },
    { a: "vide", id: "whoosh_fast/heavy", gain: -11 },
    { a: "fin-0.19", id: "cut_hit/sub", gain: -10 },
    { a: "fin:cle", id: "pro_impact/deep", gain: -4 },
    { a: "fin+0.7", id: "impact/deep", gain: -8 },
    // ---- bruitages d'objets (foley) ----
    // hook : le robinet tousse et crache des gouttes
    { a: "hook:robinet", id: "drip/drop", gain: -9 },
    { a: "hook:crachait", id: "drip/bubble", gain: -9 },
    { a: "hook:air", id: "drip/drop", gain: -11 },
    // tactique 1 : les conserves posées sur la table, une par mot ; la boîte qu'on ouvre ; les fantômes balayés
    { a: "t1:mouille", id: "tap/table", gain: -10 },
    { a: "t1a:peches", id: "tap/table", gain: -6 },
    { a: "t1a:ananas", id: "tap/table", gain: -6 },
    { a: "t1a:haricots", id: "tap/table", gain: -6 },
    { a: "t1b", id: "toggle/latch", gain: -8 },
    { a: "t1b+0.3", id: "pro_tap/soft", gain: -9 },
    { a: "t1c:chips", id: "swish/soft", gain: -9 },
    { a: "t1c:saucisson", id: "swish/soft", gain: -9 },
    { a: "t1d", id: "swish/soft", gain: -10 },
    // tactique 2 : l'abattant qu'on relève
    { a: "t2d:cuvette-0.05", id: "pro_tap/knock", gain: -8 },
    // tactique 3 : disjoncteur, vanne, robinet, gouttes du filtre
    { a: "t3b:coupe", id: "fit/snap/switch_flip", gain: -6 },
    { a: "t3c:ferme", id: "pro_tap/knock", gain: -8 },
    { a: "t3d:ouvre", id: "toggle/latch", gain: -9 },
    { a: "t3e:vide", id: "pro_tap/knock", gain: -9 },
    { a: "t3f:filtre", id: "drip/drop", gain: -9 },
    { a: "t3f:cafe+0.35", id: "drip/drop", gain: -10 },
    { a: "t3f:retient", id: "drip/drop", gain: -10 },
    { a: "t3f:depots", id: "drip/drop", gain: -11 },
    // la porte d'entrée : elle se ferme, le verrou claque ; au retour, la lampe s'allume
    { a: "garde:heures+0.1", id: "pro_impact/short", gain: -9 },
    { a: "garde:heures+0.3", id: "toggle/latch", gain: -6 },
    { a: "retour:matin-0.2", id: "toggle/latch", gain: -9 },
    { a: "retour:matin", id: "click/thock", gain: -9 },
    // twist : le robinet de vidange qu'on tourne (rien ne sort), on tape sur le ballon (creux), la clé
    { a: "ouvre:bas", id: "pro_tap/knock", gain: -7 },
    { a: "chute:vide", id: "knock/wood", gain: -6, pitch: "C4" },
    { a: "chute:vide+0.3", id: "knock/wood", gain: -8, pitch: "C4" },
    { a: "fin:seule", id: "tap/knuckle", gain: -10 },
  ],
  ambiances: [
    { type: "drone", de: 0, a: "fin+5.5", niveau: -1 },
    { type: "vent", de: 0, a: "fin+5.5", niveau: -2, fondu: 1.5 },
    { type: "ville", de: "recap1", a: "recap3", niveau: 0, fondu: 0.6 },
    { type: "coeur", de: "rien", a: "fin+5.5", niveau: -1, bpm: 84 },
    // eau (synthétisée dans tools/mix.py) : robinet qui tousse, chasse fantôme, toilette, bassine versée, vidange, purge
    { type: "eau", de: 0, a: "hook:air.fin", niveau: -2, fondu: 0.3 },
    { type: "glouglou", de: "hook:crachait", a: "hook2", niveau: -4, fondu: 0.2 },
    { type: "glouglou", de: "t2a:chasse", a: "t2b:coup", niveau: 0, fondu: 0.2 },
    { type: "eau", de: "t2a:chasse", a: "t2a.fin", niveau: -4, fondu: 0.2 },
    { type: "eau", de: "t2c:lave", a: "t2c.fin", niveau: -8, fondu: 0.3 },
    { type: "eau", de: "t2e", a: "t2e:vide", niveau: 1, fondu: 0.2 },
    { type: "glouglou", de: "t2e:coup", a: "t2e.fin+0.4", niveau: -1, fondu: 0.3 },
    { type: "eau", de: "t3e:vide+0.2", a: "t3f.fin", niveau: -3, fondu: 0.3 },
    { type: "eau", de: "erreur3", a: "erreur3.fin", niveau: -5, fondu: 0.3 },
    // portes qui grincent : placard du ballon, porte d'entrée (sortie et retour), placard rouvert
    { type: "grincement", de: "t3", a: "t3:ballon", niveau: -3, fondu: 0.1 },
    { type: "grincement", de: "garde-0.3", a: "garde:part", niveau: -3, fondu: 0.1 },
    { type: "grincement", de: "retour:matin", a: "retour:matin+0.4", niveau: -2, fondu: 0.1 },
    { type: "grincement", de: "ouvre:robinet", a: "ouvre:robinet+0.45", niveau: -4, fondu: 0.1 },
  ],
  sujets: [
    { de: 0, a: "hook2", point: P.robinetCuisine },
    { de: "hook2.fin", a: "recap1:electricite-1.0", personnage: INES, hauteur: 0.85 },
    { de: "recap2:pompe", a: "recap3", point: P.pompe },
    { de: "promesse:connait", a: "promesse2", personnage: INES, hauteur: 1.05 },
    { de: "t1a:sirop", a: "t1b:jus-0.7", personnage: INES, hauteur: 1.0 },
    { de: "t1b:jus", a: "t1c", point: [-0.12, 0.84, 0.33] },
    { de: "t1c:chips", a: "t2:toilettes-1.3", personnage: INES, hauteur: 1.0 },
    { de: "t2c:lave", a: "t2d", personnage: INES, hauteur: 0.75 },
    { de: "t3:ballon", a: "t3f", point: P.ballon },
    { de: "t3b", a: "t3f", personnage: INES, hauteur: 0.75 },
    { de: "t3f:cafe", a: "erreur:jamais-1.3", point: [3.62, 0.25, -0.12] },
    { de: "erreur:jamais", a: "erreur2:circuit-0.8", point: [-2.95, 0.45, -1.25] },
    { de: "erreur2:circuit", a: "erreur3:pleine-0.6", point: [-3.4, 0.45, -1.45] },
    { de: "erreur3:pleine", a: "erreur4:bouillie-0.9", point: [-2.95, 0.18, -1.3] },
    { de: "erreur4:bouillie", a: "calme-1.4", point: [-2.95, 0.45, -1.25] },
    { de: "calme", a: "garde", personnage: INES, hauteur: 1.0 },
    { de: "ouvre", a: "ouvre:bas-0.9", personnage: INES, hauteur: 0.9 },
    { de: "ouvre:bas+0.4", a: "rien:goutte-0.5", personnage: INES, hauteur: 0.7 },
    { de: "chute:vide", a: "sec", point: P.ballon },
    { de: "vide:quelqu'un", a: "fin:seule-1.0", personnage: INES, hauteur: 1.0 },
  ],
};
