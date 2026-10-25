/**
 * System/Registry/Visuals/Resolution Module
 * Resolution registration registry linking dynamic scale dimensions to game viewport sizes.
 */

import { RESOLUTION_PROFILES, ResolutionProfile } from '../../../Visuals/Resolution/index.tsx';

export interface ViewportConstraint {
  targetWidth: number;
  targetHeight: number;
  scaleFactor: number;
}

/**
 * Maps standard resolution selections to viewport constraints.
 */
export function resolveViewportConstraints(
  profileKey: string,
  containerW: number,
  containerH: number
): ViewportConstraint {
  const profile: ResolutionProfile = RESOLUTION_PROFILES[profileKey.toUpperCase()] || RESOLUTION_PROFILES.SD;
  
  const scaleW = containerW / profile.width;
  const scaleH = containerH / profile.height;
  const scaleFactor = Math.min(scaleW, scaleH);

  return {
    targetWidth: profile.width,
    targetHeight: profile.height,
    scaleFactor
  };
}

export default {
  RESOLUTION_PROFILES,
  resolveViewportConstraints,
};
