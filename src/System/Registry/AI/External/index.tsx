/**
 * System/Registry/AI/External
 * Aggregator for External AI registries.
 */

export * as Gemini from './Gemini/index.tsx';
import { GEMINI_EXTERNAL_AI_REGISTRY_NODE } from './Gemini/General/index.tsx';

export const EXTERNAL_AI_REGISTRY_COLLECTION = {
  "AI/External/Gemini/": GEMINI_EXTERNAL_AI_REGISTRY_NODE,
};

export default EXTERNAL_AI_REGISTRY_COLLECTION;
