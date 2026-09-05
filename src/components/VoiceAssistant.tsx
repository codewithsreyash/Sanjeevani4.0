import React, { useState, useEffect, useRef } from 'react';
import { useHealth } from '../context/HealthContext';
import { UserRole, Language, Patient, Referral } from '../types';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ArrowRight,
  Stethoscope,
  Phone,
  Calendar,
  AlertCircle,
  FileText,
  Activity,
  HeartPulse,
  RefreshCw,
  Globe,
  Radio,
  CheckCircle2,
  Zap
} from 'lucide-react';
import {
  unlockAudioContext,
  playNotificationChime,
  getBrowserVoices,
  resolveBestVoice,
  cleanTextForSpeech,
  stopAllSpeech
} from '../utils/audioService';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: Language;
  action?: {
    label: string;
    type: 'open_teleconsult' | 'view_patient' | 'view_referrals' | 'call_asha' | 'view_prescriptions';
    payload?: any;
  };
}

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onClose }) => {
  const {
    currentRole,
    currentUser,
    patients,
    referrals,
    followUps,
    appointments,
    encounters,
    setActiveTeleconsultPatient,
    setSelectedPatientId,
    language: appLanguage,
    setLanguage: setAppLanguage,
    setNotification
  } = useHealth();

  const [language, setLanguage] = useState<Language>(appLanguage);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSpeechSentence, setActiveSpeechSentence] = useState<string>('');
  const [activeSpeechText, setActiveSpeechText] = useState<string>('');
  const [activeVoiceName, setActiveVoiceName] = useState<string>('');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.2); // Fast 1.2x brisk tempo by default
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [audioTestFeedback, setAudioTestFeedback] = useState<'testing' | 'success' | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechQueueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef<boolean>(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Synchronize language when app language changes
  useEffect(() => {
    setLanguage(appLanguage);
    if (messages.length <= 1) {
      const greeting = getInitialGreeting(currentRole, currentUser?.name, appLanguage);
      setMessages([
        {
          id: 'msg-welcome',
          sender: 'assistant',
          text: greeting.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: appLanguage,
          action: greeting.action
        }
      ]);
    }
  }, [appLanguage, currentRole, currentUser]);

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    setAppLanguage(newLang);
    stopSpeaking();
    if (messages.length <= 1) {
      const greeting = getInitialGreeting(currentRole, currentUser?.name, newLang);
      setMessages([
        {
          id: 'msg-welcome',
          sender: 'assistant',
          text: greeting.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: newLang,
          action: greeting.action
        }
      ]);
    }
  };

  // Clean up speech synthesis on unmount or close
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const stopSpeaking = () => {
    speechQueueRef.current = [];
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    setActiveSpeechSentence('');
    setActiveSpeechText('');
    stopAllSpeech();
  };

  // Robust Sentence-Chained Speech Synthesizer with AudioContext & Safe Voice Resolution
  const speakResponse = async (
    fullText: string,
    lang: Language,
    options: { withChime?: boolean; speed?: number } = {}
  ) => {
    if (!isTtsEnabled) return;

    // First ensure AudioContext and SpeechSynthesis are unpaused
    unlockAudioContext();

    if (!('speechSynthesis' in window)) {
      if (options.withChime) {
        await playNotificationChime('ready');
      }
      return;
    }

    stopSpeaking();

    // Subtle audio chime to confirm speaker works
    if (options.withChime) {
      await playNotificationChime('ready');
    }

    const sentences = cleanTextForSpeech(fullText, lang);
    if (sentences.length === 0) return;

    speechQueueRef.current = [...sentences];
    isSpeakingRef.current = true;
    setIsSpeaking(true);
    setActiveSpeechText(fullText);

    try {
      const voices = await getBrowserVoices();
      const resolved = resolveBestVoice(voices, lang);
      if (resolved.voice) {
        setActiveVoiceName(resolved.voice.name);
      }

      const activeSpeedMultiplier = options.speed !== undefined ? options.speed : speechSpeed;

      const playNextSentence = () => {
        if (!isSpeakingRef.current || speechQueueRef.current.length === 0) {
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          setActiveSpeechSentence('');
          setActiveSpeechText('');
          return;
        }

        const nextSentence = speechQueueRef.current.shift();
        if (!nextSentence) {
          isSpeakingRef.current = false;
          setIsSpeaking(false);
          setActiveSpeechSentence('');
          setActiveSpeechText('');
          return;
        }

        setActiveSpeechSentence(nextSentence);

        try {
          // Unfreeze speech synthesis queue if paused by browser
          window.speechSynthesis.resume();

          const utterance = new SpeechSynthesisUtterance(nextSentence);
          if (resolved.voice) {
            utterance.voice = resolved.voice;
          }
          utterance.lang = resolved.safeLangCode;

          // Fast, clear, energetic voice rate
          const baseRate = lang === 'en' ? 1.08 : 1.04;
          utterance.rate = Math.min(2.0, Math.max(0.7, Number((baseRate * activeSpeedMultiplier).toFixed(2))));
          utterance.pitch = 1.0;

          // Prevent Chromium garbage-collection bug
          if (window.__sanjeevaniUtterances) {
            window.__sanjeevaniUtterances.add(utterance);
          }

          utterance.onend = () => {
            if (window.__sanjeevaniUtterances) {
              window.__sanjeevaniUtterances.delete(utterance);
            }
            // Rapid chaining between sentences (20ms) for smooth, fast delivery
            setTimeout(() => {
              playNextSentence();
            }, 20);
          };

          utterance.onerror = (e) => {
            console.warn('SpeechSynthesis error:', e);
            if (window.__sanjeevaniUtterances) {
              window.__sanjeevaniUtterances.delete(utterance);
            }
            setTimeout(() => {
              playNextSentence();
            }, 20);
          };

          currentUtteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);

          // Keep-alive timer for Chromium
          if (window.__sanjeevaniKeepAlive) clearInterval(window.__sanjeevaniKeepAlive);
          window.__sanjeevaniKeepAlive = window.setInterval(() => {
            if (window.speechSynthesis && window.speechSynthesis.speaking) {
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            } else if (window.__sanjeevaniKeepAlive) {
              clearInterval(window.__sanjeevaniKeepAlive);
            }
          }, 3500);

        } catch (err) {
          console.error('SpeechSynthesis dispatch failed', err);
          playNextSentence();
        }
      };

      playNextSentence();
    } catch (err) {
      console.warn('Error initiating speech synthesis:', err);
      setIsSpeaking(false);
    }
  };

  // Test Speaker & Voice Audio verification action
  const handleTestAudio = async () => {
    unlockAudioContext();
    setIsTestingAudio(true);
    setAudioTestFeedback('testing');

    // 1. Play warm chime so speaker sound is immediately proven
    await playNotificationChime('ready');

    // 2. Speak verification text
    const testPhrase =
      language === 'hi'
        ? 'संजीवनी एआई की आवाज़ बिल्कुल साफ़ सुनाई दे रही है। आप मुझसे कोई भी प्रश्न पूछ सकते हैं।'
        : language === 'mr'
        ? 'संजीवनी एआयचा आवाज स्पष्ट ऐकू येत आहे. आपण मला कोणताही प्रश्न विचारू शकता.'
        : 'Sanjeevani AI audio is loud and clear. Your speaker and voice assistant are ready.';

    setIsTtsEnabled(true);
    await speakResponse(testPhrase, language);

    setAudioTestFeedback('success');
    setTimeout(() => {
      setIsTestingAudio(false);
      setAudioTestFeedback(null);
    }, 4500);
  };

  // Initialize Welcome Message upon opening
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting = getInitialGreeting(currentRole, currentUser?.name, language);
      const welcomeMsg: Message = {
        id: 'msg-welcome',
        sender: 'assistant',
        text: initialGreeting.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
        action: initialGreeting.action
      };
      setMessages([welcomeMsg]);

      if (isTtsEnabled) {
        setTimeout(() => {
          speakResponse(initialGreeting.text, language);
        }, 300);
      }
    }
  }, [isOpen, currentRole, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isListening, isProcessing]);

  // Speech Recognition (STT) Setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          handleUserQuery(currentTranscript);
          recognition.stop();
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start speech recognition', e);
        setNotification({
          type: 'info',
          message: 'Microphone ready. You can speak or select quick chips below.'
        });
      }
    }
  };

  const handleUserQuery = async (query: string, options: { instant?: boolean } = {}) => {
    if (!query.trim()) return;

    unlockAudioContext();
    stopSpeaking();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setTranscript('');

    const activePatient = patients.find((p) => p.id === currentUser?.linkedPatientId) || patients[0];

    let replyText = '';
    let replyAction: Message['action'] | undefined = undefined;

    // Fast-path: When clicking question chips, respond instantly (0ms) without waiting on remote API
    if (options.instant) {
      const localResponse = generateContextualResponse(query, currentRole, currentUser, {
        patients,
        referrals,
        followUps,
        appointments,
        encounters,
        language
      });
      replyText = localResponse.text;
      replyAction = localResponse.action;
    } else {
      setIsProcessing(true);
      // Fast race with Gemini AI endpoint (max 1200ms) to ensure conversational promptness
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);

        const apiRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            query,
            language,
            role: currentRole,
            currentUser,
            patientContext: {
              name: activePatient?.name,
              age: activePatient?.age,
              gender: activePatient?.gender,
              conditions: activePatient?.chronicConditions,
              vitals: activePatient?.lastVitals,
              prescriptions: activePatient?.activePrescriptions,
              riskCategory: activePatient?.riskCategory
            }
          })
        });
        clearTimeout(timeoutId);

        if (apiRes.ok) {
          const data = await apiRes.json();
          if (data.text && !data.fallback) {
            replyText = data.text;
            replyAction = inferActionFromText(query, currentRole, activePatient, language);
          }
        }
      } catch (e) {
        // Fast fallback to instant local clinical response
      }

      if (!replyText) {
        const localResponse = generateContextualResponse(query, currentRole, currentUser, {
          patients,
          referrals,
          followUps,
          appointments,
          encounters,
          language
        });
        replyText = localResponse.text;
        replyAction = localResponse.action;
      }
      setIsProcessing(false);
    }

    const assistantMsg: Message = {
      id: `assist-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
      action: replyAction
    };

    setMessages((prev) => [...prev, assistantMsg]);

    if (isTtsEnabled) {
      speakResponse(replyText, language);
    }
  };

  const inferActionFromText = (
    query: string,
    role: UserRole,
    patient: Patient,
    lang: Language
  ): Message['action'] | undefined => {
    const q = query.toLowerCase();
    if (q.includes('medicine') || q.includes('दवा') || q.includes('औषध') || q.includes('prescription')) {
      return {
        label: lang === 'hi' ? 'दवाइयाँ देखें' : lang === 'mr' ? 'औषध तपशील' : 'View Prescription Details',
        type: 'view_prescriptions'
      };
    }
    if (q.includes('doctor') || q.includes('teleconsult') || q.includes('डॉक्टर') || q.includes('ऑनलाइन')) {
      return {
        label: lang === 'hi' ? 'टेलीकंसल्टेशन शुरू करें' : lang === 'mr' ? 'टेलिकन्सल्टेशन सुरू करा' : 'Join Teleconsultation',
        type: 'open_teleconsult',
        payload: { patientId: patient?.id || 'pat-101' }
      };
    }
    if (q.includes('asha') || q.includes('आशा') || q.includes('tai') || q.includes('call') || q.includes('फोन')) {
      return {
        label: lang === 'hi' ? 'आशा कार्यकर्ता को कॉल करें' : lang === 'mr' ? 'आशा सेविकेशी संपर्क' : 'Call ASHA Worker',
        type: 'call_asha'
      };
    }
    if (q.includes('history') || q.includes('chart') || q.includes('तपशील') || q.includes('रिकॉर्ड')) {
      return {
        label: lang === 'hi' ? 'स्वास्थ्य रिकॉर्ड देखें' : lang === 'mr' ? 'आरोग्य नोंद पहा' : 'View Patient Chart',
        type: 'view_patient',
        payload: { patientId: patient?.id || 'pat-101' }
      };
    }
    return undefined;
  };

  const handleExecuteAction = (action: Message['action']) => {
    if (!action) return;

    if (action.type === 'open_teleconsult') {
      const pat = patients.find((p) => p.id === action.payload?.patientId) || patients[0];
      setActiveTeleconsultPatient(pat);
      setNotification({
        type: 'success',
        message: `Teleconsultation room initiated with ${pat.name}.`
      });
      onClose();
    } else if (action.type === 'view_patient') {
      if (action.payload?.patientId) {
        setSelectedPatientId(action.payload.patientId);
        setNotification({
          type: 'info',
          message: `Opened clinical chart for patient ${action.payload.patientId}.`
        });
      }
      onClose();
    } else if (action.type === 'call_asha') {
      setNotification({
        type: 'info',
        message: `Calling assigned ASHA worker Sunita Bai (+91 94231 88990)...`
      });
    } else if (action.type === 'view_prescriptions') {
      onClose();
    }
  };

  const roleSuggestions = getQuickPrompts(currentRole, language);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col h-[86vh] max-h-[700px] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/30 border border-teal-300/40 flex items-center justify-center text-teal-200 shadow-inner">
              <Sparkles className="w-5 h-5 text-teal-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base tracking-tight flex items-center space-x-1.5">
                  <span>Sanjeevani AI</span>
                  <span className="text-teal-300 font-normal text-xs">(संजीवनी)</span>
                </h3>
                <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Voice Assistant
                </span>
              </div>
              <p className="text-xs text-teal-200/90 font-medium">
                {currentRole === 'patient' && 'Personal Citizen Health & Medicine Companion'}
                {currentRole === 'doctor' && 'Clinical Decision & Hospital OPD Copilot'}
                {currentRole === 'asha' && 'Village Screening & High-Risk Maternal Companion'}
                {currentRole === 'anm' && 'Sub-centre Health & Care Coordinator'}
                {currentRole === 'admin' && 'District Healthcare Command Analytics Copilot'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Language Switcher in Voice Modal */}
            <div className="flex items-center bg-teal-900/60 rounded-lg p-0.5 border border-teal-600/50">
              {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    language === lang
                      ? 'bg-white text-teal-900 shadow-xs'
                      : 'text-teal-200 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}
                </button>
              ))}
            </div>

            {/* Speed Toggle Button (1x Normal, 1.2x Fast, 1.35x Turbo) */}
            <button
              onClick={() => {
                const speeds = [1.0, 1.2, 1.35];
                const curIdx = speeds.indexOf(speechSpeed);
                const nextSpeed = speeds[(curIdx + 1) % speeds.length] || 1.2;
                setSpeechSpeed(nextSpeed);
                if (isSpeaking && activeSpeechText) {
                  stopSpeaking();
                  speakResponse(activeSpeechText, language, { speed: nextSpeed });
                }
              }}
              className="flex items-center space-x-1 px-2 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer bg-teal-500/30 hover:bg-teal-500/50 text-teal-100 border-teal-300/40 hover:text-white"
              title={`Voice Speed: ${speechSpeed}x (Click to toggle Fast/Normal/Turbo)`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>{speechSpeed}x</span>
            </button>

            {/* Test Audio Output Button */}
            <button
              onClick={handleTestAudio}
              disabled={isTestingAudio}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                isTestingAudio
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold animate-pulse'
                  : 'bg-teal-500/30 hover:bg-teal-500/50 text-teal-100 border-teal-300/40 hover:text-white'
              }`}
              title="Test speaker sound output and AI voice"
            >
              <Volume2 className="w-3.5 h-3.5 text-teal-200" />
              <span className="hidden sm:inline">
                {isTestingAudio
                  ? (language === 'hi' ? 'परीक्षण जारी...' : language === 'mr' ? 'चाचणी सुरू...' : 'Testing...')
                  : (language === 'hi' ? 'स्पीकर टेस्ट' : language === 'mr' ? 'स्पीकर चाचणी' : 'Test Audio')}
              </span>
              <span className="sm:hidden">Test</span>
            </button>

            {/* Mute/Unmute Audio Button */}
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                }
                unlockAudioContext();
                setIsTtsEnabled(!isTtsEnabled);
              }}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isTtsEnabled
                  ? 'bg-teal-500/20 text-teal-200 border-teal-400/40 hover:bg-teal-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title={isTtsEnabled ? 'Mute Spoken Audio' : 'Enable Spoken Audio'}
            >
              {isTtsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-teal-900/40 hover:bg-teal-900 text-teal-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audio Verification / Feedback Banner */}
        {audioTestFeedback === 'success' && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 flex items-center justify-between text-emerald-950 text-xs shrink-0 animate-in fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">
                {language === 'hi'
                  ? 'ऑडियो और स्पीकर बिल्कुल तैयार है!'
                  : language === 'mr'
                  ? 'ऑडिओ आणि स्पीकर सज्ज आहे!'
                  : 'Speaker audio and speech synthesis verified!'}
              </span>
              {activeVoiceName && (
                <span className="hidden sm:inline text-[10px] text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded font-mono">
                  {activeVoiceName}
                </span>
              )}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Ready</span>
          </div>
        )}

        {/* Notice when user has muted audio */}
        {!isTtsEnabled && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center justify-between text-amber-900 text-xs shrink-0">
            <div className="flex items-center space-x-2">
              <VolumeX className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {language === 'hi'
                  ? 'ऑडियो म्यूट है। आवाज़ सुनने के लिए अनम्यूट करें या स्पीकर टेस्ट दबाएं।'
                  : language === 'mr'
                  ? 'ऑडिओ म्यूट आहे. आवाज ऐकण्यासाठी अनम्यूट करा किंवा स्पीकर चाचणी दाबा.'
                  : 'Spoken audio is muted. Click unmute or Test Audio to hear voice.'}
              </span>
            </div>
            <button
              onClick={() => {
                unlockAudioContext();
                setIsTtsEnabled(true);
              }}
              className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 hover:bg-amber-300 text-amber-950 rounded cursor-pointer"
            >
              Unmute
            </button>
          </div>
        )}

        {/* Real-time Voice Live Speaking Strip */}
        {isSpeaking && (
          <div className="bg-teal-50 border-b border-teal-200 px-4 py-2 flex items-center justify-between text-teal-900 text-xs shrink-0 animate-in fade-in">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
              </span>
              <span className="font-bold text-teal-800 shrink-0">Sanjeevani Speaking:</span>
              <span className="italic truncate text-slate-700 text-[11px]">
                "{activeSpeechSentence || 'Speaking full message...'}"
              </span>
            </div>
            <button
              onClick={stopSpeaking}
              className="px-2 py-0.5 text-[10px] font-bold bg-teal-200 hover:bg-teal-300 text-teal-900 rounded cursor-pointer shrink-0 ml-2"
            >
              Stop Audio
            </button>
          </div>
        )}

        {/* Assistant Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${
                  isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-2xs ${
                    isUser
                      ? 'bg-slate-800 text-white'
                      : 'bg-teal-600 text-white shadow-teal-600/20'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Action Button if attached */}
                    {msg.action && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => handleExecuteAction(msg.action)}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                        >
                          {msg.action.type === 'open_teleconsult' && (
                            <Stethoscope className="w-3.5 h-3.5" />
                          )}
                          {msg.action.type === 'call_asha' && <Phone className="w-3.5 h-3.5" />}
                          {msg.action.type === 'view_patient' && <Activity className="w-3.5 h-3.5" />}
                          {msg.action.type === 'view_prescriptions' && (
                            <FileText className="w-3.5 h-3.5" />
                          )}
                          <span>{msg.action.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className={`text-[10px] text-slate-400 font-mono px-1 flex items-center justify-between`}
                  >
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => {
                          if (isSpeaking && activeSpeechText === msg.text) {
                            stopSpeaking();
                          } else {
                            unlockAudioContext();
                            speakResponse(msg.text, msg.language, { withChime: true });
                          }
                        }}
                        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all shadow-2xs border ${
                          isSpeaking && activeSpeechText === msg.text
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                        }`}
                        title="Listen to this message"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isSpeaking && activeSpeechText === msg.text ? 'text-rose-600 animate-pulse' : 'text-teal-700'}`} />
                        <span>
                          {isSpeaking && activeSpeechText === msg.text
                            ? (language === 'hi' ? 'आवाज़ रोकें' : language === 'mr' ? 'थांबवा' : 'Stop Audio')
                            : (language === 'hi' ? '🔊 आवाज़ सुनें' : language === 'mr' ? '🔊 आवाज ऐका' : '🔊 Listen')}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Processing / Speaking Animation Indicator */}
          {(isProcessing || isListening) && (
            <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl p-3 shadow-2xs w-fit">
              {isListening && (
                <div className="flex items-center space-x-2 text-rose-600 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span>
                    Listening in {language === 'hi' ? 'हिन्दी' : language === 'mr' ? 'मराठी' : 'English'}...{' '}
                    {transcript ? `"${transcript}"` : 'Speak into microphone'}
                  </span>
                </div>
              )}
              {isProcessing && (
                <div className="flex items-center space-x-2 text-slate-600">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                  <span>Sanjeevani AI is formulating clinical response...</span>
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200/80 shrink-0">
          <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>
                {language === 'hi'
                  ? 'त्वरित प्रश्न चुनें:'
                  : language === 'mr'
                  ? 'जलद विचारणा निवडा:'
                  : `Voice questions for ${currentUser?.name}:`}
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Click to ask instantly</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {roleSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  unlockAudioContext();
                  handleUserQuery(prompt, { instant: true });
                }}
                className="px-2.5 py-1 bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200 text-slate-700 hover:text-teal-900 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer shadow-2xs shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar & Mic Button */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          {/* Audio Wave Visualizer while listening */}
          {isListening && (
            <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-700 animate-pulse">
              <div className="flex items-center space-x-2">
                <Mic className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold">Microphone Active &bull; Speak clearly</span>
              </div>
              <div className="flex items-center space-x-1">
                {[40, 75, 100, 60, 90, 45, 80, 50].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1 bg-rose-500 rounded-full h-4 animate-bounce"
                  ></span>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserQuery(inputText);
            }}
            className="flex items-center space-x-2"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                isListening
                  ? 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak into Sanjeevani AI'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'यहाँ बोलें या टाइप करें (उदा. मेरा रक्तचाप कितना है?)...'
                    : language === 'mr'
                    ? 'येथे बोला किंवा टाइप करा (उदा. माझी औषधे कशी घ्यावीत?)...'
                    : 'Ask Sanjeevani about vitals, medicines, appointments, referrals...'
                }
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden font-medium"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-teal-600 hover:text-teal-800 disabled:text-slate-300 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Initial Greeting with Natural Speech Phrasing
function getInitialGreeting(
  role: UserRole,
  userName?: string,
  lang: Language = 'en'
): { text: string; action?: Message['action'] } {
  const name = userName || 'User';

  if (lang === 'hi') {
    if (role === 'patient') {
      return {
        text: `नमस्ते ${name}! मैं आपकी संजीवनी स्वास्थ्य सहायक हूँ। आप मुझसे अपने रक्तचाप, दवाइयों के समय, आशा कार्यकर्ता या डॉक्टर अपॉइंटमेंट के बारे में पूछ सकते हैं।`,
        action: { label: 'दवाइयाँ देखें', type: 'view_prescriptions' }
      };
    } else if (role === 'doctor') {
      return {
        text: `नमस्कार डॉक्टर ${name}। मैं आपकी संजीवनी क्लिनिकल सहायक हूँ। आप प्रलंबित रेफरल सूची, मरीज केस सारांश या टेलीकंसल्टेशन के बारे में पूछ सकते हैं।`,
        action: {
          label: 'टेलीकंसल्ट रूम खोलें',
          type: 'open_teleconsult',
          payload: { patientId: 'pat-101' }
        }
      };
    } else if (role === 'admin') {
      return {
        text: `नमस्ते अधिकारी महोदय। संजीवनी जिला स्वास्थ्य कमांड कोपायलट तैयार है। आप रेफरल क्लोजर दर, मरीज प्रतीक्षा समय या अस्पताल क्षमता के आंकड़े पूछ सकते हैं।`
      };
    } else {
      return {
        text: `नमस्ते ${name}! मैं आपकी संजीवनी आशा साथी हूँ। आप आज की गृह भेंट, उच्च जोखिम गर्भवती महिलाओं और रक्तचाप जांच के बारे में पूछ सकते हैं।`
      };
    }
  }

  if (lang === 'mr') {
    if (role === 'patient') {
      return {
        text: `नमस्कार ${name}! मी आपली संजीवनी आरोग्य सहाय्यक आहे. आपण मला रक्तदाब तपासणी, औषधांचे वेळापत्रक, आशा सेविका किंवा डॉक्टरांच्या भेटीबद्दल विचारू शकता.`,
        action: { label: 'औषधांचे तपशील', type: 'view_prescriptions' }
      };
    } else if (role === 'doctor') {
      return {
        text: `नमस्कार डॉक्टर ${name}. मी आपली संजीवनी ओपीडी सहाय्यक आहे. प्रलंबित रेफरल्स, रुग्ण सारांश किंवा टेलिकन्सल्टेशन सुरू करण्याबद्दल विचारू शकता.`,
        action: {
          label: 'टेलिकन्सल्ट सुरू करा',
          type: 'open_teleconsult',
          payload: { patientId: 'pat-101' }
        }
      };
    } else {
      return {
        text: `नमस्कार ${name}! मी आपली संजीवनी आरोग्य सहाय्यक आहे. आपण आजच्या गृहभेटी, औषध वाटप आणि उच्च जोखीम रुग्णांविषयी विचारू शकता.`
      };
    }
  }

  // English
  if (role === 'patient') {
    return {
      text: `Hello ${name}! I am Sanjeevani, your personal healthcare companion. You can ask me about your blood pressure readings, doctor prescriptions, appointment timings, or connect with your village ASHA worker.`,
      action: { label: 'View My Prescriptions', type: 'view_prescriptions' }
    };
  } else if (role === 'doctor') {
    return {
      text: `Welcome Doctor ${name}. Sanjeevani Clinical Voice Assistant is active. You can request patient summaries, inspect pending inbound referrals, check follow-up loops, or launch teleconsultations.`,
      action: {
        label: 'Start Teleconsult Room',
        type: 'open_teleconsult',
        payload: { patientId: 'pat-101' }
      }
    };
  } else if (role === 'admin') {
    return {
      text: `Greetings Officer. Sanjeevani District Health Command Voice Copilot is ready. Inquire about referral loop closure rates, average patient transit times, or critical facility loads.`
    };
  } else {
    return {
      text: `Hello ${name}! Sanjeevani Field Companion is active. Ask about today's home follow-up visits, antenatal high-risk alerts, or blood pressure triage guidelines.`
    };
  }
}

function getQuickPrompts(role: UserRole, lang: Language): string[] {
  if (lang === 'hi') {
    if (role === 'patient') {
      return [
        'मेरा रक्तचाप कितना है?',
        'मेरी दवाइयाँ और खुराक बताएं',
        'सिरदर्द या चक्कर आने पर क्या करें?',
        'गर्भावस्था में क्या सावधानियां रखें?',
        'मेरी डॉक्टर से अपॉइंटमेंट कब है?',
        'आशा कार्यकर्ता को कॉल करें',
        'बुखार और बदन दर्द का उपाय बताएं'
      ];
    } else if (role === 'doctor') {
      return [
        'पेंडिंग रेफरल की संख्या बताओ',
        'सविता देवी का केस सारांश',
        'टेलीकंसल्टेशन शुरू करो',
        'फॉलो-अप अनुपालन दर क्या है?',
        'हाई-रिस्क मेटर्नल केस दिखाएं'
      ];
    } else if (role === 'admin') {
      return [
        'जिले का रेफरल क्लोजर रेट क्या है?',
        'किस अस्पताल में सबसे ज्यादा वेटिंग है?',
        'आज के हाई-रिस्क इमरजेंसी केस'
      ];
    } else {
      return [
        'आज किस मरीज के घर जाना है?',
        'हाई बीपी का रेफरल कैसे करें?',
        'सविता देवी का फॉलो-अप चेक',
        'गर्भवती महिलाओं की सूची दिखाएं'
      ];
    }
  }

  if (lang === 'mr') {
    if (role === 'patient') {
      return [
        'माझा रक्तदाब किती नोंदवला आहे?',
        'माझी औषधे कशी घ्यावीत?',
        'डोकेदुखी किंवा चक्कर आल्यास काय करावे?',
        'गरोदरपणात काय काळजी घ्यावी?',
        'डॉक्टरांशी ऑनलाइन संपर्क करा',
        'आशा सेविकेशी संपर्क करा',
        'ताप आणि थंडी वाजल्यास काय करावे?'
      ];
    } else if (role === 'doctor') {
      return [
        'प्रलंबित रेफरल्स दाखवा',
        'सविता देवीची केस माहिती',
        'टेलिकन्सल्टेशन सुरू करा',
        'उच्च जोखीम गर्भवती रुग्ण',
        'फॉलो-अप पूर्णत्व दर किती आहे?'
      ];
    } else if (role === 'admin') {
      return [
        'जिल्ह्याचा रेफरल क्लोजर दर काय आहे?',
        'कोणत्या आरोग्य केंद्रात जास्त गर्दी आहे?',
        'आजचे आपत्कालीन रुग्ण'
      ];
    } else {
      return [
        'आजच्या गृहभेटींची यादी',
        'रक्तदाब जास्त असल्यास काय करावे?',
        'आशा फॉलो-अप स्थिती',
        'उच्च जोखीम मातांची यादी'
      ];
    }
  }

  // English
  if (role === 'patient') {
    return [
      'What is my latest blood pressure?',
      'Explain my prescribed medicines',
      'What to do for headache or dizziness?',
      'Pregnancy & gestational care tips',
      'When is my doctor appointment?',
      'Call my linked ASHA worker',
      'What to do in high fever?'
    ];
  } else if (role === 'doctor') {
    return [
      'Show pending inbound referrals',
      'Summarize patient Savita Devi',
      'Launch teleconsult with Savita',
      'What is the follow-up compliance rate?',
      'List high-risk antenatal cases'
    ];
  } else if (role === 'admin') {
    return [
      'What is the district referral loop closure rate?',
      'Which facility has the highest backlog?',
      'Show critical emergency triage volume'
    ];
  } else {
    return [
      'Who needs a home visit today?',
      'Protocol for BP triage over 140/90',
      'Show overdue maternal follow-ups',
      'List active village referrals'
    ];
  }
}

function generateContextualResponse(
  query: string,
  role: UserRole,
  user: any,
  context: {
    patients: Patient[];
    referrals: Referral[];
    followUps: any[];
    appointments: any[];
    encounters: any[];
    language: Language;
  }
): { text: string; action?: Message['action'] } {
  const q = query.toLowerCase();
  const { patients, referrals, followUps, appointments, encounters, language } = context;

  // Greetings handling (Any Role)
  if (
    q.includes('hello') ||
    q.includes('hi') ||
    q.includes('hey') ||
    q.includes('namaste') ||
    q.includes('namaskar') ||
    q.includes('नमस्ते') ||
    q.includes('नमस्कार') ||
    q.includes('प्रणाम') ||
    q.includes('सुप्रभात')
  ) {
    if (language === 'hi') {
      return {
        text: `नमस्ते! मैं संजीवनी स्वास्थ्य सहायिका हूँ। आप मुझसे अपने रक्तचाप, दवाइयों के समय, सिरदर्द या चक्कर के लक्षण, डॉक्टर से भेंट, अथवा गाँव की आशा कार्यकर्ता से संपर्क के बारे में पूछ सकते हैं।`
      };
    } else if (language === 'mr') {
      return {
        text: `नमस्कार! मी आपली संजीवनी आरोग्य सहाय्यक आहे. आपण रक्तदाब, औषधांचे डोस, डोकेदुखी किंवा चक्कर, डॉक्टरांची वेळ किंवा आशा सेविकेशी संपर्क याविषयी विचारू शकता.`
      };
    }
    return {
      text: `Hello! I am Sanjeevani, your digital health copilot. Feel free to ask about your blood pressure readings, medicine timings, doctor appointments, danger signs, or village health worker assistance.`
    };
  }

  // 1. PATIENT QUERIES & UNIVERSAL CLINICAL TOPICS
  const patient = patients.find((p) => p.id === user?.linkedPatientId) || patients[0];
  const patientReferral = referrals.find((r) => r.patientId === patient.id);
  const patientFollowUp = followUps.find((f) => f.patientId === patient.id);
  const patientAppt = appointments.find((a) => a.patientId === patient.id);

  // A. Blood Pressure & Vitals
  if (
    q.includes('bp') ||
    q.includes('blood pressure') ||
    q.includes('रक्तचाप') ||
    q.includes('रक्तदाब') ||
    q.includes('vitals') ||
    q.includes('बीपी')
  ) {
    const bpSys = patient?.lastVitals?.bpSystolic || 150;
    const bpDia = patient?.lastVitals?.bpDiastolic || 95;

    if (language === 'hi') {
      return {
        text: `आपका नवीनतम दर्ज रक्तचाप ${bpSys} बटा ${bpDia} mmHg है, जो सामान्य सीमा (120/80) से अधिक है। कृपया डॉक्टर द्वारा सुझाई गई एमलोडिपिन दवा नियमित रूप से लें, भोजन में नमक कम रखें, भरपूर पानी पिएं और यदि सिरदर्द या चक्कर आए तो तुरंत आशा कार्यकर्ता को सूचित करें।`,
        action: { label: 'प्रिस्क्रिप्शन देखें', type: 'view_prescriptions' }
      };
    } else if (language === 'mr') {
      return {
        text: `आपला नवीनतम रक्तदाब ${bpSys}/${bpDia} mmHg नोंदवला गेला आहे, जो सामान्य पातळीपेक्षा जास्त आहे. कृपया डॉ. कुलकर्णी यांनी दिलेली एमलोडिपिन औषधे वेळेवर घ्या, आहारात मीठ कमी वापरा आणि विश्रांती घ्या.`,
        action: { label: 'औषध तपशील पहा', type: 'view_prescriptions' }
      };
    }
    return {
      text: `Your latest recorded blood pressure is ${bpSys}/${bpDia} mmHg, which is classified as Stage-1 Hypertension. Please take your prescribed Amlodipine regularly, maintain a low-salt diet, stay hydrated, and alert your ASHA worker if you experience headaches or dizziness.`,
      action: { label: 'View Prescription Details', type: 'view_prescriptions' }
    };
  }

  // B. Headache, Dizziness, Blurred Vision (Preeclampsia / High BP Danger Signs)
  if (
    q.includes('headache') ||
    q.includes('dizzy') ||
    q.includes('dizziness') ||
    q.includes('blur') ||
    q.includes('vision') ||
    q.includes('सिरदर्द') ||
    q.includes('चक्कर') ||
    q.includes('धुंधला') ||
    q.includes('डोकेदुखी') ||
    q.includes('भोवळ') ||
    q.includes('अंधारी')
  ) {
    if (language === 'hi') {
      return {
        text: `सावधानी: गर्भावस्था या उच्च रक्तचाप में लगातार सिरदर्द, चक्कर आना या आँखों के आगे धुंधलापन प्री-एक्लेम्पसिया का चेतावनी संकेत हो सकता है। तुरंत शांत कमरे में लेट जाएं, बाईं करवट सोएं, पानी पिएं और बिना देर किए अपनी आशा कार्यकर्ता या डॉक्टर से संपर्क करें।`,
        action: {
          label: 'आशा कार्यकर्ता को कॉल करें',
          type: 'call_asha'
        }
      };
    } else if (language === 'mr') {
      return {
        text: `धोक्याचा इशारा: गरोदरपणात किंवा उच्च रक्तदाबात तीव्र डोकेदुखी, चक्कर किंवा डोळ्यांसमोर अंधारी येणे हे उच्च रक्तदाबाचे गंभीर लक्षण असू शकते. कृपया लगेच डाव्या कुशीवर झोपून विश्रांती घ्या आणि तातडीने आशा सेविकेशी किंवा डॉक्टरांशी संपर्क साधा.`,
        action: {
          label: 'आशा सेविकेशी संपर्क साधा',
          type: 'call_asha'
        }
      };
    }
    return {
      text: `Clinical Alert: Persistent severe headache, dizziness, or blurred vision can be critical warning signs of preeclampsia or severe hypertension. Lie down immediately on your left side in a quiet room, hydrate, and contact your assigned health worker or physician right away.`,
      action: {
        label: 'Call ASHA Worker',
        type: 'call_asha'
      }
    };
  }

  // C. Medicines, Prescriptions & Dosages
  if (
    q.includes('medicine') ||
    q.includes('medication') ||
    q.includes('दवा') ||
    q.includes('औषध') ||
    q.includes('prescription') ||
    q.includes('पर्ची') ||
    q.includes('खुराक') ||
    q.includes('dosage')
  ) {
    if (language === 'hi') {
      return {
        text: `आपकी सक्रिय दवाइयाँ: 
1. एमलोडिपिन (Amlodipine) 5mg - रोज़ सुबह नाश्ते के बाद 1 गोली (रक्तचाप नियंत्रण के लिए)।
2. आयरन और फोलिक एसिड (IFA) - रोज़ दोपहर भोजन के बाद 1 गोली (रक्त बढ़ाने के लिए)।
3. कैल्शियम 500mg - रोज़ रात को भोजन के बाद 1 गोली (हड्डियों व शिशु विकास के लिए)।
नोट: आयरन और कैल्शियम की गोली एक साथ कभी न लें।`,
        action: { label: 'डिजिटल पर्ची देखें', type: 'view_prescriptions' }
      };
    } else if (language === 'mr') {
      return {
        text: `आपली चालू औषधे:
1. एमलोडिपिन (Amlodipine) 5mg - दररोज सकाळी नाश्त्यानंतर 1 गोळी (रक्तदाब नियंत्रणासाठी).
2. आयर्न आणि फॉलिक ॲसिड - दुपारी जेवणानंतर 1 गोळी (रक्तातील हिमोग्लोबिन वाढवण्यासाठी).
3. कॅल्शियम 500mg - रात्री जेवणानंतर 1 गोळी.
टीप: आयर्न आणि कॅल्शियमच्या गोळ्या कधीही एकत्र घेऊ नका.`,
        action: { label: 'ई-प्रिस्क्रिप्शन पहा', type: 'view_prescriptions' }
      };
    }
    return {
      text: `Your active prescribed medication schedule:
1. Tablet Amlodipine 5mg: Take 1 tablet once daily in the morning after breakfast for BP control.
2. Tablet Iron & Folic Acid: Take 1 tablet daily after lunch for maternal hemoglobin.
3. Tablet Calcium 500mg: Take 1 tablet at night after dinner.
Important: Always take Iron and Calcium at separate times (at least 2 hours apart).`,
      action: { label: 'View E-Prescription Card', type: 'view_prescriptions' }
    };
  }

  // D. Appointments & Teleconsultations
  if (
    q.includes('appointment') ||
    q.includes('doctor') ||
    q.includes('भेंट') ||
    q.includes('डॉक्टर') ||
    q.includes('अपॉइंटमेंट') ||
    q.includes('तपासणी') ||
    q.includes('teleconsult')
  ) {
    const time = patientAppt?.time || '02:30 PM';
    const doc = patientAppt?.providerName || 'Dr. Rajesh Kulkarni';
    if (language === 'hi') {
      return {
        text: `आपकी डॉ. राजेश कुलकर्णी के साथ आज दोपहर 2:30 बजे प्राथमिक स्वास्थ्य केंद्र डिजिटल लाइन द्वारा वीडियो टेलीकंसल्टेशन समीक्षा तय है। क्या आप अभी टेलीकंसल्ट रूम में जुड़ना चाहते हैं?`,
        action: {
          label: 'टेलीकंसल्ट रूम से जुड़ें',
          type: 'open_teleconsult',
          payload: { patientId: patient?.id || 'pat-101' }
        }
      };
    } else if (language === 'mr') {
      return {
        text: `आपली डॉ. राजेश कुलकर्णी यांच्यासोबत आज दुपारी २:३० वाजता प्राथमिक आरोग्य केंद्र टेलिकन्सल्टेशन ओपीडी द्वारे तपासणी नियोजित आहे. आपण आता खोलीत सामील होऊ शकता.`,
        action: {
          label: 'टेलिकन्सल्ट मध्ये सामील व्हा',
          type: 'open_teleconsult',
          payload: { patientId: patient?.id || 'pat-101' }
        }
      };
    }
    return {
      text: `You have a scheduled teleconsultation review with ${doc} today at ${time} via Chandur Primary Health Centre digital clinic.`,
      action: {
        label: 'Join Teleconsultation',
        type: 'open_teleconsult',
        payload: { patientId: patient?.id || 'pat-101' }
      }
    };
  }

  // E. Fever, Chills, Infection & Body Ache
  if (
    q.includes('fever') ||
    q.includes('temperature') ||
    q.includes('chill') ||
    q.includes('cold') ||
    q.includes('बुखार') ||
    q.includes('ताप') ||
    q.includes('कपकपी') ||
    q.includes('बदन दर्द') ||
    q.includes('अंगदुखी') ||
    q.includes('थंडी')
  ) {
    if (language === 'hi') {
      return {
        text: `बुखार प्रबंधन: यदि तापमान 100°F से अधिक है, तो माथे पर सामान्य पानी की गीली पट्टी रखें। भरपूर पानी, ओआरएस या नारियल पानी पिएं। डॉक्टर की सलाह के अनुसार पैरासिटामोल 500mg ले सकते हैं। यदि बुखार 48 घंटे से अधिक रहे या कंपकंपी हो, तो तुरंत मलेरिया/डेंगू जांच के लिए प्राथमिक स्वास्थ्य केंद्र जाएं।`,
        action: {
          label: 'डॉक्टर से परामर्श लें',
          type: 'open_teleconsult',
          payload: { patientId: patient?.id || 'pat-101' }
        }
      };
    } else if (language === 'mr') {
      return {
        text: `ताप काळजी: शरीराचे तापमान जास्त असल्यास कपाळावर साध्या पाण्याच्या घड्या ठेवा. भरपूर कोमट पाणी किंवा ओआरएस प्या. डॉक्टरांच्या सल्ल्याने पॅरासिटामॉल 500mg गोळी घेऊ शकता. ताप 2 दिवसांपेक्षा जास्त राहिल्यास लगेच प्राथमिक आरोग्य केंद्रात रक्त तपासणी करा.`,
        action: {
          label: 'डॉक्टरांशी संपर्क करा',
          type: 'open_teleconsult',
          payload: { patientId: patient?.id || 'pat-101' }
        }
      };
    }
    return {
      text: `Fever Management: If body temperature exceeds 100°F, apply lukewarm water sponging to the forehead and maintain adequate oral hydration (ORS, coconut water). Paracetamol 500mg can be taken as advised by a doctor. If fever persists over 48 hours or is accompanied by chills, visit the PHC for diagnostic testing.`,
      action: {
        label: 'Connect with Doctor',
        type: 'open_teleconsult',
        payload: { patientId: patient?.id || 'pat-101' }
      }
    };
  }

  // F. Blood Sugar & Diabetes
  if (
    q.includes('sugar') ||
    q.includes('diabetes') ||
    q.includes('glucose') ||
    q.includes('शुगर') ||
    q.includes('डायबिटीज') ||
    q.includes('मधुमेह') ||
    q.includes('साखर')
  ) {
    if (language === 'hi') {
      return {
        text: `रक्त शर्करा (डायबिटीज) मार्गदर्शन: सामान्य खाली पेट (Fasting) शुगर 70-100 mg/dL और भोजन के 2 घंटे बाद (PP) 140 mg/dL से कम होनी चाहिए। मीठा, मैदा और तला-भुना कम करें, हरी सब्जियां और दालें खाएं तथा रोज़ 30 मिनट टहलें। अपनी नियमित जांच उपकेंद्र पर कराएं।`,
        action: { label: 'मरीज रिकॉर्ड देखें', type: 'view_patient', payload: { patientId: patient?.id || 'pat-101' } }
      };
    } else if (language === 'mr') {
      return {
        text: `रक्त शर्करा (मधुमेह) मार्गदर्शन: उपाशीपोटी साखर 70 ते 100 mg/dL आणि जेवणानंतर 140 mg/dL च्या आत असणे आदर्श मानले जाते. गोड पदार्थ व तळलेले अन्न टाळा, आहारात हिरव्या पालेभाज्यांचा समावेश करा आणि नियमित व्यायाम करा. उपकेंद्रात जाऊन साखर तपासा.`,
        action: { label: 'आरोग्य नोंद पहा', type: 'view_patient', payload: { patientId: patient?.id || 'pat-101' } }
      };
    }
    return {
      text: `Blood Sugar Management: Target fasting blood glucose is 70-100 mg/dL, and post-prandial (2 hours post-meal) should remain under 140 mg/dL. Limit simple carbohydrates and processed sugar, include fiber-rich vegetables, and engage in daily 30-minute moderate walking. Regular screening at your local Sub-centre is recommended.`,
      action: { label: 'View Health Record', type: 'view_patient', payload: { patientId: patient?.id || 'pat-101' } }
    };
  }

  // G. Chest Pain, Severe Breathlessness, Emergency, 108 Ambulance
  if (
    q.includes('chest') ||
    q.includes('heart') ||
    q.includes('attack') ||
    q.includes('breath') ||
    q.includes('emergency') ||
    q.includes('108') ||
    q.includes('ambulance') ||
    q.includes('छाती') ||
    q.includes('दर्द') ||
    q.includes('सांस') ||
    q.includes('दम') ||
    q.includes('आपातकालीन') ||
    q.includes('एम्बुलेंस') ||
    q.includes('छातीत') ||
    q.includes('रुग्णवाहिका')
  ) {
    if (language === 'hi') {
      return {
        text: `आपातकालीन चेतावनी: सीने में तेज दर्द, भारीपन, जबड़े या बाएं हाथ में दर्द, अथवा अचानक तेज सांस फूलना एक गंभीर मेडिकल इमरजेंसी हो सकता है। तुरंत 108 नंबर पर डायल करके निशुल्क एम्बुलेंस बुलाएं और बिना देरी किए नजदीकी अस्पताल पहुंचें।`,
        action: {
          label: 'आशा कार्यकर्ता को कॉल करें',
          type: 'call_asha'
        }
      };
    } else if (language === 'mr') {
      return {
        text: `तातडीची आणीबाणी सूचना: छातीत तीव्र कळ येणे, दम लागणे किंवा डाव्या हातात वेदना होणे हे गंभीर हृदयविकाराचे लक्षण असू शकते. कृपया त्वरित १०८ क्रमांकावर कॉल करून मोफत रुग्णवाहिका बोलवा आणि जवळच्या जिल्हा रुग्णालयात दाखल व्हा.`,
        action: {
          label: 'आशा सेविकेशी संपर्क साधा',
          type: 'call_asha'
        }
      };
    }
    return {
      text: `CRITICAL MEDICAL ALERT: Sudden chest tightness, pain radiating to the left shoulder/jaw, or acute shortness of breath indicates an immediate emergency. Please dial 108 immediately for free emergency ambulance services and transfer to the nearest secondary/district hospital.`,
      action: {
        label: 'Call Assigned Health Worker',
        type: 'call_asha'
      }
    };
  }

  // H. Pregnancy, ANC, Gestational Hypertension, Fetal Movement
  if (
    q.includes('pregnant') ||
    q.includes('pregnancy') ||
    q.includes('anc') ||
    q.includes('delivery') ||
    q.includes('kick') ||
    q.includes('baby') ||
    q.includes('गर्भ') ||
    q.includes('गर्भावस्था') ||
    q.includes('प्रसव') ||
    q.includes('डिलीवरी') ||
    q.includes('बच्चा') ||
    q.includes('हलचल') ||
    q.includes('गरोदर') ||
    q.includes('बाळ') ||
    q.includes('प्रसूती')
  ) {
    if (language === 'hi') {
      return {
        text: `मातृ स्वास्थ्य एवं गर्भावस्था सलाह: 
1. दिन में शिशु की कम से कम 10 बार हलचल (Kick count) महसूस होनी चाहिए।
2. आयरन और कैल्शियम की गोलियाँ नियमित लें, संतुलित आहार और हरी पत्तेदार सब्जियां खाएं।
3. चेतावनी संकेत: यदि तेज सिरदर्द, आँखों के आगे अंधेरा, पैरों या चेहरे पर तेज सूजन, या रक्तस्राव हो तो तुरंत अस्पताल जाएं।
आपकी अगली एएनसी जांच उपकेंद्र पर निर्धारित है।`,
        action: {
          label: 'डॉक्टर से परामर्श लें',
          type: 'open_teleconsult',
          payload: { patientId: patient?.id || 'pat-101' }
        }
      };
    } else if (language === 'mr') {
      return {
        text: `मातृ आरोग्य आणि गरोदरपण काळजी:
1. दिवसातून बाळाची किमान १० वेळा हालचाल (Kick count) जाणवली पाहिजे.
2. आयर्न आणि कॅल्शियमच्या गोळ्या वेळेवर घ्या, पौष्टिक आहार आणि फळे खा.
3. धोक्याची लक्षणे: तीव्र डोकेदुखी, पायावर जास्त सूज, डोळ्यांसमोर अंधारी किंवा रक्तस्त्राव दिसल्यास त्वरित रुग्णालयात जा.`,
        action: {
          label: 'डॉक्टरांशी संपर्क करा',
          type: 'open_teleconsult',
          payload: { patientId: patient?.id || 'pat-101' }
        }
      };
    }
    return {
      text: `Antenatal Care Guidelines:
1. Track daily fetal movements (minimum 10 movements over a 12-hour period).
2. Adhere strictly to daily Iron-Folic Acid and Calcium supplementation.
3. Warning Signs: Severe headache, sudden facial edema, visual disturbances, or vaginal bleeding require immediate hospital admission.`,
      action: {
        label: 'Connect with Doctor',
        type: 'open_teleconsult',
        payload: { patientId: patient?.id || 'pat-101' }
      }
    };
  }

  // I. Child Vaccination & Immunization Schedule
  if (
    q.includes('vaccin') ||
    q.includes('immuniz') ||
    q.includes('polio') ||
    q.includes('bcg') ||
    q.includes('टीका') ||
    q.includes('टीकाकरण') ||
    q.includes('लस') ||
    q.includes('लसीकरण')
  ) {
    if (language === 'hi') {
      return {
        text: `राष्ट्रीय टीकाकरण कार्यक्रम: जन्म के समय बीसीजी, ओरल पोलियो और हेपेटाइटिस-बी दिया जाता है। 6, 10 और 14 सप्ताह पर पेंटावेलेंट, रोटावायरस और न्यूमोकोकल टीके लगते हैं। 9 माह पर खसरा-रूबेला (MR) का पहला टीका लगता है। अपने बच्चे का एमसीपी (MCP) कार्ड लेकर उपकेंद्र के टीकाकरण सत्र में अवश्य आएं।`,
        action: { label: 'आशा कार्यकर्ता को कॉल करें', type: 'call_asha' }
      };
    } else if (language === 'mr') {
      return {
        text: `राष्ट्रीय बाल लसीकरण वेळापत्रक: जन्मानंतर लगेच बीसीजी, पोलिओ आणि हेपेटायटिस-बी; ६, १० आणि १४ आठवड्यांनी पेंटाव्हॅलंट आणि रोटाव्हायरस लस दिली जाते. ९ महिन्यांत गोवर-रुबेला (MR) ची लस दिली जाते. गावच्या आशा सेविकेकडून लसीकरण सत्र तपासा.`,
        action: { label: 'आशा सेविकेशी संपर्क', type: 'call_asha' }
      };
    }
    return {
      text: `National Immunization Schedule: At birth, infants receive BCG, Oral Polio (OPV), and Hepatitis-B. At 6, 10, and 14 weeks, Pentavalent, Rotavirus, and Pneumococcal vaccines are administered. At 9 months, Measles-Rubella (MR) is given. Keep your Mother & Child Protection (MCP) card updated.`,
      action: { label: 'Call ASHA Worker', type: 'call_asha' }
    };
  }

  // J. Diarrhea, Vomiting, Dehydration & ORS
  if (
    q.includes('diarrhea') ||
    q.includes('vomit') ||
    q.includes('loose') ||
    q.includes('ors') ||
    q.includes('dehydration') ||
    q.includes('दस्त') ||
    q.includes('उल्टी') ||
    q.includes('ओआरएस') ||
    q.includes('जुलाब') ||
    q.includes('उलटी') ||
    q.includes('जलसंजीवनी')
  ) {
    if (language === 'hi') {
      return {
        text: `दस्त और उल्टी का प्राथमिक उपचार: 1 पैकेट ओआरएस को 1 लीटर साफ उबले हुए ठंडे पानी में घोलें। हर दस्त के बाद 1 गिलास ओआरएस का घोल पिएं। बच्चों को 14 दिनों तक जिंक की गोली दें। यदि पेशाब बंद हो जाए, आंखें धंस जाएं या तेज कमजोरी लगे तो तुरंत अस्पताल जाएं।`,
        action: { label: 'आशा कार्यकर्ता को कॉल करें', type: 'call_asha' }
      };
    } else if (language === 'mr') {
      return {
        text: `जुलाब आणि उलटी प्राथमिक उपाय: १ लिटर उकळून थंड केलेल्या पाण्यात १ पाकीट ओआरएस (जलसंजीवनी) पूर्ण विरघळवा. प्रत्येक जुलाबानंतर १ पेला ओआरएस पाणी हळूहळू प्या. लघवीचे प्रमाण कमी झाल्यास त्वरित प्राथमिक आरोग्य केंद्रात दाखल व्हा.`,
        action: { label: 'आशा सेविकेशी संपर्क', type: 'call_asha' }
      };
    }
    return {
      text: `Diarrhea and Dehydration Management: Dissolve 1 packet of Oral Rehydration Salts (ORS) in 1 liter of boiled and cooled drinking water. Sip continuously after every loose stool. For children, zinc supplementation is recommended for 14 days. Seek immediate hospital care if signs of lethargy, sunken eyes, or reduced urination occur.`,
      action: { label: 'Call ASHA Worker', type: 'call_asha' }
    };
  }

  // K. Cough, Cold, Respiratory
  if (
    q.includes('cough') ||
    q.includes('sore throat') ||
    q.includes('cold') ||
    q.includes('phlegm') ||
    q.includes('खांसी') ||
    q.includes('बलगम') ||
    q.includes('खोकला') ||
    q.includes('कफ') ||
    q.includes('घसा')
  ) {
    if (language === 'hi') {
      return {
        text: `खांसी व जुकाम सलाह: गुनगुने पानी से गरारे करें, तुलसी-अदरक का काढ़ा पिएं और भाप लें। यदि खांसी 2 सप्ताह से अधिक रहे या बलगम में खून आए, तो तुरंत टीबी की जांच (बलगम जांच व छाती का एक्स-रे) के लिए प्राथमिक स्वास्थ्य केंद्र पर जाएं।`,
        action: { label: 'डॉक्टर से परामर्श लें', type: 'open_teleconsult', payload: { patientId: patient?.id || 'pat-101' } }
      };
    } else if (language === 'mr') {
      return {
        text: `खोकला आणि सर्दी काळजी: कोमट पाण्याच्या गुळण्या करा, वाफ घ्या आणि विश्रांती घ्या. खोकला २ आठवड्यांपेक्षा जास्त दिवस राहिल्यास अथवा कफातून रक्त पडल्यास त्वरित टीबी तपासणीसाठी प्राथमिक आरोग्य केंद्रात जा.`,
        action: { label: 'डॉक्टरांशी संपर्क करा', type: 'open_teleconsult', payload: { patientId: patient?.id || 'pat-101' } }
      };
    }
    return {
      text: `Respiratory & Cough Advice: Practice warm salt water gargles, steam inhalation, and maintain hydration. If a chronic cough lasts longer than 2 weeks or presents with fever, night sweats, or hemoptysis, visit the PHC for sputum testing and chest screening to rule out tuberculosis.`,
      action: { label: 'Consult Doctor', type: 'open_teleconsult', payload: { patientId: patient?.id || 'pat-101' } }
    };
  }

  // L. Diet, Low Salt, Water & Nutrition
  if (
    q.includes('diet') ||
    q.includes('salt') ||
    q.includes('food') ||
    q.includes('eat') ||
    q.includes('nutrition') ||
    q.includes('water') ||
    q.includes('नमक') ||
    q.includes('खानपान') ||
    q.includes('आहार') ||
    q.includes('भोजन') ||
    q.includes('मीठ') ||
    q.includes('पाणी') ||
    q.includes('पोषण')
  ) {
    if (language === 'hi') {
      return {
        text: `उच्च रक्तचाप के लिए आहार निर्देश: प्रतिदिन नमक की मात्रा 1 छोटा चम्मच (5 ग्राम) से कम रखें। पापड़, अचार, नमकीन और पैकेज्ड फूड से बचें। हरी सब्जियां (पालक, मेथी, लौकी), फल, दालें और प्रतिदिन 8-10 गिलास पानी पिएं। हल्का व्यायाम और पर्याप्त नींद लें।`,
        action: { label: 'प्रिस्क्रिप्शन देखें', type: 'view_prescriptions' }
      };
    } else if (language === 'mr') {
      return {
        text: `आहार मार्गदर्शन: आहारात मिठाचे प्रमाण दिवसभरात १ चमच्यापेक्षा कमी ठेवा. लोणचे, पापड, खारवलेले पदार्थ आणि तेलकट अन्न टाळा. हिरव्या पालेभाज्या, मोड आलेली कडधान्ये आणि पुरेसे पाणी प्या. दररोज ७-८ तास शांत झोप घ्या.`,
        action: { label: 'औषध तपशील पहा', type: 'view_prescriptions' }
      };
    }
    return {
      text: `Nutritional Guidelines for Blood Pressure: Restrict daily sodium intake to less than 5 grams (approx. 1 teaspoon). Avoid pickles, papads, processed savories, and excessive fried foods. Consume leafy vegetables, lentils, seasonal fruits, and at least 8 to 10 glasses of clean water daily.`,
      action: { label: 'View Prescription Details', type: 'view_prescriptions' }
    };
  }

  // M. ASHA Worker Assistance
  if (
    q.includes('asha') ||
    q.includes('call') ||
    q.includes('आशा') ||
    q.includes('फोन') ||
    q.includes('सेविका') ||
    q.includes('tai')
  ) {
    if (language === 'hi') {
      return {
        text: `आपकी गाँव की स्वास्थ्य कार्यकर्ता सुनीता बाई हैं, जिनका संपर्क नंबर 94231 88990 है। वह नियमित गृह भ्रमण, रक्तचाप जांच और टीकाकरण में सहायता करती हैं। क्या आप उन्हें अभी कॉल करना चाहते हैं?`,
        action: { label: `आशा कार्यकर्ता को कॉल करें`, type: 'call_asha' }
      };
    } else if (language === 'mr') {
      return {
        text: `आपल्या गावच्या आशा सेविका सुनिता बाई आहेत, ज्यांचा संपर्क क्रमांक 94231 88990 आहे. त्या गृहभेटी, रक्तदाब तपासणी आणि लसीकरणात मदत करतात. आपण त्यांना संपर्क करू शकता.`,
        action: { label: `आशा सेविकेशी संपर्क`, type: 'call_asha' }
      };
    }
    return {
      text: `Your assigned village health worker is ${patient?.linkedAshaName || 'Sunita Bai'} with contact number 94231 88990. She is available for home checkups and triage follow-ups. Would you like to call her now?`,
      action: { label: `Call ASHA (${patient?.linkedAshaName || 'Sunita Bai'})`, type: 'call_asha' }
    };
  }

  // N. ABHA Health Card & Digital Health ID
  if (
    q.includes('abha') ||
    q.includes('card') ||
    q.includes('id') ||
    q.includes('आभा') ||
    q.includes('कार्ड') ||
    q.includes('आईडी')
  ) {
    const abha = patient?.abhaId || '91-4521-8890-3312';
    if (language === 'hi') {
      return {
        text: `आपका आयुष्मान भारत डिजिटल स्वास्थ्य खाता (ABHA ID): ${abha} है। इस डिजिटल कार्ड के माध्यम से आपके सभी डॉक्टर पर्चे, लैब रिपोर्ट और रेफरल रिकॉर्ड सुरक्षित रूप से संकलित हैं।`,
        action: { label: 'डिजिटल रिकॉर्ड देखें', type: 'view_patient', payload: { patientId: patient?.id || 'pat-101' } }
      };
    } else if (language === 'mr') {
      return {
        text: `आपले आयुष्मान भारत डिजिटल आरोग्य खाते (ABHA ID): ${abha} आहे. या क्रमांकाद्वारे आपले सर्व दवाखाने, तपासण्या आणि औषधांचे रेकॉर्ड सुरक्षित राहतात.`,
        action: { label: 'आरोग्य नोंद पहा', type: 'view_patient', payload: { patientId: patient?.id || 'pat-101' } }
      };
    }
    return {
      text: `Your Ayushman Bharat Health Account (ABHA ID) is ${abha}. All your digital prescriptions, diagnostic lab reports, and clinical continuum encounters are linked under this identifier.`,
      action: { label: 'View Health Chart', type: 'view_patient', payload: { patientId: patient?.id || 'pat-101' } }
    };
  }

  // 2. DOCTOR QUERIES
  if (role === 'doctor') {
    const pendingReferrals = referrals.filter(
      (r) => r.status === 'Created' || r.status === 'Accepted'
    );

    if (
      q.includes('referral') ||
      q.includes('pending') ||
      q.includes('मरीज') ||
      q.includes('रेफरल') ||
      q.includes('queue') ||
      q.includes('रुग्ण')
    ) {
      if (language === 'hi') {
        return {
          text: `डॉक्टर साहब, आपके पास वर्तमान में ${pendingReferrals.length} सक्रिय इनबाउंड रेफरल केस हैं। उच्च प्राथमिकता केस सविता देवी का है, जिनका रक्तचाप 150 बटा 95 और 28 सप्ताह का गर्भकाल है।`,
          action: {
            label: 'सविता देवी केस देखें',
            type: 'open_teleconsult',
            payload: { patientId: 'pat-101' }
          }
        };
      } else if (language === 'mr') {
        return {
          text: `डॉक्टर, आपल्याकडे सध्या ${pendingReferrals.length} सक्रिय रेफरल्स प्रलंबित आहेत. उच्च प्राधान्य रुग्ण सविता देवी, रक्तदाब 150 भागिले 95, 28 आठवडे गरोदरपण, रामपूर उपकेंद्राकडून आलेले आहे.`,
          action: {
            label: 'सविता देवीची माहिती',
            type: 'open_teleconsult',
            payload: { patientId: 'pat-101' }
          }
        };
      }
      return {
        text: `Doctor, you currently have ${pendingReferrals.length} active inbound referrals requiring clinical evaluation. High-priority case: Savita Devi, blood pressure 150 over 95, 28-weeks pregnant, referred from Rampur Sub-centre.`,
        action: {
          label: 'Review Savita Devi',
          type: 'open_teleconsult',
          payload: { patientId: 'pat-101' }
        }
      };
    }

    if (
      q.includes('savita') ||
      q.includes('summary') ||
      q.includes('case') ||
      q.includes('सविता')
    ) {
      if (language === 'hi') {
        return {
          text: `सविता देवी का क्लिनिकल सारांश: उम्र 28 वर्ष, 28 सप्ताह का गर्भकाल। दर्ज रक्तचाप 150 बटा 95, पल्स 82 और ऑक्सीजन स्तर 98 प्रतिशत है। प्रारंभिक लक्षण: पैरों में हल्की सूजन और सिरदर्द। स्थिति: जेस्टेशनल हाइपरटेंशन। सुझाई गई कार्यवाही: एमलोडिपिन 5 मिलीग्राम प्रिस्क्रिप्शन और 72 घंटे में आशा फॉलो-अप।`,
          action: {
            label: 'टेलीकंसल्ट ओपीडी खोलें',
            type: 'open_teleconsult',
            payload: { patientId: 'pat-101' }
          }
        };
      } else if (language === 'mr') {
        return {
          text: `सविता देवी यांचा रुग्ण सारांश: वय 28 वर्षे, 28 आठवडे गरोदर. रक्तदाब 150 भागिले 95, नाडी 82 आणि ऑक्सिजन पातळी 98 टक्के. प्राथमिक लक्षणे: पायावर हलकी सूज आणि डोकेदुखी. निदान: गरोदरपणातील उच्च रक्तदाब. उपचार: एमलोडिपिन 5 मिलीग्राम आणि 72 तासांत आशा गृह तपासणी.`,
          action: {
            label: 'टेलिकन्सल्ट ओपीडी उघडा',
            type: 'open_teleconsult',
            payload: { patientId: 'pat-101' }
          }
        };
      }
      return {
        text: `Clinical Summary for Savita Devi: Age 28, 28-weeks gestation. Vitals: Blood pressure 150 over 95, Pulse 82 beats per minute, Oxygen saturation 98 percent. Presentation: Mild pedal edema and morning headache. Triage Category: High Risk Gestational Hypertension. Recommended action: E-Prescription for Amlodipine 5 milligrams and structured ASHA follow-up within 72 hours.`,
        action: {
          label: 'Open Teleconsult OPD',
          type: 'open_teleconsult',
          payload: { patientId: 'pat-101' }
        }
      };
    }

    if (q.includes('teleconsult') || q.includes('call') || q.includes('ऑनलाइन')) {
      return {
        text: `Starting teleconsultation link for Chandur Primary Health Centre digital clinic. Connecting to Rampur Sub-centre Community Health Officer and patient.`,
        action: {
          label: 'Connect Teleconsult Room',
          type: 'open_teleconsult',
          payload: { patientId: 'pat-101' }
        }
      };
    }
  }

  // 3. ADMIN / DHO QUERIES
  if (role === 'admin') {
    if (
      q.includes('rate') ||
      q.includes('closure') ||
      q.includes('kpi') ||
      q.includes('दर') ||
      q.includes('loop')
    ) {
      if (language === 'hi') {
        return {
          text: `जिले का रेफरल क्लोजर दर 78.4 प्रतिशत है। इस महीने कुल 142 रेफरल दर्ज हुए, जिनमें से 111 केस सफलतापूर्वक पूरे किए गए। उपकेंद्र से प्राथमिक स्वास्थ्य केंद्र तक औसत समय 4.2 घंटे दर्ज हुआ है।`
        };
      } else if (language === 'mr') {
        return {
          text: `जिल्ह्याचा रेफरल लूप क्लोजर दर 78.4 टक्के आहे. या महिन्यात एकूण 142 रेफरल्स निर्माण झाले, त्यापैकी 111 रुग्णांचे उपचार यशस्वीपणे पूर्ण झाले. सरासरी पोहोच वेळ 4.2 तास नोंदवली आहे.`
        };
      }
      return {
        text: `District Referral Continuum Status: Referral Loop Closure Rate is 78.4 percent against target of 85 percent. Total referrals generated this month is 142, with 111 completed clinical outcomes. Average transit time is 4.2 hours from Sub-centre to PHC consult.`
      };
    }

    if (
      q.includes('backlog') ||
      q.includes('bottleneck') ||
      q.includes('अस्पताल') ||
      q.includes('facility') ||
      q.includes('प्रतीक्षा')
    ) {
      if (language === 'hi') {
        return {
          text: `अस्पताल क्षमता अलर्ट: इगतपुरी ग्रामीण अस्पताल में 4 रेफरल परामर्श लंबित हैं और बेड क्षमता 82 प्रतिशत है। चांदूर प्राथमिक स्वास्थ्य केंद्र 92 प्रतिशत क्लोजर दर के साथ सुचारू रूप से कार्य कर रहा है।`
        };
      } else if (language === 'mr') {
        return {
          text: `आरोग्य केंद्र सतर्कता: इगतपुरी ग्रामीण रुग्णालयात ४ सल्लामसलत प्रलंबित असून खाटांची संख्या ८२ टक्के भरली आहे. चांदूर प्राथमिक आरोग्य केंद्र ९२ टक्के क्लोजर दराने सुरळीत कार्यरत आहे.`
        };
      }
      return {
        text: `Facility Bottleneck Alert: Igatpuri Rural Hospital has 4 overdue referral consultations and an active bed occupancy of 82 percent. Chandur PHC is functioning smoothly at 92 percent loop closure.`
      };
    }

    if (
      q.includes('emergency') ||
      q.includes('high risk') ||
      q.includes('इमरजेंसी') ||
      q.includes('आणीबाणी')
    ) {
      if (language === 'hi') {
        return {
          text: `सक्रिय ट्राइएज विवरण: आपातकालीन श्रेणी में 2 केस जिला अस्पताल में स्थानांतरित किए गए हैं। उच्च-जोखीम श्रेणी में 5 सक्रिय मातृ एवं हृदय संबंधी मामले लगातार निगरानी में हैं।`
        };
      }
      return {
        text: `Active Triage Breakdown: Emergency Tier has 2 active cases transferred to District Civil Hospital. High-Risk Tier has 5 active maternal and cardiac cases under close monitoring.`
      };
    }
  }

  // 4. ASHA / ANM FIELD QUERIES
  if (role === 'asha' || role === 'anm') {
    const pendingVisits = followUps.filter((f) => f.status === 'pending');

    if (
      q.includes('visit') ||
      q.includes('home') ||
      q.includes('भेंट') ||
      q.includes('घर') ||
      q.includes('task') ||
      q.includes('तपासणी')
    ) {
      if (language === 'hi') {
        return {
          text: `रामपूर गाँव में आज आपकी ${pendingVisits.length} गृह भेंटें निर्धारित हैं। पहली, सविता देवी के लिए मातृ रक्तचाप और दवा जांच। दूसरी, रेखा बाई के लिए श्वसन सुधार जांच। क्या आप सविता देवी का रिकॉर्ड खोलना चाहते हैं?`,
          action: {
            label: 'सविता देवी रिकॉर्ड खोलें',
            type: 'view_patient',
            payload: { patientId: 'pat-101' }
          }
        };
      } else if (language === 'mr') {
        return {
          text: `रामपूर गावात आज आपल्या ${pendingVisits.length} गृहभेटी प्रलंबित आहेत. पहिली, सविता देवी यांच्यासाठी गरोदर रक्तदाब आणि औषध तपासणी. दुसरी, रेखा बाई यांची तपासणी. सविता देवींचे रेकॉर्ड उघडू का?`,
          action: {
            label: 'सविता देवीचे रेकॉर्ड',
            type: 'view_patient',
            payload: { patientId: 'pat-101' }
          }
        };
      }
      return {
        text: `You have ${pendingVisits.length} assigned home visits pending today in Rampur Village: First, Savita Devi for Maternal Blood Pressure and Medication Check. Second, Rekha Bai for respiratory recovery check. Would you like to open the home visit record?`,
        action: {
          label: 'Open Savita Devi Record',
          type: 'view_patient',
          payload: { patientId: 'pat-101' }
        }
      };
    }

    if (
      q.includes('bp') ||
      q.includes('triage') ||
      q.includes('protocol') ||
      q.includes('नियम') ||
      q.includes('बीपी')
    ) {
      if (language === 'hi') {
        return {
          text: `आशा रक्तचाप प्रोटोकॉल: यदि सिस्टोलिक 140 या डायस्टोलिक 90 से अधिक हो और गर्भावस्था के लक्षण हों, तो यह उच्च जोखिम है। मरीज को 15 मिनट आराम देकर दोबारा जांचें और तुरंत चांदूर प्राथमिक स्वास्थ्य केंद्र के लिए डिजिटल रेफरल दर्ज करें।`
        };
      } else if (language === 'mr') {
        return {
          text: `आशा रक्तदाब प्रोटोकॉल: जर सिस्टोलिक १४० किंवा डायस्टोलिक ९० पेक्षा जास्त असेल आणि गरोदरपणाची लक्षणे असतील, तर ती उच्च जोखीम मानली जाते. रुग्णाला १५ मिनिटे विश्रांती देऊन पुन्हा तपासा आणि प्राथमिक आरोग्य केंद्राकडे रेफरल करा.`
        };
      }
      return {
        text: `ASHA Protocol for Blood Pressure: Systolic 140 or Diastolic 90 and above with pregnancy symptoms is classified as High Risk. Recheck blood pressure after 15 minutes rest and trigger immediate digital referral to Chandur PHC.`
      };
    }
  }

  // Fallback General Response
  if (language === 'hi') {
    return {
      text: `मैंने आपकी स्वास्थ्य संबंधी बात समझ ली है। आप रक्तचाप, निर्धारित दवाइयों, सिरदर्द या चक्कर, बुखार, गर्भावस्था सावधानियों, डॉक्टर से भेंट अथवा आशा कार्यकर्ता से संपर्क के बारे में और पूछ सकते हैं।`,
      action: {
        label: 'मरीज रिकॉर्ड देखें',
        type: 'view_patient',
        payload: { patientId: patient?.id || 'pat-101' }
      }
    };
  } else if (language === 'mr') {
    return {
      text: `मी आपली आरोग्य विचारणा समजून घेतली आहे. आपण रक्तदाब, चालू औषधोपचार, डोकेदुखी, ताप, गरोदरपणातील काळजी, डॉक्टर तपासणी वेळ किंवा आशा सेविकेशी संपर्क याबद्दल अधिक विचारू शकता.`,
      action: {
        label: 'रुग्ण तपशील पहा',
        type: 'view_patient',
        payload: { patientId: patient?.id || 'pat-101' }
      }
    };
  }

  return {
    text: `I have received your healthcare inquiry. You can ask for blood pressure readings, medicine instructions, headache or fever relief, pregnancy precautions, or connect with your village health team.`,
    action: {
      label: 'Open Patient Health Chart',
      type: 'view_patient',
      payload: { patientId: patient?.id || 'pat-101' }
    }
  };
}
