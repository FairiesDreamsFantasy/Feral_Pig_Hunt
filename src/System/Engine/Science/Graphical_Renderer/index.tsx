/**
 * src/System/Engine/Science/Graphical_Renderer/index.tsx
 * Science Graphical Renderer Subsystem. Decouples vector stars and CRT filters.
 */

export * from './General/index.tsx';
import * as GraphGeneral from './General/index.tsx';

export const ScienceGraphicalSubsystem = {
  ...GraphGeneral,
  subsystemId: 'science_graphical_v1',
  renderingContext: 'Canvas2D / Procedural CRT Core'
};

export default ScienceGraphicalSubsystem;
