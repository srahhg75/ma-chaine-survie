import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { EpisodeStandard, PropsEpisode } from "../../systeme/EpisodeStandard";
import { Arrondi } from "../../systeme/kit3d/Arrondi";
import { Ascenseur } from "../../systeme/kit3d/Ascenseur";
import { Bibliotheque, Cadre, CanapeTissu, Lampadaire, Plante, Poussiere, Rideau, TableBasse, TapisEpais } from "../../systeme/kit3d/Mobilier";
import { Environnement } from "../../systeme/kit3d/Lumieres";
import { useMateriauPBR } from "../../systeme/kit3d/pbr";
import { bruit, clamp, doux } from "../../systeme/maths";
import { Alignement } from "../../systeme/mots";
import { instant } from "../../systeme/timeline";
import { APPART, CABINE, donnees } from "./donnees";

// Nuit bleue : ciel froid + lune rasante qui projette des ombres douces par la fenêtre
const Nuit: React.FC = () => (
  <>
    <Environnement intensite={0.12} />
    <hemisphereLight args={["#4a68b0", "#120e0a", 0.2]} />
    <directionalLight
      position={[-5, 9, -9]}
      intensity={0.7}
      color="#8aa8ff"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-7}
      shadow-camera-right={7}
      shadow-camera-top={7}
      shadow-camera-bottom={-7}
      shadow-radius={5}
      shadow-bias={-0.0006}
    />
    {/* léger contre-jour froid côté caméra pour détacher les volumes */}
    <directionalLight position={[6, 5, 6]} intensity={0.12} color="#9fb6e8" />
  </>
);

const TableRonde: React.FC<{ position: [number, number, number]; lampe: number }> = ({ position, lampe }) => {
  const bois = useMateriauPBR("laminate_floor_02", { repetition: [0.8, 0.8], teinte: "#b98f66" });
  return (
    <group position={position}>
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow material={bois}>
        <cylinderGeometry args={[0.5, 0.5, 0.04, 48]} />
      </mesh>
      <mesh position={[0, 0.37, 0]} castShadow material={bois}>
        <cylinderGeometry args={[0.05, 0.07, 0.72, 16]} />
      </mesh>
      <mesh position={[0, 0.02, 0]} castShadow material={bois}>
        <cylinderGeometry args={[0.24, 0.26, 0.04, 32]} />
      </mesh>
      {[-1, 1].map((k) => (
        <group key={k} position={[0, 0, k * 0.68]} rotation={[0, k > 0 ? Math.PI : 0, 0]}>
          <Arrondi taille={[0.42, 0.05, 0.42]} position={[0, 0.46, 0]} rayon={0.02} materiau={bois} />
          <Arrondi taille={[0.42, 0.42, 0.04]} position={[0, 0.7, -0.2]} rayon={0.02} materiau={bois} />
          {[-1, 1].flatMap((a) => [-1, 1].map((b) => <Arrondi key={`${a}${b}`} taille={[0.035, 0.45, 0.035]} position={[a * 0.18, 0.225, b * 0.18]} rayon={0.01} materiau={bois} />))}
        </group>
      ))}
      {/* petite lampe de table (s'allume avec le lampadaire) */}
      <group position={[0.15, 0.76, -0.1]}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.07, 0.2, 20]} />
          <meshStandardMaterial color="#d9a52b" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.27, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.13, 24, 1, true]} />
          <meshStandardMaterial color="#f3e6cf" side={2} emissive="#ffb76b" emissiveIntensity={0.45 * lampe} roughness={0.9} />
        </mesh>
        {lampe > 0.01 && <pointLight position={[0, 0.24, 0]} intensity={1.1 * lampe} color="#ffb46b" decay={2} distance={2.4} castShadow shadow-mapSize={[512, 512]} shadow-radius={5} shadow-bias={-0.002} />}
      </group>
    </group>
  );
};

