/**
 * src/System/AI/External/Gemini/index.tsx
 * Ultra-Scientific External Google Gemini AI Integration Engine.
 * 
 * Features:
 * 1. Mathematical API key sanitization and format auditing (AIzaSy standard verification).
 * 2. Closed-loop Quota Guard & Anti-Drift Throttling Engine (wave seed caching, request deduplication, output token capping).
 * 3. Statistical network latency & jitter tracker (mean and standard deviation).
 * 4. Dual execution architecture (server-side proxy route with direct browser SDK failover).
 * 5. Strict JSON schema structured outputs with comprehensive uncaught error shielding.
 */

import { GoogleGenAI, Type } from '@google/genai';
import { WaveTacticalSeed, GeminiTier } from '../../General/index.tsx';
import {
  GeminiGeneralInfo,
  GeminiTestResult,
  KeyFormatStatus,
  GEMINI_MODEL_CATALOG,
  GeminiModelDescriptor,
  QuotaGuardMetrics,
} from './General/index.tsx';
import { geminiDriftGuardInstance } from './Drift_Guard/index.tsx';

export * from './General/index.tsx';
export * from './Drift_Guard/index.tsx';

// ============================================================================
// 1. API KEY SANITIZATION & FORMAT AUDIT
// ============================================================================

/**
 * Ultra-scientific API Key sanitization function:
 * 1. Checks if the raw string contains a standard 39-character Google AI Studio key token (AIzaSy...).
 *    If found, extracts the exact token, discarding any accidental "export KEY=" or surrounding comments.
 * 2. If no standard Google token pattern is matched, performs surgical cleanup:
 *    strips wrapping quotes (single, double, backticks) and all interior whitespace/newlines without truncation.
 */
export function sanitizeGeminiKey(raw: string): string {
  if (!raw) return '';
  const standardMatch = raw.match(/AIzaSy[A-Za-z0-9_-]{33}/);
  if (standardMatch) {
    return standardMatch[0];
  }
  return raw
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '') // remove surrounding quotation marks
    .replace(/[\r\n\t\s]+/g, '');     // purge interior whitespace and line breaks
}

export interface KeyFormatAudit {
  charCount: number;
  isStandardGoogleFormat: boolean;
  isTruncated: boolean;
  sanitizedKey: string;
  badgeLabel: string;
  badgeColor: string;
  formatStatus: KeyFormatStatus;
}

/**
 * Scientific format auditor for player API keys:
 * Identifies truncation, prefix errors, and format compliance in real time.
 */
export function inspectGeminiKeyFormat(raw: string): KeyFormatAudit {
  const sanitized = sanitizeGeminiKey(raw);
  const count = sanitized.length;
  const isStandard = GeminiGeneralInfo.standardKeyRegex.test(sanitized);
  const startsWithPrefix = sanitized.startsWith(GeminiGeneralInfo.keyPrefix);
  const isTruncated = (startsWithPrefix && count < 39) || (count > 0 && count < 20);

  let badgeLabel = 'NO KEY ENTERED';
  let badgeColor = 'text-gray-500 border-gray-700 bg-black/40';
  let formatStatus: KeyFormatStatus = 'EMPTY';

  if (count === 0) {
    badgeLabel = '[0 Chars] No Key Entered';
    badgeColor = 'text-gray-500 border-gray-700 bg-black/40';
    formatStatus = 'EMPTY';
  } else if (isStandard) {
    badgeLabel = `[39 / 39 Chars] Standard Google Key`;
    badgeColor = 'text-[#39ff14] border-[#39ff14]/60 bg-[#39ff14]/10';
    formatStatus = 'STANDARD_GOOGLE_KEY';
  } else if (isTruncated) {
    badgeLabel = `[${count} / 39 Chars] Truncated / Incomplete Key Warning`;
    badgeColor = 'text-[#ff3131] border-[#ff3131]/60 bg-[#ff3131]/10';
    formatStatus = 'TRUNCATED';
  } else {
    badgeLabel = `[${count} Chars] Custom Key Format`;
    badgeColor = 'text-[#00f0ff] border-[#00f0ff]/60 bg-[#00f0ff]/10';
    formatStatus = 'CUSTOM_KEY';
  }

  return {
    charCount: count,
    isStandardGoogleFormat: isStandard,
    isTruncated,
    sanitizedKey: sanitized,
    badgeLabel,
    badgeColor,
    formatStatus,
  };
}

