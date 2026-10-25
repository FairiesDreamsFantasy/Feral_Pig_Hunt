// System/UI/Play_Area/Portrait_Orientation_4_Tablets/General/index.tsx
// Scientific layout calculations, aspect ratio math, and artistic vector rendering
// for tablet portrait orientation with 20% bezels, robot with pepperoni pizza, and newly planted tree.

export interface TabletLayoutGeometry {
  totalWidth: number;
  totalHeight: number;
  leftBezelWidth: number;
  centerScreenWidth: number;
  rightBezelWidth: number;
  screenHeight: number;
  screenTop: number;
  bezelPercentage: number;
}

/**
 * Calculates layout preserving exact 20% horizontal bezels on left and right,
 * with the centered vertical arcade screen occupying the central 60% width.
 */
export const calculateTabletPortraitLayout = (
  availableWidth: number,
  availableHeight: number,
  controlsFooterHeight = 90
): TabletLayoutGeometry => {
  const totalWidth = Math.max(1, availableWidth);
  const totalHeight = Math.max(1, availableHeight);

  // Exact 20% side bezels for scenic artistry, leaving 60% for the expanded arcade screen
  const bezelPercentage = 0.20;
  const leftBezelWidth = Math.floor(totalWidth * bezelPercentage);
  const rightBezelWidth = leftBezelWidth;
  const centerScreenWidth = totalWidth - leftBezelWidth - rightBezelWidth;

  // Screen height accounts for top marquee HUD and bottom tactile deck
  const screenHeight = Math.max(100, totalHeight - controlsFooterHeight - 44);

  return {
    totalWidth,
    totalHeight,
    leftBezelWidth,
    centerScreenWidth,
    rightBezelWidth,
    screenHeight,
    screenTop: 44,
    bezelPercentage,
  };
};

/**
 * Starfield coordinate generator for the celestial sky backdrop.
 */
export interface BackdropStar {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  size: number;
  opacity: number;
  twinkleDelay: number;
}

export const generateTabletBackdropStars = (count = 45): BackdropStar[] => {
  const stars: BackdropStar[] = [];
  for (let i = 0; i < count; i++) {
    // Seeded pseudo-random coordinates for deterministic rendering
    const pseudoRand = (seed: number) => {
      const x = Math.sin(seed * 9999) * 10000;
      return x - Math.floor(x);
    };
    stars.push({
      x: pseudoRand(i * 3 + 1) * 100,
      y: pseudoRand(i * 5 + 2) * 70, // Keep in upper 70% above the green horizon
      size: 1 + pseudoRand(i * 7 + 3) * 2,
      opacity: 0.35 + pseudoRand(i * 11 + 4) * 0.65,
      twinkleDelay: pseudoRand(i * 13 + 5) * 4,
    });
  }
  return stars;
};
