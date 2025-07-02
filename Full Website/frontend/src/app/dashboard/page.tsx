'use client'

import React, { useMemo, Suspense } from 'react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { 
  DashboardHeroSection,
  DashboardErrorState
} from '@/components/dashboard'
import { useDashboardData } from '@/hooks/useDashboardData'
import { DashboardContainer } from '@/components/dashboard/layout/DashboardContainer'
import { DashboardDataProvider } from '@/components/dashboard/DashboardDataProvider'
import { useAchievementData } from '@/components/achievements/hooks/useAchievementData'
import { useAuth } from '@/contexts/AuthContext'

// Import components directly
import { DashboardMetricsOverview } from '@/components/dashboard/DashboardMetricsOverview'
import { DashboardQuickActions } from '@/components/dashboard/DashboardQuickActions'
import { DashboardLearningProgress } from '@/components/dashboard/DashboardLearningProgress'
import { DashboardActivityFeed } from '@/components/dashboard/DashboardActivityFeed'
import { DashboardAIInsights } from '@/components/dashboard/DashboardAIInsights'
import { DashboardAchievements } from '@/components/dashboard/DashboardAchievements'
import { DashboardWalletButton } from '@/components/dashboard/DashboardWalletButton'

// Import skeleton for loading states
import DashboardSkeleton from '@/components/common/skeletons/DashboardSkeleton'

// Simple loading component
const ComponentLoader = () => (
  <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-32 animate-pulse" />
)

export default function DashboardPage() {
  const { data: dashboardData, loading, error, refetch } = useDashboardData()
  const { achievements: achievementsData } = useAchievementData()
  const { user } = useAuth()
  
  // Memoize expensive calculations
  const memoizedStats = useMemo(() => {
    const dashboardStats = dashboardData?.stats || {
      assignedModules: 0,
      inProgressModules: 0,
      completedModules: 0,
      xpEarned: 0,
      pointsEarned: 0,
      weeklyProgress: 0,
      streak: 0,
      level: 0,
      nextLevelProgress: 0
    }
    
    return {
      ...dashboardStats,
      level: user?.stats?.level || dashboardStats.level || 1,
      streak: user?.streak || dashboardStats.streak,
      pointsEarned: dashboardStats.pointsEarned || dashboardStats.xpEarned || 0
    }
  }, [dashboardData?.stats, user])
  
  const memoizedWelcomeData = useMemo(() => {
    return dashboardData?.welcome || {
      greeting: '',
      motivationalMessage: '',
      weatherAware: false,
      achievements: []
    }
  }, [dashboardData?.welcome])

  // Show loading state only for initial load
  if (loading && !dashboardData) {
    return (
      <ProtectedLayout>
        <DashboardSkeleton />
      </ProtectedLayout>
    )
  }

  // Show error state only if there's an error and no cached data
  if (error && !dashboardData) {
    return (
      <ProtectedLayout>
        <DashboardContainer>
          <DashboardErrorState onRetry={refetch} />
        </DashboardContainer>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <DashboardContainer>
        <DashboardDataProvider 
          data={dashboardData} 
          loading={loading} 
          error={error}
        >
          <div className="min-h-screen">
            {/* Hero Section */}
            <DashboardHeroSection 
              welcomeData={memoizedWelcomeData}
              stats={memoizedStats}
            />

            {/* Wallet & Achievements Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Wallet Card */}
              <div className="lg:col-span-1">
                <DashboardWalletButton 
                  currency={{
                    coins: user?.stats?.coins || 0,
                    tokens: user?.stats?.tokens || 0
                  }}
                />
              </div>
              
              {/* Achievements & Badges */}
              <div className="lg:col-span-2">
                <Suspense fallback={<ComponentLoader />}>
                  <DashboardAchievements 
                    recentAchievements={achievementsData
                      .filter(achievement => achievement.unlocked && achievement.unlockedAt)
                      .sort((a, b) => new Date(b.unlockedAt || '').getTime() - new Date(a.unlockedAt || '').getTime())
                      .slice(0, 3)
                      .map(achievement => ({
                        id: achievement.id,
                        title: achievement.title,
                        description: achievement.description,
                        icon: achievement.icon,
                        rarity: achievement.rarity,
                        dateEarned: new Date(achievement.unlockedAt || ''),
                        category: achievement.category,
                        points: achievement.points
                      }))
                    }
                    activeBadges={achievementsData
                      .filter(achievement => !achievement.unlocked && achievement.progress > 0)
                      .slice(0, 2)
                      .map(achievement => ({
                        id: achievement.id,
                        name: achievement.title,
                        description: achievement.description,
                        icon: achievement.icon,
                        progress: achievement.progress,
                        maxProgress: achievement.maxProgress,
                        category: achievement.category
                      }))
                    }
                    totalAchievements={achievementsData.filter(a => a.unlocked).length}
                    totalBadges={achievementsData.filter(a => !a.unlocked && a.progress > 0).length}
                  />
                </Suspense>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-8">
              {/* Metrics Overview */}
              <Suspense fallback={<ComponentLoader />}>
                <DashboardMetricsOverview stats={memoizedStats} />
              </Suspense>

              {/* Quick Actions */}
              <Suspense fallback={<ComponentLoader />}>
                <DashboardQuickActions 
                  quickActions={dashboardData?.quickActions?.map(action => ({
                    ...action,
                    progress: action.progress ?? 0
                  })) || []} 
                />
              </Suspense>

              {/* Two Column Grid for Progress and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Suspense fallback={<ComponentLoader />}>
                  <DashboardLearningProgress 
                    learningProgress={dashboardData?.learningProgress || {
                      currentPath: '',
                      completedModules: 0,
                      totalModules: 0,
                      estimatedCompletion: '',
                      nextMilestone: '',
                      xpGained: 0,
                      xpToNextLevel: 0
                    }}
                    stats={memoizedStats}
                  />
                </Suspense>
                <Suspense fallback={<ComponentLoader />}>
                  <DashboardActivityFeed 
                    teamActivity={dashboardData?.teamActivity?.map(activity => ({
                      ...activity,
                      points: activity.points || activity.xp || 0
                    })) || []}
                    recentActivity={dashboardData?.recentActivity?.map(activity => ({
                      ...activity,
                      points: activity.points || activity.xp || 0
                    })) || []}
                  />
                </Suspense>
              </div>

              {/* AI Insights Section */}
              <Suspense fallback={<ComponentLoader />}>
                <DashboardAIInsights 
                  insights={dashboardData?.insights || {
                    weeklyPerformance: '0%',
                    strongestSkill: '',
                    improvementArea: '',
                    recommendations: []
                  }}
                  achievements={memoizedWelcomeData.achievements}
                />
              </Suspense>
            </div>
          </div>
        </DashboardDataProvider>
      </DashboardContainer>
    </ProtectedLayout>
  )
}