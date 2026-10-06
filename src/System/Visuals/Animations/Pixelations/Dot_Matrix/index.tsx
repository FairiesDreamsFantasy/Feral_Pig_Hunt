/**
 * System/Visuals/Animations/Pixelations/Dot_Matrix Module
 * CRT scanline shadow masks, phosphor bloom grids, and subpixel screen matrix simulations.
 */

export interface DotMatrixConfig {
  dotRadius: number;
  gap: number;
  phosphorIntensity: number; // 0 to 1
  bloomRadius: number;
}

/**
 * Applies a mathematical shadow mask scanline formula onto a Canvas region.
 * Uses sin-based pixel scaling to overlay phosphor lines.
 */
export function applyScanlines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number = 0.15,
  scanlineHeight: number = 3
) {
  const originalComp = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = 'multiply';
  
  // Draw horizontal lines across the canvas
  ctx.fillStyle = `rgba(0, 0, 0, ${intensity})`;
  for (let y = 0; y < height; y += scanlineHeight * 2) {
    ctx.fillRect(0, y, width, scanlineHeight);
  }
  
  ctx.globalCompositeOperation = originalComp;
}

/**
 * Renders a glowing dot-matrix sprite to simulate retro dot matrix LED displays (e.g. scoreboard or warning signage).
 */
export function drawDotMatrixLED(
  ctx: CanvasRenderingContext2D,
  pixelData: number[][], // 2D array of intensity (0 to 1)
  offsetX: number,
  offsetY: number,
  config: DotMatrixConfig,
  colorRGB: { r: number; g: number; b: number }
) {
  const { dotRadius, gap, phosphorIntensity, bloomRadius } = config;
  const cellSize = dotRadius * 2 + gap;

  for (let r = 0; r < pixelData.length; r++) {
    for (let c = 0; c < pixelData[r].length; c++) {
      const activeIntensity = pixelData[r][c];
      if (activeIntensity <= 0) continue;

      const cx = offsetX + c * cellSize + cellSize / 2;
      const cy = offsetY + r * cellSize + cellSize / 2;
      const finalIntensity = activeIntensity * phosphorIntensity;

      // Draw Bloom (Outer glow)
      if (bloomRadius > 0) {
        const grad = ctx.createRadialGradient(cx, cy, dotRadius, cx, cy, dotRadius + bloomRadius);
        grad.addColorStop(0, `rgba(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b}, ${finalIntensity * 0.4})`);
        grad.addColorStop(1, `rgba(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, dotRadius + bloomRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Inner Core (Active Phosphor)
      ctx.fillStyle = `rgba(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b}, ${finalIntensity})`;
      ctx.beginPath();
      ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export default {
  applyScanlines,
  drawDotMatrixLED,
};
