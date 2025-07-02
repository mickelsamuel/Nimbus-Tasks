import React from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Globe, Volume2, VolumeX } from 'lucide-react'
import { ThemeType, LanguageType, AudioContextType } from '../types'

interface ControlsBarProps {
  theme: ThemeType
  language: LanguageType
  audioContext: AudioContextType
  onToggleTheme: () => void
  onToggleLanguage: () => void
  onToggleAudio: () => void
  onPlaySound: (type: 'hover' | 'click') => void
  translations: {
    soundEnabled: string
    soundDisabled: string
  }
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  theme,
  language,
  audioContext,
  onToggleTheme,
  onToggleLanguage,
  onToggleAudio,
  onPlaySound,
  translations
}) => {
  const isDark = theme === 'dark'

  const buttonStyle = `p-3 rounded-xl backdrop-blur-lg transition-all duration-300 ${
    isDark 
      ? 'bg-white/10 hover:bg-white/20 text-white' 
      : 'bg-black/10 hover:bg-black/20 text-gray-900'
  }`

  return (
    <div className="absolute top-4 right-4 z-20 flex gap-2">
      {/* Theme Toggle */}
      <motion.button
        onClick={() => {
          onPlaySound('click')
          onToggleTheme()
        }}
        onMouseEnter={() => onPlaySound('hover')}
        className={buttonStyle}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.button>

      {/* Language Toggle */}
      <motion.button
        onClick={() => {
          onPlaySound('click')
          onToggleLanguage()
        }}
        onMouseEnter={() => onPlaySound('hover')}
        className={`${buttonStyle} flex items-center gap-2`}
        aria-label={`Switch to ${language === 'en' ? 'French' : 'English'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="h-5 w-5" />
        <motion.span 
          className="text-sm font-medium"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.3 }}
          key={language}
        >
          {language === 'en' ? '🇨🇦' : '🇫🇷'}
        </motion.span>
      </motion.button>

      {/* Audio Toggle */}
      <motion.button
        onClick={onToggleAudio}
        onMouseEnter={() => onPlaySound('hover')}
        className={buttonStyle}
        aria-label={audioContext.isEnabled ? translations.soundEnabled : translations.soundDisabled}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {audioContext.isEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </motion.button>
    </div>
  )
}