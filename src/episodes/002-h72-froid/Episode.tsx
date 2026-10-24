import React, { useMemo } from "react";
import { AdditiveBlending, DoubleSide } from "three";
import { EpisodeStandard, PropsEpisode } from "../../systeme/EpisodeStandard";
import { Arrondi } from "../../systeme/kit3d/Arrondi";
import { Fantome } from "../../systeme/kit3d/Fantome";
import { Bougie } from "../../systeme/kit3d/Lumieres";
import { Bibliotheque, Cadre, CanapeTissu, Plante, Rideau, TapisEpais } from "../../systeme/kit3d/Mobilier";
import { bruit, clamp, lerp, Vec3 } from "../../systeme/maths";
import { Alignement } from "../../systeme/mots";
import { etatPersonnage, resoudrePersonnage } from "../../systeme/personnage/trajet";
import { Immeuble, Lavabo, Lumiere, PlacardBallon, PorteEntree, RobinetCuisine, TableauElectrique, useTemps, WC } from "../001-h72/Episode";
import { donnees, OX, P } from "./donnees";

/*
 * Éléments 3D propres à H+72 partie 2 : la chambre d'Inès (lit, chevet, bougie, grilles d'aération, courants
 * d'air, serviette, couverture), le 5e de Morel (escalier, porte, tuyau, bidons, fauteuil, barbecue, fenêtre qui
 * s'ouvre, voile du monoxyde), la lampe torche en haut de l'escalier. Le 6e reprend les éléments de la partie 1.
 */
const o = (x: number, y: number, z: number): Vec3 => [OX + x, y, z];

// ---------- Chambre d'Inès ----------
const Lit: React.FC = () => {
  const [x, , z] = P.lit;
  return (
    <group position={[x, 0, z]}>
      {/* cadre en bois, tête de lit contre le mur nord */}
      <Arrondi taille={[1.2, 0.12, 1.64]} position={[0, 0.1, 0]} rayon={0.03} couleur="#6b4a32" rugosite={0.7} />
      {[-1, 1].flatMap((i) => [-1, 1].map((j) => <Arrondi key={`${i}${j}`} taille={[0.06, 0.12, 0.06]} position={[i * 0.55, 0.06, j * 0.76]} rayon={0.01} couleur="#5a3d28" />))}
      <Arrondi taille={[1.22, 0.65, 0.07]} position={[0, 0.33, -0.8]} rayon={0.03} couleur="#6b4a32" rugosite={0.7} />
      {/* matelas, drap, couette pliée, oreiller */}
      <Arrondi taille={[1.12, 0.1, 1.56]} position={[0, 0.2, 0.02]} rayon={0.04} couleur="#e9e4da" rugosite={0.95} />
      <Arrondi taille={[1.16, 0.06, 1.05]} position={[0, 0.26, 0.25]} rayon={0.03} couleur="#5d6f9a" rugosite={1} />
      <Arrondi taille={[1.16, 0.05, 0.28]} position={[0, 0.3, -0.18]} rayon={0.025} couleur="#e9e4da" rugosite={1} />
      <Arrondi taille={[0.5, 0.1, 0.3]} position={[-0.25, 0.3, -0.58]} rayon={0.05} couleur="#f1ece3" rugosite={1} />
      <Arrondi taille={[0.5, 0.1, 0.3]} position={[0.27, 0.3, -0.58]} rayon={0.05} couleur="#e6dccb" rugosite={1} />
      {/* plaid tricoté au pied du lit (côté tête : Inès s'assied au pied) */}
      <Arrondi taille={[1.18, 0.04, 0.3]} position={[0, 0.3, -0.35]} rayon={0.02} couleur="#a8592f" rugosite={1} />
    </group>
  );
};

