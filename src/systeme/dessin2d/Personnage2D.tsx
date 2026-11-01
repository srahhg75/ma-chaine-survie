import React from "react";

/*
 * Personnage dessiné en 2D, style webtoon / anime (série « L'héritière cachée ») : traits sombres nets, aplats,
 * une ombre franche (cel shading, lumière venant de la gauche), grands yeux à reflets.
 * Repère local : x = 0 au milieu du corps, y vers le bas, pieds à y = PIED (1000 adulte, 650 enfant).
 * Le parent place le personnage avec <Personnage2D x y echelle /> : (x, y) = point entre les pieds, à l'écran.
 */

export const TRAIT = "#2a1e2c";

export type Coiffure = "longue" | "carre" | "courte" | "enfant";
export type Expression = "neutre" | "sourire" | "fache" | "mepris" | "triste" | "choque";
export type Point = [number, number];
// Bras : une pose connue ou des points explicites (coude, poignet), en repère local
export type PoseBras = "bas" | "hanche" | "croise" | "telephone" | "tend" | { coude: Point; poignet: Point };

export type Apparence2D = {
  peau: string;
  ombrePeau: string;
  cheveux: string;
  ombreCheveux: string;
  coiffure: Coiffure;
  yeux: string;
  homme?: boolean;
  enfant?: boolean;
  levres?: string;
  haut: string;
  ombreHaut: string;
  bas: string;
  ombreBas: string;
  robe?: boolean; // le bas est une jupe jusqu'aux genoux (jambes nues)
  brasNus?: boolean;
  chaussures: string;
  chemise?: string; // col de chemise visible (costume)
  cravate?: string;
  fourrure?: string; // étole sur les épaules
  bijoux?: string; // boucles d'oreilles + collier
  capuche?: boolean;
};

type Squelette = { sx: number; sy: number; wx: number; wy: number; hx: number; hy: number; ky: number; ay: number; pied: number; jambe: number };

const squelette = (a: Apparence2D): Squelette =>
  a.enfant
    ? { sx: 50, sy: 192, wx: 42, wy: 330, hx: 44, hy: 385, ky: 505, ay: 615, pied: 650, jambe: 15 }
    : a.homme
      ? { sx: 82, sy: 205, wx: 56, wy: 450, hx: 58, hy: 520, ky: 745, ay: 960, pied: 1000, jambe: 25 }
      : { sx: 66, sy: 205, wx: 42, wy: 420, hx: 62, hy: 500, ky: 735, ay: 960, pied: 1000, jambe: 22 };

const pts = (p: Point[]) => p.map(([x, y]) => `${x},${y}`).join(" ");

// Membre en plusieurs segments : tous les contours d'abord, puis tous les aplats (jointures propres)
const Membre: React.FC<{ segments: { a: Point; b: Point; l: number; c: string }[] }> = ({ segments }) => (
  <g strokeLinecap="round" strokeLinejoin="round" fill="none">
    {segments.map((s, i) => (
      <polyline key={`t${i}`} points={pts([s.a, s.b])} stroke={TRAIT} strokeWidth={s.l + 8} />
    ))}
    {segments.map((s, i) => (
      <polyline key={`c${i}`} points={pts([s.a, s.b])} stroke={s.c} strokeWidth={s.l} />
    ))}
  </g>
);

const brasPoints = (pose: PoseBras, cote: -1 | 1, k: Squelette): { epaule: Point; coude: Point; poignet: Point } => {
  const { sx, sy, wx, wy } = k;
  const epaule: Point = [cote * (sx - 12), sy + 16];
  const enf = sx / 66;
  if (typeof pose === "object") return { epaule, ...pose };
  switch (pose) {
    case "hanche":
      return { epaule, coude: [cote * (sx + 48 * enf), sy + 125 * enf], poignet: [cote * (wx + 4), wy + 4] };
    case "croise":
      return { epaule, coude: [cote * (sx - 4), sy + 150 * enf], poignet: [-cote * (sx - 24), sy + 112 * enf] };
    case "telephone":
      return { epaule, coude: [cote * (sx + 22), sy + 95 * enf], poignet: [cote * 50, 128] };
    case "tend":
      return { epaule, coude: [cote * (sx + 18), sy + 140 * enf], poignet: [cote * (sx + 60), sy + 300 * enf] };
    default:
      return { epaule, coude: [cote * (sx + 6), sy + 150 * enf], poignet: [cote * (sx + 4), sy + 285 * enf] };
  }
};

