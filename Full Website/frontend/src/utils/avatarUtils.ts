/**
 * Avatar utility functions for handling ReadyPlayerMe avatars and fallbacks
 */

export interface AvatarUser {
  avatar?: string
  avatar3D?: string
  avatar2D?: string
  avatarPortrait?: string
  firstName: string
  lastName: string
  role?: string
  level?: number
  isOnline?: boolean
  hasCompletedAvatarSetup?: boolean
}

/**
 * Convert ReadyPlayerMe 3D avatar URL to portrait headshot URL
 */
export function getAvatarPortraitUrl(avatarUrl: string): string {
  if (!avatarUrl) return ''

  // Handle ReadyPlayerMe avatars
  if (avatarUrl.includes('readyplayer.me') || avatarUrl.includes('models.readyplayer.me')) {
    if (avatarUrl.includes('.glb')) {
      // Extract avatar ID from URL
      const avatarId = avatarUrl.match(/\/([a-zA-Z0-9]+)\.glb/)?.[1];
      if (avatarId) {
        // Use high-quality 2D avatar - frontend will handle cropping for portraits
        return `https://models.readyplayer.me/${avatarId}.png?textureAtlas=2048&morphTargets=ARKit`;
      }
      // Fallback to simple replacement
      return avatarUrl.replace('.glb', '.png');
    }
  }

  // Return original URL for non-ReadyPlayerMe avatars
  return avatarUrl
}

/**
 * Get user initials for fallback display
 */
export function getUserInitials(user: AvatarUser): string {
  const first = user.firstName?.charAt(0) || ''
  const last = user.lastName?.charAt(0) || ''
  return (first + last).toUpperCase()
}

/**
 * Get fallback avatar data when no avatar is available
 */
export function getFallbackAvatarData(user: AvatarUser) {
  return {
    initials: getUserInitials(user),
    backgroundColor: getInitialsBackgroundColor(user),
    textColor: 'white'
  }
}

/**
 * Generate a consistent background color based on user name
 */
