import React from 'react';
import { PlusCircle, Search, MessageSquare, ChevronRight } from 'lucide-react';

export default function ActionCards({ onFileComplaint, onTrackComplaint, onChatWithLoksha }) {
  return (
    <section className="center-section">
      <h2 className="center-question-title">How can Loksha help you?</h2>

      <div className="action-cards-container">
        {/* Card 1: File a Complaint */}
        <div 
          className="action-card card-file" 
          onClick={onFileComplaint}
          role="button"
          tabIndex={0}
        >
          <div className="card-icon-wrapper">
            <PlusCircle size={24} />
          </div>
          <div className="card-content-group">
            <h3 className="card-title">File a Complaint</h3>
            <p className="card-subtitle">Report a civic issue</p>
          </div>
          <ChevronRight size={18} className="card-chevron" />
        </div>

        {/* Card 2: Track a Complaint */}
        <div 
          className="action-card card-track" 
          onClick={onTrackComplaint}
          role="button"
          tabIndex={0}
        >
          <div className="card-icon-wrapper">
            <Search size={24} />
          </div>
          <div className="card-content-group">
            <h3 className="card-title">Track a Complaint</h3>
            <p className="card-subtitle">Check your complaints</p>
          </div>
          <ChevronRight size={18} className="card-chevron" />
        </div>

        {/* Card 3: Chat with Loksha */}
        <div 
          className="action-card card-chat" 
          onClick={onChatWithLoksha}
          role="button"
          tabIndex={0}
        >
          <div className="card-icon-wrapper">
            <MessageSquare size={24} />
          </div>
          <div className="card-content-group">
            <h3 className="card-title">Chat with Loksha</h3>
            <p className="card-subtitle">Get help from your civic assistant</p>
          </div>
          <ChevronRight size={18} className="card-chevron" />
        </div>
      </div>
    </section>
  );
}
