import React, { useMemo } from "react";
import { DoubleSide } from "three";
import { Vec3 } from "../maths";
import { CoteMur, DonneesPiece, EPAISSEUR_MUR, mursPiece, Ouverture } from "./decor";
import { repeter, texture, TypeTexture } from "./textures";

// Pièce en coupe : murs du fond entiers, murs de devant arasés (dessus sombre façon « plan de coupe »).
const COULEURS_SOL: Record<DonneesPiece["sol"], string> = {
  parquet: "#8a5a32",
  carrelage: "#b9b2a6",
  beton: "#77736d",
  moquette: "#5b4f45",
};
const COULEURS_MUR: Record<DonneesPiece["murs"], string> = {
  papier: "#8f8a6e",
  beton: "#8a8780",
  carrelage: "#d8d4ca",
  peint: "#a9a296",
};
const COUPE = "#17171b";

type Segment = { centre: Vec3; taille: Vec3 };

// Découpe un mur autour de ses ouvertures (pleins à gauche/droite, allège sous la fenêtre, linteau au-dessus)
const segmentsMur = (longueur: number, hauteur: number, ouvertures: Ouverture[]): { u0: number; u1: number; y0: number; y1: number }[] => {
  const res: { u0: number; u1: number; y0: number; y1: number }[] = [];
  let curseur = -longueur / 2;
  for (const o of [...ouvertures].sort((a, b) => a.centre - b.centre)) {
    const a = o.centre - o.largeur / 2;
    const b = o.centre + o.largeur / 2;
    const bas = o.type === "porte" ? 0 : o.bas ?? 0.9;
    if (a > curseur) res.push({ u0: curseur, u1: a, y0: 0, y1: hauteur });
    if (bas > 0) res.push({ u0: a, u1: b, y0: 0, y1: Math.min(bas, hauteur) });
    if (bas + o.hauteur < hauteur) res.push({ u0: a, u1: b, y0: bas + o.hauteur, y1: hauteur });
    curseur = b;
  }
  if (curseur < longueur / 2) res.push({ u0: curseur, u1: longueur / 2, y0: 0, y1: hauteur });
  return res.filter((s) => s.u1 - s.u0 > 0.001 && s.y1 - s.y0 > 0.001);
};

const Fenetre: React.FC<{ largeur: number; hauteur: number }> = ({ largeur, hauteur }) => {
  const c = 0.05;
  return (
    <group>
      {/* cadre */}
      {[
        [0, hauteur / 2 - c / 2, largeur, c],
        [0, -hauteur / 2 + c / 2, largeur, c],
        [-largeur / 2 + c / 2, 0, c, hauteur],
        [largeur / 2 - c / 2, 0, c, hauteur],
        [0, 0, c * 0.6, hauteur],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0]} castShadow>
          <boxGeometry args={[w, h, EPAISSEUR_MUR * 0.8]} />
          <meshStandardMaterial color="#d9d6cf" roughness={0.6} />
        </mesh>
      ))}
      {/* vitre */}
      <mesh>
        <planeGeometry args={[largeur - c, hauteur - c]} />
        <meshStandardMaterial color="#9fb6d6" transparent opacity={0.12} roughness={0.05} metalness={0.2} side={DoubleSide} depthWrite={false} />
      </mesh>
      {/* rebord */}
      <mesh position={[0, -hauteur / 2 - 0.02, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[largeur + 0.1, 0.04, 0.22]} />
        <meshStandardMaterial color="#cfcac0" roughness={0.7} />
      </mesh>
    </group>
  );
};

const Porte: React.FC<{ largeur: number; hauteur: number }> = ({ largeur, hauteur }) => (
  <group>
    <mesh position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[largeur - 0.04, hauteur - 0.02, 0.045]} />
      <meshStandardMaterial color="#6b4c33" roughness={0.75} />
    </mesh>
    <mesh position={[largeur / 2 - 0.12, 0, 0.04]}>
      <sphereGeometry args={[0.03, 12, 12]} />
      <meshStandardMaterial color="#b9a46a" metalness={0.8} roughness={0.3} />
    </mesh>
  </group>
);

