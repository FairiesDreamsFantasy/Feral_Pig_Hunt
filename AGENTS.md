# Feral Pig Hunt — Game Subsystem & Architecture Manifest

This manifest documents the core software design, coordinate systems, custom audio synthesis mechanisms, and development standards of **Feral Pig Hunt**. It acts as the primary reference guide for engineering stability and design consistency.

---

## 1. Core Architecture & Game State Loop

The game operates on a high-fidelity real-time simulation loop managed inside `src/App.tsx`. The central loop drives coordinate systems, rendering updates, and physics-driven entity tracking.

### Game State Transitions
* **`LANDING`**: Main menu with options for volume control and game initialization.
* **`INTERSTITIAL_AD`**: Simulates retro arcade advertising mechanisms. A necessary view state transition that buffers gameplay start-times and rewards progression.
* **`PLAY_AREA`**: The core simulation view. Mounts the high-performance physics loops, active sprite renderers, and input controllers.

### Dynamic Canvas Coordinate Systems
* **Responsive Layout Integration**: Coordinate mappings auto-scale according to standard portrait ratios (`Portrait_Orientation_4_Mobile_Phones`, `Portrait_Orientation_4_Tablets`).
* **Starfield Transforms**: Background layers implement spatial transformation matrices to produce parallax starfield movement.

---

## 2. Advanced FM Audio Synthesizer Subsystem

Sound effects and background sound tracks are generated synthetically using the HTML5 Web Audio API, completely removing dependencies on external network assets or bandwidth boosters.

* **Feral Pig Vocalizations**: Synthesized using custom Frequency Modulation (FM) oscillators. Low-frequency carrier waves combined with dynamic modulation indices generate grunts, snorts, and squeals.
* **Hunter Lasers**: Synthesized via high-frequency carrier waves coupled with rapid exponential pitch decay.
* **DSP Stereo Effects**: Sound generators compute entity coordinates relative to the player's spatial center to dynamically balance left/right channel gains.

---

## 3. Engineering & Stability Principles

* **TypeScript Type Safety**: All modules leverage strict TypeScript typing to eliminate undefined runtime behaviors.
* **Zero Telemetry or Logs**: The user interface must remain pristine. Absolutely no debugging telemetry, diagnostic traces, or log overlays are displayed during gameplay.
* **Performance-First Design**: Rendering routines utilize hardware-accelerated CSS and optimized requestAnimationFrame hooks to maintain a steady 60 FPS across both desktop and mobile platforms.
