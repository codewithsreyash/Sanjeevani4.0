import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Patient,
  Encounter,
  Referral,
  FollowUp,
  Appointment,
  Facility,
  AuditLog,
  UserProfile,
  Vitals,
  FollowUpType
} from '../types';

const BASE_URL_STORAGE_KEY = 'sanjeevani_api_base_url_v1';

// Default host resolution for web, android emulator, or physical devices
const getDefaultBaseUrl = (): string => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }
  // Android emulator uses 10.0.2.2 to access the host machine's localhost
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
};

let currentBaseUrl: string = getDefaultBaseUrl();

// Load persisted custom URL if user configured it
AsyncStorage.getItem(BASE_URL_STORAGE_KEY).then(saved => {
  if (saved) currentBaseUrl = saved;
});

export const setApiBaseUrl = async (newUrl: string) => {
  currentBaseUrl = newUrl.replace(/\/+$/, '');
  await AsyncStorage.setItem(BASE_URL_STORAGE_KEY, currentBaseUrl);
};

export const getApiBaseUrl = (): string => currentBaseUrl;

export interface BootstrapResponse {
  patients: Patient[];
  encounters: Encounter[];
  referrals: Referral[];
  followUps: FollowUp[];
  appointments: Appointment[];
  facilities: Facility[];
  auditLogs: AuditLog[];
  users: UserProfile[];
}

export interface DbStatus {
  engine: string;
  dbPath: string;
  fileSizeBytes: number;
  counts: {
    patients: number;
    encounters: number;
    referrals: number;
    followUps: number;
    appointments: number;
    auditLogs: number;
  };
  status: 'connected' | 'disconnected';
  timestamp: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${currentBaseUrl}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s network timeout

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      signal: controller.signal,
      ...options
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      throw new Error(`API error ${res.status}: ${errorText || res.statusText}`);
    }

    return res.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const mobileApi = {
  async getStatus(): Promise<DbStatus> {
    return request<DbStatus>('/api/status');
  },

  async getBootstrap(): Promise<BootstrapResponse> {
    return request<BootstrapResponse>('/api/bootstrap');
  },

  async resetDatabase(): Promise<{ message: string; data: BootstrapResponse }> {
    return request<{ message: string; data: BootstrapResponse }>('/api/reset', {
      method: 'POST'
    });
  },

  // Patients
  async getPatients(): Promise<Patient[]> {
    return request<Patient[]>('/api/patients');
  },

  async createPatient(patient: Patient): Promise<Patient> {
    return request<Patient>('/api/patients', {
      method: 'POST',
      body: JSON.stringify(patient)
    });
  },

  async toggleConsent(id: string, consent: boolean): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/patients/${id}/consent`, {
      method: 'PATCH',
      body: JSON.stringify({ consent })
    });
  },

  // Encounters
  async getEncounters(): Promise<Encounter[]> {
    return request<Encounter[]>('/api/encounters');
  },

  async createEncounter(encounter: Encounter): Promise<Encounter> {
    return request<Encounter>('/api/encounters', {
      method: 'POST',
      body: JSON.stringify(encounter)
    });
  },

  // Referrals
  async getReferrals(): Promise<Referral[]> {
    return request<Referral[]>('/api/referrals');
  },

  async createReferral(referral: Referral): Promise<Referral> {
    return request<Referral>('/api/referrals', {
      method: 'POST',
      body: JSON.stringify(referral)
    });
  },

  async acceptReferral(referralId: string, doctorName: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/referrals/${referralId}/accept`, {
      method: 'PATCH',
      body: JSON.stringify({ doctorName })
    });
  },

  async recordConsultationOutcome(
    referralId: string,
    outcome: {
      doctorName: string;
      diagnosis: string;
      treatmentPlan: string;
      prescribedMedicines: string[];
      advice: string;
      consultationDate: string;
    },
    followUp?: any
  ): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/referrals/${referralId}/outcome`, {
      method: 'PATCH',
      body: JSON.stringify({ outcome, followUp })
    });
  },

  // Follow-ups
  async getFollowUps(): Promise<FollowUp[]> {
    return request<FollowUp[]>('/api/followups');
  },

  async completeFollowUp(followUpId: string, completionNotes: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/followups/${followUpId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completionNotes })
    });
  },

  // AI Voice Endpoint
  async queryAiAssistant(query: string, language: string, role: string, patientContext?: any): Promise<{ text?: string; fallback?: boolean }> {
    return request<{ text?: string; fallback?: boolean }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ query, language, role, patientContext })
    });
  },

  // Batch Offline Sync
  async syncBatch(data: any): Promise<{ success: boolean; syncedCount: number }> {
    return request<{ success: boolean; syncedCount: number }>('/api/sync', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
