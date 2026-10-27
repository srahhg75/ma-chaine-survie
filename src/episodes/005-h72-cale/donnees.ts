import { cadrage, OptionsPlan, plan } from "../../systeme/camera";
import { DonneesEpisode } from "../../systeme/episode";
import { DonneesPiece } from "../../systeme/kit3d/decor";
import { Vec3 } from "../../systeme/maths";
import { Apparence, APPARENCE_MOREL } from "../../systeme/personnage/apparence";
import { P as P1, SOUS_SOL } from "../001-h72/donnees";
import { DEMI, NIV, P, ZF } from "../003-h72-lampe/donnees";
import { CARNET, DAME, DEDANS6, donnees as d004, GANTS, INES_A, MAIN_TROUSSEAU, MERE7, PAPIER_MAIN, PERE7, PL, VOISIN4 } from "../004-h72-conseil/donnees";

/*
 * H+72 — Partie 5 « La cale », DERNIER épisode de la série. Script : videos/005-h72-cale/script.txt (découpage : script.md).
 * Quatre plateaux, raccordés par des coupes nettes :
 *  1. la CAGE D'ESCALIER des parties 3 et 4 (CageEscalier, mêmes coordonnées) avec l'ENTRÉE D'INÈS derrière sa porte :
 *     le papier (raccord exact avec la fin de la partie 4), la cale, la nuit, la poignée qui tourne ; le palier du 5e
 *     (Morel), le 4e (le complice arrêté), le palier du 6e (le voleur pris) ;
 *  2. le SALON DES VOISINS DU 7e de la partie 4 (x ≈ −30, en données) : la branche A en fantôme, le piège ;
 *  3. la CUISINE D'INÈS et l'IMMEUBLE EN COUPE de la partie 1, posés à l'écart (x ≈ +30) : la pompe qui repart,
 *     le robinet qui crache de l'air… puis de l'eau (la toute première image de la série).
 * STOP : la branche A (fantôme : elle lit le mot devant tous) recule, image et son, à partir de « rembobine »
 * (retour du 27/10 : rembobinage raccourci).
 */
export { CARNET, PAPIER_MAIN, MAIN_TROUSSEAU, GANTS };
export const KX = 30; // cuisine + immeuble de la partie 1
const k = (x: number, y: number, z: number): Vec3 => [KX + x, y, z];
export const ROBINET: Vec3 = k(P1.robinetCuisine[0], P1.robinetCuisine[1], P1.robinetCuisine[2]);
export const POMPE: Vec3 = k(P1.pompe[0], SOUS_SOL + 0.55, P1.pompe[2]);

// Entrée d'Inès (6e) : porte au sud (z −1,6), s'ouvre vers l'intérieur (−z) ; meuble à chaussures contre le mur ouest
export const CALE: Vec3 = [-0.6, NIV.e6, -1.7]; // la cale en bois, sous le bord libre de la porte, côté intérieur
export const ENVELOPPE: Vec3 = [-1.5, NIV.e6 + 0.452, -2.62]; // sur le meuble à chaussures
const A_CALE = [-0.2, NIV.e6, -2.0] as Vec3;
const INES_TAIT = [-0.3, NIV.e6, -2.75] as Vec3; // après le STOP : debout dans son entrée, face à la caméra (au nord) // accroupie à côté de la porte (de profil pour la caméra)
const A_MEUBLE = [-1.3, NIV.e6, -2.15] as Vec3; // devant le meuble à chaussures, face à lui (nord)
const NUIT6 = [-0.6, NIV.e6, -4.3] as Vec3; // assise par terre, face à sa porte calée
// Palier du 5e (Morel dans son entrée, porte ouverte : comme en partie 3)
const PALIER5 = [-1.05, NIV.e5, -0.45] as Vec3;
const MOREL5 = [-2.05, NIV.e5, -0.6] as Vec3;
export const MAIN_INES5: Vec3 = [-1.33, NIV.e5 + 0.78, -0.32]; // la trousse dans les mains d'Inès
export const TROUSSE_MOREL: Vec3 = [-3.15, NIV.e5 + 0.45, 0.05]; // posée sur le tabouret de Morel
// 4e : le complice arrêté, deux policiers
const V4 = [-0.35, NIV.e4, -0.55] as Vec3;
const FLIC1 = [0.65, NIV.e4, 0.05] as Vec3;
const FLIC2 = [-1.35, NIV.e4, 0.2] as Vec3;
export const TROUSSEAU: Vec3 = [0.36, NIV.e4 + 0.86, 0.12]; // dans la main tendue du policier 1 (vers le complice)
// 6e : le voleur pris sur le palier ; puis Inès et Morel
const VOLEUR = [-0.45, NIV.e6, -0.35] as Vec3;
const FLIC1_6 = [0.45, NIV.e6, 0.05] as Vec3;
const FLIC2_6 = [-1.4, NIV.e6, 0.3] as Vec3;
const INES6B = [-1.2, NIV.e6, 0.1] as Vec3;
const MOREL6 = [-0.4, NIV.e6, 0.42] as Vec3;
// Cuisine (partie 1)
const INES_K = k(1.05, 0, -0.8);

