(function launchExperiencePage() {
  'use strict';

  var api = window.AtulyashAPI;
  var campaign = null;
  var form = document.getElementById('launchReservationForm');
  var loginPrompt = document.getElementById('launchLoginPrompt');
  var unavailable = document.getElementById('launchUnavailable');
  var existing = document.getElementById('launchExisting');
  var success = document.getElementById('launchSuccess');
  var notice = document.getElementById('launchNotice');
  var counter = document.getElementById('launchCounter');
  var pincode = document.getElementById('launchPincode');
  var area = document.getElementById('launchArea');
  var otherAreaField = document.getElementById('launchOtherAreaField');
  var otherArea = document.getElementById('launchOtherArea');
  var otherAreaValue = '__atulyash_other_area__';
  var serviceability = document.getElementById('launchServiceability');
  var submit = document.getElementById('launchSubmit');
  var campaignDate = document.getElementById('launchCampaignDate');
  var millingDate = document.getElementById('launchMillingDate');
  var successDate = document.getElementById('launchSuccessDate');
  var launchReference = document.getElementById('launchReference');
  var gate = document.getElementById('launchServiceabilityGate');
  var gateForm = document.getElementById('launchServiceabilityForm');
  var gatePincode = document.getElementById('launchServiceabilityPincode');
  var gateStatus = document.getElementById('launchServiceabilityStatus');
  var gateButton = document.getElementById('launchServiceabilityCheck');
  var serviceabilityRequestId = 0;
  var verifiedPincode = '';
  var verifiedServiceable = false;
  var serviceabilityStorageKey = 'atulyash-launch-serviceability-v1';

  function setNotice(message, isSuccess) {
    notice.textContent = message || '';
    notice.classList.toggle('success', Boolean(isSuccess));
  }

  function setGateStatus(message, isError) {
    gateStatus.textContent = message || '';
    gateStatus.classList.toggle('is-error', Boolean(isError));
  }

  function markInvalid(field, message) {
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.focus();
    }
    setNotice(message);
    return false;
  }

  function clearInvalidFields() {
    form.querySelectorAll('[aria-invalid="true"]').forEach(function (field) {
      field.removeAttribute('aria-invalid');
    });
  }

  function rememberServiceability(pincodeValue) {
    try {
      sessionStorage.setItem(serviceabilityStorageKey, JSON.stringify({
        campaignId: campaign && campaign.id ? campaign.id : null,
        pincode: pincodeValue,
        checkedAt: Date.now()
      }));
    } catch (error) {
      // Session storage can be unavailable in private browsing; the current page still works.
    }
  }

  function readRememberedServiceability() {
    try {
      var value = JSON.parse(sessionStorage.getItem(serviceabilityStorageKey) || 'null');
      if (!value || !value.pincode || (value.campaignId && campaign && value.campaignId !== campaign.id)) return null;
      return value;
    } catch (error) {
      return null;
    }
  }

  function formatCampaignDate(value) {
    if (!value) return '';
    var parsed = new Date(String(value) + 'T00:00:00+05:30');
    if (Number.isNaN(parsed.getTime())) return '';
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata' }).format(parsed);
  }

  function formatShortCampaignDate(value, offsetDays) {
    if (!value) return '';
    var parsed = new Date(String(value) + 'T00:00:00+05:30');
    if (Number.isNaN(parsed.getTime())) return '';
    parsed.setDate(parsed.getDate() + Number(offsetDays || 0));
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' }).format(parsed);
  }

  function setCounter(value) {
    if (!counter) return;
    var c = value && value.campaign;
    if (!c) {
      counter.textContent = 'Launch Experience availability is being prepared.';
      return;
    }
    var reserved = Number(c.reserved_count ?? c.reservation_count ?? 0);
    var remaining = Number(c.remaining_count ?? c.remaining_reservations ?? 0);
    counter.textContent = c.can_reserve !== false
      ? (String(reserved) + ' reserved · ' + String(remaining) + ' remaining')
      : (c.status_message || 'Launch Experience reservations are currently unavailable.');
  }

  function setAuthenticatedState() {
    var remembered = readRememberedServiceability();
    if (remembered && /^\d{6}$/.test(String(remembered.pincode))) {
      pincode.value = remembered.pincode;
      verifiedPincode = remembered.pincode;
      loadAreas();
    }
    gate.hidden = true;
    loginPrompt.hidden = true;
    form.hidden = false;
  }

  function showUnauthenticatedState() {
    form.hidden = true;
    loginPrompt.hidden = true;
    gate.hidden = false;
    var remembered = readRememberedServiceability();
    if (remembered && /^\d{6}$/.test(String(remembered.pincode))) {
      gate.hidden = true;
      gatePincode.value = remembered.pincode;
      setGateStatus('This PIN was already checked for this session. Continue to OTP when ready.');
      loginPrompt.hidden = false;
    }
  }

  function loadCampaign() {
    return api.request('/launch-experience/campaigns/current/', { method: 'GET', auth: false }).then(function (payload) {
      campaign = payload && payload.campaign;
      setCounter(payload);
      var formattedDate = formatCampaignDate(campaign && campaign.delivery_start_date);
      if (formattedDate && campaignDate) campaignDate.textContent = formattedDate;
      var shortDeliveryDate = formatShortCampaignDate(campaign && campaign.delivery_start_date);
      var shortMillingDate = formatShortCampaignDate(campaign && campaign.delivery_start_date, -1);
      if (shortDeliveryDate && successDate) successDate.textContent = shortDeliveryDate;
      if (shortMillingDate && millingDate) millingDate.textContent = shortMillingDate;

      if (!campaign || !campaign.can_reserve) {
        unavailable.hidden = false;
        gate.hidden = true;
        loginPrompt.hidden = true;
        form.hidden = true;
        return;
      }

      if (api.isAuthenticated()) {
        setAuthenticatedState();
        loadExisting();
      } else {
        showUnauthenticatedState();
      }
    }).catch(function () {
      setCounter(null);
      gate.hidden = true;
      loginPrompt.hidden = true;
      unavailable.hidden = false;
    });
  }

  function loadExisting() {
    api.request('/launch-experience/reservations/', { method: 'GET' }).then(function (payload) {
      var rows = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.results) ? payload.results : []);
      var row = rows[0];
      if (!row || !existing) return;
      form.hidden = true;
      unavailable.hidden = true;
      existing.hidden = false;
      document.getElementById('launchExistingReference').textContent = row.reference || row.id || '';
      document.getElementById('launchExistingStatus').textContent = row.status || 'CONFIRMED';
      document.getElementById('launchExistingDelivery').textContent = row.delivery_status || 'UNSCHEDULED';
      document.getElementById('launchExistingDate').textContent = row.scheduled_delivery_date || 'To be assigned by operations';
    }).catch(function () {});
  }

  function checkLaunchServiceability(value, onSuccess, onFailure) {
    api.request('/launch-experience/campaigns/serviceability/', {
      method: 'GET',
      auth: false,
      query: { pincode: value }
    }).then(function (payload) {
      if (payload && payload.serviceable) {
        rememberServiceability(value);
        onSuccess(payload);
      } else {
        onFailure('We are not available for this PIN code yet. Launch reservations are currently limited to eligible South Delhi and North Delhi areas.');
      }
    }).catch(function () {
      onFailure('We could not check this PIN code right now. Please try again.');
    });
  }

  function handleGateSubmit(event) {
    event.preventDefault();
    var value = String(gatePincode.value || '').replace(/\D/g, '');
    gatePincode.value = value;
    gatePincode.removeAttribute('aria-invalid');
    setGateStatus('');
    if (value.length !== 6) {
      gatePincode.setAttribute('aria-invalid', 'true');
      setGateStatus('Enter a valid 6-digit PIN code to check delivery availability.', true);
      gatePincode.focus();
      return;
    }

    gateButton.disabled = true;
    gateButton.textContent = 'Checking…';
    setGateStatus('Checking delivery availability…');
    checkLaunchServiceability(value, function () {
      gate.hidden = true;
      loginPrompt.hidden = false;
      setGateStatus('');
      gateButton.disabled = false;
      gateButton.textContent = 'Check availability';
    }, function (message) {
      gate.hidden = false;
      loginPrompt.hidden = true;
      setGateStatus(message, true);
      gateButton.disabled = false;
      gateButton.textContent = 'Check availability';
    });
  }

  function loadAreas() {
    var value = String(pincode.value || '').replace(/\D/g, '');
    pincode.value = value;
    area.innerHTML = '<option value="">Checking areas…</option>';
    area.disabled = true;
    otherArea.value = '';
    otherArea.required = false;
    otherAreaField.hidden = true;
    serviceability.textContent = '';
    serviceability.classList.remove('is-error');
    if (value !== verifiedPincode) verifiedServiceable = false;
    if (value.length !== 6) {
      verifiedPincode = '';
      area.innerHTML = '<option value="">Enter a 6-digit PIN code</option>';
      return;
    }

    var requestId = ++serviceabilityRequestId;
    api.request('/launch-experience/campaigns/serviceability/', { method: 'GET', auth: false, query: { pincode: value } }).then(function (payload) {
      if (requestId !== serviceabilityRequestId || value !== String(pincode.value || '')) return;
      var areas = Array.isArray(payload && payload.available_area_objects)
        ? payload.available_area_objects
        : (Array.isArray(payload && payload.available_areas) ? payload.available_areas : []);
      area.innerHTML = '<option value="">Choose an area</option>' + areas.map(function (row) {
        var id = (row && typeof row === 'object') ? row.id : '';
        var label = (row && typeof row === 'object') ? row.area : row;
        return '<option value="' + String(id || '').replace(/[&<>"']/g, '') + '">' + String(label || '').replace(/[&<>"']/g, '') + '</option>';
      }).join('');
      if (payload && payload.allow_custom_area) area.insertAdjacentHTML('beforeend', '<option value="' + otherAreaValue + '">Others</option>');
      verifiedPincode = value;
      verifiedServiceable = Boolean(payload && payload.serviceable);
      if (verifiedServiceable) rememberServiceability(value);
      area.disabled = !verifiedServiceable;
      serviceability.textContent = verifiedServiceable
        ? (areas.length ? 'This PIN is eligible for the Launch Experience.' : 'This PIN is covered. Enter your delivery locality to continue.')
        : 'No eligible Launch Experience area was found for this PIN.';
      serviceability.classList.toggle('is-error', !verifiedServiceable);
      if (!verifiedServiceable) pincode.setAttribute('aria-invalid', 'true');
      if (!areas.length && payload && payload.allow_custom_area && verifiedServiceable) {
        area.value = otherAreaValue;
        otherAreaField.hidden = false;
        otherArea.required = true;
      }
    }).catch(function () {
      if (requestId !== serviceabilityRequestId) return;
      verifiedPincode = '';
      verifiedServiceable = false;
      area.innerHTML = '<option value="">Unable to check this PIN</option>';
      serviceability.textContent = 'We could not check this PIN code. Please try again.';
      serviceability.classList.add('is-error');
    });
  }

  area.addEventListener('change', function () {
    var isCustom = area.value === otherAreaValue;
    otherAreaField.hidden = !isCustom;
    otherArea.required = isCustom;
  });

  pincode.addEventListener('input', loadAreas);
  gateForm.addEventListener('submit', handleGateSubmit);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setNotice('');
    clearInvalidFields();
    var data = new FormData(form);
    var fullName = String(data.get('full_name') || '').trim();
    var consumption = String(data.get('monthly_consumption_band') || '').trim();
    var pincodeValue = String(data.get('pincode') || '').replace(/\D/g, '');
    var areaValue = String(data.get('area_id') || '').trim();
    var addressLine = String(data.get('address_line') || '').trim();
    var customArea = areaValue === otherAreaValue;
    var areaName = String(otherArea.value || '').trim();
    var consent = form.querySelector('input[name="household_confirmed"]');

    if (!fullName) return markInvalid(form.querySelector('[name="full_name"]'), 'Enter your full name to continue.');
    if (!consumption) return markInvalid(form.querySelector('[name="monthly_consumption_band"]'), 'Select your household atta consumption range.');
    if (pincodeValue.length !== 6) return markInvalid(pincode, 'Enter a valid 6-digit PIN code.');
    if (!verifiedServiceable || verifiedPincode !== pincodeValue) return markInvalid(pincode, 'Check this PIN code before continuing. We can only accept eligible Launch Experience areas.');
    if (!areaValue) return markInvalid(area, 'Choose your delivery area.');
    if (customArea && !areaName) return markInvalid(otherArea, 'Enter your area or locality to continue.');
    if (!addressLine) return markInvalid(form.querySelector('[name="address_line"]'), 'Enter your complete delivery address.');
    if (!consent || !consent.checked) return markInvalid(consent, 'Please confirm that the delivery details are correct.');

    var key = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ('launch-' + Date.now() + '-' + Math.random().toString(16).slice(2));
    submit.disabled = true;
    submit.textContent = 'Reserving…';
    api.request('/launch-experience/reservations/', {
      method: 'POST',
      body: {
        campaign_id: campaign.id,
        full_name: fullName,
        monthly_consumption_band: consumption,
        household_confirmed: consent.checked,
        delivery_address: {
          pincode: pincodeValue,
          area_id: customArea ? null : Number(areaValue),
          area: customArea ? areaName : undefined,
          area_is_custom: customArea,
          address_line: addressLine,
          full_address: addressLine
        }
      },
      headers: { 'Idempotency-Key': key }
    }).then(function (payload) {
      form.hidden = true;
      success.hidden = false;
      if (launchReference) launchReference.textContent = payload.reference || payload.reservation_reference || 'confirmed';
    }).catch(function (error) {
      setNotice(error && error.message ? error.message : 'We could not reserve this Launch Experience. Please check the details and try again.');
      submit.disabled = false;
      submit.textContent = 'Reserve my launch experience →';
    });
  });

  if (api) loadCampaign();
  else {
    setNotice('Atulyash services are unavailable.');
    unavailable.hidden = false;
  }
})();
