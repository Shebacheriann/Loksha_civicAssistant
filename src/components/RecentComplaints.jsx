import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function RecentComplaints({ onSelectComplaint }) {
  const complaints = [
    {
      id: 'LK-4092',
      title: 'Pothole on MG Road',
      status: 'In Progress',
      statusType: 'in-progress',
      time: '2 hours ago',
      category: 'Road Repair',
      description: 'Large pothole near Metro Station Gate 2 causing traffic slowdowns.'
    },
    {
      id: 'LK-3811',
      title: 'Streetlight Not Working',
      status: 'Resolved',
      statusType: 'resolved',
      time: 'Yesterday',
      category: 'Electrical',
      description: 'Streetlight pole #42 on 4th Cross Road repaired by Ward Maintenance team.'
    }
  ];

  return (
    <section className="recent-section">
      <div className="recent-header">
        <h3 className="recent-section-title">Recent Complaints</h3>
      </div>

      <div className="recent-cards-list">
        {complaints.map((item) => (
          <div 
            key={item.id} 
            className="complaint-card"
            onClick={() => onSelectComplaint(item)}
            role="button"
            tabIndex={0}
          >
            <div className="complaint-card-top">
              <div className="complaint-info">
                <h4 className="complaint-title">{item.title}</h4>
                <div className="complaint-meta">
                  <span>#{item.id}</span>
                  <span className="complaint-meta-dot"></span>
                  <span>{item.time}</span>
                </div>
              </div>
              <span className={`status-pill ${item.statusType}`}>
                <span className="status-dot"></span>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
