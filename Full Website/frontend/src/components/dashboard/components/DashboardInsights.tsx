'use client'

import { useState, useEffect } from 'react'
import { 
  Trophy, TrendingUp, Target, Award, Star, Crown, Zap
} from 'lucide-react'
import type { Insights } from '@/types/dashboard'

interface DashboardInsightsProps {
  insights: Insights
  achievements: string[]
}

export function DashboardInsights({ insights, achievements }: DashboardInsightsProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Achievement Gallery */}
      <div className={`
        dashboard-glassmorphism rounded-2xl p-6 border border-gray-200/20 dark:border-gray-700/20 shadow-xl
        transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Achievement Gallery
          </h3>
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
              {achievements.length} Unlocked
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Recent Achievements */}
          <div className="group p-3 achievement-showcase achievement-badge hover:scale-105 transition-transform cursor-pointer">
            <Crown className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-xs text-center text-yellow-700 dark:text-yellow-300 font-semibold">
              Expert Level
            </div>
          </div>
          
          <div className="group p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:scale-105 transition-transform cursor-pointer">
            <Zap className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-xs text-center text-green-700 dark:text-green-300 font-semibold">
              Speed Learner
            </div>
          </div>
          
          <div className="group p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:scale-105 transition-transform cursor-pointer">
            <Star className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <div className="text-xs text-center text-purple-700 dark:text-purple-300 font-semibold">
              Team Player
            </div>
          </div>
        </div>
        
        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className={`
                flex items-center space-x-3 p-3 rounded-lg bg-gray-50/50 dark:bg-gray-700/50 
                hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors cursor-pointer
                ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Award className="h-4 w-4 text-yellow-500 flex-shrink-0" />
              <span className="text-sm text-gray-900 dark:text-white">{achievement}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced AI Insights */}
      <div className={`
        dashboard-glassmorphism rounded-2xl p-6 border border-gray-200/20 dark:border-gray-700/20 shadow-xl
        transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI-Powered Insights
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              Live Analysis
            </span>
          </div>
        </div>
        
        {/* Performance Analysis */}
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/30 dark:border-blue-700/30">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Performance Trend</span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {insights.weeklyPerformance}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200/30 dark:border-green-700/30">
              <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Strongest Skill</div>
              <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                {insights.strongestSkill}
              </div>
            </div>
            
            <div className="p-3 bg-navy-50 dark:bg-navy-900/20 rounded-lg border border-navy-200/30 dark:border-navy-700/30">
              <div className="text-xs text-navy-600 dark:text-navy-400 font-medium mb-1">Growth Opportunity</div>
              <div className="text-sm font-semibold text-navy-700 dark:text-navy-300">
                {insights.improvementArea}
              </div>
            </div>
          </div>
        </div>
        
        {/* Smart Recommendations */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Target className="h-4 w-4 text-purple-500" />
            <span>Smart Recommendations</span>
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {insights.recommendations.map((rec, index) => (
              <div 
                key={index} 
                className={`
                  flex items-start space-x-3 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-900/20 
                  hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-colors cursor-pointer
                  ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                `}
                style={{ transitionDelay: `${(index + 5) * 100}ms` }}
              >
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-300">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}