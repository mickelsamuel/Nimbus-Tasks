// Settings API Service Functions
// Handles all API calls for the settings page

import type { 
  UserPreferences, 
  AvatarConfiguration, 
  EmergencyContact, 
  Certification 
} from '@/lib/api/settings';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function for API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Preferences API calls
export const preferencesApi = {
  // Get all user preferences
  getPreferences: async () => {
    return apiRequest('/preferences');
  },

  // Update all preferences
  updatePreferences: async (preferences: Partial<UserPreferences>) => {
    return apiRequest('/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },

  // Update theme only
  updateTheme: async (theme: string) => {
    return apiRequest('/preferences/theme', {
      method: 'PUT',
      body: JSON.stringify({ theme }),
    });
  },

  // Update language only
  updateLanguage: async (language: string) => {
    return apiRequest('/preferences/language', {
      method: 'PUT',
      body: JSON.stringify({ language }),
    });
  },

  // Update notification preferences
  updateNotifications: async (notifications: Partial<UserPreferences['notifications']>) => {
    return apiRequest('/preferences/notifications', {
      method: 'PUT',
      body: JSON.stringify(notifications),
    });
  },

  // Update privacy preferences
  updatePrivacy: async (privacy: Partial<UserPreferences['privacy']>) => {
    return apiRequest('/preferences/privacy', {
      method: 'PUT',
      body: JSON.stringify(privacy),
    });
  },

  // Reset preferences to default
  resetPreferences: async () => {
    return apiRequest('/preferences/reset', {
      method: 'POST',
    });
  },
};

// User Profile API calls
export const profileApi = {
  // Get user profile
  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  // Update user profile
  updateProfile: async (profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    department?: string;
    position?: string;
    bio?: string;
    emergencyContacts?: EmergencyContact[];
    certifications?: Certification[];
  }) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Update password
  updatePassword: async (passwordData: { currentPassword: string; newPassword: string }) => {
    return apiRequest('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Update avatar configuration
  updateAvatar: async (avatarConfig: Partial<AvatarConfiguration>) => {
    return apiRequest('/users/avatar', {
      method: 'PUT',
      body: JSON.stringify(avatarConfig),
    });
  },

  // Upload profile photo
  uploadPhoto: async (formData: FormData) => {
    const token = getAuthToken();
    
    const response = await fetch(`${API_BASE}/users/upload-photo`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || `Upload failed`);
    }

    return response.json();
  },
};

// Security API calls
export const securityApi = {
  // Get active sessions
  getSessions: async () => {
    return apiRequest('/users/sessions');
  },

  // Logout specific session
  logoutSession: async (sessionId: string) => {
    return apiRequest(`/users/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  // Logout all sessions
  logoutAllSessions: async () => {
    return apiRequest('/users/sessions', {
      method: 'DELETE',
    });
  },

  // Toggle 2FA
  toggle2FA: async (enabled: boolean) => {
    return apiRequest('/users/2fa', {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    });
  },

  // Get backup codes
  getBackupCodes: async () => {
    return apiRequest('/users/backup-codes');
  },
};

// Analytics API calls
export const analyticsApi = {
  // Get user analytics
  getAnalytics: async (timeframe?: string) => {
    const params = timeframe ? `?timeframe=${timeframe}` : '';
    return apiRequest(`/users/analytics${params}`);
  },

  // Get learning progress
  getLearningProgress: async () => {
    return apiRequest('/users/progress');
  },

  // Get activity log
  getActivityLog: async (filters?: {
    timeframe?: 'day' | 'week' | 'month' | 'year';
    activityTypes?: string[];
    limit?: number;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/users/activity${query}`);
  },

  // Export analytics data
  exportAnalytics: async (format: string = 'json') => {
    return apiRequest(`/users/analytics/export?format=${format}`);
  },
};

// Settings export/import
export const settingsDataApi = {
  // Export all settings
  exportSettings: async () => {
    return apiRequest('/users/export-settings');
  },

  // Import settings
  importSettings: async (settingsData: {
    version: string;
    timestamp: string;
    preferences: Partial<UserPreferences>;
  }) => {
    return apiRequest('/users/import-settings', {
      method: 'POST',
      body: JSON.stringify(settingsData),
    });
  },
};

// Notification delivery API
export const notificationApi = {
  // Test notification delivery
  testNotification: async (type: string) => {
    return apiRequest('/notifications/test', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  },

  // Get notification history
  getNotificationHistory: async () => {
    return apiRequest('/notifications/history');
  },
};