import React, { useMemo } from "react";
import { EpisodeStandard, PropsEpisode } from "../../systeme/EpisodeStandard";
import { Arrondi } from "../../systeme/kit3d/Arrondi";
import { Rideau } from "../../systeme/kit3d/Mobilier";
import { bruit, lerp, Vec3 } from "../../systeme/maths";
import { Alignement } from "../../systeme/mots";
import { etatPersonnage, present, resoudrePersonnage } from "../../systeme/personnage/trajet";
import { Lumiere, useTemps } from "../001-h72/Episode";
import { CageEscalier } from "../003-h72-lampe/Episode";
import { devant } from "../004-h72-conseil/Episode";
import { LampeSurPied, Portemanteau, ROUGE, Telephone3D } from "../006-appel/Episode";
import { ImmeubleEnFace, LitSurPieds, Placard, Voiture } from "../008-appel3/Episode";
import { CAGE, CAPOT, CROCHET, donnees, FENETRE, HALL, PORTE, REVEIL, RUE_Y, SAC, TEL_NUIT, TOMBE, VERROU, VOITURE1, VOITURE2, Z_FACADE_NOUS } from "./donnees";

/*
 * Éléments 3D de « Le dernier appel », partie 4 : la porte d'entrée qui s'ouvre (bouton du verrou arraché, la clé de
 * Léa qui fait deux tours ; le soir, serrure neuve), la planchette à clés vide, le sac de Léa, le trousseau qui tombe,
 * le lit qui grince, la cage d'escalier (H+72) posée à part, la façade de leur immeuble et son hall, les deux voitures
 * de police, le double des clés et le téléphone d'Hugo sur le capot ; la nuit, le radio-réveil (3:12) et le téléphone
 * posé sur la table basse, éteint.
 */
const ZH = PORTE.z - PORTE.largeur / 2; // charnière de la porte (côté nord)

// Porte d'entrée : battant qui pivote vers le salon ; verrou au bouton arraché (trou carré) puis serrure neuve
const PorteEntree: React.FC<{ ouverture: number; cle: number; tour: number; neuve: boolean }> = ({ ouverture, cle, tour, neuve }) => {
  const zv = VERROU[2] - ZH;
  return (
    <group position={[PORTE.x, 0, ZH]} rotation={[0, -1.25 * ouverture, 0]}>
      <Arrondi taille={[0.05, 2.08, PORTE.largeur - 0.03]} position={[0, 1.04, PORTE.largeur / 2]} rayon={0.008} couleur="#6e655a" />
      <Arrondi taille={[0.012, 0.8, 0.6]} position={[-0.03, 1.5, PORTE.largeur / 2]} rayon={0.004} couleur="#7a7064" />
      <Arrondi taille={[0.012, 0.8, 0.6]} position={[-0.03, 0.55, PORTE.largeur / 2]} rayon={0.004} couleur="#7a7064" />
      {/* poignée */}
      <Arrondi taille={[0.05, 0.03, 0.14]} position={[-0.06, 1.0, zv + 0.04]} rayon={0.012} couleur="#c9c4ba" metal={0.7} rugosite={0.3} />
      {/* rosace du verrou */}
      <mesh position={[VERROU[0] - PORTE.x + 0.012, VERROU[1], zv]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.045, 0.045, 0.012, 24]} />
        <meshStandardMaterial color={neuve ? "#e4e0d6" : "#c9c4ba"} metalness={0.7} roughness={neuve ? 0.15 : 0.3} />
      </mesh>
      {neuve ? (
        // serrure neuve : bouton brillant
        <group position={[VERROU[0] - PORTE.x - 0.012, VERROU[1], zv]}>
          <Arrondi taille={[0.035, 0.08, 0.024]} rayon={0.008} couleur="#f0ece2" metal={0.8} rugosite={0.12} />
        </group>
      ) : (
        <>
          {/* le bouton a été arraché : il reste un trou carré et deux éraflures claires */}
          <mesh position={[VERROU[0] - PORTE.x + 0.003, VERROU[1], zv]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.022, 0.022]} />
            <meshBasicMaterial color="#050506" />
          </mesh>
          <Arrondi taille={[0.004, 0.006, 0.05]} position={[VERROU[0] - PORTE.x - 0.002, VERROU[1] + 0.055, zv + 0.01]} rotation={[0.5, 0, 0]} rayon={0.002} couleur="#d8d4ca" />
          <Arrondi taille={[0.004, 0.006, 0.04]} position={[VERROU[0] - PORTE.x - 0.002, VERROU[1] - 0.06, zv - 0.01]} rotation={[-0.4, 0, 0]} rayon={0.002} couleur="#d8d4ca" />
        </>
      )}
      {/* la clé de Léa dans le cylindre (sous le verrou), qui fait deux tours */}
      {cle > 0 && (
        <group position={[VERROU[0] - PORTE.x - 0.02, VERROU[1] - 0.1, zv]} rotation={[tour * Math.PI * 2, 0, 0]}>
          <Arrondi taille={[0.04, 0.012, 0.012]} position={[-0.02, 0, 0]} rayon={0.004} couleur="#c8c2b4" metal={0.8} rugosite={0.25} />
          <Arrondi taille={[0.014, 0.045, 0.035]} position={[-0.05, 0, 0]} rayon={0.008} couleur="#c8c2b4" metal={0.8} rugosite={0.25} />
          <Trousseau position={[-0.07, -0.04, 0]} rotation={[0, 0, 0.3]} />
        </group>
      )}
    </group>
  );
};

