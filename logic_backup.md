# <div align="center">FERAL PIG HUNT — LOGIC BACKUP & MATHEMATICAL SPECIFICATION</div>
<div align="center">
### Complete Logic Architecture, Character Math, Laser Mechanics, and Sound Algorithms
</div>

## <div align="center">1. Overview & Mechanics</div>
* **Title**: Feral Pig Hunt
* **Genre**: Fixed-Shooter Arcade (Galaga / Galaxian Inspired)
* **Goal**: Defend the ecosystem across the United States from invasive feral pigs/hogs.
* **Canvas Area**: Ultra-Black (`#000000`) with smooth vertical starfield/terrain drifting.
* **Controls**:
  * `Spacebar`: Fire 12-unit segmented vertical laser line.
  * `Left Arrow` / `A`: Strafe Hog Assassin Left with smoothed velocity clamping.
  * `Right Arrow` / `D`: Strafe Hog Assassin Right with smoothed velocity clamping.
  * `Shift + 7` (`&`): Pause / Resume.
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
* **Position**: Bottom edge of the play arena (`y = canvas.height - 50`).
* **Laser Cannon**:
  * Vertical line beam of exactly 12 game units length (composed of 4 segmented glow pulses).
  * Velocity: $v_y = -14 \text{ units/frame}$.
  * Rate of fire limiter: Prevents keyrepeat saturation while allowing responsive dual-shot bursts.

## <div align="center">3. Feral Pig Mathematical Attributes & Color Matrix</div>
* **Physical Dimensions**:
  * `Size`: Small ($0.8\times$), Medium ($1.0\times$), Large ($1.35\times$), Giant ($1.8\times$).
  * `Tusk_Height`: $4\text{px}$ to $16\text{px}$ upwards-curved white/ivory enamel vectors.
  * `Snout_Length`: $6\text{px}$ to $14\text{px}$ with dual nostrils.
* **Color Variations (>200 combinations)**:
  * Primary: Pink, White, Green, Blue, Black (bold border + bright spots), Brown, Purple, Orange, Gold, Silver, Amber, Gray, Peach.
  * Spotted Variants: Any base color combined with high-contrast secondary spots.
* **Flight & Attack Trajectories**:
  * **Formation Hover**: Sine-wave grid oscillation: $x(t) = x_0 + A \sin(\omega t + \phi)$.
  * **Swoop & Charge Attack**: Quadratic and cubic Bézier curves diving towards the player's coordinates.

## <div align="center">4. Audio Synthesizer Algorithms & Physical Acoustics</div>
* **Laser Fire**: Dual-oscillator fast linear frequency ramp ($880\text{Hz} \to 180\text{Hz}$, duration $0.12\text{s}$).
* **Feral Pig Squeal**: Sine-wave frequency modulation with rapid vibrato ($720\text{Hz} \to 1100\text{Hz}$, LFO at $18\text{Hz}$).
* **Acoustic Doppler Shift**: Alters real-time squeal frequencies relative to physical observer and emitter velocities:
  $$f_{\text{observed}} = f_{\text{emitted}} \cdot \left( \frac{v_{\text{sound}} + v_{\text{observer}}}{v_{\text{sound}} - v_{\text{source}}} \right)$$
  where $v_{\text{sound}} = 343.2 \text{ m/s}$.
* **Acoustic Power Attenuation (Inverse-Square Law)**: Volume gain attenuates as:
  $$P(d) = \frac{P_0}{d^2}$$
* **Constant-Power Stereo Panning**: Implements the equal-power law:
  $$G_{\text{Left}} = \cos\left( \frac{\pi}{4}(p + 1) \right), \quad G_{\text{Right}} = \sin\left( \frac{\pi}{4}(p + 1) \right)$$
* **Multi-Bitrate Profiles** (`8-Bit/`, `16-Bit/`, `32-Bit/`, `64-Bit/`).

## <div align="center">5. Advanced Physics Engine & Special Relativity</div>
* **Mass-Spring-Damper Mechanical Controls**: Integrates input forces step-by-step using Euler-Cromer equations:
  $$\ddot{x} = \frac{F_{\text{propulsion}} - c\dot{x} - kx}{m}$$
  $$\dot{x}_{t+1} = \dot{x}_t + \ddot{x}_t \Delta t$$
  $$x_{t+1} = x_t + \dot{x}_{t+1} \Delta t$$
  where $m = 15\text{ kg}$, $c = 22.5$ damping, $k = 0.12$ springback.
