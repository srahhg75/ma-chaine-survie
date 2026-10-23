// Charge les données d'un épisode + son alignement (mots.json) et résout toutes les ancres (hors navigateur).
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DonneesEpisode, EpisodeResolu, resoudreEpisode } from "../src/systeme/episode";
import { FPS } from "../src/systeme/format";
import { Alignement } from "../src/systeme/mots";

export const chargerEpisode = async (id: string): Promise<{ donnees: DonneesEpisode; alignement: Alignement; resolu: EpisodeResolu }> => {
  if (!id) throw new Error("Indiquer l'épisode, ex. : 000-demo");
  const fichier = path.resolve("src/episodes", id, "donnees.ts");
  if (!existsSync(fichier)) throw new Error(`Épisode introuvable : ${fichier}`);
  const mots = path.resolve("public", id, "mots.json");
  if (!existsSync(mots)) throw new Error(`Alignement absent : ${mots} (lancer couper_blancs.py --mots ou aligner.py)`);
  const { donnees } = (await import(pathToFileURL(fichier).href)) as { donnees: DonneesEpisode };
  const alignement = JSON.parse(readFileSync(mots, "utf-8")) as Alignement;
  return { donnees, alignement, resolu: resoudreEpisode(donnees, alignement, FPS) };
};
