# Analyse de référence : @anglemort1_ (« ANGLE MORT »)

*Étude réalisée le 23/10/2026 à 15 h 30 UTC. Les vidéos sont dans `reference/anglemort1_/` (non versionnées)
et servent uniquement à l'étude : **on ne réutilise jamais leurs images, leur voix ni leur texte.**
Méthode : yt-dlp (métadonnées), ffprobe, lecture des sous-titres incrustés par OCR à 6 images/s (Tesseract fr),
transcription des temps de parole (Vosk), détection des plans (ffmpeg), écoute et mesures earshot (`timeline`, `measure`),
planches d'1 image/s relues à l'œil. Outil réutilisable : `tools/analyser_reference.py`.*

> ⚠️ **Limite importante.** La chaîne n'a que **3 vidéos publiques**, qui forment **une seule série**. Toutes les
> conclusions reposent donc sur 3 épisodes. Le profil affiche 283 400 j'aime, mais les 3 vidéos visibles n'en
> totalisent que 174 661 : **~108 700 j'aime viennent de vidéos supprimées ou privées**. Le compte existe depuis le
> 09/11/2025, il a donc fait le ménage ou changé de ligne récemment.
> Autre point : leur thème est le **thriller de sécurité routière réaliste**, pas l'apocalypse. La recette se
> transpose ; le thème, non.

---

## 1. Les chiffres

### Profil
| | |
|---|---|
| Nom / bio | « ANGLE MORT » ; « Nouveaux épisodes tous les jours ! » + lien vers une formation (« Comment je crée ces vidéos 3D ») |
| Abonnés | **10 300** |
| J'aime totaux | 283 400 |
| Vidéos publiques | 3 (une série, « 6 POINTS — Une nuit, une route ») |

### Vidéo par vidéo (relevé le 23/10 à 17 h 29, heure de Paris)
| Épisode | Publié (Paris) | Âge | Durée | **Vues** | Vues/heure | J'aime | Enreg. | Partages | Comm. |
|---|---|---|---|---|---|---|---|---|---|
| Partie 1 — délit de fuite | mer. 21/10 14 h 29 | 51 h | 111 s | 358 400 | 7 000 | 10,5 % | 1,08 % | 0,17 % | 0,037 % |
| **Partie 2 — la voiture qui colle** | **jeu. 22/10 01 h 17** | 40 h | 110 s | **1 700 000** | **42 300** | 7,5 % | 0,82 % | 0,15 % | 0,017 % |
| Partie 3 — le brouillard | ven. 23/10 02 h 00 | 15 h | 103 s | 84 700 | 5 500 | 11,4 % | 2,11 % | 0,20 % | 0,080 % |

- **Plus d'un million de vues : 1 seule vidéo**, la Partie 2 (1,7 M en 40 h, soit 6× la vitesse de la Partie 1).
- **Durées : 103 à 111 s.** Notre fourchette de 70 à 120 s est la bonne, et 100-110 s fonctionne.
- **Rythme de publication :** 3 épisodes en 36 h (≈ 1 par jour, comme promis dans la bio). Les heures sont irrégulières
  (14 h 29, puis 1 h 17, puis 2 h 00). Le million a été fait par un épisode posté **en pleine nuit**, donc l'heure
  n'a pas été décisive.
- **Taux d'enregistrement élevés** (0,8 à 2,1 %) : le public garde les vidéos de « conseils ». C'est l'argument
  « faits vérifiés » qui joue.
- **Commentaires presque nuls** (0,02 à 0,08 % des vues, 289 commentaires pour 1,7 M de vues). La question de la
  légende (« Vous faites quoi ? ») ne déclenche pas de réponses. C'est le principal levier qu'ils ratent.
- **Différence clé entre la Partie 1 (358 k) et la Partie 2 (1,7 M) : la voix.** Dans le fichier de la Partie 1,
  **aucune voix n'est détectée** (Vosk : 0 mot ; earshot : « speech 0.00 » sur toutes les sections) : texte à
  l'écran plus musique. Les Parties 2 et 3 sont **narrées** (≈ 195 mots/min). Avec 3 vidéos, ce n'est pas une
  preuve, mais c'est cohérent avec notre choix d'une voix dès la première seconde.

---

## 2. La recette narrative

