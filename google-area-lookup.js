(() => {
  'use strict';

  const SDK_ID = 'atulyash-google-maps-sdk';
  // Browser-restricted Maps JavaScript API key. Restrict this key in Google Cloud
  // to the production domains and localhost during development.
  const DEFAULT_GOOGLE_MAPS_API_KEY = 'AIzaSyDZgaOD2OrTsp19C1WsFyHxXTyVRJ__d9c';
  const areaCache = new Map();
  let mapsLoadPromise = null;

  function configuredKey() {
    return String(window.ATULYASH_GOOGLE_MAPS_API_KEY || DEFAULT_GOOGLE_MAPS_API_KEY).trim();
  }

  function fail(message) {
    return Promise.reject(new Error(message));
  }

  function loadMaps() {
    const key = configuredKey();
    if (!key) return fail('Google area lookup is not configured.');
    if (window.google?.maps?.Geocoder) return Promise.resolve(window.google.maps);
    if (mapsLoadPromise) return mapsLoadPromise;

    mapsLoadPromise = new Promise((resolve, reject) => {
      const existing = document.getElementById(SDK_ID);
      if (existing) {
        existing.addEventListener('load', () => resolve(window.google?.maps), { once: true });
        existing.addEventListener('error', () => reject(new Error('Google Maps could not be loaded.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = SDK_ID;
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly`;
      script.onload = () => {
        if (window.google?.maps?.Geocoder) resolve(window.google.maps);
        else reject(new Error('Google Maps loaded without the geocoding service.'));
      };
      script.onerror = () => reject(new Error('Google Maps could not be loaded.'));
      document.head.append(script);
    });

    return mapsLoadPromise;
  }

  function componentValue(components, types) {
    return components.find((component) => types.some((type) => component.types?.includes(type)))?.long_name || '';
  }

  function areaCandidates(results) {
    const names = [];
    const add = (value) => {
      const name = String(value || '').trim();
      if (name && !names.some((entry) => entry.localeCompare(name, 'en', { sensitivity: 'accent' }) === 0)) names.push(name);
    };
    const areaTypes = [
      'sublocality_level_1',
      'sublocality',
      'neighborhood',
      'locality',
      'administrative_area_level_3',
      'administrative_area_level_2'
    ];

    results.forEach((result) => {
      const components = Array.isArray(result?.address_components) ? result.address_components : [];
      const postalComponent = components.find((component) => component.types?.includes('postal_code'));
      (result?.postcode_localities || postalComponent?.postcode_localities || []).forEach(add);
      areaTypes.forEach((type) => add(componentValue(components, [type])));
    });
    return names;
  }

  async function lookupIndianPincode(value) {
    const pincode = String(value || '').replace(/\D/g, '').slice(0, 6);
    if (!/^\d{6}$/.test(pincode)) throw new Error('Enter a valid 6-digit PIN code.');
    if (areaCache.has(pincode)) return { ...areaCache.get(pincode) };

    const maps = await loadMaps();
    if (typeof maps.importLibrary === 'function') await maps.importLibrary('geocoding');
    const geocoder = new maps.Geocoder();
    const response = await geocoder.geocode({
      address: `${pincode}, India`,
      componentRestrictions: { country: 'IN' },
      region: 'IN'
    });
    const results = Array.isArray(response?.results) ? response.results : [];
    const areas = areaCandidates(results);
    if (!areas.length) throw new Error('Google could not identify an area for this PIN code.');

    const components = results.flatMap((result) => result?.address_components || []);
    const result = {
      pincode,
      areas,
      selectedArea: areas[0],
      city: componentValue(components, ['locality', 'postal_town']) || componentValue(components, ['administrative_area_level_2']),
      state: componentValue(components, ['administrative_area_level_1'])
    };
    areaCache.set(pincode, result);
    return { ...result };
  }

  async function reverseGeocodeCoordinates(latitude, longitude) {
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new Error('A valid map location is required.');
    }

    const maps = await loadMaps();
    if (typeof maps.importLibrary === 'function') await maps.importLibrary('geocoding');
    const geocoder = new maps.Geocoder();
    const response = await geocoder.geocode({ location: { lat, lng } });
    const results = Array.isArray(response?.results) ? response.results : [];
    const first = results[0];
    if (!first) throw new Error('Google could not identify this map location.');

    const components = results.flatMap((result) => result?.address_components || []);
    const pincode = componentValue(components, ['postal_code']).replace(/\D/g, '').slice(0, 6);
    const areas = areaCandidates(results);
    return {
      latitude: lat,
      longitude: lng,
      formattedAddress: first.formatted_address || '',
      pincode,
      areas,
      selectedArea: areas[0] || '',
      city: componentValue(components, ['locality', 'postal_town']) || componentValue(components, ['administrative_area_level_2']),
      state: componentValue(components, ['administrative_area_level_1'])
    };
  }

  window.AtulyashGoogleAreaLookup = Object.freeze({
    isConfigured: () => Boolean(configuredKey()),
    loadMaps,
    lookupIndianPincode,
    reverseGeocodeCoordinates
  });
})();
