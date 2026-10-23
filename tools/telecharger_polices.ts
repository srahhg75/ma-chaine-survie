// Copie les polices Google utilisées par la chaîne dans public/polices/ pour que les rendus
// ne dépendent pas d'Internet. Usage : npx tsx tools/telecharger_polices.ts
import { getInfo as anton } from "@remotion/google-fonts/Anton";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const POLICES = [{ nom: "Anton", info: anton(), graisse: "400" }];
const SOUS_ENSEMBLES = ["latin", "latin-ext"];

const dossier = path.resolve("public/polices");
await mkdir(dossier, { recursive: true });
for (const p of POLICES) {
  const urls = (p.info.fonts.normal as Record<string, Record<string, string>>)[p.graisse];
  for (const sous of SOUS_ENSEMBLES) {
    const r = await fetch(urls[sous]);
    if (!r.ok) throw new Error(`${p.nom} ${sous} : HTTP ${r.status}`);
    const fichier = path.join(dossier, `${p.nom}-${p.graisse}-${sous}.woff2`);
    await writeFile(fichier, Buffer.from(await r.arrayBuffer()));
    console.log("ok", path.relative(process.cwd(), fichier));
  }
}
