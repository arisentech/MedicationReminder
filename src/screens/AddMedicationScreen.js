import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import LargeButton from '../components/LargeButton';
import { scheduleNotification } from '../services/notifications';
import { saveMedication } from '../services/api';

export default function AddMedicationScreen({ navigation }) {
  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    times: [],
    notes: '',
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const frequencies = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'As Needed', value: 'as_needed' },
  ];

  const handleAddTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setMedication({
        ...medication,
        times: [...medication.times, timeString]
      });
    }
  };

  const handleSave = async () => {
    if (!medication.name || !medication.dosage || medication.times.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // Save to backend
      const result = await saveMedication(medication);
      
      // Schedule notifications
      for (const time of medication.times) {
        await scheduleNotification(medication.name, time, medication.frequency);
      }

      Alert.alert('Success', 'Medication added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save medication');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medication Name *</Text>
            <TextInput
              style={styles.input}
              value={medication.name}
              onChangeText={(text) => setMedication({...medication, name: text})}
              placeholder="Enter medication name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dosage *</Text>
            <TextInput
              style={styles.input}
              value={medication.dosage}
              onChangeText={(text) => setMedication({...medication, dosage: text})}
              placeholder="e.g., 500mg, 2 tablets"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Frequency *</Text>
            <View style={styles.frequencyButtons}>
              {frequencies.map((freq) => (
                <TouchableOpacity
                  key={freq.value}
                  style={[
                    styles.frequencyButton,
                    medication.frequency === freq.value && styles.frequencyButtonActive
                  ]}
                  onPress={() => setMedication({...medication, frequency: freq.value})}
                >
                  <Text style={[
                    styles.frequencyButtonText,
                    medication.frequency === freq.value && styles.frequencyButtonTextActive
                  ]}>
                    {freq.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reminder Times *</Text>
            <TouchableOpacity 
              style={styles.addTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Ionicons name="time-outline" size={24} color="#4A90E2" />
              <Text style={styles.addTimeText}>Add Reminder Time</Text>
            </TouchableOpacity>
            
            {medication.times.map((time, index) => (
              <View key={index} style={styles.timeItem}>
                <Text style={styles.timeText}>{time}</Text>
                <TouchableOpacity 
                  onPress={() => {
                    const newTimes = medication.times.filter((_, i) => i !== index);
                    setMedication({...medication, times: newTimes});
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={medication.notes}
              onChangeText={(text) => setMedication({...medication, notes: text})}
              placeholder="Add any special instructions"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.buttons}>
            <LargeButton 
              title="Save Medication" 
              icon="checkmark-circle-outline"
              onPress={handleSave}
            />
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {showTimePicker && (
        <DateTimePicker
          value={currentTime}
          mode="time"
          is24Hour={false}
          onChange={handleAddTime}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  frequencyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  frequencyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  frequencyButtonActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  frequencyButtonText: {
    fontSize: 16,
    color: '#666',
  },
  frequencyButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addTimeText: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 10,
  },
  timeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e8f4fd',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  buttons: {
    marginTop: 30,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
});