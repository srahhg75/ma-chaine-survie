// Contrôle qualité automatique d'un épisode (règles de qc/lecons.md), image par image.
// Usage : npx tsx tools/qc.ts 000-demo      (code de sortie 1 s'il reste une erreur)
// Rapport : qc/<id>/rapport_qc.md
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chargerEpisode } from "./charger";
import { etatCamera, project } from "../src/systeme/camera";
import {
  BANDE_SUJET, CADRAGE, CAMERA_ROTATION_MAX_DEG_S, DUREE_MAX_S, DUREE_MIN_S, ETIQUETTE_MIN_S, HAUTEUR, HUD_BLOCS_MAX, LARGEUR,
  RYTHME_MAX_S, VITESSE_MAX_M_S, ZONE_SURE,
} from "../src/systeme/format";
import { boiteHud, boiteSousTitre, chevauche, contient, Rect } from "../src/systeme/hud/boites";
import { boiteMeuble, dansBoite, murTraverse, obstacles, passeParOuverture, segmentTraverse } from "../src/systeme/kit3d/decor";
import { angleEntre, distance, soustrait, Vec3 } from "../src/systeme/maths";
import { blocsSousTitres } from "../src/systeme/mots";
import { corpsDe, hautTete, hauteurBassin } from "../src/systeme/personnage/poses";
import { etatPersonnage, present } from "../src/systeme/personnage/trajet";

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
// le carton de fin (animé, lu par le narrateur) n'est pas soumis à la règle de rythme
const debutCarton = Math.min(...r.hud.filter((e) => e.type === "carton").map((e) => e.fDe), r.duree);
for (const f of tries) {
  if (prec < debutCarton && (f - prec) / fps > RYTHME_MAX_S) signaler("Rythme", `aucun changement d'image pendant ${((f - prec) / fps).toFixed(1)} s (max ${RYTHME_MAX_S} s)`, prec);
  prec = f;
}
const debutEnAction =
  (r.camera[1] && r.camera[1].fDepart <= 2) || r.personnages.some((p) => (p.segments[0]?.fDepart ?? 99) <= 2) || r.personnages.some((p) => p.poses.some((k) => k.f <= 2 && k.pose !== "debout"));
if (!debutEnAction) signaler("Rythme", "la 1re image n'est pas en action (ni caméra ni personnage ne bougent)", 0);

const obs = obstacles(donnees.decor);
// Côté extérieur d'un mur : une caméra de ce côté ne voit que son dos (en vue en coupe, on filme le côté intérieur)
const derriere = (b: (typeof obs)[number], p: Vec3) => {
  const cote = (b as { cote?: string }).cote;
  return cote === "nord" ? p[2] < b.min[2] : cote === "sud" ? p[2] > b.max[2] : cote === "ouest" ? p[0] < b.min[0] : cote === "est" ? p[0] > b.max[0] : true;
};

// ---------- Image par image ----------
const meubles = donnees.decor.meubles.filter((m) => m.type !== "tapis").map(boiteMeuble);
const blocs = blocsSousTitres(alignement.mots, alignement.phrases);
let dirPrec: Vec3 | null = null;
const posPrec = new Map<string, Vec3>();
// Taille à l'écran du plus grand personnage visible, image par image (0 = aucun personnage : plan d'objet, carton)
const tailles: number[] = [];

