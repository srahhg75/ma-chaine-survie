import React from "react";
import { AbsoluteFill } from "remotion";
import { HAUTEUR, LARGEUR, Y_SOUS_TITRES, ZONE_SURE } from "./format";

// Calque de contrôle (jamais dans le rendu final) : zones interdites en rouge, ligne des sous-titres en jaune.
export const GuideZonesSures: React.FC = () => {
  const rouge = "rgba(255,0,0,0.28)";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: LARGEUR, height: ZONE_SURE.haut, background: rouge }} />
      <div style={{ position: "absolute", top: ZONE_SURE.bas, left: 0, width: LARGEUR, height: HAUTEUR - ZONE_SURE.bas, background: rouge }} />
      <div style={{ position: "absolute", top: ZONE_SURE.haut, left: ZONE_SURE.droite, width: LARGEUR - ZONE_SURE.droite, height: ZONE_SURE.bas - ZONE_SURE.haut, background: rouge }} />
      <div style={{ position: "absolute", top: Y_SOUS_TITRES, left: 0, width: LARGEUR, height: 4, background: "yellow" }} />
    </AbsoluteFill>
  );
};
