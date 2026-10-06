// System/UI/Play_Area/Portrait_Orientation_4_Tablets/index.tsx
// Vertical arcade viewport dedicated exclusively for tablets in portrait orientation.
// Featuring 20% horizontal side bezels (Robot with pepperoni pizza on left, newly planted tree on right),
// green horizon, starry sky, zero clutter (no coin slot, no speakers), and dual input (keyboard & touchscreen).
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ARCADE_SETTINGS, GameState } from '../../../General/index.tsx';
import ArcadeEngine from '../../../Engine/index.tsx';
import { clearUltraBlackCanvas } from '../../../Visuals/Engine/index.tsx';
import { renderHogAssassin, renderLaserBeam } from '../../../../Characters/Hunters/Hog_Assassin/index.tsx';
import { renderFeralPig } from '../../../../Characters/Feral_Pigs/index.tsx';
import { startArcadeBGM, stopArcadeBGM, playPauseSFX, playResumeSFX, playLaserShotSFX, getSoundMode, setSoundMode, SoundMode } from '../../../Sound/index.tsx';
import { generateAITacticalSeed } from '../../../AI/External/Gemini/index.tsx';
import { getCurrentSpeechSystem, cycleSpeechSystem, subscribeSpeechSystemChange, SpeechSystemMode } from '../../../AI/In-Game/TTS/index.tsx';
import { TouchscreenControlDeck } from '../../../Keyboards_and_Controllers/Touchscreen/index.tsx';
import { LeftSideRobotBezel, RightSideTreeBezel } from './BezelArt.tsx';
import { generateTabletBackdropStars } from './General/index.tsx';

export interface PortraitOrientation4TabletsProps {
  onReturnToTitle: () => void;
  onPlayAgain?: () => void;
  apiKey: string;
  model: string;
}

