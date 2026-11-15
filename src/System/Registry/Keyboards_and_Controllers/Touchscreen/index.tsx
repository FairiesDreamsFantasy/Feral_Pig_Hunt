// System/Registry/Keyboards_and_Controllers/Touchscreen/index.tsx
// Master Registry entry for Touchscreen input architecture.
import { TouchscreenGeneralRegistry } from './General';

export const TouchscreenMasterRegistry = {
  id: "Touchscreen_Master_Registry",
  name: "Touchscreen Master Input Subsystem Registry",
  version: "1.0.0",
  type: "Subsystem_Registry",
  status: "active",
  modules: {
    general: TouchscreenGeneralRegistry,
  },
  meta: {
    targetOrientation: "Portrait",
    targetPlatform: "Mobile Phones Exclusively",
    physicalControlsCount: 4,
    bindings: {
      left: "ArrowLeft / A",
      right: "ArrowRight / D",
      pause: "Shift + 7 (&)",
      fire: "Space",
    },
  },
};
export default TouchscreenMasterRegistry;
