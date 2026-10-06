// System/Registry/UI/Ads/Interstitial/index.tsx
// Master Registry for Interstitial Ad Subsystem.
import { AdsInterstitialGeneralRegistry } from './General/index.tsx';

export const AdsInterstitialMasterRegistry = {
  id: "Ads_Interstitial_Master_Registry",
  name: "Interstitial Ad Master Registry Node",
  version: "1.0.0",
  type: "Subsystem_Registry",
  status: "active",
  modules: {
    general: AdsInterstitialGeneralRegistry,
  },
};

export default AdsInterstitialMasterRegistry;
