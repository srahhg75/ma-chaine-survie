import React, { useMemo } from "react";
import { AdditiveBlending, DoubleSide, Object3D, Quaternion, Vector3 } from "three";
import { EpisodeStandard, PropsEpisode } from "../../systeme/EpisodeStandard";
import { Arrondi } from "../../systeme/kit3d/Arrondi";
import { Fantome } from "../../systeme/kit3d/Fantome";
import { Bougie } from "../../systeme/kit3d/Lumieres";
import { Plante } from "../../systeme/kit3d/Mobilier";
import { bruit, clamp, Vec3 } from "../../systeme/maths";
import { Alignement } from "../../systeme/mots";
import { etatPersonnage, present, resoudrePersonnage } from "../../systeme/personnage/trajet";
import { Lumiere, useTemps } from "../001-h72/Episode";
import { DEMI, donnees, H, NIV, P, ZA, ZF } from "./donnees";

/*
 * Éléments 3D de H+72 partie 3 : la cage d'escalier en coupe, du 4e à la porte du toit, comme un vrai escalier
 * d'immeuble : paliers d'étage empilés à gauche (portes de Morel au 5e, d'Inès au 6e, des voisins au 7e, du toit),
 * paliers intermédiaires à droite (fenêtres sur la ville noire), deux demi-volées de 9 marches par étage.
 * Murs à deux tons (soubassement vert-de-gris, haut cassé), rampes, veilleuses de secours à piles.
 * La lampe de l'inconnu (faisceau froid) suit la position de son personnage invisible.
 */
const X0 = -1.8; // mur ouest (intérieur)
const X1 = 3.6; // mur est (intérieur)
const ZB = -1.6; // mur du fond (face intérieure −1,54)
const ZD = 1.0; // bord de la coupe (devant)
const HAUT = NIV.toit + 2.7; // plafond de la cage
const EP = 0.12;
const SOUBASSEMENT = 1.15;
const C_BAS = "#3f4a44";
const C_HAUT = "#a9a294";
const C_FRISE = "#2c332f";
const C_DALLE = "#5b5750";
const C_COUPE = "#2a2724";

type Trou = { u0: number; u1: number; y0: number; y1: number };

// Mur percé (portes, fenêtres) découpé en bandes horizontales ; deux tons selon la hauteur dans l'étage
const MurTroue: React.FC<{ axe: "x" | "z"; plan: number; u0: number; u1: number; trous: Trou[] }> = ({ axe, plan, u0, u1, trous }) => {
  const cellules = useMemo(() => {
    const ys = new Set<number>([-0.25, HAUT]);
    for (let k = 0; k <= 4; k++) {
      ys.add(k * H);
      ys.add(k * H + SOUBASSEMENT);
    }
    trous.forEach((t) => (ys.add(t.y0), ys.add(t.y1)));
    const Y = [...ys].filter((y) => y >= -0.25 && y <= HAUT).sort((a, b) => a - b);
    const res: { u0: number; u1: number; y0: number; y1: number; c: string }[] = [];
    for (let i = 0; i + 1 < Y.length; i++) {
      const [y0, y1] = [Y[i], Y[i + 1]];
      if (y1 - y0 < 1e-4) continue;
      const ym = (y0 + y1) / 2;
      const coupes = trous.filter((t) => ym > t.y0 && ym < t.y1).sort((a, b) => a.u0 - b.u0);
      let u = u0;
      const rel = ((ym % H) + H) % H;
      const c = rel < SOUBASSEMENT ? C_BAS : C_HAUT;
      for (const t of coupes) {
        if (t.u0 > u) res.push({ u0: u, u1: t.u0, y0, y1, c });
        u = Math.max(u, t.u1);
      }
      if (u < u1) res.push({ u0: u, u1, y0, y1, c });
    }
    return res;
  }, [u0, u1, trous]);
  return (
    <group>
      {cellules.map((k, i) => {
        const l = k.u1 - k.u0;
        const h = k.y1 - k.y0;
        const cu = (k.u0 + k.u1) / 2;
        const cy = (k.y0 + k.y1) / 2;
        return axe === "z" ? (
          <mesh key={i} position={[cu, cy, plan]} receiveShadow castShadow>
            <boxGeometry args={[l, h, EP]} />
            <meshStandardMaterial color={k.c} roughness={0.92} />
          </mesh>
        ) : (
          <mesh key={i} position={[plan, cy, cu]} receiveShadow castShadow>
            <boxGeometry args={[EP, h, l]} />
            <meshStandardMaterial color={k.c} roughness={0.92} />
          </mesh>
        );
      })}
      {/* frise sombre au-dessus du soubassement, à chaque étage, interrompue par les portes et ouvertures */}
      {[0, 1, 2, 3, 4].flatMap((k) => {
        const y = k * H + SOUBASSEMENT;
        const coupes = trous.filter((t) => y > t.y0 && y < t.y1).sort((a, b) => a.u0 - b.u0);
        const morceaux: [number, number][] = [];
        let u = u0;
        for (const t of coupes) {
          if (t.u0 > u) morceaux.push([u, t.u0]);
          u = Math.max(u, t.u1);
        }
        if (u < u1) morceaux.push([u, u1]);
        return morceaux.map(([a, b], j) =>
          axe === "z" ? (
            <mesh key={`${k}-${j}`} position={[(a + b) / 2, y, plan + EP / 2 + 0.005]}>
              <boxGeometry args={[b - a, 0.035, 0.012]} />
              <meshStandardMaterial color={C_FRISE} roughness={0.7} />
            </mesh>
          ) : (
            <mesh key={`${k}-${j}`} position={[plan + (plan < 0 ? EP / 2 + 0.005 : -EP / 2 - 0.005), y, (a + b) / 2]}>
              <boxGeometry args={[0.012, 0.035, b - a]} />
              <meshStandardMaterial color={C_FRISE} roughness={0.7} />
            </mesh>
          ),
        );
      })}
    </group>
  );
};

