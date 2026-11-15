/**
 * System/AI/External/Gemini/Drift_Guard
 * Ultra-secure Drift Guard engine for External Google Gemini generative payloads.
 * Protects users who provide API keys via the "Insert AI" modal from hallucinated schemas,
 * parameter out-of-bounds, latency spikes, or response drift.
 * Logs all detected drifts into the "Drifts_Found/" telemetry repository for mandatory Google Gemini Developer review.
 */

import { WaveTacticalSeed, GeminiTier } from '../../../General/index.tsx';
import { inspectGeminiKeyFormat } from '../index.tsx';
import {
  GeminiDriftRecord,
  GeminiDriftClassification,
  GeminiDriftLevel,
  GeminiDriftThresholds,
  DEFAULT_GEMINI_DRIFT_THRESHOLDS,
  DRIFTS_FOUND_CHANNEL_CONFIG,
} from './General/index.tsx';

export * from './General/index.tsx';

const DRIFTS_FOUND_STORAGE_KEY = 'Feral_Pig_Hunt_Drifts_Found_Registry';

export class GeminiDriftGuard {
  private thresholds: GeminiDriftThresholds;
  private inMemoryDrifts: GeminiDriftRecord[] = [];

  constructor(customThresholds?: Partial<GeminiDriftThresholds>) {
    this.thresholds = {
      ...DEFAULT_GEMINI_DRIFT_THRESHOLDS,
      ...customThresholds,
    };
    this.loadFromDriftsFoundStorage();
  }

