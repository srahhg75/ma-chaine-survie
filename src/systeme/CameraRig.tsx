import { useThree } from "@react-three/fiber";
import React from "react";
import { PerspectiveCamera } from "three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { appliquerCamera, CleCameraResolue, etatCamera } from "./camera";

// Place la caméra three.js selon les images-clés, à chaque image (avant le rendu).
export const CameraRig: React.FC<{ cles: CleCameraResolue[] }> = ({ cles }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  appliquerCamera(camera, etatCamera(cles, frame, fps), width / height);
  return null;
};
