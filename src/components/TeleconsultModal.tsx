import React, { useState, useRef, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Activity,
  FileText,
  User,
  Heart,
  Thermometer,
  Wind,
  ShieldCheck,
  Send,
  MessageSquare,
  Volume2,
  Camera,
  CameraOff,
  RefreshCw,
  FlipHorizontal,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import doctorTeleImg from '../assets/images/doctor_teleconsult_1788025790089.jpg';
import ashaCareImg from '../assets/images/asha_worker_care_1788025776530.jpg';
import patientFamilyImg from '../assets/images/patient_family_wellness_1788025804396.jpg';

export const TeleconsultModal: React.FC = () => {
  const {
    activeTeleconsultPatient,
    setActiveTeleconsultPatient,
    currentRole,
    language
  } = useHealth();

  const loc = {
    en: {
      sessionTitle: 'eSanjeevani / Sanjeevani AI Teleconsultation Session',
      encryptedBadge: 'Encrypted • WebRTC Link Active',
      videoMuted: 'Video Muted',
      endCall: 'End Teleconsult',
      abhaConsentActive: 'ABHA Record Consent Active',
      intercomTitle: 'Live Intercom (ASHA • Doctor • Patient)',
      chatPlaceholder: 'Type advice or message...',
      scratchpadTitle: 'Doctor Consultation Scratchpad',
      bp: 'BP',
      temp: 'Temp',
      spO2: 'SpO2',
      pulse: 'Pulse',
      startPatientCam: 'Enable Live Patient Cam',
      useSimulated: 'Use Simulated Video',
      liveWebcamBadge: 'Live Patient Webcam Active',
      camLoading: 'Starting Camera...',
      flipCam: 'Flip Camera'
    },
    hi: {
      sessionTitle: 'ई-संजीवनी / संजीवनी एआई टेलीकंसल्टेशन सत्र',
      encryptedBadge: 'एन्क्रिप्टेड • वेब-आरटीसी लिंक सक्रिय',
      videoMuted: 'वीडियो बंद है',
      endCall: 'कॉल समाप्त करें',
      abhaConsentActive: 'आभा (ABHA) रिकॉर्ड सहमति सक्रिय',
      intercomTitle: 'लाइव इंटरकॉम (आशा • डॉक्टर • मरीज)',
      chatPlaceholder: 'सलाह या संदेश टाइप करें...',
      scratchpadTitle: 'डॉक्टर परामर्श स्क्रैचपैड',
      bp: 'बीपी',
      temp: 'तापमान',
      spO2: 'ऑक्सीजन',
      pulse: 'पल्स',
      startPatientCam: 'मरीज का लाइव कैमरा चालू करें',
      useSimulated: 'सिम्युलेटेड वीडियो देखें',
      liveWebcamBadge: 'मरीज का लाइव वेबकैम सक्रिय',
      camLoading: 'कैमरा शुरू हो रहा है...',
      flipCam: 'कैमरा बदलें'
    },
    mr: {
      sessionTitle: 'ई-संजीवनी / संजीवनी एआय टेलिकन्सल्टेशन सत्र',
      encryptedBadge: 'सुरक्षित (Encrypted) • वेब-आरटीसी लिंक सुरू',
      videoMuted: 'व्हिडीओ बंद आहे',
      endCall: 'कॉल समाप्त करा',
      abhaConsentActive: 'आभा (ABHA) रेकॉर्ड संमती सक्रिय',
      intercomTitle: 'थेट संवाद (आशा • डॉक्टर • रुग्ण)',
      chatPlaceholder: 'सल्ला किंवा संदेश टाईप करा...',
      scratchpadTitle: 'डॉक्टर तपासणी टिपण (Scratchpad)',
      bp: 'रक्तदाब',
      temp: 'तापमान',
      spO2: 'ऑक्सिजन',
      pulse: 'नाडी',
      startPatientCam: 'रुग्णाचा थेट कॅमेरा सुरू करा',
      useSimulated: 'सिम्युलेटेड व्हिडीओ वापरा',
      liveWebcamBadge: 'रुग्णाचा थेट कॅमेरा सुरू आहे',
      camLoading: 'कॅमेरा सुरू होत आहे...',
      flipCam: 'कॅमेरा बदला'
    }
  }[language];

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [usePatientWebcam, setUsePatientWebcam] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [camLoading, setCamLoading] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);

  const patientVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'ASHA Sunita Bai', text: 'Namaste Doctor, patient Savita Devi is present with me at Rampur Sub-centre.', time: '11:02 AM' },
    { sender: 'Doctor', text: 'Namaste Sunita. I can see her vitals. She has high BP 165/102. Is she feeling dizzy?', time: '11:03 AM' },
    { sender: 'Patient (Savita)', text: 'Doctor sahab, severe headache since yesterday morning and feet have swollen.', time: '11:04 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [consultNotes, setConsultNotes] = useState('Patient 28 weeks ANC. Pedal edema +2. Start Tab Labetalol 100mg BD. Urgent urine albumin test.');

  const startPatientCamera = async (facing: 'user' | 'environment' = 'user') => {
    setCamLoading(true);
    setCamError(null);

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Camera access API is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: facing
        },
        audio: false // prevent local feedback audio loop
      });

      streamRef.current = stream;
      setUsePatientWebcam(true);
      setFacingMode(facing);

      if (patientVideoRef.current) {
        patientVideoRef.current.srcObject = stream;
        await patientVideoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera initiation failed:', err);
      let errorMsg = 'Could not access camera. Please allow camera permissions in your browser.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission was denied. Please click the camera/lock icon in your browser address bar to allow camera access.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No video camera detected on your computer or phone. Reverting to simulated sub-centre stream.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Camera is already in use by another application. Please free up the webcam and retry.';
      }
      setCamError(errorMsg);
      setUsePatientWebcam(false);
    } finally {
      setCamLoading(false);
    }
  };

  const stopPatientCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (patientVideoRef.current) {
      patientVideoRef.current.srcObject = null;
    }
    setUsePatientWebcam(false);
    setCamError(null);
  };

  const togglePatientWebcam = () => {
    if (usePatientWebcam) {
      stopPatientCamera();
    } else {
      startPatientCamera(facingMode);
    }
  };

  const flipCamera = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    startPatientCamera(nextFacing);
  };

  // Sync video tracks on/off with isVideoOn
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOn;
      });
    }
  }, [isVideoOn]);

  // When patientVideoRef mounts or usePatientWebcam is activated, attach media stream
  useEffect(() => {
    if (usePatientWebcam && streamRef.current && patientVideoRef.current) {
      patientVideoRef.current.srcObject = streamRef.current;
      patientVideoRef.current.play().catch(() => {});
    }
  }, [usePatientWebcam]);

  // Clean up all hardware streams when component unmounts or call ends
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  if (!activeTeleconsultPatient) return null;

  const pat = activeTeleconsultPatient;
  const vitals = pat.lastVitals;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: currentRole === 'doctor' ? 'Dr. Rajesh Kulkarni' : `${pat.name} (Patient)`,
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
      }
    ]);
    setChatInput('');
  };

  const handleEndCall = () => {
    stopPatientCamera();
    setActiveTeleconsultPatient(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        {/* Modal Top Bar */}
        <div className="bg-slate-800/90 border-b border-slate-700 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-sm sm:text-base md:text-lg">
                {loc.sessionTitle}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] px-2 py-0.5 rounded-full font-medium hidden sm:inline">
                {loc.encryptedBadge}
              </span>
            </div>
          </div>
          <button
            onClick={handleEndCall}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            title="End Teleconsultation"
          >
            <PhoneOff className="w-5 h-5 text-rose-400" />
          </button>
        </div>

        {/* Teleconsult Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 p-3 sm:p-4 overflow-y-auto">
          {/* Main Video Stage (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col space-y-3">
            {/* Primary Video Feed: Remote Patient / Sub-centre or Live Webcam */}
            <div className="relative aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
              {isVideoOn ? (
                <div className="w-full h-full relative">
                  {usePatientWebcam ? (
                    <video
                      ref={patientVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover bg-slate-950 ${facingMode === 'user' ? 'transform -scale-x-100' : ''}`}
                    />
                  ) : (
                    <img
                      src={currentRole === 'doctor' ? ashaCareImg : doctorTeleImg}
                      alt="Teleconsultation Stream"
                      className="w-full h-full object-cover filter contrast-105 brightness-95"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none"></div>

                  {/* Top Feed Indicators & Camera Switcher */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 z-20">
                    <div className="bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/10 flex items-center space-x-1.5 shadow-sm">
                      <span className={`w-2 h-2 rounded-full ${usePatientWebcam ? 'bg-emerald-400 animate-ping' : 'bg-red-500 animate-ping'}`}></span>
                      <span>
                        {usePatientWebcam
                          ? `● Live Patient Webcam (${pat.name})`
                          : (currentRole === 'doctor' ? `${pat.name} & ASHA ${pat.linkedAshaName}` : 'Dr. Rajesh Kulkarni (MO)')}
                      </span>
                    </div>

                    {usePatientWebcam ? (
                      <span className="bg-emerald-500/20 text-emerald-300 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-400/40 flex items-center space-x-1 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>1080p Live Stream</span>
                      </span>
                    ) : (
                      <span className="bg-emerald-500/20 text-emerald-300 backdrop-blur-md text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                        720p HD &bull; 48ms
                      </span>
                    )}

                    {/* Quick Live Camera Toggle Button */}
                    <button
                      type="button"
                      onClick={togglePatientWebcam}
                      disabled={camLoading}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer shadow-md backdrop-blur-md border flex items-center space-x-1.5 ${
                        usePatientWebcam
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/40'
                          : 'bg-teal-500/25 hover:bg-teal-500/40 text-teal-200 border-teal-300/50 animate-pulse'
                      }`}
                      title={usePatientWebcam ? 'Switch to simulated sub-centre video' : 'Turn on real patient webcam'}
                    >
                      {camLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 text-teal-300 animate-spin" />
                          <span>{loc.camLoading}</span>
                        </>
                      ) : usePatientWebcam ? (
                        <>
                          <RefreshCw className="w-3 h-3 text-amber-300" />
                          <span>{loc.useSimulated}</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5 text-teal-300" />
                          <span>{loc.startPatientCam}</span>
                        </>
                      )}
                    </button>

                    {/* Flip Camera Button (when live webcam is active) */}
                    {usePatientWebcam && (
                      <button
                        type="button"
                        onClick={flipCamera}
                        className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700/80 text-white rounded-full text-[10px] font-medium border border-white/10 flex items-center space-x-1 transition-colors cursor-pointer"
                        title="Flip camera view (front / back)"
                      >
                        <FlipHorizontal className="w-3 h-3" />
                        <span>{loc.flipCam}</span>
                      </button>
                    )}
                  </div>

                  {/* Audio Waveform simulation indicator */}
                  <div className="absolute top-3 right-40 sm:right-48 flex items-center space-x-1 bg-slate-900/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/10 z-10">
                    <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                    <span className="w-1 h-3 bg-teal-400 rounded-full animate-pulse"></span>
                    <span className="w-1 h-4 bg-teal-300 rounded-full animate-pulse delay-75"></span>
                    <span className="w-1 h-2 bg-teal-400 rounded-full animate-pulse delay-150"></span>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 flex flex-col items-center">
                  <VideoOff className="w-12 h-12 mb-2 text-rose-400/80" />
                  <span className="text-xs font-semibold">{loc.videoMuted}</span>
                  <button
                    onClick={() => setIsVideoOn(true)}
                    className="mt-2 text-[11px] text-teal-400 hover:underline font-bold"
                  >
                    Unmute Video
                  </button>
                </div>
              )}

              {/* Camera Error / Permission Alert Overlay */}
              {camError && (
                <div className="absolute top-14 left-3 right-3 sm:right-auto max-w-md bg-rose-950/90 border border-rose-600/80 text-rose-200 px-3 py-2.5 rounded-xl text-xs z-30 flex items-start space-x-2 backdrop-blur-md shadow-xl animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-rose-100">{camError}</p>
                    <div className="mt-1.5 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => startPatientCamera(facingMode)}
                        className="text-[11px] font-bold text-teal-300 hover:text-white underline cursor-pointer"
                      >
                        Retry Camera
                      </button>
                      <span className="text-slate-400 text-[10px]">•</span>
                      <button
                        type="button"
                        onClick={() => setCamError(null)}
                        className="text-[11px] text-slate-300 hover:text-white cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                  <button onClick={() => setCamError(null)} className="text-rose-400 hover:text-white cursor-pointer font-bold text-sm">
                    &times;
                  </button>
                </div>
              )}

              {/* Doctor / Self PiP Video Preview */}
              <div className="absolute top-3 right-3 w-36 sm:w-44 aspect-video bg-slate-900 rounded-xl border border-slate-700/90 shadow-2xl overflow-hidden flex flex-col justify-end group z-20">
                <img
                  src={currentRole === 'doctor' ? doctorTeleImg : ashaCareImg}
                  alt="Self Camera Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
                <div className="relative z-10 p-1.5 flex items-center justify-between text-white text-[10px]">
                  <span className="font-extrabold truncate">
                    {currentRole === 'doctor' ? 'Dr. Rajesh (You)' : `${pat.name} (You)`}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                </div>
              </div>

              {/* Live HUD Vitals Overlay */}
              {vitals && (
                <div className="absolute bottom-3 left-3 right-3 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 grid grid-cols-4 gap-2 text-center text-xs z-10">
                  <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
                    <div className="flex items-center justify-center space-x-1 text-rose-400 text-[11px] font-semibold">
                      <Heart className="w-3 h-3" />
                      <span>{loc.bp}</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {vitals.bpSystolic}/{vitals.bpDiastolic} <span className="text-[10px] text-slate-400">mmHg</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
                    <div className="flex items-center justify-center space-x-1 text-amber-400 text-[11px] font-semibold">
                      <Thermometer className="w-3 h-3" />
                      <span>{loc.temp}</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {vitals.temperature || 98.6}°F
                    </div>
                  </div>

                  <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
                    <div className="flex items-center justify-center space-x-1 text-emerald-400 text-[11px] font-semibold">
                      <Wind className="w-3 h-3" />
                      <span>{loc.spO2}</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {vitals.spO2 || 98}%
                    </div>
                  </div>

                  <div className="bg-slate-900/90 rounded-lg p-1.5 border border-slate-800">
                    <div className="flex items-center justify-center space-x-1 text-teal-400 text-[11px] font-semibold">
                      <Activity className="w-3 h-3" />
                      <span>{loc.pulse}</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {vitals.pulse || 80} <span className="text-[10px] text-slate-400">bpm</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="bg-slate-800/90 rounded-xl p-3 flex flex-wrap items-center justify-center gap-3 border border-slate-700 shadow-sm">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  isMicOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  isVideoOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-rose-600 text-white hover:bg-rose-700'
                }`}
                title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* Patient Live Camera Toggle */}
              <button
                onClick={togglePatientWebcam}
                disabled={camLoading}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 border shadow-sm ${
                  usePatientWebcam
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-950/40 ring-2 ring-emerald-400/40'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600 hover:text-white'
                }`}
                title={usePatientWebcam ? 'Turn off live patient webcam' : 'Turn on live patient webcam'}
              >
                {camLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-teal-300" />
                ) : usePatientWebcam ? (
                  <Camera className="w-4 h-4 text-white" />
                ) : (
                  <CameraOff className="w-4 h-4 text-slate-400" />
                )}
                <span>{usePatientWebcam ? 'Patient Cam: LIVE' : 'Patient Cam: OFF'}</span>
              </button>

              <button
                onClick={handleEndCall}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-full flex items-center space-x-2 transition-colors cursor-pointer shadow-lg shadow-rose-900/30"
              >
                <PhoneOff className="w-4 h-4" />
                <span>{loc.endCall}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Clinical Chat & Scratchpad */}
          <div className="flex flex-col space-y-3 bg-slate-950/60 rounded-xl p-3 border border-slate-800">
            {/* ABHA Verification & Consent Check */}
            <div className="bg-teal-950/60 border border-teal-700/60 rounded-lg p-2.5 flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <div className="font-bold text-white">{loc.abhaConsentActive}</div>
                <div className="text-slate-300 text-[11px]">ID: {pat.abhaId || '91-4829-1029-3321'}</div>
              </div>
            </div>

            {/* Live Chat / Intercom Feed */}
            <div className="flex-1 flex flex-col min-h-[180px] bg-slate-900 rounded-lg border border-slate-800 p-2.5">
              <div className="flex items-center space-x-1.5 pb-2 mb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
                <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                <span>{loc.intercomTitle}</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 text-xs pr-1">
                {chatMessages.map((msg, i) => (
                  <div key={i} className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between text-[10px] text-teal-300 font-semibold mb-0.5">
                      <span>{msg.sender}</span>
                      <span className="text-slate-400">{msg.time}</span>
                    </div>
                    <p className="text-slate-200">{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-2 flex space-x-1.5 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={loc.chatPlaceholder}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Quick Consultation Notes */}
            <div className="bg-slate-900 rounded-lg border border-slate-800 p-2.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300 mb-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>{loc.scratchpadTitle}</span>
              </div>
              <textarea
                value={consultNotes}
                onChange={(e) => setConsultNotes(e.target.value)}
                rows={2}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-hidden focus:border-amber-400 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
