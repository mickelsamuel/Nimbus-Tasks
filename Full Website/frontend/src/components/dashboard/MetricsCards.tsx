'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, Target, TrendingUp, Clock,
  ArrowUp, ArrowDown, Minus, Zap, Star
} from 'lucide-react'

interface MetricsCardsProps {
  stats: {
    assignedModules: number
    inProgressModules: number
    completedModules: number
    xpEarned: number
    weeklyProgress: number
    streak: number
    level: number
    nextLevelProgress: number
  }
}

interface MetricCardData {
  id: string
  title: string
  value: number
  previousValue?: number
  icon: React.ReactNode
  color: string
  bgColor: string
  borderColor: string
  sparklineData?: number[]
  suffix?: string
  format?: 'number' | 'percentage' | 'currency'
  trend?: 'up' | 'down' | 'neutral'
  description?: string
}

export default function MetricsCards({ stats }: MetricsCardsProps) {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    // Animate counters with spring physics
    const animateValue = (key: string, endValue: number, duration: number = 2000) => {
      const startTime = Date.now()
      const startValue = 0
      
      const animate = () => {
        const currentTime = Date.now()
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Spring easing function
        const easeOutElastic = (t: number) => {
          const c4 = (2 * Math.PI) / 3
          return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1
        }
        
        const currentValue = startValue + (endValue - startValue) * easeOutElastic(progress)
        
        setAnimatedValues(prev => ({
          ...prev,
          [key]: Math.floor(currentValue)
        }))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }

    // Stagger the animations
    setTimeout(() => animateValue('completed', stats.completedModules), 100)
    setTimeout(() => animateValue('inProgress', stats.inProgressModules), 300)
    setTimeout(() => animateValue('assigned', stats.assignedModules), 500)
    setTimeout(() => animateValue('points', stats.xpEarned), 700)
    setTimeout(() => animateValue('weekly', stats.weeklyProgress), 900)
    setTimeout(() => animateValue('streak', stats.streak), 1100)
    
  }, [stats])

  const metricsData: MetricCardData[] = [
    {
      id: 'completed',
      title: 'Modules Completed',
      value: animatedValues.completed || 0,
      previousValue: stats.completedModules - 2,
      icon: <BookOpen className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: 'up',
      description: 'Total modules you have completed',
      sparklineData: [12, 14, 16, 15, 18, stats.completedModules]
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      value: animatedValues.inProgress || 0,
      icon: <Target className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Modules currently in progress'
    },
    {
      id: 'assigned',
      title: 'Assigned Modules',
      value: animatedValues.assigned || 0,
      icon: <Clock className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Total modules assigned to you'
    },
    {
      id: 'points',
      title: 'Experience Points',
      value: animatedValues.points || 0,
      previousValue: stats.xpEarned - 500,
      icon: <Star className="h-6 w-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      trend: 'up',
      format: 'number',
      description: 'Total experience earned',
      sparklineData: [7800, 8200, 8600, 8900, 9000, stats.xpEarned]
    },
    {
      id: 'weekly',
      title: 'Weekly Progress',
      value: animatedValues.weekly || 0,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      suffix: '%',
      format: 'percentage',
      description: 'Progress made this week'
    },
    {
      id: 'streak',
      title: 'Learning Streak',
      value: animatedValues.streak || 0,
      previousValue: stats.streak - 1,
      icon: <Zap className="h-6 w-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      suffix: ` days`,
      trend: 'up',
      description: 'Consecutive days of learning'
    }
  ]

  const formatValue = (value: number, format?: string, suffix?: string) => {
    let formattedValue = value.toLocaleString()
    
    if (format === 'percentage') {
      formattedValue = `${value}%`
    } else if (format === 'currency') {
      formattedValue = `$${value.toLocaleString()}`
    } else if (suffix) {
      formattedValue = `${value.toLocaleString()}${suffix}`
    }
    
    return formattedValue
  }

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <ArrowUp className="h-4 w-4 text-green-500" />
    if (trend === 'down') return <ArrowDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const renderSparkline = (data?: number[]) => {
    if (!data || data.length < 2) return null
    
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60
      const y = 20 - ((value - min) / range) * 20
      return `${x},${y}`
    }).join(' ')
    
    return (
      <svg width="60" height="20" className="ml-auto">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={points}
          className="opacity-60"
        />
      </svg>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {metricsData.map((metric, index) => (
        <div
          key={metric.id}
          className={`
            dashboard-card relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 transition-all duration-500 hover:scale-105 hover:shadow-xl
            ${metric.bgColor} ${metric.borderColor}
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{
            transitionDelay: `${index * 100}ms`,
            background: `linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)`,
            backdropFilter: 'blur(20px) saturate(150%)'
          }}
        >
          {/* Premium glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 pointer-events-none" />
          
          <div className="relative z-10">
            {/* Header with icon and trend */}
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${metric.bgColor} ${metric.color}`}>
                {metric.icon}
              </div>
              
              {metric.trend && (
                <div className="flex items-center space-x-1">
                  {getTrendIcon(metric.trend)}
                  {metric.previousValue && (
                    <span className="text-xs text-gray-500">
                      {metric.trend === 'up' ? '+' : ''}
                      {metric.value - metric.previousValue}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Value with animated counter */}
            <div className="mb-2">
              <div className={`text-2xl sm:text-3xl font-bold ${metric.color} mb-1 font-mono`}>
                {formatValue(metric.value, metric.format, metric.suffix)}
              </div>
              <h3 className="text-sm font-semibold text-gray-700 leading-tight">
                {metric.title}
              </h3>
              {metric.description && (
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {metric.description}
                </p>
              )}
            </div>

            {/* Micro-sparkline chart */}
            {metric.sparklineData && (
              <div className={`flex items-center mt-3 ${metric.color}`}>
                {renderSparkline(metric.sparklineData)}
              </div>
            )}

            {/* Circular progress for percentage values */}
            {metric.format === 'percentage' && (
              <div className="mt-3 sm:mt-4">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - metric.value / 100)}`}
                      className={`${metric.color} transition-all duration-2000 ease-out`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-sm sm:text-lg font-bold ${metric.color}`}>
                      {metric.value}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Gradient highlight on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000 pointer-events-none" />
          </div>
        </div>
      ))}
    </div>
  )
}