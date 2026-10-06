// System/Keyboards_and_Controllers/Touchscreen/General/index.tsx
// Scientific specifications and event contracts for mobile phone portrait touchscreen controls.

export interface TouchscreenControlsState {
  isLeftPressed: boolean;
  isRightPressed: boolean;
  isFirePressed: boolean;
  isPaused: boolean;
}

export interface TouchscreenButtonSpec {
  id: string;
  name: string;
  label: string;
  labelExpanded?: string;
  labelCollapsed?: string;
  sublabel?: string;
  ariaLabel: string;
  role: 'directional' | 'action' | 'system';
  colorTheme: {
    border: string;
    background: string;
    text: string;
    activeBackground: string;
    glow: string;
  };
}

export const TOUCHSCREEN_BUTTON_SPECS: Record<string, TouchscreenButtonSpec> = {
  LEFT_ARROW: {
    id: 'Touch_Button_Left_Arrow',
    name: 'Left Arrow',
    label: '◀',
    sublabel: 'LEFT',
    ariaLabel: 'Steer Hunter Craft Left',
    role: 'directional',
    colorTheme: {
      border: '#00f0ff',
      background: 'rgba(0, 240, 255, 0.08)',
      text: '#00f0ff',
      activeBackground: 'rgba(0, 240, 255, 0.35)',
      glow: '0 0 16px rgba(0, 240, 255, 0.45)',
    },
  },
  RIGHT_ARROW: {
    id: 'Touch_Button_Right_Arrow',
    name: 'Right Arrow',
    label: '▶',
    sublabel: 'RIGHT',
    ariaLabel: 'Steer Hunter Craft Right',
    role: 'directional',
    colorTheme: {
      border: '#00f0ff',
      background: 'rgba(0, 240, 255, 0.08)',
      text: '#00f0ff',
      activeBackground: 'rgba(0, 240, 255, 0.35)',
      glow: '0 0 16px rgba(0, 240, 255, 0.45)',
    },
  },
  PAUSE_RESUME: {
    id: 'Touch_Button_Pause_Resume',
    name: 'Pause / Resume',
    label: '⏸ / ▶',
    sublabel: 'SHIFT+7',
    ariaLabel: 'Pause or Resume Game (Shift+7)',
    role: 'system',
    colorTheme: {
      border: '#ffd700',
      background: 'rgba(255, 215, 0, 0.08)',
      text: '#ffd700',
      activeBackground: 'rgba(255, 215, 0, 0.35)',
      glow: '0 0 16px rgba(255, 215, 0, 0.45)',
    },
  },
  BACK_TO_TITLE: {
    id: 'Touch_Button_Back_To_Title',
    name: 'Back To Title Screen',
    label: '↩ TITLE',
    sublabel: 'EXIT',
    ariaLabel: 'Back To Title Screen',
    role: 'system',
    colorTheme: {
      border: '#9ca3af',
      background: 'rgba(156, 163, 175, 0.08)',
      text: '#d1d5db',
      activeBackground: 'rgba(239, 68, 68, 0.35)',
      glow: '0 0 16px rgba(239, 68, 68, 0.45)',
    },
  },
  TOGGLE_COLLAPSE: {
    id: 'Touch_Button_Toggle_Collapse',
    name: 'Toggle Controls Visibility',
    label: '▼ HIDE CONTROLS',
    labelExpanded: '▼ HIDE CONTROLS',
    labelCollapsed: '▲ SHOW CONTROLS',
    sublabel: 'FULLSCREEN',
    ariaLabel: 'Toggle Collapsible Control Deck',
    role: 'system',
    colorTheme: {
      border: '#00f0ff',
      background: 'rgba(0, 240, 255, 0.08)',
      text: '#00f0ff',
      activeBackground: 'rgba(0, 240, 255, 0.3)',
      glow: '0 0 14px rgba(0, 240, 255, 0.4)',
    },
  },
  FIRE_LASER: {
    id: 'Touch_Button_Fire_Laser',
    name: 'Fire Laser',
    label: '⚡ FIRE',
    sublabel: 'SPACE',
    ariaLabel: 'Fire Laser Cannons',
    role: 'action',
    colorTheme: {
      border: '#ff0055',
      background: 'rgba(255, 0, 85, 0.12)',
      text: '#ff3377',
      activeBackground: 'rgba(255, 0, 85, 0.45)',
      glow: '0 0 22px rgba(255, 0, 85, 0.65)',
    },
  },
};

/**
 * Triggers subtle haptic feedback on supported mobile devices.
 */
export const triggerHapticFeedback = (durationMs = 15): void => {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      navigator.vibrate(durationMs);
    } catch {
      // Haptics not allowed or denied by browser security policy
    }
  }
};
