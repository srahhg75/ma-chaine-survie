import React, { useMemo } from "react";
import { DoubleSide } from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { EpisodeStandard, PropsEpisode } from "../../systeme/EpisodeStandard";
import { Arrondi } from "../../systeme/kit3d/Arrondi";
import { Fantome } from "../../systeme/kit3d/Fantome";
import { Bougie, Environnement } from "../../systeme/kit3d/Lumieres";
import { Bibliotheque, Cadre, CanapeTissu, Plante, TapisEpais } from "../../systeme/kit3d/Mobilier";
import { useMateriauPBR } from "../../systeme/kit3d/pbr";
import { bruit, clamp, doux, lerp, Vec3 } from "../../systeme/maths";
import { Alignement } from "../../systeme/mots";
import { etatPersonnage, resoudrePersonnage } from "../../systeme/personnage/trajet";
import { Ancre, instant } from "../../systeme/timeline";
import { donnees, ETAGE, P, SOUS_SOL } from "./donnees";

/*
 * Éléments 3D propres à H+72 partie 1 : l'immeuble en coupe et sa pompe, l'eau (robinet qui crache de l'air,
 * colonne qui se vide, vidange du ballon), le placard du ballon, les WC, le lavabo, le tableau électrique,
 * la porte d'entrée et son verrou, les objets de chaque tactique et les fantômes des mauvais réflexes.
 */

const EAU = "#6fa8d8";

// Temps courant + lecteur d'ancres
const useTemps = (al: Alignement) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const a = (x: Ancre) => instant(x, al);
  // progression douce 0 -> 1 entre deux ancres (ou une ancre et une durée)
  const entre = (de: Ancre, vers: Ancre | number, d?: number) => {
    const t0 = a(de);
    const t1 = typeof vers === "number" && d === undefined ? t0 + vers : a(vers);
    return doux(clamp((t - t0) / Math.max(1e-3, t1 - t0)));
  };
  return { t, f, fps, a, entre };
};

// ---------- Lumière : aube d'hiver bleue, sans électricité ----------
const Lumiere: React.FC<{ nuit: number }> = ({ nuit }) => (
  <>
    <Environnement intensite={0.14} />
    <hemisphereLight args={["#5b74b8", "#1a140f", lerp(0.55, 0.3, nuit)]} />
    <directionalLight
      position={[-6, 10, -9]}
      intensity={lerp(0.85, 0.45, nuit)}
      color="#9ab4ff"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-9}
      shadow-camera-right={9}
      shadow-camera-top={8}
      shadow-camera-bottom={-8}
      shadow-radius={4}
      shadow-bias={-0.0006}
    />
    {/* contre-jour froid côté caméra : détache les volumes */}
    <directionalLight position={[7, 6, 8]} intensity={lerp(0.32, 0.16, nuit)} color="#a9bde8" />
  </>
);

// Lanterne de camping à piles (lumière douce, portée limitée à sa pièce)
const Lanterne: React.FC<{ position: Vec3; allumee: number; portee?: number; puissance?: number }> = ({ position, allumee, portee = 3.2, puissance = 1 }) => (
  <group position={position}>
    <Arrondi taille={[0.1, 0.03, 0.1]} position={[0, 0.015, 0]} rayon={0.01} couleur="#2a2e33" />
    <mesh position={[0, 0.09, 0]}>
      <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
      <meshStandardMaterial color="#fff6e0" emissive="#ffd9a0" emissiveIntensity={0.9 * allumee} roughness={0.4} transparent opacity={0.9} />
    </mesh>
    <Arrondi taille={[0.1, 0.03, 0.1]} position={[0, 0.165, 0]} rayon={0.01} couleur="#2a2e33" />
    {allumee > 0.01 && <pointLight position={[0, 0.12, 0]} intensity={2.2 * puissance * allumee} color="#ffd6a0" distance={portee} decay={2} />}
  </group>
);

