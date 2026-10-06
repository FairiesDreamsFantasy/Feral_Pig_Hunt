/**
 * System/Visuals/Engine/Mathematics/Geometry/Differential Module
 * Arc-length parameterizations, tangent vectors, bending normal vectors, and trajectory curvature (kappa).
 */

export interface Point2D {
  x: number;
  y: number;
}

/**
 * Calculates the Unit Tangent Vector of a path curve given its velocity components (first derivative).
 */
export function calculateTangent(dx: number, dy: number): { tx: number; ty: number } {
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { tx: 0, ty: 0 };
  return { tx: dx / len, ty: dy / len };
}

/**
 * Calculates the Curvature (kappa) along a parametric 2D path.
 * Formula: kappa = |x'\u2022y'' - y'\u2022x''| / (x'^2 + y'^2)^1.5
 */
export function calculateCurvature(
  dx: number,  // x' (First derivative)
  dy: number,  // y'
  ddx: number, // x'' (Second derivative)
  ddy: number  // y''
): number {
  const numerator = Math.abs(dx * ddy - dy * ddx);
  const denominator = Math.pow(dx * dx + dy * dy, 1.5);
  if (denominator === 0) return 0;
  return numerator / denominator;
}

/**
 * Estimates arc length of a parametric bezier path using numerical integration (Riemann Sum).
 */
export function estimateBezierArcLength(
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  steps: number = 20
): number {
  let length = 0;
  let lastX = p0.x;
  let lastY = p0.y;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    
    // Cubic bezier coordinate evaluation
    const currX = mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x;
    const currY = mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y;

    const dx = currX - lastX;
    const dy = currY - lastY;
    length += Math.sqrt(dx * dx + dy * dy);

    lastX = currX;
    lastY = currY;
  }

  return length;
}

export default {
  calculateTangent,
  calculateCurvature,
  estimateBezierArcLength,
};
