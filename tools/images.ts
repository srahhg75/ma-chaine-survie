// Images fixes rapides d'instants précis (un seul « bundle » pour toutes les images).
// Usage : npx tsx tools/images.ts 000-demo 1.5 "chute:jamais" "regle.fin-0.2" [--guide] [--demi]
//         npx tsx tools/images.ts banc-essai 0.5 2.5 4.5          (banc d'essai du personnage)
// Sortie : qc/<id>/images/<instant>.png
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DonneesEpisode, idComposition } from "../src/systeme/episode";
import { FPS } from "../src/systeme/format";
import { Alignement } from "../src/systeme/mots";
import { instant } from "../src/systeme/timeline";

const args = process.argv.slice(2);
const id = args[0];
const guide = args.includes("--guide");
const echelle = args.includes("--demi") ? 0.5 : 1;
const instants = args.slice(1).filter((a) => !a.startsWith("--"));
if (!id || !instants.length) throw new Error('Usage : npx tsx tools/images.ts <épisode|banc-essai> <instant> [instant…] [--guide] [--demi]');

const fichierDonnees = path.resolve("src/episodes", id, "donnees.ts");
const compositionId =
  id === "banc-essai" ? "banc-essai" : existsSync(fichierDonnees) ? idComposition(((await import(pathToFileURL(fichierDonnees).href)) as { donnees: DonneesEpisode }).donnees) : `ep${id}`;
const mots = path.resolve("public", id, "mots.json");
const alignement: Alignement | null = existsSync(mots) ? JSON.parse(readFileSync(mots, "utf-8")) : null;
const enSecondes = (a: string) => (/^-?\d+(\.\d+)?$/.test(a) ? parseFloat(a) : alignement ? instant(a, alignement) : NaN);

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const inputProps = { guide, brouillon: args.includes("--brouillon") };
const composition = await selectComposition({ serveUrl, id: compositionId, inputProps });
const dossier = path.resolve("qc", id, "images");
mkdirSync(dossier, { recursive: true });
for (const a of instants) {
  const sec = enSecondes(a);
  if (Number.isNaN(sec)) throw new Error(`Instant illisible : ${a}`);
  const frame = Math.min(composition.durationInFrames - 1, Math.max(0, Math.round(sec * FPS)));
  const sortie = path.join(dossier, `${a.replace(/[^\w.+-]/g, "_")}${guide ? "_guide" : ""}.png`);
  await renderStill({ composition, serveUrl, output: sortie, frame, inputProps, scale: echelle, timeoutInMilliseconds: 180000, chromiumOptions: { gl: process.platform === "linux" && !existsSync("/dev/dri") ? "swangle" : "angle" } });
  console.log(`${a} (${sec.toFixed(2)} s, image ${frame}) -> ${path.relative(process.cwd(), sortie)}`);
}
