import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function OtpScreen({ phoneNumber = '9876543210', onVerifySuccess, onChangeNumber, onBack }) {
  // 6 individual OTP digit boxes prefilled with '409281' for instant testing
  const [otp, setOtp] = useState(['4', '0', '9', '2', '8', '1']);
  const [resendTimer, setResendTimer] = useState(30);
  const [resendActive, setResendActive] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    } else {
      setResendActive(true);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    // Only accept numeric digit
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    // Keep only the last typed character
    newOtp[index] = value ? value.substring(value.length - 1) : '';
    setOtp(newOtp);

    // Auto-advance focus to next box
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      setOtp(pasteData.split(''));
      if (inputRefs.current[5]) inputRefs.current[5].focus();
    }
  };

  const handleResend = () => {
    if (!resendActive) return;
    setResendTimer(30);
    setResendActive(false);
    setToastMessage('New 6-digit code sent!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    onVerifySuccess();
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="otp-screen-container">
      {/* Top Navigation */}
      <div className="otp-top-bar">
        <button className="back-btn" onClick={onBack} aria-label="Back">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Centered Main Content Area */}
      <div className="otp-centered-container">
        
        {/* Header Text Group */}
        <div className="otp-header-group">
          <div className="otp-badge-icon">
            <ShieldCheck size={24} color="#3B82F6" />
          </div>
          <h1 className="otp-main-title">Verify your number</h1>
          <p className="otp-subtitle">
            Enter the 6-digit OTP sent to your mobile number.
          </p>
          <div className="phone-number-chip">
            <span>+91 {phoneNumber}</span>
            <button className="change-num-inline-btn" onClick={onChangeNumber}>
              Change
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="otp-toast">
            {toastMessage}
          </div>
        )}

        {/* 6 OTP Input Boxes Form */}
        <form onSubmit={handleVerify} className="otp-form">
          
          {/* Exactly 6 separate small equal boxes in 1 horizontal row */}
          <div className="otp-boxes-row" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputRefs.current[idx] = el}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className={`otp-digit-box ${digit ? 'filled' : ''}`}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                autoComplete="off"
              />
            ))}
          </div>

          {/* Primary Button */}
          <button 
            type="submit" 
            className={`primary-btn verify-btn ${isComplete ? 'active' : ''}`}
          >
            <span>Verify & Continue</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Resend & Change Number Links */}
        <div className="otp-footer-actions">
          <div className="resend-wrapper">
            <span className="resend-prompt">Didn't receive the code?</span>
            {resendActive ? (
              <button className="resend-link-btn" onClick={handleResend}>
                Resend OTP
              </button>
            ) : (
              <span className="resend-countdown">
                Resend in <strong>{resendTimer}s</strong>
              </span>
            )}
          </div>

          <button className="change-number-btn" onClick={onChangeNumber}>
            Change mobile number
          </button>
        </div>

      </div>
    </div>
  );
}
