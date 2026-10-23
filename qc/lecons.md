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
- **2026-10-23 — Révélation éventée (TestDA) : le « double » visible dès le plan 1.** Deux causes : lumières sans
  ombres qui traversent les murs (cabine -> salon) et caméra trop haute (37°) qui voit par-dessus le mur.
  Règle : toute lumière sans ombres a une portée (`distance`) limitée à sa pièce ; ce qui doit être révélé reste
  masqué par un mur (vérifier par calcul) ou dans le noir jusqu'à son allumage, calé sur le mot.
- **2026-10-23 — Métal PBR noir et plat** (aucun environnement à refléter). Règle : `<Environnement />` discret
  (0,07–0,25) dans toute scène avec du métal ou du vernis.
- **2026-10-23 — Lampes qui « brûlent » (abat-jour et plateau blancs).** Règle : lampe d'intérieur 1 à 3 avec
  `distance` 3–5 m, abat-jour émissif ≤ 0,3 ; regarder les plans éclairés en pleine résolution.
- **2026-10-23 — Visage jamais visible quand le personnage agit sur un mur du fond (vue en coupe).** Règle : le faire
  agir de profil ou de face (ex. bouton pressé bras sur le côté) ; il se retourne vers le fond au moment de la révélation.
- **2026-10-23 — Rendu final interrompu : textures PBR non chargées en 30 s** (plusieurs onglets en parallèle).
  Règle : délai de chargement porté à 180 s (`remotion.config.ts`, `tools/images.ts`) ; une image fixe qui passe ne
  garantit pas le rendu complet : lancer le rendu final assez tôt.
- **2026-10-23 — Images fixes SANS leurs textures PBR (critique faussée pendant 5 versions).** La 3D n'était pas
  redessinée après le chargement des textures. Règle : `useMateriauPBR` force un redessin avant `continueRender` ;
  toujours comparer une image fixe à la même image du rendu (au moins une fois par scène).
- **2026-10-23 — Cabine en tôle presque noire au rendu réel** (métal 1 + environnement faible). Règle : murs métalliques
  à `metal` 0,35–0,5 et teinte claire ; réserver `metal` 1 aux petites pièces (poignées, mains courantes).
- **2026-10-24 — Voix déposée depuis le téléphone (session cloud) : nom bizarre (« voix1.mp3 .mp3 ») et fichiers audio
  non versionnés (`*.wav` exclus de Git) : la voix aurait été perdue à la fermeture de la session.**
  Règle : la voix se dépose via GitHub (« ··· » → Upload file, sur la branche de travail) ; Claude la convertit en
  `videos/NNN-nom/voix_brute.wav` (`ffmpeg -ar 48000 -c:a pcm_s16le`), la retire de la racine et note dans
  `videos/NNN-nom/script.md` le commit d'envoi pour la récupérer (`git show <commit>:"<nom>" > voix.mp3`).
- **2026-10-24 — Sujet caché par un MEUBLE (H+72) : le frigo masquait le robinet du hook ; des bouteilles cachaient
  le corps d'Inès.** `tools/qc.ts` ne testait que les murs. Règle : déclarer chaque meuble dans `decor.meubles`
  (même dessiné à part, avec `invisible: true`) ; `tools/qc.ts` bloque désormais « Sujet caché par un meuble » ;
  ne jamais poser d'objets hauts entre la caméra et le personnage (table : objets sur le côté, pas devant lui).
- **2026-10-24 — Cadrage à tâtons trop lent (33 plans).** Règle : cadrer avec `plan(sujet, { azimut, elevation,
  distance, fov, x, y })` de `src/systeme/camera.ts` (le sujet tombe où on veut à l'écran, par défaut x=500, y=620)
  et contrôler avec `npx tsx tools/cadrage.ts NNN-nom` (position à l'écran de la tête, des pieds et des repères P).
- **2026-10-24 — Mixage interrompu : `pitch` hors de la plage du son** (knock/wood en C3, plage 250-2600 Hz).
  Règle : avant de donner un `pitch` à un bruitage, lire sa plage avec `earshot sfx render <id> --pitch <note>`
  (le message d'erreur donne la plage) ; sans besoin précis, ne pas mettre de `pitch`.
- **2026-10-24 — Plan du hook2 (les 6 bouteilles) visible 0,05 s** : le déplacement suivant (1,6 s) partait juste
  après l'arrivée. Règle : un plan est tenu de son arrivée jusqu'à `arrivée du suivant − deplacement du suivant` ;
  vérifier cette durée avec `tools/cadrage.ts` (colonne « a→b ») : au moins 0,8 s pour un plan qui porte une info.
- **2026-10-24 — Fantôme entre la caméra et le sujet** (radiateur : le fantôme rouge remplissait tout l'écran en gros plan).
  Règle : le fantôme se place À CÔTÉ de l'objet du mauvais geste (de profil), jamais sur l'axe caméra → sujet.
- **2026-10-24 — Lampe torche qui brûle l'image en plan rapproché.** Règle : `lampe.puissance` 0,07 à 0,3 pour une
  lampe portée dans un petit décor (salle d'eau, placard) ; regarder chaque plan de nuit en image fixe.
- **2026-10-24 — Porte de placard ouverte qui masquait le lavabo pendant les étiquettes.** Règle : une porte qui
  s'ouvre pivote du côté opposé aux éléments à montrer (charnière côté mur ou côté hors champ).
- **2026-10-24 — Caméra placée DANS le personnage** (gros plan du filtre à café : Inès entre la caméra et l'objet).
  Règle : en gros plan d'objet, filmer depuis le côté où le personnage n'est pas (azimut négatif = depuis le sud-ouest).
- **2026-10-24 — Machine redémarrée (code 137, mémoire saturée) pendant un rendu `--concurrency=4`** (serveur 4 cœurs,
  15 Go, rendu 3D logiciel). Règle : ne jamais dépasser la concurrence par défaut (2) sur ce serveur ; rendre les
  longues vidéos par tranches (`--frames=a-b`) en tâche de fond, et sauvegarder (commit + push) avant chaque gros rendu.
- **2026-10-24 — Voyant de la pompe passé au rouge APRÈS le départ de la caméra** (l'arrêt n'était jamais montré).
  Règle : tout changement d'état qui raconte quelque chose (voyant, porte, niveau d'eau) se produit sur le plan tenu,
  au plus tard 0,5 s avant le départ du plan suivant ; le vérifier sur une image prise juste avant ce départ.
- **2026-10-24 — RÉCIDIVE `pkill -f` : ma propre commande tuée** (motif « final.sh » écrit dans la commande).
  Règle (rappel) : `pgrep -a` dans une commande, puis `kill <pid>` dans une AUTRE commande ; jamais `pkill -f`.
