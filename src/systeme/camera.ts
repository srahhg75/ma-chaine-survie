import { PerspectiveCamera, Vector3 } from "three";
import { HAUTEUR, LARGEUR } from "./format";
import { Alignement } from "./mots";
import { Ancre, image } from "./timeline";
import { bezier3, bruit, doux, lerp, lerp3, Vec3 } from "./maths";

/*
 * Caméra par images-clés « déplacement → plan tenu ».
 * Chaque clé décrit un PLAN : la caméra y ARRIVE à l'instant `a` après un déplacement de `deplacement` s
 * (accélération et freinage doux), puis le plan est tenu jusqu'au départ du déplacement suivant.
 * La 1re clé est la position de départ (à l'instant 0, sans déplacement).
 */
export type CleCamera = {
  a: Ancre; // arrivée sur le plan
  position: Vec3;
  cible: Vec3;
  fov?: number; // degrés (vertical), défaut 50
  deplacement?: number; // durée du déplacement qui mène à ce plan (s), défaut 1,4
  coupe?: boolean; // coupe nette (changement de lieu) : pas de déplacement, l'image change d'un coup
  par?: Vec3; // point de passage pour contourner un mur ou un meuble (courbe)
  derive?: number; // amplitude (m) de la légère dérive « caméra vivante » sur le plan tenu, défaut 0,01
};

export type CleCameraResolue = Required<Omit<CleCamera, "a" | "par" | "coupe">> & {
  coupe: boolean;
  par?: Vec3;
  fArrivee: number;
  fDepart: number; // début du déplacement qui y mène
};

export type EtatCamera = {
  position: Vec3;
  cible: Vec3;
  fov: number;
  phase: "deplacement" | "tenu";
  plan: number; // index de la clé (plan en cours ou visé)
};

export const resoudreCamera = (cles: CleCamera[], al: Alignement, fps: number): CleCameraResolue[] => {
  const res: CleCameraResolue[] = [];
  cles.forEach((c, i) => {
    const fArrivee = i === 0 ? 0 : image(c.a, al, fps);
    const deplacement = i === 0 || c.coupe ? 0 : c.deplacement ?? 1.4;
    const fPrec = i === 0 ? 0 : res[i - 1].fArrivee;
    res.push({
      position: c.position,
      cible: c.cible,
      fov: c.fov ?? 50,
      deplacement,
      coupe: !!c.coupe,
      derive: c.derive ?? 0.01,
      par: c.par,
      fArrivee,
      fDepart: Math.max(fPrec, fArrivee - Math.round(deplacement * fps)),
    });
  });
  return res;
};

const derive = (c: CleCameraResolue, frame: number, fps: number, i: number): Vec3 => {
  const t = frame / fps;
  const k = c.derive;
  return [k * bruit(`cam${i}x`, t * 0.35), k * 0.6 * bruit(`cam${i}y`, t * 0.3), k * bruit(`cam${i}z`, t * 0.3)];
};

export const etatCamera = (cles: CleCameraResolue[], frame: number, fps: number): EtatCamera => {
  let i = 0;
  while (i + 1 < cles.length && frame >= cles[i + 1].fDepart) i++;
  const c = cles[i];
  // Déplacement en cours vers la clé i (frame entre fDepart et fArrivee de la clé i)
  if (i > 0 && frame < c.fArrivee) {
    const p = cles[i - 1];
    const t = doux((frame - c.fDepart) / Math.max(1, c.fArrivee - c.fDepart));
    // La dérive du plan précédent s'efface progressivement pendant le déplacement
    const dp = derive(p, frame, fps, i - 1).map((v) => v * (1 - t)) as Vec3;
    const position = c.par ? bezier3(p.position, c.par, c.position, t) : lerp3(p.position, c.position, t);
    return {
      position: [position[0] + dp[0], position[1] + dp[1], position[2] + dp[2]],
      cible: lerp3(p.cible, c.cible, t),
      fov: lerp(p.fov, c.fov, t),
      phase: "deplacement",
      plan: i,
    };
  }
  // Plan tenu (avec dérive qui démarre en douceur)
  const entree = doux(Math.min(1, (frame - c.fArrivee) / fps));
  const d = derive(c, frame, fps, i).map((v) => v * entree) as Vec3;
  return {
    position: [c.position[0] + d[0], c.position[1] + d[1], c.position[2] + d[2]],
    cible: c.cible,
    fov: c.fov,
    phase: "tenu",
    plan: i,
  };
};

// Caméra three.js équivalente (sert au rendu ET au contrôle qualité)
const cameraCalcul = new PerspectiveCamera(50, LARGEUR / HAUTEUR, 0.05, 400);
const v = new Vector3();

export const appliquerCamera = (camera: PerspectiveCamera, e: EtatCamera, aspect = LARGEUR / HAUTEUR) => {
  camera.position.set(...e.position);
  camera.fov = e.fov;
  camera.aspect = aspect;
  camera.near = 0.05;
  camera.far = 400;
  camera.lookAt(...e.cible);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
};