const Chevet: React.FC<{ bougie: boolean }> = ({ bougie }) => {
  const [x, , z] = P.chevet;
  return (
    <group>
      <group position={[x, 0, z]}>
        <Arrondi taille={[0.42, 0.48, 0.36]} position={[0, 0.24, 0]} rayon={0.02} couleur="#8a6a4a" rugosite={0.7} />
        <Arrondi taille={[0.36, 0.14, 0.02]} position={[0, 0.32, 0.18]} rayon={0.01} couleur="#7a5c3e" />
        <Arrondi taille={[0.06, 0.015, 0.02]} position={[0, 0.32, 0.2]} rayon={0.005} couleur="#c8b27a" metal={0.8} rugosite={0.3} />
        {/* lampe de chevet (éteinte), livre, réveil */}
        <mesh position={[-0.12, 0.6, -0.05]}>
          <cylinderGeometry args={[0.07, 0.1, 0.13, 18, 1, true]} />
          <meshStandardMaterial color="#e8dcc4" roughness={0.9} side={DoubleSide} />
        </mesh>
        <mesh position={[-0.12, 0.51, -0.05]}>
          <cylinderGeometry args={[0.012, 0.03, 0.06, 10]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.5} />
        </mesh>
        <Arrondi taille={[0.15, 0.03, 0.2]} position={[0.1, 0.495, 0.05]} rayon={0.005} couleur="#2f4f6f" />
      </group>
      <Bougie position={P.bougieChevet} allumee={bougie} graine="bougieChevet" puissance={0.8} />
    </group>
  );
};

// Grille d'aération murale (lamelles)
const Grille: React.FC<{ position: Vec3; largeur?: number; hauteur?: number }> = ({ position, largeur = 0.22, hauteur = 0.14 }) => (
  <group position={position}>
    <Arrondi taille={[largeur, hauteur, 0.02]} rayon={0.006} couleur="#d8d4cc" rugosite={0.6} />
    {[-0.04, -0.013, 0.013, 0.04].map((y) => (
      <mesh key={y} position={[0, y * (hauteur / 0.14), 0.012]} rotation={[0.6, 0, 0]}>
        <boxGeometry args={[largeur - 0.03, 0.012, 0.004]} />
        <meshStandardMaterial color="#8a8780" roughness={0.6} />
      </mesh>
    ))}
  </group>
);

