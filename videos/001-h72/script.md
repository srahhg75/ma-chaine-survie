# H+72 — Partie 1 : « Neuf litres »

*Série « H+72 » (l'immeuble), épisode 1. Écrit le 23/10/2026 après relecture de `qc/lecons.md` et `analyse/analyse.md`.
Dossier nommé `001-h72` (convention `NNN-nom` : le « + » est évité dans les noms de dossiers et les adresses de fichiers).*

**Durée visée : 75 à 85 s** (≈ 215 mots). Héroïne : **Inès**, 34 ans, infirmière de nuit au 6e, méthodique.

---

## 1. Texte à coller tel quel dans ElevenLabs

```
Que feriez-vous si votre robinet crachait de l'air ?
Et qu'il vous restait neuf litres d'eau ?

Trois jours sans électricité dans toute la ville.
Sans courant, la pompe de l'immeuble s'arrête.
L'eau ne monte plus au sixième, chez Inès.
Inès connaît trois réserves cachées.
La dernière vaut deux cents litres.

Un : manger mouillé.
Pêches au sirop, ananas, haricots en boîte.
Leur jus hydrate.
Et zéro chips, zéro saucisson.
Le sel donne soif.

Deux : les toilettes.
Une chasse d'eau, c'est neuf litres.
Toute sa réserve, d'un coup.
Alors elle se lave au-dessus d'une bassine.
Et cette eau sale finit dans la cuvette.
Versée d'un coup, la cuvette se vide.

Trois : le ballon d'eau chaude.
Deux cents litres, dans le placard.
On coupe son disjoncteur.
On ferme l'eau froide.
On ouvre un robinet d'eau chaude.
Et on vide par le robinet du bas.
Un filtre à café retient les dépôts.

Surtout, jamais l'eau des radiateurs.
Elle tourne en circuit fermé depuis des années.
Brune, pleine de produits anti-rouille.
Même bouillie, elle n'est pas potable.

Inès, elle, est tranquille.
Son ballon est plein.
Elle part pour douze heures de garde.

Six heures du matin. Elle rentre.
Elle ouvre le robinet du bas.
Pas une goutte.
Le ballon est vide.
Le sol est sec.
Quelqu'un l'a vidé, pendant sa garde.
Elle a la seule clé.
```

*Gabarit respecté : hook (2 phrases) → récap (3 phrases + promesse) → tactiques « Un / Deux / Trois » → erreur
(radiateurs) puis fausse sécurité (« elle est tranquille ») → twist (ballon vide) → phrase finale de 5 mots.
Les nombres sont écrits **en lettres** : ElevenLabs les lit sans erreur et l'alignement mot à mot (Vosk) les retrouve.*

## 2. Réglages ElevenLabs conseillés

| Réglage | Valeur | Pourquoi |
|---|---|---|
| Modèle | **Eleven Multilingual v2** | Le plus stable en français sur un texte long. (v3 est plus expressif mais varie d'une prise à l'autre.) |
| Voix | Voix **française native** de la bibliothèque (filtre « French »), **grave, posée, narrative** | Accent sans anglicisme ; une voix calme rend le danger plus inquiétant. |
| Stability | **45 %** | Assez vivant pour les phrases-chocs, sans dérapage de ton. |
| Similarity | **75 %** | Fidèle à la voix choisie sans artefacts. |
| Style exaggeration | **15 %** | Un peu de tension ; au-delà, ça « surjoue ». |
| Speaker boost | **Activé** | Voix plus présente sur téléphone. |
| Vitesse | **1,0** (monter à 1,05 si la prise dépasse 90 s) | Cible ≈ 170 mots/min. |
| Génération | **Tout le texte en une seule fois** | Même ton du début à la fin ; regénérer en entier si un mot est mal prononcé. |
| Format de sortie | **WAV** (44,1 ou 48 kHz) si votre offre le permet, sinon MP3 192 kb/s | À enregistrer sous `videos/001-h72/voix_brute.wav`. |

À écouter avant de valider : « Inès » (bien « i-nèss »), « haricots » (sans liaison), « anti-rouille ».
Les blancs trop longs sont coupés ensuite automatiquement ; le silence de 0,6 s avant « Le ballon est vide » est
ajouté par notre outil (marqué `>` dans `script.txt`).

## 3. Carton de fin (non lu)

```
PARTIE 2 · LE FROID ↗
Qui a vidé le ballon ?
A : un voisin    B : quelqu'un qui a sa clé
Réponds en commentaire, réponse dans la Partie 2.
Fiction · conseils vérifiés le 23/10/2026
```

*Le choix A/B vise le point faible n°8 de l'analyse (commentaires quasi nuls chez la concurrence). Le carton du moteur
gère aujourd'hui « PARTIE N », le titre et la mention « vérifié » : les deux lignes A/B sont à ajouter au composant.*

## 4. Faits utilisés et sources

| # | Fait dans le texte | Source | Vérification de sécurité |
|---|---|---|---|
| 1 | Sans courant, la pompe (surpresseur) de l'immeuble s'arrête et l'eau ne monte plus aux étages. | Fiche délestage Ecowatt d'un bailleur : [mon-logis.fr (PDF)](https://www.mon-logis.fr/wp-content/uploads/2023/02/Delestage-Ecowatt.pdf) | Fait descriptif, aucun geste à risque. |
| 2 | 9 L pour une personne : réserve plausible (le guide officiel conseille 6 L par personne pour 72 h, soit 1,5 L par jour ; Ready.gov dit environ 3,8 L par jour, toilette comprise). | Guide « Tous responsables » (nov. 2025) via [DRAAF PACA (PDF)](https://draaf.paca.agriculture.gouv.fr/IMG/pdf/tous_responsables_print.pdf) ; [Géorisques, kit 72 h (PDF)](https://www.georisques.gouv.fr/sites/default/files/2022-08/KIT%2072H_A4-HD.pdf) ; [Ready.gov/water](https://www.ready.gov/water) | Ne sous-estime pas les besoins : le texte ne donne pas de « dose minimale ». |
| 3 | Quand l'eau manque, préférer les conserves riches en liquide et éviter le salé, qui donne soif. | FEMA / Croix-Rouge américaine, *Food and Water in an Emergency* : [fema.gov (PDF)](https://www.fema.gov/pdf/library/f&web.pdf) (« don't eat salty foods… eat canned foods with high liquid content ») | Sans danger. On ne dit pas que le jus *remplace* l'eau. |
| 4 | Une chasse d'eau consomme environ 9 à 12 L. | [UTC, projet « Eaux gris clair » (PDF)](https://di05.uv.utc.fr/resources/Projets-de-groupe/Memoire-des-projets/A21/Eaux_gris_clair_A21.pdf) | Ordre de grandeur (les WC récents : 6 L ou 3/6 L). « Neuf litres » reste dans la fourchette. |
| 5 | Réutiliser l'eau de lavage (eau grise) pour les toilettes ; un seau versé d'un coup vide la cuvette. | [Alberta.ca, pénuries d'eau](https://www.alberta.ca/fr/water-shortages) (réutiliser l'eau) ; même document UTC (seau versé d'un coup) | Eau grise **uniquement** pour les WC, jamais pour boire : c'est ce que dit le texte. |
| 6 | Le ballon d'eau chaude est une réserve d'eau sûre. Méthode : couper l'électricité (ou le gaz), fermer l'arrivée d'eau, ouvrir un robinet d'eau chaude (entrée d'air), vider par le robinet du bas. | FEMA, *Food and Water in an Emergency*, p. 10 « Hidden water sources » : [fema.gov (PDF)](https://www.fema.gov/pdf/library/f&web.pdf) | **Couper le disjoncteur** : sans ça, un ballon vide qui chauffe au retour du courant s'abîme, et l'eau peut brûler. Après 3 jours de panne, l'eau est froide. À remplir avant de remettre le courant. |
| 7 | 200 L : capacité courante d'un ballon électrique pour un appartement (100 à 200 L). | Capacités usuelles du commerce (fourchette standard) | Chiffre de décor, sans risque. |
| 8 | Filtrer les dépôts avec un filtre à café. | FEMA, même document, p. 11 (« strain them through… coffee filter ») | Le filtre enlève les dépôts, pas les microbes : le texte dit seulement « retient les dépôts ». |
| 9 | Ne jamais boire l'eau des radiateurs ; la faire bouillir n'enlève pas les produits chimiques. | FEMA, même document, p. 10 (« You should not use water from… radiators ») et p. 11 (« Boiling… will not remove… chemicals ») | Avertissement **protecteur**. |
| 10 | Le réservoir de chasse d'eau n'est **pas** cité comme réserve à boire. | FEMA (déconseillé), comté d'Alameda : [acgov.org (PDF)](https://www.acgov.org/ready/documents/EmergencyDrinkingWaterHandout.pdf) | Volontairement absent du texte : les sources ne sont pas d'accord. |

**Bilan : aucun conseil dangereux.** Les deux seuls gestes techniques (vider le ballon, réutiliser l'eau grise) sont
présentés avec leur limite.

## 5. Découpage visuel

Décor : appartement du 6e **en coupe** (cuisine, salle d'eau avec placard du ballon, salon), fenêtre sur la ville
noire et enneigée (neige derrière le mur du fond). Lumière : jour blafard (jour 3, matin), puis bougie/lampe torche
la nuit. Montre LCD permanente en haut à gauche : **J3 · 07:40 · 13 °C**. Au plus 2 blocs HUD en plus.
Les étiquettes n'apparaissent que sur les **plans tenus**. Temps indicatifs (à recaler sur la vraie voix).

| # | ≈ s | Phrase | Image | Caméra | HUD |
|---|---|---|---|---|---|
| 1 | 0,0 | Que feriez-vous si votre robinet crachait de l'air ? | Gros plan : robinet de cuisine ouvert, il tousse, crache un dernier filet puis de l'air. La main d'Inès sur la poignée. | Déjà en mouvement : travelling avant rapide vers le robinet → tenu. | — |
| 2 | 3,0 | Et qu'il vous restait neuf litres d'eau ? | Plan d'ensemble de la cuisine : 6 bouteilles alignées sur le plan de travail (1,5 L). | Recul + légère plongée. | Inventaire : 💧 **9 L** (surligné rouge). |
| 3 | 5,8 | Trois jours sans électricité dans toute la ville. | Fenêtre : la ville entière noire sous la neige. | Panoramique vers la fenêtre → tenu. | Montre : **J3**. Carton « H+72 · PARTIE 1 » en haut à gauche (≈ 4 s). |
| 4 | 8,6 | Sans courant, la pompe de l'immeuble s'arrête. | Coupe vers le sous-sol : le surpresseur, voyant éteint, silence. | Grue descendante le long de la colonne d'eau (immeuble en coupe). | Étiquette 3D « POMPE · ARRÊT » (rouge). |
| 5 | 11,4 | L'eau ne monte plus au sixième, chez Inès. | La colonne d'eau dessinée se vide du bas vers le haut ; on remonte jusqu'au 6e. | Grue montante → tenu sur l'appartement. | — |
| 6 | 14,2 | Inès connaît trois réserves cachées. | Inès, de face, carnet à la main (elle fait une liste). | Approche douce → tenu (plan poitrine). | Fiche « INÈS · 34 ans · infirmière de nuit · 6e étage ». |
| 7 | 16,4 | La dernière vaut deux cents litres. | Elle lève les yeux vers le placard de la salle d'eau, porte fermée. | Glissement latéral vers le placard, sans l'ouvrir. | — (la fiche disparaît) |
| 8 | 18,8 | Un : manger mouillé. | Placard de cuisine ouvert : conserves. | Travelling avant → tenu. | **Tactique 1/3 · MANGER MOUILLÉ**. |
| 9 | 20,6 | Pêches au sirop, ananas, haricots en boîte. | Elle pose les trois boîtes sur la table, une par mot. | Tenu. | Étiquette 3D sur les boîtes. |
| 10 | 23,2 | Leur jus hydrate. | Boîte de pêches ouverte, le sirop brille. | Mini zoom avant. | — |
| 11 | 24,6 | Et zéro chips, zéro saucisson. | Paquet de chips et saucisson **en fantôme rouge** barrés, poussés hors de la table. | Tenu. | Icône ✗ rouge. |
| 12 | 26,4 | Le sel donne soif. | Moodle « soif » qui s'allume puis s'éteint. | Tenu. | Moodle **soif** niveau 2. |
| 13 | 27,8 | Deux : les toilettes. | Salle d'eau en coupe, WC. | Déplacement de la cuisine vers la salle d'eau (on suit Inès qui marche). | **Tactique 2/3 · LES TOILETTES**. |
| 14 | 29,4 | Une chasse d'eau, c'est neuf litres. | **Fantôme rouge** : la chasse tirée, l'eau qui part ; les 6 bouteilles se vident en même temps. | Tenu. | Inventaire 💧 **9 L → 0 L** (fantôme, clignote). |
| 15 | 31,8 | Toute sa réserve, d'un coup. | Retour à la réalité : bouteilles intactes. | Petit recul. | Inventaire revient à **9 L**. |
| 16 | 33,6 | Alors elle se lave au-dessus d'une bassine. | Inès se lave les mains au-dessus d'une bassine en plastique, gant de toilette. | Plan de profil (visage visible), tenu. | — |
| 17 | 36,0 | Et cette eau sale finit dans la cuvette. | Elle verse la bassine dans un seau. | Tenu. | — |
| 18 | 38,4 | Versée d'un coup, la cuvette se vide. | Elle verse d'un geste ; la cuvette se vide. | Légère plongée. | Icône ✓ verte. |
| 19 | 40,8 | Trois : le ballon d'eau chaude. | Elle ouvre enfin le placard : ballon blanc de 200 L. | Travelling avant → tenu (cadre serré sur le ballon). | **Tactique 3/3 · LE BALLON**. |
| 20 | 43,0 | Deux cents litres, dans le placard. | Le ballon, éclairé par sa lampe frontale. | Tenu. | Fiche « BALLON · 200 L · eau du réseau, potable » (côté gauche). |
| 21 | 45,2 | On coupe son disjoncteur. | Tableau électrique : elle baisse le disjoncteur « CHAUFFE-EAU ». | Coupe nette (son d'impact) → tenu. | Étiquette « 1 · DISJONCTEUR ». |
| 22 | 46,8 | On ferme l'eau froide. | Elle tourne la vanne bleue sous le ballon. | Tenu. | Étiquette « 2 · EAU FROIDE ». |
| 23 | 48,4 | On ouvre un robinet d'eau chaude. | Robinet du lavabo ouvert (côté rouge) : l'air entre. | Tenu. | Étiquette « 3 · AIR ». |
| 24 | 50,4 | Et on vide par le robinet du bas. | Robinet de vidange au pied du ballon, un seau dessous. | Plongée vers le bas → tenu. | Étiquette « 4 · VIDANGE ». |
| 25 | 52,8 | Un filtre à café retient les dépôts. | Filtre à café posé sur une carafe. | Tenu. | — |
| 26 | 55,0 | Surtout, jamais l'eau des radiateurs. | **Fantôme rouge d'Inès** à genoux devant le radiateur du salon, une bouteille sous la purge. | Déplacement vers le salon → tenu. | Icône ✗ rouge + titre « DANGER ». |
| 27 | 57,4 | Elle tourne en circuit fermé depuis des années. | Coupe du radiateur : l'eau tourne dans les tuyaux, sombre. | Tenu, léger zoom. | — |
| 28 | 60,0 | Brune, pleine de produits anti-rouille. | La bouteille se remplit d'eau brune. | Gros plan. | Fiche « EAU DE RADIATEUR · non potable ». |
| 29 | 62,2 | Même bouillie, elle n'est pas potable. | La bouteille fantôme se brise et disparaît. | Recul. | — |
| 30 | 64,4 | Inès, elle, est tranquille. | La vraie Inès range ses affaires, sereine. | Tenu (plan poitrine, de face). | Montre : **18:00**. |
| 31 | 66,0 | Son ballon est plein. | Dernier regard au placard ; elle le ferme. | Tenu. | — |
| 32 | 67,4 | Elle part pour douze heures de garde. | Elle ferme la porte d'entrée **à clé** ; on voit nettement la clé tourner (objet planté). | Plan sur la porte, de l'intérieur. | Étiquette « CLÉ » sur la serrure. |
| 33 | 70,0 | Six heures du matin. Elle rentre. | Ellipse : la même porte se rouvre, lampe torche. | Coupe (souffle grave). | Montre : **J4 · 06:00 · 11 °C**. |
| 34 | 72,4 | Elle ouvre le robinet du bas. | Elle tourne le robinet de vidange, seau prêt. | Plongée → tenu. | — |
| 35 | 74,2 | Pas une goutte. | Le robinet ne donne rien. Silence. | Tenu fixe. | — |
| 36 | 75,8 | Le ballon est vide. | *(0,6 s de silence avant)* Elle tape sur le ballon : son creux. | Lent recul. | — |
| 37 | 77,4 | Le sol est sec. | Le sol du placard, parfaitement sec, à la lampe. | Plongée. | — |
| 38 | 78,8 | Quelqu'un l'a vidé, pendant sa garde. | Elle se retourne vers la porte d'entrée (visage visible, de face). | Panoramique lent vers la porte d'entrée. | — |
| 39 | 81,0 | Elle a la seule clé. | Gros plan : la clé dans sa main, puis la porte, fermée. | Tenu fixe, coupe au noir. | — |
| — | 82,5 | *(carton, non lu)* | Carton de fin (section 3). | Fixe. | Carton **PARTIE 2 · LE FROID** (à `fin+0.7`). |

À construire pour cet épisode : colonne d'eau de l'immeuble en coupe, surpresseur, ballon d'eau chaude avec robinet
de vidange, radiateur, bassine/seau, conserves, et l'effet **fantôme rouge hachuré** (nouveau dans le moteur).

---

## 6. Relecture « ado qui scrolle » et corrections

Je me mets à la place d'un ado de 15 ans qui scrolle vite. Voici les points de décrochage trouvés dans la
première version, et ce qui a été corrigé (la version ci-dessus est déjà la version corrigée).

| Moment | Où il décroche (1re version) | Correction |
|---|---|---|
| 0-5 s | La 2e phrase du hook, « Plus une goutte depuis ce matin », **répétait** la 1re : rien de neuf, il passe. | Remplacée par l'enjeu chiffré : « Et qu'il vous restait neuf litres d'eau ? ». Le chiffre devient la jauge. |
| 6-15 s | Le récap était **une explication de plomberie** (la pompe, la pression, les étages) sans raison de rester. | Récap réduit à 3 phrases, puis **promesse** : « Inès connaît trois réserves cachées. La dernière vaut deux cents litres. » Ça ouvre une boucle qui tient jusqu'à 41 s. |
| 18 s | La tactique 1 était « les glaçons ». **Incohérent** : après 72 h sans courant, le congélateur a fondu. Les commentaires l'auraient relevé (« ça a fondu, non ? »). | Remplacée par « manger mouillé » (conserves au sirop, éviter le salé), sourcée FEMA, avec des objets du quotidien (chips, saucisson). |
| 28 s | La tactique 2, « ne tirez plus la chasse », était sans chiffre, donc sans effet. | Ajout du choc chiffré « Une chasse d'eau, c'est neuf litres. Toute sa réserve, d'un coup. », relié à la jauge. |
| 45-52 s | La procédure du ballon fait **« tuto plomberie »** : c'est le principal risque de décrochage. | Quatre phrases de 4 à 6 mots en rafale, une étape = un geste + une étiquette numérotée 1-2-3-4, coupe nette sur un impact. L'attente « deux cents litres » a été posée à 16 s pour qu'on veuille voir le ballon. |
| 55 s | Les radiateurs étaient vidés par un **nouveau voisin** (« monsieur Morel »). Un personnage inconnu à 55 s, c'est de la confusion. | Voisin supprimé : c'est un **fantôme rouge d'Inès** qui fait le mauvais geste (mécanique de l'analyse). Le voisin reviendra en Partie 2. |
| 64-68 s | Sans transition, le passage au twist paraissait sortir de nulle part. | Fausse sécurité explicite (« Inès, elle, est tranquille. Son ballon est plein. ») et clé **montrée en train de tourner** (objet planté). |
| Fin | La 1re dernière phrase, « Et sa porte n'a pas été forcée », était longue et **explicative**. | « Elle a la seule clé. » : 5 mots, plus inquiétant, et le carton A/B demande « qui ? ». |

**Ce qui reste à surveiller au montage :** la rafale 45-52 s (garder chaque étiquette ≥ 1,4 s sans chevauchement :
si la voix est trop rapide, fusionner les étiquettes 2 et 3), et le silence de 0,6 s avant « Le ballon est vide ».
