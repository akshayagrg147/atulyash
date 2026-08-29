(() => {
  'use strict';

  const SESSION_META_KEY = 'atulyash-account-meta-v1';
  const STOREFRONT_INTENT_KEY = 'atulyash-storefront-intent-v1';
  const CHECKOUT_CONTEXT_KEY = 'atulyash-checkout-context-v1';
  const CART_STORAGE_KEY = 'atulyash-cart-v1';
  const GOOGLE_AREA_LOOKUP = window.AtulyashGoogleAreaLookup || null;
  const currency = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });
  const shortDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const monthDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short'
  });
  const dateTime = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });

  const $ = (id) => document.getElementById(id);

  function rememberCheckoutOrigin(origin = 'account') {
    sessionStorage.setItem(CHECKOUT_CONTEXT_KEY, JSON.stringify({
      version: 1,
      origin: origin === 'home' ? 'home' : 'account',
      createdAt: Date.now()
    }));
  }

  const elements = {
    skipLink: $('skipLink'),
    authShell: $('authShell'),
    accountShell: $('accountShell'),
    mobileStep: $('mobileStep'),
    otpStep: $('otpStep'),
    authReturnNotice: $('authReturnNotice'),
    mobileForm: $('mobileForm'),
    mobileNumber: $('mobileNumber'),
    mobileError: $('mobileError'),
    otpForm: $('otpForm'),
    otpCode: $('otpCode'),
    otpError: $('otpError'),
    otpMobileDisplay: $('otpMobileDisplay'),
    changeMobileButton: $('changeMobileButton'),
    resendOtpButton: $('resendOtpButton'),
    resendCountdown: $('resendCountdown'),
    headerName: $('headerName'),
    headerAvatar: $('headerAvatar'),
    sidebarName: $('sidebarName'),
    sidebarMobile: $('sidebarMobile'),
    portalSidebar: document.querySelector('.account-shell .portal-sidebar'),
    portalNav: $('portalAccountNav'),
    mobileAccountNavToggle: $('mobileAccountNavToggle'),
    mobileAccountNavLabel: $('mobileAccountNavLabel'),
    profileMenu: $('profileMenu'),
    portalBagShortcut: $('portalBagShortcut'),
    portalBagCount: $('portalBagCount'),
    accountBagBackdrop: $('accountBagBackdrop'),
    accountBagDrawer: $('accountBagDrawer'),
    accountBagCloseButton: $('accountBagCloseButton'),
    accountBagTitleCount: $('accountBagTitleCount'),
    accountBagStatus: $('accountBagStatus'),
    accountBagStatusText: $('accountBagStatusText'),
    accountBagRetryButton: $('accountBagRetryButton'),
    accountBagEmpty: $('accountBagEmpty'),
    accountBagItems: $('accountBagItems'),
    accountBagPromise: $('accountBagPromise'),
    accountBagFooter: $('accountBagFooter'),
    accountBagSubtotalLabel: $('accountBagSubtotalLabel'),
    accountBagSubtotal: $('accountBagSubtotal'),
    accountBagCreditRow: $('accountBagCreditRow'),
    accountBagCredit: $('accountBagCredit'),
    accountBagDeliveryRow: $('accountBagDeliveryRow'),
    accountBagDeliveryLabel: $('accountBagDeliveryLabel'),
    accountBagDeliveryNote: $('accountBagDeliveryNote'),
    accountBagDeliveryCharge: $('accountBagDeliveryCharge'),
    accountBagDeliveryPolicy: $('accountBagDeliveryPolicy'),
    accountBagTotalLabel: $('accountBagTotalLabel'),
    accountBagTotal: $('accountBagTotal'),
    accountBagCheckoutButton: $('accountBagCheckoutButton'),
    accountBagContinueButton: $('accountBagContinueButton'),
    profileShortcut: $('profileShortcut'),
    notificationShortcut: $('notificationShortcut'),
    notificationBadge: $('notificationBadge'),
    navNotificationBadge: $('navNotificationBadge'),
    portalMain: $('portalMain'),
    logoutButton: $('logoutButton'),
    accountQuickOrderForm: $('accountQuickOrderForm'),
    quickOrderModes: $('quickOrderModes'),
    quickOrderOnceFields: $('quickOrderOnceFields'),
    quickOrderWeeklyFields: $('quickOrderWeeklyFields'),
    accountPackSelector: $('accountPackSelector'),
    quickOrderCatalogStatus: $('quickOrderCatalogStatus'),
    quickOrderCatalogMessage: $('quickOrderCatalogMessage'),
    quickOrderCatalogRetry: $('quickOrderCatalogRetry'),
    quickOrderPlan: $('quickOrderPlan'),
    quickOrderMinus: $('quickOrderMinus'),
    quickOrderPlus: $('quickOrderPlus'),
    quickOrderQuantity: $('quickOrderQuantity'),
    quickOrderSelection: $('quickOrderSelection'),
    quickOrderPrice: $('quickOrderPrice'),
    quickOrderTotal: $('quickOrderTotal'),
    quickOrderCtaLabel: $('quickOrderCtaLabel'),
    quickOrderAssuranceText: $('quickOrderAssuranceText'),
    quickOrderWeightBadge: $('quickOrderWeightBadge'),
    quickOrderVisual: $('quickOrderVisual'),
    quickOrderChapatiFill: $('quickOrderChapatiFill'),
    quickOrderPackArt: $('quickOrderPackArt'),
    weeklyChoiceSummary: $('weeklyChoiceSummary'),
    weeklyChoiceQuantity: $('weeklyChoiceQuantity'),
    weeklyChoiceCoverage: $('weeklyChoiceCoverage'),
    weeklyChoicePerDelivery: $('weeklyChoicePerDelivery'),
    weeklyChoiceFirstMonth: $('weeklyChoiceFirstMonth'),
    weeklyChoicePaymentCopy: $('weeklyChoicePaymentCopy'),
    overviewMetrics: $('overviewMetrics'),
    upcomingDelivery: $('upcomingDelivery'),
    overviewOrders: $('overviewOrders'),
    orderFilter: $('orderFilter'),
    ordersStatementButton: $('ordersStatementButton'),
    ordersList: $('ordersList'),
    ordersLoadMore: $('ordersLoadMore'),
    chooseWeeklyPlanButton: $('chooseWeeklyPlanButton'),
    weeklyPlanCount: $('weeklyPlanCount'),
    weeklyPlanCountLabel: $('weeklyPlanCountLabel'),
    vacationBanner: $('vacationBanner'),
    setVacationButton: $('setVacationButton'),
    subscriptionsList: $('subscriptionsList'),
    accountCalculatorDetails: $('accountCalculatorDetails'),
    accountDailyRotis: $('accountDailyRotis'),
    accountRotisMinus: $('accountRotisMinus'),
    accountRotisPlus: $('accountRotisPlus'),
    accountCalculatorKg: $('accountCalculatorKg'),
    accountCalculatorPlan: $('accountCalculatorPlan'),
    accountCalculatorFormula: $('accountCalculatorFormula'),
    addAddressButton: $('addAddressButton'),
    addressesList: $('addressesList'),
    deliveryHomeCount: $('deliveryHomeCount'),
    deliveryHomeCountLabel: $('deliveryHomeCountLabel'),
    walletBalance: $('walletBalance'),
    rechargeForm: $('rechargeForm'),
    rechargeAmount: $('rechargeAmount'),
    rechargeOptions: $('rechargeOptions'),
    rechargePreview: $('rechargePreview'),
    previewRechargeButton: $('previewRechargeButton'),
    initiateRechargeButton: $('initiateRechargeButton'),
    walletTransactions: $('walletTransactions'),
    notificationCategory: $('notificationCategory'),
    unreadOnly: $('unreadOnly'),
    markAllReadButton: $('markAllReadButton'),
    notificationsList: $('notificationsList'),
    profileForm: $('profileForm'),
    profileName: $('profileName'),
    profileEmail: $('profileEmail'),
    profileMobile: $('profileMobile'),
    profileAvatar: $('profileAvatar'),
    requestDeletionButton: $('requestDeletionButton'),
    contactCards: $('contactCards'),
    truthBookCard: $('truthBookCard'),
    faqList: $('faqList'),
    dialog: $('portalDialog'),
    dialogEyebrow: $('dialogEyebrow'),
    dialogTitle: $('dialogTitle'),
    dialogBody: $('dialogBody'),
    dialogCloseButton: $('dialogCloseButton'),
    toast: $('portalToast'),
    globalStatus: $('globalStatus')
  };

  const state = {
    mobile: '',
    userId: null,
    customerId: null,
    user: null,
    customer: null,
    activeView: 'shop',
    quickOrderQuantity: 1,
    quickOrderAnimationTimer: null,
    loaded: new Set(),
    loading: new Map(),
    orders: [],
    orderPage: 1,
    ordersHaveMore: false,
    addresses: [],
    subscriptions: [],
    vacations: [],
    wallet: null,
    walletPreview: null,
    notifications: [],
    unreadCount: 0,
    products: [],
    quickProductPacks: [],
    quickProductCatalogStatus: 'loading',
    weeklyPlans: [],
    weeklyCatalogStatus: 'loading',
    quickOrderSubmitting: false,
    accountBagItems: [],
    accountBagPayload: null,
    accountBagLoading: false,
    accountBagReturnFocus: null,
    contact: null,
    truthBook: null,
    resendTimer: null,
    toastTimer: null,
    dialogReturnFocus: null,
    razorpayLoader: null
  };

  function client() {
    return window.AtulyashAPI || null;
  }

  function methodFrom(group, names) {
    const api = client();
    if (!api) return null;
    const scope = group ? api[group] : api;
    if (!scope) return null;
    for (const name of names) {
      if (typeof scope[name] === 'function') return scope[name].bind(scope);
    }
    return null;
  }

  function withoutKeys(source, keys) {
    const result = {};
    Object.keys(source || {}).forEach((key) => {
      if (!keys.includes(key)) result[key] = source[key];
    });
    return result;
  }

  function groupedArguments(group, methodName, input) {
    const value = input || {};
    const identifier = firstValue(
      value.id,
      value.orderId,
      value.deliveryId,
      value.addressId,
      value.subscriptionId,
      value.subPlanId,
      value.subId,
      value.vacationId,
      value.notificationId,
      value.userId,
      value.customerId
    );

    if (group === 'auth') {
      if (/requestOtp|requestOTP/.test(methodName)) {
        return [value.mobile, { is_rider: false }];
      }
      if (/verifyOtp|verifyOTP/.test(methodName)) {
        return [value.mobile, value.otp, { is_rider: false }];
      }
    }

    if (group === 'addresses') {
      if (/^update$|patchCustomerAddress/.test(methodName)) {
        return [identifier, withoutKeys(value, ['id', 'addressId'])];
      }
      return [value];
    }

    if (group === 'orders') {
      if (/^detail$|getOrderDetails/.test(methodName)) return [identifier];
      if (/subscriptionDeliveries|subscriptionOrders|getSubscriptionDeliveries/.test(methodName)) {
        return [identifier, value.params && typeof value.params === 'object'
          ? value.params
          : withoutKeys(value, ['id', 'orderId', 'deliveryId'])];
      }
      if (/^deliveries$|listDeliveries|getOrderDeliveries/.test(methodName)) {
        return [identifier, value.params && typeof value.params === 'object'
          ? value.params
          : withoutKeys(value, ['id', 'orderId', 'deliveryId'])];
      }
      if (/^deliveryDetail$|getDeliveryDetails/.test(methodName)) return [identifier];
      if (/^deliveryHistory$|getDeliveryHistory/.test(methodName)) {
        return [identifier, value.params && typeof value.params === 'object'
          ? value.params
          : withoutKeys(value, ['id', 'orderId', 'deliveryId'])];
      }
      if (/^reorder$/.test(methodName)) return [identifier];
      if (/^modify$|modifyOrder|modifyPreview|previewModification/.test(methodName)) {
        return [identifier, withoutKeys(value, ['id', 'orderId'])];
      }
      return [value];
    }

    if (group === 'subscriptions') {
      if (/updateSchedule|changeSchedule/.test(methodName)) {
        return [identifier, {
          delivery_day: value.delivery_day,
          effective_from: value.effective_from
        }];
      }
      if (/previewChange|updatePack/.test(methodName)) {
        const newPackId = firstValue(value.new_pack_id, value.subscription_pack_id);
        return [identifier, { new_pack_id: newPackId }];
      }
      if (/skippableDeliveries|getSkippableDeliveries|skipSummary|getSkipSummary/.test(methodName)) {
        return [identifier];
      }
      if (/^(skip|unskip)$|skipDelivery|unskipDelivery/.test(methodName)) {
        return [identifier, value.delivery_date || value.deliveryDate];
      }
      if (/^cancel$/.test(methodName)) {
        return [identifier, {
          cancellation_reason_id: value.cancellation_reason_id,
          cancellation_detail: value.cancellation_detail
        }];
      }
      if (/^updateVacation$|patchCustomerVacation/.test(methodName)) {
        return [identifier, {
          start_date: value.start_date,
          end_date: value.end_date
        }];
      }
      if (/^endVacation$|endCustomerVacation/.test(methodName)) return [identifier];
      if (/cancellationReasons|getCancellationReasons/.test(methodName)) return [];
      if (/^createVacation$|setCustomerVacation/.test(methodName)) {
        return [{
          subscription: value.subscription,
          start_date: value.start_date,
          end_date: value.end_date
        }];
      }
      return [value];
    }

    if (group === 'notifications') {
      if (/unreadCount|fetchUnreadCount|markAllRead/.test(methodName)) return [];
      if (/markRead/.test(methodName)) return [identifier];
      return [value];
    }

    if (group === 'profile') {
      if (/^getUser$|getUserData|^getCustomer$|getCustomerData/.test(methodName)) return [identifier];
      if (/^updateUser$|saveUserData/.test(methodName)) {
        return [identifier, withoutKeys(value, ['id', 'userId'])];
      }
      if (/requestDeletion|submitAccountDeletionRequest/.test(methodName)) return [value.reason];
      return [value];
    }

    if (group === 'misc') {
      if (/^wallet$|getCustomerWallet/.test(methodName)) return [value.customerId || value.id];
      if (/rechargePreview|previewRecharge|rechargeInitiate|initiateRecharge/.test(methodName)) {
        // The wallet API accepts the full request object so cart and active
        // subscription context can be validated server-side. The API client
        // still supports numeric amounts for legacy callers.
        return [value && typeof value === 'object' ? value : value?.amount];
      }
      if (/submitReview|postReview/.test(methodName)) {
        return [{
          order: value.order,
          is_active: value.is_active,
          product: value.product,
          user: value.user,
          rating: value.rating,
          review: value.review,
          to_display: value.to_display
        }];
      }
      if (/rechargeVerify|verifyRecharge/.test(methodName)) return [value];
      if (/walletTransactions|getWalletTransactions|rechargeOptions|getRechargeOptions|faqs|getFAQs|truthBook|getTruthBook|contact|getContactUsData/.test(methodName)) {
        return [value];
      }
    }

    return [value];
  }

  async function apiCall(group, methodNames, input, fallback) {
    const api = client();
    if (!api) throw new Error('The secure Atulyash service is not available on this page.');

    const names = Array.isArray(methodNames) ? methodNames : [methodNames];
    const scope = group ? api[group] : api;
    if (scope) {
      for (const name of names) {
        if (typeof scope[name] === 'function') {
          return scope[name](...groupedArguments(group, name, input));
        }
      }
    }

    if (typeof api.request === 'function' && fallback?.path) {
      const path = typeof fallback.path === 'function' ? fallback.path(input || {}) : fallback.path;
      if (!path) throw new Error('This request needs account information that is not available yet.');
      const formPayload = typeof fallback.form === 'function' ? fallback.form(input || {}) : fallback.form;
      const bodyPayload = typeof fallback.body === 'function' ? fallback.body(input || {}) : fallback.body;
      return api.request(path, {
        method: fallback.method || 'GET',
        query: typeof fallback.query === 'function' ? fallback.query(input || {}) : fallback.query,
        body: bodyPayload === undefined ? formPayload : bodyPayload,
        form: formPayload !== undefined,
        auth: fallback.auth !== false
      });
    }

    throw new Error('This account service is not available in the current API configuration.');
  }

  function responseData(response) {
    if (response == null) return {};
    if (response.data != null) return response.data;
    return response;
  }

  function responseList(response) {
    const data = responseData(response);
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.list)) return data.list;
    if (Array.isArray(data.skippable)) return data.skippable;
    if (Array.isArray(data.notifications)) return data.notifications;
    if (Array.isArray(data.orders)) return data.orders;
    if (Array.isArray(data.addresses)) return data.addresses;
    if (Array.isArray(data.subscriptions)) return data.subscriptions;
    if (Array.isArray(data.transactions)) return data.transactions;
    if (Array.isArray(data.options)) return data.options;
    if (data.data && data.data !== data) return responseList(data.data);
    return [];
  }

  function localBagQuantity() {
    try {
      const items = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
      if (!Array.isArray(items)) return 0;
      return items.reduce((total, item) => {
        const quantity = Number(item?.quantity);
        return total + (Number.isFinite(quantity) && quantity > 0 ? Math.round(quantity) : 0);
      }, 0);
    } catch (error) {
      return 0;
    }
  }

  function bagQuantityFromPayload(payload) {
    const sources = bagPayloadSources(payload);
    const itemKeys = ['cart_items', 'items', 'line_items', 'results'];

    for (const source of sources) {
      for (const key of itemKeys) {
        if (!Array.isArray(source[key])) continue;
        return source[key].reduce((total, item) => {
          const quantity = Number(item?.quantity);
          return total + (Number.isFinite(quantity) && quantity > 0 ? Math.round(quantity) : 1);
        }, 0);
      }
    }

    const countKeys = ['total_quantity', 'item_count', 'items_count', 'cart_items_count', 'total_items'];
    for (const source of sources) {
      for (const key of countKeys) {
        const count = Number(source[key]);
        if (Number.isFinite(count) && count >= 0) return Math.round(count);
      }
    }
    return null;
  }

  function bagPayloadSources(payload) {
    const data = responseData(payload);
    return [
      payload,
      data,
      payload?.cart,
      data?.cart,
      payload?.summary,
      data?.summary,
      payload?.totals,
      data?.totals
    ].filter((source) => source && typeof source === 'object');
  }

  function serverBagItems(payload) {
    const keys = ['cart_items', 'items', 'line_items', 'results'];
    for (const source of bagPayloadSources(payload)) {
      for (const key of keys) {
        if (Array.isArray(source[key])) return source[key];
      }
    }
    return [];
  }

  function readLocalBagItems() {
    try {
      const items = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
      return Array.isArray(items) ? items : [];
    } catch (error) {
      return [];
    }
  }

  function firstFinite(...values) {
    for (const value of values) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return null;
  }

  function weightFromLabel(value) {
    const match = String(value || '').match(/(\d+(?:\.\d+)?)\s*kg/i);
    return match ? Number(match[1]) : null;
  }

  function bagWeightLabel(value) {
    const weight = Number(value);
    if (!Number.isFinite(weight) || weight <= 0) return '';
    return Number.isInteger(weight) ? String(weight) : weight.toFixed(1);
  }

  function weeklyDeliveryCycle(plan) {
    const monthlyKg = Math.round(Number(plan?.monthlyKg));
    const suppliedCycle = Array.isArray(plan?.weeklyQuantityCycle)
      ? plan.weeklyQuantityCycle.map(Number)
      : [];
    if (
      suppliedCycle.length === 4
      && suppliedCycle.every((quantity) => Number.isInteger(quantity) && quantity > 0)
      && suppliedCycle.reduce((total, quantity) => total + quantity, 0) === monthlyKg
    ) return suppliedCycle;
    if (!Number.isInteger(monthlyKg) || monthlyKg < 4) return [];
    const base = Math.floor(monthlyKg / 4);
    const remainder = monthlyKg % 4;
    const extraWeeks = remainder === 3 ? [0, 1, 2] : remainder === 2 ? [0, 2] : remainder === 1 ? [0] : [];
    return Array.from({ length: 4 }, (_, index) => base + (extraWeeks.includes(index) ? 1 : 0));
  }

  function weeklyDeliveryCycleText(plan, { includeWeeks = false } = {}) {
    const cycle = weeklyDeliveryCycle(plan);
    if (!cycle.length) return 'Weekly fresh batches';
    if (cycle.every((quantity) => quantity === cycle[0])) return `${cycle[0]} kg every week`;
    return includeWeeks
      ? cycle.map((quantity, index) => `Week ${index + 1}: ${quantity} kg`).join(' · ')
      : `${cycle.map((quantity) => `${quantity} kg`).join(', ')} across four deliveries`;
  }

  function weeklyPlanSelectionLabel(plan) {
    const cycle = weeklyDeliveryCycle(plan);
    if (!cycle.length || cycle.every((quantity) => quantity === cycle[0])) return cycle.length ? `${cycle[0]} kg every week` : 'Weekly fresh batches';
    return `${cycle[0]} kg / ${cycle[1]} kg alternating`;
  }

  function normalizeServerBagItem(item, index) {
    if (!item || typeof item !== 'object') return null;
    const subscriptionPack = item.subscription_pack && typeof item.subscription_pack === 'object'
      ? item.subscription_pack
      : null;
    const productPack = item.product_pack && typeof item.product_pack === 'object'
      ? item.product_pack
      : null;
    const subscriptionPackId = firstValue(
      subscriptionPack?.id,
      subscriptionPack?.pk,
      subscriptionPack ? null : item.subscription_pack,
      item.subscription_pack_id
    );
    const productPackId = firstValue(
      productPack?.id,
      productPack?.pk,
      productPack ? null : item.product_pack,
      item.product_pack_id
    );
    const catalogPlan = state.weeklyPlans.find((plan) => (
      subscriptionPackId != null && String(plan.id) === String(subscriptionPackId)
    )) || null;
    const catalogPack = state.quickProductPacks.find((pack) => (
      productPackId != null && String(pack.apiId) === String(productPackId)
    )) || null;
    const itemType = String(firstValue(item.cart_item_type, item.item_type, '')).toLowerCase();
    const weekly = Boolean(subscriptionPack || item.subscription_pack) || itemType.includes('subscription');
    const quantity = Math.max(1, Math.round(firstFinite(item.quantity) || 1));
    const weight = weekly
      ? firstFinite(
        catalogPlan?.weeklyKg,
        subscriptionPack?.weekly_quantity,
        item.weekly_quantity,
        item.weight,
        weightFromLabel(subscriptionPack?.name)
      )
      : firstFinite(
        catalogPack?.weight,
        productPack?.weight,
        item.weight,
        weightFromLabel(productPack?.name)
      );
    const unitPrice = firstFinite(
      weekly ? catalogPlan?.price : catalogPack?.price,
      item.unit_price,
      item.price,
      weekly ? subscriptionPack?.weekly_price : productPack?.price
    ) || 0;
    const monthlyPrice = weekly
      ? firstFinite(
        catalogPlan?.monthlyPrice,
        subscriptionPack?.price,
        item.monthly_price,
        item.subscription_price,
        unitPrice * 4
      ) || 0
      : null;
    const monthlyKg = weekly
      ? firstFinite(catalogPlan?.monthlyKg, subscriptionPack?.monthly_quantity, item.monthly_quantity)
      : null;
    const lineTotal = (weekly ? monthlyPrice : unitPrice) * quantity;
    const deliveryDay = firstValue(item.delivery_day, item.preferred_delivery_day, '');
    const compactWeight = bagWeightLabel(weight);
    const monthlyWeight = bagWeightLabel((monthlyKg || 0) * quantity);
    const weeklyPlan = { monthlyKg, weeklyKg: weight, weeklyQuantityCycle: item.weekly_quantity_cycle };
    const unavailable = weekly
      ? state.weeklyCatalogStatus === 'ready' && subscriptionPackId != null && !catalogPlan
      : state.quickProductCatalogStatus === 'ready' && productPackId != null && !catalogPack;
    return {
      key: `server-${firstValue(item.id, item.pk, index)}`,
      source: 'server',
      serverId: firstValue(item.id, item.pk),
      title: firstValue(
        productPack?.product?.name,
        item.product?.name,
        item.product_name,
        'Atulyash Whole Wheat Atta'
      ),
      meta: weekly
        ? [
          weeklyPlanSelectionLabel(weeklyPlan),
          monthlyWeight ? `${monthlyWeight} kg/month total` : '',
          deliveryDay || 'Schedule selected at checkout'
        ].filter(Boolean).join(' · ')
        : `${compactWeight ? `${compactWeight} kg · ` : ''}One-time order`,
      quantity,
      unitPrice,
      monthlyPrice,
      weeklyPlan,
      lineTotal,
      weekly,
      unavailable,
      unavailableLabel: unavailable ? 'This selection is no longer in the active catalogue.' : ''
    };
  }

  function normalizeLocalBagItem(item, index) {
    if (!item || typeof item !== 'object') return null;
    const weekly = item.purchaseType === 'weekly';
    const quantity = Math.max(1, Math.round(firstFinite(item.quantity) || 1));
    const requestedWeight = firstFinite(
      weekly ? item.weeklyKg : item.weightKg,
      item.weight
    );
    const catalogPlan = weekly
      ? state.weeklyPlans.find((plan) => (
        (item.apiPlanId != null && String(plan.id) === String(item.apiPlanId))
        || Number(plan.monthlyKg) === Number(item.monthlyKg)
        || Number(plan.weeklyKg) === Number(requestedWeight)
      )) || null
      : null;
    const catalogPack = !weekly
      ? state.quickProductPacks.find((pack) => (
        (item.apiPackId != null && String(pack.apiId) === String(item.apiPackId))
        || Number(pack.weight) === Number(requestedWeight)
      )) || null
      : null;
    const weight = firstFinite(
      weekly ? catalogPlan?.weeklyKg : catalogPack?.weight,
      requestedWeight
    );
    const unitPrice = firstFinite(
      weekly ? catalogPlan?.price : catalogPack?.price,
      item.pricePerDelivery,
      item.price
    ) || 0;
    const compactWeight = bagWeightLabel(weight);
    const monthlyKg = weekly
      ? firstFinite(catalogPlan?.monthlyKg, item.monthlyKg, (weight || 0) * 4)
      : null;
    const monthlyPrice = weekly
      ? firstFinite(catalogPlan?.monthlyPrice, item.monthlyPrice, unitPrice * 4) || 0
      : null;
    const monthlyWeight = bagWeightLabel((monthlyKg || 0) * quantity);
    const weeklyPlan = { monthlyKg, weeklyKg: weight, weeklyQuantityCycle: item.weeklyQuantityCycle };
    const deliveryDay = firstValue(item.deliveryDay, '');
    const unavailable = weekly
      ? state.weeklyCatalogStatus === 'ready' && !catalogPlan
      : state.quickProductCatalogStatus === 'ready' && !catalogPack;
    return {
      key: `local-${firstValue(item.id, index)}`,
      source: 'local',
      localIndex: index,
      title: 'Atulyash Whole Wheat Atta',
      meta: weekly
        ? [
          weeklyPlanSelectionLabel(weeklyPlan),
          monthlyWeight ? `${monthlyWeight} kg/month total` : '',
          deliveryDay || 'Schedule selected at checkout'
        ].filter(Boolean).join(' · ')
        : `${compactWeight ? `${compactWeight} kg · ` : ''}One-time order`,
      quantity,
      unitPrice,
      monthlyPrice,
      weeklyPlan,
      lineTotal: (weekly ? monthlyPrice : unitPrice) * quantity,
      weekly,
      unavailable,
      unavailableLabel: unavailable ? 'This saved selection is no longer in the active catalogue.' : ''
    };
  }

  function normalizedAccountBagItems(payload = state.accountBagPayload) {
    const liveItems = serverBagItems(payload)
      .map(normalizeServerBagItem)
      .filter(Boolean);
    const savedItems = readLocalBagItems()
      .map(normalizeLocalBagItem)
      .filter(Boolean);
    // Match the storefront contract: an unsynchronised local selection is the
    // pending bag until checkout sync completes. Showing both copies here
    // would inflate the customer-facing count and total.
    return savedItems.length ? savedItems : liveItems;
  }

  function accountBagMoney(payload, keys) {
    for (const source of bagPayloadSources(payload)) {
      for (const key of keys) {
        if (source?.[key] == null || source?.[key] === '') continue;
        const value = Number(source[key]);
        if (Number.isFinite(value)) return value;
      }
    }
    return NaN;
  }

  function accountBagDeliverySummary(payload, { hasWeekly = false, hasLocalSelections = false } = {}) {
    if (hasLocalSelections) {
      return {
        amount: null,
        known: false,
        requiresSupport: false,
        label: 'Delivery charge pending sync',
        note: 'Your saved selection will be priced by the live bag before checkout.'
      };
    }
    const hasLiveCart = serverBagItems(payload).length > 0 || (bagQuantityFromPayload(payload) || 0) > 0;
    if (!hasLiveCart) {
      return {
        amount: null,
        known: false,
        requiresSupport: false,
        label: 'Delivery charge pending sync',
        note: 'Your saved selection will be priced by the live bag before checkout.'
      };
    }

    const amount = accountBagMoney(payload, ['delivery_charge']);
    let reason = '';
    let requiresSupport;
    for (const source of bagPayloadSources(payload)) {
      if (!reason && source.delivery_charge_reason) reason = String(source.delivery_charge_reason);
      if (typeof source.delivery_requires_customer_care === 'boolean') {
        requiresSupport = source.delivery_requires_customer_care;
      }
    }
    const reasonLabels = {
      ONE_TIME_2_TO_6_KG: 'One-time delivery · 2–6 kg',
      ONE_TIME_7_TO_10_KG: 'One-time delivery · 7–10 kg',
      ONE_TIME_11_TO_40_KG: 'One-time delivery · 11–40 kg',
      ABOVE_40_KG_CUSTOMER_CARE: 'Large-order delivery',
      WEEKLY_SUBSCRIPTION: 'Fresh-batch delivery'
    };
    if (requiresSupport === true) {
      return {
        amount: null,
        known: true,
        requiresSupport: true,
        label: reasonLabels[reason] || 'Delivery requires customer care',
        note: 'This order needs confirmation from Atulyash Customer Care before checkout.'
      };
    }
    if (!Number.isFinite(amount)) {
      return {
        amount: null,
        known: false,
        requiresSupport: true,
        label: 'Delivery charge unavailable',
        note: 'The live bag did not return a delivery-charge decision. Refresh your bag before checkout.'
      };
    }
    return {
      amount: Math.max(0, amount),
      known: true,
      requiresSupport: false,
      label: reasonLabels[reason] || (hasWeekly ? 'Fresh-batch delivery' : 'Delivery charge'),
      note: amount === 0
        ? 'The live bag confirms free delivery.'
        : `The live bag confirms a ${currency.format(amount)} delivery charge.`
    };
  }

  function accountBagSummary(lines, lineSubtotal) {
    const hasLocalSelections = readLocalBagItems().length > 0;
    const hasWeekly = lines.some((line) => line.weekly);
    const hasLiveCart = serverBagItems(state.accountBagPayload).length > 0
      || (bagQuantityFromPayload(state.accountBagPayload) || 0) > 0;
    const serverSubtotal = accountBagMoney(
      state.accountBagPayload,
      ['items_total', 'subtotal', 'sub_total', 'cart_subtotal', 'gross_amount', 'total_before_discount']
    );
    const serverDiscount = accountBagMoney(
      state.accountBagPayload,
      ['applied_coupon_discount', 'discount_amount', 'discount', 'coupon_discount', 'kit_discount', 'total_discount']
    );
    const serverTotal = accountBagMoney(
      state.accountBagPayload,
      ['cart_total', 'net_payable', 'grand_total', 'final_amount', 'payable_amount', 'total_amount', 'total']
    );
    const useServerSummary = !hasLocalSelections && hasLiveCart;
    const subtotal = useServerSummary && Number.isFinite(serverSubtotal)
      ? serverSubtotal
      : lineSubtotal;
    const discount = useServerSummary && Number.isFinite(serverDiscount)
      ? Math.max(0, serverDiscount)
      : 0;
    const total = useServerSummary && Number.isFinite(serverTotal)
      ? serverTotal
      : Math.max(0, subtotal - discount);
    const delivery = accountBagDeliverySummary(state.accountBagPayload, { hasWeekly, hasLocalSelections });
    return {
      subtotal,
      discount,
      total,
      deliveryCharge: delivery.amount,
      deliveryKnown: delivery.known,
      deliveryLabel: delivery.label,
      deliveryNote: delivery.note,
      deliveryRequiresSupport: delivery.requiresSupport
    };
  }

  function showPortalBagCount(count) {
    if (!elements.portalBagShortcut || !elements.portalBagCount) return;
    const quantity = Math.max(0, Math.round(Number(count) || 0));
    elements.portalBagCount.textContent = quantity > 99 ? '99+' : String(quantity);
    elements.portalBagCount.hidden = false;
    elements.portalBagShortcut.setAttribute(
      'aria-label',
      `Open My Bag, ${quantity} ${quantity === 1 ? 'item' : 'items'}`
    );
  }

  async function refreshPortalBagCount() {
    const localQuantity = localBagQuantity();
    if (localQuantity > 0) showPortalBagCount(localQuantity);

    const ensureActiveBag = methodFrom('cart', ['ensureActive']);
    if (!ensureActiveBag) return;
    try {
      const payload = await ensureActiveBag(state.mobile);
      state.accountBagPayload = payload;
      const liveQuantity = bagQuantityFromPayload(payload);
      if (localQuantity === 0 && liveQuantity != null) {
        showPortalBagCount(liveQuantity);
      }
    } catch (error) {
      // The bag remains directly accessible even when its live count cannot load.
    }
  }

  function setAccountBagStatus(message = '', {
    state: status = 'loading',
    retry = false,
    hidden = false
  } = {}) {
    if (!elements.accountBagStatus) return;
    elements.accountBagStatus.hidden = hidden;
    elements.accountBagStatus.dataset.state = status;
    if (elements.accountBagStatusText) elements.accountBagStatusText.textContent = message;
    if (elements.accountBagRetryButton) elements.accountBagRetryButton.hidden = !retry;
  }

  function makeAccountBagLine(line) {
    const article = create(
      'article',
      `account-bag-line unified-bag-item${line.source === 'local' ? ' is-saved' : ''}${line.unavailable ? ' is-unavailable' : ''}`
    );
    article.dataset.bagSource = line.source;
    if (line.serverId != null) article.dataset.serverId = String(line.serverId);
    if (line.localIndex != null) article.dataset.localIndex = String(line.localIndex);

    const visual = create('div', 'account-bag-line-visual unified-bag-item-visual');
    const image = document.createElement('img');
    image.src = 'images/sack5g.webp';
    image.width = 490;
    image.height = 512;
    image.alt = '';
    visual.append(image);

    const copy = create('div', 'account-bag-line-copy unified-bag-item-info');
    const price = create('strong', 'account-bag-line-price', currency.format(line.lineTotal));
    const top = create('div', 'unified-bag-item-top');
    top.append(create('h3', '', line.title), price);
    const meta = create(
      'p',
      'unified-bag-item-meta',
      line.unavailable
        ? line.unavailableLabel
        : line.weekly
          ? `${line.meta} · ${currency.format(line.unitPrice)} per delivery · ${currency.format(line.monthlyPrice)} minimum wallet balance for 4 deliveries`
          : `${line.meta} · ${currency.format(line.unitPrice)} each`
    );
    const controls = create('div', 'account-bag-line-controls unified-bag-item-controls');
    if (line.unavailable) {
      controls.append(create('span', 'cart-item-warning', 'Ordering unavailable'));
      const remove = button('Remove', 'account-bag-remove', null);
      remove.dataset.bagAction = 'remove';
      remove.disabled = line.source === 'server' && line.serverId == null;
      controls.append(remove);
      copy.append(top, meta, controls);
      article.append(visual, copy);
      return article;
    }
    const quantity = create('div', 'account-bag-quantity unified-bag-quantity');
    quantity.setAttribute('aria-label', `Quantity for ${line.title}`);
    const minus = button('−', '', null);
    minus.dataset.bagAction = 'decrease';
    minus.setAttribute('aria-label', `Decrease quantity for ${line.title}`);
    minus.disabled = line.source === 'server' && line.serverId == null;
    const output = create('output', '', line.quantity);
    output.setAttribute('aria-label', `Quantity ${line.quantity}`);
    output.setAttribute('aria-live', 'polite');
    const plus = button('+', '', null);
    plus.dataset.bagAction = 'increase';
    plus.setAttribute('aria-label', `Increase quantity for ${line.title}`);
    plus.disabled = line.quantity >= 20 || (line.source === 'server' && line.serverId == null);
    quantity.append(minus, output, plus);
    const remove = button('Remove', 'account-bag-remove', null);
    remove.dataset.bagAction = 'remove';
    remove.disabled = line.source === 'server' && line.serverId == null;
    controls.append(quantity, remove);

    copy.append(top, meta, controls);
    article.append(visual, copy);
    return article;
  }

  function renderAccountBag() {
    if (!elements.accountBagItems) return;
    state.accountBagItems = normalizedAccountBagItems();
    const quantity = state.accountBagItems.reduce((total, item) => total + item.quantity, 0);
    const lineSubtotal = state.accountBagItems.reduce((total, item) => total + item.lineTotal, 0);
    const summary = accountBagSummary(state.accountBagItems, lineSubtotal);
    const hasWeekly = state.accountBagItems.some((item) => item.weekly);
    showPortalBagCount(quantity);
    if (elements.accountBagTitleCount) elements.accountBagTitleCount.textContent = `(${quantity})`;
    if (elements.accountBagSubtotalLabel) {
      elements.accountBagSubtotalLabel.textContent = hasWeekly
        ? 'Four-delivery wallet cover'
        : 'Subtotal';
    }
    if (elements.accountBagSubtotal) elements.accountBagSubtotal.textContent = currency.format(summary.subtotal);
    if (elements.accountBagCreditRow) elements.accountBagCreditRow.hidden = summary.discount <= 0;
    if (elements.accountBagCredit) elements.accountBagCredit.textContent = `−${currency.format(summary.discount)}`;
    if (elements.accountBagDeliveryRow) elements.accountBagDeliveryRow.hidden = state.accountBagItems.length === 0;
    if (elements.accountBagDeliveryLabel) elements.accountBagDeliveryLabel.textContent = summary.deliveryLabel;
    if (elements.accountBagDeliveryNote) elements.accountBagDeliveryNote.textContent = summary.deliveryNote;
    if (elements.accountBagDeliveryCharge) {
      elements.accountBagDeliveryCharge.textContent = summary.deliveryRequiresSupport
        ? 'Contact care'
        : summary.deliveryKnown
          ? summary.deliveryCharge === 0 ? 'Free' : currency.format(summary.deliveryCharge)
          : 'At checkout';
    }
    if (elements.accountBagDeliveryPolicy) {
      elements.accountBagDeliveryPolicy.textContent = summary.deliveryRequiresSupport
        ? 'Checkout is paused until Atulyash Customer Care confirms this delivery.'
        : summary.deliveryKnown
          ? 'This delivery amount comes from your live Atulyash bag and is included in the total.'
          : 'Your live delivery amount will appear as soon as this saved selection is synchronised.';
    }
    if (elements.accountBagTotalLabel) {
      elements.accountBagTotalLabel.textContent = hasWeekly
        ? 'Minimum wallet balance'
        : 'Order total';
    }
    if (elements.accountBagTotal) elements.accountBagTotal.textContent = currency.format(summary.total);

    const fragment = document.createDocumentFragment();
    state.accountBagItems.forEach((line) => fragment.append(makeAccountBagLine(line)));
    elements.accountBagItems.replaceChildren(fragment);
    if (elements.accountBagEmpty) elements.accountBagEmpty.hidden = state.accountBagItems.length > 0;
    if (elements.accountBagPromise) elements.accountBagPromise.hidden = state.accountBagItems.length === 0;
    if (elements.accountBagFooter) elements.accountBagFooter.hidden = state.accountBagItems.length === 0;
    if (elements.accountBagCheckoutButton) {
      elements.accountBagCheckoutButton.disabled = (
        state.accountBagItems.length === 0
        || state.accountBagLoading
        || state.accountBagItems.some((item) => item.unavailable)
        || summary.deliveryRequiresSupport
      );
    }
  }

  async function loadAccountBag() {
    if (state.accountBagLoading) return;
    state.accountBagLoading = true;
    setAccountBagStatus('Refreshing your secure bag…', { state: 'loading' });
    renderAccountBag();

    try {
      const ensureActiveBag = methodFrom('cart', ['ensureActive']);
      if (!ensureActiveBag) throw new Error('The secure bag service is unavailable right now.');
      let payload = await ensureActiveBag(state.mobile);
      const reportedQuantity = bagQuantityFromPayload(payload);
      if (!serverBagItems(payload).length && reportedQuantity > 0) {
        const activeSession = client()?.getSession?.() || {};
        const cartId = firstValue(activeSession.cartId, activeSession.cart_id);
        const getBag = methodFrom('cart', ['get']);
        if (cartId != null && getBag) payload = await getBag(cartId);
      }
      state.accountBagPayload = payload;
      renderAccountBag();
      const savedCount = readLocalBagItems().length;
      if (savedCount) {
        setAccountBagStatus(
          `${savedCount} ${savedCount === 1 ? 'selection is' : 'selections are'} saved from before sign-in and will be securely synchronised when you continue.`,
          { state: 'info' }
        );
      } else {
        setAccountBagStatus('', { hidden: true });
      }
    } catch (error) {
      renderAccountBag();
      setAccountBagStatus(
        friendlyError(error, 'We could not refresh your live bag. Your saved selections are still safe.'),
        { state: 'error', retry: true }
      );
    } finally {
      state.accountBagLoading = false;
      if (elements.accountBagCheckoutButton) {
        elements.accountBagCheckoutButton.disabled = (
          state.accountBagItems.length === 0
          || state.accountBagItems.some((item) => item.unavailable)
        );
      }
    }
  }

  function setAccountBagBackgroundInert(inert) {
    document.querySelector('.account-shell .portal-header')?.toggleAttribute('inert', inert);
    document.querySelector('.account-shell .portal-layout')?.toggleAttribute('inert', inert);
    document.querySelector('.account-shell .portal-footer')?.toggleAttribute('inert', inert);
  }

  function openAccountBag({ refresh = true } = {}) {
    if (!elements.accountBagDrawer || elements.accountShell.hidden) return;
    if (elements.accountBagDrawer.classList.contains('is-open')) return;
    state.accountBagReturnFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : elements.portalBagShortcut;
    if (elements.accountBagBackdrop) elements.accountBagBackdrop.hidden = false;
    elements.accountBagDrawer.inert = false;
    elements.accountBagDrawer.setAttribute('aria-hidden', 'false');
    elements.portalBagShortcut?.setAttribute('aria-expanded', 'true');
    setAccountBagBackgroundInert(true);
    document.body.classList.add('account-bag-open');
    window.requestAnimationFrame(() => {
      elements.accountBagBackdrop?.classList.add('is-visible');
      elements.accountBagDrawer?.classList.add('is-open');
    });
    renderAccountBag();
    if (refresh) void loadAccountBag();
    window.setTimeout(() => elements.accountBagCloseButton?.focus(), 40);
  }

  function closeAccountBag({ restoreFocus = true } = {}) {
    if (!elements.accountBagDrawer) return;
    elements.accountBagDrawer.classList.remove('is-open');
    elements.accountBagBackdrop?.classList.remove('is-visible');
    elements.accountBagDrawer.setAttribute('aria-hidden', 'true');
    elements.accountBagDrawer.inert = true;
    elements.portalBagShortcut?.setAttribute('aria-expanded', 'false');
    setAccountBagBackgroundInert(false);
    document.body.classList.remove('account-bag-open');
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 320;
    window.setTimeout(() => {
      if (elements.accountBagBackdrop) elements.accountBagBackdrop.hidden = true;
    }, delay);
    if (restoreFocus) state.accountBagReturnFocus?.focus?.();
    state.accountBagReturnFocus = null;
  }

  function saveLocalBagItems(items) {
    if (items.length) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    else localStorage.removeItem(CART_STORAGE_KEY);
  }

  async function updateAccountBagLine(article, action) {
    if (!article || state.accountBagLoading) return;
    const source = article.dataset.bagSource;
    const line = source === 'local'
      ? state.accountBagItems.find((item) => (
        item.source === 'local' && String(item.localIndex) === String(article.dataset.localIndex)
      ))
      : state.accountBagItems.find((item) => (
        item.source === 'server' && String(item.serverId) === String(article.dataset.serverId)
      ));
    if (!line) return;
    const effectiveAction = action === 'decrease' && line.quantity <= 1 ? 'remove' : action;

    article.querySelectorAll('button').forEach((control) => { control.disabled = true; });
    if (source === 'local') {
      try {
        const items = readLocalBagItems();
        const index = Number(line.localIndex);
        if (!items[index]) throw new Error('This saved selection is no longer available.');
        if (effectiveAction === 'remove') items.splice(index, 1);
        else {
          const change = effectiveAction === 'increase' ? 1 : -1;
          items[index].quantity = Math.max(1, Math.min(20, line.quantity + change));
        }
        saveLocalBagItems(items);
        renderAccountBag();
        const savedCount = readLocalBagItems().length;
        if (savedCount) {
          setAccountBagStatus(
            `${savedCount} ${savedCount === 1 ? 'selection is' : 'selections are'} saved from before sign-in and will be securely synchronised when you continue.`,
            { state: 'info' }
          );
        } else {
          setAccountBagStatus('', { hidden: true });
        }
        announce(effectiveAction === 'remove' ? 'Selection removed from your bag.' : 'Bag quantity updated.');
      } catch (error) {
        setAccountBagStatus('This saved selection could not be updated.', { state: 'error' });
        renderAccountBag();
      }
      return;
    }

    state.accountBagLoading = true;
    try {
      if (effectiveAction === 'remove') {
        const removeItem = methodFrom('cart', ['deleteItem']);
        if (!removeItem) throw new Error('Bag removal is unavailable right now.');
        await removeItem(line.serverId);
      } else {
        const updateItem = methodFrom('cart', ['updateItem']);
        if (!updateItem) throw new Error('Bag updates are unavailable right now.');
        const change = effectiveAction === 'increase' ? 1 : -1;
        await updateItem(line.serverId, {
          quantity: Math.max(1, Math.min(20, line.quantity + change))
        });
      }
      state.accountBagLoading = false;
      await loadAccountBag();
      announce(effectiveAction === 'remove' ? 'Item removed from your bag.' : 'Bag quantity updated.');
    } catch (error) {
      state.accountBagLoading = false;
      setAccountBagStatus(
        friendlyError(error, 'Your bag could not be updated. Please try again.'),
        { state: 'error', retry: true }
      );
      renderAccountBag();
    }
  }

  function continueAccountBagCheckout() {
    if (!state.accountBagItems.length) return;
    try {
      rememberCheckoutOrigin('account');
      window.location.assign('checkout.html');
    } catch (error) {
      showToast('We could not prepare secure checkout. Please try again.', 'error');
    }
  }

  function trapAccountBagFocus(event) {
    if (
      event.key !== 'Tab'
      || !elements.accountBagDrawer?.classList.contains('is-open')
    ) return;
    const focusable = [...elements.accountBagDrawer.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter((control) => !control.hidden && control.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function nextPageExists(response, listLength, pageSize = 15) {
    const data = responseData(response);
    return Boolean(data.next || data.next_page || data.has_next || listLength >= pageSize);
  }

  function numberFrom(...values) {
    for (const value of values) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return 0;
  }

  function firstValue(...values) {
    return values.find((value) => value !== undefined && value !== null && value !== '');
  }

  function idOf(value) {
    if (value == null) return null;
    if (typeof value === 'object') return firstValue(value.id, value.pk, value.uuid);
    return value;
  }

  function formatMoney(value) {
    return currency.format(numberFrom(value));
  }

  function dateValue(value) {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function formatDate(value, includeTime = false) {
    const parsed = dateValue(value);
    if (!parsed) return 'Date to be confirmed';
    return includeTime ? dateTime.format(parsed) : shortDate.format(parsed);
  }

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = String(text);
    return element;
  }

  function button(text, className, handler) {
    const control = create('button', className, text);
    control.type = 'button';
    if (handler) control.addEventListener('click', handler);
    return control;
  }

  function safeUrl(value) {
    if (!value) return null;
    try {
      const apiBase = typeof client()?.getConfig === 'function'
        ? client().getConfig().baseUrl
        : window.location.href;
      const parsed = new URL(value, apiBase || window.location.href);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol) ? parsed.href : null;
    } catch (error) {
      return null;
    }
  }

  function loadRazorpayCheckout() {
    if (typeof window.Razorpay === 'function') return Promise.resolve(window.Razorpay);
    if (state.razorpayLoader) return state.razorpayLoader;
    state.razorpayLoader = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => (
        typeof window.Razorpay === 'function'
          ? resolve(window.Razorpay)
          : reject(new Error('Razorpay loaded without a checkout client.'))
      );
      script.onerror = () => reject(new Error('Razorpay Checkout could not be loaded.'));
      document.head.append(script);
    });
    return state.razorpayLoader;
  }

  function announce(message) {
    elements.globalStatus.textContent = '';
    window.requestAnimationFrame(() => {
      elements.globalStatus.textContent = message;
    });
  }

  function setToastLayer(inDialog) {
    if (!elements.toast) return;
    const shouldUseDialogLayer = Boolean(inDialog && elements.dialog?.open);
    if (shouldUseDialogLayer) {
      if (elements.toast.parentElement !== elements.dialog) {
        elements.dialog.append(elements.toast);
      }
      elements.toast.classList.add('is-dialog-toast');
      return;
    }
    if (elements.toast.parentElement !== document.body) {
      document.body.append(elements.toast);
    }
    elements.toast.classList.remove('is-dialog-toast');
  }

  function showToast(message, type = 'success') {
    window.clearTimeout(state.toastTimer);
    setToastLayer(elements.dialog?.open);
    elements.toast.textContent = message;
    elements.toast.classList.toggle('is-error', type === 'error');
    elements.toast.hidden = false;
    state.toastTimer = window.setTimeout(() => {
      elements.toast.hidden = true;
      setToastLayer(false);
    }, 4400);
  }

  function readableErrorValue(value, field = '') {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (Array.isArray(value)) {
      for (const entry of value) {
        const message = readableErrorValue(entry, field);
        if (message) return message;
      }
      return '';
    }
    if (!value || typeof value !== 'object') return '';

    for (const key of ['detail', 'message', 'error', 'non_field_errors', 'errors']) {
      const message = readableErrorValue(value[key], key);
      if (message) return message;
    }
    for (const [key, nested] of Object.entries(value)) {
      const message = readableErrorValue(nested, key);
      if (!message) continue;
      const label = String(key).replaceAll('_', ' ');
      return ['detail', 'message', 'error', 'non field errors', 'errors'].includes(label)
        ? message
        : `${label.charAt(0).toUpperCase()}${label.slice(1)}: ${message}`;
    }
    return '';
  }

  function friendlyError(error, fallback = 'Something did not go through. Please try again.') {
    if (!error) return fallback;
    const payload = error.data || error.response?.data || error.body || error.details;
    const message = firstValue(
      readableErrorValue(payload),
      error.userMessage,
      error.message
    );
    if (typeof message === 'string' && message.trim()) {
      const safeMessage = message.trim();
      if (/unsupported operand type|nonetype.*int|typeerror/i.test(safeMessage)) {
        return 'This change could not be completed right now. Please choose a future delivery date and try again.';
      }
      return safeMessage;
    }
    return fallback;
  }

  function isUnauthorized(error) {
    const status = firstValue(error?.status, error?.statusCode, error?.response?.status);
    return Number(status) === 401 || /unauthori|token.*expired|authentication credentials/i.test(friendlyError(error, ''));
  }

  function setButtonBusy(control, busy, busyText) {
    if (!control) return;
    if (busy) {
      control.dataset.originalText = control.textContent;
      control.disabled = true;
      if (busyText) control.textContent = busyText;
    } else {
      control.disabled = false;
      if (control.dataset.originalText) {
        control.textContent = control.dataset.originalText;
        delete control.dataset.originalText;
      }
    }
  }

  function makeState(type, title, copy, retry) {
    const wrapper = create('div', `${type}-state`);
    const inner = create('div', 'state-inner');
    inner.append(
      create('span', 'state-mark', type === 'error' ? '!' : type === 'loading' ? '·' : 'A'),
      create('h2', '', title),
      create('p', '', copy)
    );
    if (retry) inner.append(button('Try again', 'secondary-button', retry));
    wrapper.append(inner);
    return wrapper;
  }

  function renderLoading(container, text = 'Bringing your account up to date…') {
    if (!container) return;
    container.replaceChildren(makeState('loading', 'Just a moment.', text));
  }

  function renderEmpty(container, title, copy, action) {
    if (!container) return;
    const stateElement = makeState('empty', title, copy);
    if (action) stateElement.querySelector('.state-inner')?.append(action);
    container.replaceChildren(stateElement);
  }

  function renderError(container, error, retry) {
    if (!container) return;
    container.replaceChildren(makeState('error', 'We could not load this yet.', friendlyError(error), retry));
  }

  function persistMeta() {
    const meta = {
      mobile: state.mobile,
      userId: state.userId,
      customerId: state.customerId
    };
    sessionStorage.setItem(SESSION_META_KEY, JSON.stringify(meta));
  }

  function readMeta() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_META_KEY) || '{}');
    } catch (error) {
      return {};
    }
  }

  function captureIdentity(payload, mobileFallback = '') {
    const data = responseData(payload);
    const user = firstValue(data.user, data.user_data, data.profile, data.auth_user);
    const customer = firstValue(data.customer, data.customer_data, user?.customer);
    state.mobile = String(firstValue(
      data.mobile,
      data.phone,
      data.phone_number,
      user?.mobile,
      user?.phone,
      customer?.mobile,
      mobileFallback,
      state.mobile
    ) || '').replace(/\D/g, '').slice(-10);
    state.userId = firstValue(
      idOf(user),
      data.user_id,
      data.userId,
      customer?.user_id,
      idOf(customer?.user),
      state.userId
    );
    state.customerId = firstValue(
      idOf(customer),
      data.customer_id,
      data.customerId,
      user?.customer_id,
      idOf(user?.customer),
      state.customerId
    );
    if (user && typeof user === 'object') state.user = user;
    if (customer && typeof customer === 'object') state.customer = customer;
    persistMeta();
  }

  async function resolveCustomerIdentity() {
    if (state.customerId) return true;
    const resolver = methodFrom('auth', ['resolveCustomerSession']);
    if (resolver) {
      const session = await resolver(state.mobile);
      captureIdentity(session, state.mobile);
    }
    if (!state.customerId) {
      throw new Error('Your mobile is verified, but we could not connect your customer account yet.');
    }
    return true;
  }

  async function restoreSession() {
    const meta = readMeta();
    state.mobile = String(meta.mobile || '');
    state.userId = meta.userId || null;
    state.customerId = meta.customerId || null;

    const getSession = methodFrom('auth', ['getSession', 'session']) || methodFrom(null, ['getSession']);
    if (getSession) {
      try {
        const session = await getSession();
        if (session && (session.accessToken || session.isAuthenticated === true)) {
          captureIdentity(session, state.mobile);
          await resolveCustomerIdentity();
          return true;
        }
      } catch (error) {
        return false;
      }
    }

    const isAuthenticated = methodFrom('auth', ['isAuthenticated']) || methodFrom(null, ['isAuthenticated']);
    if (isAuthenticated) {
      try {
        if (!await isAuthenticated()) return false;
        await resolveCustomerIdentity();
        return true;
      } catch (error) {
        return false;
      }
    }

    if (meta.mobile && (meta.userId || meta.customerId)) {
      await resolveCustomerIdentity();
      return true;
    }
    return false;
  }

  async function requestOtp(mobile) {
    return apiCall('auth', ['requestOtp', 'requestOTP'], { mobile, is_rider: false }, {
      path: '/users/otp/request/',
      method: 'POST',
      form: { mobile, is_rider: false },
      auth: false
    });
  }

  async function verifyOtp(mobile, otp) {
    return apiCall('auth', ['verifyOtp', 'verifyOTP'], { mobile, otp }, {
      path: '/users/otp/verify/',
      method: 'POST',
      form: { mobile, otp, is_rider: false },
      auth: false
    });
  }

  function showOtpStep() {
    elements.mobileStep.hidden = true;
    elements.otpStep.hidden = false;
    elements.otpMobileDisplay.textContent = `+91 ${state.mobile.slice(0, 5)} ${state.mobile.slice(5)}`;
    elements.otpCode.value = '';
    elements.otpError.textContent = '';
    startResendCountdown();
    window.setTimeout(() => elements.otpCode.focus(), 40);
  }

  function showMobileStep() {
    window.clearInterval(state.resendTimer);
    elements.otpStep.hidden = true;
    elements.mobileStep.hidden = false;
    elements.mobileNumber.value = state.mobile;
    elements.mobileError.textContent = '';
    window.setTimeout(() => elements.mobileNumber.focus(), 40);
  }

  function startResendCountdown(seconds = 30) {
    window.clearInterval(state.resendTimer);
    let remaining = seconds;
    elements.resendOtpButton.disabled = true;
    elements.resendOtpButton.replaceChildren(
      document.createTextNode('Resend code in '),
      create('span', '', remaining),
      document.createTextNode('s')
    );
    state.resendTimer = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        window.clearInterval(state.resendTimer);
        elements.resendOtpButton.disabled = false;
        elements.resendOtpButton.textContent = 'Resend secure code';
        return;
      }
      const count = elements.resendOtpButton.querySelector('span');
      if (count) count.textContent = String(remaining);
    }, 1000);
  }

  function accountRoute() {
    const [viewCandidate, detailId] = window.location.hash.replace(/^#/, '').split('/');
    const allowedViews = new Set([
      'shop',
      'overview',
      'orders',
      'subscriptions',
      'addresses',
      'wallet',
      'notifications',
      'profile',
      'support'
    ]);
    return {
      view: allowedViews.has(viewCandidate) ? viewCandidate : 'shop',
      detailId: viewCandidate === 'orders' && detailId ? decodeURIComponent(detailId) : null
    };
  }

  function storefrontReturnMode() {
    const mode = new URLSearchParams(window.location.search).get('return');
    return mode === 'checkout' ? 'checkout' : mode === 'cart' ? 'cart' : '';
  }

  function updateAuthReturnNotice() {
    if (!elements.authReturnNotice) return;
    const mode = storefrontReturnMode();
    elements.authReturnNotice.hidden = !mode;
    const title = elements.authReturnNotice.querySelector('strong');
    const copy = elements.authReturnNotice.querySelector('span');
    if (title) {
      title.textContent = mode === 'checkout'
        ? 'Your secure checkout is ready to continue.'
        : 'Your bag is ready to reopen.';
    }
    if (copy) {
      copy.textContent = mode === 'checkout'
        ? 'Sign in with your mobile number and we’ll take you straight back to delivery.'
        : 'Sign in with your mobile number and we’ll take you straight back to your bag.';
    }
  }

  function returnToStorefrontAfterAuthentication() {
    const mode = storefrontReturnMode();
    if (!mode) return false;
    if (mode === 'checkout') {
      rememberCheckoutOrigin('account');
      window.location.assign('checkout.html');
      return true;
    }
    sessionStorage.setItem(STOREFRONT_INTENT_KEY, JSON.stringify({
      action: 'openCart',
      createdAt: Date.now()
    }));
    window.location.assign('index.html#shop');
    return true;
  }

  function enterAccount() {
    if (returnToStorefrontAfterAuthentication()) return;
    window.clearInterval(state.resendTimer);
    elements.authShell.hidden = true;
    elements.accountShell.hidden = false;
    elements.skipLink.href = '#portalMain';
    elements.skipLink.textContent = 'Skip to My Atulyash';
    updateIdentityUI();
    const route = accountRoute();
    showView(route.view, { focus: false, updateHash: false });
    if (route.detailId) {
      window.setTimeout(() => openOrderDetail({ id: route.detailId, order_id: route.detailId }), 80);
    }
    void refreshPortalBagCount();
    void loadUnread().catch(() => updateUnreadUI(0));
    window.scrollTo(0, 0);
  }

  function enterAuth(message) {
    const alreadyShowingAuth = !elements.authShell.hidden;
    if (elements.accountBagDrawer?.classList.contains('is-open')) {
      closeAccountBag({ restoreFocus: false });
    }
    sessionStorage.removeItem(SESSION_META_KEY);
    state.loaded.clear();
    state.mobile = '';
    state.userId = null;
    state.customerId = null;
    state.user = null;
    state.customer = null;
    elements.accountShell.hidden = true;
    elements.authShell.hidden = false;
    elements.skipLink.href = '#authTitle';
    elements.skipLink.textContent = 'Skip to sign in';
    closeDialog();
    updateAuthReturnNotice();
    showMobileStep();
    if (message && !alreadyShowingAuth) showToast(message, 'error');
  }

  function displayName() {
    return String(firstValue(
      state.user?.name,
      state.user?.full_name,
      state.customer?.name,
      state.customer?.customer_name,
      'Atulyash family'
    ));
  }

  function updateIdentityUI() {
    const name = displayName();
    const initial = name.trim().charAt(0).toUpperCase() || 'A';
    elements.headerName.textContent = name;
    elements.sidebarName.textContent = name;
    elements.headerAvatar.textContent = initial;
    elements.profileAvatar.textContent = initial;
    elements.sidebarMobile.textContent = state.mobile ? `+91 ${state.mobile}` : 'Verified Atulyash member';
    elements.profileName.value = name === 'Atulyash family' ? '' : name;
    elements.profileEmail.value = String(firstValue(state.user?.email, state.customer?.email, ''));
    elements.profileMobile.value = state.mobile ? `+91 ${state.mobile}` : '';
  }

  function updateUnreadUI(count) {
    state.unreadCount = Math.max(0, numberFrom(count));
    [elements.notificationBadge, elements.navNotificationBadge].filter(Boolean).forEach((badge) => {
      badge.textContent = state.unreadCount > 99 ? '99+' : String(state.unreadCount);
      badge.hidden = state.unreadCount < 1;
    });
    elements.notificationShortcut.setAttribute(
      'aria-label',
      state.unreadCount ? `Open notifications, ${state.unreadCount} unread` : 'Open notifications'
    );
  }

  async function loadProfile(force = false) {
    if (!force && state.loaded.has('profile')) return;
    const tasks = [];
    if (state.userId) {
      tasks.push(apiCall('profile', ['getUser', 'getUserData'], {
        id: state.userId,
        userId: state.userId
      }, {
        path: ({ id, userId }) => (id || userId) ? `/users/users/${id || userId}/` : null,
        method: 'GET'
      }).then((result) => {
        const data = responseData(result);
        state.user = data;
        captureIdentity({ user: data }, state.mobile);
      }));
    }
    if (state.customerId) {
      tasks.push(apiCall('profile', ['getCustomer', 'getCustomerData'], {
        id: state.customerId,
        customerId: state.customerId
      }, {
        path: ({ id, customerId }) => (id || customerId) ? `/customers/customers/${id || customerId}/` : null,
        method: 'GET'
      }).then((result) => {
        const data = responseData(result);
        state.customer = data;
        captureIdentity({ customer: data }, state.mobile);
      }));
    }
    if (!tasks.length) {
      updateIdentityUI();
      return;
    }
    const results = await Promise.allSettled(tasks);
    const unauthorized = results.find((result) => result.status === 'rejected' && isUnauthorized(result.reason));
    if (unauthorized) throw unauthorized.reason;
    state.loaded.add('profile');
    updateIdentityUI();
  }

  async function loadUnread(force = false) {
    if (!force && state.loaded.has('unread')) return state.unreadCount;
    const result = await apiCall('notifications', ['unreadCount', 'fetchUnreadCount'], undefined, {
      path: '/notifications/unread-count/',
      method: 'GET'
    });
    const data = responseData(result);
    updateUnreadUI(firstValue(data.unread_count, data.count, data.total, data));
    state.loaded.add('unread');
    return state.unreadCount;
  }

  async function getOrders({ page = 1, oneTime = '', force = false } = {}) {
    if (!force && page === 1 && state.loaded.has(`orders:${oneTime}`)) return state.orders;
    const query = {
      page_size: 15,
      page,
      // Order history is an audit trail, so include cancelled/inactive orders.
      // `null` overrides api-client's active-only default and is omitted from
      // the query string, allowing the API to return the customer's full
      // history while the shop/catalogue requests remain active-only.
      is_active: null,
      customer__id: state.customerId,
      pending_order: false
    };
    if (oneTime !== '') query.one_time = oneTime;
    const result = await apiCall('orders', ['list', 'getMyOrders'], query, {
      path: '/orders/order/',
      method: 'GET',
      query
    });
    const orders = responseList(result);
    state.orders = page === 1 ? orders : state.orders.concat(orders);
    state.orderPage = page;
    state.ordersHaveMore = nextPageExists(result, orders.length);
    state.loaded.add(`orders:${oneTime}`);
    return state.orders;
  }

  function orderId(order) {
    return firstValue(order.id, order.order_id, order.pk, order.uuid);
  }

  function deliveryId(delivery) {
    return firstValue(delivery?.id, delivery?.delivery_id, delivery?.pk, delivery?.uuid);
  }

  function deliveryNumber(delivery) {
    return String(firstValue(
      delivery?.delivery_number,
      delivery?.number,
      delivery?.reference,
      deliveryId(delivery) ? `DEL-${deliveryId(delivery)}` : 'Delivery'
    ));
  }

  function deliveryStatus(delivery) {
    const status = firstValue(
      delivery?.delivery_status,
      delivery?.status_display,
      delivery?.status,
      'Pending'
    );
    return typeof status === 'object'
      ? String(firstValue(status.name, status.label, status.status, 'Pending'))
      : String(status);
  }

  function deliveryDate(delivery) {
    return firstValue(
      delivery?.delivery_date,
      delivery?.scheduled_for,
      delivery?.order_delivery_date,
      delivery?.expected_delivery_date
    );
  }

  function deliveryHistoryFor(delivery) {
    const candidates = [
      delivery?.history,
      delivery?.delivery_history,
      delivery?.tracking_events,
      delivery?.events,
      delivery?.data?.history,
      delivery?.data?.tracking_events
    ];
    return candidates.find((candidate) => Array.isArray(candidate)) || [];
  }

  function orderNumber(order) {
    return String(firstValue(order.order_number, order.number, order.order_no, order.reference, order.display_id, `#${orderId(order) || '—'}`));
  }

  function orderStatus(order) {
    const status = firstValue(order.order_status, order.status_display, order.status, order.delivery_status, 'Processing');
    return typeof status === 'object' ? String(firstValue(status.name, status.label, status.status, 'Processing')) : String(status);
  }

  function orderIsCancelled(order) {
    return /cancel|canceled|cancelled|failed|refund/i.test(orderStatus(order));
  }

  function orderItems(order) {
    const candidates = firstValue(order.order_items, order.items, order.cart_items, order.products, order.line_items, []);
    return Array.isArray(candidates) ? candidates : responseList(candidates);
  }

  function quantityKg(...values) {
    for (const value of values) {
      const direct = firstFinite(value);
      if (direct !== null && direct > 0) return direct;
      const labelled = weightFromLabel(value);
      if (labelled !== null && labelled > 0) return labelled;
    }
    return null;
  }

  function quantityCycleFrom(...values) {
    const candidate = values.find((value) => Array.isArray(value) && value.length);
    if (!candidate) return [];
    return candidate
      .map((value) => quantityKg(value))
      .filter((value) => value !== null);
  }

  function orderQuantityText(order) {
    const items = orderItems(order);
    const weekly = orderCadence(order) === 'Weekly freshness';
    if (weekly) {
      const deliveries = Array.isArray(order.deliveries) ? order.deliveries : [];
      const nextDelivery = deliveries.find((delivery) => delivery?.is_active !== false) || deliveries[0];
      const nextQuantity = quantityKg(
        order.delivery_quantity,
        order.next_delivery_quantity,
        nextDelivery?.delivery_quantity,
        nextDelivery?.quantity_kg,
        ...items.map((item) => item.delivery_quantity)
      );
      if (nextQuantity !== null) return `${bagWeightLabel(nextQuantity)} kg for the next delivery`;

      const cycle = quantityCycleFrom(
        order.weekly_quantity_cycle,
        order.delivery_quantity_cycle,
        order.subscription_pack_weekly_quantity_cycle,
        ...items.map((item) => item.subscription_pack_weekly_quantity_cycle || item.weekly_quantity_cycle)
      );
      if (cycle.length === 4) {
        if (cycle.every((value) => value === cycle[0])) return `${bagWeightLabel(cycle[0])} kg per delivery`;
        return `${cycle.map((value) => `${bagWeightLabel(value)} kg`).join(' · ')} across 4 deliveries`;
      }

      const weeklyQuantity = quantityKg(
        order.weekly_quantity,
        order.weekly_kg,
        order.quantity_per_week,
        order.subscription_pack_weekly_quantity,
        ...items.map((item) => item.weekly_quantity),
        ...items.map((item) => item.subscription_pack_weekly_quantity)
      );
      if (weeklyQuantity !== null) return `${bagWeightLabel(weeklyQuantity)} kg per delivery`;

      const monthlyQuantity = quantityKg(
        order.monthly_quantity,
        order.monthly_kg,
        order.subscription_pack_monthly_quantity,
        ...items.map((item) => item.monthly_quantity),
        ...items.map((item) => item.subscription_pack_monthly_quantity)
      );
      if (monthlyQuantity !== null) return `${bagWeightLabel(monthlyQuantity)} kg across 4 deliveries`;
      if (orderIsCancelled(order)) return '';
      return 'Quantity available in order details';
    }

    const lineQuantities = items.map((item) => {
      const product = [item.product_detail, item.product_pack, item.pack, item.product]
        .find((candidate) => candidate && typeof candidate === 'object') || {};
      const quantity = Math.max(1, Math.round(firstFinite(item.quantity, item.qty, item.count) || 1));
      const weight = quantityKg(
        item.weight,
        item.weight_kg,
        item.pack_size,
        item.quantity_kg,
        item.product_pack_weight,
        item.product_pack_name,
        product.weight,
        product.weight_kg,
        product.pack_size,
        product.name,
        product.title
      );
      return { quantity, weight };
    });
    const knownLines = lineQuantities.filter((line) => line.weight !== null);
    if (knownLines.length === 1 && lineQuantities.length === 1) {
      const line = knownLines[0];
      return `${line.quantity} × ${bagWeightLabel(line.weight)} kg`;
    }
    if (knownLines.length) {
      return knownLines
        .map((line) => `${line.quantity} × ${bagWeightLabel(line.weight)} kg`)
        .join(' · ');
    }

    const totalQuantity = firstFinite(order.quantity, order.qty, order.total_quantity_count, order.item_count);
    const totalWeight = quantityKg(order.total_weight, order.total_quantity, order.weight, order.weight_kg);
    if (totalQuantity !== null && totalWeight !== null) {
      return `${Math.max(1, Math.round(totalQuantity))} × ${bagWeightLabel(totalWeight / Math.max(1, Math.round(totalQuantity)))} kg`;
    }
    if (totalQuantity !== null) return `${Math.max(1, Math.round(totalQuantity))} ${totalQuantity === 1 ? 'pack' : 'packs'}`;
    if (totalWeight !== null) return `${bagWeightLabel(totalWeight)} kg total`;
    if (orderIsCancelled(order)) return '';
    return 'Quantity available in order details';
  }

  function deliveryQuantityText(delivery, order, index = 0) {
    const parentOrder = order || {};
    const directQuantity = quantityKg(
      delivery?.delivery_quantity,
      delivery?.delivery_quantity_kg,
      delivery?.quantity_kg,
      delivery?.data?.delivery_quantity,
      delivery?.data?.delivery_quantity_kg
    );
    if (directQuantity !== null) return `${bagWeightLabel(directQuantity)} kg`;

    const deliveryItems = orderItems(delivery);
    const itemQuantities = deliveryItems
      .map((item) => quantityKg(
        item?.delivery_quantity,
        item?.delivery_quantity_kg,
        item?.quantity_kg
      ))
      .filter((value) => value !== null);
    if (itemQuantities.length) {
      const unique = [...new Set(itemQuantities.map((value) => String(value)))];
      return unique.length === 1
        ? `${bagWeightLabel(itemQuantities[0])} kg`
        : itemQuantities.map((value) => `${bagWeightLabel(value)} kg`).join(' · ');
    }

    const cycle = quantityCycleFrom(
      delivery?.weekly_quantity_cycle,
      delivery?.delivery_quantity_cycle,
      delivery?.subscription_pack_weekly_quantity_cycle,
      ...deliveryItems.map((item) => item?.subscription_pack_weekly_quantity_cycle || item?.weekly_quantity_cycle),
      order?.weekly_quantity_cycle,
      order?.delivery_quantity_cycle,
      order?.subscription_pack_weekly_quantity_cycle,
      ...orderItems(parentOrder).map((item) => item?.subscription_pack_weekly_quantity_cycle || item?.weekly_quantity_cycle)
    );
    if (cycle.length === 4) {
      const weekNumber = firstFinite(delivery?.week_number, delivery?.week, index + 1);
      const cycleQuantity = cycle[Math.max(0, Math.min(cycle.length - 1, Math.round(weekNumber || 1) - 1))];
      if (cycleQuantity !== undefined) return `${bagWeightLabel(cycleQuantity)} kg`;
    }

    if (orderIsCancelled(parentOrder) || /cancel|canceled|cancelled|failed|refund/i.test(deliveryStatus(delivery))) return '';

    const items = orderItems(parentOrder);
    if (items.length || order) {
      const fallback = orderQuantityText(parentOrder);
      if (fallback && !/available in order details/i.test(fallback)) {
        return fallback
          .replace(/ for the next delivery$/i, '')
          .replace(/ per delivery$/i, '')
          .replace(/ across 4 deliveries$/i, '');
      }
    }
    return 'Quantity to be confirmed';
  }

  function orderTitle(order) {
    const items = orderItems(order);
    const item = items[0] || {};
    const product = [item.product_detail, item.product_pack, item.subscription_pack, item.pack, item.product]
      .find((candidate) => candidate && typeof candidate === 'object') || {};
    const productName = firstValue(
      item.product_name,
      item.name,
      item.title,
      product.product_name,
      product.name,
      product.title,
      order.product_name,
      order.title,
      'Atulyash Whole Wheat Atta'
    );
    const weight = firstValue(
      item.weight,
      item.weight_kg,
      item.pack_size,
      item.weekly_quantity,
      product.weight,
      product.weight_kg,
      product.pack_size,
      product.weekly_quantity
    );
    const weightText = String(weight || '').trim();
    return weightText
      ? `${productName} · ${weightText}${/kg/i.test(weightText) ? '' : ' kg'}`
      : String(productName);
  }

  function orderCadence(order) {
    const subscription = [order.subscription, order.subscription_plan].find((value) => {
      if (!value) return false;
      if (typeof value !== 'object') return true;
      return Boolean(firstValue(value.id, value.pk, value.uuid, value.plan_id, value.subscription_id));
    });
    const mode = String(firstValue(
      order.order_type,
      order.order_mode,
      order.type,
      order.kind,
      ''
    ));
    const recurring = Boolean(subscription)
      || order.is_subscription === true
      || order.is_weekly === true
      || /subscription|weekly|freshness/i.test(mode);
    return recurring
      ? 'Weekly freshness'
      : 'One-time order';
  }

  function finiteMoney(...values) {
    for (const value of values) {
      if (value == null || value === '') continue;
      const normalized = typeof value === 'string'
        ? value.replace(/[^0-9.-]/g, '')
        : value;
      const parsed = Number(normalized);
      if (Number.isFinite(parsed)) return parsed;
    }
    return null;
  }

  function modificationPreviewMoney(preview, keys) {
    if (!preview || typeof preview !== 'object') return null;
    const sources = [
      preview,
      preview.totals,
      preview.summary,
      preview.payment_breakdown,
      preview.wallet_impact,
      preview.revised,
      preview.updated,
      preview.current,
      preview.original
    ].filter((source) => source && typeof source === 'object');
    for (const source of sources) {
      const value = finiteMoney(...keys.map((key) => source[key]));
      if (value !== null) return value;
    }
    return null;
  }

  function modificationPreviewAmount(preview, type) {
    const keySets = {
      original: [
        'original_total', 'current_total', 'old_total', 'previous_total', 'existing_total',
        'original_amount', 'current_order_total', 'current_net_payable'
      ],
      revised: [
        'recalculated_total', 'revised_total', 'new_total', 'updated_total', 'final_total',
        'total_amount', 'net_payable', 'order_total', 'amount_payable', 'amount_due'
      ],
      difference: [
        'difference', 'amount_difference', 'total_difference', 'price_difference',
        'payable_difference', 'additional_amount', 'amount_due_difference'
      ],
      delivery: ['delivery_charge', 'delivery_fee', 'delivery_amount'],
      discount: ['discount', 'discount_amount', 'coupon_discount']
    };
    return modificationPreviewMoney(preview, keySets[type] || []);
  }

  function orderAmount(order) {
    const amountKeys = [
      'net_payable', 'net_order_amount', 'wallet_debit', 'net_amount', 'final_amount', 'total_amount', 'grand_total', 'order_total',
      'total_price', 'payable_amount', 'amount_payable', 'subtotal', 'total', 'amount'
    ];
    const sources = [
      order,
      order.payment_summary,
      order.payment_breakdown,
      order.summary,
      order.totals,
      order.cart,
      order.subscription,
      order.subscription_plan
    ].filter((source) => source && typeof source === 'object');
    for (const source of sources) {
      const direct = finiteMoney(...amountKeys.map((key) => source[key]));
      if (direct !== null) return direct;
    }

    const lineAmounts = orderItems(order).map((item) => {
      const direct = finiteMoney(
        item.line_total,
        item.total_price,
        item.total_amount,
        item.subtotal,
        item.amount
      );
      if (direct !== null) return direct;
      const pack = [item.product_pack, item.subscription_pack, item.pack, item.product]
        .find((candidate) => candidate && typeof candidate === 'object') || {};
      const unitPrice = finiteMoney(item.unit_price, item.price, item.selling_price, pack.price, pack.selling_price);
      if (unitPrice === null) return null;
      return unitPrice * Math.max(1, finiteMoney(item.quantity) ?? 1);
    }).filter((value) => value !== null);
    return lineAmounts.length ? lineAmounts.reduce((sum, value) => sum + value, 0) : null;
  }

  function orderPaymentValue(order, ...keys) {
    const sources = [
      order?.payment_breakdown,
      order?.payment_summary,
      order?.summary,
      order?.totals,
      order
    ].filter((source) => source && typeof source === 'object');
    for (const source of sources) {
      const value = finiteMoney(...keys.map((key) => source[key]));
      if (value !== null) return value;
    }
    return null;
  }

  function orderAmountText(order) {
    const amount = orderAmount(order);
    return amount === null ? 'See details' : formatMoney(amount);
  }

  function orderDate(order) {
    return firstValue(order.created_at, order.placed_at, order.order_date, order.created, order.delivery_date);
  }

  function orderDeliveryDate(order) {
    const direct = firstValue(
      order.next_delivery_date,
      order.order_delivery_date,
      order.requested_delivery_date,
      order.delivery_date,
      order.expected_delivery_date,
      order.delivery?.delivery_date
    );
    if (direct) return direct;
    const deliveries = Array.isArray(order.deliveries) ? order.deliveries : [];
    const nextDelivery = deliveries.find((delivery) => delivery?.is_active !== false) || deliveries[0];
    return deliveryDate(nextDelivery);
  }

  function isCompleted(order) {
    return /deliver|complete|fulfilled/i.test(orderStatus(order));
  }

  function orderHasSuccessfulPayment(order) {
    const paymentSources = [
      order?.payment,
      order?.payment_detail,
      order?.payment_details,
      order?.payment_summary,
      order
    ].filter((source) => source && typeof source === 'object');
    const successfulStatus = /paid|success|captured|received|complete/i.test(orderStatus(order))
      || paymentSources.some((source) => /paid|success|captured|received|complete/i.test(String(firstValue(
      source.payment_status,
      source.status_display,
      source.status,
      ''
    ))));
    const walletDebit = finiteMoney(...paymentSources.map((source) => source.wallet_debit));
    return successfulStatus || (walletDebit !== null && walletDebit > 0);
  }

  function canModifyOneTimeOrder(order) {
    const status = orderStatus(order).toLowerCase();
    const subscription = firstValue(
      order.subscription,
      order.subscription_plan,
      order.subscription_id,
      order.is_subscription === true ? 'subscription' : ''
    );
    return !subscription
      && !orderHasSuccessfulPayment(order)
      && !/deliver|complete|fulfilled|cancel|fail|refund|paid|payment|received|success|captur/.test(status);
  }

  function statusPill(status) {
    const normalized = String(status).toLowerCase();
    const pill = create('span', 'status-pill', status);
    if (/deliver|complete|fulfilled|paid|received|success|captur/.test(normalized)) pill.classList.add('is-complete');
    if (/cancel|failed|refund/.test(normalized)) pill.classList.add('is-cancelled');
    if (/paused|not available|cannot deliver|attention|delay|exception/.test(normalized)) pill.classList.add('is-attention');
    return pill;
  }

  function makeOrderCard(order, { compact = false } = {}) {
    const card = create('article', 'order-card');
    const normalizedStatus = orderStatus(order).toLowerCase();
    if (/cancel|failed|refund/.test(normalizedStatus)) card.classList.add('is-cancelled');
    else if (/deliver|complete|fulfilled|paid|received|success|captur/.test(normalizedStatus)) card.classList.add('is-complete');
    else if (/paused|not available|cannot deliver|attention|delay|exception/.test(normalizedStatus)) card.classList.add('is-attention');
    const imageBox = create('div', 'order-product-image');
    const image = create('img');
    image.src = 'images/sack5g.webp';
    image.alt = '';
    image.width = 490;
    image.height = 512;
    imageBox.append(image);

    const title = create('div', 'order-title');
    title.append(
      create('span', 'order-cadence', orderCadence(order)),
      create('h3', '', orderTitle(order)),
      create('p', '', `Order ${orderNumber(order)}`)
    );
    const quantityText = orderQuantityText(order);
    if (quantityText) title.append(create('p', 'order-quantity', `Delivering: ${quantityText}`));

    const meta = create('div', 'order-meta');
    const deliveryDateValue = orderDeliveryDate(order);
    const delivery = create('div', 'order-delivery-highlight');
    delivery.append(
      create('strong', '', deliveryDateValue ? formatDate(deliveryDateValue) : 'Not scheduled'),
      create('span', '', 'Delivery date')
    );
    const placed = create('div', 'order-placed-date');
    placed.append(create('strong', '', formatDate(orderDate(order))), create('span', '', 'Order placed'));
    meta.append(delivery, placed);

    const status = create('div', 'order-status');
    status.append(statusPill(orderStatus(order)));

    const total = create('div', 'order-total');
    if (orderAmount(order) === null) total.classList.add('is-unavailable');
    total.append(
      create('strong', '', orderAmountText(order)),
      create('span', '', orderAmount(order) === null ? 'Total not supplied in list' : 'Order total')
    );

    const actions = create('div', 'card-actions');
    actions.append(button('Track order', 'card-action', () => openOrderDetail(order)));
    if (!compact) {
      if (canModifyOneTimeOrder(order)) actions.append(button('Modify delivery', 'card-action', () => openOneTimeOrderModification(order)));
      actions.append(button('Order again', 'card-action', () => confirmReorder(order)));
      if (isCompleted(order)) actions.append(button('Review', 'card-action is-rust', () => openReview(order)));
    }
    card.append(imageBox, title, meta, status, total, actions);
    return card;
  }

  async function renderOrders({ page = 1, force = false } = {}) {
    if (page === 1) renderLoading(elements.ordersList, 'Finding your fresh-batch history…');
    try {
      const orders = await getOrders({
        page,
        oneTime: elements.orderFilter.value,
        force
      });
      if (!orders.length) {
        renderEmpty(
          elements.ordersList,
          'Your first batch is waiting.',
          'Once you place an order, every detail will appear here.',
          Object.assign(create('a', 'primary-button', 'Choose your first batch →'), { href: 'index.html#shop' })
        );
      } else {
        const fragment = document.createDocumentFragment();
        orders.forEach((order) => fragment.append(makeOrderCard(order)));
        elements.ordersList.replaceChildren(fragment);
      }
      elements.ordersLoadMore.hidden = !state.ordersHaveMore;
    } catch (error) {
      if (isUnauthorized(error)) return enterAuth('Your session has ended. Please sign in again.');
      renderError(elements.ordersList, error, () => renderOrders({ force: true }));
      elements.ordersLoadMore.hidden = true;
    }
  }

  function orderInvoiceUrl(order) {
    return safeUrl(firstValue(
      order.invoice_url,
      order.invoice_pdf_url,
      order.tax_invoice_url,
      order.invoice?.url,
      order.invoice?.pdf_url
    ));
  }

  async function loadOrdersForStatement() {
    const allOrders = [];
    for (let page = 1; page <= 10; page += 1) {
      const query = {
        page_size: 100,
        page,
        // Statements should match the order-history view and retain cancelled
        // subscriptions/orders instead of silently dropping them.
        is_active: null,
        customer__id: state.customerId,
        pending_order: false
      };
      const result = await apiCall('orders', ['list', 'getMyOrders'], query, {
        path: '/orders/order/',
        method: 'GET',
        query
      });
      const pageOrders = responseList(result);
      allOrders.push(...pageOrders);
      if (!nextPageExists(result, pageOrders.length, 100)) break;
    }
    return allOrders;
  }

  async function openCustomerStatement() {
    openDialog('Orders & payments', 'Customer statement', makeState('loading', 'Preparing your statement.', 'Bringing your completed and upcoming orders into one view…'));
    try {
      const orders = await loadOrdersForStatement();
      if (!orders.length) {
        elements.dialogBody.replaceChildren(makeState('empty', 'No transactions yet.', 'Your invoices and order payments will appear here after your first order.'));
        return;
      }
      const knownAmounts = orders.map(orderAmount).filter((amount) => amount !== null);
      const body = create('div', 'customer-statement');
      const introduction = create('p', 'dialog-copy', 'This statement gathers your Atulyash orders and recorded payments in one window. Open an individual order for its printable receipt or official invoice when supplied by the service.');
      const overview = create('div', 'statement-overview');
      const orderCount = create('div');
      orderCount.append(create('span', '', 'Orders shown'), create('strong', '', String(orders.length)));
      const value = create('div');
      value.append(create('span', '', 'Recorded order value'), create('strong', '', knownAmounts.length ? formatMoney(knownAmounts.reduce((sum, amount) => sum + amount, 0)) : 'Not supplied'));
      overview.append(orderCount, value);

      const list = create('div', 'statement-list');
      orders.forEach((order) => {
        const row = create('article', 'statement-row');
        const reference = create('div');
        reference.append(create('strong', '', orderNumber(order)), create('small', '', orderTitle(order)));
        const timing = create('div');
        timing.append(create('span', '', formatDate(orderDate(order))), create('small', '', orderStatus(order)));
        const amount = create('strong', 'statement-amount', orderAmountText(order));
        const actions = create('div', 'statement-actions');
        actions.append(button('Receipt', 'card-action', () => openOrderDetail(order)));
        const invoiceUrl = orderInvoiceUrl(order);
        if (invoiceUrl) {
          const invoice = create('a', 'card-action', 'Invoice');
          invoice.href = invoiceUrl;
          invoice.target = '_blank';
          invoice.rel = 'noopener noreferrer';
          actions.append(invoice);
        }
        row.append(reference, timing, amount, actions);
        list.append(row);
      });

      const actions = create('div', 'dialog-actions');
      actions.append(button('Close', 'secondary-button', closeDialog));
      actions.append(button('Print statement', 'primary-button', () => printCustomerStatement(orders)));
      body.append(introduction, overview, list, actions);
      elements.dialogBody.replaceChildren(body);
    } catch (error) {
      elements.dialogBody.replaceChildren(makeState('error', 'The statement is unavailable.', friendlyError(error), openCustomerStatement));
    }
  }

  function printCustomerStatement(orders) {
    const popup = window.open('', '_blank', 'width=900,height=980');
    if (!popup) {
      showToast('Please allow pop-ups to print this statement.', 'error');
      return;
    }
    popup.opener = null;
    const documentRef = popup.document;
    documentRef.write('<!doctype html><html><head><title>Atulyash customer statement</title><style>body{margin:0;padding:42px;color:#092f27;font:15px Arial,sans-serif}h1{font:500 42px Georgia,serif;margin:8px 0 8px}.eyebrow{color:#b95636;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}.muted{margin:0 0 28px;color:#64716d}.row{display:grid;grid-template-columns:1.3fr .8fr .55fr;gap:18px;padding:15px 0;border-bottom:1px solid #d9d7cc}.row span,.row small{display:block;color:#64716d}.row strong:last-child{text-align:right}footer{margin-top:34px;color:#64716d;font-size:13px}@media print{body{padding:18px}}</style></head><body></body></html>');
    const root = documentRef.body;
    const eyebrow = documentRef.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = 'Atulyash · orders & payments';
    const heading = documentRef.createElement('h1');
    heading.textContent = 'Customer statement';
    const subline = documentRef.createElement('p');
    subline.className = 'muted';
    subline.textContent = `${displayName()} · ${orders.length} recorded ${orders.length === 1 ? 'order' : 'orders'}`;
    root.append(eyebrow, heading, subline);
    orders.forEach((order) => {
      const row = documentRef.createElement('div');
      row.className = 'row';
      const reference = documentRef.createElement('div');
      const number = documentRef.createElement('strong');
      number.textContent = orderNumber(order);
      const item = documentRef.createElement('small');
      item.textContent = orderTitle(order);
      reference.append(number, item);
      const timing = documentRef.createElement('div');
      const date = documentRef.createElement('span');
      date.textContent = formatDate(orderDate(order));
      const status = documentRef.createElement('small');
      status.textContent = orderStatus(order);
      timing.append(date, status);
      const amount = documentRef.createElement('strong');
      amount.textContent = orderAmountText(order);
      row.append(reference, timing, amount);
      root.append(row);
    });
    const footer = documentRef.createElement('footer');
    footer.textContent = 'This is an order statement. Official tax invoices are provided when available from Atulyash. For help, email info@atulyash.com.';
    root.append(footer);
    popup.focus();
    popup.print();
  }

  const ORDER_JOURNEY_STEPS = [
    { key: 'placed', label: 'Order placed', description: 'Your Atulyash order has been confirmed.' },
    { key: 'scheduled', label: 'Fresh batch scheduled', description: 'Your fresh batch is queued for its confirmed delivery.' },
    { key: 'preparing', label: 'Preparing your atta', description: 'Your fresh batch is being prepared with care.' },
    { key: 'packed', label: 'Packed with care', description: 'Your Atulyash packet is ready for dispatch.' },
    { key: 'assigned', label: 'Rider assigned', description: 'A delivery partner has been assigned to your batch.' },
    { key: 'out', label: 'Out for delivery', description: 'Your delivery partner is bringing your fresh batch home.' },
    { key: 'delivered', label: 'Delivered', description: 'Your order has reached its delivery home.' }
  ];

  function journeyCatalogStep(key) {
    return ORDER_JOURNEY_STEPS.find((step) => step.key === key) || null;
  }

  function journeyKey(value) {
    const normalized = String(value || '').toLowerCase().replaceAll('_', ' ');
    if (/cancel|fail|refund|reject/.test(normalized)) return 'cancelled';
    if (/delivered|delivery complete|fulfilled|received by (customer|you|recipient)/.test(normalized)) return 'delivered';
    if (/out\s*for|on\s*the\s*way|transit|dispatched/.test(normalized)) return 'out';
    if (/rider|driver|assigned|delivery partner/.test(normalized)) return 'assigned';
    if (/pack|ready|shipped/.test(normalized)) return 'packed';
    if (/prepar|mill|process/.test(normalized)) return 'preparing';
    if (/schedul|fresh batch|queued/.test(normalized)) return 'scheduled';
    if (/place|created|confirm|pending|new|accept|paid/.test(normalized)) return 'placed';
    return '';
  }

  function trackingEventsForOrder(order) {
    const candidates = [
      order?.tracking_events,
      order?.status_history,
      order?.tracking_history,
      order?.delivery_history,
      order?.deliveryHistory,
      order?.journey,
      order?.timeline,
      order?.tracking?.events,
      order?.tracking?.history,
      order?.data?.tracking_events,
      order?.data?.status_history
    ];
    const direct = candidates.find((candidate) => Array.isArray(candidate));
    if (direct) return direct;
    if (Array.isArray(order?.deliveries)) {
      return order.deliveries.flatMap((delivery) => deliveryHistoryFor(delivery));
    }
    return [];
  }

  function normalizeJourneyEvent(event) {
    const rawStatus = typeof event === 'string'
      ? event
      : firstValue(
        event?.key,
        event?.code,
        event?.status,
        event?.new_status,
        event?.order_status,
        event?.delivery_status,
        event?.event_type_display,
        event?.event_type,
        event?.name,
        event?.label
      );
    const key = journeyKey(rawStatus);
    const catalog = journeyCatalogStep(key);
    const customLabel = typeof event === 'object'
      ? firstValue(event.event_type_display, event.label, event.title, event.display_name)
      : null;
    const timestamp = typeof event === 'object'
      ? firstValue(event.timestamp, event.occurred_at, event.created_at, event.updated_at, event.completed_at, event.date)
      : null;
    return {
      key: key || 'current',
      label: customLabel || catalog?.label || `Current status: ${String(rawStatus || 'Processing')}`,
      description: typeof event === 'object'
        ? firstValue(event.description, event.message, event.detail, event.notes) || catalog?.description || 'Atulyash has the latest update for this order.'
        : catalog?.description || 'Atulyash has the latest update for this order.',
      timestamp,
      isCurrent: typeof event === 'object' && (event.is_current === true || event.current === true)
    };
  }

  function orderJourneyModel(order) {
    const status = orderStatus(order);
    const statusKey = journeyKey(status);
    const cancelled = statusKey === 'cancelled';
    const attention = !cancelled && Boolean(
      order?.delayed
      || order?.needs_attention
      || order?.attention_required
      || /delay|attention|address issue|exception|paused|customer not available|cannot deliver/.test(status.toLowerCase())
    );
    const events = trackingEventsForOrder(order)
      .map(normalizeJourneyEvent)
      .filter((event) => event.label)
      .sort((a, b) => {
        const aTime = dateValue(a.timestamp)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const bTime = dateValue(b.timestamp)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      });
    const uniqueEvents = [];
    const eventKeys = new Set();
    events.forEach((event) => {
      const timestamp = event.timestamp ? String(event.timestamp) : '';
      const signature = `${event.key}|${event.label}|${timestamp}`;
      if (event.key === 'placed' && uniqueEvents.some((existing) => existing.key === 'placed')) return;
      if (eventKeys.has(signature)) return;
      eventKeys.add(signature);
      uniqueEvents.push(event);
    });
    events.splice(0, events.length, ...uniqueEvents);
    let steps = events;
    let detailed = events.length > 0;

    if (detailed && !steps.some((step) => step.isCurrent)) {
      steps[steps.length - 1].isCurrent = true;
    }

    if (detailed && !steps.some((step) => step.key === 'placed')) {
      steps = [
        { ...journeyCatalogStep('placed'), timestamp: orderDate(order), isCurrent: false },
        ...steps
      ];
    }
    if (detailed && cancelled && !steps.some((step) => step.key === 'cancelled')) {
      steps.push({ key: 'cancelled', label: 'Order cancelled', description: `The order status is ${status}.`, timestamp: null, isCurrent: true });
    }
    if (!detailed) {
      const known = journeyCatalogStep(statusKey);
      steps = [{ ...journeyCatalogStep('placed'), timestamp: orderDate(order), isCurrent: statusKey === 'placed' }];
      if (cancelled) {
        steps.push({ key: 'cancelled', label: 'Order cancelled', description: `The order status is ${status}.`, timestamp: null, isCurrent: true });
      } else if (statusKey && statusKey !== 'placed') {
        steps.push({ ...(known || {}), key: known?.key || 'current', label: known?.label || `Current status: ${status}`, description: known?.description || `The latest status from Atulyash is ${status}.`, timestamp: null, isCurrent: true });
      } else if (!statusKey && status.toLowerCase() !== 'processing') {
        steps.push({ key: 'current', label: `Current status: ${status}`, description: `The latest status from Atulyash is ${status}.`, timestamp: null, isCurrent: true });
      }
    }

    let current = steps.findIndex((step) => step.isCurrent);
    if (current < 0 && statusKey) current = steps.map((step) => step.key).lastIndexOf(statusKey);
    if (current < 0) current = Math.max(0, steps.length - 1);
    return { steps, current, cancelled, attention, detailed, status };
  }

  function orderJourneyDate(order) {
    return firstValue(
      order.requested_delivery_date,
      order.order_delivery_date,
      order.delivery_date,
      order.expected_delivery_date
    );
  }

  function orderJourneyProductImage(order) {
    const image = firstValue(
      order.product_image,
      order.image,
      order.product?.image,
      order.product_detail?.image,
      order.product_pack?.image,
      order.items?.[0]?.image,
      order.order_items?.[0]?.image
    );
    return safeUrl(image) || 'images/atta-packet-2026.webp';
  }

  function renderOrderJourney(order, refresh) {
    const progress = orderJourneyModel(order);
    const wrapper = create('section', 'order-journey', 'Order journey');
    wrapper.setAttribute('aria-live', 'polite');
    wrapper.setAttribute('aria-atomic', 'false');
    wrapper.dataset.current = progress.steps[progress.current]?.key || 'current';
    const head = create('div', 'order-journey-head');
    const copy = create('div');
    copy.append(
      create('p', 'section-label', 'Every batch, remembered'),
      create('h3', '', progress.cancelled || progress.attention ? 'This order needs attention.' : 'Your fresh batch journey')
    );
    const status = statusPill(progress.cancelled ? `Order ${orderStatus(order)}` : orderStatus(order));
    status.classList.add('order-journey-status');
    head.append(copy, status);
    wrapper.append(head);

    const product = create('div', 'order-journey-product');
    const productImage = create('img');
    productImage.src = orderJourneyProductImage(order);
    productImage.alt = '';
    productImage.width = 160;
    productImage.height = 220;
    const productCopy = create('div');
    productCopy.append(
      create('strong', '', orderTitle(order)),
      create('span', '', `${orderNumber(order)} · ${orderAmountText(order)}`)
    );
    const delivery = orderJourneyDate(order);
    if (delivery) productCopy.append(create('small', '', `Expected delivery · ${formatDate(delivery)}`));
    product.append(productImage, productCopy);
    wrapper.append(product);

    const timeline = create('ol', 'order-journey-timeline');
    timeline.dataset.detailed = String(progress.detailed);
    timeline.style.setProperty('--journey-progress', `${progress.steps.length > 1 ? (progress.current / (progress.steps.length - 1)) * 100 : 0}%`);
    progress.steps.forEach((step, index) => {
      const item = create('li', 'order-journey-step');
      const complete = !progress.cancelled && index < progress.current;
      const current = !progress.cancelled && index === progress.current;
      const cancelled = progress.cancelled && step.key === 'cancelled';
      const attention = progress.attention && current;
      const stepState = cancelled ? 'cancelled' : attention ? 'attention' : complete ? 'complete' : current ? 'current' : 'upcoming';
      item.dataset.state = stepState;
      item.dataset.key = step.key;
      const marker = create('span', 'order-journey-marker', cancelled ? '!' : complete || step.key === 'delivered' && current ? '✓' : String(index + 1).padStart(2, '0'));
      marker.setAttribute('aria-hidden', 'true');
      const text = create('div', 'order-journey-step-copy');
      const label = create('div', 'order-journey-step-title');
      label.append(create('strong', '', stepState === 'cancelled' ? 'Order cancelled' : step.label));
      if (current) label.append(create('span', 'order-journey-now', 'Current'));
      if (complete) label.append(create('span', 'order-journey-done', 'Complete'));
      text.append(label, create('p', '', stepState === 'cancelled' ? `The order status is ${progress.status}.` : step.description));
      if (step.timestamp) text.append(create('small', '', formatDate(step.timestamp, true)));
      item.append(marker, text);
      timeline.append(item);
    });
    wrapper.append(timeline);

    if (progress.steps[progress.current]?.key === 'delivered') {
      const welcome = create('div', 'order-journey-welcome');
      const veer = create('img');
      veer.src = 'images/veer-mascot-2026.webp';
      veer.alt = 'Veer welcoming your fresh batch home';
      veer.width = 120;
      veer.height = 160;
      welcome.append(veer, create('p', '', 'Veer welcomes this batch home.'));
      wrapper.append(welcome);
    }

    const footer = create('div', 'order-journey-footer');
    const note = create('p', '', progress.cancelled || progress.attention
      ? 'Please contact Atulyash care if you need help with this order.'
      : progress.detailed
        ? 'Status and dates update from the Atulyash service as your batch moves forward.'
        : 'Only the status currently confirmed by Atulyash is shown. More journey events appear as the service updates your order.');
    const refreshButton = button('Refresh status', 'card-action', refresh);
    refreshButton.classList.add('order-journey-refresh');
    footer.append(note, refreshButton);
    wrapper.append(footer);
    return wrapper;
  }

  async function loadOrderTracking(orderIdValue, detail) {
    let listedDeliveries = [];
    let subscriptionOrders = [];
    try {
      const [deliveriesResult, subscriptionResult] = await Promise.allSettled([
        apiCall('orders', ['deliveries', 'listDeliveries', 'getOrderDeliveries'], {
          id: orderIdValue,
          orderId: orderIdValue
        }, {
          path: `/orders/order/${orderIdValue}/deliveries/`,
          method: 'GET'
        }),
        apiCall('orders', ['subscriptionDeliveries', 'subscriptionOrders', 'getSubscriptionDeliveries'], {
          id: orderIdValue,
          orderId: orderIdValue
        }, {
          path: `/orders/order/${orderIdValue}/subscription-orders/`,
          method: 'GET'
        })
      ]);
      const unauthorized = [deliveriesResult, subscriptionResult]
        .find((result) => result.status === 'rejected' && isUnauthorized(result.reason));
      if (unauthorized) throw unauthorized.reason;
      if (deliveriesResult.status === 'fulfilled') listedDeliveries = responseList(deliveriesResult.value);
      if (subscriptionResult.status === 'fulfilled') subscriptionOrders = responseList(subscriptionResult.value);
    } catch (error) {
      if (isUnauthorized(error)) throw error;
    }

    const sourceDeliveries = listedDeliveries.length
      ? listedDeliveries
      : Array.isArray(detail?.deliveries) ? detail.deliveries : [];
    if (!sourceDeliveries.length) return { ...detail, subscription_orders: subscriptionOrders };

    const enrichedResults = await Promise.all(sourceDeliveries.map(async (delivery) => {
      const id = deliveryId(delivery);
      if (!id) return { ...delivery, history: deliveryHistoryFor(delivery) };

      const [detailResult, historyResult] = await Promise.allSettled([
        apiCall('orders', ['deliveryDetail', 'getDeliveryDetails'], { id, deliveryId: id }, {
          path: `/orders/order-delivery/${id}/`,
          method: 'GET'
        }),
        apiCall('orders', ['deliveryHistory', 'getDeliveryHistory'], { id, deliveryId: id }, {
          path: `/orders/order-delivery/${id}/history/`,
          method: 'GET'
        })
      ]);
      const unauthorized = [detailResult, historyResult]
        .find((result) => result.status === 'rejected' && isUnauthorized(result.reason));
      if (unauthorized) throw unauthorized.reason;

      const details = detailResult.status === 'fulfilled'
        ? responseData(detailResult.value)
        : {};
      const history = historyResult.status === 'fulfilled'
        ? responseList(historyResult.value)
        : deliveryHistoryFor(delivery);
      return {
        ...delivery,
        ...(details && typeof details === 'object' ? details : {}),
        history,
        delivery_history: history,
        tracking_events: history
      };
    }));

    const directEvents = [
      detail?.tracking_events,
      detail?.status_history,
      detail?.tracking_history,
      detail?.delivery_history
    ].find((candidate) => Array.isArray(candidate)) || [];
    const historyEvents = enrichedResults.flatMap((delivery) => deliveryHistoryFor(delivery));
    return {
      ...detail,
      deliveries: enrichedResults,
      subscription_orders: subscriptionOrders,
      tracking_events: [...directEvents, ...historyEvents]
    };
  }

  function renderDeliverySchedule(deliveries, order) {
    if (!Array.isArray(deliveries) || !deliveries.length) return null;
    const section = create('section', 'order-deliveries');
    section.append(create('p', 'section-label', 'Fresh-batch deliveries'));
    section.append(create('h4', '', deliveries.length === 1 ? 'Your delivery' : 'Your delivery schedule'));
    const list = create('div', 'order-delivery-list');
    deliveries.forEach((delivery, index) => {
      const card = create('article', 'order-delivery-card');
      const heading = create('div', 'order-delivery-card-head');
      const title = create('div');
      title.append(
        create('strong', '', deliveryNumber(delivery)),
        create('span', '', deliveryDate(delivery) ? formatDate(deliveryDate(delivery)) : `Delivery ${index + 1}`)
      );
      heading.append(title, statusPill(deliveryStatus(delivery)));
      card.append(heading);
      const quantityText = deliveryQuantityText(delivery, order, index);
      if (quantityText) card.append(create('p', 'order-delivery-card-quantity', `Quantity to deliver · ${quantityText}`));
      const meta = [];
      const rider = firstValue(delivery.rider_name, delivery.rider?.name);
      if (rider) meta.push(`Rider · ${rider}`);
      const invoice = firstValue(delivery.invoice_number, delivery.invoice?.number);
      if (invoice) meta.push(`Invoice · ${invoice}`);
      if (meta.length) card.append(create('p', 'order-delivery-card-meta', meta.join(' · ')));
      card.append(button('View delivery details', 'card-action', () => openDeliveryDetail(delivery, order)));
      list.append(card);
    });
    section.append(list);
    return section;
  }

  function renderSubscriptionSchedule(subscriptionOrders, order) {
    if (!Array.isArray(subscriptionOrders) || !subscriptionOrders.length) return null;
    const section = create('section', 'order-deliveries order-subscription-schedule');
    section.append(create('p', 'section-label', 'Weekly plan ledger'));
    section.append(create('h4', '', 'Scheduled weekly orders'));
    const list = create('div', 'order-delivery-list');
    subscriptionOrders.forEach((subscriptionOrder, index) => {
      const card = create('article', 'order-delivery-card');
      const heading = create('div', 'order-delivery-card-head');
      const title = create('div');
      title.append(
        create('strong', '', firstValue(subscriptionOrder.week_label, subscriptionOrder.number, `Week ${index + 1}`)),
        create('span', '', firstValue(subscriptionOrder.order_delivery_date, subscriptionOrder.next_delivery_date)
          ? formatDate(firstValue(subscriptionOrder.order_delivery_date, subscriptionOrder.next_delivery_date))
          : 'Date to be confirmed')
      );
      heading.append(title, statusPill(firstValue(subscriptionOrder.order_status, subscriptionOrder.status, 'Pending')));
      card.append(heading);
      const quantityText = deliveryQuantityText(subscriptionOrder, order, index);
      if (quantityText) card.append(create('p', 'order-delivery-card-quantity', `Quantity to deliver · ${quantityText}`));
      const amount = orderPaymentValue(subscriptionOrder, 'net_payable');
      const parent = firstValue(subscriptionOrder.parent, subscriptionOrder.parent_order_id);
      const meta = [
        parent ? `Parent order · ${parent}` : null,
        amount !== null ? `Per delivery · ${formatMoney(amount)}` : null
      ].filter(Boolean);
      if (meta.length) card.append(create('p', 'order-delivery-card-meta', meta.join(' · ')));
      list.append(card);
    });
    section.append(list);
    return section;
  }

  async function openDeliveryDetail(delivery, order) {
    const id = deliveryId(delivery);
    openDialog('Delivery detail', deliveryNumber(delivery), makeState('loading', 'Loading delivery.', 'Bringing the latest delivery update into view…'));
    try {
      let detail = delivery || {};
      let history = deliveryHistoryFor(detail);
      if (id) {
        const [detailResult, historyResult] = await Promise.allSettled([
          apiCall('orders', ['deliveryDetail', 'getDeliveryDetails'], { id, deliveryId: id }, {
            path: `/orders/order-delivery/${id}/`,
            method: 'GET'
          }),
          apiCall('orders', ['deliveryHistory', 'getDeliveryHistory'], { id, deliveryId: id }, {
            path: `/orders/order-delivery/${id}/history/`,
            method: 'GET'
          })
        ]);
        const unauthorized = [detailResult, historyResult]
          .find((result) => result.status === 'rejected' && isUnauthorized(result.reason));
        if (unauthorized) throw unauthorized.reason;
        if (detailResult.status === 'fulfilled') {
          const payload = responseData(detailResult.value);
          if (payload && typeof payload === 'object') detail = { ...detail, ...payload };
        }
        if (historyResult.status === 'fulfilled') history = responseList(historyResult.value);
      }
      const body = create('div', 'delivery-detail');
      const hero = create('div', 'delivery-detail-hero');
      hero.append(
        create('div', 'delivery-detail-hero-copy', `${deliveryNumber(detail)} · ${deliveryStatus(detail)}`),
        statusPill(deliveryStatus(detail))
      );
      body.append(hero);

      const summary = create('div', 'dialog-summary');
      const summaryRows = [
        ['Delivery date', deliveryDate(detail) ? formatDate(deliveryDate(detail)) : 'Date to be confirmed'],
        ['Placed on', detail.placed_at ? formatDate(detail.placed_at, true) : 'Date to be confirmed']
      ];
      const quantityText = deliveryQuantityText(detail, order);
      if (quantityText) summaryRows.splice(1, 0, ['Quantity to deliver', quantityText]);
      const riderName = firstValue(detail.rider_name, detail.rider?.name);
      if (riderName) summaryRows.push(['Delivery partner', riderName]);
      const riderPhone = firstValue(detail.rider_phone, detail.rider?.phone);
      if (riderPhone) summaryRows.push(['Partner contact', riderPhone]);
      const itemsTotal = orderPaymentValue(detail, 'items_total');
      const deliveryCharge = orderPaymentValue(detail, 'delivery_charge');
      const couponDiscount = orderPaymentValue(detail, 'coupon_discount');
      const netPayable = orderPaymentValue(detail, 'net_payable');
      if (itemsTotal !== null) summaryRows.push(['Items total', formatMoney(itemsTotal)]);
      if (deliveryCharge !== null) summaryRows.push(['Delivery charge', deliveryCharge === 0 ? 'Free' : formatMoney(deliveryCharge)]);
      if (couponDiscount !== null && couponDiscount > 0) summaryRows.push(['Coupon saving', `−${formatMoney(couponDiscount)}`]);
      if (netPayable !== null) summaryRows.push(['Net payable', formatMoney(netPayable)]);
      summaryRows.forEach(([label, value]) => {
        const row = create('div', 'dialog-summary-row');
        row.append(create('span', '', label), create('strong', '', value));
        summary.append(row);
      });
      body.append(summary);

      const address = firstValue(detail.address_of_customer, detail.delivery_address, detail.address, order?.address);
      if (address) {
        body.append(create('p', 'section-label', 'Delivery address'));
        body.append(create('p', 'dialog-copy', addressText(address)));
      }

      const historyPanel = create('section', 'delivery-history');
      historyPanel.append(create('p', 'section-label', 'Delivery history'));
      historyPanel.append(create('h4', '', 'Every update, in order'));
      if (!history.length) {
        historyPanel.append(makeState('empty', 'No event history yet.', 'The service will add delivery updates as this batch moves.'));
      } else {
        const historyList = create('ol', 'delivery-history-list');
        history
          .map(normalizeJourneyEvent)
          .filter((event) => event.label)
          .sort((a, b) => (dateValue(a.timestamp)?.getTime() ?? Number.MAX_SAFE_INTEGER) - (dateValue(b.timestamp)?.getTime() ?? Number.MAX_SAFE_INTEGER))
          .forEach((event, index) => {
            const item = create('li', 'delivery-history-item');
            const marker = create('span', 'delivery-history-marker', String(index + 1).padStart(2, '0'));
            const copy = create('div');
            copy.append(create('strong', '', event.label), create('p', '', event.description));
            if (event.timestamp) copy.append(create('small', '', formatDate(event.timestamp, true)));
            item.append(marker, copy);
            historyList.append(item);
          });
        historyPanel.append(historyList);
      }
      body.append(historyPanel);

      const invoiceNumber = firstValue(detail.invoice_number, detail.invoice?.number);
      if (invoiceNumber || detail.has_invoice) {
        body.append(create('p', 'dialog-note', detail.invoice_downloadable || detail.invoice?.downloadable
          ? `Invoice ${invoiceNumber || ''} is available for download when the service supplies the invoice link.`
          : 'The invoice will appear here once it is generated for this delivery.'));
      }

      const actions = create('div', 'dialog-actions');
      actions.append(button('Back to order journey', 'secondary-button', () => openOrderDetail(order || { id: firstValue(detail.parent, detail.order_id) })));
      const invoiceUrl = orderInvoiceUrl(detail);
      if (invoiceUrl) {
        const invoice = create('a', 'primary-button', 'Download invoice');
        invoice.href = invoiceUrl;
        invoice.target = '_blank';
        invoice.rel = 'noopener noreferrer';
        actions.append(invoice);
      }
      body.append(actions);
      elements.dialogBody.replaceChildren(body);
    } catch (error) {
      elements.dialogBody.replaceChildren(orderJourneyErrorState(error, () => openDeliveryDetail(delivery, order)));
    }
  }

  function orderJourneyErrorState(error, retry) {
    if (isUnauthorized(error)) {
      const panel = makeState('error', 'Your session has expired.', 'Sign in again to securely view this order journey.');
      const signIn = create('a', 'secondary-button', 'Sign in again');
      signIn.href = 'account.html#login';
      signIn.addEventListener('click', () => {
        closeDialog();
        enterAuth('Your session has ended. Please sign in again.');
      });
      panel.querySelector('.state-inner')?.append(signIn);
      return panel;
    }
    return makeState('error', 'Tracking is temporarily unavailable.', 'We could not load the latest order update. Your order record is safe; try again in a moment.', retry);
  }

  async function openOrderDetail(order) {
    const id = orderId(order);
    openDialog('Order journey', orderNumber(order), makeState('loading', 'Loading order.', 'Bringing the complete order into view…'));
    try {
      const result = await apiCall('orders', ['detail', 'getOrderDetails'], { id, orderId: id }, {
        path: `/orders/order/${id}/`,
        method: 'GET'
      });
      const detail = await loadOrderTracking(id, responseData(result));
      const body = create('div');
      const layout = create('div', 'order-detail-layout');
      const journeyColumn = create('div', 'order-detail-primary');
      const detailColumn = create('aside', 'order-detail-aside');
      journeyColumn.append(renderOrderJourney(detail, () => openOrderDetail(detail)));
      layout.append(journeyColumn, detailColumn);
      const summary = create('div', 'dialog-summary');
      const paymentThrough = firstValue(detail.payment_method_display, detail.payment_method, detail.payment_through, detail.payment_status);
      const paymentLabel = /wallet/i.test(String(paymentThrough || '')) ? 'Atulyash Wallet' : String(paymentThrough || 'Recorded');
      const summaryRows = [
        ['Status', orderStatus(detail)],
        ['Placed on', formatDate(orderDate(detail))],
        ['Payment', paymentLabel],
        ['Delivery', formatDate(firstValue(
          detail.requested_delivery_date,
          detail.order_delivery_date,
          detail.delivery_date,
          detail.expected_delivery_date
        ))],
        ['Order total', orderAmountText(detail)]
      ];
      const purchaseType = firstValue(detail.purchase_type, detail.order_type, detail.fulfilment_type);
      const weeklyQuantity = firstValue(detail.weekly_quantity, detail.weekly_kg, detail.quantity_per_week);
      const deliveryDay = firstValue(detail.delivery_day, detail.preferred_delivery_day);
      if (purchaseType) summaryRows.splice(1, 0, ['Order type', /week|subscr/i.test(String(purchaseType)) ? 'Weekly freshness' : 'One-time order']);
      if (weeklyQuantity) summaryRows.splice(2, 0, ['Weekly quantity', `${weeklyQuantity}${/kg/i.test(String(weeklyQuantity)) ? '' : ' kg'} per week`]);
      if (deliveryDay) summaryRows.splice(3, 0, ['Preferred day', String(deliveryDay)]);
      const itemsTotal = orderPaymentValue(detail, 'items_total');
      const deliveryCharge = orderPaymentValue(detail, 'delivery_charge');
      const couponDiscount = orderPaymentValue(detail, 'coupon_discount', 'applied_coupon_discount');
      const walletDebit = orderPaymentValue(detail, 'wallet_debit');
      if (itemsTotal !== null) summaryRows.splice(-1, 0, ['Items total', formatMoney(itemsTotal)]);
      if (deliveryCharge !== null) summaryRows.splice(-1, 0, ['Delivery charge', deliveryCharge === 0 ? 'Free' : formatMoney(deliveryCharge)]);
      if (couponDiscount !== null && couponDiscount > 0) summaryRows.splice(-1, 0, ['Coupon saving', `−${formatMoney(couponDiscount)}`]);
      if (walletDebit !== null) summaryRows.splice(-1, 0, ['Wallet debit', formatMoney(walletDebit)]);
      summaryRows.forEach(([label, value]) => {
        const row = create('div', 'dialog-summary-row');
        row.append(create('span', '', label), create('strong', '', value));
        summary.append(row);
      });
      detailColumn.append(summary);

      const deliverySchedule = renderDeliverySchedule(detail.deliveries, detail);
      if (deliverySchedule) detailColumn.append(deliverySchedule);
      const subscriptionSchedule = renderSubscriptionSchedule(detail.subscription_orders, detail);
      if (subscriptionSchedule && (!Array.isArray(detail.deliveries) || detail.deliveries.length !== detail.subscription_orders.length)) {
        detailColumn.append(subscriptionSchedule);
      }

      const address = firstValue(detail.address_of_customer, detail.delivery_address, detail.address, detail.customer_address);
      if (address) {
        detailColumn.append(create('p', 'section-label', 'Delivery address'));
        detailColumn.append(create('p', 'dialog-copy', addressText(address)));
      }

      const items = orderItems(detail);
      if (items.length) {
        detailColumn.append(create('p', 'section-label', 'Items in this batch'));
        const itemsSummary = create('div', 'dialog-summary');
        items.forEach((item) => {
          const row = create('div', 'dialog-summary-row');
          const quantity = firstValue(item.quantity, item.qty, 1);
          const itemTotal = firstValue(item.total, item.amount, item.price, 0);
          const temporaryOrder = { items: [item] };
          row.append(create('span', '', `${orderTitle(temporaryOrder)} × ${quantity}`), create('strong', '', formatMoney(itemTotal)));
          itemsSummary.append(row);
        });
        detailColumn.append(itemsSummary);
      }

      const actions = create('div', 'dialog-actions');
      if (canModifyOneTimeOrder(detail)) actions.append(button('Modify delivery', 'secondary-button', () => openOneTimeOrderModification(detail)));
      actions.append(button('View receipt', 'secondary-button', () => openOrderReceipt(detail)));
      const invoiceUrl = orderInvoiceUrl(detail);
      if (invoiceUrl) {
        const invoice = create('a', 'secondary-button', 'Download invoice');
        invoice.href = invoiceUrl;
        invoice.target = '_blank';
        invoice.rel = 'noopener noreferrer';
        actions.append(invoice);
      }
      actions.append(button('Order again', 'primary-button', () => confirmReorder(detail)));
      if (isCompleted(detail)) actions.append(button('Write a review', 'secondary-button', () => openReview(detail)));
      detailColumn.append(actions);
      body.append(layout);
      elements.dialogBody.replaceChildren(body);
    } catch (error) {
      elements.dialogBody.replaceChildren(orderJourneyErrorState(error, () => openOrderDetail(order)));
    }
  }

  async function openOneTimeOrderModification(order) {
    const body = create('div');
    renderLoading(body, 'Checking which changes are still available…');
    openDialog('One-time order', 'Modify order', body);

    try {
      const id = orderId(order);
      const detailResult = await apiCall('orders', ['detail', 'getOrderDetails'], { id, orderId: id }, {
        path: `/orders/order/${id}/`,
        method: 'GET'
      });
      const detail = responseData(detailResult);
      if (!canModifyOneTimeOrder(detail)) {
        const statePanel = makeState(
          'empty',
          'Self-service changes are closed.',
          orderHasSuccessfulPayment(detail)
            ? 'This order already has a successful payment. Please contact Atulyash care so any change and payment adjustment can be handled safely.'
            : 'Delivered, cancelled and closed orders cannot be changed.'
        );
        const actions = create('div', 'dialog-actions');
        const care = create('a', 'primary-button', 'Contact customer care →');
        care.href = 'mailto:info@atulyash.com';
        actions.append(button('Close', 'secondary-button', closeDialog), care);
        body.replaceChildren(statePanel, actions);
        return;
      }

      await Promise.all([
        ensureAddresses(),
        state.quickProductCatalogStatus === 'ready'
          ? Promise.resolve()
          : loadQuickOrderProducts()
      ]);
      if (!state.addresses.length) {
        renderEmpty(body, 'No saved delivery home.', 'Add an address before modifying this order.', button('Add an address', 'primary-button', () => openAddressForm()));
        return;
      }

      const rawItems = orderItems(detail);
      const itemControls = rawItems.map((item, index) => {
        const itemId = firstValue(item.order_item_id, item.id, item.pk);
        const packObject = item.product_pack && typeof item.product_pack === 'object'
          ? item.product_pack
          : null;
        const packId = firstValue(
          item.product_pack_id,
          packObject?.id,
          packObject?.pk,
          packObject ? null : item.product_pack
        );
        if (itemId == null || packId == null) return null;

        const wrapper = create('fieldset', 'order-modification-item');
        const legend = create('legend', '', `Item ${index + 1} · ${firstValue(item.product_name, packObject?.product?.name, 'Atulyash Whole Wheat Atta')}`);
        const grid = create('div', 'form-grid');
        const packLabel = create('label', '', 'Pack size');
        const pack = create('select');
        pack.required = true;
        const availablePacks = [...state.quickProductPacks];
        if (!availablePacks.some((candidate) => String(candidate.apiId) === String(packId))) {
          availablePacks.push({
            apiId: packId,
            weight: firstFinite(packObject?.weight, item.weight, weightFromLabel(packObject?.name)),
            price: firstFinite(packObject?.price, item.unit_price, item.price)
          });
        }
        availablePacks
          .filter((candidate) => candidate?.apiId != null)
          .sort((left, right) => Number(left.weight || 0) - Number(right.weight || 0))
          .forEach((candidate) => {
            const option = create('option', '', [
              candidate.weight ? `${bagWeightLabel(candidate.weight)} kg` : `Pack #${candidate.apiId}`,
              Number.isFinite(Number(candidate.price)) ? formatMoney(candidate.price) : ''
            ].filter(Boolean).join(' · '));
            option.value = String(candidate.apiId);
            option.selected = String(candidate.apiId) === String(packId);
            pack.append(option);
          });
        packLabel.append(pack);

        const quantityLabel = create('label', '', 'Quantity');
        const quantity = create('input');
        quantity.type = 'number';
        quantity.min = '1';
        quantity.max = '50';
        quantity.step = '1';
        quantity.required = true;
        quantity.value = String(Math.max(1, Math.round(firstFinite(item.quantity, item.qty) || 1)));
        quantityLabel.append(quantity);
        grid.append(packLabel, quantityLabel);
        wrapper.append(legend, grid);
        return { wrapper, itemId, pack, quantity };
      });

      if (!rawItems.length || itemControls.some((entry) => !entry)) {
        throw new Error('The live order does not include the item IDs required for a safe modification. Please contact customer care.');
      }

      const form = create('form', 'dialog-form');
      form.append(create('p', 'dialog-copy', 'Update the delivery home, date, pack or quantity below. The live service will reprice the order and confirm the change before it is saved.'));
      const detailsGrid = create('div', 'form-grid');
      const addressLabel = create('label', '', 'Delivery home');
      const addressSelect = create('select');
      addressSelect.required = true;
      const currentAddress = firstValue(detail.delivery_address, detail.address, detail.customer_address);
      const currentAddressId = idOf(currentAddress);
      state.addresses.forEach((address) => {
        const option = create('option', '', `${firstValue(address.address_type, 'Address')} — ${addressText(address)}`);
        option.value = String(addressId(address));
        option.selected = String(addressId(address)) === String(currentAddressId);
        addressSelect.append(option);
      });
      addressLabel.append(addressSelect);

      const dateLabel = create('label', '', 'Delivery date');
      const deliveryDate = create('input');
      deliveryDate.type = 'date';
      deliveryDate.required = true;
      const today = new Date();
      const localToday = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
      deliveryDate.min = localToday;
      const currentDeliveryDate = String(firstValue(
        detail.requested_delivery_date,
        detail.order_delivery_date,
        detail.delivery_date,
        detail.expected_delivery_date,
        ''
      )).slice(0, 10);
      deliveryDate.value = /^\d{4}-\d{2}-\d{2}$/.test(currentDeliveryDate) && currentDeliveryDate >= localToday
        ? currentDeliveryDate
        : localToday;
      dateLabel.append(deliveryDate);
      detailsGrid.append(addressLabel, dateLabel);
      form.append(detailsGrid, ...itemControls.map((entry) => entry.wrapper));

      const previewPanel = create('section', 'modification-preview');
      previewPanel.setAttribute('aria-live', 'polite');
      previewPanel.setAttribute('aria-label', 'Revised order total');

      const modificationPayload = () => ({
        address_id: Number(addressSelect.value),
        delivery_date: deliveryDate.value,
        items: itemControls.map((entry) => ({
          order_item_id: entry.itemId,
          quantity: Number(entry.quantity.value),
          product_pack_id: Number(entry.pack.value)
        }))
      });

      const validModificationPayload = (payload) => Boolean(
        payload.address_id
        && /^\d{4}-\d{2}-\d{2}$/.test(payload.delivery_date)
        && payload.items.length
        && payload.items.every((item) => (
          Number.isInteger(item.quantity)
          && item.quantity > 0
          && Number.isFinite(item.product_pack_id)
          && item.product_pack_id > 0
        ))
      );

      const renderModificationPreview = (preview, state = 'idle', message = '') => {
        previewPanel.replaceChildren();
        const header = create('div', 'modification-preview-header');
        header.append(
          create('div', 'modification-preview-eyebrow', 'Live pricing preview'),
          create('strong', '', state === 'loading' ? 'Recalculating your order…' : 'Review the amount before saving')
        );
        previewPanel.append(header);

        if (state === 'loading') {
          previewPanel.append(create('p', 'modification-preview-message', 'Checking pack, quantity and delivery-charge changes with Atulyash.'));
          return;
        }
        if (state === 'error') {
          previewPanel.classList.add('is-error');
          previewPanel.append(
            create('p', 'modification-preview-message', message || 'We could not calculate the revised amount yet.'),
            create('small', '', 'The live service will recheck the total when you save. If it cannot safely recalculate the change, no update will be applied.')
          );
          return;
        }

        previewPanel.classList.remove('is-error');
        const original = modificationPreviewAmount(preview, 'original');
        const revised = modificationPreviewAmount(preview, 'revised');
        const difference = modificationPreviewAmount(preview, 'difference');
        const deliveryCharge = modificationPreviewAmount(preview, 'delivery');
        const discount = modificationPreviewAmount(preview, 'discount');
        const fallbackOriginal = orderAmount(detail);
        const resolvedOriginal = original === null ? fallbackOriginal : original;
        const resolvedDifference = difference === null && revised !== null && resolvedOriginal !== null
          ? revised - resolvedOriginal
          : difference;

        if (revised === null) {
          previewPanel.append(
            create('p', 'modification-preview-message', 'Make a change to see the amount that will be due.'),
            create('small', '', 'The live service recalculates pack price, quantity, discounts and delivery charges before anything is saved.')
          );
          return;
        }

        const figures = create('div', 'modification-preview-figures');
        const addFigure = (label, value, className = '') => {
          if (value === null) return;
          const figure = create('div', `modification-preview-figure${className ? ` ${className}` : ''}`);
          figure.append(create('span', '', label), create('strong', '', formatMoney(value)));
          figures.append(figure);
        };
        addFigure('Current amount due', resolvedOriginal);
        addFigure('Revised amount due', revised, 'is-primary');
        addFigure('Delivery charge', deliveryCharge);
        if (discount !== null && discount > 0) addFigure('Discount', -Math.abs(discount), 'is-discount');
        if (resolvedDifference !== null && Math.abs(resolvedDifference) >= 0.005) {
          addFigure(
            resolvedDifference > 0 ? 'Additional amount due' : 'Amount reduced',
            Math.abs(resolvedDifference),
            resolvedDifference > 0 ? 'is-due' : 'is-reduced'
          );
        }
        previewPanel.append(figures);

        let guidance = 'Saving updates the order only; no wallet debit happens while you edit.';
        if (resolvedDifference !== null && resolvedDifference > 0.005) {
          guidance = `₹${formatMoney(resolvedDifference).replace(/^₹/, '')} more will be due when this unpaid order is paid.`;
        } else if (resolvedDifference !== null && resolvedDifference < -0.005) {
          guidance = `Your amount due will be reduced by ₹${formatMoney(Math.abs(resolvedDifference)).replace(/^₹/, '')}.`;
        }
        previewPanel.append(
          create('p', 'modification-preview-message', guidance),
          create('small', '', 'No money is taken in this editing step. The revised total must be reviewed and paid through the Atulyash Wallet after the order is confirmed.')
        );
      };

      let previewTimer = null;
      let previewRequestId = 0;
      let latestPreview = null;
      const requestModificationPreview = async ({ silent = false } = {}) => {
        const payload = modificationPayload();
        if (!validModificationPayload(payload)) return false;
        const requestId = ++previewRequestId;
        renderModificationPreview(null, 'loading');
        try {
          const result = await apiCall('orders', ['modifyPreview', 'previewModification'], {
            id,
            orderId: id,
            ...payload
          }, {
            path: `/orders/order/${id}/modify-preview/`,
            method: 'POST',
            body: payload
          });
          if (requestId !== previewRequestId) return false;
          latestPreview = responseData(result);
          renderModificationPreview(latestPreview);
          return true;
        } catch (error) {
          if (requestId !== previewRequestId) return false;
          latestPreview = null;
          renderModificationPreview(null, 'error', friendlyError(error, 'The live service could not calculate this change.'));
          if (!silent) showToast(friendlyError(error, 'The revised amount could not be calculated.'), 'error');
          return false;
        }
      };

      const scheduleModificationPreview = () => {
        window.clearTimeout(previewTimer);
        previewTimer = window.setTimeout(() => { void requestModificationPreview({ silent: true }); }, 350);
      };
      addressSelect.addEventListener('change', scheduleModificationPreview);
      deliveryDate.addEventListener('change', scheduleModificationPreview);
      itemControls.forEach((entry) => {
        entry.pack.addEventListener('change', scheduleModificationPreview);
        entry.quantity.addEventListener('input', scheduleModificationPreview);
        entry.quantity.addEventListener('change', scheduleModificationPreview);
      });

      const policy = create('div', 'confirmation-panel');
      policy.append(
        create('strong', '', 'Payment is due after this edit'),
        create('p', '', 'This is an unpaid, open one-time order. Changing the pack or quantity recalculates the amount due and delivery charge. Saving here does not debit your wallet; review the revised total above, then complete payment through your Atulyash Wallet.')
      );
      const actions = create('div', 'dialog-actions');
      actions.append(button('Cancel', 'secondary-button', closeDialog));
      const submit = create('button', 'primary-button', 'Review & save changes →');
      submit.type = 'submit';
      actions.append(submit);
      form.append(previewPanel, policy, actions);

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        window.clearTimeout(previewTimer);
        const payload = modificationPayload();
        setButtonBusy(submit, true, 'Checking total…');
        try {
          const previewReady = await requestModificationPreview();
          if (!previewReady) showToast('Preview is unavailable; the live service will validate the final amount while saving.', 'error');
          setButtonBusy(submit, true, 'Saving…');
          const result = await apiCall('orders', ['modify', 'modifyOrder'], {
            id,
            orderId: id,
            ...payload
          }, {
            path: `/orders/order/${id}/modify/`,
            method: 'PATCH',
            body: payload
          });
          const data = responseData(result);
          closeDialog();
          state.loaded.forEach((key) => {
            if (String(key).startsWith('orders:')) state.loaded.delete(key);
          });
          await renderOrders({ page: 1, force: true });
          const updatedTotal = finiteMoney(
            data.total_amount,
            data.recalculated_total,
            data.final_total,
            modificationPreviewAmount(latestPreview, 'revised')
          );
          showToast(updatedTotal !== null
            ? `Order updated. ${formatMoney(updatedTotal)} is now due at payment.`
            : String(firstValue(data.message, 'Order updated. Review the revised amount before paying.'))
          );
        } catch (error) {
          showToast(friendlyError(error, 'The order could not be modified. No changes were saved.'), 'error');
          setButtonBusy(submit, false);
        }
      });
      renderModificationPreview(null);
      body.replaceChildren(form);
      void requestModificationPreview({ silent: true });
    } catch (error) {
      body.replaceChildren(makeState(
        'error',
        'This order cannot be changed here.',
        friendlyError(error, 'The live order details required for a safe modification are unavailable.'),
        () => openOneTimeOrderModification(order)
      ));
    }
  }

  function openOrderReceipt(order) {
    const body = create('div');
    body.append(create('p', 'dialog-copy', 'This customer receipt brings your order, delivery and payment details together in one place. You can print it for your records.'));
    const summary = create('div', 'dialog-summary');
    [
      ['Order reference', orderNumber(order)],
      ['Placed on', formatDate(orderDate(order))],
      ['Status', orderStatus(order)],
      ['Payment', String(firstValue(order.payment_method_display, order.payment_method, order.payment_status, 'Recorded'))],
      ['Order total', orderAmountText(order)]
    ].forEach(([label, value]) => {
      const row = create('div', 'dialog-summary-row');
      row.append(create('span', '', label), create('strong', '', value));
      summary.append(row);
    });
    body.append(summary);
    const address = firstValue(order.delivery_address, order.address, order.customer_address);
    if (address) body.append(create('p', 'dialog-copy', `Delivering to: ${addressText(address)}`));
    const actions = create('div', 'dialog-actions');
    actions.append(button('Close', 'secondary-button', closeDialog));
    actions.append(button('Print receipt', 'primary-button', () => printOrderReceipt(order)));
    body.append(actions);
    openDialog('Customer receipt', orderNumber(order), body);
  }

  function printOrderReceipt(order) {
    const popup = window.open('', '_blank', 'width=760,height=900');
    if (!popup) {
      showToast('Please allow pop-ups to print this receipt.', 'error');
      return;
    }
    popup.opener = null;
    const documentRef = popup.document;
    documentRef.write('<!doctype html><html><head><title>Atulyash order receipt</title><style>body{margin:0;padding:42px;color:#092f27;font:16px Arial,sans-serif}h1{font:500 42px Georgia,serif;margin:8px 0 24px}.eyebrow{color:#b95636;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}.row{display:flex;justify-content:space-between;gap:20px;padding:14px 0;border-bottom:1px solid #d9d7cc}.row span{color:#64716d}.row strong{text-align:right}footer{margin-top:34px;color:#64716d;font-size:13px}</style></head><body></body></html>');
    const root = documentRef.body;
    const eyebrow = documentRef.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = 'Atulyash · customer receipt';
    const heading = documentRef.createElement('h1');
    heading.textContent = orderNumber(order);
    root.append(eyebrow, heading);
    [
      ['Placed on', formatDate(orderDate(order))],
      ['Status', orderStatus(order)],
      ['Payment', String(firstValue(order.payment_method_display, order.payment_method, order.payment_status, 'Recorded'))],
      ['Order total', orderAmountText(order)]
    ].forEach(([label, value]) => {
      const row = documentRef.createElement('div');
      row.className = 'row';
      const key = documentRef.createElement('span');
      key.textContent = label;
      const item = documentRef.createElement('strong');
      item.textContent = value;
      row.append(key, item);
      root.append(row);
    });
    const address = firstValue(order.delivery_address, order.address, order.customer_address);
    if (address) {
      const row = documentRef.createElement('div');
      row.className = 'row';
      const key = documentRef.createElement('span');
      key.textContent = 'Delivery address';
      const item = documentRef.createElement('strong');
      item.textContent = addressText(address);
      row.append(key, item);
      root.append(row);
    }
    const footer = documentRef.createElement('footer');
    footer.textContent = 'For help with this order, email info@atulyash.com.';
    root.append(footer);
    popup.focus();
    popup.print();
  }

  function confirmReorder(order) {
    const body = create('div');
    const note = create('div', 'confirmation-panel');
    note.append(
      create('strong', '', 'Add this order to your bag again?'),
      create('p', '', `${orderTitle(order)} from order ${orderNumber(order)} will be copied to your current bag.`)
    );
    const actions = create('div', 'dialog-actions');
    actions.append(
      button('Not now', 'secondary-button', closeDialog),
      button('Yes, add to bag', 'primary-button', async (event) => {
        const control = event.currentTarget;
        setButtonBusy(control, true, 'Adding…');
        try {
          const id = orderId(order);
          await apiCall('orders', ['reorder'], { id, orderId: id }, {
            path: `/orders/order/${id}/reorder/`,
            method: 'POST',
            form: {}
          });
          closeDialog();
          await loadAccountBag();
          openAccountBag({ refresh: false });
        } catch (error) {
          showToast(friendlyError(error), 'error');
          setButtonBusy(control, false);
        }
      })
    );
    body.append(note, actions);
    openDialog('Order again', orderNumber(order), body);
  }

  async function ensureAddresses(force = false) {
    if (!force && state.loaded.has('addresses')) return state.addresses;
    const query = { page_size: 100, customer__id: state.customerId, is_active: true };
    const result = await apiCall('addresses', ['list', 'getCustomerAddress'], query, {
      path: '/customers/customer-addresses/',
      method: 'GET',
      query
    });
    state.addresses = responseList(result);
    state.loaded.add('addresses');
    return state.addresses;
  }

  function addressId(address) {
    if (!address) return null;
    return firstValue(address.id, address.address_id, address.pk);
  }

  function addressText(address) {
    if (typeof address === 'string') return address;
    const lines = [
      firstValue(address.house_name, address.house_number, address.flat_number, address.address_line_1),
      firstValue(address.tower_wing, address.building, address.apartment, address.address_line_2),
      address.landmark ? `Near ${address.landmark}` : null,
      firstValue(address.area, address.city, address.locality),
      address.state,
      firstValue(address.pincode?.pincode, address.pincode?.code, address.pincode, address.postal_code)
    ].filter(Boolean);
    return lines.join(', ') || 'Address details available with Atulyash';
  }

  function addressPincode(address) {
    return String(firstValue(
      address?.pincode?.pincode,
      address?.pincode?.code,
      address?.pincode,
      address?.postal_code,
      ''
    ));
  }

  function addressPhone(address) {
    const value = String(firstValue(
      address?.address_phone,
      address?.phone,
      address?.mobile,
      state.mobile,
      ''
    )).replace(/\D/g, '').slice(-10);
    return value.length === 10 ? `+91 ${value.slice(0, 5)} ${value.slice(5)}` : value;
  }

  function addressIsDefault(address) {
    return Boolean(firstValue(
      address?.is_default,
      address?.is_default_address,
      address?.default,
      address?.is_primary,
      false
    ));
  }

  function updateDeliveryHomeCount(count = null) {
    if (!elements.deliveryHomeCount || !elements.deliveryHomeCountLabel) return;
    if (!Number.isFinite(Number(count))) {
      elements.deliveryHomeCount.textContent = '—';
      elements.deliveryHomeCountLabel.textContent = 'Checking saved homes';
      return;
    }
    const total = Math.max(0, Number(count));
    elements.deliveryHomeCount.textContent = String(total).padStart(2, '0');
    elements.deliveryHomeCountLabel.textContent = total === 1 ? 'Saved delivery home' : 'Saved delivery homes';
  }

  function openReview(order) {
    const items = orderItems(order);
    const firstItem = items[0] || {};
    const form = create('form', 'dialog-form');
    form.append(create('p', 'dialog-copy', `Tell us about ${orderTitle(order)}. Reviews are moderated before they appear publicly.`));

    const ratingLabel = create('span', '', 'Your rating');
    const rating = create('div', 'rating-control');
    for (let value = 5; value >= 1; value -= 1) {
      const input = create('input');
      input.type = 'radio';
      input.name = 'rating';
      input.id = `rating-${value}`;
      input.value = String(value);
      input.required = true;
      const star = create('label', '', '★');
      star.htmlFor = input.id;
      star.setAttribute('aria-label', `${value} star${value === 1 ? '' : 's'}`);
      rating.append(input, star);
    }
    const reviewLabel = create('label', '', 'Your review');
    const review = create('textarea');
    review.name = 'review';
    review.maxLength = 800;
    review.required = true;
    review.placeholder = 'How did this fresh batch feel in your home?';
    reviewLabel.append(review);
    const actions = create('div', 'dialog-actions');
    actions.append(button('Cancel', 'secondary-button', closeDialog));
    const submit = create('button', 'primary-button', 'Submit review →');
    submit.type = 'submit';
    actions.append(submit);
    form.append(ratingLabel, rating, reviewLabel, actions);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const selectedRating = new FormData(form).get('rating');
      if (!selectedRating) return showToast('Please choose a rating.', 'error');
      setButtonBusy(submit, true, 'Submitting…');
      let productId = firstValue(
        idOf(firstItem.product),
        idOf(firstItem.product_detail),
        idOf(firstItem.product_pack?.product),
        idOf(firstItem.subscription_pack?.product),
        firstItem.product_id,
        order.product_id
      );
      if (!productId) {
        try {
          if (!state.products.length) {
            const productsResult = await apiCall('products', ['list'], { is_active: true }, {
              path: '/products/products/',
              method: 'GET',
              query: { is_active: true },
              auth: false
            });
            state.products = responseList(productsResult);
          }
          const packId = firstValue(
            idOf(firstItem.product_pack),
            firstItem.product_pack_id,
            idOf(firstItem.subscription_pack),
            firstItem.subscription_pack_id
          );
          const matchedProduct = state.products.find((candidate) => {
            const packs = firstValue(candidate.all_packs, candidate.packs, candidate.product_packs, []);
            return Array.isArray(packs) && packs.some((pack) => String(idOf(pack)) === String(packId));
          }) || (state.products.length === 1 ? state.products[0] : null);
          productId = idOf(matchedProduct);
        } catch (error) {
          setButtonBusy(submit, false);
          showToast('The product details needed for this review are unavailable. Please try again.', 'error');
          return;
        }
      }
      if (!productId) {
        setButtonBusy(submit, false);
        showToast('The product details needed for this review are unavailable.', 'error');
        return;
      }
      const payload = {
        order: orderId(order),
        order_id: orderId(order),
        is_active: true,
        product: productId,
        product_id: productId,
        user: state.userId,
        user_id: state.userId,
        rating: Number(selectedRating),
        review: review.value.trim(),
        to_display: false
      };
      try {
        await apiCall('misc', ['submitReview', 'postReview'], payload, {
          path: '/reviews/reviews/',
          method: 'POST',
          form: payload
        });
        closeDialog();
        showToast('Thank you. Your review has been sent for moderation.');
      } catch (error) {
        showToast(friendlyError(error), 'error');
        setButtonBusy(submit, false);
      }
    });
    openDialog('Your experience', `Review ${orderNumber(order)}`, form);
  }

  async function loadSubscriptions(force = false) {
    if (!force && state.loaded.has('subscriptions')) return state.subscriptions;
    const query = {
      is_active: true,
      page_size: 100,
      customerId: state.customerId
    };
    const [subscriptionsResult, vacationsResult] = await Promise.allSettled([
      apiCall('subscriptions', ['listActive', 'getCustomerActiveSubscriptions'], query, {
        path: '/subscription/subscription_plan/',
        method: 'GET',
        query: {
          is_active: true,
          page_size: 100,
          customer_address__customer__id: state.customerId
        }
      }),
      apiCall('subscriptions', ['listVacations', 'getCustomerVacation'], query, {
        path: '/subscription/vacation/',
        method: 'GET',
        query: {
          subscription__customer_address__customer: state.customerId,
          is_active: true
        }
      })
    ]);
    if (subscriptionsResult.status === 'rejected') throw subscriptionsResult.reason;
    state.subscriptions = responseList(subscriptionsResult.value);
    state.vacations = vacationsResult.status === 'fulfilled' ? responseList(vacationsResult.value) : [];
    state.loaded.add('subscriptions');
    return state.subscriptions;
  }

  function subscriptionId(subscription) {
    return firstValue(subscription?.id, subscription?.subscription_plan_id, subscription?.plan_id, subscription?.pk);
  }

  function subscriptionCatalogPlan(subscription) {
    const pack = firstValue(subscription.subscription_pack, subscription.pack, subscription.package);
    const packId = typeof pack === 'object'
      ? firstValue(pack?.id, pack?.pk)
      : firstValue(pack, subscription.subscription_pack_id, subscription.pack_id);
    return state.weeklyPlans.find((plan) => String(plan.id) === String(packId)) || null;
  }

  function subscriptionName(subscription) {
    const pack = firstValue(subscription.subscription_pack, subscription.pack, subscription.package, {});
    const catalogPlan = subscriptionCatalogPlan(subscription);
    return String(firstValue(pack?.name, pack?.title, catalogPlan?.name, subscription.name, subscription.plan_name, 'Fresh Weekly Atta'));
  }

  function subscriptionWeight(subscription) {
    const pack = firstValue(subscription.subscription_pack, subscription.pack, subscription.package, {});
    const catalogPlan = subscriptionCatalogPlan(subscription);
    if (catalogPlan) {
      return `${catalogPlan.monthlyKg} kg/month · ${weeklyDeliveryCycleText(catalogPlan)}`;
    }
    const monthlyKg = firstFinite(pack?.monthly_quantity, subscription.monthly_quantity, subscription.monthly_kg);
    if (monthlyKg) return `${monthlyKg} kg/month · ${weeklyDeliveryCycleText({ monthlyKg })}`;
    const weight = firstValue(
      subscription.weekly_kg,
      subscription.quantity_kg,
      pack?.weekly_quantity,
      pack?.weekly_kg,
      pack?.weight,
      catalogPlan?.weeklyKg,
      subscription.quantity
    );
    if (!weight) return 'Weekly fresh batch';
    return `${weight}${String(weight).toLowerCase().includes('kg') ? '' : ' kg'} per delivery`;
  }

  function subscriptionNextDate(subscription) {
    const upcoming = firstValue(subscription.next_delivery, subscription.upcoming_delivery, subscription.next_order);
    return firstValue(
      subscription.next_delivery_date,
      subscription.next_available_delivery_date,
      subscription.next_delivery_date_after_vacation,
      subscription.after_vacation_next_delivery_date,
      upcoming?.delivery_date,
      upcoming?.date,
      subscription.delivery_date,
      subscription.start_date
    );
  }

  // Date arithmetic belongs to the subscription service. These helpers only
  // normalise dates for display/comparison; the UI never invents a new weekly
  // delivery date locally.
  function calendarDate(value) {
    const raw = String(value || '').trim();
    const iso = raw.match(/^(\d{4}-\d{2}-\d{2})/);
    if (iso) return iso[1];
    const parsed = dateValue(raw);
    if (!parsed) return '';
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function subscriptionNextDateWithVacation(subscription) {
    // The refreshed subscription (or the mutation response) contains the
    // server-authoritative next_delivery_date after skip/vacation changes.
    return subscriptionNextDate(subscription);
  }

  function subscriptionStatus(subscription) {
    return String(firstValue(subscription.status_display, subscription.plan_status, subscription.status, subscription.is_active === false ? 'Cancelled' : 'Active'));
  }

  function subscriptionAllowsDeliveryChanges(subscription) {
    const continuous = subscription?.is_continuous;
    return continuous !== false && String(continuous).toLowerCase() !== 'false';
  }

  function vacationCoveringDate(subscription, date) {
    const targetDate = calendarDate(date);
    if (!targetDate) return null;
    const planId = subscriptionId(subscription);
    return state.vacations.find((vacation) => {
      const relation = firstValue(
        vacation?.subscription,
        vacation?.subscription_id,
        vacation?.subscription_plan,
        vacation?.subscription_plan_id,
        vacation?.plan_id
      );
      const relationId = relation && typeof relation === 'object' ? idOf(relation) : relation;
      if (relationId != null && planId != null && String(relationId) !== String(planId)) return false;
      const startDate = calendarDate(firstValue(vacation?.start_date, vacation?.pause_from));
      const endDate = calendarDate(firstValue(vacation?.end_date, vacation?.resume_at));
      return Boolean(startDate && endDate && targetDate >= startDate && targetDate <= endDate);
    }) || null;
  }

  function makeSubscriptionCard(subscription) {
    const card = create('article', 'subscription-card');
    const head = create('div', 'subscription-card-head');
    const copy = create('div');
    copy.append(create('h3', '', subscriptionName(subscription)), create('p', '', subscriptionWeight(subscription)));
    head.append(copy, statusPill(subscriptionStatus(subscription)));

    const body = create('div', 'subscription-body');
    const pack = firstValue(subscription.subscription_pack, subscription.pack, {});
    const catalogPlan = subscriptionCatalogPlan(subscription);
    [
      ['Delivery day', firstValue(subscription.delivery_day, subscription.weekday, 'As scheduled')],
      ['Plan length', firstValue(subscription.duration_display, subscription.duration, pack?.duration, 'Ongoing')],
      ['Weekly value', formatMoney(firstValue(subscription.price_per_delivery, subscription.weekly_price, pack?.weekly_price, catalogPlan?.price, 0))],
      ['Wallet cover (4 deliveries)', formatMoney(firstValue(subscription.monthly_price, pack?.price, catalogPlan?.monthlyPrice, 0))],
      ['Plan reference', `#${subscriptionId(subscription) || '—'}`]
    ].forEach(([label, value]) => {
      const stat = create('div', 'subscription-stat');
      stat.append(create('span', '', label), create('strong', '', value));
      body.append(stat);
    });

    const next = create('div', 'subscription-next');
    const scheduledNextDate = subscriptionNextDate(subscription);
    const displayedNextDate = subscriptionNextDateWithVacation(subscription);
    const nextDate = dateValue(displayedNextDate);
    const vacationShifted = calendarDate(scheduledNextDate) && calendarDate(scheduledNextDate) !== displayedNextDate;
    const tile = create('div', 'date-tile');
    tile.append(
      create('span', '', nextDate ? new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(nextDate) : 'Next'),
      create('strong', '', nextDate ? new Intl.DateTimeFormat('en-IN', { day: '2-digit' }).format(nextDate) : '—')
    );
    const nextCopy = create('p');
    nextCopy.append(
      create('strong', '', vacationShifted ? 'Next fresh batch after vacation' : 'Next fresh batch'),
      document.createElement('br'),
      document.createTextNode(formatDate(displayedNextDate))
    );
    if (vacationShifted) {
      nextCopy.append(
        document.createElement('br'),
        create('span', 'subscription-next-note', `The scheduled ${formatDate(scheduledNextDate)} delivery falls during your pause.`)
      );
    }
    next.append(tile, nextCopy);

    const actions = create('div', 'subscription-actions');
    actions.append(
      button('Change plan', 'card-action', () => openChangeSubscriptionPlan(subscription)),
      button('Vacation', 'card-action', () => openVacationForm(subscription)),
      button('Cancel plan', 'card-action is-rust', () => openCancelSubscription(subscription))
    );
    if (subscriptionAllowsDeliveryChanges(subscription)) {
      actions.insertBefore(
        button('Manage deliveries', 'card-action', () => openManageDeliveries(subscription)),
        actions.children[1]
      );
    } else {
      const note = create('small', 'subscription-action-note', 'Delivery skips are available for continuous plans.');
      note.title = 'This plan contains a fixed four-delivery cycle, so its delivery dates cannot be skipped.';
      actions.append(note);
    }
    card.append(head, body, next, actions);
    return card;
  }

  async function openChangeSubscriptionPlan(subscription) {
    const id = subscriptionId(subscription);
    const loading = makeState('loading', 'Finding weekly plans.', 'Loading the live quantities available for your next batches…');
    openDialog('Weekly plan', 'Change plan', loading);
    try {
      if (!state.weeklyPlans.length) await loadQuickOrderWeeklyPlans();
      if (!state.weeklyPlans.length) {
        elements.dialogBody.replaceChildren(makeState('empty', 'No alternative plans are available.', 'Please try again later or contact Atulyash care for help.'));
        return;
      }
      const currentPack = firstValue(subscription.subscription_pack, subscription.pack, {});
      const currentPackId = firstValue(currentPack?.id, subscription.subscription_pack_id, subscription.pack_id);
      const form = create('form', 'dialog-form');
      form.append(create('p', 'dialog-copy', 'Choose the amount you want in each weekly fresh batch. Atulyash will recalculate the wallet requirement before you confirm.'));
      const label = create('label', '', 'Weekly quantity');
      const select = create('select');
      select.required = true;
      state.weeklyPlans.forEach((plan) => {
        const option = create('option', '', `${plan.monthlyKg} kg/month · ${weeklyDeliveryCycleText(plan)} · ${formatMoney(plan.price)} per delivery`);
        option.value = String(plan.id);
        option.selected = String(plan.id) === String(currentPackId);
        select.append(option);
      });
      label.append(select);
      const previewPanel = create('section', 'modification-preview pack-change-preview');
      previewPanel.setAttribute('aria-live', 'polite');
      previewPanel.setAttribute('aria-label', 'Weekly plan and wallet preview');
      const actions = create('div', 'dialog-actions');
      actions.append(button('Keep current plan', 'secondary-button', closeDialog));
      const submit = create('button', 'primary-button pack-change-submit', 'Update weekly plan →');
      submit.type = 'submit';
      actions.append(submit);
      form.append(label, previewPanel, actions);

      let latestPreview = null;
      let latestPreviewPackId = '';
      let previewRequestId = 0;
      let submitBusy = false;

      const walletCoverage = (canStartValue, shortfall) => {
        const hasServerDecision = canStartValue !== undefined && canStartValue !== null && canStartValue !== '';
        if (hasServerDecision) return canStartValue === true || String(canStartValue).toLowerCase() === 'true';
        return shortfall !== null && shortfall <= 0.005;
      };

      const planChangeErrorMessage = (error, fallback = 'The live plan preview could not be loaded.') => {
        const payload = error?.data || error?.response?.data || error?.body || error?.details;
        const rawMessage = firstValue(readableErrorValue(payload), error?.message, '');
        if (/unsupported operand|nonetype.*int|typeerror/i.test(String(rawMessage))) {
          return 'The server could not calculate this plan change yet. Please try again later or contact Atulyash care.';
        }
        return friendlyError(error, fallback);
      };

      const previewPlan = (plan) => {
        const source = plan && typeof plan === 'object' ? plan : {};
        const quantity = firstValue(
          source.quantity_per_week,
          source.weekly_quantity,
          source.quantity,
          source.weekly_kg
        );
        const quantityNumber = quantityKg(quantity);
        const quantityText = quantityNumber !== null
          ? `${bagWeightLabel(quantityNumber)} kg/week`
          : quantity ? String(quantity) : 'Quantity not supplied';
        const price = finiteMoney(source.price_per_month, source.monthly_price, source.price, source.amount);
        return {
          quantityText,
          price,
          priceText: price === null ? 'Monthly price not supplied' : `${formatMoney(price)} per month`
        };
      };

      const renderPackChangePreview = (preview, stateName = 'idle', message = '') => {
        previewPanel.replaceChildren();
        previewPanel.classList.toggle('is-error', stateName === 'error');
        const header = create('div', 'modification-preview-header');
        header.append(
          create('div', 'modification-preview-eyebrow', 'Server wallet preview'),
          create('strong', '', stateName === 'loading' ? 'Recalculating this plan…' : 'Review the wallet requirement')
        );
        previewPanel.append(header);

        if (stateName === 'loading') {
          previewPanel.append(create('p', 'modification-preview-message', 'Checking the selected quantity, four-delivery cover and your current wallet balance.'));
          updatePackChangeSubmitState();
          return;
        }
        if (stateName === 'error') {
          previewPanel.append(
            create('p', 'modification-preview-message', message || 'The live plan preview could not be loaded.'),
            create('small', '', 'No plan change was made. Try selecting the plan again or contact Atulyash care.')
          );
          updatePackChangeSubmitState();
          return;
        }
        if (!preview) {
          previewPanel.append(
            create('p', 'modification-preview-message', 'Select a different weekly quantity to see its live price and wallet requirement.'),
            create('small', '', 'The selected plan is not changed until you confirm after this preview.')
          );
          updatePackChangeSubmitState();
          return;
        }

        const data = preview && typeof preview === 'object' ? preview : {};
        const existing = previewPlan(data.existing_plan || data.current_plan || data.previous_plan);
        const revised = previewPlan(data.new_plan || data.revised_plan || data.next_plan);
        const funding = data.wallet_funding || data.wallet_impact || data.wallet || {};
        const available = finiteMoney(funding.available_balance, data.available_balance);
        const required = finiteMoney(
          funding.minimum_wallet_required,
          funding.gross_wallet_required,
          data.minimum_wallet_required,
          data.gross_wallet_required
        );
        const perDelivery = finiteMoney(funding.price_per_delivery, data.price_per_delivery);
        const deliveries = firstValue(funding.minimum_deliveries_required, data.minimum_deliveries_required);
        const shortfall = finiteMoney(funding.shortfall, data.shortfall);
        const canStartValue = firstValue(funding.can_start_subscription, data.can_start_subscription);
        const walletCovered = walletCoverage(canStartValue, shortfall);

        const figures = create('div', 'modification-preview-figures');
        const addFigure = (labelText, value, detailText = '', className = '') => {
          const figure = create('div', `modification-preview-figure${className ? ` ${className}` : ''}`);
          figure.append(create('span', '', labelText), create('strong', '', value));
          if (detailText) figure.append(create('small', '', detailText));
          figures.append(figure);
        };
        addFigure('Current plan', existing.quantityText, existing.priceText);
        addFigure('New plan', revised.quantityText, revised.priceText, 'is-primary');
        if (available !== null) addFigure('Wallet available', formatMoney(available));
        if (required !== null) {
          const requirementDetail = [
            deliveries ? `${deliveries} deliveries` : null,
            perDelivery !== null ? `${formatMoney(perDelivery)} per delivery` : null
          ].filter(Boolean).join(' · ');
          addFigure('Wallet required', formatMoney(required), requirementDetail);
        }
        if (shortfall !== null && shortfall > 0.005) {
          addFigure('Additional recharge', formatMoney(shortfall), 'Add this amount before confirming.', 'is-due');
        }
        previewPanel.append(figures);

        if (walletCovered) {
          previewPanel.append(
            create('p', 'modification-preview-message', 'Your wallet covers this plan. Confirm to apply the new pack to future deliveries.'),
            create('small', '', 'Already charged or delivered records remain unchanged.')
          );
          previewPanel.classList.remove('is-error');
        } else {
          previewPanel.classList.add('is-error');
          previewPanel.append(
            create('p', 'modification-preview-message', shortfall !== null && shortfall > 0.005
              ? `Add ${formatMoney(shortfall)} to your wallet before confirming this plan.`
              : 'Your wallet does not currently cover this plan.'),
            create('small', '', 'No plan change will be applied until the required wallet balance is available.')
          );
          if (shortfall !== null && shortfall > 0.005) {
            const rechargeActions = create('div', 'dialog-actions');
            rechargeActions.append(button(`Recharge ${formatMoney(shortfall)} →`, 'primary-button', () => openWalletRecharge(shortfall)));
            previewPanel.append(rechargeActions);
          }
        }
        updatePackChangeSubmitState();
      };

      function updatePackChangeSubmitState() {
        const changed = currentPackId == null || String(select.value) !== String(currentPackId);
        const previewMatchesSelection = latestPreview && latestPreviewPackId === String(select.value);
        const funding = previewMatchesSelection
          ? (latestPreview.wallet_funding || latestPreview.wallet_impact || latestPreview.wallet || {})
          : {};
        const shortfall = previewMatchesSelection ? finiteMoney(funding.shortfall, latestPreview.shortfall) : null;
        const canStartValue = previewMatchesSelection
          ? firstValue(funding.can_start_subscription, latestPreview.can_start_subscription)
          : null;
        const walletCovered = walletCoverage(canStartValue, shortfall);
        submit.disabled = submitBusy || !changed || !previewMatchesSelection || !walletCovered;
      }

      const requestPackChangePreview = async ({ silent = false } = {}) => {
        const new_pack_id = select.value;
        const requestId = ++previewRequestId;
        latestPreview = null;
        latestPreviewPackId = '';
        if (!new_pack_id || String(new_pack_id) === String(currentPackId)) {
          renderPackChangePreview(null);
          return true;
        }
        renderPackChangePreview(null, 'loading');
        try {
          const result = await apiCall('subscriptions', ['previewChange'], {
            id,
            subscriptionId: id,
            subPlanId: id,
            new_pack_id
          }, {
            path: `/subscription/subscription_plan/${id}/preview-pack-change/`,
            method: 'POST',
            form: { new_pack_id }
          });
          if (requestId !== previewRequestId) return false;
          latestPreview = responseData(result);
          latestPreviewPackId = String(new_pack_id);
          renderPackChangePreview(latestPreview);
          return true;
        } catch (error) {
          if (requestId !== previewRequestId) return false;
          latestPreview = null;
          latestPreviewPackId = '';
          const message = planChangeErrorMessage(error);
          renderPackChangePreview(null, 'error', message);
          if (!silent) showToast(message, 'error');
          return false;
        }
      };

      select.addEventListener('change', () => {
        void requestPackChangePreview();
      });
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const new_pack_id = select.value;
        if (!new_pack_id || String(new_pack_id) === String(currentPackId)) {
          showToast('Choose a different weekly plan before updating.', 'error');
          return;
        }
        setButtonBusy(submit, true, 'Checking wallet…');
        submitBusy = true;
        updatePackChangeSubmitState();
        try {
          if (!latestPreview || latestPreviewPackId !== String(new_pack_id)) {
            const previewReady = await requestPackChangePreview();
            if (!previewReady || !latestPreview) {
              showToast('The live plan preview is unavailable. No changes were saved.', 'error');
              submitBusy = false;
              setButtonBusy(submit, false);
              updatePackChangeSubmitState();
              return;
            }
          }
          const funding = latestPreview.wallet_funding || latestPreview.wallet_impact || latestPreview.wallet || {};
          const shortfall = finiteMoney(funding.shortfall, latestPreview.shortfall);
          const canStartValue = firstValue(funding.can_start_subscription, latestPreview.can_start_subscription);
          const walletCovered = walletCoverage(canStartValue, shortfall);
          if (!walletCovered || (shortfall !== null && shortfall > 0.005)) {
            renderPackChangePreview(latestPreview);
            showToast(shortfall !== null && shortfall > 0.005
              ? `Add ${formatMoney(shortfall)} to your wallet before confirming.`
              : 'Your wallet does not cover this plan yet.', 'error');
            submitBusy = false;
            setButtonBusy(submit, false);
            updatePackChangeSubmitState();
            return;
          }
          setButtonBusy(submit, true, 'Updating…');
          await apiCall('subscriptions', ['updatePack'], { id, subscriptionId: id, subPlanId: id, new_pack_id }, {
            path: `/subscription/subscription_plan/${id}/update-pack/`,
            method: 'POST',
            form: { new_pack_id }
          });
          closeDialog();
          state.loaded.delete('subscriptions');
          showToast('Your weekly plan has been updated.');
          await renderSubscriptions(true);
        } catch (error) {
          const message = planChangeErrorMessage(error, 'The plan change could not be completed.');
          showToast(message, 'error');
          const errorData = responseData(error?.data || error?.response?.data || error?.body);
          if (errorData && typeof errorData === 'object' && (errorData.code || errorData.shortfall != null)) {
            latestPreview = { ...latestPreview, ...errorData };
            latestPreviewPackId = String(new_pack_id);
            renderPackChangePreview(latestPreview, 'error', message);
          }
          submitBusy = false;
          setButtonBusy(submit, false);
          updatePackChangeSubmitState();
        }
      });
      renderPackChangePreview(null);
      elements.dialogBody.replaceChildren(form);
    } catch (error) {
      elements.dialogBody.replaceChildren(makeState('error', 'Weekly plans are unavailable.', friendlyError(error), () => openChangeSubscriptionPlan(subscription)));
    }
  }

  function renderVacationBanner() {
    const active = state.vacations[0];
    if (!active) {
      elements.vacationBanner.replaceChildren();
      const left = create('div');
      left.append(create('span', 'vacation-mark', '☼'));
      const copy = create('p');
      copy.append(create('strong', '', 'Going away?'), document.createElement('br'), document.createTextNode('Pause scheduled deliveries for the dates you are away.'));
      left.append(copy);
      elements.vacationBanner.append(left, button('Set vacation', 'secondary-button', () => openVacationForm()));
      return;
    }
    const left = create('div');
    left.append(create('span', 'vacation-mark', '☼'));
    const copy = create('p');
    copy.append(
      create('strong', '', 'Vacation mode is scheduled'),
      document.createElement('br'),
      document.createTextNode(`${formatDate(firstValue(active.start_date, active.pause_from))} to ${formatDate(firstValue(active.end_date, active.resume_at))}`)
    );
    const affected = state.subscriptions
      .map((subscription) => ({
        subscription,
        scheduled: subscriptionNextDate(subscription),
        next: subscriptionNextDateWithVacation(subscription)
      }))
      .filter(({ scheduled, next }) => calendarDate(scheduled) && next && calendarDate(scheduled) !== next);
    if (affected.length) {
      const next = affected[0].next;
      copy.append(
        document.createElement('br'),
        create('span', 'vacation-next-note', `Next batch moves to ${formatDate(next)}.`)
      );
    }
    left.append(copy);
    const actions = create('div', 'card-actions');
    actions.append(
      button('Edit dates', 'card-action', () => openVacationForm(null, active)),
      button('End early', 'card-action is-rust', () => confirmEndVacation(active))
    );
    elements.vacationBanner.replaceChildren(left, actions);
  }

  async function renderSubscriptions(force = false) {
    renderLoading(elements.subscriptionsList, 'Checking your weekly freshness plans…');
    try {
      const subscriptions = await loadSubscriptions(force);
      const planCount = subscriptions.length;
      if (elements.weeklyPlanCount) elements.weeklyPlanCount.textContent = String(planCount);
      if (elements.weeklyPlanCountLabel) elements.weeklyPlanCountLabel.textContent = planCount === 1 ? 'Active weekly plan' : planCount ? 'Active weekly plans' : 'No active plan';
      if (elements.chooseWeeklyPlanButton) elements.chooseWeeklyPlanButton.hidden = planCount > 0;
      if (elements.vacationBanner) elements.vacationBanner.hidden = planCount === 0;
      renderVacationBanner();
      if (!subscriptions.length) {
        renderEmpty(
          elements.subscriptionsList,
          'No active weekly plan.',
          'Choose a weekly quantity and receive atta prepared close to delivery.',
          Object.assign(create('a', 'primary-button', 'Explore weekly plans →'), { href: 'index.html#shop' })
        );
        return;
      }
      const fragment = document.createDocumentFragment();
      subscriptions.forEach((subscription) => fragment.append(makeSubscriptionCard(subscription)));
      elements.subscriptionsList.replaceChildren(fragment);
    } catch (error) {
      if (isUnauthorized(error)) return enterAuth('Your session has ended. Please sign in again.');
      renderError(elements.subscriptionsList, error, () => renderSubscriptions(true));
    }
  }

  async function openManageDeliveries(subscription) {
    if (!subscriptionAllowsDeliveryChanges(subscription)) {
      openDialog(
        'Weekly plan',
        'Manage deliveries',
        makeState(
          'empty',
          'This plan has a fixed delivery cycle.',
          'Skipping deliveries is available only for continuous weekly plans. You can change the plan or contact Atulyash care if you need help.'
        )
      );
      return;
    }
    const id = subscriptionId(subscription);
    const loading = makeState('loading', 'Checking your schedule.', 'Finding the dates that can still be changed…');
    openDialog('Weekly plan', 'Manage deliveries', loading);
    try {
      const [deliveriesResult, summaryResult] = await Promise.allSettled([
        apiCall('subscriptions', ['skippableDeliveries', 'getSkippableDeliveries'], { id, subscriptionId: id, subPlanId: id }, {
          path: `/subscription/subscription_plan/${id}/skippable-deliveries/`,
          method: 'GET'
        }),
        apiCall('subscriptions', ['skipSummary', 'getSkipSummary'], { id, subscriptionId: id, subPlanId: id }, {
          path: `/subscription/subscription_plan/${id}/skip-summary/`,
          method: 'GET'
        })
      ]);
      if (deliveriesResult.status === 'rejected') throw deliveriesResult.reason;
      const summary = summaryResult.status === 'fulfilled' ? responseData(summaryResult.value) : {};
      const remainingSkips = firstFinite(
        summary.remaining,
        summary.skips_remaining,
        summary.remaining_skips,
        summary.available,
        summary.skips_available
      );
      const upcomingSkipLimit = remainingSkips === null
        ? 4
        : Math.max(0, Math.min(4, Math.floor(remainingSkips)));
      const deliveriesByDate = new Map();
      [
        ...responseList(deliveriesResult.value),
        ...(Array.isArray(summary.skipped_deliveries)
          ? summary.skipped_deliveries
              .filter((delivery) => delivery.can_unskip !== false)
              .map((delivery) => ({ ...delivery, is_skipped: true }))
          : []),
        ...(Array.isArray(summary.skipped_dates)
          ? summary.skipped_dates.map((entry) => ({
              ...(entry && typeof entry === 'object' ? entry : { delivery_date: entry }),
              is_skipped: true,
              skipped: true
            }))
          : [])
      ].forEach((delivery) => {
        const date = String(firstValue(delivery.delivery_date, delivery.date, delivery.scheduled_date, ''));
        if (!date) return;
        const previous = deliveriesByDate.get(date) || {};
        deliveriesByDate.set(date, {
          ...previous,
          ...delivery,
          is_skipped: Boolean(
            firstValue(
              delivery.is_skipped,
              delivery.skipped,
              previous.is_skipped,
              /skip/i.test(String(delivery.delivery_status || delivery.status || ''))
            )
          )
        });
      });
      const deliveries = Array.from(deliveriesByDate.values()).sort((a, b) =>
        String(firstValue(a.delivery_date, a.date, '')).localeCompare(
          String(firstValue(b.delivery_date, b.date, ''))
        )
      );
      const skippedDeliveries = deliveries.filter((delivery) => Boolean(firstValue(
        delivery.is_skipped,
        delivery.skipped,
        /skip/i.test(String(delivery.delivery_status || delivery.status || ''))
      )));
      const scheduledDeliveries = deliveries
        .filter((delivery) => !skippedDeliveries.includes(delivery))
        .slice(0, upcomingSkipLimit);
      const visibleDeliveries = [...skippedDeliveries, ...scheduledDeliveries].sort((a, b) =>
        String(firstValue(a.delivery_date, a.date, '')).localeCompare(
          String(firstValue(b.delivery_date, b.date, ''))
        )
      );
      const body = create('div');
      body.append(create('p', 'dialog-copy', remainingSkips === null
        ? 'Skip or restore an eligible upcoming delivery here. Showing the next four available dates; dates covered by vacation are managed from your vacation settings.'
        : `Skip or restore an eligible upcoming delivery here. Showing the next ${upcomingSkipLimit} available date${upcomingSkipLimit === 1 ? '' : 's'} based on your remaining skips; dates covered by vacation are managed from your vacation settings.`));
      if (Object.keys(summary).length) {
        const summaryBox = create('div', 'dialog-summary');
        [
          ['Skips available', firstValue(summary.remaining, summary.skips_remaining, summary.available, '—')],
          ['Skips used', firstValue(summary.used_this_month, summary.used, summary.skips_used, '—')]
        ].forEach(([label, value]) => {
          const row = create('div', 'dialog-summary-row');
          row.append(create('span', '', label), create('strong', '', value));
          summaryBox.append(row);
        });
        body.append(summaryBox);
      }
      if (!visibleDeliveries.length) {
        body.append(makeState('empty', 'No changeable dates right now.', 'Future delivery dates will appear here once they are within the allowed window.'));
      } else {
        const list = create('div', 'delivery-list');
        visibleDeliveries.forEach((delivery) => {
          const date = firstValue(delivery.delivery_date, delivery.date, delivery.scheduled_date);
          const skipped = Boolean(firstValue(
            delivery.is_skipped,
            delivery.skipped,
            /skip/i.test(String(delivery.delivery_status || delivery.status || ''))
          ));
          const vacation = skipped ? vacationCoveringDate(subscription, date) : null;
          const row = create('div', 'delivery-option');
          const copy = create('div');
          copy.append(create('p', '', formatDate(date)), create('span', '', vacation ? 'Paused by vacation' : skipped ? 'Currently skipped' : 'Scheduled delivery'));
          const action = vacation
            ? button('Edit pause dates', 'card-action', () => openVacationForm(null, vacation))
            : button(skipped ? 'Restore delivery' : 'Skip this date', `card-action${skipped ? '' : ' is-rust'}`, () => {
                confirmDeliveryChange(subscription, date, skipped);
              });
          row.append(copy, action);
          list.append(row);
        });
        body.append(list);
      }
      const scheduleHelp = create('div', 'schedule-change-help');
      const scheduleCopy = create('div');
      scheduleCopy.append(
        create('strong', '', 'Need a different delivery weekday or date?'),
        create('p', '', 'Choose a supported weekday and effective date. Existing deliveries before that date stay unchanged.')
      );
      scheduleHelp.append(scheduleCopy, button('Change schedule', 'card-action', () => openSubscriptionScheduleRequest(subscription)));
      body.append(scheduleHelp);
      elements.dialogBody.replaceChildren(body);
    } catch (error) {
      console.warn('Atulyash delivery schedule could not be loaded.', error);
      const body = create('div');
      body.append(makeState(
        'error',
        'Your schedule could not be opened right now.',
        'No delivery was changed. You can try again or send your preferred weekday and effective date to Atulyash care.'
      ));
      const actions = create('div', 'dialog-actions');
      actions.append(button('Try again', 'secondary-button', () => openManageDeliveries(subscription)));
      actions.append(button('Change schedule →', 'primary-button', () => openSubscriptionScheduleRequest(subscription)));
      body.append(actions);
      elements.dialogBody.replaceChildren(body);
    }
  }

  function openSubscriptionScheduleRequest(subscription) {
    const form = create('form', 'dialog-form');
    form.append(create('p', 'dialog-copy', 'Choose the weekday for future fresh batches and when the new rhythm should begin. Deliveries already scheduled before that date will not move.'));
    const fields = create('div', 'form-grid');
    const weekdayLabel = create('label', '', 'Preferred weekday');
    const weekday = create('select');
    const currentWeekday = String(firstValue(subscription.delivery_day, subscription.preferred_delivery_day, '')).toLowerCase();
    ['Sunday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach((day) => {
      const option = create('option', '', day);
      option.value = day;
      option.selected = day.toLowerCase() === currentWeekday;
      weekday.append(option);
    });
    weekdayLabel.append(weekday);
    const dateLabel = create('label', '', 'Effective from');
    const date = create('input');
    date.type = 'date';
    date.required = true;
    const earliest = new Date();
    earliest.setDate(earliest.getDate() + 1);
    const localEarliest = new Date(earliest.getTime() - (earliest.getTimezoneOffset() * 60000));
    date.min = localEarliest.toISOString().slice(0, 10);
    date.value = date.min;
    dateLabel.append(date);
    fields.append(weekdayLabel, dateLabel);
    const policy = create('div', 'confirmation-panel');
    policy.append(
      create('strong', '', 'Before you confirm'),
      create('p', '', 'Monday is unavailable. A minimum one-day lead time and the 6:20 PM IST cutoff apply. Your delivery route must also be active.')
    );
    const actions = create('div', 'dialog-actions');
    actions.append(button('Back', 'secondary-button', () => openManageDeliveries(subscription)));
    const submit = create('button', 'primary-button', 'Update schedule →');
    submit.type = 'submit';
    actions.append(submit);
    form.append(fields, policy, actions);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = subscriptionId(subscription);
      const payload = {
        id,
        subscriptionId: id,
        delivery_day: weekday.value,
        effective_from: date.value
      };
      setButtonBusy(submit, true, 'Updating…');
      try {
        const result = await apiCall('subscriptions', ['updateSchedule', 'changeSchedule'], payload, {
          path: `/subscription/subscription_plan/${id}/schedule/`,
          method: 'PATCH',
          body: {
            delivery_day: payload.delivery_day,
            effective_from: payload.effective_from
          }
        });
        const data = responseData(result);
        closeDialog();
        state.loaded.delete('subscriptions');
        await renderSubscriptions(true);
        const nextDate = firstValue(data.next_delivery_date, data.effective_from);
        showToast(nextDate
          ? `Weekly delivery moved to ${String(firstValue(data.confirmed_weekday, data.new_day, weekday.value))}. Next date: ${formatDate(nextDate)}.`
          : String(firstValue(data.message, 'Your weekly delivery schedule has been updated.'))
        );
      } catch (error) {
        showToast(friendlyError(error, 'The schedule could not be updated. No delivery was changed.'), 'error');
        setButtonBusy(submit, false);
      }
    });
    openDialog('Weekly plan', 'Change delivery schedule', form);
  }

  function confirmDeliveryChange(subscription, deliveryDate, currentlySkipped) {
    const id = subscriptionId(subscription);
    const body = create('div');
    const panel = create('div', 'confirmation-panel');
    panel.append(
      create('strong', '', currentlySkipped ? 'Restore this delivery?' : 'Skip this delivery?'),
      create('p', '', `${formatDate(deliveryDate)} will be ${currentlySkipped ? 'added back to' : 'removed from'} your current schedule.`)
    );
    const actions = create('div', 'dialog-actions');
    actions.append(button('Keep as it is', 'secondary-button', closeDialog));
    actions.append(button(currentlySkipped ? 'Restore delivery' : 'Yes, skip it', currentlySkipped ? 'primary-button' : 'danger-button', async (event) => {
      const control = event.currentTarget;
      setButtonBusy(control, true, 'Updating…');
      const payload = { id, subscriptionId: id, subPlanId: id, delivery_date: deliveryDate, deliveryDate };
      try {
        const result = await apiCall('subscriptions', currentlySkipped ? ['unskip', 'unskipDelivery'] : ['skip', 'skipDelivery'], payload, {
          path: `/subscription/subscription_plan/${id}/${currentlySkipped ? 'unskip' : 'skip'}/`,
          method: 'POST',
          form: { delivery_date: deliveryDate }
        });
        const data = responseData(result);
        const responseSource = [data, data?.subscription, data?.plan]
          .find((source) => source && typeof source === 'object') || data;
        const nextDeliveryDate = firstValue(
          responseSource?.next_delivery_date,
          responseSource?.next_available_delivery_date,
          data?.next_delivery_date,
          data?.next_available_delivery_date
        );
        const skippedDates = firstValue(responseSource?.skipped_dates, data?.skipped_dates);
        if (nextDeliveryDate) subscription.next_delivery_date = nextDeliveryDate;
        if (Array.isArray(skippedDates)) subscription.skipped_dates = skippedDates;
        closeDialog();
        state.loaded.delete('subscriptions');
        await renderSubscriptions(true);
        showToast(nextDeliveryDate
          ? `${currentlySkipped ? 'The delivery is back on your schedule' : 'That delivery has been skipped'}. Next delivery: ${formatDate(nextDeliveryDate)}.`
          : (currentlySkipped ? 'The delivery is back on your schedule.' : 'That delivery has been skipped.'));
      } catch (error) {
        showToast(friendlyError(error), 'error');
        setButtonBusy(control, false);
      }
    }));
    body.append(panel, actions);
    openDialog('Confirm schedule change', formatDate(deliveryDate), body);
  }

  function openVacationForm(subscription = null, vacation = null) {
    if (!state.subscriptions.length && !subscription) {
      openDialog('Vacation mode', 'No active plan', makeState('empty', 'A weekly plan is needed.', 'Vacation mode pauses deliveries from an active subscription.'));
      return;
    }
    const form = create('form', 'dialog-form');
    form.append(create('p', 'dialog-copy', 'Any scheduled delivery within these dates will move to the next weekly cycle after your vacation ends. Choose dates carefully.'));

    let subscriptionSelect;
    if (!vacation) {
      const subscriptionLabel = create('label', '', 'Subscription');
      subscriptionSelect = create('select');
      subscriptionSelect.required = true;
      state.subscriptions.forEach((item) => {
        const option = create('option', '', `${subscriptionName(item)} · ${subscriptionWeight(item)}`);
        option.value = String(subscriptionId(item));
        if (subscription && subscriptionId(item) === subscriptionId(subscription)) option.selected = true;
        subscriptionSelect.append(option);
      });
      subscriptionLabel.append(subscriptionSelect);
      form.append(subscriptionLabel);
    }

    const dates = create('div', 'form-grid');
    const startLabel = create('label', '', 'Start date');
    const start = create('input');
    start.type = 'date';
    start.required = true;
    const today = new Date();
    const localToday = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
    const savedStart = firstValue(vacation?.start_date, vacation?.pause_from);
    const savedEnd = firstValue(vacation?.end_date, vacation?.resume_at);
    const savedStartDate = String(savedStart || '').slice(0, 10);
    // An active vacation may have started already. Keep its saved start date
    // valid while editing so the browser does not silently block the submit
    // because the value is earlier than today's minimum.
    start.min = vacation && /^\d{4}-\d{2}-\d{2}$/.test(savedStartDate) && savedStartDate < localToday
      ? savedStartDate
      : localToday;
    start.value = savedStartDate;
    startLabel.append(start);
    const endLabel = create('label', '', 'End date');
    const end = create('input');
    end.type = 'date';
    end.required = true;
    end.min = start.value || start.min;
    end.value = savedEnd ? String(savedEnd).slice(0, 10) : '';
    endLabel.append(end);
    start.addEventListener('change', () => {
      end.min = start.value || start.min;
      if (end.value && end.value < end.min) end.value = end.min;
      updateVacationPreview();
    });
    end.addEventListener('change', updateVacationPreview);
    dates.append(startLabel, endLabel);

    const vacationPreview = create('p', 'vacation-preview');
    const previewSubscription = () => {
      if (subscription) return subscription;
      const relation = firstValue(
        vacation?.subscription,
        vacation?.subscription_id,
        vacation?.subscription_plan,
        vacation?.subscription_plan_id,
        vacation?.plan_id
      );
      return state.subscriptions.find((item) => relation != null && String(idOf(relation)) === String(subscriptionId(item))) || state.subscriptions[0];
    };
    function updateVacationPreview() {
      const selected = previewSubscription();
      if (!start.value || !end.value || !selected) {
        vacationPreview.textContent = 'Your next delivery will be confirmed after the pause is saved.';
        return;
      }
      vacationPreview.textContent = 'The live service will recalculate skipped dates and your next delivery after these dates are saved.';
    }
    subscriptionSelect?.addEventListener('change', updateVacationPreview);
    updateVacationPreview();

    const actions = create('div', 'dialog-actions');
    actions.append(button('Cancel', 'secondary-button', closeDialog));
    const submit = create('button', 'primary-button', vacation ? 'Update vacation →' : 'Pause these dates →');
    submit.type = 'submit';
    actions.append(submit);
    form.append(dates, vacationPreview, actions);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (end.value < start.value) return showToast('The end date must be after the start date.', 'error');
      setButtonBusy(submit, true, 'Saving…');
      const vacationId = firstValue(vacation?.id, vacation?.vacation_id, vacation?.pk);
      if (vacation && vacationId == null) {
        showToast('This pause could not be identified. Please refresh and try again.', 'error');
        setButtonBusy(submit, false);
        return;
      }
      const selectedSubscription = previewSubscription();
      const selectedSubscriptionId = subscriptionId(selectedSubscription);
      const vacationSubscription = vacation
        ? firstValue(
            vacation.subscription,
            vacation.subscription_id,
            vacation.subscription_plan,
            vacation.subscription_plan_id,
            vacation.plan_id,
            selectedSubscriptionId
          )
        : subscriptionSelect?.value;
      if (!vacationSubscription) {
        showToast('This pause is not linked to an active weekly plan. Please refresh and try again.', 'error');
        setButtonBusy(submit, false);
        return;
      }
      const payload = {
        id: vacationId,
        vacationId,
        subscription: vacationSubscription,
        subscriptionId: vacationSubscription,
        start_date: start.value,
        end_date: end.value
      };
      try {
        const result = await apiCall('subscriptions', vacation ? ['updateVacation', 'patchCustomerVacation'] : ['createVacation', 'setCustomerVacation'], payload, {
          path: vacation ? `/subscription/vacation/${vacationId}/` : '/subscription/vacation/',
          method: vacation ? 'PATCH' : 'POST',
          form: {
            ...(vacation ? {} : { subscription: payload.subscription }),
            start_date: payload.start_date,
            end_date: payload.end_date
          }
        });
        const data = responseData(result);
        const responseSource = [data, data?.subscription, data?.plan]
          .find((source) => source && typeof source === 'object') || data;
        const nextDeliveryDate = firstValue(
          responseSource?.next_delivery_date,
          responseSource?.next_available_delivery_date,
          data?.next_delivery_date,
          data?.next_available_delivery_date
        );
        const skippedDates = firstValue(
          responseSource?.skipped_dates,
          data?.skipped_dates
        );
        if (selectedSubscription && nextDeliveryDate) selectedSubscription.next_delivery_date = nextDeliveryDate;
        if (selectedSubscription && Array.isArray(skippedDates)) selectedSubscription.skipped_dates = skippedDates;
        closeDialog();
        state.loaded.delete('subscriptions');
        await renderSubscriptions(true);
        showToast(nextDeliveryDate
          ? `${vacation ? 'Vacation dates updated' : 'Vacation mode scheduled'}. Next delivery: ${formatDate(nextDeliveryDate)}.`
          : (vacation ? 'Your vacation dates have been updated.' : 'Vacation mode has been scheduled.'));
      } catch (error) {
        showToast(friendlyError(error), 'error');
        setButtonBusy(submit, false);
      }
    });
    openDialog('Vacation mode', vacation ? 'Edit pause dates' : 'Pause deliveries', form);
  }

  function confirmEndVacation(vacation) {
    const body = create('div');
    const panel = create('div', 'confirmation-panel');
    panel.append(
      create('strong', '', 'End vacation mode early?'),
      create('p', '', 'Your weekly deliveries will resume from the next available cycle.')
    );
    const actions = create('div', 'dialog-actions');
    actions.append(button('Keep vacation', 'secondary-button', closeDialog));
    actions.append(button('End vacation', 'danger-button', async (event) => {
      const control = event.currentTarget;
      setButtonBusy(control, true, 'Ending…');
      const id = firstValue(vacation.id, vacation.vacation_id);
      try {
        await apiCall('subscriptions', ['endVacation', 'endCustomerVacation'], { id, vacationId: id }, {
          path: `/subscription/vacation/${id}/end_vacation/`,
          method: 'POST',
          form: {}
        });
        closeDialog();
        state.loaded.delete('subscriptions');
        showToast('Vacation mode has ended.');
        renderSubscriptions(true);
      } catch (error) {
        showToast(friendlyError(error), 'error');
        setButtonBusy(control, false);
      }
    }));
    body.append(panel, actions);
    openDialog('Vacation mode', 'Resume deliveries', body);
  }

  async function openCancelSubscription(subscription) {
    const loading = makeState('loading', 'Preparing cancellation options.', 'This will take only a moment…');
    openDialog('Subscription control', 'Cancel weekly plan', loading);
    try {
      const result = await apiCall('subscriptions', ['cancellationReasons', 'getCancellationReasons'], undefined, {
        path: '/subscription/cancellation_reasons/',
        method: 'GET'
      });
      const reasons = responseList(result);
      const form = create('form', 'dialog-form');
      const panel = create('div', 'confirmation-panel');
      panel.append(
        create('strong', '', `Cancel ${subscriptionName(subscription)}?`),
        create('p', '', 'This stops future scheduled deliveries. This action may not be reversible from your account.')
      );
      const reasonLabel = create('label', '', 'Reason for cancellation');
      const reasonSelect = create('select');
      reasonSelect.required = reasons.length > 0;
      const placeholder = create('option', '', 'Choose a reason');
      placeholder.value = '';
      reasonSelect.append(placeholder);
      reasons.forEach((reason) => {
        const option = create('option', '', firstValue(reason.reason_text, reason.name, reason.reason, reason.title, 'Other'));
        option.value = String(firstValue(reason.id, reason.pk, option.textContent));
        reasonSelect.append(option);
      });
      if (!reasons.length) {
        placeholder.textContent = 'No published reason — add a note';
        reasonSelect.disabled = true;
      }
      reasonLabel.append(reasonSelect);
      const detailLabel = create('label', '', 'Anything you would like us to know?');
      const detail = create('textarea');
      detail.maxLength = 500;
      detail.placeholder = reasons.length ? 'Optional note' : 'Please tell us why you are cancelling';
      detail.required = !reasons.length;
      detailLabel.append(detail);
      const confirmLabel = create('label', 'check-control');
      const confirm = create('input');
      confirm.type = 'checkbox';
      confirm.required = true;
      confirmLabel.append(confirm, document.createTextNode(' I understand future deliveries will stop.'));
      const actions = create('div', 'dialog-actions');
      actions.append(button('Keep my plan', 'secondary-button', closeDialog));
      const submit = create('button', 'danger-button', 'Cancel subscription');
      submit.type = 'submit';
      actions.append(submit);
      form.append(panel, reasonLabel, detailLabel, confirmLabel, actions);
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        setButtonBusy(submit, true, 'Cancelling…');
        const id = subscriptionId(subscription);
        const payload = {
          id,
          subscriptionId: id,
          subId: id,
          cancellation_reason_id: reasonSelect.value || undefined,
          reasonId: reasonSelect.value || undefined,
          cancellation_detail: detail.value.trim(),
          detail: detail.value.trim()
        };
        try {
          await apiCall('subscriptions', ['cancel'], payload, {
            path: `/subscription/subscription_plan/${id}/cancel/`,
            method: 'POST',
            form: {
              ...(reasonSelect.value ? { cancellation_reason_id: reasonSelect.value } : {}),
              cancellation_detail: detail.value.trim()
            }
          });
          closeDialog();
          state.loaded.delete('subscriptions');
          showToast('Your subscription has been cancelled.');
          renderSubscriptions(true);
        } catch (error) {
          showToast(friendlyError(error), 'error');
          setButtonBusy(submit, false);
        }
      });
      elements.dialogBody.replaceChildren(form);
    } catch (error) {
      elements.dialogBody.replaceChildren(makeState('error', 'Cancellation options are unavailable.', friendlyError(error), () => openCancelSubscription(subscription)));
    }
  }

  async function renderAddresses(force = false) {
    updateDeliveryHomeCount();
    renderLoading(elements.addressesList, 'Gathering your saved delivery places…');
    try {
      const addresses = await ensureAddresses(force);
      updateDeliveryHomeCount(addresses.length);
      if (!addresses.length) {
        renderEmpty(
          elements.addressesList,
          'No saved address yet.',
          'Add the place where your fresh batch should arrive.',
          button('Add an address', 'primary-button', () => openAddressForm())
        );
        return;
      }
      const fragment = document.createDocumentFragment();
      addresses.forEach((address) => {
        const type = String(firstValue(address.address_type, address.type, 'Saved address'));
        const receiver = String(firstValue(
          address.receiver_name,
          address.tower_wing,
          address.building,
          address.house_name,
          address.house_number,
          'Delivery address'
        ));
        const isDefault = addressIsDefault(address);
        const card = create('article', `address-card${isDefault ? ' is-default' : ''}`);

        const marker = create('span', 'address-marker', type.slice(0, 1).toUpperCase());
        marker.setAttribute('aria-hidden', 'true');

        const badges = create('div', 'address-card-badges');
        badges.append(create('span', 'address-type', type));
        if (isDefault) badges.append(create('span', 'address-default-badge', 'Default for delivery'));

        const heading = create('div', 'address-card-heading');
        heading.append(badges, create('h3', '', receiver));

        const copy = create('div', 'address-card-copy');
        copy.append(create('p', 'address-copy', addressText(address)));
        const details = create('dl', 'address-card-details');
        const phone = addressPhone(address);
        const pincode = addressPincode(address);
        if (phone) details.append(create('dt', '', 'Delivery mobile'), create('dd', '', phone));
        if (pincode) details.append(create('dt', '', 'PIN code'), create('dd', '', pincode));
        copy.append(details);

        const actions = create('div', 'address-card-actions');
        actions.append(
          create('small', '', 'Choose this home when reviewing your order.'),
          button('Edit delivery details', 'card-action', () => openAddressForm(address))
        );
        card.append(marker, heading, copy, actions);
        fragment.append(card);
      });
      elements.addressesList.replaceChildren(fragment);
    } catch (error) {
      updateDeliveryHomeCount();
      if (isUnauthorized(error)) return enterAuth('Your session has ended. Please sign in again.');
      renderError(elements.addressesList, error, () => renderAddresses(true));
    }
  }

  function openAddressForm(address = null) {
    const editing = Boolean(address);
    const form = create('form', 'dialog-form');
    const fields = create('div', 'form-grid');
    const mapPicker = create('section', 'address-map-picker');
    mapPicker.setAttribute('aria-labelledby', 'addressMapPickerTitle');
    const mapPickerHeader = create('div', 'address-map-picker-header');
    const mapPickerTitle = create('div');
    mapPickerTitle.append(
      create('span', 'address-map-kicker', 'Pin your doorstep'),
      create('strong', '', 'Where should we deliver?')
    );
    mapPickerTitle.querySelector('strong').id = 'addressMapPickerTitle';
    const mapLocationButton = create('button', 'address-map-location-button', 'Use my current location');
    mapLocationButton.type = 'button';
    mapPickerHeader.append(mapPickerTitle, mapLocationButton);
    const mapStatus = create('p', 'address-map-status', 'Requesting your location…');
    mapStatus.setAttribute('role', 'status');
    mapStatus.setAttribute('aria-live', 'polite');
    const mapCanvas = create('div', 'address-map-canvas');
    mapCanvas.setAttribute('role', 'application');
    mapCanvas.setAttribute('aria-label', 'Map location picker. Pan the map underneath the fixed pin to choose a delivery location.');
    const mapCenterPin = create('span', 'address-map-center-pin');
    mapCenterPin.setAttribute('aria-hidden', 'true');
    const mapAddress = create('small', 'address-map-selected-address', 'Move the map so the pin sits on your doorstep.');
    mapPicker.append(mapPickerHeader, mapStatus, mapCanvas, mapAddress);
    const definitions = [
      ['receiver_name', 'Receiver name', 'text', firstValue(address?.receiver_name, displayName() === 'Atulyash family' ? '' : displayName())],
      ['address_phone', 'Delivery mobile', 'tel', firstValue(address?.address_phone, state.mobile)],
      ['house_name', 'House / flat number', 'text', firstValue(address?.house_name, address?.house_number, address?.flat_number, '')],
      ['tower_wing', 'Building / tower / wing', 'text', firstValue(address?.tower_wing, address?.building, address?.address_line_1, '')],
      ['landmark', 'Landmark', 'text', firstValue(address?.landmark, '')],
      ['city', 'City (from PIN code)', 'text', firstValue(address?.city, address?.locality, '')],
      ['state', 'State', 'text', firstValue(address?.state, '')],
      ['pincode', 'Pincode', 'text', firstValue(address?.pincode?.pincode, address?.pincode?.code, address?.pincode, address?.postal_code, '')]
    ];
    definitions.forEach(([name, labelText, type, value]) => {
      const label = create('label', '', labelText);
      const input = create('input');
      input.name = name;
      input.type = type;
      input.value = name === 'address_phone'
        ? String(value || '').replace(/\D/g, '').slice(-10)
        : String(value || '');
      input.required = name !== 'landmark';
      if (name === 'pincode') {
        input.inputMode = 'numeric';
        input.pattern = '[0-9]{6}';
        input.maxLength = 6;
      }
      if (name === 'address_phone') {
        input.inputMode = 'numeric';
        input.pattern = '[0-9]{10}';
        input.maxLength = 10;
      }
      if (name === 'receiver_name') input.maxLength = 50;
      if (name === 'tower_wing') input.maxLength = 50;
      if (['house_name', 'landmark'].includes(name)) input.maxLength = 255;
      if (['city', 'state'].includes(name)) input.maxLength = 100;
      if (name === 'city') {
        input.readOnly = true;
        input.setAttribute('aria-readonly', 'true');
        input.title = 'City is filled automatically from your PIN code';
      }
      label.append(input);
      fields.append(label);
    });
    const pincodeInput = fields.querySelector('input[name="pincode"]');
    const cityInput = fields.querySelector('input[name="city"]');
    const stateInput = fields.querySelector('input[name="state"]');
    const areaLabel = create('label', '', 'Area');
    const areaSelect = create('select');
    areaSelect.name = 'area';
    areaSelect.required = true;
    areaSelect.disabled = true;
    areaLabel.hidden = true;
    areaLabel.inert = true;
    areaLabel.append(areaSelect);
    fields.append(areaLabel);
    const initialArea = String(firstValue(address?.area, address?.locality, ''));
    const serviceabilityNotice = create('div', 'address-serviceability-notice');
    serviceabilityNotice.hidden = true;
    serviceabilityNotice.setAttribute('role', 'alert');
    const serviceabilityTitle = create('strong');
    const serviceabilityCopy = create('small');
    const serviceabilityContent = create('div', 'address-serviceability-copy');
    serviceabilityContent.append(serviceabilityTitle, serviceabilityCopy);
    const serviceabilityMark = create('span', 'address-serviceability-mark', '!');
    serviceabilityNotice.append(serviceabilityMark, serviceabilityContent);
    fields.append(serviceabilityNotice);

    const coordinateFrom = (...values) => {
      for (const value of values) {
        if (value === undefined || value === null || value === '') continue;
        const parsed = Number(value);
        if (Number.isFinite(parsed)) return parsed;
      }
      return null;
    };
    const existingLatitude = coordinateFrom(
      address?.latitude,
      address?.lat,
      address?.location?.latitude,
      address?.location?.lat,
      address?.coordinates?.latitude,
      address?.coordinates?.lat
    );
    const existingLongitude = coordinateFrom(
      address?.longitude,
      address?.lng,
      address?.location?.longitude,
      address?.location?.lng,
      address?.coordinates?.longitude,
      address?.coordinates?.lng
    );
    const hasExistingCoordinates = Number.isFinite(existingLatitude) && Number.isFinite(existingLongitude)
      && Math.abs(existingLatitude) <= 90 && Math.abs(existingLongitude) <= 180;
    const defaultMapCenter = { lat: 28.6139, lng: 77.2090 };
    let addressMap = null;
    let mapReverseRequest = 0;
    let mapReverseTimer = null;
    let currentLocationRequest = null;
    let selectedMapPoint = hasExistingCoordinates
      ? { lat: existingLatitude, lng: existingLongitude }
      : null;

    const setMapStatus = (message, stateName = 'idle') => {
      mapStatus.textContent = message;
      mapPicker.dataset.state = stateName;
    };

    const requestCurrentLocation = () => {
      if (!navigator.geolocation) return Promise.resolve(null);
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({
            lat: Number(position.coords.latitude),
            lng: Number(position.coords.longitude)
          }),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 }
        );
      });
    };

    const applyMapResult = async (result) => {
      if (!result) return;
      if (result.formattedAddress) mapAddress.textContent = result.formattedAddress;
      if (result.city && cityInput) cityInput.value = result.city;
      if (result.state && stateInput) stateInput.value = result.state;

      const pincode = String(result.pincode || '').replace(/\D/g, '').slice(0, 6);
      if (!/^\d{6}$/.test(pincode)) {
        setMapStatus('Location found. Move the pin to a serviceable PIN code.', 'warning');
        return;
      }

      pincodeInput.value = pincode;
      clearServiceabilityError();
      let area = renderGoogleAreas(result);
      if (!area) {
        await lookupAreaFromPincode();
        area = areaSelect.value;
      }
      if (!area) {
        setMapStatus('Location found. Choose the delivery area below.', 'warning');
        return;
      }

      try {
        const serviceability = await checkLiveServiceability(pincode, area);
        if (serviceability) setMapStatus('Location selected. Review the address fields below.', 'success');
      } catch (_error) {
        setMapStatus('Location found. Confirm the address fields below.', 'warning');
      }
    };

    const reverseGeocodeMapPoint = async (point) => {
      if (!GOOGLE_AREA_LOOKUP?.reverseGeocodeCoordinates) {
        setMapStatus('Map lookup is not configured. Enter the address below.', 'error');
        return;
      }
      const request = ++mapReverseRequest;
      selectedMapPoint = point;
      setMapStatus('Reading this location…', 'checking');
      try {
        const result = await GOOGLE_AREA_LOOKUP.reverseGeocodeCoordinates(point.lat, point.lng);
        if (request !== mapReverseRequest) return;
        await applyMapResult(result);
      } catch (error) {
        if (request !== mapReverseRequest) return;
        setMapStatus(friendlyError(error, 'Could not read this location. Drag the pin and try again.'), 'error');
      }
    };

    const scheduleMapReverseGeocode = () => {
      window.clearTimeout(mapReverseTimer);
      mapReverseTimer = window.setTimeout(() => {
        const center = addressMap?.getCenter?.();
        if (center) void reverseGeocodeMapPoint({ lat: center.lat(), lng: center.lng() });
      }, 350);
    };

    const initializeAddressMap = async (locationPromise) => {
      if (!GOOGLE_AREA_LOOKUP?.loadMaps) {
        setMapStatus('Map service is unavailable. Enter your address below.', 'error');
        return;
      }
      try {
        const maps = await GOOGLE_AREA_LOOKUP.loadMaps();
        if (typeof maps.importLibrary === 'function') await maps.importLibrary('maps');
        const center = hasExistingCoordinates ? selectedMapPoint : defaultMapCenter;
        addressMap = new maps.Map(mapCanvas, {
          center,
          zoom: hasExistingCoordinates ? 16 : 5,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy'
        });
        mapCanvas.append(mapCenterPin);
        addressMap.addListener('dragend', scheduleMapReverseGeocode);

        if (hasExistingCoordinates) {
          setMapStatus('Move the map so the pin sits on your doorstep.', 'idle');
          return;
        }

        setMapStatus('Requesting your location…', 'checking');
        const location = await locationPromise;
        if (location && Number.isFinite(location.lat) && Number.isFinite(location.lng)) {
          addressMap.setCenter(location);
          addressMap.setZoom(16);
          await reverseGeocodeMapPoint(location);
        } else {
          addressMap.setCenter(defaultMapCenter);
          addressMap.setZoom(5);
          setMapStatus('Location access was not granted. Drag the map or use the button to choose a location.', 'warning');
        }
      } catch (error) {
        setMapStatus(friendlyError(error, 'Map could not be loaded. Enter your address below.'), 'error');
      }
    };

    mapLocationButton.addEventListener('click', async () => {
      setMapStatus('Requesting your location…', 'checking');
      currentLocationRequest = requestCurrentLocation();
      const location = await currentLocationRequest;
      if (!location) {
        setMapStatus('Location access was not granted. Please allow it and try again.', 'warning');
        return;
      }
      if (!addressMap) return;
      addressMap.setCenter(location);
      addressMap.setZoom(16);
      void reverseGeocodeMapPoint(location);
    });

    let areaLookupRequest = 0;
    let verifiedPincode = '';
    const showAreaLookupNotice = (title, message, status = 'error') => {
      serviceabilityTitle.textContent = title;
      serviceabilityCopy.textContent = message;
      serviceabilityNotice.dataset.state = status;
      serviceabilityMark.textContent = status === 'success' ? '✓' : status === 'checking' ? '·' : '!';
      serviceabilityNotice.hidden = false;
    };
    const resetAreaOptions = (message = 'Enter a six-digit PIN code first') => {
      const placeholder = create('option', '', message);
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      areaSelect.replaceChildren(placeholder);
      areaSelect.disabled = true;
      areaSelect.value = '';
      areaLabel.hidden = true;
      areaLabel.inert = true;
    };
    const renderGoogleAreas = (result) => {
      const rawAreas = result?.areas || result?.available_areas || result?.serviceable_areas || result?.area_options || [];
      const areas = [...new Set((Array.isArray(rawAreas) ? rawAreas : []).map((area) => {
        if (area && typeof area === 'object') return firstValue(area.name, area.area, area.label, area.locality, '');
        return String(area || '').trim();
      }).map((area) => String(area || '').trim()).filter(Boolean))];
      if (!areas.length) {
        resetAreaOptions('No delivery areas returned for this PIN');
        return '';
      }
      const current = areaSelect.value;
      const selected = areas.includes(current)
        ? current
        : (areas.includes(initialArea) ? initialArea : (areas.includes(result?.selectedArea) ? result.selectedArea : areas[0]));
      const options = areas.map((area) => create('option', '', area));
      options.forEach((option) => { option.value = option.textContent; });
      areaSelect.replaceChildren(...options);
      areaSelect.disabled = false;
      areaSelect.value = selected;
      areaLabel.hidden = false;
      areaLabel.inert = false;
      if (result?.city && cityInput) cityInput.value = result.city;
      if (result?.state && stateInput) stateInput.value = result.state;
      return selected;
    };
    const clearServiceabilityError = () => {
      if (!pincodeInput) return;
      verifiedPincode = '';
      pincodeInput.removeAttribute('aria-invalid');
      pincodeInput.setCustomValidity('');
      serviceabilityNotice.hidden = true;
    };
    const checkLiveServiceability = async (pincode, area = '') => {
      showAreaLookupNotice('Checking delivery coverage', `Confirming live Atulyash service for PIN ${pincode}${area ? ` and ${area}` : ''}…`, 'checking');
      const query = { pincode, ...(area ? { area } : {}) };
      const result = await apiCall('pincodes', ['serviceability'], { pincode, area }, {
        path: '/pincodes/pincode/serviceability/',
        method: 'GET',
        query,
        auth: false
      });
      const data = responseData(result);
      if (data.serviceable !== true) {
        verifiedPincode = '';
        resetAreaOptions('Delivery is not available for this PIN');
        showAreaLookupNotice(
          'This PIN code is not serviceable yet',
          `Atulyash does not currently deliver to ${pincode}. Please use another delivery address.`
        );
        pincodeInput?.setAttribute('aria-invalid', 'true');
        return null;
      }
      verifiedPincode = `${pincode}|${area}`;
      if (data.city && cityInput) cityInput.value = data.city;
      if (data.state && stateInput) stateInput.value = data.state;
      showAreaLookupNotice(
        'Fresh-batch delivery is available',
        `${data.city || 'This area'}, ${pincode} is served by Atulyash. Choose the locality below to complete the address.`,
        'success'
      );
      return data;
    };
    const lookupAreaFromPincode = async () => {
      const pincode = String(pincodeInput?.value || '').replace(/\D/g, '').slice(0, 6);
      if (pincodeInput) pincodeInput.value = pincode;
      const request = ++areaLookupRequest;
      if (!/^\d{6}$/.test(pincode)) {
        resetAreaOptions();
        return;
      }
      const loading = create('option', '', 'Finding your area…');
      loading.value = '';
      loading.disabled = true;
      loading.selected = true;
      areaSelect.replaceChildren(loading);
      areaSelect.disabled = true;
      areaLabel.hidden = false;
      areaLabel.inert = false;
      try {
        const serviceability = await checkLiveServiceability(pincode);
        if (request !== areaLookupRequest || pincode !== String(pincodeInput?.value || '')) return;
        if (!serviceability) {
          resetAreaOptions('Delivery is not available for this PIN');
          return;
        }
        let result = serviceability;
        const returnedAreas = result?.areas || result?.available_areas || result?.serviceable_areas || result?.area_options;
        if (!Array.isArray(returnedAreas) || !returnedAreas.length) {
          try {
            const areaResponse = await apiCall('pincodes', ['areas'], { pincode }, {
              path: '/pincodes/area/',
              method: 'GET',
              query: { pincode },
              auth: false
            });
            const areaData = responseData(areaResponse);
            result = { ...result, areas: areaData?.areas || areaData?.results || areaData?.data || areaData };
          } catch (_areaError) {
            // The serviceability response remains authoritative if the area list endpoint is unavailable.
          }
        }
        if (request !== areaLookupRequest || pincode !== String(pincodeInput?.value || '')) return;
        const area = renderGoogleAreas(result);
        if (!area) throw new Error('The service did not return any areas for this PIN code.');
        showAreaLookupNotice(
          'Fresh-batch delivery is available',
          `${area}, ${pincode} is inside the current Atulyash delivery area.`,
          'success'
        );
      } catch (error) {
        if (request !== areaLookupRequest) return;
        verifiedPincode = '';
        resetAreaOptions('Area could not be identified');
        showAreaLookupNotice('Address could not be verified', friendlyError(error, 'Please check the PIN code and try again.'));
      }
    };
    if (/^\d{6}$/.test(String(pincodeInput?.value || ''))) {
      if (initialArea) {
        renderGoogleAreas({ areas: [initialArea], selectedArea: initialArea });
      }
      void lookupAreaFromPincode();
    } else {
      resetAreaOptions();
    }
    pincodeInput?.addEventListener('input', () => {
      clearServiceabilityError();
      // A city from the previous PIN must never be submitted with this one.
      if (cityInput) cityInput.value = '';
      if (stateInput) stateInput.value = '';
      // Clear areas returned for the previous PIN before starting a new lookup.
      resetAreaOptions();
      void lookupAreaFromPincode();
    });

    const typeLabel = create('label', '', 'Address type');
    const type = create('select');
    type.name = 'address_type';
    [
      ['HOME', 'Home'],
      ['WORK', 'Work'],
      ['OTHER', 'Other']
    ].forEach(([value, label]) => {
      const option = create('option', '', label);
      option.value = value;
      option.selected = value === String(firstValue(address?.address_type, 'HOME')).toUpperCase();
      type.append(option);
    });
    typeLabel.append(type);
    form.append(mapPicker, fields, typeLabel);
    const actions = create('div', 'dialog-actions');
    actions.append(button('Cancel', 'secondary-button', closeDialog));
    const submit = create('button', 'primary-button', editing ? 'Save changes →' : 'Save address →');
    submit.type = 'submit';
    actions.append(submit);
    form.append(actions);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setButtonBusy(submit, true, 'Saving…');
      try {
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());
        const normalizedPincode = String(payload.pincode || '').replace(/\D/g, '').slice(0, 6);
        const selectedArea = String(payload.area || '').trim();
        if (verifiedPincode !== `${normalizedPincode}|${selectedArea}`) {
          const serviceability = await checkLiveServiceability(normalizedPincode, selectedArea);
          if (!serviceability) {
            pincodeInput?.focus({ preventScroll: true });
            setButtonBusy(submit, false);
            return;
          }
        }
        if (!selectedArea) {
          showAreaLookupNotice('Area needed', 'Wait for Atulyash to return the available areas for this PIN code, then try again.');
          areaSelect.focus({ preventScroll: true });
          setButtonBusy(submit, false);
          return;
        }
        const activeSession = methodFrom('auth', ['getSession'])?.() || methodFrom(null, ['getSession'])?.() || {};
        payload.customer = firstValue(state.customerId, activeSession.customerId, activeSession.customer_id);
        if (!payload.customer) {
          throw new Error('Your customer profile is not available in this session. Please sign in again.');
        }
        payload.country = 'IN';
        payload.full_address = [
          payload.house_name,
          payload.tower_wing,
          payload.landmark,
          payload.area,
          payload.city,
          payload.state,
          payload.pincode
        ].filter(Boolean).join(', ');
        const id = addressId(address);
        if (id) {
          payload.id = id;
          payload.addressId = id;
        }
        await apiCall('addresses', editing ? ['update', 'patchCustomerAddress'] : ['create', 'setCustomerAddress'], payload, {
          path: editing ? `/customers/customer-addresses/${id}/` : '/customers/customer-addresses/',
          method: editing ? 'PATCH' : 'POST',
          form: payload
        });
        closeDialog();
        state.loaded.delete('addresses');
        showToast(editing ? 'Your address has been updated.' : 'Your address has been saved.');
        if (state.activeView === 'addresses') renderAddresses(true);
      } catch (error) {
        const message = friendlyError(error);
        const pincodeError = /pin\s*code|pincode|serviceable/i.test(message);
        if (pincodeError && pincodeInput) {
          const pin = String(new FormData(form).get('pincode') || '').replace(/\D/g, '').slice(0, 6);
          serviceabilityTitle.textContent = 'This PIN code is not serviceable yet';
          serviceabilityCopy.textContent = pin
            ? `Atulyash does not currently deliver to ${pin}. Please use a delivery address in a serviceable area.`
            : 'Atulyash does not currently deliver to this address. Please use a serviceable PIN code.';
          serviceabilityNotice.hidden = false;
          pincodeInput.setAttribute('aria-invalid', 'true');
          pincodeInput.setCustomValidity(serviceabilityCopy.textContent);
          pincodeInput.focus({ preventScroll: true });
          pincodeInput.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        } else {
          showToast(message, 'error');
        }
        setButtonBusy(submit, false);
      }
    });
    currentLocationRequest = (!editing && !hasExistingCoordinates)
      ? requestCurrentLocation()
      : Promise.resolve(null);
    openDialog('Delivery address', editing ? 'Edit saved address' : 'Add an address', form);
    window.setTimeout(() => void initializeAddressMap(currentLocationRequest), 0);
  }

  async function loadWallet(force = false) {
    if (!force && state.loaded.has('wallet')) return state.wallet;
    const [walletResult, transactionsResult, optionsResult] = await Promise.allSettled([
      apiCall('misc', ['wallet', 'getCustomerWallet'], { id: state.customerId, customerId: state.customerId }, {
        path: ({ id, customerId }) => (id || customerId) ? `/customers/customer-wallet/${id || customerId}/` : null,
        method: 'GET'
      }),
      apiCall('misc', ['walletTransactions', 'getWalletTransactions'], { page: 1 }, {
        path: '/orders/wallet/',
        method: 'GET',
        query: { page: 1 }
      }),
      apiCall('misc', ['rechargeOptions', 'getRechargeOptions'], {}, {
        path: '/customers/customer-wallet/recharge/options/',
        method: 'GET',
        query: {}
      })
    ]);
    if (walletResult.status === 'rejected') throw walletResult.reason;
    state.wallet = responseData(walletResult.value);
    state.walletTransactions = transactionsResult.status === 'fulfilled' ? responseList(transactionsResult.value) : [];
    state.rechargeOptionsData = optionsResult.status === 'fulfilled' ? responseList(optionsResult.value) : [];
    state.loaded.add('wallet');
    return state.wallet;
  }

  function walletBalanceValue(wallet) {
    return firstValue(
      wallet?.current_balance,
      wallet?.balance,
      wallet?.available_balance,
      wallet?.wallet_balance,
      wallet?.amount,
      0
    );
  }

  function renderWalletTransactions() {
    const transactions = state.walletTransactions || [];
    if (!transactions.length) {
      renderEmpty(elements.walletTransactions, 'No wallet activity yet.', 'Recharges, payments, refunds and credits will appear here.');
      return;
    }
    const fragment = document.createDocumentFragment();
    let hasPendingRecharge = false;
    transactions.forEach((transaction) => {
      const amount = numberFrom(firstValue(transaction.amount, transaction.transaction_amount, transaction.value));
      const type = String(firstValue(transaction.transaction_type, transaction.type, transaction.entry_type, 'Transaction'));
      const statusValue = firstValue(
        transaction.status,
        transaction.payment_status,
        transaction.transaction_status,
        transaction.state,
        ''
      );
      const status = ['undefined', 'null'].includes(String(statusValue).toLowerCase()) ? '' : String(statusValue || '');
      const referenceValue = firstValue(transaction.reference, '');
      const reference = ['undefined', 'null'].includes(String(referenceValue).toLowerCase()) ? '' : String(referenceValue || '');
      const title = String(firstValue(transaction.description, transaction.title, type));
      // A pending recharge is an initiated payment, not a wallet credit. Keep it
      // visually neutral so customers do not mistake it for available balance.
      const pendingDescriptor = `${status} ${reference} ${type} ${title}`;
      const isPending = /pending|initiated|created|processing|awaiting|in[ -]?progress/i.test(pendingDescriptor);
      const debit = !isPending && (/debit|payment|purchase|spent/i.test(type) || amount < 0);
      if (isPending && /recharge/i.test(`${type} ${title}`)) hasPendingRecharge = true;
      const row = create('div', `transaction-row${isPending ? ' is-pending' : ''}`);
      row.append(create('span', 'transaction-icon', isPending ? '…' : debit ? '−' : '+'));
      const copy = create('div');
      const displayTitle = isPending && /recharge/i.test(title)
        ? 'Wallet recharge awaiting confirmation'
        : title;
      const displayStatus = isPending
        ? 'Payment initiated · pending confirmation'
        : firstValue(reference, status, 'Recorded');
      copy.append(
        create('h3', '', displayTitle),
        create('p', '', `${formatDate(firstValue(transaction.created_at, transaction.date, transaction.created), true)} · ${displayStatus}`)
      );
      const amountText = create(
        'strong',
        `transaction-amount${debit ? ' is-debit' : isPending ? ' is-pending' : ''}`,
        isPending ? `${formatMoney(Math.abs(amount))} pending` : `${debit ? '−' : '+'}${formatMoney(Math.abs(amount))}`
      );
      row.append(copy, amountText);
      fragment.append(row);
    });
    if (hasPendingRecharge) {
      const note = create('p', 'wallet-pending-note');
      note.append(
        create('strong', '', 'Pending recharges are not credited yet.'),
        document.createTextNode(' Available balance updates only after Razorpay payment verification succeeds.')
      );
      fragment.append(note);
    }
    elements.walletTransactions.replaceChildren(fragment);
  }

  async function renderWallet(force = false) {
    elements.walletBalance.textContent = '₹—';
    renderLoading(elements.walletTransactions, 'Preparing your wallet activity…');
    try {
      const wallet = await loadWallet(force);
      elements.walletBalance.textContent = formatMoney(walletBalanceValue(wallet));
      renderWalletTransactions();
      const options = state.rechargeOptionsData || [];
      if (options.length) {
        elements.rechargeOptions.replaceChildren();
        options.slice(0, 5).forEach((option) => {
          const amount = firstValue(option.recharge_amount, option.amount, option.value);
          if (!amount) return;
          const bonus = numberFrom(firstValue(
            option.bonus_amount,
            option.prepaid_advantage_amount,
            option.bonus,
            option.extra_credit,
            option.cashback
          ));
          const label = firstValue(
            option.label,
            option.display_text,
            `${formatMoney(amount)}${bonus > 0 ? ` · +${formatMoney(bonus)} credit` : ''}`
          );
          const chip = button(label, '', () => {
            elements.rechargeAmount.value = String(amount);
            resetRechargePreview();
          });
          chip.dataset.amount = String(amount);
          elements.rechargeOptions.append(chip);
        });
      }
    } catch (error) {
      if (isUnauthorized(error)) return enterAuth('Your session has ended. Please sign in again.');
      renderError(elements.walletTransactions, error, () => renderWallet(true));
    }
  }

  function resetRechargePreview() {
    state.walletPreview = null;
    elements.rechargePreview.hidden = true;
    elements.rechargePreview.replaceChildren();
    elements.initiateRechargeButton.hidden = true;
    elements.previewRechargeButton.hidden = false;
  }

  function openWalletRecharge(amount) {
    const rechargeAmount = Math.ceil(numberFrom(amount));
    if (!Number.isFinite(rechargeAmount) || rechargeAmount <= 0) return;
    closeDialog();
    showView('wallet');
    resetRechargePreview();
    elements.rechargeAmount.value = String(rechargeAmount);
    window.setTimeout(() => {
      elements.rechargeAmount.focus({ preventScroll: true });
      elements.rechargeAmount.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center'
      });
    }, 80);
  }

  function walletRechargeRequestPayload(amount) {
    const payload = { amount: Math.max(1, Math.ceil(numberFrom(amount))) };
    const activeSession = client()?.getSession?.() || {};
    const cartId = firstValue(activeSession.cartId, activeSession.cart_id);
    if (cartId != null && cartId !== '') payload.cart_id = cartId;
    const activeSubscription = state.subscriptions.find((subscription) => (
      subscription && subscription.is_active !== false
    ));
    const subscriptionPlanId = activeSubscription ? subscriptionId(activeSubscription) : null;
    if (subscriptionPlanId != null && subscriptionPlanId !== '') {
      payload.subscription_plan_id = subscriptionPlanId;
    }
    return payload;
  }

  function authoritativeRechargeAmount(payload, fallback) {
    const value = firstValue(
      payload?.minimum_recharge_amount,
      payload?.recharge_amount,
      payload?.amount,
      fallback
    );
    const amount = numberFrom(value);
    return Number.isFinite(amount) && amount > 0 ? Math.ceil(amount) : Math.max(1, Math.ceil(numberFrom(fallback)));
  }

  function renderRechargePreview(preview, amount) {
    const data = responseData(preview);
    const rechargeValue = firstValue(data.minimum_recharge_amount, data.recharge_amount, data.amount, amount);
    const bonus = firstValue(
      data.bonus_amount,
      data.prepaid_advantage_amount,
      data.bonus,
      data.extra_credit,
      data.cashback,
      0
    );
    const tax = firstValue(data.tax, data.tax_amount, data.gst, 0);
    const payable = firstValue(
      data.payable_amount,
      data.amount_to_pay,
      data.payment_amount,
      data.total,
      rechargeValue
    );
    const credited = firstValue(
      data.total_credit,
      data.credited_amount,
      data.credit_amount,
      data.wallet_credit,
      numberFrom(rechargeValue) + numberFrom(bonus)
    );
    const bonusSlabText = typeof data.bonus_slab === 'object'
      ? firstValue(data.bonus_slab.display_text, data.bonus_slab.name)
      : null;
    const list = create('dl');
    [
      ['Recharge value', formatMoney(rechargeValue)],
      ['Extra wallet credit', numberFrom(bonus)
        ? `+${formatMoney(bonus)}${bonusSlabText ? ` · ${bonusSlabText}` : ''}`
        : 'No extra credit'],
      ['Tax / charges', formatMoney(tax)],
      ['Amount payable', formatMoney(payable)],
      ['Wallet receives', formatMoney(credited)]
    ].forEach(([label, value]) => {
      list.append(create('dt', '', label), create('dd', '', value));
    });
    elements.rechargePreview.replaceChildren(list);
    elements.rechargePreview.hidden = false;
    elements.previewRechargeButton.hidden = true;
    elements.initiateRechargeButton.hidden = false;
  }

  async function previewRecharge(event) {
    event.preventDefault();
    const amount = numberFrom(elements.rechargeAmount.value);
    if (amount <= 0) return showToast('Enter a valid recharge amount.', 'error');
    setButtonBusy(elements.previewRechargeButton, true, 'Preparing preview…');
    try {
      const request = walletRechargeRequestPayload(amount);
      const result = await apiCall('misc', ['rechargePreview', 'previewRecharge'], request, {
        path: '/customers/customer-wallet/recharge/preview/',
        method: 'POST',
        form: request
      });
      const payload = responseData(result);
      const serverAmount = authoritativeRechargeAmount(payload, amount);
      state.walletPreview = { ...payload, minimum_recharge_amount: serverAmount };
      if (elements.rechargeAmount) elements.rechargeAmount.value = String(serverAmount);
      renderRechargePreview(payload, serverAmount);
    } catch (error) {
      showToast(friendlyError(error), 'error');
    } finally {
      setButtonBusy(elements.previewRechargeButton, false);
    }
  }

  function accountRazorpayResponseSources(payload) {
    const envelopeKeys = [
      'data', 'payment', 'razorpay', 'order', 'razorpay_order', 'razorpayOrder',
      'payment_order', 'payment_details', 'payment_data', 'checkout'
    ];
    const sources = [];
    const visited = new Set();
    const visit = (value, depth) => {
      if (!value || typeof value !== 'object' || visited.has(value) || depth > 4) return;
      visited.add(value);
      sources.push(value);
      envelopeKeys.forEach((key) => visit(value[key], depth + 1));
    };
    visit(payload, 0);
    return sources;
  }

  function firstAccountRazorpayValue(payload, keys) {
    for (const source of accountRazorpayResponseSources(payload)) {
      for (const key of keys) {
        if (source[key] != null && source[key] !== '') return source[key];
      }
    }
    return null;
  }

  function accountWalletRechargeConfiguration(payload, requestedAmount) {
    const sources = accountRazorpayResponseSources(payload);
    const namedOrder = firstAccountRazorpayValue(payload, [
      'razorpay_order', 'razorpayOrder', 'payment_order', 'order'
    ]);
    const order = namedOrder && typeof namedOrder === 'object'
      ? namedOrder
      : sources.find((source) => typeof source.id === 'string' && source.id.startsWith('order_'));
    const explicitOrderId = firstAccountRazorpayValue(payload, [
      'razorpay_order_id', 'razorpayOrderId', 'payment_order_id'
    ]);
    const genericOrderId = firstAccountRazorpayValue(payload, ['order_id', 'orderId']);
    const explicitPaise = numberFrom(firstAccountRazorpayValue(payload, [
      'amount_in_paise', 'amount_paise', 'razorpay_amount', 'razorpayAmount'
    ]));
    const orderPaise = numberFrom(order?.amount);
    const responseRupees = Number(firstAccountRazorpayValue(payload, [
      'minimum_recharge_amount', 'recharge_amount', 'payable_amount',
      'amount_to_pay', 'final_amount', 'total_amount'
    ]));
    const previewRupees = Number(firstValue(
      state.walletPreview?.payable_amount,
      state.walletPreview?.amount_to_pay,
      state.walletPreview?.total
    ));
    const requestedRupees = Number(requestedAmount);
    const payableRupees = Number.isFinite(responseRupees) && responseRupees > 0
      ? responseRupees
      : Number.isFinite(previewRupees) && previewRupees > 0
        ? previewRupees
        : requestedRupees;
    return {
      key: firstAccountRazorpayValue(payload, [
        'razorpay_key_id', 'razorpayKeyId', 'razorpay_key', 'razorpayKey',
        'key_id', 'public_key', 'publicKey', 'key'
      ]),
      orderId: explicitOrderId
        || (typeof namedOrder === 'string' ? namedOrder : null)
        || order?.id
        || order?.order_id
        || (String(genericOrderId || '').startsWith('order_') ? genericOrderId : null),
      amount: orderPaise > 0 ? orderPaise : explicitPaise > 0 ? explicitPaise : Math.round(payableRupees * 100),
      currency: order?.currency || firstAccountRazorpayValue(payload, ['currency']) || 'INR',
      returnedFields: [...new Set(sources.flatMap((source) => Object.keys(source)))].sort()
    };
  }

  async function initiateRecharge() {
    const amount = authoritativeRechargeAmount(state.walletPreview, elements.rechargeAmount.value);
    if (amount <= 0) return showToast('Enter a valid recharge amount.', 'error');
    setButtonBusy(elements.initiateRechargeButton, true, 'Starting payment…');
    try {
      const request = walletRechargeRequestPayload(amount);
      const result = await apiCall('misc', ['rechargeInitiate', 'initiateRecharge'], request, {
        path: '/customers/customer-wallet/recharge/initiate/',
        method: 'POST',
        form: request
      });
      const config = accountWalletRechargeConfiguration(result, amount);

      if (!config.key || !config.orderId || config.amount <= 0) {
        const missing = [
          !config.key ? 'Razorpay Key ID' : '',
          !config.orderId ? 'Razorpay Order ID' : '',
          config.amount <= 0 ? 'payment amount' : ''
        ].filter(Boolean);
        console.warn('Atulyash wallet recharge configuration is incomplete.', {
          missing,
          returnedFields: config.returnedFields
        });
        const body = create('div');
        const panel = create('div', 'confirmation-panel');
        panel.append(
          create('strong', '', 'Secure payment setup is incomplete.'),
          create('p', '', `The Atulyash payment service did not return ${missing.join(' and ')}. No payment has been taken.`)
        );
        body.append(panel, create('div', 'dialog-actions'));
        openDialog('Wallet recharge', 'Payment configuration needed', body);
        return;
      }

      const Razorpay = await loadRazorpayCheckout();
      const checkout = new Razorpay({
        key: config.key,
        order_id: config.orderId,
        amount: config.amount,
        currency: config.currency,
        name: 'Atulyash',
        description: 'Atulyash Wallet Recharge',
        image: 'images/brand-mark.webp',
        prefill: {
          name: displayName(),
          email: firstValue(state.user?.email, state.customer?.email, ''),
          contact: state.mobile
        },
        theme: { color: '#0d342a' },
        handler: async (payment) => {
          try {
            await apiCall('misc', ['rechargeVerify', 'verifyRecharge'], payment, {
              path: '/customers/customer-wallet/recharge/verify/',
              method: 'POST',
              form: payment
            });
            state.loaded.delete('wallet');
            resetRechargePreview();
            showToast('Recharge successful. Your wallet is being refreshed.');
            renderWallet(true);
          } catch (error) {
            showToast(friendlyError(error, 'Payment completed, but verification is still pending. Please contact support.'), 'error');
          }
        }
      });
      checkout.open();
    } catch (error) {
      showToast(friendlyError(error), 'error');
    } finally {
      setButtonBusy(elements.initiateRechargeButton, false);
    }
  }

  async function loadNotifications(force = false) {
    const category = elements.notificationCategory.value;
    const unread = elements.unreadOnly.checked;
    const key = `notifications:${category}:${unread}`;
    if (!force && state.loaded.has(key)) return state.notifications;
    const query = { page: 1 };
    if (category) query.category = category;
    if (unread) query.is_read = false;
    const result = await apiCall('notifications', ['list', 'fetchNotifications'], query, {
      path: '/notifications/',
      method: 'GET',
      query
    });
    state.notifications = responseList(result);
    state.loaded.add(key);
    return state.notifications;
  }

  function notificationId(notification) {
    return firstValue(notification.id, notification.notification_id, notification.pk);
  }

  async function markNotificationRead(notification, card) {
    if (notification.is_read === true || notification.read === true) return;
    const id = notificationId(notification);
    try {
      await apiCall('notifications', ['markRead'], { id, notificationId: id }, {
        path: `/notifications/${id}/read/`,
        method: 'PATCH',
        form: {}
      });
      notification.is_read = true;
      card.classList.remove('is-unread');
      card.querySelector('.card-action')?.remove();
      updateUnreadUI(Math.max(0, state.unreadCount - 1));
      state.loaded.forEach((key) => {
        if (key.startsWith('notifications:')) state.loaded.delete(key);
      });
      announce('Notification marked as read.');
    } catch (error) {
      showToast(friendlyError(error), 'error');
    }
  }

  function renderNotificationCard(notification) {
    const unread = !(notification.is_read === true || notification.read === true);
    const card = create('article', `notification-card${unread ? ' is-unread' : ''}`);
    const category = String(firstValue(notification.category, notification.type, 'update'));
    const icon = create('span', 'notification-icon', /order|delivery/i.test(category) ? '↻' : /offer|promo/i.test(category) ? '◇' : '◌');
    const copy = create('div');
    copy.append(
      create('h3', '', firstValue(notification.title, notification.subject, 'Atulyash update')),
      create('p', '', firstValue(notification.message, notification.body, notification.description, 'There is a new update in your account.'))
    );
    if (unread) copy.append(button('Mark as read', 'card-action', () => markNotificationRead(notification, card)));
    card.append(
      icon,
      copy,
      create('time', 'notification-time', formatDate(firstValue(notification.created_at, notification.sent_at, notification.date), true))
    );
    return card;
  }

  async function renderNotifications(force = false) {
    renderLoading(elements.notificationsList, 'Gathering your latest updates…');
    try {
      const notifications = await loadNotifications(force);
      if (!notifications.length) {
        renderEmpty(elements.notificationsList, 'You are all caught up.', 'Order and delivery updates will appear here.');
        return;
      }
      const fragment = document.createDocumentFragment();
      notifications.forEach((notification) => fragment.append(renderNotificationCard(notification)));
      elements.notificationsList.replaceChildren(fragment);
    } catch (error) {
      if (isUnauthorized(error)) return enterAuth('Your session has ended. Please sign in again.');
      renderError(elements.notificationsList, error, () => renderNotifications(true));
    }
  }

  async function markAllNotificationsRead() {
    setButtonBusy(elements.markAllReadButton, true, 'Updating…');
    try {
      await apiCall('notifications', ['markAllRead'], undefined, {
        path: '/notifications/mark-all-read/',
        method: 'POST',
        form: {}
      });
      updateUnreadUI(0);
      state.loaded.forEach((key) => {
        if (key.startsWith('notifications:')) state.loaded.delete(key);
      });
      showToast('Every notification is now marked as read.');
      renderNotifications(true);
    } catch (error) {
      showToast(friendlyError(error), 'error');
    } finally {
      setButtonBusy(elements.markAllReadButton, false);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    const submit = elements.profileForm.querySelector('[type="submit"]');
    setButtonBusy(submit, true, 'Saving…');
    const payload = {
      id: state.userId,
      userId: state.userId,
      name: elements.profileName.value.trim(),
      email: elements.profileEmail.value.trim()
    };
    try {
      const result = await apiCall('profile', ['updateUser', 'saveUserData'], payload, {
        path: ({ id, userId }) => (id || userId) ? `/users/users/${id || userId}/` : null,
        method: 'PATCH',
        form: { name: payload.name, email: payload.email }
      });
      const data = responseData(result);
      state.user = { ...(state.user || {}), ...payload, ...(typeof data === 'object' ? data : {}) };
      state.loaded.add('profile');
      updateIdentityUI();
      showToast('Your profile has been updated.');
    } catch (error) {
      showToast(friendlyError(error), 'error');
    } finally {
      setButtonBusy(submit, false);
    }
  }

  function openDeletionRequest() {
    const form = create('form', 'dialog-form');
    const panel = create('div', 'confirmation-panel');
    panel.append(
      create('strong', '', 'This begins a permanent deletion request.'),
      create('p', '', 'Our team will verify the request before your account data is removed. Active subscriptions may be stopped as part of this process.')
    );
    const reasonLabel = create('label', '', 'Why would you like to leave?');
    const reason = create('textarea');
    reason.required = true;
    reason.maxLength = 500;
    reason.placeholder = 'Please share a short reason';
    reasonLabel.append(reason);
    const confirmLabel = create('label', 'check-control');
    const confirm = create('input');
    confirm.type = 'checkbox';
    confirm.required = true;
    confirmLabel.append(confirm, document.createTextNode(' I understand this requests permanent deletion.'));
    const actions = create('div', 'dialog-actions');
    actions.append(button('Keep my account', 'secondary-button', closeDialog));
    const submit = create('button', 'danger-button', 'Submit deletion request');
    submit.type = 'submit';
    actions.append(submit);
    form.append(panel, reasonLabel, confirmLabel, actions);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setButtonBusy(submit, true, 'Submitting…');
      const payload = { reason: reason.value.trim() };
      try {
        await apiCall('profile', ['requestDeletion', 'submitAccountDeletionRequest'], payload, {
          path: '/users/account-deletion-requests/',
          method: 'POST',
          form: payload
        });
        closeDialog();
        showToast('Your deletion request has been submitted. Our team will contact you.');
      } catch (error) {
        showToast(friendlyError(error), 'error');
        setButtonBusy(submit, false);
      }
    });
    openDialog('Privacy & control', 'Request account deletion', form);
  }

  async function loadSupport(force = false) {
    if (!force && state.loaded.has('support')) return;
    const [faqResult, truthResult, contactResult] = await Promise.allSettled([
      apiCall('misc', ['faqs', 'getFAQs'], { page_size: 100, is_active: true }, {
        path: '/customers/customer-faqs/',
        method: 'GET',
        query: { page_size: 100, is_active: true },
        auth: false
      }),
      apiCall('misc', ['truthBook', 'getTruthBook'], { is_active: true }, {
        path: '/products/product-truth-books/latest/',
        method: 'GET',
        query: { is_active: true },
        auth: false
      }),
      apiCall('misc', ['contact', 'getContactUsData'], { is_active: true }, {
        path: '/products/contact-us/',
        method: 'GET',
        query: { is_active: true },
        auth: false
      })
    ]);
    state.faqs = faqResult.status === 'fulfilled' ? responseList(faqResult.value) : [];
    if (truthResult.status === 'fulfilled') {
      const truthPayload = responseData(truthResult.value);
      state.truthBook = responseList(truthPayload)[0] || truthPayload;
    } else {
      state.truthBook = null;
    }
    state.contact = contactResult.status === 'fulfilled' ? responseData(contactResult.value) : null;
    state.supportErrors = [faqResult, truthResult, contactResult].filter((result) => result.status === 'rejected');
    state.loaded.add('support');
  }

  function renderContact() {
    const contactData = state.contact;
    const contacts = responseList(contactData);
    const contact = contacts[0] || contactData || {};
    const phone = String(firstValue(contact.phone, contact.mobile, contact.helpline, contact.phone_number, '+91 98185 88996'));
    const email = String(firstValue(contact.email, contact.support_email, 'info@atulyash.com'));
    const fragment = document.createDocumentFragment();
    const callCard = create('article', 'contact-card');
    callCard.append(create('span', '', 'Call us'), create('strong', '', phone));
    const callLink = create('a', '', 'Speak to our team →');
    callLink.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
    callCard.append(callLink);
    const emailCard = create('article', 'contact-card');
    emailCard.append(create('span', '', 'Email us'), create('strong', '', email));
    const emailLink = create('a', '', 'Write to customer care →');
    emailLink.href = `mailto:${email}`;
    emailCard.append(emailLink);
    fragment.append(callCard, emailCard);
    elements.contactCards.replaceChildren(fragment);
  }

  function renderTruthBook() {
    const truth = state.truthBook || {};
    const fileUrl = safeUrl(firstValue(
      truth.truth_book,
      truth.file,
      truth.document,
      truth.pdf_url,
      truth.url,
      truth.download_url
    ));
    if (!fileUrl) return;
    const copy = elements.truthBookCard.querySelector('div');
    if (!copy || copy.querySelector('a')) return;
    const link = create('a', 'light-button', 'Open the latest Truth Book →');
    link.href = fileUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    copy.append(link);
  }

  function renderFaqs() {
    if (!state.faqs?.length) {
      if (state.supportErrors?.length) {
        renderError(elements.faqList, state.supportErrors[0].reason, () => renderSupport(true));
      } else {
        renderEmpty(elements.faqList, 'No questions published yet.', 'Please call our team and we will help personally.');
      }
      return;
    }
    const fragment = document.createDocumentFragment();
    state.faqs.forEach((faq) => {
      const detail = create('details', 'faq-item');
      detail.append(
        create('summary', '', firstValue(faq.question, faq.title, faq.name, 'Atulyash question')),
        create('div', '', firstValue(faq.answer, faq.description, faq.content, 'Our team will be happy to explain this personally.'))
      );
      fragment.append(detail);
    });
    elements.faqList.replaceChildren(fragment);
  }

  async function renderSupport(force = false) {
    renderLoading(elements.faqList, 'Gathering answers from our team…');
    try {
      await loadSupport(force);
      renderContact();
      renderTruthBook();
      renderFaqs();
    } catch (error) {
      renderError(elements.faqList, error, () => renderSupport(true));
    }
  }

  async function renderOverview(force = false) {
    const tasks = await Promise.allSettled([
      loadProfile(force),
      getOrders({ page: 1, force }),
      loadSubscriptions(force),
      loadWallet(force),
      loadUnread(force)
    ]);
    const unauthorized = tasks.find((result) => result.status === 'rejected' && isUnauthorized(result.reason));
    if (unauthorized) return enterAuth('Your session has ended. Please sign in again.');

    const metrics = [
      ['Ready for your next batch', state.wallet ? formatMoney(walletBalanceValue(state.wallet)) : '—', 'Available in your Atulyash wallet'],
      ['Your weekly rhythm', state.subscriptions.length, 'Freshness planned around your home'],
      ['New for you', state.unreadCount, 'Delivery notes and gentle reminders']
    ];
    const fragment = document.createDocumentFragment();
    metrics.forEach(([label, value, note]) => {
      const card = create('article', 'metric-card');
      card.append(create('span', '', label), create('strong', '', value), create('small', '', note));
      fragment.append(card);
    });
    elements.overviewMetrics.replaceChildren(fragment);

    const upcomingSubscription = state.subscriptions.find((subscription) => subscriptionNextDate(subscription)) || state.subscriptions[0];
    if (!upcomingSubscription) {
      renderEmpty(elements.upcomingDelivery, 'No delivery planned yet.', 'Choose a weekly rhythm whenever your home is ready.');
    } else {
      const upcoming = create('div', 'upcoming-delivery');
      const scheduledDate = subscriptionNextDate(upcomingSubscription);
      const displayedDate = subscriptionNextDateWithVacation(upcomingSubscription);
      const date = dateValue(displayedDate);
      const tile = create('div', 'upcoming-date');
      tile.append(
        create('span', '', date ? new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(date) : 'Next'),
        create('strong', '', date ? new Intl.DateTimeFormat('en-IN', { day: '2-digit' }).format(date) : '—')
      );
      const copy = create('div');
      copy.append(
        create('h3', '', subscriptionName(upcomingSubscription)),
        create('p', '', `${subscriptionWeight(upcomingSubscription)} · ${firstValue(upcomingSubscription.delivery_day, 'Scheduled delivery')}`)
      );
      upcoming.append(tile, copy, create('strong', '', formatDate(displayedDate)));
      if (calendarDate(scheduledDate) && calendarDate(scheduledDate) !== displayedDate) {
        upcoming.append(create('small', 'upcoming-delivery-note', `Vacation pause moves the ${formatDate(scheduledDate)} batch.`));
      }
      elements.upcomingDelivery.replaceChildren(upcoming);
    }

    if (!state.orders.length) {
      renderEmpty(elements.overviewOrders, 'Your first batch is waiting.', 'Once you bring Atulyash home, every fresh batch will live here.');
    } else {
      const orderFragment = document.createDocumentFragment();
      state.orders.slice(0, 3).forEach((order) => orderFragment.append(makeOrderCard(order, { compact: true })));
      elements.overviewOrders.replaceChildren(orderFragment);
    }
  }

  function quickOrderMode() {
    return document.querySelector('input[name="quickOrderMode"]:checked')?.value === 'weekly'
      ? 'weekly'
      : 'once';
  }

  function setQuickWeeklyCatalogPlaceholder(message) {
    state.weeklyPlans = [];
    const select = elements.quickOrderPlan;
    if (select) {
      const option = create('option', '', message);
      option.value = '';
      option.disabled = true;
      option.selected = true;
      select.replaceChildren(option);
      select.disabled = true;
    }
    const weeklyRadio = document.querySelector('input[name="quickOrderMode"][value="weekly"]');
    if (weeklyRadio) {
      weeklyRadio.disabled = true;
      weeklyRadio.closest('label')?.setAttribute('aria-disabled', 'true');
      if (weeklyRadio.checked) {
        weeklyRadio.checked = false;
        const onceRadio = document.querySelector('input[name="quickOrderMode"][value="once"]');
        if (onceRadio) onceRadio.checked = true;
      }
    }
  }

  function setQuickProductCatalogStatus(message, {
    state: status = 'loading',
    retry = false,
    hidden = false
  } = {}) {
    if (!elements.quickOrderCatalogStatus) return;
    elements.quickOrderCatalogStatus.hidden = hidden;
    elements.quickOrderCatalogStatus.dataset.state = status;
    if (elements.quickOrderCatalogMessage) elements.quickOrderCatalogMessage.textContent = message;
    if (elements.quickOrderCatalogRetry) elements.quickOrderCatalogRetry.hidden = !retry;
  }

  function renderQuickProductPacks() {
    if (!elements.accountPackSelector) return;
    const previousWeight = Number(
      document.querySelector('input[name="quickPackSize"]:checked')?.value
    );
    const fragment = document.createDocumentFragment();
    const legend = create('legend', 'sr-only', 'Atta pack size');
    fragment.append(legend);

    state.quickProductPacks.forEach((pack, index) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'quickPackSize';
      input.value = String(pack.weight);
      input.dataset.price = String(pack.price);
      input.dataset.apiPackId = String(pack.apiId);
      input.checked = (
        Number.isFinite(previousWeight)
          ? pack.weight === previousWeight
          : index === 0
      );

      const content = document.createElement('span');
      const weight = create('b', '', `${bagWeightLabel(pack.weight)} kg`);
      const note = create(
        'small',
        '',
        index === 0
          ? 'Compact fresh batch'
          : index === state.quickProductPacks.length - 1
            ? 'Family fresh batch'
            : 'Fresh-batch pack'
      );
      const price = create('em', '', currency.format(pack.price));
      content.append(weight, note, price);
      label.append(input, content);
      fragment.append(label);
    });

    elements.accountPackSelector.replaceChildren(fragment);
    elements.accountPackSelector.disabled = state.quickProductPacks.length === 0;
  }

  async function loadQuickOrderProducts() {
    state.quickProductCatalogStatus = 'loading';
    state.quickProductPacks = [];
    if (elements.accountPackSelector) {
      elements.accountPackSelector.disabled = true;
      elements.accountPackSelector.replaceChildren();
    }
    setQuickProductCatalogStatus('Loading today’s live pack sizes…', { state: 'loading' });
    renderQuickOrder();

    try {
      const result = await apiCall('products', ['list'], {
        is_active: true,
        page_size: 100
      }, {
        path: '/products/products/',
        method: 'GET',
        query: { is_active: true, page_size: 100 },
        auth: false
      });
      const products = responseList(result).filter((product) => product?.is_active !== false);
      const product = products.find((candidate) => {
        const packs = firstValue(candidate?.all_packs, candidate?.packs, []);
        return Array.isArray(packs) && packs.length > 0;
      }) || null;
      const packs = firstValue(product?.all_packs, product?.packs, []);
      const livePacks = (Array.isArray(packs) ? packs : [])
        .filter((pack) => (
          pack?.is_active !== false
          && (firstFinite(pack?.stock_quantity) ?? 1) > 0
        ))
        .map((pack) => {
          const labelledWeight = weightFromLabel(pack?.name);
          const weight = Number.isFinite(labelledWeight) && labelledWeight > 0
            ? labelledWeight
            : firstFinite(pack?.weight, pack?.amount);
          const price = firstFinite(pack?.price);
          const apiId = firstValue(pack?.id, pack?.pk);
          if (
            apiId == null
            || !Number.isFinite(weight)
            || weight <= 0
            || !Number.isFinite(price)
            || price < 0
          ) {
            return null;
          }
          return { apiId, weight, price };
        })
        .filter(Boolean)
        .sort((a, b) => a.weight - b.weight);

      if (!livePacks.length) {
        throw new Error('No live atta packs are available right now.');
      }

      state.products = products;
      state.quickProductPacks = livePacks;
      state.quickProductCatalogStatus = 'ready';
      renderQuickProductPacks();
      setQuickProductCatalogStatus('', { state: 'success', hidden: true });
    } catch (error) {
      state.quickProductCatalogStatus = 'error';
      state.quickProductPacks = [];
      renderQuickProductPacks();
      setQuickProductCatalogStatus(
        friendlyError(error, 'Live pack availability could not be loaded.'),
        { state: 'error', retry: true }
      );
    } finally {
      renderQuickOrder();
    }
  }

  async function loadQuickOrderWeeklyPlans() {
    state.weeklyCatalogStatus = 'loading';
    setQuickWeeklyCatalogPlaceholder('Loading live weekly plans…');
    try {
      const result = await apiCall('subscriptions', ['listPacks'], {
        is_active: true,
        page_size: 100
      }, {
        path: '/subscription/subscription_pack/',
        method: 'GET',
        query: { is_active: true, page_size: 100 },
        auth: false
      });
      const plans = responseList(result)
        .filter((plan) => plan?.is_active !== false)
        .map((plan) => {
          const monthlyKg = Number(plan?.monthly_quantity);
          const weeklyKg = Number(plan?.weekly_quantity);
          const price = Number(plan?.weekly_price);
          const monthlyPrice = Number(plan?.price);
          if (
            plan?.id == null
            || !Number.isFinite(monthlyKg)
            || monthlyKg <= 0
            || !Number.isFinite(weeklyKg)
            || weeklyKg <= 0
            || !Number.isFinite(price)
            || price < 0
            || !Number.isFinite(monthlyPrice)
            || monthlyPrice < 0
          ) {
            return null;
          }
          return {
            id: plan.id,
            name: firstValue(plan.name, 'Fresh Weekly Atta'),
            monthlyKg,
            weeklyKg,
            price,
            monthlyPrice,
            weeklyQuantityCycle: firstValue(plan.weekly_quantity_cycle, plan.delivery_quantity_cycle, plan.weekly_cycle, [])
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.monthlyKg - b.monthlyKg);

      if (!plans.length) {
        state.weeklyCatalogStatus = 'empty';
        setQuickWeeklyCatalogPlaceholder('No live weekly plans are available.');
        return;
      }

      state.weeklyPlans = plans;
      state.weeklyCatalogStatus = 'ready';
      const fragment = document.createDocumentFragment();
      plans.forEach((plan) => {
        const option = create('option');
        option.value = String(plan.id);
        option.dataset.monthly = String(plan.monthlyKg);
        option.dataset.weekly = String(plan.weeklyKg);
        option.dataset.price = String(plan.price);
        option.dataset.monthlyPrice = String(plan.monthlyPrice);
        option.textContent = `${bagWeightLabel(plan.monthlyKg)} kg/month — ${weeklyDeliveryCycleText(plan)} · ${currency.format(plan.monthlyPrice)} minimum wallet balance`;
        fragment.append(option);
      });
      elements.quickOrderPlan.replaceChildren(fragment);
      elements.quickOrderPlan.disabled = false;
      const weeklyRadio = document.querySelector('input[name="quickOrderMode"][value="weekly"]');
      if (weeklyRadio) {
        weeklyRadio.disabled = false;
        weeklyRadio.closest('label')?.setAttribute('aria-disabled', 'false');
      }
      updateAccountAttaCalculator();
    } catch (error) {
      state.weeklyCatalogStatus = 'error';
      setQuickWeeklyCatalogPlaceholder('Live weekly plans could not be loaded.');
    } finally {
      updateAccountAttaCalculator();
      if (!elements.accountShell.hidden && state.activeView === 'shop') renderQuickOrder();
      if (!elements.accountShell.hidden && state.activeView === 'subscriptions' && state.loaded.has('subscriptions')) {
        renderSubscriptions();
      }
    }
  }

  function selectedQuickPack() {
    const input = document.querySelector('input[name="quickPackSize"]:checked')
      || document.querySelector('input[name="quickPackSize"]');
    const weight = Number(input?.value);
    const price = Number(input?.dataset.price);
    const apiId = Number(input?.dataset.apiPackId);
    if (
      !input
      || state.quickProductCatalogStatus !== 'ready'
      || !Number.isFinite(weight)
      || weight <= 0
      || !Number.isFinite(price)
      || price < 0
      || !Number.isFinite(apiId)
      || apiId <= 0
    ) {
      return null;
    }
    return {
      weight,
      price,
      apiId
    };
  }

  function selectedQuickPlan() {
    const option = elements.quickOrderPlan?.selectedOptions?.[0];
    const monthlyKg = Number(option?.dataset.monthly);
    const weeklyKg = Number(option?.dataset.weekly);
    const price = Number(option?.dataset.price);
    const monthlyPrice = Number(option?.dataset.monthlyPrice);
    if (
      !option
      || option.disabled
      || !Number.isFinite(monthlyKg)
      || monthlyKg <= 0
      || !Number.isFinite(weeklyKg)
      || weeklyKg <= 0
      || !Number.isFinite(price)
      || price < 0
      || !Number.isFinite(monthlyPrice)
      || monthlyPrice < 0
    ) {
      return null;
    }
    return {
      id: option.value,
      monthlyKg,
      weeklyKg,
      price,
      monthlyPrice,
      weeklyQuantityCycle: state.weeklyPlans.find((plan) => String(plan.id) === String(option.value))?.weeklyQuantityCycle || []
    };
  }

  function buildQuickOrderChapatis(weight) {
    if (!elements.quickOrderChapatiFill) return;
    const count = Math.max(1, Math.min(5, Math.ceil(Number(weight) / 2)));
    const fragment = document.createDocumentFragment();
    const spread = 29;
    for (let index = 0; index < count; index += 1) {
      const chapati = create('span', 'quick-order-chapati-token');
      const position = index - (count - 1) / 2;
      const startX = position * spread;
      chapati.style.setProperty('--roti-start-x', `${startX}px`);
      chapati.style.setProperty('--roti-mid-x', `${startX * .42}px`);
      chapati.style.setProperty('--roti-rotation', `${position * 18 + (index % 2 ? 10 : -7)}deg`);
      chapati.style.setProperty('--roti-mid-rotation', `${position * -5 + (index % 2 ? -3 : 2)}deg`);
      chapati.style.setProperty('--roti-delay', `${30 + index * 72}ms`);
      fragment.append(chapati);
    }
    elements.quickOrderChapatiFill.replaceChildren(fragment);
  }

  function animateQuickOrderPack(weight) {
    if (!elements.quickOrderPackArt || !elements.quickOrderVisual || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.clearTimeout(state.quickOrderAnimationTimer);
    elements.quickOrderPackArt.classList.remove('is-changing');
    elements.quickOrderVisual.classList.remove('is-filling');
    buildQuickOrderChapatis(weight);
    void elements.quickOrderVisual.offsetWidth;
    elements.quickOrderVisual.classList.add('is-filling');
    state.quickOrderAnimationTimer = window.setTimeout(() => {
      elements.quickOrderVisual?.classList.remove('is-filling');
      elements.quickOrderChapatiFill?.replaceChildren();
    }, 1050);
  }

  function renderQuickOrder({ animate = false } = {}) {
    if (!elements.accountQuickOrderForm) return;
    const mode = quickOrderMode();
    const weekly = mode === 'weekly';
    const pack = selectedQuickPack();
    const plan = weekly ? selectedQuickPlan() : null;
    const submit = elements.accountQuickOrderForm.querySelector('[type="submit"]');
    const quantity = Math.max(1, Math.min(10, state.quickOrderQuantity));
    state.quickOrderQuantity = quantity;
    submit.setAttribute('aria-busy', String(state.quickOrderSubmitting));
    elements.accountQuickOrderForm.dataset.orderMode = mode;

    elements.quickOrderOnceFields.hidden = weekly;
    elements.quickOrderOnceFields.inert = weekly;
    elements.quickOrderWeeklyFields.hidden = !weekly;
    elements.quickOrderWeeklyFields.inert = !weekly;
    if (elements.quickOrderTotal) elements.quickOrderTotal.hidden = weekly;
    if (elements.weeklyChoiceSummary) elements.weeklyChoiceSummary.hidden = !weekly || !plan;
    if (elements.quickOrderAssuranceText) {
      elements.quickOrderAssuranceText.textContent = weekly
        ? 'Next: review your bag, then choose the delivery day and confirm wallet payment.'
        : 'Added here, reviewed here. Choose delivery and payment only when you are ready.';
    }
    elements.quickOrderQuantity.textContent = String(quantity);

    if (weekly && !plan) {
      elements.quickOrderWeightBadge.textContent = 'Live';
      elements.quickOrderSelection.textContent = state.weeklyCatalogStatus === 'loading'
        ? 'Loading live weekly plans…'
        : 'No live weekly plan is available';
      elements.quickOrderPrice.textContent = '—';
      elements.quickOrderCtaLabel.textContent = 'Weekly plan unavailable';
      submit.disabled = true;
      document.querySelectorAll('input[name="quickOrderMode"]').forEach((input) => {
        input.closest('label')?.classList.toggle('is-selected', input.checked);
      });
      return;
    }

    if (!weekly && !pack) {
      elements.quickOrderWeightBadge.textContent = 'Live';
      elements.quickOrderSelection.textContent = state.quickProductCatalogStatus === 'loading'
        ? 'Loading today’s live packs…'
        : 'No live pack is available';
      elements.quickOrderPrice.textContent = '—';
      elements.quickOrderCtaLabel.textContent = state.quickProductCatalogStatus === 'loading'
        ? 'Loading live availability…'
        : 'Pack unavailable';
      submit.disabled = true;
      return;
    }

    submit.disabled = state.quickOrderSubmitting;
    const displayWeight = weekly ? plan.monthlyKg : pack.weight;
    const total = weekly ? plan.monthlyPrice : pack.price * quantity;
    const compactWeight = Number.isInteger(displayWeight) ? String(displayWeight) : displayWeight.toFixed(1);
    if (weekly) {
      const monthlyWeight = Number.isInteger(plan.monthlyKg) ? String(plan.monthlyKg) : plan.monthlyKg.toFixed(1);
      if (elements.weeklyChoiceQuantity) elements.weeklyChoiceQuantity.textContent = `${monthlyWeight} kg/month`;
      if (elements.weeklyChoiceCoverage) elements.weeklyChoiceCoverage.textContent = weeklyDeliveryCycleText(plan, { includeWeeks: true });
      if (elements.weeklyChoicePerDelivery) elements.weeklyChoicePerDelivery.textContent = currency.format(plan.price);
      if (elements.weeklyChoiceFirstMonth) elements.weeklyChoiceFirstMonth.textContent = currency.format(plan.monthlyPrice);
      if (elements.weeklyChoicePaymentCopy) {
        elements.weeklyChoicePaymentCopy.textContent = `Keep ${currency.format(plan.monthlyPrice)} in your Atulyash Wallet before starting. It is charged delivery by delivery, not as one upfront monthly debit.`;
      }
    }
    elements.quickOrderWeightBadge.textContent = weekly ? `${compactWeight} kg/mo` : `${compactWeight} kg`;
    elements.quickOrderSelection.textContent = weekly
      ? `${plan.monthlyKg} kg/month · ${weeklyDeliveryCycleText(plan)} · ${currency.format(plan.price)} per delivery`
      : `${quantity} × ${compactWeight} kg · one-time order`;
    elements.quickOrderPrice.textContent = weekly ? `${currency.format(total)} minimum balance` : currency.format(total);
    elements.quickOrderCtaLabel.textContent = state.quickOrderSubmitting
      ? 'Adding to your bag…'
      : weekly
        ? 'Add weekly plan to bag'
        : 'Add to bag';

    document.querySelectorAll('input[name="quickOrderMode"]').forEach((input) => {
      input.closest('label')?.classList.toggle('is-selected', input.checked);
    });
    document.querySelectorAll('input[name="quickPackSize"]').forEach((input) => {
      input.closest('label')?.classList.toggle('is-selected', input.checked);
    });
    if (animate) animateQuickOrderPack(displayWeight);
  }

  function setQuickOrderMode(mode) {
    if (mode === 'weekly' && state.weeklyCatalogStatus !== 'ready') {
      showToast(
        state.weeklyCatalogStatus === 'loading'
          ? 'Live weekly plans are still loading.'
          : 'Live weekly plans are not available right now.',
        'error'
      );
      return;
    }
    const target = document.querySelector(`input[name="quickOrderMode"][value="${mode === 'weekly' ? 'weekly' : 'once'}"]`);
    if (target) target.checked = true;
    renderQuickOrder({ animate: true });
  }

  function accountCalculatorBuffer() {
    const buffer = Number(document.querySelector('input[name="accountAttaBuffer"]:checked')?.value);
    return [15, 20, 25, 30].includes(buffer) ? buffer : 10;
  }

  function updateAccountAttaCalculator() {
    if (!elements.accountDailyRotis) return null;
    const dailyRotis = Math.max(8, Math.round(Number(elements.accountDailyRotis.value) || 8));
    const buffer = accountCalculatorBuffer();
    const weeklyKg = (dailyRotis * 30 * 7 * (1 + buffer / 100)) / 1000;
    elements.accountDailyRotis.value = String(dailyRotis);
    elements.accountRotisMinus.disabled = dailyRotis <= 8;
    elements.accountCalculatorKg.replaceChildren(
      document.createTextNode(weeklyKg.toFixed(2)),
      Object.assign(create('small'), { textContent: 'kg/week' })
    );
    elements.accountCalculatorFormula.textContent = `${dailyRotis} rotis/day × 30 g/roti × 7 days${buffer ? ` + ${buffer}% buffer` : ''}`;

    const recommendedPlan = state.weeklyPlans.find((plan) => plan.monthlyKg >= weeklyKg * 4) || null;
    if (state.weeklyCatalogStatus === 'loading') {
      elements.accountCalculatorPlan.textContent = 'Finding the closest live weekly plan…';
    } else if (!recommendedPlan) {
      elements.accountCalculatorPlan.textContent = state.weeklyPlans.length
        ? 'This estimate is above the available plans. Our team can help shape the right quantity.'
        : 'Live weekly plans are not available right now.';
    } else {
      elements.accountCalculatorPlan.textContent = `Closest live plan: ${recommendedPlan.monthlyKg} kg/month — ${weeklyDeliveryCycleText(recommendedPlan)}.`;
      const option = Array.from(elements.quickOrderPlan?.options || [])
        .find((candidate) => String(candidate.value) === String(recommendedPlan.id));
      if (option) {
        elements.quickOrderPlan.value = option.value;
        if (quickOrderMode() === 'weekly') renderQuickOrder({ animate: true });
      }
    }
    return { dailyRotis, buffer, weeklyKg, plan: recommendedPlan };
  }

  async function continueQuickOrder(event) {
    event.preventDefault();
    if (state.quickOrderSubmitting) return;
    const weekly = quickOrderMode() === 'weekly';
    const pack = selectedQuickPack();
    const plan = weekly ? selectedQuickPlan() : null;
    if (weekly && !plan) {
      showToast('A live weekly plan is required before continuing.', 'error');
      return;
    }
    if (!weekly && !pack) {
      showToast('A live pack is required before it can be added to your bag.', 'error');
      return;
    }

    state.quickOrderSubmitting = true;
    renderQuickOrder();
    setAccountBagStatus('Adding your fresh-batch selection…', { state: 'loading' });
    try {
      const ensureActiveBag = methodFrom('cart', ['ensureActive']);
      if (!ensureActiveBag) throw new Error('The secure bag service is unavailable right now.');
      let cartPayload = await ensureActiveBag(state.mobile);
      const activeSession = client()?.getSession?.() || {};
      const cartData = responseData(cartPayload);
      const cartId = firstValue(
        activeSession.cartId,
        activeSession.cart_id,
        cartData?.cart_id,
        cartData?.cartId,
        cartData?.id
      );
      if (cartId == null) {
        throw new Error('Your secure bag could not be identified. Please try again.');
      }

      const lineItem = weekly ? {
        cart: cartId,
        subscription_pack: plan.id,
        cart_item_type: 'Subscription'
      } : {
        cart: cartId,
        product_pack: pack.apiId,
        cart_item_type: 'One Time',
        quantity: state.quickOrderQuantity
      };
      const addItem = weekly
        ? methodFrom('cart', ['addSubscription', 'addItem'])
        : methodFrom('cart', ['addOneTime', 'addItem']);
      if (!addItem) throw new Error('Adding items to your secure bag is unavailable right now.');

      await addItem(lineItem);
      cartPayload = await ensureActiveBag(state.mobile);
      state.accountBagPayload = cartPayload;
      renderAccountBag();
      setAccountBagStatus(
        weekly
          ? 'Your weekly plan is now in your bag.'
          : `${state.quickOrderQuantity} × ${bagWeightLabel(pack.weight)} kg pack added to your bag.`,
        { state: 'success' }
      );
      openAccountBag({ refresh: false });
      announce('Selection added to your bag.');
    } catch (error) {
      if (isUnauthorized(error)) {
        enterAuth('Your session has ended. Please sign in again.');
        return;
      }
      const message = friendlyError(error, 'This selection could not be added to your bag. Please try again.');
      setAccountBagStatus(message, { state: 'error' });
      openAccountBag({ refresh: false });
      showToast(message, 'error');
    } finally {
      state.quickOrderSubmitting = false;
      renderQuickOrder();
    }
  }

  const viewLoaders = {
    shop: renderQuickOrder,
    overview: renderOverview,
    orders: () => renderOrders({ page: 1 }),
    subscriptions: renderSubscriptions,
    addresses: renderAddresses,
    wallet: renderWallet,
    notifications: renderNotifications,
    profile: async () => {
      try {
        await loadProfile();
      } catch (error) {
        if (isUnauthorized(error)) enterAuth('Your session has ended. Please sign in again.');
        else showToast(friendlyError(error), 'error');
      }
    },
    support: renderSupport
  };

  function syncMobileAccountNav() {
    const viewLabels = {
      shop: 'Order atta',
      orders: 'Orders',
      subscriptions: 'Weekly plan',
      addresses: 'Delivery homes',
      support: 'Help & support',
      profile: 'My details',
      wallet: 'My wallet',
      notifications: 'Notifications'
    };
    const activeItem = elements.portalNav?.querySelector('.nav-item.is-active');
    const activeLabel = activeItem?.querySelector('.nav-copy strong')?.textContent?.trim();
    if (elements.mobileAccountNavLabel) {
      elements.mobileAccountNavLabel.textContent = viewLabels[state.activeView] || activeLabel || 'Order atta';
    }
  }

  function setMobileAccountNav(open, { restoreFocus = false } = {}) {
    const canOpen = window.matchMedia('(max-width: 900px)').matches;
    const expanded = Boolean(open && canOpen);
    // Two menus over the same small screen is visually confusing. Keep the
    // account navigation and profile menu mutually exclusive on mobile.
    if (expanded && elements.profileMenu?.open) elements.profileMenu.open = false;
    elements.portalSidebar?.classList.toggle('is-mobile-open', expanded);
    if (elements.mobileAccountNavToggle) {
      elements.mobileAccountNavToggle.setAttribute('aria-expanded', String(expanded));
      elements.mobileAccountNavToggle.setAttribute('aria-label', expanded ? 'Close account menu' : 'Open account menu');
    }
    document.body.classList.toggle('mobile-account-menu-open', expanded);
    if (!expanded && restoreFocus) elements.mobileAccountNavToggle?.focus();
  }

  function showView(viewName, { focus = true, updateHash = true } = {}) {
    const panel = document.querySelector(`[data-view-panel="${viewName}"]`);
    if (!panel) return;
    state.activeView = viewName;
    document.querySelectorAll('[data-view-panel]').forEach((view) => {
      const active = view === panel;
      view.hidden = !active;
      view.classList.toggle('is-active', active);
    });
    document.querySelectorAll('[data-view]').forEach((nav) => {
      const active = nav.dataset.view === viewName;
      nav.classList.toggle('is-active', active);
      if (active) nav.setAttribute('aria-current', 'page');
      else nav.removeAttribute('aria-current');
    });
    syncMobileAccountNav();
    if (updateHash && window.location.hash !== `#${viewName}`) {
      window.history.replaceState(null, '', `#${viewName}`);
    }
    if (focus) {
      elements.portalMain.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
    viewLoaders[viewName]?.();
  }

  function openDialog(eyebrow, title, body) {
    state.dialogReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    elements.dialogEyebrow.textContent = eyebrow;
    elements.dialogTitle.textContent = title;
    elements.dialogBody.replaceChildren(body);
    if (!elements.dialog.open) elements.dialog.showModal();
    document.body.classList.add('dialog-open');
    window.setTimeout(() => elements.dialogCloseButton.focus(), 30);
  }

  function closeDialog() {
    if (elements.dialog.open) elements.dialog.close();
  }

  async function logout() {
    setButtonBusy(elements.logoutButton, true, 'Signing out…');
    try {
      const logoutMethod = methodFrom('auth', ['logout']);
      if (logoutMethod) await logoutMethod();
    } catch (error) {
      // Local session data is cleared even if the optional server logout fails.
    }
    sessionStorage.removeItem(SESSION_META_KEY);
    enterAuth();
    showToast('You have been signed out.');
    setButtonBusy(elements.logoutButton, false);
  }

  elements.mobileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    elements.mobileError.textContent = '';
    const mobile = elements.mobileNumber.value.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      elements.mobileError.textContent = 'Enter a valid 10-digit Indian mobile number.';
      elements.mobileNumber.focus();
      return;
    }
    const submit = elements.mobileForm.querySelector('[type="submit"]');
    setButtonBusy(submit, true, 'Sending secure code…');
    try {
      await requestOtp(mobile);
      state.mobile = mobile;
      persistMeta();
      showOtpStep();
      announce('One-time code sent.');
    } catch (error) {
      elements.mobileError.textContent = friendlyError(error, 'We could not send a code. Please check the number and try again.');
    } finally {
      setButtonBusy(submit, false);
    }
  });

  elements.otpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    elements.otpError.textContent = '';
    const otp = elements.otpCode.value.replace(/\D/g, '');
    if (!/^\d{4}$/.test(otp)) {
      elements.otpError.textContent = 'Enter the complete 4-digit code.';
      elements.otpCode.focus();
      return;
    }
    const submit = elements.otpForm.querySelector('[type="submit"]');
    setButtonBusy(submit, true, 'Verifying securely…');
    let mobileVerified = false;
    try {
      const result = await verifyOtp(state.mobile, otp);
      mobileVerified = true;
      captureIdentity(result, state.mobile);
      const activeSession = methodFrom('auth', ['getSession'])?.() || methodFrom(null, ['getSession'])?.();
      if (activeSession) captureIdentity(activeSession, state.mobile);
      await resolveCustomerIdentity();
      persistMeta();
      enterAccount();
      showToast('Welcome to My Atulyash.');
    } catch (error) {
      elements.otpError.textContent = mobileVerified
        ? 'Your mobile is verified, but we could not connect your customer account yet. Please refresh and try again.'
        : friendlyError(error, 'That code could not be verified. Please try again.');
      if (!mobileVerified) elements.otpCode.select();
    } finally {
      setButtonBusy(submit, false);
    }
  });

  elements.mobileNumber.addEventListener('input', () => {
    const digits = elements.mobileNumber.value.replace(/\D/g, '').slice(0, 10);
    elements.mobileNumber.value = digits;
    elements.mobileError.textContent = '';
  });
  elements.otpCode.addEventListener('input', () => {
    elements.otpCode.value = elements.otpCode.value.replace(/\D/g, '').slice(0, 4);
    elements.otpError.textContent = '';
  });
  elements.changeMobileButton.addEventListener('click', showMobileStep);
  elements.resendOtpButton.addEventListener('click', async () => {
    setButtonBusy(elements.resendOtpButton, true, 'Sending…');
    try {
      await requestOtp(state.mobile);
      startResendCountdown();
      announce('A new one-time code has been sent.');
    } catch (error) {
      elements.otpError.textContent = friendlyError(error);
      elements.resendOtpButton.disabled = false;
    }
  });

  document.querySelectorAll('[data-view]').forEach((item) => {
    item.addEventListener('click', () => {
      showView(item.dataset.view);
      setMobileAccountNav(false);
      item.closest('details')?.removeAttribute('open');
    });
  });
  document.querySelectorAll('[data-go-view]').forEach((item) => {
    item.addEventListener('click', () => {
      showView(item.dataset.goView);
      if (item.dataset.shopMode) setQuickOrderMode(item.dataset.shopMode);
      if (item.dataset.openCalculator === 'true' && elements.accountCalculatorDetails) {
        elements.accountCalculatorDetails.open = true;
        updateAccountAttaCalculator();
        window.setTimeout(() => {
          elements.accountCalculatorDetails.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'center'
          });
          elements.accountDailyRotis?.focus({ preventScroll: true });
        }, 80);
      }
    });
  });
  elements.quickOrderModes?.addEventListener('change', () => renderQuickOrder({ animate: true }));
  elements.accountPackSelector?.addEventListener('change', () => renderQuickOrder({ animate: true }));
  elements.quickOrderPlan?.addEventListener('change', () => renderQuickOrder({ animate: true }));
  elements.accountDailyRotis?.addEventListener('input', updateAccountAttaCalculator);
  elements.accountDailyRotis?.addEventListener('change', updateAccountAttaCalculator);
  elements.accountRotisMinus?.addEventListener('click', () => {
    elements.accountDailyRotis.value = String(Math.max(8, Number(elements.accountDailyRotis.value || 8) - 1));
    updateAccountAttaCalculator();
  });
  elements.accountRotisPlus?.addEventListener('click', () => {
    elements.accountDailyRotis.value = String(Math.max(8, Number(elements.accountDailyRotis.value || 8) + 1));
    updateAccountAttaCalculator();
  });
  let activeAccountBufferInput = document.querySelector('input[name="accountAttaBuffer"]:checked');
  document.querySelectorAll('input[name="accountAttaBuffer"]').forEach((input) => {
    input.addEventListener('click', (event) => {
      // Allow a second click on the selected card to return to the neutral 10% buffer.
      if (!input.checked || input !== activeAccountBufferInput) return;
      event.preventDefault();
      activeAccountBufferInput = null;
      window.setTimeout(() => {
        input.checked = false;
        updateAccountAttaCalculator();
      }, 0);
    });
    input.addEventListener('change', () => {
      activeAccountBufferInput = input.checked ? input : null;
      updateAccountAttaCalculator();
    });
  });
  elements.quickOrderMinus?.addEventListener('click', () => {
    state.quickOrderQuantity = Math.max(1, state.quickOrderQuantity - 1);
    renderQuickOrder();
  });
  elements.quickOrderPlus?.addEventListener('click', () => {
    state.quickOrderQuantity = Math.min(10, state.quickOrderQuantity + 1);
    renderQuickOrder();
  });
  elements.accountQuickOrderForm?.addEventListener('submit', continueQuickOrder);
  elements.quickOrderCatalogRetry?.addEventListener('click', loadQuickOrderProducts);
  elements.portalBagShortcut?.addEventListener('click', () => openAccountBag());
  elements.accountBagCloseButton?.addEventListener('click', () => closeAccountBag());
  elements.accountBagBackdrop?.addEventListener('click', () => closeAccountBag());
  elements.accountBagRetryButton?.addEventListener('click', loadAccountBag);
  elements.accountBagCheckoutButton?.addEventListener('click', continueAccountBagCheckout);
  elements.accountBagContinueButton?.addEventListener('click', () => closeAccountBag());
  elements.accountBagItems?.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-bag-action]');
    if (!actionButton) return;
    void updateAccountBagLine(actionButton.closest('.account-bag-line'), actionButton.dataset.bagAction);
  });
  elements.accountBagEmpty?.querySelector('[data-account-bag-shop]')?.addEventListener('click', () => {
    closeAccountBag({ restoreFocus: false });
    showView('shop');
    window.setTimeout(() => elements.portalMain?.focus(), 40);
  });
  elements.notificationShortcut.addEventListener('click', () => showView('notifications'));
  elements.mobileAccountNavToggle?.addEventListener('click', () => {
    const expanded = elements.mobileAccountNavToggle.getAttribute('aria-expanded') === 'true';
    setMobileAccountNav(!expanded);
  });
  elements.profileMenu?.addEventListener('toggle', () => {
    if (elements.profileMenu.open) setMobileAccountNav(false);
  });
  document.addEventListener('click', (event) => {
    if (!elements.portalSidebar?.classList.contains('is-mobile-open')) return;
    if (!elements.portalSidebar.contains(event.target)) setMobileAccountNav(false);
  });
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 900px)').matches) setMobileAccountNav(false);
  });
  elements.logoutButton.addEventListener('click', logout);
  elements.ordersLoadMore.addEventListener('click', () => renderOrders({ page: state.orderPage + 1, force: true }));
  elements.ordersStatementButton?.addEventListener('click', openCustomerStatement);
  elements.orderFilter.addEventListener('change', () => {
    state.orders = [];
    state.orderPage = 1;
    renderOrders({ page: 1, force: true });
  });
  elements.setVacationButton.addEventListener('click', () => openVacationForm());
  elements.addAddressButton.addEventListener('click', () => openAddressForm());
  elements.rechargeOptions.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-amount]');
    if (!chip) return;
    elements.rechargeAmount.value = chip.dataset.amount;
    resetRechargePreview();
  });
  elements.rechargeAmount.addEventListener('input', resetRechargePreview);
  elements.rechargeForm.addEventListener('submit', previewRecharge);
  elements.initiateRechargeButton.addEventListener('click', initiateRecharge);
  elements.notificationCategory.addEventListener('change', () => renderNotifications(true));
  elements.unreadOnly.addEventListener('change', () => renderNotifications(true));
  elements.markAllReadButton.addEventListener('click', markAllNotificationsRead);
  elements.profileForm.addEventListener('submit', saveProfile);
  elements.requestDeletionButton.addEventListener('click', openDeletionRequest);
  elements.dialogCloseButton.addEventListener('click', closeDialog);
  elements.dialog.addEventListener('click', (event) => {
    if (event.target === elements.dialog) closeDialog();
  });
  elements.dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    setToastLayer(false);
    state.dialogReturnFocus?.focus?.();
    state.dialogReturnFocus = null;
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && elements.portalSidebar?.classList.contains('is-mobile-open')) {
      setMobileAccountNav(false, { restoreFocus: true });
      return;
    }
    if (event.key === 'Escape' && elements.accountBagDrawer?.classList.contains('is-open')) {
      closeAccountBag();
      return;
    }
    if (event.key === 'Escape' && elements.dialog.open) closeDialog();
    trapAccountBagFocus(event);
  });

  client()?.on?.('autherror', () => {
    closeAccountBag({ restoreFocus: false });
    enterAuth('Your session has ended. Please sign in again.');
  });

  async function initialise() {
    if (!client()) {
      elements.mobileError.textContent = 'The secure account service could not load. Please refresh the page.';
      return;
    }
    updateAuthReturnNotice();
    void loadQuickOrderProducts();
    void loadQuickOrderWeeklyPlans();
    const authenticated = await restoreSession();
    if (authenticated) enterAccount();
    else {
      elements.authShell.hidden = false;
      elements.accountShell.hidden = true;
    }
  }

  initialise();
})();
