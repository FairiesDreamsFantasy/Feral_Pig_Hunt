/**
 * System/Visuals/Engine/Science/Physics Module
 * Fluid aerodynamics, mass-spring-damper kinetics, kinetic friction, and thermodynamic heat dissipation.
 */

export interface PhysicsState2D {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
}

export interface SpringDamperConfig {
  mass: number;
  dampingCoefficient: number; // c
  springConstant: number;      // k
}

/**
 * Calculates dynamic fluid drag force (Newtonian drag equation): Fd = 0.5 * rho * v^2 * Cd * A.
 */
export function calculateFluidDrag(
  velocity: number,
  density: number = 1.225, // Standard sea level air density in kg/m^3
  dragCoefficient: number = 0.47, // Sphere drag coeff
  area: number = 0.5 // Cross-sectional surface area in m^2
): number {
  const speed = Math.abs(velocity);
  const dragForce = 0.5 * density * speed * speed * dragCoefficient * area;
  return velocity < 0 ? dragForce : -dragForce; // Opposing vector
}

/**
 * Computes Euler-Cromer update for a Mass-Spring-Damper mechanical oscillator.
 */
export function updateSpringDamper(
  displacement: number,
  velocity: number,
  config: SpringDamperConfig,
  dtSeconds: number = 0.016
): { displacement: number; velocity: number } {
  const { mass, dampingCoefficient, springConstant } = config;

  // Spring restoring force: F_spring = -k * x
  const fSpring = -springConstant * displacement;

  // Damping friction force: F_damping = -c * v
  const fDamping = -dampingCoefficient * velocity;

  const totalForce = fSpring + fDamping;
  const acceleration = totalForce / (mass <= 0 ? 1 : mass);

  const nextVelocity = velocity + acceleration * dtSeconds;
  const nextDisplacement = displacement + nextVelocity * dtSeconds;

  return {
    displacement: nextDisplacement,
    velocity: nextVelocity
  };
}

/**
 * Calculates thermodynamic kinetic temperature heat accumulation (e.g. atmospheric friction heating at high speeds).
 * dT = (HeatGenerated - HeatDissipated) / thermalCapacity
 */
export function updateAtmosphericHeat(
  currentTempCelsius: number,
  speed: number,
  mass: number,
  dragCoefficient: number,
  ambientTempCelsius: number = 20,
  dtSeconds: number = 0.016
): number {
  const fluidDensity = 1.225;
  const frontalArea = 0.5;
  const dragForce = Math.abs(calculateFluidDrag(speed, fluidDensity, dragCoefficient, frontalArea));
  
  // Power of friction heating: P = F_drag * speed (Watts)
  const heatingPower = dragForce * speed;

  // Specific heat capacity of steel/hull alloy (approx 500 J/kg*K)
  const heatCapacity = 500 * mass;

  // Dissipation based on Newton's law of cooling: P_cooling = h * A * (T - T_ambient)
  const heatTransferCoeff = 10.0; // Convection coefficient
  const coolingPower = heatTransferCoeff * frontalArea * (currentTempCelsius - ambientTempCelsius);

  const netPower = heatingPower - coolingPower;
  const tempDelta = (netPower / heatCapacity) * dtSeconds;

  return Math.max(ambientTempCelsius, currentTempCelsius + tempDelta);
}

export default {
  calculateFluidDrag,
  updateSpringDamper,
  updateAtmosphericHeat,
};
