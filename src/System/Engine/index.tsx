import {
  ARCADE_SETTINGS,
  FeralPigAttributes,
  FeralPigSize,
  GameState,
  LaserBeam,
  Particle,
  Star,
  Vector2D,
} from '../General/index.tsx';
import { createFeralPig } from '../../Characters/Feral_Pigs/index.tsx';
import { createHogAssassinLaser } from '../../Characters/Hunters/Hog_Assassin/index.tsx';
import {
  playChargeSFX,
  playLaserShotSFX,
  playPigExplosionSFX,
  playPlayerDeathSFX,
  playHunterExplosionSFX,
  playSquealSFX,
  playSnortSFX,
  playWaveStartSFX,
  playSpatialDopplerTone
} from '../Sound/index.tsx';
import { WaveTacticalSeed } from '../AI/General/index.tsx';
import {
  calculateTacticalWaveParameters,
  calculateDynamicAITension,
  calculatePredictiveIntercept,
  PlayerSessionTelemetry,
  DynamicAITension,
  announceInGameWaveComplete,
} from '../AI/In-Game/index.tsx';
import { KeyboardMechanicalEngine } from '../Keyboards_and_Controllers/Engine/index.tsx';
import { verifyAABBCollision } from './Science/Physics/index.tsx';
import { updateRelativisticStarfield } from './Science/Graphical_Renderer/index.tsx';

export * from './General/index.tsx';
export * from './RAM_Disk/index.tsx';
export * from './Science/Physics/index.tsx';
export * from './Science/Graphical_Renderer/index.tsx';

export class ArcadeEngine {
  public state: GameState = GameState.TITLE;
  public score: number = 0;
  public highScore: number = 0;
  public lives: number = ARCADE_SETTINGS.MAX_LIVES;
  public wave: number = 1;
  public isInvulnerable: boolean = false;
  private invulnerableTimer: number = 0;
  public playerPos: Vector2D = { x: ARCADE_SETTINGS.CANVAS_WIDTH / 2, y: ARCADE_SETTINGS.CANVAS_HEIGHT - 55 };
  public playerVelocityX: number = 0;
  public lasers: LaserBeam[] = [];
  public pigs: FeralPigAttributes[] = [];
  public particles: Particle[] = [];
  public stars: Star[] = [];
  public activeTacticalSeed: WaveTacticalSeed | null = null;
  public diveCooldown: number = 120;
  public frameCount: number = 0;
  public shotsFired: number = 0;
  public shotsHit: number = 0;
  public waveClearTimes: number[] = [];
  public currentWaveStartTime: number = 0;
  public activeTensionScore: number = 1.0;
  private keyboardMechanicalEngine: KeyboardMechanicalEngine = new KeyboardMechanicalEngine();

  constructor() {
    this.initStarfield();
    this.loadHighScore();
  }

  private initStarfield(): void {
    this.stars = [];
    for (let i = 0; i < 75; i++) {
      this.stars.push({
        x: Math.random() * ARCADE_SETTINGS.CANVAS_WIDTH,
        y: Math.random() * ARCADE_SETTINGS.CANVAS_HEIGHT,
        speed: 0.5 + Math.random() * 2.2,
        size: Math.random() < 0.3 ? 2 : 1,
        color: Math.random() < 0.2 ? '#00f0ff' : Math.random() < 0.4 ? '#ffe600' : '#ffffff',
        brightness: 0.3 + Math.random() * 0.7,
      });
    }
  }

  private loadHighScore(): void {
    try {
      const saved = localStorage.getItem('feral_pig_hunt_high_score');
      if (saved) this.highScore = parseInt(saved, 10) || 0;
    } catch {
      this.highScore = 0;
    }
  }

