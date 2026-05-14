import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Vibration, Alert, Platform, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import notifee, { EventType } from '@notifee/react-native';

import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddMedicationScreen from './src/screens/AddMedicationScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import CaregiverScreen from './src/screens/CaregiverScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { logMedicationHistory } from './src/services/api_real';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.DISMISSED || type === EventType.ACTION_PRESS) {
     if (detail.notification && detail.notification.id) {
         await notifee.cancelNotification(detail.notification.id);
     }
  }
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Caregivers') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={30} color={color} />;
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { height: 75 + insets.bottom, paddingBottom: 15 + insets.bottom, paddingTop: 10 }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Caregivers" component={CaregiverScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [activeAlarm, setActiveAlarm] = useState(null);

  useEffect(() => {
    const verifySystemIntegrity = async () => {
      if (Platform.OS === 'android') {
        Alert.alert(
          '🚨 CRITICAL SETTINGS 🚨',
          'Android blocks medical alarms by default. You MUST go to settings and allow:\n\n1. Full screen intents (Required to wake screen)\n2. Display over other apps (Required for Red Screen)\n3. Auto-Launch / Allow Background Activity',
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'I Did This', style: 'cancel' }
          ]
        );
      }
    };

    verifySystemIntegrity();

    notifee.getInitialNotification().then(initialNotification => {
      if (initialNotification && initialNotification.notification.data) {
        triggerFullScreenAlarm(initialNotification.notification.data, initialNotification.notification.id);
      }
    });

    const unsubscribeForeground = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.DELIVERED || type === EventType.PRESS) {
        triggerFullScreenAlarm(detail.notification.data, detail.notification.id);
      }
    });

    return () => { 
      unsubscribeForeground(); 
    };
  }, []);

  const triggerFullScreenAlarm = async (data, notifId) => {
    if (!data || !data.medName) return;
    setActiveAlarm({ ...data, actualNotifId: notifId || data.notificationId });
    Vibration.vibrate([1000, 2000, 1000, 2000, 1000, 2000, 1000, 2000, 1000, 2000], true); 
  };

  const resolveAlarm = async (status) => {
    Vibration.cancel();
    if (activeAlarm?.actualNotifId) {
      await notifee.cancelNotification(activeAlarm.actualNotifId);
    }
    if (activeAlarm?.medId && activeAlarm.medId !== '999') {
      await logMedicationHistory(activeAlarm.medId, status);
    }
    setActiveAlarm(null);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeTabs" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="HomeTabs" component={MainTabs} />
          <Stack.Screen name="AddMedication" component={AddMedicationScreen} options={{ headerShown: true, title: 'Add Medicine' }} />
        </Stack.Navigator>
      </NavigationContainer>

      <Modal visible={!!activeAlarm} animationType="slide" transparent={false}>
        <View style={styles.alarmContainer}>
          <Ionicons name="alarm" size={120} color="#fff" style={styles.alarmIcon} />
          <Text style={styles.alarmTitle}>MEDICATION TIME!</Text>
          <Text style={styles.alarmMedName}>{activeAlarm?.medName || 'Your Medicine'}</Text>
          <Text style={styles.alarmInstructions}>Please take your medication now.</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.takenButton} onPress={() => resolveAlarm('taken')}>
              <Ionicons name="checkmark-circle" size={50} color="#fff" />
              <Text style={styles.buttonText}>I TOOK IT</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.missedButton} onPress={() => resolveAlarm('missed')}>
              <Ionicons name="close-circle" size={40} color="#ff4444" />
              <Text style={styles.missedButtonText}>SKIP / MISSED</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  alarmContainer: { flex: 1, backgroundColor: '#d32f2f', justifyContent: 'center', alignItems: 'center', padding: 20 },
  alarmIcon: { marginBottom: 30 },
  alarmTitle: { fontSize: 45, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 10 },
  alarmMedName: { fontSize: 55, fontWeight: '900', color: '#ffebee', textAlign: 'center', marginBottom: 40, textTransform: 'uppercase' },
  alarmInstructions: { fontSize: 28, color: '#fff', textAlign: 'center', marginBottom: 60, fontWeight: 'bold' },
  buttonContainer: { width: '100%', paddingHorizontal: 20 },
  takenButton: { backgroundColor: '#4CAF50', paddingVertical: 30, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 30, elevation: 10 },
  buttonText: { color: '#fff', fontSize: 36, fontWeight: '900', marginLeft: 15 },
  missedButton: { backgroundColor: '#fff', paddingVertical: 25, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#ff4444' },
  missedButtonText: { color: '#ff4444', fontSize: 26, fontWeight: 'bold', marginLeft: 10 },
});