// System/UI/Play_Area/Portrait_Orientation_4_Mobile_Phones/General/index.tsx
// Mathematical specifications, aspect ratio transforms, and layout dimensions
// for the portrait mobile vertical arcade cabinet.

export interface PortraitViewportDimensions {
  containerWidth: number;
  containerHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  scale: number;
}

export interface PortraitArcadeTheme {
  bezelBorderColor: string;
  bezelBackgroundColor: string;
  deckBackgroundColor: string;
  scanlineOpacity: number;
  hudTextColor: string;
  accentGlow: string;
}

export const PORTRAIT_ARCADE_THEME: PortraitArcadeTheme = {
  bezelBorderColor: '#00f0ff',
  bezelBackgroundColor: '#05050a',
  deckBackgroundColor: '#0d0d18',
  scanlineOpacity: 0.12,
  hudTextColor: '#00f0ff',
  accentGlow: '0 0 20px rgba(0, 240, 255, 0.35)',
};

/**
 * Standard internal virtual coordinate space for portrait orientation arcade screen.
 * Aspect ratio: 3:4 (classic vertical arcade CRT ratio, e.g. Galaga, Pac-Man, Donkey Kong).
 */
export const PORTRAIT_VIRTUAL_SCREEN = {
  width: 480,
  height: 640,
  aspectRatio: 3 / 4, // 0.75
};

/**
 * Calculates responsive scale and fit dimensions to preserve uniform physics and resolution.
 */
export const calculatePortraitViewportFit = (
  availableWidth: number,
  availableHeight: number,
  virtualWidth = PORTRAIT_VIRTUAL_SCREEN.width,
  virtualHeight = PORTRAIT_VIRTUAL_SCREEN.height
): PortraitViewportDimensions => {
  if (availableWidth <= 0 || availableHeight <= 0) {
    return {
      containerWidth: availableWidth,
      containerHeight: availableHeight,
      viewportWidth: virtualWidth,
      viewportHeight: virtualHeight,
      scale: 1,
    };
  }

  // Pure mathematical scale bounding
  const scaleX = availableWidth / virtualWidth;
  const scaleY = availableHeight / virtualHeight;
  const scale = Math.min(scaleX, scaleY);

  return {
    containerWidth: availableWidth,
    containerHeight: availableHeight,
    viewportWidth: Math.floor(virtualWidth * scale),
    viewportHeight: Math.floor(virtualHeight * scale),
    scale,
  };
};
