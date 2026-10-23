import React from "react";
import { DonneesEpisode } from "../systeme/episode";
import { PropsEpisode } from "../systeme/EpisodeStandard";
import { donnees as d000 } from "./000-demo/donnees";
import { Episode as E000 } from "./000-demo/Episode";
import { donnees as d001 } from "./001-h72/donnees";
import { Episode as E001 } from "./001-h72/Episode";
import { donnees as dTestDA } from "./testda/donnees";
import { Episode as ETestDA } from "./testda/Episode";

// Registre des épisodes : chaque nouvel épisode s'ajoute ici (données + composant).
export const EPISODES: { donnees: DonneesEpisode; Composant: React.FC<PropsEpisode> }[] = [
  { donnees: d000, Composant: E000 },
  { donnees: dTestDA, Composant: ETestDA },
  { donnees: d001, Composant: E001 },
];
