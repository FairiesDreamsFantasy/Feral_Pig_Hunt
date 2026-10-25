// System/Registry/Keyboards_and_Controllers/index.tsx
// Central aggregator for Keyboards and Controllers registries.
export * as Touchscreen from './Touchscreen/index.tsx';
import { TouchscreenMasterRegistry } from './Touchscreen/index.tsx';

export const KEYBOARDS_AND_CONTROLLERS_REGISTRY_COLLECTION = {
  "Keyboards_and_Controllers/Touchscreen/": TouchscreenMasterRegistry,
};

export default KEYBOARDS_AND_CONTROLLERS_REGISTRY_COLLECTION;