// Trousseau : anneau et trois clés, porte-clés en cuir sombre
const Trousseau: React.FC<{ position: Vec3; rotation?: [number, number, number] }> = ({ position, rotation = [0, 0, 0] }) => (
  <group position={position} rotation={rotation}>
    <mesh rotation={[0, Math.PI / 2, 0]}>
      <torusGeometry args={[0.018, 0.003, 8, 20]} />
      <meshStandardMaterial color="#c8c2b4" metalness={0.8} roughness={0.25} />
    </mesh>
    {[-0.5, 0.1, 0.7].map((a, k) => (
      <group key={k} rotation={[a, 0, 0]}>
        <Arrondi taille={[0.006, 0.055, 0.016]} position={[0, -0.045, 0]} rayon={0.003} couleur={k === 1 ? "#b89a5a" : "#c8c2b4"} metal={0.8} rugosite={0.25} />
        <Arrondi taille={[0.008, 0.022, 0.024]} position={[0, -0.012, 0]} rayon={0.006} couleur="#c8c2b4" metal={0.8} rugosite={0.25} />
      </group>
    ))}
    <Arrondi taille={[0.01, 0.04, 0.024]} position={[0, -0.035, 0.03]} rayon={0.006} couleur="#2a2420" rugosite={0.8} />
  </group>
);

// Planchette à clés, vide (quatre crochets)
const Crochet: React.FC = () => (
  <group position={CROCHET}>
    <Arrondi taille={[0.02, 0.09, 0.34]} rayon={0.006} couleur="#4a3a2c" />
    {[-0.12, -0.04, 0.04, 0.12].map((z) => (
      <Arrondi key={z} taille={[0.04, 0.012, 0.012]} position={[-0.025, -0.02, z]} rayon={0.004} couleur="#c9c4ba" metal={0.7} rugosite={0.3} />
    ))}
  </group>
);

// Le sac de Léa, accroché au portemanteau
const SacLea: React.FC = () => (
  <group position={SAC}>
    <Arrondi taille={[0.32, 0.26, 0.12]} position={[0, -0.12, 0]} rayon={0.04} couleur="#2a2628" rugosite={0.7} />
    <Arrondi taille={[0.012, 0.22, 0.012]} position={[-0.1, 0.06, 0]} rotation={[0, 0, 0.35]} rayon={0.004} couleur="#1e1a1c" />
    <Arrondi taille={[0.012, 0.22, 0.012]} position={[0.1, 0.06, 0]} rotation={[0, 0, -0.35]} rayon={0.004} couleur="#1e1a1c" />
  </group>
);