for (let f = 0; f < r.duree; f++) {
  const cam = etatCamera(r.camera, f, fps);
  const dir = soustrait(cam.cible, cam.position);

  // La visée s'arrête au sol : viser un point sous le sol (pour remonter le sujet dans l'image) est permis
  const finVisee: Vec3 =
    cam.cible[1] >= 0.05
      ? cam.cible
      : (() => {
          const k = (cam.position[1] - 0.05) / (cam.position[1] - cam.cible[1]);
          return [cam.position[0] + (cam.cible[0] - cam.position[0]) * k, 0.05, cam.position[2] + (cam.cible[2] - cam.position[2]) * k] as Vec3;
        })();
  // Caméra jamais dans un mur, jamais derrière un mur plein
  for (const b of obs) {
    if (dansBoite(cam.position, b, 0.15)) signaler("Caméra dans un mur/meuble", `caméra dans ${b.id}`, f);
    else if (b.nature === "mur" && b.plein && derriere(b, cam.position) && segmentTraverse(cam.position, finVisee, b) && !passeParOuverture(donnees.decor, b.id, cam.position, finVisee)) signaler("Caméra derrière un mur", `la caméra voit le dos de ${b.id}`, f);
  }
  // Vitesse de rotation (une coupe nette n'est pas un mouvement)
  const coupeIci = r.camera.some((c) => c.coupe && c.fArrivee === f);
  if (dirPrec && !coupeIci) {
    const v = (angleEntre(dirPrec, dir) * 180) / Math.PI * fps;
    if (v > CAMERA_ROTATION_MAX_DEG_S) signaler("Caméra trop rapide", `rotation au-delà de ${CAMERA_ROTATION_MAX_DEG_S}°/s (pointe ${Math.round(v)}°/s)`, f);
  }
  dirPrec = dir;

  // Personnages et sujets projetés à l'écran (servent aux contrôles HUD et sujets)
  // Seuls les personnages présents à cette image ; un personnage invisible (on ne voit que sa lampe) n'est pas contrôlé
  const etats = new Map(r.personnages.filter((p) => present(p, f) && !p.invisible).map((p) => [p.id, { p, e: etatPersonnage(p, f, fps) }]));
  const sujetsEcran = r.sujets
    .filter((s) => f >= s.fDe && f < s.fA)
    .map((s) => {
      let point = s.point;
      if (s.personnage) {
        const x = etats.get(s.personnage);
        if (!x) return null;
        const h = (hauteurBassin(x.e.pose, x.p.variante) + corpsDe(x.p.variante).bassinVersEpaules * 0.6) * x.p.taille;
        // hauteur comptée depuis le sol où il se tient (étage, marche d'escalier)
        point = [x.e.position[0], x.e.position[1] + (s.hauteur ?? h), x.e.position[2]];
      }
      return point ? { nom: `${s.personnage ?? "sujet"}${s.hauteur ? ` (h=${s.hauteur} m)` : ""}`, p: project(point, cam), point } : null;
    })
    .filter((x): x is { nom: string; p: ReturnType<typeof project>; point: Vec3 } => x !== null);

  // Encombrement à l'écran de chaque personnage déclaré comme sujet (des pieds au sommet de la tête)
  const silhouettes = [...new Set(r.sujets.filter((s) => s.personnage && f >= s.fDe && f < s.fA).map((s) => s.personnage!))]
    .map((id) => {
      const x = etats.get(id);
      if (!x) return null;
      const k = x.p.taille;
      const sommet = (hauteurBassin(x.e.pose, x.p.variante) + hautTete(x.p.variante) + 0.06) * k;
      const [px, py, pz] = x.e.position;
      const coins = [-1, 1].flatMap((dx) => [-1, 1].flatMap((dz) => [0.02, sommet].map((y) => project([px + dx * 0.28 * k, py + y, pz + dz * 0.28 * k], cam))));
      const xs = coins.map((c) => c.x);
      const ys = coins.map((c) => c.y);
      return { id, b: { x: Math.min(...xs), y: Math.min(...ys), l: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) } as Rect };
    })
    .filter((x): x is { id: string; b: Rect } => x !== null);
  for (const { id: nom, b } of silhouettes) if (b.y < 0) signaler("Sujet coupé", `le haut de la tête de ${nom} sort du cadre`, f);

  // Taille du plus grand personnage dont le corps est à l'image (sujet ou non, fantômes compris).
  // Non mesuré : carton de fin (il couvre l'image) et plans d'OBJET (sujet déclaré par un point : carnet, serrure…),
  // où un personnage peut traverser le champ sans être filmé.
  let plusGrand = 0;
  const planObjet = r.sujets.some((s) => !s.personnage && f >= s.fDe && f < s.fA);
  const carton = r.hud.some((e) => e.type === "carton" && f >= e.fDe && f < e.fA);
  for (const x of planObjet || carton ? [] : etats.values()) {
    const k = x.p.taille;
    const [px, py, pz] = x.e.position;
    const pieds = project([px, py + 0.02, pz], cam);
    const tete = project([px, py + (hauteurBassin(x.e.pose, x.p.variante) + hautTete(x.p.variante) + 0.06) * k, pz], cam);
    const milieu = project([px, py + 0.7 * k, pz], cam);
    if (!milieu.devant || milieu.x < 0 || milieu.x > LARGEUR || milieu.y < 0 || milieu.y > HAUTEUR) continue;
    plusGrand = Math.max(plusGrand, Math.abs(pieds.y - tete.y) / HAUTEUR);
  }
  tailles.push(plusGrand);

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
      // La cible ne doit pas être masquée par le sujet (sinon l'étiquette semble désigner le personnage)
      for (const si of silhouettes)
        if (contient(si.b, p.x, p.y, 15)) signaler("Étiquette sur le sujet", `${nomHud(e)} pointe sur ${si.id} (cible cachée ou ambiguë)`, f);
    }
    if ((e.type === "etiquette" || (e.type === "fiche" && e.point)) && cam.phase !== "tenu") signaler("Étiquette pendant un déplacement", `${nomHud(e)} visible pendant un mouvement de caméra`, f);
  }
  const bloc = blocs.find((b) => f >= b.fDebut && f < b.fFin);
  const boiteST = bloc ? boiteSousTitre(bloc) : null;
  for (let i = 0; i < boites.length; i++) {
    for (let j = i + 1; j < boites.length; j++)
      if (chevauche(boites[i].b, boites[j].b, 8)) signaler("HUD : chevauchement", `${nomHud(boites[i].e)} / ${nomHud(boites[j].e)}`, f);
    if (boiteST && chevauche(boites[i].b, boiteST, 8)) signaler("HUD : chevauchement", `${nomHud(boites[i].e)} / sous-titres`, f);
  }

  // Personnages : pas de téléportation, pas dans un meuble
  for (const { p, e } of etats.values()) {
    const avant = posPrec.get(p.id);
    if (avant && distance(avant, e.position) * fps > VITESSE_MAX_M_S * 1.05) signaler("Téléportation", `${p.id} se déplace à plus de ${VITESSE_MAX_M_S} m/s`, f);
    posPrec.set(p.id, e.position);
    // Dans un meuble : bloquant s'il MARCHE (il passe à travers) ; simple avertissement à l'arrêt (assis, couché)
    for (const m of meubles)
      if (dansBoite([e.position[0], e.position[1] + 0.3, e.position[2]], m, -0.05))
        signaler("Personnage dans un meuble", `${p.id} traverse ${m.id}${e.marche ? " en marchant" : ""}`, f, e.marche && !p.fantome);
    // Murs pleins OU arasés : on ne passe que par une porte ou un passage (jamais par-dessus une cloison).
    // Rayon du corps : 0,22 m pour un personnage « humain » (épaules, bras, sac, lampe), 0,12 m sinon.
    const rayon = p.variante === "humain" || p.variante === "adulte" ? 0.22 : 0.12;
    const mur = p.fantome ? null : murTraverse(donnees.decor, e.position[0], e.position[2], rayon);
    if (mur) signaler("Personnage à travers un mur", `${p.id} traverse ${mur} (pas de porte ni de passage à cet endroit)`, f);
  }

  // Sujets : visibles, jamais cachés par le HUD ou les sous-titres
  for (const { nom, p, point } of sujetsEcran) {
    for (const b of obs) if (b.nature === "mur" && b.plein && segmentTraverse(cam.position, point, b) && !passeParOuverture(donnees.decor, b.id, cam.position, point)) signaler("Sujet derrière un mur", `${nom} caché par ${b.id}`, f);
    // Meubles (visibles ou dessinés à part) entre la caméra et le sujet : on raccourcit le segment de 12 cm
    // côté sujet (le sujet peut être posé sur le meuble ou contre lui)
    const d = distance(cam.position, point);
    const avant: Vec3 = d > 0.2 ? [point[0] + ((cam.position[0] - point[0]) * 0.12) / d, point[1] + ((cam.position[1] - point[1]) * 0.12) / d, point[2] + ((cam.position[2] - point[2]) * 0.12) / d] : point;
    for (const m of meubles) if (!dansBoite(point, m, 0.02) && segmentTraverse(cam.position, avant, m)) signaler("Sujet caché par un meuble", `${nom} caché par ${m.id}`, f);
    if (!p.devant || p.x < 40 || p.x > LARGEUR - 40 || p.y < 40 || p.y > HAUTEUR - 40) {
      signaler("Sujet hors champ", `${nom} n'est pas (entièrement) à l'image`, f);
      continue;
    }
    for (const { e, b } of boites) if (e.type !== "carton" && contient(b, p.x, p.y, 30)) signaler("Sujet caché", `${nom} caché par ${nomHud(e)}`, f);
    if (p.x > ZONE_SURE.droite) signaler("Sujet sous les boutons TikTok", `${nom} dans la colonne de droite (x > ${ZONE_SURE.droite})`, f);
    if (boiteST && contient(boiteST, p.x, p.y, 30)) signaler("Sujet caché", `${nom} caché par les sous-titres (cadrer le sujet entre y=${BANDE_SUJET.haut} et ${BANDE_SUJET.bas})`, f);
    else if (p.y < BANDE_SUJET.haut || p.y > BANDE_SUJET.bas) signaler("Cadrage du sujet", `${nom} hors de la bande conseillée y=${BANDE_SUJET.haut}-${BANDE_SUJET.bas}`, f, false);
  }
}

