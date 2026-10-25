/**
 * System/Registry/Engine/DRM-Free/LBDCD Module
 * Registers configuration, active output selection, and permission bits for LBDCD interfaces.
 */

export interface LBDCDRegistryConfig {
  activePort: 'HDMI' | 'VGA' | 'AV' | 'S-VIDEO' | 'TRS-3.5MM' | 'USB' | 'PS2' | 'COM' | 'NONE';
  allowedCaptureCards: string[];
  offlineModeForced: boolean;
  lowRamProfileActive: boolean;
  accessibilityDisplayActive: boolean;
}

export const DEFAULT_LBDCD_REGISTRY_CONFIG: LBDCDRegistryConfig = {
  activePort: 'NONE',
  allowedCaptureCards: ['Elgato', 'AverMedia', 'OBS_Virtual_Camera', 'Blackmagic_DeckLink', 'Generic_USB_Capture'],
  offlineModeForced: false,
  lowRamProfileActive: false,
  accessibilityDisplayActive: false,
};

let currentLBDCDConfig: LBDCDRegistryConfig = { ...DEFAULT_LBDCD_REGISTRY_CONFIG };

export function getLBDCDRegistryConfig(): LBDCDRegistryConfig {
  return currentLBDCDConfig;
}

export function updateLBDCDRegistryConfig(newConfig: Partial<LBDCDRegistryConfig>): LBDCDRegistryConfig {
  currentLBDCDConfig = { ...currentLBDCDConfig, ...newConfig };
  return currentLBDCDConfig;
}

export default {
  DEFAULT_LBDCD_REGISTRY_CONFIG,
  getLBDCDRegistryConfig,
  updateLBDCDRegistryConfig,
};
