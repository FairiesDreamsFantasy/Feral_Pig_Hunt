/**
 * System/Engine/OS/Linux/Arch Module
 * Arch Linux bleeding-edge targets (rolling-release kernel, systemd services, pacman packages).
 */

export interface ArchSystemConfig {
  rollingKernelVersion: string;
  pacmanDbSynchronized: boolean;
  aurHelperActive: boolean;
}

export function loadArchProfile(): ArchSystemConfig {
  return {
    rollingKernelVersion: '6.11-arch-latest',
    pacmanDbSynchronized: true,
    aurHelperActive: true,
  };
}

export default {
  loadArchProfile,
};