  public saveHighScore(): void {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      try {
        localStorage.setItem('feral_pig_hunt_high_score', this.highScore.toString());
      } catch {
        // localStorage safety
      }
    }
  }

  public startNewGame(customSeed?: WaveTacticalSeed | null): void {
    this.score = 0;
    this.lives = ARCADE_SETTINGS.MAX_LIVES;
    this.wave = 1;
    this.lasers = [];
    this.particles = [];
    this.playerPos = { x: ARCADE_SETTINGS.CANVAS_WIDTH / 2, y: ARCADE_SETTINGS.CANVAS_HEIGHT - 55 };
    this.playerVelocityX = 0;
    this.state = GameState.PLAYING;
    this.isInvulnerable = false;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.waveClearTimes = [];
    this.spawnWave(customSeed);
    playWaveStartSFX();
  }

  public spawnWave(customSeed?: WaveTacticalSeed | null): void {
    this.pigs = [];
    this.lasers = [];
    this.currentWaveStartTime = this.frameCount;
    this.activeTacticalSeed = calculateTacticalWaveParameters(this.wave, customSeed);
    const rows = 4;
    const cols = 9;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pig = createFeralPig({
          row: r,
          col: c,
          canvasWidth: ARCADE_SETTINGS.CANVAS_WIDTH,
          isSpotted: Math.random() < this.activeTacticalSeed.spottedRatio,
        });
        this.pigs.push(pig);
      }
    }
    this.diveCooldown = 90;
  }

  public updateWaveTacticalSeed(seed: WaveTacticalSeed): void {
    if (seed) {
      this.activeTacticalSeed = calculateTacticalWaveParameters(this.wave, seed);
    }
  }

  public fireLaser(): void {
    if (this.state !== GameState.PLAYING) return;
    if (this.lasers.length >= ARCADE_SETTINGS.MAX_PLAYER_LASERS) return;
    const laser = createHogAssassinLaser(this.playerPos);
    this.lasers.push(laser);
    this.shotsFired++;
    playLaserShotSFX();
  }

  public togglePause(): void {
    if (this.state === GameState.PLAYING) {
      this.state = GameState.PAUSED;
    } else if (this.state === GameState.PAUSED) {
      this.state = GameState.PLAYING;
    }
  }

  public update(arrowLeft: boolean, arrowRight: boolean): void {
    updateRelativisticStarfield(this.stars, this.playerVelocityX, ARCADE_SETTINGS.CANVAS_HEIGHT);

    if (this.state !== GameState.PLAYING) return;
    this.frameCount++;

    const telemetry: PlayerSessionTelemetry = {
      shotsFired: this.shotsFired,
      shotsHit: this.shotsHit,
      waveClearTimes: this.waveClearTimes,
      currentWaveDuration: (this.frameCount - this.currentWaveStartTime) * 0.03,
      livesRemaining: this.lives,
      playerPos: this.playerPos,
      playerVelocityX: this.playerVelocityX,
    };
    const aiTension = calculateDynamicAITension(telemetry);
    this.activeTensionScore = aiTension.tensionScore;

    let inputDir = 0;
    if (arrowLeft) inputDir = -1;
    else if (arrowRight) inputDir = 1;

    this.playerVelocityX = this.keyboardMechanicalEngine.computeMechanicalVelocity(inputDir);
    this.playerPos.x += this.playerVelocityX;

    const margin = 28;
    if (this.playerPos.x < margin) this.playerPos.x = margin;
    if (this.playerPos.x > ARCADE_SETTINGS.CANVAS_WIDTH - margin) {
      this.playerPos.x = ARCADE_SETTINGS.CANVAS_WIDTH - margin;
    }

    if (this.isInvulnerable) {
      this.invulnerableTimer--;
      if (this.invulnerableTimer <= 0) {
        this.isInvulnerable = false;
      }
    }

    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const laser = this.lasers[i];
      laser.y += laser.vy;
      if (laser.y < -30) {
        this.lasers.splice(i, 1);
      }
    }

    const timeSec = this.frameCount * 0.03;
    const waveMult = this.activeTacticalSeed ? this.activeTacticalSeed.waveSpeedMultiplier : 1.0;
    const formationOffsetX = Math.sin(timeSec * waveMult) * 35;
    const formationOffsetY = Math.cos(timeSec * 0.5) * 8;

    this.diveCooldown--;
    if (this.diveCooldown <= 0 && this.pigs.length > 0) {
      const availablePigs = this.pigs.filter((p) => !p.isDiving);
      if (availablePigs.length > 0) {
        const diver = availablePigs[Math.floor(Math.random() * availablePigs.length)];
        diver.isDiving = true;
        diver.diveProgress = 0;
        diver.diveTimer = 0;

        const relPan = (diver.position.x - this.playerPos.x) / (ARCADE_SETTINGS.CANVAS_WIDTH / 2);
        playChargeSFX(diver.size === FeralPigSize.GIANT ? 0.65 : 1.1, relPan);

        const baseSpeedY = 3.5 * (this.activeTacticalSeed ? this.activeTacticalSeed.diveAggression : 1.0);
        if (aiTension.predictiveCharge) {
          const interceptX = calculatePredictiveIntercept(
            diver.position,
            baseSpeedY,
            this.playerPos,
            this.playerVelocityX
          );
          diver.velocity = {
            x: (interceptX - diver.position.x) * 0.018,
            y: baseSpeedY * (aiTension.tensionScore * 0.35 + 0.65),
          };
        } else {
          diver.velocity = {
            x: (this.playerPos.x - diver.position.x) * 0.015,
            y: baseSpeedY * (aiTension.tensionScore * 0.35 + 0.65),
          };
        }
      }
      this.diveCooldown = Math.max(30, Math.floor((120 - this.wave * 10) / aiTension.diveFrequencyMultiplier));
    }

    for (let i = this.pigs.length - 1; i >= 0; i--) {
      const pig = this.pigs[i];
      if (!pig.isDiving) {
        pig.position.x = pig.originPosition.x + formationOffsetX;
        pig.position.y = pig.originPosition.y + formationOffsetY;
      } else {
        const rho = 1.225;
        const Cd = 0.47;
        let A = 0.3;
        let mass = 80.0;
        if (pig.size === FeralPigSize.GIANT) {
          A = 0.8;
          mass = 350.0;
        } else if (pig.size === FeralPigSize.LARGE) {
          A = 0.5;
          mass = 160.0;
        } else if (pig.size === FeralPigSize.MEDIUM) {
          A = 0.3;
          mass = 80.0;
        } else if (pig.size === FeralPigSize.SMALL) {
          A = 0.15;
          mass = 35.0;
        }

        const vx = pig.velocity.x;
        const vy = pig.velocity.y;
        const F_drag_x = -0.5 * rho * vx * Math.abs(vx) * Cd * A;
        const F_drag_y = -0.5 * rho * vy * Math.abs(vy) * Cd * A;
        const a_drag_x = F_drag_x / mass;
        const a_drag_y = F_drag_y / mass;

        const G = 0.04;
        const M_player = 25000.0;
        const dx = this.playerPos.x - pig.position.x;
        const dy = this.playerPos.y - pig.position.y;
        const rSq = dx * dx + dy * dy;
        const distance = Math.sqrt(rSq) || 1.0;
        const clampedRSq = Math.max(900.0, rSq);

        const a_grav_scalar = (G * M_player) / clampedRSq;
        const a_grav_x = a_grav_scalar * (dx / distance);
        const a_grav_y = a_grav_scalar * (dy / distance);

        const dt = 0.16;
        pig.velocity.x += (a_grav_x + a_drag_x) * dt;
        pig.velocity.y += (a_grav_y + a_drag_y) * dt;

        if (aiTension.zigZagFactor > 0) {
          // High tension triggers erratic thrashing zigzag pattern
          pig.velocity.x += Math.sin(this.frameCount * 0.18 + i) * aiTension.zigZagFactor * 0.28;
        }

        pig.position.x += pig.velocity.x;
        pig.position.y += pig.velocity.y;
        pig.diveAngle = Math.atan2(pig.velocity.y, pig.velocity.x) - Math.PI / 2;

        if (this.frameCount % 25 === 0) {
          let baseFreq = 440;
          if (pig.size === FeralPigSize.GIANT) baseFreq = 180;
          else if (pig.size === FeralPigSize.LARGE) baseFreq = 300;

          playSpatialDopplerTone({
            emitterPos: pig.position,
            emitterVelocity: pig.velocity,
            observerPos: this.playerPos,
            observerVelocity: { x: this.playerVelocityX, y: 0 },
            emittedFrequency: baseFreq,
          }, 0.2, 'sawtooth', 0.12);
        }

        // Trigger highly realistic spatialized snorts & squeals while charging down
        if (this.frameCount % 50 === (i % 50)) {
          const pigPan = (pig.position.x - this.playerPos.x) / (ARCADE_SETTINGS.CANVAS_WIDTH / 2);
          if (Math.random() < 0.45) {
            playSquealSFX(pig.size === FeralPigSize.GIANT ? 0.65 : 1.1, pigPan);
          } else {
            playSnortSFX(pig.size === FeralPigSize.GIANT ? 0.75 : 1.1, pigPan);
          }
        }

        if (pig.position.y > ARCADE_SETTINGS.CANVAS_HEIGHT + 40) {
          pig.position.y = -30;
          pig.position.x = pig.originPosition.x;
          pig.isDiving = false;
          pig.diveAngle = 0;
        }
      }

      if (!this.isInvulnerable) {
        const pigBox = { x: pig.position.x - 14, y: pig.position.y - 12, width: 28, height: 24 };
        const playerBox = { x: this.playerPos.x - 16, y: this.playerPos.y - 16, width: 32, height: 32 };
        if (verifyAABBCollision(pigBox, playerBox)) {
          this.triggerPlayerDeath();
          break;
        }
      }

      const pigWidth = pig.size === FeralPigSize.GIANT ? 36 : pig.size === FeralPigSize.LARGE ? 28 : 22;
      const pigBox = { x: pig.position.x - pigWidth / 2, y: pig.position.y - 14, width: pigWidth, height: 28 };

      for (let l = this.lasers.length - 1; l >= 0; l--) {
        const laser = this.lasers[l];
        const laserBox = { x: laser.x - 3, y: laser.y - 18, width: 6, height: 24 };
        if (verifyAABBCollision(pigBox, laserBox)) {
          this.lasers.splice(l, 1);
          this.shotsHit++;
          pig.hp--;
          const hitPan = (pig.position.x - this.playerPos.x) / (ARCADE_SETTINGS.CANVAS_WIDTH / 2);
          if (pig.hp <= 0) {
            const isLarge = pig.size === FeralPigSize.GIANT || pig.size === FeralPigSize.LARGE;
            const pointsAwarded = pig.isDiving ? pig.points + 150 : pig.points;
            this.score += pointsAwarded;
            this.saveHighScore();
            this.createExplosion(pig.position.x, pig.position.y, isLarge ? 25 : 14, pig.color);
            playPigExplosionSFX(isLarge, hitPan);
            playSquealSFX(pig.size === FeralPigSize.GIANT ? 0.6 : 1.2, hitPan);
            this.pigs.splice(i, 1);
          } else {
            this.createSparks(pig.position.x, pig.position.y, 6);
            playPigExplosionSFX(false, hitPan);
          }
          break;
        }
      }
    }

    if (this.pigs.length === 0) {
      const waveDurationFrames = this.frameCount - this.currentWaveStartTime;
      const waveDurationSeconds = waveDurationFrames * 0.03;
      this.waveClearTimes.push(waveDurationSeconds);
      const completedWave = this.wave;
      this.wave++;
      this.spawnWave(this.activeTacticalSeed);
      playWaveStartSFX();
      announceInGameWaveComplete(completedWave, this.score, this.activeTensionScore);
    }

    for (let p = this.particles.length - 1; p >= 0; p--) {
      const part = this.particles[p];
      part.x += part.vx;
      part.y += part.vy;
      part.life--;
      if (part.life <= 0) {
        this.particles.splice(p, 1);
      }
    }
  }

  private triggerPlayerDeath(): void {
    this.lives--;
    this.createExplosion(this.playerPos.x, this.playerPos.y, 35, 'Cyan');
    playHunterExplosionSFX();
    playPlayerDeathSFX();
    if (this.lives <= 0) {
      this.saveHighScore();
      this.state = GameState.GAME_OVER;
    } else {
      this.isInvulnerable = true;
      this.invulnerableTimer = 150;
      this.playerPos.x = ARCADE_SETTINGS.CANVAS_WIDTH / 2;
    }
  }

  public createExplosion(x: number, y: number, count: number, _baseColorName: string): void {
    const colors = ['#ffffff', '#ffe600', '#ff3131', '#ff9900', '#00f0ff'];
    // Bound particle list to MAX_PARTICLES (120) to prevent CPU/memory spikes under heavy fire
    if (this.particles.length > 120) {
      this.particles.splice(0, this.particles.length - 80);
    }
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        id: `p_${(this.frameCount + i) % 1000}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[i % colors.length],
        size: 2 + Math.random() * 3,
        life: 25 + (i % 20),
        maxLife: 45,
      });
    }
  }

  private createSparks(x: number, y: number, count: number): void {
    if (this.particles.length > 120) {
      this.particles.splice(0, this.particles.length - 80);
    }
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        id: `sp_${(this.frameCount + i) % 1000}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#ffff00',
        size: 2,
        life: 12,
        maxLife: 12,
      });
    }
  }
}

export default ArcadeEngine;
