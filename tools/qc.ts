// Contrôle qualité automatique d'un épisode (règles de qc/lecons.md), image par image.
// Usage : npx tsx tools/qc.ts 000-demo      (code de sortie 1 s'il reste une erreur)
// Rapport : qc/<id>/rapport_qc.md
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chargerEpisode } from "./charger";
import { etatCamera, project } from "../src/systeme/camera";
import {
  BANDE_SUJET, CAMERA_ROTATION_MAX_DEG_S, DUREE_MAX_S, DUREE_MIN_S, ETIQUETTE_MIN_S, HAUTEUR, HUD_BLOCS_MAX, LARGEUR,
  RYTHME_MAX_S, VITESSE_MAX_M_S, ZONE_SURE,
} from "../src/systeme/format";
import { boiteHud, boiteSousTitre, chevauche, contient, Rect } from "../src/systeme/hud/boites";
import { boiteMeuble, dansBoite, obstacles, segmentTraverse } from "../src/systeme/kit3d/decor";
import { angleEntre, distance, soustrait, Vec3 } from "../src/systeme/maths";
import { blocsSousTitres } from "../src/systeme/mots";
import { CORPS, hauteurBassin } from "../src/systeme/personnage/poses";
import { etatPersonnage } from "../src/systeme/personnage/trajet";

const id = process.argv[2];
const { donnees, alignement, resolu: r } = await chargerEpisode(id);
const fps = r.fps;
const t = (f: number) => `${(f / fps).toFixed(2)} s`;

type Probleme = { regle: string; detail: string; f0: number; f1: number; grave: boolean };
const problemes: Probleme[] = [];
// Regroupe les problèmes identiques sur des images consécutives
const signaler = (regle: string, detail: string, f: number, grave = true) => {
  const dernier = [...problemes].reverse().find((p) => p.regle === regle && p.detail === detail);
  if (dernier && f - dernier.f1 <= 1) dernier.f1 = f;
  else problemes.push({ regle, detail, f0: f, f1: f, grave });
};

const dansZoneSure = (b: Rect) => b.x >= ZONE_SURE.gauche - 1 && b.x + b.l <= ZONE_SURE.droite + 1 && b.y >= ZONE_SURE.haut - 1 && b.y + b.h <= ZONE_SURE.bas + 1;
const nomHud = (e: (typeof r.hud)[number]) => `${e.type}${"texte" in e ? ` « ${e.texte} »` : "titre" in e ? ` « ${e.titre} »` : ""}`;

// ---------- Règles globales ----------
const dureeS = r.duree / fps;
if (!donnees.demonstration && (dureeS < DUREE_MIN_S || dureeS > DUREE_MAX_S)) signaler("Durée", `${dureeS.toFixed(1)} s hors de ${DUREE_MIN_S}-${DUREE_MAX_S} s`, 0);

for (const e of r.hud) {
  if (e.type === "montre") continue;
  const d = (e.fA - e.fDe) / fps;
  if (d < ETIQUETTE_MIN_S) signaler("HUD : durée d'affichage", `${nomHud(e)} visible ${d.toFixed(2)} s (< ${ETIQUETTE_MIN_S} s)`, e.fDe);
}

const autorises = JSON.parse(readFileSync("tools/sons_autorises.json", "utf-8")) as { prefixes_autorises: string[]; mots_interdits: string[] };
for (const s of r.sons) {
  const ok = autorises.prefixes_autorises.some((p) => s.id.startsWith(p)) && !autorises.mots_interdits.some((m) => s.id.includes(m));
  if (!ok) signaler("Son non sombre", `« ${s.id} » n'est pas dans tools/sons_autorises.json`, Math.round(s.t * fps));
}

for (const p of r.personnages)
  p.segments.forEach((s, i) => {
    const prec = i > 0 ? p.segments[i - 1].fArrivee : 0;
    if (s.fDepart < prec) signaler("Téléportation", `${p.id} devrait partir à ${t(s.fDepart)} mais n'arrive qu'à ${t(prec)} (trajet trop long : il faudrait courir)`, s.fDepart);
  });