/**
 * High-precision mathematical and diagnostic error classifier.
 * Categorizes errors without collapsing them into generic claims.
 */
export function classifyGeminiError(
  err: unknown,
  modelName: string,
  activeTier: GeminiTier = 'free'
): string {
  const errorMsg = err instanceof Error ? err.message : String(err);
  const lower = errorMsg.toLowerCase();

  // 1. Explicit API Key Invalidity
  if (
    lower.includes('api_key_invalid') ||
    lower.includes('api key not valid') ||
    lower.includes('key_invalid') ||
    lower.includes('unregistered api key')
  ) {
    return 'Invalid API key. Please check your key in Google AI Studio and ensure it was copied completely.';
  }

  // 2. Quota / Rate-limit (429)
  if (lower.includes('429') || lower.includes('quota') || lower.includes('resource_exhausted')) {
    if (activeTier === 'free') {
      return `Free Tier Quota reached for ${modelName} (15 requests/min limit). Quota Guard is preserving your key. Please wait a moment before trying again.`;
    }
    return `Pay-As-You-Go rate limit reached for ${modelName}. Check your Google Cloud project quota limits.`;
  }

  // 3. Model Not Found / Incompatible (404)
  if (lower.includes('404') || lower.includes('not found') || lower.includes('unsupported model')) {
    return `Model "${modelName}" is not available for this key. Try switching to "gemini-1.5-flash" or "gemini-2.5-flash".`;
  }

  // 4. Permission Denied / Billing Tier Issue (403)
  if (lower.includes('403') || lower.includes('permission_denied') || lower.includes('billing')) {
    return `Permission Notice (403): This API key does not have access to ${modelName}. Ensure the "Generative Language API" is enabled in your Google Cloud Console.`;
  }

  // 5. Network / Timeout
  if (lower.includes('abort') || lower.includes('timeout') || lower.includes('network') || lower.includes('failed to fetch')) {
    return `Network Connection Notice: Connection to ${modelName} timed out after ${GeminiGeneralInfo.timeoutMs / 1000}s. Gameplay continues using local algorithmic synthesis.`;
  }

  return `Gemini API Notice: ${errorMsg}`;
}

// ============================================================================
// 2. CLOSED-LOOP QUOTA GUARD & STATISTICAL TELEMETRY
// ============================================================================

export class GeminiQuotaGuard {
  private waveSeedCache = new Map<number, WaveTacticalSeed>();
  private inFlightRequests = new Map<string, Promise<WaveTacticalSeed | null>>();
  private metrics: QuotaGuardMetrics = {
    totalRequestsSent: 0,
    cachedHits: 0,
    tokensConservedEstimate: 0,
    lastRequestTimestamp: 0,
    rollingLatenciesMs: [],
    meanLatencyMs: 0,
    jitterMs: 0,
  };

  /**
   * Retrieves cached tactical seed for a wave if available, preventing unnecessary quota usage.
   */
  public getCachedWaveSeed(waveNumber: number): WaveTacticalSeed | null {
    const cached = this.waveSeedCache.get(waveNumber);
    if (cached) {
      this.metrics.cachedHits++;
      this.metrics.tokensConservedEstimate += 220; // Estimated tokens saved
      return cached;
    }
    return null;
  }