const Bras: React.FC<{ a: Apparence2D; k: Squelette; pose: PoseBras; cote: -1 | 1 }> = ({ a, k, pose, cote }) => {
  const { epaule, coude, poignet } = brasPoints(pose, cote, k);
  const l = a.enfant ? 26 : a.homme ? 38 : 30;
  const manche = a.brasNus ? a.peau : a.haut;
  const main = a.enfant ? 12 : a.homme ? 16 : 13;
  return (
    <g>
      <Membre
        segments={[
          { a: epaule, b: coude, l, c: manche },
          { a: coude, b: poignet, l: l - 4, c: manche },
        ]}
      />
      {/* poignet de manche */}
      {!a.brasNus && (
        <circle cx={poignet[0] * 0.92 + coude[0] * 0.08} cy={poignet[1] * 0.92 + coude[1] * 0.08} r={(l - 4) / 2 + 1} fill={a.ombreHaut} />
      )}
      <circle cx={poignet[0]} cy={poignet[1] + 6} r={main} fill={a.peau} stroke={TRAIT} strokeWidth={4} />
      {pose === "telephone" && <rect x={poignet[0] - 9 + cote * 4} y={poignet[1] - 44} width={18} height={40} rx={4} fill="#1c1c22" stroke={TRAIT} strokeWidth={3} />}
    </g>
  );
};

// ---------------------------------------------------------------- visage

