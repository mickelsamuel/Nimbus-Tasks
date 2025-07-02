import { apiClient } from './api/client'

interface AvatarConfiguration {
  id: string
  face: {
    shape: string
    skinTone: string
    eyes: string
    eyeColor: string
    eyebrows: string
    nose: string
    mouth: string
    expression: string
  }
  hair: {
    style: string
    color: string
    facial: string
  }
  clothing: {
    suit: string
    shirt: string
    tie: string
    accessories: string[]
  }
  pose: {
    standing: string
    gesture: string
    confidence: number
  }
  environment: {
    background: string
    lighting: string
    camera: string
  }
}

interface AvatarOption {
  id: number
  url: string
  gender: string
  quality: string
  type: string
  preview: string
  name: string
}

interface ShopItem {
  id: string
  name: string
  category: string
  rarity: string
  cost: {
    coins?: number
    tokens?: number
  }
  preview: string
  description: string
}

interface ComplianceResult {
  bankingStandards: {
    passed: boolean
    score: number
    details: string
  }
  professionalAppearance: {
    passed: boolean
    score: number
    details: string
  }
  accessibility: {
    passed: boolean
    score: number
    details: string
  }
}

export const avatarApi = {
  // Get user's current avatar configuration
  async getConfig() {
    const response = await apiClient.get('/avatar/config')
    return response.data
  },

  // Generate avatar options for user
  async getAvatarOptions() {
    const response = await apiClient.get('/avatar/options')
    return response.data
  },

  // Get professional avatar presets
  async getPresets() {
    const response = await apiClient.get('/avatar/presets')
    return response.data
  },

  // Save avatar configuration
  async saveAvatar(avatarUrl: string, configuration?: AvatarConfiguration, preset?: string) {
    const response = await apiClient.post('/avatar/save', {
      avatarUrl,
      configuration,
      preset
    })
    return response.data
  },

  // Generate role-based avatar
  async generateAvatar(role?: string, preset?: string) {
    const response = await apiClient.post('/avatar/generate', {
      role,
      preset
    })
    return response.data
  },

  // Purchase avatar item
  async purchaseItem(itemId: string, itemType: string, cost: { coins?: number; tokens?: number }, name: string, rarity: string) {
    const response = await apiClient.post('/avatar/purchase', {
      itemId,
      itemType,
      cost,
      name,
      rarity
    })
    return response.data
  },

  // Get avatar shop items
  async getShopItems() {
    const response = await apiClient.get('/avatar/shop')
    return response.data
  },

  // Validate professional compliance
  async validateCompliance(configuration: AvatarConfiguration) {
    const response = await apiClient.post('/avatar/validate', {
      configuration
    })
    return response.data
  },

  // Export avatar with specified format and quality
  async exportAvatar(format: string = 'glb', quality: string = 'high', includeMetadata: boolean = false) {
    const response = await apiClient.get(`/avatar/export/${format}?quality=${quality}&includeMetadata=${includeMetadata}`)
    return response.data
  },

  // Generate shareable link for avatar
  async shareAvatar(includeConfiguration: boolean = false, expiresIn: string = '7d') {
    const response = await apiClient.post('/avatar/share', {
      includeConfiguration,
      expiresIn
    })
    return response.data
  },

  // Get shared avatar by token
  async getSharedAvatar(token: string) {
    const response = await apiClient.get(`/avatar/shared/${token}`)
    return response.data
  },

  // Get user's avatar analytics
  async getAnalytics() {
    const response = await apiClient.get('/avatar/analytics')
    return response.data
  },

  // Record feature usage for analytics
  async recordFeatureUsage(featureType: string, specificFeature?: string, sessionDuration?: number, actionsPerformed?: number) {
    const response = await apiClient.post('/avatar/analytics/feature-usage', {
      featureType,
      specificFeature,
      sessionDuration,
      actionsPerformed
    })
    return response.data
  },

  // Get user's shared avatars
  async getShares() {
    const response = await apiClient.get('/avatar/shares')
    return response.data
  },

  // Delete shared avatar
  async deleteShare(shareId: string) {
    const response = await apiClient.delete(`/avatar/shares/${shareId}`)
    return response.data
  },

  // Validate team standards
  async validateTeamStandards(configuration: AvatarConfiguration, teamId?: string) {
    const response = await apiClient.post('/avatar/team-standards/validate', {
      configuration,
      teamId
    })
    return response.data
  }
}

export type { AvatarConfiguration, AvatarOption, ShopItem, ComplianceResult }