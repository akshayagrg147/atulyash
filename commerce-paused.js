/* Temporary storefront switch: keep the catalogue browsable while paid ordering is paused. */
(() => {
  'use strict';

  window.AtulyashCommercePaused = true;
  window.AtulyashCommercePauseNoticeHidden = true;
  window.AtulyashCommercePauseMessage = 'Weekly Subscriptions Begin 11 October 2026 : First Navratra';
  document.documentElement.classList.add('commerce-paused', 'commerce-paused-notices-hidden');
})();
