import { WaveTacticalSeed, DEFAULT_TACTICAL_SEED } from '../General/index.tsx';
import { PlayerSessionTelemetry, DynamicAITension, IDEAL_TENSION_TARGET } from './General/index.tsx';
import { inGameDriftGuardInstance } from './Drift_Guard/index.tsx';

export * from './General/index.tsx';
export * from './Drift_Guard/index.tsx';
export * as TTS from './TTS/index.tsx';
export * from './TTS/index.tsx';

export function calculateTacticalWaveParameters(waveNumber: number, customSeed?: WaveTacticalSeed | null): WaveTacticalSeed {
  const calcStart = performance.now();
  let generatedSeed: WaveTacticalSeed;

  if (customSeed) {
    generatedSeed = {
      ...customSeed,
      waveSpeedMultiplier: customSeed.waveSpeedMultiplier * (1 + (waveNumber - 1) * 0.08),
      diveAggression: customSeed.diveAggression * (1 + (waveNumber - 1) * 0.12),
    };
  } else {
    const baseMultiplier = 1.0 + (waveNumber - 1) * 0.08;
    generatedSeed = {
      ...DEFAULT_TACTICAL_SEED,
      seedNumber: waveNumber * 1337,
      waveSpeedMultiplier: baseMultiplier,
      diveAggression: Math.min(2.5, 1.0 + (waveNumber - 1) * 0.15),
      spottedRatio: Math.min(0.6, 0.2 + waveNumber * 0.05),
    };
  }

  const durationMs = performance.now() - calcStart;
  const { sanitizedSeed } = inGameDriftGuardInstance.auditWaveParameters(waveNumber, generatedSeed, durationMs);
  return sanitizedSeed;
}

/**
 * Modern Closed-Loop PID-Inspired Tension Controller
 * Dynamically computes game tension score from 0.5 to 3.0 based on real-time session telemetry.
 */
export function calculateDynamicAITension(telemetry: PlayerSessionTelemetry): DynamicAITension {
  const accuracy = telemetry.shotsFired > 0 ? telemetry.shotsHit / telemetry.shotsFired : 0.5;
  
  // Speed ratio comparing current wave duration with historic clearances
  const averageWaveClearTime = telemetry.waveClearTimes.length > 0 
    ? telemetry.waveClearTimes.reduce((a, b) => a + b, 0) / telemetry.waveClearTimes.length
    : 15; // default 15 seconds
  const speedRatio = telemetry.currentWaveDuration > 0
    ? averageWaveClearTime / Math.max(1, telemetry.currentWaveDuration)
    : 1.0;

  // Base player performance index (PPI)
  const ppi = (accuracy * 1.2) + (Math.min(2.0, speedRatio) * 0.6) + ((3 - telemetry.livesRemaining) * 0.1);

  // Proportional scaling of tension around target sweetspot
  let tensionScore = 1.0 + (ppi - IDEAL_TENSION_TARGET) * 0.75;
  tensionScore = Math.max(0.6, Math.min(2.8, tensionScore)); // clamp to safe limits

  // Highly skilled players trigger predictive intercept charges and wider zigzag sweeps
  const predictiveCharge = tensionScore > 1.25;
  const zigZagFactor = tensionScore > 1.5 ? Math.min(1.8, (tensionScore - 1.0) * 1.5) : 0.0;
  const diveFrequencyMultiplier = Math.max(0.5, Math.min(2.2, tensionScore * 1.1));

  const rawTension: DynamicAITension = {
    tensionScore,
    predictiveCharge,
    zigZagFactor,
    diveFrequencyMultiplier,
  };

  const { sanitizedTension } = inGameDriftGuardInstance.auditDynamicTension(rawTension, telemetry);
  return sanitizedTension;
}

/**
 * Advanced Intercept Vector Solver
 * Solves where the pig should charge horizontally to intercept the moving player
 * based on the pig's vertical drop velocity and the player's slide speed.
 */
export function calculatePredictiveIntercept(
  pigPos: { x: number; y: number },
  pigBaseSpeedY: number,
  playerPos: { x: number; y: number },
  playerVelocityX: number
): number {
  const distanceY = playerPos.y - pigPos.y;
  if (distanceY <= 0) return playerPos.x;

  // Estimate cycles/frames of flight before reaching player height
  const flightCycles = distanceY / Math.max(1.0, pigBaseSpeedY);
  
  // Calculate projected horizontal position
  let projectedX = playerPos.x + playerVelocityX * flightCycles;
  
  // Keep projected path inside screen boundaries
  const maxBoundary = 800 - 32;
  const minBoundary = 32;
  projectedX = Math.max(minBoundary, Math.min(maxBoundary, projectedX));

  return projectedX;
}

export default {
  calculateTacticalWaveParameters,
  calculateDynamicAITension,
  calculatePredictiveIntercept,
};
