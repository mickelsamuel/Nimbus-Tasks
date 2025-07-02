'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import StockChart from '@/components/simulation/StockChart'
import { useSimulationData } from '@/hooks/useSimulationData'
import { 
  Stock, 
  Position, 
  TradeOrder, 
  MarketIndices, 
  NewsItem, 
  Achievement 
} from '@/types/simulation'
import { 
  Target, 
  TrendingUp,
  Shield,
  PieChart,
  Brain,
  Zap,
  Activity,
  DollarSign,
  TrendingDown,
  BarChart3,
  Settings,
  Bell,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clock,
  Globe,
  ChevronUp,
  ChevronDown,
  Star,
  Award,
  Users,
  BookOpen,
  Lightbulb
} from 'lucide-react'

export default function SimulationPage() {
  const { marketData, portfolio, loading, executeOrder } = useSimulationData()
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string | null>(null)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMarketOpen, setIsMarketOpen] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showNotifications, setShowNotifications] = useState(false)

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      // Check if market is open (9:30 AM - 4:00 PM EST)
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTime = hours * 100 + minutes
      setIsMarketOpen(currentTime >= 930 && currentTime <= 1600)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Mock market data
  const marketIndices: MarketIndices[] = [
    { symbol: 'S&P 500', price: 4185.47, change: 23.67, changePercent: 0.57 },
    { symbol: 'NASDAQ', price: 12965.34, change: -45.23, changePercent: -0.35 },
    { symbol: 'DOW', price: 33875.40, change: 156.78, changePercent: 0.47 },
    { symbol: 'VIX', price: 19.85, change: -1.23, changePercent: -5.83 }
  ]

  const stocksData: Stock[] = [
    { 
      symbol: 'AAPL', 
      name: 'Apple Inc.', 
      price: 178.45, 
      change: 2.34, 
      changePercent: 1.33,
      volume: '54.2M',
      marketCap: '2.85T',
      pe: 28.9,
      dayRange: [175.23, 179.67],
      fiftyTwoWeek: [124.17, 182.94],
      sector: 'Technology',
      analyst: 'BUY',
      targetPrice: 195.00
    },
    { 
      symbol: 'GOOGL', 
      name: 'Alphabet Inc.', 
      price: 139.67, 
      change: -1.78, 
      changePercent: -1.26,
      volume: '28.9M',
      marketCap: '1.76T',
      pe: 25.4,
      dayRange: [138.45, 142.12],
      fiftyTwoWeek: [83.34, 151.55],
      sector: 'Technology',
      analyst: 'HOLD',
      targetPrice: 145.00
    },
    { 
      symbol: 'TSLA', 
      name: 'Tesla Inc.', 
      price: 248.92, 
      change: 12.45, 
      changePercent: 5.26,
      volume: '89.4M',
      marketCap: '789.5B',
      pe: 45.7,
      dayRange: [235.67, 251.34],
      fiftyTwoWeek: [101.81, 414.50],
      sector: 'Automotive',
      analyst: 'BUY',
      targetPrice: 275.00
    },
    { 
      symbol: 'MSFT', 
      name: 'Microsoft Corp.', 
      price: 374.56, 
      change: 5.67, 
      changePercent: 1.54,
      volume: '32.1M',
      marketCap: '2.78T',
      pe: 31.2,
      dayRange: [371.23, 377.89],
      fiftyTwoWeek: [213.43, 384.30],
      sector: 'Technology',
      analyst: 'BUY',
      targetPrice: 395.00
    },
    { 
      symbol: 'AMZN', 
      name: 'Amazon.com Inc.', 
      price: 156.78, 
      change: -2.34, 
      changePercent: -1.47,
      volume: '41.7M',
      marketCap: '1.61T',
      pe: 52.3,
      dayRange: [154.56, 159.23],
      fiftyTwoWeek: [81.43, 170.00],
      sector: 'Consumer Discretionary',
      analyst: 'HOLD',
      targetPrice: 165.00
    },
    { 
      symbol: 'NVDA', 
      name: 'NVIDIA Corp.', 
      price: 451.23, 
      change: 18.90, 
      changePercent: 4.37,
      volume: '78.9M',
      marketCap: '1.11T',
      pe: 68.4,
      dayRange: [442.67, 456.78],
      fiftyTwoWeek: [108.13, 502.66],
      sector: 'Technology',
      analyst: 'STRONG BUY',
      targetPrice: 520.00
    }
  ]

  const portfolioPositions: Position[] = [
    { symbol: 'AAPL', shares: 150, avgCost: 165.23, currentPrice: 178.45, marketValue: 26767.50 },
    { symbol: 'MSFT', shares: 80, avgCost: 340.45, currentPrice: 374.56, marketValue: 29964.80 },
    { symbol: 'GOOGL', shares: 120, avgCost: 145.67, currentPrice: 139.67, marketValue: 16760.40 },
    { symbol: 'TSLA', shares: 60, avgCost: 220.34, currentPrice: 248.92, marketValue: 14935.20 },
    { symbol: 'NVDA', shares: 40, avgCost: 380.45, currentPrice: 451.23, marketValue: 18049.20 }
  ]

  const newsFeeds: NewsItem[] = [
    { time: '09:45', headline: 'Fed Chair signals potential rate cuts ahead', impact: 'positive', severity: 'high' },
    { time: '09:32', headline: 'Tech earnings beat expectations across sector', impact: 'positive', severity: 'medium' },
    { time: '09:18', headline: 'Oil prices surge on geopolitical tensions', impact: 'negative', severity: 'medium' },
    { time: '09:05', headline: 'Crypto markets show strong momentum', impact: 'positive', severity: 'low' },
    { time: '08:47', headline: 'Bank regulations tighten on lending standards', impact: 'negative', severity: 'high' }
  ]

  const achievements: Achievement[] = [
    { id: 1, title: 'First Trade', description: 'Execute your first trade', unlocked: true, icon: Target },
    { id: 2, title: 'Profit Maker', description: 'Achieve 10% portfolio return', unlocked: true, icon: TrendingUp },
    { id: 3, title: 'Risk Manager', description: 'Use stop-loss orders effectively', unlocked: false, icon: Shield },
    { id: 4, title: 'Diversification Expert', description: 'Hold 10+ different stocks', unlocked: true, icon: PieChart },
    { id: 5, title: 'Market Predictor', description: 'Predict market direction 5 times', unlocked: false, icon: Brain },
    { id: 6, title: 'Day Trader', description: 'Complete 100 trades in one day', unlocked: false, icon: Zap }
  ]

  const handleTrade = async (trade: TradeOrder) => {
    const result = await executeOrder(trade)
    
    if (result.success) {
      console.log('Trade executed successfully:', result.data)
      // Could show a success toast notification here
    } else {
      console.error('Trade failed:', result.error)
      // Could show an error toast notification here
    }
  }

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock)
    setSelectedStockSymbol(stock.symbol)
  }

  // Show loading state
  if (loading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 opacity-20 animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading Market Simulation</h3>
            <p className="text-gray-600 dark:text-gray-400">Preparing your trading environment...</p>
          </motion.div>
        </div>
      </ProtectedLayout>
    )
  }

  // Use real data if available, otherwise fallback to mock data
  const displayMarketData = marketData?.stocks || stocksData
  const displayPortfolio = portfolio?.positions || portfolioPositions
  const portfolioValue = portfolio?.totalValue || 125430.67
  const dailyPnL = portfolio?.dayGainLoss || 2847.23
  const buyingPower = portfolio?.balance || 45230.67

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Hero Header Section */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900">
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23E01A1A' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
          
          {/* Header Content */}
          <div className="relative z-10 px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-7xl mx-auto"
            >
              {/* Market Status & Controls */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${isMarketOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'} shadow-lg`} />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                      {isMarketOpen ? 'Market Open' : 'Market Closed'}
                    </span>
                  </div>
                  
                  <div className="hidden sm:flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono text-lg font-medium">
                      {currentTime.toLocaleTimeString('en-US', { 
                        hour12: false,
                        timeZone: 'America/New_York'
                      })} EST
                    </span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-600/60 p-3 rounded-xl hover:bg-white/90 dark:hover:bg-gray-800/90 hover:border-gray-300/80 dark:hover:border-gray-500/80 transition-all duration-200 group shadow-sm hover:shadow-md"
                  >
                    {isPlaying ? 
                      <Pause className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" /> : 
                      <Play className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                    }
                  </button>
                  
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-600/60 p-3 rounded-xl hover:bg-white/90 dark:hover:bg-gray-800/90 hover:border-gray-300/80 dark:hover:border-gray-500/80 transition-all duration-200 group shadow-sm hover:shadow-md"
                  >
                    {soundEnabled ? 
                      <Volume2 className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" /> : 
                      <VolumeX className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                    }
                  </button>
                  
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-600/60 p-3 rounded-xl hover:bg-white/90 dark:hover:bg-gray-800/90 hover:border-gray-300/80 dark:hover:border-gray-500/80 transition-all duration-200 group relative shadow-sm hover:shadow-md"
                  >
                    <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                    {newsFeeds.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {Math.min(newsFeeds.length, 9)}
                      </span>
                    )}
                  </button>
                  
                  <button className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-600/60 p-3 rounded-xl hover:bg-white/90 dark:hover:bg-gray-800/90 hover:border-gray-300/80 dark:hover:border-gray-500/80 transition-all duration-200 group shadow-sm hover:shadow-md">
                    <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                  </button>
                </div>
              </div>

              {/* Portfolio Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-xl border border-gray-200/70 dark:border-gray-600/70 rounded-2xl p-6 hover:bg-white/95 dark:hover:bg-gray-800/95 hover:border-gray-300/90 dark:hover:border-gray-500/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                      <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Portfolio Value</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                      ${portfolioValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      +12.5% All Time
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-xl border border-gray-200/70 dark:border-gray-600/70 rounded-2xl p-6 hover:bg-white/95 dark:hover:bg-gray-800/95 hover:border-gray-300/90 dark:hover:border-gray-500/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Daily P&L</span>
                  </div>
                  <div className="space-y-1">
                    <p className={`text-2xl font-bold font-mono ${dailyPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {dailyPnL >= 0 ? '+' : ''}${Math.abs(dailyPnL).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      {dailyPnL >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {((dailyPnL / portfolioValue) * 100).toFixed(2)}% Today
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-xl border border-gray-200/70 dark:border-gray-600/70 rounded-2xl p-6 hover:bg-white/95 dark:hover:bg-gray-800/95 hover:border-gray-300/90 dark:hover:border-gray-500/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                      <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Buying Power</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                      ${buyingPower.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Available to trade
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-xl border border-gray-200/70 dark:border-gray-600/70 rounded-2xl p-6 hover:bg-white/95 dark:hover:bg-gray-800/95 hover:border-gray-300/90 dark:hover:border-gray-500/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                      <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Achievements</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {achievements.filter(a => a.unlocked).length}/{achievements.length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Unlocked
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <div className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-xl border border-gray-200/70 dark:border-gray-600/70 rounded-2xl p-2 shadow-lg">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'overview', label: 'Market Overview', icon: Globe },
                  { id: 'trading', label: 'Trading', icon: Activity },
                  { id: 'portfolio', label: 'Portfolio', icon: PieChart },
                  { id: 'education', label: 'Education', icon: BookOpen },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && <MarketOverviewTab marketIndices={marketIndices} stocks={displayMarketData} onStockSelect={handleStockSelect} />}
              {activeTab === 'trading' && <TradingTab stocks={displayMarketData} onTrade={handleTrade} buyingPower={buyingPower} selectedStock={selectedStockSymbol} setSelectedStock={setSelectedStockSymbol} selectedStockObj={selectedStock} onStockSelect={handleStockSelect} />}
              {activeTab === 'portfolio' && <PortfolioTab positions={displayPortfolio} />}
              {activeTab === 'education' && <EducationTab />}
              {activeTab === 'analytics' && <AnalyticsTab />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating News Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ duration: 0.3 }}
              className="fixed top-24 right-6 w-80 max-h-96 overflow-y-auto z-50"
            >
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/80 dark:border-gray-600/80 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Market News</h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-3">
                  {newsFeeds.map((news, index) => (
                    <div key={index} className="p-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{news.time}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          news.impact === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          news.impact === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {news.impact}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">{news.headline}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedLayout>
  )
}

// Tab Components
function MarketOverviewTab({ marketIndices, stocks, onStockSelect }: { marketIndices: MarketIndices[], stocks: Stock[], onStockSelect?: (stock: Stock) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Market Indices */}
      <div className="lg:col-span-1">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-600/80 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Market Indices
          </h3>
          <div className="space-y-4">
            {marketIndices.map((index, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-700/70 border border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-sm">
                <span className="font-medium text-gray-900 dark:text-white">{index.symbol}</span>
                <div className="text-right">
                  <div className="font-mono font-bold text-gray-900 dark:text-white">{index.price.toLocaleString()}</div>
                  <div className={`text-sm flex items-center gap-1 ${index.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {index.change >= 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {index.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Stocks */}
      <div className="lg:col-span-2">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-600/80 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Movers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stocks.slice(0, 6).map((stock) => (
              <button 
                key={stock.symbol} 
                onClick={() => onStockSelect?.(stock)}
                className="w-full p-4 bg-white/70 dark:bg-gray-700/70 border border-gray-200/50 dark:border-gray-600/50 rounded-xl hover:bg-white/90 dark:hover:bg-gray-700/90 hover:border-gray-300/70 dark:hover:border-gray-500/70 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{stock.symbol}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-gray-900 dark:text-white">${stock.price}</div>
                    <div className={`text-sm flex items-center gap-1 ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stock.change >= 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Vol: {stock.volume}</span>
                  <span className={`px-2 py-1 rounded ${
                    stock.analyst === 'BUY' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    stock.analyst === 'STRONG BUY' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {stock.analyst}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TradingTab({ stocks, onTrade, buyingPower, selectedStock, setSelectedStock, selectedStockObj, onStockSelect }: { 
  stocks: Stock[], 
  onTrade: (trade: TradeOrder) => void, 
  buyingPower: number,
  selectedStock: string | null,
  setSelectedStock: (stock: string | null) => void,
  selectedStockObj: Stock | null,
  onStockSelect: (stock: Stock) => void
}) {
  const [orderType, setOrderType] = useState('market')
  const [quantity, setQuantity] = useState(10)
  const [price, setPrice] = useState(0)
  
  return (
    <div className="space-y-6">
      {/* Stock Chart */}
      <StockChart 
        stocks={stocks} 
        selectedStock={selectedStockObj} 
        onStockSelect={onStockSelect}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Stock Selection */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-600/80 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Select Stock
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {stocks.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => {
                setSelectedStock(stock.symbol)
                setPrice(stock.price)
                onStockSelect(stock)
              }}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                selectedStock === stock.symbol
                  ? 'bg-primary-100 dark:bg-primary-900/50 border-2 border-primary-500 shadow-md'
                  : 'bg-white/70 dark:bg-gray-700/70 border border-gray-200/50 dark:border-gray-600/50 hover:bg-white/90 dark:hover:bg-gray-700/90 hover:border-gray-300/70 dark:hover:border-gray-500/70 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{stock.symbol}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-gray-900 dark:text-white">${stock.price}</div>
                  <div className={`text-sm ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Order Panel */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-600/80 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Place Order
        </h3>
        {selectedStock ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-700/60 rounded-xl shadow-sm">
              <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Selected Stock</div>
              <div className="font-bold text-blue-900 dark:text-blue-100">{selectedStock}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                onClick={() => onTrade({ symbol: selectedStock, type: 'BUY', shares: quantity, orderType: orderType, price, timeInForce: 'GTC' })}
              >
                Buy
              </button>
              <button 
                className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                onClick={() => onTrade({ symbol: selectedStock, type: 'SELL', shares: quantity, orderType: orderType, price, timeInForce: 'GTC' })}
              >
                Sell
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full p-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm focus:shadow-md transition-all duration-200"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full p-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm focus:shadow-md transition-all duration-200"
              >
                <option value="market">Market Order</option>
                <option value="limit">Limit Order</option>
              </select>
            </div>
            
            {orderType === 'limit' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Limit Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  className="w-full p-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm focus:shadow-md transition-all duration-200"
                />
              </div>
            )}
            
            <div className="p-4 bg-gray-100/80 dark:bg-gray-700/80 border border-gray-200/60 dark:border-gray-600/60 rounded-xl shadow-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Cost: ${(price * quantity).toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Available: ${buyingPower.toLocaleString()}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Select a stock to place an order
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

function PortfolioTab({ positions }: { positions: Position[] }) {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-600/80 rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <PieChart className="h-5 w-5" />
        Portfolio Holdings
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Symbol</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Shares</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Avg Cost</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Current</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Market Value</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">P&L</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => {
              const pnl = position.marketValue - (position.shares * position.avgCost)
              const pnlPercent = ((position.currentPrice - position.avgCost) / position.avgCost) * 100
              
              return (
                <tr key={position.symbol} className="border-b border-gray-100 dark:border-gray-800 hover:bg-white/50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{position.symbol}</td>
                  <td className="py-4 px-4 text-right text-gray-900 dark:text-white">{position.shares}</td>
                  <td className="py-4 px-4 text-right font-mono text-gray-900 dark:text-white">${position.avgCost.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right font-mono text-gray-900 dark:text-white">${position.currentPrice.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right font-mono text-gray-900 dark:text-white">${position.marketValue.toFixed(2)}</td>
                  <td className={`py-4 px-4 text-right font-mono ${
                    pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)} ({pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EducationTab() {
  const lessons = [
    { title: 'Introduction to Stock Trading', description: 'Learn the basics of buying and selling stocks', duration: '15 min', difficulty: 'Beginner' },
    { title: 'Understanding Market Orders', description: 'Difference between market and limit orders', duration: '10 min', difficulty: 'Beginner' },
    { title: 'Risk Management Strategies', description: 'How to protect your investments', duration: '20 min', difficulty: 'Intermediate' },
    { title: 'Technical Analysis Fundamentals', description: 'Reading charts and indicators', duration: '30 min', difficulty: 'Intermediate' },
    { title: 'Portfolio Diversification', description: 'Building a balanced investment portfolio', duration: '25 min', difficulty: 'Advanced' },
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((lesson, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white/85 dark:bg-gray-800/85 backdrop-blur-xl border border-gray-200/70 dark:border-gray-600/70 rounded-2xl p-6 hover:bg-white/95 dark:hover:bg-gray-800/95 hover:border-gray-300/90 dark:hover:border-gray-500/90 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
        >
          <div className="mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{lesson.title}</h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{lesson.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">{lesson.duration}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {lesson.difficulty}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function AnalyticsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-600/80 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Analytics
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200/60 dark:border-green-700/60 rounded-xl shadow-sm">
            <div className="text-sm text-green-700 dark:text-green-300 mb-1">Total Return</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">+25.43%</div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200/60 dark:border-blue-700/60 rounded-xl shadow-sm">
            <div className="text-sm text-blue-700 dark:text-blue-300 mb-1">Sharpe Ratio</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">1.47</div>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200/60 dark:border-purple-700/60 rounded-xl shadow-sm">
            <div className="text-sm text-purple-700 dark:text-purple-300 mb-1">Max Drawdown</div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">-8.2%</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/80 dark:border-gray-600/80 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Award className="h-5 w-5" />
          Trading Insights
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-white/80 dark:bg-gray-700/80 border border-gray-200/60 dark:border-gray-600/60 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-gray-900 dark:text-white">Recommendation</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Build a diversified portfolio to manage risk across different sectors.
            </p>
          </div>
          <div className="p-4 bg-white/80 dark:bg-gray-700/80 border border-gray-200/60 dark:border-gray-600/60 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">Peer Comparison</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Compare your trading strategies with other learners.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}