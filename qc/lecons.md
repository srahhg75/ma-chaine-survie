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
- Sons sombres (souffles graves, impacts lourds, grincements) + bruitages réalistes d'objets (foley) : jamais de
  carillon, ding, shimmer, « pop » mignon ni son d'interface.

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
  Même piège pour une boucle d'attente `while pgrep -f "motif"` lancée par `bash -c '…motif…'` : elle se trouve
  elle-même et attend sans fin (vu deux fois, y compris dans un Monitor « until ! pgrep -f final.sh »). Attendre un
  PID précis (`while kill -0 <pid>`), un fichier témoin (ligne « FIN » du journal) ou enchaîner avec `;`.
  Un fichier témoin se VIDE avant de lancer la tâche (`rm -f journal.log`) : sinon l'ancien « FIN » réveille tout de suite.
- **2026-10-24 — Défaut vu sur la VIDÉO FINALE (gros plan « Leur jus hydrate ») : boîte « ouverte » qui restait
  fermée (le corps plein cachait le sirop) et bougie au premier plan qui mangeait l'image.** Ni le contrôle auto ni
  la planche toutes les 2 s ne l'avaient montré (plan de 1 s). Règle : une image fixe pour CHAQUE plan tenu
  (au milieu du plan, liste donnée par `tools/cadrage.ts`), pas seulement toutes les 2 s ; une source de lumière
  (bougie, lampe) n'est jamais au premier plan d'un gros plan d'objet.
- **2026-10-24 — Les tranches du rendu étaient supprimées après l'encodage** : corriger un plan obligeait à tout
  re-rendre (3 h). Règle : `tools/final.sh` garde `videos/<ep>/tranches/` ; pour corriger un passage, supprimer la
  seule tranche concernée et relancer `tools/final.sh` (seule cette tranche est re-rendue).
