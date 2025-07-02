export interface Event {
  id: number
  title: string
  description: string
  category: 'training' | 'competition' | 'team' | 'special' | 'certification'
  status: 'live' | 'upcoming' | 'ended' | 'featured'
  startDate: Date
  endDate: Date
  participants: number
  maxParticipants: number
  image: string
  rewards: EventRewards
  challenges: EventChallenge[]
  leaderboard?: LeaderboardEntry[]
}

export interface EventRewards {
  coins: number
  experience: number
  badges: string[]
}

export interface EventChallenge {
  id: number
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  progress?: number
}

export interface LeaderboardEntry {
  rank: number
  user: string
  score: number
  avatar: string
}

export type EventCategory = Event['category']
export type EventStatus = Event['status']
export type ChallengeDifficulty = EventChallenge['difficulty']