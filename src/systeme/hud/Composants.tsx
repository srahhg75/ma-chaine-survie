import React from "react";
import { interpolate } from "remotion";
import { POLICE_LCD, POLICE_TEXTE } from "../polices";
import { Rect } from "./boites";
import { Icone } from "./icones";
import { ElementHudResolu, NomMoodle } from "./types";

export const JAUNE = "#FFC93C";
export const ROUGE = "#FF3B30";
const PANNEAU = "rgba(12,14,17,0.82)";
const BORD = "1.5px solid rgba(255,255,255,0.14)";
const OMBRE = "0 10px 28px rgba(0,0,0,0.55)";

type Props<T extends ElementHudResolu["type"]> = { e: Extract<ElementHudResolu, { type: T }>; r: Rect; f: number };

const boite = (r: Rect, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute",
  left: r.x,
  top: r.y,
  width: r.l,
  height: r.h,
  boxSizing: "border-box",
  ...extra,
});

// ---------- Montre LCD : jour, heure, température ----------
export const Montre: React.FC<Props<"montre"> & { jour: number; heure: string; temperature: number }> = ({ r, jour, heure, temperature, f }) => {
  const clignote = Math.floor(f / 15) % 2 === 0;
  const [h, m] = heure.split(":");
  return (
    <div style={boite(r, { borderRadius: 22, background: "linear-gradient(180deg,#26282c,#121315)", padding: 9, boxShadow: OMBRE, border: "2px solid #3a3d42" })}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 14,
          background: "linear-gradient(180deg,#a9b59a,#8e9b80)",
          boxShadow: "inset 0 3px 8px rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          color: "#1d2418",
          fontFamily: POLICE_LCD,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontSize: 20, opacity: 0.7, fontFamily: POLICE_TEXTE, fontWeight: 800 }}>JOUR</span>
          <span style={{ fontSize: 44 }}>{jour}</span>
        </div>
        <span style={{ fontSize: 58, letterSpacing: 1 }}>
          {h}
          <span style={{ opacity: clignote ? 1 : 0.15 }}>:</span>
          {m}
        </span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", lineHeight: 1 }}>
          <span style={{ fontSize: 20, opacity: 0.7, fontFamily: POLICE_TEXTE, fontWeight: 800 }}>°C</span>
          <span style={{ fontSize: 34 }}>{temperature > 0 ? `+${temperature}` : temperature}</span>
        </div>
      </div>
    </div>
  );
};

