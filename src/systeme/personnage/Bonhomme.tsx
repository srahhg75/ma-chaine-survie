import React from "react";
import { Vec3 } from "../maths";
import { LampeTorche } from "../kit3d/Lumieres";
import { CORPS, hauteurBassin, Pose } from "./poses";

/*
 * « Le bonhomme » : personnage original de la chaîne. Grosse tête, petit corps trapu, grands yeux noirs
 * brillants, chapka moutarde à oreillettes et bordure fourrée crème, pansement sur la joue, écharpe rouge, parka kaki,
 * petit sac à dos de survie. Il regarde vers +Z.
 * Signes : bras/cuisses vers l'avant = rotation X négative ; genou plié = X positive ; coude plié = X négative.
 */
export type Couleurs = { peau: string; parka: string; pantalon: string; bottes: string; bonnet: string; revers: string; echarpe: string; sac: string };
export type Variante = "bonhomme" | "heroine";
export const COULEURS_HEROINE: Couleurs = {
  peau: "#f0c39c",
  parka: "#2f6f73",
  pantalon: "#3b3046",
  bottes: "#3f2c22",
  bonnet: "#6b3a22", // cheveux (carré châtain)
  revers: "#d9a52b", // bandeau tricoté
  echarpe: "#d9a52b",
  sac: "#7a5236",
};
export const COULEURS_DEFAUT: Couleurs = {
  peau: "#e9b98f",
  parka: "#5f6e3c",
  pantalon: "#2e3442",
  bottes: "#4a3424",
  bonnet: "#c98a2a",
  revers: "#efe3cc",
  echarpe: "#b3262d",
  sac: "#6a4a2f",
};

const rad = (d: number) => (d * Math.PI) / 180;
const Mat: React.FC<{ c: string; r?: number }> = ({ c, r = 0.85 }) => <meshStandardMaterial color={c} roughness={r} />;

const Jambe: React.FC<{ cote: 1 | -1; hanche: [number, number]; genou: number; c: Couleurs }> = ({ cote, hanche, genou, c }) => (
  <group position={[cote * CORPS.ecartHanches, 0, 0]} rotation={[-rad(hanche[0]), 0, cote * rad(hanche[1])]}>
    <mesh position={[0, -CORPS.cuisse / 2, 0]} castShadow>
      <capsuleGeometry args={[0.062, CORPS.cuisse - 0.04, 6, 12]} />
      <Mat c={c.pantalon} />
    </mesh>
    <group position={[0, -CORPS.cuisse, 0]} rotation={[rad(genou), 0, 0]}>
      <mesh position={[0, -CORPS.tibia / 2, 0]} castShadow>
        <capsuleGeometry args={[0.056, CORPS.tibia - 0.04, 6, 12]} />
        <Mat c={c.pantalon} />
      </mesh>
      {/* botte (compense la flexion pour rester à plat) */}
      <group position={[0, -CORPS.tibia, 0]} rotation={[-rad(genou - hanche[0]), 0, 0]}>
        <mesh position={[0, -CORPS.semelle / 2 + 0.005, 0.03]} castShadow>
          <boxGeometry args={[0.11, CORPS.semelle, 0.19]} />
          <Mat c={c.bottes} r={0.7} />
        </mesh>
      </group>
    </group>
  </group>
);

