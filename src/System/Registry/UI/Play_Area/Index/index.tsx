// System/Registry/UI/Play_Area/Index/index.tsx
// Master Registry entry for Play Area Index.
import { PlayAreaIndexGeneralRegistry } from './General';

export const PlayAreaIndexMasterRegistry = {
  id: "Play_Area_Index_Master_Registry",
  name: "Play Area Index Master Subsystem Registry",
  version: "1.0.0",
  type: "Subsystem_Registry",
  status: "active",
  modules: {
    general: PlayAreaIndexGeneralRegistry,
  },
  meta: {
    role: "Adaptive Play Area Viewport Dispatcher",
    landscapePreserved: true,
    portraitMobileRouted: true,
  },
};
export default PlayAreaIndexMasterRegistry;
