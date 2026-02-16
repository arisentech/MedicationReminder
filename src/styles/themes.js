// ============================================
// src/styles/themes.js
// Theme configuration for the Medication Reminder App
// Supports light/dark themes and accessibility modes
// ============================================

import { Platform, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Base theme configuration
const baseTheme = {
  // Screen dimensions
  screen: {
    width: screenWidth,
    height: screenHeight,
    isSmallDevice: screenWidth < 375,
    isTablet: screenWidth >= 768,
  },

  // Platform-specific values
  platform: {
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    version: Platform.Version,
  },

  // Typography scale
  typography: {
    // Font families - can be customized with custom fonts
    fontFamily: {
      regular: Platform.select({
        ios: 'System',
        android: 'Roboto',
        default: 'System',
      }),
      medium: Platform.select({
        ios: 'System',
        android: 'Roboto-Medium',
        default: 'System',
      }),
      bold: Platform.select({
        ios: 'System',
        android: 'Roboto-Bold',
        default: 'System',
      }),
      light: Platform.select({
        ios: 'System',
        android: 'Roboto-Light',
        default: 'System',
      }),
    },

    // Font sizes - scaled for elderly users
    fontSize: {
      tiny: 12,
      small: 14,
      regular: 16,
      medium: 18,
      large: 20,
      xlarge: 24,
      xxlarge: 28,
      huge: 32,
      giant: 36,
    },

    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
      loose: 2,
    },

    // Letter spacing
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
    },
  },

  // Spacing scale
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    huge: 48,
  },

  // Border radius scale
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999,
    circle: '50%',
  },

  // Shadow presets for elevation
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12,
    },
  },

  // Animation configurations
  animation: {
    duration: {
      instant: 0,
      fast: 200,
      normal: 300,
      slow: 500,
      slower: 800,
    },
    easing: {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },

  // Component-specific sizes
  components: {
    button: {
      height: {
        small: 40,
        medium: 48,
        large: 56, // Optimized for elderly users
        xlarge: 64,
      },
      minWidth: 120,
    },
    input: {
      height: {
        small: 40,
        medium: 48,
        large: 56, // Optimized for elderly users
      },
    },
    icon: {
      size: {
        small: 20,
        medium: 24,
        large: 28,
        xlarge: 32,
      },
    },
    avatar: {
      size: {
        small: 40,
        medium: 56,
        large: 72,
        xlarge: 96,
      },
    },
    card: {
      padding: 16,
      borderRadius: 12,
    },
    header: {
      height: Platform.select({
        ios: 64,
        android: 56,
        default: 60,
      }),
    },
    tabBar: {
      height: Platform.select({
        ios: 70,
        android: 65,
        default: 70,
      }),
    },
  },

  // Accessibility settings
  accessibility: {
    minimumTouchTarget: 48, // WCAG recommended minimum
    focusedOpacity: 0.8,
    disabledOpacity: 0.4,
  },
};

// Light theme colors
const lightTheme = {
  ...baseTheme,
  name: 'light',
  
  colors: {
    // Primary palette
    primary: '#4A90E2',
    primaryLight: '#6BA3E5',
    primaryDark: '#357ABD',
    primaryContrast: '#FFFFFF',

    // Secondary palette
    secondary: '#50C878',
    secondaryLight: '#6FD492',
    secondaryDark: '#3DA861',
    secondaryContrast: '#FFFFFF',

    // Semantic colors
    success: '#4CAF50',
    successLight: '#81C784',
    successDark: '#388E3C',
    
    warning: '#FFC107',
    warningLight: '#FFD54F',
    warningDark: '#F57C00',
    
    error: '#F44336',
    errorLight: '#EF5350',
    errorDark: '#C62828',
    
    info: '#2196F3',
    infoLight: '#64B5F6',
    infoDark: '#1976D2',

    // Background colors
    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceVariant: '#FAFAFA',
    overlay: 'rgba(0, 0, 0, 0.5)',
    scrim: 'rgba(0, 0, 0, 0.3)',

    // Text colors
    text: '#212121',
    textSecondary: '#757575',
    textDisabled: '#BDBDBD',
    textHint: '#9E9E9E',
    textOnPrimary: '#FFFFFF',
    textOnSecondary: '#FFFFFF',
    textOnError: '#FFFFFF',
    textOnWarning: '#212121',
    textOnSuccess: '#FFFFFF',

    // Border colors
    border: '#E0E0E0',
    borderLight: '#F5F5F5',
    borderDark: '#BDBDBD',
    borderFocused: '#4A90E2',
    borderError: '#F44336',

    // Medication status colors
    medicationTaken: '#4CAF50',
    medicationMissed: '#F44336',
    medicationSkipped: '#FF9800',
    medicationPending: '#2196F3',
    medicationUpcoming: '#9E9E9E',

    // Special purpose colors
    divider: '#E0E0E0',
    disabled: '#BDBDBD',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.4)',
    notification: '#F44336',
    link: '#2196F3',
    skeleton: '#E0E0E0',
  },
};

