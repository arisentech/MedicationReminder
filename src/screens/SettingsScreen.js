import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { testInstantAlarm } from '../services/notifications_real'; 

export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({ soundAlerts: true, vibration: true });

  const handleToggle = (key) => setSettings({ ...settings, [key]: !settings[key] });

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Alarms</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high" size={30} color="#4A90E2" />
              <Text style={styles.settingText}>Sound Alerts</Text>
            </View>
            <Switch value={settings.soundAlerts} onValueChange={() => handleToggle('soundAlerts')} />
          </View>

          <TouchableOpacity style={styles.testButton} onPress={testInstantAlarm}>
            <Ionicons name="notifications" size={30} color="#fff" />
            <Text style={styles.testButtonText}>Test Alarm Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={30} color="#ff4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 25, backgroundColor: '#4A90E2' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  section: { backgroundColor: '#fff', marginVertical: 10, paddingVertical: 10, elevation: 2 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#666', paddingHorizontal: 20, paddingVertical: 10 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingText: { fontSize: 24, color: '#333', marginLeft: 15 },
  testButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4CAF50', marginHorizontal: 20, marginVertical: 20, padding: 20, borderRadius: 15 },
  testButtonText: { fontSize: 24, color: '#fff', marginLeft: 10, fontWeight: 'bold' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginHorizontal: 20, marginVertical: 20, padding: 20, borderRadius: 15, borderWidth: 2, borderColor: '#ff4444' },
  logoutText: { fontSize: 24, color: '#ff4444', marginLeft: 10, fontWeight: 'bold' }
});