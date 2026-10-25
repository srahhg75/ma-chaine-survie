import { plan } from "../../systeme/camera";
import { DonneesEpisode } from "../../systeme/episode";
import { Vec3 } from "../../systeme/maths";
import { APPARENCE_INES, APPARENCE_MOREL } from "../../systeme/personnage/apparence";

/*
 * H+72 — Partie 3 « La lampe qui suit ». Script : videos/003-h72-lampe/script.txt (découpage : script.md).
 * Un seul plateau : la CAGE D'ESCALIER de l'immeuble en coupe, du 4e jusqu'à la porte du toit (dessinée dans
 * Episode.tsx, sans `pieces` : le décor en données ne connaît qu'un seul étage). Vue de face (caméra au sud) :
 *  - paliers à GAUCHE (x −1,8 → 0) au 4e, au 6e (porte d'Inès, mur du fond) et au toit (porte du toit) ;
 *  - paliers à DROITE (x 3,6 → 5,4) au 5e (porte de Morel, mur est) et au 7e (porte des voisins, mur est) ;
 *  - entre les deux, une volée droite de 18 marches par étage, alternativement au fond (z −1) et devant (z 0,1).
 * Inès : « ines6 » jusqu'à 23 h (elle guette devant sa porte), puis « ines » après la coupe (même tenue, même voix).
 * L'inconnu n'est jamais montré : un personnage invisible dont on ne dessine que la lampe (et dont on entend les pas).
 */
export const H = 2.88; // hauteur d'un étage
export const NIV = { e4: 0, e5: H, e6: 2 * H, e7: 3 * H, toit: 4 * H };
export const ZF = -1.0; // volée du fond
export const ZA = 0.1; // volée de devant

// Point d'une volée (u = 0 en bas, 1 en haut). Volées montant vers l'est (fond) ou vers l'ouest (devant).
export const volee = (bas: number, versEst: boolean, u: number): Vec3 => {
  const x = versEst ? 3.6 * u : 3.6 * (1 - u);
  return [x, bas + H * u, versEst ? ZF : ZA];
};

export const P = {
  porteInes: [-0.9, NIV.e6, -1.6] as Vec3, // mur du fond du palier du 6e (gauche)
  verrouInes: [-0.55, NIV.e6 + 1.02, -1.53] as Vec3,
  porteMorel: [5.4, NIV.e5, -0.6] as Vec3, // mur est du palier du 5e (droite)
  porte7: [5.4, NIV.e7, -0.5] as Vec3, // voisins du 7e (mur est), bougies derrière
  seuil7: [5.3, NIV.e7 + 0.05, -0.5] as Vec3,
  porteToit: [-0.9, NIV.toit, -1.6] as Vec3,
  lampeToit: [-0.9, NIV.toit + 1.45, -2.05] as Vec3,
  fenetre6: [1.8, NIV.e6 + 1.95, -1.6] as Vec3, // fenêtre de l'escalier (mi-étage), la ville derrière
  lampe4: [-0.5, NIV.e4 + 1.0, -0.2] as Vec3, // la lampe de l'inconnu, au 4e
  lampe6: [-0.35, NIV.e6 + 1.0, -0.1] as Vec3, // la lampe de l'inconnu, arrivé au 6e
  bidonsMorel: [6.3, NIV.e5 + 0.25, -1.35] as Vec3,
};

// Places
const PORTE6 = [-1.5, NIV.e6, -0.95] as Vec3; // Inès à côté de sa porte (6e), côté charnière : la serrure reste visible
const GUET6 = [-1.5, NIV.e6, -1.2] as Vec3; // accroupie contre sa porte, face à l'escalier
const PALIER5 = [4.85, NIV.e5, -0.5] as Vec3; // Inès devant la porte de Morel
const MOREL = [5.62, NIV.e5, -0.6] as Vec3; // Morel dans son entrée, porte entrouverte
const PALIER7 = [4.8, NIV.e7, -0.5] as Vec3; // Inès devant la porte des voisins (7e)
const INC4 = [-0.6, NIV.e4, -0.3] as Vec3; // l'inconnu au 4e
const INC5 = [4.3, NIV.e5, 0.15] as Vec3; // l'inconnu au 5e (palier de Morel, côté escalier)
const INC6 = [-0.45, NIV.e6, -0.05] as Vec3; // l'inconnu au 6e

