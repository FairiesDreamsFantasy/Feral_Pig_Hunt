/**
 * System/Registry/AI
 * Central aggregator for all AI Subsystem Registries.
 */

export * as External from './External/index.tsx';
export * as InGame from './In-Game/index.tsx';
export * as Index from './Index/index.tsx';

import { GEMINI_EXTERNAL_AI_REGISTRY_NODE } from './External/Gemini/General/index.tsx';
import { GEMINI_DRIFT_GUARD_REGISTRY_NODE } from './External/Gemini/Drift_Guard/General/index.tsx';
import { IN_GAME_AI_REGISTRY_NODE } from './In-Game/General/index.tsx';
import { IN_GAME_DRIFT_GUARD_REGISTRY_NODE } from './In-Game/Drift_Guard/General/index.tsx';
import { AI_INDEX_REGISTRY_NODE } from './Index/General/index.tsx';

export const AI_REGISTRY_COLLECTION = {
  "AI/Index/": AI_INDEX_REGISTRY_NODE,
  "AI/External/Gemini/": GEMINI_EXTERNAL_AI_REGISTRY_NODE,
  "AI/External/Gemini/Drift_Guard/": GEMINI_DRIFT_GUARD_REGISTRY_NODE,
  "AI/In-Game/": IN_GAME_AI_REGISTRY_NODE,
  "AI/In-Game/Drift_Guard/": IN_GAME_DRIFT_GUARD_REGISTRY_NODE,
};

export default AI_REGISTRY_COLLECTION;
