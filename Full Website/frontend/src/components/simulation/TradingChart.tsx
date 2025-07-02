'use client'

import { BarChart3 } from 'lucide-react'

interface TradingChartProps {
  selectedStock: string | null
}

export default function TradingChart({ selectedStock }: TradingChartProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-400/30 rounded-lg backdrop-blur-sm shadow-xl h-full">
      <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border-b border-yellow-400/30 p-4 flex justify-between items-center">
        <h3 className="font-bold text-yellow-400 uppercase tracking-wide">
          {selectedStock || 'AAPL'} - Advanced Chart
        </h3>
        <div className="flex gap-2">
          <button className="bg-yellow-400 text-slate-900 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">1D</button>
          <button className="bg-slate-700 hover:bg-slate-600 border border-yellow-400/50 text-yellow-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide transition-all duration-200">5D</button>
          <button className="bg-slate-700 hover:bg-slate-600 border border-yellow-400/50 text-yellow-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide transition-all duration-200">1M</button>
          <button className="bg-slate-700 hover:bg-slate-600 border border-yellow-400/50 text-yellow-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide transition-all duration-200">3M</button>
          <button className="bg-slate-700 hover:bg-slate-600 border border-yellow-400/50 text-yellow-400 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide transition-all duration-200">1Y</button>
        </div>
      </div>
      
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <BarChart3 className="h-24 w-24 text-yellow-400/30 mx-auto mb-4" />
          <div className="text-slate-400 font-mono text-lg mb-2">Advanced TradingView Chart Integration</div>
          <div className="text-xs text-slate-500 font-mono">
            Candlestick • Volume • Technical Indicators
          </div>
        </div>
      </div>
    </div>
  )
}