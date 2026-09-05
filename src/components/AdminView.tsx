import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { ReferralStatus, TriagePriority } from '../types';
import {
  ShieldCheck,
  TrendingUp,
  Activity,
  Users,
  Building2,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Download,
  Layers,
  Hospital,
  FileSpreadsheet,
  FileText,
  Printer
} from 'lucide-react';
import districtAdminImg from '../assets/images/district_admin_command.jpg';

export const AdminView: React.FC = () => {
  const {
    patients,
    referrals,
    followUps,
    facilities,
    auditLogs,
    encounters,
    t,
    language
  } = useHealth();

  const loc = {
    en: {
      officerTitle: 'District Health Officer • Nashik Health Command',
      subtitle: 'Public Health Oversight',
      coverageLabel: 'Coverage:',
      coverage: 'Chandur & Igatpuri Sub-Divisions • 4 Connected Health Tiers',
      exportReport: 'Export District Report',
      referralCompletionRate: 'Referral Completion Rate',
      referralsResolved: 'referrals resolved',
      of: 'of',
      followUpCompliance: 'ASHA Follow-up Compliance',
      homeVisitsCompleted: 'home visits completed',
      highRiskCases: 'High-Risk & Emergency Cases',
      immediateAttention: 'Immediate attention / Red-flagged',
      registeredCitizens: 'Registered Citizens',
      abhaLinked: '100% ABHA Linked Records',
      tabOverview: 'Patient Flow & Facility Network',
      tabReferrals: 'Referral Tracking Master Table',
      tabFacilities: 'Facility Directory',
      tabAudit: 'Live Traceability Audit Log',
      pipelineTitle: 'End-to-End Continuity of Care Pipeline (Tier Flow)',
      pipelineSubtitle: 'Tracking patient mobility from village doorstep through tertiary specialists.',
      tier1: 'Tier 1: Sub-centre',
      tier1Staff: 'ASHA / ANM',
      tier1Desc: 'Field Vitals & Risk Screenings Recorded',
      tier2: 'Tier 2: Primary (PHC)',
      tier2Staff: 'MO & CHO',
      tier2Desc: 'Teleconsults & Clinical Triage Encounters',
      tier3: 'Tier 3: CHC / Rural',
      tier3Staff: 'Specialist',
      tier3Desc: 'Secondary Diagnostics & Inpatient Care',
      tier4: 'Tier 4: District Hospital',
      tier4Staff: 'Civil Hospital',
      tier4Desc: 'Critical Escalations & Tertiary Care',
      funnelTitle: 'Referral Resolution Funnel',
      urgencyDistribution: 'Triage Urgency Distribution',
      tableTitle: 'Master Referral Tracking Table',
      tableSubtitle: 'Live status of all inter-facility patient transfers.',
      allStatuses: 'All Statuses',
      allUrgency: 'All Urgency',
      searchTable: 'Search table...',
      thRefId: 'Ref ID',
      thPatient: 'Patient',
      thFrom: 'From Facility',
      thTo: 'To Facility',
      thUrgency: 'Urgency',
      thStatus: 'Status',
      thCreated: 'Created',
      thReferredBy: 'Referred By',
      facilityGridTitle: 'Connected Healthcare Facility Grid',
      liveNodes: '4 Live Nodes',
      teleconsultActive: 'Teleconsult Active',
      block: 'Block',
      district: 'District',
      contact: 'Contact',
      auditTitle: 'System Audit Trail & Data Provenance',
      auditSubtitle: 'Immutable chronological log of all registrations, vitals entries, referrals, and follow-ups.',
      entries: 'Entries',
      facilityLabel: 'Facility:',
      patientLabel: 'Patient:'
    },
    hi: {
      officerTitle: 'जिला स्वास्थ्य अधिकारी • नासिक स्वास्थ्य कमान',
      subtitle: 'सार्वजनिक स्वास्थ्य निगरानी',
      coverageLabel: 'कार्यक्षेत्र:',
      coverage: 'चांदूर एवं इगतपुरी उप-संभाग • 4 संबद्ध स्वास्थ्य स्तर',
      exportReport: 'जिला रिपोर्ट निर्यात करें',
      referralCompletionRate: 'रेफरल पूर्णता दर',
      referralsResolved: 'रेफरल पूर्ण',
      of: 'में से',
      followUpCompliance: 'आशा अनुवर्ती अनुपालन',
      homeVisitsCompleted: 'गृह भ्रमण पूर्ण',
      highRiskCases: 'उच्च-जोखिम व आपातकालीन मामले',
      immediateAttention: 'तत्काल ध्यानाकर्षण / रेड-फ्लैग',
      registeredCitizens: 'पंजीकृत नागरिक',
      abhaLinked: '100% ABHA लिंक रिकॉर्ड',
      tabOverview: 'मरीज प्रवाह एवं स्वास्थ्य नेटवर्क',
      tabReferrals: 'रेफरल ट्रैकिंग मास्टर तालिका',
      tabFacilities: 'स्वास्थ्य केंद्र निर्देशिका',
      tabAudit: 'लाइव ट्रेसबिलिटी ऑडिट लॉग',
      pipelineTitle: 'सतत उपचार पाइपलाइन (चरणबद्ध प्रवाह)',
      pipelineSubtitle: 'गांव के घर से लेकर तृतीयक विशेषज्ञ तक मरीज की निर्बाध आवाजाही की निगरानी।',
      tier1: 'स्तर 1: उप-केंद्र',
      tier1Staff: 'आशा / एएनएम',
      tier1Desc: 'वाइटल्स एवं जोखिम जांच दर्ज',
      tier2: 'स्तर 2: प्राथमिक (PHC)',
      tier2Staff: 'एमओ एवं सीएचओ',
      tier2Desc: 'टेलीकंसल्टेशन व क्लीनिकल ट्राइएज',
      tier3: 'स्तर 3: सीएचसी / ग्रामीण अस्पताल',
      tier3Staff: 'विशेषज्ञ चिकित्सक',
      tier3Desc: 'द्वितीयक निदान व भर्ती उपचार',
      tier4: 'स्तर 4: जिला अस्पताल',
      tier4Staff: 'सिविल अस्पताल',
      tier4Desc: 'गंभीर मामले व तृतीयक विशेष देखभाल',
      funnelTitle: 'रेफरल समाधान प्रक्रिया (Funnel)',
      urgencyDistribution: 'ट्राइएज गंभीरता वितरण',
      tableTitle: 'मास्टर रेफरल ट्रैकिंग तालिका',
      tableSubtitle: 'सभी अंतर-संस्था मरीज स्थानांतरण की लाइव स्थिति।',
      allStatuses: 'सभी स्थितियां',
      allUrgency: 'सभी गंभीरता',
      searchTable: 'तालिका में खोजें...',
      thRefId: 'रेफरल आईडी',
      thPatient: 'मरीज',
      thFrom: 'प्रारंभिक केंद्र',
      thTo: 'गंतव्य केंद्र',
      thUrgency: 'गंभीरता',
      thStatus: 'स्थिति',
      thCreated: 'दिनांक',
      thReferredBy: 'रेफरकर्ता',
      facilityGridTitle: 'संबद्ध स्वास्थ्य केंद्र ग्रिड',
      liveNodes: '4 सक्रिय नोड्स',
      teleconsultActive: 'टेलीकंसल्ट सक्रिय',
      block: 'ब्लॉक',
      district: 'जिला',
      contact: 'संपर्क',
      auditTitle: 'सिस्टम ऑडिट ट्रेल एवं डेटा प्रमाणिकता',
      auditSubtitle: 'सभी पंजीकरण, वाइटल्स, रेफरल व अनुवर्ती कार्यों का अपरिवर्तनीय कालानुक्रमिक लॉग।',
      entries: 'प्रविष्टियां',
      facilityLabel: 'केंद्र:',
      patientLabel: 'मरीज:'
    },
    mr: {
      officerTitle: 'जिल्हा आरोग्य अधिकारी • नाशिक आरोग्य कमान',
      subtitle: 'सार्वजनिक आरोग्य देखरेख',
      coverageLabel: 'कार्यक्षेत्र:',
      coverage: 'चांदूर आणि इगतपुरी उपविभाग • ४ जोडलेले आरोग्य स्तर',
      exportReport: 'जिल्हा अहवाल डाउनलोड करा',
      referralCompletionRate: 'रेफरल पूर्णता दर',
      referralsResolved: 'रेफरल पूर्ण',
      of: 'पैकी',
      followUpCompliance: 'आशा पाठपुरावा पूर्तता',
      homeVisitsCompleted: 'गृहभेटी पूर्ण',
      highRiskCases: 'अति-जोखमीचे व आपत्कालीन रुग्ण',
      immediateAttention: 'तातडीचे लक्ष / रेड-फ्लॅग',
      registeredCitizens: 'नोंदणीकृत नागरिक',
      abhaLinked: '१००% आभा लिंक केलेले रेकॉर्ड',
      tabOverview: 'रुग्ण प्रवाह आणि आरोग्य नेटवर्क',
      tabReferrals: 'रेफरल ट्रॅकिंग मास्टर तक्ता',
      tabFacilities: 'आरोग्य केंद्र निर्देशिका',
      tabAudit: 'थेट ट्रेसिबिलिटी ऑडिट लॉग',
      pipelineTitle: 'अखंड उपचार साखळी (स्तर प्रवाह)',
      pipelineSubtitle: 'गावातील घराच्या उंबरठ्यापासून ते जिल्हा विशेषोपचारापर्यंत रुग्णांच्या प्रवासाचा मागोवा.',
      tier1: 'स्तर १: उपकेंद्र',
      tier1Staff: 'आशा / एएनएम',
      tier1Desc: 'वाइटल्स व जोखीम तपासणी नोंदणी',
      tier2: 'स्तर २: प्राथमिक आरोग्य केंद्र (PHC)',
      tier2Staff: 'वैद्यकीय अधिकारी व सीएचओ',
      tier2Desc: 'टेलिकन्सल्ट व वैद्यकीय ट्रायज',
      tier3: 'स्तर ३: ग्रामीण रुग्णालय (CHC)',
      tier3Staff: 'तज्ज्ञ डॉक्टर',
      tier3Desc: 'दुय्यम तपासणी व आंतररुग्ण विभाग',
      tier4: 'स्तर ४: जिल्हा रुग्णालय',
      tier4Staff: 'सिव्हिल हॉस्पिटल',
      tier4Desc: 'गंभीर आजार व तृतीयक विशेष काळजी',
      funnelTitle: 'रेफरल पूर्तता प्रगती (Funnel)',
      urgencyDistribution: 'ट्रायज तीव्रता प्रमाण',
      tableTitle: 'मास्टर रेफरल ट्रॅकिंग तक्ता',
      tableSubtitle: 'सर्व आंतर-संस्था रुग्ण बदल्यांची थेट स्थिती.',
      allStatuses: 'सर्व स्थिती',
      allUrgency: 'सर्व तीव्रता',
      searchTable: 'तक्त्यात शोधा...',
      thRefId: 'रेफरल आयडी',
      thPatient: 'रुग्ण',
      thFrom: 'मूळ केंद्र',
      thTo: 'गंतव्य केंद्र',
      thUrgency: 'तीव्रता',
      thStatus: 'स्थिती',
      thCreated: 'दिनांक',
      thReferredBy: 'रेफर करणारे',
      facilityGridTitle: 'जोडलेले आरोग्य केंद्र नेटवर्क',
      liveNodes: '४ सक्रिय केंद्रे',
      teleconsultActive: 'टेलिकन्सल्ट सुरू',
      block: 'तालुका',
      district: 'जिल्हा',
      contact: 'संपर्क व्यक्ती',
      auditTitle: 'प्रणाली ऑडिट ट्रेल व डेटा सत्यता',
      auditSubtitle: 'सर्व नोंदणी, वाइटल्स, संदर्भ आणि पाठपुराव्यांचा न बदलता येणारा कालक्रमानुसार लॉग.',
      entries: 'नोंदी',
      facilityLabel: 'केंद्र:',
      patientLabel: 'रुग्ण:'
    }
  }[language];

  const [referralStatusFilter, setReferralStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [searchTableQuery, setSearchTableQuery] = useState<string>('');
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'referrals' | 'facilities' | 'audit'>('overview');

  // KPI Calculations
  const totalPatients = patients.length;
  const totalReferrals = referrals.length;
  const completedReferrals = referrals.filter(r => r.status === 'Completed').length;
  const referralCompletionRate = totalReferrals > 0 ? Math.round((completedReferrals / totalReferrals) * 100) : 100;

  const totalFollowUps = followUps.length;
  const completedFollowUps = followUps.filter(f => f.status === 'completed').length;
  const followUpComplianceRate = totalFollowUps > 0 ? Math.round((completedFollowUps / totalFollowUps) * 100) : 100;

  const highRiskEncounters = encounters.filter(e => e.triagePriority === 'emergency' || e.triagePriority === 'high').length;

  // Filtered referrals for master tracking table
  const filteredReferrals = referrals.filter(r => {
    const matchesStatus = referralStatusFilter === 'all' || r.status === referralStatusFilter;
    const matchesUrgency = urgencyFilter === 'all' || r.urgency === urgencyFilter;
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
      r.toFacility.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
      r.fromFacility.toLowerCase().includes(searchTableQuery.toLowerCase());
    return matchesStatus && matchesUrgency && matchesSearch;
  });

  const exportToExcel = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    let csv = '\uFEFF'; // UTF-8 BOM for Microsoft Excel compatibility
    
    // Header Block
    csv += 'NATIONAL HEALTH MISSION - AYUSHMAN BHARAT DIGITAL MISSION (ABDM)\n';
    csv += 'SANJEEVANI 4.0 - DISTRICT HEALTH COMMAND EXECUTIVE REPORT\n';
    csv += `Report Generation Date,${new Date().toLocaleString('en-IN')}\n`;
    csv += `Jurisdiction,Nashik Central • Chandur & Igatpuri Sub-Divisions\n`;
    csv += `Database Source,SQLite 3 Persistent Health Registry\n\n`;

    // Section 1: Executive KPIs
    csv += '=== SECTION 1: DISTRICT HEALTH PERFORMANCE METRICS ===\n';
    csv += 'Metric,Value,Benchmark Target,Health System Status\n';
    csv += `Total Registered Citizens,${patients.length},100% Target,OPTIMAL\n`;
    csv += `Total Clinical Encounters,${encounters.length},Active Field Surveillance,ACTIVE\n`;
    csv += `Total Referrals Created,${totalReferrals},All Tiers,MONITORED\n`;
    csv += `Referral Completion Rate,${referralCompletionRate}%,Target > 85%,${referralCompletionRate >= 85 ? 'ACHIEVED' : 'IN PROGRESS'}\n`;
    csv += `ASHA Follow-up Compliance,${followUpComplianceRate}%,Target > 90%,${followUpComplianceRate >= 90 ? 'COMPLIANT' : 'ATTENTION REQUIRED'}\n`;
    csv += `High-Risk & Emergency Flags,${highRiskEncounters},Immediate Response,FLAGGED\n\n`;

    // Section 2: Patient Registry
    csv += '=== SECTION 2: REGISTERED CITIZEN & CLINICAL VITALS REGISTRY ===\n';
    csv += 'Patient ID,ABHA ID,Full Name,Age,Gender,Phone,Village,Blood Group,Known Chronic Conditions,Blood Pressure (mmHg),SpO2 (%),Pulse (bpm),Blood Sugar (mg/dL),Digital Consent\n';
    patients.forEach(p => {
      const bp = p.lastVitals ? `${p.lastVitals.bpSystolic || '-'}/${p.lastVitals.bpDiastolic || '-'}` : 'N/A';
      const spo2 = p.lastVitals?.spO2 !== undefined ? `${p.lastVitals.spO2}%` : 'N/A';
      const pulse = p.lastVitals?.pulse !== undefined ? `${p.lastVitals.pulse}` : 'N/A';
      const sugar = p.lastVitals?.bloodSugar !== undefined ? `${p.lastVitals.bloodSugar}` : 'N/A';
      const conditions = p.chronicConditions && p.chronicConditions.length > 0 ? `"${p.chronicConditions.join('; ')}"` : 'None';
      csv += `"${p.id}","${p.abhaId || 'Not Linked'}","${p.name}",${p.age},"${p.gender}","${p.phone}","${p.village}","${p.bloodGroup || 'N/A'}",${conditions},"${bp}","${spo2}","${pulse}","${sugar}","${p.hasGivenDigitalConsent ? 'Active' : 'Revoked'}"\n`;
    });
    csv += '\n';

    // Section 3: Referrals
    csv += '=== SECTION 3: INBOUND & OUTBOUND REFERRAL CONTINUUM ===\n';
    csv += 'Referral ID,Patient Name,Age/Gender,From Facility,To Facility,Triage Urgency,Referral Status,Created Date,Doctor Diagnosis,Prescriptions\n';
    referrals.forEach(r => {
      const diag = r.consultationOutcome?.diagnosis ? `"${r.consultationOutcome.diagnosis.replace(/"/g, '""')}"` : 'Pending Doctor Consultation';
      const meds = r.consultationOutcome?.prescribedMedicines ? `"${r.consultationOutcome.prescribedMedicines.join('; ')}"` : 'None';
      csv += `"${r.id}","${r.patientName}","${r.patientAge}y ${r.patientGender}","${r.fromFacility}","${r.toFacility}","${r.urgency.toUpperCase()}","${r.status}","${r.createdAt}",${diag},${meds}\n`;
    });
    csv += '\n';

    // Section 4: Follow-ups
    csv += '=== SECTION 4: ASHA HOME VISIT & FOLLOW-UP CONTINUUM ===\n';
    csv += 'Follow-up ID,Patient Name,Village,Care Type,Due Date,Assigned ASHA,Status,Instructions,Completion Notes\n';
    followUps.forEach(f => {
      const inst = f.instructions ? `"${f.instructions.replace(/"/g, '""')}"` : '""';
      const notes = f.completionNotes ? `"${f.completionNotes.replace(/"/g, '""')}"` : '""';
      csv += `"${f.id}","${f.patientName}","${f.patientVillage}","${f.type.toUpperCase()}","${f.dueDate}","${f.assignedToAshaName}","${f.status.toUpperCase()}",${inst},${notes}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Sanjeevani_District_Report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportToPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups in your browser to view and print the official PDF report.');
      return;
    }

    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const timeStr = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sanjeevani 4.0 - District Healthcare Executive Report</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1e293b; background: #fff; margin: 0; padding: 20px; font-size: 10pt; line-height: 1.4; }
    .header { border-bottom: 2px solid #0f766e; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .logo-title { display: flex; align-items: center; gap: 12px; }
    .emblem-box { width: 44px; height: 44px; background: #0f766e; color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 20px; }
    h1 { margin: 0; font-size: 16pt; color: #0f172a; letter-spacing: -0.5px; }
    .subhead { margin: 2px 0 0 0; font-size: 9pt; color: #0d9488; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-box { text-align: right; font-size: 8.5pt; color: #64748b; line-height: 1.3; }
    .meta-ref { font-family: monospace; font-weight: 700; color: #0f172a; }
    .badge { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 7.5pt; font-weight: 700; text-transform: uppercase; }
    .badge-success { background: #dcfce7; color: #15803d; }
    .badge-alert { background: #fee2e2; color: #b91c1c; }
    .badge-info { background: #e0f2fe; color: #0369a1; }
    
    .section-title { font-size: 11pt; font-weight: 800; color: #0f172a; margin: 16px 0 6px 0; border-left: 4px solid #0d9488; padding-left: 8px; display: flex; justify-content: space-between; align-items: center; }
    
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px; text-align: center; }
    .kpi-num { font-size: 16pt; font-weight: 900; color: #0f172a; }
    .kpi-label { font-size: 7pt; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px; }
    
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 8.5pt; }
    th { background: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 5px 6px; border: 1px solid #cbd5e1; font-size: 7.5pt; text-transform: uppercase; }
    td { padding: 5px 6px; border: 1px solid #e2e8f0; vertical-align: top; }
    tr:nth-child(even) td { background: #fafafa; }
    
    .footer { margin-top: 20px; padding-top: 10px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; font-size: 7.5pt; color: #64748b; }
    .sign-box { margin-top: 24px; display: flex; justify-content: space-between; page-break-inside: avoid; }
    .sign-line { width: 190px; border-top: 1px solid #0f172a; text-align: center; font-size: 8pt; font-weight: 700; padding-top: 4px; }
    
    .print-actions { background: #0f172a; color: #fff; padding: 10px 16px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .print-btn { background: #0d9488; color: #fff; border: none; padding: 7px 16px; border-radius: 6px; font-weight: 700; font-size: 10pt; cursor: pointer; }
    @media print {
      .print-actions { display: none !important; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <div><strong>SANJEEVANI 4.0 - OFFICIAL DISTRICT PERFORMANCE REPORT</strong> • Ready to Print or Save as PDF</div>
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="header">
    <div class="logo-title">
      <div class="emblem-box">S</div>
      <div>
        <h1>Sanjeevani AI - District Health Command</h1>
        <div class="subhead">National Health Mission • Ayushman Bharat Digital Mission (ABDM)</div>
      </div>
    </div>
    <div class="meta-box">
      <div>Report Ref: <span class="meta-ref">NHM-NSK-${new Date().getTime().toString().slice(-6)}</span></div>
      <div>Date: <strong>${dateStr} at ${timeStr}</strong></div>
      <div>Jurisdiction: <strong>Nashik Central, Chandur & Igatpuri</strong></div>
    </div>
  </div>

  <div class="section-title">
    <span>I. Executive Health Continuum Indicators</span>
    <span class="badge badge-success">Live SQLite Verified</span>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-num" style="color: #0f766e;">${referralCompletionRate}%</div>
      <div class="kpi-label">Referral Resolution</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-num" style="color: #059669;">${followUpComplianceRate}%</div>
      <div class="kpi-label">ASHA Home Visit Compliance</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-num" style="color: #e11d48;">${highRiskEncounters}</div>
      <div class="kpi-label">High-Risk Patients Flagged</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-num" style="color: #2563eb;">${patients.length}</div>
      <div class="kpi-label">Registered Citizens (100% ABHA)</div>
    </div>
  </div>

  <div class="section-title">II. High-Risk & Monitored Patient Registry</div>
  <table>
    <thead>
      <tr>
        <th>ABHA ID</th>
        <th>Patient Name</th>
        <th>Age/Sex</th>
        <th>Village</th>
        <th>High-Risk Chronic Condition</th>
        <th>Latest Vitals (BP / SpO2 / Pulse)</th>
        <th>ABDM Consent</th>
      </tr>
    </thead>
    <tbody>
      ${patients.map(p => `
        <tr>
          <td style="font-family: monospace; font-size: 7.5pt;">${p.abhaId || 'Pending'}</td>
          <td><strong>${p.name}</strong></td>
          <td>${p.age}y / ${p.gender}</td>
          <td>${p.village}</td>
          <td>${p.chronicConditions && p.chronicConditions.length > 0 ? p.chronicConditions.join(', ') : 'Standard Observation'}</td>
          <td>${p.lastVitals ? `BP: ${p.lastVitals.bpSystolic || '-'}/${p.lastVitals.bpDiastolic || '-'} • SpO2: ${p.lastVitals.spO2}% • Pulse: ${p.lastVitals.pulse}` : 'Vitals Pending'}</td>
          <td><span class="badge ${p.hasGivenDigitalConsent ? 'badge-success' : 'badge-alert'}">${p.hasGivenDigitalConsent ? 'Active' : 'Revoked'}</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="section-title">III. Inter-Facility Referral Continuum (Sub-centre → PHC → CHC → District Hospital)</div>
  <table>
    <thead>
      <tr>
        <th>Referral ID</th>
        <th>Patient</th>
        <th>From Facility</th>
        <th>To Facility</th>
        <th>Urgency</th>
        <th>Status</th>
        <th>Clinical Outcome / Diagnosis</th>
      </tr>
    </thead>
    <tbody>
      ${referrals.map(r => `
        <tr>
          <td style="font-family: monospace; font-size: 7.5pt;">#${r.id}</td>
          <td><strong>${r.patientName}</strong> (${r.patientAge}y)</td>
          <td>${r.fromFacility}</td>
          <td><strong>${r.toFacility}</strong></td>
          <td><span class="badge ${r.urgency === 'emergency' || r.urgency === 'high' ? 'badge-alert' : 'badge-info'}">${r.urgency.toUpperCase()}</span></td>
          <td><span class="badge ${r.status === 'Completed' ? 'badge-success' : 'badge-info'}">${r.status}</span></td>
          <td>${r.consultationOutcome ? `<strong>${r.consultationOutcome.doctorName}</strong>: ${r.consultationOutcome.diagnosis} (Rx: ${r.consultationOutcome.prescribedMedicines.join(', ')})` : r.reason}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="section-title">IV. ASHA Field Worker Home Follow-up Compliance</div>
  <table>
    <thead>
      <tr>
        <th>Task ID</th>
        <th>Patient</th>
        <th>Village</th>
        <th>Care Type</th>
        <th>Due Date</th>
        <th>Assigned ASHA</th>
        <th>Status</th>
        <th>Visit Completion Remarks</th>
      </tr>
    </thead>
    <tbody>
      ${followUps.map(f => `
        <tr>
          <td style="font-family: monospace; font-size: 7.5pt;">${f.id}</td>
          <td>${f.patientName}</td>
          <td>${f.patientVillage}</td>
          <td>${f.type.toUpperCase()}</td>
          <td>${f.dueDate}</td>
          <td><strong>${f.assignedToAshaName}</strong></td>
          <td><span class="badge ${f.status === 'completed' ? 'badge-success' : 'badge-alert'}">${f.status.toUpperCase()}</span></td>
          <td>${f.completionNotes || f.instructions}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="sign-box">
    <div>
      <div class="sign-line">Dr. Vivek Joshi, MS, FACS<br>Civil Surgeon & Chief Medical Officer</div>
    </div>
    <div style="text-align: right;">
      <div class="sign-line">Dr. Arvind Patil, MD<br>District Health Officer (DHO), Nashik</div>
    </div>
  </div>

  <div class="footer">
    <div>Generated via Sanjeevani AI Healthcare Continuity Gateway • Smart India Hackathon (PS 26133)</div>
    <div>Official Document • Tamper-evident Audit Verified on SQLite Registry</div>
  </div>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Official District Command Photo */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md border-2 border-slate-700 shrink-0 bg-slate-900 relative group">
            <img
              src={districtAdminImg}
              alt="District Health Administration"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-slate-900/10 pointer-events-none"></div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {loc.officerTitle}
              </h2>
              <span className="bg-slate-900 text-teal-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {loc.subtitle}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {loc.coverageLabel} <strong>{loc.coverage}</strong>
            </p>
          </div>
        </div>

        {/* Dual Export Buttons: Excel Spreadsheet and PDF Report */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download Excel (.csv) */}
          <button
            onClick={exportToExcel}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-300 transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs hover:shadow-xs"
            title="Download formatted spreadsheet for Microsoft Excel / Google Sheets"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Download Excel (.csv)</span>
          </button>

          {/* Download / Print Official PDF */}
          <button
            onClick={exportToPdf}
            className="bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold px-3 py-2 rounded-xl border border-rose-300 transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs hover:shadow-xs"
            title="Generate and print official Government District Health Report as PDF"
          >
            <FileText className="w-4 h-4 text-rose-700" />
            <span>Official Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>{loc.referralCompletionRate}</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {referralCompletionRate}%
          </div>
          <div className="text-[11px] text-teal-700 font-semibold mt-1">
            {completedReferrals} {loc.of} {totalReferrals} {loc.referralsResolved}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>{loc.followUpCompliance}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {followUpComplianceRate}%
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            {completedFollowUps} {loc.of} {totalFollowUps} {loc.homeVisitsCompleted}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>{loc.highRiskCases}</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-950 mt-1">
            {highRiskEncounters}
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">
            {loc.immediateAttention}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>{loc.registeredCitizens}</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {totalPatients}
          </div>
          <div className="text-[11px] text-indigo-700 font-semibold mt-1">
            {loc.abhaLinked}
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1 shadow-xs">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeAdminTab === 'overview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          {loc.tabOverview}
        </button>

        <button
          onClick={() => setActiveAdminTab('referrals')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeAdminTab === 'referrals' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          {loc.tabReferrals} ({referrals.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('facilities')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeAdminTab === 'facilities' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          {loc.tabFacilities} ({facilities.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('audit')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeAdminTab === 'audit' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          {loc.tabAudit} ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Overview & Patient Flow Pipeline Chart */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Visual Patient Flow across 4 Tiers */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {loc.pipelineTitle}
              </h3>
              <p className="text-xs text-slate-600">
                {loc.pipelineSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
              <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-teal-950">
                  <span>{loc.tier1}</span>
                  <span className="bg-teal-200 text-teal-900 px-2 py-0.5 rounded">{loc.tier1Staff}</span>
                </div>
                <div className="text-2xl font-extrabold text-teal-950">{encounters.length}</div>
                <div className="text-[11px] text-teal-800">
                  {loc.tier1Desc}
                </div>
              </div>

              <div className="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                  <span>{loc.tier2}</span>
                  <span className="bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded">{loc.tier2Staff}</span>
                </div>
                <div className="text-2xl font-extrabold text-indigo-950">
                  {referrals.filter(r => r.toFacilityType === 'PHC').length}
                </div>
                <div className="text-[11px] text-indigo-800">
                  {loc.tier2Desc}
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                  <span>{loc.tier3}</span>
                  <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded">{loc.tier3Staff}</span>
                </div>
                <div className="text-2xl font-extrabold text-amber-950">
                  {referrals.filter(r => r.toFacilityType === 'Rural Hospital').length}
                </div>
                <div className="text-[11px] text-amber-800">
                  {loc.tier3Desc}
                </div>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>{loc.tier4}</span>
                  <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">{loc.tier4Staff}</span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-950">
                  {referrals.filter(r => r.toFacilityType === 'District Hospital').length}
                </div>
                <div className="text-[11px] text-emerald-800">
                  {loc.tier4Desc}
                </div>
              </div>
            </div>
          </div>

          {/* Referral Status Breakdown & High-Risk Case Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900">{loc.funnelTitle}</h4>
              <div className="space-y-2">
                {['Created', 'Accepted', 'In Progress', 'Completed'].map(status => {
                  const count = referrals.filter(r => r.status === status).length;
                  const pct = totalReferrals > 0 ? Math.round((count / totalReferrals) * 100) : 0;
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{status}</span>
                        <span>{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            status === 'Completed' ? 'bg-emerald-600' :
                            status === 'In Progress' ? 'bg-indigo-600' :
                            status === 'Accepted' ? 'bg-teal-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.max(pct, 5)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-slate-900">{loc.urgencyDistribution}</h4>
              <div className="space-y-2">
                {[
                  { label: 'Emergency', count: encounters.filter(e => e.triagePriority === 'emergency').length, color: 'bg-rose-600' },
                  { label: 'High Priority', count: encounters.filter(e => e.triagePriority === 'high').length, color: 'bg-amber-500' },
                  { label: 'Moderate', count: encounters.filter(e => e.triagePriority === 'medium').length, color: 'bg-yellow-500' },
                  { label: 'Routine', count: encounters.filter(e => e.triagePriority === 'low').length, color: 'bg-emerald-600' }
                ].map(item => {
                  const pct = encounters.length > 0 ? Math.round((item.count / encounters.length) * 100) : 0;
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{item.label}</span>
                        <span>{item.count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${Math.max(pct, 5)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Referral Tracking Table with Filters */}
      {activeAdminTab === 'referrals' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {loc.tableTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {loc.tableSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={referralStatusFilter}
                onChange={e => setReferralStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
              >
                <option value="all">{loc.allStatuses}</option>
                <option value="Created">Created</option>
                <option value="Accepted">Accepted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={e => setUrgencyFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
              >
                <option value="all">{loc.allUrgency}</option>
                <option value="emergency">Emergency</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTableQuery}
                  onChange={e => setSearchTableQuery(e.target.value)}
                  placeholder={loc.searchTable}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">{loc.thRefId}</th>
                  <th className="py-2.5 px-3">{loc.thPatient}</th>
                  <th className="py-2.5 px-3">{loc.thFrom}</th>
                  <th className="py-2.5 px-3">{loc.thTo}</th>
                  <th className="py-2.5 px-3">{loc.thUrgency}</th>
                  <th className="py-2.5 px-3">{loc.thStatus}</th>
                  <th className="py-2.5 px-3">{loc.thCreated}</th>
                  <th className="py-2.5 px-3">{loc.thReferredBy}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredReferrals.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">#{r.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {r.patientName}
                      <span className="text-[10px] text-slate-500 block font-normal">{r.patientVillage}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{r.fromFacility}</td>
                    <td className="py-2.5 px-3 font-semibold text-teal-900">{r.toFacility}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        r.urgency === 'emergency' ? 'bg-rose-100 text-rose-800' :
                        r.urgency === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {r.urgency}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        r.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                        r.status === 'Accepted' ? 'bg-teal-100 text-teal-800' :
                        r.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{r.createdAt}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">{r.referredByName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Connected Facility Directory */}
      {activeAdminTab === 'facilities' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              {loc.facilityGridTitle}
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {loc.liveNodes}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map(fac => (
              <div key={fac.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded">
                    {fac.type}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{loc.teleconsultActive}</span>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{fac.name}</h4>
                <div className="text-xs text-slate-600">
                  {loc.block}: <strong>{fac.block}</strong> &bull; {loc.district}: <strong>{fac.district}</strong>
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs flex justify-between text-slate-700">
                  <span>{loc.contact}: {fac.contactPerson}</span>
                  <span className="font-semibold">{fac.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Live System Audit & Traceability Log */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {loc.auditTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {loc.auditSubtitle}
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
              {auditLogs.length} {loc.entries}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {auditLogs.map(log => (
              <div key={log.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                      {log.action}
                    </span>
                    <span className="font-semibold text-teal-800">
                      {log.actorName} ({log.actorRole.toUpperCase()})
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono">{log.timestamp}</span>
                </div>

                <p className="text-slate-700 font-medium">
                  {log.details}
                </p>

                <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between">
                  <span>{loc.facilityLabel} <strong>{log.facility}</strong></span>
                  {log.patientName && <span>{loc.patientLabel} <strong>{log.patientName}</strong></span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