export const Piece: React.FC<{ piece: DonneesPiece }> = ({ piece: p }) => {
  const h = p.hauteur ?? 2.6;
  const [cx, cz] = p.centre;
  const texSol = useMemo(
    () => repeter(texture(p.sol, p.couleurSol ?? COULEURS_SOL[p.sol], `${p.id}sol`), p.largeur, p.profondeur, p.sol === "carrelage" ? 1.2 : 2),
    [p],
  );
  const typeMur: TypeTexture = p.murs;
  const murs = mursPiece(p);

  return (
    <group>
      {/* sol */}
      <mesh position={[cx, -0.01, cz]} receiveShadow>
        <boxGeometry args={[p.largeur, 0.02, p.profondeur]} />
        <meshStandardMaterial map={texSol} roughness={p.sol === "carrelage" ? 0.35 : 0.8} />
      </mesh>
      {/* tranche du sol (coupe) */}
      <mesh position={[cx, -0.13, cz]}>
        <boxGeometry args={[p.largeur + EPAISSEUR_MUR, 0.22, p.profondeur + EPAISSEUR_MUR]} />
        <meshStandardMaterial color={COUPE} roughness={1} />
      </mesh>
      {murs.map((m) => {
        const cote = m.cote as CoteMur;
        const selonX = cote === "nord" || cote === "sud";
        const longueur = selonX ? p.largeur + EPAISSEUR_MUR : p.profondeur + EPAISSEUR_MUR;
        const hauteur = m.max[1];
        const ouvertures = (p.ouvertures ?? []).filter((o) => o.mur === cote);
        const segs = segmentsMur(longueur, hauteur, ouvertures);
        const centreMur: Vec3 = [(m.min[0] + m.max[0]) / 2, 0, (m.min[2] + m.max[2]) / 2];
        // Repère local du mur : x le long du mur (vers l'est pour nord/sud, vers le nord pour ouest/est),
        // z vers l'intérieur pour nord/ouest, vers l'extérieur pour sud/est
        const rotY = selonX ? 0 : Math.PI / 2;
        return (
          <group key={cote} position={centreMur} rotation={[0, rotY, 0]}>
            {segs.map((s, i) => {
              const seg: Segment = {
                centre: [(s.u0 + s.u1) / 2, (s.y0 + s.y1) / 2, 0],
                taille: [s.u1 - s.u0, s.y1 - s.y0, EPAISSEUR_MUR],
              };
              const tex = repeter(texture(typeMur, p.couleurMurs ?? COULEURS_MUR[p.murs], `${p.id}mur`), seg.taille[0], seg.taille[1], 2);
              return (
                <mesh key={i} position={seg.centre} castShadow receiveShadow>
                  <boxGeometry args={seg.taille} />
                  <meshStandardMaterial map={tex} roughness={0.9} />
                </mesh>
              );
            })}
            {/* dessus du mur : couleur de coupe */}
            <mesh position={[0, hauteur + 0.004, 0]}>
              <boxGeometry args={[longueur, 0.008, EPAISSEUR_MUR + 0.004]} />
              <meshStandardMaterial color={COUPE} roughness={1} />
            </mesh>
            {/* plinthe (côté intérieur), seulement sur les murs entiers */}
            {m.plein &&
              segs
                .filter((s) => s.y0 === 0)
                .map((s, i) => (
                  <mesh
                    key={`p${i}`}
                    position={[(s.u0 + s.u1) / 2, 0.05, (cote === "nord" || cote === "ouest" ? 1 : -1) * (EPAISSEUR_MUR / 2 + 0.006)]}
                  >
                    <boxGeometry args={[s.u1 - s.u0, 0.1, 0.012]} />
                    <meshStandardMaterial color="#d2cdc2" roughness={0.6} />
                  </mesh>
                ))}
            {ouvertures.map((o, i) => {
              const bas = o.type === "porte" ? 0 : o.bas ?? 0.9;
              if (bas >= hauteur) return null;
              return (
                <group key={`o${i}`} position={[o.centre, bas + o.hauteur / 2, 0]}>
                  {o.type === "fenetre" ? <Fenetre largeur={o.largeur} hauteur={o.hauteur} /> : <Porte largeur={o.largeur} hauteur={Math.min(o.hauteur, hauteur)} />}
                </group>
              );
            })}
          </group>
        );
      })}
      {p.plafonnier && (
        <group position={[cx, h - 0.35, cz]}>
          <mesh position={[0, 0.17, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.35]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#d8d2c4" roughness={0.3} />
          </mesh>
        </group>
      )}
    </group>
  );
};
