/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

function write(relPath, content) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log(`[Part 1] Created: ${relPath}`);
}

// 1. src/General/index.tsx
write("src/General/index.tsx", `/**
 * General System Types, Math Helpers, and Architecture Exports
 */
export interface Vector2D {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum GameState {
  TITLE = 'TITLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
  WAVE_TRANSITION = 'WAVE_TRANSITION'
}

export enum FeralPigSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  GIANT = 'GIANT'
}

export enum FeralPigColor {
  PINK = 'Pink',
  WHITE = 'White',
  GREEN = 'Green',
  BLUE = 'Blue',
  BLACK = 'Black',
  BROWN = 'Brown',
  PURPLE = 'Purple',
  ORANGE = 'Orange',
  GOLD = 'Gold',
  SILVER = 'Silver',
  AMBER = 'Amber',
  GRAY = 'Gray',
  PEACH = 'Peach'
}

export interface FeralPigAttributes {
  id: string;
  color: FeralPigColor;
  isSpotted: boolean;
  spotColor?: string;
  size: FeralPigSize;
  tuskHeight: number;
  snoutLength: number;
  points: number;
  hp: number;
  maxHp: number;
  position: Vector2D;
  originPosition: Vector2D;
  velocity: Vector2D;
  diveAngle: number;
  isDiving: boolean;
  diveTimer: number;
  diveProgress: number;
  divePathType: 'direct_charge' | 'loop_dive' | 's_curve';
  formationIndex: number;
  t: number;
}

export interface LaserBeam {
  id: string;
  x: number;
  y: number;
  lengthUnits: number;
  vy: number;
  segments: { yOffset: number; alpha: number; height: number }[];
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface Star {
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  brightness: number;
}

export const ARCADE_SETTINGS = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  PLAYER_SPEED: 7.0,
  LASER_LENGTH_UNITS: 12,
  LASER_SPEED: 14.0,
  MAX_LIVES: 3,
  MAX_PLAYER_LASERS: 4,
};

export const GeneralSystem = {
  version: '1.0.0',
  description: 'Pure client-side Arcade Game System Core',
};

export default GeneralSystem;
`);

// 2. src/Characters/Hunters
write("src/Characters/Hunters/General/index.tsx", `/**
 * Hunters General Specification
 */
export interface HunterConfig {
  name: string;
  speed: number;
  laserUnitLength: number;
  chassisColor: string;
  coreGlowColor: string;
}

export const HogAssassinConfig: HunterConfig = {
  name: 'Hog Assassin Robotic Platform',
  speed: 7.5,
  laserUnitLength: 12,
  chassisColor: '#4a4a6a',
  coreGlowColor: '#00f0ff',
};

export default HogAssassinConfig;
`);

write("src/Characters/Hunters/Hog_Assassin/General/index.tsx", `export const HogAssassinGeneral = {
  codename: 'Unit-HA-12',
  weaponType: '12-Unit Segmented Laser Emitter',
};

export default HogAssassinGeneral;
`);

write("src/Characters/Hunters/Hog_Assassin/index.tsx", `/**
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
    id: \`laser_\${Date.now()}_\${Math.random()}\`,
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

  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 10;

  laser.segments.forEach((seg) => {
    ctx.fillStyle = \`rgba(0, 240, 255, \${seg.alpha})\`;
    ctx.fillRect(-2, seg.yOffset, 4, seg.height);

    ctx.fillStyle = \`rgba(255, 255, 255, \${seg.alpha})\`;
    ctx.fillRect(-1, seg.yOffset, 2, seg.height);
  });

  ctx.restore();
}

export default {
  createHogAssassinLaser,
  renderHogAssassin,
  renderLaserBeam,
};
`);

write("src/Characters/Hunters/index.tsx", `/**
 * Hunters Aggregator
 */
export * from './General/index.tsx';
export * from './Hog_Assassin/index.tsx';

export default {
  characterType: 'Robotic Hunter',
};
`);

