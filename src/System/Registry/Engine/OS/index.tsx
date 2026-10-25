/**
 * System/Registry/Engine/OS/index.tsx
 * Holds global operating system target parameters, simulated boot registers, and active terminal flags.
 */

export type TargetOSName = 'FreeDOS' | 'Debian' | 'Ubuntu' | 'Xubuntu' | 'Kubuntu' | 'Lubuntu' | 'Arch' | 'GENERIC_POSIX';

export interface OSRegistrySettings {
  activeOS: TargetOSName;
  bootSecureDisabled: boolean;
  virtualInterruptsActive: boolean;
  posixCompliantMode: boolean;
  systemdActive: boolean;
  realMode16BitActive: boolean;
}

export const DEFAULT_OS_REGISTRY_SETTINGS: OSRegistrySettings = {
  activeOS: 'GENERIC_POSIX',
  bootSecureDisabled: true, // Always disabled for open-source compatibility
  virtualInterruptsActive: true,
  posixCompliantMode: true,
  systemdActive: false,
  realMode16BitActive: false,
};

let currentOSConfig: OSRegistrySettings = { ...DEFAULT_OS_REGISTRY_SETTINGS };

export function getOSRegistryConfig(): OSRegistrySettings {
  return currentOSConfig;
}

export function updateOSRegistryConfig(newConfig: Partial<OSRegistrySettings>): OSRegistrySettings {
  currentOSConfig = { ...currentOSConfig, ...newConfig };
  
  // Cross-variable configuration overrides
  if (currentOSConfig.activeOS === 'FreeDOS') {
    currentOSConfig.realMode16BitActive = true;
    currentOSConfig.posixCompliantMode = false;
  } else {
    currentOSConfig.realMode16BitActive = false;
    currentOSConfig.posixCompliantMode = true;
  }
  
  if (currentOSConfig.activeOS === 'Arch' || currentOSConfig.activeOS === 'Ubuntu') {
    currentOSConfig.systemdActive = true;
  } else {
    currentOSConfig.systemdActive = false;
  }

  return currentOSConfig;
}

export default {
  DEFAULT_OS_REGISTRY_SETTINGS,
  getOSRegistryConfig,
  updateOSRegistryConfig,
};
