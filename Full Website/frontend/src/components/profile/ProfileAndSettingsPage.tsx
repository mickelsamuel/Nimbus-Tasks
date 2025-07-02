'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api/client'
import { 
  User, 
  Settings, 
  Shield, 
  Activity, 
  Bell,
  Edit3,
  Sparkles,
  Palette,
  BarChart3,
  MessageSquare,
  Star,
  Heart,
  Mail,
  Globe,
  MapPin,
  Calendar,
  ChevronRight,
  Check,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Award,
  Trophy,
  Crown,
  Diamond,
  Code2,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Eye as EyeIcon,
  Key,
  Fingerprint,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Timer,
  Users,
  UserPlus
} from 'lucide-react'
import { default as ProtectedLayout } from '../layout/ProtectedLayout'

type Section = 'profile' | 'account' | 'appearance' | 'privacy' | 'notifications' | 'activity' | 'data'

interface ProfileData {
  name: string
  email: string
  username: string
  bio: string
  avatar: string
  location: string
  website: string
  joinDate: string
  level: number
  xp: number
  badges: Array<{ id: string; name: string; icon: React.ComponentType<{ className?: string }>; color: string; earned: boolean }>
  stats: {
    followers: number
    following: number
    posts: number
    likes: number
  }
  socialLinks: {
    twitter?: string
    github?: string
    linkedin?: string
    instagram?: string
  }
}