// Courants d'air : rubans bleus qui ondulent (sous la porte de la chambre, autour de la fenêtre)
const CourantAir: React.FC<{ depart: Vec3; direction: Vec3; t: number; force: number; graine: string }> = ({ depart, direction, t, force, graine }) => {
  if (force <= 0.01) return null;
  const n = 5;
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const u = ((t * 0.7 + i / n + bruit(graine, i) * 0.3) % 1 + 1) % 1;
        const p: Vec3 = [depart[0] + direction[0] * u, depart[1] + direction[1] * u + 0.03 * Math.sin(t * 5 + i), depart[2] + direction[2] * u + 0.05 * Math.sin(t * 3 + i * 2)];
        return (
          <mesh key={i} position={p} rotation={[0, Math.atan2(direction[0], direction[2]), 0]}>
            <boxGeometry args={[0.012, 0.012, 0.32]} />
            <meshBasicMaterial color="#8fd2ff" transparent opacity={0.55 * force * Math.sin(Math.PI * u)} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// Fumée grise qui monte (grille du sol, barbecue)
const Fumee: React.FC<{ base: Vec3; t: number; force: number; hauteur?: number; graine: string; couleur?: string }> = ({ base, t, force, hauteur = 0.8, graine, couleur = "#9a9590" }) => {
  if (force <= 0.01) return null;
  return (
    <group>
      {Array.from({ length: 9 }, (_, i) => {
        const u = ((t * 0.35 + i / 9) % 1 + 1) % 1;
        const r = 0.05 + 0.12 * u;
        return (
          <mesh key={i} position={[base[0] + 0.08 * Math.sin(t + i * 1.7) * u + bruit(graine, i) * 0.05, base[1] + u * hauteur, base[2] + 0.06 * Math.cos(t * 0.8 + i)]}>
            <sphereGeometry args={[r, 10, 8]} />
            <meshStandardMaterial color={couleur} transparent opacity={0.4 * force * Math.sin(Math.PI * u)} depthWrite={false} roughness={1} emissive={couleur} emissiveIntensity={0.15} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------- 5e : escalier, porte de Morel, tuyau, bidons, fauteuil, barbecue, fenêtre ----------
// 18 marches de 16 cm (jusqu'au 6e, 2,88 m), giron 19 cm, du palier (z = 0,4) vers la cage d'escalier (nord)
const Escalier: React.FC = () => {
  const marches = 18;
  return (
    <group>
      {Array.from({ length: marches }, (_, i) => {
        const y = 0.16 * (i + 1);
        const z = 0.4 - 0.19 * (i + 0.5);
        return <Arrondi key={i} taille={[0.95, y, 0.2]} position={[OX - 3.0, y / 2, z]} rayon={0.01} couleur={i % 2 ? "#6f6a62" : "#77726a"} rugosite={0.9} />;
      })}
      {/* rampe (main courante en bois sur barreaux) : elle suit la pente des marches, 0,9 m au-dessus */}
      <mesh position={[OX - 2.5, 1.44 + 0.9, 0.4 - 1.71]} rotation={[Math.atan2(2.88, 3.42), 0, 0]}>
        <boxGeometry args={[0.05, 0.05, Math.hypot(2.88, 3.42)]} />
        <meshStandardMaterial color="#5a3b26" roughness={0.6} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => {
        const z = 0.3 - i * 0.36;
        const y0 = Math.max(0, (0.4 - z) / 0.19) * 0.16;
        return (
          <mesh key={i} position={[OX - 2.5, y0 + 0.45, z]}>
            <boxGeometry args={[0.025, 0.9, 0.025]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
};

const PorteMorel: React.FC<{ ouverture: number }> = ({ ouverture }) => {
  const [x, , z] = P.porte5;
  const l = 0.9;
  return (
    // charnière au nord, s'ouvre vers l'entrée (est)
    <group position={[x + 0.02, 0, z - l / 2]} rotation={[0, -1.6 * ouverture, 0]}>
      <Arrondi taille={[0.05, 2.03, l]} position={[0, 1.015, l / 2]} rayon={0.01} couleur="#3f5b4a" rugosite={0.6} />
      {[0.55, 1.45].map((y) => (
        <Arrondi key={y} taille={[0.012, 0.7, l - 0.22]} position={[-0.03, y, l / 2]} rayon={0.01} couleur="#4a6a56" rugosite={0.6} />
      ))}
      <Arrondi taille={[0.03, 0.022, 0.14]} position={[-0.05, 0.98, l - 0.15]} rayon={0.008} couleur="#c8b27a" metal={0.85} rugosite={0.25} />
      {/* numéro de porte */}
      <Arrondi taille={[0.01, 0.08, 0.12]} position={[-0.035, 1.6, l / 2]} rayon={0.004} couleur="#c8b27a" metal={0.8} rugosite={0.3} />
    </group>
  );
};

const Tuyau: React.FC<{ goutte: number; t: number }> = ({ goutte, t }) => {
  const [x, , z] = P.tuyau;
  return (
    <group position={[x, 0, z]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.025 + i * 0.03, 0]} rotation={[Math.PI / 2, 0, i * 0.3]}>
          <torusGeometry args={[0.2 - i * 0.01, 0.018, 8, 30]} />
          <meshPhysicalMaterial color="#2f7a3a" roughness={0.25} clearcoat={0.8} clearcoatRoughness={0.1} />
        </mesh>
      ))}
      {/* bout du tuyau qui pend, et la goutte qui tombe */}
      <mesh position={[0.2, 0.08, 0.05]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 0.14, 10]} />
        <meshPhysicalMaterial color="#2f7a3a" roughness={0.25} clearcoat={0.8} />
      </mesh>
      {goutte > 0 && (
        <mesh position={[0.23, 0.02 + 0.1 * (1 - ((t * 1.6) % 1)), 0.05]}>
          <sphereGeometry args={[0.012, 10, 8]} />
          <meshStandardMaterial color="#bfe2ff" roughness={0.05} transparent opacity={0.85} emissive="#4f8fd0" emissiveIntensity={0.3} />
        </mesh>
      )}
      {/* flaque luisante */}
      <mesh position={[0.24, 0.003, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.09, 20]} />
        <meshStandardMaterial color="#3a4048" roughness={0.05} metalness={0.2} />
      </mesh>
    </group>
  );
};

const Bidon: React.FC<{ position: Vec3; graine: number }> = ({ position, graine }) => (
  <group position={position} rotation={[0, (bruit("bidon", graine) - 0.5) * 0.3, 0]}>
    <Arrondi taille={[0.3, 0.42, 0.17]} position={[0, 0.21, 0]} rayon={0.035} couleur="#dfe6ea" rugosite={0.35} />
    {/* eau visible à travers le plastique */}
    <Arrondi taille={[0.29, 0.36, 0.16]} position={[0, 0.19, 0]} rayon={0.03} couleur="#6fa8d8" rugosite={0.1} />
    <Arrondi taille={[0.1, 0.05, 0.05]} position={[0.08, 0.45, 0]} rayon={0.015} couleur="#2f5d8a" rugosite={0.5} />
    <Arrondi taille={[0.12, 0.04, 0.04]} position={[-0.06, 0.44, 0]} rayon={0.015} couleur="#cfd6da" rugosite={0.4} />
  </group>
);

const Fauteuil: React.FC = () => {
  const [x, , z] = P.fauteuil;
  return (
    <group position={[x, 0, z]} rotation={[0, Math.PI / 2 - 0.15, 0]}>
      <Arrondi taille={[0.78, 0.18, 0.75]} position={[0, 0.13, 0]} rayon={0.07} couleur="#5a6b3e" rugosite={1} />
      <Arrondi taille={[0.78, 0.62, 0.18]} position={[0, 0.4, -0.3]} rayon={0.08} couleur="#5a6b3e" rugosite={1} />
      {[-1, 1].map((k) => (
        <Arrondi key={k} taille={[0.16, 0.3, 0.72]} position={[k * 0.33, 0.3, 0]} rayon={0.07} couleur="#4f5e36" rugosite={1} />
      ))}
      {/* coussin brodé */}
      <Arrondi taille={[0.3, 0.24, 0.1]} position={[0.12, 0.38, -0.18]} rayon={0.05} couleur="#c9a96e" rugosite={1} />
      {[-1, 1].flatMap((i) => [-1, 1].map((j) => <Arrondi key={`${i}${j}`} taille={[0.05, 0.08, 0.05]} position={[i * 0.32, 0.04, j * 0.3]} rayon={0.01} couleur="#3a2a1a" />))}
    </group>
  );
};

const Barbecue: React.FC<{ t: number; braises: number }> = ({ t, braises }) => {
  const [x, , z] = P.barbecue;
  const v = 0.75 + 0.25 * Math.sin(t * 9) * Math.sin(t * 5.3);
  return (
    <group position={[x, 0, z]}>
      {/* trois pieds */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.17 * Math.cos((i * 2 * Math.PI) / 3), 0.25, 0.17 * Math.sin((i * 2 * Math.PI) / 3)]} rotation={[0.18 * Math.sin((i * 2 * Math.PI) / 3), 0, -0.18 * Math.cos((i * 2 * Math.PI) / 3)]}>
          <cylinderGeometry args={[0.012, 0.012, 0.52, 8]} />
          <meshStandardMaterial color="#222" roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
      {/* cuve noire (demi-sphère) */}
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.26, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1c1c1e" roughness={0.45} metalness={0.5} side={DoubleSide} />
      </mesh>
      {/* braises */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.22, 0.2, 0.05, 24]} />
        <meshStandardMaterial color="#3a1206" emissive="#ff5a10" emissiveIntensity={1.6 * braises * v} roughness={0.9} />
      </mesh>
      {/* grille */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[(i - 3) * 0.065, 0.62, 0]}>
          <boxGeometry args={[0.006, 0.006, 0.48 - Math.abs(i - 3) * 0.06]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
      {braises > 0.01 && <pointLight position={[0, 0.85, 0]} intensity={2.6 * braises * v} distance={4.2} color="#ff7a2a" decay={2} />}
      <Fumee base={[0, 0.66, 0]} t={t} force={braises} hauteur={1.4} graine="barbecue" couleur="#6d6862" />
    </group>
  );
};

// Fenêtre de Morel : deux battants qui s'ouvrent vers l'intérieur
const FenetreMorel: React.FC<{ ouverture: number }> = ({ ouverture }) => {
  const [x, , z] = P.fenetre5;
  const l = 0.58;
  return (
    <group position={[x, 0.9, z + 0.05]}>
      {[-1, 1].map((k) => (
        <group key={k} position={[k * 0.6, 0, 0]} rotation={[0, -k * 1.4 * ouverture, 0]}>
          <group position={[-k * l / 2, 0.625, 0]}>
            {/* cadre */}
            {[
              [l, 0.05, 0, 0.6],
              [l, 0.05, 0, -0.6],
              [0.05, 1.25, -l / 2 + 0.025, 0],
              [0.05, 1.25, l / 2 - 0.025, 0],
            ].map(([w, h, dx, dy], i) => (
              <Arrondi key={i} taille={[w, h, 0.05]} position={[dx, dy, 0]} rayon={0.01} couleur="#e9e4da" rugosite={0.6} />
            ))}
            <mesh>
              <planeGeometry args={[l - 0.06, 1.15]} />
              <meshPhysicalMaterial color="#9fb6c9" roughness={0.05} transparent opacity={0.25} side={DoubleSide} />
            </mesh>
          </group>
        </group>
      ))}
      {/* rafale de neige qui entre quand c'est ouvert */}
      {ouverture > 0.3 && <pointLight position={[0, 0.6, 0.6]} intensity={0.6 * ouverture} distance={2.5} color="#a9c4ff" />}
    </group>
  );
};

// Voile rouge du monoxyde : la pièce se remplit, puis redevient « normale » (invisible = le danger)
const VoileCO: React.FC<{ niveau: number; opacite: number }> = ({ niveau, opacite }) =>
  opacite > 0.01 && niveau > 0.01 ? (
    <Fantome opacite={opacite}>
      <mesh position={[OX + 1.9, (2.4 * niveau) / 2, 0]}>
        <boxGeometry args={[3.4, 2.4 * niveau, 3.0]} />
        <meshBasicMaterial />
      </mesh>
    </Fantome>
  ) : null;

const Scene: React.FC<{ al: Alignement }> = ({ al }) => {
  const { t, fps, f, a, entre } = useTemps(al);
  const ines = useMemo(() => resoudrePersonnage(donnees.personnages[0], al, fps), [al, fps]);
  const ines5 = useMemo(() => resoudrePersonnage(donnees.personnages[2], al, fps), [al, fps]);
  const e = etatPersonnage(ines, f, fps);
  const e5 = etatPersonnage(ines5, f, fps);
  const loin = t > a("recap1") - 0.2 && t < a("recap2") + 0.5;

  // Chambre : bougie allumée à « une seule pièce », soufflée quand elle s'endort ; porte qui se ferme
  const bougie = t >= a("t1:seule") && t < a("calme:yeux");
  const porteChambre = entre("t1a:porte", "t1a:fermee");
  const courantPorte = Math.min(entre("t2", 0.3), 1 - entre("t2a:serviette", 0.4));
  const courantFenetre = Math.min(entre("t2", 0.3), 1 - entre("t2b:couverture", 0.4));
  const serviette = entre("t2a:serviette-0.1", 0.3);
  const couverture = entre("t2b:couverture-0.1", 0.35);
  const fantomeRuban = Math.min(entre("t2c", 0.25), 1 - entre("t2d", 0.3));
  const airGrille = entre("t2d", 0.3) * (1 - entre("t3", 0.3));
  const fumeeSol = entre("odeur", 0.5) * (t < a("morel") ? 1 : 0);
  // Le reste de l'appartement s'éteint quand Inès choisit sa pièce (la lampe de l'entrée)
  const entreeAllumee = 1 - entre("t1", 0.6);

  // 5e
  const braises = 1 - entre("aere:grand", 3.0) * 0.5;
  const niveauCO = entre("co", "co.fin");
  const voile = Math.min(entre("co", 0.3), 1 - entre("co2:couleur", 0.5));
  const porte5 = entre("m_folle-0.25", 0.45);
  const fenetre = entre("aere:fenetres", 0.5);
  const lampeHaut = t > a("m_cles:cles") && t < a("m_cles:cles") + 0.9 ? 0.7 + 0.3 * Math.sin(t * 40) : 0;
  const telephone = t >= a("appel") - 0.1 && t < a("appel.fin") + 0.4;
  const o5 = (e5.orientation * Math.PI) / 180;

  return (
    <>
      <Lumiere nuit={1} />
      <Immeuble eau={0} pompe={0} loin={loin} />

      {/* ======== 6e : l'appartement d'Inès (partie 1) ======== */}
      <RobinetCuisine t={t} fin={-1} />
      <WC eauCuvette={0.3} tourbillon={0} t={t} abattant={1} />
      <Lavabo robinet={0} />
      <TableauElectrique coupe={1} />
      <PlacardBallon porte={1} vanne={1} vidange={1} jet={0} seau={0} t={t} />
      <PorteEntree ouverture={0} verrou={0} cle={2} />
      <CanapeTissu position={[-4.6, 0, 0.55]} rotation={90} couleur="#6d4a3e" />
      <TapisEpais position={[-3.3, 0, 0.25]} largeur={2.0} profondeur={1.4} couleur="#7a3d32" />
      <Bibliotheque position={[-4.55, 0, -1.42]} />
      <Plante position={[-2.15, 0, -1.3]} />
      <Cadre position={[-4.3, 1.55, -1.53]} largeur={0.5} hauteur={0.38} />
      {/* patère et manteau de l'entrée */}
      <Arrondi taille={[0.04, 0.04, 0.1]} position={[4.4, 1.65, -1.48]} rayon={0.01} couleur="#2a2a2a" />
      <Arrondi taille={[0.34, 0.85, 0.14]} position={[4.4, 1.2, -1.42]} rayon={0.06} couleur="#5a5a5a" />
      {entreeAllumee > 0.01 && <pointLight position={[4.4, 1.6, -0.2]} intensity={0.6 * entreeAllumee} distance={3.0} color="#ffd6a0" />}
      {e.lampe && <pointLight position={[e.position[0], 1.0, e.position[2]]} intensity={0.45} distance={2.5} color="#fff1d8" />}

      {/* ---- chambre ---- */}
      <Lit />
      <Chevet bougie={bougie} />
      {bougie && <pointLight position={[7.0, 1.2, -0.7]} intensity={0.5} distance={3.2} color="#ffcf96" />}
      <TapisEpais position={[6.6, 0, 0.75]} largeur={1.2} profondeur={0.8} couleur="#4f5d7a" />
      <Cadre position={[7.6, 1.45, -1.53]} largeur={0.42} hauteur={0.3} teintes={["#c98a5a", "#5a7a9a", "#e2d3b0"]} />
      <Cadre position={[5.95, 1.6, -1.53]} largeur={0.24} hauteur={0.3} teintes={["#7a9a6a", "#d9c9a0", "#3a4a5a"]} />
      <Rideau position={[5.98, 0, -1.48]} hauteur={2.2} largeur={0.3} couleur="#c7b59a" />
      <Rideau position={[7.05, 0, -1.48]} hauteur={2.2} largeur={0.3} couleur="#c7b59a" />
      <Grille position={P.grilleChambre} />
      {/* grille du sol (vieil immeuble) */}
      <group position={P.grilleSol}>
        <Arrondi taille={[0.3, 0.012, 0.18]} rayon={0.004} couleur="#8a8780" metal={0.5} rugosite={0.5} />
      </group>
      {/* chaussons au pied du lit */}
      {[-1, 1].map((k) => (
        <Arrondi key={k} taille={[0.09, 0.05, 0.22]} position={[7.15 + k * 0.07, 0.025, 0.6]} rayon={0.025} couleur="#d9a0a8" rugosite={1} />
      ))}
      {/* porte de la chambre (charnière côté nord du passage, se ferme quand Inès est entrée) */}
      <group position={[5.72, 0, -0.6 - 0.45]} rotation={[0, (1 - porteChambre) * 1.5, 0]}>
        <Arrondi taille={[0.04, 2.0, 0.88]} position={[0, 1.0, 0.44]} rayon={0.01} couleur="#e8e2d6" rugosite={0.6} />
        <Arrondi taille={[0.02, 0.02, 0.12]} position={[0.03, 0.98, 0.76]} rayon={0.006} couleur="#c8b27a" metal={0.8} rugosite={0.3} />
      </group>
      {/* serviette roulée au pied de la porte, couverture sur la fenêtre */}
      {serviette > 0 && (
        <mesh position={[5.8, 0.04, -0.6]} rotation={[Math.PI / 2, 0, 0]} scale={[1, serviette, 1]}>
          <capsuleGeometry args={[0.04, 0.78, 6, 12]} />
          <meshStandardMaterial color="#d8c9a8" roughness={1} />
        </mesh>
      )}
      {couverture > 0 && (
        <group position={[6.5, 1.5, -1.5]} scale={[1, couverture, 1]}>
          <Arrondi taille={[1.25, 1.35, 0.04]} position={[0, -0.05, 0]} rayon={0.02} couleur="#6d5a8a" rugosite={1} />
          <Arrondi taille={[1.25, 0.12, 0.05]} position={[0, -0.68, 0.01]} rayon={0.02} couleur="#584870" rugosite={1} />
        </group>
      )}
      <CourantAir depart={[5.55, 0.04, -0.6]} direction={[1.0, 0, 0.15]} t={t} force={courantPorte} graine="porte" />
      <CourantAir depart={[6.5, 1.4, -1.45]} direction={[0, -0.4, 1.0]} t={t} force={courantFenetre} graine="fenetre" />
      <CourantAir depart={[6.0, 0.32, -1.45]} direction={[0.1, 0.15, 0.6]} t={t} force={airGrille * 0.7} graine="grille" />
      {/* fantôme : ruban adhésif collé sur la grille */}
      <Fantome opacite={fantomeRuban}>
        <mesh position={[P.grilleChambre[0], P.grilleChambre[1], P.grilleChambre[2] + 0.03]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.32, 0.06, 0.01]} />
          <meshBasicMaterial />
        </mesh>
        <mesh position={[P.grilleChambre[0], P.grilleChambre[1] - 0.04, P.grilleChambre[2] + 0.03]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.32, 0.06, 0.01]} />
          <meshBasicMaterial />
        </mesh>
      </Fantome>
      <Fumee base={P.grilleSol} t={t} force={fumeeSol} hauteur={0.9} graine="sol" couleur="#c9c4bc" />

      {/* ======== 5e : chez Morel ======== */}
      <Escalier />
      {/* veilleuse de secours (à piles) du palier */}
      <mesh position={[OX - 1.9, 2.1, -1.55]}>
        <boxGeometry args={[0.3, 0.1, 0.05]} />
        <meshStandardMaterial color="#d8ffe0" emissive="#5dff8a" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[OX - 2.1, 1.9, -1.0]} intensity={1.5} distance={3.6} color="#9fd8b0" />
      <pointLight position={[OX - 2.0, 1.7, 1.2]} intensity={0.7} distance={3.0} color="#b8c4e0" />
      <PorteMorel ouverture={porte5} />
      {/* paillasson et serviette roulée derrière la porte (il a tout calfeutré) */}
      <Arrondi taille={[0.5, 0.015, 0.7]} position={[OX - 1.65, 0.008, -0.4]} rayon={0.005} couleur="#6b4f2e" rugosite={1} />
      <mesh position={[OX - 1.2, 0.04, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.04, 0.8, 6, 12]} />
        <meshStandardMaterial color="#9fb0c4" roughness={1} />
      </mesh>
      <Tuyau goutte={t > a("tuyau") - 0.2 ? 1 : 0} t={t} />
      {[0.35, 0.7, 1.05, 1.4, 1.75].flatMap((x, i) => [
        <Bidon key={`a${i}`} position={o(x, 0, -1.38)} graine={i} />,
        <Bidon key={`b${i}`} position={o(x, 0, -1.18)} graine={i + 5} />,
      ])}
      <Fauteuil />
      <Barbecue t={t} braises={braises} />
      <TapisEpais position={o(1.8, 0, 0.2)} largeur={2.2} profondeur={1.5} couleur="#8a4a2a" bordure="#d9b27a" />
      <FenetreMorel ouverture={fenetre} />
      <Grille position={P.grille5} />
      {/* serviette posée sur la grille d'aération (l'erreur de Morel) */}
      <Arrondi taille={[0.3, 0.22, 0.03]} position={[P.grille5[0], P.grille5[1] - 0.02, P.grille5[2] + 0.03]} rayon={0.02} couleur="#c46a5a" rugosite={1} />
      <Bibliotheque position={o(3.45, 0, -0.6)} rotation={-90} graine="morel" />
      <Cadre position={o(0.55, 1.6, -1.53)} largeur={0.36} hauteur={0.46} teintes={["#7a6a4a", "#b9a57a", "#3a3a2a"]} />
      <Cadre position={o(2.0, 1.75, -1.53)} largeur={0.5} hauteur={0.36} teintes={["#5a6a7a", "#a98a5a", "#2a3a2a"]} />
      <Plante position={o(3.4, 0, 1.0)} graine="morel" />
      <VoileCO niveau={niveauCO} opacite={voile} />
      {/* lumière froide d'appoint dans l'entrée de Morel (on lit les bidons et le tuyau) */}
      <pointLight position={[OX - 0.6, 1.8, -0.4]} intensity={0.7} distance={3.0} color="#c8c8e0" />
      {/* lampe torche en haut de l'escalier (une seconde, puis plus rien) */}
      {lampeHaut > 0 && (
        <group position={P.lampeHaut}>
          <mesh>
            <sphereGeometry args={[0.035, 12, 10]} />
            <meshBasicMaterial color="#fff7e0" toneMapped={false} />
          </mesh>
          <pointLight intensity={1.4 * lampeHaut} distance={3.5} color="#fff1d0" />
        </group>
      )}
      {/* téléphone d'Inès (écran allumé, à l'oreille) */}
      {telephone && (
        <mesh position={[e5.position[0] - Math.cos(o5) * 0.2 + Math.sin(o5) * 0.05, 1.12, e5.position[2] + Math.sin(o5) * 0.2 + Math.cos(o5) * 0.05]} rotation={[0, o5, 0.2]}>
          <boxGeometry args={[0.012, 0.13, 0.065]} />
          <meshStandardMaterial color="#111" emissive="#7fb6ff" emissiveIntensity={0.7} roughness={0.3} />
        </mesh>
      )}
      {e5.lampe && <pointLight position={[e5.position[0], 1.0 + e5.position[1], e5.position[2]]} intensity={0.4} distance={2.5} color="#fff1d8" />}
      {/* lueur de la ville par les fenêtres (froide, faible) */}
      <pointLight position={[OX + 2.9, 1.6, -1.2]} intensity={0.25 + 0.6 * fenetre} distance={2.8} color="#9fb4e8" />
      <ambientLight intensity={lerp(0, 0.02, clamp(fenetre))} />
    </>
  );
};

export const Episode: React.FC<PropsEpisode> = (props) => (
  <EpisodeStandard {...props} donnees={donnees} eclairage={<></>} scene={<Scene al={props.alignement} />} />
);
