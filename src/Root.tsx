import React from "react";
import { Composition } from "remotion";
import { Episode as Episode000, EPISODE as ID000, PropsEpisode } from "./episodes/000-test/Episode";
import { FPS, HAUTEUR, LARGEUR } from "./systeme/format";
import { chargerMots } from "./systeme/mots";

// Chaque épisode est enregistré ici (une Composition par épisode).
export const Racine: React.FC = () => (
  <>
    <Composition
      id={`ep${ID000}`}
      component={Episode000}
      width={LARGEUR}
      height={HAUTEUR}
      fps={FPS}
      durationInFrames={FPS * 10}
      defaultProps={{ mots: [], guide: false } as PropsEpisode}
      calculateMetadata={async ({ props }) => {
        const a = await chargerMots(ID000);
        return {
          durationInFrames: Math.ceil((a.duree + 0.5) * FPS),
          props: { ...props, mots: a.mots },
        };
      }}
    />
  </>
);
