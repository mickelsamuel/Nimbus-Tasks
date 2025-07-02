// Settings API Service
import { api } from './client';

export interface UserPreferences {
  language: 'en' | 'fr';
  theme: 'light' | 'dark' | 'auto';
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extraLarge';
    timeFormat: '12' | '24';
    reducedMotion: boolean;
    highContrast: boolean;
    colorBlindSupport: boolean;
    dyslexiaFriendly: boolean;
    voiceNavigation: boolean;
    adhdFocusMode: boolean;
    screenReaderOptimized: boolean;
    keyboardNavigation: 'standard' | 'enhanced' | 'simplified';
    motionSensitivity: 'normal' | 'reduced' | 'none';
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
    moduleReminders: boolean;
    teamUpdates: boolean;
    friendRequests: boolean;
    achievements: boolean;
    events: boolean;
    security: boolean;
    workHours: {
      enabled: boolean;
      start: string;
      end: string;
      weekendsEnabled: boolean;
    };
    soundEnabled: boolean;
    soundType: 'chime' | 'bell' | 'ping' | 'notification';
    volume: number;
    grouping: 'immediate' | 'smart' | 'priority' | 'batched';
    batchInterval: number;
  };
  security: {
    twoFactorEnabled: boolean;
    twoFactorMethod: 'sms' | 'email' | 'app';
    backupCodes: string[];
    securityAlerts: {
      sms: boolean;
      email: boolean;
    };
    sessionTimeout: number;
    autoLogout: boolean;
    deviceTracking: boolean;
    loginNotifications: boolean;
    riskTolerance: 'low' | 'medium' | 'high';
    biometrics: {
      fingerprint: boolean;
      faceRecognition: boolean;
      voiceRecognition: boolean;
    };
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showStats: boolean;
    showAchievements: boolean;
    showActivity: boolean;
  };
  analytics: {
    enableTracking: boolean;
    shareWithTeam: boolean;
    peerComparison: boolean;
    predictiveAnalytics: boolean;
    exportEnabled: boolean;
  };
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface Certification {
  name: string;
  issuingOrganization?: string;
  issueDate?: Date;
  expiryDate?: Date;
  credentialId?: string;
  isActive: boolean;
}

export interface ActiveSession {
  sessionId: string;
  deviceInfo: {
    browser: string;
    os: string;
    device: string;
    userAgent: string;
  };
  location: {
    ip: string;
    country: string;
    city: string;
    timezone: string;
  };
  loginTime: Date;
  lastActivity: Date;
  isCurrent: boolean;
}

export interface ActivityItem {
  _id: string;
  action: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  riskScore: number;
  location?: {
    country: string;
    city: string;
  };
  deviceInfo?: {
    browser: string;
    os: string;
  };
}

export interface ActivityParams {
  timeframe?: 'day' | 'week' | 'month' | 'year';
  activityTypes?: string[];
  limit?: number;
  page?: number;
}

export interface ActivityAnalytics {
  timeframe: string;
  period: {
    start: Date;
    end: Date;
  };
  activitySummary: {
    totalActions: number;
    actionBreakdown: Array<{
      _id: string;
      count: number;
      lastOccurrence: Date;
    }>;
    mostActiveDay: string;
    securityEvents: number;
  };
  learningProgress: {
    totalHours: number;
    modulesCompleted: number;
    averageScore: number;
    streak: number;
    skillDevelopment: Array<{
      skill: string;
      progress: number;
    }>;
  };
  peerComparison: {
    departmentRank: number;
    totalInDepartment: number;
    scoreVsAverage: number;
    improvementRate: number;
  };
  predictiveInsights: {
    likelyCompletionDate: Date;
    recommendedModules: string[];
    confidenceScore: number;
  };
  careerAnalytics: {
    promotionReadiness: number;
    skillGaps: string[];
    trainingROI: number;
    marketValue: number;
  };
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AvatarConfiguration {
  face: {
    shape: string;
    skinTone: string;
    eyes: string;
    eyeColor: string;
    eyebrows: string;
    nose: string;
    mouth: string;
    expression: string;
  };
  hair: {
    style: string;
    color: string;
    facial: string;
  };
  clothing: {
    suit: string;
    shirt: string;
    tie: string;
    accessories: string[];
  };
  pose: {
    standing: string;
    gesture: string;
    confidence: number;
  };
  environment?: {
    background: string;
    lighting: string;
    props: string[];
  };
}

// Settings API class
export class SettingsAPI {
  // Get user preferences
  static async getPreferences(): Promise<UserPreferences> {
    const response = await api.get('/preferences');
    return response.data;
  }

  // Update user preferences
  static async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const response = await api.put('/preferences', preferences);
    return response.data;
  }

  // Update specific preference section
  static async updateTheme(theme: UserPreferences['theme']): Promise<{ theme: string }> {
    const response = await api.put('/preferences/theme', { theme });
    return response.data;
  }

