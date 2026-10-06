export interface RegistryNode {
  path: string;
  description: string;
  status: 'active' | 'inactive';
  meta?: Record<string, any>;
}

export const BUILD_VERSION = "0.5";
export const BUILD_DATE = "2026-10-06";

export const MASTER_REGISTRY: Record<string, RegistryNode> = {
  "UI/": { path: "UI/", description: "Root UI element manager", status: "active" },
  "UI/Landing_Page/": { path: "UI/Landing_Page/", description: "Main intro landing stage", status: "active" },
  "UI/Landing_Page/Version/": { path: "UI/Landing_Page/Version/", description: "Gold-bordered version badge", status: "active", meta: { version: BUILD_VERSION, buildDate: BUILD_DATE } },
  "UI/Play_Area/": { path: "UI/Play_Area/", description: "Action gameplay viewport wrapper", status: "active" },
  "UI/Play_Area/Main/Game_View/": { path: "UI/Play_Area/Main/Game_View/", description: "Canvas holding aria-label of 'Feral Pig Hunt Game View'", status: "active" },
  "Engine/": { path: "Engine/", description: "Fixed-shooter physics and collision detection", status: "active" },
  "Engine/RAM_Disk/": {
    path: "Engine/RAM_Disk/",
    description: "In-Memory RAM Disk Block Storage Driver for real computers & PWA caching",
    status: "active",
    meta: { sectorSize: 4096, totalCapacityMB: 16, pwaReady: true, clientSideExecution: true }
  },
  "Keyboard_and_Controllers/": { path: "Keyboard_and_Controllers/", description: "Mass-spring-damper keyboard mechanics", status: "active" },
  "Visuals/": { path: "Visuals/", description: "Relativistic starfield aberration and Doppler shift", status: "active" },
  "Sound/": { path: "Sound/", description: "Multi-bitrate oscillator synthesis engine", status: "active" },
  "UI/Modal/Insert_AI/": { path: "UI/Modal/Insert_AI/", description: "User modal interface for Google Gemini API key entry, model selection, plan tier toggling, and live latency diagnostics", status: "active" },
  "AI/": { path: "AI/", description: "Tactical algorithms and Gemini AI seed generator", status: "active" },
  "AI/Index/": { path: "AI/Index/", description: "Master coordinator and aggregator node for AI Subsystem Registry", status: "active" },
  "AI/External/Gemini/": { path: "AI/External/Gemini/", description: "External Google Gemini generative model integration", status: "active" },
  "AI/In-Game/": { path: "AI/In-Game/", description: "Closed-loop PID-inspired Dynamic Cybernetic Performance-Balanced Orchestrator (DCP-BO)", status: "active" },
};

export function lookupRegistry(p: string): RegistryNode | undefined {
  return MASTER_REGISTRY[p];
}

export default { MASTER_REGISTRY, BUILD_VERSION, BUILD_DATE, lookupRegistry };
