import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, FlatList, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCaregivers, saveCaregiver, deleteCaregiver } from '../services/api_real';

export default function CaregiverScreen({ navigation }) {
  const [caregivers, setCaregivers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // FIXED: No phone or relationship variables here to match your SQL Database
  const [formData, setFormData] = useState({ name: '', email: '', notifyOnMissed: true });

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => { loadCaregivers(); });
    return unsubscribe;
  }, [navigation]);

  const loadCaregivers = async () => {
    setLoading(true);
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      const data = await getCaregivers(parseInt(userIdStr, 10));
      setCaregivers(Array.isArray(data) ? data : []);
    } catch (error) { console.log("Caregiver load error"); } 
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.email) return Alert.alert('Missing Info', 'Name and Email are required.');
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      const result = await saveCaregiver(formData, parseInt(userIdStr, 10));
      if (result && result.success) {
        setShowAddModal(false);
        setFormData({ name: '', email: '', notifyOnMissed: true });
        loadCaregivers(); 
      } else { Alert.alert('Error', result.error || 'Failed to save caregiver.'); }
    } catch (error) { Alert.alert('Network Error', 'Failed to reach server.'); }
  };

  const handleDelete = (id) => {
    Alert.alert('Remove Caregiver', `Are you sure?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteCaregiver(id);
          loadCaregivers();
        }
      }
    ]);
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Ionicons name="person-circle" size={70} color="#4A90E2" />
        <View style={styles.cardDetails}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardInfo}>{item.email}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={{padding: 15}}>
        <Ionicons name="trash" size={40} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Caregivers</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Ionicons name="add-circle" size={50} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{marginTop: 50}} />
      ) : caregivers.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people" size={120} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Caregivers Added</Text>
        </View>
      ) : (
        <FlatList data={caregivers} renderItem={renderCard} keyExtractor={(item) => item.id.toString()} contentContainerStyle={{ padding: 20 }} />
      )}

      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Caregiver</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput style={styles.input} placeholder="Name *" value={formData.name} onChangeText={(t) => setFormData({...formData, name: t})} />
              <TextInput style={styles.input} placeholder="Email *" value={formData.email} onChangeText={(t) => setFormData({...formData, email: t})} keyboardType="email-address" autoCapitalize="none" />
            </ScrollView>

            <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddModal(false)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 25, backgroundColor: '#fff', elevation: 2 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#333' }, 
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 4 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cardDetails: { marginLeft: 15, flex: 1 },
  cardName: { fontSize: 26, fontWeight: 'bold', color: '#333' }, 
  cardInfo: { fontSize: 20, color: '#666', marginTop: 4 }, 
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyStateTitle: { fontSize: 26, fontWeight: 'bold', marginTop: 15, color: '#666' },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, maxHeight: '85%' },
  modalTitle: { fontSize: 30, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 15, padding: 20, marginBottom: 20, fontSize: 22 }, 
  saveBtn: { padding: 20, alignItems: 'center', backgroundColor: '#4A90E2', borderRadius: 15, marginTop: 10 },
  saveBtnText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  cancelBtn: { padding: 20, alignItems: 'center', marginTop: 10 },
  cancelBtnText: { color: '#ff4444', fontSize: 24, fontWeight: 'bold' }
});