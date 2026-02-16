import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import MedicationListScreen from './src/screens/MedicationListScreen';
import AddMedicationScreen from './src/screens/AddMedicationScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function MedicationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MedicationList" 
        component={MedicationListScreen}
        options={{ 
          title: 'My Medications',
          headerStyle: { backgroundColor: '#4A90E2' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontSize: 20 }
        }}
      />
      <Stack.Screen 
        name="AddMedication" 
        component={AddMedicationScreen}
        options={{ 
          title: 'Add Medication',
          headerStyle: { backgroundColor: '#4A90E2' },
          headerTintColor: '#fff'
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Medications') {
                iconName = focused ? 'medical' : 'medical-outline';
              } else if (route.name === 'History') {
                iconName = focused ? 'time' : 'time-outline';
              } else if (route.name === 'Settings') {
                iconName = focused ? 'settings' : 'settings-outline';
              }
              return <Ionicons name={iconName} size={size + 8} color={color} />;
            },
            tabBarActiveTintColor: '#4A90E2',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle: { fontSize: 14, paddingBottom: 5 },
            tabBarStyle: { height: 70, paddingTop: 10 },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Medications" component={MedicationStack} options={{ headerShown: false }} />
          <Tab.Screen name="History" component={HistoryScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
}