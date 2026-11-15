/**
 * Sound DSP (Digital Signal Processing) Core Module
 * Custom Web Audio filters, saturators, and spatial panners for high-definition audio modes.
 */
import { getAudioContext } from '../General/index.tsx';

/**
 * Creates a Waveshaper node for adding organic vocal saturation to grunt and squeal components.
 */
export function createSaturatorNode(ctx: AudioContext, amount: number = 30): WaveShaperNode {
  const shaper = ctx.createWaveShaper();
  const k = typeof amount === 'number' ? amount : 30;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  shaper.curve = curve;
  shaper.oversample = '4x';
  return shaper;
}

/**
 * Creates a resonant formant-like bandpass filter simulating animal vocal tract properties.
 */
export function createFormantFilterNode(ctx: AudioContext, freq: number, Q: number = 8): BiquadFilterNode {
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = Q;
  return filter;
}

/**
 * Creates a stereo panning node based on emitter screen coordinate position relative to player.
 */
export function createPannerNode(ctx: AudioContext, panValue: number = 0): StereoPannerNode {
  const safePan = Math.max(-1.0, Math.min(1.0, panValue));
  const panner = ctx.createStereoPanner();
  panner.pan.setValueAtTime(safePan, ctx.currentTime);
  return panner;
}

export default {
  createSaturatorNode,
  createFormantFilterNode,
  createPannerNode,
};
