// System/Registry/UI/Play_Area/Portrait_Orientation_4_Mobile_Phones/index.tsx
// Master Registry entry for Portrait Mobile Play Area.
import { PortraitPlayAreaGeneralRegistry } from './General';

export const PortraitPlayAreaMasterRegistry = {
  id: "Portrait_Play_Area_Master_Registry",
  name: "Portrait Orientation Play Area Subsystem Registry",
  version: "1.0.0",
  type: "Subsystem_Registry",
  status: "active",
  modules: {
    general: PortraitPlayAreaGeneralRegistry,
  },
  meta: {
    orientation: "Vertical / Portrait Only",
    screenPlacement: "Upper Viewport Section",
    deckPlacement: "Lower Screen Section",
    buttons: [
      "Left Arrow (Steer Left)",
      "Right Arrow (Steer Right)",
      "Pause/Resume (Shift+7)",
      "Fire Laser (Space)",
    ],
  },
};
export default PortraitPlayAreaMasterRegistry;
