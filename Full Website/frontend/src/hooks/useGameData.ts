'use client'

import { useState, useEffect, ComponentType } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Zap, Coins, Shield } from 'lucide-react'
import { 
  fetchAchievements, 
  fetchLeaderboard, 
  fetchUserGameStats,
  checkAchievements
} from '@/lib/api/gamified'

export interface PowerUp {
  id: number
  name: string
  icon: ComponentType<{ className?: string }>
  active: boolean
  duration?: string
}

export interface GameProfile {
  username: string
  level: number
  xp: number
  xpToNext: number
  rank: string
  rankColor: string
  coins: number
  tokens: number
  streak: number
  achievements: number
  totalAchievements: number
  questsCompleted: number
  guild: string
  powerUps: PowerUp[]
}

export interface Quest {
  id: number
  title: string
  description: string
  progress: number
  total: number
  xpReward: number
  coinReward: number
  tokenReward?: number
  difficulty: string
  timeLeft: string
  icon: ComponentType<{ className?: string }>
  color: string
}

export interface Challenge {
  id: number
  name: string
  description: string
  status: string
  timeLeft?: string
  unlockLevel?: number
  progress?: number
  total?: number
  reward: {
    xp: number
    coins: number
    tokens?: number
    badge?: string
  }
  icon: ComponentType<{ className?: string }>
  color: string
}

export interface LeaderboardPlayer {
  rank: number
  name: string
  level: number
  xp: number
  avatar: string
  trend: 'up' | 'down' | 'same'
}

export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic'
  unlockedAt: string
}

export function useGameData() {
  const { user } = useAuth()
  const [gameProfile, setGameProfile] = useState<GameProfile | null>(null)
  const [activeQuests, setActiveQuests] = useState<Quest[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([])
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  // Load data from backend
  useEffect(() => {
    const loadGameData = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Fetch real data from backend
        const [gameStats, achievements, leaderboardData] = await Promise.all([
          fetchUserGameStats(),
          fetchAchievements(),
          fetchLeaderboard('overall')
        ])

        // Map backend data to game profile
        const profile: GameProfile = {
          username: user.firstName || 'Player',
          level: gameStats?.level || 1,
          xp: gameStats?.xp || 0,
          xpToNext: ((gameStats?.level || 1) + 1) * 500,
          rank: (gameStats?.level || 0) >= 15 ? 'Elite Banker' : (gameStats?.level || 0) >= 10 ? 'Senior Banker' : 'Junior Banker',
          rankColor: (gameStats?.level || 0) >= 15 ? 'from-purple-500 to-pink-500' : (gameStats?.level || 0) >= 10 ? 'from-blue-500 to-cyan-500' : 'from-green-500 to-emerald-500',
          coins: gameStats?.coins || 0,
          tokens: gameStats?.tokens || 0,
          streak: gameStats?.streak || 0,
          achievements: gameStats?.achievementsUnlocked || 0,
          totalAchievements: achievements.length,
          questsCompleted: gameStats?.modulesCompleted || 0,
          guild: 'Digital Innovators',
          powerUps: [
            { id: 1, name: 'XP Booster', icon: Zap, active: true, duration: '2h 15m' },
            { id: 2, name: 'Coin Magnet', icon: Coins, active: false },
            { id: 3, name: 'Shield', icon: Shield, active: true, duration: '45m' }
          ]
        }

        // Map leaderboard data
        const mappedLeaderboard: LeaderboardPlayer[] = leaderboardData.map((player, index) => ({
          rank: player.rank || index + 1,
          name: player.name === `${user.firstName} ${user.lastName}` ? 'You' : player.name,
          level: Math.floor((player.totalAchievementPoints || 0) / 500) + 1,
          xp: player.totalAchievementPoints || 0,
          avatar: player.avatar || '👤',
          trend: 'up' as const
        }))

        // Map recent achievements
        const recentUnlocked = achievements
          .filter(a => a.userProgress.unlockedAt)
          .sort((a, b) => new Date(b.userProgress.unlockedAt!).getTime() - new Date(a.userProgress.unlockedAt!).getTime())
          .slice(0, 3)
          .map(a => ({
            id: parseInt(a.id),
            name: a.name,
            description: a.description,
            icon: a.icon,
            rarity: a.rarity as 'common' | 'rare' | 'epic',
            unlockedAt: new Date(a.userProgress.unlockedAt!).toLocaleDateString()
          }))

        setGameProfile(profile)
        setLeaderboard(mappedLeaderboard)
        setRecentAchievements(recentUnlocked)

        // Check for new achievements
        await checkAchievements()

      } catch (error) {
        console.error('Failed to load game data:', error)
        // Set empty states - no fallback to mock data
        setGameProfile(null)
        setActiveQuests([])
        setChallenges([])
        setLeaderboard([])
        setRecentAchievements([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadGameData()
    } else {
      setLoading(false)
    }
  }, [user])

  const updateGameProfile = (updates: Partial<GameProfile>) => {
    setGameProfile(prev => prev ? { ...prev, ...updates } : null)
  }

  const updateQuestProgress = (questId: number) => {
    setActiveQuests(prev => 
      prev.map(quest => 
        quest.id === questId && quest.progress < quest.total
          ? { ...quest, progress: quest.progress + 1 }
          : quest
      )
    )
  }

  return {
    gameProfile,
    activeQuests,
    challenges,
    leaderboard,
    recentAchievements,
    loading,
    updateGameProfile,
    updateQuestProgress
  }
}