/**
 * System/Registry/UI/Insert_AI/General
 * Registry descriptor node and schema definition for the Insert_AI UI modal.
 */

import { RegistryNode } from '../../../General/index.tsx';

export const INSERT_AI_REGISTRY_NODE: RegistryNode = {
  path: "UI/Modal/Insert_AI/",
  description: "User modal interface for Google Gemini API key entry, model selection, plan tier toggling, and live latency diagnostics.",
  status: "active",
  meta: {
    component: "InsertAIGeminiModal",
    route: "Modal/Insert_AI/Gemini",
    supportedTiers: ["free", "paid"],
    validationStandard: "Google AI Studio 39-character key format",
    features: ["tier-toggle", "latency-benchmark", "key-audit", "structured-json"],
  },
};

export default INSERT_AI_REGISTRY_NODE;
