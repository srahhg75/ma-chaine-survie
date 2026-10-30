import React, { useMemo } from "react";
import { EpisodeStandard, PropsEpisode } from "../../systeme/EpisodeStandard";
import { Arrondi } from "../../systeme/kit3d/Arrondi";
import { Rideau } from "../../systeme/kit3d/Mobilier";
import { lerp, Vec3 } from "../../systeme/maths";
import { Alignement } from "../../systeme/mots";
import { etatPersonnage, resoudrePersonnage } from "../../systeme/personnage/trajet";
import { POLICE_TEXTE } from "../../systeme/polices";
import { Lumiere, useTemps } from "../001-h72/Episode";
import { devant, useDessin } from "../004-h72-conseil/Episode";
import { ImmeubleEnFace, LampeSurPied, Portemanteau, ROUGE, Telephone3D } from "../006-appel/Episode";
import { BRIQUET, COMMODE, donnees, FENETRE, PHOTOS, PLACARD, SAC } from "./donnees";

/*
 * Éléments 3D de « Le dernier appel », partie 2 : la commode de Léa (tiroirs qui s'ouvrent, vêtements), le placard à
 * portes coulissantes, le vieux sac tiré du placard, le briquet rouge gravé « H », l'enveloppe et les 12 photos
 * (Léa au café, au bureau, endormie dans leur lit ; au dos de l'une : « TU ES À MOI »), le téléphone de Nathan.
 * Repris de la partie 1 : l'immeuble d'en face (la fenêtre rouge), la lampe, le portemanteau (sans l'écharpe : Léa
 * la porte), les rideaux, ouverts tout l'épisode (la photo est prise à travers la fenêtre).
 */
const BOIS = "#5a4636";

