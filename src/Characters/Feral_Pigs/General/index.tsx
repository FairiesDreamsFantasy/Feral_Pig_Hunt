/**
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
    id: `pig_${options.row}_${options.col}_${Date.now()}_${Math.random()}`,
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
