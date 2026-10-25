/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum GameState {
  TITLE = "TITLE",
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  GAME_OVER = "GAME_OVER",
  WAVE_TRANSITION = "WAVE_TRANSITION",
}

export enum PigSize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  GIANT = "GIANT",
}

export enum PigColor {
  PINK = "Pink",
  WHITE = "White",
  GREEN = "Green",
  BLUE = "Blue",
  BLACK = "Black",
  BROWN = "Brown",
  PURPLE = "Purple",
  ORANGE = "Orange",
  GOLD = "Gold",
  SILVER = "Silver",
  AMBER = "Amber",
  GRAY = "Gray",
  PEACH = "Peach",
}

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface TacticalSeed {
  seedNumber: number;
  waveSpeedMultiplier: number;
  diveAggression: number;
  spottedRatio: number;
  formationPattern: string;
  pigQuotes: string[];
}

export interface Pig {
  id: string;
  color: PigColor;
  isSpotted: boolean;
  spotColor?: string;
  size: PigSize;
  tuskHeight: number;
  snoutLength: number;
  points: number;
  hp: number;
  maxHp: number;
  position: Position;
  originPosition: Position;
  velocity: Velocity;
  diveAngle: number;
  isDiving: boolean;
  diveTimer: number;
  diveProgress: number;
  divePathType: string;
  formationIndex: number;
  t: number;
}

export interface LaserSegment {
  yOffset: number;
  alpha: number;
  height: number;
}

export interface Laser {
  id: string;
  x: number;
  y: number;
  lengthUnits: number;
  vy: number;
  segments: LaserSegment[];
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

export interface ColorScheme {
  base: string;
  dark: string;
  light: string;
  border: string;
}

export const COLOR_PALETTE: Record<PigColor, ColorScheme> = {
  [PigColor.PINK]: { base: "#ff80bf", dark: "#d64d99", light: "#ffb3d9", border: "#b32470" },
  [PigColor.WHITE]: { base: "#f0f0f5", dark: "#c2c2d6", light: "#ffffff", border: "#8585ad" },
  [PigColor.GREEN]: { base: "#33cc33", dark: "#248f24", light: "#66e066", border: "#145214" },
  [PigColor.BLUE]: { base: "#3385ff", dark: "#1a53cc", light: "#80b3ff", border: "#0f3380" },
  [PigColor.BLACK]: { base: "#1f1f2e", dark: "#0d0d14", light: "#47476b", border: "#00f0ff" },
  [PigColor.BROWN]: { base: "#8b4513", dark: "#5c2d0c", light: "#b35917", border: "#3d1e08" },
  [PigColor.PURPLE]: { base: "#9933ff", dark: "#6600cc", light: "#bb66ff", border: "#3d0080" },
  [PigColor.ORANGE]: { base: "#ff7700", dark: "#cc5f00", light: "#ffa347", border: "#803c00" },
  [PigColor.GOLD]: { base: "#ffd700", dark: "#cca300", light: "#ffeb80", border: "#806600" },
  [PigColor.SILVER]: { base: "#c0c0c0", dark: "#999999", light: "#e6e6e6", border: "#666666" },
  [PigColor.AMBER]: { base: "#ffbf00", dark: "#cc9900", light: "#ffd24d", border: "#806000" },
  [PigColor.GRAY]: { base: "#808080", dark: "#595959", light: "#a6a6a6", border: "#333333" },
  [PigColor.PEACH]: { base: "#ffcba4", dark: "#e69a6b", light: "#ffe2cc", border: "#b36232" },
};

export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  MAX_LIVES: 3,
  MAX_PLAYER_LASERS: 4,
};
