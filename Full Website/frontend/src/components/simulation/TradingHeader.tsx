'use client'

import { Volume2, VolumeX, Monitor, BookOpen } from 'lucide-react'

interface TradingHeaderProps {
  isMarketOpen: boolean
  currentTime: Date
  marketIndices: Array<{
    symbol: string
    price: number
    change: number
    changePercent: number
  }>
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  viewMode: string
  setViewMode: (mode: string) => void
}

export default function TradingHeader({
  isMarketOpen,
  currentTime,
  marketIndices,
  soundEnabled,
  setSoundEnabled,
  viewMode,
  setViewMode
}: TradingHeaderProps) {
  const getPerformanceColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getPerformanceIcon = (value: number) => {
    return value >= 0 ? '↗' : '↘'
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b-2 border-yellow-400 p-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Market Status & Clock */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isMarketOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-wide">
              {isMarketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
            </span>
          </div>
          
          <div className="text-yellow-400 font-bold text-xl font-mono">
            {currentTime.toLocaleTimeString('en-US', { 
              hour12: false,
              timeZone: 'America/New_York'
            })} EST
          </div>
          
          <div className="text-sm text-slate-300">
            Trading Session: 09:30 - 16:00
          </div>
        </div>

        {/* Market Indices Ticker */}
        <div className="flex items-center gap-8">
          {marketIndices.map((index, i) => (
            <div key={i} className="text-center">
              <div className="text-xs text-slate-400 font-mono">{index.symbol}</div>
              <div className="font-bold text-white font-mono">{index.price.toLocaleString()}</div>
              <div className={`text-xs flex items-center justify-center gap-1 ${getPerformanceColor(index.change)} font-mono`}>
                <span>{getPerformanceIcon(index.change)}</span>
                {formatPercentage(index.changePercent)}
              </div>
            </div>
          ))}
        </div>

        {/* Terminal Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-slate-800 hover:bg-slate-700 border border-yellow-400 text-yellow-400 p-2 rounded transition-all duration-200 hover:shadow-lg hover:shadow-yellow-400/20"
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
          
          <button 
            onClick={() => setViewMode(viewMode === 'professional' ? 'educational' : 'professional')}
            className="bg-slate-800 hover:bg-slate-700 border border-yellow-400 text-yellow-400 p-2 rounded transition-all duration-200 hover:shadow-lg hover:shadow-yellow-400/20"
          >
            {viewMode === 'professional' ? <Monitor className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
          </button>
          
          <div className="text-sm">
            <div className="text-slate-400 text-xs">Mode:</div>
            <div className="text-yellow-400 font-bold uppercase text-xs tracking-wide">{viewMode}</div>
          </div>
        </div>
      </div>
    </div>
  )
}