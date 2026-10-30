import React, { useMemo } from "react";
import { EpisodeStandard, PropsEpisode } from "../../systeme/EpisodeStandard";
import { Arrondi } from "../../systeme/kit3d/Arrondi";
import { Rideau } from "../../systeme/kit3d/Mobilier";
import { bruit, lerp, Vec3 } from "../../systeme/maths";
import { Alignement } from "../../systeme/mots";
import { etatPersonnage, present, resoudrePersonnage } from "../../systeme/personnage/trajet";
import { Lumiere, useTemps } from "../001-h72/Episode";
import { devant } from "../004-h72-conseil/Episode";
import { donnees, FENETRE, FENETRE_ROUGE, LAMPE, POCHE, PORTEMANTEAU, TELEPHONE_TABLE } from "./donnees";

/*
 * Éléments 3D de « Le dernier appel », partie 1 : l'immeuble d'en face (une fenêtre qui s'allume en rouge), la lampe
 * sur pied, les rideaux qui se ferment, le portemanteau (l'écharpe rouge de Léa ; mardi, son manteau et le paquet de
 * cigarettes rouge), le téléphone (sur la table, à l'oreille, dans la main) dont l'écran éclaire le visage.
 * L'image passe en noir et blanc au post-traitement : seuls les rouges francs restent.
 */
export const ROUGE = "#d0121a";

