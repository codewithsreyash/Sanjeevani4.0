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

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    ...options
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${errorText || res.statusText}`);
  }

  return res.json();
}

export const api = {
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

  async getPatient(id: string): Promise<Patient> {
    return request<Patient>(`/api/patients/${id}`);
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

  async updateVitals(id: string, vitals: Vitals): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/patients/${id}/vitals`, {
      method: 'PATCH',
      body: JSON.stringify({ vitals })
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

  async acceptReferral(referralId: string, doctorName: string, acceptedAt?: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/referrals/${referralId}/accept`, {
      method: 'PATCH',
      body: JSON.stringify({ doctorName, acceptedAt })
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
    followUp?: {
      id: string;
      patientId: string;
      patientName: string;
      patientVillage: string;
      patientPhone: string;
      type: FollowUpType;
      dueDate: string;
      assignedToAshaName: string;
      status: 'pending';
      instructions: string;
      createdByName: string;
      createdByRole: 'doctor';
      createdAt: string;
      referralId: string;
    }
  ): Promise<{ success: boolean; followUp?: FollowUp }> {
    return request<{ success: boolean; followUp?: FollowUp }>(`/api/referrals/${referralId}/outcome`, {
      method: 'PATCH',
      body: JSON.stringify({
        outcome,
        completedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ', Today',
        followUp
      })
    });
  },

  // Follow-ups
  async getFollowUps(): Promise<FollowUp[]> {
    return request<FollowUp[]>('/api/followups');
  },

  async createFollowUp(followUp: FollowUp): Promise<FollowUp> {
    return request<FollowUp>('/api/followups', {
      method: 'POST',
      body: JSON.stringify(followUp)
    });
  },

  async completeFollowUp(followUpId: string, completionNotes: string, completedDate?: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/followups/${followUpId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({
        completionNotes,
        completedDate: completedDate || new Date().toISOString().split('T')[0]
      })
    });
  },

  // Appointments
  async getAppointments(): Promise<Appointment[]> {
    return request<Appointment[]>('/api/appointments');
  },

  async createAppointment(appointment: Appointment): Promise<Appointment> {
    return request<Appointment>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment)
    });
  },

  // Facilities
  async getFacilities(): Promise<Facility[]> {
    return request<Facility[]>('/api/facilities');
  },

  // Audit Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    return request<AuditLog[]>('/api/audit-logs');
  },

  async createAuditLog(auditLog: AuditLog): Promise<AuditLog> {
    return request<AuditLog>('/api/audit-logs', {
      method: 'POST',
      body: JSON.stringify(auditLog)
    });
  },

  // Users
  async getUsers(): Promise<UserProfile[]> {
    return request<UserProfile[]>('/api/users');
  },

  // Batch Offline Sync
  async syncBatch(data: {
    patients?: Patient[];
    encounters?: Encounter[];
    referrals?: Referral[];
    followUps?: FollowUp[];
    appointments?: Appointment[];
    auditLogs?: AuditLog[];
  }): Promise<{ success: boolean; syncedCount: number }> {
    return request<{ success: boolean; syncedCount: number }>('/api/sync', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
