import React, { useMemo } from "react";
import { AdditiveBlending, DoubleSide } from "three";
import { random } from "remotion";
import { Arrondi } from "./Arrondi";
import { useMateriauPBR } from "./pbr";

/*
 * Mobilier détaillé (direction artistique « 3D stylisée » : arêtes arrondies, vraies textures PBR, petits objets).
 * Origine de chaque meuble = centre au sol ; il « regarde » vers +Z (rotation y pour l'orienter).
 */
type G = { position?: [number, number, number]; rotation?: number };
const grp = (g: G) => ({ position: g.position, rotation: [0, ((g.rotation ?? 0) * Math.PI) / 180, 0] as [number, number, number] });

// ---------- Canapé en tissu, coussins, plaid ----------
export const CanapeTissu: React.FC<G & { couleur?: string; largeur?: number }> = ({ couleur = "#8c5a4a", largeur = 2.0, ...g }) => {
  const tissu = useMateriauPBR("poly_wool_herringbone", { repetition: [3, 2], teinte: couleur, relief: 0.8 });
  const bois = useMateriauPBR("laminate_floor_02", { repetition: [0.3, 0.3], teinte: "#5a3a26" });
  const L = largeur;
  return (
    <group {...grp(g)}>
      <Arrondi taille={[L, 0.3, 0.86]} position={[0, 0.27, 0]} rayon={0.06} materiau={tissu} />
      <Arrondi taille={[L, 0.52, 0.2]} position={[0, 0.58, -0.33]} rayon={0.08} materiau={tissu} />
      {[-1, 1].map((k) => (
        <Arrondi key={k} taille={[0.18, 0.5, 0.86]} position={[k * (L / 2 - 0.09), 0.37, 0]} rayon={0.07} materiau={tissu} />
      ))}
      {/* assises (2 coussins) */}
      {[-1, 1].map((k) => (
        <Arrondi key={`a${k}`} taille={[(L - 0.4) / 2 - 0.01, 0.13, 0.66]} position={[k * ((L - 0.4) / 4 + 0.005), 0.48, 0.06]} rayon={0.05} materiau={tissu} />
      ))}
      {/* coussins de dossier, légèrement inclinés */}
      {[-1, 1].map((k) => (
        <Arrondi key={`d${k}`} taille={[(L - 0.4) / 2 - 0.04, 0.38, 0.14]} position={[k * ((L - 0.4) / 4 + 0.01), 0.72, -0.2]} rotation={[-0.18, 0, 0]} rayon={0.06} materiau={tissu} />
      ))}
      {/* coussin décoratif + plaid */}
      <Arrondi taille={[0.34, 0.32, 0.12]} position={[L / 2 - 0.36, 0.68, -0.08]} rotation={[-0.3, -0.35, 0.12]} rayon={0.05} couleur="#d9a52b" rugosite={1} />
      <Arrondi taille={[0.5, 0.04, 0.62]} position={[-L / 2 + 0.5, 0.56, 0.08]} rotation={[0, 0.2, 0.04]} rayon={0.02} couleur="#3f5f7a" rugosite={1} />
      {/* pieds */}
      {[-1, 1].flatMap((kx) =>
        [-1, 1].map((kz) => <Arrondi key={`p${kx}${kz}`} taille={[0.05, 0.12, 0.05]} position={[kx * (L / 2 - 0.08), 0.06, kz * 0.34]} rayon={0.012} materiau={bois} />),
      )}
    </group>
  );
};

// ---------- Table basse, tasse, livres ----------
export const TableBasse: React.FC<G> = (g) => {
  const bois = useMateriauPBR("laminate_floor_02", { repetition: [1, 0.6], teinte: "#c9a27a" });
  return (
    <group {...grp(g)}>
      <Arrondi taille={[1.0, 0.05, 0.55]} position={[0, 0.4, 0]} rayon={0.02} materiau={bois} />
      <Arrondi taille={[0.92, 0.02, 0.47]} position={[0, 0.14, 0]} rayon={0.008} materiau={bois} />
      {[-1, 1].flatMap((kx) => [-1, 1].map((kz) => <Arrondi key={`${kx}${kz}`} taille={[0.04, 0.38, 0.04]} position={[kx * 0.45, 0.19, kz * 0.23]} rayon={0.01} materiau={bois} />))}
      {/* tasse */}
      <group position={[0.22, 0.425, 0.05]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.034, 0.09, 20]} />
          <meshStandardMaterial color="#e9e4d8" roughness={0.35} />
        </mesh>
        <mesh position={[0.045, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.022, 0.007, 8, 16]} />
          <meshStandardMaterial color="#e9e4d8" roughness={0.35} />
        </mesh>
      </group>
      {/* pile de livres */}
      {[["#7b2f2a", 0.03], ["#2f4f6a", 0.025], ["#c9a24a", 0.028]].map(([c, h], i) => (
        <Arrondi key={i} taille={[0.26, h as number, 0.18]} position={[-0.25, 0.44 + i * 0.03, -0.03]} rotation={[0, 0.15 * (i - 1), 0]} rayon={0.005} couleur={c as string} rugosite={0.9} />
      ))}
    </group>
  );
};

