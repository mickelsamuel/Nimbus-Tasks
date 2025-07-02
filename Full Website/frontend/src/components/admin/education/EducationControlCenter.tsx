'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  GraduationCap,
  Plus,
  Search,
  Download,
  BookOpen,
  Users,
  Target,
  Star,
  FileText,
  BarChart3,
  ChevronRight,
  AlertCircle
} from 'lucide-react'
import { Module } from '../types'
import { ModuleManagementCard } from './ModuleManagementCard'
import { TrainingProgressHeatmap } from './TrainingProgressHeatmap'
import { adminAPI } from '@/lib/api/admin'

export const EducationControlCenter = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const modulesData = await adminAPI.getModules()
        setModules(modulesData || [])
      } catch (error) {
        console.error('Error fetching modules:', error)
        setError('Failed to load training modules')
        setModules([])
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || module.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || module.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleExport = async () => {
    try {
      const exportData = await adminAPI.exportData('modules', 'json')
      
      const url = URL.createObjectURL(exportData)
      const a = document.createElement('a')
      a.href = url
      a.download = `training-modules-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      setError('Failed to export modules. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-red-500">Error</h3>
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Education Control Header */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <GraduationCap className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">Education Control</h2>
              <p className="text-slate-300">Training module oversight with completion heatmaps</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Module
          </motion.button>
        </div>

        {/* Module Management Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
          >
            <option value="all">All Categories</option>
            <option value="Risk Management">Risk Management</option>
            <option value="Investment">Investment</option>
            <option value="Customer Relations">Customer Relations</option>
            <option value="Compliance">Compliance</option>
            <option value="Technology">Technology</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-3 text-white transition-colors flex items-center justify-center gap-2"
          >
            <Download className="h-5 w-5" />
            Export
          </motion.button>
        </div>
      </div>

      {/* Training Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module, index) => (
          <ModuleManagementCard
            key={module.id}
            module={module}
            index={index}
          />
        ))}
      </div>

      {/* Training Overview & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrainingProgressHeatmap />
        
        {/* Training Statistics */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Modules', value: modules.length, icon: BookOpen, color: 'green' },
              { label: 'Active Learners', value: 15, icon: Users, color: 'blue' },
              { label: 'Avg Completion', value: `${Math.round(modules.reduce((acc, m) => acc + m.completionRate, 0) / modules.length)}%`, icon: Target, color: 'purple' },
              { label: 'Avg Rating', value: (modules.reduce((acc, m) => acc + m.ratings, 0) / modules.length).toFixed(1), icon: Star, color: 'yellow' }
            ].map((stat, index) => {
              const IconComponent = stat.icon
              
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent className={`h-5 w-5 text-${stat.color}-400`} />
                    <span className="text-slate-300 text-sm font-medium">{stat.label}</span>
                  </div>
                  <div className={`text-xl font-bold text-${stat.color}-400`}>
                    {stat.value}
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          {/* Quick Actions Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'Generate Learning Report', icon: FileText, color: 'blue' },
                { label: 'Bulk Assign Modules', icon: Users, color: 'green' },
                { label: 'Update Curriculum', icon: BookOpen, color: 'purple' },
                { label: 'Analytics Dashboard', icon: BarChart3, color: 'yellow' }
              ].map((action) => {
                const IconComponent = action.icon
                
                return (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                  >
                    <IconComponent className={`h-5 w-5 text-${action.color}-400`} />
                    <span className="text-slate-300">{action.label}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}