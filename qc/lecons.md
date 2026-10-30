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
- Sous-titres à 69 % de la hauteur, 68 px (depuis le 27/10 ; avant : 60 %, 84 px).

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
  Règle : la neige est placée automatiquement derrière le mur du fond par `kit3d/DecorScene.tsx` ; ne jamais lui donner
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
- **2026-10-24 — Rendu impossible sur le PC Windows (erreur React #130)** : `kit3d/decor.ts` et `kit3d/Decor.tsx`
  ne différaient que par la casse ; Windows ne distingue pas les majuscules, `./kit3d/Decor` retombait sur `decor.ts`.
  Règle : jamais deux fichiers d'un même dossier dont les noms (sans extension) ne diffèrent que par la casse ;
  le composant s'appelle désormais `kit3d/DecorScene.tsx`. `npm run typecheck` le signale (TS1149) sous Windows.
- **2026-10-24 — RETOUR : « toujours un bug de mur » : zébrures qui clignotent aux jonctions des murs du fond**
  (salle d'eau / entrée, cuisine / salle d'eau). Chaque mur déborde de 6 cm à ses bouts pour fermer les angles ; deux
  pièces voisines superposaient donc leurs murs du fond sur 12 cm, même après `sansMurs`. Règle : `mursPiece`
  (`kit3d/decor.ts`) arrête désormais un mur contre la face d'un mur partagé (`sansMurs`) ; pour vérifier une jonction,
  comparer deux images fixes avant/après en gros plan (la superposition se voit en zébrures fines, pas toujours en
  planche réduite).
- **2026-10-24 — RETOUR : bruitages trop faibles, et aucun son sur le choix A/B de fin.** Règle : `BASE_SFX_DB` de
  `tools/mix.py` passe de −12 à −8 dB (la protection mot par mot de la voix, 12 dB, ne bouge pas) ; le carton à choix a
  toujours ses sons : souffle à l'entrée des blocs (`fin+0.9`) puis un impact quand A se pose (+0,53 s du carton) et
  un autre quand B se pose (+0,70 s).
- **2026-10-24 — RETOUR : « toujours pas assez sombre » (après un premier assombrissement).** Le carrelage presque
  blanc (#dfe3e2) renvoyait la lumière froide et la salle d'eau restait claire. Règle : nuit sans courant = lumière
  froide d'ambiance faible (hémisphère ≤ 0,17, lune ≤ 0,27, environnement ≤ 0,09), exposition ≤ 0,9, vignette ≥ 0,6 ;
  aucun mur ni sol plus clair que #c0c0c0 ; comparer avant/après côte à côte sur 3 plans et vérifier que sujet,
  objets étiquetés et sol restent lisibles.
- **2026-10-24 — Relecture « réalisateur » avant publication : 2 plans refaits.** (1) Gros plan du filtre à café :
  la caméra visait à côté de la carafe et Inès était juste derrière l'objet (on voyait ses jambes, pas le filtre).
  Règle : un gros plan d'objet vise l'objet lui-même, et la caméra se place du côté opposé au personnage (calculer la
  direction personnage → objet) ; filtre/objet entier dans la bande y≈250-1000. (2) Plan des 4 gestes du ballon :
  Inès coupée par le bord gauche pendant le 1er geste (le milieu du plan était bon). Règle : regarder chaque plan tenu
  au DÉBUT, au milieu et à chaque étiquette, pas seulement au milieu ; relecture complète = une image par plan tenu
  extraite de la vidéo rendue (avec HUD et sous-titres), en planches.
- **2026-10-24 — Outils Linux sur le PC Windows : la boucle qualité « OK » alors que les planches manquaient.**
  Sous Windows : environnements Python dans `.venv/Scripts/*.exe` (pas `.venv/bin/`), ffmpeg sans fontconfig
  (`drawtext` sans `fontfile` plante), WAV temporaire à fermer avant de supprimer son dossier, torch exige le
  runtime Visual C++ (`winget install Microsoft.VCRedist.2015+.x64`). Règle : les scripts choisissent `bin/` ou
  `Scripts/` selon ce qui existe, `drawtext` reçoit toujours une police (Montserrat figée en TTF), et une étape qui
  ne produit pas son fichier compte comme une ERREUR au bilan (`tools/boucle.sh` : planches absentes = échec).
- **2026-10-24 — Script de la Partie 2 hors gabarit (274 mots, hook de 15 mots, répliques entre guillemets)** : le
  « PROMPT 06 » cité par la demande n'était pas dans le dépôt, le script a été écrit sans ses contraintes chiffrées.
  Règle : gabarit d'un script (PROMPT 06 du protocole) = **200 à 260 mots (70-90 s)**, hook de 2 phrases, récap de
  3-4 phrases, 3 tactiques « Un : … », erreur ou fausse sécurité, twist, dernière phrase très courte ; **phrases de
  2 à 8 mots**, chiffres précis, objets du quotidien, **aucune indication de mise en scène** dans le texte lu, et
  jamais une réplique lue par le narrateur. Vérifier mots et longueurs avec `lire_script` de `tools/script_format.py`
  avant de livrer. Si une demande cite un prompt introuvable, le demander au lieu de deviner.
- **2026-10-24 — DEMANDE : des personnages qui se parlent (vannes, petites insultes) pour faire commenter.**
  Règle : les répliques sont permises et recherchées, dites chacune par la **voix de son personnage** (un fichier
  ElevenLabs par voix : `narrateur.mp3`, `<prenom>.mp3`), marquées `[Prénom]` en tête de ligne dans `script.txt`
  (champ `voix` de `tools/script_format.py`, écrit dans `mots.json`) ; elles comptent dans les 200-260 mots et les
  phrases de 2 à 8 mots. Insultes légères seulement (rien de grossier ni de discriminant) ; une blague sur un geste
  dangereux est toujours contredite à l'image (fantôme) et par un personnage. Celui qui parle est visible, de face
  ou de trois-quarts ; chaque personnage garde la même voix dans toute la série.
- **2026-10-24 — DEMANDE : les chiffres s'affichent en chiffres, plus d'effets sur le texte (« réalisateur qui veut
  percer sur TikTok »).** Règle : dans `script.txt`, chiffres en chiffres (« *200 litres* », « *11°C* », « Au 6e »,
  « *20 €* », « 1 : … ») ; le texte collé dans ElevenLabs garde les nombres en lettres (lecture sûre), et
  `forme_parlee` fait le lien (ordinaux « 6e », « € », « deux cents »). Sous-titres « rétention » : chaque mot entre
  avec un impact, les chiffres et mots-clés grossissent et vibrent, les chutes s'affichent seules en très gros,
  les répliques prennent la couleur et le nom du personnage. Toujours dans la bande des sous-titres (jamais sur le
  sujet, zones sûres TikTok) et lisibles en un coup d'œil.
- **2026-10-24 — DEMANDE (précisée 3 fois le même soir) : plus de réalisme, mais en formes simples ET en gardant la
  silhouette de la partie 1 (petite taille, tête un peu grosse).** Règle : aucun modèle 3D téléchargé ; proportions
  « figurine » de la partie 1 (≈ 1,4 m, tête ≈ 1/3 du corps) ; le réalisme vient des DÉTAILS et du MOUVEMENT :
  vêtements en couches (col, poignets, ourlet, boutons, fermeture, lacets), mains à doigts et pouce, cheveux en volume
  sculpté, visage complet (oreilles, nez, lèvres, dents quand la bouche s'ouvre, joues, rides selon l'âge),
  accessoires (lunettes, bonnet), respiration et léger balancement au repos, marche avec bras et buste qui suivent,
  bouche qui parle sur les répliques. Composant : `personnage/Humain.tsx` (variante « humain »), apparence dans
  `personnage/apparence.ts`. Décors plus meublés (plinthes, prises, cadres, rideaux, livres, objets du quotidien).
  Avant de changer un style en profondeur, montrer UNE image d'essai et attendre le retour.
- **2026-10-24 — RETOUR : « supprime les paupières, on doit voir tout l'œil, yeux manga comme Inès en partie 1 ».**
  Règle : les personnages « humain » gardent l'œil manga de la partie 1 (grand blanc, iris coloré à anneau sombre,
  pupille, deux reflets, trait de cils épais et virgule au coin) ; pas de paupière couleur peau par-dessus ; le
  clignement écrase l'œil (comme le Bonhomme). Ancres de mots : un nombre s'écrit en chiffres dans l'ancre
  (« appel:112 », pas « appel:douze »).
- **2026-10-24 — Tête « humain » à l'envers** (on voyait l'intérieur du crâne et le cou à travers le menton).
  Règle : un profil de `LatheGeometry` se donne du BAS vers le HAUT (y croissant), sinon les faces regardent vers
  l'intérieur ; vérifier toute nouvelle forme au tour sur le banc (`banc-humains`) en gros plan.
