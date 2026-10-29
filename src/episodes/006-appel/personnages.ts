import { Apparence } from "../../systeme/personnage/apparence";

// Personnages de la saison « Le dernier appel » (style « adulte », image noir et blanc + rouge)
export const NATHAN: Partial<Apparence> = {
  femme: false, age: 0.12, peau: "#e9bf9e", joues: "#e09080", iris: "#3a2a1c", cheveux: "#1a1412", coiffure: "meches",
  haut: "pull", couleurHaut: "#3d5f8f", couleurCol: "#dfe6ee", pantalon: "#23272e", chaussures: "baskets", couleurChaussures: "#e9e6df",
};
export const LEA: Partial<Apparence> = {
  femme: true, age: 0.08, peau: "#f1cbb0", joues: "#e88e86", iris: "#2a1a10", cheveux: "#4a3428", coiffure: "long",
  haut: "cardigan", couleurHaut: "#2b2b2e", couleurCol: "#efe9e0", pantalon: "#1c1c20", chaussures: "bottines", couleurChaussures: "#1a1414",
  echarpe: "#c8141c", // le rouge : seule couleur qui reste à l'image
};
