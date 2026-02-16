// ============================================
// src/utils/constants.js
// Complete configuration file for the Medication Reminder App
// ============================================

// API Configuration
export const API_CONFIG = {
  // Base URL for your backend API
  // Change this to your actual backend URL when deploying
  BASE_URL: __DEV__ 
    ? 'http://localhost:8000/api'  // Development URL
    : 'https://api.yourdomain.com/api',  // Production URL
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      LOGIN: '/users/login',
      REGISTER: '/users/register',
      LOGOUT: '/users/logout',
      REFRESH_TOKEN: '/users/refresh-token',
      FORGOT_PASSWORD: '/users/forgot-password',
      RESET_PASSWORD: '/users/reset-password',
    },
    
    // Medication endpoints
    MEDICATIONS: {
      GET_ALL: '/medications',
      GET_ONE: '/medications/:id',
      CREATE: '/medications',
      UPDATE: '/medications/:id',
      DELETE: '/medications/:id',
      MARK_TAKEN: '/medications/taken',
      MARK_SKIPPED: '/medications/skipped',
    },
    
    // History endpoints
    HISTORY: {
      GET_ALL: '/medications/history',
      GET_BY_DATE: '/medications/history/:date',
      GET_REPORT: '/medications/history/report',
      EXPORT: '/medications/history/export',
    },
    
    // Caregiver endpoints
    CAREGIVERS: {
      GET_ALL: '/caregivers',
      ADD: '/caregivers',
      UPDATE: '/caregivers/:id',
      DELETE: '/caregivers/:id',
      SEND_ALERT: '/caregivers/alert',
    },
    
    // Notification endpoints
    NOTIFICATIONS: {
      GET_ALL: '/notifications',
      UPDATE_SETTINGS: '/notifications/settings',
      TEST_NOTIFICATION: '/notifications/test',
    },
    
    // User profile endpoints
    PROFILE: {
      GET: '/profile',
      UPDATE: '/profile',
      CHANGE_PASSWORD: '/profile/change-password',
      DELETE_ACCOUNT: '/profile/delete',
    },
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // milliseconds
  },
};

// App Configuration
export const APP_CONFIG = {
  // App name and version
  APP_NAME: 'Medication Reminder',
  APP_VERSION: '1.0.0',
  
  // Support contact
  SUPPORT_EMAIL: 'support@medicationreminder.com',
  SUPPORT_PHONE: '+1-800-XXX-XXXX',
  
  // Privacy and terms URLs
  PRIVACY_POLICY_URL: 'https://yourdomain.com/privacy',
  TERMS_OF_SERVICE_URL: 'https://yourdomain.com/terms',
  
  // Feature flags
  FEATURES: {
    ENABLE_BIOMETRIC_AUTH: true,
    ENABLE_DARK_MODE: false,
    ENABLE_VOICE_REMINDERS: true,
    ENABLE_MEDICATION_PHOTOS: true,
    ENABLE_BARCODE_SCANNING: false,
    ENABLE_HEALTH_APP_INTEGRATION: false,
  },
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  // Default notification settings
  DEFAULT_SETTINGS: {
    enabled: true,
    sound: true,
    vibration: true,
    persistent: true,
  },
  
  // Notification channels for Android
  CHANNELS: {
    MEDICATION_REMINDER: {
      id: 'medication-reminders',
      name: 'Medication Reminders',
      importance: 5, // Maximum importance
      sound: 'default',
      vibrate: true,
    },
    MISSED_MEDICATION: {
      id: 'missed-medications',
      name: 'Missed Medications',
      importance: 4,
      sound: 'alert',
      vibrate: true,
    },
    GENERAL: {
      id: 'general',
      name: 'General Notifications',
      importance: 3,
      sound: 'default',
      vibrate: false,
    },
  },
  
  // Snooze options in minutes
  SNOOZE_OPTIONS: [5, 10, 15, 30, 60],
  
  // Alert escalation times in minutes
  ALERT_ESCALATION: {
    FIRST_REMINDER: 0,
    SECOND_REMINDER: 10,
    THIRD_REMINDER: 20,
    CAREGIVER_ALERT: 30,
  },
};

// Storage Keys for AsyncStorage
export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_DATA: '@user_data',
  
  // User preferences
  SETTINGS: '@settings',
  THEME: '@theme',
  LANGUAGE: '@language',
  NOTIFICATION_PREFERENCES: '@notification_preferences',
  
  // App data
  MEDICATIONS: '@medications',
  MEDICATION_HISTORY: '@medication_history',
  CAREGIVERS: '@caregivers',
  
  // Cache
  LAST_SYNC: '@last_sync',
  OFFLINE_QUEUE: '@offline_queue',
  
  // Onboarding
  ONBOARDING_COMPLETED: '@onboarding_completed',
  MEAL_TIMES: '@meal_times',
};

