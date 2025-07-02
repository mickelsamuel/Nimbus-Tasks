'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  BookOpen, TrendingUp, Users, Trophy, ShoppingBag, MessageSquare, 
  Clock, ArrowRight, Sparkles, Zap, Crown, Star, Target, Calendar
} from 'lucide-react'

interface QuickAction {
  id: number
  title: string
  subtitle: string
  icon: string
  href: string
  progress?: number
  priority: string
  badge?: string
  participants?: number
}

interface QuickActionsHubProps {
  quickActions: QuickAction[]
}

export default function QuickActionsHub({ quickActions }: QuickActionsHubProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      BookOpen: <BookOpen className="h-6 w-6" />,
      TrendingUp: <TrendingUp className="h-6 w-6" />,
      Users: <Users className="h-6 w-6" />,
      Trophy: <Trophy className="h-6 w-6" />,
      ShoppingBag: <ShoppingBag className="h-6 w-6" />,
      MessageSquare: <MessageSquare className="h-6 w-6" />,
      Target: <Target className="h-6 w-6" />,
      Calendar: <Calendar className="h-6 w-6" />
    }
    return iconMap[iconName] || <Star className="h-6 w-6" />
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          size: 'large',
          bgGradient: 'from-red-50 via-red-100 to-red-50 dark:from-red-950 dark:to-red-900',
          borderColor: 'border-red-200 dark:border-red-700',
          iconBg: 'bg-red-100 dark:bg-red-900',
          iconColor: 'text-red-600 dark:text-red-400',
          badgeColor: 'bg-red-500'
        }
      case 'medium':
        return {
          size: 'medium',
          bgGradient: 'from-blue-50 via-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900',
          borderColor: 'border-blue-200 dark:border-blue-700',
          iconBg: 'bg-blue-100 dark:bg-blue-900',
          iconColor: 'text-blue-600 dark:text-blue-400',
          badgeColor: 'bg-blue-500'
        }
      default:
        return {
          size: 'small',
          bgGradient: 'from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900',
          borderColor: 'border-gray-200 dark:border-gray-700',
          iconBg: 'bg-gray-100 dark:bg-gray-800',
          iconColor: 'text-gray-600 dark:text-gray-400',
          badgeColor: 'bg-gray-500'
        }
    }
  }

  const getCardSize = (priority: string) => {
    if (priority === 'high') return 'col-span-2 row-span-2'
    if (priority === 'medium') return 'col-span-1 row-span-1'
    return 'col-span-1 row-span-1'
  }

  const getBadgeColor = (badge?: string) => {
    switch (badge?.toLowerCase()) {
      case 'live':
      case 'urgent':
        return 'bg-red-500 animate-pulse'
      case 'new':
      case 'updated':
        return 'bg-green-500'
      case 'in progress':
        return 'bg-blue-500'
      default:
        return 'bg-purple-500'
    }
  }

  const isTimeSensitive = (action: QuickAction) => {
    return action.badge?.toLowerCase().includes('live') || 
           action.badge?.toLowerCase().includes('urgent') ||
           action.title.toLowerCase().includes('deadline')
  }

  // Sort actions: time-sensitive first, then by priority
  const sortedActions = [...quickActions].sort((a, b) => {
    if (isTimeSensitive(a) && !isTimeSensitive(b)) return -1
    if (!isTimeSensitive(a) && isTimeSensitive(b)) return 1
    
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
  })

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Actions
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Jump into your most important tasks
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
            AI Recommended
          </span>
        </div>
      </div>

      {/* Smart Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 auto-rows-min">
        {sortedActions.map((action, index) => {
          const config = getPriorityConfig(action.priority)
          const isHovered = hoveredCard === action.id
          
          return (
            <Link
              key={action.id}
              href={action.href}
              className={`
                group relative overflow-hidden rounded-xl sm:rounded-2xl border-2 transition-all duration-500 hover:scale-105
                ${getCardSize(action.priority)}
                ${config.borderColor}
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                dashboard-card
              `}
              style={{
                transitionDelay: `${index * 100}ms`,
                background: `linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
                backdropFilter: 'blur(20px) saturate(150%)',
                transformStyle: 'preserve-3d'
              }}
              onMouseEnter={() => setHoveredCard(action.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Premium glassmorphism overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${config.bgGradient} opacity-60`} />
              
              {/* Hover effect overlay */}
              <div className={`
                absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                transform transition-transform duration-1000 pointer-events-none
                ${isHovered ? 'translate-x-0' : 'translate-x-full'}
              `} />

              <div className="relative z-10 p-4 sm:p-6 h-full flex flex-col">
                {/* Header with icon and badge */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className={`
                    p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12
                    ${config.iconBg} ${config.iconColor}
                  `}>
                    {getIconComponent(action.icon)}
                  </div>
                  
                  {action.badge && (
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-semibold text-white
                      ${getBadgeColor(action.badge)}
                    `}>
                      {action.badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors leading-tight">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                    {action.subtitle}
                  </p>

                  {/* Live content preview */}
                  {action.participants && (
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {action.participants} participants online
                      </span>
                    </div>
                  )}

                  {/* Progress bar for in-progress items */}
                  {action.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-300">Progress</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{action.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${action.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    {isTimeSensitive(action) && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          Time Sensitive
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <ArrowRight className={`
                    h-5 w-5 transition-all duration-300 group-hover:translate-x-1
                    ${config.iconColor}
                  `} />
                </div>

                {/* 3D hover effect shadow */}
                <div className={`
                  absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none
                  ${isHovered ? 'shadow-2xl shadow-primary-500/25' : ''}
                `} />
              </div>

              {/* Animated border accent */}
              <div className={`
                absolute inset-0 rounded-2xl border-2 border-transparent
                bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                bg-clip-border
              `} style={{ padding: '2px' }} />
            </Link>
          )
        })}
      </div>

      {/* Recommended for you section */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200/50 dark:border-purple-700/50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Recommended for You
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Personalized suggestions to boost your progress
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg sm:rounded-xl border border-white/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Level Up Fast</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Complete Risk Management Advanced module to earn 750 XP and advance quickly
            </p>
          </div>
          
          <div className="p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg sm:rounded-xl border border-white/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Join Team</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Join the Customer Excellence team for collaborative learning and peer support
            </p>
          </div>
          
          <div className="p-3 sm:p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg sm:rounded-xl border border-white/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Quick Win</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Take the 5-minute Compliance Basics quiz for an easy achievement
            </p>
          </div>
        </div>
      </div>

      {/* Exact Guidelines CSS Implementation */}
      <style jsx>{`
        .dashboard-card {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-style: preserve-3d;
        }
        
        .dashboard-card:hover {
          transform: translateY(-12px) rotateX(5deg) rotateY(2deg);
          box-shadow:
            0 20px 60px rgba(224,26,26,0.15),
            0 0 0 1px rgba(224,26,26,0.1);
        }
        
        .quick-action-card:hover {
          transform: translateY(-8px) rotateX(5deg);
          box-shadow: 0 20px 40px rgba(224,26,26,0.25);
        }
        
        .quick-action-card:hover::after {
          background: linear-gradient(135deg, rgba(224,26,26,0.9), rgba(255,107,107,0.9));
        }
        
        @keyframes cardEntrance {
          0% {
            opacity: 0;
            transform: translateY(40px) rotateX(-10deg) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateX(0) scale(1);
          }
        }
        
        .card-entrance {
          animation: cardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation-delay: calc(var(--card-index) * 0.1s);
        }
      `}</style>
    </div>
  )
}