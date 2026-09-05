import React, { useState } from 'react';
import { Patient, Referral, Language } from '../types';
import { useHealth } from '../context/HealthContext';
import {
  X,
  Printer,
  Volume2,
  VolumeX,
  Pill,
  Calendar,
  User,
  Stethoscope,
  ShieldCheck,
  AlertCircle,
  Phone,
  Clock,
  Sparkles,
  QrCode,
  Sunrise,
  Sun,
  Moon,
  CheckCircle2,
  FileCheck,
  ArrowRight
} from 'lucide-react';
import {
  unlockAudioContext,
  getBrowserVoices,
  resolveBestVoice,
  cleanTextForSpeech,
  stopAllSpeech
} from '../utils/audioService';

interface EPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  language: Language;
  referrals?: Referral[];
}

export const EPrescriptionModal: React.FC<EPrescriptionModalProps> = ({
  isOpen,
  onClose,
  patient,
  language,
  referrals = []
}) => {
  const { setActiveTeleconsultPatient } = useHealth();
  const [isSpeakingRx, setIsSpeakingRx] = useState(false);

  if (!isOpen || !patient) return null;

  // 1. Locate latest consultation outcome if present in referrals
  const matchedReferral = referrals.find(
    (r) => r.patientId === patient.id && r.consultationOutcome
  );

  const isDemoSavita = patient.id === 'pat-101';
  const isDemoRamesh = patient.id === 'pat-102';
  const isDemoAnita = patient.id === 'pat-103';
  const hasOutcome = !!matchedReferral?.consultationOutcome;
  const isPendingConsultation = !hasOutcome && !isDemoSavita && !isDemoRamesh && !isDemoAnita;

  let rxData = {
    isPendingConsultation: false,
    rxId: `RX-MH-2026-${patient.id.replace('pat-', '')}-01`,
    date: '27 Aug 2026',
    doctorName: 'Dr. Rajesh Kulkarni, MBBS, MD (Medicine)',
    doctorReg: 'MMC Reg. #2014/04/1829',
    doctorRole: 'Medical Officer In-Charge',
    facilityName: 'Chandur Primary Health Centre (PHC)',
    district: 'Nashik District, Maharashtra',
    diagnosis: 'Gestational Hypertension (28 Wks ANC) with Mild Pedal Edema',
    vitalsAtConsult: 'BP: 165/102 mmHg | Pulse: 88 bpm | SpO2: 98% | Wt: 58 kg',
    medicines: [
      {
        id: 'med-1',
        name: 'Tablet Amlodipine 5mg',
        generic: 'Amlodipine Besylate 5mg',
        dosage: '1 Tablet Once Daily',
        timing: 'Morning (08:00 AM)',
        timingCode: '1 - 0 - 0',
        morning: true,
        noon: false,
        night: false,
        instruction: 'Take with water after breakfast',
        instructionHi: 'सुबह नाश्ते के बाद 1 गोली पानी के साथ लें',
        instructionMr: 'सकाळी नाश्त्यानंतर १ गोळी पाण्यासोबत घ्या',
        duration: '30 Days',
        purpose: 'Blood Pressure Control / रक्तचाप नियंत्रण'
      },
      {
        id: 'med-2',
        name: 'Tablet Iron & Folic Acid (IFA)',
        generic: 'Elemental Iron 100mg + Folic Acid 0.5mg',
        dosage: '1 Tablet Daily',
        timing: 'Afternoon (01:30 PM)',
        timingCode: '0 - 1 - 0',
        morning: false,
        noon: true,
        night: false,
        instruction: 'Take after lunch. Do not take with tea/milk/calcium.',
        instructionHi: 'दोपहर भोजन के बाद लें। दूध या चाय के साथ न लें।',
        instructionMr: 'दुपारी जेवणानंतर घ्या. दूध किंवा चहासोबत घेऊ नका.',
        duration: '90 Days',
        purpose: 'Maternal Hemoglobin / हीमोग्लोबिन वाढवणे'
      },
      {
        id: 'med-3',
        name: 'Tablet Calcium 500mg + Vit D3',
        generic: 'Calcium Carbonate 500mg + Cholecalciferol 250 IU',
        dosage: '1 Tablet Nightly',
        timing: 'Night (08:30 PM)',
        timingCode: '0 - 0 - 1',
        morning: false,
        noon: false,
        night: true,
        instruction: 'Take after dinner. Keep 2+ hours gap from Iron tablet.',
        instructionHi: 'रात के भोजन के बाद लें। आयरन की गोली से 2 घंटे का अंतर रखें।',
        instructionMr: 'रात्री जेवणानंतर घ्या. आयर्नच्या गोळीनंतर २ तासांचे अंतर ठेवा.',
        duration: '90 Days',
        purpose: 'Bone & Fetal Health / हाडे व बाळ विकास'
      }
    ],
    doctorAdvice:
      'Maintain low salt intake (<5g/day). Rest in left lateral position for 2 hours daily. Regular blood pressure checks every 3 days by ASHA Sunita Bai. Report immediately to PHC if experiencing severe headache, blurred vision, or upper abdominal pain.',
    doctorAdviceHi:
      'नमक कम खाएं। बाईं करवट लेकर दिन में 2 घंटे आराम करें। आशा कार्यकर्ता द्वारा हर 3 दिन में बीपी नपवाएं। सिरदर्द या आँखों के आगे धुंधलापन होने पर तुरंत अस्पताल जाएं।',
    doctorAdviceMr:
      'मीठ कमी खा. डाव्या कुशीवर झोपून विश्रांती घ्या. आशा सेविकेकडून दर ३ दिवसांनी रक्तदाब तपासा. डोकेदुखी किंवा अंधुक दिसल्यास लगेच प्राथमिक केंद्रात या.',
    safetyWarning:
      'IMPORTANT: Never take Iron and Calcium tablets at the same time; maintain at least 2 hours interval for optimal absorption.',
    nextReviewDate: '05 Sep 2026 (PHC ANC Clinic)',
    ashaWorker: patient.linkedAshaName || 'Sunita Bai',
    ashaPhone: patient.linkedAshaPhone || '+91 98230 11223'
  };

  if (hasOutcome) {
    const outcome = matchedReferral!.consultationOutcome!;
    rxData = {
      ...rxData,
      isPendingConsultation: false,
      rxId: `RX-PHC-${patient.id.replace('pat-', '')}-${matchedReferral!.id.replace('ref-', '')}`,
      date: outcome.consultationDate || rxData.date,
      doctorName: outcome.doctorName,
      facilityName: matchedReferral!.toFacility || rxData.facilityName,
      diagnosis: outcome.diagnosis || rxData.diagnosis,
      doctorAdvice: outcome.advice || rxData.doctorAdvice,
      doctorAdviceHi: outcome.advice || rxData.doctorAdviceHi,
      doctorAdviceMr: outcome.advice || rxData.doctorAdviceMr,
      medicines: outcome.prescribedMedicines.map((medStr, idx) => {
        const lower = medStr.toLowerCase();
        const isMorning = lower.includes('od') || lower.includes('bd') || lower.includes('morning') || lower.includes('सकाळ');
        const isNoon = lower.includes('tds') || lower.includes('noon') || lower.includes('दुपार');
        const isNight = lower.includes('bd') || lower.includes('tds') || lower.includes('night') || lower.includes('रात्र');
        return {
          id: `med-${idx}`,
          name: medStr,
          generic: 'Clinical Prescription Formulation',
          dosage: lower.includes('bd') ? 'Twice Daily (BD)' : lower.includes('tds') ? 'Thrice Daily (TDS)' : 'Once Daily (OD)',
          timing: lower.includes('bd') ? 'Morning & Night' : lower.includes('night') ? 'Night' : 'Morning',
          timingCode: lower.includes('bd') ? '1 - 0 - 1' : lower.includes('tds') ? '1 - 1 - 1' : '1 - 0 - 0',
          morning: isMorning,
          noon: isNoon,
          night: isNight,
          instruction: 'Take with warm water after meals',
          instructionHi: 'भोजन के बाद गुनगुने पानी के साथ लें',
          instructionMr: 'जेवणानंतर कोमट पाण्यासोबत घ्या',
          duration: '30 Days',
          purpose: outcome.diagnosis
        };
      })
    };
  } else if (isDemoRamesh) {
    rxData = {
      ...rxData,
      isPendingConsultation: false,
      rxId: `RX-MH-2026-${patient.id.replace('pat-', '')}-02`,
      date: '25 Aug 2026',
      diagnosis: 'Type-2 Diabetes Mellitus with Grade 1 HTN',
      vitalsAtConsult: 'BP: 142/90 mmHg | Pulse: 76 bpm | Blood Sugar: 168 mg/dL',
      medicines: [
        {
          id: 'med-r1',
          name: 'Tab Metformin 500mg + Glimepiride 1mg',
          generic: 'Metformin Hydrochloride + Glimepiride',
          dosage: '1 Tablet Twice Daily',
          timing: 'Morning & Night (Before meals)',
          timingCode: '1 - 0 - 1',
          morning: true,
          noon: false,
          night: true,
          instruction: 'Take 15 minutes before breakfast and dinner',
          instructionHi: 'सुबह और रात भोजन से 15 मिनट पहले लें',
          instructionMr: 'सकाळी व रात्री जेवणापूर्वी १५ मिनिटे घ्या',
          duration: '30 Days',
          purpose: 'Blood Sugar Control / मधुमेह नियंत्रण'
        },
        {
          id: 'med-r2',
          name: 'Tab Telmisartan 40mg',
          generic: 'Telmisartan 40mg',
          dosage: '1 Tablet Once Daily',
          timing: 'Morning (08:00 AM)',
          timingCode: '1 - 0 - 0',
          morning: true,
          noon: false,
          night: false,
          instruction: 'Take with water after breakfast',
          instructionHi: 'सुबह नाश्ते के बाद 1 गोली पानी के साथ लें',
          instructionMr: 'सकाळी नाश्त्यानंतर १ गोळी पाण्यासोबत घ्या',
          duration: '30 Days',
          purpose: 'Blood Pressure Control / रक्तदाब नियंत्रण'
        },
        {
          id: 'med-r3',
          name: 'Tab Atorvastatin 10mg',
          generic: 'Atorvastatin Calcium 10mg',
          dosage: '1 Tablet Nightly',
          timing: 'Night (09:00 PM)',
          timingCode: '0 - 0 - 1',
          morning: false,
          noon: false,
          night: true,
          instruction: 'Take after dinner before sleep',
          instructionHi: 'रात को भोजन के बाद लें',
          instructionMr: 'रात्री जेवणानंतर झोपण्यापूर्वी घ्या',
          duration: '30 Days',
          purpose: 'Lipid & Heart Health / कोलेस्ट्रॉल नियंत्रण'
        }
      ],
      doctorAdvice: 'Daily 30-min brisk walk. Bi-weekly blood glucose checks by ASHA Sunita Bai. Maintain low sugar, low salt diet.',
      doctorAdviceHi: 'प्रतिदिन 30 मिनट तेज सैर करें। आशा कार्यकर्ता से 15 दिन में शुगर जांच करवाएं। मीठा और नमक कम खाएं।',
      doctorAdviceMr: 'दररोज ३० मिनिटे चालण्याचा व्यायाम करा. आशा सेविकेकडून दर १५ दिवसांनी साखर तपासा.',
      safetyWarning: 'Do not skip meals after taking diabetes medication to prevent hypoglycemia.',
      nextReviewDate: '25 Sep 2026 (PHC NCD Clinic)'
    };
  } else if (isDemoAnita) {
    rxData = {
      ...rxData,
      isPendingConsultation: false,
      rxId: `RX-MH-2026-${patient.id.replace('pat-', '')}-03`,
      date: '16 Aug 2026',
      diagnosis: 'Acute Viral Gastroenteritis with Dehydration (Resolved)',
      vitalsAtConsult: 'Temp: 98.4°F | Pulse: 96 bpm | Wt: 14 kg',
      medicines: [
        {
          id: 'med-a1',
          name: 'Syrup Zinc 20mg',
          generic: 'Zinc Sulfate Monohydrate 20mg/5ml',
          dosage: '5ml Once Daily',
          timing: 'Morning after food',
          timingCode: '1 - 0 - 0',
          morning: true,
          noon: false,
          night: false,
          instruction: 'Give 5ml daily for 14 continuous days',
          instructionHi: '14 दिन तक रोज़ाना 5ml पिलाएं',
          instructionMr: '१४ दिवस दररोज ५ मिली पाजा',
          duration: '14 Days',
          purpose: 'Gut Mucosa Recovery / पोटाच्या आरोग्यासाठी'
        },
        {
          id: 'med-a2',
          name: 'ORS Packets (WHO Formula)',
          generic: 'Oral Rehydration Salts',
          dosage: '1 Packet in 1 Liter clean boiled water',
          timing: 'Sip throughout the day',
          timingCode: 'SOS / as needed',
          morning: true,
          noon: true,
          night: true,
          instruction: 'Dissolve in 1L boiled water; consume within 24 hours',
          instructionHi: '1 लीटर उबले पानी में घोलें, 24 घंटे में पिलाएं',
          instructionMr: '१ लिटर उकळलेल्या पाण्यात मिसळून २४ तासांत द्या',
          duration: '5 Days',
          purpose: 'Hydration Maintenance / डिहायड्रेशन प्रतिबंध'
        }
      ],
      doctorAdvice: 'Maintain boiled clean drinking water and hand hygiene. Continue normal diet and fluids.',
      doctorAdviceHi: 'उबला हुआ पानी पिलाएं और स्वच्छता रखें। सामान्य आहार जारी रखें।',
      doctorAdviceMr: 'उकळलेले पाणी पाजा आणि हातांची स्वच्छता ठेवा.',
      safetyWarning: 'Seek immediate care if vomiting persists or child becomes lethargic.',
      nextReviewDate: 'As needed / SOS'
    };
  } else if (isPendingConsultation) {
    // NEWLY REGISTERED PATIENTS OR PATIENTS PENDING CONSULTATION
    rxData = {
      isPendingConsultation: true,
      rxId: `REG-PHC-${new Date().getFullYear()}-${patient.id.replace('pat-', '').slice(-6).toUpperCase()}`,
      date: patient.registeredDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      doctorName: 'Dr. Rajesh Kulkarni, MBBS, MD (Medicine)',
      doctorReg: 'MMC Reg. #2014/04/1829',
      doctorRole: 'Medical Officer In-Charge',
      facilityName: 'Chandur Primary Health Centre (PHC)',
      district: 'Nashik District, Maharashtra',
      diagnosis: patient.chronicConditions && patient.chronicConditions.length > 0
        ? patient.chronicConditions.join(', ')
        : patient.medicalHistory || 'Primary Health Registration & Assessment',
      vitalsAtConsult: patient.lastVitals?.bpSystolic
        ? `BP: ${patient.lastVitals.bpSystolic}/${patient.lastVitals.bpDiastolic || 80} mmHg | Pulse: ${patient.lastVitals.pulse || 72} bpm | SpO2: ${patient.lastVitals.spO2 || 98}%`
        : 'Initial Primary Screening Vitals Pending',
      medicines: [],
      doctorAdvice: 'Clinical consultation with Medical Officer is pending. Please join live teleconsultation or visit your nearest Sub-centre / Chandur PHC for clinical examination and official electronic prescription.',
      doctorAdviceHi: 'डॉक्टर परामर्श प्रतीक्षेत है। कृपया मेडिकल ऑफिसर डॉ. राजेश कुलकर्णी से लाइव वीडियो परामर्श लें या उप-स्वास्थ्य केंद्र / पीएचसी में जांच करवाएं।',
      doctorAdviceMr: 'वैद्यकीय अधिकारी तपासणी प्रतीक्षेत आहे. कृपया डॉ. राजेश कुलकर्णी यांच्याशी टेलिकन्सल्टेशन द्वारे संपर्क साधा किंवा प्राथमिक आरोग्य केंद्रात भेट द्या.',
      safetyWarning: 'Notice: No prescription medications have been dispensed yet. Please consult the doctor before taking any medication.',
      nextReviewDate: 'Immediate / Pending Doctor OPD Slot',
      ashaWorker: patient.linkedAshaName || 'Sunita Bai',
      ashaPhone: patient.linkedAshaPhone || '+91 98230 11223'
    };
  }

  // Handle Voice Readout for rural / illiterate patients
  const handleToggleVoiceReadout = async () => {
    if (isSpeakingRx) {
      stopAllSpeech();
      setIsSpeakingRx(false);
      return;
    }

    unlockAudioContext();

    let speechScript = '';
    if (rxData.medicines.length === 0) {
      if (language === 'hi') {
        speechScript = `नमस्ते ${patient.name} जी। यह आपका डिजिटल स्वास्थ्य पंजीकरण पर्चा है। आपकी प्रोफाइल ${patient.village} गाँव के लिए दर्ज है, लेकिन अभी तक डॉक्टर द्वारा कोई दवा नहीं लिखी गई है। आपका डॉक्टर परामर्श प्रतीक्षेत है। कृपया मेडिकल ऑफिसर डॉ. राजेश कुलकर्णी से टेलीकंसल्टेशन द्वारा जांच कराएं।`;
      } else if (language === 'mr') {
        speechScript = `नमस्कार ${patient.name} जी. हे आपले डिजिटल आरोग्य नोंदणी कार्ड आहे. आपली नोंदणी ${patient.village} गावासाठी झाली आहे, परंतु डॉक्टरांनी अद्याप कोणतेही औषध दिलेले नाही. आपली डॉक्टर तपासणी प्रतीक्षेत आहे. कृपया डॉ. राजेश कुलकर्णी यांच्याशी टेलिकन्सल्टेशन द्वारे संपर्क साधा.`;
      } else {
        speechScript = `Hello ${patient.name}. This is your digital health registration slip. Your profile is active for village ${patient.village}, but no prescription medications have been issued by the Medical Officer yet. Your clinical consultation is currently pending. Please join live teleconsultation with Dr. Rajesh Kulkarni to complete your medical checkup.`;
      }
    } else {
      if (language === 'hi') {
        speechScript = `नमस्ते ${patient.name} जी। यह आपका डिजिटल डॉक्टर पर्चा है। डॉक्टर ${rxData.doctorName.split(',')[0]} ने आपके लिए निम्नलिखित दवाइयाँ लिखी हैं। `;
        rxData.medicines.forEach((m, idx) => {
          speechScript += `दवा नंबर ${idx + 1}: ${m.name}। ${m.instructionHi}। `;
        });
        speechScript += `महत्वपूर्ण सलाह: ${rxData.doctorAdviceHi}`;
      } else if (language === 'mr') {
        speechScript = `नमस्कार ${patient.name} जी. हे आपले डिजिटल डॉक्टरी प्रिस्क्रिप्शन कार्ड आहे. डॉक्टर ${rxData.doctorName.split(',')[0]} यांनी आपल्यासाठी औषधे दिली आहेत. `;
        rxData.medicines.forEach((m, idx) => {
          speechScript += `औषध क्रमांक ${idx + 1}: ${m.name}. ${m.instructionMr}. `;
        });
        speechScript += `महत्त्वाची सूचना: ${rxData.doctorAdviceMr}`;
      } else {
        speechScript = `Hello ${patient.name}. Here is your official e-Prescription prescribed by ${rxData.doctorName}. `;
        rxData.medicines.forEach((m, idx) => {
          speechScript += `Medicine ${idx + 1}: ${m.name}. ${m.dosage}. ${m.instruction}. `;
        });
        speechScript += `Doctor's Advice: ${rxData.doctorAdvice}`;
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      stopAllSpeech();
      const sentences = cleanTextForSpeech(speechScript, language);
      if (sentences.length === 0) return;

      setIsSpeakingRx(true);
      const voices = await getBrowserVoices();
      const resolved = resolveBestVoice(voices, language);

      let currentIdx = 0;
      const playNextSentence = () => {
        if (currentIdx >= sentences.length) {
          setIsSpeakingRx(false);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(sentences[currentIdx]);
        if (resolved.voice) utterance.voice = resolved.voice;
        utterance.lang = resolved.safeLangCode;
        utterance.rate = 1.1;

        utterance.onend = () => {
          currentIdx++;
          playNextSentence();
        };

        utterance.onerror = () => {
          currentIdx++;
          playNextSentence();
        };

        window.speechSynthesis.speak(utterance);
      };

      playNextSentence();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header - National Digital Health Mission Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner text-emerald-300">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base tracking-tight">
                  {rxData.isPendingConsultation
                    ? (language === 'hi' ? 'आयुष्मान डिजिटल स्वास्थ्य पर्ची' : language === 'mr' ? 'आयुष्मान डिजिटल नोंदणी पावती' : 'Ayushman Digital Registration Slip')
                    : (language === 'hi' ? 'आयुष्मान डिजिटल ई-प्रिस्क्रिप्शन' : language === 'mr' ? 'आयुष्मान डिजिटल ई-प्रिस्क्रिप्शन' : 'Ayushman Digital E-Prescription (e-Rx)')}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                  rxData.isPendingConsultation
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                    : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30'
                }`}>
                  {rxData.isPendingConsultation ? 'Consultation Pending' : 'ABDM Verified'}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium">
                {rxData.facilityName} • {rxData.district}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleVoiceReadout}
              className={`p-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                isSpeakingRx
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10'
              }`}
              title="Voice readout of prescription"
            >
              {isSpeakingRx ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {isSpeakingRx
                  ? (language === 'hi' ? 'आवाज़ रोकें' : language === 'mr' ? 'थांबवा' : 'Stop')
                  : (language === 'hi' ? '🔊 पर्चा सुनें' : language === 'mr' ? '🔊 आवाज ऐका' : '🔊 Listen')}
              </span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/10 rounded-lg transition-colors cursor-pointer text-xs font-bold flex items-center space-x-1.5"
              title="Print E-Prescription Card"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === 'hi' ? 'प्रिंट करें' : language === 'mr' ? 'प्रिंट करा' : 'Print'}
              </span>
            </button>

            <button
              onClick={() => {
                stopAllSpeech();
                setIsSpeakingRx(false);
                onClose();
              }}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Prescription Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50 print:bg-white print:p-0">
          {/* Official Prescription Header Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-extrabold text-xl">
                  ℞
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center space-x-1.5">
                    <span>{rxData.doctorName}</span>
                    <ShieldCheck className="w-4 h-4 text-teal-600 inline" />
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">{rxData.doctorRole}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{rxData.doctorReg}</p>
                </div>
              </div>

              <div className="flex items-center sm:items-end flex-col text-left sm:text-right">
                <div className="text-[11px] font-mono text-slate-500">Rx No: <strong className="text-slate-800 font-bold">{rxData.rxId}</strong></div>
                <div className="text-[11px] text-slate-600 flex items-center space-x-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date: <strong>{rxData.date}</strong></span>
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 inline-flex items-center space-x-1 ${
                  rxData.isPendingConsultation
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-teal-50 text-teal-800 border-teal-200'
                }`}>
                  <CheckCircle2 className={`w-3 h-3 ${rxData.isPendingConsultation ? 'text-amber-600' : 'text-teal-600'}`} />
                  <span>{rxData.isPendingConsultation ? 'ABDM Registered Enrolment' : 'National Health Mission Valid'}</span>
                </div>
              </div>
            </div>

            {/* Patient Demographics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3.5 text-xs">
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Name</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">{patient.name}</span>
                <span className="text-[11px] text-slate-600">{patient.age}y • {patient.gender} • {patient.bloodGroup || 'O+'}</span>
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ABHA Health ID</span>
                <span className="text-xs font-mono font-bold text-teal-700 block mt-0.5">{patient.abhaId || '91-4829-1029-3321'}</span>
                <span className="text-[10px] text-emerald-700 font-medium">✓ ABDM Linked</span>
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Village / Contact</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">{patient.village}</span>
                <span className="text-[11px] text-slate-600 font-mono">{patient.phone}</span>
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned ASHA</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">{rxData.ashaWorker}</span>
                <span className="text-[11px] text-teal-700 font-mono">{rxData.ashaPhone}</span>
              </div>
            </div>
          </div>

          {/* Clinical Diagnosis & Vitals banner */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-200/80 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider flex items-center space-x-1">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                  <span>Clinical Diagnosis / निदान</span>
                </span>
                <h5 className="text-sm font-extrabold text-slate-900 mt-1">
                  {rxData.diagnosis}
                </h5>
              </div>

              <div className="bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-teal-200 text-xs font-medium text-slate-700">
                <span className="font-bold text-slate-900">Exam Vitals:</span> {rxData.vitalsAtConsult}
              </div>
            </div>
          </div>

          {/* Prescribed Medications Schedule */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {language === 'hi' ? 'निर्धारित दवाइयाँ एवं समय सारणी' : language === 'mr' ? 'औषध वेळापत्रक व मात्रा' : 'Prescribed Medications & Dosages'}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {rxData.medicines.length === 0
                      ? (language === 'hi' ? 'प्रारंभिक मूल्यांकन एवं परामर्श प्रतीक्षेत' : language === 'mr' ? 'वैद्यकीय सल्ला प्रतीक्षेत' : 'Pending clinical evaluation by Medical Officer')
                      : (language === 'hi' ? 'कृपया समय पर खुराक लें' : language === 'mr' ? 'कृपया वेळेवर औषधे घ्या' : 'Follow timing icons and food instructions strictly')}
                  </p>
                </div>
              </div>

              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                rxData.medicines.length > 0 ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {rxData.medicines.length > 0
                  ? `${rxData.medicines.length} Medicines`
                  : (language === 'hi' ? 'परामर्श प्रतीक्षेत' : language === 'mr' ? 'तपासणी प्रतीक्षेत' : 'Consultation Pending')}
              </span>
            </div>

            {rxData.medicines.length === 0 ? (
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-slate-900">
                    {language === 'hi' ? 'चिकित्सक परामर्श प्रतीक्षेत है' : language === 'mr' ? 'वैद्यकीय अधिकारी तपासणी प्रतीक्षेत' : 'Doctor Consultation Pending'}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    {language === 'hi'
                      ? `${patient.name} जी के लिए अभी तक डॉक्टर द्वारा कोई दवा पर्ची जारी नहीं की गई है। कृपया मेडिकल ऑफिसर डॉ. राजेश कुलकर्णी से लाइव वीडियो परामर्श लें या उप-केंद्र में संपर्क करें।`
                      : language === 'mr'
                      ? `${patient.name} यांच्यासाठी अद्याप डॉक्टरांकडून औषधांचा पर्चा जारी झालेला नाही. कृपया डॉ. राजेश कुलकर्णी यांच्याशी टेलिकन्सल्टेशन द्वारे संपर्क साधा.`
                      : `No prescription medications have been issued for ${patient.name} yet. Connect directly with Medical Officer Dr. Rajesh Kulkarni via live teleconsultation.`}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      stopAllSpeech();
                      setIsSpeakingRx(false);
                      setActiveTeleconsultPatient(patient);
                      onClose();
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>
                      {language === 'hi' ? 'डॉक्टर से बात करें (लाइव टेलीकंसल्ट)' : language === 'mr' ? 'डॉक्टरांशी बोला (लाइव टेलिकन्सल्ट)' : 'Join Live Teleconsultation with Doctor'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {rxData.medicines.map((med, index) => (
                  <div
                    key={med.id || index}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-teal-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-200">
                            {index + 1}
                          </span>
                          <h5 className="font-extrabold text-slate-900 text-sm">
                            {med.name}
                          </h5>
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded font-semibold">
                            {med.timingCode}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 italic pl-7">{med.generic}</p>
                      </div>

                      {/* Morning / Noon / Night Badges */}
                      <div className="flex items-center gap-1.5 pl-7 sm:pl-0">
                        <div
                          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                            med.morning
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                          }`}
                        >
                          <Sunrise className={`w-3.5 h-3.5 ${med.morning ? 'text-amber-600' : 'text-slate-400'}`} />
                          <span>{language === 'hi' ? 'सुबह' : language === 'mr' ? 'सकाळ' : 'Morning'}</span>
                        </div>

                        <div
                          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                            med.noon
                              ? 'bg-orange-50 text-orange-900 border-orange-300'
                              : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                          }`}
                        >
                          <Sun className={`w-3.5 h-3.5 ${med.noon ? 'text-orange-600' : 'text-slate-400'}`} />
                          <span>{language === 'hi' ? 'दोपहर' : language === 'mr' ? 'दुपार' : 'Noon'}</span>
                        </div>

                        <div
                          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                            med.night
                              ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                              : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                          }`}
                        >
                          <Moon className={`w-3.5 h-3.5 ${med.night ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span>{language === 'hi' ? 'रात' : language === 'mr' ? 'रात्र' : 'Night'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Instruction & Duration Bar */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-700 gap-2 pl-7 sm:pl-7">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-teal-800">
                          {language === 'hi' ? 'निर्देश:' : language === 'mr' ? 'सूचना:' : 'Instruction:'}
                        </span>
                        <span className="text-slate-700">
                          {language === 'hi' ? med.instructionHi : language === 'mr' ? med.instructionMr : med.instruction}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-[11px]">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          Duration: <strong>{med.duration}</strong>
                        </span>
                        <span className="text-teal-700 font-semibold">
                          {med.purpose}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Critical Warning / Safety Advice */}
          <div className="bg-amber-50/90 rounded-xl border border-amber-200 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {language === 'hi' ? 'सावधानी एवं डॉक्टर की विशेष सलाह' : language === 'mr' ? 'विशेष दक्षता व डॉक्टरांचा सल्ला' : 'Special Precautions & Doctor Advice'}
              </span>
            </div>
            <p className="text-xs text-amber-950 font-medium leading-relaxed pl-6">
              {language === 'hi' ? rxData.doctorAdviceHi : language === 'mr' ? rxData.doctorAdviceMr : rxData.doctorAdvice}
            </p>
            <div className="mt-2 pl-6 text-[11px] font-bold text-amber-800 bg-amber-100/60 p-2 rounded-lg border border-amber-200">
              ⚠️ {rxData.safetyWarning}
            </div>
          </div>

          {/* QR Verification and Digital Signature Seal */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 p-1">
                <QrCode className="w-11 h-11 text-slate-800" />
              </div>
              <div className="text-xs space-y-0.5">
                <span className="font-extrabold text-slate-900 block">ABDM e-Prescription QR Verification</span>
                <p className="text-slate-500 text-[11px]">Scan at any Jan Aushadhi Kendra or PHC Pharmacy for digital dispensing.</p>
                <span className="text-[10px] text-teal-700 font-mono">Hash: 8f42a901...39b2</span>
              </div>
            </div>

            <div className="text-center sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 w-full sm:w-auto">
              <div className="text-xs font-serif font-bold italic text-teal-900">
                Dr. Rajesh Kulkarni
              </div>
              <div className="text-[10px] text-slate-500 font-sans">
                Digitally Signed via National Health Authority HSM
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">
                ✓ Verified Timestamp: {rxData.date}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="text-xs text-slate-600 flex items-center space-x-1">
            <Phone className="w-3.5 h-3.5 text-teal-600" />
            <span>Need medicine assistance? Contact ASHA <strong>{rxData.ashaWorker}</strong> ({rxData.ashaPhone})</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पर्चा प्रिंट करें' : language === 'mr' ? 'प्रिस्क्रिप्शन प्रिंट करा' : 'Print Rx Slip'}</span>
            </button>
            <button
              onClick={() => {
                stopAllSpeech();
                setIsSpeakingRx(false);
                onClose();
              }}
              className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {language === 'hi' ? 'बंद करें' : language === 'mr' ? 'बंद करा' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
