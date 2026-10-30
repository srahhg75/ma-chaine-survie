import { OptionsPlan, plan } from "../../systeme/camera";
import { DonneesEpisode } from "../../systeme/episode";
import { Vec3 } from "../../systeme/maths";
import { LEA, NATHAN } from "../006-appel/personnages";

/*
 * « Le dernier appel » — Partie 2 « Mardi » (choix B de la partie 1 : il fouille). Script : videos/007-appel2/script.txt.
 * Même salon que la partie 1, au petit matin (lumière grise, rideaux ouverts). Contre le mur ouest : la commode de Léa
 * (tiroirs qui s'ouvrent) et le placard (portes coulissantes). Dans le placard, le vieux sac : le briquet rouge
 * gravé « H », l'enveloppe, les 12 photos étalées par terre (au dos de l'une : « TU ES À MOI » en rouge).
 * Léa rentre par la porte d'entrée (mur est), l'écharpe rouge au cou ; l'aveu sur le canapé ; la photo reçue depuis
 * son propre numéro ; contrechamp : la fenêtre d'en face qui s'allume en rouge ; fin : les rideaux ouverts derrière eux.
 */
export const COMMODE: Vec3 = [-2.66, 0, 0.75];
export const PLACARD: Vec3 = [-2.66, 0, -0.75];
export const SAC: Vec3 = [-2.02, 0, -0.08]; // tiré du placard, posé par terre devant lui
export const BRIQUET: Vec3 = [-1.98, 0.21, -0.02]; // posé sur le sac ouvert
export const PHOTOS: Vec3 = [-1.6, 0.005, 0.16]; // étalées par terre, à côté du sac
export const PORTEMANTEAU: Vec3 = [2.72, 0, 0.75];
export const FENETRE_ROUGE: Vec3 = [2.1, 1.55, -10.9];
export const FENETRE = { x: 0.3, largeur: 2.6, bas: 0.6, haut: 2.3, z: -2.3 };
export const LAMPE: Vec3 = [-2.55, 0, -1.85];

const N_COM = [-1.78, 0, 0.62] as Vec3; // devant la commode
const N_PLA = [-1.7, 0, -0.55] as Vec3; // accroupi devant le placard
const N_DIAL = [-0.75, 0, 0.35] as Vec3; // debout, face à Léa
const N_COTE = [-2.0, 0, -0.92] as Vec3; // debout au bout du canapé, il la laisse parler (jamais entre elle et la caméra)
const N_ASSIS = [-1.08, 0, -1.05] as Vec3; // sur le canapé, à côté d'elle
const L_PALIER = [3.85, 0, -0.9] as Vec3;
const L_DIAL = [0.85, 0, 0.2] as Vec3;
const L_ASSIS = [-0.5, 0, -1.05] as Vec3;
const CANAPE_MILIEU = [-0.92, 0, -1.05] as Vec3;

// Cadrages pour des personnages « adulte » (≈ 1,75 m), comme la partie 1
const pied = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 0.9, p[2]], { azimut: az, elevation: 6, distance: 6.2, fov: 46, y: 700, ...o });
const moyen = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 1.2, p[2]], { azimut: az, elevation: 4, fov: 42, y: 600, x: 640, ...o, distance: (o.distance ?? 5.6) * 1.7 });
// (distances × 1,3 : personnage médian ≤ 35 % de la hauteur)
const assis = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 0.8, p[2]], { azimut: az, elevation: 6, fov: 42, y: 660, x: 640, ...o, distance: (o.distance ?? 5.6) * 1.3 });
const accroupi = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 0.6, p[2]], { azimut: az, elevation: 8, distance: 5.4, fov: 42, y: 680, x: 620, ...o });
const objet = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan(p, { azimut: az, elevation: 45, distance: 1.3, fov: 34, y: 560, ...o });
const deux = (a: Vec3, b: Vec3, az: number, o: Partial<OptionsPlan> = {}) =>
  plan([(a[0] + b[0]) / 2, 1.0, (a[2] + b[2]) / 2], { azimut: az, elevation: 6, distance: 6.4, fov: 46, y: 680, x: 540, ...o });

const MOI = "06 •• •• •• 27";

