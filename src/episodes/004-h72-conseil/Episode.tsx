import React, { useEffect, useMemo, useState } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { continueRender, delayRender } from "remotion";
import { EpisodeStandard, PropsEpisode } from "../../systeme/EpisodeStandard";
import { Arrondi } from "../../systeme/kit3d/Arrondi";
import { Fantome } from "../../systeme/kit3d/Fantome";
import { Bougie } from "../../systeme/kit3d/Lumieres";
import { Cadre, Plante, Rideau } from "../../systeme/kit3d/Mobilier";
import { clamp, lerp, Vec3 } from "../../systeme/maths";
import { Alignement } from "../../systeme/mots";
import { etatPersonnage, present, resoudrePersonnage } from "../../systeme/personnage/trajet";
import { POLICE_TEXTE } from "../../systeme/polices";
import { Lanterne, Lumiere, useTemps } from "../001-h72/Episode";
import { DEMI, NIV, P } from "../003-h72-lampe/donnees";
import { Bidon, CageEscalier, Faisceau } from "../003-h72-lampe/Episode";
import { BOITES, CARNET, donnees, FENETRE, GANTS, H_TABLE, MAIN_TROUSSEAU, PAPIER, PAPIER_MAIN, SX } from "./donnees";

/*
 * Éléments 3D de H+72 partie 4 : la cage de la partie 3 (portes qui s'ouvrent, lampes qui fuient, gyrophare),
 * le salon des voisins du 7e (bougies, lanternes, carnet d'Inès, boîtes de médicaments, stylo à insuline),
 * l'entrée d'Inès (le papier sous la porte). Carnet et papier sont écrits au feutre (textures dessinées).
 */
const rad = (d: number) => (d * Math.PI) / 180;
const s = (x: number, y: number, z: number): Vec3 => [SX + x, y, z];

// Point devant un personnage : `avant` (m) dans son regard, `droite` vers sa main droite, `haut` au-dessus du sol
export const devant = (p: Vec3, orientation: number, avant: number, droite: number, haut: number): Vec3 => {
  const o = rad(orientation);
  return [p[0] + Math.sin(o) * avant - Math.cos(o) * droite, p[1] + haut, p[2] + Math.cos(o) * avant + Math.sin(o) * droite];
};

// ---------- Textures écrites (attendent la police : une image n'est jamais rendue en police de secours) ----------
const usePolicePrete = () => {
  const requete = `800 40px ${POLICE_TEXTE}`;
  const [pret, setPret] = useState(() => document.fonts.check(requete));
  const [handle] = useState(() => (pret ? null : delayRender("Police du carnet")));
  useEffect(() => {
    if (pret) {
      if (handle !== null) continueRender(handle);
      return;
    }
    document.fonts.load(requete).then(() => setPret(true));
  }, [pret, handle]);
  return pret;
};

export const useDessin = (largeur: number, hauteur: number, dessin: (c: CanvasRenderingContext2D) => void, cle: string) => {
  const pret = usePolicePrete();
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = largeur;
    canvas.height = hauteur;
    dessin(canvas.getContext("2d")!);
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cle, pret, largeur, hauteur]);
};

export const ENCRE = "#1d2a4a";
export const feutre = (c: CanvasRenderingContext2D, texte: string, x: number, y: number, taille: number, couleur = ENCRE, angle = 0) => {
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  c.fillStyle = couleur;
  c.font = `800 ${taille}px ${POLICE_TEXTE}`;
  c.fillText(texte, 0, 0);
  c.restore();
};
export const pageLignee = (c: CanvasRenderingContext2D, x0: number, w: number, h: number) => {
  c.fillStyle = "#efe9da";
  c.fillRect(x0, 0, w, h);
  c.strokeStyle = "rgba(90,120,170,0.35)";
  c.lineWidth = 2;
  for (let y = 70; y < h; y += 46) {
    c.beginPath();
    c.moveTo(x0 + 20, y);
    c.lineTo(x0 + w - 20, y);
    c.stroke();
  }
  c.strokeStyle = "rgba(190,60,60,0.45)";
  c.beginPath();
  c.moveTo(x0 + 60, 0);
  c.lineTo(x0 + 60, h);
  c.stroke();
};

