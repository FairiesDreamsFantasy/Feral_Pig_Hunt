// System/UI/Play_Area/Portrait_Orientation_4_Mobile_Phones/index.tsx
// Vertical arcade viewport exclusively engineered for mobile phones in portrait orientation.
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ARCADE_SETTINGS, GameState } from '../../../General/index.tsx';
import ArcadeEngine from '../../../Engine/index.tsx';
import { clearUltraBlackCanvas } from '../../../Visuals/Engine/index.tsx';
import { renderHogAssassin, renderLaserBeam } from '../../../../Characters/Hunters/Hog_Assassin/index.tsx';
import { renderFeralPig } from '../../../../Characters/Feral_Pigs/index.tsx';
import { startArcadeBGM, stopArcadeBGM, playPauseSFX, playResumeSFX, playLaserShotSFX, getSoundMode, setSoundMode, SoundMode } from '../../../Sound/index.tsx';
import { generateAITacticalSeed } from '../../../AI/External/Gemini/index.tsx';
import { getCurrentSpeechSystem, cycleSpeechSystem, subscribeSpeechSystemChange, SpeechSystemMode } from '../../../AI/In-Game/TTS/index.tsx';
import { TouchscreenControlDeck } from '../../../Keyboards_and_Controllers/Touchscreen/index.tsx';
import { calculatePortraitViewportFit } from './General/index.tsx';

export interface PortraitOrientationPlayAreaProps {
  onReturnToTitle: () => void;
  onPlayAgain?: () => void;
  apiKey: string;
  model: string;
}

