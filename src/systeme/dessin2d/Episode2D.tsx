import React, { useMemo } from "react";
import { AbsoluteFill, Audio, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DonneesEpisode, resoudreEpisode } from "../episode";
import { PropsEpisode } from "../EpisodeStandard";
import { GuideZonesSures } from "../GuideZonesSures";
import { Hud } from "../hud/Hud";
import { POLICE_TEXTE } from "../polices";
import { SousTitres } from "../SousTitres";
import { image } from "../timeline";
import { Personnage2D } from "./Personnage2D";
import { cadreA, DonneesScene2D, ECRAN_CADRE, etatObjet, etatPerso, ouvertureBouche, present, resoudrePlans } from "./scene2d";
import { Apparence2D } from "./types2d";

/*
 * Rendu d'un épisode dessiné en 2D (style webtoon) : décor + personnages + objets dans une « scène » 1080×1920
 * filmée par la caméra 2D (plans), effets (choc, tremblement, flash, éclats), onomatopées, puis le HUD (carton A/B,
 * téléphone), les sous-titres et le son du moteur commun.
 */
export type PropsDecor = { f: number; fps: number; etats: Record<string, number> }; // etats : ancres résolues en images
export type PropsObjet = { etat: string; f: number };

export type Kit2D = {
  scene: DonneesScene2D;
  apparences: Record<string, Apparence2D>;
  decors: Record<string, React.FC<PropsDecor>>;
  objets: Record<string, React.FC<PropsObjet>>;
};

// Caméra factice pour le HUD (carton et téléphone ne dépendent pas de la caméra)
const CAMERA_HUD = [{ position: [0, 1.6, 6] as [number, number, number], cible: [0, 1, 0] as [number, number, number], fov: 50, deplacement: 0, coupe: false, derive: 0, fArrivee: 0, fDepart: 0 }];

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 1000, 7);

export const Episode2D: React.FC<PropsEpisode & { donnees: DonneesEpisode; kit: Kit2D }> = ({ donnees, kit, alignement: al, audio, guide, sansTexte }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const r = useMemo(() => resoudreEpisode(donnees, al, fps), [donnees, al, fps]);
  const plans = useMemo(() => resoudrePlans(kit.scene.plans, al, fps), [kit, al, fps]);
  const etats = useMemo(() => Object.fromEntries(Object.entries(kit.scene.etats ?? {}).map(([k, a]) => [k, image(a, al, fps)])), [kit, al, fps]);
  const cadre = cadreA(plans, f);

  // effets en cours
  const effets = kit.scene.effets.map((e) => ({ ...e, f0: image(e.a, al, fps), n: Math.round((e.duree ?? (e.type === "flash" ? 0.3 : 0.6)) * fps) })).filter((e) => f >= e.f0 && f < e.f0 + e.n);
  const tremble = effets.find((e) => e.type === "tremble" || e.type === "choc");
  const u = (e: { f0: number; n: number }) => (f - e.f0) / e.n;
  const secousse = tremble ? (1 - u(tremble)) * (tremble.type === "choc" ? 6 : 12) : 0;
  const sx = secousse * (random(`sx${f}`) * 2 - 1);
  const sy = secousse * (random(`sy${f}`) * 2 - 1);
  const choc = effets.find((e) => e.type === "choc");
  const punch = choc ? 1 + 0.06 * (1 - u(choc)) : 1;
  const zoom = cadre.zoom * punch;
  const camera = `translate(${ECRAN_CADRE.x + sx} ${ECRAN_CADRE.y + sy}) scale(${zoom}) translate(${-cadre.x} ${-cadre.y})`;
  const coupe = plans.find((p) => p.coupe && f >= p.fArrivee && f < p.fArrivee + 5);

  const Decor = kit.decors[cadre.decor];
  if (!Decor) throw new Error(`Décor 2D inconnu : ${cadre.decor}`);
  const persos = kit.scene.persos
    .filter((p) => p.decor === cadre.decor && present(p, al, fps, f))
    .map((p) => ({ p, e: etatPerso(p, al, fps, f) }))
    .sort((a, b) => a.e.y - b.e.y);
  const objets = kit.scene.objets.filter((o) => o.decor === cadre.decor && present(o, al, fps, f)).map((o) => ({ o, e: etatObjet(o, kit.scene.persos, al, fps, f) }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#140f14" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <defs>
          <filter id="ombre2d">
            <feColorMatrix type="matrix" values="0.12 0 0 0 0.03  0 0.1 0 0 0.03  0 0 0.14 0 0.05  0 0 0 1 0" />
          </filter>
        </defs>
        <g transform={camera}>
          <Decor f={f} fps={fps} etats={etats} />
          {persos.map(({ p, e }) => {
            const cycle = 3.4 + (hash(p.id) % 13) / 10;
            const cligne = (t + (hash(p.id) % 30) / 10) % cycle < 0.1;
            const bob = e.marche ? -10 * Math.abs(Math.sin(t * Math.PI * 2.4)) * e.echelle : 0;
            const corps = (
              <Personnage2D
                key={p.id}
                id={p.id}
                a={kit.apparences[p.apparence]}
                x={e.x}
                y={e.y + bob}
                echelle={e.echelle}
                expr={e.expr}
                brasG={e.brasG}
                brasD={e.brasD}
                regard={e.regard}
                bouche={ouvertureBouche(p.voix, e.rit, al, t)}
                yeuxFermes={cligne && !p.ombre}
                pale={e.pale}
              />
            );
            return p.ombre ? (
              <g key={p.id} filter="url(#ombre2d)">
                {corps}
              </g>
            ) : p.figurant ? (
              <g key={p.id} opacity={0.8}>
                {corps}
              </g>
            ) : (
              corps
            );
          })}
          {objets.map(({ o, e }) => {
            const O = kit.objets[o.type];
            if (!O) throw new Error(`Objet 2D inconnu : ${o.type}`);
            return (
              <g key={o.id} transform={`translate(${e.x} ${e.y}) rotate(${e.rot})`}>
                <O etat={e.etat} f={f} />
              </g>
            );
          })}
        </g>
        {effets.map((e, i) => (
          <Effet key={i} type={e.type} u={u(e)} f={f} />
        ))}
        {kit.scene.onomatopees
          .map((o) => ({ ...o, f0: image(o.de, al, fps), f1: image(o.a, al, fps) }))
          .filter((o) => f >= o.f0 && f < o.f1)
          .map((o, i) => {
            const pop = interpolate(f - o.f0, [0, 4, 7], [0.4, 1.15, 1], { extrapolateRight: "clamp" });
            const sortie = interpolate(o.f1 - f, [0, 4], [0, 1], { extrapolateRight: "clamp" });
            return (
              <text
                key={i}
                x={o.x}
                y={o.y}
                textAnchor="middle"
                transform={`rotate(${o.rot ?? -8} ${o.x} ${o.y}) translate(${o.x} ${o.y}) scale(${pop}) translate(${-o.x} ${-o.y})`}
                fontFamily={POLICE_TEXTE}
                fontWeight={900}
                fontSize={o.taille ?? 96}
                fill={o.couleur ?? "#ffffff"}
                stroke="#2a1e2c"
                strokeWidth={14}
                strokeLinejoin="round"
                paintOrder="stroke"
                opacity={sortie}
              >
                {o.texte}
              </text>
            );
          })}
        {coupe && <rect x={0} y={0} width={1080} height={1920} fill="#fff" opacity={0.45 * (1 - (f - coupe.fArrivee) / 5)} />}
        <radialGradient id="vignette2d" cx="0.5" cy="0.42" r="0.8">
          <stop offset="0.62" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.42} />
        </radialGradient>
        <rect x={0} y={0} width={1080} height={1920} fill="url(#vignette2d)" />
      </svg>
      {!sansTexte && <Hud elements={r.hud} camera={CAMERA_HUD} />}
      {!sansTexte && <SousTitres mots={al.mots} phrases={al.phrases} />}
      {audio !== "aucun" && <Audio src={staticFile(`${donnees.id}/${audio === "mix" ? "mix" : "voix"}.wav`)} />}
      {guide && <GuideZonesSures />}
    </AbsoluteFill>
  );
};

