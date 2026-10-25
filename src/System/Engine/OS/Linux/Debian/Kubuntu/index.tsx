/**
 * System/Engine/OS/Linux/Debian/Kubuntu Module
 * KDE Plasma-centric Kubuntu desktop profile. Utilizes Qt framework visual widgets.
 */

export interface KubuntuConfig {
  desktopManager: 'Plasma';
  toolkit: 'Qt6';
  renderingBackend: 'OpenGL' | 'Vulkan';
}

export function loadKubuntuVisuals(): KubuntuConfig {
  return {
    desktopManager: 'Plasma',
    toolkit: 'Qt6',
    renderingBackend: 'OpenGL',
  };
}

export default {
  loadKubuntuVisuals,
};