// Cadrages types (personnages « humain » ≈ 1,4 m) ; p = position des pieds (y = étage)
type Opt = { azimut?: number; elevation?: number; distance?: number; fov?: number; x?: number; y?: number };
const buste = (p: Vec3, az: number, op: Opt = {}) => plan([p[0], p[1] + 1.12, p[2]], { azimut: az, elevation: 6, distance: 2.7, fov: 36, y: 590, ...op });
const enPied = (p: Vec3, az: number, op: Opt = {}) => plan([p[0], p[1] + 0.7, p[2]], { azimut: az, elevation: 14, distance: 4.8, fov: 40, y: 640, ...op });
const aDeux = (a: Vec3, b: Vec3, az: number, op: Opt = {}) =>
  plan([(a[0] + b[0]) / 2, a[1] + 0.78, (a[2] + b[2]) / 2], { azimut: az, elevation: 9, distance: 4.9, fov: 40, y: 660, ...op });

const INES6 = "ines6";
const INES = "ines";
const INCONNU = "inconnu";

export const donnees: DonneesEpisode = {
  id: "003-h72-lampe",
  titre: "H+72 — Partie 3 : La lampe qui suit",
  queue: 9.4, // le narrateur lit le choix A/B sur le carton (@carton1-4)
  post: { bloom: 0.38, seuilBloom: 0.86, vignette: 0.64, grain: 0.03, exposition: 0.9 }, // nuit sans courant
  retours: [{ de: "a2.fin", a: "stop:elle" }],
  decor: {
    pieces: [],
    meubles: [],
    exterieur: { ville: { allumees: 0, distance: 13 }, neige: { densite: 0.7, vent: 0.35 }, ciel: "nuit" },
  },
  personnages: [
    {
      // Inès au 6e, de 18 h (raccord avec la fin de la partie 2) jusqu'à la coupe de 23 h
      id: INES6,
      voix: "Inès",
      variante: "humain",
      apparence: { ...APPARENCE_INES, bonnet: "#c9a227" },
      presence: { a: "morel" },
      depart: { position: PORTE6, orientation: 10 },
      trajet: [
        // B : elle reste ; elle s'accroupit contre sa porte, lampe éteinte, et guette l'escalier
        { a: "stop:reste", position: GUET6, orientation: 20, vitesse: 0.8 },
      ],
      poses: [
        { a: 0, pose: "debout" },
        { a: "hook:lampe", pose: "inquiet", transition: 0.4 },
        { a: "recap2", pose: "debout", transition: 0.4 },
        { a: "stop:reste", pose: "accroupi", transition: 0.5 },
      ],
      expressions: [
        { a: 0, expression: "inquiet" },
        { a: "hook:lampe", expression: "peur", transition: 0.3 },
        { a: "recap2", expression: "colere" },
        { a: "a1", expression: "inquiet" },
        { a: "stop:elle", expression: "decide", transition: 0.2 },
      ],
      lampe: { de: 0, a: "stop:reste", puissance: 0.07 },
    },
    {
      // Fantôme de la branche A : elle part à sa garde (elle descend l'escalier)
      id: "fantome-part",
      variante: "humain",
      apparence: { ...APPARENCE_INES, bonnet: "#c9a227", sac: "#3a3a3a" },
      depart: { position: PORTE6, orientation: 10 },
      trajet: [{ a: "a1.fin+0.3", position: volee(NIV.e5, false, 0.75), vitesse: 1.2, chemin: [[0.1, NIV.e6, ZA]] }],
      fantome: { de: "a1", a: "a2:revient" },
    },
    {
      // Inès après 23 h : elle descend chez Morel, remonte avec le bidon, passe devant sa porte, file au 7e
      id: INES,
      voix: "Inès",
      variante: "humain",
      apparence: { ...APPARENCE_INES, bonnet: "#c9a227" },
      presence: { de: "morel" },
      depart: { position: volee(NIV.e5, false, 0.5), orientation: 100 },
      trajet: [
        { a: "i_eau", position: PALIER5, orientation: 60, vitesse: 1.1, chemin: [volee(NIV.e5, false, 0)] },
        // elle remonte avec ses 20 kg : lentement, sans s'arrêter, jusqu'au 6e…
        { a: "t1c", position: volee(NIV.e5, false, 1), vitesse: 0.62, chemin: [[3.95, NIV.e5, ZA]] },
        // …passe devant sa porte sans ralentir et continue jusqu'au 7e
        { a: "t2b:palier", position: PALIER7, orientation: 90, vitesse: 0.85, chemin: [[-0.4, NIV.e6, -0.45], volee(NIV.e6, true, 0), volee(NIV.e6, true, 1), [4.1, NIV.e7, -0.75]] },
        // au téléphone, puis face à nous jusqu'à la fin (entre les deux lampes)
        { a: "t3a", position: PALIER7, orientation: 30, vitesse: 1.0 },
        { a: "signal", position: PALIER7, orientation: 15, vitesse: 1.0 },
      ],
      poses: [
        { a: 0, pose: "debout" },
        { a: "i_genereux", pose: "bras", transition: 0.3 },
        { a: "i_genereux.fin", pose: "debout", transition: 0.3 },
        { a: "i_rat-0.25", pose: "accroupi", transition: 0.3 },
        { a: "i_rat.fin+0.15", pose: "debout", transition: 0.35 },
        { a: "t2c:frappe-0.15", pose: "frappe", transition: 0.15 },
        { a: "t2c.fin", pose: "debout", transition: 0.3 },
        { a: "t3:appelez", pose: "telephone", transition: 0.3 },
        { a: "calme", pose: "inquiet", transition: 0.3 },
        { a: "i_ouf", pose: "debout", transition: 0.4 },
        { a: "toit:porte", pose: "inquiet", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "decide" },
        { a: "i_eau", expression: "decide" },
        { a: "m_bidon", expression: "surpris", transition: 0.2 },
        { a: "i_genereux", expression: "fatigue" },
        { a: "i_rat", expression: "colere" },
        { a: "lampe:allume", expression: "inquiet", transition: 0.2 },
        { a: "monte", expression: "peur" },
        { a: "i_continue", expression: "peur" },
        { a: "t2", expression: "decide" },
        { a: "calme", expression: "inquiet" },
        { a: "i_ouf", expression: "soulage", transition: 0.4 },
        { a: "signal", expression: "inquiet", transition: 0.2 },
        { a: "toit:grince", expression: "peur", transition: 0.15 },
      ],
      // lampe chaude, éteinte au 7e pendant l'appel (on ne se signale pas)
      lampe: { de: "i_rat.fin+0.3", a: "t3:appelez", puissance: 0.07 },
    },
    {
      // Fantôme du mauvais réflexe (tactique 1) : elle s'arrête devant sa porte, clés en main
      id: "fantome-cles",
      variante: "humain",
      apparence: { ...APPARENCE_INES, bonnet: "#c9a227" },
      depart: { position: [-0.95, NIV.e6, -1.05], orientation: 160 },
      poses: [{ a: 0, pose: "mainTendue" }],
      fantome: { de: "t1a", a: "t1b.fin+0.2" },
    },
    {
      id: "morel",
      voix: "Morel",
      variante: "humain",
      apparence: APPARENCE_MOREL,
      presence: { de: "recap3", a: "lampe" },
      depart: { position: MOREL, orientation: 300 },
      poses: [
        { a: 0, pose: "debout" },
        { a: "m_bidon", pose: "bras", transition: 0.25 },
        { a: "m_bidon.fin", pose: "debout", transition: 0.3 },
      ],
      expressions: [
        { a: 0, expression: "fatigue" },
        { a: "m_bidon", expression: "decide" },
        { a: "m_remontee", expression: "sourire" },
        { a: "i_rat", expression: "surpris", transition: 0.15 },
        { a: "m_plaisir", expression: "sourire" },
      ],
    },
    {
      // L'inconnu : jamais montré. Sa lampe et ses pas, toujours un étage sous Inès.
      id: INCONNU,
      invisible: true,
      depart: { position: INC4, orientation: 40 },
      trajet: [
        { a: "t1b.fin", position: INC5, vitesse: 0.8, chemin: [[0, NIV.e4, ZF], [3.6, NIV.e5, ZF], [4.2, NIV.e5, -0.5]] },
        { a: "t3", position: INC6, vitesse: 0.8, chemin: [volee(NIV.e5, false, 0), volee(NIV.e5, false, 1)] },
        // la lampe s'éteint ; les pas redescendent
        { a: "rappel+0.6", position: [4.2, NIV.e5, -0.3], vitesse: 1.4, chemin: [volee(NIV.e5, false, 1), volee(NIV.e5, false, 0)] },
      ],
    },
  ],
  camera: [
    // HOOK — raccord : Inès devant sa porte au 6e, clé en main ; puis plongée dans la cage vers la lampe du 4e
    { a: 0, ...buste(PORTE6, 8, { distance: 2.5 }) },
    { a: "hook:lampe", ...plan(P.lampe4, { azimut: 12, elevation: 50, distance: 7.6, fov: 44, y: 760, x: 500 }), deplacement: 1.0 },
    { a: "hook2:jamais", ...plan(P.lampe4, { azimut: 8, elevation: 46, distance: 6.6, fov: 44, y: 760, x: 520 }), deplacement: 0.9 },
    // RÉCAP — la fenêtre de l'escalier (ville noire), la porte d'Inès, la porte de Morel, la serrure
    // (Inès devant sa porte et la fenêtre de l'escalier : la ville noire derrière)
    { a: "recap1:4", ...plan([0.15, NIV.e6 + 1.3, -0.8], { azimut: 4, elevation: 6, distance: 11.4, fov: 42, y: 600, x: 540 }), deplacement: 1.0 },
    { a: "recap3:revend", ...plan([5.96, NIV.e5 + 0.9, -0.8], { azimut: 4, elevation: 10, distance: 5.4, fov: 40, y: 620, x: 520 }), deplacement: 0.9 },
    { a: "recap4", ...plan(P.verrouInes, { azimut: 14, elevation: 6, distance: 1.4, fov: 34, y: 620, x: 520 }), deplacement: 0.8 },
    // A (fantôme) : elle part ; il revient et vide tout
    { a: "a1.fin", ...plan([-0.5, NIV.e6 + 0.5, -0.6], { azimut: 10, elevation: 20, distance: 6.0, fov: 44, y: 660 }), deplacement: 0.8 },
    // STOP → B : elle reste, accroupie contre sa porte
    { a: "stop:elle", ...plan([GUET6[0], NIV.e6 + 0.75, GUET6[2]], { azimut: 10, elevation: 8, distance: 3.4, fov: 38, y: 680, x: 500 }), coupe: true },
    // 23 h : elle descend chez Morel
    { a: "morel", ...plan([2.6, NIV.e5 + 1.3, 0.0], { azimut: 6, elevation: 10, distance: 5.0, fov: 42, y: 640 }), coupe: true },
    { a: "i_eau", ...aDeux(PALIER5, MOREL, 0, { x: 470 }), deplacement: 1.0 },
    { a: "i_genereux", ...aDeux(PALIER5, MOREL, -12, { distance: 4.3, x: 540 }), deplacement: 0.6 },
    { a: "m_remontee", ...aDeux(PALIER5, MOREL, 12, { distance: 4.3, x: 440 }), deplacement: 0.6 },
    { a: "i_rat", ...aDeux(PALIER5, MOREL, -4, { distance: 4.8, x: 470, elevation: 14, y: 900 }), deplacement: 0.6 },
    // la lampe : plan d'ensemble de la cage (4e et 5e)
    { a: "lampe", ...plan([2.2, NIV.e4 + 2.6, -0.4], { azimut: 0, elevation: 8, distance: 17, fov: 44, y: 700, x: 480 }), deplacement: 1.2 },
    { a: "monte.fin", ...plan([2.0, NIV.e4 + 2.2, -0.4], { azimut: 0, elevation: 6, distance: 15.0, fov: 44, y: 640, x: 480 }), deplacement: 1.1 },
    { a: "derriere.fin", ...plan([2.0, NIV.e4 + 3.0, -0.4], { azimut: 4, elevation: 8, distance: 12.5, fov: 44, y: 620, x: 480 }), deplacement: 1.0 },
    // TACTIQUE 1 — sa porte ; le fantôme s'y arrête, la lampe se pose dessus ; elle passe devant
    { a: "t1:rentrez", ...plan([-0.3, NIV.e6 + 0.9, -0.7], { azimut: 12, elevation: 14, distance: 5.2, fov: 42, y: 620 }), deplacement: 1.0 },
    { a: "t1a:main", ...plan([-0.6, NIV.e6 + 0.9, -1.0], { azimut: 16, elevation: 12, distance: 4.4, fov: 40, y: 620, x: 520 }), deplacement: 0.6 },
    { a: "t1c", ...plan([-0.2, NIV.e6 + 1.0, -0.5], { azimut: 8, elevation: 10, distance: 6.2, fov: 42, y: 640 }), deplacement: 0.8 },
    // « Continue. Ne te retourne pas. » : elle monte la volée du fond, de trois-quarts
    { a: "i_continue", ...plan([0.7, NIV.e6 + 1.5, ZF], { azimut: 28, elevation: 6, distance: 4.4, fov: 40, y: 640, x: 520 }), deplacement: 0.8 },
    // TACTIQUE 2 — le 7e : bougies, voix, elle frappe
    { a: "t2:allez", ...plan([4.6, NIV.e7 + 0.9, -0.5], { azimut: -22, elevation: 12, distance: 5.0, fov: 42, y: 640 }), deplacement: 1.0 },
    { a: "t2a:bougies", ...plan(P.seuil7, { azimut: -48, elevation: 16, distance: 2.6, fov: 38, y: 680 }), deplacement: 0.9 },
    { a: "t2b:palier", ...enPied(PALIER7, -18, { distance: 4.8, x: 460 }), deplacement: 0.9 },
    { a: "t2c:frappe", ...enPied(PALIER7, -6, { distance: 4.0, x: 440 }), deplacement: 0.6 },
    // TACTIQUE 3 — le 17
    { a: "t3:appelez", ...buste(PALIER7, -16, { x: 620, y: 760, distance: 3.0 }), deplacement: 0.8 },
    { a: "i_17", ...buste(PALIER7, -10, { distance: 2.6, x: 620, y: 760 }), deplacement: 0.8 },
    // FAUSSE SÉCURITÉ — en bas, la lampe s'éteint, les pas redescendent
    { a: "calme:lampe", ...plan(P.lampe6, { azimut: 14, elevation: 40, distance: 5.4, fov: 42, y: 700 }), deplacement: 1.0 },
    { a: "i_ouf", ...buste(PALIER7, -12, { x: 440 }), deplacement: 1.0 },
    // TWIST — rappel des 2 éclats (même cadre qu'à 34 s), la porte du toit, la réponse
    { a: "rappel", ...plan(P.lampe4, { azimut: 10, elevation: 12, distance: 4.4, fov: 40, y: 660 }), coupe: true },
    { a: "signal", ...buste(PALIER7, -12, { distance: 2.4, x: 440 }), coupe: true },
    { a: "toit:porte", ...plan([-0.9, NIV.toit + 1.1, -1.6], { azimut: 14, elevation: 4, distance: 4.4, fov: 40, y: 620 }), deplacement: 1.4 },
    { a: "reponse", ...plan([-0.9, NIV.toit + 1.25, -1.7], { azimut: 10, elevation: 3, distance: 3.6, fov: 40, y: 620 }), deplacement: 0.6 },
    // « Ils sont deux. » : toute la cage, Inès entre les deux lampes ; puis son visage
    { a: "deux:deux", ...plan([1.9, 8.45, -0.4], { azimut: 0, elevation: 4, distance: 20, fov: 46, y: 860, x: 540 }), deplacement: 0.85 },
    { a: "fin+0.6", ...buste(PALIER7, -8, { distance: 2.4, x: 440 }), deplacement: 0.9 },
  ],
  hud: [
    {
      type: "montre",
      a: "fin+0.7",
      jour: 4,
      heure: "18:00",
      temperature: 10,
      changements: [{ a: "morel", heure: "23:00", temperature: 9 }],
    },
    { type: "fiche", de: "recap2", a: "recap3:revend", icone: "eau", titre: "Ballon d'Inès", lignes: ["0 litre", "Vidé pendant sa garde"], cote: "droite" },
    { type: "fiche", de: "recap3:revend", a: "recap4", icone: "jerrican", titre: "Marché noir", lignes: ["20 € le bidon", "Son eau à elle"], cote: "gauche" },
    { type: "etiquette", de: "recap4+0.05", a: "a1.fin-0.85", texte: "Il a la clé", point: P.verrouInes, style: "danger" },
    { type: "inventaire", de: "a1", a: "a2:vide", objets: [{ icone: "eau", quantite: 9, unite: "L" }, { icone: "conserve", quantite: 6 }] },
    { type: "inventaire", de: "a2:vide", a: "stop:elle", objets: [{ icone: "eau", quantite: 0, unite: "L" }, { icone: "conserve", quantite: 0 }], surligne: 0 },
    { type: "fiche", de: "i_rat", a: "lampe", icone: "jerrican", titre: "1 bidon", lignes: ["20 litres", "= 20 kilos"], cote: "droite" },
    { type: "etiquette", de: "eclats", a: "monte.fin-1.15", texte: "2 éclats", point: P.lampe4, style: "danger" },
    { type: "moodles", de: "monte", a: "t1", moodles: [{ nom: "panique", niveau: 2 }] },
    { type: "tactique", de: "t1", a: "i_continue", numero: 1, total: 3, titre: "Ne rentrez pas" },
    { type: "etiquette", de: "t1a:main", a: "t1c-0.85", texte: "Son adresse", point: [-0.9, NIV.e6 + 1.5, -1.55], style: "danger" },
    { type: "moodles", de: "i_continue", a: "t2", moodles: [{ nom: "panique", niveau: 3 }] },
    { type: "tactique", de: "t2", a: "t3", numero: 2, total: 3, titre: "Allez vers les gens" },
    { type: "tactique", de: "t3", a: "calme", numero: 3, total: 3, titre: "Appelez le 17" },
    { type: "fiche", de: "t3a", a: "i_17:suit", icone: "telephone", titre: "Appel 17", lignes: ["Adresse · 7e étage", "Quelqu'un me suit"], cote: "gauche" },
    { type: "moodles", de: "i_17:suit", a: "calme", moodles: [{ nom: "panique", niveau: 4 }] },
    { type: "moodles", de: "pas", a: "i_ouf.fin", moodles: [{ nom: "panique", niveau: 1 }] },
    { type: "etiquette", de: "reponse", a: "deux:deux-0.9", texte: "2 éclats", point: P.lampeToit, style: "danger" },
    { type: "carton", de: "fin+0.7", partie: 4, titre: "Le conseil de l'immeuble", verifie: "25/10/2026", question: "Entre deux lampes, Inès…", choix: ["Crie pour réveiller l'immeuble", "Éteint sa lampe et se tait"] },
  ],
  sons: [
    // ---- transitions et moments forts ----
    { a: "hook:lampe", id: "whoosh_big/deep", gain: -9 },
    { a: "hook2:jamais", id: "pro_impact/deep", gain: -8 },
    { a: "recap1:4", id: "whoosh_big/swell", gain: -9 },
    { a: "recap2:quelqu'un", id: "cut_hit/sub", gain: -10 },
    { a: "recap3:revend", id: "whoosh_fast/heavy", gain: -11 },
    { a: "recap4:cles", id: "pro_impact/short", gain: -8 },
    { a: "a1", id: "reverse_swell/dark", gain: -9 },
    { a: "a2:vide", id: "pro_sub_drop/low", gain: -5 },
    { a: "a2.fin+0.05", id: "whoosh_big/reverse", gain: -6 },
    { a: "stop", id: "cut_hit/punch", gain: -5 },
    { a: "stop:elle", id: "downlifter/tape", gain: -9 },
    { a: "morel", id: "cut_hit/sub", gain: -8 },
    { a: "i_eau", id: "whoosh_fast/heavy", gain: -13 },
    { a: "lampe:allume", id: "pro_impact/deep", gain: -6 },
    { a: "monte:monte", id: "riser/tension", gain: -12 },
    { a: "t1", id: "pro_impact/short", gain: -9 },
    { a: "t1a", id: "reverse_swell/dark", gain: -9 },
    { a: "t1c:ralentir", id: "whoosh_fast/heavy", gain: -13 },
    { a: "t2", id: "pro_impact/short", gain: -9 },
    { a: "t3", id: "pro_impact/short", gain: -9 },
    { a: "calme:eteint", id: "downlifter/air_fall", gain: -9 },
    { a: "i_ouf", id: "whoosh_big/deep", gain: -12 },
    { a: "rappel", id: "reverse_swell/dark", gain: -8 },
    { a: "signal:signal", id: "pro_impact/deep", gain: -6 },
    { a: "toit:porte", id: "whoosh_big/gust", gain: -11 },
    { a: "deux:deux", id: "pro_sub_drop/low", gain: -4 },
    { a: "fin", id: "whoosh_big/thump_deep", gain: -8 },
    { a: "fin+0.7", id: "impact/deep", gain: -8 },
    { a: "fin+0.9", id: "whoosh_fast/heavy", gain: -9 },
    { a: "fin+1.23", id: "cut_hit/punch", gain: -6 },
    { a: "fin+1.4", id: "cut_hit/sub", gain: -5 },
    // ---- bruitages d'objets ----
    { a: "hook", id: "toggle/latch", gain: -11 },
    { a: "recap4:cles", id: "toggle/latch", gain: -8 },
    { a: "stop:reste", id: "swish/soft", gain: -10 },
    { a: "i_eau-0.3", id: "toggle/latch", gain: -11 },
    { a: "m_bidon:bidon", id: "tap/table", gain: -8 },
    { a: "i_rat", id: "swish/soft", gain: -9 },
    { a: "i_rat.fin", id: "tap/table", gain: -10 },
    { a: "lampe:allume", id: "click/thock", gain: -8 },
    { a: "eclats:2", id: "click/thock", gain: -6 },
    { a: "eclats:2+0.3", id: "click/thock", gain: -6 },
    { a: "t1a:main", id: "toggle/latch", gain: -9 },
    { a: "t1a:porte", id: "tap/knuckle", gain: -10 },
    { a: "t2a:voix", id: "pro_tap/soft", gain: -12 },
    { a: "t2c:frappe", id: "knock/wood", gain: -4 },
    { a: "t2c:frappe+0.22", id: "knock/wood", gain: -4 },
    { a: "t2c:fort", id: "knock/wood", gain: -2 },
    { a: "t3:appelez", id: "click/thock", gain: -10 },
    { a: "calme:eteint", id: "click/thock", gain: -7 },
    { a: "reponse:repond", id: "click/thock", gain: -6 },
    { a: "reponse:2", id: "click/thock", gain: -6 },
    { a: "reponse:2+0.3", id: "click/thock", gain: -6 },
    { a: "deux", id: "click/thock", gain: -9 },
  ],
  ambiances: [
    { type: "drone", de: 0, a: "fin+9.4", niveau: -1 },
    { type: "vent", de: 0, a: "fin+9.4", niveau: -4, fondu: 1.5 },
    { type: "ville", de: "recap1", a: "recap2", niveau: 0, fondu: 0.6 },
    { type: "coeur", de: "monte", a: "i_ouf", niveau: -2, bpm: 96 },
    { type: "coeur", de: "signal", a: "fin+9.4", niveau: -1, bpm: 104 },
    { type: "grincement", de: "a2:revient", a: "a2:vide", niveau: -6, fondu: 0.1 },
    { type: "grincement", de: "toit:porte", a: "toit:grince+0.4", niveau: -3, fondu: 0.1 },
    // vent froid qui entre par la porte du toit
    { type: "vent", de: "toit:grince", a: "fin+9.4", niveau: -2, fondu: 0.8 },
  ],
  sujets: [
    { de: 0, a: "hook:lampe-1.0", personnage: INES6, hauteur: 1.1 },
    { de: "hook:lampe", a: "recap1:4-1.0", point: P.lampe4 },
    { de: "recap1:4", a: "recap3:revend-0.9", personnage: INES6, hauteur: 1.0 },
    { de: "recap4", a: "a1.fin-0.8", point: P.verrouInes },
    { de: "stop:elle", a: "morel", personnage: INES6, hauteur: 0.75 },
    { de: "i_eau", a: "lampe-1.2", personnage: INES, hauteur: 1.1 },
    { de: "i_eau", a: "lampe-1.2", personnage: "morel", hauteur: 1.1 },
    { de: "lampe", a: "monte.fin-1.1", point: P.lampe4 },
    { de: "t2b:palier", a: "calme:lampe-1.0", personnage: INES, hauteur: 1.1 },
    { de: "calme:lampe", a: "i_ouf-1.0", point: P.lampe6 },
    { de: "i_ouf", a: "rappel", personnage: INES, hauteur: 1.1 },
    { de: "signal", a: "toit:porte-1.4", personnage: INES, hauteur: 1.1 },
    { de: "toit:porte", a: "deux:deux-0.9", point: P.lampeToit },
    { de: "fin+0.6", a: "fin+0.7", personnage: INES, hauteur: 1.1 },
  ],
};
