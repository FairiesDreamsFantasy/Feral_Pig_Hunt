import { playSynthTone } from '../../../../Synthesizer/index.tsx';
import { getSoundMode } from '../../../../General/index.tsx';
import { playHDSqueal } from '../../../DSP/index.tsx';
import { SquealGeneral } from './General/index.tsx';

export * from './General/index.tsx';

export function playSquealSFX(pitchMod: number = 1.0, pan: number = 0): void {
  const mode = getSoundMode();
  if (mode === '32-Bit' || mode === '64-Bit') {
    playHDSqueal(pitchMod, pan);
  } else {
    // 8-Bit and 16-Bit: 100% preserve original classic synthesizer sound
    playSynthTone({ 
      frequency: SquealGeneral.freqStart * pitchMod, 
      sweepTo: SquealGeneral.freqEnd * pitchMod, 
      duration: 0.18, 
      type: 'sawtooth', 
      volume: 0.16, 
      lfoFreq: 18, 
      lfoDepth: 40 
    });
  }
}

export default { playSquealSFX };
