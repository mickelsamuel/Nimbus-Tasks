'use client'

import { AvatarConfiguration } from '@/lib/avatarApi'
import CustomizationTabs from './customization/CustomizationTabs'
import FaceCustomization from './customization/FaceCustomization'
import HairCustomization from './customization/HairCustomization'
import ClothingCustomization from './customization/ClothingCustomization'
import PoseCustomization from './customization/PoseCustomization'
import EnvironmentCustomization from './customization/EnvironmentCustomization'

interface PurchaseItem {
  id: string
  name: string
  cost: {
    coins?: number
    tokens?: number
  }
}

interface AvatarCustomizationSidebarProps {
  activeTab: 'face' | 'hair' | 'clothing' | 'pose' | 'environment'
  onTabChange: (tab: 'face' | 'hair' | 'clothing' | 'pose' | 'environment') => void
  configuration: AvatarConfiguration
  onConfigurationUpdate: (config: Partial<AvatarConfiguration>) => void
  userCurrency: { coins: number; tokens: number }
  onPurchaseItem?: (item: PurchaseItem) => void
}

export default function AvatarCustomizationSidebar({
  activeTab,
  onTabChange,
  configuration,
  onConfigurationUpdate,
  userCurrency,
  onPurchaseItem
}: AvatarCustomizationSidebarProps) {
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'face':
        return (
          <FaceCustomization
            configuration={configuration}
            onConfigurationUpdate={onConfigurationUpdate}
          />
        )
      case 'hair':
        return (
          <HairCustomization
            configuration={configuration}
            onConfigurationUpdate={onConfigurationUpdate}
          />
        )
      case 'clothing':
        return (
          <ClothingCustomization
            configuration={configuration}
            onConfigurationUpdate={onConfigurationUpdate}
            userCurrency={userCurrency}
            onPurchaseItem={onPurchaseItem}
          />
        )
      case 'pose':
        return (
          <PoseCustomization
            configuration={configuration}
            onConfigurationUpdate={onConfigurationUpdate}
          />
        )
      case 'environment':
        return (
          <EnvironmentCustomization
            configuration={configuration}
            onConfigurationUpdate={onConfigurationUpdate}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="w-96 bg-slate-900/95 backdrop-blur-sm border-l border-slate-700/50 flex flex-col">
      {/* Customization Tabs */}
      <CustomizationTabs activeTab={activeTab} onTabChange={onTabChange} />
      
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderActiveTab()}
        </div>
      </div>
      
      {/* Bottom Actions */}
      <div className="border-t border-slate-700/50 p-4 bg-slate-800/50">
        <div className="text-center">
          <div className="text-xs text-slate-400 mb-2">
            Professional Avatar Studio
          </div>
          <div className="text-sm text-slate-300">
            Customize your professional digital identity
          </div>
        </div>
      </div>
    </div>
  )
}