* **Fluid Drag Mechanics**: Diving pigs encounter aerodynamic drag:
  $$F_d = \frac{1}{2} \rho v^2 C_d A$$
  where $\rho = 1.225 \text{ kg/m}^3$, $C_d = 0.47$, and cross-sectional area $A$ scales with pig size ($0.15\text{m}^2 \to 0.8\text{m}^2$).
* **Newtonian Gravitational Swoop**: Hogs are pulled orbitally towards the Hog Assassin:
  $$a_g = \frac{G \cdot M_{\text{player}}}{(r + \epsilon)^2}$$
* **Special Relativistic Starfield**:
  * **Relativistic Aberration**: Skews background space-time angles relativistically.
  * **Lorentz Length Contraction**: Distorts coordinate projection grids along the plane of motion by $1/\gamma$.
  * **Optical Doppler Color Shifting**: Relativistically shifts star spectral color to blueshift cyan/blue for forward-motion space and redshift crimson/red for trailing space.

## <div align="center">6. LBDCD DRM-Free & Low-Bandwidth Delivery</div>
* **Concept**: Low-Bandwidth Digital Content Delivery (LBDCD) replaces high-bandwidth encrypted HDCP pipelines with lightweight, permissive open-source layouts.
* **Handshake Override**: Bypasses digital encryption handshake loops, forcing `hDCPActive = false` to guarantee screenshot tools, capture cards, and streaming services are always unrestricted.
* **Multi-Port Physical Simulations**:
  * **VGA**: Translates digital pixel states to analog color voltage values: $V_{\text{color}} = D_{\text{channel}} / 255 \cdot 0.7\text{V}$.
  * **3.5MM Stereo**: Maps spatial audio coordinates into raw AC line-out waveforms with 1.5V peak-to-peak TRS signal levels.
  * **AV Composite**: Modulates luminance ($Y$) and chrominance phase signals ($I, Q$) using NTSC matrices:
    $$\begin{bmatrix} Y \\ I \\ Q \end{bmatrix} = \begin{bmatrix} 0.299 & 0.587 & 0.114 \\ 0.596 & -0.274 & -0.322 \\ 0.211 & -0.523 & 0.312 \end{bmatrix} \begin{bmatrix} R \\ G \\ B \end{bmatrix}$$
  * **S-Video**: Separates visual outputs into Y (Luma) and C (Chroma amplitude $C = \sqrt{I^2 + Q^2}$) ports to prevent color bleed.
  * **HDMI / TMDS**: Serializes visual pixels into unencrypted digital differential lanes.
  * **COM Serial / PS2 / USB**: Translates mechanical keys to 8-bit scan codes, serial baud packets, and low-latency serial queues.
* **Works-Offline & Low-RAM Recycle Engines**:
  * Prevents online DRM verification calls or license callbacks.
  * Employs object-pool `FrameBufferRecycler` queues to reuse data buffers, keeping physical memory footprint under $8\text{MB}$ for low-RAM machines.
* **Bandwidth Booster**: Compresses video line updates using run-length encoding (RLE) to decrease output bit-rates on copper connections.

## <div align="center">7. OS Support Subsystem & Language Port Bindings</div>
* **Operating System Target Simulator**:
  * **FreeDOS**: Simulates BIOS real-mode registers and interrupts: `INT 10h` for VGA Mode 13h (320x200, 256 colors) and `INT 21h` system calls.
  * **Linux**: Abstraction matrices targeting Debian, Ubuntu (GNOME/Snapcraft/PipeWire), Xubuntu (lightweight XFCE), Kubuntu (Plasma/Qt6), Lubuntu (LXQt minimal memory), and Arch Linux rolling kernels.
* **Unified Language Port Mapping**:
  Provides complete, uncompromised syntactic code blocks across `System/Engine/`, `System/Sound/Engine/`, `System/Keyboards_and_Controllers/Engine/`, and `System/Visuals/Engine/` to allow developers to port the game easily to other compilers:
  * **Assembly**: Low-level x86_64 CPU register movements.
  * **C, C++, C#**: Typed struct buffers and class definitions.
  * **WebAssembly (WASM)**: WAT functional maps.
  * **Basic**: Classic line-numbered QBASIC/GW-BASIC commands.
  * **XML & CSV**: Structured configuration and telemetry spreadsheets.
  * **PHP & SQL/MySQL**: Web logging databases and score tracking indexes.
  * **Rust, Go, Swift, Kotlin**: Modern compiled platforms, concurrency channels, and mobile controllers.
  * **R**: Linear regressions and statistics mapping.
  * **3D-JS**: WebGL / ThreeJS renderer matrices.
  * **Excel (XL)**: Telemetry coordinates cell formulas.

