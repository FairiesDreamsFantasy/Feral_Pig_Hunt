import React from 'react';
import { BUILD_VERSION, BUILD_DATE } from '../../../Registry/General/index.tsx';

export const VersionBadge: React.FC = () => {
  return (
    <div
      id="Version_Badge"
      className="inline-flex flex-col items-center justify-center border-2 border-[#ffd700] bg-[#86efac] text-black font-mono font-bold text-xs px-4 py-2 shadow-[0_0_12px_rgba(255,215,0,0.4)]"
      style={{ borderRadius: '4px' }}
    >
      <div className="uppercase tracking-wide text-[10px] text-black/75">Arcade Build</div>
      <div className="text-sm font-black text-black">{BUILD_VERSION}</div>
      <div className="text-[9px] font-semibold text-black/90 mt-0.5">{BUILD_DATE}</div>
    </div>
  );
};

export default VersionBadge;
