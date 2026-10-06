/**
 * System/AI/In-Game/Drift_Guard
 * Ultra-scientific closed-loop drift detection and enforcement engine.
 * Guards tactical seeds, tension calculations, and predictive intercept limits against numerical divergence.
 */

import { WaveTacticalSeed } from '../../General/index.tsx';
import { DynamicAITension, PlayerSessionTelemetry } from '../General/index.tsx';
import {
  InGameDriftThresholds,
  DEFAULT_INGAME_DRIFT_THRESHOLDS,
  InGameDriftReport,
  DriftSeverity,
} from './General/index.tsx';

export * from './General/index.tsx';

/**
 * In-Game Tactical & Telemetry Drift Guard
 */
export class InGameDriftGuard {
  private thresholds: InGameDriftThresholds;
  private recentReports: InGameDriftReport[] = [];
  private readonly maxStoredReports = 50;

  constructor(customThresholds?: Partial<InGameDriftThresholds>) {
    this.thresholds = {
      ...DEFAULT_INGAME_DRIFT_THRESHOLDS,
      ...customThresholds,
    };
  }

  /**
   * Validates and enforces safe boundaries on generated wave tactical parameters.
   */
  public auditWaveParameters(
    waveNumber: number,
    seed: WaveTacticalSeed,
    calculationDurationMs: number = 0
  ): { sanitizedSeed: WaveTacticalSeed; report: InGameDriftReport } {
    const anomalies: string[] = [];
    let severity: DriftSeverity = 'NORMAL';
    const markWarning = () => {
      if (severity !== 'CRITICAL') {
        severity = 'WARNING';
      }
    };

    // 1. Audit wave speed multiplier
    let waveSpeedMultiplier = seed.waveSpeedMultiplier;
    if (isNaN(waveSpeedMultiplier) || !isFinite(waveSpeedMultiplier)) {
      anomalies.push(`Invalid waveSpeedMultiplier (NaN/Infinite) detected for wave ${waveNumber}.`);
      waveSpeedMultiplier = 1.0;
      severity = 'CRITICAL';
    } else if (waveSpeedMultiplier > this.thresholds.maxWaveSpeedMultiplier) {
      anomalies.push(`Wave speed drift: ${waveSpeedMultiplier.toFixed(2)} exceeds threshold ${this.thresholds.maxWaveSpeedMultiplier}. Clamping.`);
      waveSpeedMultiplier = this.thresholds.maxWaveSpeedMultiplier;
      markWarning();
    } else if (waveSpeedMultiplier < 0.5) {
      anomalies.push(`Wave speed underflow drift: ${waveSpeedMultiplier.toFixed(2)} is under 0.5. Clamping.`);
      waveSpeedMultiplier = 0.5;
      markWarning();
    }

    // 2. Audit dive aggression
    let diveAggression = seed.diveAggression;
    if (isNaN(diveAggression) || !isFinite(diveAggression)) {
      anomalies.push(`Invalid diveAggression (NaN/Infinite) detected for wave ${waveNumber}.`);
      diveAggression = 1.0;
      severity = 'CRITICAL';
    } else if (diveAggression > this.thresholds.maxDiveAggression) {
      anomalies.push(`Dive aggression drift: ${diveAggression.toFixed(2)} exceeds threshold ${this.thresholds.maxDiveAggression}. Clamping.`);
      diveAggression = this.thresholds.maxDiveAggression;
      markWarning();
    } else if (diveAggression < 0.5) {
      anomalies.push(`Dive aggression underflow drift: ${diveAggression.toFixed(2)} is under 0.5. Clamping.`);
      diveAggression = 0.5;
      markWarning();
    }

    // 3. Audit spotted ratio
    let spottedRatio = seed.spottedRatio;
    if (isNaN(spottedRatio) || !isFinite(spottedRatio)) {
      anomalies.push(`Invalid spottedRatio detected for wave ${waveNumber}.`);
      spottedRatio = 0.3;
      severity = 'CRITICAL';
    } else if (spottedRatio > this.thresholds.maxSpottedRatio) {
      anomalies.push(`Spotted ratio drift: ${spottedRatio.toFixed(2)} exceeds ceiling. Clamping.`);
      spottedRatio = this.thresholds.maxSpottedRatio;
      markWarning();
    } else if (spottedRatio < 0.0) {
      spottedRatio = 0.0;
    }

    // 4. Audit calculation latency
    if (calculationDurationMs > this.thresholds.maxCalculatedLatencyMs) {
      anomalies.push(`Algorithmic timing drift: Wave calculation took ${calculationDurationMs.toFixed(2)}ms (Limit: ${this.thresholds.maxCalculatedLatencyMs}ms).`);
      markWarning();
    }

    const sanitizedSeed: WaveTacticalSeed = {
      ...seed,
      waveSpeedMultiplier,
      diveAggression,
      spottedRatio,
    };

    const report: InGameDriftReport = {
      timestamp: new Date().toISOString(),
      driftDetected: anomalies.length > 0,
      severity,
      anomalies,
      metrics: {
        tensionScore: 1.0,
        waveSpeedMultiplier,
        diveAggression,
        spottedRatio,
        calculationTimeMs: calculationDurationMs,
      },
    };

    this.recordReport(report);
    return { sanitizedSeed, report };
  }

