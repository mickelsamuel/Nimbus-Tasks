import { useTheme } from '@/contexts/ThemeContext'
import { ThemeType, LanguageType } from '../types'

export const useThemeAndLanguage = () => {
  const { isDark, toggleTheme: contextToggleTheme } = useTheme()
  const language: LanguageType = 'en'

  // Convert context theme to local format
  const theme: ThemeType = isDark ? 'dark' : 'light'

  const toggleTheme = () => {
    contextToggleTheme()
  }

  const toggleLanguage = () => {
    // Do nothing - language toggle is disabled
  }

  return {
    theme,
    language,
    toggleTheme,
    toggleLanguage
  }
}