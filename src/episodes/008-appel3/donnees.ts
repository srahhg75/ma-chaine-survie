import { OptionsPlan, plan } from "../../systeme/camera";
import { DonneesEpisode } from "../../systeme/episode";
import { Vec3 } from "../../systeme/maths";
import { Apparence } from "../../systeme/personnage/apparence";
import { LEA, NATHAN } from "../006-appel/personnages";

/*
 * « Le dernier appel » — Partie 3 « En face » (choix B de la partie 2 : il appelle la police). Script :
 * videos/008-appel3/script.txt. Même salon (3e, en coupe), 7 h 30, matin gris ; la porte d'entrée a désormais son
 * battant et son verrou (double tour). À l'ouest, par un passage, la chambre du couple : le lit sur pieds, et dessous,
 * dans le noir, Hugo et un téléphone dont l'écran rouge s'allume à la fin. En face : l'appartement vide du 3e (fenêtre
 * percée, pièce construite derrière), le trépied et le vieux téléphone (voyant rouge, flash) ; en bas, la voiture de
 * police (gyrophare rouge), deux policiers et leurs lampes. Les rideaux, ouverts, se ferment à « ferme ».
 */
export const FENETRE = { x: 0.3, largeur: 2.6, bas: 0.6, haut: 2.3, z: -2.3 };
export const FENETRE_FACE: Vec3 = [2.1, 1.55, -10.9]; // la fenêtre sans rideaux, au 3e d'en face
export const TREPIED: Vec3 = [2.1, 1.45, -11.95]; // le vieux téléphone sur son trépied (hauteur de l'appareil)
export const VOITURE: Vec3 = [0.2, -6.5, -8.3]; // la voiture de police, garée devant l'immeuble d'en face
export const ENTREE_FACE: Vec3 = [1.0, -6.5, -10.95]; // la porte de l'immeuble d'en face
export const PORTE = { x: 3.0, z: -0.9, largeur: 0.95 }; // porte d'entrée (mur est)
export const VERROU: Vec3 = [2.92, 1.12, -0.55];
export const LAMPE: Vec3 = [-2.55, 0, -1.85];
export const PLACARD: Vec3 = [-2.66, 0, -0.75];
export const PORTEMANTEAU: Vec3 = [2.72, 0, 0.75];
export const PASSAGE_Z = 0.85; // passage salon -> chambre (mur ouest)
export const LIT: Vec3 = [-6.2, 0, 0.1]; // tête contre le mur ouest de la chambre
export const SOUS_LIT: Vec3 = [-5.5, 0.13, 0.55]; // le visage d'Hugo sous le lit, éclairé en rouge par son téléphone

const N_VITRE = [0.75, 0, -1.85] as Vec3; // au téléphone devant la fenêtre
const N_PORTE = [2.45, 0, -0.2] as Vec3; // devant la porte, le verrou à portée de main
const N_CENTRE = [1.2, 0, -0.7] as Vec3;
const N_FEN = [1.15, 0, -1.85] as Vec3; // à la fenêtre, avec Léa, regardent en face
const L_FEN = [0.45, 0, -1.85] as Vec3;
const L_ASSIS = [-1.1, 0, -1.05] as Vec3;
const N_ASSIS = [-0.45, 0, -1.05] as Vec3;
const CANAPE_MILIEU = [-0.78, 0, -1.05] as Vec3;
const FENETRES_MILIEU = [0.8, 0, -1.85] as Vec3;

