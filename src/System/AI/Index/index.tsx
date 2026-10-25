/**
 * System/AI/Index
 * Master coordinator and aggregator for the AI Intelligence subsystem.
 */

export * from './General/index.tsx';
import { AIIndexGeneral, AI_SUBSYSTEM_MANIFEST } from './General/index.tsx';

export const AIIndex = {
  ...AIIndexGeneral,
  subsystems: AI_SUBSYSTEM_MANIFEST,
};

export default AIIndex;
