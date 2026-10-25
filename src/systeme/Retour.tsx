import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp } from "./maths";
import { POLICE_TEXTE } from "./polices";

/*
 * Signal « STOP » de la chaîne (retour en arrière après la mauvaise branche d'un choix A/B) :
 * l'image passe en noir et blanc, tremble et se déchire comme une bande qu'on rembobine, et le mot STOP
 * s'affiche en grand avec ◀◀ (au-dessus de la bande des sous-titres). Entrée et sortie en 0,15 s.
 * `retours` : intervalles [début, fin] en secondes (DonneesEpisode.retours).
 */
export const Retour: React.FC<{ retours: [number, number][]; children: React.ReactNode }> = ({ retours, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const actif = retours.find(([a, b]) => t >= a - 0.15 && t < b + 0.15);
  const k = actif ? clamp(Math.min((t - actif[0] + 0.15) / 0.15, (actif[1] + 0.15 - t) / 0.15)) : 0;
  if (k <= 0) return <>{children}</>;
  const secousse = (random(`retour-x${f}`) - 0.5) * 28 * k;
  // bandes horizontales décalées (bande magnétique), qui défilent vers le haut
  const bandes = Array.from({ length: 4 }, (_, i) => ({
    y: ((random(`retour-b${i}`) * 1920 - t * 2400 * (1 + i * 0.3)) % 1920 + 1920) % 1920,
    h: 14 + random(`retour-h${i}`) * 40,
    dx: (random(`retour-d${i}${Math.floor(f / 2)}`) - 0.5) * 90,
  }));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `grayscale(${k}) contrast(${1 + 0.35 * k}) brightness(${1 + 0.12 * k})`, transform: `translateX(${secousse}px)` }}>
        {children}
      </AbsoluteFill>
      {/* lignes de balayage et bandes déchirées */}
      <AbsoluteFill style={{ opacity: 0.35 * k, background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 2px, transparent 2px, transparent 5px)" }} />
      {bandes.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: b.dx, right: -b.dx, top: b.y, height: b.h, background: "rgba(235,235,235,0.16)", opacity: k, mixBlendMode: "screen" }} />
      ))}
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 80,
          width: 840,
          textAlign: "center",
          fontFamily: POLICE_TEXTE,
          fontWeight: 900,
          fontSize: 190,
          letterSpacing: 6,
          color: "#ffffff",
          opacity: k,
          textShadow: "0 0 18px rgba(0,0,0,0.9), 6px 6px 0 #000",
          transform: `scale(${1 + 0.06 * (1 - k)})`,
        }}
      >
        ◀◀ STOP
      </div>
    </AbsoluteFill>
  );
};
