/**
 * src/System/Registry/Engine/Science/index.tsx
 * Science Registry Subsystem Node. Consolidates physics, graphical, and mathematical registry metadata.
 */

import { RegistryNode } from '../../General/index.tsx';
import { SCIENCE_PHYSICS_REGISTRY_NODE } from './Physics/index.tsx';
import { SCIENCE_GRAPHICAL_REGISTRY_NODE } from './Graphical_Renderer/index.tsx';
import { SCIENCE_MATHEMATICS_REGISTRY_NODE } from './Mathematics/index.tsx';

export const ENGINE_SCIENCE_REGISTRY_NODE: RegistryNode = {
  path: 'Engine/Science/',
  description: 'Integrator node for physical, graphical, and mathematical universe configurations',
  status: 'active',
  meta: {
    physics: SCIENCE_PHYSICS_REGISTRY_NODE,
    graphical: SCIENCE_GRAPHICAL_REGISTRY_NODE,
    mathematics: SCIENCE_MATHEMATICS_REGISTRY_NODE
  }
};

export default ENGINE_SCIENCE_REGISTRY_NODE;
