import React from "react";
import { DonneesEpisode } from "../systeme/episode";
import { PropsEpisode } from "../systeme/EpisodeStandard";
import { donnees as d000 } from "./000-demo/donnees";
import { Episode as E000 } from "./000-demo/Episode";
import { donnees as d001 } from "./001-h72/donnees";
import { Episode as E001 } from "./001-h72/Episode";
import { donnees as d002 } from "./002-h72-froid/donnees";
import { Episode as E002 } from "./002-h72-froid/Episode";
import { donnees as d003 } from "./003-h72-lampe/donnees";
import { Episode as E003 } from "./003-h72-lampe/Episode";
import { donnees as d004 } from "./004-h72-conseil/donnees";
import { Episode as E004 } from "./004-h72-conseil/Episode";
import { donnees as d005 } from "./005-h72-cale/donnees";
import { Episode as E005 } from "./005-h72-cale/Episode";
import { donnees as dTestDA } from "./testda/donnees";
import { Episode as ETestDA } from "./testda/Episode";

// Registre des épisodes : chaque nouvel épisode s'ajoute ici (données + composant).
export const EPISODES: { donnees: DonneesEpisode; Composant: React.FC<PropsEpisode> }[] = [
  { donnees: d000, Composant: E000 },
  { donnees: dTestDA, Composant: ETestDA },
  { donnees: d001, Composant: E001 },
  { donnees: d002, Composant: E002 },
  { donnees: d003, Composant: E003 },
  { donnees: d004, Composant: E004 },
  { donnees: d005, Composant: E005 },
];
