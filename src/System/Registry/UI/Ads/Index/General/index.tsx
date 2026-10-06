// System/Registry/UI/Ads/Index/General/index.tsx
// Registry node for Ads Index General specifications.

export const AdsIndexGeneralRegistry = {
  id: "Ads_Index_General_Registry",
  name: "Ads Index General Specifications",
  version: "1.0.0",
  type: "UI_Specification",
  status: "active",
  meta: {
    supportedReasons: ["START_GAME", "PLAY_AGAIN"],
    routingTarget: "InterstitialAd",
  },
};

export default AdsIndexGeneralRegistry;