// ---------- Lampadaire (abat-jour lumineux, lumière chaude avec ombres) ----------
export const Lampadaire: React.FC<G & { allume: number; ombres?: boolean }> = ({ allume, ombres = true, ...g }) => (
  <group {...grp(g)}>
    <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.16, 0.18, 0.03, 32]} />
      <meshStandardMaterial color="#2b2b2e" metalness={0.7} roughness={0.35} />
    </mesh>
    <mesh position={[0, 0.78, 0]} castShadow>
      <cylinderGeometry args={[0.012, 0.012, 1.5, 12]} />
      <meshStandardMaterial color="#2b2b2e" metalness={0.8} roughness={0.3} />
    </mesh>
    <mesh position={[0, 1.55, 0]} castShadow>
      <cylinderGeometry args={[0.15, 0.22, 0.26, 32, 1, true]} />
      <meshStandardMaterial color="#f1e2c4" roughness={0.9} side={DoubleSide} emissive="#ffb76b" emissiveIntensity={0.3 * allume} transparent opacity={0.96} />
    </mesh>
    <mesh position={[0, 1.5, 0]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#ffe2b8" transparent opacity={allume} />
    </mesh>
    {allume > 0.01 && (
      <pointLight
        position={[0, 1.48, 0]}
        intensity={3.0 * allume}
        color="#ffb46b"
        decay={2}
        distance={5}
        castShadow={ombres}
        shadow-mapSize={[1024, 1024]}
        shadow-radius={6}
        shadow-bias={-0.002}
      />
    )}
  </group>
);

// ---------- Bibliothèque garnie ----------
export const Bibliotheque: React.FC<G & { graine?: string }> = ({ graine = "biblio", ...g }) => {
  const bois = useMateriauPBR("laminate_floor_02", { repetition: [0.6, 1.2], teinte: "#8a6446" });
  const livres = useMemo(() => {
    const res: { x: number; y: number; l: number; h: number; c: string; r: number }[] = [];
    const couleurs = ["#7b2f2a", "#2f4f6a", "#c9a24a", "#3f6a4a", "#d9d2c0", "#5a3a5a", "#a65a2a", "#1f2a33"];
    [0.06, 0.46, 0.86, 1.26].forEach((y, rang) => {
      let x = -0.4;
      let k = 0;
      while (x < 0.36) {
        if (random(`${graine}vide${rang}${k}`) < 0.1) {
          x += 0.12;
          k++;
          continue;
        }
        const l = 0.03 + random(`${graine}l${rang}${k}`) * 0.03;
        const h = 0.22 + random(`${graine}h${rang}${k}`) * 0.1;
        res.push({ x: x + l / 2, y: y + h / 2 + 0.015, l, h, c: couleurs[Math.floor(random(`${graine}c${rang}${k}`) * couleurs.length)], r: random(`${graine}r${rang}${k}`) < 0.12 ? 0.25 : 0 });
        x += l + 0.004;
        k++;
      }
    });
    return res;
  }, [graine]);
  return (
    <group {...grp(g)}>
      <Arrondi taille={[0.9, 1.7, 0.03]} position={[0, 0.85, -0.15]} rayon={0.01} materiau={bois} />
      {[-1, 1].map((k) => (
        <Arrondi key={k} taille={[0.035, 1.7, 0.32]} position={[k * 0.435, 0.85, 0]} rayon={0.01} materiau={bois} />
      ))}
      {[0.02, 0.44, 0.84, 1.24, 1.68].map((y, i) => (
        <Arrondi key={`e${i}`} taille={[0.86, 0.03, 0.3]} position={[0, y, 0]} rayon={0.008} materiau={bois} />
      ))}
      {livres.map((b, i) => (
        <Arrondi key={`l${i}`} taille={[b.l, b.h, 0.2]} position={[b.x, b.y, 0.02]} rotation={[0, 0, b.r]} rayon={0.004} couleur={b.c} rugosite={0.85} />
      ))}
      {/* petit vase sur le haut */}
      <mesh position={[0.25, 1.78, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.035, 0.16, 20]} />
        <meshStandardMaterial color="#3f6a6a" roughness={0.3} />
      </mesh>
    </group>
  );
};

