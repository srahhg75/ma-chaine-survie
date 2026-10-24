import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { PerspectiveCamera } from "three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { EclairageBase } from "../kit3d/Lumieres";
import { POLICE_TEXTE } from "../polices";
import { Bonhomme } from "./Bonhomme";
import { EXPRESSIONS, NomExpression, NomPose, poseMarche, POSES } from "./poses";

/*
 * Banc d'essai du personnage : chaque pose est montrée 2 s sous 4 angles (face, trois-quarts, profil, dos).
 * Sert à valider une pose avant de l'utiliser dans un épisode (npx tsx tools/images.ts banc-essai …).
 */
export const POSES_BANC: NomPose[] = ["debout", "marche", "accroupi", "mainTendue", "boutonCote", "lampe", "froid", "inquiet", "assis"];
export const IMAGES_PAR_POSE = 60;

const ANGLES = [
  { nom: "FACE", deg: 0 },
  { nom: "TROIS-QUARTS", deg: 40 },
  { nom: "PROFIL", deg: 90 },
  { nom: "DOS", deg: 180 },
];

const Cam: React.FC<{ deg: number }> = ({ deg }) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const r = 3.1;
  camera.position.set(Math.sin((deg * Math.PI) / 180) * r, 1.15, Math.cos((deg * Math.PI) / 180) * r);
  camera.fov = 32;
  camera.lookAt(0, 0.62, 0);
  camera.updateProjectionMatrix();
  return null;
};

export const BancEssai: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const i = Math.min(POSES_BANC.length - 1, Math.floor(frame / IMAGES_PAR_POSE));
  const nom = POSES_BANC[i];
  const t = (frame % IMAGES_PAR_POSE) / fps;
  const pose = nom === "marche" ? poseMarche((t * 1.6) % 1) : POSES[nom];
  return (
    <AbsoluteFill style={{ backgroundColor: "#1b1d22", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
      {ANGLES.map((a) => (
        <div key={a.nom} style={{ position: "relative", border: "2px solid #2c2f36" }}>
          <ThreeCanvas width={width / 2} height={height / 2} shadows>
            <Cam deg={a.deg} />
            <color attach="background" args={["#2a2d34"]} />
            <EclairageBase intensite={1.9} />
            <pointLight position={[0, 1.6, 2.2]} intensity={4} color="#ffffff" />
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <circleGeometry args={[1.4, 48]} />
              <meshStandardMaterial color="#4a4d55" />
            </mesh>
            <Bonhomme pose={pose} position={[0, 0, 0]} orientation={0} lampe={nom === "lampe"} />
          </ThreeCanvas>
          <div style={{ position: "absolute", left: 24, top: 20, fontFamily: POLICE_TEXTE, fontWeight: 900, fontSize: 40, color: "#FFC93C" }}>
            {nom.toUpperCase()} <span style={{ color: "#fff", fontWeight: 600, fontSize: 30 }}>· {a.nom}</span>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/*
 * Banc des visages : la tête de l'héroïne en gros plan pour chaque expression (grille 3×3), éclairage neutre.
 * npx tsx tools/images.ts banc-visages 0.5    (une seule image suffit ; à 1,5 s : vue de trois-quarts)
 */
const CamVisage: React.FC<{ deg: number }> = ({ deg }) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const r = 1.9;
  camera.position.set(Math.sin((deg * Math.PI) / 180) * r, 1.2, Math.cos((deg * Math.PI) / 180) * r);
  camera.fov = 30;
  camera.lookAt(0, 1.1, 0);
  camera.updateProjectionMatrix();
  return null;
};

export const BancVisages: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const deg = frame < 30 ? 0 : 30;
  const noms = Object.keys(EXPRESSIONS) as NomExpression[];
  return (
    <AbsoluteFill style={{ backgroundColor: "#1b1d22", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr 1fr" }}>
      {noms.map((nom) => (
        <div key={nom} style={{ position: "relative", border: "2px solid #2c2f36" }}>
          <ThreeCanvas width={width / 3} height={height / 3}>
            <CamVisage deg={deg} />
            <color attach="background" args={["#2a2d34"]} />
            <EclairageBase intensite={1.6} />
            <pointLight position={[0.4, 1.5, 1.4]} intensity={2.5} color="#ffffff" />
            <Bonhomme pose={POSES.debout} position={[0, 0, 0]} orientation={0} variante="heroine" visage={EXPRESSIONS[nom]} />
          </ThreeCanvas>
          <div style={{ position: "absolute", left: 14, top: 10, fontFamily: POLICE_TEXTE, fontWeight: 900, fontSize: 30, color: "#FFC93C" }}>{nom.toUpperCase()}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
