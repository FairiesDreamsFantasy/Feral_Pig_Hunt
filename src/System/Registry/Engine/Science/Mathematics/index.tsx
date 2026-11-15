/**
 * src/System/Registry/Engine/Science/Mathematics/index.tsx
 * Mathematics Registry Node maintaining vector scales, rotation matrix weights, and coordinate bounds.
 */

import { RegistryNode } from '../../../General/index.tsx';

export interface MathModel {
  piPrecision: number;
  radianRatio: number;
  maxCoordinateLimit: number;
  rotationResolution: number;
}

export const MATH_MODEL_REGISTRY: MathModel = {
  piPrecision: 3.141592653589793,
  radianRatio: 180 / 3.141592653589793,
  maxCoordinateLimit: 100000,
  rotationResolution: 360
};

export const SCIENCE_MATHEMATICS_REGISTRY_NODE: RegistryNode = {
  path: 'Engine/Science/Mathematics/',
  description: 'Mathematical matrix projections, radian conversion constants, and precision vector scales',
  status: 'active',
  meta: {
    mathModel: MATH_MODEL_REGISTRY
  }
};

export default SCIENCE_MATHEMATICS_REGISTRY_NODE;
