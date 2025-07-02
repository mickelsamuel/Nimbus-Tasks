'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, AlertCircle, Info } from 'lucide-react'
import { Training } from '../types'
import { adminAPI } from '@/lib/api/admin'

export const TrainingProgressHeatmap = () => {
  const [activeTrainings, setActiveTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'in_progress': return 'text-blue-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const fetchTrainingProgress = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const trainings = await adminAPI.getTrainingProgress()
      setActiveTrainings(trainings || [])
    } catch (error) {
      console.error('Error fetching training progress:', error)
      setError('Failed to load training progress')
      setActiveTrainings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrainingProgress()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Training Progress Heatmap</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchTrainingProgress}
          disabled={loading}
          className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 text-green-400 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 bg-red-500/10 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm text-red-400">{error}</span>
          </div>
        ) : activeTrainings.length === 0 ? (
          <div className="text-center py-8">
            <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No active training sessions</p>
          </div>
        ) : (
          activeTrainings.map((training, index) => {
            return (
              <motion.div
                key={training.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {training.userName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-white">{training.userName}</h4>
                  <p className="text-sm text-slate-300">{training.moduleName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <motion.div
                        className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${training.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 min-w-[3rem]">{training.progress}%</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-medium ${getStatusColor(training.status)} capitalize`}>
                    {training.status.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-slate-400">{training.timeSpent}min</div>
                  {training.score && (
                    <div className="text-xs text-yellow-400">Score: {training.score}%</div>
                  )}
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </motion.div>
  )
}