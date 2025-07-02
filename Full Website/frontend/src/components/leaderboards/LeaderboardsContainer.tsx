'use client'

import React from 'react'
import LeaderboardsHeader from './LeaderboardsHeader'
import LeaderboardsTabs from './LeaderboardsTabs'
import ChampionsPodium from './ChampionsPodium'
import LeaderboardsTable from './LeaderboardsTable'
import LeaderboardsAnalytics from './LeaderboardsAnalytics'
import LiveUpdateToggle from './LiveUpdateToggle'
import UserAchievementsPanel from './UserAchievementsPanel'
import LeaderboardWallet from './LeaderboardWallet'
import { AnalyticsData } from '@/app/leaderboards/page'

interface TabConfig {
  id: string
  label: string
  icon: string
  count: number
  description: string
}

interface LeaderboardUser {
  id: number
  name: string
  department: string
  avatar: string
  score: number
  rank: number
  previousRank: number
  achievements: number
  streak: number
  completedModules: number
  averageScore: number
  trend: 'up' | 'down' | 'stable'
  badges: string[]
  country?: string
  team?: string
}

interface TopThree {
  first?: LeaderboardUser
  second?: LeaderboardUser
  third?: LeaderboardUser
}

interface LeaderboardsContainerProps {
  activeTab: string
  onTabChange: (tab: string) => void
  timeframe: string
  onTimeframeChange: (timeframe: string) => void
  tabs: TabConfig[]
  leaderboardData: LeaderboardUser[]
  analyticsData?: AnalyticsData
  loading: boolean
  liveUpdateActive: boolean
  onLiveUpdateToggle: (active: boolean) => void
  topThree?: TopThree
}

export default function LeaderboardsContainer({
  activeTab,
  onTabChange,
  timeframe,
  onTimeframeChange,
  tabs,
  leaderboardData,
  analyticsData,
  loading,
  liveUpdateActive,
  onLiveUpdateToggle,
  topThree
}: LeaderboardsContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400/5 dark:bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-amber-400/5 dark:bg-amber-400/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <LeaderboardsHeader
        timeframe={timeframe}
        onTimeframeChange={onTimeframeChange}
        analyticsData={analyticsData}
      />

      {/* Navigation Tabs */}
      <LeaderboardsTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        tabs={tabs}
      />

      {/* Champions Podium */}
      {!loading && topThree && (
        <ChampionsPodium
          first={topThree.first}
          second={topThree.second}
          third={topThree.third}
          loading={loading}
        />
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Row: Achievements and Wallet */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UserAchievementsPanel className="lg:col-span-2" />
          <LeaderboardWallet />
        </div>

        {/* Leaderboard Table */}
        <LeaderboardsTable
          users={leaderboardData}
          loading={loading}
          maxRows={50}
        />

        {/* Analytics Section - Simplified */}
        <LeaderboardsAnalytics
          data={analyticsData}
          loading={loading}
        />
      </div>

      {/* Live Update Toggle */}
      <LiveUpdateToggle
        active={liveUpdateActive}
        onToggle={onLiveUpdateToggle}
      />
    </div>
  )
}