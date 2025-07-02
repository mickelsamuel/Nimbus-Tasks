'use client'

import { Position } from '@/types/simulation'

interface PortfolioPositionsProps {
  positions: Position[]
}

export default function PortfolioPositions({ positions }: PortfolioPositionsProps) {
  const getPerformanceColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-400/30 rounded-lg backdrop-blur-sm shadow-xl h-full overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border-b border-yellow-400/30 p-4 flex justify-between items-center">
        <h3 className="font-bold text-yellow-400 uppercase tracking-wide">Positions</h3>
        <div className="text-xs text-slate-400 font-mono">
          Total: {positions.length}
        </div>
      </div>
      
      <div className="overflow-y-auto h-full p-4 space-y-3">
        {positions.map((position, i) => {
          const pnl = (position.currentPrice - position.avgCost) * position.shares
          const pnlPercent = ((position.currentPrice - position.avgCost) / position.avgCost) * 100
          
          return (
            <div key={i} className="p-4 border border-yellow-400/20 rounded-md bg-slate-900/50 hover:bg-slate-900/70 transition-all duration-200">
              <div className="flex justify-between items-start mb-3">
                <span className="font-bold text-yellow-400 font-mono text-lg">{position.symbol}</span>
                <span className="text-xs text-slate-400 font-mono">{position.shares} shares</span>
              </div>
              <div className="text-sm space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Cost:</span>
                  <span className="text-white">{formatCurrency(position.avgCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current:</span>
                  <span className="text-white">{formatCurrency(position.currentPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Market Value:</span>
                  <span className="font-bold text-yellow-400">{formatCurrency(position.marketValue)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-700">
                  <span className="text-slate-400">P&L:</span>
                  <span className={`font-bold ${getPerformanceColor(pnl)}`}>
                    {formatCurrency(pnl)} ({formatPercentage(pnlPercent)})
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}