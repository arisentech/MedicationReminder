// ============================================
// src/services/api.js (Stub version)
// Replace with actual API implementation later
// ============================================

// Mock API functions for now
export const getMedicationHistory = async (date) => {
  // Return mock data for now
  return [
    { id: 1, name: 'Aspirin', time: '08:00 AM', taken: true, takenAt: '08:05 AM' },
    { id: 2, name: 'Lisinopril', time: '07:00 AM', taken: true, takenAt: '07:02 AM' },
    { id: 3, name: 'Metformin', time: '12:00 PM', taken: false },
    { id: 4, name: 'Vitamin D', time: '06:00 PM', taken: true, takenAt: '06:15 PM' },
  ];
};

export const getMedications = async () => {
  return [
    { id: '1', name: 'Aspirin', dosage: '100mg', frequency: 'Daily', times: ['08:00 AM'] },
    { id: '2', name: 'Vitamin D', dosage: '1000 IU', frequency: 'Daily', times: ['12:00 PM'] },
  ];
};

export const saveMedication = async (medication) => {
  console.log('Saving medication:', medication);
  return { success: true, id: Date.now() };
};

export const updateMedication = async (id, medication) => {
  console.log('Updating medication:', id, medication);
  return { success: true };
};

export const deleteMedication = async (id) => {
  console.log('Deleting medication:', id);
  return { success: true };
};

export const markMedicationTaken = async (medicationId, timestamp) => {
  console.log('Marking medication as taken:', medicationId, timestamp);
  return { success: true };
};

export const sendCaregiverAlert = async (medicationId, caregiverId) => {
  console.log('Sending caregiver alert:', medicationId, caregiverId);
  return { success: true };
};