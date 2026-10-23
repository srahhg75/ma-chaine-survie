// Affiche l'identifiant de la Composition Remotion d'un épisode (utilisé par boucle.sh et final.sh).
// Usage : npx tsx tools/composition.ts 000-demo
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DonneesEpisode, idComposition } from "../src/systeme/episode";

const fichier = path.resolve("src/episodes", process.argv[2] ?? "", "donnees.ts");
if (!existsSync(fichier)) throw new Error(`Épisode introuvable : ${fichier}`);
const { donnees } = (await import(pathToFileURL(fichier).href)) as { donnees: DonneesEpisode };
console.log(idComposition(donnees));
