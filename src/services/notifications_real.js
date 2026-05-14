import notifee, { 
  TriggerType, 
  RepeatFrequency, 
  AndroidImportance, 
  AndroidVisibility, 
  AndroidCategory, 
  AndroidFlags,
  AndroidNotificationSetting 
} from '@notifee/react-native';
import { Platform, Alert, Linking } from 'react-native';

export const checkPermissions = async () => {
  const settings = await notifee.requestPermission();
  if (settings.authorizationStatus === 0) {
    Alert.alert('Permissions Required', 'Please allow notifications.', [{ text: 'OK', onPress: () => Linking.openSettings() }]);
    return false;
  }

  // FIXED LOGIC: Correctly checks the Notifee Enum to ensure exact alarms aren't blocked
  if (Platform.OS === 'android') {
    const alarmSettings = await notifee.getNotificationSettings();
    if (alarmSettings.android.alarm !== AndroidNotificationSetting.ENABLED) {
      Alert.alert(
        'Alarms Blocked by Android',
        'Your phone is blocking exact alarms. Tap OK, find this app, and turn ON "Alarms & Reminders".',
        [{ text: 'OK', onPress: () => notifee.openAlarmPermissionSettings() }]
      );
      return false;
    }
  }
  return true;
};

const createChannel = async () => {
  if (Platform.OS === 'android') {
    return await notifee.createChannel({
      id: 'medical-alarms-final-v3', // Forces the OS to create fresh, unblocked rules
      name: 'Critical Medical Alarms',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      sound: 'alarm', 
      vibration: true,
      vibrationPattern: [1000, 2000, 1000, 2000],
      bypassDnd: true, 
    });
  }
  return 'default'; 
};

export const scheduleNotification = async (medName, timeString, medId) => {
  try {
    const hasPermission = await checkPermissions();
    if (!hasPermission) return;

    const channelId = await createChannel();

    const scheduled = await notifee.getTriggerNotifications();
    for (const notif of scheduled) {
      if (notif.notification.data && notif.notification.data.medId === String(medId)) {
        await notifee.cancelNotification(notif.notification.id);
      }
    }

    const match = timeString.match(/(\d+):(\d+)\s*(AM|PM|am|pm)?/i);
    if (!match) return;

    let hours = parseInt(match[1], 10);
    let minutes = parseInt(match[2], 10);
    let modifier = match[3] ? match[3].toUpperCase() : '';

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const now = new Date();
    let targetTime = new Date();
    targetTime.setHours(hours, minutes, 0, 0);

    if (targetTime.getTime() <= now.getTime()) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: targetTime.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
      alarmManager: true, // Forces exact minute execution
    };

    await notifee.createTriggerNotification(
      {
        id: `med-${medId}`,
        title: "🚨 MEDICATION TIME!",
        body: `It is time to take: ${medName}`,
        data: { 
            medId: String(medId), 
            medName: String(medName),
            isTest: "false",
            notificationId: `med-${medId}`
        },
        android: {
          channelId: channelId,
          category: AndroidCategory.ALARM,
          visibility: AndroidVisibility.PUBLIC,
          importance: AndroidImportance.HIGH,
          pressAction: { id: 'default', launchActivity: 'default' },
          fullScreenAction: { id: 'default', launchActivity: 'default' }, 
          flags: [AndroidFlags.FLAG_INSISTENT], // Loops the MP3
          autoCancel: false,
          ongoing: true,
        },
        ios: { sound: 'default', critical: true }
      },
      trigger,
    );
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

// Perfectly matches your SettingsScreen.js button
export const testInstantAlarm = async () => {
  const hasPermission = await checkPermissions();
  if (!hasPermission) return;

  const channelId = await createChannel();
  
  // Fires exactly 5 seconds after you push the button
  const targetTime = new Date(Date.now() + 5000); 
  
  await notifee.createTriggerNotification({
    id: 'test-alarm-id',
    title: "🚨 TEST ALARM!",
    body: "This is a test alarm.",
    data: { medId: "999", medName: "Test Medicine", isTest: "true", notificationId: "test-alarm-id" },
    android: {
      channelId: channelId,
      category: AndroidCategory.ALARM,
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
      pressAction: { id: 'default', launchActivity: 'default' },
      fullScreenAction: { id: 'default', launchActivity: 'default' },
      flags: [AndroidFlags.FLAG_INSISTENT],
      autoCancel: false,
      ongoing: true,
    }
  }, { type: TriggerType.TIMESTAMP, timestamp: targetTime.getTime(), alarmManager: true });
};