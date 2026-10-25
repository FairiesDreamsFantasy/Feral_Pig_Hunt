/**
 * Registry Subsystem - Engine/RAM_Disk General Definition
 */
import { RegistryNode } from '../../../General/index.tsx';

export const RAM_DISK_REGISTRY_NODE: RegistryNode = {
  path: 'Engine/RAM_Disk/',
  description: 'In-Memory RAM Disk Block Storage Driver for real computers & PWA caching',
  status: 'active',
  meta: {
    sectorSize: 4096,
    totalCapacityMB: 16,
    pwaReady: true,
    clientSideExecution: true,
  },
};

export default RAM_DISK_REGISTRY_NODE;
