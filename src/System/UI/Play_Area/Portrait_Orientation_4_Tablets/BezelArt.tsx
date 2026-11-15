// System/UI/Play_Area/Portrait_Orientation_4_Tablets/BezelArt.tsx
// Artistic vector representations for the tablet portrait side bezels:
// Left: Robot carrying a plate of pepperoni pizza.
// Right: Newly planted sapling tree with supportive wooden stake.
// Background: Green horizon landscape and celestial starry sky. Free of coin slots and speaker clutter.
import React from 'react';
import { BackdropStar } from './General/index.tsx';

interface SideBezelProps {
  stars: BackdropStar[];
}

/**
 * Left Bezel: Starry sky, green horizon, and a friendly retro robot carrying a plate of pepperoni pizza.
 */
export const LeftSideRobotBezel: React.FC<SideBezelProps> = ({ stars }) => {
  return (
    <aside
      id="Tablet_Bezel_Left_Robot_Pizza"
      aria-label="Artistic Bezel: Robot Serving Pepperoni Pizza"
      className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#020208] via-[#05051a] to-[#0a1a0f] flex flex-col justify-end pointer-events-none border-r border-[#00f0ff]/20"
    >
      {/* Sky Starfield */}
      <div className="absolute inset-0 z-0">
        {stars.map((star, idx) => (
          <div
            key={`left-star-${idx}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.twinkleDelay}s`,
              animationDuration: '2.5s',
            }}
          />
        ))}
      </div>

      {/* Lush Green Horizon along the base */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0e3a15] via-[#1a5522] to-transparent z-10">
        {/* Soft rolling green hill profile */}
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-16 absolute bottom-0">
          <path d="M0,40 Q50,15 100,35 T200,20 L200,60 L0,60 Z" fill="#144d1c" opacity="0.9" />
          <path d="M0,48 Q60,30 130,45 T200,32 L200,60 L0,60 Z" fill="#1b6325" />
        </svg>
      </div>

      {/* The Crafted Retro Robot Carrying Pepperoni Pizza */}
      <div className="relative z-20 flex flex-col items-center mb-6 px-2">
        <svg
          viewBox="0 0 160 220"
          className="w-full max-w-[170px] drop-shadow-[0_4px_16px_rgba(0,240,255,0.35)]"
        >
          {/* Robot Antenna with pulsating cyan beacon */}
          <line x1="80" y1="35" x2="80" y2="15" stroke="#718096" strokeWidth="3" strokeLinecap="round" />
          <circle cx="80" cy="12" r="5" fill="#00f0ff" className="animate-ping" />
          <circle cx="80" cy="12" r="4" fill="#00f0ff" />

          {/* Robot Head */}
          <rect x="52" y="32" width="56" height="42" rx="8" fill="#2d3748" stroke="#4a5568" strokeWidth="2" />
          {/* Robot Visor / Eyes */}
          <rect x="58" y="42" width="44" height="15" rx="3" fill="#0f172a" />
          <circle cx="70" cy="49" r="4" fill="#38bdf8" />
          <circle cx="90" cy="49" r="4" fill="#38bdf8" />
          {/* Friendly LED mouth */}
          <path d="M68,64 Q80,70 92,64" stroke="#38bdf8" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Robot Neck */}
          <rect x="74" y="74" width="12" height="6" fill="#4a5568" />

          {/* Robot Torso */}
          <rect x="46" y="80" width="68" height="60" rx="10" fill="#334155" stroke="#64748b" strokeWidth="2" />
          {/* Torso Chest Screen displaying heart/pulse */}
          <rect x="56" y="90" width="48" height="24" rx="4" fill="#0f172a" />
          <path d="M62,102 L70,102 L74,94 L78,110 L82,102 L98,102" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinejoin="round" />

          {/* Left Arm holding serving platter */}
          <path d="M46,92 Q28,105 45,125" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />
          {/* Right Arm holding serving platter */}
          <path d="M114,92 Q132,105 115,125" stroke="#64748b" strokeWidth="6" fill="none" strokeLinecap="round" />

          {/* Robot Hip & Legs */}
          <rect x="60" y="140" width="40" height="12" rx="3" fill="#1e293b" />
          <rect x="56" y="152" width="16" height="28" rx="4" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          <rect x="88" y="152" width="16" height="28" rx="4" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          {/* Foot stabilizers */}
          <ellipse cx="64" cy="182" rx="12" ry="5" fill="#475569" />
          <ellipse cx="96" cy="182" rx="12" ry="5" fill="#475569" />

          {/* Silver Serving Platter */}
          <ellipse cx="80" cy="126" rx="44" ry="10" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
          <ellipse cx="80" cy="125" rx="40" ry="8" fill="#e2e8f0" />

          {/* Hot Pepperoni Pizza */}
          {/* Golden Crust */}
          <ellipse cx="80" cy="122" rx="34" ry="7" fill="#d97706" />
          {/* Marinara Red Sauce */}
          <ellipse cx="80" cy="121" rx="31" ry="6" fill="#b91c1c" />
          {/* Melted Mozzarella Cheese */}
          <ellipse cx="80" cy="120.5" rx="28" ry="5.2" fill="#facc15" />

          {/* Pepperoni Slices */}
          <ellipse cx="66" cy="120" rx="4" ry="2" fill="#991b1b" stroke="#7f1d1d" strokeWidth="0.5" />
          <ellipse cx="76" cy="122" rx="4.5" ry="2.2" fill="#991b1b" stroke="#7f1d1d" strokeWidth="0.5" />
          <ellipse cx="86" cy="119" rx="4" ry="2" fill="#991b1b" stroke="#7f1d1d" strokeWidth="0.5" />
          <ellipse cx="94" cy="121" rx="3.5" ry="1.8" fill="#991b1b" stroke="#7f1d1d" strokeWidth="0.5" />
          <ellipse cx="80" cy="118" rx="3.5" ry="1.7" fill="#991b1b" stroke="#7f1d1d" strokeWidth="0.5" />

          {/* Steam Wafts rising from hot pizza */}
          <path d="M72,114 Q68,106 74,98" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M84,113 Q88,104 82,96" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>

        {/* Artistic Plaque Label */}
        <div className="mt-1 px-2 py-0.5 rounded bg-black/60 border border-[#00f0ff]/30 text-[9px] font-mono text-[#00f0ff] uppercase tracking-wider text-center">
          UNIT 7 // PIZZA BOT
        </div>
      </div>
    </aside>
  );
};

