/**
 * System/Engine/DRM-Free/LBDCD/index.tsx
 * Aggregator module for the Low-Bandwidth Digital Content Delivery (LBDCD) system.
 */

import GeneralModule from './General/index.tsx';
import AccessibilityModule from './Accessibility_First/index.tsx';
import AnalogModule from './Analog/index.tsx';
import HDMIModule from './HDMI/index.tsx';
import KeyboardModule from './Keyboard_First/index.tsx';
import USBModule from './USB/index.tsx';
import PS2Module from './PS2/index.tsx';
import COMModule from './COM/index.tsx';
import OfflineModule from './Works_Offline/index.tsx';
import LowRAMModule from './Low-RAM/index.tsx';

export const General = GeneralModule;
export const Accessibility_First = AccessibilityModule;
export const Analog = AnalogModule;
export const HDMI = HDMIModule;
export const Keyboard_First = KeyboardModule;
export const USB = USBModule;
export const PS2 = PS2Module;
export const COM = COMModule;
export const Works_Offline = OfflineModule;
export const Low_RAM = LowRAMModule;

export default {
  General,
  Accessibility_First,
  Analog,
  HDMI,
  Keyboard_First,
  USB,
  PS2,
  COM,
  Works_Offline,
  Low_RAM,
};