// ---------- Cadrage : assez large pour voir le décor (analyse/cadrages.md) ----------
const avecPerso = tailles.filter((x) => x > 0).sort((a, b) => a - b);
const pc = (x: number) => `${Math.round(x * 100)} %`;
let statsCadrage = "Aucun personnage à l'image.";
if (avecPerso.length) {
  const mediane = avecPerso[Math.floor(avecPerso.length / 2)];
  const partGros = avecPerso.filter((x) => x > CADRAGE.grosPlanSeuil).length / avecPerso.length;
  const tranche = (a: number, b: number) => pc(avecPerso.filter((x) => x >= a && x < b).length / avecPerso.length);
  statsCadrage =
    `Taille du personnage à l'écran (images avec personnage) : médiane ${pc(mediane)} de la hauteur ; ` +
    `plans larges < 35 % : ${tranche(0, 0.35)} · moyens 35-60 % : ${tranche(0.35, 0.6)} · gros plans > 60 % : ${pc(partGros)}`;
  if (mediane > CADRAGE.medianeMax) signaler("Cadrage trop serré", `personnage médian à ${pc(mediane)} de la hauteur (max ${pc(CADRAGE.medianeMax)}) : dézoomer`, 0);
  if (partGros > CADRAGE.grosPlanPartMax) signaler("Trop de gros plans", `${pc(partGros)} des images en gros plan (max ${pc(CADRAGE.grosPlanPartMax)})`, 0);
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
  statsCadrage,
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
// Taille du plus grand personnage image par image : pour trouver les plans trop serrés
writeFileSync(`qc/${id}/cadrage.tsv`, "t\ttaille\n" + tailles.map((x, f) => `${(f / fps).toFixed(2)}\t${x.toFixed(3)}`).join("\n") + "\n");
console.log(rapport);
process.exit(erreurs.length ? 1 : 0);
