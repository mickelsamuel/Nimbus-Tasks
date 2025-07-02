// Settings Management Hook
import { useState, useEffect, useCallback } from 'react';
import { 
  SettingsAPI, 
  UserPreferences, 
  EmergencyContact, 
  Certification,
  ActiveSession,
  ActivityItem,
  ActivityParams,
  ActivityAnalytics,
  PasswordChangeData,
  AvatarConfiguration
} from '@/lib/api/settings';
import { apiUtils } from '@/lib/api/client';

// Type guard and helper for error handling
interface FormattableError {
  message?: string;
  errors?: Array<{ msg?: string; message?: string }>;
}

const formatUnknownError = (error: unknown): string => {
  // If it's already in the expected format, use it directly
  if (error && typeof error === 'object' && ('message' in error || 'errors' in error)) {
    return apiUtils.formatError(error as FormattableError);
  }
  
  // If it's an Error object, extract the message
  if (error instanceof Error) {
    return error.message;
  }
  
  // If it's a string, return it
  if (typeof error === 'string') {
    return error;
  }
  
  // Fallback for any other unknown type
  return 'An unexpected error occurred';
};

interface UseSettingsReturn {
  // Preferences
  preferences: UserPreferences | null;
  preferencesLoading: boolean;
  preferencesError: string | null;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => Promise<void>;
  
  // Emergency contacts
  emergencyContacts: EmergencyContact[];
  updateEmergencyContacts: (contacts: EmergencyContact[]) => Promise<void>;
  
  // Certifications
  certifications: Certification[];
  updateCertifications: (certifications: Certification[]) => Promise<void>;
  
  // Sessions
  activeSessions: ActiveSession[];
  sessionsLoading: boolean;
  loadSessions: () => Promise<void>;
  terminateSession: (sessionId: string) => Promise<void>;
  terminateAllSessions: () => Promise<void>;
  
  // Activity
  activityLoading: boolean;
  loadActivity: (params?: ActivityParams) => Promise<ActivityItem[]>;
  
  // Analytics
  analytics: ActivityAnalytics | null;
  analyticsLoading: boolean;
  loadAnalytics: (timeframe?: string) => Promise<void>;
  
  // Password
  changePassword: (passwordData: PasswordChangeData) => Promise<void>;
  
  // Avatar
  avatarConfig: AvatarConfiguration | null;
  updateAvatarConfig: (config: Partial<AvatarConfiguration>) => Promise<void>;
  uploadAvatarPhoto: (file: File) => Promise<void>;
  deleteAvatarPhoto: () => Promise<void>;
  
  // Export/Import
  exportSettings: () => Promise<void>;
  importSettings: (file: File) => Promise<void>;
  
  // Global loading and error states
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export const useSettings = (): UseSettingsReturn => {
  // State management
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  
  const [activityLoading, setActivityLoading] = useState(false);
  
  const [analytics, setAnalytics] = useState<ActivityAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfiguration | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
    setPreferencesError(null);
  }, []);

  // Load initial preferences
  const loadPreferences = useCallback(async () => {
    if (!apiUtils.isAuthenticated()) return;
    
    setPreferencesLoading(true);
    setPreferencesError(null);
    
    try {
      const data = await SettingsAPI.getPreferences();
      setPreferences(data);
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setPreferencesError(errorMessage);
      console.error('Failed to load preferences:', err);
    } finally {
      setPreferencesLoading(false);
    }
  }, []);

  // Update preferences
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedPreferences = await SettingsAPI.updatePreferences(updates);
      setPreferences(updatedPreferences);
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset preferences
  const resetPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const defaultPreferences = await SettingsAPI.resetPreferences();
      setPreferences(defaultPreferences);
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update emergency contacts
  const updateEmergencyContacts = useCallback(async (contacts: EmergencyContact[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedContacts = await SettingsAPI.updateEmergencyContacts(contacts);
      setEmergencyContacts(updatedContacts);
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update certifications
  const updateCertifications = useCallback(async (certs: Certification[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedCertifications = await SettingsAPI.updateCertifications(certs);
      setCertifications(updatedCertifications);
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load active sessions
  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    setError(null);
    
    try {
      const sessions = await SettingsAPI.getActiveSessions();
      setActiveSessions(sessions);
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      console.error('Failed to load sessions:', err);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  // Terminate session
  const terminateSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await SettingsAPI.terminateSession(sessionId);
      // Remove terminated session from state
      setActiveSessions(prev => prev.filter(session => session.sessionId !== sessionId));
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Terminate all sessions
  const terminateAllSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await SettingsAPI.terminateAllSessions();
      // Keep only current session
      setActiveSessions(prev => prev.filter(session => session.isCurrent));
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load activity
  const loadActivity = useCallback(async (params?: ActivityParams): Promise<ActivityItem[]> => {
    setActivityLoading(true);
    setError(null);
    
    try {
      const response = await SettingsAPI.getActivity(params);
      return response.activities;
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      console.error('Failed to load activity:', err);
      return [];
    } finally {
      setActivityLoading(false);
    }
  }, []);

  // Load analytics
  const loadAnalytics = useCallback(async (timeframe?: string) => {
    setAnalyticsLoading(true);
    setError(null);
    
    try {
      const analyticsData = await SettingsAPI.getAnalytics(timeframe);
      setAnalytics(analyticsData);
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      console.error('Failed to load analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Change password
  const changePassword = useCallback(async (passwordData: PasswordChangeData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await SettingsAPI.changePassword(passwordData);
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update avatar configuration
  const updateAvatarConfig = useCallback(async (config: Partial<AvatarConfiguration>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedConfig = await SettingsAPI.updateAvatarConfiguration(config);
      setAvatarConfig(updatedConfig);
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Upload avatar photo
  const uploadAvatarPhoto = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await SettingsAPI.uploadAvatarPhoto(file);
      // Could update user avatar in global state here
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete avatar photo
  const deleteAvatarPhoto = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await SettingsAPI.deleteAvatarPhoto();
      // Could update user avatar in global state here
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Export settings
  const exportSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const blob = await SettingsAPI.exportSettings();
      const filename = `settings-export-${new Date().toISOString().split('T')[0]}.json`;
      apiUtils.downloadFile(blob, filename);
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Import settings
  const importSettings = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedPreferences = await SettingsAPI.importSettings(file);
      setPreferences(updatedPreferences);
    } catch (err: unknown) {
      const errorMessage = formatUnknownError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data on mount
  useEffect(() => {
    if (apiUtils.isAuthenticated()) {
      loadPreferences();
    }
  }, [loadPreferences]);

  return {
    // Preferences
    preferences,
    preferencesLoading,
    preferencesError,
    updatePreferences,
    resetPreferences,
    
    // Emergency contacts
    emergencyContacts,
    updateEmergencyContacts,
    
    // Certifications
    certifications,
    updateCertifications,
    
    // Sessions
    activeSessions,
    sessionsLoading,
    loadSessions,
    terminateSession,
    terminateAllSessions,
    
    // Activity
    activityLoading,
    loadActivity,
    
    // Analytics
    analytics,
    analyticsLoading,
    loadAnalytics,
    
    // Password
    changePassword,
    
    // Avatar
    avatarConfig,
    updateAvatarConfig,
    uploadAvatarPhoto,
    deleteAvatarPhoto,
    
    // Export/Import
    exportSettings,
    importSettings,
    
    // Global state
    isLoading,
    error,
    clearError
  };
};