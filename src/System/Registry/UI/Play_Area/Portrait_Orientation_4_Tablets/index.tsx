// System/Registry/UI/Play_Area/Portrait_Orientation_4_Tablets/index.tsx
// Master Registry entry for Tablet Portrait Play Area.
import { TabletPlayAreaGeneralRegistry } from './General/index.tsx';

export const TabletPlayAreaMasterRegistry = {
  id: "Tablet_Play_Area_Master_Registry",
  name: "Tablet Portrait Play Area Subsystem Registry",
  version: "1.0.0",
  type: "Subsystem_Registry",
  status: "active",
  modules: {
    general: TabletPlayAreaGeneralRegistry,
  },
  meta: {
    deviceCategory: "Tablet",
    orientation: "Portrait",
    screenRatio: "Centered 60% Width, Aspect-Contain 3:4 CRT",
    bezels: "20% Left / 20% Right",
    decorations: {
      left: "Robot with pepperoni pizza",
      right: "Newly planted tree with stake",
      landscape: "Green horizon",
      sky: "Starfield",
    },
    controls: {
      keyboard: ["ArrowLeft/A", "ArrowRight/D", "Space (Laser)", "Shift + 7 (& - Pause)"],
      touchDeck: ["Left Arrow", "Right Arrow", "Pause/Resume (Shift+7)", "Fire Laser"],
    },
  },
};

export default TabletPlayAreaMasterRegistry;
