import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
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
  TriagePriority,
  FollowUpType,
  FollowUpStatus,
  ReferralStatus,
  UserRole
} from '../src/types.ts';
import {
  initialPatients,
  initialEncounters,
  initialReferrals,
  initialFollowUps,
  initialAppointments,
  initialFacilities,
  initialAuditLogs,
  demoUsers
} from '../src/data/seedData.ts';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'sanjeevani.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    // Optimize performance and reliability
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA foreign_keys = ON;');
  }
  return dbInstance;
}

export function initDb(): void {
  const db = getDb();

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      abhaId TEXT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      phone TEXT NOT NULL,
      village TEXT NOT NULL,
      language TEXT NOT NULL,
      linkedAshaName TEXT NOT NULL,
      linkedAshaPhone TEXT NOT NULL,
      registeredDate TEXT NOT NULL,
      bloodGroup TEXT,
      allergies TEXT, -- JSON array
      chronicConditions TEXT, -- JSON array
      medicalHistory TEXT NOT NULL,
      hasGivenDigitalConsent INTEGER NOT NULL DEFAULT 1,
      avatarColor TEXT NOT NULL,
      lastVitals TEXT -- JSON object
    );

    CREATE TABLE IF NOT EXISTS encounters (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      patientName TEXT NOT NULL,
      recordedByRole TEXT NOT NULL,
      recordedByName TEXT NOT NULL,
      facilityName TEXT NOT NULL,
      facilityType TEXT NOT NULL,
      date TEXT NOT NULL,
      symptoms TEXT NOT NULL, -- JSON array
      symptomNotes TEXT NOT NULL,
      vitals TEXT NOT NULL, -- JSON object
      triagePriority TEXT NOT NULL,
      riskReason TEXT NOT NULL,
      diagnosisNotes TEXT,
      medications TEXT, -- JSON array
      actionTaken TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      patientName TEXT NOT NULL,
      patientAge INTEGER NOT NULL,
      patientGender TEXT NOT NULL,
      patientVillage TEXT NOT NULL,
      fromFacility TEXT NOT NULL,
      fromFacilityType TEXT NOT NULL,
      toFacility TEXT NOT NULL,
      toFacilityType TEXT NOT NULL,
      referredByRole TEXT NOT NULL,
      referredByName TEXT NOT NULL,
      reason TEXT NOT NULL,
      urgency TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      acceptedAt TEXT,
      acceptedByName TEXT,
      completedAt TEXT,
      clinicalSummary TEXT,
      consultationOutcome TEXT, -- JSON object
      linkedEncounterId TEXT
    );

    CREATE TABLE IF NOT EXISTS follow_ups (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      patientName TEXT NOT NULL,
      patientVillage TEXT NOT NULL,
      patientPhone TEXT NOT NULL,
      type TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      assignedToAshaName TEXT NOT NULL,
      status TEXT NOT NULL,
      instructions TEXT NOT NULL,
      createdByName TEXT NOT NULL,
      createdByRole TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      completedDate TEXT,
      completionNotes TEXT,
      referralId TEXT
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patientId TEXT NOT NULL,
      patientName TEXT NOT NULL,
      providerName TEXT NOT NULL,
      providerRole TEXT NOT NULL,
      facilityName TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      teleconsultLink TEXT,
      purpose TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS facilities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      block TEXT NOT NULL,
      district TEXT NOT NULL,
      contactPerson TEXT NOT NULL,
      phone TEXT NOT NULL,
      activeStaffCount INTEGER NOT NULL,
      teleconsultAvailable INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      actorRole TEXT NOT NULL,
      actorName TEXT NOT NULL,
      action TEXT NOT NULL,
      patientId TEXT,
      patientName TEXT,
      facility TEXT NOT NULL,
      details TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      identifier TEXT NOT NULL,
      facility TEXT NOT NULL,
      village TEXT,
      phone TEXT,
      designation TEXT NOT NULL,
      avatarColor TEXT,
      linkedPatientId TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_encounters_patient ON encounters(patientId);
    CREATE INDEX IF NOT EXISTS idx_referrals_patient ON referrals(patientId);
    CREATE INDEX IF NOT EXISTS idx_followups_asha ON follow_ups(assignedToAshaName);
    CREATE INDEX IF NOT EXISTS idx_followups_patient ON follow_ups(patientId);
  `);

  // Check if patients table is empty, if so, seed database
  const countRow = db.prepare('SELECT COUNT(*) as count FROM patients').get() as { count: number };
  if (countRow.count === 0) {
    seedDatabase();
  }
}

export function seedDatabase(): void {
  const db = getDb();

  // Clear existing rows
  db.exec(`
    DELETE FROM patients;
    DELETE FROM encounters;
    DELETE FROM referrals;
    DELETE FROM follow_ups;
    DELETE FROM appointments;
    DELETE FROM facilities;
    DELETE FROM audit_logs;
    DELETE FROM users;
  `);

  // Insert Facilities
  const insertFacility = db.prepare(`
    INSERT INTO facilities (id, name, type, block, district, contactPerson, phone, activeStaffCount, teleconsultAvailable)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const f of initialFacilities) {
    insertFacility.run(
      f.id,
      f.name,
      f.type,
      f.block,
      f.district,
      f.contactPerson,
      f.phone,
      f.activeStaffCount,
      f.teleconsultAvailable ? 1 : 0
    );
  }

  // Insert Patients
  const insertPatient = db.prepare(`
    INSERT INTO patients (id, abhaId, name, age, gender, phone, village, language, linkedAshaName, linkedAshaPhone, registeredDate, bloodGroup, allergies, chronicConditions, medicalHistory, hasGivenDigitalConsent, avatarColor, lastVitals)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const p of initialPatients) {
    insertPatient.run(
      p.id,
      p.abhaId || null,
      p.name,
      p.age,
      p.gender,
      p.phone,
      p.village,
      p.language,
      p.linkedAshaName,
      p.linkedAshaPhone,
      p.registeredDate,
      p.bloodGroup || null,
      p.allergies ? JSON.stringify(p.allergies) : null,
      p.chronicConditions ? JSON.stringify(p.chronicConditions) : null,
      p.medicalHistory,
      p.hasGivenDigitalConsent ? 1 : 0,
      p.avatarColor,
      p.lastVitals ? JSON.stringify(p.lastVitals) : null
    );
  }

  // Insert Encounters
  const insertEncounter = db.prepare(`
    INSERT INTO encounters (id, patientId, patientName, recordedByRole, recordedByName, facilityName, facilityType, date, symptoms, symptomNotes, vitals, triagePriority, riskReason, diagnosisNotes, medications, actionTaken)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const e of initialEncounters) {
    insertEncounter.run(
      e.id,
      e.patientId,
      e.patientName,
      e.recordedByRole,
      e.recordedByName,
      e.facilityName,
      e.facilityType,
      e.date,
      JSON.stringify(e.symptoms),
      e.symptomNotes,
      JSON.stringify(e.vitals),
      e.triagePriority,
      e.riskReason,
      e.diagnosisNotes || null,
      e.medications ? JSON.stringify(e.medications) : null,
      e.actionTaken
    );
  }

  // Insert Referrals
  const insertReferral = db.prepare(`
    INSERT INTO referrals (id, patientId, patientName, patientAge, patientGender, patientVillage, fromFacility, fromFacilityType, toFacility, toFacilityType, referredByRole, referredByName, reason, urgency, status, createdAt, acceptedAt, acceptedByName, completedAt, clinicalSummary, consultationOutcome, linkedEncounterId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const r of initialReferrals) {
    insertReferral.run(
      r.id,
      r.patientId,
      r.patientName,
      r.patientAge,
      r.patientGender,
      r.patientVillage,
      r.fromFacility,
      r.fromFacilityType,
      r.toFacility,
      r.toFacilityType,
      r.referredByRole,
      r.referredByName,
      r.reason,
      r.urgency,
      r.status,
      r.createdAt,
      r.acceptedAt || null,
      r.acceptedByName || null,
      r.completedAt || null,
      r.clinicalSummary || null,
      r.consultationOutcome ? JSON.stringify(r.consultationOutcome) : null,
      r.linkedEncounterId || null
    );
  }

  // Insert FollowUps
  const insertFollowUp = db.prepare(`
    INSERT INTO follow_ups (id, patientId, patientName, patientVillage, patientPhone, type, dueDate, assignedToAshaName, status, instructions, createdByName, createdByRole, createdAt, completedDate, completionNotes, referralId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const f of initialFollowUps) {
    insertFollowUp.run(
      f.id,
      f.patientId,
      f.patientName,
      f.patientVillage,
      f.patientPhone,
      f.type,
      f.dueDate,
      f.assignedToAshaName,
      f.status,
      f.instructions,
      f.createdByName,
      f.createdByRole,
      f.createdAt,
      f.completedDate || null,
      f.completionNotes || null,
      f.referralId || null
    );
  }

  // Insert Appointments
  const insertAppointment = db.prepare(`
    INSERT INTO appointments (id, patientId, patientName, providerName, providerRole, facilityName, date, time, type, status, teleconsultLink, purpose)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const a of initialAppointments) {
    insertAppointment.run(
      a.id,
      a.patientId,
      a.patientName,
      a.providerName,
      a.providerRole,
      a.facilityName,
      a.date,
      a.time,
      a.type,
      a.status,
      a.teleconsultLink || null,
      a.purpose
    );
  }

  // Insert AuditLogs
  const insertAuditLog = db.prepare(`
    INSERT INTO audit_logs (id, timestamp, actorRole, actorName, action, patientId, patientName, facility, details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const l of initialAuditLogs) {
    insertAuditLog.run(
      l.id,
      l.timestamp,
      l.actorRole,
      l.actorName,
      l.action,
      l.patientId || null,
      l.patientName || null,
      l.facility,
      l.details
    );
  }

  // Insert Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, role, identifier, facility, village, phone, designation, avatarColor, linkedPatientId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const u of demoUsers) {
    insertUser.run(
      u.id,
      u.name,
      u.role,
      u.identifier,
      u.facility,
      u.village || null,
      u.phone || null,
      u.designation,
      u.avatarColor || null,
      u.linkedPatientId || null
    );
  }
}

