import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function scheduleNotification(medicationName, time, frequency) {
  const [hours, minutes] = time.split(':').map(part => {
    return parseInt(part.replace(/[^0-9]/g, ''));
  });
  
  const isPM = time.includes('PM');
  const hour24 = isPM && hours !== 12 ? hours + 12 : (!isPM && hours === 12 ? 0 : hours);

  const trigger = {
    hour: hour24,
    minute: minutes || 0,
    repeats: true,
  };

  if (frequency === 'weekly') {
    trigger.weekday = new Date().getDay() + 1; // 1 = Sunday, 7 = Saturday
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Medication Reminder 💊",
      body: `Time to take ${medicationName}`,
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.HIGH,
      vibrate: [0, 250, 250, 250],
    },
    trigger,
  });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function requestNotificationPermissions() {
  if (!Device.isDevice) {
    alert('Must use physical device for Push Notifications');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return false;
  }
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  return true;
}