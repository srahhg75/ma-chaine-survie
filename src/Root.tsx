import React from "react";
import { Composition, staticFile } from "remotion";
import { EPISODES } from "./episodes/registre";
import { dureeSecondes, idComposition } from "./systeme/episode";
import { PropsEpisode } from "./systeme/EpisodeStandard";
import { FPS, HAUTEUR, LARGEUR } from "./systeme/format";
import { Alignement, ALIGNEMENT_VIDE } from "./systeme/mots";
import { BancEssai, IMAGES_PAR_POSE, POSES_BANC } from "./systeme/personnage/BancEssai";

const existe = async (chemin: string) => {
  try {
    return (await fetch(staticFile(chemin), { method: "HEAD" })).ok;
  } catch {
    return false;
  }
};

// Une Composition par épisode (id = "ep" + NNN-nom, ou `composition`), durée calculée depuis mots.json.
export const Racine: React.FC = () => (
  <>
    {EPISODES.map(({ donnees, Composant }) => (
      <Composition
        key={donnees.id}
        id={idComposition(donnees)}
        component={Composant}
        width={LARGEUR}
        height={HAUTEUR}
        fps={FPS}
        durationInFrames={FPS * 10}
        defaultProps={{ alignement: ALIGNEMENT_VIDE, audio: "voix", guide: false } as PropsEpisode}
        calculateMetadata={async ({ props }) => {
          const r = await fetch(staticFile(`${donnees.id}/mots.json`));
          if (!r.ok) throw new Error(`public/${donnees.id}/mots.json absent : lancer l'alignement de la voix`);
          const alignement: Alignement = await r.json();
          const audio: PropsEpisode["audio"] = props.audio === "aucun" ? "aucun" : (await existe(`${donnees.id}/mix.wav`)) ? "mix" : "voix";
          return {
            durationInFrames: Math.ceil(dureeSecondes(donnees, alignement) * FPS),
            props: { ...props, alignement, audio },
          };
        }}
      />
    ))}
    <Composition id="banc-essai" component={BancEssai} width={LARGEUR} height={HAUTEUR} fps={FPS} durationInFrames={IMAGES_PAR_POSE * POSES_BANC.length} />
  </>
);
