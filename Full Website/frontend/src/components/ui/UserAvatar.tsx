'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Crown, Shield, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getBestAvatarUrl, getFallbackAvatarData, needsAvatarSetup } from '@/utils/avatarUtils'

interface UserAvatarProps {
  user: {
    avatar?: string
    avatar3D?: string
    avatar2D?: string
    avatarPortrait?: string
    firstName: string
    lastName: string
    email?: string
    role?: string
    level?: number
    isOnline?: boolean
    hasCompletedAvatarSetup?: boolean
  }
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  showStatus?: boolean
  showLevel?: boolean
  showRole?: boolean
  showSetupPrompt?: boolean
  className?: string
  onClick?: () => void
  fallbackType?: 'initials' | 'default' | 'role'
  animationType?: 'none' | 'pulse' | 'glow' | 'float'
  useApiAvatar?: boolean
  preferPortrait?: boolean
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-xl',
  '2xl': 'w-24 h-24 text-2xl',
  full: 'w-full h-full text-4xl'
}

const sizePixels = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
  '2xl': 96,
  full: 200
}

const roleIcons = {
  admin: Crown,
  manager: Shield,
  employee: User
}

const roleColors = {
  admin: 'text-yellow-400',
  manager: 'text-blue-400',
  employee: 'text-gray-400'
}

