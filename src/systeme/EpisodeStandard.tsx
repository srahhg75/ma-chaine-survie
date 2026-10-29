import { ThreeCanvas } from "@remotion/three";
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Freeze, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraRig } from "./CameraRig";
import { DonneesEpisode, EpisodeResolu, resoudreEpisode } from "./episode";
import { GuideZonesSures } from "./GuideZonesSures";
import { Hud } from "./hud/Hud";
import { Decor } from "./kit3d/DecorScene";
import { EclairageBase } from "./kit3d/Lumieres";
import { PostProcess } from "./kit3d/PostProcess";
import { Alignement } from "./mots";
import { Bonhomme } from "./personnage/Bonhomme";
import { Humain } from "./personnage/Humain";
import { etatPersonnage, opaciteFantome, present } from "./personnage/trajet";
import { instant } from "./timeline";
import { Retour } from "./Retour";
import { Fantome } from "./kit3d/Fantome";
import { SousTitres } from "./SousTitres";

export type PropsEpisode = {
  alignement: Alignement;
  audio: "mix" | "voix" | "aucun"; // mix.wav (mixage final) si présent, sinon la voix seule
  guide: boolean; // calque des zones sûres (contrôle uniquement)
  brouillon?: boolean; // brouillon de la boucle qualité : sans occlusion ambiante (3× plus rapide)
  sansTexte?: boolean; // image de couverture : ni HUD ni sous-titres
};

const Personnages: React.FC<{ r: ReturnType<typeof resoudreEpisode> }> = ({ r }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {r.personnages.map((p) => {
        if (p.invisible || !present(p, frame)) return null;
        const e = etatPersonnage(p, frame, fps);
        const corps =
          p.variante === "humain" || p.variante === "adulte" ? (
            <Humain key={p.id} variante={p.variante} pose={e.pose} position={e.position} orientation={e.orientation} lampe={e.lampe} puissanceLampe={p.puissanceLampe} visage={e.visage} taille={p.taille} apparence={e.apparence} />
          ) : (
            <Bonhomme key={p.id} pose={e.pose} position={e.position} orientation={e.orientation} lampe={e.lampe} puissanceLampe={p.puissanceLampe} visage={e.visage} taille={p.taille} variante={p.variante} />
          );
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

/*
 * Image qui RECULE pendant un STOP déclaré avec `depuis` : de `de` à `a`, la 3D rejoue la mauvaise branche à l'envers,
 * de `de` jusqu'à `depuis`, en accélérant (vitesse ×1 au départ, ≈ ×6 à la fin, comme le son de tools/mix.py).
 * Renvoie l'image 3D à afficher, ou null hors rembobinage. Le HUD et les sous-titres restent en temps réel.
 */
const ACCEL = 5; // vitesse finale = 1 + ACCEL
const K_ACCEL = 1.6;
export const imageRembobinee = (retours: EpisodeResolu["retours"], frame: number, fps: number): number | null => {
  const t = frame / fps;
  const r = retours.find((x) => x.depuis !== undefined && t >= x.de && t < x.a);
  if (!r || r.depuis === undefined) return null;
  const u = (t - r.de) / (r.a - r.de);
  const parcours = (u + (ACCEL * u ** (K_ACCEL + 1)) / (K_ACCEL + 1)) / (1 + ACCEL / (K_ACCEL + 1));
  return Math.round((r.de - parcours * (r.de - r.depuis)) * fps);
};

const Rembobinage: React.FC<{ retours: EpisodeResolu["retours"]; children: React.ReactNode }> = ({ retours, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = imageRembobinee(retours, frame, fps);
  return (
    <Freeze frame={f ?? frame} active={f !== null}>
      {children}
    </Freeze>
  );
};

// Rendu standard d'un épisode décrit en données. `scene` = éléments 3D propres à l'épisode (bougies…).
export const EpisodeStandard: React.FC<PropsEpisode & { donnees: DonneesEpisode; scene?: React.ReactNode; eclairage?: React.ReactNode }> = ({
  donnees,
  alignement,
  audio,
  guide,
  brouillon,
  sansTexte,
  scene,
  eclairage,
}) => {
  const { fps, width, height } = useVideoConfig();
  const r = useMemo(() => resoudreEpisode(donnees, alignement, fps), [donnees, alignement, fps]);
  const retours = useMemo(() => (donnees.retours ?? []).map((x) => [instant(x.de, alignement), instant(x.a, alignement)] as [number, number]), [donnees, alignement]);
  return (
    <AbsoluteFill style={{ backgroundColor: "#050608" }}>
      <Retour retours={retours}>
        <Rembobinage retours={r.retours}>
          <ThreeCanvas width={width} height={height} shadows gl={{ antialias: false, preserveDrawingBuffer: true }}>
            <CameraRig cles={r.camera} />
            {eclairage ?? <EclairageBase />}
            <Decor decor={donnees.decor} />
            <Personnages r={r} />
            {scene}
            <PostProcess {...donnees.post} {...(brouillon ? { occlusion: false } : {})} />
          </ThreeCanvas>
        </Rembobinage>
      </Retour>
      {!sansTexte && <Hud elements={r.hud} camera={r.camera} />}
      {!sansTexte && <SousTitres mots={alignement.mots} phrases={alignement.phrases} />}
      {audio !== "aucun" && <Audio src={staticFile(`${donnees.id}/${audio === "mix" ? "mix" : "voix"}.wav`)} />}
      {guide && <GuideZonesSures />}
    </AbsoluteFill>
  );
};