const POLICIER: Partial<Apparence> = {
  femme: false, age: 0.3, peau: "#d9a27e", joues: "#cf8a74", iris: "#2a2a2a", cheveux: "#2a2018", coiffure: "court",
  haut: "parka", couleurHaut: "#1f2b45", couleurCol: "#33405e", pantalon: "#1d2236", chaussures: "bottines", couleurChaussures: "#151515",
  bonnet: "#1f2b45", couleurPompon: "#1f2b45",
};
const POLICIERE: Partial<Apparence> = { ...POLICIER, femme: true, age: 0.25, peau: "#c98e68", cheveux: "#151010", coiffure: "carre" };
const VOLEUR_A: Partial<Apparence> = {
  femme: false, age: 0.35, peau: "#e0b08c", joues: "#d08672", iris: "#2a2a2a", cheveux: "#1a1410", coiffure: "court",
  haut: "parka", couleurHaut: "#151618", couleurCol: "#2a2b2e", pantalon: "#18191c", chaussures: "bottines", couleurChaussures: "#111111",
  bonnet: "#151618", couleurPompon: "#151618", gants: GANTS,
};
const INES_MAISON: Partial<Apparence> = { ...INES_A, bonnet: null };

const objet = (p: Vec3, az: number, op: Partial<OptionsPlan> = {}) => plan(p, { azimut: az, elevation: 48, distance: 0.9, fov: 34, y: 600, ...op });

// Cuisine de la partie 1, posée à x = KX (avec son mur ouest : elle est seule ici)
const CUISINE: DonneesPiece = {
  id: "cuisine",
  centre: [KX, 0],
  largeur: 3.4,
  profondeur: 3.2,
  sol: "carrelage",
  murs: "peint",
  couleurSol: "#b7ada0",
  devant: ["sud", "est"],
  pbr: { murs: "painted_plaster_wall", teinteMurs: "#e6dccb", motifMurs: 1.6, gainMurs: 1.25 },
  ouvertures: [{ mur: "nord", type: "fenetre", centre: 0.55, largeur: 1.0, hauteur: 0.85, bas: 1.32 }],
};

