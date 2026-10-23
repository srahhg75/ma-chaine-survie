// Format de la chaîne et zones sûres TikTok (voir qc/lecons.md).
export const LARGEUR = 1080;
export const HAUTEUR = 1920;
export const FPS = 30;

// Durée d'un épisode : 70 à 120 s
export const DUREE_MIN_S = 70;
export const DUREE_MAX_S = 120;

// Zones sûres : rien d'important au-dessus de HAUT, sous BAS, ni dans la colonne de droite.
export const ZONE_SURE = {
  haut: 180,
  bas: 1500,
  gauche: 60,
  droite: LARGEUR - 160, // colonne des boutons TikTok (j'aime, commentaires, partage)
} as const;

// Sous-titres centrés à 60 % de la hauteur
export const Y_SOUS_TITRES = Math.round(HAUTEUR * 0.6);

// HUD : au plus 2 blocs en plus des sous-titres et de la montre ; étiquette visible ≥ 1,4 s
export const HUD_BLOCS_MAX = 2;
export const ETIQUETTE_MIN_S = 1.4;

// Caméra : rotation max 160°/s ; un nouvel état d'image toutes les 1,5 à 2,5 s
export const CAMERA_ROTATION_MAX_DEG_S = 160;
export const RYTHME_MIN_S = 1.5;
export const RYTHME_MAX_S = 2.5;

export const s = (secondes: number) => Math.round(secondes * FPS);
