import { Vec3 } from "../maths";
import { StyleMot } from "../mots";
import { Ancre } from "../timeline";

// HUD « jeu de survie » décrit EN DONNÉES dans chaque épisode (donnees.ts).
export type NomIcone =
  | "bougie" | "eau" | "lampe" | "piles" | "conserve" | "couverture" | "radio" | "allumettes" | "trousse"
  | "briquet" | "jerrican" | "thermometre" | "danger" | "maison" | "porte" | "telephone" | "cle";
export type NomMoodle = "panique" | "froid" | "faim" | "soif" | "fatigue" | "blessure" | "tete" | "nausee" | "sommeil" | "odeur";

type Base = { de?: Ancre; a?: Ancre };

export type ElementHud =
  // Montre LCD permanente (ne compte pas dans la limite de 2 blocs). `changements` : l'heure avance aux ancres.
  | (Base & { type: "montre"; jour: number; heure: string; temperature: number; changements?: { a: Ancre; jour?: number; heure?: string; temperature?: number }[] })
  | (Base & { type: "moodles"; moodles: { nom: NomMoodle; niveau: 1 | 2 | 3 | 4 }[] })
  | (Base & { type: "fiche"; icone: NomIcone; titre: string; lignes: string[]; point?: Vec3; cote?: "gauche" | "droite" })
  | (Base & { type: "tactique"; numero: number; total: number; titre: string })
  | (Base & { type: "inventaire"; objets: { icone: NomIcone; quantite?: number; unite?: string; nom?: string }[]; surligne?: number })
  | (Base & { type: "compte"; secondes: number; titre?: string })
  | (Base & { type: "etiquette"; texte: string; point: Vec3; style?: StyleMot })
  | (Base & { type: "carton"; partie: number; titre: string; verifie: string; question?: string; choix?: [string, string]; fin?: boolean }); // fin : dernier épisode d'une série (pas de choix A/B)

export type TypeHud = ElementHud["type"];
export type ElementHudResolu = ElementHud & { fDe: number; fA: number; index: number };
