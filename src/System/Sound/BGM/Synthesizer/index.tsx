import { playSynthTone } from '../../Synthesizer/index.tsx';
import { BGMSynthConfig } from './General/index.tsx';

export * from './General/index.tsx';
export * from './8-Bit/index.tsx';
export * from './16-Bit/index.tsx';
export * from './32-Bit/index.tsx';
export * from './64-Bit/index.tsx';

let bgmInterval: number | null = null;
let noteIndex = 0;

const melodyFrequencies = [
  220, 261.63, 293.66, 329.63, 392.0, 329.63, 293.66, 261.63,
  196, 246.94, 293.66, 329.63, 392.0, 440.0, 392.0, 329.63,
  164.81, 196.0, 246.94, 293.66, 329.63, 293.66, 246.94, 196.0,
  220, 261.63, 329.63, 440.0, 523.25, 440.0, 329.63, 261.63
];

const bassFrequencies = [
  110, 110, 110, 110, 98, 98, 98, 98,
  82.4, 82.4, 82.4, 82.4, 110, 110, 110, 110
];

export function startArcadeBGM(): void {
  if (bgmInterval !== null) return;
  noteIndex = 0;
  bgmInterval = window.setInterval(() => {
    const melodyFreq = melodyFrequencies[noteIndex % melodyFrequencies.length];
    const bassFreq = bassFrequencies[Math.floor(noteIndex / 2) % bassFrequencies.length];
    playSynthTone({
      frequency: melodyFreq,
      duration: 0.1,
      type: BGMSynthConfig.waveform,
      volume: 0.065,
      isBGM: true,
    });
    if (noteIndex % 2 === 0) {
      playSynthTone({
        frequency: bassFreq,
        duration: 0.18,
        type: 'sawtooth',
        volume: 0.052,
        isBGM: true,
      });
    }
    noteIndex++;
  }, BGMSynthConfig.arpeggioSpeedMs);
}

export function stopArcadeBGM(): void {
  if (bgmInterval !== null) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

export default {
  startArcadeBGM,
  stopArcadeBGM,
};
