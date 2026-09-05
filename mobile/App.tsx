import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { HealthProvider, useHealth } from './src/context/HealthContext';
import { Header } from './src/components/Header';
import { AshaScreen } from './src/screens/AshaScreen';
import { DoctorScreen } from './src/screens/DoctorScreen';
import { PatientScreen } from './src/screens/PatientScreen';
import { AdminScreen } from './src/screens/AdminScreen';
import { VoiceAssistantModal } from './src/screens/VoiceAssistantModal';
import { RoleSwitchModal } from './src/screens/RoleSwitchModal';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserRole } from './src/types';

const MainApp: React.FC = () => {
  const { currentRole, switchUserRole, notification } = useHealth();

  const [showVoice, setShowVoice] = useState(false);
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="light" />

      {/* Global Header */}
      <Header
        onOpenVoice={() => setShowVoice(true)}
        onOpenRoleSwitch={() => setShowRoleSwitch(true)}
      />

      {/* Flash Toast Notification */}
      {notification && (
        <View style={styles.notificationToast}>
          <Ionicons name="information-circle" size={16} color="#ffffff" />
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      )}

      {/* Active Role Screen */}
      <View style={styles.screenContainer}>
        {(currentRole === 'asha' || currentRole === 'anm') && <AshaScreen />}
        {currentRole === 'doctor' && <DoctorScreen />}
        {currentRole === 'patient' && <PatientScreen />}
        {currentRole === 'admin' && <AdminScreen />}
      </View>

      {/* Bottom Role Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.bottomTab, (currentRole === 'asha' || currentRole === 'anm') && styles.bottomTabActive]}
          onPress={() => switchUserRole('asha')}
        >
          <Ionicons
            name="people"
            size={20}
            color={(currentRole === 'asha' || currentRole === 'anm') ? '#0d9488' : '#94a3b8'}
          />
          <Text
            style={[
              styles.bottomTabText,
              (currentRole === 'asha' || currentRole === 'anm') && styles.bottomTabTextActive
            ]}
          >
            ASHA / ANM
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomTab, currentRole === 'doctor' && styles.bottomTabActive]}
          onPress={() => switchUserRole('doctor')}
        >
          <FontAwesome5
            name="stethoscope"
            size={18}
            color={currentRole === 'doctor' ? '#4f46e5' : '#94a3b8'}
          />
          <Text
            style={[
              styles.bottomTabText,
              currentRole === 'doctor' && { color: '#4f46e5', fontWeight: '700' }
            ]}
          >
            Doctor OPD
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomTab, currentRole === 'patient' && styles.bottomTabActive]}
          onPress={() => switchUserRole('patient')}
        >
          <Ionicons
            name="card"
            size={20}
            color={currentRole === 'patient' ? '#e11d48' : '#94a3b8'}
          />
          <Text
            style={[
              styles.bottomTabText,
              currentRole === 'patient' && { color: '#e11d48', fontWeight: '700' }
            ]}
          >
            Citizen ABHA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomTab, currentRole === 'admin' && styles.bottomTabActive]}
          onPress={() => switchUserRole('admin')}
        >
          <MaterialCommunityIcons
            name="shield-check"
            size={20}
            color={currentRole === 'admin' ? '#0f172a' : '#94a3b8'}
          />
          <Text
            style={[
              styles.bottomTabText,
              currentRole === 'admin' && { color: '#0f172a', fontWeight: '700' }
            ]}
          >
            District HQ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <VoiceAssistantModal
        visible={showVoice}
        onClose={() => setShowVoice(false)}
      />

      <RoleSwitchModal
        visible={showRoleSwitch}
        onClose={() => setShowRoleSwitch(false)}
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <HealthProvider>
      <MainApp />
    </HealthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  notificationToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0d9488',
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    flex: 1
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    justifyContent: 'space-around'
  },
  bottomTab: {
    alignItems: 'center',
    paddingVertical: 4,
    flex: 1
  },
  bottomTabActive: {},
  bottomTabText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 3,
    fontWeight: '500'
  },
  bottomTabTextActive: {
    color: '#0d9488',
    fontWeight: '700'
  }
});
