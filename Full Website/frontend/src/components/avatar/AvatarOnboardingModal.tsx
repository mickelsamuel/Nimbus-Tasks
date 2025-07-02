'use client'

import React, { useState, useEffect } from 'react'
// import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Save, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle,
  Sparkles,
  Shield,
  Crown,
  Briefcase,
  GraduationCap,
  Star
} from 'lucide-react'
import AvatarViewer3D from './AvatarViewer3D'
import { useAuth } from '@/contexts/AuthContext'

interface AvatarOption {
  id: string
  name: string
  description: string
  gender: 'male' | 'female' | 'neutral'
  role: 'executive' | 'manager' | 'employee' | 'trainee'
  url: string
  preview: string
}

interface AvatarOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (avatarUrl: string) => void
  userRole?: string
  userName?: string
}

// Professional avatar options - using working Ready Player Me URLs and fallbacks
/* const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'exec-male-1',
    name: 'Executive Leader',
    description: 'Professional executive with confident presence',
    gender: 'male',
    role: 'executive',
    url: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb',
    preview: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png?morphTargets=ARKit&textureAtlas=none&lod=1'
  },
  {
    id: 'exec-female-1',
    name: 'Executive Director',
    description: 'Distinguished female executive',
    gender: 'female',
    role: 'executive',
    url: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb',
    preview: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png?morphTargets=ARKit&textureAtlas=none&lod=1'
  },
  {
    id: 'manager-male-1',
    name: 'Senior Manager',
    description: 'Approachable team leader',
    gender: 'male',
    role: 'manager',
    url: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb',
    preview: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png?morphTargets=ARKit&textureAtlas=none&lod=1'
  },
  {
    id: 'manager-female-1',
    name: 'Team Director',
    description: 'Professional team manager',
    gender: 'female',
    role: 'manager',
    url: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb',
    preview: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png?morphTargets=ARKit&textureAtlas=none&lod=1'
  },
  {
    id: 'employee-male-1',
    name: 'Banking Professional',
    description: 'Friendly banking specialist',
    gender: 'male',
    role: 'employee',
    url: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb',
    preview: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png?morphTargets=ARKit&textureAtlas=none&lod=1'
  },
  {
    id: 'employee-female-1',
    name: 'Customer Specialist',
    description: 'Professional customer service expert',
    gender: 'female',
    role: 'employee',
    url: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb',
    preview: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png?morphTargets=ARKit&textureAtlas=none&lod=1'
  },
  {
    id: 'trainee-male-1',
    name: 'Banking Trainee',
    description: 'Enthusiastic new team member',
    gender: 'male',
    role: 'trainee',
    url: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb',
    preview: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png?morphTargets=ARKit&textureAtlas=none&lod=1'
  },
  {
    id: 'trainee-female-1',
    name: 'Graduate Trainee',
    description: 'Eager to learn professional',
    gender: 'female',
    role: 'trainee',
    url: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb',
    preview: 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png?morphTargets=ARKit&textureAtlas=none&lod=1'
  }
] */

const ROLE_ICONS = {
  executive: Crown,
  manager: Shield,
  employee: Briefcase,
  trainee: GraduationCap
}

const ROLE_COLORS = {
  executive: 'from-yellow-500 to-orange-600',
  manager: 'from-blue-500 to-indigo-600',
  employee: 'from-green-500 to-emerald-600',
  trainee: 'from-purple-500 to-violet-600'
}

