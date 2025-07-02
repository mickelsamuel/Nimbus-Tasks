'use client';

import React, { memo } from 'react';
import Image from 'next/image';

interface TeamMember {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    avatar?: string;
    lastActivity?: string;
  };
  role: string;
  joinedAt: string;
  status: 'active' | 'inactive';
}

interface MemberActivity3DProps {
  members?: TeamMember[];
}

const MemberActivity3D = memo(({ members = [] }: MemberActivity3DProps) => {
  // Generate 3D positions for members
  const generateMemberPositions = (memberCount: number) => {
    const positions = [];
    const radius = 150;
    const angleStep = (Math.PI * 2) / Math.max(memberCount, 4);
    
    for (let i = 0; i < memberCount; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * radius + 200;
      const y = Math.sin(angle) * radius + 150;
      const z = Math.sin(angle * 2) * 20;
      const rotation = angle * (180 / Math.PI);
      
      positions.push({
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotation}deg)`
      });
    }
    
    return positions;
  };

  const positions = generateMemberPositions(members.length);

  // Determine activity level based on last activity
  const getActivityLevel = (lastActivity?: string) => {
    if (!lastActivity) return 'idle';
    
    const lastActiveTime = new Date(lastActivity).getTime();
    const now = Date.now();
    const hoursSinceActivity = (now - lastActiveTime) / (1000 * 60 * 60);
    
    if (hoursSinceActivity < 1) return 'active';
    if (hoursSinceActivity < 24) return 'moderate';
    return 'idle';
  };

  const membersWithPositions = members.slice(0, 8).map((member, index) => ({
    ...member,
    activity: getActivityLevel(member.userId.lastActivity),
    transform: positions[index]?.transform || `translate3d(200px, 150px, 0px)`,
    displayName: member.userId.firstName || 'Unknown'
  }));

  const staticConnections = [
    {
      transform: 'translate3d(120px, 80px, 0px) rotateZ(35deg) scaleX(1.2)',
      activity: 'active'
    },
    {
      transform: 'translate3d(200px, 160px, 0px) rotateZ(-45deg) scaleX(0.8)',
      activity: 'moderate'
    },
    {
      transform: 'translate3d(80px, 200px, 0px) rotateZ(25deg) scaleX(1.5)',
      activity: 'active'
    }
  ];

  // Generate connections between active members
  const generateConnections = () => {
    const activeMembers = membersWithPositions.filter(m => m.activity === 'active');
    return activeMembers.slice(0, 3).map((member, index) => ({
      transform: `${member.transform} rotateZ(${25 + index * 20}deg) scaleX(${1 + index * 0.2})`,
      activity: member.activity
    }));
  };

  const connections = generateConnections();

  // Generate fallback avatar based on name
  const generateAvatarUrl = (firstName: string) => {
    const initials = firstName.charAt(0).toUpperCase();
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#3B82F6"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="14" font-weight="bold">
          ${initials}
        </text>
      </svg>
    `)}`;
  };

  return (
    <div className="member-activity-3d">
      {/* Member Activity Nodes */}
      {membersWithPositions.map((member) => (
        <div
          key={member._id}
          className={`activity-node ${member.activity}`}
          style={{ 
            transform: member.transform,
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="node-avatar">
            <Image 
              src={member.userId.avatar || generateAvatarUrl(member.displayName)} 
              alt={member.displayName}
              width={32} 
              height={32}
              onError={(e) => {
                // Fallback to generated avatar if image fails
                e.currentTarget.src = generateAvatarUrl(member.displayName);
              }}
            />
          </div>
          <div className="activity-pulse"></div>
          <div className="activity-trail"></div>
        </div>
      ))}

      {/* Connection Lines */}
      {connections.map((connection, index) => (
        <div
          key={index}
          className={`connection-line ${connection.activity}`}
          style={{ 
            transform: connection.transform,
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        ></div>
      ))}
    </div>
  );
});

MemberActivity3D.displayName = 'MemberActivity3D';

export default MemberActivity3D;