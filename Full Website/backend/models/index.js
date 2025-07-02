// Database Models Index
// This file exports all database models for the BNC Training Platform

const User = require('./User');
const Module = require('./Module');
const Team = require('./Team');
const Achievement = require('./Achievement');
const Portfolio = require('./Portfolio');
const Event = require('./Event');
const Message = require('./Message');
const Notification = require('./Notification');
const MarketData = require('./MarketData');
const Leaderboard = require('./Leaderboard');
const SupportTicket = require('./SupportTicket');
const FAQ = require('./FAQ');
const SupportChat = require('./SupportChat');
const SupportResource = require('./SupportResource');
const ForumPost = require('./ForumPost');
const ForumComment = require('./ForumComment');
const AvatarShare = require('./AvatarShare');
const AvatarAnalytics = require('./AvatarAnalytics');
const Space = require('./Space');
const ShopItem = require('./ShopItem');
const UserPurchase = require('./UserPurchase');

module.exports = {
  User,
  Module,
  Team,
  Achievement,
  Portfolio,
  Event,
  Message,
  Notification,
  MarketData,
  Leaderboard,
  SupportTicket,
  FAQ,
  SupportChat,
  SupportResource,
  ForumPost,
  ForumComment,
  AvatarShare,
  AvatarAnalytics,
  Space,
  ShopItem,
  UserPurchase
};

// Model Categories for Reference:

// CORE USER MANAGEMENT
// - User: Complete user profiles with stats, achievements, preferences
// - Team: Team management with roles, goals, and social features
// - Achievement: Gamification system with rewards and progression

// LEARNING & EDUCATION  
// - Module: Training modules with chapters, quizzes, and progress tracking
// - Event: Virtual/in-person events, webinars, workshops

// SOCIAL & COMMUNICATION
// - Message: Direct messages and team chat with reactions and threads
// - Notification: Comprehensive notification system with multiple channels

// SIMULATION & TRADING
// - Portfolio: Virtual trading portfolios with positions and performance
// - MarketData: Real-time market data simulation with technical indicators

// GAMIFICATION & COMPETITION
// - Leaderboard: Dynamic rankings and competitions across multiple categories

// SUPPORT & HELP SYSTEM
// - SupportTicket: Advanced ticket system with SLA tracking and file attachments
// - FAQ: Searchable knowledge base with voting and analytics
// - SupportChat: Real-time chat support with agent assignment and rating
// - SupportResource: Documentation and training materials with access controls

// COMMUNITY & FORUM
// - ForumPost: Community discussion posts with voting, verification, and moderation
// - ForumComment: Threaded comments with solutions, mentions, and voting

// Key Features Implemented:
// ✅ Complete user management with roles and permissions
// ✅ Comprehensive learning module system with progress tracking
// ✅ Team collaboration with achievements and social features
// ✅ Real-time messaging and notification systems
// ✅ Advanced market simulation with portfolio management
// ✅ Multi-category leaderboard and ranking system
// ✅ Achievement and reward systems with multiple tiers
// ✅ Event management for virtual and in-person training
// ✅ Full localization support (English/French)
// ✅ Analytics and performance tracking
// ✅ Educational content management
// ✅ Audit trails and security features
// ✅ Advanced support system with tickets, chat, and resources
// ✅ Community forum with moderation and voting systems
// ✅ Real-time chat with WebSocket support
// ✅ Comprehensive knowledge base with search and analytics