// 3. src/Characters/Feral_Pigs
write("src/Characters/Feral_Pigs/General/index.tsx", `/**
 * Feral Pigs Root Types, Color Matrices, and Generators
 */
import { FeralPigAttributes, FeralPigColor, FeralPigSize } from '../../../General/index.tsx';

export const PigColorPaletteMap: Record<FeralPigColor, { base: string; dark: string; light: string; border: string }> = {
  [FeralPigColor.PINK]: { base: '#ff80bf', dark: '#d64d99', light: '#ffb3d9', border: '#b32470' },
  [FeralPigColor.WHITE]: { base: '#f0f0f5', dark: '#c2c2d6', light: '#ffffff', border: '#8585ad' },
  [FeralPigColor.GREEN]: { base: '#33cc33', dark: '#248f24', light: '#66e066', border: '#145214' },
  [FeralPigColor.BLUE]: { base: '#3385ff', dark: '#1a53cc', light: '#80b3ff', border: '#0f3380' },
  [FeralPigColor.BLACK]: { base: '#1f1f2e', dark: '#0d0d14', light: '#47476b', border: '#00f0ff' },
  [FeralPigColor.BROWN]: { base: '#8b4513', dark: '#5c2d0c', light: '#b35917', border: '#3d1e08' },
  [FeralPigColor.PURPLE]: { base: '#9933ff', dark: '#6600cc', light: '#bb66ff', border: '#3d0080' },
  [FeralPigColor.ORANGE]: { base: '#ff7700', dark: '#cc5f00', light: '#ffa347', border: '#803c00' },
  [FeralPigColor.GOLD]: { base: '#ffd700', dark: '#cca300', light: '#ffeb80', border: '#806600' },
  [FeralPigColor.SILVER]: { base: '#c0c0c0', dark: '#999999', light: '#e6e6e6', border: '#666666' },
  [FeralPigColor.AMBER]: { base: '#ffbf00', dark: '#cc9900', light: '#ffd24d', border: '#806000' },
  [FeralPigColor.GRAY]: { base: '#808080', dark: '#595959', light: '#a6a6a6', border: '#333333' },
  [FeralPigColor.PEACH]: { base: '#ffcba4', dark: '#e69a6b', light: '#ffe2cc', border: '#b36232' },
};

export interface PigFactoryOptions {
  row: number;
  col: number;
  canvasWidth?: number;
  color?: FeralPigColor;
  isSpotted?: boolean;
  size?: FeralPigSize;
  tuskHeight?: number;
  snoutLength?: number;
}

export function createFeralPig(options: PigFactoryOptions): FeralPigAttributes {
  const allColors = Object.values(FeralPigColor);
  const color = options.color || allColors[Math.floor(Math.random() * allColors.length)];
  const isSpotted = options.isSpotted !== undefined ? options.isSpotted : Math.random() < 0.25;

  let size = options.size;
  if (!size) {
    if (options.row === 0) size = FeralPigSize.GIANT;
    else if (options.row === 1) size = FeralPigSize.LARGE;
    else if (options.row === 2) size = FeralPigSize.MEDIUM;
    else size = FeralPigSize.SMALL;
  }

  let basePoints = 100;
  let hp = 1;
  if (size === FeralPigSize.MEDIUM) {
    basePoints = 200;
    hp = 1;
  } else if (size === FeralPigSize.LARGE) {
    basePoints = 400;
    hp = 2;
  } else if (size === FeralPigSize.GIANT) {
    basePoints = 800;
    hp = 3;
  }

  const startX = 120 + options.col * 64;
  const startY = 80 + options.row * 50;
  const tuskHeight = options.tuskHeight || (size === FeralPigSize.GIANT ? 14 : size === FeralPigSize.LARGE ? 10 : 6);
  const snoutLength = options.snoutLength || (size === FeralPigSize.GIANT ? 12 : 8);
  const spotColor = isSpotted ? (color === FeralPigColor.BLACK ? '#00f0ff' : '#ffffff') : undefined;

  return {
    id: \`pig_\${options.row}_\${options.col}_\${Date.now()}_\${Math.random()}\`,
    color,
    isSpotted,
    spotColor,
    size,
    tuskHeight,
    snoutLength,
    points: basePoints,
    hp,
    maxHp: hp,
    position: { x: startX, y: startY },
    originPosition: { x: startX, y: startY },
    velocity: { x: 0, y: 0 },
    diveAngle: 0,
    isDiving: false,
    diveTimer: 0,
    diveProgress: 0,
    divePathType: options.row % 2 === 0 ? 'direct_charge' : 's_curve',
    formationIndex: options.row * 10 + options.col,
    t: Math.random() * Math.PI * 2,
  };
}

export default {
  PigColorPaletteMap,
  createFeralPig,
};
`);

write("src/Characters/Feral_Pigs/index.tsx", `/**
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
`);

