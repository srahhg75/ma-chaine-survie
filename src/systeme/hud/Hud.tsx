import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CleCameraResolue, etatCamera } from "../camera";
import { boiteHud } from "./boites";
import { Carton, Compte, Etiquette, Fiche, Inventaire, Montre, Moodles, Tactique } from "./Composants";
import { ElementHudResolu } from "./types";

// Valeurs courantes de la montre (l'heure avance aux ancres prévues)
export const valeursMontre = (e: Extract<ElementHudResolu, { type: "montre" }> & { fChangements?: number[] }, f: number) => {
  let { jour, heure, temperature } = e;
  (e.changements ?? []).forEach((c, i) => {
    if (e.fChangements && f >= e.fChangements[i]) {
      jour = c.jour ?? jour;
      heure = c.heure ?? heure;
      temperature = c.temperature ?? temperature;
    }
  });
  return { jour, heure, temperature };
};

const ENTREE = 7;
const SORTIE = 6;

export const Hud: React.FC<{ elements: ElementHudResolu[]; camera: CleCameraResolue[] }> = ({ elements, camera }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = etatCamera(camera, f, fps);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {elements
        .filter((e) => f >= e.fDe && f < e.fA)
        .map((e) => {
          const r = boiteHud(e, cam);
          const opacite = Math.min(
            interpolate(f - e.fDe, [0, ENTREE], [0, 1], { extrapolateRight: "clamp" }),
            interpolate(e.fA - f, [0, SORTIE], [0, 1], { extrapolateRight: "clamp" }),
          );
          const glisse = interpolate(f - e.fDe, [0, ENTREE], [18, 0], { extrapolateRight: "clamp" });
          const style: React.CSSProperties = { position: "absolute", inset: 0, opacity: e.type === "montre" ? 1 : opacite, transform: `translateY(${e.type === "montre" ? 0 : glisse}px)` };
          let contenu: React.ReactNode = null;
          switch (e.type) {
            case "montre":
              contenu = <Montre e={e} r={r} f={f} {...valeursMontre(e, f)} />;
              break;
            case "moodles":
              contenu = <Moodles e={e} r={r} f={f} />;
              break;
            case "fiche":
              contenu = <Fiche e={e} r={r} f={f} ancre={r.ancre} />;
              break;
            case "tactique":
              contenu = <Tactique e={e} r={r} f={f} />;
              break;
            case "inventaire":
              contenu = <Inventaire e={e} r={r} f={f} />;
              break;
            case "compte":
              contenu = <Compte e={e} r={r} f={f} />;
              break;
            case "etiquette":
              contenu = <Etiquette e={e} r={r} f={f} ancre={r.ancre} />;
              break;
            case "carton":
              contenu = <Carton e={e} r={r} f={f} />;
              break;
          }
          return (
            <div key={e.index} style={style}>
              {contenu}
            </div>
          );
        })}
    </AbsoluteFill>
  );
};