// ---------- L'immeuble en coupe sous l'appartement (5 étages, rez-de-chaussée, sous-sol) ----------
const Immeuble: React.FC<{ eau: number; pompe: number; loin: boolean }> = ({ eau, pompe, loin }) => {
  const beton = useMateriauPBR("concrete_wall_006", { repetition: [6, 2], teinte: "#8d8a86" });
  const x0 = -5.2;
  const x1 = 5.8;
  const L = x1 - x0;
  const cx = (x0 + x1) / 2;
  const niveaux = [1, 2, 3, 4, 5, 6];
  const [colX, colZ] = P.colonne;
  const hautEau = lerp(SOUS_SOL + 0.4, 1.15, eau);
  return (
    <group>
      {niveaux.map((k) => {
        const y = -k * ETAGE;
        const sousSol = k === 6;
        return (
          <group key={k}>
            {/* dalle */}
            <mesh position={[cx, y - 0.13, 0]} material={beton} receiveShadow>
              <boxGeometry args={[L + 0.24, 0.26, 3.44]} />
            </mesh>
            {/* mur du fond, avec fenêtres sombres (sauf au sous-sol) */}
            <mesh position={[cx, y + ETAGE / 2 - 0.13, -1.66]}>
              <boxGeometry args={[L + 0.24, ETAGE - 0.26, 0.12]} />
              <meshStandardMaterial color={sousSol ? "#4a4744" : "#5d5852"} roughness={0.95} />
            </mesh>
            {!sousSol &&
              [-3.4, 0.55, 3.0].map((x, i) => (
                <mesh key={i} position={[x, y + 1.55, -1.59]}>
                  <boxGeometry args={[1.0, 1.0, 0.02]} />
                  <meshStandardMaterial color="#141c2c" roughness={0.2} metalness={0.3} />
                </mesh>
              ))}
            {/* cloisons arasées (on devine les appartements du dessous) */}
            {!sousSol &&
              [-1.7, 1.7].map((x, i) => (
                <mesh key={`c${i}`} position={[x, y + 0.11, 0]}>
                  <boxGeometry args={[0.12, 0.22, 3.2]} />
                  <meshStandardMaterial color="#4b4743" roughness={1} />
                </mesh>
              ))}
            {/* pignons */}
            {[x0 - 0.06, x1 + 0.06].map((x, i) => (
              <mesh key={`p${i}`} position={[x, y + ETAGE / 2 - 0.13, 0]} material={beton}>
                <boxGeometry args={[0.12, ETAGE - 0.26, 3.44]} />
              </mesh>
            ))}
          </group>
        );
      })}
      {/* pignons de l'étage d'Inès + dalle du dessus vus de loin (le 7e étage) */}
      {loin && (
        <group>
          {[0, 1].map((k) => (
            <mesh key={k} position={[cx, ETAGE * (k + 1) - 0.13, 0]} material={beton}>
              <boxGeometry args={[L + 0.24, 0.26, 3.44]} />
            </mesh>
          ))}
          <mesh position={[cx, ETAGE * 1.5 - 0.13, -1.66]}>
            <boxGeometry args={[L + 0.24, ETAGE - 0.26, 0.12]} />
            <meshStandardMaterial color="#5d5852" roughness={0.95} />
          </mesh>
          {[x0 - 0.06, x1 + 0.06].map((x, i) => (
            <mesh key={i} position={[x, ETAGE * 1.0 - 0.13, 0]} material={beton}>
              <boxGeometry args={[0.12, ETAGE * 2, 3.44]} />
            </mesh>
          ))}
        </group>
      )}
      {/* colonne montante (tuyau) + l'eau qu'elle contient */}
      <mesh position={[colX, (SOUS_SOL + 1.2) / 2, colZ]}>
        <cylinderGeometry args={[0.055, 0.055, 1.2 - SOUS_SOL, 16, 1, true]} />
        <meshStandardMaterial color="#b9c3c9" metalness={0.3} roughness={0.35} transparent opacity={0.35} side={DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[colX, (SOUS_SOL + 0.4 + hautEau) / 2, colZ]}>
        <cylinderGeometry args={[0.042, 0.042, Math.max(0.01, hautEau - SOUS_SOL - 0.4), 12]} />
        <meshStandardMaterial color={EAU} emissive="#3d86d6" emissiveIntensity={0.9} roughness={0.2} />
      </mesh>
      {/* la pompe (surpresseur) au sous-sol */}
      <group position={[P.pompe[0], SOUS_SOL, P.pompe[2]]}>
        <Arrondi taille={[1.3, 0.12, 0.7]} position={[0, 0.06, 0]} rayon={0.02} couleur="#3d3f42" />
        {/* réservoir */}
        <mesh position={[-0.32, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.85, 24]} />
          <meshStandardMaterial color="#2d5d9a" roughness={0.45} metalness={0.2} />
        </mesh>
        {/* moteur */}
        <mesh position={[0.3, 0.32, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.4, 20]} />
          <meshStandardMaterial color="#5a6066" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* ventilateur qui ralentit puis s'arrête */}
        <mesh position={[0.52, 0.32, 0]} rotation={[pompe * 40, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 6]} />
          <meshStandardMaterial color="#2a2d30" roughness={0.6} />
        </mesh>
        {/* coffret électrique et son voyant (vert = marche, rouge = arrêt) */}
        <Arrondi taille={[0.34, 0.42, 0.14]} position={[0.3, 1.25, -0.25]} rayon={0.02} couleur="#c9c6be" />
        <mesh position={[0.3, 1.33, -0.17]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color={pompe > 0 ? "#3dff6a" : "#ff2a1e"} toneMapped={false} />
        </mesh>
        <pointLight position={[0.3, 1.33, 0.0]} intensity={0.6} distance={1.6} color={pompe > 0 ? "#3dff6a" : "#ff2a1e"} />
        {/* raccord vers la colonne */}
        <mesh position={[0.3, 0.75, -0.25]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.6, 10]} />
          <meshStandardMaterial color="#b9c3c9" metalness={0.5} roughness={0.35} />
        </mesh>
        {/* éclairage de service du sous-sol (lisibilité) */}
        <pointLight position={[0.8, 2.2, 1.6]} intensity={2.4} distance={6} color="#b9c8ff" />
      </group>
    </group>
  );
};

