'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  TrendingUp,
  Users,
  Building2
} from 'lucide-react'
import { StatTooltip } from '@/components/common/StatTooltip'

export interface AnalyticsData {
  competitionIntensity: number
  achievementVelocity: number
  activeCompetitors: number
  leadingDepartment: string
  departmentAverageScore: number
}

interface AnalyticsCenterProps {
  data?: AnalyticsData
  departments?: Array<{ name: string; competitors: number }>
}


export default function AnalyticsCenter({ 
  data, 
  departments = [] 
}: AnalyticsCenterProps) {
  const analyticsData = data || {
    competitionIntensity: 0,
    achievementVelocity: 0,
    activeCompetitors: 0,
    leadingDepartment: '-',
    departmentAverageScore: 0
  }
  return (
    <motion.div
      className="competition-analytics-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2.5 }}
      style={{
        background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(22, 27, 34, 0.95) 100%)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '24px',
        padding: '32px',
        margin: '32px 0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="analytics-header text-center mb-8">
        <h3 className="text-3xl font-bold text-yellow-300 mb-2">Championship Intelligence Center</h3>
        <p className="text-yellow-200/70">Real-time competition analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Competition Intensity */}
        <div className="analytics-card bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6 rounded-xl border border-yellow-500/30">
          <div className="flex items-center justify-between mb-4">
            <Zap className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold text-yellow-300">{analyticsData.competitionIntensity}%</span>
          </div>
          <StatTooltip
            title="Competition Intensity"
            description="Measures how actively users are competing on the platform based on recent activity and engagement levels."
            calculation="(Active competitors / Total users) × 100. Higher values indicate more users are actively participating in challenges and competitions."
          >
            <h4 className="text-lg font-semibold text-white mb-1">Competition Intensity</h4>
          </StatTooltip>
          <p className="text-sm text-gray-400">High activity across all departments</p>
        </div>

        {/* Achievement Velocity */}
        <div className="analytics-card bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 rounded-xl border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-purple-400" />
            <span className="text-2xl font-bold text-purple-300">+{analyticsData.achievementVelocity}%</span>
          </div>
          <StatTooltip
            title="Achievement Velocity"
            description="Shows the average rate at which users are earning achievements across the platform."
            calculation="Average achievements earned per active user. This helps identify learning momentum and engagement with the gamification system."
          >
            <h4 className="text-lg font-semibold text-white mb-1">Achievement Velocity</h4>
          </StatTooltip>
          <p className="text-sm text-gray-400">Increased from last month</p>
        </div>

        {/* Active Competitors */}
        <div className="analytics-card bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-xl border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-green-400" />
            <span className="text-2xl font-bold text-green-300">{analyticsData.activeCompetitors.toLocaleString()}</span>
          </div>
          <h4 className="text-lg font-semibold text-white mb-1">Active Competitors</h4>
          <p className="text-sm text-gray-400">Currently competing</p>
        </div>

        {/* Department Rivalry */}
        <div className="analytics-card bg-gradient-to-br from-red-500/20 to-rose-500/20 p-6 rounded-xl border border-red-500/30">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="h-8 w-8 text-red-400" />
            <span className="text-2xl font-bold text-red-300">{analyticsData.leadingDepartment}</span>
          </div>
          <h4 className="text-lg font-semibold text-white mb-1">Leading Department</h4>
          <p className="text-sm text-gray-400">Average score: {analyticsData.departmentAverageScore.toLocaleString()}</p>
        </div>
      </div>

      {/* Competition Heatmap */}
      <div className="mt-8 p-6 bg-black/30 rounded-xl">
        <h4 className="text-xl font-bold text-yellow-300 mb-4">Department Competition Heatmap</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {departments.map((dept, i) => (
            <div 
              key={dept.name}
              className="text-center p-4 rounded-lg transition-all hover:scale-105 cursor-pointer"
              style={{
                background: `rgba(255, 215, 0, ${0.2 + (i * 0.1)})`,
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }}
            >
              <div className="text-sm font-semibold text-white mb-1">{dept.name}</div>
              <div className="text-2xl font-bold text-yellow-300">{dept.competitors}</div>
              <div className="text-xs text-gray-400">competitors</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}