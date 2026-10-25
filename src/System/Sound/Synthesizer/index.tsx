/**
 * Synthesizer Core Web Audio synthesis engine
 */
import { getAudioContext, getSoundMode } from '../General/index.tsx';
import { SynthToneParams } from './General/index.tsx';
import { applyBGMDSP } from '../BGM/DSP/index.tsx';

export * from './General/index.tsx';
export * from './8-Bit/index.tsx';
export * from './16-Bit/index.tsx';
export * from './32-Bit/index.tsx';
export * from './64-Bit/index.tsx';

export function playSynthTone(params: SynthToneParams): void {
  try {
    const ctx = getAudioContext();
    const mode = getSoundMode();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    let selectedType: OscillatorType = params.type || 'square';
    if (mode === '16-Bit') {
      selectedType = params.type === 'square' ? 'triangle' : params.type || 'triangle';
    } else if (mode === '32-Bit' || mode === '64-Bit') {
      selectedType = params.type === 'square' ? 'sine' : params.type || 'sine';
    }

    osc.type = selectedType;
    osc.frequency.setValueAtTime(params.frequency, now);

    if (params.sweepTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, params.sweepTo), now + params.duration);
    }

    const baseVol = params.volume !== undefined ? params.volume : 0.2;
    const vol = baseVol * 1.9435; // Amplified by 15% (1.69 * 1.15 = 1.9435)
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + params.duration);

    if (params.lfoFreq && params.lfoDepth) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = params.lfoFreq;
      lfoGain.gain.value = params.lfoDepth;
      lfo.connect(osc.frequency);
      lfo.start(now);
      lfo.stop(now + params.duration);
    }

    if (params.isBGM) {
      applyBGMDSP(osc, gain);
    } else if (mode === '32-Bit' || mode === '64-Bit') {
      const biquad = ctx.createBiquadFilter();
      biquad.type = 'lowpass';
      biquad.frequency.setValueAtTime(mode === '64-Bit' ? 12000 : 8000, now);
      osc.connect(biquad);
      biquad.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + params.duration);

    // Ultra-scientific garbage reclamation: cleanly disconnect nodes on finish to eliminate VRAM/RAM retention
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Safe disconnection
      }
    };
  } catch (e) {
    console.debug('Audio synth playback notice:', e);
  }
}

// Pre-allocated noise buffer cache to avoid per-burst memory allocation
let preallocatedNoiseBuffer: AudioBuffer | null = null;
function getCachedNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!preallocatedNoiseBuffer || preallocatedNoiseBuffer.sampleRate !== ctx.sampleRate) {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of high-fidelity pre-computed noise
    preallocatedNoiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = preallocatedNoiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }
  return preallocatedNoiseBuffer;
}

export function playNoiseBurst(duration: number, volume: number = 0.2, filterFreq: number = 1000): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const buffer = getCachedNoiseBuffer(ctx);

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + duration);

    const gain = ctx.createGain();
    const amplifiedVolume = volume * 1.9435; // Amplified by 15% (1.69 * 1.15 = 1.9435)
    gain.gain.setValueAtTime(amplifiedVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);

    // Auto-disconnect on completion to ensure zero RAM leak
    whiteNoise.onended = () => {
      try {
        whiteNoise.disconnect();
        filter.disconnect();
        gain.disconnect();
      } catch {
        // Safe disconnection
      }
    };
  } catch (e) {
    console.debug('Noise burst notice:', e);
  }
}

export default {
  playSynthTone,
  playNoiseBurst,
};
