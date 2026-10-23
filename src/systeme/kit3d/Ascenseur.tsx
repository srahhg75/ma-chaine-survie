import React, { useMemo } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { Arrondi } from "./Arrondi";
import { EPAISSEUR_MUR } from "./decor";
import { useMateriauPBR } from "./pbr";

/*
 * Détails d'une cabine d'ascenseur posée dans une pièce « cabine » (murs PBR métal décrits dans donnees.ts).
 * Portes coulissantes sur le mur NORD (baie de type "passage"), tableau de boutons sur le mur OUEST,
 * afficheur d'étage au-dessus des portes, main courante, bandeau lumineux.
 */
export type PropsAscenseur = {
  centre: [number, number]; // x, z du centre de la cabine
  largeur: number;
  profondeur: number;
  hauteur?: number;
  largeurPortes?: number;
  ouverture: number; // 0 = fermées, 1 = ouvertes
  etage: string; // texte de l'afficheur
  boutonAllume: number; // 0..1 (bouton 0)
  lumiere: number; // intensité de l'éclairage de cabine (0..1)
  etages?: string[]; // boutons (le premier = celui qui s'allume)
};

const toile = (l: number, h: number, dessiner: (ctx: CanvasRenderingContext2D) => void) => {
  const c = document.createElement("canvas");
  c.width = l;
  c.height = h;
  dessiner(c.getContext("2d")!);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

// Plaque de boutons : numéros gravés, cercles en relief (dessinés)
const texturePlaque = (etages: string[]) =>
  toile(256, 512, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 256, 0);
    g.addColorStop(0, "#9aa0a6");
    g.addColorStop(0.5, "#c9ced3");
    g.addColorStop(1, "#8e949a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 512);
    for (let y = 0; y < 512; y += 3) {
      ctx.fillStyle = `rgba(255,255,255,${0.03 + (y % 7) * 0.004})`;
      ctx.fillRect(0, y, 256, 1); // brossé
    }
    etages.forEach((e, i) => {
      const col = i % 2;
      const rang = Math.floor(i / 2);
      const x = 80 + col * 96;
      const y = 440 - rang * 100;
      ctx.fillStyle = "#2a2d31";
      ctx.font = "bold 34px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(e, x - 48 + 6, y);
      ctx.beginPath();
      ctx.arc(x + 14, y, 26, 0, Math.PI * 2);
      ctx.fillStyle = "#6d7378";
      ctx.fill();
    });
    ctx.fillStyle = "#2a2d31";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("◀ ▶", 128, 52);
  });

const textureAfficheur = (texte: string) =>
  toile(256, 96, (ctx) => {
    ctx.fillStyle = "#0b0c0e";
    ctx.fillRect(0, 0, 256, 96);
    ctx.fillStyle = "#ff9a2e";
    ctx.shadowColor = "#ff7a1a";
    ctx.shadowBlur = 14;
    ctx.font = "bold 70px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`▼ ${texte}`, 128, 52);
  });

