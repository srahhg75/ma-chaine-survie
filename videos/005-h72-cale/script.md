# H+72 — Partie 5 : « La cale » (DERNIER ÉPISODE de la série)

*Série « H+72 » (l'immeuble), épisode 5 et dernier. Écrit le 27/10/2026 selon le PROMPT 06 du protocole (gabarit dans
`qc/lecons.md`, leçon du 24/10), après relecture de `CLAUDE.md`, `qc/lecons.md`, `analyse/analyse.md`,
`analyse/cadrages.md`, `analyse/idees-series.md` et des textes des Parties 1 à 4. Fin réécrite le même jour à la
demande de la chaîne : « je veux arrêter la série ».*

**Durée visée : ≈ 86 s de récit + carton lu** (255 mots, ≈ 177 mots/min ; la coupe des blancs raccourcira).
Personnages : **Inès** (34 ans, infirmière de nuit, 6e, méthodique, pince-sans-rire) ; **monsieur Morel** (≈ 70 ans,
5e, râleur). Mêmes voix que les Parties 2 à 4. Muets : le **voisin du 4e** (bonnet gris, gants noirs, Partie 4),
deux policiers, le voleur (capuche, visage jamais montré).

**Raccord exact avec la Partie 4.** Fin de la Partie 4 : « Il était à la réunion. » → flash des 5 visages, dernier
plan sur les mains gantées du voisin du 4e, coupe au noir. Avant ce flash : Inès dans son entrée, le papier déplié,
la page arrachée. Montre **J5 · 02:00 · 11 °C**. La Partie 5 démarre **sur Inès dans son entrée, papier en main, à
02:00** (le flash était une pensée).

**Accroche : « chiffre choc »** (la Partie 4 ouvrait sur « Que feriez-vous si… », règle d'alternance du 27/10).

**Ce que les personnages savent déjà :** panne depuis le jour 1 ; ballon de 200 L vidé pendant sa garde, serrure
jamais forcée ; un type avec lampe torche et **clés du 6e** revend l'eau 20 € le bidon ; ils sont **deux** (signal
« 2 éclats ») ; Inès a crié, l'immeuble s'est réveillé, la police est venue ; réunion au 7e : **la liste** (qui a
quoi ; sa ligne : « INÈS · 6e · trousse ») laissée sur la table ; à 2 h, sous sa porte : « on sait ce que tu as »,
écrit sur une page de la liste. **Indice caché** (Partie 3 plan 6 et Partie 4 plan 20) : les gants noirs.

