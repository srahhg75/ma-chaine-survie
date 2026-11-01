// Contrôle qualité automatique d'un épisode DESSINÉ EN 2D (src/episodes/<id>/donnees.ts exporte `scene`),
// image par image, avec les règles de qc/lecons.md qui s'appliquent au dessin.
// Usage : npx tsx tools/qc2d.ts 010-heritiere      (code de sortie 1 s'il reste une erreur)
// Rapport : qc/<id>/rapport_qc.md (mêmes sections que tools/qc.ts, lues par tools/boucle.sh)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chargerEpisode } from "./charger";
import { BANDE_SUJET, CADRAGE, DUREE_MAX_S, DUREE_MIN_S, ETIQUETTE_MIN_S, HAUTEUR, LARGEUR, RYTHME_MAX_S, ZONE_SURE } from "../src/systeme/format";
import { boiteHud, boiteSousTitre, chevauche, contient, Rect } from "../src/systeme/hud/boites";
import { blocsSousTitres } from "../src/systeme/mots";
import { image } from "../src/systeme/timeline";
import { cadreA, DonneesScene2D, etatObjet, etatPerso, HAUTEUR_LOCALE, present, resoudrePlans, versEcran } from "../src/systeme/dessin2d/scene2d";

const id = process.argv[2];
const { alignement: al, resolu: r } = await chargerEpisode(id);
const { scene } = (await import(pathToFileURL(path.resolve("src/episodes", id, "donnees.ts")).href)) as { scene: DonneesScene2D };
const fps = r.fps;
const t = (f: number) => `${(f / fps).toFixed(2)} s`;

type Probleme = { regle: string; detail: string; f0: number; f1: number; grave: boolean };
const problemes: Probleme[] = [];
const signaler = (regle: string, detail: string, f: number, grave = true) => {
  const dernier = [...problemes].reverse().find((p) => p.regle === regle && p.detail === detail);
  if (dernier && f - dernier.f1 <= 2) dernier.f1 = f;
  else problemes.push({ regle, detail, f0: f, f1: f, grave });
};
const dansZoneSure = (b: Rect) => b.x >= ZONE_SURE.gauche - 1 && b.x + b.l <= ZONE_SURE.droite + 1 && b.y >= ZONE_SURE.haut - 1 && b.y + b.h <= ZONE_SURE.bas + 1;

// ---------- Règles globales ----------
const dureeS = r.duree / fps;
if (dureeS < DUREE_MIN_S || dureeS > DUREE_MAX_S) signaler("Durée", `${dureeS.toFixed(1)} s hors de ${DUREE_MIN_S}-${DUREE_MAX_S} s`, 0);

// toutes les ancres de la scène doivent exister (sinon le rendu plante)
const ancres: [string, string | number][] = [
  ...scene.plans.map((p) => ["plan", p.a] as [string, string | number]),
  ...scene.persos.flatMap((p) => [...p.cles.map((c) => [p.id, c.a] as [string, string | number]), ...(p.de !== undefined ? [[p.id, p.de]] : []), ...(p.a !== undefined ? [[p.id, p.a]] : [])] as [string, string | number][]),
  ...scene.objets.flatMap((o) => o.cles.map((c) => [o.id, c.a] as [string, string | number])),
  ...scene.effets.map((e) => ["effet " + e.type, e.a] as [string, string | number]),
  ...scene.onomatopees.flatMap((o) => [["« " + o.texte + " »", o.de], ["« " + o.texte + " »", o.a]] as [string, string | number][]),
  ...Object.entries(scene.etats ?? {}).map(([k, a]) => ["état " + k, a] as [string, string | number]),
];
let ancresOk = true;
for (const [qui, a] of ancres)
  try {
    image(a, al, fps);
  } catch (e) {
    ancresOk = false;
    signaler("Ancre introuvable", `${qui} : ${(e as Error).message}`, 0);
  }

