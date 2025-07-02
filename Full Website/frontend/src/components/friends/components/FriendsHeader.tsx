'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Users, UserPlus, Heart, TrendingUp, Zap, Sparkles, Network, Award, Star, Globe, Target, Crown, Gem } from 'lucide-react'
import { FriendsStats } from '../types'
import { useRef, useState, useEffect } from 'react'

interface FriendsHeaderProps {
  stats: FriendsStats
  title?: string
  subtitle?: string
  labels?: {
    professionalNetwork?: string
    pendingInvitations?: string
    activeNow?: string
    mutualConnections?: string
    weeklyGrowth?: string
  }
}

export default function FriendsHeader({ 
  stats, 
  title = "Professional Network Hub",
  subtitle = "Build meaningful connections • Collaborate seamlessly • Grow your professional impact",
  labels = {
    professionalNetwork: "Professional Network",
    pendingInvitations: "Pending Invitations", 
    activeNow: "Active Now",
    mutualConnections: "Mutual Connections",
    weeklyGrowth: "Weekly Growth"
  }
}: FriendsHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -80])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 2])
  
  const springConfig = { stiffness: 100, damping: 30, mass: 1 }
  const x = useSpring(0, springConfig)
  const rotateX = useSpring(0, springConfig)
  const rotateY = useSpring(0, springConfig)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const mouseX = e.clientX - centerX
        const mouseY = e.clientY - centerY
        
        // Mouse position tracking removed
        
        if (isHovered) {
          x.set(mouseX * 0.1)
          rotateX.set(mouseY * -0.01)
          rotateY.set(mouseX * 0.01)
        }
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isHovered, x, rotateX, rotateY])

  const statCards = [
    {
      icon: Users,
      value: stats.totalConnections,
      label: labels.professionalNetwork,
      color: "from-blue-400 via-cyan-500 to-teal-500",
      bgColor: "bg-blue-500/20",
      delay: 0.1,
      glow: "shadow-blue-500/30"
    },
    {
      icon: UserPlus,
      value: stats.newRequests,
      label: labels.pendingInvitations,
      color: "from-emerald-400 via-green-500 to-teal-500",
      bgColor: "bg-emerald-500/20",
      delay: 0.2,
      glow: "shadow-emerald-500/30"
    },
    {
      icon: Zap,
      value: stats.onlineFriends,
      label: labels.activeNow,
      color: "from-green-400 via-emerald-500 to-cyan-500",
      bgColor: "bg-green-500/20",
      delay: 0.3,
      pulse: true,
      glow: "shadow-green-500/40"
    },
    {
      icon: Heart,
      value: stats.mutualConnections,
      label: labels.mutualConnections,
      color: "from-pink-400 via-rose-500 to-red-500",
      bgColor: "bg-pink-500/20",
      delay: 0.4,
      glow: "shadow-pink-500/30"
    },
    {
      icon: TrendingUp,
      value: `+${stats.weeklyGrowth}`,
      label: labels.weeklyGrowth,
      color: "from-purple-400 via-indigo-500 to-violet-500",
      bgColor: "bg-purple-500/20",
      delay: 0.5,
      glow: "shadow-purple-500/30"
    }
  ]

  return (
    <motion.div 
      ref={headerRef}
      style={{ y, opacity, scale, filter: `blur(${blur}px)`, x, rotateX, rotateY }}
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        x.set(0)
        rotateX.set(0)
        rotateY.set(0)
      }}
    >
      {/* Ultra-Premium Gradient Background */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        {/* Multi-layered Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.3),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(147,51,234,0.3),transparent_70%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(59,130,246,0.1)_0deg,rgba(147,51,234,0.1)_120deg,rgba(16,185,129,0.1)_240deg,rgba(59,130,246,0.1)_360deg)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40 dark:opacity-60" />
        
        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(16)].map((_, i) => {
            const icons = [Sparkles, Star, Award, Network, Globe, Target, Crown, Gem]
            const IconComponent = icons[i % icons.length]
            const colors = [
              'text-blue-300/20 dark:text-blue-400/30',
              'text-purple-300/20 dark:text-purple-400/30',
              'text-emerald-300/20 dark:text-emerald-400/30',
              'text-pink-300/20 dark:text-pink-400/30',
              'text-cyan-300/20 dark:text-cyan-400/30',
              'text-indigo-300/20 dark:text-indigo-400/30',
              'text-rose-300/20 dark:text-rose-400/30',
              'text-teal-300/20 dark:text-teal-400/30'
            ]
            
            return (
              <motion.div
                key={i}
                className={`absolute ${colors[i % colors.length]}`}
                animate={{
                  y: [0, -30 - Math.random() * 20, 0],
                  x: [0, (Math.random() - 0.5) * 40, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.3 + Math.random() * 0.5, 1],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3
                }}
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${15 + Math.random() * 70}%`
                }}
              >
                <IconComponent className={`w-${3 + Math.floor(Math.random() * 4)} h-${3 + Math.floor(Math.random() * 4)}`} />
              </motion.div>
            )
          })}
        </div>
        
        <div className="relative z-10 px-6 py-16">
          <div className="max-w-7xl mx-auto">
            {/* Header Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <motion.div 
                className="flex items-center justify-center gap-4 mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.4 }}
              >
                <motion.div 
                  className="p-4 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Users className="h-10 w-10 text-white" />
                </motion.div>
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  {title}
                </motion.h1>
              </motion.div>
              
              <motion.p 
                className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {subtitle}
              </motion.p>
              
              {/* Animated Underline */}
              <motion.div
                className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mt-6"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </motion.div>

            {/* Enhanced Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            >
              {statCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, scale: 0.7, rotateX: 45 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: card.delay,
                      type: "spring",
                      bounce: 0.5
                    }}
                    whileHover={{ 
                      y: -12, 
                      scale: 1.08,
                      rotateX: -5,
                      rotateY: 5,
                      transition: { duration: 0.3, type: "spring", stiffness: 400 }
                    }}
                    className={`group relative overflow-hidden bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/2 backdrop-blur-2xl border border-white/30 dark:border-white/20 rounded-3xl p-6 text-center shadow-2xl hover:${card.glow} transition-all duration-500 transform-gpu`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Enhanced Animated Background */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}
                      initial={false}
                      animate={{ opacity: 0 }}
                      whileHover={{ opacity: 0.15 }}
                    />
                    
                    {/* Glowing Ring Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl"
                      initial={{ boxShadow: '0 0 0 0px rgba(255,255,255,0)' }}
                      whileHover={{ 
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.2), 0 0 40px rgba(59,130,246,0.3)'
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Enhanced Icon */}
                    <motion.div 
                      className="flex items-center justify-center mb-4"
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1,
                        transition: { duration: 0.8, type: "spring", stiffness: 200 }
                      }}
                    >
                      <motion.div 
                        className={`relative p-4 bg-gradient-to-br ${card.color} rounded-2xl shadow-2xl`}
                        whileHover={{ 
                          scale: 1.15,
                          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                        }}
                        animate={card.pulse ? {
                          scale: [1, 1.1, 1],
                          opacity: [0.9, 1, 0.9],
                          boxShadow: [
                            '0 0 0 0px rgba(255,255,255,0.0)',
                            '0 0 0 8px rgba(255,255,255,0.1)',
                            '0 0 0 0px rgba(255,255,255,0.0)'
                          ]
                        } : {}}
                        transition={card.pulse ? {
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        } : {}}
                      >
                        <Icon className="h-7 w-7 text-white drop-shadow-lg" />
                        
                        {/* Sparkle effect */}
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full opacity-0"
                          animate={{
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.2, 0.5],
                            rotate: [0, 180, 360]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: Math.random() * 2
                          }}
                        />
                      </motion.div>
                    </motion.div>
                    
                    {/* Enhanced Value */}
                    <motion.div 
                      className="text-4xl font-black text-white mb-3 group-hover:text-cyan-100 transition-colors duration-500 drop-shadow-2xl"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        duration: 0.8, 
                        delay: card.delay + 0.2,
                        type: "spring",
                        bounce: 0.7
                      }}
                      whileHover={{
                        scale: 1.1,
                        textShadow: '0 0 20px rgba(255,255,255,0.8)'
                      }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: card.delay + 0.4 }}
                      >
                        {card.value}
                      </motion.span>
                      {index === 4 && (
                        <motion.div
                          className="inline-block ml-2"
                          animate={{ 
                            rotate: [0, 15, -15, 0],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                        >
                          <Zap className="h-6 w-6 text-yellow-300 inline drop-shadow-lg" />
                        </motion.div>
                      )}
                    </motion.div>
                    
                    {/* Enhanced Label */}
                    <motion.div 
                      className="text-sm text-white/90 font-semibold group-hover:text-white transition-colors duration-500 drop-shadow-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: card.delay + 0.3 }}
                    >
                      {card.label}
                    </motion.div>
                    
                    {/* Progress Ring for Active Users */}
                    {card.pulse && (
                      <motion.div
                        className="absolute -inset-1 rounded-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: card.delay + 0.5 }}
                      >
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400 to-emerald-500 opacity-20 blur-sm animate-pulse" />
                      </motion.div>
                    )}
                    
                    {/* Enhanced Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
                      initial={false}
                    />
                    
                    {/* Particle Effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                      {[...Array(4)].map((_, particleIndex) => (
                        <motion.div
                          key={particleIndex}
                          className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-60"
                          animate={{
                            x: [0, Math.random() * 50 - 25],
                            y: [0, Math.random() * 50 - 25],
                            opacity: [0, 0.6, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: particleIndex * 0.5
                          }}
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}