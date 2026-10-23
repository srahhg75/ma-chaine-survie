# Studio Survie — chaîne TikTok faceless

Chaîne TikTok **en français**, sans visage : séries de **survie apocalyptiques en 3D**, format
« **Que feriez-vous si…** ». La personne qui gère la chaîne ne code pas : Claude fait tout, explique simplement ce
qu'il fait, et ne pose que les questions indispensables.

## ⚠️ Règle n°1 : les leçons
- **Avant chaque épisode et avant chaque rendu : relire `qc/lecons.md` en entier.**
- **À chaque erreur trouvée (par Claude ou par la personne qui gère la chaîne) : ajouter une règle dans `qc/lecons.md`**
  (section « Leçons apprises », datée, avec la règle concrète qui empêche de la refaire).

## Décisions fixes
| Sujet | Décision |
|---|---|
| Format | vertical **1080×1920**, **30 i/s**, H.264 + AAC, épisodes de **70 à 120 s** |
| Vidéo | **Remotion** (React + TypeScript) + **@remotion/three / three / @react-three/fiber** pour la 3D |
| Polices | Google Fonts copiées **en local** dans `public/polices/` (`npx tsx tools/telecharger_polices.ts`), chargées par `src/systeme/polices.ts` ; jamais de chargement réseau pendant un rendu |
| Rendu 3D | `remotion.config.ts` choisit seul : `angle` (carte graphique) ou `swangle` (serveur Linux sans GPU) |
| Alignement mot à mot | **Vosk** + modèle `tools/models/vosk-model-small-fr-0.22`. **Jamais Whisper** (trop lent). |
| Sons / contrôle audio | **earshot** dans `tools/earshot` (son propre `.venv`, torch CPU) : banque de bruitages + « oreilles » |
| Python | `.venv` à la racine (numpy, scipy, soundfile, pyloudnorm, vosk) ; earshot a **son propre** `.venv` |
| Volume | master **−14 LUFS**, **true peak < −1 dB**, bruitages ≥ 10 dB sous la voix |

## Arborescence
```
src/systeme/              MOTEUR PARTAGÉ (réutilisé par tous les épisodes)
  format.ts               format + règles chiffrées de qc/lecons.md (zones sûres, 160°/s, 1,4 s, 2 blocs…)
  mots.ts / timeline.ts   mots.json (alignement) + ANCRES : "hook", "hook.fin", "hook:mot", "chute+0.5"…
  camera.ts / CameraRig   images-clés « déplacement → plan tenu » (accélérations douces) + project() 3D -> pixels
  episode.ts              type DonneesEpisode (tout en données) + résolution des ancres en images
  EpisodeStandard.tsx     rendu complet d'un épisode (3D, personnages, post-traitement, HUD, sous-titres, son)
  SousTitres.tsx          karaoké Montserrat 900, 2-4 mots, chaque mot apparaît quand il est dit, mots-clés jaune #FFC93C / rouge #FF3B30
  kit3d/                  decor.ts (pièces en coupe, meubles, obstacles), textures procédurales, Piece, Meubles, Fantome (mauvais réflexe en rouge hachuré),
                          Exterieur (ville nocturne, ciel, neige), Lumieres (bougie, lampe torche), PostProcess
  personnage/             Bonhomme (personnage de la chaîne), poses.ts, trajet.ts (marche, pas de téléportation),
                          BancEssai (chaque pose sous 4 angles : composition « banc-essai »)
  hud/                    HUD « jeu de survie » en données : montre LCD, moodles, fiche d'objet, Tactique n/N,
                          inventaire, compte à rebours, étiquette 3D, carton « PARTIE N » ; boites.ts = positions
src/episodes/NNN-nom/     donnees.ts (décor, personnages, caméra, HUD, sons, ambiances, sujets) + Episode.tsx
src/episodes/registre.ts  liste des épisodes (une Composition « epNNN-nom » chacun)
public/NNN-nom/           voix.wav, mots.json, timeline.json, mix.wav, stems/, sons/ (lus pendant le rendu)
videos/NNN-nom/           script.txt, voix_brute.wav, final.mp4
tools/                    voix, alignement, mixage, contrôles, rendus (voir le pipeline) ; models/, earshot/
qc/                       lecons.md + qc/NNN-nom/ (rapports, planches, brouillon, images)
analyse/                  analyses (chaînes de référence…) ; reference/ (vidéos étudiées, jamais versionnées)
```
`src/episodes/000-demo` est la démonstration technique du moteur (ne pas publier).

