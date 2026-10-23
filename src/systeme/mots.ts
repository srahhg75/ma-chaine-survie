// Format écrit par tools/aligner.py (public/NNN-nom/mots.json)
export type StyleMot = "normal" | "ressource" | "danger";

export type Mot = {
  mot: string; // texte exact du script (ponctuation comprise)
  phrase: number; // index de la phrase
  style: StyleMot;
  debut: number;
  fin: number;
  fDebut: number;
  fFin: number;
  conf: number;
  source: "vosk" | "interpole";
};

export type Phrase = {
  id: string;
  index: number;
  chute: boolean;
  texte: string;
  debut: number;
  fin: number;
  fDebut: number;
  fFin: number;
  premierMot: number;
  dernierMot: number;
};

export type Alignement = { fps: number; duree: number; phrases: Phrase[]; mots: Mot[] };

export const ALIGNEMENT_VIDE: Alignement = { fps: 30, duree: 0, phrases: [], mots: [] };

// Bloc de sous-titres : 2 à 4 mots, jamais à cheval sur deux phrases.
export type Bloc = { mots: Mot[]; fDebut: number; fFin: number };

const longueur = (mots: Mot[]) => mots.reduce((n, m) => n + m.mot.length + 1, 0);

export const blocsSousTitres = (mots: Mot[], maxMots = 4, maxCaracteres = 22): Bloc[] => {
  const groupes: Mot[][] = [];
  let courant: Mot[] = [];
  mots.forEach((m, i) => {
    const suivant = mots[i + 1];
    // Couper AVANT ce mot si le bloc deviendrait trop long
    if (courant.length >= 2 && longueur([...courant, m]) > maxCaracteres) {
      groupes.push(courant);
      courant = [];
    }
    courant.push(m);
    const finPhrase = !suivant || suivant.phrase !== m.phrase;
    const ponctuation = /[.!?…:;]\s*»?$/.test(m.mot) || (/,$/.test(m.mot) && courant.length >= 2);
    const pause = suivant ? suivant.debut - m.fin > 0.35 : true;
    if (courant.length >= maxMots || finPhrase || ponctuation || pause) {
      groupes.push(courant);
      courant = [];
    }
  });
  if (courant.length) groupes.push(courant);

  // Fusionne les blocs d'un seul mot avec le précédent ou le suivant (même phrase) quand c'est possible
  const fusion: Mot[][] = [];
  for (const g of groupes) {
    const prec = fusion[fusion.length - 1];
    if (g.length === 1 && prec && prec.length < maxMots && prec[0].phrase === g[0].phrase && !/[.!?…]$/.test(prec[prec.length - 1].mot)) {
      prec.push(g[0]);
    } else fusion.push([...g]);
  }

  // Un bloc reste affiché jusqu'au début du suivant (pas de clignotement), au plus 0,6 s après son dernier mot
  return fusion.map((g, i) => {
    const suivant = fusion[i + 1];
    const finNaturelle = g[g.length - 1].fFin + 18;
    return { mots: g, fDebut: g[0].fDebut, fFin: suivant ? Math.min(suivant[0].fDebut, finNaturelle) : finNaturelle };
  });
};
