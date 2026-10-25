/**
 * Feral Pigs Subsystem Index & Procedural Canvas Renderer
 */
import { FeralPigAttributes, FeralPigSize } from '../../General/index.tsx';
import { PigColorPaletteMap } from './General/index.tsx';

export * from './General/index.tsx';

export function renderFeralPig(ctx: CanvasRenderingContext2D, pig: FeralPigAttributes): void {
  ctx.save();
  ctx.translate(pig.position.x, pig.position.y);

  if (pig.isDiving) {
    ctx.rotate(pig.diveAngle);
  }

  const palette = PigColorPaletteMap[pig.color] || PigColorPaletteMap.Pink;
  let scale = 1.0;
  if (pig.size === FeralPigSize.SMALL) scale = 0.8;
  if (pig.size === FeralPigSize.LARGE) scale = 1.35;
  if (pig.size === FeralPigSize.GIANT) scale = 1.8;

  ctx.scale(scale, scale);

  const borderWidth = pig.color === 'Black' ? 2.5 : 1.5;
  ctx.strokeStyle = palette.border;
  ctx.lineWidth = borderWidth;

  // Main Pig Torso
  ctx.fillStyle = palette.base;
  ctx.beginPath();
  ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Ears
  ctx.fillStyle = palette.dark;
  ctx.beginPath();
  ctx.moveTo(-12, -10);
  ctx.lineTo(-6, -20);
  ctx.lineTo(-2, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(12, -10);
  ctx.lineTo(6, -20);
  ctx.lineTo(2, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Snout
  ctx.fillStyle = palette.light;
  ctx.beginPath();
  ctx.ellipse(0, pig.snoutLength / 2, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Nostrils
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(-3, pig.snoutLength / 2, 1.5, 0, Math.PI * 2);
  ctx.arc(3, pig.snoutLength / 2, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Fierce Glowing Eyes
  ctx.fillStyle = pig.isDiving ? '#ff0033' : '#ffff00';
  ctx.fillRect(-8, -4, 3, 3);
  ctx.fillRect(5, -4, 3, 3);

  // Tusks
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;

  // Left Tusk
  ctx.beginPath();
  ctx.moveTo(-9, pig.snoutLength / 2);
  ctx.quadraticCurveTo(-14, (pig.snoutLength / 2) - pig.tuskHeight, -10, (pig.snoutLength / 2) - (pig.tuskHeight + 2));
  ctx.lineTo(-7, (pig.snoutLength / 2) + 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right Tusk
  ctx.beginPath();
  ctx.moveTo(9, pig.snoutLength / 2);
  ctx.quadraticCurveTo(14, (pig.snoutLength / 2) - pig.tuskHeight, 10, (pig.snoutLength / 2) - (pig.tuskHeight + 2));
  ctx.lineTo(7, (pig.snoutLength / 2) + 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Spotted Pattern Overlay
  if (pig.isSpotted && pig.spotColor) {
    ctx.fillStyle = pig.spotColor;
    ctx.beginPath();
    ctx.arc(-8, 3, 2.5, 0, Math.PI * 2);
    ctx.arc(7, -3, 3, 0, Math.PI * 2);
    ctx.arc(4, 5, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Giant Boss Health Bar
  if (pig.maxHp > 1 && pig.hp < pig.maxHp) {
    const barWidth = 24;
    const hpRatio = pig.hp / pig.maxHp;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(-barWidth / 2, -22, barWidth, 3);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(-barWidth / 2, -22, barWidth * hpRatio, 3);
  }

  ctx.restore();
}

export default {
  renderFeralPig,
};