// Map database row to Patient
function mapPatientRow(row: any): Patient {
  return {
    id: row.id,
    abhaId: row.abhaId || undefined,
    name: row.name,
    age: row.age,
    gender: row.gender,
    phone: row.phone,
    village: row.village,
    language: row.language,
    linkedAshaName: row.linkedAshaName,
    linkedAshaPhone: row.linkedAshaPhone,
    registeredDate: row.registeredDate,
    bloodGroup: row.bloodGroup || undefined,
    allergies: row.allergies ? JSON.parse(row.allergies) : undefined,
    chronicConditions: row.chronicConditions ? JSON.parse(row.chronicConditions) : undefined,
    medicalHistory: row.medicalHistory,
    hasGivenDigitalConsent: Boolean(row.hasGivenDigitalConsent),
    avatarColor: row.avatarColor,
    lastVitals: row.lastVitals ? JSON.parse(row.lastVitals) : undefined
  };
}

// Map database row to Encounter
function mapEncounterRow(row: any): Encounter {
  return {
    id: row.id,
    patientId: row.patientId,
    patientName: row.patientName,
    recordedByRole: row.recordedByRole as UserRole,
    recordedByName: row.recordedByName,
    facilityName: row.facilityName,
    facilityType: row.facilityType,
    date: row.date,
    symptoms: row.symptoms ? JSON.parse(row.symptoms) : [],
    symptomNotes: row.symptomNotes,
    vitals: row.vitals ? JSON.parse(row.vitals) : {},
    triagePriority: row.triagePriority as TriagePriority,
    riskReason: row.riskReason,
    diagnosisNotes: row.diagnosisNotes || undefined,
    medications: row.medications ? JSON.parse(row.medications) : undefined,
    actionTaken: row.actionTaken
  };
}

