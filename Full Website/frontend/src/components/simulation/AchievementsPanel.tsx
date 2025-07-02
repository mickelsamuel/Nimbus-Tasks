'use client'

import { Trophy } from 'lucide-react'
import { Achievement } from '@/types/simulation'

interface AchievementsPanelProps {
  achievements: Achievement[]
}

export default function AchievementsPanel({ achievements }: AchievementsPanelProps) {

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-400/30 rounded-lg backdrop-blur-sm shadow-xl h-full overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-400/10 to-yellow-400/5 border-b border-yellow-400/30 p-4 flex justify-between items-center">
        <h3 className="font-bold text-yellow-400 uppercase tracking-wide">Achievements</h3>
        <div className="text-xs text-slate-400 font-mono">
          {achievements.filter(a => a.unlocked).length}/{achievements.length}
        </div>
      </div>
      
      <div className="overflow-y-auto h-full p-4 space-y-3">
        {achievements.map((achievement) => {
          const Icon = achievement.icon
          return (
            <div 
              key={achievement.id} 
              className={`p-4 border border-yellow-400/20 rounded-lg flex items-center gap-4 transition-all duration-200 ${
                achievement.unlocked 
                  ? 'bg-yellow-400/5 border-yellow-400/30 hover:bg-yellow-400/10' 
                  : 'opacity-50 bg-slate-900/30 hover:bg-slate-900/50'
              }`}
            >
              <div className={`p-3 rounded-lg ${
                achievement.unlocked 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-slate-700/50 border border-slate-600/30'
              }`}>
                <Icon className={`h-5 w-5 ${
                  achievement.unlocked ? 'text-green-400' : 'text-slate-500'
                }`} />
              </div>
              <div className="flex-1">
                <div className={`text-sm font-bold font-mono ${
                  achievement.unlocked ? 'text-yellow-400' : 'text-slate-500'
                }`}>
                  {achievement.title}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  {achievement.description}
                </div>
              </div>
              {achievement.unlocked && (
                <Trophy className="h-5 w-5 text-yellow-400" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}