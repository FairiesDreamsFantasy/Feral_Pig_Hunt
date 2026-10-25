/**
 * System/Visuals/Engine/Mathematics Module
 * Aggregated exporting of all core mathematical systems (Euclidean, Non-Euclidean, Projective, Differential).
 */

import EuclideanModule from './Geometry/Euclidean/index.tsx';
import NonEuclideanModule from './Geometry/Non_Euclidean/index.tsx';
import ProjectiveModule from './Geometry/Projective/index.tsx';
import DifferentialModule from './Geometry/Differential/index.tsx';

export const Euclidean = EuclideanModule;
export const Non_Euclidean = NonEuclideanModule;
export const Projective = ProjectiveModule;
export const Differential = DifferentialModule;

export default {
  Euclidean,
  Non_Euclidean,
  Projective,
  Differential,
};
