import { Alignement } from "../mots";
import { clamp, distance, lerp, tresDoux, Vec3 } from "../maths";
import { Ancre, image } from "../timeline";
import { estHumain, EXPRESSIONS, FOULEE, melanger, melangerVisage, NomExpression, NomPose, Pose, poseMarche, POSES, Variante, Visage, visageDePose } from "./poses";
import { Apparence } from "./apparence";
import { bruit } from "../maths";

/*
 * Déplacements et poses d'un personnage, en données. Pas de téléportation : pour changer de place,
 * le personnage MARCHE (vitesse ≤ 1,4 m/s conseillée) ; il arrive à l'instant `a` de chaque clé de trajet.
 */
export type CleTrajet = {
  a: Ancre; // instant d'ARRIVÉE
  position: Vec3; // y = hauteur du sol (0, ou la marche d'un escalier)
  orientation?: number; // degrés, direction regardée une fois arrivé (0 = vers +Z, la caméra par défaut)
  chemin?: Vec3[]; // points de passage (contourner un meuble)
  vitesse?: number; // m/s, défaut 1,0
};
export type ClePose = { a: Ancre; pose: Exclude<NomPose, "marche">; transition?: number };
export type CleExpression = { a: Ancre; expression: NomExpression; transition?: number };

export type DonneesPersonnage = {
  id: string;
  depart: { position: Vec3; orientation: number };
  trajet?: CleTrajet[];
  poses?: ClePose[];
  expressions?: CleExpression[]; // visage calé sur les mots (sinon : déduit des sourcils de la pose)
  lampe?: { de: Ancre; a?: Ancre; puissance?: number }; // lampe torche allumée dans la main droite (puissance 1 par défaut)
  taille?: number; // défaut 1
  variante?: Variante; // personnage de la chaîne, héroïne (figurine) ou « humain » (proportions réalistes)
  apparence?: Partial<Apparence>; // humain : cheveux, vêtements, âge… (voir apparence.ts)
  tenues?: { a: Ancre; apparence: Partial<Apparence> }[]; // changements d'apparence (couches, bonnet…)
  voix?: string; // nom de sa voix dans le script (`[Inès]`) : la bouche bouge sur ses répliques (défaut : id)
  fantome?: { de: Ancre; a: Ancre }; // « fantôme » rouge du mauvais réflexe, visible seulement de `de` à `a`
  presence?: { de?: Ancre; a?: Ancre }; // le personnage n'existe que de `de` à `a` (même héros sur deux plans séparés par une coupe)
  invisible?: boolean; // jamais dessiné (ex. l'inconnu dont on ne voit que la lampe) : sa position sert au décor et ses pas au mixage
};

type Segment = { points: Vec3[]; longueur: number; fDepart: number; fArrivee: number; orientationFin?: number; orientationDebut: number };
export type PersonnageResolu = {
  id: string;
  taille: number;
  depart: { position: Vec3; orientation: number };
  segments: Segment[];
  poses: { f: number; pose: Exclude<NomPose, "marche">; transition: number }[];
  expressions: { f: number; expression: NomExpression; transition: number }[];
  lampe?: [number, number];
  puissanceLampe: number;
  variante: Variante;
  apparence?: Partial<Apparence>;
  tenues: { f: number; apparence: Partial<Apparence> }[];
  fantome?: [number, number];
  presence: [number, number];
  invisible: boolean;
  parole: [number, number][]; // images où il dit un mot (bouche qui bouge)
};

// Le personnage existe-t-il à cette image ? (hors de sa présence : ni dessiné, ni contrôlé)
export const present = (r: PersonnageResolu, frame: number) => frame >= r.presence[0] && frame < r.presence[1];

export type EtatPersonnage = { position: Vec3; orientation: number; pose: Pose; marche: boolean; lampe: boolean; vitesse: number; visage: Visage; apparence?: Partial<Apparence> };

// Apparence à l'image `frame` : apparence de base + tenues déjà enfilées
const apparenceCourante = (r: PersonnageResolu, frame: number): Partial<Apparence> | undefined =>
  r.tenues.filter((k) => k.f <= frame).reduce((acc, k) => ({ ...acc, ...k.apparence }), r.apparence);

