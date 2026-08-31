import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, MapPin, ChevronRight } from 'lucide-react';

export default function TrackComplaintModal({ isOpen, onClose, complaints }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  if (!isOpen) return null;

  const filtered = complaints.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-drag-handle"></div>

        <div className="modal-header">
          <h3 className="modal-title">Track Your Complaints</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {selectedItem ? (
          <div>
            <button 
              onClick={() => setSelectedItem(null)} 
              style={{
                background: 'none',
                border: 'none',
                color: '#3B82F6',
                fontWeight: '600',
                fontSize: '13px',
                marginBottom: '14px',
                cursor: 'pointer'
              }}
            >
              ← Back to list
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>#{selectedItem.id}</span>
              <span className={`status-pill ${selectedItem.statusType}`}>
                <span className="status-dot"></span>
                {selectedItem.status}
              </span>
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>{selectedItem.title}</h4>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: '1.5', marginBottom: '20px' }}>
              {selectedItem.description}
            </p>

            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '24px' }}>
              <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: '#E2E8F0' }}></div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-24px', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#3B82F6', border: '3px solid #FFFFFF' }}></div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>Complaint Registered</div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>{selectedItem.time}</div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-24px', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: selectedItem.statusType === 'in-progress' || selectedItem.statusType === 'resolved' ? '#F59E0B' : '#E2E8F0', border: '3px solid #FFFFFF' }}></div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>Assigned to Ward Engineer</div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>Field Inspection Officer</div>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-24px', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: selectedItem.statusType === 'resolved' ? '#10B981' : '#E2E8F0', border: '3px solid #FFFFFF' }}></div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: selectedItem.statusType === 'resolved' ? '#0F172A' : '#94A3B8' }}>Resolution Verified</div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>{selectedItem.statusType === 'resolved' ? 'Closed' : 'Pending resolution'}</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94A3B8' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '38px' }}
                  placeholder="Search by ticket ID or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(item => (
                <div 
                  key={item.id} 
                  className="complaint-card"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="complaint-card-top">
                    <div className="complaint-info">
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>#{item.id}</span>
                      <h4 className="complaint-title">{item.title}</h4>
                    </div>
                    <span className={`status-pill ${item.statusType}`}>
                      <span className="status-dot"></span>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