  /**
   * Stores a generated tactical seed into the cache.
   */
  public storeWaveSeed(waveNumber: number, seed: WaveTacticalSeed): void {
    this.waveSeedCache.set(waveNumber, seed);
  }

  /**
   * Evaluates if enough time has elapsed to send another API request.
   */
  public canSendRequest(now: number = performance.now()): boolean {
    return (now - this.metrics.lastRequestTimestamp) >= GeminiGeneralInfo.minRequestIntervalMs;
  }

  /**
   * Records a completed request and computes statistical mean latency and jitter.
   */
  public recordRequest(latencyMs: number, timestamp: number = performance.now()): void {
    this.metrics.totalRequestsSent++;
    this.metrics.lastRequestTimestamp = timestamp;

    // Maintain a rolling window of up to 10 latency measurements
    this.metrics.rollingLatenciesMs.push(latencyMs);
    if (this.metrics.rollingLatenciesMs.length > 10) {
      this.metrics.rollingLatenciesMs.shift();
    }

    // Statistical Mean: mu = (1/N) * sum(x_i)
    const sum = this.metrics.rollingLatenciesMs.reduce((a, b) => a + b, 0);
    const n = this.metrics.rollingLatenciesMs.length;
    this.metrics.meanLatencyMs = Math.round(sum / n);

    // Statistical Standard Deviation / Jitter: sigma = sqrt((1/N) * sum((x_i - mu)^2))
    const varianceSum = this.metrics.rollingLatenciesMs.reduce((acc, val) => acc + Math.pow(val - this.metrics.meanLatencyMs, 2), 0);
    this.metrics.jitterMs = Math.round(Math.sqrt(varianceSum / n));
  }

  public getMetrics(): QuotaGuardMetrics {
    return { ...this.metrics };
  }

  public getInFlight(key: string): Promise<WaveTacticalSeed | null> | undefined {
    return this.inFlightRequests.get(key);
  }

  public setInFlight(key: string, promise: Promise<WaveTacticalSeed | null>): void {
    this.inFlightRequests.set(key, promise);
  }

  public clearInFlight(key: string): void {
    this.inFlightRequests.delete(key);
  }

  public clearCache(): void {
    this.waveSeedCache.clear();
    this.inFlightRequests.clear();
  }
}

export const globalGeminiQuotaGuard = new GeminiQuotaGuard();

// ============================================================================
// 3. CONNECTION TEST & LATENCY DIAGNOSTICS
// ============================================================================

