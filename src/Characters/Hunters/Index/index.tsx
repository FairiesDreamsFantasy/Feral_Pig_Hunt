/**
 * src/Characters/Hunters/Index/index.tsx
 * Character profile index, damage parameters, and status indices for the Hunters and Hog Assassin submodules.
 */

export interface HunterProfile {
  id: string;
  name: string;
  primaryWeapon: string;
  baseLaserDamage: number;
  firingRateCooldown: number; // in frames
  movementSpeed: number;
}

export const HUNTER_REGISTRY_PROFILES: Record<string, HunterProfile> = {
  HOG_ASSASSIN: {
    id: 'hog_assassin',
    name: 'Hog Assassin Drone',
    primaryWeapon: 'Dual TMDS Coherent Pulsed Laser',
    baseLaserDamage: 1,
    firingRateCooldown: 12,
    movementSpeed: 5.5
  },
  SNAID_SOLDIER: {
    id: 'snaid_soldier',
    name: 'Snaid Cyber Soldier',
    primaryWeapon: 'Sub-Relativistic Proton Smasher',
    baseLaserDamage: 2,
    firingRateCooldown: 24,
    movementSpeed: 4.2
  }
};

export function getHunterProfile(id: string): HunterProfile | null {
  return HUNTER_REGISTRY_PROFILES[id] || null;
}

export default {
  profiles: HUNTER_REGISTRY_PROFILES,
  getHunterProfile
};
