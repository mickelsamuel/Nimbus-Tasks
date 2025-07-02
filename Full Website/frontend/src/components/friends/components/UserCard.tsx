'use client'

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { 
  MessageCircle, 
  UserPlus, 
  Users, 
  Clock,
  CheckCircle,
  X,
  Sparkles,
  Trophy,
  Crown,
  Gem,
  Flame,
  Zap as Lightning,
  ArrowRight,
  Globe2,
  TrendingUp
} from 'lucide-react'
import { User } from '../types'
import { useState, useEffect } from 'react'

interface UserCardProps {
  user: User
  variant?: 'default' | 'suggested' | 'request'
  onConnect?: (userId: number) => void
  onMessage?: (userId: number | string) => void
  onAcceptRequest?: (userId: number) => void
  onDeclineRequest?: (userId: number) => void
  showActions?: boolean
}

export default function UserCard({ 
  user, 
  variant = 'default',
  onConnect,
  onMessage,
  onAcceptRequest,
  onDeclineRequest,
  showActions = true
}: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15])
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15])
  const scale = useSpring(1, { stiffness: 300, damping: 30 })
  const glowOpacity = useSpring(0, { stiffness: 200, damping: 25 })
  
  useEffect(() => {
    if (isHovered) {
      scale.set(1.02)
      glowOpacity.set(1)
    } else {
      scale.set(1)
      glowOpacity.set(0)
    }
  }, [isHovered, scale, glowOpacity])

  const getStatusConfig = (status: User['status']) => {
    switch (status) {
      case 'online': 
        return {
          color: 'bg-gradient-to-r from-green-400 to-emerald-500',
          ring: 'ring-green-400/30',
          text: 'Online',
          pulse: true
        }
      case 'away': 
        return {
          color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          ring: 'ring-yellow-400/30',
          text: 'Away',
          pulse: false
        }
      case 'busy': 
        return {
          color: 'bg-gradient-to-r from-red-400 to-pink-500',
          ring: 'ring-red-400/30',
          text: 'Busy',
          pulse: false
        }
      default: 
        return {
          color: 'bg-gradient-to-r from-gray-400 to-slate-500',
          ring: 'ring-gray-400/30',
          text: 'Offline',
          pulse: false
        }
    }
  }

  const getDepartmentColor = (department: string) => {
    const colors = {
      'Engineering': 'from-blue-500 to-cyan-600',
      'Product': 'from-purple-500 to-indigo-600',
      'Design': 'from-pink-500 to-rose-600',
      'Marketing': 'from-orange-500 to-red-600',
      'Analytics': 'from-emerald-500 to-teal-600',
      'Strategy': 'from-indigo-500 to-purple-600',
    }
    return colors[department as keyof typeof colors] || 'from-gray-500 to-slate-600'
  }

  const statusConfig = getStatusConfig(user.status)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = e.clientX - centerX
    const y = e.clientY - centerY
    
    mouseX.set(x)
    mouseY.set(y)
    setMousePosition({ x: x / rect.width, y: y / rect.height })
  }

  return (
    <motion.div
      className={`group cursor-pointer relative overflow-hidden bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl border border-white/60 dark:border-slate-600/60 rounded-3xl p-8 shadow-2xl transition-all duration-500 ${isExpanded ? 'min-h-[650px]' : 'min-h-[520px]'}`}
      initial={{ opacity: 0, y: 40, scale: 0.85, rotateX: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      whileHover={{ 
        y: -12,
        transition: { duration: 0.4, type: "spring", stiffness: 300 }
      }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        scale,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        mouseX.set(0)
        mouseY.set(0)
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      transition={{
        duration: 0.8,
        type: "spring",
        bounce: 0.3
      }}
    >
      {/* Dynamic Background Glow */}
      <motion.div
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${(mousePosition.x + 1) * 50}% ${(mousePosition.y + 1) * 50}%, rgba(59,130,246,0.3), rgba(147,51,234,0.2), rgba(16,185,129,0.1), transparent 70%)`,
          filter: 'blur(20px)'
        }}
      />
      
      {/* Enhanced Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/6 to-emerald-500/8 dark:from-blue-400/15 dark:via-purple-400/12 dark:to-emerald-400/15 rounded-3xl"
        style={{ opacity: glowOpacity }}
      />

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {[...Array(12)].map((_, i) => {
          const colors = [
            'from-blue-400 to-cyan-400',
            'from-purple-400 to-pink-400',
            'from-emerald-400 to-teal-400',
            'from-orange-400 to-red-400'
          ]
          return (
            <motion.div
              key={i}
              className={`absolute w-1.5 h-1.5 bg-gradient-to-r ${colors[i % colors.length]} dark:opacity-80 opacity-60 rounded-full blur-sm`}
              animate={{
                x: [0, (Math.random() - 0.5) * 80],
                y: [0, (Math.random() - 0.5) * 80],
                scale: [1, 2, 1],
                opacity: [0.6, 1, 0.6],
                rotate: [0, 360]
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3
              }}
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${15 + Math.random() * 70}%`
              }}
            />
          )
        })}
      </div>
      
      {/* Constellation Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          {[...Array(8)].map((_, i) => {
            const x1 = 50 + (i * 45)
            const y1 = 100 + Math.sin(i) * 50
            const x2 = 80 + ((i + 1) * 45)
            const y2 = 120 + Math.cos(i) * 50
            return (
              <motion.line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#gradient)"
                strokeWidth="1"
                opacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.2 }}
              />
            )
          })}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-6">
          {/* Ultra-Enhanced Avatar */}
          <div className="relative group">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.15, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {/* Multi-layered Avatar Ring */}
              <motion.div
                className="absolute -inset-2 rounded-full"
                animate={statusConfig.pulse ? {
                  scale: [1, 1.15, 1],
                  opacity: [0.5, 0.8, 0.5]
                } : {}}
                transition={statusConfig.pulse ? {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
                style={{
                  background: `conic-gradient(from 0deg, ${statusConfig.color.replace('bg-gradient-to-r ', '')}, transparent, ${statusConfig.color.replace('bg-gradient-to-r ', '')})`
                }}
              />
              
              <motion.div
                className={`absolute -inset-1 rounded-full ring-2 ${statusConfig.ring} backdrop-blur-sm`}
                animate={statusConfig.pulse ? {
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                } : {}}
                transition={statusConfig.pulse ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
              />
              
              {/* Enhanced Avatar */}
              <motion.div 
                className="w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-2xl relative overflow-hidden border-4 border-white/50 dark:border-white/20"
                whileHover={{
                  boxShadow: '0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(147, 51, 234, 0.4)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent animate-pulse" />
                <motion.span 
                  className="relative z-10 drop-shadow-2xl"
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(255,255,255,0.5)',
                      '0 0 20px rgba(255,255,255,0.8)',
                      '0 0 10px rgba(255,255,255,0.5)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {user.firstName[0]}{user.lastName[0]}
                </motion.span>
                
                {/* Enhanced Achievement Badge */}
                {user.collaborationScore > 80 && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl border-2 border-white"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.6, type: "spring", bounce: 0.7 }}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: 360,
                      boxShadow: '0 0 30px rgba(251, 191, 36, 0.8)'
                    }}
                  >
                    <Crown className="w-4 h-4 text-white drop-shadow-lg" />
                  </motion.div>
                )}
                
                {/* Sparkle Animation */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    background: [
                      'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 70% 70%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                      'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)'
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>
              
              {/* Enhanced Status Indicator */}
              <motion.div 
                className="absolute -bottom-1 -right-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
              >
                <div className={`w-6 h-6 rounded-full ${statusConfig.color} flex items-center justify-center shadow-lg ring-2 ring-white/50`}>
                  {statusConfig.pulse && (
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* User Info */}
          <div className="flex-1 min-w-0">
            <motion.h3 
              className="font-black text-gray-900 dark:text-white text-2xl mb-3 truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-all duration-500 leading-tight"
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
              whileHover={{
                scale: 1.05,
                textShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
              }}
            >
              <motion.span
                className="bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              >
                {user.firstName} {user.lastName}
              </motion.span>
            </motion.h3>
            
            <motion.p 
              className="text-gray-700 dark:text-gray-200 text-base mb-4 font-semibold flex items-center gap-2"
              initial={{ opacity: 0, x: -30, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <motion.div
                className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">
                {user.role}
              </span>
            </motion.p>
            
            {/* Enhanced Department Badge */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -30, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
            >
              <motion.div
                className={`px-4 py-2 rounded-2xl bg-gradient-to-r ${getDepartmentColor(user.department)} text-white flex items-center gap-2 shadow-xl text-sm font-bold backdrop-blur-sm border border-white/20`}
                whileHover={{ 
                  scale: 1.08, 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  y: -2
                }}
                animate={{
                  boxShadow: [
                    '0 4px 20px rgba(0,0,0,0.1)',
                    '0 8px 30px rgba(0,0,0,0.2)',
                    '0 4px 20px rgba(0,0,0,0.1)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Globe2 className="h-4 w-4" />
                </motion.div>
                <span>{user.department}</span>
              </motion.div>
              
              <motion.div
                className={`px-4 py-2 rounded-2xl text-sm font-bold ${statusConfig.color} text-white shadow-xl backdrop-blur-sm border border-white/30 flex items-center gap-2`}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6, type: "spring", bounce: 0.6 }}
                whileHover={{ scale: 1.08, y: -2 }}
              >
                <motion.div
                  className="w-3 h-3 rounded-full bg-white/80"
                  animate={statusConfig.pulse ? {
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8]
                  } : {}}
                  transition={statusConfig.pulse ? {
                    duration: 1.5,
                    repeat: Infinity
                  } : {}}
                />
                <span>{statusConfig.text}</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <motion.div 
              className="flex flex-col gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              {variant === 'suggested' && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onConnect?.(user.id)
                  }}
                  className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                  title="Send connection request"
                >
                  <UserPlus className="h-5 w-5" />
                </motion.button>
              )}
              
              {variant === 'request' && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onAcceptRequest?.(user.id)
                    }}
                    className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-green-500/50 transition-all duration-300"
                    title="Accept request"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeclineRequest?.(user.id)
                    }}
                    className="p-3 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-xl shadow-lg hover:shadow-gray-500/50 transition-all duration-300"
                    title="Decline request"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </>
              )}
              
              {variant === 'default' && (
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onMessage?.(user.id)
                  }}
                  className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  title="Send message"
                >
                  <MessageCircle className="h-5 w-5" />
                </motion.button>
              )}
            </motion.div>
          )}
        </div>

        {/* Enhanced Skills Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
        >
          <motion.h4 
            className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Gem className="h-4 w-4 text-purple-500" />
            Skills & Expertise
          </motion.h4>
          <div className="flex flex-wrap gap-3">
            {user.skills.slice(0, isExpanded ? user.skills.length : 3).map((skill, index) => {
              const skillColors = [
                'from-blue-400 to-cyan-500',
                'from-purple-400 to-pink-500',
                'from-emerald-400 to-teal-500',
                'from-orange-400 to-red-500',
                'from-indigo-400 to-purple-500'
              ]
              return (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.6 + index * 0.1, 
                    type: "spring", 
                    bounce: 0.6 
                  }}
                  whileHover={{ 
                    scale: 1.15, 
                    y: -4,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    rotate: 2
                  }}
                  className={`px-4 py-2 bg-gradient-to-r ${skillColors[index % skillColors.length]} text-white text-sm rounded-2xl font-bold shadow-lg backdrop-blur-sm border border-white/30 cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">{skill}</span>
                </motion.span>
              )
            })}
            {!isExpanded && user.skills.length > 3 && (
              <motion.span 
                className="px-4 py-2 bg-gradient-to-r from-slate-400 to-gray-500 dark:from-slate-600 dark:to-gray-700 text-white text-sm rounded-2xl font-bold cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <ArrowRight className="h-4 w-4" />
                +{user.skills.length - 3} more
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div 
          className="grid grid-cols-3 gap-6 pt-6 border-t-2 border-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 dark:from-blue-500/30 dark:via-purple-500/30 dark:to-emerald-500/30"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
        >
          {/* Enhanced Mutual Connections */}
          <motion.div 
            className="text-center group/stat relative overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-500/10 dark:to-rose-500/10 rounded-2xl p-4 border border-pink-200 dark:border-pink-500/30"
            whileHover={{ scale: 1.08, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-rose-400/20 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"
            />
            <motion.div 
              className="flex items-center justify-center gap-1 mb-3 relative z-10"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <div className="p-3 bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </motion.div>
            <motion.div 
              className="text-2xl font-black text-gray-900 dark:text-white group-hover/stat:text-pink-600 dark:group-hover/stat:text-pink-200 transition-colors relative z-10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {user.mutualFriends}
            </motion.div>
            <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold relative z-10">
              Mutual
            </div>
          </motion.div>
          
          {variant === 'default' && (
            <>
              {/* Enhanced Messages */}
              <motion.div 
                className="text-center group/stat relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-2xl p-4 border border-blue-200 dark:border-blue-500/30"
                whileHover={{ scale: 1.08, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="flex items-center justify-center gap-1 mb-3 relative z-10"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <div className="p-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl shadow-lg relative">
                    <MessageCircle className="h-5 w-5 text-white" />
                    {user.messageCount > 20 && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center text-xs text-white font-bold"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        !
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                <motion.div 
                  className="text-2xl font-black text-gray-900 dark:text-white group-hover/stat:text-blue-600 dark:group-hover/stat:text-blue-200 transition-colors relative z-10"
                  animate={{ 
                    scale: user.messageCount > 20 ? [1, 1.1, 1] : [1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {user.messageCount}
                </motion.div>
                <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold relative z-10">
                  Messages
                </div>
              </motion.div>
              
              {/* Enhanced Collaboration Score */}
              <motion.div 
                className="text-center group/stat relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-500/30"
                whileHover={{ scale: 1.08, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="flex items-center justify-center gap-1 mb-3 relative z-10"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <div className="p-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl shadow-lg relative">
                    <Lightning className="h-5 w-5 text-white" />
                    {user.collaborationScore > 80 && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                        animate={{ 
                          scale: [1, 1.3, 1],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Flame className="h-2 w-2 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
                <motion.div 
                  className="text-2xl font-black text-gray-900 dark:text-white group-hover/stat:text-emerald-600 dark:group-hover/stat:text-emerald-200 transition-colors flex items-center justify-center gap-2 relative z-10"
                  animate={{ 
                    textShadow: [
                      '0 0 10px rgba(16, 185, 129, 0.0)',
                      '0 0 20px rgba(16, 185, 129, 0.6)',
                      '0 0 10px rgba(16, 185, 129, 0.0)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {user.collaborationScore}%
                  {user.collaborationScore > 80 && (
                    <motion.div
                      animate={{ 
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <Trophy className="h-5 w-5 text-yellow-500 dark:text-yellow-400 drop-shadow-lg" />
                    </motion.div>
                  )}
                </motion.div>
                <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold relative z-10">
                  Synergy
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Expandable Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10"
            >
              {/* Additional Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white font-medium">
                    {user.lastActive}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Last Active</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white font-medium">
                    {user.connectionDate ? new Date(user.connectionDate).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Connected</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Collaboration Level</span>
                  <span className="text-sm text-cyan-600 dark:text-cyan-300 font-semibold">{user.collaborationScore}%</span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${user.collaborationScore}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Expand/Collapse Indicator */}
        <motion.div 
          className="absolute bottom-4 right-4 p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group/expand"
          animate={{ 
            rotate: isExpanded ? 180 : 0,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 0.5 },
            scale: { duration: 2, repeat: Infinity }
          }}
          whileHover={{ scale: 1.2, boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' }}
        >
          <Sparkles className="h-5 w-5 group-hover/expand:text-yellow-300 transition-colors" />
        </motion.div>
        
        {/* Floating Action Button */}
        <motion.div
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg" />
        </motion.div>

        {/* Enhanced Collaboration Glow Effect */}
        <motion.div 
          className="absolute -inset-2 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-emerald-500/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-emerald-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(16, 185, 129, 0.1))',
              'linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
              'linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
              'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(16, 185, 129, 0.1))'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        {/* Success Ripple Effect */}
        <AnimatePresence>
          {user.collaborationScore > 90 && (
            <motion.div
              className="absolute inset-0 rounded-3xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0, 0.3, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                filter: 'blur(10px)'
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}