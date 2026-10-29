import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { PerspectiveCamera } from "three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Telephone } from "../../systeme/hud/Composants";
import { HUD } from "../../systeme/hud/boites";
import { ElementHudResolu } from "../../systeme/hud/types";
import { Arrondi } from "../../systeme/kit3d/Arrondi";
import { Environnement } from "../../systeme/kit3d/Lumieres";
import { PostProcess } from "../../systeme/kit3d/PostProcess";
import { Humain } from "../../systeme/personnage/Humain";
import { EXPRESSIONS, POSES } from "../../systeme/personnage/poses";
import { LEA, NATHAN } from "./personnages";

/*
 * Image d'essai du style de la saison « Le dernier appel » (à valider avant tout épisode, leçon du 24/10) :
 * personnages « adulte » (anime adulte, ≈ 1,75 m), image noir et blanc + rouge, écran de téléphone en grand.
 * Image 0 : Nathan et Léa dans leur salon, la nuit. Image 30 : Nathan seul dans le noir, le SMS rouge.
 */

const Cam: React.FC<{ pos: [number, number, number]; vise: [number, number, number]; fov: number }> = ({ pos, vise, fov }) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  camera.position.set(...pos);
  camera.fov = fov;
  camera.lookAt(...vise);
  camera.updateProjectionMatrix();
  return null;
};

const Salon: React.FC<{ lampe: number }> = ({ lampe }) => (
  <group>
    {/* sol, mur du fond, mur gauche */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[9, 7]} />
      <meshStandardMaterial color="#6b5a4a" roughness={0.8} />
    </mesh>
    <mesh position={[0, 1.4, -2.2]} receiveShadow>
      <boxGeometry args={[9, 2.8, 0.1]} />
      <meshStandardMaterial color="#b9b2a6" roughness={0.9} />
    </mesh>
    <mesh position={[-3.2, 1.4, 0]} receiveShadow>
      <boxGeometry args={[0.1, 2.8, 7]} />
      <meshStandardMaterial color="#a9a296" roughness={0.9} />
    </mesh>
    {/* grande fenêtre : la nuit, l'immeuble d'en face, une fenêtre allumée en rouge (l'écran qui observe) */}
    <mesh position={[0.9, 1.45, -2.14]}>
      <boxGeometry args={[2.2, 1.7, 0.02]} />
      <meshBasicMaterial color="#0b0d12" />
    </mesh>
    {[
      [0.2, 1.1],
      [0.75, 1.1],
      [1.3, 1.1],
      [0.2, 1.75],
      [1.3, 1.75],
    ].map(([x, y], i) => (
      <mesh key={i} position={[x, y, -2.12]}>
        <planeGeometry args={[0.3, 0.38]} />
        <meshBasicMaterial color="#1c1f26" />
      </mesh>
    ))}
    <mesh position={[0.75, 1.75, -2.115]}>
      <planeGeometry args={[0.3, 0.38]} />
      <meshBasicMaterial color="#ff2a22" toneMapped={false} />
    </mesh>
    {[0.9 - 1.12, 0.9 + 1.12].map((x) => (
      <Arrondi key={x} taille={[0.06, 1.8, 0.06]} position={[x, 1.45, -2.1]} rayon={0.01} couleur="#e8e3da" />
    ))}
    {/* canapé, table basse, lampe */}
    <Arrondi taille={[2.0, 0.42, 0.85]} position={[-1.6, 0.21, -1.4]} rayon={0.08} couleur="#4a4a4e" />
    <Arrondi taille={[2.0, 0.55, 0.22]} position={[-1.6, 0.6, -1.78]} rayon={0.08} couleur="#4a4a4e" />
    <Arrondi taille={[0.9, 0.36, 0.5]} position={[-1.4, 0.18, -0.4]} rayon={0.03} couleur="#3a2e24" />
    <mesh position={[-2.75, 1.5, -1.7]}>
      <coneGeometry args={[0.2, 0.25, 20, 1, true]} />
      <meshStandardMaterial color="#f3e7cf" emissive="#ffd9a0" emissiveIntensity={0.6 * lampe} side={2} />
    </mesh>
    <Arrondi taille={[0.03, 1.4, 0.03]} position={[-2.75, 0.7, -1.7]} rayon={0.01} couleur="#222" />
    {lampe > 0 && <pointLight position={[-2.7, 1.45, -1.55]} intensity={6 * lampe} distance={6} color="#ffd6a0" castShadow />}
  </group>
);

const fauxTelephone = (f: number): ElementHudResolu & { fChangements: number[] } => ({
  type: "telephone",
  ecran: "sms",
  contact: "06 •• •• •• 12",
  messages: [
    { a: 0, texte: "Tu crois la connaître ?" },
    { a: 0, texte: "Jolie chemise bleue, Nathan.", menace: true },
  ],
  fDe: f - 20,
  fA: f + 100,
  index: 0,
  fChangements: [f - 20, f - 10],
});

export const EssaiStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const couple = frame < 30;
  const portraits = frame >= 50;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ThreeCanvas width={width} height={height} shadows>
        {couple ? (
          <Cam pos={[0.9, 1.45, 4.3]} vise={[-0.35, 1.05, -0.6]} fov={42} />
        ) : portraits ? (
          frame < 56 ? (
            <Cam pos={[-0.3, 1.64, 1.15]} vise={[0.25, 1.56, -0.45]} fov={24} />
          ) : (
            <Cam pos={[-0.55, 1.64, 0.95]} vise={[-0.95, 1.56, -0.65]} fov={24} />
          )
        ) : (
          <Cam pos={[0.3, 1.55, 2.2]} vise={[0.05, 1.12, -0.3]} fov={44} />
        )}
        <color attach="background" args={["#050608"]} />
        <Environnement intensite={0.08} />
        <hemisphereLight args={["#8090b8", "#1a140f", couple || portraits ? 0.35 : 0.08]} />
        <directionalLight position={[3, 5, 4]} intensity={couple || portraits ? 0.5 : 0.05} castShadow />
        <Salon lampe={couple || portraits ? 1 : 0} />
        {couple || portraits ? (
          <>
            <Humain variante="adulte" pose={POSES.debout} position={[-0.95, 0, -0.65]} orientation={35} apparence={NATHAN} visage={EXPRESSIONS.inquiet} />
            <Humain variante="adulte" pose={POSES.bras} position={[0.25, 0, -0.45]} orientation={-30} apparence={LEA} visage={{ ...EXPRESSIONS.decide, sourire: -0.2 }} />
          </>
        ) : (
          <>
            {/* seule lumière : l'écran du téléphone, par en dessous */}
            <pointLight position={[0.05, 1.25, 0.25]} intensity={0.55} distance={1.6} color="#dfe8ff" />
            <Humain variante="adulte" pose={{ ...POSES.mainTendue, tete: [14, 0], epauleD: [55, 6], coudeD: 70 }} position={[0, 0, -0.3]} orientation={8} apparence={NATHAN} visage={EXPRESSIONS.peur} />
          </>
        )}
        <PostProcess bloom={0.35} seuilBloom={0.85} vignette={0.6} grain={0.04} exposition={1} noirRouge={1} />
      </ThreeCanvas>
      {!couple && !portraits && <Telephone e={fauxTelephone(frame) as never} r={{ ...HUD.telephone, y: 760, h: 560 }} f={frame} fMessages={[frame - 20, frame - 10]} />}
    </AbsoluteFill>
  );
};