// ---------- Rythme : un nouvel état d'image toutes les ≤ 2,5 s, action dès la 1re image ----------
const evenements = new Set<number>();
r.camera.forEach((c, i) => {
  if (i > 0) {
    evenements.add(c.fDepart);
    evenements.add(c.fArrivee);
  }
});
r.hud.filter((e) => e.type !== "montre").forEach((e) => (evenements.add(e.fDe), evenements.add(e.fA)));
r.personnages.forEach((p) => {
  p.segments.forEach((s) => (evenements.add(s.fDepart), evenements.add(s.fArrivee)));
  p.poses.forEach((k) => evenements.add(k.f));
});
const tries = [...evenements].filter((f) => f >= 0 && f <= r.duree).sort((a, b) => a - b);
tries.push(r.duree);
let prec = 0;
for (const f of tries) {
  if ((f - prec) / fps > RYTHME_MAX_S) signaler("Rythme", `aucun changement d'image pendant ${((f - prec) / fps).toFixed(1)} s (max ${RYTHME_MAX_S} s)`, prec);
  prec = f;
}
const debutEnAction =
  (r.camera[1] && r.camera[1].fDepart <= 2) || r.personnages.some((p) => (p.segments[0]?.fDepart ?? 99) <= 2) || r.personnages.some((p) => p.poses.some((k) => k.f <= 2 && k.pose !== "debout"));
if (!debutEnAction) signaler("Rythme", "la 1re image n'est pas en action (ni caméra ni personnage ne bougent)", 0);

// ---------- Image par image ----------
const obs = obstacles(donnees.decor);
const meubles = donnees.decor.meubles.filter((m) => m.type !== "tapis").map(boiteMeuble);
const blocs = blocsSousTitres(alignement.mots);
let dirPrec: Vec3 | null = null;
const posPrec = new Map<string, Vec3>();

