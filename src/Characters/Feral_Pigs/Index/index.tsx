/**
 * src/Characters/Feral_Pigs/Index/index.tsx
 * Procedural index engine managing procedural generation metrics, spawn coefficients, and attribute scaling for Feral Pigs.
 */

import { FeralPigSize, FeralPigColor } from '../../../General/index.tsx';

export interface FeralPigGenerationConfig {
  sizeCoefficients: Record<FeralPigSize, number>;
  colorVulnerabilities: Record<FeralPigColor, number>;
  baseSquealFrequency: number;
  tacticalSpeedMultiplier: number;
}

export const FERAL_PIG_INDEX_CONFIG: FeralPigGenerationConfig = {
  sizeCoefficients: {
    [FeralPigSize.SMALL]: 0.8,
    [FeralPigSize.MEDIUM]: 1.0,
    [FeralPigSize.LARGE]: 1.35,
    [FeralPigSize.GIANT]: 1.8
  },
  colorVulnerabilities: {
    [FeralPigColor.PINK]: 1.0,
    [FeralPigColor.WHITE]: 1.1,
    [FeralPigColor.GREEN]: 1.25,
    [FeralPigColor.BLUE]: 1.3,
    [FeralPigColor.BLACK]: 0.9,
    [FeralPigColor.BROWN]: 0.95,
    [FeralPigColor.PURPLE]: 1.4,
    [FeralPigColor.ORANGE]: 1.2,
    [FeralPigColor.GOLD]: 0.7,
    [FeralPigColor.SILVER]: 0.8,
    [FeralPigColor.AMBER]: 1.15,
    [FeralPigColor.GRAY]: 1.05,
    [FeralPigColor.PEACH]: 1.12
  },
  baseSquealFrequency: 880, // Hz
  tacticalSpeedMultiplier: 1.15
};

export function computeScaledHP(baseHp: number, size: FeralPigSize): number {
  const coeff = FERAL_PIG_INDEX_CONFIG.sizeCoefficients[size] || 1.0;
  return Math.ceil(baseHp * coeff);
}

export default {
  config: FERAL_PIG_INDEX_CONFIG,
  computeScaledHP
};
