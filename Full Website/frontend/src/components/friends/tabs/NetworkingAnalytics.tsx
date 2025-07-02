'use client'

import { BarChart3, TrendingUp, Users, Target } from 'lucide-react'

export default function NetworkingAnalytics() {
  return (
    <div className="space-y-6">
      <div className="social-hub-header p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Networking Analytics</h2>
        <p className="text-white/70">Track your professional networking progress and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="achievement-ring-card">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-accent-teal" />
            <span className="text-2xl font-bold text-white">247</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Total Connections</h3>
          <p className="text-white/60 text-sm">+12 this month</p>
        </div>

        <div className="achievement-ring-card">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-secondary-teal" />
            <span className="text-2xl font-bold text-white">18</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Active Collaborations</h3>
          <p className="text-white/60 text-sm">+3 this week</p>
        </div>

        <div className="achievement-ring-card">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="h-8 w-8 text-professional-highlight" />
            <span className="text-2xl font-bold text-white">92%</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Network Strength</h3>
          <p className="text-white/60 text-sm">Above average</p>
        </div>

        <div className="achievement-ring-card">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">15</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Mentoring Sessions</h3>
          <p className="text-white/60 text-sm">This quarter</p>
        </div>
      </div>

      <div className="professional-network-visualization">
        <h3 className="text-xl font-semibold text-white mb-4">Network Growth Over Time</h3>
        <div className="h-64 flex items-center justify-center bg-white/5 rounded-lg">
          <p className="text-white/50">Chart visualization would go here</p>
        </div>
      </div>
    </div>
  )
}