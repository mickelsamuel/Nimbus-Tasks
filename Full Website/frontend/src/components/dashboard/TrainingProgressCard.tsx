'use client'

import { useState, useEffect } from 'react'
import { 
  Target, Star, Crown, Zap, Flame,
  CheckCircle, Trophy,
  MapPin, Route, Sparkles
} from 'lucide-react'

interface LearningProgress {
  currentPath: string
  completedModules: number
  totalModules: number
  estimatedCompletion: string
  nextMilestone: string
  xpGained: number
  xpToNextLevel: number
}

interface TrainingProgressCardProps {
  learningProgress: LearningProgress
  stats: {
    level: number
    streak: number
    pointsEarned: number
    nextLevelProgress: number
  }
}

interface TimelineNode {
  id: string
  title: string
  type: 'completed' | 'current' | 'upcoming' | 'milestone'
  xp: number
  isUnlocked: boolean
  position: number
}

export default function TrainingProgressCard({ learningProgress, stats }: TrainingProgressCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedXP, setAnimatedXP] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    // Animate XP counter
    const duration = 2000
    const startTime = Date.now()
    const startValue = 0
    const endValue = learningProgress.xpGained
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setAnimatedXP(Math.floor(startValue + (endValue - startValue) * easeOutQuart))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [learningProgress.xpGained])

  // Generate timeline nodes based on progress
  const generateTimeline = (): TimelineNode[] => {
    const nodes: TimelineNode[] = []
    const completed = learningProgress.completedModules
    const total = learningProgress.totalModules
    
    // Add completed modules
    for (let i = 0; i < completed; i++) {
      nodes.push({
        id: `completed-${i}`,
        title: `Module ${i + 1}`,
        type: 'completed',
        xp: 250,
        isUnlocked: true,
        position: (i / total) * 100
      })
    }
    
    // Add current module
    if (completed < total) {
      nodes.push({
        id: 'current',
        title: `Module ${completed + 1}: Current`,
        type: 'current',
        xp: 300,
        isUnlocked: true,
        position: (completed / total) * 100
      })
    }
    
    // Add upcoming modules
    for (let i = completed + 1; i < total; i++) {
      nodes.push({
        id: `upcoming-${i}`,
        title: `Module ${i + 1}`,
        type: 'upcoming',
        xp: 250,
        isUnlocked: i <= completed + 3, // Unlock next 3 modules
        position: (i / total) * 100
      })
    }
    
    // Add milestones
    const milestonePositions = [25, 50, 75, 100]
    milestonePositions.forEach((pos, index) => {
      if (pos <= (completed / total) * 100 + 5) { // Add some buffer
        nodes.push({
          id: `milestone-${index}`,
          title: `${pos}% Milestone`,
          type: 'milestone',
          xp: 500,
          isUnlocked: true,
          position: pos
        })
      }
    })
    
    return nodes.sort((a, b) => a.position - b.position)
  }

  const timelineNodes = generateTimeline()
  const completionPercentage = (learningProgress.completedModules / learningProgress.totalModules) * 100


  const getNodeColor = (node: TimelineNode) => {
    switch (node.type) {
      case 'completed':
        return 'bg-green-500 border-green-600'
      case 'current':
        return 'bg-blue-500 border-blue-600 animate-pulse'
      case 'milestone':
        return 'bg-yellow-500 border-yellow-600'
      default:
        return node.isUnlocked ? 'bg-gray-300 border-gray-400' : 'bg-gray-200 border-gray-300'
    }
  }

  return (
    <div className={`
      dashboard-card bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 
      border border-gray-200/20 dark:border-gray-700/20 shadow-xl
      transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            Training Progress
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {learningProgress.currentPath}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Route className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
          <span className="text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400">
            Interactive Timeline
          </span>
        </div>
      </div>

      {/* 3D Progress Ring */}
      <div className="flex items-center justify-center mb-6 sm:mb-8">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
          {/* Outer ring */}
          <svg className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 transform -rotate-90" viewBox="0 0 192 192">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E01A1A" />
                <stop offset="50%" stopColor="#FF6B6B" />
                <stop offset="100%" stopColor="#FF9800" />
              </linearGradient>
            </defs>
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="url(#progressGradient)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - completionPercentage / 100)}`}
              className="transition-all duration-2000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {Math.round(completionPercentage)}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                Complete
              </div>
              <div className="flex items-center space-x-1 text-xs text-purple-600 dark:text-purple-400">
                <Zap className="h-3 w-3" />
                <span>{animatedXP.toLocaleString()} XP</span>
              </div>
            </div>
          </div>

          {/* Orbital XP animations */}
          <div className="absolute inset-4">
            <div className="relative w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <Star className="h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
                <Trophy className="h-4 w-4 text-orange-400 animate-pulse" />
              </div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
                <Flame className="h-4 w-4 text-red-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          <span>Learning Path Timeline</span>
        </h4>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700" />
          <div 
            className="absolute left-6 top-8 w-0.5 bg-gradient-to-b from-green-500 to-blue-500 transition-all duration-2000"
            style={{ height: `${Math.max(0, Math.min(100, isNaN(completionPercentage) ? 0 : completionPercentage))}%` }}
          />
          
          {/* Timeline nodes */}
          <div className="space-y-4">
            {timelineNodes.slice(0, 6).map((node, index) => (
              <div 
                key={node.id}
                className={`
                  relative flex items-center space-x-4 p-3 rounded-lg transition-all duration-300
                  ${node.type === 'current' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' : ''}
                  ${node.isUnlocked ? 'opacity-100' : 'opacity-50'}
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Node indicator */}
                <div className={`
                  relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${getNodeColor(node)}
                `}>
                  {node.type === 'milestone' ? (
                    <Crown className="h-3 w-3 text-white" />
                  ) : node.type === 'current' ? (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ) : node.type === 'completed' ? (
                    <CheckCircle className="h-3 w-3 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className={`
                      text-sm font-semibold
                      ${node.type === 'current' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}
                      ${!node.isUnlocked ? 'text-gray-400' : ''}
                    `}>
                      {node.title}
                    </h5>
                    <div className="flex items-center space-x-2">
                      <span className={`
                        text-xs font-medium px-2 py-1 rounded-full
                        ${node.type === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                          node.type === 'current' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                          node.type === 'milestone' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}
                      `}>
                        +{node.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gamified Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
          <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {learningProgress.completedModules}
          </div>
          <div className="text-xs text-green-700 dark:text-green-300">Completed</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
          <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {learningProgress.totalModules - learningProgress.completedModules}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Remaining</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
          <Crown className="h-6 w-6 text-purple-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {stats.level}
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-300">Level</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
          <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
            {stats.streak}
          </div>
          <div className="text-xs text-orange-700 dark:text-orange-300">Day Streak</div>
        </div>
      </div>

      {/* Next Milestone */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Next Milestone
            </h5>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {learningProgress.nextMilestone}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
              {learningProgress.xpToNextLevel.toLocaleString()} XP to go
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Estimated: {learningProgress.estimatedCompletion}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}