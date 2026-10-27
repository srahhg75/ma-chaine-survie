import { cadrage, OptionsPlan, plan } from "../../systeme/camera";
import { DonneesEpisode } from "../../systeme/episode";
import { Vec3 } from "../../systeme/maths";
import { Apparence, APPARENCE_INES, APPARENCE_MOREL } from "../../systeme/personnage/apparence";
import { DEMI, descente, montee, NIV, P, ZA, ZF } from "../003-h72-lampe/donnees";

/*
 * H+72 — Partie 4 « Le conseil de l'immeuble ». Script : videos/004-h72-conseil/script.txt (découpage : script.md).
 * Trois plateaux, raccordés par des coupes nettes :
 *  1. la CAGE D'ESCALIER de la partie 3 (CageEscalier, mêmes coordonnées) : Inès au 7e entre les deux lampes ;
 *     elle crie, les portes s'ouvrent, les lampes s'enfuient, Morel monte du 5e ; puis elle redescend au 6e ;
 *  2. le SALON DES VOISINS DU 7e, posé à l'écart (x ≈ −30, y = 0) et décrit EN DONNÉES (pièce + meubles : contrôlés
 *     par tools/qc.ts) : la réunion autour de la table aux bougies ;
 *  3. l'ENTRÉE D'INÈS (6e), derrière sa porte (dessinée par CageEscalier, `entreeInes`) : le papier sous la porte.
 * STOP : la branche B (fantôme : elle se tait dans le noir) est rejouée à l'envers, image et son (`depuis`).
 */
export const SX = -30; // centre du salon du 7e
const s = (x: number, y: number, z: number): Vec3 => [SX + x, y, z];

// Salon : table au centre, Inès au fond (face caméra), voisins autour
export const TABLE: Vec3 = s(0, 0, -0.45);
export const H_TABLE = 0.76 * 0.82; // table à l'échelle des personnages (≈ 1,4 m)
export const CARNET: Vec3 = s(-0.05, H_TABLE + 0.006, -0.68);
export const BOITES: Vec3 = s(0.25, H_TABLE, -0.42); // tas de boîtes de médicaments
export const PAIRE_BOITES: Vec3 = s(0.3, H_TABLE, -0.35); // les deux boîtes côte à côte (Morel, Mme Benoît)
export const FENETRE: Vec3 = s(0.9, 1.45, -2.4);

export const PL = {
  ines: s(0, 0, -1.22),
  morel: s(1.05, 0, -0.55),
  pere: s(-1.05, 0, -0.62),
  mere: s(-1.38, 0, 0.12),
  dame: s(1.38, 0, 0.12),
  voisin4: s(0.78, 0, -1.55),
};

// Cage (plateau 1)
const PALIER7 = [-1.1, NIV.e7, -0.5] as Vec3; // dernière place d'Inès en partie 3
const COIN7 = [-1.42, NIV.e7, -1.18] as Vec3; // le fantôme accroupi dans le coin du palier
const MOREL7 = [-0.4, NIV.e7, 0.42] as Vec3; // Morel, arrivé en haut des marches, côte à côte avec Inès
const INES7B = [-1.2, NIV.e7, 0.1] as Vec3; // Inès, tournée vers Morel
const SEUIL7 = [-2.05, NIV.e7, -0.32] as Vec3; // le père du 7e dans son entrée (hors du battant ouvert)
const BAS = [2.4, NIV.e5 + DEMI, -0.4] as Vec3; // l'inconnu du bas (palier intermédiaire 5e½), fin de la partie 3
// Entrée d'Inès (plateau 3)
const DEHORS6 = [-0.9, NIV.e6, -1.15] as Vec3;
export const DEDANS6 = [-0.85, NIV.e6, -4.4] as Vec3; // au fond de son entrée, face à la porte
// le papier dans sa main droite, tenu devant elle (à DEDANS6, orientation 10)
export const PAPIER_MAIN: Vec3 = [-0.91, NIV.e6 + 0.86, -4.02]; // sous le visage (les reflets des yeux passent devant tout)
export const PAPIER: Vec3 = [-0.6, NIV.e6 + 0.004, -1.86]; // glissé sous la porte, à côté du passage