export async function testGeminiConnection(
  rawKey: string,
  modelName: string = GeminiGeneralInfo.defaultModel,
  activeTier: GeminiTier = 'free'
): Promise<GeminiTestResult> {
  const startTime = performance.now();
  const timestamp = new Date().toISOString();
  const audit = inspectGeminiKeyFormat(rawKey);

  if (audit.charCount === 0) {
    return {
      success: false,
      message: 'No API key provided. Please paste your Google Gemini API key.',
      latencyMs: 0,
      charCount: 0,
      formatStatus: 'EMPTY',
      activeTier,
      timestamp,
    };
  }

  if (audit.isTruncated) {
    return {
      success: false,
      message: `Incomplete key detected (${audit.charCount} characters). Standard Google AI Studio keys are 39 characters.`,
      latencyMs: 0,
      charCount: audit.charCount,
      formatStatus: 'TRUNCATED',
      activeTier,
      timestamp,
    };
  }

  const cleanKey = audit.sanitizedKey;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GeminiGeneralInfo.timeoutMs);

  try {
    // Attempt 1: Server proxy route
    try {
      const serverRes = await fetch('/api/gemini/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: cleanKey, model: modelName }),
        signal: controller.signal,
      });

      const elapsed = Math.round(performance.now() - startTime);

      if (serverRes.ok) {
        const data = await serverRes.json();
        clearTimeout(timeoutId);
        globalGeminiQuotaGuard.recordRequest(elapsed);
        const metrics = globalGeminiQuotaGuard.getMetrics();

        return {
          success: true,
          message: data.message || `Connected successfully to ${modelName} (${elapsed}ms, jitter: ±${metrics.jitterMs}ms)!`,
          latencyMs: elapsed,
          jitterMs: metrics.jitterMs,
          charCount: cleanKey.length,
          formatStatus: audit.formatStatus,
          activeTier,
          timestamp,
        };
      } else if (serverRes.status !== 404) {
        const errorData = await serverRes.json().catch(() => ({}));
        clearTimeout(timeoutId);
        return {
          success: false,
          message: classifyGeminiError(
            errorData.message || `Server returned ${serverRes.status}`,
            modelName,
            activeTier
          ),
          latencyMs: elapsed,
          charCount: cleanKey.length,
          formatStatus: audit.formatStatus,
          activeTier,
          timestamp,
        };
      }
    } catch (serverErr) {
      if (controller.signal.aborted) {
        throw serverErr;
      }
    }

    // Attempt 2: Direct browser SDK execution with token-capped payload
    const ai = new GoogleGenAI({ apiKey: cleanKey });
    const response = await ai.models.generateContent({
      model: modelName,
      contents: 'Respond with the single word: READY',
      config: {
        maxOutputTokens: 10, // Minimal token consumption for diagnostics
        temperature: 0.1,
      },
    });

    const elapsed = Math.round(performance.now() - startTime);
    clearTimeout(timeoutId);

    if (response && response.text) {
      globalGeminiQuotaGuard.recordRequest(elapsed);
      const metrics = globalGeminiQuotaGuard.getMetrics();

      return {
        success: true,
        message: `Connected successfully to ${modelName} (${elapsed}ms, jitter: ±${metrics.jitterMs}ms)!`,
        latencyMs: elapsed,
        jitterMs: metrics.jitterMs,
        charCount: cleanKey.length,
        formatStatus: audit.formatStatus,
        activeTier,
        timestamp,
      };
    }
    return {
      success: false,
      message: 'Received empty response from Gemini server.',
      latencyMs: elapsed,
      charCount: cleanKey.length,
      formatStatus: audit.formatStatus,
      activeTier,
      timestamp,
    };
  } catch (err: unknown) {
    const elapsed = Math.round(performance.now() - startTime);
    clearTimeout(timeoutId);
    return {
      success: false,
      message: classifyGeminiError(err, modelName, activeTier),
      latencyMs: elapsed,
      charCount: cleanKey.length,
      formatStatus: audit.formatStatus,
      activeTier,
      timestamp,
    };
  }
}

export const testGeminiAPIKey = testGeminiConnection;

// ============================================================================
// 4. STRUCTURED TACTICAL SEED GENERATION WITH QUOTA GUARDING
// ============================================================================

