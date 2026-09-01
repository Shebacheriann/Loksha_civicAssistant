import React, { useRef, useState } from 'react';
import FileComplaintScreen from './FileComplaintScreen';
import NotificationDrawer from './Modals/NotificationDrawer';
import ProfileDrawer from './Modals/ProfileDrawer';
import ChatModal from './Modals/ChatModal';

import { 
  Sparkles, 
  PlusCircle, 
  Search, 
  Bell, 
  User, 
  Home, 
  FileText, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  MapPin, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  Building2,
  ShieldCheck,
  Smartphone,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  KeyRound,
  UserPlus
} from 'lucide-react';

export default function DesktopLayout({ 
  currentScreen, 
  setCurrentScreen,
  userPhone,
  setUserPhone,
  complaints,
  onAddNewComplaint,
  isMobileViewport,
  forceMobileView,
  setForceMobileView
}) {
  // Modal states for Desktop
  const [activeDesktopModal, setActiveDesktopModal] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [trackSearchTerm, setTrackSearchTerm] = useState('');
  const [trackStatusFilter, setTrackStatusFilter] = useState('all');

  // Form states for Desktop Auth
  const [loginPhoneInput, setLoginPhoneInput] = useState('9876543210');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [signupForm, setSignupForm] = useState({ fullName: '', mobile: '', email: '' });
  const desktopOtpRefs = useRef([]);

  // Filter complaints for Track page
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(trackSearchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(trackSearchTerm.toLowerCase()) ||
                          c.category.toLowerCase().includes(trackSearchTerm.toLowerCase());
    const matchesStatus = trackStatusFilter === 'all' || 
                          (trackStatusFilter === 'in-progress' && c.statusType === 'in-progress') ||
                          (trackStatusFilter === 'resolved' && c.statusType === 'resolved');
    return matchesSearch && matchesStatus;
  });

  const handleOtpChange = (index, value) => {
    const digits = value.replace(/\D/g, '');
    if (!digits && value) return;

    const newOtp = [...otpDigits];
    if (digits.length > 1) {
      digits.slice(0, 6 - index).split('').forEach((digit, offset) => {
        newOtp[index + offset] = digit;
      });
      setOtpDigits(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      desktopOtpRefs.current[nextIndex]?.focus();
      return;
    }

    newOtp[index] = digits;
    setOtpDigits(newOtp);
    if (digits && index < 5) {
      desktopOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      desktopOtpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (index, event) => {
    event.preventDefault();
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6 - index);
    if (!digits) return;

    const newOtp = [...otpDigits];
    digits.split('').forEach((digit, offset) => {
      newOtp[index + offset] = digit;
    });
    setOtpDigits(newOtp);
    desktopOtpRefs.current[Math.min(index + digits.length, 5)]?.focus();
  };

  // ----------------------------------------------------
  // DESKTOP TOP NAVIGATION BAR
  // ----------------------------------------------------
  const DesktopNavbar = () => (
    <header className="desktop-navbar">
      <div className="desktop-nav-container">
        {/* Brand Logo */}
        <div className="desktop-brand" onClick={() => setCurrentScreen('home')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-icon">
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <div className="brand-text-group">
            <span className="brand-name">Loksha</span>
            <span className="brand-tag">Civic Grievance Portal</span>
          </div>
        </div>

        {/* Center Navigation Links (Visible when logged in) */}
        {['home', 'file-complaint', 'track', 'detail'].includes(currentScreen) && (
          <nav className="desktop-nav-links">
            <button 
              className={`desktop-nav-btn ${currentScreen === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('home')}
            >
              <Home size={16} />
              <span>Home</span>
            </button>

            <button 
              className={`desktop-nav-btn ${currentScreen === 'file-complaint' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('file-complaint')}
            >
              <PlusCircle size={16} />
              <span>File a Complaint</span>
            </button>

            <button 
              className={`desktop-nav-btn ${currentScreen === 'track' ? 'active' : ''}`}
              onClick={() => setCurrentScreen('track')}
            >
              <FileText size={16} />
              <span>Track Complaints</span>
            </button>

            <button 
              className="desktop-nav-btn"
              onClick={() => setActiveDesktopModal('chat')}
            >
              <MessageSquare size={16} />
              <span>Chat with Loksha</span>
            </button>
          </nav>
        )}

        {/* Right Actions & Profile */}
        <div className="desktop-nav-right">
          {/* Switch to Mobile Frame View Button */}
          <button 
            className="mobile-preview-toggle-btn"
            onClick={() => setForceMobileView(true)}
            title="Switch to Mobile Device Frame Preview"
          >
            <Smartphone size={15} />
            <span>Mobile Preview</span>
          </button>

          {['home', 'file-complaint', 'track', 'detail'].includes(currentScreen) ? (
            <>
              <button 
                className="desktop-icon-nav-btn" 
                onClick={() => setActiveDesktopModal('notifications')}
                title="Notifications"
              >
                <Bell size={18} />
                <span className="nav-unread-dot"></span>
              </button>

              <div 
                className="desktop-user-profile-chip" 
                onClick={() => setActiveDesktopModal('profile')}
                title="User Profile"
              >
                <div className="user-avatar-circle">J</div>
                <span className="user-name">John</span>
              </div>
            </>
          ) : (
            <button 
              className="desktop-login-link"
              onClick={() => setCurrentScreen('login')}
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );

  // ----------------------------------------------------
  // DESKTOP WELCOME SCREEN (PROPER HERO LAYOUT)
  // ----------------------------------------------------
  const DesktopWelcomeView = () => (
    <div className="desktop-welcome-hero">
      <div className="desktop-content-container">
        <div className="welcome-hero-grid">
          
          {/* Left Text Column */}
          <div className="welcome-hero-left">
            <span className="hero-greeting-badge">👋 Hello & Welcome</span>
            <h1 className="hero-welcome-title">Hi, I'm Loksha 👋</h1>
            <h2 className="hero-welcome-subtitle">Your smart civic grievance assistant.</h2>
            <p className="hero-welcome-desc">
              Report civic issues easily and get them to the right people. Loksha AI automatically categorizes and routes complaints directly to Ward 112 officers.
            </p>

            <button 
              className="desktop-get-started-btn"
              onClick={() => setCurrentScreen('login')}
            >
              <span>Get Started</span>
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Right Mascot Visual Column */}
          <div className="welcome-hero-right">
            <div className="hero-mascot-frame">
              <img src="/loksha_mascot.jpg" alt="Loksha AI Assistant" className="hero-mascot-large" />
              <div className="hero-mascot-glow"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  // ----------------------------------------------------
  // DESKTOP LOGIN SCREEN
  // ----------------------------------------------------
  const DesktopLoginView = () => (
    <div className="desktop-auth-page">
      <div className="desktop-auth-card-wide">
        
        <div className="auth-card-left">
          <div className="auth-brand-badge">
            <Sparkles size={16} /> Loksha Auth
          </div>
          <h2>Enter your mobile number</h2>
            <p>We'll send you a 6-digit OTP code to verify your mobile number and log you in.</p>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setUserPhone(loginPhoneInput);
              setCurrentScreen('otp');
            }}
            className="desktop-auth-form"
          >
            <div className="input-icon-wrapper phone-wrapper">
              <Phone size={18} className="input-icon" />
              <span className="country-code">+91</span>
              <input 
                type="tel"
                className="form-input phone-input"
                placeholder="Enter 10-digit number"
                maxLength={10}
                value={loginPhoneInput}
                onChange={(e) => setLoginPhoneInput(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <button type="submit" className="primary-btn desktop-form-btn">
              <span>Send OTP Code</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer-links">
            <button className="auth-link-btn" onClick={() => setCurrentScreen('signup')}>
              Don't have an account? <strong>Sign Up</strong>
            </button>
            <span className="dot-sep">•</span>
            <button className="auth-link-btn" onClick={() => setCurrentScreen('home')}>
              Continue as Guest
            </button>
          </div>
        </div>

        <div className="auth-card-right">
          <div className="auth-visual-box">
            <img src="/loksha_mascot.jpg" alt="Loksha AI" />
            <h3>Quick Civic Access</h3>
             <p>File potholes, streetlights, and sanitation issues in just a few simple steps.</p>
          </div>
        </div>

      </div>
    </div>
  );

  // ----------------------------------------------------
  // DESKTOP OTP SCREEN
  // ----------------------------------------------------
  const DesktopOtpView = () => (
    <div className="desktop-auth-page">
      <div className="desktop-auth-card-wide">
        <div className="auth-card-left" style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
          
          <button className="desktop-back-btn" onClick={() => setCurrentScreen('login')} style={{ marginBottom: '16px' }}>
            <ArrowLeft size={16} /> Change mobile number
          </button>

          <div className="otp-icon-badge">
            <KeyRound size={26} color="#3B82F6" />
          </div>

          <h2>Verify your number</h2>
          <p>Enter the 6-digit OTP code sent to <strong>+91 {userPhone}</strong>.</p>

          <div className="desktop-otp-boxes-row">
            {otpDigits.map((digit, idx) => (
              <input 
                key={idx}
                id={`desktop-otp-${idx}`}
                ref={(element) => {
                  desktopOtpRefs.current[idx] = element;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={`otp-digit-box ${digit ? 'filled' : ''}`}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                onPaste={(e) => handleOtpPaste(idx, e)}
                autoComplete={idx === 0 ? 'one-time-code' : 'off'}
              />
            ))}
          </div>

          <button 
            className="primary-btn desktop-form-btn"
            onClick={() => setCurrentScreen('home')}
          >
            <span>Verify & Continue</span>
            <ArrowRight size={18} />
          </button>

          <div className="auth-footer-links" style={{ marginTop: '20px' }}>
            <button className="auth-link-btn" onClick={() => alert('New OTP sent!')}>
              Didn't receive the code? <strong>Resend OTP</strong>
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  // ----------------------------------------------------
  // DESKTOP SIGN UP SCREEN
  // ----------------------------------------------------
  const DesktopSignUpView = () => (
    <div className="desktop-auth-page">
      <div className="desktop-auth-card-wide">
        
        <div className="auth-card-left">
          <div className="auth-brand-badge">
            <UserPlus size={16} /> Create Account
          </div>
          <h2>Create your Loksha account</h2>
          <p>Join Loksha to report civic issues and track resolution progress.</p>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentScreen('home');
            }}
            className="desktop-auth-form"
          >
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  className="form-input signup-input" 
                  placeholder="Enter your full name" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div className="input-icon-wrapper phone-wrapper">
                <Phone size={18} className="input-icon" />
                <span className="country-code">+91</span>
                <input 
                  type="tel"
                  className="form-input phone-input"
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email (Optional)</label>
              <div className="input-icon-wrapper">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  className="form-input signup-input" 
                  placeholder="Enter your email address" 
                />
              </div>
            </div>

            <button type="submit" className="primary-btn desktop-form-btn">
              <span>Create Account</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-footer-links">
            <button className="auth-link-btn" onClick={() => setCurrentScreen('login')}>
              Already have an account? <strong>Log in</strong>
            </button>
          </div>
        </div>

        <div className="auth-card-right">
          <div className="auth-visual-box">
            <img src="/loksha_mascot.jpg" alt="Loksha AI" />
            <h3>Smart Civic Governance</h3>
            <p>Empowering citizens with AI-assisted grievance tracking in Ward 112.</p>
          </div>
        </div>

      </div>
    </div>
  );

  // ----------------------------------------------------
  // DESKTOP HOME PAGE VIEW
  // ----------------------------------------------------
  const DesktopHomeView = () => (
    <div className="desktop-home-page">
      <div className="desktop-content-container">
        
        {/* Welcoming Hero Banner */}
        <div className="desktop-hero-section">
          <div className="hero-text-content">
            <span className="hero-badge">👋 Welcome back</span>
            <h1 className="hero-title">Hi, John</h1>
            <p className="hero-subtitle">
              How can Loksha help you today? Report civic issues or track active complaints in Ward 112.
            </p>
          </div>
          
          <div className="hero-mascot-card">
            <img src="/loksha_mascot.jpg" alt="Loksha Assistant" className="hero-mascot-img" />
            <div className="mascot-info-tag">
              <Sparkles size={14} color="#3B82F6" />
              <span>Loksha AI Ready</span>
            </div>
          </div>
        </div>

        {/* 3 Large Spacious Action Cards */}
        <div className="desktop-action-cards-grid">
          
          {/* Card 1: File a Complaint */}
          <div 
            className="desktop-action-card card-file"
            onClick={() => setCurrentScreen('file-complaint')}
          >
            <div className="desktop-card-icon file">
              <PlusCircle size={28} />
            </div>
            <div className="desktop-card-content">
              <h3>File a Complaint</h3>
              <p>Report a civic issue using voice, text, photo, or GPS location.</p>
            </div>
            <div className="card-arrow-btn">
              <ChevronRight size={20} />
            </div>
          </div>

          {/* Card 2: Track a Complaint */}
          <div 
            className="desktop-action-card card-track"
            onClick={() => setCurrentScreen('track')}
          >
            <div className="desktop-card-icon track">
              <Clock size={28} />
            </div>
            <div className="desktop-card-content">
              <h3>Track a Complaint</h3>
              <p>Check status updates and resolution progress for your complaints.</p>
            </div>
            <div className="card-arrow-btn">
              <ChevronRight size={20} />
            </div>
          </div>

          {/* Card 3: Chat with Loksha */}
          <div 
            className="desktop-action-card card-chat"
            onClick={() => setActiveDesktopModal('chat')}
          >
            <div className="desktop-card-icon chat">
              <MessageSquare size={28} />
            </div>
            <div className="desktop-card-content">
              <h3>Chat with Loksha</h3>
              <p>Get instant guidance from your smart AI civic assistant.</p>
            </div>
            <div className="card-arrow-btn">
              <ChevronRight size={20} />
            </div>
          </div>

        </div>

        {/* Recent Complaints Section */}
        <div className="desktop-recent-section">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title">Recent Complaints</h2>
              <p className="section-subtitle">Your latest filed civic grievances in Ward 112</p>
            </div>

            <button 
              className="view-all-btn"
              onClick={() => setCurrentScreen('track')}
            >
              View All Complaints
            </button>
          </div>

          <div className="desktop-complaints-grid">
            {complaints.slice(0, 2).map((item) => (
              <div 
                key={item.id}
                className="desktop-complaint-card"
                onClick={() => {
                  setSelectedComplaint(item);
                  setCurrentScreen('detail');
                }}
              >
                <div className="complaint-card-header">
                  <span className="complaint-id-chip">#{item.id}</span>
                  <span className={`status-pill ${item.statusType}`}>
                    <span className="status-dot"></span> {item.status}
                  </span>
                </div>

                <h3 className="complaint-title-text">{item.title}</h3>
                <p className="complaint-desc-text">{item.description}</p>

                <div className="complaint-footer-meta">
                  <span className="meta-item"><MapPin size={14} /> {item.location || 'Ward 112'}</span>
                  <span className="meta-item"><Clock size={14} /> {item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Floating Loksha AI Assistant FAB */}
      <button 
        className="floating-ai-button desktop-fab"
        onClick={() => setActiveDesktopModal('chat')}
        title="Chat with Loksha AI"
      >
        <div className="ai-pulse-ring"></div>
        <Sparkles size={24} />
      </button>
    </div>
  );

  // ----------------------------------------------------
  // DESKTOP TRACK COMPLAINTS PAGE VIEW
  // ----------------------------------------------------
  const DesktopTrackView = () => (
    <div className="desktop-track-page">
      <div className="desktop-content-container">
        
        <div className="desktop-page-header">
          <button className="desktop-back-btn" onClick={() => setCurrentScreen('home')}>
            <ArrowLeft size={18} /> Back to Home
          </button>
          <h1 className="desktop-page-title">Track Complaints</h1>
          <p className="desktop-page-sub">Monitor official updates and resolution timelines for your submitted grievances.</p>
        </div>

        <div className="desktop-toolbar-card">
          <div className="desktop-search-input-box">
            <Search size={18} color="#94A3B8" />
            <input 
              type="text"
              placeholder="Search by ticket ID, title, or category..."
              value={trackSearchTerm}
              onChange={(e) => setTrackSearchTerm(e.target.value)}
            />
          </div>

          <div className="status-filter-tabs">
            <button 
              className={`filter-tab ${trackStatusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTrackStatusFilter('all')}
            >
              All ({complaints.length})
            </button>
            <button 
              className={`filter-tab ${trackStatusFilter === 'in-progress' ? 'active' : ''}`}
              onClick={() => setTrackStatusFilter('in-progress')}
            >
              In Progress ({complaints.filter(c => c.statusType === 'in-progress').length})
            </button>
            <button 
              className={`filter-tab ${trackStatusFilter === 'resolved' ? 'active' : ''}`}
              onClick={() => setTrackStatusFilter('resolved')}
            >
              Resolved ({complaints.filter(c => c.statusType === 'resolved').length})
            </button>
          </div>
        </div>

        <div className="desktop-table-container">
          <table className="desktop-data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Issue Title & Description</th>
                <th>Category</th>
                <th>Location</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map(item => (
                  <tr key={item.id}>
                    <td><strong className="table-ticket-id">#{item.id}</strong></td>
                    <td>
                      <div className="table-title-cell">
                        <strong>{item.title}</strong>
                        <span>{item.description}</span>
                      </div>
                    </td>
                    <td><span className="cat-chip">{item.category}</span></td>
                    <td><span className="loc-text">📍 {item.location || 'Ward 112'}</span></td>
                    <td><span className="time-text">{item.time}</span></td>
                    <td>
                      <span className={`status-pill ${item.statusType}`}>
                        <span className="status-dot"></span> {item.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="table-action-btn"
                        onClick={() => {
                          setSelectedComplaint(item);
                          setCurrentScreen('detail');
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    No complaints found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );

  // ----------------------------------------------------
  // DESKTOP COMPLAINT DETAIL PAGE VIEW
  // ----------------------------------------------------
  const DesktopDetailView = () => {
    const item = selectedComplaint || complaints[0];
    return (
      <div className="desktop-detail-page">
        <div className="desktop-content-container">
          
          <button className="desktop-back-btn" onClick={() => setCurrentScreen('track')}>
            <ArrowLeft size={18} /> Back to Complaints List
          </button>

          <div className="desktop-detail-grid">
            <div className="desktop-card main-detail-card">
              <div className="detail-header-flex">
                <span className="detail-id-badge">#{item.id}</span>
                <span className={`status-pill ${item.statusType}`}>
                  <span className="status-dot"></span> {item.status}
                </span>
              </div>

              <h1 className="detail-main-title">{item.title}</h1>
              <p className="detail-desc-text">{item.description}</p>

              <div className="detail-meta-grid">
                <div className="meta-box">
                  <span className="meta-label">Category</span>
                  <span className="meta-value">{item.category}</span>
                </div>
                <div className="meta-box">
                  <span className="meta-label">Location</span>
                  <span className="meta-value">📍 {item.location || 'Ward 112'}</span>
                </div>
                <div className="meta-box">
                  <span className="meta-label">Reported On</span>
                  <span className="meta-value">{item.time}</span>
                </div>
                <div className="meta-box">
                  <span className="meta-label">Assigned Ward</span>
                  <span className="meta-value">Ward 112 Public Works</span>
                </div>
              </div>
            </div>

            <div className="desktop-card timeline-card">
              <h3>Resolution Timeline</h3>
              <div className="timeline-steps-list">
                <div className="timeline-step done">
                  <div className="step-marker"><CheckCircle2 size={16} /></div>
                  <div className="step-content">
                    <h4>Complaint Registered</h4>
                    <p>Logged via Loksha AI Assistant</p>
                    <span className="step-time">{item.time}</span>
                  </div>
                </div>

                <div className="timeline-step active">
                  <div className="step-marker"><Building2 size={16} /></div>
                  <div className="step-content">
                    <h4>Assigned to Ward Engineer</h4>
                    <p>Inspection scheduled by Public Works Office</p>
                    <span className="step-time">In Progress</span>
                  </div>
                </div>

                <div className="timeline-step pending">
                  <div className="step-marker"><ShieldCheck size={16} /></div>
                  <div className="step-content">
                    <h4>Resolution & Verification</h4>
                    <p>Field repair completion report</p>
                    <span className="step-time">Pending</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // MAIN RENDER SWITCHER
  // ----------------------------------------------------
  return (
    <div className="desktop-app-wrapper">
      
      {/* Top Navbar */}
      <DesktopNavbar />

      {/* Main Page Container */}
      <main className="desktop-main-viewport">
        
        {currentScreen === 'welcome' && <DesktopWelcomeView />}

        {currentScreen === 'login' && <DesktopLoginView />}

        {currentScreen === 'otp' && <DesktopOtpView />}

        {currentScreen === 'signup' && <DesktopSignUpView />}

        {currentScreen === 'home' && <DesktopHomeView />}

        {currentScreen === 'file-complaint' && (
          <div className="desktop-file-complaint-wrapper">
            <div className="desktop-content-container">
              <FileComplaintScreen 
                onBackToHome={() => setCurrentScreen('home')}
                onSubmitSuccess={onAddNewComplaint}
              />
            </div>
          </div>
        )}

        {currentScreen === 'track' && <DesktopTrackView />}

        {currentScreen === 'detail' && <DesktopDetailView />}

      </main>

      {/* Desktop Overlays & Modals */}
      <NotificationDrawer 
        isOpen={activeDesktopModal === 'notifications'}
        onClose={() => setActiveDesktopModal(null)}
      />

      <ProfileDrawer 
        isOpen={activeDesktopModal === 'profile'}
        onClose={() => setActiveDesktopModal(null)}
      />

      <ChatModal 
        isOpen={activeDesktopModal === 'chat'}
        onClose={() => setActiveDesktopModal(null)}
      />

    </div>
  );
}
