/**
 * System/Visuals/Animations/Color_Palette/Pattern_Palette Module
 * Camouflage pattern matrix builders, pixel dithering screens, and spot/stripe rendering templates.
 */

export interface PatternConfig {
  primaryColor: string;
  secondaryColor: string;
  scale: number;
}

/**
 * Creates a canvas procedural pattern of striped camouflage lines.
 */
export function createCamouflageStripes(
  ctx: CanvasRenderingContext2D,
  config: PatternConfig
): CanvasPattern | null {
  const { primaryColor, secondaryColor, scale } = config;
  const buffer = document.createElement('canvas');
  buffer.width = scale * 4;
  buffer.height = scale * 4;
  const bCtx = buffer.getContext('2d');
  
  if (!bCtx) return null;

  bCtx.fillStyle = primaryColor;
  bCtx.fillRect(0, 0, buffer.width, buffer.height);

  bCtx.fillStyle = secondaryColor;
  bCtx.beginPath();
  // Draw organic wavy stripes inside the repeating cell using cubic curves
  bCtx.moveTo(0, scale);
  bCtx.bezierCurveTo(scale, scale * 0.5, scale * 3, scale * 1.5, buffer.width, scale);
  bCtx.lineTo(buffer.width, scale * 2);
  bCtx.bezierCurveTo(scale * 3, scale * 2.5, scale, scale * 1.5, 0, scale * 2);
  bCtx.closePath();
  bCtx.fill();

  return ctx.createPattern(buffer, 'repeat');
}

/**
 * Creates a procedurally dithered pattern cell (ideal for 8-bit/16-bit retro shading).
 * Employs a Bayer 4x4 matrix representation.
 */
export function createDitherPattern(
  ctx: CanvasRenderingContext2D,
  color: string,
  density: 1 | 2 | 3 | 4 // Density level (1 = lightest, 4 = darkest)
): CanvasPattern | null {
  const buffer = document.createElement('canvas');
  buffer.width = 4;
  buffer.height = 4;
  const bCtx = buffer.getContext('2d');
  if (!bCtx) return null;

  bCtx.fillStyle = color;

  // Standard Bayer 4x4 coordinate mappings for shading
  const ditherCoords: Record<number, [number, number][]> = {
    1: [[0, 0], [2, 2]],
    2: [[0, 0], [2, 2], [0, 2], [2, 0]],
    3: [[0, 0], [2, 2], [0, 2], [2, 0], [1, 1], [3, 3]],
    4: [[0, 0], [2, 2], [0, 2], [2, 0], [1, 1], [3, 3], [1, 3], [3, 1]]
  };

  const points = ditherCoords[density] || [];
  for (const [x, y] of points) {
    bCtx.fillRect(x, y, 1, 1);
  }

  return ctx.createPattern(buffer, 'repeat');
}

export default {
  createCamouflageStripes,
  createDitherPattern,
};
