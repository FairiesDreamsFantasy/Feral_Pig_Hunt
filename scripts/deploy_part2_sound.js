/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

function write(relPath, content) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log(`[Part 2] Created: ${relPath}`);
}

// 1. General & Context
write("src/System/Sound/General/index.tsx", `/**
 * Sound General Definitions & Audio Context Singleton
 */
import { SystemModuleInfo } from '../../General/index.tsx';

let audioCtx: AudioContext | null = null;
export type SoundMode = '8-Bit' | '16-Bit' | '32-Bit' | '64-Bit';
let currentSoundMode: SoundMode = '8-Bit';

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
`);

// 2. Master Volume Control (+30% amplification)
write("src/System/Sound/Master_Volume_Control/index.tsx", `/**
 * Sound Subsystem - Master Volume Control
 */
import { getAudioContext } from '../General/index.tsx';

let masterGainNode: GainNode | null = null;
let dynamicsCompressor: DynamicsCompressorNode | null = null;
let isMuted: boolean = false;
let globalVolume: number = 1.30; // amplified by 30%

export function getMasterAudioBus(): GainNode {
  const ctx = getAudioContext();
  if (!masterGainNode) {
    dynamicsCompressor = ctx.createDynamicsCompressor();
    dynamicsCompressor.threshold.value = -12;
    dynamicsCompressor.knee.value = 30;
    dynamicsCompressor.ratio.value = 12;
    dynamicsCompressor.attack.value = 0.003;
    dynamicsCompressor.release.value = 0.15;
    
    masterGainNode = ctx.createGain();
    masterGainNode.gain.setValueAtTime(isMuted ? 0 : globalVolume, ctx.currentTime);
    
    masterGainNode.connect(dynamicsCompressor);
    dynamicsCompressor.connect(ctx.destination);
  }
  return masterGainNode;
}

export function setMasterVolume(vol: number): void {
  globalVolume = Math.max(0.0, Math.min(1.3, vol));
  if (!isMuted) {
    const ctx = getAudioContext();
    const bus = getMasterAudioBus();
    bus.gain.setTargetAtTime(globalVolume, ctx.currentTime, 0.05);
  }
}

export function getMasterVolume(): number {
  return globalVolume;
}

export function toggleMasterMute(): boolean {
  isMuted = !isMuted;
  const ctx = getAudioContext();
  const bus = getMasterAudioBus();
  const targetGain = isMuted ? 0.0 : globalVolume;
  bus.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.03);
  return isMuted;
}

export function getMuteState(): boolean {
  return isMuted;
}

export default {
  getMasterAudioBus,
  setMasterVolume,
  getMasterVolume,
  toggleMasterMute,
  getMuteState,
};
`);

// 3. Stereo & Haas Panning
write("src/System/Sound/Stereo/General/index.tsx", `/**
 * Equal-Power Stereo Panning & Haas Precedence Delay
 */
import { getAudioContext } from '../../General/index.tsx';

export function calculateStereoGains(canvasX: number, canvasWidth: number): { leftGain: number; rightGain: number } {
  const p = Math.max(-1.0, Math.min(1.0, (2.0 * canvasX) / canvasWidth - 1.0));
  const angle = (Math.PI / 4.0) * (p + 1.0);
  const leftGain = Math.cos(angle);
  const rightGain = Math.sin(angle);
  return { leftGain, rightGain };
}

export function applySpatialStereoAndHaas(
  sourceNode: AudioNode,
  canvasX: number,
  canvasWidth: number,
  targetDestination: AudioNode
): void {
  try {
    const ctx = getAudioContext();
    const { leftGain, rightGain } = calculateStereoGains(canvasX, canvasWidth);

    const splitter = ctx.createChannelSplitter(2);
    const merger = ctx.createChannelMerger(2);

    const gainLeft = ctx.createGain();
    const gainRight = ctx.createGain();
    gainLeft.gain.value = leftGain;
    gainRight.gain.value = rightGain;

    const delayNodeLeft = ctx.createDelay(0.1);
    const delayNodeRight = ctx.createDelay(0.1);

    const panRatio = (2.0 * canvasX) / canvasWidth - 1.0;
    const baseDelaySec = 0.018;
    delayNodeLeft.delayTime.value = panRatio > 0 ? panRatio * baseDelaySec : 0;
    delayNodeRight.delayTime.value = panRatio < 0 ? Math.abs(panRatio) * baseDelaySec : 0;

    sourceNode.connect(splitter);
    splitter.connect(gainLeft, 0);
    splitter.connect(gainRight, 0);
    gainLeft.connect(delayNodeLeft);
    gainRight.connect(delayNodeRight);
    delayNodeLeft.connect(merger, 0, 0);
    delayNodeRight.connect(merger, 0, 1);
    merger.connect(targetDestination);
  } catch (err) {
    console.debug("Failed to apply spatial Haas delay:", err);
    sourceNode.connect(targetDestination);
  }
}

export const StereoGeneralInfo = {
  description: "Acoustic spatial equations including Equal-Power Pan and Haas Precedence Integration",
  speedOfSound: 343.2,
  interauralDistance: 0.178,
};

export default StereoGeneralInfo;
`);

