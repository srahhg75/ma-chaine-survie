import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { HUD, lignesSousTitre } from "./hud/boites";
import { JAUNE, ROUGE } from "./hud/Composants";
import { Y_SOUS_TITRES, ZONE_SURE } from "./format";
import { blocsSousTitres, Mot } from "./mots";
import { POLICE_TEXTE } from "./polices";

const GRIS = "#8d9096";
const COULEUR: Record<Mot["style"], string> = { normal: "#ffffff", ressource: JAUNE, danger: ROUGE };

// Sous-titres karaoké : Montserrat 900 en majuscules, 2 à 4 mots par bloc, centrés à 60 % de la hauteur.
// Chaque mot passe du gris à sa couleur (blanc, jaune ressource, rouge danger) au moment où il est prononcé.
export const SousTitres: React.FC<{ mots: Mot[] }> = ({ mots }) => {
  const frame = useCurrentFrame();
  const blocs = useMemo(() => blocsSousTitres(mots), [mots]);
  const bloc = blocs.find((b) => frame >= b.fDebut && frame < b.fFin);
  if (!bloc) return null;
  const lignes = lignesSousTitre(bloc);
  const pop = interpolate(frame - bloc.fDebut, [0, 3, 6], [0.9, 1.04, 1], { extrapolateRight: "clamp" });
  let k = 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: Y_SOUS_TITRES,
          left: ZONE_SURE.gauche,
          width: ZONE_SURE.droite - ZONE_SURE.gauche,
          transform: `translateY(-50%) scale(${pop})`,
          textAlign: "center",
          fontFamily: POLICE_TEXTE,
          fontWeight: 900,
          fontSize: HUD.sousTitres.taille,
          lineHeight: `${HUD.sousTitres.interligne}px`,
          textTransform: "uppercase",
          letterSpacing: -0.5,
          WebkitTextStroke: "12px rgba(0,0,0,0.92)",
          paintOrder: "stroke fill",
          textShadow: "0 8px 0 rgba(0,0,0,0.55), 0 12px 30px rgba(0,0,0,0.75)",
        }}
      >
        {lignes.map((ligne, i) => (
          <div key={i}>
            {ligne.map((texte, j) => {
              const m = bloc.mots[k++];
              const dit = frame >= m.fDebut;
              const enCours = dit && frame < m.fFin;
              return (
                <span key={j} style={{ color: dit ? COULEUR[m.style] : GRIS, display: "inline-block", transform: `scale(${enCours ? 1.06 : 1})` }}>
                  {texte}
                  {j < ligne.length - 1 ? " " : ""}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
