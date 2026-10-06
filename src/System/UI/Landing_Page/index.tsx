import React from 'react';
import { LandingPageGeneral } from './General/index.tsx';
import { VersionBadge } from './Version/index.tsx';

export * from './General/index.tsx';

interface LandingPageProps {
  onStartGame: () => void;
  onOpenInsertAI: () => void;
  hasAIConfigured: boolean;
  highScore: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartGame,
  onOpenInsertAI,
  hasAIConfigured,
  highScore,
}) => {
  return (
    <div id="Landing_Page_Wrapper" className="min-h-screen w-full flex flex-col justify-between bg-black text-white px-4 py-8 max-w-5xl mx-auto overflow-y-auto">
      <header id="Header" className="text-center space-y-2 border-b border-[#1f1f2e] pb-6">
        <h1 id="Title_Heading" className="text-4xl md:text-5xl font-black tracking-widest text-[#39ff14] pixel-font glow-green">
          Feral Pig Hunt
        </h1>
        <p className="text-sm md:text-base font-mono text-[#00f0ff] uppercase tracking-wider">
          Galaxian / Galaga Inspired Ecosystem Defense Arcade
        </p>
      </header>

      <main id="Landing_Main" className="my-8 space-y-8 flex flex-col items-center">
        <div
          id="Hunter_Graphic_Container"
          className="relative w-48 h-48 bg-[#0a0a14] border-2 border-[#00f0ff] flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.25)]"
        >
          <svg
            id="Hunter_Pixel_Graphic"
            viewBox="0 0 40 40"
            className="w-32 h-32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="12" y="32" width="4" height="6" fill="#ff6600" />
            <rect x="24" y="32" width="4" height="6" fill="#ff6600" />
            <rect x="13" y="32" width="2" height="4" fill="#ffe600" />
            <rect x="25" y="32" width="2" height="4" fill="#ffe600" />
            <path
              d="M20 4 L38 28 L32 30 L24 26 L20 30 L16 26 L8 30 L2 28 Z"
              fill="#4a4a6a"
              stroke="#00f0ff"
              strokeWidth="1.5"
            />
            <rect x="18" y="6" width="4" height="12" fill="#ffffff" />
            <rect x="18.5" y="14" width="3" height="6" fill="#00f0ff" />
            <rect x="6" y="24" width="3" height="4" fill="#39ff14" />
            <rect x="31" y="24" width="3" height="4" fill="#39ff14" />
            <rect x="19" y="0" width="2" height="4" fill="#00f0ff" />
          </svg>
          <div className="absolute bottom-2 text-[10px] text-gray-400 font-mono tracking-widest uppercase">
            Unit-HA-12
          </div>
        </div>

        <div id="Mission_Briefing" className="max-w-2xl text-center space-y-4 font-mono text-gray-300 leading-relaxed text-sm md:text-base bg-[#0e0e17] p-6 border border-[#2a2a3c] rounded-none">
          <p>
            An invasive army of feral hogs is overrunning ecosystems across the United States. Take command of the robotic <span className="text-[#00f0ff] font-bold">Hog Assassin</span> armed with a high-intensity 12-unit segmented vertical laser line.
          </p>
          <p className="text-xs text-gray-400">
            Feral pigs swoop in formation across multiple colors, sizes, and spotted patterns. Intercept dive attacks, neutralize giant high-value tusked hogs, and protect your 3 lives!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#1f1f2e] text-left text-xs font-mono">
            <div className="bg-black/60 p-3 border border-gray-800">
              <span className="text-gray-400 block mb-1">  KEYBOARD CONTROLS</span>
              <ul className="space-y-1 text-gray-200">
                <li><strong className="text-[#ffe600]">Spacebar:</strong> Fire 12-Unit Laser</li>
                <li><strong className="text-[#ffe600]">Left / Right / A / D:</strong> Strafe Hunter</li>
                <li><strong className="text-[#ffe600]">Shift + 7 (&):</strong> Pause / Resume</li>
              </ul>
            </div>
            <div className="bg-black/60 p-3 border border-gray-800 flex flex-col justify-between">
              <div>
                <span className="text-gray-400 block mb-1">  ALL-TIME HIGH SCORE</span>
                <span className="text-xl font-bold text-[#ffe600] pixel-font">
                  {highScore.toLocaleString()} PTS
                </span>
              </div>
              <div className="text-[11px] mt-2">
                AI Seed Status:{' '}
                {hasAIConfigured ? (
                  <span className="text-[#39ff14] font-bold">  GEMINI ACTIVE</span>
                ) : (
                  <span className="text-gray-400">Deterministic Arcade RNG</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <VersionBadge />
          <div id="Action_Buttons" className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center pt-2">
            <button
              id="Start_Game_Btn"
              onClick={onStartGame}
              className="w-full sm:w-auto px-8 py-4 bg-[#39ff14] text-black hover:bg-[#32e012] text-sm md:text-base font-bold uppercase tracking-widest pixel-font transition shadow-[0_0_20px_rgba(57,255,20,0.6)] cursor-pointer"
            >
              Start Game
            </button>
            <button
              id="Insert_AI_Btn"
              onClick={onOpenInsertAI}
              className="w-full sm:w-auto px-6 py-4 bg-[#0d0d1a] border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/10 text-sm md:text-base font-bold uppercase tracking-widest pixel-font transition shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
            >
              Insert AI
            </button>
          </div>
        </div>
      </main>

      <footer id="Footer" className="text-center border-t border-[#1f1f2e] pt-6 mt-8">
        <p className="text-xs font-mono text-gray-500">
          {LandingPageGeneral.license}
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
