import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Patient, Vitals, TriagePriority, FollowUp } from '../types';
import { calculateTriage } from '../utils/triage';
import {
  Search,
  UserPlus,
  HeartPulse,
  ClipboardList,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  WifiOff,
  RefreshCw,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  Activity,
  Send,
  X,
  FileCheck,
  UserCheck,
  Mic,
  ShieldCheck,
  Zap,
  Heart
} from 'lucide-react';
import { PatientTimelineModal } from './PatientTimelineModal';
import ashaCareImg from '../assets/images/asha_worker_care_1788025776530.jpg';

export const AshaView: React.FC = () => {
  const {
    patients,
    addPatient,
    recordEncounter,
    createReferral,
    followUps,
    completeFollowUp,
    referrals,
    isOffline,
    pendingOfflineSyncCount,
    syncOfflineQueue,
    t,
    language,
    setDemoStep
  } = useHealth();

  const loc = {
    ashaTitle: language === 'hi' ? 'सुनीता बाई • आशा सेविका' : language === 'mr' ? 'सुनीता बाई • आशा कार्यकर्ती' : 'Sunita Bai • ASHA Frontline Worker',
    activeDuty: language === 'hi' ? 'सक्रिय सेवा' : language === 'mr' ? 'सक्रिय कर्तव्य' : 'Active Duty',
    assignedArea: language === 'hi' ? 'नियुक्त क्षेत्र: रामपुर गाँव और उपकेंद्र क्षेत्र (जनसंख्या: 1,420 • 24 एएनसी माताएं)' : language === 'mr' ? 'नियुक्त क्षेत्र: रामपुर गाव आणि उपकेंद्र क्षेत्र (लोकसंख्या: 1,420 • 24 गरोदर माता)' : 'Assigned Area: Rampur Village & Sub-centre Area (Population: 1,420 • 24 ANC Mothers)',
    offlineMode: language === 'hi' ? `ऑफलाइन मोड (${pendingOfflineSyncCount} स्थानीय रूप से सहेजा गया)` : language === 'mr' ? `ऑफलाइन मोड (${pendingOfflineSyncCount} स्थानिक पातळीवर साठवले)` : `Offline Mode (${pendingOfflineSyncCount} stored locally)`,
    liveSynced: language === 'hi' ? 'सर्वर से लाइव सिंक' : language === 'mr' ? 'सर्व्हरसह थेट सिंक' : 'Live Synced to Server',
    bannerTag: language === 'hi' ? 'घर-घर निरंतर स्वास्थ्य सेवा' : language === 'mr' ? 'घरोघरी सातत्यपूर्ण आरोग्य सेवा' : 'Door-to-Door Care Continuity',
    bannerOffline: language === 'hi' ? '⚡ 100% ऑफ़लाइन सक्षम' : language === 'mr' ? '⚡ १००% ऑफलाइन सक्षम' : '⚡ 100% Offline Capable',
    bannerTitle: language === 'hi' ? 'क्षेत्रीय जाँच, मातृ देखभाल और स्वचालित डॉक्टर रेफरल' : language === 'mr' ? 'क्षेत्रीय तपासणी, माता काळजी आणि स्वयंचलित डॉक्टर संदर्भ' : 'Field Encounter, Maternal Care & Automated Doctor Referrals',
    bannerDesc: language === 'hi' ? 'आवाज या मैनुअल रूप से वाइटल्स दर्ज करें। कोई भी उच्च-जोखिम संकेतक चांदूर पीएचसी के चिकित्सा अधिकारी को तुरंत अलर्ट करता है।' : language === 'mr' ? 'आवाजाने किंवा हाताने जीवनमान नोंदी करा. कोणताही धोकादायक घटक चांदूर प्राथमिक केंद्राच्या वैद्यकीय अधिकाऱ्यांना तत्काळ कळवतो.' : 'Record vitals using speech or manual entry. Any high-risk indicator automatically alerts the Medical Officer at Chandur PHC.',
    fieldProgressToday: language === 'hi' ? 'आज की क्षेत्रीय प्रगति' : language === 'mr' ? 'आजची क्षेत्रीय प्रगती' : 'Field Progress Today',
    completed: language === 'hi' ? 'पूर्ण' : language === 'mr' ? 'पूर्ण' : 'Completed',
    pendingVisits: language === 'hi' ? 'लंबित दौरे: उच्च-जोखिम एएनसी और उच्च रक्तचाप जांच।' : language === 'mr' ? 'प्रलंबित भेटी: अतिधोकादायक गरोदर माता व रक्तदाब तपासणी.' : 'pending visits: High-risk ANC & hypertension compliance check.',
    viewTaskChecklist: language === 'hi' ? 'कार्य सूची देखें' : language === 'mr' ? 'कामांची यादी पहा' : 'View Task Checklist',
    tabRecord: language === 'hi' ? 'जाँच व ऑटो-ट्राइएज दर्ज करें' : language === 'mr' ? 'तपासणी व ऑटो-ट्राइएज नोंदवा' : 'Record Encounter & Auto-Triage',
    tabTasks: language === 'hi' ? 'गृह दौरे' : language === 'mr' ? 'गृहभेटी' : 'Home Follow-ups',
    tabReferrals: language === 'hi' ? 'रेफरल ट्रैकिंग' : language === 'mr' ? 'रेफरल ट्रॅकिंग' : 'Referral Tracking',
    pending: language === 'hi' ? 'लंबित' : language === 'mr' ? 'प्रलंबित' : 'Pending',
    selectCitizen: language === 'hi' ? 'गाँव का नागरिक चुनें' : language === 'mr' ? 'गावातील नागरिक निवडा' : 'Select Village Citizen',
    found: language === 'hi' ? 'मिले' : language === 'mr' ? 'सापडले' : 'found',
    viewPastVisits: language === 'hi' ? 'पिछली यात्राएं देखें' : language === 'mr' ? 'मागील भेटी पहा' : 'View Past Visits',
    vitalsSectionTitle: language === 'hi' ? '1. मरीज के वाइटल्स दर्ज करें (स्वतः जोखिम पहचान के साथ)' : language === 'mr' ? '१. रुग्णाचे जीवनमान (वाइटल्स) नोंदवा (जोखीम ओळखीसह)' : '1. Record Patient Physical Vitals (With Threshold Auto-Detection)',
    systolicBp: language === 'hi' ? 'सिस्टोलिक बीपी (mmHg)' : language === 'mr' ? 'सिस्टोलिक बीपी (mmHg)' : 'Systolic BP (mmHg)',
    diastolicBp: language === 'hi' ? 'डायस्टोलिक बीपी (mmHg)' : language === 'mr' ? 'डायस्टोलिक बीपी (mmHg)' : 'Diastolic BP (mmHg)',
    oxygenSpo2: language === 'hi' ? 'ऑक्सीजन SpO2 (%)' : language === 'mr' ? 'ऑक्सिजन SpO2 (%)' : 'Oxygen SpO2 (%)',
    bodyTemp: language === 'hi' ? 'शरीर का तापमान (°F)' : language === 'mr' ? 'शरीराचे तापमान (°F)' : 'Body Temp (°F)',
    pulseRate: language === 'hi' ? 'नाड़ी गति (bpm)' : language === 'mr' ? 'नाडीचे ठोके (bpm)' : 'Pulse Rate (bpm)',
    weight: language === 'hi' ? 'वजन (किग्रा)' : language === 'mr' ? 'वजन (किलो)' : 'Weight (kg)',
    highRisk: language === 'hi' ? 'उच्च जोखिम' : language === 'mr' ? 'अतिजोखीम' : 'High Risk',
    hypoxia: language === 'hi' ? 'ऑक्सीजन की कमी' : language === 'mr' ? 'ऑक्सिजनची कमतरता' : 'Hypoxia',
    highFever: language === 'hi' ? 'तेज बुखार' : language === 'mr' ? 'तीव्र ताप' : 'High Fever',
    normal: language === 'hi' ? 'सामान्य' : language === 'mr' ? 'सामान्य' : 'Normal',
    maternalChild: language === 'hi' ? 'मातृ / शिशु के लिए' : language === 'mr' ? 'माता / बालकांसाठी' : 'For Maternal/Child',
    symptomsTitle: language === 'hi' ? '2. बताए गए लक्षण चुनें' : language === 'mr' ? '२. आढळलेली लक्षणे निवडा' : '2. Select Reported Symptoms',
    fieldNotesPlaceholder: language === 'hi' ? 'मरीज की स्थिति पर अतिरिक्त फ़ील्ड नोट्स...' : language === 'mr' ? 'रुग्णाच्या स्थितीबद्दल अतिरिक्त नोंदी...' : 'Additional field notes on patient condition...',
    automatedTriage: language === 'hi' ? 'स्वचालित ट्राइएज:' : language === 'mr' ? 'स्वयंचलित ट्राइएज:' : 'Automated Triage:',
    priorityLevel: language === 'hi' ? 'प्राथमिकता स्तर' : language === 'mr' ? 'प्राधान्य पातळी' : 'Priority Level',
    ruleBasedAi: language === 'hi' ? 'नियम-आधारित एआई' : language === 'mr' ? 'नियम-आधारित एआय' : 'Rule-Based AI',
    detectedFlags: language === 'hi' ? 'पाए गए नैदानिक संकेत:' : language === 'mr' ? 'आढळलेली वैद्यकीय लक्षणे:' : 'Detected Clinical Flags:',
    recommendedFacility: language === 'hi' ? 'अनुशंसित केंद्र:' : language === 'mr' ? 'शिफारस केलेले केंद्र:' : 'Recommended Facility:',
    action: language === 'hi' ? 'कार्रवाई:' : language === 'mr' ? 'कृती:' : 'Action:',
    targetFacilityTitle: language === 'hi' ? '3. रेफरल हेतु लक्षित स्वास्थ्य केंद्र' : language === 'mr' ? '३. संदर्भासाठी (रेफरल) आरोग्य केंद्र' : '3. Target Facility for Linked Care Referral',
    selectFacility: language === 'hi' ? 'स्वास्थ्य केंद्र चुनें:' : language === 'mr' ? 'आरोग्य केंद्र निवडा:' : 'Select Facility:',
    referralReasonNote: language === 'hi' ? 'रेफरल कारण / टिप्पणी:' : language === 'mr' ? 'रेफरलचे कारण / टीप:' : 'Referral Reason / Note:',
    recordAndGenerateReferral: language === 'hi' ? 'जाँच दर्ज करें और रेफरल भेजें:' : language === 'mr' ? 'नोंद पूर्ण करा आणि रेफरल पाठवा:' : 'Record Encounter & Generate Referral to',
    step2Notice: language === 'hi' ? 'चरण 2: मामला तुरंत डॉक्टर / एएनएम जांच सूची में दिखाई देगा।' : language === 'mr' ? 'टप्पा २: प्रकरण तात्काळ डॉक्टर / एएनएम यांच्या तपासणी सूचीत दिसेल.' : 'Advances to Step 2: Case instantly appears in Doctor / ANM Queue for evaluation.',
    scheduledOutreachTitle: language === 'hi' ? 'अनुसूचित गृह दौरे एवं रेफरल पश्चात अनुवर्ती कार्य' : language === 'mr' ? 'नियोजित गृहभेटी आणि रेफरल-नंतरच्या पाठपुरावा फेऱ्या' : 'Scheduled Home Outreach & Post-Referral Follow-up Tasks',
    doctorAssignedDesc: language === 'hi' ? 'गाँव के मरीजों के लिए डॉक्टर द्वारा सौंपे गए चेकअप।' : language === 'mr' ? 'गावातील रुग्णांसाठी डॉक्टरांनी नेमून दिलेल्या तपासण्या.' : 'Doctor-assigned checkups for your village patients.',
    pendingActions: language === 'hi' ? 'लंबित कार्रवाइयां' : language === 'mr' ? 'प्रलंबित कृती' : 'Pending Actions',
    due: language === 'hi' ? 'नियत तारीख:' : language === 'mr' ? 'मुदत:' : 'Due:',
    village: language === 'hi' ? 'गाँव:' : language === 'mr' ? 'गाव:' : 'Village:',
    phone: language === 'hi' ? 'फ़ोन:' : language === 'mr' ? 'फोन:' : 'Phone:',
    doctorInstructions: language === 'hi' ? 'डॉक्टर के निर्देश:' : language === 'mr' ? 'डॉक्टरांच्या सूचना:' : 'Doctor Instructions:',
    assignedBy: language === 'hi' ? 'द्वारा सौंपा गया:' : language === 'mr' ? 'नेमून दिले:' : 'Assigned by:',
    markDone: language === 'hi' ? 'पूर्ण चिह्नित करें (लूप पूरा)' : language === 'mr' ? 'पूर्ण नोंद करा (लूप पूर्ण)' : 'Mark Done (Complete Loop)',
    noPendingTasks: language === 'hi' ? 'वर्तमान में कोई लंबित अनुवर्ती कार्य नहीं है!' : language === 'mr' ? 'सध्या कोणतीही प्रलंबित गृहभेट नाही!' : 'No pending follow-up tasks currently assigned!',
    recentlyCompletedTitle: language === 'hi' ? 'हाल ही में पूर्ण किए गए गृह दौरे' : language === 'mr' ? 'नुकत्याच पूर्ण झालेल्या गृहभेटी' : 'Recently Completed Follow-up Visits',
    completedOn: language === 'hi' ? 'पूर्ण हुआ' : language === 'mr' ? 'पूर्ण झाले' : 'Completed on',
    referralBoardTitle: language === 'hi' ? 'गाँव रेफरल ट्रैकिंग बोर्ड' : language === 'mr' ? 'गावातील रेफरल ट्रॅकिंग बोर्ड' : 'Village Referrals Tracking Board',
    realtimeStatus: language === 'hi' ? 'पीएचसी और जिला अस्पतालों में भेजे गए मरीजों की वास्तविक स्थिति।' : language === 'mr' ? 'प्राथमिक आरोग्य केंद्र व जिल्हा रुग्णालयात पाठवलेल्या रुग्णांची सद्यस्थिती.' : 'Real-time status of patients sent to PHC & District Hospitals.',
    totalCases: language === 'hi' ? 'कुल मामले' : language === 'mr' ? 'एकूण प्रकरणे' : 'Total Cases',
    registerNewTitle: language === 'hi' ? 'गाँव के नए मरीज का पंजीकरण' : language === 'mr' ? 'नवीन गावच्या रुग्णाची नोंदणी' : 'Register New Village Patient',
    fullName: language === 'hi' ? 'पूरा नाम *' : language === 'mr' ? 'पूर्ण नाव *' : 'Full Name *',
    ageYears: language === 'hi' ? 'उम्र (वर्ष) *' : language === 'mr' ? 'वय (वर्षे) *' : 'Age (Years) *',
    gender: language === 'hi' ? 'लिंग *' : language === 'mr' ? 'लिंग *' : 'Gender *',
    phoneNumber: language === 'hi' ? 'फ़ोन नंबर' : language === 'mr' ? 'फोन नंबर' : 'Phone Number',
    villageWard: language === 'hi' ? 'गाँव / वार्ड' : language === 'mr' ? 'गाव / प्रभाग' : 'Village / Ward',
    preferredLang: language === 'hi' ? 'पसंदीदा भाषा' : language === 'mr' ? 'संवादाची भाषा' : 'Preferred Language',
    knownConditions: language === 'hi' ? 'ज्ञात बीमारियां (अल्पविराम से अलग करें)' : language === 'mr' ? 'माहित असलेले आजार (स्वल्पविरामाने वेगळे करा)' : 'Known Conditions (Comma separated)',
    consentStatement: language === 'hi' ? 'मरीज ने पीएचसी और जिला अस्पताल के साथ आभा स्वास्थ्य रिकॉर्ड बनाने और साझा करने की मौखिक/डिजिटल सहमति दी।' : language === 'mr' ? 'रुग्णाने आभा आरोग्य नोंद तयार करण्यास आणि प्राथमिक केंद्र व जिल्हा रुग्णालयाशी शेअर करण्यास संमती दिली.' : 'Patient granted verbal/digital consent to create and share ABHA health record with PHC & District Hospital.',
    cancel: language === 'hi' ? 'रद्द करें' : language === 'mr' ? 'रद्द करा' : 'Cancel',
    saveOpenVitals: language === 'hi' ? 'सहेजें और वाइटल्स दर्ज करें' : language === 'mr' ? 'जतन करा आणि वाइटल्स नोंदवा' : 'Save & Open Vitals Entry',
    completeFollowupTitle: language === 'hi' ? 'गृह अनुवर्ती दौरा पूर्ण करें' : language === 'mr' ? 'गृहभेट पूर्ण झाल्याची नोंद' : 'Complete Home Follow-up Visit',
    patientNameLabel: language === 'hi' ? 'मरीज का नाम:' : language === 'mr' ? 'रुग्णाचे नाव:' : 'Patient Name:',
    assignedTaskLabel: language === 'hi' ? 'सौंपा गया कार्य:' : language === 'mr' ? 'नेमून दिलेले काम:' : 'Assigned Task:',
    ashaFieldObservations: language === 'hi' ? 'आशा क्षेत्रीय दौरे के अवलोकन व वाइटल्स:' : language === 'mr' ? 'आशा सेविकेची क्षेत्रीय तपासणी व नोंदी:' : 'ASHA Field Visit Observations & Vitals:',
    confirmVisitDone: language === 'hi' ? 'दौरा पूर्ण होने की पुष्टि करें' : language === 'mr' ? 'भेट पूर्ण झाल्याची खात्री करा' : 'Confirm Visit Completed',
    female: language === 'hi' ? 'महिला' : language === 'mr' ? 'स्त्री' : 'Female',
    male: language === 'hi' ? 'पुरुष' : language === 'mr' ? 'पुरुष' : 'Male',
    other: language === 'hi' ? 'अन्य' : language === 'mr' ? 'इतर' : 'Other'
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0]);
  const [activeTab, setActiveTab] = useState<'record' | 'tasks' | 'referrals'>('record');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showTimelinePatient, setShowTimelinePatient] = useState<Patient | null>(null);
  const [completingFollowUp, setCompletingFollowUp] = useState<FollowUp | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  // Register Form State
  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    age: 28,
    gender: 'Female' as 'Female' | 'Male' | 'Other',
    phone: '+91 ',
    village: 'Rampur',
    language: 'hi' as const,
    linkedAshaName: 'Sunita Bai',
    linkedAshaPhone: '+91 98230 11223',
    bloodGroup: 'B+',
    medicalHistory: '',
    chronicConditionsStr: '',
    hasGivenDigitalConsent: true
  });

  // Vitals & Encounter Form State
  const [vitalsForm, setVitalsForm] = useState<Vitals>({
    bpSystolic: 165,
    bpDiastolic: 102,
    temperature: 99.2,
    pulse: 88,
    spO2: 98,
    weight: 58,
    bloodSugar: undefined
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'High BP in Pregnancy',
    'Morning Headaches'
  ]);
  const [symptomNotes, setSymptomNotes] = useState('Patient complaining of severe morning headaches and swollen feet at 28 weeks ANC.');

  // Referral Sub-form
  const [referralReason, setReferralReason] = useState('Severe gestational hypertension (165/102 mmHg) & pedal edema. High Risk ANC.');
  const [targetFacility, setTargetFacility] = useState('Chandur Primary Health Centre (PHC)');
  const [targetFacilityType, setTargetFacilityType] = useState('PHC');

  const commonSymptomOptions = [
    'High BP in Pregnancy',
    'Morning Headaches',
    'Swelling in Feet / Edema',
    'High Fever > 3 Days',
    'Severe Breathlessness / Choking',
    'Chest Pain / Tightness',
    'Severe Dizziness / Fainting',
    'Loose Motions / Dehydration',
    'High Blood Sugar Symptoms'
  ];

  // Dynamic Live Triage Calculation
  const isPregnant = selectedPatient?.chronicConditions?.some(c => c.toLowerCase().includes('anc') || c.toLowerCase().includes('pregnant')) || false;
  const liveTriage = calculateTriage(vitalsForm, selectedSymptoms, isPregnant);

  // Filtered patients for ASHA search
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.abhaId?.includes(searchQuery)
  );

  // Pending tasks for ASHA Sunita Bai
  const ashaTasks = followUps.filter(f => f.assignedToAshaName.includes('Sunita') || f.assignedToAshaName.includes('ASHA'));
  const pendingTasks = ashaTasks.filter(f => f.status === 'pending');
  const completedTasks = ashaTasks.filter(f => f.status === 'completed');

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientForm.name.trim()) return;

    const created = addPatient({
      name: newPatientForm.name.trim(),
      age: Number(newPatientForm.age),
      gender: newPatientForm.gender,
      phone: newPatientForm.phone,
      village: newPatientForm.village,
      language: newPatientForm.language,
      linkedAshaName: newPatientForm.linkedAshaName,
      linkedAshaPhone: newPatientForm.linkedAshaPhone,
      bloodGroup: newPatientForm.bloodGroup,
      allergies: [],
      chronicConditions: newPatientForm.chronicConditionsStr ? newPatientForm.chronicConditionsStr.split(',').map(s => s.trim()) : [],
      medicalHistory: newPatientForm.medicalHistory || 'New registration at Sub-centre outreach.',
      hasGivenDigitalConsent: newPatientForm.hasGivenDigitalConsent
    });

    setSelectedPatient(created);
    setShowRegisterModal(false);
    // Reset form
    setNewPatientForm({
      name: '',
      age: 28,
      gender: 'Female',
      phone: '+91 ',
      village: 'Rampur',
      language: 'hi',
      linkedAshaName: 'Sunita Bai',
      linkedAshaPhone: '+91 98230 11223',
      bloodGroup: 'B+',
      medicalHistory: '',
      chronicConditionsStr: '',
      hasGivenDigitalConsent: true
    });
  };

  const handleRecordAndReferral = () => {
    if (!selectedPatient) return;

    // 1. Record Encounter
    recordEncounter({
      patientId: selectedPatient.id,
      symptoms: selectedSymptoms,
      symptomNotes: symptomNotes,
      vitals: vitalsForm,
      facilityName: 'Rampur Health Sub-centre',
      facilityType: 'Sub-centre',
      recordedByName: 'Sunita Bai (ASHA)',
      actionTaken: `Triage auto-flagged as ${liveTriage.priority.toUpperCase()}. Generated electronic referral to ${targetFacility}.`
    });

    // 2. Create Referral
    createReferral({
      patientId: selectedPatient.id,
      fromFacility: 'Rampur Health Sub-centre',
      fromFacilityType: 'Sub-centre',
      toFacility: targetFacility,
      toFacilityType: targetFacilityType,
      reason: referralReason || `${liveTriage.priority.toUpperCase()} Risk: ${selectedSymptoms.join(', ')}`,
      urgency: liveTriage.priority,
      clinicalSummary: `Recorded Vitals: BP ${vitalsForm.bpSystolic}/${vitalsForm.bpDiastolic}, Temp ${vitalsForm.temperature}°F, SpO2 ${vitalsForm.spO2}%, Pulse ${vitalsForm.pulse}. ${symptomNotes}`
    });

    // Move to step 2 in demo guide
    setDemoStep(2);
    setActiveTab('referrals');
  };

  const handleCompleteTaskSubmit = () => {
    if (!completingFollowUp) return;
    completeFollowUp(completingFollowUp.id, completionNotes || 'Home visit completed. Checked patient vitals and verified medication compliance.');
    setCompletingFollowUp(null);
    setCompletionNotes('');
    setDemoStep(4);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with ASHA identity & quick actions */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-teal-800 text-teal-100 flex items-center justify-center font-black text-xl shadow-md ring-4 ring-slate-50">
                SB
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {loc.ashaTitle}
                </h2>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {loc.activeDuty}
                </span>
                <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                  ID: ASHA-MH-NSK-042
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {loc.assignedArea}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Offline indicator badge */}
            <div className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 shadow-2xs ${
              isOffline ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              {isOffline ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Activity className="w-4 h-4 text-emerald-600" />}
              <span>{isOffline ? loc.offlineMode : loc.liveSynced}</span>
            </div>

            <button
              onClick={() => setShowRegisterModal(true)}
              className="bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.ashaPortal.registerPatient}</span>
            </button>
          </div>
        </div>

        {/* Visual Community Health Care Card with Photo */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl p-4 text-white flex items-center gap-4 relative overflow-hidden shadow-xs">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border-2 border-white/20 shadow-md">
              <img
                src={ashaCareImg}
                alt="ASHA Village Health Care"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold bg-teal-500/30 text-teal-200 px-2 py-0.5 rounded-full uppercase border border-teal-400/30">
                  {loc.bannerTag}
                </span>
                <span className="text-[10px] text-teal-300 font-bold">
                  {loc.bannerOffline}
                </span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-white mt-1">
                {loc.bannerTitle}
              </h4>
              <p className="text-xs text-slate-200 mt-0.5 leading-snug">
                {loc.bannerDesc}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{loc.fieldProgressToday}</span>
                <span className="text-teal-700 font-extrabold">{completedTasks.length} / {ashaTasks.length} {loc.completed}</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${ashaTasks.length > 0 ? (completedTasks.length / ashaTasks.length) * 100 : 50}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-600 pt-1">
                <strong>{pendingTasks.length} {loc.pendingVisits}</strong>
              </p>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="mt-2 text-[11px] font-bold text-teal-800 hover:text-teal-900 flex items-center justify-between pt-2 border-t border-slate-200/80 cursor-pointer"
            >
              <span>{loc.viewTaskChecklist}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-xs">
        <button
          onClick={() => setActiveTab('record')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            activeTab === 'record'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>{loc.tabRecord}</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            activeTab === 'tasks'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>{loc.tabTasks} ({pendingTasks.length} {loc.pending})</span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
            activeTab === 'referrals'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{loc.tabReferrals} ({referrals.length})</span>
        </button>
      </div>

      {/* Tab 1: Record Encounter, Vitals & Auto-Triage */}
      {activeTab === 'record' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Selection & Search List (1 Col) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">{loc.selectCitizen}</h3>
              <span className="text-xs text-slate-500 font-semibold">{filteredPatients.length} {loc.found}</span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.ashaPortal.searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-600 text-slate-800"
              />
            </div>

            {/* Patient Cards List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredPatients.map(p => {
                const isSelected = selectedPatient?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-600 ring-1 ring-teal-600/40 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-7 h-7 rounded-lg ${p.avatarColor} text-white flex items-center justify-center text-xs font-bold`}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900">{p.name}</span>
                          <span className="text-[11px] text-slate-500 block">
                            {p.age}y &bull; {p.village}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded">
                        {p.abhaId?.slice(-4) || 'ABHA'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vitals Form & Auto-Triage Calculator (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {selectedPatient ? (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
                {/* Active Patient Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl ${selectedPatient.avatarColor} text-white flex items-center justify-center font-bold text-sm`}>
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {selectedPatient.name} ({selectedPatient.age}y, {selectedPatient.gender})
                      </div>
                      <div className="text-xs text-slate-500">
                        Village: <strong>{selectedPatient.village}</strong> &bull; History: {selectedPatient.chronicConditions?.join(', ') || 'None reported'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTimelinePatient(selectedPatient)}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 cursor-pointer flex items-center space-x-1"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>{loc.viewPastVisits}</span>
                  </button>
                </div>

                {/* Vitals Input Grid with Large Numbers for Digital Literacy */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    {loc.vitalsSectionTitle}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-600 block">{loc.systolicBp}</span>
                      <input
                        type="number"
                        value={vitalsForm.bpSystolic || ''}
                        onChange={e => setVitalsForm({ ...vitalsForm, bpSystolic: Number(e.target.value) || undefined })}
                        placeholder="e.g. 165"
                        className="w-full mt-1 font-bold text-base bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                      />
                      <span className="text-[10px] text-slate-500">&gt; 160 = {loc.highRisk}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-600 block">{loc.diastolicBp}</span>
                      <input
                        type="number"
                        value={vitalsForm.bpDiastolic || ''}
                        onChange={e => setVitalsForm({ ...vitalsForm, bpDiastolic: Number(e.target.value) || undefined })}
                        placeholder="e.g. 102"
                        className="w-full mt-1 font-bold text-base bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                      />
                      <span className="text-[10px] text-slate-500">&gt; 100 = {loc.highRisk}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-600 block">{loc.oxygenSpo2}</span>
                      <input
                        type="number"
                        value={vitalsForm.spO2 || ''}
                        onChange={e => setVitalsForm({ ...vitalsForm, spO2: Number(e.target.value) || undefined })}
                        placeholder="e.g. 98"
                        className="w-full mt-1 font-bold text-base bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                      />
                      <span className="text-[10px] text-slate-500">&lt; 94% = {loc.hypoxia}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-600 block">{loc.bodyTemp}</span>
                      <input
                        type="number"
                        step="0.1"
                        value={vitalsForm.temperature || ''}
                        onChange={e => setVitalsForm({ ...vitalsForm, temperature: Number(e.target.value) || undefined })}
                        placeholder="e.g. 99.2"
                        className="w-full mt-1 font-bold text-base bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                      />
                      <span className="text-[10px] text-slate-500">&gt; 102°F = {loc.highFever}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-600 block">{loc.pulseRate}</span>
                      <input
                        type="number"
                        value={vitalsForm.pulse || ''}
                        onChange={e => setVitalsForm({ ...vitalsForm, pulse: Number(e.target.value) || undefined })}
                        placeholder="e.g. 88"
                        className="w-full mt-1 font-bold text-base bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                      />
                      <span className="text-[10px] text-slate-500">{loc.normal}: 60-100</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-600 block">{loc.weight}</span>
                      <input
                        type="number"
                        step="0.5"
                        value={vitalsForm.weight || ''}
                        onChange={e => setVitalsForm({ ...vitalsForm, weight: Number(e.target.value) || undefined })}
                        placeholder="e.g. 58"
                        className="w-full mt-1 font-bold text-base bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-hidden focus:border-teal-600"
                      />
                      <span className="text-[10px] text-slate-500">{loc.maternalChild}</span>
                    </div>
                  </div>
                </div>

                {/* Symptoms Selection Checklist */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    {loc.symptomsTitle}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonSymptomOptions.map(sym => {
                      const isSelected = selectedSymptoms.includes(sym);
                      return (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => toggleSymptom(sym)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                            isSelected
                              ? 'bg-teal-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          <span>{sym}</span>
                          {isSelected && <CheckCircle className="w-3 h-3 text-teal-200" />}
                        </button>
                      );
                    })}
                  </div>
                  <textarea
                    value={symptomNotes}
                    onChange={e => setSymptomNotes(e.target.value)}
                    placeholder={loc.fieldNotesPlaceholder}
                    rows={2}
                    className="w-full mt-3 p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                {/* Live Auto-Triage Priority Alert Card */}
                <div className={`p-4 rounded-xl border-2 transition-all ${
                  liveTriage.priority === 'emergency' ? 'bg-rose-50 border-rose-500 text-rose-950' :
                  liveTriage.priority === 'high' ? 'bg-amber-50 border-amber-500 text-amber-950' :
                  liveTriage.priority === 'medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-950' :
                  'bg-emerald-50 border-emerald-500 text-emerald-950'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`w-5 h-5 ${
                        liveTriage.priority === 'emergency' ? 'text-rose-600' :
                        liveTriage.priority === 'high' ? 'text-amber-600' :
                        liveTriage.priority === 'medium' ? 'text-yellow-600' : 'text-emerald-600'
                      }`} />
                      <span className="font-extrabold text-sm sm:text-base uppercase tracking-wide">
                        {loc.automatedTriage} {liveTriage.priority.toUpperCase()} {loc.priorityLevel}
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/80 border">
                      {loc.ruleBasedAi}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs mb-3">
                    <div className="font-semibold">{loc.detectedFlags}:</div>
                    <ul className="list-disc pl-5 space-y-0.5">
                      {liveTriage.reasons.map((r, i) => (
                        <li key={i} className="font-medium">{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs pt-2 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span><strong>{loc.recommendedFacility}:</strong> {liveTriage.recommendedFacility}</span>
                    <span><strong>{loc.action}:</strong> {liveTriage.recommendedAction}</span>
                  </div>
                </div>

                {/* Referral Facility Destination */}
                <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-teal-900 uppercase">
                    {loc.targetFacilityTitle}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">{loc.selectFacility}:</label>
                      <select
                        value={targetFacility}
                        onChange={e => {
                          setTargetFacility(e.target.value);
                          if (e.target.value.includes('PHC')) setTargetFacilityType('PHC');
                          else if (e.target.value.includes('District')) setTargetFacilityType('District Hospital');
                          else setTargetFacilityType('Rural Hospital');
                        }}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600"
                      >
                        <option value="Chandur Primary Health Centre (PHC)">Chandur Primary Health Centre (PHC)</option>
                        <option value="Igatpuri Rural / Community Hospital (CHC)">Igatpuri Rural / Community Hospital (CHC)</option>
                        <option value="Nashik District Civil Hospital">Nashik District Civil Hospital</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">{loc.referralReasonNote}:</label>
                      <input
                        type="text"
                        value={referralReason}
                        onChange={e => setReferralReason(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-teal-600"
                      />
                    </div>
                  </div>
                </div>

                {/* 1-Click Action to Complete Step 1 of the SIH flow */}
                <div className="pt-2">
                  <button
                    onClick={handleRecordAndReferral}
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm sm:text-base py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5 text-teal-200" />
                    <span>{loc.recordAndGenerateReferral} {targetFacility.split('(')[0]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    ⚡ {loc.step2Notice}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                Please select a patient from the list on the left.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Task List of Pending Outreach / Follow-ups */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {loc.scheduledOutreachTitle}
              </h3>
              <p className="text-xs text-slate-600">
                {loc.doctorAssignedDesc}
              </p>
            </div>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
              {pendingTasks.length} {loc.pendingActions}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingTasks.map(task => (
              <div key={task.id} className="bg-white border-2 border-amber-300 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-950 font-mono text-xs font-bold px-2 py-0.5 rounded">
                    #{task.id} &bull; {task.type.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-amber-700 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{loc.due}: {task.dueDate}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">{task.patientName}</h4>
                  <div className="text-xs text-slate-600 flex items-center space-x-2 mt-0.5">
                    <span>{loc.village}: {task.patientVillage}</span>
                    <span>&bull;</span>
                    <span>{loc.phone}: {task.patientPhone}</span>
                  </div>
                </div>

                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                  <strong>{loc.doctorInstructions}:</strong> {task.instructions}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">
                    {loc.assignedBy}: <strong>{task.createdByName}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setCompletingFollowUp(task);
                      setCompletionNotes(`Visited ${task.patientName}'s home. Vitals checked and medicines confirmed.`);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center space-x-1 shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{loc.markDone}</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingTasks.length === 0 && (
              <div className="col-span-2 text-center py-10 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                {loc.noPendingTasks}
              </div>
            )}
          </div>

          {/* Completed History Section */}
          {completedTasks.length > 0 && (
            <div className="mt-8 space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {loc.recentlyCompletedTitle} ({completedTasks.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {completedTasks.map(t => (
                  <div key={t.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-bold text-slate-700">{t.patientName}</span>
                      <span className="text-emerald-700 font-bold flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>{loc.completedOn} {t.completedDate}</span>
                      </span>
                    </div>
                    <p className="text-slate-600 italic">"{t.completionNotes}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Active Referrals List */}
      {activeTab === 'referrals' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {loc.referralBoardTitle}
              </h3>
              <p className="text-xs text-slate-600">
                {loc.realtimeStatus}
              </p>
            </div>
            <span className="text-xs font-bold bg-teal-100 text-teal-900 px-3 py-1 rounded-full">
              {referrals.length} {loc.totalCases}
            </span>
          </div>

          <div className="space-y-3">
            {referrals.map(ref => (
              <div key={ref.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{ref.patientName}</span>
                    <span className="text-xs text-slate-500 font-medium">({ref.patientAge}y, {ref.patientGender})</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      ref.urgency === 'emergency' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                      ref.urgency === 'high' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-teal-100 text-teal-800 border-teal-300'
                    }`}>
                      {ref.urgency.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium">
                    <span>{ref.fromFacility}</span> ➔ <strong className="text-teal-900">{ref.toFacility}</strong>
                  </div>
                  <div className="text-xs text-slate-600 italic">
                    Reason: {ref.reason}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    ref.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                    ref.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800' :
                    ref.status === 'Accepted' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ref.status}
                  </span>
                  <span className="text-[10px] text-slate-500">{ref.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Register New Patient Form */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-teal-800 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-teal-200" />
                <h3 className="text-lg font-bold">{loc.registerNewTitle}</h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-teal-200 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{loc.fullName} *</label>
                  <input
                    type="text"
                    required
                    value={newPatientForm.name}
                    onChange={e => setNewPatientForm({ ...newPatientForm, name: e.target.value })}
                    placeholder="e.g. Anjali Shinde"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{loc.ageYears} *</label>
                  <input
                    type="number"
                    required
                    value={newPatientForm.age}
                    onChange={e => setNewPatientForm({ ...newPatientForm, age: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{loc.gender} *</label>
                  <select
                    value={newPatientForm.gender}
                    onChange={e => setNewPatientForm({ ...newPatientForm, gender: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{loc.phoneNumber}</label>
                  <input
                    type="text"
                    value={newPatientForm.phone}
                    onChange={e => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{loc.villageWard}</label>
                  <input
                    type="text"
                    value={newPatientForm.village}
                    onChange={e => setNewPatientForm({ ...newPatientForm, village: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{loc.preferredLang}</label>
                  <select
                    value={newPatientForm.language}
                    onChange={e => setNewPatientForm({ ...newPatientForm, language: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 font-semibold focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{loc.knownConditions}</label>
                <input
                  type="text"
                  value={newPatientForm.chronicConditionsStr}
                  onChange={e => setNewPatientForm({ ...newPatientForm, chronicConditionsStr: e.target.value })}
                  placeholder="e.g. Gestational Hypertension, Type-2 Diabetes"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={newPatientForm.hasGivenDigitalConsent}
                  onChange={e => setNewPatientForm({ ...newPatientForm, hasGivenDigitalConsent: e.target.checked })}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <label htmlFor="consentCheckbox" className="font-semibold text-slate-800 cursor-pointer">
                  {loc.consentStatement}
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  {loc.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs cursor-pointer"
                >
                  {loc.saveOpenVitals}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Mark Follow-Up Complete */}
      {completingFollowUp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold">{loc.completeFollowupTitle}</h3>
              </div>
              <button onClick={() => setCompletingFollowUp(null)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">{loc.patientNameLabel}</span>
                <span className="text-sm font-bold text-slate-900">{completingFollowUp.patientName}</span>
              </div>

              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-950">
                <strong>{loc.assignedTaskLabel}</strong> {completingFollowUp.instructions}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{loc.ashaFieldObservations}</label>
                <textarea
                  value={completionNotes}
                  onChange={e => setCompletionNotes(e.target.value)}
                  rows={3}
                  placeholder="Record blood pressure, medication adherence, and patient recovery notes..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCompletingFollowUp(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold"
                >
                  {loc.cancel}
                </button>
                <button
                  type="button"
                  onClick={handleCompleteTaskSubmit}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer flex items-center space-x-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{loc.confirmVisitDone}</span>
                </button>
              </div>
            </div>
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
