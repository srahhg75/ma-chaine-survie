import React, { useMemo } from "react";
import { EpisodeStandard, PropsEpisode } from "../../systeme/EpisodeStandard";
import { Arrondi } from "../../systeme/kit3d/Arrondi";
import { Fantome } from "../../systeme/kit3d/Fantome";
import { bruit, clamp, lerp, Vec3 } from "../../systeme/maths";
import { Alignement } from "../../systeme/mots";
import { etatPersonnage, present, resoudrePersonnage } from "../../systeme/personnage/trajet";
import { Immeuble, Lumiere, useTemps } from "../001-h72/Episode";
import { DEMI, NIV } from "../003-h72-lampe/donnees";
import { CageEscalier, Faisceau } from "../003-h72-lampe/Episode";
import { PL } from "../004-h72-conseil/donnees";
import { Carnet, devant, feutre, pageLignee, Papier, Salon, useDessin } from "../004-h72-conseil/Episode";
import { CALE, CARNET, donnees, ENVELOPPE, GANTS, KX, MAIN_INES5, MAIN_TROUSSEAU, PAPIER_MAIN, ROBINET, TROUSSE_MOREL, TROUSSEAU } from "./donnees";

/*
 * Éléments 3D de H+72 partie 5 (dernier épisode) : la cale sous la porte d'Inès, la poignée qui tourne, l'enveloppe,
 * la trousse confiée à Morel, le carnet et sa fausse ligne, la lampe du complice et les policiers au 4e, le trousseau
 * des doubles (sans la clé du 6e), la cage qui se rallume, la pompe et le robinet de la partie 1 qui redonne de l'eau.
 */
const rad = (d: number) => (d * Math.PI) / 180;
const EAU = "#6fa8d8";
const ZPORTE = -1.54; // face intérieure de la porte d'Inès (fermée)

// Cale en bois : biseau (le bout fin glissé sous la porte, vers le sud)
const CaleBois: React.FC<{ position: Vec3 }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.018, 0]} rotation={[-0.2, 0, 0]} castShadow>
      <boxGeometry args={[0.07, 0.03, 0.16]} />
      <meshStandardMaterial color="#b0844f" roughness={0.75} />
    </mesh>
  </group>
);

// Poignée intérieure de la porte d'Inès (béquille qui s'abaisse quand on tourne de l'extérieur)
const Poignee: React.FC<{ angle: number; ouverture: number }> = ({ angle, ouverture }) => {
  const a = 1.3 * ouverture; // la porte pivote autour de sa charnière (x −1,35)
  return (
    <group position={[-1.35, NIV.e6, ZPORTE + 0.06]} rotation={[0, a, 0]}>
      <group position={[0.78, 1.0, -0.1]} rotation={[0, 0, -angle]}>
        <Arrondi taille={[0.13, 0.022, 0.025]} position={[-0.055, 0, 0]} rayon={0.008} couleur="#c8b27a" metal={0.8} rugosite={0.3} />
      </group>
      <Arrondi taille={[0.05, 0.12, 0.012]} position={[0.78, 1.0, -0.092]} rayon={0.006} couleur="#c8b27a" metal={0.8} rugosite={0.3} />
    </group>
  );
};

// Enveloppe kraft (le papier glissé dedans)
const Enveloppe: React.FC<{ position: Vec3; remplie: number }> = ({ position, remplie }) => (
  <group position={position} rotation={[0, 0.3, 0]}>
    <Arrondi taille={[0.22, 0.006 + 0.004 * remplie, 0.16]} rayon={0.002} couleur="#ece6d8" rugosite={0.9} />
    <mesh position={[0, 0.006, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.2, 0.05]} />
      <meshStandardMaterial color="#d6cfbe" roughness={0.9} />
    </mesh>
  </group>
);

