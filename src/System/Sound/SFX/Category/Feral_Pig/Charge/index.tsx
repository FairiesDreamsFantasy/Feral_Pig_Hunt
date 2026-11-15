import { playSynthTone, playNoiseBurst } from '../../../../Synthesizer/index.tsx';
import { getSoundMode } from '../../../../General/index.tsx';
import { playHDSqueal, playHDSnort } from '../../../DSP/index.tsx';

export function playChargeSFX(pitchMod: number = 1.0, pan: number = 0): void {
  const mode = getSoundMode();
  if (mode === '32-Bit' || mode === '64-Bit') {
    playHDSqueal(1.1 * pitchMod, pan);
    setTimeout(() => {
      playHDSnort(0.95 * pitchMod, pan);
    }, 80);
  } else {
    playSynthTone({ frequency: 380 * pitchMod, sweepTo: 650 * pitchMod, duration: 0.28, type: 'sawtooth', volume: 0.16 });
    playNoiseBurst(0.2, 0.08, 600);
  }
}

export default { playChargeSFX };
