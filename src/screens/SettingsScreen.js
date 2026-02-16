// ============================================
// src/screens/SettingsScreen.js
// ============================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {
  const [settings, setSettings] = useState({
    notifications: true,
    soundAlerts: true,
    vibration: true,
    caregiverAlerts: true,
    dailyReport: false,
    darkMode: false,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            // Navigate to login screen
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={() => handleToggle('notifications')}
              trackColor={{ false: '#ccc', true: '#4A90E2' }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="volume-high-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Sound Alerts</Text>
            </View>
            <Switch
              value={settings.soundAlerts}
              onValueChange={() => handleToggle('soundAlerts')}
              trackColor={{ false: '#ccc', true: '#4A90E2' }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="phone-portrait-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Vibration</Text>
            </View>
            <Switch
              value={settings.vibration}
              onValueChange={() => handleToggle('vibration')}
              trackColor={{ false: '#ccc', true: '#4A90E2' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caregiver</Text>
          
          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="people-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Manage Caregivers</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="alert-circle-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Caregiver Alerts</Text>
            </View>
            <Switch
              value={settings.caregiverAlerts}
              onValueChange={() => handleToggle('caregiverAlerts')}
              trackColor={{ false: '#ccc', true: '#4A90E2' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="document-text-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Daily Report</Text>
            </View>
            <Switch
              value={settings.dailyReport}
              onValueChange={() => handleToggle('dailyReport')}
              trackColor={{ false: '#ccc', true: '#4A90E2' }}
            />
          </View>

          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="download-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Export History</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="help-circle-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#4A90E2" />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ff4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
  section: {
    backgroundColor: '#fff',
    marginVertical: 10,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 30,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4444',
    marginLeft: 10,
    fontWeight: '600',
  },
});