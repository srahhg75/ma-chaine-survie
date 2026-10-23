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
- **2026-10-23 — Neige qui tombait DANS la pièce** (démo : le volume de neige englobait l'appartement).
  Règle : la neige est placée automatiquement derrière le mur du fond par `kit3d/Decor.tsx` ; ne jamais lui donner
  un volume qui recoupe une pièce.
- **2026-10-23 — Étiquette « Porte fermée » pointant hors de l'image** (porte du mauvais côté + hors cadre).
  Règle : les ouvertures se mesurent le long du mur (vers l'est pour nord/sud, vers le nord pour ouest/est) ;
  toute étiquette 3D doit passer le contrôle « Étiquette sans cible » de `tools/qc.ts` ; un objet étiqueté doit être
  dans le plan tenu (sinon le déplacer dans le décor).
- **2026-10-23 — Sous-titres sur le corps du personnage (récidive)**.
  Règle : déclarer chaque personnage dans `sujets` de `donnees.ts` : `tools/qc.ts` bloque alors « Sujet caché » ;
  viser plus bas (cible y ≈ 0,3–0,55 m) pour remonter le personnage au-dessus des sous-titres.
- **2026-10-23 — Ancre « hook:appartement » introuvable** (le mot du script est « l'appartement. »).
  Règle : les ancres de mot ignorent élisions, accents et ponctuation ; pour un mot ambigu, utiliser `phrase#index`.
- **2026-10-23 — Correction audio absurde (−216 dB) sur un mot mal calé par la voix de synthèse.**
  Règle : la protection mot par mot de `tools/mix.py` est plafonnée à 20 dB et mesurée sur une fenêtre élargie de
  50 ms ; un mot « sans voix mesurée » signalé par `tools/qc_audio.py` = alignement à vérifier.
- **2026-10-23 — Script shell cassé par une apostrophe dans `${1:?…}`.**
  Règle : pas d'apostrophe dans les messages `${var:?…}` des scripts shell ; toujours `bash -n` après modification.
- **2026-10-23 — `pkill -f <motif>` a tué ma propre commande** (le motif figurait dans la ligne de commande).
  Règle : arrêter un rendu par PID (`pgrep -x chrome-headless`, puis `kill -9 <pid>`), jamais `pkill -f` avec un motif
  écrit dans la même commande ; les processus de navigateur fantômes ralentissent tous les rendus suivants.
- **2026-10-23 — Visage brûlé en blanc par la bougie en plan rapproché** (lumière trop forte + halo trop fort).
  Règle : bougie à 1,3 (défaut du moteur), bloom 0,35 / seuil 0,92 ; vérifier les plans rapprochés à l'œil sur des
  images pleine résolution (`tools/images.ts`), pas seulement sur la planche.
- **2026-10-23 — Carton de fin affiché par-dessus le dernier sous-titre.**
  Règle : le carton démarre à `fin+0.7` au plus tôt (le dernier bloc reste 0,6 s) ; `tools/qc.ts` contrôle désormais
  aussi le chevauchement carton / sous-titres.
- **2026-10-23 — Étiquette dont la cible était cachée derrière le personnage, et tête coupée en haut du cadre.**
  Les contrôles par simple point ne voyaient rien. Règle : déclarer chaque personnage-sujet (buste + visage) ;
  `tools/qc.ts` calcule sa silhouette à l'écran : « Étiquette sur le sujet » et « Sujet coupé » sont bloquants.
- **2026-10-23 — Fiche d'objet sur le visage après un recadrage.**
  Règle : après chaque changement de caméra, relancer `tools/qc.ts` ; une fiche sans point 3D se place avec
  `cote: "gauche"` ou `"droite"` du côté opposé au visage.
- **2026-10-23 — Personnage passé dans la colonne des boutons TikTok pendant un déplacement de caméra.**
  Règle : `tools/qc.ts` bloque « Sujet sous les boutons TikTok » (x > 920) ; faire partir le personnage avant que
  le cadrage ne le pousse au bord, ou viser plus à droite.
- **2026-10-23 — Vidéo finale de 70 Mo pour 11 s (49 Mb/s)** : le grain change à chaque image et ne se compresse pas.
  Règle : `tools/final.sh` réencode en x264 CRF 18 plafonné à 12 Mb/s ; vérifier le poids (≈ 1,5 Mo par seconde).