  static async updateLanguage(language: UserPreferences['language']): Promise<{ language: string }> {
    const response = await api.put('/preferences/language', { language });
    return response.data;
  }

  static async updateNotifications(notifications: Partial<UserPreferences['notifications']>): Promise<{ notifications: UserPreferences['notifications'] }> {
    const response = await api.put('/preferences/notifications', notifications);
    return response.data;
  }

  static async updatePrivacy(privacy: Partial<UserPreferences['privacy']>): Promise<{ privacy: UserPreferences['privacy'] }> {
    const response = await api.put('/preferences/privacy', privacy);
    return response.data;
  }

  // Reset preferences to defaults
  static async resetPreferences(): Promise<UserPreferences> {
    const response = await api.post('/preferences/reset');
    return response.data;
  }

  // Password management
  static async changePassword(passwordData: PasswordChangeData): Promise<{ message: string }> {
    const response = await api.post('/preferences/change-password', passwordData);
    return response.data;
  }

  // Session management
  static async getActiveSessions(): Promise<ActiveSession[]> {
    const response = await api.get('/preferences/sessions');
    return response.data;
  }

  static async terminateSession(sessionId: string): Promise<{ message: string }> {
    const response = await api.delete(`/preferences/sessions/${sessionId}`);
    return response.data;
  }

  static async terminateAllSessions(): Promise<{ message: string }> {
    const response = await api.post('/preferences/sessions/terminate-all');
    return response.data;
  }

  // Emergency contacts
  static async updateEmergencyContacts(contacts: EmergencyContact[]): Promise<EmergencyContact[]> {
    const response = await api.put('/preferences/emergency-contacts', { contacts });
    return response.data;
  }

  // Certifications
  static async updateCertifications(certifications: Certification[]): Promise<Certification[]> {
    const response = await api.put('/preferences/certifications', { certifications });
    return response.data;
  }

  // Activity and analytics
  static async getActivity(params?: ActivityParams): Promise<{
    activities: ActivityItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      hasMore: boolean;
    };
  }> {
    const response = await api.get('/activity', { params });
    return response.data;
  }

  static async getAnalytics(timeframe?: string): Promise<ActivityAnalytics> {
    const response = await api.get('/activity/analytics', { params: { timeframe } });
    return response.data;
  }

  static async exportActivity(params: {
    timeframe?: 'week' | 'month' | 'quarter' | 'year';
    format?: 'json' | 'csv';
  }): Promise<Blob> {
    const response = await api.get('/activity/export', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  // Avatar management
  static async updateAvatarConfiguration(config: Partial<AvatarConfiguration>): Promise<AvatarConfiguration> {
    const response = await api.put('/avatar/configuration', config);
    return response.data;
  }

  static async uploadAvatarPhoto(file: File): Promise<{ avatar: string; filename: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/avatar/upload-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  static async deleteAvatarPhoto(): Promise<{ avatar: string }> {
    const response = await api.delete('/avatar/photo');
    return response.data;
  }

  // Settings export/import
  static async exportSettings(): Promise<Blob> {
    const preferences = await this.getPreferences();
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      preferences
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    return blob;
  }

  static async importSettings(file: File): Promise<UserPreferences> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          
          if (importedData.version && importedData.preferences) {
            const updatedPreferences = await this.updatePreferences(importedData.preferences);
            resolve(updatedPreferences);
          } else {
            reject(new Error('Invalid settings file format'));
          }
        } catch (error) {
          reject(new Error('Error parsing settings file'));
        }
      };
      reader.readAsText(file);
    });
  }

  // 2FA management
  static async enable2FA(method: 'sms' | 'email' | 'app'): Promise<{ method: string; backupCodes: string[]; enabled: boolean }> {
    const response = await api.post('/preferences/2fa/enable', { method });
    return response.data;
  }

  static async disable2FA(password: string): Promise<{ enabled: boolean }> {
    const response = await api.post('/preferences/2fa/disable', { password });
    return response.data;
  }

  static async regenerateBackupCodes(): Promise<{ backupCodes: string[] }> {
    const response = await api.post('/preferences/2fa/regenerate-codes');
    return response.data;
  }
}

// Export individual functions for easier use
export const {
  getPreferences,
  updatePreferences,
  updateTheme,
  updateLanguage,
  updateNotifications,
  updatePrivacy,
  resetPreferences,
  changePassword,
  getActiveSessions,
  terminateSession,
  terminateAllSessions,
  updateEmergencyContacts,
  updateCertifications,
  getActivity,
  getAnalytics,
  exportActivity,
  updateAvatarConfiguration,
  uploadAvatarPhoto,
  deleteAvatarPhoto,
  exportSettings,
  importSettings,
  enable2FA,
  disable2FA,
  regenerateBackupCodes
} = SettingsAPI;