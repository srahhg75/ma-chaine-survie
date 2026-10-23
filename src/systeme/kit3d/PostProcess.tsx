import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo } from "react";
import { HalfFloatType, Vector2, WebGLRenderTarget } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { useCurrentFrame } from "remotion";
import { OptionsPost } from "./PostProcess.types";

export type { OptionsPost };

/*
 * Post-traitement avec l'EffectComposer de three (PAS @react-three/postprocessing : rend noir sous Remotion).
 * Ordre : rendu -> occlusion ambiante (GTAO) -> bloom -> sortie (tone mapping + sRGB) -> vignette + grain.
 * Le grain dépend du numéro d'image (déterministe), jamais de Math.random().
 */
const VignetteGrain = {
  uniforms: {
    tDiffuse: { value: null },
    vignette: { value: 0.45 },
    grain: { value: 0.05 },
    image: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float vignette;
    uniform float grain;
    uniform float image;
    varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + image * 0.6180339) * 43758.5453); }
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 d = vUv - 0.5;
      d.x *= 0.5625; // format vertical : vignette ronde
      float v = smoothstep(0.75, 0.18, length(d) * 1.6);
      c.rgb *= mix(1.0 - vignette, 1.0, v);
      // grain plus visible dans les tons moyens ; max(.,0.) avant pow (jamais de NaN)
      float l = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      float n = (hash(vUv * 1000.0) - 0.5) * grain * (0.6 + 0.8 * pow(max(1.0 - l, 0.0), 1.5));
      c.rgb = max(c.rgb + n, 0.0);
      gl_FragColor = c;
    }`,
};

export const PostProcess: React.FC<OptionsPost> = ({ bloom = 0.55, seuilBloom = 0.85, vignette = 0.45, grain = 0.05, occlusion = true }) => {
  const { gl, scene, camera, size } = useThree();
  const frame = useCurrentFrame();

  const { composer, passeGrain } = useMemo(() => {
    const dpr = gl.getPixelRatio();
    const largeur = Math.round(size.width * dpr);
    const hauteur = Math.round(size.height * dpr);
    const cible = new WebGLRenderTarget(largeur, hauteur, { type: HalfFloatType, samples: 4 });
    const c = new EffectComposer(gl, cible);
    c.setPixelRatio(dpr);
    c.setSize(size.width, size.height);
    c.addPass(new RenderPass(scene, camera));
    if (occlusion) {
      const ao = new GTAOPass(scene, camera, largeur, hauteur);
      ao.updateGtaoMaterial({ radius: 0.35, distanceExponent: 1.5, thickness: 1, scale: 1, samples: 12 });
      ao.blendIntensity = 0.85;
      c.addPass(ao);
    }
    if (bloom > 0) c.addPass(new UnrealBloomPass(new Vector2(largeur, hauteur), bloom, 0.6, seuilBloom));
    c.addPass(new OutputPass());
    const g = new ShaderPass(VignetteGrain);
    g.uniforms.vignette.value = vignette;
    g.uniforms.grain.value = grain;
    c.addPass(g);
    return { composer: c, passeGrain: g };
  }, [gl, scene, camera, size.width, size.height, bloom, seuilBloom, vignette, grain, occlusion]);

  useEffect(() => () => composer.dispose(), [composer]);

  passeGrain.uniforms.image.value = frame % 997;
  // Priorité 1 : on prend la main sur le rendu de R3F
  useFrame(() => composer.render(), 1);
  return null;
};
