import React from "react";
import { Episode2D, Kit2D } from "../../systeme/dessin2d/Episode2D";
import { PropsEpisode } from "../../systeme/EpisodeStandard";
import { Bague, Bureau, Drame, Gateau, GrosGateau, Hall } from "./decors";
import { donnees, scene } from "./donnees";
import { APPARENCES } from "./personnages";

const KIT: Kit2D = {
  scene,
  apparences: APPARENCES,
  decors: { hall: Hall, drame: Drame, bureau: Bureau, bague: Bague, gateau: GrosGateau },
  objets: { gateau: Gateau },
};

export const Episode: React.FC<PropsEpisode> = (props) => <Episode2D {...props} donnees={donnees} kit={KIT} />;
