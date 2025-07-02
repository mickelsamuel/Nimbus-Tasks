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

const SettingsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <TextSkeleton lines={1} className="w-32 h-8 mb-2" />
          <TextSkeleton lines={1} className="w-64 h-4" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <TextSkeleton lines={1} className="w-24 h-5 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg">
                    <CircleSkeleton size={20} />
                    <TextSkeleton lines={1} className="w-24 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div 
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Profile Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <TextSkeleton lines={1} className="w-32 h-6" />
                <ButtonSkeleton size="sm" />
              </div>
              
              {/* Avatar Section */}
              <div className="flex items-center space-x-6 mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <AvatarSkeleton size="xl" />
                <div className="flex-1">
                  <TextSkeleton lines={1} className="w-40 h-5 mb-2" />
                  <TextSkeleton lines={1} className="w-56 h-4 mb-4" />
                  <div className="flex space-x-3">
                    <ButtonSkeleton size="sm" />
                    <ButtonSkeleton size="sm" />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <TextSkeleton lines={1} className="w-24 h-4" />
                    <RectangleSkeleton width="100%" height={40} />
                  </div>
                ))}
              </div>
              
              {/* Bio Field */}
              <div className="mt-6 space-y-2">
                <TextSkeleton lines={1} className="w-16 h-4" />
                <RectangleSkeleton width="100%" height={80} />
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <TextSkeleton lines={1} className="w-36 h-6 mb-6" />
              <div className="space-y-6">
                {/* Email Settings */}
                <div className="space-y-4">
                  <TextSkeleton lines={1} className="w-32 h-5" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <TextSkeleton lines={1} className="w-20 h-4" />
                      <RectangleSkeleton width="100%" height={40} />
                    </div>
                    <div className="space-y-2">
                      <TextSkeleton lines={1} className="w-24 h-4" />
                      <RectangleSkeleton width="100%" height={40} />
                    </div>
                  </div>
                </div>

                {/* Password Settings */}
                <div className="space-y-4">
                  <TextSkeleton lines={1} className="w-28 h-5" />
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="space-y-2">
                        <TextSkeleton lines={1} className="w-32 h-4" />
                        <RectangleSkeleton width="100%" height={40} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <TextSkeleton lines={1} className="w-40 h-6 mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CircleSkeleton size={24} />
                      <div className="space-y-1">
                        <TextSkeleton lines={1} className="w-32 h-4" />
                        <TextSkeleton lines={1} className="w-48 h-3" />
                      </div>
                    </div>
                    <RectangleSkeleton width={44} height={24} />
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <TextSkeleton lines={1} className="w-32 h-6 mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="space-y-1">
                      <TextSkeleton lines={1} className="w-40 h-4" />
                      <TextSkeleton lines={1} className="w-56 h-3" />
                    </div>
                    <RectangleSkeleton width={44} height={24} />
                  </div>
                ))}
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <TextSkeleton lines={1} className="w-32 h-6 mb-6" />
              <div className="space-y-6">
                {/* Theme Selection */}
                <div className="space-y-4">
                  <TextSkeleton lines={1} className="w-20 h-5" />
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <RectangleSkeleton width="100%" height={60} className="mb-2" />
                        <TextSkeleton lines={1} className="w-16 h-4 mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Appearance Options */}
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <TextSkeleton lines={1} className="w-32 h-4" />
                        <TextSkeleton lines={1} className="w-48 h-3" />
                      </div>
                      <RectangleSkeleton width={100} height={32} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800 p-6">
              <TextSkeleton lines={1} className="w-28 h-6 mb-4" />
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <TextSkeleton lines={1} className="w-36 h-5 mb-2" />
                  <TextSkeleton lines={2} className="w-full h-3 mb-4" />
                  <ButtonSkeleton size="md" />
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <TextSkeleton lines={1} className="w-32 h-5 mb-2" />
                  <TextSkeleton lines={2} className="w-full h-3 mb-4" />
                  <ButtonSkeleton size="md" />
                </div>
              </div>
            </div>

            {/* Save Changes */}
            <div className="flex justify-end space-x-4 pt-6">
              <ButtonSkeleton size="md" />
              <ButtonSkeleton size="md" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SettingsSkeleton