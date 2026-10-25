/**
 * System/Engine/DRM-Free/LBDCD/USB Module
 * Simulated USB HID controller endpoints, packet synchronization tokens, and serial peripheral mappings.
 */

export interface USBHIDPacket {
  reportId: number;
  buttons: number; // Bitfield mapping for retro buttons
  axisX: number;   // -127 to 127
  axisY: number;   // -127 to 127
}

/**
 * Parses a raw USB HID buffer into axis and button inputs.
 */
export function parseUSBHIDBuffer(buffer: ArrayBuffer): USBHIDPacket {
  const view = new DataView(buffer);
  if (view.byteLength < 4) {
    return { reportId: 0, buttons: 0, axisX: 0, axisY: 0 };
  }
  return {
    reportId: view.getUint8(0),
    buttons: view.getUint8(1),
    axisX: view.getInt8(2),
    axisY: view.getInt8(3)
  };
}

export default {
  parseUSBHIDBuffer,
};
