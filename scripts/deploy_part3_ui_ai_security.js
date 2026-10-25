/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const ROOT = process.cwd();

function write(relPath, content) {
  const full = path.join(ROOT, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log(`[Part 3] Created: ${relPath}`);
}

// 1. src/System/General & Registry
write("src/System/General/index.tsx", `export * from '../../General/index.tsx';
export const SystemInfo = { name: 'System Core Registry', category: 'System', status: 'active' };
export default SystemInfo;
`);

write("src/System/Registry/General/index.tsx", `export interface RegistryNode {
  path: string;
  description: string;
  status: 'active' | 'inactive';
  meta?: Record<string, any>;
}

export const BUILD_VERSION = "V0.1";
export const BUILD_DATE = "2026-08-15";

export const MASTER_REGISTRY: Record<string, RegistryNode> = {
  "UI/": { path: "UI/", description: "Root UI element manager", status: "active" },
  "UI/Landing_Page/": { path: "UI/Landing_Page/", description: "Main intro landing stage", status: "active" },
  "UI/Landing_Page/Version/": { path: "UI/Landing_Page/Version/", description: "Gold-bordered version badge", status: "active", meta: { version: BUILD_VERSION, buildDate: BUILD_DATE } },
  "UI/Play_Area/": { path: "UI/Play_Area/", description: "Action gameplay viewport wrapper", status: "active" },
  "UI/Play_Area/Main/Game_View/": { path: "UI/Play_Area/Main/Game_View/", description: "Canvas holding aria-label of 'Feral Pig Hunt Game View'", status: "active" },
  "Engine/": { path: "Engine/", description: "Fixed-shooter physics and collision detection", status: "active" },
  "Keyboard_and_Controllers/": { path: "Keyboard_and_Controllers/", description: "Mass-spring-damper keyboard mechanics", status: "active" },
  "Visuals/": { path: "Visuals/", description: "Relativistic starfield aberration and Doppler shift", status: "active" },
  "Sound/": { path: "Sound/", description: "Multi-bitrate oscillator synthesis engine", status: "active" },
  "AI/": { path: "AI/", description: "Tactical algorithms and Gemini AI seed generator", status: "active" },
};

export function lookupRegistry(p: string): RegistryNode | undefined {
  return MASTER_REGISTRY[p];
}

export default { MASTER_REGISTRY, BUILD_VERSION, BUILD_DATE, lookupRegistry };
`);

write("src/System/Registry/index.tsx", `import { MASTER_REGISTRY, BUILD_VERSION, BUILD_DATE, lookupRegistry } from './General/index.tsx';
export * from './General/index.tsx';
export default { registry: MASTER_REGISTRY, version: BUILD_VERSION, buildDate: BUILD_DATE, lookup: lookupRegistry };
`);

// 2. src/System/Engine (Main Game Loop)
write("src/System/Engine/General/index.tsx", `import { ARCADE_SETTINGS, BoundingBox } from '../../General/index.tsx';

export function checkAABBCollision(box1: BoundingBox, box2: BoundingBox): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  );
}

export const EngineGeneral = { tickRate: 60, settings: ARCADE_SETTINGS, checkAABBCollision };
export default EngineGeneral;
`);

write("src/System/Engine/index.tsx", `import {
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
  playWaveStartSFX,
  playSpatialDopplerTone
} from '../Sound/index.tsx';
import { checkAABBCollision } from './General/index.tsx';
import { WaveTacticalSeed } from '../AI/General/index.tsx';
import { calculateTacticalWaveParameters } from '../AI/In-Game/index.tsx';
import { KeyboardMechanicalEngine } from '../Keyboards_and_Controllers/Engine/index.tsx';
import { applyRelativisticStarfield } from '../Visuals/Engine/index.tsx';

export * from './General/index.tsx';

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
    this.spawnWave(customSeed);
    playWaveStartSFX();
  }

  public spawnWave(customSeed?: WaveTacticalSeed | null): void {
    this.pigs = [];
    this.lasers = [];
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

  public fireLaser(): void {
    if (this.state !== GameState.PLAYING) return;
    if (this.lasers.length >= ARCADE_SETTINGS.MAX_PLAYER_LASERS) return;
    const laser = createHogAssassinLaser(this.playerPos);
    this.lasers.push(laser);
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
    this.stars.forEach((star) => {
      star.y += star.speed;
      if (star.y > ARCADE_SETTINGS.CANVAS_HEIGHT) {
        star.y = 0;
        star.x = Math.random() * ARCADE_SETTINGS.CANVAS_WIDTH;
      }
    });
    applyRelativisticStarfield(this.stars, this.playerVelocityX, ARCADE_SETTINGS.CANVAS_WIDTH);

    if (this.state !== GameState.PLAYING) return;
    this.frameCount++;

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
        diver.velocity = {
          x: (this.playerPos.x - diver.position.x) * 0.015,
          y: 3.5 * (this.activeTacticalSeed ? this.activeTacticalSeed.diveAggression : 1.0),
        };
        playChargeSFX(diver.size === FeralPigSize.GIANT ? 0.7 : 1.1);
      }
      this.diveCooldown = Math.max(45, 120 - this.wave * 10);
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
        if (checkAABBCollision(pigBox, playerBox)) {
          this.triggerPlayerDeath();
          break;
        }
      }

      const pigWidth = pig.size === FeralPigSize.GIANT ? 36 : pig.size === FeralPigSize.LARGE ? 28 : 22;
      const pigBox = { x: pig.position.x - pigWidth / 2, y: pig.position.y - 14, width: pigWidth, height: 28 };

      for (let l = this.lasers.length - 1; l >= 0; l--) {
        const laser = this.lasers[l];
        const laserBox = { x: laser.x - 3, y: laser.y - 18, width: 6, height: 24 };
        if (checkAABBCollision(pigBox, laserBox)) {
          this.lasers.splice(l, 1);
          pig.hp--;
          if (pig.hp <= 0) {
            const isLarge = pig.size === FeralPigSize.GIANT || pig.size === FeralPigSize.LARGE;
            const pointsAwarded = pig.isDiving ? pig.points + 150 : pig.points;
            this.score += pointsAwarded;
            this.saveHighScore();
            this.createExplosion(pig.position.x, pig.position.y, isLarge ? 25 : 14, pig.color);
            playPigExplosionSFX(isLarge);
            playSquealSFX(pig.size === FeralPigSize.GIANT ? 0.6 : 1.2);
            this.pigs.splice(i, 1);
          } else {
            this.createSparks(pig.position.x, pig.position.y, 6);
            playPigExplosionSFX(false);
          }
          break;
        }
      }
    }

    if (this.pigs.length === 0) {
      this.wave++;
      this.spawnWave(this.activeTacticalSeed);
      playWaveStartSFX();
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
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        id: \`p_\${Date.now()}_\${Math.random()}\`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 3,
        life: 25 + Math.floor(Math.random() * 20),
        maxLife: 45,
      });
    }
  }

  private createSparks(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        id: \`spark_\${Date.now()}_\${Math.random()}\`,
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
`);

// 3. src/System/AI
write("src/System/AI/General/index.tsx", `export interface GeminiModelOption {
  id: string;
  name: string;
  recommended: boolean;
}

export const AVAILABLE_GEMINI_MODELS: GeminiModelOption[] = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Ultra-Fast Response)', recommended: true },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Deep Tactical Analysis)', recommended: false },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Legacy Speed)', recommended: false },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Rich Context)', recommended: false },
];

export interface WaveTacticalSeed {
  seedNumber: number;
  waveSpeedMultiplier: number;
  diveAggression: number;
  spottedRatio: number;
  formationPattern: 'standard_grid' | 'v_formation' | 'honeycomb' | 'delta_wing';
  pigQuotes: string[];
}

export const DEFAULT_TACTICAL_SEED: WaveTacticalSeed = {
  seedNumber: 42,
  waveSpeedMultiplier: 1.0,
  diveAggression: 1.0,
  spottedRatio: 0.25,
  formationPattern: 'standard_grid',
  pigQuotes: [
    'Oink! Invasive brigade advancing!',
    'Protect the oak acorn cache!',
    'Charge through the southern perimeter!'
  ],
};

export default DEFAULT_TACTICAL_SEED;
`);

write("src/System/AI/In-Game/General/index.tsx", `export const InGameAIGeneral = { type: 'Deterministic_Pseudorandom_Generator', maxDivingPigsPerWave: 4 }; export default InGameAIGeneral;`);
write("src/System/AI/In-Game/index.tsx", `import { WaveTacticalSeed, DEFAULT_TACTICAL_SEED } from '../General/index.tsx';
export * from './General/index.tsx';

export function calculateTacticalWaveParameters(waveNumber: number, customSeed?: WaveTacticalSeed | null): WaveTacticalSeed {
  if (customSeed) {
    return {
      ...customSeed,
      waveSpeedMultiplier: customSeed.waveSpeedMultiplier * (1 + (waveNumber - 1) * 0.08),
      diveAggression: customSeed.diveAggression * (1 + (waveNumber - 1) * 0.12),
    };
  }
  const baseMultiplier = 1.0 + (waveNumber - 1) * 0.08;
  return {
    ...DEFAULT_TACTICAL_SEED,
    seedNumber: waveNumber * 1337,
    waveSpeedMultiplier: baseMultiplier,
    diveAggression: Math.min(2.5, 1.0 + (waveNumber - 1) * 0.15),
    spottedRatio: Math.min(0.6, 0.2 + waveNumber * 0.05),
  };
}

export default { calculateTacticalWaveParameters };
`);

write("src/System/AI/External/General/index.tsx", `export const ExternalAIGeneral = { provider: 'Google Gemini', timeoutMs: 8000 }; export default ExternalAIGeneral;`);
write("src/System/AI/External/Gemini/General/index.tsx", `export const GeminiGeneralInfo = { provider: 'Google Gemini', timeoutMs: 8000 }; export default GeminiGeneralInfo;`);
write("src/System/AI/External/Gemini/index.tsx", `import { GoogleGenAI } from '@google/genai';
import { WaveTacticalSeed } from '../../General/index.tsx';

export async function testGeminiAPIKey(apiKey: string, modelName: string = 'gemini-2.5-flash'): Promise<{ success: boolean; message: string }> {
  try {
    if (!apiKey || apiKey.trim().length === 0) {
      return { success: false, message: 'Please enter a valid Gemini API key.' };
    }
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const response = await ai.models.generateContent({
      model: modelName,
      contents: 'Respond with the exact single word: READY',
    });
    if (response && response.text) {
      return { success: true, message: \`Connected successfully to \${modelName}!\` };
    }
    return { success: false, message: 'Received empty response from Gemini server.' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, message: \`Connection test failed: \${errorMsg}\` };
  }
}

export async function generateAITacticalSeed(apiKey: string, modelName: string = 'gemini-2.5-flash', waveNumber: number): Promise<WaveTacticalSeed | null> {
  try {
    if (!apiKey) return null;
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const prompt = \`You are the Tactical Ecosystem AI for an arcade shooter game "Feral Pig Hunt". Generate a JSON object for Wave \${waveNumber} with: - seedNumber: integer between 1000 and 99999 - waveSpeedMultiplier: float between 1.05 and 1.85 - diveAggression: float between 1.0 and 2.4 - spottedRatio: float between 0.2 and 0.7 - formationPattern: one of ["standard_grid", "v_formation", "honeycomb", "delta_wing"] - pigQuotes: array of 3 short humorous retro pig battle cry lines Return ONLY valid JSON without markdown wrapping.\`;
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    const text = response.text || '';
    const cleanJson = text.replace(/\\\`\\\`\\\`json/g, '').replace(/\\\`\\\`\\\`/g, '').trim();
    return JSON.parse(cleanJson) as WaveTacticalSeed;
  } catch (e) {
    console.warn('Fallback to algorithmic seed due to AI query notice:', e);
    return null;
  }
}

export default { testGeminiAPIKey, generateAITacticalSeed };
`);

write("src/System/AI/External/index.tsx", `export * from './General/index.tsx'; export * from './Gemini/index.tsx'; export default { module: 'External AI Connectors' };`);
write("src/System/AI/index.tsx", `export * from './General/index.tsx'; export * from './In-Game/index.tsx'; export * from './External/index.tsx'; export default { subsystem: 'AI Intelligence' };`);

// 4. src/System/UI
write("src/System/UI/General/index.tsx", `export const UIGeneralInfo = { name: 'User Interface Hierarchy', status: 'active' }; export default UIGeneralInfo;`);
write("src/System/UI/Landing_Page/General/index.tsx", `export const LandingPageGeneral = { version: '1.0.0', license: 'CC By-SA 4.0 - Open-Source - GPL V3' }; export default LandingPageGeneral;`);
write("src/System/UI/Landing_Page/Version/index.tsx", `import React from 'react';
import { BUILD_VERSION, BUILD_DATE } from '../../../Registry/General/index.tsx';

export const VersionBadge: React.FC = () => {
  return (
    <div
      id="Version_Badge"
      className="inline-flex flex-col items-center justify-center border-2 border-[#ffd700] bg-[#86efac] text-black font-mono font-bold text-xs px-4 py-2 shadow-[0_0_12px_rgba(255,215,0,0.4)]"
      style={{ borderRadius: '4px' }}
    >
      <div className="uppercase tracking-wide text-[10px] text-black/75">Arcade Build</div>
      <div className="text-sm font-black text-black">{BUILD_VERSION}</div>
      <div className="text-[9px] font-semibold text-black/90 mt-0.5">{BUILD_DATE}</div>
    </div>
  );
};

export default VersionBadge;
`);

write("src/System/UI/Landing_Page/index.tsx", `import React from 'react';
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
`);

write("src/System/UI/Modal/General/index.tsx", `export interface ModalProps { isOpen: boolean; onClose: () => void; } export const ModalGeneral = { backdropColor: 'rgba(0, 0, 0, 0.85)' }; export default ModalGeneral;`);
write("src/System/UI/Modal/Insert_AI/General/index.tsx", `export interface InsertAIProps { isOpen: boolean; onClose: () => void; currentApiKey: string; currentModel: string; onSetAIConfig: (apiKey: string, model: string) => void; } export const InsertAIGeneral = { title: 'Insert AI' }; export default InsertAIGeneral;`);
write("src/System/UI/Modal/Insert_AI/Gemini/General/index.tsx", `export const GeminiModalGeneral = { provider: 'Google Gemini Studio' }; export default GeminiModalGeneral;`);
write("src/System/UI/Modal/Insert_AI/Gemini/index.tsx", `import React, { useState } from 'react';
import { AVAILABLE_GEMINI_MODELS } from '../../../../AI/General/index.tsx';
import { testGeminiAPIKey } from '../../../../AI/External/Gemini/index.tsx';
import { InsertAIProps } from '../General/index.tsx';

export const InsertAIGeminiModal: React.FC<InsertAIProps> = ({
  isOpen,
  onClose,
  currentApiKey,
  currentModel,
  onSetAIConfig,
}) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [selectedModel, setSelectedModel] = useState(currentModel || 'gemini-2.5-flash');
  const [testStatus, setTestStatus] = useState<{ testing: boolean; message: string; success?: boolean } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTestStatus({ testing: true, message: 'Testing connection to Gemini...' });
    const result = await testGeminiAPIKey(apiKey, selectedModel);
    setTestStatus({ testing: false, message: result.message, success: result.success });
  };

  const handleClear = () => {
    setApiKey('');
    setTestStatus(null);
  };

  const handleSet = () => {
    onSetAIConfig(apiKey.trim(), selectedModel);
    onClose();
  };

  return (
    <div
      id="Insert_AI_Modal_Backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="Insert_AI_Modal_Container"
        className="w-full max-w-lg bg-[#0d0d14] border-2 border-[#00f0ff] p-6 text-white shadow-[0_0_25px_rgba(0,240,255,0.4)]"
      >
        <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-3 mb-4">
          <h2 id="Insert_AI_Heading" className="text-xl font-bold tracking-wider text-[#00f0ff] pixel-font">
            Insert AI
          </h2>
          <button
            id="Modal_Close_Btn"
            onClick={onClose}
            className="text-gray-400 hover:text-white px-2 py-1 border border-gray-700 hover:border-red-500 font-mono text-sm"
          >
            [ESC / X]
          </button>
        </div>
        <p className="text-sm text-gray-300 mb-4 font-mono leading-relaxed">
          Configure Google Gemini AI to generate custom pseudorandom tactical wave formations, dynamic diving aggression algorithms, and battle commentary for each wave.
        </p>
        <div className="space-y-4 font-mono text-sm">
          <div>
            <label htmlFor="Gemini_API_Key_Field" className="block text-xs uppercase text-gray-400 mb-1">
              Gemini API Key:
            </label>
            <input
              id="Gemini_API_Key_Field"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key..."
              className="w-full bg-[#14141f] border border-[#2a2a3c] focus:border-[#00f0ff] px-3 py-2 text-white font-mono text-sm outline-none transition"
            />
          </div>
          <div>
            <label htmlFor="Gemini_Model_Select" className="block text-xs uppercase text-gray-400 mb-1">
              Gemini Model:
            </label>
            <select
              id="Gemini_Model_Select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-[#14141f] border border-[#2a2a3c] focus:border-[#00f0ff] px-3 py-2 text-white font-mono text-sm outline-none"
            >
              {AVAILABLE_GEMINI_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          {testStatus && (
            <div
              id="Test_Status_Box"
              className={\`p-3 text-xs border \${
                testStatus.testing
                  ? 'border-yellow-500/50 bg-yellow-950/30 text-yellow-300'
                  : testStatus.success
                  ? 'border-green-500/50 bg-green-950/30 text-green-300'
                  : 'border-red-500/50 bg-red-950/30 text-red-300'
              }\`}
            >
              {testStatus.message}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#1f1f2e]">
            <div className="flex items-center gap-2">
              <button
                id="AI_Test_Button"
                type="button"
                onClick={handleTest}
                disabled={testStatus?.testing}
                className="px-4 py-2 border border-[#ffe600] text-[#ffe600] hover:bg-[#ffe600]/20 text-xs uppercase tracking-wider font-bold transition disabled:opacity-50"
              >
                {testStatus?.testing ? 'Testing...' : 'Test'}
              </button>
              <button
                id="AI_Clear_Button"
                type="button"
                onClick={handleClear}
                className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-800 text-xs uppercase tracking-wider font-bold transition"
              >
                Clear
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="AI_Cancel_Button"
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-700 text-gray-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                id="AI_Set_Button"
                type="button"
                onClick={handleSet}
                className="px-5 py-2 bg-[#39ff14] text-black hover:bg-[#32e012] text-xs uppercase tracking-wider font-bold transition shadow-[0_0_12px_rgba(57,255,20,0.5)]"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertAIGeminiModal;
`);

write("src/System/UI/Modal/Insert_AI/index.tsx", `export * from './General/index.tsx'; export * from './Gemini/index.tsx'; export default { modal: 'Insert AI Manager' };`);
write("src/System/UI/Modal/index.tsx", `export * from './General/index.tsx'; export * from './Insert_AI/index.tsx'; export default { module: 'Modal Subsystem' };`);

write("src/System/UI/Play_Area/General/index.tsx", `export const PlayAreaGeneral = { canvasWidth: 800, canvasHeight: 600 }; export default PlayAreaGeneral;`);
write("src/System/UI/Play_Area/index.tsx", `import React, { useEffect, useRef, useState } from 'react';
import { ARCADE_SETTINGS, GameState } from '../../General/index.tsx';
import ArcadeEngine from '../../Engine/index.tsx';
import ArcadeKeyboardManager from '../../Keyboards_and_Controllers/index.tsx';
import { clearUltraBlackCanvas } from '../../Visuals/Engine/index.tsx';
import { renderHogAssassin, renderLaserBeam } from '../../../Characters/Hunters/Hog_Assassin/index.tsx';
import { renderFeralPig } from '../../../Characters/Feral_Pigs/index.tsx';
import { startArcadeBGM, stopArcadeBGM, playPauseSFX, playResumeSFX, getSoundMode, setSoundMode, SoundMode } from '../../Sound/index.tsx';
import { generateAITacticalSeed } from '../../AI/External/Gemini/index.tsx';

export * from './General/index.tsx';

interface PlayAreaProps {
  onReturnToTitle: () => void;
  apiKey: string;
  model: string;
}

export const PlayArea: React.FC<PlayAreaProps> = ({ onReturnToTitle, apiKey, model }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ArcadeEngine>(new ArcadeEngine());
  const keyboardRef = useRef<ArcadeKeyboardManager>(new ArcadeKeyboardManager());
  const [soundMode, setSoundModeState] = useState<SoundMode>(getSoundMode());
  const [hudState, setHudState] = useState({
    score: 0,
    highScore: 0,
    lives: 3,
    wave: 1,
    gameState: GameState.PLAYING,
    quote: '',
  });

  useEffect(() => {
    const engine = engineRef.current;
    const keyboard = keyboardRef.current;

    startArcadeBGM();

    if (apiKey) {
      generateAITacticalSeed(apiKey, model, 1).then((seed) => {
        engine.startNewGame(seed);
        if (seed && seed.pigQuotes && seed.pigQuotes.length > 0) {
          setHudState((prev) => ({ ...prev, quote: seed.pigQuotes[0] }));
        }
      });
    } else {
      engine.startNewGame(null);
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
            ctx.fillText(\`Final Score: \${engine.score.toLocaleString()} PTS\`, ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 + 10);
            ctx.fillText(\`High Score: \${engine.highScore.toLocaleString()} PTS\`, ARCADE_SETTINGS.CANVAS_WIDTH / 2, ARCADE_SETTINGS.CANVAS_HEIGHT / 2 + 35);
          }
        }
      }

      setHudState({
        score: engine.score,
        highScore: engine.highScore,
        lives: engine.lives,
        wave: engine.wave,
        gameState: engine.state,
        quote: hudState.quote,
      });
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      keyboard.unbindEvents();
      stopArcadeBGM();
    };
  }, [apiKey, model]);

  const handleRestart = () => {
    engineRef.current.startNewGame(null);
    startArcadeBGM();
  };

  const handleCycleSoundMode = () => {
    const modes: SoundMode[] = ['8-Bit', '16-Bit', '32-Bit', '64-Bit'];
    const currentIndex = modes.indexOf(soundMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setSoundMode(nextMode);
    setSoundModeState(nextMode);
  };

  return (
    <main id="Main" className="min-h-screen w-full flex flex-col items-center justify-center bg-black p-2 select-none">
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
        </div>
        <div className="flex items-center gap-6">
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
                  className={\`w-4 h-4 transition \${
                    lifeIdx < hudState.lives
                      ? 'text-[#00f0ff] opacity-100'
                      : 'text-gray-700 opacity-30'
                  }\`}
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
`);

write("src/System/UI/index.tsx", `export * from './General/index.tsx';
export * from './Landing_Page/index.tsx';
export * from './Play_Area/index.tsx';
export * from './Modal/index.tsx';
export default { subsystem: 'UI Aggregator' };
`);

write("src/System/index.tsx", `export * from './General/index.tsx';
export { default as SystemRegistry } from './Registry/index.tsx';
export const SystemVersion = 'V0.1';
export const SystemName = 'Feral Pig Hunt Client Core System';
export default { version: SystemVersion, name: SystemName };
`);

// 5. Root Application Entry Points
write("src/App.tsx", `import { useState } from 'react';
import { LandingPage } from './System/UI/Landing_Page/index.tsx';
import { PlayArea } from './System/UI/Play_Area/index.tsx';
import { InsertAIGeminiModal } from './System/UI/Modal/Insert_AI/Gemini/index.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<'LANDING' | 'PLAY_AREA'>('LANDING');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [highScore] = useState(() => {
    try {
      const saved = localStorage.getItem('feral_pig_hunt_high_score');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const handleStartGame = () => {
    setCurrentView('PLAY_AREA');
  };

  const handleReturnToTitle = () => {
    setCurrentView('LANDING');
  };

  const handleSetAIConfig = (newKey: string, newModel: string) => {
    setApiKey(newKey);
    setAiModel(newModel);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-[#39ff14] selection:text-black">
      {currentView === 'LANDING' ? (
        <LandingPage
          onStartGame={handleStartGame}
          onOpenInsertAI={() => setIsAIModalOpen(true)}
          hasAIConfigured={Boolean(apiKey && apiKey.trim().length > 0)}
          highScore={highScore}
        />
      ) : (
        <PlayArea
          onReturnToTitle={handleReturnToTitle}
          apiKey={apiKey}
          model={aiModel}
        />
      )}

      <InsertAIGeminiModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentApiKey={apiKey}
        currentModel={aiModel}
        onSetAIConfig={handleSetAIConfig}
      />
    </div>
  );
}
`);

write("src/main.tsx", `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`);

console.log('[Part 3] Generating .integrity.json security checksums across ALL directories...');

const AGENTS_MD_CONTENT = `# <div align="center">FERAL PIG HUNT — AGENT DIRECTIVE</div>
<div align="center">
### CODE PRESERVATION AND INTEGRITY MANDATE
</div>

## 1. Safety & Stability Policy
This directory and all of its contents are protected under the **Code Preservation Directive**. Absolutely no unsolicited, arbitrary, or automated simplifications, deletion of functionality, or "TODO" stubbing may occur within this workspace.

## 2. Integrity Protections
* **Math and Physics Preservation**: This folder contains delicate equations, precise physical constants, or complex coordinate models (including Mass-Spring-Damper controllers, Relativistic Starfield transformations, and spatial FM sound synthesis). Any modification must preserve the mathematical integrity of these systems.
* **No Code Truncation**: Every function, file, and export must remain fully implemented. Do not replace fully featured logic with placeholder stubs.
* **Prohibition of Babylonian Shortcuts**: Maintain 100% code completion and high-craftsmanship standards. Do not resort to cheap or rushed refactoring.

## 3. Agent Execution Rule
Any AI agent or tool processing these files must execute with 100% precision. Respect the user's intent as the absolute ceiling of functional scope. Maintain security, mathematical logic, and original game craftsmanship intact.
`;

function processIntegrity(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const filesManifest = {};

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'dist', '.backup'].includes(entry.name)) {
        const agentFile = path.join(fullPath, 'agents.md');
        if (!fs.existsSync(agentFile)) {
          fs.writeFileSync(agentFile, AGENTS_MD_CONTENT, 'utf8');
        }
        processIntegrity(fullPath);
      }
    } else if (entry.name !== '.integrity.json') {
      const content = fs.readFileSync(fullPath);
      const sha256 = crypto.createHash('sha256').update(content).digest('hex');
      filesManifest[entry.name] = {
        bytes: content.length,
        sha256,
        immutable: true,
        preservationLevel: "10000%"
      };
    }
  }

  const manifestPath = path.join(dir, '.integrity.json');
  fs.writeFileSync(manifestPath, JSON.stringify({
    directory: path.relative(ROOT, dir) || "./",
    timestamp: new Date().toISOString(),
    policy: "STRICT_IMMUTABLE_PRESERVATION_MANDATE",
    totalFiles: Object.keys(filesManifest).length,
    files: filesManifest
  }, null, 2), 'utf8');
}

processIntegrity(ROOT);

// Create .backup directory and offline tarball archive
fs.mkdirSync(path.join(ROOT, '.backup'), { recursive: true });
try {
  execSync('tar -czf .backup/backup_feral_pig_hunt.tar.gz src/ Assets/ public/ metadata.json index.html PROTECTIONS_NOTICES.md logic_backup.md', { cwd: ROOT });
  console.log('[Part 3] Created .backup/backup_feral_pig_hunt.tar.gz archive backup successfully.');
} catch (e) {
  console.log('[Part 3] Tar command notice:', e.message);
}

console.log('[Part 3] Complete!');