### Structure de la Partie 2 (1,7 M), seconde par seconde
*(temps relevés par Vosk et sur les planches ; contenu résumé avec nos mots)*

| Temps | Fonction | Ce qui se passe |
|---|---|---|
| **0,0-4,5 s** | **Hook-question** | Phrase en « Si… » au « vous » : une voiture vous colle de nuit, pleins phares, sans doubler. Elle se termine sur le **mauvais réflexe en question** (« vous accélérez ? »). L'image est **déjà en mouvement** : poursuite sur route mouillée. |
| 4,5-8 s | **Boucle ouverte n°1** | Le héros sait quoi faire… *mais l'adversaire aussi*. On promet un duel. |
| 8-12 s | **Fiche perso + enjeu** | Carte « permis de conduire » à l'écran : prénom, 19 ans, permis depuis 3 jours, **6 points**. L'enjeu est chiffré. |
| 12-21 s | **Rappel de l'épisode précédent** (≈ 9 s, 8 % de la durée) | Le SUV de la Partie 1, et les phares qui font demi-tour. |
| 21-39 s | **Ambiance + détails humains** | Heure exacte, rituels de conduite, message de la grand-mère. Un **aparté au spectateur** (« vous, vous pouvez le lire ») crée de la complicité. |
| 39-47 s | **Apparition de la menace** | Phares LED décrits comme des sourcils froncés, le rétroviseur qui « devient un soleil » : **personnification**. |
| 47-58 s | **Mauvais réflexes réfutés** | Refrain « Premier réflexe : X ? Non. » Chaque mauvaise option est montrée par une **voiture-fantôme rouge hachurée**, avec sa conséquence (fossé, collision). |
| 59-66 s | **Bonne action n°1** | Position nuit du rétroviseur, vitesse constante, serrer à droite, laisser la place. |
| 66-76 s | **Escalade + bonne action n°2** | Le SUV ne double pas. Le héros **ne rentre pas chez lui** (ne pas guider le suiveur) et fait un tour complet de rond-point pour vérifier la filature. Le suiveur le fait aussi. |
| 76-89 s | **Bonne action n°3** | Station éclairée, garé sous l'auvent face à la caisse, portières verrouillées, **puis seulement** appel au 17. Notification « Appel d'urgence » à l'écran. |
| 89-94 s | **Fausse résolution** | Le SUV passe tout droit et disparaît. |
| **94-97 s** | **Phrase-signature** | En substance : « Sur le papier, il a tout fait juste. Il restait un seul problème. » Même phrase à ~96 s dans la Partie 1 et à ~84 s dans la Partie 3. |
| 97-106 s | **Retournement** | Le SUV est garé, feux éteints, **vide**, à la pompe voisine. Un message est écrit au doigt sur la vitre embuée. Il renvoie à la caméra embarquée **plantée dans la Partie 1** (≈ 99-101 s). |
| 106-110 s | **Carte de fin** | Panneau routier bleu « PARTIE 3 · LE BROUILLARD ↗ » + « ABONNE-TOI POUR LA SUITE » + « Fiction · conseils vérifiés le 21/10/2026 ». |

**Squelette commun aux 3 épisodes :**

hook-question « Si… » (0-5 s) → héros + promesse (5-8 s) → carte d'identité/enjeu (8-12 s) → rappel (≤ 10 s) →
menace → 2-3 mauvais réflexes réfutés → 3 bonnes actions → fausse résolution → phrase-signature → retournement → carte « Partie suivante ».

Il y a environ **6 informations de survie utiles par épisode**, glissées dans une histoire. On apprend sans s'en rendre compte.

### Les hooks (forme)
- Les trois commencent par **« Si »** et parlent au **« vous »** :
  - P1 : « Si une voiture renverse un scooter devant vous puis s'enfuit… » ;
  - P2 : « Si une voiture vous colle… » ;
  - P3 : « Si le brouillard est si épais… ».
- Construction : **danger concret et quotidien → détail sensoriel → le réflexe instinctif (souvent mauvais) posé en question**.
  En P1, le hook donne même l'ordre inverse (« ne la poursuivez pas ») dès 3 s.
- **Durée du hook : 4 à 5 s, 8 à 15 mots.** Le titre-légende reprend exactement la question.

