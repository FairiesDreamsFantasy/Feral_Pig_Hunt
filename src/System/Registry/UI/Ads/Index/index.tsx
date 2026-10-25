// System/Registry/UI/Ads/Index/index.tsx
// Master Registry for Ads Index.
import { AdsIndexGeneralRegistry } from './General/index.tsx';

export const AdsIndexMasterRegistry = {
  id: "Ads_Index_Master_Registry",
  name: "Ads Index Master Registry Node",
  version: "1.0.0",
  type: "Subsystem_Registry",
  status: "active",
  modules: {
    general: AdsIndexGeneralRegistry,
  },
};

export default AdsIndexMasterRegistry;
