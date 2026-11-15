import { playSynthTone, playNoiseBurst } from '../../../../Synthesizer/index.tsx';
import { getSoundMode, getAudioContext } from '../../../../General/index.tsx';
import { playHDGroan, playHDSnort } from '../../../DSP/index.tsx';
import { createPannerNode } from '../../../../DSP/index.tsx';

export function playGroanSFX(pan: number = 0): void {
  const mode = getSoundMode();
  if (mode === '32-Bit' || mode === '64-Bit') {
    playHDGroan(1.0, pan);
  } else {
    playSynthTone({ frequency: 180, sweepTo: 90, duration: 0.25, type: 'sawtooth', volume: 0.12 });
  }
}

export function playOinkSFX(pan: number = 0): void {
  const mode = getSoundMode();
  if (mode === '32-Bit' || mode === '64-Bit') {
    // Authentic pig oink is a high formant snort-grunt
    playHDSnort(1.65, pan);
  } else {
    playSynthTone({ frequency: 420, sweepTo: 280, duration: 0.08, type: 'sine', volume: 0.14 });
  }
}

export function playHissSFX(): void {
  playNoiseBurst(0.18, 0.1, 2400);
}

export function playTeethClickSFX(): void {
  playSynthTone({ frequency: 1800, sweepTo: 400, duration: 0.02, type: 'square', volume: 0.12 });
}

export function playStompSFX(pan: number = 0): void {
  const mode = getSoundMode();
  if (mode === '32-Bit' || mode === '64-Bit') {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.14);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      const panner = createPannerNode(ctx, pan);
      osc.connect(panner);
      panner.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);

      playNoiseBurst(0.1, 0.15, 300);
    } catch (_) {
      playSynthTone({ frequency: 110, sweepTo: 30, duration: 0.14, type: 'triangle', volume: 0.22 });
      playNoiseBurst(0.1, 0.15, 300);
    }
  } else {
    playSynthTone({ frequency: 110, sweepTo: 30, duration: 0.14, type: 'triangle', volume: 0.22 });
    playNoiseBurst(0.1, 0.15, 300);
  }
}

export default { playGroanSFX, playOinkSFX, playHissSFX, playTeethClickSFX, playStompSFX };
