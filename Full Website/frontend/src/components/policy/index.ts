export { PolicyHero } from './PolicyHero'
export { PolicyHeader } from './PolicyHeader'
export { PolicyNotice } from './PolicyNotice'
export { PolicyCard } from './PolicyCard'
export { PolicyProgress } from './PolicyProgress'
export { PolicyAcceptance } from './PolicyAcceptance'
export { PolicyCompliance } from './PolicyCompliance'
export { PolicyConfirmation } from './PolicyConfirmation'
export { PolicyBackground } from './PolicyBackground'

// Types
export interface PolicyItem {
  id: string
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  accentColor: string
  content: string[]
}

export interface PolicyAcceptanceState {
  codeOfConduct: boolean
  dataPrivacy: boolean
  platformUsage: boolean
  bankingSecurity: boolean
}