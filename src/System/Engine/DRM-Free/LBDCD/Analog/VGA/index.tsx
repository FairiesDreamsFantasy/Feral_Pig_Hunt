/**
 * System/Engine/DRM-Free/LBDCD/Analog/VGA Module
 * Analog RGB voltage signaling (0.7V peak-to-peak), horizontal and vertical synchronization matrix scales.
 */

export interface VGAVideoSignal {
  redVoltage: number;   // 0.0 to 0.7V
  greenVoltage: number; // 0.0 to 0.7V
  blueVoltage: number;  // 0.0 to 0.7V
  hSync: boolean;
  vSync: boolean;
}

/**
 * Encodes dynamic digital RGB values (0-255) into standard analog VGA component voltages.
 */
export function encodeDigitalToVGA(r: number, g: number, b: number): VGAVideoSignal {
  return {
    redVoltage: Math.min(0.7, (r / 255) * 0.7),
    greenVoltage: Math.min(0.7, (g / 255) * 0.7),
    blueVoltage: Math.min(0.7, (b / 255) * 0.7),
    hSync: true,
    vSync: true
  };
}

export default {
  encodeDigitalToVGA,
};