// ---------- Cuisine : bec du robinet + eau qui tousse ----------
const RobinetCuisine: React.FC<{ t: number; fin: number }> = ({ t, fin }) => {
  const [x, y, z] = P.robinetCuisine;
  // filet d'eau : continu au début, puis par à-coups, puis plus rien (« crache de l'air »)
  const phase = t / Math.max(0.1, fin);
  const acoup = bruit("robinet", t * 9) > (phase < 0.35 ? -1 : phase < 0.75 ? 0.15 : 0.7) ? 1 : 0;
  const filet = phase < 1 ? acoup * (1 - 0.6 * phase) : 0;
  const longueur = y - 0.9;
  return (
    <group>
      <mesh position={[x, y + 0.02, (z + -1.48) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.13, 10]} />
        <meshStandardMaterial color="#c9ced2" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[x, y + 0.005, z]}>
        <cylinderGeometry args={[0.016, 0.013, 0.03, 10]} />
        <meshStandardMaterial color="#c9ced2" metalness={0.9} roughness={0.2} />
      </mesh>
      {filet > 0.02 && (
        <mesh position={[x, y - longueur / 2, z]}>
          <cylinderGeometry args={[0.005 * filet + 0.002, 0.007 * filet + 0.002, longueur, 8]} />
          <meshStandardMaterial color={EAU} transparent opacity={0.75} roughness={0.05} emissive="#4f8fd0" emissiveIntensity={0.25} />
        </mesh>
      )}
      {/* gouttelettes projetées par l'air */}
      {phase > 0.3 &&
        phase < 1.1 &&
        [0, 1, 2, 3].map((i) => {
          const c = ((t * 2.2 + i * 0.27) % 1) as number;
          return (
            <mesh key={i} position={[x + 0.03 * Math.sin(i * 2.1), y - c * 0.22, z + 0.02 * Math.cos(i * 1.3)]}>
              <sphereGeometry args={[0.006, 6, 6]} />
              <meshStandardMaterial color={EAU} transparent opacity={0.8 * (1 - c)} />
            </mesh>
          );
        })}
    </group>
  );
};

const Boite: React.FC<{ position: Vec3; couleur: string; etiquette?: string; echelle?: number; ouverte?: number; liquide?: string }> = ({
  position,
  couleur,
  etiquette = "#e9e2d0",
  echelle = 1,
  ouverte = 0,
  liquide = "#f0a840",
}) => (
  <group position={position} scale={echelle}>
    <mesh position={[0, 0.055, 0]} castShadow>
      <cylinderGeometry args={[0.04, 0.04, 0.11, 20]} />
      <meshStandardMaterial color="#b8bcc0" metalness={0.8} roughness={0.3} />
    </mesh>
    <mesh position={[0, 0.055, 0]}>
      <cylinderGeometry args={[0.0405, 0.0405, 0.075, 20, 1, true]} />
      <meshStandardMaterial color={couleur} roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.06, 0.0]}>
      <cylinderGeometry args={[0.041, 0.041, 0.025, 20, 1, true, -0.7, 1.4]} />
      <meshStandardMaterial color={etiquette} roughness={0.7} />
    </mesh>
    {/* couvercle qui s'ouvre, sirop visible */}
    <group position={[0.04, 0.11, 0]} rotation={[0, 0, -2.2 * ouverte]}>
      <mesh position={[-0.04, 0.002, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.004, 20]} />
        <meshStandardMaterial color="#d4d8dc" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
    {ouverte > 0 && (
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.037, 20]} />
        <meshStandardMaterial color={liquide} emissive={liquide} emissiveIntensity={0.25} roughness={0.1} />
      </mesh>
    )}
  </group>
);

