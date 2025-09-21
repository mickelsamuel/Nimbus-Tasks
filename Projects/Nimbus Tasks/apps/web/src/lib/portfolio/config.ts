// Portfolio Demo Configuration
export const PORTFOLIO_CONFIG = {
  // Feature flags
  isPortfolioMode: process.env.PORTFOLIO_MODE === 'true',
  allowSignup: process.env.PORTFOLIO_ALLOW_SIGNUP === 'true',

  // Demo organization
  demoOrgId: process.env.DEMO_ORG_ID || 'demo-org-showcase',
  demoOrgName: 'Nimbus Demo Workspace',
  demoOrgSlug: 'nimbus-demo',

  // Portfolio metadata
  developer: {
    name: 'Your Name',
    title: 'Full-Stack Developer',
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourprofile',
    portfolio: 'https://yourportfolio.com'
  },

  // Demo project configuration
  demoProject: {
    id: 'demo-project-showcase',
    name: 'Product Launch Campaign',
    description: 'A comprehensive project showcasing task management, team collaboration, and milestone tracking for a fictional SaaS product launch.',
    color: '#3b82f6'
  },

  // Demo users (fake data for showcase)
  demoUsers: [
    {
      id: 'demo-user-1',
      name: 'Sarah Chen',
      email: 'sarah@nimbusDemo.com',
      avatar: '/demo-avatars/sarah.jpg',
      role: 'Product Manager',
      initials: 'SC'
    },
    {
      id: 'demo-user-2',
      name: 'Marcus Rodriguez',
      email: 'marcus@nimbusDemo.com',
      avatar: '/demo-avatars/marcus.jpg',
      role: 'Lead Developer',
      initials: 'MR'
    },
    {
      id: 'demo-user-3',
      name: 'Emily Thompson',
      email: 'emily@nimbusDemo.com',
      avatar: '/demo-avatars/emily.jpg',
      role: 'UX Designer',
      initials: 'ET'
    },
    {
      id: 'demo-user-4',
      name: 'David Kim',
      email: 'david@nimbusDemo.com',
      avatar: '/demo-avatars/david.jpg',
      role: 'Marketing Lead',
      initials: 'DK'
    },
    {
      id: 'demo-user-5',
      name: 'Lisa Wang',
      email: 'lisa@nimbusDemo.com',
      avatar: '/demo-avatars/lisa.jpg',
      role: 'QA Engineer',
      initials: 'LW'
    }
  ],

  // Tour configuration
  tour: {
    enabled: true,
    autoStart: false,
    steps: [
      {
        target: '.dashboard-overview',
        content: 'Welcome to Nimbus Tasks! This is your project dashboard where you can see all active projects and their progress at a glance.',
        placement: 'bottom',
        disableBeacon: true
      },
      {
        target: '[data-testid="project-card"]',
        content: 'Each project card shows key metrics: total tasks, completion progress, team members, and upcoming deadlines.',
        placement: 'top'
      },
      {
        target: '[data-testid="task-board"]',
        content: 'The task board provides a Kanban view of your workflow with drag-and-drop functionality to update task status.',
        placement: 'bottom'
      },
      {
        target: '[data-testid="team-section"]',
        content: 'See your team members, their current assignments, and collaboration activity in real-time.',
        placement: 'left'
      },
      {
        target: '[data-testid="analytics-widget"]',
        content: 'Track productivity metrics, burndown charts, and project health indicators to stay on top of delivery.',
        placement: 'top'
      },
      {
        target: '[data-testid="notifications"]',
        content: 'Stay updated with real-time notifications about task updates, mentions, and project milestones.',
        placement: 'left'
      }
    ]
  },

  // Read-only mode settings
  readOnly: {
    allowedActions: ['view', 'filter', 'search'],
    blockedActions: ['create', 'edit', 'delete', 'assign'],
    showTooltips: true,
    tooltipMessage: 'This is a read-only demo. Sign up to create your own workspace!'
  },

  // Demo banner
  banner: {
    show: true,
    message: '🚀 You\'re viewing a live demo of Nimbus Tasks - a modern project management platform',
    ctaText: 'Create Your Workspace',
    ctaLink: '/signup'
  }
} as const

// Helper functions
export function isPortfolioMode(): boolean {
  return PORTFOLIO_CONFIG.isPortfolioMode
}

export function isDemoUser(userId: string): boolean {
  return PORTFOLIO_CONFIG.demoUsers.some(user => user.id === userId)
}

export function canPerformAction(action: string): boolean {
  if (!isPortfolioMode()) return true
  return PORTFOLIO_CONFIG.readOnly.allowedActions.includes(action)
}

export function getDemoUserById(id: string) {
  return PORTFOLIO_CONFIG.demoUsers.find(user => user.id === id)
}

export function getDemoOrg() {
  return {
    id: PORTFOLIO_CONFIG.demoOrgId,
    name: PORTFOLIO_CONFIG.demoOrgName,
    slug: PORTFOLIO_CONFIG.demoOrgSlug
  }
}