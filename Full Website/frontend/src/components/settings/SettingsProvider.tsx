// Settings Provider - Context for managing settings state
'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { useSettings } from '@/hooks/useSettings';
import type { 
  UserPreferences, 
  EmergencyContact, 
  Certification,
  ActiveSession,
  ActivityParams,
  ActivityItem,
  ActivityAnalytics,
  PasswordChangeData,
  AvatarConfiguration
} from '@/lib/api/settings';

interface SettingsContextType {
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

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const settingsData = useSettings();

  return (
    <SettingsContext.Provider value={settingsData}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsProvider;