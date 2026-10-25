/**
 * System/Visuals/Animations/Pixelations Module
 * Retro resolution downsampling, coordinate quantization, and nested submodules.
 */

import DotMatrixModule from './Dot_Matrix/index.tsx';

export const Dot_Matrix = DotMatrixModule;

export interface PixelationConfig {
  pixelSize: number;
  width: number;
  height: number;
}

/**
 * Quantizes a single numeric coordinate value to a simulated retro pixel size grid.
 */
export function quantizeCoordinate(val: number, pixelSize: number): number {
  return Math.floor(val / pixelSize) * pixelSize;
}

/**
 * Quantizes a point coordinate to a custom pixel size grid.
 */
export function quantizePoint(x: number, y: number, pixelSize: number): { x: number; y: number } {
  return {
    x: Math.floor(x / pixelSize) * pixelSize,
    y: Math.floor(y / pixelSize) * pixelSize
  };
}

/**
 * Draws a pixelated rect onto the canvas.
 */
export function drawPixelatedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  pixelSize: number,
  fillStyle: string
) {
  const qX = quantizeCoordinate(x, pixelSize);
  const qY = quantizeCoordinate(y, pixelSize);
  const qW = Math.max(pixelSize, Math.floor(w / pixelSize) * pixelSize);
  const qH = Math.max(pixelSize, Math.floor(h / pixelSize) * pixelSize);

  ctx.fillStyle = fillStyle;
  ctx.fillRect(qX, qY, qW, qH);
}

export default {
  Dot_Matrix,
  quantizeCoordinate,
  quantizePoint,
  drawPixelatedRect,
};
