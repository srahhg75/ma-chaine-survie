# Analyse de référence : @chroniques_flippantes (« Story H 👻 »)

*Étude réalisée le 25/10/2026 vers 11 h (heure de Paris). Les vidéos sont dans `reference/chroniques_flippantes/`
(non versionnées) et servent **uniquement** à l'étude : **on ne réutilise jamais leurs images, leur voix ni leur
texte.** Les passages cités ci-dessous sont résumés avec nos mots ; seules quelques expressions très courtes sont
reprises pour nommer un procédé.*

*Méthode : yt-dlp (liste et métadonnées : vues, j'aime, commentaires, partages, enregistrements, dates), ffprobe et
ffmpeg (durées, débit, volume EBU R128, détection des plans), Vosk (transcription des voix avec leurs temps),
planches d'1 image/s relues à l'œil pour les sous-titres incrustés et l'image (Tesseract n'est pas installé sur ce
PC : lecture à l'œil), earshot (mesures). Outil : `tools/analyser_reference.py` (rendu compatible Windows à cette
occasion). L'analyse précédente (@anglemort1_) est conservée dans `analyse/analyse-anglemort.md`.*

> ⚠️ **Limites.** 14 vidéos publiques téléchargées sur 15 visibles (la plus ancienne, de 2023, est bloquée depuis ce
> PC). Le profil affiche **4,3 M de j'aime** alors que les 14 vidéos visibles n'en totalisent que **≈ 509 000** :
> **≈ 3,8 M de j'aime viennent de vidéos supprimées ou privées**. Une seule série dépasse le million ; les
> conclusions sur « ce qui marche » reposent donc surtout sur elle (5 épisodes).

---

## 1. Les chiffres

### Profil
| | |
|---|---|
| Nom / bio | « Story H 👻 » ; « Histoires d'horreur flippantes 👻 » |
| Abonnés | **144 800** |
| J'aime totaux | 4,3 M (dont ≈ 3,8 M sur des vidéos qui ne sont plus visibles) |
| Vidéos publiques | 14 (+ 1 ancienne de 2023) |

### Vidéo par vidéo (relevé le 25/10/2026 ; taux = part des vues)
| Date (Paris) | Série / sujet | Format | Durée | **Vues** | J'aime | Comm. | Partages | Enreg. |
|---|---|---|---|---|---|---|---|---|
| ven. 14/08 05:28 | « la photo » (POV filmé) | vidéo réelle + texte | 64 s | 221 100 | 4,9 % | 0,15 % | 0,52 % | 0,71 % |
| ven. 28/08 23:17 | histoire isolée | vidéo réelle + texte | 75 s | 18 400 | 2,8 % | 0,05 % | 0,06 % | 0,50 % |
| sam. 12/09 16:40 | « mon copain ne répond plus », P1 | POV filmé, **narré** (192 mots/min) | 60 s | 257 600 | 2,6 % | 0,03 % | 0,03 % | 0,31 % |
| sam. 12/09 23:09 | même histoire, P2 (« Réponse à @… ») | POV filmé + texte | 60 s | 162 300 | 2,4 % | 0,14 % | 0,05 % | 0,56 % |
| mar. 20/10 19:24 | l'appartement | **animation**, texte seul | 60 s | 11 700 | 3,0 % | 0,03 % | 0,08 % | 0,49 % |
| jeu. 22/10 11:22 | le voisin | animation, texte seul | 63 s | 18 200 | 3,4 % | 0,04 % | 0,12 % | 0,42 % |
| jeu. 22/10 21:50 | la caissière de station-service | animation, texte seul | 64 s | 17 700 | 2,7 % | 0,03 % | 0,11 % | 0,46 % |
| ven. 23/10 11:56 | camping seule en forêt | animation, texte seul | 77 s | 20 200 | 2,1 % | 0,01 % | 0,07 % | 0,30 % |
| ven. 23/10 14:12 | site de rencontre | animation, texte seul | 63 s | 39 600 | 3,0 % | 0,03 % | 0,22 % | 0,52 % |
| **ven. 23/10 16:14** | **« Le dernier métro », P1** | animation, **texte seul, sans voix** | **61 s** | **3 000 000** | 8,4 % | 0,09 % | 0,46 % | 0,71 % |
| **ven. 23/10 23:44** | **« Le dernier métro », P2** | animation, **narrée** (239 mots/min) | **76 s** | **1 100 000** | 10,6 % | 0,11 % | 0,39 % | 1,10 % |
| sam. 24/10 10:40 | « Le dernier métro », P3 | narrée (259 mots/min) | 72 s | 446 300 | 10,9 % | 0,20 % | 0,46 % | 1,52 % |
| sam. 24/10 17:19 | « Le dernier métro », P4 | narrée (185 mots/min) | 68 s | 341 700 | 11,8 % | 0,23 % | 0,43 % | 1,72 % |
| sam. 24/10 22:05 | « Le dernier métro », P5 | narrée (212 mots/min) | 77 s | 210 200 | 13,3 % | 0,31 % | 0,49 % | 2,91 % |