const Oeil: React.FC<{ cx: number; cy: number; cote: -1 | 1; l: number; h: number; a: Apparence2D; expr: Expression; id: string }> = ({ cx, cy, cote, l, h, a, expr, id }) => {
  // paupière supérieure abaissée selon l'expression
  const ferme = expr === "fache" || expr === "mepris" ? 0.42 : expr === "triste" ? 0.25 : expr === "choque" ? -0.15 : 0;
  const ext = cx + cote * l; // coin extérieur
  const int = cx - cote * l * 0.85; // coin intérieur
  const haut = cy - h * (1 - ferme);
  const blanc = `M ${int} ${cy + 2} C ${int + cote * l * 0.2} ${haut}, ${ext - cote * l * 0.5} ${haut - 2}, ${ext} ${cy - h * 0.35 * (1 - ferme)} C ${ext - cote * 2} ${cy + h * 0.5}, ${int + cote * l * 0.6} ${cy + h * 0.62}, ${int} ${cy + 2} Z`;
  const cils = `M ${int} ${cy + 2} C ${int + cote * l * 0.2} ${haut}, ${ext - cote * l * 0.5} ${haut - 2}, ${ext} ${cy - h * 0.35 * (1 - ferme)} L ${ext + cote * (a.homme ? 3 : 10)} ${cy - h * 0.55 * (1 - ferme) - (a.homme ? 0 : 6)}`;
  const ri = l * (expr === "choque" ? 0.42 : 0.56);
  const ix = cx + cote * 2;
  const iy = cy + h * 0.12;
  return (
    <g>
      <clipPath id={`${id}-oeil${cote}`}>
        <path d={blanc} />
      </clipPath>
      <path d={blanc} fill="#ffffff" />
      <g clipPath={`url(#${id}-oeil${cote})`}>
        <ellipse cx={ix} cy={iy} rx={ri} ry={ri * 1.25} fill={a.yeux} />
        <ellipse cx={ix} cy={iy - ri * 0.45} rx={ri} ry={ri * 0.75} fill={TRAIT} opacity={0.45} />
        <ellipse cx={ix} cy={iy} rx={ri} ry={ri * 1.25} fill="none" stroke={TRAIT} strokeWidth={2.5} />
        <ellipse cx={ix} cy={iy + 1} rx={ri * 0.42} ry={ri * 0.6} fill={TRAIT} />
        <circle cx={ix - ri * 0.38} cy={iy - ri * 0.45} r={ri * 0.3} fill="#fff" />
        <circle cx={ix + ri * 0.35} cy={iy + ri * 0.5} r={ri * 0.14} fill="#fff" />
        {/* ombre de la paupière */}
        <path d={`M ${int - 10} ${haut - 10} L ${ext + 10} ${haut - 10} L ${ext + 10} ${haut + 6} Q ${cx} ${haut + 12} ${int - 10} ${haut + 6} Z`} fill={a.ombrePeau} opacity={0.5} />
      </g>
      <path d={cils} fill="none" stroke={TRAIT} strokeWidth={a.homme ? 4.5 : 6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M ${int + cote * l * 0.6} ${cy + h * 0.62} Q ${ext - cote * 2} ${cy + h * 0.45} ${ext - cote * 1} ${cy + 1}`} fill="none" stroke={TRAIT} strokeWidth={1.8} opacity={0.6} />
    </g>
  );
};

const Sourcil: React.FC<{ cx: number; cy: number; cote: -1 | 1; expr: Expression; homme?: boolean }> = ({ cx, cy, cote, expr, homme }) => {
  // inclinaison : fâché = bout intérieur vers le bas ; triste = bout intérieur vers le haut
  const pente = expr === "fache" ? 9 : expr === "mepris" ? (cote === 1 ? -6 : 5) : expr === "triste" ? -8 : expr === "choque" ? -4 : 0;
  const y = cy - (expr === "choque" ? 6 : 0);
  const int: Point = [cx - cote * 15, y + pente];
  const ext: Point = [cx + cote * 17, y + 3];
  return (
    <path
      d={`M ${int[0]} ${int[1]} Q ${cx} ${y - 5} ${ext[0]} ${ext[1]}`}
      fill="none"
      stroke={TRAIT}
      strokeWidth={homme ? 5 : 3.5}
      strokeLinecap="round"
    />
  );
};

const Bouche: React.FC<{ cx: number; cy: number; expr: Expression; ouverture: number; a: Apparence2D }> = ({ cx, cy, expr, ouverture, a }) => {
  const levre = a.levres ?? "#b35a5a";
  if (ouverture > 0.05 || expr === "choque") {
    const o = Math.max(ouverture, expr === "choque" ? 0.7 : 0);
    return (
      <g>
        <ellipse cx={cx} cy={cy + 3 * o} rx={7 + 3 * o} ry={3 + 8 * o} fill="#5a2430" stroke={TRAIT} strokeWidth={2.5} />
        <ellipse cx={cx} cy={cy + 6 + 6 * o} rx={4 + 2 * o} ry={2 * o} fill="#d9757a" />
        {a.levres && <path d={`M ${cx - 10} ${cy - 2} Q ${cx} ${cy - 6} ${cx + 10} ${cy - 2}`} stroke={levre} strokeWidth={3} fill="none" />}
      </g>
    );
  }
  const d =
    expr === "sourire"
      ? `M ${cx - 11} ${cy - 2} Q ${cx} ${cy + 7} ${cx + 11} ${cy - 2}`
      : expr === "mepris"
        ? `M ${cx - 10} ${cy + 2} Q ${cx + 2} ${cy + 3} ${cx + 12} ${cy - 5}`
        : expr === "fache" || expr === "triste"
          ? `M ${cx - 9} ${cy + 3} Q ${cx} ${cy - 3} ${cx + 9} ${cy + 3}`
          : `M ${cx - 8} ${cy} Q ${cx} ${cy + 2} ${cx + 8} ${cy}`;
  return (
    <g>
      {a.levres && <path d={`M ${cx - 9} ${cy} Q ${cx} ${cy + 9} ${cx + 9} ${cy} Q ${cx} ${cy - 3} ${cx - 9} ${cy} Z`} fill={levre} opacity={0.9} />}
      <path d={d} fill="none" stroke={TRAIT} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

// ---------------------------------------------------------------- cheveux

const CheveuxArriere: React.FC<{ a: Apparence2D }> = ({ a }) => {
  const st = { fill: a.cheveux, stroke: TRAIT, strokeWidth: 4, strokeLinejoin: "round" as const };
  if (a.coiffure === "longue")
    return <path d="M -60 70 C -84 160, -88 300, -92 390 L -70 372 L -58 398 L -36 378 L -14 402 L 8 380 L 30 404 L 50 378 L 70 398 L 92 384 C 88 300, 86 160, 62 70 Z" {...st} />;
  if (a.coiffure === "carre") return <path d="M -62 70 C -78 130, -78 190, -72 232 L 72 232 C 78 190, 78 130, 62 70 Z" {...st} />;
  return null;
};

const CheveuxAvant: React.FC<{ a: Apparence2D; id: string }> = ({ a, id }) => {
  const st = { fill: a.cheveux, stroke: TRAIT, strokeWidth: 4, strokeLinejoin: "round" as const };
  let d: string;
  if (a.coiffure === "longue")
    // calotte + frange balayée vers la gauche + mèches qui encadrent le visage
    d =
      "M -62 200 C -74 120, -70 30, -30 6 C -6 -8, 30 -6, 52 12 C 74 34, 76 120, 64 200 L 54 178 C 56 140, 54 110, 48 84 Q 36 98 30 112 Q 26 84 14 64 Q 0 92 -14 100 Q -8 76 -12 58 Q -30 86 -46 98 Q -50 140 -50 178 Z";
  else if (a.coiffure === "carre")
    // carré blond, raie de côté, pointes vers la mâchoire
    d =
      "M -64 222 C -78 120, -66 26, -24 6 C 4 -6, 40 0, 58 22 C 78 50, 78 140, 66 222 L 52 214 C 56 150, 54 110, 44 76 Q 20 60 -6 58 Q -34 70 -46 112 C -50 150, -52 190, -50 214 Z";
  else if (a.coiffure === "enfant")
    d = "M -58 112 C -66 40, -36 0, 0 0 C 36 0, 66 40, 58 112 L 52 92 Q 44 70 36 62 L 30 78 L 18 58 L 8 76 L -6 56 L -16 76 L -30 60 L -38 78 Q -50 84 -52 92 Z";
  else
    // homme : coiffé en arrière avec une mèche, côtés courts
    d = "M -56 112 C -66 30, -30 -6, 6 -4 C 44 -2, 68 34, 58 112 L 52 96 C 52 76, 46 62, 38 54 Q 18 62 -2 54 Q -20 74 -40 66 Q -50 80 -50 96 Z";
  return (
    <g>
      <clipPath id={`${id}-chev`}>
        <path d={d} />
      </clipPath>
      <path d={d} {...st} />
      <g clipPath={`url(#${id}-chev)`}>
        {/* ombre (côté droit) et anneau de lumière */}
        <path d="M 20 -20 C 60 0, 90 80, 80 240 L 120 240 L 120 -20 Z" fill={a.ombreCheveux} />
        <path d="M -44 40 Q 0 14 44 34" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d="M -30 30 L -20 6 M 10 26 L 16 2" stroke={a.ombreCheveux} strokeWidth={3} />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- personnage

export type Props2D = {
  a: Apparence2D;
  x: number;
  y: number;
  echelle: number;
  id: string;
  expr?: Expression;
  bouche?: number; // 0 = fermée, 1 = grande ouverte (répliques)
  regard?: number; // -1 = tourné vers la gauche de l'écran, 1 = vers la droite
  brasG?: PoseBras; // bras à gauche de l'écran
  brasD?: PoseBras;
  miroir?: boolean;
};

export const Personnage2D: React.FC<Props2D> = ({ a, x, y, echelle, id, expr = "neutre", bouche = 0, regard = 0, brasG = "bas", brasD = "bas", miroir }) => {
  const k = squelette(a);
  const { sx, sy, wx, wy, hx, hy, ky, ay, pied, jambe } = k;
  const dx = regard * 9; // les traits du visage glissent du côté du regard (trois-quarts)
  const oeilY = a.enfant ? 104 : 100;
  const ecart = a.enfant ? 25 : 24;
  const lo = a.enfant ? 17 : a.homme ? 16 : 17;
  const ho = a.enfant ? 20 : a.homme ? 11 : 15;
  const loin = (c: -1 | 1) => (c === Math.sign(regard) || regard === 0 ? 1 : 1 - 0.18 * Math.abs(regard));

  // tronc
  const tronc = `M ${-sx} ${sy + 14} C ${-sx} ${sy - 2}, ${-sx + 16} ${sy - 10}, -20 ${sy - 12} L 20 ${sy - 12} C ${sx - 16} ${sy - 10}, ${sx} ${sy - 2}, ${sx} ${sy + 14} C ${sx - 2} ${sy + 90}, ${wx + 4} ${wy - 70}, ${wx} ${wy} L ${wx + 2} ${wy + 14} L ${-wx - 2} ${wy + 14} L ${-wx} ${wy} C ${-wx - 4} ${wy - 70}, ${-sx + 2} ${sy + 90}, ${-sx} ${sy + 14} Z`;
  const ourlet = a.enfant ? ky - 10 : ky - 20;
  const bas = a.robe
    ? `M ${-wx} ${wy} C ${-hx - 6} ${wy + 40}, ${-hx - 4} ${hy}, ${-hx - 14} ${ourlet} Q 0 ${ourlet + 14} ${hx + 14} ${ourlet} C ${hx + 4} ${hy}, ${hx + 6} ${wy + 40}, ${wx} ${wy} Z`
    : `M ${-wx} ${wy} C ${-hx} ${wy + 30}, ${-hx} ${hy - 10}, ${-hx + 2} ${hy + 20} L 0 ${hy + 24} L ${hx - 2} ${hy + 20} C ${hx} ${hy - 10}, ${hx} ${wy + 30}, ${wx} ${wy} Z`;
  const couleurJambe = a.robe ? a.peau : a.bas;
  const jambes = ([-1, 1] as const).map((c) => {
    const hanche: Point = [c * (hx - jambe), hy];
    const genou: Point = [c * (hx - jambe - 4), ky];
    const cheville: Point = [c * (hx - jambe - 8), ay];
    return { c, hanche, genou, cheville };
  });

  return (
    <g transform={`translate(${x} ${y}) scale(${miroir ? -echelle : echelle} ${echelle}) translate(0 ${-pied})`}>
      {/* ombre au sol */}
      <ellipse cx={0} cy={pied - 2} rx={sx * 1.5} ry={16} fill="#000" opacity={0.18} />
      <CheveuxArriere a={a} />
      {/* jambes */}
      <Membre
        segments={jambes.flatMap((j) => [
          { a: j.hanche, b: j.genou, l: a.enfant ? 36 : a.homme ? 56 : 50, c: couleurJambe },
          { a: j.genou, b: j.cheville, l: a.enfant ? 30 : a.homme ? 46 : 34, c: couleurJambe },
        ])}
      />
      {jambes.map((j) => (
        <path
          key={j.c}
          d={`M ${j.cheville[0] - 17} ${pied - 4} C ${j.cheville[0] - 19} ${ay}, ${j.cheville[0] + 14} ${ay - 4}, ${j.cheville[0] + 16 + 8 * j.c} ${pied - 10} Q ${j.cheville[0] + 18 + 8 * j.c} ${pied - 2} ${j.cheville[0] + 4} ${pied - 2} Z`}
          fill={a.chaussures}
          stroke={TRAIT}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      ))}
      {/* bas (pantalon ou jupe) */}
      <clipPath id={`${id}-bas`}>
        <path d={bas} />
      </clipPath>
      <path d={bas} fill={a.bas} stroke={TRAIT} strokeWidth={4} strokeLinejoin="round" />
      <g clipPath={`url(#${id}-bas)`}>
        <rect x={hx * 0.3} y={wy - 10} width={200} height={ky} fill={a.ombreBas} />
      </g>
      {/* cou */}
      <path d={`M -14 140 L -15 ${sy - 4} L 15 ${sy - 4} L 14 140 Z`} fill={a.peau} stroke={TRAIT} strokeWidth={4} />
      <path d={`M -14 150 Q 0 176 14 150 L 14 ${sy - 30} L -14 ${sy - 30} Z`} fill={a.ombrePeau} />
      {/* tronc */}
      <clipPath id={`${id}-tronc`}>
        <path d={tronc} />
      </clipPath>
      <path d={tronc} fill={a.haut} stroke={TRAIT} strokeWidth={4} strokeLinejoin="round" />
      <g clipPath={`url(#${id}-tronc)`}>
        <path d={`M ${sx * 0.35} ${sy - 20} Q ${sx * 0.1} ${(sy + wy) / 2} ${wx * 0.45} ${wy + 20} L 200 ${wy + 20} L 200 ${sy - 20} Z`} fill={a.ombreHaut} />
        {a.chemise && <path d={`M -22 ${sy - 14} L 0 ${sy + 70} L 22 ${sy - 14} Z`} fill={a.chemise} stroke={TRAIT} strokeWidth={3} />}
        {a.cravate && <path d={`M -7 ${sy - 4} L 7 ${sy - 4} L 10 ${sy + 110} L 0 ${sy + 124} L -10 ${sy + 110} Z`} fill={a.cravate} stroke={TRAIT} strokeWidth={3} />}
        {a.chemise && (
          <>
            <path d={`M -24 ${sy - 14} L -6 ${sy + 120} L -40 ${sy + 20} Z`} fill={a.ombreHaut} stroke={TRAIT} strokeWidth={3} />
            <path d={`M 24 ${sy - 14} L 6 ${sy + 120} L 40 ${sy + 20} Z`} fill={a.ombreHaut} stroke={TRAIT} strokeWidth={3} />
          </>
        )}
        {a.capuche && <path d={`M -34 ${sy - 12} Q 0 ${sy + 40} 34 ${sy - 12}`} fill="none" stroke={a.ombreHaut} strokeWidth={14} />}
        {!a.chemise && !a.capuche && <path d={`M -22 ${sy - 12} Q 0 ${sy + 18} 22 ${sy - 12}`} fill={a.brasNus ? a.peau : a.ombreHaut} stroke={TRAIT} strokeWidth={3} />}
      </g>
      {a.fourrure && (
        <path
          d={`M ${-sx - 14} ${sy + 30} Q ${-sx - 10} ${sy - 18} -24 ${sy - 14} Q 0 ${sy + 24} 24 ${sy - 14} Q ${sx + 10} ${sy - 18} ${sx + 14} ${sy + 30} Q ${sx - 4} ${sy + 46} ${sx - 26} ${sy + 34} Q 0 ${sy + 66} ${-sx + 26} ${sy + 34} Q ${-sx + 4} ${sy + 46} ${-sx - 14} ${sy + 30} Z`}
          fill={a.fourrure}
          stroke={TRAIT}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      )}
      {a.bijoux && <path d={`M -18 ${sy - 8} Q 0 ${sy + 20} 18 ${sy - 8}`} fill="none" stroke={a.bijoux} strokeWidth={3} />}
      {/* bras */}
      <Bras a={a} k={k} pose={brasG} cote={-1} />
      <Bras a={a} k={k} pose={brasD} cote={1} />
      {/* tête */}
      <g>
        <path d="M -50 96 C -52 112, -48 108, -58 100 C -64 120, -54 128, -48 124 Z" fill={a.peau} stroke={TRAIT} strokeWidth={3} />
        <path d="M 50 96 C 52 112, 48 108, 58 100 C 64 120, 54 128, 48 124 Z" fill={a.peau} stroke={TRAIT} strokeWidth={3} />
        <clipPath id={`${id}-visage`}>
          <path d={visage(a)} />
        </clipPath>
        <path d={visage(a)} fill={a.peau} stroke={TRAIT} strokeWidth={4} strokeLinejoin="round" />
        <g clipPath={`url(#${id}-visage)`}>
          <path d="M 30 0 C 50 60, 52 120, 20 190 L 100 190 L 100 0 Z" fill={a.ombrePeau} opacity={0.55} />
          <rect x={-60} y={0} width={120} height={52} fill={a.ombrePeau} opacity={0.6} />
        </g>
        {a.bijoux && (
          <>
            <circle cx={-52} cy={134} r={5} fill={a.bijoux} stroke={TRAIT} strokeWidth={2} />
            <circle cx={52} cy={134} r={5} fill={a.bijoux} stroke={TRAIT} strokeWidth={2} />
          </>
        )}
        {/* joues */}
        {!a.homme && (
          <>
            <ellipse cx={-30 + dx} cy={128} rx={11} ry={5} fill="#ff8a8a" opacity={0.3} />
            <ellipse cx={30 + dx} cy={128} rx={11} ry={5} fill="#ff8a8a" opacity={0.3} />
          </>
        )}
        {([-1, 1] as const).map((c) => (
          <g key={c} transform={`translate(${c * ecart + dx} 0) scale(${loin(c)} 1) translate(${-(c * ecart + dx)} 0)`}>
            <Oeil cx={c * ecart + dx} cy={oeilY} cote={c} l={lo} h={ho} a={a} expr={expr} id={id} />
            <Sourcil cx={c * ecart + dx} cy={oeilY - (a.homme ? 24 : 27)} cote={c} expr={expr} homme={a.homme} />
          </g>
        ))}
        {/* nez */}
        <path d={`M ${dx + 3 + regard * 3} ${oeilY + 22} L ${dx + 6 + regard * 4} ${oeilY + 33} L ${dx + 1} ${oeilY + 35}`} fill="none" stroke={TRAIT} strokeWidth={2.5} strokeLinecap="round" opacity={0.75} />
        <Bouche cx={dx * 0.9} cy={a.enfant ? 152 : 151} expr={expr} ouverture={bouche} a={a} />
        <CheveuxAvant a={a} id={id} />
      </g>
    </g>
  );
};

const visage = (a: Apparence2D) =>
  a.enfant
    ? "M -54 96 C -56 36, -30 16, 0 16 C 30 16, 56 36, 54 96 C 52 136, 30 168, 0 172 C -30 168, -52 136, -54 96 Z"
    : a.homme
      ? "M -52 92 C -54 36, -30 16, 0 16 C 30 16, 54 36, 52 92 C 52 126, 40 152, 0 176 C -40 152, -52 126, -52 92 Z"
      : "M -50 94 C -52 38, -28 18, 0 18 C 28 18, 52 38, 50 94 C 48 126, 30 156, 0 172 C -30 156, -48 126, -50 94 Z";
