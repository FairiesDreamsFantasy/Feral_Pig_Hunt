/**
 * System/Engine/OS/Linux Module Index
 * Aggregates Debian, Ubuntu, Xubuntu, Kubuntu, Lubuntu, and Arch Linux desktop configuration profiles.
 */

import DebianModule from './Debian/index.tsx';
import UbuntuModule from './Debian/Ubuntu/index.tsx';
import XubuntuModule from './Debian/Xubuntu/index.tsx';
import KubuntuModule from './Debian/Kubuntu/index.tsx';
import LubuntuModule from './Debian/Lubuntu/index.tsx';
import ArchModule from './Arch/index.tsx';

export const Debian = DebianModule;
export const Ubuntu = UbuntuModule;
export const Xubuntu = XubuntuModule;
export const Kubuntu = KubuntuModule;
export const Lubuntu = LubuntuModule;
export const Arch = ArchModule;

export default {
  Debian,
  Ubuntu,
  Xubuntu,
  Kubuntu,
  Lubuntu,
  Arch,
};
