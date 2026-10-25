// System/UI/Play_Area/Index/General/index.tsx
// Deterministic detection heuristics to distinguish mobile phones and tablets held in portrait orientation
// from desktop computers, laptops, and landscape screens with zero pseudoscience.

export type DeviceOrientationMode = 'PORTRAIT_MOBILE' | 'PORTRAIT_TABLET' | 'LANDSCAPE_STANDARD';

export interface ViewportEvaluationResult {
  mode: DeviceOrientationMode;
  isPortrait: boolean;
  isTouchDevice: boolean;
  isTabletSize: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Pure evaluation of the active viewport and hardware input characteristics.
 * - 'PORTRAIT_TABLET': Viewport is strictly vertical (height > width), and the shorter dimension is larger than a phone (> 600px and <= 1366px), or tablet touch userAgent.
 * - 'PORTRAIT_MOBILE': Viewport is strictly vertical (height > width), touch-enabled, and phone width (<= 600px).
 * - 'LANDSCAPE_STANDARD': All landscape orientations (width >= height), desktop computers, and laptops.
 * Landscape view remains strictly preserved and completely unaltered.
 */
export const evaluateDeviceOrientationMode = (): ViewportEvaluationResult => {
  if (typeof window === 'undefined') {
    return {
      mode: 'LANDSCAPE_STANDARD',
      isPortrait: false,
      isTouchDevice: false,
      isTabletSize: false,
      viewportWidth: 800,
      viewportHeight: 600,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isPortrait = height > width;

  // Verify coarse pointer or touch screen presence
  const hasCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const hasTouchPoints = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0);
  const isTouchDevice = Boolean(hasCoarsePointer || hasTouchPoints);

  const minDimension = Math.min(width, height);
  const isPhoneSize = minDimension <= 600;
  const isTabletSize = minDimension > 600 && minDimension <= 1366;

  let mode: DeviceOrientationMode = 'LANDSCAPE_STANDARD';

  if (isPortrait) {
    if (isTouchDevice && isPhoneSize) {
      mode = 'PORTRAIT_MOBILE';
    } else if (isTabletSize || (isTouchDevice && !isPhoneSize)) {
      mode = 'PORTRAIT_TABLET';
    }
  }

  return {
    mode,
    isPortrait,
    isTouchDevice,
    isTabletSize,
    viewportWidth: width,
    viewportHeight: height,
  };
};
