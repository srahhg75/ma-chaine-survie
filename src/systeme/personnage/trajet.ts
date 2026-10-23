import { Alignement } from "../mots";
import { clamp, distance, lerp, tresDoux, Vec3 } from "../maths";
import { Ancre, image } from "../timeline";
import { FOULEE, melanger, NomPose, Pose, poseMarche, POSES } from "./poses";

/*
 * Déplacements et poses d'un personnage, en données. Pas de téléportation : pour changer de place,
 * le personnage MARCHE (vitesse ≤ 1,4 m/s conseillée) ; il arrive à l'instant `a` de chaque clé de trajet.
 */
export type CleTrajet = {
  a: Ancre; // instant d'ARRIVÉE
  position: Vec3; // y = 0 (sol)
  orientation?: number; // degrés, direction regardée une fois arrivé (0 = vers +Z, la caméra par défaut)
  chemin?: Vec3[]; // points de passage (contourner un meuble)
  vitesse?: number; // m/s, défaut 1,0
};
export type ClePose = { a: Ancre; pose: Exclude<NomPose, "marche">; transition?: number };

export type DonneesPersonnage = {
  id: string;
  depart: { position: Vec3; orientation: number };
  trajet?: CleTrajet[];
  poses?: ClePose[];
  lampe?: { de: Ancre; a?: Ancre }; // lampe torche allumée dans la main droite
  taille?: number; // défaut 1
  variante?: "bonhomme" | "heroine"; // personnage de la chaîne ou héroïne
};

type Segment = { points: Vec3[]; longueur: number; fDepart: number; fArrivee: number; orientationFin?: number; orientationDebut: number };
export type PersonnageResolu = {
  id: string;
  taille: number;
  depart: { position: Vec3; orientation: number };
  segments: Segment[];
  poses: { f: number; pose: Exclude<NomPose, "marche">; transition: number }[];
  lampe?: [number, number];
  variante: "bonhomme" | "heroine";
};

export type EtatPersonnage = { position: Vec3; orientation: number; pose: Pose; marche: boolean; lampe: boolean; vitesse: number };

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
    depart: p.depart,
    segments,
    poses: (p.poses ?? []).map((k) => ({ f: image(k.a, al, fps), pose: k.pose, transition: k.transition ?? 0.35 })),
    lampe: p.lampe ? [image(p.lampe.de, al, fps), p.lampe.a !== undefined ? image(p.lampe.a, al, fps) : Infinity] : undefined,
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
        p: [lerp(points[i - 1][0], points[i][0], t), 0, lerp(points[i - 1][2], points[i][2], t)],
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
      return { position: p, orientation: o, pose: { ...melanger(base, marche, clamp(fondu)), ...lampePose }, marche: true, lampe, vitesse: vit };
    }
    distanceCumulee += s.longueur;
    pos = s.points[s.points.length - 1];
    const dirFin = pointSur(s.points, s.longueur).direction;
    const fin = s.orientationFin ?? dirFin;
    orient = angleVers(dirFin, fin, tresDoux((frame - s.fArrivee) / (0.4 * fps)));
  }
  const pose = poseStatique(r, frame, fps);
  return { position: pos, orientation: orient, pose: lampe ? { ...pose, epauleD: POSES.lampe.epauleD, coudeD: POSES.lampe.coudeD } : pose, marche: false, lampe, vitesse: 0 };
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