- **2026-10-24 — Geste illisible (« versée d'un coup ») : Inès de dos en gros plan, la bassine flottait à côté de sa
  tête, aucun filet d'eau.** Règle : un geste avec un objet porté se filme DE PROFIL, plan moyen (≥ 3,5 m), l'objet
  entre le personnage et sa cible ; l'effet attendu (eau qui coule, porte qui bouge) est dessiné et visible à l'image.
- **2026-10-24 — Titre de couverture en lettres creuses** (Montserrat est une police « variable » : ffmpeg prenait la
  graisse la plus fine) et texte posé sur le visage. Règle : `bash tools/couverture.sh` (graisse 900 figée, image sans
  HUD ni sous-titres, texte dans la bande y≈1150-1570, jamais sur le visage) ; regarder la couverture avant de livrer.
- **2026-10-24 — 5 transitions de caméra sans aucun son** (repérées par `earshot timeline --video` sur la vidéo
  finale : 71 % des coupes avec un son à 100 ms). Règle : lancer `earshot timeline <vidéo> --video <vidéo>` sur la
  vidéo finale ; chaque coupe « without a hit » reçoit un son court (`cut_hit/…`) calé sur l'instant MESURÉ
  (ancre « phrase±décalage ») ; refaire seulement le mixage et remplacer le son (`ffmpeg -c:v copy`), sans re-rendre.
- **2026-10-24 — RETOUR : WC dont la cuvette n'est pas « soulevée » au moment de verser** (pas d'abattant, rien ne
  s'ouvrait). Règle : un objet qu'on utilise doit faire son geste d'usage AVANT l'action (abattant relevé, couvercle
  ôté, porte ouverte) ; chaque meuble « actif » d'un épisode a ses pièces mobiles (abattant, porte, robinet).
- **2026-10-24 — RETOUR : un mur restait dans l'ouverture de la porte d'entrée** (bug du moteur : un « passage »
  recevait une allège de 0,9 m comme une fenêtre). Règle : seule une fenêtre a une allège (`basOuverture` dans
  `kit3d/decor.ts`) ; une porte ou un passage part du sol. Vérifier en image fixe chaque porte qu'un personnage franchit.
- **2026-10-24 — RETOUR : Inès passait à travers les murs** (allège de la porte d'entrée + cloisons arasées entre les
  pièces, sans passage). `tools/qc.ts` bloque désormais « Personnage à travers un mur » (murs pleins ET arasés, sauf
  porte/passage) ; toute cloison entre deux pièces reçoit un `passage` et les trajets passent par lui (`chemin`).
- **2026-10-24 — RETOUR : le filtre à café « sautait » du lavabo à un pot par terre** (objets d'une même action à
  deux endroits). Règle : continuité des objets : les objets d'une même action restent groupés au même endroit d'un
  plan à l'autre (seau + carafe + filtre ensemble), et un objet ne change jamais de place sans qu'on le voie déplacé.
- **2026-10-24 — RETOUR : choix A/B de fin trop petit, pas assez marquant.** Règle : le carton de fin à choix occupe
  tout l'écran (fond assombri, question ≥ 80 px, deux blocs A/B de 780 px de large avec lettre de 120 px qui pulsent),
  visible au moins 4 s (`queue` ≥ 5) ; la montre disparaît quand il apparaît.
- **2026-10-24 — RETOUR : pas assez de bruitages** (28 sons, aucun son d'objet). Règle : chaque geste visible a son son
  (objet posé, interrupteur, robinet, porte, verrou, gouttes, eau qui coule) : viser ≥ 1 bruitage toutes les 2 s en
  plus des transitions ; sons d'objets réalistes autorisés (`tools/sons_autorises.json`) et sons d'eau / grincement
  synthétisés par `tools/mix.py` (types d'ambiance `eau`, `glouglou`, `grincement`), validés à l'oreille d'earshot
  (`earshot match` / `earshot rank`) ; pas à −24 dB.
- **2026-10-24 — Porte d'entrée qui ouvrait sur le vide** (le ciel, au 6e étage) une fois le mur de l'allège retiré.
  Règle : toute porte franchissable donne sur un espace construit (palier, couloir, pièce voisine) avec un sol, des
  murs et une petite lumière ; le vérifier en image fixe quand la porte est ouverte, depuis la caméra du plan.
- **2026-10-24 — Vidéo envoyée dans le chat impossible à enregistrer sur iPhone** (pas d'option de partage, 111 Mo).
  Règle : livrer aussi une copie légère (`ffmpeg -crf 20 -maxrate 4M`, ≈ 40 Mo, son copié tel quel) poussée sur la
  branche (`git add -f videos/NNN-nom/<nom>.mp4`, < 50 Mo) et donner le lien direct
  `https://github.com/<compte>/<dépôt>/raw/<branche>/videos/NNN-nom/<nom>.mp4` à ouvrir dans Safari.
- **2026-10-24 — RETOUR : yeux d'Inès « tout noirs », visage sans expression.** Règle : l'héroïne a des yeux manga
  (blanc, iris coloré à anneau sombre, pupille, deux reflets, cils, virgule au coin) ; chaque personnage principal a
  des `expressions` calées sur le texte (neutre, sourire, décidé, inquiet, peur, surpris, triste, fatigue, soulagé)
  et cligne des yeux tout seul ; valider tout visage sur le banc `npx tsx tools/images.ts banc-visages 0.5 1.5`
  (face ET trois-quarts : un œil ne doit jamais dépasser du contour de la tête) puis en gros plan pleine résolution.
- **2026-10-24 — RETOUR : étagère + bougie collées à la porte d'entrée** (elles encombraient les gros plans du verrou
  et de la porte). Règle : les abords d'une porte qu'on filme restent dégagés (aucun meuble ni objet à moins de 0,6 m
  du chambranle) ; une lumière d'ambiance peut rester, sans objet visible.
- **2026-10-24 — RETOUR : réponses parfois en anglais, et heures données en UTC** (« vers 15 h 30 » alors qu'il était
  déjà 15 h 45 à Paris). Règle (inscrite dans CLAUDE.md) : toujours répondre en français ; toujours convertir les
  heures en heure de Paris (`TZ=Europe/Paris date`).
  RÉCIDIVE le même jour : avant d'envoyer CHAQUE message, relire la première phrase : si elle n'est pas en français,
  tout réécrire en français.
- **2026-10-24 — RETOUR (pour les prochains épisodes) : ambiance pas assez sombre pour une panne d'électricité.**
  Règle : dès l'écriture de l'épisode, éclairage de nuit sans courant : pénombre bleutée, coins noirs, vraies sources
  chaudes (bougies, lampe torche, lanternes) qui découpent les formes ; mais Inès, ses gestes et les objets clés restent
  lisibles sur téléphone (leçon du 23/10 : jamais de sol ni de décor invisibles). Valider sur la planche d'un plan sur deux.
- **2026-10-24 — RETOUR : à 0:35, les murs de la cuisine et de la salle de bain « se rentraient dedans »** (deux pièces
  voisines dessinaient chacune leur mur au même endroit : deux murs superposés qui clignotent). Règle : un mur partagé
  n'est dessiné qu'une fois : l'une des deux pièces le déclare dans `sansMurs` (`kit3d/decor.ts`) ; le passage reste
  sur le mur de l'autre pièce.
- **2026-10-24 — RETOUR : lanterne trop « flashy » posée sur les WC.** Règle : pas de source lumineuse visible posée
  sur un objet qu'on filme de près ; pour éclairer une pièce, une lueur douce invisible (plafond) suffit.
