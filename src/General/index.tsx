/**
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

export interface SystemModuleInfo {
  name: string;
  category: string;
  status: 'active' | 'inactive';
}

export const GeneralSystem = {
  version: '1.0.0',
  description: 'Pure client-side Arcade Game System Core',
};

export default GeneralSystem;