const cap = (a: Vec3, b: Vec3) => (Math.atan2(b[0] - a[0], b[2] - a[2]) * 180) / Math.PI;
const angleVers = (de: number, vers: number, t: number) => {
  const d = ((((vers - de) % 360) + 540) % 360) - 180;
  return de + d * t;
};

export const resoudrePersonnage = (p: DonneesPersonnage, al: Alignement, fps: number): PersonnageResolu => {
  const segments: Segment[] = [];
  let pos = p.depart.position;
  let orient = p.depart.orientation;
  for (const c of p.trajet ?? []) {
    const points = [pos, ...(c.chemin ?? []), c.position];
    let longueur = 0;
    for (let i = 1; i < points.length; i++) longueur += distance(points[i - 1], points[i]);
    const fArrivee = image(c.a, al, fps);
    const duree = longueur / (c.vitesse ?? 1.0);
    segments.push({ points, longueur, fArrivee, fDepart: Math.round(fArrivee - duree * fps), orientationFin: c.orientation, orientationDebut: orient });
    pos = c.position;
    orient = c.orientation ?? cap(points[points.length - 2], c.position);
  }
  return {
    id: p.id,
    taille: p.taille ?? 1,
    variante: p.variante ?? "bonhomme",
    apparence: p.apparence,
    tenues: (p.tenues ?? []).map((k) => ({ f: image(k.a, al, fps), apparence: k.apparence })).sort((x, y) => x.f - y.f),
    parole: motsDits(p.voix ?? p.id, al),
    depart: p.depart,
    segments,
    poses: (p.poses ?? []).map((k) => ({ f: image(k.a, al, fps), pose: k.pose, transition: k.transition ?? 0.35 })),
    expressions: (p.expressions ?? []).map((k) => ({ f: image(k.a, al, fps), expression: k.expression, transition: k.transition ?? 0.3 })),
    lampe: p.lampe ? [image(p.lampe.de, al, fps), p.lampe.a !== undefined ? image(p.lampe.a, al, fps) : Infinity] : undefined,
    puissanceLampe: p.lampe?.puissance ?? 1,
    fantome: p.fantome ? [image(p.fantome.de, al, fps), image(p.fantome.a, al, fps)] : undefined,
    presence: [p.presence?.de !== undefined ? image(p.presence.de, al, fps) : -Infinity, p.presence?.a !== undefined ? image(p.presence.a, al, fps) : Infinity],
    invisible: !!p.invisible,
  };
};

// Durée d'une syllabe pour la bouche qui parle (français : ≈ 5 syllabes par seconde)
export const SYLLABE_S = 0.2;

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
// Mots dits par cette voix (phrases `[Prénom]` du script), en images
const motsDits = (voix: string, al: Alignement): [number, number][] => {
  const phrases = new Set(al.phrases.filter((p) => p.voix && norm(p.voix) === norm(voix)).map((p) => p.index));
  return al.mots.filter((m) => phrases.has(m.phrase)).map((m) => [m.fDebut, m.fFin]);
};

// Vie du personnage « humain » (réalisme du mouvement) : au repos, respiration (buste qui monte et descend),
// léger balancement du poids d'une jambe sur l'autre, petits mouvements de tête ; en marchant, bras qui se plient
// davantage et tête qui compense le balancier du buste. Le Bonhomme et l'héroïne de la partie 1 ne changent pas.
const vivant = (r: PersonnageResolu, p: Pose, frame: number, fps: number, marche: boolean): Pose => {
  if (!estHumain(r.variante)) return p;
  const t = frame / fps + (r.id.length % 7) * 0.9;
  const s = (periode: number, d = 0) => Math.sin((2 * Math.PI * t) / periode + d);
  if (marche)
    return { ...p, coudeG: p.coudeG + 10, coudeD: p.coudeD + 10, tete: [p.tete[0], p.tete[1] - p.tronc[1] * 0.6], tronc: [p.tronc[0] + 1.5 * s(0.55), p.tronc[1], p.tronc[2]] };
  return {
    ...p,
    tronc: [p.tronc[0] + 1.4 * s(3.8), p.tronc[1] + 1.2 * s(9.5, 1), p.tronc[2] + 1.6 * s(7.2, 2)],
    tete: [p.tete[0] - 1.0 * s(3.8, 0.6) + 1.5 * s(6.1, 3), p.tete[1] + 4 * s(8.3, 4)],
    epauleG: [p.epauleG[0] + 1.5 * s(3.8, 0.3), p.epauleG[1]],
    epauleD: [p.epauleD[0] + 1.5 * s(3.8, 0.3), p.epauleD[1]],
    hancheG: [p.hancheG[0], p.hancheG[1] + 1.2 * s(7.2, 2)],
    hancheD: [p.hancheD[0], p.hancheD[1] - 1.2 * s(7.2, 2)],
  };
};

