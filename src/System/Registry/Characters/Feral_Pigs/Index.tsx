/**
 * src/System/Registry/Characters/Feral_Pigs/Index.tsx
 * Registry node managing Feral Pigs attributes, hp tiers, size coefficients, and color multipliers.
 */

import { RegistryNode } from '../../General/index.tsx';
import { FERAL_PIG_INDEX_CONFIG } from '../../../../Characters/Feral_Pigs/Index/index.tsx';

export const FERAL_PIGS_REGISTRY_NODE: RegistryNode = {
  path: 'Characters/Feral_Pigs/',
  description: 'Feral Pigs procedural state, hp scale-coefficients, and spot-color registries',
  status: 'active',
  meta: {
    config: FERAL_PIG_INDEX_CONFIG
  }
};

export default FERAL_PIGS_REGISTRY_NODE;
