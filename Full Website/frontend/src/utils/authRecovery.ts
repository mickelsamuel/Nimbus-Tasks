// Authentication Recovery Utility

export interface TokenInfo {
  token: string | null;
  isValid: boolean;
  isExpired: boolean;
  payload?: any;
}

export const getTokenInfo = (): TokenInfo => {
  if (typeof window === 'undefined') {
    return { token: null, isValid: false, isExpired: true };
  }

  const token = localStorage.getItem('auth_token') 
    || localStorage.getItem('token') 
    || sessionStorage.getItem('token');

  if (!token) {
    return { token: null, isValid: false, isExpired: true };
  }

  try {
    // Basic JWT validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { token, isValid: false, isExpired: true };
    }

    // Decode payload
    const payload = JSON.parse(atob(parts[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    return {
      token,
      isValid: !isExpired,
      isExpired,
      payload
    };
  } catch (error) {
    console.error('Error validating token:', error);
    return { token, isValid: false, isExpired: true };
  }
};

export const clearAuthTokens = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('sessionId');
  
  console.log('All authentication tokens cleared');
};

export const checkAndRecoverAuth = async (): Promise<boolean> => {
  const tokenInfo = getTokenInfo();
  
  console.log('Token Check:', {
    hasToken: !!tokenInfo.token,
    isValid: tokenInfo.isValid,
    isExpired: tokenInfo.isExpired
  });

  if (!tokenInfo.token || !tokenInfo.isValid) {
    console.warn('Invalid or missing token, clearing auth data');
    clearAuthTokens();
    
    // Redirect to login if not already there
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      console.log('Redirecting to login page');
      window.location.href = '/login';
      return false;
    }
  }

  return tokenInfo.isValid;
};

export const debugAuthState = (): void => {
  const tokenInfo = getTokenInfo();
  
  console.group('🔍 Authentication Debug Info');
  console.log('Token present:', !!tokenInfo.token);
  console.log('Token valid:', tokenInfo.isValid);
  console.log('Token expired:', tokenInfo.isExpired);
  
  if (tokenInfo.token) {
    console.log('Token length:', tokenInfo.token.length);
    console.log('Token preview:', tokenInfo.token.substring(0, 50) + '...');
  }
  
  if (tokenInfo.payload) {
    console.log('Token payload:', tokenInfo.payload);
    console.log('Expires at:', new Date(tokenInfo.payload.exp * 1000));
    console.log('Time until expiry:', Math.max(0, tokenInfo.payload.exp * 1000 - Date.now()) + 'ms');
  }
  
  console.groupEnd();
}; 