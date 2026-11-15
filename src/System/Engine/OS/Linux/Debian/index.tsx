/**
 * System/Engine/OS/Linux/Debian Module
 * Core Debian GNU/Linux targets (stable kernel, apt package dependencies, and sysfs access).
 */

export interface DebianSystemState {
  kernelVersion: string;
  architecture: 'amd64' | 'i386' | 'arm64' | 'riscv64';
  aptPackagesInstalled: string[];
}

export const DEBIAN_INFO = {
  distroId: 'debian',
  description: 'The Universal Operating System',
  supportedDisplayServers: ['X11', 'Wayland'],
};

export function getDebianSystemStatus(): DebianSystemState {
  return {
    kernelVersion: '6.1.0-debian-generic',
    architecture: 'amd64',
    aptPackagesInstalled: ['libc6', 'libx11-6', 'libasound2', 'mesa-utils']
  };
}

export default {
  DEBIAN_INFO,
  getDebianSystemStatus,
};
