// ============================================
// src/screens/CaregiverScreen.js
// Caregiver management screen for the Medication Reminder App
// ============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Modal,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme, createStyles } from '../styles/themes';
import { STORAGE_KEYS, VALIDATION_RULES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';

export default function CaregiverScreen({ navigation }) {
  // State management
  const [caregivers, setCaregivers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(getTheme('light'));
  
  // Form state for adding/editing caregiver
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    relationship: '',
    notifyOnMissed: true,
    notifyDaily: false,
    emergencyContact: false,
  });

  const [formErrors, setFormErrors] = useState({});

  // Load caregivers on mount
  useEffect(() => {
    loadCaregivers();
    loadThemePreference();
  }, []);

  // Load theme preference
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme) {
        setTheme(getTheme(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  // Load caregivers from storage/API
  const loadCaregivers = async () => {
    setLoading(true);
    try {
      // In production, this would be an API call
      // For now, using AsyncStorage as example
      const savedCaregivers = await AsyncStorage.getItem(STORAGE_KEYS.CAREGIVERS);
      if (savedCaregivers) {
        setCaregivers(JSON.parse(savedCaregivers));
      } else {
        // Sample data for demonstration
        const sampleCaregivers = [
          {
            id: '1',
            name: 'Jane Smith',
            email: 'jane.smith@email.com',
            phone: '+1 (555) 123-4567',
            relationship: 'Daughter',
            notifyOnMissed: true,
            notifyDaily: false,
            emergencyContact: true,
            addedDate: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Dr. Johnson',
            email: 'dr.johnson@clinic.com',
            phone: '+1 (555) 987-6543',
            relationship: 'Primary Doctor',
            notifyOnMissed: true,
            notifyDaily: true,
            emergencyContact: false,
            addedDate: new Date().toISOString(),
          },
        ];
        setCaregivers(sampleCaregivers);
      }
    } catch (error) {
      console.error('Error loading caregivers:', error);
      Alert.alert('Error', 'Failed to load caregivers');
    } finally {
      setLoading(false);
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
    } else if (!VALIDATION_RULES.PATTERNS.EMAIL.test(formData.email)) {
      errors.email = ERROR_MESSAGES.VALIDATION.INVALID_EMAIL;
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && !VALIDATION_RULES.PATTERNS.PHONE.test(formData.phone)) {
      errors.phone = ERROR_MESSAGES.VALIDATION.INVALID_PHONE;
    }

    // Relationship validation
    if (!formData.relationship.trim()) {
      errors.relationship = ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add new caregiver
  const handleAddCaregiver = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const newCaregiver = {
        id: Date.now().toString(),
        ...formData,
        addedDate: new Date().toISOString(),
      };

      const updatedCaregivers = [...caregivers, newCaregiver];
      setCaregivers(updatedCaregivers);
      
      // Save to storage
      await AsyncStorage.setItem(STORAGE_KEYS.CAREGIVERS, JSON.stringify(updatedCaregivers));
      
      // In production, also make API call here
      
      Alert.alert('Success', SUCCESS_MESSAGES.CAREGIVER_ADDED);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding caregiver:', error);
      Alert.alert('Error', 'Failed to add caregiver');
    }
  };

  // Edit existing caregiver
  const handleEditCaregiver = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const updatedCaregivers = caregivers.map(caregiver =>
        caregiver.id === selectedCaregiver.id
          ? { ...caregiver, ...formData }
          : caregiver
      );

      setCaregivers(updatedCaregivers);
      await AsyncStorage.setItem(STORAGE_KEYS.CAREGIVERS, JSON.stringify(updatedCaregivers));
      
      Alert.alert('Success', 'Caregiver updated successfully');
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('Error editing caregiver:', error);
      Alert.alert('Error', 'Failed to update caregiver');
    }
  };

  // Delete caregiver
  const handleDeleteCaregiver = (caregiver) => {
    Alert.alert(
      'Delete Caregiver',
      `Are you sure you want to remove ${caregiver.name} as a caregiver?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedCaregivers = caregivers.filter(c => c.id !== caregiver.id);
              setCaregivers(updatedCaregivers);
              await AsyncStorage.setItem(STORAGE_KEYS.CAREGIVERS, JSON.stringify(updatedCaregivers));
              Alert.alert('Success', SUCCESS_MESSAGES.CAREGIVER_REMOVED);
            } catch (error) {
              console.error('Error deleting caregiver:', error);
              Alert.alert('Error', 'Failed to delete caregiver');
            }
          },
        },
      ]
    );
  };

  // Send test alert to caregiver
  const handleSendTestAlert = (caregiver) => {
    Alert.alert(
      'Send Test Alert',
      `Send a test notification to ${caregiver.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              // In production, make API call to send notification
              Alert.alert('Success', `Test alert sent to ${caregiver.name}`);
            } catch (error) {
              console.error('Error sending test alert:', error);
              Alert.alert('Error', 'Failed to send test alert');
            }
          },
        },
      ]
    );
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      relationship: '',
      notifyOnMissed: true,
      notifyDaily: false,
      emergencyContact: false,
    });
    setFormErrors({});
    setSelectedCaregiver(null);
  };

  // Open edit modal
  const openEditModal = (caregiver) => {
    setSelectedCaregiver(caregiver);
    setFormData({
      name: caregiver.name,
      email: caregiver.email,
      phone: caregiver.phone,
      relationship: caregiver.relationship,
      notifyOnMissed: caregiver.notifyOnMissed,
      notifyDaily: caregiver.notifyDaily,
      emergencyContact: caregiver.emergencyContact,
    });
    setShowEditModal(true);
  };

  // Render caregiver card
  const renderCaregiverCard = ({ item }) => (
    <View style={[styles.caregiverCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.caregiverHeader}>
        <View style={styles.caregiverInfo}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.avatarText, { color: theme.colors.primaryContrast }]}>
              {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <View style={styles.caregiverDetails}>
            <Text style={[styles.caregiverName, { color: theme.colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.caregiverRelation, { color: theme.colors.textSecondary }]}>
              {item.relationship}
            </Text>
          </View>
        </View>
        {item.emergencyContact && (
          <View style={[styles.emergencyBadge, { backgroundColor: theme.colors.error }]}>
            <Text style={styles.emergencyText}>Emergency</Text>
          </View>
        )}
      </View>

      <View style={styles.caregiverContact}>
        <View style={styles.contactItem}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.contactText, { color: theme.colors.text }]}>{item.email}</Text>
        </View>
        {item.phone && (
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={[styles.contactText, { color: theme.colors.text }]}>{item.phone}</Text>
          </View>
        )}
      </View>

      <View style={styles.notificationSettings}>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: theme.colors.textSecondary }]}>
            Notify on missed medication
          </Text>
          <Ionicons 
            name={item.notifyOnMissed ? "checkmark-circle" : "close-circle"} 
            size={24} 
            color={item.notifyOnMissed ? theme.colors.success : theme.colors.textDisabled} 
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: theme.colors.textSecondary }]}>
            Daily reports
          </Text>
          <Ionicons 
            name={item.notifyDaily ? "checkmark-circle" : "close-circle"} 
            size={24} 
            color={item.notifyDaily ? theme.colors.success : theme.colors.textDisabled} 
          />
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.primaryLight }]}
          onPress={() => handleSendTestAlert(item)}
        >
          <Ionicons name="notifications-outline" size={20} color={theme.colors.primaryContrast} />
          <Text style={[styles.actionButtonText, { color: theme.colors.primaryContrast }]}>
            Test Alert
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>
            Edit
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.errorLight }]}
          onPress={() => handleDeleteCaregiver(item)}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.actionButtonText, { color: theme.colors.error }]}>
            Remove
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render form modal
  const renderFormModal = (isEdit = false) => (
    <Modal
      visible={isEdit ? showEditModal : showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        isEdit ? setShowEditModal(false) : setShowAddModal(false);
        resetForm();
      }}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {isEdit ? 'Edit Caregiver' : 'Add New Caregiver'}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                isEdit ? setShowEditModal(false) : setShowAddModal(false);
                resetForm();
              }}
            >
              <Ionicons name="close" size={28} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: formErrors.name ? theme.colors.error : theme.colors.border
                  }
                ]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter caregiver's name"
                placeholderTextColor={theme.colors.textHint}
              />
              {formErrors.name && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {formErrors.name}
                </Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Email *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: formErrors.email ? theme.colors.error : theme.colors.border
                  }
                ]}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="caregiver@email.com"
                placeholderTextColor={theme.colors.textHint}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {formErrors.email && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {formErrors.email}
                </Text>
              )}
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Phone (Optional)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: formErrors.phone ? theme.colors.error : theme.colors.border
                  }
                ]}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor={theme.colors.textHint}
                keyboardType="phone-pad"
              />
              {formErrors.phone && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {formErrors.phone}
                </Text>
              )}
            </View>

            {/* Relationship Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Relationship *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    borderColor: formErrors.relationship ? theme.colors.error : theme.colors.border
                  }
                ]}
                value={formData.relationship}
                onChangeText={(text) => setFormData({ ...formData, relationship: text })}
                placeholder="e.g., Son, Daughter, Doctor, Nurse"
                placeholderTextColor={theme.colors.textHint}
              />
              {formErrors.relationship && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {formErrors.relationship}
                </Text>
              )}
            </View>

            {/* Notification Settings */}
            <View style={styles.switchGroup}>
              <Text style={[styles.switchGroupTitle, { color: theme.colors.text }]}>
                Notification Settings
              </Text>

              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                    Notify on Missed Medication
                  </Text>
                  <Text style={[styles.switchDescription, { color: theme.colors.textSecondary }]}>
                    Send alert when medication is missed
                  </Text>
                </View>
                <Switch
                  value={formData.notifyOnMissed}
                  onValueChange={(value) => setFormData({ ...formData, notifyOnMissed: value })}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={formData.notifyOnMissed ? theme.colors.primaryLight : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                    Daily Reports
                  </Text>
                  <Text style={[styles.switchDescription, { color: theme.colors.textSecondary }]}>
                    Send daily medication adherence summary
                  </Text>
                </View>
                <Switch
                  value={formData.notifyDaily}
                  onValueChange={(value) => setFormData({ ...formData, notifyDaily: value })}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={formData.notifyDaily ? theme.colors.primaryLight : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                    Emergency Contact
                  </Text>
                  <Text style={[styles.switchDescription, { color: theme.colors.textSecondary }]}>
                    Priority contact in case of emergency
                  </Text>
                </View>
                <Switch
                  value={formData.emergencyContact}
                  onValueChange={(value) => setFormData({ ...formData, emergencyContact: value })}
                  trackColor={{ false: theme.colors.border, true: theme.colors.error }}
                  thumbColor={formData.emergencyContact ? theme.colors.errorLight : '#f4f3f4'}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton, { borderColor: theme.colors.border }]}
              onPress={() => {
                isEdit ? setShowEditModal(false) : setShowAddModal(false);
                resetForm();
              }}
            >
              <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.colors.primary }]}
              onPress={isEdit ? handleEditCaregiver : handleAddCaregiver}
            >
              <Text style={[styles.saveButtonText, { color: theme.colors.primaryContrast }]}>
                {isEdit ? 'Update' : 'Add'} Caregiver
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.primaryContrast }]}>
          Caregivers
        </Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle" size={28} color={theme.colors.primaryContrast} />
        </TouchableOpacity>
      </View>

      {caregivers.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={80} color={theme.colors.textDisabled} />
          <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
            No Caregivers Added
          </Text>
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
            Add caregivers who will be notified about medication reminders and alerts
          </Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color={theme.colors.primaryContrast} />
            <Text style={[styles.addButtonText, { color: theme.colors.primaryContrast }]}>
              Add First Caregiver
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={caregivers}
          renderItem={renderCaregiverCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={loadCaregivers}
        />
      )}

      {renderFormModal(false)}
      {renderFormModal(true)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 5,
  },
  listContainer: {
    padding: 15,
  },
  caregiverCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  caregiverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  caregiverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  caregiverDetails: {
    marginLeft: 12,
    flex: 1,
  },
  caregiverName: {
    fontSize: 18,
    fontWeight: '600',
  },
  caregiverRelation: {
    fontSize: 14,
    marginTop: 2,
  },
  emergencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  caregiverContact: {
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 8,
  },
  notificationSettings: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 4,
  },
  switchGroup: {
    marginTop: 10,
  },
  switchGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  switchInfo: {
    flex: 1,
    marginRight: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {},
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});