// UI Constants
export const UI_CONSTANTS = {
  // Colors - Optimized for elderly users with high contrast
  COLORS: {
    // Primary colors
    PRIMARY: '#4A90E2',
    PRIMARY_DARK: '#357ABD',
    PRIMARY_LIGHT: '#6BA3E5',
    
    // Secondary colors
    SECONDARY: '#50C878',
    SECONDARY_DARK: '#3DA861',
    SECONDARY_LIGHT: '#6FD492',
    
    // Status colors
    SUCCESS: '#4CAF50',
    WARNING: '#FFC107',
    ERROR: '#F44336',
    INFO: '#2196F3',
    
    // Neutral colors
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    GRAY_LIGHT: '#F5F5F5',
    GRAY_MEDIUM: '#9E9E9E',
    GRAY_DARK: '#424242',
    
    // Background colors
    BACKGROUND: '#F5F5F5',
    CARD_BACKGROUND: '#FFFFFF',
    MODAL_BACKDROP: 'rgba(0, 0, 0, 0.7)',
    
    // Text colors
    TEXT_PRIMARY: '#212121',
    TEXT_SECONDARY: '#757575',
    TEXT_DISABLED: '#BDBDBD',
    TEXT_WHITE: '#FFFFFF',
    
    // Medication status colors
    TAKEN: '#4CAF50',
    MISSED: '#F44336',
    SKIPPED: '#FF9800',
    PENDING: '#2196F3',
  },
  
  // Typography - Large sizes for elderly users
  TYPOGRAPHY: {
    // Font families
    FONT_FAMILY: {
      REGULAR: 'System',
      BOLD: 'System',
      LIGHT: 'System',
    },
    
    // Font sizes
    FONT_SIZE: {
      TINY: 12,
      SMALL: 14,
      REGULAR: 16,
      MEDIUM: 18,
      LARGE: 20,
      XLARGE: 24,
      XXLARGE: 28,
      HUGE: 32,
    },
    
    // Font weights
    FONT_WEIGHT: {
      LIGHT: '300',
      REGULAR: '400',
      MEDIUM: '500',
      SEMIBOLD: '600',
      BOLD: '700',
    },
    
    // Line heights
    LINE_HEIGHT: {
      TIGHT: 1.2,
      NORMAL: 1.5,
      RELAXED: 1.8,
    },
  },
  
  // Spacing
  SPACING: {
    TINY: 4,
    SMALL: 8,
    MEDIUM: 12,
    REGULAR: 16,
    LARGE: 20,
    XLARGE: 24,
    XXLARGE: 32,
    HUGE: 40,
  },
  
  // Border radius
  BORDER_RADIUS: {
    SMALL: 4,
    MEDIUM: 8,
    LARGE: 12,
    XLARGE: 16,
    ROUND: 9999,
  },
  
  // Shadow styles for iOS and Android
  SHADOWS: {
    SMALL: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    MEDIUM: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    LARGE: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  
  // Component sizes
  COMPONENT_SIZE: {
    BUTTON_HEIGHT: 56, // Large for elderly users
    INPUT_HEIGHT: 56,
    ICON_SIZE: 28,
    AVATAR_SIZE: 60,
    TAB_BAR_HEIGHT: 70,
    HEADER_HEIGHT: 60,
  },
  
  // Animation durations
  ANIMATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
};

// Medication Constants
export const MEDICATION_CONSTANTS = {
  // Frequency options
  FREQUENCIES: [
    { label: 'Daily', value: 'daily' },
    { label: 'Twice Daily', value: 'twice_daily' },
    { label: 'Three Times Daily', value: 'three_times_daily' },
    { label: 'Four Times Daily', value: 'four_times_daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Bi-Weekly', value: 'bi_weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'As Needed', value: 'as_needed' },
    { label: 'Custom', value: 'custom' },
  ],
  
  // Common dosage units
  DOSAGE_UNITS: [
    'mg', 'mcg', 'g', 'mL', 'L', 
    'tablet(s)', 'capsule(s)', 'drop(s)', 
    'puff(s)', 'patch(es)', 'unit(s)',
  ],
  
  // Medication timing options
  TIMING_OPTIONS: [
    { label: 'Before Breakfast', value: 'before_breakfast' },
    { label: 'After Breakfast', value: 'after_breakfast' },
    { label: 'Before Lunch', value: 'before_lunch' },
    { label: 'After Lunch', value: 'after_lunch' },
    { label: 'Before Dinner', value: 'before_dinner' },
    { label: 'After Dinner', value: 'after_dinner' },
    { label: 'Before Bed', value: 'before_bed' },
    { label: 'With Food', value: 'with_food' },
    { label: 'Without Food', value: 'without_food' },
    { label: 'Specific Time', value: 'specific_time' },
  ],
  
  // Default meal times
  DEFAULT_MEAL_TIMES: {
    breakfast: '08:00',
    lunch: '12:00',
    dinner: '18:00',
    bedtime: '22:00',
  },
  
  // Medication categories
  CATEGORIES: [
    'Prescription',
    'Over-the-Counter',
    'Vitamin',
    'Supplement',
    'Herbal',
    'Other',
  ],
};

// Validation Rules
export const VALIDATION_RULES = {
  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false,
  },
  
  // Input limits
  INPUT_LIMITS: {
    NAME_MAX_LENGTH: 100,
    NOTES_MAX_LENGTH: 500,
    PHONE_MAX_LENGTH: 20,
    DOSAGE_MAX_LENGTH: 50,
  },
  
  // Regex patterns
  PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^[\d\s\-\+\(\)]+$/,
    TIME_24H: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
    TIME_12H: /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK: {
    NO_INTERNET: 'No internet connection. Please check your network settings.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNKNOWN: 'An unexpected error occurred. Please try again.',
  },
  
  // Validation errors
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    INVALID_TIME: 'Please enter a valid time',
    PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`,
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
  },
  
  // Authentication errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    USER_EXISTS: 'User already exists with this email',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
  },
  
  // Medication errors
  MEDICATION: {
    NOT_FOUND: 'Medication not found',
    ALREADY_EXISTS: 'This medication already exists',
    CANNOT_DELETE: 'Cannot delete medication with active reminders',
    INVALID_SCHEDULE: 'Invalid medication schedule',
  },
};

// Success Messages
export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  
  // Medications
  MEDICATION_ADDED: 'Medication added successfully',
  MEDICATION_UPDATED: 'Medication updated successfully',
  MEDICATION_DELETED: 'Medication deleted successfully',
  MEDICATION_TAKEN: 'Marked as taken',
  MEDICATION_SKIPPED: 'Marked as skipped',
  
  // Caregivers
  CAREGIVER_ADDED: 'Caregiver added successfully',
  CAREGIVER_REMOVED: 'Caregiver removed successfully',
  ALERT_SENT: 'Alert sent to caregiver',
  
  // Settings
  SETTINGS_UPDATED: 'Settings updated successfully',
  NOTIFICATIONS_ENABLED: 'Notifications enabled',
  NOTIFICATIONS_DISABLED: 'Notifications disabled',
};

// Date/Time Formats
export const DATE_TIME_FORMATS = {
  DATE_SHORT: 'MM/DD/YYYY',
  DATE_LONG: 'MMMM DD, YYYY',
  TIME_12H: 'hh:mm A',
  TIME_24H: 'HH:mm',
  DATETIME_SHORT: 'MM/DD/YY hh:mm A',
  DATETIME_LONG: 'MMMM DD, YYYY at hh:mm A',
  RELATIVE_TIME: true, // Enable "2 hours ago" format
};

// Accessibility Settings
export const ACCESSIBILITY = {
  // Minimum touch target size (in pixels)
  MIN_TOUCH_TARGET: 48,
  
  // Voice over labels
  LABELS: {
    TAKE_MEDICATION_BUTTON: 'Take medication button',
    SKIP_MEDICATION_BUTTON: 'Skip medication button',
    ADD_MEDICATION_BUTTON: 'Add new medication button',
    DELETE_MEDICATION_BUTTON: 'Delete medication button',
    NAVIGATION_HOME: 'Navigate to home screen',
    NAVIGATION_MEDICATIONS: 'Navigate to medications screen',
    NAVIGATION_HISTORY: 'Navigate to history screen',
    NAVIGATION_SETTINGS: 'Navigate to settings screen',
  },
  
  // High contrast mode colors
  HIGH_CONTRAST: {
    BACKGROUND: '#000000',
    TEXT: '#FFFFFF',
    PRIMARY: '#00FF00',
    ERROR: '#FF0000',
  },
};

// Export all constants as a single object for convenience
export default {
  API_CONFIG,
  APP_CONFIG,
  NOTIFICATION_CONFIG,
  STORAGE_KEYS,
  UI_CONSTANTS,
  MEDICATION_CONSTANTS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DATE_TIME_FORMATS,
  ACCESSIBILITY,
};