- **2026-10-24 — Changement de lieu simulé par un déplacement de 0,05 s = « caméra trop rapide ».** Règle : une coupe
  nette (autre plateau, flash-back) s'écrit `coupe: true` dans la clé de caméra ; le contrôle ne la compte pas comme
  une rotation ; chaque coupe garde son son court (`cut_hit/…`).
- **2026-10-24 — 77 erreurs de cadrage au 1er passage (têtes coupées, personnages hors champ).** Règle : pour les
  personnages « humain », cadrer avec les aides `buste` (tête ≈ 1,12 m, distance ≥ 2,6 m), `enPied` (≥ 4 m) et
  `aDeux` (≥ 4,3 m) de l'épisode 002 ; un dialogue se filme en plan à deux, les deux personnages de trois-quarts
  vers la caméra, mur entre eux arasé ; une fiche 2D se pose du côté où personne ne se tient.
- **2026-10-24 — Rendu final arrêté net sur le PC Windows : `tools/final.sh` appelait `.venv/bin/python`.** Règle (rappel
  de la leçon « outils Linux sur Windows ») : tout script shell du dépôt choisit `PY` (bin/ ou Scripts/) en tête ;
  après un changement de machine, chercher `grep -n "venv/bin" tools/*.sh` avant de lancer un rendu.
