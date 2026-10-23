import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// Polices chargées depuis public/polices (copiées par tools/telecharger_polices.ts) :
// aucun accès Internet pendant le rendu. Plages Unicode reprises de Google Fonts.
const PLAGES: Record<string, string> = {
  latin:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  "latin-ext":
    "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
};

// Polices disponibles (doivent correspondre à tools/telecharger_polices.ts)
const DISPONIBLES: Record<string, { graisses: string[]; sousEnsembles: string[] }> = {
  Montserrat: { graisses: ["600", "800", "900"], sousEnsembles: ["latin", "latin-ext"] },
  ShareTechMono: { graisses: ["400"], sousEnsembles: ["latin"] },
};

const chargees = new Set<string>();

const charger = (nom: string): string => {
  if (chargees.has(nom)) return nom;
  chargees.add(nom);
  const info = DISPONIBLES[nom];
  const handle = delayRender(`Police ${nom}`);
  Promise.all(
    info.graisses.flatMap((graisse) =>
      info.sousEnsembles.map((sous) => {
        const f = new FontFace(nom, `url(${staticFile(`polices/${nom}-${graisse}-${sous}.woff2`)}) format("woff2")`, {
          weight: graisse,
          unicodeRange: PLAGES[sous],
        });
        document.fonts.add(f);
        return f.load();
      }),
    ),
  )
    .then(() => continueRender(handle))
    .catch((e) => cancelRender(new Error(`Police ${nom} introuvable : lancer npx tsx tools/telecharger_polices.ts (${e})`)));
  return nom;
};

// Sous-titres et HUD (Montserrat 600/800/900) ; affichages LCD (Share Tech Mono)
export const POLICE_TEXTE = charger("Montserrat");
export const POLICE_LCD = charger("ShareTechMono");
