// Poses du personnage, en degrés (données pures : utilisées par le rendu ET le contrôle qualité).
// Conventions : le personnage regarde vers +Z. Angles « vers l'avant » positifs.
export type Pose = {
  tronc: [number, number, number]; // penché en avant, rotation, penché sur le côté
  tete: [number, number]; // baisse la tête (+), tourne la tête (+ = vers sa gauche)
  epauleG: [number, number]; // bras levé vers l'avant (+), écarté sur le côté (+)
  coudeG: number; // plié (+)
  epauleD: [number, number];
  coudeD: number;
  hancheG: [number, number]; // cuisse vers l'avant (+), écartée (+)
  genouG: number; // plié (+)
  hancheD: [number, number];
  genouD: number;
  sourcils: number; // -1 inquiet, 0 neutre, +1 décidé
};

export type NomPose = "debout" | "marche" | "accroupi" | "mainTendue" | "boutonCote" | "lampe" | "froid" | "inquiet" | "assis" | "telephone" | "frappe" | "affale" | "bras" | "assisTelephone" | "assisMain" | "assisCalin" | "assisTriste";

const DEBOUT: Pose = {
  tronc: [2, 0, 0],
  tete: [0, 0],
  epauleG: [0, 6],
  coudeG: 12,
  epauleD: [0, 6],
  coudeD: 12,
  hancheG: [0, 3],
  genouG: 2,
  hancheD: [0, 3],
  genouD: 2,
  sourcils: 0,
};

export const POSES: Record<Exclude<NomPose, "marche">, Pose> = {
  debout: DEBOUT,
  accroupi: { ...DEBOUT, tronc: [28, 0, 0], tete: [-12, 0], epauleG: [35, 12], coudeG: 50, epauleD: [55, 8], coudeD: 35, hancheG: [100, 12], genouG: 128, hancheD: [92, 12], genouD: 120 },
  mainTendue: { ...DEBOUT, tronc: [8, -6, 0], epauleD: [82, 4], coudeD: 8, epauleG: [5, 8], coudeG: 20, sourcils: 0.3 },
  // bras droit tendu sur le côté (appuyer sur un bouton sans le regarder)
  boutonCote: { ...DEBOUT, tronc: [2, 0, -4], tete: [2, -12], epauleD: [12, 74], coudeD: 10, epauleG: [2, 8], coudeG: 16, sourcils: -0.3 },
  lampe: { ...DEBOUT, tronc: [4, 0, 0], epauleD: [72, 2], coudeD: 18, epauleG: [10, 10], coudeG: 35, sourcils: 0.5 },
  froid: { ...DEBOUT, tronc: [10, 0, 0], tete: [10, 0], epauleG: [55, -18], coudeG: 115, epauleD: [55, -18], coudeD: 115, hancheG: [0, 1], hancheD: [0, 1], sourcils: -0.8 },
  inquiet: { ...DEBOUT, tete: [-6, 18], epauleG: [12, 14], coudeG: 40, epauleD: [12, 14], coudeD: 40, sourcils: -1 },
  // téléphone à l'oreille (main droite), main gauche sur la hanche
  telephone: { ...DEBOUT, tete: [4, -8], epauleD: [40, 38], coudeD: 150, epauleG: [10, 28], coudeG: 70, sourcils: 0.4 },
  // poing levé contre une porte (devant lui)
  frappe: { ...DEBOUT, tronc: [6, 0, 0], epauleD: [92, 10], coudeD: 70, epauleG: [8, 8], coudeG: 25, sourcils: 0.6 },
  // assis, tête qui tombe, bras ballants (endormi / intoxiqué)
  affale: { ...DEBOUT, tronc: [-8, 0, 6], tete: [28, 12], hancheG: [88, 10], genouG: 88, hancheD: [88, 10], genouD: 88, epauleG: [6, 14], coudeG: 8, epauleD: [6, 14], coudeD: 8, sourcils: -0.2 },
  // bras écartés (indignation)
  bras: { ...DEBOUT, tronc: [-3, 0, 0], tete: [-6, 0], epauleG: [30, 55], coudeG: 25, epauleD: [30, 55], coudeD: 25, sourcils: 0.8 },
  assis: { ...DEBOUT, tronc: [6, 0, 0], hancheG: [88, 6], genouG: 90, hancheD: [88, 6], genouD: 90, epauleG: [25, 8], coudeG: 45, epauleD: [25, 8], coudeD: 45 },
  // assis, téléphone à l'oreille / regardé dans la main (saison « Le dernier appel »)
  assisTelephone: { ...DEBOUT, tronc: [6, 0, 0], hancheG: [88, 6], genouG: 90, hancheD: [88, 6], genouD: 90, tete: [4, -8], epauleD: [40, 38], coudeD: 150, epauleG: [25, 8], coudeG: 45, sourcils: 0.4 },
  assisMain: { ...DEBOUT, tronc: [10, 0, 0], hancheG: [88, 6], genouG: 90, hancheD: [88, 6], genouD: 90, tete: [16, 0], epauleD: [50, 6], coudeD: 70, epauleG: [25, 8], coudeG: 45 },
  // assis, le bras gauche autour de la personne assise à sa gauche, buste penché vers elle
  assisCalin: { ...DEBOUT, tronc: [8, 12, 12], hancheG: [88, 6], genouG: 90, hancheD: [88, 6], genouD: 90, tete: [6, 22], epauleG: [28, 82], coudeG: 35, epauleD: [45, -10], coudeD: 80, sourcils: -0.3 },
  // assis, tête basse, mains jointes sur les genoux (aveu, larmes)
  assisTriste: { ...DEBOUT, tronc: [16, 0, 0], hancheG: [88, 6], genouG: 90, hancheD: [88, 6], genouD: 90, tete: [20, 0], epauleG: [38, -6], coudeG: 60, epauleD: [38, -6], coudeD: 60, sourcils: -0.8 },
};