// ---------- Salle d'eau ----------
const WC: React.FC<{ eauCuvette: number; tourbillon: number; t: number }> = ({ eauCuvette, tourbillon, t }) => (
  <group position={[P.wc[0], 0, P.wc[2]]}>
    {/* pied + cuvette */}
    <mesh position={[0, 0.17, 0.05]} castShadow>
      <cylinderGeometry args={[0.13, 0.11, 0.34, 24]} />
      <meshStandardMaterial color="#f2f1ec" roughness={0.25} />
    </mesh>
    <mesh position={[0, 0.37, 0.08]} scale={[1, 0.55, 1.25]} castShadow>
      <sphereGeometry args={[0.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#f2f1ec" roughness={0.25} side={DoubleSide} />
    </mesh>
    {/* lunette */}
    <mesh position={[0, 0.42, 0.08]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1.25, 1]}>
      <torusGeometry args={[0.16, 0.025, 10, 32]} />
      <meshStandardMaterial color="#e9e6dd" roughness={0.35} />
    </mesh>
    {/* eau de la cuvette (niveau qui baisse quand on « tire la chasse » au seau) */}
    <mesh position={[0, 0.3 + 0.06 * eauCuvette, 0.08]} rotation={[-Math.PI / 2, tourbillon * t * 6, 0]} scale={[1, 1.2, 1]}>
      <circleGeometry args={[0.1 + 0.03 * eauCuvette, 24]} />
      <meshStandardMaterial color="#9ec6e0" roughness={0.05} metalness={0.1} transparent opacity={0.85} />
    </mesh>
    {/* réservoir de chasse contre le mur */}
    <Arrondi taille={[0.42, 0.4, 0.18]} position={[0, 0.75, -0.16]} rayon={0.03} couleur="#f2f1ec" rugosite={0.25} />
    <Arrondi taille={[0.1, 0.02, 0.05]} position={[0, 0.965, -0.16]} rayon={0.008} couleur="#c9ced2" metal={0.8} rugosite={0.3} />
  </group>
);

const Lavabo: React.FC<{ robinet: number }> = ({ robinet }) => (
  <group position={[P.lavabo[0], 0, P.lavabo[2]]}>
    <mesh position={[0, 0.4, 0.02]} castShadow>
      <cylinderGeometry args={[0.07, 0.1, 0.8, 18]} />
      <meshStandardMaterial color="#f2f1ec" roughness={0.25} />
    </mesh>
    <Arrondi taille={[0.55, 0.14, 0.42]} position={[0, 0.83, 0.08]} rayon={0.06} couleur="#f2f1ec" rugosite={0.2} />
    {/* mitigeur : poignée rouge (eau chaude) qui pivote */}
    <mesh position={[0, 0.94, -0.06]}>
      <cylinderGeometry args={[0.022, 0.026, 0.1, 12]} />
      <meshStandardMaterial color="#c9ced2" metalness={0.9} roughness={0.2} />
    </mesh>
    <mesh position={[0, 0.975, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.012, 0.012, 0.12, 10]} />
      <meshStandardMaterial color="#c9ced2" metalness={0.9} roughness={0.2} />
    </mesh>
    <group position={[0, 1.0, -0.06]} rotation={[0, -1.2 * robinet, 0]}>
      <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2 - 0.4, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.012, 0.11, 8]} />
        <meshStandardMaterial color="#c9ced2" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.02, 0.1]}>
        <sphereGeometry args={[0.018, 10, 10]} />
        <meshStandardMaterial color="#d8402e" roughness={0.4} />
      </mesh>
    </group>
    {/* miroir */}
    <Arrondi taille={[0.5, 0.6, 0.02]} position={[0, 1.6, -0.17]} rayon={0.01} couleur="#8fa3b3" metal={0.9} rugosite={0.08} />
  </group>
);

