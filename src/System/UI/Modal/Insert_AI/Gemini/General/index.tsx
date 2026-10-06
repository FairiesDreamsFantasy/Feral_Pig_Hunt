/**
 * System/UI/Modal/Insert_AI/Gemini/General
 * Active architectural authority for the Insert_AI Gemini modal configuration,
 * key format validation standards, and responsive UI constraints.
 */

import { GeminiGeneralInfo } from '../../../../../AI/External/Gemini/General/index.tsx';

export interface InsertAIModalConfig {
  provider: string;
  keyLength: number;
  keyPrefix: string;
  supportedTiers: ('free' | 'paid')[];
  defaultModel: string;
  timeoutMs: number;
  characterBadgeWarningThreshold: number;
}

export const GeminiModalGeneral: InsertAIModalConfig = {
  provider: 'Google Gemini Studio',
  keyLength: GeminiGeneralInfo.standardKeyLength,
  keyPrefix: GeminiGeneralInfo.keyPrefix,
  supportedTiers: ['free', 'paid'],
  defaultModel: GeminiGeneralInfo.defaultModel,
  timeoutMs: GeminiGeneralInfo.timeoutMs,
  characterBadgeWarningThreshold: 39,
};

export default GeminiModalGeneral;
