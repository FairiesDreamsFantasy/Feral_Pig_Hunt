/**
 * System/Engine/DRM-Free/LBDCD/Analog/AV Module
 * RCA composite visual connectors. Phase quadrature modulation maps (NTSC/PAL waveforms).
 */

export interface AVCompositeSignal {
  luminanceY: number;     // Black and White level
  chrominanceI: number;   // Color phase I
  chrominanceQ: number;   // Color phase Q
  audioLeftVolts: number;
  audioRightVolts: number;
}

/**
 * Encodes a RGB triplet into a composite NTSC YIQ matrix.
 */
export function rgbToYIQ(r: number, g: number, b: number): { y: number; i: number; q: number } {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  return {
    y: 0.299 * normR + 0.587 * normG + 0.114 * normB,
    i: 0.596 * normR - 0.274 * normG - 0.322 * normB,
    q: 0.211 * normR - 0.523 * normG + 0.312 * normB
  };
}

export default {
  rgbToYIQ,
};
