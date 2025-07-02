'use client'

import { useState, useEffect, useRef } from 'react'
import { Users, MessageCircle, Eye, ThumbsUp, Share2, UserPlus, Crown, Shield } from 'lucide-react'
import { AvatarConfiguration } from '@/lib/avatarApi'

interface CollaborationUser {
  id: string
  name: string
  avatar: string
  role: 'viewer' | 'collaborator' | 'owner'
  isOnline: boolean
  lastSeen: Date
  currentAction?: string
}

interface CollaborationComment {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: Date
  position?: { x: number; y: number }
  resolved: boolean
}


interface AvatarCollaborationProps {
  avatarConfiguration: AvatarConfiguration
  isOwner: boolean
  onConfigurationChange: (config: AvatarConfiguration) => void
}

export default function AvatarCollaboration({ 
  avatarConfiguration,
  isOwner, 
  onConfigurationChange 
}: AvatarCollaborationProps) {
  const [collaborators, setCollaborators] = useState<CollaborationUser[]>([])
  const [comments, setComments] = useState<CollaborationComment[]>([])
  const [isCollaborationActive, setIsCollaborationActive] = useState(false)
  const [currentComment, setCurrentComment] = useState('')
  const [showComments, setShowComments] = useState(true)
  const [viewers, setViewers] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')

  // Initialize collaboration data
  useEffect(() => {
    // TODO: Replace with real WebSocket connection when backend supports it
    setConnectionStatus('disconnected')
    
    // Initialize with mock data
    initializeMockData()
  }, [isOwner])

  const initializeMockData = () => {
    // Mock data will be set in the separate useEffect below
  }







  // Initialize mock data on component mount with current avatar configuration
  useEffect(() => {
    console.log('Initializing collaboration with avatar configuration:', avatarConfiguration.id)
    const mockCollaborators: CollaborationUser[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: 'https://api.readyplayer.me/v1/avatars/63c200a6c30b0f84b6add3ce.png',
        role: 'collaborator',
        isOnline: true,
        lastSeen: new Date(),
        currentAction: 'Adjusting hair color'
      },
      {
        id: '2',
        name: 'Mike Chen',
        avatar: 'https://api.readyplayer.me/v1/avatars/63c200a6c30b0f84b6add3ca.png',
        role: 'viewer',
        isOnline: true,
        lastSeen: new Date(),
        currentAction: 'Viewing pose selection'
      },
      {
        id: '3',
        name: 'Lisa Williams',
        avatar: 'https://api.readyplayer.me/v1/avatars/63c200a6c30b0f84b6add3cf.png',
        role: 'collaborator',
        isOnline: false,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
      }
    ];

    const mockComments: CollaborationComment[] = [
      {
        id: '1',
        userId: '1',
        userName: 'Sarah Johnson',
        content: 'This hair color looks great for banking professional standards!',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        resolved: false
      },
      {
        id: '2',
        userId: '2',
        userName: 'Mike Chen',
        content: 'Consider adjusting the pose confidence to 90% for executive presence.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        resolved: true
      }
    ];

    setCollaborators(mockCollaborators);
    setComments(mockComments);
    setViewers(Math.floor(Math.random() * 15) + 5);
  }, [avatarConfiguration.id]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (isCollaborationActive) {
      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/avatar-collaboration`)
      wsRef.current = ws

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'join',
          avatarId: 'current-avatar-id',
          user: { id: 'current-user-id', name: 'Current User' }
        }))
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        switch (data.type) {
          case 'user-joined':
            setCollaborators(prev => [...prev, data.user])
            break
          case 'user-left':
            setCollaborators(prev => prev.filter(u => u.id !== data.userId))
            break
          case 'configuration-changed':
            if (!isOwner && data.userId !== 'current-user-id') {
              onConfigurationChange(data.configuration)
            }
            break
          case 'comment-added':
            setComments(prev => [...prev, data.comment])
            break
          case 'viewer-count':
            setViewers(data.count)
            break
        }
      }

      return () => {
        ws.close()
      }
    }
  }, [isCollaborationActive, isOwner, onConfigurationChange])

  const handleStartCollaboration = () => {
    setIsCollaborationActive(true)
  }

  const handleStopCollaboration = () => {
    setIsCollaborationActive(false)
    if (wsRef.current) {
      wsRef.current.close()
    }
  }

  const handleAddComment = () => {
    if (currentComment.trim()) {
      const newComment: CollaborationComment = {
        id: Date.now().toString(),
        userId: 'current-user-id',
        userName: 'Current User',
        content: currentComment,
        timestamp: new Date(),
        resolved: false
      }

      setComments(prev => [...prev, newComment])
      setCurrentComment('')

      // Send to WebSocket
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'comment-added',
          comment: newComment
        }))
      }
    }
  }

  const handleResolveComment = (commentId: string) => {
    setComments(prev => 
      prev.map(c => c.id === commentId ? { ...c, resolved: true } : c)
    )
  }

  const handleInviteCollaborator = () => {
    // This would open a modal to invite team members
    console.log('Invite collaborator modal would open here')
  }

  return (
    <div className="collaboration-panel">
      {/* Collaboration Header */}
      <div className="collaboration-header">
        <div className="collaboration-title">
          <Users className="w-5 h-5 text-blue-400" />
          <span className="text-white font-semibold">Team Collaboration</span>
          
          {/* Connection Status Indicator */}
          <div className={`connection-status ${connectionStatus}`}>
            <div className="status-dot"></div>
            <span className="status-text">
              {connectionStatus === 'connected' ? 'Live' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
            </span>
          </div>
          
          {isCollaborationActive && connectionStatus === 'connected' && (
            <div className="live-indicator">
              <div className="live-dot"></div>
              <span>Synced</span>
            </div>
          )}
        </div>

        <div className="collaboration-actions">
          {!isCollaborationActive ? (
            <button 
              onClick={handleStartCollaboration}
              className="collab-btn primary"
            >
              <Share2 className="w-4 h-4" />
              Start Session
            </button>
          ) : (
            <button 
              onClick={handleStopCollaboration}
              className="collab-btn secondary"
            >
              End Session
            </button>
          )}
        </div>
      </div>

      {/* Viewers Count */}
      <div className="viewers-count">
        <Eye className="w-4 h-4 text-purple-400" />
        <span className="text-white text-sm">{viewers} viewing</span>
      </div>

      {/* Active Collaborators */}
      {isCollaborationActive && (
        <div className="collaborators-section">
          <div className="section-header">
            <h4 className="section-title">Active Collaborators</h4>
            {isOwner && (
              <button 
                onClick={handleInviteCollaborator}
                className="invite-btn"
              >
                <UserPlus className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="collaborators-list">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="collaborator-item">
                <div className="collaborator-avatar">
                  <div className="avatar-placeholder">
                    {collaborator.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {collaborator.role === 'owner' && (
                    <Crown className="w-3 h-3 text-yellow-400 role-icon" />
                  )}
                  {collaborator.role === 'collaborator' && (
                    <Shield className="w-3 h-3 text-blue-400 role-icon" />
                  )}
                  <div className={`status-dot ${collaborator.isOnline ? 'online' : 'offline'}`} />
                </div>
                
                <div className="collaborator-info">
                  <div className="collaborator-name">{collaborator.name}</div>
                  <div className="collaborator-action">
                    {collaborator.currentAction || (collaborator.isOnline ? 'Online' : 'Offline')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="comments-section">
        <div className="section-header">
          <h4 className="section-title">
            <MessageCircle className="w-4 h-4" />
            Feedback & Comments
          </h4>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="toggle-btn"
          >
            {showComments ? 'Hide' : 'Show'}
          </button>
        </div>

        {showComments && (
          <>
            {/* Add Comment */}
            <div className="add-comment">
              <textarea
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                placeholder="Add feedback or suggestions..."
                className="comment-input"
                rows={3}
              />
              <button 
                onClick={handleAddComment}
                className="comment-submit"
                disabled={!currentComment.trim()}
              >
                <MessageCircle className="w-4 h-4" />
                Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="comments-list">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className={`comment-item ${comment.resolved ? 'resolved' : ''}`}
                >
                  <div className="comment-header">
                    <div className="comment-author">
                      <div className="author-avatar">
                        {comment.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="author-name">{comment.userName}</span>
                    </div>
                    <div className="comment-timestamp">
                      {comment.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="comment-content">{comment.content}</div>
                  
                  {!comment.resolved && (
                    <div className="comment-actions">
                      <button 
                        onClick={() => handleResolveComment(comment.id)}
                        className="resolve-btn"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Collaboration Styles */}
      <style jsx>{`
        .collaboration-panel {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 20px;
          margin-bottom: 20px;
        }

        .collaboration-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .collaboration-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          border: 1px solid;
        }

        .connection-status.connected {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgba(34, 197, 94, 0.4);
          color: #22c55e;
        }

        .connection-status.connecting {
          background: rgba(251, 191, 36, 0.2);
          border-color: rgba(251, 191, 36, 0.4);
          color: #fbbf24;
        }

        .connection-status.disconnected {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.4);
          color: #ef4444;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .connection-status.connected .status-dot {
          background: #22c55e;
        }

        .connection-status.connecting .status-dot {
          background: #fbbf24;
          animation: pulse 1s infinite;
        }

        .connection-status.disconnected .status-dot {
          background: #ef4444;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.4);
          border-radius: 12px;
          padding: 2px 8px;
          margin-left: 8px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .live-indicator span {
          color: #22c55e;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .collab-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .collab-btn.primary {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        }

        .collab-btn.primary:hover {
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
        }

        .collab-btn.secondary {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #f87171;
        }

        .viewers-count {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 15px;
          padding: 8px 12px;
          background: rgba(147, 51, 234, 0.1);
          border: 1px solid rgba(147, 51, 234, 0.2);
          border-radius: 8px;
        }

        .collaborators-section,
        .comments-section {
          margin-bottom: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .section-title {
          color: white;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .invite-btn,
        .toggle-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 4px 8px;
          color: white;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .invite-btn:hover,
        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .collaborators-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .collaborator-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .collaborator-avatar {
          position: relative;
        }

        .avatar-placeholder {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .role-icon {
          position: absolute;
          top: -2px;
          right: -2px;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 50%;
          padding: 2px;
        }

        .status-dot {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 2px solid rgba(0, 0, 0, 0.8);
        }

        .status-dot.online {
          background: #22c55e;
        }

        .status-dot.offline {
          background: #6b7280;
        }

        .collaborator-info {
          flex: 1;
        }

        .collaborator-name {
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .collaborator-action {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.7rem;
          font-style: italic;
        }

        .add-comment {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 15px;
        }

        .comment-input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 10px;
          color: white;
          font-size: 0.8rem;
          resize: vertical;
          min-height: 60px;
        }

        .comment-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .comment-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .comment-submit {
          align-self: flex-end;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .comment-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .comment-submit:not(:disabled):hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 300px;
          overflow-y: auto;
        }

        .comment-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px;
        }

        .comment-item.resolved {
          opacity: 0.6;
          border-color: rgba(34, 197, 94, 0.3);
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .comment-author {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .author-avatar {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.6rem;
          font-weight: 600;
        }

        .author-name {
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .comment-timestamp {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.7rem;
        }

        .comment-content {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.8rem;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .comment-actions {
          display: flex;
          gap: 8px;
        }

        .resolve-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.4);
          border-radius: 4px;
          color: #22c55e;
          font-size: 0.7rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .resolve-btn:hover {
          background: rgba(34, 197, 94, 0.3);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}