// Commode : face vers +X (l'est), 3 tiroirs ; `ouvert` = sortie de chaque tiroir (m)
const Commode: React.FC<{ ouvert: [number, number, number] }> = ({ ouvert }) => {
  const [l, h, p] = [1.2, 0.88, 0.5];
  return (
    <group position={COMMODE}>
      <Arrondi taille={[p, h, l]} position={[0, h / 2, 0]} rayon={0.015} couleur={BOIS} rugosite={0.8} />
      {[0, 1, 2].map((k) => {
        const y = 0.16 + k * 0.27;
        const x = p / 2 + ouvert[k];
        return (
          <group key={k} position={[x - 0.2, y, 0]}>
            {/* le tiroir (caisse), sa façade claire, la poignée */}
            <Arrondi taille={[0.42, 0.2, l - 0.1]} position={[0, 0, 0]} rayon={0.01} couleur="#3a2e24" />
            <Arrondi taille={[0.025, 0.24, l - 0.06]} position={[0.215, 0, 0]} rayon={0.008} couleur="#8a7560" />
            <Arrondi taille={[0.03, 0.025, 0.22]} position={[0.24, 0.02, 0]} rayon={0.008} couleur="#c9c4ba" metal={0.6} />
            {/* pulls et chaussettes pliés dedans */}
            {ouvert[k] > 0.05 &&
              [-0.32, 0, 0.32].map((z, i) => <Arrondi key={i} taille={[0.3, 0.07, 0.26]} position={[0.02, 0.1, z]} rayon={0.03} couleur={["#9a9a9e", "#4a4a50", "#d6d2c8"][(i + k) % 3]} rugosite={1} />)}
          </group>
        );
      })}
      {/* sur la commode : un cadre (eux deux) */}
      <group position={[0, h + 0.13, -0.3]} rotation={[0, Math.PI / 2, 0]}>
        <Arrondi taille={[0.2, 0.25, 0.02]} rayon={0.006} couleur="#1c1c1e" />
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[0.16, 0.21]} />
          <meshStandardMaterial color="#a8a8ac" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

// Placard à deux portes coulissantes (face vers +X) ; la porte sud glisse derrière la porte nord
const Placard: React.FC<{ ouverture: number }> = ({ ouverture }) => {
  const [l, h, p] = [1.0, 2.0, 0.55];
  const xFace = p / 2;
  return (
    <group position={PLACARD}>
      {/* caisse ouverte à l'avant : fond, côtés, dessus, étagère, intérieur sombre */}
      <Arrondi taille={[0.03, h, l]} position={[-p / 2 + 0.015, h / 2, 0]} rayon={0.005} couleur="#2a221c" />
      <Arrondi taille={[p, h, 0.03]} position={[0, h / 2, -l / 2 + 0.015]} rayon={0.005} couleur={BOIS} />
      <Arrondi taille={[p, h, 0.03]} position={[0, h / 2, l / 2 - 0.015]} rayon={0.005} couleur={BOIS} />
      <Arrondi taille={[p, 0.03, l]} position={[0, h - 0.015, 0]} rayon={0.005} couleur={BOIS} />
      <Arrondi taille={[p, 0.03, l]} position={[0, 0.03, 0]} rayon={0.005} couleur={BOIS} />
      <Arrondi taille={[p - 0.05, 0.025, l - 0.06]} position={[0, 1.55, 0]} rayon={0.005} couleur="#3a2e24" />
      {/* vêtements pendus */}
      {[-0.32, -0.16, 0.0, 0.16].map((z, i) => (
        <Arrondi key={i} taille={[0.36, 0.8, 0.1]} position={[0, 1.08, z]} rayon={0.04} couleur={["#2a2a2e", "#6a6a70", "#3c3c42", "#8a8a90"][i]} rugosite={1} />
      ))}
      {/* portes : nord fixe, sud qui glisse vers le nord, devant elle */}
      <Arrondi taille={[0.03, h - 0.04, l / 2]} position={[xFace - 0.03, h / 2, -l / 4]} rayon={0.006} couleur="#9a8a78" />
      <Arrondi taille={[0.03, h - 0.04, l / 2]} position={[xFace + 0.01, h / 2, l / 4 - (l / 2) * ouverture * 0.92]} rayon={0.006} couleur="#a3937f" />
      <Arrondi taille={[0.02, 0.3, 0.025]} position={[xFace + 0.035, 1.0, l / 4 - (l / 2) * ouverture * 0.92 + 0.2]} rayon={0.008} couleur="#c9c4ba" metal={0.6} />
    </group>
  );
};

// Le vieux sac (toile sombre), ouvert, le briquet rouge posé dessus ; l'enveloppe à côté
const Sac: React.FC<{ position: Vec3; briquet: boolean; enveloppe: number }> = ({ position, briquet, enveloppe }) => (
  <group position={position} rotation={[0, 0.5, 0]}>
    <Arrondi taille={[0.46, 0.2, 0.28]} position={[0, 0.1, 0]} rayon={0.07} couleur="#77705f" rugosite={1} />
    <Arrondi taille={[0.4, 0.02, 0.2]} position={[0, 0.205, 0]} rayon={0.01} couleur="#151412" rugosite={1} />
    <mesh position={[0, 0.27, 0]} rotation={[0, 0, 0]}>
      <torusGeometry args={[0.13, 0.012, 8, 24, Math.PI]} />
      <meshStandardMaterial color="#2a2622" roughness={1} />
    </mesh>
    {briquet && <Briquet position={[BRIQUET[0] - position[0], BRIQUET[1] - position[1], BRIQUET[2] - position[2]]} />}
    {enveloppe > 0 && <Arrondi taille={[0.24, 0.01, 0.16]} position={[0.3 * enveloppe + 0.12, 0.006, 0.18]} rotation={[0, -0.4, 0]} rayon={0.003} couleur="#d8d2c4" />}
  </group>
);

// Briquet rouge (gros pour être lisible), un « H » gravé sur la face du dessus
const Briquet: React.FC<{ position: Vec3 }> = ({ position }) => {
  const tex = useDessin(128, 256, (c) => {
    c.fillStyle = ROUGE;
    c.fillRect(0, 0, 128, 256);
    c.strokeStyle = "#2a0204";
    c.lineWidth = 6;
    c.font = `900 120px ${POLICE_TEXTE}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.strokeText("H", 64, 140);
    c.fillStyle = "#7a080c";
    c.fillText("H", 64, 140);
  }, "briquet-h");
  return (
    <group position={position} rotation={[0, -0.9, 0]}>
      <Arrondi taille={[0.05, 0.022, 0.085]} position={[0, 0, 0]} rayon={0.006} couleur={ROUGE} metal={0.3} rugosite={0.4} />
      <Arrondi taille={[0.05, 0.022, 0.022]} position={[0, 0, -0.054]} rayon={0.004} couleur="#c9c4ba" metal={0.8} rugosite={0.3} />
      <mesh position={[0, 0.0115, 0.006]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.044, 0.07]} />
        <meshStandardMaterial map={tex} roughness={0.5} />
      </mesh>
    </group>
  );
};

// Une photo : image en niveaux de gris (café, bureau, lit…) ; au dos de la n° 0 : « TU ES À MOI » au feutre rouge
type Scene2D = "cafe" | "bureau" | "lit" | "rue";
const dessinerPhoto = (c: CanvasRenderingContext2D, scene: Scene2D) => {
  const [w, h] = [256, 192];
  c.fillStyle = "#f2f0ea";
  c.fillRect(0, 0, w, h);
  const g = c.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, scene === "lit" ? "#3a3a3e" : "#8a8a8e");
  g.addColorStop(1, scene === "lit" ? "#1a1a1c" : "#4a4a4e");
  c.fillStyle = g;
  c.fillRect(10, 10, w - 20, h - 40);
  c.fillStyle = "#1c1c1e";
  if (scene === "lit") {
    // le lit, l'oreiller, Léa endormie (cheveux longs étalés)
    c.fillStyle = "#6a6a6e";
    c.fillRect(30, 90, 196, 50);
    c.fillStyle = "#c8c8cc";
    c.fillRect(40, 80, 60, 24);
    c.fillStyle = "#2a2a2e";
    c.beginPath();
    c.ellipse(78, 86, 26, 18, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#9a9a9e";
    c.fillRect(100, 96, 120, 34);
  } else {
    if (scene === "cafe") {
      c.fillStyle = "#5a5a5e";
      c.fillRect(20, 112, 216, 10);
    }
    if (scene === "bureau") {
      c.fillStyle = "#cfcfd2";
      c.fillRect(150, 50, 70, 46);
    }
    // silhouette de Léa (cheveux longs)
    c.fillStyle = "#1c1c1e";
    c.beginPath();
    c.ellipse(100, 70, 20, 24, 0, 0, Math.PI * 2);
    c.fill();
    c.fillRect(78, 66, 44, 52);
    c.beginPath();
    c.ellipse(100, 150, 42, 46, 0, Math.PI, 0);
    c.fill();
  }
};
const PHOTOS_ETALEES: { dx: number; dz: number; rot: number; scene: Scene2D }[] = [
  { dx: -0.12, dz: 0.1, rot: 0.25, scene: "rue" }, // celle qu'on retourne (« TU ES À MOI »)
  { dx: 0.04, dz: -0.06, rot: -0.2, scene: "cafe" },
  { dx: 0.18, dz: 0.05, rot: 0.1, scene: "bureau" },
  { dx: 0.12, dz: 0.04, rot: -0.05, scene: "lit" },
  { dx: -0.02, dz: 0.2, rot: 0.5, scene: "rue" },
  { dx: 0.26, dz: -0.1, rot: -0.4, scene: "cafe" },
  { dx: -0.2, dz: -0.08, rot: -0.6, scene: "bureau" },
  { dx: 0.3, dz: 0.18, rot: 0.3, scene: "rue" },
];
const Photo: React.FC<{ scene: Scene2D; position: Vec3; rot: number; dos?: number }> = ({ scene, position, rot, dos = 0 }) => {
  const recto = useDessin(256, 192, (c) => dessinerPhoto(c, scene), `photo-${scene}`);
  const verso = useDessin(256, 192, (c) => {
    c.fillStyle = "#e9e6de";
    c.fillRect(0, 0, 256, 192);
    c.fillStyle = ROUGE;
    c.font = `900 46px ${POLICE_TEXTE}`;
    c.textAlign = "center";
    c.save();
    c.translate(128, 88);
    c.rotate(Math.PI - 0.08); // lisible depuis la caméra (le haut de la photo vers le sud)
    c.fillText("TU ES", 0, -14);
    c.fillText("À MOI", 0, 36);
    c.restore();
  }, "photo-dos");
  // retournée autour de son grand axe : dos = 0 (image visible) -> 1 (dos visible)
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <group position={[0, 0.04 * Math.sin(Math.PI * dos), 0]} rotation={[0, 0, Math.PI * dos]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <planeGeometry args={[0.15, 0.112]} />
          <meshStandardMaterial map={recto} roughness={0.5} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
          <planeGeometry args={[0.15, 0.112]} />
          <meshStandardMaterial map={verso} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

const Scene: React.FC<{ al: Alignement }> = ({ al }) => {
  const { t, fps, f, a, entre } = useTemps(al);
  const r = useMemo(() => resoudrePersonnage(donnees.personnages.find((p) => p.id === "nathan")!, al, fps), [al, fps]);
  const e = etatPersonnage(r, f, fps);

  // tiroirs : le haut au hook (refermé à « tiroir »), le milieu et le bas ensuite
  const tiroirHaut = t < a("tiroir") ? entre("hook:fouille", 0.4) * 0.32 : 0.32 * (1 - entre("tiroir", 0.3));
  const tiroirMilieu = entre("tiroir:commode", 0.45) * 0.34;
  const tiroirBas = entre("rien:chaussettes", 0.4) * 0.3;
  const ouverturePlacard = entre("placard:fond-0.2", 0.6);
  // le sac glisse du fond du placard jusqu'au sol devant lui
  const s = entre("placard:sac", 0.7);
  const sacPos: Vec3 = [lerp(PLACARD[0] + 0.05, SAC[0], s), 0.03 * (1 - s), lerp(PLACARD[2] + 0.22, SAC[2], s)];
  const enveloppe = entre("enveloppe", 0.5);
  const etalees = entre("photos-0.4", 0.6);
  const retournee = entre("dos:dos", 0.5);

  // téléphone dans la main : SMS du hook (debout), puis la photo reçue (assis)
  let tel: React.ReactNode = null;
  if (t >= a("hook2") && t < a("tiroir") - 0.2) tel = <Telephone3D position={devant(e.position, e.orientation, 0.42, 0.17, 1.22)} rotation={[-0.9, (e.orientation * Math.PI) / 180, 0]} allume />;
  else if (t >= a("vibre") + 0.2) tel = <Telephone3D position={devant([e.position[0], e.position[1] - 0.42, e.position[2]], e.orientation, 0.42, 0.17, 1.22)} rotation={[-0.9, (e.orientation * Math.PI) / 180, 0]} allume />;

  const rouge = t >= a("angle") ? entre("angle:face", 0.15) : 0;
  const demi = FENETRE.largeur / 2;

  return (
    <>
      <Lumiere nuit={0.2} />
      {/* lumière grise du matin par la fenêtre (rideaux ouverts) ; plafonnier faible : le salon reste lisible */}
      <pointLight position={[FENETRE.x, 1.6, -1.6]} intensity={2.4} distance={6} color="#c4cbe0" decay={2} />
      <pointLight position={[0, 2.5, -0.6]} intensity={0.9} distance={7} color="#c9d2ea" decay={2} />
      {/* coin ouest (commode, placard) un peu éclairé, sans source visible */}
      <pointLight position={[-1.6, 2.3, 0.0]} intensity={1.1} distance={3.6} color="#d6dbe8" decay={2} />
      <ImmeubleEnFace rouge={rouge} aube={1} />
      <LampeSurPied allumee={false} />
      <Portemanteau manteau={false} echarpe={false} />
      <Rideau position={[FENETRE.x - demi - 0.15, 0.02, FENETRE.z + 0.12]} hauteur={2.5} largeur={0.5} couleur="#8a8a90" />
      <Rideau position={[FENETRE.x + demi + 0.15, 0.02, FENETRE.z + 0.12]} hauteur={2.5} largeur={0.5} couleur="#8a8a90" />
      <Commode ouvert={[tiroirHaut, tiroirMilieu, tiroirBas]} />
      <Placard ouverture={ouverturePlacard} />
      {t >= a("placard:sac") - 0.1 && <Sac position={sacPos} briquet enveloppe={enveloppe} />}
      {etalees > 0 &&
        PHOTOS_ETALEES.map((p, i) => (
          <Photo
            key={i}
            scene={p.scene}
            position={[lerp(PHOTOS[0] - 0.1, PHOTOS[0] + p.dx, etalees), PHOTOS[1] + i * 0.0015, lerp(PHOTOS[2] - 0.05, PHOTOS[2] + p.dz, etalees)]}
            rot={p.rot * etalees}
            dos={i === 0 ? retournee : 0}
          />
        ))}
      {tel}
    </>
  );
};

export const Episode: React.FC<PropsEpisode> = (props) => (
  <EpisodeStandard {...props} donnees={donnees} eclairage={<></>} scene={<Scene al={props.alignement} />} />
);
