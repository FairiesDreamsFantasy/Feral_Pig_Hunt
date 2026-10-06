/**
 * Hunters General Specification
 */
export interface HunterConfig {
  name: string;
  speed: number;
  laserUnitLength: number;
  chassisColor: string;
  coreGlowColor: string;
}

export const HogAssassinConfig: HunterConfig = {
  name: 'Hog Assassin Robotic Platform',
  speed: 7.5,
  laserUnitLength: 12,
  chassisColor: '#4a4a6a',
  coreGlowColor: '#00f0ff',
};

export default HogAssassinConfig;
