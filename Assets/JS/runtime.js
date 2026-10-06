/**
 * Feral Pig Hunt - Client-side runtime initializers & Service Worker Registration
 */
(function () {
  console.log('[Feral Pig Hunt] Initializing client-side arcade engine runtime.');
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