// Cycle de marche : phase 0..1 = 2 pas (≈ 0,6 m pour un personnage de taille 1)
export const FOULEE = 0.6;
export const poseMarche = (phase: number): Pose => {
  const a = 2 * Math.PI * phase;
  const s = Math.sin(a);
  const c = Math.cos(a);
  return {
    tronc: [6, 5 * s, 0],
    tete: [2, -3 * s],
    epauleG: [-20 * s, 7],
    coudeG: 18 + 10 * Math.max(0, -s),
    epauleD: [20 * s, 7],
    coudeD: 18 + 10 * Math.max(0, s),
    hancheG: [24 * s, 3],
    genouG: 6 + 42 * Math.max(0, c) * Math.max(0, c),
    hancheD: [-24 * s, 3],
    genouD: 6 + 42 * Math.max(0, -c) * Math.max(0, -c),
    sourcils: 0,
  };
};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const melanger = (a: Pose, b: Pose, t: number): Pose => ({
  tronc: [mix(a.tronc[0], b.tronc[0], t), mix(a.tronc[1], b.tronc[1], t), mix(a.tronc[2], b.tronc[2], t)],
  tete: [mix(a.tete[0], b.tete[0], t), mix(a.tete[1], b.tete[1], t)],
  epauleG: [mix(a.epauleG[0], b.epauleG[0], t), mix(a.epauleG[1], b.epauleG[1], t)],
  coudeG: mix(a.coudeG, b.coudeG, t),
  epauleD: [mix(a.epauleD[0], b.epauleD[0], t), mix(a.epauleD[1], b.epauleD[1], t)],
  coudeD: mix(a.coudeD, b.coudeD, t),
  hancheG: [mix(a.hancheG[0], b.hancheG[0], t), mix(a.hancheG[1], b.hancheG[1], t)],
  genouG: mix(a.genouG, b.genouG, t),
  hancheD: [mix(a.hancheD[0], b.hancheD[0], t), mix(a.hancheD[1], b.hancheD[1], t)],
  genouD: mix(a.genouD, b.genouD, t),
  sourcils: mix(a.sourcils, b.sourcils, t),
});

// Proportions (taille 1) : grosse tête, petit corps trapu
export const CORPS = {
  cuisse: 0.2,
  tibia: 0.19,
  semelle: 0.065, // de la cheville au sol
  bassinVersEpaules: 0.36,
  ecartHanches: 0.085,
  ecartEpaules: 0.2,
  brasHaut: 0.16,
  avantBras: 0.15,
  rayonTete: 0.27,
  cou: 0.05,
} as const;

// Proportions « humain » : la silhouette de la partie 1 (≈ 1,4 m, tête un peu grosse), avec le détail réaliste de
// Humain.tsx (vêtements, mains, visage, cheveux). Mêmes longueurs que le Bonhomme, membres un peu plus fins.
export const CORPS_HUMAIN = {
  cuisse: 0.21,
  tibia: 0.2,
  semelle: 0.06,
  bassinVersEpaules: 0.36,
  ecartHanches: 0.08,
  ecartEpaules: 0.175,
  brasHaut: 0.17,
  avantBras: 0.155,
  rayonTete: 0.24,
  cou: 0.045,
} as const;