// Dark theme colors
const darkTheme = {
  ...baseTheme,
  name: 'dark',
  
  colors: {
    // Primary palette
    primary: '#5FA3F0',
    primaryLight: '#8AB4F8',
    primaryDark: '#4A90E2',
    primaryContrast: '#000000',

    // Secondary palette
    secondary: '#64D989',
    secondaryLight: '#81E49F',
    secondaryDark: '#50C878',
    secondaryContrast: '#000000',

    // Semantic colors
    success: '#66BB6A',
    successLight: '#81C784',
    successDark: '#4CAF50',
    
    warning: '#FFCA28',
    warningLight: '#FFD54F',
    warningDark: '#FFB300',
    
    error: '#EF5350',
    errorLight: '#FF7961',
    errorDark: '#F44336',
    
    info: '#42A5F5',
    infoLight: '#64B5F6',
    infoDark: '#2196F3',

    // Background colors
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    overlay: 'rgba(255, 255, 255, 0.1)',
    scrim: 'rgba(0, 0, 0, 0.5)',

    // Text colors
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textDisabled: '#666666',
    textHint: '#808080',
    textOnPrimary: '#000000',
    textOnSecondary: '#000000',
    textOnError: '#000000',
    textOnWarning: '#000000',
    textOnSuccess: '#000000',

    // Border colors
    border: '#333333',
    borderLight: '#404040',
    borderDark: '#1A1A1A',
    borderFocused: '#5FA3F0',
    borderError: '#EF5350',

    // Medication status colors
    medicationTaken: '#66BB6A',
    medicationMissed: '#EF5350',
    medicationSkipped: '#FFB74D',
    medicationPending: '#42A5F5',
    medicationUpcoming: '#666666',

    // Special purpose colors
    divider: '#333333',
    disabled: '#666666',
    placeholder: '#808080',
    backdrop: 'rgba(0, 0, 0, 0.7)',
    notification: '#EF5350',
    link: '#42A5F5',
    skeleton: '#333333',
  },
};

