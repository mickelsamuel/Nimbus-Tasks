'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { VirtualSpace } from '@/types'
import { Users, Clock, Building2, X } from 'lucide-react'

interface SpaceJoinModalProps {
  isOpen: boolean
  space: VirtualSpace | null
  onJoin: () => void
  onCancel: () => void
}

export default function SpaceJoinModal({ isOpen, space, onJoin, onCancel }: SpaceJoinModalProps) {
  if (!space) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 rounded-3xl border border-gray-200/50 dark:border-slate-700/50 shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 dark:hover:bg-slate-700/20 rounded-xl transition-colors z-10"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Header with Gradient */}
            <div className="relative h-32 bg-gradient-to-br from-primary-500/20 to-primary-600/30 overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
              
              {/* Space Icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Join {space.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {space.description}
                </p>
                
                {/* Space Details */}
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-xl border border-primary-200 dark:border-primary-700">
                    <Users className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    <span className="font-semibold text-primary-800 dark:text-primary-200">
                      {space.currentUsers || 0}/{space.maxUsers || 10}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-200 dark:border-green-700">
                    <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-800 dark:text-green-200">
                      Active now
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              {space.features && space.features.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Available Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {space.features.slice(0, 4).map((feature: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-lg font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                    {space.features.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs rounded-lg font-medium">
                        +{space.features.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-6 py-3 bg-white/50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={onJoin}
                  className="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold transform hover:scale-105"
                >
                  Join Space
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}