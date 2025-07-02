'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  TextSkeleton,
  CircleSkeleton,
  RectangleSkeleton,
  ButtonSkeleton,
  AvatarSkeleton
} from '../Skeleton'

const TeamsSkeleton: React.FC = () => {
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
              <TextSkeleton lines={1} className="w-32 h-8" />
              <TextSkeleton lines={1} className="w-64 h-4" />
            </div>
            <div className="flex items-center space-x-4">
              <ButtonSkeleton size="md" />
              <ButtonSkeleton size="md" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <TextSkeleton lines={1} className="w-16 h-6" />
                    <TextSkeleton lines={1} className="w-20 h-4" />
                  </div>
                  <CircleSkeleton size={32} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filters and Tabs */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {Array.from({ length: 4 }).map((_, index) => (
                  <RectangleSkeleton key={index} width={80} height={32} />
                ))}
              </div>
              <div className="flex gap-3">
                <RectangleSkeleton width={200} height={36} />
                <RectangleSkeleton width={100} height={36} />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  {/* Team Header */}
                  <div className="relative">
                    <RectangleSkeleton width="100%" height={120} className="rounded-none" />
                    <div className="absolute top-4 right-4">
                      <CircleSkeleton size={24} />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Team Avatar and Info */}
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="relative">
                        <AvatarSkeleton size="lg" />
                        <div className="absolute -bottom-1 -right-1">
                          <CircleSkeleton size={16} />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <TextSkeleton lines={1} className="w-32 h-6" />
                        <TextSkeleton lines={1} className="w-24 h-4" />
                        <div className="flex items-center space-x-2">
                          <CircleSkeleton size={16} />
                          <TextSkeleton lines={1} className="w-16 h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Team Description */}
                    <TextSkeleton lines={2} className="w-full h-4 mb-4" />

                    {/* Team Members */}
                    <div className="mb-4">
                      <TextSkeleton lines={1} className="w-20 h-4 mb-2" />
                      <div className="flex -space-x-2">
                        {Array.from({ length: 4 }).map((_, memberIndex) => (
                          <AvatarSkeleton key={memberIndex} size="sm" className="border-2 border-white dark:border-gray-800" />
                        ))}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800">
                          <TextSkeleton lines={1} className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    {/* Team Stats */}
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
            </div>

            {/* Load More */}
            <div className="flex justify-center">
              <ButtonSkeleton size="lg" />
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* My Teams */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <TextSkeleton lines={1} className="w-24 h-6 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <AvatarSkeleton size="sm" />
                    <div className="flex-1 space-y-1">
                      <TextSkeleton lines={1} className="w-20 h-4" />
                      <TextSkeleton lines={1} className="w-16 h-3" />
                    </div>
                    <CircleSkeleton size={16} />
                  </div>
                ))}
              </div>
            </div>

            {/* Team Invitations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <TextSkeleton lines={1} className="w-28 h-6" />
                <CircleSkeleton size={20} />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AvatarSkeleton size="sm" />
                      <div className="flex-1 space-y-2">
                        <TextSkeleton lines={1} className="w-24 h-4" />
                        <TextSkeleton lines={1} className="w-20 h-3" />
                        <div className="flex space-x-2">
                          <ButtonSkeleton size="sm" />
                          <ButtonSkeleton size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <TextSkeleton lines={1} className="w-32 h-6 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CircleSkeleton size={24} />
                    <div className="flex-1 space-y-1">
                      <TextSkeleton lines={1} className="w-32 h-4" />
                      <TextSkeleton lines={1} className="w-16 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Leaderboard */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <TextSkeleton lines={1} className="w-28 h-6 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RectangleSkeleton width={20} height={20} />
                    <AvatarSkeleton size="sm" />
                    <div className="flex-1 space-y-1">
                      <TextSkeleton lines={1} className="w-24 h-4" />
                      <TextSkeleton lines={1} className="w-16 h-3" />
                    </div>
                    <TextSkeleton lines={1} className="w-8 h-4" />
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

export default TeamsSkeleton