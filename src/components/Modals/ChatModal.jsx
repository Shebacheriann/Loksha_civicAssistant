import React, { useState } from 'react';
import { X, Send, Sparkles, Bot, User, Minus, Maximize2 } from 'lucide-react';

export default function ChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello John! 👋 I am your Loksha Civic AI assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Simulate the existing local assistant response.
    setTimeout(() => {
      let botResponse = 'I can help with civic issues, complaint tracking, or ward information. What specific detail do you need?';
      const lower = text.toLowerCase();
      if (lower.includes('pothole') || lower.includes('report') || lower.includes('file')) {
        botResponse = "To file a complaint, tap 'File a Complaint' on the home screen. You can select 'Roads & Potholes', attach a photo, and submit instantly!";
      } else if (lower.includes('status') || lower.includes('track') || lower.includes('lk-4092')) {
        botResponse = "Complaint #LK-4092 ('Pothole on MG Road') is currently **In Progress**. The Ward Repair team has inspected the site.";
      } else if (lower.includes('ward') || lower.includes('officer')) {
        botResponse = 'Your assigned Ward Officer for Ward 112 (MG Road Circle) is Mr. Rajesh Kumar (Office Tel: 080-2266-4100).';
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
    }, 800);
  };

  const renderMessage = (text) => {
    const parts = text.split('**');
    return parts.map((part, index) =>
      index % 2 === 1 ? <strong key={`${part}-${index}`}>{part}</strong> : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
    );
  };

  const suggestions = [
    'How to report a pothole?',
    'Status of #LK-4092',
    'Who is my Ward Officer?'
  ];

  return (
    <div className="modal-backdrop chat-modal-backdrop" onClick={onClose}>
      <section
        className={`chat-assistant-panel ${isMinimized ? 'minimized' : ''}`}
        onClick={(event) => event.stopPropagation()}
        aria-label="Loksha AI Assistant"
      >
        <header className="chat-assistant-header">
          <div className="chat-assistant-identity">
            <div className="chat-avatar">
              <Sparkles size={18} />
            </div>
            <div>
              <h3>Loksha AI Assistant</h3>
              <span><i className="chat-online-dot"></i> Online</span>
            </div>
          </div>
          <div className="chat-header-actions">
            <button
              type="button"
              className="chat-control-btn"
              onClick={() => setIsMinimized(previous => !previous)}
              aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              title={isMinimized ? 'Expand chat' : 'Minimize chat'}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minus size={17} />}
            </button>
            <button type="button" className="chat-control-btn" onClick={onClose} aria-label="Close chat" title="Close chat">
              <X size={17} />
            </button>
          </div>
        </header>

        {isMinimized ? (
          <button type="button" className="chat-minimized-reopen" onClick={() => setIsMinimized(false)}>
            <Bot size={16} />
            <span>Open conversation</span>
          </button>
        ) : (
          <>
            <div className="chat-assistant-intro">
              <span className="chat-intro-icon"><Bot size={15} /></span>
              <span>Ask about filing a grievance, tracking a ticket, or finding your ward officer.</span>
            </div>

            <div className="chat-suggestions" aria-label="Suggested questions">
              {suggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  className="chat-suggestion-chip"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="chat-container" aria-live="polite">
              {messages.map(message => (
                <div key={message.id} className={`chat-message-row ${message.sender}`}>
                  <div className="chat-message-avatar">
                    {message.sender === 'bot' ? <Sparkles size={12} /> : <User size={12} />}
                  </div>
                  <div className="chat-bubble">
                    {renderMessage(message.text)}
                  </div>
                </div>
              ))}
            </div>

            <form className="chat-input-row" onSubmit={(event) => {
              event.preventDefault();
              handleSend();
            }}>
              <input
                type="text"
                className="form-input"
                placeholder="Ask Loksha AI..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                aria-label="Message Loksha AI"
              />
              <button type="submit" className="chat-send-btn" aria-label="Send message">
                <Send size={17} />
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}