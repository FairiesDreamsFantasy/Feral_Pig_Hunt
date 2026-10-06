/**
 * System/Engine/DRM-Free/LBDCD/Analog/3.5MM Module
 * Dual-channel TRS stereo balanced audio waves (Left + Right audio pin maps).
 */

export interface TRSConnectorState {
  tipLeftVolts: number;   // Left Channel AC Signal
  ringRightVolts: number; // Right Channel AC Signal
  sleeveGround: boolean;
}

/**
 * Encodes digital left/right audio panning amplitude into balanced TRS voltage levels.
 */
export function encodeTRSAmplitude(leftAmp: number, rightAmp: number): TRSConnectorState {
  return {
    tipLeftVolts: leftAmp * 1.5, // Standard headphone line level peak-to-peak voltage (1.5V)
    ringRightVolts: rightAmp * 1.5,
    sleeveGround: true
  };
}

export default {
  encodeTRSAmplitude,
};
