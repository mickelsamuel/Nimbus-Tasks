'use client';

import React, { useState } from 'react';
import TeamHeader from './TeamHeader';
import TeamTabs from './TeamTabs';
import MyTeamsTab from './tabs/MyTeamsTab';
import DiscoveryTab from './tabs/DiscoveryTab';
import ArenaTab from './tabs/ArenaTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import CommunicationsTab from './tabs/CommunicationsTab';
import GamesTab from './tabs/GamesTab';
import ManagementTab from './tabs/ManagementTab';
import CreateTeamWizard from './CreateTeamWizard';

export type TabType = 'myTeams' | 'discovery' | 'arena' | 'analytics' | 'communications' | 'games' | 'management';

const TeamsLayout = () => {
  const [activeTab, setActiveTab] = useState<TabType>('myTeams');
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'myTeams':
        return <MyTeamsTab />;
      case 'discovery':
        return <DiscoveryTab />;
      case 'arena':
        return <ArenaTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'communications':
        return <CommunicationsTab />;
      case 'games':
        return <GamesTab />;
      case 'management':
        return <ManagementTab />;
      default:
        return <MyTeamsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 team-dark-theme">
      <div className="max-w-7xl mx-auto">
        <TeamHeader onCreateTeam={() => setShowCreateWizard(true)} />
        <TeamTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="tab-content">
          {renderTabContent()}
        </div>

        {showCreateWizard && (
          <CreateTeamWizard onClose={() => setShowCreateWizard(false)} />
        )}
      </div>
    </div>
  );
};

export default TeamsLayout;