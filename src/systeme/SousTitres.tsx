import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LARGEUR, Y_SOUS_TITRES, ZONE_SURE } from "./format";
import { grouperMots, Mot } from "./mots";
import { chargerPolice } from "./polices";

const fontFamily = chargerPolice("Anton");

const COULEUR_ACTIVE = "#ffcf3f";

// Sous-titres mot à mot, centrés à 60 % de la hauteur, le mot prononcé surligné.
export const SousTitres: React.FC<{ mots: Mot[] }> = ({ mots }) => {
  const frame = useCurrentFrame();
  const groupes = useMemo(() => grouperMots(mots), [mots]);

  // Le groupe reste affiché jusqu'au début du suivant (pas de clignotement entre deux phrases)
  const idx = groupes.findIndex((g, i) => {
    const fin = groupes[i + 1] ? groupes[i + 1][0].fDebut : g[g.length - 1].fFin + 15;
    return frame >= g[0].fDebut && frame < fin;
  });
  if (idx < 0) return null;
  const groupe = groupes[idx];
  const entree = interpolate(frame - groupe[0].fDebut, [0, 4], [0.85, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: Y_SOUS_TITRES,
          left: ZONE_SURE.gauche,
          width: ZONE_SURE.droite - ZONE_SURE.gauche,
          transform: `translateY(-50%) scale(${entree})`,
          textAlign: "center",
          fontFamily,
          fontSize: LARGEUR * 0.085,
          lineHeight: 1.1,
          textTransform: "uppercase",
          color: "white",
          WebkitTextStroke: "10px black",
          paintOrder: "stroke fill",
          textShadow: "0 6px 18px rgba(0,0,0,0.6)",
        }}
      >
        {groupe.map((m, i) => (
          <span key={i} style={{ color: frame >= m.fDebut && frame < m.fFin ? COULEUR_ACTIVE : "white" }}>
            {m.mot}
            {i < groupe.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
