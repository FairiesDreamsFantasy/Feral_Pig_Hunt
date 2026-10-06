/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

console.log('[Security Builder] Starting full workspace provisioning and security hardening...');

const ROOT_DIR = process.cwd();

// Complete file catalog from the original code specification
const FILE_MAP = {
  // --- Root files ---
  "metadata.json": JSON.stringify({
    name: "Feral Pig Hunt",
    description: "Fixed-shooter arcade game where a robotic hunter defends the ecosystem from invading feral hogs inspired by Galaga and Galaxian.",
    requestFramePermissions: [],
    majorCapabilities: ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
  }, null, 2),

  ".env.example": `# GEMINI_API_KEY: Required for Gemini AI API calls.
# AI Studio automatically injects this at runtime from user secrets.
# Users configure this via the Secrets panel in the AI Studio UI.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: The URL where this applet is hosted.
# AI Studio automatically injects this at runtime with the Cloud Run service URL.
# Used for self-referential links, OAuth callbacks, and API endpoints.
APP_URL="MY_APP_URL"
`,

  ".gitignore": `node_modules/
build/
dist/
coverage/
.DS_Store
*.log
.env*
!.env.example
`,

  "PROTECTIONS_NOTICES.md": `# PROTECTIONS NOTICES: Feral Pig Hunt Codebase Preservation & Architecture

## Security and Integrity Guidelines
This file establishes permanent protection notices for all code, modules, algorithms, synthesis definitions, character attribute mappings, and visual specifications inside the **Feral Pig Hunt** project.

### Core Preservation Directives:
1. **Zero Unsolicited Stubbing & Simplification**: All modules, math routines, audio synthesizers, pig color matrices, and hunter laser physics must remain written out completely without truncation, pseudo-abbreviations, or arbitrary deletions.
2. **Modular Integrity**: Every system directory maintains an \`index.tsx\` paired with a corresponding \`General/index.tsx\` for clean module aggregation and architectural separation of concerns.
3. **No Babylonian Norms or Shortcuts**: 100% genuine client-side synthesis via standard Web Audio API oscillators, pure procedural 2D canvas pixel rendering, and strict Galaga-inspired mathematical state trajectories.
4. **Preservation of Unique Visuals & Attributes**:
   - 12-unit segmented vertical laser line for Hog Assassin.
   - Distinctive feral pig physical attributes: \`Tusk_Height\`, \`Snout_Length\`, \`Size\`, \`Spotted\` color overlays across over 200 possible color variations (Pink, White, Green, Blue, Black with bold borders and bright spots, Brown, Purple, Orange, Gold, Silver, Amber, Gray, Peach).
   - Authentic fixed-shooter coordinate systems with ultra-black \`#000000\` play arena.
5. **Security & API Keys**:
   - User-supplied Gemini keys remain exclusively in-memory/client-session without leaking or sending to unsolicited third parties.
   - AI Pseudorandom Tactical Seeds adjust enemy diving wave complexity when enabled.
6. **Directory-Level Agent Guarding & Sound Preservation**:
   - Every single directory in the codebase is populated with a dedicated \`agents.md\` file enforcing strict local protection directives to block any unsolicited deletions or modifications.
   - All sound categories contain dedicated \`Classic/\` subfolders to preserve original 8-bit chiptune melodies and synthesized audio algorithms 100% intact.
   - Interactive "Sound Mode" toggle (\`8-Bit\`, \`16-Bit\`, \`32-Bit\`, \`64-Bit\`) in the Play Area HUD provides real-time sound depth profile selection while preserving original 8-bit sounds.
7. **Directory Migration & Standalone Assets**:
   - \`System/\` directory relocated to \`src/System/\` with all relative import paths updated.
   - \`public/\` directory configured to automatically populate \`Public/Feral_Pig_Hunt/\` upon Vite build, ensuring \`Assets/JS/runtime.js\`, \`Assets/CSS/style.css\`, \`SW.js\`, and all subdirectories are exported without deletion.
   - Vite configured to bundle main application into \`Assets/JS/index.js\` and \`Assets/CSS/style.css\`.
   - \`SW.js\` service worker present at project root, \`public/\`, and inside \`Public/Feral_Pig_Hunt/\`.
   - \`index.html\` configured with \`<meta name="keywords" content="Feral Pig, Hunt">\` right after the \`<head>\` tag and mirrored in \`Assets/\`, \`Assets/CSS/\`, \`Assets/JS/\`, \`public/\`, and \`Public/Feral_Pig_Hunt/\` subdirectories with dedicated \`agents.md\` directives.

*Protected under Open-Source CC BY-SA 4.0 and GPL v3.*
`,

  "logic_backup.md": `# <div align="center">FERAL PIG HUNT — LOGIC BACKUP & MATHEMATICAL SPECIFICATION</div>
<div align="center">
### Complete Logic Architecture, Character Math, Laser Mechanics, and Sound Algorithms
</div>

## <div align="center">1. Overview & Mechanics</div>
* **Title**: Feral Pig Hunt
* **Genre**: Fixed-Shooter Arcade (Galaga / Galaxian Inspired)
* **Goal**: Defend the ecosystem across the United States from invasive feral pigs/hogs.
* **Canvas Area**: Ultra-Black (\`#000000\`) with smooth vertical starfield/terrain drifting.
* **Controls**:
  * \`Spacebar\`: Fire 12-unit segmented vertical laser line.
  * \`Left Arrow\` / \`A\`: Strafe Hog Assassin Left with smoothed velocity clamping.
  * \`Right Arrow\` / \`D\`: Strafe Hog Assassin Right with smoothed velocity clamping.
  * \`Shift + 7\` (\`&\`): Pause / Resume.
* **Lives & Scoring**:
  * 3 Lives per run.
  * Explosion effect upon collision with charging pig.
  * Game Over at 0 lives remaining with high-score tracking.
  * Small Pigs: 100 pts.
  * Medium Pigs: 200 pts.
  * Large Pigs: 400 pts.
  * Giant Spotted/Boss Pigs: 800+ pts.
  * Dive-Attack Bonus: +150 pts when destroyed mid-swoop.

## <div align="center">2. Hunter Specifications: The Hog Assassin</div>
* **Sprite**: Pixelated robotic hunter chassis with dual energy thrusters.
* **Position**: Bottom edge of the play arena (\`y = canvas.height - 50\`).
* **Laser Cannon**:
  * Vertical line beam of exactly 12 game units length (composed of 4 segmented glow pulses).
  * Velocity: $v_y = -14 \\text{ units/frame}$.
  * Rate of fire limiter: Prevents keyrepeat saturation while allowing responsive dual-shot bursts.

## <div align="center">3. Feral Pig Mathematical Attributes & Color Matrix</div>
* **Physical Dimensions**:
  * \`Size\`: Small ($0.8\\times$), Medium ($1.0\\times$), Large ($1.35\\times$), Giant ($1.8\\times$).
  * \`Tusk_Height\`: $4\\text{px}$ to $16\\text{px}$ upwards-curved white/ivory enamel vectors.
  * \`Snout_Length\`: $6\\text{px}$ to $14\\text{px}$ with dual nostrils.
* **Color Variations (>200 combinations)**:
  * Primary: Pink, White, Green, Blue, Black (bold border + bright spots), Brown, Purple, Orange, Gold, Silver, Amber, Gray, Peach.
  * Spotted Variants: Any base color combined with high-contrast secondary spots.
* **Flight & Attack Trajectories**:
  * **Formation Hover**: Sine-wave grid oscillation: $x(t) = x_0 + A \\sin(\\omega t + \\phi)$.
  * **Swoop & Charge Attack**: Quadratic and cubic B\u00e9zier curves diving towards the player's coordinates.

## <div align="center">4. Audio Synthesizer Algorithms & Physical Acoustics</div>
* **Laser Fire**: Dual-oscillator fast linear frequency ramp ($880\\text{Hz} \\to 180\\text{Hz}$, duration $0.12\\text{s}$).
* **Feral Pig Squeal**: Sine-wave frequency modulation with rapid vibrato ($720\\text{Hz} \\to 1100\\text{Hz}$, LFO at $18\\text{Hz}$).
* **Acoustic Doppler Shift**: Alters real-time squeal frequencies relative to physical observer and emitter velocities:
  $$f_{\\text{observed}} = f_{\\text{emitted}} \\cdot \\left( \\frac{v_{\\text{sound}} + v_{\\text{observer}}}{v_{\\text{sound}} - v_{\\text{source}}} \\right)$$
  where $v_{\\text{sound}} = 343.2 \\text{ m/s}$.
* **Acoustic Power Attenuation (Inverse-Square Law)**: Volume gain attenuates as:
  $$P(d) = \\frac{P_0}{d^2}$$
* **Constant-Power Stereo Panning**: Implements the equal-power law:
  $$G_{\\text{Left}} = \\cos\\left( \\frac{\\pi}{4}(p + 1) \\right), \\quad G_{\\text{Right}} = \\sin\\left( \\frac{\\pi}{4}(p + 1) \\right)$$
* **Multi-Bitrate Profiles** (\`8-Bit/\`, \`16-Bit/\`, \`32-Bit/\`, \`64-Bit/\`).

## <div align="center">5. Advanced Physics Engine & Special Relativity</div>
* **Mass-Spring-Damper Mechanical Controls**: Integrates input forces step-by-step using Euler-Cromer equations:
  $$\\ddot{x} = \\frac{F_{\\text{propulsion}} - c\\dot{x} - kx}{m}$$
  $$\\dot{x}_{t+1} = \\dot{x}_t + \\ddot{x}_t \\Delta t$$
  $$x_{t+1} = x_t + \\dot{x}_{t+1} \\Delta t$$
  where $m = 15\\text{ kg}$, $c = 22.5$ damping, $k = 0.12$ springback.
* **Fluid Drag Mechanics**: Diving pigs encounter aerodynamic drag:
  $$F_d = \\frac{1}{2} \\rho v^2 C_d A$$
  where $\\rho = 1.225 \\text{ kg/m}^3$, $C_d = 0.47$, and cross-sectional area $A$ scales with pig size ($0.15\\text{m}^2 \\to 0.8\\text{m}^2$).
* **Newtonian Gravitational Swoop**: Hogs are pulled orbitally towards the Hog Assassin:
  $$a_g = \\frac{G \\cdot M_{\\text{player}}}{(r + \\epsilon)^2}$$
* **Special Relativistic Starfield**:
  * **Relativistic Aberration**: Skews background space-time angles relativistically.
  * **Lorentz Length Contraction**: Distorts coordinate projection grids along the plane of motion by $1/\\gamma$.
  * **Optical Doppler Color Shifting**: Relativistically shifts star spectral color to blueshift cyan/blue for forward-motion space and redshift crimson/red for trailing space.
`,

  "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta name="keywords" content="Feral Pig, Hunt">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Feral Pig Hunt</title>
    <meta name="description" content="Feral Pig Hunt - Arcade fixed-shooter defending the ecosystem from invasive feral hogs." />
    <link rel="stylesheet" href="/Assets/CSS/style.css" />
  </head>
  <body class="bg-black text-white m-0 p-0 overflow-x-hidden select-none">
    <div id="root"></div>
    <script src="/Assets/JS/runtime.js"></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,

  "SW.js": `/**
 * Feral Pig Hunt - Standalone Service Worker (SW.js)
 * Caches essential shell assets for offline gameplay and fast re-loads.
 */
const CACHE_NAME = 'feral-pig-hunt-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './Assets/CSS/style.css',
  './Assets/JS/index.js',
  './metadata.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Caching partial list:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        return cachedResponse;
      });
    })
  );
});
`,

  "public/SW.js": `/**
 * Feral Pig Hunt - Standalone Service Worker (SW.js)
 * Caches essential shell assets for offline gameplay and fast re-loads.
 */
const CACHE_NAME = 'feral-pig-hunt-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './Assets/CSS/style.css',
  './Assets/JS/index.js',
  './metadata.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Caching partial list:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        return cachedResponse;
      });
    })
  );
});
`,

  "Assets/JS/runtime.js": `/**
 * Feral Pig Hunt - Client-side runtime initializers & Service Worker Registration
 */
(function () {
  console.log('[Feral Pig Hunt] Initializing client-side arcade engine.');
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('./SW.js')
        .catch(function () {
          return navigator.serviceWorker.register('./Sw.js');
        })
        .then(function (registration) {
          console.log('[ServiceWorker] Registration successful with scope:', registration.scope);
        })
        .catch(function (error) {
          console.log('[ServiceWorker] Registration notice:', error.message || error);
        });
    });
  }
  window.addEventListener(
    'keydown',
    function (e) {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        if (document.activeElement && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }
    },
    { passive: false }
  );
})();
`,

  "public/Assets/JS/runtime.js": `/**
 * Feral Pig Hunt - Client-side runtime initializers & Service Worker Registration
 */
(function () {
  console.log('[Feral Pig Hunt] Initializing client-side arcade engine.');
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('./SW.js')
        .catch(function () {
          return navigator.serviceWorker.register('./Sw.js');
        })
        .then(function (registration) {
          console.log('[ServiceWorker] Registration successful with scope:', registration.scope);
        })
        .catch(function (error) {
          console.log('[ServiceWorker] Registration notice:', error.message || error);
        });
    });
  }
  window.addEventListener(
    'keydown',
    function (e) {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        if (document.activeElement && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }
    },
    { passive: false }
  );
})();
`,

  "Assets/CSS/style.css": `/* Feral Pig Hunt - Global Stylesheet & Custom Scrollbars */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&display=swap');

:root {
  --color-arcade-black: #000000;
  --color-arcade-green: #39ff14;
  --color-arcade-red: #ff3131;
  --color-arcade-yellow: #ffe600;
  --color-arcade-cyan: #00f0ff;
  --color-arcade-purple: #bd00ff;
  --color-arcade-orange: #ff9900;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  background-color: #000000;
  color: #ffffff;
  font-family: 'Share Tech Mono', monospace, sans-serif;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  image-rendering: pixelated;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: #0a0a0f;
  border: 1px solid #1a1a24;
}
::-webkit-scrollbar-thumb {
  background: #2a2a3c;
  border: 1px solid #39ff14;
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: #39ff14;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #39ff14 #0a0a0f;
}

canvas#Animation {
  background-color: #000000;
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.pixel-font {
  font-family: 'Press Start 2P', monospace;
}

.glow-green {
  text-shadow: 0 0 8px rgba(57, 255, 20, 0.8), 0 0 16px rgba(57, 255, 20, 0.4);
}
.glow-red {
  text-shadow: 0 0 8px rgba(255, 49, 49, 0.8), 0 0 16px rgba(255, 49, 49, 0.4);
}
.glow-yellow {
  text-shadow: 0 0 8px rgba(255, 230, 0, 0.8), 0 0 16px rgba(255, 230, 0, 0.4);
}
.glow-cyan {
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.8), 0 0 16px rgba(0, 240, 255, 0.4);
}
`,

  "public/Assets/CSS/style.css": `/* Feral Pig Hunt - Global Stylesheet & Custom Scrollbars */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&display=swap');

:root {
  --color-arcade-black: #000000;
  --color-arcade-green: #39ff14;
  --color-arcade-red: #ff3131;
  --color-arcade-yellow: #ffe600;
  --color-arcade-cyan: #00f0ff;
  --color-arcade-purple: #bd00ff;
  --color-arcade-orange: #ff9900;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  background-color: #000000;
  color: #ffffff;
  font-family: 'Share Tech Mono', monospace, sans-serif;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  image-rendering: pixelated;
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: #0a0a0f;
  border: 1px solid #1a1a24;
}
::-webkit-scrollbar-thumb {
  background: #2a2a3c;
  border: 1px solid #39ff14;
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: #39ff14;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #39ff14 #0a0a0f;
}

canvas#Animation {
  background-color: #000000;
  display: block;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.pixel-font {
  font-family: 'Press Start 2P', monospace;
}

.glow-green {
  text-shadow: 0 0 8px rgba(57, 255, 20, 0.8), 0 0 16px rgba(57, 255, 20, 0.4);
}
.glow-red {
  text-shadow: 0 0 8px rgba(255, 49, 49, 0.8), 0 0 16px rgba(255, 49, 49, 0.4);
}
.glow-yellow {
  text-shadow: 0 0 8px rgba(255, 230, 0, 0.8), 0 0 16px rgba(255, 230, 0, 0.4);
}
.glow-cyan {
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.8), 0 0 16px rgba(0, 240, 255, 0.4);
}
`
};

