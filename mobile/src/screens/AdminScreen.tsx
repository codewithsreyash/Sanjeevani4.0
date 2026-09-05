import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useHealth } from '../context/HealthContext';
import { getApiBaseUrl, setApiBaseUrl } from '../services/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const AdminScreen: React.FC = () => {
  const {
    patients,
    encounters,
    referrals,
    followUps,
    facilities,
    auditLogs,
    dbStats,
    dbConnected,
    refreshFromBackend,
    resetDemoData
  } = useHealth();

  const [backendUrlInput, setBackendUrlInput] = useState(getApiBaseUrl());
  const [showConfig, setShowConfig] = useState(false);

  const handleSaveUrl = async () => {
    try {
      await setApiBaseUrl(backendUrlInput);
      await refreshFromBackend();
      Alert.alert('Backend URL Updated', `Connected to: ${backendUrlInput}`);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>District Health Command HQ</Text>
        <Text style={styles.headerSub}>Public Health Surveillance & ABDM Audit Trail</Text>
      </View>

      {/* Database Connection Card */}
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialCommunityIcons name="database" size={18} color="#0d9488" />
            <Text style={styles.cardTitle}>SQLite Persistence Engine</Text>
          </View>
          <View style={[styles.statusBadge, dbConnected ? styles.bgOnline : styles.bgOffline]}>
            <Text style={[styles.statusText, dbConnected ? styles.textOnline : styles.textOffline]}>
              {dbConnected ? 'CONNECTED' : 'LOCAL CACHE'}
            </Text>
          </View>
        </View>

        <Text style={styles.metaLine}>Host: {getApiBaseUrl()}</Text>
        {dbStats && (
          <>
            <Text style={styles.metaLine}>Engine: {dbStats.engine}</Text>
            <Text style={styles.metaLine}>DB Path: {dbStats.dbPath}</Text>
            <Text style={styles.metaLine}>DB File Size: {(dbStats.fileSizeBytes / 1024).toFixed(1)} KB</Text>
          </>
        )}

        <TouchableOpacity style={styles.toggleConfigBtn} onPress={() => setShowConfig(!showConfig)}>
          <Ionicons name="settings-outline" size={14} color="#0d9488" />
          <Text style={styles.toggleConfigText}>
            {showConfig ? 'Hide Backend IP Config' : 'Change Backend Host IP (for Physical Device / Emulator)'}
          </Text>
        </TouchableOpacity>

        {showConfig && (
          <View style={styles.configBox}>
            <Text style={styles.label}>Backend REST API Base URL:</Text>
            <TextInput
              style={styles.urlInput}
              value={backendUrlInput}
              onChangeText={setBackendUrlInput}
              placeholder="http://10.0.2.2:3000 or http://50.0.1.68:3000"
              autoCapitalize="none"
            />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              <TouchableOpacity style={styles.urlPresetBtn} onPress={() => setBackendUrlInput('http://10.0.2.2:3000')}>
                <Text style={styles.urlPresetText}>Android Emulator</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.urlPresetBtn} onPress={() => setBackendUrlInput('http://50.0.1.68:3000')}>
                <Text style={styles.urlPresetText}>Wi-Fi IP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveUrlBtn} onPress={handleSaveUrl}>
                <Text style={styles.saveUrlText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Continuum Summary Metrics */}
      <View style={styles.statsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{patients.length}</Text>
          <Text style={styles.metricLabel}>Registered Citizens</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricNumber}>{encounters.length}</Text>
          <Text style={styles.metricLabel}>Vitals Encounters</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricNumber, { color: '#6366f1' }]}>{referrals.length}</Text>
          <Text style={styles.metricLabel}>Active Referrals</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={[styles.metricNumber, { color: '#10b981' }]}>
            {followUps.filter(f => f.status === 'completed').length} / {followUps.length}
          </Text>
          <Text style={styles.metricLabel}>Follow-ups Closed</Text>
        </View>
      </View>

      {/* Facilities Continuum */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>4-Tier Public Health Continuum</Text>
        {facilities.map(fac => (
          <View key={fac.id} style={styles.facilityRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.facilityName}>{fac.name}</Text>
              <Text style={styles.facilityMeta}>{fac.type} • {fac.block} • Staff: {fac.activeStaffCount}</Text>
            </View>
            <View style={styles.teleconsultBadge}>
              <Text style={styles.teleconsultText}>Teleconsult Active</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Live Audit Log Stream */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Live Clinical & Security Audit Trail</Text>
        {auditLogs.slice(0, 6).map(log => (
          <View key={log.id} style={styles.logRow}>
            <View style={styles.logHeader}>
              <Text style={styles.logAction}>{log.action}</Text>
              <Text style={styles.logTime}>{log.timestamp}</Text>
            </View>
            <Text style={styles.logActor}>{log.actorName} ({log.actorRole.toUpperCase()}) • {log.facility}</Text>
            <Text style={styles.logDetails}>{log.details}</Text>
          </View>
        ))}
      </View>
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
  headerBox: {
    gap: 2
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a'
  },
  headerSub: {
    fontSize: 12,
    color: '#64748b'
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
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b'
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4
  },
  bgOnline: {
    backgroundColor: '#ccfbf1'
  },
  bgOffline: {
    backgroundColor: '#fef3c7'
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800'
  },
  textOnline: {
    color: '#0f766e'
  },
  textOffline: {
    color: '#b45309'
  },
  metaLine: {
    fontSize: 11,
    color: '#64748b'
  },
  toggleConfigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4
  },
  toggleConfigText: {
    fontSize: 11,
    color: '#0d9488',
    fontWeight: '600'
  },
  configBox: {
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 6,
    marginTop: 6
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569'
  },
  urlInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    marginTop: 4
  },
  urlPresetBtn: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4
  },
  urlPresetText: {
    fontSize: 10,
    color: '#334155',
    fontWeight: '600'
  },
  saveUrlBtn: {
    backgroundColor: '#0d9488',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
    marginLeft: 'auto'
  },
  saveUrlText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '700'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a'
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2
  },
  facilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9'
  },
  facilityName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b'
  },
  facilityMeta: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1
  },
  teleconsultBadge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  teleconsultText: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '700'
  },
  logRow: {
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9',
    gap: 2
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  logAction: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0d9488'
  },
  logTime: {
    fontSize: 10,
    color: '#94a3b8'
  },
  logActor: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600'
  },
  logDetails: {
    fontSize: 11,
    color: '#64748b'
  }
});