// Distance parcourue (0..1) avec accélération et freinage doux (0,3 s)
const avancement = (t: number, duree: number) => {
  const ta = Math.min(0.3, duree / 3) / duree;
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const vmax = 1 / (1 - ta);
  if (t < ta) return (vmax * t * t) / (2 * ta);
  if (t > 1 - ta) return 1 - (vmax * (1 - t) * (1 - t)) / (2 * ta);
  return vmax * (t - ta / 2);
};

const pointSur = (points: Vec3[], d: number): { p: Vec3; direction: number } => {
  let reste = d;
  for (let i = 1; i < points.length; i++) {
    const l = distance(points[i - 1], points[i]);
    if (reste <= l || i === points.length - 1) {
      const t = l > 0 ? clamp(reste / l) : 1;
      return {
        p: [lerp(points[i - 1][0], points[i][0], t), lerp(points[i - 1][1], points[i][1], t), lerp(points[i - 1][2], points[i][2], t)],
        direction: cap(points[i - 1], points[i]),
      };
    }
    reste -= l;
  }
  return { p: points[points.length - 1], direction: 0 };
};

const poseStatique = (r: PersonnageResolu, frame: number, fps: number): Pose => {
  const actives = r.poses.filter((k) => k.f <= frame);
  if (!actives.length) return POSES.debout;
  const k = actives[actives.length - 1];
  const prec = actives.length > 1 ? POSES[actives[actives.length - 2].pose] : POSES.debout;
  return melanger(prec, POSES[k.pose], tresDoux((frame - k.f) / Math.max(1, k.transition * fps)));
};

// Visage courant : expressions de l'épisode (fondu entre deux clés) + clignements automatiques (toutes les 2,5 à 4,5 s)
const visageCourant = (r: PersonnageResolu, pose: Pose, frame: number, fps: number): Visage => {
  const actives = r.expressions.filter((k) => k.f <= frame);
  let v: Visage;
  if (!r.expressions.length) v = visageDePose(pose);
  else if (!actives.length) v = EXPRESSIONS.neutre;
  else {
    const k = actives[actives.length - 1];
    const prec = actives.length > 1 ? EXPRESSIONS[actives[actives.length - 2].expression] : EXPRESSIONS.neutre;
    v = melangerVisage(prec, EXPRESSIONS[k.expression], tresDoux((frame - k.f) / Math.max(1, k.transition * fps)));
  }
  const t = frame / fps;
  // Parole : la bouche s'ouvre et se ferme au rythme des syllabes (≈ 0,2 s, soit 5 par seconde) pendant chaque mot
  const mot = r.parole.find(([a, b]) => frame >= a && frame < b);
  if (mot) {
    const u = (frame - mot[0]) / fps;
    const ouverture = 0.18 + 0.32 * Math.abs(Math.sin((Math.PI * u) / SYLLABE_S + bruit(`${r.id}syl`, mot[0]) * 0.5));
    v = { ...v, bouche: Math.max(v.bouche, ouverture) };
  }
  const periode = 3.5 + 1.0 * bruit(`${r.id}cligne`, Math.floor(t / 3.5));
  const phase = (t + 0.7 * (r.id.length % 5)) % periode;
  const fermeture = phase < 0.07 ? phase / 0.07 : phase < 0.16 ? 1 - (phase - 0.07) / 0.09 : 0;
  return { ...v, yeux: v.yeux * (1 - 0.94 * clamp(fermeture)) };
};