write("src/System/Sound/Stereo/index.tsx", `export * from './General/index.tsx';
export default {
  description: 'Stereo Sound Subsystem'
};
`);

// 4. Acoustic Doppler & Sound Spatialization Engine
write("src/System/Sound/Engine/General/index.tsx", `export const ACOUSTIC_CONSTANTS = {
  SPEED_OF_SOUND_MPS: 343.2,
  CANVAS_TO_METERS_RATIO: 0.1,
  MIN_AUDIBLE_DISTANCE: 1.5,
  MAX_AUDIBLE_DISTANCE: 80.0,
};

export default ACOUSTIC_CONSTANTS;
`);

write("src/System/Sound/Engine/index.tsx", `/**
 * Sound Spatialization Engine
 */
import { ACOUSTIC_CONSTANTS } from './General/index.tsx';
import { getAudioContext } from '../General/index.tsx';
import { getMasterAudioBus } from '../Master_Volume_Control/index.tsx';
import { calculateStereoGains } from '../Stereo/General/index.tsx';

export * from './General/index.tsx';

export interface SpatialAudioEvent {
  emitterPos: { x: number; y: number };
  emitterVelocity: { x: number; y: number };
  observerPos: { x: number; y: number };
  observerVelocity: { x: number; y: number };
  emittedFrequency: number;
}

export function calculateDopplerAndAttenuation(event: SpatialAudioEvent): {
  shiftedFrequency: number;
  attenuatedVolume: number;
} {
  const { emitterPos, emitterVelocity, observerPos, observerVelocity, emittedFrequency } = event;

  const dx = (observerPos.x - emitterPos.x) * ACOUSTIC_CONSTANTS.CANVAS_TO_METERS_RATIO;
  const dy = (observerPos.y - emitterPos.y) * ACOUSTIC_CONSTANTS.CANVAS_TO_METERS_RATIO;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const clampedDistance = Math.max(ACOUSTIC_CONSTANTS.MIN_AUDIBLE_DISTANCE, distance);

  const referenceDistance = 2.5;
  let volumeFactor = (referenceDistance * referenceDistance) / (clampedDistance * clampedDistance);

  if (clampedDistance > ACOUSTIC_CONSTANTS.MAX_AUDIBLE_DISTANCE) {
    volumeFactor = 0.0;
  }

  const magnitude = Math.sqrt(dx * dx + dy * dy) || 1.0;
  const ux = dx / magnitude;
  const uy = dy / magnitude;

  const vObserverProj = observerVelocity.x * ACOUSTIC_CONSTANTS.CANVAS_TO_METERS_RATIO * ux +
                        observerVelocity.y * ACOUSTIC_CONSTANTS.CANVAS_TO_METERS_RATIO * uy;
  const vEmitterProj = emitterVelocity.x * ACOUSTIC_CONSTANTS.CANVAS_TO_METERS_RATIO * ux +
                       emitterVelocity.y * ACOUSTIC_CONSTANTS.CANVAS_TO_METERS_RATIO * uy;

  const vSound = ACOUSTIC_CONSTANTS.SPEED_OF_SOUND_MPS;
  const numerator = vSound + vObserverProj;
  const denominator = vSound - vEmitterProj;
  let shiftedFrequency = emittedFrequency;

  if (Math.abs(denominator) > 0.01) {
    const dopplerRatio = numerator / denominator;
    shiftedFrequency = emittedFrequency * Math.max(0.1, Math.min(4.0, dopplerRatio));
  }

  return {
    shiftedFrequency,
    attenuatedVolume: Math.min(1.5, volumeFactor),
  };
}

export function playSpatialDopplerTone(
  event: SpatialAudioEvent,
  duration: number,
  type: OscillatorType = 'triangle',
  baseVolume: number = 0.15
): void {
  try {
    const ctx = getAudioContext();
    const masterBus = getMasterAudioBus();
    const now = ctx.currentTime;
    const { shiftedFrequency, attenuatedVolume } = calculateDopplerAndAttenuation(event);
    const finalVolume = baseVolume * attenuatedVolume;
    if (finalVolume <= 0.001) return;

    const { leftGain, rightGain } = calculateStereoGains(event.emitterPos.x, 800);
    const splitter = ctx.createChannelSplitter(2);
    const merger = ctx.createChannelMerger(2);
    const osc = ctx.createOscillator();
    const gainLeft = ctx.createGain();
    const gainRight = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(shiftedFrequency, now);

    gainLeft.gain.setValueAtTime(finalVolume * leftGain, now);
    gainLeft.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gainRight.gain.setValueAtTime(finalVolume * rightGain, now);
    gainRight.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(splitter);
    splitter.connect(gainLeft, 0);
    splitter.connect(gainRight, 0);
    gainLeft.connect(merger, 0, 0);
    gainRight.connect(merger, 0, 1);
    merger.connect(masterBus);

    osc.start(now);
    osc.stop(now + duration);
  } catch (err) {
    console.debug('Failed to dispatch Doppler tone:', err);
  }
}

export default {
  calculateDopplerAndAttenuation,
  playSpatialDopplerTone,
};
`);