// Lignes « qui a quoi » (page de droite) : la page qui sera arrachée
const LIGNES_QUOI: [string, string, string, string][] = [
  ["MOREL", "5e", "200 L", "cœur"],
  ["BENOÎT", "7e", "6 L", "cœur"],
  ["7e GAUCHE", "7e", "12 L", "insuline"],
  ["4e DROITE", "4e", "?", "—"],
];
const LIGNE_INES: [string, string, string, string] = ["INÈS", "6e", "0 L", "TROUSSE"];
const COLONNES = [80, 300, 410, 520];
export const pageQuoi = (c: CanvasRenderingContext2D, x0: number, w: number, h: number, lignes: number, ines: boolean) => {
  pageLignee(c, x0, w, h);
  feutre(c, "QUI A QUOI", x0 + 80, 52, 36);
  ["NOM", "ÉTAGE", "EAU", "MÉDIC."].forEach((t, i) => feutre(c, t, x0 + COLONNES[i], 108, 22, "#6a2a2a"));
  LIGNES_QUOI.slice(0, lignes).forEach((l, k) => l.forEach((t, i) => feutre(c, t, x0 + COLONNES[i], 154 + k * 46, 26, ENCRE, (k % 2 ? 1 : -1) * 0.012)));
  if (ines) LIGNE_INES.forEach((t, i) => feutre(c, t, x0 + COLONNES[i], 154 + LIGNES_QUOI.length * 46, 28, "#8a1f1f", -0.015));
};

// Carnet ouvert sur la table : page de gauche « liste des fragiles », page de droite « qui a quoi » (arrachée à la fin)
export const Carnet: React.FC<{ etape: number; arrachee: boolean }> = ({ etape, arrachee }) => {
  const tex = useDessin(
    1400,
    720,
    (c) => {
      c.clearRect(0, 0, 1400, 720);
      pageLignee(c, 0, 700, 720);
      if (etape >= 1) {
        feutre(c, "LISTE DES FRAGILES", 80, 60, 40, "#7a1f1f");
        c.fillStyle = "#7a1f1f";
        c.fillRect(80, 72, 470, 5);
      }
      const fragiles = ["Mme BENOÎT · 7e · seule", "7e GAUCHE · diabète", "MOREL · 5e · 70 ans"];
      fragiles.slice(0, etape >= 3 ? 3 : etape >= 2 ? 2 : 0).forEach((t, k) => feutre(c, t, 80, 162 + k * 92, 34, ENCRE, (k % 2 ? 1 : -1) * 0.01));
      if (!arrachee) {
        if (etape >= 4) pageQuoi(c, 700, 700, 720, 4, etape >= 5);
        else pageLignee(c, 700, 700, 720);
      }
      else {
        // talon de la page arrachée : bord déchiqueté contre la reliure
        c.fillStyle = "#efe9da";
        c.beginPath();
        c.moveTo(700, 0);
        for (let y = 0; y <= 720; y += 24) c.lineTo(712 + ((y * 37) % 23), y);
        c.lineTo(700, 720);
        c.closePath();
        c.fill();
      }
      // reliure
      c.fillStyle = "rgba(0,0,0,0.28)";
      c.fillRect(694, 0, 12, 720);
    },
    `carnet${etape}${arrachee}`,
  );
  const L = 0.42;
  return (
    <group position={CARNET}>
      {/* couverture */}
      <Arrondi taille={[L + 0.02, 0.012, 0.225]} position={[0, -0.004, 0]} rayon={0.004} couleur="#3d2a20" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <planeGeometry args={[arrachee ? L / 2 + 0.012 : L, 0.216]} />
        <meshStandardMaterial map={tex} roughness={0.9} transparent alphaTest={0.05} />
      </mesh>
    </group>
  );
};

