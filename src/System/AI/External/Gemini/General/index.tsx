/**
 * System/AI/External/Gemini/General
 * Precise definitions, diagnostics interfaces, and timing constants for external Gemini integration.
 */

import { GeminiTier } from '../../../General/index.tsx';

export type KeyFormatStatus = 'STANDARD_GOOGLE_KEY' | 'CUSTOM_KEY' | 'TRUNCATED' | 'EMPTY';

export interface GeminiTestResult {
  success: boolean;
  message: string;
  latencyMs: number;
  charCount: number;
  formatStatus: KeyFormatStatus;
  activeTier: GeminiTier;
  timestamp: string;
}

export interface GeminiDiagnostics {
  status: 'READY' | 'UNCONFIGURED' | 'INVALID_KEY' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  httpStatus?: number;
  latencyMs?: number;
  timestamp: string;
}

export const GeminiGeneralInfo = {
  provider: 'Google Gemini API',
  standardKeyLength: 39,
  keyPrefix: 'AIzaSy',
  standardKeyRegex: /^AIzaSy[A-Za-z0-9_-]{33}$/,
  defaultModel: 'gemini-1.5-flash',
  timeoutMs: 8000,
  maxRetries: 1,
};

export default GeminiGeneralInfo;

