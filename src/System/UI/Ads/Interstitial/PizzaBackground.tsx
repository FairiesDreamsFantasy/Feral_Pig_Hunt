// System/UI/Ads/Interstitial/PizzaBackground.tsx
// Artistic scenery for the interstitial ad:
// Foreground: A plate with pepperoni pizza and vegetable toppings on a rich wooden table.
// Background Horizon: A set of computers with players playing retro arcade games.
import React from 'react';

export const PizzaArcadeBackground: React.FC = () => {
  return (
    <div
      id="Interstitial_Artistic_Backdrop"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
    >
      {/* Deep Cyber-Arcade Ceiling & Ambient Lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#090b1e] to-[#120d18]" />

      {/* Background Horizon: Arcade Computers & Players */}
      <div className="absolute top-0 left-0 right-0 h-[45%] overflow-hidden opacity-45">
        <svg
          viewBox="0 0 1000 320"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            {/* Screen Glow Filters */}
            <filter id="neonGlowBlue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="neonGlowPink" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="neonGlowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Arcade Horizon Floor Grid */}
          <line x1="0" y1="240" x2="1000" y2="240" stroke="#00f0ff" strokeWidth="2" strokeOpacity="0.3" />
          <line x1="0" y1="260" x2="1000" y2="260" stroke="#ff007f" strokeWidth="1.5" strokeOpacity="0.2" />
          <line x1="0" y1="285" x2="1000" y2="285" stroke="#39ff14" strokeWidth="1" strokeOpacity="0.15" />

          {/* Station 1: Retro Computer 1 + Player 1 */}
          <g transform="translate(60, 90)">
            {/* Computer Desk */}
            <rect x="0" y="110" width="130" height="40" rx="3" fill="#1e293b" />
            <rect x="15" y="150" width="12" height="60" fill="#0f172a" />
            <rect x="105" y="150" width="12" height="60" fill="#0f172a" />
            {/* Monitor Stand */}
            <rect x="52" y="90" width="26" height="22" fill="#334155" />
            <rect x="42" y="110" width="46" height="6" rx="2" fill="#475569" />
            {/* Monitor Chassis */}
            <rect x="25" y="20" width="80" height="72" rx="4" fill="#1e293b" stroke="#00f0ff" strokeWidth="2" filter="url(#neonGlowBlue)" />
            {/* Active Arcade Game Display */}
            <rect x="29" y="24" width="72" height="64" rx="2" fill="#050515" />
            {/* Game Screen Graphics: Space shooter */}
            <polygon points="65,40 60,54 70,54" fill="#38bdf8" />
            <circle cx="48" cy="35" r="3" fill="#ef4444" />
            <circle cx="82" cy="38" r="3" fill="#ef4444" />
            <line x1="65" y1="40" x2="65" y2="30" stroke="#39ff14" strokeWidth="2" />
            {/* Player 1 Silhouette Gaming */}
            <circle cx="150" cy="85" r="16" fill="#0f172a" />
            <path d="M135,105 Q145,95 160,105 L170,165 L130,165 Z" fill="#0f172a" />
            {/* Arms reaching for keyboard/arcade stick */}
            <path d="M140,115 Q125,125 110,120" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" fill="none" />
          </g>

          {/* Station 2: Arcade Cabinet 2 + Player 2 */}
          <g transform="translate(290, 60)">
            {/* Arcade Cabinet Side Profile */}
            <polygon points="20,180 20,40 65,20 100,50 90,110 110,125 110,180" fill="#1e1e2f" stroke="#ff007f" strokeWidth="2" filter="url(#neonGlowPink)" />
            {/* Marquee */}
            <rect x="40" y="24" width="45" height="18" fill="#ff007f" opacity="0.8" rx="2" />
            {/* CRT Screen */}
            <polygon points="45,55 85,55 80,100 40,100" fill="#0c0014" />
            <circle cx="62" cy="78" r="10" fill="#eab308" />
            <line x1="50" y1="70" x2="75" y2="70" stroke="#00f0ff" strokeWidth="3" />
            {/* Player 2 Standing and Mashing Buttons */}
            <circle cx="130" cy="65" r="15" fill="#090d16" />
            <path d="M120,82 Q130,75 145,82 L150,170 L115,170 Z" fill="#090d16" />
            <path d="M125,95 Q115,108 100,118" stroke="#090d16" strokeWidth="7" strokeLinecap="round" fill="none" />
          </g>

          {/* Station 3: Retro Computer 3 + Player 3 */}
          <g transform="translate(530, 85)">
            <rect x="0" y="115" width="135" height="35" rx="3" fill="#1e293b" />
            <rect x="18" y="150" width="12" height="60" fill="#0f172a" />
            <rect x="105" y="150" width="12" height="60" fill="#0f172a" />
            <rect x="55" y="95" width="25" height="22" fill="#334155" />
            <rect x="25" y="25" width="85" height="72" rx="4" fill="#1e293b" stroke="#39ff14" strokeWidth="2" filter="url(#neonGlowGreen)" />
            <rect x="29" y="29" width="77" height="64" rx="2" fill="#031206" />
            {/* Game Screen Graphics: Feral pig hunter game */}
            <circle cx="68" cy="48" r="8" fill="#ec4899" />
            <polygon points="68,76 60,86 76,86" fill="#38bdf8" />
            {/* Player 3 Head & Body */}
            <circle cx="150" cy="85" r="16" fill="#0f172a" />
            <path d="M135,105 Q145,95 160,105 L170,165 L130,165 Z" fill="#0f172a" />
            <path d="M140,115 Q125,122 110,120" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" fill="none" />
          </g>

          {/* Station 4: Dual Arcade Monitor + Player 4 */}
          <g transform="translate(770, 75)">
            <polygon points="10,175 15,35 60,15 95,45 85,105 105,120 105,175" fill="#181828" stroke="#a855f7" strokeWidth="2" />
            <rect x="30" y="20" width="45" height="16" fill="#a855f7" opacity="0.7" rx="2" />
            <polygon points="35,50 78,50 72,95 32,95" fill="#120524" />
            <path d="M40,75 Q55,60 70,75" stroke="#ec4899" strokeWidth="3" fill="none" />
            <circle cx="125" cy="70" r="15" fill="#0a0a14" />
            <path d="M115,88 Q125,80 140,88 L145,170 L110,170 Z" fill="#0a0a14" />
            <path d="M120,100 Q110,110 95,115" stroke="#0a0a14" strokeWidth="7" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      </div>

      {/* Foreground: Rich Wooden Table Surface */}
      <div
        id="Wooden_Table_Surface"
        className="absolute bottom-0 left-0 right-0 h-[48%] bg-gradient-to-t from-[#2c1808] via-[#45270f] to-[#593213] border-t-4 border-[#784318] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] flex items-center justify-center"
      >
        {/* Natural Wood Grain Striations */}
        <div
          className="absolute inset-0 opacity-18 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0px, transparent 40px, rgba(0,0,0,0.4) 41px, transparent 43px, rgba(255,255,255,0.1) 45px)',
          }}
        />

        {/* Ambient Warm Candlelight/Table Lamp Glow */}
        <div className="absolute top-0 w-96 h-48 bg-[#ffb74d]/10 rounded-full blur-3xl pointer-events-none" />

        {/* The Ceramic Plate with Hot Pepperoni Pizza with Vegetable Toppings */}
        <div className="relative z-10 flex flex-col items-center mt-2 max-w-[420px] w-full px-4">
          <svg
            viewBox="0 0 360 210"
            className="w-full max-w-[380px] drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)]"
          >
            <defs>
              <linearGradient id="plateCeramicGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="60%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
              <linearGradient id="pizzaCrustGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
              <linearGradient id="pizzaSauceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <linearGradient id="pizzaCheeseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>

            {/* Table Shadow under Plate */}
            <ellipse cx="180" cy="155" rx="160" ry="42" fill="rgba(0,0,0,0.65)" />

            {/* White Ceramic Serving Plate */}
            {/* Plate Rim */}
            <ellipse cx="180" cy="135" rx="168" ry="48" fill="url(#plateCeramicGrad)" stroke="#94a3b8" strokeWidth="2" />
            {/* Plate Inner Basin */}
            <ellipse cx="180" cy="133" rx="146" ry="40" fill="#f1f5f9" />
            <ellipse cx="180" cy="132" rx="142" ry="38" fill="#e2e8f0" />

            {/* The Pizza */}
            {/* 1. Golden Baked Crust */}
            <ellipse cx="180" cy="128" rx="134" ry="33" fill="url(#pizzaCrustGrad)" stroke="#78350f" strokeWidth="1.5" />

            {/* 2. Rich Tomato Sauce Base */}
            <ellipse cx="180" cy="126" rx="122" ry="28" fill="url(#pizzaSauceGrad)" />

            {/* 3. Melted Mozzarella Cheese */}
            <ellipse cx="180" cy="124" rx="114" ry="25" fill="url(#pizzaCheeseGrad)" />
            {/* Irregular golden baked cheese bubbles */}
            <circle cx="150" cy="120" r="14" fill="#ca8a04" opacity="0.4" />
            <circle cx="210" cy="125" r="16" fill="#ca8a04" opacity="0.4" />
            <circle cx="180" cy="116" r="12" fill="#ca8a04" opacity="0.4" />

            {/* 4. Savory Pepperoni Slices */}
            {/* Pepperoni 1 */}
            <ellipse cx="128" cy="124" rx="14" ry="7" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
            <circle cx="127" cy="123" r="1.5" fill="#450a0a" />
            <circle cx="131" cy="125" r="1.2" fill="#450a0a" />

            {/* Pepperoni 2 */}
            <ellipse cx="160" cy="130" rx="15" ry="7.5" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
            <circle cx="158" cy="129" r="1.5" fill="#450a0a" />
            <circle cx="163" cy="131" r="1.2" fill="#450a0a" />

            {/* Pepperoni 3 */}
            <ellipse cx="205" cy="128" rx="14" ry="7" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
            <circle cx="203" cy="127" r="1.5" fill="#450a0a" />

            {/* Pepperoni 4 */}
            <ellipse cx="236" cy="121" rx="13" ry="6.5" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />

            {/* Pepperoni 5 */}
            <ellipse cx="182" cy="117" rx="15" ry="7.5" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />

            {/* Pepperoni 6 */}
            <ellipse cx="145" cy="113" rx="13" ry="6.5" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />

            {/* Pepperoni 7 */}
            <ellipse cx="218" cy="114" rx="13.5" ry="6.8" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />

            {/* 5. Vegetable Toppings: Green Bell Peppers */}
            <path d="M115,116 Q122,111 130,115" stroke="#16a34a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M170,123 Q178,118 186,122" stroke="#16a34a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M192,133 Q200,128 208,132" stroke="#16a34a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M228,127 Q236,122 244,126" stroke="#16a34a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M142,126 Q149,121 156,125" stroke="#16a34a" strokeWidth="3.5" fill="none" strokeLinecap="round" />

            {/* 6. Vegetable Toppings: Sliced Black Olives */}
            <ellipse cx="138" cy="118" rx="4.5" ry="2.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
            <ellipse cx="138" cy="118" rx="2" ry="1.2" fill="#fde047" />

            <ellipse cx="172" cy="112" rx="4.5" ry="2.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
            <ellipse cx="172" cy="112" rx="2" ry="1.2" fill="#fde047" />

            <ellipse cx="198" cy="120" rx="4.5" ry="2.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
            <ellipse cx="198" cy="120" rx="2" ry="1.2" fill="#fde047" />

            <ellipse cx="225" cy="122" rx="4.5" ry="2.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
            <ellipse cx="225" cy="122" rx="2" ry="1.2" fill="#fde047" />

            <ellipse cx="152" cy="132" rx="4.5" ry="2.5" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
            <ellipse cx="152" cy="132" rx="2" ry="1.2" fill="#fde047" />

            {/* 7. Vegetable Toppings: Sliced Mushrooms */}
            <path d="M120,129 C120,126 128,126 128,129 Z" fill="#d6d3d1" stroke="#78716c" strokeWidth="0.8" />
            <rect x="123" y="129" width="2" height="3" fill="#a8a29e" />

            <path d="M188,126 C188,123 196,123 196,126 Z" fill="#d6d3d1" stroke="#78716c" strokeWidth="0.8" />
            <rect x="191" y="126" width="2" height="3" fill="#a8a29e" />

            <path d="M214,120 C214,117 222,117 222,120 Z" fill="#d6d3d1" stroke="#78716c" strokeWidth="0.8" />
            <rect x="217" y="120" width="2" height="3" fill="#a8a29e" />

            {/* 8. Vegetable Toppings: Diced Red/White Onions */}
            <rect x="132" y="126" width="3.5" height="2" rx="0.5" fill="#fbcfe8" stroke="#db2777" strokeWidth="0.6" />
            <rect x="165" y="117" width="3.5" height="2" rx="0.5" fill="#fbcfe8" stroke="#db2777" strokeWidth="0.6" />
            <rect x="206" y="124" width="3.5" height="2" rx="0.5" fill="#fbcfe8" stroke="#db2777" strokeWidth="0.6" />
            <rect x="178" y="128" width="3.5" height="2" rx="0.5" fill="#fbcfe8" stroke="#db2777" strokeWidth="0.6" />
            <rect x="240" y="118" width="3.5" height="2" rx="0.5" fill="#fbcfe8" stroke="#db2777" strokeWidth="0.6" />

            {/* 9. Aromatic Oregano Flecks */}
            <circle cx="140" cy="122" r="0.8" fill="#14532d" />
            <circle cx="162" cy="125" r="0.8" fill="#14532d" />
            <circle cx="175" cy="119" r="0.8" fill="#14532d" />
            <circle cx="195" cy="127" r="0.8" fill="#14532d" />
            <circle cx="212" cy="116" r="0.8" fill="#14532d" />
            <circle cx="228" cy="124" r="0.8" fill="#14532d" />

            {/* Rising Delicate Steam Ribbons */}
            <path d="M155,105 Q148,92 156,80" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M185,102 Q192,88 184,76" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M215,106 Q208,94 216,82" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>

          <div className="mt-0.5 px-3 py-0.5 bg-black/70 border border-[#f59e0b]/50 rounded text-[10px] font-mono text-[#fbbf24] tracking-widest uppercase">
            WOODEN TABLE // PEPPERONI & VEGETABLE PIZZA
          </div>
        </div>
      </div>
    </div>
  );
};