// High contrast theme for accessibility
const highContrastTheme = {
  ...baseTheme,
  name: 'highContrast',
  
  colors: {
    // Primary palette
    primary: '#FFFF00',
    primaryLight: '#FFFF66',
    primaryDark: '#CCCC00',
    primaryContrast: '#000000',

    // Secondary palette
    secondary: '#00FF00',
    secondaryLight: '#66FF66',
    secondaryDark: '#00CC00',
    secondaryContrast: '#000000',

    // Semantic colors
    success: '#00FF00',
    successLight: '#66FF66',
    successDark: '#00CC00',
    
    warning: '#FFFF00',
    warningLight: '#FFFF66',
    warningDark: '#CCCC00',
    
    error: '#FF0000',
    errorLight: '#FF6666',
    errorDark: '#CC0000',
    
    info: '#00FFFF',
    infoLight: '#66FFFF',
    infoDark: '#00CCCC',

    // Background colors
    background: '#000000',
    surface: '#000000',
    surfaceVariant: '#1A1A1A',
    overlay: 'rgba(255, 255, 255, 0.9)',
    scrim: 'rgba(0, 0, 0, 0.9)',

    // Text colors
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textDisabled: '#666666',
    textHint: '#999999',
    textOnPrimary: '#000000',
    textOnSecondary: '#000000',
    textOnError: '#FFFFFF',
    textOnWarning: '#000000',
    textOnSuccess: '#000000',

    // Border colors
    border: '#FFFFFF',
    borderLight: '#CCCCCC',
    borderDark: '#666666',
    borderFocused: '#FFFF00',
    borderError: '#FF0000',

    // Medication status colors
    medicationTaken: '#00FF00',
    medicationMissed: '#FF0000',
    medicationSkipped: '#FFFF00',
    medicationPending: '#00FFFF',
    medicationUpcoming: '#666666',

    // Special purpose colors
    divider: '#FFFFFF',
    disabled: '#666666',
    placeholder: '#999999',
    backdrop: 'rgba(0, 0, 0, 0.9)',
    notification: '#FF0000',
    link: '#00FFFF',
    skeleton: '#333333',
  },

  // Override typography for better readability
  typography: {
    ...baseTheme.typography,
    fontSize: {
      tiny: 14,
      small: 16,
      regular: 18,
      medium: 20,
      large: 24,
      xlarge: 28,
      xxlarge: 32,
      huge: 36,
      giant: 40,
    },
  },
};

// Theme helper functions
export const getTheme = (themeName = 'light') => {
  switch (themeName) {
    case 'dark':
      return darkTheme;
    case 'highContrast':
      return highContrastTheme;
    default:
      return lightTheme;
  }
};

// Style helper functions
export const createStyles = (theme) => ({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Card styles
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.base,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.base,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  // Typography styles
  heading1: {
    fontSize: theme.typography.fontSize.huge,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize.huge * theme.typography.lineHeight.tight,
  },

  heading2: {
    fontSize: theme.typography.fontSize.xxlarge,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize.xxlarge * theme.typography.lineHeight.tight,
  },

  heading3: {
    fontSize: theme.typography.fontSize.xlarge,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize.xlarge * theme.typography.lineHeight.normal,
  },

  body: {
    fontSize: theme.typography.fontSize.regular,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize.regular * theme.typography.lineHeight.normal,
  },

  bodyLarge: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    lineHeight: theme.typography.fontSize.medium * theme.typography.lineHeight.normal,
  },

  caption: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.fontSize.small * theme.typography.lineHeight.normal,
  },

  // Button styles
  button: {
    height: theme.components.button.height.large,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.sm,
  },

  buttonText: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primaryContrast,
  },

  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
  },

  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },

  buttonOutlineText: {
    color: theme.colors.primary,
  },

  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
    opacity: theme.accessibility.disabledOpacity,
  },

  // Input styles
  input: {
    height: theme.components.input.height.large,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.base,
    fontSize: theme.typography.fontSize.regular,
    color: theme.colors.text,
  },

  inputFocused: {
    borderColor: theme.colors.borderFocused,
    borderWidth: 2,
  },

  inputError: {
    borderColor: theme.colors.borderError,
  },

  inputLabel: {
    fontSize: theme.typography.fontSize.regular,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },

  // List styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.base,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },

  listItemText: {
    fontSize: theme.typography.fontSize.regular,
    color: theme.colors.text,
    flex: 1,
  },

  // Medication-specific styles
  medicationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.md,
  },

  medicationStatus: {
    taken: {
      backgroundColor: theme.colors.medicationTaken,
    },
    missed: {
      backgroundColor: theme.colors.medicationMissed,
    },
    skipped: {
      backgroundColor: theme.colors.medicationSkipped,
    },
    pending: {
      backgroundColor: theme.colors.medicationPending,
    },
    upcoming: {
      backgroundColor: theme.colors.medicationUpcoming,
    },
  },

  // Utility styles
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  shadow: theme.shadows.base,
  shadowLarge: theme.shadows.lg,
});

// Export themes
export const themes = {
  light: lightTheme,
  dark: darkTheme,
  highContrast: highContrastTheme,
};

// Export default theme
export default lightTheme;