// ---------- Plante en pot (feuillage stylisé) ----------
export const Plante: React.FC<G & { graine?: string }> = ({ graine = "plante", ...g }) => {
  const feuilles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2 + random(`${graine}a${i}`) * 0.5;
        const h = 0.55 + random(`${graine}h${i}`) * 0.5;
        return { a, h, inc: 0.5 + random(`${graine}i${i}`) * 0.5, t: 0.85 + random(`${graine}t${i}`) * 0.4 };
      }),
    [graine],
  );
  return (
    <group {...grp(g)}>
      <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.19, 0.14, 0.34, 28]} />
        <meshStandardMaterial color="#c86f48" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.175, 0.175, 0.02, 28]} />
        <meshStandardMaterial color="#3a2a1e" roughness={1} />
      </mesh>
      {feuilles.map((f, i) => (
        <group key={i} position={[0, 0.34, 0]} rotation={[0, f.a, 0]}>
          <mesh position={[0, f.h * 0.5, 0.12]} rotation={[f.inc, 0, 0]} scale={[0.09 * f.t, 0.28 * f.t, 0.02]} castShadow>
            <sphereGeometry args={[1, 12, 10]} />
            <meshStandardMaterial color={i % 3 ? "#3f7a45" : "#2f6a3a"} roughness={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ---------- Rideaux (plis) ----------
export const Rideau: React.FC<G & { hauteur?: number; largeur?: number; couleur?: string }> = ({ hauteur = 2.1, largeur = 0.55, couleur = "#c9b48a", ...g }) => {
  const plis = 7;
  return (
    <group {...grp(g)}>
      {Array.from({ length: plis }, (_, i) => (
        <Arrondi
          key={i}
          taille={[largeur / plis + 0.03, hauteur, 0.05]}
          position={[-largeur / 2 + (i + 0.5) * (largeur / plis), hauteur / 2, (i % 2) * 0.035]}
          rayon={0.022}
          couleur={couleur}
          rugosite={1}
        />
      ))}
      <mesh position={[0, hauteur + 0.03, 0.02]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, largeur + 0.2, 10]} />
        <meshStandardMaterial color="#2b2b2e" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};

// ---------- Cadre (toile abstraite) ----------
export const Cadre: React.FC<G & { largeur?: number; hauteur?: number; teintes?: [string, string, string] }> = ({
  largeur = 0.5,
  hauteur = 0.38,
  teintes = ["#d9a52b", "#2f6f73", "#e8dccb"],
  ...g
}) => (
  <group {...grp(g)}>
    <Arrondi taille={[largeur, hauteur, 0.03]} rayon={0.008} couleur="#2b211a" />
    <mesh position={[0, 0, 0.016]}>
      <planeGeometry args={[largeur - 0.06, hauteur - 0.06]} />
      <meshStandardMaterial color={teintes[2]} roughness={0.9} />
    </mesh>
    <mesh position={[-largeur * 0.12, hauteur * 0.05, 0.018]}>
      <circleGeometry args={[hauteur * 0.24, 32]} />
      <meshStandardMaterial color={teintes[0]} roughness={0.9} />
    </mesh>
    <mesh position={[largeur * 0.15, -hauteur * 0.12, 0.019]}>
      <planeGeometry args={[largeur * 0.32, hauteur * 0.3]} />
      <meshStandardMaterial color={teintes[1]} roughness={0.9} />
    </mesh>
  </group>
);

// ---------- Tapis épais ----------
export const TapisEpais: React.FC<G & { largeur?: number; profondeur?: number; couleur?: string; bordure?: string }> = ({
  largeur = 2.0,
  profondeur = 1.4,
  couleur = "#b56a4a",
  bordure = "#e8dccb",
  ...g
}) => (
  <group {...grp(g)}>
    <Arrondi taille={[largeur, 0.02, profondeur]} position={[0, 0.01, 0]} rayon={0.008} couleur={bordure} rugosite={1} ombre={false} />
    <Arrondi taille={[largeur - 0.14, 0.022, profondeur - 0.14]} position={[0, 0.012, 0]} rayon={0.008} couleur={couleur} rugosite={1} ombre={false} />
  </group>
);

// ---------- Particules de poussière dans la lumière chaude ----------
export const Poussiere: React.FC<{ centre: [number, number, number]; taille: [number, number, number]; temps: number; intensite: number; n?: number }> = ({
  centre,
  taille,
  temps,
  intensite,
  n = 260,
}) => {
  const graines = useMemo(() => Array.from({ length: n }, (_, i) => [random(`px${i}`), random(`py${i}`), random(`pz${i}`), random(`pp${i}`) * 6.28, 0.6 + random(`ps${i}`)]), [n]);
  return (
    <group position={centre}>
      {graines.map(([gx, gy, gz, ph, sz], i) => {
        const x = (gx - 0.5) * taille[0] + Math.sin(temps * 0.25 * sz + ph) * 0.08;
        const y = ((((gy * taille[1] + temps * 0.04 * sz) % taille[1]) + taille[1]) % taille[1]) - taille[1] / 2;
        const z = (gz - 0.5) * taille[2] + Math.cos(temps * 0.2 * sz + ph) * 0.08;
        return (
          <mesh key={i} position={[x, y, z]} scale={0.006 * sz}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial color="#ffd8a0" transparent opacity={0.55 * intensite} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};
