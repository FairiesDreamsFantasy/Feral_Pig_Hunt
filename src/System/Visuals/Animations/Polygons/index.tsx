/**
 * System/Visuals/Animations/Polygons Module
 * Polyline wind-order paths, convex rasterization bounds, outline drawing formats, and polygon containment.
 */

import { Point2D, Matrix3x3, transformPoint } from '../2-D/index.tsx';

export interface Polygon {
  vertices: Point2D[];
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Calculates the bounding box of a polygon.
 */
export function getBoundingBox(polygon: Polygon): BoundingBox {
  if (polygon.vertices.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const v of polygon.vertices) {
    if (v.x < minX) minX = v.x;
    if (v.y < minY) minY = v.y;
    if (v.x > maxX) maxX = v.x;
    if (v.y > maxY) maxY = v.y;
  }
  return { minX, minY, maxX, maxY };
}

/**
 * Calculates the centroid of a polygon.
 */
export function getCentroid(polygon: Polygon): Point2D {
  const vertices = polygon.vertices;
  const n = vertices.length;
  if (n === 0) return { x: 0, y: 0 };
  if (n === 1) return { ...vertices[0] };
  if (n === 2) return { x: (vertices[0].x + vertices[1].x) / 2, y: (vertices[0].y + vertices[1].y) / 2 };

  let cx = 0, cy = 0, area = 0;
  for (let i = 0; i < n; i++) {
    const p1 = vertices[i];
    const p2 = vertices[(i + 1) % n];
    const factor = p1.x * p2.y - p2.x * p1.y;
    cx += (p1.x + p2.x) * factor;
    cy += (p1.y + p2.y) * factor;
    area += factor;
  }
  area = area * 0.5;
  if (Math.abs(area) < 1e-10) {
    // Fallback if collinear
    let sx = 0, sy = 0;
    for (const v of vertices) { sx += v.x; sy += v.y; }
    return { x: sx / n, y: sy / n };
  }
  return {
    x: cx / (6 * area),
    y: cy / (6 * area)
  };
}

/**
 * Determines if a point is inside a polygon using the winding number or ray casting algorithm.
 */
export function isPointInPolygon(point: Point2D, polygon: Polygon): boolean {
  const vertices = polygon.vertices;
  const n = vertices.length;
  if (n < 3) return false;

  let inside = false;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = vertices[i].x, yi = vertices[i].y;
    const xj = vertices[j].x, yj = vertices[j].y;

    const intersect = ((yi > point.y) !== (yj > point.y))
        && (point.x < (xj - xi) * (point.y - yi) / (yj - yi + 1e-15) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Applies an affine transform matrix to all vertices of a polygon.
 */
export function transformPolygon(polygon: Polygon, matrix: Matrix3x3): Polygon {
  return {
    vertices: polygon.vertices.map(v => transformPoint(v, matrix))
  };
}

/**
 * Draws a polygon onto a 2D canvas context.
 */
export function drawPolygon(ctx: CanvasRenderingContext2D, polygon: Polygon, strokeStyle?: string, fillStyle?: string, lineWidth: number = 1) {
  if (polygon.vertices.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(polygon.vertices[0].x, polygon.vertices[0].y);
  for (let i = 1; i < polygon.vertices.length; i++) {
    ctx.lineTo(polygon.vertices[i].x, polygon.vertices[i].y);
  }
  ctx.closePath();

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

export default {
  getBoundingBox,
  getCentroid,
  isPointInPolygon,
  transformPolygon,
  drawPolygon,
};
