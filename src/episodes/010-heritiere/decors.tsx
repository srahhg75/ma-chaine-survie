import React from "react";
import { interpolate } from "remotion";
import { PropsDecor, PropsObjet } from "../../systeme/dessin2d/Episode2D";
import { TRAIT } from "../../systeme/dessin2d/Personnage2D";
import { POLICE_TEXTE } from "../../systeme/polices";

/*
 * Décors et objets 2D de « L'héritière cachée » (repère scène 1080×1920, sol du hall à y = 1000, personnages vers y = 1140).
 */

const Degrades: React.FC = () => (
  <defs>
    <linearGradient id="h-mur" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#d9c6a6" />
      <stop offset="1" stopColor="#efe3cc" />
    </linearGradient>
    <linearGradient id="h-sol" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#e9dfd0" />
      <stop offset="1" stopColor="#c8b79e" />
    </linearGradient>
    <linearGradient id="h-or" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#b98a35" />
      <stop offset="0.45" stopColor="#f3d68a" />
      <stop offset="1" stopColor="#a87a2c" />
    </linearGradient>
    <linearGradient id="h-rayon" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity={0.55} />
      <stop offset="1" stopColor="#fff" stopOpacity={0} />
    </linearGradient>
    <radialGradient id="h-cabine" cx="0.5" cy="0.4" r="0.7">
      <stop offset="0" stopColor="#fffbe8" />
      <stop offset="1" stopColor="#f1cf7d" />
    </radialGradient>
  </defs>
);

const Plante: React.FC<{ x: number }> = ({ x }) => (
  <g>
    {[-40, -20, 0, 20, 40].map((a) => (
      <ellipse key={a} cx={x + a * 0.8} cy={880 - Math.abs(a) * 0.5} rx={18} ry={70} transform={`rotate(${a} ${x} 960)`} fill="#3f7d4e" stroke="#24452c" strokeWidth={3} />
    ))}
    <path d={`M ${x - 40} 950 L ${x + 40} 950 L ${x + 30} 1030 L ${x - 30} 1030 Z`} fill="#2b2b30" stroke="#151518" strokeWidth={3} />
  </g>
);

