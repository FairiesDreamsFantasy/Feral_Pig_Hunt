import { playSynthTone } from '../../../../Synthesizer/index.tsx';
export function playHoofClicksSFX(): void {
  playSynthTone({ frequency: 1200, sweepTo: 200, duration: 0.03, type: 'triangle', volume: 0.1 });
  setTimeout(() => {
    playSynthTone({ frequency: 1100, sweepTo: 180, duration: 0.03, type: 'triangle', volume: 0.08 });
  }, 45);
}
export default { playHoofClicksSFX };