const TableauElectrique: React.FC<{ coupe: number }> = ({ coupe }) => {
  const [x, y, z] = P.tableau;
  return (
    <group position={[x, y, z + 0.02]}>
      <Arrondi taille={[0.34, 0.3, 0.07]} rayon={0.015} couleur="#e7e4dc" rugosite={0.5} />
      {[-0.12, -0.072, -0.024, 0.024, 0.072, 0.12].map((dx, i) => {
        const chauffeEau = i === 4;
        const bas = chauffeEau ? coupe : 0;
        return (
          <group key={i} position={[dx, 0.02, 0.04]}>
            <Arrondi taille={[0.04, 0.12, 0.02]} rayon={0.004} couleur={chauffeEau ? "#f0a020" : "#f6f5f1"} rugosite={0.5} />
            <mesh position={[0, 0.025 - 0.05 * bas, 0.018]}>
              <boxGeometry args={[0.018, 0.03, 0.02]} />
              <meshStandardMaterial color="#1e2023" roughness={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Placard + ballon + vanne d'arrivée + robinet de vidange + seau
const PlacardBallon: React.FC<{ porte: number; vanne: number; vidange: number; jet: number; seau: number; t: number }> = ({ porte, vanne, vidange, jet, seau, t }) => {
  const bois = useMateriauPBR("laminate_floor_02", { repetition: [0.8, 1.6], teinte: "#d9d2c4", gain: 1.1 });
  const [px, , pz] = P.placard;
  const l = 0.85;
  const h = 2.1;
  const p = 0.55;
  const [vx, vy, vz] = P.vidange;
  const [sx, , sz] = P.seau;
  return (
    <group>
      <group position={[px, 0, pz]}>
        {/* caisson : côtés, dessus, fond */}
        {[-1, 1].map((k) => (
          <Arrondi key={k} taille={[0.03, h, p]} position={[k * (l / 2 - 0.015), h / 2, 0]} rayon={0.008} materiau={bois} />
        ))}
        <Arrondi taille={[l, 0.03, p]} position={[0, h - 0.015, 0]} rayon={0.008} materiau={bois} />
        {/* porte, charnière à l'est, s'ouvre vers le sud-est (elle ne masque jamais le lavabo) */}
        <group position={[l / 2, 0, p / 2]} rotation={[0, 1.9 * porte, 0]}>
          <Arrondi taille={[l - 0.01, h - 0.04, 0.025]} position={[-l / 2, h / 2, 0.012]} rayon={0.008} materiau={bois} />
          <Arrondi taille={[0.02, 0.16, 0.03]} position={[-(l - 0.08), 1.05, 0.04]} rayon={0.006} couleur="#9a9c9e" metal={0.8} rugosite={0.3} />
        </group>
      </group>
      {/* ballon électrique de 200 L */}
      <group position={[P.ballon[0], 0, P.ballon[2]]}>
        <mesh position={[0, 1.12, 0]} castShadow>
          <cylinderGeometry args={[0.27, 0.27, 1.3, 32]} />
          <meshStandardMaterial color="#f1f1ec" roughness={0.35} />
        </mesh>
        {[0.47, 1.77].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} scale={[1, 0.25, 1]}>
            <sphereGeometry args={[0.27, 24, 12]} />
            <meshStandardMaterial color="#f1f1ec" roughness={0.35} />
          </mesh>
        ))}
        {/* plaque signalétique */}
        <Arrondi taille={[0.16, 0.1, 0.01]} position={[0, 1.3, 0.268]} rayon={0.004} couleur="#2b6bb5" rugosite={0.5} />
        {/* tuyaux : eau froide (bleu) et eau chaude (rouge) qui descendent */}
        {[
          [-0.12, "#3f7fd0"],
          [0.12, "#c84b3a"],
        ].map(([dx, c], i) => (
          <mesh key={i} position={[dx as number, 0.28, 0.12]}>
            <cylinderGeometry args={[0.015, 0.015, 0.36, 8]} />
            <meshStandardMaterial color={c as string} roughness={0.4} metalness={0.3} />
          </mesh>
        ))}
      </group>
      {/* vanne d'arrivée d'eau froide (manette bleue qui pivote d'un quart de tour) */}
      <group position={P.vanne}>
        <mesh>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#c49a3c" metalness={0.8} roughness={0.3} />
        </mesh>
        <group rotation={[0, 0, (Math.PI / 2) * vanne]}>
          <Arrondi taille={[0.12, 0.022, 0.02]} position={[0.05, 0, 0.03]} rayon={0.006} couleur="#2f6fd6" rugosite={0.5} />
        </group>
      </group>
      {/* robinet de vidange (laiton) */}
      <group position={[vx, vy, vz]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.1, 10]} />
          <meshStandardMaterial color="#c49a3c" metalness={0.8} roughness={0.3} />
        </mesh>
        <group position={[0, 0.025, 0.02]} rotation={[0, (Math.PI / 2) * vidange, 0]}>
          <Arrondi taille={[0.07, 0.012, 0.014]} position={[0.03, 0, 0]} rayon={0.004} couleur="#c13a2a" rugosite={0.5} />
        </group>
      </group>
      {/* jet de la vidange vers le seau */}
      {jet > 0.02 && (
        <mesh position={[vx, (vy + 0.28) / 2 - 0.01, vz + 0.06 + 0.05 * jet]} rotation={[0.25, 0, 0]}>
          <cylinderGeometry args={[0.009 * jet + 0.003, 0.012 * jet + 0.003, vy - 0.27, 8]} />
          <meshStandardMaterial color={EAU} transparent opacity={0.8} emissive="#4f8fd0" emissiveIntensity={0.3} />
        </mesh>
      )}
      {/* seau */}
      <group position={[sx, 0, sz]}>
        <mesh position={[0, 0.14, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.12, 0.28, 24, 1, true]} />
          <meshStandardMaterial color="#3a4f63" roughness={0.6} side={DoubleSide} />
        </mesh>
        <mesh position={[0, 0.005, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.01, 24]} />
          <meshStandardMaterial color="#3a4f63" roughness={0.6} />
        </mesh>
        {seau > 0.01 && (
          <mesh position={[0, 0.01 + 0.24 * seau, 0]} rotation={[-Math.PI / 2, 0, t * 0.5]}>
            <circleGeometry args={[0.12 + 0.028 * seau, 24]} />
            <meshStandardMaterial color={EAU} roughness={0.05} transparent opacity={0.85} />
          </mesh>
        )}
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.15, 0.006, 6, 24, Math.PI]} />
          <meshStandardMaterial color="#888" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

// Carafe + filtre à café (on filtre les dépôts)
const Carafe: React.FC<{ niveau: number; goutte: number; t: number }> = ({ niveau, goutte, t }) => (
  <group position={P.carafe}>
    <mesh position={[0, 0.13, 0]}>
      <cylinderGeometry args={[0.075, 0.085, 0.26, 24, 1, true]} />
      <meshStandardMaterial color="#cfe3f0" transparent opacity={0.3} roughness={0.05} side={DoubleSide} depthWrite={false} />
    </mesh>
    {niveau > 0.01 && (
      <mesh position={[0, 0.01 + 0.1 * niveau, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.2 * niveau, 24]} />
        <meshStandardMaterial color={EAU} transparent opacity={0.7} roughness={0.05} />
      </mesh>
    )}
    {/* filtre en papier (cône) dans son porte-filtre */}
    <mesh position={[0, 0.33, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[0.09, 0.14, 24, 1, true]} />
      <meshStandardMaterial color="#f4eee2" roughness={0.9} side={DoubleSide} />
    </mesh>
    <mesh position={[0, 0.4, 0]}>
      <torusGeometry args={[0.09, 0.008, 6, 24]} />
      <meshStandardMaterial color="#3a3a3a" roughness={0.5} />
    </mesh>
    {goutte > 0 &&
      [0, 1].map((i) => {
        const c = (t * 1.8 + i * 0.5) % 1;
        return (
          <mesh key={i} position={[0, 0.26 - c * 0.2, 0]}>
            <sphereGeometry args={[0.008, 6, 6]} />
            <meshStandardMaterial color={EAU} transparent opacity={0.8} />
          </mesh>
        );
      })}
  </group>
);

// Bassine (eau de toilette d'Inès) : posée, portée, puis versée dans la cuvette
const Bassine: React.FC<{ position: Vec3; inclinaison: number; niveau: number; orientation: number }> = ({ position, inclinaison, niveau, orientation }) => (
  <group position={position} rotation={[0, (orientation * Math.PI) / 180, 0]}>
    <group rotation={[inclinaison * 1.1, 0, 0]}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.16, 0.12, 28, 1, true]} />
        <meshStandardMaterial color="#6fb2c8" roughness={0.5} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0.003, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.006, 28]} />
        <meshStandardMaterial color="#6fb2c8" roughness={0.5} />
      </mesh>
      {niveau > 0.02 && (
        <mesh position={[0, 0.01 + 0.08 * niveau, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.165 + 0.045 * niveau, 28]} />
          <meshStandardMaterial color="#9fb7bf" roughness={0.1} transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  </group>
);

// ---------- Porte d'entrée (charnière à l'ouest, s'ouvre vers l'intérieur) + verrou ----------
const PorteEntree: React.FC<{ ouverture: number; verrou: number; cle: number }> = ({ ouverture, verrou, cle }) => {
  const largeur = 0.9;
  const [x, , z] = P.porte;
  const [vx, vy] = P.verrou;
  return (
    <group position={[x - largeur / 2, 0, z + 0.02]} rotation={[0, -1.75 * ouverture, 0]}>
      <Arrondi taille={[largeur, 2.03, 0.05]} position={[largeur / 2, 1.015, 0]} rayon={0.01} couleur="#5b3b2a" rugosite={0.6} />
      {/* moulures */}
      {[0.55, 1.45].map((y, i) => (
        <Arrondi key={i} taille={[largeur - 0.22, 0.7, 0.012]} position={[largeur / 2, y, 0.03]} rayon={0.01} couleur="#6a4632" rugosite={0.6} />
      ))}
      {/* poignée */}
      <Arrondi taille={[0.14, 0.022, 0.03]} position={[largeur - 0.15, 0.98, 0.05]} rayon={0.008} couleur="#c8b27a" metal={0.85} rugosite={0.25} />
      {/* verrou intérieur : bouton qui tourne d'un quart de tour, puis la clé dans la serrure */}
      <group position={[vx - (x - largeur / 2), vy, 0.04]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.012, 20]} />
          <meshStandardMaterial color="#c8b27a" metalness={0.85} roughness={0.25} />
        </mesh>
        <group rotation={[0, 0, (Math.PI / 2) * verrou]}>
          <Arrondi taille={[0.012, 0.05, 0.02]} position={[0, 0, 0.012]} rayon={0.004} couleur="#a8935e" metal={0.85} rugosite={0.25} />
        </group>
        {cle > 0 && (
          <group position={[0, -0.09, 0.01]} rotation={[0, 0, 0.12 * Math.sin(cle * 9) * (1 - Math.min(1, cle))]}>
            <Arrondi taille={[0.012, 0.04, 0.008]} position={[0, 0, 0.012]} rayon={0.003} couleur="#d9c27a" metal={0.9} rugosite={0.2} />
            <mesh position={[0, -0.035, 0.014]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.022, 0.005, 8, 20]} />
              <meshStandardMaterial color="#d9c27a" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.075, 0.014]} rotation={[Math.PI / 2, 0, 0.6]}>
              <torusGeometry args={[0.018, 0.004, 8, 20]} />
              <meshStandardMaterial color="#b9b9b9" metalness={0.9} roughness={0.25} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// ---------- Bouteille du fantôme : l'eau brune du radiateur ----------
const BouteilleBrune: React.FC<{ niveau: number; echelle: number }> = ({ niveau, echelle }) =>
  echelle <= 0.01 ? null : (
    <group position={[-2.95, 0, -1.3]} scale={echelle}>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 18, 1, true]} />
        <meshStandardMaterial color="#d6e6f0" transparent opacity={0.3} roughness={0.05} side={DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.018, 0.045, 0.06, 12]} />
        <meshStandardMaterial color="#d6e6f0" transparent opacity={0.35} roughness={0.05} />
      </mesh>
      {niveau > 0.01 && (
        <mesh position={[0, 0.01 + 0.14 * niveau, 0]}>
          <cylinderGeometry args={[0.046, 0.046, 0.28 * niveau, 18]} />
          <meshStandardMaterial color="#5a3315" roughness={0.3} emissive="#2a1206" emissiveIntensity={0.3} />
        </mesh>
      )}
      {/* filet brun qui tombe de la purge */}
      {niveau > 0.01 && niveau < 0.98 && (
        <mesh position={[-0.03, 0.47, -0.08]}>
          <cylinderGeometry args={[0.004, 0.005, 0.26, 6]} />
          <meshStandardMaterial color="#5a3315" />
        </mesh>
      )}
    </group>
  );

