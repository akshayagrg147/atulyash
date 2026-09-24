/* Temporary storefront switch: keep the catalogue browsable while paid ordering is paused. */
(() => {
  'use strict';

  window.AtulyashCommercePaused = true;
  window.AtulyashCommercePauseMessage = 'Online ordering is temporarily paused. You can still browse Atulyash while we prepare the next ordering window.';
  document.documentElement.classList.add('commerce-paused');
})();