- **2026-10-25 — RETOUR (0:01) : Inès passait à travers la porte OUVERTE du placard et frôlait le muret noir (mur
  arasé) du passage.** La porte, dessinée dans `Episode.tsx`, était invisible pour les contrôles. Règle : tout battant
  ouvert (porte, placard, fenêtre) dessiné à part est déclaré dans `decor.meubles` (invisible, avec sa rotation) tant
  qu'il est ouvert ; un trajet passe par le MILIEU d'un passage, perpendiculairement au mur ; `tools/qc.ts` bloque
  désormais « Personnage dans un meuble … en marchant ».
- **2026-10-25 — RETOUR (0:21) : son corps traversait le muret de la chambre.** Le contrôle des murs supposait un corps
  de 12 cm de rayon ; un personnage « humain » (épaules, bras, sac, lampe tendue) en fait ~22. Règle : rayon de
  collision 0,22 m pour les « humain » dans `tools/qc.ts` ; passages d'au moins 0,9 m ; la lampe s'éteint avant de
  franchir un passage étroit.
- **2026-10-25 — RETOUR : la bouche bougeait trop vite.** Elle s'ouvrait 8 fois par seconde. Règle : bouche réglée sur
  `SYLLABE_S` = 0,2 s (≈ 5 syllabes par seconde, rythme du français) dans `personnage/trajet.ts`, amplitude 0,18-0,5 ;
  vérifier une réplique en lecture réelle (brouillon), pas seulement sur image fixe.
- **2026-10-25 — RETOUR (0:34) : « 3 couches fines » : on ne voyait rien, donc on ne comprenait pas.** Règle : chaque
  conseil se MONTRE à l'image au moment où il est dit, de façon visible sur téléphone : changement net (couleur,
  volume) mot par mot (t-shirt → polaire → parka → bonnet, via `tenues`), plus une fiche qui numérote les étapes ;
  avant/après lisible (elle frissonne en t-shirt, puis soulagée).
- **2026-10-25 — RETOUR (0:42) : Morel « dans » le fauteuil (corps enfoncé dedans).** Les meubles étaient à hauteur
  d'adulte réel (assise 0,43 m), les personnages assis ont les hanches à 0,26 m. Règle : mobilier à l'échelle des
  personnages (assise et matelas à ≈ 0,22-0,24 m) ; un personnage assis se place sur l'avant du coussin, dossier
  derrière lui ; seul le dossier est déclaré comme obstacle ; vérifier chaque personnage assis en image fixe de profil.