// ---------- La scène ----------
const Scene: React.FC<{ al: Alignement }> = ({ al }) => {
  const { t, fps, f, a, entre } = useTemps(al);
  const ines = useMemo(() => resoudrePersonnage(donnees.personnages[0], al, fps), [al, fps]);
  const e = etatPersonnage(ines, f, fps);

  // Récap : la pompe s'arrête, la colonne se vide
  const pompe = 1 - entre("recap2:arrete", 0.6);
  const eau = 1 - entre("recap3", "recap3.fin");
  const loin = t > a("recap1") - 0.2 && t < a("recap2") + 0.5;

  // Tactique 1 : conserves sur la table, boîte de pêches ouverte, fantômes chips + saucisson
  const pop = (x: Ancre) => {
    const k = clamp((t - a(x)) / 0.22);
    return k <= 0 ? 0 : 1 + 0.25 * Math.sin(k * Math.PI) * (1 - k);
  };
  const ouverte = entre("t1b", 0.5);
  const fantomeT1 = Math.min(entre("t1c:chips-0.1", 0.25), 1 - entre("t1d.fin", 0.3));
  const glisse = entre("t1d", "t1d.fin");

  // Tactique 2 : chasse fantôme, bassine
  const fantomeChasse = Math.min(entre("t2a:chasse", 0.25), 1 - entre("t2b:coup", 0.3));
  const porte = (t > a("t2d") - 0.1 && t < a("t2e.fin") + 0.3) || (t >= a("t2d:cuvette") && t < a("t2e.fin") + 0.3);
  const verse = entre("t2e", "t2e:coup.fin");
  const niveauBassine = 1 - entre("t2e:coup", "t2e:vide");
  const depose = entre("t2e.fin", 0.4);
  let bassinePos: Vec3 = [2.62, 0, -0.35];
  let bassineOrient = 0;
  if (porte || depose > 0) {
    // Portée dans les mains d'Inès (devant elle, à hauteur des mains), puis reposée au sol près des WC
    const o = (e.orientation * Math.PI) / 180;
    const mains: Vec3 = [e.position[0] + Math.sin(o) * 0.36, 0.78 - 0.12 * verse, e.position[2] + Math.cos(o) * 0.36];
    const soulever = entre("t2d", "t2d:sale");
    const tenue: Vec3 = [lerp(2.62, mains[0], soulever), lerp(0, mains[1], soulever), lerp(-0.35, mains[2], soulever)];
    bassinePos = depose > 0 ? [lerp(tenue[0], 2.55, depose), lerp(tenue[1], 0, depose), lerp(tenue[2], -1.05, depose)] : tenue;
    bassineOrient = e.orientation;
  }
  const vidangeCuvette = entre("t2e:coup", "t2e:vide");
  const eauCuvette = 1 - 0.7 * vidangeCuvette + 0.7 * entre("t2e:vide", 0.8);

  // Tactique 3 : placard, disjoncteur, vanne, robinet d'eau chaude, vidange, seau, carafe
  const portePlacard = entre("t3", "t3:ballon");
  const coupe = entre("t3b:coupe", 0.25);
  const vanne = entre("t3c:ferme", 0.4);
  const robinetChaud = entre("t3d:ouvre", 0.4) * (1 - entre("t3f", 0.4));
  const vidange = entre("t3e:vide", 0.3) * (1 - entre("erreur", 0.3)) + entre("ouvre:bas", 0.35) * (1 - entre("chute", 0.3));
  const jet = t > a("t3e:vide") + 0.2 && t < a("t3f.fin") ? 1 - 0.3 * Math.max(0, bruit("jet", t * 3)) : 0;
  const seau = clamp((t - a("t3e:vide") - 0.2) / 3.2) * (t < a("calme") ? 1 : 0);
  const carafe = clamp((t - a("t3f:filtre")) / 2.2) * 0.6 * (t < a("calme") ? 1 : 0);
  const goutte = t > a("t3f:filtre") && t < a("t3f.fin") + 0.5 ? 1 : 0;
  // Twist : on tape sur le ballon (léger tremblement)
  const tape = Math.max(0, 1 - Math.abs(t - a("chute:vide")) / 0.25);

  // Erreur : bouteille brune sous la purge du radiateur
  const niveauBrun = entre("erreur3", "erreur3.fin");
  const bouteille = Math.min(entre("erreur", 0.3), 1 - entre("erreur4:potable", 0.35));

  // Porte d'entrée : elle sort (garde), le verrou tourne, la nuit passe, elle rentre (retour)
  const ouvre1 = entre("garde-0.3", "garde:part");
  const ferme1 = entre("garde:douze+0.1", "garde:heures+0.15");
  const ouvre2 = entre("retour:matin", "retour:matin+0.4");
  const ferme2 = entre("chute", 0.4);
  const ouverture = t < a("retour:matin") ? ouvre1 * (1 - ferme1) : ouvre2 * (1 - ferme2);
  const verrou = t < a("retour:matin") ? entre("garde:heures+0.2", 0.25) : 1 - entre("retour:matin-0.25", 0.2);
  const cle = t > a("chute") + 0.4 ? t - a("chute") - 0.4 + 0.001 : 0;

  // Nuit : bougies éteintes au retour (6 h), seule la lampe d'Inès éclaire
  const nuit = t >= a("retour") ? 1 : 0;
  const lanternes = 1 - nuit;

  return (
    <>
      <Lumiere nuit={nuit} />
      <Immeuble eau={eau} pompe={pompe} loin={loin} />

      {/* ---- cuisine ---- */}
      <RobinetCuisine t={t} fin={a("hook.fin")} />
      <Bougie position={[0.08, 0.76, 0.66]} allumee={!nuit} graine="bougieCuisine" puissance={0.9} />
      {/* conserves de l'étagère */}
      {[
        [-1.42, 0.465, -1.4, "#c0392b"],
        [-1.32, 0.465, -1.4, "#d68a1a"],
        [-1.22, 0.465, -1.4, "#3f7a3a"],
        [-0.98, 0.915, -1.4, "#d68a1a"],
        [-0.88, 0.915, -1.4, "#c0392b"],
      ].map(([x, y, z, c], i) => (
        <Boite key={i} position={[x as number, y as number, z as number]} couleur={c as string} />
      ))}
      {/* les 3 conserves posées sur la table, une par mot */}
      <Boite position={[-0.12, 0.76, 0.33]} couleur="#e2902a" echelle={pop("t1a:peches")} ouverte={ouverte} />
      <Boite position={[-0.33, 0.76, 0.27]} couleur="#e8c440" echelle={pop("t1a:ananas")} />
      <Boite position={[-0.55, 0.76, 0.33]} couleur="#3f7a3a" echelle={pop("t1a:haricots")} />
      {/* fantômes : chips et saucisson, puis poussés hors de la table */}
      <Fantome opacite={fantomeT1}>
        <group position={[0.05 + 0.4 * glisse, 0.76, 0.2]} rotation={[0, 0.4, 0.15]}>
          <Arrondi taille={[0.2, 0.26, 0.07]} position={[0, 0.13, 0]} rayon={0.03} />
        </group>
        <group position={[-0.78 - 0.4 * glisse, 0.79, 0.18]} rotation={[0, 0.5, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, 0.28, 14]} />
            <meshBasicMaterial />
          </mesh>
        </group>
      </Fantome>

      {/* ---- salle d'eau ---- */}
      <WC eauCuvette={eauCuvette} tourbillon={vidangeCuvette} t={t} />
      <Fantome opacite={fantomeChasse}>
        {/* la chasse tirée : 9 litres qui tourbillonnent et partent */}
        <group position={[P.wc[0], 0.33, P.wc[2] + 0.08]} rotation={[0, t * 8, 0]}>
          <mesh>
            <torusGeometry args={[0.13, 0.03, 8, 24]} />
            <meshBasicMaterial />
          </mesh>
          <mesh position={[0, 0.25, -0.24]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 10]} />
            <meshBasicMaterial />
          </mesh>
        </group>
      </Fantome>
      <Lavabo robinet={robinetChaud} />
      <TableauElectrique coupe={coupe} />
      <group position={[0, Math.sin(t * 60) * 0.004 * tape, 0]}>
        <PlacardBallon porte={portePlacard} vanne={vanne} vidange={vidange} jet={jet} seau={seau} t={t} />
      </group>
      <Carafe niveau={carafe} goutte={goutte} t={t} />
      <Bassine position={bassinePos} orientation={bassineOrient} inclinaison={verse * (1 - depose)} niveau={niveauBassine} />
      <Lanterne position={[2.15, 0.975, -1.47]} allumee={lanternes} portee={3.0} puissance={0.5} />

      {/* ---- salon ---- */}
      <CanapeTissu position={[-4.6, 0, 0.55]} rotation={90} couleur="#6d4a3e" />
      <TapisEpais position={[-3.3, 0, 0.25]} largeur={2.0} profondeur={1.4} couleur="#7a3d32" />
      <Bibliotheque position={[-4.55, 0, -1.42]} />
      <Plante position={[-2.15, 0, -1.3]} />
      <Cadre position={[-4.3, 1.55, -1.53]} largeur={0.5} hauteur={0.38} />
      {/* purge du radiateur (petite clé en laiton) */}
      <mesh position={P.purge} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.06, 8]} />
        <meshStandardMaterial color="#c49a3c" metalness={0.8} roughness={0.3} />
      </mesh>
      <BouteilleBrune niveau={niveauBrun} echelle={bouteille} />
      <Lanterne position={[-2.45, 0, 0.9]} allumee={lanternes * 0.8} portee={3.6} />

      {/* ---- entrée ---- */}
      <PorteEntree ouverture={ouverture} verrou={verrou} cle={cle} />
      <Arrondi taille={[0.5, 0.04, 0.25]} position={[5.38, 0.9, -1.4]} rayon={0.01} couleur="#6b4c33" />
      <Bougie position={[5.5, 0.92, -1.4]} allumee={!nuit} graine="bougieEntree" puissance={0.8} />
      {/* patère et manteau */}
      <Arrondi taille={[0.04, 0.04, 0.1]} position={[4.4, 1.65, -1.48]} rayon={0.01} couleur="#2a2a2a" />
      <Arrondi taille={[0.34, 0.85, 0.14]} position={[4.4, 1.2, -1.42]} rayon={0.06} couleur={t < a("garde") ? "#2f6f73" : "#5a5a5a"} />
      {/* lumière de la lampe d'Inès sur les murs (la torche est portée par le personnage) */}
      {e.lampe && <pointLight position={[e.position[0], 1.2, e.position[2]]} intensity={0.5} distance={2.5} color="#fff1d8" />}
    </>
  );
};

export const Episode: React.FC<PropsEpisode> = (props) => (
  <EpisodeStandard {...props} donnees={donnees} eclairage={<></>} scene={<Scene al={props.alignement} />} />
);
