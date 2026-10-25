import { playPolyphonicChord, CHORD_SEMITONES } from '../../../Synthesizer/Polyphonic/index.tsx';
export function playLevelClearedFanfare(): void {
  playPolyphonicChord({ frequency: 349.23, semitones: CHORD_SEMITONES.MAJOR_7TH, duration: 1.2, type: 'sawtooth', sweepTo: 698.46, volume: 0.12 });
}
export function playLossFanfare(): void {
  playPolyphonicChord({ frequency: 146.83, semitones: CHORD_SEMITONES.DIMINISHED, duration: 1.5, type: 'sawtooth', sweepTo: 73.42, volume: 0.18 });
}
export default { playLevelClearedFanfare, playLossFanfare };
