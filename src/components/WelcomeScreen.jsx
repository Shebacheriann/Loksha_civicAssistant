import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function WelcomeScreen({ onGetStarted }) {
  return (
    <div className="welcome-screen-container">
      <div className="welcome-content">
        
        {/* Friendly Loksha Illustration */}
        <div className="mascot-illustration-wrapper">
          <img 
            src="/loksha_mascot.jpg" 
            alt="Loksha Assistant Mascot" 
            className="mascot-img"
          />
          <div className="mascot-glow-bg"></div>
        </div>

        {/* Text Group */}
        <div className="welcome-text-group">
          <h1 className="welcome-main-title">Hi, I'm Loksha 👋</h1>
          <h2 className="welcome-subtitle">Your smart civic grievance assistant.</h2>
          <p className="welcome-description">
            Report civic issues easily and get them to the right people.
          </p>
        </div>

      </div>

      {/* Prominent Bottom Button */}
      <div className="welcome-footer">
        <button 
          className="get-started-btn" 
          onClick={onGetStarted}
        >
          <span>Get Started</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
