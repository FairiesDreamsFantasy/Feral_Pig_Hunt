/**
 * System/Registry/AI/External/Gemini/General
 * Registry descriptor node and metadata for external Google Gemini AI integration.
 */

import { RegistryNode } from '../../../../General/index.tsx';

export const GEMINI_EXTERNAL_AI_REGISTRY_NODE: RegistryNode = {
  path: "AI/External/Gemini/",
  description: "External Google Gemini generative model integration for dynamic Galaga wave formations, diving aggression vectors, and custom arcade pig battle cries.",
  status: "active",
  meta: {
    provider: "Google DeepMind / Google AI Studio",
    models: [
      "gemini-1.5-flash (default)",
      "gemini-2.0-flash",
      "gemini-2.5-flash",
      "gemini-flash-latest",
      "gemini-1.5-pro",
      "gemini-2.5-pro",
      "gemini-3.1-pro-preview",
    ],
    sdk: "@google/genai",
    outputFormat: "Structured JSON Schema (responseSchema)",
    watchdogTimeoutMs: 8000,
    dualExecution: "Server proxy route with browser SDK fallback",
  },
};

export default GEMINI_EXTERNAL_AI_REGISTRY_NODE;
