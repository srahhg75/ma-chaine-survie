import { OptionsPlan, plan } from "../../systeme/camera";
import { DonneesEpisode } from "../../systeme/episode";
import { Vec3 } from "../../systeme/maths";
import { Apparence } from "../../systeme/personnage/apparence";
import { descente, NIV } from "../003-h72-lampe/donnees";
import { LEA, NATHAN } from "../006-appel/personnages";

/*
 * « Le dernier appel » — Partie 4 « La fuite » (choix A de la partie 3 : il fuit avec Léa). DERNIER ÉPISODE.
 * Script : videos/009-appel4/script.txt. Même appartement (3e, en coupe), rideaux tirés depuis la fin de la P3.
 * Le bouton du verrou a été arraché (on ne peut plus ouvrir de l'intérieur sans clé) et les clés ont disparu du
 * crochet : Léa ouvre avec son trousseau. Hugo sort de la chambre, dans l'ombre. La cage d'escalier (reprise de
 * H+72, décor à part, à 40 m au sud) ; la rue : la façade de leur immeuble (hall éclairé), l'immeuble d'en face de la
 * P3 (sans le trépied, emporté par la police), deux voitures de police. Le soir, la serrure neuve ; la nuit, 3 h 12,
 * Nathan éveillé sur le canapé, le téléphone posé sur la table basse, qui ne sonne pas.
 */
export const FENETRE = { x: 0.3, largeur: 2.6, bas: 0.6, haut: 2.3, z: -2.3 };
export const PORTE = { x: 3.0, z: -0.9, largeur: 0.95 }; // porte d'entrée (mur est), charnière côté nord
export const VERROU: Vec3 = [2.92, 1.12, -0.55];
export const LAMPE: Vec3 = [-2.55, 0, -1.85];
export const PLACARD: Vec3 = [-2.66, 0, -0.75];
export const PORTEMANTEAU: Vec3 = [2.72, 0, 0.75];
export const CROCHET: Vec3 = [2.93, 1.45, 0.2]; // planchette à clés, vide
export const SAC: Vec3 = [2.6, 1.22, 0.78]; // le sac de Léa, au portemanteau
export const TOMBE: Vec3 = [2.35, 0.02, 0.15]; // le trousseau, par terre (carrelage de l'entrée)
export const PASSAGE_Z = 0.85; // passage salon -> chambre (mur ouest)
export const LIT: Vec3 = [-6.2, 0, 0.1];
export const SOUS_LIT: Vec3 = [-5.5, 0.13, 0.55];
export const TABLE: Vec3 = [-0.9, 0, -0.35]; // table basse
export const TEL_NUIT: Vec3 = [-0.75, 0.43, -0.32]; // le téléphone posé sur la table basse, la nuit
export const REVEIL: Vec3 = [-1.07, 0.42, -0.42]; // radio-réveil (chiffres rouges)

// La cage d'escalier (décor de H+72 P3) posée à part : décalage appliqué à toutes ses coordonnées
export const CAGE: Vec3 = [0, 0, 40];
export const cage = (p: Vec3): Vec3 => [p[0] + CAGE[0], p[1] + CAGE[1], p[2] + CAGE[2]];

// La rue (niveau du trottoir), la façade de leur immeuble, le hall
export const RUE_Y = -6.5;
export const Z_FACADE_NOUS = -2.55;
export const HALL: Vec3 = [-1.0, RUE_Y, Z_FACADE_NOUS];
export const VOITURE1: Vec3 = [-4.2, RUE_Y, -6.3];
export const VOITURE2: Vec3 = [3.5, RUE_Y, -8.7];
export const CAPOT: Vec3 = [VOITURE1[0] - 1.5, RUE_Y + 0.92, VOITURE1[2]]; // le double des clés et le téléphone d'Hugo, sur le capot

const N_ASSIS = [-0.45, 0, -1.05] as Vec3;
const L_ASSIS = [-1.1, 0, -1.05] as Vec3;
const CANAPE_MILIEU = [-0.78, 0, -1.05] as Vec3;
const N_DEBOUT = [0.2, 0, -0.75] as Vec3;
const L_DEBOUT = [-0.38, 0, -0.85] as Vec3;
const N_PORTE = [2.15, 0, 0.05] as Vec3;
const L_SAC = [2.3, 0, 0.5] as Vec3;
const L_VERROU = [2.42, 0, -0.42] as Vec3;
const N_RECUL = [1.85, 0, 0.3] as Vec3;
const PALIER: Vec3 = [3.95, 0, -0.75];
const H_PASSAGE: Vec3 = [-3.0, 0, PASSAGE_Z];
// escalier : du palier du 6e (porte) au palier du 4e (dans le décor de la cage)
const ESC_DEPART_L = cage([-0.75, NIV.e6, -1.0]);
const ESC_DEPART_N = cage([-1.05, NIV.e6, -0.75]);
// un étage et demi en 4,6 s : du 6e au palier intermédiaire sous le 5e (ils sortent du cadre par le bas)
const ESC_CHEMIN = [...descente(NIV.e6), ...descente(NIV.e5).slice(0, 2)].map(cage);
const ESC_ARRIVEE_L = cage(descente(NIV.e5)[2]);
const ESC_ARRIVEE_N = cage(descente(NIV.e5)[2]);
// la rue
const SORTIE: Vec3 = [HALL[0], RUE_Y, Z_FACADE_NOUS - 0.6];
const N_RUE: Vec3 = [0.75, RUE_Y, -4.7];
const L_RUE: Vec3 = [0.05, RUE_Y, -4.55];
const RUE_MILIEU: Vec3 = [0.4, RUE_Y, -4.6];

