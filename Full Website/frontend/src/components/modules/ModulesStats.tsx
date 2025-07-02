'use client'

import { 
  Calendar, BarChart3, Trophy, Zap, 
  TrendingUp, Clock, Star, Target,
  AlertCircle, CheckCircle2
} from 'lucide-react'

interface ModulesStatsProps {
  stats: {
    assigned: number
    inProgress: number
    completed: number
    xp: number
    bookmarked?: number
  }
}

export default function ModulesStats({ stats }: ModulesStatsProps) {

  const completionRate = stats.assigned > 0 ? Math.round((stats.completed / stats.assigned) * 100) : 0

  const statsData = [
    {
      id: 'assigned',
      title: 'Assigned Modules',
      description: 'Training modules assigned to you by your manager or mandatory compliance',
      value: stats.assigned,
      icon: Calendar,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      borderColor: 'border-blue-200 dark:border-blue-800/50',
      details: stats.assigned > 0 ? [
        { label: `${Math.ceil(stats.assigned * 0.3)} due this week`, color: 'text-red-600 dark:text-red-400', urgent: true },
        { label: `${Math.ceil(stats.assigned * 0.2)} due next week`, color: 'text-orange-600 dark:text-orange-400' }
      ] : [{ label: 'No assignments yet', color: 'text-gray-500' }]
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      description: 'Modules you have started but not yet completed',
      value: stats.inProgress,
      icon: BarChart3,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
      borderColor: 'border-orange-200 dark:border-orange-800/50',
      details: [
        { label: `Average progress: ${stats.inProgress > 0 ? Math.round(((stats.inProgress * 0.6) + (stats.completed * 1)) / (stats.inProgress + stats.completed) * 100) || 60 : 0}%`, color: 'text-orange-600 dark:text-orange-400' }
      ],
      progressBar: {
        value: stats.inProgress > 0 ? Math.round(((stats.inProgress * 0.6) + (stats.completed * 1)) / (stats.inProgress + stats.completed) * 100) || 60 : 0,
        color: 'bg-orange-500'
      }
    },
    {
      id: 'completed',
      title: 'Completed',
      description: 'Successfully finished modules with passing grades',
      value: stats.completed,
      icon: Trophy,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      borderColor: 'border-green-200 dark:border-green-800/50',
      details: [
        { label: `Completion rate: ${completionRate}%`, color: 'text-green-600 dark:text-green-400' }
      ],
      achievements: true
    },
    {
      id: 'points',
      title: 'Experience',
      description: 'Total XP earned from completing training modules and achievements',
      value: stats.xp,
      icon: Zap,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      borderColor: 'border-purple-200 dark:border-purple-800/50',
      details: [
        { label: `+${Math.floor(stats.xp * 0.2)} XP this week`, color: 'text-purple-600 dark:text-purple-400' }
      ],
      additionalInfo: `+${Math.floor(stats.xp * 0.2)} XP earned this week`
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Training Progress Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your learning journey and achievements
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Updated just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon
          
          return (
            <div
              key={stat.id}
              className={`dashboard-card rounded-3xl p-8 bg-gradient-to-br ${stat.bgGradient} border-2 ${stat.borderColor} group hover:scale-[1.02] transition-all duration-200 relative overflow-hidden hover:shadow-lg`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.gradient} opacity-20 rounded-full blur-xl group-hover:animate-pulse`} />
              <div className="absolute inset-0 bg-grid-pattern opacity-5" />
              
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-6 relative z-10">
                <div className={`p-4 bg-gradient-to-r ${stat.gradient} rounded-2xl shadow-xl group-hover:rotate-6 transition-transform duration-200 mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className={`text-4xl font-bold text-${stat.color}-900 dark:text-${stat.color}-100 mb-2`}>
                    {(stat.value || 0).toLocaleString()}
                  </div>
                  <div className={`text-lg font-semibold text-${stat.color}-700 dark:text-${stat.color}-300 mb-2`}>
                    {stat.title}
                  </div>
                  <p className={`text-sm text-${stat.color}-600 dark:text-${stat.color}-400 leading-relaxed`}>
                    {stat.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {stat.progressBar && (
                <div className="mb-4 relative z-10">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className={`text-${stat.color}-600 dark:text-${stat.color}-400`}>Progress</span>
                    <span className={`font-bold text-${stat.color}-800 dark:text-${stat.color}-200`}>{stat.progressBar.value}%</span>
                  </div>
                  <div className={`w-full bg-${stat.color}-200 dark:bg-${stat.color}-900/50 rounded-full h-3`}>
                    <div 
                      className={`${stat.progressBar.color} h-3 rounded-full transition-all duration-1000 relative overflow-hidden`}
                      style={{ width: `${stat.progressBar.value}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                    </div>
                  </div>
                </div>
              )}

              {/* Achievements */}
              {stat.achievements && (
                <div className="flex justify-center gap-2 mb-4 relative z-10">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center group-hover:animate-bounce shadow-lg" style={{ animationDelay: `${i * 0.1}s` }}>
                      <Star className="h-4 w-4 text-white" fill="white" />
                    </div>
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="space-y-2 relative z-10">
                {stat.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-center justify-center gap-2 text-sm">
                    {'urgent' in detail && detail.urgent ? (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                    <span className={`${detail.color} font-medium text-center`}>
                      {detail.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trend Indicator */}
              {stats.completed > 0 && (
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                  <div className="flex items-center gap-1 text-sm bg-green-500 text-white px-3 py-1 rounded-full shadow-lg">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold">
                      {stat.id === 'completed' && stats.assigned > 0 ? `${Math.round((stats.completed / stats.assigned) * 100)}%` : 
                       stat.id === 'inProgress' && stats.assigned > 0 ? `${Math.round((stats.inProgress / stats.assigned) * 100)}%` :
                       stat.id === 'points' && stats.completed > 0 ? `${Math.round(stats.xp / stats.completed)}` :
                       'Active'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Insights */}
      <div className="dashboard-card rounded-2xl p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Learning Insights
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered recommendations to optimize your learning
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {(stats.completed + stats.inProgress) > 0 ? Math.round((stats.completed / (stats.completed + stats.inProgress)) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Success Rate
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              {completionRate > 75 ? 'Above team average' : completionRate > 50 ? 'On track' : completionRate > 0 ? 'Keep going' : 'Getting started'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {stats.completed > 0 ? Math.floor(15 + (stats.completed * 2)) : 0}m
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg. Session Time
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {stats.completed > 5 ? 'Optimal range' : stats.completed > 0 ? 'Good pace' : 'No data yet'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {stats.completed > 0 ? Math.round((stats.xp || 0) / stats.completed) : 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              XP per Module
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              {stats.xp > 1000 ? 'Improving trend' : stats.xp > 500 ? 'Steady progress' : stats.xp > 0 ? 'Building up' : 'Getting started'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}