// Effets plein écran (repère écran)
const Effet: React.FC<{ type: string; u: number; f: number }> = ({ type, u, f }) => {
  if (type === "flash") return <rect x={0} y={0} width={1080} height={1920} fill="#fff" opacity={0.8 * (1 - u)} />;
  if (type === "choc") {
    // traits de vitesse rayonnants sur les bords (manga), qui s'effacent
    const traits = Array.from({ length: 46 }, (_, i) => {
      const a = (i / 46) * Math.PI * 2 + random(`a${i}`) * 0.08;
      const r0 = 520 + random(`r${i}`) * 260;
      const cx = 540;
      const cy = 760;
      return `M ${cx + Math.cos(a) * r0} ${cy + Math.sin(a) * r0 * 1.7} L ${cx + Math.cos(a - 0.02) * 1500} ${cy + Math.sin(a - 0.02) * 2600} L ${cx + Math.cos(a + 0.02) * 1500} ${cy + Math.sin(a + 0.02) * 2600} Z`;
    });
    return (
      <g opacity={0.75 * (1 - u)}>
        {traits.map((d, i) => (
          <path key={i} d={d} fill={i % 3 ? "#1b1420" : "#ffffff"} />
        ))}
      </g>
    );
  }
  if (type === "eclat") {
    // éclats dorés qui scintillent (luxe)
    return (
      <g>
        {Array.from({ length: 9 }, (_, i) => {
          const x = 120 + random(`ex${i}`) * 760;
          const y = 260 + random(`ey${i}`) * 820;
          const k = Math.max(0, Math.sin((u * 2 + random(`ep${i}`)) * Math.PI)) * (24 + random(`es${i}`) * 26);
          return <path key={i} d={`M ${x} ${y - k} Q ${x} ${y} ${x + k} ${y} Q ${x} ${y} ${x} ${y + k} Q ${x} ${y} ${x - k} ${y} Q ${x} ${y} ${x} ${y - k} Z`} fill="#fff6d6" opacity={0.9} />;
        })}
      </g>
    );
  }
  return null;
};
