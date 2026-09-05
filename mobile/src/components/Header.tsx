import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useHealth } from '../context/HealthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Language } from '../types';

interface HeaderProps {
  onOpenVoice: () => void;
  onOpenRoleSwitch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenVoice, onOpenRoleSwitch }) => {
  const {
    currentUser,
    currentRole,
    dbConnected,
    isOffline,
    setIsOffline,
    pendingOfflineSyncCount,
    syncOfflineQueue,
    resetDemoData,
    language,
    setLanguage
  } = useHealth();

  const handleSync = async () => {
    if (pendingOfflineSyncCount === 0) {
      Alert.alert('All Synced', 'All local records are already synchronized with the database.');
      return;
    }
    await syncOfflineQueue();
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Demo Database',
      'Are you sure you want to reset all records back to default demo state?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetDemoData() }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Status Bar Ribbon */}
      <View style={styles.topRibbon}>
        <View style={styles.brandRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.brandTitle}>SANJEEVANI AI</Text>
          <Text style={styles.abdmBadge}>ABDM</Text>
        </View>

        <View style={styles.ribbonActions}>
          {/* SQLite DB Status */}
          <View style={[styles.pill, dbConnected ? styles.pillDbOnline : styles.pillDbOffline]}>
            <MaterialCommunityIcons
              name="database"
              size={12}
              color={dbConnected ? '#06b6d4' : '#f59e0b'}
            />
            <Text style={[styles.pillText, { color: dbConnected ? '#06b6d4' : '#f59e0b' }]}>
              {dbConnected ? 'SQLite Live' : 'Local'}
            </Text>
          </View>

          {/* Offline Sync Button */}
          <TouchableOpacity
            style={[styles.pill, isOffline ? styles.pillOffline : styles.pillOnline]}
            onPress={() => setIsOffline(!isOffline)}
          >
            <Ionicons
              name={isOffline ? 'cloud-offline' : 'cloud-done'}
              size={12}
              color={isOffline ? '#f59e0b' : '#10b981'}
            />
            <Text style={[styles.pillText, { color: isOffline ? '#f59e0b' : '#10b981' }]}>
              {isOffline ? `Offline (${pendingOfflineSyncCount})` : 'Online'}
            </Text>
          </TouchableOpacity>

          {/* Reset Button */}
          <TouchableOpacity onPress={handleReset} style={styles.iconBtn}>
            <Ionicons name="refresh" size={14} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Bar with Role Profile */}
      <View style={styles.mainBar}>
        <TouchableOpacity style={styles.profileBox} onPress={onOpenRoleSwitch}>
          <View style={[styles.avatar, { backgroundColor: getRoleColor(currentRole) }]}>
            <Text style={styles.avatarText}>{currentUser.name.slice(0, 1)}</Text>
          </View>
          <View>
            <View style={styles.roleRow}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Ionicons name="chevron-down" size={14} color="#64748b" style={{ marginLeft: 4 }} />
            </View>
            <Text style={styles.userRole}>{currentUser.designation}</Text>
          </View>
        </TouchableOpacity>

        {/* Right Voice Trigger Button */}
        <TouchableOpacity style={styles.voiceBtn} onPress={onOpenVoice}>
          <Ionicons name="mic" size={16} color="#ffffff" />
          <Text style={styles.voiceBtnText}>AI Voice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function getRoleColor(role: string): string {
  switch (role) {
    case 'asha': return '#0d9488';
    case 'anm': return '#0284c7';
    case 'doctor': return '#4f46e5';
    case 'patient': return '#e11d48';
    case 'admin': return '#0f172a';
    default: return '#0d9488';
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingTop: 8
  },
  topRibbon: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34d399'
  },
  brandTitle: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  abdmBadge: {
    color: '#0d9488',
    fontSize: 9,
    fontWeight: '700',
    backgroundColor: '#134e4a',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3
  },
  ribbonActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#1e293b'
  },
  pillDbOnline: {
    borderColor: '#0e7490',
    borderWidth: 0.5
  },
  pillDbOffline: {
    borderColor: '#78350f',
    borderWidth: 0.5
  },
  pillOnline: {
    borderColor: '#065f46',
    borderWidth: 0.5
  },
  pillOffline: {
    borderColor: '#78350f',
    borderWidth: 0.5
  },
  pillText: {
    fontSize: 10,
    fontWeight: '600'
  },
  iconBtn: {
    padding: 2
  },
  mainBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b'
  },
  userRole: {
    fontSize: 11,
    color: '#64748b'
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0d9488',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16
  },
  voiceBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700'
  }
});