// 5. Core Synthesizer & Bitrates
write("src/System/Sound/Synthesizer/General/index.tsx", `export interface SynthToneParams {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  sweepTo?: number;
  lfoFreq?: number;
  lfoDepth?: number;
}
export const SynthesizerInfo = { name: 'Arcade Wave Synthesizer' };
export default SynthesizerInfo;
`);

write("src/System/Sound/Synthesizer/8-Bit/index.tsx", `export const SYNTH_8BIT_PROFILE = { bitDepth: 8, waveform: 'square' as OscillatorType }; export default SYNTH_8BIT_PROFILE;`);
write("src/System/Sound/Synthesizer/16-Bit/index.tsx", `export const SYNTH_16BIT_PROFILE = { bitDepth: 16, waveform: 'triangle' as OscillatorType }; export default SYNTH_16BIT_PROFILE;`);
write("src/System/Sound/Synthesizer/32-Bit/index.tsx", `export const SYNTH_32BIT_PROFILE = { bitDepth: 32, waveform: 'sine' as OscillatorType }; export default SYNTH_32BIT_PROFILE;`);
write("src/System/Sound/Synthesizer/64-Bit/index.tsx", `export const SYNTH_64BIT_PROFILE = { bitDepth: 64, waveform: 'sine' as OscillatorType }; export default SYNTH_64BIT_PROFILE;`);

write("src/System/Sound/Synthesizer/Polyphonic/index.tsx", `import { getAudioContext } from '../../General/index.tsx';
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
`);

write("src/System/Sound/Synthesizer/index.tsx", `/**
 * Synthesizer Core Web Audio synthesis engine
 */
import { getAudioContext, getSoundMode } from '../General/index.tsx';
import { SynthToneParams } from './General/index.tsx';

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
    const vol = baseVol * 1.3;
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

    if (mode === '32-Bit' || mode === '64-Bit') {
      const biquad = ctx.createBiquadFilter();
      biquad.type = 'lowpass';
      biquad.frequency.value = mode === '64-Bit' ? 12000 : 8000;
      osc.connect(biquad);
      biquad.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + params.duration);
  } catch (e) {
    console.debug('Audio synth playback notice:', e);
  }
}

export function playNoiseBurst(duration: number, volume: number = 0.2, filterFreq: number = 1000): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + duration);

    const gain = ctx.createGain();
    const amplifiedVolume = volume * 1.3;
    gain.gain.setValueAtTime(amplifiedVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + duration);
  } catch (e) {
    console.debug('Noise burst notice:', e);
  }
}

export default {
  playSynthTone,
  playNoiseBurst,
};
`);

