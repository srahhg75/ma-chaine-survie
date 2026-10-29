import { CleCamera, CleCameraResolue, resoudreCamera } from "./camera";
import { ElementHud, ElementHudResolu } from "./hud/types";
import { DonneesDecor } from "./kit3d/decor";
import { OptionsPost } from "./kit3d/PostProcess.types";
import { Vec3 } from "./maths";
import { Alignement } from "./mots";
import { contactsPas, DonneesPersonnage, PersonnageResolu, resoudrePersonnage } from "./personnage/trajet";
import { Ancre, image, instant } from "./timeline";

/*
 * Un épisode = des DONNÉES (src/episodes/NNN-nom/donnees.ts), toutes calées sur la voix par des ancres.
 * Ces données sont lues par le rendu (EpisodeStandard.tsx), le contrôle qualité (tools/qc.ts) et le mixage
 * (tools/mix.py, via public/NNN-nom/timeline.json).
 */
export type Son = {
  a: Ancre; // instant où tombe le MOMENT FORT du son (son « apex »)
  id: string; // son de la banque earshot (sombre uniquement : voir tools/mix.py)
  gain?: number; // dB par rapport au niveau de base des bruitages
  duree?: number; // s (longueur exacte demandée à earshot)
  pitch?: string; // note ou Hz
};

// vent/drone/coeur/ville = fonds ; eau/glouglou/grincement = bruitages d'objets synthétisés (tools/mix.py)
export type TypeAmbiance = "vent" | "drone" | "coeur" | "ville" | "eau" | "glouglou" | "grincement";
export type Ambiance = { type: TypeAmbiance; de: Ancre; a: Ancre; niveau?: number; fondu?: number; bpm?: number };

// Ce qui ne doit jamais être caché par le HUD ni les sous-titres
export type Sujet = { de: Ancre; a: Ancre; point?: Vec3; personnage?: string; hauteur?: number };

export type DonneesEpisode = {
  id: string; // "NNN-nom"
  titre: string;
  decor: DonneesDecor;
  personnages: DonneesPersonnage[];
  camera: CleCamera[];
  hud: ElementHud[];
  sons: Son[];
  ambiances: Ambiance[];
  sujets: Sujet[];
  queue?: number; // secondes après le dernier mot (carton de fin), défaut 2
  post?: OptionsPost;
  demonstration?: boolean; // épisode technique : durée libre (pas de contrôle 70-120 s)
  composition?: string; // identifiant de la Composition Remotion (défaut : "ep" + id)
  dureeFixe?: number; // durée imposée en secondes (sinon : dernier mot + queue)
  // Signal « STOP » (retour en arrière après la mauvaise branche d'un choix A/B) : image en noir et blanc qui
  // tremble comme une bande rembobinée, mot STOP en grand ; dessiné par EpisodeStandard
  retours?: Retour[];
};

// `depuis` (début de la mauvaise branche) active le SON de rembobinage (tools/mix.py) : l'audio de la branche
// rejoué à l'envers en accélérant, moteur et souffle de bande qui montent ; `gain` en dB
export type Retour = { de: Ancre; a: Ancre; depuis?: Ancre; gain?: number };

export const idComposition = (d: DonneesEpisode) => d.composition ?? `ep${d.id}`;
export const dureeSecondes = (d: DonneesEpisode, al: Alignement) => d.dureeFixe ?? instant("fin", al) + (d.queue ?? 2);

export type EpisodeResolu = {
  donnees: DonneesEpisode;
  fps: number;
  duree: number; // en images
  camera: CleCameraResolue[];
  hud: (ElementHudResolu & { fChangements?: number[] })[];
  personnages: PersonnageResolu[];
  sons: (Son & { t: number })[];
  ambiances: (Ambiance & { tDe: number; tA: number })[];
  sujets: (Sujet & { fDe: number; fA: number })[];
  retours: { de: number; a: number; depuis?: number; gain: number }[]; // en secondes
};

export const resoudreEpisode = (d: DonneesEpisode, al: Alignement, fps: number): EpisodeResolu => {
  const fin = dureeSecondes(d, al);
  const duree = Math.ceil(fin * fps);
  return {
    donnees: d,
    fps,
    duree,
    camera: resoudreCamera(d.camera, al, fps),
    hud: d.hud.map((e, index) => ({
      ...e,
      index,
      fDe: e.de !== undefined ? image(e.de, al, fps) : 0,
      fA: e.a !== undefined ? image(e.a, al, fps) : duree,
      fChangements: e.type === "montre" ? (e.changements ?? []).map((c) => image(c.a, al, fps)) : e.type === "telephone" ? (e.messages ?? []).map((m) => image(m.a, al, fps)) : undefined,
    })) as EpisodeResolu["hud"],
    personnages: d.personnages.map((p) => resoudrePersonnage(p, al, fps)),
    sons: d.sons.map((s) => ({ ...s, t: instant(s.a, al) })),
    ambiances: d.ambiances.map((a) => ({ ...a, tDe: instant(a.de, al), tA: Math.min(fin, instant(a.a, al)) })),
    sujets: d.sujets.map((s) => ({ ...s, fDe: image(s.de, al, fps), fA: image(s.a, al, fps) })),
    retours: (d.retours ?? []).map((x) => ({
      de: instant(x.de, al),
      a: instant(x.a, al),
      depuis: x.depuis !== undefined ? instant(x.depuis, al) : undefined,
      gain: x.gain ?? 0,
    })),
  };
};

// Ce dont le mixage a besoin (écrit dans public/NNN-nom/timeline.json par tools/timeline.ts)
export const exportMixage = (r: EpisodeResolu) => ({
  episode: r.donnees.id,
  fps: r.fps,
  duree: r.duree / r.fps,
  sons: r.sons.map(({ t, id, gain, duree, pitch }) => ({ t, id, gain: gain ?? 0, duree, pitch })),
  ambiances: r.ambiances.map(({ type, tDe, tA, niveau, fondu, bpm }) => ({ type, de: tDe, a: tA, niveau: niveau ?? 0, fondu: fondu ?? 1.0, bpm })),
  pas: r.personnages.flatMap((p) => contactsPas(p, r.fps).map((t) => ({ t, personnage: p.id }))),
  rembobinages: r.retours.filter((x) => x.depuis !== undefined).map(({ de, a, depuis, gain }) => ({ de, a, depuis, gain })),
});
