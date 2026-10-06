/**
 * System/Registry/UI
 * Central aggregator for User Interface registries.
 */

export * as Insert_AI from './Insert_AI/index.tsx';
export * as Play_Area from './Play_Area/index.tsx';
export * as Ads from './Ads/index.tsx';

import { INSERT_AI_REGISTRY_NODE } from './Insert_AI/General/index.tsx';
import { PlayAreaUIRegistry } from './Play_Area/index.tsx';
import { AdsUIRegistry } from './Ads/index.tsx';

export const UI_REGISTRY_COLLECTION = {
  "UI/Modal/Insert_AI/": INSERT_AI_REGISTRY_NODE,
  "UI/Play_Area/": PlayAreaUIRegistry,
  "UI/Ads/": AdsUIRegistry,
};

export default UI_REGISTRY_COLLECTION;
