/**
 * src/System/AI/In-Game/General/index.tsx
 * Ultra-Scientific In-Game AI Telemetry, State Spaces, and Control Systems Specifications.
 * Pure mathematical models: Discrete PID control, Markov transition spaces, Reynolds Boids, and RK4 numerical state vectors.
 */

export interface PlayerSessionTelemetry {
  shotsFired: number;
  shotsHit: number;
  waveClearTimes: number[];
  currentWaveDuration: number;
  livesRemaining: number;
  playerPos: { x: number; y: number };
  playerVelocityX: number;
}

export interface DynamicAITension {
  tensionScore: number;       // Calculated feedback score from 0.0 to 3.0
  predictiveCharge: boolean;  // Enables predictive intercept targeting calculations
  zigZagFactor: number;       // Width multiplier for wild thrashes during charging
  diveFrequencyMultiplier: number;
}

export const IDEAL_TENSION_TARGET = 1.0; // Dynamic tension reference target for balance

/**
 * Closed-Loop Discrete PID Tuning Constants
 */
export interface PIDConstants {
  kp: number;                 // Proportional gain
  ki: number;                 // Integral gain
  kd: number;                 // Derivative gain
  integralWindupLimit: number;// Clamping limit to eliminate integral windup
  derivativeFilterTau: number;// Low-pass time constant to mitigate high-frequency sensor noise
}

export interface PIDControllerState {
  integral: number;
  previousError: number;
  previousMeasurement: number;
  filteredDerivative: number;
  lastTimestamp: number;
}

export const DEFAULT_AI_PID_CONSTANTS: PIDConstants = {
  kp: 0.85,
  ki: 0.12,
  kd: 0.28,
  integralWindupLimit: 2.0,
  derivativeFilterTau: 0.05,
};

/**
 * Feral Hog Behavioral State Machine (Markov Decision Process Space)
 */
export type MarkovHogState = 'GRAZING' | 'ALERT' | 'FLANKING' | 'DIVING' | 'RETREATING';

export interface MarkovStateProbabilityDistribution {
  GRAZING: number;
  ALERT: number;
  FLANKING: number;
  DIVING: number;
  RETREATING: number;
}

/**
 * Ergotic transition matrix P(S_{t+1} | S_t)
 * Row sums strictly equal 1.0 for stochastic compliance.
 */
export const HOG_BEHAVIORAL_TRANSITION_MATRIX: Record<MarkovHogState, MarkovStateProbabilityDistribution> = {
  GRAZING: {
    GRAZING: 0.65,
    ALERT: 0.25,
    FLANKING: 0.05,
    DIVING: 0.05,
    RETREATING: 0.00,
  },
  ALERT: {
    GRAZING: 0.15,
    ALERT: 0.35,
    FLANKING: 0.30,
    DIVING: 0.20,
    RETREATING: 0.00,
  },
  FLANKING: {
    GRAZING: 0.05,
    ALERT: 0.15,
    FLANKING: 0.40,
    DIVING: 0.35,
    RETREATING: 0.05,
  },
  DIVING: {
    GRAZING: 0.00,
    ALERT: 0.05,
    FLANKING: 0.10,
    DIVING: 0.60,
    RETREATING: 0.25,
  },
  RETREATING: {
    GRAZING: 0.40,
    ALERT: 0.30,
    FLANKING: 0.15,
    DIVING: 0.00,
    RETREATING: 0.15,
  },
};

/**
 * Craig Reynolds Boids Swarming Kinematics
 */
export interface BoidAgent {
  id: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number };
  mass: number;
  maxSpeed: number;
  maxForce: number;
}

export interface BoidFlockParameters {
  separationRadius: number;
  neighborRadius: number;
  separationWeight: number;
  alignmentWeight: number;
  cohesionWeight: number;
  targetWeight: number;
}

export const DEFAULT_FLOCK_PARAMETERS: BoidFlockParameters = {
  separationRadius: 36.0,
  neighborRadius: 110.0,
  separationWeight: 1.8,
  alignmentWeight: 1.1,
  cohesionWeight: 1.0,
  targetWeight: 1.5,
};

/**
 * 4th-Order Runge-Kutta Ballistic Integration State Vector
 * S = [x, y, vx, vy]^T
 */
export interface RK4BallisticState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface BallisticEnvironment {
  gravity: number;          // Pixels/sec^2
  dragCoefficient: number;  // Non-linear air resistance (F_d = -0.5 * rho * C_d * A * v * |v|)
  windVelocityX: number;
}

export const DEFAULT_BALLISTIC_ENV: BallisticEnvironment = {
  gravity: 180.0,
  dragCoefficient: 0.0012,
  windVelocityX: 0.0,
};

export default {
  IDEAL_TENSION_TARGET,
  DEFAULT_AI_PID_CONSTANTS,
  HOG_BEHAVIORAL_TRANSITION_MATRIX,
  DEFAULT_FLOCK_PARAMETERS,
  DEFAULT_BALLISTIC_ENV,
};
