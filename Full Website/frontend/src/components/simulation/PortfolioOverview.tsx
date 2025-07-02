'use client'

interface PortfolioOverviewProps {
  portfolioValue: number
  dailyPnL: number
}

export default function PortfolioOverview({ portfolioValue, dailyPnL }: PortfolioOverviewProps) {
  const getPerformanceColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400'
  }

  const getPerformanceIcon = (value: number) => {
    return value >= 0 ? '↗' : '↘'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-400/30 rounded-lg backdrop-blur-sm shadow-xl">
      <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border-b border-yellow-400/30 p-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-yellow-400 uppercase tracking-wide">Portfolio Overview</h2>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-slate-400 font-mono">Total Value</div>
            <div className="text-2xl font-bold text-yellow-400 font-mono">
              {formatCurrency(portfolioValue)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400 font-mono">Daily P&L</div>
            <div className={`text-xl font-bold flex items-center gap-2 ${getPerformanceColor(dailyPnL)} font-mono`}>
              <span>{getPerformanceIcon(dailyPnL)}</span>
              {formatCurrency(Math.abs(dailyPnL))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400 font-mono">ROI</div>
            <div className="text-xl font-bold text-slate-400 font-mono">--</div>
          </div>
        </div>
      </div>
    </div>
  )
}