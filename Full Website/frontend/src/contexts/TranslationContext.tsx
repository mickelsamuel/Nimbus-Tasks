'use client'

import React, { createContext, useContext, ReactNode } from 'react'

type Language = 'en' | 'fr'

interface TranslationContextType {
  language: Language
  changeLanguage: (newLanguage: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

interface TranslationProviderProps {
  children: ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const language: Language = 'en'

  const changeLanguage = () => {
    // Do nothing - toggle is inactive
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Comprehensive English translation mapping
    const translations: Record<string, string> = {
      // Dashboard
      'dashboard.insights.performanceTrends': 'Performance Trends',
      'dashboard.insights.viewFullAnalytics': 'View Full Analytics',
      'dashboard.insights.title': 'AI Insights',
      'dashboard.insights.weeklyPerformance': 'Weekly Performance',
      'dashboard.insights.strongestSkill': 'Strongest Skill',
      'dashboard.insights.improvementArea': 'Improvement Area',
      'dashboard.insights.recommendations': 'Smart Recommendations',
      'dashboard.insights.aiPowered': 'AI Powered',
      'dashboard.insights.subtitle': 'Personalized insights powered by AI',
      'dashboard.insights.personalizedSuggestions': 'Personalized suggestions based on your performance',
      'dashboard.insights.recentAchievements': 'Recent Achievements',
      'dashboard.insights.latestAccomplishments': 'Latest accomplishments and milestones',
      
      // Dashboard time/months
      'dashboard.time.months.short.jan': 'Jan',
      'dashboard.time.months.short.feb': 'Feb',
      'dashboard.time.months.short.mar': 'Mar',
      'dashboard.time.months.short.apr': 'Apr',
      'dashboard.time.months.short.may': 'May',
      'dashboard.time.months.short.jun': 'Jun',
      'dashboard.time.months.short.jul': 'Jul',
      'dashboard.time.months.short.aug': 'Aug',
      'dashboard.time.months.short.sep': 'Sep',
      'dashboard.time.months.short.oct': 'Oct',
      'dashboard.time.months.short.nov': 'Nov',
      'dashboard.time.months.short.dec': 'Dec',
      
      // Dashboard actions
      'dashboard.insights.actions.viewModules': 'View Modules',
      'dashboard.insights.actions.takeQuiz': 'Take Quiz',
      'dashboard.insights.actions.joinStudyGroup': 'Join Study Group',
      'dashboard.quickActions.title': 'Quick Actions',
      'dashboard.quickActions.subtitle': 'Jump into your most important tasks',
      'dashboard.quickActions.aiRecommended': 'AI Recommended',
      'dashboard.quickActions.recommended.title': 'Recommended for You',
      'dashboard.quickActions.recommended.levelUpFast': 'Level Up Fast',
      
      // Dashboard activity
      'dashboard.activity.title': 'Activity Hub',
      'dashboard.activity.subtitle': 'Track your progress and team activities',
      'dashboard.activity.tabs.myActivity': 'My Activity',
      'dashboard.activity.tabs.teamFeed': 'Team Feed',
      'dashboard.activity.timeAgo.justNow': 'Just now',
      
      // Dashboard progress
      'dashboard.progress.title': 'Training Progress',
      'dashboard.progress.interactiveTimeline': 'Interactive Timeline',
      'dashboard.progress.stats.completed': 'Completed',
      'dashboard.progress.stats.remaining': 'Remaining',
      'dashboard.progress.stats.level': 'Level',
      'dashboard.progress.stats.dayStreak': 'Day Streak',
      
      // Dashboard metrics
      'dashboard.metrics.modulesCompleted': 'Modules Completed',
      'dashboard.metrics.inProgress': 'In Progress',
      'dashboard.metrics.assignedModules': 'Assigned Modules',
      'dashboard.metrics.experiencePoints': 'Experience',
      'dashboard.metrics.weeklyProgress': 'Weekly Progress',
      'dashboard.metrics.learningStreak': 'Learning Streak',
      
      // Dashboard hero
      'dashboard.hero.greeting.morning': 'Good morning',
      'dashboard.hero.greeting.afternoon': 'Good afternoon',
      'dashboard.hero.greeting.evening': 'Good evening',
      'dashboard.hero.stats.learningStreak': 'Learning Streak',
      'dashboard.hero.stats.days': 'days',
      
      // Dashboard avatar
      'dashboard.avatar3d.loading': 'Loading Avatar...',
      'dashboard.avatar3d.title': '3D Avatar',
      'dashboard.avatar3d.rotateToView': 'Drag to rotate and view',
      'dashboard.avatar3d.createAvatar': 'Create Avatar',
      
      // Dashboard error states
      'dashboard.error.title': 'Something went wrong',
      'dashboard.error.subtitle': 'We\'re having trouble loading your dashboard. Please try again.',
      'dashboard.error.retry': 'Try Again',
      'dashboard.error.contact': 'Contact Support',
      'dashboard.error.quickFixes': 'Quick Fixes',
      
      // Dashboard loading
      'dashboard.loading.title': 'Loading Dashboard',
      'dashboard.loading.subtitle': 'Please wait while we prepare your personalized dashboard',
      'dashboard.loading.steps.fetchingData': 'Fetching your data...',
      'dashboard.loading.steps.analyzingProgress': 'Analyzing your progress...',
      
      // Common terms
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
      'common.view': 'View',
      'common.close': 'Close',
      'common.next': 'Next',
      'common.previous': 'Previous',
      'common.continue': 'Continue',
      'common.finish': 'Finish',
      'common.back': 'Back',
      
      // App basics
      'app.title': 'National Bank Training Platform',
      'app.shortTitle': 'NBC Training',
      'app.loading': 'Loading...',
      'app.bankName': 'National Bank of Canada',
      
      // Modules
      'modules.title': 'Training Modules',
      'modules.search.placeholder': 'Search modules by title, topic, or skill...',
      'modules.filters.difficulty': 'Difficulty',
      'modules.filters.duration': 'Duration',
      'modules.filters.category': 'Category',
      'modules.stats.completed': 'Completed',
      'modules.stats.inProgress': 'In Progress',
      'modules.stats.assigned': 'Assigned',
      'modules.hero.title': 'Your Learning Journey',
      'modules.hero.subtitle': 'Accelerate your professional development',
      'modules.card.preview': 'Preview',
      'modules.card.startLearning': 'Start Learning',
      'modules.card.continueLearning': 'Continue Learning',
      
      // Profile
      'profile.title': 'Profile',
      'profile.personal.title': 'Personal Information',
      'profile.security.title': 'Security & Privacy',
      'profile.activity.title': 'Activity History',
      'profile.achievements.title': 'Achievements',
      'profile.edit': 'Edit Profile',
      'profile.save': 'Save Changes',
      
      // Settings
      'settings.title': 'Settings',
      'settings.personal.title': 'Personal Information',
      'settings.security.title': 'Security & Privacy',
      'settings.notifications.title': 'Notifications',
      'settings.privacy.title': 'Privacy Settings',
      'settings.accessibility.title': 'Accessibility',
      'settings.analytics.title': 'Analytics Preferences',
      
      // Teams
      'teams.title': 'Teams',
      'teams.create.title': 'Create Team',
      'teams.join.title': 'Join Team',
      'teams.members': 'Members',
      'teams.performance': 'Team Performance',
      'teams.leaderboard': 'Team Leaderboard',
      
      // Events
      'events.title': 'Events',
      'events.upcoming': 'Upcoming Events',
      'events.past': 'Past Events',
      'events.register': 'Register',
      'events.details': 'Event Details',
      
      // Shop
      'shop.title': 'Shop',
      'shop.filters.category': 'Category',
      'shop.filters.price': 'Price Range',
      'shop.cart': 'Shopping Cart',
      'shop.buy': 'Buy Now',
      'shop.owned': 'Owned',
      
      // Timeline
      'timeline.title': 'Timeline',
      'timeline.view.grid': 'Grid View',
      'timeline.view.list': 'List View',
      'timeline.filter.year': 'Filter by Year',
      'timeline.details': 'View Details',
      
      // Leaderboards
      'leaderboards.title': 'Leaderboards',
      'leaderboards.global': 'Global Rankings',
      'leaderboards.department': 'Department Rankings',
      'leaderboards.weekly': 'Weekly Champions',
      'leaderboards.monthly': 'Monthly Champions',
      
      // Chat
      'chat.title': 'AI Assistant',
      'chat.placeholder': 'Ask me anything about your training...',
      'chat.send': 'Send Message',
      'chat.export': 'Export Conversation',
      
      // Analytics
      
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.modules': 'Modules',
      'nav.simulation': 'Simulation',
      'nav.career': 'Career Map',
      'nav.spaces': 'Virtual Spaces',
      'nav.teams': 'Teams',
      'nav.friends': 'Friends',
      'nav.events': 'Events',
      'nav.innovation-lab': 'Innovation Lab',
      'nav.leaderboards': 'Leaderboards',
      'nav.timeline': 'Timeline',
      'nav.achievements': 'Achievements',
      'nav.profile': 'Profile',
      'nav.avatar': 'Avatar',
      'nav.shop': 'Shop',
      'nav.chat': 'Chat',
      'nav.settings': 'Settings',
      'nav.admin': 'Admin Panel',
      'nav.help': 'Help & Support',
      
      // Authentication
      'auth.login': 'Login',
      'auth.logout': 'Logout',
      'auth.signup': 'Sign Up',
      'auth.forgotPassword': 'Forgot Password',
      'auth.resetPassword': 'Reset Password',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      
      // Notifications
      'notifications.title': 'Notifications',
      'notifications.markAllRead': 'Mark All as Read',
      'notifications.noNotifications': 'No notifications yet',
      'notifications.settings': 'Notification Settings',
      
      // Avatar
      'avatar.title': 'Avatar Creator',
      'avatar.customize': 'Customize Avatar',
      'avatar.save': 'Save Avatar',
      'avatar.loading': 'Loading Avatar Creator...',
      
      // Help
      'help.title': 'Help & Support',
      'help.faq': 'Frequently Asked Questions',
      'help.contact': 'Contact Support',
      'help.tutorials': 'Video Tutorials',
      'help.documentation': 'Documentation',
      
      // Forms
      'form.label.firstName': 'First Name',
      'form.label.lastName': 'Last Name',
      'form.label.email': 'Email',
      'form.label.phone': 'Phone',
      'form.label.employeeId': 'Employee ID',
      'form.label.department': 'Department',
      'form.label.position': 'Position',
      'form.label.manager': 'Manager',
      'form.placeholder.fullName': 'Full Name',
      'form.placeholder.relationship': 'Relationship',
      'form.placeholder.phoneNumber': 'Phone Number',
      'form.placeholder.emailOptional': 'Email (optional)',
      'form.placeholder.certificationName': 'Certification Name',
      'form.placeholder.issuingOrganization': 'Issuing Organization',
      'form.placeholder.credentialId': 'Credential ID',
      
      // Buttons
      'button.edit': 'Edit',
      'button.save': 'Save',
      'button.cancel': 'Cancel',
      'button.submit': 'Submit',
      'button.confirm': 'Confirm',
      'button.delete': 'Delete',
      'button.add': 'Add',
      'button.remove': 'Remove',
      'button.addContact': 'Add Contact',
      'button.addCertification': 'Add Certification',
      'button.saveContacts': 'Save Contacts',
      'button.saveCertifications': 'Save Certifications',
      'button.download': 'Download',
      'button.upload': 'Upload',
      'button.retry': 'Try Again',
      
      // Status messages
      'status.loading': 'Loading...',
      'status.saving': 'Saving...',
      'status.saved': 'Saved!',
      'status.active': 'Active',
      'status.inactive': 'Inactive',
      'status.pending': 'Pending',
      'status.completed': 'Completed',
      'status.failed': 'Failed',
      'status.success': 'Success',
      'status.error': 'Error',
      
      // Settings sections
      'settings.section.personalInformation': 'Personal Information',
      'settings.section.basicInformation': 'Basic Information',
      'settings.section.emergencyContacts': 'Emergency Contacts',
      'settings.section.professionalCertifications': 'Professional Certifications',
      'settings.section.workInformation': 'Work Information',
      'settings.section.contactInformation': 'Contact Information',
      
      // Events
      'event.status.live': 'LIVE',
      'event.status.upcoming': 'UPCOMING',
      'event.status.featured': 'FEATURED',
      'event.status.ended': 'ENDED',
      'event.action.joinChampionship': 'Join Championship',
      'event.action.challengeShowcase': 'Challenge Showcase',
      'event.action.championshipLeaderboard': 'Championship Leaderboard',
      'event.difficulty.easy': 'EASY',
      'event.difficulty.medium': 'MEDIUM',
      'event.difficulty.hard': 'HARD',
      'event.difficulty.expert': 'EXPERT',
      'event.progress': 'Progress',
      'event.participants': 'participants',
      'event.remaining': 'remaining',
      'event.coins': 'coins',
      'event.xp': 'XP',
      
      // Trading/Simulation
      'trading.quickTrade': 'Quick Trade',
      'trading.buyingPower': 'Buying Power',
      'trading.symbol': 'Symbol',
      'trading.quantity': 'Quantity',
      'trading.orderType': 'Order Type',
      'trading.price': 'Price',
      'trading.timeInForce': 'Time in Force',
      'trading.buy': 'Buy',
      'trading.sell': 'Sell',
      'trading.orderType.market': 'MARKET',
      'trading.orderType.limit': 'LIMIT',
      'trading.orderType.stop': 'STOP',
      'trading.orderType.stopLimit': 'STOP-LIMIT',
      'trading.timeInForce.day': 'DAY',
      'trading.timeInForce.gtc': 'GTC',
      'trading.timeInForce.ioc': 'IOC',
      'trading.timeInForce.fok': 'FOK',
      
      // Modals
      'modal.exportConversation.title': 'Export Conversation',
      'modal.exportConversation.subtitle': 'Download your conversation data',
      'modal.exportConversation.jsonFormat': 'JSON Format',
      'modal.exportConversation.description': 'Complete conversation data with analytics',
      'modal.close': 'Close',
      'modal.confirm': 'Confirm',
      
      // Time formatting
      'time.daysRemaining': '{days}d {hours}h remaining',
      'time.hoursRemaining': '{hours}h remaining',
      'time.eventEnded': 'Event ended',
      'time.justNow': 'Just now',
      'time.minutesAgo': '{minutes}m ago',
      'time.hoursAgo': '{hours}h ago',
      'time.daysAgo': '{days}d ago',
      
      // Currency/Points formatting
      'currency.format.xp': '{amount} XP',
      'currency.format.coins': '{amount} coins',
      'currency.coins': 'Coins',
      'currency.tokens': 'Event Tokens',
      'currency.xp': 'XP',
      
      // Error messages
      'error.general': 'An error occurred. Please try again.',
      'error.network': 'Network error. Please check your connection.',
      'error.validation': 'Please check your input and try again.',
      'error.unauthorized': 'You are not authorized to perform this action.',
      'error.notFound': 'The requested resource was not found.',
      'error.serverError': 'Server error. Please try again later.',
      
      // Success messages
      'success.saved': 'Changes saved successfully!',
      'success.created': 'Created successfully!',
      'success.updated': 'Updated successfully!',
      'success.deleted': 'Deleted successfully!',
      'success.uploaded': 'Uploaded successfully!',
      
      // Achievements/Gamification
      'achievement.unlocked': 'Achievement Unlocked!',
      'achievement.newBadge': 'New Badge Earned!',
      'achievement.levelUp': 'Level Up!',
      'achievement.streak': 'Streak Bonus!',
      'achievement.milestone': 'Milestone Reached!',
      
      // Loading states
      'loading.dashboard': 'Loading Dashboard...',
      'loading.profile': 'Loading Profile...',
      'loading.modules': 'Loading Modules...',
      'loading.data': 'Loading Data...',
      'loading.please_wait': 'Please wait...'
    }
    
    // Handle parameters if provided
    if (params && translations[key]) {
      let result = translations[key]
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(`{${paramKey}}`, String(paramValue))
      })
      return result
    }
    
    // Special handling for time ago patterns
    if (key.startsWith('dashboard.activity.timeAgo.') && params) {
      if (key.includes('minutesAgo') && params.minutes) {
        return `${params.minutes}m ago`
      }
      if (key.includes('hoursAgo') && params.hours) {
        return `${params.hours}h ago`
      }
      if (key.includes('daysAgo') && params.days) {
        return `${params.days}d ago`
      }
    }
    
    // Special handling for participant counts
    if (key.includes('participants') && params?.count) {
      return `${params.count} participants online`
    }
    
    // Return translation if found, otherwise return a readable fallback
    const translation = translations[key]
    if (translation) {
      return translation
    }
    
    // Create a readable fallback from the key
    const parts = key.split('.')
    const lastPart = parts[parts.length - 1]
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/([A-Z])/g, ' $1')
  }

  return (
    <TranslationContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}