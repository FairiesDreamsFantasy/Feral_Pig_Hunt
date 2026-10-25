/**
 * src/System/AI/In-Game/index.tsx
 * Comprehensive In-Game Artificial Intelligence Engine.
 * Implements:
 * 1. Discrete Anti-Windup PID Closed-Loop Performance Balancing.
 * 2. Markov Decision Process for Dynamic Behavioral Transitions.
 * 3. Craig Reynolds Boids Flocking Simulation (Separation, Cohesion, Alignment).
 * 4. 4th-Order Runge-Kutta (RK4) Numerical Integration for Ballistic Intercepts.
 */

import { WaveTacticalSeed, DEFAULT_TACTICAL_SEED } from '../General/index.tsx';
import {
  PlayerSessionTelemetry,
  DynamicAITension,
  IDEAL_TENSION_TARGET,
  PIDConstants,
  PIDControllerState,
  DEFAULT_AI_PID_CONSTANTS,
  MarkovHogState,
  HOG_BEHAVIORAL_TRANSITION_MATRIX,
  BoidAgent,
  BoidFlockParameters,
  DEFAULT_FLOCK_PARAMETERS,
  RK4BallisticState,
  BallisticEnvironment,
  DEFAULT_BALLISTIC_ENV,
} from './General/index.tsx';
import { inGameDriftGuardInstance } from './Drift_Guard/index.tsx';

export * from './General/index.tsx';
export * from './Drift_Guard/index.tsx';
export * as TTS from './TTS/index.tsx';
export * from './TTS/index.tsx';

// ============================================================================
// 1. DISCRETE ANTI-WINDUP PID CONTROLLER
// ============================================================================

export class DiscretePIDController {
  private constants: PIDConstants;
  private state: PIDControllerState;

  constructor(constants: PIDConstants = DEFAULT_AI_PID_CONSTANTS) {
    this.constants = { ...constants };
    this.state = {
      integral: 0,
      previousError: 0,
      previousMeasurement: 0,
      filteredDerivative: 0,
      lastTimestamp: performance.now(),
    };
  }

  public reset(initialMeasurement: number = 0): void {
    this.state = {
      integral: 0,
      previousError: 0,
      previousMeasurement: initialMeasurement,
      filteredDerivative: 0,
      lastTimestamp: performance.now(),
    };
  }

  /**
   * Computes control signal u(t) = Kp * e + Ki * ∫e dt + Kd * de/dt
   * with low-pass derivative filtering and integral anti-windup clamping.
   */
  public update(setpoint: number, measurement: number, currentTimestamp: number = performance.now()): number {
    const dtSeconds = Math.max(0.001, (currentTimestamp - this.state.lastTimestamp) / 1000.0);
    const error = setpoint - measurement;

    // 1. Proportional Term
    const proportional = this.constants.kp * error;

    // 2. Integral Term with Anti-Windup Clamping
    this.state.integral += error * dtSeconds;
    this.state.integral = Math.max(
      -this.constants.integralWindupLimit,
      Math.min(this.constants.integralWindupLimit, this.state.integral)
    );
    const integral = this.constants.ki * this.state.integral;

    // 3. Derivative Term with 1st-Order Low-Pass Filter
    // Derivative on measurement (rather than error) prevents derivative kick on setpoint shifts
    const rawDerivative = -(measurement - this.state.previousMeasurement) / dtSeconds;
    const alpha = dtSeconds / (this.constants.derivativeFilterTau + dtSeconds);
    this.state.filteredDerivative = (1 - alpha) * this.state.filteredDerivative + alpha * rawDerivative;
    const derivative = this.constants.kd * this.state.filteredDerivative;

    // State update
    this.state.previousError = error;
    this.state.previousMeasurement = measurement;
    this.state.lastTimestamp = currentTimestamp;

    return proportional + integral + derivative;
  }
}

// Global PID instance tracking player difficulty calibration
export const globalPlayerTensionPID = new DiscretePIDController();