// 6. HD Synthesizer
write("src/System/Sound/HD/General/index.tsx", `export const HDQuality = { highFidelityOscillators: true }; export default HDQuality;`);
write("src/System/Sound/HD/Synthesizer/8-Bit/index.tsx", `export const HD_8BIT_CONFIG = { modulationIndex: 1.5 }; export default HD_8BIT_CONFIG;`);
write("src/System/Sound/HD/Synthesizer/16-Bit/index.tsx", `export const HD_16BIT_CONFIG = { modulationIndex: 4.0 }; export default HD_16BIT_CONFIG;`);
write("src/System/Sound/HD/Synthesizer/32-Bit/index.tsx", `export const HD_32BIT_CONFIG = { modulationIndex: 8.5 }; export default HD_32BIT_CONFIG;`);
write("src/System/Sound/HD/Synthesizer/64-Bit/index.tsx", `export const HD_64BIT_CONFIG = { modulationIndex: 16.0 }; export default HD_64BIT_CONFIG;`);
write("src/System/Sound/HD/Synthesizer/index.tsx", `import { getAudioContext } from '../../General/index.tsx';
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
`);
write("src/System/Sound/HD/index.tsx", `export * from './General/index.tsx'; export * from './Synthesizer/index.tsx'; export default { type: 'HD Audio Engine' };`);

// 7. BGM Subsystem
write("src/System/Sound/BGM/General/index.tsx", `export const ArcadeBGMTrack = { title: 'Ecosystem Defense Theme', bpm: 130 }; export default ArcadeBGMTrack;`);
write("src/System/Sound/BGM/Category/General/index.tsx", `export default { category: 'BGM General' };`);
write("src/System/Sound/BGM/Category/Classic/index.tsx", `import { playSynthTone } from '../../../Synthesizer/index.tsx';
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
`);
write("src/System/Sound/BGM/Category/Chip_Tunes/8-Bit/index.tsx", `export default {};`);
write("src/System/Sound/BGM/Category/Chip_Tunes/16-Bit/index.tsx", `export default {};`);
write("src/System/Sound/BGM/Category/Chip_Tunes/32-Bit/index.tsx", `export default {};`);
write("src/System/Sound/BGM/Category/Chip_Tunes/64-Bit/index.tsx", `export default {};`);
write("src/System/Sound/BGM/Category/Chip_Tunes/index.tsx", `export default {};`);
write("src/System/Sound/BGM/Category/index.tsx", `export default {};`);

write("src/System/Sound/BGM/Synthesizer/General/index.tsx", `export const BGMSynthConfig = { arpeggioSpeedMs: 125, waveform: 'triangle' as OscillatorType, baseOctave: 3 }; export default BGMSynthConfig;`);
write("src/System/Sound/BGM/Synthesizer/8-Bit/index.tsx", `export default {};`);
write("src/System/Sound/BGM/Synthesizer/16-Bit/index.tsx", `export default {};`);
write("src/System/Sound/BGM/Synthesizer/32-Bit/index.tsx", `export default {};`);
write("src/System/Sound/BGM/Synthesizer/64-Bit/index.tsx", `export default {};`);
write("src/System/Sound/BGM/Synthesizer/Polyphonic/index.tsx", `import { playPolyphonicChord, CHORD_SEMITONES } from '../../../Synthesizer/Polyphonic/index.tsx';
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
`);

write("src/System/Sound/BGM/Synthesizer/index.tsx", `import { playSynthTone } from '../../Synthesizer/index.tsx';
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
    });
    if (noteIndex % 2 === 0) {
      playSynthTone({
        frequency: bassFreq,
        duration: 0.18,
        type: 'sawtooth',
        volume: 0.052,
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
`);

write("src/System/Sound/BGM/index.tsx", `export * from './General/index.tsx'; export * from './Synthesizer/index.tsx'; export default { category: 'BGM' };`);

// 8. SFX Subsystem (Hunter + Complete Feral Pig Suite)
write("src/System/Sound/SFX/General/index.tsx", `export const SFXCategories = ['Feral_Pig', 'Hunter_Laser', 'Explosion', 'UI']; export default SFXCategories;`);
write("src/System/Sound/SFX/Synthesizer/General/index.tsx", `export const SFXSynthParams = { laserFreqStart: 950, laserFreqEnd: 180, laserDuration: 0.09 }; export default SFXSynthParams;`);
write("src/System/Sound/SFX/Synthesizer/8-Bit/index.tsx", `export default {};`);
write("src/System/Sound/SFX/Synthesizer/16-Bit/index.tsx", `export default {};`);
write("src/System/Sound/SFX/Synthesizer/32-Bit/index.tsx", `export default {};`);
write("src/System/Sound/SFX/Synthesizer/64-Bit/index.tsx", `export default {};`);
write("src/System/Sound/SFX/Synthesizer/Polyphonic/index.tsx", `import { playPolyphonicChord, CHORD_SEMITONES } from '../../../Synthesizer/Polyphonic/index.tsx';
export function playLevelClearedFanfare(): void {
  playPolyphonicChord({ frequency: 349.23, semitones: CHORD_SEMITONES.MAJOR_7TH, duration: 1.2, type: 'sawtooth', sweepTo: 698.46, volume: 0.12 });
}
export function playLossFanfare(): void {
  playPolyphonicChord({ frequency: 146.83, semitones: CHORD_SEMITONES.DIMINISHED, duration: 1.5, type: 'sawtooth', sweepTo: 73.42, volume: 0.18 });
}
export default { playLevelClearedFanfare, playLossFanfare };
`);

