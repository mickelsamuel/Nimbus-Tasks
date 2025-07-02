'use client'

import React, { useState, useEffect } from 'react'
import { Award, Trophy, Crown, Target, Star } from 'lucide-react'
import { achievementsAPI } from '@/lib/api/achievements'

interface Achievement {
  id: number
  title: string
  description: string
  icon: any
  rarity: string
  date: string
  members: number
}

interface AchievementStats {
  totalAchievements: number
  legendaryBadges: number
  completionRate: number
}

export default function AchievementsTab() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [stats, setStats] = useState<AchievementStats>({
    totalAchievements: 0,
    legendaryBadges: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)

  const mapIconName = (iconName: string) => {
    switch (iconName) {
      case 'crown': return Crown
      case 'target': return Target
      case 'star': return Star
      case 'trophy': return Trophy
      default: return Award
    }
  }

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true)
        const response = await achievementsAPI.getTeamAchievements()
        
        if (response.success) {
          const transformedAchievements = response.achievements.map((achievement: any) => ({
            ...achievement,
            icon: mapIconName(achievement.iconName || 'award'),
            date: new Date(achievement.unlockedAt || achievement.createdAt).toLocaleDateString()
          }))
          setAchievements(transformedAchievements)
          setStats({
            totalAchievements: response.stats?.total || transformedAchievements.length,
            legendaryBadges: response.stats?.legendary || transformedAchievements.filter((a: any) => a.rarity === 'legendary').length,
            completionRate: response.stats?.completionRate || 0
          })
        }
      } catch (error) {
        console.error('Failed to fetch team achievements:', error)
        // Fallback to empty state instead of mock data
        setAchievements([])
        setStats({ totalAchievements: 0, legendaryBadges: 0, completionRate: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  if (loading) {
    return (
      <div className="tab-content-section animate-pulse">
        <div className="achievements-theater">
          <div className="achievements-header">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
          <div className="achievements-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div 
      className="tab-content-section" 
      role="tabpanel" 
      id="tabpanel-achievements" 
      aria-labelledby="tab-achievements"
    >
      <div className="achievements-theater">
        <div className="achievements-header">
          <h3 className="theater-title">Team Achievement Center</h3>
          <p className="theater-description">
            Celebrate accomplishments and track milestone progress across your organization
          </p>
        </div>

        <div className="achievements-grid">
          {achievements.length > 0 ? (
            achievements.map((achievement) => (
              <div key={achievement.id} className={`achievement-card ${achievement.rarity}`}>
                <div className="achievement-icon">
                  <achievement.icon className="w-8 h-8" />
                </div>
                <div className="achievement-content">
                  <h4 className="achievement-title">{achievement.title}</h4>
                  <p className="achievement-description">{achievement.description}</p>
                  <div className="achievement-details">
                    <span className="achievement-date">{achievement.date}</span>
                    <span className="achievement-members">{achievement.members} members</span>
                  </div>
                </div>
                <div className={`rarity-badge ${achievement.rarity}`}>
                  {achievement.rarity}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                No Team Achievements Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Start completing goals and milestones to unlock team achievements!
              </p>
            </div>
          )}
        </div>

        <div className="achievements-stats">
          <div className="stat-card">
            <Award className="w-6 h-6 text-yellow-400" />
            <div className="stat-content">
              <span className="stat-value">{stats.totalAchievements}</span>
              <span className="stat-label">Total Achievements</span>
            </div>
          </div>
          <div className="stat-card">
            <Crown className="w-6 h-6 text-purple-400" />
            <div className="stat-content">
              <span className="stat-value">{stats.legendaryBadges}</span>
              <span className="stat-label">Legendary Badges</span>
            </div>
          </div>
          <div className="stat-card">
            <Target className="w-6 h-6 text-blue-400" />
            <div className="stat-content">
              <span className="stat-value">{stats.completionRate}%</span>
              <span className="stat-label">Goal Completion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}