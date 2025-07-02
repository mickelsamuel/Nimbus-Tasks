#!/usr/bin/env node

/**
 * Generate comprehensive database documentation
 * Shows all users, teams, achievements, and their states
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/database');
const { User, Team, Achievement } = require('../models');

async function generateDatabaseDocs() {
  try {
    console.log('📖 Generating database documentation...');
    
    await connectDB();
    
    // Fetch all data
    const users = await User.find({}).sort({ role: 1, firstName: 1 });
    const teams = await Team.find({}).populate('leader', 'firstName lastName email').sort({ name: 1 });
    const achievements = await Achievement.find({}).sort({ category: 1, name: 1 });
    
    let markdown = `# BNC Training Platform - Database Documentation

Generated on: ${new Date().toLocaleString()}

## 📊 Database Overview

- **Total Users:** ${users.length}
- **Total Teams:** ${teams.length}
- **Total Achievements:** ${achievements.length}

## 🔑 User Accounts & Login Credentials

### Admin Account (1)
| Email | Password | Name | Department | Status |
|-------|----------|------|------------|--------|
`;

    // Admin users
    const adminUsers = users.filter(u => u.role === 'admin');
    adminUsers.forEach(user => {
      const flowStatus = getFlowStatus(user);
      markdown += `| ${user.email} | Admin123! | ${user.firstName} ${user.lastName} | ${user.department} | ${flowStatus} |\n`;
    });

    markdown += `\n### Manager Accounts (${users.filter(u => u.role === 'manager').length})
| Email | Password | Name | Department | Employee ID | Flow Status |
|-------|----------|------|------------|-------------|-------------|
`;

    // Manager users
    const managerUsers = users.filter(u => u.role === 'manager');
    managerUsers.forEach(user => {
      const flowStatus = getFlowStatus(user);
      markdown += `| ${user.email} | Manager123! | ${user.firstName} ${user.lastName} | ${user.department} | ${user.employeeId} | ${flowStatus} |\n`;
    });

    markdown += `\n### Employee Accounts (${users.filter(u => u.role === 'employee').length})
*Note: All employee passwords are "Employee123!"*

| Email | Name | Department | Employee ID | Flow Status | Level | Points |
|-------|------|------------|-------------|-------------|--------|--------|
`;

    // Employee users (showing first 50 to keep manageable)
    const employeeUsers = users.filter(u => u.role === 'employee').slice(0, 50);
    employeeUsers.forEach(user => {
      const flowStatus = getFlowStatus(user);
      markdown += `| ${user.email} | ${user.firstName} ${user.lastName} | ${user.department} | ${user.employeeId} | ${flowStatus} | ${user.stats.level} | ${user.stats.totalPoints} |\n`;
    });

    if (users.filter(u => u.role === 'employee').length > 50) {
      markdown += `\n*... and ${users.filter(u => u.role === 'employee').length - 50} more employee accounts*\n`;
    }

    // User Flow States Analysis
    markdown += `\n## 👥 User Flow Analysis

### User States Distribution
`;

    const flowStates = {
      'Just Registered': users.filter(u => !u.hasPolicyAccepted && !u.selectedMode && !u.hasCompletedAvatarSetup).length,
      'Policy Accepted': users.filter(u => u.hasPolicyAccepted && !u.selectedMode && !u.hasCompletedAvatarSetup).length,
      'Mode Selected': users.filter(u => u.hasPolicyAccepted && u.selectedMode && !u.hasCompletedAvatarSetup).length,
      'Fully Onboarded': users.filter(u => u.hasPolicyAccepted && u.selectedMode && u.hasCompletedAvatarSetup).length
    };

    Object.entries(flowStates).forEach(([state, count]) => {
      const percentage = ((count / users.length) * 100).toFixed(1);
      markdown += `- **${state}:** ${count} users (${percentage}%)\n`;
    });

    // Department breakdown
    markdown += `\n### Users by Department
`;
    const departmentCounts = {};
    users.forEach(user => {
      departmentCounts[user.department] = (departmentCounts[user.department] || 0) + 1;
    });

    Object.entries(departmentCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([dept, count]) => {
        markdown += `- **${dept}:** ${count} users\n`;
      });

    // Mode selection breakdown
    markdown += `\n### Mode Selection (Users who selected a mode)
`;
    const gamifiedUsers = users.filter(u => u.selectedMode === 'gamified').length;
    const standardUsers = users.filter(u => u.selectedMode === 'standard').length;
    const noModeUsers = users.filter(u => !u.selectedMode).length;

    markdown += `- **Gamified Mode:** ${gamifiedUsers} users\n`;
    markdown += `- **Standard Mode:** ${standardUsers} users\n`;
    markdown += `- **No Mode Selected:** ${noModeUsers} users\n`;

    // Teams section
    markdown += `\n## 👥 Teams & Leadership

### Team Overview
| Team Name | Leader | Department | Category | Members | Points | Level |
|-----------|--------|------------|----------|---------|--------|-------|
`;

    teams.forEach(team => {
      const leader = team.leader;
      const leaderName = leader ? `${leader.firstName} ${leader.lastName}` : 'Unknown';
      const leaderEmail = leader ? leader.email : 'N/A';
      markdown += `| ${team.name} | ${leaderName} (${leaderEmail}) | ${team.department} | ${team.category} | ${team.stats.memberCount} | ${team.stats.totalPoints} | ${team.stats.level} |\n`;
    });

    // Achievements section
    markdown += `\n## 🏆 Achievements System

### Achievement Categories
`;

    const achievementsByCategory = {};
    achievements.forEach(achievement => {
      if (!achievementsByCategory[achievement.category]) {
        achievementsByCategory[achievement.category] = [];
      }
      achievementsByCategory[achievement.category].push(achievement);
    });

    Object.entries(achievementsByCategory).forEach(([category, categoryAchievements]) => {
      markdown += `\n#### ${category} (${categoryAchievements.length} achievements)\n`;
      markdown += `| Name | Tier | Rarity | Type | Points | Description |\n`;
      markdown += `|------|------|--------|------|--------|-------------|\n`;
      
      categoryAchievements.slice(0, 10).forEach(achievement => {
        markdown += `| ${achievement.name} | ${achievement.tier} | ${achievement.rarity} | ${achievement.type} | ${achievement.rewards.points} | ${achievement.description.substring(0, 50)}... |\n`;
      });
      
      if (categoryAchievements.length > 10) {
        markdown += `*... and ${categoryAchievements.length - 10} more ${category.toLowerCase()} achievements*\n`;
      }
    });

    // Test scenarios
    markdown += `\n## 🧪 Testing Scenarios

### User Flow Testing
You can test different user flows with these accounts:

#### 1. Just Registered Users (Need to accept policy)
`;
    const justRegistered = users.filter(u => !u.hasPolicyAccepted).slice(0, 5);
    justRegistered.forEach(user => {
      markdown += `- **${user.email}** (${user.role}) - Password: ${getPassword(user.role)}\n`;
    });

    markdown += `\n#### 2. Policy Accepted Users (Need to select mode)
`;
    const policyAccepted = users.filter(u => u.hasPolicyAccepted && !u.selectedMode).slice(0, 5);
    policyAccepted.forEach(user => {
      markdown += `- **${user.email}** (${user.role}) - Password: ${getPassword(user.role)}\n`;
    });

    markdown += `\n#### 3. Mode Selected Users (Need avatar setup)
`;
    const modeSelected = users.filter(u => u.hasPolicyAccepted && u.selectedMode && !u.hasCompletedAvatarSetup).slice(0, 5);
    modeSelected.forEach(user => {
      markdown += `- **${user.email}** (${user.role}, ${user.selectedMode} mode) - Password: ${getPassword(user.role)}\n`;
    });

    markdown += `\n#### 4. Fully Onboarded Users (Complete experience)
`;
    const fullyOnboarded = users.filter(u => u.hasPolicyAccepted && u.selectedMode && u.hasCompletedAvatarSetup).slice(0, 5);
    fullyOnboarded.forEach(user => {
      markdown += `- **${user.email}** (${user.role}, ${user.selectedMode} mode) - Password: ${getPassword(user.role)}\n`;
    });

    // Role-based testing
    markdown += `\n### Role-Based Testing

#### Admin Features Testing
- **Login:** admin@bnc.ca / Admin123!
- **Features:** Full admin dashboard, user management, system settings

#### Manager Features Testing
`;
    managerUsers.slice(0, 3).forEach(manager => {
      markdown += `- **${manager.email}** / Manager123! (${manager.department})\n`;
    });

    markdown += `\n#### Employee Features Testing
`;
    employeeUsers.slice(0, 5).forEach(employee => {
      markdown += `- **${employee.email}** / Employee123! (${employee.department}, Level ${employee.stats.level})\n`;
    });

    // Team testing
    markdown += `\n### Team Features Testing

#### Teams by Department
`;
    const teamsByDept = {};
    teams.forEach(team => {
      if (!teamsByDept[team.department]) {
        teamsByDept[team.department] = [];
      }
      teamsByDept[team.department].push(team);
    });

    Object.entries(teamsByDept).forEach(([dept, deptTeams]) => {
      markdown += `\n**${dept} Teams:**\n`;
      deptTeams.forEach(team => {
        const leader = team.leader;
        markdown += `- **${team.name}** - Leader: ${leader.email} (${team.stats.memberCount} members)\n`;
      });
    });

    // Database maintenance
    markdown += `\n## 🛠️ Database Maintenance

### Regenerating Data
To refresh the database with new test data:
\`\`\`bash
npm run populate-basic
\`\`\`

### Available Scripts
- \`npm run populate-basic\` - Basic population (recommended)
- \`npm run populate-db\` - Full population (experimental)
- \`npm run test-populate\` - In-memory testing

### Database Connection
- **Environment:** ${process.env.NODE_ENV || 'development'}
- **Database:** ${process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Local MongoDB'}

### Notes
- All passwords follow the pattern: Role + "123!"
- User data includes realistic departments, levels, and progression
- Teams have proper leader-member relationships
- Achievements cover all major platform activities
- User flow states allow testing of the complete onboarding process

---

*Generated by BNC Training Platform Database Documentation Script*
*Last updated: ${new Date().toISOString()}*
`;

    // Write to file
    const outputPath = path.join(__dirname, 'DATABASE_OVERVIEW.md');
    fs.writeFileSync(outputPath, markdown);
    
    console.log(`✅ Documentation generated: ${outputPath}`);
    console.log(`📄 File size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
    
  } catch (error) {
    console.error('❌ Error generating documentation:', error);
  } finally {
    await mongoose.connection.close();
  }
}

function getFlowStatus(user) {
  if (!user.hasPolicyAccepted) {
    return 'Just Registered';
  }
  if (!user.selectedMode) {
    return 'Policy Accepted';
  }
  if (!user.hasCompletedAvatarSetup) {
    return `Mode Selected (${user.selectedMode})`;
  }
  return `Fully Onboarded (${user.selectedMode})`;
}

function getPassword(role) {
  switch (role) {
    case 'admin': return 'Admin123!';
    case 'manager': return 'Manager123!';
    case 'employee': return 'Employee123!';
    default: return 'Employee123!';
  }
}

if (require.main === module) {
  generateDatabaseDocs();
}

module.exports = generateDatabaseDocs;