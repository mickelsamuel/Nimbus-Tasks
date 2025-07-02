'use client'

import { useState, useEffect, Suspense } from 'react'
import { 
  Brain, TrendingUp, Target, Lightbulb, 
  Award, BookOpen, Users, Zap, 
  ArrowUp, ArrowDown, BarChart3,
  Calendar, Clock, Star, Sparkles,
  Activity, Eye,
  Play, Pause, RefreshCw
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Avatar3D from './Avatar3D'

interface Insights {
  weeklyPerformance: string
  strongestSkill: string
  improvementArea: string
  recommendations: string[]
}

interface DashboardInsightsProps {
  insights: Insights
  achievements: string[]
}

export function DashboardInsights({ insights, achievements }: DashboardInsightsProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [currentRecommendation, setCurrentRecommendation] = useState(0)
  const [isRotationPaused, setIsRotationPaused] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  useEffect(() => {
    setIsVisible(true)
    
    // Rotate recommendations every 5 seconds unless paused
    if (!isRotationPaused) {
      const interval = setInterval(() => {
        setCurrentRecommendation(prev => 
          (prev + 1) % insights.recommendations.length
        )
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [insights.recommendations.length, isRotationPaused])

  const getPerformanceTrend = (performance: string) => {
    if (performance.includes('more') || performance.includes('15%')) {
      return { icon: ArrowUp, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' }
    }
    if (performance.includes('less') || performance.includes('below')) {
      return { icon: ArrowDown, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' }
    }
    return { icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' }
  }

  const performanceTrend = getPerformanceTrend(insights.weeklyPerformance)

  return (
    <div className={`
      space-y-8 transition-all duration-700 
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      {/* Modern Header with Gradient */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left: Header Text */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full border border-white/30">
                <span className="text-sm font-semibold text-white flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Powered</span>
                </span>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-3">
              AI Insights
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Personalized insights powered by AI
            </p>
            
            {/* Real-time Analytics Badge */}
            <div className="mt-6 flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 backdrop-blur-xl rounded-full border border-green-400/30">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-300">Live Analytics</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 backdrop-blur-xl rounded-full border border-blue-400/30">
                <Activity className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-medium text-blue-300">Real-time Tracking</span>
              </div>
            </div>
          </div>
          
          {/* Right: 3D Avatar Integration */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="relative">
              <Suspense fallback={
                <div className="w-48 h-48 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-white animate-spin" />
                </div>
              }>
                <Avatar3D 
                  size="lg" 
                  autoRotate={true} 
                  enableControls={false}
                  className="w-48 h-48 backdrop-blur-xl border-2 border-white/30 shadow-2xl"
                />
              </Suspense>
              
              {/* Floating Stats around Avatar */}
              <div className="absolute -top-4 -right-4 p-3 bg-yellow-500/90 backdrop-blur-xl rounded-2xl border border-yellow-400/50 shadow-xl">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-white" />
                  <span className="text-sm font-bold text-white">+1,250 XP</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 p-3 bg-green-500/90 backdrop-blur-xl rounded-2xl border border-green-400/50 shadow-xl">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-white" />
                  <span className="text-sm font-bold text-white">85% Growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Revolutionary Insights Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Performance - Enhanced */}
        <div 
          className={`
            relative overflow-hidden rounded-3xl p-8 transition-all duration-500 transform hover:scale-105 cursor-pointer
            ${hoveredCard === 'performance' ? 'shadow-2xl shadow-blue-500/25' : 'shadow-xl'}
            bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700
          `}
          onMouseEnter={() => setHoveredCard('performance')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
                <performanceTrend.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs text-white/80 uppercase tracking-wide font-bold">
                  Weekly Performance
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <Calendar className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">This week</span>
                </div>
              </div>
            </div>
            
            <p className="text-lg text-white leading-relaxed mb-6">
              {insights.weeklyPerformance}
            </p>
            
            {/* Performance Meter */}
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Performance Score</span>
                <span className="text-lg font-bold text-white">87%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-1000" style={{width: '87%'}} />
              </div>
            </div>
          </div>
        </div>

        {/* Strongest Skill - Enhanced */}
        <div 
          className={`
            relative overflow-hidden rounded-3xl p-8 transition-all duration-500 transform hover:scale-105 cursor-pointer
            ${hoveredCard === 'skill' ? 'shadow-2xl shadow-emerald-500/25' : 'shadow-xl'}
            bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700
          `}
          onMouseEnter={() => setHoveredCard('skill')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs text-white/80 uppercase tracking-wide font-bold">
                  Strongest Skill
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <Award className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">Excelling</span>
                </div>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-2">
              {insights.strongestSkill}
            </div>
            <p className="text-white/90 mb-6">
              Top performing area
            </p>
            
            {/* Skill Level Indicator */}
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">Mastery Level</span>
                    <span className="text-lg font-bold text-white">Expert</span>
                  </div>
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className={`h-4 w-4 ${ star <= 4 ? 'text-yellow-300 fill-current' : 'text-white/30'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Area - Enhanced */}
        <div 
          className={`
            relative overflow-hidden rounded-3xl p-8 transition-all duration-500 transform hover:scale-105 cursor-pointer
            ${hoveredCard === 'improvement' ? 'shadow-2xl shadow-orange-500/25' : 'shadow-xl'}
            bg-gradient-to-br from-orange-500 via-red-500 to-pink-600
          `}
          onMouseEnter={() => setHoveredCard('improvement')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs text-white/80 uppercase tracking-wide font-bold">
                  Improvement Area
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-white/60" />
                  <span className="text-xs text-white/60">Growth opportunity</span>
                </div>
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-2">
              {insights.improvementArea}
            </div>
            <p className="text-white/90 mb-6">
              Focus area for growth
            </p>
            
            {/* Growth Tracker */}
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Growth Potential</span>
                <span className="text-lg font-bold text-white">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-white" />
                <span className="text-sm text-white">+23% improvement this month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revolutionary Smart Recommendations */}
      <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Smart Recommendations
                </h3>
                <p className="text-white/80">
                  Personalized suggestions based on your performance
                </p>
              </div>
            </div>
            
            {/* Enhanced Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsRotationPaused(!isRotationPaused)}
                className="p-3 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-200"
              >
                {isRotationPaused ? 
                  <Play className="h-5 w-5 text-white" /> : 
                  <Pause className="h-5 w-5 text-white" />
                }
              </button>
              
              <div className="flex space-x-2">
                {insights.recommendations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentRecommendation(index)}
                    className={`
                      w-3 h-3 rounded-full transition-all duration-300
                      ${index === currentRecommendation 
                        ? 'bg-white scale-125' 
                        : 'bg-white/40 hover:bg-white/60'
                      }
                    `}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Rotating Recommendations */}
          <div className="relative overflow-hidden h-32 mb-8">
            {insights.recommendations.map((recommendation, index) => (
              <div
                key={index}
                className={`
                  absolute inset-0 transition-all duration-700 ease-in-out
                  ${index === currentRecommendation 
                    ? 'translate-x-0 opacity-100 scale-100' 
                    : index < currentRecommendation 
                      ? '-translate-x-full opacity-0 scale-95' 
                      : 'translate-x-full opacity-0 scale-95'
                  }
                `}
              >
                <div className="p-6 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 h-full flex items-center">
                  <div className="flex items-start space-x-4 w-full">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold text-white">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-lg text-white leading-relaxed font-medium">
                        {recommendation}
                      </p>
                      <div className="mt-3 flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-white/60" />
                        <span className="text-sm text-white/60">AI-generated insight</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/modules')}
              className="group p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-white">View Modules</span>
              </div>
            </button>
            
            <button 
              onClick={() => router.push('/friends-teams')}
              className="group p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-white">Join Study Group</span>
              </div>
            </button>
            
            <button 
              onClick={() => router.push('/modules')}
              className="group p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-white">Take Quiz</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Revolutionary Recent Achievements */}
      {achievements.length > 0 && (
        <div className="relative rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 p-8 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Recent Achievements
                </h3>
                <p className="text-white/80">
                  Latest accomplishments and milestones
                </p>
              </div>
              
              {/* Achievement Count Badge */}
              <div className="ml-auto p-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{achievements.length}</div>
                  <div className="text-xs text-white/80">Total</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {achievements.slice(0, 3).map((achievement, index) => (
                <div 
                  key={index} 
                  className="group p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center border-2 border-white">
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-white mb-1">
                        {achievement}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-white/60" />
                        <span className="text-sm text-white/60">Earned recently</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">+500 XP</div>
                      <div className="text-xs text-white/60">Bonus</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Button */}
            {achievements.length > 3 && (
              <div className="mt-6 text-center">
                <button className="px-6 py-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                  <span className="font-semibold text-white">View All {achievements.length} Achievements</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}