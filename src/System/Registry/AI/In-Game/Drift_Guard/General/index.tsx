/**
 * System/Registry/AI/In-Game/Drift_Guard/General
 * Metadata definitions and node descriptor for In-Game AI Drift_Guard.
 */

import { RegistryNode } from '../../../../General/index.tsx';

export const IN_GAME_DRIFT_GUARD_REGISTRY_NODE: RegistryNode = {
  path: "AI/In-Game/Drift_Guard/",
  description: "Closed-loop tactical parameter, tension score [0.6, 2.8], and telemetry drift detection ensuring numerical stability.",
  status: "active",
  meta: {
    engine: "InGameDriftGuard",
    driftThresholds: "DEFAULT_INGAME_DRIFT_THRESHOLDS",
    enforcement: "Strict clamping & anomaly telemetry recording",
  },
};

export default IN_GAME_DRIFT_GUARD_REGISTRY_NODE;
