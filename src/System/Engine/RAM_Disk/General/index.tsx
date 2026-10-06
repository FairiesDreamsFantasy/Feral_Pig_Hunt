/**
 * RAM Disk Subsystem - General Interfaces & Configuration
 * Pure client-side local RAM virtual block storage for real computers.
 * Provides high-speed in-memory buffer caching, asset pre-staging, and PWA integration.
 */

export interface RAMDiskConfig {
  sectorSizeBytes: number;
  totalSectors: number;
  totalCapacityBytes: number;
  mountPoint: string;
  name: string;
  pwaPreCacheReady: boolean;
}

export interface RAMDiskBlock {
  sectorIndex: number;
  isAllocated: boolean;
  byteLength: number;
  checksum: string;
  timestamp: number;
}

export interface VirtualFileEntry {
  filename: string;
  sizeBytes: number;
  mimeType: string;
  startSector: number;
  sectorCount: number;
  createdAt: number;
  modifiedAt: number;
  checksum: string;
}

export interface RAMDiskStats {
  mounted: boolean;
  totalCapacityBytes: number;
  usedBytes: number;
  freeBytes: number;
  totalSectors: number;
  allocatedSectors: number;
  fileCount: number;
  readOps: number;
  writeOps: number;
  uptimeSeconds: number;
  pwaCacheReady: boolean;
}

export const DEFAULT_RAM_DISK_CONFIG: RAMDiskConfig = {
  sectorSizeBytes: 4096, // 4KB virtual sector size
  totalSectors: 4096,     // 16MB total virtual RAM disk allocation
  totalCapacityBytes: 4096 * 4096, // 16,777,216 bytes
  mountPoint: '/System/RAM_Disk',
  name: 'Feral Pig Hunt Client RAM Disk',
  pwaPreCacheReady: true,
};

export default {
  DEFAULT_RAM_DISK_CONFIG,
};
