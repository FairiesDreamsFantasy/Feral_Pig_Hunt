/**
 * System/Engine/Languages/XML Module
 * XML serializations for configuration, state, and properties of the pig trajectory engines.
 */

export const XML_BINDING = {
  getTemplate: (pigCount: number) => `<?xml version="1.0" encoding="UTF-8"?>
<EngineSettings>
  <PigCount>${pigCount}</PigCount>
  <PhysicsEnabled>true</PhysicsEnabled>
  <TuskLengthScale>1.4</TuskLengthScale>
</EngineSettings>`
};

export default XML_BINDING;
