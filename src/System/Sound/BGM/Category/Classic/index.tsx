import { playSynthTone } from '../../../Synthesizer/index.tsx';
export const CLASSIC_MELODY_FREQUENCIES = [
  220, 261.63, 293.66, 329.63, 392.0, 329.63, 293.66, 261.63,
  196, 246.94, 293.66, 329.63, 392.0, 440.0, 392.0, 329.63,
  164.81, 196.0, 246.94, 293.66, 329.63, 293.66, 246.94, 196.0,
  220, 261.63, 329.63, 440.0, 523.25, 440.0, 329.63, 261.63
];
export const CLASSIC_BASS_FREQUENCIES = [
  110, 110, 110, 110, 98, 98, 98, 98,
  82.4, 82.4, 82.4, 82.4, 110, 110, 110, 110
];
export function playClassicChiptuneStep(stepIndex: number): void {
  const melodyFreq = CLASSIC_MELODY_FREQUENCIES[stepIndex % CLASSIC_MELODY_FREQUENCIES.length];
  const bassFreq = CLASSIC_BASS_FREQUENCIES[Math.floor(stepIndex / 2) % CLASSIC_BASS_FREQUENCIES.length];
  playSynthTone({ frequency: melodyFreq, duration: 0.1, type: 'triangle', volume: 0.065 });
  if (stepIndex % 2 === 0) {
    playSynthTone({ frequency: bassFreq, duration: 0.18, type: 'sawtooth', volume: 0.052 });
  }
}
export default { playClassicChiptuneStep };