// Cadrages pour des personnages « adulte » (≈ 1,75 m), comme les parties 1 à 3
const pied = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 0.9, p[2]], { azimut: az, elevation: 6, distance: 6.2, fov: 46, y: 700, ...o });
const moyen = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 1.2, p[2]], { azimut: az, elevation: 4, fov: 42, y: 600, x: 640, ...o, distance: (o.distance ?? 5.6) * 1.85 });
const assis = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 0.8, p[2]], { azimut: az, elevation: 6, fov: 42, y: 660, x: 640, ...o, distance: (o.distance ?? 5.6) * 1.3 });
const objet = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan(p, { azimut: az, elevation: 20, distance: 1.3, fov: 34, y: 560, ...o });
const deux = (a: Vec3, b: Vec3, az: number, o: Partial<OptionsPlan> = {}) =>
  plan([(a[0] + b[0]) / 2, a[1] + 1.0, (a[2] + b[2]) / 2], { azimut: az, elevation: 6, distance: 6.4, fov: 46, y: 680, x: 540, ...o });
// dans la rue, depuis le trottoir d'en face (azimut 180 = depuis le nord)
const rue = (p: Vec3, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 1.1, p[2]], { azimut: 180, elevation: 5, distance: 6.4, fov: 44, y: 660, x: 540, ...o });

const MOI = "06 •• •• •• 27";
const POLICIER: Partial<Apparence> = {
  femme: false, age: 0.3, peau: "#e2b896", cheveux: "#1a1412", coiffure: "court", haut: "parka", couleurHaut: "#1c2230",
  pantalon: "#1a1d24", chaussures: "bottines", couleurChaussures: "#111114", bonnet: "#15171c",
};
// Hugo : tout en sombre (parka, bonnet, gants) ; il reste dans l'ombre, on ne voit jamais son visage éclairé
const HUGO: Partial<Apparence> = {
  femme: false, age: 0.15, peau: "#c9a088", cheveux: "#0e0e10", coiffure: "court", haut: "parka", couleurHaut: "#0f0f12", couleurCol: "#141416",
  pantalon: "#101013", chaussures: "bottines", couleurChaussures: "#0a0a0c", bonnet: "#0c0c0e", gants: "#0c0c0e",
};
const PASSANT: Partial<Apparence> = {
  femme: true, age: 0.5, peau: "#e6bfa2", cheveux: "#6a6a6e", coiffure: "carre", haut: "parka", couleurHaut: "#5a5a60", pantalon: "#2a2a30", chaussures: "bottines", couleurChaussures: "#1a1a1c",
};

