import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import {
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  Activity,
  User,
  ArrowRight,
  Sparkles,
  FileText,
  Pill,
  Hospital,
  ChevronRight,
  Lock,
  Unlock,
  AlertTriangle,
  Mic,
  Phone,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { PatientTimelineModal } from './PatientTimelineModal';
import patientFamilyImg from '../assets/images/patient_family_wellness_1788025804396.jpg';

export const PatientView: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    referrals,
    followUps,
    appointments,
    togglePatientConsent,
    setActiveTeleconsultPatient,
    t,
    language
  } = useHealth();

  const [showTimeline, setShowTimeline] = useState(false);

  const loc = {
    en: {
      switchCitizen: "Switch Citizen Demo:",
      fullHealthTimeline: "Full Health Timeline",
      voiceBannerTitle: "Ask Anything by Voice",
      voiceBannerSub: "Tap the microphone anytime to check medication timings, consult notes, or emergency ASHA contact.",
      emergencyHelpLine: "Emergency Help Line",
      dial108: "Dial 108 for Ambulance",
      ashaHelpline: "ASHA Helpline:",
      assignedSubcentre: "Assigned Sub-centre:",
      active: "Active",
      consentNeeded: "Consent Needed",
      revokeConsent: "Revoke Consent",
      specialistTriage: "Specialist Triage",
      consultationRx: "Consultation & Rx",
      homeFollowUp: "Home Follow-up",
      urgencyLabel: "Urgency",
      statusLabel: "Status:",
      consultResult: "Consultation Result",
      diagnosis: "Diagnosis:",
      advice: "Advice:",
      autoSyncedAbha: "Auto-synced with ABHA",
      oxygenLevel: "Oxygen Level",
      heartRate: "Heart Rate",
      bodyTemp: "Body Temp",
      knownConditions: "Known Conditions:",
      knownAllergies: "Known Allergies:",
      none: "None",
      teleconsultCall: "Teleconsult Call",
      inPersonVisit: "In-Person Visit",
      joinLiveTeleconsult: "Join Live Teleconsult",
      checkup: "Checkup",
      due: "Due:",
      asha: "ASHA:",
      nationalAmbulance: "National Ambulance",
      emergencyResponse247: "24x7 Emergency Response",
      call108: "Call 108",
      callAsha: "Call ASHA",
      villageAsha: "Village ASHA",
      highBpWarning: "⚠️ High (Action Required)",
      normal: "Normal",
      villageLabel: "Village",
      yearsOld: "Yrs"
    },
    hi: {
      switchCitizen: "नागरिक बदलें (डेमो):",
      fullHealthTimeline: "पूर्ण स्वास्थ्य इतिहास",
      voiceBannerTitle: "अपनी भाषा में बोलकर जानकारी लें",
      voiceBannerSub: "दवा का समय, डॉक्टर के परामर्श या आपातकालीन आशा संपर्क के लिए कभी भी माइक दबाएं।",
      emergencyHelpLine: "आपातकालीन सहायता लाइन",
      dial108: "एम्बुलेंस के लिए 108 डायल करें",
      ashaHelpline: "आशा हेल्पलाइन:",
      assignedSubcentre: "आवंटित उप-केंद्र:",
      active: "सक्रिय",
      consentNeeded: "सहमति आवश्यक",
      revokeConsent: "सहमति रद्द करें",
      specialistTriage: "विशेषज्ञ ट्राइएज",
      consultationRx: "डॉक्टर परामर्श एवं दवा",
      homeFollowUp: "गृह अनुवर्ती जांच",
      urgencyLabel: "प्राथमिकता",
      statusLabel: "स्थिति:",
      consultResult: "परामर्श परिणाम",
      diagnosis: "निदान (रोग):",
      advice: "डॉक्टर सलाह:",
      autoSyncedAbha: "आभा (ABHA) से सिंक",
      oxygenLevel: "ऑक्सीजन स्तर",
      heartRate: "हृदय गति (पल्स)",
      bodyTemp: "शरीर तापमान",
      knownConditions: "मौजूदा बीमारियाँ:",
      knownAllergies: "ज्ञात एलर्जी:",
      none: "कोई नहीं",
      teleconsultCall: "टेलीकंसल्ट वीडियो कॉल",
      inPersonVisit: "प्रत्यक्ष अस्पताल भेंट",
      joinLiveTeleconsult: "टेलीकंसल्ट में जुड़ें",
      checkup: "जांच",
      due: "देय तारीख:",
      asha: "आशा सेविका:",
      nationalAmbulance: "राष्ट्रीय एम्बुलेंस सेवा",
      emergencyResponse247: "२४ घंटे आपातकालीन सेवा",
      call108: "१०८ डायल करें",
      callAsha: "आशा को कॉल करें",
      villageAsha: "गाँव आशा कार्यकर्ता",
      highBpWarning: "⚠️ उच्च रक्तचाप (तत्काल ध्यान दें)",
      normal: "सामान्य",
      villageLabel: "गाँव",
      yearsOld: "वर्ष"
    },
    mr: {
      switchCitizen: "नागरिक निवडा (डेमो):",
      fullHealthTimeline: "संपूर्ण आरोग्य इतिहास",
      voiceBannerTitle: "आपल्या भाषेत विचारून माहिती मिळवा",
      voiceBannerSub: "औषधांच्या वेळा, डॉक्टरांचा सल्ला किंवा तातडीच्या आशा सेविकेच्या संपर्कासाठी केव्हाही माइक टॅप करा.",
      emergencyHelpLine: "तातडीची मदत लाइन",
      dial108: "रुग्णवाहिकेसाठी १०८ डायल करा",
      ashaHelpline: "आशा हेल्पलाइन:",
      assignedSubcentre: "नेमून दिलेले उपकेंद्र:",
      active: "सक्रिय",
      consentNeeded: "संमती आवश्यक",
      revokeConsent: "संमती मागे घ्या",
      specialistTriage: "तज्ज्ञ ट्रायज",
      consultationRx: "डॉक्टर तपासणी व औषधे",
      homeFollowUp: "गृह पाठपुरावा",
      urgencyLabel: "प्राधान्य",
      statusLabel: "स्थिती:",
      consultResult: "तपासणी निकाल",
      diagnosis: "निदान:",
      advice: "वैद्यकीय सल्ला:",
      autoSyncedAbha: "आभा (ABHA) शी जोडलेले",
      oxygenLevel: "ऑक्सिजन पातळी",
      heartRate: "हृदयाचे ठोके",
      bodyTemp: "शरीराचे तापमान",
      knownConditions: "असलेले आजार:",
      knownAllergies: "माहिती असलेल्या ॲलर्जी:",
      none: "काही नाही",
      teleconsultCall: "टेलिकन्सल्ट व्हिडीओ कॉल",
      inPersonVisit: "प्रत्यक्ष भेट",
      joinLiveTeleconsult: "टेलिकन्सल्ट सुरू करा",
      checkup: "तपासणी",
      due: "तारीख:",
      asha: "आशा सेविका:",
      nationalAmbulance: "राष्ट्रीय रुग्णवाहिका सेवा",
      emergencyResponse247: "२४ तास तातडीची सेवा",
      call108: "१०८ कॉल करा",
      callAsha: "आशा सेविकेला कॉल",
      villageAsha: "गाव आशा सेविका",
      highBpWarning: "⚠️ उच्च रक्तदाब (तातडीने लक्ष द्या)",
      normal: "सामान्य",
      villageLabel: "गाव",
      yearsOld: "वर्षे"
    }
  }[language as 'en' | 'hi' | 'mr'] || {
    switchCitizen: "Switch Citizen Demo:",
    fullHealthTimeline: "Full Health Timeline",
    voiceBannerTitle: "Ask Anything by Voice",
    voiceBannerSub: "Tap the microphone anytime to check medication timings, consult notes, or emergency ASHA contact.",
    emergencyHelpLine: "Emergency Help Line",
    dial108: "Dial 108 for Ambulance",
    ashaHelpline: "ASHA Helpline:",
    assignedSubcentre: "Assigned Sub-centre:",
    active: "Active",
    consentNeeded: "Consent Needed",
    revokeConsent: "Revoke Consent",
    specialistTriage: "Specialist Triage",
    consultationRx: "Consultation & Rx",
    homeFollowUp: "Home Follow-up",
    urgencyLabel: "Urgency",
    statusLabel: "Status:",
    consultResult: "Consultation Result",
    diagnosis: "Diagnosis:",
    advice: "Advice:",
    autoSyncedAbha: "Auto-synced with ABHA",
    oxygenLevel: "Oxygen Level",
    heartRate: "Heart Rate",
    bodyTemp: "Body Temp",
    knownConditions: "Known Conditions:",
    knownAllergies: "Known Allergies:",
    none: "None",
    teleconsultCall: "Teleconsult Call",
    inPersonVisit: "In-Person Visit",
    joinLiveTeleconsult: "Join Live Teleconsult",
    checkup: "Checkup",
    due: "Due:",
    asha: "ASHA:",
    nationalAmbulance: "National Ambulance",
    emergencyResponse247: "24x7 Emergency Response",
    call108: "Call 108",
    callAsha: "Call ASHA",
    villageAsha: "Village ASHA",
    highBpWarning: "⚠️ High (Action Required)",
    normal: "Normal",
    villageLabel: "Village",
    yearsOld: "Yrs"
  };

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const patientReferrals = referrals.filter(r => r.patientId === currentPatient.id);
  const patientFollowUps = followUps.filter(f => f.patientId === currentPatient.id);
  const patientAppointments = appointments.filter(a => a.patientId === currentPatient.id);

  const vitals = currentPatient.lastVitals;

  return (
    <div className="space-y-6">
      {/* Patient Switcher & Quick Profile Header with ABHA Card Design */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="relative shrink-0">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${currentPatient.avatarColor} text-white flex items-center justify-center text-3xl sm:text-4xl font-extrabold shadow-md ring-4 ring-slate-50 overflow-hidden`}>
                {currentPatient.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  {t.patientPortal.welcome}
                </span>
                <span className="text-[11px] font-mono text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  ABHA: <strong>{currentPatient.abhaId}</strong>
                </span>
                {currentPatient.chronicConditions && currentPatient.chronicConditions.length > 0 && (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    {currentPatient.chronicConditions.join(', ')}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                {currentPatient.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mt-1">
                <span className="font-semibold">{currentPatient.age} {loc.yearsOld} &bull; {currentPatient.gender === 'Female' ? (language === 'hi' ? 'महिला' : language === 'mr' ? 'स्त्री' : 'Female') : (language === 'hi' ? 'पुरुष' : language === 'mr' ? 'पुरुष' : 'Male')}</span>
                <span className="text-slate-300">&bull;</span>
                <span>{loc.villageLabel}: <strong className="text-slate-800">{currentPatient.village}</strong></span>
                <span className="text-slate-300">&bull;</span>
                <span>{loc.asha}: <strong className="text-slate-800">{currentPatient.linkedAshaName}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Demo Switch Patient Selector & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-slate-50/90 p-3 rounded-2xl border border-slate-200/90 shadow-2xs w-full lg:w-auto">
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">{loc.switchCitizen}</span>
              <select
                value={selectedPatientId}
                onChange={e => setSelectedPatientId(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-teal-600 cursor-pointer shadow-2xs mt-1"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.village}, {p.age}y - {p.chronicConditions?.[0] || 'General'})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowTimeline(true)}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs hover:shadow-xs mt-auto"
            >
              <Activity className="w-4 h-4" />
              <span>{loc.fullHealthTimeline}</span>
            </button>
          </div>
        </div>

        {/* User-Friendly Visual Wellness Banner with Real Photo */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-4 text-white flex items-center gap-4 relative overflow-hidden shadow-xs">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border-2 border-white/20 shadow-md">
              <img
                src={patientFamilyImg}
                alt="Rural Family Wellness"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold bg-teal-500/30 text-teal-200 px-2 py-0.5 rounded-full border border-teal-400/30 uppercase">
                  Sanjeevani AI Voice Assistant
                </span>
                <span className="text-[10px] text-slate-300">
                  Hindi &bull; Marathi &bull; English
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-white mt-1">
                {loc.voiceBannerTitle}
              </h4>
              <p className="text-xs text-teal-100/90 mt-0.5 leading-tight">
                {loc.voiceBannerSub}
              </p>
            </div>
          </div>

          <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-rose-800 mb-1">
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  {loc.emergencyHelpLine}
                </span>
                <span className="bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full text-[10px] font-extrabold">24x7</span>
              </div>
              <p className="text-xs text-rose-950 font-bold mt-1">
                {loc.dial108}
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {loc.ashaHelpline} <strong>+91 98230 11200</strong>
              </p>
            </div>
            <div className="mt-2 text-[10px] font-semibold text-rose-700">
              {loc.assignedSubcentre} {currentPatient.village} HWC
            </div>
          </div>
        </div>
      </div>

      {/* Digital Consent Action Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-2xl p-5 text-white shadow-md border border-teal-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className={`p-2.5 rounded-xl ${currentPatient.hasGivenDigitalConsent ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'} border border-white/10 shrink-0 mt-0.5`}>
              {currentPatient.hasGivenDigitalConsent ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  {t.patientPortal.digitalConsentTitle}
                </h3>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  currentPatient.hasGivenDigitalConsent ? 'bg-emerald-500 text-slate-950' : 'bg-amber-400 text-slate-950'
                }`}>
                  {currentPatient.hasGivenDigitalConsent ? loc.active : loc.consentNeeded}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
                {t.patientPortal.digitalConsentDesc}
              </p>
            </div>
          </div>

          <button
            onClick={() => togglePatientConsent(currentPatient.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-md ${
              currentPatient.hasGivenDigitalConsent
                ? 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold'
            }`}
          >
            {currentPatient.hasGivenDigitalConsent ? loc.revokeConsent : t.patientPortal.giveConsent}
          </button>
        </div>
      </div>

      {/* Grid: Referral Progress Tracker & Upcoming Care */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Tracker (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Hospital className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.patientPortal.myReferralJourney}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {patientReferrals.length} {t.common.all}
              </span>
            </div>

            {patientReferrals.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                {t.patientPortal.noActiveReferrals}
              </div>
            ) : (
              <div className="space-y-6">
                {patientReferrals.map(ref => {
                  const getStepState = (stepIndex: number) => {
                    const statusOrder = ['Created', 'Accepted', 'In Progress', 'Completed'];
                    const currentIdx = statusOrder.indexOf(ref.status);
                    if (currentIdx > stepIndex) return 'done';
                    if (currentIdx === stepIndex) return 'active';
                    return 'pending';
                  };

                  const steps = [
                    { label: t.patientPortal.stepSubCentre, sub: ref.fromFacility },
                    { label: loc.specialistTriage, sub: ref.toFacility },
                    { label: loc.consultationRx, sub: ref.acceptedByName || (language === 'hi' ? 'ड्यूटी डॉक्टर' : language === 'mr' ? 'कर्तव्यदक्ष डॉक्टर' : 'Doctor On-Duty') },
                    { label: t.patientPortal.stepResolved, sub: loc.homeFollowUp }
                  ];

                  return (
                    <div key={ref.id} className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                            #{ref.id}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            ref.urgency === 'emergency' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                            ref.urgency === 'high' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            'bg-teal-100 text-teal-800 border-teal-300'
                          }`}>
                            {ref.urgency.toUpperCase()} {loc.urgencyLabel}
                          </span>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          ref.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          ref.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800' :
                          ref.status === 'Accepted' ? 'bg-teal-100 text-teal-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {loc.statusLabel} {ref.status}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-900 mb-4">
                        {ref.reason}
                      </p>

                      {/* Visual Multi-step Tracker */}
                      <div className="relative my-4">
                        <div className="grid grid-cols-4 gap-2">
                          {steps.map((step, sIdx) => {
                            const state = getStepState(sIdx);
                            return (
                              <div key={sIdx} className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition-colors ${
                                  state === 'done' ? 'bg-emerald-600 text-white shadow-xs' :
                                  state === 'active' ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 font-extrabold animate-pulse' :
                                  'bg-slate-200 text-slate-500'
                                }`}>
                                  {state === 'done' ? <CheckCircle2 className="w-4 h-4" /> : sIdx + 1}
                                </div>
                                <span className="text-[11px] font-bold text-slate-800 leading-tight">
                                  {step.label}
                                </span>
                                <span className="text-[10px] text-slate-500 line-clamp-1">
                                  {step.sub}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* If Consultation Completed Outcome Available */}
                      {ref.consultationOutcome && (
                        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                          <div className="text-xs font-bold text-emerald-950 mb-1 flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{loc.consultResult} ({ref.consultationOutcome.doctorName})</span>
                          </div>
                          <p className="text-xs text-slate-700">
                            <strong>{loc.diagnosis}</strong> {ref.consultationOutcome.diagnosis}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {ref.consultationOutcome.prescribedMedicines.map((med, mIdx) => (
                              <span key={mIdx} className="bg-white border border-emerald-300 text-emerald-800 text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center space-x-1">
                                <Pill className="w-2.5 h-2.5" />
                                <span>{med}</span>
                              </span>
                            ))}
                          </div>
                          <p className="text-[11px] text-emerald-800 mt-1.5 italic">
                            <strong>{loc.advice}</strong> {ref.consultationOutcome.advice}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Simplified Health Summary Passport */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.patientPortal.healthPassport}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">{loc.autoSyncedAbha}</span>
            </div>

            {vitals && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-rose-700">{t.common.bloodPressure}</div>
                  <div className="text-lg font-extrabold text-rose-950 mt-0.5">
                    {vitals.bpSystolic}/{vitals.bpDiastolic} <span className="text-xs font-normal">mmHg</span>
                  </div>
                  <div className="text-[10px] text-rose-600 font-medium">
                    {vitals.bpSystolic && vitals.bpSystolic >= 140 ? loc.highBpWarning : loc.normal}
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-emerald-700">{t.common.spO2}</div>
                  <div className="text-lg font-extrabold text-emerald-950 mt-0.5">
                    {vitals.spO2 || 98}%
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">{loc.oxygenLevel}</div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-amber-700">{t.common.pulseRate}</div>
                  <div className="text-lg font-extrabold text-amber-950 mt-0.5">
                    {vitals.pulse || 80} <span className="text-xs font-normal">bpm</span>
                  </div>
                  <div className="text-[10px] text-amber-600 font-medium">{loc.heartRate}</div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                  <div className="text-[11px] font-bold text-indigo-700">{t.common.temperature}</div>
                  <div className="text-lg font-extrabold text-indigo-950 mt-0.5">
                    {vitals.temperature || 98.6}°F
                  </div>
                  <div className="text-[10px] text-indigo-600 font-medium">{loc.bodyTemp}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">{loc.knownConditions}</span>
                <div className="flex flex-wrap gap-1">
                  {currentPatient.chronicConditions?.map((c, i) => (
                    <span key={i} className="bg-teal-100 text-teal-900 px-2 py-0.5 rounded font-medium">
                      {c}
                    </span>
                  )) || <span className="text-slate-500">{loc.none}</span>}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">{loc.knownAllergies}</span>
                <div className="flex flex-wrap gap-1">
                  {currentPatient.allergies?.map((a, i) => (
                    <span key={i} className="bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-medium">
                      {a}
                    </span>
                  )) || <span className="text-slate-500">{loc.none}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Appointments, Follow-ups, Helpline */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.patientPortal.upcomingAppointments}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-bold">{patientAppointments.length}</span>
            </div>

            {patientAppointments.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4 bg-slate-50 rounded-xl">
                {t.patientPortal.noAppointments}
              </div>
            ) : (
              <div className="space-y-3">
                {patientAppointments.map(apt => (
                  <div key={apt.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        apt.type === 'teleconsult' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {apt.type === 'teleconsult' ? loc.teleconsultCall : loc.inPersonVisit}
                      </span>
                      <span className="text-xs text-slate-600 font-semibold">{apt.time}</span>
                    </div>

                    <div className="text-xs font-bold text-slate-900">{apt.providerName}</div>
                    <div className="text-[11px] text-slate-600">{apt.facilityName}</div>
                    <div className="text-[11px] text-slate-500 italic">{apt.purpose}</div>

                    {apt.type === 'teleconsult' && (
                      <button
                        onClick={() => setActiveTeleconsultPatient(currentPatient)}
                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        <span>{loc.joinLiveTeleconsult}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Follow-up Reminders (Home Visits) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t.patientPortal.followUpTasks}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-bold">{patientFollowUps.length}</span>
            </div>

            <div className="space-y-2.5">
              {patientFollowUps.map(fol => (
                <div key={fol.id} className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-950 uppercase text-[11px]">
                      {fol.type} {loc.checkup}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      fol.status === 'completed' ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {fol.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-800 font-medium text-[11px] mb-1.5">
                    {fol.instructions}
                  </p>
                  <div className="text-[10px] text-slate-600 flex items-center justify-between pt-1 border-t border-amber-200/60">
                    <span>{loc.due} <strong>{fol.dueDate}</strong></span>
                    <span>{loc.asha} <strong>{fol.assignedToAshaName}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Helpline Contacts */}
          <div className="bg-rose-900 text-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-rose-300" />
              <h3 className="text-sm font-bold">{t.patientPortal.emergencyHelp}</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="bg-rose-950/60 p-2.5 rounded-xl flex items-center justify-between border border-rose-800">
                <div>
                  <div className="font-bold">{loc.nationalAmbulance}</div>
                  <div className="text-[10px] text-rose-200">{loc.emergencyResponse247}</div>
                </div>
                <a
                  href="tel:108"
                  className="bg-rose-500 hover:bg-rose-400 text-white font-bold px-3 py-1 rounded-lg text-xs flex items-center space-x-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{loc.call108}</span>
                </a>
              </div>

              <div className="bg-rose-950/60 p-2.5 rounded-xl flex items-center justify-between border border-rose-800">
                <div>
                  <div className="font-bold">{loc.villageAsha} ({currentPatient.linkedAshaName})</div>
                  <div className="text-[10px] text-rose-200">{currentPatient.linkedAshaPhone}</div>
                </div>
                <a
                  href={`tel:${currentPatient.linkedAshaPhone}`}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1 rounded-lg text-xs flex items-center space-x-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>{loc.callAsha}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTimeline && (
        <PatientTimelineModal
          patient={currentPatient}
          onClose={() => setShowTimeline(false)}
        />
      )}
    </div>
  );
};
