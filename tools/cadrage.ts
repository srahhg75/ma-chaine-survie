// Aide au cadrage : pour chaque plan tenu, position à l'écran (pixels 1080×1920) des personnages (pieds, tête)
// et des points nommés. Usage : npx tsx tools/cadrage.ts 001-h72 [point=x,y,z …]
import { chargerEpisode } from "./charger";
import { etatCamera, project } from "../src/systeme/camera";
import { CORPS, hauteurBassin } from "../src/systeme/personnage/poses";
import { etatPersonnage } from "../src/systeme/personnage/trajet";
import { Vec3 } from "../src/systeme/maths";

const id = process.argv[2];
const { resolu: r, alignement } = await chargerEpisode(id);
const fps = r.fps;
const mod = await import(`../src/episodes/${id}/donnees.ts`);
const points: Record<string, Vec3> = mod.P ?? {};
const fmt = (p: { x: number; y: number; devant: boolean }) => (p.devant ? `${Math.round(p.x)},${Math.round(p.y)}` : "derrière");
r.camera.forEach((c, i) => {
  const fin = i + 1 < r.camera.length ? r.camera[i + 1].fDepart : r.duree;
  const f = Math.round((c.fArrivee + fin) / 2);
  const cam = etatCamera(r.camera, f, fps);
  const phrase = alignement.phrases.find((p) => p.fDebut <= f && p.fFin >= f - 15)?.id ?? "-";
  const persos = r.personnages
    .map((p) => {
      const e = etatPersonnage(p, f, fps);
      const k = p.taille;
      const sommet = (hauteurBassin(e.pose) + CORPS.bassinVersEpaules + CORPS.cou + 2 * CORPS.rayonTete + 0.06) * k;
      return `${p.id} pieds ${fmt(project(e.position, cam))} tête ${fmt(project([e.position[0], sommet, e.position[2]], cam))}`;
    })
    .filter((s) => !s.startsWith("fantome"))
    .join(" | ");
  const proches = Object.entries(points)
    .filter(([, v]) => Array.isArray(v) && v.length === 3)
    .map(([n, v]) => [n, project(v as Vec3, cam)] as const)
    .filter(([, p]) => p.devant && p.x > -100 && p.x < 1180 && p.y > -100 && p.y < 2020)
    .map(([n, p]) => `${n} ${fmt(p)}`)
    .join(", ");
  console.log(`#${i} ${(c.fArrivee / fps).toFixed(2)}→${(fin / fps).toFixed(2)} s [${phrase}] ${persos}\n     ${proches}`);
});