// Façade de l'immeuble d'en face, de l'autre côté de la rue (fenêtres éteintes, quelques-unes faiblement allumées)
export const ImmeubleEnFace: React.FC<{ rouge: number; aube: number }> = ({ rouge, aube }) => {
  const z = -11;
  const fenetres = useMemo(() => {
    const f: { x: number; y: number; allumee: boolean }[] = [];
    for (let i = -5; i <= 6; i++)
      for (let j = -3; j <= 4; j++) {
        const x = i * 2.1 + 0.0;
        const y = j * 2.9 + 1.55;
        f.push({ x, y, allumee: bruit("enface", i * 13 + j) > 0.82 });
      }
    return f;
  }, []);
  return (
    <group>
      <mesh position={[1, 3.5, z - 0.3]}>
        <boxGeometry args={[28, 26, 0.6]} />
        <meshStandardMaterial color={aube > 0.5 ? "#5a5a60" : "#3c3c42"} roughness={0.95} emissive="#2a2a30" emissiveIntensity={0.35} />
      </mesh>
      {fenetres.map(({ x, y, allumee }, k) => {
        const estRouge = Math.abs(x - FENETRE_ROUGE[0]) < 0.2 && Math.abs(y - FENETRE_ROUGE[1]) < 0.2;
        return (
          <mesh key={k} position={[x, y, z + 0.02]}>
            <planeGeometry args={[1.0, 1.3]} />
            {estRouge && rouge > 0 ? (
              <meshBasicMaterial color={ROUGE} toneMapped={false} transparent opacity={0.35 + 0.65 * rouge} />
            ) : (
              <meshBasicMaterial color={allumee ? "#6a6a70" : "#18181c"} />
            )}
          </mesh>
        );
      })}
      {/* la rue, en bas */}
      <mesh position={[1, -6.5, z + 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#1a1a1c" roughness={1} />
      </mesh>
    </group>
  );
};

export const LampeSurPied: React.FC<{ allumee: boolean }> = ({ allumee }) => (
  <group position={LAMPE}>
    <Arrondi taille={[0.3, 0.03, 0.3]} position={[0, 0.015, 0]} rayon={0.01} couleur="#222226" />
    <Arrondi taille={[0.03, 1.5, 0.03]} position={[0, 0.77, 0]} rayon={0.01} couleur="#222226" metal={0.6} />
    <mesh position={[0, 1.58, 0]}>
      <cylinderGeometry args={[0.16, 0.24, 0.3, 24, 1, true]} />
      <meshStandardMaterial color="#efe6d4" emissive="#ffd9a0" emissiveIntensity={allumee ? 0.55 : 0} side={2} />
    </mesh>
    {allumee && <pointLight position={[0.15, 1.5, 0.25]} intensity={3.2} distance={6.5} color="#ffd6a0" decay={1.8} castShadow />}
  </group>
);

// Portemanteau : l'écharpe rouge de Léa (toujours là) ; mardi, son manteau et, dans la poche, le paquet de cigarettes
export const Portemanteau: React.FC<{ manteau: boolean; echarpe?: boolean }> = ({ manteau, echarpe = true }) => (
  <group position={PORTEMANTEAU}>
    <Arrondi taille={[0.32, 0.03, 0.32]} position={[0, 0.015, 0]} rayon={0.01} couleur="#2a2420" />
    <Arrondi taille={[0.035, 1.75, 0.035]} position={[0, 0.89, 0]} rayon={0.012} couleur="#3a2e24" />
    {[0, 1, 2].map((k) => (
      <Arrondi key={k} taille={[0.02, 0.02, 0.16]} position={[Math.sin(k * 2.1) * 0.06, 1.7, Math.cos(k * 2.1) * 0.06]} rotation={[0.5, k * 2.1, 0]} rayon={0.008} couleur="#3a2e24" />
    ))}
    {/* l’écharpe rouge, pendue en deux pans (absente quand Léa la porte) */}
    {echarpe && (
      <>
        <Arrondi taille={[0.13, 0.62, 0.05]} position={[-0.06, 1.38, 0.0]} rotation={[0, -0.4, 0.04]} rayon={0.02} couleur={ROUGE} rugosite={1} />
        <Arrondi taille={[0.13, 0.5, 0.05]} position={[0.02, 1.43, -0.06]} rotation={[0, 0.5, -0.05]} rayon={0.02} couleur={ROUGE} rugosite={1} />
      </>
    )}
    {manteau && (
      <group>
        <Arrondi taille={[0.42, 0.95, 0.16]} position={[-0.05, 1.18, 0.02]} rotation={[0, -0.25, 0]} rayon={0.06} couleur="#1e1e22" rugosite={0.9} />
        {/* le paquet de cigarettes rouge, qui dépasse de la poche */}
        <Arrondi taille={[0.055, 0.085, 0.022]} position={[POCHE[0] - PORTEMANTEAU[0], POCHE[1], POCHE[2] - PORTEMANTEAU[2]]} rotation={[0, -0.25, 0.1]} rayon={0.004} couleur={ROUGE} rugosite={0.5} />
      </group>
    )}
  </group>
);

// Téléphone : boîtier noir, écran qui éclaire (blanc bleuté)
export const Telephone3D: React.FC<{ position: Vec3; rotation?: [number, number, number]; allume: boolean }> = ({ position, rotation = [0, 0, 0], allume }) => (
  <group position={position} rotation={rotation}>
    <Arrondi taille={[0.075, 0.15, 0.009]} rayon={0.008} couleur="#111114" metal={0.4} rugosite={0.3} />
    <mesh position={[0, 0, 0.0052]}>
      <planeGeometry args={[0.066, 0.138]} />
      <meshBasicMaterial color={allume ? "#e6eeff" : "#0c0c0e"} toneMapped={false} />
    </mesh>
    {allume && <pointLight position={[0, 0, 0.12]} intensity={0.5} distance={1.4} color="#dfe8ff" decay={2} />}
  </group>
);

const Scene: React.FC<{ al: Alignement }> = ({ al }) => {
  const { t, fps, f, a, entre } = useTemps(al);
  const perso = (id: string) => donnees.personnages.find((p) => p.id === id)!;
  const r = useMemo(() => Object.fromEntries(["nathan", "nathan-nuit"].map((id) => [id, resoudrePersonnage(perso(id), al, fps)])), [al, fps]);
  const etat = (id: string) => etatPersonnage(r[id], f, fps);
  const la = (id: string) => present(r[id], f);

  const mardi = t >= a("mardi") && t < a("appel");
  const lampe = t < a("lumiere:lumiere") || mardi;
  const rideauxFermes = !mardi && t >= a("lumiere:rideaux") ? entre("lumiere:rideaux", 0.6) : 0;
  const rouge = t >= a("lueur:allume") && t < a("eteint:eteint") ? entre("lueur:allume", 0.15) : 0;
  const aube = entre("nuit+0.5", "matin");

  // ---- le téléphone : sur la table, à l'oreille, dans la main (écran allumé pendant appels et SMS) ----
  let tel: React.ReactNode = null;
  const vibre = (t >= a("hook2") && t < a("ctx1")) || (t >= a("sonne") && t < a("n_allo") - 0.3) || (t >= a("matin") && t < a("matin") + 1.2);
  const tremble = vibre ? 0.004 * Math.sin(t * 90) : 0;
  if (la("nathan")) {
    const e = etat("nathan");
    if (t < a("n_allo") - 0.3) tel = <Telephone3D position={[TELEPHONE_TABLE[0] + tremble, TELEPHONE_TABLE[1] + 0.006, TELEPHONE_TABLE[2]]} rotation={[-Math.PI / 2, 0, 0.4]} allume={vibre} />;
    else if (t < a("souffle.fin")) tel = <Telephone3D position={devant([e.position[0], e.position[1] - 0.42, e.position[2]], e.orientation, 0.06, 0.13, 1.62)} rotation={[0, ((e.orientation + 90) * Math.PI) / 180, 0]} allume={false} />;
    else if (t < a("sms") + 0.3) tel = <Telephone3D position={[TELEPHONE_TABLE[0], TELEPHONE_TABLE[1] + 0.006, TELEPHONE_TABLE[2]]} rotation={[-Math.PI / 2, 0, 0.7]} allume={false} />;
    else if ((t < a("fenetre") - 1.1 && t >= a("sms") + 0.3) || t >= a("sms3"))
      tel = <Telephone3D position={devant([e.position[0], e.position[1] - (t < a("fenetre") ? 0.42 : 0), e.position[2]], e.orientation, 0.42, 0.17, 1.22)} rotation={[-0.9, (e.orientation * Math.PI) / 180, 0]} allume />;
  }
  if (la("nathan-nuit")) {
    const e = etat("nathan-nuit");
    if (t < a("raccroche")) tel = <Telephone3D position={devant(e.position, e.orientation, 0.06, 0.13, 1.62)} rotation={[0, ((e.orientation + 90) * Math.PI) / 180, 0]} allume={false} />;
    else if (t < a("nuit") || t >= a("matin") + 0.3) tel = <Telephone3D position={devant(e.position, e.orientation, 0.42, 0.17, 1.22)} rotation={[-0.9, (e.orientation * Math.PI) / 180, 0]} allume />;
  }

  // ---- rideaux : ouverts de part et d'autre de la fenêtre, puis tirés ----
  const demi = FENETRE.largeur / 2;
  const xG = lerp(FENETRE.x - demi - 0.15, FENETRE.x - demi / 2, rideauxFermes);
  const xD = lerp(FENETRE.x + demi + 0.15, FENETRE.x + demi / 2, rideauxFermes);
  const largeurRideau = lerp(0.5, demi + 0.1, rideauxFermes);

  return (
    <>
      <Lumiere nuit={1 - aube * 0.8} />
      {/* lueur froide de la nuit (ou grise de l'aube) qui entre par la fenêtre : le salon reste lisible */}
      <pointLight position={[FENETRE.x, 1.6, -1.6]} intensity={lerp(0.9, 2.4, aube) * (1 - 0.6 * rideauxFermes)} distance={6} color="#b9c6e8" decay={2} />
      {/* plafonnier très faible (le salon reste lisible dans le noir) ; mardi, la lumière de l'entrée est allumée */}
      <pointLight position={[0, 2.5, -0.6]} intensity={0.9} distance={7} color="#c9d2ea" decay={2} />
      {mardi && <pointLight position={[2.2, 2.3, 0.3]} intensity={3.2} distance={5} color="#ffd6a0" decay={1.8} castShadow />}
      <ImmeubleEnFace rouge={rouge} aube={aube} />
      <LampeSurPied allumee={lampe} />
      <Portemanteau manteau={mardi} />
      <Rideau position={[xG, 0.02, FENETRE.z + 0.12]} hauteur={2.5} largeur={largeurRideau} couleur="#8a8a90" />
      <Rideau position={[xD, 0.02, FENETRE.z + 0.12]} hauteur={2.5} largeur={largeurRideau} couleur="#8a8a90" />
      {tel}
    </>
  );
};

export const Episode: React.FC<PropsEpisode> = (props) => (
  <EpisodeStandard {...props} donnees={donnees} eclairage={<></>} scene={<Scene al={props.alignement} />} />
);
