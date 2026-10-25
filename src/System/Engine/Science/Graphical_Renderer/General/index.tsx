/**
 * src/System/Engine/Science/Graphical_Renderer/General/index.tsx
 * Display variables, CRT screen matrices, Doppler shift colors, and spatial vector render drivers.
 */

import { Star } from '../../../../General/index.tsx';

export interface GraphicalRendererConfig {
  crtBloomActive: boolean;
  scanlineIntensity: number;
  chromaticAberrationOffset: number;
  starfieldVelocityScale: number;
}

export const DEFAULT_GRAPHICAL_CONFIG: GraphicalRendererConfig = {
  crtBloomActive: true,
  scanlineIntensity: 0.12,
  chromaticAberrationOffset: 1.5,
  starfieldVelocityScale: 1.44
};

/**
 * Calculates relativistic Optical Doppler Color Shifting.
 * Star colors blueshift when accelerating forward, and redshift when trailing.
 */
export function calculateDopplerColorShift(baseColor: string, velocityY: number, maxSpeed: number = 25): string {
  if (baseColor !== '#ffffff' && baseColor !== '#00f0ff' && baseColor !== '#ffe600') {
    return baseColor; // Retain special patterns
  }
  
  if (velocityY > 5) {
    // Redshift (expanding trailing space) - red-gold tone
    return '#ff3344';
  } else if (velocityY < -5) {
    // Blueshift (approaching forward space) - cyan-violet tone
    return '#44aaff';
  }
  return baseColor;
}

/**
 * Updates star coordinates using relativistic warp projections.
 */
export function updateRelativisticStarfield(stars: Star[], velocityY: number, canvasHeight: number): void {
  for (const star of stars) {
    // Speed is affected by velocity warp factors
    const warpSpeed = star.speed * (1.0 - velocityY * 0.08);
    star.y += warpSpeed;
    if (star.y > canvasHeight) {
      star.y = 0;
      star.x = Math.random() * 400; // Standard canvas width bounds
    }
  }
}