// Carrelage de l'entrée, devant la porte
const Carrelage: React.FC = () => {
  const [x0, x1, z0, z1] = [2.0, 2.97, -1.5, 0.55];
  return (
    <group>
      <mesh position={[(x0 + x1) / 2, 0.004, (z0 + z1) / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[x1 - x0, z1 - z0]} />
        <meshStandardMaterial color="#8c8a86" roughness={0.6} />
      </mesh>
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={`z${i}`} position={[(x0 + x1) / 2, 0.006, z0 + (i + 1) * 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[x1 - x0, 0.008]} />
          <meshBasicMaterial color="#4a4846" />
        </mesh>
      ))}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={`x${i}`} position={[x0 + (i + 1) * 0.3, 0.006, (z0 + z1) / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.008, z1 - z0]} />
          <meshBasicMaterial color="#4a4846" />
        </mesh>
      ))}
    </group>
  );
};

// Façade de leur immeuble (côté rue), percée du hall éclairé ; laisse libres l'appartement en coupe et sa fenêtre
const FacadeNous: React.FC<{ hall: number }> = ({ hall }) => {
  const z = Z_FACADE_NOUS;
  const [hx0, hx1, hy1] = [HALL[0] - 0.65, HALL[0] + 0.65, RUE_Y + 2.3];
  const blocs: [number, number, number, number][] = [
    [-12, hx0, RUE_Y, -0.15],
    [hx1, 12, RUE_Y, -0.15],
    [hx0, hx1, hy1, -0.15],
    [-12, 12, 2.75, 14],
    [-12, -7.5, -0.15, 2.75],
    [4.9, 12, -0.15, 2.75],
  ];
  const fenetres = useMemo(() => {
    const f: { x: number; y: number; allumee: boolean }[] = [];
    for (let i = -5; i <= 5; i++)
      for (const y of [RUE_Y + 3.6, RUE_Y + 6.5 - 2.9 + 2.9]) {
        const x = i * 2.1 + 0.4;
        if (Math.abs(x - HALL[0]) < 1.2 && y < RUE_Y + 3) continue;
        f.push({ x, y, allumee: bruit("nous", i * 7 + y) > 0.8 });
      }
    return f;
  }, []);
  return (
    <group>
      {blocs.map(([a, b, c, d], k) => (
        <mesh key={k} position={[(a + b) / 2, (c + d) / 2, z]}>
          <boxGeometry args={[b - a, d - c, 0.2]} />
          <meshStandardMaterial color="#56565c" roughness={0.95} emissive="#26262c" emissiveIntensity={0.35} />
        </mesh>
      ))}
      {fenetres.map(({ x, y, allumee }, k) => (
        <mesh key={k} position={[x, y, z - 0.11]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.0, 1.3]} />
          <meshBasicMaterial color={allumee ? "#6a6a70" : "#18181c"} />
        </mesh>
      ))}
      {/* le hall : fond clair, marche, lumière sur le trottoir */}
      <mesh position={[HALL[0], RUE_Y + 1.15, z + 0.4]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.3, 2.3]} />
        <meshBasicMaterial color="#a8a8ac" />
      </mesh>
      <Arrondi taille={[1.5, 0.08, 0.06]} position={[HALL[0], hy1 + 0.04, z - 0.12]} rayon={0.01} couleur="#8a8a8e" />
      <pointLight position={[HALL[0], RUE_Y + 2.6, z - 1.0]} intensity={3.5 + 2 * hall} distance={7} color="#e8ecf4" decay={1.6} />
    </group>
  );
};