/**
 * Right Bezel: Starry sky, green horizon, and a serene newly planted tree with supportive wooden stake.
 */
export const RightSideTreeBezel: React.FC<SideBezelProps> = ({ stars }) => {
  return (
    <aside
      id="Tablet_Bezel_Right_New_Tree"
      aria-label="Artistic Bezel: Newly Planted Tree on Green Horizon"
      className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#020208] via-[#05051a] to-[#0a1a0f] flex flex-col justify-end pointer-events-none border-l border-[#00f0ff]/20"
    >
      {/* Sky Starfield */}
      <div className="absolute inset-0 z-0">
        {stars.map((star, idx) => (
          <div
            key={`right-star-${idx}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.twinkleDelay + 1.2}s`,
              animationDuration: '3s',
            }}
          />
        ))}
      </div>

      {/* Lush Green Horizon along the base */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0e3a15] via-[#1a5522] to-transparent z-10">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-16 absolute bottom-0">
          <path d="M0,25 Q70,40 140,18 T200,30 L200,60 L0,60 Z" fill="#144d1c" opacity="0.9" />
          <path d="M0,38 Q80,20 150,42 T200,35 L200,60 L0,60 Z" fill="#1b6325" />
        </svg>
      </div>

      {/* Newly Planted Tree with Sturdy Wooden Stake */}
      <div className="relative z-20 flex flex-col items-center mb-6 px-2">
        <svg
          viewBox="0 0 160 220"
          className="w-full max-w-[170px] drop-shadow-[0_4px_16px_rgba(74,222,128,0.35)]"
        >
          {/* Earthen Mulch Mound at Base */}
          <ellipse cx="80" cy="186" rx="42" ry="12" fill="#543821" />
          <ellipse cx="80" cy="184" rx="36" ry="9" fill="#714828" />
          <circle cx="65" cy="185" r="2.5" fill="#3d2614" />
          <circle cx="92" cy="184" r="2" fill="#3d2614" />
          <circle cx="75" cy="187" r="2" fill="#8c5832" />

          {/* Supportive Wooden Stake driven firmly into soil */}
          <line x1="68" y1="192" x2="68" y2="78" stroke="#854d0e" strokeWidth="5" strokeLinecap="round" />
          <line x1="66" y1="190" x2="66" y2="80" stroke="#a16207" strokeWidth="1.5" />

          {/* Main Tree Trunk (Slender Young Sapling) */}
          <path
            d="M80,184 Q82,145 78,110 Q83,75 80,45"
            stroke="#78350f"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />

          {/* Protective Twine / Ties binding sapling to the stake */}
          {/* Lower tie */}
          <rect x="65" y="148" width="18" height="4" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="0.8" />
          {/* Upper tie */}
          <rect x="65" y="102" width="17" height="4" rx="2" fill="#d97706" stroke="#92400e" strokeWidth="0.8" />

          {/* Primary Canopy Branches */}
          <path d="M79,98 Q65,85 52,80" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M79,90 Q95,78 108,72" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M80,68 Q68,55 58,48" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M80,60 Q92,50 102,42" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Flourishing Fresh Green Foliage Clusters */}
          {/* Cluster Left */}
          <circle cx="50" cy="76" r="16" fill="#15803d" />
          <circle cx="46" cy="72" r="13" fill="#22c55e" />
          <circle cx="56" cy="68" r="11" fill="#4ade80" />

          {/* Cluster Right */}
          <circle cx="110" cy="68" r="17" fill="#15803d" />
          <circle cx="114" cy="64" r="14" fill="#22c55e" />
          <circle cx="104" cy="58" r="12" fill="#4ade80" />

          {/* Cluster Crown Top */}
          <circle cx="80" cy="40" r="22" fill="#166534" />
          <circle cx="76" cy="35" r="19" fill="#22c55e" />
          <circle cx="85" cy="30" r="15" fill="#4ade80" />
          <circle cx="78" cy="24" r="10" fill="#86efac" />

          {/* Cluster Mid Center */}
          <circle cx="80" cy="65" r="14" fill="#22c55e" />
          <circle cx="74" cy="62" r="10" fill="#4ade80" />

          {/* Subtle Dewdrop / Sunlight Sparkle */}
          <circle cx="86" cy="22" r="2.5" fill="#ffffff" opacity="0.9" className="animate-pulse" />
          <circle cx="48" cy="65" r="1.8" fill="#ffffff" opacity="0.8" />
        </svg>

        {/* Artistic Plaque Label */}
        <div className="mt-1 px-2 py-0.5 rounded bg-black/60 border border-[#22c55e]/30 text-[9px] font-mono text-[#22c55e] uppercase tracking-wider text-center">
          EARTH SAPLING // GREEN HORIZON
        </div>
      </div>
    </aside>
  );
};