// Nouveaux voisins (muets)
export const PERE7: Partial<Apparence> = {
  femme: false, age: 0.3, peau: "#c98e68", joues: "#c9705e", iris: "#3a2a1a", cheveux: "#1e1612", coiffure: "court",
  haut: "pull", couleurHaut: "#3f5f86", couleurCol: "#d8d2c6", pantalon: "#3a3a40", chaussures: "chaussons", couleurChaussures: "#5a4a3a",
};
export const MERE7: Partial<Apparence> = {
  femme: true, age: 0.22, peau: "#d9a47e", joues: "#d77d6e", iris: "#2e2014", cheveux: "#151010", coiffure: "carre",
  haut: "polaire", couleurHaut: "#8e3b38", couleurCol: "#e6dccb", pantalon: "#2e3440", chaussures: "chaussons", couleurChaussures: "#7a6a5a",
};
export const DAME: Partial<Apparence> = {
  femme: true, age: 0.85, peau: "#ecc6a8", joues: "#e3988a", iris: "#5a6a7a", cheveux: "#d8d6d2", coiffure: "court",
  haut: "cardigan", couleurHaut: "#6a4f7a", couleurCol: "#efe8dc", pantalon: "#4a4038", chaussures: "chaussons", couleurChaussures: "#3a2c4a",
  lunettes: true, echarpe: "#c9b48a",
};
// Le voisin du 4e : mêmes gants noirs que la main du trousseau (indice jamais commenté)
export const VOISIN4: Partial<Apparence> = {
  femme: false, age: 0.18, peau: "#e2b08e", joues: "#d98676", iris: "#2a3a2a", cheveux: "#4a3424", coiffure: "court",
  haut: "parka", couleurHaut: "#24272b", couleurCol: "#55595e", pantalon: "#23252a", chaussures: "bottines", couleurChaussures: "#1d1b19",
  bonnet: "#3d4045", couleurPompon: "#3d4045", gants: "#121212",
};
export const GANTS = VOISIN4.gants!;
export const INES_A: Partial<Apparence> = { ...APPARENCE_INES, bonnet: "#c9a227" };

// Cadrages : ceux du moteur (cadrage.large / pied / deux / moyen / gros, analyse/cadrages.md) ; objet = gros plan d'objet
const objet = (p: Vec3, az: number, op: Partial<OptionsPlan> = {}) => plan(p, { azimut: az, elevation: 48, distance: 0.9, fov: 34, y: 600, ...op });

// Visages du flash final (« Il était à la réunion. ») : mêmes voisins, mêmes places
// (« fin:il » = la phrase @fin ; l'ancre « fin » seule désigne la fin de la voix)
const FLASH = { de: "fin:il-0.6" } as const;

