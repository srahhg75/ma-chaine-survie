import React, { useLayoutEffect, useMemo, useRef } from "react";
import { AdditiveBlending, Group, Mesh, ShaderMaterial } from "three";
import { useCurrentFrame } from "remotion";

/*
 * « Fantôme » : ce qui arriverait avec le MAUVAIS réflexe. Rouge translucide, hachures diagonales qui défilent
 * (calculées en pixels d'écran : lisibles à toute distance), bord plus lumineux. Ne projette pas d'ombre.
 * Usage : <Fantome opacite={0..1}> objets 3D </Fantome>  (les matériaux des enfants sont remplacés).
 */
const vertex = /* glsl */ `
  varying vec3 vNormale;
  varying vec3 vVue;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormale = normalize(normalMatrix * normal);
    vVue = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`;
const fragment = /* glsl */ `
  uniform float opacite;
  uniform float temps;
  varying vec3 vNormale;
  varying vec3 vVue;
  void main() {
    float bord = pow(max(1.0 - abs(dot(normalize(vNormale), normalize(vVue))), 0.0), 2.0);
    float h = fract((gl_FragCoord.x + gl_FragCoord.y) / 22.0 - temps * 0.6);
    float hachure = smoothstep(0.45, 0.5, h) - smoothstep(0.85, 0.9, h);
    vec3 c = vec3(1.0, 0.16, 0.12);
    float a = (0.22 + 0.38 * hachure + 0.5 * bord) * opacite;
    gl_FragColor = vec4(c * (0.7 + 0.6 * bord), a);
  }`;

export const Fantome: React.FC<{ opacite: number; children: React.ReactNode }> = ({ opacite, children }) => {
  const groupe = useRef<Group>(null);
  const frame = useCurrentFrame();
  const materiau = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { opacite: { value: 0 }, temps: { value: 0 } },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      }),
    [],
  );
  materiau.uniforms.opacite.value = opacite;
  materiau.uniforms.temps.value = frame / 30;
  // Remplace les matériaux à chaque rendu (les enfants peuvent recréer les leurs)
  useLayoutEffect(() => {
    groupe.current?.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh) {
        m.material = materiau;
        m.castShadow = false;
        m.receiveShadow = false;
      }
      // les lumières des enfants (lampe torche…) n'ont rien à faire dans un fantôme
      if ((o as { isLight?: boolean }).isLight) o.visible = false;
    });
  });
  if (opacite <= 0.001) return null;
  return <group ref={groupe}>{children}</group>;
};