export const PortraitOrientationPlayArea: React.FC<PortraitOrientationPlayAreaProps> = ({
  onReturnToTitle,
  onPlayAgain,
  apiKey,
  model,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ArcadeEngine>(new ArcadeEngine());
  const screenContainerRef = useRef<HTMLDivElement | null>(null);

  const touchLeftRef = useRef(false);
  const touchRightRef = useRef(false);

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

  const [isKeyboardDetected, setIsKeyboardDetected] = useState(false);
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

  const [viewportDims, setViewportDims] = useState({
    width: ARCADE_SETTINGS.CANVAS_WIDTH,
    height: ARCADE_SETTINGS.CANVAS_HEIGHT,
  });

  // Track physical keyboard connectivity and interaction
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Calculate dynamic dimensions using ResizeObserver with zero hardcoding
  useEffect(() => {
    const container = screenContainerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth > 0 && clientHeight > 0) {
        const fit = calculatePortraitViewportFit(
          clientWidth,
          clientHeight,
          ARCADE_SETTINGS.CANVAS_WIDTH,
          ARCADE_SETTINGS.CANVAS_HEIGHT
        );
        setViewportDims({
          width: fit.viewportWidth,
          height: fit.viewportHeight,
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Main game loop and engine integration
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
      // Feed touch controls directly into the mechanical engine
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

          engine.stars.forEach((star) => {
            ctx.fillStyle = star.color;
            ctx.globalAlpha = star.brightness;
            ctx.fillRect(star.x, star.y, star.size, star.size);
          });
          ctx.globalAlpha = 1.0;

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

          if (engine.state === GameState.PAUSED) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(0, 0, ARCADE_SETTINGS.CANVAS_WIDTH, ARCADE_SETTINGS.CANVAS_HEIGHT);
            ctx.fillStyle = '#ffe600';
            ctx.font = '22px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 - 10);
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px "Share Tech Mono", monospace';
            ctx.fillText('Tap RESUME or Press Shift + 7 (&)', ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 + 25);
          }

          if (engine.state === GameState.GAME_OVER) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
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

  // Touch control deck button callbacks
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

  // Direct canvas touch event listeners for tactile mobile touch interaction (toggled off when keyboard active)
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
      id="Portrait_Mobile_Play_Area_Root"
      className="fixed inset-0 w-full h-[100dvh] max-h-[100dvh] bg-[#05050a] flex flex-col justify-between overflow-hidden font-mono touch-none"
    >
      {/* Top Arcade Marquee / HUD (No arbitrary title button above canvas) */}
      <header
        id="Portrait_Arcade_Marquee"
        className="w-full bg-[#0d0d16] border-b-2 border-[#00f0ff]/30 px-3 py-1 flex items-center justify-between text-xs z-10 shrink-0"
      >
        <div>
          <div className="text-[9px] text-gray-400">SCORE</div>
          <div className="text-[#39ff14] font-black text-sm tracking-wider">
            {hudState.score.toString().padStart(6, '0')}
          </div>
        </div>

        <div className="text-center flex flex-col items-center">
          <div className="text-[9px] text-gray-400">WAVE</div>
          <div className="text-[#ffd700] font-black text-sm">{hudState.wave}</div>
          <div className="flex items-center gap-1 mt-0.5">
            <button
              id="Mobile_Sound_Mode_Toggle_Btn"
              type="button"
              onClick={handleCycleSoundMode}
              className="px-1.5 py-0.5 bg-[#121222] border border-[#39ff14]/60 text-[#39ff14] text-[8px] font-mono rounded active:scale-95"
              title="Toggle Audio Mode"
            >
              {soundMode}
            </button>
            <button
              id="Mobile_TTS_Mode_Toggle_Btn"
              type="button"
              onClick={handleCycleTTSMode}
              className="px-1.5 py-0.5 bg-[#121222] border border-[#00f0ff]/60 text-[#00f0ff] text-[8px] font-mono rounded active:scale-95"
              title="Toggle TTS Mode"
            >
              TTS: {ttsMode.split(' ')[0]}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[9px] text-gray-400">HIGH</div>
            <div className="text-[#00f0ff] font-bold text-xs">
              {hudState.highScore.toString().padStart(6, '0')}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-gray-400">SHIPS</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.max(0, hudState.lives) }).map((_, i) => (
                <span key={i} className="text-[#ff0055] text-xs">▲</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Top and Centered Viewport: Vertically placed at top and centered */}
      <main
        id="Portrait_Arcade_Screen_Container"
        ref={screenContainerRef}
        className="flex-1 w-full flex items-start justify-center relative p-1 bg-black overflow-hidden min-h-0"
      >
        <div
          id="Portrait_Arcade_CRT_Frame"
          className="relative border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.2)] bg-black"
          style={{
            width: `${viewportDims.width}px`,
            height: `${viewportDims.height}px`,
          }}
        >
          {/* Game Canvas with exact aria-label and direct touch listeners */}
          <canvas
            id="Portrait_Arcade_Canvas"
            ref={canvasRef}
            width={ARCADE_SETTINGS.CANVAS_WIDTH}
            height={ARCADE_SETTINGS.CANVAS_HEIGHT}
            aria-label="Feral Pig Hunt Game Area"
            onTouchStart={handleCanvasTouchStart}
            onTouchMove={handleCanvasTouchMove}
            onTouchEnd={handleCanvasTouchEnd}
            onTouchCancel={handleCanvasTouchEnd}
            className="w-full h-full block cursor-crosshair touch-none"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Authentic CRT scanlines effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 2px)',
            }}
          />

          {/* AI Tactical Quote Overlay */}
          {hudState.quote && (
            <div className="absolute top-2 left-2 right-2 px-2 py-1 bg-black/85 border border-[#ff0055]/50 text-[10px] text-[#ff3377] flex items-center justify-between pointer-events-none">
              <span className="truncate">"{hudState.quote}"</span>
              <span className="text-[8px] text-[#00f0ff] uppercase ml-1 shrink-0">GEMINI</span>
            </div>
          )}

          {/* Game Over Actions */}
          {hudState.gameState === GameState.GAME_OVER && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-4">
              <div className="text-2xl font-black text-[#ff0055] tracking-widest mb-1 drop-shadow-[0_0_10px_#ff0055]">
                GAME OVER
              </div>
              <div className="text-xs text-gray-300 mb-4">
                FINAL SCORE: <span className="text-[#39ff14] font-bold">{hudState.score.toLocaleString()} PTS</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="px-4 py-2 bg-[#39ff14] text-black font-bold text-xs uppercase shadow-[0_0_10px_#39ff14] active:scale-95 transition"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={onReturnToTitle}
                  className="px-4 py-2 border border-gray-600 text-gray-300 font-bold text-xs uppercase hover:text-white active:scale-95 transition"
                >
                  Title
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Physical-Style Touchscreen Controls Deck with Back to Title & Collapsible Controls */}
      <footer id="Portrait_Arcade_Controls_Footer" className="w-full shrink-0">
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
    </div>
  );
};

export default PortraitOrientationPlayArea;
