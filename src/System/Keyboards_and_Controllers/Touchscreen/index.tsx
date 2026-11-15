// System/Keyboards_and_Controllers/Touchscreen/index.tsx
// Arcade touch control deck exclusively engineered for mobile phones in vertical orientation.
import React, { useCallback, useRef } from 'react';
import {
  TOUCHSCREEN_BUTTON_SPECS,
  triggerHapticFeedback,
} from './General';

export interface TouchscreenControlDeckProps {
  onMoveLeftStart: () => void;
  onMoveLeftEnd: () => void;
  onMoveRightStart: () => void;
  onMoveRightEnd: () => void;
  onFireLaserStart: () => void;
  onFireLaserEnd: () => void;
  onTogglePause: () => void;
  onReturnToTitle?: () => void;
  isPaused: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TouchscreenControlDeck: React.FC<TouchscreenControlDeckProps> = ({
  onMoveLeftStart,
  onMoveLeftEnd,
  onMoveRightStart,
  onMoveRightEnd,
  onFireLaserStart,
  onFireLaserEnd,
  onTogglePause,
  onReturnToTitle,
  isPaused,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const leftActiveRef = useRef(false);
  const rightActiveRef = useRef(false);
  const fireActiveRef = useRef(false);

  // Left button handlers
  const handleLeftDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (!leftActiveRef.current) {
      leftActiveRef.current = true;
      triggerHapticFeedback(12);
      onMoveLeftStart();
    }
  }, [onMoveLeftStart]);

