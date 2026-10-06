/**
 * System/Engine/OS/Linux/Debian/Lubuntu Module
 * LXQt-centric Lubuntu desktop targets, optimized for extreme low-end hardware architectures.
 */

export interface LubuntuConfig {
  desktopManager: 'LXQt';
  baseMemoryAllocationBytes: number;
}

export function loadLubuntuMinimalistProfile(): LubuntuConfig {
  return {
    desktopManager: 'LXQt',
    baseMemoryAllocationBytes: 256 * 1024 * 1024, // Ultra-low memory foot print
  };
}

export default {
  loadLubuntuMinimalistProfile,
};