// ============================================================================
// 2. MARKOV CHAIN BEHAVIORAL STATE ENGINE
// ============================================================================

export class MarkovBehaviorEngine {
  /**
   * Samples the next behavioral state based on the stochastic transition matrix.
   * Modulates transition probabilities based on real-time tension factors.
   */
  public static sampleNextState(
    currentState: MarkovHogState,
    tensionFactor: number = 1.0,
    randomSeed: number = Math.random()
  ): MarkovHogState {
    const baseDist = HOG_BEHAVIORAL_TRANSITION_MATRIX[currentState];
    
    // Construct modulated probability mass function (PMF)
    const modulatedDist: Record<MarkovHogState, number> = {
      GRAZING: baseDist.GRAZING / Math.max(0.5, tensionFactor),
      ALERT: baseDist.ALERT,
      FLANKING: baseDist.FLANKING * Math.min(2.0, tensionFactor),
      DIVING: baseDist.DIVING * Math.min(2.5, tensionFactor),
      RETREATING: tensionFactor > 2.0 ? baseDist.RETREATING * 0.5 : baseDist.RETREATING,
    };

    // Normalize PMF sum to 1.0
    const sum = Object.values(modulatedDist).reduce((a, b) => a + b, 0);
    const normalizedDist: Record<MarkovHogState, number> = {
      GRAZING: modulatedDist.GRAZING / sum,
      ALERT: modulatedDist.ALERT / sum,
      FLANKING: modulatedDist.FLANKING / sum,
      DIVING: modulatedDist.DIVING / sum,
      RETREATING: modulatedDist.RETREATING / sum,
    };

    // Cumulative distribution function (CDF) walk
    const states: MarkovHogState[] = ['GRAZING', 'ALERT', 'FLANKING', 'DIVING', 'RETREATING'];
    let cumulative = 0;
    for (const st of states) {
      cumulative += normalizedDist[st];
      if (randomSeed <= cumulative) {
        return st;
      }
    }
    return 'GRAZING';
  }
}

// ============================================================================
// 3. CRAIG REYNOLDS BOIDS FLOCKING SIMULATION
// ============================================================================