  const handleLeftUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (leftActiveRef.current) {
      leftActiveRef.current = false;
      onMoveLeftEnd();
    }
  }, [onMoveLeftEnd]);

  // Right button handlers
  const handleRightDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (!rightActiveRef.current) {
      rightActiveRef.current = true;
      triggerHapticFeedback(12);
      onMoveRightStart();
    }
  }, [onMoveRightStart]);

  const handleRightUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (rightActiveRef.current) {
      rightActiveRef.current = false;
      onMoveRightEnd();
    }
  }, [onMoveRightEnd]);

  // Fire laser handlers
  const handleFireDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (!fireActiveRef.current) {
      fireActiveRef.current = true;
      triggerHapticFeedback(22);
      onFireLaserStart();
    }
  }, [onFireLaserStart]);

  const handleFireUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (fireActiveRef.current) {
      fireActiveRef.current = false;
      onFireLaserEnd();
    }
  }, [onFireLaserEnd]);

  // Pause toggle handler
  const handlePauseClick = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    triggerHapticFeedback(25);
    onTogglePause();
  }, [onTogglePause]);

  // Back to title handler
  const handleTitleClick = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    triggerHapticFeedback(20);
    if (onReturnToTitle) {
      onReturnToTitle();
    }
  }, [onReturnToTitle]);

  const leftSpec = TOUCHSCREEN_BUTTON_SPECS.LEFT_ARROW;
  const rightSpec = TOUCHSCREEN_BUTTON_SPECS.RIGHT_ARROW;
  const pauseSpec = TOUCHSCREEN_BUTTON_SPECS.PAUSE_RESUME;
  const titleSpec = TOUCHSCREEN_BUTTON_SPECS.BACK_TO_TITLE;
  const toggleSpec = TOUCHSCREEN_BUTTON_SPECS.TOGGLE_COLLAPSE;
  const fireSpec = TOUCHSCREEN_BUTTON_SPECS.FIRE_LASER;

  const handleToggleClick = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
    triggerHapticFeedback(15);
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  }, [onToggleCollapse]);

  return (
    <div
      id="Touchscreen_Arcade_Deck"
      className="w-full bg-[#0a0a12] border-t-2 border-[#00f0ff]/40 px-3 py-1.5 flex flex-col gap-1.5 touch-none shadow-[0_-8px_25px_rgba(0,0,0,0.85)] z-20 shrink-0"
      style={{ touchAction: 'none' }}
    >
      {/* Top Deck Row: System Bar with Back to Title, Controls Toggle, Pause/Resume, and Status */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {onReturnToTitle && (
            <button
              id={titleSpec.id}
              type="button"
              aria-label={titleSpec.ariaLabel}
              onClick={handleTitleClick}
              className="px-2.5 py-1 font-mono text-[11px] font-bold border border-gray-600 bg-gray-900/80 text-gray-300 hover:text-white hover:border-red-500 transition active:scale-95 flex items-center gap-1"
            >
              <span>{titleSpec.label}</span>
            </button>
          )}

          {onToggleCollapse && (
            <button
              id={toggleSpec.id}
              type="button"
              aria-label={toggleSpec.ariaLabel}
              onClick={handleToggleClick}
              className="px-2.5 py-1 font-mono text-[11px] font-bold border border-[#00f0ff]/50 bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff]/20 transition active:scale-95 flex items-center gap-1"
            >
              <span>{isCollapsed ? toggleSpec.labelCollapsed : toggleSpec.labelExpanded}</span>
            </button>
          )}

          <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest hidden md:inline">
            TOUCH DECK
          </span>
        </div>

        <button
          id={pauseSpec.id}
          type="button"
          aria-label={pauseSpec.ariaLabel}
          onClick={handlePauseClick}
          className={`px-3 py-1 font-mono text-xs font-bold border transition flex items-center gap-1.5 active:scale-95 ${
            isPaused
              ? 'bg-[#ffd700] text-black border-[#ffd700] shadow-[0_0_12px_#ffd700]'
              : 'bg-[#ffd700]/15 text-[#ffd700] border-[#ffd700]/60 hover:bg-[#ffd700]/25'
          }`}
        >
          <span>{isPaused ? '▶ RESUME' : '⏸ PAUSE'}</span>
          <span className="text-[9px] opacity-70">(&)</span>
        </button>
      </div>

      {/* Main Arcade Controls Grid: Shown when not collapsed */}
      {!isCollapsed && (
        <div className="grid grid-cols-12 gap-2 items-stretch h-20 sm:h-24">
          {/* Left Arrow Button */}
          <button
            id={leftSpec.id}
            type="button"
            aria-label={leftSpec.ariaLabel}
            onPointerDown={handleLeftDown}
            onPointerUp={handleLeftUp}
            onPointerCancel={handleLeftUp}
            onPointerLeave={handleLeftUp}
            className="col-span-3 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 active:bg-[#00f0ff]/40 border-2 border-[#00f0ff] text-[#00f0ff] flex flex-col items-center justify-center font-mono rounded shadow-[0_0_12px_rgba(0,240,255,0.25)] active:scale-95 transition-transform"
          >
            <span className="text-2xl font-black leading-none">{leftSpec.label}</span>
            <span className="text-[9px] font-bold tracking-widest mt-1 opacity-80">LEFT</span>
          </button>

          {/* Right Arrow Button */}
          <button
            id={rightSpec.id}
            type="button"
            aria-label={rightSpec.ariaLabel}
            onPointerDown={handleRightDown}
            onPointerUp={handleRightUp}
            onPointerCancel={handleRightUp}
            onPointerLeave={handleRightUp}
            className="col-span-3 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 active:bg-[#00f0ff]/40 border-2 border-[#00f0ff] text-[#00f0ff] flex flex-col items-center justify-center font-mono rounded shadow-[0_0_12px_rgba(0,240,255,0.25)] active:scale-95 transition-transform"
          >
            <span className="text-2xl font-black leading-none">{rightSpec.label}</span>
            <span className="text-[9px] font-bold tracking-widest mt-1 opacity-80">RIGHT</span>
          </button>

          {/* Tactical Fire Laser Button */}
          <button
            id={fireSpec.id}
            type="button"
            aria-label={fireSpec.ariaLabel}
            onPointerDown={handleFireDown}
            onPointerUp={handleFireUp}
            onPointerCancel={handleFireUp}
            onPointerLeave={handleFireUp}
            className="col-span-6 bg-[#ff0055]/20 hover:bg-[#ff0055]/30 active:bg-[#ff0055]/50 border-2 border-[#ff0055] text-white flex flex-col items-center justify-center font-mono rounded shadow-[0_0_18px_rgba(255,0,85,0.45)] active:scale-95 transition-transform"
          >
            <span className="text-xl font-black text-[#ff3377] tracking-wider leading-none drop-shadow-[0_0_8px_#ff0055]">
              {fireSpec.label}
            </span>
            <span className="text-[10px] font-bold text-gray-300 tracking-widest mt-1">
              CANNOU LASER
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
export default TouchscreenControlDeck;