// Cadrages pour des personnages « adulte » (≈ 1,75 m), comme les parties 1 et 2
const pied = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 0.9, p[2]], { azimut: az, elevation: 6, distance: 6.2, fov: 46, y: 700, ...o });
const moyen = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 1.2, p[2]], { azimut: az, elevation: 4, fov: 42, y: 600, x: 640, ...o, distance: (o.distance ?? 5.6) * 1.7 });
const assis = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 0.8, p[2]], { azimut: az, elevation: 6, fov: 42, y: 660, x: 640, ...o, distance: (o.distance ?? 5.6) * 1.3 });
const objet = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan(p, { azimut: az, elevation: 20, distance: 1.3, fov: 34, y: 560, ...o });
const deux = (a: Vec3, b: Vec3, az: number, o: Partial<OptionsPlan> = {}) =>
  plan([(a[0] + b[0]) / 2, 1.0, (a[2] + b[2]) / 2], { azimut: az, elevation: 6, distance: 6.4, fov: 46, y: 680, x: 540, ...o });
// depuis la rue, de l'autre côté de la vitre : les deux visages derrière la fenêtre (azimut 180 = depuis le nord)
const dehors = (p: Vec3, o: Partial<OptionsPlan> = {}) => plan([p[0], 1.45, p[2]], { azimut: 180, elevation: 3, distance: 5.4, fov: 40, y: 620, x: 540, ...o });

const MOI = "06 •• •• •• 27";
const POLICIER: Partial<Apparence> = {
  femme: false, age: 0.3, peau: "#e2b896", cheveux: "#1a1412", coiffure: "court", haut: "parka", couleurHaut: "#1c2230",
  pantalon: "#1a1d24", chaussures: "bottines", couleurChaussures: "#111114", bonnet: "#15171c",
};

