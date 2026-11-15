/**
 * System/Visuals/Animations/Color_Palette/Monochrome Module
 * Monochrome terminal profiles (amber, green phosphor, paperwhite) and nested grayscale conversions.
 */

import GrayscaleModule from './Grayscale/index.tsx';

export const Grayscale = GrayscaleModule;

export interface MonochromeProfile {
  name: string;
  primaryColor: string; // Active phosphor glow
  dimColor: string;     // Faded glow
  backgroundColor: string; // Background screen cathode
}

export const MONOCHROME_PROFILES: Record<string, MonochromeProfile> = {
  P1_GREEN: {
    name: 'Classic Green Phosphor (P1)',
    primaryColor: '#33ff33',
    dimColor: '#006600',
    backgroundColor: '#051405'
  },
  P4_AMBER: {
    name: 'Classic Amber CRT (P4)',
    primaryColor: '#ffb000',
    dimColor: '#7a5000',
    backgroundColor: '#100a00'
  },
  PAPERWHITE: {
    name: 'Cathode Paperwhite',
    primaryColor: '#e1e8e1',
    dimColor: '#606660',
    backgroundColor: '#151715'
  }
};

/**
 * Transforms an RGB color into a monochrome color matching the specified profile.
 */
export function applyMonochromeTint(
  r: number,
  g: number,
  b: number,
  profile: MonochromeProfile
): string {
  // Convert to grayscale first (NTSC luma standard)
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  const t = luma / 255;

  // LERP between terminal background black and active phosphor primary color
  const bgHex = profile.backgroundColor.replace('#', '');
  const fgHex = profile.primaryColor.replace('#', '');

  const bgR = parseInt(bgHex.substring(0, 2), 16);
  const bgG = parseInt(bgHex.substring(2, 4), 16);
  const bgB = parseInt(bgHex.substring(4, 6), 16);

  const fgR = parseInt(fgHex.substring(0, 2), 16);
  const fgG = parseInt(fgHex.substring(2, 4), 16);
  const fgB = parseInt(fgHex.substring(4, 6), 16);

  const finalR = Math.round(bgR + (fgR - bgR) * t);
  const finalG = Math.round(bgG + (fgG - bgG) * t);
  const finalB = Math.round(bgB + (fgB - bgB) * t);

  return `rgb(${finalR}, ${finalG}, ${finalB})`;
}

export default {
  Grayscale,
  MONOCHROME_PROFILES,
  applyMonochromeTint,
};
