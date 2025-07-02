import React from 'react';
import { Trophy, Award, Star, Target, Zap } from 'lucide-react';

interface TimelineAchievementsProps {
  achievements: string[];
  className?: string;
}

const achievementData: Record<string, {
  icon: React.ReactNode;
  color: string;
  description: string;
}> = {
  'History Buff': {
    icon: <Trophy className="w-5 h-5" />,
    color: 'from-amber-400 to-orange-500',
    description: 'Viewed all timeline events'
  },
  'Era Expert': {
    icon: <Award className="w-5 h-5" />,
    color: 'from-blue-400 to-indigo-500',
    description: 'Explored events from all eras'
  },
  'Detective': {
    icon: <Target className="w-5 h-5" />,
    color: 'from-green-400 to-emerald-500',
    description: 'Used search to find specific events'
  },
  'Bookworm': {
    icon: <Star className="w-5 h-5" />,
    color: 'from-purple-400 to-pink-500',
    description: 'Bookmarked 10+ events'
  },
  'Storyteller': {
    icon: <Zap className="w-5 h-5" />,
    color: 'from-red-400 to-rose-500',
    description: 'Shared timeline stories'
  }
};

const TimelineAchievements: React.FC<TimelineAchievementsProps> = ({ 
  achievements, 
  className = '' 
}) => {
  if (achievements.length === 0) return null;

  return (
    <div className={`timeline-achievements ${className}`}>
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200/50 shadow-sm">
        <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          Achievements Unlocked ({achievements.length})
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {achievements.map((achievement) => {
            const data = achievementData[achievement];
            if (!data) return null;

            return (
              <div
                key={achievement}
                className="relative group"
              >
                {/* Achievement Badge */}
                <div className={`bg-gradient-to-br ${data.color} p-3 rounded-lg shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-pointer`}>
                  <div className="flex flex-col items-center text-white">
                    {data.icon}
                    <span className="text-xs font-medium mt-1 text-center">
                      {achievement}
                    </span>
                  </div>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                    {data.description}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${data.color} rounded-lg blur-lg opacity-0 group-hover:opacity-50 transition-opacity`} />
              </div>
            );
          })}
        </div>

        {/* Progress to next achievement */}
        <div className="mt-4 pt-3 border-t border-amber-200/50">
          <div className="flex items-center justify-between text-xs text-amber-700">
            <span>Next: Timeline Master</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-amber-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
                  style={{ width: `${(achievements.length / 5) * 100}%` }}
                />
              </div>
              <span>{achievements.length}/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineAchievements;