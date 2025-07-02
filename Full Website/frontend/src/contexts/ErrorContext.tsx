'use client'

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'

interface ErrorState {
  errors: Record<string, string>
  isLoading: Record<string, boolean>
  retryCallbacks: Record<string, () => void>
}

type ErrorAction =
  | { type: 'SET_ERROR'; key: string; error: string }
  | { type: 'CLEAR_ERROR'; key: string }
  | { type: 'CLEAR_ALL_ERRORS' }
  | { type: 'SET_LOADING'; key: string; loading: boolean }
  | { type: 'SET_RETRY_CALLBACK'; key: string; callback: () => void }

const initialState: ErrorState = {
  errors: {},
  isLoading: {},
  retryCallbacks: {}
}

const errorReducer = (state: ErrorState, action: ErrorAction): ErrorState => {
  switch (action.type) {
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.key]: action.error },
        isLoading: { ...state.isLoading, [action.key]: false }
      }
    case 'CLEAR_ERROR':
      const { [action.key]: removedError, ...remainingErrors } = state.errors
      const { [action.key]: removedLoading, ...remainingLoading } = state.isLoading
      const { [action.key]: removedCallback, ...remainingCallbacks } = state.retryCallbacks
      return {
        errors: remainingErrors,
        isLoading: remainingLoading,
        retryCallbacks: remainingCallbacks
      }
    case 'CLEAR_ALL_ERRORS':
      return initialState
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: { ...state.isLoading, [action.key]: action.loading }
      }
    case 'SET_RETRY_CALLBACK':
      return {
        ...state,
        retryCallbacks: { ...state.retryCallbacks, [action.key]: action.callback }
      }
    default:
      return state
  }
}

interface ErrorContextType {
  errors: Record<string, string>
  isLoading: Record<string, boolean>
  setError: (key: string, error: string) => void
  clearError: (key: string) => void
  clearAllErrors: () => void
  setLoading: (key: string, loading: boolean) => void
  setRetryCallback: (key: string, callback: () => void) => void
  getError: (key: string) => string | undefined
  isLoadingKey: (key: string) => boolean
  retry: (key: string) => void
  withErrorHandling: <T extends any[], R>(
    key: string,
    fn: (...args: T) => Promise<R>
  ) => (...args: T) => Promise<R | undefined>
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

interface ErrorProviderProps {
  children: ReactNode
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState)

  const setError = useCallback((key: string, error: string) => {
    dispatch({ type: 'SET_ERROR', key, error })
  }, [])

  const clearError = useCallback((key: string) => {
    dispatch({ type: 'CLEAR_ERROR', key })
  }, [])

  const clearAllErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_ERRORS' })
  }, [])

  const setLoading = useCallback((key: string, loading: boolean) => {
    dispatch({ type: 'SET_LOADING', key, loading })
  }, [])

  const setRetryCallback = useCallback((key: string, callback: () => void) => {
    dispatch({ type: 'SET_RETRY_CALLBACK', key, callback })
  }, [])

  const getError = useCallback((key: string) => {
    return state.errors[key]
  }, [state.errors])

  const isLoadingKey = useCallback((key: string) => {
    return state.isLoading[key] || false
  }, [state.isLoading])

  const retry = useCallback((key: string) => {
    const callback = state.retryCallbacks[key]
    if (callback) {
      clearError(key)
      callback()
    }
  }, [state.retryCallbacks, clearError])

  const withErrorHandling = useCallback(<T extends any[], R>(
    key: string,
    fn: (...args: T) => Promise<R>
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      try {
        setLoading(key, true)
        clearError(key)
        const result = await fn(...args)
        setLoading(key, false)
        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred'
        setError(key, errorMessage)
        setRetryCallback(key, () => fn(...args))
        throw error
      }
    }
  }, [setLoading, clearError, setError, setRetryCallback])

  const value: ErrorContextType = {
    errors: state.errors,
    isLoading: state.isLoading,
    setError,
    clearError,
    clearAllErrors,
    setLoading,
    setRetryCallback,
    getError,
    isLoadingKey,
    retry,
    withErrorHandling
  }

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  )
}

export const useErrorContext = (): ErrorContextType => {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useErrorContext must be used within an ErrorProvider')
  }
  return context
}

export default ErrorProvider