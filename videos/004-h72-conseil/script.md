# H+72 — Partie 4 : « Le conseil de l'immeuble »

*Série « H+72 » (l'immeuble), épisode 4. Écrit le 26/10/2026 selon le PROMPT 09 puis le PROMPT 06 du protocole,
après relecture de `CLAUDE.md`, `qc/lecons.md`, `analyse/analyse.md` (@chroniques_flippantes),
`analyse/idees-series.md` et des textes des Parties 1, 2 et 3 (`videos/001-h72/`, `videos/002-h72-froid/`,
`videos/003-h72-lampe/`).*

**Durée visée : ≈ 87 s de récit + carton lu** (230 mots, ≈ 177 mots/min comme les Parties 1 à 3 ; la coupe des
blancs raccourcira). Personnages : **Inès**, 34 ans, infirmière de nuit au 6e, méthodique (elle fait des listes),
pince-sans-rire ; **monsieur Morel**, ≈ 70 ans, voisin du 5e, râleur de mauvaise foi. Mêmes voix que les Parties 2 et 3.
Nouveaux personnages **muets** : la famille du 7e (un couple, la poussette de la Partie 3 ; le père est diabétique),
deux ou trois voisins d'autres étages à la réunion.

**Raccord exact avec la Partie 3.** La Partie 3 se termine sur : « Et elle est entre eux. » → Inès au palier du 7e,
de face, sa lampe éteinte serrée dans la main ; au-dessus, la porte du toit entrouverte et un faisceau blanc ; en bas,
un faisceau blanc qui se rallume. Montre **J4 · 23:10 · 11 °C**.
La Partie 4 démarre **sur cette même image**, les deux faisceaux visibles dès la 1re seconde.

**Ce que les personnages (et le spectateur) savent déjà, et rien de plus :**
- panne générale depuis le jour 1 ; plus d'eau courante au 6e ; 11 °C chez Inès ;
- son ballon de 200 L a été vidé pendant sa garde, **serrure jamais forcée** (Partie 2 : « La serrure n'est pas forcée. ») ;
- un type **avec une lampe torche et les clés du 6e** revend cette eau **20 € le bidon** ; Morel en a acheté 10 ;
- Partie 3 : elle a appelé le **17** (« Quelqu'un me suit. 7e étage. ») et frappé chez les voisins du 7e, qui n'ont pas
  encore ouvert ; les **2 éclats** sont un signal : ils sont **deux** (une lampe en bas, une à la porte du toit).

**Réponse au choix A/B de la Partie 3** (« elle crie pour réveiller l'immeuble » / « elle éteint sa lampe et se tait ») :
**les deux branches sont montrées** : B en **fantôme rouge** (elle se tait dans le noir ; personne ne sait qu'elle est
là, sauf eux, qui l'ont vue frapper et qui ont des lampes), puis notre signal **« STOP »** (image noir et blanc de la
Partie 3), cette fois **dit à voix haute : « Stop. On rembobine. »** (demande du 26/10, comme la chaîne de référence),
suivi de **1,5 s de vrai son de rembobinage** (la mauvaise branche rejouée à l'envers en accélérant, voir section 5),
puis A en vrai. **La bonne réponse est A** : on fait du bruit pour attirer
l'attention (sources en section 4). Se taire ne cache rien à quelqu'un qui sait déjà où l'on est.

---

## 1. Le texte dans l'ordre (référence : qui dit quoi)

N = narrateur · I = Inès · M = Morel. **Ce bloc ne se colle pas dans ElevenLabs** : il sert à relire l'épisode
(les textes à coller sont en section 2).

```
N  Que feriez-vous si on vous coinçait dans l'escalier ?
N  Une lampe au-dessus. Une en dessous.
N  Jour quatre sans électricité dans la ville.
N  Au sixième, on a volé l'eau d'Inès.
N  Le voleur a les clés du sixième.
N  Et ce soir, il a un complice.
N  Si elle éteint et se tait…
N  Personne ne sait qu'elle est là.
N  Sauf eux.
N  Stop. On rembobine.
   (1,5 s : son du rembobinage)
N  Elle crie.
I  Au voleur ! Au septième !
N  Un : faites du bruit.
N  Un voleur veut du silence.
N  Des cris, des portes, des lampes.
N  Les deux lampes s'enfuient.
N  La police arrive. Escalier vide.
M  Encore vous ? Il est vingt-trois heures !
I  Bonsoir à vous aussi.
N  Minuit, chez les voisins du septième.
N  Inès réunit l'immeuble.
N  Deux : la liste des fragiles.
N  Qui vit seul. Qui est malade.
N  La mairie tient le même registre.
M  Je ne suis pas fragile.
I  Vous avez soixante-dix ans, Morel.
N  Trois : les médicaments.
N  Morel veut les cachets d'un voisin.
M  Il a le même cœur que moi.
N  Jamais ceux d'un autre.
N  Même avec les mêmes symptômes.
N  L'insuline entamée tient quatre semaines sans frigo.
N  Inès note tout. Qui a quoi.
N  L'eau, les piles, sa trousse d'infirmière.
N  La liste reste au septième, sur la table.
N  Elle redescend enfin dormir.
N  Sous sa porte, un papier.
N  Écrit dessus : on sait ce que tu as.
N  Vous vous souvenez de la serrure ?
N  Jamais forcée. Ils ont une clé.
N  Et ce papier…
N  C'est une page de sa liste.
N  Il était à la réunion.
```

*Gabarit du PROMPT 06 et du PROMPT 09, vérifié avec l'outil du projet (`lire_script` de `tools/script_format.py`) :
**230 mots** (narrateur 199, Inès 13, Morel 18 ; fourchette 200-260), **43 phrases de 2 à 8 mots** (+ carton de 22 mots),
aucune indication de mise en scène dans le texte lu, chaque réplique dite par la voix de son personnage :*
- *hook de 2 phrases « Que feriez-vous si… » au « vous » (8 + 6 mots, ≈ 5 s), avec les deux lampes visibles dès la
  1re image ;*
- *récap de 4 phrases (≈ 10 s) : un nouveau venu comprend tout sans avoir vu les Parties 1 à 3 ;*
- *réponse au choix A/B : branche B en fantôme, « Stop. On rembobine. » + son de rembobinage, branche A en vrai (≈ 10 s) ;*
- *3 tactiques « Un / Deux / Trois » : faire du bruit, la liste des personnes fragiles, les médicaments ;*
- *scènes comiques Inès / Morel (« Il est 23 heures ! », « Je ne suis pas fragile. », « Il a le même cœur que moi. ») ;*
- *objet planté pour le twist : **la liste**, laissée sur la table du 7e (≈ 68 s) ;*
- *fausse sécurité : l'immeuble s'est organisé, elle redescend enfin dormir ;*
- *rappel « Vous vous souvenez de la serrure ? » (Partie 2 : la serrure n'était pas forcée) ;*
- *twist : le mot est écrit sur une page de sa liste → le complice est un voisin ; dernière phrase de 5 mots :
  « Il était à la réunion. »*

**Pourquoi ça peut faire des vues :** la réponse au choix est nette et utile (crier, ça marche, et on dit pourquoi) ;
les deux « je ne savais pas » à enregistrer : le registre des personnes fragiles de la mairie, et l'insuline qui tient
4 semaines sans frigo. Morel garde le ton qui fait commenter. Et la fin transforme la série en enquête : **qui, parmi
les voisins ?** Chacun va avancer son suspect en commentaire (indice visuel caché, section 5, plan 20).

## 2. Les textes à coller dans ElevenLabs (une voix chacun)

**Mêmes voix et mêmes réglages que la Partie 3** pour chaque personnage (signature sonore de la série).

### Texte 1 · Narrateur (fichier `narrateur.mp3`)

```
Que feriez-vous si on vous coinçait dans l'escalier ?
Une lampe au-dessus. Une en dessous.
Jour quatre sans électricité dans la ville.
Au sixième, on a volé l'eau d'Inès.
Le voleur a les clés du sixième.
Et ce soir, il a un complice.

Si elle éteint et se tait…
Personne ne sait qu'elle est là.
Sauf eux.
Stop. On rembobine.
Elle crie.

Un : faites du bruit.
Un voleur veut du silence.
Des cris, des portes, des lampes.
Les deux lampes s'enfuient.
La police arrive. Escalier vide.

Minuit, chez les voisins du septième.
Inès réunit l'immeuble.
Deux : la liste des fragiles.
Qui vit seul. Qui est malade.
La mairie tient le même registre.

Trois : les médicaments.
Morel veut les cachets d'un voisin.
Jamais ceux d'un autre.
Même avec les mêmes symptômes.
L'insuline entamée tient quatre semaines sans frigo.

Inès note tout. Qui a quoi.
L'eau, les piles, sa trousse d'infirmière.
La liste reste au septième, sur la table.
Elle redescend enfin dormir.
Sous sa porte, un papier.
Écrit dessus : on sait ce que tu as.
Vous vous souvenez de la serrure ?
Jamais forcée. Ils ont une clé.
Et ce papier…
C'est une page de sa liste.
Il était à la réunion.

Le complice est un voisin. Inès…
A : elle lit le mot devant tous.
B : elle se tait et observe.
Répondez en commentaire !
```

*Les 4 dernières lignes sont le carton de fin : même voix, même fichier, à la suite du récit.*

### Texte 2 · Inès (fichier `ines.mp3`) — modèle expressif, avec balises de ton

```
[shouting] Au voleur ! Au septième !
[dry] Bonsoir à vous aussi.
[deadpan] Vous avez soixante-dix ans, Morel.
```

### Texte 3 · Morel (fichier `morel.mp3`) — modèle expressif, avec balises de ton

```
[annoyed] Encore vous ? Il est vingt-trois heures !
[offended] Je ne suis pas fragile.
[stubborn] Il a le même cœur que moi.
```

*Les balises (en anglais, langue que le modèle comprend le mieux) ne servent qu'à ElevenLabs : `script.txt` garde le
texte affiché en sous-titres, sans balises. Les nombres sont en lettres pour une lecture sûre ; les sous-titres les
affichent en chiffres.*

### Réglages

| | Narrateur (récit + carton) | Inès | Morel |
|---|---|---|---|
| Voix | **la même que les Parties 1 à 3** | **la même que les Parties 2 et 3** | **la même que les Parties 2 et 3** |
| Modèle | **Eleven Multilingual v2**, sans balises | **modèle expressif** (Eleven v3 ou plus récent), balises de ton | **modèle expressif**, balises de ton |
| Réglages | Stabilité 45 %, Similarity 75 %, Style 15 %, Speaker boost activé, vitesse 1,0 | **Creative** ou **Natural** (pas Robust : il ignore les balises) | **Creative** ou **Natural** |
| Génération | tout le texte d'un coup | tout le texte d'un coup, **2 ou 3 prises** : garder la meilleure | idem |

À écouter avant de valider :
- narrateur : « Sauf eux. » bas et lent ; « Stop. » sec, coupé net (comme en Partie 3), puis « On rembobine. » vif,
  presque complice ; ne laissez pas de blanc après : l'outil ajoute lui-même 1,5 s pour le son ; « Écrit dessus : on sait ce
  que tu as. » avec un temps après les deux-points ; « Il était à la réunion. » lent et bas ;
- Inès : « Au voleur ! Au septième ! » **vraiment crié**, à pleine voix (c'est la bonne réponse : il faut que ça
  porte) ; « Vous avez soixante-dix ans, Morel. » **impassible** ;
- Morel : « Il est vingt-trois heures ! » outré (écho de « Il est 6 heures » de la Partie 2) ; « Je ne suis pas
  fragile. » vexé ; « Il a le même cœur que moi. » têtu, sûr de lui (c'est la blague).

Les silences de 0,6 s avant « Il était à la réunion » et « Le complice est un voisin » (marqués `>` dans `script.txt`)
et de 1,5 s avant « Elle crie. » (marqué `>>`, la place du son de rembobinage) sont ajoutés par l'outil.

**Dépôt :** téléchargez les 3 MP3, nommez-les `narrateur.mp3`, `ines.mp3`, `morel.mp3` et
glissez-les dans `videos/004-h72-conseil/` (leçon du 25/10 : pas dans le dossier d'une autre partie).

## 3. Carton de fin (lu par le narrateur, fin du texte 1)

```
PARTIE 5 ↗
Le complice est un voisin. Inès…
A : elle lit le mot devant tous
B : elle se tait et observe
Réponds en commentaire, réponse dans la Partie 5.
Fiction · conseils vérifiés le 26/10/2026
```

*Grand carton A/B plein écran, ≥ 4 s, avec ses sons, montre masquée (leçons du 24/10), à `fin+0.7`. Aucune réponse
évidente : A fait fuir le complice (mais il saura qu'elle sait), B permet de le démasquer (mais elle reste seule avec
la menace). Deuxième question pour le commentaire épinglé : « Le complice, c'est qui ? »*

## 4. Faits utilisés et sources

| # | Fait dans le texte | Source | Vérification de sécurité |
|---|---|---|---|
| 1 | Menacé, **faire du bruit** pour attirer l'attention (crier, frapper, réveiller les voisins) ; le voleur cherche la discrétion. | Polices : [Kingston Police, Personal safety](https://www.kingstonpolice.ca/learn/personal-safety/) (le bruit attire l'attention sur l'endroit et peut faire fuir l'agresseur) ; [Police de Bonn, Crime in public spaces](https://bonn.polizei.nrw/en/article/crime-in-public-spaces) (crier, s'adresser directement aux témoins) ; [conseils de la police du Bedfordshire, Luton Today](https://lutontoday.co.uk/lifestyle/stay-safe-on-your-journey-to-school-2368704) (« faire autant de bruit que possible ») ; même idée chez GISF (Partie 3) | Sans danger : elle crie **depuis un palier**, sans aller vers eux, après avoir appelé le 17. Elle crie quelque chose de précis (« Au voleur ! Au 7e ! ») pour que les voisins sachent quoi faire et où. Le mauvais choix (se taire dans le noir) n'est montré qu'en **fantôme**. |
| 2 | **Registre des personnes fragiles** : la mairie tient un registre nominatif des personnes âgées et handicapées vivant à domicile, inscrites à leur demande, pour les aider en cas d'alerte. | Art. L121-6-1 du Code de l'action sociale et des familles ; [FAQ registres communaux, préfecture de Tarn-et-Garonne / DGS (PDF)](https://tarn-et-garonne.gouv.fr/contenu/telechargement/33827/226062/file/faq_-_les_registres_communaux_de_personnes_vulnerables.pdf) ; [sante.fr, recensement des personnes fragiles](https://www.sante.fr/node/3966009) | Exact et utile : on peut y inscrire un proche (avec son accord). Ce sera rappelé dans le commentaire épinglé. La liste d'Inès est une initiative de voisins, inspirée du registre (on ne dit pas qu'elle le remplace). |
| 3 | **Ne jamais prendre les médicaments prescrits à un autre**, même avec les mêmes symptômes. | [ANSM, fiche bon usage (archive, PDF)](https://archive.ansm.sante.fr/var/ansm_site/storage/original/application/fd6f9db222b33b8800cfce899bd690fb.pdf) ; [Vidal, bien utiliser les médicaments](https://www.vidal.fr/medicaments/utilisation/prendre-traitement/bien-utiliser-medicaments.html) ; [Groupe VYV, bon usage du médicament (PDF)](https://www.groupe-vyv.fr/wp-content/uploads/2021/05/Bon-usage-du-medicament_Guide_Groupe-VYV.pdf) | Sans danger. Le mauvais geste de Morel est montré en **fantôme rouge** et contredit à l'image et dans le texte. |
| 4 | **L'insuline entamée se garde environ 4 semaines à température ambiante**, sans frigo (loin du gel et de la chaleur). | [Université de Genève / MSF, étude publiée dans PLOS ONE](https://www.unige.ch/medias/2021/stocker-son-insuline-a-des-temperatures-elevees-cest-possible) (stable 4 semaines entre 25 et 37 °C) ; [Cochrane, conservation de l'insuline humaine](https://www.cochrane.org/fr/CD015385/ENDOC_conditions-de-temperature-et-de-conservation-pour-linsuline-humaine) ; notices des fabricants (en général 4 semaines après ouverture) | Vrai pour un stylo ou un flacon **entamé** ; la durée exacte dépend du produit (**la notice fait foi**, mention dans la fiche à l'écran et dans le commentaire épinglé). À 11 °C chez Inès, on est dans les clous ; **jamais congelée**. |
| 5 | Le 17 (police secours) appelé en Partie 3 ; la police arrive après la fuite. | Partie 3 (sources des polices citées) | Montre l'appel comme utile, même si la police arrive après : on ne dit jamais « inutile d'appeler ». |
| 6 | Morel ≈ 70 ans, diabète du voisin du 7e, la liste, le mot sous la porte. | Fiction | Aucun conseil. |

**Bilan : aucun conseil dangereux.** Les trois tactiques sont des recommandations officielles ou de police ; les deux
mauvais gestes (se taire dans le noir, prendre les cachets d'un autre) sont montrés en fantôme et contredits.

## 5. Découpage visuel

Lumière : **nuit sans courant** (leçons du 24/10) : cage d'escalier presque noire, pénombre bleutée, faisceaux blancs
froids des deux inconnus ; puis, quand l'immeuble se réveille, **sources chaudes** qui s'allument une à une (bougies,
lampes des voisins). La réunion du 7e : salon éclairé aux bougies et lanternes, chaud et rassurant (contraste avec la
cage). Inès, ses gestes et les objets clés restent lisibles sur téléphone.
Montre LCD permanente : **J4 · 23:10 · 11 °C**, puis **00:00 (J5)**, puis **02:00**. Au plus 2 blocs HUD en plus.
Temps indicatifs (≈ 177 mots/min), à recaler sur la vraie voix.

**Répliques :** le personnage qui parle est visible, visage tourné vers la caméra (face ou trois-quarts), bouche qui
bouge avec sa voix ; sous-titres avec son nom et sa couleur (Inès cyan clair, Morel orangé, narrateur blanc).
**Les deux inconnus ne sont jamais montrés** : seulement leurs faisceaux, leurs pas, la main gantée (Partie 3, plan 6).

Décor : celui de la Partie 3 (cage d'escalier 4e → toit, palier du 7e avec poussette et bougies, porte du toit,
appartement et palier du 6e) **+ l'intérieur de l'appartement du 7e** (salon : table, bougies, lanternes, chaises en
cercle ; à l'échelle des personnages, leçon du 25/10) **+ la porte d'Inès vue de l'intérieur** (le papier glissé
dessous). Toute porte franchissable donne sur un espace construit.

| # | ≈ s | Voix | Phrase | Image | Caméra | HUD |
|---|---|---|---|---|---|---|
| 1 | 0,0 | N | Que feriez-vous si on vous coinçait dans l'escalier ? | **Dernière image de la Partie 3** : Inès au 7e, de face, lampe éteinte serrée ; faisceau au-dessus (porte du toit), faisceau en dessous. | Déjà en mouvement : lent recul vers le plan d'ensemble de la cage (les 3 niveaux) → tenu. | Montre J4 · 23:10 · 11 °C. |
| 2 | 3,0 | N | Une lampe au-dessus. Une en dessous. | Le faisceau du haut s'allume sur « au-dessus », celui du bas sur « en dessous ». | Tenu. | Étiquettes « 1 » (haut) et « 2 » (bas), courtes. |
| 3 | 5,2 | N | Jour 4 sans électricité dans la ville. | Fenêtre du palier : ville noire sous la neige. | Glissement vers la fenêtre. | Carton « H+72 · PARTIE 4 » (≈ 4 s). |
| 4 | 7,9 | N | Au 6e, on a volé l'eau d'Inès. | Placard du ballon vide (raccord P1), fiche barrée. | Coupe → tenu. | Fiche « BALLON · 0 L ». |
| 5 | 10,5 | N | Le voleur a les clés du 6e. | Gros plan : trousseau qui tinte, main gantée, faisceau blanc (raccord P3, plan 6). | Tenu fixe. | — |
| 6 | 13,1 | N | Et ce soir, il a un complice. | Retour cage : les deux faisceaux clignotent **2 éclats** chacun. | Coupe → tenu. | Étiquette « 2 ÉCLATS ». |
| 7 | 15,7 | N | Si elle éteint et se tait… | **Fantôme rouge** : Inès accroupie dans le coin du palier, immobile. | Tenu, plan moyen. | Icône ✗ rouge « B ». |
| 8 | 18,0 | N | Personne ne sait qu'elle est là. | Fantôme : derrière les portes du 7e, tout reste noir et silencieux. | Tenu. | — |
| 9 | 20,3 | N | Sauf eux. | Fantôme : les deux faisceaux arrivent sur le palier et se posent sur elle. | Tenu fixe. | — |
| 10 | 21,2 | N | Stop. On rembobine. | **Signal « STOP »** : « clac » de bouton sur « Stop », l'image passe en noir et blanc et tremble ; sur « On rembobine », les images de la branche B **défilent à l'envers** de plus en plus vite (les faisceaux reculent, Inès se relève). | Tenu (l'image recule seule). | Mot « ◀◀ STOP » en grand. |
| 10b | 22,4 | — | *(1,5 s sans voix)* | **Son de rembobinage** (section « Le son du rembobinage » ci-dessous) ; l'image recule jusqu'à la dernière image de la Partie 3 ; deuxième « clac » d'arrêt, la couleur revient d'un coup. | Coupe (`coupe: true`) → tenu. | Puis « A ✓ ». |
| 10c | 23,9 | N | Elle crie. | Inès debout au palier, elle prend sa respiration. | Tenu. | — |
| 11 | 24,8 | I | Au voleur ! Au 7e ! | Gros plan, trois-quarts, elle crie à pleine voix, lampe rallumée levée (expression **décidé**, bouche grande ouverte). | Tenu, plan poitrine. | — |
| 12 | 24,1 | N | 1 : faites du bruit. | Elle tape du poing sur les portes du palier, une à une. | Recul → tenu sur le palier. | **Tactique 1/3 · FAITES DU BRUIT**. |
| 13 | 25,7 | N | Un voleur veut du silence. | Le faisceau du bas hésite, recule d'une marche. | Plongée dans la cage → tenu. | — |
| 14 | 27,7 | N | Des cris, des portes, des lampes. | Plan d'ensemble de la cage : à chaque étage, une porte s'ouvre et une lumière **chaude** s'allume (6 sons de portes et verrous, voix). | Grand recul → tenu. | — |
| 15 | 29,9 | N | Les deux lampes s'enfuient. | Le faisceau du bas descend vite ; celui du toit s'éteint, la porte du toit claque. | Tenu. | Moodle **panique** qui baisse. |
| 16 | 31,5 | N | La police arrive. Escalier vide. | Hall : lueur bleue (gyrophare) par la porte vitrée ; deux lampes de policiers balaient un escalier vide. | Coupe → tenu. | Montre **23:40**. |
| 17 | 33,5 | M | Encore vous ? Il est 23 heures ! | Palier du 6e : Morel monté du 5e, en robe de chambre et bonnet, couverture sur les épaules (expression **décidé**, outré). | Plan à deux (Inès et Morel de trois-quarts). | — |
| 18 | 35,8 | I | Bonsoir à vous aussi. | Inès, blasée (expression **fatigue**). | Glissement vers Inès → tenu. | — |
| 19 | 37,4 | N | Minuit, chez les voisins du 7e. | Salon du 7e aux bougies : 6 voisins en cercle (dont la famille, Morel). | Coupe → entrée lente dans la pièce → tenu. | Montre **J5 · 00:00**. |
| 20 | 39,7 | N | Inès réunit l'immeuble. | Inès debout, carnet en main, face aux voisins. **Indice caché** : un voisin du 4e, au fond, porte **les mêmes gants** que la main du plan 5 (jamais commenté, jamais étiqueté). | Tenu, plan large de la pièce. | — |
| 21 | 40,9 | N | 2 : la liste des fragiles. | Gros plan du carnet : elle écrit un titre souligné. | Tenu. | **Tactique 2/3 · LA LISTE DES FRAGILES**. |
| 22 | 42,9 | N | Qui vit seul. Qui est malade. | Les voisins lèvent la main un à un (une dame âgée, le père du 7e). | Panoramique lent → tenu. | — |
| 23 | 45,2 | N | La mairie tient le même registre. | Fiche dessinée : « REGISTRE · MAIRIE / CCAS ». | Tenu. | Fiche « REGISTRE DES PERSONNES FRAGILES · MAIRIE (CCAS) · sur demande » (côté opposé aux visages). |
| 24 | 47,4 | M | Je ne suis pas fragile. | Morel, bras croisés (expression **décidé**, vexé). | Glissement vers Morel → tenu. | — |
| 25 | 49,4 | I | Vous avez 70 ans, Morel. | Inès, impassible ; elle écrit « MOREL » sans lever les yeux. | Plan à deux. | — |
| 26 | 51,3 | N | 3 : les médicaments. | Sur la table : boîtes de médicaments posées en tas. | Tenu. | **Tactique 3/3 · LES MÉDICAMENTS**. |
| 27 | 52,6 | N | Morel veut les cachets d'un voisin. | **Fantôme rouge** : Morel prend une boîte qui n'est pas à lui et l'ouvre. | Tenu, de profil (le fantôme à côté de la table, jamais sur l'axe caméra → sujet). | Icône ✗ rouge. |
| 28 | 54,9 | M | Il a le même cœur que moi. | Le vrai Morel, sûr de lui, la main tendue vers la boîte (expression **sourire**). | Plan à deux (Morel, Inès). | — |
| 29 | 57,5 | N | Jamais ceux d'un autre. | Inès reprend la boîte et la rend à son propriétaire. | Tenu. | Icône ✓ verte. |
| 30 | 59,1 | N | Même avec les mêmes symptômes. | Deux boîtes côte à côte, deux prénoms différents sur les étiquettes. | Gros plan d'objet (caméra du côté opposé aux personnages). | — |
| 31 | 61,1 | N | L'insuline entamée tient 4 semaines sans frigo. | Le père du 7e montre son stylo à insuline, inquiet ; frigo ouvert et noir derrière lui ; Inès le rassure. | Tenu, plan poitrine. | Fiche « INSULINE ENTAMÉE · ≈ 4 SEMAINES À TEMPÉRATURE AMBIANTE · jamais congelée · voir la notice ». |
| 32 | 63,7 | N | Inès note tout. Qui a quoi. | Gros plan du carnet : colonnes « NOM · ÉTAGE · EAU · MÉDICAMENTS ». | Tenu. | — |
| 33 | 66,0 | N | L'eau, les piles, sa trousse d'infirmière. | Elle écrit sa propre ligne : « INÈS · 6e · trousse ». | Tenu. | — |
| 34 | 68,2 | N | La liste reste au 7e, sur la table. | **Objet planté** : le carnet ouvert sur la table, entre les bougies ; les voisins se lèvent autour. | Recul → tenu. | Étiquette « LA LISTE » (≥ 1,4 s). |
| 35 | 71,2 | N | Elle redescend enfin dormir. | Inès descend l'escalier, une voisine éclaire sa marche (cage maintenant chaude et calme). | On la suit → tenu. | Montre **02:00**. |
| 36 | 72,8 | N | Sous sa porte, un papier. | Entrée d'Inès, vue de l'intérieur : un papier plié glisse sur le sol. | Tenu fixe, gros plan. | — |
| 37 | 74,8 | N | Écrit dessus : on sait ce que tu as. | Gros plan du papier déplié, écriture au feutre noir. | Tenu fixe. | Le papier est l'image (pas de fiche en plus). |
| 38 | 77,7 | N | Vous vous souvenez de la serrure ? | **Flash** de la Partie 2 (teinte froide) : la serrure intacte. | Coupe → tenu. | — |
| 39 | 80,0 | N | Jamais forcée. Ils ont une clé. | Retour : Inès regarde sa porte, puis le verrou (expression **peur**). | Tenu. | — |
| 40 | 82,3 | N | Et ce papier… | Elle retourne le papier : des lignes de carreaux, un bord arraché. | Gros plan, tenu. | — |
| 41 | 83,6 | N | C'est une page de sa liste. | Raccord : le carnet du plan 34, une page arrachée ; le papier s'y ajuste. | Tenu fixe. | — |
| 42 | 86,4 | N | Il était à la réunion. | *(0,6 s de silence avant)* Flash du salon du 7e : les visages des voisins, un par un, à la lumière des bougies (dont le voisin aux gants, sans insister). Coupe au noir. | Panoramique lent → noir. | — |
| — | 89 | N | *(carton, lu par le narrateur)* | Carton A/B plein écran (section 3). | Fixe. | Carton **PARTIE 5** à `fin+0.7`, montre masquée. |

À construire pour cet épisode :
- décor : **salon de l'appartement du 7e** (table, chaises en cercle à l'échelle des personnages, bougies, lanternes,
  frigo ouvert et éteint) ; entrée d'Inès vue de l'intérieur ; hall de l'immeuble avec lueur de gyrophare ;
- **6 à 8 voisins muets** (variante « humain », apparences variées : dame âgée, couple du 7e, voisin du 4e aux gants),
  à valider sur le banc `banc-humains` avant l'épisode (leçon du 24/10 : une image d'essai avant tout nouveau style) ;
- objets : carnet d'Inès (pages lisibles, page arrachée), boîtes de médicaments étiquetées, stylo à insuline, papier
  plié qui glisse sous la porte, gants du plan 5 ;
- effet « portes qui s'ouvrent étage par étage » (plan 14) avec lumières chaudes ;
- réutilisés : faisceaux des inconnus, effet « STOP », fantôme rouge, cage d'escalier de la Partie 3 ;
- **image qui recule** pendant le STOP (plans 7-9 rejoués à l'envers en accélérant, calés sur le son).

**Le son du rembobinage** (nouveau dans le moteur, 26/10, réutilisable à chaque STOP) : dans `donnees.ts`,
`retours: [{ de: "stop", a: "crie", depuis: "b1" }]` → `tools/mix.py` reprend **l'audio réel de la branche B**
(voix + bruitages, de « Si elle éteint » à « Sauf eux ») et le rejoue **à l'envers en accélérant** (×1 → ×4-12 :
voix aiguës et incompréhensibles), avec le scintillement de la bande, un moteur qui monte dans les aigus et du
souffle ; il démarre sur « Stop. » (étouffé sous « On rembobine », protection de la voix) et s'entend en plein pendant
la pause de 1,5 s. Plus deux bruitages earshot : `click/thock` + `cut_hit/punch` sur « Stop » (le bouton), et
`click/thock` juste avant « Elle crie » (l'arrêt de la bande). Essai validé à l'oreille d'earshot sur la bande-son de
la Partie 3 (« cassette rewind sound effect » : 1er sur 322 descriptions, z +4,2) :
`qc/004-h72-conseil/essai-rembobinage.wav`.

---

## 6. Relecture « ado qui scrolle » et corrections

| Moment | Où il décroche (1re version) | Correction |
|---|---|---|
| 0-5 s | Le hook « deux lampes vous encerclaient » sonnait faux (deux, ce n'est pas un cercle). | « Que feriez-vous si on vous coinçait dans l'escalier ? Une lampe au-dessus. Une en dessous. » : une image claire, et chaque lampe s'allume sur son mot. |
| 15-22 s | La réponse au choix arrivait sans dire **pourquoi** se taire est une erreur. | « Personne ne sait qu'elle est là. Sauf eux. » : on comprend en 2 phrases que le silence protège les voleurs, pas elle. |
| 21-24 s | (Retour du 26/10) « Stop. » seul et un simple bruit de bande : le retour en arrière ne se sentait pas. | « Stop. On rembobine. » dit à voix haute, puis 1,5 s de vrai rembobinage (la branche rejouée à l'envers, image et son). |
| 22-32 s | « Faites du bruit » restait un slogan. | Le résultat est montré : les portes s'ouvrent étage par étage, les lumières chaudes s'allument, les lampes s'enfuient. Et une phrase-raison : « Un voleur veut du silence. » |
| 31 s | En Partie 3, elle avait appelé le 17 : on se serait demandé où était la police. | « La police arrive. Escalier vide. » (on n'abandonne pas le fil, et l'appel reste utile). |
| 37-60 s | La réunion pouvait faire « cours » pendant 25 s, sans menace. | Trois répliques de Morel (la vanne de la Partie 2 revient) ; un **fantôme** au milieu (les cachets) ; et l'**indice caché** des gants pour ceux qui regardent bien (relance la menace en image, sans un mot). |
| 61 s | « Entamée, l'insuline… » : on ne comprenait pas le premier mot. | « L'insuline entamée tient 4 semaines sans frigo. » + fiche « voir la notice ». |
| 63-70 s | Le twist (la page de la liste) sortait de nulle part. | Objet planté : elle écrit **sa propre ligne** (« sa trousse d'infirmière ») et **la liste reste sur la table**, avec étiquette. |
| 72-87 s | Le mot sous la porte ne disait rien à un nouveau venu. | Rappel « Vous vous souvenez de la serrure ? Jamais forcée. » (ils peuvent entrer), puis la page arrachée → « Il était à la réunion. » |
| Carton | « Vous changez la serrure ? » : réponse évidente, pas de débat. | Dilemme sans bonne réponse évidente : **lire le mot devant tous** ou **se taire et observer**. |

**À surveiller au montage :** les deux faisceaux lisibles sur téléphone sans brûler l'image (leçons sur les lampes) ;
Inès jamais de dos quand elle parle ; la réunion (plans 19-34) cadrée avec les aides `aDeux` / `enPied` (≥ 4,3 m),
personnages assis à l'échelle des chaises (leçon du 25/10) ; aucune boîte ni bougie entre la caméra et les visages
(leçons du 24/10) ; le carnet et le papier lisibles en gros plan pleine résolution ; l'indice des gants **discret**
(visible si on cherche, jamais étiqueté) ; le fantôme de Morel à côté de la table, jamais sur l'axe caméra → sujet.

---

## 7. Voix enregistrée

*Reçue le 26/10/2026 vers 18 h 35 (heure de Paris) : `narrateur.mp3`, `ines.mp3`, `morel.mp3`, déposés sur le bureau
puis rangés ici. Morel dit « Il a le même cœur **comme** moi » (vérifié par Vosk contraint : 100 %) : gardé tel quel,
sous-titres adaptés dans `script.txt` (français familier, cohérent avec le personnage). Récit 83,4 s ; pause du
rembobinage 1,55 s.*

*Vidéo finale : `final.mp4` (92,8 s, 1080×1920, 30 i/s, −14,01 LUFS, true peak −1,39 dB), copiée dans
« Vidéos TikTok » sur le bureau (`004-h72-conseil.mp4`).*
