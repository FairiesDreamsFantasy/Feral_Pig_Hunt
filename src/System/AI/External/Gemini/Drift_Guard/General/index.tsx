/**
 * System/AI/External/Gemini/Drift_Guard/General
 * Types, interfaces, and telemetry configuration for Google Gemini Drift Guard and Drifts_Found logging.
 */

import { GeminiTier } from '../../../../General/index.tsx';
import { KeyFormatStatus } from '../../General/index.tsx';

export type GeminiDriftClassification =
  | 'SCHEMA_DRIFT'
  | 'LATENCY_DRIFT'
  | 'RATE_LIMIT_ANOMALY'
  | 'PARAMETER_OUT_OF_BOUNDS'
  | 'EMPTY_PAYLOAD'
  | 'AUTH_FAILURE_DRIFT'
  | 'NETWORK_INSTABILITY';

export type GeminiDriftLevel = 'INFO' | 'WARNING' | 'CRITICAL' | 'SECURITY_FLAG';

export interface GeminiDriftRecord {
  id: string;
  timestamp: string;
  classification: GeminiDriftClassification;
  level: GeminiDriftLevel;
  model: string;
  activeTier: GeminiTier;
  latencyMs: number;
  expectedSchemaVersion: string;
  keyFormatStatus: KeyFormatStatus;
  anomalies: string[];
  observedValues?: Record<string, unknown>;
  /**
   * CRITICAL SECURITY DIRECTIVE:
   * Under NO circumstances may raw API keys or credential secrets be logged.
   * Only cryptographic key verification tokens, length, and format hashes are permitted.
   */
  keySecurityAudit: {
    hasKey: boolean;
    keyLength: number;
    formatCompliant: boolean;
    truncated: boolean;
  };
  reviewStatus: 'PENDING_DEVELOPER_REVIEW' | 'FLAGGED_FOR_HUMAN_INSPECTION';
}

export interface GeminiDriftThresholds {
  maxAcceptableLatencyMs: number;
  maxWaveSpeedMultiplier: number;
  minWaveSpeedMultiplier: number;
  maxDiveAggression: number;
  minDiveAggression: number;
  maxSpottedRatio: number;
  requiredPigQuotesCount: number;
}

export const DEFAULT_GEMINI_DRIFT_THRESHOLDS: GeminiDriftThresholds = {
  maxAcceptableLatencyMs: 6000,
  maxWaveSpeedMultiplier: 2.2,
  minWaveSpeedMultiplier: 0.8,
  maxDiveAggression: 3.0,
  minDiveAggression: 0.8,
  maxSpottedRatio: 0.85,
  requiredPigQuotesCount: 3,
};

export interface DriftsFoundStorageChannel {
  folder: string;
  persistToLocalStore: boolean;
  maxCachedRecords: number;
}

export const DRIFTS_FOUND_CHANNEL_CONFIG: DriftsFoundStorageChannel = {
  folder: 'Drifts_Found/',
  persistToLocalStore: true,
  maxCachedRecords: 100,
};

export default DEFAULT_GEMINI_DRIFT_THRESHOLDS;
