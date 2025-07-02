'use client'

import { Stock } from '@/types/simulation'

interface MarketTickerProps {
  stocks: Stock[]
}

export default function MarketTicker({ stocks }: MarketTickerProps) {
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
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-t-2 border-b-2 border-yellow-400 overflow-hidden whitespace-nowrap py-3">
      <div className="inline-block animate-marquee font-mono text-sm font-medium">
        {stocks.map((stock, i) => (
          <span key={i} className="inline-block mx-8">
            <span className="text-yellow-400 font-bold">{stock.symbol}</span>
            <span className="mx-3 text-white">{formatCurrency(stock.price)}</span>
            <span className={getPerformanceColor(stock.change)}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({formatPercentage(stock.changePercent)})
            </span>
          </span>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translate3d(100%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        
        .animate-marquee {
          animation: marquee 120s linear infinite;
          padding-left: 100%;
        }
        
        @media (max-width: 1024px) {
          .animate-marquee {
            animation-duration: 60s;
          }
        }
      `}</style>
    </div>
  )
}