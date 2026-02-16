// ============================================
// src/screens/HistoryScreen.js (Simplified Version)
// Use this temporarily if react-native-calendars causes issues
// ============================================
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, [selectedDate]);

  const loadHistory = async () => {
    // Placeholder data
    const mockHistory = [
      { id: 1, name: 'Aspirin', time: '08:00 AM', taken: true, takenAt: '08:05 AM' },
      { id: 2, name: 'Lisinopril', time: '07:00 AM', taken: true, takenAt: '07:02 AM' },
      { id: 3, name: 'Metformin', time: '12:00 PM', taken: false },
      { id: 4, name: 'Vitamin D', time: '06:00 PM', taken: true, takenAt: '06:15 PM' },
    ];
    setHistory(mockHistory);
  };

  const getComplianceRate = () => {
    const taken = history.filter(h => h.taken).length;
    const total = history.length;
    return total > 0 ? Math.round((taken / total) * 100) : 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Medication History</Text>
        </View>

        {/* Date selector - simplified without calendar */}
        <View style={styles.dateSelector}>
          <TouchableOpacity style={styles.dateButton}>
            <Ionicons name="chevron-back" size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.currentDate}>
            {new Date(selectedDate).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric' 
            })}
          </Text>
          <TouchableOpacity style={styles.dateButton}>
            <Ionicons name="chevron-forward" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Daily Compliance</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getComplianceRate()}%</Text>
              <Text style={styles.statLabel}>Taken</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{history.filter(h => h.taken).length}/{history.length}</Text>
              <Text style={styles.statLabel}>Medications</Text>
            </View>
          </View>
        </View>

        <View style={styles.historyList}>
          <Text style={styles.sectionTitle}>Today's Medications</Text>
          
          {history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyItemLeft}>
                <Ionicons 
                  name={item.taken ? "checkmark-circle" : "close-circle"} 
                  size={28} 
                  color={item.taken ? "#4CAF50" : "#ff4444"} 
                />
                <View style={styles.historyItemInfo}>
                  <Text style={styles.medicationName}>{item.name}</Text>
                  <Text style={styles.medicationTime}>
                    Scheduled: {item.time}
                  </Text>
                  {item.taken && (
                    <Text style={styles.takenTime}>
                      Taken at: {item.takenAt}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.statusBadge}>
                <Text style={[styles.statusText, item.taken ? styles.takenText : styles.missedText]}>
                  {item.taken ? 'Taken' : 'Missed'}
                </Text>
              </View>
            </View>
          ))}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  dateButton: {
    padding: 5,
  },
  currentDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  historyList: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyItemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  medicationTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  takenTime: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  takenText: {
    color: '#4CAF50',
  },
  missedText: {
    color: '#ff4444',
  },
});