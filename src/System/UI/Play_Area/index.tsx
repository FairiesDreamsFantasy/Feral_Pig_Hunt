import React, { useEffect, useRef, useState } from 'react';
import { ARCADE_SETTINGS, GameState } from '../../General/index.tsx';
import ArcadeEngine from '../../Engine/index.tsx';
import ArcadeKeyboardManager from '../../Keyboards_and_Controllers/index.tsx';
import { clearUltraBlackCanvas } from '../../Visuals/Engine/index.tsx';
import { renderHogAssassin, renderLaserBeam } from '../../../Characters/Hunters/Hog_Assassin/index.tsx';
import { renderFeralPig } from '../../../Characters/Feral_Pigs/index.tsx';
import { startArcadeBGM, stopArcadeBGM, playPauseSFX, playResumeSFX, getSoundMode, setSoundMode, SoundMode } from '../../Sound/index.tsx';
import { generateAITacticalSeed } from '../../AI/External/Gemini/index.tsx';
import { getCurrentSpeechSystem, cycleSpeechSystem, subscribeSpeechSystemChange, SpeechSystemMode } from '../../AI/In-Game/TTS/index.tsx';

export * from './General/index.tsx';
export * as Portrait_Orientation_4_Mobile_Phones from './Portrait_Orientation_4_Mobile_Phones/index.tsx';
export * as Portrait_Orientation_4_Tablets from './Portrait_Orientation_4_Tablets/index.tsx';
export * as Index from './Index/index.tsx';

interface PlayAreaProps {
  onReturnToTitle: () => void;
  onPlayAgain?: () => void;
  apiKey: string;
  model: string;
}