for (const e of r.hud) {
  const d = (e.fA - e.fDe) / fps;
  if (d < ETIQUETTE_MIN_S) signaler("HUD : durée d'affichage", `${e.type} visible ${d.toFixed(2)} s (< ${ETIQUETTE_MIN_S} s)`, e.fDe);
}
for (const o of scene.onomatopees) {
  if (!ancresOk) break;
  const d = (image(o.a, al, fps) - image(o.de, al, fps)) / fps;
  if (d < 0.6) signaler("Onomatopée trop courte", `« ${o.texte} » visible ${d.toFixed(2)} s (< 0,6 s)`, image(o.de, al, fps));
}

const autorises = JSON.parse(readFileSync("tools/sons_autorises.json", "utf-8")) as { prefixes_autorises: string[]; mots_interdits: string[] };
for (const s of r.sons) {
  const ok = autorises.prefixes_autorises.some((p) => s.id.startsWith(p)) && !autorises.mots_interdits.some((m) => s.id.includes(m));
  if (!ok) signaler("Son non sombre", `« ${s.id} » n'est pas dans tools/sons_autorises.json`, Math.round(s.t * fps));
}

const tailles: number[] = [];
if (ancresOk) {
  const plans = resoudrePlans(scene.plans, al, fps);
  // ---------- Rythme : un nouvel état d'image toutes les ≤ 2,5 s ----------
  const ev = new Set<number>();
  plans.forEach((p, i) => i > 0 && (ev.add(p.fDepart), ev.add(p.fArrivee)));
  scene.persos.forEach((p) => p.cles.forEach((c) => ev.add(image(c.a, al, fps))));
  scene.effets.forEach((e) => ev.add(image(e.a, al, fps)));
  scene.onomatopees.forEach((o) => (ev.add(image(o.de, al, fps)), ev.add(image(o.a, al, fps))));
  r.hud.forEach((e) => (ev.add(e.fDe), ev.add(e.fA)));
  const debutCarton = Math.min(...r.hud.filter((e) => e.type === "carton").map((e) => e.fDe), r.duree);
  let prec = 0;
  for (const f of [...ev].filter((f) => f >= 0 && f <= r.duree).sort((a, b) => a - b).concat(r.duree)) {
    if (prec < debutCarton && (f - prec) / fps > RYTHME_MAX_S) signaler("Rythme", `aucun changement d'image pendant ${((f - prec) / fps).toFixed(1)} s (max ${RYTHME_MAX_S} s)`, prec);
    prec = f;
  }

  // ---------- Image par image ----------
  const blocs = blocsSousTitres(al.mots, al.phrases);
  const posPrec = new Map<string, { x: number; y: number; k: number }>();
  for (let f = 0; f < r.duree; f++) {
    const c = cadreA(plans, f);
    const tS = f / fps;
    const carton = r.hud.some((e) => e.type === "carton" && f >= e.fDe && f < e.fA);
    const bloc = blocs.find((b) => f >= b.fDebut && f < b.fFin);
    const boiteST = bloc ? boiteSousTitre(bloc) : null;
    const hud = r.hud.filter((e) => f >= e.fDe && f < e.fA).map((e) => ({ e, b: boiteHud(e, {} as never) }));
    const visibles = scene.persos.filter((p) => p.decor === c.decor && present(p, al, fps, f));
    let plusGrand = 0;
    const tetes: { id: string; x: number; y: number; r: number }[] = [];
    for (const p of visibles) {
      const e = etatPerso(p, al, fps, f);
      const enfant = p.apparence === "noe" || p.apparence === "enzo" ? HAUTEUR_LOCALE.enfant : HAUTEUR_LOCALE.adulte;
      const pieds = versEcran(c, e.x, e.y);
      const tete = versEcran(c, e.x, e.y + (95 - enfant) * e.echelle);
      const haut = versEcran(c, e.x, e.y - (enfant - 10) * e.echelle);
      const rayon = 80 * e.echelle * c.zoom;
      // vitesse (pas de téléportation hors coupe) : une personne mesure ≈ 1,75 m (adulte) ou 1,15 m (enfant)
      const avant = posPrec.get(p.id);
      const metre = (enfant === HAUTEUR_LOCALE.adulte ? 1000 / 1.75 : 650 / 1.15) * e.echelle;
      if (avant && Math.hypot(e.x - avant.x, e.y - avant.y) / metre * fps > 6) signaler("Téléportation", `${p.id} se déplace à plus de 6 m/s`, f);
      posPrec.set(p.id, { x: e.x, y: e.y, k: e.echelle });
      const dansImage = tete.x > -rayon && tete.x < LARGEUR + rayon && tete.y > -rayon && tete.y < HAUTEUR + rayon;
      if (!dansImage || p.figurant) continue;
      tetes.push({ id: p.id, x: tete.x, y: tete.y, r: rayon });
      if (!carton) plusGrand = Math.max(plusGrand, (Math.min(HAUTEUR, pieds.y) - Math.max(0, haut.y)) / HAUTEUR);
      const centreDansImage = tete.x >= 0 && tete.x <= LARGEUR;
      if (centreDansImage && haut.y < 0 && tete.y > 0) signaler("Tête coupée", `${p.id} : haut de la tête hors de l'image`, f);
      // (un personnage qui ENTRE ou SORT en marchant traverse forcément le bord : seulement à l'arrêt)
      if (centreDansImage && !e.marche && tete.x > ZONE_SURE.droite && tete.x < LARGEUR) signaler("Sujet sous les boutons TikTok", `${p.id} : tête dans la colonne de droite`, f);
      if (boiteST && centreDansImage && contient(boiteST, tete.x, tete.y, 10)) signaler("Sujet caché", `visage de ${p.id} sous les sous-titres`, f);
      for (const { e: h, b } of hud) if (h.type !== "carton" && contient(b, tete.x, tete.y, 10)) signaler("Sujet caché", `visage de ${p.id} sous ${h.type}`, f);
      if (centreDansImage && (tete.y < BANDE_SUJET.haut || tete.y > BANDE_SUJET.bas) && tete.y > 0 && tete.y < HAUTEUR) signaler("Cadrage du sujet", `visage de ${p.id} hors de la bande y=${BANDE_SUJET.haut}-${BANDE_SUJET.bas}`, f, false);
    }
    tailles.push(plusGrand);

    // celui qui parle est à l'image (sauf voix au téléphone : personnage absent du décor)
    const motCourant = al.mots.find((m) => tS >= m.debut && tS <= m.fin);
    const voix = motCourant ? al.phrases[motCourant.phrase]?.voix : undefined;
    if (voix && voix !== "narrateur" && !carton) {
      const parleur = visibles.find((p) => p.voix === voix);
      if (parleur && !tetes.some((x) => x.id === parleur.id && x.x > 0 && x.x < LARGEUR && x.y > ZONE_SURE.haut && x.y < ZONE_SURE.bas)) signaler("Celui qui parle est hors champ", `${parleur.id} parle sans être visible`, f);
    }

    // onomatopées : zone sûre, jamais sur un visage ni sur les sous-titres
    for (const o of scene.onomatopees) {
      if (f < image(o.de, al, fps) || f >= image(o.a, al, fps)) continue;
      const taille = o.taille ?? 96;
      const l = [...o.texte].length * taille * 0.66;
      const b: Rect = { x: o.x - l / 2, y: o.y - taille * 0.85, l, h: taille * 1.05 };
      if (!dansZoneSure(b)) signaler("Zone sûre", `onomatopée « ${o.texte} » sort de la zone sûre`, f);
      if (boiteST && chevauche(b, boiteST, 8)) signaler("Onomatopée sur les sous-titres", `« ${o.texte} »`, f);
      for (const x of tetes) if (contient(b, x.x, x.y, x.r * 0.6)) signaler("Onomatopée sur un visage", `« ${o.texte} » sur ${x.id}`, f);
      for (const { e: h, b: bh } of hud) if (chevauche(b, bh, 8)) signaler("HUD : chevauchement", `« ${o.texte} » / ${h.type}`, f);
    }
    for (const { e: h, b } of hud) {
      if (!dansZoneSure(b)) signaler("Zone sûre", `${h.type} sort de la zone sûre`, f);
      if (boiteST && h.type !== "carton" && chevauche(b, boiteST, 8)) signaler("HUD : chevauchement", `${h.type} / sous-titres`, f);
    }
    // objets : un objet porté reste dans l'image quand son porteur y est (contrôle de continuité grossier)
    for (const o of scene.objets.filter((o) => o.decor === c.decor && present(o, al, fps, f))) {
      const e = etatObjet(o, scene.persos, al, fps, f);
      const pe = versEcran(c, e.x, e.y);
      if (Number.isNaN(pe.x) || Number.isNaN(pe.y)) signaler("Objet", `${o.id} : position invalide`, f);
    }
  }
}

