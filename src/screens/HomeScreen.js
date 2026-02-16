import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LargeButton from '../components/LargeButton';

export default function HomeScreen({ navigation }) {
  const [nextMedication, setNextMedication] = useState(null);
  const [todaysMedications, setTodaysMedications] = useState([]);

  useEffect(() => {
    loadTodaysMedications();
  }, []);

  const loadTodaysMedications = async () => {
    // Fetch today's medications from API
    // This is placeholder data
    setTodaysMedications([
      { id: 1, name: 'Aspirin', time: '08:00 AM', taken: false },
      { id: 2, name: 'Vitamin D', time: '12:00 PM', taken: false },
      { id: 3, name: 'Blood Pressure Med', time: '06:00 PM', taken: false },
    ]);
    setNextMedication({ name: 'Aspirin', time: '08:00 AM' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning!</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
        </View>

        <View style={styles.nextMedCard}>
          <Ionicons name="alarm-outline" size={40} color="#4A90E2" />
          <View style={styles.nextMedInfo}>
            <Text style={styles.nextMedLabel}>Next Medication</Text>
            {nextMedication ? (
              <>
                <Text style={styles.nextMedName}>{nextMedication.name}</Text>
                <Text style={styles.nextMedTime}>{nextMedication.time}</Text>
              </>
            ) : (
              <Text style={styles.noMeds}>No medications scheduled</Text>
            )}
          </View>
        </View>

        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today's Medications</Text>
          {todaysMedications.map((med) => (
            <TouchableOpacity key={med.id} style={styles.medItem}>
              <View style={styles.medItemLeft}>
                <Ionicons 
                  name={med.taken ? "checkmark-circle" : "ellipse-outline"} 
                  size={30} 
                  color={med.taken ? "#4CAF50" : "#999"} 
                />
                <View style={styles.medItemInfo}>
                  <Text style={styles.medItemName}>{med.name}</Text>
                  <Text style={styles.medItemTime}>{med.time}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickActions}>
          <LargeButton 
            title="Add Medication" 
            icon="add-circle-outline"
            onPress={() => navigation.navigate('Medications', { screen: 'AddMedication' })}
          />
          <LargeButton 
            title="View History" 
            icon="time-outline"
            onPress={() => navigation.navigate('History')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A90E2',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  nextMedCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextMedInfo: {
    marginLeft: 15,
    flex: 1,
  },
  nextMedLabel: {
    fontSize: 14,
    color: '#666',
  },
  nextMedName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  nextMedTime: {
    fontSize: 18,
    color: '#4A90E2',
    marginTop: 3,
  },
  noMeds: {
    fontSize: 16,
    color: '#999',
    marginTop: 5,
  },
  todaySection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  medItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  medItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medItemInfo: {
    marginLeft: 15,
  },
  medItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  medItemTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  quickActions: {
    padding: 20,
    paddingTop: 30,
  },
});
