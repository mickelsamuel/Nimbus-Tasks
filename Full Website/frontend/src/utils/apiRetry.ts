interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  exponentialBackoff?: boolean
  retryCondition?: (error: any) => boolean
  onRetry?: (error: any, attempt: number) => void
  abortSignal?: AbortSignal
}

interface RetryableError extends Error {
  status?: number
  response?: any
  isRetryable?: boolean
}

// Default retry configuration
const DEFAULT_RETRY_OPTIONS: Required<Omit<RetryOptions, 'onRetry' | 'abortSignal'>> = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  exponentialBackoff: true,
  retryCondition: (error: RetryableError) => {
    // Retry on network errors or 5xx status codes
    if (!error.status) return true // Network error
    return error.status >= 500 && error.status < 600
  }
}

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(
  attempt: number, 
  baseDelay: number, 
  maxDelay: number, 
  exponentialBackoff: boolean
): number {
  let delay = exponentialBackoff 
    ? Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
    : baseDelay

  // Add jitter (random factor) to prevent thundering herd
  const jitter = delay * 0.1 * Math.random()
  delay += jitter

  return Math.min(delay, maxDelay)
}

/**
 * Enhanced fetch with retry mechanism
 */
export async function fetchWithRetry(
  url: string, 
  fetchOptions: RequestInit = {}, 
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const options = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions }
  let lastError: RetryableError | null = null

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      // Check if request was aborted
      if (options.abortSignal?.aborted) {
        throw new Error('Request aborted')
      }

      const response = await fetch(url, {
        ...fetchOptions,
        signal: options.abortSignal
      })

      // If response is successful, return it
      if (response.ok) {
        return response
      }

      // Create error for failed response
      const error: RetryableError = new Error(`HTTP ${response.status}: ${response.statusText}`)
      error.status = response.status
      error.response = response

      // Check if this error should trigger a retry
      if (!options.retryCondition(error) || attempt === options.maxRetries) {
        throw error
      }

      lastError = error
    } catch (error: any) {
      // Handle network errors or other exceptions
      const retryableError: RetryableError = error instanceof Error 
        ? error 
        : new Error('Unknown error occurred')

      // Don't retry on abort signals
      if (error.name === 'AbortError' || options.abortSignal?.aborted) {
        throw retryableError
      }

      // Check if this error should trigger a retry
      if (!options.retryCondition(retryableError) || attempt === options.maxRetries) {
        throw retryableError
      }

      lastError = retryableError
    }

    // If we reach here, we need to retry
    if (attempt < options.maxRetries) {
      const delay = calculateDelay(
        attempt, 
        options.baseDelay, 
        options.maxDelay, 
        options.exponentialBackoff
      )

      // Call retry callback if provided
      if (options.onRetry && lastError) {
        options.onRetry(lastError, attempt + 1)
      }

      // Wait before retrying
      await sleep(delay)
    }
  }

  // This should never be reached, but included for type safety
  throw lastError || new Error('Max retries exceeded')
}

/**
 * Wrapper for common API calls with built-in retry logic
 */
