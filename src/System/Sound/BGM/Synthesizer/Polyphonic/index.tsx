import { playPolyphonicChord, CHORD_SEMITONES } from '../../../Synthesizer/Polyphonic/index.tsx';
export const BGM_CHORD_PROGRESSION = [
  { root: 196.00, semitones: CHORD_SEMITONES.MINOR },
  { root: 196.00, semitones: CHORD_SEMITONES.MINOR },
  { root: 261.63, semitones: CHORD_SEMITONES.MINOR },
  { root: 293.66, semitones: CHORD_SEMITONES.MAJOR },
];
export function playBGMBackingChord(index: number, duration: number, volume: number = 0.08): void {
  const chord = BGM_CHORD_PROGRESSION[index % BGM_CHORD_PROGRESSION.length];
  playPolyphonicChord({ frequency: chord.root, semitones: chord.semitones, duration, type: 'triangle', volume });
}
export default { playBGMBackingChord, BGM_CHORD_PROGRESSION };
