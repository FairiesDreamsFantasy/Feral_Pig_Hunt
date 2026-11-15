/**
 * System/Engine/Languages/CSV Module
 * CSV serializations for tabular telemetry logging of pig speed, vectors, and weights.
 */

export const CSV_BINDING = {
  header: 'Timestamp,Pig_ID,Velocity_X,Velocity_Y,Tusk_Length_MM,Health',
  formatRow: (id: string, vx: number, vy: number, tusk: number, health: number) => {
    return `${Date.now()},${id},${vx.toFixed(2)},${vy.toFixed(2)},${tusk},${health}`;
  }
};

export default CSV_BINDING;
