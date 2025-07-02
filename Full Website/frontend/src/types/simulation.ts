/**
 * Simulation Types
 * 
 * This file contains proper TypeScript definitions for the simulation trading components,
 * replacing the previous usage of "as any" casts with strongly typed interfaces.
 * 
 * These types ensure type safety across:
 * - MarketWatch component (Stock interface)
 * - PortfolioPositions component (Position interface)
 * - MarketTicker component (uses subset of Stock properties)
 * - NewsFeed component (NewsItem interface)
 * - AchievementsPanel component (Achievement interface)
 * - useSimulationData hook (MarketData, Portfolio interfaces)
 */
export interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
  pe: number
  dayRange: number[]
  fiftyTwoWeek: number[]
  sector: string
  analyst: string
  targetPrice: number
}

export interface Position {
  symbol: string
  shares: number
  avgCost: number
  currentPrice: number
  marketValue: number
}

export interface MarketIndices {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export interface NewsItem {
  time: string
  headline: string
  impact: 'positive' | 'negative' | 'neutral'
  severity: 'low' | 'medium' | 'high'
}

export interface TradeOrder {
  symbol: string
  type: 'BUY' | 'SELL'
  shares: number
  orderType: string
  price?: number
  timeInForce: string
}

export interface Achievement {
  id: number
  title: string
  description: string
  unlocked: boolean
  icon: React.ComponentType<{ className?: string }>
}

export interface MarketData {
  indices: Record<string, MarketIndices>
  stocks: Stock[]
  lastUpdate: string
}

export interface Portfolio {
  userId: number
  balance: number
  totalValue: number
  dayGainLoss: number
  totalGainLoss: number
  positions: Position[]
  orderHistory: Array<Record<string, unknown>>
}

export interface SimulationData {
  marketData: MarketData | null
  portfolio: Portfolio | null
  loading: boolean
  error: string | null
}

export interface SimulationHookReturn extends SimulationData {
  executeOrder: (order: TradeOrder) => Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }>
  refreshData: () => Promise<void>
}