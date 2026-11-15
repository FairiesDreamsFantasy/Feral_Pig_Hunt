/**
 * System/Visuals/Animations/Color_Palette Module
 * Color interpolation, dynamic RGB/HSL gradient builders, and nested palettes.
 */

import PatternPaletteModule from './Pattern_Palette/index.tsx';
import TexturePaletteModule from './Texture_Palette/index.tsx';
import MonochromeModule from './Monochrome/index.tsx';

export const Pattern_Palette = PatternPaletteModule;
export const Texture_Palette = TexturePaletteModule;
export const Monochrome = MonochromeModule;

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface ColorHSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Interpolates (LERP) between two RGB colors.
 */
export function lerpColorRGB(c1: ColorRGB, c2: ColorRGB, t: number): ColorRGB {
  const clampedT = Math.max(0, Math.min(1, t));
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * clampedT),
    g: Math.round(c1.g + (c2.g - c1.g) * clampedT),
    b: Math.round(c1.b + (c2.b - c1.b) * clampedT)
  };
}

/**
 * Converts HSL color values to an RGB color object.
 * H: 0-360, S: 0-100, L: 0-100
 */
export function hslToRgb(h: number, s: number, l: number): ColorRGB {
  h /= 360;
  s /= 100;
  l /= 100;

  let r = l, g = l, b = l;
  if (s !== 0) {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Formats RGB to hexadecimal string.
 */
export function rgbToHex(rgb: ColorRGB): string {
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export default {
  Pattern_Palette,
  Texture_Palette,
  Monochrome,
  lerpColorRGB,
  hslToRgb,
  rgbToHex,
};
