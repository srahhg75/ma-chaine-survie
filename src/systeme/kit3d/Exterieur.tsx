import React, { useMemo } from "react";
import { AdditiveBlending, BackSide, BufferAttribute, BufferGeometry, CanvasTexture, Color, Texture } from "three";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { facadeLumineuse, repeter, texture } from "./textures";

// ---------- Ciel nocturne : dégradé (shader), étoiles, lune ----------
const vertexCiel = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
// max(x, 0.) avant pow : un NaN dans un shader noircit toute l'image
const fragmentCiel = /* glsl */ `
uniform vec3 zenith;
uniform vec3 horizon;
uniform vec3 sol;
varying vec3 vDir;
void main() {
  float h = vDir.y;
  vec3 c = mix(horizon, zenith, pow(max(h, 0.0), 0.55));
  c = mix(c, sol, smoothstep(0.0, -0.08, h));
  gl_FragColor = vec4(c, 1.0);
}`;

export const Ciel: React.FC<{ type?: "nuit" | "crepuscule" }> = ({ type = "nuit" }) => {
  const uniforms = useMemo(
    () => ({
      zenith: { value: new Color(type === "nuit" ? "#03050c" : "#141a33") },
      horizon: { value: new Color(type === "nuit" ? "#1a2238" : "#4a3a4e") },
      sol: { value: new Color("#06070a") },
    }),
    [type],
  );
  const etoiles = useMemo(() => {
    const n = 900;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = random(`et${i}`) * Math.PI * 2;
      const h = 0.08 + random(`eh${i}`) * 0.92;
      const r = Math.sqrt(1 - h * h);
      pos.set([Math.cos(u) * r * 180, h * 180, Math.sin(u) * r * 180], i * 3);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    return g;
  }, []);
  return (
    <group>
      <mesh>
        <sphereGeometry args={[190, 32, 16]} />
        <shaderMaterial vertexShader={vertexCiel} fragmentShader={fragmentCiel} uniforms={uniforms} side={BackSide} depthWrite={false} />
      </mesh>
      <points geometry={etoiles}>
        <pointsMaterial color="#cdd6ff" size={0.6} sizeAttenuation={false} transparent opacity={0.8} depthWrite={false} />
      </points>
      {/* lune */}
      <mesh position={[-60, 70, -140]}>
        <sphereGeometry args={[5, 24, 24]} />
        <meshBasicMaterial color="#e9edf7" toneMapped={false} />
      </mesh>
    </group>
  );
};

// ---------- Ville nocturne : immeubles, fenêtres allumées ou éteintes (panne) ----------
export const VilleNocturne: React.FC<{ allumees: number; distance?: number; neige?: boolean }> = ({ allumees, distance = 14, neige }) => {
  const batiments = useMemo(() => {
    const res: { x: number; z: number; l: number; h: number; p: number; teinte: string; i: number }[] = [];
    let i = 0;
    for (let rang = 0; rang < 3; rang++) {
      let x = -45 + random(`vx${rang}`) * 6;
      while (x < 45) {
        const l = 6 + random(`vl${i}`) * 8;
        const h = 8 + random(`vh${i}`) * (rang === 0 ? 16 : 28);
        res.push({
          x: x + l / 2,
          z: -distance - rang * 13 - random(`vz${i}`) * 4,
          l,
          h,
          p: 6 + random(`vp${i}`) * 5,
          teinte: ["#2b2e35", "#32302d", "#272b33", "#35322f"][i % 4],
          i,
        });
        x += l + 1.5 + random(`ve${i}`) * 3;
        i++;
      }
    }
    return res;
  }, [distance]);
  return (
    <group>
      {/* sol extérieur */}
      <mesh position={[0, -0.25, -distance - 10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[160, 60]} />
        <meshStandardMaterial color={neige ? "#c9d1dc" : "#1d1f22"} roughness={1} />
      </mesh>
      {batiments.map((b) => {
        const lum: Texture = repeter(facadeLumineuse(allumees, `b${b.i}`), b.l, b.h, 4);
        const fac: Texture = repeter(texture("facade", b.teinte, `f${b.i}`), b.l, b.h, 4);
        return (
          <group key={b.i} position={[b.x, b.h / 2 - 0.25, b.z]}>
            <mesh>
              <boxGeometry args={[b.l, b.h, b.p]} />
              <meshStandardMaterial map={fac} emissiveMap={lum} emissive="#ffffff" emissiveIntensity={1.6} roughness={0.95} />
            </mesh>
            {neige && (
              <mesh position={[0, b.h / 2 + 0.08, 0]}>
                <boxGeometry args={[b.l + 0.1, 0.16, b.p + 0.1]} />
                <meshStandardMaterial color="#dfe6ef" roughness={1} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

// ---------- Neige qui tombe (déterministe : position calculée à partir du temps) ----------
let flocon: CanvasTexture | null = null;
const textureFlocon = () => {
  if (flocon) return flocon;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  flocon = new CanvasTexture(c);
  return flocon;
};

export const Neige: React.FC<{
  centre?: [number, number, number];
  taille?: [number, number, number];
  densite?: number;
  vent?: number;
}> = ({ centre = [0, 6, -6], taille = [30, 14, 20], densite = 1, vent = 0.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.round(2500 * densite);
  const graines = useMemo(
    () => Array.from({ length: n }, (_, i) => [random(`nx${i}`), random(`ny${i}`), random(`nz${i}`), 0.5 + random(`nv${i}`) * 0.7, random(`np${i}`) * 6.28]),
    [n],
  );
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(n * 3), 3));
    return g;
  }, [n]);
  const t = frame / fps;
  const attr = geo.getAttribute("position") as BufferAttribute;
  for (let i = 0; i < n; i++) {
    const [gx, gy, gz, v, ph] = graines[i];
    const y = (((gy * taille[1] - v * t) % taille[1]) + taille[1]) % taille[1];
    const x = (((gx * taille[0] + vent * t + Math.sin(t * 0.9 + ph) * 0.3) % taille[0]) + taille[0]) % taille[0];
    attr.setXYZ(i, centre[0] - taille[0] / 2 + x, centre[1] - taille[1] / 2 + y, centre[2] - taille[2] / 2 + gz * taille[2]);
  }
  attr.needsUpdate = true;
  return (
    <points geometry={geo} frustumCulled={false}>
      <pointsMaterial map={textureFlocon()} color="#e8eef8" size={0.07} sizeAttenuation transparent depthWrite={false} blending={AdditiveBlending} opacity={0.85} />
    </points>
  );
};