// 4. src/System/Keyboards_and_Controllers
write("src/System/Keyboards_and_Controllers/General/index.tsx", `/**
 * Keyboards and Controllers General
 */
export interface KeyState {
  ArrowLeft: boolean;
  ArrowRight: boolean;
  Space: boolean;
  Pause: boolean;
}

export const KeyboardGeneral = {
  repeatPrevented: true,
  debounceMs: 60,
};

export default KeyboardGeneral;
`);

write("src/System/Keyboards_and_Controllers/Engine/General/index.tsx", `/**
 * Keyboards and Controllers Mechanical Engine Config
 * Defines Second-Order Mass-Spring-Damper mechanical parameters for elite robotics drift control.
 */
export const CONTROLLER_PHYSICS_CONSTANTS = {
  MASS_KG: 15.0,
  DAMPING_C: 22.5,
  SPRING_K: 0.12,
  PROPULSION_FORCE_N: 350.0,
  TIMESTEP_DT: 0.016,
};

export default CONTROLLER_PHYSICS_CONSTANTS;
`);

write("src/System/Keyboards_and_Controllers/Engine/index.tsx", `/**
 * Keyboards and Controllers Mechanical Engine
 * Computes Second-Order mass-spring-damper physical simulations to move the robotic chassis:
 * m * x'' + c * x' + k * x = F_propulsion
 */
import { CONTROLLER_PHYSICS_CONSTANTS } from './General/index.tsx';

export * from './General/index.tsx';

export class KeyboardMechanicalEngine {
  private positionOffset: number = 0;
  private velocity: number = 0;

  public computeMechanicalVelocity(inputDirection: number): number {
    const m = CONTROLLER_PHYSICS_CONSTANTS.MASS_KG;
    const c = CONTROLLER_PHYSICS_CONSTANTS.DAMPING_C;
    const k = CONTROLLER_PHYSICS_CONSTANTS.SPRING_K;
    const dt = CONTROLLER_PHYSICS_CONSTANTS.TIMESTEP_DT;

    const F_prop = inputDirection * CONTROLLER_PHYSICS_CONSTANTS.PROPULSION_FORCE_N;
    const acceleration = (F_prop - c * this.velocity - k * this.positionOffset) / m;

    this.velocity += acceleration * dt;
    this.positionOffset += this.velocity * dt;

    if (Math.abs(this.velocity) > 12.0) {
      this.velocity = Math.sign(this.velocity) * 12.0;
    }

    return this.velocity;
  }

  public reset(): void {
    this.velocity = 0;
    this.positionOffset = 0;
  }
}

export default KeyboardMechanicalEngine;
`);

write("src/System/Keyboards_and_Controllers/index.tsx", `/**
 * Keyboard Input Subsystem - Prevents default auto-repeat bursts
 */
import { KeyState } from './General/index.tsx';

export * from './General/index.tsx';

export class ArcadeKeyboardManager {
  private keyState: KeyState = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    Pause: false,
  };

  private spaceDebounce = false;
  private onPauseToggleCallback: (() => void) | null = null;
  private onFireLaserCallback: (() => void) | null = null;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  public bindEvents(onPauseToggle: () => void, onFireLaser: () => void): void {
    this.onPauseToggleCallback = onPauseToggle;
    this.onFireLaserCallback = onFireLaser;
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    window.addEventListener('keyup', this.handleKeyUp);
  }

  public unbindEvents(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === '&' || (e.shiftKey && e.key === '7') || (e.shiftKey && e.code === 'Digit7')) {
      e.preventDefault();
      if (this.onPauseToggleCallback) {
        this.onPauseToggleCallback();
      }
      return;
    }

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      e.preventDefault();
      this.keyState.ArrowLeft = true;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      e.preventDefault();
      this.keyState.ArrowRight = true;
    } else if (e.code === 'Space') {
      e.preventDefault();
      if (!this.keyState.Space && !this.spaceDebounce) {
        this.keyState.Space = true;
        this.spaceDebounce = true;
        if (this.onFireLaserCallback) {
          this.onFireLaserCallback();
        }
        setTimeout(() => {
          this.spaceDebounce = false;
        }, 120);
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.keyState.ArrowLeft = false;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.keyState.ArrowRight = false;
    } else if (e.code === 'Space') {
      this.keyState.Space = false;
    }
  }

  public getKeys(): Readonly<KeyState> {
    return this.keyState;
  }
}

export default ArcadeKeyboardManager;
`);

