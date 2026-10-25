// System/UI/Ads/Interstitial/General/index.tsx
// Scientific timing models, Revive Adserver configurations, and artistic background vector scenes
// featuring a plate with pepperoni and vegetable pizza on a wooden table, with arcade computers and players in the background.

export const INTERSTITIAL_AD_CONFIG = {
  TOTAL_DURATION_SECONDS: 30,
  SKIP_THRESHOLD_SECONDS: 15,
  REVIVE_ZONE_ID: "13",
  REVIVE_ID: "fe1f19a638c05881542e31deb5ef01ad",
  REVIVE_ASYNC_SRC: "//ads.fairiesdreamsfantasy.com/adserver/www/delivery/asyncjs.php",
};

/**
 * Validates remaining time and calculates skip eligibility mathematically.
 */
export const calculateSkipEligibility = (elapsedSeconds: number, skipThreshold = 15): boolean => {
  return elapsedSeconds >= skipThreshold;
};
