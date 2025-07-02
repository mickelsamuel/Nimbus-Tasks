'use client';

import React from 'react';
import { Users, Trophy, MessageCircle, TrendingUp, Settings, Gamepad2, Search } from 'lucide-react';
import { TabType } from './TeamsLayout';

interface TeamTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TeamTabs: React.FC<TeamTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'myTeams', label: 'My Teams Hub', icon: Users, hasActivity: true },
    { id: 'discovery', label: 'Team Discovery', icon: Search, hasActivity: false },
    { id: 'arena', label: 'Team Arena', icon: Trophy, hasActivity: false },
    { id: 'analytics', label: 'Team Analytics', icon: TrendingUp, hasActivity: false },
    { id: 'communications', label: 'Communications', icon: MessageCircle, hasActivity: true },
    { id: 'games', label: 'Team Games', icon: Gamepad2, hasActivity: false },
    { id: 'management', label: 'Management', icon: Settings, hasActivity: false },
  ];

  return (
    <div className="collaboration-tabs">
      <div className="tab-navigation">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id as TabType)}
            >
              <IconComponent className="w-5 h-5" />
              {tab.label}
              {tab.hasActivity && <div className="tab-activity-indicator"></div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TeamTabs;