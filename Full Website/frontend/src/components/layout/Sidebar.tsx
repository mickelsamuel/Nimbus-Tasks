'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
  Home,
  BookOpen,
  TrendingUp,
  Users,
  Calendar,
  Trophy,
  GraduationCap,
  MapPin,
  Clock,
  User,
  Sparkles,
  ShoppingBag,
  MessageSquare,
  Shield,
  Zap,
  BarChart3,
  Building2,
  ChevronRight,
  Globe
} from 'lucide-react'

// Import modular components
import UserProfileSection from './sidebar/UserProfileSection'
import SearchSection from './sidebar/SearchSection'
import CollapseToggle from './sidebar/CollapseToggle'
import { SidebarUser } from './types'
import { useSidebarData } from '@/hooks/useSidebarData'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'

interface SidebarProps {
  user?: SidebarUser
  collapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ user: propUser, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { isDark } = useTheme()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedSections, setCollapsedSections] = useState<string[]>([])
  const [autoCollapsed, setAutoCollapsed] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)
  
  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Transform mouse position to gradient position
  const gradientX = useTransform(mouseX, [0, 320], [0, 100])
  const gradientY = useTransform(mouseY, [0, 800], [0, 100])
  
  // Handle mouse move for interactive gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])
  
  // Get authenticated user, sidebar data, and translations
  const { user: authUser } = useAuth()
  const { user: hookUser, navSections: hookNavSections, error } = useSidebarData()

  // Smart responsive behavior - auto-collapse at window width < 1200px
  useEffect(() => {
    const handleResize = () => {
      const shouldAutoCollapse = window.innerWidth < 1200
      setAutoCollapsed(shouldAutoCollapse)
    }

    handleResize() // Check on mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Determine if sidebar should be collapsed
  const isCollapsed = collapsed || autoCollapsed

  // Use authenticated user, then prop user, then hook user
  const currentUser = authUser || propUser || hookUser

  // Use nav sections with dynamic data from hook
  const getNavSections = useCallback((hookSections: unknown[], counts: Record<string, number> = {}) => [
    {
      id: 'core',
      title: 'Core Learning',
      icon: <Zap className="h-4 w-4" />,
      items: [
        { id: 'dashboard', title: 'Dashboard', icon: <Home className="h-5 w-5" />, href: '/dashboard', color: 'from-blue-500 to-blue-600' },
        { id: 'modules', title: 'Modules', icon: <BookOpen className="h-5 w-5" />, href: '/modules', badge: (typeof counts.modules === 'number' ? counts.modules : undefined), badgeType: 'info' as const, color: 'from-green-500 to-green-600' },
        { id: 'simulation', title: 'Simulation', icon: <TrendingUp className="h-5 w-5" />, href: '/simulation', new: true, color: 'from-purple-500 to-purple-600' },
        { id: 'career', title: 'Career Map', icon: <MapPin className="h-5 w-5" />, href: '/career', progress: currentUser?.progress, color: 'from-orange-500 to-orange-600' },
        { id: 'spaces', title: 'Virtual Spaces', icon: <Building2 className="h-5 w-5" />, href: '/spaces', badge: 'New', badgeType: 'success' as const, color: 'from-indigo-500 to-indigo-600' },
        { id: 'globe', title: 'Globe', icon: <Globe className="h-5 w-5" />, href: '/globe', color: 'from-teal-500 to-teal-600' }
      ]
    },
    {
      id: 'social',
      title: 'Social Features',
      icon: <Users className="h-4 w-4" />,
      items: [
        { id: 'friends-teams', title: 'Friends & Teams', icon: <Users className="h-5 w-5" />, href: '/friends-teams', badge: ((typeof counts.teams === 'number' ? counts.teams : 0) + (typeof counts.friends === 'number' ? counts.friends : 0)) || undefined, badgeType: 'success' as const, color: 'from-blue-500 to-purple-600' },
        { id: 'events', title: 'Events', icon: <Calendar className="h-5 w-5" />, href: '/events', badge: (typeof counts.events === 'number' ? counts.events : undefined), badgeType: 'danger' as const, color: 'from-red-500 to-red-600' },
        { id: 'innovation-lab', title: 'Innovation Lab', icon: <Sparkles className="h-5 w-5" />, href: '/innovation-lab', color: 'from-purple-500 to-pink-600' }
      ]
    },
    {
      id: 'progress',
      title: 'Progress',
      icon: <BarChart3 className="h-4 w-4" />,
      items: [
        { id: 'leaderboards', title: 'Leaderboards', icon: <Trophy className="h-5 w-5" />, href: '/leaderboards', live: true, color: 'from-yellow-500 to-yellow-600' },
        { id: 'timeline', title: 'Timeline', icon: <Clock className="h-5 w-5" />, href: '/timeline', color: 'from-cyan-500 to-cyan-600' }
      ]
    },
    {
      id: 'personal',
      title: 'Personal',
      icon: <User className="h-4 w-4" />,
      items: [
        { id: 'profile', title: 'Profile & Settings', icon: <User className="h-5 w-5" />, href: '/profile', color: 'from-blue-500 to-blue-600' },
        { id: 'avatar', title: 'Avatar', icon: <Sparkles className="h-5 w-5" />, href: '/avatar', new: true, color: 'from-fuchsia-500 to-fuchsia-600' },
        { id: 'shop', title: 'Shop', icon: <ShoppingBag className="h-5 w-5" />, href: '/shop', badge: (typeof counts.shop === 'number' ? counts.shop : undefined), badgeType: 'warning' as const, color: 'from-emerald-500 to-emerald-600' },
        { id: 'chat', title: 'Chat', icon: <MessageSquare className="h-5 w-5" />, href: '/chat', color: 'from-sky-500 to-sky-600' }
      ]
    },
    // Management section - show different items based on role
    ...(currentUser?.role?.toLowerCase() === 'manager' ? [{
      id: 'management',
      title: 'Management',
      icon: <Shield className="h-4 w-4" />,
      items: [
        { id: 'manager', title: 'Manager Panel', icon: <BarChart3 className="h-5 w-5" />, href: '/manager', color: 'from-slate-500 to-slate-600' }
      ]
    }] : []),
    // Admin section - only show for admins
    ...(currentUser?.role?.toLowerCase() === 'admin' ? [{
      id: 'administration',
      title: 'Administration',
      icon: <Shield className="h-4 w-4" />,
      items: [
        { id: 'admin', title: 'Admin Panel', icon: <Shield className="h-5 w-5" />, href: '/admin', color: 'from-rose-500 to-rose-600' }
      ]
    }] : [])
  ], [currentUser?.role, currentUser?.progress])

  // Extract counts from hook sections if available
  const extractCounts = (sections: unknown[]) => {
    const counts: Record<string, number> = {}
    sections.forEach((section) => {
      const typedSection = section as Record<string, unknown>
      const items = typedSection.items as Array<Record<string, unknown>>
      items?.forEach((item) => {
        if (item.badge && typeof item.badge !== 'boolean' && typeof item.id === 'string') {
          counts[item.id] = item.badge as number
        }
      })
    })
    return counts
  }
  
  // Memoize navigation sections
  const navSections = useMemo(() => {
    const dynamicCounts = hookNavSections.length > 0 ? extractCounts(hookNavSections) : {}
    return getNavSections(hookNavSections, dynamicCounts)
  }, [hookNavSections, getNavSections])

  // Toggle section collapse
  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  // Filter items based on search
  const filteredSections = navSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0)


  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        onToggle?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onToggle])

  return (
    <motion.aside 
      ref={sidebarRef}
      className="w-full min-h-full transition-all duration-300 ease-out relative overflow-visible"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Enhanced Glassmorphism Background */}
      <div className="absolute inset-0">
        {/* Base glass layer */}
        <div 
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(24px) saturate(200%)',
            WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          }}
        />
        
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: isDark 
              ? [
                  'linear-gradient(180deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.9) 50%, rgba(15,23,42,0.9) 100%)',
                  'linear-gradient(180deg, rgba(30,41,59,0.9) 0%, rgba(15,23,42,0.9) 50%, rgba(30,41,59,0.9) 100%)',
                  'linear-gradient(180deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.9) 50%, rgba(15,23,42,0.9) 100%)'
                ]
              : [
                  'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 50%, rgba(255,255,255,0.95) 100%)',
                  'linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,0.95) 50%, rgba(248,250,252,0.95) 100%)',
                  'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 50%, rgba(255,255,255,0.95) 100%)'
                ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Interactive gradient that follows mouse */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, ${
              isDark ? 'rgba(224,26,26,0.3)' : 'rgba(224,26,26,0.2)'
            } 0%, transparent 50%)`
          }}
        />
        
        {/* Animated mesh pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E01A1A' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        
        {/* Right border with animated gradient */}
        <motion.div 
          className="absolute top-0 right-0 w-px h-full"
          style={{
            background: `linear-gradient(180deg, 
              transparent, 
              ${isDark ? 'rgba(224,26,26,0.5)' : 'rgba(224,26,26,0.3)'}, 
              ${isDark ? 'rgba(255,215,0,0.5)' : 'rgba(255,215,0,0.3)'}, 
              transparent
            )`
          }}
          animate={{
            backgroundPosition: ['0% 0%', '0% 100%', '0% 0%']
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Bottom fade */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: isDark 
              ? 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)'
              : 'linear-gradient(to top, rgba(255,255,255,0.9), transparent)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-50 flex h-full flex-col p-4 pb-20">
        {/* User Profile Section with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          {currentUser ? (
            <UserProfileSection 
              user={{
                id: currentUser.id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                role: currentUser.role,
                department: currentUser.department,
                avatar: currentUser.avatar,
                level: ('stats' in currentUser && currentUser.stats?.level) || ('level' in currentUser && currentUser.level) || 0,
                progress: currentUser.progress || 0,
                streak: currentUser.streak || 0
              }}
              isCollapsed={isCollapsed}
            />
          ) : (
            // Loading state when no user data available
            <div className={`mb-4 ${isCollapsed ? 'px-1' : 'px-3'}`}>
              <div className={`
                relative rounded-lg overflow-hidden
                ${isCollapsed ? 'p-2' : 'p-3'}
                bg-gray-200/50 dark:bg-slate-700/50
                backdrop-blur-xl border border-gray-300/20 dark:border-slate-600/30
                animate-pulse
              `}>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <div className={`rounded-full bg-gray-300 dark:bg-slate-600 ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'}`} />
                  {!isCollapsed && (
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-slate-600 rounded mb-2" />
                      <div className="h-3 bg-gray-300 dark:bg-slate-600 rounded w-3/4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Separator after profile */}
          {!isCollapsed && (
            <motion.div 
              className="mt-4 mb-2 mx-3"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-500 to-transparent" />
            </motion.div>
          )}
        </motion.div>

        {/* Search Section with animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <SearchSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isCollapsed={isCollapsed}
          />
          
          {/* Separator after search */}
          {!isCollapsed && (
            <motion.div 
              className="mt-4 mb-2 mx-3"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-500 to-transparent" />
            </motion.div>
          )}
        </motion.div>

        {/* Navigation Sections with stagger animation */}
        <motion.div 
          className="flex-1 overflow-y-auto"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {error ? (
            <motion.div 
              className="px-3 py-4 text-center text-sm text-red-600 dark:text-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ 
                    delay: 0.4 + sectionIndex * 0.1,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <div className="mb-6">
                    {/* Section Separator */}
                    {sectionIndex > 0 && (
                      <motion.div 
                        className="mb-4 mx-3"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + sectionIndex * 0.1 }}
                      >
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-500 to-transparent" />
                      </motion.div>
                    )}
                    
                    {/* Section Header */}
                    {!isCollapsed && (
                      <motion.button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors border-l-2 border-transparent hover:border-primary-400/30"
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: collapsedSections.includes(section.id) ? -90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="h-3 w-3" />
                          </motion.div>
                          {section.icon}
                          <span>{section.title}</span>
                        </div>
                      </motion.button>
                    )}
                    
                    {/* Section Items */}
                    <AnimatePresence>
                      {(!collapsedSections.includes(section.id) || isCollapsed) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-1 space-y-1">
                            {section.items.map((item, itemIndex) => {
                              const isActive = pathname === item.href
                              const isHovered = hoveredItem === item.id
                              
                              return (
                                <motion.a
                                  key={item.id}
                                  href={item.href}
                                  className={`
                                    group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                                    transition-all duration-300 overflow-hidden border
                                    ${isActive && 'color' in item
                                      ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg border-white/20' 
                                      : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
                                    }
                                  `}
                                  onMouseEnter={() => setHoveredItem(item.id)}
                                  onMouseLeave={() => setHoveredItem(null)}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ 
                                    delay: 0.5 + sectionIndex * 0.1 + itemIndex * 0.05,
                                    duration: 0.4
                                  }}
                                  whileHover={{ scale: 1.02, x: 4 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  {/* Hover Background Effect */}
                                  {!isActive && isHovered && 'color' in item && (
                                    <motion.div
                                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-10`}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 0.1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                    />
                                  )}
                                  
                                  {/* Icon with animation */}
                                  <motion.div
                                    className={`
                                      relative z-10 flex-shrink-0
                                      ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'}
                                    `}
                                    animate={{ 
                                      rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
                                      scale: isHovered ? 1.1 : 1
                                    }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    {item.icon}
                                  </motion.div>
                                  
                                  {/* Title and badges */}
                                  {!isCollapsed && (
                                    <div className="flex-1 flex items-center justify-between relative z-10">
                                      <span className={`
                                        font-medium text-sm
                                        ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'}
                                      `}>
                                        {item.title}
                                      </span>
                                      
                                      {/* Badges and indicators */}
                                      <div className="flex items-center gap-2">
                                        {'badge' in item && item.badge && (
                                          <motion.span
                                            className={`
                                              px-2 py-0.5 text-xs font-medium rounded-full
                                              ${'badgeType' in item && item.badgeType === 'info' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'badgeType' in item && item.badgeType === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                'badgeType' in item && item.badgeType === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}
                                            `}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.6 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                                          >
                                            {item.badge}
                                          </motion.span>
                                        )}
                                        
                                        {'new' in item && item.new && (
                                          <motion.span
                                            className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-primary-400 to-accent-400 text-white rounded-full"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                          >
                                            NEW
                                          </motion.span>
                                        )}
                                        
                                        {'live' in item && item.live && (
                                          <motion.div
                                            className="w-2 h-2 bg-green-500 rounded-full"
                                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Progress indicator */}
                                  {'progress' in item && item.progress && !isCollapsed && (
                                    <motion.div
                                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700"
                                      initial={{ scaleX: 0 }}
                                      animate={{ scaleX: 1 }}
                                      transition={{ delay: 0.7 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                                    >
                                      <motion.div
                                        className="h-full bg-gradient-to-r from-primary-400 to-accent-400"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: item.progress / 100 }}
                                        transition={{ delay: 0.8 + sectionIndex * 0.1 + itemIndex * 0.05, duration: 0.8 }}
                                        style={{ transformOrigin: 'left' }}
                                      />
                                    </motion.div>
                                  )}
                                  
                                  {/* Tooltip for collapsed state */}
                                  {isCollapsed && (
                                    <motion.div
                                      className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50"
                                      initial={{ x: -10 }}
                                      animate={{ x: 0 }}
                                    >
                                      {item.title}
                                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                                    </motion.div>
                                  )}
                                </motion.a>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>

      </div>

      {/* Fixed Collapse Toggle - Always visible at bottom of viewport */}
      <motion.div 
        className="fixed bottom-4 left-4 z-50"
        animate={{ 
          width: isCollapsed ? '48px' : '248px'
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative"
        >
          {/* Enhanced background with gradient and blur */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/90 to-white/80 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/60 dark:border-gray-700/60" />
          
          <div className="relative z-10">
            <CollapseToggle
              isCollapsed={isCollapsed}
              onToggle={onToggle}
              className="w-full"
            />
          </div>
        </motion.div>
      </motion.div>
      
      {/* Floating orbs for ambient animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: `radial-gradient(circle, ${isDark ? 'rgba(224,26,26,0.1)' : 'rgba(224,26,26,0.05)'}, transparent)`,
            filter: 'blur(40px)'
          }}
          animate={{
            x: [-100, 200, -100],
            y: [-100, 300, -100],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full"
          style={{
            background: `radial-gradient(circle, ${isDark ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.05)'}, transparent)`,
            filter: 'blur(30px)'
          }}
          animate={{
            x: [200, -100, 200],
            y: [300, -100, 300],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>
    </motion.aside>
  )
}