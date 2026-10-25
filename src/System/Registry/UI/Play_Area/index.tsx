// System/Registry/UI/Play_Area/index.tsx
// Aggregator for Play Area UI Registries.
import { PlayAreaIndexMasterRegistry } from './Index/index.tsx';
import { PortraitPlayAreaMasterRegistry } from './Portrait_Orientation_4_Mobile_Phones/index.tsx';
import { TabletPlayAreaMasterRegistry } from './Portrait_Orientation_4_Tablets/index.tsx';

export const PlayAreaUIRegistry = {
  id: "Play_Area_UI_Registry",
  name: "Play Area UI Registry Node",
  version: "1.0.0",
  type: "Subsystem_Registry",
  status: "active",
  modules: {
    index: PlayAreaIndexMasterRegistry,
    portraitMobile: PortraitPlayAreaMasterRegistry,
    portraitTablet: TabletPlayAreaMasterRegistry,
  },
};

export default PlayAreaUIRegistry;
