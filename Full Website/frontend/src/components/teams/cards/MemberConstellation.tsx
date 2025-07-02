'use client';

import React from 'react';
import { TeamMember } from '../../../types/team';
import { TeamMemberAvatar } from '@/components/ui/UserAvatar';

interface MemberConstellationProps {
  members: TeamMember[];
}

const MemberConstellation: React.FC<MemberConstellationProps> = ({ members }) => {
  const leader = members.find(member => member.isLeader);
  const otherMembers = members.filter(member => !member.isLeader);

  return (
    <div className="member-constellation">
      <div className="constellation-center">
        {leader && (
          <div className="member-avatar main team-leader-avatar">
            <TeamMemberAvatar
              user={{
                avatar: leader.avatar,
                firstName: leader.name?.split(' ')[0] || '',
                lastName: leader.name?.split(' ')[1] || '',
                role: leader.role,
                level: leader.level || 1,
                isOnline: leader.isOnline
              }}
              size="lg"
              className="w-full h-full"
            />
            <div className="activity-ring"></div>
          </div>
        )}
      </div>
      <div className="constellation-members">
        {otherMembers.map((member, index) => (
          <div 
            key={member.id} 
            className="member-avatar member-orbit"
            style={{ animationDelay: `${index * 5}s` }}
          >
            <TeamMemberAvatar
              user={{
                avatar: member.avatar,
                firstName: member.name?.split(' ')[0] || '',
                lastName: member.name?.split(' ')[1] || '',
                role: member.role,
                level: member.level || 1,
                isOnline: member.isOnline
              }}
              size="md"
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberConstellation;