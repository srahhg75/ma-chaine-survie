import { OptionsPlan, plan } from "../../systeme/camera";
import { DonneesEpisode } from "../../systeme/episode";
import { Vec3 } from "../../systeme/maths";
import { LEA, NATHAN } from "./personnages";

/*
 * « Le dernier appel » — Partie 1 « 3 h 12 ». Script : videos/006-appel/script.txt (découpage : script.md).
 * Saison au style validé le 29/10 : personnages « adulte », image noir et blanc + rouge (`post.noirRouge`), SMS et
 * appels sur un grand écran de téléphone (HUD `telephone`). Histoire SANS conseils (ni tactique, ni fiche).
 * Un seul plateau : le salon du couple (3e étage), grande fenêtre au nord sur l'immeuble d'en face (Episode.tsx) ;
 * une fenêtre de l'immeuble d'en face s'allume en rouge (« un écran s'allume »). Retour en arrière « mardi » : Léa
 * rentre, son écharpe rouge, un paquet de cigarettes rouge dans la poche de son manteau.
 */
export const CANAPE: Vec3 = [-0.9, 0, -1.55];
export const TABLE_BASSE: Vec3 = [-0.9, 0, -0.35];
export const TELEPHONE_TABLE: Vec3 = [-0.72, 0.42, -0.3];
export const LAMPE: Vec3 = [-2.55, 0, -1.85];
export const PORTEMANTEAU: Vec3 = [2.72, 0, 0.75];
export const POCHE: Vec3 = [2.6, 1.0, 0.86]; // le paquet de cigarettes rouge dans la poche du manteau de Léa
export const FENETRE_ROUGE: Vec3 = [2.1, 1.55, -10.9]; // l'écran qui s'allume, au 3e de l'immeuble d'en face
export const FENETRE = { x: 0.3, largeur: 2.6, bas: 0.6, haut: 2.3, z: -2.3 };

const ASSIS = [-0.9, 0, -1.05] as Vec3; // assis au bord du canapé, face à la caméra
const VITRE = [0.75, 0, -1.85] as Vec3; // debout devant la fenêtre
const CENTRE = [0.05, 0, -0.25] as Vec3; // debout au milieu du salon (l'appel à Léa)
const LEA_P = [2.32, 0, 0.5] as Vec3; // Léa près du portemanteau (retour en arrière)

// Cadrages pour des personnages « adulte » (≈ 1,75 m) : cibles plus hautes que les figurines de H+72
const pied = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 0.9, p[2]], { azimut: az, elevation: 6, distance: 6.2, fov: 46, y: 700, ...o });
// (distances × 1,3 : personnage médian ≤ 35 % de la hauteur, analyse/cadrages.md)
const moyen = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 1.2, p[2]], { azimut: az, elevation: 4, fov: 42, y: 600, x: 640, ...o, distance: (o.distance ?? 5.6) * 1.4 });
const assis = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan([p[0], p[1] + 0.8, p[2]], { azimut: az, elevation: 6, distance: 5.6, fov: 42, y: 660, x: 640, ...o });
const objet = (p: Vec3, az: number, o: Partial<OptionsPlan> = {}) => plan(p, { azimut: az, elevation: 40, distance: 1.0, fov: 34, y: 520, ...o });

const MOI = "06 •• •• •• 27"; // son propre numéro

export const donnees: DonneesEpisode = {
  id: "006-appel",
  titre: "Le dernier appel — Partie 1 : 3 h 12",
  queue: 8.4, // le narrateur lit le choix A/B sur le carton (@carton1-4)
  post: { bloom: 0.35, seuilBloom: 0.85, vignette: 0.55, grain: 0.04, exposition: 1.2, noirRouge: 1 },
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
        // le palier derrière la porte d'entrée (une porte ne donne jamais sur le vide)
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
      { type: "canape", position: CANAPE, couleur: "#4a4a4e", id: "canape" },
      { type: "table", position: TABLE_BASSE, echelle: 0.55, couleur: "#3a2e24", id: "table-basse" },
      { type: "tapis", position: [-0.9, 0, -0.6], couleur: "#5a5a5e", echelle: 1.2 },
      { type: "carton", position: [1.95, 0, -1.95], id: "carton1" },
      { type: "carton", position: [2.45, 0, -1.6], rotation: 20, id: "carton2" },
      { type: "carton", position: [1.95, 0.36, -1.95], rotation: -10, echelle: 0.85, id: "carton3" },
      { type: "etagere", position: [-2.82, 0, 0.6], rotation: 90, couleur: "#3a2e24", id: "etagere" },
      // dessinés dans Episode.tsx : lampe sur pied, portemanteau
      { type: "chaise", position: LAMPE, echelle: 0.6, id: "lampe", invisible: true },
      { type: "chaise", position: PORTEMANTEAU, echelle: 0.7, id: "portemanteau", invisible: true },
    ],
    exterieur: { ville: { allumees: 0.04, distance: 30 }, neige: false, ciel: "nuit" },
  },
  personnages: [
    {
      // 3 h 12 : assis au bord du canapé, puis à la fenêtre ; il éteint, tire les rideaux, lit les SMS
      id: "nathan",
      voix: "Nathan",
      variante: "adulte",
      apparence: NATHAN,
      presence: { a: "mardi" },
      depart: { position: ASSIS, orientation: 0 },
      trajet: [
        { a: "fenetre+0.7", position: VITRE, orientation: 180, vitesse: 1.0, chemin: [[-0.9, 0, -0.8], [0.5, 0, -0.82]] },
        { a: "n_drole-0.1", position: [0.75, 0, -1.8], orientation: 20, vitesse: 0.4 },
        { a: "lumiere+0.2", position: VITRE, orientation: 180, vitesse: 0.4 },
        { a: "sms3", position: [0.75, 0, -1.78], orientation: 15, vitesse: 0.4 },
      ],
      poses: [
        { a: 0, pose: "assis" },
        { a: "sonne:sonne", pose: "assis" },
        { a: "n_allo-0.3", pose: "assisTelephone", transition: 0.3 },
        { a: "souffle.fin", pose: "assis", transition: 0.4 },
        { a: "sms+0.3", pose: "assisMain", transition: 0.3 },
        { a: "fenetre-1.1", pose: "debout", transition: 0.4 },
        { a: "lumiere", pose: "mainTendue", transition: 0.3 },
        { a: "lumiere.fin", pose: "debout", transition: 0.3 },
        { a: "sms3", pose: "mainTendue", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "sonne", expression: "surpris" },
        { a: "souffle", expression: "inquiet" },
        { a: "n_super", expression: "sourire" },
        { a: "sms2", expression: "surpris", transition: 0.2 },
        { a: "bleue", expression: "peur" },
        { a: "n_drole", expression: "peur" },
        { a: "sms4", expression: "inquiet" },
        { a: "sms5", expression: "colere", transition: 0.3 },
      ],
    },
    {
      // mardi, minuit : Léa rentre, accroche son manteau, se retourne (« le bureau »)
      id: "lea",
      voix: "Léa",
      variante: "adulte",
      apparence: LEA,
      presence: { de: "mardi", a: "appel" },
      depart: { position: LEA_P, orientation: 85 },
      trajet: [{ a: "mardi2+0.4", position: LEA_P, orientation: 318, vitesse: 0.4 }],
      poses: [
        { a: 0, pose: "mainTendue" },
        { a: "mardi2", pose: "debout", transition: 0.4 },
      ],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "mardi2", expression: "sourire" },
        { a: "mardi4", expression: "neutre" },
      ],
    },
    {
      // l'appel à Léa, puis la nuit debout face aux rideaux, puis le SMS de Sarah
      id: "nathan-nuit",
      voix: "Nathan",
      variante: "adulte",
      apparence: NATHAN,
      presence: { de: "appel" },
      depart: { position: CENTRE, orientation: 15 },
      trajet: [
        { a: "nuit+0.5", position: CENTRE, orientation: 178, vitesse: 0.4 },
        { a: "sarah", position: CENTRE, orientation: 12, vitesse: 0.4 },
      ],
      poses: [
        { a: 0, pose: "telephone" },
        { a: "raccroche", pose: "mainTendue", transition: 0.4 },
        { a: "nuit", pose: "debout", transition: 0.5 },
        { a: "matin+0.3", pose: "mainTendue", transition: 0.4 },
      ],
      expressions: [
        { a: 0, expression: "inquiet" },
        { a: "l_genie", expression: "sourire" },
        { a: "n_mardi", expression: "colere" },
        { a: "l_pourquoi", expression: "inquiet" },
        { a: "l_aime", expression: "triste" },
        { a: "sms6", expression: "peur" },
        { a: "nuit", expression: "fatigue" },
        { a: "sarah2", expression: "surpris", transition: 0.2 },
        { a: "fin", expression: "peur" },
      ],
    },
  ],
  camera: [
    // HOOK — le salon la nuit, la grande fenêtre, Nathan seul sur le canapé ; l'appel de son propre numéro
    { a: 0, ...plan([-0.4, 1.0, -1.1], { azimut: 10, elevation: 6, distance: 7.4, fov: 46, y: 720, x: 540 }) },
    { a: "hook2", ...assis(ASSIS, 6, { y: 520 }), deplacement: 1.2 },
    { a: "hook2:numero", ...assis(ASSIS, 2, { distance: 4.6, y: 520 }), deplacement: 0.8 },
    // mise en place : seul cette nuit ; l'écharpe rouge de Léa au portemanteau ; les cartons du déménagement
    { a: "ctx1", ...pied(ASSIS, -14, { y: 760 }), coupe: true },
    { a: "ctx1:seul", ...pied(ASSIS, -6, { distance: 5.6, y: 760 }), deplacement: 0.8 },
    { a: "ctx2", ...plan([PORTEMANTEAU[0] - 0.05, 1.35, PORTEMANTEAU[2]], { azimut: -62, elevation: 4, distance: 2.4, fov: 40, y: 640, x: 520 }), coupe: true },
    { a: "ctx2:copine", ...plan([PORTEMANTEAU[0] - 0.05, 1.35, PORTEMANTEAU[2]], { azimut: -54, elevation: 4, distance: 2.0, fov: 40, y: 640, x: 520 }), deplacement: 0.8 },
    { a: "ctx3", ...plan([2.15, 0.55, -1.75], { azimut: -28, elevation: 14, distance: 3.0, fov: 42, y: 700, x: 540 }), coupe: true },
    // l'appel : le téléphone vibre sur la table basse ; il décroche ; le souffle
    { a: "sonne", ...objet(TELEPHONE_TABLE, 20, { y: 420 }), coupe: true },
    { a: "n_allo", ...assis(ASSIS, 12, { y: 640 }), coupe: true },
    { a: "n_allo+1.4", ...assis(ASSIS, 6, { distance: 4.4, y: 640 }), deplacement: 0.8 },
    { a: "souffle", ...assis(ASSIS, 2, { distance: 4.2, y: 700 }), deplacement: 0.8 },
    { a: "n_super", ...pied(ASSIS, -10, { y: 760 }), deplacement: 0.8 },
    { a: "n_super:harcele", ...pied(ASSIS, -4, { distance: 5.4, y: 760 }), deplacement: 0.7 },
    // le SMS
    { a: "sms", ...assis(ASSIS, 10, { y: 520 }), coupe: true },
    { a: "sms2", ...assis(ASSIS, 4, { distance: 4.4, y: 500 }), deplacement: 0.7 },
    { a: "bleue", ...assis(ASSIS, 0, { distance: 3.8, y: 480 }), deplacement: 0.7 },
    // de profil, à la fenêtre : il regarde l'immeuble d'en face
    { a: "fenetre", ...plan([VITRE[0], 1.4, VITRE[2]], { azimut: 70, elevation: 4, distance: 1.9, fov: 60, y: 640, x: 420 }), coupe: true },
    // contrechamp : l'immeuble d'en face, l'écran qui s'allume au 3e
    { a: "lueur", ...plan(FENETRE_ROUGE, { azimut: -8, elevation: 0, distance: 9.4, fov: 36, y: 600, x: 540 }), coupe: true },
    { a: "eteint", ...plan(FENETRE_ROUGE, { azimut: -6, elevation: 0, distance: 9.0, fov: 34, y: 600, x: 540 }), deplacement: 0.6 },
    { a: "n_drole", ...moyen(VITRE, 14), coupe: true },
    { a: "lumiere", ...pied([0.6, 0, -1.6], 6), deplacement: 0.8 },
    { a: "sms3", ...moyen([0.75, 0, -1.78], 10, { y: 520 }), coupe: true },
    { a: "sms4", ...moyen([0.75, 0, -1.78], 4, { distance: 5.0, y: 500 }), deplacement: 0.6 },
    { a: "sms5", ...moyen([0.75, 0, -1.78], 0, { distance: 4.4, y: 480 }), deplacement: 0.8 },
    // MARDI (retour en arrière) : Léa rentre à minuit
    { a: "mardi", ...pied(LEA_P, -38, { y: 740 }), coupe: true },
    { a: "mardi2", ...moyen(LEA_P, -40), deplacement: 0.8 },
    { a: "mardi3", ...objet(POCHE, -14, { elevation: 10, distance: 1.6, y: 760 }), coupe: true },
    { a: "mardi4", ...moyen(LEA_P, -32, { distance: 4.6 }), coupe: true },
    // l'appel à Léa
    { a: "appel", ...moyen(CENTRE, 12, { y: 520 }), coupe: true },
    { a: "n_ou", ...moyen(CENTRE, 6, { distance: 5.2, y: 500 }), deplacement: 0.6 },
    { a: "l_sarah", ...moyen(CENTRE, 0, { distance: 5.0, y: 500 }), deplacement: 0.7 },
    { a: "n_chuchote", ...moyen(CENTRE, -8, { distance: 5.2, y: 500 }), deplacement: 0.7 },
    { a: "l_genie", ...moyen(CENTRE, 14, { distance: 4.8, y: 490 }), deplacement: 0.7 },
    { a: "n_mardi", ...moyen(CENTRE, 6, { distance: 3.2, y: 470 }), deplacement: 0.6 },
    { a: "silence", ...moyen(CENTRE, 2, { distance: 3.0, y: 470 }), deplacement: 0.6 },
    { a: "l_pourquoi", ...moyen(CENTRE, -12, { distance: 4.8, y: 480 }), deplacement: 0.7 },
    { a: "l_demain", ...moyen(CENTRE, 10, { distance: 4.6, y: 470 }), deplacement: 0.7 },
    { a: "l_aime", ...moyen(CENTRE, 4, { distance: 4.2, y: 470 }), deplacement: 0.6 },
    { a: "raccroche", ...pied(CENTRE, 4, { y: 760 }), coupe: true },
    { a: "sms6", ...moyen(CENTRE, 8, { distance: 5.0, y: 500 }), coupe: true },
    { a: "sms6:bonne", ...moyen(CENTRE, 2, { distance: 4.4, y: 490 }), deplacement: 0.6 },
    // la nuit face aux rideaux (caméra côté fenêtre), puis l'aube et le SMS de Sarah
    { a: "nuit", ...plan([CENTRE[0], 1.25, CENTRE[2]], { azimut: 168, elevation: 4, distance: 1.7, fov: 74, y: 640, x: 540 }), coupe: true },
    { a: "matin", ...pied(CENTRE, 6, { y: 760 }), coupe: true },
    { a: "matin:vibre", ...pied(CENTRE, 2, { distance: 5.6, y: 760 }), deplacement: 0.7 },
    { a: "sarah", ...moyen(CENTRE, 10, { distance: 5.0, y: 500 }), deplacement: 0.8 },
    { a: "sarah2", ...moyen(CENTRE, 4, { distance: 4.4, y: 490 }), deplacement: 0.7 },
    { a: "fin-0.4", ...moyen(CENTRE, 2, { distance: 3.3, y: 470 }), deplacement: 0.9 },
  ],
  hud: [
    { type: "telephone", de: "hook2", a: "ctx1-0.1", ecran: "appel", contact: "MOI", numero: MOI, heure: "03:12" },
    { type: "telephone", de: "sonne", a: "n_allo-0.1", ecran: "appel", contact: "MOI", numero: MOI, heure: "03:12" },
    { type: "telephone", de: "sms", a: "fenetre-0.1", ecran: "sms", contact: MOI, heure: "03:14", messages: [{ a: "sms2", texte: "Jolie chemise bleue, Nathan.", menace: true }] },
    {
      type: "telephone",
      de: "sms3",
      a: "mardi-0.1",
      ecran: "sms",
      contact: MOI,
      heure: "03:16",
      messages: [
        { a: "sms3", texte: "Jolie chemise bleue, Nathan.", menace: true },
        { a: "sms4", texte: "Tu crois la connaître ?", menace: true },
        { a: "sms5", texte: "Demande-lui où elle était mardi.", menace: true },
      ],
    },
    { type: "telephone", de: "appel", a: "raccroche-0.1", ecran: "appel", contact: "LÉA", heure: "03:17", enCours: true },
    {
      type: "telephone",
      de: "sms6",
      a: "nuit-0.1",
      ecran: "sms",
      contact: MOI,
      heure: "03:21",
      messages: [
        { a: "sms6-1", texte: "Demande-lui où elle était mardi.", menace: true },
        { a: "sms6:bonne", texte: "Bonne nuit, Nathan.", menace: true },
      ],
    },
    { type: "telephone", de: "matin+0.2", a: "fin+0.6", ecran: "sms", contact: "SARAH", heure: "07:02", messages: [{ a: "sarah2", texte: "Léa a dormi chez toi ?" }] },
    { type: "carton", de: "fin+0.7", partie: 2, titre: "Le dernier appel", verifie: "", question: "Léa a menti. Nathan…", choix: ["Fonce chez Sarah", "Fouille ses affaires"] },
  ],
  sons: [
    // hook : la vibration (tapotements rapides), l'appel
    { a: "hook2", id: "pro_impact/short", gain: -8 },
    { a: "hook2", id: "tap/table", gain: -9 },
    { a: "hook2+0.12", id: "tap/table", gain: -10 },
    { a: "hook2+0.24", id: "tap/table", gain: -9 },
    { a: "hook2:numero", id: "pro_sub_drop/low", gain: -7 },
    { a: "ctx1", id: "cut_hit/sub", gain: -10 },
    { a: "ctx2", id: "cut_hit/sub", gain: -11 },
    { a: "ctx2.fin-0.3", id: "swish/soft", gain: -12 },
    { a: "ctx3", id: "cut_hit/sub", gain: -11 },
    { a: "ctx3:ensemble", id: "tap/table", gain: -12 },
    { a: "sonne", id: "cut_hit/punch", gain: -8 },
    { a: "sonne:sonne", id: "tap/table", gain: -7 },
    { a: "sonne:sonne+0.12", id: "tap/table", gain: -8 },
    { a: "sonne:sonne+0.24", id: "tap/table", gain: -7 },
    { a: "sonne:sonne+0.6", id: "tap/table", gain: -8 },
    { a: "sonne:sonne+0.72", id: "tap/table", gain: -9 },
    { a: "sonne:lui", id: "pro_impact/short", gain: -9 },
    { a: "n_allo", id: "cut_hit/sub", gain: -11 },
    { a: "n_allo-0.2", id: "swipe/cloth", gain: -12 },
    { a: "souffle", id: "reverse_swell/breath", gain: -8 },
    { a: "souffle:raccroche", id: "click/thock", gain: -8 },
    { a: "n_super", id: "swish/soft", gain: -12 },
    { a: "sms", id: "cut_hit/sub", gain: -9 },
    { a: "sms:arrive", id: "tap/table", gain: -9 },
    { a: "sms2", id: "pro_impact/deep", gain: -6 },
    { a: "bleue", id: "pro_sub_drop/low", gain: -7 },
    { a: "fenetre", id: "whoosh_big/deep", gain: -9 },
    { a: "lueur", id: "cut_hit/sub", gain: -9 },
    { a: "lueur:allume", id: "pro_impact/deep", gain: -6 },
    { a: "eteint", id: "downlifter/sub_sink", gain: -9 },
    { a: "n_drole", id: "cut_hit/sub", gain: -10 },
    { a: "lumiere:lumiere", id: "fit/snap/switch_flip", gain: -6 },
    { a: "lumiere:rideaux", id: "swipe/cloth", gain: -7 },
    { a: "lumiere:rideaux+0.25", id: "swipe/cloth", gain: -8 },
    { a: "sms3", id: "tap/table", gain: -9 },
    { a: "sms4", id: "pro_impact/short", gain: -8 },
    { a: "sms5", id: "pro_impact/deep", gain: -6 },
    { a: "sms5:mardi", id: "pro_sub_drop/low", gain: -6 },
    // retour en arrière : mardi
    { a: "mardi", id: "reverse_swell/dark", gain: -7 },
    { a: "mardi", id: "cut_hit/punch", gain: -8 },
    { a: "mardi:minuit", id: "toggle/latch", gain: -8 },
    { a: "mardi2", id: "swipe/cloth", gain: -11 },
    { a: "mardi3", id: "cut_hit/sub", gain: -9 },
    { a: "mardi3:cigarette", id: "pro_impact/short", gain: -8 },
    { a: "mardi4", id: "pro_sub_drop/low", gain: -6 },
    // l'appel à Léa
    { a: "appel", id: "reverse_swell/dark", gain: -9 },
    { a: "appel+0.15", id: "cut_hit/punch", gain: -9 },
    { a: "n_chuchote", id: "swish/soft", gain: -13 },
    { a: "n_mardi", id: "pro_impact/short", gain: -9 },
    { a: "silence", id: "riser/tension", gain: -12 },
    { a: "l_demain", id: "swish/soft", gain: -13 },
    { a: "raccroche", id: "click/thock", gain: -6 },
    { a: "sms6", id: "tap/table", gain: -8 },
    { a: "sms6:bonne", id: "pro_impact/deep", gain: -6 },
    { a: "nuit", id: "whoosh_big/swell", gain: -11 },
    { a: "matin", id: "cut_hit/sub", gain: -9 },
    { a: "matin:vibre", id: "tap/table", gain: -7 },
    { a: "matin:vibre+0.12", id: "tap/table", gain: -8 },
    { a: "matin:vibre+0.24", id: "tap/table", gain: -7 },
    { a: "sarah2", id: "pro_impact/short", gain: -8 },
    { a: "fin", id: "pro_sub_drop/low", gain: -4 },
    // carton à choix
    { a: "fin+0.7", id: "impact/deep", gain: -8 },
    { a: "fin+0.9", id: "whoosh_fast/heavy", gain: -9 },
    { a: "fin+1.23", id: "cut_hit/punch", gain: -6 },
    { a: "fin+1.4", id: "cut_hit/sub", gain: -5 },
  ],
  ambiances: [
    { type: "drone", de: 0, a: "fin+8.4", niveau: -1 },
    { type: "vent", de: 0, a: "matin", niveau: -6, fondu: 1.5 },
    { type: "ville", de: "fenetre", a: "lumiere", niveau: -3, fondu: 0.8 },
    { type: "coeur", de: "sms2", a: "mardi", niveau: -1, bpm: 96 },
    { type: "coeur", de: "n_mardi", a: "raccroche", niveau: -2, bpm: 104 },
    { type: "coeur", de: "sarah2", a: "fin+8.4", niveau: -1, bpm: 110 },
  ],
  sujets: [
    { de: 0, a: "hook2", personnage: "nathan", hauteur: 1.2 },
    { de: "ctx1", a: "ctx2", personnage: "nathan", hauteur: 1.2 },
    { de: "ctx2", a: "ctx3", point: [PORTEMANTEAU[0] - 0.05, 1.35, PORTEMANTEAU[2]] },
    { de: "n_allo", a: "sms", personnage: "nathan", hauteur: 1.2 },
    { de: "fenetre+0.7", a: "lueur", personnage: "nathan", hauteur: 1.4 },
    { de: "lueur", a: "n_drole", point: FENETRE_ROUGE },
    { de: "n_drole", a: "sms3", personnage: "nathan", hauteur: 1.5 },
    { de: "mardi", a: "mardi3", personnage: "lea", hauteur: 1.5 },
    { de: "mardi3", a: "mardi4", point: POCHE },
    { de: "mardi4", a: "appel", personnage: "lea", hauteur: 1.5 },
    { de: "raccroche", a: "sms6", personnage: "nathan-nuit", hauteur: 1.5 },
    { de: "nuit", a: "matin", personnage: "nathan-nuit", hauteur: 1.5 },
  ],
};