// Map database row to Referral
function mapReferralRow(row: any): Referral {
  return {
    id: row.id,
    patientId: row.patientId,
    patientName: row.patientName,
    patientAge: row.patientAge,
    patientGender: row.patientGender,
    patientVillage: row.patientVillage,
    fromFacility: row.fromFacility,
    fromFacilityType: row.fromFacilityType,
    toFacility: row.toFacility,
    toFacilityType: row.toFacilityType,
    referredByRole: row.referredByRole as UserRole,
    referredByName: row.referredByName,
    reason: row.reason,
    urgency: row.urgency as TriagePriority,
    status: row.status as ReferralStatus,
    createdAt: row.createdAt,
    acceptedAt: row.acceptedAt || undefined,
    acceptedByName: row.acceptedByName || undefined,
    completedAt: row.completedAt || undefined,
    clinicalSummary: row.clinicalSummary || undefined,
    consultationOutcome: row.consultationOutcome ? JSON.parse(row.consultationOutcome) : undefined,
    linkedEncounterId: row.linkedEncounterId || undefined
  };
}

// Map database row to FollowUp
function mapFollowUpRow(row: any): FollowUp {
  return {
    id: row.id,
    patientId: row.patientId,
    patientName: row.patientName,
    patientVillage: row.patientVillage,
    patientPhone: row.patientPhone,
    type: row.type as FollowUpType,
    dueDate: row.dueDate,
    assignedToAshaName: row.assignedToAshaName,
    status: row.status as FollowUpStatus,
    instructions: row.instructions,
    createdByName: row.createdByName,
    createdByRole: row.createdByRole as UserRole,
    createdAt: row.createdAt,
    completedDate: row.completedDate || undefined,
    completionNotes: row.completionNotes || undefined,
    referralId: row.referralId || undefined
  };
}