// Projette un point 3D en pixels de la vidéo (1080×1920). devant=false si le point est derrière la caméra.
export const project = (point: Vec3, e: EtatCamera, largeur = LARGEUR, hauteur = HAUTEUR) => {
  appliquerCamera(cameraCalcul, e, largeur / hauteur);
  v.set(...point).project(cameraCalcul);
  return { x: ((v.x + 1) / 2) * largeur, y: ((1 - v.y) / 2) * hauteur, devant: v.z < 1 && v.z > -1 };
};

/*
 * Cadrage par sujet : place la caméra autour d'un point 3D et calcule la visée pour que ce point tombe
 * à l'endroit voulu de l'image (par défaut x = 500, y = 620 : au-dessus des sous-titres, hors colonne TikTok).
 *   azimut   : d'où l'on filme, en degrés (0 = depuis le sud +Z, 90 = depuis l'est +X, -90 = depuis l'ouest)
 *   elevation: hauteur de la caméra en degrés au-dessus de l'horizontale du sujet
 *   distance : en mètres
 */
/*
 * Cadrages types, « comme @chroniques_flippantes » (analyse/cadrages.md) : caméra à hauteur d'œil, objectif assez
 * large (perspective, décor visible), personnage PETIT dans l'image. Pour un personnage « humain » (≈ 1,4 m) ;
 * p = position des pieds. Part de la hauteur de l'image occupée par le personnage :
 *   large ≈ 22 % · pied ≈ 33 % · deux (2 personnages) ≈ 27 % · moyen ≈ 48 % · gros ≈ 80 % (moments forts seulement)
 * Objectif fixé par tools/qc.ts (CADRAGE de format.ts) : médiane ≤ 35 %, gros plans ≤ 15 % des images.
 */
type OptionsCadrage = Partial<OptionsPlan>;
export const cadrage = {
  large: (p: Vec3, az: number, o: OptionsCadrage = {}) => plan([p[0], p[1] + 0.7, p[2]], { azimut: az, elevation: 8, distance: 7.0, fov: 48, y: 680, ...o }),
  pied: (p: Vec3, az: number, o: OptionsCadrage = {}) => plan([p[0], p[1] + 0.7, p[2]], { azimut: az, elevation: 8, distance: 5.0, fov: 46, y: 660, ...o }),
  deux: (a: Vec3, b: Vec3, az: number, o: OptionsCadrage = {}) =>
    plan([(a[0] + b[0]) / 2, a[1] + 0.75, (a[2] + b[2]) / 2], { azimut: az, elevation: 8, distance: 6.0, fov: 46, y: 680, ...o }),
  moyen: (p: Vec3, az: number, o: OptionsCadrage = {}) => plan([p[0], p[1] + 0.85, p[2]], { azimut: az, elevation: 6, distance: 3.6, fov: 44, y: 640, ...o }),
  gros: (p: Vec3, az: number, o: OptionsCadrage = {}) => plan([p[0], p[1] + 1.12, p[2]], { azimut: az, elevation: 6, distance: 2.6, fov: 36, y: 590, ...o }),
};

export type OptionsPlan = { azimut: number; elevation: number; distance: number; fov?: number; x?: number; y?: number };
export const plan = (sujet: Vec3, o: OptionsPlan): { position: Vec3; cible: Vec3; fov: number } => {
  const fov = o.fov ?? 40;
  const rad = Math.PI / 180;
  const az = o.azimut * rad;
  const el = o.elevation * rad;
  const position: Vec3 = [
    sujet[0] + o.distance * Math.sin(az) * Math.cos(el),
    sujet[1] + o.distance * Math.sin(el),
    sujet[2] + o.distance * Math.cos(az) * Math.cos(el),
  ];
  // Angles (depuis l'axe optique) auxquels le sujet doit apparaître
  const tv = Math.tan((fov * rad) / 2);
  const th = tv * (LARGEUR / HAUTEUR);
  const dy = Math.atan(((HAUTEUR / 2 - (o.y ?? 620)) / (HAUTEUR / 2)) * tv); // > 0 : sujet au-dessus du centre
  const dx = Math.atan((((o.x ?? 500) - LARGEUR / 2) / (LARGEUR / 2)) * th); // > 0 : sujet à droite du centre
  // Direction caméra -> sujet, puis on vise plus bas (dy) et plus à gauche (dx) pour décaler le sujet
  const lacet = Math.atan2(sujet[0] - position[0], sujet[2] - position[2]);
  const tangage = -el;
  const l2 = lacet + dx;
  const t2 = tangage - dy;
  const cible: Vec3 = [position[0] + Math.sin(l2) * Math.cos(t2) * o.distance, position[1] + Math.sin(t2) * o.distance, position[2] + Math.cos(l2) * Math.cos(t2) * o.distance];
  return { position, cible, fov };
};
