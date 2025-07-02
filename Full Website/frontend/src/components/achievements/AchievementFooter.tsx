'use client'

import { motion } from 'framer-motion'
import { Trophy, Download, Share2, ExternalLink } from 'lucide-react'

interface AchievementFooterProps {
  onExportReport?: () => void
  onShareAchievements?: () => void
  onViewRecommendations?: () => void
}

export const AchievementFooter = ({
  onExportReport,
  onShareAchievements,
  onViewRecommendations
}: AchievementFooterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="mt-12 text-center"
    >
      <div className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-2xl p-8 border border-gradient-to-r from-red-500/20 to-yellow-500/20">
        <motion.div
          className="flex justify-center mb-4"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Trophy className="h-16 w-16 text-yellow-500" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Keep Up the Great Work!
        </h3>
        
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
          Your professional development journey at National Bank is making real impact. 
          Every achievement represents growth, learning, and valuable contributions to our organization.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExportReport}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Export Progress Report
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShareAchievements}
            className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Share2 className="h-5 w-5" />
            Share Achievements
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewRecommendations}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
          >
            <ExternalLink className="h-5 w-5" />
            View Learning Recommendations
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}