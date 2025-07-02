'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  User, Crown, Star, Zap, Heart, Sparkles, 
  CloudSun, Cloud, Sun
} from 'lucide-react'

interface HeroSectionProps {
  welcomeData: {
    greeting: string
    motivationalMessage: string
    weatherAware: boolean
    achievements: string[]
  }
  stats: {
    level: number
    xpEarned: number
    streak: number
    nextLevelProgress: number
  }
  userName?: string
}

export default function HeroSection({ welcomeData, stats }: HeroSectionProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [avatarAnimation, setAvatarAnimation] = useState('breathing')
  const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, opacity: number }>>([])
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Mouse tracking for eye following effect
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    // Gesture animations based on time of day
    const hour = currentTime.getHours()
    if (hour < 6) {
      setAvatarAnimation('sleeping')
    } else if (hour < 12) {
      setAvatarAnimation('energetic')
    } else if (hour < 18) {
      setAvatarAnimation('focused')
    } else {
      setAvatarAnimation('relaxed')
    }
  }, [currentTime])

  useEffect(() => {
    // Particle effect generation
    const generateParticles = () => {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.7 + 0.3
      }))
      setParticles(newParticles)
    }

    generateParticles()
    const particleTimer = setInterval(generateParticles, 3000)
    return () => clearInterval(particleTimer)
  }, [])

  const getWeatherIcon = () => {
    // Simple weather simulation based on time
    const hour = currentTime.getHours()
    if (hour < 6 || hour > 20) return <CloudSun className="h-6 w-6 text-purple-400" />
    if (hour < 12) return <Sun className="h-6 w-6 text-yellow-400" />
    if (hour < 18) return <CloudSun className="h-6 w-6 text-orange-400" />
    return <Cloud className="h-6 w-6 text-gray-400" />
  }

  const getIntelligentGreeting = () => {
    const hour = currentTime.getHours()
    const isWeekend = [0, 6].includes(currentTime.getDay())
    
    // Weather-aware and achievement-based greetings
    let greeting = welcomeData.greeting
    
    if (welcomeData.achievements.length > 0) {
      const recentAchievement = welcomeData.achievements[0]
      greeting += ` Congratulations on ${recentAchievement.toLowerCase()}!`
    }
    
    if (stats.streak > 7) {
      greeting += ` Your ${stats.streak}-day learning streak is impressive!`
    }
    
    if (isWeekend && hour > 9) {
      greeting += ` Enjoying your weekend learning session?`
    }
    
    return greeting
  }

  const getEyePosition = () => {
    const maxMove = 8
    const eyeX = ((mousePosition.x - 50) / 50) * maxMove
    const eyeY = ((mousePosition.y - 50) / 50) * maxMove
    return { x: eyeX, y: eyeY }
  }

  const eyePos = getEyePosition()

  return (
    <div 
      ref={heroRef}
      className="relative min-h-[400px] rounded-3xl overflow-hidden mb-8"
      style={{
        background: `conic-gradient(from 45deg,
          #E01A1A 0deg, #FF6B6B 60deg, #E01A1A 120deg,
          #FF9800 180deg, #E01A1A 240deg, #FF6B6B 300deg, #E01A1A 360deg)`,
        animation: 'gradientRotate 20s linear infinite'
      }}
    >
      {/* Particle Effects */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animation: `float 6s ease-in-out infinite ${Math.random() * 2}s`
          }}
        />
      ))}

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      <div className="relative z-10 p-8 h-full flex items-center">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - 3D Holographic Avatar */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              {/* Holographic base */}
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-600/30 backdrop-blur-xl border border-white/30 flex items-center justify-center relative overflow-hidden">
                
                {/* Avatar with real-time breathing and gesture animations */}
                <div 
                  className={`w-32 h-32 rounded-full bg-gradient-to-br from-white/90 to-white/70 flex items-center justify-center transform transition-all duration-2000 ${
                    avatarAnimation === 'breathing' ? 'avatar-breathing scale-105' :
                    avatarAnimation === 'energetic' ? 'avatar-energetic' :
                    avatarAnimation === 'focused' ? 'avatar-focused scale-110' :
                    avatarAnimation === 'relaxed' ? 'avatar-relaxed scale-95' :
                    avatarAnimation === 'sleeping' ? 'avatar-sleeping scale-90 opacity-80' : 'scale-100'
                  }`}
                >
                  {/* Eyes with tracking */}
                  <div className="relative">
                    <User className="h-20 w-20 text-primary-600" />
                    {/* Eye tracking overlay */}
                    <div className="absolute top-4 left-6 w-3 h-3 bg-primary-800 rounded-full transition-transform duration-300"
                         style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }} />
                    <div className="absolute top-4 right-6 w-3 h-3 bg-primary-800 rounded-full transition-transform duration-300"
                         style={{ transform: `translate(${eyePos.x}px, ${eyePos.y}px)` }} />
                  </div>
                </div>

                {/* Particle effects around avatar */}
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-yellow-300 animate-spin" />
                </div>
                <div className="absolute -bottom-2 -left-2">
                  <Star className="h-4 w-4 text-blue-300 animate-pulse" />
                </div>
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <Zap className="h-5 w-5 text-purple-300 animate-bounce" />
                </div>

                {/* Holographic scan lines */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent transform translate-y-full animate-scan" />
              </div>

              {/* Level indicator floating above */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
                <Crown className="h-4 w-4" />
                <span>Level {stats.level}</span>
              </div>

              {/* XP floating indicator */}
              <div className="absolute -bottom-4 right-0 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg animate-pulse">
                <Star className="h-4 w-4" />
                <span>{stats.xpEarned.toLocaleString()} XP</span>
              </div>
            </div>
          </div>

          {/* Right Side - Dynamic Welcome Experience */}
          <div className="text-white space-y-6">
            {/* Weather-aware greeting with time */}
            <div className="flex items-center space-x-3 mb-4">
              {getWeatherIcon()}
              <span className="text-lg text-white/90">
                {currentTime.toLocaleString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {/* Intelligent greeting */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                {getIntelligentGreeting()}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                {welcomeData.motivationalMessage}
              </p>
            </div>

            {/* Metric visualization with animated counters */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              
              {/* Streak Counter */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="h-5 w-5 text-red-300" />
                  <span className="text-sm text-white/80">Learning Streak</span>
                </div>
                <div className="text-2xl font-bold text-white flex items-center space-x-1">
                  <span className="animate-pulse">{stats.streak}</span>
                  <span className="text-sm text-white/70">days</span>
                </div>
                {/* Micro sparkline */}
                <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-400 to-pink-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(stats.streak * 5, 100)}%` }}
                  />
                </div>
              </div>

              {/* Level Progress */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm text-white/80">Level Progress</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.nextLevelProgress}%
                </div>
                {/* Circular progress indicator */}
                <div className="mt-2 relative w-8 h-8">
                  <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-white/20"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 14}`}
                      strokeDashoffset={`${2 * Math.PI * 14 * (1 - stats.nextLevelProgress / 100)}`}
                      className="text-yellow-400 transition-all duration-1000"
                    />
                  </svg>
                </div>
              </div>

              {/* Achievement badge */}
              {welcomeData.achievements.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-300" />
                    <span className="text-sm text-white/80">Latest Achievement</span>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {welcomeData.achievements[0]}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations - Exact Guidelines Compliance */}
      <style jsx>{`
        @keyframes gradientRotate {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
        
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        @keyframes badgeGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
            transform: scale(1.05);
          }
        }
        
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
        
        .hero-glassmorphism {
          background:
            radial-gradient(circle at 20% 80%, rgba(224,26,26,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,152,0,0.15) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
          backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow:
            0 8px 32px rgba(0,0,0,0.08),
            0 32px 64px rgba(224,26,26,0.08),
            inset 0 1px 0 rgba(255,255,255,0.4);
        }

        /* Avatar Gesture Animations - Exact Guidelines */
        .avatar-breathing {
          animation: breathing 3s ease-in-out infinite;
        }
        
        .avatar-energetic {
          animation: energetic 1.5s ease-in-out infinite;
        }
        
        .avatar-focused {
          animation: focused 4s ease-in-out infinite;
        }
        
        .avatar-relaxed {
          animation: relaxed 5s ease-in-out infinite;
        }
        
        .avatar-sleeping {
          animation: sleeping 6s ease-in-out infinite;
        }

        @keyframes breathing {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(1deg); }
        }

        @keyframes energetic {
          0%, 100% { transform: scale(1) translateY(0px) rotate(0deg); }
          25% { transform: scale(1.1) translateY(-3px) rotate(2deg); }
          75% { transform: scale(1.1) translateY(-3px) rotate(-2deg); }
        }

        @keyframes focused {
          0%, 100% { transform: scale(1.1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(1deg); }
        }

        @keyframes relaxed {
          0%, 100% { transform: scale(0.95) rotate(0deg); }
          50% { transform: scale(1) rotate(-1deg); }
        }

        @keyframes sleeping {
          0%, 100% { transform: scale(0.9) rotate(-2deg); opacity: 0.7; }
          50% { transform: scale(0.85) rotate(2deg); opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}