export default function UserAvatar({
  user,
  size = 'md',
  showStatus = false,
  showLevel = false,
  showRole = false,
  showSetupPrompt = false,
  className = '',
  onClick,
  fallbackType = 'initials',
  animationType = 'none',
  useApiAvatar = true,
  preferPortrait = false
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [forceRefreshKey, setForceRefreshKey] = useState(0)
  const previousUrlRef = useRef<string | null>(null)
  const mountedRef = useRef(true)
  
  // Get current user from auth context
  const { user: authUser } = useAuth()

  // Reset error state when avatar URL changes
  useEffect(() => {
    const avatarUrl = useApiAvatar ? getBestAvatarUrl(authUser, user, preferPortrait) : getBestAvatarUrl(null, user, preferPortrait)
    
    if (avatarUrl) {
      setImageError(false)
      // Only set loading if this is the initial load
      if (previousUrlRef.current === null) {
        setIsLoading(true)
      }
      previousUrlRef.current = avatarUrl
    } else {
      setIsLoading(false)
      previousUrlRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.avatar, user.avatar2D, user.avatar3D, user.avatarPortrait, authUser?.avatar, authUser?.avatar2D, authUser?.avatar3D, authUser?.avatarPortrait, useApiAvatar, preferPortrait, forceRefreshKey])

  // Listen for avatar updates from the avatar page and force refreshes
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout

    const handleAvatarUpdate = () => {
      // Debounce rapid updates to prevent flickering
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        setImageError(false)
        previousUrlRef.current = null // Force complete reload
        setForceRefreshKey(prev => prev + 1) // Force re-render
      }, 100) // 100ms debounce
    }

    window.addEventListener('avatarUpdated', handleAvatarUpdate)
    return () => {
      clearTimeout(debounceTimer)
      window.removeEventListener('avatarUpdated', handleAvatarUpdate)
    }
  }, [])

  const getFallbackContent = () => {
    const fallbackData = getFallbackAvatarData(user)
    
    switch (fallbackType) {
      case 'role':
        const RoleIcon = roleIcons[user.role as keyof typeof roleIcons] || User
        return <RoleIcon className="w-1/2 h-1/2" />
      case 'default':
        return <User className="w-1/2 h-1/2" />
      default:
        // Show initials with better styling
        return (
          <span className="font-semibold tracking-wide">
            {fallbackData.initials}
          </span>
        )
    }
  }

  const getAnimationClasses = () => {
    switch (animationType) {
      case 'pulse':
        return 'animate-pulse'
      case 'glow':
        return 'shadow-lg shadow-blue-500/50'
      case 'float':
        return 'animate-bounce'
      default:
        return ''
    }
  }

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
    setImageError(false)
  }, [])

  const handleImageError = useCallback(() => {
    setIsLoading(false)
    setImageError(true)
  }, [])


  // Get the best avatar URL using utilities
  const avatarUrl = useApiAvatar ? getBestAvatarUrl(authUser, user, preferPortrait) : getBestAvatarUrl(null, user, preferPortrait)
  const showImage = avatarUrl && !imageError

  // Track avatar URL changes for debugging purposes
  useEffect(() => {
    // Avatar URL updated
  }, [avatarUrl, forceRefreshKey])

  // Add a timeout to prevent infinite loading states
  useEffect(() => {
    if (isLoading && showImage && mountedRef.current) {
      const timeout = setTimeout(() => {
        if (mountedRef.current) {
          setIsLoading(false)
        }
      }, 1000) // Reduced to 1 second timeout

      return () => clearTimeout(timeout)
    }
  }, [isLoading, showImage])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const sizeClass = sizeClasses[size]
  const needsSetup = showSetupPrompt && needsAvatarSetup(useApiAvatar ? authUser : user)
  // Don't show loading spinner if we have an avatar URL - just show the image
  const actuallyLoading = false // Disable loading spinner completely
  const fallbackData = getFallbackAvatarData(user)
  

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Avatar Container */}
      <div
        className={`
          ${sizeClass} rounded-full overflow-hidden cursor-pointer transition-all duration-200 
          ${onClick ? 'hover:scale-105' : ''} 
          ${getAnimationClasses()}
          ${showImage && !actuallyLoading ? 'bg-gray-100 dark:bg-gray-800' : fallbackData.backgroundColor}
          ${needsSetup ? 'ring-2 ring-orange-400 ring-offset-2' : ''}
        `}
        onClick={onClick}
      >
        {showImage && !actuallyLoading ? (
          <Image
            key={`${avatarUrl}-${forceRefreshKey}`}
            src={avatarUrl}
            alt={`${user.firstName} ${user.lastName}`}
            width={sizePixels[size]}
            height={sizePixels[size]}
            className={`w-full h-full object-cover`}
            style={preferPortrait ? { 
              transformOrigin: size === 'sm' ? 'center top' : 'center 45%',
              objectPosition: size === 'sm' ? 'center -50%' : 'center -5%',
              transform: size === 'sm' ? 'scale(1.8)' : 'scale(1.1)'
            } : undefined}
            onLoad={handleImageLoad}
            onError={handleImageError}
            onLoadStart={() => {
              setIsLoading(true)
            }}
            unoptimized={true}
            priority={size === 'full' || size === 'lg' || size === 'xl' || size === '2xl'}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-semibold">
            {actuallyLoading && showImage ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              getFallbackContent()
            )}
          </div>
        )}
      </div>

      {/* Online Status Indicator */}
      {showStatus && (
        <div
          className={`
            absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white
            ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}
            ${size === 'xs' || size === 'sm' ? 'w-2 h-2' : ''}
            ${size === 'xl' || size === '2xl' ? 'w-4 h-4' : ''}
          `}
        />
      )}

      {/* Level Badge */}
      {showLevel && user.level && user.level > 0 && (
        <div
          className={`
            absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 
            text-white font-bold rounded-full flex items-center justify-center px-1
            ${size === 'xs' ? 'text-[8px] h-3 min-w-[12px] -top-0.5 -right-0.5' : ''}
            ${size === 'sm' ? 'text-[9px] h-3.5 min-w-[14px] -top-0.5 -right-0.5' : ''}
            ${size === 'md' ? 'text-xs h-5 min-w-[20px]' : ''}
            ${size === 'lg' ? 'text-xs h-5 min-w-[20px]' : ''}
            ${size === 'xl' ? 'text-sm h-6 min-w-[24px]' : ''}
            ${size === '2xl' ? 'text-sm h-6 min-w-[24px]' : ''}
          `}
        >
          {user.level}
        </div>
      )}

      {/* Role Indicator */}
      {showRole && user.role && (
        <div
          className={`
            absolute -top-1 -left-1 w-5 h-5 rounded-full bg-black/80 flex items-center justify-center
            ${size === 'xs' || size === 'sm' ? 'w-4 h-4' : ''}
            ${size === 'xl' || size === '2xl' ? 'w-6 h-6' : ''}
          `}
        >
          {React.createElement(roleIcons[user.role as keyof typeof roleIcons] || User, {
            className: `w-3 h-3 ${roleColors[user.role as keyof typeof roleColors] || 'text-gray-400'}`
          })}
        </div>
      )}

      {/* Setup Prompt Badge */}
      {needsSetup && (
        <div
          className={`
            absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-400 to-red-500 
            text-white text-xs font-bold rounded-full flex items-center justify-center
            animate-pulse
            ${size === 'xs' || size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
            ${size === 'xl' || size === '2xl' ? 'w-6 h-6' : ''}
          `}
          title="Set up your avatar"
        >
          !
        </div>
      )}
      
    </div>
  )
}

// Specialized avatar components for common use cases
export function TeamMemberAvatar({ user, ...props }: Omit<UserAvatarProps, 'showStatus' | 'showLevel'>) {
  return (
    <UserAvatar
      user={user}
      showStatus={true}
      showLevel={false}
      animationType="glow"
      {...props}
    />
  )
}

export function LeaderboardAvatar({ user, rank, ...props }: UserAvatarProps & { rank?: number }) {
  return (
    <div className="relative">
      <UserAvatar
        user={user}
        showLevel={true}
        {...props}
      />
      {rank && rank <= 3 && (
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {rank}
        </div>
      )}
    </div>
  )
}

export function CollaborationAvatar({ user, isActive, ...props }: UserAvatarProps & { isActive?: boolean }) {
  return (
    <UserAvatar
      user={user}
      showStatus={true}
      animationType={isActive ? 'pulse' : 'none'}
      className={isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      {...props}
    />
  )
}