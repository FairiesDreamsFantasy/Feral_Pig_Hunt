/**
 * src/System/AI/External/Gemini/General/index.tsx
 * Ultra-Scientific Gemini AI Subsystem Specifications & Quota Guard Definitions.
 * Implements mathematical model descriptors, statistical network metrics, and quota drift protection parameters.
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
  jitterMs?: number;
}

export interface GeminiDiagnostics {
  status: 'READY' | 'UNCONFIGURED' | 'INVALID_KEY' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  httpStatus?: number;
  latencyMs?: number;
  timestamp: string;
}

export interface GeminiModelDescriptor {
  id: string;
  name: string;
  tier: GeminiTier;
  contextTokens: number;
  rpmLimit: number;
  description: string;
  recommended?: boolean;
}

/**
 * Verified Model Catalog (Dynamic, Multi-Tier, Zero Hardcoded Lock-In)
 */
export const GEMINI_MODEL_CATALOG: GeminiModelDescriptor[] = [
  // Free Tier Models (15 RPM Quota, Zero Credit Card Required)
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash (Baseline)',
    tier: 'free',
    contextTokens: 1048576,
    rpmLimit: 15,
    description: 'High-speed, lightweight model with maximum backwards compatibility.',
    recommended: true,
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    tier: 'free',
    contextTokens: 1048576,
    rpmLimit: 15,
    description: 'Latest generation low-latency model for rapid tactical reasoning.',
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini Flash (Rolling Latest)',
    tier: 'free',
    contextTokens: 1048576,
    rpmLimit: 15,
    description: 'Automatically targets the newest stable Flash production endpoint.',
  },

  // Paid Tier Models (Google Cloud Pay-As-You-Go Billing)
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    tier: 'paid',
    contextTokens: 2097152,
    rpmLimit: 360,
    description: 'Frontier reasoning model for advanced tactical wave generation.',
    recommended: true,
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro (Preview)',
    tier: 'paid',
    contextTokens: 2097152,
    rpmLimit: 360,
    description: 'Next-generation frontier preview model for deep analytical simulation.',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    tier: 'paid',
    contextTokens: 2097152,
    rpmLimit: 360,
    description: 'High-capacity 2M token context window for complex scenarios.',
  },
];

/**
 * Quota Guard & Anti-Drift Thresholds
 */
export interface QuotaGuardMetrics {
  totalRequestsSent: number;
  cachedHits: number;
  tokensConservedEstimate: number;
  lastRequestTimestamp: number;
  rollingLatenciesMs: number[];
  meanLatencyMs: number;
  jitterMs: number;
}

export const GeminiGeneralInfo = {
  provider: 'Google Gemini API',
  standardKeyLength: 39,
  keyPrefix: 'AIzaSy',
  standardKeyRegex: /^AIzaSy[A-Za-z0-9_-]{33}$/,
  defaultModel: 'gemini-1.5-flash',
  timeoutMs: 8000,
  maxRetries: 1,
  minRequestIntervalMs: 4000, // Anti-burst throttling: minimum 4 seconds between tactical calls
  maxOutputTokens: 250,       // Strict token output cap to prevent quota waste
  temperature: 0.7,
};

export default GeminiGeneralInfo;
