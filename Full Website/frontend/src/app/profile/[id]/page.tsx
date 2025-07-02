'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Building, Shield, Calendar, Trophy, Star } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import Image from 'next/image'

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id
  const [loading, setLoading] = useState(true)
  interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    status: 'active' | 'inactive' | 'offline';
    role: string;
    department: string;
    email: string;
    company?: string;
    joinedAt: string;
    createdAt: string;
    lastLogin?: string;
    totalPoints: number;
    modulesCompleted: number;
    achievementsCount: number;
    completionRate?: number;
    stats?: {
      xp: number;
      level: number;
      streakDays: number;
      modulesCompleted: number;
      totalLearningTime: number;
      achievementsUnlocked: number;
    };
  }
  
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const { data } = await response.json()
          setUserData(data)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedLayout>
    )
  }

  if (!userData) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">The user you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </motion.div>

          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Image
                  src={userData.avatar || '/avatars/default.jpg'}
                  alt={`${userData.firstName} ${userData.lastName}`}
                  width={96}
                  height={96}
                  className="rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 ${
                  userData.status === 'active' ? 'bg-green-500' :
                  userData.status === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {userData.firstName} {userData.lastName}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  {userData.role} • {userData.department}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {userData.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(userData.createdAt).toLocaleDateString()}
                  </div>
                  {userData.lastLogin && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Last active {new Date(userData.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userData.status === 'active' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : userData.status === 'inactive'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  {userData.status}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userData.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                  userData.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {userData.role}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                title: 'Completion Rate', 
                value: `${userData.completionRate || 0}%`, 
                icon: Trophy,
                color: 'text-green-500'
              },
              { 
                title: 'Total XP', 
                value: userData.stats?.xp || '0', 
                icon: Star,
                color: 'text-yellow-500'
              },
              { 
                title: 'Level', 
                value: userData.stats?.level || '1', 
                icon: Shield,
                color: 'text-blue-500'
              },
              { 
                title: 'Streak Days', 
                value: userData.stats?.streakDays || '0', 
                icon: Calendar,
                color: 'text-purple-500'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gray-100 dark:bg-gray-800 rounded-xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.title}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 dark:bg-gray-900/40 rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Profile Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {userData.firstName} {userData.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {userData.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {userData.department}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Activity Summary
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Modules Completed</span>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {userData.stats?.modulesCompleted || 0}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Learning Time</span>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {userData.stats?.totalLearningTime || 0} hours
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Achievements Unlocked</span>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {userData.stats?.achievementsUnlocked || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedLayout>
  )
}