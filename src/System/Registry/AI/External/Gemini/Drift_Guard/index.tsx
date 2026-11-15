/**
 * System/Registry/AI/External/Gemini/Drift_Guard
 * Primary module export for External Gemini Drift Guard registry node.
 */

export * from './General/index.tsx';
import { GEMINI_DRIFT_GUARD_REGISTRY_NODE } from './General/index.tsx';

export const GeminiDriftGuardRegistry = GEMINI_DRIFT_GUARD_REGISTRY_NODE;
export default GeminiDriftGuardRegistry;
