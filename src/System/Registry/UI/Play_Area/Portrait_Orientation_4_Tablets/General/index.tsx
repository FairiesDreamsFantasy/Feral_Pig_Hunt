// System/Registry/UI/Play_Area/Portrait_Orientation_4_Tablets/General/index.tsx
// Registry entry for Tablet Portrait Play Area general specifications.

export const TabletPlayAreaGeneralRegistry = {
  id: "Tablet_Play_Area_General",
  name: "Tablet Play Area General Specifications",
  version: "1.0.0",
  type: "UI_Specification",
  status: "active",
  meta: {
    targetDevices: ["Tablets in Portrait Orientation (e.g. iPad, Galaxy Tab, Pixel Tablet)"],
    bezelConfiguration: "Exact 20% Left Bezel + 60% Centered Arcade Screen + 20% Right Bezel",
    leftBezelArt: "Robot carrying plate of pepperoni pizza on green horizon and starry sky",
    rightBezelArt: "Newly planted sapling tree with supportive wooden stake on green horizon and starry sky",
    clutterFree: "Zero coin slots, zero mechanical speakers",
    dualInputSupported: true,
    keyboardDetection: "Automatic on physical keystroke",
    touchDeckSupported: true,
    audioAmplification: "+20% Master Volume Gain Applied",
  },
};

export default TabletPlayAreaGeneralRegistry;