// Map database row to Appointment
function mapAppointmentRow(row: any): Appointment {
  return {
    id: row.id,
    patientId: row.patientId,
    patientName: row.patientName,
    providerName: row.providerName,
    providerRole: row.providerRole,
    facilityName: row.facilityName,
    date: row.date,
    time: row.time,
    type: row.type,
    status: row.status,
    teleconsultLink: row.teleconsultLink || undefined,
    purpose: row.purpose
  };
}

// Map database row to Facility
function mapFacilityRow(row: any): Facility {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    block: row.block,
    district: row.district,
    contactPerson: row.contactPerson,
    phone: row.phone,
    activeStaffCount: row.activeStaffCount,
    teleconsultAvailable: Boolean(row.teleconsultAvailable)
  };
}

// Map database row to AuditLog
function mapAuditLogRow(row: any): AuditLog {
  return {
    id: row.id,
    timestamp: row.timestamp,
    actorRole: row.actorRole as UserRole,
    actorName: row.actorName,
    action: row.action,
    patientId: row.patientId || undefined,
    patientName: row.patientName || undefined,
    facility: row.facility,
    details: row.details
  };
}

// Map database row to UserProfile
function mapUserRow(row: any): UserProfile {
  return {
    id: row.id,
    name: row.name,
    role: row.role as UserRole,
    identifier: row.identifier,
    facility: row.facility,
    village: row.village || undefined,
    phone: row.phone || undefined,
    designation: row.designation,
    avatarColor: row.avatarColor || undefined,
    linkedPatientId: row.linkedPatientId || undefined
  };
}

// === API QUERIES & MUTATIONS ===

export function getBootstrapData() {
  const db = getDb();
  const patients = (db.prepare('SELECT * FROM patients ORDER BY registeredDate DESC').all() as any[]).map(mapPatientRow);
  const encounters = (db.prepare('SELECT * FROM encounters ORDER BY date DESC').all() as any[]).map(mapEncounterRow);
  const referrals = (db.prepare('SELECT * FROM referrals ORDER BY id DESC').all() as any[]).map(mapReferralRow);
  const followUps = (db.prepare('SELECT * FROM follow_ups ORDER BY dueDate ASC').all() as any[]).map(mapFollowUpRow);
  const appointments = (db.prepare('SELECT * FROM appointments ORDER BY date ASC, time ASC').all() as any[]).map(mapAppointmentRow);
  const facilities = (db.prepare('SELECT * FROM facilities').all() as any[]).map(mapFacilityRow);
  const auditLogs = (db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100').all() as any[]).map(mapAuditLogRow);
  const users = (db.prepare('SELECT * FROM users').all() as any[]).map(mapUserRow);

  return {
    patients,
    encounters,
    referrals,
    followUps,
    appointments,
    facilities,
    auditLogs,
    users
  };
}

export function getAllPatients(): Patient[] {
  const db = getDb();
  return (db.prepare('SELECT * FROM patients ORDER BY registeredDate DESC').all() as any[]).map(mapPatientRow);
}

export function getPatientById(id: string): Patient | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM patients WHERE id = ?').get(id);
  return row ? mapPatientRow(row) : null;
}

