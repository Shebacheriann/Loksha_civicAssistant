import React from 'react';
import { X, User, MapPin, Phone, ShieldCheck, LogOut } from 'lucide-react';

export default function ProfileDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-drag-handle"></div>

        <div className="modal-header">
          <h3 className="modal-title">Citizen Profile</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)',
            color: '#4338CA',
            fontWeight: '700',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px auto',
            border: '3px solid #FFFFFF',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            J
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A' }}>John Doe</h4>
          <p style={{ fontSize: '13px', color: '#64748B' }}>Ward 112 • MG Road Area</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F8FAFC', borderRadius: '14px' }}>
            <Phone size={18} color="#64748B" />
            <span style={{ fontSize: '14px', color: '#0F172A', fontWeight: '500' }}>+91 98765 43210</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F8FAFC', borderRadius: '14px' }}>
            <MapPin size={18} color="#64748B" />
            <span style={{ fontSize: '14px', color: '#0F172A', fontWeight: '500' }}>4th Cross Road, MG Road, Ward 112</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F8FAFC', borderRadius: '14px' }}>
            <ShieldCheck size={18} color="#10B981" />
            <span style={{ fontSize: '14px', color: '#0F172A', fontWeight: '500' }}>Verified Citizen ID</span>
          </div>
        </div>

        <button 
          className="primary-btn" 
          onClick={onClose} 
          style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1' }}
        >
          Close Profile
        </button>
      </div>
    </div>
  );
}