for (let f = 0; f < r.duree; f++) {
  const cam = etatCamera(r.camera, f, fps);
  const dir = soustrait(cam.cible, cam.position);

  // Caméra jamais dans un mur, jamais derrière un mur plein
  for (const b of obs) {
    if (dansBoite(cam.position, b, 0.15)) signaler("Caméra dans un mur/meuble", `caméra dans ${b.id}`, f);
    else if (b.nature === "mur" && b.plein && segmentTraverse(cam.position, cam.cible, b)) signaler("Caméra derrière un mur", `la visée traverse ${b.id}`, f);
  }
  // Vitesse de rotation
  if (dirPrec) {
    const v = (angleEntre(dirPrec, dir) * 180) / Math.PI * fps;
    if (v > CAMERA_ROTATION_MAX_DEG_S) signaler("Caméra trop rapide", `rotation au-delà de ${CAMERA_ROTATION_MAX_DEG_S}°/s (pointe ${Math.round(v)}°/s)`, f);
  }
  dirPrec = dir;

  // HUD actif
  const actifs = r.hud.filter((e) => f >= e.fDe && f < e.fA);
  const blocsHud = actifs.filter((e) => e.type !== "montre");
  if (blocsHud.length > HUD_BLOCS_MAX) signaler("HUD surchargé", `${blocsHud.length} blocs en plus de la montre et des sous-titres : ${blocsHud.map(nomHud).join(", ")}`, f);
  const boites = actifs.map((e) => ({ e, b: boiteHud(e, cam) }));
  for (const { e, b } of boites) {
    if (!dansZoneSure(b)) signaler("Zone sûre", `${nomHud(e)} sort de la zone sûre`, f);
    if (b.ancre) {
      const p = b.ancre;
      const visible = p.x >= ZONE_SURE.gauche && p.x <= ZONE_SURE.droite && p.y >= ZONE_SURE.haut && p.y <= ZONE_SURE.bas;
      if (!visible) signaler("Étiquette sans cible", `${nomHud(e)} pointe hors de l'image utile`, f);
    }
    if ((e.type === "etiquette" || (e.type === "fiche" && e.point)) && cam.phase !== "tenu") signaler("Étiquette pendant un déplacement", `${nomHud(e)} visible pendant un mouvement de caméra`, f);
  }
  const bloc = blocs.find((b) => f >= b.fDebut && f < b.fFin);
  const boiteST = bloc ? boiteSousTitre(bloc) : null;
  for (let i = 0; i < boites.length; i++) {
    for (let j = i + 1; j < boites.length; j++)
      if (chevauche(boites[i].b, boites[j].b, 8)) signaler("HUD : chevauchement", `${nomHud(boites[i].e)} / ${nomHud(boites[j].e)}`, f);
    if (boiteST && boites[i].e.type !== "carton" && chevauche(boites[i].b, boiteST, 8)) signaler("HUD : chevauchement", `${nomHud(boites[i].e)} / sous-titres`, f);
  }

  // Personnages : pas de téléportation, pas dans un meuble
  const etats = new Map(r.personnages.map((p) => [p.id, { p, e: etatPersonnage(p, f, fps) }]));
  for (const { p, e } of etats.values()) {
    const avant = posPrec.get(p.id);
    if (avant && distance(avant, e.position) * fps > VITESSE_MAX_M_S * 1.05) signaler("Téléportation", `${p.id} se déplace à plus de ${VITESSE_MAX_M_S} m/s`, f);
    posPrec.set(p.id, e.position);
    for (const m of meubles) if (dansBoite([e.position[0], 0.3, e.position[2]], m, -0.05)) signaler("Personnage dans un meuble", `${p.id} traverse ${m.id}`, f, false);
  }

  // Sujets : visibles, jamais cachés par le HUD ou les sous-titres
  for (const s of r.sujets.filter((s) => f >= s.fDe && f < s.fA)) {
    let point = s.point;
    if (s.personnage) {
      const x = etats.get(s.personnage);
      if (!x) continue;
      const h = (hauteurBassin(x.e.pose) + CORPS.bassinVersEpaules * 0.6) * x.p.taille;
      point = [x.e.position[0], s.hauteur ?? h, x.e.position[2]];
    }
    if (!point) continue;
    const p = project(point, cam);
    const nom = s.personnage ?? "sujet";
    if (!p.devant || p.x < 0 || p.x > LARGEUR || p.y < 0 || p.y > HAUTEUR) {
      signaler("Sujet hors champ", `${nom} n'est pas à l'image`, f);
      continue;
    }
    for (const { e, b } of boites) if (e.type !== "carton" && contient(b, p.x, p.y, 30)) signaler("Sujet caché", `${nom} caché par ${nomHud(e)}`, f);
    if (boiteST && contient(boiteST, p.x, p.y, 30)) signaler("Sujet caché", `${nom} caché par les sous-titres (cadrer le sujet entre y=${BANDE_SUJET.haut} et ${BANDE_SUJET.bas})`, f);
    else if (p.y < BANDE_SUJET.haut || p.y > BANDE_SUJET.bas) signaler("Cadrage du sujet", `${nom} hors de la bande conseillée y=${BANDE_SUJET.haut}-${BANDE_SUJET.bas}`, f, false);
  }
}

// ---------- Rapport ----------
const erreurs = problemes.filter((p) => p.grave);
const avert = problemes.filter((p) => !p.grave);
const ligne = (p: Probleme) => `- **${p.regle}** : ${p.detail} — ${t(p.f0)}${p.f1 > p.f0 ? ` → ${t(p.f1)}` : ""}`;
const rapport = [
  `# Contrôle qualité — ${id}`,
  "",
  `Durée ${dureeS.toFixed(2)} s · ${r.duree} images · ${erreurs.length} erreur(s) · ${avert.length} avertissement(s)`,
  "",
  "## Erreurs",
  ...(erreurs.length ? erreurs.map(ligne) : ["Aucune."]),
  "",
  "## Avertissements",
  ...(avert.length ? avert.map(ligne) : ["Aucun."]),
  "",
  "## À vérifier à l'œil (non automatisable)",
  "- Faits de survie plausibles et vérifiés, aucun conseil dangereux présenté comme sûr.",
  "- Sol, décor et sujet lisibles sur les planches (pas d'objets invisibles).",
  "- Sons sombres à l'écoute, voix toujours devant.",
].join("\n");
mkdirSync(`qc/${id}`, { recursive: true });
writeFileSync(`qc/${id}/rapport_qc.md`, rapport + "\n");
console.log(rapport);
process.exit(erreurs.length ? 1 : 0);