export const donnees: DonneesEpisode = {
  id: "007-appel2",
  titre: "Le dernier appel — Partie 2 : Mardi",
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
          { mur: "est", type: "porte", centre: 0.9, largeur: 0.95, hauteur: 2.1 },
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
    ],
    meubles: [
      { type: "canape", position: [-0.9, 0, -1.55], couleur: "#4a4a4e", id: "canape" },
      { type: "table", position: [-0.9, 0, -0.35], echelle: 0.55, couleur: "#3a2e24", id: "table-basse" },
      { type: "tapis", position: [-0.9, 0, -0.6], couleur: "#5a5a5e", echelle: 1.2 },
      { type: "carton", position: [1.95, 0, -1.95], id: "carton1" },
      { type: "carton", position: [2.45, 0, -1.6], rotation: 20, id: "carton2" },
      // dessinés dans Episode.tsx : commode, placard (porte ouverte vers le nord), sac, lampe, portemanteau
      { type: "cuisiniere", position: [COMMODE[0], 0, COMMODE[2] - 0.3], rotation: 90, id: "commode-n", invisible: true },
      { type: "cuisiniere", position: [COMMODE[0], 0, COMMODE[2] + 0.3], rotation: 90, id: "commode-s", invisible: true },
      { type: "placard", position: PLACARD, rotation: 90, id: "placard", invisible: true },
      { type: "chaise", position: LAMPE, echelle: 0.6, id: "lampe", invisible: true },
      { type: "chaise", position: PORTEMANTEAU, echelle: 0.7, id: "portemanteau", invisible: true },
    ],
    exterieur: { ville: { allumees: 0.02, distance: 30 }, neige: false, ciel: "nuit" },
  },
  personnages: [
    {
      // 7 h 04 : la commode, le placard (accroupi devant le sac), puis debout face à Léa, puis assis à côté d'elle
      id: "nathan",
      voix: "Nathan",
      variante: "adulte",
      apparence: NATHAN,
      depart: { position: N_COM, orientation: 318 },
      trajet: [
        { a: "placard+0.5", position: N_PLA, orientation: 325, vitesse: 1.0 },
        { a: "lea+0.6", position: N_DIAL, orientation: 62, vitesse: 0.9 },
        { a: "l_hugo", position: N_COTE, orientation: 78, vitesse: 1.0, chemin: [[-1.55, 0, 0.25], [-1.72, 0, -0.5]] },
        { a: "n_pourquoi-0.1", position: N_ASSIS, orientation: 8, vitesse: 0.6 },
      ],
      poses: [
        { a: 0, pose: "debout" },
        { a: "hook:fouille", pose: "mainTendue", transition: 0.4 },
        { a: "hook2", pose: "mainTendue", transition: 0.3 }, // le téléphone (SMS à Léa, rappel de la nuit)
        { a: "tiroir", pose: "mainTendue", transition: 0.4 },
        { a: "n_honte", pose: "debout", transition: 0.4 },
        { a: "placard+0.5", pose: "mainTendue", transition: 0.3 },
        { a: "briquet-0.6", pose: "accroupi", transition: 0.5 },
        { a: "porte-0.1", pose: "debout", transition: 0.5 },
        { a: "n_mardi", pose: "mainTendue", transition: 0.3 },
        { a: "n_qui", pose: "debout", transition: 0.4 },
        { a: "n_pourquoi-0.1", pose: "assis", transition: 0.5 },
        { a: "calin", pose: "assisCalin", transition: 0.6 },
        { a: "vibre+0.2", pose: "assisMain", transition: 0.4 },
      ],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "hook2", expression: "inquiet" },
        { a: "n_honte", expression: "sourire" },
        { a: "briquet", expression: "surpris" },
        { a: "n_fume", expression: "inquiet" },
        { a: "photos", expression: "peur" },
        { a: "n_quoi", expression: "surpris", transition: 0.2 },
        { a: "dos2", expression: "peur" },
        { a: "porte", expression: "surpris" },
        { a: "n_photos", expression: "colere", transition: 0.3 },
        { a: "silence", expression: "inquiet" },
        { a: "l_suit", expression: "triste" },
        { a: "l_peur", expression: "sourire" },
        { a: "n_vrai", expression: "sourire" },
        { a: "calme", expression: "soulage" },
        { a: "vibre", expression: "surpris", transition: 0.2 },
        { a: "photo", expression: "peur" },
      ],
    },
    {
      // Léa rentre par la porte d'entrée, l'écharpe rouge au cou ; puis s'assoit sur le canapé
      id: "lea",
      voix: "Léa",
      variante: "adulte",
      apparence: LEA,
      presence: { de: "porte" },
      depart: { position: L_PALIER, orientation: 270 },
      trajet: [
        { a: "lea+0.8", position: L_DIAL, orientation: 298, vitesse: 1.0, chemin: [[2.2, 0, -0.85]] },
        { a: "silence+1.3", position: L_ASSIS, orientation: 352, vitesse: 1.1, chemin: [[0.25, 0, -0.75]] },
      ],
      poses: [
        { a: 0, pose: "debout" },
        { a: "l_fouilles", pose: "bras", transition: 0.4 },
        { a: "n_photos", pose: "debout", transition: 0.4 },
        { a: "silence+1.3", pose: "assisTriste", transition: 0.6 },
        { a: "l_peur", pose: "assis", transition: 0.5 },
      ],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "l_fouilles", expression: "colere", transition: 0.2 },
        { a: "n_photos", expression: "peur" },
        { a: "silence", expression: "triste" },
        { a: "l_fume", expression: "colere" },
        { a: "l_nuit", expression: "triste" },
        { a: "l_chuchote", expression: "sourire" },
        { a: "n_pourquoi", expression: "triste" },
        { a: "l_peur", expression: "sourire" },
        { a: "calme", expression: "soulage" },
        { a: "photo", expression: "peur" },
      ],
    },
  ],
  camera: [
    // HOOK — Nathan à la commode de Léa, au petit matin
    { a: 0, ...pied(N_COM, 22, { y: 700, x: 600 }) },
    { a: "hook+1.3", ...pied(N_COM, 18, { distance: 5.4, y: 700, x: 620 }), deplacement: 1.3 },
    { a: "hook2", ...moyen(N_COM, 20, { distance: 4.4, y: 560 }), deplacement: 0.8 },
    // rappel sur l'écran du téléphone : l'appel de son propre numéro, puis le SMS de Sarah
    { a: "rec1", ...moyen(N_COM, 32, { distance: 4.2, y: 560 }), coupe: true },
    { a: "rec1:numero", ...moyen(N_COM, 26, { distance: 3.9, y: 560 }), deplacement: 0.8 },
    { a: "rec2", ...moyen(N_COM, 10, { distance: 4.2, y: 560 }), coupe: true },
    // la commode : les tiroirs
    { a: "tiroir", ...pied(N_COM, 26, { distance: 5.6, y: 720, x: 600 }), coupe: true },
    { a: "rien", ...moyen(N_COM, 34, { distance: 4.0, y: 560 }), deplacement: 0.8 },
    { a: "n_honte", ...moyen(N_COM, 14, { distance: 4.6, y: 560 }), deplacement: 0.7 },
    // le placard, le sac, le briquet, les photos
    { a: "placard", ...pied(N_PLA, 24, { distance: 6.0, y: 740, x: 600 }), coupe: true },
    { a: "briquet", ...objet(BRIQUET, 36, { y: 540 }), coupe: true },
    { a: "initiale", ...objet(BRIQUET, 30, { distance: 0.9, y: 540 }), deplacement: 0.7 },
    { a: "n_fume", ...accroupi(N_PLA, 20, { y: 660 }), coupe: true },
    { a: "enveloppe", ...accroupi(N_PLA, 28, { distance: 4.6, y: 640 }), deplacement: 0.7 },
    { a: "photos", ...objet(PHOTOS, 20, { distance: 1.5, elevation: 55, y: 600 }), coupe: true },
    { a: "photos2", ...objet(PHOTOS, 12, { distance: 1.25, elevation: 58, y: 600, x: 520 }), deplacement: 0.8 },
    { a: "photos3", ...objet([PHOTOS[0] + 0.12, PHOTOS[1], PHOTOS[2] + 0.04], 8, { distance: 1.0, elevation: 60, y: 600 }), deplacement: 0.8 },
    { a: "n_quoi", ...accroupi(N_PLA, 16, { distance: 4.4, y: 640 }), coupe: true },
    { a: "dos", ...objet([PHOTOS[0] - 0.12, PHOTOS[1], PHOTOS[2] + 0.1], 14, { distance: 1.1, elevation: 62, y: 600 }), coupe: true },
    { a: "dos2", ...objet([PHOTOS[0] - 0.12, PHOTOS[1], PHOTOS[2] + 0.1], 10, { distance: 0.85, elevation: 66, y: 600 }), deplacement: 0.5 },
    // la porte d'entrée s'ouvre : Léa
    { a: "porte", ...pied([2.6, 0, -0.9], -22, { distance: 5.6, y: 720, x: 560 }), coupe: true },
    { a: "lea", ...moyen([2.0, 0, -0.75], -18, { distance: 4.4, y: 560 }), deplacement: 0.9 },
    // la dispute, en plan à deux
    { a: "l_fouilles", ...deux(N_DIAL, L_DIAL, 0), coupe: true },
    { a: "n_photos", ...moyen(N_DIAL, 30, { distance: 4.4, y: 560, x: 600 }), coupe: true },
    { a: "n_mardi", ...moyen(N_DIAL, 24, { distance: 4.0, y: 560, x: 600 }), deplacement: 0.8 },
    { a: "n_mardi:briquet", ...moyen(N_DIAL, 18, { distance: 3.7, y: 560, x: 600 }), deplacement: 0.6 },
    { a: "n_qui", ...deux(N_DIAL, L_DIAL, -6, { distance: 5.8 }), coupe: true },
    // l'aveu, sur le canapé
    { a: "silence+0.9", ...assis(L_ASSIS, -6, { distance: 6.0, y: 700, x: 560 }), deplacement: 1.1 },
    { a: "l_hugo", ...assis(L_ASSIS, -10, { distance: 4.6, y: 640, x: 600 }), deplacement: 0.8 },
    { a: "l_suit", ...assis(L_ASSIS, -4, { distance: 4.0, y: 620, x: 600 }), deplacement: 0.8 },
    { a: "l_mardi", ...assis(L_ASSIS, 8, { distance: 4.4, y: 630, x: 620 }), deplacement: 0.8 },
    { a: "l_fume", ...assis(L_ASSIS, 2, { distance: 3.8, y: 620, x: 620 }), deplacement: 0.8 },
    { a: "l_nuit", ...assis(CANAPE_MILIEU, 8, { distance: 6.2, y: 700, x: 540 }), coupe: true },
    { a: "n_pourquoi", ...assis(CANAPE_MILIEU, 2, { distance: 5.4, y: 680, x: 540 }), deplacement: 0.8 },
    { a: "l_peur", ...assis(L_ASSIS, -8, { distance: 4.0, y: 620, x: 600 }), deplacement: 0.7 },
    { a: "n_vrai", ...assis(N_ASSIS, 10, { distance: 4.2, y: 620, x: 620 }), deplacement: 0.7 },
    { a: "calin", ...assis(CANAPE_MILIEU, 0, { distance: 5.6, y: 690, x: 540 }), coupe: true },
    { a: "calme", ...assis(CANAPE_MILIEU, 4, { distance: 4.8, y: 680, x: 540 }), deplacement: 1.6 },
    // le téléphone vibre ; la photo ; la fenêtre d'en face ; les rideaux ouverts derrière eux
    { a: "vibre", ...assis(N_ASSIS, 8, { distance: 4.2, y: 560, x: 640 }), coupe: true },
    { a: "numero", ...assis(N_ASSIS, 5, { distance: 4.0, y: 550, x: 640 }), deplacement: 0.7 },
    { a: "photo", ...assis(N_ASSIS, 2, { distance: 3.8, y: 540, x: 640 }), deplacement: 0.8 },
    { a: "angle", ...plan(FENETRE_ROUGE, { azimut: -8, elevation: 0, distance: 9.4, fov: 46, y: 600, x: 540 }), coupe: true },
    { a: "angle:face", ...plan(FENETRE_ROUGE, { azimut: -6, elevation: 0, distance: 9.6, fov: 36, y: 600, x: 540 }), deplacement: 0.8 },
    { a: "fin:les", ...plan([CANAPE_MILIEU[0] + 0.5, 1.15, CANAPE_MILIEU[2] - 0.3], { azimut: 8, elevation: 4, distance: 6.6, fov: 48, y: 720, x: 540 }), coupe: true },
    { a: "fin:ouverts", ...plan([CANAPE_MILIEU[0] + 0.5, 1.15, CANAPE_MILIEU[2] - 0.3], { azimut: 6, elevation: 4, distance: 6.0, fov: 48, y: 720, x: 540 }), deplacement: 1.2 },
  ],
  hud: [
    {
      type: "telephone",
      de: "hook2",
      a: "rec1-0.05",
      ecran: "sms",
      contact: "LÉA",
      heure: "07:04",
      messages: [
        { a: "hook2-1", texte: "T'es où ?", envoye: true },
        { a: "hook2-1", texte: "Léa. Réponds.", envoye: true },
        { a: "hook2:repond", texte: "Je t'en supplie.", envoye: true },
      ],
    },
    { type: "telephone", de: "rec1", a: "rec2-0.05", ecran: "appel", contact: "MOI", numero: MOI, heure: "03:12" },
    { type: "telephone", de: "rec2", a: "tiroir-0.1", ecran: "sms", contact: "SARAH", heure: "07:02", messages: [{ a: "rec2", texte: "Léa a dormi chez toi ?" }] },
    { type: "telephone", de: "vibre+0.2", a: "angle-0.1", ecran: "sms", contact: MOI, heure: "07:21", messages: [{ a: "photo", texte: "Bonjour, Léa.", photo: true, menace: true }] },
    { type: "carton", de: "fin+0.7", partie: 3, titre: "Le dernier appel", verifie: "", question: "Il les regarde. Nathan…", choix: ["Traverse la rue", "Appelle la police"] },
  ],
  sons: [
    // hook : le tiroir qu'on tire, le téléphone
    { a: "hook", id: "pro_impact/short", gain: -9 },
    { a: "hook:fouille", id: "knock/wood", gain: -9 },
    { a: "hook:fouille+0.1", id: "swipe/cloth", gain: -11 },
    { a: "hook2", id: "cut_hit/sub", gain: -10 },
    { a: "hook2:repond", id: "tap/table", gain: -10 },
    { a: "rec1", id: "cut_hit/punch", gain: -9 },
    { a: "rec1:appele", id: "pro_sub_drop/low", gain: -8 },
    { a: "rec2", id: "cut_hit/sub", gain: -10 },
    { a: "rec2:chez", id: "pro_impact/deep", gain: -8 },
    // la commode
    { a: "tiroir", id: "cut_hit/sub", gain: -11 },
    { a: "tiroir:commode", id: "knock/wood", gain: -8 },
    { a: "tiroir:commode+0.15", id: "swipe/cloth", gain: -10 },
    { a: "rien:pulls", id: "swipe/cloth", gain: -9 },
    { a: "rien:chaussettes", id: "swipe/cloth", gain: -10 },
    { a: "rien:rien", id: "knock/wood", gain: -8 },
    { a: "n_honte", id: "swish/soft", gain: -13 },
    // le placard, le sac
    { a: "placard", id: "cut_hit/punch", gain: -10 },
    { a: "placard:fond", id: "toggle/latch", gain: -8 },
    { a: "placard:sac", id: "swipe/cloth", gain: -8 },
    { a: "briquet", id: "cut_hit/sub", gain: -9 },
    { a: "briquet:rouge", id: "pro_impact/deep", gain: -6 },
    { a: "initiale:h", id: "pro_sub_drop/low", gain: -7 },
    { a: "n_fume", id: "cut_hit/sub", gain: -11 },
    { a: "enveloppe:enveloppe", id: "swipe/cloth", gain: -9 },
    { a: "photos", id: "cut_hit/punch", gain: -8 },
    { a: "photos:12", id: "fit/land.light/finger_wood", gain: -9 },
    { a: "photos:toutes", id: "pro_impact/short", gain: -8 },
    { a: "photos2", id: "tap/table", gain: -11 },
    { a: "photos2:bureau", id: "tap/table", gain: -11 },
    { a: "photos3", id: "pro_sub_drop/low", gain: -7 },
    { a: "photos3:lit", id: "pro_impact/deep", gain: -6 },
    { a: "n_quoi", id: "cut_hit/sub", gain: -10 },
    { a: "dos", id: "cut_hit/sub", gain: -10 },
    { a: "dos:dos", id: "swipe/cloth", gain: -10 },
    { a: "dos2", id: "pro_impact/deep", gain: -5 },
    { a: "dos2:moi", id: "pro_sub_drop/low", gain: -5 },
    // Léa rentre
    { a: "porte", id: "reverse_swell/dark", gain: -9 },
    { a: "porte:entree", id: "toggle/latch", gain: -7 },
    { a: "porte:ouvre+0.3", id: "knock/wood", gain: -10 },
    { a: "lea", id: "cut_hit/sub", gain: -11 },
    { a: "lea:rouges", id: "pro_impact/short", gain: -9 },
    { a: "l_fouilles", id: "cut_hit/punch", gain: -10 },
    { a: "n_photos", id: "cut_hit/sub", gain: -10 },
    { a: "n_mardi", id: "swish/soft", gain: -12 },
    { a: "n_mardi:briquet", id: "pro_impact/short", gain: -9 },
    { a: "n_qui", id: "cut_hit/punch", gain: -10 },
    { a: "n_qui:h", id: "pro_sub_drop/low", gain: -8 },
    // l'aveu
    { a: "silence", id: "riser/tension", gain: -13 },
    { a: "silence+1.3", id: "swipe/cloth", gain: -10 },
    { a: "l_hugo:ex", id: "pro_impact/deep", gain: -7 },
    { a: "l_suit:mois", id: "pro_impact/short", gain: -9 },
    { a: "l_nuit", id: "cut_hit/sub", gain: -11 },
    { a: "l_nuit:commissariat", id: "pro_impact/short", gain: -10 },
    { a: "n_pourquoi-0.2", id: "swipe/cloth", gain: -11 },
    { a: "calin", id: "cut_hit/sub", gain: -12 },
    { a: "calin:bras", id: "swipe/cloth", gain: -9 },
    { a: "calme", id: "whoosh_big/swell", gain: -13 },
    // la photo
    { a: "vibre", id: "cut_hit/punch", gain: -7 },
    { a: "vibre:vibre", id: "tap/table", gain: -7 },
    { a: "vibre:vibre+0.12", id: "tap/table", gain: -8 },
    { a: "vibre:vibre+0.24", id: "tap/table", gain: -7 },
    { a: "numero:encore", id: "pro_sub_drop/low", gain: -6 },
    { a: "photo", id: "pro_impact/deep", gain: -6 },
    { a: "photo:maintenant", id: "pro_impact/short", gain: -7 },
    { a: "angle", id: "cut_hit/punch", gain: -8 },
    { a: "angle:face", id: "pro_impact/deep", gain: -5 },
    { a: "fin:les", id: "whoosh_big/deep", gain: -9 },
    { a: "fin:ouverts", id: "pro_sub_drop/low", gain: -4 },
    // carton à choix
    { a: "fin+0.7", id: "impact/deep", gain: -8 },
    { a: "fin+0.9", id: "whoosh_fast/heavy", gain: -9 },
    { a: "fin+1.23", id: "cut_hit/punch", gain: -6 },
    { a: "fin+1.4", id: "cut_hit/sub", gain: -5 },
  ],
  ambiances: [
    { type: "drone", de: 0, a: "fin+8.4", niveau: -1 },
    { type: "ville", de: 0, a: "fin+8.4", niveau: -9, fondu: 1.5 },
    { type: "grincement", de: "placard:fond-0.1", a: "placard:sac", niveau: -6 },
    { type: "grincement", de: "porte:entree", a: "porte.fin+0.4", niveau: -5 },
    { type: "coeur", de: "photos3", a: "porte", niveau: -1, bpm: 100 },
    { type: "coeur", de: "vibre", a: "fin+8.4", niveau: -1, bpm: 112 },
  ],
  sujets: [
    { de: 0, a: "rec1", personnage: "nathan", hauteur: 1.3 },
    { de: "tiroir", a: "briquet", personnage: "nathan", hauteur: 1.3 },
    { de: "briquet", a: "n_fume", point: BRIQUET },
    { de: "n_fume", a: "photos", personnage: "nathan", hauteur: 0.8 },
    { de: "photos", a: "n_quoi", point: PHOTOS },
    { de: "n_quoi", a: "dos", personnage: "nathan", hauteur: 0.8 },
    { de: "dos", a: "porte", point: [PHOTOS[0] - 0.12, PHOTOS[1], PHOTOS[2] + 0.1] },
    { de: "lea", a: "n_photos", personnage: "lea", hauteur: 1.4 },
    { de: "n_qui", a: "silence", personnage: "lea", hauteur: 1.4 },
    { de: "l_fouilles", a: "silence", personnage: "nathan", hauteur: 1.4 },
    { de: "silence+1.3", a: "n_vrai-0.7", personnage: "lea", hauteur: 1.0 },
    { de: "calin", a: "vibre", personnage: "lea", hauteur: 1.0 },
    { de: "n_pourquoi", a: "angle", personnage: "nathan", hauteur: 1.0 },
    { de: "angle", a: "fin:les", point: FENETRE_ROUGE },
  ],
};
