export type LanguageType = 'en' | 'fr'

const englishTranslations = {
    // Global app translations
    app: {
      title: "National Bank Training Platform",
      bankName: "National Bank of Canada",
      shortTitle: "NBC Training",
      tagline: "Excellence in Banking Education",
      copyright: "© 2024 National Bank of Canada. All rights reserved.",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      warning: "Warning",
      info: "Information"
    },
    // Header translations
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
        recentSearches: "Recent searches",
        popularSearches: "Popular searches",
        viewAllResults: "View all results for \"{query}\""
      },
      navigation: {
        switchToLight: "Switch to light mode",
        switchToDark: "Switch to dark mode",
        switchToEnglish: "Switch to English",
        switchToFrench: "Switch to French",
        notifications: "Notifications",
        notificationsUnread: "Notifications ({count} unread)",
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
        coins: "Coins",
        tokens: "Event Tokens",
        points: "XP",
        level: "Level",
        viewHistory: "Transaction History",
        currentBalance: "Current Balance",
        noTransactions: "No currency transactions yet",
        noTransactionsSubtext: "Complete modules and activities to earn currency!",
        earnedReason: "Earned from {reason}",
        spentReason: "Spent on {reason}",
        transferInReason: "Received from {reason}",
        transferOutReason: "Sent to {reason}"
      },
      status: {
        online: "Online",
        offline: "Offline", 
        syncing: "Syncing data...",
        connectionLost: "Connection lost",
        newNotifications: "{count} new notifications"
      }
    },
    // Sidebar translations
    sidebar: {
      search: {
        placeholder: "Search navigation...",
        searchNavigation: "Search navigation"
      },
      profile: {
        level: "Level {level}",
        role: "{role}",
        progress: "Progress",
        streak: "{count} day streak",
        online: "Online"
      },
      navigation: {
        coreLearning: "Core Learning",
        socialFeatures: "Social Features", 
        progress: "Progress",
        personal: "Personal",
        management: "Management",
        
        // Navigation items
        dashboard: "Dashboard",
        modules: "Modules",
        simulation: "Simulation",
        careerMap: "Career Map",
        virtualSpaces: "Virtual Spaces",
        teams: "Teams",
        friends: "Friends",
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
        
        // Badges and states
        new: "NEW",
        live: "LIVE",
        sale: "Sale",
        locked: "Locked",
        comingSoon: "Coming Soon"
      },
      toggleCollapse: "Toggle sidebar",
      keyboardShortcut: "Press Ctrl+B to toggle"
    },
    // Additional page titles
    help: {
      title: "Help & Support"
    },
    policy: {
      title: "Privacy Policy"
    },
    auth: {
      login: "Login"
    },
    chooseMode: {
      title: "Choose Mode"
    }
  }

export const layoutTranslations = {
  en: englishTranslations,
  fr: englishTranslations
} as const

export const getLayoutTranslations = () => englishTranslations

// Helper function to replace placeholders in translation strings
export const translateWithParams = (template: string, params: Record<string, string | number>): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match
  })
}