- **2026-10-25 — RETOUR (1:27) : la rampe de l'escalier était à l'envers** (elle descendait quand les marches
  montaient). Règle : un élément incliné (rampe, toit, échelle) se calcule à partir des points de départ et
  d'arrivée de ce qu'il suit (angle = atan(dénivelé / longueur), signe vérifié : marches vers −z ⇒ rotation x
  positive) ; le regarder en image fixe de profil avant de valider.
- **2026-10-25 — RETOUR (1:27) : l'escalier finissait contre un mur gris : « on ne peut même pas monter au 6e ».**
  Règle : un décor doit rester logique hors du sujet du plan : un escalier mène quelque part (ouverture dans le mur,
  cage d'escalier qui continue jusqu'à l'étage suivant), une porte donne sur une pièce, une fenêtre sur dehors ; un
  personnage qui « arrive d'en haut » descend vraiment depuis l'étage.
- **2026-10-25 — DEMANDE : une voix lit le choix A/B du carton de fin.** Règle : chaque épisode se termine par le
  narrateur qui lit la question et les deux choix (lignes `@carton…` du script, voix du narrateur, sans sous-titres
  puisque le carton affiche le texte) ; `queue` allongée pour que la lecture finisse avant la fin de la vidéo.
- **2026-10-25 — Voix du carton ajoutée : l'ancre « fin » a glissé après la lecture (vidéo de 107,8 s, carton
  affiché trop tard).** Règle : « fin » = dernier mot du RÉCIT ; les lignes `@carton…` ne comptent pas
  (`src/systeme/timeline.ts`) ; le carton de fin n'est pas soumis à la règle de rythme ; après tout ajout de voix,
  relire la durée annoncée par `tools/timeline.ts` et supprimer les tranches déjà rendues (`videos/<ep>/tranches/`).
- **2026-10-25 — Analyse de @chroniques_flippantes sur le PC Windows : liste yt-dlp en échec (« Failed to parse JSON »),
  `tools/analyser_reference.py` en panne (pas de Tesseract, `drawtext` sans police).** Règle : installer `yt-dlp` et
  `curl_cffi` dans `.venv`, lister et télécharger avec `--impersonate chrome` (relancer 2-3 fois si la liste est
  vide) ; garder la page d'intégration `https://www.tiktok.com/embed/@<compte>` comme secours ; l'outil d'analyse saute
  l'OCR sans Tesseract (lire les sous-titres à l'œil sur les planches) et donne une police à `drawtext`. Vérifier la
  durée de la piste SON et de l'IMAGE séparément (`ffprobe -select_streams a:0 / v:0`) : une piste son plus longue
  révèle une musique recyclée.
- **2026-10-25 — RETOUR : « pas besoin de 4 voix, c'est le même narrateur qui lit le carton de fin ».** Règle : le carton
  A/B est lu par le narrateur **dans le même fichier** `narrateur.mp3`, à la suite du récit (lignes `@carton…` sans
  marqueur de voix dans `script.txt`) ; un épisode demande donc **une voix par personnage**, jamais de
  `narrateur2.mp3` (sauf ajout après coup, comme en Partie 2).
