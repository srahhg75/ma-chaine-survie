import { staticFile } from "remotion";

// Format écrit par tools/aligner.py
export type Mot = {
  mot: string;
  debut: number;
  fin: number;
  fDebut: number;
  fFin: number;
  conf: number;
  source: "vosk" | "interpole";
};

export type Alignement = { fps: number; duree: number; mots: Mot[] };

export const chargerMots = async (episode: string): Promise<Alignement> => {
  const r = await fetch(staticFile(`${episode}/mots.json`));
  if (!r.ok) throw new Error(`mots.json introuvable pour ${episode}`);
  return r.json();
};

// Regroupe les mots en courtes phrases de sous-titre : 3 mots max, coupe sur la ponctuation
// et sur les pauses de plus de 0,35 s.
export const grouperMots = (mots: Mot[], max = 3): Mot[][] => {
  const groupes: Mot[][] = [];
  let courant: Mot[] = [];
  mots.forEach((m, i) => {
    courant.push(m);
    const suivant = mots[i + 1];
    const ponctuation = /[.,!?…:;»]$/.test(m.mot);
    const pause = suivant ? suivant.debut - m.fin > 0.35 : true;
    if (courant.length >= max || ponctuation || pause) {
      groupes.push(courant);
      courant = [];
    }
  });
  if (courant.length) groupes.push(courant);
  return groupes;
};
