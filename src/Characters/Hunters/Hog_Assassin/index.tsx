/**
 * Hog Assassin Character Renderer and 12-Unit Segmented Laser Generator
 */
import { LaserBeam, Vector2D } from '../../../General/index.tsx';
import { HogAssassinConfig } from '../General/index.tsx';

export * from './General/index.tsx';

export function createHogAssassinLaser(hunterPos: Vector2D): LaserBeam {
  const segments = [
    { yOffset: 0, alpha: 1.0, height: 6 },
    { yOffset: -6, alpha: 0.9, height: 6 },
    { yOffset: -12, alpha: 0.75, height: 6 },
    { yOffset: -18, alpha: 0.5, height: 6 },
  ];

  return {
    id: `laser_${Date.now()}_${Math.random()}`,
    x: hunterPos.x,
    y: hunterPos.y - 20,
    lengthUnits: 12,
    vy: -14,
    segments,
  };
}

export function renderHogAssassin(ctx: CanvasRenderingContext2D, position: Vector2D, isInvulnerable: boolean = false): void {
  ctx.save();
  ctx.translate(position.x, position.y);

  if (isInvulnerable && Math.floor(Date.now() / 80) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  // Dual Thruster Fire Glow
  const flameHeight = 8 + Math.random() * 6;
  ctx.fillStyle = '#ff6600';
  ctx.fillRect(-12, 14, 4, flameHeight);
  ctx.fillRect(8, 14, 4, flameHeight);
  ctx.fillStyle = '#ffff00';
  ctx.fillRect(-11, 14, 2, flameHeight * 0.6);
  ctx.fillRect(9, 14, 2, flameHeight * 0.6);

  // Main Robotic Chassis
  ctx.fillStyle = HogAssassinConfig.chassisColor;
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(18, 12);
  ctx.lineTo(12, 14);
  ctx.lineTo(4, 10);
  ctx.lineTo(0, 14);
  ctx.lineTo(-4, 10);
  ctx.lineTo(-12, 14);
  ctx.lineTo(-18, 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Central Cannon Cockpit
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-3, -16, 6, 12);

  // Neon Energy Core
  ctx.fillStyle = HogAssassinConfig.coreGlowColor;
  ctx.fillRect(-2, -4, 4, 6);

  // Outer Armor Accents
  ctx.fillStyle = '#39ff14';
  ctx.fillRect(-14, 8, 3, 4);
  ctx.fillRect(11, 8, 3, 4);

  ctx.restore();
}

export function renderLaserBeam(ctx: CanvasRenderingContext2D, laser: LaserBeam): void {
  ctx.save();
  ctx.translate(laser.x, laser.y);

  // Ultra-efficient mathematical vector glow: renders layered outer alpha halos without GPU/CPU Gaussian blur spikes
  laser.segments.forEach((seg) => {
    // Outer ambient neon cyan glow
    ctx.fillStyle = `rgba(0, 240, 255, ${seg.alpha * 0.25})`;
    ctx.fillRect(-5, seg.yOffset - 1, 10, seg.height + 2);

    // Mid-tier energy beam
    ctx.fillStyle = `rgba(0, 240, 255, ${seg.alpha * 0.7})`;
    ctx.fillRect(-3, seg.yOffset, 6, seg.height);

    // Inner high-temperature white laser core
    ctx.fillStyle = `rgba(255, 255, 255, ${seg.alpha})`;
    ctx.fillRect(-1, seg.yOffset, 2, seg.height);
  });

  ctx.restore();
}

export default {
  createHogAssassinLaser,
  renderHogAssassin,
  renderLaserBeam,
};
