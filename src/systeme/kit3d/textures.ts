import { random } from "remotion";
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, Texture } from "three";

// Textures procédurales dessinées sur un canvas (déterministes : random() de Remotion, jamais Math.random()).
// Une texture couvre `metres` × `metres` ; la répétition est réglée par la géométrie (voir repeter()).
export type TypeTexture = "parquet" | "carrelage" | "papier" | "beton" | "moquette" | "peint" | "facade";

const cache = new Map<string, Texture>();
const TAILLE = 512;

const teinte = (base: [number, number, number], variation: number, graine: string) => {
  const k = 1 + (random(graine) - 0.5) * variation;
  return `rgb(${base.map((c) => Math.round(Math.min(255, c * k))).join(",")})`;
};

const hex = (couleur: string): [number, number, number] => {
  const c = couleur.replace("#", "");
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
};

const taches = (ctx: CanvasRenderingContext2D, graine: string, n: number, rayonMax: number, alpha: number, clair = false) => {
  for (let i = 0; i < n; i++) {
    const x = random(`${graine}x${i}`) * TAILLE;
    const y = random(`${graine}y${i}`) * TAILLE;
    const r = 2 + random(`${graine}r${i}`) * rayonMax;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const c = clair ? "255,255,255" : "0,0,0";
    g.addColorStop(0, `rgba(${c},${alpha * random(`${graine}a${i}`)})`);
    g.addColorStop(1, `rgba(${c},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
};

const dessiner: Record<TypeTexture, (ctx: CanvasRenderingContext2D, couleur: string, g: string) => void> = {
  parquet: (ctx, couleur, g) => {
    const base = hex(couleur);
    const lames = 8;
    const h = TAILLE / lames;
    for (let r = 0; r < lames; r++) {
      let x = -random(`${g}d${r}`) * TAILLE;
      let k = 0;
      while (x < TAILLE) {
        const l = TAILLE * (0.45 + random(`${g}l${r}-${k}`) * 0.5);
        ctx.fillStyle = teinte(base, 0.35, `${g}t${r}-${k}`);
        ctx.fillRect(x, r * h, l, h);
        // veinage
        ctx.strokeStyle = "rgba(40,20,5,0.18)";
        ctx.lineWidth = 1;
        for (let v = 0; v < 5; v++) {
          const y = r * h + 4 + random(`${g}v${r}-${k}-${v}`) * (h - 8);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.bezierCurveTo(x + l * 0.3, y + 3, x + l * 0.6, y - 3, x + l, y + 1);
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(20,10,0,0.55)";
        ctx.fillRect(x, r * h, 2, h); // joint de bout
        x += l;
        k++;
      }
      ctx.fillStyle = "rgba(20,10,0,0.6)";
      ctx.fillRect(0, r * h, TAILLE, 2); // joint long
    }
  },
  carrelage: (ctx, couleur, g) => {
    const base = hex(couleur);
    const n = 4;
    const c = TAILLE / n;
    ctx.fillStyle = "#6f6a63"; // joints
    ctx.fillRect(0, 0, TAILLE, TAILLE);
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        ctx.fillStyle = teinte(base, 0.1, `${g}${i}-${j}`);
        ctx.fillRect(i * c + 3, j * c + 3, c - 6, c - 6);
        const grad = ctx.createLinearGradient(i * c, j * c, i * c + c, j * c + c);
        grad.addColorStop(0, "rgba(255,255,255,0.10)");
        grad.addColorStop(1, "rgba(0,0,0,0.08)");
        ctx.fillStyle = grad;
        ctx.fillRect(i * c + 3, j * c + 3, c - 6, c - 6);
      }
    taches(ctx, `${g}s`, 30, 30, 0.12);
  },
  papier: (ctx, couleur, g) => {
    const base = hex(couleur);
    ctx.fillStyle = `rgb(${base.join(",")})`;
    ctx.fillRect(0, 0, TAILLE, TAILLE);
    // rayures verticales + petits losanges
    const bandes = 8;
    for (let b = 0; b < bandes; b++) {
      ctx.fillStyle = b % 2 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
      ctx.fillRect((b * TAILLE) / bandes, 0, TAILLE / bandes, TAILLE);
    }
    ctx.fillStyle = "rgba(0,0,0,0.10)";
    for (let i = 0; i < bandes; i++)
      for (let j = 0; j < 8; j++) {
        const x = (i + 0.5) * (TAILLE / bandes);
        const y = (j + (i % 2) * 0.5) * (TAILLE / 8);
        ctx.beginPath();
        ctx.moveTo(x, y - 9);
        ctx.lineTo(x + 6, y);
        ctx.lineTo(x, y + 9);
        ctx.lineTo(x - 6, y);
        ctx.fill();
      }
    taches(ctx, `${g}u`, 18, 70, 0.1); // usure
  },
  beton: (ctx, couleur, g) => {
    const base = hex(couleur);
    ctx.fillStyle = `rgb(${base.join(",")})`;
    ctx.fillRect(0, 0, TAILLE, TAILLE);
    taches(ctx, `${g}a`, 220, 40, 0.12);
    taches(ctx, `${g}b`, 160, 25, 0.08, true);
    taches(ctx, `${g}c`, 900, 3, 0.35); // pores
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; // fissure
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    let x = random(`${g}fx`) * TAILLE;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < TAILLE) {
      x += (random(`${g}f${y}`) - 0.5) * 26;
      y += 12 + random(`${g}fy${y}`) * 20;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  },
  moquette: (ctx, couleur, g) => {
    ctx.fillStyle = couleur;
    ctx.fillRect(0, 0, TAILLE, TAILLE);
    taches(ctx, `${g}m`, 2500, 2, 0.25);
    taches(ctx, `${g}n`, 2500, 2, 0.15, true);
  },
  peint: (ctx, couleur, g) => {
    ctx.fillStyle = couleur;
    ctx.fillRect(0, 0, TAILLE, TAILLE);
    taches(ctx, `${g}p`, 60, 60, 0.06);
    taches(ctx, `${g}q`, 40, 50, 0.04, true);
  },
  // Façade d'immeuble : fenêtres (l'éclairage est géré par facadeLumineuse)
  facade: (ctx, couleur) => {
    ctx.fillStyle = couleur;
    ctx.fillRect(0, 0, TAILLE, TAILLE);
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) ctx.fillRect(i * 128 + 34, j * 64 + 16, 60, 34);
  },
};

export const texture = (type: TypeTexture, couleur: string, graine = "t"): Texture => {
  const cle = `${type}|${couleur}|${graine}`;
  const deja = cache.get(cle);
  if (deja) return deja;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = TAILLE;
  const ctx = canvas.getContext("2d")!;
  dessiner[type](ctx, couleur, graine);
  const t = new CanvasTexture(canvas);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  t.anisotropy = 8;
  cache.set(cle, t);
  return t;
};

// Copie d'une texture avec sa propre répétition (taille réelle d'un motif : `metres`)
export const repeter = (t: Texture, largeur: number, hauteur: number, metres = 2): Texture => {
  const c = t.clone();
  c.repeat.set(largeur / metres, hauteur / metres);
  c.needsUpdate = true;
  return c;
};

// Fenêtres d'une façade : allumées (chaudes) ou éteintes, selon `allumees` (0..1)
export const facadeLumineuse = (allumees: number, graine: string): Texture => {
  const cle = `facadeL|${allumees.toFixed(2)}|${graine}`;
  const deja = cache.get(cle);
  if (deja) return deja;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = TAILLE;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, TAILLE, TAILLE);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 8; j++) {
      if (random(`${graine}w${i}-${j}`) >= allumees) continue;
      // lumière vacillante de bougie si panne (peu de fenêtres), sinon éclairage normal
      ctx.fillStyle = allumees < 0.15 ? "#ff9a3c" : random(`${graine}c${i}-${j}`) > 0.3 ? "#ffd9a0" : "#b8d4ff";
      ctx.globalAlpha = 0.55 + random(`${graine}i${i}-${j}`) * 0.45;
      ctx.fillRect(i * 128 + 34, j * 64 + 16, 60, 34);
    }
  ctx.globalAlpha = 1;
  const t = new CanvasTexture(canvas);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = t.wrapT = RepeatWrapping;
  cache.set(cle, t);
  return t;
};
