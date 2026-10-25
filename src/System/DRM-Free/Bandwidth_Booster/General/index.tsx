/**
 * System/DRM-Free/Bandwidth_Booster/General Module
 * Implements high-speed frame compressors, predictive visual updates, and custom packet consolidation.
 * Reduces raw digital transmission overhead down to minimum thresholds, fitting legacy copper or slow serial ports.
 */

export interface CompressionMetrics {
  originalBytes: number;
  compressedBytes: number;
  savingFactor: number; // e.g. 2.4 meaning 2.4x smaller
}

/**
 * Executes a fast, lossy, or lossless run-length encoding (RLE) scan on raw video lines.
 */
export function compressFrameBufferRLE(rawBuffer: number[]): number[] {
  if (rawBuffer.length === 0) return [];
  
  const compressed: number[] = [];
  let currentVal = rawBuffer[0];
  let runCount = 1;
  
  for (let i = 1; i < rawBuffer.length; i++) {
    if (rawBuffer[i] === currentVal && runCount < 255) {
      runCount++;
    } else {
      compressed.push(runCount, currentVal);
      currentVal = rawBuffer[i];
      runCount = 1;
    }
  }
  compressed.push(runCount, currentVal);
  return compressed;
}

/**
 * Calculates dynamic compression ratios.
 */
export function calculateCompressionRatio(original: number, compressed: number): CompressionMetrics {
  return {
    originalBytes: original,
    compressedBytes: compressed,
    savingFactor: compressed > 0 ? Number((original / compressed).toFixed(2)) : 1.0,
  };
}

export default {
  compressFrameBufferRLE,
  calculateCompressionRatio,
};
