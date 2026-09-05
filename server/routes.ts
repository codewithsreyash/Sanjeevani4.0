import { Router, Request, Response } from 'express';
import {
  getBootstrapData,
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatientConsent,
  updatePatientVitals,
  getAllEncounters,
  createEncounter,
  getAllReferrals,
  createReferral,
  acceptReferral,
  completeReferral,
  getAllFollowUps,
  createFollowUp,
  completeFollowUp,
  getAllAppointments,
  createAppointment,
  getAllFacilities,
  getAllAuditLogs,
  createAuditLog,
  getAllUsers,
  getDbStats,
  seedDatabase
} from './db.ts';
import {
  Patient,
  Encounter,
  Referral,
  FollowUp,
  Appointment,
  AuditLog
} from '../src/types.ts';

export const apiRouter = Router();

// === SYSTEM / HEALTH / STATS ===

apiRouter.get('/status', (req: Request, res: Response) => {
  try {
    const stats = getDbStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Database status failed' });
  }
});

apiRouter.get('/bootstrap', (req: Request, res: Response) => {
  try {
    const data = getBootstrapData();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Bootstrap load failed' });
  }
});

apiRouter.post('/reset', (req: Request, res: Response) => {
  try {
    seedDatabase();
    const data = getBootstrapData();
    res.json({ message: 'Database reset to initial demo state successfully', data });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Database reset failed' });
  }
});

// === PATIENTS ===

apiRouter.get('/patients', (req: Request, res: Response) => {
  try {
    const patients = getAllPatients();
    res.json(patients);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get('/patients/:id', (req: Request, res: Response) => {
  try {
    const patient = getPatientById(req.params.id);
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.json(patient);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/patients', (req: Request, res: Response) => {
  try {
    const body = req.body as Patient;
    if (!body.id || !body.name) {
      res.status(400).json({ error: 'Patient id and name are required' });
      return;
    }
    const created = createPatient(body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.patch('/patients/:id/consent', (req: Request, res: Response) => {
  try {
    const { consent } = req.body;
    const success = updatePatientConsent(req.params.id, Boolean(consent));
    if (!success) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.json({ success: true, id: req.params.id, hasGivenDigitalConsent: Boolean(consent) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.patch('/patients/:id/vitals', (req: Request, res: Response) => {
  try {
    const { vitals } = req.body;
    const success = updatePatientVitals(req.params.id, vitals);
    if (!success) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.json({ success: true, id: req.params.id, lastVitals: vitals });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// === ENCOUNTERS ===

apiRouter.get('/encounters', (req: Request, res: Response) => {
  try {
    const encounters = getAllEncounters();
    res.json(encounters);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/encounters', (req: Request, res: Response) => {
  try {
    const body = req.body as Encounter;
    if (!body.id || !body.patientId) {
      res.status(400).json({ error: 'Encounter id and patientId are required' });
      return;
    }
    const created = createEncounter(body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// === REFERRALS ===

apiRouter.get('/referrals', (req: Request, res: Response) => {
  try {
    const referrals = getAllReferrals();
    res.json(referrals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/referrals', (req: Request, res: Response) => {
  try {
    const body = req.body as Referral;
    if (!body.id || !body.patientId) {
      res.status(400).json({ error: 'Referral id and patientId are required' });
      return;
    }
    const created = createReferral(body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.patch('/referrals/:id/accept', (req: Request, res: Response) => {
  try {
    const { doctorName, acceptedAt } = req.body;
    const time = acceptedAt || (new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ', Today');
    const doctor = doctorName || 'Medical Officer';
    const success = acceptReferral(req.params.id, doctor, time);
    if (!success) {
      res.status(404).json({ error: 'Referral not found' });
      return;
    }
    res.json({ success: true, id: req.params.id, status: 'Accepted', acceptedByName: doctor, acceptedAt: time });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.patch('/referrals/:id/outcome', (req: Request, res: Response) => {
  try {
    const { outcome, completedAt, followUp } = req.body;
    const time = completedAt || (new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) + ', Today');
    const success = completeReferral(req.params.id, outcome, time);
    if (!success) {
      res.status(404).json({ error: 'Referral not found' });
      return;
    }

    // If follow-up provided with consultation outcome, automatically persist follow-up
    let createdFollowUp = null;
    if (followUp) {
      createdFollowUp = createFollowUp(followUp);
    }

    res.json({ success: true, id: req.params.id, status: 'Completed', completedAt: time, followUp: createdFollowUp });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// === FOLLOW-UPS ===

apiRouter.get('/followups', (req: Request, res: Response) => {
  try {
    const followUps = getAllFollowUps();
    res.json(followUps);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/followups', (req: Request, res: Response) => {
  try {
    const body = req.body as FollowUp;
    if (!body.id || !body.patientId) {
      res.status(400).json({ error: 'FollowUp id and patientId are required' });
      return;
    }
    const created = createFollowUp(body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.patch('/followups/:id/complete', (req: Request, res: Response) => {
  try {
    const { completionNotes, completedDate } = req.body;
    const date = completedDate || new Date().toISOString().split('T')[0];
    const notes = completionNotes || 'Home visit completed. Vitals checked and medicine adherence confirmed.';
    const success = completeFollowUp(req.params.id, notes, date);
    if (!success) {
      res.status(404).json({ error: 'Follow-up not found' });
      return;
    }
    res.json({ success: true, id: req.params.id, status: 'completed', completionNotes: notes, completedDate: date });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// === APPOINTMENTS ===

apiRouter.get('/appointments', (req: Request, res: Response) => {
  try {
    const apts = getAllAppointments();
    res.json(apts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/appointments', (req: Request, res: Response) => {
  try {
    const body = req.body as Appointment;
    if (!body.id || !body.patientId) {
      res.status(400).json({ error: 'Appointment id and patientId are required' });
      return;
    }
    const created = createAppointment(body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// === FACILITIES ===

apiRouter.get('/facilities', (req: Request, res: Response) => {
  try {
    const facilities = getAllFacilities();
    res.json(facilities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// === AUDIT LOGS ===

apiRouter.get('/audit-logs', (req: Request, res: Response) => {
  try {
    const logs = getAllAuditLogs();
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/audit-logs', (req: Request, res: Response) => {
  try {
    const body = req.body as AuditLog;
    if (!body.id || !body.action) {
      res.status(400).json({ error: 'Audit log id and action are required' });
      return;
    }
    const created = createAuditLog(body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// === USERS ===

apiRouter.get('/users', (req: Request, res: Response) => {
  try {
    const users = getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// === OFFLINE BATCH SYNC ===

apiRouter.post('/sync', (req: Request, res: Response) => {
  try {
    const { patients = [], encounters = [], referrals = [], followUps = [], appointments = [], auditLogs = [] } = req.body;
    let syncedCount = 0;

    for (const p of patients) {
      try {
        createPatient(p);
        syncedCount++;
      } catch (e) {
        // May already exist
      }
    }

    for (const e of encounters) {
      try {
        createEncounter(e);
        syncedCount++;
      } catch (e) {}
    }

    for (const r of referrals) {
      try {
        createReferral(r);
        syncedCount++;
      } catch (e) {}
    }

    for (const f of followUps) {
      try {
        createFollowUp(f);
        syncedCount++;
      } catch (e) {}
    }

    for (const a of appointments) {
      try {
        createAppointment(a);
        syncedCount++;
      } catch (e) {}
    }

    for (const l of auditLogs) {
      try {
        createAuditLog(l);
        syncedCount++;
      } catch (e) {}
    }

    res.json({
      success: true,
      syncedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