// Trousse d'infirmière (rouge, croix blanche)
const Trousse: React.FC<{ position: Vec3; rotation?: number }> = ({ position, rotation = 0 }) => (
  <group position={position} rotation={[0, rotation, 0]}>
    <Arrondi taille={[0.26, 0.15, 0.13]} position={[0, 0.075, 0]} rayon={0.03} couleur="#b3262a" rugosite={0.7} />
    <Arrondi taille={[0.09, 0.025, 0.006]} position={[0, 0.08, 0.066]} rayon={0.003} couleur="#f4f1ea" />
    <Arrondi taille={[0.025, 0.09, 0.006]} position={[0, 0.08, 0.066]} rayon={0.003} couleur="#f4f1ea" />
    <Arrondi taille={[0.1, 0.02, 0.02]} position={[0, 0.16, 0]} rayon={0.008} couleur="#3a1a1a" />
  </group>
);

// Trousseau des doubles : un anneau, des clés étiquetées par étage ; l'étiquette « 6e » pend sans clé
const ETAGES = ["1er", "2e", "3e", "4e", "5e", "6e", "7e"];
const Trousseau: React.FC<{ position: Vec3; t: number }> = ({ position, t }) => {
  const tex = useDessin(
    700,
    100,
    (c) => {
      c.clearRect(0, 0, 700, 100);
      ETAGES.forEach((e, i) => {
        c.fillStyle = e === "6e" ? "#ff3b30" : "#f2ead6";
        c.fillRect(i * 100 + 4, 4, 92, 92);
        feutre(c, e, i * 100 + 14, 66, 42, e === "6e" ? "#ffffff" : "#1d2a4a");
      });
    },
    "etiquettes-trousseau",
  );
  // une texture par étiquette (même image, décalée) : un décalage posé sur la texture partagée les changerait toutes
  const textures = useMemo(
    () =>
      ETAGES.map((_, i) => {
        const c = tex.clone();
        c.offset.set(i / ETAGES.length, 0);
        c.repeat.set(1 / ETAGES.length, 1);
        c.needsUpdate = true;
        return c;
      }),
    [tex],
  );
  const balance = 0.08 * Math.sin(t * 2.3);
  return (
    <group position={position} rotation={[0, 0, balance]}>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.035, 0.004, 8, 24]} />
        <meshStandardMaterial color="#c9ced2" metalness={0.85} roughness={0.25} />
      </mesh>
      {ETAGES.map((e, i) => {
        const ang = lerp(-1.05, 1.05, i / (ETAGES.length - 1));
        const x = Math.sin(ang) * 0.05;
        const y = -0.035 - Math.cos(ang) * 0.03;
        return (
          <group key={e} position={[x, y, 0]} rotation={[0, 0, ang * 0.6]}>
            {e !== "6e" && <Arrondi taille={[0.012, 0.055, 0.004]} position={[0, -0.03, 0.004]} rayon={0.003} couleur="#b8a46a" metal={0.85} rugosite={0.3} />}
            <mesh position={[0, -0.075, -0.002]}>
              <planeGeometry args={[0.03, 0.03]} />
              <meshStandardMaterial map={textures[i]} roughness={0.8} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Carnet du piège : à gauche la liste des fragiles, à droite (la page d'après, celle arrachée a disparu) la fausse ligne
const CarnetPiege: React.FC<{ ligne: number }> = ({ ligne }) => {
  const tex = useDessin(
    1400,
    720,
    (c) => {
      pageLignee(c, 0, 700, 720);
      feutre(c, "LISTE DES FRAGILES", 80, 60, 40, "#7a1f1f");
      c.fillStyle = "#7a1f1f";
      c.fillRect(80, 72, 470, 5);
      ["Mme BENOÎT · 7e · seule", "7e GAUCHE · diabète", "MOREL · 5e · 70 ans"].forEach((t, k2) => feutre(c, t, 80, 162 + k2 * 92, 34, "#1d2a4a", (k2 % 2 ? 1 : -1) * 0.01));
      pageLignee(c, 700, 700, 720);
      if (ligne > 0) {
        feutre(c, "TROUSSE D'INÈS", 790, 300, 52, "#8a1f1f", -0.02);
        feutre(c, "→ CAVE 6", 830, 400, 60, "#8a1f1f", -0.02);
      }
      c.fillStyle = "rgba(0,0,0,0.28)";
      c.fillRect(694, 0, 12, 720);
    },
    `carnet-piege${ligne > 0}`,
  );
  return (
    <group position={CARNET}>
      <Arrondi taille={[0.44, 0.012, 0.225]} position={[0, -0.004, 0]} rayon={0.004} couleur="#3d2a20" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <planeGeometry args={[0.42, 0.216]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
    </group>
  );
};

// Robinet de la cuisine (partie 1) : il crache de l'air (gouttes, à-coups)… puis l'eau coule en continu
const RobinetRetour: React.FC<{ t: number; air: number; eau: number }> = ({ t, air, eau }) => {
  const [x, y, z] = ROBINET;
  const acoup = air > 0 && eau <= 0 && bruit("robinet5", t * 9) > 0.35 ? 1 : 0;
  const filet = Math.max(eau, 0.5 * acoup);
  const longueur = y - 0.9;
  return (
    <group>
      <mesh position={[x, y + 0.02, (z - 1.48) / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.13, 10]} />
        <meshStandardMaterial color="#c9ced2" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[x, y + 0.005, z]}>
        <cylinderGeometry args={[0.016, 0.013, 0.03, 10]} />
        <meshStandardMaterial color="#c9ced2" metalness={0.9} roughness={0.2} />
      </mesh>
      {filet > 0.02 && (
        <mesh position={[x, y - longueur / 2, z]}>
          <cylinderGeometry args={[0.013 * filet + 0.003, 0.016 * filet + 0.003, longueur, 10]} />
          <meshStandardMaterial color={EAU} transparent opacity={0.8} roughness={0.05} emissive="#4f8fd0" emissiveIntensity={0.3} />
        </mesh>
      )}
      {/* gouttelettes projetées par l'air */}
      {air > 0 &&
        eau < 0.5 &&
        [0, 1, 2, 3].map((i) => {
          const c = (t * 2.2 + i * 0.27) % 1;
          return (
            <mesh key={i} position={[x + 0.03 * Math.sin(i * 2.1), y - c * 0.22, z + 0.02 * Math.cos(i * 1.3)]}>
              <sphereGeometry args={[0.006, 6, 6]} />
              <meshStandardMaterial color={EAU} transparent opacity={0.8 * (1 - c)} />
            </mesh>
          );
        })}
    </group>
  );
};

// Plafonniers de la cage : éteints (pas de courant) jusqu'au retour du courant, au jour 6
const Plafonniers: React.FC<{ allume: number }> = ({ allume }) => (
  <>
    {[NIV.e4, NIV.e5, NIV.e6, NIV.e7].flatMap((y) => [
      <group key={`e${y}`}>
        <mesh position={[-0.9, y + 2.55, -0.4]}>
          <sphereGeometry args={[0.1, 14, 10]} />
          <meshStandardMaterial color="#fff4dc" emissive="#ffd9a0" emissiveIntensity={1.6 * allume} />
        </mesh>
        {allume > 0.01 && <pointLight position={[-0.9, y + 2.3, -0.4]} intensity={2.4 * allume} distance={4.5} color="#ffe2b8" decay={2} />}
      </group>,
      <group key={`d${y}`}>
        <mesh position={[2.7, y + DEMI + 2.4, -0.4]}>
          <sphereGeometry args={[0.09, 14, 10]} />
          <meshStandardMaterial color="#fff4dc" emissive="#ffd9a0" emissiveIntensity={1.6 * allume} />
        </mesh>
        {allume > 0.01 && <pointLight position={[2.7, y + DEMI + 2.2, -0.4]} intensity={1.8 * allume} distance={4} color="#ffe2b8" decay={2} />}
      </group>,
    ])}
  </>
);

const Scene: React.FC<{ al: Alignement }> = ({ al }) => {
  const { t, fps, f, a, entre } = useTemps(al);
  const perso = (id: string) => donnees.personnages.find((p) => p.id === id)!;
  const r = useMemo(
    () => Object.fromEntries(["complice-lampe", "flic1", "flic2", "flic1-6", "morel-matin", "morel-palier", "voisin4-arrete"].map((id) => [id, resoudrePersonnage(perso(id), al, fps)])),
    [al, fps],
  );
  const etat = (id: string) => etatPersonnage(r[id], f, fps);
  const la = (id: string) => present(r[id], f);

  // ---- plateau en cours ----
  const salon = (t >= a("recap4") && t < a("tait")) || (t >= a("piege") && t < a("nuit"));
  const cuisine = t >= a("pompe");
  const cage = !salon && !cuisine;

  // ---- porte d'Inès : fermée ; la nuit, on tourne la poignée, la porte s'entrouvre et bute sur la cale ----
  const angleP = t >= a("poignee:tourne") - 0.1 && t < a("i_cri") ? 0.55 * entre("poignee:tourne-0.1", 0.25) : 0;
  const porte6 = t >= a("bute") - 0.15 && t < a("pris") ? 0.032 * entre("bute-0.15", 0.2) * (1 - 0.15 * Math.abs(Math.sin(t * 9)) * (t < a("i_cri") ? 1 : 0)) : 0;
  const caleLa = t >= a("t1b") - 0.25 && t < a("pris");
  const nuitEntree = t >= a("nuit") && t < a("pris");
  const lumiereSous = t >= a("poignee") && t < a("pris") ? entre("poignee", 0.3) : 0; // la lampe du voleur, derrière la porte
  const porteMorel = t >= a("matin") && t < a("piege") ? 1 : 0;
  const porte4 = t >= a("cave") - 0.2 && t < a("cave.fin") + 0.6 ? 0.45 * entre("cave-0.2", 0.4) : 0;

  // ---- le papier : dans sa main (raccord partie 4) ; puis plié, glissé dans l'enveloppe ----
  const papierMain = t < a("a1");
  const enveloppeLa = t >= a("t2") && t < a("matin");
  const remplie = entre("t2a:enveloppe", 0.4);

  // ---- la lampe du complice qui descend, les policiers (gyrophare) ----
  const ec = etat("complice-lampe");
  const lampeComplice = la("complice-lampe") && t < a("cave.fin") + 0.5;
  const oc = rad(ec.orientation);
  const origineC: Vec3 = [ec.position[0] + Math.sin(oc) * 0.25, ec.position[1] + 1.05, ec.position[2] + Math.cos(oc) * 0.25];
  const viseC: Vec3 = [ec.position[0] + Math.sin(oc) * 2.0, ec.position[1] + 0.1, ec.position[2] + Math.cos(oc) * 2.0];
  const police4 = t >= a("attente") - 0.1 && t < a("poignee");
  const gyro = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 9));
  const v4 = etat("voisin4-arrete");
  const faisceauFlic = (id: string, force: number) => {
    if (!la(id)) return null;
    const e = etat(id);
    const o = rad(e.orientation);
    return <Faisceau key={id} origine={[e.position[0] + Math.sin(o) * 0.35, e.position[1] + 0.95, e.position[2] + Math.cos(o) * 0.35]} vise={[v4.position[0], v4.position[1] + 0.45, v4.position[2]]} force={force} longueur={1.6} froid />;
  };
  const police6 = t >= a("pris") && t < a("m_heure");

  // ---- la trousse : dans les mains d'Inès, puis Morel la prend et la pose sur son tabouret ----
  const em = etat("morel-matin");
  const mainMorel = devant(em.position, em.orientation, 0.44, 0.17, 0.8);
  const uPrise = entre("t3b", 0.5);
  const uPose = entre("t3b+0.6", 0.5);
  const trousse: Vec3 =
    t < a("t3b") ? MAIN_INES5 : uPose <= 0 ? [lerp(MAIN_INES5[0], mainMorel[0], uPrise), lerp(MAIN_INES5[1], mainMorel[1], uPrise), lerp(MAIN_INES5[2], mainMorel[2], uPrise)] : [lerp(mainMorel[0], TROUSSE_MOREL[0], uPose), lerp(mainMorel[1], TROUSSE_MOREL[1], uPose), lerp(mainMorel[2], TROUSSE_MOREL[2], uPose)];

  // ---- jour 6 : le courant revient ----
  const courant = entre("jour:courant", 0.3);
  const nuit = 1 - courant;

  // ---- cuisine (partie 1) : la pompe repart, l'eau remonte la colonne, le robinet crache de l'air puis coule ----
  const tPompe = a("pompe:repart");
  const pompe = t >= tPompe ? 1 + (t - tPompe) * 2.5 : 0;
  const eauColonne = entre("pompe:repart", "fin");
  const air = t >= a("robinet:air") - 0.2 ? 1 : 0;
  const eau = entre("fin", 0.35);

  return (
    <>
      <Lumiere nuit={nuit} />

      {/* ======== plateau 1 : la cage (et l'entrée d'Inès derrière sa porte) ======== */}
      {cage && (
        <>
          <CageEscalier porteMorel={porteMorel} porteToit={0} bougies7={1} porte4={porte4} porte6={porte6} lumiere4={porte4 > 0 ? 0.6 : 0} entreeInes />
          <Plafonniers allume={courant} />
          {/* le papier dans sa main (verso visible : la page de la liste), puis l'enveloppe sur le meuble */}
          {papierMain && <Papier position={PAPIER_MAIN} rotation={[0.1, rad(10), 0]} />}
          {enveloppeLa && <Enveloppe position={ENVELOPPE} remplie={remplie} />}
          {caleLa && <CaleBois position={CALE} />}
          <Poignee angle={angleP} ouverture={porte6} />
          {nuitEntree && <pointLight position={[-0.8, NIV.e6 + 1.7, -2.5]} intensity={1.1} distance={3.2} color="#9fb4e8" decay={2} />}
          {lumiereSous > 0 && (
            <mesh position={[-0.9, NIV.e6 + 0.006, -1.6]}>
              <boxGeometry args={[0.86, 0.008, 0.03]} />
              <meshBasicMaterial color="#e8f0ff" toneMapped={false} transparent opacity={0.85 * lumiereSous} />
            </mesh>
          )}
          {/* la porte entrouverte : la lampe froide du voleur passe par la fente */}
          {porte6 > 0.005 && (
            <>
              <pointLight position={[-0.5, NIV.e6 + 1.0, -1.3]} intensity={2.2} distance={2.6} color="#dfe9ff" decay={2} />
              <mesh position={[-0.47, NIV.e6 + 1.0, -1.565]}>
                <boxGeometry args={[0.012, 1.9, 0.01]} />
                <meshBasicMaterial color="#e8f0ff" toneMapped={false} transparent opacity={0.8} />
              </mesh>
            </>
          )}
          {t >= a("matin") && t < a("piege") && <pointLight position={[-0.6, NIV.e5 + 2.0, 0.6]} intensity={2.0} distance={5} color="#c9d4e6" decay={2} />}
          {/* la trousse, au 5e */}
          {t >= a("matin") && t < a("piege") && <Trousse position={trousse} rotation={0.4} />}
          {/* la lampe du complice qui descend au 4e */}
          <Faisceau origine={origineC} vise={viseC} force={lampeComplice ? 1 : 0} ombre />
          {/* les policiers du 4e : gyrophare par les fenêtres, lampes sur le complice */}
          {police4 && (
            <>
              <pointLight position={[2.7, NIV.e4 + DEMI + 1.2, -1.2]} intensity={5 * gyro} distance={6} color="#2f5dff" decay={1.6} />
              <pointLight position={[0.4, NIV.e4 + 1.4, 0.6]} intensity={2.5 * gyro} distance={5} color="#2f5dff" decay={1.6} />
              <pointLight position={[-0.4, NIV.e4 + 2.0, 0.2]} intensity={1.6} distance={4} color="#dfe9ff" decay={2} />
              {t < a("poche") - 0.3 && faisceauFlic("flic1", 0.35)}
              {faisceauFlic("flic2", 0.35)}
            </>
          )}
          {/* la main gantée au trousseau (rappel des parties 3 et 4) */}
          {t >= a("rappel") - 0.1 && t < a("gants") && (
            <group position={MAIN_TROUSSEAU}>
              <pointLight position={[0.35, 0.25, 0.6]} intensity={1.4} distance={1.8} color="#dfe9ff" decay={2} />
              <Arrondi taille={[0.07, 0.09, 0.04]} position={[0, 0, 0]} rayon={0.02} couleur={GANTS} />
              {[0, 1, 2].map((k) => (
                <Arrondi key={k} taille={[0.012, 0.05, 0.004]} position={[0.03 + k * 0.018, -0.07 - k * 0.01, 0.02]} rotation={[0, 0, 0.3 * k]} rayon={0.003} couleur="#b8a46a" metal={0.85} rugosite={0.3} />
              ))}
            </group>
          )}
          {/* le trousseau des doubles, dans la main du policier */}
          {t >= a("poche") - 0.3 && t < a("poignee") && <Trousseau position={TROUSSEAU} t={t} />}
          {/* le voleur pris sur le palier du 6e : lampes des policiers */}
          {police6 && (
            <>
              <pointLight position={[-0.4, NIV.e6 + 2.0, 0.3]} intensity={1.6} distance={4} color="#dfe9ff" decay={2} />
              <pointLight position={[2.7, NIV.e5 + DEMI + 1.2, -1.2]} intensity={4 * gyro} distance={6} color="#2f5dff" decay={1.6} />
            </>
          )}
          {/* lampe de Morel (il monte du 5e) */}
          {la("morel-palier") && etat("morel-palier").lampe && <pointLight position={[-0.4, NIV.e6 + 1.0, 0.6]} intensity={0.45} distance={2.5} color="#fff1d8" />}
        </>
      )}

      {/* ======== plateau 2 : le salon du 7e ======== */}
      {salon && (
        <>
          <Salon t={t} bougies={1} />
          {t < a("tait") ? <Carnet etape={5} arrachee /> : <CarnetPiege ligne={t >= a("piege:ligne") ? 1 : 0} />}
          {/* branche A : le papier dans la main du fantôme */}
          <Fantome opacite={clamp(Math.min((t - a("a1") + 0.15) / 0.2, (a("stop:rembobine") - t) / 0.2))}>
            <Papier position={devant(PL.ines, 0, 0.42, 0.17, 0.86)} rotation={[0.1, 0, 0]} />
          </Fantome>
        </>
      )}

      {/* ======== plateau 3 : la cuisine et l'immeuble de la partie 1 ======== */}
      {cuisine && (
        <>
          <group position={[KX, 0, 0]}>
            <Immeuble eau={eauColonne} pompe={pompe} loin={false} />
          </group>
          <RobinetRetour t={t} air={air} eau={eau} />
          {/* le courant est revenu : le plafonnier de la cuisine */}
          <pointLight position={[KX, 2.3, -0.2]} intensity={2.6} distance={5} color="#ffe2b8" decay={2} />
          <mesh position={[KX, 2.5, -0.2]}>
            <sphereGeometry args={[0.1, 14, 10]} />
            <meshStandardMaterial color="#fff4dc" emissive="#ffd9a0" emissiveIntensity={1.4} />
          </mesh>
        </>
      )}
    </>
  );
};

export const Episode: React.FC<PropsEpisode> = (props) => (
  <EpisodeStandard {...props} donnees={donnees} eclairage={<></>} scene={<Scene al={props.alignement} />} />
);
