import { plan } from "../../systeme/camera";
import { DonneesEpisode } from "../../systeme/episode";
import { DonneesPiece } from "../../systeme/kit3d/decor";
import { Vec3 } from "../../systeme/maths";
import { APPARENCE_INES, APPARENCE_MOREL } from "../../systeme/personnage/apparence";
import { donnees as partie1, P as P1 } from "../001-h72/donnees";

/*
 * H+72 — Partie 2 « Le froid » (version dialoguée). Script : videos/002-h72-froid/script.txt (découpage : script.md).
 * Deux plateaux, jamais vus ensemble (on passe de l'un à l'autre par une coupe nette) :
 *  - 6e : l'appartement d'Inès de la partie 1 (salon | cuisine | salle d'eau | entrée) + sa CHAMBRE à l'est ;
 *  - 5e (décalé de OX en x) : palier avec escalier | entrée de Morel | salon de Morel (barbecue).
 * Une Inès par plateau (« ines » au 6e, « ines5 » au 5e) : chacune marche sans jamais se téléporter.
 * Personnages « humain » (silhouette de la partie 1, détails réalistes), bouche qui parle sur leurs répliques.
 */
export const OX = 20; // décalage du plateau du 5e
const o = (x: number, y: number, z: number): Vec3 => [OX + x, y, z];

export const P = {
  ...P1,
  // chambre d'Inès (6e)
  lit: [7.55, 0, -0.55] as Vec3,
  chevet: [7.0, 0, -1.33] as Vec3,
  bougieChevet: [7.0, 0.5, -1.33] as Vec3,
  fenetreChambre: [6.5, 1.5, -1.6] as Vec3,
  grilleChambre: [6.0, 0.32, -1.53] as Vec3, // grille d'aération basse, mur nord
  grilleSol: [7.0, 0.01, 0.65] as Vec3, // grille du sol (l'odeur du 5e monte par là)
  porteChambre: [5.7, 0, -0.6] as Vec3, // passage entrée -> chambre (mur est de l'entrée)
  // 5e : Morel
  escalierHaut: o(-3.0, 2.88, -2.95), // palier du 6e, en haut de la cage d'escalier
  escalierBas: o(-3.0, 0, 0.4),
  porte5: o(-1.3, 0, -0.4), // porte palier -> entrée de Morel (mur est du palier), charnière au nord
  judas: o(-1.3, 1.25, -0.4),
  tuyau: o(0.3, 0.08, -0.75), // devant les bidons
  bidons: o(1.2, 0.25, -1.25),
  barbecue: o(2.2, 0, 0.0),
  braises: o(2.2, 0.62, 0.0),
  fauteuil: o(1.05, 0, 0.35),
  fenetre5: o(2.5, 1.5, -1.6),
  grille5: o(1.0, 2.15, -1.53),
  lampeHaut: o(-3.0, 3.85, -3.0), // lampe torche tenue sur le palier du 6e
};

// Cadrages types pour les personnages « humain » (≈ 1,4 m, tête au centre ≈ 1,15 m) ; p = position des pieds
type Opt = { azimut?: number; elevation?: number; distance?: number; fov?: number; x?: number; y?: number };
const buste = (p: Vec3, az: number, op: Opt = {}) => plan([p[0], p[1] + 1.12, p[2]], { azimut: az, elevation: 6, distance: 2.7, fov: 36, y: 590, ...op });
const enPied = (p: Vec3, az: number, op: Opt = {}) => plan([p[0], p[1] + 0.7, p[2]], { azimut: az, elevation: 14, distance: 4.8, fov: 40, y: 640, ...op });
const aDeux = (a: Vec3, b: Vec3, az: number, op: Opt = {}) =>
  plan([(a[0] + b[0]) / 2, 0.78, (a[2] + b[2]) / 2], { azimut: az, elevation: 9, distance: 4.9, fov: 40, y: 660, ...op });

// Places des personnages au 5e (porte : Inès sur le palier, Morel dans son entrée ; puis tous deux sur le palier)
const PORTE_INES = o(-2.1, 0, -0.35);
const PORTE_MOREL = o(-0.95, 0, -0.35);
const PALIER_INES = o(-2.0, 0, 0.45);
const PALIER_MOREL = o(-2.95, 0, 0.8);

const INES = "ines";
const INES5 = "ines5";
const MOREL = "morel";

// Pièces du 6e : celles de la partie 1, l'entrée reçoit un passage vers la chambre (mur est)
const pieces6: DonneesPiece[] = partie1.decor.pieces.map((p) =>
  p.id === "entree" ? { ...p, ouvertures: [...(p.ouvertures ?? []), { mur: "est", type: "passage", centre: 0.6, largeur: 0.9, hauteur: 2.05 }] } : p,
);