// Generic agents.md template
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

// Generic HTML fallback for subdirectories
const SUBDIR_INDEX_HTML = (depth) => `<!doctype html>
<html lang="en">
  <head>
    <meta name="keywords" content="Feral Pig, Hunt">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Feral Pig Hunt</title>
    <meta name="description" content="Feral Pig Hunt - Arcade fixed-shooter defending the ecosystem from invasive feral hogs." />
    <link rel="stylesheet" href="${depth}Assets/CSS/style.css" />
  </head>
  <body class="bg-black text-white m-0 p-0 overflow-x-hidden select-none">
    <div id="root"></div>
    <script src="${depth}Assets/JS/runtime.js"></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

// Write defined files
for (const [relPath, content] of Object.entries(FILE_MAP)) {
  const fullPath = path.join(ROOT_DIR, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

// Generate .integrity.json files for all directories and subdirectories
function generateIntegrityManifests(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const filesManifest = {};

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
        // Ensure agents.md exists in every directory
        const agentFile = path.join(fullPath, 'agents.md');
        if (!fs.existsSync(agentFile)) {
          fs.writeFileSync(agentFile, AGENTS_MD_CONTENT, 'utf8');
        }
        generateIntegrityManifests(fullPath);
      }
    } else if (entry.name !== '.integrity.json') {
      const content = fs.readFileSync(fullPath);
      const sha256 = crypto.createHash('sha256').update(content).digest('hex');
      const sha512 = crypto.createHash('sha512').update(content).digest('hex');
      filesManifest[entry.name] = {
        bytes: content.length,
        sha256,
        sha512,
        immutable: true,
        preservationLevel: "10000%"
      };
    }
  }

  const manifestPath = path.join(dir, '.integrity.json');
  const manifestData = {
    directory: path.relative(ROOT_DIR, dir) || "./",
    timestamp: new Date().toISOString(),
    policy: "STRICT_IMMUTABLE_PRESERVATION_MANDATE",
    totalFiles: Object.keys(filesManifest).length,
    files: filesManifest
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifestData, null, 2), 'utf8');
}

// Ensure root agents.md exists
fs.writeFileSync(path.join(ROOT_DIR, 'agents.md'), AGENTS_MD_CONTENT, 'utf8');

generateIntegrityManifests(ROOT_DIR);
console.log('[Security Builder] All files, subdirectories, and cryptographic .integrity.json manifests successfully generated!');
