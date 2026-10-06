/**
 * System/Visuals/Engine/Mathematics/Geometry/Euclidean Module
 * Cartesian distance formulas, vector dot products, cross products, and linear interpolation (LERP) metrics.
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Calculates standard Euclidean distance between two points.
 */
export function euclideanDistance(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the dot product of two vectors.
 */
export function dotProduct(v1: Vector2D, v2: Vector2D): number {
  return v1.x * v2.x + v1.y * v2.y;
}

/**
 * Calculates the magnitude of 2D vector cross product (v1 x v2).
 */
export function crossProductMagnitude(v1: Vector2D, v2: Vector2D): number {
  return v1.x * v2.y - v1.y * v2.x;
}

/**
 * Normalizes a 2D vector.
 */
export function normalizeVector(v: Vector2D): Vector2D {
  const mag = Math.sqrt(v.x * v.x + v.y * v.y);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

/**
 * Linearly interpolates between two 2D points.
 */
export function lerpPoints(p1: Point2D, p2: Point2D, t: number): Point2D {
  const clampedT = Math.max(0, Math.min(1, t));
  return {
    x: p1.x + (p2.x - p1.x) * clampedT,
    y: p1.y + (p2.y - p1.y) * clampedT,
  };
}

export default {
  euclideanDistance,
  dotProduct,
  crossProductMagnitude,
  normalizeVector,
  lerpPoints,
};