export class ReynoldsFlockingEngine {
  /**
   * Computes the net acceleration vector for a boid given its neighbors and target.
   */
  public static computeFlockAcceleration(
    boid: BoidAgent,
    neighbors: BoidAgent[],
    targetPos?: { x: number; y: number },
    params: BoidFlockParameters = DEFAULT_FLOCK_PARAMETERS
  ): { x: number; y: number } {
    let separationX = 0;
    let separationY = 0;
    let separationCount = 0;

    let alignmentX = 0;
    let alignmentY = 0;
    let neighborCount = 0;

    let cohesionX = 0;
    let cohesionY = 0;

    for (const other of neighbors) {
      if (other.id === boid.id) continue;

      const dx = boid.position.x - other.position.x;
      const dy = boid.position.y - other.position.y;
      const distanceSq = dx * dx + dy * dy;

      if (distanceSq > 0 && distanceSq < params.separationRadius * params.separationRadius) {
        const distance = Math.sqrt(distanceSq);
        separationX += (dx / distance) / distance; // Weight inversely by distance
        separationY += (dy / distance) / distance;
        separationCount++;
      }

      if (distanceSq > 0 && distanceSq < params.neighborRadius * params.neighborRadius) {
        alignmentX += other.velocity.x;
        alignmentY += other.velocity.y;

        cohesionX += other.position.x;
        cohesionY += other.position.y;
        neighborCount++;
      }
    }

    // 1. Separation force
    let steerSepX = 0;
    let steerSepY = 0;
    if (separationCount > 0) {
      separationX /= separationCount;
      separationY /= separationCount;
      const mag = Math.sqrt(separationX * separationX + separationY * separationY);
      if (mag > 0) {
        steerSepX = (separationX / mag) * boid.maxSpeed - boid.velocity.x;
        steerSepY = (separationY / mag) * boid.maxSpeed - boid.velocity.y;
      }
    }

    // 2. Alignment force
    let steerAlignX = 0;
    let steerAlignY = 0;
    if (neighborCount > 0) {
      alignmentX /= neighborCount;
      alignmentY /= neighborCount;
      const mag = Math.sqrt(alignmentX * alignmentX + alignmentY * alignmentY);
      if (mag > 0) {
        steerAlignX = (alignmentX / mag) * boid.maxSpeed - boid.velocity.x;
        steerAlignY = (alignmentY / mag) * boid.maxSpeed - boid.velocity.y;
      }
    }

    // 3. Cohesion force
    let steerCohX = 0;
    let steerCohY = 0;
    if (neighborCount > 0) {
      cohesionX /= neighborCount;
      cohesionY /= neighborCount;
      const targetVecX = cohesionX - boid.position.x;
      const targetVecY = cohesionY - boid.position.y;
      const mag = Math.sqrt(targetVecX * targetVecX + targetVecY * targetVecY);
      if (mag > 0) {
        steerCohX = (targetVecX / mag) * boid.maxSpeed - boid.velocity.x;
        steerCohY = (targetVecY / mag) * boid.maxSpeed - boid.velocity.y;
      }
    }

    // 4. Target attraction force
    let steerTgtX = 0;
    let steerTgtY = 0;
    if (targetPos) {
      const tgtVecX = targetPos.x - boid.position.x;
      const tgtVecY = targetPos.y - boid.position.y;
      const mag = Math.sqrt(tgtVecX * tgtVecX + tgtVecY * tgtVecY);
      if (mag > 0) {
        steerTgtX = (tgtVecX / mag) * boid.maxSpeed - boid.velocity.x;
        steerTgtY = (tgtVecY / mag) * boid.maxSpeed - boid.velocity.y;
      }
    }

    // Sum weighted forces
    const netForceX =
      steerSepX * params.separationWeight +
      steerAlignX * params.alignmentWeight +
      steerCohX * params.cohesionWeight +
      steerTgtX * params.targetWeight;

    const netForceY =
      steerSepY * params.separationWeight +
      steerAlignY * params.alignmentWeight +
      steerCohY * params.cohesionWeight +
      steerTgtY * params.targetWeight;

    // Clamp to maxForce
    const netForceMag = Math.sqrt(netForceX * netForceX + netForceY * netForceY);
    const finalForceX = netForceMag > boid.maxForce ? (netForceX / netForceMag) * boid.maxForce : netForceX;
    const finalForceY = netForceMag > boid.maxForce ? (netForceY / netForceMag) * boid.maxForce : netForceY;

    // a = F / m
    return {
      x: finalForceX / Math.max(0.1, boid.mass),
      y: finalForceY / Math.max(0.1, boid.mass),
    };
  }
}

// ============================================================================
// 4. 4th-ORDER RUNGE-KUTTA (RK4) BALLISTIC TRAJECTORY SOLVER
// ============================================================================

export class RungeKutta4Solver {
  /**
   * System of 1st-order ODEs:
   * dX/dt = Vx
   * dY/dt = Vy
   * dVx/dt = -0.5 * rho * Cd * A * Vx * |V| / m
   * dVy/dt = g - 0.5 * rho * Cd * A * Vy * |V| / m
   */
  private static derivatives(
    state: RK4BallisticState,
    env: BallisticEnvironment
  ): [number, number, number, number] {
    const speed = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
    const dragForceX = -env.dragCoefficient * (state.vx - env.windVelocityX) * speed;
    const dragForceY = -env.dragCoefficient * state.vy * speed;

    const ax = dragForceX;
    const ay = env.gravity + dragForceY;

    return [state.vx, state.vy, ax, ay];
  }