export const donnees: DonneesEpisode = {
  id: "004-h72-conseil",
  titre: "H+72 — Partie 4 : Le conseil de l'immeuble",
  queue: 9.4, // le narrateur lit le choix A/B sur le carton (@carton1-4)
  post: { bloom: 0.38, seuilBloom: 0.86, vignette: 0.64, grain: 0.03, exposition: 0.9 }, // nuit sans courant
  // STOP : la branche B (de « Si elle éteint » à « Sauf eux ») recule, image et son, jusqu'à « Elle crie »
  retours: [{ de: "stop", a: "crie", depuis: "b1" }],
  decor: {
    pieces: [
      {
        id: "salon7",
        centre: [SX, -0.5],
        largeur: 5.6,
        profondeur: 3.8,
        hauteur: 2.6,
        sol: "parquet",
        murs: "papier",
        couleurMurs: "#7d6c58",
        couleurSol: "#6a4a32",
        devant: ["sud", "est"],
        ouvertures: [
          { mur: "nord", type: "fenetre", centre: 0.9, largeur: 1.2, hauteur: 1.3, bas: 0.8 },
          { mur: "ouest", type: "porte", centre: -0.6, largeur: 0.9, hauteur: 2.05 },
        ],
      },
    ],
    meubles: [
      { type: "table", position: TABLE, echelle: 0.82, couleur: "#6b4a30", id: "table" },
      { type: "tapis", position: s(0, 0, -0.45), echelle: 1.3, couleur: "#6e3a32" },
      { type: "frigo", position: s(-2.35, 0, -1.95), echelle: 0.85, couleur: "#d9d6cf", id: "frigo" },
      { type: "etagere", position: s(2.2, 0, -2.2), echelle: 0.9, couleur: "#5a3d28", id: "etagere" },
      { type: "canape", position: s(-2.2, 0, 0.55), rotation: 90, echelle: 0.85, couleur: "#4f5a4a", id: "canape" },
      { type: "radiateur", position: s(0.9, 0.12, -2.33), echelle: 0.8 },
    ],
    exterieur: { ville: { allumees: 0, distance: 13 }, neige: { densite: 0.7, vent: 0.35 }, ciel: "nuit" },
  },
  personnages: [
    // ======== plateau 1 : la cage ========
    {
      // Inès au 7e : la dernière image de la partie 3 (hook, récap). Absente pendant la branche B : on ne voit que
      // son fantôme (sinon elle le cache) ; le STOP fait reculer l'image jusqu'ici.
      id: "ines-debut",
      voix: "Inès",
      variante: "humain",
      apparence: INES_A,
      presence: { a: "b1" },
      depart: { position: PALIER7, orientation: 345 },
      poses: [{ a: 0, pose: "inquiet" }],
      expressions: [{ a: 0, expression: "peur" }, { a: "recap2", expression: "colere" }, { a: "recap4", expression: "peur" }],
    },
    {
      // Inès au 7e, après le STOP, jusqu'à la coupe de minuit
      id: "ines",
      voix: "Inès",
      variante: "humain",
      apparence: INES_A,
      presence: { de: "stop", a: "conseil" },
      depart: { position: PALIER7, orientation: 345 },
      trajet: [
        // « 1 : faites du bruit » : elle tape à la porte des voisins, de profil (au sud du chambranle)
        { a: "t1", position: [-1.38, NIV.e7, -0.3], orientation: 290, vitesse: 0.8 },
        // Morel arrive par l'escalier : elle se tourne vers lui (côte à côte, de trois-quarts vers la caméra)
        { a: "m_heure-0.3", position: INES7B, orientation: 45, vitesse: 0.8 },
      ],
      poses: [
        { a: 0, pose: "debout" },
        { a: "crie-0.2", pose: "debout", transition: 0.2 },
        { a: "t1:bruit-0.15", pose: "frappe", transition: 0.15 },
        { a: "t1b", pose: "debout", transition: 0.3 },
        { a: "i_aussi", pose: "bras", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "peur" },
        { a: "crie-0.2", expression: "decide", transition: 0.2 },
        { a: "i_cri", expression: "colere", transition: 0.1 },
        { a: "t1c", expression: "inquiet" },
        { a: "police", expression: "soulage", transition: 0.4 },
        { a: "m_heure", expression: "surpris", transition: 0.2 },
        { a: "i_aussi", expression: "fatigue" },
      ],
      lampe: { de: "crie", a: "police", puissance: 0.07 }, // éteinte quand les lampes ont fui (pas dans les yeux de Morel)
    },
    {
      // Fantôme de la branche B : elle s'accroupit dans le coin, lampe éteinte, et se tait
      id: "fantome-tait",
      variante: "humain",
      apparence: INES_A,
      depart: { position: COIN7, orientation: 25 },
      poses: [{ a: 0, pose: "accroupi" }],
      expressions: [{ a: 0, expression: "peur" }],
      fantome: { de: "b1", a: "b3.fin+0.25" },
    },
    {
      // Morel : réveillé par les cris, il monte du 5e avec sa lampe
      id: "morel",
      voix: "Morel",
      variante: "humain",
      apparence: { ...APPARENCE_MOREL, bonnet: "#5a4a3a", couleurPompon: "#5a4a3a" },
      presence: { de: "crie", a: "conseil" },
      depart: { position: [-1.45, NIV.e5, -0.6], orientation: 90 },
      trajet: [
        {
          a: "police.fin",
          position: MOREL7,
          orientation: 312,
          vitesse: 1.15,
          chemin: [[-0.5, NIV.e5, -0.85], ...montee(NIV.e5), ...montee(NIV.e6).slice(0, 5), [-0.1, NIV.e7, 0.3]],
        },
      ],
      poses: [
        { a: 0, pose: "debout" },
        { a: "m_heure", pose: "bras", transition: 0.25 },
        { a: "m_heure.fin", pose: "debout", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "m_heure", expression: "colere" },
        { a: "i_aussi", expression: "decide" },
      ],
      lampe: { de: "crie+0.4", a: "police.fin", puissance: 0.07 }, // éteinte en arrivant : pas dans les yeux d'Inès
    },
    {
      // Le père du 7e ouvre sa porte, une lampe à la main
      id: "pere-cage",
      variante: "humain",
      apparence: PERE7,
      presence: { de: "t1b", a: "conseil" },
      depart: { position: SEUIL7, orientation: 95 },
      poses: [{ a: 0, pose: "lampe" }],
      expressions: [{ a: 0, expression: "surpris" }, { a: "t1c", expression: "inquiet" }],
      lampe: { de: "t1b", a: "police", puissance: 0.07 }, // éteinte ensuite : son faisceau traversait le plan Inès / Morel
    },
    {
      // L'inconnu du bas : jamais montré (sa lampe et ses pas). Il hésite, puis s'enfuit vers le bas.
      id: "inconnu",
      invisible: true,
      depart: { position: BAS, orientation: 300 },
      trajet: [
        { a: "t1a", position: [2.1, NIV.e5 + DEMI, -0.2], orientation: 300, vitesse: 0.5 },
        // il redescend par le vrai chemin : volée du fond jusqu'au 5e, traverse le palier, volée de devant…
        { a: "t1c.fin+0.8", position: [0.2, NIV.e4, -0.9], vitesse: 2.0, chemin: [[1.8, NIV.e5 + DEMI, ZF], [0, NIV.e5, ZF], ...descente(NIV.e5)] },
      ],
    },
    {
      // Inès redescend au 6e (« Elle redescend enfin dormir »)
      id: "ines-descend",
      voix: "Inès",
      variante: "humain",
      apparence: INES_A,
      presence: { de: "calme", a: "porte" },
      depart: { position: [2.3, NIV.e6 + DEMI, ZA - 0.25], orientation: 180 },
      trajet: [{ a: "porte+0.3", position: [0.4, NIV.e6 + 0.1, ZF], vitesse: 1.1, chemin: [[2.3, NIV.e6 + DEMI, ZF + 0.25], [1.8, NIV.e6 + DEMI, ZF]] }],
      poses: [{ a: 0, pose: "debout" }],
      expressions: [{ a: 0, expression: "fatigue" }],
      lampe: { de: 0, puissance: 0.07 },
    },
    {
      // Inès entre chez elle et trouve le papier
      id: "ines-entree",
      voix: "Inès",
      variante: "humain",
      apparence: INES_A,
      presence: { de: "porte", a: "papier2" },
      depart: { position: DEHORS6, orientation: 180 },
      trajet: [
        // elle entre et s'arrête à côté du papier, hors du battant de la porte (qui se referme derrière elle)
        // et hors du gros plan du papier (avant, elle traversait l'image devant la caméra)
        { a: "porte+1.2", position: [-0.2, NIV.e6, -2.0], orientation: 230, vitesse: 0.9, chemin: [[-0.88, NIV.e6, -1.75]] },
        // pendant le plan de la serrure (vu du palier), elle recule au fond de l'entrée et regarde sa porte
        { a: "rappel2", position: DEDANS6, orientation: 10, vitesse: 1.5 },
      ],
      poses: [
        { a: 0, pose: "lampe" },
        { a: "mot", pose: "inquiet", transition: 0.3 },
        { a: "papier-0.3", pose: "mainTendue", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "porte:papier", expression: "surpris", transition: 0.2 },
        { a: "mot", expression: "peur", transition: 0.2 },
        { a: "rappel2", expression: "peur" },
        { a: "papier", expression: "inquiet" },
      ],
      lampe: { de: 0, a: "mot", puissance: 0.07 },
    },

    // ======== plateau 2 : le salon du 7e ========
    {
      id: "ines-salon",
      voix: "Inès",
      variante: "humain",
      apparence: { ...INES_A, bonnet: null },
      presence: { de: "conseil", a: "calme" },
      depart: { position: PL.ines, orientation: 0 },
      poses: [
        { a: 0, pose: "debout" },
        { a: "t2-0.2", pose: "mainTendue", transition: 0.3 }, // elle écrit dans le carnet
        { a: "t2a", pose: "debout", transition: 0.3 },
        { a: "t3b-0.3", pose: "mainTendue", transition: 0.25 }, // elle reprend la boîte
        { a: "t3c", pose: "debout", transition: 0.3 },
        { a: "liste-0.2", pose: "mainTendue", transition: 0.3 },
        { a: "laisse", pose: "debout", transition: 0.4 },
      ],
      expressions: [
        { a: 0, expression: "decide" },
        { a: "i_70", expression: "fatigue" },
        { a: "t3b", expression: "decide" },
        { a: "t3d", expression: "sourire" },
        { a: "liste", expression: "decide" },
        { a: "laisse", expression: "soulage", transition: 0.5 },
      ],
    },
    {
      id: "morel-salon",
      voix: "Morel",
      variante: "humain",
      apparence: APPARENCE_MOREL,
      presence: { de: "conseil", a: "calme" },
      depart: { position: PL.morel, orientation: 292 },
      poses: [
        { a: 0, pose: "debout" },
        { a: "m_fragile", pose: "bras", transition: 0.25 },
        { a: "t3", pose: "debout", transition: 0.3 },
        { a: "m_coeur-0.2", pose: "mainTendue", transition: 0.25 },
        { a: "t3b+0.2", pose: "debout", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "m_fragile", expression: "colere" },
        { a: "i_70", expression: "triste", transition: 0.3 },
        { a: "m_coeur", expression: "sourire" },
        { a: "t3b", expression: "surpris", transition: 0.2 },
        { a: "t3c", expression: "fatigue" },
      ],
    },
    {
      // Fantôme du mauvais geste : Morel prend les cachets de la voisine
      id: "fantome-cachets",
      variante: "humain",
      apparence: APPARENCE_MOREL,
      depart: { position: s(0.8, 0, -0.12), orientation: 275 },
      poses: [{ a: 0, pose: "mainTendue" }],
      expressions: [{ a: 0, expression: "sourire" }],
      fantome: { de: "t3a", a: "t3a.fin+0.2" },
    },
    {
      id: "pere-salon",
      variante: "humain",
      apparence: PERE7,
      presence: { de: "conseil", a: "calme" },
      depart: { position: PL.pere, orientation: 68 },
      poses: [
        { a: 0, pose: "debout" },
        { a: "t2a:malade", pose: "frappe", transition: 0.25 }, // il lève la main : diabétique
        { a: "t2b", pose: "debout", transition: 0.3 },
        { a: "t3d-0.3", pose: "mainTendue", transition: 0.3 }, // il montre son stylo à insuline
        { a: "liste", pose: "debout", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "inquiet" },
        { a: "t3d", expression: "inquiet" },
        { a: "t3d:frigo", expression: "soulage", transition: 0.4 },
      ],
    },
    {
      id: "mere-salon",
      variante: "humain",
      apparence: MERE7,
      presence: { de: "conseil", a: "calme" },
      depart: { position: PL.mere, orientation: 75 },
      poses: [{ a: 0, pose: "bras" }],
      expressions: [{ a: 0, expression: "inquiet" }, { a: "m_fragile", expression: "sourire" }, { a: "t3", expression: "neutre" }],
    },
    {
      id: "dame-salon",
      variante: "humain",
      apparence: DAME,
      presence: { de: "conseil", a: "calme" },
      depart: { position: PL.dame, orientation: 285 },
      poses: [
        { a: 0, pose: "debout" },
        { a: "t2a", pose: "frappe", transition: 0.25 }, // elle lève la main : elle vit seule
        { a: "t2a:malade", pose: "debout", transition: 0.3 },
      ],
      expressions: [{ a: 0, expression: "neutre" }, { a: "t3a", expression: "surpris", transition: 0.2 }, { a: "t3b", expression: "soulage" }],
    },
    {
      id: "voisin4-salon",
      variante: "humain",
      apparence: VOISIN4,
      presence: { de: "conseil", a: "calme" },
      depart: { position: PL.voisin4, orientation: 340 },
      poses: [{ a: 0, pose: "debout" }],
      expressions: [{ a: 0, expression: "neutre" }, { a: "liste2:trousse", expression: "decide", transition: 0.3 }],
    },
    // Flash final : les mêmes voisins, aux mêmes places, regardés un par un
    { id: "morel-flash", variante: "humain", apparence: APPARENCE_MOREL, presence: FLASH, depart: { position: PL.morel, orientation: 320 }, expressions: [{ a: 0, expression: "fatigue" }] },
    { id: "dame-flash", variante: "humain", apparence: DAME, presence: FLASH, depart: { position: PL.dame, orientation: 330 }, expressions: [{ a: 0, expression: "neutre" }] },
    { id: "pere-flash", variante: "humain", apparence: PERE7, presence: FLASH, depart: { position: PL.pere, orientation: 40 }, expressions: [{ a: 0, expression: "inquiet" }] },
    { id: "mere-flash", variante: "humain", apparence: MERE7, presence: FLASH, depart: { position: PL.mere, orientation: 30 }, expressions: [{ a: 0, expression: "neutre" }] },
    { id: "voisin4-flash", variante: "humain", apparence: VOISIN4, presence: FLASH, depart: { position: PL.voisin4, orientation: 355 }, expressions: [{ a: 0, expression: "neutre" }] },
  ],
  camera: [
    // HOOK — raccord : Inès au 7e entre les deux lampes ; recul vers toute la cage
    // (recul dès la 1re seconde : les deux lampes entrent dans l'image tout de suite)
    { a: 0, ...cadrage.gros(PALIER7, 8, { distance: 2.4, x: 520 }) },
    // toute la cage : la lampe du toit en haut, celle du bas au-dessus des sous-titres
    { a: "hook:escalier", ...plan([0.9, 9.2, -0.4], { azimut: 0, elevation: 4, distance: 21, fov: 46, y: 600, x: 540 }), deplacement: 1.7 },
    // RÉCAP — la ville noire, les bidons de Morel (l'eau volée), la serrure d'Inès, le complice
    { a: "recap1", ...plan([2.7, NIV.e6 + DEMI + 1.15, -1.6], { azimut: -8, elevation: 2, distance: 3.6, fov: 40, y: 640, x: 520 }), coupe: true },
    { a: "recap1:ville", ...plan([2.7, NIV.e6 + DEMI + 1.15, -1.6], { azimut: -4, elevation: 2, distance: 2.8, fov: 40, y: 640, x: 520 }), deplacement: 1.2 },
    { a: "recap2", ...plan([-2.8, NIV.e5 + 0.5, -1.3], { azimut: 6, elevation: 14, distance: 3.0, fov: 40, y: 640, x: 520 }), coupe: true },
    { a: "recap3", ...plan(P.verrouInes, { azimut: 14, elevation: 6, distance: 1.4, fov: 34, y: 620, x: 520 }), coupe: true },
    { a: "recap4", ...plan(P.lampeToit, { azimut: 10, elevation: -6, distance: 4.6, fov: 42, y: 560, x: 520 }), coupe: true },
    // B (fantôme) : accroupie dans le coin, les deux lampes arrivent sur elle
    { a: "b1:eteint", ...cadrage.pied(COIN7, 18, { x: 540, y: 720, elevation: 12 }), deplacement: 0.85 },
    // STOP (l'image recule), puis A : elle se relève et crie
    { a: "crie", ...cadrage.gros(PALIER7, 10, { distance: 2.6, x: 520 }), coupe: true },
    { a: "t1", ...cadrage.large([-1.38, NIV.e7, -0.3], 10, { x: 560 }), deplacement: 0.8 },
    // « Un voleur veut du silence » : la lampe du bas hésite
    { a: "t1a", ...plan([2.1, NIV.e5 + DEMI + 0.9, -0.3], { azimut: 6, elevation: 20, distance: 5.0, fov: 42, y: 700 }), deplacement: 0.9 },
    // « Des cris, des portes, des lampes » : toute la cage s'éveille
    { a: "t1b", ...plan([0.9, NIV.e5 + 1.4, -0.4], { azimut: 0, elevation: 4, distance: 19, fov: 48, y: 700, x: 540 }), deplacement: 1.0 },
    // « La police arrive. Escalier vide. » : le bas de la cage, gyrophare
    { a: "police", ...plan([0.9, NIV.e4 + 1.4, -0.4], { azimut: 4, elevation: 10, distance: 8.5, fov: 42, y: 700, x: 540 }), deplacement: 1.0 },
    // Morel et Inès au 7e
    { a: "m_heure", ...cadrage.deux(INES7B, MOREL7, 4, { x: 520, y: 740 }), coupe: true },
    { a: "i_aussi", ...cadrage.deux(INES7B, MOREL7, -6, { distance: 5.4, x: 500, y: 740 }), deplacement: 0.6 },
    // SALON — minuit
    { a: "conseil", ...plan(s(0, 1.0, -0.6), { azimut: 6, elevation: 26, distance: 6.4, fov: 42, y: 700, x: 540 }), coupe: true },
    { a: "conseil2", ...plan(s(0, 0.9, -0.7), { azimut: 4, elevation: 14, distance: 6.6, fov: 46, y: 680, x: 540 }), deplacement: 1.6 },
    { a: "t2", ...objet([CARNET[0] - 0.1, CARNET[1], CARNET[2] - 0.05], 4, { distance: 0.62 }), deplacement: 0.9 },
    { a: "t2a", ...plan(s(0, 0.9, -0.4), { azimut: -6, elevation: 16, distance: 6.2, fov: 46, y: 660, x: 540 }), deplacement: 0.9 },
    { a: "m_fragile", ...cadrage.moyen(PL.morel, -40), deplacement: 0.8 },
    { a: "i_70", ...cadrage.deux(PL.ines, PL.morel, -14, { x: 560 }), deplacement: 0.7 },
    { a: "t3", ...objet(BOITES, -20, { distance: 1.0 }), deplacement: 0.8 },
    { a: "t3a", ...plan(s(0.75, 0.8, -0.3), { azimut: 8, elevation: 12, distance: 5.2, fov: 46, y: 660, x: 520 }), deplacement: 0.8 },
    { a: "m_coeur", ...cadrage.moyen(PL.morel, -30), deplacement: 0.7 },
    { a: "t3b", ...cadrage.deux(PL.ines, PL.dame, -6, { x: 540 }), deplacement: 0.8 },
    { a: "t3c", ...objet(PAIRE_BOITES, -10, { distance: 1.2, y: 640 }), deplacement: 0.7 },
    { a: "t3d", ...cadrage.pied(PL.pere, 40, { distance: 4.4, x: 600 }), coupe: true },
    { a: "t3d:semaines", ...cadrage.moyen(PL.pere, 34, { x: 600 }), deplacement: 0.9 },
    { a: "liste", ...objet([CARNET[0] + 0.1, CARNET[1], CARNET[2]], 4, { distance: 0.7 }), coupe: true },
    { a: "liste2", ...objet([CARNET[0] + 0.1, CARNET[1], CARNET[2] + 0.02], 8, { distance: 0.6 }), deplacement: 0.8 },
    { a: "laisse", ...plan([CARNET[0], H_TABLE, CARNET[2]], { azimut: 10, elevation: 26, distance: 4.8, fov: 44, y: 760, x: 520 }), deplacement: 1.2 },
    // CAGE — elle redescend au 6e
    { a: "calme", ...plan([1.4, NIV.e6 + 1.6, -0.4], { azimut: 4, elevation: 8, distance: 6.5, fov: 42, y: 660, x: 520 }), coupe: true },
    // ENTRÉE — vue de l'intérieur, au ras du sol : la porte s'ouvre, le papier
    { a: "porte", ...plan([-0.7, NIV.e6 + 0.45, -1.8], { azimut: 162, elevation: 12, distance: 3.2, fov: 56, y: 760, x: 540 }), coupe: true },
    { a: "mot", ...plan(PAPIER, { azimut: 180, elevation: 62, distance: 0.75, fov: 34, y: 640, x: 540 }), coupe: true },
    // flash : la serrure, jamais forcée (vue du palier)
    { a: "rappel", ...plan(P.verrouInes, { azimut: 14, elevation: 6, distance: 1.3, fov: 34, y: 620, x: 520 }), coupe: true },
    { a: "rappel2", ...cadrage.moyen(DEDANS6, 14, { distance: 2.5, fov: 52, x: 520, y: 720 }), coupe: true },
    { a: "papier+0.3", ...plan(PAPIER_MAIN, { azimut: 18, elevation: 6, distance: 0.75, fov: 38, y: 620, x: 520 }), deplacement: 0.45 },
    // SALON — la page arrachée du carnet ; puis les visages, un par un
    { a: "papier2", ...objet(CARNET, 4, { distance: 0.8 }), coupe: true },
    // « Il était à la réunion. » (0,6 s de silence avant) : les visages un par un, jusqu'au voisin aux gants
    { a: "fin:il-0.55", ...cadrage.gros(PL.morel, -25, { distance: 2.6, fov: 38 }), coupe: true },
    { a: "fin:il+0.25", ...cadrage.moyen(PL.dame, -20), deplacement: 0.4 },
    { a: "fin:il+0.75", ...cadrage.moyen(PL.voisin4, -32, { x: 520 }), deplacement: 0.4 }, // ses mains gantées à l'image
  ],
  hud: [
    {
      type: "montre",
      a: "fin+0.7",
      jour: 4,
      heure: "23:10",
      temperature: 9,
      changements: [
        { a: "police", heure: "23:40" },
        { a: "conseil", jour: 5, heure: "00:00" },
        { a: "calme", heure: "02:00", temperature: 8 },
      ],
    },
    { type: "etiquette", de: "hook2", a: "recap1-0.1", texte: "1", point: P.lampeToit, style: "danger" },
    { type: "etiquette", de: "hook2", a: "recap1-0.1", texte: "2", point: [BAS[0], BAS[1] + 1.05, BAS[2]], style: "danger" },
    { type: "fiche", de: "recap2", a: "recap3", icone: "eau", titre: "Ballon d'Inès", lignes: ["0 litre", "Revendu 20 € le bidon"], cote: "droite" },
    { type: "etiquette", de: "recap3", a: "recap4-0.1", texte: "Il a la clé", point: P.verrouInes, style: "danger" },
    { type: "etiquette", de: "recap4", a: "b1:eteint-0.9", texte: "Le complice", point: P.lampeToit, style: "danger" },
    { type: "inventaire", de: "b2", a: "stop", objets: [{ icone: "lampe", nom: "éteinte" }, { icone: "danger", nom: "personne ne sait" }], surligne: 1 },
    { type: "moodles", de: "i_cri", a: "t1b", moodles: [{ nom: "panique", niveau: 3 }] },
    { type: "tactique", de: "t1", a: "police", numero: 1, total: 3, titre: "Faites du bruit" },
    { type: "moodles", de: "t1c", a: "m_heure", moodles: [{ nom: "panique", niveau: 1 }] },
    { type: "tactique", de: "t2", a: "t3", numero: 2, total: 3, titre: "La liste des fragiles" },
    { type: "fiche", de: "t2b", a: "m_fragile", icone: "maison", titre: "Registre de la mairie", lignes: ["Personnes âgées, handicapées", "Inscription sur demande (CCAS)"], cote: "gauche" },
    { type: "tactique", de: "t3", a: "liste", numero: 3, total: 3, titre: "Les médicaments" },
    { type: "fiche", de: "t3d", a: "liste-0.1", icone: "trousse", titre: "Insuline entamée", lignes: ["≈ 4 semaines sans frigo", "Jamais congelée · voir la notice"], cote: "gauche" },
    { type: "etiquette", de: "laisse:liste", a: "calme-0.1", texte: "La liste", point: [CARNET[0], CARNET[1] + 0.02, CARNET[2]], style: "ressource" },
    { type: "carton", de: "fin+0.7", partie: 5, titre: "Qui est le complice ?", verifie: "26/10/2026", question: "Le complice est un voisin. Inès…", choix: ["Lit le mot devant tous", "Se tait et observe"] },
  ],
  sons: [
    // ---- transitions et moments forts ----
    { a: "hook2", id: "whoosh_big/deep", gain: -9 },
    { a: "hook2:au", id: "click/thock", gain: -7 },
    { a: "hook2:en", id: "click/thock", gain: -7 },
    { a: "recap1", id: "cut_hit/sub", gain: -10 },
    { a: "recap2", id: "cut_hit/sub", gain: -10 },
    { a: "recap3", id: "pro_impact/short", gain: -9 },
    { a: "recap4", id: "cut_hit/sub", gain: -9 },
    { a: "recap4:complice", id: "pro_impact/deep", gain: -6 },
    { a: "b1", id: "reverse_swell/dark", gain: -9 },
    { a: "b3", id: "pro_sub_drop/low", gain: -5 },
    // STOP : le bouton (et l'arrêt de la bande juste avant « Elle crie ») ; le rembobinage est synthétisé par mix.py
    { a: "stop", id: "click/thock", gain: -4 },
    { a: "stop", id: "cut_hit/punch", gain: -6 },
    { a: "crie-0.08", id: "click/thock", gain: -4 },
    { a: "i_cri", id: "pro_impact/deep", gain: -8 },
    { a: "t1", id: "pro_impact/short", gain: -9 },
    { a: "t1:bruit", id: "knock/wood", gain: -3 },
    { a: "t1:bruit+0.22", id: "knock/wood", gain: -3 },
    { a: "t1:bruit+0.44", id: "knock/wood", gain: -2 },
    { a: "t1b", id: "whoosh_big/swell", gain: -10 },
    { a: "t1b:portes", id: "toggle/latch", gain: -8 },
    { a: "t1b:portes+0.35", id: "toggle/latch", gain: -9 },
    { a: "t1b:lampes", id: "click/thock", gain: -9 },
    { a: "t1c", id: "downlifter/air_fall", gain: -9 },
    { a: "t1c:enfuient", id: "knock/wood", gain: -6, pitch: "C4" },
    { a: "police", id: "whoosh_big/deep", gain: -11 },
    { a: "m_heure", id: "cut_hit/sub", gain: -10 },
    // salon
    { a: "conseil", id: "cut_hit/sub", gain: -8 },
    { a: "conseil2", id: "whoosh_big/swell", gain: -12 },
    { a: "t2", id: "pro_impact/short", gain: -9 },
    { a: "t2", id: "swipe/cloth", gain: -10 },
    { a: "t2a:seul", id: "swish/soft", gain: -11 },
    { a: "t2a:malade", id: "swish/soft", gain: -11 },
    { a: "t2b", id: "tap/table", gain: -12 },
    { a: "t3", id: "pro_impact/short", gain: -9 },
    { a: "t3", id: "tap/table", gain: -9 },
    { a: "t3a", id: "reverse_swell/dark", gain: -9 },
    { a: "t3a:cachets", id: "tap/table", gain: -10 },
    { a: "t3b", id: "tap/table", gain: -8 },
    { a: "t3c", id: "whoosh_fast/heavy", gain: -13 },
    { a: "t3d", id: "click/thock", gain: -11 },
    { a: "liste", id: "swipe/cloth", gain: -10 },
    { a: "liste2:trousse", id: "tap/table", gain: -11 },
    { a: "laisse", id: "whoosh_big/swell", gain: -11 },
    // retour au 6e, le papier
    { a: "calme", id: "cut_hit/sub", gain: -9 },
    { a: "porte", id: "cut_hit/sub", gain: -9 },
    { a: "porte:porte", id: "toggle/latch", gain: -7 },
    { a: "porte:papier", id: "swish/soft", gain: -9 },
    { a: "mot", id: "pro_sub_drop/low", gain: -6 },
    { a: "mot.fin+0.2", id: "toggle/latch", gain: -8 }, // la porte se referme APRÈS le mot (« as. » restait sous la voix)
    { a: "rappel", id: "reverse_swell/dark", gain: -8 },
    { a: "rappel2:cle", id: "pro_impact/deep", gain: -7 },
    { a: "papier", id: "swipe/cloth", gain: -9 },
    { a: "papier2", id: "cut_hit/sub", gain: -7 },
    { a: "papier2:page", id: "pro_impact/short", gain: -7 },
    { a: "fin:il-0.55", id: "whoosh_big/thump_deep", gain: -8 },
    { a: "fin:il+0.25", id: "cut_hit/sub", gain: -11 },
    { a: "fin:il+0.75", id: "cut_hit/sub", gain: -10 },
    // carton à choix (leçon du 24/10)
    { a: "fin+0.7", id: "impact/deep", gain: -8 },
    { a: "fin+0.9", id: "whoosh_fast/heavy", gain: -9 },
    { a: "fin+1.23", id: "cut_hit/punch", gain: -6 },
    { a: "fin+1.4", id: "cut_hit/sub", gain: -5 },
  ],
  ambiances: [
    { type: "drone", de: 0, a: "fin+9.4", niveau: -1 },
    { type: "vent", de: 0, a: "conseil", niveau: -4, fondu: 1.5 },
    { type: "coeur", de: 0, a: "crie", niveau: -1, bpm: 104 },
    { type: "ville", de: "recap1", a: "recap2", niveau: 0, fondu: 0.6 },
    { type: "grincement", de: "t1b:portes", a: "t1b:portes+0.8", niveau: -5, fondu: 0.1 },
    { type: "vent", de: "calme", a: "fin+9.4", niveau: -5, fondu: 1.0 },
    { type: "grincement", de: "porte:porte", a: "porte:porte+0.7", niveau: -5, fondu: 0.1 },
    { type: "coeur", de: "mot", a: "fin+9.4", niveau: -1, bpm: 98 },
  ],
  sujets: [
    { de: 0, a: "hook:escalier-1.7", personnage: "ines-debut", hauteur: 1.1 },
    { de: "recap3", a: "recap4-0.1", point: P.verrouInes },
    { de: "b1:eteint", a: "stop", personnage: "fantome-tait", hauteur: 0.6 },
    { de: "crie", a: "t1-0.6", personnage: "ines", hauteur: 1.1 },
    { de: "m_heure", a: "conseil", personnage: "ines", hauteur: 1.1 },
    { de: "m_heure", a: "conseil", personnage: "morel", hauteur: 1.1 },
    { de: "conseil2", a: "t2-0.9", personnage: "ines-salon", hauteur: 1.1 },
    { de: "m_fragile", a: "i_70-0.7", personnage: "morel-salon", hauteur: 1.1 },
    { de: "i_70", a: "t3-0.8", personnage: "ines-salon", hauteur: 1.1 },
    { de: "m_coeur", a: "t3b-0.8", personnage: "morel-salon", hauteur: 1.1 },
    { de: "t3d", a: "liste-0.9", personnage: "pere-salon", hauteur: 1.1 },
    // gros plans d'objets (protégés des sous-titres ; non comptés dans la taille des personnages)
    { de: "t2", a: "t2a-0.9", point: [CARNET[0] - 0.1, CARNET[1], CARNET[2] - 0.05] },
    { de: "t3", a: "t3a-0.8", point: BOITES },
    { de: "t3c", a: "t3d", point: PAIRE_BOITES },
    { de: "liste", a: "laisse-1.2", point: [CARNET[0] + 0.1, CARNET[1], CARNET[2]] },
    { de: "laisse", a: "calme", point: CARNET },
    { de: "mot", a: "rappel", point: PAPIER },
    { de: "rappel", a: "rappel2", point: P.verrouInes },
    { de: "rappel2", a: "papier-0.5", personnage: "ines-entree", hauteur: 1.1 },
    { de: "papier+0.3", a: "papier2", point: PAPIER_MAIN },
    { de: "papier2", a: "fin:il-0.6", point: CARNET },
    { de: "fin:il-0.55", a: "fin:il-0.05", personnage: "morel-flash", hauteur: 1.1 },
    { de: "fin:il+0.75", a: "fin+0.7", personnage: "voisin4-flash", hauteur: 1.1 },
  ],
};

// Les gants du voisin du 4e, réutilisés pour la main au trousseau (Episode.tsx)
export const MAIN_TROUSSEAU: Vec3 = [-0.62, NIV.e6 + 1.0, -1.38];
