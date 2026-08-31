import React from 'react';
import { X, Bell, CheckCircle2, Clock } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Complaint Update',
      desc: 'Ward Repair Team inspects #LK-4092 on MG Road.',
      time: '10 mins ago',
      icon: Clock,
      unread: true
    },
    {
      id: 2,
      title: 'Resolved',
      desc: 'Streetlight pole #42 repair marked complete.',
      time: 'Yesterday',
      icon: CheckCircle2,
      unread: false
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="bottom-sheet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-drag-handle"></div>

        <div className="modal-header">
          <h3 className="modal-title">Notifications</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map(n => (
            <div 
              key={n.id} 
              style={{
                background: n.unread ? '#EFF6FF' : '#F8FAFC',
                border: n.unread ? '1px solid #BFDBFE' : '1px solid #F1F5F9',
                borderRadius: '16px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <n.icon size={20} color={n.unread ? '#2563EB' : '#10B981'} style={{ marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '2px' }}>{n.title}</h4>
                <p style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}>{n.desc}</p>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
