'use client'

import { Users, UserCheck, Crown, Rocket } from 'lucide-react';
import { NetworkPerson } from '@/types/career';
import { PersonCard } from './PersonCard';

interface NetworkSectionProps {
  title: string;
  people: NetworkPerson[];
  iconType: 'directReports' | 'peers' | 'mentors' | 'mentees';
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}

export const NetworkSection = ({ 
  title, 
  people, 
  iconType, 
  gradientFrom, 
  gradientTo, 
  className = '' 
}: NetworkSectionProps) => {
  const getIcon = () => {
    switch (iconType) {
      case 'directReports': return Users;
      case 'peers': return UserCheck;
      case 'mentors': return Crown;
      case 'mentees': return Rocket;
      default: return Users;
    }
  };

  const IconComponent = getIcon();

  return (
    <div className={`network-section ${className}`}>
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <IconComponent className="w-4 h-4" />
        {title} ({people.length})
      </h3>
      <div className="space-y-2">
        {people.map((person, index) => (
          <PersonCard
            key={index}
            person={person}
            gradientFrom={gradientFrom}
            gradientTo={gradientTo}
          />
        ))}
      </div>
    </div>
  );
};