// Le papier glissé sous la porte : recto « ON SAIT CE QUE TU AS. », verso = la page « qui a quoi » (avec la ligne d'Inès)
export const Papier: React.FC<{ position: Vec3; rotation: [number, number, number] }> = ({ position, rotation }) => {
  const recto = useDessin(
    700,
    720,
    (c) => {
      c.fillStyle = "#efe9da";
      c.fillRect(0, 0, 700, 720);
      feutre(c, "ON SAIT", 70, 300, 92, "#111111", -0.04);
      feutre(c, "CE QUE", 90, 410, 92, "#111111", -0.02);
      feutre(c, "TU AS.", 110, 520, 92, "#111111", -0.03);
      // bord arraché à gauche
      c.fillStyle = "#000";
      c.globalCompositeOperation = "destination-out";
      c.beginPath();
      c.moveTo(0, 0);
      for (let y = 0; y <= 720; y += 24) c.lineTo(10 + ((y * 37) % 23), y);
      c.lineTo(0, 720);
      c.fill();
    },
    "recto",
  );
  const verso = useDessin(
    700,
    720,
    (c) => {
      pageQuoi(c, 0, 700, 720, 4, true);
      c.fillStyle = "#000";
      c.globalCompositeOperation = "destination-out";
      c.beginPath();
      c.moveTo(700, 0);
      for (let y = 0; y <= 720; y += 24) c.lineTo(690 - ((y * 37) % 23), y);
      c.lineTo(700, 720);
      c.fill();
    },
    "verso",
  );
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[0.21, 0.216]} />
        <meshStandardMaterial map={recto} roughness={0.9} transparent alphaTest={0.05} />
      </mesh>
      <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.001]}>
        <planeGeometry args={[0.21, 0.216]} />
        <meshStandardMaterial map={verso} roughness={0.9} transparent alphaTest={0.05} />
      </mesh>
    </group>
  );
};

// Boîte de médicaments avec étiquette de pharmacie (nom du patient)
export const BoiteMedoc: React.FC<{ position: Vec3; rotation?: number; nom: string; couleur: string }> = ({ position, rotation = 0, nom, couleur }) => {
  const etiquette = useDessin(
    320,
    140,
    (c) => {
      c.fillStyle = "#f6f3ea";
      c.fillRect(0, 0, 320, 140);
      c.fillStyle = couleur;
      c.fillRect(0, 0, 320, 34);
      feutre(c, "PHARMACIE", 14, 26, 22, "#ffffff");
      feutre(c, nom, 14, 84, 38, "#111111");
      feutre(c, "1 cp matin et soir", 14, 124, 20, "#444444");
    },
    `boite${nom}`,
  );
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Arrondi taille={[0.13, 0.05, 0.075]} position={[0, 0.025, 0]} rayon={0.004} couleur="#f0eee8" />
      <mesh position={[0, 0.0505, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.125, 0.07]} />
        <meshStandardMaterial map={etiquette} roughness={0.8} />
      </mesh>
    </group>
  );
};

// Stylo à insuline (gris et orange)
const StyloInsuline: React.FC<{ position: Vec3; rotation: [number, number, number] }> = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    <mesh>
      <cylinderGeometry args={[0.009, 0.009, 0.15, 12]} />
      <meshStandardMaterial color="#9aa3ab" roughness={0.35} metalness={0.3} />
    </mesh>
    <mesh position={[0, 0.085, 0]}>
      <cylinderGeometry args={[0.01, 0.01, 0.03, 12]} />
      <meshStandardMaterial color="#e07a2a" roughness={0.5} />
    </mesh>
  </group>
);

