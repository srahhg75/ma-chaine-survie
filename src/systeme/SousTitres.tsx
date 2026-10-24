import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { boiteSousTitre, HUD, lignesSousTitre, NOM_SOUS_TITRE } from "./hud/boites";
import { JAUNE, ROUGE } from "./hud/Composants";
import { Y_SOUS_TITRES, ZONE_SURE } from "./format";
import { Bloc, blocsSousTitres, echelleMot, estChiffre, Mot, NARRATEUR, Phrase } from "./mots";
import { POLICE_TEXTE } from "./polices";

const sansAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

const COULEUR: Record<Mot["style"], string> = { normal: "#ffffff", ressource: JAUNE, danger: ROUGE };

// Couleur propre à chaque personnage qui parle (le narrateur reste en blanc) ; mots-clés toujours jaune / rouge
export const COULEUR_VOIX: Record<string, string> = { ines: "#8FE9FF", morel: "#FFB36B" };
const couleurVoix = (voix: string) => COULEUR_VOIX[sansAccents(voix).toLowerCase()] ?? "#E8D7FF";

const ressort = Easing.bezier(0.34, 1.56, 0.64, 1); // dépasse puis revient : effet « impact »

// Chiffre qui défile de 0 à sa valeur (≈ 0,35 s) : « 200 », « 11°C », « 20 »
const chiffreAnime = (texte: string, t: number) => {
  const m = texte.match(/^(\d+)(.*)$/);
  if (!m || t >= 10) return texte;
  const v = Math.round(parseInt(m[1], 10) * interpolate(t, [0, 10], [0, 1], { easing: Easing.out(Easing.cubic) }));
  return `${v}${m[2]}`;
};

