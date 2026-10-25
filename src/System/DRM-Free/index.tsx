/**
 * System/DRM-Free root index.tsx
 * Combines LBDCD (Low-Bandwidth Digital Content Delivery) and Bandwidth_Booster subsystems.
 */

import LBDCDModule from '../Engine/DRM-Free/LBDCD/index.tsx';
import BoosterModule from './Bandwidth_Booster/index.tsx';

export const LBDCD = LBDCDModule;
export const Bandwidth_Booster = BoosterModule;

export default {
  LBDCD,
  Bandwidth_Booster,
};