// Hall de la tour Valmont : ascenseur doré au centre (portes qui s'ouvrent à l'état « portes »), cadran d'étage
// qui descend de 40 à 0 entre « etage » et « portes ».
export const Hall: React.FC<PropsDecor> = ({ f, fps, etats }) => {
  const ouverture = etats.portes !== undefined ? interpolate(f, [etats.portes, etats.portes + 0.8 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const etage = etats.etage !== undefined && etats.portes !== undefined ? Math.round(interpolate(f, [etats.etage, etats.portes], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) : 40;
  const lu = Math.sin(ouverture * Math.PI * 0.5);
  return (
    <g>
      <Degrades />
      <rect x={-400} y={-200} width={1880} height={1220} fill="url(#h-mur)" />
      {/* baies vitrées : la ville */}
      {[-1, 0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={40 + i * 260} y={60} width={220} height={300} fill="#a9c6dd" stroke="#8a7656" strokeWidth={8} />
          <rect x={60 + i * 260} y={220} width={50} height={140} fill="#86a6c2" />
          <rect x={120 + i * 260} y={170} width={40} height={190} fill="#7f9fbc" />
          <rect x={170 + i * 260} y={250} width={60} height={110} fill="#8cabc6" />
        </g>
      ))}
      <rect x={-400} y={360} width={1880} height={22} fill="#8a7656" />
      {[90, 990].map((x) => (
        <g key={x}>
          <rect x={x - 45} y={382} width={90} height={618} fill="#cbb38c" stroke="#8a7656" strokeWidth={4} />
          <rect x={x - 45} y={382} width={22} height={618} fill="#e4d2b1" />
          <rect x={x - 52} y={382} width={104} height={20} fill="url(#h-or)" />
        </g>
      ))}
      <text x={540} y={455} textAnchor="middle" fontFamily={POLICE_TEXTE} fontWeight={800} fontSize={54} letterSpacing={18} fill="url(#h-or)" stroke="#7a5a20" strokeWidth={1.5}>
        VALMONT
      </text>
      {/* cadran d'étage */}
      <rect x={480} y={482} width={120} height={60} rx={10} fill="#1d1712" stroke="url(#h-or)" strokeWidth={5} />
      <text x={540} y={528} textAnchor="middle" fontFamily={POLICE_TEXTE} fontWeight={900} fontSize={42} fill="#ffb347">
        {etage === 0 ? "RDC" : etage}
      </text>
      <path d={`M 612 ${505} l 12 -14 l 12 14 Z`} fill={etage < 40 && etage > 0 ? "#ffb347" : "#4a3a2a"} transform="rotate(180 624 500)" />
      {/* ascenseur central */}
      <rect x={370} y={560} width={340} height={440} fill="#6b5534" />
      <rect x={385} y={572} width={310} height={428} fill="url(#h-cabine)" />
      <rect x={385} y={572} width={310} height={428} fill="#fff" opacity={0.35 * lu} />
      <rect x={385 - 150 * lu} y={572} width={153} height={428} fill="url(#h-or)" stroke="#7a5a20" strokeWidth={2} />
      <rect x={542 + 150 * lu} y={572} width={153} height={428} fill="url(#h-or)" stroke="#7a5a20" strokeWidth={2} />
      {/* montants qui masquent les portes ouvertes */}
      <rect x={300} y={560} width={85} height={440} fill="#d9c6a6" />
      <rect x={695} y={560} width={85} height={440} fill="#d9c6a6" />
      <rect x={362} y={556} width={356} height={14} fill="url(#h-or)" />
      <rect x={362} y={556} width={14} height={444} fill="url(#h-or)" />
      <rect x={704} y={556} width={14} height={444} fill="url(#h-or)" />
      <Plante x={185} />
      <Plante x={895} />
      {/* sol en marbre */}
      <rect x={-400} y={1000} width={1880} height={1100} fill="url(#h-sol)" />
      {[-1600, -1000, -500, -150, 150, 500, 1000, 1600].map((dx) => (
        <line key={dx} x1={540 + dx * 0.25} y1={1000} x2={540 + dx * 1.3} y2={1920} stroke="#b8a68a" strokeWidth={3} opacity={0.6} />
      ))}
      {[1060, 1160, 1300, 1500, 1780].map((y) => (
        <line key={y} x1={-400} y1={y} x2={1480} y2={y} stroke="#b8a68a" strokeWidth={3} opacity={0.6} />
      ))}
      <path d="M 0 0 L 260 0 L 760 1300 L 420 1300 Z" fill="url(#h-rayon)" opacity={0.45} />
      <path d="M 380 0 L 470 0 L 980 1250 L 860 1250 Z" fill="url(#h-rayon)" opacity={0.3} />
    </g>
  );
};

// Fond « drame » (accroche, flash-forward) : violet sombre, rayons rouges, comme une case de webtoon
export const Drame: React.FC<PropsDecor> = ({ f }) => (
  <g>
    <defs>
      <radialGradient id="d-fond" cx="0.5" cy="0.38" r="0.75">
        <stop offset="0" stopColor="#6b2a4a" />
        <stop offset="0.6" stopColor="#2a1430" />
        <stop offset="1" stopColor="#120a16" />
      </radialGradient>
    </defs>
    <rect x={-400} y={-200} width={1880} height={2300} fill="url(#d-fond)" />
    {Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2 + f * 0.002;
      return <path key={i} d={`M 540 700 L ${540 + Math.cos(a - 0.03) * 1800} ${700 + Math.sin(a - 0.03) * 1800} L ${540 + Math.cos(a + 0.03) * 1800} ${700 + Math.sin(a + 0.03) * 1800} Z`} fill={i % 2 ? "#c8203a" : "#ffffff"} opacity={i % 2 ? 0.16 : 0.05} />;
    })}
    <ellipse cx={540} cy={1150} rx={520} ry={60} fill="#000" opacity={0.35} />
  </g>
);