// ---------- Salon des voisins du 7e (la pièce et ses meubles sont dans les données) ----------
export const Salon: React.FC<{ t: number; bougies: number }> = ({ t, bougies }) => {
  const vacille = 0.85 + 0.15 * Math.sin(t * 7.1) * Math.sin(t * 2.9);
  return (
    <group>
      {/* bougies dans les coins de la table (jamais entre la caméra et le carnet : leçon du 23/10), lanternes en hauteur */}
      {[
        [-0.42, -0.2],
        [0.43, -0.71],
      ].map(([x, z], i) => (
        <Bougie key={i} position={s(x, H_TABLE, z)} allumee={bougies > 0} graine={`salon${i}`} puissance={0.75 * bougies} />
      ))}
      <Lanterne position={s(2.2, 1.62, -2.2)} allumee={bougies} portee={3.6} puissance={0.8} />
      <Lanterne position={s(-2.35, 1.49, -1.95)} allumee={bougies} portee={3.0} puissance={0.6} />
      <pointLight position={s(0, 1.9, -0.4)} intensity={1.4 * vacille * bougies} distance={4.5} color="#ffb366" decay={2} />
      {/* fenêtre : la ville noire, quelques fenêtres aux bougies */}
      <mesh position={[FENETRE[0], FENETRE[1], FENETRE[2] - 0.35]}>
        <planeGeometry args={[3.2, 2.4]} />
        <meshBasicMaterial color="#0a1020" />
      </mesh>
      {[
        [-0.7, 0.2],
        [0.4, -0.35],
        [0.9, 0.45],
        [-0.2, -0.6],
      ].map(([x, y], i) => (
        <mesh key={i} position={[FENETRE[0] + x, FENETRE[1] + y, FENETRE[2] - 0.34]}>
          <planeGeometry args={[0.05, 0.07]} />
          <meshBasicMaterial color="#ff9a40" toneMapped={false} transparent opacity={0.5 + 0.3 * Math.sin(t * 3 + i)} />
        </mesh>
      ))}
      <Rideau position={[FENETRE[0] - 0.85, 0, FENETRE[2] + 0.12]} hauteur={2.15} largeur={0.5} couleur="#8a6a4a" />
      <Rideau position={[FENETRE[0] + 0.85, 0, FENETRE[2] + 0.12]} hauteur={2.15} largeur={0.5} couleur="#8a6a4a" />
      <Cadre position={s(-1.2, 1.55, -2.33)} largeur={0.5} hauteur={0.38} />
      <Cadre position={s(-0.55, 1.45, -2.33)} largeur={0.3} hauteur={0.4} />
      <Plante position={s(2.45, 0, -0.9)} graine="salon7" />
      {/* jouets d'enfant au sol (des gens vivent là : la poussette du palier) */}
      <Arrondi taille={[0.12, 0.12, 0.12]} position={s(-1.9, 0.06, -0.2)} rayon={0.02} couleur="#d9a52b" />
      <Arrondi taille={[0.1, 0.1, 0.1]} position={s(-1.75, 0.05, -0.05)} rayon={0.02} couleur="#3a7ac2" />
    </group>
  );
};

