'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Brain, TrendingUp, Target, Lightbulb,
  ChevronRight, Sparkles, ArrowUp, ArrowDown,
  Award, BookOpen, Users
} from 'lucide-react'
import type { Insights } from '@/types/dashboard'

interface DashboardAIInsightsProps {
  insights: Insights
  achievements: string[]
}

interface InsightCard {
  id: string
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  color: string
  bgColor: string
  darkBgColor: string
  action?: {
    label: string
    href: string
  }
}

export function DashboardAIInsights({ insights, achievements }: DashboardAIInsightsProps) {
  const router = useRouter()
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)

  const insightCards: InsightCard[] = [
    {
      id: 'performance',
      title: 'Weekly Performance',
      value: insights.weeklyPerformance,
      description: 'This week',
      icon: <TrendingUp className="w-5 h-5" />,
      trend: 'up',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'from-emerald-50 to-emerald-100',
      darkBgColor: 'dark:from-emerald-900/20 dark:to-emerald-800/20',
      action: {
        label: 'View Modules',
        href: '/modules'
      }
    },
    {
      id: 'skill',
      title: 'Strongest Skill',
      value: insights.strongestSkill,
      description: 'Top performing area',
      icon: <Award className="w-5 h-5" />,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'from-purple-50 to-purple-100',
      darkBgColor: 'dark:from-purple-900/20 dark:to-purple-800/20'
    },
    {
      id: 'improvement',
      title: 'Improvement Area',
      value: insights.improvementArea,
      description: 'Focus area for growth',
      icon: <Target className="w-5 h-5" />,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'from-amber-50 to-amber-100',
      darkBgColor: 'dark:from-amber-900/20 dark:to-amber-800/20',
      action: {
        label: 'Take Quiz',
        href: '/modules'
      }
    }
  ]

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
    return null
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Insights
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Personalized insights powered by AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            AI Powered
          </span>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insightCards.map((card, index) => (
          <div
            key={card.id}
            className={`
              dashboard-card rounded-xl p-5 cursor-pointer
              transition-all duration-300 hover:scale-[1.02]
              ${selectedInsight === card.id ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''}
            `}
            onClick={() => setSelectedInsight(card.id === selectedInsight ? null : card.id)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`
                p-2.5 rounded-lg bg-gradient-to-br ${card.bgColor} ${card.darkBgColor}
                ${card.color}
              `}>
                {card.icon}
              </div>
              {card.trend && getTrendIcon(card.trend)}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {card.description}
              </p>
            </div>

            {card.action && (
              <button className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1">
                {card.action.label}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Recommendations Section */}
      <div className="dashboard-card rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Smart Recommendations
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.recommendations?.length > 0 ? (
            insights.recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {recommendation}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <button 
                      onClick={() => router.push('/modules')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      View Modules
                    </button>
                    <button 
                      onClick={() => router.push('/friends-teams')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Join Study Group
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recommendations available at this time.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <div className="dashboard-card rounded-xl p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border border-yellow-200 dark:border-yellow-800/50">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Achievements
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {achievements.slice(0, 4).map((achievement, index) => (
              <div
                key={index}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full border border-yellow-300 dark:border-yellow-700 shadow-sm"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {achievement}
                </span>
              </div>
            ))}
          </div>
          
          <button className="mt-4 text-sm text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200 font-medium inline-flex items-center gap-1">
            View All {achievements.length} Achievements
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  )
}