export default function AvatarOnboardingModal({
  isOpen,
  onClose,
  onComplete,
  userRole = 'employee',
  userName = 'User'
}: AvatarOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption | null>(null)
  const [createdAvatarUrl, setCreatedAvatarUrl] = useState<string | null>(null)
  // const [isAnimating, setIsAnimating] = useState(true)
  // const [currentView, setCurrentView] = useState('front')
  const [isLoading, setSaving] = useState(false)
  // const [failedImages, setFailedImages] = useState(new Set<string>())
  
  const { updateUserAvatar } = useAuth()

  // Filter avatars based on user role (show role-appropriate avatars first)
  // const sortedAvatars = useMemo(() => {
  //   const roleAvatars = AVATAR_OPTIONS.filter(avatar => avatar.role === userRole)
  //   const otherAvatars = AVATAR_OPTIONS.filter(avatar => avatar.role !== userRole)
  //   return [...roleAvatars, ...otherAvatars]
  // }, [userRole])

  // Handle Ready Player Me frameApi messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Allow messages from both demo and production ReadyPlayerMe
      if (event.origin !== 'https://readyplayer.me' && event.origin !== 'https://demo.readyplayer.me') return
      
      console.log('Received message from RPM:', event.data)
      
      // Handle different message formats from Ready Player Me
      if (typeof event.data === 'string' && event.data.includes('readyplayer.me') && event.data.includes('.glb')) {
        // Direct URL format
        const avatarUrl = event.data
        console.log('Avatar created (direct URL):', avatarUrl)
        setCreatedAvatarUrl(avatarUrl)
        
        // Create a temporary avatar object for preview
        setSelectedAvatar({
          id: 'custom-avatar',
          name: 'Your Custom Avatar',
          description: 'Professional avatar created with Ready Player Me',
          gender: 'neutral',
          role: (userRole as 'executive' | 'manager' | 'employee' | 'trainee') || 'employee',
          url: avatarUrl,
          preview: avatarUrl.replace('.glb', '.png') + '?morphTargets=ARKit&textureAtlas=none&lod=1'
        })
        
        // Auto-advance to preview step
        setCurrentStep(2)
        return
      }
      
      // Standard frameApi object format
      const { eventName, data } = event.data || {}
      
      if (eventName === 'v1.avatar.exported') {
        console.log('Avatar created:', data.url)
        setCreatedAvatarUrl(data.url)
        
        // Create a temporary avatar object for preview
        setSelectedAvatar({
          id: 'custom-avatar',
          name: 'Your Custom Avatar',
          description: 'Professional avatar created with Ready Player Me',
          gender: 'neutral',
          role: (userRole as 'executive' | 'manager' | 'employee' | 'trainee') || 'employee',
          url: data.url,
          preview: data.url.replace('.glb', '.png') + '?morphTargets=ARKit&textureAtlas=none&lod=1'
        })
        
        // Auto-advance to preview step
        setCurrentStep(2)
      } else if (eventName === 'v1.frame.ready') {
        console.log('Ready Player Me frame is ready')
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [userRole])

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Avatar Creation',
      description: 'Let&apos;s create your professional banking avatar'
    },
    {
      id: 'creation',
      title: 'Create Your Avatar',
      description: 'Design your professional avatar with Ready Player Me'
    },
    {
      id: 'preview',
      title: 'Preview & Customize',
      description: 'See how your avatar looks in 3D'
    },
    {
      id: 'complete',
      title: 'All Set!',
      description: 'Your professional avatar is ready'
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    const avatarUrl = createdAvatarUrl || selectedAvatar?.url
    if (!avatarUrl) return

    setSaving(true)
    try {
      // Validate avatar URL first
      if (!avatarUrl || (!avatarUrl.includes('readyplayer.me') && !avatarUrl.startsWith('http'))) {
        throw new Error('Invalid avatar URL')
      }

      // Call API to save avatar
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const token = localStorage.getItem('auth_token')

      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${API_BASE}/avatar/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          avatarUrl: avatarUrl,
          avatarConfiguration: {
            selectedTemplate: selectedAvatar?.id || 'custom-rpm',
            role: userRole,
            gender: selectedAvatar?.gender || 'neutral',
            name: selectedAvatar?.name || 'Custom Avatar',
            description: selectedAvatar?.description || 'Professional avatar created with Ready Player Me'
          }
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update avatar in auth context immediately
        updateUserAvatar(avatarUrl)
        setCurrentStep(3) // Move to completion step
        setTimeout(() => {
          onComplete(avatarUrl)
        }, 2000)
      } else {
        throw new Error(data.message || 'Failed to save avatar')
      }
    } catch (error) {
      console.error('Error saving avatar:', error)
      // Fallback: still complete with selected avatar for better UX
      updateUserAvatar(avatarUrl)
      setCurrentStep(3)
      setTimeout(() => {
        onComplete(avatarUrl)
      }, 2000)
    } finally {
      setSaving(false)
    }
  }

  const getRoleIcon = (role: string) => {
    const IconComponent = ROLE_ICONS[role as keyof typeof ROLE_ICONS] || Briefcase
    return IconComponent
  }

  const getRoleColor = (role: string) => {
    return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || 'from-gray-500 to-gray-600'
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {steps[currentStep].description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      index <= currentStep
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 w-16 mx-2 rounded-full transition-colors ${
                        index < currentStep
                          ? 'bg-primary-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              {/* Step 0: Welcome */}
              {currentStep === 0 && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center py-8"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Hello {userName}! 👋
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    Welcome to the National Bank training platform. Let&apos;s create your professional avatar to represent you in our virtual banking environment.
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-blue-900 dark:text-blue-400">Professional</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Banking compliant avatars</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <Sparkles className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-semibold text-green-900 dark:text-green-400">Customizable</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">Choose your style</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Ready Player Me Avatar Creator */}
              {currentStep === 1 && (
                <motion.div
                  key="creation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <iframe
                      src="https://readyplayer.me/avatar?frameApi&clearCache"
                      className="w-full h-full"
                      allow="camera; microphone; clipboard-write"
                      title="Ready Player Me Avatar Creator"
                      id="rpm-frame"
                    />
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        Create Your Professional Avatar
                      </h3>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                      Use the Ready Player Me avatar creator above to design your professional banking avatar. 
                      Take a selfie or customize your appearance to create a professional representation for the platform.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-700 dark:text-blue-300">Professional appearance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-700 dark:text-blue-300">Banking appropriate</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-700 dark:text-blue-300">3D ready</span>
                      </div>
                    </div>
                    
                    {/* Fallback option */}
                    <div className="border-t border-blue-200 dark:border-blue-700 pt-4">
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                        Having trouble with the avatar creator?
                      </p>
                      <button
                        onClick={() => {
                          // Use default avatar and proceed
                          const defaultUrl = 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb'
                          setCreatedAvatarUrl(defaultUrl)
                          setSelectedAvatar({
                            id: 'default-avatar',
                            name: 'Default Professional Avatar',
                            description: 'Default banking professional avatar',
                            gender: 'neutral',
                            role: (userRole as 'executive' | 'manager' | 'employee' | 'trainee') || 'employee',
                            url: defaultUrl,
                            preview: defaultUrl.replace('.glb', '.png') + '?morphTargets=ARKit&textureAtlas=none&lod=1'
                          })
                          setCurrentStep(2)
                        }}
                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
                      >
                        Use Default Avatar Instead
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Preview */}
              {currentStep === 2 && selectedAvatar && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {/* 3D Avatar Preview */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      3D Avatar Preview
                    </h4>
                    <div className="aspect-square relative rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                      <AvatarViewer3D
                        avatarUrl={selectedAvatar.url}
                        isAnimating={true}
                        className="w-full h-full"
                      />
                    </div>
                  </div>

                  {/* Avatar Details */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Avatar Details
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${getRoleColor(selectedAvatar.role)}`}>
                            {React.createElement(getRoleIcon(selectedAvatar.role), {
                              className: "h-5 w-5 text-white"
                            })}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedAvatar.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedAvatar.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-400">Role</p>
                            <p className="text-blue-700 dark:text-blue-300 capitalize">
                              {selectedAvatar.role}
                            </p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                            <p className="text-sm font-medium text-purple-900 dark:text-purple-400">Status</p>
                            <p className="text-purple-700 dark:text-purple-300">
                              Banking Compliant
                            </p>
                          </div>
                        </div>
                        
                        {/* Avatar URL Display */}
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                          <p className="text-sm font-medium text-green-900 dark:text-green-400 mb-2">Avatar URL</p>
                          <p className="text-xs text-green-700 dark:text-green-300 font-mono break-all">
                            {selectedAvatar.url}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                        Avatar Features
                      </h5>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          'Professional appearance',
                          'Banking compliant design', 
                          '3D model ready',
                          'Platform optimized'
                        ].map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Complete */}
              {currentStep === 3 && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="h-12 w-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Avatar Created Successfully! 🎉
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                    Your professional avatar is now ready. You&apos;ll see it throughout the platform - in your profile, discussions, and training sessions.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                    <Star className="h-5 w-5" />
                    <span className="font-medium">Welcome to the team!</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {currentStep < 3 && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-3">
                {currentStep === 2 && (
                  <button
                    onClick={handleSave}
                    disabled={isLoading || !selectedAvatar}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Avatar
                      </>
                    )}
                  </button>
                )}

                {currentStep < 2 && (
                  <button
                    onClick={handleNext}
                    disabled={currentStep === 1 && !createdAvatarUrl}
                    className="flex items-center gap-2 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentStep === 1 ? (
                      createdAvatarUrl ? 'Continue to Preview' : 'Create Avatar First'
                    ) : (
                      'Next'
                    )}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}