## Format du script (`videos/NNN-nom/script.txt`)
Une ligne = une phrase de la timeline. `@id` en début de ligne = identifiant (sinon p1, p2…) ; `>` = phrase-chute
(0,6 s de silence avant) ; `*mots*` = mot-clé ressource/chiffre (jaune) ; `_mot_` = danger (rouge) ; `# …` commentaire ;
`[…]` indication non lue. Ex. : `@chute > Mais _jamais_ de barbecue à l'intérieur.`

## Pipeline d'un épisode
0. **Relire `qc/lecons.md`.** Choisir `NNN-nom`, créer `videos/`, `public/`, `src/episodes/` à ce nom.
1. **Script** → `videos/NNN-nom/script.txt` (format ci-dessus). Accroche « Que feriez-vous si… » dès la 1re phrase,
   ~170 mots/minute (70–120 s ≈ 200–340 mots). Faits de survie **vérifiés**, aucun conseil dangereux présenté comme sûr.
2. **Voix** → `videos/NNN-nom/voix_brute.wav` (fournie). Pour monter avant la vraie voix :
   `.venv/bin/python tools/voix_provisoire.py videos/NNN-nom/script.txt videos/NNN-nom/voix_brute.wav` (jamais publiée).
3. **Blancs coupés + alignement mot à mot** (une seule commande) :
   `.venv/bin/python tools/couper_blancs.py videos/NNN-nom/voix_brute.wav --script videos/NNN-nom/script.txt -o public/NNN-nom/voix.wav --mots public/NNN-nom/mots.json`
   (pauses ramenées à 0,1–0,3 s, 0,6 s avant la chute, fondus 12 ms, jamais de coupe dans un mot ; puis
   réalignement Vosk + alignement caractère par caractère sur le texte exact du script, insensible aux accents).
   **Changer de voix = relancer cette commande, rien d'autre.**
4. **Timeline / 3D / HUD / sons** dans `src/episodes/NNN-nom/donnees.ts`, tout calé par ancres sur les phrases et mots ;
   éléments 3D propres à l'épisode dans `Episode.tsx` ; ajouter l'épisode à `src/episodes/registre.ts`.
5. **Boucle qualité** : `bash tools/boucle.sh NNN-nom` — typecheck, `tools/qc.ts` (durée et chevauchement des
   étiquettes, zones sûres, caméra hors des murs, téléportations, rotation ≤ 160°/s, rythme, sujet jamais caché),
   `tools/mix.py` + `tools/qc_audio.py` (voix ≥ 10 dB au-dessus du fond mot par mot, −14 LUFS, TP < −1),
   brouillon demi-résolution, planches contact `qc/NNN-nom/planche-*.jpg` (à REGARDER), écoute earshot.
   Images précises : `npx tsx tools/images.ts NNN-nom 2.5 "chute:jamais" --guide`.
   Toute erreur trouvée → corriger **et** ajouter une leçon. Recommencer jusqu'à 0 erreur.
6. **Relire `qc/lecons.md`**, puis **rendu final** : `bash tools/final.sh NNN-nom` (contrôles bloquants, rendu,
   master, vérifs 1080×1920/30 i/s/durée/−14 LUFS, copie dans « Vidéos TikTok » sur le bureau).

## Pièges techniques connus
- `@react-three/postprocessing` rend noir sous Remotion → `kit3d/PostProcess.tsx` (EffectComposer de three).
- Jamais `Math.random()` → `random()` de Remotion (ou `bruit()` de `maths.ts`).
- Un NaN dans un shader noircit toute l'image → `max(x, 0.)` avant `pow`.
- Jamais de hook React après un `return` anticipé.
- Les données d'épisode (`donnees.ts`) ne doivent importer que des fichiers sans JSX (lus par `tools/qc.ts` hors navigateur).

## Commandes utiles
- Tout réinstaller (nouvelle machine) : `npm run installer` (ou `bash tools/installer.sh`)
- Aperçu interactif : `npm run studio` ; vérifier le code : `npm run typecheck`
- Banc d'essai du personnage : `npx tsx tools/images.ts banc-essai 0.5 2.5 4.5 6.5 8.5 10.5 12.5 14.5`
- earshot (bruitages / écoute) : `tools/earshot/.venv/bin/earshot <commande>` ; `doctor --load` pour vérifier l'installation.
  `measure`, `sfx`, `kit` sont rapides (sans modèle) ; les autres chargent les modèles (~20–40 s par appel).
  Sons autorisés (sombres) : `tools/sons_autorises.json`.
