/**
 * System/Visuals/Animations/2-D Module
 * 2D Affine transformations, composite matrix calculations, translation, scaling, shearing, and rotation vectors.
 */

export interface Point2D {
  x: number;
  y: number;
}

// Representing a 3x3 translation/rotation matrix for affine transformations
// | m00 m01 m02 |
// | m10 m11 m12 |
// | m20 m21 m22 |
export type Matrix3x3 = [
  number, number, number,
  number, number, number,
  number, number, number
];

/**
 * Creates an identity matrix.
 */
export function identityMatrix(): Matrix3x3 {
  return [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ];
}

/**
 * Creates a translation matrix.
 */
export function translationMatrix(dx: number, dy: number): Matrix3x3 {
  return [
    1, 0, dx,
    0, 1, dy,
    0, 0, 1
  ];
}

/**
 * Creates a scaling matrix.
 */
export function scalingMatrix(sx: number, sy: number): Matrix3x3 {
  return [
    sx, 0,  0,
    0,  sy, 0,
    0,  0,  1
  ];
}

/**
 * Creates a rotation matrix (angle in radians).
 */
export function rotationMatrix(angle: number): Matrix3x3 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [
    cos, -sin, 0,
    sin,  cos, 0,
    0,    0,   1
  ];
}

/**
 * Creates a shearing matrix.
 */
export function shearingMatrix(shx: number, shy: number): Matrix3x3 {
  return [
    1,   shx, 0,
    shy, 1,   0,
    0,   0,   1
  ];
}

/**
 * Multiplies two 3x3 matrices.
 */
export function multiplyMatrices(a: Matrix3x3, b: Matrix3x3): Matrix3x3 {
  const out = Array(9).fill(0) as Matrix3x3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let sum = 0;
      for (let i = 0; i < 3; i++) {
        sum += a[r * 3 + i] * b[i * 3 + c];
      }
      out[r * 3 + c] = sum;
    }
  }
  return out;
}

/**
 * Applies a 3x3 affine matrix to a 2D point.
 */
export function transformPoint(point: Point2D, matrix: Matrix3x3): Point2D {
  const x = point.x;
  const y = point.y;
  return {
    x: matrix[0] * x + matrix[1] * y + matrix[2],
    y: matrix[3] * x + matrix[4] * y + matrix[5],
  };
}

export default {
  identityMatrix,
  translationMatrix,
  scalingMatrix,
  rotationMatrix,
  shearingMatrix,
  multiplyMatrices,
  transformPoint,
};
