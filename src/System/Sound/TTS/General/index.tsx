/**
 * Sound Subsystem - TTS (Text-To-Speech) General Definitions & Configuration
 * Mathematical volume attenuation: Strictly 20% lower than sounds (1.0 - 0.20 = 0.80)
 */

export const TTS_RELATIVE_VOLUME_RATIO = 0.80; // 20% lower than sound effects

export interface TTSVoiceProfile {
  name: string;
  lang: string;
  pitch: number;
  rate: number;
  volume: number; // Max 0.80 relative to sound effects
}

export interface TTSAnnouncementRequest {
  text: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  priority?: 'high' | 'normal' | 'low';
  onStart?: () => void;
  onEnd?: () => void;
}

export const TTSGeneralConfig = {
  subsystem: 'Sound/TTS/General',
  defaultLanguage: 'en-US',
  volumeAttenuation: TTS_RELATIVE_VOLUME_RATIO,
  minRate: 0.5,
  maxRate: 2.0,
  minPitch: 0.5,
  maxPitch: 2.0,
};

export default TTSGeneralConfig;
