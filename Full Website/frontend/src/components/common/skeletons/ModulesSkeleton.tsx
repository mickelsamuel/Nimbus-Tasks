'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  CardSkeleton, 
  TextSkeleton,
  CircleSkeleton,
  RectangleSkeleton,
  ButtonSkeleton
} from '../Skeleton'

const ModulesSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <TextSkeleton lines={1} className="w-48 h-8" />
              <TextSkeleton lines={1} className="w-64 h-4" />
            </div>
            <div className="flex items-center space-x-4">
              <ButtonSkeleton size="md" />
              <ButtonSkeleton size="md" />
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <TextSkeleton lines={1} className="w-32 h-6" />
              <TextSkeleton lines={1} className="w-20 h-4" />
            </div>
            <RectangleSkeleton width="100%" height={8} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center">
                  <TextSkeleton lines={1} className="w-16 h-8 mx-auto mb-1" />
                  <TextSkeleton lines={1} className="w-20 h-4 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <RectangleSkeleton width={300} height={40} />
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 4 }).map((_, index) => (
                  <RectangleSkeleton key={index} width={80} height={32} />
                ))}
              </div>
              <div className="md:ml-auto">
                <RectangleSkeleton width={120} height={32} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Module Categories Tabs */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <RectangleSkeleton key={index} width={100} height={36} />
            ))}
          </div>
        </motion.div>

        {/* Modules Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {Array.from({ length: 9 }).map((_, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              {/* Module Thumbnail */}
              <RectangleSkeleton width="100%" height={200} className="rounded-none" />
              
              <div className="p-6">
                {/* Module Title and Category */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <RectangleSkeleton width={60} height={20} />
                    <CircleSkeleton size={20} />
                  </div>
                  <TextSkeleton lines={1} className="w-full h-6 mb-2" />
                  <TextSkeleton lines={2} className="w-full h-4" />
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <TextSkeleton lines={1} className="w-16 h-4" />
                    <TextSkeleton lines={1} className="w-12 h-4" />
                  </div>
                  <RectangleSkeleton width="100%" height={6} />
                </div>

                {/* Module Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {Array.from({ length: 3 }).map((_, statIndex) => (
                    <div key={statIndex} className="text-center">
                      <TextSkeleton lines={1} className="w-8 h-5 mx-auto mb-1" />
                      <TextSkeleton lines={1} className="w-12 h-3 mx-auto" />
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <ButtonSkeleton size="md" className="flex-1" />
                  <RectangleSkeleton width={40} height={40} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        <motion.div 
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <ButtonSkeleton size="lg" />
        </motion.div>
      </div>
    </div>
  )
}

export default ModulesSkeleton