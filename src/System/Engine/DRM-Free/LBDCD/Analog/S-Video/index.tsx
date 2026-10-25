/**
 * System/Engine/DRM-Free/LBDCD/Analog/S-Video Module
 * Dedicated luminance (Y pin) and chrominance (C pin) signal separation to prevent visual bleeding.
 */

export interface SVideoPins {
  lumaYVolts: number;   // Luminance voltage
  chromaCVolts: number; // Chrominance modulated amplitude
  groundY: boolean;
  groundC: boolean;
}

/**
 * Encodes an RGB coordinate into S-Video separate Y/C voltages.
 */
export function encodeSVideo(r: number, g: number, b: number): SVideoPins {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  const y = 0.299 * normR + 0.587 * normG + 0.114 * normB;
  const u = -0.147 * normR - 0.289 * normG + 0.436 * normB;
  const v = 0.615 * normR - 0.515 * normG - 0.100 * normB;
  const c = Math.sqrt(u * u + v * v);

  return {
    lumaYVolts: y * 1.0,  // Max 1.0V peak-to-peak
    chromaCVolts: c * 0.3, // Standard chrominance amplitude
    groundY: true,
    groundC: true
  };
}

export default {
  encodeSVideo,
};