const Scene: React.FC<{ al: Alignement }> = ({ al }) => {
  const { t, fps, f, a, entre } = useTemps(al);
  const perso = (id: string) => donnees.personnages.find((p) => p.id === id)!;
  const r = useMemo(
    () => Object.fromEntries(["ines", "morel", "pere-cage", "inconnu", "ines-descend", "ines-entree", "pere-salon", "ines-salon", "morel-salon"].map((id) => [id, resoudrePersonnage(perso(id), al, fps)])),
    [al, fps],
  );
  const etat = (id: string) => etatPersonnage(r[id], f, fps);
  const la = (id: string) => present(r[id], f);

  // ---- plateau en cours ----
  const cage = t < a("conseil") || (t >= a("calme") && t < a("papier2"));
  const salon = !cage;

  // ---- portes de la cage ----
  const porte7 = entre("t1b:portes", 0.6);
  const porte4 = 0.35 * entre("t1b:portes+0.35", 0.5);
  const porteMorel = t >= a("crie") - 0.6 && t < a("conseil") ? 1 : 0;
  const porteToit = t < a("t1c:enfuient") ? 1 : 1 - entre("t1c:enfuient", 0.25);
  const porte6 = t < a("calme") ? 0 : entre("porte:porte", 0.6) * (1 - entre("mot.fin", 0.35));

  // ---- lampes des deux inconnus ----
  const ei = etat("inconnu");
  const ines = etat("ines");
  const viseInes: Vec3 = [ines.position[0] + 0.15 * Math.sin(t * 1.3), NIV.e7 + 1.0, ines.position[2] + 0.2 * Math.sin(t * 0.9)];
  const lampeBas = t < a("t1c.fin") + 0.6;
  const origineBas: Vec3 = [ei.position[0] - 0.2, ei.position[1] + 1.05, ei.position[2]];
  const lampeHaut = t < a("t1c:enfuient");
  // fantôme B : les deux lampes arrivent sur elle, recroquevillée dans le noir
  const opB = clamp(Math.min((t - a("b1") + 0.2) / 0.25, (a("b3.fin") + 0.25 - t) / 0.25));
  const uB = entre("b2", "b3.fin");
  const coin: Vec3 = [-1.42, NIV.e7 + 0.5, -1.18];
  const fBas: Vec3 = [lerp(1.6, -0.4, uB), lerp(NIV.e6 + DEMI + 1.0, NIV.e7 + 1.05, uB), lerp(-0.3, -0.25, uB)];
  const fHaut: Vec3 = [lerp(-0.9, -1.0, uB), lerp(NIV.toit + 1.45, NIV.e7 + 1.5, uB), lerp(-2.05, -0.75, uB)];

  // ---- police : gyrophare par les fenêtres du bas, deux lampes qui balaient un escalier vide ----
  const police = t >= a("police") - 0.3 && t < a("m_heure");
  const gyro = police ? 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 9)) : 0; // jamais éteint : toujours un peu de bleu

  // ---- objets du salon ----
  const etapeCarnet =
    t >= a("liste2:trousse") ? 5 : t >= a("liste") ? 4 : t >= a("t2a:malade") + 0.4 ? 3 : t >= a("t2a") + 0.3 ? 2 : t >= a("t2") + 0.3 ? 1 : 0;
  const carnetComplet = t >= a("papier2") ? 5 : etapeCarnet;
  // la boîte de Mme Benoît : prise par le fantôme, puis rendue par Inès
  const uBoite = entre("t3b", "t3b.fin");
  const boiteBenoit: Vec3 = s(lerp(0.2, 0.36, uBoite), H_TABLE, lerp(-0.38, -0.25, uBoite));
  const pere = etat("pere-salon");
  const stylo = t >= a("t3d") - 0.3 && t < a("liste");
  const mainPere = devant(pere.position, pere.orientation, 0.44, 0.17, 0.8);
  const bougiesSalon = t >= a("fin:il") - 0.6 ? 0.7 : 1;

  // ---- entrée d'Inès : le papier, au sol (lisible depuis la caméra), puis dans sa main ----
  const ie = etat("ines-entree");
  const enMain = t >= a("papier");
  const versoVisible = entre("papier", 0.6);

  // ---- lumières des lampes portées ----
  const lampeDe = (id: string) => {
    if (!la(id)) return null;
    const e = etat(id);
    if (!e.lampe) return null;
    return <pointLight key={id} position={[e.position[0], e.position[1] + 1.0, e.position[2] + 0.2]} intensity={0.45} distance={2.5} color="#fff1d8" />;
  };

  return (
    <>
      <Lumiere nuit={1} />

      {/* ======== plateau 1 : la cage (et l'entrée d'Inès derrière sa porte) ======== */}
      {cage && (
        <>
          <CageEscalier
            porteMorel={porteMorel}
            porteToit={porteToit}
            bougies7={1}
            porte4={porte4}
            porte6={porte6}
            porte7={porte7}
            lumiere4={porte4 > 0 ? 1 : 0}
            lumiere7={porte7}
            entreeInes
          />
          {/* le bidon posé au 7e en partie 3 */}
          <Bidon position={[-0.75, NIV.e7, -1.15]} rotation={0.3} />
          {/* la main gantée au trousseau (récap) */}
          {t >= a("recap3") - 0.1 && t < a("recap4") && (
            <group position={MAIN_TROUSSEAU}>
              <Arrondi taille={[0.07, 0.09, 0.04]} position={[0, 0, 0]} rayon={0.02} couleur={GANTS} />
              {[0, 1, 2].map((k) => (
                <Arrondi key={k} taille={[0.012, 0.05, 0.004]} position={[0.03 + k * 0.018, -0.07 - k * 0.01, 0.02]} rotation={[0, 0, 0.3 * k]} rayon={0.003} couleur="#b8a46a" metal={0.85} rugosite={0.3} />
              ))}
            </group>
          )}
          {["ines", "morel", "pere-cage", "ines-descend", "ines-entree"].map(lampeDe)}
          <Faisceau origine={origineBas} vise={viseInes} force={lampeBas ? 1 : 0} ombre />
          <Faisceau origine={P.lampeToit} vise={[-0.3, NIV.e7 + 0.8, -0.2]} force={lampeHaut ? 0.85 : 0} longueur={3.6} />
          <Fantome opacite={opB}>
            <Faisceau origine={fBas} vise={coin} force={1} longueur={2.2} />
            <Faisceau origine={fHaut} vise={coin} force={1} longueur={2.2} />
          </Fantome>
          {police && (
            <>
              <pointLight position={[2.7, NIV.e4 + DEMI + 1.2, -1.2]} intensity={6 * gyro} distance={6} color="#2f5dff" decay={1.6} />
              <pointLight position={[2.7, NIV.e5 + DEMI + 1.2, -1.2]} intensity={4 * (1 - gyro)} distance={6} color="#2f5dff" decay={1.6} />
              <pointLight position={[0.4, NIV.e4 + 1.4, 0.6]} intensity={3 * gyro} distance={5} color="#2f5dff" decay={1.6} />
              <Faisceau origine={[0.5, NIV.e4 + 1.15, 0.4]} vise={[1.4 + 0.5 * Math.sin(t * 1.7), NIV.e4 + 1.2, -1.0]} force={0.8} longueur={3.0} />
              <Faisceau origine={[2.5, NIV.e4 + DEMI + 1.1, -0.1]} vise={[1.0, NIV.e5 + 0.4 + 0.3 * Math.sin(t * 1.3), -0.6]} force={0.7} longueur={3.0} />
            </>
          )}
          {/* le papier, au sol derrière la porte, puis dans sa main (verso : la page de sa liste) */}
          {t >= a("calme") && (
            <Papier
              position={enMain && la("ines-entree") ? PAPIER_MAIN : PAPIER}
              rotation={enMain && la("ines-entree") ? [0.1, rad(ie.orientation) + Math.PI * versoVisible, 0] : [-Math.PI / 2, 0, Math.PI + 0.25]}
            />
          )}
        </>
      )}

      {/* ======== plateau 2 : le salon du 7e ======== */}
      {salon && (
        <>
          <Salon t={t} bougies={bougiesSalon} />
          <Carnet etape={carnetComplet} arrachee={t >= a("papier2")} />
          <BoiteMedoc position={boiteBenoit} rotation={0.4} nom="Mme BENOÎT" couleur="#2f7a4a" />
          <BoiteMedoc position={s(0.25, H_TABLE, -0.47)} rotation={-0.15} nom="M. MOREL" couleur="#2f7a4a" />
          <BoiteMedoc position={[BOITES[0] - 0.17, H_TABLE, BOITES[2] + 0.22]} rotation={0.9} nom="7e GAUCHE" couleur="#2a5aa0" />
          {/* le fantôme prend la boîte de Mme Benoît (dans sa main tendue) */}
          <Fantome opacite={clamp(Math.min((t - a("t3a") + 0.15) / 0.2, (a("t3a.fin") + 0.2 - t) / 0.2))}>
            <BoiteMedoc position={s(0.44, 0.92, -0.16)} rotation={1.2} nom="Mme BENOÎT" couleur="#2f7a4a" />
          </Fantome>
          {stylo && la("pere-salon") && <StyloInsuline position={mainPere} rotation={[0.3, rad(pere.orientation), 0.9]} />}
          {/* stylo posé sur la table le reste du temps */}
          {!stylo && <StyloInsuline position={s(-0.38, H_TABLE + 0.01, -0.62)} rotation={[Math.PI / 2, 0.4, 0]} />}
        </>
      )}
    </>
  );
};

export const Episode: React.FC<PropsEpisode> = (props) => (
  <EpisodeStandard {...props} donnees={donnees} eclairage={<></>} scene={<Scene al={props.alignement} />} />
);
