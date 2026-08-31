import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, User } from 'lucide-react';

export default function ChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello John! 👋 I am your Loksha Civic AI assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Simulate AI response
    setTimeout(() => {
      let botResponse = "I can help with civic issues, complaint tracking, or ward information. What specific detail do you need?";
      const lower = text.toLowerCase();
      if (lower.includes('pothole') || lower.includes('report') || lower.includes('file')) {
        botResponse = "To file a complaint, tap 'File a Complaint' on the home screen. You can select 'Roads & Potholes', attach a photo, and submit instantly!";
      } else if (lower.includes('status') || lower.includes('track') || lower.includes('lk-4092')) {
        botResponse = "Complaint #LK-4092 ('Pothole on MG Road') is currently **In Progress**. The Ward Repair team has inspected the site.";
      } else if (lower.includes('ward') || lower.includes('officer')) {
        botResponse = "Your assigned Ward Officer for Ward 112 (MG Road Circle) is Mr. Rajesh Kumar (Office Tel: 080-2266-4100).";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
    }, 800);
  };

  const suggestions = [
    "How to report a pothole?",
    "Status of #LK-4092",
    "Who is my Ward Officer?"
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet-modal" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90%' }}>
        <div className="sheet-drag-handle"></div>

        <div className="modal-header" style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: '16px' }}>Loksha AI Assistant</h3>
              <p style={{ fontSize: '11.5px', color: '#10B981', fontWeight: '600' }}>● Online</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '10px' }}>
          {suggestions.map((s, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(s)}
              style={{
                whiteSpace: 'nowrap',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '6px 12px',
                fontSize: '12px',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="chat-container">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="chat-input-row">
          <input 
            type="text" 
            className="form-input" 
            placeholder="Ask Loksha AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className="primary-btn" 
            style={{ width: '48px', height: '48px', padding: 0, borderRadius: '50%' }}
            onClick={() => handleSend()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
