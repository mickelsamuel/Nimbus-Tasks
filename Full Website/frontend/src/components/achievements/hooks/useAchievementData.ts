import { useState, useEffect, useCallback } from 'react'
import { fetchAchievements as apiFetchAchievements, fetchLeaderboard, fetchUserGameStats } from '@/lib/api/gamified'
import api from '@/lib/api/client'
import { useAuth } from '@/contexts/AuthContext'

export interface Achievement {
  id: string
  title: string
  description: string
  longDescription?: string
  icon: string
  category: string
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedAt?: string
  claimable?: boolean
  requirements?: string[]
  rewards?: Array<{ type: string; value: string | number }>
  unlockedBy?: number
  hint?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  earned: boolean
  earnedAt?: string
  color?: string
  requirements?: string[]
}

interface Stats {
  totalXP: number
  unlockedAchievements: number
  totalAchievements: number
  completionRate: number
  currentStreak: number
  rank: string
  nextRankXP: number
  monthlyTarget: number
  monthlyProgress: number
  weeklyProgress: number
  averageCompletionTime: string
  mostActiveCategory: string
  teamRank: number
  globalRank: number
  xpToNextRank: number
  recentAchievements: number
  earnedBadges: number
  totalBadges: number
  badgeCompletionRate: number
  totalUnlocked?: number
  totalPoints?: number
}

interface Milestone {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'special'
  target: number
  current: number
  reward: number
  deadline?: string
  completed: boolean
  icon: string
}

interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  avatar: string
  points: number
  achievements: number
  level: number
  trend: 'up' | 'down' | 'same'
  trendValue?: number
  isCurrentUser?: boolean
}

