import React, { createContext, useContext, useMemo } from "react";
import { LatheGeometry, SplineCurve, Vector2 } from "three";
import { Vec3 } from "../maths";
import { Arrondi } from "../kit3d/Arrondi";
import { LampeTorche } from "../kit3d/Lumieres";
import { Apparence, APPARENCE_DEFAUT } from "./apparence";
import { corpsDe, CORPS_HUMAIN, hauteurBassin, Pose, Proportions, Variante, Visage, visageDePose } from "./poses";

/*
 * Personnage « humain » : réalisme en formes simples (direction artistique à partir de H+72 partie 2).
 * Silhouette de la partie 1 (≈ 1,4 m, tête un peu grosse), torse sculpté (tour), membres qui s'affinent, mains à doigts, visage ovale avec
 * oreilles, nez, lèvres, joues ; cheveux en mèches ; vêtements en couches (col, poignets, ourlet, boutons).
 * Signature de la chaîne gardée : grands yeux expressifs (iris coloré, reflets), clignements, expressions.
 * Il regarde vers +Z. Mêmes poses et mêmes conventions d'angles que le Bonhomme (poses.ts).
 */
const rad = (d: number) => (d * Math.PI) / 180;
// Proportions du corps et style du visage, transmis à tous les morceaux du personnage (« humain » ou « adulte »)
const Style = createContext<{ C: Proportions; adulte: boolean }>({ C: CORPS_HUMAIN, adulte: false });
const useStyle = () => useContext(Style);
const RAYON_DESSIN = 0.112; // la tête est dessinée à ce rayon puis agrandie (C.rayonTete)
const Tissu: React.FC<{ c: string; r?: number }> = ({ c, r = 0.92 }) => <meshStandardMaterial color={c} roughness={r} />;
const Peau: React.FC<{ c: string }> = ({ c }) => <meshStandardMaterial color={c} roughness={0.55} />;