// Radio-réveil : chiffres rouges à 7 segments
const SEGMENTS: Record<string, string> = { "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd" };
const Chiffre: React.FC<{ c: string; x: number }> = ({ c, x }) => {
  const s = SEGMENTS[c] ?? "";
  const [l, h, e] = [0.022, 0.02, 0.004];
  const pos: Record<string, [number, number, boolean]> = {
    a: [0, h, true], g: [0, 0, true], d: [0, -h, true],
    f: [-l / 2, h / 2, false], b: [l / 2, h / 2, false], e: [-l / 2, -h / 2, false], c: [l / 2, -h / 2, false],
  };
  return (
    <group position={[x, 0, 0]}>
      {Object.entries(pos).map(([k, [px, py, hor]]) =>
        s.includes(k) ? (
          <mesh key={k} position={[px, py, 0]}>
            <planeGeometry args={hor ? [l, e] : [e, h]} />
            <meshBasicMaterial color={ROUGE} toneMapped={false} />
          </mesh>
        ) : null,
      )}
    </group>
  );
};
const Reveil: React.FC = () => (
  <group position={REVEIL} rotation={[0, 0.25, 0]}>
    <Arrondi taille={[0.2, 0.08, 0.09]} position={[0, 0.04, 0]} rayon={0.015} couleur="#1a1a1c" rugosite={0.5} />
    <group position={[0, 0.045, 0.047]}>
      <Chiffre c="0" x={-0.06} />
      <Chiffre c="3" x={-0.028} />
      <mesh position={[-0.006, 0.008, 0]}>
        <planeGeometry args={[0.004, 0.004]} />
        <meshBasicMaterial color={ROUGE} toneMapped={false} />
      </mesh>
      <mesh position={[-0.006, -0.008, 0]}>
        <planeGeometry args={[0.004, 0.004]} />
        <meshBasicMaterial color={ROUGE} toneMapped={false} />
      </mesh>
      <Chiffre c="1" x={0.018} />
      <Chiffre c="2" x={0.05} />
    </group>
    <pointLight position={[0, 0.06, 0.15]} intensity={0.25} distance={1.2} color={ROUGE} decay={2} />
  </group>
);

