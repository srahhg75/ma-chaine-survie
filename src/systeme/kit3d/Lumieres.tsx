import React, { useMemo } from "react";
import { AdditiveBlending, DoubleSide, Object3D } from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { bruitFractal } from "../maths";

// Éclairage de base (leçon du 23/10 : hemisphereLight + directionnelle chaude ; décor toujours lisible).
export const EclairageBase: React.FC<{ intensite?: number; lune?: boolean }> = ({ intensite = 1, lune = true }) => (
  <>
    <hemisphereLight args={["#7d8fb0", "#2a2018", 0.9 * intensite]} />
    <directionalLight position={[5, 7, 6]} intensity={1.1 * intensite} color="#ffb070" />
    {lune && (
      <directionalLight
        position={[-6, 9, -10]}
        intensity={0.9 * intensite}
        color="#9fb4e0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0008}
      />
    )}
  </>
);

// Bougie qui vacille (flamme + lumière chaude), vacillement déterministe
export const Bougie: React.FC<{ position: [number, number, number]; allumee?: boolean; hauteur?: number; graine?: string; puissance?: number }> = ({
  position,
  allumee = true,
  hauteur = 0.14,
  graine = "bougie",
  puissance = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const vac = bruitFractal(graine, t * 7);
  const intensite = 3.2 * puissance * (1 + 0.18 * vac);
  const etire = 1 + 0.2 * bruitFractal(`${graine}e`, t * 9);
  const penche = 0.06 * bruitFractal(`${graine}p`, t * 4);
  return (
    <group position={position}>
      {/* cire + coupelle */}
      <mesh position={[0, hauteur / 2, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.03, hauteur, 20]} />
        <meshStandardMaterial color="#efe6d2" roughness={0.6} emissive="#ff9a40" emissiveIntensity={allumee ? 0.12 : 0} />
      </mesh>
      <mesh position={[0, 0.006, 0]}>
        <cylinderGeometry args={[0.055, 0.06, 0.012, 24]} />
        <meshStandardMaterial color="#8d8a84" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, hauteur + 0.008, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.016, 6]} />
        <meshStandardMaterial color="#1a1208" />
      </mesh>
      {allumee && (
        <group position={[0, hauteur + 0.03, 0]} rotation={[0, 0, penche]} scale={[1, etire, 1]}>
          <mesh scale={[0.012, 0.03, 0.012]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color="#ffb347" toneMapped={false} transparent opacity={0.9} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh scale={[0.006, 0.016, 0.006]} position={[0, -0.006, 0]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial color="#fff4d6" toneMapped={false} />
          </mesh>
          <pointLight intensity={intensite} color="#ff9a45" distance={0} decay={2} position={[0, 0.02, 0]} />
        </group>
      )}
    </group>
  );
};

// Lampe torche : corps + faisceau (spot avec ombres) + cône lumineux visible. Éclaire selon son axe +Z local.
export const LampeTorche: React.FC<{ allumee?: boolean; puissance?: number; ombres?: boolean }> = ({ allumee = true, puissance = 1, ombres = true }) => {
  const cible = useMemo(() => {
    const o = new Object3D();
    o.position.set(0, 0, 3);
    return o;
  }, []);
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.018, 0.17, 16]} />
        <meshStandardMaterial color="#1f2326" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.09]}>
        <cylinderGeometry args={[0.03, 0.024, 0.04, 16]} />
        <meshStandardMaterial color="#2a2f33" metalness={0.6} roughness={0.35} />
      </mesh>
      {allumee && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.111]}>
            <circleGeometry args={[0.026, 20]} />
            <meshBasicMaterial color="#fffbe8" toneMapped={false} side={DoubleSide} />
          </mesh>
          <primitive object={cible} />
          <spotLight
            target={cible}
            position={[0, 0, 0.11]}
            intensity={45 * puissance}
            angle={0.38}
            penumbra={0.55}
            decay={2}
            distance={0}
            color="#fff1d8"
            castShadow={ombres}
            shadow-mapSize={[512, 512]}
            shadow-bias={-0.0005}
          />
          {/* faisceau visible */}
          <mesh position={[0, 0, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.38, 1.8, 24, 1, true]} />
            <meshBasicMaterial color="#fff2cf" transparent opacity={0.045} blending={AdditiveBlending} depthWrite={false} side={DoubleSide} toneMapped={false} />
          </mesh>
        </>
      )}
    </group>
  );
};
