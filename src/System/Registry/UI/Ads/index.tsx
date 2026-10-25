// System/Registry/UI/Ads/index.tsx
// Aggregator for UI Ads Registries.
import { AdsGeneralRegistry } from './General/index.tsx';
import { AdsIndexMasterRegistry } from './Index/index.tsx';
import { AdsInterstitialMasterRegistry } from './Interstitial/index.tsx';

export const AdsUIRegistry = {
  id: "Ads_UI_Registry",
  name: "Ads UI Registry Master Node",
  version: "1.0.0",
  type: "Subsystem_Registry",
  status: "active",
  modules: {
    general: AdsGeneralRegistry,
    index: AdsIndexMasterRegistry,
    interstitial: AdsInterstitialMasterRegistry,
  },
};

export default AdsUIRegistry;
