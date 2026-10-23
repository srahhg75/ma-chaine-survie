import { random } from "remotion";

// Petites fonctions partagées (rendu + contrôle qualité). Jamais Math.random() : random() de Remotion.
export type Vec3 = [number, number, number];

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export const ajoute = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const soustrait = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const echelle = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
export const norme = (a: Vec3) => Math.hypot(a[0], a[1], a[2]);
export const distance = (a: Vec3, b: Vec3) => norme(soustrait(a, b));
export const normalise = (a: Vec3): Vec3 => {
  const n = norme(a) || 1;
  return [a[0] / n, a[1] / n, a[2] / n];
};
export const angleEntre = (a: Vec3, b: Vec3) => {
  const na = normalise(a);
  const nb = normalise(b);
  return Math.acos(clamp(na[0] * nb[0] + na[1] * nb[1] + na[2] * nb[2], -1, 1));
};

// Accélérations douces
export const doux = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; // in-out cubique
};
export const tresDoux = (t: number) => {
  const x = clamp(t);
  return x * x * x * (x * (x * 6 - 15) + 10); // smootherstep
};

// Courbe de Bézier quadratique (pour contourner un obstacle pendant un déplacement)
export const bezier3 = (a: Vec3, c: Vec3, b: Vec3, t: number): Vec3 => lerp3(lerp3(a, c, t), lerp3(c, b, t), t);

// Bruit 1D lisse et déterministe (vacillement de bougie, dérive de caméra…)
export const bruit = (graine: string, t: number) => {
  const i = Math.floor(t);
  const f = t - i;
  const a = random(`${graine}-${i}`) * 2 - 1;
  const b = random(`${graine}-${i + 1}`) * 2 - 1;
  return lerp(a, b, f * f * (3 - 2 * f));
};
// Bruit fractal (plusieurs octaves)
export const bruitFractal = (graine: string, t: number, octaves = 3) => {
  let v = 0;
  let amp = 0.5;
  let freq = 1;
  for (let o = 0; o < octaves; o++) {
    v += amp * bruit(`${graine}-${o}`, t * freq);
    amp *= 0.5;
    freq *= 2.1;
  }
  return v;
};
