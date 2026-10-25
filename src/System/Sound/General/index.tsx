/**
 * Sound General Definitions & Audio Context Singleton
 */
import { SystemModuleInfo } from '../../General/index.tsx';

let audioCtx: AudioContext | null = null;
export type SoundMode = '8-Bit' | '16-Bit' | '32-Bit' | '64-Bit';
let currentSoundMode: SoundMode = '64-Bit';

export function getSoundMode(): SoundMode {
  return currentSoundMode;
}

export function setSoundMode(mode: SoundMode): void {
  currentSoundMode = mode;
}

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export interface SoundPreset {
  name: string;
  volume: number;
  frequencyRange: [number, number];
  type: OscillatorType;
}

export const SoundInfo: SystemModuleInfo = {
  name: 'Sound Engine & Synthesizer Core',
  category: 'Audio',
  status: 'active',
};

export default SoundInfo;
