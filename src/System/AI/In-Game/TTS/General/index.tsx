/**
 * System/AI/In-Game/TTS/General/index.tsx
 * Architectural specifications and speech system profile catalog for In-Game TTS.
 * Supports swapping voices and speech systems on demand via the player page.
 */

export type SpeechSystemMode =
  | 'Arcade Announcer'
  | 'Cybernetic'
  | 'Tactical AI'
  | 'Retro Vox'
  | 'Off';

export type TTSMode = SpeechSystemMode;

export interface SpeechSystemProfile {
  id: SpeechSystemMode;
  displayName: string;
  description: string;
  pitch: number;
  rate: number;
  relativeVolume: number; // Strictly 0.80 (20% lower than sound effects)
  preferredVoiceKeywords: string[];
  formatWaveCompletion: (wave: number, score: number, tension?: number) => string;
  formatScoreUpdate: (score: number) => string;
}

export const SPEECH_SYSTEM_CATALOG: Record<SpeechSystemMode, SpeechSystemProfile> = {
  'Arcade Announcer': {
    id: 'Arcade Announcer',
    displayName: 'Arcade Announcer',
    description: 'Energetic classic arcade cabinet announcer with crisp delivery',
    pitch: 1.10,
    rate: 1.12,
    relativeVolume: 0.80,
    preferredVoiceKeywords: ['english', 'en-US', 'alex', 'david', 'natural'],
    formatWaveCompletion: (wave: number, score: number, tension = 1.0) => {
      if (tension > 1.6) {
        return `Wave ${wave} cleared! Blazing action! Current score: ${score.toLocaleString()} points!`;
      }
      return `Wave ${wave} complete! Awesome shooting! Score: ${score.toLocaleString()} points.`;
    },
    formatScoreUpdate: (score: number) => `Score update: ${score.toLocaleString()} points!`,
  },

  'Cybernetic': {
    id: 'Cybernetic',
    displayName: 'Cybernetic',
    description: 'Robotic cyber-hunter synthetic interface with deep resonance',
    pitch: 0.72,
    rate: 0.95,
    relativeVolume: 0.80,
    preferredVoiceKeywords: ['robot', 'synth', 'male', 'zarvox', 'en-GB'],
    formatWaveCompletion: (wave: number, score: number) =>
      `Sector ${wave} sterilized. Feral wave neutralized. Total tally: ${score.toLocaleString()} points.`,
    formatScoreUpdate: (score: number) => `Combat tally: ${score.toLocaleString()} points registered.`,
  },

  'Tactical AI': {
    id: 'Tactical AI',
    displayName: 'Tactical AI',
    description: 'Strategic military defense command computer with analytical authority',
    pitch: 0.88,
    rate: 1.05,
    relativeVolume: 0.80,
    preferredVoiceKeywords: ['samantha', 'google', 'command', 'en-US', 'natural'],
    formatWaveCompletion: (wave: number, score: number, tension = 1.0) => {
      const tensionRating = tension > 1.5 ? 'High dynamic threat' : 'Target swarm';
      return `Tactical update. ${tensionRating} in Wave ${wave} eliminated. Score: ${score.toLocaleString()} points.`;
    },
    formatScoreUpdate: (score: number) => `Telemetry update: Current combat score ${score.toLocaleString()} points.`,
  },

  'Retro Vox': {
    id: 'Retro Vox',
    displayName: 'Retro Vox',
    description: 'Fast-paced vintage 8-bit synthetic speech emulator',
    pitch: 1.45,
    rate: 1.25,
    relativeVolume: 0.80,
    preferredVoiceKeywords: ['fred', 'junior', 'en', 'compact'],
    formatWaveCompletion: (wave: number, score: number) =>
      `Wave ${wave} cleared. Score: ${score.toLocaleString()} points.`,
    formatScoreUpdate: (score: number) => `Points: ${score.toLocaleString()}.`,
  },

  'Off': {
    id: 'Off',
    displayName: 'Muted / Off',
    description: 'Speech output muted; pure synthesized chiptune SFX and BGM only',
    pitch: 1.0,
    rate: 1.0,
    relativeVolume: 0.0,
    preferredVoiceKeywords: [],
    formatWaveCompletion: () => '',
    formatScoreUpdate: () => '',
  },
};

export const SPEECH_SYSTEM_ORDER: SpeechSystemMode[] = [
  'Arcade Announcer',
  'Cybernetic',
  'Tactical AI',
  'Retro Vox',
  'Off',
];
