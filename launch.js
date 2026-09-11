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
  var serviceability = document.getElementById('launchServiceability');
  var submit = document.getElementById('launchSubmit');

  function setNotice(message, isSuccess) { notice.textContent = message || ''; notice.classList.toggle('success', Boolean(isSuccess)); }
  function session() { return api && api.getSession ? api.getSession() : {}; }
  function setCounter(value) {
    var c = value && value.campaign;
    if (!c) { counter.textContent = 'Launch Experience availability is being prepared.'; return; }
    counter.textContent = c.can_reserve ? (c.reserved_count.toLocaleString() + ' reserved · ' + c.remaining_count.toLocaleString() + ' remaining') : c.status_message;
  }
  function loadCampaign() {
    return api.request('/launch-experience/campaigns/current/', { method: 'GET', auth: false }).then(function (payload) {
      campaign = payload && payload.campaign;
      setCounter(payload);
      if (api.isAuthenticated()) loadExisting();
      if (campaign && campaign.can_reserve) {
        if (api.isAuthenticated()) form.hidden = false; else loginPrompt.hidden = false;
      } else { unavailable.hidden = false; }
    }).catch(function () { setCounter(null); unavailable.hidden = false; });
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
  function loadAreas() {
    var value = String(pincode.value || '').replace(/\D/g, '');
    pincode.value = value;
    area.innerHTML = '<option value="">Checking areas…</option>';
    area.disabled = true;
    serviceability.textContent = '';
    if (value.length !== 6) { area.innerHTML = '<option value="">Enter a 6-digit PIN code</option>'; return; }
    api.request('/launch-experience/campaigns/serviceability/', { method: 'GET', auth: false, query: { pincode: value } }).then(function (payload) {
      var areas = Array.isArray(payload && payload.available_areas) ? payload.available_areas : [];
      area.innerHTML = '<option value="">Choose an area</option>' + areas.map(function (row) { return '<option value="' + String(row.id) + '">' + String(row.area).replace(/[&<>"']/g, '') + '</option>'; }).join('');
      area.disabled = !areas.length;
      serviceability.textContent = areas.length ? 'This PIN is eligible for the Launch Experience.' : 'No eligible Launch Experience area was found for this PIN.';
    }).catch(function () { area.innerHTML = '<option value="">Unable to check this PIN</option>'; });
  }
  pincode.addEventListener('input', loadAreas);
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setNotice('');
    var data = new FormData(form);
    var addressLine = data.get('address_line');
    var key = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ('launch-' + Date.now() + '-' + Math.random().toString(16).slice(2));
    submit.disabled = true; submit.textContent = 'Reserving…';
    api.request('/launch-experience/reservations/', { method: 'POST', body: { campaign_id: campaign.id, full_name: data.get('full_name'), monthly_consumption_band: data.get('monthly_consumption_band'), household_confirmed: data.get('household_confirmed') === 'on', delivery_address: { pincode: data.get('pincode'), area_id: Number(data.get('area_id')), address_line: addressLine, full_address: addressLine } }, headers: { 'Idempotency-Key': key } }).then(function (payload) {
      form.hidden = true; success.hidden = false; document.getElementById('launchReference').textContent = payload.reference || payload.reservation_reference || 'confirmed';
    }).catch(function (error) { setNotice(error && error.message ? error.message : 'We could not reserve this Launch Experience. Please try again.'); submit.disabled = false; submit.textContent = 'Reserve my launch experience →'; });
  });
  if (api) loadCampaign(); else { setNotice('Atulyash services are unavailable.'); unavailable.hidden = false; }
})();
