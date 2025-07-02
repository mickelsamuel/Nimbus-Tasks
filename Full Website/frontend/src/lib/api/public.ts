import { api } from './client';

export interface DashboardPreview {
  courses: Array<{
    name: string;
    category: string;
    progress: number;
    color: string;
  }>;
  stats: {
    overallProgress: number;
    certificationsEarned: number;
    activeStatus: string;
  };
  features: {
    enterpriseReady: {
      title: string;
      subtitle: string;
    };
    aiPowered: {
      title: string;
      subtitle: string;
    };
  };
}

export interface PlatformFeatures {
  features: Array<{
    icon: string;
    title: string;
    description: string;
    stats: string;
    gradient: string;
    bgGradient: string;
  }>;
  benefits: string[];
  stats: {
    totalModules: number;
    activeUsers: number;
    expertInstructors: number;
  };
}

export interface CompanyInfo {
  name: string;
  shortName: string;
  tagline: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  contact: {
    email: string;
    phone: string;
    supportHours: string;
  };
  social: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  copyright: {
    year: number;
    text: string;
  };
  quickLinks: Array<{ label: string; href: string }>;
  supportLinks: Array<{ label: string; href: string }>;
}

// Fetch dashboard preview data for homepage
export async function fetchDashboardPreview(): Promise<DashboardPreview> {
  try {
    const response = await api.get('/public/dashboard-preview');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch dashboard preview');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard preview:', error);
    // Return fallback data
    return {
      courses: [
        { name: 'Advanced Risk Management', category: 'risk', progress: 85, color: 'bg-green-500' },
        { name: 'Digital Banking Innovation', category: 'technology', progress: 60, color: 'bg-blue-500' },
        { name: 'Regulatory Compliance', category: 'compliance', progress: 30, color: 'bg-purple-500' }
      ],
      stats: {
        overallProgress: 78,
        certificationsEarned: 25,
        activeStatus: 'Live'
      },
      features: {
        enterpriseReady: {
          title: 'Enterprise Ready',
          subtitle: 'Trusted by 500+ institutions'
        },
        aiPowered: {
          title: 'AI-Powered',
          subtitle: 'Personalized learning paths'
        }
      }
    };
  }
}

// Fetch platform features for homepage
export async function fetchPlatformFeatures(): Promise<PlatformFeatures> {
  try {
    const response = await api.get('/public/features');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch platform features');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching platform features:', error);
    // Return fallback data
    return {
      features: [],
      benefits: [],
      stats: {
        totalModules: 350,
        activeUsers: 12500,
        expertInstructors: 150
      }
    };
  }
}

// Fetch company information for footer
export async function fetchCompanyInfo(): Promise<CompanyInfo> {
  try {
    const response = await api.get('/public/company-info');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch company info');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching company info:', error);
    // Return fallback data
    return {
      name: 'National Bank of Canada',
      shortName: 'BNC',
      tagline: 'Professional Training Platform',
      address: {
        street: '600 De La Gauchetière Street West',
        city: 'Montreal',
        province: 'Quebec',
        postalCode: 'H3B 4L2',
        country: 'Canada'
      },
      contact: {
        email: 'training@nbc.ca',
        phone: '1-888-483-5628',
        supportHours: 'Monday - Friday, 8 AM - 8 PM EST'
      },
      social: {
        linkedin: 'https://www.linkedin.com/company/national-bank-of-canada',
        twitter: 'https://twitter.com/nbc',
        facebook: 'https://www.facebook.com/nationalbankofcanada'
      },
      copyright: {
        year: new Date().getFullYear(),
        text: 'National Bank of Canada. All rights reserved.'
      },
      quickLinks: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
        { label: 'Help Center', href: '/help' }
      ],
      supportLinks: [
        { label: 'Documentation', href: '/help/docs' },
        { label: 'Training Videos', href: '/help/training-videos' },
        { label: 'Community Forum', href: '/help/community-forum' },
        { label: 'Best Practices', href: '/help/best-practices' }
      ]
    };
  }
}

// Hook for using dashboard preview data
import { useState, useEffect } from 'react';

export function useDashboardPreview() {
  const [preview, setPreview] = useState<DashboardPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDashboardPreview()
      .then(setPreview)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { preview, loading, error };
}

// Hook for using platform features
export function usePlatformFeatures() {
  const [features, setFeatures] = useState<PlatformFeatures | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPlatformFeatures()
      .then(setFeatures)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { features, loading, error };
}

// Hook for using company info
export function useCompanyInfo() {
  const [info, setInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCompanyInfo()
      .then(setInfo)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { info, loading, error };
}