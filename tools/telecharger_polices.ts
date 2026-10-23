// Copie les polices Google utilisées par la chaîne dans public/polices/ pour que les rendus
// ne dépendent pas d'Internet. Usage : npx tsx tools/telecharger_polices.ts
import { getInfo as montserrat } from "@remotion/google-fonts/Montserrat";
import { getInfo as shareTechMono } from "@remotion/google-fonts/ShareTechMono";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Toute police ajoutée ici doit aussi être déclarée dans src/systeme/polices.ts
const POLICES = [
  { nom: "Montserrat", info: montserrat(), graisses: ["600", "800", "900"] },
  { nom: "ShareTechMono", info: shareTechMono(), graisses: ["400"] },
];
const SOUS_ENSEMBLES = ["latin", "latin-ext"];

const dossier = path.resolve("public/polices");
await mkdir(dossier, { recursive: true });
for (const p of POLICES) {
  for (const graisse of p.graisses) {
    const urls = (p.info.fonts.normal as Record<string, Record<string, string>>)[graisse];
    for (const sous of SOUS_ENSEMBLES) {
      if (!urls[sous]) continue;
      const r = await fetch(urls[sous]);
      if (!r.ok) throw new Error(`${p.nom} ${graisse} ${sous} : HTTP ${r.status}`);
      const fichier = path.join(dossier, `${p.nom}-${graisse}-${sous}.woff2`);
      await writeFile(fichier, Buffer.from(await r.arrayBuffer()));
      console.log("ok", path.relative(process.cwd(), fichier));
    }
  }
}
