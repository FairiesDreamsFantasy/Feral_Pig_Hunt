/**
 * System/Registry/Visuals Module
 * Aggregated registry bindings of animations, screen resolution modes, and engine matrices.
 */

import AnimationsRegistryModule from './Animations/index.tsx';
import ResolutionRegistryModule from './Resolution/index.tsx';
import EngineRegistryModule from './Engine/index.tsx';

export const Animations = AnimationsRegistryModule;
export const Resolution = ResolutionRegistryModule;
export const Engine = EngineRegistryModule;

export default {
  Animations,
  Resolution,
  Engine,
};
