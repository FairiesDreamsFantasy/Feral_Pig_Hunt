/**
 * System/Visuals/Engine/Mathematics/Geometry/Projective Module
 * Homogeneous coordinates (H-Vectors), projection ray metrics, vanishing point calculations, and camera transform matrices.
 */

export interface HomogeneousVector {
  x: number;
  y: number;
  z: number;
  w: number; // Scale factor
}

export interface Point2D {
  x: number;
  y: number;
}

/**
 * Converts a 3D cartesian point to homogeneous representation.
 */
export function toHomogeneous(x: number, y: number, z: number, w: number = 1.0): HomogeneousVector {
  return { x, y, z, w };
}

/**
 * Converts a homogeneous vector back to 3D cartesian coordinates (normalized by w).
 */
export function fromHomogeneous(hVec: HomogeneousVector): { x: number; y: number; z: number } {
  const w = hVec.w === 0 ? 1e-15 : hVec.w;
  return {
    x: hVec.x / w,
    y: hVec.y / w,
    z: hVec.z / w
  };
}

/**
 * Calculates a vanishing point projection on a 2D viewport.
 */
export function calculateVanishingPoint(
  centerX: number,
  centerY: number,
  depthZ: number,
  scaleFactor: number = 200
): Point2D {
  const factor = scaleFactor / (depthZ === 0 ? 1e-15 : depthZ);
  return {
    x: centerX * factor,
    y: centerY * factor
  };
}

export default {
  toHomogeneous,
  fromHomogeneous,
  calculateVanishingPoint,
};
