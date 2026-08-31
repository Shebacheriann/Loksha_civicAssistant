import React from 'react';
import { Sparkles } from 'lucide-react';

export default function FloatingAIButton({ onClick }) {
  return (
    <button 
      className="floating-ai-button" 
      onClick={onClick}
      aria-label="Chat with Loksha AI"
      title="Chat with Loksha AI"
    >
      <div className="ai-pulse-ring"></div>
      <Sparkles size={22} />
    </button>
  );
}
