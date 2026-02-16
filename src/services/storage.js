import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  MEDICATIONS: 'medications',
  SETTINGS: 'settings',
  CAREGIVERS: 'caregivers',
};

export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error reading data:', error);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};