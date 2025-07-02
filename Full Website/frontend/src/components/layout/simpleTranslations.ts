export type Language = 'en' | 'fr'

const englishTranslations = {
    app: {
      title: "National Bank Training Platform",
      bankName: "National Bank of Canada", 
      shortTitle: "NBC Training"
    },
    header: {
      search: {
        placeholder: "Search modules, friends & teams, events... (⌘K)",
        placeholderMobile: "Search modules, friends & teams, events...",
        openSearch: "Open search",
        closeSearch: "Close search",
        globalSearch: "Global search",
        noResults: "No results found",
        searchResults: "Search Results",
        searchSuggestions: "Search suggestions",
        viewAllResults: "View all results for \"{query}\""
      },
      navigation: {
        switchToLight: "Switch to light mode",
        switchToDark: "Switch to dark mode",
        switchToEnglish: "Switch to English",
        switchToFrench: "Switch to French",
        notifications: "Notifications",
        userProfileMenu: "User profile menu",
        signOut: "Sign Out",
        viewProfile: "View Profile",
        createAvatar: "Create Avatar",
        changeAvatar: "Change Avatar",
        settings: "Settings",
        switchMode: "Switch Mode"
      },
      notifications: {
        title: "Notifications",
        markAllAsRead: "Mark all as read",
        noNotifications: "No notifications yet",
        noNotificationsSubtext: "We'll notify you when something interesting happens!",
        viewAllNotifications: "View all notifications"
      },
      currency: {
        viewHistory: "Transaction History",
        currentBalance: "Current Balance",
        noTransactions: "No currency transactions yet",
        noTransactionsSubtext: "Complete modules and activities to earn currency!"
      },
      status: {
        online: "Online",
        offline: "Offline",
        syncing: "Syncing data...",
        connectionLost: "Connection lost",
        newNotifications: "{count} new notifications"
      }
    },
    sidebar: {
      search: {
        placeholder: "Search navigation...",
        searchNavigation: "Search navigation"
      },
      profile: {
        level: "Level {level}",
        progress: "Progress",
        streak: "{count} day streak",
        online: "Online"
      },
      toggleCollapse: "Toggle sidebar",
      keyboardShortcut: "Press Ctrl+B to toggle",
      navigation: {
        dashboard: "Dashboard",
        modules: "Modules",
        simulation: "Simulation",
        careerMap: "Career Map",
        virtualSpaces: "Virtual Spaces",
        "friends-teams": "Friends & Teams",
        events: "Events",
        university: "University",
        leaderboards: "Leaderboards",
        timeline: "Timeline",
        achievements: "Achievements",
        profile: "Profile",
        avatar: "Avatar",
        shop: "Shop",
        chat: "Chat",
        adminPanel: "Admin Panel",
        settings: "Settings",
        coreLearning: "Core Learning",
        socialFeatures: "Social Features",
        progress: "Progress",
        personal: "Personal",
        management: "Management",
        new: "NEW",
        live: "LIVE",
        sale: "Sale"
      }
    },
    // Page titles for current page detection
    pages: {
      dashboard: "Dashboard",
      modules: "Modules", 
      simulation: "Simulation",
      career: "Career Map",
      spaces: "Virtual Spaces",
      "friends-teams": "Friends & Teams",
      events: "Events",
      university: "University",
      leaderboards: "Leaderboards",
      timeline: "Timeline",
      achievements: "Achievements",
      profile: "Profile",
      avatar: "Avatar",
      shop: "Shop",
      chat: "Chat",
      admin: "Admin Panel",
      settings: "Settings",
      help: "Help & Support",
      policy: "Privacy Policy",
      login: "Login",
      "choose-mode": "Choose Mode"
    }
  }

export const translations = {
  en: englishTranslations,
  fr: englishTranslations
}

export const getTranslation = (language: Language, key: string, params?: Record<string, string | number>): string => {
  try {
    const keys = key.split('.')
    let value: unknown = englishTranslations
    
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    
    if (typeof value === 'string') {
      // Replace parameters if provided
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match
        })
      }
      return value
    }
    
    // Final fallback - create readable text from key
    const fallback = key.split('.').pop() || key
    return fallback.charAt(0).toUpperCase() + fallback.slice(1).replace(/([A-Z])/g, ' $1')
  } catch (error) {
    console.error(`Error translating key "${key}":`, error)
    return key
  }
}