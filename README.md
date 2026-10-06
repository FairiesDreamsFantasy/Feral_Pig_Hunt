# Feral Pig Hunt 🐗💥

An action-packed arcade fixed-shooter built with React, Vite, Tailwind CSS, and HTML5 Web Audio synthesis. Defend the ecosystem against waves of invasive feral pigs!

## 🎮 Features
- **Arcade Gameplay**: Retro-inspired wave shooter with score tracking, particle explosions, powerups, and dynamic difficulty scaling.
- **Custom FM Audio Synthesizer**: Pure Web Audio API synthesized grunt vocalizations, laser effects, and dynamic stereo sound.
- **Full PWA & Standalone Support**: Pre-built static bundles ready for immediate deployment to static web hosts, CPanel, or VPS environments.
- **Automated CI/CD**: Integrated GitHub Actions workflow to automatically compile and release production bundles on push.

---

## 🚀 Server & Deployment Configuration

### GreenGeeks / CPanel VPS Setup
- **Repository Location on Server**: `/home/fairiesd/Repositories/Feral-Pig-Hunt`
- **Target Web Deployment Path**: `/home/fairiesd/public_html/Arcade/Feral_Pig_Hunt/`
- **GitHub Repository**: [https://github.com/FairiesDreamsFantasy/Feral_Pig_Hunt](https://github.com/FairiesDreamsFantasy/Feral_Pig_Hunt)

### How Deployment Works
1. **GitHub Actions Workflow (`.github/workflows/deploy.yml`)**:
   - Triggers automatically on push to `main` / `master`.
   - Runs `npm ci` and `npm run build` to generate compiled bundles.
   - Uploads compiled production artifacts and publishes a GitHub Release with `Feral_Pig_Hunt_Bundle.zip`.

2. **CPanel Deployment (`.cpanel.yml`)**:
   - When pulling updates into `/home/fairiesd/Repositories/Feral-Pig-Hunt` in CPanel Git Version Control, `.cpanel.yml` automatically copies compiled files to `/home/fairiesd/public_html/Arcade/Feral_Pig_Hunt/`.

---

## 🛠️ Local Development

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run
```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Compile production bundle
npm run build
```

---

## 📄 License
MIT © FairiesDreamsFantasy
