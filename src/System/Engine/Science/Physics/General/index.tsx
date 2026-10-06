/**
 * src/System/Engine/Science/Physics/General/index.tsx
 * Scientific kinematics, AABB collisions, sub-relativistic Lorentz scale contractions, and boundary math.
 */

import { BoundingBox, Vector2D } from '../../../../General/index.tsx';

/**
 * Standard Axis-Aligned Bounding Box (AABB) collision verification.
 */
export function verifyAABBCollision(box1: BoundingBox, box2: BoundingBox): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  );
}

/**
 * Computes the relativistic Lorentz contraction factor for ultra-fast objects.
 * gamma = 1 / sqrt(1 - v^2/c^2)
 */
export function calculateLorentzContraction(velocity: number, speedOfLight: number = 299792458): number {
  if (Math.abs(velocity) >= speedOfLight) return 0.001; // Avoid divide-by-zero or imaginary boundaries
  const ratio = (velocity * velocity) / (speedOfLight * speedOfLight);
  return Math.sqrt(1 - ratio);
}

/**
 * Applies elastic edge bounding constraint with damping coefficient.
 */
export function constrainToBoundary(
  pos: Vector2D,
  vel: Vector2D,
  minX: number,
  maxX: number,
  damping: number = 0.9
): void {
  if (pos.x < minX) {
    pos.x = minX;
    vel.x = -vel.x * damping;
  } else if (pos.x > maxX) {
    pos.x = maxX;
    vel.x = -vel.x * damping;
  }
}
