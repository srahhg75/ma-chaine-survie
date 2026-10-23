import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";

// Rendu WebGL (3D) : "angle" utilise la carte graphique ; sur un serveur Linux sans carte
// graphique (pas de /dev/dri), on bascule sur le rendu logiciel "swangle" (plus lent mais fiable).
const sansCarteGraphique = process.platform === "linux" && !existsSync("/dev/dri");
Config.setChromiumOpenGlRenderer(sansCarteGraphique ? "swangle" : "angle");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
// Qualité visuellement sans perte, poids raisonnable (~6-10 Mb/s) : TikTok recompresse de toute façon
Config.setCrf(18);
Config.setOverwriteOutput(true);
