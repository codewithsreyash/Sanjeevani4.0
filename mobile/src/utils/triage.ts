import { Vitals, TriagePriority } from '../types';

export interface TriageResult {
  priority: TriagePriority;
  reasons: string[];
}

export function calculateTriage(
  vitals: Vitals,
  symptoms: string[] = [],
  isPregnant: boolean = false
): TriageResult {
  const reasons: string[] = [];
  let priority: TriagePriority = 'low';

  const normalizedSymptoms = symptoms.map(s => s.toLowerCase());

  // 1. Check Emergency Symptoms
  const emergencySymptoms = [
    'chest pain',
    'severe breathlessness',
    'loss of consciousness',
    'unconscious',
    'convulsions',
    'seizures',
    'heavy bleeding',
    'severe bleeding',
    'cyanosis',
    'blue lips',
    'severe dehydration',
    'anaphylaxis'
  ];

  for (const sym of emergencySymptoms) {
    if (normalizedSymptoms.some(s => s.includes(sym))) {
      priority = 'emergency';
      reasons.push(`Critical symptom detected: ${sym.toUpperCase()}`);
    }
  }

  // 2. Emergency Vitals
  if (vitals.spO2 !== undefined && vitals.spO2 < 90) {
    priority = 'emergency';
    reasons.push(`Critically low SpO2: ${vitals.spO2}% (Target > 94%)`);
  }

  if (vitals.bpSystolic !== undefined && (vitals.bpSystolic >= 180 || vitals.bpSystolic < 80)) {
    priority = 'emergency';
    reasons.push(`Critical Systolic BP: ${vitals.bpSystolic} mmHg`);
  }

  if (vitals.bpDiastolic !== undefined && vitals.bpDiastolic >= 120) {
    priority = 'emergency';
    reasons.push(`Critical Diastolic BP: ${vitals.bpDiastolic} mmHg`);
  }

  if (vitals.pulse !== undefined && (vitals.pulse > 140 || vitals.pulse < 40)) {
    priority = 'emergency';
    reasons.push(`Dangerous Pulse Rate: ${vitals.pulse} bpm`);
  }

  // Maternal specific danger signs
  if (isPregnant) {
    if (vitals.bpSystolic !== undefined && vitals.bpSystolic >= 140) {
      if (priority !== 'emergency') priority = 'high';
      reasons.push(`Gestational Hypertension: BP ${vitals.bpSystolic}/${vitals.bpDiastolic || '-'}`);
    }
    if (vitals.hemoglobin !== undefined && vitals.hemoglobin < 7) {
      if (priority !== 'emergency') priority = 'emergency';
      reasons.push(`Severe Maternal Anemia: Hb ${vitals.hemoglobin} g/dL (Emergency transfusion risk)`);
    }
  }

  if (priority === 'emergency') {
    return { priority, reasons };
  }

  // 3. High Priority Checks
  const highSymptoms = [
    'high fever with chills',
    'persistent vomiting',
    'severe abdominal pain',
    'diabetic foot ulcer',
    'sudden weakness'
  ];

  for (const sym of highSymptoms) {
    if (normalizedSymptoms.some(s => s.includes(sym))) {
      priority = 'high';
      reasons.push(`High-risk symptom: ${sym}`);
    }
  }

  if (vitals.spO2 !== undefined && vitals.spO2 >= 90 && vitals.spO2 < 94) {
    priority = 'high';
    reasons.push(`Borderline hypoxia SpO2: ${vitals.spO2}%`);
  }

  if (vitals.bpSystolic !== undefined && vitals.bpSystolic >= 160 && vitals.bpSystolic < 180) {
    priority = 'high';
    reasons.push(`Stage 2 Hypertension: ${vitals.bpSystolic} mmHg`);
  }

  if (vitals.temperature !== undefined && vitals.temperature >= 102.5) {
    priority = 'high';
    reasons.push(`High grade fever: ${vitals.temperature}°F`);
  }

  if (vitals.bloodSugar !== undefined && (vitals.bloodSugar > 280 || vitals.bloodSugar < 60)) {
    priority = 'high';
    reasons.push(`Uncontrolled glycemic level: ${vitals.bloodSugar} mg/dL`);
  }

  if (priority === 'high') {
    return { priority, reasons };
  }

  // 4. Medium Priority Checks
  if (vitals.bpSystolic !== undefined && vitals.bpSystolic >= 130 && vitals.bpSystolic < 160) {
    priority = 'medium';
    reasons.push(`Elevated BP: ${vitals.bpSystolic} mmHg`);
  }

  if (vitals.temperature !== undefined && vitals.temperature >= 100 && vitals.temperature < 102.5) {
    priority = 'medium';
    reasons.push(`Mild to moderate fever: ${vitals.temperature}°F`);
  }

  if (vitals.bloodSugar !== undefined && vitals.bloodSugar > 180 && vitals.bloodSugar <= 280) {
    priority = 'medium';
    reasons.push(`Elevated Random Blood Sugar: ${vitals.bloodSugar} mg/dL`);
  }

  if (normalizedSymptoms.length > 0 && priority === 'low') {
    priority = 'medium';
    reasons.push(`Reported symptoms: ${symptoms.join(', ')}`);
  }

  if (reasons.length === 0) {
    reasons.push('Vitals and observation within normal physiological limits');
  }

  return { priority, reasons };
}
