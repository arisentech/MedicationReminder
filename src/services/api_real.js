import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://your-backend-url.com/api'; // Replace with your actual backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const saveMedication = async (medication) => {
  try {
    const response = await api.post('/medications', medication);
    return response.data;
  } catch (error) {
    console.error('Error saving medication:', error);
    throw error;
  }
};

export const getMedications = async () => {
  try {
    const response = await api.get('/medications');
    return response.data;
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw error;
  }
};

export const updateMedication = async (id, medication) => {
  try {
    const response = await api.put(`/medications/${id}`, medication);
    return response.data;
  } catch (error) {
    console.error('Error updating medication:', error);
    throw error;
  }
};

export const deleteMedication = async (id) => {
  try {
    const response = await api.delete(`/medications/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
};

export const markMedicationTaken = async (medicationId, timestamp) => {
  try {
    const response = await api.post('/medications/taken', {
      medicationId,
      timestamp,
    });
    return response.data;
  } catch (error) {
    console.error('Error marking medication as taken:', error);
    throw error;
  }
};

export const sendCaregiverAlert = async (medicationId, caregiverId) => {
  try {
    const response = await api.post('/alerts/caregiver', {
      medicationId,
      caregiverId,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending caregiver alert:', error);
    throw error;
  }
};

export const getMedicationHistory = async (startDate, endDate) => {
  try {
    const response = await api.get('/medications/history', {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching medication history:', error);
    throw error;
  }
};
