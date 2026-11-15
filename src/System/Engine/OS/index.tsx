/**
 * System/Engine/OS Subsystem index.tsx
 * Master operating system support mapping matrix, offering direct bindings for FreeDOS and Linux distros.
 */

import FreeDOSModule from './FreeDOS/index.tsx';
import LinuxModule from './Linux/index.tsx';

export const FreeDOS = FreeDOSModule;
export const Linux = LinuxModule;

export default {
  FreeDOS,
  Linux,
};