// ---------- Cadrage (analyse/cadrages.md) ----------
const avecPerso = tailles.filter((x) => x > 0).sort((a, b) => a - b);
const pc = (x: number) => `${Math.round(x * 100)} %`;
let statsCadrage = "Aucun personnage à l'image.";
if (avecPerso.length) {
  const mediane = avecPerso[Math.floor(avecPerso.length / 2)];
  const partGros = avecPerso.filter((x) => x > CADRAGE.grosPlanSeuil).length / avecPerso.length;
  statsCadrage = `Taille du plus grand personnage à l'écran (partie visible) : médiane ${pc(mediane)} de la hauteur ; gros plans > 60 % : ${pc(partGros)}`;
  if (mediane > CADRAGE.medianeMax) signaler("Cadrage trop serré", `personnage médian à ${pc(mediane)} de la hauteur (max ${pc(CADRAGE.medianeMax)}) : dézoomer`, 0);
  if (partGros > CADRAGE.grosPlanPartMax) signaler("Trop de gros plans", `${pc(partGros)} des images en gros plan (max ${pc(CADRAGE.grosPlanPartMax)})`, 0);
}

// ---------- Rapport ----------
const erreurs = problemes.filter((p) => p.grave);
const avert = problemes.filter((p) => !p.grave);
const ligne = (p: Probleme) => `- **${p.regle}** : ${p.detail} — ${t(p.f0)}${p.f1 > p.f0 ? ` → ${t(p.f1)}` : ""}`;
const rapport = [
  `# Contrôle qualité (2D) — ${id}`,
  "",
  `Durée ${dureeS.toFixed(2)} s · ${r.duree} images · ${erreurs.length} erreur(s) · ${avert.length} avertissement(s)`,
  "",
  statsCadrage,
  "",
  "## Erreurs",
  ...(erreurs.length ? erreurs.map(ligne) : ["Aucune."]),
  "",
  "## Avertissements",
  ...(avert.length ? avert.map(ligne) : ["Aucun."]),
  "",
  "## À vérifier à l'œil (non automatisable)",
  "- Expressions justes sur chaque réplique, gestes lisibles, continuité des objets (gâteau).",
  "- Sons sombres à l'écoute, voix toujours devant.",
].join("\n");
mkdirSync(`qc/${id}`, { recursive: true });
writeFileSync(`qc/${id}/rapport_qc.md`, rapport + "\n");
writeFileSync(`qc/${id}/cadrage.tsv`, "t\ttaille\n" + tailles.map((x, f) => `${(f / fps).toFixed(2)}\t${x.toFixed(3)}`).join("\n") + "\n");
console.log(rapport);
process.exit(erreurs.length ? 1 : 0);