// Demi-volée de 9 marches (16 × 20 cm) de `bas` à `bas + DEMI` : au fond, elle monte vers l'est (de x 0 à 1,8) ;
// devant, elle monte vers l'ouest (de x 1,8 à 0)
const Volee: React.FC<{ bas: number; versEst: boolean }> = ({ bas, versEst }) => {
  const z = versEst ? ZF : ZA;
  const angle = Math.atan2(DEMI, 1.8);
  const zRampe = z + 0.47;
  return (
    <group>
      {Array.from({ length: 9 }, (_, i) => {
        const x = versEst ? (i + 0.5) * 0.2 : 1.8 - (i + 0.5) * 0.2;
        const haut = bas + (i + 1) * 0.16;
        return (
          <group key={i}>
            <mesh position={[x, haut - 0.11, z]} receiveShadow castShadow>
              <boxGeometry args={[0.2, 0.22, 0.9]} />
              <meshStandardMaterial color={i % 2 ? "#6d675e" : "#746e64"} roughness={0.9} />
            </mesh>
            {/* nez de marche usé */}
            <mesh position={[x + (versEst ? 0.095 : -0.095), haut - 0.005, z]}>
              <boxGeometry args={[0.02, 0.012, 0.9]} />
              <meshStandardMaterial color="#8a8378" roughness={0.6} />
            </mesh>
          </group>
        );
      })}
      {/* paillasse (dessous de la volée) */}
      <mesh position={[0.9, bas + DEMI / 2 - 0.26, z]} rotation={[0, 0, versEst ? angle : -angle]} castShadow receiveShadow>
        <boxGeometry args={[Math.hypot(1.8, DEMI), 0.16, 0.9]} />
        <meshStandardMaterial color={C_DALLE} roughness={0.95} />
      </mesh>
      {/* rampe : main courante en bois sur barreaux, côté vide (sud) */}
      <mesh position={[0.9, bas + DEMI / 2 + 0.92, zRampe]} rotation={[0, 0, versEst ? angle : -angle]}>
        <boxGeometry args={[Math.hypot(1.8, DEMI), 0.05, 0.06]} />
        <meshStandardMaterial color="#5a3b26" roughness={0.55} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => {
        const u = (i + 0.5) / 6;
        const x = versEst ? 1.8 * u : 1.8 * (1 - u);
        const y0 = bas + DEMI * u;
        return (
          <mesh key={i} position={[x, y0 + 0.45, zRampe]}>
            <boxGeometry args={[0.022, 0.9, 0.022]} />
            <meshStandardMaterial color="#232323" roughness={0.5} metalness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
};

// Dalle d'un palier (dessus à `y`), avec sa tranche « coupée » devant
const Dalle: React.FC<{ x0: number; x1: number; y: number; z0?: number; z1?: number }> = ({ x0, x1, y, z0 = ZB, z1 = ZD }) => (
  <group>
    <mesh position={[(x0 + x1) / 2, y - 0.11, (z0 + z1) / 2]} receiveShadow castShadow>
      <boxGeometry args={[x1 - x0, 0.22, z1 - z0]} />
      <meshStandardMaterial color="#6a645a" roughness={0.85} />
    </mesh>
    {/* carreaux de ciment (bande décorative) et tranche de coupe */}
    <mesh position={[(x0 + x1) / 2, y + 0.002, (z0 + z1) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[x1 - x0 - 0.1, z1 - z0 - 0.1]} />
      <meshStandardMaterial color="#7a6f60" roughness={0.8} />
    </mesh>
    <mesh position={[(x0 + x1) / 2, y - 0.11, z1 + 0.004]}>
      <planeGeometry args={[x1 - x0, 0.22]} />
      <meshStandardMaterial color={C_COUPE} roughness={1} />
    </mesh>
  </group>
);

// Porte palière : battant (charnière à `charniere`, s'ouvre de `angle` rad), cadre, poignée, numéro
const Porte: React.FC<{ charniere: Vec3; sens: "x+" | "x-" | "z-"; ouverture: number; angle: number; couleur?: string; largeur?: number }> = ({
  charniere,
  sens,
  ouverture,
  angle,
  couleur = "#5a3a2a",
  largeur = 0.9,
}) => {
  // battant fermé : le long de +x (porte du mur du fond, charnière à l'ouest), de −x (charnière à l'est) ou de +z (mur est, charnière au nord)
  const rot = sens === "x+" ? angle * ouverture : sens === "x-" ? -angle * ouverture : angle * ouverture;
  const local: Vec3 = sens === "x+" ? [largeur / 2, 1.015, 0] : sens === "x-" ? [-largeur / 2, 1.015, 0] : [0, 1.015, largeur / 2];
  const taille: [number, number, number] = sens === "z-" ? [0.05, 2.03, largeur] : [largeur, 2.03, 0.05];
  const poignee: Vec3 = sens === "x+" ? [largeur - 0.12, 1.0, 0.04] : sens === "x-" ? [-largeur + 0.12, 1.0, 0.04] : [-0.04, 1.0, largeur - 0.12];
  return (
    <group position={charniere} rotation={[0, rot, 0]}>
      <Arrondi taille={taille} position={local} rayon={0.01} couleur={couleur} rugosite={0.6} />
      {/* moulures */}
      {[0.55, 1.45].map((y) => (
        <Arrondi
          key={y}
          taille={sens === "z-" ? [0.012, 0.7, largeur - 0.24] : [largeur - 0.24, 0.7, 0.012]}
          position={[local[0] + (sens === "z-" ? -0.03 : 0), y, local[2] + (sens === "z-" ? 0 : 0.03)]}
          rayon={0.01}
          couleur={couleur}
          rugosite={0.55}
        />
      ))}
      <Arrondi taille={sens === "z-" ? [0.03, 0.022, 0.14] : [0.14, 0.022, 0.03]} position={poignee} rayon={0.008} couleur="#c8b27a" metal={0.85} rugosite={0.25} />
    </group>
  );
};

// Cadre (chambranle) d'une ouverture
const Chambranle: React.FC<{ centre: Vec3; axe: "x" | "z"; largeur?: number; hauteur?: number; ouest?: boolean }> = ({ centre, axe, largeur = 0.9, hauteur = 2.05, ouest = false }) => {
  const [cx0, cy, cz] = centre;
  // sur un mur ouest, le chambranle est posé côté cage (vers l'est)
  const cx = ouest ? cx0 + 0.14 : cx0;
  const pieces: [Vec3, [number, number, number]][] =
    axe === "z"
      ? [
          [[cx - largeur / 2 - 0.04, cy + hauteur / 2, cz + 0.07], [0.08, hauteur + 0.08, 0.03]],
          [[cx + largeur / 2 + 0.04, cy + hauteur / 2, cz + 0.07], [0.08, hauteur + 0.08, 0.03]],
          [[cx, cy + hauteur + 0.04, cz + 0.07], [largeur + 0.16, 0.08, 0.03]],
        ]
      : [
          [[cx - 0.07, cy + hauteur / 2, cz - largeur / 2 - 0.04], [0.03, hauteur + 0.08, 0.08]],
          [[cx - 0.07, cy + hauteur / 2, cz + largeur / 2 + 0.04], [0.03, hauteur + 0.08, 0.08]],
          [[cx - 0.07, cy + hauteur + 0.04, cz], [0.03, 0.08, largeur + 0.16]],
        ];
  return (
    <group>
      {pieces.map(([p, t], i) => (
        <Arrondi key={i} taille={t} position={p} rayon={0.008} couleur="#d8d0c0" rugosite={0.6} />
      ))}
    </group>
  );
};

// Fenêtre d'escalier (mur du fond) : cadre, croisillon, vitre ; la ville noire se voit derrière
const FenetreEscalier: React.FC<{ x: number; y0: number }> = ({ x, y0 }) => (
  <group position={[x, y0, ZB + EP / 2]}>
    {[
      [0.86, 0.05, 0, 1.1],
      [0.86, 0.06, 0, 0],
      [0.05, 1.1, -0.405, 0.55],
      [0.05, 1.1, 0.405, 0.55],
      [0.03, 1.1, 0, 0.55],
    ].map(([w, h, dx, dy], i) => (
      <Arrondi key={i} taille={[w, h, 0.05]} position={[dx, dy, 0]} rayon={0.008} couleur="#cfc8b8" rugosite={0.6} />
    ))}
    <mesh position={[0, 0.55, -0.01]}>
      <planeGeometry args={[0.8, 1.06]} />
      <meshPhysicalMaterial color="#9fb6c9" roughness={0.05} transparent opacity={0.18} side={DoubleSide} />
    </mesh>
    {/* rebord */}
    <Arrondi taille={[0.95, 0.04, 0.16]} position={[0, -0.02, 0.07]} rayon={0.01} couleur="#8a8378" />
  </group>
);

// Veilleuse de secours à piles (pas de courant) : petite lueur verte, portée limitée au palier
const Veilleuse: React.FC<{ position: Vec3; puissance?: number }> = ({ position, puissance = 1 }) => (
  <group position={position}>
    <mesh>
      <boxGeometry args={[0.28, 0.09, 0.05]} />
      <meshStandardMaterial color="#d8ffe0" emissive="#5dff8a" emissiveIntensity={0.55} />
    </mesh>
    <pointLight position={[0, -0.2, 0.5]} intensity={0.9 * puissance} distance={3.2} color="#9fd8b0" decay={2} />
  </group>
);

// Bouton de minuterie (éteint : pas de courant)
const Minuterie: React.FC<{ position: Vec3; mur: "z" | "x" }> = ({ position, mur }) => (
  <Arrondi taille={mur === "z" ? [0.07, 0.07, 0.02] : [0.02, 0.07, 0.07]} position={position} rayon={0.01} couleur="#9a7a3a" rugosite={0.5} />
);

const Paillasson: React.FC<{ position: Vec3; rotation?: number }> = ({ position, rotation = 0 }) => (
  <Arrondi taille={[0.7, 0.015, 0.45]} position={[position[0], position[1] + 0.008, position[2]]} rotation={[0, rotation, 0]} rayon={0.005} couleur="#6b4f2e" rugosite={1} />
);

export const Bidon: React.FC<{ position: Vec3; rotation?: number }> = ({ position, rotation = 0 }) => (
  <group position={position} rotation={[0, rotation, 0]}>
    <Arrondi taille={[0.3, 0.42, 0.17]} position={[0, 0.21, 0]} rayon={0.035} couleur="#dfe6ea" rugosite={0.35} />
    <Arrondi taille={[0.29, 0.36, 0.16]} position={[0, 0.19, 0]} rayon={0.03} couleur="#6fa8d8" rugosite={0.1} />
    <Arrondi taille={[0.1, 0.05, 0.05]} position={[0.08, 0.45, 0]} rayon={0.015} couleur="#2f5d8a" rugosite={0.5} />
    <Arrondi taille={[0.12, 0.04, 0.04]} position={[-0.06, 0.44, 0]} rayon={0.015} couleur="#cfd6da" rugosite={0.4} />
  </group>
);

// Poussette repliée (des gens vivent au 7e)
const Poussette: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position} rotation={[0, -0.3, 0]}>
    <Arrondi taille={[0.5, 0.3, 0.35]} position={[0, 0.55, 0]} rayon={0.08} couleur="#3d5a7a" rugosite={0.9} />
    <mesh position={[0.2, 0.8, 0]} rotation={[0, 0, 0.5]}>
      <boxGeometry args={[0.02, 0.6, 0.3]} />
      <meshStandardMaterial color="#222" metalness={0.5} roughness={0.4} />
    </mesh>
    {[-0.18, 0.18].flatMap((x) =>
      [-0.15, 0.15].map((z) => (
        <mesh key={`${x}${z}`} position={[x, 0.08, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.07, 0.018, 8, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
        </mesh>
      )),
    )}
  </group>
);

/*
 * Faisceau de lampe torche : source lumineuse, cône de lumière visible (additif) et vraie lumière (spot)
 * dirigée vers `vise`. `froid` = lampe de l'inconnu (blanc bleuté), sinon lumière chaude.
 */
const Y_HAUT = new Vector3(0, 1, 0);
export const Faisceau: React.FC<{ origine: Vec3; vise: Vec3; force: number; longueur?: number; froid?: boolean; ombre?: boolean }> = ({ origine, vise, force, longueur = 3.2, froid = true, ombre = false }) => {
  const cible = useMemo(() => new Object3D(), []);
  const d = new Vector3(vise[0] - origine[0], vise[1] - origine[1], vise[2] - origine[2]).normalize();
  const q = new Quaternion().setFromUnitVectors(Y_HAUT, d.clone().negate());
  cible.position.set(...vise);
  cible.updateMatrixWorld();
  if (force <= 0.01) return null;
  const couleur = froid ? "#dfe9ff" : "#ffe2b0";
  return (
    <group>
      <primitive object={cible} />
      <mesh position={origine}>
        <sphereGeometry args={[0.04, 12, 10]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={force} />
      </mesh>
      {/* halo autour de l'ampoule */}
      <mesh position={origine}>
        <sphereGeometry args={[0.16, 14, 10]} />
        <meshBasicMaterial color={couleur} transparent opacity={0.22 * force} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[origine[0] + (d.x * longueur) / 2, origine[1] + (d.y * longueur) / 2, origine[2] + (d.z * longueur) / 2]} quaternion={q}>
        <coneGeometry args={[0.55, longueur, 28, 1, true]} />
        <meshBasicMaterial color={couleur} transparent opacity={0.075 * force} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} toneMapped={false} />
      </mesh>
      <spotLight position={origine} target={cible} angle={0.36} penumbra={0.55} intensity={7 * force} distance={10} decay={1.6} color={couleur} castShadow={ombre} />
    </group>
  );
};

// Point visé par la lampe de l'inconnu : vers le haut de la cage (là où est Inès), avec un léger balayage
const visee = (o: Vec3, cibleY: number, t: number, balayage = 0.5): Vec3 => [0.6 + balayage * Math.sin(t * 1.3), cibleY, -0.3 + 0.3 * Math.sin(t * 0.9)];

const Scene: React.FC<{ al: Alignement }> = ({ al }) => {
  const { t, fps, f, a, entre } = useTemps(al);
  const perso = (id: string) => donnees.personnages.find((p) => p.id === id)!;
  const ines6 = useMemo(() => resoudrePersonnage(perso("ines6"), al, fps), [al, fps]);
  const ines = useMemo(() => resoudrePersonnage(perso("ines"), al, fps), [al, fps]);
  const inconnu = useMemo(() => resoudrePersonnage(perso("inconnu"), al, fps), [al, fps]);
  const e6 = etatPersonnage(ines6, f, fps);
  const e = etatPersonnage(ines, f, fps);
  const ei = etatPersonnage(inconnu, f, fps);
  const inesLa = present(ines, f);
  const ines6La = present(ines6, f);

  // ---- lampe de l'inconnu : allumée au hook, puis de « s'allume » aux 2 éclats, puis de « monte » à « s'éteint » ;
  // elle se rallume à « Ils sont deux » ----
  const eclat = (ancre: string) => t >= a(ancre) && t < a(ancre) + 0.14;
  const lampeInconnu =
    t < a("hook2.fin") + 0.3 ||
    (t >= a("lampe:allume") && t < a("eclats") - 0.25) ||
    eclat("eclats:2") ||
    (t >= a("eclats:2") + 0.3 && t < a("eclats:2") + 0.44) ||
    (t >= a("monte:monte") && t < a("calme:eteint")) ||
    t >= a("deux:deux");
  const or = (ei.orientation * Math.PI) / 180;
  const origineInc: Vec3 = [ei.position[0] + Math.sin(or) * 0.25, ei.position[1] + 1.05, ei.position[2] + Math.cos(or) * 0.25];
  const cibleInc = visee(origineInc, (inesLa ? e.position[1] : NIV.e6) + 1.0, t, t < a("hook2.fin") + 0.3 ? 1.4 : 0.5);
  // flash-back des 2 éclats (« Vous vous souvenez des 2 éclats ? »)
  const flash = eclat("rappel:2") || (t >= a("rappel:2") + 0.3 && t < a("rappel:2") + 0.44);

  // ---- complice sur le toit ----
  const porteToit = entre("toit", "toit:grince+0.3");
  const lampeToit = eclat("reponse:2") || (t >= a("reponse:2") + 0.3 && t < a("reponse:2") + 0.44) || t >= a("deux:deux") - 0.1;

  // ---- fantômes : la lampe qui entre chez Inès (branche A), la lampe qui se pose sur sa porte (tactique 1) ----
  const opA = clamp(Math.min((t - a("a2:revient") + 0.2) / 0.25, (a("a2.fin") + 0.1 - t) / 0.25));
  const uA = entre("a2:revient", "a2:vide");
  const fA: Vec3 = [1.6 - 2.2 * uA, NIV.e5 + DEMI + 0.9 + 0.7 * uA, ZA - 1.0 * uA];
  const op1 = clamp(Math.min((t - a("t1a") + 0.1) / 0.25, (a("t1b.fin") + 0.2 - t) / 0.25));
  const u1 = entre("t1a", "t1a:porte");
  const f1: Vec3 = [1.4 - 1.0 * u1, NIV.e5 + DEMI + 1.2 + 0.6 * u1, ZA];

  // ---- objets ----
  const porteMorel = t >= a("recap3") - 0.5 && t < a("lampe") ? 1 : 0;
  const bidonSol = clamp((t - a("m_bidon:bidon") + 0.3) / 0.5); // poussé par Morel sur le palier
  const porte = t >= a("i_rat.fin") + 0.15 && t < a("t2c:frappe") - 0.35; // Inès porte le bidon
  const posePorte = t >= a("t2c:frappe") - 0.35;
  const oI = (e.orientation * Math.PI) / 180;
  const mainG: Vec3 = [e.position[0] + Math.cos(oI) * 0.27, e.position[1] + 0.1, e.position[2] - Math.sin(oI) * 0.27];
  const bougies7 = 0.85 + 0.15 * Math.sin(t * 7.3) * Math.sin(t * 3.1);

  return (
    <>
      <Lumiere nuit={1} />

      <CageEscalier porteMorel={porteMorel} porteToit={porteToit} bougies7={bougies7} />
      {bidonSol > 0 && !porte && !posePorte && (
        <Bidon position={[-1.6 + 0.1 * bidonSol - 0.35 * (1 - bidonSol), NIV.e5, -1.15]} rotation={0.2} />
      )}
      {porte && inesLa && <Bidon position={mainG} rotation={-oI + Math.PI / 2} />}
      {posePorte && <Bidon position={[-0.75, NIV.e7, -1.15]} rotation={0.3} />}

      {/* ======== personnages : lampes et objets ======== */}
      {ines6La && e6.lampe && <pointLight position={[e6.position[0], e6.position[1] + 1.0, e6.position[2] + 0.2]} intensity={0.45} distance={2.5} color="#fff1d8" />}
      {inesLa && e.lampe && <pointLight position={[e.position[0], e.position[1] + 1.0, e.position[2] + 0.2]} intensity={0.45} distance={2.5} color="#fff1d8" />}
      {/* téléphone d'Inès (écran allumé) pendant l'appel au 17 */}
      {inesLa && t >= a("t3:appelez") && t < a("i_17.fin") + 0.3 && (
        <mesh position={[e.position[0] - Math.cos(oI) * 0.2 + Math.sin(oI) * 0.05, e.position[1] + 1.12, e.position[2] + Math.sin(oI) * 0.2 + Math.cos(oI) * 0.05]} rotation={[0, oI, 0.2]}>
          <boxGeometry args={[0.012, 0.13, 0.065]} />
          <meshStandardMaterial color="#111" emissive="#7fb6ff" emissiveIntensity={0.7} roughness={0.3} />
        </mesh>
      )}
      {inesLa && t >= a("t3:appelez") && t < a("i_17.fin") + 0.3 && <pointLight position={[e.position[0], e.position[1] + 1.15, e.position[2] + 0.25]} intensity={0.25} distance={1.2} color="#7fb6ff" />}

      {/* lampe de l'inconnu */}
      <Faisceau origine={origineInc} vise={cibleInc} force={lampeInconnu ? 1 : 0} ombre />
      {/* flash-back des 2 éclats (même lampe, même endroit qu'à « 2 éclats ») */}
      <Faisceau origine={P.lampe4} vise={[0.6, NIV.e6, -0.3]} force={flash ? 1 : 0} />
      {/* la lampe qui répond, derrière la porte du toit */}
      <Faisceau origine={P.lampeToit} vise={[-0.3, NIV.e7 + 0.8, -0.2]} force={lampeToit ? (t >= a("deux:deux") - 0.1 ? 0.8 : 1) : 0} longueur={3.6} />

      {/* fantômes rouges */}
      <Fantome opacite={opA}>
        <Faisceau origine={fA} vise={[-0.9, NIV.e6 + 1.0, ZB]} force={1} longueur={2.4} />
      </Fantome>
      <Fantome opacite={op1}>
        <Faisceau origine={f1} vise={[-0.9, NIV.e6 + 1.4, ZB]} force={1} longueur={2.6} />
      </Fantome>
    </>
  );
};

/*
 * La cage d'escalier en coupe (4e → toit), sans la logique d'un épisode : réutilisée par les parties 3 et 4.
 * Portes : 0 = fermée, 1 = ouverte. `entree7` / `entreeNord4` / `entreeInes` dessinent l'espace construit derrière
 * une porte qu'on ouvre (leçon du 24/10 : une porte ne donne jamais sur le vide) ; `lumiere7` = lampes des voisins.
 */
export type PropsCage = {
  porteMorel: number;
  porteToit: number;
  bougies7: number;
  porte4?: number;
  porte6?: number;
  porte7?: number;
  lumiere4?: number;
  lumiere7?: number;
  entreeInes?: boolean;
};

export const CageEscalier: React.FC<PropsCage> = ({ porteMorel, porteToit, bougies7, porte4 = 0, porte6 = 0, porte7 = 0, lumiere4 = 0, lumiere7 = 0, entreeInes = false }) => {
  const entree7 = porte7 > 0 || lumiere7 > 0;
  return (
    <>
      {/* ======== la cage ======== */}
      <Immeuble entree7={entree7} />
      <MurTroue
        axe="z"
        plan={ZB - EP / 2 + 0.06}
        u0={X0 - EP}
        u1={X1 + EP}
        trous={[
          { u0: -1.35, u1: -0.45, y0: NIV.e6, y1: NIV.e6 + 2.05 }, // porte d'Inès
          { u0: -1.35, u1: -0.45, y0: NIV.toit, y1: NIV.toit + 2.05 }, // porte du toit
          ...[NIV.e4, NIV.e5, NIV.e6, NIV.e7].map((y) => ({ u0: 2.3, u1: 3.1, y0: y + DEMI + 0.6, y1: y + DEMI + 1.7 })), // fenêtres
        ]}
      />
      <MurTroue
        axe="x"
        plan={X0 - EP / 2}
        u0={ZB}
        u1={ZD}
        trous={[
          // porte de Morel (5e) et mur arasé (coupe) entre le palier et son entrée : on les voit ensemble au dialogue
          { u0: -1.05, u1: -0.15, y0: NIV.e5, y1: NIV.e5 + 2.05 },
          { u0: -0.15, u1: ZD + 0.01, y0: NIV.e5 + 0.22, y1: NIV.e5 + 2.6 },
          { u0: -0.95, u1: -0.05, y0: NIV.e7, y1: NIV.e7 + 2.05 }, // voisins du 7e
        ]}
      />
      <MurTroue axe="x" plan={X1 + EP / 2} u0={ZB} u1={ZD} trous={[]} />
      {/* plafond */}
      <mesh position={[(X0 + X1) / 2, HAUT + 0.1, (ZB + ZD) / 2]}>
        <boxGeometry args={[X1 - X0 + 0.3, 0.2, ZD - ZB]} />
        <meshStandardMaterial color="#3a3833" roughness={1} />
      </mesh>
      {/* paliers d'étage empilés à gauche ; paliers intermédiaires à droite (mi-étage) ; deux demi-volées par étage */}
      <Dalle x0={X0} x1={X1} y={NIV.e4} />
      {[NIV.e5, NIV.e6, NIV.e7, NIV.toit].map((y) => (
        <Dalle key={y} x0={X0} x1={0} y={y} />
      ))}
      {[NIV.e4, NIV.e5, NIV.e6, NIV.e7].map((y) => (
        <group key={y}>
          <Dalle x0={1.8} x1={X1} y={y + DEMI} />
          <Volee bas={y} versEst />
          <Volee bas={y + DEMI} versEst={false} />
          <FenetreEscalier x={2.7} y0={y + DEMI + 0.6} />
          {/* lueur de lune par la fenêtre */}
          <pointLight position={[2.7, y + DEMI + 1.2, -1.2]} intensity={0.35} distance={3.0} color="#9fb4e8" decay={2} />
        </group>
      ))}

      {/* ---- 4e : porte palière fermée, paillasson, veilleuse ---- */}
      <Chambranle centre={[-0.9, NIV.e4, ZB + 0.02]} axe="z" />
      <Porte charniere={[-1.35, NIV.e4, ZB + 0.06]} sens="x+" ouverture={porte4} angle={1.2} couleur="#4a3a5a" />
      {(porte4 > 0 || lumiere4 > 0) && <EntreeNord y={NIV.e4} lumiere={lumiere4} graine="e4" />}
      <Paillasson position={[-0.9, NIV.e4, -1.2]} />
      <Veilleuse position={[-0.9, NIV.e4 + 2.35, ZB + 0.1]} puissance={0.8} />
      <Minuterie position={[-0.2, NIV.e4 + 1.2, ZB + 0.08]} mur="z" />

      {/* ---- 5e : porte de Morel (mur ouest, juste sous Inès), son entrée et ses bidons ---- */}
      <Chambranle centre={[X0 - 0.02, NIV.e5, -0.6]} axe="x" ouest />
      <Porte charniere={[X0 - 0.03, NIV.e5, -1.05]} sens="z-" ouverture={porteMorel} angle={-1.35} couleur="#3f5b4a" />
      <EntreeMorel bidonsVisibles />
      <Veilleuse position={[-0.9, NIV.e5 + 2.35, ZB + 0.1]} />
      <Minuterie position={[-0.2, NIV.e5 + 1.2, ZB + 0.08]} mur="z" />

      {/* ---- 6e : la porte d'Inès (mur du fond) ---- */}
      <Chambranle centre={[-0.9, NIV.e6, ZB + 0.02]} axe="z" />
      <Porte charniere={[-1.35, NIV.e6, ZB + 0.06]} sens="x+" ouverture={porte6} angle={1.3} couleur="#5a3a2a" />
      {entreeInes && <EntreeNord y={NIV.e6} lumiere={0} graine="ines" />}
      <Arrondi taille={[0.1, 0.07, 0.01]} position={[-0.9, NIV.e6 + 1.6, ZB + 0.1]} rayon={0.004} couleur="#c8b27a" metal={0.8} rugosite={0.3} />
      <Paillasson position={[-0.9, NIV.e6, -1.2]} />
      <Veilleuse position={[-0.2, NIV.e6 + 2.35, ZB + 0.1]} puissance={0.9} />
      <Minuterie position={[-0.15, NIV.e6 + 1.2, ZB + 0.08]} mur="z" />
      <Plante position={[-1.6, NIV.e6, 0.75]} graine="palier6" />

      {/* ---- 7e : les voisins (porte du mur ouest), bougies derrière, poussette ---- */}
      <Chambranle centre={[X0 - 0.02, NIV.e7, -0.5]} axe="x" ouest />
      <Porte charniere={[X0 - 0.03, NIV.e7, -0.95]} sens="z-" ouverture={porte7} angle={-1.35} couleur="#6a4a2a" />
      {entree7 && <EntreeOuest y={NIV.e7} lumiere={lumiere7} />}
      {/* lueur des bougies sous la porte */}
      <mesh position={[X0 - 0.01, NIV.e7 + 0.012, -0.5]}>
        <boxGeometry args={[0.04, 0.018, 0.8]} />
        <meshBasicMaterial color="#ffb050" toneMapped={false} transparent opacity={0.9 * bougies7} />
      </mesh>
      <pointLight position={[X0 + 0.15, NIV.e7 + 0.12, -0.5]} intensity={0.55 * bougies7} distance={1.8} color="#ffa040" decay={2} />
      <Poussette position={[-0.4, NIV.e7, -1.25]} />
      <Paillasson position={[X0 + 0.3, NIV.e7, -0.5]} rotation={Math.PI / 2} />
      <Veilleuse position={[-0.9, NIV.e7 + 2.35, ZB + 0.1]} />
      <Minuterie position={[-0.2, NIV.e7 + 1.2, ZB + 0.08]} mur="z" />

      {/* ---- toit : porte du fond, terrasse, parapet ---- */}
      <Chambranle centre={[-0.9, NIV.toit, ZB + 0.02]} axe="z" />
      <Porte charniere={[-0.45, NIV.toit, ZB - 0.02]} sens="x-" ouverture={porteToit} angle={1.2} couleur="#55595e" />
      <Arrondi taille={[0.42, 0.12, 0.01]} position={[-0.9, NIV.toit + 2.25, ZB + 0.1]} rayon={0.004} couleur="#b23a2a" rugosite={0.6} />
      <Dalle x0={-3.0} x1={1.6} y={NIV.toit} z0={-5.0} z1={ZB - EP} />
      <Arrondi taille={[4.6, 0.6, 0.15]} position={[-0.7, NIV.toit + 0.3, -5.0]} rayon={0.02} couleur="#5b5750" />
      <Veilleuse position={[-0.2, NIV.toit + 2.35, ZB + 0.1]} puissance={0.7} />
      {/* neige qui entre quand la porte s'ouvre : lumière froide de dehors */}
      {porteToit > 0.05 && <pointLight position={[-0.9, NIV.toit + 1.2, ZB - 0.4]} intensity={0.8 * porteToit} distance={3.0} color="#a9c4ff" decay={2} />}
    </>
  );
};

// Entrée d'un appartement derrière une porte du mur du fond (4e, Inès au 6e) : sol, murs, patère, lueur éventuelle
const EntreeNord: React.FC<{ y: number; lumiere: number; graine: string }> = ({ y, lumiere, graine }) => {
  const x0 = -1.75;
  const x1 = 0.45;
  const z0 = -5.0; // assez profond pour reculer la caméra à l'intérieur (cadrages larges)
  const z1 = ZB - EP;
  const murs = graine === "ines" ? "#8f8270" : "#7a6e5e";
  return (
    <group>
      <Dalle x0={x0} x1={x1} y={y} z0={z0} z1={z1} />
      <mesh position={[(x0 + x1) / 2, y + 1.3, z0]}>
        <boxGeometry args={[x1 - x0, 2.6, EP]} />
        <meshStandardMaterial color={murs} roughness={0.9} />
      </mesh>
      {[x0, x1].map((x) => (
        <mesh key={x} position={[x, y + 1.3, (z0 + z1) / 2]}>
          <boxGeometry args={[EP, 2.6, z1 - z0]} />
          <meshStandardMaterial color={murs} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[(x0 + x1) / 2, y + 2.7, (z0 + z1) / 2]}>
        <boxGeometry args={[x1 - x0 + 0.2, 0.2, z1 - z0 + 0.1]} />
        <meshStandardMaterial color="#3a3833" roughness={1} />
      </mesh>
      {/* patère et manteau, petit meuble à chaussures */}
      <Arrondi taille={[0.34, 0.85, 0.14]} position={[x1 - 0.12, y + 1.25, -2.6]} rotation={[0, Math.PI / 2, 0]} rayon={0.06} couleur={graine === "ines" ? "#2f6f73" : "#4f4a40"} />
      <Arrondi taille={[0.7, 0.45, 0.3]} position={[x0 + 0.25, y + 0.225, -2.7]} rotation={[0, Math.PI / 2, 0]} rayon={0.03} couleur="#6b4a32" />
      {/* chez Inès : pas de bougie, juste la lueur froide de la nuit (une fenêtre hors champ) : murs et sol lisibles */}
      {graine === "ines" && <pointLight position={[-0.2, y + 1.9, -3.6]} intensity={1.1} distance={4.5} color="#9fb4e8" decay={2} />}
      {lumiere > 0.01 && (
        <>
          <Bougie position={[x0 + 0.25, y + 0.46, -2.55]} allumee graine={`entree${graine}`} puissance={0.8 * lumiere} />
          <pointLight position={[-0.6, y + 1.4, -2.2]} intensity={2.6 * lumiere} distance={3.6} color="#ffb366" decay={2} />
        </>
      )}
    </group>
  );
};

// Entrée d'un appartement derrière une porte du mur ouest (voisins du 7e) : comme celle de Morel, sans les bidons
const EntreeOuest: React.FC<{ y: number; lumiere: number }> = ({ y, lumiere }) => {
  const x0 = -3.4;
  const x1 = X0 - EP;
  return (
    <group>
      <Dalle x0={x0} x1={x1} y={y} z0={ZB} z1={0.6} />
      <mesh position={[(x0 + x1) / 2, y + 1.3, ZB]}>
        <boxGeometry args={[x1 - x0, 2.6, EP]} />
        <meshStandardMaterial color="#7d6a52" roughness={0.9} />
      </mesh>
      <mesh position={[x0 - EP / 2, y + 1.3, (ZB + 0.6) / 2]}>
        <boxGeometry args={[EP, 2.6, 0.6 - ZB]} />
        <meshStandardMaterial color="#7d6a52" roughness={0.9} />
      </mesh>
      <mesh position={[(x0 + x1) / 2, y + 2.7, (ZB + 0.6) / 2]}>
        <boxGeometry args={[x1 - x0 + 0.2, 0.2, 0.6 - ZB]} />
        <meshStandardMaterial color="#3a3833" roughness={1} />
      </mesh>
      <mesh position={[(x0 + x1) / 2, y + 1.3, 0.6]}>
        <boxGeometry args={[x1 - x0, 2.6, EP]} />
        <meshStandardMaterial color="#7d6a52" roughness={0.9} />
      </mesh>
      {/* console avec bougies, manteaux d'enfant et d'adulte */}
      <Arrondi taille={[0.32, 0.8, 0.9]} position={[-3.18, y + 0.4, -0.6]} rayon={0.03} couleur="#5a3d28" />
      <Bougie position={[-3.18, y + 0.82, -0.85]} allumee graine="voisins7a" puissance={0.9} />
      <Bougie position={[-3.18, y + 0.82, -0.4]} allumee graine="voisins7b" puissance={0.8} />
      <Arrondi taille={[0.14, 0.5, 0.3]} position={[-2.6, y + 1.35, -1.47]} rayon={0.05} couleur="#c24a3a" />
      <Arrondi taille={[0.16, 0.85, 0.36]} position={[-2.2, y + 1.2, -1.45]} rayon={0.06} couleur="#3c4b5c" />
      <pointLight position={[-2.6, y + 1.5, -0.5]} intensity={0.6 + 3.2 * lumiere} distance={3.8} color="#ffb05a" decay={2} />
    </group>
  );
};

// Le reste de l'immeuble autour de la cage, vu en coupe : masses sombres, une ligne claire par plancher
const Masse: React.FC<{ x0: number; x1: number; y0: number; y1: number }> = ({ x0, x1, y0, y1 }) => (
  <group>
    <mesh position={[(x0 + x1) / 2, (y0 + y1) / 2, (ZB - 1.5 + ZD) / 2]} receiveShadow>
      <boxGeometry args={[x1 - x0, y1 - y0, ZD - ZB + 1.5]} />
      <meshStandardMaterial color="#1c1a18" roughness={1} />
    </mesh>
    {[-1, 0, 1, 2, 3, 4, 5].map((k) => k * H).filter((y) => y > y0 + 0.05 && y < y1 - 0.05).map((y) => (
      <mesh key={y} position={[(x0 + x1) / 2, y - 0.11, ZD + 0.006]}>
        <planeGeometry args={[x1 - x0, 0.22]} />
        <meshStandardMaterial color="#34302b" roughness={1} />
      </mesh>
    ))}
  </group>
);

const Immeuble: React.FC<{ entree7?: boolean }> = ({ entree7 = false }) => (
  <group>
    {/* ouest : les appartements, sous et au-dessus de l'entrée de Morel (5e) (et de celle du 7e), et au-delà */}
    <Masse x0={-3.52} x1={X0 - EP} y0={-6} y1={NIV.e5 - 0.22} />
    {entree7 ? (
      <>
        <Masse x0={-3.52} x1={X0 - EP} y0={NIV.e5 + 2.8} y1={NIV.e7 - 0.22} />
        <Masse x0={-3.52} x1={X0 - EP} y0={NIV.e7 + 2.8} y1={HAUT + 0.2} />
      </>
    ) : (
      <Masse x0={-3.52} x1={X0 - EP} y0={NIV.e5 + 2.8} y1={HAUT + 0.2} />
    )}
    <Masse x0={-9} x1={-3.52} y0={-6} y1={HAUT + 0.2} />
    {/* est */}
    <Masse x0={X1 + EP} x1={9} y0={-6} y1={HAUT + 0.2} />
    {/* devant et sous la coupe : le vide de la nuit (cache le sol extérieur dans les plongées) */}
    <mesh position={[2, 0.03, ZD + 30.02]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[90, 60]} />
      <meshBasicMaterial color="#040507" />
    </mesh>
    {/* sous le 4e : les étages inférieurs */}
    <Masse x0={X0 - EP} x1={X1 + EP} y0={-6} y1={NIV.e4 - 0.22} />
  </group>
);

// Entrée de Morel (5e), derrière la porte du mur ouest : on la voit en coupe (devant ouvert)
const EntreeMorel: React.FC<{ bidonsVisibles: boolean }> = ({ bidonsVisibles }) => {
  const y = NIV.e5;
  const x0 = -3.4;
  const x1 = X0 - EP;
  return (
    <group>
      <Dalle x0={x0} x1={x1} y={y} z0={ZB} z1={0.6} />
      <mesh position={[(x0 + x1) / 2, y + 1.3, ZB]}>
        <boxGeometry args={[x1 - x0, 2.6, EP]} />
        <meshStandardMaterial color="#8a7a5e" roughness={0.9} />
      </mesh>
      <mesh position={[x0 - EP / 2, y + 1.3, (ZB + 0.6) / 2]}>
        <boxGeometry args={[EP, 2.6, 0.6 - ZB]} />
        <meshStandardMaterial color="#8a7a5e" roughness={0.9} />
      </mesh>
      <mesh position={[(x0 + x1) / 2, y + 2.7, (ZB + 0.6) / 2]}>
        <boxGeometry args={[x1 - x0 + 0.2, 0.2, 0.6 - ZB]} />
        <meshStandardMaterial color="#3a3833" roughness={1} />
      </mesh>
      {/* bidons alignés contre le mur du fond (l'eau d'Inès) */}
      {bidonsVisibles &&
        [-2.45, -2.8, -3.15].flatMap((x, i) => [
          <Bidon key={`a${i}`} position={[x, y, -1.38]} rotation={(bruit("bm", i) - 0.5) * 0.3} />,
          <Bidon key={`b${i}`} position={[x, y, -1.18]} rotation={(bruit("bm", i + 5) - 0.5) * 0.3} />,
        ])}
      {/* patère et manteau, bougie sur un tabouret */}
      <Arrondi taille={[0.34, 0.85, 0.14]} position={[-3.3, y + 1.25, -0.4]} rayon={0.06} couleur="#4f4a40" />
      <Arrondi taille={[0.3, 0.45, 0.3]} position={[-3.15, y + 0.225, 0.25]} rayon={0.03} couleur="#6b4a32" />
      <Bougie position={[-3.15, y + 0.46, 0.25]} allumee graine="morel3" puissance={0.9} />
    </group>
  );
};

export const Episode: React.FC<PropsEpisode> = (props) => (
  <EpisodeStandard {...props} donnees={donnees} eclairage={<></>} scene={<Scene al={props.alignement} />} />
);
