/**
 * System/Visuals/Animations/Geometry Module
 * Trigonometric spirals, Archimedean and logarithmic orbit formulas, radial vertex meshes, and geometric constellations.
 */

import { Point2D } from '../2-D/index.tsx';

/**
 * Generates vertices for an Archimedean spiral: r = a + b * theta.
 */
export function generateArchimedeanSpiral(
  center: Point2D,
  a: number,
  b: number,
  turns: number,
  stepCount: number = 100
): Point2D[] {
  const points: Point2D[] = [];
  const maxTheta = turns * 2 * Math.PI;

  for (let i = 0; i <= stepCount; i++) {
    const theta = (i / stepCount) * maxTheta;
    const r = a + b * theta;
    points.push({
      x: center.x + r * Math.cos(theta),
      y: center.y + r * Math.sin(theta)
    });
  }

  return points;
}

/**
 * Generates vertices for a Logarithmic spiral: r = a * e^(b * theta).
 */
export function generateLogarithmicSpiral(
  center: Point2D,
  a: number,
  b: number,
  turns: number,
  stepCount: number = 100
): Point2D[] {
  const points: Point2D[] = [];
  const maxTheta = turns * 2 * Math.PI;

  for (let i = 0; i <= stepCount; i++) {
    const theta = (i / stepCount) * maxTheta;
    const r = a * Math.exp(b * theta);
    points.push({
      x: center.x + r * Math.cos(theta),
      y: center.y + r * Math.sin(theta)
    });
  }

  return points;
}

/**
 * Generates vertices for a symmetric star polygon (schläfli symbol {p/q}).
 */
export function generateStarPolygon(
  center: Point2D,
  radius: number,
  p: number, // Number of points
  q: number  // Density parameter
): Point2D[] {
  const points: Point2D[] = [];
  const step = (q * 2 * Math.PI) / p;

  for (let i = 0; i < p; i++) {
    const theta = i * step - Math.PI / 2;
    points.push({
      x: center.x + radius * Math.cos(theta),
      y: center.y + radius * Math.sin(theta)
    });
  }

  return points;
}

/**
 * Generates a radial grid / mesh coordinates for drawing vector stars or circular shields.
 */
export function generateRadialMesh(
  center: Point2D,
  radius: number,
  spokeCount: number = 8,
  ringCount: number = 3
): { spokes: Point2D[][]; rings: Point2D[][] } {
  const spokes: Point2D[][] = [];
  const rings: Point2D[][] = [];

  // Generate Radial Spokes
  for (let s = 0; s < spokeCount; s++) {
    const theta = (s * 2 * Math.PI) / spokeCount;
    spokes.push([
      { ...center },
      {
        x: center.x + radius * Math.cos(theta),
        y: center.y + radius * Math.sin(theta)
      }
    ]);
  }

  // Generate Concentric Rings
  for (let r = 1; r <= ringCount; r++) {
    const ringRadius = (r / ringCount) * radius;
    const ringPoints: Point2D[] = [];
    const resolution = spokeCount * 2;
    for (let p = 0; p <= resolution; p++) {
      const theta = (p * 2 * Math.PI) / resolution;
      ringPoints.push({
        x: center.x + ringRadius * Math.cos(theta),
        y: center.y + ringRadius * Math.sin(theta)
      });
    }
    rings.push(ringPoints);
  }

  return { spokes, rings };
}

export default {
  generateArchimedeanSpiral,
  generateLogarithmicSpiral,
  generateStarPolygon,
  generateRadialMesh,
};
