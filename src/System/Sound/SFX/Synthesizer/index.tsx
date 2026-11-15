import { playSynthTone, playNoiseBurst } from '../../Synthesizer/index.tsx';
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