// Assombrit / éclaircit une couleur (#rrggbb) : plis, coutures, reflets de cheveux
const teinte = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("")}`;
};

// Segment de membre qui s'affine (cylindre conique + rotule ronde en haut)
const Segment: React.FC<{ long: number; r0: number; r1: number; c: React.ReactNode }> = ({ long, r0, r1, c }) => (
  <>
    <mesh position={[0, -long / 2, 0]} castShadow>
      <cylinderGeometry args={[r0, r1, long, 16]} />
      {c}
    </mesh>
    <mesh castShadow>
      <sphereGeometry args={[r0 * 1.02, 16, 12]} />
      {c}
    </mesh>
  </>
);

// Torse sculpté au tour : bassin, taille marquée, poitrine, épaules ; aplati en profondeur
const profilTorse = (femme: boolean, ample: number) => {
  const k = 1 + ample;
  const pts = femme
    ? [[0.001, -0.08], [0.142, -0.07], [0.145, 0.02], [0.12, 0.15], [0.13, 0.26], [0.146, 0.34], [0.158, 0.41], [0.16, 0.445], [0.11, 0.485], [0.045, 0.5]]
    : [[0.001, -0.08], [0.138, -0.07], [0.138, 0.02], [0.132, 0.15], [0.146, 0.27], [0.162, 0.35], [0.176, 0.415], [0.172, 0.452], [0.115, 0.488], [0.048, 0.5]];
  return pts.map(([r, y]) => new Vector2(r * k, y));
};

const Torse: React.FC<{ a: Apparence }> = ({ a }) => {
  const ample = a.haut === "parka" ? 0.12 : a.haut === "polaire" ? 0.07 : a.haut === "cardigan" ? 0.05 : 0.03;
  const geo = useMemo(() => new LatheGeometry(profilTorse(a.femme, ample), 28), [a.femme, ample]);
  const geoPeau = useMemo(() => new LatheGeometry(profilTorse(a.femme, 0), 20), [a.femme]);
  const ombre = teinte(a.couleurHaut, -0.25);
  return (
    <group>
      {/* vêtement du haut (aplati en profondeur) */}
      <mesh geometry={geo} scale={[1, 1, 0.66]} castShadow receiveShadow>
        <Tissu c={a.couleurHaut} />
      </mesh>
      {/* ourlet côtelé à la taille */}
      <mesh position={[0, -0.07, 0]} scale={[1, 0.66, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.142 * (1 + ample), 0.017, 8, 28]} />
        <Tissu c={ombre} r={1} />
      </mesh>
      {/* col : t-shirt / chemise visible dessous + côtes du pull */}
      <mesh position={[0, 0.485, 0.0]} rotation={[Math.PI / 2 - 0.12, 0, 0]}>
        <torusGeometry args={[0.058, 0.016, 8, 22]} />
        <Tissu c={a.haut === "cardigan" ? a.couleurCol : ombre} r={1} />
      </mesh>
      {a.haut === "cardigan" && (
        <group>
          {/* chemise visible dans l'ouverture en V, boutons du gilet */}
          {[0.08, 0.15, 0.22].map((y) => (
            <mesh key={y} position={[0.042, y, 0.093 + y * 0.01]}>
              <sphereGeometry args={[0.009, 8, 6]} />
              <meshStandardMaterial color="#3a2a1a" roughness={0.4} />
            </mesh>
          ))}
          {[-1, 1].map((k) => (
            <mesh key={k} position={[k * 0.04, 0.3, 0.1]} rotation={[-0.1, 0, k * 0.22]}>
              <boxGeometry args={[0.018, 0.26, 0.012]} />
              <Tissu c={ombre} />
            </mesh>
          ))}
        </group>
      )}
      {a.haut === "parka" && (
        // parka matelassée : surpiqûres horizontales, fermeture éclair, col de capuche roulé derrière la nuque
        <>
          {[0.08, 0.2, 0.32].map((y) => (
            <mesh key={y} position={[0, y, 0]} scale={[1, 0.66, 1]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[(y < 0.15 ? 0.146 : y < 0.25 ? 0.141 : 0.158) * (1 + ample), 0.007, 6, 30]} />
              <Tissu c={teinte(a.couleurHaut, -0.22)} />
            </mesh>
          ))}
          <mesh position={[0, 0.24, 0.112 * (1 + ample) * 0.66 + 0.004]} rotation={[-0.06, 0, 0]}>
            <boxGeometry args={[0.012, 0.46, 0.006]} />
            <meshStandardMaterial color="#c9c3b6" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.49, -0.035]} rotation={[Math.PI / 2 - 0.5, 0, 0]} scale={[1, 1, 1]}>
            <torusGeometry args={[0.085, 0.035, 10, 24]} />
            <Tissu c={a.couleurHaut} />
          </mesh>
        </>
      )}
      {a.haut === "polaire" && (
        // fermeture éclair et col montant de la polaire
        <>
          <mesh position={[0, 0.27, 0.1]} rotation={[-0.05, 0, 0]}>
            <boxGeometry args={[0.008, 0.42, 0.006]} />
            <meshStandardMaterial color="#cfcfcf" roughness={0.3} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.062, 0.07, 0.06, 18, 1, true]} />
            <meshStandardMaterial color={a.couleurHaut} roughness={0.95} side={2} />
          </mesh>
        </>
      )}
      {/* peau du cou dans l'encolure (évite un trou sombre vu d'en haut) */}
      <mesh geometry={geoPeau} scale={[0.5, 0.2, 0.4]} position={[0, 0.4, 0]} visible={false} />
    </group>
  );
};

const Main: React.FC<{ a: Apparence; cote: 1 | -1 }> = ({ a, cote }) => {
  // gant : tissu un peu plus épais à la place de la peau
  const g = a.gants ? 1.18 : 1;
  const matiere = a.gants ? <Tissu c={a.gants} r={0.8} /> : <Peau c={a.peau} />;
  return (
    <group>
      {/* paume */}
      <mesh position={[0, -0.045, 0]} scale={[g, 1, 0.42 * g]} castShadow>
        <capsuleGeometry args={[0.03, 0.035, 6, 12]} />
        {matiere}
      </mesh>
      {/* revers du gant sur le poignet */}
      {a.gants && (
        <mesh position={[0, -0.002, 0]}>
          <cylinderGeometry args={[0.034, 0.03, 0.03, 14]} />
          <Tissu c={teinte(a.gants, -0.2)} r={1} />
        </mesh>
      )}
      {/* 4 doigts légèrement repliés */}
      {[-0.021, -0.007, 0.007, 0.021].map((x, i) => (
        <group key={i} position={[x, -0.085, 0.004]} rotation={[-0.35, 0, 0]}>
          <mesh position={[0, -0.022, 0]} castShadow>
            <capsuleGeometry args={[0.0075 * g, 0.034 - Math.abs(i - 1.5) * 0.005, 4, 8]} />
            {matiere}
          </mesh>
        </group>
      ))}
      {/* pouce, vers l'avant */}
      <group position={[cote * 0.024, -0.04, 0.016]} rotation={[-0.6, 0, cote * 0.5]}>
        <mesh position={[0, -0.02, 0]}>
          <capsuleGeometry args={[0.009 * g, 0.03, 4, 8]} />
          {matiere}
        </mesh>
      </group>
    </group>
  );
};

const Bras: React.FC<{ a: Apparence; cote: 1 | -1; epaule: [number, number]; coude: number; lampe?: boolean; puissanceLampe?: number }> = ({ a, cote, epaule, coude, lampe, puissanceLampe = 1 }) => {
  const { C, adulte } = useStyle();
  const manche = <Tissu c={a.couleurHaut} />;
  const ep = (a.haut === "parka" ? 0.014 : a.haut === "polaire" ? 0.008 : 0) + (adulte ? 0.008 : 0);
  return (
    <group position={[cote * C.ecartEpaules, 0, 0]} rotation={[-rad(epaule[0]), 0, cote * rad(epaule[1])]}>
      {/* épaule arrondie */}
      <mesh castShadow>
        <sphereGeometry args={[(adulte ? 0.036 : 0.047) + ep, 16, 12]} />
        {manche}
      </mesh>
      <Segment long={C.brasHaut} r0={0.05 + ep} r1={0.043 + ep} c={manche} />
      <group position={[0, -C.brasHaut, 0]} rotation={[-rad(coude), 0, 0]}>
        <Segment long={C.avantBras} r0={0.043 + ep} r1={0.034 + ep} c={a.haut === "tshirt" ? <Peau c={a.peau} /> : manche} />
        {/* poignet côtelé */}
        <mesh position={[0, -C.avantBras + 0.012, 0]}>
          <cylinderGeometry args={[0.036 + ep, 0.036 + ep, 0.03, 14]} />
          <Tissu c={teinte(a.couleurHaut, -0.25)} r={1} />
        </mesh>
        <group position={[0, -C.avantBras, 0]}>
          <group scale={0.85}>
            <Main a={a} cote={cote} />
          </group>
          {lampe && (
            <group position={[0, -0.07, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <LampeTorche puissance={puissanceLampe} />
            </group>
          )}
        </group>
      </group>
    </group>
  );
};

const Chaussure: React.FC<{ a: Apparence }> = ({ a }) => {
  const { C } = useStyle();
  const sole = a.chaussures === "baskets" ? "#f4f2ee" : a.chaussures === "chaussons" ? "#3a2a22" : "#2a201a";
  return (
    <group position={[0, -C.semelle + 0.004, 0.035]}>
      {/* semelle */}
      <mesh position={[0, 0.012, 0]} castShadow>
        <boxGeometry args={[0.095, 0.024, 0.255]} />
        <meshStandardMaterial color={sole} roughness={0.8} />
      </mesh>
      {/* dessus arrondi */}
      <mesh position={[0, 0.045, -0.005]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, a.chaussures === "chaussons" ? 0.55 : 0.75]} castShadow>
        <capsuleGeometry args={[0.046, 0.15, 6, 14]} />
        <Tissu c={a.couleurChaussures} r={a.chaussures === "chaussons" ? 1 : 0.7} />
      </mesh>
      {a.chaussures === "baskets" && (
        // lacets
        [0.02, 0.045].map((z) => (
          <mesh key={z} position={[0, 0.088, z]}>
            <boxGeometry args={[0.05, 0.006, 0.008]} />
            <meshStandardMaterial color="#bdb7ad" roughness={0.9} />
          </mesh>
        ))
      )}
    </group>
  );
};

const Jambe: React.FC<{ a: Apparence; cote: 1 | -1; hanche: [number, number]; genou: number }> = ({ a, cote, hanche, genou }) => {
  const { C, adulte } = useStyle();
  const e = adulte ? 1.3 : 1; // jambes d'adulte : plus longues, donc plus épaisses
  const tissu = <Tissu c={a.pantalon} r={0.95} />;
  return (
    <group position={[cote * C.ecartHanches, 0, 0]} rotation={[-rad(hanche[0]), 0, cote * rad(hanche[1])]}>
      <Segment long={C.cuisse} r0={(a.femme ? 0.066 : 0.064) * e} r1={0.05 * e} c={tissu} />
      <group position={[0, -C.cuisse, 0]} rotation={[rad(genou), 0, 0]}>
        <Segment long={C.tibia} r0={0.05 * e} r1={0.04 * e} c={tissu} />
        {/* bas du pantalon */}
        <mesh position={[0, -C.tibia + 0.02, 0]}>
          <cylinderGeometry args={[0.044 * e, 0.046 * e, 0.035, 14]} />
          <Tissu c={teinte(a.pantalon, -0.2)} />
        </mesh>
        <group position={[0, -C.tibia, 0]} rotation={[-rad(genou - hanche[0]), 0, 0]} scale={adulte ? 1.05 : 0.8}>
          <Chaussure a={a} />
        </group>
      </group>
    </group>
  );
};

// Œil « manga » (comme Inès en partie 1) : grand blanc, iris coloré à anneau sombre et dégradé clair en bas,
// pupille, deux reflets, trait de cils épais et virgule au coin extérieur. Aucune paupière : tout l'œil est visible ;
// `ouverture` écrase l'œil verticalement (clignement, regard fatigué, yeux écarquillés). Dessiné à l'échelle d'une
// tête de rayon 0,27 puis réduit (ECHELLE_OEIL) à la tête de dessin.
const ECHELLE_OEIL = 0.112 / 0.27;
const Oeil: React.FC<{ k: number; ouverture: number; iris: string }> = ({ k, ouverture, iris }) => {
  const anneau = teinte(iris, -0.65);
  const clair = teinte(iris, 0.35);
  const cils = "#24140e";
  return (
    <group scale={ECHELLE_OEIL}>
      {/* aplati en profondeur : vu de trois-quarts, l'œil suit la courbe de la tête */}
      <group scale={[1, Math.max(0.06, ouverture), 0.72]}>
        <mesh scale={[1, 1.3, 0.5]}>
          <sphereGeometry args={[0.068, 28, 20]} />
          <meshStandardMaterial color="#fbf8f2" roughness={0.35} />
        </mesh>
        <mesh position={[-k * 0.004, -0.006, 0.022]} scale={[0.86, 1.12, 0.4]}>
          <sphereGeometry args={[0.052, 24, 18]} />
          <meshStandardMaterial color={anneau} roughness={0.3} />
        </mesh>
        <mesh position={[-k * 0.004, -0.008, 0.03]} scale={[0.8, 1.05, 0.36]}>
          <sphereGeometry args={[0.047, 24, 18]} />
          <meshStandardMaterial color={iris} roughness={0.25} emissive={iris} emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[-k * 0.004, -0.024, 0.038]} scale={[0.75, 0.55, 0.3]}>
          <sphereGeometry args={[0.04, 20, 14]} />
          <meshStandardMaterial color={clair} roughness={0.25} emissive={clair} emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[-k * 0.004, -0.004, 0.044]} scale={[0.75, 1.05, 0.3]}>
          <sphereGeometry args={[0.022, 16, 12]} />
          <meshStandardMaterial color="#120703" roughness={0.2} />
        </mesh>
        <mesh position={[0.017, 0.03, 0.05]}>
          <sphereGeometry args={[0.017, 12, 10]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <mesh position={[-0.016, -0.034, 0.05]}>
          <sphereGeometry args={[0.008, 10, 8]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.002, 0.012]} scale={[1.06, 1.32, 1]}>
          <torusGeometry args={[0.068, 0.0085, 8, 28, Math.PI]} />
          <meshStandardMaterial color={cils} roughness={0.6} />
        </mesh>
        <mesh position={[k * 0.074, 0.05, 0.016]} rotation={[0, 0, k * 0.55]}>
          <boxGeometry args={[0.036, 0.011, 0.01]} />
          <meshStandardMaterial color={cils} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

const Cheveux: React.FC<{ a: Apparence; R: number }> = ({ a, R }) => {
  const c = a.cheveux;
  const clair = teinte(c, 0.12);
  const sombre = teinte(c, -0.2);
  const mat = (x: string) => <meshStandardMaterial color={x} roughness={0.5} />;
  if (a.coiffure === "couronne") {
    // couronne grise autour de l'arrière du crâne, dessus dégarni, quelques mèches fines
    return (
      <group>
        <Couronne R={R} c={c} />
        {[-1, 1].map((k) => (
          <mesh key={k} position={[k * R * 0.84, R * 0.12, -R * 0.08]} scale={[0.42, 0.9, 0.9]}>
            <sphereGeometry args={[R * 0.26, 12, 10]} />
            {mat(c)}
          </mesh>
        ))}
      </group>
    );
  }
  // Carré : volume lisse sculpté au tour, ouvert devant (lathe : angle 0 = devant), pointes légèrement rentrées ;
  // coupe courte : même volume arrêté aux oreilles. Quelques mèches fines en surface pour la matière.
  if (a.coiffure === "long") return <Carre R={R} bas={-2.5} c={c} clair={clair} sombre={sombre} frange />;
  if (a.coiffure === "meches") {
    // coupe courte « anime » : volume court + mèches en pointes sur le dessus et sur le front
    const meches: [number, number, number, number, number][] = [
      [-0.05, 0.98, 0.45, 1.0, -0.5], [-0.018, 1.02, 0.55, 1.15, -0.15], [0.02, 1.02, 0.55, 1.2, 0.2], [0.052, 0.96, 0.45, 1.0, 0.55],
      [-0.035, 0.7, 0.85, 1.55, -0.35], [0.0, 0.74, 0.88, 1.65, 0.05], [0.035, 0.7, 0.85, 1.5, 0.4],
    ];
    return (
      <group>
        <mesh position={[0, 0.006, -0.012]} rotation={[-0.78, 0, 0]} scale={[1.05, 1.06, 1.1]} castShadow>
          <sphereGeometry args={[R, 36, 16, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
          <meshStandardMaterial color={c} roughness={0.48} />
        </mesh>
        {meches.map(([x, y, z, rx, rz], i) => (
          <group key={i} position={[x, R * y, R * z]} rotation={[rx, 0, rz]}>
            <mesh position={[0, 0.022, 0]} scale={[1.3, 1, 0.55]}>
              <coneGeometry args={[0.018, 0.06, 8]} />
              <meshStandardMaterial color={i % 2 ? clair : c} roughness={0.48} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }
  const bas = a.coiffure === "carre" ? -0.85 : -0.1;
  return <Carre R={R} bas={bas} c={c} clair={clair} sombre={sombre} frange={a.coiffure === "carre"} />;
};

const Carre: React.FC<{ R: number; bas: number; c: string; clair: string; sombre: string; frange: boolean }> = ({ R, bas, c, clair, sombre, frange }) => {
  const geo = useMemo(() => {
    const pts: Vector2[] = [];
    for (let i = 0; i <= 16; i++) {
      const u = i / 16; // 0 = sommet, 1 = pointes
      const y = R * (1.1 - u * (1.1 - bas));
      const rayon = u < 0.4 ? R * 1.12 * Math.sin(Math.acos(Math.max(-1, Math.min(1, y / (R * 1.14))))) + 0.006 : R * (1.17 + 0.06 * Math.sin((u - 0.4) * 3)) - (u > 0.88 ? (u - 0.88) * R * 0.9 : 0);
      pts.push(new Vector2(Math.max(0.002, rayon), y));
    }
    return new LatheGeometry(pts, 40, 0.78, Math.PI * 2 - 1.56);
  }, [R, bas]);
  return (
    <group>
      <mesh geometry={geo} position={[0, 0.004, -0.01]} scale={[0.98, 1, 1]} castShadow>
        <meshStandardMaterial color={c} roughness={0.48} side={2} />
      </mesh>
      {/* dessus du crâne jusqu'au front */}
      <mesh position={[0, 0.008, 0]} scale={[1.0, 1.07, 1.08]}>
        <sphereGeometry args={[R, 36, 12, 0, Math.PI * 2, 0, Math.PI * 0.32]} />
        <meshStandardMaterial color={c} roughness={0.48} />
      </mesh>
      {frange &&
        [-0.048, -0.024, 0, 0.024, 0.048].map((x, i) => (
          <group key={i} position={[x, R * 0.8, R * 0.62]} rotation={[1.2, 0, -x * 3]}>
            <mesh position={[0, -0.02, 0]} scale={[1.4, 1, 0.6]}>
              <capsuleGeometry args={[0.012, 0.03, 4, 8]} />
              <meshStandardMaterial color={i % 2 ? clair : c} roughness={0.48} />
            </mesh>
          </group>
        ))}
    </group>
  );
};

// Couronne de cheveux d'un homme âgé : bande arrondie autour de l'arrière du crâne (ouverte devant)
const Couronne: React.FC<{ R: number; c: string }> = ({ R, c }) => {
  const geo = useMemo(() => {
    const pts = [[0.84, 0.28], [0.93, 0.17], [0.97, 0.03], [0.96, -0.12], [0.91, -0.23], [0.84, -0.28]].map(([r, y]) => new Vector2(r * R, y * R));
    return new LatheGeometry(pts, 40, 1.65, Math.PI * 2 - 3.3);
  }, [R]);
  return (
    <mesh geometry={geo} position={[0, -0.006, -0.004]} scale={[0.9, 1, 0.99]} castShadow>
      <meshStandardMaterial color={c} roughness={0.6} side={2} />
    </mesh>
  );
};

// Tête au tour : front rond, pommettes, joues qui se resserrent vers un petit menton (une seule surface lisse)
const TeteForme: React.FC<{ R: number; peau: string; adulte?: boolean }> = ({ R, peau, adulte = false }) => {
  const geo = useMemo(() => {
    // du menton vers le sommet (ordre ascendant : faces tournées vers l'extérieur)
    const prof = [[0.001, -1.0], [0.36, -0.93], [0.62, -0.74], [0.82, -0.48], [0.93, -0.2], [0.96, 0.08], [0.9, 0.38], [0.72, 0.7], [0.42, 0.92], [0.001, 1.0]];
    const courbe = new SplineCurve(prof.map(([r, y]) => new Vector2(r * R, y * R)));
    return new LatheGeometry(courbe.getPoints(48), 72);
  }, [R]);
  return (
    <mesh geometry={geo} scale={adulte ? [0.82, 1.08, 0.92] : [0.9, 1, 0.95]} castShadow>
      <Peau c={peau} />
    </mesh>
  );
};

const Lunettes: React.FC<{ R: number }> = ({ R }) => (
  <group position={[0, 0.006, R * 0.96]}>
    {[-1, 1].map((k) => (
      <mesh key={k} position={[k * 0.033, 0, 0]} scale={[1.15, 0.85, 1]}>
        <torusGeometry args={[0.021, 0.0028, 6, 20]} />
        <meshStandardMaterial color="#2a2420" roughness={0.35} metalness={0.3} />
      </mesh>
    ))}
    <mesh position={[0, 0.004, 0]}>
      <boxGeometry args={[0.018, 0.003, 0.003]} />
      <meshStandardMaterial color="#2a2420" roughness={0.35} />
    </mesh>
    {[-1, 1].map((k) => (
      <mesh key={k} position={[k * 0.058, 0.004, -0.045]} rotation={[0, k * 0.15, 0]}>
        <boxGeometry args={[0.003, 0.003, 0.09]} />
        <meshStandardMaterial color="#2a2420" roughness={0.35} />
      </mesh>
    ))}
  </group>
);

const Bonnet: React.FC<{ a: Apparence; R: number }> = ({ a, R }) => (
  <group>
    <mesh position={[0, 0.02, -0.004]} scale={[1.14, 1.12, 1.14]} castShadow>
      <sphereGeometry args={[R, 30, 14, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
      <Tissu c={a.bonnet!} r={1} />
    </mesh>
    <mesh position={[0, R * 0.42, -0.004]} rotation={[Math.PI / 2 - 0.12, 0, 0]} scale={[1, 1, 1]}>
      <torusGeometry args={[R * 1.0, 0.016, 8, 30]} />
      <Tissu c={teinte(a.bonnet!, -0.18)} r={1} />
    </mesh>
    <mesh position={[0, R * 1.18, -0.01]}>
      <sphereGeometry args={[0.03, 12, 10]} />
      <Tissu c={a.couleurPompon} r={1} />
    </mesh>
  </group>
);

// Bouche : lèvres au repos (sourire / moue) ou ouverte (parole, surprise, peur)
const Bouche: React.FC<{ v: Visage; R: number; a: Apparence }> = ({ v, R, a }) => {
  const levres = a.femme ? "#c0645e" : teinte(a.peau, -0.28);
  const y = -R * 0.5;
  const z = R * 0.86;
  if (v.bouche > 0.08) {
    const o = v.bouche;
    return (
      <group position={[0, y - 0.004 * o, z]}>
        <mesh scale={[1 + 0.2 * Math.max(0, v.sourire), 0.3 + 0.9 * o, 0.4]}>
          <sphereGeometry args={[0.014, 14, 10]} />
          <meshStandardMaterial color="#3a1414" roughness={0.6} />
        </mesh>
        {/* dents du haut quand la bouche s'ouvre */}
        <mesh position={[0, 0.0035 + 0.003 * o, 0.003]} scale={[1, 0.25, 0.3]}>
          <sphereGeometry args={[0.011, 10, 8]} />
          <meshStandardMaterial color="#f1ece2" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.014 * (0.3 + 0.9 * o) * 0.9, 0.002]} scale={[1.25, 0.32, 0.5]}>
          <sphereGeometry args={[0.012, 12, 8]} />
          <meshStandardMaterial color={levres} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.014 * (0.3 + 0.9 * o) * 0.9, 0.002]} scale={[1.15, 0.36, 0.5]}>
          <sphereGeometry args={[0.012, 12, 8]} />
          <meshStandardMaterial color={levres} roughness={0.5} />
        </mesh>
      </group>
    );
  }
  const m = v.sourire;
  return (
    <group position={[0, y, z]}>
      <mesh rotation={[0, 0, m >= 0 ? Math.PI : 0]} position={[0, m < 0 ? -0.004 : 0.002, 0]} scale={[1 + 0.2 * Math.abs(m), 0.18 + 0.5 * Math.abs(m), 1]}>
        <torusGeometry args={[0.016, 0.0032, 6, 16, Math.PI]} />
        <meshStandardMaterial color={teinte(levres, -0.35)} roughness={0.5} />
      </mesh>
      {/* lèvre inférieure */}
      <mesh position={[0, -0.006, -0.002]} scale={[1.2, 0.38, 0.5]}>
        <sphereGeometry args={[0.012, 12, 8]} />
        <meshStandardMaterial color={levres} roughness={0.5} />
      </mesh>
    </group>
  );
};

const Tete: React.FC<{ pose: Pose; a: Apparence; visage?: Visage }> = ({ pose, a, visage }) => {
  const { C, adulte } = useStyle();
  const R = RAYON_DESSIN;
  const k = C.rayonTete / RAYON_DESSIN;
  const v = visage ?? visageDePose(pose);
  const s = v.sourcils;
  const sourcil = a.age > 0.6 ? a.cheveux : teinte(a.cheveux, -0.15);
  return (
    <group rotation={[rad(pose.tete[0]), rad(pose.tete[1]), 0]}>
      {/* cou */}
      <mesh position={[0, C.cou / 2 + 0.01, -0.035]} castShadow>
        <cylinderGeometry args={adulte ? [0.052, 0.062, C.cou + 0.04, 14] : [0.04, 0.05, C.cou + 0.04, 14]} />
        <Peau c={a.peau} />
      </mesh>
      <group position={[0, C.cou + C.rayonTete * 0.86, 0.008 * k]} scale={k}>
        {/* crâne + mâchoire : visage ovale */}
        <TeteForme R={R} peau={a.peau} adulte={adulte} />
        {/* oreilles */}
        {[-1, 1].map((k) => (
          <mesh key={k} position={[k * R * 0.86, -R * 0.08, -R * 0.02]} scale={[0.32, 1, 0.62]}>
            <sphereGeometry args={[R * 0.22, 12, 10]} />
            <Peau c={teinte(a.peau, -0.05)} />
          </mesh>
        ))}
        {/* joues rosées (pas en style adulte : taches grises en noir et blanc) */}
        {!adulte && [-1, 1].map((k) => (
          <mesh key={k} position={[k * R * 0.42, -R * 0.3, R * 0.74]}>
            <sphereGeometry args={[R * 0.13, 12, 10]} />
            <meshStandardMaterial color={a.joues} roughness={0.7} transparent opacity={0.16} depthWrite={false} />
          </mesh>
        ))}
        {/* yeux + sourcils */}
        {[-1, 1].map((k) => (
          <group key={k} position={[k * R * 0.34, R * 0.02, R * 0.84]} rotation={[0, k * 0.36, 0]}>
            {adulte ? (
              // œil en amande (style adulte) : plus petit, étiré, paupière supérieure marquée d'un trait épais
              <group position={[0, -0.004, -0.004]}>
                <group scale={[0.92, 0.4, 0.9]}>
                  <Oeil k={k} ouverture={v.yeux} iris={a.iris} />
                </group>
                <mesh position={[k * 0.003, 0.0145 * Math.min(1, v.yeux), 0.012]} rotation={[0, 0, Math.PI / 2 - k * 0.14]}>
                  <capsuleGeometry args={[0.0034, 0.05, 3, 8]} />
                  <meshStandardMaterial color="#1a0f0b" roughness={0.6} />
                </mesh>
              </group>
            ) : (
              <Oeil k={k} ouverture={v.yeux} iris={a.iris} />
            )}
            <mesh position={[0, 0.043 + 0.012 * Math.max(0, v.yeux - 1) - 0.003 * Math.max(0, s), 0.006]} rotation={[0, 0, Math.PI / 2 + k * rad(16 * s)]} scale={[a.age > 0.6 ? 1.7 : 1, 1, 1]}>
              <capsuleGeometry args={[0.0035, 0.028, 3, 6]} />
              <meshStandardMaterial color={sourcil} roughness={0.8} />
            </mesh>
          </group>
        ))}
        {/* nez */}
        <mesh position={[0, -R * 0.24, R * 0.9]} scale={adulte ? [0.55, 1.2, 0.85] : [1.15, 0.9, 0.85]}>
          <sphereGeometry args={[0.0115, 14, 10]} />
          <Peau c={teinte(a.peau, -0.03)} />
        </mesh>
        <group position={[0, -R * 0.5, R * 0.86]} scale={1.25}>
          <group position={[0, R * 0.5, -R * 0.86]}>
            <Bouche v={v} R={R} a={a} />
          </group>
        </group>
        {/* rides (âge) : front et plis du sourire */}
        {a.age > 0.6 && (
          <group>
            {[0.5, 0.58].map((y) => (
              <mesh key={y} position={[0, R * y, R * 0.82]} rotation={[-0.5, 0, 0]}>
                <boxGeometry args={[0.05, 0.0018, 0.002]} />
                <meshStandardMaterial color={teinte(a.peau, -0.25)} roughness={0.8} />
              </mesh>
            ))}
            {[-1, 1].map((k) => (
              <mesh key={k} position={[k * R * 0.25, -R * 0.42, R * 0.84]} rotation={[0, k * 0.4, k * 0.35]}>
                <boxGeometry args={[0.0018, 0.03, 0.002]} />
                <meshStandardMaterial color={teinte(a.peau, -0.25)} roughness={0.8} />
              </mesh>
            ))}
          </group>
        )}
        {a.lunettes && <Lunettes R={R} />}
        {a.bandeau && !a.bonnet && (
          <mesh position={[0, R * 0.5, -0.008]} rotation={[Math.PI / 2 - 0.42, 0, 0]} scale={[0.97, 1, 1]}>
            <torusGeometry args={[R * 1.02, R * 0.12, 10, 36]} />
            <Tissu c={a.bandeau} r={1} />
          </mesh>
        )}
        {a.bonnet ? (
          <group>
            {/* sous le bonnet, seules les mèches basses dépassent */}
            <group scale={[1, 0.7, 1]} position={[0, -0.02, 0]}>
              <Cheveux a={{ ...a, coiffure: a.coiffure === "couronne" ? "couronne" : a.coiffure }} R={R} />
            </group>
            <Bonnet a={a} R={R} />
          </group>
        ) : (
          <Cheveux a={a} R={R} />
        )}
      </group>
    </group>
  );
};

export const Humain: React.FC<{
  pose: Pose;
  position: Vec3;
  orientation: number; // degrés
  lampe?: boolean;
  puissanceLampe?: number;
  taille?: number;
  apparence?: Partial<Apparence>;
  visage?: Visage;
  variante?: Variante; // "humain" (figurine, défaut) ou "adulte"
}> = ({ pose, position, orientation, lampe = false, puissanceLampe = 1, taille = 1, apparence, visage, variante = "humain" }) => {
  const a: Apparence = { ...APPARENCE_DEFAUT, ...apparence };
  const C = corpsDe(variante);
  const style = useMemo(() => ({ C, adulte: variante === "adulte" }), [C, variante]);
  const yBassin = hauteurBassin(pose, variante);
  const voute = 10 * a.age * a.age; // dos voûté avec l'âge
  return (
    <Style.Provider value={style}>
    <group position={position} rotation={[0, rad(orientation), 0]} scale={taille}>
      <group position={[0, yBassin, 0]}>
        <Jambe a={a} cote={1} hanche={pose.hancheG} genou={pose.genouG} />
        <Jambe a={a} cote={-1} hanche={pose.hancheD} genou={pose.genouD} />
        <group rotation={[rad(pose.tronc[0] + voute), rad(pose.tronc[1]), rad(pose.tronc[2])]}>
          {/* bassin (ceinture du pantalon) */}
          <mesh position={[0, -0.04, 0]} scale={variante === "adulte" ? [1.12, 0.62, 0.74] : [1, 0.62, 0.68]} castShadow>
            <sphereGeometry args={[0.135, 20, 14]} />
            <Tissu c={a.pantalon} r={0.95} />
          </mesh>
          <group scale={[variante === "adulte" ? 1.12 : 1, C.bassinVersEpaules / 0.5, variante === "adulte" ? 1.1 : 1]}>
            <Torse a={a} />
          </group>
          {a.echarpe && (
            <group position={[0, C.bassinVersEpaules - 0.005, 0.005]}>
              <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                <torusGeometry args={[0.075, 0.034, 10, 24]} />
                <Tissu c={a.echarpe} r={1} />
              </mesh>
              <Arrondi taille={[0.055, 0.17, 0.025]} position={[0.045, -0.1, 0.085]} rotation={[0.15, 0, 0.1]} rayon={0.012} couleur={a.echarpe} rugosite={1} />
              {[-0.02, 0.0, 0.02].map((x) => (
                <mesh key={x} position={[0.045 + x, -0.19, 0.098]}>
                  <boxGeometry args={[0.006, 0.03, 0.006]} />
                  <Tissu c={teinte(a.echarpe!, -0.15)} r={1} />
                </mesh>
              ))}
            </group>
          )}
          {a.sac && (
            <group position={[0, C.bassinVersEpaules * 0.55, -0.13]}>
              <Arrondi taille={[0.22, 0.24, 0.1]} position={[0, 0, -0.03]} rayon={0.03} couleur={a.sac} rugosite={0.9} />
              <Arrondi taille={[0.17, 0.09, 0.04]} position={[0, -0.06, -0.09]} rayon={0.015} couleur={teinte(a.sac, -0.12)} rugosite={0.9} />
              {[-1, 1].map((k) => (
                <mesh key={k} position={[k * 0.075, 0.03, 0.2]} rotation={[0.08, 0, 0]}>
                  <boxGeometry args={[0.028, 0.24, 0.01]} />
                  <meshStandardMaterial color="#3b2a1a" roughness={0.8} />
                </mesh>
              ))}
            </group>
          )}
          <group position={[0, C.bassinVersEpaules - 0.035, 0]}>
            <Bras a={a} cote={1} epaule={pose.epauleG} coude={pose.coudeG} />
            <Bras a={a} cote={-1} epaule={pose.epauleD} coude={pose.coudeD} lampe={lampe} puissanceLampe={puissanceLampe} />
          </group>
          <group position={[0, C.bassinVersEpaules, 0]} rotation={[rad(-voute * 0.8), 0, 0]}>
            <Tete pose={pose} a={a} visage={visage} />
          </group>
        </group>
      </group>
    </group>
    </Style.Provider>
  );
};
