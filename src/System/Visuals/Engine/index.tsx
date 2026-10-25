/**
 * Visuals Engine - Special Relativistic Rendering Subsystem
 */
import { Star } from '../../General/index.tsx';
import { VisualEngineConfig } from './General/index.tsx';

export * from './General/index.tsx';
export * as Mathematics from './Mathematics/index.tsx';
export * as Science from './Science/index.tsx';

export const SPEED_OF_LIGHT_C = 45.0;

export function clearUltraBlackCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.save();
  ctx.fillStyle = VisualEngineConfig.clearColor;
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = false;
  ctx.restore();
}

export function applyRelativisticStarfield(
  stars: Star[],
  playerVelocityX: number,
  canvasWidth: number
): void {
  const beta = Math.max(-0.95, Math.min(0.95, playerVelocityX / SPEED_OF_LIGHT_C));
  const betaSq = beta * beta;
  const gamma = 1.0 / Math.sqrt(1.0 - betaSq);

  stars.forEach((star) => {
    const dx = star.x - canvasWidth / 2;
    const distanceToCenter = Math.sqrt(dx * dx + star.y * star.y) || 1.0;
    const cosTheta = dx / distanceToCenter;

    const denominator = 1.0 - beta * cosTheta;
    let cosThetaObs = (cosTheta - beta) / (denominator || 1.0);
    cosThetaObs = Math.max(-1.0, Math.min(1.0, cosThetaObs));

    const newDx = cosThetaObs * distanceToCenter;
    star.x = canvasWidth / 2 + newDx / gamma;

    const isMovingRight = beta > 0;
    const isMovingLeft = beta < 0;
    const isStarInFrontOfMotion = (isMovingRight && cosTheta > 0) || (isMovingLeft && cosTheta < 0);
    const isStarBehindMotion = (isMovingRight && cosTheta < 0) || (isMovingLeft && cosTheta > 0);

    if (Math.abs(beta) > 0.05) {
      if (isStarInFrontOfMotion) {
        star.color = '#00f0ff';
        star.brightness = Math.min(1.0, 0.4 + Math.abs(beta) * 0.6);
      } else if (isStarBehindMotion) {
        star.color = '#ff3131';
        star.brightness = Math.max(0.15, 0.5 - Math.abs(beta) * 0.35);
      } else {
        star.color = '#ffe600';
      }
    } else {
      star.color = star.size > 1 ? '#ffe600' : '#ffffff';
      star.brightness = 0.5 + Math.random() * 0.5;
    }
  });
}

export default {
  clearUltraBlackCanvas,
  applyRelativisticStarfield,
};
