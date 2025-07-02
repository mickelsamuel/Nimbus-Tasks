'use client'

import { NetworkPerson } from '@/types/career';

interface PersonCardProps {
  person: NetworkPerson;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}

export const PersonCard = ({ person, gradientFrom, gradientTo, className = '' }: PersonCardProps) => {
  return (
    <div className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer ${className}`}>
      <div className={`w-8 h-8 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
        {person.name.split(' ').map(n => n[0]).join('')}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900 dark:text-white">{person.name}</div>
        <div className="text-xs text-gray-500">{person.role}</div>
      </div>
    </div>
  );
};