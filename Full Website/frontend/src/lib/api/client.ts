// API Client Configuration
import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance with default configuration
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
});

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config) => {
    // Only access browser storage if window is defined (client-side)
    if (typeof window !== 'undefined') {
      // Get token from localStorage or session storage
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add session ID if available (for session management)
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        config.headers['X-Session-ID'] = sessionId;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses and errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the response as-is without modifying the data structure
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Handle cancelled requests gracefully
    if (axios.isCancel(error) || error.code === 'ERR_CANCELED' || error.message === 'canceled') {
      console.log('Request was cancelled - this is normal during navigation or component unmounting');
      return Promise.reject({ 
        name: 'AbortError', 
        code: 'ERR_CANCELED', 
        message: 'canceled',
        type: 'cancelled'
      });
    }
    
    // Handle common error responses
    if (error.response) {
      const { status, data } = error.response;
      
      // Auto-retry for specific error codes
      if (shouldRetry(status, originalRequest, error)) {
        return retryRequest(originalRequest);
      }
      
      switch (status) {
        case 401:
          // Unauthorized - remove token and redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            localStorage.removeItem('sessionId');
            
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
          break;
          
        case 403:
          // Forbidden
          console.error('Access forbidden:', data);
          break;
          
        case 429:
          // Rate limited
          console.error('Rate limit exceeded:', data);
          break;
          
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          console.error('Server error:', data);
          await reportError({
            type: 'server_error',
            status,
            message: (data as { message?: string })?.message || 'Server error',
            url: originalRequest?.url,
            method: originalRequest?.method
          });
          break;
          
        default:
          console.error('API Error:', data);
      }
      
      // Return a formatted error
      const formattedError = {
        status,
        message: (data as { message?: string })?.message || 'An error occurred',
        errors: (data as { errors?: Array<unknown> })?.errors || [],
        originalError: error,
        type: getErrorType(status)
      };
      return Promise.reject(formattedError);
    }
    
    // Network error
    if (error.request) {
      // Check if this is a cancelled request first
      if (axios.isCancel(error) || error.code === 'ERR_CANCELED' || error.message === 'canceled') {
        console.log('Network request was cancelled - this is normal during navigation or component unmounting');
        return Promise.reject({ 
          name: 'AbortError', 
          code: 'ERR_CANCELED', 
          message: 'canceled',
          type: 'cancelled'
        });
      }
      
      console.error('Network error:', error.request);
      
      // Report network errors
      await reportError({
        type: 'network_error',
        message: 'Network error - please check your connection',
        url: originalRequest?.url,
        method: originalRequest?.method
      });
      
      return Promise.reject({
        message: 'Network error - please check your connection',
        originalError: error,
        type: 'network'
      });
    }
    
    // Request setup error
    if (axios.isCancel(error) || error.code === 'ERR_CANCELED' || error.message === 'canceled') {
      console.log('Request setup was cancelled - this is normal during navigation or component unmounting');
      return Promise.reject({ 
        name: 'AbortError', 
        code: 'ERR_CANCELED', 
        message: 'canceled',
        type: 'cancelled'
      });
    }
    
    console.error('Request error:', error.message);
    return Promise.reject({
      message: error.message,
      originalError: error,
      type: 'request'
    });
  }
);

// Retry configuration and utilities
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface RetryableRequest extends AxiosRequestConfig {
  _retryCount?: number;
}

// Check if request should be retried
function shouldRetry(status: number, config?: RetryableRequest, error?: AxiosError): boolean {
  if (!config) return false;
  
  // Don't retry cancelled requests
  if (error && (axios.isCancel(error) || error.code === 'ERR_CANCELED' || error.message === 'canceled')) {
    return false;
  }
  
  // Don't retry if max retries reached
  if ((config._retryCount || 0) >= MAX_RETRIES) return false;
  
  // Retry for specific status codes
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  return retryableStatuses.includes(status);
}

// Retry a failed request
async function retryRequest(config?: RetryableRequest): Promise<AxiosResponse> {
  if (!config) throw new Error('No config provided for retry');
  
  config._retryCount = (config._retryCount || 0) + 1;
  
  // Calculate delay with exponential backoff
  const delay = RETRY_DELAY * Math.pow(2, config._retryCount - 1);
  
  // Wait before retrying
  await new Promise(resolve => setTimeout(resolve, delay));
  
  try {
    return api.request(config);
  } catch (retryError: any) {
    // If retry fails with cancellation, don't throw error logs
    if (axios.isCancel(retryError) || retryError.code === 'ERR_CANCELED' || retryError.message === 'canceled') {
      return Promise.reject({ 
        name: 'AbortError', 
        code: 'ERR_CANCELED', 
        message: 'canceled',
        type: 'cancelled'
      });
    }
    throw retryError;
  }
}

// Get error type based on status code
function getErrorType(status: number): string {
  if (status >= 500) return 'server';
  if (status === 429) return 'rate_limit';
  if (status === 404) return 'not_found';
  if (status === 403) return 'forbidden';
  if (status === 401) return 'unauthorized';
  if (status >= 400) return 'client';
  return 'unknown';
}

// Report errors to backend
async function reportError(errorData: {
  type: string;
  status?: number;
  message: string;
  url?: string;
  method?: string;
}): Promise<void> {
  try {
    // Only report errors in production or staging
    if (process.env.NODE_ENV === 'development') return;
    
    // Avoid infinite loops by not reporting errors from the error endpoint
    if (errorData.url?.includes('/api/errors/')) return;
    
    await api.post('/errors/report', {
      ...errorData,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      currentUrl: typeof window !== 'undefined' ? window.location.href : undefined
    });
  } catch (reportError) {
    // Silently fail error reporting to avoid recursive errors
    console.error('Failed to report error:', reportError);
  }
}

// Utility functions for common API operations
export const apiUtils = {
  // Set authentication token
  setAuthToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Remove authentication token
  removeAuthToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
    delete api.defaults.headers.common['Authorization'];
  },

  // Set session ID
  setSessionId: (sessionId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionId', sessionId);
    }
    api.defaults.headers.common['X-Session-ID'] = sessionId;
  },

  // Remove session ID
  removeSessionId: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sessionId');
    }
    delete api.defaults.headers.common['X-Session-ID'];
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    return !!(localStorage.getItem('auth_token') || localStorage.getItem('token') || sessionStorage.getItem('token'));
  },

  // Format error message for display
  formatError: (error: { errors?: Array<{ msg?: string; message?: string }>; message?: string }): string => {
    if (error.errors && error.errors.length > 0) {
      return error.errors.map((err: { msg?: string; message?: string }) => err.msg || err.message).join(', ');
    }
    return error.message || 'An unexpected error occurred';
  },

  // Download file from blob response
  downloadFile: (blob: Blob, filename: string) => {
    if (typeof window === 'undefined') {
      console.warn('downloadFile called on server side - skipping');
      return;
    }
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
};

// Type definitions for common API responses
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
  };
}

// Export the configured API instance as default
export default api;

// Export with alternative names for backward compatibility
export const client = api;
export const apiClient = api;