/**
 * System/AI/In-Game/TTS/index.tsx
 * In-game tactical speech intelligence orchestrator.
 * Coordinates speech system voice swapping on demand and generates tactical score announcements.
 */
import {
  SpeechSystemMode,
  SpeechSystemProfile,
  SPEECH_SYSTEM_CATALOG,
  SPEECH_SYSTEM_ORDER,
} from './General/index.tsx';
import { speakText, stopSpeaking } from '../../../Sound/TTS/index.tsx';

export * from './General/index.tsx';

const TTS_STORAGE_KEY = 'feral_pig_hunt_tts_mode';

let activeSpeechSystem: SpeechSystemMode = (() => {
  try {
    const saved = localStorage.getItem(TTS_STORAGE_KEY);
    if (saved && saved in SPEECH_SYSTEM_CATALOG) {
      return saved as SpeechSystemMode;
    }
  } catch {
    // LocalStorage fallback
  }
  return 'Arcade Announcer';
})();

type SpeechSystemChangeListener = (newMode: SpeechSystemMode) => void;
const listeners: Set<SpeechSystemChangeListener> = new Set();

/**
 * Retrieve active speech system mode.
 */
export function getCurrentSpeechSystem(): SpeechSystemMode {
  return activeSpeechSystem;
}

/**
 * Retrieve active speech system profile.
 */
export function getCurrentSpeechSystemProfile(): SpeechSystemProfile {
  return SPEECH_SYSTEM_CATALOG[activeSpeechSystem];
}

/**
 * Set speech system mode explicitly.
 */
export function setSpeechSystem(mode: SpeechSystemMode): void {
  if (activeSpeechSystem === mode) return;
  activeSpeechSystem = mode;
  try {
    localStorage.setItem(TTS_STORAGE_KEY, mode);
  } catch {
    // Ignore storage errors
  }
  listeners.forEach((listener) => {
    try {
      listener(mode);
    } catch {
      // Protect execution
    }
  });

  // Provide a short audio confirmation when a new speech system is engaged (unless Off)
  if (mode !== 'Off') {
    const profile = SPEECH_SYSTEM_CATALOG[mode];
    speakText(`${profile.displayName} voice engaged.`, {
      pitch: profile.pitch,
      rate: profile.rate,
      priority: 'high',
    });
  } else {
    stopSpeaking();
  }
}

/**
 * Cycle through speech systems in order on demand (for <button>TTS Mode</button>).
 */
export function cycleSpeechSystem(): SpeechSystemMode {
  const currentIndex = SPEECH_SYSTEM_ORDER.indexOf(activeSpeechSystem);
  const nextIndex = (currentIndex + 1) % SPEECH_SYSTEM_ORDER.length;
  const nextMode = SPEECH_SYSTEM_ORDER[nextIndex];
  setSpeechSystem(nextMode);
  return nextMode;
}

/**
 * Subscribe to speech system changes for UI reactive buttons.
 */
export function subscribeSpeechSystemChange(listener: SpeechSystemChangeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Announce wave completion with score at wave intervals.
 */
export function announceInGameWaveComplete(wave: number, score: number, tension: number = 1.0): void {
  if (activeSpeechSystem === 'Off') return;

  const profile = SPEECH_SYSTEM_CATALOG[activeSpeechSystem];
  const speechText = profile.formatWaveCompletion(wave, score, tension);
  if (!speechText) return;

  speakText(speechText, {
    pitch: profile.pitch,
    rate: profile.rate,
    priority: 'high',
    voiceName: profile.preferredVoiceKeywords[0],
  });
}

/**
 * Announce score update on demand or milestone interval.
 */
export function announceInGameScore(score: number): void {
  if (activeSpeechSystem === 'Off') return;

  const profile = SPEECH_SYSTEM_CATALOG[activeSpeechSystem];
  const speechText = profile.formatScoreUpdate(score);
  if (!speechText) return;

  speakText(speechText, {
    pitch: profile.pitch,
    rate: profile.rate,
    priority: 'normal',
    voiceName: profile.preferredVoiceKeywords[0],
  });
}

/**
 * Announce arbitrary tactical or game events.
 */
export function announceInGameAlert(message: string, priority: 'high' | 'normal' | 'low' = 'normal'): void {
  if (activeSpeechSystem === 'Off') return;

  const profile = SPEECH_SYSTEM_CATALOG[activeSpeechSystem];
  speakText(message, {
    pitch: profile.pitch,
    rate: profile.rate,
    priority,
    voiceName: profile.preferredVoiceKeywords[0],
  });
}

export default {
  getCurrentSpeechSystem,
  getCurrentSpeechSystemProfile,
  setSpeechSystem,
  cycleSpeechSystem,
  subscribeSpeechSystemChange,
  announceInGameWaveComplete,
  announceInGameScore,
  announceInGameAlert,
};
