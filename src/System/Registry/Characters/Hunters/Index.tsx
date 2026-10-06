/**
 * src/System/Registry/Characters/Hunters/Index.tsx
 * Registry node managing Hunters attributes, damage tier configurations, and movement limits.
 */

import { RegistryNode } from '../../General/index.tsx';
import { HUNTER_REGISTRY_PROFILES } from '../../../../Characters/Hunters/Index/index.tsx';

export const HUNTERS_REGISTRY_NODE: RegistryNode = {
  path: 'Characters/Hunters/',
  description: 'Hunter and Hog Assassin character profile registry and sub-relational attributes',
  status: 'active',
  meta: {
    profiles: HUNTER_REGISTRY_PROFILES
  }
};

export default HUNTERS_REGISTRY_NODE;