write("src/System/Sound/SFX/Synthesizer/index.tsx", `import { playSynthTone, playNoiseBurst } from '../../Synthesizer/index.tsx';
import { SFXSynthParams } from './General/index.tsx';

export * from './General/index.tsx';
export * from './8-Bit/index.tsx';
export * from './16-Bit/index.tsx';
export * from './32-Bit/index.tsx';
export * from './64-Bit/index.tsx';

export function playLaserShotSFX(): void {
  playSynthTone({ frequency: SFXSynthParams.laserFreqStart, sweepTo: SFXSynthParams.laserFreqEnd, duration: SFXSynthParams.laserDuration, type: 'sawtooth', volume: 0.18 });
}

export function playExplosionSFX(isMajor: boolean = false): void {
  playNoiseBurst(isMajor ? 0.6 : 0.35, isMajor ? 0.35 : 0.22, isMajor ? 800 : 1200);
  playSynthTone({ frequency: isMajor ? 120 : 180, sweepTo: 30, duration: isMajor ? 0.5 : 0.3, type: 'triangle', volume: isMajor ? 0.3 : 0.18 });
}

export function playPlayerDeathSFX(): void {
  playExplosionSFX(true);
  playSynthTone({ frequency: 300, sweepTo: 40, duration: 0.6, type: 'sawtooth', volume: 0.3 });
}

export function playWaveStartSFX(): void {
  const notes = [440, 554.37, 659.25, 880];
  notes.forEach((freq, i) => {
    setTimeout(() => {
      playSynthTone({ frequency: freq, duration: 0.12, type: 'square', volume: 0.15 });
    }, i * 90);
  });
}

export function playPauseSFX(): void {
  playSynthTone({ frequency: 600, sweepTo: 300, duration: 0.08, type: 'square', volume: 0.15 });
}

export function playResumeSFX(): void {
  playSynthTone({ frequency: 300, sweepTo: 600, duration: 0.08, type: 'square', volume: 0.15 });
}

export default {
  playLaserShotSFX,
  playExplosionSFX,
  playPlayerDeathSFX,
  playWaveStartSFX,
  playPauseSFX,
  playResumeSFX,
};
`);

// Hunter Laser & Explosion
write("src/System/Sound/SFX/Category/Hunter/Laser/Blast/Classic/index.tsx", `import { playHunterLaserBlastSFX } from "../index.tsx";
export function playClassicLaserShotSFX(): void { playHunterLaserBlastSFX(); }
export default { playClassicLaserShotSFX };
`);
write("src/System/Sound/SFX/Category/Hunter/Laser/Blast/index.tsx", `import { playSynthTone } from "../../../../../Synthesizer/index.tsx";
export function playHunterLaserBlastSFX(): void {
  playSynthTone({ frequency: 880, sweepTo: 180, duration: 0.12, type: "sawtooth", volume: 0.18 });
}
export default { playHunterLaserBlastSFX };
`);
write("src/System/Sound/SFX/Category/Hunter/Laser/index.tsx", `export * from "./Blast/index.tsx"; export default { category: "Hunter Laser" };`);

