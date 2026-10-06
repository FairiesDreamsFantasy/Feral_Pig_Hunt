/**
 * System/Engine/DRM-Free/LBDCD/Analog Module
 * Combines analog outputs: VGA, 3.5MM, Composite AV, and S-Video.
 */

import VGAModule from './VGA/index.tsx';
import TRSModule from './3.5MM/index.tsx';
import AVCompositeModule from './AV/index.tsx';
import SVideoModule from './S-Video/index.tsx';

export const VGA = VGAModule;
export const TRS35MM = TRSModule;
export const AV = AVCompositeModule;
export const SVideo = SVideoModule;

export default {
  VGA,
  TRS35MM,
  AV,
  SVideo,
};
