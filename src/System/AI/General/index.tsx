export type GeminiTier = 'free' | 'paid';

export interface GeminiModelOption {
  id: string;
  name: string;
  recommended: boolean;
  tier: GeminiTier;
  rpmLimit: number;
  contextTokens: string;
  description: string;
}

export const AVAILABLE_GEMINI_MODELS: GeminiModelOption[] = [
  // Free Tier Models (High rate limits, zero credit card requirement)
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash (Universal Compatibility - Default)',
    recommended: true,
    tier: 'free',
    rpmLimit: 15,
    contextTokens: '1M tokens',
    description: 'Universal compatibility across free Google AI Studio keys and projects. Broadest domain and quota support.',
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash (Next-Gen High Speed)',
    recommended: false,
    tier: 'free',
    rpmLimit: 15,
    contextTokens: '1M tokens',
    description: 'High-speed 2.0 generation with native multimodal performance and low latency.',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash (Thinking Flash Architecture)',
    recommended: false,
    tier: 'free',
    rpmLimit: 15,
    contextTokens: '1M tokens',
    description: 'Sub-second real-time arcade generation. Requires projects with 2.5 access enabled.',
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini Flash (Latest Production Alias)',
    recommended: false,
    tier: 'free',
    rpmLimit: 15,
    contextTokens: '1M tokens',
    description: 'Dynamic alias tracking Google DeepMind latest production Flash checkpoint.',
  },

  // Paid Tier Models (Requires billing-enabled Google Cloud project)
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro (Frontier 1.5 Architecture)',
    recommended: false,
    tier: 'paid',
    rpmLimit: 60,
    contextTokens: '2M tokens',
    description: 'Reliable high-precision reasoning across stable 1.5 architecture with expansive context.',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro (Deep Tactical Analysis)',
    recommended: true,
    tier: 'paid',
    rpmLimit: 60,
    contextTokens: '2M tokens',
    description: 'Frontier reasoning engine for complex spatial formations and high-entropy pig quotes.',
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro Preview (Advanced Frontier)',
    recommended: false,
    tier: 'paid',
    rpmLimit: 60,
    contextTokens: '2M tokens',
    description: 'Experimental next-generation reasoning model for ultra-deep tactical computation.',
  },
];

export interface WaveTacticalSeed {
  seedNumber: number;
  waveSpeedMultiplier: number;
  diveAggression: number;
  spottedRatio: number;
  formationPattern: 'standard_grid' | 'v_formation' | 'honeycomb' | 'delta_wing';
  pigQuotes: string[];
}

export const DEFAULT_TACTICAL_SEED: WaveTacticalSeed = {
  seedNumber: 42,
  waveSpeedMultiplier: 1.0,
  diveAggression: 1.0,
  spottedRatio: 0.25,
  formationPattern: 'standard_grid',
  pigQuotes: [
    'Oink! Invasive brigade advancing!',
    'Protect the oak acorn cache!',
    'Charge through the southern perimeter!'
  ],
};

export default DEFAULT_TACTICAL_SEED;
