import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "./CameraRig";
import { DonneesEpisode, resoudreEpisode } from "./episode";
import { GuideZonesSures } from "./GuideZonesSures";
import { Hud } from "./hud/Hud";
import { Decor } from "./kit3d/Decor";
import { EclairageBase } from "./kit3d/Lumieres";
import { PostProcess } from "./kit3d/PostProcess";
import { Alignement } from "./mots";
import { Bonhomme } from "./personnage/Bonhomme";
import { etatPersonnage, opaciteFantome } from "./personnage/trajet";
import { Fantome } from "./kit3d/Fantome";
import { SousTitres } from "./SousTitres";

export type PropsEpisode = {
  alignement: Alignement;
  audio: "mix" | "voix" | "aucun"; // mix.wav (mixage final) si présent, sinon la voix seule
  guide: boolean; // calque des zones sûres (contrôle uniquement)
  brouillon?: boolean; // brouillon de la boucle qualité : sans occlusion ambiante (3× plus rapide)
};

const Personnages: React.FC<{ r: ReturnType<typeof resoudreEpisode> }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {r.personnages.map((p) => {
        const e = etatPersonnage(p, frame, fps);
        const corps = <Bonhomme key={p.id} pose={e.pose} position={e.position} orientation={e.orientation} lampe={e.lampe} taille={p.taille} variante={p.variante} />;
        return p.fantome ? (
          <Fantome key={p.id} opacite={opaciteFantome(p, frame, fps)}>
            {corps}
          </Fantome>
        ) : (
          corps
        );
      })}
    </>
  );
};

// Rendu standard d'un épisode décrit en données. `scene` = éléments 3D propres à l'épisode (bougies…).
export const EpisodeStandard: React.FC<PropsEpisode & { donnees: DonneesEpisode; scene?: React.ReactNode; eclairage?: React.ReactNode }> = ({
  donnees,
  alignement,
  audio,
  guide,
  brouillon,
  scene,
  eclairage,
}) => {
  const { fps, width, height } = useVideoConfig();
  const r = useMemo(() => resoudreEpisode(donnees, alignement, fps), [donnees, alignement, fps]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#050608" }}>
      <ThreeCanvas width={width} height={height} shadows gl={{ antialias: false, preserveDrawingBuffer: true }}>
        <CameraRig cles={r.camera} />
        {eclairage ?? <EclairageBase />}
        <Decor decor={donnees.decor} />
        <Personnages r={r} />
        {scene}
        <PostProcess {...donnees.post} {...(brouillon ? { occlusion: false } : {})} />
      </ThreeCanvas>
      <Hud elements={r.hud} camera={r.camera} />
      <SousTitres mots={alignement.mots} />
      {audio !== "aucun" && <Audio src={staticFile(`${donnees.id}/${audio === "mix" ? "mix" : "voix"}.wav`)} />}
      {guide && <GuideZonesSures />}
    </AbsoluteFill>
  );
};
