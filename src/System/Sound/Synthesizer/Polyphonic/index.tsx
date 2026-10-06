import { getAudioContext } from '../../General/index.tsx';
import { getMasterAudioBus } from '../../Master_Volume_Control/index.tsx';
import { SynthToneParams } from '../General/index.tsx';

export const CHORD_SEMITONES = {
  MAJOR: [0, 4, 7],
  MINOR: [0, 3, 7],
  DIMINISHED: [0, 3, 6],
  MAJOR_7TH: [0, 4, 7, 11],
  MINOR_7TH: [0, 3, 7, 10],
};

export function calculateChordFrequencies(rootFreq: number, semitones: number[]): number[] {
  return semitones.map((n) => rootFreq * Math.pow(2, n / 12));
}

export function playPolyphonicChord(params: SynthToneParams & { semitones?: number[] }): void {
  try {
    const ctx = getAudioContext();
    const masterBus = getMasterAudioBus();
    const now = ctx.currentTime;
    const semitones = params.semitones || CHORD_SEMITONES.MAJOR;
    const freqs = calculateChordFrequencies(params.frequency, semitones);
    const voiceVol = ((params.volume !== undefined ? params.volume : 0.15) * 1.3) / freqs.length;

    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = params.type || 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      if (params.sweepTo !== undefined) {
        const ratio = params.sweepTo / params.frequency;
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, freq * ratio), now + params.duration);
      }
      gain.gain.setValueAtTime(voiceVol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + params.duration);
      osc.connect(gain);
      gain.connect(masterBus);
      osc.start(now);
      osc.stop(now + params.duration);
    });
  } catch (err) {
    console.debug('Failed playing polyphonic chord:', err);
  }
}

export default {
  playPolyphonicChord,
  CHORD_SEMITONES,
  calculateChordFrequencies,
};
