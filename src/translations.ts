export interface TranslationStrings {
  appName: string;
  appTagline: string;
  roles: {
    patient: string;
    asha: string;
    anm: string;
    doctor: string;
    admin: string;
  };
  header: {
    ribbonText: string;
    abdmCertified: string;
    offline: string;
    liveSynced: string;
    sync: string;
    reset: string;
    voiceAssistant: string;
    voiceSubtitle: string;
    switchPortal: string;
    exit: string;
    signedInAs: string;
    portalTitles: {
      patient: string;
      asha: string;
      anm: string;
      doctor: string;
      admin: string;
    };
    tiers: {
      patient: string;
      asha: string;
      anm: string;
      doctor: string;
      admin: string;
    };
  };
  common: {
    search: string;
    filter: string;
    all: string;
    status: string;
    urgency: string;
    date: string;
    action: string;
    actions: string;
    viewDetails: string;
    cancel: string;
    submit: string;
    save: string;
    back: string;
    close: string;
    loading: string;
    synced: string;
    offline: string;
    syncNow: string;
    emergencyCall: string;
    complete: string;
    completed: string;
    pending: string;
    inProgress: string;
    accepted: string;
    created: string;
    rejected: string;
    high: string;
    medium: string;
    low: string;
    emergency: string;
    vitalSigns: string;
    bloodPressure: string;
    temperature: string;
    pulseRate: string;
    spO2: string;
    weight: string;
    bloodSugar: string;
    hemoglobin: string;
    age: string;
    years: string;
    gender: string;
    male: string;
    female: string;
    other: string;
    village: string;
    facility: string;
    phone: string;
    details: string;
    notes: string;
    time: string;
    today: string;
    cases: string;
  };
  login: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    trustAbha: string;
    trustGrid: string;
    trustVoice: string;
    quickLaunchpad: string;
    instantAccess: string;
    portalTabs: {
      patient: { title: string; sub: string; badge: string };
      doctor: { title: string; sub: string; badge: string };
      admin: { title: string; sub: string; badge: string };
      field: { title: string; sub: string; badge: string };
    };
    enterAbhaOrPhone: string;
    getOtp: string;
    otpAutoVerified: string;
    enterStaffId: string;
    enterPin: string;
    loginButton: string;
    loggingInTo: string;
    loggingInDesc: string;
  };
  patientPortal: {
    welcome: string;
    digitalConsentTitle: string;
    digitalConsentDesc: string;
    giveConsent: string;
    revokeConsent: string;
    consentGiven: string;
    consentNeeded: string;
    myReferralJourney: string;
    activeReferrals: string;
    upcomingAppointments: string;
    followUpTasks: string;
    healthPassport: string;
    linkedAsha: string;
    medicalHistory: string;
    noActiveReferrals: string;
    noAppointments: string;
    noFollowUps: string;
    emergencyHelp: string;
    dial108: string;
    ashaHelpline: string;
    assignedSubcentre: string;
    voiceBannerTitle: string;
    voiceBannerDesc: string;
    stepSubCentre: string;
    stepPhc: string;
    stepHospital: string;
    stepResolved: string;
    switchCitizenDemo: string;
    timelineButton: string;
  };
  ashaPortal: {
    title: string;
    searchPlaceholder: string;
    registerPatient: string;
    newEncounter: string;
    pendingTasks: string;
    createReferral: string;
    markComplete: string;
    triageAlert: string;
    offlineModeActive: string;
    syncPendingRecords: string;
    vitalEntry: string;
    symptomsSelection: string;
    outreachToday: string;
    tabRecord: string;
    tabTasks: string;
    tabReferrals: string;
    patientList: string;
    patientRegistrationTitle: string;
    fullName: string;
    bloodGroup: string;
    medicalConditions: string;
    saveAndRegister: string;
    recordVitalsAction: string;
    triageLevelLabel: string;
    generateReferralTo: string;
    referralReason: string;
    clinicalSummary: string;
  };
  anmPortal: {
    title: string;
    triageQueue: string;
    startTeleconsult: string;
    patientTimeline: string;
    escalateReferral: string;
    clinicalAssessment: string;
    filterAll: string;
    filterEmergency: string;
    filterHigh: string;
    filterMedium: string;
    recordAssessment: string;
    actionPrescribe: string;
    actionRefer: string;
    referralTarget: string;
    vitalsCheck: string;
  };
  doctorPortal: {
    title: string;
    referralQueue: string;
    acceptReferral: string;
    recordOutcome: string;
    assignFollowUp: string;
    caseSummary: string;
    diagnosis: string;
    treatmentRx: string;
    advice: string;
    sortUrgency: string;
    inboundReferrals: string;
    acceptAndReview: string;
    startTeleconsultWithPatient: string;
    addMedicine: string;
    dosagePlaceholder: string;
    followUpDue: string;
    saveConsultOutcome: string;
  };
  adminPortal: {
    title: string;
    kpiOverview: string;
    patientFlow: string;
    referralCompletionRate: string;
    followUpCompliance: string;
    highRiskCases: string;
    facilities: string;
    auditLog: string;
    tabOverview: string;
    tabReferrals: string;
    tabFacilities: string;
    tabAudit: string;
    totalPatients: string;
    totalReferrals: string;
    systemIntegrity: string;
  };
  voiceAssistant: {
    title: string;
    voiceCompanion: string;
    listening: string;
    speakNow: string;
    processing: string;
    quickQuestions: string;
    inputPlaceholder: string;
    replay: string;
    mute: string;
    unmute: string;
    connectedAsha: string;
    roleDesc: {
      patient: string;
      doctor: string;
      asha: string;
      anm: string;
      admin: string;
    };
  };
  teleconsult: {
    title: string;
    connecting: string;
    activeCall: string;
    endCall: string;
    patientVitals: string;
    clinicalChat: string;
    notes: string;
    typeMessage: string;
    send: string;
  };
  timeline: {
    title: string;
    subtitle: string;
    allCareEvents: string;
    eventEncounter: string;
    eventReferral: string;
    eventFollowUp: string;
  };
  auth: {
    portalLogin: string;
    selectRolePrompt: string;
    quickDemoLogin: string;
    quickDemoDesc: string;
    abhaMobileLogin: string;
    staffIdLogin: string;
    enterAbhaOrPhone: string;
    getOtp: string;
    enterOtp: string;
    verifyAndLogin: string;
    enterStaffId: string;
    enterPin: string;
    loginAs: string;
    switchUser: string;
    logout: string;
    loggedInAs: string;
    nationalHealthGrid: string;
    hackathonTag: string;
  };
}

