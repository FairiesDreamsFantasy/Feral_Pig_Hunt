/**
 * Equal-Power Stereo Panning & Haas Precedence Delay
 */
import { getAudioContext } from '../../General/index.tsx';

export function calculateStereoGains(canvasX: number, canvasWidth: number): { leftGain: number; rightGain: number } {
  const p = Math.max(-1.0, Math.min(1.0, (2.0 * canvasX) / canvasWidth - 1.0));
  const angle = (Math.PI / 4.0) * (p + 1.0);
  const leftGain = Math.cos(angle);
  const rightGain = Math.sin(angle);
  return { leftGain, rightGain };
}

export function applySpatialStereoAndHaas(
  sourceNode: AudioNode,
  canvasX: number,
  canvasWidth: number,
  targetDestination: AudioNode
): void {
  try {
    const ctx = getAudioContext();
    const { leftGain, rightGain } = calculateStereoGains(canvasX, canvasWidth);

    const splitter = ctx.createChannelSplitter(2);
    const merger = ctx.createChannelMerger(2);

    const gainLeft = ctx.createGain();
    const gainRight = ctx.createGain();
    gainLeft.gain.value = leftGain;
    gainRight.gain.value = rightGain;

    const delayNodeLeft = ctx.createDelay(0.1);
    const delayNodeRight = ctx.createDelay(0.1);

    const panRatio = (2.0 * canvasX) / canvasWidth - 1.0;
    const baseDelaySec = 0.018;
    delayNodeLeft.delayTime.value = panRatio > 0 ? panRatio * baseDelaySec : 0;
    delayNodeRight.delayTime.value = panRatio < 0 ? Math.abs(panRatio) * baseDelaySec : 0;

    sourceNode.connect(splitter);
    splitter.connect(gainLeft, 0);
    splitter.connect(gainRight, 0);
    gainLeft.connect(delayNodeLeft);
    gainRight.connect(delayNodeRight);
    delayNodeLeft.connect(merger, 0, 0);
    delayNodeRight.connect(merger, 0, 1);
    merger.connect(targetDestination);
  } catch (err) {
    console.debug("Failed to apply spatial Haas delay:", err);
    sourceNode.connect(targetDestination);
  }
}

export const StereoGeneralInfo = {
  description: "Acoustic spatial equations including Equal-Power Pan and Haas Precedence Integration",
  speedOfSound: 343.2,
  interauralDistance: 0.178,
};

export default StereoGeneralInfo;
