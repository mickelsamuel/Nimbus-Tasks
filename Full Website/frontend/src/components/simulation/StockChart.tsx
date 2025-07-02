'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Search, X } from 'lucide-react'
import { Stock } from '@/types/simulation'

interface ChartDataPoint {
  time: string
  price: number
  volume: number
}

interface StockChartProps {
  stocks: Stock[]
  selectedStock: Stock | null
  onStockSelect: (stock: Stock) => void
}

export default function StockChart({ stocks, selectedStock, onStockSelect }: StockChartProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])
  const [showSearch, setShowSearch] = useState(false)

  // Generate mock chart data for selected stock
  useEffect(() => {
    if (selectedStock) {
      const data: ChartDataPoint[] = []
      const basePrice = selectedStock.price
      const now = new Date()
      
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const volatility = 0.02 + Math.random() * 0.03
        const change = (Math.random() - 0.5) * volatility
        const price = basePrice * (1 + change * (i / 30))
        const volume = Math.floor(Math.random() * 50000000) + 10000000
        
        data.push({ time, price, volume })
      }
      
      // Sort by time and smooth the price progression
      data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      for (let i = 1; i < data.length; i++) {
        data[i].price = data[i-1].price * (1 + (Math.random() - 0.5) * 0.03)
      }
      
      setChartData(data)
    }
  }, [selectedStock])

  // Filter stocks based on search
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.sector.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredStocks(filtered)
    } else {
      setFilteredStocks([])
    }
  }, [searchTerm, stocks])

  const maxPrice = Math.max(...chartData.map(d => d.price))
  const minPrice = Math.min(...chartData.map(d => d.price))
  const priceRange = maxPrice - minPrice

  const getPathData = () => {
    if (chartData.length === 0) return ''
    
    const width = 800
    const height = 300
    const padding = 40
    
    const points = chartData.map((point, index) => {
      const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding)
      const y = height - padding - ((point.price - minPrice) / priceRange) * (height - 2 * padding)
      return `${x},${y}`
    })
    
    return `M ${points.join(' L ')}`
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-2xl shadow-xl">
      {/* Header with Search */}
      <div className="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Stock Chart
          </h2>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search stocks by symbol, name, or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {/* Search Results */}
            {filteredStocks.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => {
                      onStockSelect(stock)
                      setSearchTerm('')
                      setShowSearch(false)
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {stock.symbol}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {stock.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">
                          ${stock.price.toFixed(2)}
                        </div>
                        <div className={`text-sm flex items-center ${
                          stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Stock Info */}
        {selectedStock ? (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedStock.symbol} - {selectedStock.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedStock.sector}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${selectedStock.price.toFixed(2)}
              </div>
              <div className={`flex items-center justify-end ${
                selectedStock.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedStock.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="font-medium">
                  {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} 
                  ({selectedStock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Select a stock to view its chart
          </div>
        )}
      </div>

      {/* Chart */}
      {selectedStock && chartData.length > 0 && (
        <div className="p-6">
          <div className="relative">
            <svg
              width="100%"
              height="300"
              viewBox="0 0 800 300"
              className="border border-gray-200 dark:border-gray-600 rounded-lg bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800"
            >
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="80" height="30" patternUnits="userSpaceOnUse">
                  <path
                    d="M 80 0 L 0 0 0 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-gray-300 dark:text-gray-600"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Price line */}
              <path
                d={getPathData()}
                fill="none"
                stroke="url(#priceGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Area under curve */}
              <path
                d={`${getPathData()} L 760,260 L 40,260 Z`}
                fill="url(#areaGradient)"
                opacity="0.1"
              />
              
              {/* Gradients */}
              <defs>
                <linearGradient id="priceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className="text-blue-500" stopColor="currentColor" />
                  <stop offset="100%" className="text-purple-500" stopColor="currentColor" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" className="text-blue-500" stopColor="currentColor" />
                  <stop offset="100%" className="text-purple-500" stopColor="currentColor" />
                </linearGradient>
              </defs>
              
              {/* Data points */}
              {chartData.map((point, index) => {
                const x = 40 + (index / (chartData.length - 1)) * 720
                const y = 260 - ((point.price - minPrice) / priceRange) * 220
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="currentColor"
                    className="text-blue-500 hover:text-blue-600 cursor-pointer"
                  />
                )
              })}
            </svg>
            
            {/* Chart info */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-600 dark:text-gray-400">Day Range</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  ${selectedStock.dayRange[0]?.toFixed(2)} - ${selectedStock.dayRange[1]?.toFixed(2)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-gray-400">Volume</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {selectedStock.volume}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-gray-400">Market Cap</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {selectedStock.marketCap}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}