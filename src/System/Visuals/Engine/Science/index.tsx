/**
 * System/Visuals/Engine/Science Module
 * Standard aggregated exporting of the scientific rendering and Newtonian physical simulation engines.
 */

import RendererModule from './Renderer/index.tsx';
import PhysicsModule from './Physics/index.tsx';

export const Renderer = RendererModule;
export const Physics = PhysicsModule;

export default {
  Renderer,
  Physics,
};
