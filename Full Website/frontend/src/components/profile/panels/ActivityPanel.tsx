'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Award, 
  BookOpen,
  Target,
  Zap,
  CheckCircle2,
  type LucideIcon
} from 'lucide-react'
import { UserProfile } from '../types'

interface ActivityPanelProps {
  user: UserProfile
}

export default function ActivityPanel({ user }: ActivityPanelProps) {
  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    color = 'blue',
    trend = null 
  }: {
    icon: LucideIcon
    title: string
    value: string | number
    subtitle: string
    color?: 'blue' | 'green' | 'purple' | 'orange'
    trend?: string | null
  }) => {
    const colorClasses = {
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
    }

    return (
      <motion.div
        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
              {trend && (
                <span className="text-sm text-green-600 dark:text-green-400">{trend}</span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
          </div>
        </div>
      </motion.div>
    )
  }

  const RecentActivity = ({ 
    activity, 
    time, 
    icon: Icon, 
    color = 'blue' 
  }: {
    activity: string
    time: string
    icon: LucideIcon
    color?: 'blue' | 'green' | 'purple' | 'orange'
  }) => {
    const colorClasses = {
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
    }

    return (
      <motion.div
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-900 dark:text-white">{activity}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Activity & Progress
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Activity Summary */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="font-medium text-green-900 dark:text-green-100">
              Great Progress This Week!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              You&apos;ve completed {user.stats?.modulesCompleted || 0} modules and earned {user.stats?.totalXP?.toLocaleString() || '0'} XP
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Target}
          title="Current Level"
          value={user.stats?.level || 1}
          subtitle="Keep learning to level up!"
          color="purple"
          trend="+1 this month"
        />

        <StatCard
          icon={BookOpen}
          title="Modules Completed"
          value={user.stats?.modulesCompleted || 0}
          subtitle="Great job on your progress"
          color="blue"
          trend="+3 this week"
        />

        <StatCard
          icon={Zap}
          title="Current Streak"
          value={`${user.stats?.currentStreak || 0} days`}
          subtitle="Don't break the chain!"
          color="orange"
          trend="Personal best!"
        />

        <StatCard
          icon={Award}
          title="Total XP"
          value={(user.stats?.totalXP || 0).toLocaleString()}
          subtitle="Earned through learning"
          color="green"
          trend="+450 this week"
        />

        <StatCard
          icon={Clock}
          title="Learning Hours"
          value={`${user.stats?.learningHours || 0}h`}
          subtitle="Time invested in growth"
          color="blue"
          trend="+12h this month"
        />

        <StatCard
          icon={TrendingUp}
          title="Weekly Goal"
          value="85%"
          subtitle="4/5 modules completed"
          color="green"
          trend="On track"
        />
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Recent Activity
        </h3>

        <div className="space-y-2">
          <RecentActivity
            activity="Completed 'Advanced Communication Skills' module"
            time="2 hours ago"
            icon={BookOpen}
            color="green"
          />
          <RecentActivity
            activity="Earned 'Team Player' achievement"
            time="1 day ago"
            icon={Award}
            color="purple"
          />
          <RecentActivity
            activity="Started 'Customer Service Excellence' course"
            time="2 days ago"
            icon={Target}
            color="blue"
          />
          <RecentActivity
            activity="Completed daily learning goal"
            time="3 days ago"
            icon={CheckCircle2}
            color="green"
          />
          <RecentActivity
            activity="Joined 'Professional Development' team"
            time="1 week ago"
            icon={TrendingUp}
            color="orange"
          />
          <RecentActivity
            activity="Updated profile information"
            time="1 week ago"
            icon={Activity}
            color="blue"
          />
        </div>
      </div>

      {/* Learning Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Learning Patterns */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Learning Patterns
          </h4>
          <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <div className="flex justify-between">
              <span>Most active day:</span>
              <span className="font-medium">Tuesday</span>
            </div>
            <div className="flex justify-between">
              <span>Preferred time:</span>
              <span className="font-medium">2-4 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Average session:</span>
              <span className="font-medium">25 minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Completion rate:</span>
              <span className="font-medium">92%</span>
            </div>
          </div>
        </div>

        {/* Goals & Targets */}
        <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            This Month&apos;s Goals
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-700 dark:text-green-300">Complete 20 modules</span>
                <span className="text-green-600 dark:text-green-400 font-medium">16/20</span>
              </div>
              <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-700 dark:text-green-300">Maintain 7-day streak</span>
                <span className="text-green-600 dark:text-green-400 font-medium">12/7</span>
              </div>
              <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-700 dark:text-green-300">Earn 5,000 XP</span>
                <span className="text-green-600 dark:text-green-400 font-medium">4,200/5,000</span>
              </div>
              <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}