### Le style des phrases
- **Phrases nominales très courtes**, en rafale. Exemple du procédé : prénom, âge, ancienneté du permis, points, une
  phrase pour chaque, à environ 1 s d'intervalle.
- **Présent de narration**, horodatage précis (« Vendredi, 23 h 40 »), lieux concrets (départementale, forêt,
  station, rond-point).
- **Refrain** « Premier réflexe de [héros] : … ? Non. », puis la bonne action.
- **Personnification** des menaces (phares qui froncent les sourcils, rétroviseur-soleil).
- **Apartés au spectateur** : « vous, vous pouvez le lire » (P2) et un **défi chronométré** en P3 (« il y a un piège… vous avez trois secondes », vers 66-70 s, suivi d'environ 3 s de suspense).
- **Débit : 191 à 196 mots/min**, avec seulement 8 pauses de plus de 0,4 s en 107 s (P2). C'est très dense.

### Les cliffhangers
- **Phrase-signature identique** à chaque épisode, puis un retournement en 2 ou 3 images, puis le titre de la suite.
- **Objet planté plus tôt** qui revient (la caméra embarquée de P1 devient la menace de P2).
- Chaque fin **ouvre le danger de l'épisode suivant** : les phares qui font demi-tour (P1→P2), le brouillard
  annoncé (P2→P3), le suiveur qui roule tous feux éteints alors que la maison est à 2 km (P3→P4).

---

## 3. Visuels et son

### Style 3D
- **Low-poly stylisé, « jouet »** : personnages-figurines aux grands yeux ronds, voitures simplifiées, forêt de troncs
  cylindriques. C'est lisible sur téléphone et rapide à produire.
- **Nuit bleue + pluie** dans les 3 épisodes, éclairage par les phares (cônes, reflets sur route mouillée),
  brouillard volumétrique en P3. La palette se limite au bleu nuit, au blanc des phares et au rouge (feux arrière,
  mots-clés, dangers).

### Caméra et montage
- **Mouvement presque permanent**, avec beaucoup de plans larges en plongée sur la route, des plans de poursuite
  derrière les véhicules, des gros plans du visage dans l'habitacle et des vues subjectives (rétroviseur).
- **Nouvel état de l'image toutes les 1 à 2 s** (planches), même si ffmpeg ne détecte que 18 à 23 vraies coupes
  franches par vidéo (1 toutes les 4,8 à 6,2 s). L'essentiel du rythme vient des mouvements de caméra et des
  apparitions de HUD, pas des coupes.
- **Rupture de style pédagogique** en P1 (51-54 s) : schéma vu de dessus sur **fond blanc**, avec trajectoires et
  zones. C'est clair, mais c'est un flash blanc au milieu d'une vidéo de nuit.

### HUD (sans compter les sous-titres)
- **Permanent, en haut à droite** : horloge digitale (« 23:52 »), qui avance à chaque ellipse, et une **jauge
  « POINTS » de 6 pastilles** (le capital du héros).
- **Étiquette de série en haut à gauche** (« 6 POINTS · PARTIE 2 »), visible les ~10 premières secondes.
- **Cartes ponctuelles** :
  - carte « permis de conduire » du héros (8-12 s) ;
  - tampons de sanction (« 3 ANS · 75 000 € — délit de fuite », « 5 ANS · 75 000 € — omission de porter secours ») ;
  - carte « Code de la route — article » ;
  - étiquette « RÈGLE 1/3 PROTÉGER » ;
  - notification d'appel au 17 ;
  - compteur de vitesse (80 km/h) ;
  - icônes ✗ rouge / ✓ verte.
- **Voitures-fantômes rouges hachurées** pour montrer ce qui arriverait si l'on faisait le mauvais choix. C'est leur meilleure idée visuelle.

### Sous-titres
- Police **sans-serif grasse (type Montserrat ExtraBold), en majuscules**, blanche avec ombre, **1 à 3 mots** par
  groupe (≈ 91 à 117 groupes par vidéo, un nouveau toutes les ~1,1 s).
- **Karaoké inversé** : les mots à venir sont affichés **en gris**, puis passent au blanc quand ils sont dits.
  **Mots-clés en rouge** (« SUV NOIR », « PLEINS PHARES ») ou en jaune (règles).
- Position : **centre de l'écran, ~57 à 62 % de la hauteur**, la même que la nôtre.

### Voix, bruitages, mixage (mesures earshot)
| | P1 | P2 | P3 |
|---|---|---|---|
| Voix | **aucune** | homme, grave, posé, très probablement synthétique | idem |
| Musique | trap / drum & bass, ~157 BPM, basses lourdes | trap + « vocal chops » | idem |
| Loudness intégré | −12,4 LUFS | −13,0 LUFS | −12,8 LUFS |
| True peak | −0,0 dBTP | **+1,9 dBTP** | **+0,9 dBTP** |
| Échantillons saturés | — | **594** (41 zones, dès 0:25,8) | **769** (48 zones, dès 0:21,0) |
| Coupes accompagnées d'un son (± 100 ms) | 49 % | 89 % | 85 % |

- Les bruitages sont rares et surtout des « booms » graves et des whooshes sur les transitions. La musique occupe tout l'espace.
- En P1, **la piste audio dure 153 s pour 111 s d'image** : la musique déborde de 42 s, une négligence d'export.

---

## 4. Leurs faiblesses, point par point, et comment on fait mieux

| # | Faiblesse constatée (preuve) | Ce qu'on fait mieux |
|---|---|---|
| 1 | **Son saturé** : true peak +1,9 dBTP et 594 échantillons écrêtés (P2), +0,9 dBTP et 769 écrêtés (P3). | Master à **−14 LUFS, true peak < −1 dB**, vérifié par `earshot measure` avant chaque rendu (déjà dans `qc/lecons.md`). |
| 2 | **Musique trap à « vocal chops » sous la voix** : deux voix humaines se battent dans les médiums. | **Pas de musique à voix** : nappes graves et bruitages sombres ≥ 10 dB sous la voix. |
| 3 | **P1 sans narration** : 358 k vues contre 1,7 M pour la P2 narrée. | Voix **dès la 1re image**, sur chaque épisode. |
| 4 | **Débit de 196 mots/min, presque sans respiration** (8 pauses > 0,4 s en 107 s) : les révélations ne sont pas « vendues ». | **~170 mots/min** et **3 ou 4 silences volontaires de 0,6 à 1 s** avant chaque révélation, posés dans la timeline (`couper_blancs.py` ne doit pas les supprimer). |
| 5 | **Le karaoké gris dévoile la suite** : à 13 s (P2), « SUV NOIR RENVERSER UN » est déjà à l'écran avant d'être dit. | **Un mot n'apparaît que quand il est prononcé.** Les mots-chocs arrivent seuls, en gros. |
| 6 | **Sous-titres sur le sujet** : sur le rétroviseur (P2, 45-46 s), sur la voiture-fantôme (50-52 s), sur la voiture (P1, 8-12 s). | Notre règle : sujet dans la bande **y ≈ 250-1000**, sous-titres à y = 1152. Contrôle sur planche toutes les 2 s. |
| 7 | **Images quasi noires** (P2, 16-18 s : seulement deux phares) et vidéo livrée en HEVC à ~0,42 Mb/s : les dégradés bleu nuit font des **bandes** en compression. | Nuit **lisible** : sol et décor toujours visibles (leçon du 23/10). Léger grain pour casser les bandes, export à haut débit. |
| 8 | **Commentaires quasi nuls** (0,017 % sur P2) : la question n'est jamais posée **comme un choix**. | Un **choix A/B explicite** à l'écran à mi-épisode (« A : vous accélérez. B : vous ralentissez. Répondez avant la fin »), puis la réponse donnée **dans l'épisode suivant**. |
| 9 | **Rappel long** : environ 9 s en P2 et 12 s en P3 (8 à 12 % de la durée). | Rappel **≤ 5 s, en action** (on revoit la menace bouger, pas un résumé). |
| 10 | **Flash blanc** du schéma pédagogique en pleine nuit (P1, 51-54 s). | Schémas en **vue de dessus sombre** (carte « tactique » bleu nuit + traits lumineux), sans rupture de couleur. |
| 11 | **HUD dans la colonne de droite** : horloge et points vers x ≈ 730-1030, y ≈ 200-300, près des boutons TikTok. | Horloge et jauge **en haut à gauche ou au centre**, sous y = 180 ; colonne de droite vide. |
| 12 | **Coupes « muettes » en P1** : 31 coupes sans aucun son, 19 % seulement calées à ±1 image. | Chaque transition majeure a son impact ou son souffle, vérifié avec `earshot timeline --video`. |
| 13 | **Chaîne instable** : ~108 700 j'aime sur des vidéos disparues, et heures de publication aléatoires. | Catalogue gardé en ligne, **séries complètes**, heure fixe (à tester : 12 h, 18 h ou 21 h). |
| 14 | **Une seule « bible » de série** (même héros, même phrase-signature) : risque de lassitude. | **Plusieurs séries courtes** (3 à 5 épisodes), chacune avec son héros, sa jauge et sa signature, et une signature de **chaîne** commune. |

Ce qu'ils font **bien**, et qu'on garde comme principes (avec notre propre exécution) :
- hook « Si… » au « vous » ;
- enjeu chiffré dans une jauge ;
- mauvais réflexes montrés par des fantômes ;
- faits vérifiés et datés ;
- objet planté puis retourné ;
- carte « Partie suivante ».

---

## 5. Séries à plus d'un million de vues : ce qu'on garde, ce qu'on change

**Une seule vidéo dépasse le million :**

| Série | Épisode | Vues | Mécanique qui a marché |
|---|---|---|---|
| « 6 POINTS — Une nuit, une route » | Partie 2 (la voiture qui colle sans doubler) | **1,7 M** | Menace humaine ambiguë, peur universelle (être suivi la nuit), 3 bons réflexes simples et vérifiables, retournement qui transforme la victoire en menace. |

### Ce qu'on garde (principes, jamais leur texte ni leurs images)
1. Hook « Si [danger concret]… vous [réflexe instinctif] ? » en ≤ 5 s, sur une image déjà en action.
2. Un **héros incarné** avec une **fiche** et un **capital chiffré** affiché en permanence (chez eux, 6 points de permis).
3. Le duo **mauvais réflexes montrés en fantôme → bonnes actions en 3 étapes**.
4. La **fausse résolution**, puis une **phrase-signature** de chute, puis un retournement qui ouvre l'épisode suivant.
5. La mention **« Fiction · conseils vérifiés le JJ/MM/AAAA »** en carte de fin.
6. Une série en parties, avec une carte « Partie suivante : TITRE ».

### Ce qu'on change pour notre version française entièrement réécrite
| Leur choix | Notre version |
|---|---|
| Sécurité routière réaliste, une nuit | **Survie apocalyptique** (panne générale, eau coupée, hiver sans chauffage, nuage toxique…) sur plusieurs jours |
| Jauge « 6 POINTS » de permis | **Notre jauge** liée à la survie : litres d'eau, % de batterie, degrés dans la maison, ou **compteur d'heures depuis la panne** (ex. « H+36 ») |
| Héros unique, figurine aux grands yeux | **Nos propres personnages** (design original : silhouettes réalistes simplifiées, sans grands yeux de figurine), une famille ou un voisinage différent à chaque série |
| Phrase-signature unique | **Notre propre signature**, à inventer et à tester, différente de la leur |
| Voix à 196 mots/min sur musique trap | ~170 mots/min, silences de suspense, **aucune musique à voix**, son sombre ≥ 10 dB sous la voix |
| Mots à venir affichés en gris | Mot affiché **seulement quand il est dit** |
| Question en légende sans appel au choix | **Choix A/B explicite** à l'écran, réponse dans l'épisode suivant |
| Rappel de 9 à 12 s | Rappel ≤ 5 s, en action |
| Son saturé (+1,9 dBTP) | −14 LUFS, TP < −1 dB, contrôlé par earshot |

### Exemple de transposition de leur mécanique gagnante (P2 → notre univers)
*« Quelqu'un vous suit et ne se montre jamais »* devient, chez nous : **jour 3 d'une panne générale**, une lampe
torche suit notre héroïne ou notre héros dans l'immeuble sans jamais s'approcher. Mauvais réflexes en fantôme :
courir chez soi (on montre le chemin), affronter. Bonnes actions vérifiables : ne pas rentrer directement, rejoindre
un lieu occupé et éclairé, prévenir les voisins, signaler. Retournement : un indice laissé **chez soi**.

C'est une piste d'idée, pas un script : chaque fait devra être vérifié à l'écriture, selon la règle « faits vérifiés ».
