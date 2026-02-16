// ============================================
// src/screens/MedicationListScreen.js
// ============================================
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getMedications, deleteMedication } from '../services/api';
import MedicationCard from '../components/MedicationCard';

export default function MedicationListScreen({ navigation }) {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      // Placeholder data - replace with API call
      const meds = [
        {
          id: 1,
          name: 'Aspirin',
          dosage: '100mg',
          frequency: 'Daily',
          times: ['08:00 AM', '08:00 PM'],
          notes: 'Take with food'
        },
        {
          id: 2,
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Daily',
          times: ['07:00 AM'],
          notes: 'For blood pressure'
        },
        {
          id: 3,
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          times: ['08:00 AM', '06:00 PM'],
          notes: 'Take with meals'
        },
      ];
      setMedications(meds);
      setLoading(false);
    } catch (error) {
      console.error('Error loading medications:', error);
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              // await deleteMedication(id);
              setMedications(medications.filter(m => m.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete medication');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddMedication')}
      >
        <Ionicons name="add-circle" size={28} color="#fff" />
        <Text style={styles.addButtonText}>Add Medication</Text>
      </TouchableOpacity>

      <FlatList
        data={medications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MedicationCard 
            medication={item}
            onDelete={() => handleDelete(item.id)}
            onEdit={() => navigation.navigate('AddMedication', { medication: item })}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  list: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});