export const PortraitOrientation4Tablets: React.FC<PortraitOrientation4TabletsProps> = ({
  onReturnToTitle,
  onPlayAgain,
  apiKey,
  model,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ArcadeEngine>(new ArcadeEngine());
  const centerContainerRef = useRef<HTMLDivElement | null>(null);

  const touchLeftRef = useRef(false);
  const touchRightRef = useRef(false);

  // Tablet dual input state
  const [isKeyboardDetected, setIsKeyboardDetected] = useState(false);
  const [showTouchDeck, setShowTouchDeck] = useState(true);
  const [isDeckCollapsed, setIsDeckCollapsed] = useState(false);
  const [soundMode, setSoundModeState] = useState<SoundMode>(getSoundMode());
  const [ttsMode, setTtsModeState] = useState<SpeechSystemMode>(getCurrentSpeechSystem());

  useEffect(() => {
    const unsub = subscribeSpeechSystemChange((newMode) => {
      setTtsModeState(newMode);
    });
    return () => unsub();
  }, []);

  const handleCycleSoundMode = () => {
    const modes: SoundMode[] = ['8-Bit', '16-Bit', '32-Bit', '64-Bit'];
    const currentIndex = modes.indexOf(soundMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setSoundMode(nextMode);
    setSoundModeState(nextMode);
  };

  const handleCycleTTSMode = () => {
    const nextMode = cycleSpeechSystem();
    setTtsModeState(nextMode);
  };

  const [hudState, setHudState] = useState({
    score: 0,
    highScore: 0,
    lives: 3,
    wave: 1,
    gameState: GameState.PLAYING,
    quote: '',
    tension: 1.0,
    pigCount: 0,
  });

  // Generate deterministic stars for the continuous celestial backdrop
  const backdropStars = useMemo(() => generateTabletBackdropStars(50), []);

  // Track physical keyboard connectivity and interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Any physical key activity marks keyboard as active
      setIsKeyboardDetected(true);

      const engine = engineRef.current;
      if (!engine) return;

      // Official Pause / Resume toggle: Shift + 7 (&)
      if (e.key === '&' || (e.shiftKey && (e.key === '7' || e.code === 'Digit7'))) {
        e.preventDefault();
        engine.togglePause();
        if (engine.state === GameState.PAUSED) {
          playPauseSFX();
        } else {
          playResumeSFX();
        }
        setHudState((prev) => ({ ...prev, gameState: engine.state }));
        return;
      }

      // Steering
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        touchLeftRef.current = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        touchRightRef.current = true;
      }

      // Laser Cannon Fire
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (engine.state === GameState.PLAYING) {
          engine.fireLaser();
          playLaserShotSFX();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        touchLeftRef.current = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        touchRightRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Arcade Game Loop
  useEffect(() => {
    const engine = engineRef.current;
    let animationFrameId: number;
    let lastWaveChecked = 1;

    startArcadeBGM();
    engine.startNewGame(null);

    if (apiKey) {
      generateAITacticalSeed(apiKey, model, 1).then((seed) => {
        if (seed && engine.wave === 1) {
          engine.updateWaveTacticalSeed(seed);
          if (seed.pigQuotes && seed.pigQuotes.length > 0) {
            setHudState((prev) => ({ ...prev, quote: seed.pigQuotes[0] }));
          }
        }
      });
    }

    const gameLoop = () => {
      // Advance physics with current input vector
      engine.update(touchLeftRef.current, touchRightRef.current);

      if (engine.wave !== lastWaveChecked && apiKey) {
        lastWaveChecked = engine.wave;
        generateAITacticalSeed(apiKey, model, engine.wave).then((seed) => {
          engine.activeTacticalSeed = seed;
          if (seed && seed.pigQuotes && seed.pigQuotes.length > 0) {
            setHudState((prev) => ({
              ...prev,
              quote: seed.pigQuotes[Math.floor(Math.random() * seed.pigQuotes.length)],
            }));
          }
        });
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          clearUltraBlackCanvas(ctx, ARCADE_SETTINGS.CANVAS_WIDTH, ARCADE_SETTINGS.CANVAS_HEIGHT);

          // Starfield
          engine.stars.forEach((star) => {
            ctx.fillStyle = star.color;
            ctx.globalAlpha = star.brightness;
            ctx.fillRect(star.x, star.y, star.size, star.size);
          });
          ctx.globalAlpha = 1.0;

          // Lasers, Pigs, Hunter Craft, Particles
          engine.lasers.forEach((laser) => renderLaserBeam(ctx, laser));
          engine.pigs.forEach((pig) => renderFeralPig(ctx, pig));

          if (engine.lives > 0) {
            renderHogAssassin(ctx, engine.playerPos, engine.isInvulnerable);
          }

          engine.particles.forEach((p) => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          });
          ctx.globalAlpha = 1.0;

          // Paused Screen Overlay
          if (engine.state === GameState.PAUSED) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
            ctx.fillRect(0, 0, ARCADE_SETTINGS.CANVAS_WIDTH, ARCADE_SETTINGS.CANVAS_HEIGHT);
            ctx.fillStyle = '#ffe600';
            ctx.font = '22px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 - 10);
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px "Share Tech Mono", monospace';
            ctx.fillText('Tap RESUME or Press Shift + 7 (&)', ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 + 25);
          }

          // Game Over Overlay
          if (engine.state === GameState.GAME_OVER) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
            ctx.fillRect(0, 0, ARCADE_SETTINGS.CANVAS_WIDTH, ARCADE_SETTINGS.CANVAS_HEIGHT);
            ctx.fillStyle = '#ff3131';
            ctx.font = '26px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 - 30);
            ctx.fillStyle = '#ffffff';
            ctx.font = '13px "Share Tech Mono", monospace';
            ctx.fillText(`Score: ${engine.score.toLocaleString()} PTS`, ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 + 10);
          }
        }
      }

      // Zero-waste HUD updates: only trigger React reconciliation when state metrics actually change
      setHudState((prev) => {
        if (
          prev.score === engine.score &&
          prev.highScore === engine.highScore &&
          prev.lives === engine.lives &&
          prev.wave === engine.wave &&
          prev.gameState === engine.state &&
          prev.pigCount === engine.pigs.length &&
          Math.abs(prev.tension - engine.activeTensionScore) < 0.05
        ) {
          return prev;
        }
        return {
          ...prev,
          score: engine.score,
          highScore: engine.highScore,
          lives: engine.lives,
          wave: engine.wave,
          gameState: engine.state,
          tension: engine.activeTensionScore,
          pigCount: engine.pigs.length,
        };
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      stopArcadeBGM();
    };
  }, [apiKey, model]);

  // Touch handlers
  const handleMoveLeftStart = useCallback(() => {
    touchLeftRef.current = true;
  }, []);

  const handleMoveLeftEnd = useCallback(() => {
    touchLeftRef.current = false;
  }, []);

  const handleMoveRightStart = useCallback(() => {
    touchRightRef.current = true;
  }, []);

  const handleMoveRightEnd = useCallback(() => {
    touchRightRef.current = false;
  }, []);

  const handleFireLaserStart = useCallback(() => {
    const engine = engineRef.current;
    if (engine && engine.state === GameState.PLAYING) {
      engine.fireLaser();
      playLaserShotSFX();
    }
  }, []);

  const handleFireLaserEnd = useCallback(() => {
    // Laser release
  }, []);

  const handleTogglePause = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.togglePause();
      if (engine.state === GameState.PAUSED) {
        playPauseSFX();
      } else {
        playResumeSFX();
      }
      setHudState((prev) => ({ ...prev, gameState: engine.state }));
    }
  }, []);

  const handleRestart = () => {
    if (onPlayAgain) {
      onPlayAgain();
    } else {
      engineRef.current.startNewGame(null);
      startArcadeBGM();
    }
  };

  // Direct canvas touch event listeners for tactile tablet vertical screen interaction (toggled off when keyboard active)
  const handleCanvasTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isKeyboardDetected) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;

    const touchX = touch.clientX - rect.left;
    const midX = rect.width / 2;

    if (touchX < midX * 0.8) {
      touchLeftRef.current = true;
      touchRightRef.current = false;
    } else if (touchX > midX * 1.2) {
      touchRightRef.current = true;
      touchLeftRef.current = false;
    } else {
      // Center tap fires laser
      const engine = engineRef.current;
      if (engine && engine.state === GameState.PLAYING) {
        engine.fireLaser();
        playLaserShotSFX();
      }
    }
  }, [isKeyboardDetected]);

  const handleCanvasTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isKeyboardDetected) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;

    const touchX = touch.clientX - rect.left;
    const midX = rect.width / 2;

    if (touchX < midX * 0.85) {
      touchLeftRef.current = true;
      touchRightRef.current = false;
    } else if (touchX > midX * 1.15) {
      touchRightRef.current = true;
      touchLeftRef.current = false;
    } else {
      touchLeftRef.current = false;
      touchRightRef.current = false;
    }
  }, [isKeyboardDetected]);

  const handleCanvasTouchEnd = useCallback(() => {
    if (isKeyboardDetected) return;
    touchLeftRef.current = false;
    touchRightRef.current = false;
  }, [isKeyboardDetected]);

  const isPaused = hudState.gameState === GameState.PAUSED;

  return (
    <div
      id="Portrait_Orientation_4_Tablets_Root"
      className="fixed inset-0 w-full h-[100dvh] max-h-[100dvh] bg-[#05050a] flex flex-col justify-between overflow-hidden font-mono touch-none"
    >
      {/* Top Arcade Marquee / Tablet HUD (No arbitrary title button above canvas) */}
      <header
        id="Tablet_Arcade_Marquee"
        className="w-full bg-[#0d0d16] border-b-2 border-[#00f0ff]/40 px-4 py-1.5 flex items-center justify-between text-xs z-30 shadow-[0_2px_15px_rgba(0,0,0,0.8)] shrink-0"
      >
        <div>
          <div className="text-[9px] text-gray-400 tracking-wider">SCORE</div>
          <div className="text-[#39ff14] font-black text-base tracking-widest">
            {hudState.score.toString().padStart(6, '0')}
          </div>
        </div>

        {/* Center: Wave & Mode Indicator */}
        <div className="flex flex-col items-center">
          <div className="text-[9px] text-gray-400 tracking-wider">SECTOR WAVE</div>
          <div className="text-[#ffd700] font-black text-base leading-none mb-0.5">{hudState.wave}</div>
          <div className="flex items-center gap-1.5 text-[9px] text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{isKeyboardDetected ? 'KEYBOARD READY' : 'TABLET TOUCH'}</span>
            {isKeyboardDetected && (
              <button
                type="button"
                onClick={() => setShowTouchDeck(!showTouchDeck)}
                className="underline text-[8px] text-yellow-300 hover:text-white ml-1"
              >
                [{showTouchDeck ? 'HIDE TOUCH' : 'SHOW TOUCH'}]
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5">
            <button
              id="Tablet_Sound_Mode_Toggle_Btn"
              type="button"
              onClick={handleCycleSoundMode}
              className="px-2 py-0.5 bg-[#121222] border border-[#39ff14]/60 text-[#39ff14] text-[10px] font-mono rounded transition flex items-center gap-1 cursor-pointer active:scale-95"
              title="Toggle Sound Mode"
            >
              <span className="text-gray-400 text-[8px] uppercase">Audio:</span>
              <span className="font-bold">{soundMode}</span>
            </button>
            <button
              id="Tablet_TTS_Mode_Toggle_Btn"
              type="button"
              onClick={handleCycleTTSMode}
              className="px-2 py-0.5 bg-[#121222] border border-[#00f0ff]/60 text-[#00f0ff] text-[10px] font-mono rounded transition flex items-center gap-1 cursor-pointer active:scale-95"
              title="Toggle Speech System Mode"
            >
              <span className="text-gray-400 text-[8px] uppercase">TTS Mode:</span>
              <span className="font-bold">{ttsMode}</span>
            </button>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-gray-400 tracking-wider">HIGH SCORE</div>
            <div className="text-[#00f0ff] font-bold text-sm">
              {hudState.highScore.toString().padStart(6, '0')}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-gray-400 tracking-wider">HUNTER SHIPS</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.max(0, hudState.lives) }).map((_, i) => (
                <span key={i} className="text-[#ff0055] text-sm">▲</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Tablet Centerpiece: 20% Left Bezel | 60% Top-Centered Arcade | 20% Right Bezel */}
      <main
        id="Tablet_Cabinet_Body"
        className="flex-1 w-full flex flex-row items-stretch justify-between relative overflow-hidden bg-black min-h-0"
      >
        {/* Left Side 20% Bezel: Robot carrying plate of pepperoni pizza on green horizon under starry sky */}
        <div className="w-[20%] h-full shrink-0 relative hidden sm:block">
          <LeftSideRobotBezel stars={backdropStars} />
        </div>

        {/* Center 60% Horizontal Stage: Top-Centered Vertical Arcade CRT Screen */}
        <div
          id="Tablet_Centered_Arcade_Stage"
          ref={centerContainerRef}
          className="flex-1 w-full sm:w-[60%] h-full flex items-start justify-center p-1.5 relative bg-black overflow-hidden min-h-0"
        >
          <div
            id="Tablet_Arcade_CRT_Monitor"
            className="relative border-2 border-[#00f0ff]/50 shadow-[0_0_30px_rgba(0,240,255,0.25)] bg-black max-w-full max-h-full flex items-center justify-center aspect-[3/4]"
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          >
            {/* Game Canvas with aria-label and direct touch listeners */}
            <canvas
              id="Tablet_Arcade_Canvas"
              ref={canvasRef}
              width={ARCADE_SETTINGS.CANVAS_WIDTH}
              height={ARCADE_SETTINGS.CANVAS_HEIGHT}
              aria-label="Feral Pig Hunt Play Area"
              onTouchStart={handleCanvasTouchStart}
              onTouchMove={handleCanvasTouchMove}
              onTouchEnd={handleCanvasTouchEnd}
              onTouchCancel={handleCanvasTouchEnd}
              className="w-full h-full block cursor-crosshair touch-none"
              style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
            />

            {/* CRT Scanline Filter */}
            <div
              className="absolute inset-0 pointer-events-none opacity-15"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 2px)',
              }}
            />

            {/* AI Tactical Quote Overlay */}
            {hudState.quote && (
              <div className="absolute top-2 left-2 right-2 px-3 py-1.5 bg-black/85 border border-[#ff0055]/50 text-xs text-[#ff3377] flex items-center justify-between pointer-events-none backdrop-blur-xs">
                <span className="truncate">"{hudState.quote}"</span>
                <span className="text-[9px] text-[#00f0ff] uppercase ml-2 shrink-0">GEMINI TAC</span>
              </div>
            )}

            {/* Game Over Actions Overlay */}
            {hudState.gameState === GameState.GAME_OVER && (
              <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-6 z-20">
                <div className="text-3xl font-black text-[#ff0055] tracking-widest mb-2 drop-shadow-[0_0_15px_#ff0055]">
                  GAME OVER
                </div>
                <div className="text-sm text-gray-300 mb-6 font-mono">
                  FINAL SCORE: <span className="text-[#39ff14] font-bold">{hudState.score.toLocaleString()} PTS</span>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="px-5 py-2.5 bg-[#39ff14] text-black font-bold text-sm uppercase shadow-[0_0_12px_#39ff14] active:scale-95 transition"
                  >
                    Play Again
                  </button>
                  <button
                    type="button"
                    onClick={onReturnToTitle}
                    className="px-5 py-2.5 border border-gray-500 text-gray-300 font-bold text-sm uppercase hover:text-white active:scale-95 transition bg-black/50"
                  >
                    Title
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side 20% Bezel: Newly planted tree with stake on green horizon under starry sky */}
        <div className="w-[20%] h-full shrink-0 relative hidden sm:block">
          <RightSideTreeBezel stars={backdropStars} />
        </div>
      </main>

      {/* Bottom Physical-Style Tactile Touchscreen Deck with Back to Title Screen & Collapsible Controls */}
      {showTouchDeck && (
        <footer id="Tablet_Arcade_Controls_Footer" className="w-full shrink-0 z-20">
          <TouchscreenControlDeck
            onMoveLeftStart={handleMoveLeftStart}
            onMoveLeftEnd={handleMoveLeftEnd}
            onMoveRightStart={handleMoveRightStart}
            onMoveRightEnd={handleMoveRightEnd}
            onFireLaserStart={handleFireLaserStart}
            onFireLaserEnd={handleFireLaserEnd}
            onTogglePause={handleTogglePause}
            onReturnToTitle={onReturnToTitle}
            isPaused={isPaused}
            isCollapsed={isDeckCollapsed}
            onToggleCollapse={() => setIsDeckCollapsed((prev) => !prev)}
          />
        </footer>
      )}
    </div>
  );
};

export default PortraitOrientation4Tablets;
