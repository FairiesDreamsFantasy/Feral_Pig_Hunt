import { getAudioContext } from '../../General/index.tsx';
import { getMasterAudioBus } from '../../Master_Volume_Control/index.tsx';

export * from './8-Bit/index.tsx';
export * from './16-Bit/index.tsx';
export * from './32-Bit/index.tsx';
export * from './64-Bit/index.tsx';

export interface HDSynthParams {
  carrierFreq: number;
  carrierType?: OscillatorType;
  modulatorFreq: number;
  modulatorIndex: number;
  duration: number;
  cutoffFreq?: number;
  resonance?: number;
  volume?: number;
}

export function playHDFMTone(params: HDSynthParams): void {
  try {
    const ctx = getAudioContext();
    const masterBus = getMasterAudioBus();
    const now = ctx.currentTime;

    const carrier = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const carrierGain = ctx.createGain();
    const modulatorGain = ctx.createGain();

    carrier.type = params.carrierType || 'sine';
    carrier.frequency.setValueAtTime(params.carrierFreq, now);
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(params.modulatorFreq, now);

    const modDepth = params.modulatorFreq * params.modulatorIndex;
    modulatorGain.gain.setValueAtTime(modDepth, now);
    modulatorGain.gain.exponentialRampToValueAtTime(0.0001, now + params.duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const cutoff = params.cutoffFreq || params.carrierFreq * 2.5;
    filter.frequency.setValueAtTime(cutoff, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + params.duration);
    filter.Q.setValueAtTime(params.resonance !== undefined ? params.resonance : 8.0, now);

    modulator.connect(modulatorGain);
    modulatorGain.connect(carrier.frequency);

    const vol = (params.volume !== undefined ? params.volume : 0.15) * 1.3;
    carrierGain.gain.setValueAtTime(vol, now);
    carrierGain.gain.exponentialRampToValueAtTime(0.0001, now + params.duration);

    carrier.connect(carrierGain);
    carrierGain.connect(filter);
    filter.connect(masterBus);

    modulator.start(now);
    carrier.start(now);
    modulator.stop(now + params.duration);
    carrier.stop(now + params.duration);
  } catch (err) {
    console.debug('Failed playing HD FM voice:', err);
  }
}

export default { playHDFMTone };