export const donnees: DonneesEpisode = {
  id: "008-appel3",
  titre: "Le dernier appel — Partie 3 : En face",
  queue: 8.4, // le narrateur lit le choix A/B sur le carton (@carton1-4)
  post: { bloom: 0.35, seuilBloom: 0.85, vignette: 0.55, grain: 0.04, exposition: 1.15, noirRouge: 1 },
  decor: {
    pieces: [
      {
        id: "salon",
        centre: [0, 0],
        largeur: 6,
        profondeur: 4.6,
        hauteur: 2.7,
        sol: "parquet",
        murs: "peint",
        couleurMurs: "#b7b0a4",
        couleurSol: "#6b5a4a",
        devant: ["sud"],
        ouvertures: [
          { mur: "nord", type: "fenetre", centre: FENETRE.x, largeur: FENETRE.largeur, hauteur: FENETRE.haut - FENETRE.bas, bas: FENETRE.bas },
          { mur: "est", type: "porte", centre: -PORTE.z, largeur: PORTE.largeur, hauteur: 2.1 },
          { mur: "ouest", type: "passage", centre: -PASSAGE_Z, largeur: 1.0, hauteur: 2.1 },
        ],
      },
      {
        id: "palier",
        centre: [3.9, -0.9],
        largeur: 1.8,
        profondeur: 2.0,
        sol: "beton",
        murs: "beton",
        couleurSol: "#5a5650",
        couleurMurs: "#6a645b",
        devant: ["sud"],
        sansMurs: ["ouest"],
      },
      {
        // la chambre, derrière le passage ouest (mur est partagé : dessiné par le salon)
        id: "chambre",
        centre: [-5.2, 0],
        largeur: 4.4,
        profondeur: 4.6,
        hauteur: 2.7,
        sol: "parquet",
        murs: "peint",
        couleurMurs: "#9a948a",
        couleurSol: "#5a4a3c",
        devant: ["sud"],
        sansMurs: ["est"],
      },
    ],
    meubles: [
      { type: "canape", position: [-0.9, 0, -1.55], couleur: "#4a4a4e", id: "canape" },
      { type: "table", position: [-0.9, 0, -0.35], echelle: 0.55, couleur: "#3a2e24", id: "table-basse" },
      { type: "tapis", position: [-0.9, 0, -0.6], couleur: "#5a5a5e", echelle: 1.2 },
      { type: "carton", position: [1.95, 0, -1.95], id: "carton1" },
      { type: "carton", position: [2.45, 0, -1.6], rotation: 20, id: "carton2" },
      { type: "tapis", position: [-5.3, 0, 1.3], couleur: "#4a4a4e", echelle: 0.9 },
      // dessinés dans Episode.tsx : placard (fermé), lampe, portemanteau, lit sur pieds, table de nuit
      { type: "placard", position: PLACARD, rotation: 90, id: "placard", invisible: true },
      { type: "chaise", position: LAMPE, echelle: 0.6, id: "lampe", invisible: true },
      { type: "chaise", position: PORTEMANTEAU, echelle: 0.7, id: "portemanteau", invisible: true },
      { type: "lit", position: LIT, rotation: 90, id: "lit", invisible: true },
      { type: "chaise", position: [-6.9, 0, -1.0], echelle: 0.9, id: "chevet", invisible: true },
    ],
    exterieur: { ville: { allumees: 0.02, distance: 30 }, neige: false, ciel: "nuit" },
  },
  personnages: [
    {
      // 7 h 30 : au téléphone avec le 17 devant la fenêtre, puis le verrou, puis la fenêtre avec Léa, puis le canapé
      id: "nathan",
      voix: "Nathan",
      variante: "adulte",
      apparence: NATHAN,
      depart: { position: N_VITRE, orientation: 20 },
      trajet: [
        { a: "verrou:double", position: N_PORTE, orientation: 80, vitesse: 1.0, chemin: [[1.5, 0, -0.9]] },
        { a: "n_non-0.2", position: N_CENTRE, orientation: 340, vitesse: 1.1 },
        { a: "giro+1.8", position: N_FEN, orientation: 180, vitesse: 0.9 },
        { a: "l_bien+0.4", position: N_ASSIS, orientation: 8, vitesse: 1.0, chemin: [[0.9, 0, -0.75], [-0.45, 0, -0.75]] },
      ],
      poses: [
        { a: 0, pose: "telephone" },
        { a: "consigne+1.4", pose: "debout", transition: 0.4 },
        { a: "verrou", pose: "mainTendue", transition: 0.3 },
        { a: "l_rideaux", pose: "debout", transition: 0.4 },
        { a: "vibre+0.2", pose: "mainTendue", transition: 0.3 },
        { a: "giro", pose: "debout", transition: 0.4 },
        { a: "rappel+0.2", pose: "telephone", transition: 0.3 },
        { a: "repartent", pose: "debout", transition: 0.4 },
        { a: "ferme", pose: "mainTendue", transition: 0.3 },
        { a: "ferme+1.3", pose: "debout", transition: 0.4 },
        { a: "l_bien+0.4", pose: "assis", transition: 0.5 },
        { a: "pas", pose: "assisMain", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "inquiet" },
        { a: "n_photo", expression: "decide" },
        { a: "verrou", expression: "inquiet" },
        { a: "n_non", expression: "colere", transition: 0.2 },
        { a: "sms", expression: "peur" },
        { a: "n_lit", expression: "colere" },
        { a: "giro", expression: "inquiet" },
        { a: "vide", expression: "surpris" },
        { a: "seul", expression: "peur" },
        { a: "souffle", expression: "fatigue" },
        { a: "l_bien", expression: "sourire" },
        { a: "vibre2", expression: "surpris", transition: 0.2 },
        { a: "pas", expression: "peur" },
      ],
    },
    {
      // Léa sur le canapé, rejoint Nathan à la fenêtre au gyrophare, revient s'asseoir quand les rideaux se ferment
      id: "lea",
      voix: "Léa",
      variante: "adulte",
      apparence: LEA,
      depart: { position: L_ASSIS, orientation: 10 },
      trajet: [
        { a: "giro+2.6", position: L_FEN, orientation: 180, vitesse: 1.0, chemin: [[-1.1, 0, -0.75], [0.45, 0, -0.75]] },
        { a: "souffle+1.4", position: L_ASSIS, orientation: 14, vitesse: 1.0, chemin: [[0.45, 0, -0.75], [-1.1, 0, -0.75]] },
      ],
      poses: [
        { a: 0, pose: "assisTriste" },
        { a: "l_rideaux", pose: "assis", transition: 0.4 },
        { a: "giro-0.4", pose: "debout", transition: 0.5 },
        { a: "l_ou", pose: "bras", transition: 0.4 },
        { a: "repartent", pose: "debout", transition: 0.4 },
        { a: "souffle+1.4", pose: "assis", transition: 0.5 },
      ],
      expressions: [
        { a: 0, expression: "peur" },
        { a: "l_rideaux", expression: "peur" },
        { a: "l_entend", expression: "peur", transition: 0.2 },
        { a: "giro", expression: "inquiet" },
        { a: "vide", expression: "surpris" },
        { a: "l_ou", expression: "peur" },
        { a: "souffle", expression: "soulage" },
        { a: "l_bien", expression: "sourire" },
        { a: "vibre2", expression: "surpris", transition: 0.2 },
        { a: "pas", expression: "peur" },
      ],
    },
    {
      // deux policiers, de la voiture à la porte de l'immeuble d'en face (lampes allumées)
      id: "policier1",
      voix: "policier1",
      variante: "adulte",
      apparence: POLICIER,
      presence: { de: "entrent-0.3", a: "torche" },
      depart: { position: [VOITURE[0] + 0.9, VOITURE[1], VOITURE[2] - 0.6], orientation: 175 },
      trajet: [{ a: "torche-0.2", position: [ENTREE_FACE[0] - 0.15, ENTREE_FACE[1], ENTREE_FACE[2] + 0.35], orientation: 180, vitesse: 1.3 }],
      poses: [{ a: 0, pose: "debout" }],
      lampe: { de: "entrent-0.3", puissance: 0.25 },
    },
    {
      id: "policier2",
      voix: "policier2",
      variante: "adulte",
      apparence: { ...POLICIER, peau: "#c99a78", age: 0.2 },
      presence: { de: "entrent-0.3", a: "torche" },
      depart: { position: [VOITURE[0] + 1.6, VOITURE[1], VOITURE[2] - 0.1], orientation: 190 },
      trajet: [{ a: "torche-0.4", position: [ENTREE_FACE[0] + 0.35, ENTREE_FACE[1], ENTREE_FACE[2] + 0.5], orientation: 180, vitesse: 1.3 }],
      poses: [{ a: 0, pose: "debout" }],
      lampe: { de: "entrent-0.3", puissance: 0.25 },
    },
  ],
  camera: [
    // HOOK — Nathan au téléphone avec le 17, devant la fenêtre ; Léa sur le canapé
    { a: 0, ...moyen(N_VITRE, 22, { distance: 4.6, y: 580 }) },
    { a: "hook2", ...moyen(N_VITRE, 16, { distance: 4.0, y: 570 }), deplacement: 0.9 },
    { a: "rec1", ...deux(N_VITRE, L_ASSIS, 2, { distance: 7.6, x: 520 }), coupe: true },
    { a: "rec1:appelle", ...deux(N_VITRE, L_ASSIS, -2, { distance: 7.1, x: 520 }), deplacement: 0.8 },
    // rappel : la photo reçue en partie 2, sur l'écran de Léa ; puis la fenêtre d'en face
    { a: "rec2", ...assis(L_ASSIS, 12, { distance: 4.4, y: 620 }), coupe: true },
    { a: "rec3", ...plan(FENETRE_FACE, { azimut: 0, elevation: 2, distance: 6.5, fov: 46, y: 600, x: 540 }), coupe: true },
    { a: "rec3:face", ...plan(FENETRE_FACE, { azimut: 0, elevation: 2, distance: 6.5, fov: 32, y: 600, x: 540 }), deplacement: 0.8 },
    // l'appel
    { a: "appel", ...moyen(N_VITRE, 26, { distance: 4.4, y: 570 }), coupe: true },
    { a: "n_photo", ...moyen(N_VITRE, 18, { distance: 3.9, y: 560 }), deplacement: 0.8 },
    { a: "n_3e", ...plan(FENETRE_FACE, { azimut: 2, elevation: 2, distance: 6.5, fov: 22, y: 600, x: 540 }), coupe: true },
    // la consigne : il traverse le salon jusqu'à la porte ; le verrou, double tour
    { a: "consigne", ...pied([1.7, 0, -0.9], 4, { distance: 7.0, y: 720, x: 540 }), coupe: true },
    { a: "verrou", ...objet(VERROU, -125, { distance: 1.3, elevation: 15, y: 600 }), coupe: true },
    // Léa veut fermer les rideaux, Nathan refuse
    { a: "l_rideaux", ...assis(L_ASSIS, -10, { distance: 4.2, y: 640, x: 600 }), coupe: true },
    { a: "n_non", ...moyen(N_CENTRE, 14, { distance: 4.2, y: 570 }), coupe: true },
    { a: "vibre", ...moyen(N_CENTRE, 8, { distance: 3.8, y: 560 }), deplacement: 0.8 },
    { a: "sms", ...moyen(N_CENTRE, 4, { distance: 3.6, y: 560 }), deplacement: 0.8 },
    { a: "l_entend", ...assis(L_ASSIS, -4, { distance: 4.0, y: 630, x: 600 }), coupe: true },
    { a: "n_lit", ...moyen(N_CENTRE, 22, { distance: 3.9, y: 560 }), coupe: true },
    // 7 h 39 : la voiture de police en bas, les deux policiers entrent en face, la lampe au 3e
    { a: "giro", ...plan([VOITURE[0] + 0.4, VOITURE[1] + 1.2, VOITURE[2] - 1.0], { azimut: 72, elevation: 12, distance: 10.0, fov: 40, y: 780, x: 600 }), coupe: true },
    { a: "entrent", ...plan([ENTREE_FACE[0], ENTREE_FACE[1] + 1.0, ENTREE_FACE[2] + 1.4], { azimut: 4, elevation: 16, distance: 8.6, fov: 42, y: 700, x: 540 }), coupe: true },
    { a: "torche", ...plan(FENETRE_FACE, { azimut: 0, elevation: 2, distance: 5.2, fov: 40, y: 600, x: 540 }), coupe: true },
    // l'attente, vus de dehors à travers la vitre
    { a: "attente", ...dehors(FENETRES_MILIEU, { distance: 5.8 }), coupe: true },
    { a: "n_alors", ...dehors(N_FEN, { distance: 4.8, x: 700 }), deplacement: 0.9 },
    { a: "rappel", ...dehors(N_FEN, { distance: 4.4, x: 700 }), deplacement: 0.8 },
    // l'appartement d'en face : vide, le trépied, le vieux téléphone
    { a: "vide", ...plan(FENETRE_FACE, { azimut: 2, elevation: 0, distance: 3.6, fov: 40, y: 600, x: 540 }), coupe: true },
    { a: "trepied", ...plan(TREPIED, { azimut: 0, elevation: 4, distance: 1.9, fov: 34, y: 600, x: 540 }), coupe: true },
    { a: "auto", ...plan(TREPIED, { azimut: 3, elevation: 4, distance: 1.35, fov: 34, y: 600, x: 540 }), deplacement: 0.9 },
    { a: "seul", ...plan(TREPIED, { azimut: 5, elevation: 4, distance: 1.15, fov: 34, y: 600, x: 540 }), deplacement: 0.4 },
    { a: "l_ou", ...dehors(L_FEN, { distance: 4.4, x: 520 }), coupe: true },
    { a: "repartent", ...plan([VOITURE[0] + 0.4, VOITURE[1] + 1.2, VOITURE[2] - 1.0], { azimut: 66, elevation: 12, distance: 10.0, fov: 40, y: 780, x: 600 }), coupe: true },
    // les rideaux se ferment ; le canapé, enfin calme
    { a: "ferme", ...deux(L_FEN, N_FEN, -20, { distance: 6.4, y: 700 }), coupe: true },
    { a: "souffle", ...deux(L_ASSIS, N_ASSIS, 0, { distance: 6.8, y: 700 }), coupe: true },
    { a: "l_bien", ...assis(L_ASSIS, -10, { distance: 4.2, y: 640, x: 580 }), coupe: true },
    { a: "n_sympa", ...assis(N_ASSIS, 10, { distance: 4.2, y: 640, x: 620 }), coupe: true },
    // un téléphone vibre : ni le sien, ni celui de Léa ; la chambre ; sous le lit
    { a: "vibre2", ...assis(CANAPE_MILIEU, 0, { distance: 5.6, y: 690, x: 540 }), coupe: true },
    { a: "pas", ...assis(CANAPE_MILIEU, 4, { distance: 4.6, y: 680, x: 540 }), deplacement: 0.6 },
    { a: "chambre", ...plan([-5.6, 0.7, 0.4], { azimut: 12, elevation: 8, distance: 6.6, fov: 46, y: 700, x: 540 }), coupe: true },
    { a: "lit", ...plan(SOUS_LIT, { azimut: 0, elevation: 4, distance: 1.35, fov: 40, y: 700, x: 540 }), coupe: true },
    { a: "fin:face", ...plan(SOUS_LIT, { azimut: 2, elevation: 3, distance: 0.95, fov: 40, y: 700, x: 540 }), deplacement: 1.0 },
  ],
  hud: [
    { type: "telephone", de: 0, a: "rec1-0.05", ecran: "appel", contact: "POLICE SECOURS", numero: "17", heure: "07:30", enCours: true },
    { type: "telephone", de: "rec2", a: "rec3-0.05", ecran: "sms", contact: MOI, heure: "07:21", messages: [{ a: "rec2", texte: "Bonjour, Léa.", photo: true, menace: true }] },
    { type: "telephone", de: "appel", a: "n_3e-0.05", ecran: "appel", contact: "POLICE SECOURS", numero: "17", heure: "07:31", enCours: true },
    { type: "telephone", de: "vibre+0.2", a: "l_entend-0.05", ecran: "sms", contact: MOI, heure: "07:33", messages: [{ a: "sms", texte: "La police ? Tu me déçois, Nathan.", menace: true }] },
    { type: "telephone", de: "rappel-0.2", a: "vide+0.2", ecran: "appel", contact: "POLICE", numero: "Commissariat", heure: "07:44" },
    { type: "carton", de: "fin+0.7", partie: 4, titre: "Le dernier appel", verifie: "", question: "Il est sous le lit. Nathan…", choix: ["Fuit avec Léa", "Soulève la couette"] },
  ],
  sons: [
    // hook : l'appel en cours
    { a: "hook", id: "pro_impact/short", gain: -9 },
    { a: "hook:minutes", id: "pro_sub_drop/low", gain: -8 },
    { a: "hook2", id: "cut_hit/sub", gain: -10 },
    { a: "hook2:police", id: "pro_impact/deep", gain: -8 },
    { a: "rec1", id: "cut_hit/punch", gain: -9 },
    { a: "rec1:17", id: "tap/table", gain: -10 },
    { a: "rec2", id: "cut_hit/sub", gain: -10 },
    { a: "rec2:harcele", id: "pro_impact/deep", gain: -8 },
    { a: "rec3", id: "cut_hit/punch", gain: -9 },
    { a: "rec3:face", id: "pro_sub_drop/low", gain: -7 },
    // l'appel
    { a: "appel", id: "cut_hit/sub", gain: -11 },
    { a: "appel:calme", id: "swish/soft", gain: -13 },
    { a: "n_photo", id: "swipe/cloth", gain: -11 },
    { a: "n_3e", id: "cut_hit/punch", gain: -9 },
    { a: "n_3e:rideaux", id: "pro_impact/short", gain: -9 },
    // la porte : double tour
    { a: "consigne", id: "cut_hit/sub", gain: -10 },
    { a: "consigne:sortir", id: "swipe/cloth", gain: -11 },
    { a: "verrou", id: "cut_hit/punch", gain: -10 },
    { a: "verrou:double", id: "toggle/latch", gain: -6 },
    { a: "verrou:tour", id: "toggle/latch", gain: -6 },
    { a: "verrou:tour+0.25", id: "click/thock", gain: -8 },
    // les rideaux, le SMS
    { a: "l_rideaux", id: "cut_hit/sub", gain: -11 },
    { a: "n_non", id: "cut_hit/sub", gain: -11 },
    { a: "n_non:partir", id: "pro_impact/short", gain: -10 },
    { a: "vibre:vibre", id: "tap/table", gain: -7 },
    { a: "vibre:vibre+0.12", id: "tap/table", gain: -8 },
    { a: "vibre:vibre+0.24", id: "tap/table", gain: -7 },
    { a: "vibre:numero", id: "pro_sub_drop/low", gain: -7 },
    { a: "sms:decois", id: "pro_impact/deep", gain: -6 },
    { a: "l_entend", id: "cut_hit/punch", gain: -13 },
    
    { a: "n_lit", id: "cut_hit/sub", gain: -10 },
    { a: "n_lit:telephone", id: "pro_impact/short", gain: -9 },
    // la police
    { a: "giro", id: "cut_hit/punch", gain: -8 },
    { a: "giro:gyrophare", id: "whoosh_big/deep", gain: -10 },
    { a: "entrent:policiers", id: "knock/wood", gain: -12 },
    { a: "entrent:face", id: "toggle/latch", gain: -10 },
    { a: "torche", id: "cut_hit/sub", gain: -10 },
    { a: "torche:lampe", id: "fit/snap/switch_flip", gain: -9 },
    { a: "torche:balaie", id: "swish/soft", gain: -12 },
    { a: "attente", id: "cut_hit/sub", gain: -11 },
    { a: "attente:minute", id: "knock/desk", gain: -13 },
    { a: "attente:deux", id: "knock/desk", gain: -12 },
    { a: "attente:trois", id: "knock/desk", gain: -11 },
    { a: "n_alors", id: "swish/soft", gain: -13 },
    { a: "rappel", id: "tap/table", gain: -8 },
    { a: "rappel+0.12", id: "tap/table", gain: -9 },
    // l'appartement vide
    { a: "vide", id: "cut_hit/punch", gain: -8 },
    { a: "vide:vide", id: "pro_sub_drop/low", gain: -6 },
    { a: "trepied", id: "cut_hit/sub", gain: -9 },
    { a: "trepied:trepied", id: "pro_impact/deep", gain: -7 },
    { a: "trepied:telephone", id: "pro_impact/short", gain: -8 },
    { a: "auto:photo", id: "click/thock", gain: -7 },
    { a: "auto:minutes", id: "click/thock", gain: -8 },
    { a: "seul", id: "pro_sub_drop/low", gain: -5 },
    { a: "l_ou-0.1", id: "cut_hit/punch", gain: -14 },
    { a: "repartent", id: "cut_hit/sub", gain: -10 },
    { a: "repartent:repartent", id: "whoosh_big/swell", gain: -11 },
    // les rideaux, le calme
    { a: "ferme", id: "cut_hit/sub", gain: -11 },
    { a: "ferme:rideaux", id: "swipe/cloth", gain: -7 },
    { a: "ferme:rideaux+0.3", id: "swipe/cloth", gain: -8 },
    { a: "souffle", id: "whoosh_big/swell", gain: -13 },
    { a: "souffle+1.4", id: "swipe/cloth", gain: -11 },
    { a: "l_bien", id: "cut_hit/sub", gain: -12 },
    { a: "n_sympa", id: "cut_hit/sub", gain: -12 },
    { a: "l_bien+0.5", id: "swipe/cloth", gain: -11 },
    // le téléphone sous le lit
    { a: "vibre2", id: "cut_hit/punch", gain: -7 },
    { a: "vibre2:vibre", id: "knock/wood", gain: -8 },
    { a: "vibre2:vibre+0.12", id: "knock/wood", gain: -9 },
    { a: "vibre2:vibre+0.24", id: "knock/wood", gain: -8 },
    { a: "pas-0.3", id: "cut_hit/sub", gain: -8 }, // coupe sans son repérée par earshot sur la vidéo finale (66,0 s)
    { a: "pas:sien", id: "pro_impact/short", gain: -9 },
    { a: "pas:lea", id: "pro_impact/short", gain: -8 },
    { a: "chambre", id: "cut_hit/punch", gain: -7 },
    { a: "chambre:chambre", id: "knock/wood", gain: -9 },
    { a: "chambre:chambre+0.12", id: "knock/wood", gain: -10 },
    { a: "lit", id: "pro_sub_drop/low", gain: -5 },
    { a: "lit:lit", id: "pro_impact/deep", gain: -5 },
    { a: "fin:hugo", id: "whoosh_big/deep", gain: -9 },
    { a: "fin:face", id: "pro_sub_drop/low", gain: -4 },
    // carton à choix
    { a: "fin+0.7", id: "impact/deep", gain: -8 },
    { a: "fin+0.9", id: "whoosh_fast/heavy", gain: -12 },
    { a: "fin+1.23", id: "cut_hit/punch", gain: -10 },
    { a: "fin+1.4", id: "cut_hit/sub", gain: -9 },
  ],
  ambiances: [
    { type: "drone", de: 0, a: "fin+8.4", niveau: -1 },
    { type: "ville", de: 0, a: "ferme+0.6", niveau: -9, fondu: 1.5 },
    { type: "ville", de: "ferme+0.6", a: "fin+8.4", niveau: -15, fondu: 1.0 },
    { type: "coeur", de: "sms", a: "giro", niveau: -5, bpm: 100 },
    { type: "coeur", de: "vibre2", a: "fin+8.4", niveau: -1, bpm: 116 },
  ],
  sujets: [
    { de: 0, a: "rec1", personnage: "nathan", hauteur: 1.4 },
    { de: "rec1", a: "rec2", personnage: "lea", hauteur: 1.0 },
    { de: "rec2", a: "rec3", personnage: "lea", hauteur: 1.0 },
    { de: "rec3", a: "appel", point: FENETRE_FACE },
    { de: "appel", a: "n_3e", personnage: "nathan", hauteur: 1.4 },
    { de: "n_3e", a: "consigne", point: FENETRE_FACE },
    { de: "verrou", a: "l_rideaux", point: VERROU },
    { de: "l_rideaux", a: "n_non", personnage: "lea", hauteur: 1.0 },
    { de: "n_non", a: "l_entend", personnage: "nathan", hauteur: 1.4 },
    { de: "l_entend", a: "n_lit", personnage: "lea", hauteur: 1.0 },
    { de: "n_lit", a: "giro", personnage: "nathan", hauteur: 1.4 },
    { de: "giro", a: "entrent", point: [VOITURE[0], VOITURE[1] + 0.8, VOITURE[2]] },
    { de: "torche", a: "attente", point: FENETRE_FACE },
    { de: "attente", a: "vide", personnage: "nathan", hauteur: 1.4 },
    { de: "vide", a: "trepied", point: FENETRE_FACE },
    { de: "trepied", a: "l_ou", point: TREPIED },
    { de: "l_ou", a: "repartent", personnage: "lea", hauteur: 1.4 },
    { de: "l_bien", a: "n_sympa", personnage: "lea", hauteur: 1.0 },
    { de: "n_sympa", a: "vibre2", personnage: "nathan", hauteur: 1.0 },
    { de: "vibre2", a: "chambre", personnage: "lea", hauteur: 1.0 },
    { de: "lit", a: "fin", point: SOUS_LIT },
  ],
};
