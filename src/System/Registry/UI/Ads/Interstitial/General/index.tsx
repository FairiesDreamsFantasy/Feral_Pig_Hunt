// System/Registry/UI/Ads/Interstitial/General/index.tsx
// Registry node for Interstitial Ad specifications.

export const AdsInterstitialGeneralRegistry = {
  id: "Ads_Interstitial_General_Registry",
  name: "Interstitial Ad General Specifications",
  version: "1.0.0",
  type: "UI_Specification",
  status: "active",
  meta: {
    durationSeconds: 30,
    skipThresholdSeconds: 15,
    reviveZoneId: "13",
    reviveId: "fe1f19a638c05881542e31deb5ef01ad",
    scenery: {
      foreground: "Pepperoni & vegetable pizza on a white ceramic plate on a wooden table",
      backgroundHorizon: "Computers and arcade monitors with players playing retro arcade games",
    },
    styling: {
      advertisementContainer: "#Advertisement { display: block; text-align: center; vertical-align: center; }",
    },
  },
};

export default AdsInterstitialGeneralRegistry;
