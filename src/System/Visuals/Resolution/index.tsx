/**
 * System/Visuals/Resolution Module
 * Comprehensive resolution profile mapping, width/height definitions, aspect ratios, and scaling matrices.
 */

export interface ResolutionProfile {
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
}

export const RESOLUTION_PROFILES: Record<string, ResolutionProfile> = {
  ULTRA_LOW: {
    name: 'Ultra-Low',
    width: 160,
    height: 120,
    aspectRatio: '4:3',
    description: 'Ultra-Low Retro CGA visual boundary'
  },
  VERY_LOW: {
    name: 'Very-Low',
    width: 320,
    height: 240,
    aspectRatio: '4:3',
    description: 'Very-Low standard retro visual canvas'
  },
  LOW: {
    name: 'Low',
    width: 480,
    height: 360,
    aspectRatio: '4:3',
    description: 'Low fidelity gaming boundary'
  },
  SD: {
    name: 'SD',
    width: 640,
    height: 480,
    aspectRatio: '4:3',
    description: 'Standard Definition VGA canvas'
  },
  MEDIUM_LOW: {
    name: 'Medium-Low',
    width: 800,
    height: 600,
    aspectRatio: '4:3',
    description: 'Medium-Low SVGA retro rendering'
  },
  MEDIUM: {
    name: 'Medium',
    width: 1024,
    height: 768,
    aspectRatio: '4:3',
    description: 'Medium fidelity XGA canvas'
  },
  MEDIUM_HIGH: {
    name: 'Medium-High',
    width: 1280,
    height: 960,
    aspectRatio: '4:3',
    description: 'Medium-High visual rendering profile'
  },
  HIGH: {
    name: 'High',
    width: 1440,
    height: 1080,
    aspectRatio: '4:3',
    description: 'High Definition visual canvas'
  },
  VERY_HIGH: {
    name: 'Very-High',
    width: 1600,
    height: 1200,
    aspectRatio: '4:3',
    description: 'UXGA High visual boundary'
  },
  ULTRA_HIGH: {
    name: 'Ultra-High',
    width: 2048,
    height: 1536,
    aspectRatio: '4:3',
    description: 'QXGA Ultra-High Definition'
  },
  HD: {
    name: 'HD',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    description: 'High Definition wide aspect'
  },
  UHD: {
    name: 'UHD',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    description: 'Ultra High Definition 4K wide aspect'
  },
  '1K': {
    name: '1K',
    width: 1024,
    height: 1024,
    aspectRatio: '1:1',
    description: '1K Square Matrix aspect ratio'
  },
  '2K': {
    name: '2K',
    width: 2048,
    height: 2048,
    aspectRatio: '1:1',
    description: '2K Square Matrix aspect ratio'
  },
  '4K': {
    name: '4K',
    width: 4096,
    height: 4096,
    aspectRatio: '1:1',
    description: '4K Square Matrix aspect ratio'
  },
  '8K': {
    name: '8K',
    width: 8192,
    height: 8192,
    aspectRatio: '1:1',
    description: '8K Square Ultra-High Matrix'
  },
  '16K': {
    name: '16K',
    width: 16384,
    height: 16384,
    aspectRatio: '1:1',
    description: '16K Extreme Scale aspect'
  },
  '32K': {
    name: '32K',
    width: 32768,
    height: 32768,
    aspectRatio: '1:1',
    description: '32K Hyper-Scale canvas'
  },
  '64K': {
    name: '64K',
    width: 65536,
    height: 65536,
    aspectRatio: '1:1',
    description: '64K Ultra-Scale canvas'
  },
  '128K': {
    name: '128K',
    width: 131072,
    height: 131072,
    aspectRatio: '1:1',
    description: '128K Super-Scale canvas'
  },
  '256K': {
    name: '256K',
    width: 262144,
    height: 262144,
    aspectRatio: '1:1',
    description: '256K Quantum-Scale aspect'
  },
  '512K': {
    name: '512K',
    width: 524288,
    height: 524288,
    aspectRatio: '1:1',
    description: '512K Megapixel-Scale canvas'
  },
  '1024K': {
    name: '1024K',
    width: 1048576,
    height: 1048576,
    aspectRatio: '1:1',
    description: '1024K Gigapixel-Scale canvas'
  },
  '2048K': {
    name: '2048K',
    width: 2097152,
    height: 2097152,
    aspectRatio: '1:1',
    description: '2048K Terraspatial-Scale canvas'
  },
  '4096K': {
    name: '4096K',
    width: 4194304,
    height: 4194304,
    aspectRatio: '1:1',
    description: '4096K Cosmos-Scale canvas'
  },
  '8192K': {
    name: '8192K',
    width: 8388608,
    height: 8388608,
    aspectRatio: '1:1',
    description: '8192K Infinite-Matrix scale canvas'
  }
};

/**
 * Calculates scale multipliers to draw lower resolutions inside physical DOM containers.
 */
export function getScaleMultiplier(
  canvasW: number,
  canvasH: number,
  containerW: number,
  containerH: number
): number {
  return Math.min(containerW / canvasW, containerH / canvasH);
}

export default {
  RESOLUTION_PROFILES,
  getScaleMultiplier,
};
