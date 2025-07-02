'use client'

import { useState } from 'react'
import { 
  BarChart3, TrendingUp, TrendingDown, Target,
  AlertTriangle, Lightbulb, Users
} from 'lucide-react'

interface PerformanceMetric {
  label: string
  value: number
  benchmark: number
  unit: string
  description: string
  trend: 'up' | 'down' | 'neutral'
}

interface LearningInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'recommendation'
  title: string
  description: string
  actionable: boolean
  relatedScenarios?: string[]
}

interface PerformanceInsightsProps {
  userPerformance: {
    totalSessions: number
    averageReturn: number
    winRate: number
    riskScore: number
    learningProgress: number
  }
  benchmarks: {
    marketReturn: number
    peerAverageReturn: number
    peerWinRate: number
  }
  insights: LearningInsight[]
}

export function PerformanceInsights({ userPerformance, benchmarks, insights }: PerformanceInsightsProps) {
  const [activeTab, setActiveTab] = useState<'metrics' | 'insights'>('metrics')

  const metrics: PerformanceMetric[] = [
    {
      label: 'Average Return',
      value: userPerformance.averageReturn,
      benchmark: benchmarks.peerAverageReturn,
      unit: '%',
      description: 'Your average return per simulation session',
      trend: userPerformance.averageReturn > benchmarks.peerAverageReturn ? 'up' : 'down'
    },
    {
      label: 'Win Rate',
      value: userPerformance.winRate,
      benchmark: benchmarks.peerWinRate,
      unit: '%',
      description: 'Percentage of profitable trading sessions',
      trend: userPerformance.winRate > benchmarks.peerWinRate ? 'up' : 'down'
    },
    {
      label: 'Risk Management',
      value: userPerformance.riskScore,
      benchmark: 75,
      unit: '/100',
      description: 'How well you manage trading risks',
      trend: userPerformance.riskScore >= 75 ? 'up' : userPerformance.riskScore >= 50 ? 'neutral' : 'down'
    },
    {
      label: 'Learning Progress',
      value: userPerformance.learningProgress,
      benchmark: 70,
      unit: '%',
      description: 'Completion of learning objectives',
      trend: userPerformance.learningProgress >= 70 ? 'up' : 'neutral'
    }
  ]

  const getMetricColor = (value: number, benchmark: number, trend: string) => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400'
    if (trend === 'down') return 'text-red-600 dark:text-red-400'
    return 'text-yellow-600 dark:text-yellow-400'
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
      case 'weakness': return <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
      case 'opportunity': return <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
      default: return <AlertTriangle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getInsightBg = (type: string) => {
    switch (type) {
      case 'strength': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'weakness': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'opportunity': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      case 'recommendation': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'
    }
  }

  return (
    <div className="dashboard-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white shadow-lg">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Performance Insights
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Based on {userPerformance.totalSessions} sessions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
          <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
            vs Peers
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'metrics' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Performance Metrics
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'insights' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Learning Insights
        </button>
      </div>

      {/* Content */}
      {activeTab === 'metrics' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{metric.label}</h3>
                {metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : metric.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                ) : (
                  <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                )}
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-2xl font-bold ${getMetricColor(metric.value, metric.benchmark, metric.trend)}`}>
                  {metric.value}{metric.unit}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  vs {metric.benchmark}{metric.unit} avg
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {metric.description}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    metric.trend === 'up' ? 'bg-green-500' :
                    metric.trend === 'down' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min((metric.value / (metric.benchmark * 1.5)) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 border rounded-lg ${getInsightBg(insight.type)}`}>
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {insight.description}
                  </p>
                  
                  {insight.relatedScenarios && insight.relatedScenarios.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Recommended scenarios:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {insight.relatedScenarios.map((scenario, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-white dark:bg-gray-800 rounded-full border">
                            {scenario}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {insight.actionable && (
                    <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      Take Action →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(((userPerformance.averageReturn + 100) / (benchmarks.marketReturn + 100) - 1) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">vs Market</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {insights.filter(i => i.type === 'strength').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Strengths</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {insights.filter(i => i.type === 'opportunity').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Opportunities</div>
          </div>
        </div>
      </div>
    </div>
  )
}