const Scene: React.FC<{ al: Alignement }> = ({ al }) => {
  const { t, fps, f, a, entre } = useTemps(al);
  const ids = ["nathan", "lea", "nathan-rue"];
  const r = useMemo(() => Object.fromEntries(ids.map((id) => [id, resoudrePersonnage(donnees.personnages.find((p) => p.id === id)!, al, fps)])), [al, fps]);
  const etat = (id: string) => etatPersonnage(r[id], f, fps);
  const la = (id: string) => present(r[id], f);

  // ---- moments ----
  const jour = t < a("serrure");
  const nuit = t >= a("nuit");

  // ---- téléphones de Nathan : l'écran montré à Léa ; à l'oreille dans la rue (le 17) ----
  let tel: React.ReactNode = null;
  if (la("nathan") && t >= a("ecran") && t < a("entree")) {
    const e = etat("nathan");
    tel = <Telephone3D position={devant(e.position, e.orientation, 0.42, 0.17, 1.22)} rotation={[-0.6, (e.orientation * Math.PI) / 180, 0]} allume />;
  } else if (la("nathan-rue") && t >= a("n_17") - 0.3 && t < a("police") + 0.6) {
    const e = etat("nathan-rue");
    tel = <Telephone3D position={devant(e.position, e.orientation, 0.06, 0.13, 1.62)} rotation={[0, (e.orientation * Math.PI) / 180 + Math.PI / 2, 0]} allume={false} />;
  }

  // ---- le trousseau de Léa : sorti du sac, tombe, ramassé, dans la serrure ----
  let trousseau: React.ReactNode = null;
  const tTombe = a("tombe:tombe");
  if (la("lea") && t >= a("sac:trousseau") && t < tTombe - 0.3) {
    const e = etat("lea");
    trousseau = <Trousseau position={devant(e.position, e.orientation, 0.45, 0.17, 1.12)} />;
  } else if (t >= tTombe - 0.3 && t < a("grince") + 0.9) {
    const k = Math.min(1, Math.max(0, (t - (tTombe - 0.3)) / 0.3));
    const depart = devant(etat("lea").position, etat("lea").orientation, 0.45, 0.17, 1.12);
    trousseau = <Trousseau position={[lerp(depart[0], TOMBE[0], k), lerp(depart[1], TOMBE[1] + 0.012, k * k), lerp(depart[2], TOMBE[2], k)]} rotation={[0, 0.4, k * Math.PI / 2]} />;
  } else if (la("lea") && t >= a("grince") + 0.9 && t < a("l_vite") + 0.3) {
    const e = etat("lea");
    trousseau = <Trousseau position={devant(e.position, e.orientation, 0.45, 0.17, 1.12)} />;
  }
  const cle = t >= a("l_vite") + 0.3 && t < a("ombre:derriere") + 0.2 ? 1 : 0;
  const tour = (entre("tour:tour", 0.3) + entre("tour:tours", 0.3)) / 2;
  const ouverture = entre("ombre:derriere", 0.7) * (t < a("serrure") ? 1 : 0);

  // ---- le lit : Hugo dessous jusqu'au grincement ; le sommier tremble ----
  const tremble = t >= a("grince:sommier") && t < a("grince:sommier") + 1.0 ? 0.008 * Math.sin(t * 2 * Math.PI * 7) : 0;
  const ecran = t < a("grince") ? 0.75 + 0.25 * Math.sin(t * 2 * Math.PI * 1.2) : 0;

  // ---- la rue : voitures qui arrivent, gyrophares ----
  const arrivee = entre("police", 1.6);
  const gyro = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * 1.6);
  const gyro2 = 0.5 + 0.5 * Math.sin(t * 2 * Math.PI * 1.6 + 2);
  const police = t >= a("police") && t < a("serrure");

  return (
    <>
      <Lumiere nuit={nuit ? 0.9 : 0.2} />
      {/* matin gris derrière les rideaux tirés ; le soir, la lampe ; la nuit, presque rien (le canapé reste lisible) */}
      <pointLight position={[FENETRE.x, 1.6, -1.6]} intensity={jour ? 1.0 : 0.25} distance={6} color="#c4cbe0" decay={2} />
      <pointLight position={[0, 2.5, -0.6]} intensity={nuit ? 0.35 : 0.9} distance={7} color="#c9d2ea" decay={2} />
      {nuit && <pointLight position={[-0.6, 1.3, 1.2]} intensity={0.6} distance={4} color="#9fb0d8" decay={2} />}
      <pointLight position={[-5.0, 2.4, 1.0]} intensity={0.45} distance={5} color="#b9c2dc" decay={2} />
      <pointLight position={[2.4, 2.3, 0.0]} intensity={0.55} distance={3.2} color="#c9d2ea" decay={2} />
      {/* la rue : réverbère côté trottoir (visages lisibles face au nord), lueur des gyrophares */}
      {t >= a("rue") && t < a("serrure") && <pointLight position={[0.4, RUE_Y + 3.2, -7.2]} intensity={5} distance={9} color="#dfe6f4" decay={1.6} />}
      {/* l'arrestation : le hall et la portière ouverte éclairent le trajet d'Hugo (silhouettes lisibles, visage baissé) */}
      {t >= a("sort") && t < a("poches") && <pointLight position={[-2.0, RUE_Y + 2.6, -3.8]} intensity={4} distance={6} color="#dfe6f4" decay={1.6} />}
      {police && <pointLight position={[-1.0, RUE_Y + 1.8, -6.0]} intensity={3 * gyro} distance={7} color={ROUGE} decay={1.6} />}
      {nuit && <pointLight position={[-0.8, 1.2, 0.3]} intensity={0.5} distance={2.5} color="#a9b8de" decay={2} />}
      <ImmeubleEnFace torche={null} voyant={0} flash={0} trepied={false} />
      <FacadeNous hall={t >= a("rue") && t < a("serrure") ? 1 : 0} />
      {police && <Voiture position={[lerp(VOITURE1[0] + 16, VOITURE1[0], arrivee), VOITURE1[1], VOITURE1[2]]} gyro={gyro} allume />}
      {police && <Voiture position={[lerp(VOITURE2[0] + 14, VOITURE2[0], entre("police+0.4", 1.6)), VOITURE2[1], VOITURE2[2]]} gyro={gyro2} allume />}
      {/* le double des clés et le téléphone d'Hugo, posés sur le capot par les policiers */}
      {t >= a("poches") && t < a("serrure") && (
        <group>
          <Trousseau position={[CAPOT[0] + 0.08, CAPOT[1] + 0.012, CAPOT[2] - 0.12]} rotation={[0, 0.6, Math.PI / 2]} />
          <group position={[CAPOT[0] - 0.05, CAPOT[1] + 0.006, CAPOT[2] + 0.1]} rotation={[-Math.PI / 2, 0, 0.4]}>
            <Arrondi taille={[0.075, 0.15, 0.009]} rayon={0.008} couleur="#111114" metal={0.4} rugosite={0.3} />
            <mesh position={[0, 0, 0.0052]}>
              <planeGeometry args={[0.066, 0.138]} />
              <meshBasicMaterial color={ROUGE} toneMapped={false} transparent opacity={0.85} />
            </mesh>
          </group>
          <pointLight position={[CAPOT[0], CAPOT[1] + 0.6, CAPOT[2] + 0.3]} intensity={0.8} distance={2} color="#dfe6f4" decay={2} />
        </group>
      )}
      {/* la cage d'escalier (décor de H+72), posée à part */}
      <group position={CAGE}>
        <CageEscalier porteMorel={0} porteToit={0} bougies7={0} porte6={1} entreeInes />
      </group>
      <LampeSurPied allumee={!jour && !nuit} />
      <Portemanteau manteau={false} />
      <SacLea />
      <Crochet />
      <Carrelage />
      <Placard />
      <PorteEntree ouverture={ouverture} cle={cle} tour={tour} neuve={!jour} />
      {/* rideaux tirés (fin de la P3) */}
      <Rideau position={[FENETRE.x - FENETRE.largeur / 4, 0.02, FENETRE.z + 0.12]} hauteur={2.5} largeur={FENETRE.largeur / 2 + 0.1} couleur="#8a8a90" />
      <Rideau position={[FENETRE.x + FENETRE.largeur / 4, 0.02, FENETRE.z + 0.12]} hauteur={2.5} largeur={FENETRE.largeur / 2 + 0.1} couleur="#8a8a90" />
      <group position={[0, tremble, 0]}>
        <LitSurPieds ecran={ecran} hugo={t < a("grince") + 0.6} />
      </group>
      {nuit && <Reveil />}
      {/* un magazine clair sous le téléphone : il se détache de la table sombre */}
      {nuit && (
        <mesh position={[TEL_NUIT[0], TEL_NUIT[1] - 0.004, TEL_NUIT[2]]} rotation={[-Math.PI / 2, 0, 0.15]}>
          <planeGeometry args={[0.21, 0.28]} />
          <meshStandardMaterial color="#cfcac0" roughness={0.8} />
        </mesh>
      )}
      {nuit && <Telephone3D position={TEL_NUIT} rotation={[-Math.PI / 2, 0, 0.3]} allume={false} />}
      {tel}
      {trousseau}
    </>
  );
};

export const Episode: React.FC<PropsEpisode> = (props) => (
  <EpisodeStandard {...props} donnees={donnees} eclairage={<></>} scene={<Scene al={props.alignement} />} />
);
