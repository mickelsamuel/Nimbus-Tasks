'use client'

import { Language, getTranslation } from '../simpleTranslations'

export function useSimpleTranslations() {
  const language: Language = 'en'
  const isLoaded = true

  const changeLanguage = () => {
    // Do nothing - translation is disabled
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    return getTranslation(language, key, params)
  }

  return {
    language,
    changeLanguage,
    t,
    isLoaded
  }
}