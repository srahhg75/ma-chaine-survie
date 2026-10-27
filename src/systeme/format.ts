// Format de la chaîne et règles chiffrées de qc/lecons.md (source unique pour le rendu ET le contrôle qualité).
export const LARGEUR = 1080;
export const HAUTEUR = 1920;
export const FPS = 30;

// Durée d'un épisode : 70 à 120 s
export const DUREE_MIN_S = 70;
export const DUREE_MAX_S = 120;

// Zones sûres TikTok : rien d'important au-dessus de HAUT, sous BAS, ni dans la colonne de droite.
export const ZONE_SURE = {
  haut: 180,
  bas: 1500,
  gauche: 60,
  droite: LARGEUR - 160, // colonne des boutons TikTok (j'aime, commentaires, partage)
} as const;

// Sous-titres centrés à 69 % de la hauteur, comme @chroniques_flippantes (demande du 27/10 : « plus bas et plus petit »)
export const Y_SOUS_TITRES = Math.round(HAUTEUR * 0.69);
// Bande où cadrer le sujet (au-dessus des sous-titres)
export const BANDE_SUJET = { haut: 250, bas: 1150 } as const;

// HUD : au plus 2 blocs en plus des sous-titres et de la montre ; étiquette visible ≥ 1,4 s
export const HUD_BLOCS_MAX = 2;
export const ETIQUETTE_MIN_S = 1.4;

// Caméra : rotation max 160°/s ; un nouvel état d'image toutes les 1,5 à 2,5 s
export const CAMERA_ROTATION_MAX_DEG_S = 160;
export const RYTHME_MIN_S = 1.5;
export const RYTHME_MAX_S = 2.5;

// Cadrage « comme @chroniques_flippantes » (analyse/cadrages.md, demande du 27/10 : « dézoome ») : on voit le décor.
// Taille à l'écran du plus grand personnage (des pieds à la tête, en part de la hauteur de l'image) :
// médiane ≤ 35 % (eux : 22 % et 38 % sur leurs deux vidéos à plus d'un million) ; gros plans (> 60 %) sur 15 % des
// images au plus, réservés aux moments forts (cri, peur, révélation).
export const CADRAGE = { medianeMax: 0.35, grosPlanSeuil: 0.6, grosPlanPartMax: 0.15 } as const;

// Personnages : vitesse de marche max (au-delà = téléportation)
export const VITESSE_MAX_M_S = 2.2;

export const s = (secondes: number) => Math.round(secondes * FPS);
