/**
 * src/System/Registry/Engine/General/index.tsx
 * Engine Registry Master Node. Aggregates RAM Disk, Science, and Index sub-registries.
 */

import { RegistryNode } from '../../General/index.tsx';
import { RAM_DISK_REGISTRY_NODE } from '../RAM_Disk/General/index.tsx';
import { ENGINE_SCIENCE_REGISTRY_NODE } from '../Science/index.tsx';
import { ENGINE_INDEX_REGISTRY_NODE } from '../Index/index.tsx';

export const ENGINE_REGISTRY_NODE: RegistryNode = {
  path: 'Engine/',
  description: 'Fixed-shooter arcade physics, collision math, RAM disk subsystem, and Science engine nodes',
  status: 'active',
  meta: {
    ramDisk: RAM_DISK_REGISTRY_NODE,
    science: ENGINE_SCIENCE_REGISTRY_NODE,
    index: ENGINE_INDEX_REGISTRY_NODE
  },
};

export default ENGINE_REGISTRY_NODE;