**Réponse au choix A/B de la Partie 4** (« elle lit le mot devant tous » / « elle se tait et observe ») : A en
**fantôme rouge** (le complice est prévenu : on ne l'attrapera jamais), puis « Stop. On rembobine. » + son de
rembobinage, puis **B en vrai**. On ne confronte pas seul un suspect : on se protège, on garde la preuve, on passe
par la police.

**Fin de la série :** le complice est démasqué (le voisin du 4e, payoff des gants) ; il manque la clé du 6e → le
voleur est à la porte d'Inès, **la cale tient** (payoff de la tactique 1), elle crie (tactique de la Partie 4), il est
pris avec la clé. Épilogue : jour 6, le courant revient, et le robinet de la Partie 1 qui « crachait de l'air »
redonne de l'eau. **Pas de cliffhanger, pas de choix A/B** : carton de fin de série avec une question pour les
commentaires.

**Rembobinage raccourci (retour du 27/10 : « trop long ») :** la pause `>>` passe de 1,5 s à **0,6 s**
(`tools/script_format.py`) et le son démarre sur « rembobine » au lieu de « Stop » :
`retours: [{ de: "stop:rembobine", a: "tait", depuis: "a1" }]` → ≈ 1,1 s de son au lieu de ≈ 2,8 s.

---

## 1. Le texte dans l'ordre (référence : qui dit quoi)

```
N  Cinq voisins. Et l'un d'eux vous vole.
N  Il dort deux étages plus bas.
N  Jour cinq sans électricité. Inès, au sixième.
N  On a vidé son eau. Avec une clé.
N  Un mot : on sait ce que tu as.
N  Arraché à sa liste des voisins.
N  Si elle lit le mot devant tous…
N  Le complice sait qu'elle sait.
N  Stop. On rembobine.
   (0,6 s : fin du son de rembobinage)
N  Elle se tait. Elle observe.
N  Un : bloquez la porte.
N  Une clé ouvre la serrure.
N  Une cale bloque la porte.
N  Glissée dessous, côté intérieur.
I  Essayez d'entrer, maintenant.
N  Deux : gardez la preuve.
N  Le papier dans une enveloppe.
N  Une photo. La date. L'heure.
N  Huit heures. Elle descend chez Morel.
N  Trois : ne gardez pas tout chez vous.
N  Ce qu'elle a, c'est sa trousse.
N  Elle en cache la moitié ici.
M  C'est quoi ? De la drogue ?
I  Des compresses. Ne touchez à rien.
M  Vous me soupçonnez, moi ?
I  Vous dormiez pendant la réunion.
N  Puis elle ajoute une ligne à sa liste.
N  Une fausse : trousse d'Inès, cave six.
N  Seul un voleur ira voir.
N  Trois heures. Porte calée, elle attend.
N  Une lampe descend à la cave.
N  Les policiers l'attendaient.
N  Vous vous souvenez des gants ?
N  Ceux de la main au trousseau.
N  Les mêmes. Sur le voisin du quatrième.
N  Dans sa poche, les doubles de l'immeuble.
N  Sauf une. Celle du sixième.
N  Chez Inès, la poignée tourne.
N  La porte bute sur la cale.
I  Au voleur ! Au sixième !
N  Le deuxième est pris. Avec sa clé.
M  Encore vous ? Il est trois heures !
I  Bonne nuit, Morel.
N  Jour six. Le courant revient.
N  La pompe repart.
N  Au sixième, le robinet crache de l'air.
N  Puis de l'eau.
```

*Gabarit vérifié avec `lire_script` (`tools/script_format.py`) : **255 mots** (narrateur 219, Inès 21, Morel 15),
47 phrases de 2 à 8 mots (+ carton de 14 mots) ; aucune indication de mise en scène dans le texte lu.*
- hook de 2 phrases, chiffre choc au « vous » ; « deux étages plus bas » désigne en douce le 4e ;
- récap de 4 phrases : un nouveau venu comprend tout ;
- réponse au choix : A en fantôme, « Stop. On rembobine. » (son court), B en vrai ;
- 3 tactiques : bloquer la porte (cale), garder la preuve, ne pas tout garder chez soi ;
- comique Inès / Morel (« De la drogue ? », « Vous dormiez pendant la réunion », et le gag récurrent
  « Encore vous ? Il est 3 heures ! » des Parties 2 et 4) ;
- objet planté : **la cale**, qui sauve Inès à la fin ;
- rappel « Vous vous souvenez des gants ? » (main au trousseau, Partie 3 ; indice caché, Partie 4) ;
- fin de série : les deux voleurs pris, le courant revient, et la dernière image répond à la toute première de la
  série (le robinet qui crachait de l'air) : « Puis de l'eau. »

## 2. Les textes à coller dans ElevenLabs (une voix chacun)

### Texte 1 · Narrateur (`narrateur.mp3`) — Eleven Multilingual v2, sans balises

```
Cinq voisins. Et l'un d'eux vous vole.
Il dort deux étages plus bas.
Jour cinq sans électricité. Inès, au sixième.
On a vidé son eau. Avec une clé.
Un mot : on sait ce que tu as.
Arraché à sa liste des voisins.

Si elle lit le mot devant tous…
Le complice sait qu'elle sait.
Stop. On rembobine.
Elle se tait. Elle observe.

Un : bloquez la porte.
Une clé ouvre la serrure.
Une cale bloque la porte.
Glissée dessous, côté intérieur.

Deux : gardez la preuve.
Le papier dans une enveloppe.
Une photo. La date. L'heure.

Huit heures. Elle descend chez Morel.
Trois : ne gardez pas tout chez vous.
Ce qu'elle a, c'est sa trousse.
Elle en cache la moitié ici.

Puis elle ajoute une ligne à sa liste.
Une fausse : trousse d'Inès, cave six.
Seul un voleur ira voir.

Trois heures. Porte calée, elle attend.
Une lampe descend à la cave.
Les policiers l'attendaient.
Vous vous souvenez des gants ?
Ceux de la main au trousseau.
Les mêmes. Sur le voisin du quatrième.
Dans sa poche, les doubles de l'immeuble.
Sauf une. Celle du sixième.
Chez Inès, la poignée tourne.
La porte bute sur la cale.

Le deuxième est pris. Avec sa clé.

Jour six. Le courant revient.
La pompe repart.
Au sixième, le robinet crache de l'air.
Puis de l'eau.

Fin de H plus soixante-douze.
Et vous, vous auriez tenu combien de jours ?
Répondez en commentaire !
```

### Texte 2 · Inès (`ines.mp3`) — modèle expressif

```
[smug] Essayez d'entrer, maintenant.
[deadpan] Des compresses. Ne touchez à rien.
[dry] Vous dormiez pendant la réunion.
[shouting] Au voleur ! Au sixième !
[tired, warm] Bonne nuit, Morel.
```

### Texte 3 · Morel (`morel.mp3`) — modèle expressif

```
[suspicious] C'est quoi ? De la drogue ?
[offended] Vous me soupçonnez, moi ?
[annoyed] Encore vous ? Il est trois heures !
```

Réglages : identiques aux Parties 3 et 4 (narrateur : stabilité 45 %, similarity 75 %, style 15 %, speaker boost,
vitesse 1,0 ; Inès et Morel : Creative ou Natural, 2-3 prises).
À écouter : « Il dort deux étages plus bas. » bas ; « Stop. » sec puis « On rembobine. » vif, sans blanc après ;
« Sauf une. Celle du sixième. » lent ; « Puis de l'eau. » doux, soulagé ; « Fin de H plus soixante-douze. » posé.
Inès : « Au voleur ! » vraiment crié ; « Bonne nuit, Morel. » épuisée mais tendre.
Dépôt : les 3 MP3 dans `videos/005-h72-cale/`.

## 3. Carton de fin de série (lu par le narrateur, fin du texte 1)

```
FIN · H+72
Et vous, vous auriez tenu combien de jours ?
Répondez en commentaire !
Fiction · conseils vérifiés le 27/10/2026
```
*Pas de choix A/B (la série s'arrête) : carton plein écran, mêmes sons d'entrée, montre masquée, ≥ 4 s ; le moteur
doit accepter un carton sans `choix` (à faire au montage).*

## 4. Faits utilisés et sources

| # | Fait | Source | Sécurité |
|---|---|---|---|
| 1 | Une **cale** glissée sous une porte qui s'ouvre vers l'intérieur empêche de l'ouvrir même avec la clé ; c'est un dépannage (elle cède à une forte poussée). | [4feldco, « how to secure a door without a lock »](https://www.4feldco.com/articles/how-to-secure-a-door-without-a-lock) (ne tient pas longtemps face à la force : poser une vraie serrure dès que possible) ; usage hôtelier décrit dans le brevet [US4958869A](https://patents.google.com/patent/US4958869) | Montrée comme une solution d'attente ; commentaire épinglé : la retirer en cas d'incendie, changer le cylindre dès que possible. |
| 2 | Une menace écrite : **garder l'original** (peu manipulé, dans une enveloppe), photo, date, heure, puis **plainte** (17 si danger immédiat). | [Plainte pour menaces, plus.transformation.gouv.fr](https://www.plus.transformation.gouv.fr/experiences/6383352_plainte-pour-menaces-portant-atteinte-a-ma-vie-et-a-mes-biens) ; [Justifit, voisin menaçant](https://www.justifit.fr/b/guides/droit-penal/voisin-menacant/). **À confirmer sur service-public.fr avant le rendu.** | Sans danger : elle ne confronte personne et passe par la police. |
| 3 | **Ne pas garder toutes ses réserves au même endroit** (un vol ou un sinistre emporte tout). | Bon sens de préparation | Elle confie une partie à un voisin, sans médicaments en libre accès (« compresses »). |
| 4 | Le piège (fausse ligne) et l'attente de la police à la cave. | Fiction | Elle ne va jamais à la cave elle-même : porte calée, police prévenue. |
| 5 | Le courant revenu, la pompe de l'immeuble remonte l'eau aux étages. | Partie 1 (pompe électrique) | Aucun conseil. |

**Bilan : aucun conseil dangereux.** Le mauvais choix (lire le mot devant tous) n'est montré qu'en fantôme.

## 5. Découpage visuel (indicatif, à recaler sur la voix)

Nuit sans courant (pénombre bleutée, bougies) jusqu'à l'épilogue, qui passe en lumière de jour puis électrique
chaude. Cadrages `cadrage.*` (médiane ≤ 35 %). Montre : **J5 · 02:00 → 08:00 → J6 · 03:00 → 09:00**.

| # | Phrase | Image | HUD |
|---|---|---|---|
| 1 | 5 voisins… vous vole. | Entrée d'Inès, papier en main ; en vignettes les 5 visages de la réunion. | Montre 02:00 |
| 2 | Il dort deux étages plus bas. | Coupe de l'immeuble : on descend du 6e au 4e, une fenêtre sombre. | — |
| 3-6 | Récap | Ville noire ; placard du ballon vide ; papier « ON SAIT CE QUE TU AS » ; la page arrachée s'ajuste au carnet. | Carton « H+72 · PARTIE 5 » |
| 7-8 | Branche A | **Fantôme rouge** : Inès lit le mot dans le salon du 7e ; les voisins se tournent ; le voisin du 4e sourit. | ✗ « A » |
| 9 | Stop. On rembobine. | STOP noir et blanc, image qui recule, son de bande COURT (≈ 1,1 s, à partir de « rembobine »). | ◀◀ STOP |
| 10 | Elle se tait. Elle observe. | Inès plie le papier, regard vers le judas. | « B ✓ » |
| 11-14 | Tactique 1 | Elle glisse une cale en bois sous la porte, côté intérieur ; gros plan de la cale. | Tactique 1/3 · BLOQUEZ LA PORTE |
| 15 | Essayez d'entrer… | Inès, trois-quarts, bras croisés. | — |
| 16-18 | Tactique 2 | Papier glissé dans une enveloppe ; flash de téléphone ; date et heure notées. | Tactique 2/3 · GARDEZ LA PREUVE |
| 19-22 | Tactique 3 | Palier du 5e, jour gris ; elle sépare sa trousse en deux. | Montre 08:00 · Tactique 3/3 |
| 23-26 | Dialogue Morel | Plan à deux, porte de Morel. | — |
| 27-29 | Le piège | Salon du 7e vide, elle écrit dans le carnet ; elle confie l'enveloppe à un policier dans le hall. | Fiche « CAVE 6 » barrée « FAUX » |
| 30-32 | La nuit | Inès assise près de sa porte calée ; coupe : faisceau qui descend à la cave ; lampes de policiers qui s'allument. | Montre 03:00 |
| 33-35 | Rappel des gants | Flash Partie 3 (main gantée au trousseau) → les mêmes gants, menottes ; visage du voisin du 4e. | — |
| 36-37 | Le trousseau | Gros plan : trousseau étiqueté « 1er… 7e », un anneau vide « 6e ». | — |
| 38-39 | La poignée / la cale | Entrée d'Inès : la poignée tourne, la porte s'entrouvre de 2 cm et bute sur la cale ; faisceau blanc sous la porte. | — |
| 40 | Au voleur ! Au 6e ! | Inès crie, pied contre la cale (trois-quarts, face caméra). | — |
| 41 | Le 2e est pris. Avec sa clé. | Palier du 6e : deux policiers, un homme à capuche maîtrisé, la clé du 6e dans sa main gantée. | — |
| 42-43 | Morel / Inès | Morel en robe de chambre dans l'escalier ; Inès, épuisée, sourire. | — |
| 44-45 | Jour 6, le courant revient | Coupe de l'immeuble : les fenêtres s'allument étage par étage ; la pompe redémarre. | Montre J6 · 09:00 |
| 46-47 | Le robinet | Raccord avec la toute 1re image de la Partie 1 : le robinet crache de l'air… puis l'eau coule ; Inès sourit. Fondu au noir. | — |
| — | Carton | FIN · H+72 plein écran à `fin+0.7`. | — |

À construire : cave et escalier de cave ; cale en bois ; enveloppe ; trousse ouverte ; trousseau étiqueté ;
policiers (variante « humain ») ; poignée animée et porte qui s'arrête à 2 cm (déclarée dans `decor.meubles`) ;
lumières qui reviennent étage par étage ; robinet de la Partie 1 (eau qui coule) ; carton de fin sans choix A/B.
