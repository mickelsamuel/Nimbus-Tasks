'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useAvatarOnboardingContext } from '@/components/avatar/AvatarOnboardingProvider'

// Import modular components
import Logo from './header/Logo'
import StatusIndicators from './header/StatusIndicators'
import SearchBar from './header/SearchBar'
import WalletDisplay from './header/WalletDisplay'
import LanguageToggle from './header/LanguageToggle'
import ThemeToggle from './header/ThemeToggle'
import NotificationsDropdown from './header/NotificationsDropdown'
import UserProfileDropdown from './header/UserProfileDropdown'
import CurrencyHistoryModal from './header/CurrencyHistoryModal'
import QuickActionsBar from './header/QuickActionsBar'
import ProgressBar from './header/ProgressBar'
import { useCurrentPage } from './hooks/useCurrentPage'
import { useTheme } from '@/contexts/ThemeContext'

interface HeaderProps {
  user?: {
    id: number
    firstName: string
    lastName: string
    role: string
    department: string
    avatar: string
    avatar2D?: string
    avatar3D?: string
    avatarPortrait?: string
    stats: {
      level: number
      coins: number
      tokens: number
    }
  }
  hasSidebar?: boolean
}

export default function Header({ user: propUser }: HeaderProps) {
  const { logout, user: authUser } = useAuth()
  const { shouldShowOnboarding, openOnboarding } = useAvatarOnboardingContext()
  const { currentPageKey } = useCurrentPage()
  const { isDark, toggleTheme: contextToggleTheme, setTheme } = useTheme()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{
    type: string
    title: string
    description: string
    path: string
    score: number
    id?: string
  }>>([])
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isOnline] = useState(true)
  const [isSyncing] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  
  // Scroll-based animations
  const { scrollY } = useScroll()
  const headerBlur = useTransform(scrollY, [0, 50], [20, 30])
  const headerShadow = useTransform(scrollY, [0, 50], [0, 0.15])
  
  // Get current page name from pathname
  const currentPage = currentPageKey === 'dashboard' ? 'Dashboard' : 
                      currentPageKey === 'modules' ? 'Modules' :
                      currentPageKey === 'simulation' ? 'Simulation' :
                      currentPageKey === 'career' ? 'Career Map' :
                      currentPageKey === 'friends-teams' ? 'Friends & Teams' :
                      currentPageKey === 'events' ? 'Events' :
                      currentPageKey === 'leaderboards' ? 'Leaderboards' :
                      currentPageKey === 'timeline' ? 'Timeline' :
                      currentPageKey === 'achievements' ? 'Achievements' :
                      currentPageKey === 'profile' ? 'Profile' :
                      currentPageKey === 'avatar' ? 'Avatar' :
                      currentPageKey === 'shop' ? 'Shop' :
                      currentPageKey === 'chat' ? 'Chat' :
                      currentPageKey === 'admin' ? 'Admin Panel' :
                      currentPageKey === 'settings' ? 'Settings' :
                      currentPageKey === 'manager' ? 'Manager Dashboard' :
                      currentPageKey === 'spaces' ? 'Virtual Spaces' :
                      currentPageKey === 'innovation-lab' ? 'Innovation Lab' :
                      currentPageKey === 'help' ? 'Help & Support' :
                      currentPageKey === 'policy' ? 'Privacy Policy' :
                      currentPageKey === 'choose-mode' ? 'Choose Mode' :
                      'Dashboard'

  // Currency state
  const [currency, setCurrency] = useState({
    coins: 0,
    tokens: 0,
    level: 0
  })

  // Use authenticated user data, then prop user
  const currentUser = authUser || propUser

  // Fetch currency balance from API
  const fetchCurrencyBalance = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        // If no token, keep empty values
        setCurrency({
          coins: 0,
          tokens: 0,
          level: 1
        })
        return
      }

      const response = await fetch(`${API_BASE}/currency/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCurrency(data.data)
      } else {
        // Keep zero values if API fails
        setCurrency({
          coins: 0,
          tokens: 0,
          level: 1
        })
      }
    } catch (error) {
      console.warn('Currency balance API not available')
      // Keep zero values if API fails
      setCurrency({
        coins: 0,
        tokens: 0,
        level: 1
      })
    }
  }

  // Show currency history modal
  const [showCurrencyHistory, setShowCurrencyHistory] = useState(false)
  const [currencyTransactions, setCurrencyTransactions] = useState<{
    type: 'earn' | 'spend' | 'transfer_in' | 'transfer_out'
    coins: number
    tokens: number
    reason: string
    timestamp: Date
  }[]>([])
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  // Fetch currency transaction history
  const fetchCurrencyHistory = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        // Show mock data if no token
        setCurrencyTransactions([
          {
            type: 'earn' as const,
            coins: 150,
            tokens: 5,
            reason: 'Completed Banking Fundamentals module',
            timestamp: new Date(Date.now() - 30 * 60 * 1000)
          },
          {
            type: 'spend' as const,
            coins: 100,
            tokens: 0,
            reason: 'Purchased Professional Avatar',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          {
            type: 'earn' as const,
            coins: 200,
            tokens: 8,
            reason: 'Achievement: Quick Learner',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        ])
        setTimeout(() => setShowCurrencyHistory(true), 0)
        return
      }

      const response = await fetch(`${API_BASE}/currency/transactions?limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCurrencyTransactions(data.data.transactions)
        setTimeout(() => setShowCurrencyHistory(true), 0)
      }
    } catch (error) {
      console.error('Error fetching currency history:', error)
      // Keep empty history on error
      setCurrencyTransactions([])
      setTimeout(() => setShowCurrencyHistory(true), 0)
    }
  }

  // Load user preferences
  const loadUserPreferences = useCallback(async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        console.log('No auth token, skipping preferences load')
        return
      }

      const response = await fetch(`${API_BASE}/preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const preferences = data.data
        
        // Apply theme preference
        if (preferences.theme) {
          setTheme(preferences.theme)
        }
        
        // Language preference is now handled by useLayoutTranslations hook
      }
    } catch (error) {
      console.error('Error loading user preferences:', error)
    }
  }, [setTheme])

  // Listen for avatar updates - let the UserAvatar component handle this
  // No need to reload the entire page, React state management will handle it

  // Fetch currency balance on component mount
  useEffect(() => {
    fetchCurrencyBalance()
    loadUserPreferences()
    
    // Set up periodic refresh
    const interval = setInterval(fetchCurrencyBalance, 60000) // Refresh every minute
    
    return () => clearInterval(interval)
  }, [loadUserPreferences])

  // Real notifications state
  const [notifications, setNotifications] = useState<{
    _id: string
    type: string
    title: string
    message: string
    createdAt: Date
    timeAgo: string
    isRead: boolean
  }[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        // No token, keep empty notifications
        setNotifications([])
        setUnreadCount(0)
        return
      }

      const response = await fetch(`${API_BASE}/notifications?limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.data.notifications)
        setUnreadCount(data.data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      // Keep empty notifications on error
      setNotifications([])
      setUnreadCount(0)
    }
  }

  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Update local state
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications()
    
    // Set up periodic refresh
    const interval = setInterval(fetchNotifications, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  // Search functionality
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setSearchSuggestions([])
      setShowSearchResults(false)
      return
    }

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('auth_token')
      
      if (token) {
        const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=10`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setSearchResults(data.data.results)
          setSearchSuggestions(data.data.suggestions || [])
          setShowSearchResults(true)
          return
        }
      }
      
      // If no token or API fails, use mock results
      throw new Error('Search API not available')
    } catch (error) {
      console.warn('Search API not available')
      // Keep empty results on error
      setSearchResults([])
      setSearchSuggestions([])
      setShowSearchResults(false)
    }
  }

  // Handle search input changes with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])



  // Theme toggle with persistence
  const toggleTheme = useCallback(async () => {
    const newTheme = isDark ? 'light' : 'dark'
    contextToggleTheme()
    
    // Persist theme preference to backend
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const token = localStorage.getItem('auth_token')
      
      if (token) {
        const response = await fetch(`${API_BASE}/preferences/theme`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ theme: newTheme })
        })
        
        if (!response.ok) {
          console.warn('Failed to save theme preference to server')
        }
      }
    } catch (error) {
      console.warn('Error saving theme preference:', error)
    }
  }, [isDark, contextToggleTheme])

  // Language toggle with persistence
  const toggleLanguage = useCallback(async () => {
    // Language switching is disabled
  }, [])

  // Keyboard shortcuts and focus management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global search shortcut
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('global-search')?.focus()
      }
      
      // Escape key handling
      if (e.key === 'Escape') {
        if (isNotificationsOpen) {
          setIsNotificationsOpen(false)
        }
        if (isProfileOpen) {
          setIsProfileOpen(false)
        }
        if (searchFocused) {
          document.getElementById('global-search')?.blur()
        }
        if (showSearchResults) {
          setShowSearchResults(false)
        }
      }
      
      // Theme toggle shortcut (Ctrl/Cmd + Shift + T)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        toggleTheme()
      }
      
      // Language toggle shortcut (Ctrl/Cmd + Shift + L)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault()
        toggleLanguage()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isNotificationsOpen, isProfileOpen, searchFocused, showSearchResults, toggleLanguage, toggleTheme])

  // Fix the search click endpoint path (use /api/search/track-click instead of /api/search/click)
  const handleSearchResultClick = async (result: { type: string; title: string; path: string; description?: string; id?: string }) => {
    try {
      // Log search result click
      await fetch('/api/search/track-click', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          resultType: result.type,
          resultId: result.id || result.title,
          resultUrl: result.path
        })
      })
    } catch (error) {
      console.error('Error logging search click:', error)
    }

    // Navigate to the result
    window.location.href = result.path
    setShowSearchResults(false)
    setSearchQuery('')
  }

  return (
    <>
      <motion.header 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[100] h-[72px]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Enhanced Glassmorphism Background with dynamic blur */}
        <motion.div 
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${headerBlur}px) saturate(200%)`,
          }}
        >
          {/* Animated gradient background */}
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: isDark 
                ? [
                    'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.85) 50%, rgba(15,23,42,0.85) 100%)',
                    'linear-gradient(135deg, rgba(30,41,59,0.85) 0%, rgba(15,23,42,0.85) 50%, rgba(30,41,59,0.85) 100%)',
                    'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.85) 50%, rgba(15,23,42,0.85) 100%)'
                  ]
                : [
                    'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 50%, rgba(255,255,255,0.9) 100%)',
                    'linear-gradient(135deg, rgba(248,250,252,0.9) 0%, rgba(255,255,255,0.9) 50%, rgba(248,250,252,0.9) 100%)',
                    'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 50%, rgba(255,255,255,0.9) 100%)'
                  ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Animated border */}
          <motion.div 
            className="absolute inset-x-0 bottom-0 h-px"
            style={{
              background: `linear-gradient(90deg, 
                transparent, 
                ${isDark ? 'rgba(224,26,26,0.6)' : 'rgba(224,26,26,0.4)'}, 
                ${isDark ? 'rgba(255,215,0,0.6)' : 'rgba(255,215,0,0.4)'}, 
                transparent
              )`
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02]" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E01A1A' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          {/* Dynamic shadow based on scroll */}
          <motion.div 
            className="absolute inset-x-0 -bottom-4 h-4"
            style={{
              opacity: headerShadow,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)'
            }}
          />
        </motion.div>

        {/* Header Content */}
        <div className="relative z-10 flex h-full w-full items-center px-4 sm:px-6 lg:px-8">
          
          {/* Left Section with stagger animation */}
          <motion.div 
            className="flex items-center gap-3 min-w-0 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Logo />
            <StatusIndicators 
              isOnline={isOnline}
              isSyncing={isSyncing}
              currentPage={currentPage}
            />
          </motion.div>

          {/* Center Section - Enhanced Search */}
          <motion.div 
            className="flex-1 flex justify-center px-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className={`
                w-full rounded-2xl backdrop-blur-xl transition-all duration-500
                ${searchFocused 
                  ? 'scale-105 shadow-2xl shadow-primary-500/20' 
                  : 'scale-100 hover:scale-[1.02]'
                }
              `}
              whileHover={{ scale: searchFocused ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`
                relative overflow-hidden rounded-2xl p-[2px]
                ${searchFocused 
                  ? 'bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400' 
                  : 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600'
                }
              `}>
                <div className="relative rounded-[14px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
                  <SearchBar
                    searchQuery={searchQuery}
                    searchFocused={searchFocused}
                    showSearchResults={showSearchResults}
                    searchResults={searchResults}
                    searchSuggestions={searchSuggestions}
                    showMobileSearch={showMobileSearch}
                    onSearchChange={setSearchQuery}
                    onSearchFocus={() => {
                      setSearchFocused(true)
                      if (searchQuery.trim()) {
                        setShowSearchResults(true)
                      }
                    }}
                    onSearchBlur={() => {
                      setTimeout(() => {
                        setSearchFocused(false)
                        setShowSearchResults(false)
                      }, 200)
                    }}
                    onResultClick={handleSearchResultClick}
                    onMobileSearchToggle={setShowMobileSearch}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Section - Enhanced User Controls */}
          <motion.div 
            className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Wallet Display with enhanced styling */}
            <motion.div 
              className="hidden sm:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-300 dark:border-gray-600 overflow-hidden">
                  <WalletDisplay
                    currency={{
                      ...currency,
                      level: currentUser?.stats?.level || currency.level
                    }}
                    onOpenHistory={fetchCurrencyHistory}
                  />
                </div>
              </div>
            </motion.div>

            {/* Language Toggle */}
            <motion.div 
              className="hidden lg:block"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-300 dark:border-gray-600 p-1">
                  <LanguageToggle
                    language="en"
                    onToggle={() => {}}
                  />
                </div>
              </div>
            </motion.div>

            {/* Theme Toggle with enhanced animation */}
            <motion.div 
              className="hidden lg:block"
              whileHover={{ scale: 1.1, rotate: isDark ? -180 : 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-purple-400 dark:to-pink-400 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-300 dark:border-gray-600 p-1">
                  <ThemeToggle
                    isDark={isDark}
                    onToggle={toggleTheme}
                  />
                </div>
              </div>
            </motion.div>

            {/* Notifications with pulse animation */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative group">
                {unreadCount > 0 && (
                  <motion.div 
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center z-10"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-[10px] text-white font-bold">{unreadCount}</span>
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-300 dark:border-gray-600 p-1">
                  <NotificationsDropdown
                    isOpen={isNotificationsOpen}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onToggle={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    onMarkAsRead={markNotificationAsRead}
                    onMarkAllAsRead={markAllAsRead}
                  />
                </div>
              </div>
            </motion.div>

            {/* User Profile with enhanced hover effect */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-300 dark:border-gray-600 p-1">
                  {currentUser ? (
                    <UserProfileDropdown
                      user={{
                        ...currentUser,
                        stats: {
                          ...currentUser.stats,
                          xp: ((currentUser.stats as Record<string, unknown>).xp || (currentUser.stats as Record<string, unknown>).totalXP || 0) as number
                        }
                      }}
                      isOpen={isProfileOpen}
                      shouldShowOnboarding={shouldShowOnboarding}
                      onToggle={() => setIsProfileOpen(!isProfileOpen)}
                      onLogout={logout}
                      onOpenAvatarOnboarding={() => {
                        setIsProfileOpen(false)
                        openOnboarding()
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Progress Bar */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <ProgressBar progress={(currentUser as Record<string, unknown>)?.progress as number || 0} />
        </motion.div>
      </motion.header>

      {/* Header spacer */}
      <div className="h-[72px]" />

      {/* Modals and Overlays */}
      <AnimatePresence>
        {showCurrencyHistory && (
          <CurrencyHistoryModal
            show={showCurrencyHistory}
            transactions={currencyTransactions}
            currency={currency}
            onClose={() => setShowCurrencyHistory(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions Bar with fade animation */}
      <AnimatePresence>
        {searchFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <QuickActionsBar show={searchFocused} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Reader Status Updates */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="status-updates"
      >
        {isSyncing && 'Syncing...'}
        {!isOnline && 'Connection lost'}
        {unreadCount > 0 && `${unreadCount} new notifications`}
      </div>
    </>
  )
}