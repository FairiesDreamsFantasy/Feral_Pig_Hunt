/**
 * System/Registry/Engine/DRM-Free/General Module
 * Integrates open-source permissive licensing registry bits and general screen capture indicators.
 */

export interface DRMFreeGeneralRegistryConfig {
  permissiveSharingAllowed: boolean;
  builtInScreenshotToolEnabled: boolean;
  builtInVideoCaptureDeviceEnabled: boolean;
  openSourcePermissiveModeFlag: boolean;
}

export const DEFAULT_DRM_FREE_GENERAL_CONFIG: DRMFreeGeneralRegistryConfig = {
  permissiveSharingAllowed: true,
  builtInScreenshotToolEnabled: true,
  builtInVideoCaptureDeviceEnabled: true,
  openSourcePermissiveModeFlag: true, // Always true - game is designed to be shared
};

let currentGeneralConfig: DRMFreeGeneralRegistryConfig = { ...DEFAULT_DRM_FREE_GENERAL_CONFIG };

export function getDRMFreeGeneralRegistryConfig(): DRMFreeGeneralRegistryConfig {
  return currentGeneralConfig;
}

export function updateDRMFreeGeneralRegistryConfig(newConfig: Partial<DRMFreeGeneralRegistryConfig>): DRMFreeGeneralRegistryConfig {
  currentGeneralConfig = { ...currentGeneralConfig, ...newConfig };
  return currentGeneralConfig;
}

export default {
  DEFAULT_DRM_FREE_GENERAL_CONFIG,
  getDRMFreeGeneralRegistryConfig,
  updateDRMFreeGeneralRegistryConfig,
};
