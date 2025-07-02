'use client'

import { Search, Filter, RefreshCw } from 'lucide-react'
import { Stock } from '@/types/simulation'

interface MarketWatchProps {
  stocks: Stock[]
  selectedStock: string | null
  setSelectedStock: (symbol: string) => void
}

export default function MarketWatch({ stocks, selectedStock, setSelectedStock }: MarketWatchProps) {
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
        <h3 className="font-bold text-yellow-400 uppercase tracking-wide">Market Watch</h3>
        <div className="flex gap-2">
          <button className="bg-slate-700 hover:bg-slate-600 border border-yellow-400/50 text-yellow-400 p-1.5 rounded transition-all duration-200">
            <Search className="h-4 w-4" />
          </button>
          <button className="bg-slate-700 hover:bg-slate-600 border border-yellow-400/50 text-yellow-400 p-1.5 rounded transition-all duration-200">
            <Filter className="h-4 w-4" />
          </button>
          <button className="bg-slate-700 hover:bg-slate-600 border border-yellow-400/50 text-yellow-400 p-1.5 rounded transition-all duration-200">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto h-full">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-900 border-b border-yellow-400/30">
            <tr className="text-yellow-400">
              <th className="text-left p-3 font-mono text-xs uppercase tracking-wide">Symbol</th>
              <th className="text-right p-3 font-mono text-xs uppercase tracking-wide">Price</th>
              <th className="text-right p-3 font-mono text-xs uppercase tracking-wide">Change</th>
              <th className="text-right p-3 font-mono text-xs uppercase tracking-wide">%</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, i) => (
              <tr 
                key={i} 
                className={`border-b border-yellow-400/10 hover:bg-yellow-400/5 cursor-pointer transition-all duration-200
                  ${selectedStock === stock.symbol ? 'bg-yellow-400/10 border-yellow-400/30' : ''}
                `}
                onClick={() => setSelectedStock(stock.symbol)}
              >
                <td className="p-3">
                  <div>
                    <div className="font-bold text-yellow-400 font-mono">{stock.symbol}</div>
                    <div className="text-xs text-slate-400 truncate font-mono">{stock.name}</div>
                  </div>
                </td>
                <td className="text-right p-3 font-bold font-mono text-white">
                  {formatCurrency(stock.price)}
                </td>
                <td className={`text-right p-3 font-mono ${getPerformanceColor(stock.change)}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                </td>
                <td className={`text-right p-3 font-bold font-mono ${getPerformanceColor(stock.change)}`}>
                  {formatPercentage(stock.changePercent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}