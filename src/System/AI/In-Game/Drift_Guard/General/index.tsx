/**
 * System/AI/In-Game/Drift_Guard/General
 * Interfaces and baseline thresholds for In-Game AI telemetry and tactical parameters drift detection.
 */

export interface InGameDriftThresholds {
  minTensionScore: number;
  maxTensionScore: number;
  maxWaveSpeedMultiplier: number;
  maxDiveAggression: number;
  maxSpottedRatio: number;
  maxZigZagFactor: number;
  maxCalculatedLatencyMs: number;
}

export const DEFAULT_INGAME_DRIFT_THRESHOLDS: InGameDriftThresholds = {
  minTensionScore: 0.6,
  maxTensionScore: 2.8,
  maxWaveSpeedMultiplier: 3.5,
  maxDiveAggression: 3.5,
  maxSpottedRatio: 0.9,
  maxZigZagFactor: 2.5,
  maxCalculatedLatencyMs: 16.67, // 60 FPS frame time limit
};

export type DriftSeverity = 'NORMAL' | 'WARNING' | 'CRITICAL';

export interface InGameDriftReport {
  timestamp: string;
  driftDetected: boolean;
  severity: DriftSeverity;
  anomalies: string[];
  metrics: {
    tensionScore: number;
    waveSpeedMultiplier: number;
    diveAggression: number;
    spottedRatio: number;
    calculationTimeMs: number;
  };
}

export default DEFAULT_INGAME_DRIFT_THRESHOLDS;
