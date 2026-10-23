import React from "react";
import { EpisodeStandard, PropsEpisode } from "../../systeme/EpisodeStandard";
import { Bougie } from "../../systeme/kit3d/Lumieres";
import { donnees } from "./donnees";

// Éléments 3D propres à l'épisode : la bougie sur la table.
export const Episode: React.FC<PropsEpisode> = (props) => (
  <EpisodeStandard {...props} donnees={donnees} scene={<Bougie position={[0.75, 0.76, -0.25]} graine="demo" />} />
);