export const donnees: DonneesEpisode = {
  id: "009-appel4",
  titre: "Le dernier appel — Partie 4 : La fuite",
  queue: 6.2, // le narrateur lit le carton FIN (@carton1-3)
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
      { type: "table", position: TABLE, echelle: 0.55, couleur: "#3a2e24", id: "table-basse" },
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
      // l'appartement : du canapé (fin de la P3) à la porte, puis le palier
      id: "nathan",
      voix: "Nathan",
      variante: "adulte",
      apparence: NATHAN,
      presence: { a: "escalier" },
      depart: { position: N_ASSIS, orientation: 330 },
      trajet: [
        { a: "rec2", position: N_DEBOUT, orientation: 340, vitesse: 0.8, chemin: [[-0.2, 0, -0.75]] },
        { a: "main", position: N_DEBOUT, orientation: 300, vitesse: 0.5 },
        { a: "crochet-0.2", position: N_PORTE, orientation: 60, vitesse: 1.1, chemin: [[1.2, 0, -0.5]] },
        { a: "grince+0.4", position: N_RECUL, orientation: 300, vitesse: 0.8 },
        { a: "ombre:derriere", position: [2.2, 0, -0.55], orientation: 70, vitesse: 1.2 },
        { a: "escalier-0.1", position: [PALIER[0] + 0.3, 0, PALIER[2] - 0.35], orientation: 90, vitesse: 1.4, chemin: [[2.7, 0, -0.75], [3.1, 0, -0.85]] },
      ],
      poses: [
        { a: 0, pose: "assis" },
        { a: "rec1+0.3", pose: "debout", transition: 0.5 },
        { a: "doigt", pose: "chut", transition: 0.3 },
        { a: "main", pose: "mainTendue", transition: 0.3 },
        { a: "l_quoi", pose: "debout", transition: 0.3 },
        { a: "ecran", pose: "mainTendue", transition: 0.3 },
        { a: "entree", pose: "debout", transition: 0.3 },
        { a: "verrou", pose: "mainTendue", transition: 0.3 },
        { a: "n_cles", pose: "debout", transition: 0.3 },
        { a: "grince", pose: "inquiet", transition: 0.3 },
        { a: "ombre", pose: "debout", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "peur" },
        { a: "doigt", expression: "decide" },
        { a: "crochet", expression: "inquiet" },
        { a: "n_cles", expression: "peur" },
        { a: "grince", expression: "peur", transition: 0.2 },
      ],
    },
    {
      id: "lea",
      voix: "Léa",
      variante: "adulte",
      apparence: LEA,
      presence: { a: "escalier" },
      depart: { position: L_ASSIS, orientation: 20 },
      trajet: [
        { a: "main+0.4", position: L_DEBOUT, orientation: 70, vitesse: 0.8, chemin: [[-1.1, 0, -0.75]] },
        { a: "crochet+0.3", position: [1.7, 0, -0.55], orientation: 60, vitesse: 1.0, chemin: [[0.6, 0, -0.6]] },
        { a: "sac", position: L_SAC, orientation: 50, vitesse: 0.9 },
        { a: "l_vite-0.3", position: L_VERROU, orientation: 75, vitesse: 0.9, chemin: [[2.25, 0, 0.0]] },
        { a: "ombre:derriere", position: [2.55, 0, -0.62], orientation: 80, vitesse: 1.0 },
        { a: "ombre.fin", position: PALIER, orientation: 90, vitesse: 1.4, chemin: [[2.95, 0, -0.8]] },
      ],
      poses: [
        { a: 0, pose: "assisTriste" },
        { a: "main", pose: "debout", transition: 0.5 },
        { a: "l_quoi", pose: "bras", transition: 0.3 },
        { a: "ecran", pose: "debout", transition: 0.3 },
        { a: "sac+0.2", pose: "mainTendue", transition: 0.3 },
        { a: "tombe+0.3", pose: "accroupi", transition: 0.3 },
        { a: "grince+0.6", pose: "debout", transition: 0.3 },
        { a: "l_vite", pose: "mainTendue", transition: 0.3 },
        { a: "ombre", pose: "debout", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "peur" },
        { a: "l_quoi", expression: "inquiet" },
        { a: "ecran2:la", expression: "peur", transition: 0.15 },
        { a: "tombe", expression: "surpris", transition: 0.15 },
        { a: "grince", expression: "peur" },
      ],
    },
    {
      // Hugo dans l'appartement : sort de sous le lit au grincement, apparaît dans le passage de la chambre (dans l'ombre)
      id: "hugo",
      voix: "Hugo",
      variante: "adulte",
      apparence: HUGO,
      presence: { de: "grince+0.6", a: "escalier" },
      depart: { position: [-4.4, 0, 1.3], orientation: 90 },
      trajet: [{ a: "ombre:chambre", position: [H_PASSAGE[0] + 0.15, 0, H_PASSAGE[2]], orientation: 90, vitesse: 0.7, chemin: [[-3.6, 0, PASSAGE_Z]] }],
      poses: [{ a: 0, pose: "debout" }],
    },
    {
      // l'escalier : ils dévalent deux étages (6e -> 4e du décor), Léa devant
      id: "lea-esc",
      voix: "Léa",
      variante: "adulte",
      apparence: LEA,
      presence: { de: "escalier", a: "rue" },
      depart: { position: ESC_DEPART_L, orientation: 120 },
      trajet: [{ a: "pas:accelerent", position: ESC_ARRIVEE_L, orientation: 200, vitesse: 2.15, chemin: ESC_CHEMIN }],
      poses: [{ a: 0, pose: "debout" }],
      expressions: [{ a: 0, expression: "peur" }],
    },
    {
      id: "nathan-esc",
      voix: "Nathan",
      variante: "adulte",
      apparence: NATHAN,
      presence: { de: "escalier", a: "rue" },
      depart: { position: ESC_DEPART_N, orientation: 120 },
      trajet: [{ a: "rue-0.1", position: ESC_ARRIVEE_N, orientation: 200, vitesse: 2.15, chemin: ESC_CHEMIN.slice(0, -1) }],
      poses: [{ a: 0, pose: "debout" }],
      expressions: [{ a: 0, expression: "peur" }],
    },
    {
      // Hugo dans l'escalier : il apparaît sur le palier du 6e et descend (silhouette, à contre-jour)
      id: "hugo-esc",
      voix: "Hugo",
      variante: "adulte",
      apparence: HUGO,
      presence: { de: "pas", a: "rue" },
      depart: { position: cage([-0.9, NIV.e6, -1.15]), orientation: 140 },
      trajet: [{ a: "pas.fin+0.3", position: descente(NIV.e6).map(cage)[1], orientation: 100, vitesse: 1.6, chemin: [cage([-0.2, NIV.e6, -0.6]), descente(NIV.e6).map(cage)[0]] }],
      poses: [{ a: 0, pose: "debout" }],
    },
    {
      // la rue : ils sortent du hall en courant, s'arrêtent sur le trottoir ; Nathan appelle le 17
      id: "nathan-rue",
      voix: "Nathan",
      variante: "adulte",
      apparence: NATHAN,
      presence: { de: "rue", a: "serrure" },
      depart: { position: [SORTIE[0] + 0.3, RUE_Y, SORTIE[2]], orientation: 160 },
      trajet: [
        { a: "rue:passants", position: N_RUE, orientation: 200, vitesse: 1.5 },
        { a: "sort", position: [N_RUE[0] + 0.3, RUE_Y, N_RUE[2] - 0.2], orientation: 240, vitesse: 0.7 },
        { a: "l_fuir-0.2", position: N_RUE, orientation: 200, vitesse: 0.7 },
      ],
      poses: [
        { a: 0, pose: "debout" },
        { a: "n_17-0.3", pose: "telephone", transition: 0.3 },
        { a: "police+0.6", pose: "debout", transition: 0.4 },
        { a: "n_courir", pose: "bras", transition: 0.3 },
        { a: "l_menteur", pose: "debout", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "peur" },
        { a: "police", expression: "inquiet" },
        { a: "poches", expression: "colere" },
        { a: "l_fuir", expression: "fatigue" },
        { a: "n_courir", expression: "sourire" },
        { a: "l_menteur", expression: "surpris" },
      ],
    },
    {
      id: "lea-rue",
      voix: "Léa",
      variante: "adulte",
      apparence: LEA,
      presence: { de: "rue", a: "serrure" },
      depart: { position: [SORTIE[0] - 0.2, RUE_Y, SORTIE[2] - 0.2], orientation: 170 },
      trajet: [
        { a: "rue.fin", position: L_RUE, orientation: 160, vitesse: 1.4 },
        { a: "sort", position: [L_RUE[0] + 0.1, RUE_Y, L_RUE[2] - 0.2], orientation: 240, vitesse: 0.7 },
        { a: "l_fuir-0.2", position: L_RUE, orientation: 150, vitesse: 0.7 },
      ],
      poses: [
        { a: 0, pose: "debout" },
        { a: "rue:froid", pose: "froid", transition: 0.4 },
        { a: "police", pose: "debout", transition: 0.4 },
        { a: "juillet", pose: "inquiet", transition: 0.3 },
        { a: "l_fuir", pose: "debout", transition: 0.3 },
        { a: "l_menteur", pose: "bras", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "peur" },
        { a: "police", expression: "soulage" },
        { a: "juillet", expression: "surpris" },
        { a: "numero", expression: "colere" },
        { a: "l_fuir", expression: "sourire" },
        { a: "l_menteur", expression: "sourire" },
      ],
    },
    {
      // deux passants sur le trottoir (de passage, vers l'ouest et vers l'est)
      id: "passant1",
      voix: "passant1",
      variante: "adulte",
      apparence: PASSANT,
      presence: { de: "rue", a: "police" },
      depart: { position: [5.5, RUE_Y, -3.6], orientation: 270 },
      trajet: [{ a: "police", position: [-6.0, RUE_Y, -3.6], orientation: 270, vitesse: 1.2 }],
      poses: [{ a: 0, pose: "debout" }],
    },
    {
      id: "passant2",
      voix: "passant2",
      variante: "adulte",
      apparence: { ...PASSANT, femme: false, coiffure: "court", cheveux: "#2a2420", couleurHaut: "#3a3a40", age: 0.25 },
      presence: { de: "rue", a: "police" },
      depart: { position: [-5.5, RUE_Y, -3.2], orientation: 90 },
      trajet: [{ a: "police", position: [5.8, RUE_Y, -3.2], orientation: 90, vitesse: 1.3 }],
      poses: [{ a: 0, pose: "debout" }],
    },
    {
      // Hugo, sorti du hall entre deux policiers, jusqu'à la première voiture (tête basse, de loin)
      id: "hugo-rue",
      voix: "Hugo",
      variante: "adulte",
      apparence: HUGO,
      presence: { de: "sort", a: "poches" },
      depart: { position: SORTIE, orientation: 200 },
      trajet: [{ a: "poches-0.2", position: [VOITURE1[0] + 1.0, RUE_Y, VOITURE1[2] + 1.15], orientation: 230, vitesse: 1.0 }],
      poses: [{ a: 0, pose: "inquiet" }],
    },
    {
      id: "policier1",
      voix: "policier1",
      variante: "adulte",
      apparence: POLICIER,
      presence: { de: "sort", a: "poches" },
      depart: { position: [SORTIE[0] - 0.65, RUE_Y, SORTIE[2] - 0.1], orientation: 200 },
      trajet: [{ a: "poches-0.2", position: [VOITURE1[0] + 0.35, RUE_Y, VOITURE1[2] + 1.05], orientation: 230, vitesse: 1.0 }],
      poses: [{ a: 0, pose: "debout" }],
    },
    {
      id: "policier2",
      voix: "policier2",
      variante: "adulte",
      apparence: { ...POLICIER, peau: "#c99a78", age: 0.2 },
      presence: { de: "sort", a: "poches" },
      depart: { position: [SORTIE[0] + 0.6, RUE_Y, SORTIE[2] - 0.15], orientation: 200 },
      trajet: [{ a: "poches-0.2", position: [VOITURE1[0] + 1.65, RUE_Y, VOITURE1[2] + 1.0], orientation: 230, vitesse: 1.0 }],
      poses: [{ a: 0, pose: "debout" }],
    },
    {
      // 3 h 12 : Nathan éveillé sur le canapé, le téléphone posé devant lui
      id: "nathan-nuit",
      voix: "Nathan",
      variante: "adulte",
      apparence: NATHAN,
      presence: { de: "nuit" },
      depart: { position: N_ASSIS, orientation: 8 },
      poses: [{ a: 0, pose: "assis" }],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "fin", expression: "soulage", transition: 0.6 },
      ],
    },
  ],
  camera: [
    // HOOK — sous le lit (dernière image de la P3) ; le couple figé sur le canapé
    { a: 0, ...plan(SOUS_LIT, { azimut: 2, elevation: 3, distance: 1.05, fov: 40, y: 700, x: 540 }) },
    { a: "hook:lit", ...plan(SOUS_LIT, { azimut: 0, elevation: 4, distance: 1.4, fov: 40, y: 700, x: 540 }), deplacement: 1.0 },
    { a: "hook2", ...assis(CANAPE_MILIEU, 0, { distance: 5.4, y: 690, x: 540 }), coupe: true },
    { a: "hook2:retourner", ...assis(CANAPE_MILIEU, 4, { distance: 4.8, y: 680, x: 540 }), deplacement: 0.8 },
    // RAPPEL — ils se lèvent ; la chambre et le salon ensemble : 4 mètres
    { a: "rec1", ...deux(N_ASSIS, L_ASSIS, -4, { distance: 7.4, y: 700 }), coupe: true },
    { a: "rec2", ...plan([-5.6, 0.7, 0.4], { azimut: 12, elevation: 8, distance: 6.6, fov: 46, y: 700, x: 540 }), coupe: true },
    // depuis la chambre, à travers le passage : le couple, à 4 mètres
    { a: "rec3", ...plan([-0.1, 1.1, -0.8], { azimut: -64, elevation: 2, distance: 6.5, fov: 40, y: 640, x: 540 }), coupe: true },
    // le silence : le doigt sur les lèvres, la main, l'écran
    { a: "doigt", ...moyen(N_DEBOUT, -18, { distance: 3.9, y: 570 }), coupe: true },
    { a: "main", ...deux(N_DEBOUT, L_DEBOUT, 0, { distance: 5.8, y: 690 }), coupe: true },
    { a: "l_quoi", ...moyen(L_DEBOUT, 30, { distance: 3.9, y: 570, x: 560 }), coupe: true },
    { a: "ecran", ...deux(N_DEBOUT, L_DEBOUT, -10, { distance: 5.2, y: 690, x: 700 }), coupe: true },
    { a: "ecran2", ...moyen(L_DEBOUT, 24, { distance: 3.6, y: 570, x: 600 }), coupe: true },
    // l'entrée : le crochet vide, la porte fermée (bouton arraché), les clés
    { a: "entree", ...pied([1.2, 0, -0.4], -6, { distance: 7.4, y: 720, x: 540 }), coupe: true },
    { a: "crochet", ...objet(CROCHET, -55, { distance: 1.1, elevation: 8, y: 600 }), coupe: true },
    { a: "verrou", ...objet(VERROU, -125, { distance: 1.3, elevation: 15, y: 600 }), coupe: true },
    { a: "n_cles", ...moyen(N_PORTE, -40, { distance: 3.9, y: 570, x: 560 }), coupe: true },
    { a: "sac", ...deux(N_PORTE, L_SAC, -50, { distance: 5.6, y: 690, x: 540 }), coupe: true },
    { a: "tombe", ...plan(TOMBE, { azimut: -40, elevation: 32, distance: 1.6, fov: 36, y: 640, x: 540 }), coupe: true },
    { a: "grince", ...plan([-5.6, 0.7, 0.4], { azimut: 12, elevation: 8, distance: 6.6, fov: 46, y: 700, x: 540 }), coupe: true },
    { a: "grince:sommier", ...plan([-5.6, 0.6, 0.4], { azimut: 10, elevation: 8, distance: 5.6, fov: 46, y: 700, x: 540 }), deplacement: 1.0 },
    { a: "l_vite", ...moyen(L_VERROU, -40, { distance: 3.8, y: 570, x: 520 }), coupe: true },
    { a: "tour", ...objet(VERROU, -125, { distance: 1.2, elevation: 12, y: 600 }), coupe: true },
    // l'ombre : tout le salon, la porte qui s'ouvre à droite, Hugo dans le passage à gauche
    { a: "ombre", ...pied([2.4, 0, -0.6], -10, { distance: 6.4, y: 700, x: 540 }), coupe: true },
    { a: "ombre:ombre", ...plan([-3.0, 1.0, 0.85], { azimut: 28, elevation: 4, distance: 5.4, fov: 44, y: 640, x: 540 }), coupe: true },
    // l'escalier (décor à part) : ils dévalent ; Hugo apparaît en haut
    { a: "escalier", ...plan(cage([0.9, NIV.e5 + 0.6, -0.4]), { azimut: 0, elevation: 4, distance: 12.0, fov: 46, y: 640, x: 540 }), coupe: true },
    { a: "pas", ...plan(cage([0.2, NIV.e6 + 0.9, -0.6]), { azimut: 6, elevation: -8, distance: 7.0, fov: 44, y: 600, x: 540 }), coupe: true },
    // la rue
    { a: "rue", ...rue([SORTIE[0] + 0.6, RUE_Y, -3.8], { distance: 7.6, y: 700 }), coupe: true },
    { a: "rue:passants", ...rue(RUE_MILIEU, { distance: 6.8, y: 700 }), deplacement: 1.0 },
    { a: "n_17", ...rue(N_RUE, { distance: 5.2, y: 600, x: 600 }), coupe: true },
    { a: "police", ...plan([0.0, RUE_Y + 0.8, -6.8], { azimut: -80, elevation: 10, distance: 11.5, fov: 44, y: 700, x: 540 }), coupe: true },
    { a: "sort", ...plan([-2.4, RUE_Y + 1.0, -4.2], { azimut: 100, elevation: 30, distance: 9.5, fov: 44, y: 720, x: 540 }), coupe: true },
    { a: "poches", ...objet(CAPOT, 150, { distance: 1.3, elevation: 24, y: 600 }), coupe: true },
    { a: "juillet", ...rue(L_RUE, { distance: 5.2, y: 600, x: 520 }), coupe: true },
    { a: "numero", ...objet(CAPOT, 160, { distance: 1.0, elevation: 30, y: 560 }), coupe: true },
    { a: "l_fuir", ...rue(RUE_MILIEU, { distance: 5.4, y: 680 }), coupe: true },
    { a: "l_fuir:lache", ...rue(RUE_MILIEU, { distance: 4.8, y: 670 }), deplacement: 0.8 },
    { a: "n_courir", ...rue(N_RUE, { distance: 5.0, y: 600, x: 600 }), coupe: true },
    { a: "l_menteur", ...rue(L_RUE, { distance: 5.0, y: 600, x: 500 }), coupe: true },
    // le soir : la serrure neuve ; la nuit : Nathan éveillé, le téléphone posé, qui ne sonne pas
    { a: "serrure", ...objet(VERROU, -125, { distance: 1.3, elevation: 15, y: 600 }), coupe: true },
    { a: "nuit", ...assis(N_ASSIS, 8, { distance: 5.0, y: 640, x: 620 }), coupe: true },
    { a: "nuit:dort", ...assis(N_ASSIS, 4, { distance: 4.3, y: 630, x: 620 }), deplacement: 0.9 },
    { a: "pose", ...plan(TEL_NUIT, { azimut: -25, elevation: 48, distance: 1.25, fov: 36, y: 620, x: 540 }), coupe: true },
    { a: "fin", ...plan(TEL_NUIT, { azimut: -20, elevation: 52, distance: 0.9, fov: 36, y: 620, x: 540 }), deplacement: 1.4 },
  ],
  hud: [
    { type: "telephone", de: "ecran+0.2", a: "entree-0.05", ecran: "sms", contact: "Léa", heure: "07:52", messages: [{ a: "ecran2:trois", texte: "Il est là.", envoye: true, menace: true }] },
    { type: "telephone", de: "n_17", a: "police-0.05", ecran: "appel", contact: "POLICE SECOURS", numero: "17", heure: "07:54", enCours: true },
    { type: "telephone", de: "numero", a: "l_fuir-0.05", ecran: "appel", contact: "Nathan", numero: MOI, heure: "03:12" },
    { type: "carton", de: "fin+0.7", partie: 4, titre: "Le dernier appel", verifie: "", question: "Vous auriez soulevé la couette ?", fin: true },
  ],
  sons: [
    // hook : sous le lit, puis le canapé
    { a: "hook", id: "pro_sub_drop/low", gain: -6 },
    { a: "hook:respire", id: "reverse_swell/breath", gain: -12 },
    { a: "hook:lit", id: "pro_impact/deep", gain: -7 },
    { a: "hook2", id: "cut_hit/punch", gain: -9 },
    { a: "hook2:cours", id: "whoosh_fast/heavy", gain: -11 },
    { a: "hook2:retourner", id: "pro_impact/short", gain: -9 },
    { a: "rec1", id: "cut_hit/sub", gain: -10 },
    { a: "rec1+0.3", id: "swipe/cloth", gain: -9 },
    { a: "rec1:a", id: "pro_impact/short", gain: -9 },
    { a: "rec2", id: "cut_hit/punch", gain: -9 },
    { a: "rec2:lit", id: "pro_sub_drop/low", gain: -7 },
    { a: "rec3:metres", id: "pro_impact/deep", gain: -8 },
    // le silence
    { a: "doigt", id: "cut_hit/sub", gain: -11 },
    { a: "doigt:levres", id: "swipe/cloth", gain: -10 },
    { a: "main", id: "cut_hit/sub", gain: -12 },
    { a: "main:main", id: "swipe/cloth", gain: -10 },
    { a: "l_quoi", id: "cut_hit/sub", gain: -13 },
    { a: "ecran", id: "cut_hit/sub", gain: -11 },
    { a: "ecran:ecran", id: "tap/table", gain: -10 },
    { a: "ecran2", id: "cut_hit/punch", gain: -10 },
    { a: "ecran2:la", id: "pro_impact/deep", gain: -6 },
    // l'entrée
    { a: "entree", id: "cut_hit/sub", gain: -11 },
    { a: "entree:bruit", id: "swipe/cloth", gain: -11 },
    { a: "crochet", id: "cut_hit/punch", gain: -9 },
    { a: "crochet:crochet", id: "pro_sub_drop/low", gain: -7 },
    { a: "verrou", id: "cut_hit/sub", gain: -10 },
    { a: "verrou:porte", id: "toggle/latch", gain: -6 },
    { a: "verrou:porte+0.2", id: "toggle/latch", gain: -7 },
    { a: "verrou:tour", id: "pro_impact/short", gain: -8 },
    { a: "n_cles", id: "cut_hit/sub", gain: -12 },
    { a: "sac", id: "cut_hit/sub", gain: -11 },
    { a: "sac:fouille", id: "swipe/cloth", gain: -8 },
    { a: "sac:sac", id: "swipe/cloth", gain: -9 },
    { a: "sac:trousseau", id: "tap/knuckle", gain: -9 },
    { a: "tombe", id: "cut_hit/sub", gain: -11 },
    { a: "tombe:tombe", id: "tap/table", gain: -5 },
    { a: "tombe:tombe+0.07", id: "tap/knuckle", gain: -6 },
    { a: "tombe:tombe+0.16", id: "tap/table", gain: -8 },
    { a: "tombe:carrelage", id: "pro_impact/short", gain: -9 },
    { a: "grince", id: "cut_hit/punch", gain: -8 },
    { a: "grince:sommier", id: "pro_sub_drop/low", gain: -6 },
    { a: "l_vite", id: "cut_hit/sub", gain: -12 },
    { a: "l_vite+0.3", id: "click/thock", gain: -9 },
    { a: "tour", id: "cut_hit/sub", gain: -10 },
    { a: "tour:tour", id: "toggle/latch", gain: -5 },
    { a: "tour:tours", id: "toggle/latch", gain: -5 },
    { a: "tour:tours+0.25", id: "click/thock", gain: -7 },
    // l'ombre, la fuite
    { a: "ombre", id: "cut_hit/punch", gain: -8 },
    { a: "ombre:derriere", id: "toggle/latch", gain: -7 },
    { a: "ombre:ombre", id: "whoosh_big/deep", gain: -7 },
    { a: "ombre:chambre", id: "pro_impact/deep", gain: -6 },
    { a: "escalier", id: "cut_hit/punch", gain: -8 },
    { a: "escalier:devalent", id: "whoosh_fast/heavy", gain: -10 },
    { a: "escalier:etages", id: "knock/wood", gain: -10 },
    { a: "pas", id: "cut_hit/sub", gain: -9 },
    { a: "pas+0.35", id: "knock/wood", gain: -8 },
    { a: "pas:pas", id: "knock/wood", gain: -7 },
    { a: "pas:accelerent", id: "pro_impact/deep", gain: -6 },
    // la rue
    { a: "rue", id: "cut_hit/punch", gain: -8 },
    { a: "rue:rue", id: "toggle/latch", gain: -8 },
    { a: "rue:froid", id: "pro_whoosh_big/windy", gain: -12 },
    { a: "n_17", id: "cut_hit/sub", gain: -11 },
    { a: "police", id: "cut_hit/punch", gain: -8 },
    { a: "police:voitures", id: "whoosh_big/swell", gain: -9 },
    { a: "police:voitures+0.8", id: "impact/deep", gain: -11 },
    { a: "sort", id: "cut_hit/sub", gain: -10 },
    { a: "sort:hall", id: "toggle/latch", gain: -8 },
    { a: "sort:policiers", id: "pro_impact/short", gain: -9 },
    { a: "poches", id: "cut_hit/punch", gain: -9 },
    { a: "poches:double", id: "tap/knuckle", gain: -7 },
    { a: "poches:cles", id: "pro_impact/deep", gain: -7 },
    { a: "juillet", id: "cut_hit/sub", gain: -11 },
    { a: "juillet:juillet", id: "pro_sub_drop/low", gain: -8 },
    { a: "numero", id: "cut_hit/punch", gain: -9 },
    { a: "numero:numero", id: "pro_impact/deep", gain: -6 },
    { a: "l_fuir", id: "cut_hit/sub", gain: -12 },
    { a: "n_courir", id: "cut_hit/sub", gain: -12 },
    { a: "l_menteur", id: "cut_hit/sub", gain: -12 },
    { a: "l_menteur:menteur", id: "swish/soft", gain: -12 },
    // le soir, la nuit
    { a: "serrure", id: "cut_hit/punch", gain: -9 },
    { a: "serrure:serrure", id: "toggle/latch", gain: -6 },
    { a: "serrure:changee", id: "click/thock", gain: -7 },
    { a: "nuit", id: "whoosh_big/swell", gain: -11 },
    { a: "nuit:12", id: "pro_sub_drop/low", gain: -7 },
    { a: "pose", id: "cut_hit/sub", gain: -10 },
    { a: "pose:telephone", id: "fit/land.light/finger_wood", gain: -9 },
    { a: "fin:fois", id: "reverse_swell/dark", gain: -10 },
    { a: "fin:pas", id: "pro_sub_drop/low", gain: -5 },
    // carton FIN
    { a: "fin+0.7", id: "impact/deep", gain: -8 },
    { a: "fin+0.9", id: "whoosh_fast/heavy", gain: -12 },
  ],
  ambiances: [
    { type: "drone", de: 0, a: "fin+6.2", niveau: -1 },
    { type: "coeur", de: 0, a: "rue", niveau: -3, bpm: 118 },
    { type: "grincement", de: "grince:sommier", a: "grince:sommier+1.0", niveau: -6, fondu: 0.15 },
    { type: "ville", de: "rue", a: "serrure", niveau: -5, fondu: 0.6 },
    { type: "coeur", de: "rue", a: "police", niveau: -6, bpm: 128 },
    { type: "ville", de: "serrure", a: "fin+6.2", niveau: -18, fondu: 1.0 },
  ],
  sujets: [
    { de: "hook", a: "hook2", point: SOUS_LIT },
    { de: "hook2", a: "rec1", personnage: "lea", hauteur: 1.0 },
    { de: "rec1", a: "rec2", personnage: "nathan", hauteur: 1.4 },
    { de: "doigt", a: "main", personnage: "nathan", hauteur: 1.4 },
    { de: "main", a: "l_quoi", personnage: "lea", hauteur: 1.4 },
    { de: "l_quoi", a: "ecran", personnage: "lea", hauteur: 1.4 },
    { de: "ecran", a: "ecran2", personnage: "nathan", hauteur: 1.4 },
    { de: "ecran2", a: "entree", personnage: "lea", hauteur: 1.4 },
    { de: "crochet", a: "verrou", point: CROCHET },
    { de: "verrou", a: "n_cles", point: VERROU },
    { de: "n_cles", a: "sac", personnage: "nathan", hauteur: 1.4 },
    { de: "tombe", a: "grince", point: TOMBE },
    { de: "l_vite", a: "tour", personnage: "lea", hauteur: 1.4 },
    { de: "tour", a: "ombre", point: VERROU },
    { de: "n_17", a: "police", personnage: "nathan-rue", hauteur: 1.4 },
    { de: "poches", a: "juillet", point: CAPOT },
    { de: "juillet", a: "numero", personnage: "lea-rue", hauteur: 1.4 },
    { de: "numero", a: "l_fuir", point: CAPOT },
    { de: "n_courir", a: "l_menteur", personnage: "nathan-rue", hauteur: 1.4 },
    { de: "l_menteur", a: "serrure", personnage: "lea-rue", hauteur: 1.4 },
    { de: "serrure", a: "nuit", point: VERROU },
    { de: "nuit", a: "pose", personnage: "nathan-nuit", hauteur: 1.0 },
    { de: "pose", a: "fin", point: TEL_NUIT },
  ],
};