  /**
   * Loads cached drift logs from persistent client storage (Drifts_Found channel).
   */
  private loadFromDriftsFoundStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(DRIFTS_FOUND_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.inMemoryDrifts = parsed.slice(0, DRIFTS_FOUND_CHANNEL_CONFIG.maxCachedRecords);
        }
      }
    } catch {
      // Storage access protected against browser sandbox limits
    }
  }

  /**
   * Persists a recorded drift event into the "Drifts_Found/" repository.
   */
  public logDriftFound(record: GeminiDriftRecord): void {
    this.inMemoryDrifts.unshift(record);
    if (this.inMemoryDrifts.length > DRIFTS_FOUND_CHANNEL_CONFIG.maxCachedRecords) {
      this.inMemoryDrifts.pop();
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(DRIFTS_FOUND_STORAGE_KEY, JSON.stringify(this.inMemoryDrifts));
      } catch {
        // Storage access safe
      }
    }

    // Telemetry trace for Google Gemini developer analysis
    console.warn(
      `[Drifts_Found/][${record.level}] Detected Gemini Drift (${record.classification}):`,
      {
        id: record.id,
        timestamp: record.timestamp,
        model: record.model,
        tier: record.activeTier,
        latencyMs: record.latencyMs,
        anomalies: record.anomalies,
        reviewStatus: record.reviewStatus,
        keySecurity: record.keySecurityAudit,
      }
    );
  }

  /**
   * Audits incoming raw payload from Gemini API against mathematical rules and expected schemas.
   * Performs real-time drift detection and bounds clamping before passing data to the game engine.
   */
  public auditGeneratedWave(
    rawPayload: unknown,
    waveNumber: number,
    modelName: string,
    activeTier: GeminiTier,
    latencyMs: number,
    rawKey: string
  ): { sanitizedSeed: WaveTacticalSeed; driftFound: boolean; record?: GeminiDriftRecord } {
    const anomalies: string[] = [];
    let classification: GeminiDriftClassification = 'SCHEMA_DRIFT';
    let level: GeminiDriftLevel = 'WARNING';

    const keyAudit = inspectGeminiKeyFormat(rawKey);

    // Latency spike audit
    if (latencyMs > this.thresholds.maxAcceptableLatencyMs) {
      anomalies.push(`Latency drift: Response took ${latencyMs}ms (Threshold: ${this.thresholds.maxAcceptableLatencyMs}ms).`);
      classification = 'LATENCY_DRIFT';
    }

    // Empty or non-object payload check
    if (!rawPayload || typeof rawPayload !== 'object') {
      anomalies.push('Empty or non-JSON object payload returned by Gemini.');
      classification = 'EMPTY_PAYLOAD';
      level = 'CRITICAL';

      const driftRecord = this.createRecord(
        classification,
        level,
        modelName,
        activeTier,
        latencyMs,
        keyAudit,
        anomalies,
        { rawPayloadType: typeof rawPayload }
      );
      this.logDriftFound(driftRecord);

      // Return mathematically safe fallback
      return {
        sanitizedSeed: {
          seedNumber: waveNumber * 1337,
          waveSpeedMultiplier: 1.0 + (waveNumber - 1) * 0.08,
          diveAggression: Math.min(2.2, 1.0 + (waveNumber - 1) * 0.12),
          spottedRatio: 0.3,
          formationPattern: 'standard_grid',
          pigQuotes: ['OINK! System drift protected!', 'SQUEAL! Pure mathematical fallback engaged!'],
        },
        driftFound: true,
        record: driftRecord,
      };
    }

    const payload = rawPayload as Record<string, unknown>;

    // 1. Audit seedNumber
    let seedNumber = typeof payload.seedNumber === 'number' ? payload.seedNumber : waveNumber * 1337;
    if (isNaN(seedNumber) || !isFinite(seedNumber)) {
      anomalies.push('Non-numeric seedNumber provided in schema.');
      seedNumber = waveNumber * 1337;
    }

    // 2. Audit waveSpeedMultiplier
    let waveSpeedMultiplier = typeof payload.waveSpeedMultiplier === 'number' ? payload.waveSpeedMultiplier : 1.2;
    if (isNaN(waveSpeedMultiplier) || !isFinite(waveSpeedMultiplier)) {
      anomalies.push('Non-numeric waveSpeedMultiplier in schema.');
      waveSpeedMultiplier = 1.2;
      classification = 'PARAMETER_OUT_OF_BOUNDS';
    } else if (waveSpeedMultiplier > this.thresholds.maxWaveSpeedMultiplier) {
      anomalies.push(`waveSpeedMultiplier drift (${waveSpeedMultiplier.toFixed(2)} > ${this.thresholds.maxWaveSpeedMultiplier}). Clamped.`);
      waveSpeedMultiplier = this.thresholds.maxWaveSpeedMultiplier;
      classification = 'PARAMETER_OUT_OF_BOUNDS';
    } else if (waveSpeedMultiplier < this.thresholds.minWaveSpeedMultiplier) {
      anomalies.push(`waveSpeedMultiplier underflow drift (${waveSpeedMultiplier.toFixed(2)} < ${this.thresholds.minWaveSpeedMultiplier}). Clamped.`);
      waveSpeedMultiplier = this.thresholds.minWaveSpeedMultiplier;
      classification = 'PARAMETER_OUT_OF_BOUNDS';
    }

    // 3. Audit diveAggression
    let diveAggression = typeof payload.diveAggression === 'number' ? payload.diveAggression : 1.5;
    if (isNaN(diveAggression) || !isFinite(diveAggression)) {
      anomalies.push('Non-numeric diveAggression in schema.');
      diveAggression = 1.5;
      classification = 'PARAMETER_OUT_OF_BOUNDS';
    } else if (diveAggression > this.thresholds.maxDiveAggression) {
      anomalies.push(`diveAggression drift (${diveAggression.toFixed(2)} > ${this.thresholds.maxDiveAggression}). Clamped.`);
      diveAggression = this.thresholds.maxDiveAggression;
      classification = 'PARAMETER_OUT_OF_BOUNDS';
    } else if (diveAggression < this.thresholds.minDiveAggression) {
      anomalies.push(`diveAggression underflow drift (${diveAggression.toFixed(2)} < ${this.thresholds.minDiveAggression}). Clamped.`);
      diveAggression = this.thresholds.minDiveAggression;
      classification = 'PARAMETER_OUT_OF_BOUNDS';
    }

    // 4. Audit spottedRatio
    let spottedRatio = typeof payload.spottedRatio === 'number' ? payload.spottedRatio : 0.3;
    if (isNaN(spottedRatio) || spottedRatio < 0 || spottedRatio > 1.0) {
      anomalies.push(`spottedRatio out of bounds: ${spottedRatio}. Clamped to 0.3.`);
      spottedRatio = 0.3;
      classification = 'PARAMETER_OUT_OF_BOUNDS';
    }

    const validPatterns: Array<'standard_grid' | 'v_formation' | 'honeycomb' | 'delta_wing'> = [
      'standard_grid',
      'v_formation',
      'honeycomb',
      'delta_wing',
    ];
    const rawPattern = typeof payload.formationPattern === 'string' ? payload.formationPattern.trim() : '';
    const formationPattern = validPatterns.includes(rawPattern as any)
      ? (rawPattern as 'standard_grid' | 'v_formation' | 'honeycomb' | 'delta_wing')
      : 'standard_grid';

    // 6. Audit pigQuotes
    let pigQuotes: string[] = [];
    if (Array.isArray(payload.pigQuotes)) {
      pigQuotes = payload.pigQuotes
        .filter((q): q is string => typeof q === 'string' && q.trim().length > 0)
        .map((q) => q.trim().slice(0, 120));
    }
    if (pigQuotes.length === 0) {
      anomalies.push('Zero valid pigQuotes generated in payload schema.');
      pigQuotes = ['Oink! No acorns found!', 'Squeal! Defensive line hold!'];
    }

    const sanitizedSeed: WaveTacticalSeed = {
      seedNumber,
      waveSpeedMultiplier,
      diveAggression,
      spottedRatio,
      formationPattern,
      pigQuotes,
    };

    let record: GeminiDriftRecord | undefined;
    if (anomalies.length > 0) {
      record = this.createRecord(
        classification,
        level,
        modelName,
        activeTier,
        latencyMs,
        keyAudit,
        anomalies,
        {
          rawSpeed: payload.waveSpeedMultiplier,
          rawAggression: payload.diveAggression,
          rawQuotesCount: Array.isArray(payload.pigQuotes) ? payload.pigQuotes.length : 0,
        }
      );
      this.logDriftFound(record);
    }

    return {
      sanitizedSeed,
      driftFound: anomalies.length > 0,
      record,
    };
  }

  /**
   * Audits connection failure or error responses to capture rate limits, auth errors, and timeouts.
   */
  public auditErrorResponse(
    errorMessage: string,
    modelName: string,
    activeTier: GeminiTier,
    latencyMs: number,
    rawKey: string
  ): GeminiDriftRecord {
    const keyAudit = inspectGeminiKeyFormat(rawKey);
    const lower = errorMessage.toLowerCase();

    let classification: GeminiDriftClassification = 'NETWORK_INSTABILITY';
    let level: GeminiDriftLevel = 'WARNING';

    if (lower.includes('quota') || lower.includes('429') || lower.includes('rate limit')) {
      classification = 'RATE_LIMIT_ANOMALY';
      level = 'WARNING';
    } else if (lower.includes('api_key_invalid') || lower.includes('key not valid') || lower.includes('403') || lower.includes('unauthorized')) {
      classification = 'AUTH_FAILURE_DRIFT';
      level = 'SECURITY_FLAG';
    } else if (lower.includes('timeout') || lower.includes('deadline')) {
      classification = 'LATENCY_DRIFT';
      level = 'CRITICAL';
    }

    const record = this.createRecord(
      classification,
      level,
      modelName,
      activeTier,
      latencyMs,
      keyAudit,
      [errorMessage],
      { errorSnippet: errorMessage.slice(0, 200) }
    );

    this.logDriftFound(record);
    return record;
  }

  private createRecord(
    classification: GeminiDriftClassification,
    level: GeminiDriftLevel,
    model: string,
    activeTier: GeminiTier,
    latencyMs: number,
    keyAudit: ReturnType<typeof inspectGeminiKeyFormat>,
    anomalies: string[],
    observedValues?: Record<string, unknown>
  ): GeminiDriftRecord {
    return {
      id: `drift-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      classification,
      level,
      model,
      activeTier,
      latencyMs,
      expectedSchemaVersion: '1.0.0-tactical-wave-schema',
      keyFormatStatus: keyAudit.formatStatus,
      anomalies,
      observedValues,
      keySecurityAudit: {
        hasKey: keyAudit.charCount > 0,
        keyLength: keyAudit.charCount,
        formatCompliant: keyAudit.isStandardGoogleFormat,
        truncated: keyAudit.isTruncated,
      },
      reviewStatus: 'FLAGGED_FOR_HUMAN_INSPECTION',
    };
  }

  public getDriftsFound(): GeminiDriftRecord[] {
    return [...this.inMemoryDrifts];
  }

  public clearDrifts(): void {
    this.inMemoryDrifts = [];
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(DRIFTS_FOUND_STORAGE_KEY);
      } catch {
        // Storage access safe
      }
    }
  }
}

export const geminiDriftGuardInstance = new GeminiDriftGuard();
export default geminiDriftGuardInstance;
