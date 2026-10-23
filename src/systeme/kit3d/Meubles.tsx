import React from "react";
import { DonneesMeuble, TypeMeuble } from "./decor";

// Meubles et objets low-poly. Origine = centre au sol de l'objet ; dimensions = TAILLES (decor.ts).
type P = { c?: string };

const Bois: React.FC<{ c?: string; r?: number }> = ({ c = "#7a5232", r = 0.75 }) => <meshStandardMaterial color={c} roughness={r} />;
const Boite: React.FC<{ p: [number, number, number]; t: [number, number, number]; c: string; r?: number; m?: number }> = ({ p, t, c, r = 0.8, m = 0 }) => (
  <mesh position={p} castShadow receiveShadow>
    <boxGeometry args={t} />
    <meshStandardMaterial color={c} roughness={r} metalness={m} />
  </mesh>
);

const Table: React.FC<P> = ({ c = "#7a5232" }) => (
  <group>
    <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.2, 0.04, 0.75]} />
      <Bois c={c} />
    </mesh>
    {[[-0.54, -0.32], [0.54, -0.32], [-0.54, 0.32], [0.54, 0.32]].map(([x, z], i) => (
      <Boite key={i} p={[x, 0.36, z]} t={[0.05, 0.72, 0.05]} c={c} />
    ))}
  </group>
);

const Chaise: React.FC<P> = ({ c = "#6b4a2e" }) => (
  <group>
    <Boite p={[0, 0.45, 0]} t={[0.44, 0.04, 0.44]} c={c} />
    <Boite p={[0, 0.7, -0.2]} t={[0.44, 0.46, 0.04]} c={c} />
    {[[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]].map(([x, z], i) => (
      <Boite key={i} p={[x, 0.22, z]} t={[0.035, 0.44, 0.035]} c={c} />
    ))}
  </group>
);

const Lit: React.FC<P> = ({ c = "#3e4a5c" }) => (
  <group>
    <Boite p={[0, 0.15, 0]} t={[1.45, 0.3, 2.0]} c="#5a4030" />
    <Boite p={[0, 0.38, 0.05]} t={[1.4, 0.18, 1.9]} c="#d8d3c8" r={0.95} />
    <Boite p={[0, 0.49, 0.3]} t={[1.42, 0.06, 1.3]} c={c} r={0.95} />
    <Boite p={[-0.33, 0.52, -0.72]} t={[0.55, 0.12, 0.35]} c="#ece8de" r={0.95} />
    <Boite p={[0.33, 0.52, -0.72]} t={[0.55, 0.12, 0.35]} c="#ece8de" r={0.95} />
    <Boite p={[0, 0.55, -0.98]} t={[1.45, 1.1, 0.06]} c="#5a4030" />
  </group>
);

const Canape: React.FC<P> = ({ c = "#5c4b3b" }) => (
  <group>
    <Boite p={[0, 0.22, 0.05]} t={[1.9, 0.44, 0.75]} c={c} r={0.95} />
    <Boite p={[0, 0.58, -0.32]} t={[1.9, 0.5, 0.2]} c={c} r={0.95} />
    <Boite p={[-0.87, 0.5, 0.05]} t={[0.18, 0.32, 0.75]} c={c} r={0.95} />
    <Boite p={[0.87, 0.5, 0.05]} t={[0.18, 0.32, 0.75]} c={c} r={0.95} />
    <Boite p={[-0.42, 0.48, 0.08]} t={[0.8, 0.1, 0.62]} c={c} r={1} />
    <Boite p={[0.42, 0.48, 0.08]} t={[0.8, 0.1, 0.62]} c={c} r={1} />
  </group>
);