export const etatPersonnage = (r: PersonnageResolu, frame: number, fps: number): EtatPersonnage => {
  const lampe = !!r.lampe && frame >= r.lampe[0] && frame < r.lampe[1];
  let pos = r.depart.position;
  let orient = r.depart.orientation;
  let distanceCumulee = 0;
  for (const s of r.segments) {
    if (frame < s.fDepart) break;
    const duree = Math.max(1, s.fArrivee - s.fDepart) / fps;
    const t = (frame - s.fDepart) / Math.max(1, s.fArrivee - s.fDepart);
    if (t < 1) {
      const u = avancement(t, duree);
      const { p, direction } = pointSur(s.points, u * s.longueur);
      const d = distanceCumulee + u * s.longueur;
      // Rotation vers la direction de marche dans les 0,3 premières secondes
      const o = angleVers(s.orientationDebut, direction, tresDoux((frame - s.fDepart) / (0.3 * fps)));
      // La marche se fond dans la pose statique au départ et à l'arrivée
      const fondu = Math.min(1, (frame - s.fDepart) / (0.25 * fps), (s.fArrivee - frame) / (0.25 * fps));
      const base = poseStatique(r, frame, fps);
      const marche = poseMarche((d / FOULEE / r.taille) % 1);
      const lampePose = lampe ? { epauleD: POSES.lampe.epauleD, coudeD: POSES.lampe.coudeD } : {};
      const vit = (avancement(Math.min(1, t + 1 / (duree * fps)), duree) - u) * s.longueur * fps;
      const poseM = { ...vivant(r, melanger(base, marche, clamp(fondu)), frame, fps, fondu > 0.5), ...lampePose };
      return { position: p, orientation: o, pose: poseM, marche: true, lampe, vitesse: vit, visage: visageCourant(r, poseM, frame, fps), apparence: apparenceCourante(r, frame) };
    }
    distanceCumulee += s.longueur;
    pos = s.points[s.points.length - 1];
    const dirFin = pointSur(s.points, s.longueur).direction;
    const fin = s.orientationFin ?? dirFin;
    orient = angleVers(dirFin, fin, tresDoux((frame - s.fArrivee) / (0.4 * fps)));
  }
  const pose = vivant(r, poseStatique(r, frame, fps), frame, fps, false);
  const poseF = lampe ? { ...pose, epauleD: POSES.lampe.epauleD, coudeD: POSES.lampe.coudeD } : pose;
  return { position: pos, orientation: orient, pose: poseF, marche: false, lampe, vitesse: 0, visage: visageCourant(r, poseF, frame, fps), apparence: apparenceCourante(r, frame) };
};

// Instants où un pied touche le sol (pour les bruits de pas du mixage)
export const contactsPas = (r: PersonnageResolu, fps: number): number[] => {
  const res: number[] = [];
  let prec = -1;
  let cumul = 0;
  for (const s of r.segments) {
    const duree = Math.max(1, s.fArrivee - s.fDepart) / fps;
    for (let f = s.fDepart; f <= s.fArrivee; f++) {
      const d = cumul + avancement((f - s.fDepart) / Math.max(1, s.fArrivee - s.fDepart), duree) * s.longueur;
      const n = Math.floor((d / (FOULEE * r.taille)) * 2 + 0.5); // un contact par demi-cycle
      if (n !== prec && f > s.fDepart) res.push(f / fps);
      prec = n;
    }
    cumul += s.longueur;
    prec = Math.floor((cumul / (FOULEE * r.taille)) * 2 + 0.5);
  }
  return res;
};

// Opacité d'un fantôme (fondu de 0,25 s à l'entrée et à la sortie) ; 1 pour un personnage normal
export const opaciteFantome = (r: PersonnageResolu, frame: number, fps: number) => {
  if (!r.fantome) return 1;
  const [f0, f1] = r.fantome;
  const k = 0.25 * fps;
  return clamp(Math.min((frame - f0) / k, (f1 - frame) / k));
};
