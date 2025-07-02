'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  Award,
  TrendingUp,
  Target,
  Star,
  Clock
} from 'lucide-react'
import UserAvatar from '@/components/ui/UserAvatar'
import { UserProfile, formatLocation } from '../types'

interface ProfileHeaderProps {
  user: UserProfile
}

export default function ProfileHeader({ 
  user
}: ProfileHeaderProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%236366f1%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-xl"
          animate={{
            x: [0, -25, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <motion.div
              className="relative w-32 h-32 sm:w-40 sm:h-40"
              initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            >
              {/* Static border */}
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1"
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                    <UserAvatar
                      user={{
                        avatar: user.avatar,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        level: user.stats?.level || 1,
                        isOnline: user.isOnline
                      }}
                      size="full"
                      showStatus={false}
                      showLevel={false}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
              
            </motion.div>

            {/* Online Status with pulse */}
            <motion.div 
              className="absolute -bottom-2 -left-2 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full w-6 h-6 shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
            </motion.div>

            {/* Level badge */}
            <motion.div
              className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white dark:border-gray-800"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
            >
              LVL {user.stats?.level || 1}
            </motion.div>
          </div>

          {/* Profile Information */}
          <div className="flex-1 min-w-0 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {/* Name and Role */}
              <div className="space-y-2">
                <motion.h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {user.firstName} {user.lastName}
                </motion.h1>
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                    <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {user.role}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.department}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Contact Information */}
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div 
                  className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                    <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">{user.email}</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                    <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{user.phone}</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                    <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{formatLocation(user.location)}</span>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg">
                    <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Joined {new Date(user.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, staggerChildren: 0.1 }}
            >
              {/* Level Card */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 text-center shadow-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {user.stats?.level || 1}
                  </div>
                  <div className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium uppercase tracking-wide">
                    Level
                  </div>
                </div>
              </motion.div>

              {/* XP Card */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotateY: -5 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-2xl border border-green-200/50 dark:border-green-700/50 text-center shadow-xl">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {(user.stats?.totalXP || user.stats?.xp || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600/80 dark:text-green-400/80 font-medium uppercase tracking-wide">
                    XP
                  </div>
                </div>
              </motion.div>

              {/* Modules Card */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-2xl border border-purple-200/50 dark:border-purple-700/50 text-center shadow-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {user.stats?.modulesCompleted || 0}
                  </div>
                  <div className="text-xs text-purple-600/80 dark:text-purple-400/80 font-medium uppercase tracking-wide">
                    Modules
                  </div>
                </div>
              </motion.div>

              {/* Streak Card */}
              <motion.div
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotateY: -5 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-2xl border border-orange-200/50 dark:border-orange-700/50 text-center shadow-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                    {user.stats?.currentStreak || 0}
                  </div>
                  <div className="text-xs text-orange-600/80 dark:text-orange-400/80 font-medium uppercase tracking-wide">
                    Day Streak
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Learning Hours */}
            <motion.div
              className="mt-4 relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-4 rounded-2xl border border-indigo-200/50 dark:border-indigo-700/50 text-center shadow-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    Learning Hours
                  </span>
                </div>
                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {user.stats?.learningHours || 0}h
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}