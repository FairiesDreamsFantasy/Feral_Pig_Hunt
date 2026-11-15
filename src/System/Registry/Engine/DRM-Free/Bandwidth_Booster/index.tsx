/**
 * System/Registry/Engine/DRM-Free/Bandwidth_Booster Module
 * Tracks active run-length encoding thresholds and predictive frames registry parameters.
 */

export interface BandwidthBoosterRegistryConfig {
  compressionEnabled: boolean;
  rleBlockSize: number;
  frameBufferLineLimit: number;
  predictiveDeltaMatching: boolean;
}

export const DEFAULT_BOOSTER_REGISTRY_CONFIG: BandwidthBoosterRegistryConfig = {
  compressionEnabled: true,
  rleBlockSize: 64,
  frameBufferLineLimit: 1024,
  predictiveDeltaMatching: true,
};

let currentBoosterConfig: BandwidthBoosterRegistryConfig = { ...DEFAULT_BOOSTER_REGISTRY_CONFIG };

export function getBoosterRegistryConfig(): BandwidthBoosterRegistryConfig {
  return currentBoosterConfig;
}

export function updateBoosterRegistryConfig(newConfig: Partial<BandwidthBoosterRegistryConfig>): BandwidthBoosterRegistryConfig {
  currentBoosterConfig = { ...currentBoosterConfig, ...newConfig };
  return currentBoosterConfig;
}

export default {
  DEFAULT_BOOSTER_REGISTRY_CONFIG,
  getBoosterRegistryConfig,
  updateBoosterRegistryConfig,
};
