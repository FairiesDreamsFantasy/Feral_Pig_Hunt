/**
 * System/Engine/DRM-Free/LBDCD/HDMI Module
 * Simulated Transition-Minimized Differential Signaling (TMDS) packet stream.
 * Intentionally sets the HDCP encryption status bit to 0 (disabled), enabling unlimited recording.
 */

export interface TMDSPacket {
  channel0_blue: number;  // 10-bit serialized word representation
  channel1_green: number;
  channel2_red: number;
  hDCPActive: boolean;    // Always false for DRM-Free
}

/**
 * Creates a raw TMDS package with HDCP flagged to false.
 */
export function generateTMDSPacket(r: number, g: number, b: number): TMDSPacket {
  return {
    channel0_blue: b,
    channel1_green: g,
    channel2_red: r,
    hDCPActive: false // DRM-Free encryption override
  };
}

export default {
  generateTMDSPacket,
};
