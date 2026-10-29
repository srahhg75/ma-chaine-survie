// Options du post-traitement (fichier sans dépendance graphique : lisible par le contrôle qualité)
export type OptionsPost = {
  bloom?: number; // force du halo (0 = aucun), défaut 0.35
  seuilBloom?: number; // luminance à partir de laquelle ça « bave », défaut 0.92
  vignette?: number; // 0..1, défaut 0.45
  grain?: number; // 0..0.15, défaut 0.05
  occlusion?: boolean; // occlusion ambiante, défaut true
  exposition?: number; // exposition du tone mapping, défaut 1
  ombresDouces?: boolean; // ombres plus douces (rayon de flou), défaut true
  noirRouge?: number; // 0..1 : noir et blanc sauf les rouges francs (saison « Le dernier appel »), défaut 0
};
