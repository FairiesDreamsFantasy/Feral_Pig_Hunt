/**
 * System/Engine/DRM-Free/LBDCD/PS2 Module
 * Nostalgic PS/2 keyboard/mouse physical pin signaling (data-line pulses, clock-line pulses).
 */

export interface PS2DataPacket {
  clockLinePulse: boolean;
  dataLinePulse: boolean;
  scanCodeByte: number; // 8-bit scan code
}

/**
 * Encodes scan code into standard PS/2 keyboard protocol frames (1 start bit, 8 data bits, 1 parity bit, 1 stop bit).
 */
export function encodePS2Frame(scanCode: number): number[] {
  const frame: number[] = [];
  frame.push(0); // Start bit (0)
  
  let parity = 1;
  for (let i = 0; i < 8; i++) {
    const bit = (scanCode >> i) & 1;
    frame.push(bit);
    parity ^= bit;
  }
  
  frame.push(parity); // Parity bit
  frame.push(1);      // Stop bit (1)
  
  return frame;
}

export default {
  encodePS2Frame,
};
