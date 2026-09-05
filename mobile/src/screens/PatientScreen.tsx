import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useHealth } from '../context/HealthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const PatientScreen: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    encounters,
    referrals,
    appointments,
    togglePatientConsent
  } = useHealth();

  const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const myEncounters = encounters.filter(e => e.patientId === patient?.id);
  const myReferrals = referrals.filter(r => r.patientId === patient?.id);
  const myAppointments = appointments.filter(a => a.patientId === patient?.id);

  if (!patient) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No patient record selected.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Official ABHA Health ID Card */}
      <View style={styles.abhaCard}>
        <View style={styles.abhaCardTop}>
          <View>
            <Text style={styles.govTitle}>AYUSHMAN BHARAT DIGITAL MISSION</Text>
            <Text style={styles.abhaName}>{patient.name}</Text>
          </View>
          <MaterialCommunityIcons name="qrcode-scan" size={36} color="#ffffff" />
        </View>

        <View style={styles.abhaNumberBox}>
          <Text style={styles.abhaNumberLabel}>ABHA Number</Text>
          <Text style={styles.abhaNumber}>{patient.abhaId || '91-4829-1029-3321'}</Text>
        </View>

        <View style={styles.abhaCardBottom}>
          <Text style={styles.abhaMeta}>Age: {patient.age}y • Gender: {patient.gender}</Text>
          <Text style={styles.abhaMeta}>Village: {patient.village}</Text>
        </View>
      </View>

      {/* Digital Consent Switch */}
      <View style={styles.consentCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.consentTitle}>Digital Health Consent (ABDM)</Text>
          <Text style={styles.consentDesc}>
            {patient.hasGivenDigitalConsent
              ? 'ACTIVE: Authorised PHC doctors & ASHAs can view your health records.'
              : 'REVOKED: Health record sharing is currently restricted.'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.consentToggleBtn, patient.hasGivenDigitalConsent ? styles.consentActive : styles.consentInactive]}
          onPress={() => togglePatientConsent(patient.id)}
        >
          <Text style={styles.consentToggleText}>
            {patient.hasGivenDigitalConsent ? 'GRANTED' : 'REVOKED'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Linked ASHA Card */}
      <View style={styles.ashaContactCard}>
        <View style={styles.ashaAvatar}>
          <Ionicons name="person" size={20} color="#0d9488" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.ashaContactName}>{patient.linkedAshaName}</Text>
          <Text style={styles.ashaContactPhone}>Assigned Village Health Worker • {patient.linkedAshaPhone}</Text>
        </View>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Alert.alert('Call ASHA', `Dialing ${patient.linkedAshaPhone}...`)}
        >
          <Ionicons name="call" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Emergency Dial Alert */}
      <TouchableOpacity
        style={styles.emergencyBanner}
        onPress={() => Alert.alert('Emergency Helpline', 'Dialing 108 Ambulance Service...')}
      >
        <Ionicons name="warning" size={20} color="#ffffff" />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.emergencyTitle}>108 National Ambulance Helpline</Text>
          <Text style={styles.emergencySub}>Tap for immediate rural emergency medical transport</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#ffffff" />
      </TouchableOpacity>

      {/* Latest Vitals */}
      {patient.lastVitals && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Monitored Vitals</Text>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalVal}>
                {patient.lastVitals.bpSystolic}/{patient.lastVitals.bpDiastolic || '-'}
              </Text>
              <Text style={styles.vitalKey}>Blood Pressure</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalVal}>{patient.lastVitals.spO2}%</Text>
              <Text style={styles.vitalKey}>Oxygen (SpO2)</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalVal}>{patient.lastVitals.pulse} bpm</Text>
              <Text style={styles.vitalKey}>Pulse Rate</Text>
            </View>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalVal}>{patient.lastVitals.hemoglobin || 9.8} g/dL</Text>
              <Text style={styles.vitalKey}>Hemoglobin</Text>
            </View>
          </View>
        </View>
      )}

      {/* Appointments */}
      {myAppointments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Consultations</Text>
          {myAppointments.map(a => (
            <View key={a.id} style={styles.aptCard}>
              <View style={styles.aptTop}>
                <Text style={styles.aptProvider}>{a.providerName}</Text>
                <Text style={styles.aptType}>{a.type.toUpperCase()}</Text>
              </View>
              <Text style={styles.aptFacility}>{a.facilityName}</Text>
              <Text style={styles.aptDate}>Date: {a.date} at {a.time}</Text>
              <Text style={styles.aptPurpose}>{a.purpose}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Past Prescriptions & Referrals */}
      {myReferrals.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Advice & Prescriptions</Text>
          {myReferrals.map(r => (
            <View key={r.id} style={styles.refCard}>
              <Text style={styles.refReason}>{r.reason}</Text>
              <Text style={styles.refDate}>Referred to {r.toFacility}</Text>
              {r.consultationOutcome && (
                <View style={styles.rxBox}>
                  <Text style={styles.rxTitle}>Prescription from {r.consultationOutcome.doctorName}:</Text>
                  <Text style={styles.rxMeds}>Medicines: {r.consultationOutcome.prescribedMedicines.join(', ')}</Text>
                  <Text style={styles.rxAdvice}>Advice: {r.consultationOutcome.advice}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  content: {
    padding: 14,
    gap: 12
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  abhaCard: {
    backgroundColor: '#be123c',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: '#be123c',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  abhaCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  govTitle: {
    fontSize: 9,
    color: '#ffe4e6',
    fontWeight: '800',
    letterSpacing: 0.5
  },
  abhaName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2
  },
  abhaNumberBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: 8,
    borderRadius: 6
  },
  abhaNumberLabel: {
    fontSize: 9,
    color: '#fecdd3',
    fontWeight: '600'
  },
  abhaNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1
  },
  abhaCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  abhaMeta: {
    fontSize: 11,
    color: '#ffe4e6',
    fontWeight: '600'
  },
  consentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10
  },
  consentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b'
  },
  consentDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2
  },
  consentToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  consentActive: {
    backgroundColor: '#10b981'
  },
  consentInactive: {
    backgroundColor: '#64748b'
  },
  consentToggleText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  },
  ashaContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10
  },
  ashaAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ccfbf1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ashaContactName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b'
  },
  ashaContactPhone: {
    fontSize: 11,
    color: '#64748b'
  },
  callBtn: {
    backgroundColor: '#0d9488',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 10,
    padding: 12
  },
  emergencyTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800'
  },
  emergencySub: {
    color: '#fee2e2',
    fontSize: 11
  },
  section: {
    gap: 8
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155'
  },
  vitalsGrid: {
    flexDirection: 'row',
    gap: 8
  },
  vitalBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  vitalVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a'
  },
  vitalKey: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center'
  },
  aptCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 2
  },
  aptTop: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  aptProvider: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b'
  },
  aptType: {
    fontSize: 10,
    color: '#0d9488',
    fontWeight: '700'
  },
  aptFacility: {
    fontSize: 11,
    color: '#64748b'
  },
  aptDate: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600'
  },
  aptPurpose: {
    fontSize: 12,
    color: '#334155',
    marginTop: 4
  },
  refCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4
  },
  refReason: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b'
  },
  refDate: {
    fontSize: 11,
    color: '#64748b'
  },
  rxBox: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
    gap: 2
  },
  rxTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0d9488'
  },
  rxMeds: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b'
  },
  rxAdvice: {
    fontSize: 11,
    color: '#475569'
  }
});
