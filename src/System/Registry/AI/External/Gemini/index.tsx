/**
 * System/Registry/AI/External/Gemini
 * Primary module export for External Gemini AI registry.
 */

export * from './General/index.tsx';
export * from './Drift_Guard/index.tsx';
import { GEMINI_EXTERNAL_AI_REGISTRY_NODE } from './General/index.tsx';

export const GeminiExternalAIRegistry = GEMINI_EXTERNAL_AI_REGISTRY_NODE;
export default GeminiExternalAIRegistry;
