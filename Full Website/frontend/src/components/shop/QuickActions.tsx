'use client'

import { RefreshCw, Grid, RotateCcw } from 'lucide-react'

interface QuickActionsProps {
  onRefresh: () => void
  onClearFilters: () => void
  onToggleView: () => void
}

export default function QuickActions({ onRefresh, onClearFilters, onToggleView }: QuickActionsProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
        
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Clear Filters
        </button>
      </div>

      <button
        onClick={onToggleView}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200"
      >
        <Grid className="w-4 h-4" />
        Toggle View
      </button>
    </div>
  )
}