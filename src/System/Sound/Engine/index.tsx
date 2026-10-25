/**
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

    osc.onended = () => {
      try {
        osc.disconnect();
        splitter.disconnect();
        gainLeft.disconnect();
        gainRight.disconnect();
        merger.disconnect();
      } catch {
        // Safe disconnection
      }
    };
  } catch (err) {
    console.debug('Failed to dispatch Doppler tone:', err);
  }
}

export default {
  calculateDopplerAndAttenuation,
  playSpatialDopplerTone,
};