export const donnees: DonneesEpisode = {
  id: "005-h72-cale",
  titre: "H+72 — Partie 5 : La cale",
  queue: 8, // le narrateur lit le carton de fin de série (@carton1-3)
  post: { bloom: 0.38, seuilBloom: 0.86, vignette: 0.64, grain: 0.03, exposition: 0.9 }, // nuit sans courant
  // STOP : la branche A (de « Si elle lit » à « qu'elle sait ») recule, image et son, de « rembobine » à « Elle se tait »
  retours: [{ de: "stop:rembobine", a: "tait", depuis: "a1" }],
  decor: {
    pieces: [...d004.decor.pieces, CUISINE],
    meubles: [
      ...d004.decor.meubles,
      // cuisine (partie 1)
      { type: "evier", position: k(0.3, 0, -1.24), id: "evier" },
      { type: "cuisiniere", position: k(1.2, 0, -1.25), id: "cuisiniere" },
      { type: "etagere", position: k(-1.15, 0, -1.4), id: "etagere-k" },
      { type: "table", position: k(-0.4, 0, 0.45), id: "table-k", couleur: "#8a6440" },
    ],
    exterieur: { ville: { allumees: 0, distance: 13 }, neige: { densite: 0.7, vent: 0.35 }, ciel: "nuit" },
  },
  personnages: [
    // ======== entrée d'Inès ========
    {
      // raccord exact avec la fin de la partie 4 : au fond de son entrée, le papier dans la main
      id: "ines-debut",
      voix: "Inès",
      variante: "humain",
      apparence: INES_A,
      presence: { a: "a1" },
      depart: { position: DEDANS6, orientation: 10 },
      poses: [{ a: 0, pose: "mainTendue" }],
      expressions: [{ a: 0, expression: "peur" }, { a: "hook2", expression: "colere" }, { a: "recap3", expression: "peur" }],
    },
    {
      // après le STOP : elle se tait, cale la porte, garde la preuve
      id: "ines-maison",
      voix: "Inès",
      variante: "humain",
      apparence: INES_MAISON,
      presence: { de: "stop", a: "matin" },
      depart: { position: INES_TAIT, orientation: 180 },
      trajet: [
        { a: "t1a", position: A_CALE, orientation: 265, vitesse: 0.8 },
        // elle se relève et se tourne vers nous (la caméra est au nord, dans l'entrée)
        { a: "i_entrez-0.2", position: [-0.25, NIV.e6, -2.1], orientation: 175, vitesse: 0.6 },
        { a: "t2+0.9", position: A_MEUBLE, orientation: 175, vitesse: 1.0 },
      ],
      poses: [
        { a: 0, pose: "debout" },
        { a: "t1a+0.2", pose: "accroupi", transition: 0.35 },
        { a: "i_entrez-0.3", pose: "bras", transition: 0.35 },
        { a: "t2", pose: "debout", transition: 0.3 },
        { a: "t2a-0.2", pose: "mainTendue", transition: 0.3 },
        { a: "t2b", pose: "telephone", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "peur" },
        { a: "tait", expression: "decide", transition: 0.3 },
        { a: "i_entrez", expression: "sourire" },
        { a: "t2", expression: "decide" },
      ],
    },
    {
      // la nuit suivante : assise face à sa porte calée ; elle se lève et crie
      id: "ines-nuit",
      voix: "Inès",
      variante: "humain",
      apparence: INES_MAISON,
      presence: { de: "nuit", a: "pris" },
      depart: { position: NUIT6, orientation: 0 },
      poses: [
        { a: 0, pose: "accroupi" },
        { a: "poignee", pose: "inquiet", transition: 0.4 },
        { a: "i_cri-0.2", pose: "frappe", transition: 0.2 },
      ],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "cave", expression: "inquiet" },
        { a: "attente", expression: "soulage", transition: 0.4 },
        { a: "sauf", expression: "peur", transition: 0.2 },
        { a: "i_cri-0.2", expression: "colere", transition: 0.15 },
      ],
    },

    // ======== salon du 7e : la branche A (fantôme), puis le piège ========
    {
      id: "fantome-lit",
      variante: "humain",
      apparence: INES_MAISON,
      depart: { position: PL.ines, orientation: 0 },
      poses: [{ a: 0, pose: "mainTendue" }],
      expressions: [{ a: 0, expression: "decide" }],
      fantome: { de: "a1", a: "stop:rembobine" },
    },
    { id: "morel-a", variante: "humain", apparence: APPARENCE_MOREL, presence: { de: "a1", a: "stop:rembobine" }, depart: { position: PL.morel, orientation: 292 }, poses: [{ a: 0, pose: "bras" }], expressions: [{ a: 0, expression: "surpris" }] },
    { id: "dame-a", variante: "humain", apparence: DAME, presence: { de: "a1", a: "stop:rembobine" }, depart: { position: PL.dame, orientation: 285 }, expressions: [{ a: 0, expression: "surpris" }] },
    { id: "pere-a", variante: "humain", apparence: PERE7, presence: { de: "a1", a: "stop:rembobine" }, depart: { position: PL.pere, orientation: 68 }, expressions: [{ a: 0, expression: "inquiet" }] },
    { id: "mere-a", variante: "humain", apparence: MERE7, presence: { de: "a1", a: "stop:rembobine" }, depart: { position: PL.mere, orientation: 75 }, poses: [{ a: 0, pose: "bras" }], expressions: [{ a: 0, expression: "inquiet" }] },
    {
      // le complice : il fait l'étonné… puis sourit
      id: "voisin4-a",
      variante: "humain",
      apparence: VOISIN4,
      presence: { de: "a1", a: "stop:rembobine" },
      depart: { position: PL.voisin4, orientation: 345 },
      expressions: [{ a: 0, expression: "surpris" }, { a: "a2:sait", expression: "sourire", transition: 0.3 }],
    },
    {
      id: "ines-piege",
      voix: "Inès",
      variante: "humain",
      apparence: INES_MAISON,
      presence: { de: "piege", a: "nuit" },
      depart: { position: PL.ines, orientation: 0 },
      poses: [{ a: 0, pose: "mainTendue" }, { a: "piege3", pose: "debout", transition: 0.4 }],
      expressions: [{ a: 0, expression: "decide" }, { a: "piege3", expression: "sourire", transition: 0.3 }],
    },

    // ======== palier du 5e : la trousse chez Morel ========
    {
      id: "ines-matin",
      voix: "Inès",
      variante: "humain",
      apparence: INES_MAISON,
      presence: { de: "matin", a: "piege" },
      depart: { position: PALIER5, orientation: 330 },
      poses: [
        { a: 0, pose: "mainTendue" },
        { a: "t3b+0.5", pose: "debout", transition: 0.3 },
        { a: "i_dormiez", pose: "bras", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "t3", expression: "decide" },
        { a: "i_compresses", expression: "fatigue" },
        { a: "i_dormiez", expression: "sourire" },
      ],
    },
    {
      id: "morel-matin",
      voix: "Morel",
      variante: "humain",
      apparence: { ...APPARENCE_MOREL, bonnet: "#5a4a3a", couleurPompon: "#5a4a3a" },
      presence: { de: "matin", a: "piege" },
      depart: { position: MOREL5, orientation: 35 },
      poses: [
        { a: 0, pose: "debout" },
        { a: "t3b-0.2", pose: "mainTendue", transition: 0.3 }, // il prend la trousse
        { a: "t3b+0.5", pose: "debout", transition: 0.3 },
        { a: "m_soupcon", pose: "bras", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "m_drogue", expression: "surpris" },
        { a: "i_compresses", expression: "fatigue" },
        { a: "m_soupcon", expression: "colere" },
        { a: "i_dormiez", expression: "triste", transition: 0.3 },
      ],
    },

    // ======== 4e : la lampe qui descend, le complice arrêté ========
    {
      // le complice, jamais vu pendant la descente : sa lampe (et ses pas) ; elle s'éteint au coin de l'escalier
      id: "complice-lampe",
      invisible: true,
      presence: { de: "cave", a: "attente" },
      depart: { position: [-0.9, NIV.e4, -1.1], orientation: 160 },
      trajet: [{ a: "cave.fin+0.3", position: [-1.3, NIV.e4, 0.65], orientation: 190, vitesse: 1.0, chemin: [[-0.6, NIV.e4, -0.3]] }],
    },
    {
      id: "voisin4-arrete",
      variante: "humain",
      apparence: VOISIN4,
      presence: { de: "attente", a: "poignee" },
      depart: { position: V4, orientation: 15 },
      poses: [{ a: 0, pose: "inquiet" }],
      expressions: [{ a: 0, expression: "colere" }, { a: "poche", expression: "peur", transition: 0.3 }],
    },
    {
      id: "flic1",
      variante: "humain",
      apparence: POLICIER,
      presence: { de: "attente", a: "poignee" },
      depart: { position: FLIC1, orientation: 285 },
      poses: [{ a: 0, pose: "lampe" }, { a: "poche-0.3", pose: "mainTendue", transition: 0.3 }],
      expressions: [{ a: 0, expression: "decide" }],
      lampe: { de: 0, a: "poche-0.3", puissance: 0.07 },
    },
    {
      id: "flic2",
      variante: "humain",
      apparence: POLICIERE,
      presence: { de: "attente", a: "poignee" },
      depart: { position: FLIC2, orientation: 75 },
      poses: [{ a: 0, pose: "lampe" }],
      expressions: [{ a: 0, expression: "decide" }],
      lampe: { de: 0, puissance: 0.07 },
    },

    // ======== palier du 6e : le voleur pris, puis Morel ========
    {
      id: "voleur",
      variante: "humain",
      apparence: VOLEUR_A,
      presence: { de: "pris", a: "m_heure" },
      depart: { position: VOLEUR, orientation: 25 },
      poses: [{ a: 0, pose: "accroupi" }],
      expressions: [{ a: 0, expression: "colere" }],
    },
    { id: "flic1-6", variante: "humain", apparence: POLICIER, presence: { de: "pris", a: "m_heure" }, depart: { position: FLIC1_6, orientation: 280 }, poses: [{ a: 0, pose: "lampe" }], expressions: [{ a: 0, expression: "decide" }], lampe: { de: 0, puissance: 0.07 } },
    { id: "flic2-6", variante: "humain", apparence: POLICIERE, presence: { de: "pris", a: "m_heure" }, depart: { position: FLIC2_6, orientation: 95 }, poses: [{ a: 0, pose: "debout" }], expressions: [{ a: 0, expression: "decide" }] },
    {
      id: "ines-palier",
      voix: "Inès",
      variante: "humain",
      apparence: INES_MAISON,
      presence: { de: "m_heure", a: "jour" },
      depart: { position: INES6B, orientation: 45 },
      poses: [{ a: 0, pose: "debout" }, { a: "i_nuit", pose: "bras", transition: 0.3 }],
      expressions: [{ a: 0, expression: "fatigue" }, { a: "i_nuit", expression: "sourire", transition: 0.3 }],
    },
    {
      id: "morel-palier",
      voix: "Morel",
      variante: "humain",
      apparence: { ...APPARENCE_MOREL, bonnet: "#5a4a3a", couleurPompon: "#5a4a3a" },
      presence: { de: "m_heure", a: "jour" },
      depart: { position: MOREL6, orientation: 312 },
      poses: [{ a: 0, pose: "bras" }, { a: "m_heure.fin", pose: "debout", transition: 0.3 }],
      expressions: [{ a: 0, expression: "colere" }, { a: "i_nuit", expression: "soulage", transition: 0.4 }],
    },

    // ======== cuisine (partie 1) : l'eau revient ========
    {
      id: "ines-cuisine",
      voix: "Inès",
      variante: "humain",
      apparence: INES_MAISON,
      presence: { de: "robinet" },
      depart: { position: INES_K, orientation: 335 },
      poses: [{ a: 0, pose: "debout" }],
      expressions: [{ a: 0, expression: "inquiet" }, { a: "fin", expression: "sourire", transition: 0.4 }],
    },
  ],
  camera: [
    // HOOK — raccord : au fond de son entrée, le papier dans la main (fin de la partie 4)
    { a: 0, ...cadrage.moyen(DEDANS6, 14, { distance: 2.5, fov: 78, x: 520, y: 760 }) },
    { a: "hook:vole", ...cadrage.moyen(DEDANS6, 6, { distance: 2.4, fov: 74, x: 520, y: 760 }), deplacement: 1.0 },
    // « Il dort deux étages plus bas » : la cage, du 6e jusqu'à la porte du 4e
    { a: "hook2", ...plan([0.9, NIV.e5 + 1.2, -0.4], { azimut: 0, elevation: 4, distance: 15, fov: 46, y: 660, x: 540 }), coupe: true },
    { a: "hook2:bas", ...plan([-0.9, NIV.e4 + 1.1, -1.3], { azimut: 4, elevation: 4, distance: 5.2, fov: 42, y: 640, x: 520 }), deplacement: 0.9 },
    // RÉCAP — la ville noire, la serrure jamais forcée, le papier, la page arrachée
    { a: "recap1", ...plan(P.fenetre6, { azimut: -8, elevation: 2, distance: 3.6, fov: 40, y: 640, x: 520 }), coupe: true },
    { a: "recap1:ines", ...plan([-0.9, NIV.e6 + 0.9, -1.5], { azimut: 6, elevation: 6, distance: 4.4, fov: 42, y: 660, x: 520 }), deplacement: 1.0 },
    { a: "recap2", ...plan(P.verrouInes, { azimut: 14, elevation: 6, distance: 1.4, fov: 34, y: 620, x: 520 }), coupe: true },
    { a: "recap3", ...plan(PAPIER_MAIN, { azimut: 18, elevation: 6, distance: 0.75, fov: 38, y: 620, x: 520 }), coupe: true },
    { a: "recap4", ...objet(CARNET, 4, { distance: 0.8 }), coupe: true },
    // A (fantôme) : elle lit le mot devant tous ; le complice sourit
    { a: "a1", ...plan([PL.ines[0], 0.9, -0.7], { azimut: 4, elevation: 14, distance: 6.6, fov: 46, y: 680, x: 540 }), coupe: true },
    { a: "a2", ...cadrage.pied(PL.voisin4, -28, { x: 520 }), deplacement: 0.6 },
    { a: "stop", ...cadrage.pied(PL.voisin4, -22, { distance: 4.6, x: 520 }), deplacement: 0.5 },
    // STOP (l'image recule), puis B : elle se tait, dans son entrée
    { a: "tait", ...plan([INES_TAIT[0], NIV.e6 + 0.85, INES_TAIT[2]], { azimut: 186, elevation: 6, distance: 1.95, fov: 80, x: 520, y: 760 }), coupe: true },
    // 1 : la cale (vue de l'intérieur, la porte au fond ; Inès de profil)
    { a: "t1", ...plan([-0.45, NIV.e6 + 0.55, -1.9], { azimut: 196, elevation: 16, distance: 2.9, fov: 82, y: 760, x: 540 }), coupe: true },
    { a: "t1b", ...objet([CALE[0], CALE[1] + 0.05, CALE[2]], 205, { distance: 0.95, elevation: 34 }), deplacement: 0.9 },
    { a: "i_entrez-0.1", ...plan([-0.25, NIV.e6 + 0.9, -2.1], { azimut: 180, elevation: 6, distance: 2.7, fov: 82, y: 700, x: 520 }), deplacement: 0.7 },
    // 2 : la preuve (l'enveloppe sur le meuble, puis la photo)
    { a: "t2+0.7", ...objet(ENVELOPPE, 150, { distance: 1.0, elevation: 40 }), coupe: true },
    { a: "t2b", ...plan([A_MEUBLE[0], NIV.e6 + 0.9, A_MEUBLE[2]], { azimut: 165, elevation: 6, distance: 2.6, fov: 82, y: 700, x: 540 }), deplacement: 0.8 },
    // 3 : chez Morel, au 5e (porte ouverte)
    { a: "matin", ...cadrage.deux(PALIER5, MOREL5, 12, { x: 540, y: 720 }), coupe: true },
    { a: "t3", ...cadrage.pied(PALIER5, 20, { x: 560 }), deplacement: 0.8 },
    { a: "t3a", ...objet(MAIN_INES5, 30, { distance: 1.0, elevation: 30 }), deplacement: 0.7 },
    { a: "t3b", ...cadrage.deux(PALIER5, MOREL5, 6, { x: 540, y: 720 }), deplacement: 0.8 },
    { a: "m_drogue", ...cadrage.pied(MOREL5, 40, { x: 520 }), deplacement: 0.7 },
    { a: "i_compresses", ...cadrage.pied(PALIER5, 14, { x: 540 }), deplacement: 0.7 },
    { a: "m_soupcon", ...cadrage.pied(MOREL5, 36, { x: 520 }), deplacement: 0.6 },
    { a: "i_dormiez", ...cadrage.deux(PALIER5, MOREL5, 8, { distance: 5.4, x: 540, y: 720 }), deplacement: 0.7 },
    // le piège : salon du 7e, le carnet
    { a: "piege", ...cadrage.pied(PL.ines, 10, { x: 540 }), coupe: true },
    { a: "piege2", ...objet([CARNET[0] + 0.1, CARNET[1], CARNET[2]], 4, { distance: 0.62 }), deplacement: 0.8 },
    { a: "piege2:ines", ...objet([CARNET[0] + 0.12, CARNET[1], CARNET[2] + 0.02], 8, { distance: 0.55 }), deplacement: 0.5 },
    { a: "piege3", ...plan([PL.ines[0], 0.9, -0.6], { azimut: -8, elevation: 14, distance: 6.4, fov: 46, y: 680, x: 540 }), coupe: true },
    // la nuit : porte calée, elle attend
    { a: "nuit", ...cadrage.moyen(NUIT6, 10, { distance: 2.5, fov: 80, x: 520, y: 780 }), coupe: true },
    // la lampe descend (le 4e), les policiers l'attendaient
    { a: "cave", ...plan([-0.6, NIV.e4 + 1.0, -0.3], { azimut: 4, elevation: 8, distance: 8.5, fov: 44, y: 680, x: 540 }), coupe: true },
    { a: "attente", ...cadrage.large([-0.3, NIV.e4, -0.2], 4, { distance: 6.2, x: 540 }), deplacement: 0.9 },
    // rappel : la main gantée au trousseau (parties 3 et 4)
    { a: "rappel", ...plan(MAIN_TROUSSEAU, { azimut: 14, elevation: 6, distance: 1.3, fov: 34, y: 620, x: 520 }), coupe: true },
    { a: "rappel2", ...plan(MAIN_TROUSSEAU, { azimut: 22, elevation: 8, distance: 1.0, fov: 34, y: 620, x: 520 }), deplacement: 1.0 },
    { a: "gants", ...cadrage.pied(V4, 12, { x: 520 }), coupe: true },
    // le trousseau : les doubles de tout l'immeuble, sauf le 6e
    { a: "poche", ...objet(TROUSSEAU, 10, { distance: 0.9, elevation: 20 }), coupe: true },
    { a: "sauf", ...objet(TROUSSEAU, 4, { distance: 0.62, elevation: 16 }), deplacement: 0.8 },
    // chez Inès : la poignée tourne, la porte bute sur la cale
    { a: "poignee", ...plan([-0.75, NIV.e6 + 0.55, -1.62], { azimut: 200, elevation: 8, distance: 1.9, fov: 52, y: 700, x: 540 }), coupe: true },
    { a: "bute", ...objet([CALE[0], CALE[1] + 0.08, CALE[2]], 210, { distance: 0.95, elevation: 26 }), deplacement: 0.7 },
    { a: "i_cri", ...cadrage.moyen(NUIT6, 10, { distance: 2.5, fov: 80, x: 520, y: 740 }), coupe: true },
    // le voleur pris sur le palier du 6e
    { a: "pris", ...cadrage.large([-0.45, NIV.e6, -0.1], 2, { distance: 6.4, x: 540 }), coupe: true },
    { a: "pris:cle", ...cadrage.pied(VOLEUR, 14, { distance: 5.4, x: 520 }), deplacement: 0.8 },
    { a: "m_heure", ...cadrage.deux(INES6B, MOREL6, 4, { x: 520, y: 740 }), coupe: true },
    { a: "i_nuit", ...cadrage.deux(INES6B, MOREL6, -6, { distance: 5.2, x: 500, y: 740 }), deplacement: 0.6 },
    // JOUR 6 : le courant revient (toute la cage s'allume), la pompe repart, l'eau revient
    { a: "jour", ...plan([0.9, NIV.e5 + 1.4, -0.4], { azimut: 0, elevation: 4, distance: 19, fov: 48, y: 700, x: 540 }), coupe: true },
    { a: "jour:courant", ...plan([0.9, NIV.e5 + 1.4, -0.4], { azimut: 0, elevation: 4, distance: 16, fov: 48, y: 700, x: 540 }), deplacement: 1.2 },
    { a: "pompe", ...plan([POMPE[0], POMPE[1] + 0.2, POMPE[2]], { azimut: 28, elevation: 16, distance: 4.2, fov: 44, y: 680, x: 540 }), coupe: true },
    { a: "robinet", ...plan([ROBINET[0] + 0.3, 0.95, ROBINET[2] + 0.4], { azimut: -18, elevation: 10, distance: 6.0, fov: 44, y: 680, x: 520 }), coupe: true },
    { a: "fin-0.3", ...plan([ROBINET[0] + 0.25, 0.95, ROBINET[2] + 0.35], { azimut: -12, elevation: 10, distance: 5.2, fov: 44, y: 680, x: 520 }), deplacement: 1.2 },
  ],
  hud: [
    {
      type: "montre",
      a: "fin+0.7",
      jour: 5,
      heure: "02:00",
      temperature: 8,
      changements: [
        { a: "matin", heure: "08:00" },
        { a: "nuit", jour: 6, heure: "03:00", temperature: 7 },
        { a: "jour", heure: "09:00" },
        { a: "robinet", temperature: 10 },
      ],
    },
    { type: "etiquette", de: "recap2", a: "recap3-0.1", texte: "Jamais forcée", point: P.verrouInes, style: "danger" },
    { type: "etiquette", de: "recap4", a: "a1-0.1", texte: "Page arrachée", point: [CARNET[0] - 0.02, CARNET[1] + 0.02, CARNET[2]], style: "danger" },
    { type: "tactique", de: "t1", a: "t2", numero: 1, total: 3, titre: "Bloquez la porte" },
    { type: "etiquette", de: "t1b", a: "t1c+0.8", texte: "Cale", point: [CALE[0], CALE[1] + 0.06, CALE[2]], style: "ressource" },
    { type: "tactique", de: "t2", a: "matin", numero: 2, total: 3, titre: "Gardez la preuve" },
    { type: "fiche", de: "t2b", a: "matin", icone: "telephone", titre: "La preuve", lignes: ["Original dans une enveloppe", "Photo · date · heure"], cote: "gauche" },
    { type: "tactique", de: "t3", a: "piege", numero: 3, total: 3, titre: "Pas tout chez vous" },
    { type: "etiquette", de: "piege2:ines", a: "piege3-0.1", texte: "Faux", point: [CARNET[0] + 0.1, CARNET[1] + 0.02, CARNET[2] + 0.05], style: "danger" },
    { type: "etiquette", de: "sauf", a: "poignee-0.1", texte: "6e : manquante", point: [TROUSSEAU[0] + 0.05, TROUSSEAU[1] - 0.06, TROUSSEAU[2]], style: "danger" },
    { type: "carton", de: "fin+0.7", partie: 5, titre: "H+72", verifie: "27/10/2026", question: "Vous auriez tenu combien de jours ?", fin: true },
  ],
  sons: [
    // ---- hook, récap ----
    { a: "hook:vole", id: "pro_impact/short", gain: -8 },
    { a: "hook2", id: "whoosh_big/deep", gain: -9 },
    { a: "hook2:bas", id: "pro_sub_drop/low", gain: -7 },
    { a: "recap1", id: "cut_hit/sub", gain: -10 },
    { a: "recap1:ines", id: "whoosh_big/swell", gain: -12 },
    { a: "recap2", id: "cut_hit/sub", gain: -10 },
    { a: "recap2:cle", id: "toggle/latch", gain: -9 },
    { a: "recap3", id: "pro_impact/short", gain: -9 },
    { a: "recap3", id: "swipe/cloth", gain: -10 },
    { a: "recap4", id: "cut_hit/sub", gain: -9 },
    { a: "recap4:arrache", id: "pro_impact/deep", gain: -7 },
    // ---- A (fantôme), STOP ----
    { a: "a1", id: "reverse_swell/dark", gain: -9 },
    { a: "a1:mot", id: "swipe/cloth", gain: -10 },
    { a: "a2", id: "pro_sub_drop/low", gain: -6 },
    { a: "stop", id: "click/thock", gain: -4 },
    { a: "stop", id: "cut_hit/punch", gain: -6 },
    { a: "tait-0.08", id: "click/thock", gain: -4 },
    // ---- 1 : la cale ----
    { a: "t1", id: "pro_impact/short", gain: -9 },
    { a: "t1a", id: "swish/soft", gain: -11 },
    { a: "t1b", id: "knock/wood", gain: -6 },
    { a: "t1b:porte", id: "knock/wood", gain: -5 },
    { a: "t1c", id: "fit/land.light/finger_wood", gain: -9 },
    { a: "i_entrez", id: "cut_hit/sub", gain: -11 },
    // ---- 2 : la preuve ----
    { a: "t2", id: "pro_impact/short", gain: -9 },
    { a: "t2+0.7", id: "swipe/cloth", gain: -9 },
    { a: "t2a:enveloppe", id: "swipe/cloth", gain: -10 },
    { a: "t2b:photo", id: "click/thock", gain: -9 },
    { a: "t2b:heure", id: "tap/table", gain: -11 },
    // ---- 3 : chez Morel ----
    { a: "matin", id: "cut_hit/sub", gain: -8 },
    { a: "matin:morel", id: "toggle/latch", gain: -9 },
    { a: "t3", id: "pro_impact/short", gain: -9 },
    { a: "t3a:trousse", id: "swipe/cloth", gain: -10 },
    { a: "t3b", id: "whoosh_fast/heavy", gain: -13 },
    { a: "t3b:moitie", id: "tap/table", gain: -10 },
    { a: "m_drogue", id: "cut_hit/sub", gain: -12 },
    { a: "i_compresses", id: "swish/soft", gain: -12 },
    { a: "m_soupcon", id: "cut_hit/sub", gain: -12 },
    { a: "i_dormiez", id: "swish/soft", gain: -12 },
    // ---- le piège ----
    { a: "piege", id: "cut_hit/sub", gain: -8 },
    { a: "piege:ligne", id: "swipe/cloth", gain: -10 },
    { a: "piege2", id: "pro_impact/short", gain: -9 },
    { a: "piege2:cave", id: "tap/table", gain: -10 },
    { a: "piege3", id: "whoosh_big/swell", gain: -11 },
    // ---- la nuit ----
    { a: "nuit", id: "cut_hit/sub", gain: -8 },
    { a: "nuit:calee", id: "knock/wood", gain: -10 },
    { a: "cave", id: "whoosh_big/deep", gain: -10 },
    { a: "cave:lampe", id: "click/thock", gain: -9 },
    { a: "attente", id: "pro_impact/deep", gain: -7 },
    { a: "attente+0.5", id: "click/thock", gain: -9 },
    { a: "rappel", id: "reverse_swell/dark", gain: -8 },
    { a: "rappel2:trousseau", id: "tap/knuckle", gain: -10 },
    { a: "gants", id: "cut_hit/sub", gain: -8 },
    { a: "gants:4e", id: "pro_impact/deep", gain: -6 },
    { a: "poche", id: "cut_hit/sub", gain: -9 },
    { a: "poche:doubles", id: "tap/knuckle", gain: -8 },
    { a: "sauf", id: "pro_sub_drop/low", gain: -5 },
    // ---- la poignée, la cale, le cri ----
    { a: "poignee", id: "cut_hit/sub", gain: -8 },
    { a: "poignee:tourne", id: "toggle/latch", gain: -6 },
    { a: "bute", id: "knock/wood", gain: -3 },
    { a: "bute:cale", id: "pro_impact/deep", gain: -6 },
    { a: "i_cri", id: "pro_impact/deep", gain: -8 },
    { a: "pris", id: "cut_hit/punch", gain: -7 },
    { a: "pris:pris", id: "knock/desk", gain: -6 },
    { a: "pris:cle", id: "tap/knuckle", gain: -9 },
    { a: "m_heure", id: "cut_hit/sub", gain: -10 },
    { a: "i_nuit", id: "swish/soft", gain: -12 },
    // ---- jour 6 : le courant, la pompe, l'eau ----
    { a: "jour", id: "cut_hit/sub", gain: -9 },
    { a: "jour:courant", id: "fit/snap/switch_flip", gain: -6 },
    { a: "jour:courant+0.3", id: "fit/snap/switch_flip", gain: -9 },
    { a: "pompe", id: "cut_hit/sub", gain: -9 },
    { a: "pompe:repart", id: "riser/dark", gain: -12 },
    { a: "robinet", id: "cut_hit/sub", gain: -9 },
    { a: "robinet:robinet", id: "drip/bubble", gain: -9 },
    { a: "robinet:air", id: "drip/drop", gain: -9 },
    { a: "fin", id: "drip/drop", gain: -10 },
    // ---- carton de fin de série ----
    { a: "fin+0.7", id: "impact/deep", gain: -8 },
    { a: "fin+0.9", id: "whoosh_fast/heavy", gain: -9 },
    { a: "fin+1.3", id: "cut_hit/sub", gain: -6 },
  ],
  ambiances: [
    { type: "drone", de: 0, a: "jour", niveau: -1, fondu: 1.2 },
    { type: "vent", de: 0, a: "jour", niveau: -5, fondu: 1.0 },
    { type: "coeur", de: 0, a: "stop", niveau: -1, bpm: 98 },
    { type: "ville", de: "recap1", a: "recap2", niveau: 0, fondu: 0.6 },
    { type: "coeur", de: "cave", a: "attente", niveau: -1, bpm: 110 },
    { type: "coeur", de: "poignee", a: "pris", niveau: 0, bpm: 120 },
    { type: "grincement", de: "poignee:tourne", a: "poignee:tourne+0.6", niveau: -5, fondu: 0.1 },
    { type: "grincement", de: "bute", a: "bute+0.5", niveau: -5, fondu: 0.1 },
    { type: "ville", de: "jour", a: "pompe", niveau: -2, fondu: 0.8 },
    { type: "glouglou", de: "robinet:air", a: "fin", niveau: -6, fondu: 0.3 },
    { type: "eau", de: "fin", a: "fin+8", niveau: -6, fondu: 0.4 },
    { type: "drone", de: "fin+0.7", a: "fin+8", niveau: -3, fondu: 0.8 },
  ],
  sujets: [
    { de: 0, a: "hook2", personnage: "ines-debut", hauteur: 1.1 },
    { de: "recap2", a: "recap3", point: P.verrouInes },
    { de: "recap3", a: "recap4", point: PAPIER_MAIN },
    { de: "recap4", a: "a1", point: CARNET },
    { de: "a2", a: "stop", personnage: "voisin4-a", hauteur: 1.1 },
    { de: "tait", a: "t1", personnage: "ines-maison", hauteur: 1.1 },
    { de: "t1b-0.9", a: "i_entrez-0.5", point: CALE },
    { de: "i_entrez", a: "t2", personnage: "ines-maison", hauteur: 1.1 },
    { de: "t2+0.7", a: "t2b", point: ENVELOPPE },
    { de: "t2b", a: "matin", personnage: "ines-maison", hauteur: 1.1 },
    { de: "matin", a: "t3-0.8", personnage: "ines-matin", hauteur: 1.1 },
    { de: "t3a-0.7", a: "t3b", point: MAIN_INES5 },
    { de: "m_drogue", a: "i_compresses-0.7", personnage: "morel-matin", hauteur: 1.1 },
    { de: "i_compresses", a: "m_soupcon-0.6", personnage: "ines-matin", hauteur: 1.1 },
    { de: "m_soupcon", a: "i_dormiez-0.7", personnage: "morel-matin", hauteur: 1.1 },
    { de: "piege2-0.8", a: "piege3", point: [CARNET[0] + 0.1, CARNET[1], CARNET[2]] },
    { de: "nuit", a: "cave", personnage: "ines-nuit", hauteur: 0.7 },
    { de: "rappel", a: "gants", point: MAIN_TROUSSEAU },
    { de: "gants", a: "poche", personnage: "voisin4-arrete", hauteur: 1.1 },
    { de: "poche", a: "poignee", point: TROUSSEAU },
    { de: "bute", a: "i_cri", point: CALE },
    { de: "i_cri", a: "pris", personnage: "ines-nuit", hauteur: 1.1 },
    { de: "m_heure", a: "jour", personnage: "ines-palier", hauteur: 1.1 },
    { de: "m_heure", a: "jour", personnage: "morel-palier", hauteur: 1.1 },
    { de: "pompe", a: "robinet", point: POMPE },
    { de: "robinet", a: "fin+0.7", personnage: "ines-cuisine", hauteur: 1.1 },
  ],
};
// repères non utilisés par les données mais partagés avec Episode.tsx
export { DEMI, ZF };
