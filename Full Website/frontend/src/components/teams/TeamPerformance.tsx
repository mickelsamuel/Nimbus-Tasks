'use client'

import { useState } from 'react'
import { 
  BarChart3, TrendingUp, Users, Target,
  Calendar, Activity
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  tasksCompleted: number
  tasksInProgress: number
  avgCompletionTime: number
  lastActivity: Date
  performanceScore: number
  attendance: number
}

interface TeamMetric {
  label: string
  value: number
  target: number
  unit: string
  trend: number
  status: 'above' | 'on-track' | 'below'
  description: string
}

interface Goal {
  id: string
  title: string
  description: string
  target: number
  current: number
  unit: string
  deadline: Date
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue'
  assignedTo: string[]
}

interface TeamPerformanceProps {
  teamMembers?: TeamMember[]
  teamMetrics?: TeamMetric[]
  goals?: Goal[]
}

export function TeamPerformance({ 
  teamMembers = [], 
  teamMetrics = [], 
  goals = [] 
}: TeamPerformanceProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month')
  const [selectedView, setSelectedView] = useState<'overview' | 'members' | 'goals'>('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'above': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'on-track': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
      case 'below': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'in-progress': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
      case 'overdue': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      case 'not-started': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600 dark:text-green-400' }
    if (score >= 80) return { label: 'Good', color: 'text-blue-600 dark:text-blue-400' }
    if (score >= 70) return { label: 'Fair', color: 'text-yellow-600 dark:text-yellow-400' }
    return { label: 'Needs Improvement', color: 'text-red-600 dark:text-red-400' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="dashboard-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white shadow-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Team Performance Analytics
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track team metrics, individual performance, and goal progress
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(['week', 'month', 'quarter'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* View Navigation */}
        <div className="dashboard-card rounded-xl p-2">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Team Overview', icon: BarChart3 },
              { id: 'members', label: 'Member Performance', icon: Users },
              { id: 'goals', label: 'Goals & Targets', icon: Target },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedView(tab.id as 'overview' | 'members' | 'goals')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedView === tab.id
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      {selectedView === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMetrics.map((metric, index) => (
              <div key={index} className="dashboard-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">{metric.label}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                    {metric.status === 'above' ? 'Above Target' : 
                     metric.status === 'on-track' ? 'On Track' : 'Below Target'}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value}{metric.unit}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Target: {metric.target}{metric.unit}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        metric.status === 'above' ? 'bg-green-500' :
                        metric.status === 'on-track' ? 'bg-blue-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${metric.trend < 0 ? 'rotate-180' : ''}`} />
                    <span>{Math.abs(metric.trend)}%</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    vs last {selectedPeriod}
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="dashboard-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {teamMembers.length}
                </div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Total Members</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0)}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">Tasks Completed</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {Math.round(teamMembers.reduce((sum, member) => sum + member.performanceScore, 0) / teamMembers.length)}%
                </div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Avg Performance</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(teamMembers.reduce((sum, member) => sum + member.attendance, 0) / teamMembers.length)}%
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">Avg Attendance</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'members' && (
        <div className="space-y-4">
          <div className="dashboard-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Individual Performance</h3>
            <div className="space-y-4">
              {teamMembers.map((member) => {
                const performance = getPerformanceLevel(member.performanceScore)
                return (
                  <div key={member.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{member.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.role} - {member.department}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${performance.color} bg-current bg-opacity-10`}>
                          {performance.label}
                        </span>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {member.performanceScore}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{member.tasksCompleted}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{member.tasksInProgress}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">In Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{member.avgCompletionTime}d</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Avg Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{member.attendance}%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Attendance</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <Activity className="w-4 h-4" />
                          <span>{Math.round((Date.now() - member.lastActivity.getTime()) / (1000 * 60 * 60))}h ago</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Last Active</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          member.performanceScore >= 90 ? 'bg-green-500' :
                          member.performanceScore >= 80 ? 'bg-blue-500' :
                          member.performanceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${member.performanceScore}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {selectedView === 'goals' && (
        <div className="space-y-4">
          <div className="dashboard-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Goals & Targets</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                <Target className="w-4 h-4" />
                New Goal
              </button>
            </div>
            
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{goal.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGoalStatusColor(goal.status)}`}>
                      {goal.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Target className="w-4 h-4" />
                      <span>Progress: {goal.current}/{goal.target}{goal.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {goal.deadline.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{goal.assignedTo.length} assigned</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {Math.round((goal.current / goal.target) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Assigned to: {goal.assignedTo.join(', ')}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors">
                        Update Progress
                      </button>
                      <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}