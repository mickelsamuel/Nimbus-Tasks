'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api/client'
import { 
  GraduationCap, Clock,
  CheckCircle2, Circle, Lock, ChevronRight,
  Star, Trophy,
  BookOpen, Rocket, Crown, Flame
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { LearningProgress, DashboardStats } from '@/types/dashboard'

interface DashboardLearningProgressProps {
  learningProgress: LearningProgress
  stats: DashboardStats
}

interface Module {
  id: number
  title: string
  status: 'completed' | 'current' | 'locked'
  xp: number
  duration: string
  progress?: number
}

export function DashboardLearningProgress({ learningProgress, stats }: DashboardLearningProgressProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [expandedView, setExpandedView] = useState(false)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch user's enrolled modules
  useEffect(() => {
    const fetchUserModules = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const response = await api.get('/modules/user/enrolled')
        const enrolledModules = response.data || []
        
        // Map enrolled modules to the format expected by the component
        interface EnrolledModule {
          moduleId?: {
            _id?: string;
            id?: number;
            title: string;
            totalDuration?: number;
            points?: number;
            category: string;
          };
          _id?: string;
          id?: number;
          title?: string;
          totalDuration?: number;
          points?: number;
          category?: string;
          progress?: number;
          completedAt?: string;
        }
        
        const mappedModules: Module[] = enrolledModules.map((enrolled: EnrolledModule) => {
          const moduleData = enrolled.moduleId || enrolled
          const progress = enrolled.progress || 0
          
          let status: 'completed' | 'current' | 'locked' = 'locked'
          if (enrolled.completedAt) {
            status = 'completed'
          } else if (progress > 0) {
            status = 'current'
          }
          
          return {
            id: moduleData._id || moduleData.id,
            title: moduleData.title,
            status,
            xp: moduleData.points || 250,
            duration: moduleData.totalDuration ? `${Math.round(moduleData.totalDuration / 60)}h` : '2h',
            progress: status === 'current' ? progress : undefined
          }
        })
        
        setModules(mappedModules)
      } catch (error) {
        // Fallback to empty array - show encouraging message
        setModules([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserModules()
  }, [user])

  const totalProgress = learningProgress.totalModules > 0 
    ? (learningProgress.completedModules / learningProgress.totalModules) * 100 
    : 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
      case 'current':
        return <Circle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-400 dark:text-gray-600" />
      default:
        return null
    }
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50'
      case 'current':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 ring-2 ring-blue-500 dark:ring-blue-400'
      case 'locked':
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800/50 opacity-60'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Enhanced Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="p-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-xl shadow-lg flex-shrink-0"
            >
              <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-gray-900 via-purple-700 to-indigo-700 dark:from-white dark:via-purple-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Learning Progress
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 font-medium max-w-2xl">
            Your personalized journey to professional mastery and excellence
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpandedView(!expandedView)}
          className="flex items-center gap-2 px-4 py-3 lg:px-6 lg:py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-sm lg:text-base flex-shrink-0"
        >
          <BookOpen className="w-4 h-4 lg:w-5 lg:h-5" />
          <span>{expandedView ? 'Show Less' : 'Show More'}</span>
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="dashboard-card rounded-2xl p-6 lg:p-8 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-slate-900/80 dark:to-gray-900/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl"
      >

        {/* Enhanced Overall Progress */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative overflow-hidden bg-gradient-to-r from-purple-50/80 via-indigo-50/80 to-blue-50/80 dark:from-purple-900/40 dark:via-indigo-900/40 dark:to-blue-900/40 rounded-2xl p-6 lg:p-8 mb-8 border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm"
        >
          {/* Background Animation */}
          <motion.div 
            animate={{ 
              background: [
                'radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 60%)',
                'radial-gradient(circle at 80% 80%, rgba(79, 70, 229, 0.1) 0%, transparent 60%)',
                'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
                'radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 60%)'
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg flex-shrink-0"
                >
                  <Trophy className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </motion.div>
                <div className="min-w-0">
                  <h3 className="text-lg lg:text-xl font-black text-gray-900 dark:text-white mb-1">
                    {learningProgress.currentPath}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300 font-medium">
                    Professional Development Track
                  </p>
                </div>
              </div>
              <motion.div
                key={totalProgress}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-right flex-shrink-0"
              >
                <span className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  {Math.round(totalProgress)}%
                </span>
                <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Complete
                </p>
              </motion.div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="space-y-4">
              <div className="relative h-4 lg:h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${totalProgress}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 via-blue-500 to-cyan-500 rounded-full relative overflow-hidden shadow-lg"
                >
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  />
                </motion.div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm lg:text-base">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {learningProgress.completedModules} of {learningProgress.totalModules} modules completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    Est. completion: {learningProgress.estimatedCompletion}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Module Timeline */}
        <div className="space-y-4 lg:space-y-6">
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4">
            Module Timeline
          </h3>
          <AnimatePresence>
            {loading ? (
              // Loading state
              [1, 2, 3].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="flex items-start gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : modules.length === 0 ? (
              // Empty state
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 px-4 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"
              >
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  No modules enrolled yet
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Start your learning journey by enrolling in your first module
                </p>
                <button 
                  onClick={() => router.push('/modules')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Modules
                </button>
              </motion.div>
            ) : (
              modules.slice(0, expandedView ? modules.length : 3).map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={module.status !== 'locked' ? { scale: 1.02, y: -2 } : {}}
                whileTap={module.status !== 'locked' ? { scale: 0.98 } : {}}
                onClick={() => module.status !== 'locked' && router.push(`/modules/${module.id}`)}
                className={`
                  group relative overflow-hidden rounded-2xl border p-4 lg:p-6 transition-all duration-300 backdrop-blur-sm min-h-[120px]
                  ${getStatusStyles(module.status)}
                  ${module.status === 'current' ? 'shadow-xl ring-2 ring-blue-500/50' : 'shadow-sm'}
                  ${module.status !== 'locked' ? 'cursor-pointer hover:shadow-xl' : 'cursor-not-allowed'}
                `}
              >
                {/* Shimmer Effect for Active Modules */}
                {module.status !== 'locked' && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="h-full w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 blur-sm"
                    />
                  </div>
                )}

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <motion.div
                      whileHover={module.status !== 'locked' ? { rotate: 360, scale: 1.1 } : {}}
                      transition={{ duration: 0.6 }}
                      className="flex-shrink-0"
                    >
                      {getStatusIcon(module.status)}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm lg:text-base font-bold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors line-clamp-1">
                        {module.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 lg:gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {module.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500 flex-shrink-0" />
                          <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {module.xp} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {module.status === 'current' && module.progress && (
                    <div className="text-right flex-shrink-0 ml-4">
                      <motion.span 
                        key={module.progress}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-sm lg:text-base font-bold text-blue-600 dark:text-blue-400"
                      >
                        {module.progress}%
                      </motion.span>
                      <div className="w-20 lg:w-24 h-2 lg:h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${module.progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full relative"
                        >
                          <motion.div 
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          />
                        </motion.div>
                      </div>
                    </div>
                  )}
                  
                  {module.status !== 'locked' && (
                    <motion.div
                      whileHover={{ scale: 1.1, x: 5 }}
                      className="flex-shrink-0 ml-4"
                    >
                      <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                    </motion.div>
                  )}
                </div>

                {/* Enhanced Connection line */}
                {index < modules.slice(0, expandedView ? modules.length : 3).length - 1 && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 24 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="absolute left-7 lg:left-8 top-full w-0.5 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent dark:from-gray-700 dark:via-gray-600 dark:to-transparent"
                  />
                )}
              </motion.div>
            )))}
          </AnimatePresence>
        </div>

        {/* Enhanced Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-8 border-t border-gray-200/50 dark:border-gray-600/50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="group text-center p-4 lg:p-6 bg-gradient-to-br from-amber-50/80 to-yellow-50/80 dark:from-amber-900/40 dark:to-yellow-900/40 rounded-2xl border border-amber-200/50 dark:border-amber-700/50 shadow-sm hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-4"
            >
              <div className="p-3 lg:p-4 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-xl shadow-lg group-hover:shadow-xl">
                <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </motion.div>
            <motion.p 
              key={stats.level}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl lg:text-3xl font-black text-amber-700 dark:text-amber-300 mb-2"
            >
              {stats.level}
            </motion.p>
            <p className="text-xs lg:text-sm text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
              Current Level
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="group text-center p-4 lg:p-6 bg-gradient-to-br from-purple-50/80 to-indigo-50/80 dark:from-purple-900/40 dark:to-indigo-900/40 rounded-2xl border border-purple-200/50 dark:border-purple-700/50 shadow-sm hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-4"
            >
              <div className="p-3 lg:p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl">
                <Star className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </motion.div>
            <motion.p 
              key={learningProgress.xpGained}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl lg:text-3xl font-black text-purple-700 dark:text-purple-300 mb-2"
            >
              {(learningProgress.xpGained || 0).toLocaleString()}
            </motion.p>
            <p className="text-xs lg:text-sm text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
              XP Earned
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="group text-center p-4 lg:p-6 bg-gradient-to-br from-orange-50/80 to-red-50/80 dark:from-orange-900/40 dark:to-red-900/40 rounded-2xl border border-orange-200/50 dark:border-orange-700/50 shadow-sm hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
          >
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-4"
            >
              <div className="p-3 lg:p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-xl">
                <Flame className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </motion.div>
            <motion.p 
              key={stats.streak}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl lg:text-3xl font-black text-orange-700 dark:text-orange-300 mb-2"
            >
              {stats.streak}
            </motion.p>
            <p className="text-xs lg:text-sm text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">
              Day Streak
            </p>
          </motion.div>
        </div>

        {/* Enhanced Next Milestone */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="group relative overflow-hidden mt-8 p-6 lg:p-8 bg-gradient-to-r from-primary-50/80 via-primary-100/80 to-primary-200/80 dark:from-primary-900/40 dark:via-primary-800/40 dark:to-primary-700/40 rounded-2xl border border-primary-200/50 dark:border-primary-700/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {/* Background Animation */}
          <motion.div 
            animate={{ 
              background: [
                'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 60%)',
                'radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
                'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
                'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 60%)'
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="p-3 lg:p-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg group-hover:shadow-xl flex-shrink-0"
              >
                <Rocket className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </motion.div>
              <div className="min-w-0">
                <p className="text-sm lg:text-base font-bold text-primary-900 dark:text-primary-100 mb-1">
                  Next Milestone
                </p>
                <p className="text-lg lg:text-xl font-black text-primary-800 dark:text-primary-200 line-clamp-1">
                  {learningProgress.nextMilestone}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <motion.p 
                key={learningProgress.xpToNextLevel}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl lg:text-3xl font-black text-primary-700 dark:text-primary-300"
              >
                {learningProgress.xpToNextLevel.toLocaleString()}
              </motion.p>
              <p className="text-xs lg:text-sm text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider">
                XP to go
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}