// Sous-titres « rétention » : Montserrat 900 en majuscules, 2 à 4 mots par bloc, centrés à 60 % de la hauteur.
// Un mot n'apparaît QUE quand il est prononcé (analyse : ne jamais dévoiler la suite) et arrive avec un impact :
// - chiffre-ressource : géant, jaune lumineux, qui défile de 0 à sa valeur ;
// - danger : rouge, plus gros, qui tremble à son arrivée ; ressource : jaune lumineux ;
// - phrase-chute : 2 mots par bloc, très gros, léger zoom continu ;
// - réplique : couleur du personnage + son nom dans une pastille au-dessus.
// La place des mots à venir est réservée (le bloc ne bouge pas).
export const SousTitres: React.FC<{ mots: Mot[]; phrases?: Phrase[] }> = ({ mots, phrases = [] }) => {
  const frame = useCurrentFrame();
  const blocs = useMemo(() => blocsSousTitres(mots, phrases), [mots, phrases]);
  const bloc = blocs.find((b) => frame >= b.fDebut && frame < b.fFin);
  if (!bloc) return null;
  const lignes = lignesSousTitre(bloc);
  const t = frame - bloc.fDebut;
  const pop = interpolate(t, [0, 5], [0.86, 1], { easing: ressort, extrapolateRight: "clamp" });
  const zoomChute = bloc.chute ? interpolate(t, [0, 45], [1, 1.08], { extrapolateRight: "clamp" }) : 1;
  const parle = bloc.voix !== NARRATEUR;
  const base = parle ? couleurVoix(bloc.voix) : COULEUR.normal;
  const boite = boiteSousTitre(bloc);
  let k = 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {parle && <PastilleNom bloc={bloc} y={boite.y} t={t} />}
      <div
        style={{
          position: "absolute",
          top: Y_SOUS_TITRES,
          left: ZONE_SURE.gauche,
          width: ZONE_SURE.droite - ZONE_SURE.gauche,
          transform: `translateY(-50%) scale(${pop * zoomChute})`,
          textAlign: "center",
          fontFamily: POLICE_TEXTE,
          fontWeight: 900,
          fontSize: HUD.sousTitres.taille,
          textTransform: "uppercase",
          letterSpacing: -0.5,
          WebkitTextStroke: "12px rgba(0,0,0,0.92)",
          paintOrder: "stroke fill",
          textShadow: "0 8px 0 rgba(0,0,0,0.55), 0 12px 30px rgba(0,0,0,0.75)",
        }}
      >
        {lignes.map((ligne, i) => {
          const debutLigne = k;
          const hLigne = HUD.sousTitres.interligne * Math.max(...ligne.map((_, j) => echelleMot(bloc.mots[debutLigne + j], bloc)));
          return (
            <div key={i} style={{ lineHeight: `${hLigne}px`, height: hLigne }}>
              {ligne.map((texte, j) => {
                const m = bloc.mots[k++];
                return <MotAnime key={j} m={m} texte={texte} bloc={bloc} frame={frame} base={base} espace={j < ligne.length - 1} />;
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const MotAnime: React.FC<{ m: Mot; texte: string; bloc: Bloc; frame: number; base: string; espace: boolean }> = ({ m, texte, bloc, frame, base, espace }) => {
  const dit = frame >= m.fDebut;
  const t = frame - m.fDebut;
  const enCours = dit && frame < m.fFin;
  const chiffre = m.style === "ressource" && estChiffre(m);
  const fort = m.style !== "normal";
  // Arrivée : le mot « tombe » (plus gros puis taille normale) ; plus fort pour les mots-clés
  const depart = chiffre ? 1.9 : fort ? 1.5 : 1.25;
  const arrivee = dit ? interpolate(t, [0, 5], [depart, 1], { easing: ressort, extrapolateRight: "clamp" }) : 1;
  const monte = dit ? interpolate(t, [0, 4], [16, 0], { extrapolateRight: "clamp" }) : 0;
  // Danger : tremblement qui s'amortit en 0,4 s
  const amorti = m.style === "danger" && dit ? Math.max(0, 1 - t / 12) : 0;
  const dx = Math.sin(frame * 2.7) * 7 * amorti;
  const rot = Math.sin(frame * 1.9) * 3 * amorti;
  const couleur = m.style === "normal" ? base : COULEUR[m.style];
  const lueur = fort ? `, 0 0 ${chiffre ? 46 : 30}px ${couleur}AA` : "";
  return (
    <span
      style={{
        marginRight: espace ? "0.28em" : 0,
        color: couleur,
        opacity: dit ? interpolate(t, [0, 2], [0, 1], { extrapolateRight: "clamp" }) : 0,
        display: "inline-block",
        fontSize: `${echelleMot(m, bloc)}em`,
        transform: `translate(${dx}px, ${monte}px) rotate(${rot}deg) scale(${arrivee * (enCours ? 1.06 : 1)})`,
        textShadow: `0 8px 0 rgba(0,0,0,0.55), 0 12px 30px rgba(0,0,0,0.75)${lueur}`,
      }}
    >
      {chiffre && dit ? chiffreAnime(texte, t) : texte}
    </span>
  );
};

// Pastille du nom au-dessus d'une réplique (« INÈS », « MOREL »), qui claque en entrant
const PastilleNom: React.FC<{ bloc: Bloc; y: number; t: number }> = ({ bloc, y, t }) => {
  const s = interpolate(t, [0, 5], [0.4, 1], { easing: ressort, extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: (ZONE_SURE.gauche + ZONE_SURE.droite) / 2,
        height: NOM_SOUS_TITRE.h,
        transform: `translateX(-50%) rotate(-3deg) scale(${s})`,
        background: couleurVoix(bloc.voix),
        color: "#0b0b0f",
        fontFamily: POLICE_TEXTE,
        fontWeight: 900,
        fontSize: NOM_SOUS_TITRE.taille,
        lineHeight: `${NOM_SOUS_TITRE.h}px`,
        padding: "0 22px",
        borderRadius: 12,
        textTransform: "uppercase",
        letterSpacing: 2,
        boxShadow: "0 6px 0 rgba(0,0,0,0.55), 0 10px 24px rgba(0,0,0,0.6)",
      }}
    >
      {bloc.voix}
    </div>
  );
};
