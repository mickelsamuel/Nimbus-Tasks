// Main dashboard components
export { DashboardHero } from './components/DashboardHero'
export { DashboardLoadingState } from './components/DashboardLoadingState'
export { DashboardErrorState } from './components/DashboardErrorState'

// New redesigned components
export { DashboardHeroSectionFixed as DashboardHeroSection } from './DashboardHeroSectionFixed'
export { DashboardMetricsOverview } from './DashboardMetricsOverview'
export { DashboardQuickActions } from './DashboardQuickActions'
export { DashboardLearningProgress } from './DashboardLearningProgress'
export { DashboardActivityFeed } from './DashboardActivityFeedOptimized'
export { DashboardAIInsights } from './DashboardAIInsights'
export { DashboardAchievements } from './DashboardAchievements'
export { DashboardWalletButton } from './DashboardWalletButton'

// Legacy components (to be removed)
export { default as DashboardMetrics } from './MetricsCards'
export { default as DashboardActions } from './QuickActionsHub'
export { default as DashboardProgress } from './TrainingProgressCard'
export { default as DashboardActivity } from './TeamActivityShowcase'
export { DashboardInsights } from './DashboardInsights'