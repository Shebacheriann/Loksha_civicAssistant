import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import OtpScreen from './components/OtpScreen';
import SignUpScreen from './components/SignUpScreen';
import FileComplaintScreen from './components/FileComplaintScreen';
import DesktopLayout from './components/DesktopLayout';

import Header from './components/Header';
import ActionCards from './components/ActionCards';
import RecentComplaints from './components/RecentComplaints';
import FloatingAIButton from './components/FloatingAIButton';

import TrackComplaintModal from './components/Modals/TrackComplaintModal';
import ChatModal from './components/Modals/ChatModal';
import ComplaintDetailModal from './components/Modals/ComplaintDetailModal';
import NotificationDrawer from './components/Modals/NotificationDrawer';
import ProfileDrawer from './components/Modals/ProfileDrawer';
import { 
  Smartphone, 
  Monitor, 
  Wifi, 
  Battery, 
  Signal, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function App() {
  // Navigation Flow State: 'welcome' | 'login' | 'otp' | 'signup' | 'home' | 'file-complaint' | 'track' | 'detail'
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userPhone, setUserPhone] = useState('9876543210');

  // Modal states for Mobile Home screen
  const [activeModal, setActiveModal] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Responsive Viewport Detector (< 1024px is Mobile Viewport)
  const [isMobileViewport, setIsMobileViewport] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false
  );

  // User override to preview Mobile Frame on Desktop
  const [forceMobileView, setForceMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Complaints state (preserved & shared across views)
  const [complaints, setComplaints] = useState([
    {
      id: 'LK-4092',
      title: 'Pothole on MG Road',
      status: 'In Progress',
      statusType: 'in-progress',
      time: '2 hours ago',
      category: 'Road Repair',
      description: 'Large pothole near Metro Station Gate 2 causing traffic slowdowns.',
      location: 'MG Road Metro Station'
    },
    {
      id: 'LK-3811',
      title: 'Streetlight Not Working',
      status: 'Resolved',
      statusType: 'resolved',
      time: 'Yesterday',
      category: 'Electrical',
      description: 'Streetlight pole #42 on 4th Cross Road repaired by Ward Maintenance team.',
      location: '4th Cross Road, Ward 112'
    }
  ]);

  const handleAddNewComplaint = (newComplaint) => {
    setComplaints(prev => [newComplaint, ...prev.slice(0, 1)]);
  };

  // Determine whether to show Mobile Layout or Desktop Website Layout
  const isMobileLayout = isMobileViewport || forceMobileView;

  // ----------------------------------------------------
  // 1. DESKTOP WEBSITE LAYOUT (NO Phone Frame)
  // ----------------------------------------------------
  if (!isMobileLayout) {
    return (
      <DesktopLayout 
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        userPhone={userPhone}
        setUserPhone={setUserPhone}
        complaints={complaints}
        onAddNewComplaint={handleAddNewComplaint}
        isMobileViewport={isMobileViewport}
        forceMobileView={forceMobileView}
        setForceMobileView={setForceMobileView}
      />
    );
  }

  // ----------------------------------------------------
  // 2. MOBILE LAYOUT (Preserved Mobile UI)
  // ----------------------------------------------------
  return (
    <div className="app-viewport-wrapper mobile-mode">
      
      {/* Top Preview Bar for switching back to Desktop View on Desktop Viewports */}
      {!isMobileViewport && (
        <div className="view-mode-bar">
          <div className="bar-brand">
            <Sparkles size={16} color="#60A5FA" />
            <span>Mobile Device Preview</span>
          </div>

          <button 
            className="view-mode-btn active"
            onClick={() => setForceMobileView(false)}
          >
            <Monitor size={14} /> Switch to Full Desktop Website View
          </button>
        </div>
      )}

      {/* Main Mobile App Frame */}
      <div className="mobile-device-frame">
        
        {/* Phone Status Bar */}
        <div className="phone-status-bar">
          <span>9:41</span>
          <div className="notch-pill"></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Signal size={14} />
            <Wifi size={14} />
            <Battery size={16} />
          </div>
        </div>

        {/* Mobile Screen Renderer */}
        {currentScreen === 'welcome' && (
          <WelcomeScreen 
            onGetStarted={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'login' && (
          <LoginScreen 
            onNavigateToOtp={(phone) => {
              setUserPhone(phone);
              setCurrentScreen('otp');
            }}
            onNavigateToSignUp={() => setCurrentScreen('signup')}
            onSkipGuest={() => setCurrentScreen('home')}
            onBackToWelcome={() => setCurrentScreen('welcome')}
          />
        )}

        {currentScreen === 'otp' && (
          <OtpScreen 
            phoneNumber={userPhone}
            onVerifySuccess={() => setCurrentScreen('home')}
            onChangeNumber={() => setCurrentScreen('login')}
            onBack={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'signup' && (
          <SignUpScreen 
            onSignUpSuccess={() => setCurrentScreen('home')}
            onNavigateToLogin={() => setCurrentScreen('login')}
            onBack={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'file-complaint' && (
          <FileComplaintScreen 
            onBackToHome={() => setCurrentScreen('home')}
            onSubmitSuccess={handleAddNewComplaint}
          />
        )}

        {currentScreen === 'home' && (
          <>
            <main className="mobile-screen-content">
              <Header 
                onOpenNotifications={() => setActiveModal('notifications')}
                onOpenProfile={() => setActiveModal('profile')}
              />

              <ActionCards 
                onFileComplaint={() => setCurrentScreen('file-complaint')}
                onTrackComplaint={() => setActiveModal('track')}
                onChatWithLoksha={() => setActiveModal('chat')}
              />

              <RecentComplaints 
                onSelectComplaint={(item) => {
                  setSelectedComplaint(item);
                  setActiveModal('detail');
                }}
              />

              <FloatingAIButton onClick={() => setActiveModal('chat')} />
            </main>

            {/* Modals & Drawers */}
            <TrackComplaintModal 
              isOpen={activeModal === 'track'}
              onClose={() => setActiveModal(null)}
              complaints={complaints}
            />

            <ChatModal 
              isOpen={activeModal === 'chat'}
              onClose={() => setActiveModal(null)}
            />

            <ComplaintDetailModal 
              item={selectedComplaint}
              onClose={() => {
                setActiveModal(null);
                setSelectedComplaint(null);
              }}
            />

            <NotificationDrawer 
              isOpen={activeModal === 'notifications'}
              onClose={() => setActiveModal(null)}
            />

            <ProfileDrawer 
              isOpen={activeModal === 'profile'}
              onClose={() => setActiveModal(null)}
            />
          </>
        )}

        {/* Bottom Home Indicator */}
        <div className="phone-home-indicator"></div>

      </div>
    </div>
  );
}
