/**
 * System/Engine/DRM-Free/LBDCD/COM Module
 * Serial COM interface (RS-232, 9-pin/25-pin D-Sub configurations), baud-rate timers, and parity models.
 */

export interface COMSerialSettings {
  baudRate: 9600 | 19200 | 38400 | 57600 | 115200;
  dataBits: 7 | 8;
  parity: 'none' | 'odd' | 'even';
  stopBits: 1 | 2;
}

/**
 * Creates serial data transmission frame headers using standard serial port rates.
 */
export function formatCOMSerialPayload(data: string, settings: COMSerialSettings): string {
  return `[COM_SERIAL_${settings.baudRate}_${settings.dataBits}${settings.parity[0].toUpperCase()}${settings.stopBits}] ${data}`;
}

export default {
  formatCOMSerialPayload,
};