export const translations: Record<string, TranslationStrings> = {
  en: {
    appName: 'Sanjeevani AI',
    appTagline: 'Continuity of Care for Rural & Community Health',
    roles: {
      patient: 'Patient / Citizen',
      asha: 'ASHA Frontline Worker',
      anm: 'ANM / CHO (Health Centre)',
      doctor: 'Medical Officer / Doctor',
      admin: 'Health Administrator'
    },
    header: {
      ribbonText: 'National Health Mission • Public Healthcare Continuity Network',
      abdmCertified: 'ABDM Certified Node',
      offline: 'Offline',
      liveSynced: 'Live Synced',
      sync: 'Sync',
      reset: 'Reset',
      voiceAssistant: 'Sanjeevani AI',
      voiceSubtitle: 'Voice Care Assistant',
      switchPortal: 'Switch Portal',
      exit: 'Exit',
      signedInAs: 'Signed in as',
      portalTitles: {
        patient: 'Citizen ABHA Portal',
        asha: 'ASHA Field Worker Portal',
        anm: 'CHO / ANM Sub-centre Portal',
        doctor: 'Doctor OPD & Clinical Portal',
        admin: 'District Health Command HQ'
      },
      tiers: {
        patient: 'Personal Health Locker',
        asha: 'Village Community Outreach',
        anm: 'Sub-centre HWC Node',
        doctor: 'PHC / Hospital Workstation',
        admin: 'Public Health Oversight'
      }
    },
    common: {
      search: 'Search...',
      filter: 'Filter',
      all: 'All',
      status: 'Status',
      urgency: 'Urgency',
      date: 'Date',
      action: 'Action',
      actions: 'Actions',
      viewDetails: 'View Details',
      cancel: 'Cancel',
      submit: 'Submit',
      save: 'Save',
      back: 'Back',
      close: 'Close',
      loading: 'Loading...',
      synced: 'Online (Synced)',
      offline: 'Offline Mode (Local Storage)',
      syncNow: 'Sync Now',
      emergencyCall: 'Emergency 108',
      complete: 'Complete',
      completed: 'Completed',
      pending: 'Pending',
      inProgress: 'In Progress',
      accepted: 'Accepted',
      created: 'Created',
      rejected: 'Rejected',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      emergency: 'Emergency',
      vitalSigns: 'Vital Signs',
      bloodPressure: 'Blood Pressure',
      temperature: 'Temperature',
      pulseRate: 'Pulse Rate',
      spO2: 'SpO2 Oxygen',
      weight: 'Weight',
      bloodSugar: 'Blood Sugar',
      hemoglobin: 'Hemoglobin',
      age: 'Age',
      years: 'Yrs',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      village: 'Village',
      facility: 'Facility',
      phone: 'Phone',
      details: 'Details',
      notes: 'Notes',
      time: 'Time',
      today: 'Today',
      cases: 'Cases'
    },
    login: {
      heroBadge: 'National Health Mission • Ayushman Bharat Digital Mission (ABDM)',
      heroTitle: 'Rural Healthcare Continuity & Care Coordination',
      heroSubtitle: 'Connecting Patients, ASHA workers, ANMs, Medical Officers, and District Administrators through real-time vital sync, teleconsultation, and multilingual AI voice guidance.',
      trustAbha: '100% ABHA Linked',
      trustGrid: 'Sub-centre ➔ PHC ➔ District Grid',
      trustVoice: 'Voice AI in Hindi, Marathi, English',
      quickLaunchpad: '⚡ Quick Demo Launchpad (Auto-OTP & Login)',
      instantAccess: '1-Click Instant Access',
      portalTabs: {
        patient: { title: 'Citizen / Patient', sub: 'ABHA & Personal Health', badge: 'Auto OTP (4821)' },
        doctor: { title: 'Doctor / Medical Officer', sub: 'Hospital & PHC OPD', badge: 'HPR Registry' },
        admin: { title: 'District Administration', sub: 'Health Command & KPIs', badge: 'DHO 2FA' },
        field: { title: 'ASHA / ANM / CHO', sub: 'Village & Sub-centre', badge: 'Field App' }
      },
      enterAbhaOrPhone: 'Enter 14-Digit ABHA ID or 10-Digit Mobile Number',
      getOtp: 'Get OTP',
      otpAutoVerified: 'Demo OTP (4821) Auto-Verified',
      enterStaffId: 'Enter Worker / Doctor / Admin ID (e.g. ASHA-MH-042)',
      enterPin: 'Enter Security PIN',
      loginButton: 'Sign In to Portal',
      loggingInTo: 'Logging in to',
      loggingInDesc: 'Loading clinical dashboard, ABHA records, and active workflow queue.'
    },
    patientPortal: {
      welcome: 'Namaste',
      digitalConsentTitle: 'ABHA Digital Health Record Consent',
      digitalConsentDesc: 'I authorize healthcare providers (ASHA, PHC & District Hospital) to securely access and link my health records for continuous medical care.',
      giveConsent: 'Grant Digital Consent',
      revokeConsent: 'Revoke Consent',
      consentGiven: 'Digital Consent Active (Linked to ABHA)',
      consentNeeded: 'Consent Needed',
      myReferralJourney: 'My Referral Progress Tracker',
      activeReferrals: 'Active Care & Referrals',
      upcomingAppointments: 'Upcoming Visits & Teleconsults',
      followUpTasks: 'Care Reminders & Home Visits',
      healthPassport: 'My Health Summary Card',
      linkedAsha: 'My Village ASHA Worker',
      medicalHistory: 'Recorded Conditions & Allergies',
      noActiveReferrals: 'No active hospital referrals right now.',
      noAppointments: 'No upcoming hospital appointments scheduled.',
      noFollowUps: 'No pending home visits scheduled at this time.',
      emergencyHelp: 'Emergency Assistance',
      dial108: 'Dial 108 for Ambulance',
      ashaHelpline: 'ASHA Helpline',
      assignedSubcentre: 'Assigned Sub-centre',
      voiceBannerTitle: 'Ask Anything by Voice in Your Language',
      voiceBannerDesc: 'Tap the microphone anytime to check medication timings, consult notes, or emergency ASHA contact.',
      stepSubCentre: 'Sub-centre Initial Check',
      stepPhc: 'PHC Triage / Doctor',
      stepHospital: 'District Specialist',
      stepResolved: 'Care & Follow-up Completed',
      switchCitizenDemo: 'Switch Citizen Demo Profile:',
      timelineButton: 'Full Patient Timeline'
    },
    ashaPortal: {
      title: 'ASHA Frontline Care Console',
      searchPlaceholder: 'Search patient by Name, ABHA ID or Village...',
      registerPatient: 'Register New Patient',
      newEncounter: 'Record Vitals & Symptoms',
      pendingTasks: 'Outreach & Follow-up Tasks',
      createReferral: 'Generate Care Referral',
      markComplete: 'Mark Visit Done',
      triageAlert: 'Automated Risk Assessment',
      offlineModeActive: 'Offline Mode: Field entries will automatically sync when online',
      syncPendingRecords: 'Sync Field Records to Server',
      vitalEntry: 'Record Patient Vitals',
      symptomsSelection: 'Reported Symptoms',
      outreachToday: 'Scheduled Home Visits Today',
      tabRecord: 'Record Encounter',
      tabTasks: 'Follow-up Tasks',
      tabReferrals: 'Active Referrals',
      patientList: 'Village Patient Registry',
      patientRegistrationTitle: 'Register Citizen in Village Roster',
      fullName: 'Full Name',
      bloodGroup: 'Blood Group',
      medicalConditions: 'Pre-existing Conditions / Medical History',
      saveAndRegister: 'Save & Generate ABHA ID',
      recordVitalsAction: 'Submit Vitals & Run AI Triage',
      triageLevelLabel: 'Calculated Triage Severity',
      generateReferralTo: 'Referral Destination Health Facility',
      referralReason: 'Clinical Reason for Referral',
      clinicalSummary: 'Brief Clinical Case Summary'
    },
    anmPortal: {
      title: 'Health & Wellness Centre / ANM Station',
      triageQueue: 'Prioritized Triage Queue',
      startTeleconsult: 'Connect Teleconsultation',
      patientTimeline: 'Longitudinal Patient Journey',
      escalateReferral: 'Escalate to Specialist / DH',
      clinicalAssessment: 'Record Clinical Assessment',
      filterAll: 'All Priorities',
      filterEmergency: 'Emergency',
      filterHigh: 'High Risk',
      filterMedium: 'Medium',
      recordAssessment: 'Record Sub-centre Assessment',
      actionPrescribe: 'Sub-centre Care',
      actionRefer: 'Escalate Referral to PHC',
      referralTarget: 'Referral Destination (PHC / Rural Hospital)',
      vitalsCheck: 'Re-verified Clinical Vitals'
    },
    doctorPortal: {
      title: 'Medical Officer & Specialist Consultation',
      referralQueue: 'Incoming Referral Queue',
      acceptReferral: 'Accept Case & Review',
      recordOutcome: 'Complete Consultation & Rx',
      assignFollowUp: 'Assign ASHA Home Follow-up',
      caseSummary: 'Clinical History & Vitals',
      diagnosis: 'Final Diagnosis',
      treatmentRx: 'Prescribed Medications',
      advice: 'Clinical Advice & Dietary Guidelines',
      sortUrgency: 'Sort by Urgency',
      inboundReferrals: 'Incoming Sub-centre Referrals',
      acceptAndReview: 'Accept Case & Start Review',
      startTeleconsultWithPatient: 'Start Live Teleconsultation',
      addMedicine: 'Add Medicine',
      dosagePlaceholder: 'e.g. Tab Amlodipine 5mg OD Post Meals',
      followUpDue: 'Follow-up Due Date',
      saveConsultOutcome: 'Finalize Consultation & Sign Rx'
    },
    adminPortal: {
      title: 'District Healthcare Coordination & KPI Oversight',
      kpiOverview: 'Health System Key Performance Indicators',
      patientFlow: 'Continuity of Care Patient Flow',
      referralCompletionRate: 'Referral Completion Rate',
      followUpCompliance: 'Home Follow-up Compliance',
      highRiskCases: 'Active High-Risk Cases',
      facilities: 'Connected Health Facilities',
      auditLog: 'System Audit & Traceability Log',
      tabOverview: 'KPI Overview',
      tabReferrals: 'Referral Tracker',
      tabFacilities: 'Facility Network',
      tabAudit: 'Audit Trail',
      totalPatients: 'Registered Citizens',
      totalReferrals: 'Active Referrals',
      systemIntegrity: '100% ABDM Interoperable'
    },
    voiceAssistant: {
      title: 'Sanjeevani AI',
      voiceCompanion: 'Voice Health & Care Companion',
      listening: 'Listening',
      speakNow: 'Speak clearly into your microphone',
      processing: 'Formulating clinical and health response...',
      quickQuestions: 'Quick voice questions:',
      inputPlaceholder: 'Ask in your language (e.g. What is my BP? What medicines to take?)...',
      replay: 'Replay Speech',
      mute: 'Mute Voice',
      unmute: 'Enable Voice',
      connectedAsha: 'Assigned ASHA Worker',
      roleDesc: {
        patient: 'Personal Citizen Health & Medicine Companion',
        doctor: 'Clinical Decision & Hospital OPD Copilot',
        asha: 'Village Screening & High-Risk Maternal Companion',
        anm: 'Sub-centre Health & Care Coordinator',
        admin: 'District Healthcare Command Analytics Copilot'
      }
    },
    teleconsult: {
      title: 'Live Teleconsultation Room',
      connecting: 'Connecting Encrypted ABDM Video Link...',
      activeCall: 'Active Medical Teleconsult',
      endCall: 'End Teleconsult',
      patientVitals: 'Real-Time Vitals',
      clinicalChat: 'Teleconsult Message Log',
      notes: 'Consultation Notes',
      typeMessage: 'Type message to doctor / patient...',
      send: 'Send'
    },
    timeline: {
      title: 'Longitudinal Patient Journey',
      subtitle: 'Complete 4-Tier ABDM Care History',
      allCareEvents: 'Chronological Health Records',
      eventEncounter: 'Clinical Encounter',
      eventReferral: 'Referral Escalation',
      eventFollowUp: 'ASHA Follow-up Visit'
    },
    auth: {
      portalLogin: 'National Healthcare Portal Login',
      selectRolePrompt: 'Select your role or identity to enter Sanjeevani AI',
      quickDemoLogin: '1-Click Role Login',
      quickDemoDesc: 'Select any profile below to instantly test and evaluate that role.',
      abhaMobileLogin: 'Citizen ABHA / Mobile OTP',
      staffIdLogin: 'Healthcare Staff & Official ID',
      enterAbhaOrPhone: 'Enter 14-Digit ABHA ID or 10-Digit Mobile Number',
      getOtp: 'Get OTP',
      enterOtp: 'Enter 4-digit OTP sent to mobile',
      verifyAndLogin: 'Verify OTP & Enter Portal',
      enterStaffId: 'Enter Worker / Doctor / Admin ID (e.g. ASHA-MH-042)',
      enterPin: 'Enter Security PIN',
      loginAs: 'Sign In As',
      switchUser: 'Switch User / Logout',
      logout: 'Sign Out',
      loggedInAs: 'Signed in as',
      nationalHealthGrid: 'Ayushman Bharat Digital Health Grid • Interoperable Care',
      hackathonTag: 'Smart India Hackathon (SIH PS 26133) Prototype'
    }
  },
  hi: {
    appName: 'संजीवनी AI',
    appTagline: 'ग्रामीण एवं सामुदायिक स्वास्थ्य के लिए निरंतर देखभाल प्रणाली',
    roles: {
      patient: 'मरीज़ / नागरिक',
      asha: 'आशा / स्वास्थ्य कार्यकर्ता',
      anm: 'एएनएम / सीएचओ (आरोग्य केंद्र)',
      doctor: 'चिकित्सा अधिकारी / डॉक्टर',
      admin: 'स्वास्थ्य प्रशासक'
    },
    header: {
      ribbonText: 'राष्ट्रीय स्वास्थ्य मिशन • सार्वजनिक स्वास्थ्य निरंतरता नेटवर्क',
      abdmCertified: 'एबीडीएम प्रमाणित नोड',
      offline: 'ऑफ़लाइन',
      liveSynced: 'लाइव सिंक',
      sync: 'सिंक करें',
      reset: 'रीसेट',
      voiceAssistant: 'संजीवनी AI',
      voiceSubtitle: 'वॉयस स्वास्थ्य सहायक',
      switchPortal: 'पोर्टल बदलें',
      exit: 'लॉगआउट',
      signedInAs: 'सक्रिय उपयोगकर्ता',
      portalTitles: {
        patient: 'नागरिक आभा पोर्टल',
        asha: 'आशा कार्यकर्ता पोर्टल',
        anm: 'सीएचओ / एएनएम उप-केंद्र पोर्टल',
        doctor: 'चिकित्सा अधिकारी ओपीडी पोर्टल',
        admin: 'जिला स्वास्थ्य कमान मुख्यालय'
      },
      tiers: {
        patient: 'व्यक्तिगत स्वास्थ्य लॉकर',
        asha: 'ग्राम स्तर गृह संपर्क',
        anm: 'उप-स्वास्थ्य केंद्र नोड',
        doctor: 'प्राथमिक स्वास्थ्य केंद्र / अस्पताल',
        admin: 'सार्वजनिक स्वास्थ्य निगरानी'
      }
    },
    common: {
      search: 'खोजें...',
      filter: 'फ़िल्टर',
      all: 'सभी',
      status: 'स्थिति',
      urgency: 'प्राथमिकता',
      date: 'तारीख',
      action: 'कार्रवाई',
      actions: 'कार्रवाइयां',
      viewDetails: 'विवरण देखें',
      cancel: 'रद्द करें',
      submit: 'जमा करें',
      save: 'सहेजें',
      back: 'वापस जाएं',
      close: 'बंद करें',
      loading: 'लोड हो रहा है...',
      synced: 'ऑनलाइन (सिंक हुआ)',
      offline: 'ऑफ़लाइन मोड (स्थानीय डेटा)',
      syncNow: 'अभी सिंक करें',
      emergencyCall: 'आपातकालीन 108',
      complete: 'पूरा करें',
      completed: 'पूर्ण',
      pending: 'लंबित',
      inProgress: 'प्रगति पर',
      accepted: 'स्वीकृत',
      created: 'बनाया गया',
      rejected: 'अस्वीकृत',
      high: 'उच्च (हाई)',
      medium: 'मध्यम',
      low: 'सामान्य (लो)',
      emergency: 'आपातकालीन (इमरजेंसी)',
      vitalSigns: 'शारीरिक माप (वाइटल्स)',
      bloodPressure: 'रक्तचाप (बीपी)',
      temperature: 'तापमान (बुखार)',
      pulseRate: 'नाड़ी गति (पल्स)',
      spO2: 'ऑक्सीजन (SpO2)',
      weight: 'वजन (किग्रा)',
      bloodSugar: 'ब्लड शुगर',
      hemoglobin: 'हीमोग्लोबिन',
      age: 'उम्र',
      years: 'वर्ष',
      gender: 'लिंग',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
      village: 'गाँव',
      facility: 'स्वास्थ्य केंद्र',
      phone: 'फ़ोन',
      details: 'विवरण',
      notes: 'टिप्पणी',
      time: 'समय',
      today: 'आज',
      cases: 'केस'
    },
    login: {
      heroBadge: 'राष्ट्रीय स्वास्थ्य मिशन • आयुष्मान भारत डिजिटल मिशन (ABDM)',
      heroTitle: 'ग्रामीण स्वास्थ्य निरंतरता एवं देखभाल समन्वय',
      heroSubtitle: 'मरीज़ों, आशा कार्यकर्ताओं, एएनएम, डॉक्टरों और जिला प्रशासकों को रीयल-टाइम वाइटल्स, टेलीकंसल्टेशन और बहुभाषी AI वॉयस सहायता से जोड़ना।',
      trustAbha: '१००% आभा से संबद्ध',
      trustGrid: 'उप-केंद्र ➔ पीएचसी ➔ जिला ग्रिड',
      trustVoice: 'हिन्दी, मराठी व अंग्रेजी में वॉयस AI',
      quickLaunchpad: '⚡ त्वरित डेमो लॉन्चपैड (ऑटो-ओटीपी एवं लॉगिन)',
      instantAccess: '१-क्लिक त्वरित प्रवेश',
      portalTabs: {
        patient: { title: 'नागरिक / मरीज़', sub: 'आभा एवं स्वास्थ्य रिकॉर्ड', badge: 'ऑटो ओटीपी (4821)' },
        doctor: { title: 'चिकित्सक / डॉक्टर', sub: 'अस्पताल एवं पीएचसी ओपीडी', badge: 'एचपीआर रजिस्ट्री' },
        admin: { title: 'जिला प्रशासन', sub: 'स्वास्थ्य कमान एवं सांख्यिकी', badge: 'डीएचओ 2FA' },
        field: { title: 'आशा / एएनएम / सीएचओ', sub: 'गाँव एवं उप-केंद्र', badge: 'फील्ड ऐप' }
      },
      enterAbhaOrPhone: '14-अंकों की आभा आईडी या 10-अंकों का मोबाइल नंबर दर्ज करें',
      getOtp: 'ओटीपी प्राप्त करें',
      otpAutoVerified: 'डेमो ओटीपी (4821) स्वतः सत्यापित',
      enterStaffId: 'कार्यकर्ता / डॉक्टर / एडमिन आईडी दर्ज करें (उदा. ASHA-MH-042)',
      enterPin: 'सुरक्षा पिन दर्ज करें',
      loginButton: 'पोर्टल में प्रवेश करें',
      loggingInTo: 'लॉगिन हो रहा है:',
      loggingInDesc: 'क्लिनिकल डैशबोर्ड, आभा रिकॉर्ड्स और सक्रिय कार्य सूची लोड की जा रही है।'
    },
    patientPortal: {
      welcome: 'नमस्ते',
      digitalConsentTitle: 'आभा डिजिटल स्वास्थ्य रिकॉर्ड सहमति',
      digitalConsentDesc: 'मैं आशा कार्यकर्ता, प्राथमिक स्वास्थ्य केंद्र व जिला अस्पताल को अपनी निरंतर चिकित्सा के लिए स्वास्थ्य रिकॉर्ड देखने की अनुमति देता/देती हूँ।',
      giveConsent: 'डिजिटल सहमति प्रदान करें',
      revokeConsent: 'सहमति वापस लें',
      consentGiven: 'डिजिटल सहमति सक्रिय है (आभा से संबद्ध)',
      consentNeeded: 'सहमति आवश्यक है',
      myReferralJourney: 'मेरी रेफरल प्रगति स्थिति',
      activeReferrals: 'सक्रिय उपचार एवं रेफरल',
      upcomingAppointments: 'आगामी अस्पताल विज़िट / परामर्श',
      followUpTasks: 'स्वास्थ्य अनुवर्ती (फॉलो-अप) अनुस्मारक',
      healthPassport: 'मेरा स्वास्थ्य सारांश कार्ड',
      linkedAsha: 'मेरी गांव की आशा कार्यकर्ता',
      medicalHistory: 'पूर्व स्वास्थ्य विवरण एवं एलर्जी',
      noActiveReferrals: 'वर्तमान में कोई सक्रिय रेफरल नहीं है।',
      noAppointments: 'कोई आगामी अपॉइंटमेंट निर्धारित नहीं है।',
      noFollowUps: 'वर्तमान में कोई लंबित गृह भेंट नहीं है।',
      emergencyHelp: 'आपातकालीन सहायता',
      dial108: 'एम्बुलेंस के लिए 108 डायल करें',
      ashaHelpline: 'आशा हेल्पलाइन',
      assignedSubcentre: 'संबद्ध उप-स्वास्थ्य केंद्र',
      voiceBannerTitle: 'अपनी भाषा में बोलकर तुरंत जानकारी लें',
      voiceBannerDesc: 'दवाइयों के समय, डॉक्टर की सलाह या आशा कार्यकर्ता से संपर्क के लिए माइक पर टैप करें।',
      stepSubCentre: 'उप-स्वास्थ्य केंद्र जांच',
      stepPhc: 'पीएचसी ट्राइएज / डॉक्टर',
      stepHospital: 'जिला विशेषज्ञ जांच',
      stepResolved: 'उपचार व फॉलो-अप संपन्न',
      switchCitizenDemo: 'नागरिक डेमो प्रोफ़ाइल बदलें:',
      timelineButton: 'मरीज़ की पूरी समय-रेखा'
    },
    ashaPortal: {
      title: 'आशा कार्यकर्ता कार्य कंसोल',
      searchPlaceholder: 'मरीज़ का नाम, आभा आईडी या गांव से खोजें...',
      registerPatient: 'नया मरीज़ पंजीकृत करें',
      newEncounter: 'वाइटल्स एवं लक्षण दर्ज करें',
      pendingTasks: 'गृह भेंट एवं फॉलो-अप कार्य',
      createReferral: 'अस्पताल रेफरल बनाएं',
      markComplete: 'भेंट संपन्न मार्क करें',
      triageAlert: 'स्वचालित जोखिम मूल्यांकन',
      offlineModeActive: 'ऑफ़लाइन मोड: इंटरनेट आने पर डेटा स्वतः सिंक होगा',
      syncPendingRecords: 'स्थानीय रिकॉर्ड्स सर्वर पर सिंक करें',
      vitalEntry: 'मरीज़ के वाइटल्स दर्ज करें',
      symptomsSelection: 'प्रमुख लक्षण',
      outreachToday: 'आज की निर्धारित गृह भेंट',
      tabRecord: 'जांच दर्ज करें',
      tabTasks: 'फॉलो-अप कार्य',
      tabReferrals: 'सक्रिय रेफरल',
      patientList: 'गाँव मरीज़ पंजिका',
      patientRegistrationTitle: 'ग्राम स्वास्थ्य पंजिका में पंजीकरण',
      fullName: 'पूरा नाम',
      bloodGroup: 'रक्त समूह',
      medicalConditions: 'पूर्व बीमारियां / स्वास्थ्य इतिहास',
      saveAndRegister: 'सहेजें व आभा आईडी बनाएं',
      recordVitalsAction: 'वाइटल्स जमा करें और AI ट्राइएज करें',
      triageLevelLabel: 'आंकलित ट्राइएज गंभीरता',
      generateReferralTo: 'रेफरल गंतव्य अस्पताल',
      referralReason: 'रेफरल का नैदानिक कारण',
      clinicalSummary: 'संक्षिप्त क्लिनिकल सारांश'
    },
    anmPortal: {
      title: 'आरोग्य केंद्र / एएनएम व सीएचओ डेस्क',
      triageQueue: 'प्राथमिकता आधारित ट्राइएज कतार',
      startTeleconsult: 'टेली-परामर्श शुरू करें',
      patientTimeline: 'मरीज़ की निरंतर स्वास्थ्य समय-रेखा',
      escalateReferral: 'विशेषज्ञ / जिला अस्पताल भेजें',
      clinicalAssessment: 'नैदानिक मूल्यांकन दर्ज करें',
      filterAll: 'सभी प्राथमिकताएं',
      filterEmergency: 'आपातकालीन',
      filterHigh: 'उच्च जोखिम',
      filterMedium: 'मध्यम',
      recordAssessment: 'उप-केंद्र मूल्यांकन दर्ज करें',
      actionPrescribe: 'उप-केंद्र उपचार',
      actionRefer: 'पीएचसी में रेफर करें',
      referralTarget: 'रेफरल गंतव्य (पीएचसी / अस्पताल)',
      vitalsCheck: 'सत्यापित क्लिनिकल वाइटल्स'
    },
    doctorPortal: {
      title: 'चिकित्सा अधिकारी एवं विशेषज्ञ परामर्श',
      referralQueue: 'आगमन रेफरल कतार',
      acceptReferral: 'केस स्वीकार करें और जांचें',
      recordOutcome: 'परामर्श व दवाई (Rx) दर्ज करें',
      assignFollowUp: 'आशा कार्यकर्ता को फॉलो-अप सौंपें',
      caseSummary: 'नैदानिक इतिहास व वाइटल्स',
      diagnosis: 'अंतिम निदान',
      treatmentRx: 'निर्धारित दवाइयां व सलाह',
      advice: 'चिकित्सीय सलाह एवं आहार नियम',
      sortUrgency: 'प्राथमिकता अनुसार क्रमबद्ध करें',
      inboundReferrals: 'उप-केंद्रों से आए रेफरल्स',
      acceptAndReview: 'केस स्वीकारें व जांच शुरू करें',
      startTeleconsultWithPatient: 'लाइव टेलीकंसल्टेशन शुरू करें',
      addMedicine: 'दवाई जोड़ें',
      dosagePlaceholder: 'उदा. Tab Amlodipine 5mg सुबह खाने के बाद',
      followUpDue: 'फॉलो-अप की निर्धारित तारीख',
      saveConsultOutcome: 'परामर्श पूरा करें और पर्ची जारी करें'
    },
    adminPortal: {
      title: 'जिला स्वास्थ्य समन्वय एवं सांख्यिकी डैशबोर्ड',
      kpiOverview: 'स्वास्थ्य प्रणाली मुख्य प्रदर्शन संकेतक',
      patientFlow: 'सतत स्वास्थ्य प्रवाह (Sub-centre → PHC → DH)',
      referralCompletionRate: 'रेफरल पूर्णता दर',
      followUpCompliance: 'गृह फॉलो-अप अनुपालन दर',
      highRiskCases: 'सक्रिय उच्च-जोखिम मामले',
      facilities: 'संबद्ध स्वास्थ्य केंद्र',
      auditLog: 'सिस्टम ऑडिट एवं पारदर्शिता लॉग',
      tabOverview: 'केपीआई सांख्यिकी',
      tabReferrals: 'रेफरल ट्रैकर',
      tabFacilities: 'स्वास्थ्य नेटवर्क',
      tabAudit: 'ऑडिट लॉग',
      totalPatients: 'पंजीकृत नागरिक',
      totalReferrals: 'सक्रिय रेफरल्स',
      systemIntegrity: '१००% एबीडीएम अनुकूल'
    },
    voiceAssistant: {
      title: 'संजीवनी AI',
      voiceCompanion: 'वॉयस स्वास्थ्य एवं देखभाल साथी',
      listening: 'सुन रहे हैं...',
      speakNow: 'अपने माइक्रोफ़ोन में स्पष्ट बोलें',
      processing: 'स्वास्थ्य और चिकित्सीय उत्तर तैयार हो रहा है...',
      quickQuestions: 'त्वरित वॉयस प्रश्न:',
      inputPlaceholder: 'यहाँ अपनी भाषा में पूछें (उदा. मेरा बीपी कितना है? दवा कब लेनी है?)...',
      replay: 'पुनः सुनें',
      mute: 'आवाज़ बंद करें',
      unmute: 'आवाज़ चालू करें',
      connectedAsha: 'संबद्ध आशा कार्यकर्ता',
      roleDesc: {
        patient: 'व्यक्तिगत नागरिक स्वास्थ्य एवं औषधि साथी',
        doctor: 'क्लिनिकल निर्णय एवं अस्पताल ओपीडी कोपायलट',
        asha: 'ग्राम स्तर जांच एवं मातृ स्वास्थ्य साथी',
        anm: 'उप-केंद्र स्वास्थ्य एवं देखभाल समन्वयक',
        admin: 'जिला स्वास्थ्य कमान सांख्यिकी कोपायलट'
      }
    },
    teleconsult: {
      title: 'लाइव टेली-परामर्श कक्ष',
      connecting: 'सुरक्षित एबीडीएम वीडियो लिंक जुड़ रहा है...',
      activeCall: 'सक्रिय चिकित्सीय परामर्श',
      endCall: 'परामर्श समाप्त करें',
      patientVitals: 'लाइव शारीरिक माप',
      clinicalChat: 'परामर्श संदेश लॉग',
      notes: 'चिकित्सीय टिप्पणियां',
      typeMessage: 'डॉक्टर या मरीज़ को संदेश लिखें...',
      send: 'भेजें'
    },
    timeline: {
      title: 'मरीज़ की सतत स्वास्थ्य समय-रेखा',
      subtitle: 'संपूर्ण ४-स्तरीय एबीडीएम देखभाल इतिहास',
      allCareEvents: 'कालक्रमानुसार स्वास्थ्य रिकॉर्ड्स',
      eventEncounter: 'क्लिनिकल जांच',
      eventReferral: 'अस्पताल रेफरल',
      eventFollowUp: 'आशा गृह भेंट'
    },
    auth: {
      portalLogin: 'राष्ट्रीय स्वास्थ्य समन्वय पोर्टल लॉगिन',
      selectRolePrompt: 'संजीवनी AI में प्रवेश के लिए अपनी भूमिका या पहचान चुनें',
      quickDemoLogin: '१-क्लिक रोल लॉगिन',
      quickDemoDesc: 'किसी भी भूमिका को तुरंत जांचने और मूल्यांकन करने के लिए नीचे दी गई प्रोफ़ाइल चुनें।',
      abhaMobileLogin: 'नागरिक आभा / मोबाइल ओटीपी',
      staffIdLogin: 'स्वास्थ्य कर्मी एवं अधिकारी आईडी',
      enterAbhaOrPhone: '14-अंकों की आभा आईडी या 10-अंकों का मोबाइल नंबर दर्ज करें',
      getOtp: 'ओटीपी प्राप्त करें',
      enterOtp: 'मोबाइल पर भेजा गया 4-अंकों का ओटीपी दर्ज करें',
      verifyAndLogin: 'ओटीपी सत्यापित करें और पोर्टल में प्रवेश करें',
      enterStaffId: 'कार्यकर्ता / डॉक्टर / एडमिन आईडी दर्ज करें (उदा. ASHA-MH-042)',
      enterPin: 'सुरक्षा पिन दर्ज करें',
      loginAs: 'लॉगिन करें',
      switchUser: 'यूज़र बदलें / लॉगआउट',
      logout: 'लॉगआउट',
      loggedInAs: 'सक्रिय खाता',
      nationalHealthGrid: 'आयुष्मान भारत डिजिटल मिशन • निरंतर स्वास्थ्य समन्वय',
      hackathonTag: 'स्मार्ट इंडिया हैकाथॉन (SIH PS 26133) प्रोटोटाइप'
    }
  },
  mr: {
    appName: 'संजीवनी AI',
    appTagline: 'ग्रामीण व समुदाय आरोग्यासाठी अखंड काळजी प्रणाली',
    roles: {
      patient: 'रुग्ण / नागरिक',
      asha: 'आशा / आरोग्य सेविका',
      anm: 'एएनएम / सीएचओ (आरोग्य केंद्र)',
      doctor: 'वैद्यकीय अधिकारी / डॉक्टर',
      admin: 'आरोग्य प्रशासक'
    },
    header: {
      ribbonText: 'राष्ट्रीय आरोग्य अभियान • सार्वजनिक आरोग्य अखंडता नेटवर्क',
      abdmCertified: 'एबीडीएम प्रमाणित नोड',
      offline: 'ऑफलाइन',
      liveSynced: 'थेट सिंक',
      sync: 'सिंक करा',
      reset: 'रीसेट',
      voiceAssistant: 'संजीवनी AI',
      voiceSubtitle: 'व्हॉईस आरोग्य सहाय्यक',
      switchPortal: 'पोर्टल बदला',
      exit: 'लॉगआउट',
      signedInAs: 'सक्रिय वापरकर्ता',
      portalTitles: {
        patient: 'नागरिक आभा पोर्टल',
        asha: 'आशा सेविका पोर्टल',
        anm: 'सीएचओ / एएनएम उप-केंद्र पोर्टल',
        doctor: 'वैद्यकीय अधिकारी ओपीडी पोर्टल',
        admin: 'जिल्हा आरोग्य कमान मुख्यालय'
      },
      tiers: {
        patient: 'वैयक्तिक आरोग्य लॉकर',
        asha: 'ग्राम समुदाय गृहभेट',
        anm: 'उप-आरोग्य केंद्र नोड',
        doctor: 'प्राथमिक आरोग्य केंद्र / रुग्णालय',
        admin: 'सार्वजनिक आरोग्य देखरेख'
      }
    },
    common: {
      search: 'शोधा...',
      filter: 'फिल्टर',
      all: 'सर्व',
      status: 'स्थिती',
      urgency: 'प्राधान्यता',
      date: 'दिनांक',
      action: 'कृती',
      actions: 'कृती',
      viewDetails: 'तपशील पहा',
      cancel: 'रद्द करा',
      submit: 'सादर करा',
      save: 'जतन करा',
      back: 'मागे जा',
      close: 'बंद करा',
      loading: 'लोड होत आहे...',
      synced: 'ऑनलाइन (सिंक झाले)',
      offline: 'ऑफलाइन मोड (स्थानिक डेटा)',
      syncNow: 'आता सिंक करा',
      emergencyCall: 'आपत्कालीन 108',
      complete: 'पूर्ण करा',
      completed: 'पूर्ण झाले',
      pending: 'प्रलंबित',
      inProgress: 'प्रगतीपथावर',
      accepted: 'स्वीकारले',
      created: 'तयार केले',
      rejected: 'नाकारले',
      high: 'उच्च (हाय)',
      medium: 'मध्यम',
      low: 'सामान्य (लो)',
      emergency: 'आपत्कालीन (इमर्जन्सी)',
      vitalSigns: 'शारीरिक तपासणी (व्हाइटल्स)',
      bloodPressure: 'रक्तदाब (बीपी)',
      temperature: 'तापमान',
      pulseRate: 'नाडीचे ठोके (पल्स)',
      spO2: 'ऑक्सिजन (SpO2)',
      weight: 'वजन (किग्रॅ)',
      bloodSugar: 'रक्त शर्करा',
      hemoglobin: 'हिमोग्लोबिन',
      age: 'वय',
      years: 'वर्षे',
      gender: 'लिंग',
      male: 'पुरुष',
      female: 'स्त्री',
      other: 'इतर',
      village: 'गाव',
      facility: 'आरोग्य केंद्र',
      phone: 'फोन',
      details: 'तपशील',
      notes: 'नोंद',
      time: 'वेळ',
      today: 'आज',
      cases: 'रुग्ण'
    },
    login: {
      heroBadge: 'राष्ट्रीय आरोग्य अभियान • आयुष्मान भारत डिजिटल मिशन (ABDM)',
      heroTitle: 'ग्रामीण आरोग्य अखंडता व काळजी समन्वय',
      heroSubtitle: 'रुग्ण, आशा सेविका, एएनएम, वैद्यकीय अधिकारी आणि जिल्हा प्रशासक यांना थेट व्हाइटल्स, टेलिकन्सल्टेशन आणि बहुभाषिक AI आवाजाद्वारे जोडणे.',
      trustAbha: '१००% आभा संलग्न',
      trustGrid: 'उप-केंद्र ➔ प्रा.आ.केंद्र ➔ जिल्हा ग्रिड',
      trustVoice: 'मराठी, हिंदी व इंग्रजीत व्हॉईस AI',
      quickLaunchpad: '⚡ जलद डेमो लॉन्चपॅड (ऑटो-ओटीपी व लॉगिन)',
      instantAccess: '१-क्लिक थेट प्रवेश',
      portalTabs: {
        patient: { title: 'नागरिक / रुग्ण', sub: 'आभा व वैयक्तिक आरोग्य', badge: 'ऑटो ओटीपी (4821)' },
        doctor: { title: 'वैद्यकीय अधिकारी / डॉक्टर', sub: 'रुग्णालय व ओपीडी', badge: 'एचपीआर नोंदणी' },
        admin: { title: 'जिल्हा प्रशासन', sub: 'आरोग्य कमान व आकडेवारी', badge: 'डीएचओ 2FA' },
        field: { title: 'आशा / एएनएम / सीएचओ', sub: 'गाव व उप-केंद्र', badge: 'फील्ड ॲप' }
      },
      enterAbhaOrPhone: '१४-अंकी आभा आयडी किंवा १०-अंकी मोबाइल नंबर टाका',
      getOtp: 'ओटीपी मिळवा',
      otpAutoVerified: 'डेमो ओटीपी (4821) आपोआप पडताळणी झाली',
      enterStaffId: 'कर्मचारी / डॉक्टर / प्रशासक आयडी टाका (उदा. ASHA-MH-042)',
      enterPin: 'सुरक्षा पिन टाका',
      loginButton: 'पोर्टलमध्ये प्रवेश करा',
      loggingInTo: 'लॉगिन होत आहे:',
      loggingInDesc: 'वैद्यकीय डॅशबोर्ड, आभा नोंदी आणि कार्य यादी उघडत आहे.'
    },
    patientPortal: {
      welcome: 'नमस्कार',
      digitalConsentTitle: 'आभा डिजिटल आरोग्य संमती',
      digitalConsentDesc: 'मी आशा सेविका, प्राथमिक आरोग्य केंद्र आणि जिल्हा रुग्णालयाला माझ्या निरंतर उपचारासाठी आरोग्य नोंदी पाहण्याची संमती देतो/देते.',
      giveConsent: 'डिजिटल संमती द्या',
      revokeConsent: 'संमती मागे घ्या',
      consentGiven: 'डिजिटल संमती सक्रिय आहे (आभा संलग्न)',
      consentNeeded: 'संमती आवश्यक आहे',
      myReferralJourney: 'माझी रेफरल प्रगती स्थिती',
      activeReferrals: 'सक्रिय उपचार व रेफरल',
      upcomingAppointments: 'पुढील तपासणी व सल्लामसलत',
      followUpTasks: 'आरोग्य तपासणी स्मरणपत्रे',
      healthPassport: 'माझे आरोग्य माहिती पत्रक',
      linkedAsha: 'माझ्या गावातील आशा सेविका',
      medicalHistory: 'मागील आजार व ऍलर्जी',
      noActiveReferrals: 'सध्या कोणतेही सक्रिय रेफरल नाही.',
      noAppointments: 'सध्या कोणतीही पुढील भेट नियोजित नाही.',
      noFollowUps: 'सध्या कोणतीही गृहभेट प्रलंबित नाही.',
      emergencyHelp: 'आपत्कालीन मदत',
      dial108: 'रुग्णवाहिकेसाठी 108 डायल करा',
      ashaHelpline: 'आशा हेल्पलाइन',
      assignedSubcentre: 'संलग्न उप-आरोग्य केंद्र',
      voiceBannerTitle: 'आपल्या भाषेत बोलून त्वरित माहिती मिळवा',
      voiceBannerDesc: 'औषधांच्या वेळा, डॉक्टरांचा सल्ला किंवा आशा सेविकेशी संपर्कासाठी माइकवर टॅप करा.',
      stepSubCentre: 'उप-आरोग्य केंद्र तपासणी',
      stepPhc: 'प्राथमिक आरोग्य केंद्र / डॉक्टर',
      stepHospital: 'जिल्हा तज्ज्ञ तपासणी',
      stepResolved: 'उपचार व पाठपुरावा पूर्ण',
      switchCitizenDemo: 'नागरिक डेमो प्रोफाइल बदला:',
      timelineButton: 'रुग्णाचा संपूर्ण प्रवास'
    },
    ashaPortal: {
      title: 'आशा सेविका कार्य प्रणाली',
      searchPlaceholder: 'रुग्णाचे नाव, आभा आयडी किंवा गावाने शोधा...',
      registerPatient: 'नवीन रुग्ण नोंदणी',
      newEncounter: 'व्हाइटल्स व लक्षणे नोंदवा',
      pendingTasks: 'गृहभेटी व पाठपुरावा कामे',
      createReferral: 'रुग्णालय रेफरल तयार करा',
      markComplete: 'भेट पूर्ण नोंदवा',
      triageAlert: 'स्वयंचलित जोखीम मूल्यमापन',
      offlineModeActive: 'ऑफलाइन मोड: इंटरनेट सुरू होताच डेटा आपोआप सिंक होईल',
      syncPendingRecords: 'नोंदी सर्व्हरवर सिंक करा',
      vitalEntry: 'रुग्णाचे व्हाइटल्स नोंदवा',
      symptomsSelection: 'लक्षणे निवडा',
      outreachToday: 'आजच्या नियोजित गृहभेटी',
      tabRecord: 'तपासणी नोंदवा',
      tabTasks: 'पाठपुरावा कामे',
      tabReferrals: 'सक्रिय रेफरल्स',
      patientList: 'गाव रुग्ण यादी',
      patientRegistrationTitle: 'गाव आरोग्य नोंदवहीत नोंदणी',
      fullName: 'पूर्ण नाव',
      bloodGroup: 'रक्त गट',
      medicalConditions: 'मागील आजार / आरोग्य इतिहास',
      saveAndRegister: 'जतन करा व आभा आयडी बनवा',
      recordVitalsAction: 'व्हाइटल्स सादर करा व AI ट्राइएज करा',
      triageLevelLabel: 'गणित ट्राइएज तीव्रता',
      generateReferralTo: 'रेफरल पाठवण्याचे आरोग्य केंद्र',
      referralReason: 'रेफरलचे वैद्यकीय कारण',
      clinicalSummary: 'संक्षिप्त वैद्यकीय सारांश'
    },
    anmPortal: {
      title: 'आरोग्यवर्धिनी केंद्र / एएनएम व सीएचओ डेस्क',
      triageQueue: 'प्राधान्यक्रमानुसार ट्राइएज रांग',
      startTeleconsult: 'टेली-कन्सल्टेशन सुरू करा',
      patientTimeline: 'रुग्णाचा संपूर्ण प्रवास व इतिहास',
      escalateReferral: 'तज्ज्ञ / जिल्हा रुग्णालयाकडे पाठवा',
      clinicalAssessment: 'वैद्यकीय तपासणी नोंदवा',
      filterAll: 'सर्व प्राधान्य',
      filterEmergency: 'आपत्कालीन',
      filterHigh: 'उच्च जोखीम',
      filterMedium: 'मध्यम',
      recordAssessment: 'उप-केंद्र तपासणी नोंदवा',
      actionPrescribe: 'उप-केंद्र उपचार',
      actionRefer: 'प्राथमिक आरोग्य केंद्राकडे पाठवा',
      referralTarget: 'रेफरल गंतव्य (प्रा.आ.केंद्र / रुग्णालय)',
      vitalsCheck: 'तपासलेले क्लिनिकल व्हाइटल्स'
    },
    doctorPortal: {
      title: 'वैद्यकीय अधिकारी व तज्ज्ञ सल्लामसलत',
      referralQueue: 'येणाऱ्या रेफरलची यादी',
      acceptReferral: 'केस स्वीकारा व तपासा',
      recordOutcome: 'निदान व औषधे (Rx) नोंदवा',
      assignFollowUp: 'आशा सेविकेला पाठपुरावा सोपवा',
      caseSummary: 'रुग्णाचा वैद्यकीय इतिहास व व्हाइटल्स',
      diagnosis: 'अंतिम निदान',
      treatmentRx: 'दिलेली औषधे व पथ्ये',
      advice: 'वैद्यकीय सल्ला व पथ्य नियम',
      sortUrgency: 'प्राधान्यक्रमाने लावा',
      inboundReferrals: 'उप-केंद्रांकडून आलेले रेफरल्स',
      acceptAndReview: 'केस स्वीकारा व तपासणी करा',
      startTeleconsultWithPatient: 'लाइव्ह टेलिकन्सल्टेशन सुरू करा',
      addMedicine: 'औषध जोडा',
      dosagePlaceholder: 'उदा. Tab Amlodipine 5mg सकाळी जेवणानंतर',
      followUpDue: 'पुढील तपासणीची तारीख',
      saveConsultOutcome: 'सल्लामसलत पूर्ण करा व औषधपत्र द्या'
    },
    adminPortal: {
      title: 'जिल्हा आरोग्य समन्वय व डॅशबोर्ड',
      kpiOverview: 'आरोग्य यंत्रणा मुख्य कामगिरी निर्देशांक',
      patientFlow: 'सलग रुग्ण प्रवाह (उप-केंद्र → प्रा.आ.केंद्र → जि.रुग्णालय)',
      referralCompletionRate: 'रेफरल पूर्णता दर',
      followUpCompliance: 'गृह पाठपुरावा पूर्तता दर',
      highRiskCases: 'सक्रिय उच्च-जोखीम रुग्ण',
      facilities: 'संलग्न आरोग्य केंद्रे',
      auditLog: 'प्रणाली ऑडिट व पारदर्शकता नोंद',
      tabOverview: 'कामगिरी आढावा',
      tabReferrals: 'रेफरल ट्रॅकर',
      tabFacilities: 'आरोग्य जाळे',
      tabAudit: 'ऑडिट नोंद',
      totalPatients: 'नोंदणीकृत नागरिक',
      totalReferrals: 'सक्रिय रेफरल्स',
      systemIntegrity: '१००% एबीडीएम अनुकूल'
    },
    voiceAssistant: {
      title: 'संजीवनी AI',
      voiceCompanion: 'व्हॉईस आरोग्य व काळजी सहाय्यक',
      listening: 'ऐकत आहे...',
      speakNow: 'आपल्या मायक्रोफोनमध्ये स्पष्ट बोला',
      processing: 'आरोग्य व वैद्यकीय उत्तर तयार होत आहे...',
      quickQuestions: 'जलद विचारणा निवडा:',
      inputPlaceholder: 'येथे आपल्या भाषेत विचारा (उदा. माझा बीपी किती आहे? औषध कसे घ्यावे?)...',
      replay: 'पुन्हा ऐका',
      mute: 'आवाज बंद करा',
      unmute: 'आवाज सुरू करा',
      connectedAsha: 'संलग्न आशा सेविका',
      roleDesc: {
        patient: 'वैयक्तिक नागरिक आरोग्य व औषध साथी',
        doctor: 'क्लिनिकल निर्णय व रुग्णालय ओपीडी कोपायलट',
        asha: 'गाव पातळीवरील तपासणी व माता आरोग्य साथी',
        anm: 'उप-केंद्र आरोग्य व काळजी समन्वयक',
        admin: 'जिल्हा आरोग्य कमान विश्लेषण कोपायलट'
      }
    },
    teleconsult: {
      title: 'थेट टेली-कन्सल्टेशन कक्ष',
      connecting: 'सुरक्षित एबीडीएम व्हिडिओ लिंक जोडत आहे...',
      activeCall: 'सक्रिय वैद्यकीय सल्लामसलत',
      endCall: 'कन्सल्टेशन संपवा',
      patientVitals: 'थेट शारीरिक तपासणी',
      clinicalChat: 'कन्सल्टेशन संदेश नोंद',
      notes: 'वैद्यकीय नोंदी',
      typeMessage: 'डॉक्टर किंवा रुग्णाला संदेश लिहा...',
      send: 'पाठवा'
    },
    timeline: {
      title: 'रुग्णाचा सलग आरोग्य प्रवास',
      subtitle: 'संपूर्ण ४-स्तरीय एबीडीएम इतिहास',
      allCareEvents: 'काळक्रमानुसार आरोग्य नोंदी',
      eventEncounter: 'क्लिनिकल तपासणी',
      eventReferral: 'रुग्णालय रेफरल',
      eventFollowUp: 'आशा गृहभेट'
    },
    auth: {
      portalLogin: 'राष्ट्रीय आरोग्य समन्वय पोर्टल लॉगिन',
      selectRolePrompt: 'संजीवनी AI मध्ये प्रवेश करण्यासाठी तुमची भूमिका किंवा ओळख निवडा',
      quickDemoLogin: '१-क्लिक रोल लॉगिन',
      quickDemoDesc: 'कोणत्याही भूमिकेची त्वरित चाचणी आणि मूल्यांकन करण्यासाठी खालील प्रोफाइल निवडा.',
      abhaMobileLogin: 'नागरिक आभा / मोबाइल ओटीपी',
      staffIdLogin: 'आरोग्य कर्मचारी व अधिकारी आयडी',
      enterAbhaOrPhone: '१४-अंकी आभा आयडी किंवा १०-अंकी मोबाइल नंबर टाका',
      getOtp: 'ओटीपी मिळवा',
      enterOtp: 'मोबाईलवर आलेला ४-अंकी ओटीपी टाका',
      verifyAndLogin: 'ओटीपी पडताळणी करा आणि पोर्टल उघडा',
      enterStaffId: 'कर्मचारी / डॉक्टर / प्रशासक आयडी टाका (उदा. ASHA-MH-042)',
      enterPin: 'सुरक्षा पिन टाका',
      loginAs: 'लॉगिन करा',
      switchUser: 'वापरकर्ता बदला / लॉगआउट',
      logout: 'लॉगआउट',
      loggedInAs: 'सक्रिय वापरकर्ता',
      nationalHealthGrid: 'आयुष्मान भारत डिजिटल मिशन • सलग आरोग्य समन्वय',
      hackathonTag: 'स्मार्ट इंडिया हॅकाथॉन (SIH PS 26133) प्रोटोटाइप'
    }
  }
};
