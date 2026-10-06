/**
 * High-Definition SFX DSP Synthesis Engine
 * Mode-aware high-fidelity sound synthesis models for Feral Pig vocalizations and mechanics.
 */
import { getAudioContext, getSoundMode } from '../../General/index.tsx';
import { createSaturatorNode, createFormantFilterNode, createPannerNode } from '../../DSP/index.tsx';

/**
 * High-Definition (32-Bit & 64-Bit) Squeal DSP Synthesis Engine
 * Simulates high-tension biological distress screaming using dual-frequency carrier modulation, 
 * formant resonances, and high-speed pitch instability vibratos.
 */
export function playHDSqueal(pitchMod: number = 1.0, pan: number = 0): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const mode = getSoundMode();
    const duration = mode === '64-Bit' ? 0.32 : 0.22;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    const fStart1 = 780 * pitchMod;
    const fEnd1 = 1180 * pitchMod;
    const fStart2 = 540 * pitchMod;
    const fEnd2 = 850 * pitchMod;

    osc1.frequency.setValueAtTime(fStart1, now);
    osc1.frequency.exponentialRampToValueAtTime(fEnd1, now + duration);

    osc2.frequency.setValueAtTime(fStart2, now);
    osc2.frequency.exponentialRampToValueAtTime(fEnd2, now + duration);

    // LFO-driven frequency modulation representing raw panic vocal instability
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(mode === '64-Bit' ? 38 : 28, now);
    lfoGain.gain.setValueAtTime(mode === '64-Bit' ? 55 : 35, now);

    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    const gain = ctx.createGain();
    const baseVol = 0.12;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(baseVol * 1.4, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const formant = createFormantFilterNode(ctx, 950 * pitchMod, 6);
    const saturator = createSaturatorNode(ctx, mode === '64-Bit' ? 45 : 25);

    osc1.connect(formant);
    osc2.connect(formant);
    formant.connect(saturator);

    if (mode === '64-Bit') {
      const panner = createPannerNode(ctx, pan);
      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(14000, now);

      saturator.connect(lpFilter);
      lpFilter.connect(panner);
      panner.connect(gain);
    } else {
      saturator.connect(gain);
    }

    gain.connect(ctx.destination);

    lfo.start(now);
    osc1.start(now);
    osc2.start(now);

    lfo.stop(now + duration);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  } catch (e) {
    console.debug('HDSqueal playback notice:', e);
  }
}

/**
 * High-Definition (32-Bit & 64-Bit) Snort DSP Synthesis Engine
 * Recreates the course nasal rattle and guttural snort characteristics of heavy boars
 * by amplitude-modulating white noise and low grunts with high-speed LFOs.
 */
export function playHDSnort(pitchMod: number = 1.0, pan: number = 0): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const mode = getSoundMode();
    const duration = mode === '64-Bit' ? 0.18 : 0.13;

    // Amplitude modulator simulating heavy flapping wet nostrils
    const flapOsc = ctx.createOscillator();
    const flapGain = ctx.createGain();
    flapOsc.frequency.setValueAtTime(24, now);
    flapGain.gain.setValueAtTime(0.08, now);
    flapGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const grunt = ctx.createOscillator();
    grunt.type = 'triangle';
    grunt.frequency.setValueAtTime(140 * pitchMod, now);
    grunt.frequency.exponentialRampToValueAtTime(60 * pitchMod, now + duration);

    const formant = createFormantFilterNode(ctx, 380 * pitchMod, 5);

    const gain = ctx.createGain();
    const baseVol = 0.12;
    gain.gain.setValueAtTime(baseVol * 1.4, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    flapOsc.connect(flapGain);
    flapGain.connect(gain.gain); // Directly modulate the gain loop node for realistic vibration

    noise.connect(formant);
    formant.connect(gain);
    grunt.connect(gain);

    if (mode === '64-Bit') {
      const panner = createPannerNode(ctx, pan);
      gain.connect(panner);
      panner.connect(ctx.destination);
    } else {
      gain.connect(ctx.destination);
    }

    flapOsc.start(now);
    noise.start(now);
    grunt.start(now);

    flapOsc.stop(now + duration);
    noise.stop(now + duration);
    grunt.stop(now + duration);
  } catch (e) {
    console.debug('HDSnort playback notice:', e);
  }
}

/**
 * High-Definition (32-Bit & 64-Bit) Chest Groan DSP Engine
 */
export function playHDGroan(pitchMod: number = 1.0, pan: number = 0): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const mode = getSoundMode();
    const duration = mode === '64-Bit' ? 0.35 : 0.25;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95 * pitchMod, now);
    osc.frequency.linearRampToValueAtTime(45 * pitchMod, now + duration);

    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.setValueAtTime(400, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12 * 1.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(lpFilter);
    lpFilter.connect(gain);

    if (mode === '64-Bit') {
      const panner = createPannerNode(ctx, pan);
      gain.connect(panner);
      panner.connect(ctx.destination);
    } else {
      gain.connect(ctx.destination);
    }

    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    console.debug('HDGroan playback notice:', e);
  }
}

export default {
  playHDSqueal,
  playHDSnort,
  playHDGroan,
};
