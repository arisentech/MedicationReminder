import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMedicationHistory } from '../services/api_real';

export default function HistoryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadHistory(selectedDate); }, [selectedDate]);

  const loadHistory = async (date) => {
    setLoading(true);
    try {
      const userIdStr = await AsyncStorage.getItem('userId');
      if (!userIdStr) return;
      const data = await getMedicationHistory(parseInt(userIdStr, 10), date);
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) { setHistory([]); } 
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Medication History</Text>
        </View>

        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{ [selectedDate]: { selected: true, selectedColor: '#4A90E2' } }}
          theme={{ textDayFontSize: 20, textMonthFontSize: 24, textDayHeaderFontSize: 16 }}
        />

        <View style={styles.historyList}>
          <Text style={styles.sectionTitle}>Logs for {selectedDate}</Text>
          
          {loading ? (
             <ActivityIndicator size="large" color="#4A90E2" />
          ) : history.length === 0 ? (
             <Text style={{color: '#999', textAlign: 'center', fontSize: 22}}>No data for this date.</Text>
          ) : (
            history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                {/* Dynamically checks if status is taken or missed */}
                <Ionicons 
                  name={item.status === 'taken' ? "checkmark-circle" : "close-circle"} 
                  size={45} 
                  color={item.status === 'taken' ? "#4CAF50" : "#ff4444"} 
                />
                <View style={{marginLeft: 15, flex: 1}}>
                  <Text style={styles.medicationName}>{item.name}</Text>
                  <Text style={{color: '#666', fontSize: 20}}>Dose: {item.dosage}</Text>
                  <Text style={{
                    color: item.status === 'taken' ? "#4CAF50" : "#ff4444", 
                    fontSize: 20, 
                    fontWeight: 'bold',
                    marginTop: 5
                  }}>
                    {item.status === 'taken' ? 'TAKEN' : 'MISSED / SKIPPED'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 25, backgroundColor: '#4A90E2' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  historyList: { padding: 25 },
  sectionTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 4 },
  medicationName: { fontSize: 26, fontWeight: 'bold' }
});