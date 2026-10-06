/**
 * System/Visuals/Animations/Color_Palette/Texture_Palette Module
 * Procedural surface noise matrices, displacement maps, specular reflection vectors, and tusk shine shaders.
 */

export interface SpecularLight {
  x: number;
  y: number;
  intensity: number;
}

/**
 * Creates a noisy texture pattern (e.g. coarse snout texture or steel chassis surface).
 */
export function createNoiseTexture(
  ctx: CanvasRenderingContext2D,
  color: string,
  opacity: number = 0.05,
  scale: number = 2
): CanvasPattern | null {
  const buffer = document.createElement('canvas');
  buffer.width = 32;
  buffer.height = 32;
  const bCtx = buffer.getContext('2d');
  if (!bCtx) return null;

  bCtx.fillStyle = color;
  bCtx.fillRect(0, 0, buffer.width, buffer.height);

  for (let x = 0; x < buffer.width; x += scale) {
    for (let y = 0; y < buffer.height; y += scale) {
      if (Math.random() > 0.5) {
        bCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * opacity})`;
      } else {
        bCtx.fillStyle = `rgba(0, 0, 0, ${Math.random() * opacity})`;
      }
      bCtx.fillRect(x, y, scale, scale);
    }
  }

  return ctx.createPattern(buffer, 'repeat');
}

/**
 * Renders a metallic specular shine highlight on curved surfaces (like the curved enamel tusks).
 */
export function drawSpecularHighlight(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  thickness: number,
  lightPosition: { x: number; y: number }
) {
  const grad = ctx.createLinearGradient(startX, startY, endX, endY);
  
  // Highlight calculations based on approximate incidence vector
  grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.1)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)'); // High shine core
  grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.strokeStyle = grad;
  ctx.lineWidth = thickness;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

export default {
  createNoiseTexture,
  drawSpecularHighlight,
};
