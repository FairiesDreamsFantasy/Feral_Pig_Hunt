/**
 * RAM Disk Subsystem Driver
 * Operates entirely on the local computer's physical RAM once loaded from web server.
 * High-speed in-memory I/O, binary buffers, and PWA pre-cache staging.
 */

import {
  DEFAULT_RAM_DISK_CONFIG,
  RAMDiskBlock,
  RAMDiskConfig,
  RAMDiskStats,
  VirtualFileEntry,
} from './General/index.tsx';

export * from './General/index.tsx';

export class RAMDiskVirtualDriver {
  private config: RAMDiskConfig;
  private rawBuffer: ArrayBuffer | null = null;
  private memoryView: Uint8Array | null = null;
  private sectorAllocationTable: Uint8Array | null = null;
  private directoryIndex: Map<string, VirtualFileEntry> = new Map();
  private isMounted: boolean = false;
  private readOperationsCount: number = 0;
  private writeOperationsCount: number = 0;
  private mountTimestamp: number = 0;

  constructor(customConfig?: Partial<RAMDiskConfig>) {
    this.config = { ...DEFAULT_RAM_DISK_CONFIG, ...(customConfig || {}) };
    this.mount();
  }

  /**
   * Mounts virtual disk into the local machine's RAM
   */
  public mount(): boolean {
    try {
      this.rawBuffer = new ArrayBuffer(this.config.totalCapacityBytes);
      this.memoryView = new Uint8Array(this.rawBuffer);
      this.sectorAllocationTable = new Uint8Array(this.config.totalSectors);
      this.directoryIndex.clear();
      this.isMounted = true;
      this.mountTimestamp = Date.now();

      // Stage initial core system files & PWA manifests into RAM
      this.stageInitialSystemCache();

      return true;
    } catch (err) {
      console.error('Failed to allocate physical RAM for RAM Disk:', err);
      this.isMounted = false;
      return false;
    }
  }

  /**
   * Unmounts and frees allocated RAM memory blocks
   */
  public unmount(): void {
    this.rawBuffer = null;
    this.memoryView = null;
    this.sectorAllocationTable = null;
    this.directoryIndex.clear();
    this.isMounted = false;
  }

  /**
   * Writes a virtual file to local RAM disk
   */
  public writeFile(filename: string, data: Uint8Array | string, mimeType: string = 'application/octet-stream'): boolean {
    if (!this.isMounted || !this.memoryView || !this.sectorAllocationTable) {
      return false;
    }

    const payload: Uint8Array = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    const requiredSectors = Math.ceil(payload.length / this.config.sectorSizeBytes) || 1;

    // Find contiguous or first available sector blocks
    const startSector = this.allocateSectors(requiredSectors);
    if (startSector === -1) {
      console.warn('RAM Disk Out of Memory: Cannot allocate sectors for', filename);
      return false;
    }

    // Write payload into raw memory view
    const byteOffset = startSector * this.config.sectorSizeBytes;
    this.memoryView.set(payload, byteOffset);

    // Compute simple deterministic checksum
    let checksumVal = 0;
    for (let i = 0; i < payload.length; i++) {
      checksumVal = (checksumVal + payload[i] * (i + 1)) >>> 0;
    }

    const entry: VirtualFileEntry = {
      filename,
      sizeBytes: payload.length,
      mimeType,
      startSector,
      sectorCount: requiredSectors,
      createdAt: this.directoryIndex.get(filename)?.createdAt || Date.now(),
      modifiedAt: Date.now(),
      checksum: '0x' + checksumVal.toString(16).padStart(8, '0'),
    };

    this.directoryIndex.set(filename, entry);
    this.writeOperationsCount++;
    return true;
  }

  /**
   * Reads raw bytes from local RAM disk
   */
  public readFile(filename: string): Uint8Array | null {
    if (!this.isMounted || !this.memoryView) return null;
    const entry = this.directoryIndex.get(filename);
    if (!entry) return null;

    const byteOffset = entry.startSector * this.config.sectorSizeBytes;
    const rawData = this.memoryView.subarray(byteOffset, byteOffset + entry.sizeBytes);
    this.readOperationsCount++;

    // Return a copy to preserve RAM disk integrity
    return new Uint8Array(rawData);
  }

