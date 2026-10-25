/**
 * System/Visuals/Animations/3-D Module
 * High-craftsmanship 3D coordinate system projection, Euler angle rotations, and Quaternion transforms.
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface Quaternion {
  w: number;
  x: number;
  y: number;
  z: number;
}

/**
 * Applies a standard 3D Euler rotation (Pitch, Yaw, Roll) to a 3D vector.
 * Angles are specified in radians.
 */
export function rotateEuler(vector: Vector3D, pitch: number, yaw: number, roll: number): Vector3D {
  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosR = Math.cos(roll);
  const sinR = Math.sin(roll);

  // Rotate around X-axis (Pitch)
  let x1 = vector.x;
  let y1 = vector.y * cosP - vector.z * sinP;
  let z1 = vector.y * sinP + vector.z * cosP;

  // Rotate around Y-axis (Yaw)
  let x2 = x1 * cosY + z1 * sinY;
  let y2 = y1;
  let z2 = -x1 * sinY + z1 * cosY;

  // Rotate around Z-axis (Roll)
  let x3 = x2 * cosR - y2 * sinR;
  let y3 = x2 * sinR + y2 * cosR;
  let z3 = z2;

  return { x: x3, y: y3, z: z3 };
}

/**
 * Creates a Quaternion from Euler angles.
 */
export function quaternionFromEuler(pitch: number, yaw: number, roll: number): Quaternion {
  const c1 = Math.cos(pitch / 2);
  const s1 = Math.sin(pitch / 2);
  const c2 = Math.cos(yaw / 2);
  const s2 = Math.sin(yaw / 2);
  const c3 = Math.cos(roll / 2);
  const s3 = Math.sin(roll / 2);

  return {
    w: c1 * c2 * c3 - s1 * s2 * s3,
    x: s1 * c2 * c3 + c1 * s2 * s3,
    y: c1 * s2 * c3 - s1 * c2 * s3,
    z: c1 * c2 * s3 + s1 * s2 * c3,
  };
}

/**
 * Rotates a 3D vector using a Quaternion to avoid gimbal lock.
 */
export function rotateQuaternion(vector: Vector3D, q: Quaternion): Vector3D {
  const vx = vector.x, vy = vector.y, vz = vector.z;
  const qw = q.w, qx = q.x, qy = q.y, qz = q.z;

  // Calculate quaternion * vector
  const tx = 2 * (qy * vz - qz * vy);
  const ty = 2 * (qz * vx - qx * vz);
  const tz = 2 * (qx * vy - qy * vx);

  return {
    x: vx + qw * tx + (qx * tz - qz * ty),
    y: vy + qw * ty + (qy * tx - qx * tz),
    z: vz + qw * tz + (qz * ty - qy * tx),
  };
}

/**
 * Projects a 3D point onto a 2D plane using a perspective projection matrix.
 */
export function projectPerspective(
  vector: Vector3D,
  width: number,
  height: number,
  fov: number = 60,
  zNear: number = 1,
  zFar: number = 1000
): Vector2D {
  const f = 1.0 / Math.tan((fov * Math.PI) / 360);
  const aspect = width / height;

  // Transform coordinates assuming camera is at (0,0,0) and looking towards +Z
  if (vector.z <= zNear) {
    return { x: width / 2, y: height / 2 };
  }

  const projectedX = (vector.x * f) / (vector.z * aspect);
  const projectedY = (vector.y * f) / vector.z;

  // Map normalized device coordinates to screen coordinates
  const screenX = (projectedX + 1.0) * 0.5 * width;
  const screenY = (1.0 - projectedY) * 0.5 * height;

  return { x: screenX, y: screenY };
}

export default {
  rotateEuler,
  quaternionFromEuler,
  rotateQuaternion,
  projectPerspective,
};
