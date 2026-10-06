import * as fs from 'fs';
import * as path from 'path';
import { build } from 'esbuild';
import { execSync } from 'child_process';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const archiver = require('archiver');
// Debug: console.log('DEBUG: archiver type:', typeof archiver);

const ROOT = process.cwd();

async function createZip(sourceDir: string, outPath: string) {
  return new Promise((resolve, reject) => {
    try {
      const outDir = path.dirname(outPath);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      
      // Use system tar command with --exclude to avoid self-archiving issues
      // When archiving ROOT, we must exclude the 'dist' directory where the zip itself resides
      const cmd = `tar -czf "${outPath}" -C "${path.dirname(sourceDir)}" --exclude="dist" "${path.basename(sourceDir)}"`;
      execSync(cmd);
      resolve(null);
    } catch (err) {
      reject(err);
    }
  });
}

async function updateProductionBundle() {
  console.log('[Production Bundle Builder] Initiating production bundle compilation for Public/Feral_Pig_Hunt/ and public/Feral_Pig_Hunt/...');

  // 1. Ensure target directories exist
  const TARGET_DIRS = [
    'Public/Feral_Pig_Hunt',
    'Public/Feral_Pig_Hunt/Assets',
    'Public/Feral_Pig_Hunt/Assets/CSS',
    'Public/Feral_Pig_Hunt/Assets/JS',
    'public/Feral_Pig_Hunt',
    'public/Feral_Pig_Hunt/Assets',
    'public/Feral_Pig_Hunt/Assets/CSS',
    'public/Feral_Pig_Hunt/Assets/JS',
    'Assets/CSS',
    'Assets/JS',
    'Public/Assets/CSS',
    'Public/Assets/JS',
    'public/Assets/CSS',
    'public/Assets/JS',
    'dist/zips'
  ];

  for (const dir of TARGET_DIRS) {
    const fullPath = path.join(ROOT, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }

  // 2. Compile standalone JavaScript bundle with esbuild
  console.log('[Production Bundle Builder] Compiling main application bundle via esbuild...');
  const jsOutPathPublic = path.join(ROOT, 'Public/Feral_Pig_Hunt/Assets/JS/index.js');
  await build({
    entryPoints: [path.join(ROOT, 'src/main.tsx')],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: 'es2020',
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    loader: {
      '.css': 'empty'
    },
    outfile: jsOutPathPublic
  });
  console.log('[Production Bundle Builder] Compiled Public/Feral_Pig_Hunt/Assets/JS/index.js');

  // Copy JS & sourcemap to mirrors
  const jsOutPathLowercase = path.join(ROOT, 'public/Feral_Pig_Hunt/Assets/JS/index.js');
  fs.copyFileSync(jsOutPathPublic, jsOutPathLowercase);
  if (fs.existsSync(jsOutPathPublic + '.map')) {
    fs.copyFileSync(jsOutPathPublic + '.map', jsOutPathLowercase + '.map');
  }

  // Copy to Assets/JS if present
  fs.copyFileSync(jsOutPathPublic, path.join(ROOT, 'Assets/JS/index.js'));
  if (fs.existsSync(jsOutPathPublic + '.map')) {
    fs.copyFileSync(jsOutPathPublic + '.map', path.join(ROOT, 'Assets/JS/index.js.map'));
  }
  fs.copyFileSync(jsOutPathPublic, path.join(ROOT, 'public/Assets/JS/index.js'));
  fs.copyFileSync(jsOutPathPublic, path.join(ROOT, 'Public/Assets/JS/index.js'));

  // 3. Extract and synchronize compiled Tailwind & custom CSS stylesheet
  console.log('[Production Bundle Builder] Processing compiled styles from Vite dist...');
  const distAssetsDir = path.join(ROOT, 'dist/assets');
  let compiledCSSContent = '';

  if (fs.existsSync(distAssetsDir)) {
    const assetFiles = fs.readdirSync(distAssetsDir);
    const cssFile = assetFiles.find((f) => f.endsWith('.css'));
    if (cssFile) {
      compiledCSSContent = fs.readFileSync(path.join(distAssetsDir, cssFile), 'utf8');
      console.log(`[Production Bundle Builder] Extracted compiled CSS (${compiledCSSContent.length} bytes from ${cssFile})`);
    }
  }

  // If dist CSS is empty, fallback to base stylesheet with arcade styling
  if (!compiledCSSContent) {
    console.warn('[Production Bundle Builder] Warning: No compiled CSS found in dist/assets. Building fallback style...');
    compiledCSSContent = `/* Feral Pig Hunt - Standalone Stylesheet */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&display=swap');
html, body { background: #000; color: #fff; font-family: 'Share Tech Mono', monospace; margin: 0; padding: 0; }
#Advertisement { display: block; text-align: center; vertical-align: center; }
`;
  }

  const CSS_TARGETS = [
    'Public/Feral_Pig_Hunt/Assets/CSS/style.css',
    'public/Feral_Pig_Hunt/Assets/CSS/style.css',
    'Assets/CSS/style.css',
    'public/Assets/CSS/style.css',
    'Public/Assets/CSS/style.css'
  ];

  for (const cssTarget of CSS_TARGETS) {
    fs.writeFileSync(path.join(ROOT, cssTarget), compiledCSSContent, 'utf8');
  }
  console.log('[Production Bundle Builder] Synchronized CSS across all target paths.');

  // 4. Runtime.js setup
  const RUNTIME_JS_CONTENT = `/**
 * Feral Pig Hunt - Client-side runtime initializers & Service Worker Registration
 */
(function () {
  console.log('[Feral Pig Hunt] Initializing client-side arcade engine runtime.');
  if ('serviceWorker' in navigator && (window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker
        .register('./SW.js')
        .catch(function () {
          return navigator.serviceWorker.register('./Sw.js');
        })
        .then(function (registration) {
          console.log('[ServiceWorker] Registration successful with scope:', registration.scope);
        })
        .catch(function () {
          // Gracefully handle preview sandboxes or insecure contexts
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
`;

  const RUNTIME_TARGETS = [
    'Public/Feral_Pig_Hunt/Assets/JS/runtime.js',
    'public/Feral_Pig_Hunt/Assets/JS/runtime.js',
    'Assets/JS/runtime.js',
    'public/Assets/JS/runtime.js',
    'Public/Assets/JS/runtime.js'
  ];

  for (const rtTarget of RUNTIME_TARGETS) {
    fs.writeFileSync(path.join(ROOT, rtTarget), RUNTIME_JS_CONTENT, 'utf8');
  }

  // 5. Service Worker SW.js setup
  const SW_JS_CONTENT = `/**
 * Feral Pig Hunt - Standalone Service Worker (SW.js)
 * Caches essential shell assets for offline gameplay and instant re-loads.
 */
const CACHE_NAME = 'feral-pig-hunt-v0.6';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './Assets/CSS/style.css',
  './Assets/CSS/index.html',
  './Assets/JS/index.js',
  './Assets/JS/runtime.js',
  './Assets/JS/index.html',
  './Assets/index.html'
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
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
`;

  const SW_TARGETS = [
    'Public/Feral_Pig_Hunt/SW.js',
    'public/Feral_Pig_Hunt/SW.js',
    'public/SW.js',
    'SW.js'
  ];

  for (const swTarget of SW_TARGETS) {
    fs.writeFileSync(path.join(ROOT, swTarget), SW_JS_CONTENT, 'utf8');
  }

  // 6. Index HTML entry points
  const INDEX_HTML_STANDALONE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="keywords" content="Feral Pig, Hunt, Arcade, Shooter, Galaga, Galaxian" />
    <title>Feral Pig Hunt</title>
    <meta name="description" content="Feral Pig Hunt - Fixed-shooter arcade game defending the ecosystem from invasive feral hogs." />
    <meta property="og:title" content="Feral Pig Hunt" />
    <meta property="og:description" content="Fixed-shooter arcade game defending the ecosystem from invasive feral hogs." />
    <link rel="stylesheet" href="./Assets/CSS/style.css" />
  </head>
  <body class="bg-black text-white m-0 p-0 overflow-x-hidden font-sans">
    <div id="root"></div>
    <script src="./Assets/JS/runtime.js"></script>
    <script src="./Assets/JS/index.js"></script>
  </body>
</html>
`;

  fs.writeFileSync(path.join(ROOT, 'Public/Feral_Pig_Hunt/index.html'), INDEX_HTML_STANDALONE, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'public/Feral_Pig_Hunt/index.html'), INDEX_HTML_STANDALONE, 'utf8');

  // Subfolder index.html files
  const SUBDIR_INDEX_HTML = (depth: string) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="keywords" content="Feral Pig, Hunt, Arcade, Shooter, Galaga, Galaxian" />
    <title>Feral Pig Hunt</title>
    <meta name="description" content="Feral Pig Hunt - Fixed-shooter arcade game defending the ecosystem from invasive feral hogs." />
    <link rel="stylesheet" href="${depth}Assets/CSS/style.css" />
  </head>
  <body class="bg-black text-white m-0 p-0 overflow-x-hidden font-sans">
    <div id="root"></div>
    <script src="${depth}Assets/JS/runtime.js"></script>
    <script src="${depth}Assets/JS/index.js"></script>
  </body>
</html>
`;

  fs.writeFileSync(path.join(ROOT, 'Public/Feral_Pig_Hunt/Assets/index.html'), SUBDIR_INDEX_HTML('../'), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'Public/Feral_Pig_Hunt/Assets/CSS/index.html'), SUBDIR_INDEX_HTML('../../'), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'Public/Feral_Pig_Hunt/Assets/JS/index.html'), SUBDIR_INDEX_HTML('../../'), 'utf8');

  fs.writeFileSync(path.join(ROOT, 'public/Feral_Pig_Hunt/Assets/index.html'), SUBDIR_INDEX_HTML('../'), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'public/Feral_Pig_Hunt/Assets/CSS/index.html'), SUBDIR_INDEX_HTML('../../'), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'public/Feral_Pig_Hunt/Assets/JS/index.html'), SUBDIR_INDEX_HTML('../../'), 'utf8');

  console.log('[Production Bundle Builder] Generating ZIP archives...');
  await createZip(ROOT, path.join(ROOT, 'dist/zips/Feral_Pig_Hunt_Source_V0.5.zip'));
  await createZip(path.join(ROOT, 'Public/Feral_Pig_Hunt/'), path.join(ROOT, 'dist/zips/Feral_Pig_Hunt_V0.5.zip'));
  console.log('[Production Bundle Builder] Production bundle update for Public/Feral_Pig_Hunt/ successfully completed!');
}

updateProductionBundle().catch((err) => {
  console.error('[Production Bundle Builder] Fatal error during bundle update:', err);
  process.exit(1);
});
