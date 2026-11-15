/**
 * Sound Subsystem - Master Volume Control
 */
import { getAudioContext } from '../General/index.tsx';

let masterGainNode: GainNode | null = null;
let dynamicsCompressor: DynamicsCompressorNode | null = null;
let isMuted: boolean = false;
let globalVolume: number = 2.79864; // Amplified by an additional 15% mathematically (2.4336 * 1.15 = 2.79864)

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
  globalVolume = Math.max(0.0, Math.min(2.79864, vol));
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
