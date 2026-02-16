/ ============================================
// src/components/AlarmModal.js
// ============================================
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Image } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export default function AlarmModal({ visible, medication, onDismiss, onTaken, onSnooze }) {
  const [sound, setSound] = useState(null);

  useEffect(() => {
    if (visible) {
      playAlarmSound();
      startVibration();
    } else {
      stopAlarmSound();
      Vibration.cancel();
    }

    return () => {
      stopAlarmSound();
      Vibration.cancel();
    };
  }, [visible]);

  const playAlarmSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/alarm.mp3'), // Add an alarm sound file
        { shouldPlay: true, isLooping: true }
      );
      setSound(sound);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const stopAlarmSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
  };

  const startVibration = () => {
    const pattern = [1000, 2000, 1000, 2000];
    Vibration.vibrate(pattern, true);
  };

  const handleTaken = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onTaken();
  };

  const handleSnooze = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSnooze();
  };

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.7}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="alarm" size={60} color="#4A90E2" />
          <Text style={styles.title}>Time for Your Medication!</Text>
        </View>

        {medication && (
          <View style={styles.medicationInfo}>
            <View style={styles.pillIcon}>
              <Ionicons name="medical" size={40} color="#fff" />
            </View>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.medicationDosage}>{medication.dosage}</Text>
            <Text style={styles.medicationTime}>{medication.time}</Text>
            {medication.notes && (
              <Text style={styles.medicationNotes}>{medication.notes}</Text>
            )}
          </View>
        )}

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.takenButton} onPress={handleTaken}>
            <Ionicons name="checkmark-circle" size={28} color="#fff" />
            <Text style={styles.takenButtonText}>Mark as Taken</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.snoozeButton} onPress={handleSnooze}>
            <Ionicons name="time" size={24} color="#666" />
            <Text style={styles.snoozeButtonText}>Remind in 10 min</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  medicationInfo: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  pillIcon: {
    backgroundColor: '#4A90E2',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  medicationName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  medicationDosage: {
    fontSize: 20,
    color: '#666',
    marginBottom: 5,
  },
  medicationTime: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: '600',
  },
  medicationNotes: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  buttons: {
    gap: 12,
  },
  takenButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
  },
  takenButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  snoozeButton: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
  },
  snoozeButtonText: {
    color: '#666',
    fontSize: 16,
    marginLeft: 8,
  },
});
