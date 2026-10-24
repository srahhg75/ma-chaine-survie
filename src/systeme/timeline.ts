import { Alignement, estCarton } from "./mots";

/*
 * Ancres de timeline : tout (caméra, HUD, sons, personnages) est calé sur la voix via mots.json.
 * Changer de voix = relancer l'alignement, rien d'autre.
 *
 * Syntaxe d'une ancre (chaîne) :
 *   "hook"                 début de la phrase @hook
 *   "hook.fin"             fin de la phrase
 *   "hook:bougie"          début du mot « bougie » dans la phrase (1re occurrence, sans accents ni casse)
 *   "hook:bougie.fin"      fin de ce mot
 *   "hook#3"               début du 4e mot de la phrase (index 0)
 *   "hook.fin+0.4"         décalage en secondes (+ ou -)
 *   "debut", "fin"         début (0 s) / fin de la voix ; "fin+1.5" = 1,5 s après le dernier mot
 *                          (les lignes @carton…, lues par-dessus le carton de fin, ne comptent pas)
 *   2.5                    nombre = secondes absolues (à éviter : ne suit pas la voix)
 */
export type Ancre = string | number;

const sansAccents = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export const instant = (ancre: Ancre, a: Alignement): number => {
  if (typeof ancre === "number") return ancre;
  const m = ancre.trim().match(/^([^+\-]+?)([+-]\d+(?:\.\d+)?)?$/);
  if (!m) throw new Error(`Ancre illisible : « ${ancre} »`);
  const decalage = m[2] ? parseFloat(m[2]) : 0;
  let corps = m[1].trim();
  let bord: "debut" | "fin" = "debut";
  if (corps.endsWith(".fin")) {
    bord = "fin";
    corps = corps.slice(0, -4);
  } else if (corps.endsWith(".debut")) corps = corps.slice(0, -6);

  if (corps === "debut") return decalage;
  if (corps === "fin") {
    const recit = a.mots.filter((m) => !estCarton(a.phrases[m.phrase]));
    return (recit.length ? recit[recit.length - 1].fin : a.duree) + decalage;
  }

  const [idPhrase, motCherche] = corps.split(/[:#]/);
  const phrase = a.phrases.find((p) => p.id === idPhrase);
  if (!phrase) throw new Error(`Ancre « ${ancre} » : phrase @${idPhrase} absente du script`);
  if (motCherche === undefined) return (bord === "fin" ? phrase.fin : phrase.debut) + decalage;

  const mots = a.mots.slice(phrase.premierMot, phrase.dernierMot + 1);
  // « appartement » trouve aussi « l'appartement. », « peut » trouve « peut-être »
  const correspond = (w: string) => sansAccents(w) === sansAccents(motCherche) || w.split(/[’'\-]/).some((part) => sansAccents(part) === sansAccents(motCherche));
  const mot = corps.includes("#") ? mots[parseInt(motCherche, 10)] : mots.find((w) => correspond(w.mot));
  if (!mot) throw new Error(`Ancre « ${ancre} » : mot « ${motCherche} » introuvable dans @${idPhrase}`);
  return (bord === "fin" ? mot.fin : mot.debut) + decalage;
};

export const image = (ancre: Ancre, a: Alignement, fps = a.fps || 30) => Math.round(instant(ancre, a) * fps);
