import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHealth } from '../context/HealthContext';
import { mobileApi } from '../services/api';
import { Language } from '../types';

interface VoiceAssistantModalProps {
  visible: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ visible, onClose }) => {
  const { language, setLanguage, currentRole, currentUser, patients, selectedPatientId } = useHealth();
  const activePat = patients.find(p => p.id === selectedPatientId) || patients[0];

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text:
        language === 'hi'
          ? 'नमस्ते! मैं संजीवनी एआई क्लिनिकल असिस्टेंट हूँ। मैं ग्रामीण स्वास्थ्य, मातृ सुरक्षा, उच्च रक्तचाप और दवाओं के बारे में कैसे मदद कर सकता हूँ?'
          : language === 'mr'
          ? 'नमस्कार! मी संजीवनी एआय क्लिनिकल सहाय्यक आहे. मी ग्रामीण आरोग्य, माता काळजी आणि औषधांबद्दल कशी मदत करू शकतो?'
          : 'Namaste! I am Sanjeevani AI Clinical Assistant. How can I assist you with rural clinical continuity, ANC care, or vital signs guidance today?'
    }
  ]);

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg: Message = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await mobileApi.queryAiAssistant(
        q,
        language,
        currentRole,
        activePat
          ? {
              name: activePat.name,
              age: activePat.age,
              village: activePat.village,
              conditions: activePat.chronicConditions,
              vitals: activePat.lastVitals
            }
          : undefined
      );

      let reply = res.text;
      if (!reply || res.fallback) {
        reply = getLocalClinicalGuidance(q, language);
      }

      setMessages(prev => [...prev, { sender: 'assistant', text: reply! }]);
    } catch (e) {
      const fallbackReply = getLocalClinicalGuidance(q, language);
      setMessages(prev => [...prev, { sender: 'assistant', text: fallbackReply }]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    language === 'hi' ? 'उच्च रक्तचाप (BP) के खतरे क्या हैं?' : 'What are red flags for gestational hypertension?',
    language === 'hi' ? 'अगर मरीज का SpO2 90% से कम हो तो?' : 'What to do if SpO2 drops below 90%?',
    language === 'hi' ? 'गर्भवती महिला को 108 कब बुलाना चाहिए?' : 'When to call 108 for an ANC emergency?'
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={14} color="#ffffff" />
              </View>
              <View>
                <Text style={styles.title}>Sanjeevani AI Assistant</Text>
                <Text style={styles.subtitle}>Rural Clinical & Voice Guidance</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Language Switcher */}
          <View style={styles.langBar}>
            <Text style={styles.langLabel}>Language:</Text>
            {(['en', 'hi', 'mr'] as Language[]).map(l => (
              <TouchableOpacity
                key={l}
                style={[styles.langBtn, language === l && styles.langBtnActive]}
                onPress={() => setLanguage(l)}
              >
                <Text style={[styles.langText, language === l && styles.langTextActive]}>
                  {l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'मराठी'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Messages */}
          <ScrollView style={styles.chatArea} contentContainerStyle={{ padding: 10, gap: 10 }}>
            {messages.map((m, i) => (
              <View
                key={i}
                style={[
                  styles.msgBox,
                  m.sender === 'user' ? styles.userMsg : styles.assistantMsg
                ]}
              >
                <Text
                  style={[
                    styles.msgText,
                    m.sender === 'user' ? styles.userMsgText : styles.assistantMsgText
                  ]}
                >
                  {m.text}
                </Text>
              </View>
            ))}

            {loading && (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color="#0d9488" />
                <Text style={styles.loadingText}>Sanjeevani AI is formulating clinical advice...</Text>
              </View>
            )}
          </ScrollView>

          {/* Quick Prompts */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickBar}>
            {sampleQuestions.map((sq, i) => (
              <TouchableOpacity key={i} style={styles.quickPill} onPress={() => handleSend(sq)}>
                <Text style={styles.quickText}>{sq}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input Bar */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder={language === 'hi' ? 'अपना प्रश्न यहाँ लिखें...' : 'Ask clinical query or vitals question...'}
              value={inputQuery}
              onChangeText={setInputQuery}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
              <Ionicons name="send" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

function getLocalClinicalGuidance(query: string, lang: string): string {
  const q = query.toLowerCase();
  if (q.includes('bp') || q.includes('hypertension') || q.includes('रक्तचाप')) {
    return lang === 'hi'
      ? 'उच्च रक्तचाप (Systolic ≥ 140 mmHg) गर्भावस्था में प्री-एक्लेम्पसिया का संकेत हो सकता है। मरीज को तुरंत आराम दें, नमक कम करें और प्राथमिक स्वास्थ्य केंद्र (PHC) में डॉक्टर को दिखाएं। यदि BP 160 से अधिक है, तो तुरंत 108 डायल करें।'
      : 'Blood pressure above 140/90 mmHg requires prompt clinical evaluation. For pregnant mothers, check for pedal edema or headache. If BP exceeds 160/110, this is an emergency—arrange transport to PHC/Hospital immediately.';
  }
  if (q.includes('spo2') || q.includes('oxygen') || q.includes('सांस')) {
    return lang === 'hi'
      ? 'यदि SpO2 94% से कम है, तो मरीज को गहरी सांस लेने में सहायता करें। यदि SpO2 90% से नीचे चला जाता है, तो यह गंभीर हाइपोक्सिया है। तुरंत ऑक्सीजन सिलेंडर या निकटतम ग्रामीण अस्पताल के लिए 108 बुलाएं।'
      : 'Target SpO2 is > 94%. Readings below 90% indicate severe acute hypoxia requiring urgent oxygen therapy and emergency referral to the nearest CHC/District Hospital.';
  }
  return lang === 'hi'
    ? 'संजीवनी क्लिनिकल प्रोटोकॉल: आपातकालीन लक्षणों (जैसे गंभीर सीने का दर्द, सांस फूलना, उच्च बुखार) के मामले में तुरंत 108 एम्बुलेंस से संपर्क करें और निकटतम PHC में मेडिकल ऑफिसर को सूचित करें।'
    : 'Clinical Continuity Protocol: Monitor vitals closely. For red-flag symptoms (severe chest pain, respiratory distress, or maternal bleeding), initiate emergency referral via 108 to the nearest First Referral Unit (FRU).';
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    height: '80%',
    padding: 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  aiBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0d9488',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a'
  },
  subtitle: {
    fontSize: 11,
    color: '#64748b'
  },
  closeBtn: {
    padding: 6
  },
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0'
  },
  langLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600'
  },
  langBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#f1f5f9'
  },
  langBtnActive: {
    backgroundColor: '#0d9488'
  },
  langText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600'
  },
  langTextActive: {
    color: '#ffffff'
  },
  chatArea: {
    flex: 1
  },
  msgBox: {
    maxWidth: '85%',
    padding: 10,
    borderRadius: 10
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#0d9488',
    borderBottomRightRadius: 2
  },
  assistantMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    borderBottomLeftRadius: 2
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18
  },
  userMsgText: {
    color: '#ffffff'
  },
  assistantMsgText: {
    color: '#1e293b'
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8
  },
  loadingText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic'
  },
  quickBar: {
    maxHeight: 36,
    marginVertical: 4
  },
  quickPill: {
    backgroundColor: '#f1f5f9',
    borderWidth: 0.5,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6
  },
  quickText: {
    fontSize: 11,
    color: '#334155'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 6
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1e293b'
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0d9488',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
