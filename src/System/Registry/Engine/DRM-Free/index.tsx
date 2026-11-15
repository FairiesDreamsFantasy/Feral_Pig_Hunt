/**
 * System/Registry/Engine/DRM-Free/index.tsx
 * Combines DRM-Free registries: General, LBDCD, and Bandwidth_Booster.
 */

import GeneralModule from './General/index.tsx';
import LBDCDModule from './LBDCD/index.tsx';
import BoosterModule from './Bandwidth_Booster/index.tsx';

export const General = GeneralModule;
export const LBDCD = LBDCDModule;
export const Bandwidth_Booster = BoosterModule;

export default {
  General,
  LBDCD,
  Bandwidth_Booster,
};