export const useAchievementData = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [stats, setStats] = useState<Stats>({
    totalXP: 0,
    unlockedAchievements: 0,
    totalAchievements: 0,
    completionRate: 0,
    currentStreak: 0,
    rank: 'Beginner',
    nextRankXP: 0,
    monthlyTarget: 1000,
    monthlyProgress: 0,
    weeklyProgress: 0,
    averageCompletionTime: '0 days',
    mostActiveCategory: 'Learning',
    teamRank: 0,
    globalRank: 0,
    xpToNextRank: 0,
    recentAchievements: 0,
    earnedBadges: 0,
    totalBadges: 0,
    badgeCompletionRate: 0
  })
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  const fetchAchievements = useCallback(async () => {
    if (!user) return
    
    try {
      setLoading(true)
      
      // Check if we have a valid token first
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || sessionStorage.getItem('token')
      if (!token) {
        console.warn('No authentication token found')
        setError('Please log in again to view achievements')
        // Clear any stale auth state
        localStorage.removeItem('auth_token')
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        return
      }
      
      console.log('Fetching achievement data with token:', token ? 'Present' : 'Missing')
      
      // Fetch data from API with better error handling
      const [achievementsData, badgesResponse, leaderboardData, gameStats] = await Promise.all([
        apiFetchAchievements().catch(err => {
          console.warn('Failed to fetch achievements:', err);
          return [];
        }),
        api.get('/user/badges').then(res => res.data).catch(err => {
          console.warn('Failed to fetch badges:', err);
          return [];
        }),
        fetchLeaderboard('achievements').catch(err => {
          console.warn('Failed to fetch leaderboard:', err);
          // If it's an auth error, don't continue
          if (err?.status === 401) {
            throw new Error('Authentication failed - please log in again');
          }
          return [];
        }),
        fetchUserGameStats().catch(err => {
          console.warn('Failed to fetch game stats:', err);
          return null;
        })
      ])

      // Ensure badgesData is always an array
      const badgesData = Array.isArray(badgesResponse) ? badgesResponse : 
                        (badgesResponse?.badges && Array.isArray(badgesResponse.badges)) ? badgesResponse.badges : 
                        [];
      
      // Debug logging (development only)
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG === 'true') {
        console.log('API responses received:');
        console.log('- achievementsData:', Array.isArray(achievementsData) ? `Array(${achievementsData.length})` : typeof achievementsData);
        console.log('- badgesResponse:', typeof badgesResponse, badgesResponse);
        console.log('- badgesData (processed):', Array.isArray(badgesData) ? `Array(${badgesData.length})` : typeof badgesData);
        console.log('- leaderboardData:', Array.isArray(leaderboardData) ? `Array(${leaderboardData.length})` : typeof leaderboardData);
      }

      // Map achievements data
      interface ApiAchievement {
        id: string;
        title?: string;
        name?: string;
        description: string;
        longDescription?: string;
        icon: string;
        category?: string;
        points?: number;
        rarity: string;
        userProgress?: {
          progress?: number;
          unlockedAt?: string;
          claimable?: boolean;
        };
        criteria?: {
          target?: number;
        };
        requirements?: string[];
        hint?: string;
      }
      
      // Ensure all data is arrays before mapping
      const safeAchievementsData = Array.isArray(achievementsData) ? achievementsData : [];
      const safeLeaderboardData = Array.isArray(leaderboardData) ? leaderboardData : [];

      const mappedAchievements: Achievement[] = safeAchievementsData.map((achievement: ApiAchievement) => ({
        id: achievement.id,
        title: achievement.title || achievement.name,
        description: achievement.description,
        longDescription: achievement.longDescription || achievement.description,
        icon: achievement.icon,
        category: achievement.category || 'general',
        points: achievement.points || 0,
        rarity: achievement.rarity as 'common' | 'rare' | 'epic' | 'legendary',
        progress: achievement.userProgress?.progress || 0,
        maxProgress: achievement.criteria?.target || 1,
        unlocked: !!achievement.userProgress?.unlockedAt,
        unlockedAt: achievement.userProgress?.unlockedAt,
        claimable: achievement.userProgress?.claimable || false,
        requirements: achievement.requirements || [],
        hint: achievement.hint
      }))

      // Map badges data
      interface ApiBadge {
        id: string;
        name?: string;
        title?: string;
        description: string;
        icon: string;
        category?: string;
        rarity: string;
        earned?: boolean;
        earnedAt?: string;
        color?: string;
        requirements?: string[];
      }
      
      const mappedBadges: Badge[] = badgesData.map((badge: ApiBadge) => ({
        id: badge.id,
        name: badge.name || badge.title,
        description: badge.description,
        icon: badge.icon,
        category: badge.category || 'general',
        rarity: badge.rarity as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
        earned: !!badge.earned || !!badge.earnedAt,
        earnedAt: badge.earnedAt,
        color: badge.color,
        requirements: badge.requirements || []
      }))

      // Map leaderboard data
      interface ApiLeaderboardEntry {
        userId?: string;
        id?: string;
        rank?: number;
        name: string;
        avatar?: string;
        totalAchievementPoints?: number;
        points?: number;
        achievementsUnlocked?: number;
      }
      
      const mappedLeaderboard: LeaderboardEntry[] = safeLeaderboardData.map((entry: ApiLeaderboardEntry, index: number) => ({
        id: entry.userId || entry.id,
        rank: entry.rank || index + 1,
        name: entry.name === `${user.firstName} ${user.lastName}` ? 'You' : entry.name,
        avatar: entry.avatar || '/avatars/default.jpg',
        points: entry.totalAchievementPoints || entry.points || 0,
        achievements: entry.achievementsUnlocked || 0,
        level: Math.floor((entry.totalAchievementPoints || 0) / 500) + 1,
        trend: 'same' as const,
        isCurrentUser: entry.name === `${user.firstName} ${user.lastName}`
      }))

      // Calculate stats
      const unlockedCount = mappedAchievements.filter(a => a.unlocked).length
      const totalXP = mappedAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)
      const earnedBadgeCount = mappedBadges.filter(b => b.earned).length
      
      const calculatedStats: Stats = {
        totalXP,
        unlockedAchievements: unlockedCount,
        totalAchievements: mappedAchievements.length,
        completionRate: mappedAchievements.length > 0 ? Math.round((unlockedCount / mappedAchievements.length) * 100) : 0,
        currentStreak: gameStats?.streak || 0,
        rank: totalXP >= 2000 ? 'Gold Master' : totalXP >= 1000 ? 'Silver Expert' : totalXP >= 500 ? 'Bronze Explorer' : 'Beginner',
        nextRankXP: totalXP >= 2000 ? 0 : totalXP >= 1000 ? 2000 : totalXP >= 500 ? 1000 : 500,
        monthlyTarget: 1000,
        monthlyProgress: totalXP,
        weeklyProgress: Math.min(100, Math.round((totalXP / 1000) * 100)),
        averageCompletionTime: '3.2 days',
        mostActiveCategory: 'Learning',
        teamRank: mappedLeaderboard.find(l => l.isCurrentUser)?.rank || 0,
        globalRank: mappedLeaderboard.find(l => l.isCurrentUser)?.rank || 0,
        xpToNextRank: Math.max(0, (totalXP >= 1000 ? 2000 : totalXP >= 500 ? 1000 : 500) - totalXP),
        recentAchievements: mappedAchievements.filter(a => a.unlocked && a.unlockedAt).length,
        earnedBadges: earnedBadgeCount,
        totalBadges: mappedBadges.length,
        badgeCompletionRate: mappedBadges.length > 0 ? Math.round((earnedBadgeCount / mappedBadges.length) * 100) : 0
      }

      setAchievements(mappedAchievements)
      setBadges(mappedBadges)
      setLeaderboard(mappedLeaderboard)
      setStats(calculatedStats)
      setMilestones([]) // No mock milestones - will be implemented when API is ready
      setError(null)
      
    } catch (err) {
      console.error('Failed to fetch achievements:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch achievements')
      // Set empty data on error
      setAchievements([])
      setBadges([])
      setLeaderboard([])
    } finally {
      setLoading(false)
    }
  }, [user])

  const checkAchievements = useCallback(async () => {
    try {
      // This will be implemented when the API is ready
      return []
    } catch (err) {
      console.warn('Error checking achievements:', err)
      return []
    }
  }, [])

  const claimAchievement = useCallback(async (achievementId: string) => {
    try {
      // This will be implemented when the API is ready
      const achievement = achievements.find(a => a.id === achievementId)
      if (achievement && achievement.claimable) {
        // Update local state optimistically
        setAchievements(prev => prev.map(a => 
          a.id === achievementId 
            ? { ...a, unlocked: true, claimable: false, unlockedAt: new Date().toISOString() }
            : a
        ))
        return achievement
      }
      return null
    } catch (err) {
      console.error('Error claiming achievement:', err)
      return null
    }
  }, [achievements])

  const filterAndSortAchievements = useCallback((
    searchTerm: string,
    selectedCategory: string,
    selectedRarity: string,
    sortBy: 'recent' | 'points' | 'progress' | 'rarity',
    showUnlockedOnly: boolean
  ) => {
    return achievements
      .filter(achievement => {
        const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory
        const matchesRarity = selectedRarity === 'all' || achievement.rarity === selectedRarity
        const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesUnlocked = !showUnlockedOnly || achievement.unlocked
        return matchesCategory && matchesRarity && matchesSearch && matchesUnlocked
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'recent':
            if (a.unlocked && b.unlocked) {
              return new Date(b.unlockedAt || '').getTime() - new Date(a.unlockedAt || '').getTime()
            }
            return a.unlocked ? -1 : 1
          case 'points':
            return b.points - a.points
          case 'progress':
            return (b.progress / b.maxProgress) - (a.progress / a.maxProgress)
          case 'rarity':
            const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 }
            return (rarityOrder[b.rarity] || 1) - (rarityOrder[a.rarity] || 1)
          default:
            return 0
        }
      })
  }, [achievements])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  return {
    loading,
    error,
    achievements,
    badges,
    stats,
    milestones,
    leaderboard,
    fetchAchievements,
    checkAchievements,
    filterAndSortAchievements,
    claimAchievement
  }
}