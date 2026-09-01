import React, { useState } from 'react';
import LocationPage from './LocationPage';
import { 
  ChevronLeft, 
  Mic, 
  Edit3, 
  Camera, 
  MapPin, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Trash2,
  RefreshCw,
  Eye,
  Bookmark,
  Send,
  Calendar,
  FileText
} from 'lucide-react';

export default function FileComplaintScreen({ onBackToHome, onSubmitSuccess }) {
  // Sub-page navigation: null (main screen) | 'talk' | 'text' | 'photo' | 'location' | 'view-complaint' | 'status-view'
  const [subPage, setSubPage] = useState(null);

  // Initial state: ALL 4 options UNCHECKED by default
  const [voiceData, setVoiceData] = useState('');
  const [textData, setTextData] = useState('');
  const [photoData, setPhotoData] = useState(null);
  const [locationData, setLocationData] = useState('');

  // Sub-page temporary editing state
  const [isRecording, setIsRecording] = useState(false);
  const [tempVoice, setTempVoice] = useState('');
  const [tempText, setTempText] = useState('');
  const [tempPhoto, setTempPhoto] = useState(null);

  // Submitted ticket state
  const [createdTicket, setCreatedTicket] = useState(null);

  // Checkmark indicators (active ONLY when user enters/confirms data)
  const isTalkDone = Boolean(voiceData);
  const isTextDone = Boolean(textData);
  const isPhotoDone = Boolean(photoData);
  const isLocationDone = Boolean(locationData);

  const completedCount = (isTalkDone ? 1 : 0) + (isTextDone ? 1 : 0) + (isPhotoDone ? 1 : 0) + (isLocationDone ? 1 : 0);
  const progressPercent = (completedCount / 4) * 100;

  // Toggle Voice Recording in Talk Sub-Page
  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setTempVoice('Large hazardous pothole and broken streetlight near Metro Station Gate 2.');
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  // Generate AI-Drafted Official Complaint object
  const getAiDraftedComplaint = () => {
    const timeString = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' • ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    let subject = 'Civic Infrastructure Grievance';
    if (voiceData.toLowerCase().includes('pothole') || textData.toLowerCase().includes('pothole')) {
      subject = 'Urgent Action Required: Road Damage & Pothole Hazard';
    } else if (voiceData.toLowerCase().includes('light') || textData.toLowerCase().includes('light')) {
      subject = 'Street Lighting Infrastructure Failure';
    } else if (voiceData || textData) {
      subject = `Grievance: ${(voiceData || textData).slice(0, 32)}...`;
    }

    let officialDesc = 'Grievance submitted via Loksha Civic Assistant.';
    if (voiceData && textData) {
      officialDesc = `Primary Voice Report: "${voiceData}"\n\nAdditional Citizen Details: "${textData}"`;
    } else if (voiceData) {
      officialDesc = `Voice Recording Transcript: "${voiceData}"`;
    } else if (textData) {
      officialDesc = `Citizen Written Statement: "${textData}"`;
    }

    return {
      draftId: `LK-DRAFT-${Math.floor(6000 + Math.random() * 3000)}`,
      date: timeString,
      subject,
      officialDesc,
      location: locationData || 'Not provided',
      photo: photoData,
      voice: voiceData,
      text: textData,
      ward: locationData ? 'Ward 112 Public Works' : 'Unassigned Ward'
    };
  };

  // Actions
  const handleSaveDraft = () => {
    setSubPage('view-complaint');
  };

  const handleViewComplaint = () => {
    setSubPage('view-complaint');
  };

  const handleSaveAndSubmit = () => {
    const ticketId = `LK-${Math.floor(7000 + Math.random() * 2000)}`;
    const ticket = {
      id: ticketId,
      title: getAiDraftedComplaint().subject,
      status: 'In Progress',
      statusType: 'in-progress',
      time: 'Just now',
      category: 'Civic Grievance (AI-Routed)',
      description: voiceData || textData || 'Complaint submitted with visual/location evidence.',
      location: locationData || 'Confirmed Location'
    };
    setCreatedTicket(ticket);
    if (onSubmitSuccess) onSubmitSuccess(ticket);
    setSubPage('status-view');
  };

  const aiDraft = getAiDraftedComplaint();

  const complaintFlowSections = [
    { id: 'talk', label: 'Talk' },
    { id: 'text', label: 'Text' },
    { id: 'photo', label: 'Photo / Video' },
    { id: 'location', label: 'Location' }
  ];

  const ComplaintFlowNav = ({ active }) => (
    <nav className="complaint-flow-nav" aria-label="Complaint workflow">
      <button
        type="button"
        className={`complaint-flow-nav-item overview ${!active ? 'active' : ''}`}
        onClick={() => setSubPage(null)}
      >
        Overview
      </button>
      {complaintFlowSections.map(section => (
        <button
          type="button"
          key={section.id}
          className={`complaint-flow-nav-item ${active === section.id ? 'active' : ''}`}
          onClick={() => setSubPage(section.id)}
        >
          {section.label}
          {(
            (section.id === 'talk' && isTalkDone) ||
            (section.id === 'text' && isTextDone) ||
            (section.id === 'photo' && isPhotoDone) ||
            (section.id === 'location' && isLocationDone)
          ) && <Check size={14} aria-label="Completed" />}
        </button>
      ))}
    </nav>
  );

  // ----------------------------------------------------
  // SUB-PAGE: FULL-SCREEN LOCATION PAGE (3 Ways)
  // ----------------------------------------------------
  if (subPage === 'location') {
    return (
      <div className="complaint-location-shell">
        <ComplaintFlowNav active="location" />
        <LocationPage
          initialLocation={locationData}
          onSaveLocation={(locData) => {
            setLocationData(locData.address);
            setSubPage(null);
          }}
          onBack={() => setSubPage(null)}
        />
      </div>
    );
  }

  // ----------------------------------------------------
  // SUB-PAGE: FULL-SCREEN COMPLAINT VIEW PAGE (Official Format)
  // ----------------------------------------------------
  if (subPage === 'view-complaint') {
    return (
      <div className="file-complaint-page full-complaint-view-screen">
        <ComplaintFlowNav active="view-complaint" />
        <div className="top-nav-bar">
          <button className="back-btn" onClick={() => setSubPage(null)}>
            <ChevronLeft size={20} />
          </button>
          <span className="nav-page-title">Official Complaint View</span>
          <div style={{ width: 38 }}></div>
        </div>

        <div className="complaint-doc-body">
          <div className="doc-header-card">
            <div className="doc-badge-row">
              <span className="doc-draft-id">{aiDraft.draftId}</span>
              <span className="ai-verified-tag">
                <Sparkles size={13} /> Loksha AI Drafted
              </span>
            </div>
            <h2 className="doc-subject-title">{aiDraft.subject}</h2>
            <div className="doc-date-row">
              <Calendar size={13} />
              <span>{aiDraft.date}</span>
            </div>
          </div>

          <div className="doc-section-card">
            <h3 className="doc-section-label">Official Grievance Statement</h3>
            <p className="doc-text-body">{aiDraft.officialDesc}</p>
          </div>

          <div className="doc-section-card">
            <h3 className="doc-section-label">Location Information</h3>
            <div className="doc-meta-row">
              <MapPin size={16} color="#10B981" />
              <span>{aiDraft.location}</span>
            </div>
          </div>

          <div className="doc-section-card">
            <h3 className="doc-section-label">Photo / Video Evidence</h3>
            {aiDraft.photo ? (
              <div className="doc-photo-box">
                <img src={aiDraft.photo} alt="Evidence" className="doc-img" />
                <span className="photo-attached-tag">✓ 1 Evidence File Attached</span>
              </div>
            ) : (
              <p className="doc-empty-text">No photo evidence attached.</p>
            )}
          </div>

          <div className="doc-section-card ward-info">
            <h3 className="doc-section-label">Assigned Department</h3>
            <p className="ward-name-text">🏛️ {aiDraft.ward}</p>
          </div>
        </div>

        <div className="file-complaint-footer stacked-footer">
          <button
            className="primary-btn" 
            style={{ borderRadius: '28px', padding: '15px' }}
            onClick={handleSaveAndSubmit}
          >
            <Send size={18} />
            <span>Submit Official Complaint</span>
          </button>

          <button
            className="secondary-outline-btn"
            onClick={() => setSubPage(null)}
          >
            Edit Complaint Inputs
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SUB-PAGE: COMPLAINT STATUS DETAILS PAGE
  // ----------------------------------------------------
  if (subPage === 'status-view' && createdTicket) {
    return (
      <div className="file-complaint-page">
        <ComplaintFlowNav active="status-view" />
        <div className="top-nav-bar">
          <button className="back-btn" onClick={onBackToHome}>
            <ChevronLeft size={20} />
          </button>
          <span className="nav-page-title">Complaint Status</span>
          <div style={{ width: 38 }}></div>
        </div>

        <div className="success-screen-body">
          <div className="success-badge-icon">
            <CheckCircle2 size={44} color="#10B981" />
          </div>
          <h2 className="success-title">Submitted Successfully!</h2>
          <p className="success-subtitle">
            Complaint <strong>#{createdTicket.id}</strong> has been registered and dispatched for processing.
          </p>

          <div className="ticket-summary-card">
            <div className="ticket-header-row">
              <span className="ticket-id-tag">#{createdTicket.id}</span>
              <span className="status-pill in-progress">
                <span className="status-dot"></span> In Progress
              </span>
            </div>
            <h3 className="ticket-title">{createdTicket.title}</h3>
            <p className="ticket-cat">{createdTicket.category}</p>
            <p className="ticket-loc">📍 {createdTicket.location}</p>
          </div>

          <button className="primary-btn" onClick={onBackToHome} style={{ borderRadius: '28px', padding: '16px' }}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // SUB-PAGES FOR TALK, TEXT, PHOTO
  // ----------------------------------------------------
  if (subPage === 'talk') {
    return (
      <div className="file-complaint-page subpage-view">
        <ComplaintFlowNav active="talk" />
        <div className="top-nav-bar">
          <button className="back-btn" onClick={() => setSubPage(null)}>
            <ChevronLeft size={20} />
          </button>
          <span className="nav-page-title">Describe the Issue</span>
          <div style={{ width: 38 }}></div>
        </div>

        <div className="subpage-body">
          <div className="subpage-header">
            <div className="subpage-icon-badge voice">
              <Mic size={24} />
            </div>
            <h2>Speak to Loksha</h2>
            <p>Tap the mic button to record what needs fixing. Loksha will convert it into a clear statement.</p>
          </div>

          <div className="mic-recorder-zone">
            <button 
              className={`giant-mic-btn ${isRecording ? 'recording' : ''}`}
              onClick={handleToggleRecord}
            >
              <Mic size={36} />
            </button>

            {isRecording && (
              <div className="audio-wave-container" style={{ width: '200px', margin: '20px auto 0 auto' }}>
                <div className="bar bar1"></div>
                <div className="bar bar2"></div>
                <div className="bar bar3"></div>
                <div className="bar bar4"></div>
                <div className="bar bar5"></div>
              </div>
            )}

            <span className="mic-hint-text">
              {isRecording ? 'Listening... Tap to stop' : (tempVoice ? 'Tap mic to re-record' : 'Tap mic to start recording')}
            </span>
          </div>

          {tempVoice && !isRecording && (
            <div className="transcript-card">
              <span className="transcript-label">Recorded Description:</span>
              <p>"{tempVoice}"</p>
            </div>
          )}
        </div>

        <div className="file-complaint-footer">
          <button 
            className="primary-btn"
            style={{ borderRadius: '28px', padding: '16px' }}
            onClick={() => {
              setVoiceData(tempVoice);
              setSubPage(null);
            }}
          >
            Save Voice Entry
          </button>
        </div>
      </div>
    );
  }

  if (subPage === 'text') {
    return (
      <div className="file-complaint-page subpage-view">
        <ComplaintFlowNav active="text" />
        <div className="top-nav-bar">
          <button className="back-btn" onClick={() => setSubPage(null)}>
            <ChevronLeft size={20} />
          </button>
          <span className="nav-page-title">Add Details</span>
          <div style={{ width: 38 }}></div>
        </div>

        <div className="subpage-body">
          <div className="subpage-header">
            <div className="subpage-icon-badge text">
              <Edit3 size={24} />
            </div>
            <h2>Written Details (Optional)</h2>
            <p>Type any additional notes, reference numbers, or details about the issue.</p>
          </div>

          <div className="form-group" style={{ width: '100%', marginTop: '16px' }}>
            <textarea 
              className="form-textarea" 
              rows="5"
              placeholder="Type details here..."
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              style={{ borderRadius: '16px', padding: '16px', fontSize: '14px', background: '#FFFFFF' }}
            />
          </div>
        </div>

        <div className="file-complaint-footer">
          <button 
            className="primary-btn"
            style={{ borderRadius: '28px', padding: '16px' }}
            onClick={() => {
              setTextData(tempText);
              setSubPage(null);
            }}
          >
            Save Text Details
          </button>
        </div>
      </div>
    );
  }

  if (subPage === 'photo') {
    return (
      <div className="file-complaint-page subpage-view">
        <ComplaintFlowNav active="photo" />
        <div className="top-nav-bar">
          <button className="back-btn" onClick={() => setSubPage(null)}>
            <ChevronLeft size={20} />
          </button>
          <span className="nav-page-title">Add Evidence</span>
          <div style={{ width: 38 }}></div>
        </div>

        <div className="subpage-body">
          <div className="subpage-header">
            <div className="subpage-icon-badge photo">
              <Camera size={24} />
            </div>
            <h2>Photo or Video Evidence</h2>
            <p>Attach visual evidence to help officers identify and resolve the problem.</p>
          </div>

          {tempPhoto ? (
            <div className="photo-preview-container">
              <img src={tempPhoto} alt="Evidence" className="full-photo-preview" />
              <button className="delete-photo-btn" onClick={() => setTempPhoto(null)}>
                <Trash2 size={16} /> Remove Photo
              </button>
            </div>
          ) : (
            <div 
              className="upload-dropzone" 
              onClick={() => setTempPhoto('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80')}
            >
              <Camera size={38} color="#D97706" />
              <span>Tap to Capture or Upload Photo</span>
            </div>
          )}
        </div>

        <div className="file-complaint-footer">
          <button 
            className="primary-btn"
            style={{ borderRadius: '28px', padding: '16px' }}
            onClick={() => {
              setPhotoData(tempPhoto);
              setSubPage(null);
            }}
          >
            Save Photo Evidence
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN FULL-SCREEN "FILE A COMPLAINT" PAGE
  // ----------------------------------------------------
  return (
    <div className="file-complaint-page main-options-screen">
      <ComplaintFlowNav />
      
      {/* Top Navigation Bar */}
      <div className="top-nav-bar">
        <button className="back-btn" onClick={onBackToHome} title="Back to Home">
          <ChevronLeft size={20} />
        </button>
        <span className="nav-page-title">File a Complaint</span>
        <div style={{ width: 38 }}></div>
      </div>

      {/* Scrollable Main Content Container */}
      <div className="file-complaint-scroll-content">
        
        {/* Title & Subtitle */}
        <div className="page-header-group">
          <h1 className="page-main-title">File a Complaint</h1>
          <p className="page-subtitle">
            Tell Loksha what happened. We'll help you report it.
          </p>
        </div>

        {/* Clean Progress Bar ONLY (NO text labels) */}
        <div className="clean-progress-bar-container">
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.max(progressPercent, 5)}%` }}
            ></div>
          </div>
        </div>

        {/* 4 Clean Options Grid */}
        <div className="equally-sized-options-grid">

          {/* Option 1: 🎤 Talk */}
          <button
            type="button"
            className={`option-equal-card ${isTalkDone ? 'completed' : ''}`}
            onClick={() => {
              setTempVoice(voiceData);
              setSubPage('talk');
            }}
          >
            {isTalkDone && (
              <div className="check-badge">
                <Check size={13} color="#FFFFFF" strokeWidth={3} />
              </div>
            )}
            <div className="option-icon-box voice">
              <Mic size={22} />
            </div>
            <div className="option-text-group">
              <h3 className="option-title">Talk</h3>
              <p className="option-sub">Describe the issue</p>
            </div>
          </button>

          {/* Option 2: ✏️ Text (Optional) */}
          <button
            type="button"
            className={`option-equal-card ${isTextDone ? 'completed' : ''}`}
            onClick={() => {
              setTempText(textData);
              setSubPage('text');
            }}
          >
            {isTextDone && (
              <div className="check-badge">
                <Check size={13} color="#FFFFFF" strokeWidth={3} />
              </div>
            )}
            <div className="option-top-flex">
              <div className="option-icon-box text">
                <Edit3 size={22} />
              </div>
              <span className="optional-tag">Optional</span>
            </div>
            <div className="option-text-group">
              <h3 className="option-title">Text</h3>
              <p className="option-sub">Add details</p>
            </div>
          </button>

          {/* Option 3: 📷 Photo / Video */}
          <button
            type="button"
            className={`option-equal-card ${isPhotoDone ? 'completed' : ''}`}
            onClick={() => {
              setTempPhoto(photoData);
              setSubPage('photo');
            }}
          >
            {isPhotoDone && (
              <div className="check-badge">
                <Check size={13} color="#FFFFFF" strokeWidth={3} />
              </div>
            )}
            <div className="option-icon-box photo">
              <Camera size={22} />
            </div>
            <div className="option-text-group">
              <h3 className="option-title">Photo / Video</h3>
              <p className="option-sub">Add evidence</p>
            </div>
          </button>

          {/* Option 4: 📍 Location */}
          <button
            type="button"
            className={`option-equal-card ${isLocationDone ? 'completed' : ''}`}
            onClick={() => {
              setSubPage('location');
            }}
          >
            {isLocationDone && (
              <div className="check-badge">
                <Check size={13} color="#FFFFFF" strokeWidth={3} />
              </div>
            )}
            <div className="option-icon-box location">
              <MapPin size={22} />
            </div>
            <div className="option-text-group">
              <h3 className="option-title">Location</h3>
              <p className="option-sub">{isLocationDone ? 'Location Confirmed' : 'Confirm location'}</p>
            </div>
          </button>

        </div>

      </div>

      {/* Clearly Visible Action Buttons at the Bottom */}
      <div className="file-complaint-footer action-buttons-group">
        
        {/* Main Action 1: Save & Submit */}
        <button 
          className="primary-btn submit-main-btn"
          onClick={handleSaveAndSubmit}
        >
          <Send size={18} />
          <span>Save & Submit</span>
        </button>

        {/* Secondary Row: Save & View Complaint */}
        <div className="secondary-btn-row">
          <button 
            className="secondary-action-btn"
            onClick={handleSaveDraft}
          >
            <Bookmark size={15} />
            <span>Save</span>
          </button>

          <button 
            className="secondary-action-btn"
            onClick={handleViewComplaint}
          >
            <Eye size={15} />
            <span>View Complaint</span>
          </button>
        </div>

      </div>

    </div>
  );
}
