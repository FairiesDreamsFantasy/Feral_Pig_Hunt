/**
 * Keyboard Input Subsystem - Prevents default auto-repeat bursts
 */
import { KeyState } from './General/index.tsx';

export * from './General/index.tsx';
export * as Touchscreen from './Touchscreen/index.tsx';

export class ArcadeKeyboardManager {
  private keyState: KeyState = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    Pause: false,
  };

  private spaceDebounce = false;
  private onPauseToggleCallback: (() => void) | null = null;
  private onFireLaserCallback: (() => void) | null = null;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  public bindEvents(onPauseToggle: () => void, onFireLaser: () => void): void {
    this.onPauseToggleCallback = onPauseToggle;
    this.onFireLaserCallback = onFireLaser;
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    window.addEventListener('keyup', this.handleKeyUp);
  }

  public unbindEvents(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === '&' || (e.shiftKey && e.key === '7') || (e.shiftKey && e.code === 'Digit7')) {
      e.preventDefault();
      if (this.onPauseToggleCallback) {
        this.onPauseToggleCallback();
      }
      return;
    }

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      e.preventDefault();
      this.keyState.ArrowLeft = true;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      e.preventDefault();
      this.keyState.ArrowRight = true;
    } else if (e.code === 'Space') {
      e.preventDefault();
      if (!this.keyState.Space && !this.spaceDebounce) {
        this.keyState.Space = true;
        this.spaceDebounce = true;
        if (this.onFireLaserCallback) {
          this.onFireLaserCallback();
        }
        setTimeout(() => {
          this.spaceDebounce = false;
        }, 120);
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.keyState.ArrowLeft = false;
    } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.keyState.ArrowRight = false;
    } else if (e.code === 'Space') {
      this.keyState.Space = false;
    }
  }

  public getKeys(): Readonly<KeyState> {
    return this.keyState;
  }
}

export default ArcadeKeyboardManager;