  /**
   * Computes a single RK4 integration time step h.
   */
  public static step(
    state: RK4BallisticState,
    dt: number,
    env: BallisticEnvironment = DEFAULT_BALLISTIC_ENV
  ): RK4BallisticState {
    const h = dt;
    const [dx1, dy1, dvx1, dvy1] = this.derivatives(state, env);

    const s2: RK4BallisticState = {
      x: state.x + 0.5 * h * dx1,
      y: state.y + 0.5 * h * dy1,
      vx: state.vx + 0.5 * h * dvx1,
      vy: state.vy + 0.5 * h * dvy1,
    };
    const [dx2, dy2, dvx2, dvy2] = this.derivatives(s2, env);

    const s3: RK4BallisticState = {
      x: state.x + 0.5 * h * dx2,
      y: state.y + 0.5 * h * dy2,
      vx: state.vx + 0.5 * h * dvx2,
      vy: state.vy + 0.5 * h * dvy2,
    };
    const [dx3, dy3, dvx3, dvy3] = this.derivatives(s3, env);

    const s4: RK4BallisticState = {
      x: state.x + h * dx3,
      y: state.y + h * dy3,
      vx: state.vx + h * dvx3,
      vy: state.vy + h * dvy3,
    };
    const [dx4, dy4, dvx4, dvy4] = this.derivatives(s4, env);

    return {
      x: state.x + (h / 6.0) * (dx1 + 2 * dx2 + 2 * dx3 + dx4),
      y: state.y + (h / 6.0) * (dy1 + 2 * dy2 + 2 * dy3 + dy4),
      vx: state.vx + (h / 6.0) * (dvx1 + 2 * dvx2 + 2 * dvx3 + dvx4),
      vy: state.vy + (h / 6.0) * (dvy1 + 2 * dvy2 + 2 * dvy3 + dvy4),
    };
  }

  /**
   * Projects an entire ballistic arc forward by n steps.
   */
  public static simulateArc(
    initialState: RK4BallisticState,
    totalTime: number,
    steps: number = 20,
    env: BallisticEnvironment = DEFAULT_BALLISTIC_ENV
  ): RK4BallisticState[] {
    const trajectory: RK4BallisticState[] = [{ ...initialState }];
    const dt = totalTime / steps;
    let current = { ...initialState };

    for (let i = 0; i < steps; i++) {
      current = this.step(current, dt, env);
      trajectory.push({ ...current });
    }
    return trajectory;
  }
}

// ============================================================================
// 5. ENHANCED INTEGRATED IN-GAME AI FUNCTIONS
// ============================================================================

export function calculateTacticalWaveParameters(waveNumber: number, customSeed?: WaveTacticalSeed | null): WaveTacticalSeed {
  const calcStart = performance.now();
  let generatedSeed: WaveTacticalSeed;

  if (customSeed) {
    generatedSeed = {
      ...customSeed,
      waveSpeedMultiplier: customSeed.waveSpeedMultiplier * (1 + (waveNumber - 1) * 0.08),
      diveAggression: customSeed.diveAggression * (1 + (waveNumber - 1) * 0.12),
    };
  } else {
    const baseMultiplier = 1.0 + (waveNumber - 1) * 0.08;
    generatedSeed = {
      ...DEFAULT_TACTICAL_SEED,
      seedNumber: waveNumber * 1337,
      waveSpeedMultiplier: baseMultiplier,
      diveAggression: Math.min(2.5, 1.0 + (waveNumber - 1) * 0.15),
      spottedRatio: Math.min(0.6, 0.2 + waveNumber * 0.05),
    };
  }

  const durationMs = performance.now() - calcStart;
  const { sanitizedSeed } = inGameDriftGuardInstance.auditWaveParameters(waveNumber, generatedSeed, durationMs);
  return sanitizedSeed;
}

/**
 * Modern Closed-Loop PID-Integrated Tension Controller
 * Uses both static telemetry and continuous PID error correction to calibrate game difficulty.
 */
