import React, { useMemo } from "react";
import { EpisodeStandard, PropsEpisode } from "../../systeme/EpisodeStandard";
import { Arrondi } from "../../systeme/kit3d/Arrondi";
import { Rideau } from "../../systeme/kit3d/Mobilier";
import { bruit, lerp, Vec3 } from "../../systeme/maths";
import { Alignement } from "../../systeme/mots";
import { etatPersonnage, resoudrePersonnage } from "../../systeme/personnage/trajet";
import { Lumiere, useTemps } from "../001-h72/Episode";
import { devant } from "../004-h72-conseil/Episode";
import { LampeSurPied, Portemanteau, ROUGE, Telephone3D } from "../006-appel/Episode";
import { donnees, ENTREE_FACE, FENETRE, FENETRE_FACE, LIT, PLACARD, PORTE, SOUS_LIT, TREPIED, VERROU, VOITURE } from "./donnees";

/*
 * Éléments 3D de « Le dernier appel », partie 3 : l'immeuble d'en face PERCÉ à la fenêtre du 3e (pièce vide construite
 * derrière : le trépied et le vieux téléphone, voyant rouge, flash ; la lampe d'un policier qui balaie), la voiture de
 * police et son gyrophare rouge, la porte d'entrée et son verrou (double tour), le placard fermé, les rideaux qui se
 * ferment, la chambre : le lit sur pieds, et dessous, dans le noir, Hugo et l'écran rouge qui s'allume.
 */
const BOIS = "#5a4636";
const Z_FACADE = -11; // face avant de l'immeuble d'en face

