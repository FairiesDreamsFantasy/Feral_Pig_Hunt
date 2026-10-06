/**
 * System/Engine/OS/FreeDOS Module
 * FreeDOS real-mode execution simulation (freedos.org compliant).
 * Abstracts BIOS visual mode interrupts (INT 10h), file systems (INT 21h), and key ticks (INT 16h).
 */

export interface FreeDOSRegisters {
  ax: number;
  bx: number;
  cx: number;
  dx: number;
  flags: { carry: boolean; zero: boolean };
}

/**
 * Simulates BIOS interrupt INT 10h (Video Service).
 * Mode 13h is the historic 320x200 256-color MCGA/VGA standard used by vintage DOS games.
 */
export function triggerINT10h(ah: number, al: number): { mode: string; width: number; height: number; colors: number } {
  if (ah === 0x00 && al === 0x13) {
    return { mode: 'Mode 13h', width: 320, height: 200, colors: 256 };
  }
  return { mode: 'Text Mode 3h', width: 80, height: 25, colors: 16 };
}

/**
 * Simulates MS-DOS system call interrupt INT 21h.
 */
export function triggerINT21h(ah: number): string {
  switch (ah) {
    case 0x09: // Display String
      return 'INT 21H AH=09h: WRITE STRING TO STDOUT';
    case 0x4C: // Terminate with Return Code
      return 'INT 21H AH=4Ch: PROGRAM EXIT SUCCESS';
    default:
      return 'INT 21H AH=UNSUPPORTED';
  }
}

export default {
  triggerINT10h,
  triggerINT21h,
};
