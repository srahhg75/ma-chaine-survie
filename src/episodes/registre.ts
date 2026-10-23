import React from "react";
import { DonneesEpisode } from "../systeme/episode";
import { PropsEpisode } from "../systeme/EpisodeStandard";
import { donnees as d000 } from "./000-demo/donnees";
import { Episode as E000 } from "./000-demo/Episode";

// Registre des épisodes : chaque nouvel épisode s'ajoute ici (données + composant).
export const EPISODES: { donnees: DonneesEpisode; Composant: React.FC<PropsEpisode> }[] = [{ donnees: d000, Composant: E000 }];
