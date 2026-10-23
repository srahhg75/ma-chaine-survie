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

export type NomPose = "debout" | "marche" | "accroupi" | "mainTendue" | "boutonCote" | "lampe" | "froid" | "inquiet" | "assis";

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
  assis: { ...DEBOUT, tronc: [6, 0, 0], hancheG: [88, 6], genouG: 90, hancheD: [88, 6], genouD: 90, epauleG: [25, 8], coudeG: 45, epauleD: [25, 8], coudeD: 45 },
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

const rad = (d: number) => (d * Math.PI) / 180;

// Hauteur du bassin pour que le pied le plus bas touche le sol (pieds toujours posés)
export const hauteurBassin = (p: Pose) => {
  const cheville = (h: [number, number], g: number) =>
    -(CORPS.cuisse * Math.cos(rad(h[0])) + CORPS.tibia * Math.cos(rad(h[0] - g))) * Math.cos(rad(h[1]));
  return -Math.min(cheville(p.hancheG, p.genouG), cheville(p.hancheD, p.genouD)) + CORPS.semelle;
};
