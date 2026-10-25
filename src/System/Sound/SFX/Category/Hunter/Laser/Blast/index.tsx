import { playSynthTone } from "../../../../../Synthesizer/index.tsx";
export function playHunterLaserBlastSFX(): void {
  playSynthTone({ frequency: 880, sweepTo: 180, duration: 0.12, type: "sawtooth", volume: 0.18 });
}
export default { playHunterLaserBlastSFX };