// Dalle de béton du bâtiment (coupe) sous la cabine et l'appartement + seuil entre les deux
const Batiment: React.FC = () => {
  const beton = useMateriauPBR("concrete_wall_006", { repetition: [3, 3], teinte: "#9a9692" });
  return (
    <group>
      <Arrondi taille={[6.0, 0.36, 7.0]} position={[0, -0.2, -1.95]} rayon={0.04} materiau={beton} />
      <Arrondi taille={[1.0, 0.025, 0.24]} position={[0, 0.0, -0.85]} rayon={0.008} couleur="#8d939a" metal={0.9} rugosite={0.35} />
    </group>
  );
};

const Scene: React.FC<{ al: Alignement }> = ({ al }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const tZero = instant("p1:zero", al);
  const tOuvre = instant("p2:ouvrent", al);
  // Le bouton s'allume ; l'afficheur dégringole 3 -> 0 trop vite (malaise) ; les portes s'ouvrent
  const bouton = clamp((t - tZero) / 0.12);
  const etage = t < tZero + 0.12 ? "3" : t < tZero + 0.3 ? "2" : t < tZero + 0.46 ? "1" : "0";
  const ouverture = doux(clamp((t - (tOuvre - 0.15)) / 1.6));
  // Révélation par la lumière : la lampe de table s'allume à l'ouverture des portes ; le lampadaire,
  // à côté du canapé, s'allume pile sur « quelqu'un » et révèle le double. Allumages vacillants.
  const allumage = (debut: number, graine: string) => {
    const montee = clamp((t - debut) / 0.15);
    const vacille = t - debut < 0.6 ? (bruit(graine, t * 18) > -0.1 ? 1 : 0.2) : 1;
    return montee * vacille;
  };
  const lampeTable = allumage(tOuvre + 0.35, "lampeTable");
  const lampe = allumage(instant("p4:quelqu'un", al) - 0.05, "lampadaire");
  return (
    <>
      <Batiment />
      <Ascenseur
        centre={CABINE.centre}
        largeur={CABINE.largeur}
        profondeur={CABINE.profondeur}
        hauteur={CABINE.hauteur}
        ouverture={ouverture}
        etage={etage}
        boutonAllume={bouton}
        lumiere={1}
      />
      {/* appartement */}
      <TapisEpais position={[-1.0, 0, -3.0]} rotation={90} largeur={2.3} profondeur={1.7} couleur="#a8573e" />
      <TapisEpais position={[0, 0, -1.35]} largeur={0.9} profondeur={0.5} couleur="#3d3a38" bordure="#2a2826" />
      <CanapeTissu position={[-1.85, 0, -3.0]} rotation={90} couleur="#9a6450" />
      <TableBasse position={[-0.92, 0, -3.0]} rotation={90} />
      <Lampadaire position={[-1.95, 0, -4.45]} allume={lampe} />
      <Bibliotheque position={[-1.0, 0, -4.73]} />
      <Plante position={[2.0, 0, -4.45]} />
      <Plante position={[-2.0, 0, -1.4]} graine="plante2" />
      <Rideau position={[-0.35, 0, -4.82]} />
      <Rideau position={[1.75, 0, -4.82]} />
      <Cadre position={[-2.23, 1.5, -3.35]} rotation={90} largeur={0.6} hauteur={0.45} />
      <Cadre position={[-2.23, 1.42, -2.55]} rotation={90} largeur={0.36} hauteur={0.46} teintes={["#a8573e", "#2f4f6a", "#efe6d6"]} />
      <TableRonde position={[1.35, 0, -2.3]} lampe={lampeTable} />
      <Poussiere centre={[-1.3, 1.2, -3.8]} taille={[2.0, 1.8, 1.8]} temps={t} intensite={lampe} />
      {/* lueur chaude qui « coule » par les portes vers la cabine */}
      {lampeTable > 0.01 && <pointLight position={[0.2, 1.2, -1.25]} intensity={0.7 * lampeTable * ouverture} color="#ffb46b" decay={2} distance={1.4} />}
      {/* repère invisible : centre de l'appartement (pour la lisibilité du code) */}
      <group position={[APPART.centre[0], 0, APPART.centre[1]]} />
    </>
  );
};

export const Episode: React.FC<PropsEpisode> = (props) => (
  <EpisodeStandard {...props} donnees={donnees} eclairage={<Nuit />} scene={<Scene al={props.alignement} />} />
);
