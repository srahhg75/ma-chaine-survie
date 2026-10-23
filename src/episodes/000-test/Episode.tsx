import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HAUTEUR, LARGEUR } from "../../systeme/format";
import { GuideZonesSures } from "../../systeme/GuideZonesSures";
import { Mot } from "../../systeme/mots";
import { SousTitres } from "../../systeme/SousTitres";

export const EPISODE = "000-test";

export type PropsEpisode = { mots: Mot[]; guide: boolean };

// Épisode de test : vérifie la chaîne 3D + sous-titres + voix. Pas destiné à être publié.
const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Travelling continu autour du sujet (≈ 10°/s, bien sous la limite de 160°/s)
  const angle = interpolate(frame, [0, durationInFrames], [0.3, 0.3 + (durationInFrames / 30) * 0.17]);
  return (
    <>
      <color attach="background" args={["#1a1d22"]} />
      <fog attach="fog" args={["#1a1d22", 8, 30]} />
      <hemisphereLight args={["#8a9bb0", "#2a2018", 1.1]} />
      <directionalLight position={[4, 8, 3]} intensity={2.4} color="#ffb070" />
      <group>
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#5a5248" roughness={1} />
        </mesh>
        {/* Sujet : un personnage stylisé */}
        <mesh position={[0, 0.6, 0]}>
          <capsuleGeometry args={[0.35, 1.2, 8, 16]} />
          <meshStandardMaterial color="#7b8a6a" />
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshStandardMaterial color="#c9a27e" />
        </mesh>
        {/* Ruines */}
        {[-3, 2.5, 4].map((x, i) => (
          <mesh key={i} position={[x, 0.8 + i * 0.3, -4 - i]} rotation={[0, i, 0.1 * i]}>
            <boxGeometry args={[1.5, 2.6 + i, 1.2]} />
            <meshStandardMaterial color="#6e675e" roughness={0.9} />
          </mesh>
        ))}
      </group>
      <CameraOrbite angle={angle} rayon={7} />
    </>
  );
};

const CameraOrbite: React.FC<{ angle: number; rayon: number }> = ({ angle, rayon }) => {
  const camera = useThree((s) => s.camera);
  // Caméra basse visant sous le sujet : le sujet reste dans le haut de l'image, au-dessus des sous-titres
  camera.position.set(Math.sin(angle) * rayon, 1.6, Math.cos(angle) * rayon);
  camera.lookAt(0, -0.4, 0);
  return null;
};

export const Episode: React.FC<PropsEpisode> = ({ mots, guide }) => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <ThreeCanvas width={LARGEUR} height={HAUTEUR} camera={{ fov: 50, position: [0, 2, 7] }}>
      <Scene />
    </ThreeCanvas>
    <SousTitres mots={mots} />
    <Audio src={staticFile(`${EPISODE}/voix.wav`)} />
    {guide && <GuideZonesSures />}
  </AbsoluteFill>
);