**À retenir :**
- **Plus d'un million : 2 vidéos, de la même série** (« Le dernier métro », P1 à 3,0 M et P2 à 1,1 M). Les 5 histoires
  animées publiées juste avant, sur d'autres sujets et dans le même style, font **11 700 à 39 600 vues**.
  Ce n'est donc pas le style qui a fait le million, c'est le **sujet + la mécanique** (voir section 2).
- **Durées : 60 à 77 s.** Plus court que nos 75-101 s ; le million a été fait en 61 s.
- **Rythme de publication : 2 à 3 vidéos par jour** depuis le 20/10 (10 vidéos en 5 jours), dont **les 5 parties du
  métro en 30 heures** (23/10 16:14 → 24/10 22:05, une toutes les 6 à 11 h). Avant : 4 vidéos visibles en 2 mois.
- **Chaque suite perd une partie du public** : 3,0 M → 1,1 M (37 %) → 446 k (41 %) → 342 k (77 %) → 210 k (61 %).
  En revanche, **l'engagement monte à chaque partie** (j'aime 8,4 % → 13,3 %, commentaires 0,09 % → 0,31 %,
  enregistrements 0,7 % → 2,9 %) : ceux qui restent sont accrochés.
- **Commentaires 5 à 18 fois plus nombreux que chez @anglemort1_** (0,09-0,31 % contre 0,017-0,08 %) : le choix posé
  à la fin de chaque partie fonctionne (section 2).
- **Le style a changé le 20/10** : avant, des vidéos réelles filmées au téléphone (« POV » + texte) ; depuis, de
  l'animation 3D simple. La chaîne a fait le ménage (≈ 3,8 M de j'aime disparus).

---

## 2. La recette narrative

### Le principe : une histoire « dont tu es le héros », pilotée par les commentaires
- Tout est raconté **au « tu »** : le spectateur EST le personnage (un mannequin blanc sans nom).
- **Chaque partie finit sur un choix binaire** (monter dans la rame ou rester sur le quai ; bouton rouge ou blanc ;
  sortie ou téléphone ; couloir A ou B ; sortir ou rester caché).
- **La partie suivante est publiée en « réponse au commentaire » d'un abonné** (titre « Réponse à @… », autocollant
  TikTok du commentaire affiché en haut à gauche pendant ≈ 3 s, étiquette « Partie N »). Le spectateur voit que
  les commentaires font avancer l'histoire.

### Structure d'une partie narrée — exemple : P2 (1,1 M, 76 s), temps relevés par Vosk et sur les planches
*(contenu résumé avec nos mots)*

