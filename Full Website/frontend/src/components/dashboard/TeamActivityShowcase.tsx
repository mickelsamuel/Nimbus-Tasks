'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, Award, TrendingUp, CheckCircle, Star, Zap,
  ArrowUp, MessageSquare, Trophy, Target,
  ChevronRight, MoreHorizontal, UserPlus
} from 'lucide-react'

interface TeamMember {
  id: number
  user: string
  avatar: string
  action: string
  timestamp: Date | string
  points: number
}

interface RecentActivity {
  id: number
  type: string
  title: string
  timestamp: Date | string
  points: number
  icon: string
  source?: string
}

interface TeamActivityShowcaseProps {
  teamActivity: TeamMember[]
  recentActivity: RecentActivity[]
}

export default function TeamActivityShowcase({ teamActivity, recentActivity }: TeamActivityShowcaseProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'recent' | 'team'>('recent')
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    setIsVisible(true)
  }, [teamActivity, recentActivity])

  const getActivityIcon = (activity: TeamMember | RecentActivity) => {
    if ('source' in activity && activity.source === 'team') {
      return <Users className="h-4 w-4 text-blue-500" />
    }
    
    const iconMap: Record<string, React.ReactNode> = {
      CheckCircle: <CheckCircle className="h-4 w-4 text-green-500" />,
      Award: <Award className="h-4 w-4 text-yellow-500" />,
      Users: <Users className="h-4 w-4 text-blue-500" />,
      TrendingUp: <TrendingUp className="h-4 w-4 text-purple-500" />,
      Trophy: <Trophy className="h-4 w-4 text-orange-500" />
    }
    return ('icon' in activity && iconMap[activity.icon]) || <Star className="h-4 w-4 text-gray-500" />
  }

  const getRelativeTime = (timestamp: Date | string) => {
    const now = new Date()
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getPerformanceTrend = () => {
    const recentPoints = recentActivity.slice(0, 3).reduce((sum, activity) => sum + activity.points, 0)
    const teamPoints = teamActivity.slice(0, 3).reduce((sum, activity) => sum + activity.points, 0)
    
    return {
      userTrend: recentPoints > 1000 ? 'up' : recentPoints > 500 ? 'stable' : 'down',
      teamTrend: teamPoints > 1500 ? 'up' : teamPoints > 800 ? 'stable' : 'down',
      userPoints: recentPoints,
      teamPoints: teamPoints
    }
  }

  const performance = getPerformanceTrend()

  return (
    <div className={`
      dashboard-card bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 
      border border-gray-200/20 dark:border-gray-700/20 shadow-xl
      transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      {/* Header with tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            Activity Hub
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Track your progress and team activities
          </p>
        </div>
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('recent')}
            className={`
              px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-all duration-200
              ${activeTab === 'recent' 
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            My Activity
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`
              px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-all duration-200
              ${activeTab === 'team' 
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            Team Feed
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Your Performance</span>
            </div>
            <div className="flex items-center space-x-1">
              {performance.userTrend === 'up' && <ArrowUp className="h-3 w-3 text-green-500" />}
              {performance.userTrend === 'stable' && <MoreHorizontal className="h-3 w-3 text-yellow-500" />}
              {performance.userTrend === 'down' && <ArrowUp className="h-3 w-3 text-red-500 rotate-180" />}
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {performance.userPoints.toLocaleString()}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">XP earned recently</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Team Activity</span>
            </div>
            <div className="flex items-center space-x-1">
              {performance.teamTrend === 'up' && <ArrowUp className="h-3 w-3 text-green-500" />}
              {performance.teamTrend === 'stable' && <MoreHorizontal className="h-3 w-3 text-yellow-500" />}
              {performance.teamTrend === 'down' && <ArrowUp className="h-3 w-3 text-red-500 rotate-180" />}
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {performance.teamPoints.toLocaleString()}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">Team XP earned</div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar">
        {activeTab === 'recent' && recentActivity.map((activity, index) => (
          <div 
            key={activity.id}
            className={`
              flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/50
              ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="flex-shrink-0 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {getActivityIcon(activity)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {activity.title}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {activity.points > 0 && (
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                      +{activity.points} XP
                    </span>
                  </div>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {getRelativeTime(activity.timestamp)}
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        ))}

        {activeTab === 'team' && teamActivity.map((activity, index) => (
          <div 
            key={activity.id}
            className={`
              flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/50
              ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                {getAvatarInitials(activity.user)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                <span className="font-semibold">{activity.user}</span>
                <span className="text-gray-600 dark:text-gray-300 ml-1">{activity.action}</span>
              </p>
              <div className="flex items-center space-x-2 mt-1">
                {activity.points > 0 && (
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-purple-500" />
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      +{activity.points} XP
                    </span>
                  </div>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {getRelativeTime(activity.timestamp)}
                </span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <MessageSquare className="h-4 w-4 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Team Actions */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => router.push('/friends-teams')}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="View Teams"
            >
              <UserPlus className="h-4 w-4" />
            </button>
            <button 
              onClick={() => router.push('/chat')}
              className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Open Chat"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
            <button 
              onClick={() => router.push('/achievements')}
              className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title="View Achievements"
            >
              <Trophy className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </div>
  )
}