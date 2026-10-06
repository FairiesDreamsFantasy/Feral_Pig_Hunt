/**
 * System/Registry/Visuals/Engine Module
 * Binds mathematical projections, Newtonian physics states, and rendering buffers to the global game cycle.
 */

import { Mathematics, Science } from '../../../Visuals/Engine/index.tsx';

export interface RenderEngineState {
  fpsTracker: ReturnType<typeof Science.Renderer.createFrameStatsTracker>;
  dragCoefficient: number;
  thermalStateCelsius: number;
  selectedGeometryStyle: 'EUCLIDEAN' | 'NON_EUCLIDEAN';
}

/**
 * Initializes visual engine registry state configurations.
 */
export function initializeVisualEngineRegistry(): RenderEngineState {
  return {
    fpsTracker: Science.Renderer.createFrameStatsTracker(),
    dragCoefficient: 0.47,
    thermalStateCelsius: 20.0,
    selectedGeometryStyle: 'EUCLIDEAN'
  };
}

/**
 * Evaluates Newtonian drag vectors and thermal friction temperatures for dynamic projectile swoops.
 */
export function processPhysicsTick(
  speed: number,
  mass: number,
  lastTempCelsius: number,
  dt: number = 0.016
): { dragForce: number; temperatureCelsius: number } {
  const dragForce = Science.Physics.calculateFluidDrag(speed, 1.225, 0.47, 0.5);
  const temperatureCelsius = Science.Physics.updateAtmosphericHeat(
    lastTempCelsius,
    speed,
    mass,
    0.47,
    20.0,
    dt
  );

  return { dragForce, temperatureCelsius };
}

export default {
  Mathematics,
  Science,
  initializeVisualEngineRegistry,
  processPhysicsTick,
};