  /**
   * Validates dynamic tension calculations against mathematical limits.
   */
  public auditDynamicTension(
    tension: DynamicAITension,
    telemetry: PlayerSessionTelemetry
  ): { sanitizedTension: DynamicAITension; report: InGameDriftReport } {
    const anomalies: string[] = [];
    let severity: DriftSeverity = 'NORMAL';

    let tensionScore = tension.tensionScore;
    if (isNaN(tensionScore) || !isFinite(tensionScore)) {
      anomalies.push(`Mathematical tension calculation divergence (NaN/Infinite).`);
      tensionScore = 1.0;
      severity = 'CRITICAL';
    } else if (tensionScore < this.thresholds.minTensionScore || tensionScore > this.thresholds.maxTensionScore) {
      anomalies.push(`Tension score drift: ${tensionScore.toFixed(2)} outside acceptable envelope [${this.thresholds.minTensionScore}, ${this.thresholds.maxTensionScore}]. Clamping.`);
      tensionScore = Math.max(this.thresholds.minTensionScore, Math.min(this.thresholds.maxTensionScore, tensionScore));
      severity = 'WARNING';
    }

    let zigZagFactor = tension.zigZagFactor;
    if (isNaN(zigZagFactor) || !isFinite(zigZagFactor) || zigZagFactor < 0) {
      zigZagFactor = 0;
    } else if (zigZagFactor > this.thresholds.maxZigZagFactor) {
      anomalies.push(`Zigzag factor drift: ${zigZagFactor.toFixed(2)} clamped to ${this.thresholds.maxZigZagFactor}.`);
      zigZagFactor = this.thresholds.maxZigZagFactor;
      severity = 'WARNING';
    }

    const sanitizedTension: DynamicAITension = {
      ...tension,
      tensionScore,
      zigZagFactor,
    };

    const report: InGameDriftReport = {
      timestamp: new Date().toISOString(),
      driftDetected: anomalies.length > 0,
      severity,
      anomalies,
      metrics: {
        tensionScore,
        waveSpeedMultiplier: 1.0,
        diveAggression: 1.0,
        spottedRatio: 0.0,
        calculationTimeMs: 0,
      },
    };

    if (report.driftDetected) {
      this.recordReport(report);
    }

    return { sanitizedTension, report };
  }

  private recordReport(report: InGameDriftReport): void {
    this.recentReports.unshift(report);
    if (this.recentReports.length > this.maxStoredReports) {
      this.recentReports.pop();
    }
  }

  public getReports(): InGameDriftReport[] {
    return [...this.recentReports];
  }

  public clearReports(): void {
    this.recentReports = [];
  }
}

export const inGameDriftGuardInstance = new InGameDriftGuard();
export default inGameDriftGuardInstance;
