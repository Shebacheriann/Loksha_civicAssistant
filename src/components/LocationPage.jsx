import React, { useState } from 'react';
import {
  ChevronLeft,
  MapPin,
  Map as MapIcon,
  Edit3,
  Check,
  Sparkles,
  Search,
  Navigation,
  CheckCircle2,
  AlertCircle,
  MousePointer2
} from 'lucide-react';

const methods = [
  {
    id: 'current',
    title: 'Use Current Location',
    description: 'Ask your device for its current position',
    icon: Navigation
  },
  {
    id: 'map',
    title: 'Choose on Map',
    description: 'Place a pin without sharing your device location',
    icon: MapIcon
  },
  {
    id: 'address',
    title: 'Enter Address',
    description: 'Type an address or landmark manually',
    icon: Edit3
  }
];

export default function LocationPage({ initialLocation, onSaveLocation, onBack }) {
  const [method, setMethod] = useState(null);
  const [step, setStep] = useState(1);
  const [addressText, setAddressText] = useState(initialLocation || '');
  const [searchQuery, setSearchQuery] = useState(initialLocation || '');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [coords, setCoords] = useState(null);
  const [mapPoint, setMapPoint] = useState(null);
  const [manualCoords, setManualCoords] = useState({ lat: '', lng: '' });

  const selectMethod = (nextMethod) => {
    setMethod(nextMethod);
    setStep(nextMethod === 'map' ? 2 : 1);
    setLocationError('');
    setStatusMessage('');
    setIsLocating(false);
    setCoords(null);
    setMapPoint(null);

    if (nextMethod === 'address') {
      setSearchQuery(addressText || '');
    } else if (nextMethod === 'map') {
      setAddressText('');
    }
  };

  const handleSelectCurrentLocation = () => {
    setMethod('current');
    setStep(1);
    setLocationError('');
    setStatusMessage('');
    setIsLocating(true);
    setCoords(null);
    setMapPoint(null);

    if (!navigator.geolocation) {
      setIsLocating(false);
      setLocationError('Location services are not available in this browser. You can choose the map or address option instead.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoords(nextCoords);
        setAddressText('Current device location');
        setMapPoint({ left: 50, top: 50 });
        setStatusMessage('Your browser provided this location. An address lookup service is not configured, so the address is not being guessed.');
        setIsLocating(false);
        setStep(2);
      },
      (error) => {
        setIsLocating(false);
        setStep(1);
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? 'Location permission was denied. You can choose the map or address option instead.'
            : 'We could not get your current location. You can choose the map or address option instead.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSearchAddress = (event) => {
    event.preventDefault();
    const nextAddress = searchQuery.trim();
    if (!nextAddress) return;

    setAddressText(nextAddress);
    setCoords(null);
    setMapPoint(null);
    setLocationError('');
    setStatusMessage('Address captured for review. A geocoding service is not configured, so Loksha will not invent coordinates or a map result.');
    setStep(2);
  };

  const handleMapClick = (event) => {
    if (method === 'current') return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const left = Math.min(94, Math.max(6, ((event.clientX - bounds.left) / bounds.width) * 100));
    const top = Math.min(90, Math.max(10, ((event.clientY - bounds.top) / bounds.height) * 100));

    setMapPoint({ left, top });
    setCoords(null);
    setLocationError('');
    setStatusMessage(
      method === 'map'
        ? 'Pin selected on the map preview. Add latitude and longitude below if you have them; a map provider is required to resolve them automatically.'
        : 'The address is ready to review. You can also place a reference pin, but it will not be treated as a real geocoded result.'
    );
  };

  const handleManualCoordinateChange = (key, value) => {
    setManualCoords((previous) => ({ ...previous, [key]: value }));
    setCoords(null);
  };

  const getManualCoordinates = () => {
    const lat = Number(manualCoords.lat);
    const lng = Number(manualCoords.lng);
    if (
      manualCoords.lat === '' ||
      manualCoords.lng === '' ||
      Number.isNaN(lat) ||
      Number.isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return null;
    }
    return { lat, lng };
  };

  const selectedCoordinates = coords || getManualCoordinates();
  const canConfirm =
    (method === 'current' && Boolean(coords)) ||
    (method === 'map' && Boolean(mapPoint)) ||
    (method === 'address' && Boolean(addressText.trim()));

  const handleConfirmLocation = () => {
    if (!canConfirm) {
      setLocationError(
        method === 'map'
          ? 'Select a point on the map before confirming this location.'
          : 'Add an address or request your current location before confirming.'
      );
      return;
    }

    setLocationError('');
    setStatusMessage('Location details are ready. Review them once more, then save the confirmed location.');
    setStep(3);
  };

  const handleFinalSave = () => {
    if (!canConfirm) return;

    onSaveLocation({
      address:
        addressText.trim() ||
        (method === 'map' ? 'Selected map point' : 'Current device location'),
      lat: selectedCoordinates?.lat ?? null,
      lng: selectedCoordinates?.lng ?? null,
      isConfirmed: true,
      source: method
    });
  };

  const handleBack = () => {
    if (step > 1 && method && method !== 'map') {
      setStep(1);
      setLocationError('');
      return;
    }
    if (method) {
      setMethod(null);
      setLocationError('');
      setStatusMessage('');
      return;
    }
    onBack();
  };

  return (
    <div className="file-complaint-page location-full-page">
      <div className="top-nav-bar">
        <button className="back-btn" onClick={handleBack} aria-label="Back">
          <ChevronLeft size={20} />
        </button>
        <span className="nav-page-title">Confirm Location</span>
        <div className="top-nav-spacer" />
      </div>

      <div className="location-page-content">
        <div className="page-header-group">
          <span className="page-eyebrow">Complaint details</span>
          <h1 className="page-main-title">Confirm Location</h1>
          <p className="page-subtitle">
            Choose the safest and most accurate way to tell officers where the issue is.
          </p>
        </div>

        {!method && (
          <div className="location-methods-list">
            {methods.map(({ id, title, description, icon: Icon }) => (
              <button
                type="button"
                className="location-method-card"
                key={id}
                onClick={() => (id === 'current' ? handleSelectCurrentLocation() : selectMethod(id))}
              >
                <span className={`method-icon-box ${id}`}>
                  <Icon size={22} />
                </span>
                <span className="method-info">
                  <strong className="method-title">{title}</strong>
                  <span className="method-sub">{description}</span>
                </span>
                <span className="method-card-arrow">›</span>
              </button>
            ))}
          </div>
        )}

        {method && (
          <div className="location-workflow-container">
            <div className="location-method-tabs" role="tablist" aria-label="Location method">
              {methods.map(({ id, title, icon: Icon }) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={method === id}
                  className={`location-method-tab ${method === id ? 'active' : ''}`}
                  key={id}
                  onClick={() => selectMethod(id)}
                >
                  <Icon size={15} />
                  <span>{title}</span>
                </button>
              ))}
            </div>

            <div className="step-breadcrumb" aria-label="Location progress">
              <span className={`step-chip ${step >= 1 ? 'active' : ''}`}>1. Provide</span>
              <span className="step-arrow">→</span>
              <span className={`step-chip ${step >= 2 ? 'active' : ''}`}>2. Review map</span>
              <span className="step-arrow">→</span>
              <span className={`step-chip ${step === 3 ? 'confirmed' : ''}`}>
                3. Confirm {step === 3 ? '✓' : ''}
              </span>
            </div>

            {method === 'current' && step === 1 && (
              <div className="location-action-card">
                <span className="location-action-icon current">
                  <Navigation size={24} />
                </span>
                <div>
                  <h2>Use your current location</h2>
                  <p>
                    Loksha will ask your browser for permission only after you press the button below.
                  </p>
                </div>
                <button
                  type="button"
                  className="primary-btn location-action-btn"
                  onClick={handleSelectCurrentLocation}
                  disabled={isLocating}
                >
                  <Navigation size={17} />
                  <span>{isLocating ? 'Requesting permission…' : 'Use Current Location'}</span>
                </button>
              </div>
            )}

            {method === 'address' && step === 1 && (
              <form onSubmit={handleSearchAddress} className="address-search-form">
                <label className="form-label" htmlFor="complaint-address">
                  Address or landmark
                </label>
                <div className="input-icon-wrapper">
                  <Search size={18} className="input-icon" />
                  <input
                    id="complaint-address"
                    type="text"
                    className="form-input"
                    placeholder="e.g. MG Road Metro Station Gate 2"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    required
                  />
                </div>
                <div className="location-info-note">
                  <AlertCircle size={15} />
                  <span>No geocoding service is configured. Your typed address will be shown for review without fabricated coordinates.</span>
                </div>
                <button type="submit" className="primary-btn location-search-btn">
                  <Sparkles size={16} />
                  <span>Review Address</span>
                </button>
              </form>
            )}

            {step >= 2 && (
              <div className="map-view-box">
                <div
                  className={`vector-map-canvas ${method === 'current' ? 'device-location-map' : ''}`}
                  onClick={handleMapClick}
                  role="application"
                  aria-label={method === 'current' ? 'Current location preview' : 'Select a point on the map preview'}
                >
                  <div className="map-grid-lines" />
                  <div className="map-road-1" />
                  <div className="map-road-2" />
                  <div className="map-ward-tag">Map preview</div>
                  {method !== 'current' && !mapPoint && (
                    <div className="map-empty-hint">
                      <MousePointer2 size={16} />
                      <span>Click anywhere to place a pin</span>
                    </div>
                  )}
                  {mapPoint && (
                    <div
                      className="map-center-pin"
                      style={{ left: `${mapPoint.left}%`, top: `${mapPoint.top}%` }}
                      aria-label="Selected map point"
                    >
                      <div className="pin-pulse" />
                      <MapPin size={34} color="#EF4444" fill="#FEF2F2" />
                    </div>
                  )}
                </div>

                <div className="address-result-card">
                  <span className="address-label">
                    {method === 'current'
                      ? 'Device location'
                      : method === 'map'
                        ? 'Selected map point'
                        : 'Address for review'}
                  </span>
                  <h4 className="address-text">
                    {addressText ||
                      (mapPoint
                        ? 'Pin selected on the map preview'
                        : 'No address resolved')}
                  </h4>

                  {method === 'map' && (
                    <div className="manual-coordinates-fields">
                      <div className="form-group">
                        <label className="form-label" htmlFor="manual-latitude">Latitude (optional)</label>
                        <input
                          id="manual-latitude"
                          type="number"
                          min="-90"
                          max="90"
                          step="any"
                          className="form-input"
                          placeholder="e.g. 12.9716"
                          value={manualCoords.lat}
                          onChange={(event) => handleManualCoordinateChange('lat', event.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="manual-longitude">Longitude (optional)</label>
                        <input
                          id="manual-longitude"
                          type="number"
                          min="-180"
                          max="180"
                          step="any"
                          className="form-input"
                          placeholder="e.g. 77.5946"
                          value={manualCoords.lng}
                          onChange={(event) => handleManualCoordinateChange('lng', event.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {selectedCoordinates && (
                    <div className="exact-coords-box">
                      <div className="coords-badge">
                        <CheckCircle2 size={16} />
                        <span>{step === 3 ? 'Coordinates confirmed' : 'Coordinates available for review'}</span>
                      </div>
                      <div className="coords-values">
                        <span>Latitude <strong>{selectedCoordinates.lat.toFixed(6)}°</strong></span>
                        <span>Longitude <strong>{selectedCoordinates.lng.toFixed(6)}°</strong></span>
                      </div>
                    </div>
                  )}

                  {method === 'map' && !selectedCoordinates && (
                    <p className="map-coordinates-note">
                      Coordinates stay blank until you provide them or connect a map provider.
                    </p>
                  )}
                </div>
              </div>
            )}

            {statusMessage && (
              <div className="location-info-note success">
                <CheckCircle2 size={15} />
                <span>{statusMessage}</span>
              </div>
            )}
            {locationError && (
              <div className="location-error-note" role="alert">
                <AlertCircle size={15} />
                <span>{locationError}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {method && (
        <div className="file-complaint-footer location-footer">
          {step < 3 ? (
            <button
              type="button"
              className="primary-btn"
              onClick={handleConfirmLocation}
              disabled={!canConfirm}
            >
              <Check size={18} />
              <span>Confirm Location</span>
            </button>
          ) : (
            <button type="button" className="primary-btn location-save-btn" onClick={handleFinalSave}>
              <CheckCircle2 size={18} />
              <span>Save & Confirm Location</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}