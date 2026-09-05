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
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Patient, Vitals, TriagePriority } from '../types';

export const AshaScreen: React.FC = () => {
  const {
    patients,
    encounters,
    followUps,
    addPatient,
    recordEncounter,
    completeFollowUp,
    pendingOfflineSyncCount,
    syncOfflineQueue
  } = useHealth();

  const [activeTab, setActiveTab] = useState<'patients' | 'vitals' | 'followups'>('patients');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showRegModal, setShowRegModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedPatForVitals, setSelectedPatForVitals] = useState<Patient | null>(null);

  // New Patient Form State
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [newPhone, setNewPhone] = useState('');
  const [newVillage, setNewVillage] = useState('Rampur');
  const [newHistory, setNewHistory] = useState('');
  const [newConditions, setNewConditions] = useState('');

  // Vitals Form State
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [pulse, setPulse] = useState('76');
  const [temperature, setTemperature] = useState('98.4');
  const [spo2, setSpo2] = useState('98');
  const [bloodSugar, setBloodSugar] = useState('');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [actionNotes, setActionNotes] = useState('Routine village home monitoring visit');

  // Follow-up Completion Note
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [activeFollowUpId, setActiveFollowUpId] = useState<string | null>(null);
  const [followUpNotes, setFollowUpNotes] = useState('');

  const filteredPatients = patients.filter(
    p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.abhaId && p.abhaId.includes(searchQuery))
  );

  const pendingFollowUps = followUps.filter(f => f.status === 'pending');

  const handleRegisterPatient = () => {
    if (!newName.trim() || !newAge.trim() || !newPhone.trim()) {
      Alert.alert('Missing Details', 'Please enter Name, Age, and Phone number.');
      return;
    }

    addPatient({
      name: newName.trim(),
      age: parseInt(newAge) || 25,
      gender: newGender,
      phone: newPhone.trim(),
      village: newVillage.trim(),
      language: 'hi',
      linkedAshaName: 'Sunita Bai (ASHA)',
      linkedAshaPhone: '+91 98230 11223',
      medicalHistory: newHistory.trim() || 'No prior chronic conditions recorded.',
      chronicConditions: newConditions ? newConditions.split(',').map(c => c.trim()) : [],
      hasGivenDigitalConsent: true
    });

    setNewName('');
    setNewAge('');
    setNewPhone('');
    setNewHistory('');
    setNewConditions('');
    setShowRegModal(false);
  };

  const handleRecordVitals = () => {
    if (!selectedPatForVitals) return;

    const v: Vitals = {
      bpSystolic: parseInt(systolic) || undefined,
      bpDiastolic: parseInt(diastolic) || undefined,
      pulse: parseInt(pulse) || undefined,
      temperature: parseFloat(temperature) || undefined,
      spO2: parseInt(spo2) || undefined,
      bloodSugar: bloodSugar ? parseInt(bloodSugar) : undefined
    };

    const symptomsList = symptomsInput
      ? symptomsInput.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    recordEncounter({
      patientId: selectedPatForVitals.id,
      symptoms: symptomsList,
      symptomNotes: symptomsInput ? `Reported symptoms: ${symptomsInput}` : 'No abnormal acute symptoms reported.',
      vitals: v,
      facilityName: 'Rampur Village Outreach',
      facilityType: 'Sub-centre',
      recordedByName: 'Sunita Bai (ASHA)',
      actionTaken: actionNotes
    });

    setShowVitalsModal(false);
    setSelectedPatForVitals(null);
    setSymptomsInput('');
  };

  const handleCompleteFollowUp = () => {
    if (!activeFollowUpId) return;
    completeFollowUp(
      activeFollowUpId,
      followUpNotes || 'Home visit completed. Checked vital signs and medicine adherence.'
    );
    setShowFollowUpModal(false);
    setActiveFollowUpId(null);
    setFollowUpNotes('');
  };

  return (
    <View style={styles.container}>
      {/* Offline Sync Banner */}
      {pendingOfflineSyncCount > 0 && (
        <TouchableOpacity style={styles.syncBanner} onPress={syncOfflineQueue}>
          <View style={styles.syncBannerContent}>
            <Ionicons name="cloud-upload" size={16} color="#ffffff" />
            <Text style={styles.syncBannerText}>
              {pendingOfflineSyncCount} field record(s) queued offline. Tap to sync to SQLite!
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={14} color="#ffffff" />
        </TouchableOpacity>
      )}

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'patients' && styles.tabBtnActive]}
          onPress={() => setActiveTab('patients')}
        >
          <Text style={[styles.tabText, activeTab === 'patients' && styles.tabTextActive]}>
            Villagers ({patients.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'followups' && styles.tabBtnActive]}
          onPress={() => setActiveTab('followups')}
        >
          <Text style={[styles.tabText, activeTab === 'followups' && styles.tabTextActive]}>
            Follow-ups ({pendingFollowUps.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'vitals' && styles.tabBtnActive]}
          onPress={() => setActiveTab('vitals')}
        >
          <Text style={[styles.tabText, activeTab === 'vitals' && styles.tabTextActive]}>
            Triage Logs ({encounters.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Patients List */}
      {activeTab === 'patients' && (
        <View style={{ flex: 1 }}>
          {/* Action Row */}
          <View style={styles.searchBarRow}>
            <View style={styles.searchInputWrapper}>
              <Ionicons name="search" size={16} color="#64748b" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search name, village, ABHA..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#94a3b8"
              />
            </View>
            <TouchableOpacity style={styles.registerBtn} onPress={() => setShowRegModal(true)}>
              <Ionicons name="person-add" size={16} color="#ffffff" />
              <Text style={styles.registerBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollList}>
            {filteredPatients.map(p => (
              <View key={p.id} style={styles.patientCard}>
                <View style={styles.patientCardHeader}>
                  <View>
                    <Text style={styles.patientName}>{p.name}</Text>
                    <Text style={styles.patientMeta}>
                      {p.age}y • {p.gender} • {p.village}
                    </Text>
                    {p.abhaId && (
                      <Text style={styles.abhaIdText}>ABHA: {p.abhaId}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.vitalsBtn}
                    onPress={() => {
                      setSelectedPatForVitals(p);
                      setShowVitalsModal(true);
                    }}
                  >
                    <FontAwesome5 name="heartbeat" size={13} color="#ffffff" />
                    <Text style={styles.vitalsBtnText}>Vitals</Text>
                  </TouchableOpacity>
                </View>

                {p.chronicConditions && p.chronicConditions.length > 0 && (
                  <View style={styles.badgeRow}>
                    {p.chronicConditions.map((c, i) => (
                      <View key={i} style={styles.conditionBadge}>
                        <Text style={styles.conditionText}>{c}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {p.lastVitals && (
                  <View style={styles.vitalsPillRow}>
                    <Text style={styles.vitalsPill}>
                      BP: {p.lastVitals.bpSystolic}/{p.lastVitals.bpDiastolic}
                    </Text>
                    <Text style={styles.vitalsPill}>SpO2: {p.lastVitals.spO2}%</Text>
                    <Text style={styles.vitalsPill}>Pulse: {p.lastVitals.pulse} bpm</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Tab 2: Follow-ups */}
      {activeTab === 'followups' && (
        <ScrollView contentContainerStyle={styles.scrollList}>
          {pendingFollowUps.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="checkmark-circle-outline" size={48} color="#10b981" />
              <Text style={styles.emptyText}>All scheduled home follow-ups completed!</Text>
            </View>
          ) : (
            pendingFollowUps.map(f => (
              <View key={f.id} style={styles.followUpCard}>
                <View style={styles.followUpTop}>
                  <View>
                    <Text style={styles.patientName}>{f.patientName}</Text>
                    <Text style={styles.patientMeta}>Village: {f.patientVillage} • Due: {f.dueDate}</Text>
                  </View>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{f.type.toUpperCase()}</Text>
                  </View>
                </View>

                <Text style={styles.instructionText}>Instructions: {f.instructions}</Text>
                <Text style={styles.assignedByText}>Assigned by: {f.createdByName} ({f.createdByRole})</Text>

                <TouchableOpacity
                  style={styles.completeBtn}
                  onPress={() => {
                    setActiveFollowUpId(f.id);
                    setShowFollowUpModal(true);
                  }}
                >
                  <Ionicons name="checkbox" size={16} color="#ffffff" />
                  <Text style={styles.completeBtnText}>Mark Home Visit Done</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Tab 3: Encounters / Triage Logs */}
      {activeTab === 'vitals' && (
        <ScrollView contentContainerStyle={styles.scrollList}>
          {encounters.map(e => (
            <View key={e.id} style={styles.encounterCard}>
              <View style={styles.followUpTop}>
                <Text style={styles.patientName}>{e.patientName}</Text>
                <View style={[styles.triageBadge, getTriageStyle(e.triagePriority)]}>
                  <Text style={styles.triageBadgeText}>{e.triagePriority.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.patientMeta}>{e.date} • {e.facilityName}</Text>
              <Text style={styles.riskReasonText}>{e.riskReason}</Text>
              <Text style={styles.actionText}>Action: {e.actionTaken}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Modal: Register Patient */}
      <Modal visible={showRegModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Register Village Citizen</Text>
            <ScrollView style={{ maxHeight: 380 }}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Anandi Bai"
                value={newName}
                onChangeText={setNewName}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Age *</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="e.g. 32"
                    keyboardType="numeric"
                    value={newAge}
                    onChangeText={setNewAge}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.genderRow}>
                    {(['Female', 'Male'] as const).map(g => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.genderBtn, newGender === g && styles.genderBtnActive]}
                        onPress={() => setNewGender(g)}
                      >
                        <Text style={[styles.genderText, newGender === g && styles.genderTextActive]}>
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <Text style={styles.label}>Mobile Phone *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="+91 98000 00000"
                keyboardType="phone-pad"
                value={newPhone}
                onChangeText={setNewPhone}
              />

              <Text style={styles.label}>Village</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Rampur / Chandur"
                value={newVillage}
                onChangeText={setNewVillage}
              />

              <Text style={styles.label}>Chronic Conditions (comma separated)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Hypertension, ANC Pregnancy"
                value={newConditions}
                onChangeText={setNewConditions}
              />

              <Text style={styles.label}>Medical Notes</Text>
              <TextInput
                style={[styles.modalInput, { height: 60 }]}
                placeholder="Brief medical history..."
                multiline
                value={newHistory}
                onChangeText={setNewHistory}
              />
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowRegModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleRegisterPatient}
              >
                <Text style={styles.submitBtnText}>Save Patient</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Record Vitals */}
      <Modal visible={showVitalsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Record Vitals: {selectedPatForVitals?.name}
            </Text>

            <ScrollView style={{ maxHeight: 380 }}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>BP Systolic (mmHg)</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={systolic}
                    onChangeText={setSystolic}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>BP Diastolic (mmHg)</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={diastolic}
                    onChangeText={setDiastolic}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Pulse (bpm)</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={pulse}
                    onChangeText={setPulse}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>SpO2 (%)</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={spo2}
                    onChangeText={setSpo2}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Temp (°F)</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={temperature}
                    onChangeText={setTemperature}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Blood Sugar (mg/dL)</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Optional"
                    value={bloodSugar}
                    onChangeText={setBloodSugar}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.label}>Reported Symptoms (comma separated)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Headache, dizziness, fever"
                value={symptomsInput}
                onChangeText={setSymptomsInput}
              />

              <Text style={styles.label}>Field Action Taken</Text>
              <TextInput
                style={styles.modalInput}
                value={actionNotes}
                onChangeText={setActionNotes}
              />
            </ScrollView>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowVitalsModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleRecordVitals}
              >
                <Text style={styles.submitBtnText}>Calculate & Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Complete Follow-up */}
      <Modal visible={showFollowUpModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete Home Visit</Text>
            <Text style={styles.label}>Observation / Care Notes:</Text>
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              placeholder="e.g. Checked BP and adherence to prescribed medicines..."
              multiline
              value={followUpNotes}
              onChangeText={setFollowUpNotes}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowFollowUpModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleCompleteFollowUp}
              >
                <Text style={styles.submitBtnText}>Mark Completed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

function getTriageStyle(priority: TriagePriority) {
  switch (priority) {
    case 'emergency':
      return { backgroundColor: '#fee2e2', borderColor: '#ef4444' };
    case 'high':
      return { backgroundColor: '#ffedd5', borderColor: '#f97316' };
    case 'medium':
      return { backgroundColor: '#fef9c3', borderColor: '#eab308' };
    default:
      return { backgroundColor: '#dcfce7', borderColor: '#22c55e' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  syncBanner: {
    backgroundColor: '#d97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  syncBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  syncBannerText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 10
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  tabBtnActive: {
    borderBottomColor: '#0d9488'
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b'
  },
  tabTextActive: {
    color: '#0d9488',
    fontWeight: '700'
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#ffffff'
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 10,
    gap: 6
  },
  searchInput: {
    flex: 1,
    height: 38,
    fontSize: 13,
    color: '#1e293b'
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0d9488',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8
  },
  registerBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  scrollList: {
    padding: 12,
    gap: 10
  },
  patientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  patientCardHeader: {
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
    color: '#64748b',
    marginTop: 2
  },
  abhaIdText: {
    fontSize: 11,
    color: '#0d9488',
    fontWeight: '600',
    marginTop: 2
  },
  vitalsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#e11d48',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  vitalsBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8
  },
  conditionBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#fecaca'
  },
  conditionText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '600'
  },
  vitalsPillRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8
  },
  vitalsPill: {
    backgroundColor: '#f1f5f9',
    fontSize: 11,
    color: '#475569',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '500'
  },
  followUpCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6
  },
  followUpTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  typeBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4
  },
  typeBadgeText: {
    fontSize: 10,
    color: '#0369a1',
    fontWeight: '700'
  },
  instructionText: {
    fontSize: 13,
    color: '#334155',
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6
  },
  assignedByText: {
    fontSize: 11,
    color: '#64748b'
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10b981',
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 4
  },
  completeBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700'
  },
  encounterCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4
  },
  triageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 0.5
  },
  triageBadgeText: {
    fontSize: 11,
    fontWeight: '800'
  },
  riskReasonText: {
    fontSize: 12,
    color: '#b91c1c',
    fontWeight: '600',
    marginTop: 4
  },
  actionText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 10
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500'
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
    padding: 18,
    gap: 8
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6
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
    color: '#1e293b',
    marginTop: 2
  },
  genderRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2
  },
  genderBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingVertical: 7,
    alignItems: 'center'
  },
  genderBtnActive: {
    backgroundColor: '#0d9488',
    borderColor: '#0d9488'
  },
  genderText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600'
  },
  genderTextActive: {
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
    backgroundColor: '#0d9488'
  },
  submitBtnText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '700'
  }
});
