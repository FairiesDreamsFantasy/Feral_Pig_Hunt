/**
 * System/Engine/Languages/Swift Module
 * Swift classes, protocols, and Metal framework render binding profiles for iOS/macOS.
 */

export const SWIFT_BINDING = {
  structDef: `struct PigStateSwift {
    let id: UUID
    var positionX: Double
    var positionY: Double
}`,
  protocolDef: `protocol PhysicsEngineDelegate: AnyObject {
    func didUpdatePigState(_ state: PigStateSwift)
}`
};

export default SWIFT_BINDING;
