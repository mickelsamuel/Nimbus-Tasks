'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  RefreshCw,
  Cpu,
  HardDrive,
  Database,
  AlertCircle,
  Info
} from 'lucide-react'
import { adminAPI } from '@/lib/api/admin'
import { SystemMetric } from '@/components/admin/types'

export const SystemHealthMonitor = () => {
  
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSystemHealth = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const metrics = await adminAPI.getSystemMetrics()
      
      // Filter for system health metrics
      const healthMetrics = metrics.filter(m => 
        ['cpu', 'storage', 'database', 'memory'].includes(m.label.toLowerCase())
      )
      
      if (healthMetrics.length > 0) {
        setSystemMetrics(healthMetrics)
      } else {
        // Fallback structure
        setSystemMetrics([
          { id: 'cpu', icon: Cpu, label: 'CPU Usage', value: 'N/A', change: 0, status: 'warning', trend: [50, 55, 50, 52, 51], lastUpdated: new Date().toISOString() },
          { id: 'storage', icon: HardDrive, label: 'Storage', value: 'N/A', change: 0, status: 'warning', trend: [60, 62, 58, 61, 59], lastUpdated: new Date().toISOString() },
          { id: 'database', icon: Database, label: 'Database', value: 'N/A', change: 0, status: 'warning', trend: [40, 42, 39, 41, 40], lastUpdated: new Date().toISOString() }
        ])
      }
    } catch (error) {
      console.error('Error fetching system health:', error)
      setError('Failed to load system health data')
      setSystemMetrics([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSystemHealth()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">System Health</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchSystemHealth}
          disabled={loading}
          className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 text-red-500 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {error ? (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
        </div>
      ) : systemMetrics.length === 0 ? (
        <div className="text-center py-8">
          <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No system health data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {systemMetrics.map((item, index) => {
            const IconComponent = item.icon || Cpu
            
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-4 bg-white/5 dark:bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-3 mb-2">
                  <IconComponent className={`h-5 w-5 ${
                    item.status === 'healthy' ? 'text-green-500' : 
                    item.status === 'warning' ? 'text-yellow-500' : 
                    item.status === 'critical' ? 'text-red-500' : 'text-gray-500'
                  }`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                </div>
                <div className={`text-lg font-bold ${
                  item.status === 'healthy' ? 'text-green-600 dark:text-green-400' : 
                  item.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 
                  item.status === 'critical' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {item.value}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}