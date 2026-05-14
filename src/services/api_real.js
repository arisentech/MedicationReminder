const API_URL = 'https://arisen.in/medicationreminderapp/backend/api.php'; 

const postData = async (action, data) => {
  try {
    const response = await fetch(`${API_URL}?action=${action}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(`PHP Error on ${action}:`, text);
      return { success: false, error: "Server error." };
    }
  } catch (error) { throw error; }
};

const getData = async (action, params = '') => {
  try {
    const response = await fetch(`${API_URL}?action=${action}${params}`);
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) { return []; }
  } catch (error) { throw error; }
};

export const registerUser = async (name, email) => await postData('register', { name, email });
export const loginUser = async (email) => await postData('login', { email });
export const saveMedication = async (med, userId) => await postData('save_medication', { ...med, user_id: userId });
export const deleteMedication = async (medId) => await postData('delete_medication', { id: medId });
export const getTodaysMedications = async (userId) => await getData('get_medications', `&user_id=${userId}`);
export const getMedicationHistory = async (userId, date) => await getData('get_history', `&user_id=${userId}&date=${date}`);
export const getCaregivers = async (userId) => await getData('get_caregivers', `&user_id=${userId}`);
export const saveCaregiver = async (cg, userId) => await postData('save_caregiver', { ...cg, user_id: userId });
export const deleteCaregiver = async (cgId) => await postData('delete_caregiver', { id: cgId });
export const logMedicationHistory = async (medId, status) => await postData('log_medication', { med_id: medId, status });