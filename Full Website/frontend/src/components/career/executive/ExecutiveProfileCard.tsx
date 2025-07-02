'use client'

import { ExecutiveProfile } from '@/types/career';

interface ExecutiveProfileCardProps {
  profile: ExecutiveProfile;
  className?: string;
}

export const ExecutiveProfileCard = ({ profile, className = '' }: ExecutiveProfileCardProps) => {
  const calculateYearsOfService = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const years = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.round(years * 10) / 10;
  };

  // Safety check for profile data
  if (!profile) {
    return (
      <div className={`flex items-center gap-6 ${className}`}>
        <div className="w-32 h-32 bg-gray-300 rounded-2xl flex items-center justify-center text-gray-500 text-xl font-bold">
          Loading...
        </div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-300 rounded w-48 animate-pulse" />
          <div className="h-6 bg-gray-300 rounded w-32 animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-40 animate-pulse" />
        </div>
      </div>
    );
  }

  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('') : 'N/A';

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
          {initials}
        </div>
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {profile.name || 'Unknown Employee'}
        </h1>
        <p className="text-xl text-red-600 font-semibold">
          {profile.title || 'No Title'}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {profile.department || 'Unknown Department'} • {profile.level || 'No Level'}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>ID: {profile.employeeId || 'N/A'}</span>
          <span>•</span>
          <span>{profile.startDate ? calculateYearsOfService(profile.startDate) : 0} years of service</span>
          <span>•</span>
          <span>{profile.currentLocation || 'Unknown Location'}</span>
        </div>
      </div>
    </div>
  );
};