const Etagere: React.FC<P> = ({ c = "#6e5038" }) => (
  <group>
    <Boite p={[-0.43, 0.9, 0]} t={[0.03, 1.8, 0.32]} c={c} />
    <Boite p={[0.43, 0.9, 0]} t={[0.03, 1.8, 0.32]} c={c} />
    {[0.02, 0.45, 0.9, 1.35, 1.78].map((y, i) => (
      <Boite key={i} p={[0, y, 0]} t={[0.86, 0.03, 0.3]} c={c} />
    ))}
    {/* quelques objets */}
    <Boite p={[-0.2, 0.6, 0]} t={[0.3, 0.26, 0.22]} c="#8c6d46" r={1} />
    <Boite p={[0.22, 1.02, 0]} t={[0.18, 0.2, 0.2]} c="#4f5d4a" r={1} />
    <Boite p={[-0.15, 1.47, 0]} t={[0.4, 0.2, 0.22]} c="#7b3b2f" r={1} />
  </group>
);

const Frigo: React.FC<P> = ({ c = "#dcdcd6" }) => (
  <group>
    <Boite p={[0, 0.875, 0]} t={[0.6, 1.75, 0.62]} c={c} r={0.4} />
    <Boite p={[0, 1.18, 0.312]} t={[0.58, 0.01, 0.01]} c="#9a9a94" />
    <Boite p={[0.22, 1.45, 0.33]} t={[0.025, 0.3, 0.03]} c="#8f8f8a" m={0.6} r={0.3} />
    <Boite p={[0.22, 0.85, 0.33]} t={[0.025, 0.3, 0.03]} c="#8f8f8a" m={0.6} r={0.3} />
  </group>
);

const Placard: React.FC<P> = ({ c = "#8a6a4a" }) => (
  <group>
    <Boite p={[0, 1.0, 0]} t={[1.0, 2.0, 0.55]} c={c} />
    <Boite p={[0, 1.0, 0.276]} t={[0.008, 1.96, 0.01]} c="#3a2a1a" />
    <Boite p={[-0.06, 1.0, 0.29]} t={[0.02, 0.18, 0.02]} c="#b9a46a" m={0.7} r={0.3} />
    <Boite p={[0.06, 1.0, 0.29]} t={[0.02, 0.18, 0.02]} c="#b9a46a" m={0.7} r={0.3} />
  </group>
);

const Radiateur: React.FC<P> = ({ c = "#e2dfd6" }) => (
  <group>
    {Array.from({ length: 9 }, (_, i) => (
      <Boite key={i} p={[-0.4 + i * 0.1, 0.35, 0]} t={[0.07, 0.5, 0.08]} c={c} r={0.5} />
    ))}
  </group>
);

const Tapis: React.FC<P> = ({ c = "#7c3b30" }) => (
  <mesh position={[0, 0.005, 0]} receiveShadow>
    <boxGeometry args={[1.8, 0.01, 1.2]} />
    <meshStandardMaterial color={c} roughness={1} />
  </mesh>
);

const Cuisiniere: React.FC<P> = ({ c = "#cfcfc8" }) => (
  <group>
    <Boite p={[0, 0.44, 0]} t={[0.6, 0.88, 0.6]} c={c} r={0.45} />
    <Boite p={[0, 0.45, 0.302]} t={[0.48, 0.4, 0.01]} c="#1b1b1b" r={0.2} />
    {[[-0.14, -0.14], [0.14, -0.14], [-0.14, 0.14], [0.14, 0.14]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.885, z]}>
        <cylinderGeometry args={[0.08, 0.08, 0.01, 20]} />
        <meshStandardMaterial color="#222" roughness={0.6} />
      </mesh>
    ))}
  </group>
);

const Evier: React.FC<P> = ({ c = "#b8b4aa" }) => (
  <group>
    <Boite p={[0, 0.44, 0]} t={[1.2, 0.88, 0.6]} c="#8a6a4a" />
    <Boite p={[0, 0.89, 0]} t={[1.22, 0.03, 0.62]} c={c} r={0.4} />
    <Boite p={[0.25, 0.86, 0]} t={[0.45, 0.06, 0.4]} c="#9fa2a3" m={0.7} r={0.25} />
    <Boite p={[0.25, 1.02, -0.24]} t={[0.03, 0.25, 0.03]} c="#bfc2c3" m={0.9} r={0.2} />
  </group>
);

