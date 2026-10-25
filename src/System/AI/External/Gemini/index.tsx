import { GoogleGenAI, Type } from '@google/genai';
import { WaveTacticalSeed, GeminiTier } from '../../General/index.tsx';
import { GeminiGeneralInfo, GeminiTestResult, KeyFormatStatus } from './General/index.tsx';
import { geminiDriftGuardInstance } from './Drift_Guard/index.tsx';

export * from './General/index.tsx';
export * from './Drift_Guard/index.tsx';

/**
 * Ultra-scientific API Key sanitization function:
 * 1. Checks if the raw string contains a standard 39-character Google AI Studio key token (AIzaSy...).
 *    If found, extracts the exact token, discarding any accidental "export KEY=" or surrounding comments.
 * 2. If no standard Google token pattern is matched, performs surgical cleanup:
 *    strips wrapping quotes (single, double, backticks) and all interior whitespace/newlines without truncation.
 */
export function sanitizeGeminiKey(raw: string): string {
  if (!raw) return '';
  // Deterministic token extraction for standard Google AI Studio keys
  const standardMatch = raw.match(/AIzaSy[A-Za-z0-9_-]{33}/);
  if (standardMatch) {
    return standardMatch[0];
  }
  return raw
    .trim()
    .replace(/^["'`]+|["'`]+$/g, '') // remove surrounding string quotation marks
    .replace(/[\r\n\t\s]+/g, '');     // purge all interior whitespace and line breaks
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
 * Scientific format auditor for pasted player keys:
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
 * Never collapses generic HTTP 400 status codes into false "Invalid API Key" claims.
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
    return 'Invalid API Key: The key provided is unrecognized by Google AI Studio. Please re-check your key.';
  }

  // 2. Quota / Rate Limiting (HTTP 429 / RESOURCE_EXHAUSTED)
  if (
    lower.includes('resource_exhausted') ||
    lower.includes('429') ||
    lower.includes('quota') ||
    lower.includes('rate limit')
  ) {
    return `Rate Limit Exceeded (429): Your key reached maximum requests per minute. Try switching models to 'gemini-2.5-flash' or pause for 60 seconds.`;
  }

  // 3. Paid Tier Billing / Permission Required (HTTP 403 / BILLING_DISABLED / PERMISSION_DENIED)
  if (
    lower.includes('caller does not have permission') ||
    lower.includes('permission_denied')
  ) {
    return `Permission Denied (HTTP 403): The caller does not have permission for '${modelName}'. This commonly occurs when an API key has Website (HTTP Referrer) restrictions in Google Cloud Console, or if this project lacks access to '${modelName}'. Please verify your key restrictions or try Gemini 1.5 Flash.`;
  }

  if (
    lower.includes('billing') ||
    lower.includes('enable billing') ||
    lower.includes('billing_disabled')
  ) {
    return `Billing Required (HTTP 403): Model '${modelName}' requires an active billing-enabled Google Cloud project. Switch tier toggle to 'Free Tier' to use free models.`;
  }

  if (lower.includes('403')) {
    return `HTTP 403 Access Denied: Google rejected the request for '${modelName}'. Ensure this key is allowed to call Generative Language API from this domain or use Gemini 1.5 Flash.`;
  }

  // 4. Model Availability / Not Found (HTTP 404)
  if (
    lower.includes('not found') ||
    lower.includes('unsupported') ||
    lower.includes('404') ||
    lower.includes('is not supported for generatecontent')
  ) {
    return `Model Unsupported (${modelName}): This model cannot be served with your current key. Please select a recommended model from the ${
      activeTier === 'free' ? 'Free' : 'Paid'
    } Tier.`;
  }

  // 5. Watchdog Timeout & Abort Safeguards
  if (lower.includes('aborterror') || lower.includes('timed out') || lower.includes('timeout')) {
    return 'Connection Timeout: Request took longer than 8 seconds to respond. Check your network.';
  }

  // 6. Network Connectivity
  if (
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('offline') ||
    lower.includes('connection refused')
  ) {
    return 'Network Error: Unable to reach Gemini API servers. Please check your internet connectivity.';
  }

  // 7. General diagnostic fallback (displays cleaned server output without false assumptions)
  const sanitizedMsg = errorMsg.replace(/https?:\/\/[^\s]+/g, '').trim();
  return `Gemini Notice: ${sanitizedMsg}`;
}

/**
 * Tests player-provided Gemini API credentials with graceful fallback.
 * Measures round-trip latency in milliseconds and returns detailed diagnostic record.
 */
export async function testGeminiAPIKey(
  apiKey: string,
  modelName: string = GeminiGeneralInfo.defaultModel,
  activeTier: GeminiTier = 'free'
): Promise<GeminiTestResult> {
  const audit = inspectGeminiKeyFormat(apiKey);
  const startTime = performance.now();
  const timestamp = new Date().toISOString();

  if (!audit.sanitizedKey || audit.sanitizedKey.length === 0) {
    return {
      success: false,
      message: 'Please enter a valid Gemini API key.',
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
      message: `Key format error: The pasted key is only ${audit.charCount} characters (Google keys are 39 characters). The key was truncated during copying.`,
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
    // Attempt 1: Server proxy route (when hosted with active backend)
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
        return {
          success: true,
          message: data.message || `Connected successfully to ${modelName} (${elapsed}ms)!`,
          latencyMs: elapsed,
          charCount: cleanKey.length,
          formatStatus: audit.formatStatus,
          activeTier,
          timestamp,
        };
      } else if (serverRes.status !== 404) {
        // Server returned an explicit error response
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
      // If server route is unavailable (standalone static hosting), continue to client fallback
    }

    // Attempt 2: Direct client-side SDK execution (for standalone static deployment)
    const ai = new GoogleGenAI({ apiKey: cleanKey });
    const response = await ai.models.generateContent({
      model: modelName,
      contents: 'Respond with the single word: READY',
    });

    const elapsed = Math.round(performance.now() - startTime);
    clearTimeout(timeoutId);

    if (response && response.text) {
      return {
        success: true,
        message: `Connected successfully to ${modelName} (${elapsed}ms)!`,
        latencyMs: elapsed,
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

/**
 * Generates custom tactical wave parameters using structured JSON output.
 * Ensures zero-parsing errors and seamlessly falls back to local algorithmic seeds on failure.
 * Audited and enforced through GeminiDriftGuard to prevent payload hallucinations and log Drifts_Found.
 */
export async function generateAITacticalSeed(
  apiKey: string,
  modelName: string = GeminiGeneralInfo.defaultModel,
  waveNumber: number
): Promise<WaveTacticalSeed | null> {
  const cleanKey = sanitizeGeminiKey(apiKey);
  if (!cleanKey) return null;

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
        const audit = geminiDriftGuardInstance.auditGeneratedWave(seed, waveNumber, modelName, 'free', elapsed, cleanKey);
        return audit.sanitizedSeed;
      }
    } catch {
      // Fallback to client-side SDK if static or network error
    }

    // Attempt 2: Direct client-side SDK with Structured Outputs Schema
    const ai = new GoogleGenAI({ apiKey: cleanKey });
    const prompt = `You are the Tactical Ecosystem AI for an arcade shooter game "Feral Pig Hunt".
Generate tactical specs and pig battle cries for Wave ${waveNumber}.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction:
          'You generate custom arcade pig wave parameters in strict JSON format. Wave Speed multiplier should stay moderate (1.05 to 1.85) and Aggression should stay balanced (1.0 to 2.4). Pig quotes must be short (under 12 words), funny retro battle cries with oinks or squeals.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seedNumber: {
              type: Type.INTEGER,
              description: 'A random seed number between 1000 and 99999.',
            },
            waveSpeedMultiplier: {
              type: Type.NUMBER,
              description: 'Multiplier between 1.05 and 1.85 for hog formation speed.',
            },
            diveAggression: {
              type: Type.NUMBER,
              description: 'Factor between 1.0 and 2.4 for diving charge aggression.',
            },
            spottedRatio: {
              type: Type.NUMBER,
              description: 'Float between 0.2 and 0.7 for spotted hog ratio.',
            },
            formationPattern: {
              type: Type.STRING,
              description: 'Squadron deployment layout style.',
            },
            pigQuotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of exactly 3 short humorous retro pig combat lines.',
            },
          },
          required: [
            'seedNumber',
            'waveSpeedMultiplier',
            'diveAggression',
            'spottedRatio',
            'formationPattern',
            'pigQuotes',
          ],
        },
      },
    });

    clearTimeout(timeoutId);
    const elapsed = Math.round(performance.now() - startTime);

    if (response && response.text) {
      const cleanJson = response.text.trim();
      const parsed = JSON.parse(cleanJson);
      const audit = geminiDriftGuardInstance.auditGeneratedWave(parsed, waveNumber, modelName, 'free', elapsed, cleanKey);
      return audit.sanitizedSeed;
    }
    
    // Empty output recorded via Drift Guard
    geminiDriftGuardInstance.auditGeneratedWave(null, waveNumber, modelName, 'free', elapsed, cleanKey);
    return null;
  } catch (e) {
    clearTimeout(timeoutId);
    const elapsed = Math.round(performance.now() - startTime);
    const errorMsg = e instanceof Error ? e.message : String(e);
    geminiDriftGuardInstance.auditErrorResponse(errorMsg, modelName, 'free', elapsed, cleanKey);
    console.warn('Tactical AI query fell back to internal algorithmic seed:', e);
    return null;
  }
}

export interface MathScienceSimulationResult {
  success: boolean;
  problemType: string;
  computedValues: {
    resultFactor: number;
    trajectoryVelocity: number;
    ecosystemEquilibrium: number;
    precisionRating: number;
  };
  formulaDescription: string;
  scientificExplanation: string;
  error?: string;
}

/**
 * Full-stack Gemini Math & Science simulation helper function.
 * Solves advanced projectile physics, ballistic trajectories, and ecological equations
 * using the player's provided custom Gemini API key.
 */
export async function solveMathScienceSimulation(
  apiKey: string,
  modelName: string = GeminiGeneralInfo.defaultModel,
  problemType: string = 'trajectory_physics',
  parameters: Record<string, unknown> = {}
): Promise<MathScienceSimulationResult> {
  const cleanKey = sanitizeGeminiKey(apiKey);
  if (!cleanKey) {
    return {
      success: false,
      problemType,
      computedValues: { resultFactor: 1, trajectoryVelocity: 1, ecosystemEquilibrium: 1, precisionRating: 1 },
      formulaDescription: 'No API key provided',
      scientificExplanation: 'API key is required for full-stack Gemini scientific computations.',
      error: 'Missing API key',
    };
  }

  try {
    const res = await fetch('/api/gemini/math-science', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: cleanKey, model: modelName, problemType, parameters }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        problemType,
        computedValues: { resultFactor: 1, trajectoryVelocity: 1, ecosystemEquilibrium: 1, precisionRating: 1 },
        formulaDescription: 'Server error',
        scientificExplanation: errData.error || `Server responded with status ${res.status}`,
        error: errData.error || `HTTP ${res.status}`,
      };
    }
  } catch (err) {
    return {
      success: false,
      problemType,
      computedValues: { resultFactor: 1, trajectoryVelocity: 1, ecosystemEquilibrium: 1, precisionRating: 1 },
      formulaDescription: 'Network connection failure',
      scientificExplanation: err instanceof Error ? err.message : String(err),
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export default { testGeminiAPIKey, generateAITacticalSeed, sanitizeGeminiKey, classifyGeminiError, geminiDriftGuardInstance, solveMathScienceSimulation };



