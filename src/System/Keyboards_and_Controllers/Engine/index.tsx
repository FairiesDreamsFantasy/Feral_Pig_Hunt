/**
 * Keyboards and Controllers Mechanical Engine
 * Computes Second-Order mass-spring-damper physical simulations to move the robotic chassis:
 * m * x'' + c * x' + k * x = F_propulsion
 */
import { CONTROLLER_PHYSICS_CONSTANTS } from './General/index.tsx';

export * from './General/index.tsx';

export class KeyboardMechanicalEngine {
  private positionOffset: number = 0;
  private velocity: number = 0;

  public computeMechanicalVelocity(inputDirection: number): number {
    const m = CONTROLLER_PHYSICS_CONSTANTS.MASS_KG;
    const c = CONTROLLER_PHYSICS_CONSTANTS.DAMPING_C;
    const k = CONTROLLER_PHYSICS_CONSTANTS.SPRING_K;
    const dt = CONTROLLER_PHYSICS_CONSTANTS.TIMESTEP_DT;

    const F_prop = inputDirection * CONTROLLER_PHYSICS_CONSTANTS.PROPULSION_FORCE_N;
    const acceleration = (F_prop - c * this.velocity - k * this.positionOffset) / m;

    this.velocity += acceleration * dt;
    this.positionOffset += this.velocity * dt;

    if (Math.abs(this.velocity) > 12.0) {
      this.velocity = Math.sign(this.velocity) * 12.0;
    }

    return this.velocity;
  }

  public reset(): void {
    this.velocity = 0;
    this.positionOffset = 0;
  }
}

export default KeyboardMechanicalEngine;