- **2026-10-25 — RETOUR D'UN ABONNÉ (partie 1) : robinet de vidange du ballon dessiné sur le tuyau d'eau CHAUDE.**
  En vrai, la vidange d'un chauffe-eau électrique se fait par le groupe de sécurité, sur l'arrivée d'eau FROIDE en
  bas du ballon (le robinet d'eau chaude ouvert ne sert qu'à faire entrer l'air). Règle : chaque objet technique
  montré (ballon, tableau électrique, vanne…) est dessiné conforme au vrai, vérifié sur une photo ou un schéma de
  référence avant le rendu ; noter la source dans le tableau des faits du script.
- **2026-10-25 — Voix de la Partie 3 déposées dans le dossier de la PARTIE 1** (`videos/001-h72/`). Règle : avant de
  fabriquer, chercher les MP3 récents dans tout `videos/` (`ls -t videos/*/*.mp3 | head`), vérifier leur date et leur
  contenu (transcription Vosk de `tools/assembler_voix.py`), puis les ranger dans le bon dossier.
- **2026-10-25 — `tools/qc.ts` ignorait l'étage des personnages** : le point « sujet » et la silhouette étaient
  calculés au niveau du sol (y = 0), faux pour un personnage au 6e ou dans l'escalier. Règle : toute hauteur de
  personnage se compte depuis `position[1]` (étage, marche) ; corrigé dans `tools/qc.ts` et `tools/cadrage.ts`.
- **2026-10-25 — Un même personnage sur deux moments séparés par une coupe (Inès qui guette à 18 h, puis descend à
  23 h) obligeait à le faire courir.** Règle : deux personnages avec `presence: { de, a }` (jamais dessinés ni
  contrôlés hors de leur présence), raccordés par une coupe nette (`coupe: true`) ; un personnage dont on ne voit
  que la lampe se déclare `invisible: true` (sa position guide la lampe, ses pas restent dans le mixage).
- **2026-10-25 — Décor sur plusieurs étages (cage d'escalier) : le sol extérieur gris et le ciel se voyaient sous le
  4e et à côté de la cage.** Règle : un décor en coupe est entouré de la masse sombre de l'immeuble (côtés, dessous,
  une ligne claire par plancher) ; vérifier les bords de chaque plan large en image fixe.
- **2026-10-25 — Barre noire en travers des visages (dialogue Inès / Morel)** : la frise décorative du mur était une
  seule longue boîte qui traversait la porte ouverte à hauteur de tête. Règle : tout décor posé sur un mur (frise,
  plinthe, câble) s'interrompt aux ouvertures ; dans un dialogue près d'une porte, les deux personnages sont de
  trois-quarts vers la caméra (pas de profil strict), vérifié en image fixe pleine résolution.
- **2026-10-25 — Une ancre avec un trait d'union (« toit:au-dessus ») fait planter le rendu** (« Ancre illisible »)
  alors que `tools/qc.ts` passe. Règle : pas de mot composé dans une ancre de `Episode.tsx` (prendre la phrase ou un
  autre mot) ; rendre au moins une image fixe après chaque changement de `Episode.tsx`.
- **2026-10-25 — Écran entièrement rouge 0,4 s (vu sur la tranche rendue)** : le fantôme apparaissait pendant que la
  caméra était encore en gros plan juste devant lui. Règle : un fantôme n'apparaît qu'une fois la caméra arrivée sur
  le plan qui le montre (`fantome.de` ≥ arrivée de ce plan) ; jamais de personnage ni de fantôme à moins de 1 m de
  la caméra pendant un déplacement. Relire chaque tranche du rendu final dès qu'elle sort (planche 1 image/s) : une
  tranche fautive se refait seule (10 min) au lieu de toute la vidéo.
- **2026-10-25 — RETOUR : « on dirait qu'elle descend 2 étages pour aller au 5e ».** L'escalier en coupe alternait
  les paliers d'étage à gauche et à droite (une volée droite par étage) : le palier vu juste sous celui d'Inès était
  le 4e. Règle : un escalier d'immeuble a DEUX demi-volées par étage et un palier intermédiaire (avec la fenêtre) ;
  tous les paliers d'étage sont empilés du même côté, les portes d'un étage juste au-dessus de celles de l'étage
  inférieur. En coupe, les paliers empilés se cachent l'un l'autre vu d'en haut : filmer les étages de face.
- **2026-10-26 — DEMANDE : après le STOP, le narrateur dit aussi « On rembobine », avec un VRAI bruitage du temps qui
  remonte** (en Partie 3 : un simple `downlifter/tape`, on ne sentait pas le retour en arrière). Règle : chaque STOP
  s'écrit « Stop. On rembobine. » puis la phrase suivante marquée `>>` (1,5 s de silence dans la voix, géré par
  `tools/couper_blancs.py`) ; le retour se déclare avec `depuis` (début de la mauvaise branche) :
  `retours: [{ de: "stop", a: "<phrase après>", depuis: "<1re phrase de la branche>" }]` → `tools/mix.py` rejoue
  l'audio réel de la branche à l'envers en accélérant (moteur, scintillement, souffle) ; « clac » `click/thock` (+
  `cut_hit/punch`) sur « Stop » et `click/thock` à l'arrêt ; l'image de la branche recule en même temps. Le son
  d'un nouvel essai se valide avec `earshot match <wav> "cassette rewind sound effect"` (« strong » attendu).
