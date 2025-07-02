import {
  Building2,
  Users,
  Heart,
  Brain,
  Briefcase,
  Coffee,
  BookOpen,
  Monitor,
  Zap,
  Shield,
  Star,
  Settings,
  Home,
  MapPin,
  Video,
  Mic,
  Share,
  Calendar,
  Camera,
  Phone,
  MessageCircle,
  Globe,
  Laptop,
  Headphones,
  type LucideIcon
} from 'lucide-react'

// Icon mapping from string to React component
const iconMap: Record<string, LucideIcon> = {
  // Space types
  'Building2': Building2,
  'Users': Users,
  'Heart': Heart,
  'Brain': Brain,
  'Briefcase': Briefcase,
  'Coffee': Coffee,
  'BookOpen': BookOpen,
  'Monitor': Monitor,
  'Zap': Zap,
  'Shield': Shield,
  'Star': Star,
  'Settings': Settings,
  'Home': Home,
  'MapPin': MapPin,
  'Video': Video,
  'Mic': Mic,
  'Share': Share,
  'Calendar': Calendar,
  'Camera': Camera,
  'Phone': Phone,
  'MessageCircle': MessageCircle,
  'Globe': Globe,
  'Laptop': Laptop,
  'Headphones': Headphones,
  
  // Fallback icons by category
  'meeting': Users,
  'work': Briefcase,
  'social': Coffee,
  'training': Brain,
  'wellness': Heart,
  'office': Building2,
  'collaboration': Users,
  'learning': BookOpen,
  'technology': Monitor,
  'default': Building2
}

// Transform backend space data to frontend format
export const transformSpaceData = (backendSpace: any) => {
  const IconComponent = iconMap[backendSpace.icon] || iconMap[backendSpace.category] || iconMap.default

  return {
    ...backendSpace,
    icon: IconComponent,
    // Ensure we have all required fields with defaults
    status: backendSpace.currentUsers >= backendSpace.maxUsers ? 'busy' : 
            backendSpace.currentUsers > (backendSpace.maxUsers * 0.8) ? 'reserved' : 'available',
    occupancy: backendSpace.currentUsers || 0,
    capacity: backendSpace.maxUsers || 10,
    location: backendSpace.location || 'Virtual Space',
    category: backendSpace.category || 'office'
  }
}

// Transform backend team data to frontend format
export const transformTeamData = (backendTeam: any) => {
  const IconComponent = iconMap[backendTeam.icon] || iconMap[backendTeam.category] || iconMap.default

  return {
    ...backendTeam,
    icon: IconComponent,
    // Ensure we have all required fields with defaults
    status: backendTeam.isActive ? 'active' : 'inactive',
    memberCount: backendTeam.members?.length || 0,
    category: backendTeam.category || 'General',
    avatar: backendTeam.avatar || generateTeamAvatar(backendTeam.name, backendTeam.category || 'General')
  }
}

// Generate a professional team avatar URL based on team category
const generateTeamAvatar = (teamName: string, category: string): string => {
  const teamAvatars = {
    'Trading': [
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=400&fit=crop&crop=face'
    ],
    'Learning': [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    ],
    'Innovation': [
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop&crop=face'
    ],
    'Research': [
      'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face'
    ],
    'Risk Management': [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop&crop=face'
    ]
  };

  const categoryAvatars = teamAvatars[category as keyof typeof teamAvatars] || teamAvatars['Learning'];
  const hash = teamName.split('').reduce((a, b) => {a = ((a << 5) - a) + b.charCodeAt(0); return a & a}, 0);
  const index = Math.abs(hash) % categoryAvatars.length;
  return categoryAvatars[index];
};

// Get icon component by name
export const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || iconMap.default
}

export default iconMap