// Bureau du 40e étage : grande baie sur la ville, au soleil couchant ; Adrien n'y est qu'une silhouette
export const Bureau: React.FC<PropsDecor> = () => (
  <g>
    <defs>
      <linearGradient id="b-ciel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3b2a4f" />
        <stop offset="0.6" stopColor="#c8644a" />
        <stop offset="1" stopColor="#f2a65a" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-200} width={1880} height={2300} fill="#1c1622" />
    <rect x={60} y={180} width={960} height={900} fill="url(#b-ciel)" />
    {[[80, 640, 90], [190, 520, 70], [280, 700, 110], [410, 590, 80], [520, 470, 60], [600, 660, 120], [740, 560, 80], [840, 690, 100], [940, 600, 70]].map(([x, y, l], i) => (
      <rect key={i} x={x} y={y} width={l} height={1080 - y} fill="#2a1f33" opacity={0.85} />
    ))}
    {[60, 380, 700, 1020].map((x) => (
      <rect key={x} x={x - 10} y={170} width={20} height={920} fill="#120d16" />
    ))}
    <rect x={40} y={1080} width={1000} height={30} fill="#120d16" />
    <rect x={-400} y={1110} width={1880} height={1000} fill="#241c2a" />
    {/* bureau */}
    <rect x={640} y={1010} width={380} height={30} fill="#3a2a22" stroke="#120d16" strokeWidth={4} />
    <rect x={660} y={1040} width={30} height={110} fill="#2a1d17" />
    <rect x={970} y={1040} width={30} height={110} fill="#2a1d17" />
  </g>
);

