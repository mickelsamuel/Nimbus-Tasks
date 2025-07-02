interface TokenData {
  token: string
  expiresAt: number
  refreshToken?: string
  rememberMe: boolean
}

interface StorageKeys {
  ACCESS_TOKEN: string
  REFRESH_TOKEN: string
  TOKEN_EXPIRY: string
  REMEMBER_ME: string
}

const STORAGE_KEYS: StorageKeys = {
  ACCESS_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRY: 'token_expiry',
  REMEMBER_ME: 'remember_me'
}

class TokenStorage {
  private getStorage(persistent: boolean): Storage {
    if (typeof window === 'undefined') {
      // SSR fallback - return a mock storage
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        length: 0,
        key: () => null
      }
    }
    
    return persistent ? localStorage : sessionStorage
  }

  /**
   * Store authentication tokens
   */
  setTokens(tokenData: TokenData): void {
    const storage = this.getStorage(tokenData.rememberMe)
    const fallbackStorage = this.getStorage(!tokenData.rememberMe)
    
    try {
      // Store in the appropriate storage
      storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenData.token)
      storage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, tokenData.expiresAt.toString())
      storage.setItem(STORAGE_KEYS.REMEMBER_ME, tokenData.rememberMe.toString())
      
      if (tokenData.refreshToken) {
        storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refreshToken)
      }
      
      // Clear tokens from the other storage to avoid conflicts
      this.clearTokensFromStorage(fallbackStorage)
      
    } catch (error) {
      console.error('Error storing tokens:', error)
    }
  }

  /**
   * Get the access token
   */
  getAccessToken(): string | null {
    // Check localStorage first (persistent), then sessionStorage
    const persistentToken = this.getStorage(true).getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (persistentToken && this.isTokenValid(true)) {
      return persistentToken
    }

    const sessionToken = this.getStorage(false).getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (sessionToken && this.isTokenValid(false)) {
      return sessionToken
    }

    return null
  }

  /**
   * Get the refresh token
   */
  getRefreshToken(): string | null {
    // Check localStorage first, then sessionStorage
    const persistentToken = this.getStorage(true).getItem(STORAGE_KEYS.REFRESH_TOKEN)
    if (persistentToken) {
      return persistentToken
    }

    return this.getStorage(false).getItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  /**
   * Check if the current token is valid (not expired)
   */
  isTokenValid(persistent?: boolean): boolean {
    try {
      // If persistent is specified, check only that storage
      if (persistent !== undefined) {
        const storage = this.getStorage(persistent)
        const expiryStr = storage.getItem(STORAGE_KEYS.TOKEN_EXPIRY)
        
        if (!expiryStr) return false
        
        const expiry = parseInt(expiryStr, 10)
        return Date.now() < expiry
      }

      // Check both storages
      const persistentExpiry = this.getStorage(true).getItem(STORAGE_KEYS.TOKEN_EXPIRY)
      const sessionExpiry = this.getStorage(false).getItem(STORAGE_KEYS.TOKEN_EXPIRY)

      if (persistentExpiry) {
        const expiry = parseInt(persistentExpiry, 10)
        if (Date.now() < expiry) return true
      }

      if (sessionExpiry) {
        const expiry = parseInt(sessionExpiry, 10)
        if (Date.now() < expiry) return true
      }

      return false
    } catch (error) {
      console.error('Error checking token validity:', error)
      return false
    }
  }

  /**
   * Get time until token expires (in milliseconds)
   */
  getTimeUntilExpiry(): number {
    const persistentExpiry = this.getStorage(true).getItem(STORAGE_KEYS.TOKEN_EXPIRY)
    const sessionExpiry = this.getStorage(false).getItem(STORAGE_KEYS.TOKEN_EXPIRY)

    let expiry: number | null = null

    if (persistentExpiry) {
      expiry = parseInt(persistentExpiry, 10)
    } else if (sessionExpiry) {
      expiry = parseInt(sessionExpiry, 10)
    }

    if (!expiry) return 0

    return Math.max(0, expiry - Date.now())
  }

  /**
   * Check if user chose "remember me"
   */
  getRememberMeStatus(): boolean {
    const persistent = this.getStorage(true).getItem(STORAGE_KEYS.REMEMBER_ME)
    const session = this.getStorage(false).getItem(STORAGE_KEYS.REMEMBER_ME)
    
    return persistent === 'true' || session === 'true'
  }

  /**
   * Update access token (for refresh scenarios)
   */
  updateAccessToken(newToken: string, expiresAt: number): void {
    const rememberMe = this.getRememberMeStatus()
    const storage = this.getStorage(rememberMe)
    
    try {
      storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken)
      storage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiresAt.toString())
    } catch (error) {
      console.error('Error updating access token:', error)
    }
  }

  /**
   * Clear tokens from a specific storage
   */
  private clearTokensFromStorage(storage: Storage): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      storage.removeItem(key)
    })
  }

  /**
   * Clear all authentication tokens
   */
  clearTokens(): void {
    this.clearTokensFromStorage(this.getStorage(true))  // localStorage
    this.clearTokensFromStorage(this.getStorage(false)) // sessionStorage
  }

  /**
   * Get all token data for debugging
   */
  getTokenData(): {
    accessToken: string | null
    refreshToken: string | null
    expiresAt: number | null
    rememberMe: boolean
    isValid: boolean
    timeUntilExpiry: number
  } {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()
    const rememberMe = this.getRememberMeStatus()
    const isValid = this.isTokenValid()
    const timeUntilExpiry = this.getTimeUntilExpiry()

    let expiresAt: number | null = null
    const persistentExpiry = this.getStorage(true).getItem(STORAGE_KEYS.TOKEN_EXPIRY)
    const sessionExpiry = this.getStorage(false).getItem(STORAGE_KEYS.TOKEN_EXPIRY)

    if (persistentExpiry) {
      expiresAt = parseInt(persistentExpiry, 10)
    } else if (sessionExpiry) {
      expiresAt = parseInt(sessionExpiry, 10)
    }

    return {
      accessToken,
      refreshToken,
      expiresAt,
      rememberMe,
      isValid,
      timeUntilExpiry
    }
  }

  /**
   * Migrate legacy token storage
   */
  migrateLegacyStorage(): void {
    try {
      // Check for legacy auth_token in localStorage
      const legacyToken = localStorage.getItem('auth_token')
      
      if (legacyToken && !this.getAccessToken()) {
        // Migrate to new format - assume remember me was true for existing tokens
        const defaultExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        
        this.setTokens({
          token: legacyToken,
          expiresAt: defaultExpiry,
          rememberMe: true
        })
        
        // Remove legacy token
        localStorage.removeItem('auth_token')
        
        console.log('Migrated legacy token storage')
      }
    } catch (error) {
      console.error('Error migrating legacy storage:', error)
    }
  }

  /**
   * Schedule automatic token refresh
   */
  scheduleTokenRefresh(
    refreshCallback: () => Promise<boolean>,
    bufferTimeMs: number = 5 * 60 * 1000 // 5 minutes before expiry
  ): NodeJS.Timeout | null {
    if (typeof window === 'undefined') return null

    const timeUntilExpiry = this.getTimeUntilExpiry()
    const refreshTime = timeUntilExpiry - bufferTimeMs

    if (refreshTime <= 0) {
      // Token expires soon or has expired, refresh immediately
      refreshCallback()
      return null
    }

    return setTimeout(async () => {
      try {
        const success = await refreshCallback()
        if (success) {
          // Schedule next refresh
          this.scheduleTokenRefresh(refreshCallback, bufferTimeMs)
        }
      } catch (error) {
        console.error('Scheduled token refresh failed:', error)
      }
    }, refreshTime)
  }
}

// Export singleton instance
export const tokenStorage = new TokenStorage()

// Utility functions for backward compatibility
export const getAuthToken = () => tokenStorage.getAccessToken()
export const setAuthToken = (token: string, rememberMe: boolean = false, expiresAt?: number) => {
  const defaultExpiry = Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
  tokenStorage.setTokens({
    token,
    expiresAt: expiresAt || defaultExpiry,
    rememberMe
  })
}
export const clearAuthToken = () => tokenStorage.clearTokens()
export const isTokenValid = () => tokenStorage.isTokenValid()

// Initialize migration on import
if (typeof window !== 'undefined') {
  tokenStorage.migrateLegacyStorage()
}