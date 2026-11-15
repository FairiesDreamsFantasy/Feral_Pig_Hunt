/**
 * Keyboards and Controllers Mechanical Engine Config
 * Defines Second-Order Mass-Spring-Damper mechanical parameters for elite robotics drift control.
 */
export const CONTROLLER_PHYSICS_CONSTANTS = {
  MASS_KG: 15.0,
  DAMPING_C: 22.5,
  SPRING_K: 0.12,
  PROPULSION_FORCE_N: 350.0,
  TIMESTEP_DT: 0.016,
};

export default CONTROLLER_PHYSICS_CONSTANTS;
