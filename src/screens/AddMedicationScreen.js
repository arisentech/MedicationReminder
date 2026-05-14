import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LargeButton from '../components/LargeButton';
import { scheduleNotification } from '../services/notifications_real';
import { saveMedication } from '../services/api_real';

export default function AddMedicationScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  
  const [medication, setMedication] = useState({ name: '', dosage: '', frequency: 'daily', times: [] });
  const [customInterval, setCustomInterval] = useState('1');
  const [showTimePicker, setShowTimePicker] = useState(false);

  // ALL 4 FREQUENCIES RESTORED
  const frequencies = [
    { label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }, { label: 'Custom', value: 'custom' }
  ];

  const handleAddTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setMedication({ ...medication, times: [...medication.times, timeString] });
    }
  };

  const handleSave = async () => {
    if (!medication.name || !medication.dosage || medication.times.length === 0) {
      return Alert.alert('Missing Info', 'Please fill in all required fields');
    }
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      const result = await saveMedication(medication, parseInt(userIdStr, 10));

      if (result && result.success && result.med_id) {
        for (const time of medication.times) {
          // WE PASS THE NEW MED_ID INTO THE ALARM
          await scheduleNotification(medication.name, time, result.med_id);
        }
        Alert.alert('Success', 'Medicine saved!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else {
        Alert.alert('Error', result.error || 'Failed to save.');
      }
    } catch (error) { Alert.alert('Network Error', 'Check connection.'); }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medicine Name</Text>
            <TextInput style={styles.input} value={medication.name} onChangeText={(t) => setMedication({...medication, name: t})} placeholder="e.g. Aspirin" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dosage</Text>
            <TextInput style={styles.input} value={medication.dosage} onChangeText={(t) => setMedication({...medication, dosage: t})} placeholder="e.g. 2 Pills" />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              {frequencies.map((freq) => (
                <TouchableOpacity key={freq.value} style={[styles.frequencyButton, medication.frequency === freq.value && styles.frequencyButtonActive]} onPress={() => setMedication({...medication, frequency: freq.value})}>
                  <Text style={[styles.frequencyButtonText, medication.frequency === freq.value && styles.frequencyButtonTextActive]}>{freq.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {medication.frequency === 'custom' && (
              <View style={{ marginTop: 15 }}>
                <Text style={styles.label}>Repeat every X days:</Text>
                <TextInput style={styles.input} value={customInterval} onChangeText={setCustomInterval} keyboardType="numeric" placeholder="e.g., 3" />
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alarm Times</Text>
            <TouchableOpacity style={styles.addTimeButton} onPress={() => setShowTimePicker(true)}>
              <Ionicons name="time" size={35} color="#4A90E2" />
              <Text style={styles.addTimeText}>Set Alarm Time</Text>
            </TouchableOpacity>
            
            {medication.times.map((time, index) => (
              <View key={index} style={styles.timeItem}>
                <Text style={styles.timeText}>{time}</Text>
                <TouchableOpacity onPress={() => { setMedication({...medication, times: medication.times.filter((_, i) => i !== index)}); }}>
                  <Ionicons name="close-circle" size={40} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.pinnedBottom, { paddingBottom: Math.max(insets.bottom + 20, 20) }]}>
          <LargeButton title="Save Medicine" icon="checkmark-circle" onPress={handleSave} />
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {showTimePicker && <DateTimePicker value={new Date()} mode="time" is24Hour={false} onChange={handleAddTime} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  form: { padding: 20, paddingBottom: 40 },
  inputGroup: { marginBottom: 30 },
  label: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  input: { backgroundColor: '#fff', borderRadius: 15, padding: 20, fontSize: 24, borderWidth: 1, borderColor: '#e0e0e0' },
  frequencyContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  frequencyButton: { width: '48%', paddingVertical: 18, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', alignItems: 'center' },
  frequencyButtonActive: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  frequencyButtonText: { fontSize: 20, color: '#666' },
  frequencyButtonTextActive: { color: '#fff', fontWeight: 'bold' },
  addTimeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e8f4fd', padding: 20, borderRadius: 15, borderWidth: 2, borderColor: '#4A90E2', borderStyle: 'dashed' },
  addTimeText: { fontSize: 24, color: '#4A90E2', marginLeft: 10, fontWeight: 'bold' },
  timeItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginTop: 15, elevation: 2 },
  timeText: { fontSize: 28, color: '#333', fontWeight: 'bold' },
  pinnedBottom: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e0e0e0', elevation: 10 },
  cancelButton: { alignItems: 'center', padding: 20, marginTop: 5 },
  cancelButtonText: { fontSize: 24, color: '#ff4444', fontWeight: 'bold' },
});