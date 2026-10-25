import { playSynthTone, playNoiseBurst } from '../../../../Synthesizer/index.tsx';
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
