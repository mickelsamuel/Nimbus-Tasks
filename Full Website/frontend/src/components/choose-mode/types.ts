export type ModeType = 'website' | 'gamified' | null
export type ThemeType = 'light' | 'dark'
export type LanguageType = 'en' | 'fr'

export interface AudioContextType {
  audioContext: AudioContext | null
  isEnabled: boolean
}

export interface ErrorState {
  hasError: boolean
  message: string
  type: 'connection' | 'timeout' | 'general'
}

export interface ChooseModeState {
  selectedMode: ModeType
  isLoading: boolean
  theme: ThemeType
  language: LanguageType
  audioContext: AudioContextType
  error: ErrorState
  isHydrated: boolean
}