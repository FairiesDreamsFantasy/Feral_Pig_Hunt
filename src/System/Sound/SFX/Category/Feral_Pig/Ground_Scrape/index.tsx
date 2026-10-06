import { playNoiseBurst, playSynthTone } from '../../../../Synthesizer/index.tsx';
export function playTuskScrapeSFX(): void {
  playNoiseBurst(0.22, 0.18, 1400);
  playSynthTone({ frequency: 450, sweepTo: 180, duration: 0.2, type: 'sawtooth', volume: 0.1 });
}
export function playHoofScrapeSFX(): void {
  playNoiseBurst(0.16, 0.15, 800);
  playSynthTone({ frequency: 220, sweepTo: 90, duration: 0.15, type: 'triangle', volume: 0.12 });
}
export default { playTuskScrapeSFX, playHoofScrapeSFX };
