'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Read initial theme from DOM (set by script in head)
    const initialIsDark = document.documentElement.classList.contains('dark')
    setIsDark(initialIsDark)
  }, [])

  const toggleTheme = () => {
    if (!mounted) return
    
    const newTheme = !isDark
    
    // Update DOM immediately using direct manipulation
    const root = document.documentElement
    const body = document.body
    
    // Force immediate style update without transitions
    root.style.transition = 'none'
    body.style.transition = 'none'
    
    if (newTheme) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    // Force a reflow to ensure styles are applied
    root.offsetHeight
    
    // Update state in the next tick to avoid render conflicts
    requestAnimationFrame(() => {
      setIsDark(newTheme)
      
      // Restore transitions after state update
      setTimeout(() => {
        root.style.transition = ''
        body.style.transition = ''
      }, 10)
    })
  }

  const setTheme = (theme: 'light' | 'dark') => {
    if (!mounted) return
    
    const isDarkTheme = theme === 'dark'
    const root = document.documentElement
    const body = document.body
    
    // Force immediate style update
    root.style.transition = 'none'
    body.style.transition = 'none'
    
    if (isDarkTheme) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    // Force reflow
    root.offsetHeight
    
    // Update state in next tick
    requestAnimationFrame(() => {
      setIsDark(isDarkTheme)
      
      setTimeout(() => {
        root.style.transition = ''
        body.style.transition = ''
      }, 10)
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}