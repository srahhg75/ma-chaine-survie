# Leçons — à relire avant chaque épisode et avant chaque rendu

Chaque erreur trouvée (par Claude ou par la personne qui gère la chaîne) ajoute une règle dans « Leçons apprises ».

## Règles de départ

### Rythme
- Ça démarre dans l'action dès la première image ; un nouvel état de l'image toutes les 1,5 à 2,5 s.

### Caméra
- Grands mouvements continus « déplacement → plan tenu », jamais dans un mur, rotation ≤ 160°/s.
- Les étiquettes s'affichent seulement sur les plans tenus.

### HUD
- Jamais surchargé : au plus 2 blocs en plus des sous-titres et de la montre.
- Aucun chevauchement ; chaque étiquette visible ≥ 1,4 s ; le sujet jamais caché.

### Zones sûres TikTok
- Rien d'important au-dessus de y=180, sous y≈1500, ni dans la colonne de droite.
- Sous-titres à 60 % de la hauteur.

### Son
- La voix passe avant tout : bruitages et ambiances ≥ 10 dB sous la voix.
- Master à −14 LUFS, true peak < −1 dB.
- Sons uniquement sombres (souffles graves, impacts lourds, grincements) : jamais de carillon, ding,
  shimmer ou « pop » mignon.

### Mise en scène
- Pas de téléportation : un personnage marche jusqu'à sa nouvelle place.

### Contenu
- Faits de survie plausibles et vérifiés : jamais de conseil dangereux présenté comme sûr.

## Leçons apprises

- **2026-10-23 — Scène 3D trop sombre** (épisode de test : sol et décors invisibles).
  Règle : sur chaque planche de contrôle, le sol, le décor et le sujet doivent être lisibles ;
  ambiance sombre = couleurs et brouillard sombres, pas des objets invisibles. Base d'éclairage :
  `hemisphereLight` + une lumière directionnelle chaude ; ne pas utiliser l'option `linear` de `ThreeCanvas`.
- **2026-10-23 — Sous-titres sur le corps du sujet** (épisode de test).
  Règle : cadrer le sujet dans la bande y≈250–1000 (au-dessus des sous-titres à y=1152) ;
  pour remonter le sujet dans l'image, baisser le point visé par la caméra.
- **2026-10-23 — Police téléchargée pendant le rendu → rendu bloqué.**
  Règle : polices toujours en local (`public/polices/`, `src/systeme/polices.ts`), jamais `loadFont()` de
  `@remotion/google-fonts` directement dans une composition.
- **2026-10-23 — 3D impossible sans carte graphique (`angle`).**
  Règle : laisser `remotion.config.ts` choisir le moteur (`swangle` sur serveur sans GPU) ; ne pas forcer `--gl`.
- **2026-10-23 — Liste des vidéos TikTok impossible avec yt-dlp** (« Failed to parse JSON », page profil
  « Une erreur est survenue » depuis un serveur). Règle : récupérer les identifiants des vidéos via la page
  d'intégration publique `https://www.tiktok.com/embed/@<compte>`, puis yt-dlp vidéo par vidéo ; analyser avec
  `tools/analyser_reference.py`.
- **2026-10-23 — Le dossier `analyse/` était entièrement exclu de Git** (le rapport aurait été perdu).
  Règle : après chaque nouveau livrable, vérifier avec `git status` qu'il est bien suivi ; `reference/` reste exclu.
