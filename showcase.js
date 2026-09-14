(function () {
  'use strict';

  var pathname = window.location.pathname.toLowerCase();
  var page = (pathname.split('/').pop() || 'index.html').toLowerCase();
  var blockedPages = ['account.html', 'checkout.html', 'launch.html', 'cart.html', 'wallet.html'];

  document.documentElement.classList.add('showcase-demo');

  if (blockedPages.indexOf(page) !== -1 || /(?:^|\/)(account|checkout|launch|cart|wallet|reservation)(?:\.html)?\/?$/.test(pathname)) {
    window.location.replace('index.html#home');
    return;
  }

  // The showcase is read-only. Keep public GET requests available for catalog
  // and content, while preventing any order, payment, account, or reservation
  // mutation if a stale handler fires.
  if (typeof window.fetch === 'function') {
    var nativeFetch = window.fetch.bind(window);
    window.fetch = function (resource, options) {
      var method = String(
        (options && options.method) || (resource && resource.method) || 'GET',
      ).toUpperCase();
      if (['POST', 'PUT', 'PATCH', 'DELETE'].indexOf(method) !== -1) {
        return Promise.reject(new Error('Showcase mode is read-only.'));
      }
      return nativeFetch(resource, options);
    };
  }

  var blockedSelector = [
    '#headerAccountLink',
    '#headerCartButton',
    '#addToCartButton',
    '#buyNowButton',
    '#mobileAddButton',
    '#checkoutButton',
    '#placeOrderButton',
    '#startWeeklyButton',
    '#heroWeeklyButton',
    '#launchBanner a',
    '.start-cart-action',
    'a[href*="account.html"]',
    'a[href*="checkout.html"]',
    'a[href*="launch.html"]',
  ].join(',');

  var stopTransaction = function (event) {
    var origin = event.target;
    var target = origin && origin.closest ? origin.closest(blockedSelector) : null;
    if (!target) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showNotice('This customer preview is for browsing only.');
  };

  var stopFormSubmission = function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    showNotice('This customer preview is for browsing only.');
  };

  function showNotice(message) {
    var notice = document.getElementById('showcaseNotice');
    if (!notice) return;
    notice.textContent = message;
    notice.classList.add('is-visible');
    window.clearTimeout(showNotice.timeout);
    showNotice.timeout = window.setTimeout(function () {
      notice.classList.remove('is-visible');
    }, 2600);
  }

  function makeExploreLink(label) {
    var link = document.createElement('a');
    link.className = 'button button-primary showcase-explore-cta';
    link.href = '#shop';
    link.textContent = label || 'Explore our atta';
    return link;
  }

  function hide(element) {
    if (!element) return;
    element.hidden = true;
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('inert', '');
  }

  function replaceWithExplore(selector, label) {
    var element = document.querySelector(selector);
    if (!element) return;
    element.replaceWith(makeExploreLink(label));
  }

  function replaceAllWithExplore(selector, label) {
    document.querySelectorAll(selector).forEach(function (element) {
      element.replaceWith(makeExploreLink(label));
    });
  }

  function applyShowcaseMode() {
    document.body.classList.add('showcase-demo');

    [
      '#launchBanner',
      '#headerAccountLink',
      '#headerCartButton',
      '#cartDrawer',
      '#commerceBackdrop',
      '#commerceToast',
      '#mobileBuyBar',
      '#checkoutHandoff',
      '#storeServiceStatus',
      '#addToCartButton',
      '#buyNowButton',
      '#mobileAddButton',
      '#weeklyCalculatorApplyButton',
      '#heroWeeklyButton',
      '#startWeeklyButton',
    ].forEach(function (selector) {
      hide(document.querySelector(selector));
    });

    var quantityControl = document.querySelector('.quantity-control');
    hide(quantityControl);

    var purchaseRow = document.querySelector('.product-purchase-row');
    if (purchaseRow && !purchaseRow.querySelector('.showcase-explore-cta')) {
      purchaseRow.appendChild(makeExploreLink('Explore our atta'));
    }

    replaceAllWithExplore('a[href="#packSelector"]', 'Explore our atta');
    replaceWithExplore('#calculatorCta', 'Explore our atta');

    document.querySelectorAll('form').forEach(function (form) {
      form.addEventListener('submit', stopFormSubmission, true);
    });
  }

  document.addEventListener('click', stopTransaction, true);
  document.addEventListener('submit', stopFormSubmission, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyShowcaseMode, { once: true });
  } else {
    applyShowcaseMode();
  }
})();
