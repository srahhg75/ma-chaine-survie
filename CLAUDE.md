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
src/systeme/            moteur partagé (format.ts, mots.ts, SousTitres.tsx, polices.ts, GuideZonesSures.tsx…)
src/episodes/NNN-nom/   code de l'épisode (Episode.tsx, timeline…) — enregistré dans src/Root.tsx
public/NNN-nom/         fichiers lus pendant le rendu : voix.wav, mots.json, sons…
public/polices/         polices locales
videos/NNN-nom/         script.txt, voix_brute.wav, voix.wav, vidéo finale .mp4
tools/                  scripts (couper_blancs.py, aligner.py, telecharger_polices.ts), models/, earshot/
qc/                     lecons.md + images/rapports de contrôle qualité
analyse/                analyses (chaînes concurrentes, statistiques, mesures earshot…)
```
`src/episodes/000-test` est un épisode technique de vérification (ne pas publier).

## Pipeline d'un épisode
0. **Relire `qc/lecons.md`.** Choisir `NNN-nom` (ex. `001-plus-d-eau`), créer les 3 dossiers.
1. **Script** → `videos/NNN-nom/script.txt`. Accroche « Que feriez-vous si… » dès la 1re phrase,
   ~170 mots/minute (70–120 s ≈ 200–340 mots). Faits de survie **vérifiés**, aucun conseil dangereux
   présenté comme sûr. Lignes `#` = commentaires, `[crochets]` = indications non lues.
2. **Voix** → `videos/NNN-nom/voix_brute.wav` (fournie ou générée).
3. **Blancs coupés** →
   `.venv/bin/python tools/couper_blancs.py videos/NNN-nom/voix_brute.wav videos/NNN-nom/voix.wav`
   puis copier `voix.wav` dans `public/NNN-nom/`.
4. **Alignement mot à mot** →
   `.venv/bin/python tools/aligner.py public/NNN-nom/voix.wav --script videos/NNN-nom/script.txt -o public/NNN-nom/mots.json`
   (orthographe du script, temps de Vosk ; si > 15 % de mots interpolés : vérifier).
5. **Timeline** : découper l'épisode en plans calés sur les mots (un nouvel état d'image toutes les
   1,5–2,5 s, plans « déplacement → plan tenu », étiquettes uniquement sur plans tenus).
6. **3D + HUD + sous-titres** dans `src/episodes/NNN-nom/` en réutilisant `src/systeme/`.
   Enregistrer la Composition `epNNN-nom` dans `src/Root.tsx` (durée calculée depuis `mots.json`).
7. **Sons** : bruitages sombres depuis earshot (`earshot sfx list`, `earshot sfx render ID -o x.wav --dur … --apex …`,
   `earshot kit …`), placés sur la timeline ; ambiance ≥ 10 dB sous la voix ; master −14 LUFS, TP < −1 dB.
8. **Boucle qualité** (recommencer tant qu'un point échoue) :
   - `npx tsc --noEmit` ;
   - images fixes avec le calque de zones : `npx remotion still src/index.ts epNNN-nom qc/NNN/f.png --frame=N --props='{"guide":true}'`
     sur une image toutes les ~2 s → les regarder et cocher chaque règle de `qc/lecons.md` ;
   - son : `tools/earshot/.venv/bin/earshot measure <fichier>` (LUFS, true peak),
     `earshot timeline <fichier> --video <mp4>` (synchro son/image), `earshot describe` pour vérifier qu'un bruitage est bien sombre ;
   - toute erreur trouvée → corriger **et** ajouter une leçon.
9. **Relire `qc/lecons.md`**, puis **rendu final** :
   `npx remotion render src/index.ts epNNN-nom videos/NNN-nom/NNN-nom.mp4`
   puis contrôle final (ffprobe : 1080×1920, 30 i/s, durée 70–120 s ; earshot measure : −14 LUFS ±1, TP < −1 dB).

## Commandes utiles
- Tout réinstaller (nouvelle machine) : `npm run installer` (ou `bash tools/installer.sh`)
- Aperçu interactif : `npm run studio`
- Rendu de vérification technique : `npm run test-rendu`
- Vérifier le code : `npm run typecheck`
- earshot (bruitages / écoute) : `tools/earshot/.venv/bin/earshot <commande>` ; `doctor --load` pour vérifier l'installation.
  `measure`, `sfx`, `kit` sont rapides (sans modèle) ; les autres chargent les modèles (~20–40 s par appel) :
  pour beaucoup d'appels, un seul script Python avec `from earshot import api`.
