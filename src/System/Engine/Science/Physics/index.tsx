/**
 * src/System/Engine/Science/Physics/index.tsx
 * Science Physics Subsystem Integrator. Exports sub-kinematic equations and Lorentz solvers.
 */

export * from './General/index.tsx';
import * as PhysicsGeneral from './General/index.tsx';

export const SciencePhysicsSubsystem = {
  ...PhysicsGeneral,
  subsystemId: 'science_physics_v1',
  unitType: 'MKS (Meter-Kilogram-Second)'
};

export default SciencePhysicsSubsystem;
