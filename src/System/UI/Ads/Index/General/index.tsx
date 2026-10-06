// System/UI/Ads/Index/General/index.tsx
// Ad Coordinator General Types and Evaluation Logic.

export type AdSessionReason = 'START_GAME' | 'PLAY_AGAIN';

export interface AdCoordinatorState {
  isActive: boolean;
  reason: AdSessionReason;
}
