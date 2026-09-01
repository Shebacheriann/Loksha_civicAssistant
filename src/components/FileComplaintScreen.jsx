import React, { useEffect, useRef, useState } from 'react';
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
  FileText,
  Building2,
  Upload,
  StopCircle,
  RotateCcw,
  X,
  AlertCircle
} from 'lucide-react';

export default function FileComplaintScreen({ onBackToHome, onSubmitSuccess }) {
  // Sub-page navigation: null (main screen) | 'talk' | 'text' | 'photo' | 'location' | 'view-complaint' | 'status-view'
  const [subPage, setSubPage] = useState(null);

  // Initial state: ALL 4 options UNCHECKED by default
  const [voiceData, setVoiceData] = useState('');
  const [textData, setTextData] = useState('');
  const [photoData, setPhotoData] = useState(null);
  const [photoFileName, setPhotoFileName] = useState('');
  const [locationData, setLocationData] = useState('');
  const [locationDetails, setLocationDetails] = useState(null);

  // Sub-page temporary editing state
  const [isRecording, setIsRecording] = useState(false);
  const [tempVoice, setTempVoice] = useState('');
  const [tempText, setTempText] = useState('');
  const [tempPhoto, setTempPhoto] = useState(null);
  const [tempPhotoName, setTempPhotoName] = useState('');

  // Submitted ticket state
  const [createdTicket, setCreatedTicket] = useState(null);
  const [micError, setMicError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);

  const audioStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingTimeoutRef = useRef(null);
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Checkmark indicators (active ONLY when user enters/confirms data)
  const isTalkDone = Boolean(voiceData);
  const isTextDone = Boolean(textData);
  const isPhotoDone = Boolean(photoData);
  const isLocationDone = Boolean(locationData);

  const completedCount = (isTalkDone ? 1 : 0) + (isTextDone ? 1 : 0) + (isPhotoDone ? 1 : 0) + (isLocationDone ? 1 : 0);
  const progressPercent = (completedCount / 4) * 100;

  const stopAudioStream = () => {
    audioStreamRef.current?.getTracks().forEach(track => track.stop());
    audioStreamRef.current = null;
  };

  const stopRecording = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    } else {
      stopAudioStream();
      setTempVoice('Audio captured successfully. Add any extra details in the Text step if needed.');
    }
    setIsRecording(false);
  };

  // Request microphone access only after the user presses the record button.
  const handleToggleRecord = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    setMicError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError('Microphone access is not available in this browser. You can add details using the Text step instead.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      if (typeof MediaRecorder !== 'undefined') {
        const recorder = new MediaRecorder(stream);
        recorder.onstop = () => {
          stopAudioStream();
          mediaRecorderRef.current = null;
          setTempVoice('Audio captured successfully. Add any extra details in the Text step if needed.');
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
      }

      setIsRecording(true);
      recordingTimeoutRef.current = setTimeout(stopRecording, 30000);
    } catch (error) {
      setIsRecording(false);
      stopAudioStream();
      setMicError(
        error?.name === 'NotAllowedError'
          ? 'Microphone access is needed to record your complaint. Allow access in your browser and try again.'
          : 'We could not access your microphone. Please check your device settings and try again.'
      );
    }
  };

  const stopCameraStream = () => {
    cameraStreamRef.current?.getTracks().forEach(track => track.stop());
    cameraStreamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const handleOpenCamera = async () => {
    setCameraError('');
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera access is not available in this browser. Please upload a photo from your device instead.');
      return;
    }

    setIsCameraStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      cameraStreamRef.current = stream;
      setIsCameraOpen(true);
      setIsCameraStarting(false);
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch (error) {
      setIsCameraStarting(false);
      stopCameraStream();
      setCameraError(
        error?.name === 'NotAllowedError'
          ? 'Camera access is needed to take a photo. Allow access in your browser and try again.'
          : 'We could not access your camera. Please check your device settings and try again.'
      );
    }
  };

  const handleCloseCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError('The camera is still starting. Please wait a moment and try again.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    setTempPhoto(canvas.toDataURL('image/jpeg', 0.88));
    setTempPhotoName(`camera-capture-${new Date().toISOString().slice(0, 10)}.jpg`);
    handleCloseCamera();
  };

  const handlePhotoFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const hasSupportedType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      || /\.(jpe?g|png|webp)$/i.test(file.name);
    if (!hasSupportedType) {
      setCameraError('Please choose a JPG, PNG, or WEBP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempPhoto(reader.result);
      setTempPhotoName(file.name);
      setCameraError('');
    };
    reader.onerror = () => setCameraError('We could not read that image. Please choose another file.');
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => {
      stopAudioStream();
      stopCameraStream();
      if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
    };
  }, []);

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
      photoName: photoFileName,
      voice: voiceData,
      text: textData,
      ward: locationData ? 'Ward 112 Public Works' : 'Not specified',
      locationDetails
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
    { id: 'photo', label: 'Photo' },
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
            setLocationDetails(locData);
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
          <div className="complaint-document-header">
            <div className="document-header-topline">
              <div>
                <span className="document-eyebrow">Citizen submission</span>
                <span className="doc-draft-id">{aiDraft.draftId}</span>
              </div>
              <span className="status-pill draft">
                <span className="status-dot"></span> Draft
              </span>
            </div>
            <div className="document-header-title-row">
              <div>
                <h1 className="doc-subject-title">Official Complaint View</h1>
                <p className="document-header-subtitle">Review the details before sending this grievance to the responsible authority.</p>
              </div>
              <span className="ai-verified-tag">
                <Sparkles size={13} /> Loksha AI Drafted
              </span>
            </div>
          </div>

          <section className="doc-section-card">
            <div className="doc-section-heading">
              <span className="doc-section-number">01</span>
              <div>
                <span className="doc-section-label">Subject</span>
                <p className="doc-section-hint">Official complaint title</p>
              </div>
            </div>
            <h2 className="doc-content-title">{aiDraft.subject}</h2>
          </section>

          <section className="doc-section-card">
            <div className="doc-section-heading">
              <span className="doc-section-number">02</span>
              <div>
                <span className="doc-section-label">Description</span>
                <p className="doc-section-hint">Statement prepared from your inputs</p>
              </div>
            </div>
            <p className="doc-text-body">{aiDraft.officialDesc}</p>
          </section>

          <section className="doc-section-card">
            <div className="doc-section-heading">
              <span className="doc-section-number">03</span>
              <div>
                <span className="doc-section-label">Location</span>
                <p className="doc-section-hint">Where the issue was reported</p>
              </div>
            </div>
            <div className="doc-detail-grid">
              <div className="doc-detail-item wide">
                <span className="doc-detail-label">Address</span>
                <strong><MapPin size={15} /> {aiDraft.location}</strong>
              </div>
              <div className="doc-detail-item">
                <span className="doc-detail-label">Ward / area</span>
                <strong>{aiDraft.ward}</strong>
              </div>
              {aiDraft.locationDetails?.lat !== null && aiDraft.locationDetails?.lat !== undefined && (
                <div className="doc-detail-item">
                  <span className="doc-detail-label">GPS coordinates</span>
                  <strong>
                    {aiDraft.locationDetails.lat.toFixed(6)}, {aiDraft.locationDetails.lng.toFixed(6)}
                  </strong>
                </div>
              )}
            </div>
            {aiDraft.locationDetails?.mapPreview ? (
              <div className="document-map-preview">
                <div className="document-map-grid"></div>
                <div className="document-map-road road-one"></div>
                <div className="document-map-road road-two"></div>
                <MapPin size={26} className="document-map-pin" />
                <span>Map preview captured during location selection</span>
              </div>
            ) : (
              <p className="doc-empty-text inline-empty">Map preview not available for this location.</p>
            )}
          </section>

          <section className="doc-section-card">
            <div className="doc-section-heading">
              <span className="doc-section-number">04</span>
              <div>
                <span className="doc-section-label">Photo Evidence</span>
                <p className="doc-section-hint">Files attached to support the report</p>
              </div>
            </div>
            {aiDraft.photo ? (
              <div className="document-evidence-grid">
                <div className="document-evidence-card">
                  <img src={aiDraft.photo} alt="Complaint evidence" className="doc-img" />
                  <span className="photo-attached-tag">Evidence attached</span>
                  {aiDraft.photoName && <span className="document-evidence-name">{aiDraft.photoName}</span>}
                </div>
              </div>
            ) : (
              <p className="doc-empty-text inline-empty">No evidence attached</p>
            )}
          </section>

          <section className="doc-section-card">
            <div className="doc-section-heading">
              <span className="doc-section-number">05</span>
              <div>
                <span className="doc-section-label">Responsible Department / Authority</span>
                <p className="doc-section-hint">Suggested routing destination</p>
              </div>
            </div>
            <div className="department-callout">
              <div className="department-icon"><Building2 size={20} /></div>
              <div>
                <strong>{aiDraft.ward}</strong>
                <span>Assigned based on the complaint location and category.</span>
              </div>
            </div>
          </section>

          <div className="document-submission-meta">
            <Calendar size={16} />
            <div>
              <span>Prepared date and time</span>
              <strong>{aiDraft.date}</strong>
            </div>
          </div>
        </div>

        <div className="file-complaint-footer document-action-footer">
          <button className="secondary-outline-btn document-edit-btn" onClick={() => setSubPage(null)}>
            <Edit3 size={16} />
            Edit Complaint Inputs
          </button>
          <button className="primary-btn document-submit-btn" onClick={handleSaveAndSubmit}>
            <Send size={18} />
            <span>Submit Official Complaint</span>
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
            <p>Tap the mic button to describe what needs fixing. Loksha will turn your words into a clear complaint.</p>
          </div>

          <div className="mic-recorder-zone">
            <button 
              className={`giant-mic-btn ${isRecording ? 'recording' : ''}`}
              onClick={handleToggleRecord}
            >
              {isRecording ? <StopCircle size={36} /> : <Mic size={36} />}
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

          {micError && (
            <div className="permission-message error" role="alert">
              <AlertCircle size={17} />
              <span>{micError}</span>
              <button type="button" onClick={handleToggleRecord}>Try again</button>
            </div>
          )}

          {tempVoice && !isRecording && (
            <div className="transcript-card">
              <span className="transcript-label">Recording ready:</span>
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
            <h2>Photo Evidence</h2>
            <p>Add a photo to help officers understand and verify the issue.</p>
          </div>

          {cameraError && (
            <div className="permission-message error" role="alert">
              <AlertCircle size={17} />
              <span>{cameraError}</span>
              {!isCameraOpen && <button type="button" onClick={handleOpenCamera}>Try again</button>}
            </div>
          )}

          {isCameraOpen ? (
            <div className="camera-capture-card">
              <video ref={videoRef} className="camera-video-preview" autoPlay playsInline muted />
              <div className="camera-capture-actions">
                <button type="button" className="secondary-outline-btn" onClick={handleCloseCamera}>
                  <X size={16} /> Cancel
                </button>
                <button type="button" className="photo-capture-btn" onClick={handleCapturePhoto}>
                  <Camera size={17} /> Capture Photo
                </button>
              </div>
            </div>
          ) : tempPhoto ? (
            <div className="photo-preview-container">
              <div className="photo-preview-image-wrap">
                <img src={tempPhoto} alt="Selected complaint evidence" className="full-photo-preview" />
                <span className="photo-preview-check"><Check size={14} /></span>
              </div>
              <div className="photo-preview-meta">
                <div>
                  <strong>Photo ready to attach</strong>
                  <span>{tempPhotoName || 'Selected image'}</span>
                </div>
                <button
                  type="button"
                  className="delete-photo-btn"
                  onClick={() => {
                    setTempPhoto(null);
                    setTempPhotoName('');
                  }}
                >
                  <Trash2 size={15} /> Remove
                </button>
              </div>
              <div className="photo-replace-actions">
                <button type="button" className="photo-upload-link" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={15} /> Upload a different photo
                </button>
                <button type="button" className="photo-upload-link" onClick={handleOpenCamera}>
                  <RotateCcw size={15} /> Take another photo
                </button>
              </div>
            </div>
          ) : (
            <div className="photo-upload-section">
              <button type="button" className="photo-capture-btn photo-capture-btn-large" onClick={handleOpenCamera} disabled={isCameraStarting}>
                <span className="photo-action-icon"><Camera size={25} /></span>
                <span className="photo-action-copy">
                  <strong>{isCameraStarting ? 'Opening camera…' : 'Take a Photo'}</strong>
                  <small>Use your camera to capture evidence</small>
                </span>
              </button>
              <div className="photo-upload-divider"><span>or</span></div>
              <button type="button" className="photo-upload-link" onClick={() => fileInputRef.current?.click()}>
                <Upload size={15} /> Upload from device
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            className="visually-hidden-input"
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={handlePhotoFileChange}
          />
        </div>

        <div className="file-complaint-footer">
          <button 
            className="primary-btn"
            style={{ borderRadius: '28px', padding: '16px' }}
            onClick={() => {
              setPhotoData(tempPhoto);
              setPhotoFileName(tempPhotoName);
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

          {/* Option 3: 📷 Photo */}
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
              <h3 className="option-title">Photo</h3>
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
