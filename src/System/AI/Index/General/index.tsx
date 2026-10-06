/**
 * System/AI/Index/General
 * Index manifest, module status registry, and system coordination definitions for the AI subsystem.
 */

export interface AISubsystemDescriptor {
  name: string;
  category: 'IN_GAME_PERFORMANCE' | 'EXTERNAL_GENERATIVE_MODELS';
  path: string;
  status: 'OPERATIONAL' | 'CONFIGURABLE';
  description: string;
}

export const AI_SUBSYSTEM_MANIFEST: Record<string, AISubsystemDescriptor> = {
  inGame: {
    name: 'Dynamic Cybernetic Performance-Balanced Orchestrator (DCP-BO)',
    category: 'IN_GAME_PERFORMANCE',
    path: 'System/AI/In-Game/',
    status: 'OPERATIONAL',
    description: 'PID-based real-time player performance tracking, tension computation, and intercept vector targeting.',
  },
  externalGemini: {
    name: 'Google Gemini AI Integration',
    category: 'EXTERNAL_GENERATIVE_MODELS',
    path: 'System/AI/External/Gemini/',
    status: 'CONFIGURABLE',
    description: 'Cloud and browser SDK structured generative waves, battle cries, and dive aggression seeds.',
  },
};

export const AIIndexGeneral = {
  version: '0.5',
  subsystemsCount: 2,
  operationalState: 'NOMINAL',
  manifest: AI_SUBSYSTEM_MANIFEST,
};

export default AIIndexGeneral;
