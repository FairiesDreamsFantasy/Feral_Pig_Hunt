/**
 * System/Engine/Languages/GO Module
 * Highly parallel Go struct types, channels, and goroutine synchronization for physics engines.
 */

export const GO_BINDING = {
  packageDecl: 'package engine',
  structDef: `type PigCoord struct {
    X, Y float64
    Vx, Vy float64
}`,
  routineDef: `func StreamCoordinates(ch chan PigCoord) {
    for {
        ch <- PigCoord{X: 100.0, Y: 200.0}
    }
}`
};

export default GO_BINDING;
