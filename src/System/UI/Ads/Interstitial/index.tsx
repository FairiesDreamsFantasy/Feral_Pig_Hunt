// System/UI/Ads/Interstitial/index.tsx
// Full-page Interstitial Ad system serving Revive Adserver v6.0.8.
// Features 30-second countdown timer, Skip Ad button (visible after 15 seconds),
// and scenic backdrop of pepperoni & vegetable pizza on a wooden table with arcade computers & players in the horizon.
import React, { useEffect, useState, useRef } from 'react';
import { INTERSTITIAL_AD_CONFIG, calculateSkipEligibility } from './General/index.tsx';
import { PizzaArcadeBackground } from './PizzaBackground.tsx';

export interface InterstitialAdProps {
  onAdComplete: () => void;
  reason?: 'START_GAME' | 'PLAY_AGAIN';
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({
  onAdComplete,
  reason = 'START_GAME',
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    INTERSTITIAL_AD_CONFIG.TOTAL_DURATION_SECONDS
  );
  const adContainerRef = useRef<HTMLDivElement | null>(null);
  const completedRef = useRef<boolean>(false);

  // 30-Second Countdown Timer
  useEffect(() => {
    const timerInterval = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerInterval);
          if (!completedRef.current) {
            completedRef.current = true;
            onAdComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timerInterval);
    };
  }, [onAdComplete]);

  // Inject Revive Adserver Asynchronous JS script inside #Advertisement
  useEffect(() => {
    const container = adContainerRef.current;
    if (!container) return;

    // Check if script already injected
    const existingScript = container.querySelector('script[src*="asyncjs.php"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = INTERSTITIAL_AD_CONFIG.REVIVE_ASYNC_SRC;
      container.appendChild(script);
    }
  }, []);

  const elapsedSeconds = INTERSTITIAL_AD_CONFIG.TOTAL_DURATION_SECONDS - secondsRemaining;
  const canSkip = calculateSkipEligibility(
    elapsedSeconds,
    INTERSTITIAL_AD_CONFIG.SKIP_THRESHOLD_SECONDS
  );

  const handleSkipAd = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onAdComplete();
    }
  };

  return (
    <main
      id="Interstitial_Ad_Main"
      className="relative w-screen h-screen min-h-screen overflow-hidden flex flex-col items-center justify-between text-white font-mono"
    >
      {/* Background: Wooden table, Pepperoni & Vegetable Pizza, and Arcade Horizon */}
      <PizzaArcadeBackground />

      {/* Top Bar: Coin-Op Style Status Header */}
      <header
        id="Interstitial_Ad_Header"
        className="relative z-20 w-full bg-black/85 border-b-2 border-[#ffd700]/40 px-4 py-3 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.9)] backdrop-blur-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#ffd700] animate-ping" />
          <div>
            <div className="text-[10px] text-gray-400 tracking-wider">
              {reason === 'PLAY_AGAIN' ? 'ARCADE COIN RE-INSERTION' : 'ARCADE COIN INSERTION'}
            </div>
            <div className="text-[#ffd700] font-bold text-sm tracking-widest">
              SUPPORTING FREE PLAY
            </div>
          </div>
        </div>

        {/* Countdown Timer Display */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[9px] text-gray-400 tracking-widest uppercase">GAME STARTS IN</div>
            <div className="text-[#00f0ff] font-black text-xl tracking-widest tabular-nums">
              {secondsRemaining.toString().padStart(2, '0')}s
            </div>
          </div>
        </div>
      </header>

      {/* Center Advertising Stage with required #Advertisement container */}
      <div
        id="Interstitial_Ad_Content_Wrapper"
        className="relative z-20 flex-1 w-full max-w-4xl flex flex-col items-center justify-center p-4"
      >
        <div className="w-full max-w-2xl bg-black/80 border-2 border-[#00f0ff]/40 shadow-[0_0_40px_rgba(0,0,0,0.9)] p-4 flex flex-col items-center rounded backdrop-blur-sm">
          <div className="text-[11px] text-gray-400 tracking-wider uppercase mb-2">
            SPONSORED ADVERTISEMENT // REVIVE ADSERVER
          </div>

          {/* Specified HTML advertisement container */}
          <div id="Advertisement" ref={adContainerRef} className="w-full min-h-[140px] flex flex-col items-center justify-center my-2">
            {/* Revive Adserver Asynchronous JS Tag - Generated with Revive Adserver v6.0.8 */}
            <ins
              data-revive-zoneid={INTERSTITIAL_AD_CONFIG.REVIVE_ZONE_ID}
              data-revive-id={INTERSTITIAL_AD_CONFIG.REVIVE_ID}
            />
            {/* Fallback announcement banner if ad-blocker blocks the network delivery */}
            <div className="p-4 text-center text-xs text-gray-400 font-mono">
              <span className="text-[#00f0ff] font-bold block mb-1">
                FERAL PIG HUNT ARCADE // LIVE SPONSOR
              </span>
              <span>Enjoy free unlimited arcade hunts powered by community sponsors.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Skip Button & Countdown Progress */}
      <footer
        id="Interstitial_Ad_Footer"
        className="relative z-20 w-full bg-black/85 border-t-2 border-[#00f0ff]/30 px-6 py-4 flex items-center justify-between backdrop-blur-xs"
      >
        <div className="text-xs text-gray-400">
          {canSkip ? (
            <span className="text-[#39ff14] font-bold">You may skip to the game now:</span>
          ) : (
            <span>
              Skip unlocks in{' '}
              <strong className="text-yellow-400">
                {INTERSTITIAL_AD_CONFIG.SKIP_THRESHOLD_SECONDS - elapsedSeconds}s
              </strong>
            </span>
          )}
        </div>

        {/* The Skip Ad Button - appears after 15 seconds */}
        {canSkip ? (
          <button
            id="Skip_Ad_Button"
            type="button"
            onClick={handleSkipAd}
            className="px-6 py-2.5 bg-[#39ff14] text-black font-black text-sm uppercase tracking-wider shadow-[0_0_20px_#39ff14] hover:bg-[#32e011] active:scale-95 transition cursor-pointer"
          >
            Skip Ad
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="px-6 py-2.5 bg-gray-800 text-gray-500 font-bold text-sm uppercase tracking-wider border border-gray-700 cursor-not-allowed opacity-60"
          >
            Skip in {INTERSTITIAL_AD_CONFIG.SKIP_THRESHOLD_SECONDS - elapsedSeconds}s
          </button>
        )}
      </footer>
    </main>
  );
};

export default InterstitialAd;
