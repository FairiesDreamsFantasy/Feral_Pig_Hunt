// System/UI/Play_Area/Index/index.tsx
// Master Play Area Coordinator.
// Automatically routes:
// 1. Mobile phones held in portrait orientation -> PortraitOrientationPlayArea
// 2. Tablets held in portrait orientation -> PortraitOrientation4Tablets (with 20% side bezels, pizza bot, new tree)
// 3. Desktops, laptops, and landscape screens -> LandscapePlayArea (strictly preserved and unaltered)
import React, { useState, useEffect } from 'react';
import { evaluateDeviceOrientationMode, DeviceOrientationMode } from './General/index.tsx';
import { PlayArea as LandscapePlayArea } from '../index.tsx';
import { PortraitOrientationPlayArea } from '../Portrait_Orientation_4_Mobile_Phones/index.tsx';
import { PortraitOrientation4Tablets } from '../Portrait_Orientation_4_Tablets/index.tsx';

export interface PlayAreaIndexProps {
  onReturnToTitle: () => void;
  onPlayAgain?: () => void;
  apiKey: string;
  model: string;
}

export const PlayAreaIndex: React.FC<PlayAreaIndexProps> = ({
  onReturnToTitle,
  onPlayAgain,
  apiKey,
  model,
}) => {
  const [orientationMode, setOrientationMode] = useState<DeviceOrientationMode>(() => {
    return evaluateDeviceOrientationMode().mode;
  });

  useEffect(() => {
    const handleResize = () => {
      const evaluation = evaluateDeviceOrientationMode();
      setOrientationMode(evaluation.mode);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // For tablets held in portrait view: Render 20% side bezels (Robot with pepperoni pizza, newly planted tree) with dual input
  if (orientationMode === 'PORTRAIT_TABLET') {
    return (
      <PortraitOrientation4Tablets
        onReturnToTitle={onReturnToTitle}
        onPlayAgain={onPlayAgain}
        apiKey={apiKey}
        model={model}
      />
    );
  }

  // For mobile phones held in portrait view: Render vertical arcade screen with the 4 tactile touch buttons below
  if (orientationMode === 'PORTRAIT_MOBILE') {
    return (
      <PortraitOrientationPlayArea
        onReturnToTitle={onReturnToTitle}
        onPlayAgain={onPlayAgain}
        apiKey={apiKey}
        model={model}
      />
    );
  }

  // For desktop computers, laptops, and landscape play: The landscape play area design remains completely unaltered
  return (
    <LandscapePlayArea
      onReturnToTitle={onReturnToTitle}
      onPlayAgain={onPlayAgain}
      apiKey={apiKey}
      model={model}
    />
  );
};

export default PlayAreaIndex;
