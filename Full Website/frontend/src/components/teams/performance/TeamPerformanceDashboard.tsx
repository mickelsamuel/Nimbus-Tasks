'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Target, Users, Award,
  BarChart3, Activity, Zap, Star,
  ChevronDown, Download, RefreshCw, ArrowUp,
  ArrowDown, BookOpen, Trophy, MessageSquare
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  avatar: string
  role: string
  department: string
  stats: {
    modulesCompleted: number
    averageScore: number
    totalXP: number
    rank: number
    streakDays: number
    lastActive: string
  }
  performance: {
    weeklyProgress: number
    monthlyProgress: number
    trend: 'up' | 'down' | 'stable'
    engagementScore: number
  }
}

interface TeamPerformanceData {
  overview: {
    totalMembers: number
    activeMembers: number
    completionRate: number
    averageScore: number
    totalXP: number
    teamRank: number
    challengesCompleted: number
    collaborationScore: number
  }
  trends: {
    period: string
    completionTrend: number
    scoreTrend: number
    engagementTrend: number
    activeMembersTrend: number
  }
  goals: {
    monthlyGoal: number
    progress: number
    daysRemaining: number
    onTrack: boolean
  }
  topPerformers: TeamMember[]
  recentActivities: Array<{
    id: string
    type: string
    member: string
    description: string
    timestamp: string
    points: number
  }>
  skillBreakdown: Array<{
    skill: string
    averageScore: number
    completed: number
    inProgress: number
    notStarted: number
  }>
  weeklyData: Array<{
    week: string
    modulesCompleted: number
    averageScore: number
    activeMembers: number
    xpEarned: number
  }>
}

interface TeamPerformanceDashboardProps {
  teamId: string
  teamName: string
}

