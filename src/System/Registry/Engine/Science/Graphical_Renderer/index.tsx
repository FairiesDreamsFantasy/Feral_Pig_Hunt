/**
 * src/System/Registry/Engine/Science/Graphical_Renderer/index.tsx
 * Graphical Renderer Registry Node holding display configurations, bloom settings, and CRT models.
 */

import { RegistryNode } from '../../../General/index.tsx';
import { ScienceGraphicalSubsystem } from '../../../../Engine/Science/Graphical_Renderer/index.tsx';

export const SCIENCE_GRAPHICAL_REGISTRY_NODE: RegistryNode = {
  path: 'Engine/Science/Graphical_Renderer/',
  description: 'CRT bloom settings, chromatic aberrations, and scanline rendering parameter maps',
  status: 'active',
  meta: {
    graphicalSubsystem: ScienceGraphicalSubsystem
  }
};

export default SCIENCE_GRAPHICAL_REGISTRY_NODE;
