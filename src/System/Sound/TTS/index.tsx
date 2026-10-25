/**
 * Sound Subsystem - TTS (Text-To-Speech) Sound Channel
 * Orchestrates client-side speech synthesis audio with strict volume attenuation:
 * TTS speech is low by 20% lower than sounds (gain factor = 0.80).
 */
import { TTS_RELATIVE_VOLUME_RATIO, TTSAnnouncementRequest } from './General/index.tsx';
import { getMuteState } from '../Master_Volume_Control/index.tsx';

export * from './General/index.tsx';

let isSpeakingActive = false;
let announcementQueue: TTSAnnouncementRequest[] = [];

/**
 * Retrieve list of client synthesis voices installed in browser.
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.getVoices();
  }
  return [];
}

/**
 * Speak arbitrary text with pitch, rate, and strict 20% lower volume constraint.
 */
export function speakText(
  text: string,
  options?: {
    pitch?: number;
    rate?: number;
    volume?: number;
    voiceName?: string;
    priority?: 'high' | 'normal' | 'low';
  }
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Respect master audio mute
  if (getMuteState()) {
    return;
  }

  const cleanText = text.trim();
  if (!cleanText) return;

  // High priority cancels existing speech to deliver critical tactical or score alerts immediately
  if (options?.priority === 'high') {
    window.speechSynthesis.cancel();
    announcementQueue = [];
    isSpeakingActive = false;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Apply strict volume attenuation: 20% lower than sound effects (0.80)
    const baseVolume = options?.volume !== undefined ? options.volume : 1.0;
    utterance.volume = Math.max(0, Math.min(1.0, baseVolume * TTS_RELATIVE_VOLUME_RATIO));

    utterance.pitch = options?.pitch !== undefined ? options.pitch : 1.0;
    utterance.rate = options?.rate !== undefined ? options.rate : 1.0;

    // Match preferred voice if specified
    if (options?.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const matched = voices.find(
        (v) => v.name.toLowerCase().includes(options.voiceName!.toLowerCase())
      );
      if (matched) {
        utterance.voice = matched;
      }
    }

    utterance.onstart = () => {
      isSpeakingActive = true;
    };

    utterance.onend = () => {
      isSpeakingActive = false;
      processNextAnnouncement();
    };

    utterance.onerror = (e) => {
      // In case of interruption or cancel, cleanly reset speaking flag
      isSpeakingActive = false;
      processNextAnnouncement();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.debug('TTS playback notice:', err);
    isSpeakingActive = false;
  }
}

function processNextAnnouncement(): void {
  if (announcementQueue.length > 0 && !isSpeakingActive) {
    const next = announcementQueue.shift();
    if (next) {
      speakText(next.text, {
        pitch: next.pitch,
        rate: next.rate,
        volume: next.volume,
        priority: next.priority,
      });
    }
  }
}

/**
 * Immediate stop for any active speech output.
 */
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  announcementQueue = [];
  isSpeakingActive = false;
}

/**
 * Query active speech output state.
 */
export function isTTSSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking || isSpeakingActive;
  }
  return isSpeakingActive;
}

/**
 * Announce current game score on demand or at intervals.
 */
export function announceScore(score: number): void {
  const text = `Current score: ${score.toLocaleString()} points.`;
  speakText(text, {
    pitch: 1.05,
    rate: 1.08,
    priority: 'normal',
  });
}

/**
 * Announce completion of wave with points announced.
 */
export function announceWaveCompletion(waveNumber: number, score: number): void {
  const text = `Wave ${waveNumber} complete. Score: ${score.toLocaleString()} points.`;
  speakText(text, {
    pitch: 1.1,
    rate: 1.1,
    priority: 'high',
  });
}

export default {
  speakText,
  stopSpeaking,
  isTTSSpeaking,
  announceScore,
  announceWaveCompletion,
  getAvailableVoices,
};