export async function generateAITacticalSeed(
  apiKey: string,
  modelName: string = GeminiGeneralInfo.defaultModel,
  waveNumber: number
): Promise<WaveTacticalSeed | null> {
  const cleanKey = sanitizeGeminiKey(apiKey);
  if (!cleanKey) return null;

  // 1. Quota Guard: Check wave seed cache first
  const cachedSeed = globalGeminiQuotaGuard.getCachedWaveSeed(waveNumber);
  if (cachedSeed) {
    return cachedSeed;
  }

  // 2. Quota Guard: Deduplicate in-flight requests for the same wave
  const requestKey = `wave_${waveNumber}_${modelName}`;
  const existingInFlight = globalGeminiQuotaGuard.getInFlight(requestKey);
  if (existingInFlight) {
    return existingInFlight;
  }

  // 3. Quota Guard: Anti-burst rate limit check
  if (!globalGeminiQuotaGuard.canSendRequest()) {
    // If requests are sent too rapidly, skip API call to protect player quota
    return null;
  }

  const executionPromise = (async (): Promise<WaveTacticalSeed | null> => {
    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GeminiGeneralInfo.timeoutMs);

    try {
      // Attempt 1: Server proxy route
      try {
        const serverRes = await fetch('/api/gemini/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey: cleanKey, model: modelName, wave: waveNumber }),
          signal: controller.signal,
        });

        if (serverRes.ok) {
          const seed = await serverRes.json();
          clearTimeout(timeoutId);
          const elapsed = Math.round(performance.now() - startTime);
          globalGeminiQuotaGuard.recordRequest(elapsed);

          const audit = geminiDriftGuardInstance.auditGeneratedWave(
            seed,
            waveNumber,
            modelName,
            'free',
            elapsed,
            cleanKey
          );

          if (audit.sanitizedSeed) {
            globalGeminiQuotaGuard.storeWaveSeed(waveNumber, audit.sanitizedSeed);
          }
          return audit.sanitizedSeed;
        }
      } catch {
        // Fallback to client-side SDK if static or network error
      }

      // Attempt 2: Direct browser SDK execution with strict schema & token caps
      const ai = new GoogleGenAI({ apiKey: cleanKey });
      const prompt = `You are the Tactical Ecosystem AI for the arcade shooter "Feral Pig Hunt".
Generate tactical parameters for Wave ${waveNumber}. Output strictly valid JSON.`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction:
            'You generate custom arcade pig wave parameters in strict JSON format. Wave Speed multiplier should stay moderate (1.05 to 1.85) and Aggression should stay balanced (1.0 to 2.4). Pig quotes must be short (under 12 words), funny retro battle cries with oinks or squeals.',
          maxOutputTokens: GeminiGeneralInfo.maxOutputTokens, // Strict token limit to prevent quota waste
          temperature: GeminiGeneralInfo.temperature,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              waveSpeedMultiplier: {
                type: Type.NUMBER,
                description: 'Relative speed factor from 1.05 to 1.85',
              },
              diveAggression: {
                type: Type.NUMBER,
                description: 'Dive frequency factor from 1.0 to 2.4',
              },
              pigBattleCry: {
                type: Type.STRING,
                description: 'Short comedic retro feral pig quote with oinks',
              },
              seedNumber: {
                type: Type.INTEGER,
                description: 'Procedural pseudorandom seed integer',
              },
              spottedRatio: {
                type: Type.NUMBER,
                description: 'Ratio of spotted pigs between 0.1 and 0.6',
              },
            },
            required: [
              'waveSpeedMultiplier',
              'diveAggression',
              'pigBattleCry',
              'seedNumber',
              'spottedRatio',
            ],
          },
        },
      });

      const elapsed = Math.round(performance.now() - startTime);
      clearTimeout(timeoutId);

      if (response && response.text) {
        globalGeminiQuotaGuard.recordRequest(elapsed);
        const parsed = JSON.parse(response.text.trim());
        const audit = geminiDriftGuardInstance.auditGeneratedWave(
          parsed,
          waveNumber,
          modelName,
          'free',
          elapsed,
          cleanKey
        );

        if (audit.sanitizedSeed) {
          globalGeminiQuotaGuard.storeWaveSeed(waveNumber, audit.sanitizedSeed);
        }
        return audit.sanitizedSeed;
      }
      return null;
    } catch {
      clearTimeout(timeoutId);
      // Shield the game loop from uncaught exceptions; return null to allow local algorithmic synthesis
      return null;
    } finally {
      globalGeminiQuotaGuard.clearInFlight(requestKey);
    }
  })();

  globalGeminiQuotaGuard.setInFlight(requestKey, executionPromise);
  return executionPromise;
}

export default {
  sanitizeGeminiKey,
  inspectGeminiKeyFormat,
  classifyGeminiError,
  testGeminiConnection,
  generateAITacticalSeed,
  globalGeminiQuotaGuard,
  GEMINI_MODEL_CATALOG,
};