- **2026-10-26 — Personnages vus de DOS sur 5 plans (Partie 4)** : orientation calculée « vers la table » sans penser à
  la caméra. Règle : orientation 0 = face à +Z (la caméra par défaut) ; un personnage est vu de face ou de
  trois-quarts seulement si son orientation est entre 270° et 90° (cosinus positif) ; vérifier chaque personnage qui
  parle sur une image fixe AVANT la boucle.
- **2026-10-26 — Le héros cachait son propre fantôme** (branche B : Inès debout devant son fantôme accroupi). Règle :
  pendant une branche montrée en fantôme, le vrai personnage est absent (`presence` découpée en deux personnages) ;
  le STOP (image qui recule) part de l'image où il était encore là.
- **2026-10-26 — Gros plans du carnet tout blancs : la caméra passait à travers les flammes des bougies.** Règle :
  avant un gros plan d'objet, aucune bougie ni lampe sur le segment caméra → objet ni à moins de 0,35 m de l'objet ;
  bougies dans les coins de la table, pas entre l'objet et la caméra.
- **2026-10-26 — Flash final calé sur « fin » = la FIN de la voix (1,5 s trop tard).** Règle : l'ancre « fin » seule
  désigne toujours la fin du dernier mot ; pour la phrase `@fin`, écrire « fin:<mot> » (ex. « fin:il-0.6 »).
- **2026-10-26 — Stylo à insuline à hauteur de bouche (on aurait dit une cigarette).** Règle : un objet tenu en main
  se place par rapport à la main réelle de la pose (≈ 0,8 m de haut et 0,45 m devant pour `mainTendue`), et se
  vérifie en image fixe ; dans le doute, l'objet est posé sur la table, bien visible.
- **2026-10-27 — RETOUR : « c'est trop proche, dézoome, filme comme les comptes de référence ».** Mesure : en Partie 4,
  personnage médian à 55 % de la hauteur de l'image et 45 % de gros plans, contre ≈ 22-38 % et 14-20 % chez
  @chroniques_flippantes (`analyse/cadrages.md`). Règle : filmer avec `cadrage.large / pied / deux / moyen / gros`
  (`src/systeme/camera.ts`), caméra à hauteur d'œil, décor visible ; médiane ≤ 35 % et gros plans ≤ 15 %
  (bloqué par `tools/qc.ts`) ; gros plan de visage seulement pour un moment fort ; les gros plans d'objets se
  déclarent en `sujets` (point) ; une pièce filmée de l'intérieur laisse ≥ 3 m de recul à la caméra.
