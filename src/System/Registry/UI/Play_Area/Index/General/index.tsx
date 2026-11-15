// System/Registry/UI/Play_Area/Index/General/index.tsx
// Registry entry for Play Area Index general specifications.

export const PlayAreaIndexGeneralRegistry = {
  id: "Play_Area_Index_General",
  name: "Play Area Index General Specifications",
  version: "1.0.0",
  type: "UI_Specification",
  status: "active",
  meta: {
    modes: ["PORTRAIT_MOBILE", "LANDSCAPE_STANDARD"],
    orientationDetection: "Dynamic Window Aspect Ratio + Touch Capability Evaluation",
    isolationGuarantee: "Landscape play area design is strictly preserved and unaltered",
  },
};
export default PlayAreaIndexGeneralRegistry;
