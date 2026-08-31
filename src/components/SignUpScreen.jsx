import React, { useState } from 'react';
import { ArrowRight, User, Phone, Mail, ChevronLeft } from 'lucide-react';

export default function SignUpScreen({ onSignUpSuccess, onNavigateToLogin, onBack }) {
  const [fullName, setFullName] = useState('John Doe');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [email, setEmail] = useState('john.doe@example.com');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUpSuccess();
  };

  return (
    <div className="signup-screen-container">
      {/* Top Navigation */}
      <div className="signup-top-bar">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Centered Main Content Area */}
      <div className="signup-centered-container">
        
        {/* Header Text Group */}
        <div className="signup-header-group">
          <span className="login-badge">New Citizen</span>
          <h1 className="signup-main-title">Create your Loksha account</h1>
          <p className="signup-subtitle">
            Join Loksha to report and track civic issues.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="signup-form">
          
          {/* Field 1: Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrapper">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                className="form-input signup-input" 
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Field 2: Mobile Number (Fixed horizontal layout with zero overlap) */}
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <div className="input-icon-wrapper phone-wrapper">
              <Phone size={18} className="input-icon" />
              <span className="country-code">+91</span>
              <input 
                type="tel" 
                className="form-input phone-input" 
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* Field 3: Email (Optional) */}
          <div className="form-group">
            <label className="form-label">Email (Optional)</label>
            <div className="input-icon-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                className="form-input signup-input" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Primary Button */}
          <button type="submit" className="primary-btn signup-btn">
            <span>Create Account</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer Link */}
        <div className="signup-footer">
          <span className="footer-prompt">Already have an account?</span>
          <button className="login-link-btn" onClick={onNavigateToLogin}>
            Log in
          </button>
        </div>

      </div>
    </div>
  );
}