export const donnees: DonneesEpisode = {
  id: "002-h72-froid",
  titre: "H+72 — Partie 2 : Le froid",
  queue: 5.5,
  post: { bloom: 0.36, seuilBloom: 0.88, vignette: 0.62, grain: 0.03, exposition: 0.9 }, // nuit sans courant
  decor: {
    pieces: [
      ...pieces6,
      {
        id: "chambre",
        sansMurs: ["ouest"], // mur partagé avec l'entrée (dessiné par elle)
        centre: [6.9, 0],
        largeur: 2.4,
        profondeur: 3.2,
        sol: "parquet",
        murs: "peint",
        devant: ["sud", "est"],
        pbr: { sol: "herringbone_parquet", murs: "painted_plaster_wall", teinteMurs: "#b9a9c4", motifSol: 1.4, motifMurs: 1.6, gainSol: 1.2, gainMurs: 1.1 },
        ouvertures: [{ mur: "nord", type: "fenetre", centre: -0.4, largeur: 1.0, hauteur: 1.1, bas: 0.95 }],
      },
      // ---- 5e ----
      {
        id: "palier5",
        centre: [OX - 2.4, 0],
        largeur: 2.2,
        profondeur: 3.2,
        sol: "beton",
        murs: "beton",
        couleurSol: "#5a5650",
        couleurMurs: "#6e675d",
        devant: ["sud", "est"], // mur vers l'entrée arasé : on voit Inès (palier) et Morel (entrée) ensemble
        ouvertures: [
          { mur: "est", type: "passage", centre: 0.4, largeur: 0.92, hauteur: 2.05 },
          // l'escalier passe dans la cage (mur nord) : ouverture sur toute la hauteur
          { mur: "nord", type: "passage", centre: -0.6, largeur: 1.05, hauteur: 2.6 },
        ],
      },
      {
        // cage d'escalier derrière le palier : les marches continuent jusqu'au 6e
        id: "cage5",
        sansMurs: ["sud"], // mur partagé avec le palier (dessiné par lui)
        centre: [OX - 3.0, -2.5],
        largeur: 1.2,
        profondeur: 1.8,
        hauteur: 3.4,
        sol: "beton",
        murs: "beton",
        couleurSol: "#4e4a45",
        couleurMurs: "#5f5950",
        devant: ["est"],
      },
      {
        id: "entree5",
        sansMurs: ["ouest"],
        centre: [OX - 0.6, 0],
        largeur: 1.4,
        profondeur: 3.2,
        sol: "parquet",
        murs: "peint",
        devant: ["sud", "est"],
        pbr: { sol: "herringbone_parquet", murs: "painted_plaster_wall", teinteMurs: "#b8a98e", motifSol: 1.4, motifMurs: 1.6, gainSol: 1.1, gainMurs: 1.1 },
        ouvertures: [{ mur: "est", type: "passage", centre: 0, largeur: 1.0, hauteur: 2.05 }],
      },
      {
        id: "salon5",
        sansMurs: ["ouest"],
        centre: [OX + 1.9, 0],
        largeur: 3.6,
        profondeur: 3.2,
        sol: "parquet",
        murs: "papier",
        couleurMurs: "#7d6f52",
        devant: ["sud", "est"],
        pbr: { sol: "herringbone_parquet", motifSol: 1.4, gainSol: 1.0 },
        ouvertures: [{ mur: "nord", type: "fenetre", centre: 0.6, largeur: 1.2, hauteur: 1.25, bas: 0.9 }],
      },
    ],
    meubles: [
      ...partie1.decor.meubles,
      // porte OUVERTE du placard du ballon (battant de 0,85 m vers le sud-est) : obstacle pour les contrôles
      { type: "etagere", position: [4.41, 0, -0.62], rotation: -71, echelle: 0.95, id: "porte-placard", invisible: true },
      // chambre d'Inès (lit, chevet dessinés dans Episode.tsx : obstacles pour les contrôles)
      { type: "lit", position: [7.55, 0, -0.65], id: "lit", echelle: 0.75, invisible: true },
      { type: "chaise", position: P.chevet, id: "chevet", echelle: 0.9, invisible: true },
      // 5e : escalier, fauteuil, barbecue, bidons (dessinés dans Episode.tsx)
      { type: "chaise", position: o(0.8, 0, 0.35), id: "fauteuil-dossier", echelle: 0.8, invisible: true }, // seul le dossier fait obstacle
      { type: "radio", position: o(2.2, 0, 0.0), id: "barbecue", echelle: 2.0, invisible: true },
      ...[0.35, 0.7, 1.05, 1.4, 1.75].flatMap((x, i) => [
        { type: "jerrican" as const, position: o(x, 0, -1.38), id: `bidon${i}`, invisible: true },
        { type: "jerrican" as const, position: o(x, 0, -1.18), id: `bidon${i + 5}`, invisible: true },
      ]),
      { type: "radiateur", position: o(3.3, 0.12, -1.5), id: "radiateur5", echelle: 0.6 },
    ],
    exterieur: { ville: { allumees: 0, distance: 13 }, neige: { densite: 0.7, vent: 0.35 }, ciel: "nuit" },
  },
  personnages: [
    {
      // Inès au 6e (de la clé jusqu'au réveil par l'odeur)
      id: INES,
      voix: "Inès",
      variante: "humain",
      apparence: APPARENCE_INES,
      depart: { position: [3.45, 0, -0.6], orientation: 70 }, // dernière image de la partie 1
      trajet: [
        // hook : elle se tourne vers la porte d'entrée, la clé à la main
        { a: "hook2", position: [4.85, 0, -0.45], orientation: 20, vitesse: 1.0, chemin: [[3.75, 0, 0.05], [4.6, 0, 0.02]] },
        // « 11°C » : elle souffle dans ses mains, face à nous
        { a: "froid", position: [5.0, 0, -0.1], orientation: 15, vitesse: 0.6 },
        // une seule pièce : elle gagne la chambre et en ferme la porte
        { a: "t1a:fermee", position: [6.3, 0, -0.35], orientation: 250, vitesse: 1.2, chemin: [[5.3, 0, -0.6], [6.15, 0, -0.6]] },
        // serviette sous la porte (accroupie à côté du passage)
        { a: "t2a:serviette", position: [6.15, 0, -0.65], orientation: 270, vitesse: 0.8 },
        // couverture sur la fenêtre
        { a: "t2b:couverture", position: [6.5, 0, -1.05], orientation: 180, vitesse: 1.0 },
        // pendant le fantôme de la grille, elle recule au milieu de la chambre
        { a: "t2c:jamais", position: [6.95, 0, -0.25], orientation: 230, vitesse: 1.2 },
        // les couches : devant le lit, face à nous
        { a: "t3", position: [6.6, 0, 0.4], orientation: 10, vitesse: 1.0 },
        // elle s'assied au pied du lit
        { a: "calme:ferme", position: [7.55, 0, 0.17], orientation: 0, vitesse: 1.4 },
      ],
      poses: [
        { a: 0, pose: "debout" },
        { a: "froid", pose: "froid", transition: 0.35 },
        { a: "i_genial", pose: "debout", transition: 0.3 },
        { a: "t2a:serviette-0.4", pose: "accroupi", transition: 0.35 },
        { a: "t2a.fin", pose: "debout", transition: 0.3 },
        { a: "t2b:couverture-0.2", pose: "mainTendue", transition: 0.3 },
        { a: "t2b.fin", pose: "debout", transition: 0.3 },
        { a: "t3", pose: "froid", transition: 0.3 },
        { a: "t3a:3", pose: "bras", transition: 0.2 },
        { a: "t3a:fines", pose: "debout", transition: 0.25 },
        { a: "calme:ferme", pose: "assis", transition: 0.4 },
      ],
      tenues: [
        { a: "t3", apparence: { haut: "tshirt", couleurHaut: "#e8e4dc", echarpe: null, sac: null } },
        { a: "t3a:3", apparence: { haut: "polaire", couleurHaut: "#9a3040" } },
        { a: "t3a:fines", apparence: { haut: "parka", couleurHaut: "#2f6f73", echarpe: "#d9a52b" } },
        { a: "t3a:bonnet", apparence: { bonnet: "#c9a227", couleurPompon: "#f3ede2" } },
      ],
      expressions: [
        { a: 0, expression: "peur" },
        { a: "hook2", expression: "inquiet" },
        { a: "serrure", expression: "decide" },
        { a: "froid", expression: "triste" },
        { a: "i_genial", expression: "fatigue" },
        { a: "t1", expression: "decide" },
        { a: "t3", expression: "triste" },
        { a: "t3a:fines", expression: "soulage" },
        { a: "t3a:bonnet", expression: "sourire" },
        { a: "i_sexy", expression: "sourire" },
        { a: "calme", expression: "fatigue" },
        { a: "calme:yeux", expression: "dort", transition: 0.5 },
        { a: "odeur:charbon", expression: "inquiet", transition: 0.2 },
      ],
      lampe: { de: 0, a: "t1", puissance: 0.07 },
    },
    {
      // Fantôme du mauvais réflexe : Inès qui colle du ruban sur la grille d'aération
      id: "fantome-grille",
      variante: "humain",
      apparence: APPARENCE_INES,
      depart: { position: [6.45, 0, -1.28], orientation: 260 },
      poses: [{ a: 0, pose: "accroupi" }],
      fantome: { de: "t2c", a: "t2d+0.3" },
    },
    {
      // Inès au 5e : elle descend l'escalier pendant que Morel s'intoxique, frappe, ouvre la fenêtre, appelle le 112
      id: INES5,
      voix: "Inès",
      variante: "humain",
      apparence: { ...APPARENCE_INES, bonnet: "#c9a227" },
      depart: { position: P.escalierHaut, orientation: 180 },
      trajet: [
        { a: "i_ouvrez", position: PORTE_INES, orientation: 70, vitesse: 1.3, chemin: [P.escalierBas, o(-2.6, 0, 0.3)] },
        // elle file ouvrir la fenêtre du salon (en contournant les bidons), pendant la réplique de Morel
        { a: "aere:fenetres", position: o(2.5, 0, -1.05), orientation: 180, vitesse: 1.8, chemin: [o(-1.3, 0, -0.4), o(-0.4, 0, -0.08), o(0.6, 0, -0.08), o(2.0, 0, -0.65)] },
        // elle ressort sur le palier pour appeler
        { a: "appel:appelle", position: PALIER_INES, orientation: 30, vitesse: 2.0, chemin: [o(2.0, 0, -0.6), o(0.6, 0, -0.08), o(-0.4, 0, -0.08), o(-1.0, 0, -0.4), o(-1.85, 0, -0.4)] },
        { a: "i_eau", position: PALIER_INES, orientation: 290, vitesse: 0.6 },
        { a: "fin", position: PALIER_INES, orientation: 15, vitesse: 0.6 },
      ],
      poses: [
        { a: 0, pose: "debout" },
        { a: "i_ouvrez-0.3", pose: "frappe", transition: 0.2 },
        { a: "i_ouvrez.fin", pose: "debout", transition: 0.3 },
        { a: "i_barbecue", pose: "mainTendue", transition: 0.3 },
        { a: "i_barbecue.fin", pose: "debout", transition: 0.3 },
        { a: "aere:fenetres-0.1", pose: "mainTendue", transition: 0.25 },
        { a: "aere.fin", pose: "debout", transition: 0.3 },
        { a: "appel", pose: "telephone", transition: 0.3 },
        { a: "i_eau", pose: "debout", transition: 0.3 },
        { a: "i_rat", pose: "mainTendue", transition: 0.2 },
        { a: "m_bonne", pose: "debout", transition: 0.3 },
        { a: "m_lampe", pose: "inquiet", transition: 0.35 },
      ],
      expressions: [
        { a: 0, expression: "decide" },
        { a: "i_tete", expression: "inquiet" },
        { a: "i_barbecue", expression: "decide" },
        { a: "i_eau", expression: "colere" },
        { a: "m_achete", expression: "surpris", transition: 0.2 },
        { a: "i_rat", expression: "colere", transition: 0.15 },
        { a: "m_bonne", expression: "decide" },
        { a: "m_lampe", expression: "peur", transition: 0.2 },
        { a: "fin", expression: "inquiet" },
      ],
      lampe: { de: 0, a: "i_tete", puissance: 0.07 },
    },
    {
      id: MOREL,
      voix: "Morel",
      variante: "humain",
      apparence: APPARENCE_MOREL,
      depart: { position: o(1.12, 0, 0.37), orientation: 80 },
      trajet: [
        // il va ouvrir, de mauvaise humeur
        { a: "m_folle", position: PORTE_MOREL, orientation: 290, vitesse: 1.0, chemin: [o(1.3, 0, -0.25), o(0.3, 0, -0.2)] },
        // il s'écarte (sud) pour laisser passer Inès
        { a: "m_chauffage", position: o(-0.8, 0, 0.15), orientation: 300, vitesse: 0.6 },
        // sorti sur le palier
        { a: "sort:palier", position: PALIER_MOREL, orientation: 70, vitesse: 1.2, chemin: [o(-1.0, 0, -0.4), o(-1.85, 0, -0.4), o(-2.4, 0, 0.4)] },
      ],
      poses: [
        { a: 0, pose: "assis" },
        { a: "co4", pose: "debout", transition: 0.5 },
        { a: "m_criez", pose: "inquiet", transition: 0.3 },
        { a: "m_chauffage", pose: "bras", transition: 0.25 },
        { a: "m_chauffage.fin", pose: "debout", transition: 0.3 },
        { a: "sort", pose: "inquiet", transition: 0.3 },
        { a: "m_achete", pose: "debout", transition: 0.3 },
        { a: "m_lampe", pose: "inquiet", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "m_folle", expression: "colere" },
        { a: "m_criez", expression: "fatigue" },
        { a: "m_chauffage", expression: "colere" },
        { a: "sort", expression: "triste" },
        { a: "m_achete", expression: "neutre" },
        { a: "i_rat", expression: "surpris", transition: 0.15 },
        { a: "m_bonne", expression: "sourire" },
        { a: "m_lampe", expression: "inquiet", transition: 0.3 },
      ],
    },
    {
      // Fantôme de Morel : endormi dans son fauteuil (le monoxyde)
      id: "fantome-morel",
      variante: "humain",
      apparence: APPARENCE_MOREL,
      depart: { position: o(1.14, 0, 0.38), orientation: 80 }, // superposé au vrai Morel : ce qui va lui arriver
      poses: [{ a: 0, pose: "assis" }, { a: "co3:dormir", pose: "affale", transition: 0.8 }],
      expressions: [{ a: 0, expression: "fatigue" }, { a: "co3:dormir", expression: "dort", transition: 0.6 }],
      fantome: { de: "co3", a: "co4.fin+0.3" },
    },
  ],
  camera: [
    // HOOK — exactement le dernier cadre de la partie 1 (gros plan du verrou), puis recul sur Inès et la porte
    { a: 0, ...plan(P.verrou, { azimut: 8, elevation: 5, distance: 0.95, fov: 32, y: 640, x: 500 }) },
    { a: "hook:chez", ...enPied([4.3, 0, -0.2], 22, { distance: 4.4, x: 480 }), deplacement: 1.2 },
    // la clé : Inès et la serrure ensemble
    { a: "hook2", ...plan([4.9, 0.95, -0.95], { azimut: 20, elevation: 8, distance: 4.0, fov: 40, y: 600, x: 520 }), deplacement: 0.8 },
    // RÉCAP — la ville noire, l'immeuble en coupe, le ballon, le robinet du bas
    { a: "recap1:electricite", position: [7.5, -2.0, 30.0], cible: [0.6, -7.6, 0], fov: 44, deplacement: 1.0, par: [5.0, 4.0, 14.0] },
    { a: "recap2:eau", ...plan([0.7, 0.7, -0.7], { azimut: 32, elevation: 22, distance: 6.8, fov: 42, y: 640 }), deplacement: 1.1 },
    { a: "recap3:ballon", ...plan([3.85, 1.0, -1.3], { azimut: -8, elevation: 15, distance: 3.0, fov: 40, y: 640, x: 540 }), deplacement: 0.9 },
    { a: "recap4:nuit", ...plan([3.85, 0.15, -1.1], { azimut: 15, elevation: 40, distance: 1.9, fov: 36, y: 640 }), deplacement: 0.9 },
    { a: "recap4.fin", ...plan(P.verrou, { azimut: 22, elevation: 6, distance: 1.3, fov: 34, y: 640, x: 520 }), deplacement: 0.8 },
    // « 11°C » + réplique : Inès de face
    { a: "froid:fait", ...buste([5.0, 0, -0.1], 14), deplacement: 0.9 },
    { a: "i_genial:chauffage", ...buste([5.0, 0, -0.1], 4, { distance: 2.4, y: 600 }), deplacement: 1.2 },
    // TACTIQUE 1 — l'appartement en coupe : la chambre s'allume, le reste s'éteint ; Inès y entre
    { a: "t1:seule", ...plan([5.6, 0.8, -0.3], { azimut: 18, elevation: 30, distance: 7.2, fov: 44, y: 650 }), deplacement: 1.0 },
    { a: "t1a:plus", ...enPied([6.2, 0, -0.45], 18, { distance: 4.4 }), deplacement: 0.9 },
    // TACTIQUE 2 — les courants d'air, la serviette, la couverture
    { a: "t2:courants", ...plan([6.6, 0.7, -0.6], { azimut: 22, elevation: 22, distance: 4.4, fov: 42, y: 660 }), deplacement: 0.8 },
    { a: "t2a:serviette", ...enPied([6.1, 0, -0.6], 35, { distance: 3.6, elevation: 20, y: 660 }), deplacement: 0.8 },
    { a: "t2b:couverture", ...enPied([6.5, 0, -1.05], 18, { distance: 4.2, y: 620 }), deplacement: 0.9 },
    // fantôme : le ruban sur la grille (fantôme de profil, à côté de la grille)
    { a: "t2c:jamais", ...plan([6.22, 0.4, -1.35], { azimut: 0, elevation: 30, distance: 2.9, fov: 40, y: 680, x: 540 }), deplacement: 1.1 },
    // TACTIQUE 3 — les couches, le bonnet, la réplique
    { a: "t3:couches", ...enPied([6.6, 0, 0.4], 10, { distance: 4.0, x: 620 }), deplacement: 1.0 },
    { a: "i_sexy", ...buste([6.6, 0, 0.4], 12), deplacement: 0.7 },
    // elle s'endort, puis l'odeur
    { a: "calme:yeux", ...buste([7.55, -0.3, 0.17], 12, { distance: 3.2, elevation: 12 }), deplacement: 0.9 },
    { a: "odeur:monte", ...plan([7.3, 0.6, 0.35], { azimut: 10, elevation: 22, distance: 3.4, fov: 40, y: 620 }), deplacement: 0.8 },
    // 5e — coupe nette sur le salon de Morel (barbecue)
    { a: "morel", ...plan(o(1.6, 0.6, 0.15), { azimut: 38, elevation: 20, distance: 4.4, fov: 42, y: 650, x: 520 }), coupe: true },
    { a: "salon.fin", ...plan(o(1.6, 0.8, -0.6), { azimut: 15, elevation: 24, distance: 5.0, fov: 44, y: 640 }), deplacement: 0.8 },
    { a: "co3:tete", ...buste(o(1.14, -0.4, 0.38), 25, { distance: 3.0, elevation: 12 }), deplacement: 0.9 },
    // la porte : Inès frappe, Morel ouvre (plan à deux, palier | entrée en coupe, de face)
    { a: "i_ouvrez", ...aDeux(PORTE_INES, PORTE_MOREL, 0, { x: 480 }), coupe: true },
    { a: "i_tete", ...aDeux(PORTE_INES, PORTE_MOREL, -10, { distance: 4.4, x: 520 }), deplacement: 0.6 },
    { a: "m_criez", ...aDeux(PORTE_INES, PORTE_MOREL, 10, { distance: 4.4, x: 450 }), deplacement: 0.6 },
    { a: "i_barbecue", ...aDeux(PORTE_INES, PORTE_MOREL, 0, { distance: 4.9, x: 480 }), deplacement: 0.6 },
    // elle ouvre la fenêtre du salon
    { a: "aere:fenetres", ...enPied(o(2.5, 0, -1.05), -15, { distance: 4.0, y: 620 }), deplacement: 1.1 },
    // palier : Morel sorti, Inès au téléphone
    { a: "sort:palier", ...aDeux(o(-2.6, 0, 0.6), PALIER_MOREL, 10, { distance: 5.2 }), deplacement: 1.2 },
    { a: "appel:112", ...buste(PALIER_INES, 20), deplacement: 0.7 },
    // « Vous vous souvenez du sol sec ? » : flash partie 1, le sol du placard
    { a: "rappel", ...plan([3.85, 0.02, -1.2], { azimut: -20, elevation: 45, distance: 1.7, fov: 36, y: 660 }), coupe: true },
    // le tuyau, puis les 10 bidons (un seul plan tenu)
    { a: "tuyau", ...plan(o(0.8, 0.2, -0.95), { azimut: -30, elevation: 45, distance: 3.6, fov: 42, y: 520, x: 540 }), coupe: true },
    // la dispute sur le palier (plan à deux)
    { a: "i_eau", ...aDeux(PALIER_INES, PALIER_MOREL, 0, { x: 520 }), coupe: true },
    { a: "m_achete+0.5", ...buste(PALIER_MOREL, 25, { x: 660 }), deplacement: 0.5 },
    { a: "i_rat", ...aDeux(PALIER_INES, PALIER_MOREL, -10, { distance: 4.3, x: 560 }), deplacement: 0.7 },
    { a: "m_bonne", ...aDeux(PALIER_INES, PALIER_MOREL, 10, { distance: 4.3, x: 480 }), deplacement: 0.5 },
    { a: "m_lampe:type", ...aDeux(PALIER_INES, PALIER_MOREL, 0, { distance: 5.0, x: 520 }), deplacement: 0.7 },
    // la lampe torche en haut de l'escalier
    { a: "m_cles:cles", ...plan(o(-3.0, 2.3, -2.2), { azimut: 10, elevation: 8, distance: 4.4, fov: 44, y: 560 }), deplacement: 1.0 },
    // « Et ce soir, Inès est de garde. »
    { a: "fin:soir", ...buste(PALIER_INES, 10), deplacement: 0.8 },
    { a: "fin+3.0", ...buste(PALIER_INES, 8, { distance: 2.4 }), deplacement: 2.0 },
  ],
  hud: [
    {
      type: "montre",
      a: "fin+0.7",
      jour: 4,
      heure: "06:02",
      temperature: 11,
      changements: [{ a: "fin", heure: "18:00", temperature: 10 }],
    },
    { type: "etiquette", de: "hook2+0.05", a: "recap1:electricite-1.05", texte: "Seule clé", point: P.verrou, style: "danger" },
    { type: "fiche", de: "recap3", a: "recap4", icone: "eau", titre: "Ballon", lignes: ["200 litres", "Plein hier soir"], cote: "gauche" },
    { type: "fiche", de: "recap4", a: "serrure-0.4", icone: "danger", titre: "Ballon", lignes: ["0 litre", "Sol sec"], cote: "gauche" },
    { type: "etiquette", de: "recap4.fin+0.05", a: "froid:fait-0.95", texte: "Serrure intacte", point: P.verrou, style: "normal" },
    { type: "moodles", de: "froid", a: "i_genial.fin", moodles: [{ nom: "froid", niveau: 2 }, { nom: "fatigue", niveau: 3 }] },
    { type: "tactique", de: "t1", a: "t1a.fin", numero: 1, total: 3, titre: "Une seule pièce" },
    { type: "tactique", de: "t2", a: "t2d.fin", numero: 2, total: 3, titre: "Les courants d'air" },
    { type: "etiquette", de: "t2c:jamais", a: "t2d", texte: "Grille d'aération", point: P.grilleChambre, style: "danger" },
    { type: "tactique", de: "t3", a: "i_sexy", numero: 3, total: 3, titre: "Des couches" },
    { type: "fiche", de: "t3a", a: "i_sexy.fin", icone: "couverture", titre: "3 couches fines", lignes: ["1 · T-shirt", "2 · Polaire", "3 · Parka + bonnet"], cote: "gauche" },
    { type: "moodles", de: "odeur:charbon", a: "odeur.fin+0.2", moodles: [{ nom: "odeur", niveau: 2 }] },
    { type: "fiche", de: "morel:monsieur", a: "salon.fin", icone: "maison", titre: "M. Morel", lignes: ["5e étage", "Seul, 70 ans"], cote: "droite" },
    { type: "etiquette", de: "co", a: "co2", texte: "Monoxyde (CO)", point: P.braises, style: "danger" },
    { type: "moodles", de: "co3", a: "co3.fin+0.3", moodles: [{ nom: "tete", niveau: 2 }, { nom: "nausee", niveau: 3 }, { nom: "sommeil", niveau: 4 }] },
    { type: "fiche", de: "appel", a: "rappel", icone: "telephone", titre: "Appel 112", lignes: ["Monoxyde, 5e étage", "1 personne"], cote: "gauche" },
    { type: "etiquette", de: "tuyau+0.1", a: "bidons-0.3", texte: "Encore mouillé", point: P.tuyau, style: "danger" },
    { type: "etiquette", de: "bidons-0.3", a: "i_eau", texte: "200 litres", point: o(0.7, 0.5, -1.25), style: "ressource" },
    { type: "fiche", de: "m_achete+0.55", a: "i_rat-0.75", icone: "jerrican", titre: "Marché noir", lignes: ["20 € le bidon", "10 bidons = 200 L"], cote: "gauche" },
    { type: "carton", de: "fin+0.7", partie: 3, titre: "La lampe qui suit", verifie: "24/10/2026", question: "Ce soir, Inès…", choix: ["Part à sa garde", "Reste et guette"] },
  ],
  sons: [
    // ---- transitions et moments forts ----
    { a: "hook:chez", id: "whoosh_big/deep", gain: -10 },
    { a: "hook2:seule", id: "pro_impact/deep", gain: -7 },
    { a: "recap1:sans", id: "whoosh_big/swell", gain: -8 },
    { a: "recap2:eau", id: "whoosh_big/deep", gain: -10 },
    { a: "recap3:ballon", id: "cut_hit/sub", gain: -10 },
    { a: "recap4:vide", id: "pro_sub_drop/low", gain: -5 },
    { a: "serrure:serrure", id: "cut_hit/punch", gain: -12 },
    { a: "t1", id: "pro_impact/short", gain: -9 },
    { a: "t2", id: "pro_impact/short", gain: -9 },
    { a: "t2c:jamais", id: "pro_impact/deep", gain: -7 },
    { a: "t3", id: "pro_impact/short", gain: -9 },
    { a: "odeur:charbon", id: "riser/dark", gain: -12 },
    { a: "morel", id: "cut_hit/sub", gain: -7 },
    { a: "co:monoxyde", id: "reverse_swell/dark", gain: -8 },
    { a: "co4.fin", id: "pro_sub_drop/low", gain: -4 },
    { a: "i_ouvrez", id: "cut_hit/punch", gain: -10 },
    { a: "aere:grand", id: "whoosh_fast/heavy", gain: -10 },
    { a: "rappel", id: "reverse_swell/dark", gain: -9 },
    { a: "tuyau", id: "cut_hit/sub", gain: -9 },
    { a: "i_eau", id: "cut_hit/sub", gain: -11 },
    { a: "i_rat:rat", id: "pro_impact/short", gain: -9 },
    { a: "m_cles:cles", id: "pro_impact/deep", gain: -5 },
    { a: "fin", id: "whoosh_big/thump_deep", gain: -8 },
    { a: "fin+0.7", id: "impact/deep", gain: -8 },
    { a: "fin+0.9", id: "whoosh_fast/heavy", gain: -9 },
    { a: "fin+1.23", id: "cut_hit/punch", gain: -6 },
    { a: "fin+1.4", id: "cut_hit/sub", gain: -5 },
    // mouvements mesurés « sans son » par earshot sur la vidéo finale (0:16,57 · 1:17,93 · 1:20,17 · 1:28,90 · 1:29,67)
    { a: "i_genial+0.05", id: "whoosh_fast/heavy", gain: -14 },
    { a: "m_achete+0.26", id: "whoosh_fast/heavy", gain: -14 },
    { a: "i_rat-0.29", id: "cut_hit/sub", gain: -13 },
    { a: "fin-0.92", id: "whoosh_fast/heavy", gain: -13 },
    { a: "fin-0.15", id: "cut_hit/sub", gain: -12 },
    // ---- bruitages d'objets ----
    { a: "hook:quelqu'un", id: "toggle/latch", gain: -9 },
    { a: "serrure:forcee", id: "pro_tap/knock", gain: -10 },
    { a: "t1a:fermee", id: "pro_impact/short", gain: -10 },
    { a: "t1a:fermee+0.15", id: "toggle/latch", gain: -9 },
    { a: "t2a:serviette", id: "swish/soft", gain: -8 },
    { a: "t2b:couverture", id: "swish/soft", gain: -7 },
    { a: "t2c:grilles", id: "swish/soft", gain: -10 },
    { a: "t3a:couches", id: "swish/soft", gain: -8 },
    { a: "t3a:bonnet", id: "swish/soft", gain: -8 },
    { a: "calme:yeux", id: "pro_tap/soft", gain: -12 },
    { a: "i_ouvrez", id: "knock/wood", gain: -4 },
    { a: "i_ouvrez+0.22", id: "knock/wood", gain: -4 },
    { a: "i_ouvrez+0.44", id: "knock/wood", gain: -4 },
    { a: "m_folle-0.4", id: "toggle/latch", gain: -12 },
    { a: "aere:grand", id: "toggle/latch", gain: -7 },
    { a: "appel:appelle", id: "click/thock", gain: -10 },
    { a: "tuyau:mouille", id: "drip/drop", gain: -8 },
    { a: "tuyau:mouille+0.5", id: "drip/drop", gain: -9 },
    { a: "bidons:pleins", id: "tap/table", gain: -9 },
    { a: "m_lampe", id: "pro_tap/soft", gain: -12 },
    { a: "m_cles:cles+0.3", id: "toggle/latch", gain: -10 },
    { a: "fin:garde", id: "tap/knuckle", gain: -10 },
  ],
  ambiances: [
    { type: "drone", de: 0, a: "fin+5.5", niveau: -1 },
    { type: "vent", de: 0, a: "fin+5.5", niveau: -3, fondu: 1.5 },
    { type: "ville", de: "recap1", a: "recap2", niveau: 0, fondu: 0.6 },
    // vent fort quand la fenêtre de Morel est ouverte
    { type: "vent", de: "aere:grand", a: "sort.fin", niveau: -2, fondu: 0.6 },
    { type: "coeur", de: "co3", a: "co4.fin+0.5", niveau: -2, bpm: 72 },
    { type: "coeur", de: "m_lampe", a: "fin+5.5", niveau: -1, bpm: 88 },
    { type: "grincement", de: "t1a:porte", a: "t1a:fermee", niveau: -4, fondu: 0.1 },
    { type: "grincement", de: "m_folle-0.45", a: "m_folle-0.05", niveau: -5, fondu: 0.1 },
    { type: "eau", de: "tuyau", a: "tuyau.fin", niveau: -12, fondu: 0.3 },
  ],
  sujets: [
    { de: 0, a: "hook:chez-1.2", point: P.verrou },
    { de: "hook:chez", a: "recap1:electricite-1.0", personnage: INES, hauteur: 1.1 },
    { de: "recap3:ballon", a: "recap4:nuit-0.95", point: P.ballon },
    { de: "recap4.fin", a: "froid:fait-0.9", point: P.verrou },
    { de: "froid:fait", a: "t1:seule-1.0", personnage: INES, hauteur: 1.1 },
    { de: "t1a:plus+0.4", a: "t2:courants-0.8", personnage: INES, hauteur: 1.0 },
    { de: "t2a:serviette", a: "t2b:couverture-0.9", personnage: INES, hauteur: 0.6 },
    { de: "t2b:couverture", a: "t2c:jamais-0.8", personnage: INES, hauteur: 1.0 },
    { de: "t3:couches", a: "i_sexy.fin-0.35", personnage: INES, hauteur: 1.1 },
    { de: "calme:yeux", a: "odeur:monte-0.8", personnage: INES, hauteur: 0.8 },
    { de: "co3:tete", a: "co4.fin", personnage: "fantome-morel", hauteur: 0.75 },
    { de: "i_ouvrez", a: "m_chauffage-0.1", personnage: INES5, hauteur: 1.1 },
    { de: "m_folle", a: "m_chauffage-0.1", personnage: MOREL, hauteur: 1.1 },
    { de: "appel:112", a: "rappel", personnage: INES5, hauteur: 1.1 },
    { de: "tuyau", a: "i_eau", point: P.tuyau },
    { de: "i_eau", a: "m_achete-0.05", personnage: INES5, hauteur: 1.1 },
    { de: "i_rat", a: "m_cles:cles-1.0", personnage: INES5, hauteur: 1.1 },
    { de: "i_eau", a: "m_cles:cles-1.0", personnage: MOREL, hauteur: 1.1 },
    { de: "fin:soir", a: "fin+0.7", personnage: INES5, hauteur: 1.1 },
  ],
};
