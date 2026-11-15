import { playNoiseBurst, playSynthTone } from '../../../../Synthesizer/index.tsx';
import { getSoundMode, getAudioContext } from '../../../../General/index.tsx';
import { createPannerNode } from '../../../../DSP/index.tsx';

export function playPigExplosionSFX(isLarge: boolean = false, pan: number = 0): void {
  const mode = getSoundMode();
  if (mode === '32-Bit' || mode === '64-Bit') {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(isLarge ? 220 : 340, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + (isLarge ? 0.35 : 0.22));

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(isLarge ? 0.25 : 0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (isLarge ? 0.35 : 0.22));

      const panner = createPannerNode(ctx, pan);
      osc.connect(panner);
      panner.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + (isLarge ? 0.35 : 0.22));

      playNoiseBurst(isLarge ? 0.45 : 0.28, isLarge ? 0.3 : 0.2, isLarge ? 900 : 1300);
    } catch (_) {
      playNoiseBurst(isLarge ? 0.45 : 0.28, isLarge ? 0.3 : 0.2, isLarge ? 900 : 1300);
      playSynthTone({ frequency: isLarge ? 220 : 340, sweepTo: 45, duration: isLarge ? 0.35 : 0.22, type: 'square', volume: isLarge ? 0.25 : 0.18 });
    }
  } else {
    // 8-Bit and 16-Bit pure legacy
    playNoiseBurst(isLarge ? 0.45 : 0.28, isLarge ? 0.3 : 0.2, isLarge ? 900 : 1300);
    playSynthTone({ frequency: isLarge ? 220 : 340, sweepTo: 45, duration: isLarge ? 0.35 : 0.22, type: 'square', volume: isLarge ? 0.25 : 0.18 });
  }
}

export default { playPigExplosionSFX };
