/**
 * src/System/Registry/Engine/Science/Physics/index.tsx
 * Physics Registry Node managing physical universe constants, scale thresholds, and limits.
 */

import { RegistryNode } from '../../../General/index.tsx';
import { SciencePhysicsSubsystem } from '../../../../Engine/Science/Physics/index.tsx';

export const SCIENCE_PHYSICS_REGISTRY_NODE: RegistryNode = {
  path: 'Engine/Science/Physics/',
  description: 'Relativistic and Newtonian physics, edge damping constants, and AABB collision bounds',
  status: 'active',
  meta: {
    physicsSubsystem: SciencePhysicsSubsystem
  }
};

export default SCIENCE_PHYSICS_REGISTRY_NODE;
