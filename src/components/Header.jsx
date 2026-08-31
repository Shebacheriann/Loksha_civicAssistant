import React from 'react';
import { Bell, User } from 'lucide-react';

export default function Header({ onOpenNotifications, onOpenProfile }) {
  return (
    <header className="top-header">
      {/* Left: Profile / Menu icon & Greeting */}
      <div className="profile-greeting-group">
        <button 
          className="profile-avatar-btn" 
          onClick={onOpenProfile}
          title="Open Profile Menu"
          aria-label="Profile Menu"
        >
          J
        </button>
        <div className="greeting-text-group">
          <h1 className="greeting-title">Hi, John 👋</h1>
        </div>
      </div>

      {/* Right: Notification icon */}
      <div className="header-right-actions">
        <button 
          className="icon-btn" 
          onClick={onOpenNotifications}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="unread-badge"></span>
        </button>
      </div>
    </header>
  );
}
