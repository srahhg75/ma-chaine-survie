import React from "react";
import { DonneesDecor } from "./decor";
import { Ciel, Neige, VilleNocturne } from "./Exterieur";
import { Meuble } from "./Meubles";
import { Piece } from "./Piece";

// Construit tout le décor décrit en données (pièces en coupe, meubles, extérieur).
export const Decor: React.FC<{ decor: DonneesDecor }> = ({ decor }) => {
  const ext = decor.exterieur;
  const neige = ext?.neige ? ext.neige : null;
  // La neige tombe uniquement DEHORS : derrière le mur du fond de la pièce la plus au nord
  const fond = Math.min(...decor.pieces.map((p) => p.centre[1] - p.profondeur / 2), 0) - 0.4;
  return (
    <group>
      {decor.pieces.map((p) => (
        <Piece key={p.id} piece={p} />
      ))}
      {decor.meubles.map((m, i) => (
        <Meuble key={m.id ?? i} meuble={m} />
      ))}
      {ext?.ciel && <Ciel type={ext.ciel} />}
      {ext?.ville && <VilleNocturne allumees={ext.ville.allumees} distance={ext.ville.distance} neige={!!neige} />}
      {neige && <Neige densite={neige.densite} vent={neige.vent} centre={[0, 6, fond - 10]} taille={[30, 14, 20]} />}
    </group>
  );
};