// 5. src/System/Visuals
write("src/System/Visuals/General/index.tsx", `/**
 * Visuals General Configuration & Palettes
 */
import { SystemModuleInfo } from '../../General/index.tsx';

export const VisualsInfo: SystemModuleInfo = {
  name: 'Visuals Rendering Pipeline',
  category: 'Graphics',
  status: 'active',
};

export const COLOR_PALETTES = {
  arcadeBlack: '#000000',
  laserNeon: '#00f0ff',
  laserInner: '#ffffff',
  laserGlow: '#0088ff',
  hudGreen: '#39ff14',
  hudRed: '#ff3131',
  hudYellow: '#ffe600',
  explosionOrange: '#ff6600',
  explosionYellow: '#ffff33',
  explosionWhite: '#ffffff',
};

export default VisualsInfo;
`);

write("src/System/Visuals/Engine/General/index.tsx", `/**
 * Visuals Engine General
 */
export const VisualEngineConfig = {
  clearColor: '#000000',
  fpsTarget: 60,
  smoothing: false,
};

export default VisualEngineConfig;
`);

write("src/System/Visuals/Engine/index.tsx", `/**
 * Visuals Engine - Special Relativistic Rendering Subsystem
 */
import { Star } from '../../General/index.tsx';
import { VisualEngineConfig } from './General/index.tsx';

export * from './General/index.tsx';

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
`);

// Resolution & Animation submodules
write("src/System/Visuals/Animations/General/index.tsx", `export const AnimationInfo = { category: 'Animations' }; export default AnimationInfo;`);
write("src/System/Visuals/Animations/8-Bit/index.tsx", `export const ANIMATION_8BIT_PROFILES = { frameLockEnabled: true, frameRateCap: 15 }; export default ANIMATION_8BIT_PROFILES;`);
write("src/System/Visuals/Animations/16-Bit/index.tsx", `export const ANIMATION_16BIT_PROFILES = { frameLockEnabled: true, frameRateCap: 30 }; export default ANIMATION_16BIT_PROFILES;`);
write("src/System/Visuals/Animations/32-Bit/index.tsx", `export const ANIMATION_32BIT_PROFILES = { frameLockEnabled: false, frameRateCap: 60 }; export default ANIMATION_32BIT_PROFILES;`);
write("src/System/Visuals/Animations/64-Bit/index.tsx", `export const ANIMATION_64BIT_PROFILES = { frameLockEnabled: false, frameRateCap: 120 }; export default ANIMATION_64BIT_PROFILES;`);
write("src/System/Visuals/Animations/index.tsx", `export * from './General/index.tsx'; export * from './8-Bit/index.tsx'; export * from './16-Bit/index.tsx'; export * from './32-Bit/index.tsx'; export * from './64-Bit/index.tsx'; export default { module: 'Animations' };`);

write("src/System/Visuals/Resolution/General/index.tsx", `export const ResolutionHierarchy = { 'Medium': { width: 800, height: 600, scale: 1.0 } }; export default ResolutionHierarchy;`);
write("src/System/Visuals/Resolution/8-Bit/index.tsx", `export const RESOLUTION_8BIT_PROFILES = { scalingWidth: 320, scalingHeight: 240 }; export default RESOLUTION_8BIT_PROFILES;`);
write("src/System/Visuals/Resolution/16-Bit/index.tsx", `export const RESOLUTION_16BIT_PROFILES = { scalingWidth: 640, scalingHeight: 480 }; export default RESOLUTION_16BIT_PROFILES;`);
write("src/System/Visuals/Resolution/32-Bit/index.tsx", `export const RESOLUTION_32BIT_PROFILES = { scalingWidth: 1280, scalingHeight: 720 }; export default RESOLUTION_32BIT_PROFILES;`);
write("src/System/Visuals/Resolution/64-Bit/index.tsx", `export const RESOLUTION_64BIT_PROFILES = { scalingWidth: 2560, scalingHeight: 1440 }; export default RESOLUTION_64BIT_PROFILES;`);
write("src/System/Visuals/Resolution/index.tsx", `export * from './General/index.tsx'; export * from './8-Bit/index.tsx'; export * from './16-Bit/index.tsx'; export * from './32-Bit/index.tsx'; export * from './64-Bit/index.tsx'; export function calculateCanvasScale(targetScale: number = 1.0) { return { scaleX: targetScale, scaleY: targetScale }; } export default { calculateCanvasScale };`);
write("src/System/Visuals/index.tsx", `export * from './General/index.tsx'; export * from './Animations/index.tsx'; export * from './Resolution/index.tsx'; export * from './Engine/index.tsx'; export default { module: 'Visuals Core' };`);

console.log('[Part 1] Complete!');
