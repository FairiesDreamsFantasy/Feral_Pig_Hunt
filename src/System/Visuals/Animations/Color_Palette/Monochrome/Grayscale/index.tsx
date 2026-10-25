/**
 * System/Visuals/Animations/Color_Palette/Monochrome/Grayscale Module
 * NTSC luma calculations (Y = 0.299R + 0.587G + 0.114B), ITU-R weights, and gray-level quantization.
 */

export interface GrayscaleConfig {
  lumaR: number; // Defaults to 0.299
  lumaG: number; // Defaults to 0.587
  lumaB: number; // Defaults to 0.114
}

export const DEFAULT_NTSC_WEIGHTS: GrayscaleConfig = {
  lumaR: 0.299,
  lumaG: 0.587,
  lumaB: 0.114
};

export const HD_BT709_WEIGHTS: GrayscaleConfig = {
  lumaR: 0.2126,
  lumaG: 0.7152,
  lumaB: 0.0722
};

/**
 * Calculates luma intensity from RGB components.
 */
export function calculateLuma(
  r: number,
  g: number,
  b: number,
  weights: GrayscaleConfig = DEFAULT_NTSC_WEIGHTS
): number {
  return weights.lumaR * r + weights.lumaG * g + weights.lumaB * b;
}

/**
 * Quantizes a continuous luma value (0-255) into a discrete scale.
 * e.g., 2-bit (4 gray levels), 4-bit (16 gray levels), or 8-bit (256 levels).
 */
export function quantizeLuma(luma: number, bitDepth: 2 | 4 | 8): number {
  const levels = Math.pow(2, bitDepth);
  const step = 255 / (levels - 1);
  const discreteLevel = Math.round(luma / step);
  return Math.round(discreteLevel * step);
}

/**
 * Formats a given RGB triplet into an NTSC-grayscale hex or rgb string.
 */
export function rgbToGrayscaleString(
  r: number,
  g: number,
  b: number,
  bitDepth?: 2 | 4 | 8,
  weights: GrayscaleConfig = DEFAULT_NTSC_WEIGHTS
): string {
  let luma = calculateLuma(r, g, b, weights);
  if (bitDepth) {
    luma = quantizeLuma(luma, bitDepth);
  }
  const intLuma = Math.round(luma);
  return `rgb(${intLuma}, ${intLuma}, ${intLuma})`;
}

export default {
  DEFAULT_NTSC_WEIGHTS,
  HD_BT709_WEIGHTS,
  calculateLuma,
  quantizeLuma,
  rgbToGrayscaleString,
};