## <div align="center">8. Drift_Guard Telemetry & Drifts_Found Repository</div>
* **Dual-Layer Closed-Loop Drift Auditing**:
  * **InGameDriftGuard**: Inspects `WaveTacticalSeed` parameters (speed multiplier, dive aggression, spotted ratio) and closed-loop dynamic tension scores against mathematical boundary envelopes ($[0.6, 2.8]$), clamping out-of-envelope deviations instantly.
  * **GeminiDriftGuard**: Audits external generative JSON payloads against schema standards, enforces a $6000\text{ms}$ latency ceiling, traps rate limits and authentication flags, and clamps parameter divergence.
* **Drifts_Found Telemetry Channel**:
  * Logs all detected drift events to client and runtime storage channels labeled `Drifts_Found/`.
  * Flags events as `FLAGGED_FOR_HUMAN_INSPECTION` with mandatory non-negotiable review by Google Gemini developers.
  * Strictly forbids storing or transmitting raw API keys; audits non-sensitive key character counts and Google token formats only.

## <div align="center">9. TTS Architecture, 15% Sound Amplification, & Speech Systems Mode Control</div>
* **Sound Channel Text-To-Speech (`System/Sound/TTS/`)**:
  * Web Speech API integration combined with dynamic speech synthesis queue management for announcing scores and wave clearance milestones.
  * Strictly enforced volume attenuation: TTS speech volume is mathematically configured to be exactly 20% lower than sounds (`TTS_RELATIVE_VOLUME_RATIO = 0.80`).
* **15% Audio Amplification for Sound Effects and BGM**:
  * Master volume gain amplified by 15% from `2.4336` to `2.79864` ($2.4336 \times 1.15 = 2.79864$).
  * Multi-bitrate synthesizer oscillator tones and noise bursts amplified by 15% from `1.69` to `1.9435` ($1.69 \times 1.15 = 1.9435$).
* **In-Game Tactical Speech Intelligence Subsystem (`System/AI/In-Game/TTS/`)**:
  * Five distinct speech system voice modes:
    1. **Arcade Announcer**: Crisp, energetic announcer voice with tension-sensitive commentary.
    2. **Cybernetic**: Deep robotic cyber-hunter unit identifier voice.
    3. **Tactical AI**: Authoritative strategic military defense command computer voice.
    4. **Retro Vox**: Fast-paced 8-bit synthetic speech emulator.
    5. **Off**: Full voice muting for players preferring pure synthesized retro sound effects.
  * Automatic interval-based wave completion announcements with score reporting when waves are cleared.
* **Player Page `<button>TTS Mode</button>` Voice Swapping**:
  * Dedicated interactive `<button id="TTS_Mode_Toggle_Btn">TTS Mode: {ttsMode}</button>` positioned directly adjacent to the sound type toggle on the player page across Landscape, Tablet Portrait, and Mobile Portrait screens.
  * Real-time on-demand voice swapping with instant audio confirmation feedback.

## <div align="center">10. Sentinel Integrity System & App.tsx Locked State Architecture</div>
* **App.tsx Sealed Import Graph & View State Machine**:
  * Imports: `LandingPage`, `PlayAreaIndex`, `AdSystemCoordinator`, `InsertAIGeminiModal`, `GeminiTier`.
  * State Machine: `currentView` in `['LANDING', 'INTERSTITIAL_AD', 'PLAY_AREA']`.
  * Handlers: `handleStartGame`, `handlePlayAgain`, `handleAdComplete`, `handleReturnToTitle`, `handleSetAIConfig`.
  * High score initialization with safe fallback (`localStorage.getItem('feral_pig_hunt_high_score')`).
* **CSS Futureproofing & Layout Safeguards Specification**:
  * CSS Engine: Tailwind CSS v4 `@import "tailwindcss";` directive.
  * Selection Contrast: `#39ff14` neon green text selection.
  * Viewport Clamping: `min-h-screen`, `100vh`, and `100dvh` for responsive mobile/tablet displays.
  * Performance Helpers: `.hardware-accelerated` with GPU layer promotion (`will-change: transform, opacity; transform: translateZ(0);`).
  * Scrollbar Aesthetics: Dark `#050505` track, `#1f2937` thumb with `#39ff14` hover highlights.


