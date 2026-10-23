// Résout les ancres d'un épisode et écrit public/<id>/timeline.json (lu par tools/mix.py).
// Usage : npx tsx tools/timeline.ts 000-demo
import { writeFileSync } from "node:fs";
import { chargerEpisode } from "./charger";
import { exportMixage } from "../src/systeme/episode";

const id = process.argv[2];
const { resolu } = await chargerEpisode(id);
writeFileSync(`public/${id}/timeline.json`, JSON.stringify(exportMixage(resolu), null, 1));
console.log(`Timeline : public/${id}/timeline.json (${(resolu.duree / resolu.fps).toFixed(2)} s, ${resolu.sons.length} sons, ${resolu.ambiances.length} ambiances)`);
