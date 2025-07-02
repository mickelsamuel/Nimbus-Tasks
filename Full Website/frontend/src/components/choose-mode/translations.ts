// Language type definitions available in ./types if needed

const englishTranslations = {
    title: "Choose Your Banking Training Experience",
    subtitle: "Select your path to financial excellence",
    executiveSuite: "Executive Suite",
    bankingAcademy: "Banking Academy",
    executiveDescription: "Sophisticated glass office aesthetic designed for executive decision making with streamlined banking operations.",
    academyDescription: "Interactive learning environment with gamified progress tracking and achievement systems for engaging excellence.",
    enterExecutive: "Enter Executive Suite",
    beginAcademy: "Begin Academy Training",
    loading: "Loading...",
    executiveBadge: "Streamlined for Executive Decision Making",
    academyBadge: "Designed for Interactive Excellence",
    enterpriseGrade: "Enterprise Grade Training Platform",
    copyright: "© 2024 National Bank of Canada. All rights reserved.",
    features: {
      analytics: "Advanced Analytics Dashboard",
      executive: "Executive Decision Tools", 
      security: "Enterprise Security",
      performance: "Performance Metrics",
      leaderboards: "Achievement Leaderboards",
      collaboration: "Team Collaboration",
      tracking: "Progress Tracking",
      rewards: "Reward Systems"
    },
    errors: {
      connection: "Unable to connect to training servers. Please check your connection and try again.",
      timeout: "Request timed out. The servers may be experiencing high load.",
      general: "An unexpected error occurred. Please try again or contact support."
    },
    retry: "Try Again",
    soundEnabled: "Sound Enabled",
    soundDisabled: "Sound Disabled"
  }

export const translations = {
  en: englishTranslations,
  fr: englishTranslations
} as const

export const getTranslations = () => englishTranslations