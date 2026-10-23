// Affiche l'identifiant de la Composition Remotion d'un épisode (utilisé par boucle.sh et final.sh).
// Usage : npx tsx tools/composition.ts 000-demo            -> identifiant
//         npx tsx tools/composition.ts 000-demo --images   -> nombre d'images (utilisé par rendu_tranches.sh)
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DonneesEpisode, idComposition } from "../src/systeme/episode";
import { chargerEpisode } from "./charger";

const fichier = path.resolve("src/episodes", process.argv[2] ?? "", "donnees.ts");
if (!existsSync(fichier)) throw new Error(`Épisode introuvable : ${fichier}`);
if (process.argv.includes("--images")) {
  console.log((await chargerEpisode(process.argv[2])).resolu.duree);
} else {
  const { donnees } = (await import(pathToFileURL(fichier).href)) as { donnees: DonneesEpisode };
  console.log(idComposition(donnees));
}