// Gros plan : la main de Clara serre sa vieille bague gravée d'un A
export const Bague: React.FC<PropsDecor> = ({ f }) => {
  const serre = 1 + 0.02 * Math.sin(f / 4);
  return (
    <g>
      <defs>
        <radialGradient id="g-fond" cx="0.5" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#f6ead6" />
          <stop offset="1" stopColor="#bfa47c" />
        </radialGradient>
        <linearGradient id="g-or" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0b8" />
          <stop offset="0.5" stopColor="#e2b04a" />
          <stop offset="1" stopColor="#9a6a20" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-200} width={1880} height={2300} fill="url(#g-fond)" />
      <g transform={`translate(540 760) scale(${serre}) translate(-540 -760)`}>
        {/* manche crème */}
        <path d="M 120 1150 L 330 860 L 520 990 L 330 1260 Z" fill="#efe5d6" stroke={TRAIT} strokeWidth={8} strokeLinejoin="round" />
        <path d="M 330 860 L 380 895 L 190 1180 L 140 1150 Z" fill="#d2c3ad" />
        {/* poing */}
        <path d="M 360 900 C 420 760, 560 640, 700 660 C 820 680, 860 780, 830 880 C 800 980, 700 1040, 560 1040 C 470 1040, 400 1000, 360 900 Z" fill="#f6dccb" stroke={TRAIT} strokeWidth={8} strokeLinejoin="round" />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M ${600 + i * 70} ${690 + i * 12} Q ${640 + i * 70} ${820} ${600 + i * 66} ${960 - i * 10}`} fill="none" stroke={TRAIT} strokeWidth={5} opacity={0.7} />
        ))}
        <path d="M 400 900 C 460 860, 540 870, 590 930" fill="none" stroke={TRAIT} strokeWidth={6} />
        <path d="M 760 700 C 830 740, 850 820, 820 900 C 800 950, 760 980, 730 990 L 760 700 Z" fill="#e3b5a0" />
        {/* bague */}
        <path d="M 648 704 Q 700 690 724 712 L 712 990 Q 680 1002 650 994 Z" fill="url(#g-or)" stroke={TRAIT} strokeWidth={6} strokeLinejoin="round" />
        <ellipse cx={684} cy={830} rx={52} ry={62} fill="url(#g-or)" stroke={TRAIT} strokeWidth={6} />
        <text x={684} y={858} textAnchor="middle" fontFamily={POLICE_TEXTE} fontWeight={900} fontSize={82} fill="#7a4e14" stroke="#fff3c4" strokeWidth={2}>
          A
        </text>
        <path d="M 660 790 q 10 -14 28 -16" stroke="#fffbe8" strokeWidth={7} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- objets

// Gâteau d'anniversaire sur une assiette, bougies « 3 » et « 5 » ; état « ecrase » = renversé par terre
export const Gateau: React.FC<PropsObjet> = ({ etat, f }) => {
  if (etat === "ecrase")
    return (
      <g>
        <path d="M -95 6 C -80 -26, -40 -30, -10 -22 C 20 -36, 70 -26, 92 0 C 110 18, 60 24, 0 22 C -60 26, -110 22, -95 6 Z" fill="#f7c6d4" stroke={TRAIT} strokeWidth={4} />
        <path d="M -60 -4 C -40 -20, 0 -16, 20 -8 C 40 -18, 60 -10, 70 2" fill="none" stroke="#fffaf5" strokeWidth={10} strokeLinecap="round" />
        <circle cx={-30} cy={-6} r={7} fill="#c8203a" stroke={TRAIT} strokeWidth={2} />
        <circle cx={40} cy={2} r={7} fill="#c8203a" stroke={TRAIT} strokeWidth={2} />
        <ellipse cx={-120} cy={14} rx={40} ry={10} fill="#ffffff" stroke={TRAIT} strokeWidth={3} transform="rotate(-12 -120 14)" />
        <text x={70} y={-18} transform="rotate(70 70 -18)" fontFamily={POLICE_TEXTE} fontWeight={900} fontSize={26} fill="#5aa0d8" stroke={TRAIT} strokeWidth={2}>
          3
        </text>
        <text x={-70} y={-8} transform="rotate(-60 -70 -8)" fontFamily={POLICE_TEXTE} fontWeight={900} fontSize={26} fill="#5aa0d8" stroke={TRAIT} strokeWidth={2}>
          5
        </text>
      </g>
    );
  const flamme = 1 + 0.15 * Math.sin(f * 0.9);
  return (
    <g>
      <ellipse cx={0} cy={0} rx={62} ry={12} fill="#ffffff" stroke={TRAIT} strokeWidth={4} />
      <path d="M -48 -6 L -48 -58 Q 0 -72 48 -58 L 48 -6 Q 0 8 -48 -6 Z" fill="#f7c6d4" stroke={TRAIT} strokeWidth={4} />
      <ellipse cx={0} cy={-58} rx={48} ry={12} fill="#fffaf5" stroke={TRAIT} strokeWidth={4} />
      {[-36, -18, 0, 18, 36].map((x) => (
        <path key={x} d={`M ${x - 7} -52 Q ${x} -34 ${x + 7} -52`} fill="#fffaf5" />
      ))}
      <circle cx={-28} cy={-60} r={6} fill="#c8203a" stroke={TRAIT} strokeWidth={2} />
      <circle cx={28} cy={-60} r={6} fill="#c8203a" stroke={TRAIT} strokeWidth={2} />
      {[
        ["3", -12],
        ["5", 12],
      ].map(([c, x]) => (
        <g key={c}>
          <text x={x as number} y={-66} textAnchor="middle" fontFamily={POLICE_TEXTE} fontWeight={900} fontSize={34} fill="#5aa0d8" stroke={TRAIT} strokeWidth={2.5}>
            {c}
          </text>
          <ellipse cx={x as number} cy={-104} rx={4} ry={8 * flamme} fill="#ffb347" stroke="#e8752a" strokeWidth={1.5} />
        </g>
      ))}
    </g>
  );
};
