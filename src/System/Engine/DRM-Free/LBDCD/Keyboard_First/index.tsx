/**
 * System/Engine/DRM-Free/LBDCD/Keyboard_First Module
 * Binds low-latency accessibility inputs, key codes, and standard hardware navigation listeners.
 */

export interface KeyboardState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  action: boolean;
}

/**
 * Maps standard retro/accessible keyboard keys into visual control inputs.
 */
export function mapRawKeyToInputs(keyCode: string): Partial<KeyboardState> {
  switch (keyCode) {
    case 'ArrowUp':
    case 'KeyW':
    case 'Numpad8':
      return { up: true };
    case 'ArrowDown':
    case 'KeyS':
    case 'Numpad2':
      return { down: true };
    case 'ArrowLeft':
    case 'KeyA':
    case 'Numpad4':
      return { left: true };
    case 'ArrowRight':
    case 'KeyD':
    case 'Numpad6':
      return { right: true };
    case 'Space':
    case 'KeyZ':
    case 'Enter':
      return { action: true };
    default:
      return {};
  }
}

export default {
  mapRawKeyToInputs,
};