const Bouteille: React.FC<P> = ({ c = "#7fb2d9" }) => (
  <group>
    <mesh position={[0, 0.13, 0]} castShadow>
      <cylinderGeometry args={[0.045, 0.045, 0.26, 16]} />
      <meshStandardMaterial color={c} transparent opacity={0.75} roughness={0.15} />
    </mesh>
    <mesh position={[0, 0.29, 0]}>
      <cylinderGeometry args={[0.018, 0.04, 0.06, 12]} />
      <meshStandardMaterial color={c} transparent opacity={0.75} roughness={0.15} />
    </mesh>
    <mesh position={[0, 0.33, 0]}>
      <cylinderGeometry args={[0.02, 0.02, 0.025, 12]} />
      <meshStandardMaterial color="#2e6db0" roughness={0.5} />
    </mesh>
  </group>
);

const Conserve: React.FC<P> = ({ c = "#a3392b" }) => (
  <group>
    <mesh position={[0, 0.055, 0]} castShadow>
      <cylinderGeometry args={[0.04, 0.04, 0.11, 18]} />
      <meshStandardMaterial color="#b9bcbd" metalness={0.8} roughness={0.35} />
    </mesh>
    <mesh position={[0, 0.055, 0]}>
      <cylinderGeometry args={[0.0405, 0.0405, 0.07, 18]} />
      <meshStandardMaterial color={c} roughness={0.7} />
    </mesh>
  </group>
);

const Radio: React.FC<P> = ({ c = "#3b3f3a" }) => (
  <group>
    <Boite p={[0, 0.08, 0]} t={[0.28, 0.16, 0.1]} c={c} r={0.6} />
    <mesh position={[-0.06, 0.08, 0.051]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.045, 0.045, 0.005, 20]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </mesh>
    <Boite p={[0.08, 0.11, 0.051]} t={[0.08, 0.03, 0.005]} c="#c9b77a" r={0.4} />
    <Boite p={[0.1, 0.3, -0.03]} t={[0.008, 0.3, 0.008]} c="#c0c0c0" m={0.9} r={0.2} />
  </group>
);

const Couverture: React.FC<P> = ({ c = "#6d5a8a" }) => (
  <group>
    <Boite p={[0, 0.03, 0]} t={[0.45, 0.06, 0.35]} c={c} r={1} />
    <Boite p={[0, 0.09, 0]} t={[0.44, 0.06, 0.34]} c={c} r={1} />
  </group>
);

const Jerrican: React.FC<P> = ({ c = "#2f5d8a" }) => (
  <group>
    <Boite p={[0, 0.2, 0]} t={[0.34, 0.4, 0.17]} c={c} r={0.6} />
    <Boite p={[-0.06, 0.43, 0]} t={[0.16, 0.05, 0.05]} c={c} r={0.6} />
    <mesh position={[0.12, 0.43, 0]}>
      <cylinderGeometry args={[0.025, 0.025, 0.05, 12]} />
      <meshStandardMaterial color="#d8c33c" roughness={0.5} />
    </mesh>
  </group>
);

const Carton: React.FC<P> = ({ c = "#a07a4e" }) => (
  <group>
    <Boite p={[0, 0.18, 0]} t={[0.5, 0.36, 0.38]} c={c} r={1} />
    <Boite p={[0, 0.361, 0]} t={[0.04, 0.002, 0.38]} c="#c8b48a" r={0.8} />
  </group>
);

const COMPOSANTS: Record<TypeMeuble, React.FC<P>> = {
  table: Table, chaise: Chaise, lit: Lit, canape: Canape, etagere: Etagere, frigo: Frigo, placard: Placard,
  radiateur: Radiateur, tapis: Tapis, cuisiniere: Cuisiniere, evier: Evier, bouteille: Bouteille, conserve: Conserve,
  radio: Radio, couverture: Couverture, jerrican: Jerrican, carton: Carton,
};

export const Meuble: React.FC<{ meuble: DonneesMeuble }> = ({ meuble: m }) => {
  const C = COMPOSANTS[m.type];
  return (
    <group position={m.position} rotation={[0, ((m.rotation ?? 0) * Math.PI) / 180, 0]} scale={m.echelle ?? 1}>
      <C c={m.couleur} />
    </group>
  );
};
