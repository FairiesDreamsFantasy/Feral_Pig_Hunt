/**
 * src/System/Registry/Engine/index.tsx
 * Engine Registry aggregation module. Exports General, RAM Disk, Science, and Index elements.
 */

import { ENGINE_REGISTRY_NODE } from './General/index.tsx';
export * from './General/index.tsx';
export * from './RAM_Disk/index.tsx';
export * from './Science/index.tsx';
export * from './Index/index.tsx';

export default ENGINE_REGISTRY_NODE;
