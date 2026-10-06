/**
 * System/Engine/OS/Linux/Debian/Xubuntu Module
 * Lightweight XFCE-centric Xubuntu desktop binding profiles. Uses very low system resources.
 */

export interface XubuntuConfig {
  desktopManager: 'XFCE4';
  compositor: 'xfwm4';
  memoryUsageBaseMb: number; // Low RAM desktop target
}

export function initXubuntuDisplay(): XubuntuConfig {
  return {
    desktopManager: 'XFCE4',
    compositor: 'xfwm4',
    memoryUsageBaseMb: 350, // Lightweight
  };
}

export default {
  initXubuntuDisplay,
};
