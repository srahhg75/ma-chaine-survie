import React, { useMemo } from "react";
import { Material } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// Boîte aux arêtes arrondies : la base du mobilier « stylisé » (les arêtes vives font « 3D de test »).
const cache = new Map<string, RoundedBoxGeometry>();
const geometrie = (l: number, h: number, p: number, r: number) => {
  const cle = `${l.toFixed(3)}|${h.toFixed(3)}|${p.toFixed(3)}|${r.toFixed(3)}`;
  let g = cache.get(cle);
  if (!g) {
    g = new RoundedBoxGeometry(l, h, p, 3, Math.min(r, l / 2, h / 2, p / 2) * 0.999);
    cache.set(cle, g);
  }
  return g;
};

export const Arrondi: React.FC<{
  taille: [number, number, number];
  rayon?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  materiau?: Material;
  couleur?: string;
  rugosite?: number;
  metal?: number;
  ombre?: boolean;
}> = ({ taille, rayon = 0.02, position, rotation, materiau, couleur = "#cccccc", rugosite = 0.8, metal = 0, ombre = true }) => {
  const g = useMemo(() => geometrie(taille[0], taille[1], taille[2], rayon), [taille, rayon]);
  return (
    <mesh geometry={g} position={position} rotation={rotation} castShadow={ombre} receiveShadow material={materiau}>
      {!materiau && <meshStandardMaterial color={couleur} roughness={rugosite} metalness={metal} />}
    </mesh>
  );
};