// ---------- Moodles : indicateurs d'état (niveau 1 jaune -> 4 rouge) ----------
const NIVEAUX = ["#e8c23a", "#e8902f", "#e0582c", "#d42b2b"];
const LIBELLES: Record<NomMoodle, string> = { panique: "PANIQUE", froid: "FROID", faim: "FAIM", soif: "SOIF", fatigue: "FATIGUE", blessure: "BLESSURE", tete: "MAL DE TÊTE", nausee: "NAUSÉE", sommeil: "SOMMEIL", odeur: "ODEUR" };
export const Moodles: React.FC<Props<"moodles">> = ({ e, r, f }) => (
  <div style={boite(r, { display: "flex", gap: 12 })}>
    {e.moodles.map((m, i) => {
      const pulse = m.niveau >= 3 ? 1 + 0.05 * Math.sin((f / 30) * Math.PI * 2 * 1.5) : 1;
      return (
        <div
          key={i}
          style={{
            width: 84,
            height: 84,
            borderRadius: 16,
            background: `linear-gradient(180deg, ${NIVEAUX[m.niveau - 1]}, ${NIVEAUX[Math.min(3, m.niveau)]})`,
            border: "2.5px solid rgba(0,0,0,0.55)",
            boxShadow: OMBRE,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${pulse})`,
          }}
        >
          <Icone nom={m.nom} taille={44} couleur="#141414" />
          <span style={{ fontFamily: POLICE_TEXTE, fontWeight: 900, fontSize: 12, color: "#141414", marginTop: 2 }}>{LIBELLES[m.nom]}</span>
        </div>
      );
    })}
  </div>
);

// ---------- Fiche d'objet ----------
export const Fiche: React.FC<Props<"fiche"> & { ancre?: { x: number; y: number } }> = ({ e, r, ancre }) => (
  <>
    {ancre && <Trait de={ancre} vers={{ x: ancre.x < r.x ? r.x : r.x + r.l, y: r.y + r.h }} />}
    <div style={boite(r, { background: PANNEAU, border: BORD, borderLeft: `6px solid ${JAUNE}`, borderRadius: 14, padding: "18px 20px", boxShadow: OMBRE, color: "white", fontFamily: POLICE_TEXTE })}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: 12, background: "rgba(255,201,60,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icone nom={e.icone} taille={46} couleur={JAUNE} />
        </div>
        <div style={{ fontWeight: 900, fontSize: 34, textTransform: "uppercase", lineHeight: 1.05 }}>{e.titre}</div>
      </div>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {e.lignes.map((l, i) => (
          <div key={i} style={{ fontWeight: 600, fontSize: 25, color: "rgba(255,255,255,0.88)" }}>
            <span style={{ color: JAUNE, marginRight: 8 }}>▸</span>
            {l}
          </div>
        ))}
      </div>
    </div>
  </>
);

// ---------- Bandeau « Tactique 1/3 » ----------
export const Tactique: React.FC<Props<"tactique">> = ({ e, r }) => (
  <div style={boite(r, { background: PANNEAU, border: BORD, borderRadius: 16, boxShadow: OMBRE, display: "flex", alignItems: "center", padding: "0 20px", gap: 18, fontFamily: POLICE_TEXTE, color: "white" })}>
    <div style={{ background: JAUNE, color: "#141414", borderRadius: 10, padding: "8px 12px", fontWeight: 900, fontSize: 24, lineHeight: 1, textAlign: "center" }}>
      TACTIQUE
      <div style={{ fontSize: 34 }}>
        {e.numero}/{e.total}
      </div>
    </div>
    <div style={{ fontWeight: 900, fontSize: 31, textTransform: "uppercase", lineHeight: 1.08 }}>{e.titre}</div>
  </div>
);

// ---------- Inventaire ----------
export const Inventaire: React.FC<Props<"inventaire">> = ({ e, r }) => (
  <div style={boite(r, { background: PANNEAU, border: BORD, borderRadius: 18, boxShadow: OMBRE, display: "flex", alignItems: "center", padding: "0 12px", gap: 0 })}>
    {e.objets.map((o, i) => (
      <div key={i} style={{ width: 112, height: 112, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 12,
            background: e.surligne === i ? "rgba(255,201,60,0.22)" : "rgba(255,255,255,0.06)",
            border: e.surligne === i ? `3px solid ${JAUNE}` : "2px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <Icone nom={o.icone} taille={54} couleur={e.surligne === i ? JAUNE : "#ffffff"} />
        </div>
        {o.quantite !== undefined && (
          <span style={{ position: "absolute", right: 14, bottom: 10, fontFamily: POLICE_TEXTE, fontWeight: 900, fontSize: 24, color: "white", textShadow: "0 2px 4px #000" }}>
            {o.unite ? `${o.quantite} ${o.unite}` : `×${o.quantite}`}
          </span>
        )}
      </div>
    ))}
  </div>
);

// ---------- Compte à rebours ----------
export const Compte: React.FC<Props<"compte">> = ({ e, r, f }) => {
  const restant = Math.max(0, e.secondes - (f - e.fDe) / 30);
  const n = Math.ceil(restant);
  const frac = restant - Math.floor(restant);
  const pouls = 1 + 0.12 * Math.max(0, frac - 0.75) * 4;
  return (
    <div style={boite(r, { background: PANNEAU, border: `2px solid ${ROUGE}`, borderRadius: 18, boxShadow: OMBRE, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white" })}>
      <div style={{ fontFamily: POLICE_TEXTE, fontWeight: 900, fontSize: 24, color: ROUGE }}>{(e.titre ?? "Vous avez").toUpperCase()}</div>
      <div style={{ fontFamily: POLICE_LCD, fontSize: 96, lineHeight: 1, transform: `scale(${pouls})` }}>00:0{n}</div>
    </div>
  );
};

// ---------- Étiquette accrochée à un point 3D (sur les plans tenus) ----------
export const Etiquette: React.FC<Props<"etiquette"> & { ancre?: { x: number; y: number } }> = ({ e, r, ancre }) => {
  const c = e.style === "danger" ? ROUGE : e.style === "ressource" ? JAUNE : "#ffffff";
  return (
    <>
      {ancre && <Trait de={ancre} vers={{ x: ancre.x < r.x ? r.x : r.x + r.l, y: r.y + r.h / 2 }} couleur={c} />}
      <div
        style={boite(r, {
          background: PANNEAU,
          border: `2px solid ${c}`,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: POLICE_TEXTE,
          fontWeight: 800,
          fontSize: 34,
          color: c,
          textTransform: "uppercase",
          boxShadow: OMBRE,
          whiteSpace: "nowrap",
        })}
      >
        {e.texte}
      </div>
    </>
  );
};

const Trait: React.FC<{ de: { x: number; y: number }; vers: { x: number; y: number }; couleur?: string }> = ({ de, vers, couleur = JAUNE }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, overflow: "visible" }}>
    <line x1={de.x} y1={de.y} x2={vers.x} y2={vers.y} stroke={couleur} strokeWidth={3} />
    <circle cx={de.x} cy={de.y} r={9} fill={couleur} stroke="#111" strokeWidth={3} />
  </svg>
);

// ---------- Carton de fin « PARTIE N » (+ choix A/B en grand pour faire commenter) ----------
export const Carton: React.FC<Props<"carton">> = ({ e, r, f }) => {
  const entree = interpolate(f - e.fDe, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (!e.question) {
    return (
      <div style={boite(r, { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, fontFamily: POLICE_TEXTE, color: "white", textAlign: "center" })}>
        <div style={{ background: JAUNE, color: "#141414", fontWeight: 900, fontSize: 40, padding: "8px 26px", borderRadius: 10, transform: `scale(${0.8 + 0.2 * entree})` }}>
          PARTIE {e.partie}
        </div>
        <div style={{ fontWeight: 900, fontSize: 76, lineHeight: 1.02, textTransform: "uppercase", textShadow: "0 6px 24px rgba(0,0,0,0.8)" }}>{e.titre}</div>
        <div style={{ fontWeight: 800, fontSize: 34, marginTop: 10, padding: "14px 26px", border: "2px solid rgba(255,255,255,0.6)", borderRadius: 999 }}>ABONNE-TOI POUR LA SUITE</div>
        <div style={{ fontWeight: 600, fontSize: 22, opacity: 0.75 }}>Fiction · conseils vérifiés le {e.verifie}</div>
      </div>
    );
  }
  // Version « choix » : fond assombri, grosse question, deux grands blocs A / B qui pulsent à tour de rôle
  const couleurs = [JAUNE, ROUGE];
  const pulse = (i: number) => {
    const k = Math.max(0, f - e.fDe - 14 - i * 6);
    const actif = Math.floor(k / 24) % 2 === i ? 1 : 0;
    return 1 + 0.045 * actif * Math.sin(((k % 24) / 24) * Math.PI);
  };
  const glisse = (i: number) => interpolate(f - e.fDe, [6 + i * 5, 16 + i * 5], [120, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const apparait = (i: number) => interpolate(f - e.fDe, [6 + i * 5, 16 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: `rgba(5,6,8,${0.62 * entree})` }} />
      <div style={boite(r, { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, fontFamily: POLICE_TEXTE, color: "white", textAlign: "center" })}>
        <div style={{ background: JAUNE, color: "#141414", fontWeight: 900, fontSize: 38, padding: "8px 26px", borderRadius: 10, transform: `scale(${0.8 + 0.2 * entree})` }}>
          PARTIE {e.partie} · {e.titre.toUpperCase()}
        </div>
        <div style={{ fontWeight: 900, fontSize: 88, lineHeight: 1.0, textTransform: "uppercase", textShadow: "0 8px 30px rgba(0,0,0,0.9)", opacity: entree }}>{e.question}</div>
        {(e.choix ?? []).map((c, i) => (
          <div
            key={i}
            style={{
              width: 780,
              minHeight: 200,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "20px 30px",
              borderRadius: 28,
              background: "rgba(14,16,20,0.92)",
              border: `6px solid ${couleurs[i]}`,
              boxShadow: `0 0 ${30 * (pulse(i) - 1) * 22}px ${couleurs[i]}, 0 14px 40px rgba(0,0,0,0.7)`,
              transform: `translateX(${i === 0 ? -glisse(i) : glisse(i)}px) scale(${pulse(i)})`,
              opacity: apparait(i),
            }}
          >
            <div
              style={{
                width: 150,
                height: 150,
                flexShrink: 0,
                borderRadius: 24,
                background: couleurs[i],
                color: "#141414",
                fontWeight: 900,
                fontSize: 120,
                lineHeight: "150px",
              }}
            >
              {i === 0 ? "A" : "B"}
            </div>
            <div style={{ fontWeight: 900, fontSize: 54, lineHeight: 1.05, textTransform: "uppercase", textAlign: "left" }}>{c}</div>
          </div>
        ))}
        <div style={{ fontWeight: 900, fontSize: 46, color: JAUNE, textShadow: "0 4px 16px rgba(0,0,0,0.9)", opacity: apparait(2) }}>RÉPONDS A OU B EN COMMENTAIRE ↓</div>
        <div style={{ fontWeight: 700, fontSize: 26, opacity: 0.8 * apparait(2) }}>Réponse dans la partie {e.partie} · Fiction · conseils vérifiés le {e.verifie}</div>
      </div>
    </>
  );
};