export const PlayArea: React.FC<PlayAreaProps> = ({ onReturnToTitle, onPlayAgain, apiKey, model }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ArcadeEngine>(new ArcadeEngine());
  const keyboardRef = useRef<ArcadeKeyboardManager>(new ArcadeKeyboardManager());
  const [soundMode, setSoundModeState] = useState<SoundMode>(getSoundMode());
  const [ttsMode, setTtsModeState] = useState<SpeechSystemMode>(getCurrentSpeechSystem());
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

  useEffect(() => {
    const engine = engineRef.current;
    const keyboard = keyboardRef.current;

    startArcadeBGM();

    // Boot game engine immediately with algorithmic parameters for zero-latency 60 FPS startup
    engine.startNewGame(null);

    // If external AI key is configured, request tactical seed asynchronously without blocking startup
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

    keyboard.bindEvents(
      () => {
        engine.togglePause();
        if (engine.state === GameState.PAUSED) {
          playPauseSFX();
          stopArcadeBGM();
        } else if (engine.state === GameState.PLAYING) {
          playResumeSFX();
          startArcadeBGM();
        }
      },
      () => {
        engine.fireLaser();
      }
    );

    let animationFrameId: number;
    let lastWaveChecked = 1;

    const gameLoop = () => {
      const keys = keyboard.getKeys();
      engine.update(keys.ArrowLeft, keys.ArrowRight);

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
            ctx.font = '24px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 - 10);
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px "Share Tech Mono", monospace';
            ctx.fillText('Press Shift + 7 (&) to Resume', ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 + 25);
          }

          if (engine.state === GameState.GAME_OVER) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(0, 0, ARCADE_SETTINGS.CANVAS_WIDTH, ARCADE_SETTINGS.CANVAS_HEIGHT);
            ctx.fillStyle = '#ff3131';
            ctx.font = '28px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 - 30);
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px "Share Tech Mono", monospace';
            ctx.fillText(`Final Score: ${engine.score.toLocaleString()} PTS`, ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 + 10);
            ctx.fillText(`High Score: ${engine.highScore.toLocaleString()} PTS`, ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 + 35);
          }
        }
      }

      setHudState((prev) => ({
        ...prev,
        score: engine.score,
        highScore: engine.highScore,
        lives: engine.lives,
        wave: engine.wave,
        gameState: engine.state,
        tension: engine.activeTensionScore,
        pigCount: engine.pigs.length,
      }));
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    const unsubscribeTTS = subscribeSpeechSystemChange((newMode) => {
      setTtsModeState(newMode);
    });

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      keyboard.unbindEvents();
      stopArcadeBGM();
      unsubscribeTTS();
    };
  }, [apiKey, model]);

  const handleRestart = () => {
    if (onPlayAgain) {
      onPlayAgain();
    } else {
      engineRef.current.startNewGame(null);
      startArcadeBGM();
    }
  };

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

  return (
    <main id="Main" className="min-h-screen w-full flex flex-col items-center justify-center bg-black p-2">
      <div id="HUD_Top_Bar" className="w-full max-w-[800px] flex items-center justify-between text-xs font-mono text-white mb-2 px-2">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-gray-400 block text-[10px]">SCORE</span>
            <span className="text-lg font-bold text-[#39ff14] pixel-font">
              {hudState.score.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">HIGH SCORE</span>
            <span className="text-lg font-bold text-[#ffe600] pixel-font">
              {hudState.highScore.toLocaleString()}
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="text-gray-400 block text-[10px]">AI TENSION</span>
            <span id="Tension_Display" className={`text-lg font-bold pixel-font transition-all ${
              hudState.tension > 1.6 ? 'text-[#ff3131] animate-pulse' : hudState.tension > 1.25 ? 'text-[#ff9900]' : 'text-[#39ff14]'
            }`}>
              {(hudState.tension * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <span className="text-gray-400 block text-[10px]">PIGS LEFT</span>
            <span className="text-lg font-bold text-[#ff3131] pixel-font">
              {hudState.pigCount}
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">WAVE</span>
            <span className="text-lg font-bold text-[#00f0ff] pixel-font">
              {hudState.wave}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-400 block text-[10px]">LIVES</span>
            <div id="Lives_Indicator_Container" className="flex items-center gap-1.5 mt-0.5">
              {[0, 1, 2].map((lifeIdx) => (
                <div
                  key={lifeIdx}
                  className={`w-4 h-4 transition ${
                    lifeIdx < hudState.lives
                      ? 'text-[#00f0ff] opacity-100'
                      : 'text-gray-700 opacity-30'
                  }`}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <polygon points="10,2 18,16 14,18 10,14 6,18 2,16" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        id="Animation_Container"
        className="relative border-4 border-[#1f1f2e] bg-black shadow-[0_0_35px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        <canvas
          id="Animation"
          ref={canvasRef}
          width={ARCADE_SETTINGS.CANVAS_WIDTH}
          height={ARCADE_SETTINGS.CANVAS_HEIGHT}
          aria-label="Feral Pig Hunt Game View"
          role="img"
          className="block bg-black cursor-none"
        />
        {hudState.gameState === GameState.GAME_OVER && (
          <div
            id="Game_Over_Controls"
            className="absolute bottom-12 inset-x-0 flex items-center justify-center gap-4 z-20"
          >
            <button
              id="Play_Again_Btn"
              onClick={handleRestart}
              className="px-6 py-3 bg-[#39ff14] text-black hover:bg-[#32e012] font-bold text-xs uppercase tracking-wider pixel-font shadow-[0_0_15px_rgba(57,255,20,0.6)] cursor-pointer"
            >
              Play Again
            </button>
            <button
              id="Return_Title_Btn"
              onClick={onReturnToTitle}
              className="px-6 py-3 bg-[#0d0d1a] border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/20 font-bold text-xs uppercase tracking-wider pixel-font cursor-pointer"
            >
              Main Menu
            </button>
          </div>
        )}
      </div>

      <div id="HUD_Bottom_Bar" className="w-full max-w-[800px] flex items-center justify-between text-xs font-mono text-gray-400 mt-2 px-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Controls:</span>
          <span>[A/D/Left/Right] Move</span>
          <span>[SPACE] 12-Unit Laser</span>
          <span>[Shift+7] Pause</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="Sound_Mode_Toggle_Btn"
            onClick={handleCycleSoundMode}
            className="px-2.5 py-1 bg-[#121222] border border-[#39ff14]/60 hover:border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14]/15 text-[11px] font-mono rounded transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_8px_rgba(57,255,20,0.2)]"
            title="Toggle Sound Mode Depth (8-Bit / 16-Bit / 32-Bit / 64-Bit)"
          >
            <span className="text-gray-400 text-[10px] uppercase">Audio Mode:</span>
            <span className="font-bold pixel-font">{soundMode}</span>
          </button>
          <button
            id="TTS_Mode_Toggle_Btn"
            onClick={handleCycleTTSMode}
            className="px-2.5 py-1 bg-[#121222] border border-[#00f0ff]/60 hover:border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/15 text-[11px] font-mono rounded transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_8px_rgba(0,240,255,0.2)]"
            title="Toggle Speech System Mode (Arcade Announcer / Cybernetic / Tactical AI / Retro Vox / Off)"
          >
            <span className="text-gray-400 text-[10px] uppercase">TTS Mode:</span>
            <span className="font-bold pixel-font">{ttsMode}</span>
          </button>
          <button
            id="Quit_To_Title_Btn"
            onClick={onReturnToTitle}
            className="text-gray-400 hover:text-white hover:underline text-[11px]"
          >
            Exit to Menu
          </button>
        </div>
      </div>
    </main>
  );
};

export default PlayArea;
