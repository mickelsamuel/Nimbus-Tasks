'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Sparkles, 
  Shield, 
  Users, 
  Globe,
  Star,
  Crown
} from 'lucide-react'
import Link from 'next/link'

// Import the advanced auth components
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'

// Additional imports for inline components
import { useState as useReactState } from 'react'
import { Mail, Send, Loader2, CheckCircle } from 'lucide-react'

type AuthView = 'login' | 'register' | 'forgot-password'

// Compact Register Form Wrapper
function CompactRegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  return (
    <div className="space-y-2 max-h-[75vh] overflow-y-auto">
      <RegisterForm onSwitchToLogin={onSwitchToLogin} />
    </div>
  )
}

// Simple Forgot Password Component
function SimpleForgotPasswordForm() {
  const [email, setEmail] = useReactState('')
  const [isSubmitting, setIsSubmitting] = useReactState(false)
  const [isSuccess, setIsSuccess] = useReactState(false)
  const [error, setError] = useReactState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${baseURL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.message || 'Failed to send reset email. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div 
        className="text-center space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check Your Email</h3>
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;ve sent a password reset link to <strong>{email}</strong>
          </p>
        </div>
        <button
          onClick={() => {
            setIsSuccess(false)
            setEmail('')
          }}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Try a different email
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="reset-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter your email address"
            required
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !email}
        className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
          isSubmitting || !email
            ? 'bg-gray-400 dark:bg-gray-600 text-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending Reset Link...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Send Reset Link
          </>
        )}
      </button>
    </form>
  )
}

export default function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login')

  const pageVariants = {
    initial: { opacity: 0, x: 300 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -300 }
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <div className="h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-red-400/20 to-orange-400/20 opacity-50"
          animate={{
            scale: [1, 0.9, 1],
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Enhanced pattern overlay */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,26,26,0.1)_1px,transparent_1px)] bg-[length:60px_60px]" />
        </div>

        {/* Floating particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + i * 8}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div 
        className="relative z-20 pt-4 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
                <span className="relative text-lg font-black text-white z-10">BNC</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">National Bank of Canada</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Professional Development Platform
                </p>
              </div>
            </motion.div>

            {/* Back to Homepage */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">
        <motion.div 
          className="w-full max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            {/* Left Side - Branding & Features */}
            <motion.div 
              className="space-y-6 text-center lg:text-left"
              variants={itemVariants}
            >
              {/* Enhanced Badge */}
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">Secure Banking Platform</span>
              </motion.div>

              {/* Enhanced Headline */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-relaxed">
                  <span className="text-gray-900 dark:text-white block pb-1">Access Your</span>
                  <span className="block bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mt-1 pb-2">
                    Learning Journey
                  </span>
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mt-2">
                  Join thousands of National Bank of Canada professionals advancing their careers through our comprehensive training platform.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Shield, text: 'Enterprise Security', color: 'text-green-500' },
                  { icon: Users, text: '12,500+ Professionals', color: 'text-blue-500' },
                  { icon: Star, text: '4.7★ User Rating', color: 'text-yellow-500' },
                  { icon: Globe, text: '25+ Countries', color: 'text-purple-500' }
                ].map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-2 p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700">
                      <feature.icon className={`h-4 w-4 ${feature.color}`} />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-xs">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

            </motion.div>

            {/* Right Side - Authentication Forms */}
            <motion.div 
              className="relative w-full max-w-md mx-auto lg:max-w-lg"
              variants={itemVariants}
            >
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
                

                {/* Form Navigation Tabs */}
                <div className="relative z-10 mb-6">
                  <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
                    <button
                      onClick={() => setCurrentView('login')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        currentView === 'login'
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setCurrentView('register')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        currentView === 'register'
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Create Account
                    </button>
                    <button
                      onClick={() => setCurrentView('forgot-password')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        currentView === 'forgot-password'
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Reset Password
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="relative z-10">
                  <AnimatePresence mode="wait">
                    {currentView === 'login' && (
                      <motion.div
                        key="login"
                        variants={pageVariants}
                        initial="initial"
                        animate="in"
                        exit="out"
                        transition={pageTransition}
                        className="space-y-3"
                      >
                        <div className="text-center mb-3">
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Welcome Back
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">
                            Sign in to your BNC Training Platform
                          </p>
                        </div>

                        <LoginForm 
                          onSwitchToRegister={() => setCurrentView('register')}
                          onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
                          isAdminMode={false}
                        />
                      </motion.div>
                    )}

                    {currentView === 'register' && (
                      <motion.div
                        key="register"
                        variants={pageVariants}
                        initial="initial"
                        animate="in"
                        exit="out"
                        transition={pageTransition}
                        className="space-y-3"
                      >
                        <div className="text-center mb-2">
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Create Account
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">
                            Join the BNC professional community
                          </p>
                        </div>

                        <CompactRegisterForm onSwitchToLogin={() => setCurrentView('login')} />
                      </motion.div>
                    )}

                    {currentView === 'forgot-password' && (
                      <motion.div
                        key="forgot-password"
                        variants={pageVariants}
                        initial="initial"
                        animate="in"
                        exit="out"
                        transition={pageTransition}
                        className="space-y-3"
                      >
                        <div className="text-center mb-3">
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Reset Password
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">
                            We&apos;ll send you a reset link
                          </p>
                        </div>

                        <SimpleForgotPasswordForm />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        className="relative z-20 pb-4 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-x-3 text-xs">
            <Link href="/help" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
              Help Center
            </Link>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <Link href="/policy" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span className="text-gray-500 dark:text-gray-400">© 2025 National Bank of Canada</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}