// Façade d'en face en 4 morceaux autour de la fenêtre percée ; pièce vide derrière ; porte d'entrée en bas
const ImmeubleEnFace: React.FC<{ torche: number | null; voyant: number; flash: number }> = ({ torche, voyant, flash }) => {
  const fenetres = useMemo(() => {
    const f: { x: number; y: number; allumee: boolean }[] = [];
    for (let i = -5; i <= 6; i++)
      for (let j = -3; j <= 4; j++) {
        const x = i * 2.1;
        const y = j * 2.9 + 1.55;
        if (Math.abs(x - FENETRE_FACE[0]) < 0.2 && Math.abs(y - FENETRE_FACE[1]) < 0.2) continue;
        f.push({ x, y, allumee: bruit("enface", i * 13 + j) > 0.82 });
      }
    return f;
  }, []);
  const [x0, x1, y0, y1] = [FENETRE_FACE[0] - 0.5, FENETRE_FACE[0] + 0.5, FENETRE_FACE[1] - 0.65, FENETRE_FACE[1] + 0.65];
  const zc = Z_FACADE - 0.3;
  const facade = "#5a5a60";
  const morceaux: [number, number, number, number][] = [
    [-13, x0, -9.5, 16.5],
    [x1, 15, -9.5, 16.5],
    [x0, x1, -9.5, y0],
    [x0, x1, y1, 16.5],
  ];
  // la pièce vide : sol au niveau de l'allège - 0,9 m
  const sol = y0 - 0.9;
  const piece = { x: FENETRE_FACE[0], z: Z_FACADE - 0.6 - 1.4, l: 3.2, p: 2.8, h: 2.6 };
  return (
    <group>
      {morceaux.map(([a, b, c, d], k) => (
        <mesh key={k} position={[(a + b) / 2, (c + d) / 2, zc]}>
          <boxGeometry args={[b - a, d - c, 0.6]} />
          <meshStandardMaterial color={facade} roughness={0.95} emissive="#2a2a30" emissiveIntensity={0.35} />
        </mesh>
      ))}
      {fenetres.map(({ x, y, allumee }, k) => (
        <mesh key={k} position={[x, y, Z_FACADE + 0.02]}>
          <planeGeometry args={[1.0, 1.3]} />
          <meshBasicMaterial color={allumee ? "#6a6a70" : "#18181c"} />
        </mesh>
      ))}
      {/* cadre de la fenêtre percée */}
      <Arrondi taille={[1.08, 0.06, 0.14]} position={[FENETRE_FACE[0], y0, Z_FACADE + 0.02]} rayon={0.01} couleur="#8a8a8e" />
      <Arrondi taille={[1.08, 0.05, 0.1]} position={[FENETRE_FACE[0], y1, Z_FACADE + 0.02]} rayon={0.01} couleur="#8a8a8e" />
      {/* la pièce vide derrière : sol, fond, côtés, plafond (sombres) */}
      <group position={[piece.x, sol, piece.z]}>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[piece.l, piece.p]} />
          <meshStandardMaterial color="#4a4640" roughness={1} />
        </mesh>
        <mesh position={[0, piece.h / 2, -piece.p / 2]}>
          <planeGeometry args={[piece.l, piece.h]} />
          <meshStandardMaterial color="#6a665e" roughness={1} />
        </mesh>
        <mesh position={[-piece.l / 2, piece.h / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[piece.p, piece.h]} />
          <meshStandardMaterial color="#5e5a54" roughness={1} />
        </mesh>
        <mesh position={[piece.l / 2, piece.h / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[piece.p, piece.h]} />
          <meshStandardMaterial color="#5e5a54" roughness={1} />
        </mesh>
        <mesh position={[0, piece.h, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[piece.l, piece.p]} />
          <meshStandardMaterial color="#3a3834" roughness={1} />
        </mesh>
        {/* une porte au fond (entrouverte, noire) et un vieux carton : l'appartement est abandonné */}
        <mesh position={[0.9, 1.0, -piece.p / 2 + 0.01]}>
          <planeGeometry args={[0.85, 2.0]} />
          <meshBasicMaterial color="#0e0e10" />
        </mesh>
        <Arrondi taille={[0.5, 0.36, 0.38]} position={[-1.1, 0.18, -0.8]} rotation={[0, 0.3, 0]} rayon={0.02} couleur="#6a5a44" rugosite={1} />
        {/* lueur faible du jour : la pièce reste lisible */}
        <pointLight position={[0, 2.2, 0.6]} intensity={0.5} distance={4} color="#c4cbe0" decay={2} />
      </group>
      <Trepied voyant={voyant} flash={flash} sol={sol} />
      {/* la lampe d'un policier : un point lumineux qui balaie le fond de la pièce (jamais sur le trépied) */}
      {torche !== null && (
        <pointLight position={[piece.x + 1.2 * Math.sin(torche * 2.2), sol + 1.4, piece.z - 0.9]} intensity={6} distance={2.6} color="#eef2ff" decay={2} />
      )}
      {/* porte de l'immeuble d'en face (hall allumé) et sa lumière sur le trottoir */}
      <mesh position={[ENTREE_FACE[0], ENTREE_FACE[1] + 1.1, Z_FACADE + 0.03]}>
        <planeGeometry args={[1.3, 2.2]} />
        <meshBasicMaterial color="#b0b0b4" />
      </mesh>
      <pointLight position={[ENTREE_FACE[0], ENTREE_FACE[1] + 2.4, Z_FACADE + 1.2]} intensity={4} distance={8} color="#e8ecf4" decay={1.6} />
      {/* réverbère : la rue reste lisible */}
      <Arrondi taille={[0.08, 4.2, 0.08]} position={[-3.2, -4.4, -8.6]} rayon={0.02} couleur="#2a2a2e" metal={0.5} />
      <Arrondi taille={[0.5, 0.12, 0.22]} position={[-3.0, -2.3, -8.6]} rayon={0.04} couleur="#2a2a2e" />
      <mesh position={[-2.95, -2.37, -8.6]}>
        <boxGeometry args={[0.36, 0.03, 0.16]} />
        <meshBasicMaterial color="#e8ecf4" toneMapped={false} />
      </mesh>
      <pointLight position={[-2.95, -2.6, -8.6]} intensity={6} distance={13} color="#d8e0f0" decay={1.5} />
      {/* la rue, en bas */}
      <mesh position={[1, -6.5, -6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#1e1e20" roughness={1} />
      </mesh>
      <mesh position={[1, -6.48, Z_FACADE + 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 2.0]} />
        <meshStandardMaterial color="#3a3a3e" roughness={1} />
      </mesh>
    </group>
  );
};

// Le trépied et le vieux téléphone, tourné vers la fenêtre de Nathan ; voyant rouge qui clignote, flash blanc
const Trepied: React.FC<{ voyant: number; flash: number; sol: number }> = ({ voyant, flash, sol }) => {
  const [x, y, z] = TREPIED;
  const h = y - sol;
  return (
    <group position={[x, sol, z]}>
      {[0, 1, 2].map((k) => {
        const ang = (k * 2 * Math.PI) / 3 + 0.4;
        return (
          <Arrondi key={k} taille={[0.025, h, 0.025]} position={[Math.sin(ang) * 0.14, h / 2 - 0.04, Math.cos(ang) * 0.14]} rotation={[Math.cos(ang) * 0.18, 0, -Math.sin(ang) * 0.18]} rayon={0.008} couleur="#1a1a1c" metal={0.5} />
        );
      })}
      <Arrondi taille={[0.06, 0.05, 0.06]} position={[0, h - 0.06, 0]} rayon={0.01} couleur="#1a1a1c" metal={0.5} />
      {/* le téléphone, debout, écran vers l'immeuble (dos vers nous : on voit l'objectif et le voyant) */}
      <group position={[0, h + 0.04, 0]}>
        <Arrondi taille={[0.085, 0.16, 0.012]} rayon={0.008} couleur="#151517" metal={0.4} rugosite={0.3} />
        <Arrondi taille={[0.026, 0.026, 0.008]} position={[-0.022, 0.05, 0.009]} rayon={0.012} couleur="#3a3a3e" metal={0.7} rugosite={0.2} />
        <mesh position={[0.02, 0.06, 0.012]}>
          <sphereGeometry args={[0.007 + 0.006 * voyant, 12, 12]} />
          <meshBasicMaterial color={ROUGE} toneMapped={false} transparent opacity={0.25 + 0.75 * voyant} />
        </mesh>
        <pointLight position={[0.02, 0.06, 0.08]} intensity={0.35 * voyant} distance={1.6} color={ROUGE} decay={2} />
        {flash > 0 && <pointLight position={[-0.022, 0.05, 0.2]} intensity={3 * flash} distance={3} color="#ffffff" decay={2} />}
        {flash > 0 && (
          <mesh position={[-0.022, 0.05, 0.014]}>
            <circleGeometry args={[0.02 + 0.03 * flash, 16]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={flash} />
          </mesh>
        )}
      </group>
    </group>
  );
};

// Voiture de police : caisse sombre, bande claire, rampe de gyrophare (rouge qui tourne)
const Voiture: React.FC<{ position: Vec3; gyro: number; allume: boolean }> = ({ position, gyro, allume }) => (
  <group position={position} rotation={[0, -Math.PI / 2, 0]}>
    <Arrondi taille={[1.8, 0.7, 4.3]} position={[0, 0.55, 0]} rayon={0.12} couleur="#8a8a90" metal={0.2} rugosite={0.5} />
    <Arrondi taille={[1.6, 0.55, 2.2]} position={[0, 1.15, -0.2]} rayon={0.12} couleur="#18181c" metal={0.3} rugosite={0.2} />
    {/* feux arrière (vers la caméra) */}
    {[-0.6, 0.6].map((xx) => (
      <mesh key={xx} position={[xx, 0.7, -2.16]}>
        <boxGeometry args={[0.3, 0.12, 0.02]} />
        <meshBasicMaterial color={ROUGE} toneMapped={false} />
      </mesh>
    ))}
    <Arrondi taille={[1.82, 0.16, 4.32]} position={[0, 0.62, 0]} rayon={0.04} couleur="#1a1a1e" />
    {[-1.4, 1.4].map((zz) =>
      [-0.85, 0.85].map((xx) => (
        <mesh key={`${zz}${xx}`} position={[xx, 0.32, zz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.32, 0.32, 0.22, 18]} />
          <meshStandardMaterial color="#0e0e10" roughness={0.9} />
        </mesh>
      )),
    )}
    {/* rampe : deux feux, le rouge clignote */}
    <Arrondi taille={[0.9, 0.1, 0.22]} position={[0, 1.48, -0.2]} rayon={0.03} couleur="#1a1a1c" />
    <mesh position={[-0.25, 1.56, -0.2]}>
      <boxGeometry args={[0.32, 0.1, 0.18]} />
      <meshBasicMaterial color={allume ? ROUGE : "#3a1a1c"} toneMapped={false} transparent opacity={allume ? 0.3 + 0.7 * gyro : 1} />
    </mesh>
    <mesh position={[0.25, 1.56, -0.2]}>
      <boxGeometry args={[0.32, 0.1, 0.18]} />
      <meshBasicMaterial color={allume ? "#d8e0ff" : "#2a2a2e"} toneMapped={false} transparent opacity={allume ? 0.3 + 0.7 * (1 - gyro) : 1} />
    </mesh>
    {allume && <pointLight position={[0, 2.0, -0.2]} intensity={9 * gyro} distance={9} color={ROUGE} decay={1.6} />}
  </group>
);

// Porte d'entrée (battant fermé dans l'ouverture du mur est) et son verrou à bouton, qui tourne deux fois
const PorteEntree: React.FC<{ tour: number }> = ({ tour }) => (
  <group>
    <Arrondi taille={[0.05, 2.08, PORTE.largeur - 0.03]} position={[PORTE.x, 1.04, PORTE.z]} rayon={0.008} couleur="#6e655a" />
    {/* moulures */}
    <Arrondi taille={[0.012, 0.8, 0.6]} position={[PORTE.x - 0.03, 1.5, PORTE.z]} rayon={0.004} couleur="#7a7064" />
    <Arrondi taille={[0.012, 0.8, 0.6]} position={[PORTE.x - 0.03, 0.55, PORTE.z]} rayon={0.004} couleur="#7a7064" />
    {/* poignée */}
    <Arrondi taille={[0.05, 0.03, 0.14]} position={[PORTE.x - 0.06, 1.0, VERROU[2] + 0.04]} rayon={0.012} couleur="#c9c4ba" metal={0.7} rugosite={0.3} />
    {/* verrou : rosace et bouton qui tourne (deux quarts de tour = double tour) */}
    <mesh position={[VERROU[0] + 0.012, VERROU[1], VERROU[2]]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.045, 0.045, 0.012, 24]} />
      <meshStandardMaterial color="#c9c4ba" metalness={0.7} roughness={0.3} />
    </mesh>
    <group position={[VERROU[0] - 0.01, VERROU[1], VERROU[2]]} rotation={[tour * Math.PI, 0, 0]}>
      <Arrondi taille={[0.03, 0.075, 0.022]} rayon={0.008} couleur="#dcd8ce" metal={0.7} rugosite={0.3} />
    </group>
  </group>
);

// Placard à portes coulissantes, fermé (repris de la partie 2)
const Placard: React.FC = () => (
  <group position={PLACARD}>
    <Arrondi taille={[0.55, 2.0, 1.0]} position={[0, 1.0, 0]} rayon={0.01} couleur={BOIS} />
    <Arrondi taille={[0.03, 1.96, 0.5]} position={[0.26, 1.0, -0.25]} rayon={0.006} couleur="#9a8a78" />
    <Arrondi taille={[0.03, 1.96, 0.5]} position={[0.3, 1.0, 0.25]} rayon={0.006} couleur="#a3937f" />
    <Arrondi taille={[0.02, 0.3, 0.025]} position={[0.325, 1.0, 0.45]} rayon={0.008} couleur="#c9c4ba" metal={0.6} />
  </group>
);

// Lit sur pieds (on voit dessous), tête contre le mur ouest ; dessous : Hugo, allongé dans le noir, et son téléphone
const LitSurPieds: React.FC<{ ecran: number }> = ({ ecran }) => (
  <group>
    <group position={LIT} rotation={[0, Math.PI / 2, 0]}>
      {[-0.66, 0.66].map((xx) =>
        [-0.93, 0.93].map((zz) => <Arrondi key={`${xx}${zz}`} taille={[0.07, 0.3, 0.07]} position={[xx, 0.15, zz]} rayon={0.01} couleur="#3a2e24" />),
      )}
      <Arrondi taille={[1.45, 0.14, 2.0]} position={[0, 0.37, 0]} rayon={0.02} couleur={BOIS} />
      <Arrondi taille={[1.4, 0.18, 1.9]} position={[0, 0.53, 0.02]} rayon={0.05} couleur="#d8d3c8" rugosite={0.95} />
      <Arrondi taille={[1.46, 0.08, 1.35]} position={[0, 0.65, 0.3]} rayon={0.04} couleur="#4a4a50" rugosite={1} />
      <Arrondi taille={[0.55, 0.12, 0.35]} position={[-0.33, 0.68, -0.72]} rayon={0.05} couleur="#ece8de" rugosite={1} />
      <Arrondi taille={[0.55, 0.12, 0.35]} position={[0.33, 0.68, -0.72]} rayon={0.05} couleur="#ece8de" rugosite={1} />
      <Arrondi taille={[1.45, 1.1, 0.06]} position={[0, 0.55, -0.98]} rayon={0.02} couleur={BOIS} />
    </group>
    {/* Hugo sous le lit : allongé, le corps vers la tête du lit, le visage tourné vers nous (au pied du lit) */}
    <Arrondi taille={[1.5, 0.2, 0.42]} position={[SOUS_LIT[0] - 0.95, 0.11, SOUS_LIT[2] - 0.15]} rayon={0.09} couleur="#141416" rugosite={1} />
    <group position={SOUS_LIT}>
      <mesh scale={[0.92, 1.12, 0.9]}>
        <sphereGeometry args={[0.11, 24, 18]} />
        <meshStandardMaterial color="#3a2e2a" roughness={0.95} />
      </mesh>
      {/* cheveux sombres */}
      <mesh position={[-0.02, 0.03, -0.02]} scale={[1.05, 0.85, 0.95]}>
        <sphereGeometry args={[0.116, 20, 14, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial color="#121214" roughness={1} />
      </mesh>
      {/* les yeux grands ouverts, qui fixent la caméra */}
      {[-0.035, 0.035].map((dx) => (
        <group key={dx} position={[dx, 0.0, 0.092]}>
          <mesh scale={[1, 0.45, 0.5]}>
            <sphereGeometry args={[0.016, 14, 10]} />
            <meshBasicMaterial color="#cfc9be" />
          </mesh>
          <mesh position={[0, 0, 0.007]}>
            <sphereGeometry args={[0.0055, 10, 8]} />
            <meshBasicMaterial color="#050506" />
          </mesh>
        </group>
      ))}
    </group>
    {/* la main posée près du téléphone */}
    <Arrondi taille={[0.09, 0.04, 0.16]} position={[SOUS_LIT[0] - 0.18, 0.025, SOUS_LIT[2] + 0.12]} rayon={0.02} couleur="#b8927a" rugosite={1} />
    {/* son téléphone, posé par terre devant son visage : l'écran s'allume en rouge quand il vibre */}
    <group position={[SOUS_LIT[0] - 0.02, 0.008, SOUS_LIT[2] + 0.2]} rotation={[-Math.PI / 2, 0, 0.5]}>
      <Arrondi taille={[0.075, 0.15, 0.009]} rayon={0.008} couleur="#111114" metal={0.4} rugosite={0.3} />
      <mesh position={[0, 0, 0.0052]}>
        <planeGeometry args={[0.066, 0.138]} />
        <meshBasicMaterial color={ecran > 0 ? ROUGE : "#0c0c0e"} toneMapped={false} transparent opacity={ecran > 0 ? 0.35 + 0.65 * ecran : 1} />
      </mesh>
    </group>
    {ecran > 0 && <pointLight position={[SOUS_LIT[0], 0.06, SOUS_LIT[2] + 0.3]} intensity={0.45 * ecran} distance={1.4} color={ROUGE} decay={2} />}
    {/* table de chevet */}
    <Arrondi taille={[0.45, 0.5, 0.4]} position={[-6.9, 0.25, -1.0]} rayon={0.02} couleur="#3a2e24" />
  </group>
);

const Scene: React.FC<{ al: Alignement }> = ({ al }) => {
  const { t, fps, f, a, entre } = useTemps(al);
  const r = useMemo(() => resoudrePersonnage(donnees.personnages.find((p) => p.id === "nathan")!, al, fps), [al, fps]);
  const e = etatPersonnage(r, f, fps);
  const o = (e.orientation * Math.PI) / 180;

  // ---- téléphone de Nathan : à l'oreille (le 17, puis le commissariat), dans la main (le SMS), éteint à la fin ----
  const oreille = (t < a("consigne") + 1.4) || (t >= a("rappel") + 0.2 && t < a("repartent"));
  let tel: React.ReactNode = null;
  if (oreille) tel = <Telephone3D position={devant(e.position, e.orientation, 0.06, 0.13, 1.62)} rotation={[0, o + Math.PI / 2, 0]} allume={false} />;
  else if (t >= a("vibre") + 0.2 && t < a("giro")) tel = <Telephone3D position={devant(e.position, e.orientation, 0.42, 0.17, 1.22)} rotation={[-0.9, o, 0]} allume />;
  else if (t >= a("pas")) tel = <Telephone3D position={devant([e.position[0], e.position[1] - 0.42, e.position[2]], e.orientation, 0.42, 0.17, 1.22)} rotation={[-0.9, o, 0]} allume={false} />;

  // ---- en face : gyrophare, voiture qui repart, lampe qui balaie, voyant, flash ----
  const police = t >= a("giro") - 0.3;
  const gyro = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * 1.6);
  const depart = entre("repartent+0.3", 2.2);
  const voiture: Vec3 = [VOITURE[0] - depart * 14, VOITURE[1], VOITURE[2]];
  const torche = t >= a("torche:lampe") && t < a("trepied") ? t - a("torche") : null;
  const voyant = Math.sin(t * 2 * Math.PI * 0.9) > 0 ? 1 : 0.15;
  const flash = Math.max(1 - Math.min(1, Math.abs(t - a("auto:photo")) / 0.08), 1 - Math.min(1, Math.abs(t - a("auto:minutes")) / 0.08), 0);

  // ---- rideaux ouverts, puis tirés à « ferme » ----
  const fermes = entre("ferme:rideaux", 0.8);
  const demi = FENETRE.largeur / 2;
  const xG = lerp(FENETRE.x - demi - 0.15, FENETRE.x - demi / 2, fermes);
  const xD = lerp(FENETRE.x + demi + 0.15, FENETRE.x + demi / 2, fermes);
  const largeurRideau = lerp(0.5, demi + 0.1, fermes);

  // ---- verrou : double tour ; écran sous le lit (rouge) dès qu'il vibre ----
  const tour = (entre("verrou:double", 0.25) + entre("verrou:tour", 0.25)) / 2;
  const ecran = t >= a("vibre2:vibre") ? 0.75 + 0.25 * Math.sin(t * 2 * Math.PI * 1.2) : 0;

  return (
    <>
      <Lumiere nuit={0.2} />
      {/* lumière grise du matin par la fenêtre (baisse quand les rideaux se ferment) ; plafonnier faible */}
      <pointLight position={[FENETRE.x, 1.6, -1.6]} intensity={2.4 * (1 - 0.6 * fermes)} distance={6} color="#c4cbe0" decay={2} />
      <pointLight position={[0, 2.5, -0.6]} intensity={0.9} distance={7} color="#c9d2ea" decay={2} />
      {/* chambre : pénombre, sans source visible (le lit reste lisible) */}
      <pointLight position={[-5.0, 2.4, 1.0]} intensity={0.55} distance={5} color="#b9c2dc" decay={2} />
      <ImmeubleEnFace torche={torche} voyant={voyant} flash={flash} />
      {police && t < a("repartent") + 2.6 && <Voiture position={voiture} gyro={gyro} allume />}
      <LampeSurPied allumee={false} />
      <Portemanteau manteau={false} />
      <Placard />
      <PorteEntree tour={tour} />
      <Rideau position={[xG, 0.02, FENETRE.z + 0.12]} hauteur={2.5} largeur={largeurRideau} couleur="#8a8a90" />
      <Rideau position={[xD, 0.02, FENETRE.z + 0.12]} hauteur={2.5} largeur={largeurRideau} couleur="#8a8a90" />
      <LitSurPieds ecran={ecran} />
      {tel}
    </>
  );
};

export const Episode: React.FC<PropsEpisode> = (props) => (
  <EpisodeStandard {...props} donnees={donnees} eclairage={<></>} scene={<Scene al={props.alignement} />} />
);