write("src/System/Sound/SFX/Category/Hunter/Explosion/General/index.tsx", `export const HUNTER_EXPLOSION_CONFIG = { baseFrequency: 160, decaySpeed: 0.85, noiseVolume: 0.45, synthVolume: 0.35 }; export default HUNTER_EXPLOSION_CONFIG;`);
write("src/System/Sound/SFX/Category/Hunter/Explosion/Classic/index.tsx", `import { playHunterExplosionSFX } from "../index.tsx";
export function playClassicHunterExplosionSFX(): void { playHunterExplosionSFX(); }
export default { playClassicHunterExplosionSFX };
`);
write("src/System/Sound/SFX/Category/Hunter/Explosion/index.tsx", `import { playSynthTone, playNoiseBurst } from '../../../../Synthesizer/index.tsx';
import { HUNTER_EXPLOSION_CONFIG } from './General/index.tsx';

export * from './General/index.tsx';

export function playHunterExplosionSFX(): void {
  const amplifiedNoiseVol = HUNTER_EXPLOSION_CONFIG.noiseVolume * 1.3;
  const amplifiedSynthVol = HUNTER_EXPLOSION_CONFIG.synthVolume * 1.3;
  playNoiseBurst(amplifiedNoiseVol, HUNTER_EXPLOSION_CONFIG.decaySpeed, 600);
  playSynthTone({
    frequency: HUNTER_EXPLOSION_CONFIG.baseFrequency,
    sweepTo: 25,
    duration: HUNTER_EXPLOSION_CONFIG.decaySpeed,
    type: 'sawtooth',
    volume: amplifiedSynthVol,
  });
  playSynthTone({
    frequency: HUNTER_EXPLOSION_CONFIG.baseFrequency * 4,
    sweepTo: 100,
    duration: 0.15,
    type: 'triangle',
    volume: amplifiedSynthVol * 0.4,
  });
}

export default { playHunterExplosionSFX };
`);
write("src/System/Sound/SFX/Category/Hunter/index.tsx", `export * from './Laser/index.tsx'; export * from './Explosion/index.tsx'; export default { category: 'Hunter SFX' };`);

// Feral Pig Sub-modules
write("src/System/Sound/SFX/Category/Feral_Pig/General/index.tsx", `export default { category: 'Feral_Pig' };`);
write("src/System/Sound/SFX/Category/Feral_Pig/General/Classic/index.tsx", `export default {};`);

write("src/System/Sound/SFX/Category/Feral_Pig/Squeal/General/index.tsx", `export const SquealGeneral = { freqStart: 720, freqEnd: 1100 }; export default SquealGeneral;`);
write("src/System/Sound/SFX/Category/Feral_Pig/Squeal/Classic/index.tsx", `import { playSquealSFX } from '../index.tsx'; export function playClassicSquealSFX(mod: number = 1.0) { playSquealSFX(mod); } export default { playClassicSquealSFX };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Squeal/index.tsx", `import { playSynthTone } from '../../../../Synthesizer/index.tsx';
import { SquealGeneral } from './General/index.tsx';
export * from './General/index.tsx';
export function playSquealSFX(pitchMod: number = 1.0): void {
  playSynthTone({ frequency: SquealGeneral.freqStart * pitchMod, sweepTo: SquealGeneral.freqEnd * pitchMod, duration: 0.18, type: 'sawtooth', volume: 0.16, lfoFreq: 18, lfoDepth: 40 });
}
export default { playSquealSFX };
`);

write("src/System/Sound/SFX/Category/Feral_Pig/Snort/General/index.tsx", `export const SnortGeneral = { filterCutoff: 450 }; export default SnortGeneral;`);
write("src/System/Sound/SFX/Category/Feral_Pig/Snort/Classic/index.tsx", `import { playSnortSFX } from '../index.tsx'; export function playClassicSnortSFX(mod: number = 1.0) { playSnortSFX(mod); } export default { playClassicSnortSFX };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Snort/index.tsx", `import { playNoiseBurst, playSynthTone } from '../../../../Synthesizer/index.tsx';
import { SnortGeneral } from './General/index.tsx';
export * from './General/index.tsx';
export function playSnortSFX(pitchMod: number = 1.0): void {
  playNoiseBurst(0.12, 0.15, SnortGeneral.filterCutoff * pitchMod);
  playSynthTone({ frequency: 140 * pitchMod, sweepTo: 70 * pitchMod, duration: 0.12, type: 'triangle', volume: 0.12 });
}
export default { playSnortSFX };
`);

write("src/System/Sound/SFX/Category/Feral_Pig/Charge/General/index.tsx", `export default { type: 'Charge' };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Charge/Classic/index.tsx", `import { playChargeSFX } from '../index.tsx'; export function playClassicChargeSFX(mod: number = 1.0) { playChargeSFX(mod); } export default { playClassicChargeSFX };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Charge/index.tsx", `import { playSynthTone, playNoiseBurst } from '../../../../Synthesizer/index.tsx';
export function playChargeSFX(pitchMod: number = 1.0): void {
  playSynthTone({ frequency: 380 * pitchMod, sweepTo: 650 * pitchMod, duration: 0.28, type: 'sawtooth', volume: 0.16 });
  playNoiseBurst(0.2, 0.08, 600);
}
export default { playChargeSFX };
`);