export function calculateDynamicAITension(telemetry: PlayerSessionTelemetry): DynamicAITension {
  const accuracy = telemetry.shotsFired > 0 ? telemetry.shotsHit / telemetry.shotsFired : 0.5;
  
  // Speed ratio comparing current wave duration with historic clearances
  const averageWaveClearTime = telemetry.waveClearTimes.length > 0 
    ? telemetry.waveClearTimes.reduce((a, b) => a + b, 0) / telemetry.waveClearTimes.length
    : 15; // default 15 seconds
  const speedRatio = telemetry.currentWaveDuration > 0
    ? averageWaveClearTime / Math.max(1, telemetry.currentWaveDuration)
    : 1.0;

  // Base player performance index (PPI)
  const ppi = (accuracy * 1.2) + (Math.min(2.0, speedRatio) * 0.6) + ((3 - telemetry.livesRemaining) * 0.1);

  // Closed-loop PID control adjustment
  const pidCorrection = globalPlayerTensionPID.update(IDEAL_TENSION_TARGET, ppi);

  // Proportional scaling with PID feedback
  let tensionScore = 1.0 + (ppi - IDEAL_TENSION_TARGET) * 0.75 + pidCorrection * 0.25;
  tensionScore = Math.max(0.6, Math.min(2.8, tensionScore)); // clamp to safe limits

  // Highly skilled players trigger predictive intercept charges and wider zigzag sweeps
  const predictiveCharge = tensionScore > 1.25;
  const zigZagFactor = tensionScore > 1.5 ? Math.min(1.8, (tensionScore - 1.0) * 1.5) : 0.0;
  const diveFrequencyMultiplier = Math.max(0.5, Math.min(2.2, tensionScore * 1.1));

  const rawTension: DynamicAITension = {
    tensionScore,
    predictiveCharge,
    zigZagFactor,
    diveFrequencyMultiplier,
  };

  const { sanitizedTension } = inGameDriftGuardInstance.auditDynamicTension(rawTension, telemetry);
  return sanitizedTension;
}

/**
 * Advanced Intercept Vector Solver using RK4 Kinematic Numerical Prediction
 * Solves where the pig should charge horizontally to intercept the moving player
 * based on non-linear drag, vertical acceleration, and player horizontal velocity.
 */
export function calculatePredictiveIntercept(
  pigPos: { x: number; y: number },
  pigBaseSpeedY: number,
  playerPos: { x: number; y: number },
  playerVelocityX: number
): number {
  const distanceY = playerPos.y - pigPos.y;
  if (distanceY <= 0) return playerPos.x;

  // Use RK4 simulation to evaluate time of flight with non-linear drag
  const dt = 1 / 60; // 60 FPS frame time
  let simState: RK4BallisticState = {
    x: pigPos.x,
    y: pigPos.y,
    vx: 0,
    vy: pigBaseSpeedY * 60, // Convert to units/sec
  };

  let simulatedCycles = 0;
  const maxCycles = 180; // 3 seconds timeout
  while (simState.y < playerPos.y && simulatedCycles < maxCycles) {
    simState = RungeKutta4Solver.step(simState, dt);
    simulatedCycles++;
  }

  const flightCycles = Math.max(1.0, simulatedCycles);
  
  // Calculate projected horizontal position
  let projectedX = playerPos.x + playerVelocityX * flightCycles;
  
  // Keep projected path inside screen boundaries
  const maxBoundary = 800 - 32;
  const minBoundary = 32;
  projectedX = Math.max(minBoundary, Math.min(maxBoundary, projectedX));

  return projectedX;
}

export default {
  DiscretePIDController,
  globalPlayerTensionPID,
  MarkovBehaviorEngine,
  ReynoldsFlockingEngine,
  RungeKutta4Solver,
  calculateTacticalWaveParameters,
  calculateDynamicAITension,
  calculatePredictiveIntercept,
};
