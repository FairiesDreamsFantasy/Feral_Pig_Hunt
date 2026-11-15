/**
 * src/System/Engine/Science/Physics/General/index.tsx
 * Ultra-Scientific Physics Engine Subsystem.
 * Mathematical models:
 * 1. Vector2D calculus (Dot, Cross, Euclidean Norm, Unit Projection, Reflection).
 * 2. Velocity-Verlet Symplectic Numerical Integration & Hamiltonian Energy Conservation.
 * 3. Impulse-Based Newtonian Rigid Body Collision Dynamics with Restitution.
 * 4. Lotka-Volterra Ecosystem Population Balance Differential Equations.
 * 5. Relativistic Lorentz Transformation and Relativistic Doppler Frequency Shift.
 */

import { BoundingBox, Vector2D } from '../../../../General/index.tsx';

// ============================================================================
// 1. VECTOR2D CALCULUS & LINEAR ALGEBRA
// ============================================================================

export class Vector2DCalculus {
  public static add(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  public static subtract(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  public static scale(v: Vector2D, scalar: number): Vector2D {
    return { x: v.x * scalar, y: v.y * scalar };
  }

  /**
   * Vector Dot Product: a · b = |a||b| cos(theta)
   */
  public static dot(a: Vector2D, b: Vector2D): number {
    return a.x * b.x + a.y * b.y;
  }

  /**
   * 2D Cross Product (Determinant): a × b = ax*by - ay*bx
   */
  public static cross(a: Vector2D, b: Vector2D): number {
    return a.x * b.y - a.y * b.x;
  }

  /**
   * Euclidean Norm (Magnitude): ||v|| = sqrt(x^2 + y^2)
   */
  public static magnitude(v: Vector2D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  /**
   * Normalizes vector to unit length: v_hat = v / ||v||
   */
  public static normalize(v: Vector2D): Vector2D {
    const mag = Math.sqrt(v.x * v.x + v.y * v.y);
    return mag > 0.00001 ? { x: v.x / mag, y: v.y / mag } : { x: 0, y: 0 };
  }

  /**
   * Computes reflection of vector off a surface normal n: r = d - 2(d · n)n
   */
  public static reflect(dir: Vector2D, normal: Vector2D): Vector2D {
    const n = this.normalize(normal);
    const dot = this.dot(dir, n);
    return {
      x: dir.x - 2 * dot * n.x,
      y: dir.y - 2 * dot * n.y,
    };
  }

  /**
   * Euclidean distance between two spatial points
   */
  public static distance(a: Vector2D, b: Vector2D): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// ============================================================================
// 2. VELOCITY-VERLET SYMPLECTIC NUMERICAL INTEGRATION
// ============================================================================

export interface VerletParticle {
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  mass: number;
}

export class VelocityVerletIntegrator {
  /**
   * Performs one time step of Velocity-Verlet integration:
   * x(t + dt) = x(t) + v(t)*dt + 0.5*a(t)*dt^2
   * a(t + dt) = F(x(t + dt)) / m
   * v(t + dt) = v(t) + 0.5*(a(t) + a(t + dt))*dt
   */
  public static step(
    particle: VerletParticle,
    dt: number,
    forceCalculator: (pos: Vector2D, vel: Vector2D) => Vector2D
  ): void {
    const dtSq = dt * dt;
    const halfDt = 0.5 * dt;

    // 1. Position update
    particle.position.x += particle.velocity.x * dt + 0.5 * particle.acceleration.x * dtSq;
    particle.position.y += particle.velocity.y * dt + 0.5 * particle.acceleration.y * dtSq;

    // 2. Compute new force & acceleration at updated position
    const newForce = forceCalculator(particle.position, particle.velocity);
    const newAx = newForce.x / Math.max(0.001, particle.mass);
    const newAy = newForce.y / Math.max(0.001, particle.mass);

    // 3. Velocity update
    particle.velocity.x += halfDt * (particle.acceleration.x + newAx);
    particle.velocity.y += halfDt * (particle.acceleration.y + newAy);

    particle.acceleration.x = newAx;
    particle.acceleration.y = newAy;
  }

  /**
   * Calculates total mechanical energy (Hamiltonian H = T + V) to verify conservation.
   */
  public static computeHamiltonianEnergy(
    particle: VerletParticle,
    potentialEnergyFn: (pos: Vector2D) => number
  ): { kinetic: number; potential: number; total: number } {
    const vSq = particle.velocity.x * particle.velocity.x + particle.velocity.y * particle.velocity.y;
    const kinetic = 0.5 * particle.mass * vSq;
    const potential = potentialEnergyFn(particle.position);
    return {
      kinetic,
      potential,
      total: kinetic + potential,
    };
  }
}

// ============================================================================
// 3. IMPULSE-BASED NEWTONIAN COLLISION DYNAMICS
// ============================================================================

export interface RigidBody2D {
  position: Vector2D;
  velocity: Vector2D;
  mass: number;
  width: number;
  height: number;
  restitution: number; // Coefficient of restitution e in [0, 1]
}

export class RigidBodyDynamics {
  /**
   * Standard Axis-Aligned Bounding Box (AABB) intersection detection.
   */
  public static verifyAABBCollision(box1: BoundingBox, box2: BoundingBox): boolean {
    return (
      box1.x < box2.x + box2.width &&
      box1.x + box1.width > box2.x &&
      box1.y < box2.y + box2.height &&
      box1.y + box1.height > box2.y
    );
  }

  /**
   * Computes moment of inertia for a rectangular rigid body: I = (1/12) * m * (w^2 + h^2)
   */
  public static calculateMomentOfInertia(body: RigidBody2D): number {
    return (1 / 12) * body.mass * (body.width * body.width + body.height * body.height);
  }

  /**
   * Resolves an elastic/inelastic impulse collision between two 2D bodies:
   * J = -(1 + e) * (v_rel · n) / (1/m1 + 1/m2)
   */
  public static resolveCollisionImpulse(bodyA: RigidBody2D, bodyB: RigidBody2D, collisionNormal: Vector2D): void {
    const n = Vector2DCalculus.normalize(collisionNormal);
    const relVel = Vector2DCalculus.subtract(bodyA.velocity, bodyB.velocity);
    const velAlongNormal = Vector2DCalculus.dot(relVel, n);

    // If objects are moving away from each other, do not resolve
    if (velAlongNormal > 0) return;

    const e = Math.min(bodyA.restitution, bodyB.restitution);
    const invMassA = 1 / Math.max(0.001, bodyA.mass);
    const invMassB = 1 / Math.max(0.001, bodyB.mass);

    const impulseScalar = -(1 + e) * velAlongNormal / (invMassA + invMassB);
    const impulse = Vector2DCalculus.scale(n, impulseScalar);

    bodyA.velocity.x += impulse.x * invMassA;
    bodyA.velocity.y += impulse.y * invMassA;

    bodyB.velocity.x -= impulse.x * invMassB;
    bodyB.velocity.y -= impulse.y * invMassB;
  }
}

// ============================================================================
// 4. LOTKA-VOLTERRA ECOLOGICAL PREDATOR-PREY EQUILIBRIUM SOLVER
// ============================================================================

export interface EcosystemParameters {
  alpha: number; // Prey (feral hog) natural reproduction rate
  beta: number;  // Predation rate per hunter encounter
  gamma: number; // Hunter depletion / patrol fatigue rate
  delta: number; // Ecosystem restoration efficiency per hog captured
}

export const DEFAULT_ECOSYSTEM_PARAMS: EcosystemParameters = {
  alpha: 0.12,
  beta: 0.004,
  gamma: 0.08,
  delta: 0.003,
};

export class LotkaVolterraEcology {
  /**
   * Solves continuous predator-prey dynamics over dt:
   * dH/dt = alpha * H - beta * H * P
   * dP/dt = delta * H * P - gamma * P
   */
  public static computeEquilibriumStep(
    hogPopulation: number,
    hunterPressure: number,
    dt: number,
    params: EcosystemParameters = DEFAULT_ECOSYSTEM_PARAMS
  ): { nextHogs: number; nextPressure: number; hogRateOfChange: number } {
    const dH_dt = params.alpha * hogPopulation - params.beta * hogPopulation * hunterPressure;
    const dP_dt = params.delta * hogPopulation * hunterPressure - params.gamma * hunterPressure;

    const nextHogs = Math.max(1, hogPopulation + dH_dt * dt);
    const nextPressure = Math.max(0.5, hunterPressure + dP_dt * dt);

    return {
      nextHogs,
      nextPressure,
      hogRateOfChange: dH_dt,
    };
  }

  /**
   * Analytical carrying capacity and coexistence steady-state:
   * H* = gamma / delta
   * P* = alpha / beta
   */
  public static calculateSteadyState(params: EcosystemParameters = DEFAULT_ECOSYSTEM_PARAMS): { steadyHogs: number; steadyPressure: number } {
    return {
      steadyHogs: params.gamma / params.delta,
      steadyPressure: params.alpha / params.beta,
    };
  }
}

// ============================================================================
// 5. RELATIVISTIC KINEMATICS & DOPPLER EQUATIONS
// ============================================================================

/**
 * Computes the relativistic Lorentz contraction factor for ultra-fast objects:
 * gamma = sqrt(1 - v^2/c^2)
 */
export function calculateLorentzContraction(velocity: number, speedOfLight: number = 299792458): number {
  if (Math.abs(velocity) >= speedOfLight) return 0.001; // Avoid divide-by-zero
  const ratio = (velocity * velocity) / (speedOfLight * speedOfLight);
  return Math.sqrt(1 - ratio);
}

/**
 * Relativistic Longitudinal Doppler Shift factor:
 * f_observed = f_source * sqrt((1 - beta) / (1 + beta)), where beta = v / c
 */
export function calculateRelativisticDopplerShift(velocity: number, baseFrequencyHz: number, speedOfLight: number = 3000): number {
  const beta = Math.max(-0.99, Math.min(0.99, velocity / speedOfLight));
  const factor = Math.sqrt((1 - beta) / (1 + beta));
  return baseFrequencyHz * factor;
}

/**
 * Standard Axis-Aligned Bounding Box (AABB) collision verification.
 */
export function verifyAABBCollision(box1: BoundingBox, box2: BoundingBox): boolean {
  return RigidBodyDynamics.verifyAABBCollision(box1, box2);
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

export default {
  Vector2DCalculus,
  VelocityVerletIntegrator,
  RigidBodyDynamics,
  LotkaVolterraEcology,
  calculateLorentzContraction,
  calculateRelativisticDopplerShift,
  verifyAABBCollision,
  constrainToBoundary,
};
