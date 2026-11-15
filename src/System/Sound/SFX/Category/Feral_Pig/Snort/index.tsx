import { playNoiseBurst, playSynthTone } from '../../../../Synthesizer/index.tsx';
import { getSoundMode } from '../../../../General/index.tsx';
import { playHDSnort } from '../../../DSP/index.tsx';
import { SnortGeneral } from './General/index.tsx';

export * from './General/index.tsx';

export function playSnortSFX(pitchMod: number = 1.0, pan: number = 0): void {
  const mode = getSoundMode();
  if (mode === '32-Bit' || mode === '64-Bit') {
    playHDSnort(pitchMod, pan);
  } else {
    // 8-Bit and 16-Bit: 100% preserve original classic synthesizer sound
    playNoiseBurst(0.12, 0.15, SnortGeneral.filterCutoff * pitchMod);
    playSynthTone({ frequency: 140 * pitchMod, sweepTo: 70 * pitchMod, duration: 0.12, type: 'triangle', volume: 0.12 });
  }
}

export default { playSnortSFX };
