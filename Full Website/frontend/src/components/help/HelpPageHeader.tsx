'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Headphones, 
  MessageCircle, 
  HelpCircle,
  Clock,
  Star,
  Sparkles,
  Zap,
  Shield,
  Award
} from 'lucide-react'

interface HelpPageHeaderProps {
  isHydrated: boolean
}

export default function HelpPageHeader({ isHydrated }: HelpPageHeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }
    
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    checkDarkMode()
    
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      clearInterval(timer)
      observer.disconnect()
    }
  }, [])

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-12 h-12 border-4 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full" />
          <motion.div
            className="absolute inset-2 border-4 border-transparent border-t-cyan-400 border-l-pink-400 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-black px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        Skip to main content
      </a>

      {/* Executive Banking Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Banking Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2280%22 height=%2280%22 viewBox=%220 0 80 80%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%230D9488%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M0 0h40v40H0z%22/%3E%3Cpath d=%22M40 40h40v40H40z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        
        {/* Floating Support Symbols */}
        <motion.div 
          className="absolute top-20 left-20 w-24 h-24 opacity-15"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <Headphones className="w-full h-full text-teal-300" />
        </motion.div>
        
        <motion.div 
          className="absolute top-40 right-20 w-20 h-20 opacity-15"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 3, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          aria-hidden="true"
        >
          <MessageCircle className="w-full h-full text-blue-300" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-20 left-40 w-28 h-28 opacity-12"
          animate={{ 
            y: [0, -10, 0],
            x: [0, 10, 0],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          aria-hidden="true"
        >
          <div className="w-full h-full rounded-full border-4 border-teal-300 flex items-center justify-center">
            <HelpCircle className="text-teal-300 h-8 w-8" />
          </div>
        </motion.div>

        {/* Support Particles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full mix-blend-overlay filter blur-xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-teal-500/15 rounded-full mix-blend-overlay filter blur-xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-3/4 left-1/3 w-24 h-24 bg-blue-400/8 rounded-full mix-blend-overlay filter blur-xl animate-float" style={{ animationDelay: '6s' }} />
      </div>

      {/* Hero Section - "Executive Support Center" */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Premium 3D Support Emblem */}
        <motion.div
          className="relative inline-flex items-center justify-center mb-8 z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Orbital Rings */}
          <motion.div
            className="absolute w-32 h-32 rounded-full border-2 opacity-30"
            style={{
              borderColor: isDarkMode ? '#6366F1' : '#8B5CF6',
              borderStyle: 'dashed'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          
          <motion.div
            className="absolute w-40 h-40 rounded-full border opacity-20"
            style={{
              borderColor: isDarkMode ? '#06B6D4' : '#10B981',
              borderStyle: 'dotted'
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* Main Logo Container */}
          <motion.div
            className="relative w-24 h-24 rounded-3xl flex items-center justify-center overflow-hidden"
            style={{
              background: isDarkMode
                ? 'linear-gradient(145deg, #1E293B 0%, #334155 50%, #475569 100%)'
                : 'linear-gradient(145deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              boxShadow: isDarkMode
                ? '0 25px 60px rgba(99, 102, 241, 0.4), inset 0 2px 0 rgba(255,255,255,0.1)'
                : '0 25px 60px rgba(139, 92, 246, 0.4), inset 0 2px 0 rgba(255,255,255,0.3)'
            }}
            whileHover={{ 
              scale: 1.05,
              rotateY: 10,
              rotateX: 10
            }}
            animate={{
              boxShadow: isDarkMode ? [
                '0 25px 60px rgba(99, 102, 241, 0.4), inset 0 2px 0 rgba(255,255,255,0.1)',
                '0 35px 80px rgba(99, 102, 241, 0.6), inset 0 2px 0 rgba(255,255,255,0.2)',
                '0 25px 60px rgba(99, 102, 241, 0.4), inset 0 2px 0 rgba(255,255,255,0.1)'
              ] : [
                '0 25px 60px rgba(139, 92, 246, 0.4), inset 0 2px 0 rgba(255,255,255,0.3)',
                '0 35px 80px rgba(139, 92, 246, 0.6), inset 0 2px 0 rgba(255,255,255,0.4)',
                '0 25px 60px rgba(139, 92, 246, 0.4), inset 0 2px 0 rgba(255,255,255,0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span 
              className="text-3xl font-black tracking-wider relative z-10"
              style={{ 
                color: isDarkMode ? '#F1F5F9' : '#FFFFFF',
                textShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}
            >
              BNC
            </span>
            
            {/* Premium Holographic Effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)'
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
          </motion.div>
          
          {/* Excellence Badges */}
          <motion.div
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
            }}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Award className="h-4 w-4 text-white" />
          </motion.div>
          
          <motion.div
            className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full flex items-center justify-center"
            style={{
              background: isDarkMode
                ? 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)'
                : 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 100%)',
              boxShadow: '0 6px 16px rgba(6, 182, 212, 0.4)'
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [360, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          >
            <Shield className="h-3 w-3 text-white" />
          </motion.div>
          
          {/* Floating Sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 60}px`,
                top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 60}px`
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut'
              }}
            >
              <Sparkles 
                className="w-3 h-3" 
                style={{ color: isDarkMode ? '#60A5FA' : '#A78BFA' }} 
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Premium Support Title */}
        <motion.div className="text-center mb-6">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-2"
            style={{ 
              fontFamily: '"Poppins", sans-serif',
              background: isDarkMode
                ? 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 50%, #CBD5E1 100%)'
                : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 50%, #E2E8F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              letterSpacing: '-0.02em',
              lineHeight: 1.1
            }}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Premium Support
          </motion.h1>
          
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Zap 
                className="w-6 h-6" 
                style={{ color: isDarkMode ? '#60A5FA' : '#8B5CF6' }} 
              />
            </motion.div>
            <span 
              className="text-xl font-bold"
              style={{ 
                color: isDarkMode ? '#E2E8F0' : '#1F2937',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Experience Excellence
            </span>
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Star 
                className="w-6 h-6" 
                style={{ color: isDarkMode ? '#34D399' : '#F59E0B' }} 
              />
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.p 
          className="text-lg sm:text-xl text-white/95 font-semibold mb-3"
          style={{ fontFamily: '"Inter", sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Your Success Is Our Priority
        </motion.p>

        {/* Premium Status Dashboard */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, staggerChildren: 0.1 }}
        >
          {[
            {
              icon: <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />,
              label: '24/7 Elite Support',
              value: 'Always Online',
              color: isDarkMode ? '#34D399' : '#10B981',
              delay: 0
            },
            {
              icon: <Clock className="h-4 w-4" />,
              label: 'Response Time',
              value: `${Math.floor(Math.random() * 3) + 1} min`,
              color: isDarkMode ? '#60A5FA' : '#3B82F6',
              delay: 0.1
            },
            {
              icon: <Star className="h-4 w-4" />,
              label: 'Success Rate',
              value: '99.2%',
              color: isDarkMode ? '#FBBF24' : '#F59E0B',
              delay: 0.2
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center p-4 rounded-2xl backdrop-blur-md"
              style={{
                background: isDarkMode
                  ? 'rgba(15, 23, 42, 0.6)'
                  : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${stat.color}40`,
                boxShadow: `0 8px 25px ${stat.color}20`
              }}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: stat.delay }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: `0 15px 35px ${stat.color}30`
              }}
            >
              <motion.div
                className="flex items-center justify-center mb-2"
                style={{ color: stat.color }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: index === 1 ? [0, 360] : 0
                }}
                transition={{ 
                  duration: index === 1 ? 10 : 2, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
              >
                {stat.icon}
              </motion.div>
              <span 
                className="text-lg font-black mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
              <span 
                className="text-xs font-medium text-center leading-tight"
                style={{ color: isDarkMode ? '#CBD5E1' : '#64748B' }}
              >
                {stat.label}
              </span>
              
              {/* Live update indicator */}
              <motion.div
                className="w-full h-1 rounded-full mt-2 overflow-hidden"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: stat.color }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: 'easeInOut',
                    delay: stat.delay
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Premium Greeting */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <p
            className="text-lg font-semibold mb-2"
            style={{ 
              color: isDarkMode ? '#F1F5F9' : '#1F2937',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            How can we exceed your expectations today?
          </p>
          
          <motion.div
            className="flex items-center justify-center gap-2 text-sm"
            style={{ color: isDarkMode ? '#94A3B8' : '#64748B' }}
          >
            <span>Local time:</span>
            <motion.span
              className="font-mono font-bold"
              style={{ color: isDarkMode ? '#60A5FA' : '#3B82F6' }}
              key={currentTime.toLocaleTimeString()}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {currentTime.toLocaleTimeString()}
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  )
}