export function createPatient(p: Patient): Patient {
  const db = getDb();
  db.prepare(`
    INSERT INTO patients (id, abhaId, name, age, gender, phone, village, language, linkedAshaName, linkedAshaPhone, registeredDate, bloodGroup, allergies, chronicConditions, medicalHistory, hasGivenDigitalConsent, avatarColor, lastVitals)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    p.id,
    p.abhaId || null,
    p.name,
    p.age,
    p.gender,
    p.phone,
    p.village,
    p.language,
    p.linkedAshaName,
    p.linkedAshaPhone,
    p.registeredDate,
    p.bloodGroup || null,
    p.allergies ? JSON.stringify(p.allergies) : null,
    p.chronicConditions ? JSON.stringify(p.chronicConditions) : null,
    p.medicalHistory,
    p.hasGivenDigitalConsent ? 1 : 0,
    p.avatarColor,
    p.lastVitals ? JSON.stringify(p.lastVitals) : null
  );
  return p;
}

export function updatePatientConsent(patientId: string, consent: boolean): boolean {
  const db = getDb();
  const res = db.prepare('UPDATE patients SET hasGivenDigitalConsent = ? WHERE id = ?').run(consent ? 1 : 0, patientId);
  return (res as any).changes > 0;
}

export function updatePatientVitals(patientId: string, vitals: Vitals): boolean {
  const db = getDb();
  const res = db.prepare('UPDATE patients SET lastVitals = ? WHERE id = ?').run(JSON.stringify(vitals), patientId);
  return (res as any).changes > 0;
}

export function getAllEncounters(): Encounter[] {
  const db = getDb();
  return (db.prepare('SELECT * FROM encounters ORDER BY date DESC').all() as any[]).map(mapEncounterRow);
}

export function createEncounter(e: Encounter): Encounter {
  const db = getDb();
  db.prepare(`
    INSERT INTO encounters (id, patientId, patientName, recordedByRole, recordedByName, facilityName, facilityType, date, symptoms, symptomNotes, vitals, triagePriority, riskReason, diagnosisNotes, medications, actionTaken)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    e.id,
    e.patientId,
    e.patientName,
    e.recordedByRole,
    e.recordedByName,
    e.facilityName,
    e.facilityType,
    e.date,
    JSON.stringify(e.symptoms),
    e.symptomNotes,
    JSON.stringify(e.vitals),
    e.triagePriority,
    e.riskReason,
    e.diagnosisNotes || null,
    e.medications ? JSON.stringify(e.medications) : null,
    e.actionTaken
  );

  // Also update patient's last vitals
  updatePatientVitals(e.patientId, e.vitals);

  return e;
}

export function getAllReferrals(): Referral[] {
  const db = getDb();
  return (db.prepare('SELECT * FROM referrals ORDER BY id DESC').all() as any[]).map(mapReferralRow);
}

