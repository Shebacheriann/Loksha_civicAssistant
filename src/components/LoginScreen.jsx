import React, { useState } from 'react';
import { ArrowRight, Phone, ChevronLeft } from 'lucide-react';

export default function LoginScreen({ onNavigateToOtp, onNavigateToSignUp, onSkipGuest, onBackToWelcome }) {
  const [phoneNumber, setPhoneNumber] = useState('9876543210');

  const handleSubmit = (e) => {
    e.preventDefault();
    onNavigateToOtp(phoneNumber);
  };

  return (
    <div className="login-screen-container">
      {/* Top Navigation */}
      <div className="login-top-bar">
        <button className="back-btn" onClick={onBackToWelcome} aria-label="Back to welcome">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Centered Main Content Area */}
      <div className="login-centered-container">
        
        <div className="login-header-group">
          <span className="login-badge">Citizen Login</span>
          <h2 className="login-title">Welcome to Loksha 👋</h2>
          <p className="login-subtitle">
            Enter your mobile number to get started with civic services.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <div className="input-icon-wrapper">
              <Phone size={18} className="input-icon" />
              <span className="country-code">+91</span>
              <input 
                type="tel" 
                className="form-input login-input" 
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={10}
                required
              />
            </div>
          </div>

          <button type="submit" className="primary-btn login-btn">
            <span>Get Verification Code</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-footer">
          <div className="resend-wrapper" style={{ justifyContent: 'center', marginBottom: '10px' }}>
            <span>Don't have an account?</span>
            <button className="resend-link-btn" onClick={onNavigateToSignUp}>
              Sign up
            </button>
          </div>

          <button className="guest-link-btn" onClick={onSkipGuest}>
            Skip & Explore as Guest
          </button>
        </div>

      </div>
    </div>
  );
}
