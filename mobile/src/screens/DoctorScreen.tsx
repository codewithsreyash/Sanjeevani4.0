import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { useHealth } from '../context/HealthContext';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Referral, TriagePriority, FollowUpType } from '../types';

export const DoctorScreen: React.FC = () => {
  const { referrals, acceptReferral, recordConsultationOutcome, currentUser } = useHealth();

  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [showConsultModal, setShowConsultModal] = useState(false);

  // Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [medicines, setMedicines] = useState('');
  const [advice, setAdvice] = useState('');

  // Follow-up task to dispatch to ASHA
  const [assignFollowUp, setAssignFollowUp] = useState(true);
  const [followUpType, setFollowUpType] = useState<FollowUpType>('maternal');
  const [followUpInstructions, setFollowUpInstructions] = useState('');

  const openCases = referrals.filter(r => r.status !== 'Completed');
  const completedCases = referrals.filter(r => r.status === 'Completed');

  const handleOpenConsult = (r: Referral) => {
    setSelectedReferral(r);
    setDiagnosis(r.reason);
    setTreatmentPlan('Initiated standard clinical care protocol.');
    setMedicines('Tab Labetalol 100mg BD, Tab Calcium 500mg OD');
    setAdvice('Low salt diet, strict rest, monitor BP weekly.');
    setFollowUpInstructions(`Check BP weekly and confirm adherence to ${r.patientName}.`);
    setShowConsultModal(true);
  };

  const handleSubmitConsultation = () => {
    if (!selectedReferral || !diagnosis.trim()) {
      Alert.alert('Required', 'Please enter clinical diagnosis.');
      return;
    }

    const medsList = medicines.split(',').map(m => m.trim()).filter(Boolean);

    recordConsultationOutcome(
      selectedReferral.id,
      {
        doctorName: currentUser.name,
        diagnosis: diagnosis.trim(),
        treatmentPlan: treatmentPlan.trim(),
        prescribedMedicines: medsList,
        advice: advice.trim()
      },
      assignFollowUp
        ? {
            type: followUpType,
            dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
            instructions: followUpInstructions || 'Routine post-consultation follow-up',
            assignedToAshaName: 'Sunita Bai (ASHA)'
          }
        : undefined
    );

    setShowConsultModal(false);
    setSelectedReferral(null);
  };

  return (
    <View style={styles.container}>
      {/* Header Stat Strip */}
      <View style={styles.statStrip}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{openCases.length}</Text>
          <Text style={styles.statLabel}>Pending Queue</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#ef4444' }]}>
            {referrals.filter(r => r.urgency === 'emergency' || r.urgency === 'high').length}
          </Text>
          <Text style={styles.statLabel}>High / Critical</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#10b981' }]}>{completedCases.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollList}>
        <Text style={styles.sectionHeader}>Incoming Referral Queue</Text>

        {openCases.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="checkmark-done-circle" size={44} color="#10b981" />
            <Text style={styles.emptyText}>All referral cases evaluated!</Text>
          </View>
        ) : (
          openCases.map(r => (
            <View key={r.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>{r.patientName}</Text>
                  <Text style={styles.patientMeta}>
                    {r.patientAge}y • {r.patientGender} • {r.patientVillage}
                  </Text>
                </View>
                <View style={[styles.urgencyBadge, getUrgencyStyle(r.urgency)]}>
                  <Text style={styles.urgencyBadgeText}>{r.urgency.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.facilityRoute}>
                <Text style={styles.facilityText}>{r.fromFacility}</Text>
                <Ionicons name="arrow-forward" size={12} color="#64748b" />
                <Text style={[styles.facilityText, { fontWeight: '700' }]}>{r.toFacility}</Text>
              </View>

              <Text style={styles.reasonText}>Reason: {r.reason}</Text>
              {r.clinicalSummary && (
                <Text style={styles.summaryText}>Summary: {r.clinicalSummary}</Text>
              )}

              <View style={styles.actionRow}>
                {r.status === 'Created' ? (
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => acceptReferral(r.id, currentUser.name)}
                  >
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                    <Text style={styles.btnText}>Accept Referral</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.consultBtn}
                    onPress={() => handleOpenConsult(r)}
                  >
                    <FontAwesome5 name="stethoscope" size={14} color="#ffffff" />
                    <Text style={styles.btnText}>Consult & Prescribe</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}

        {/* Completed Section */}
        {completedCases.length > 0 && (
          <>
            <Text style={[styles.sectionHeader, { marginTop: 16 }]}>Completed Cases ({completedCases.length})</Text>
            {completedCases.map(r => (
              <View key={r.id} style={[styles.card, { opacity: 0.85 }]}>
                <View style={styles.cardTop}>
                  <Text style={styles.patientName}>{r.patientName}</Text>
                  <View style={styles.doneBadge}>
                    <Text style={styles.doneBadgeText}>COMPLETED</Text>
                  </View>
                </View>
                {r.consultationOutcome && (
                  <View style={styles.outcomeBox}>
                    <Text style={styles.outcomeDiag}>Diagnosis: {r.consultationOutcome.diagnosis}</Text>
                    <Text style={styles.outcomeRx}>Rx: {r.consultationOutcome.prescribedMedicines.join(', ')}</Text>
                  </View>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Modal: Consult & Prescribe */}
      <Modal visible={showConsultModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Consultation: {selectedReferral?.patientName}</Text>
            <ScrollView style={{ maxHeight: 380 }}>
              <Text style={styles.label}>Clinical Diagnosis *</Text>
              <TextInput
                style={styles.modalInput}
                value={diagnosis}
                onChangeText={setDiagnosis}
              />

              <Text style={styles.label}>Treatment Plan</Text>
              <TextInput
                style={styles.modalInput}
                value={treatmentPlan}
                onChangeText={setTreatmentPlan}
              />

              <Text style={styles.label}>Prescribed Medicines (comma separated)</Text>
              <TextInput
                style={styles.modalInput}
                value={medicines}
                onChangeText={setMedicines}
              />

              <Text style={styles.label}>Clinical Advice</Text>
              <TextInput
                style={styles.modalInput}
                value={advice}
                onChangeText={setAdvice}
              />

              {/* Follow-up Section */}
              <View style={styles.followUpToggleRow}>
                <Text style={styles.label}>Dispatch Follow-up Task to ASHA?</Text>
                <TouchableOpacity
                  style={[styles.toggleBtn, assignFollowUp && styles.toggleBtnActive]}
                  onPress={() => setAssignFollowUp(!assignFollowUp)}
                >
                  <Text style={[styles.toggleBtnText, assignFollowUp && styles.toggleBtnTextActive]}>
                    {assignFollowUp ? 'YES' : 'NO'}
                  </Text>
                </TouchableOpacity>
              </View>

              {assignFollowUp && (
                <View style={{ gap: 4 }}>
                  <Text style={styles.label}>Task Instructions for ASHA</Text>
                  <TextInput
                    style={[styles.modalInput, { height: 60 }]}
                    value={followUpInstructions}
                    onChangeText={setFollowUpInstructions}
                    placeholder="e.g. Verify blood pressure and medication compliance"
                    multiline
                  />
                </View>
              )}
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowConsultModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmitConsultation}
              >
                <Text style={styles.submitBtnText}>Complete & Dispatch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

function getUrgencyStyle(urgency: TriagePriority) {
  switch (urgency) {
    case 'emergency':
      return { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
    case 'high':
      return { backgroundColor: '#ffedd5', borderColor: '#f97316' };
    default:
      return { backgroundColor: '#e0f2fe', borderColor: '#0284c7' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  statStrip: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 10,
    gap: 8
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 8
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a'
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2
  },
  scrollList: {
    padding: 12,
    gap: 10
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b'
  },
  patientMeta: {
    fontSize: 12,
    color: '#64748b'
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 0.5
  },
  urgencyBadgeText: {
    fontSize: 10,
    fontWeight: '800'
  },
  facilityRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    padding: 6,
    borderRadius: 6
  },
  facilityText: {
    fontSize: 11,
    color: '#475569'
  },
  reasonText: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '600'
  },
  summaryText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic'
  },
  actionRow: {
    marginTop: 4
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    borderRadius: 6
  },
  consultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0d9488',
    paddingVertical: 8,
    borderRadius: 6
  },
  btnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  doneBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4
  },
  doneBadgeText: {
    color: '#16a34a',
    fontSize: 10,
    fontWeight: '800'
  },
  outcomeBox: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
    marginTop: 4
  },
  outcomeDiag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b'
  },
  outcomeRx: {
    fontSize: 12,
    color: '#0d9488',
    marginTop: 2
  },
  emptyBox: {
    alignItems: 'center',
    padding: 30,
    gap: 8
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 8
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b'
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 6
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: '#1e293b'
  },
  followUpToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8
  },
  toggleBtn: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14
  },
  toggleBtnActive: {
    backgroundColor: '#0d9488'
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b'
  },
  toggleBtnTextActive: {
    color: '#ffffff'
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f1f5f9'
  },
  cancelBtnText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600'
  },
  submitBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#4f46e5'
  },
  submitBtnText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '700'
  }
});
