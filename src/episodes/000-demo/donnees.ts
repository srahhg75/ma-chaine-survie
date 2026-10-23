import { DonneesEpisode } from "../../systeme/episode";

// Démonstration technique du moteur (≈ 10 s) — ne pas publier.
// Script : videos/000-demo/script.txt (phrases @hook, @regle, @chute).
export const donnees: DonneesEpisode = {
  id: "000-demo",
  titre: "Démonstration du moteur",
  demonstration: true,
  queue: 2.3,
  decor: {
    pieces: [
      {
        id: "salon",
        centre: [0, 0],
        largeur: 4.2,
        profondeur: 3.4,
        sol: "parquet",
        murs: "papier",
        couleurMurs: "#7f8a74",
        ouvertures: [
          { mur: "nord", type: "fenetre", centre: 0.5, largeur: 1.3, hauteur: 1.3, bas: 0.9 },
          { mur: "nord", type: "porte", centre: -1.2, largeur: 0.9, hauteur: 2.05 },
        ],
      },
    ],
    meubles: [
      { type: "tapis", position: [0.3, 0, 0.2], couleur: "#6b2f2a" },
      { type: "table", position: [0.9, 0, -0.3], id: "table" },
      { type: "chaise", position: [0.9, 0, -1.0], rotation: 0 },
      { type: "canape", position: [-1.55, 0, 0.6], rotation: 90, couleur: "#4e5a6a" },
      { type: "couverture", position: [-1.5, 0.5, 1.0], rotation: 80, couleur: "#7a5c8f" },
      { type: "etagere", position: [-1.87, 0, -1.0], rotation: 90 },
      { type: "radiateur", position: [0.5, 0.1, -1.6] },
      { type: "bouteille", position: [1.3, 0.76, -0.45] },
      { type: "bouteille", position: [1.4, 0.76, -0.3] },
      { type: "conserve", position: [1.25, 0.76, -0.1] },
      { type: "radio", position: [0.55, 0.76, -0.55], rotation: 15 },
      { type: "jerrican", position: [1.75, 0, -1.4], rotation: -20 },
    ],
    exterieur: { ville: { allumees: 0.04 }, neige: { densite: 1, vent: 0.7 }, ciel: "nuit" },
  },
  personnages: [
    {
      id: "bob",
      depart: { position: [0.45, 0, -1.15], orientation: 180 },
      trajet: [{ a: "regle:vivre", position: [0.05, 0, -0.25], orientation: 90 }],
      poses: [
        { a: 0, pose: "froid" },
        { a: "hook.fin", pose: "debout" },
        { a: "regle:porte", pose: "mainTendue", transition: 0.4 },
        { a: "chute:jamais", pose: "inquiet", transition: 0.3 },
      ],
    },
  ],
  camera: [
    // Plan large en plongée, puis on descend vers la fenêtre dès la 1re image (ça démarre en mouvement)
    { a: 0, position: [4.4, 3.6, 4.6], cible: [0.2, 0.6, -0.7], fov: 46 },
    { a: "hook:appartement", position: [2.3, 1.9, 2.3], cible: [0.3, 0.3, -0.9], fov: 46, deplacement: 1.9 },
    // Recadrage depuis l'est pendant la tactique : la porte reste visible à côté du personnage
    { a: "regle:vivre", position: [3.0, 2.1, 1.0], cible: [-0.3, 0.3, -0.6], fov: 52, deplacement: 1.2 },
    // Chute : on se rapproche du personnage, face à son visage
    { a: "chute:jamais", position: [1.9, 1.4, 0.7], cible: [0.0, 0.62, -0.3], fov: 46, deplacement: 0.7 },
  ],
  hud: [
    { type: "montre", jour: 3, heure: "21:47", temperature: 4 },
    { type: "moodles", de: "hook:degres-0.2", a: "regle-0.05", moodles: [{ nom: "froid", niveau: 2 }] },
    { type: "tactique", de: "regle", a: "chute-0.1", numero: 1, total: 3, titre: "Une seule pièce chauffée" },
    { type: "etiquette", de: "regle:seule+0.06", a: "regle.fin+0.05", texte: "Porte fermée", point: [-1.2, 1.1, -1.62], style: "ressource" },
    {
      type: "fiche",
      de: "chute:monoxyde-0.2",
      a: "fin+0.1",
      icone: "danger",
      cote: "gauche",
      titre: "Monoxyde de carbone",
      lignes: ["Invisible, sans odeur", "Barbecue, brasero : dehors"],
    },
    { type: "carton", de: "fin+0.7", partie: 2, titre: "Le froid", verifie: "23/10/2026" },
  ],
  sons: [
    { a: "hook:appartement", id: "whoosh_big/deep", gain: -8 },
    { a: "regle", id: "cut_hit/rumble", gain: -6 },
    { a: "chute:jamais", id: "pro_sub_drop/low", gain: -2 },
    { a: "fin+0.7", id: "pro_impact/deep", gain: -4 },
  ],
  ambiances: [
    { type: "vent", de: 0, a: "fin+2", niveau: 0 },
    { type: "drone", de: 0, a: "fin+2", niveau: -2 },
    { type: "coeur", de: "chute-0.5", a: "fin+1", niveau: -1, bpm: 78 },
  ],
  sujets: [
    { de: 0, a: "fin", personnage: "bob", hauteur: 0.75 }, // buste
    { de: 0, a: "fin", personnage: "bob", hauteur: 1.12 }, // visage
  ],
};