- **2026-10-27 — RETOUR : sous-titres « trop au milieu », trop gros ; ouvertures toutes en « Que feriez-vous si… ».**
  Mesure sur @chroniques_flippantes : mot centré à y ≈ 1 325 (69 %), majuscules ≈ 55 px de haut, contour fin.
  Règle : sous-titres à 69 % de la hauteur, 68 px, contour 8 px (`format.ts`, `hud/boites.ts`) ; l'inventaire et le
  compte à rebours passent au-dessus (y ≈ 1 060-1 220) ; sujet cadré entre y = 250 et 1 150. Accroche : alterner
  d'un épisode à l'autre (« Que feriez-vous si… », « Si… », « Alors, t'as choisi… ? », « Imagine… », chiffre choc),
  jamais la même ouverture deux épisodes de suite (règle dans CLAUDE.md, étape 1 du pipeline).
- **2026-10-27 — RETOUR : « le bruitage de On rembobine est trop long »** (≈ 2,8 s : toute la phrase « Stop. On
  rembobine. » + 1,5 s de pause). Règle : pause `>>` à **0,6 s** (`PAUSE_LONGUE`, `tools/script_format.py`) et
  retour déclaré à partir du mot « rembobine » : `retours: [{ de: "stop:rembobine", a: "<phrase après>", depuis: … }]`
  → ≈ 1,1 s de son. Ne pas rallonger sans demande.
- **2026-10-27 — DEMANDE : arrêter la série H+72 à la Partie 5.** Règle : le dernier épisode d'une série résout les
  fils ouverts (coupables, objet planté qui sert une dernière fois), répond à la toute première image de la série,
  et finit SANS cliffhanger ni choix A/B : carton « FIN · <série> » lu par le narrateur, avec une question ouverte
  pour les commentaires. Quand la demande dit « finale », demander si c'est la fin de la série avant d'écrire un
  cliffhanger.
- **2026-10-27 — Partie 5, 1re planche : Inès énorme au premier plan (0:21)** : après une coupe, la caméra était posée
  là où elle se tenait, et elle marchait vers la porte en passant devant l'objectif. Règle : dans une pièce étroite
  (entrée), le personnage démarre ENTRE la caméra et sa destination à plus de 1,5 m de l'objectif, jamais à côté de
  la caméra ; vérifier la position de départ par rapport à la caméra du plan, pas seulement l'arrivée.
- **2026-10-27 — Lampes de policiers et de Morel qui aveuglent l'image (cônes plein écran, visage brûlé).** Règle :
  un faisceau porté par un figurant face caméra : force ≤ 0,35, longueur ≤ 1,6 m, visé vers le bas du sujet ; un
  personnage qui parle n'a pas de lampe allumée vers un autre visage.
- **2026-10-27 — Objets illisibles : enveloppe brune sur meuble brun, robinet caché derrière Inès, gros plan de pompe
  sans repère.** Règle : un objet clé contraste avec son support (clair sur sombre) ; la caméra le place du côté
  opposé au personnage (rappel du 24/10) ; un appareil se filme assez large pour voir son voyant ou son mouvement.
- **2026-10-27 — Dernier épisode : carton « FIN » ajouté au moteur** (`fin: true` dans le carton, `hud/Composants.tsx`) :
  FIN en très grand, nom de la série, question ouverte, sans choix A/B.
- **2026-10-27 — Couverture : la 2e ligne (« PAS LA CALE ») sortait de l'image.** Règle : avec `tools/couverture.sh`, la
  grande ligne jaune fait au plus 8 caractères (espaces compris) ; regarder la couverture avant de livrer (rappel).
- **2026-10-27 — Envoi GitHub impossible depuis le PC Windows avec la version téléphone (45 Mo) dans le commit**
  (« failed to push some refs », même avec `http.postBuffer` agrandi). Règle : sur le PC, la vidéo est déjà copiée dans
  « Vidéos TikTok » sur le bureau : ne pas versionner la version téléphone, et vérifier `git status -sb`
  (« ahead » = rien n'est parti) après chaque envoi.
- **2026-10-27 — DEMANDE : « à partir de maintenant, envoie ici à chaque fois au format téléphone ».** Règle : après
  chaque rendu final, faire la version téléphone (`ffmpeg -crf 23 -maxrate 2M -bufsize 4M`, AAC 160k, < 30 Mo = limite d envoi,
  `videos/NNN-nom/<série>-partieN-telephone.mp4`) et l'ENVOYER DANS LA CONVERSATION (outil d'envoi de fichier),
  sans attendre qu'on la demande ; pas par GitHub.
- **2026-10-27 — DEMANDE (série « Le dernier appel ») : « je ne veux pas de conseils, je veux juste qu'on regarde une
  histoire drama ».** Règle : pour cette série, AUCUN conseil ni tactique « Un / Deux / Trois », pas de fiches ni de
  HUD de survie : une histoire (horreur + drama de couple) avec répliques, montée de tension, fausse accalmie, twist et
  choix A/B. Le gabarit chiffré reste (200-260 mots, phrases de 2 à 8 mots, hook de 2 phrases, carton lu). Avant
  d'écrire une nouvelle série, demander si elle est « survie » (conseils) ou « histoire » (sans conseils).
- **2026-10-29 — STYLE VALIDÉ pour la saison « Le dernier appel » (image d'essai `qc/banc-style-appel/essai.jpg`).**
  Règle : personnages `variante: "adulte"` (≈ 1,75 m, tête ≈ 1/7, yeux en amande, coiffures `meches` / `long`,
  `CORPS_ADULTE` dans `personnage/poses.ts`) ; image `post.noirRouge: 1` (noir et blanc, seuls les rouges francs
  restent : la couleur de la menace, des indices) ; SMS et appels montrés par l'élément HUD `telephone`
  (`ecran: "appel" | "sms"`, bulle `menace` en rouge), placé sous le visage, jamais dessus. Le rouge reste rare :
  1 ou 2 éléments par plan. Banc d'essai : `npx tsx tools/images.ts banc-style-appel 0.1 1.5 1.75 1.95`.
- **2026-10-29 — Voix chuchotée (Léa) : 1 à 2 s de blanc restaient dans ses répliques** (« Chez Sarah. … Je dors. » :
  4,7 s). Vosk reconnaît mal le chuchotement, les mots sont « interpolés » et `tools/couper_blancs.py` ne coupait rien
  entre eux. Règle : entre mots interpolés, l'outil raccourcit désormais les VRAIS silences (aucun son mesuré) à 0,3 s ;
  après l'alignement d'une voix chuchotée, vérifier la durée de chaque réplique (≈ 0,35 s par mot au plus).
- **2026-10-29 — Fichier de voix nommé « léa.mp3 » (accent) : introuvable par l'outil.** Règle : les fichiers de voix
  s'appellent sans accent (`lea.mp3`) ; Claude renomme lui-même et le dit.
- **2026-10-29 — « Le dernier appel » P1, 1re revue : écran de téléphone (HUD) qui cachait Nathan, poses debout sur le
  canapé, plans noirs.** Règles : (1) le HUD `telephone` est petit, en bas à gauche (403×572, contenu réduit), et le
  personnage est cadré à droite (`x` ≈ 640) ; (2) un personnage assis qui téléphone ou lit utilise `assisTelephone` /
  `assisMain` (jamais `telephone` / `mainTendue`, qui sont debout) ; (3) téléphone à l'oreille : écran éteint (sinon le
  halo brûle la tête) ; (4) en noir et blanc, un plafonnier très faible garde chaque pièce lisible, et une façade sombre
  reçoit une légère émission pour rester visible la nuit ; (5) un gros plan d'objet sur un vêtement sombre se filme à
  ≥ 1,5 m (sinon le vêtement remplit l'écran en noir) et l'objet dépasse DEVANT le vêtement.
- **2026-10-29 — `tools/qc.ts` interdisait de filmer à travers une fenêtre** (les murs étaient des boîtes pleines).
  Corrigé : `passeParOuverture` (`kit3d/decor.ts`) laisse passer le regard par une fenêtre, une porte ou un passage.
- **2026-10-30 — Plans de rappel illisibles (P2 de « Le dernier appel ») : façade grise du matin et portemanteau vide
  ne racontaient rien.** Règle : un rappel de l'épisode précédent se montre par ce qui le racontait (l'écran du téléphone :
  appel de « MOI », SMS de Sarah) sur un plan du héros, pas par un décor vide dont le sens est implicite.
- **2026-10-30 — Ancre « rec2:soeur » introuvable** (le mot du script est « sœur »). Règle : dans une ancre, éviter les mots
  avec « œ » ou « æ » ; prendre un mot voisin de la phrase.
- **2026-10-30 — Texte au dos d'une photo posée par terre lu à l'envers** depuis la caméra. Règle : un écrit posé à plat se
  dessine le haut tourné vers la caméra du plan (vers le sud si la caméra filme depuis le sud) ; le vérifier en image fixe.
- **2026-10-30 — Câlin qui ressemblait à un salut** (bras levé dans le vide : les deux personnages assis à 0,85 m). Règle :
  pose `assisCalin` seulement à ≤ 0,6 m l'un de l'autre, bras à hauteur d'épaule ; vérifier en image fixe.
- **2026-10-30 — Personnage debout entre la caméra et celle qui parle** (Nathan devant Léa assise pendant l'aveu). Règle :
  quand un personnage s'assoit pour parler, l'autre se déplace sur le côté (hors de l'axe caméra → visage) avant sa réplique.
- **2026-10-30 — Mot « interpolé » placé dans un blanc coupé (« Eux » de « Eux deux », voix −17,9 dB sous le fond).**
  Vosk avait entendu « de » ; le mot existait bien (vérifié par une reconnaissance Vosk à grammaire fermée
  `["eux deux", "deux", "[unk]"]` sur l'extrait). Règle : une erreur « voix sous le fond » sur un mot interpolé = vérifier
  l'extrait avec une grammaire fermée, puis recaler le mot dans `mots.json` (debut/fin + fDebut/fFin) et refaire le mixage.
