/**
 * System/Registry/AI/In-Game
 * Primary module export for In-Game AI registry.
 */

export * from './General/index.tsx';
export * from './Drift_Guard/index.tsx';
import { IN_GAME_AI_REGISTRY_NODE } from './General/index.tsx';

export const InGameAIRegistry = IN_GAME_AI_REGISTRY_NODE;
export default InGameAIRegistry;
