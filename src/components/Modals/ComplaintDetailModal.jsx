import React from 'react';
import { X, MapPin, Clock, ShieldCheck, Tag } from 'lucide-react';

export default function ComplaintDetailModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-drag-handle"></div>

        <div className="modal-header">
          <div>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>#{item.id}</span>
            <h3 className="modal-title">{item.title}</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className={`status-pill ${item.statusType}`}>
            <span className="status-dot"></span>
            {item.status}
          </span>
          <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> {item.time}
          </span>
        </div>

        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '500', marginBottom: '6px' }}>
            Category: <strong style={{ color: '#0F172A' }}>{item.category}</strong>
          </div>
          <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>
            {item.description}
          </p>
        </div>

        <button className="primary-btn" onClick={onClose}>
          Close Details
        </button>
      </div>
    </div>
  );
}
