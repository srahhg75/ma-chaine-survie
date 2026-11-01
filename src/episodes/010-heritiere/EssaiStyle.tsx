import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Personnage2D } from "../../systeme/dessin2d/Personnage2D";
import { POLICE_TEXTE as MONTSERRAT } from "../../systeme/polices";
import { CLARA, ENZO, NOE, VICTORIA } from "./personnages";

/*
 * Image d'essai du style de « L'héritière cachée » (à valider avant tout épisode, leçon du 24/10) :
 * 2D façon webtoon. Image 0 : plan large dans le hall de la tour Valmont (Clara et Noé face à Victoria et Enzo).
 * Image 30 : la caméra s'approche de Victoria au téléphone (« Mon mari arrive. »).
 */

const Hall: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="mur" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d9c6a6" />
        <stop offset="1" stopColor="#efe3cc" />
      </linearGradient>
      <linearGradient id="sol" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e9dfd0" />
        <stop offset="1" stopColor="#c8b79e" />
      </linearGradient>
      <linearGradient id="or" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#b98a35" />
        <stop offset="0.45" stopColor="#f3d68a" />
        <stop offset="1" stopColor="#a87a2c" />
      </linearGradient>
      <linearGradient id="rayon" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity={0.55} />
        <stop offset="1" stopColor="#fff" stopOpacity={0} />
      </linearGradient>
      <radialGradient id="vignette" cx="0.5" cy="0.45" r="0.75">
        <stop offset="0.6" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={0.45} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={1080} height={1000} fill="url(#mur)" />
    {/* baies vitrées en haut : ville au loin */}
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={40 + i * 260} y={60} width={220} height={330} fill="#a9c6dd" stroke="#8a7656" strokeWidth={8} />
        <rect x={60 + i * 260} y={240} width={50} height={150} fill="#86a6c2" />
        <rect x={120 + i * 260} y={190} width={40} height={200} fill="#7f9fbc" />
        <rect x={170 + i * 260} y={270} width={60} height={120} fill="#8cabc6" />
      </g>
    ))}
    <rect x={0} y={390} width={1080} height={22} fill="#8a7656" />
    {/* piliers */}
    {[90, 990].map((x) => (
      <g key={x}>
        <rect x={x - 45} y={412} width={90} height={588} fill="#cbb38c" stroke="#8a7656" strokeWidth={4} />
        <rect x={x - 45} y={412} width={22} height={588} fill="#e4d2b1" />
        <rect x={x - 52} y={412} width={104} height={20} fill="url(#or)" />
      </g>
    ))}
    {/* logo et ascenseurs dorés */}
    <text x={540} y={500} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={58} letterSpacing={18} fill="url(#or)" stroke="#7a5a20" strokeWidth={1.5}>
      VALMONT
    </text>
    {[330, 750].map((x) => (
      <g key={x}>
        <rect x={x - 110} y={560} width={220} height={440} fill="#6b5534" />
        <rect x={x - 100} y={570} width={98} height={430} fill="url(#or)" />
        <rect x={x + 2} y={570} width={98} height={430} fill="url(#or)" />
        <circle cx={x + 130} cy={760} r={8} fill="#f3d68a" stroke="#7a5a20" strokeWidth={2} />
      </g>
    ))}
    {/* sol en marbre : perspective + reflets */}
    <rect x={0} y={1000} width={1080} height={920} fill="url(#sol)" />
    {[-1600, -1000, -500, -150, 150, 500, 1000, 1600].map((dx) => (
      <line key={dx} x1={540 + dx * 0.25} y1={1000} x2={540 + dx * 1.3} y2={1920} stroke="#b8a68a" strokeWidth={3} opacity={0.6} />
    ))}
    {[1060, 1160, 1300, 1500, 1780].map((y) => (
      <line key={y} x1={0} y1={y} x2={1080} y2={y} stroke="#b8a68a" strokeWidth={3} opacity={0.6} />
    ))}
    {/* plantes */}
    {[175, 905].map((x) => (
      <g key={x}>
        {[-40, -20, 0, 20, 40].map((a) => (
          <ellipse key={a} cx={x + a * 0.8} cy={880 - Math.abs(a) * 0.5} rx={18} ry={70} transform={`rotate(${a} ${x} 960)`} fill="#3f7d4e" stroke="#24452c" strokeWidth={3} />
        ))}
        <path d={`M ${x - 40} 950 L ${x + 40} 950 L ${x + 30} 1030 L ${x - 30} 1030 Z`} fill="#2b2b30" stroke="#151518" strokeWidth={3} />
      </g>
    ))}
    {/* rayons de lumière */}
    <path d="M 0 0 L 260 0 L 760 1300 L 420 1300 Z" fill="url(#rayon)" opacity={0.5} />
    <path d="M 380 0 L 470 0 L 980 1250 L 860 1250 Z" fill="url(#rayon)" opacity={0.35} />
  </g>
);

const Bulle: React.FC<{ x: number; y: number; texte: string; queue: [number, number] }> = ({ x, y, texte, queue }) => (
  <g>
    <path d={`M ${x - 40} ${y + 50} L ${queue[0]} ${queue[1]} L ${x + 30} ${y + 55} Z`} fill="#fff" stroke="#2a1e2c" strokeWidth={5} strokeLinejoin="round" />
    <ellipse cx={x} cy={y} rx={300} ry={80} fill="#fff" stroke="#2a1e2c" strokeWidth={5} />
    <path d={`M ${x - 38} ${y + 48} L ${x + 28} ${y + 52}`} stroke="#fff" strokeWidth={10} />
    <text x={x} y={y + 14} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={36} fill="#2a1e2c">
      {texte}
    </text>
  </g>
);

export const EssaiStyle: React.FC = () => {
  const frame = useCurrentFrame();
  const proche = frame >= 30;
  // zoom « caméra » sur le visage de Victoria (x 690, tête vers y 520)
  const zoom = proche ? "translate(540 560) scale(2.6) translate(-690 -560)" : "";
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1418" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <g transform={zoom}>
          <Hall />
          <Personnage2D id="clara" a={CLARA} x={250} y={1140} echelle={0.62} expr={proche ? "triste" : "neutre"} regard={0.6} brasD="tend" />
          <Personnage2D id="noe" a={NOE} x={380} y={1150} echelle={0.62} expr="triste" regard={0.7} brasG={{ coude: [-74, 186], poignet: [-84, 128] }} />
          <Personnage2D id="victoria" a={VICTORIA} x={690} y={1140} echelle={0.62} expr="mepris" regard={-0.7} brasG="hanche" brasD="telephone" bouche={proche ? 0.4 : 0} />
          <Personnage2D id="enzo" a={ENZO} x={850} y={1150} echelle={0.62} expr="mepris" regard={-0.8} brasG="croise" brasD="croise" />
        </g>
        {!proche && <Bulle x={560} y={330} texte="Tu sais qui est mon mari ?" queue={[690, 470]} />}
        <rect x={0} y={0} width={1080} height={1920} fill="url(#vignette)" />
      </svg>
    </AbsoluteFill>
  );
};
