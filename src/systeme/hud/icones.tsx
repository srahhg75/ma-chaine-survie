import React from "react";
import { NomIcone, NomMoodle } from "./types";

// Icônes originales en SVG (traits blancs sur fond transparent), viewBox 0 0 48 48.
const T = { fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const DESSINS: Record<NomIcone | NomMoodle, React.ReactNode> = {
  bougie: (
    <>
      <rect x="18" y="20" width="12" height="20" rx="2" {...T} />
      <path d="M24 20v-4" {...T} />
      <path d="M24 6c4 4 4 8 0 10c-4-2-4-6 0-10z" fill="currentColor" />
      <path d="M12 42h24" {...T} />
    </>
  ),
  eau: (
    <>
      <path d="M20 6h8v5l4 5v24a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V16l4-5z" {...T} />
      <path d="M16 24h16M16 32h16" {...T} />
    </>
  ),
  lampe: (
    <>
      <path d="M8 20h18v8H8z" {...T} />
      <path d="M26 18l8-6v24l-8-6z" {...T} />
      <path d="M38 16l4-3M39 24h5M38 32l4 3" {...T} />
    </>
  ),
  piles: (
    <>
      <rect x="10" y="12" width="12" height="28" rx="2" {...T} />
      <rect x="26" y="12" width="12" height="28" rx="2" {...T} />
      <path d="M14 8h4M30 8h4M16 22v6M13 25h6M29 25h6" {...T} />
    </>
  ),
  conserve: (
    <>
      <ellipse cx="24" cy="12" rx="12" ry="4" {...T} />
      <path d="M12 12v24c0 2 5 4 12 4s12-2 12-4V12" {...T} />
      <path d="M12 20c0 2 5 4 12 4s12-2 12-4M12 30c0 2 5 4 12 4s12-2 12-4" {...T} />
    </>
  ),
  couverture: (
    <>
      <path d="M8 14h32v20H8z" {...T} />
      <path d="M8 22h32M14 34v6M20 34v6M26 34v6M32 34v6" {...T} />
    </>
  ),
  radio: (
    <>
      <rect x="6" y="16" width="36" height="24" rx="3" {...T} />
      <circle cx="17" cy="28" r="6" {...T} />
      <path d="M28 24h9M28 30h9M32 16L40 6" {...T} />
    </>
  ),
  allumettes: (
    <>
      <path d="M14 40L30 14M22 40L36 18" {...T} />
      <circle cx="31" cy="12" r="3.5" fill="currentColor" />
      <circle cx="37" cy="16" r="3.5" fill="currentColor" />
    </>
  ),
  trousse: (
    <>
      <rect x="6" y="14" width="36" height="26" rx="3" {...T} />
      <path d="M18 14v-5h12v5M24 21v12M18 27h12" {...T} />
    </>
  ),
  briquet: (
    <>
      <rect x="14" y="18" width="20" height="24" rx="3" {...T} />
      <path d="M18 18v-5h8v5" {...T} />
      <path d="M30 6c3 3 3 6 0 8c-3-2-3-5 0-8z" fill="currentColor" />
    </>
  ),
  jerrican: (
    <>
      <path d="M10 14h28v28H10z" {...T} />
      <path d="M14 14l4-6h10M30 8v6M14 22l20 14M34 22L14 36" {...T} />
    </>
  ),
  thermometre: (
    <>
      <path d="M20 30V10a4 4 0 0 1 8 0v20a7 7 0 1 1-8 0z" {...T} />
      <path d="M24 34V18" {...T} />
    </>
  ),
  danger: (
    <>
      <path d="M24 6L44 40H4z" {...T} />
      <path d="M24 18v10" {...T} />
      <circle cx="24" cy="34" r="2" fill="currentColor" />
    </>
  ),
  maison: (
    <>
      <path d="M6 24L24 8l18 16" {...T} />
      <path d="M11 20v20h26V20M20 40V28h8v12" {...T} />
    </>
  ),
  porte: (
    <>
      <path d="M12 42V6h24v36M8 42h32" {...T} />
      <circle cx="30" cy="25" r="2" fill="currentColor" />
    </>
  ),
  // Indicateurs d'état (« moodles »)
  panique: (
    <>
      <path d="M24 40S8 30 8 18a8 8 0 0 1 16-2a8 8 0 0 1 16 2c0 12-16 22-16 22z" {...T} />
      <path d="M17 22h5l3-6l3 12l3-6h4" {...T} />
    </>
  ),
  froid: (
    <>
      <path d="M24 6v36M8 15l32 18M8 33l32-18" {...T} />
      <path d="M20 9l4 4l4-4M20 39l4-4l4 4" {...T} />
    </>
  ),
  faim: (
    <>
      <path d="M14 6v14a4 4 0 0 0 8 0V6M18 20v22" {...T} />
      <path d="M32 6c-4 4-4 14 0 16v20" {...T} />
    </>
  ),
  soif: <path d="M24 6C17 16 12 23 12 29a12 12 0 0 0 24 0c0-6-5-13-12-23z" {...T} />,
  fatigue: (
    <>
      <path d="M30 8a16 16 0 1 0 10 26A13 13 0 0 1 30 8z" {...T} />
    </>
  ),
  blessure: (
    <>
      <rect x="8" y="17" width="32" height="14" rx="7" transform="rotate(-35 24 24)" {...T} />
      <path d="M21 21l6 6" {...T} />
    </>
  ),
};

export const Icone: React.FC<{ nom: NomIcone | NomMoodle; taille: number; couleur?: string }> = ({ nom, taille, couleur = "#fff" }) => (
  <svg width={taille} height={taille} viewBox="0 0 48 48" style={{ color: couleur, display: "block" }}>
    {DESSINS[nom]}
  </svg>
);
