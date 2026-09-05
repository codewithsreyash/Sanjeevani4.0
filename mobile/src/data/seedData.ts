import { Patient, Encounter, Referral, FollowUp, Appointment, Facility, AuditLog, UserProfile } from '../types';

export const initialFacilities: Facility[] = [
  {
    id: 'fac-1',
    name: 'Rampur Health Sub-centre',
    type: 'Sub-centre',
    block: 'Chandur Block',
    district: 'Nashik',
    contactPerson: 'Sunita Bai (ASHA) / Anita ANM',
    phone: '+91 98230 11223',
    activeStaffCount: 3,
    teleconsultAvailable: true
  },
  {
    id: 'fac-2',
    name: 'Chandur Primary Health Centre (PHC)',
    type: 'PHC',
    block: 'Chandur Block',
    district: 'Nashik',
    contactPerson: 'Dr. Rajesh Kulkarni (Medical Officer)',
    phone: '+91 98230 44556',
    activeStaffCount: 12,
    teleconsultAvailable: true
  },
  {
    id: 'fac-3',
    name: 'Igatpuri Rural / Community Hospital (CHC)',
    type: 'Rural Hospital',
    block: 'Igatpuri Block',
    district: 'Nashik',
    contactPerson: 'Dr. Meena Deshmukh (Surgeon/OBGYN)',
    phone: '+91 98230 77889',
    activeStaffCount: 28,
    teleconsultAvailable: true
  },
  {
    id: 'fac-4',
    name: 'Nashik District Civil Hospital',
    type: 'District Hospital',
    block: 'Nashik Central',
    district: 'Nashik',
    contactPerson: 'Dr. Vivek Joshi (Civil Surgeon)',
    phone: '+91 98230 99001',
    activeStaffCount: 85,
    teleconsultAvailable: true
  }
];

export const initialPatients: Patient[] = [
  {
    id: 'pat-101',
    abhaId: '91-4829-1029-3321',
    name: 'Savita Devi',
    age: 26,
    gender: 'Female',
    phone: '+91 94231 55678',
    village: 'Rampur',
    language: 'hi',
    linkedAshaName: 'Sunita Bai (ASHA)',
    linkedAshaPhone: '+91 98230 11223',
    registeredDate: '2026-08-12',
    bloodGroup: 'B+',
    allergies: ['Penicillin'],
    chronicConditions: ['High-Risk ANC (28 weeks)', 'Gestational Hypertension'],
    medicalHistory: 'Gravida 2, Para 1. Previous normal delivery. Current pregnancy flagged due to elevated BP and pedal edema.',
    hasGivenDigitalConsent: true,
    avatarColor: 'bg-rose-600',
    lastVitals: {
      bpSystolic: 148,
      bpDiastolic: 96,
      temperature: 98.4,
      pulse: 88,
      weight: 58,
      spO2: 97,
      bloodSugar: 110,
      hemoglobin: 9.8
    }
  },
  {
    id: 'pat-102',
    abhaId: '91-3819-4451-9902',
    name: 'Meena Patil',
    age: 48,
    gender: 'Female',
    phone: '+91 94231 88123',
    village: 'Pimpalgaon',
    language: 'mr',
    linkedAshaName: 'Sunita Bai (ASHA)',
    linkedAshaPhone: '+91 98230 11223',
    registeredDate: '2026-07-20',
    bloodGroup: 'O+',
    allergies: ['None known'],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Hypertension'],
    medicalHistory: 'Diagnosed with Type 2 Diabetes 4 years ago. Irregular medication adherence due to travel distance from PHC.',
    hasGivenDigitalConsent: true,
    avatarColor: 'bg-indigo-600',
    lastVitals: {
      bpSystolic: 162,
      bpDiastolic: 98,
      temperature: 98.6,
      pulse: 82,
      weight: 64,
      spO2: 96,
      bloodSugar: 248,
      hemoglobin: 12.1
    }
  },
  {
    id: 'pat-103',
    abhaId: '91-7721-0091-6654',
    name: 'Rameshwar Shinde',
    age: 62,
    gender: 'Male',
    phone: '+91 94231 22901',
    village: 'Rampur',
    language: 'mr',
    linkedAshaName: 'Sunita Bai (ASHA)',
    linkedAshaPhone: '+91 98230 11223',
    registeredDate: '2026-06-15',
    bloodGroup: 'A+',
    allergies: ['Sulfa drugs'],
    chronicConditions: ['COPD / Chronic Bronchitis', 'Coronary Artery Disease'],
    medicalHistory: 'Ex-smoker, chronic cough with breathlessness on exertion. History of ischemic heart disease.',
    hasGivenDigitalConsent: true,
    avatarColor: 'bg-emerald-600',
    lastVitals: {
      bpSystolic: 134,
      bpDiastolic: 84,
      temperature: 99.1,
      pulse: 94,
      weight: 56,
      spO2: 91,
      bloodSugar: 132,
      hemoglobin: 13.5
    }
  }
];

