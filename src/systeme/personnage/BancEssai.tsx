import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { PerspectiveCamera } from "three";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { EclairageBase } from "../kit3d/Lumieres";
import { POLICE_TEXTE } from "../polices";
import { Bonhomme } from "./Bonhomme";
import { EXPRESSIONS, NomExpression, NomPose, Pose, poseMarche, POSES, Visage } from "./poses";
import { Apparence, APPARENCE_INES, APPARENCE_MOREL } from "./apparence";
import { Humain } from "./Humain";

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

/*
 * Banc des humains (réalisme en formes simples) : Inès et Morel en pied (face, trois-quarts, profil) puis en plan
 * poitrine avec plusieurs expressions, bouche ouverte comprise (parole).
 * npx tsx tools/images.ts banc-humains 0.5 1.5
 */
const CamHumains: React.FC<{ pied: boolean }> = ({ pied }) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  if (pied) {
    camera.position.set(0.5, 1.0, 4.3);
    camera.fov = 32;
    camera.lookAt(0, 0.7, 0);
  } else {
    camera.position.set(0.2, 1.12, 1.75);
    camera.fov = 30;
    camera.lookAt(0, 1.0, 0);
  }
  camera.updateProjectionMatrix();
  return null;
};

export const BancHumains: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const pied = frame < 30;
  const cases: { titre: string; a: Partial<Apparence>; o: number; v: Visage; pose?: Pose }[] = pied
    ? [
        { titre: "INÈS FACE", a: APPARENCE_INES, o: 0, v: EXPRESSIONS.neutre },
        { titre: "INÈS 3/4", a: APPARENCE_INES, o: 40, v: EXPRESSIONS.sourire },
        { titre: "INÈS PROFIL", a: APPARENCE_INES, o: 90, v: EXPRESSIONS.neutre, pose: POSES.mainTendue },
        { titre: "MOREL FACE", a: APPARENCE_MOREL, o: 0, v: EXPRESSIONS.neutre },
        { titre: "MOREL 3/4", a: APPARENCE_MOREL, o: -40, v: EXPRESSIONS.decide },
        { titre: "MOREL PROFIL", a: APPARENCE_MOREL, o: -90, v: EXPRESSIONS.triste, pose: poseMarche(0.25) },
        { titre: "INÈS BONNET", a: { ...APPARENCE_INES, bonnet: "#c9a227" }, o: 20, v: EXPRESSIONS.sourire },
        { titre: "INÈS LAMPE", a: APPARENCE_INES, o: -25, v: EXPRESSIONS.peur, pose: POSES.lampe },
        { titre: "INÈS ACCROUPIE", a: APPARENCE_INES, o: 30, v: EXPRESSIONS.decide, pose: POSES.accroupi },
      ]
    : [
        { titre: "INÈS PARLE", a: APPARENCE_INES, o: 15, v: { ...EXPRESSIONS.decide, bouche: 0.55 } },
        { titre: "INÈS PEUR", a: APPARENCE_INES, o: 25, v: EXPRESSIONS.peur },
        { titre: "INÈS FATIGUE", a: APPARENCE_INES, o: -20, v: EXPRESSIONS.fatigue },
        { titre: "MOREL PARLE", a: APPARENCE_MOREL, o: -15, v: { ...EXPRESSIONS.decide, bouche: 0.6 } },
        { titre: "MOREL SOURIRE", a: APPARENCE_MOREL, o: -30, v: EXPRESSIONS.sourire },
        { titre: "MOREL TRISTE", a: APPARENCE_MOREL, o: 10, v: EXPRESSIONS.triste },
        { titre: "INÈS COLÈRE", a: APPARENCE_INES, o: 0, v: { ...EXPRESSIONS.decide, bouche: 0.9 } },
        { titre: "INÈS SURPRISE", a: APPARENCE_INES, o: 35, v: EXPRESSIONS.surpris },
        { titre: "MOREL INQUIET", a: APPARENCE_MOREL, o: 30, v: EXPRESSIONS.inquiet },
      ];
  return (
    <AbsoluteFill style={{ backgroundColor: "#1b1d22", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr 1fr" }}>
      {cases.map((c) => (
        <div key={c.titre} style={{ position: "relative", border: "2px solid #2c2f36" }}>
          <ThreeCanvas width={width / 3} height={height / 3} shadows>
            <CamHumains pied={pied} />
            <color attach="background" args={["#2a2d34"]} />
            <EclairageBase intensite={1.4} />
            <pointLight position={[0.8, 2.0, 2.2]} intensity={3} color="#fff1dc" />
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[8, 8]} />
              <meshStandardMaterial color="#4a4d55" roughness={0.9} />
            </mesh>
            <Humain pose={c.pose ?? POSES.debout} position={[0, 0, 0]} orientation={c.o} apparence={c.a} visage={c.v} />
          </ThreeCanvas>
          <div style={{ position: "absolute", left: 14, top: 10, fontFamily: POLICE_TEXTE, fontWeight: 900, fontSize: 28, color: "#FFC93C" }}>{c.titre}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
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
