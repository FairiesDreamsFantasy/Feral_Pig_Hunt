/**
 * System/Registry/Visuals/Animations Module
 * Handles visual style registrations, style configuration states, and coordinate mappings.
 */

import { ThreeD, TwoD, Polygons, Pixelations, Geometry, Color_Palette } from '../../../Visuals/Animations/index.tsx';

export interface VisualStyleConfig {
  id: string;
  name: string;
  dotMatrixActive: boolean;
  polygonRendering: boolean;
  use3DProjections: boolean;
  monochromeProfile?: string; // e.g. P1_GREEN
}

export const REGISTERED_STYLES: Record<string, VisualStyleConfig> = {
  STANDARD: {
    id: 'STANDARD',
    name: 'Standard Pixel-Art Fixed Shooter',
    dotMatrixActive: false,
    polygonRendering: false,
    use3DProjections: false
  },
  VECTOR_POLYGONS: {
    id: 'VECTOR_POLYGONS',
    name: 'Geometric Vector Polygons Style',
    dotMatrixActive: false,
    polygonRendering: true,
    use3DProjections: false
  },
  CRT_DOT_MATRIX: {
    id: 'CRT_DOT_MATRIX',
    name: 'Nostalgic CRT Dot Matrix Screen',
    dotMatrixActive: true,
    polygonRendering: false,
    use3DProjections: false,
    monochromeProfile: 'P1_GREEN'
  },
  RETRO_3D: {
    id: 'RETRO_3D',
    name: 'Advanced Vector 3D Wireframe',
    dotMatrixActive: false,
    polygonRendering: true,
    use3DProjections: true
  }
};

/**
 * Resolves drawing styles and animation metrics dynamically.
 */
export function getActiveStyle(styleId: string): VisualStyleConfig {
  return REGISTERED_STYLES[styleId] || REGISTERED_STYLES.STANDARD;
}

export default {
  ThreeD,
  TwoD,
  Polygons,
  Pixelations,
  Geometry,
  Color_Palette,
  REGISTERED_STYLES,
  getActiveStyle,
};
