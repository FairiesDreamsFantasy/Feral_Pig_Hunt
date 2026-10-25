/**
 * System/Visuals/Engine/Science/Renderer Module
 * Double-buffered visual rendering, frame buffer metrics, redraw interval syncs, and latency trackers.
 */

export interface FrameStats {
  frameCount: number;
  lastFrameTime: number;
  fps: number;
  avgFrameDelta: number;
  renderLatencyMs: number;
}

/**
 * Initializes a structured frame-rate and latency statistics tracker.
 */
export function createFrameStatsTracker(): FrameStats {
  return {
    frameCount: 0,
    lastFrameTime: performance.now(),
    fps: 60,
    avgFrameDelta: 16.67,
    renderLatencyMs: 2
  };
}

/**
 * Updates rendering statistics at the start of each frame tick.
 * Smooths FPS readings using an exponential moving average (EMA).
 */
export function tickFrameStats(stats: FrameStats, now: number): FrameStats {
  const delta = now - stats.lastFrameTime;
  stats.frameCount++;
  stats.lastFrameTime = now;

  if (delta > 0) {
    const instantFPS = 1000 / delta;
    // EMA smoothing constant (alpha = 0.05)
    stats.fps = stats.fps * 0.95 + instantFPS * 0.05;
    stats.avgFrameDelta = stats.avgFrameDelta * 0.95 + delta * 0.05;
  }

  return stats;
}

/**
 * Double-buffering offscreen canvas visual sync.
 */
export function drawBufferToScreen(
  offscreenCanvas: HTMLCanvasElement,
  screenCtx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  screenCtx.clearRect(0, 0, width, height);
  screenCtx.drawImage(offscreenCanvas, 0, 0, width, height);
}

export default {
  createFrameStatsTracker,
  tickFrameStats,
  drawBufferToScreen,
};
