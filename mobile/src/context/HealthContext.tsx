import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserRole,
  Language,
  Patient,
  Encounter,
  Referral,
  FollowUp,
  Appointment,
  Facility,
  AuditLog,
  TriagePriority,
  Vitals,
  FollowUpType,
  UserProfile
} from '../types';
import {
  initialPatients,
  initialEncounters,
  initialReferrals,
  initialFollowUps,
  initialAppointments,
  initialFacilities,
  initialAuditLogs,
  demoUsers
} from '../data/seedData';
import { calculateTriage } from '../utils/triage';
import { mobileApi, DbStatus } from '../services/api';

const STORAGE_PREFIX = 'sanjeevani_mobile_';

interface HealthContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  login: (user: UserProfile) => void;
  switchUserRole: (role: UserRole) => void;
  availableUsers: UserProfile[];
  language: Language;
  setLanguage: (lang: Language) => void;

  // Data
  patients: Patient[];
  encounters: Encounter[];
  referrals: Referral[];
  followUps: FollowUp[];
  appointments: Appointment[];
  facilities: Facility[];
  auditLogs: AuditLog[];

  // Database Connection & Sync
  dbConnected: boolean;
  dbStats: DbStatus | null;
  refreshFromBackend: () => Promise<void>;

  // Offline Simulation
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  pendingOfflineSyncCount: number;
  syncOfflineQueue: () => Promise<void>;

  // Selected State
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;

  // Actions
  addPatient: (data: Omit<Patient, 'id' | 'registeredDate' | 'avatarColor'>) => Patient;
  recordEncounter: (data: {
    patientId: string;
    symptoms: string[];
    symptomNotes: string;
    vitals: Vitals;
    facilityName: string;
    facilityType: 'Sub-centre' | 'PHC' | 'Rural Hospital' | 'District Hospital';
    recordedByName: string;
    actionTaken: string;
  }) => { encounter: Encounter; triagePriority: TriagePriority };
  createReferral: (data: {
    patientId: string;
    fromFacility: string;
    fromFacilityType: string;
    toFacility: string;
    toFacilityType: string;
    reason: string;
    urgency: TriagePriority;
    clinicalSummary: string;
  }) => Referral;
  acceptReferral: (referralId: string, doctorName: string) => void;
  recordConsultationOutcome: (
    referralId: string,
    outcome: {
      doctorName: string;
      diagnosis: string;
      treatmentPlan: string;
      prescribedMedicines: string[];
      advice: string;
    },
    followUp?: {
      type: FollowUpType;
      dueDate: string;
      instructions: string;
      assignedToAshaName: string;
    }
  ) => void;
  completeFollowUp: (followUpId: string, completionNotes: string) => void;
  togglePatientConsent: (patientId: string) => void;
  resetDemoData: () => Promise<void>;

  // Notifications
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(demoUsers[0]); // Sunita Bai (ASHA)
  const [currentRole, setCurrentRole] = useState<UserRole>('asha');
  const [language, setLanguage] = useState<Language>('en');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [pendingOfflineSyncCount, setPendingOfflineSyncCount] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);

  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [dbStats, setDbStats] = useState<DbStatus | null>(null);

  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [encounters, setEncounters] = useState<Encounter[]>(initialEncounters);
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals);
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-101');

  // Load cached data from AsyncStorage on app launch
  useEffect(() => {
    const loadCached = async () => {
      try {
        const [p, e, r, f, a] = await Promise.all([
          AsyncStorage.getItem(STORAGE_PREFIX + 'patients'),
          AsyncStorage.getItem(STORAGE_PREFIX + 'encounters'),
          AsyncStorage.getItem(STORAGE_PREFIX + 'referrals'),
          AsyncStorage.getItem(STORAGE_PREFIX + 'followups'),
          AsyncStorage.getItem(STORAGE_PREFIX + 'appointments')
        ]);
        if (p) setPatients(JSON.parse(p));
        if (e) setEncounters(JSON.parse(e));
        if (r) setReferrals(JSON.parse(r));
        if (f) setFollowUps(JSON.parse(f));
        if (a) setAppointments(JSON.parse(a));
      } catch (err) {
        console.warn('Failed to load cached AsyncStorage data', err);
      }
    };
    loadCached();
  }, []);

  // Sync to AsyncStorage on state updates for offline resilience
  useEffect(() => {
    try {
      AsyncStorage.setItem(STORAGE_PREFIX + 'patients', JSON.stringify(patients));
      AsyncStorage.setItem(STORAGE_PREFIX + 'encounters', JSON.stringify(encounters));
      AsyncStorage.setItem(STORAGE_PREFIX + 'referrals', JSON.stringify(referrals));
      AsyncStorage.setItem(STORAGE_PREFIX + 'followups', JSON.stringify(followUps));
      AsyncStorage.setItem(STORAGE_PREFIX + 'appointments', JSON.stringify(appointments));
    } catch (e) {
      console.warn('AsyncStorage cache write error', e);
    }
  }, [patients, encounters, referrals, followUps, appointments]);

  // Sync from backend SQLite database
  const refreshFromBackend = useCallback(async () => {
    try {
      const [bootstrap, stats] = await Promise.all([
        mobileApi.getBootstrap(),
        mobileApi.getStatus().catch(() => null)
      ]);

      if (bootstrap) {
        setPatients(bootstrap.patients);
        setEncounters(bootstrap.encounters);
        setReferrals(bootstrap.referrals);
        setFollowUps(bootstrap.followUps);
        setAppointments(bootstrap.appointments);
        setFacilities(bootstrap.facilities);
        setAuditLogs(bootstrap.auditLogs);
        setDbConnected(true);
      }

      if (stats) {
        setDbStats(stats);
      }
    } catch (err) {
      setDbConnected(false);
    }
  }, []);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  // Flash notification timer
  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  const login = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.role === 'patient' && user.linkedPatientId) {
      setSelectedPatientId(user.linkedPatientId);
    }
    setNotification(`Switched to ${user.name} (${user.designation})`);
  };

  const switchUserRole = (role: UserRole) => {
    const matched = demoUsers.find(u => u.role === role);
    if (matched) login(matched);
    else setCurrentRole(role);
  };

  const addPatient = (data: Omit<Patient, 'id' | 'registeredDate' | 'avatarColor'>): Patient => {
    const colors = ['bg-teal-600', 'bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600'];
    const newPatient: Patient = {
      ...data,
      id: `pat-${Date.now().toString().slice(-4)}`,
      registeredDate: new Date().toISOString().split('T')[0],
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      abhaId: data.abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setPatients(prev => [newPatient, ...prev]);
    setSelectedPatientId(newPatient.id);

    if (isOffline) {
      setPendingOfflineSyncCount(c => c + 1);
    } else {
      mobileApi.createPatient(newPatient).catch(() => {
        setPendingOfflineSyncCount(c => c + 1);
      });
    }

    setNotification(`Patient ${newPatient.name} registered!`);
    return newPatient;
  };

  const recordEncounter = (data: {
    patientId: string;
    symptoms: string[];
    symptomNotes: string;
    vitals: Vitals;
    facilityName: string;
    facilityType: 'Sub-centre' | 'PHC' | 'Rural Hospital' | 'District Hospital';
    recordedByName: string;
    actionTaken: string;
  }) => {
    const pat = patients.find(p => p.id === data.patientId);
    const patName = pat ? pat.name : 'Patient';
    const isPregnant = pat?.chronicConditions?.some(c => c.toLowerCase().includes('anc') || c.toLowerCase().includes('pregnant')) || false;
    const triage = calculateTriage(data.vitals, data.symptoms, isPregnant);

    const newEncounter: Encounter = {
      id: `enc-${Date.now().toString().slice(-4)}`,
      patientId: data.patientId,
      patientName: patName,
      recordedByRole: currentRole,
      recordedByName: data.recordedByName || currentUser.name,
      facilityName: data.facilityName,
      facilityType: data.facilityType,
      date: new Date().toISOString().split('T')[0],
      symptoms: data.symptoms,
      symptomNotes: data.symptomNotes,
      vitals: data.vitals,
      triagePriority: triage.priority,
      riskReason: triage.reasons.join('; '),
      actionTaken: data.actionTaken
    };

    setEncounters(prev => [newEncounter, ...prev]);

    // Update patient last vitals
    setPatients(prev =>
      prev.map(p => {
        if (p.id === data.patientId) {
          return { ...p, lastVitals: data.vitals };
        }
        return p;
      })
    );

    if (isOffline) {
      setPendingOfflineSyncCount(c => c + 1);
    } else {
      mobileApi.createEncounter(newEncounter).catch(() => {
        setPendingOfflineSyncCount(c => c + 1);
      });
    }

    setNotification(`Vitals recorded! Auto-Triage: ${triage.priority.toUpperCase()}`);
    return { encounter: newEncounter, triagePriority: triage.priority };
  };

  const createReferral = (data: {
    patientId: string;
    fromFacility: string;
    fromFacilityType: string;
    toFacility: string;
    toFacilityType: string;
    reason: string;
    urgency: TriagePriority;
    clinicalSummary: string;
  }): Referral => {
    const pat = patients.find(p => p.id === data.patientId);
    const newReferral: Referral = {
      id: `ref-${Math.floor(500 + Math.random() * 500)}`,
      patientId: data.patientId,
      patientName: pat?.name || 'Patient',
      patientAge: pat?.age || 30,
      patientGender: pat?.gender || 'Female',
      patientVillage: pat?.village || 'Rampur',
      fromFacility: data.fromFacility,
      fromFacilityType: data.fromFacilityType,
      toFacility: data.toFacility,
      toFacilityType: data.toFacilityType,
      referredByRole: currentRole,
      referredByName: currentUser.name,
      reason: data.reason,
      urgency: data.urgency,
      status: 'Created',
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ', Today',
      clinicalSummary: data.clinicalSummary
    };

    setReferrals(prev => [newReferral, ...prev]);

    if (isOffline) {
      setPendingOfflineSyncCount(c => c + 1);
    } else {
      mobileApi.createReferral(newReferral).catch(() => {
        setPendingOfflineSyncCount(c => c + 1);
      });
    }

    setNotification(`Referral #${newReferral.id} created! Sent to ${data.toFacility}`);
    return newReferral;
  };

  const acceptReferral = (referralId: string, doctorName: string) => {
    setReferrals(prev =>
      prev.map(r => {
        if (r.id === referralId) {
          return {
            ...r,
            status: 'Accepted',
            acceptedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ', Today',
            acceptedByName: doctorName || currentUser.name
          };
        }
        return r;
      })
    );

    if (!isOffline) {
      mobileApi.acceptReferral(referralId, doctorName).catch(() => {});
    }

    setNotification(`Referral #${referralId} accepted into OPD queue!`);
  };

  const recordConsultationOutcome = (
    referralId: string,
    outcome: {
      doctorName: string;
      diagnosis: string;
      treatmentPlan: string;
      prescribedMedicines: string[];
      advice: string;
    },
    followUp?: {
      type: FollowUpType;
      dueDate: string;
      instructions: string;
      assignedToAshaName: string;
    }
  ) => {
    let patId = '';
    let patName = '';

    setReferrals(prev =>
      prev.map(r => {
        if (r.id === referralId) {
          patId = r.patientId;
          patName = r.patientName;
          return {
            ...r,
            status: 'Completed',
            completedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ', Today',
            consultationOutcome: {
              ...outcome,
              consultationDate: new Date().toISOString().split('T')[0]
            }
          };
        }
        return r;
      })
    );

    let newFollowUpRecord: FollowUp | undefined = undefined;
    if (followUp && patId) {
      const pat = patients.find(p => p.id === patId);
      newFollowUpRecord = {
        id: `fol-${Date.now().toString().slice(-4)}`,
        patientId: patId,
        patientName: patName || pat?.name || 'Patient',
        patientVillage: pat?.village || 'Rampur',
        patientPhone: pat?.phone || '+91 98000 00000',
        type: followUp.type,
        dueDate: followUp.dueDate,
        assignedToAshaName: followUp.assignedToAshaName || 'Sunita Bai (ASHA)',
        status: 'pending',
        instructions: followUp.instructions,
        createdByName: outcome.doctorName,
        createdByRole: 'doctor',
        createdAt: new Date().toISOString().split('T')[0],
        referralId: referralId
      };
      setFollowUps(prev => [newFollowUpRecord!, ...prev]);
    }

    if (!isOffline) {
      mobileApi.recordConsultationOutcome(referralId, {
        ...outcome,
        consultationDate: new Date().toISOString().split('T')[0]
      }, newFollowUpRecord).catch(() => {});
    }

    setNotification('Consultation recorded & follow-up dispatched to ASHA!');
  };

  const completeFollowUp = (followUpId: string, completionNotes: string) => {
    setFollowUps(prev =>
      prev.map(f => {
        if (f.id === followUpId) {
          return {
            ...f,
            status: 'completed',
            completedDate: new Date().toISOString().split('T')[0],
            completionNotes: completionNotes || 'Home visit completed. Vitals checked and adherence confirmed.'
          };
        }
        return f;
      })
    );

    if (!isOffline) {
      mobileApi.completeFollowUp(followUpId, completionNotes).catch(() => {});
    }

    setNotification('Follow-up visit marked completed! Care loop closed.');
  };

  const togglePatientConsent = (patientId: string) => {
    let nextVal = false;
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          nextVal = !p.hasGivenDigitalConsent;
          return { ...p, hasGivenDigitalConsent: nextVal };
        }
        return p;
      })
    );

    if (!isOffline) {
      mobileApi.toggleConsent(patientId, nextVal).catch(() => {});
    }

    setNotification('ABHA digital consent updated.');
  };

  const syncOfflineQueue = async () => {
    try {
      await mobileApi.syncBatch({
        patients,
        encounters,
        referrals,
        followUps,
        appointments,
        auditLogs
      });
      setPendingOfflineSyncCount(0);
      setNotification('All field records synchronized with Central SQLite Database!');
      refreshFromBackend();
    } catch (err: any) {
      setNotification('Sync failed. Please check network/backend connection.');
    }
  };

  const resetDemoData = async () => {
    try {
      await mobileApi.resetDatabase();
      await AsyncStorage.clear();
      await refreshFromBackend();
      setNotification('Reset database to clean initial state.');
    } catch (e) {
      setPatients(initialPatients);
      setEncounters(initialEncounters);
      setReferrals(initialReferrals);
      setFollowUps(initialFollowUps);
      setAppointments(initialAppointments);
      setNotification('Local state reset to default.');
    }
  };

  return (
    <HealthContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        login,
        switchUserRole,
        availableUsers: demoUsers,
        language,
        setLanguage,
        patients,
        encounters,
        referrals,
        followUps,
        appointments,
        facilities,
        auditLogs,
        dbConnected,
        dbStats,
        refreshFromBackend,
        isOffline,
        setIsOffline,
        pendingOfflineSyncCount,
        syncOfflineQueue,
        selectedPatientId,
        setSelectedPatientId,
        addPatient,
        recordEncounter,
        createReferral,
        acceptReferral,
        recordConsultationOutcome,
        completeFollowUp,
        togglePatientConsent,
        resetDemoData,
        notification,
        setNotification
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
