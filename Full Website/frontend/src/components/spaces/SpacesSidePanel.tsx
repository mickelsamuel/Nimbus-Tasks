'use client'

import { 
  Trophy, 
  Users, 
  Calendar,
  Settings,
  Coffee
} from 'lucide-react'
import { Achievement } from '@/types'

interface ActivityItem {
  id: string;
  type: 'meeting' | 'achievement' | 'social';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

interface SpacesSidePanelProps {
  achievements: Achievement[];
  recentActivity?: ActivityItem[];
}

export default function SpacesSidePanel({ achievements }: SpacesSidePanelProps) {
  return (
    <div className="spaces-side-panel w-72 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Achievements</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </div>
          </div>
          
          <div className="space-y-3">
            {achievements.map((achievement) => {
              const AchievementIcon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-xl border transition-all ${
                    achievement.unlocked
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                    }`}>
                      <AchievementIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Social Activity */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Team Meeting</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Sarah led a training session in Conference Hall
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">2 minutes ago</div>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Achievement</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                You unlocked &quot;Meeting Maestro&quot;
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">5 minutes ago</div>
            </div>
            
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-1">
                <Coffee className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Networking</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                3 new connections made in Knowledge Café
              </div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">12 minutes ago</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-left hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-red-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Schedule Meeting</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Book a space for your team</div>
                </div>
              </div>
            </button>
            
            <button className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Find Colleagues</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">See who&apos;s online in spaces</div>
                </div>
              </div>
            </button>
            
            <button className="w-full p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-left hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Customize Avatar</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Personalize your presence</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}