// System/Registry/UI/Play_Area/Portrait_Orientation_4_Mobile_Phones/General/index.tsx
// Registry entry for portrait mobile view general specifications.

export const PortraitPlayAreaGeneralRegistry = {
  id: "Portrait_Play_Area_General",
  name: "Portrait Play Area General Specifications",
  version: "1.0.0",
  type: "UI_Specification",
  status: "active",
  meta: {
    targetDevices: ["Mobile Phones in Portrait Orientation"],
    aspectRatio: "3:4 Classic Vertical Arcade CRT",
    virtualCoordinateSpace: "480x640",
    scaleAlgorithm: "Bounding Math.min(scaleX, scaleY)",
    zeroHardcoding: true,
  },
};
export default PortraitPlayAreaGeneralRegistry;
