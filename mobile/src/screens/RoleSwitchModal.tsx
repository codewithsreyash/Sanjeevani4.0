import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useHealth } from '../context/HealthContext';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../types';

interface RoleSwitchModalProps {
  visible: boolean;
  onClose: () => void;
}

export const RoleSwitchModal: React.FC<RoleSwitchModalProps> = ({ visible, onClose }) => {
  const { availableUsers, currentUser, login } = useHealth();

  const handleSelect = (u: UserProfile) => {
    login(u);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Switch Role / Healthcare Node</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Experience Sanjeevani 4.0 from different tiers of the public health continuum:
          </Text>

          <ScrollView style={{ maxHeight: 360 }} contentContainerStyle={{ gap: 8, paddingVertical: 6 }}>
            {availableUsers.map(u => {
              const isActive = currentUser.id === u.id;
              return (
                <TouchableOpacity
                  key={u.id}
                  style={[styles.userCard, isActive && styles.userCardActive]}
                  onPress={() => handleSelect(u)}
                >
                  <View style={[styles.avatar, { backgroundColor: getRoleBadgeColor(u.role) }]}>
                    <Text style={styles.avatarText}>{u.name.slice(0, 1)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={[styles.userName, isActive && styles.textActive]}>{u.name}</Text>
                      <Text style={styles.roleTag}>{u.role.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.userDesig}>{u.designation}</Text>
                    <Text style={styles.facilityName}>{u.facility}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

function getRoleBadgeColor(role: string): string {
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    gap: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a'
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b'
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    gap: 10
  },
  userCardActive: {
    borderColor: '#0d9488',
    backgroundColor: '#f0fdfa'
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b'
  },
  textActive: {
    color: '#0d9488'
  },
  roleTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  userDesig: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1
  },
  facilityName: {
    fontSize: 10,
    color: '#94a3b8'
  }
});
