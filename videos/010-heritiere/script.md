# « L'héritière cachée » — Partie 1 : « Le hall »

*Écrite le 01/11/2026 après relecture de `qc/lecons.md`. Histoire sans conseils (drama de couple), style 2D webtoon validé
le 01/11 (« Oui, écris la P1 »). Accroche « Imagine… » (épisode précédent : « Si… »).*

**Durée visée : ≈ 75 s de récit + carton lu** (211 mots de récit : narrateur ≈ 150, Victoria 42, Noé 13, Clara 16,
Enzo 5, Adrien 5 ; carton 22). Six voix (une par personnage, gardée pour toute la série).
Objet planté : la bague gravée d'un A (Aurel), qui servira en partie 3.

## Les textes à coller dans ElevenLabs

### Narrateur (`narrateur.mp3`)

```
Imagine… Ton mari a une autre femme.
Et c'est elle qui t'humilie.
Clara entre dans la tour Valmont.
Avec Noé, son fils de six ans.
C'est l'anniversaire de son mari, Adrien.
Un gâteau fait maison. Trente-cinq bougies.
Le hall brille d'or et de marbre.
Un garçon bouscule Noé.
Le gâteau s'écrase par terre.
Des talons claquent sur le marbre.
Une femme en rouge. Couverte d'or.
Victoria éclate de rire.
Tout le hall les regarde.
Clara serre sa vieille bague. Gravée d'un A.
Elle appelle. Haut-parleur.
Au bout du fil, une voix grave.
Clara se fige.
Elle connaît cette voix.
L'ascenseur descend du quarantième étage.
Les portes dorées s'ouvrent.
Costume bleu. Cravate rouge.
C'est Adrien. Son mari.
Il voit Clara. Il devient blanc.
Il a deux femmes. Face à face.
Devant ses deux femmes, Adrien…
A : dit la vérité.
B : jure qu'il ne la connaît pas.
Répondez en commentaire !
```

### Clara (`clara.mp3`) — Eleven Multilingual v2

```
Excuse-toi auprès de mon fils.
Votre fils doit des excuses.
Adrien ? C'est qui, cette femme ?
```

### Victoria (`victoria.mp3`) — Eleven Multilingual v2

```
On ne parle pas à mon fils.
Regarde-toi. Un pull à vingt euros.
Tu n'as rien à faire ici.
Tu sais qui est mon mari ?
L'homme le plus puissant du pays.
Chéri, une folle agresse Enzo.
Tu la connais, chéri ?
```

### Noé (`noe.mp3`) — voix d'enfant, Eleven Multilingual v2

```
Papa va être trop content !
Maman… C'est la voix de papa ?
```

### Enzo (`enzo.mp3`) — voix d'enfant, Eleven Multilingual v2

```
Fais attention, le pauvre !
```

### Adrien (`adrien.mp3`) — Eleven Multilingual v2

```
J'arrive. Elle va le regretter.
```

Personnages en **Eleven Multilingual v2** (demande du 01/11) : v2 ne comprend pas les balises « [en anglais] » (il les
lirait à voix haute) ; le ton se règle avec les curseurs : Stabilité 35-45 %, Similarité 75 %, Style 30-45 %,
Speaker boost activé. Une ligne = une réplique, séparées par un retour à la ligne.

Dépôt : les 6 MP3 dans `videos/010-heritiere/` (noms sans accent).

## Voix déposées (01/11)
- narrateur, clara, victoria, noe, enzo : OK (Eleven v2 pour les personnages).
- **adrien : ABSENT** → `adrien.wav` = voix de synthèse Windows PROVISOIRE (à supprimer quand `adrien.mp3` arrive,
  puis relancer assembler_voix.py + couper_blancs.py).
- Recalage manuel dans `public/010-heritiere/mots.json` : « Fais attention » (Enzo) 19,62-20,25 s (Vosk l'avait
  interpolé dans le blanc). À refaire après tout nouvel alignement.
