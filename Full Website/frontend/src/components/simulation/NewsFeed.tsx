'use client'

import { NewsItem } from '@/types/simulation'

interface NewsFeedProps {
  news: NewsItem[]
}

export default function NewsFeed({ news }: NewsFeedProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-400/30 rounded-lg backdrop-blur-sm shadow-xl h-full overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border-b border-yellow-400/30 p-4 flex justify-between items-center">
        <h3 className="font-bold text-yellow-400 uppercase tracking-wide">Market News</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-slate-400 font-mono uppercase">Live</span>
        </div>
      </div>
      
      <div className="overflow-y-auto h-full p-4 space-y-3">
        {news.map((item, i) => (
          <div key={i} className="p-3 border border-yellow-400/20 rounded-md bg-slate-900/50 hover:bg-slate-900/70 transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-yellow-400 font-bold font-mono">{item.time}</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  item.impact === 'positive' ? 'bg-green-400' : 
                  item.impact === 'negative' ? 'bg-red-400' : 'bg-gray-400'
                }`}></div>
                <span className={`text-xs px-2 py-1 rounded font-mono uppercase tracking-wide ${
                  item.severity === 'high' ? 'bg-red-900/40 text-red-300 border border-red-600/30' :
                  item.severity === 'medium' ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-600/30' :
                  'bg-gray-900/40 text-gray-300 border border-gray-600/30'
                }`}>
                  {item.severity}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{item.headline}</p>
          </div>
        ))}
      </div>
    </div>
  )
}