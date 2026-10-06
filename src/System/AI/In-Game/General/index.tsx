/**
 * In-Game AI General Telemetry and Controller Parameters
 */
export interface PlayerSessionTelemetry {
  shotsFired: number;
  shotsHit: number;
  waveClearTimes: number[];
  currentWaveDuration: number;
  livesRemaining: number;
  playerPos: { x: number; y: number };
  playerVelocityX: number;
}

export interface DynamicAITension {
  tensionScore: number;       // Calculated feedback score from 0.0 to 3.0
  predictiveCharge: boolean;  // Enables predictive intercept targeting calculations
  zigZagFactor: number;       // Width multiplier for wild thrashes during charging
  diveFrequencyMultiplier: number;
}

export const IDEAL_TENSION_TARGET = 1.0; // Dynamic tension reference target for balance

export default {
  IDEAL_TENSION_TARGET
};
