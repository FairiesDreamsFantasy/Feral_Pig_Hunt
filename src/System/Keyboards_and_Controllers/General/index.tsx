/**
 * Keyboards and Controllers General
 */
export interface KeyState {
  ArrowLeft: boolean;
  ArrowRight: boolean;
  Space: boolean;
  Pause: boolean;
}

export const KeyboardGeneral = {
  repeatPrevented: true,
  debounceMs: 60,
};

export default KeyboardGeneral;
