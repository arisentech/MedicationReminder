import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LargeButton from '../components/LargeButton';
import { getTodaysMedications, deleteMedication } from '../services/api_real';

export default function HomeScreen({ navigation }) {
  const [todaysMedications, setTodaysMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');
  
  const [selectedMed, setSelectedMed] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => { loadData(); });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    setLoading(true);
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      const name = await AsyncStorage.getItem('userName');
      if (!userIdStr) return navigation.replace('Auth');
      if (name) setUserName(name.split(' ')[0]); 

      const response = await getTodaysMedications(parseInt(userIdStr, 10));
      setTodaysMedications(Array.isArray(response) ? response : []);
    } catch (error) { console.log("Load error"); } 
    finally { setLoading(false); }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete', `Remove this medication?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', style: 'destructive', 
        onPress: async () => {
          const result = await deleteMedication(id);
          if(result && result.success) { loadData(); } 
          else { Alert.alert("Error", "Could not delete medication."); }
        } 
      }
    ]);
  };

  const formatTime = (timeData) => {
    try {
      const parsed = typeof timeData === 'string' ? JSON.parse(timeData) : timeData;
      return Array.isArray(parsed) ? parsed.join(', ') : 'Scheduled';
    } catch (e) { return 'Scheduled'; }
  };

  const getIcon = (dosage) => {
    const d = dosage ? dosage.toLowerCase() : '';
    if (d.includes('ml') || d.includes('syrup')) return 'flask';
    if (d.includes('puff') || d.includes('inhaler')) return 'medical';
    if (d.includes('drop')) return 'water';
    return 'bandage';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning, {userName}!</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Your Medications</Text>
          
          {loading ? (
             <ActivityIndicator size="large" color="#4A90E2" style={{marginTop: 20}} />
          ) : todaysMedications.length === 0 ? (
             <Text style={styles.noDataText}>No medications added.</Text>
          ) : (
            todaysMedications.map((med) => (
              <TouchableOpacity key={med.id} style={styles.medItem} onPress={() => { setSelectedMed(med); setModalVisible(true); }}>
                <View style={styles.medItemLeft}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={getIcon(med.dosage)} size={35} color="#fff" />
                  </View>
                  <View style={styles.medItemInfo}>
                    <Text style={styles.medItemName}>{med.name}</Text>
                    <Text style={styles.medItemSchedule}>{formatTime(med.times)}</Text>
                  </View>
                </View>
                
                <TouchableOpacity onPress={() => handleDelete(med.id)} style={{ padding: 10 }}>
                  <Ionicons name="trash" size={35} color="#ff4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.quickActions}>
          <LargeButton title="Add New Medication" icon="add-circle" onPress={() => navigation.navigate('AddMedication')} />
          <View style={{height: 15}} />
          <LargeButton title="View History" icon="time" onPress={() => navigation.navigate('History')} />
        </View>
      </ScrollView>

      {/* DETAILS MODAL */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMed && (
              <>
                <View style={[styles.iconCircle, { width: 90, height: 90, borderRadius: 45, alignSelf: 'center', marginBottom: 20 }]}>
                  <Ionicons name={getIcon(selectedMed.dosage)} size={50} color="#fff" />
                </View>
                <Text style={styles.modalTitle}>{selectedMed.name}</Text>
                
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Dosage:</Text>
                  <Text style={styles.modalValue}>{selectedMed.dosage}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Frequency:</Text>
                  <Text style={styles.modalValue}>{selectedMed.frequency}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalLabel}>Times:</Text>
                  <Text style={styles.modalValue}>{formatTime(selectedMed.times)}</Text>
                </View>

                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCloseText}>Close Details</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 25, backgroundColor: '#4A90E2' },
  greeting: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  date: { fontSize: 20, color: '#fff', marginTop: 8 },
  todaySection: { padding: 20 },
  sectionTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  noDataText: { fontSize: 22, color: '#999', textAlign: 'center', marginTop: 20 },
  medItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 4 },
  medItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#4A90E2', justifyContent: 'center', alignItems: 'center' },
  medItemInfo: { marginLeft: 20, flex: 1 },
  medItemName: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  medItemSchedule: { fontSize: 20, color: '#4A90E2', marginTop: 5, fontWeight: '700' },
  quickActions: { paddingHorizontal: 20 },
  
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 30, borderRadius: 20 },
  modalTitle: { fontSize: 36, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 25 },
  modalDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  modalLabel: { fontSize: 24, color: '#666' },
  modalValue: { fontSize: 26, fontWeight: 'bold', color: '#4A90E2', flexShrink: 1, textAlign: 'right' },
  modalCloseBtn: { backgroundColor: '#4A90E2', padding: 20, borderRadius: 15, marginTop: 30, alignItems: 'center' },
  modalCloseText: { color: '#fff', fontSize: 26, fontWeight: 'bold' }
});