export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>
  private defaultRetryOptions: RetryOptions

  constructor(
    baseUrl: string = '', 
    defaultHeaders: Record<string, string> = {},
    defaultRetryOptions: RetryOptions = {}
  ) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders
    }
    this.defaultRetryOptions = defaultRetryOptions
  }

  private getFullUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint
    }
    return `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  }

  private async makeRequest(
    method: string,
    endpoint: string,
    data?: any,
    options: RequestInit = {},
    retryOptions: RetryOptions = {}
  ): Promise<any> {
    const url = this.getFullUrl(endpoint)
    
    const fetchOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      },
      ...options
    }

    if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      fetchOptions.body = JSON.stringify(data)
    }

    const mergedRetryOptions = {
      ...this.defaultRetryOptions,
      ...retryOptions,
      onRetry: (error: any, attempt: number) => {
        console.warn(`API retry attempt ${attempt} for ${method} ${url}:`, error.message)
        retryOptions.onRetry?.(error, attempt)
      }
    }

    const response = await fetchWithRetry(url, fetchOptions, mergedRetryOptions)
    
    // Handle different content types
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return await response.json()
    } else if (contentType?.includes('text/')) {
      return await response.text()
    } else {
      return await response.blob()
    }
  }

  async get(endpoint: string, options?: RequestInit, retryOptions?: RetryOptions) {
    return this.makeRequest('GET', endpoint, undefined, options, retryOptions)
  }

  async post(endpoint: string, data?: any, options?: RequestInit, retryOptions?: RetryOptions) {
    return this.makeRequest('POST', endpoint, data, options, retryOptions)
  }

  async put(endpoint: string, data?: any, options?: RequestInit, retryOptions?: RetryOptions) {
    return this.makeRequest('PUT', endpoint, data, options, retryOptions)
  }

  async patch(endpoint: string, data?: any, options?: RequestInit, retryOptions?: RetryOptions) {
    return this.makeRequest('PATCH', endpoint, data, options, retryOptions)
  }

  async delete(endpoint: string, options?: RequestInit, retryOptions?: RetryOptions) {
    return this.makeRequest('DELETE', endpoint, undefined, options, retryOptions)
  }

  // Upload file with retry
  async upload(
    endpoint: string, 
    file: File | FormData, 
    options?: RequestInit, 
    retryOptions?: RetryOptions
  ) {
    const formData = file instanceof FormData ? file : (() => {
      const fd = new FormData()
      fd.append('file', file)
      return fd
    })()

    const uploadOptions: RequestInit = {
      ...options,
      body: formData,
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
        ...options?.headers
      }
    }

    // Remove Content-Type if it was set in default headers
    if (uploadOptions.headers && 'Content-Type' in this.defaultHeaders) {
      const headers = { ...uploadOptions.headers }
      delete (headers as any)['Content-Type']
      uploadOptions.headers = headers
    }

    return this.makeRequest('POST', endpoint, undefined, uploadOptions, retryOptions)
  }
}

/**
 * Default API client instance
 */
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  {},
  {
    maxRetries: 3,
    baseDelay: 1000,
    exponentialBackoff: true,
    retryCondition: (error: RetryableError) => {
      // Retry on network errors or specific 5xx codes
      if (!error.status) return true
      return [500, 502, 503, 504].includes(error.status)
    }
  }
)

/**
 * React hook for API calls with retry and loading states
 */
export function useApiCall<T = any>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options: {
      onSuccess?: (data: T) => void
      onError?: (error: Error) => void
      retryOptions?: RetryOptions
    } = {}
  ) => {
    setLoading(true)
    setError(null)

    try {
      const result = await apiCall()
      setData(result)
      options.onSuccess?.(result)
      return result
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error('API call failed')
      setError(error)
      options.onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return { loading, error, data, execute, reset }
}

/**
 * Higher-order function to wrap any async function with retry logic
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  retryOptions: RetryOptions = {}
): T {
  return (async (...args: Parameters<T>) => {
    const options = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions }
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
      try {
        return await fn(...args)
      } catch (error: any) {
        const retryableError = error instanceof Error ? error : new Error('Unknown error')
        
        if (!options.retryCondition(retryableError) || attempt === options.maxRetries) {
          throw retryableError
        }

        lastError = retryableError

        if (attempt < options.maxRetries) {
          const delay = calculateDelay(
            attempt,
            options.baseDelay,
            options.maxDelay,
            options.exponentialBackoff
          )

          options.onRetry?.(retryableError, attempt + 1)
          await sleep(delay)
        }
      }
    }

    throw lastError || new Error('Max retries exceeded')
  }) as T
}

// Import useState and useCallback for the hook
import { useState, useCallback } from 'react'