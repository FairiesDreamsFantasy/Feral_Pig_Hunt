export interface SynthToneParams {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  sweepTo?: number;
  lfoFreq?: number;
  lfoDepth?: number;
  isBGM?: boolean;
}
export const SynthesizerInfo = { name: 'Arcade Wave Synthesizer' };
export default SynthesizerInfo;
