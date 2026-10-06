/**
 * System/Visuals/Engine/Mathematics/Geometry/Non_Euclidean Module
 * Spherical-to-Cartesian mappings, Poincaré disk projections, hyperbolic saddle metrics, and curved warp space.
 */

export interface SphericalCoord {
  radius: number;
  theta: number; // Polar angle in radians
  phi: number;   // Azimuthal angle in radians
}

export interface CartesianCoord {
  x: number;
  y: number;
  z: number;
}

/**
 * Converts Spherical coordinates to 3D Cartesian coordinates.
 */
export function sphericalToCartesian(sph: SphericalCoord): CartesianCoord {
  const { radius, theta, phi } = sph;
  const sinTheta = Math.sin(theta);
  return {
    x: radius * sinTheta * Math.cos(phi),
    y: radius * sinTheta * Math.sin(phi),
    z: radius * Math.cos(theta)
  };
}

/**
 * Converts 3D Cartesian coordinates back to Spherical coordinates.
 */
export function cartesianToSpherical(cart: CartesianCoord): SphericalCoord {
  const { x, y, z } = cart;
  const radius = Math.sqrt(x * x + y * y + z * z);
  if (radius === 0) {
    return { radius: 0, theta: 0, phi: 0 };
  }
  return {
    radius,
    theta: Math.acos(Math.max(-1, Math.min(1, z / radius))),
    phi: Math.atan2(y, x)
  };
}

/**
 * Poincaré disk model mapping for Hyperbolic space projection.
 * Projects a point onto a hyperbolic disk of given radius.
 */
export function poincareDiskProjection(
  x: number,
  y: number,
  diskRadius: number = 1.0
): { x: number; y: number } {
  const r = Math.sqrt(x * x + y * y);
  if (r === 0) return { x: 0, y: 0 };

  // Hyperbolic radial scaling mapping
  const hyperR = diskRadius * Math.tanh(r / diskRadius);
  const scale = hyperR / r;

  return {
    x: x * scale,
    y: y * scale
  };
}

export default {
  sphericalToCartesian,
  cartesianToSpherical,
  poincareDiskProjection,
};
