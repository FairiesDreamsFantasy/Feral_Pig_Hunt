/**
 * System/Registry/AI/External/Gemini/Drift_Guard/General
 * Metadata definitions and node descriptor for External Gemini Drift_Guard.
 */

import { RegistryNode } from '../../../../../General/index.tsx';

export const GEMINI_DRIFT_GUARD_REGISTRY_NODE: RegistryNode = {
  path: "AI/External/Gemini/Drift_Guard/",
  description: "External generative payload drift auditor, schema enforcement engine, and Drifts_Found telemetry repository for Google Gemini Developer review.",
  status: "active",
  meta: {
    engine: "GeminiDriftGuard",
    storageChannel: "Drifts_Found/",
    keySecurity: "No raw keys stored or transmitted; strict cryptographic token audit only",
    driftCategories: [
      "SCHEMA_DRIFT",
      "LATENCY_DRIFT",
      "RATE_LIMIT_ANOMALY",
      "PARAMETER_OUT_OF_BOUNDS",
      "EMPTY_PAYLOAD",
      "AUTH_FAILURE_DRIFT",
      "NETWORK_INSTABILITY",
    ],
    reviewPolicy: "Mandatory human review for flagged drift anomalies",
  },
};

export default GEMINI_DRIFT_GUARD_REGISTRY_NODE;