// Proportions « adulte » (saison « Le dernier appel », style anime adulte) : ≈ 1,75 m, tête ≈ 1/7 de la hauteur,
// jambes et bras longs, cou visible. Même dessin que Humain.tsx (visage, mains, vêtements), yeux en amande.
export const CORPS_ADULTE = {
  cuisse: 0.42,
  tibia: 0.4,
  semelle: 0.07,
  bassinVersEpaules: 0.52,
  ecartHanches: 0.09,
  ecartEpaules: 0.2,
  brasHaut: 0.29,
  avantBras: 0.26,
  rayonTete: 0.118,
  cou: 0.06,
} as const;

export type Variante = "bonhomme" | "heroine" | "humain" | "adulte";
export const estHumain = (v?: Variante) => v === "humain" || v === "adulte";
export type Proportions = { [K in keyof typeof CORPS]: number };
export const corpsDe = (v: Variante = "bonhomme"): Proportions => (v === "adulte" ? CORPS_ADULTE : v === "humain" ? CORPS_HUMAIN : CORPS);
// Sommet du crâne (au-dessus du bassin) : sert au cadrage et au contrôle « sujet coupé »
export const hautTete = (v: Variante = "bonhomme") => {
  const c = corpsDe(v);
  return c.bassinVersEpaules + c.cou + 2 * c.rayonTete * (estHumain(v) ? 1.12 : 1);
};

const rad = (d: number) => (d * Math.PI) / 180;

// Hauteur du bassin pour que le pied le plus bas touche le sol (pieds toujours posés)
export const hauteurBassin = (p: Pose, v: Variante = "bonhomme") => {
  const C = corpsDe(v);
  const cheville = (h: [number, number], g: number) =>
    -(C.cuisse * Math.cos(rad(h[0])) + C.tibia * Math.cos(rad(h[0] - g))) * Math.cos(rad(h[1]));
  return -Math.min(cheville(p.hancheG, p.genouG), cheville(p.hancheD, p.genouD)) + C.semelle;
};

// ---------- Expressions du visage (indépendantes de la pose du corps) ----------
// sourcils : -1 inquiet … +1 décidé ; sourire : -1 bouche triste … +1 grand sourire ; bouche : 0 fermée … 1 grande ouverte ;
// yeux : 0 fermés … 1 normaux … 1,3 écarquillés
export type Visage = { sourcils: number; sourire: number; bouche: number; yeux: number };
export type NomExpression = "neutre" | "sourire" | "decide" | "inquiet" | "peur" | "surpris" | "triste" | "fatigue" | "soulage" | "dort" | "colere";
export const EXPRESSIONS: Record<NomExpression, Visage> = {
  neutre: { sourcils: 0, sourire: 0.15, bouche: 0, yeux: 1 },
  sourire: { sourcils: 0.15, sourire: 0.95, bouche: 0, yeux: 0.82 },
  decide: { sourcils: 0.85, sourire: 0.25, bouche: 0, yeux: 0.88 },
  inquiet: { sourcils: -0.9, sourire: -0.5, bouche: 0, yeux: 1.08 },
  peur: { sourcils: -1, sourire: -0.6, bouche: 0.75, yeux: 1.28 },
  surpris: { sourcils: -0.35, sourire: 0, bouche: 0.6, yeux: 1.25 },
  triste: { sourcils: -1, sourire: -0.85, bouche: 0, yeux: 0.72 },
  fatigue: { sourcils: -0.25, sourire: -0.1, bouche: 0, yeux: 0.5 },
  soulage: { sourcils: -0.3, sourire: 0.65, bouche: 0, yeux: 0.7 },
  dort: { sourcils: -0.1, sourire: 0.05, bouche: 0, yeux: 0.02 },
  colere: { sourcils: 1, sourire: -0.6, bouche: 0, yeux: 0.95 },
};
// Visage par défaut quand l'épisode ne donne pas d'expression : déduit des sourcils de la pose
export const visageDePose = (p: Pose): Visage => ({ sourcils: p.sourcils, sourire: p.sourcils < -0.2 ? -0.4 : 0.15, bouche: 0, yeux: 1 });
export const melangerVisage = (a: Visage, b: Visage, t: number): Visage => ({
  sourcils: mix(a.sourcils, b.sourcils, t),
  sourire: mix(a.sourire, b.sourire, t),
  bouche: mix(a.bouche, b.bouche, t),
  yeux: mix(a.yeux, b.yeux, t),
});