export const initialEncounters: Encounter[] = [
  {
    id: 'enc-201',
    patientId: 'pat-101',
    patientName: 'Savita Devi',
    recordedByRole: 'asha',
    recordedByName: 'Sunita Bai (ASHA)',
    facilityName: 'Rampur Village Doorstep',
    facilityType: 'Sub-centre',
    date: '2026-09-04',
    symptoms: ['Headache', 'Swelling in feet (pedal edema)', 'Occasional dizziness'],
    symptomNotes: 'Patient complains of persistent morning headache. Swelling observed above ankles. Fetal movements reported active.',
    vitals: {
      bpSystolic: 148,
      bpDiastolic: 96,
      pulse: 88,
      temperature: 98.4,
      weight: 58,
      spO2: 97,
      hemoglobin: 9.8
    },
    triagePriority: 'high',
    riskReason: 'High-risk ANC pregnancy; Gestational Hypertension (BP 148/96 mmHg); Borderline Anemia (Hb 9.8)',
    actionTaken: 'Flagged High Priority. Initiated emergency teleconsultation with PHC Medical Officer. Administered Calcium and IFA.'
  }
];

export const initialReferrals: Referral[] = [
  {
    id: 'ref-401',
    patientId: 'pat-101',
    patientName: 'Savita Devi',
    patientAge: 26,
    patientGender: 'Female',
    patientVillage: 'Rampur',
    fromFacility: 'Rampur Health Sub-centre',
    fromFacilityType: 'Sub-centre',
    toFacility: 'Chandur Primary Health Centre (PHC)',
    toFacilityType: 'PHC',
    referredByRole: 'anm',
    referredByName: 'Priya Sharma (CHO)',
    reason: 'Severe pregnancy-induced hypertension (BP 148/96) at 28w ANC with bilateral pedal edema.',
    urgency: 'high',
    status: 'Accepted',
    createdAt: '09:30 AM, Today',
    acceptedAt: '10:05 AM, Today',
    acceptedByName: 'Dr. Rajesh Kulkarni (Medical Officer)',
    clinicalSummary: '28 weeks primigravida presenting with elevated BP readings on 2 consecutive visits. Urine albumin trace positive. Requires OBGYN evaluation.'
  }
];

export const initialFollowUps: FollowUp[] = [
  {
    id: 'fol-301',
    patientId: 'pat-101',
    patientName: 'Savita Devi',
    patientVillage: 'Rampur',
    patientPhone: '+91 94231 55678',
    type: 'maternal',
    dueDate: '2026-09-08',
    assignedToAshaName: 'Sunita Bai (ASHA)',
    status: 'pending',
    instructions: 'Check morning BP, evaluate facial/pedal edema, check medicine adherence (Labetalol 100mg BD), ensure next ANC appointment at PHC.',
    createdByName: 'Dr. Rajesh Kulkarni',
    createdByRole: 'doctor',
    createdAt: '2026-09-04',
    referralId: 'ref-401'
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-501',
    patientId: 'pat-101',
    patientName: 'Savita Devi',
    providerName: 'Dr. Rajesh Kulkarni',
    providerRole: 'Medical Officer (PHC)',
    facilityName: 'Chandur Primary Health Centre (PHC)',
    date: '2026-09-06',
    time: '11:00 AM',
    type: 'teleconsult',
    status: 'Scheduled',
    teleconsultLink: 'https://meet.sanjeevani.gov.in/phc-chandur-pat-101',
    purpose: 'Follow-up Evaluation for Gestational Hypertension & Ultrasound Review'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '10:05 AM, 2026-09-05',
    actorRole: 'doctor',
    actorName: 'Dr. Rajesh Kulkarni',
    action: 'Referral Accepted',
    facility: 'Chandur PHC',
    patientId: 'pat-101',
    patientName: 'Savita Devi',
    details: 'Accepted referral #ref-401 for Savita Devi. Added to PHC consultation queue.'
  }
];

export const demoUsers: UserProfile[] = [
  {
    id: 'usr-asha-1',
    name: 'Sunita Bai',
    role: 'asha',
    identifier: 'ASHA-NSK-4421',
    facility: 'Rampur Health Sub-centre',
    village: 'Rampur',
    phone: '+91 98230 11223',
    designation: 'Accredited Social Health Activist (ASHA)',
    avatarColor: 'bg-teal-600'
  },
  {
    id: 'usr-anm-1',
    name: 'Priya Sharma',
    role: 'anm',
    identifier: 'CHO-MH-8819',
    facility: 'Rampur Health & Wellness Centre',
    village: 'Rampur',
    phone: '+91 98230 33445',
    designation: 'Community Health Officer (CHO / ANM)',
    avatarColor: 'bg-sky-600'
  },
  {
    id: 'usr-doc-1',
    name: 'Dr. Rajesh Kulkarni',
    role: 'doctor',
    identifier: 'MCI-MH-2012-0982',
    facility: 'Chandur Primary Health Centre (PHC)',
    phone: '+91 98230 44556',
    designation: 'Medical Officer (MBBS, DNB Family Medicine)',
    avatarColor: 'bg-indigo-600'
  },
  {
    id: 'usr-pat-1',
    name: 'Savita Devi',
    role: 'patient',
    identifier: 'ABHA: 91-4829-1029-3321',
    facility: 'Rampur Sub-centre Area',
    village: 'Rampur',
    phone: '+91 94231 55678',
    designation: 'Citizen / Patient',
    avatarColor: 'bg-rose-600',
    linkedPatientId: 'pat-101'
  },
  {
    id: 'usr-adm-1',
    name: 'Dr. Vivek Joshi',
    role: 'admin',
    identifier: 'CS-NSK-HQ',
    facility: 'Nashik District Health Directorate',
    phone: '+91 98230 99001',
    designation: 'Civil Surgeon & Chief Medical Officer',
    avatarColor: 'bg-slate-900'
  }
];
