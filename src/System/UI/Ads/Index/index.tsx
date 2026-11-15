// System/UI/Ads/Index/index.tsx
// Master Ad Subsystem Coordinator.
// Connects and routes interstitial ad displays for Start Game and Play Again events.
import React from 'react';
import { InterstitialAd } from '../Interstitial/index.tsx';
import { AdSessionReason } from './General/index.tsx';

export interface AdSystemCoordinatorProps {
  onAdComplete: () => void;
  reason?: AdSessionReason;
}

export const AdSystemCoordinator: React.FC<AdSystemCoordinatorProps> = ({
  onAdComplete,
  reason = 'START_GAME',
}) => {
  return (
    <InterstitialAd
      onAdComplete={onAdComplete}
      reason={reason}
    />
  );
};

export default AdSystemCoordinator;
export * from './General/index.tsx';
