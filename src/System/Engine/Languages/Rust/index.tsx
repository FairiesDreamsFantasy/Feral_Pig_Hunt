/**
 * System/Engine/Languages/Rust Module
 * Memory-safe native Rust structs, vector algebra, and cargo configurations.
 */

export const RUST_BINDING = {
  structDef: `#[derive(Debug, Clone)]
pub struct PigTrajectory {
    pub x: f64,
    pub y: f64,
    pub curvature_kappa: f64,
}`,
  implDef: `impl PigTrajectory {
    pub fn new(x: f64, y: f64) -> Self {
        Self { x, y, curvature_kappa: 0.0 }
    }
}`
};

export default RUST_BINDING;
