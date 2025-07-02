'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Skeleton, 
  CardSkeleton, 
  StatCardSkeleton, 
  ChartSkeleton,
  TextSkeleton,
  CircleSkeleton,
  RectangleSkeleton
} from '../Skeleton'

const DashboardSkeleton: React.FC = () => {
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
              <TextSkeleton lines={1} className="w-64 h-8" />
              <TextSkeleton lines={1} className="w-48 h-4" />
            </div>
            <div className="flex items-center space-x-4">
              <RectangleSkeleton width={100} height={36} />
              <CircleSkeleton size={40} />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Learning Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <TextSkeleton lines={1} className="w-48 h-6" />
                <RectangleSkeleton width={80} height={24} />
              </div>
              <div className="space-y-4">
                <RectangleSkeleton width="100%" height={8} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <TextSkeleton lines={1} className="w-20 h-4" />
                    <TextSkeleton lines={1} className="w-16 h-6" />
                  </div>
                  <div className="space-y-2">
                    <TextSkeleton lines={1} className="w-24 h-4" />
                    <TextSkeleton lines={1} className="w-20 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Chart */}
            <ChartSkeleton height={300} />

            {/* Recent Modules */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <TextSkeleton lines={1} className="w-40 h-6" />
                <RectangleSkeleton width={60} height={24} />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <RectangleSkeleton width={60} height={60} />
                    <div className="flex-1 space-y-2">
                      <TextSkeleton lines={1} className="w-48 h-5" />
                      <TextSkeleton lines={1} className="w-32 h-4" />
                      <div className="flex space-x-2">
                        <RectangleSkeleton width={60} height={20} />
                        <RectangleSkeleton width={80} height={20} />
                      </div>
                    </div>
                    <RectangleSkeleton width={80} height={32} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <TextSkeleton lines={1} className="w-32 h-6 mb-4" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <CircleSkeleton size={40} className="mb-2" />
                    <TextSkeleton lines={1} className="w-16 h-4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <TextSkeleton lines={1} className="w-28 h-6" />
                <RectangleSkeleton width={50} height={24} />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CircleSkeleton size={32} />
                    <div className="flex-1 space-y-1">
                      <TextSkeleton lines={1} className="w-32 h-4" />
                      <TextSkeleton lines={1} className="w-24 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <TextSkeleton lines={1} className="w-36 h-6 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CircleSkeleton size={28} />
                    <div className="flex-1 space-y-1">
                      <TextSkeleton lines={1} className="w-40 h-4" />
                      <TextSkeleton lines={1} className="w-20 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <TextSkeleton lines={1} className="w-32 h-6" />
                <RectangleSkeleton width={60} height={24} />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RectangleSkeleton width={24} height={24} />
                    <CircleSkeleton size={28} />
                    <div className="flex-1 space-y-1">
                      <TextSkeleton lines={1} className="w-28 h-4" />
                      <TextSkeleton lines={1} className="w-20 h-3" />
                    </div>
                    <TextSkeleton lines={1} className="w-12 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSkeleton