(function launchExperiencePage() {
  'use strict';

  var api = window.AtulyashAPI;
  // The launch-offer page no longer asks this; keep the request compatible with the existing API enum.
  var defaultConsumptionBand = 'UP_TO_5_KG';
  var campaign = null;
  var form = document.getElementById('launchReservationForm');
  var unavailable = document.getElementById('launchUnavailable');
  var unavailableTitle = document.getElementById('launchUnavailableTitle');
  var unavailableMessage = document.getElementById('launchUnavailableMessage');
  var existing = document.getElementById('launchExisting');
  var success = document.getElementById('launchSuccess');
  var loginPrompt = document.getElementById('launchLoginPrompt');
  var notice = document.getElementById('launchNotice');
  var counter = document.getElementById('launchCounter');
  var pincode = document.getElementById('launchPincode');
  var serviceability = document.getElementById('launchServiceability');
  var serviceabilityTitle = document.getElementById('launchServiceabilityTitle');
  var serviceabilityMessage = document.getElementById('launchServiceabilityMessage');
  var editPincode = document.getElementById('launchEditPincode');
  var reservationLayout = document.querySelector('.launch-reservation-layout');
  var submit = document.getElementById('launchSubmit');
  var campaignDate = document.getElementById('launchCampaignDate');
  var millingDate = document.getElementById('launchMillingDate');
  var successDate = document.getElementById('launchSuccessDate');
  var launchReference = document.getElementById('launchReference');
  var mobileInput = document.getElementById('launchMobile');
  var otpPanel = document.getElementById('launchOtpPanel');
  var otpPhone = document.getElementById('launchOtpPhone');
  var otpCode = document.getElementById('launchOtpCode');
  var otpStatus = document.getElementById('launchOtpStatus');
  var otpVerify = document.getElementById('launchOtpVerify');
  var otpResend = document.getElementById('launchOtpResend');
  var otpChange = document.getElementById('launchOtpChange');
  var leadSaved = document.getElementById('launchServiceabilityLeadSaved');
  var leadName = document.getElementById('launchLeadName');
  var leadEdit = document.getElementById('launchLeadEdit');
  var followupConsentPanel = document.getElementById('launchFollowupConsentPanel');
  var followupConsent = form.querySelector('input[name="serviceability_followup_consent"]');
  var offerReservationStatus = document.getElementById('offerReservationStatus');
  var offerMillingDate = document.getElementById('offerMillingDate');
  var offerDeliveryDate = document.getElementById('offerDeliveryDate');
  var mobileCta = document.getElementById('launchMobileCta');
  var otpMobile = '';
  var otpVerified = false;
  var areaUnavailable = false;
  var campaignStatusResolved = false;

  function setNotice(message, isSuccess) {
    notice.textContent = message || '';
    notice.classList.toggle('success', Boolean(isSuccess));
  }

  function setOtpStatus(message, isError) {
    otpStatus.textContent = message || '';
    otpStatus.classList.toggle('is-error', Boolean(isError));
  }

  function setServiceability(state, title, message) {
    serviceability.hidden = !state;
    serviceability.dataset.state = state || '';
    serviceabilityTitle.textContent = title || '';
    serviceabilityMessage.textContent = message || '';
    areaUnavailable = state === 'unavailable';
    reservationLayout.classList.toggle('is-area-unavailable', areaUnavailable);
  }

  function formatMobile(value) {
    var digits = String(value || '').replace(/\D/g, '').slice(0, 10);
    return digits.length === 10 ? '+91 ' + digits.slice(0, 5) + ' ' + digits.slice(5) : digits;
  }

  function showReservationForm() {
    unavailable.hidden = true;
    loginPrompt.hidden = true;
    leadSaved.hidden = true;
    followupConsentPanel.hidden = true;
    form.hidden = false;
  }

  function showOtpPanel() {
    otpPanel.hidden = false;
    submit.hidden = true;
    otpResend.hidden = false;
    otpChange.hidden = false;
    otpVerify.textContent = 'Verify and reserve →';
    mobileInput.readOnly = true;
    mobileInput.setAttribute('aria-readonly', 'true');
    otpPhone.textContent = formatMobile(otpMobile);
    otpCode.value = '';
    setOtpStatus('Enter the latest code sent to your mobile.');
    window.setTimeout(function focusOtp() { otpCode.focus(); }, 40);
  }

  function hideOtpPanel() {
    otpPanel.hidden = true;
    submit.hidden = false;
    if (!api.isAuthenticated()) {
      mobileInput.readOnly = false;
      mobileInput.removeAttribute('aria-readonly');
    }
    otpMobile = '';
    otpCode.value = '';
    setOtpStatus('');
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

  function formatOfferDate(value, offsetDays) {
    if (!value) return '';
    var parsed = new Date(String(value) + 'T00:00:00+05:30');
    if (Number.isNaN(parsed.getTime())) return '';
    parsed.setDate(parsed.getDate() + Number(offsetDays || 0));
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata'
    }).format(parsed);
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
    var session = api.getSession ? api.getSession() : {};
    otpVerified = true;
    if (mobileInput && session.mobile) {
      mobileInput.value = String(session.mobile).replace(/\D/g, '').slice(0, 10);
      mobileInput.readOnly = true;
      mobileInput.setAttribute('aria-readonly', 'true');
    }
    showReservationForm();
  }

  function showUnauthenticatedState() {
    showReservationForm();
  }

  function loadCampaign() {
    return api.request('/launch-experience/campaigns/current/', { method: 'GET', auth: false }).then(function (payload) {
      campaignStatusResolved = true;
      campaign = payload && payload.campaign;
      setCounter(payload);
      var formattedDate = formatCampaignDate(campaign && campaign.delivery_start_date);
      if (formattedDate && campaignDate) campaignDate.textContent = formattedDate;
      if (offerReservationStatus) {
        offerReservationStatus.textContent = campaign && campaign.can_reserve
          ? 'Reservations are open now'
          : (campaign && campaign.status_message ? campaign.status_message : 'Reservations are currently unavailable');
      }
      var offerDelivery = formatOfferDate(campaign && campaign.delivery_start_date);
      var offerMilling = formatOfferDate(campaign && campaign.delivery_start_date, -1);
      if (offerDelivery && offerDeliveryDate) offerDeliveryDate.textContent = offerDelivery;
      if (offerMilling && offerMillingDate) offerMillingDate.textContent = offerMilling;
      var shortDeliveryDate = formatShortCampaignDate(campaign && campaign.delivery_start_date);
      var shortMillingDate = formatShortCampaignDate(campaign && campaign.delivery_start_date, -1);
      if (shortDeliveryDate && successDate) successDate.textContent = shortDeliveryDate;
      if (shortMillingDate && millingDate) millingDate.textContent = shortMillingDate;

      if (!campaign || !campaign.can_reserve) {
        if (unavailableTitle) unavailableTitle.textContent = campaign && campaign.status_message
          ? campaign.status_message
          : 'Reservations are currently unavailable.';
        if (unavailableMessage) unavailableMessage.textContent = 'Your details form is available, but a reservation can only be confirmed while the campaign is open.';
        unavailable.hidden = false;
        return;
      }

      unavailable.hidden = true;
      if (api.isAuthenticated()) {
        setAuthenticatedState();
        loadExisting();
      } else {
        showUnauthenticatedState();
      }
  }).catch(function () {
      campaignStatusResolved = true;
      setCounter(null);
      if (offerReservationStatus) offerReservationStatus.textContent = 'Reservation availability is being checked';
      if (unavailableTitle) unavailableTitle.textContent = 'We couldn’t check reservation availability.';
      if (unavailableMessage) unavailableMessage.textContent = 'The form is ready to fill in, but please try again once Atulyash services are reachable.';
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

  function checkLaunchServiceability(value) {
    return api.request('/launch-experience/campaigns/serviceability/', {
      method: 'GET',
      auth: false,
      query: { pincode: value }
    }).then(function (payload) { return Boolean(payload && payload.serviceable); });
  }

  function restoreSubmitButton() {
    submit.disabled = false;
    if (areaUnavailable) {
      submit.hidden = !followupConsent.checked;
      submit.textContent = 'Request an update →';
    } else {
      submit.hidden = false;
      submit.textContent = 'Check my PIN and reserve';
    }
    otpVerify.disabled = false;
    otpResend.disabled = false;
    if (!otpPanel.hidden && otpVerified) otpVerify.textContent = 'Try again →';
  }

  function saveServiceabilityLead(details) {
    followupConsentPanel.hidden = false;
    if (!details.followupConsent) {
      setServiceability(
        'unavailable',
        'Delivery isn’t available in this area yet',
        'No reservation was created and your details have not been saved. Change the PIN to check another area, or choose the optional follow-up below.'
      );
      setNotice('');
      restoreSubmitButton();
      followupConsent.focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Saving your interest…';
    api.request('/launch-experience/serviceability-leads/', {
      method: 'POST',
      body: {
        campaign_id: campaign.id,
        full_name: details.fullName,
        mobile_number: details.mobile,
        monthly_consumption_band: details.consumption,
        pincode: details.pincode,
        address_line: details.addressLine,
        contact_consent: true
      }
    }).then(function () {
      leadName.textContent = details.fullName;
      form.hidden = true;
      leadSaved.hidden = false;
      setNotice('');
    }).catch(function (error) {
      setNotice(error && error.message ? error.message : 'We could not save your area interest. No reservation was created. Please try again.');
      restoreSubmitButton();
    });
  }

  function continueAfterServiceabilityCheck(details) {
    if (!campaignStatusResolved) {
      setNotice('We’re checking reservation availability. Please try again in a moment.');
      return;
    }
    if (!campaign || !campaign.can_reserve) {
      setNotice(campaign && campaign.status_message
        ? campaign.status_message
        : 'Reservations are currently unavailable. Please check back later.');
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Checking your area…';
    submit.hidden = false;
    followupConsentPanel.hidden = true;
    setServiceability('checking', 'Checking your delivery PIN', 'We’re confirming whether delivery is available at this address.');
    checkLaunchServiceability(details.pincode).then(function (isServiceable) {
      if (!isServiceable) {
        followupConsentPanel.hidden = false;
        saveServiceabilityLead(details);
        return;
      }
      followupConsentPanel.hidden = true;
      setServiceability('available', 'Good news — we serve this area', 'Next, we’ll verify your mobile before confirming the complimentary reservation.');
      if (!api.isAuthenticated() && !otpVerified) requestLaunchOtp(details);
      else reserveLaunchExperience(details);
    }).catch(function () {
      setServiceability('error', 'We couldn’t check this PIN', 'No OTP was sent and no details were saved. Please try again in a moment.');
      setNotice('');
      restoreSubmitButton();
    });
  }

  pincode.addEventListener('input', function () {
    pincode.removeAttribute('aria-invalid');
    setServiceability('', '', '');
    followupConsent.checked = false;
    followupConsentPanel.hidden = true;
    submit.hidden = false;
    submit.disabled = false;
    submit.textContent = 'Check my PIN and reserve';
  });

  followupConsent.addEventListener('change', function () {
    if (areaUnavailable) restoreSubmitButton();
  });

  editPincode.addEventListener('click', function () {
    pincode.focus();
    pincode.select();
  });

  function readReservationDetails() {
    var data = new FormData(form);
    var fullName = String(data.get('full_name') || '').trim();
    var mobile = String(data.get('mobile') || '').replace(/\D/g, '').slice(-10);
    var houseBuilding = String(data.get('house_building') || '').trim();
    var streetAreaLandmark = String(data.get('street_area_landmark') || '').trim();
    var city = String(data.get('city') || '').trim();
    var pincodeValue = String(data.get('pincode') || '').replace(/\D/g, '');
    var addressLine = [houseBuilding, streetAreaLandmark, city].filter(Boolean).join(', ');
    var consent = form.querySelector('input[name="household_confirmed"]');

    if (!fullName) return markInvalid(form.querySelector('[name="full_name"]'), 'Enter your full name to continue.');
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return markInvalid(mobileInput, 'Enter a valid 10-digit Indian mobile number.');
    }
    if (!houseBuilding) return markInvalid(form.querySelector('[name="house_building"]'), 'Enter your house or flat number and building.');
    if (!streetAreaLandmark) return markInvalid(form.querySelector('[name="street_area_landmark"]'), 'Enter your street, area and a nearby landmark.');
    if (!city) return markInvalid(form.querySelector('[name="city"]'), 'Enter your city.');
    if (pincodeValue.length !== 6) return markInvalid(pincode, 'Enter a valid 6-digit PIN code.');
    if (!consent || !consent.checked) return markInvalid(consent, 'Please confirm that the delivery details are correct.');

    return {
      fullName: fullName,
      consumption: defaultConsumptionBand,
      mobile: mobile,
      pincode: pincodeValue,
      addressLine: addressLine,
      consent: consent,
      followupConsent: Boolean(followupConsent && followupConsent.checked)
    };
  }

  function reserveLaunchExperience(details) {
    var key = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ('launch-' + Date.now() + '-' + Math.random().toString(16).slice(2));
    submit.disabled = true;
    submit.textContent = 'Reserving…';
    otpVerify.disabled = true;
    otpResend.disabled = true;
    api.request('/launch-experience/reservations/', {
      method: 'POST',
      body: {
        campaign_id: campaign.id,
        full_name: details.fullName,
        monthly_consumption_band: details.consumption,
        household_confirmed: details.consent.checked,
        delivery_address: {
          pincode: details.pincode,
          address_line: details.addressLine,
          full_address: details.addressLine
        }
      },
      headers: { 'Idempotency-Key': key }
    }).then(function (payload) {
      form.hidden = true;
      success.hidden = false;
      if (launchReference) launchReference.textContent = payload.reference || payload.reservation_reference || 'confirmed';
    }).catch(function (error) {
      if (error && ['PINCODE_NOT_ELIGIBLE', 'AREA_NOT_ELIGIBLE', 'HUB_NOT_ELIGIBLE'].indexOf(error.code) !== -1) {
        setServiceability(
          'unavailable',
          'Delivery isn’t available in this area yet',
          'Availability changed while we were confirming. No reservation was created. You can check another PIN or request an area update below.'
        );
        followupConsentPanel.hidden = false;
        saveServiceabilityLead(details);
        return;
      }
      setNotice(error && error.message ? error.message : 'We could not reserve this Launch Experience. Please check the details and try again.');
      submit.disabled = false;
      submit.textContent = 'Check my PIN and reserve';
      otpVerify.disabled = false;
      otpResend.disabled = false;
      if (!otpPanel.hidden && otpVerified && api.isAuthenticated()) {
        otpResend.hidden = true;
        otpChange.hidden = true;
        otpVerify.textContent = 'Retry reservation →';
        setOtpStatus('Your mobile is verified. Check the details above, then retry your reservation.', true);
      }
    });
  }

  function requestLaunchOtp(details) {
    otpMobile = details.mobile;
    submit.disabled = true;
    submit.textContent = 'Sending secure code…';
    api.auth.requestOtp(otpMobile).then(function () {
      submit.disabled = false;
      showOtpPanel();
    }).catch(function (error) {
      setNotice(error && error.message ? error.message : 'We could not send the OTP. Please check your number and try again.');
      submit.disabled = false;
      submit.textContent = 'Check my PIN and reserve';
    });
  }

  function verifyLaunchOtp() {
    var value = String(otpCode.value || '').replace(/\D/g, '').slice(0, 4);
    otpCode.value = value;
    if (!/^\d{4}$/.test(value)) {
      otpCode.setAttribute('aria-invalid', 'true');
      setOtpStatus('Enter the complete 4-digit code.', true);
      otpCode.focus();
      return;
    }

    otpCode.removeAttribute('aria-invalid');
    otpVerify.disabled = true;
    otpResend.disabled = true;
    setOtpStatus('Verifying securely…');
    if (otpVerified && api.isAuthenticated()) {
      setOtpStatus('Mobile already verified. Retrying your reservation…');
      var existingDetails = readReservationDetails();
      if (existingDetails) continueAfterServiceabilityCheck(existingDetails);
      else {
        otpVerify.disabled = false;
        otpResend.disabled = false;
        setOtpStatus('Please correct the highlighted details and try again.', true);
      }
      return;
    }
    api.auth.verifyOtp(otpMobile, value).then(function () {
      otpVerified = true;
      mobileInput.value = otpMobile;
      mobileInput.readOnly = true;
      mobileInput.setAttribute('aria-readonly', 'true');
      otpResend.hidden = true;
      otpChange.hidden = true;
      otpVerify.textContent = 'Confirming reservation…';
      setOtpStatus('Mobile verified. Confirming your complimentary reservation…');
      var details = readReservationDetails();
      if (details) continueAfterServiceabilityCheck(details);
      else {
        otpVerify.disabled = false;
        otpVerify.textContent = 'Retry reservation →';
        setOtpStatus('Please correct the highlighted details and try again.', true);
      }
    }).catch(function (error) {
      otpVerify.disabled = false;
      otpResend.disabled = false;
      setOtpStatus(error && error.message ? error.message : 'That code could not be verified. Please try again.', true);
      otpCode.select();
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setNotice('');
    clearInvalidFields();
    var details = readReservationDetails();
    if (!details) return;
    continueAfterServiceabilityCheck(details);
  });

  mobileInput.addEventListener('input', function () {
    mobileInput.value = mobileInput.value.replace(/\D/g, '').slice(0, 10);
    mobileInput.removeAttribute('aria-invalid');
  });
  otpCode.addEventListener('input', function () {
    otpCode.value = otpCode.value.replace(/\D/g, '').slice(0, 4);
    otpCode.removeAttribute('aria-invalid');
    setOtpStatus('');
  });
  otpCode.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      verifyLaunchOtp();
    }
  });
  otpVerify.addEventListener('click', verifyLaunchOtp);
  otpResend.addEventListener('click', function () {
    otpResend.disabled = true;
    otpVerify.disabled = true;
    setOtpStatus('Sending a new code…');
    api.auth.requestOtp(otpMobile).then(function () {
      otpResend.disabled = false;
      otpVerify.disabled = false;
      otpCode.value = '';
      setOtpStatus('A new code has been sent.');
      otpCode.focus();
    }).catch(function (error) {
      otpResend.disabled = false;
      otpVerify.disabled = false;
      setOtpStatus(error && error.message ? error.message : 'We could not resend the OTP. Please try again.', true);
    });
  });
  otpChange.addEventListener('click', function () {
    otpVerified = false;
    hideOtpPanel();
    mobileInput.focus();
  });
  leadEdit.addEventListener('click', function () {
    leadSaved.hidden = true;
    showReservationForm();
    setNotice('');
    submit.focus();
  });

  if (mobileCta) {
    if ('IntersectionObserver' in window) {
      var mobileCtaObserver = new IntersectionObserver(function (entries) {
        mobileCta.hidden = Boolean(entries[0] && entries[0].isIntersecting);
      }, { threshold: 0.01 });
      mobileCtaObserver.observe(document.getElementById('reservation'));
    } else {
      mobileCta.hidden = false;
    }
  }

  if (api) loadCampaign();
  else {
    campaignStatusResolved = true;
    setNotice('Atulyash services are unavailable.');
    if (unavailableTitle) unavailableTitle.textContent = 'Atulyash services are unavailable.';
    if (unavailableMessage) unavailableMessage.textContent = 'You can fill in the form, but reservations cannot be confirmed until the service is restored.';
    unavailable.hidden = false;
  }
})();