export default function ProfileAndSettingsPage() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState<Section>('profile')
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: true,
    updates: true,
    newsletter: false,
    marketing: false
  })
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    showStats: true,
    allowMessages: true,
    dataCollection: true
  })

  // Motion hooks must be declared before any conditional returns
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const mouseXTransform = useTransform(mouseX, (value) => value - 192)
  const mouseYTransform = useTransform(mouseY, (value) => value - 192)

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        
        // Fetch profile data, stats, and badges from API
        const [profileRes, statsRes, badgesRes] = await Promise.all([
          api.get('/profile'),
          api.get('/profile/stats'),
          api.get('/profile/badges')
        ])
        
        if (profileRes.data) {
          const profile = profileRes.data
          const stats = statsRes.data?.stats || { followers: 0, following: 0, posts: 0, likes: 0 }
          const badges = badgesRes.data?.badges || []
          
          setProfileData({
            name: profile.name || user.name || '',
            email: profile.email || user.email || '',
            username: profile.username || `@${user.name?.toLowerCase().replace(' ', '')}` || '',
            bio: profile.bio || '',
            avatar: profile.avatar || user.avatar || '',
            location: profile.location || '',
            website: profile.website || '',
            joinDate: profile.joinDate || new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            level: profile.level || user.level || 1,
            xp: profile.xp || user.xp || 0,
            badges: badges.map((badge: any) => ({
              id: badge.id,
              name: badge.name,
              icon: badge.icon === 'Star' ? Star : 
                    badge.icon === 'Code2' ? Code2 :
                    badge.icon === 'Trophy' ? Trophy :
                    badge.icon === 'Crown' ? Crown :
                    badge.icon === 'Diamond' ? Diamond : Star,
              color: badge.color || 'text-gray-500',
              earned: badge.earned || false
            })),
            stats,
            socialLinks: profile.socialLinks || {}
          })
        }
      } catch (error) {
        // Fallback to user data if API fails
        if (user) {
          setProfileData({
            name: user.name || '',
            email: user.email || '',
            username: `@${user.name?.toLowerCase().replace(' ', '')}` || '',
            bio: '',
            avatar: user.avatar || '',
            location: '',
            website: '',
            joinDate: new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            level: user.level || 1,
            xp: user.xp || 0,
            badges: [],
            stats: { followers: 0, following: 0, posts: 0, likes: 0 },
            socialLinks: {}
          })
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfileData()
  }, [user])

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set(event.clientX - rect.left)
    mouseY.set(event.clientY - rect.top)
  }

  const sectionItems = [
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      bgGradient: 'from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20',
      description: 'Personal information & customization',
      glow: 'shadow-blue-500/20'
    },
    { 
      id: 'account', 
      label: 'Account', 
      icon: Settings, 
      gradient: 'from-emerald-500 via-green-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20',
      description: 'Account settings & preferences',
      glow: 'shadow-emerald-500/20'
    },
    { 
      id: 'appearance', 
      label: 'Appearance', 
      icon: Palette, 
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      bgGradient: 'from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20',
      description: 'Theme & visual customization',
      glow: 'shadow-pink-500/20'
    },
    { 
      id: 'privacy', 
      label: 'Privacy & Security', 
      icon: Shield, 
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      bgGradient: 'from-amber-50 to-red-50 dark:from-amber-950/20 dark:to-red-950/20',
      description: 'Security & privacy controls',
      glow: 'shadow-amber-500/20'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      gradient: 'from-violet-500 via-purple-500 to-indigo-500',
      bgGradient: 'from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20',
      description: 'Notification preferences',
      glow: 'shadow-violet-500/20'
    },
    { 
      id: 'activity', 
      label: 'Activity & Stats', 
      icon: Activity, 
      gradient: 'from-cyan-500 via-sky-500 to-blue-500',
      bgGradient: 'from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20',
      description: 'Activity history & analytics',
      glow: 'shadow-cyan-500/20'
    },
    { 
      id: 'data', 
      label: 'Data & Storage', 
      icon: Download, 
      gradient: 'from-slate-600 via-gray-600 to-zinc-600',
      bgGradient: 'from-slate-50 to-zinc-50 dark:from-slate-950/20 dark:to-zinc-950/20',
      description: 'Data management & export',
      glow: 'shadow-slate-500/20'
    }
  ]

  const currentSection = sectionItems.find(item => item.id === activeSection)

  // Show loading state while fetching profile data
  if (loading || !profileData) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse rounded-full h-12 w-12 border-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div 
        className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-20 dark:opacity-10"
            style={{
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" stroke=\"%236366f1\" stroke-width=\"0.5\" opacity=\"0.1\"%3E%3Cpath d=\"M0 0h100v100H0z\"/%3E%3Cpath d=\"M0 50h100M50 0v100\"/%3E%3C/g%3E%3C/svg%3E')"
            }}
          />
          
          {/* Gradient Orbs */}
          <motion.div
            className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 via-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
          />

          {/* Mouse follower gradient */}
          <motion.div
            className="absolute w-96 h-96 bg-gradient-radial from-indigo-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl pointer-events-none"
            style={{
              x: mouseXTransform,
              y: mouseYTransform,
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Header with floating animation */}
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          >
            <motion.div 
              className="inline-flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-lg opacity-50 animate-pulse" />
                <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                  Profile & Settings
                </span>
              </h1>
            </motion.div>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Customize your experience, manage your account, and control your privacy
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <motion.div 
                className="sticky top-8 space-y-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                {sectionItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as Section)}
                      className={`
                        w-full group relative overflow-hidden rounded-2xl
                        ${isActive ? 'shadow-2xl ' + item.glow : ''}
                      `}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Background gradient */}
                      <motion.div 
                        className={`
                          absolute inset-0 opacity-0 bg-gradient-to-r ${item.gradient}
                          ${isActive ? 'opacity-100' : 'group-hover:opacity-10'}
                        `}
                        initial={false}
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Glass effect background */}
                      <div className={`
                        absolute inset-0 backdrop-blur-xl
                        ${isActive 
                          ? 'bg-white/10 dark:bg-black/10' 
                          : 'bg-white/50 dark:bg-gray-800/50 group-hover:bg-white/60 dark:group-hover:bg-gray-800/60'
                        }
                      `} />

                      {/* Content */}
                      <div className="relative flex items-center gap-4 p-5">
                        <motion.div
                          className={`
                            p-3 rounded-xl transition-all duration-300
                            ${isActive 
                              ? 'bg-white/20 text-white shadow-lg' 
                              : 'bg-gray-100/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-600/50'
                            }
                          `}
                          animate={isActive ? {
                            rotate: [0, 5, -5, 0],
                          } : {}}
                          transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 3 }}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>
                        
                        <div className="flex-1 text-left">
                          <div className={`
                            font-semibold text-sm transition-colors
                            ${isActive 
                              ? 'text-white' 
                              : 'text-gray-900 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white'
                            }
                          `}>
                            {item.label}
                          </div>
                          <div className={`
                            text-xs mt-0.5 transition-colors
                            ${isActive 
                              ? 'text-white/80' 
                              : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                            }
                          `}>
                            {item.description}
                          </div>
                        </div>

                        <ChevronRight className={`
                          w-4 h-4 transition-all
                          ${isActive 
                            ? 'text-white translate-x-0 opacity-100' 
                            : 'text-gray-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                          }
                        `} />

                        {/* Active indicator dot */}
                        {isActive && (
                          <motion.div
                            className="absolute right-2 top-2 w-2 h-2 bg-white rounded-full"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </motion.div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  className="relative"
                >
                  {/* Section Header */}
                  <motion.div 
                    className="mb-8 p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden"
                    layoutId={`section-header-${activeSection}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-5" 
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${currentSection?.gradient})`
                      }}
                    />
                    <div className="relative flex items-center gap-4">
                      <motion.div
                        className={`p-4 rounded-2xl bg-gradient-to-r ${currentSection?.gradient} shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {currentSection && <currentSection.icon className="w-8 h-8 text-white" />}
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                          {currentSection?.label}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {currentSection?.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Section Content */}
                  {activeSection === 'profile' && (
                    <div className="space-y-8">
                      {/* Profile Card */}
                      <motion.div 
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex flex-col lg:flex-row gap-8">
                          {/* Avatar Section */}
                          <div className="flex flex-col items-center lg:items-start gap-4">
                            <div className="relative group">
                              <div
                                className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300"
                              />
                              <Image
                                src={profileData.avatar}
                                alt="Profile"
                                className="relative w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800"
                                width={128}
                                height={128}
                              />
                            </div>
                            
                            {/* Level & XP */}
                            <div className="text-center lg:text-left">
                              <div className="flex items-center gap-2 mb-2">
                                <Trophy className="w-5 h-5 text-amber-500" />
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                  Level {profileData.level}
                                </span>
                              </div>
                              <div className="w-48">
                                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                                  <span>{profileData.xp} XP</span>
                                  <span>{(profileData.level + 1) * 500} XP</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(profileData.xp % 500) / 500 * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Profile Info */}
                          <div className="flex-1 space-y-6">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {profileData.name}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400">{profileData.username}</p>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {profileData.bio}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">{profileData.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{profileData.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Globe className="w-4 h-4" />
                                <span className="text-sm">{profileData.website}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Joined {profileData.joinDate}</span>
                              </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-3">
                              {profileData.socialLinks.twitter && (
                                <motion.a
                                  href={`https://twitter.com/${profileData.socialLinks.twitter}`}
                                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Twitter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </motion.a>
                              )}
                              {profileData.socialLinks.github && (
                                <motion.a
                                  href={`https://github.com/${profileData.socialLinks.github}`}
                                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </motion.a>
                              )}
                              {profileData.socialLinks.linkedin && (
                                <motion.a
                                  href={`https://linkedin.com/in/${profileData.socialLinks.linkedin}`}
                                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Linkedin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </motion.a>
                              )}
                              {profileData.socialLinks.instagram && (
                                <motion.a
                                  href={`https://instagram.com/${profileData.socialLinks.instagram}`}
                                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Instagram className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </motion.a>
                              )}
                            </div>

                            <motion.button
                              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setIsEditing(!isEditing)}
                            >
                              <Edit3 className="w-4 h-4 inline mr-2" />
                              Edit Profile
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { label: 'Followers', value: profileData.stats.followers, icon: Users, color: 'from-blue-500 to-indigo-500' },
                          { label: 'Following', value: profileData.stats.following, icon: UserPlus, color: 'from-emerald-500 to-green-500' },
                          { label: 'Posts', value: profileData.stats.posts, icon: MessageSquare, color: 'from-purple-500 to-pink-500' },
                          { label: 'Likes', value: profileData.stats.likes, icon: Heart, color: 'from-red-500 to-rose-500' },
                        ].map((stat, index) => (
                          <motion.div
                            key={stat.label}
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30 hover:shadow-xl transition-shadow"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            whileHover={{ y: -4 }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                                <stat.icon className="w-5 h-5" />
                              </div>
                              <motion.div
                                className="text-2xl font-bold text-gray-900 dark:text-white"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1, type: "spring", bounce: 0.3 }}
                              >
                                {stat.value.toLocaleString()}
                              </motion.div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {stat.label}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Badges */}
                      <motion.div 
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                          <Award className="w-6 h-6 text-amber-500" />
                          Achievements & Badges
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                          {profileData.badges.map((badge, index) => (
                            <motion.div
                              key={badge.id}
                              className={`
                                relative p-4 rounded-xl text-center transition-all cursor-pointer
                                ${badge.earned 
                                  ? 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 shadow-md hover:shadow-lg' 
                                  : 'bg-gray-100/50 dark:bg-gray-800/50 opacity-50 grayscale'
                                }
                              `}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 + index * 0.05 }}
                              whileHover={badge.earned ? { scale: 1.05 } : {}}
                            >
                              {badge.earned && (
                                <motion.div
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.6 + index * 0.05, type: "spring", bounce: 0.5 }}
                                >
                                  <Check className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                              <badge.icon className={`w-8 h-8 mx-auto mb-2 ${badge.earned ? badge.color : 'text-gray-400'}`} />
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {badge.name}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {activeSection === 'account' && (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {/* Account Settings */}
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                          Account Information
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Email Address
                            </label>
                            <div className="flex gap-3">
                              <input
                                type="email"
                                value={profileData.email}
                                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                readOnly
                              />
                              <motion.button
                                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                Change
                              </motion.button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Username
                            </label>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={profileData.username}
                                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                readOnly
                              />
                              <motion.button
                                className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                Change
                              </motion.button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Phone Number
                            </label>
                            <div className="flex gap-3">
                              <input
                                type="tel"
                                placeholder="Add phone number"
                                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                              />
                              <motion.button
                                className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                Add
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="bg-red-50 dark:bg-red-950/20 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-red-200/50 dark:border-red-800/30">
                        <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-6 flex items-center gap-2">
                          <ShieldAlert className="w-6 h-6" />
                          Danger Zone
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/30 rounded-xl">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Deactivate Account
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Temporarily disable your account
                              </p>
                            </div>
                            <motion.button
                              className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Deactivate
                            </motion.button>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-900/30 rounded-xl">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Delete Account
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Permanently delete your account and data
                              </p>
                            </div>
                            <motion.button
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Delete
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'appearance' && (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {/* Theme Selection */}
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                          Theme Preferences
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { id: 'light', label: 'Light', icon: Sun, gradient: 'from-yellow-200 to-orange-200' },
                            { id: 'dark', label: 'Dark', icon: Moon, gradient: 'from-gray-700 to-gray-900' },
                            { id: 'system', label: 'System', icon: Monitor, gradient: 'from-blue-200 to-purple-200' }
                          ].map((option) => (
                            <motion.button
                              key={option.id}
                              onClick={() => setTheme(option.id as 'light' | 'dark' | 'system')}
                              className={`
                                relative p-6 rounded-2xl border-2 transition-all
                                ${theme === option.id 
                                  ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }
                              `}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {theme === option.id && (
                                <motion.div
                                  className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", bounce: 0.5 }}
                                >
                                  <Check className="w-4 h-4 text-white" />
                                </motion.div>
                              )}
                              <div className={`p-4 bg-gradient-to-br ${option.gradient} rounded-xl mb-4`}>
                                <option.icon className="w-8 h-8 text-gray-700" />
                              </div>
                              <div className="text-lg font-medium text-gray-900 dark:text-white">
                                {option.label}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Color Scheme */}
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                          Accent Color
                        </h3>
                        <div className="grid grid-cols-6 gap-3">
                          {[
                            'bg-red-500',
                            'bg-orange-500',
                            'bg-yellow-500',
                            'bg-green-500',
                            'bg-blue-500',
                            'bg-indigo-500',
                            'bg-purple-500',
                            'bg-pink-500',
                            'bg-gray-500',
                            'bg-cyan-500',
                            'bg-emerald-500',
                            'bg-rose-500',
                          ].map((color, index) => (
                            <motion.button
                              key={color}
                              className={`
                                w-full aspect-square rounded-xl ${color} relative overflow-hidden
                                hover:scale-110 transition-transform
                              `}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: 0.05 * index, type: "spring", bounce: 0.3 }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-white/30"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "100%" }}
                                transition={{ duration: 0.3 }}
                              />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'privacy' && (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {/* Privacy Settings */}
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                          Privacy Controls
                        </h3>
                        <div className="space-y-4">
                          {[
                            { 
                              id: 'profileVisibility',
                              label: 'Profile Visibility',
                              description: 'Control who can see your profile',
                              icon: EyeIcon,
                              value: privacy.profileVisibility,
                              options: ['public', 'friends', 'private']
                            },
                            {
                              id: 'showEmail',
                              label: 'Show Email Address',
                              description: 'Display email on your profile',
                              icon: Mail,
                              value: privacy.showEmail,
                              type: 'toggle'
                            },
                            {
                              id: 'showLocation',
                              label: 'Show Location',
                              description: 'Display location on your profile',
                              icon: MapPin,
                              value: privacy.showLocation,
                              type: 'toggle'
                            },
                            {
                              id: 'showStats',
                              label: 'Show Statistics',
                              description: 'Display your activity statistics',
                              icon: BarChart3,
                              value: privacy.showStats,
                              type: 'toggle'
                            },
                            {
                              id: 'allowMessages',
                              label: 'Allow Messages',
                              description: 'Let others send you messages',
                              icon: MessageSquare,
                              value: privacy.allowMessages,
                              type: 'toggle'
                            }
                          ].map((setting, index) => (
                            <motion.div
                              key={setting.id}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * index }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                  <setting.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {setting.label}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                    {setting.description}
                                  </p>
                                </div>
                              </div>
                              {setting.type === 'toggle' ? (
                                <motion.button
                                  onClick={() => setPrivacy({ ...privacy, [setting.id]: !setting.value })}
                                  className={`
                                    relative w-12 h-6 rounded-full transition-colors
                                    ${setting.value ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
                                  `}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <motion.div
                                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                                    animate={{ x: setting.value ? 20 : 0 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                  />
                                </motion.button>
                              ) : (
                                <select
                                  value={String(setting.value)}
                                  onChange={(e) => setPrivacy({ ...privacy, [setting.id]: e.target.value })}
                                  className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                                >
                                  {setting.options?.map(option => (
                                    <option key={option} value={option}>
                                      {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Security */}
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                          Security Settings
                        </h3>
                        <div className="space-y-4">
                          <motion.button
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors"
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  Change Password
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Last changed 3 months ago
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </motion.button>

                          <motion.button
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors"
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  Two-Factor Authentication
                                </h4>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                  Enabled
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </motion.button>

                          <motion.button
                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors"
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Fingerprint className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  Biometric Login
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Configure fingerprint or face ID
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'notifications' && (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                          Notification Preferences
                        </h3>
                        <div className="space-y-6">
                          {[
                            {
                              category: 'Communication',
                              icon: MessageSquare,
                              color: 'blue',
                              settings: [
                                { id: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                                { id: 'push', label: 'Push Notifications', description: 'Receive push notifications on your devices' },
                                { id: 'desktop', label: 'Desktop Notifications', description: 'Show notifications on desktop' }
                              ]
                            },
                            {
                              category: 'Updates',
                              icon: RefreshCw,
                              color: 'green',
                              settings: [
                                { id: 'updates', label: 'Product Updates', description: 'Get notified about new features' },
                                { id: 'newsletter', label: 'Newsletter', description: 'Receive our weekly newsletter' },
                                { id: 'marketing', label: 'Marketing Emails', description: 'Receive promotional content' }
                              ]
                            }
                          ].map((category, categoryIndex) => (
                            <div key={category.category}>
                              <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2 bg-${category.color}-100 dark:bg-${category.color}-900/30 rounded-lg`}>
                                  <category.icon className={`w-5 h-5 text-${category.color}-600 dark:text-${category.color}-400`} />
                                </div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {category.category}
                                </h4>
                              </div>
                              <div className="space-y-3 pl-12">
                                {category.settings.map((setting, index) => (
                                  <motion.div
                                    key={setting.id}
                                    className="flex items-center justify-between"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * (categoryIndex * 3 + index) }}
                                  >
                                    <div>
                                      <h5 className="font-medium text-gray-900 dark:text-white">
                                        {setting.label}
                                      </h5>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {setting.description}
                                      </p>
                                    </div>
                                    <motion.button
                                      onClick={() => setNotifications({ ...notifications, [setting.id]: !notifications[setting.id as keyof typeof notifications] })}
                                      className={`
                                        relative w-12 h-6 rounded-full transition-colors
                                        ${notifications[setting.id as keyof typeof notifications] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
                                      `}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <motion.div
                                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                                        animate={{ x: notifications[setting.id as keyof typeof notifications] ? 20 : 0 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                      />
                                    </motion.button>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notification Schedule */}
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                          Quiet Hours
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  Do Not Disturb
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Silence notifications during set hours
                                </p>
                              </div>
                            </div>
                            <motion.button
                              className="relative w-12 h-6 rounded-full bg-purple-500"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <motion.div
                                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
                                animate={{ x: 20 }}
                              />
                            </motion.button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pl-16">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Start Time
                              </label>
                              <input
                                type="time"
                                value="22:00"
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                End Time
                              </label>
                              <input
                                type="time"
                                value="08:00"
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'activity' && (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {/* Activity Overview */}
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                          Activity Overview
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {[
                            { label: 'Total Sessions', value: '847', icon: Clock, trend: '+12%', color: 'blue' },
                            { label: 'Active Days', value: '156', icon: Calendar, trend: '+8%', color: 'green' },
                            { label: 'Avg. Duration', value: '2h 34m', icon: Timer, trend: '+15%', color: 'purple' }
                          ].map((stat, index) => (
                            <motion.div
                              key={stat.label}
                              className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index }}
                              whileHover={{ y: -2 }}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl`}>
                                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                </div>
                                <span className={`text-sm font-medium text-green-600 dark:text-green-400`}>
                                  {stat.trend}
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {stat.value}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.label}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                          Recent Activity
                        </h3>
                        <div className="space-y-4">
                          {[
                            { action: 'Profile updated', time: '2 hours ago', icon: Edit3, color: 'blue' },
                            { action: 'Password changed', time: '3 days ago', icon: Key, color: 'green' },
                            { action: 'New device login', time: '1 week ago', icon: Smartphone, color: 'purple' },
                            { action: 'Settings modified', time: '2 weeks ago', icon: Settings, color: 'orange' }
                          ].map((activity, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 * index }}
                            >
                              <div className={`p-2 bg-${activity.color}-100 dark:bg-${activity.color}-900/30 rounded-lg`}>
                                <activity.icon className={`w-5 h-5 text-${activity.color}-600 dark:text-${activity.color}-400`} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {activity.action}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {activity.time}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSection === 'data' && (
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {/* Data Management */}
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                          Data Management
                        </h3>
                        <div className="space-y-4">
                          <motion.button
                            className="w-full flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors group"
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                                  Export Your Data
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Download all your data in JSON format
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                          </motion.button>

                          <motion.button
                            className="w-full flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors group"
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <Upload className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                                  Import Data
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Import data from another account
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                          </motion.button>

                          <motion.button
                            className="w-full flex items-center justify-between p-6 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-medium text-red-900 dark:text-red-100 text-lg">
                                  Delete All Data
                                </h4>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                  Permanently remove all your data
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Storage Usage */}
                      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                          Storage Usage
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600 dark:text-gray-400">Used Storage</span>
                              <span className="font-medium text-gray-900 dark:text-white">2.4 GB / 5 GB</span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: '48%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-6">
                            {[
                              { type: 'Images', size: '1.2 GB', color: 'blue', percentage: 50 },
                              { type: 'Documents', size: '800 MB', color: 'green', percentage: 33 },
                              { type: 'Videos', size: '300 MB', color: 'purple', percentage: 13 },
                              { type: 'Other', size: '100 MB', color: 'gray', percentage: 4 }
                            ].map((item, index) => (
                              <motion.div
                                key={item.type}
                                className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index }}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-3 h-3 bg-${item.color}-500 rounded-full`} />
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.type}
                                  </span>
                                </div>
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {item.size}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                  {item.percentage}% of total
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}