const Bras: React.FC<{ cote: 1 | -1; epaule: [number, number]; coude: number; c: Couleurs; lampe?: boolean }> = ({ cote, epaule, coude, c, lampe }) => (
  <group position={[cote * CORPS.ecartEpaules, 0, 0]} rotation={[-rad(epaule[0]), 0, cote * rad(epaule[1])]}>
    <mesh position={[0, -CORPS.brasHaut / 2, 0]} castShadow>
      <capsuleGeometry args={[0.052, CORPS.brasHaut - 0.03, 6, 12]} />
      <Mat c={c.parka} />
    </mesh>
    <group position={[0, -CORPS.brasHaut, 0]} rotation={[-rad(coude), 0, 0]}>
      <mesh position={[0, -CORPS.avantBras / 2, 0]} castShadow>
        <capsuleGeometry args={[0.046, CORPS.avantBras - 0.03, 6, 12]} />
        <Mat c={c.parka} />
      </mesh>
      {/* moufle */}
      <mesh position={[0, -CORPS.avantBras - 0.02, 0]} castShadow>
        <sphereGeometry args={[0.052, 14, 14]} />
        <Mat c={c.echarpe} r={1} />
      </mesh>
      {lampe && (
        // La lampe pointe dans le prolongement de l'avant-bras
        <group position={[0, -CORPS.avantBras - 0.04, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <LampeTorche />
        </group>
      )}
    </group>
  </group>
);

// Carré à frange + bandeau tricoté (héroïne)
const Carre: React.FC<{ c: Couleurs }> = ({ c }) => {
  const R = CORPS.rayonTete;
  const avant = Math.PI / 2; // +Z (visage) dans la paramétrisation de SphereGeometry
  return (
    <group>
      {/* masse de cheveux : ouverte devant pour le visage, s'arrête au niveau de la mâchoire */}
      <mesh position={[0, 0.0, -0.01]} scale={[1.09, 1.06, 1.08]} castShadow>
        <sphereGeometry args={[R, 40, 24, avant + 0.95, Math.PI * 2 - 1.9, 0, Math.PI * 0.66]} />
        <meshStandardMaterial color={c.bonnet} roughness={0.55} side={2} />
      </mesh>
      {/* frange */}
      <mesh position={[0, 0.012, 0.004]} scale={[1.07, 1.05, 1.07]} castShadow>
        <sphereGeometry args={[R, 40, 12, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
        <meshStandardMaterial color={c.bonnet} roughness={0.55} />
      </mesh>
      {/* bandeau tricoté */}
      <mesh position={[0, R * 0.62, -0.02]} rotation={[Math.PI / 2 - 0.35, 0, 0]}>
        <torusGeometry args={[R * 0.8, 0.032, 10, 32]} />
        <Mat c={c.revers} r={1} />
      </mesh>
    </group>
  );
};

const Tete: React.FC<{ pose: Pose; c: Couleurs; variante: Variante }> = ({ pose, c, variante }) => {
  const R = CORPS.rayonTete;
  const s = pose.sourcils;
  return (
    <group rotation={[rad(pose.tete[0]), rad(pose.tete[1]), 0]}>
      <group position={[0, R + CORPS.cou, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[R, 32, 24]} />
          <Mat c={c.peau} r={0.7} />
        </mesh>
        {/* grands yeux noirs brillants */}
        {[-1, 1].map((k) => (
          <group key={k} position={[k * 0.095, 0.0, R * 0.9]} rotation={[0, k * 0.28, 0]}>
            <mesh scale={[1, 1.28, 0.55]}>
              <sphereGeometry args={[0.068, 24, 18]} />
              <meshPhysicalMaterial color="#050506" roughness={0.12} clearcoat={1} clearcoatRoughness={0.05} />
            </mesh>
            <mesh position={[0.022, 0.03, 0.03]}>
              <sphereGeometry args={[0.016, 10, 10]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            {/* sourcil : inquiet (s<0) = bout intérieur relevé, décidé (s>0) = bout intérieur baissé */}
            <mesh position={[0, 0.098, 0.035]} rotation={[0, 0, k * rad(18 * s)]}>
              <boxGeometry args={[0.09, 0.018, 0.02]} />
              <Mat c="#3a2a1e" />
            </mesh>
          </group>
        ))}
        {/* taches de rousseur (héroïne) */}
        {variante === "heroine" &&
          [[-0.15, -0.07], [-0.12, -0.09], [-0.17, -0.1], [0.15, -0.07], [0.12, -0.09], [0.17, -0.1]].map(([x, y], i) => (
            <mesh key={i} position={[x, y, Math.sqrt(R * R - x * x - y * y) - 0.002]}>
              <sphereGeometry args={[0.007, 6, 6]} />
              <Mat c="#b7714a" />
            </mesh>
          ))}
        {/* pansement sur la joue (signe distinctif du bonhomme) */}
        <group visible={variante === "bonhomme"} position={[0.15, -0.075, R * 0.83]} rotation={[0, 0.5, 0.35]}>
          <mesh>
            <boxGeometry args={[0.075, 0.026, 0.008]} />
            <Mat c="#e9d2a8" r={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.075, 0.026, 0.008]} />
            <Mat c="#e9d2a8" r={0.9} />
          </mesh>
        </group>
        {/* nez et bouche */}
        <mesh position={[0, -0.06, R * 0.98]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <Mat c="#d99c74" r={0.7} />
        </mesh>
        <mesh position={[0, -0.13, R * 0.9]} rotation={[0, 0, Math.PI]} scale={[1, s < 0 ? 0.6 : 0.35, 1]}>
          <torusGeometry args={[0.035, 0.008, 6, 16, Math.PI]} />
          <Mat c="#5a2a24" />
        </mesh>
        {variante === "heroine" && <Carre c={c} />}
        {/* chapka (signe distinctif du bonhomme) : calotte moutarde, bordure fourrée, oreillettes rabattues */}
        <group visible={variante === "bonhomme"}>
        <mesh position={[0, 0.02, 0]} scale={[1.05, 1.0, 1.05]} castShadow>
          <sphereGeometry args={[R, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.36]} />
          <Mat c={c.bonnet} r={0.95} />
        </mesh>
        {/* couture sur le dessus */}
        <mesh position={[0, R * 1.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.05, 0.012, 6, 16, Math.PI]} />
          <Mat c={c.revers} />
        </mesh>
        {/* bordure fourrée relevée sur le front */}
        <mesh position={[0, R * 0.56, -0.01]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
          <torusGeometry args={[R * 0.86, 0.05, 10, 32]} />
          <Mat c={c.revers} r={1} />
        </mesh>
        {/* oreillettes */}
        {[-1, 1].map((k) => (
          <group key={k} position={[k * R * 0.93, -0.02, -0.02]} rotation={[0, 0, k * 0.12]}>
            <mesh scale={[0.35, 1, 0.75]} castShadow>
              <sphereGeometry args={[0.12, 16, 12]} />
              <Mat c={c.bonnet} r={0.95} />
            </mesh>
            <mesh position={[0, -0.1, 0]} scale={[0.4, 0.35, 0.8]}>
              <sphereGeometry args={[0.1, 12, 10]} />
              <Mat c={c.revers} r={1} />
            </mesh>
          </group>
        ))}
        </group>
      </group>
    </group>
  );
};

export const Bonhomme: React.FC<{
  pose: Pose;
  position: Vec3;
  orientation: number; // degrés
  lampe?: boolean;
  taille?: number;
  couleurs?: Partial<Couleurs>;
  variante?: Variante;
}> = ({ pose, position, orientation, lampe = false, taille = 1, couleurs, variante = "bonhomme" }) => {
  const c = { ...(variante === "heroine" ? COULEURS_HEROINE : COULEURS_DEFAUT), ...couleurs };
  const yBassin = hauteurBassin(pose);
  return (
    <group position={position} rotation={[0, rad(orientation), 0]} scale={taille}>
      <group position={[0, yBassin, 0]}>
        <Jambe cote={1} hanche={pose.hancheG} genou={pose.genouG} c={c} />
        <Jambe cote={-1} hanche={pose.hancheD} genou={pose.genouD} c={c} />
        {/* tronc (pivote au bassin) */}
        <group rotation={[rad(pose.tronc[0]), rad(pose.tronc[1]), rad(pose.tronc[2])]}>
          <mesh position={[0, 0.17, 0]} scale={[1, 1, 0.78]} castShadow>
            <capsuleGeometry args={[0.17, 0.2, 8, 20]} />
            <Mat c={c.parka} />
          </mesh>
          {/* fermeture + poches */}
          <mesh position={[0, 0.17, 0.133]}>
            <boxGeometry args={[0.012, 0.3, 0.004]} />
            <Mat c="#3c4626" />
          </mesh>
          {/* sac à dos de survie + bretelles */}
          <mesh position={[0, 0.2, -0.155]} castShadow>
            <boxGeometry args={[0.26, 0.3, 0.12]} />
            <Mat c={c.sac} r={0.9} />
          </mesh>
          <mesh position={[0, 0.11, -0.22]} castShadow>
            <boxGeometry args={[0.2, 0.12, 0.04]} />
            <Mat c={c.sac} r={0.9} />
          </mesh>
          {[-1, 1].map((k) => (
            <mesh key={k} position={[k * 0.09, 0.22, 0.128]} rotation={[0.08, 0, 0]}>
              <boxGeometry args={[0.035, 0.28, 0.012]} />
              <Mat c="#3b2a1a" />
            </mesh>
          ))}
          {/* écharpe */}
          <mesh position={[0, CORPS.bassinVersEpaules + 0.005, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.105, 0.045, 10, 24]} />
            <Mat c={c.echarpe} r={1} />
          </mesh>
          <mesh position={[0.06, CORPS.bassinVersEpaules - 0.1, 0.12]} rotation={[0.15, 0, 0.1]} castShadow>
            <boxGeometry args={[0.06, 0.16, 0.025]} />
            <Mat c={c.echarpe} r={1} />
          </mesh>
          <group position={[0, CORPS.bassinVersEpaules - 0.04, 0]}>
            <Bras cote={1} epaule={pose.epauleG} coude={pose.coudeG} c={c} />
            <Bras cote={-1} epaule={pose.epauleD} coude={pose.coudeD} c={c} lampe={lampe} />
          </group>
          <group position={[0, CORPS.bassinVersEpaules, 0]}>
            <Tete pose={pose} c={c} variante={variante} />
          </group>
        </group>
      </group>
    </group>
  );
};
