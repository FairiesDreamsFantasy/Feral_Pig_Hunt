import { playSynthTone } from '../../../../Synthesizer/index.tsx';
export function playGallopSFX(): void {
  playSynthTone({ frequency: 280, sweepTo: 90, duration: 0.05, type: 'triangle', volume: 0.12 });
  setTimeout(() => playSynthTone({ frequency: 260, sweepTo: 80, duration: 0.05, type: 'triangle', volume: 0.1 }), 60);
  setTimeout(() => playSynthTone({ frequency: 300, sweepTo: 100, duration: 0.06, type: 'triangle', volume: 0.14 }), 120);
}
export function playTrotSFX(): void {
  playSynthTone({ frequency: 240, sweepTo: 110, duration: 0.04, type: 'triangle', volume: 0.09 });
  setTimeout(() => playSynthTone({ frequency: 220, sweepTo: 100, duration: 0.04, type: 'triangle', volume: 0.09 }), 100);
}
export function playCanterSFX(): void {
  playSynthTone({ frequency: 260, sweepTo: 100, duration: 0.05, type: 'triangle', volume: 0.1 });
  setTimeout(() => playSynthTone({ frequency: 250, sweepTo: 95, duration: 0.05, type: 'triangle', volume: 0.1 }), 80);
}
export function playWalkSFX(): void {
  playSynthTone({ frequency: 200, sweepTo: 90, duration: 0.04, type: 'triangle', volume: 0.07 });
}
export default { playGallopSFX, playTrotSFX, playCanterSFX, playWalkSFX };
