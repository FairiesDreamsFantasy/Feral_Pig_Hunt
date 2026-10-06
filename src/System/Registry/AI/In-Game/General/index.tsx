/**
 * System/Registry/AI/In-Game/General
 * Registry descriptor node and metadata for the in-game DCP-BO cybernetic performance orchestrator.
 */

import { RegistryNode } from '../../../General/index.tsx';

export const IN_GAME_AI_REGISTRY_NODE: RegistryNode = {
  path: "AI/In-Game/",
  description: "Closed-loop PID-inspired Dynamic Cybernetic Performance-Balanced Orchestrator (DCP-BO) computing real-time tension, dive aggression, and predictive flight paths.",
  status: "active",
  meta: {
    orchestrator: "DCP-BO",
    metrics: ["Player Performance Index (PPI)", "Dynamic Tension Ratio (0.5 to 3.0)", "Predictive Intercept Vectors"],
    tacticalFormations: ["standard_grid", "v_formation", "honeycomb", "delta_wing"],
    pigArchetypes: ["Tusk_Height", "Snout_Length", "Size", "Spotted_Ratio"],
  },
};

export default IN_GAME_AI_REGISTRY_NODE;