export const Ascenseur: React.FC<PropsAscenseur> = ({
  centre,
  largeur,
  profondeur,
  hauteur = 2.5,
  largeurPortes = 0.9,
  ouverture,
  etage,
  boutonAllume,
  lumiere,
  etages = ["0", "1", "2", "3", "4", "5"],
}) => {
  const [cx, cz] = centre;
  const nord = cz - profondeur / 2 + EPAISSEUR_MUR / 2; // face intérieure du mur nord
  const ouest = cx - largeur / 2 + EPAISSEUR_MUR / 2;
  const tole = useMateriauPBR("metal_plate_02", { repetition: [0.6, 1.4], teinte: "#c8d6e8", gain: 2.6, occlusion: 0.4, metal: 0.45, rugosite: 0.45, relief: 0.4 });
  const acier = useMateriauPBR("metal_plate_02", { repetition: [0.3, 0.3], teinte: "#e3e7eb", gain: 2.2, occlusion: 0.3, metal: 0.7, rugosite: 0.35, relief: 0.2 });
  const plaque = useMemo(() => texturePlaque(etages), [etages]);
  const afficheur = useMemo(() => textureAfficheur(etage), [etage]);
  const lp = largeurPortes / 2 + 0.015;
  const hp = 2.05;
  return (
    <group>
      {/* portes coulissantes (glissent devant les pans de mur, côté cabine) */}
      {[-1, 1].map((k) => (
        <group key={k} position={[cx + k * (lp / 2) + k * ouverture * lp, hp / 2, nord + 0.03]}>
          <Arrondi taille={[lp, hp, 0.03]} rayon={0.006} materiau={tole} />
          {/* joint central */}
          <mesh position={[-k * (lp / 2 - 0.004), 0, 0.016]}>
            <boxGeometry args={[0.006, hp - 0.02, 0.002]} />
            <meshStandardMaterial color="#2b2e33" />
          </mesh>
        </group>
      ))}
      {/* encadrement en acier */}
      <Arrondi taille={[largeurPortes + 0.16, 0.08, 0.05]} position={[cx, hp + 0.04, nord + 0.04]} rayon={0.01} materiau={acier} />
      {[-1, 1].map((k) => (
        <Arrondi key={`m${k}`} taille={[0.06, hp, 0.05]} position={[cx + k * (largeurPortes / 2 + 0.05), hp / 2, nord + 0.045]} rayon={0.01} materiau={acier} />
      ))}
      {/* afficheur d'étage */}
      <group position={[cx, hp + 0.2, nord + 0.02]}>
        <Arrondi taille={[0.36, 0.16, 0.03]} rayon={0.01} materiau={acier} />
        <mesh position={[0, 0, 0.016]}>
          <planeGeometry args={[0.3, 0.11]} />
          <meshStandardMaterial map={afficheur} emissiveMap={afficheur} emissive="#ffffff" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      </group>
      {/* tableau de boutons (mur ouest, près des portes) */}
      <group position={[ouest + 0.012, 1.15, nord + 0.32]} rotation={[0, Math.PI / 2, 0]}>
        <Arrondi taille={[0.2, 0.42, 0.02]} rayon={0.008} materiau={acier} />
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[0.18, 0.4]} />
          <meshStandardMaterial map={plaque} metalness={0.6} roughness={0.35} />
        </mesh>
        {etages.map((e, i) => {
          const col = i % 2;
          const rang = Math.floor(i / 2);
          const x = -0.09 + ((80 + col * 96 + 14) / 256) * 0.18;
          const y = 0.2 - ((440 - rang * 100) / 512) * 0.4;
          const allume = i === 0 ? boutonAllume : 0;
          return (
            <group key={e} position={[x, y, 0.014]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.016, 0.017, 0.008, 24]} />
                <meshStandardMaterial color="#cfd4d8" metalness={0.9} roughness={0.25} />
              </mesh>
              <mesh position={[0, 0.0045, 0]}>
                <torusGeometry args={[0.0135, 0.0022, 8, 24]} />
                <meshStandardMaterial color="#5a5f64" emissive="#ffae3a" emissiveIntensity={4 * allume} toneMapped={allume < 0.01} />
              </mesh>
            </group>
          );
        })}
      </group>
      {/* main courante (mur ouest) */}
      <group position={[ouest + 0.06, 0.92, cz + 0.12]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, profondeur - 0.6, 16]} />
          <meshStandardMaterial color="#d6dbe0" metalness={1} roughness={0.25} />
        </mesh>
        {[-1, 1].map((k) => (
          <mesh key={k} position={[-0.03, 0, k * ((profondeur - 0.6) / 2 - 0.02)]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.012, 0.012, 0.06, 10]} />
            <meshStandardMaterial color="#d6dbe0" metalness={1} roughness={0.25} />
          </mesh>
        ))}
      </group>
      {/* bandeau lumineux froid en haut des murs (pas de plafond : vue en coupe) */}
      <mesh position={[cx, hauteur - 0.06, nord + 0.012]}>
        <boxGeometry args={[largeur - 0.2, 0.04, 0.01]} />
        <meshStandardMaterial color="#e8f0ff" emissive="#dfe9ff" emissiveIntensity={2.2 * lumiere} toneMapped={false} />
      </mesh>
      <mesh position={[ouest + 0.012, hauteur - 0.06, cz]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[profondeur - 0.2, 0.04, 0.01]} />
        <meshStandardMaterial color="#e8f0ff" emissive="#dfe9ff" emissiveIntensity={2.2 * lumiere} toneMapped={false} />
      </mesh>
      <pointLight position={[cx + 0.1, hauteur - 0.2, cz + 0.1]} intensity={4.5 * lumiere} color="#dce7ff" decay={2} distance={2.6} />
      <pointLight position={[cx - 0.2, 0.9, cz + 0.4]} intensity={0.8 * lumiere} color="#c9d8ff" decay={2} distance={1.6} />
      {/* portée limitée : une lumière sans ombres traverse les murs, elle ne doit pas éclairer la pièce voisine */}
    </group>
  );
};