| Temps | Fonction | Ce qui se passe |
|---|---|---|
| **0-3 s** | **Rappel du choix** | Question directe au spectateur : « alors, tu as choisi A ou B ? » + étiquette « Partie 2 » et commentaire épinglé en haut à gauche. |
| 3-25 s | **Mauvaise branche** (≈ 22 s) | « Si tu as choisi A… » : la situation empire en 4 ou 5 phrases (un inconnu derrière toi, il sourit, il tient une lame, tu cours, le métro part sans toi) → **mort**. |
| **25-26 s** | **Pivot-signature** | L'expression « on rembobine » (même procédé dans les 5 parties, vers 25-35 s). |
| 26-47 s | **Bonne branche** (≈ 21 s) | « Si tu as choisi B… » : soulagement trompeur (« tu souffles »), puis l'étrange s'installe (le métro accélère, les rails changent, arrêt dans un tunnel inconnu, tout s'éteint). |
| 47-70 s | **Nouvelle règle / nouveau jeu** | Un écran s'allume, une voix annonce un jeu, deux boutons, un compte à rebours d'une minute. |
| **70-76 s** | **Nouveau choix** | « Alors tu fais quoi : A ou B ? » — dernière phrase, sans réponse. |

**Squelette commun aux parties 2 à 5 :** rappel du choix (≈ 3 s) → mauvaise branche = mort (≈ 20-30 s) → « on
rembobine » → bonne branche (≈ 30-40 s) avec un faux répit puis une nouvelle menace → **nouveau dilemme** (≈ 5 s).

### La partie 1 (3,0 M, 61 s), sans voix : seconde par seconde
| Temps | Ce qui se passe |
|---|---|
| **0-4 s** | Hook au « tu » : « Imagine… » + situation (dernier métro raté, les grilles de la station se ferment) ; le personnage marche déjà sur le quai. |
| 4-9 s | **Enjeu chiffré** : gros plan d'un téléphone à **3 %** de batterie, « aucun réseau ». |
| 10-14 s | Panneau horaire : prochain métro à 5 h 30 → il faut attendre toute la nuit ; il s'assoit. |
| 15-25 s | **Objet planté** : une feuille scotchée (« consignes de nuit, personnel uniquement ») avec **une règle numérotée** (ne jamais monter dans une rame vide). Le texte reste lisible 6 s à l'écran. |
| 26-29 s | Faux répit : il sourit (une blague de collègues). |
| **30 s** | **Horloge à 00:00** → les lumières s'éteignent. |
| 31-41 s | Deux phares dans le tunnel, une rame arrive, **vide**, portes ouvertes devant lui. |
| 44 s | **Rappel visuel** de la règle (bulle de pensée avec la feuille). |
| 47-55 s | **Menace humaine** : une silhouette noire apparaît derrière lui, de plus en plus proche. |
| 56-61 s | **Choix** : monter dans la rame vide ou rester sur le quai avec la silhouette. Coupure sèche. |

### Les hooks
- P1 : 2e personne + impératif mental (« Imagine… ») + **lieu quotidien** (le métro) + **détail angoissant**
  (grilles qui se ferment) en **≈ 4 s**.
- Parties suivantes : **pas de hook pour un nouveau venu**, seulement « alors tu as choisi A ou B ? ». C'est efficace
  pour les abonnés, mais un spectateur qui tombe sur la P3 ne comprend rien → c'est une des causes de la chute
  P1 → P5 (section 4).
- Titres-légendes : la question de la partie (« le mieux est-il de… ? ») ou une promesse vague (« ça devient de plus
  en plus corsé »).

### Le style des phrases
- **Présent, 2e personne**, phrases courtes à moyennes (6 à 15 mots), enchaînées par « puis », « mais », « d'un
  coup », « juste derrière toi ».
- **Débit très rapide : 185 à 259 mots/min** (P3 : 259), presque sans pause.
- **Règles écrites** (le genre « règles de nuit ») : une feuille de consignes, une carte avec deux chemins, un
  écran avec deux boutons ; la règle plantée en P1 revient en P3 (« tu repenses au papier du début »).
- **Personnification de la menace** (« une silhouette », « ce qui te cherche ») ; jamais de nom.

### Les cliffhangers
- **Toujours un choix binaire explicite**, jamais un simple « à suivre ».
- **La mort est montrée à chaque partie** (la mauvaise branche) : le spectateur apprend qu'un choix peut tuer.
- **Objets plantés qui reviennent** : la feuille de consignes (P1 → P3), les photos de disparus avec la tienne
  (P3), le téléphone fixe qui sonne (P3 → P4).

---

## 3. Visuels et son

### Style
- **Animation 3D très simple, rendu « dessin »** : mannequins blancs lisses, tête ronde sans cheveux, deux points
  pour les yeux, une bouche en trait (expressions par quelques traits : sourcils, gouttes de sueur). La menace
  est une **silhouette entièrement noire** avec un sourire blanc.
- Décors gris-bleu nuit (quai, rame, guérite, couloirs), quelques sources lumineuses (néons, phares) ; lisible,
  mais très sombre et uniforme.
- Gros plans d'objets en « vue subjective » : téléphone en main (3 %), panneau horaire, feuille de consignes, bulle
  de pensée.

### Caméra et montage
- P1 : **13 vraies coupes en 61 s** (1 toutes les 4,7 s), mais un **nouvel état de l'image chaque seconde ou
  presque** (zoom, changement d'angle, gros plan) ; P2 : **37 coupes en 76 s** (1 toutes les 2,1 s).
- Beaucoup de **plans fixes « illustratifs »** (une image par phrase), peu de mouvements de caméra continus.

### HUD
- Pratiquement **aucun HUD** : ni jauge, ni montre permanente, ni fiche. Les seuls repères sont **dans le décor**
  (horloge 00:00, téléphone 3 %, panneau, feuille de règles).
- En haut à gauche, dans les suites : étiquette « Partie N » + autocollant TikTok du commentaire auquel la vidéo
  répond (≈ 0-3 s).

### Sous-titres
- **Un seul mot à la fois**, Montserrat-like très grasse, **majuscules blanches à contour noir**, centré vers
  **67-69 % de la hauteur** de l'image ; le mot change ≈ 3 à 4 fois par seconde.
- Pas de couleur pour les mots-clés.
- Ils passent souvent **sur le corps du personnage** (P1 à 6, 9 et 15 s ; P2 à 3-4 et 8-10 s).

### Voix, musique, mixage (mesures EBU R128 / ffprobe)
| | P1 (3,0 M) | P2 (1,1 M) | P3 | P4 | P5 |
|---|---|---|---|---|---|
| Voix | **aucune** | voix masculine posée, très rapide (239 mots/min), probablement synthétique | idem, 259 | 185 | 212 |
| Volume intégré | −15,6 LUFS | **−25,4 LUFS** | **−25,7** | **−26,3** | **−25,2** |
| Piste son vs image | **145 s de son pour 61 s d'image** | égales | égales | égales | égales |

- P1 et 3 autres vidéos du 22-23/10 partagent **exactement la même piste son de 145 s** (même volume, même LRA) :
  une musique d'ambiance réutilisée, plus longue que la vidéo (négligence d'export, comme chez @anglemort1_).
- Les vidéos narrées sont **≈ 11 dB trop basses** pour TikTok (cible ≈ −14 LUFS) : sur téléphone, on doit monter le
  son, ou on décroche.
- Encodage HEVC à **160-310 kb/s** seulement : bandes visibles dans les dégradés sombres.

---

## 4. Leurs faiblesses, point par point, et comment on fait mieux

| # | Faiblesse constatée (preuve) | Ce qu'on fait mieux |
|---|---|---|
| 1 | **Suites sans hook pour les nouveaux** : P2 à P5 commencent par « alors tu as choisi… ? » ; les vues fondent (3,0 M → 210 k). | Chaque partie commence par un **hook « Que feriez-vous si… »** puis un **récap de 3-4 phrases** (déjà notre règle depuis H+72 P2), **et seulement ensuite** la réponse au choix. |
| 2 | **Son 11 dB trop bas** sur les parties narrées (−25 à −26 LUFS). | Master **−14 LUFS, TP < −1 dB**, vérifié à chaque rendu. |
| 3 | **Piste son plus longue que l'image** (145 s pour 61 s) et musique recyclée sur 4 vidéos. | Mixage construit pour chaque épisode, durée contrôlée par `tools/final.sh`. |
| 4 | **Débit 185-259 mots/min**, sans pause : les rebondissements ne respirent pas. | ≈ 170 mots/min et **silences de 0,6 s avant chaque chute**. |
| 5 | **Aucune information utile** : c'est de l'horreur pure ; la mauvaise branche finit toujours en « tu meurs », sans rien apprendre. | Notre mauvaise branche = **le mauvais réflexe en fantôme rouge** avec sa conséquence **réelle** ; la bonne branche = **le bon réflexe vérifié**. On apprend en jouant. |
| 6 | **Mort systématique et répétitive** (5 fois en 5 parties) : la menace perd son poids. | Conséquences graduées et crédibles (blessure, perte d'eau, de chaleur, de batterie, de temps) **chiffrées dans une jauge** ; la mort reste exceptionnelle. |
| 7 | **Personnage sans identité** (mannequin anonyme) : aucun attachement, aucune expression riche. | Héros nommés et caractérisés (Inès, Morel), **yeux expressifs**, expressions calées sur le texte, **dialogues**. |
| 8 | **Pas de HUD** : enjeux (batterie 3 %, heure) montrés une fois puis oubliés. | **Montre, jauge et moodles permanents** qui évoluent avec l'histoire. |
| 9 | **Sous-titres d'un seul mot**, centrés à 67-69 %, souvent **sur le corps**, sans mots-clés colorés. | Blocs de 2-4 mots qui apparaissent quand ils sont dits, **chiffres géants**, danger en rouge, **sujet cadré au-dessus des sous-titres** (contrôle automatique). |
| 10 | **Image très sombre, encodage 160-310 kb/s** : bandes, détails perdus. | Nuit lisible (sujet et sol visibles), grain léger, encodage ≤ 12 Mb/s. |
| 11 | **Univers sans logique de survie** (règles arbitraires, surnaturel). | Danger **réaliste et quotidien** (panne, froid, eau, monoxyde) : ça pourrait arriver au spectateur demain. |
| 12 | **Catalogue instable** (≈ 3,8 M de j'aime disparus, changement de style le 20/10). | Séries complètes gardées en ligne, une identité visuelle stable par série. |

**Ce qu'ils font bien et qu'on garde (en principe, jamais leur texte ni leurs images) :**
- le **« tu » / « vous »** qui met le spectateur dans la peau du héros ;
- **le choix binaire à chaque fin**, et **la suite publiée en réponse au commentaire** d'un abonné ;
- la structure **« mauvais choix → on revient en arrière → bon choix → nouveau dilemme »** ;
- une **règle écrite plantée tôt** qui revient plus tard ;
- **l'enjeu chiffré dès les 5 premières secondes** (batterie 3 %, heure) ;
- le **rythme de publication en rafale** : 5 parties en 30 heures tant que la série chauffe.

---

## 5. Séries à plus d'un million de vues : ce qu'on garde, ce qu'on change

| Série | Épisode | Vues | Mécanique qui a marché |
|---|---|---|---|
| « Le dernier métro » | P1 (61 s, sans voix) | **3 000 000** | Peur universelle (rester enfermé seul la nuit dans un lieu public), enjeu chiffré (3 %), règle écrite inquiétante, menace humaine dans le dos, **choix binaire** final. |
| « Le dernier métro » | P2 (76 s, narrée) | **1 100 000** | Réponse au choix des commentaires, mort dans la mauvaise branche, tournure surnaturelle, nouveau dilemme. |

### Ce qu'on garde (principes)
1. **Choix A/B à chaque fin** (nous l'avons déjà : carton A/B lu par le narrateur) **et réponse dans la partie
   suivante, publiée en réponse vidéo au commentaire** d'un abonné qui a bien répondu.
2. **Les deux branches montrées** : la mauvaise en **fantôme rouge** (notre signature), la bonne en vrai.
3. **Un signal de « retour en arrière »** à nous, différent du leur (ex. : l'image se rembobine en noir et blanc
   avec un bruit de bande et le mot **« STOP »** dans le HUD, sans l'expression « on rembobine »).
4. **Une règle écrite plantée tôt** (ex. : l'affiche de l'immeuble, la liste d'Inès) qui revient en partie suivante.
5. **Un enjeu chiffré dès les 5 s** (litres, degrés, % de batterie) — déjà notre jauge.
6. **Rafale de publication** : quand une partie dépasse sa moyenne, publier la suivante dans les 6-12 h.

### Ce qu'on change pour notre version française entièrement réécrite
| Leur choix | Notre version |
|---|---|
| Horreur surnaturelle (rame fantôme, « terminus des disparus ») | **Survie réaliste** (panne, froid, eau, monoxyde, inconnu dans l'immeuble), conseils **vérifiés et datés** |
| Mauvais choix = mort à chaque fois | Mauvais choix = **conséquence réelle et chiffrée** montrée en fantôme (et ce qu'il fallait faire) |
| Mannequin anonyme au « tu » | **Héros nommé** + le « vous » du narrateur (« Que feriez-vous si… ») |
| Suite sans hook | **Hook + récap** en tête de chaque partie, réponse au choix ensuite |
| 185-259 mots/min, −25 LUFS | ≈ 170 mots/min, silences avant les chutes, −14 LUFS |
| Sous-titres 1 mot, sans couleur | Sous-titres « rétention » (chiffres géants, danger en rouge, nom du personnage qui parle) |
| Aucun HUD | Montre, jauge, moodles, fiches, tactique n/3 |

### Exemple de transposition (piste d'idée, pas un script)
**H+72, partie 3 « La lampe qui suit »** reprend le choix de la fin de P2 (« ce soir, Inès part à sa garde, ou reste
et guette ? ») :
- **hook** « Que feriez-vous si une lampe torche vous suivait dans l'escalier, sans jamais s'approcher ? » + récap
  de 3-4 phrases ;
- **branche A en fantôme rouge** : elle part, l'appartement est de nouveau vidé, et elle rentre de nuit en guidant
  l'inconnu jusqu'à sa porte (le mauvais réflexe : rentrer droit chez soi quand on est suivi) ;
- **retour en arrière** (notre signal) ;
- **branche B en vrai** : elle reste, prévient les voisins, rejoint un palier occupé et éclairé, note ce qu'elle voit
  (bons réflexes à vérifier à l'écriture) ;
- **nouveau dilemme** au carton : « l'homme à la lampe frappe à la porte de Morel : A, vous ouvrez ? B, vous appelez ? ».

*Toute idée de conseil sera vérifiée à l'écriture (règle « faits vérifiés »). Leur décor de métro rappelle notre idée
de série « Entre deux stations » (`analyse/idees-series.md`) : si on la produit, elle reste une histoire de survie
réaliste (panne, rail sous tension, évacuation encadrée), sans rame fantôme ni règles surnaturelles.*
