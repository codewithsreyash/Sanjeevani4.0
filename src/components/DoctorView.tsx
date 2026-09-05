import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Referral, Patient, FollowUpType } from '../types';
import {
  Stethoscope,
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  FileText,
  Pill,
  Video,
  User,
  Heart,
  Thermometer,
  Wind,
  Activity,
  ArrowUpDown,
  Send,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  ChevronRight,
  Hospital,
  ShieldCheck,
  Zap,
  PhoneCall
} from 'lucide-react';
import { PatientTimelineModal } from './PatientTimelineModal';
import doctorTeleImg from '../assets/images/doctor_teleconsult_1788025790089.jpg';
import ashaCareImg from '../assets/images/asha_worker_care_1788025776530.jpg';

export const DoctorView: React.FC = () => {
  const {
    referrals,
    patients,
    acceptReferral,
    recordConsultationOutcome,
    setActiveTeleconsultPatient,
    setDemoStep,
    t,
    language
  } = useHealth();

  const loc = {
    en: {
      docTitle: 'Dr. Rajesh Kulkarni • Medical Officer',
      degree: 'MBBS, DNB',
      facility: 'Chandur Primary Health Centre (PHC) • Specialist Teleconsult Desk',
      sortByUrgency: 'Sort by Urgency',
      highToLow: '(High → Low)',
      normal: '(Normal)',
      incomingReferrals: 'Incoming Sub-centre Referrals',
      cases: 'Cases',
      from: 'From',
      by: 'By',
      urgencyLabel: 'Urgency',
      status: 'Status',
      village: 'Village',
      referredFrom: 'Referred From',
      teleconsult: 'Teleconsult',
      timeline: 'Timeline',
      referralTriggerTitle: 'Referral Trigger & Frontline Triage Summary',
      referredBy: 'Referred by',
      date: 'Date',
      vitalsSection: 'Recorded Baseline Vitals & Medical History',
      bp: 'BP (mmHg)',
      oxygen: 'Oxygen (SpO2)',
      temp: 'Temperature',
      pulse: 'Pulse',
      pastHistory: 'Past History & Comorbidities',
      noPriorHistory: 'No prior chronic history on record.',
      esanjeevaniBadge: 'eSanjeevani / ABDM Telemedicine',
      subcentreOnline: 'Sub-centre Online',
      startTeleconsultWith: 'Start Video Teleconsultation with',
      liveConnectionAssisted: 'Live connection assisted by ASHA with real-time HUD vitals',
      launchTeleconsult: 'Launch Teleconsult',
      acceptCase: 'Accept Referral Case',
      recordOutcome: 'Record Consultation Outcome & Rx',
      viewUpdateOutcome: 'View/Update Consultation Rx',
      consultationOutcomeRecorded: 'Consultation Outcome Recorded',
      completed: 'Completed',
      diagnosis: 'Diagnosis',
      treatment: 'Treatment',
      advice: 'Advice',
      noReferralSelected: 'Select a referral from the list on the left to review case details.',
      modalTitle: 'Medical Officer Consultation & Prescription (Rx)',
      patientLabel: 'Patient',
      refLabel: 'Ref #',
      clinicalDiagnosis: 'Clinical Diagnosis *',
      treatmentPlan: 'Treatment Plan & Clinical Impression',
      prescribedMeds: 'Prescribed Medicines (Rx)',
      addMedPlaceholder: 'Add medicine (e.g. Tab Labetalol 100mg BD)...',
      add: 'Add',
      docAdvice: 'Doctor Advice & Warning Signs',
      assignFollowUp: 'Assign Home Follow-up Task to Village ASHA',
      followUpCategory: 'Follow-up Category',
      maternal: 'Maternal (ANC/PNC)',
      chronic: 'Chronic NCD (Diabetes/HTN)',
      child: 'Child / Pediatric',
      postReferral: 'Post-Referral Check',
      dueDate: 'Due Date',
      ashaInstructions: 'Instructions for ASHA Worker:',
      cancel: 'Cancel',
      finalizeAndDispatch: 'Finalize Consultation & Dispatch Task'
    },
    hi: {
      docTitle: 'डॉ. राजेश कुलकर्णी • चिकित्सा अधिकारी (MO)',
      degree: 'एमबीबीएस, डीएनबी',
      facility: 'चांदूर प्राथमिक स्वास्थ्य केंद्र (PHC) • विशेषज्ञ टेलीकंसल्ट डेस्क',
      sortByUrgency: 'गंभीरता अनुसार क्रमबद्ध करें',
      highToLow: '(उच्च → सामान्य)',
      normal: '(सामान्य)',
      incomingReferrals: 'उप-केंद्र से आए रेफरल मरीज',
      cases: 'मामले',
      from: 'प्रेषक',
      by: 'द्वारा',
      urgencyLabel: 'गंभीरता',
      status: 'स्थिति',
      village: 'गांव',
      referredFrom: 'रेफरल केंद्र',
      teleconsult: 'टेलीकंसल्ट',
      timeline: 'टाइमलाइन',
      referralTriggerTitle: 'रेफरल कारण व फ्रंटलाइन ट्राइएज सारांश',
      referredBy: 'रेफर करने वाले',
      date: 'दिनांक',
      vitalsSection: 'दर्ज महत्वपूर्ण संकेत व चिकित्सा इतिहास',
      bp: 'रक्तचाप (mmHg)',
      oxygen: 'ऑक्सीजन (SpO2)',
      temp: 'शरीर का तापमान',
      pulse: 'नाड़ी गति (Pulse)',
      pastHistory: 'पूर्व रोग व जटिलताएं',
      noPriorHistory: 'कोई पूर्व पुरानी बीमारी दर्ज नहीं है।',
      esanjeevaniBadge: 'ई-संजीवनी / एबीडीएम टेलीमेडिसिन',
      subcentreOnline: 'उप-केंद्र ऑनलाइन',
      startTeleconsultWith: 'वीडियो टेलीकंसल्टेशन शुरू करें:',
      liveConnectionAssisted: 'आशा कार्यकर्ता की सहायता से लाइव टेलीकंसल्ट व रीयल-टाइम वाइटल्स',
      launchTeleconsult: 'टेलीकंसल्ट शुरू करें',
      acceptCase: 'रेफरल केस स्वीकार करें',
      recordOutcome: 'परामर्श परिणाम व दवाइयां (Rx) लिखें',
      viewUpdateOutcome: 'परामर्श व दवाइयां देखें/संशोधित करें',
      consultationOutcomeRecorded: 'परामर्श परिणाम दर्ज किया गया',
      completed: 'पूर्ण',
      diagnosis: 'निदान (Diagnosis)',
      treatment: 'उपचार योजना (Treatment)',
      advice: 'चिकित्सकीय सलाह (Advice)',
      noReferralSelected: 'केस का विवरण देखने के लिए बाईं ओर की सूची से रेफरल चुनें।',
      modalTitle: 'चिकित्सा अधिकारी परामर्श एवं नुस्खा (Rx)',
      patientLabel: 'मरीज',
      refLabel: 'रेफरल #',
      clinicalDiagnosis: 'रोग निदान (Clinical Diagnosis) *',
      treatmentPlan: 'उपचार योजना व नैदानिक निष्कर्ष',
      prescribedMeds: 'निर्धारित दवाइयां (Rx)',
      addMedPlaceholder: 'दवा जोड़ें (जैसे Tab Labetalol 100mg BD)...',
      add: 'जोड़ें',
      docAdvice: 'डॉक्टर की सलाह व चेतावनी संकेत',
      assignFollowUp: 'गांव की आशा कार्यकर्ता को गृह फॉलो-अप कार्य सौंपें',
      followUpCategory: 'फॉलो-अप श्रेणी',
      maternal: 'मातृ देखभाल (ANC/PNC)',
      chronic: 'पुरानी बीमारी (NCD - BP/डायबिटीज)',
      child: 'बाल स्वास्थ्य (Pediatric)',
      postReferral: 'रेफरल उपरांत फॉलो-अप',
      dueDate: 'नियत तिथि (Due Date)',
      ashaInstructions: 'आशा कार्यकर्ता हेतु निर्देश:',
      cancel: 'रद्द करें',
      finalizeAndDispatch: 'परामर्श पूर्ण करें व कार्य भेजें'
    },
    mr: {
      docTitle: 'डॉ. राजेश कुलकर्णी • वैद्यकीय अधिकारी (MO)',
      degree: 'एमबीबीएस, डीएनबी',
      facility: 'चांदूर प्राथमिक आरोग्य केंद्र (PHC) • तज्ज्ञ टेलिकन्सल्ट डेस्क',
      sortByUrgency: 'तातडीनुसार वर्गीकरण करा',
      highToLow: '(जास्त → सामान्य)',
      normal: '(सामान्य)',
      incomingReferrals: 'उपकेंद्राकडून आलेले संदर्भ रुग्ण',
      cases: 'केसेस',
      from: 'कडून',
      by: 'द्वारे',
      urgencyLabel: 'तातडी',
      status: 'स्थिती',
      village: 'गाव',
      referredFrom: 'संदर्भ केंद्र',
      teleconsult: 'टेलिकन्सल्ट',
      timeline: 'टाइमलाइन',
      referralTriggerTitle: 'रेफरल कारण व फ्रंटलाइन ट्रायज सारांश',
      referredBy: 'रेफर करणारे',
      date: 'तारीख',
      vitalsSection: 'नोंदवलेली जीवनविषयक चिन्हे व वैद्यकीय इतिहास',
      bp: 'रक्तदाब (mmHg)',
      oxygen: 'ऑक्सिजन (SpO2)',
      temp: 'शरीराचे तापमान',
      pulse: 'नाडीचे ठोके (Pulse)',
      pastHistory: 'मागील आजार व जुनाट व्याधी',
      noPriorHistory: 'मागील जुनाट आजाराची कोणतीही नोंद नाही.',
      esanjeevaniBadge: 'ई-संजीवनी / एबीडीएम टेलिमेडिसिन',
      subcentreOnline: 'उपकेंद्र ऑनलाइन',
      startTeleconsultWith: 'व्हिडिओ टेलिकन्सल्टेशन सुरू करा:',
      liveConnectionAssisted: 'आशा सेविकेच्या सहाय्याने थेट टेलिकन्सल्ट व प्रत्यक्ष वाइटल्स',
      launchTeleconsult: 'टेलिकन्सल्ट सुरू करा',
      acceptCase: 'रेफरल केस स्वीकारा',
      recordOutcome: 'तपासणी निष्कर्ष व औषधोपचार (Rx) नोंदवा',
      viewUpdateOutcome: 'तपासणी निष्कर्ष व औषधोपचार पहा/बदला',
      consultationOutcomeRecorded: 'तपासणी निष्कर्ष नोंदवला गेला',
      completed: 'पूर्ण',
      diagnosis: 'रोगनिदान (Diagnosis)',
      treatment: 'उपचार योजना (Treatment)',
      advice: 'वैद्यकीय सल्ला (Advice)',
      noReferralSelected: 'तपशील पाहण्यासाठी डाव्या बाजूच्या यादीतून रुग्ण निवडा.',
      modalTitle: 'वैद्यकीय अधिकारी तपासणी व औषधोपचार (Rx)',
      patientLabel: 'रुग्ण',
      refLabel: 'संदर्भ क्र.',
      clinicalDiagnosis: 'रोगनिदान (Clinical Diagnosis) *',
      treatmentPlan: 'उपचार योजना व वैद्यकीय निष्कर्ष',
      prescribedMeds: 'दिलेली औषधे (Rx)',
      addMedPlaceholder: 'औषध जोडा (उदा. Tab Labetalol 100mg BD)...',
      add: 'जोडा',
      docAdvice: 'डॉक्टरांचा सल्ला व धोक्याचे इशारे',
      assignFollowUp: 'गावच्या आशा सेविकेला गृहभेटीचे फॉलो-अप काम द्या',
      followUpCategory: 'फॉलो-अप प्रकार',
      maternal: 'माता आरोग्य (ANC/PNC)',
      chronic: 'जुनाट आजार (NCD - BP/मधुमेह)',
      child: 'बाल आरोग्य (Pediatric)',
      postReferral: 'रेफरल नंतरची तपासणी',
      dueDate: 'मुदत तारीख (Due Date)',
      ashaInstructions: 'आशा सेविकेसाठी सूचना:',
      cancel: 'रद्द करा',
      finalizeAndDispatch: 'तपासणी पूर्ण करा व काम पाठवा'
    }
  }[language];

  const [sortByUrgency, setSortByUrgency] = useState<boolean>(true);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(() => {
    return referrals.find(r => r.status === 'Created' || r.status === 'Accepted') || referrals[0] || null;
  });
  const [showOutcomeModal, setShowOutcomeModal] = useState<boolean>(false);
  const [showTimelinePatient, setShowTimelinePatient] = useState<Patient | null>(null);

  // Consultation Outcome Form State
  const [doctorDiagnosis, setDoctorDiagnosis] = useState('Gestational Hypertension at 28 Weeks (High Risk ANC)');
  const [doctorTreatmentPlan, setDoctorTreatmentPlan] = useState('Initiate oral antihypertensives, strict bed rest, daily kick counts, urine albumin monitoring.');
  const [prescribedMeds, setPrescribedMeds] = useState<string[]>([
    'Tab Labetalol 100mg BD (Post Meals)',
    'Tab Calcium 500mg OD',
    'Tab Folic Acid + Iron 100mg OD'
  ]);
  const [newMedInput, setNewMedInput] = useState('');
  const [doctorAdvice, setDoctorAdvice] = useState('Immediate emergency visit if severe headache, blurred vision, or epigastric pain occurs.');
  
  // Follow-up Assignment State
  const [assignFollowUpChecked, setAssignFollowUpChecked] = useState<boolean>(true);
  const [followUpType, setFollowUpType] = useState<FollowUpType>('maternal');
  const [followUpDueDate, setFollowUpDueDate] = useState<string>(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [followUpInstructions, setFollowUpInstructions] = useState(
    'Check Blood Pressure with digital cuff. Verify patient is taking Labetalol 100mg BD regularly. Inspect for worsening pedal edema.'
  );

  // Sort referrals by urgency
  const urgencyWeight = { emergency: 4, high: 3, medium: 2, low: 1 };
  const sortedReferrals = [...referrals].sort((a, b) => {
    if (sortByUrgency) {
      return (urgencyWeight[b.urgency] || 0) - (urgencyWeight[a.urgency] || 0);
    }
    return 0;
  });

  const currentPatient = selectedReferral
    ? patients.find(p => p.id === selectedReferral.patientId)
    : null;

  const handleAddMed = () => {
    if (!newMedInput.trim()) return;
    setPrescribedMeds(prev => [...prev, newMedInput.trim()]);
    setNewMedInput('');
  };

  const handleRemoveMed = (idx: number) => {
    setPrescribedMeds(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAcceptCase = () => {
    if (!selectedReferral) return;
    acceptReferral(selectedReferral.id, 'Dr. Rajesh Kulkarni (Medical Officer)');
  };

  const handleSaveConsultationOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReferral) return;

    recordConsultationOutcome(
      selectedReferral.id,
      {
        doctorName: 'Dr. Rajesh Kulkarni (Medical Officer)',
        diagnosis: doctorDiagnosis,
        treatmentPlan: doctorTreatmentPlan,
        prescribedMedicines: prescribedMeds,
        advice: doctorAdvice
      },
      assignFollowUpChecked
        ? {
            type: followUpType,
            dueDate: followUpDueDate,
            instructions: followUpInstructions,
            assignedToAshaName: currentPatient?.linkedAshaName || 'Sunita Bai'
          }
        : undefined
    );

    setShowOutcomeModal(false);
    // Advances to step 3 in SIH continuity of care demo
    setDemoStep(3);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Doctor Info */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-800 text-teal-100 flex items-center justify-center font-bold text-xl shadow-md">
            RK
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {loc.docTitle}
              </h2>
              <span className="bg-teal-100 text-teal-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {loc.degree}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {loc.facility}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSortByUrgency(!sortByUrgency)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              sortByUrgency
                ? 'bg-teal-50 border-teal-300 text-teal-900'
                : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{loc.sortByUrgency} {sortByUrgency ? loc.highToLow : loc.normal}</span>
          </button>
        </div>
      </div>

      {/* Grid: Referral Queue (Left) & Deep Patient Case View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Referral Queue List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Hospital className="w-4 h-4 text-teal-700" />
              <span>{loc.incomingReferrals}</span>
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {referrals.length} {loc.cases}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {sortedReferrals.map(ref => {
              const isSelected = selectedReferral?.id === ref.id;
              return (
                <div
                  key={ref.id}
                  onClick={() => setSelectedReferral(ref)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-teal-50/90 border-teal-600 ring-1 ring-teal-600/40 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                        ref.urgency === 'emergency' ? 'bg-rose-600 text-white' :
                        ref.urgency === 'high' ? 'bg-amber-500 text-slate-950' : 'bg-teal-600 text-white'
                      }`}>
                        {ref.urgency}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{ref.patientName}</span>
                      <span className="text-xs text-slate-500 font-medium">({ref.patientAge}y, {ref.patientGender})</span>
                    </div>

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      ref.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      ref.status === 'Accepted' ? 'bg-teal-100 text-teal-800' :
                      ref.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ref.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 line-clamp-2 font-medium">
                    {ref.reason}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200/80">
                    <span>{loc.from}: <strong>{ref.fromFacility.split('(')[0]}</strong></span>
                    <span>{loc.by}: {ref.referredByName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Details & Clinical Action Panel (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedReferral ? (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
              {/* Top Case Action Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 text-white rounded-xl">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold bg-teal-800 text-teal-100 px-2 py-0.5 rounded">
                      #{selectedReferral.id}
                    </span>
                    <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${
                      selectedReferral.urgency === 'emergency' ? 'bg-rose-600 text-white' :
                      selectedReferral.urgency === 'high' ? 'bg-amber-500 text-slate-950' : 'bg-teal-600 text-white'
                    }`}>
                      {selectedReferral.urgency} {loc.urgencyLabel}
                    </span>
                    <span className="text-xs text-slate-300">{loc.status}: <strong>{selectedReferral.status}</strong></span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {selectedReferral.patientName} ({selectedReferral.patientAge}y, {selectedReferral.patientGender})
                  </h3>
                  <div className="text-xs text-slate-300">
                    {loc.village}: {selectedReferral.patientVillage} &bull; {loc.referredFrom}: {selectedReferral.fromFacility}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentPatient && (
                    <button
                      onClick={() => setActiveTeleconsultPatient(currentPatient)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{loc.teleconsult}</span>
                    </button>
                  )}

                  {currentPatient && (
                    <button
                      onClick={() => setShowTimelinePatient(currentPatient)}
                      className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Activity className="w-3.5 h-3.5 text-teal-400" />
                      <span>{loc.timeline}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Referral Reason & Clinical Summary */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>{loc.referralTriggerTitle}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {selectedReferral.reason}
                </p>
                {selectedReferral.clinicalSummary && (
                  <p className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-amber-200/60">
                    {selectedReferral.clinicalSummary}
                  </p>
                )}
                <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                  <span>{loc.referredBy}: <strong>{selectedReferral.referredByName} ({selectedReferral.referredByRole.toUpperCase()})</strong></span>
                  <span>{loc.date}: {selectedReferral.createdAt}</span>
                </div>
              </div>

              {/* Patient Vitals & Medical History Card */}
              {currentPatient && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {loc.vitalsSection}
                  </div>

                  {currentPatient.lastVitals && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">{loc.bp}</span>
                        <strong className="text-rose-700 text-sm font-extrabold">
                          {currentPatient.lastVitals.bpSystolic}/{currentPatient.lastVitals.bpDiastolic}
                        </strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">{loc.oxygen}</span>
                        <strong className="text-emerald-700 text-sm font-extrabold">
                          {currentPatient.lastVitals.spO2 || 98}%
                        </strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">{loc.temp}</span>
                        <strong className="text-slate-900 text-sm font-extrabold">
                          {currentPatient.lastVitals.temperature || 98.6}°F
                        </strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">{loc.pulse}</span>
                        <strong className="text-slate-900 text-sm font-extrabold">
                          {currentPatient.lastVitals.pulse || 80} bpm
                        </strong>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-900">{loc.pastHistory}: </span>
                    {currentPatient.medicalHistory || loc.noPriorHistory}
                  </div>
                </div>
              )}

              {/* Teleconsultation Video Launch Banner with Real Photo */}
              <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-4 text-white border border-teal-800/40 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md">
                    <img
                      src={doctorTeleImg}
                      alt="Doctor Teleconsultation"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                    <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border border-slate-900 animate-pulse"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold bg-teal-500/30 text-teal-300 px-2 py-0.5 rounded-full uppercase tracking-wider border border-teal-400/30">
                        {loc.esanjeevaniBadge}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        {loc.subcentreOnline}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-white mt-1">
                      {loc.startTeleconsultWith} {selectedReferral.patientName}
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      {loc.liveConnectionAssisted}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (currentPatient) {
                      setActiveTeleconsultPatient(currentPatient);
                    }
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md shrink-0 hover:scale-105 active:scale-95"
                >
                  <Video className="w-4 h-4" />
                  <span>{loc.launchTeleconsult}</span>
                </button>
              </div>

              {/* Action Buttons: Accept Referral & Record Outcome */}
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                {selectedReferral.status === 'Created' && (
                  <button
                    onClick={handleAcceptCase}
                    className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm py-3 px-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-xs"
                  >
                    <CheckCircle className="w-4 h-4 text-teal-200" />
                    <span>{loc.acceptCase}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (selectedReferral.status === 'Created') {
                      handleAcceptCase();
                    }
                    setShowOutcomeModal(true);
                  }}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm py-3 px-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-md"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>
                    {selectedReferral.status === 'Completed' ? loc.viewUpdateOutcome : loc.recordOutcome}
                  </span>
                </button>
              </div>

              {/* If Completed, show previous outcome */}
              {selectedReferral.consultationOutcome && (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                    <span>{loc.consultationOutcomeRecorded} ({selectedReferral.consultationOutcome.doctorName})</span>
                    <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">{loc.completed}</span>
                  </div>
                  <div className="text-xs text-emerald-900">
                    <strong>{loc.diagnosis}:</strong> {selectedReferral.consultationOutcome.diagnosis}
                  </div>
                  <div className="text-xs text-slate-700">
                    <strong>{loc.treatment}:</strong> {selectedReferral.consultationOutcome.treatmentPlan}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedReferral.consultationOutcome.prescribedMedicines.map((m, i) => (
                      <span key={i} className="bg-white border border-emerald-300 text-emerald-800 text-[11px] font-medium px-2 py-0.5 rounded flex items-center space-x-1">
                        <Pill className="w-2.5 h-2.5" />
                        <span>{m}</span>
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-emerald-800 italic">
                    <strong>{loc.advice}:</strong> {selectedReferral.consultationOutcome.advice}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
              {loc.noReferralSelected}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Record Consultation Outcome, Rx, and Assign ASHA Follow-up */}
      {showOutcomeModal && selectedReferral && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="bg-teal-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">{loc.modalTitle}</h3>
                <p className="text-xs text-teal-200">{loc.patientLabel}: {selectedReferral.patientName} &bull; {loc.refLabel}{selectedReferral.id}</p>
              </div>
              <button onClick={() => setShowOutcomeModal(false)} className="text-teal-300 hover:text-white text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConsultationOutcome} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div>
                <label className="font-bold text-slate-800 block mb-1">{loc.clinicalDiagnosis}</label>
                <input
                  type="text"
                  required
                  value={doctorDiagnosis}
                  onChange={e => setDoctorDiagnosis(e.target.value)}
                  placeholder="e.g. Gestational Hypertension 28wks ANC"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">{loc.treatmentPlan}</label>
                <textarea
                  value={doctorTreatmentPlan}
                  onChange={e => setDoctorTreatmentPlan(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              {/* Prescribed Medicines Builder */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">{loc.prescribedMeds}</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newMedInput}
                    onChange={e => setNewMedInput(e.target.value)}
                    placeholder={loc.addMedPlaceholder}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddMed}
                    className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{loc.add}</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {prescribedMeds.map((med, idx) => (
                    <span key={idx} className="bg-teal-50 border border-teal-300 text-teal-900 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1.5">
                      <Pill className="w-3 h-3 text-teal-600" />
                      <span>{med}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMed(idx)}
                        className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">{loc.docAdvice}</label>
                <input
                  type="text"
                  value={doctorAdvice}
                  onChange={e => setDoctorAdvice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              {/* Crucial Section: Assign Home Follow-Up to Village ASHA */}
              <div className="bg-amber-50/80 border-2 border-amber-300 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="followupCheck"
                    checked={assignFollowUpChecked}
                    onChange={e => setAssignFollowUpChecked(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="followupCheck" className="font-bold text-amber-950 text-xs cursor-pointer flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{loc.assignFollowUp} ({currentPatient?.linkedAshaName || 'Sunita Bai'})</span>
                  </label>
                </div>

                {assignFollowUpChecked && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">{loc.followUpCategory}</label>
                      <select
                        value={followUpType}
                        onChange={e => setFollowUpType(e.target.value as FollowUpType)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                      >
                        <option value="maternal">{loc.maternal}</option>
                        <option value="chronic">{loc.chronic}</option>
                        <option value="child">{loc.child}</option>
                        <option value="post-referral">{loc.postReferral}</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">{loc.dueDate}</label>
                      <input
                        type="date"
                        value={followUpDueDate}
                        onChange={e => setFollowUpDueDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">{loc.ashaInstructions}</label>
                      <textarea
                        value={followUpInstructions}
                        onChange={e => setFollowUpInstructions(e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowOutcomeModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  {loc.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <CheckCircle className="w-4 h-4 text-teal-200" />
                  <span>{loc.finalizeAndDispatch}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTimelinePatient && (
        <PatientTimelineModal
          patient={showTimelinePatient}
          onClose={() => setShowTimelinePatient(null)}
        />
      )}
    </div>
  );
};