function getInitialsBackgroundColor(user: AvatarUser): string {
  const colors = [
    'bg-gradient-to-br from-blue-500 to-purple-600',
    'bg-gradient-to-br from-green-500 to-teal-600',
    'bg-gradient-to-br from-purple-500 to-pink-600',
    'bg-gradient-to-br from-orange-500 to-red-600',
    'bg-gradient-to-br from-indigo-500 to-blue-600',
    'bg-gradient-to-br from-yellow-500 to-orange-600',
  ]
  
  const name = `${user.firstName}${user.lastName}`.toLowerCase()
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

/**
 * Check if an avatar URL is valid and accessible
 */
export async function validateAvatarUrl(url: string): Promise<boolean> {
  if (!url) return false
  
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Get multiple avatar URL options for fallback
 */
export function getAvatarUrlOptions(avatarUrl: string): string[] {
  if (!avatarUrl || !avatarUrl.includes('readyplayer.me')) {
    return [avatarUrl]
  }

  const options: string[] = []
  
  if (avatarUrl.includes('.glb')) {
    // Extract the avatar ID
    const match = avatarUrl.match(/\/([a-zA-Z0-9]+)\.glb/)
    if (match && match[1]) {
      const avatarId = match[1]
      // Try multiple Ready Player Me render options
      options.push(`https://render.readyplayer.me/portrait/${avatarId}.png`)
      options.push(`https://models.readyplayer.me/${avatarId}.png`)
      options.push(avatarUrl.replace('.glb', '.png'))
    }
  }
  
  return options.length > 0 ? options : [avatarUrl]
}

/**
 * Add cache busting to avatar URLs when they've recently changed
 */
function addCacheBustingIfNeeded(url: string): string {
  if (!url) return url
  
  // Check if we have a recent avatar update event for cache busting
  const recentUpdate = sessionStorage.getItem('recentAvatarUpdate')
  if (recentUpdate) {
    try {
      const updateData = JSON.parse(recentUpdate)
      const timeSinceUpdate = Date.now() - updateData.timestamp
      
      // Add cache busting for 30 seconds after an avatar update
      if (timeSinceUpdate < 30000 || updateData.forceRefresh) {
        const separator = url.includes('?') ? '&' : '?'
        const cacheBuster = `${separator}_cb=${updateData.timestamp}`
        return `${url}${cacheBuster}`
      }
    } catch (error) {
      console.warn('Error parsing recentAvatarUpdate from sessionStorage:', error)
    }
  }
  
  // Return original URL if no recent updates
  return url
}

/**
 * Get the best available avatar URL, with fallbacks
 */
export function getBestAvatarUrl(authUser: AvatarUser | null, propUser: AvatarUser, preferPortrait: boolean = false): string | null {

  // If portrait is preferred (like in header), prioritize portrait avatars
  if (preferPortrait) {
    // Priority: auth portrait > prop portrait > auth 2D > prop 2D > auth avatar > prop avatar
    const authPortrait = authUser?.avatarPortrait
    const propPortrait = propUser.avatarPortrait
    const authAvatar2D = authUser?.avatar2D
    const propAvatar2D = propUser.avatar2D
    const authAvatar = authUser?.avatar
    const propAvatar = propUser.avatar
    
    let selectedUrl = null
    if (authPortrait) {
      selectedUrl = authPortrait
    }
    else if (propPortrait) {
      selectedUrl = propPortrait
    }
    else if (authAvatar2D) {
      selectedUrl = authAvatar2D
    }
    else if (propAvatar2D) {
      selectedUrl = propAvatar2D
    }
    else if (authAvatar) {
      selectedUrl = getAvatarPortraitUrl(authAvatar)
    }
    else if (propAvatar) {
      selectedUrl = getAvatarPortraitUrl(propAvatar)
    }
    
    return selectedUrl ? addCacheBustingIfNeeded(selectedUrl) : null
  } else {
    // Standard priority: auth 2D > auth avatar > prop 2D > prop avatar
    const authAvatar2D = authUser?.avatar2D
    const authAvatar = authUser?.avatar
    const propAvatar2D = propUser.avatar2D
    const propAvatar = propUser.avatar
    
    let selectedUrl = null
    if (authAvatar2D) {
      selectedUrl = authAvatar2D
    }
    else if (authAvatar) {
      selectedUrl = getAvatarPortraitUrl(authAvatar)
    }
    else if (propAvatar2D) {
      selectedUrl = propAvatar2D
    }
    else if (propAvatar) {
      selectedUrl = getAvatarPortraitUrl(propAvatar)
    }
    
    return selectedUrl ? addCacheBustingIfNeeded(selectedUrl) : null
  }
}

/**
 * Get the best available 3D avatar URL (for R3F components)
 */
export function getBest3DAvatarUrl(authUser: AvatarUser | null, propUser: AvatarUser): string | null {
  // Priority: auth user 3D avatar > auth user avatar > prop user 3D avatar > prop user avatar
  const avatar3D = authUser?.avatar3D || propUser.avatar3D
  const avatarUrl = authUser?.avatar || propUser.avatar
  
  if (avatar3D) {
    // Use the dedicated 3D avatar if available
    return avatar3D
  }
  
  if (avatarUrl) {
    // For 3D, we want the original .glb URL, not the portrait
    return avatarUrl
  }
  
  return null
}

/**
 * Check if user needs avatar setup
 */
export function needsAvatarSetup(user: AvatarUser | null): boolean {
  if (!user) return true
  return !user.hasCompletedAvatarSetup || !user.avatar
}

/**
 * Default ReadyPlayerMe avatar for fallback
 */
export const DEFAULT_AVATAR_URL = 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.glb'
export const DEFAULT_PORTRAIT_URL = 'https://models.readyplayer.me/65a8dba831b23abb4f401bae.png?textureAtlas=2048&morphTargets=ARKit'

/**
 * Get avatar URL with all fallbacks applied
 */
export function getReliableAvatarUrl(authUser: AvatarUser | null, propUser: AvatarUser, preferPortrait: boolean = false): string {
  const bestUrl = getBestAvatarUrl(authUser, propUser, preferPortrait)
  if (bestUrl) return bestUrl
  
  // Ultimate fallback to default avatar
  return preferPortrait ? DEFAULT_PORTRAIT_URL : getAvatarPortraitUrl(DEFAULT_AVATAR_URL)
}