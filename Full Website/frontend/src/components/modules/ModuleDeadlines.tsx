'use client'

import { useState } from 'react'
import { 
  Clock, AlertCircle, Calendar, CheckCircle2,
  AlertTriangle, Timer, TrendingUp
} from 'lucide-react'

interface DeadlineModule {
  id: number
  title: string
  dueDate: Date
  progress: number
  priority: 'urgent' | 'high' | 'medium' | 'low'
  type: 'mandatory' | 'assigned' | 'recommended'
  assignedBy?: string
}

interface ModuleDeadlinesProps {
  modules: DeadlineModule[]
}

export function ModuleDeadlines({ modules }: ModuleDeadlinesProps) {
  const [expandedView, setExpandedView] = useState(false)
  const [, setHoveredModule] = useState<string | null>(null)

  const sortedModules = [...modules].sort((a, b) => {
    // Sort by priority first, then by due date
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return a.dueDate.getTime() - b.dueDate.getTime()
  })

  const displayModules = expandedView ? sortedModules : sortedModules.slice(0, 2)

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date()
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDeadlineStatus = (daysUntil: number) => {
    if (daysUntil < 0) return { color: 'red', text: 'Overdue', icon: AlertTriangle }
    if (daysUntil === 0) return { color: 'red', text: 'Due Today', icon: AlertCircle }
    if (daysUntil <= 3) return { color: 'orange', text: `${daysUntil} days left`, icon: Clock }
    if (daysUntil <= 7) return { color: 'yellow', text: `${daysUntil} days left`, icon: Calendar }
    return { color: 'green', text: `${daysUntil} days left`, icon: Calendar }
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-700'
      case 'high':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-300 dark:border-orange-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700'
      default:
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700'
    }
  }

  const urgentCount = modules.filter(m => m.priority === 'urgent').length
  const overdueCount = modules.filter(m => getDaysUntilDue(m.dueDate) < 0).length

  return (
    <div className="relative h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl text-white shadow-xl group-hover:rotate-12 transition-all duration-500">
              <Timer className="w-8 h-8" />
            </div>
            {urgentCount > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                {urgentCount}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              🔥 Urgent Deadlines
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {modules.length} modules need your attention
            </p>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {overdueCount > 0 && (
        <div className="mb-6 p-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl shadow-xl animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold mb-1">
                ⚠️ {overdueCount} {overdueCount === 1 ? 'Module is' : 'Modules are'} Overdue!
              </p>
              <p className="text-sm text-white/90">
                Complete them immediately to stay on track with your learning goals.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modules List */}
      <div className="space-y-4">
        {displayModules.map((module, index) => {
          const daysUntil = getDaysUntilDue(module.dueDate)
          const status = getDeadlineStatus(daysUntil)
          const StatusIcon = status.icon

          return (
            <div
              key={module.id}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 ${
                daysUntil < 0 ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25' :
                daysUntil <= 3 ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-orange-500/25' :
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg'
              } hover:shadow-2xl`}
              onMouseEnter={() => setHoveredModule(String(module.id))}
              onMouseLeave={() => setHoveredModule(null)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 translate-y-12" />
              </div>
              
              <div className="relative p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Title and badges */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`p-2 rounded-xl ${
                        daysUntil < 0 || daysUntil <= 3 ? 'bg-white/20' : 'bg-gradient-to-r from-red-500 to-orange-500'
                      } text-white group-hover:rotate-12 transition-transform duration-300`}>
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-2 ${
                          daysUntil < 0 || daysUntil <= 3 ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}>
                          {module.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            daysUntil < 0 || daysUntil <= 3 ? 'bg-white/20 text-white' : getPriorityStyles(module.priority)
                          }`}>
                            {status.text}
                          </span>
                          {module.type === 'mandatory' && (
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                              daysUntil < 0 || daysUntil <= 3 ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            }`}>
                              📜 MANDATORY
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Details */}
                    <div className={`space-y-2 text-sm mb-4 ${
                      daysUntil < 0 || daysUntil <= 3 ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {module.dueDate.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      {module.assignedBy && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>Assigned by: {module.assignedBy}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className={daysUntil < 0 || daysUntil <= 3 ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}>
                          Progress
                        </span>
                        <span className={`font-bold ${
                          daysUntil < 0 || daysUntil <= 3 ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}>
                          {module.progress}%
                        </span>
                      </div>
                      <div className={`w-full rounded-full h-3 ${
                        daysUntil < 0 || daysUntil <= 3 ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
                      }`}>
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            module.progress === 100 ? 'bg-green-400' :
                            daysUntil < 0 || daysUntil <= 3 ? 'bg-white' :
                            'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <button className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-110 shadow-lg whitespace-nowrap ${
                    daysUntil < 0 || daysUntil <= 3 ? 
                    'bg-white text-red-600 hover:bg-gray-100' : 
                    'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                  }`}>
                    {module.progress > 0 ? '🚀 Continue' : '▶️ Start Now'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Expand/Collapse Button */}
      {modules.length > 2 && (
        <button
          onClick={() => setExpandedView(!expandedView)}
          className="mt-6 w-full p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 font-semibold transition-all duration-300 group"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
              {expandedView ? (
                <CheckCircle2 className="w-4 h-4 text-white" />
              ) : (
                <Clock className="w-4 h-4 text-white" />
              )}
            </div>
            <span>{expandedView ? 'Show Less Deadlines' : `👀 View All ${modules.length} Deadlines`}</span>
          </div>
        </button>
      )}

      {/* Summary Stats */}
      <div className="mt-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:animate-bounce">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
              {overdueCount}
            </div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Overdue</div>
          </div>
          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:animate-bounce">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {modules.filter(m => getDaysUntilDue(m.dueDate) <= 7 && getDaysUntilDue(m.dueDate) > 0).length}
            </div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">This Week</div>
          </div>
          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:animate-bounce">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {modules.filter(m => m.progress === 100).length}
            </div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Done</div>
          </div>
        </div>
      </div>
    </div>
  )
}