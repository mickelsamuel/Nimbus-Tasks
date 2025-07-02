'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  TextSkeleton,
  CircleSkeleton,
  RectangleSkeleton,
  ButtonSkeleton,
  AvatarSkeleton,
  StatCardSkeleton
} from '../Skeleton'

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Cover Photo */}
          <RectangleSkeleton width="100%" height={200} className="rounded-none" />
          
          <div className="relative px-6 pb-6">
            {/* Profile Avatar */}
            <div className="absolute -top-16 left-6">
              <div className="relative">
                <AvatarSkeleton size="xl" className="border-4 border-white dark:border-gray-800" />
                <div className="absolute bottom-0 right-0">
                  <CircleSkeleton size={24} className="border-2 border-white dark:border-gray-800" />
                </div>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="pt-20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <TextSkeleton lines={1} className="w-48 h-8 mb-2" />
                  <TextSkeleton lines={1} className="w-32 h-5 mb-1" />
                  <TextSkeleton lines={1} className="w-40 h-4 mb-4" />
                  <TextSkeleton lines={2} className="w-full max-w-md h-4" />
                </div>
                <div className="flex space-x-3">
                  <ButtonSkeleton size="md" />
                  <ButtonSkeleton size="md" />
                </div>
              </div>
              
              {/* Profile Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="text-center">
                    <TextSkeleton lines={1} className="w-12 h-6 mx-auto mb-1" />
                    <TextSkeleton lines={1} className="w-16 h-4 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <TextSkeleton lines={1} className="w-40 h-6" />
                <ButtonSkeleton size="sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <TextSkeleton lines={1} className="w-24 h-4" />
                    <RectangleSkeleton width="100%" height={40} />
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <TextSkeleton lines={1} className="w-36 h-6" />
                <div className="flex space-x-2">
                  <RectangleSkeleton width={60} height={32} />
                  <RectangleSkeleton width={60} height={32} />
                </div>
              </div>
              
              {/* Activity Timeline */}
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <CircleSkeleton size={32} />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <TextSkeleton lines={1} className="w-48 h-5" />
                        <TextSkeleton lines={1} className="w-20 h-4" />
                      </div>
                      <TextSkeleton lines={1} className="w-32 h-4" />
                      <div className="flex space-x-2">
                        <RectangleSkeleton width={60} height={20} />
                        <RectangleSkeleton width={80} height={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <TextSkeleton lines={1} className="w-44 h-6" />
                <RectangleSkeleton width={80} height={24} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <CircleSkeleton size={40} />
                    <div className="flex-1 space-y-1">
                      <TextSkeleton lines={1} className="w-32 h-4" />
                      <TextSkeleton lines={1} className="w-24 h-3" />
                    </div>
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
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <TextSkeleton lines={1} className="w-28 h-6 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <StatCardSkeleton key={index} />
                ))}
              </div>
            </div>

            {/* Skills & Competencies */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <TextSkeleton lines={1} className="w-40 h-6 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <TextSkeleton lines={1} className="w-24 h-4" />
                      <TextSkeleton lines={1} className="w-8 h-4" />
                    </div>
                    <RectangleSkeleton width="100%" height={6} />
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates & Badges */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <TextSkeleton lines={1} className="w-32 h-6" />
                <RectangleSkeleton width={60} height={24} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <CircleSkeleton size={40} className="mb-2" />
                    <TextSkeleton lines={1} className="w-16 h-3" />
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <TextSkeleton lines={1} className="w-36 h-6 mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CircleSkeleton size={24} />
                    <TextSkeleton lines={1} className="w-32 h-4" />
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

export default ProfileSkeleton