write("src/System/Sound/SFX/Category/Feral_Pig/Explosion/General/index.tsx", `export default { type: 'Pig_Explosion' };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Explosion/Classic/index.tsx", `import { playPigExplosionSFX } from '../index.tsx'; export function playClassicPigExplosionSFX(isLarge: boolean = false) { playPigExplosionSFX(isLarge); } export default { playClassicPigExplosionSFX };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Explosion/index.tsx", `import { playNoiseBurst, playSynthTone } from '../../../../Synthesizer/index.tsx';
export function playPigExplosionSFX(isLarge: boolean = false): void {
  playNoiseBurst(isLarge ? 0.45 : 0.28, isLarge ? 0.3 : 0.2, isLarge ? 900 : 1300);
  playSynthTone({ frequency: isLarge ? 220 : 340, sweepTo: 45, duration: isLarge ? 0.35 : 0.22, type: 'square', volume: isLarge ? 0.25 : 0.18 });
}
export default { playPigExplosionSFX };
`);

write("src/System/Sound/SFX/Category/Feral_Pig/Groan/General/index.tsx", `export default { type: 'Low_Vocalization' };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Groan/Classic/index.tsx", `import { playGroanSFX } from '../index.tsx'; export function playClassicGroanSFX() { playGroanSFX(); } export default { playClassicGroanSFX };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Groan/index.tsx", `import { playSynthTone, playNoiseBurst } from '../../../../Synthesizer/index.tsx';
export function playGroanSFX(): void { playSynthTone({ frequency: 180, sweepTo: 90, duration: 0.25, type: 'sawtooth', volume: 0.12 }); }
export function playOinkSFX(): void { playSynthTone({ frequency: 420, sweepTo: 280, duration: 0.08, type: 'sine', volume: 0.14 }); }
export function playHissSFX(): void { playNoiseBurst(0.18, 0.1, 2400); }
export function playTeethClickSFX(): void { playSynthTone({ frequency: 1800, sweepTo: 400, duration: 0.02, type: 'square', volume: 0.12 }); }
export function playStompSFX(): void { playSynthTone({ frequency: 110, sweepTo: 30, duration: 0.14, type: 'triangle', volume: 0.22 }); playNoiseBurst(0.1, 0.15, 300); }
export default { playGroanSFX, playOinkSFX, playHissSFX, playTeethClickSFX, playStompSFX };
`);

write("src/System/Sound/SFX/Category/Feral_Pig/Oink/index.tsx", `import { playOinkSFX } from '../Groan/index.tsx'; export { playOinkSFX }; export default { playOinkSFX };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Hiss/index.tsx", `import { playHissSFX } from '../Groan/index.tsx'; export { playHissSFX }; export default { playHissSFX };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Teeth_Click/index.tsx", `import { playTeethClickSFX } from '../Groan/index.tsx'; export { playTeethClickSFX }; export default { playTeethClickSFX };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Stomp/index.tsx", `import { playStompSFX } from '../Groan/index.tsx'; export { playStompSFX }; export default { playStompSFX };`);

write("src/System/Sound/SFX/Category/Feral_Pig/Hoof_Clicks/index.tsx", `import { playSynthTone } from '../../../../Synthesizer/index.tsx';
export function playHoofClicksSFX(): void {
  playSynthTone({ frequency: 1200, sweepTo: 200, duration: 0.03, type: 'triangle', volume: 0.1 });
  setTimeout(() => {
    playSynthTone({ frequency: 1100, sweepTo: 180, duration: 0.03, type: 'triangle', volume: 0.08 });
  }, 45);
}
export default { playHoofClicksSFX };
`);

write("src/System/Sound/SFX/Category/Feral_Pig/Gallop/index.tsx", `import { playSynthTone } from '../../../../Synthesizer/index.tsx';
export function playGallopSFX(): void {
  playSynthTone({ frequency: 280, sweepTo: 90, duration: 0.05, type: 'triangle', volume: 0.12 });
  setTimeout(() => playSynthTone({ frequency: 260, sweepTo: 80, duration: 0.05, type: 'triangle', volume: 0.1 }), 60);
  setTimeout(() => playSynthTone({ frequency: 300, sweepTo: 100, duration: 0.06, type: 'triangle', volume: 0.14 }), 120);
}
export function playTrotSFX(): void {
  playSynthTone({ frequency: 240, sweepTo: 110, duration: 0.04, type: 'triangle', volume: 0.09 });
  setTimeout(() => playSynthTone({ frequency: 220, sweepTo: 100, duration: 0.04, type: 'triangle', volume: 0.09 }), 100);
}
export function playCanterSFX(): void {
  playSynthTone({ frequency: 260, sweepTo: 100, duration: 0.05, type: 'triangle', volume: 0.1 });
  setTimeout(() => playSynthTone({ frequency: 250, sweepTo: 95, duration: 0.05, type: 'triangle', volume: 0.1 }), 80);
}
export function playWalkSFX(): void {
  playSynthTone({ frequency: 200, sweepTo: 90, duration: 0.04, type: 'triangle', volume: 0.07 });
}
export default { playGallopSFX, playTrotSFX, playCanterSFX, playWalkSFX };
`);

write("src/System/Sound/SFX/Category/Feral_Pig/Trot/index.tsx", `import { playTrotSFX } from '../Gallop/index.tsx'; export { playTrotSFX }; export default { playTrotSFX };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Canter/index.tsx", `import { playCanterSFX } from '../Gallop/index.tsx'; export { playCanterSFX }; export default { playCanterSFX };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Walk/index.tsx", `import { playWalkSFX } from '../Gallop/index.tsx'; export { playWalkSFX }; export default { playWalkSFX };`);

write("src/System/Sound/SFX/Category/Feral_Pig/Ground_Scrape/index.tsx", `import { playNoiseBurst, playSynthTone } from '../../../../Synthesizer/index.tsx';
export function playTuskScrapeSFX(): void {
  playNoiseBurst(0.22, 0.18, 1400);
  playSynthTone({ frequency: 450, sweepTo: 180, duration: 0.2, type: 'sawtooth', volume: 0.1 });
}
export function playHoofScrapeSFX(): void {
  playNoiseBurst(0.16, 0.15, 800);
  playSynthTone({ frequency: 220, sweepTo: 90, duration: 0.15, type: 'triangle', volume: 0.12 });
}
export default { playTuskScrapeSFX, playHoofScrapeSFX };
`);

write("src/System/Sound/SFX/Category/Feral_Pig/Ground_Scrape/Hoof_Method/index.tsx", `import { playHoofScrapeSFX } from '../index.tsx'; export { playHoofScrapeSFX }; export default { playHoofScrapeSFX };`);
write("src/System/Sound/SFX/Category/Feral_Pig/Ground_Scrape/Tusk_Method/index.tsx", `import { playTuskScrapeSFX } from '../index.tsx'; export { playTuskScrapeSFX }; export default { playTuskScrapeSFX };`);

write("src/System/Sound/SFX/Category/Feral_Pig/index.tsx", `export * from './General/index.tsx';
export * from './Squeal/index.tsx';
export * from './Snort/index.tsx';
export * from './Hoof_Clicks/index.tsx';
export * from './Charge/index.tsx';
export * from './Explosion/index.tsx';
export * from './Groan/index.tsx';
export * from './Ground_Scrape/index.tsx';
export * from './Gallop/index.tsx';
export default { category: 'Feral Pig SFX Suite' };
`);

write("src/System/Sound/SFX/Category/index.tsx", `export * from './Hunter/index.tsx'; export * from './Feral_Pig/index.tsx'; export default {};`);
write("src/System/Sound/SFX/index.tsx", `export * from './General/index.tsx'; export * from './Synthesizer/index.tsx'; export * from './Category/index.tsx'; export default { module: 'SFX Aggregator' };`);

write("src/System/Sound/index.tsx", `export * from './General/index.tsx';
export * from './Synthesizer/index.tsx';
export * from './Synthesizer/Polyphonic/index.tsx';
export * from './BGM/index.tsx';
export * from './BGM/Synthesizer/Polyphonic/index.tsx';
export * from './SFX/index.tsx';
export * from './SFX/Synthesizer/Polyphonic/index.tsx';
export * from './SFX/Category/Feral_Pig/index.tsx';
export * from './SFX/Category/Hunter/Explosion/index.tsx';
export * from './HD/index.tsx';
export * from './Stereo/index.tsx';
export * from './Master_Volume_Control/index.tsx';
export * from './Engine/index.tsx';
export default { subsystem: 'Sound Engine' };
`);

console.log('[Part 2] Complete!');
