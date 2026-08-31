import React, { useState } from 'react';
import { 
  ChevronLeft, 
  MapPin, 
  Map as MapIcon, 
  Edit3, 
  Check, 
  Sparkles, 
  Search, 
  RefreshCw,
  Navigation,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function LocationPage({ initialLocation, onSaveLocation, onBack }) {
  // Method selected: null (shows 3 options) | 'current' | 'map' | 'address'
  const [method, setMethod] = useState(null);

  // Process Step: 1 (Approximate) -> 2 (Map Preview) -> 3 (Confirmed & Coordinates)
  const [step, setStep] = useState(1);

  // Address & Coordinates state
  const [addressText, setAddressText] = useState(initialLocation || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [coords, setCoords] = useState({ lat: 12.9716, lng: 77.5946 });
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Method 1: Use Current Location
  const handleSelectCurrentLocation = () => {
    setMethod('current');
    setStep(1);
    setAddressText('Detecting GPS location...');

    setTimeout(() => {
      setAddressText('4th Cross Road, Ward 112, MG Road');
      setCoords({ lat: 12.9716, lng: 77.5946 });
      setStep(2); // Move to Map preview
    }, 1200);
  };

  // Method 2: Choose on Map
  const handleSelectChooseOnMap = () => {
    setMethod('map');
    setStep(2); // Opens map directly for manual selection
    setAddressText('Selected Pin Location: 2nd Main Road, Ward 112');
    setCoords({ lat: 12.9734, lng: 77.5982 });
  };

  // Method 3: Enter Address
  const handleSelectEnterAddress = () => {
    setMethod('address');
    setStep(1);
    setSearchQuery('');
  };

  const handleSearchAddress = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsAiSearching(true);
    setTimeout(() => {
      setIsAiSearching(false);
      setAddressText(searchQuery + ', Ward 112');
      setCoords({ lat: 12.9751, lng: 77.6011 });
      setStep(2); // Map preview after AI geocoding
    }, 1000);
  };

  // Step 3: Final User Confirmation
  const handleConfirmLocation = () => {
    setIsConfirmed(true);
    setStep(3);
  };

  const handleFinalSave = () => {
    onSaveLocation({
      address: addressText || 'Confirmed Location, Ward 112',
      lat: coords.lat,
      lng: coords.lng,
      isConfirmed: true
    });
  };

  return (
    <div className="file-complaint-page location-full-page">
      
      {/* Top Bar */}
      <div className="top-nav-bar">
        <button 
          className="back-btn" 
          onClick={() => {
            if (step > 1 && method) {
              setStep(1);
            } else if (method) {
              setMethod(null);
            } else {
              onBack();
            }
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <span className="nav-page-title">Confirm Location</span>
        <div style={{ width: 38 }}></div>
      </div>

      <div className="location-page-content">
        
        {/* Main Header */}
        <div className="page-header-group">
          <h1 className="page-main-title">Confirm Location</h1>
          <p className="page-subtitle">
            Choose how you want to provide the complaint location.
          </p>
        </div>

        {/* -------------------------------------------------- */}
        {/* VIEW 1: 3 METHOD OPTIONS (Initial Choice) */}
        {/* -------------------------------------------------- */}
        {!method && (
          <div className="location-methods-list">
            
            {/* Option 1: Use Current Location */}
            <div 
              className="location-method-card"
              onClick={handleSelectCurrentLocation}
            >
              <div className="method-icon-box current">
                <Navigation size={22} />
              </div>
              <div className="method-info">
                <h3 className="method-title">📍 Use Current Location</h3>
                <p className="method-sub">Detect my current location</p>
              </div>
            </div>

            {/* Option 2: Choose on Map */}
            <div 
              className="location-method-card"
              onClick={handleSelectChooseOnMap}
            >
              <div className="method-icon-box map">
                <MapIcon size={22} />
              </div>
              <div className="method-info">
                <h3 className="method-title">🗺️ Choose on Map</h3>
                <p className="method-sub">Select the location manually</p>
              </div>
            </div>

            {/* Option 3: Enter Address */}
            <div 
              className="location-method-card"
              onClick={handleSelectEnterAddress}
            >
              <div className="method-icon-box address">
                <Edit3 size={22} />
              </div>
              <div className="method-info">
                <h3 className="method-title">✏️ Enter Address</h3>
                <p className="method-sub">Type an address and find it on the map</p>
              </div>
            </div>

          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* VIEW 2: METHOD WORKFLOW (Steps 1, 2, 3) */}
        {/* -------------------------------------------------- */}
        {method && (
          <div className="location-workflow-container">
            
            {/* Step Breadcrumb Trail */}
            <div className="step-breadcrumb">
              <span className={`step-chip ${step >= 1 ? 'active' : ''}`}>1. Approximate</span>
              <span className="step-arrow">➔</span>
              <span className={`step-chip ${step >= 2 ? 'active' : ''}`}>2. Map</span>
              <span className="step-arrow">➔</span>
              <span className={`step-chip ${step === 3 ? 'confirmed' : ''}`}>
                3. Exact Coords {step === 3 ? '✓' : ''}
              </span>
            </div>

            {/* METHOD 3 SEARCH BAR (Step 1 of Enter Address) */}
            {method === 'address' && step === 1 && (
              <form onSubmit={handleSearchAddress} className="address-search-form">
                <label className="form-label">Type Address or Landmark</label>
                <div className="input-icon-wrapper" style={{ marginBottom: '14px' }}>
                  <Search size={18} className="input-icon" />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ paddingLeft: '42px', background: '#FFFFFF' }}
                    placeholder="e.g. MG Road Metro Station Gate 2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="primary-btn" style={{ borderRadius: '24px' }}>
                  {isAiSearching ? (
                    <>
                      <RefreshCw size={16} className="spin-anim" />
                      <span>Loksha AI Searching Map...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Find on Map with Loksha AI</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2 & 3: MAP PREVIEW & CONFIRMATION */}
            {step >= 2 && (
              <div className="map-view-box">
                {/* Simulated Interactive Vector Map Canvas */}
                <div className="vector-map-canvas">
                  <div className="map-grid-lines"></div>
                  <div className="map-road-1"></div>
                  <div className="map-road-2"></div>
                  <div className="map-ward-tag">Ward 112 Circle</div>

                  {/* Moveable Pin Marker */}
                  <div className="map-center-pin">
                    <div className="pin-pulse"></div>
                    <MapPin size={34} color="#EF4444" fill="#FEF2F2" />
                  </div>
                </div>

                {/* Approximate / Selected Address Display */}
                <div className="address-result-card">
                  <span className="address-label">
                    {method === 'current' ? 'GPS Location:' : (method === 'map' ? 'Selected Pin:' : 'Geocoded Address:')}
                  </span>
                  <h4 className="address-text">{addressText}</h4>
                  
                  {/* Step 3: Exact Coordinates (Shown ONLY after confirmation) */}
                  {step === 3 && (
                    <div className="exact-coords-box">
                      <div className="coords-badge">
                        <CheckCircle2 size={16} color="#10B981" />
                        <span>Exact Coordinates Confirmed ✓</span>
                      </div>
                      <div className="coords-values">
                        <span>Latitude: <strong>{coords.lat.toFixed(4)}° N</strong></span>
                        <span>Longitude: <strong>{coords.lng.toFixed(4)}° E</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Sticky Bottom Actions */}
      {method && (
        <div className="file-complaint-footer">
          {step < 3 ? (
            <button 
              className="primary-btn" 
              style={{ borderRadius: '28px', padding: '16px' }}
              onClick={handleConfirmLocation}
            >
              <Check size={18} />
              <span>Confirm Location</span>
            </button>
          ) : (
            <button 
              className="primary-btn" 
              style={{ borderRadius: '28px', padding: '16px', background: '#10B981' }}
              onClick={handleFinalSave}
            >
              <CheckCircle2 size={18} />
              <span>Save & Confirm Location ✓</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
}