export function createReferral(r: Referral): Referral {
  const db = getDb();
  db.prepare(`
    INSERT INTO referrals (id, patientId, patientName, patientAge, patientGender, patientVillage, fromFacility, fromFacilityType, toFacility, toFacilityType, referredByRole, referredByName, reason, urgency, status, createdAt, acceptedAt, acceptedByName, completedAt, clinicalSummary, consultationOutcome, linkedEncounterId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    r.id,
    r.patientId,
    r.patientName,
    r.patientAge,
    r.patientGender,
    r.patientVillage,
    r.fromFacility,
    r.fromFacilityType,
    r.toFacility,
    r.toFacilityType,
    r.referredByRole,
    r.referredByName,
    r.reason,
    r.urgency,
    r.status,
    r.createdAt,
    r.acceptedAt || null,
    r.acceptedByName || null,
    r.completedAt || null,
    r.clinicalSummary || null,
    r.consultationOutcome ? JSON.stringify(r.consultationOutcome) : null,
    r.linkedEncounterId || null
  );
  return r;
}

export function acceptReferral(referralId: string, doctorName: string, acceptedAt: string): boolean {
  const db = getDb();
  const res = db.prepare(`
    UPDATE referrals 
    SET status = 'Accepted', acceptedByName = ?, acceptedAt = ? 
    WHERE id = ?
  `).run(doctorName, acceptedAt, referralId);
  return (res as any).changes > 0;
}

export function completeReferral(
  referralId: string,
  outcome: {
    doctorName: string;
    diagnosis: string;
    treatmentPlan: string;
    prescribedMedicines: string[];
    advice: string;
    consultationDate: string;
  },
  completedAt: string
): boolean {
  const db = getDb();
  const res = db.prepare(`
    UPDATE referrals 
    SET status = 'Completed', consultationOutcome = ?, completedAt = ? 
    WHERE id = ?
  `).run(JSON.stringify(outcome), completedAt, referralId);
  return (res as any).changes > 0;
}

export function getAllFollowUps(): FollowUp[] {
  const db = getDb();
  return (db.prepare('SELECT * FROM follow_ups ORDER BY dueDate ASC').all() as any[]).map(mapFollowUpRow);
}

export function createFollowUp(f: FollowUp): FollowUp {
  const db = getDb();
  db.prepare(`
    INSERT INTO follow_ups (id, patientId, patientName, patientVillage, patientPhone, type, dueDate, assignedToAshaName, status, instructions, createdByName, createdByRole, createdAt, completedDate, completionNotes, referralId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    f.id,
    f.patientId,
    f.patientName,
    f.patientVillage,
    f.patientPhone,
    f.type,
    f.dueDate,
    f.assignedToAshaName,
    f.status,
    f.instructions,
    f.createdByName,
    f.createdByRole,
    f.createdAt,
    f.completedDate || null,
    f.completionNotes || null,
    f.referralId || null
  );
  return f;
}

export function completeFollowUp(followUpId: string, completionNotes: string, completedDate: string): boolean {
  const db = getDb();
  const res = db.prepare(`
    UPDATE follow_ups 
    SET status = 'completed', completionNotes = ?, completedDate = ? 
    WHERE id = ?
  `).run(completionNotes, completedDate, followUpId);
  return (res as any).changes > 0;
}

export function getAllAppointments(): Appointment[] {
  const db = getDb();
  return (db.prepare('SELECT * FROM appointments ORDER BY date ASC, time ASC').all() as any[]).map(mapAppointmentRow);
}

export function createAppointment(a: Appointment): Appointment {
  const db = getDb();
  db.prepare(`
    INSERT INTO appointments (id, patientId, patientName, providerName, providerRole, facilityName, date, time, type, status, teleconsultLink, purpose)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    a.id,
    a.patientId,
    a.patientName,
    a.providerName,
    a.providerRole,
    a.facilityName,
    a.date,
    a.time,
    a.type,
    a.status,
    a.teleconsultLink || null,
    a.purpose
  );
  return a;
}

export function getAllFacilities(): Facility[] {
  const db = getDb();
  return (db.prepare('SELECT * FROM facilities').all() as any[]).map(mapFacilityRow);
}

export function getAllAuditLogs(): AuditLog[] {
  const db = getDb();
  return (db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100').all() as any[]).map(mapAuditLogRow);
}

export function createAuditLog(l: AuditLog): AuditLog {
  const db = getDb();
  db.prepare(`
    INSERT INTO audit_logs (id, timestamp, actorRole, actorName, action, patientId, patientName, facility, details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    l.id,
    l.timestamp,
    l.actorRole,
    l.actorName,
    l.action,
    l.patientId || null,
    l.patientName || null,
    l.facility,
    l.details
  );
  return l;
}

export function getAllUsers(): UserProfile[] {
  const db = getDb();
  return (db.prepare('SELECT * FROM users').all() as any[]).map(mapUserRow);
}

export function getDbStats() {
  const db = getDb();
  const patientsCount = (db.prepare('SELECT COUNT(*) as c FROM patients').get() as any).c;
  const encountersCount = (db.prepare('SELECT COUNT(*) as c FROM encounters').get() as any).c;
  const referralsCount = (db.prepare('SELECT COUNT(*) as c FROM referrals').get() as any).c;
  const followUpsCount = (db.prepare('SELECT COUNT(*) as c FROM follow_ups').get() as any).c;
  const appointmentsCount = (db.prepare('SELECT COUNT(*) as c FROM appointments').get() as any).c;
  const auditLogsCount = (db.prepare('SELECT COUNT(*) as c FROM audit_logs').get() as any).c;

  let fileSize = 0;
  try {
    const stats = fs.statSync(DB_PATH);
    fileSize = stats.size;
  } catch (e) {
    // ignore
  }

  return {
    engine: 'SQLite 3 (via node:sqlite)',
    dbPath: DB_PATH,
    fileSizeBytes: fileSize,
    counts: {
      patients: patientsCount,
      encounters: encountersCount,
      referrals: referralsCount,
      followUps: followUpsCount,
      appointments: appointmentsCount,
      auditLogs: auditLogsCount
    },
    status: 'connected',
    timestamp: new Date().toISOString()
  };
}