export function TeamPerformanceDashboard({ teamId, teamName }: TeamPerformanceDashboardProps) {
  const [performanceData, setPerformanceData] = useState<TeamPerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedMetric, setSelectedMetric] = useState<'completion' | 'score' | 'engagement' | 'xp'>('completion')
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchPerformanceData()
  }, [teamId, timeRange, fetchPerformanceData])

  const fetchPerformanceData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/teams/${teamId}/performance?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPerformanceData(data.performance)
      }
    } catch (error) {
      console.error('Error fetching team performance:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await fetchPerformanceData()
    setRefreshing(false)
  }

  const exportData = async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}/performance/export?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `team-performance-${teamName}-${timeRange}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUp className="h-4 w-4 text-green-500" />
    if (trend < 0) return <ArrowDown className="h-4 w-4 text-red-500" />
    return <div className="h-4 w-4" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600 dark:text-green-400'
    if (trend < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400'
    if (score >= 80) return 'text-blue-600 dark:text-blue-400'
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
    if (score >= 60) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-green-500'
    if (score >= 80) return 'bg-blue-500'
    if (score >= 70) return 'bg-yellow-500'
    if (score >= 60) return 'bg-orange-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!performanceData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Performance Data
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Performance data is not available for this team.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {teamName} Performance Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track team progress, performance metrics, and member contributions
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(performanceData.trends.activeMembersTrend)}
              <span className={`text-sm font-medium ${getTrendColor(performanceData.trends.activeMembersTrend)}`}>
                {Math.abs(performanceData.trends.activeMembersTrend)}%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {performanceData.overview.activeMembers}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Active Members
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            {performanceData.overview.totalMembers} total members
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(performanceData.trends.completionTrend)}
              <span className={`text-sm font-medium ${getTrendColor(performanceData.trends.completionTrend)}`}>
                {Math.abs(performanceData.trends.completionTrend)}%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {performanceData.overview.completionRate}%
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Completion Rate
          </p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${performanceData.overview.completionRate}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(performanceData.trends.scoreTrend)}
              <span className={`text-sm font-medium ${getTrendColor(performanceData.trends.scoreTrend)}`}>
                {Math.abs(performanceData.trends.scoreTrend)}%
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {performanceData.overview.averageScore}%
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Average Score
          </p>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(performanceData.overview.averageScore)}`}
                style={{ width: `${performanceData.overview.averageScore}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
              <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                #{performanceData.overview.teamRank}
              </span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {performanceData.overview.totalXP.toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Total XP Earned
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
            {performanceData.overview.challengesCompleted} challenges completed
          </div>
        </motion.div>
      </div>

      {/* Goals Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Goal Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {performanceData.goals.daysRemaining} days remaining
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            performanceData.goals.onTrack
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            {performanceData.goals.onTrack ? 'On Track' : 'Behind Schedule'}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Modules Completed
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {performanceData.goals.progress} / {performanceData.goals.monthlyGoal}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                performanceData.goals.onTrack ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${Math.min((performanceData.goals.progress / performanceData.goals.monthlyGoal) * 100, 100)}%` }}
            />
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round((performanceData.goals.progress / performanceData.goals.monthlyGoal) * 100)}% complete
          </div>
        </div>
      </motion.div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Weekly Performance Trend
            </h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as any)}
              className="text-sm px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="completion">Modules Completed</option>
              <option value="score">Average Score</option>
              <option value="engagement">Active Members</option>
              <option value="xp">XP Earned</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {performanceData.weeklyData.map((week, index) => {
              let value, maxValue, label;
              switch (selectedMetric) {
                case 'completion':
                  value = week.modulesCompleted;
                  maxValue = Math.max(...performanceData.weeklyData.map(w => w.modulesCompleted));
                  label = 'modules';
                  break;
                case 'score':
                  value = week.averageScore;
                  maxValue = 100;
                  label = '%';
                  break;
                case 'engagement':
                  value = week.activeMembers;
                  maxValue = Math.max(...performanceData.weeklyData.map(w => w.activeMembers));
                  label = 'members';
                  break;
                case 'xp':
                  value = week.xpEarned;
                  maxValue = Math.max(...performanceData.weeklyData.map(w => w.xpEarned));
                  label = 'XP';
                  break;
                default:
                  value = week.modulesCompleted;
                  maxValue = Math.max(...performanceData.weeklyData.map(w => w.modulesCompleted));
                  label = 'modules';
              }
              
              return (
                <div key={week.week} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                    {week.week}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full flex-1 mr-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(value / maxValue) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="h-4 bg-blue-500 rounded-full"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white min-w-0">
                        {value} {label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Skills Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Skills Development
          </h3>
          
          <div className="space-y-6">
            {performanceData.skillBreakdown.map((skill, index) => (
              <div key={skill.skill}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {skill.skill}
                  </span>
                  <span className={`text-sm font-medium ${getPerformanceColor(skill.averageScore)}`}>
                    {skill.averageScore}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.averageScore}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className={`h-2 rounded-full ${getProgressBarColor(skill.averageScore)}`}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>{skill.completed} completed</span>
                  <span>{skill.inProgress} in progress</span>
                  <span>{skill.notStarted} not started</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Performers
          </h3>
          <button
            onClick={() => setShowDetails(showDetails === 'performers' ? null : 'performers')}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            View All
            <ChevronDown className={`h-4 w-4 transition-transform ${showDetails === 'performers' ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceData.topPerformers.slice(0, showDetails === 'performers' ? undefined : 6).map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={member.avatar || '/avatars/default.jpg'}
                  alt={member.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate">
                    {member.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {member.role}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    #{member.stats.rank}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Modules</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {member.stats.modulesCompleted}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Avg Score</div>
                  <div className={`font-semibold ${getPerformanceColor(member.stats.averageScore)}`}>
                    {member.stats.averageScore}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">XP</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {member.stats.totalXP.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Streak</div>
                  <div className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {member.stats.streakDays} days
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    Engagement Score
                  </span>
                  <span className={`font-medium ${getPerformanceColor(member.performance.engagementScore)}`}>
                    {member.performance.engagementScore}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Recent Team Activities
        </h3>
        
        <div className="space-y-4">
          {performanceData.recentActivities.map((activity, index) => {
            const getActivityIcon = (type: string) => {
              switch (type) {
                case 'module_completion':
                  return BookOpen
                case 'achievement':
                  return Award
                case 'collaboration':
                  return MessageSquare
                case 'milestone':
                  return Trophy
                default:
                  return Activity
              }
            }
            
            const IconComponent = getActivityIcon(activity.type)
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white">
                    <span className="font-medium">{activity.member}</span> {activity.description}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                
                {activity.points > 0 && (
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <Star className="h-4 w-4" />
                    <span className="font-medium">+{activity.points}</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}