  /**
   * Reads UTF-8 decoded string from local RAM disk
   */
  public readTextFile(filename: string): string | null {
    const raw = this.readFile(filename);
    if (!raw) return null;
    return new TextDecoder().decode(raw);
  }

  /**
   * Deletes a virtual file and marks sectors as available
   */
  public deleteFile(filename: string): boolean {
    if (!this.isMounted || !this.sectorAllocationTable) return false;
    const entry = this.directoryIndex.get(filename);
    if (!entry) return false;

    for (let i = 0; i < entry.sectorCount; i++) {
      this.sectorAllocationTable[entry.startSector + i] = 0;
    }

    this.directoryIndex.delete(filename);
    return true;
  }

  /**
   * Returns list of virtual files currently residing in local RAM
   */
  public listFiles(): VirtualFileEntry[] {
    return Array.from(this.directoryIndex.values());
  }

  /**
   * Returns current statistics of the RAM Disk
   */
  public getStats(): RAMDiskStats {
    let allocatedSectors = 0;
    if (this.sectorAllocationTable) {
      for (let i = 0; i < this.sectorAllocationTable.length; i++) {
        if (this.sectorAllocationTable[i] === 1) allocatedSectors++;
      }
    }

    const usedBytes = allocatedSectors * this.config.sectorSizeBytes;
    const freeBytes = this.config.totalCapacityBytes - usedBytes;
    const uptimeSeconds = this.mountTimestamp ? Math.floor((Date.now() - this.mountTimestamp) / 1000) : 0;

    return {
      mounted: this.isMounted,
      totalCapacityBytes: this.config.totalCapacityBytes,
      usedBytes,
      freeBytes,
      totalSectors: this.config.totalSectors,
      allocatedSectors,
      fileCount: this.directoryIndex.size,
      readOps: this.readOperationsCount,
      writeOps: this.writeOperationsCount,
      uptimeSeconds,
      pwaCacheReady: this.config.pwaPreCacheReady,
    };
  }

  /**
   * Exports RAM Disk contents to a binary Blob
   */
  public exportVirtualImage(): Blob | null {
    if (!this.rawBuffer) return null;
    return new Blob([this.rawBuffer], { type: 'application/octet-stream' });
  }

  private allocateSectors(count: number): number {
    if (!this.sectorAllocationTable) return -1;
    let consecutive = 0;
    let startIndex = -1;

    for (let i = 0; i < this.sectorAllocationTable.length; i++) {
      if (this.sectorAllocationTable[i] === 0) {
        if (consecutive === 0) startIndex = i;
        consecutive++;
        if (consecutive === count) {
          // Mark as allocated
          for (let j = 0; j < count; j++) {
            this.sectorAllocationTable[startIndex + j] = 1;
          }
          return startIndex;
        }
      } else {
        consecutive = 0;
        startIndex = -1;
      }
    }
    return -1;
  }

  private stageInitialSystemCache(): void {
    // Stage pre-cached PWA manifests and core game assets into RAM
    this.writeFile('/cache/manifest.json', JSON.stringify({
      name: 'Feral Pig Hunt',
      version: 'V0.2',
      buildDate: '2026-09-03',
      storage: 'RAM_Disk_Active',
      pwaReady: true,
    }), 'application/json');

    this.writeFile('/cache/sound_lookup_tables.dat', new Uint8Array([
      // 8-bit, 16-bit, 32-bit, 64-bit harmonic wavetable cache
      0x46, 0x45, 0x52, 0x41, 0x4c, 0x5f, 0x50, 0x49, 0x47, 0x5f, 0x48, 0x55, 0x4e, 0x54, 0x5f, 0x56, 0x30, 0x2e, 0x32
    ]), 'application/octet-stream');
  }
}

// Global active client RAM Disk instance
export const activeRAMDisk = new RAMDiskVirtualDriver();

export default {
  RAMDiskVirtualDriver,
  activeRAMDisk,
};
