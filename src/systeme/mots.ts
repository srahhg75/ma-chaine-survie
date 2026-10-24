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
  voix?: string; // "narrateur" (défaut) ou prénom du personnage qui dit la réplique
};

export type Alignement = { fps: number; duree: number; phrases: Phrase[]; mots: Mot[] };

export const ALIGNEMENT_VIDE: Alignement = { fps: 30, duree: 0, phrases: [], mots: [] };

// Bloc de sous-titres : 2 à 4 mots (2 dans une phrase-chute), jamais à cheval sur deux phrases.
// chute : affiché en très gros ; voix : personnage qui parle (couleur + nom) ; hook : les 2 premières phrases.
export type Bloc = { mots: Mot[]; fDebut: number; fFin: number; chute: boolean; voix: string; hook: boolean };

export const NARRATEUR = "narrateur";
export const estChiffre = (m: Mot) => /\d/.test(m.mot);

// Taille d'un mot relative au corps des sous-titres (rendu ET contrôle de place) : chiffres-ressources géants,
// mots-clés plus gros, phrase-chute et hook agrandis.
export const echelleMot = (m: Mot, bloc: Pick<Bloc, "chute" | "hook">) =>
  (m.style === "ressource" && estChiffre(m) ? 1.5 : m.style !== "normal" ? 1.2 : 1) * (bloc.chute ? 1.3 : bloc.hook ? 1.1 : 1);

const longueur = (mots: Mot[]) => mots.reduce((n, m) => n + m.mot.length + 1, 0);

// Phrases lues par-dessus le carton de fin (@carton…) : le carton affiche déjà le texte, pas de sous-titres
export const estCarton = (p?: Phrase) => !!p && p.id.startsWith("carton");

export const blocsSousTitres = (tous: Mot[], phrases: Phrase[] = [], maxMots = 4, maxCaracteres = 22): Bloc[] => {
  const mots = tous.filter((m) => !estCarton(phrases[m.phrase]));
  const groupes: Mot[][] = [];
  let courant: Mot[] = [];
  mots.forEach((m, i) => {
    const suivant = mots[i + 1];
    const max = phrases[m.phrase]?.chute ? 2 : maxMots;
    // Couper AVANT ce mot si le bloc deviendrait trop long
    if (courant.length >= 2 && longueur([...courant, m]) > maxCaracteres) {
      groupes.push(courant);
      courant = [];
    }
    courant.push(m);
    const finPhrase = !suivant || suivant.phrase !== m.phrase;
    const ponctuation = /[.!?…:;]\s*»?$/.test(m.mot) || (/,$/.test(m.mot) && courant.length >= 2);
    const pause = suivant ? suivant.debut - m.fin > 0.35 : true;
    if (courant.length >= max || finPhrase || ponctuation || pause) {
      groupes.push(courant);
      courant = [];
    }
  });
  if (courant.length) groupes.push(courant);

  // Fusionne les blocs d'un seul mot avec le précédent ou le suivant (même phrase) quand c'est possible
  const fusion: Mot[][] = [];
  for (const g of groupes) {
    const prec = fusion[fusion.length - 1];
    const max = phrases[g[0].phrase]?.chute ? 2 : maxMots;
    if (g.length === 1 && prec && prec.length < max && prec[0].phrase === g[0].phrase && !/[.!?…]$/.test(prec[prec.length - 1].mot)) {
      prec.push(g[0]);
    } else fusion.push([...g]);
  }

  // Un bloc reste affiché jusqu'au début du suivant (pas de clignotement), au plus 0,6 s après son dernier mot
  return fusion.map((g, i) => {
    const suivant = fusion[i + 1];
    const finNaturelle = g[g.length - 1].fFin + 18;
    const p = phrases[g[0].phrase];
    return {
      mots: g,
      fDebut: g[0].fDebut,
      fFin: suivant ? Math.min(suivant[0].fDebut, finNaturelle) : finNaturelle,
      chute: !!p?.chute,
      voix: p?.voix ?? NARRATEUR,
      hook: g[0].phrase < 2,
    };
  });
};
