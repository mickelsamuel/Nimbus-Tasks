'use client'

import { LanguageType, getLayoutTranslations, translateWithParams } from '../translations'

export function useLayoutTranslations() {
  const language: LanguageType = 'en'
  const translations = getLayoutTranslations()
  const isLoaded = true

  const changeLanguage = () => {
    // Do nothing - translation is disabled
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    try {
      const keys = key.split('.')
      let value: unknown = translations
      
      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k]
      }
      
      if (typeof value !== 'string') {
        const fallback = key.split('.').pop() || key
        return fallback.charAt(0).toUpperCase() + fallback.slice(1)
      }
      
      if (params) {
        return translateWithParams(value, params)
      }
      
      return value
    } catch (error) {
      console.error(`Error translating key "${key}":`, error)
      return key
    }
  }

  return {
    language,
    translations,
    changeLanguage,
    t,
    isLoaded
  }
}