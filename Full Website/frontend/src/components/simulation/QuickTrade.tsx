'use client'

import { useState } from 'react'

interface QuickTradeProps {
  buyingPower: number
  onTrade: (trade: TradeOrder) => void
}

interface TradeOrder {
  symbol: string
  type: 'BUY' | 'SELL'
  shares: number
  orderType: string
  price?: number
  timeInForce: string
}

export default function QuickTrade({ buyingPower, onTrade }: QuickTradeProps) {
  const [symbol, setSymbol] = useState('AAPL')
  const [quantity, setQuantity] = useState('100')
  const [orderType, setOrderType] = useState('MARKET')
  const [price, setPrice] = useState('178.45')
  const [timeInForce, setTimeInForce] = useState('DAY')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const handleTrade = (type: 'BUY' | 'SELL') => {
    const trade: TradeOrder = {
      symbol: symbol.toUpperCase(),
      type,
      shares: parseInt(quantity),
      orderType,
      price: orderType === 'MARKET' ? undefined : parseFloat(price),
      timeInForce
    }
    onTrade(trade)
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-400/30 rounded-lg backdrop-blur-sm shadow-xl h-full">
      <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border-b border-yellow-400/30 p-4 flex justify-between items-center">
        <h3 className="font-bold text-yellow-400 uppercase tracking-wide">Quick Trade</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Buying Power:</span>
          <span className="text-sm font-bold text-yellow-400 font-mono">{formatCurrency(buyingPower)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6 h-full p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-2 font-mono uppercase tracking-wide">Symbol</label>
            <input 
              type="text" 
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-slate-900/50 border border-yellow-400/30 text-white p-3 rounded font-mono focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-2 font-mono uppercase tracking-wide">Quantity</label>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-900/50 border border-yellow-400/30 text-white p-3 rounded font-mono focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-2 font-mono uppercase tracking-wide">Order Type</label>
            <select 
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full bg-slate-900/50 border border-yellow-400/30 text-white p-3 rounded font-mono focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all duration-200"
            >
              <option value="MARKET">MARKET</option>
              <option value="LIMIT">LIMIT</option>
              <option value="STOP">STOP</option>
              <option value="STOP-LIMIT">STOP-LIMIT</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-2 font-mono uppercase tracking-wide">Price</label>
            <input 
              type="number" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={orderType === 'MARKET'}
              className="w-full bg-slate-900/50 border border-yellow-400/30 text-white p-3 rounded font-mono focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-2 font-mono uppercase tracking-wide">Time in Force</label>
            <select 
              value={timeInForce}
              onChange={(e) => setTimeInForce(e.target.value)}
              className="w-full bg-slate-900/50 border border-yellow-400/30 text-white p-3 rounded font-mono focus:outline-none focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/20 transition-all duration-200"
            >
              <option value="DAY">DAY</option>
              <option value="GTC">GTC</option>
              <option value="IOC">IOC</option>
              <option value="FOK">FOK</option>
            </select>
          </div>
          <div className="space-y-3 pt-4">
            <button 
              onClick={() => handleTrade('BUY')}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3 px-6 rounded uppercase tracking-wider transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5"
            >
              Buy
            </button>
            <button 
              onClick={() => handleTrade('SELL')}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 px-6 rounded uppercase tracking-wider transition-all duration-200 hover:shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5"
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}