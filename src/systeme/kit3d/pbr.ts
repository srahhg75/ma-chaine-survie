import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { Color, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, Texture, TextureLoader, Vector2 } from "three";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

/*
 * Matériaux PBR à partir de vraies textures (Poly Haven, CC0) copiées dans public/textures/<nom>/ par
 * tools/telecharger_textures.py : couleur.jpg, normale.jpg, arm.jpg (occlusion R / rugosité G / métal B).
 * Chargement bloquant pour le rendu (delayRender) : une image n'est jamais rendue sans ses textures.
 */
export type NomPBR =
  | "herringbone_parquet" | "painted_plaster_wall" | "metal_plate_02" | "rubber_tiles"
  | "poly_wool_herringbone" | "concrete_wall_006" | "laminate_floor_02";

type Cartes = { couleur: Texture; normale: Texture; arm: Texture };
const cache = new Map<NomPBR, Promise<Cartes>>();
const prets = new Map<NomPBR, Cartes>();
const chargeur = new TextureLoader();
// Attentes de rendu en cours : on ne redessine qu'UNE fois, quand toutes les textures demandées sont prêtes
const enAttente = new Set<number>();
const aLiberer: number[] = [];

const charger = (nom: NomPBR): Promise<Cartes> => {
  const deja = cache.get(nom);
  if (deja) return deja;
  const un = (fichier: string, srgb: boolean) =>
    chargeur.loadAsync(staticFile(`textures/${nom}/${fichier}.jpg`)).then((t) => {
      if (srgb) t.colorSpace = SRGBColorSpace;
      t.wrapS = t.wrapT = RepeatWrapping;
      t.anisotropy = 8;
      return t;
    });
  const p = Promise.all([un("couleur", true), un("normale", false), un("arm", false)]).then(([couleur, normale, arm]) => {
    const c = { couleur, normale, arm };
    prets.set(nom, c);
    return c;
  });
  cache.set(nom, p);
  return p;
};

export type OptionsPBR = {
  repetition?: [number, number]; // nombre de répétitions du motif sur la surface
  teinte?: string; // multiplie la couleur de la texture
  gain?: number; // éclaircit une texture trop sombre (multiplie la teinte, peut dépasser 1)
  occlusion?: number; // force de l'occlusion contenue dans la texture (0..1), défaut 1
  rugosite?: number; // multiplie la rugosité de la carte
  metal?: number; // multiplie le métal de la carte (0 = jamais métallique)
  relief?: number; // force de la carte de relief (normal map)
  emissive?: string;
  emissiveIntensity?: number;
};

// Matériau PBR prêt à l'emploi. À appeler au niveau supérieur d'un composant (règle des hooks).
export const useMateriauPBR = (nom: NomPBR, o: OptionsPBR = {}): MeshStandardMaterial => {
  const [cartes, setCartes] = useState<Cartes | null>(() => prets.get(nom) ?? null);
  const [handle] = useState(() => {
    if (prets.has(nom)) return null;
    const h = delayRender(`Texture ${nom}`);
    enAttente.add(h);
    return h;
  });
  useEffect(() => {
    if (cartes) return;
    charger(nom).then(setCartes).catch((e) => cancelRender(new Error(`Texture ${nom} introuvable : lancer tools/telecharger_textures.py (${e})`)));
  }, [cartes, nom]);
  // On ne libère le rendu qu'une fois le matériau construit avec ses textures ET l'image 3D redessinée :
  // pendant un rendu, la 3D n'est redessinée qu'au changement d'image ; sans ce redessin forcé, une image fixe
  // (et la 1re image de chaque onglet de rendu) sortirait sans textures.
  const redessiner = useThree((s) => s.advance);
  useEffect(() => {
    if (!cartes || handle === null || !enAttente.has(handle)) return;
    enAttente.delete(handle);
    aLiberer.push(handle);
    if (enAttente.size === 0) {
      redessiner(performance.now());
      aLiberer.splice(0).forEach((h) => continueRender(h));
    }
  }, [cartes, handle, redessiner]);

  const [rx, ry] = o.repetition ?? [1, 1];
  return useMemo(() => {
    const m = new MeshStandardMaterial({
      color: new Color(o.teinte ?? "#ffffff").multiplyScalar(o.gain ?? 1),
      roughness: o.rugosite ?? 1,
      metalness: o.metal ?? 0,
      emissive: new Color(o.emissive ?? "#000000"),
      emissiveIntensity: o.emissiveIntensity ?? 0,
    });
    if (cartes) {
      const rep = (t: Texture) => {
        const c = t.clone();
        c.repeat.set(rx, ry);
        c.needsUpdate = true;
        return c;
      };
      m.map = rep(cartes.couleur);
      m.normalMap = rep(cartes.normale);
      m.normalScale = new Vector2(o.relief ?? 1, o.relief ?? 1);
      const arm = rep(cartes.arm);
      m.aoMap = arm;
      m.aoMapIntensity = o.occlusion ?? 1;
      m.roughnessMap = arm;
      m.metalnessMap = arm;
    }
    return m;
  }, [cartes, rx, ry, o.teinte, o.gain, o.occlusion, o.rugosite, o.metal, o.relief, o.emissive, o.emissiveIntensity]);
};
