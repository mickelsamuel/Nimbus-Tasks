export const adminStyles = `
  .admin-dark-theme {
    --primary-bg: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
    --accent-red: #E01A1A;
    --success-green: #28a745;
    --warning-amber: #ffc107;
    --info-blue: #17a2b8;
    --glass-effect: rgba(255,255,255,0.05);
    --text-primary: rgba(255,255,255,0.95);
    --text-secondary: rgba(255,255,255,0.7);
  }

  .executive-metric-card {
    background: linear-gradient(145deg,
      rgba(255,255,255,0.12) 0%,
      rgba(255,255,255,0.02) 100%);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(224,26,26,0.2);
    box-shadow:
      0 4px 20px rgba(0,0,0,0.1),
      inset 0 1px 0 rgba(255,255,255,0.1);
    transition: all 0.3s ease;
  }

  .executive-metric-card:hover {
    transform: translateY(-4px);
    box-shadow:
      0 8px 30px rgba(0,0,0,0.15),
      inset 0 1px 0 rgba(255,255,255,0.2);
  }

  .metric-value {
    font-size: 3.5rem;
    font-weight: 900;
    background: linear-gradient(135deg, #E01A1A 0%, #FFD700 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 30px rgba(224,26,26,0.3);
  }

  .personnel-search-command {
    background: linear-gradient(135deg,
      rgba(13,17,23,0.95) 0%,
      rgba(22,27,34,0.95) 100%);
    border: 1px solid rgba(224,26,26,0.3);
    border-radius: 12px;
    padding: 24px;
    backdrop-filter: blur(20px);
  }

  .search-interface {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 16px;
    align-items: end;
  }

  .biometric-scanner {
    animation: biometricScan 3s ease-in-out infinite;
  }

  @keyframes biometricScan {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(224,26,26,0.3);
      border-color: rgba(224,26,26,0.5);
    }
    50% { 
      box-shadow: 0 0 40px rgba(224,26,26,0.6);
      border-color: rgba(224,26,26,0.8);
    }
  }

  .holographic-bg {
    background: 
      radial-gradient(ellipse at top, rgba(224,26,26,0.15) 0%, transparent 50%),
      linear-gradient(90deg, transparent 0%, rgba(224,26,26,0.05) 50%, transparent 100%);
  }

  .terminal-feed {
    font-family: 'Courier New', monospace;
    background: rgba(0,0,0,0.8);
    border: 1px solid rgba(0,255,0,0.3);
    color: #00ff00;
  }

  /* Responsive Design Improvements */
  @media (max-width: 1024px) {
    .search-interface {
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
  }

  @media (max-width: 768px) {
    .search-interface {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    
    .metric-value {
      font-size: 2.5rem;
    }
    
    .executive-metric-card {
      padding: 1rem;
    }
    
    .personnel-search-command {
      padding: 20px;
    }
  }

  @media (max-width: 640px) {
    .personnel-search-command {
      padding: 16px;
    }
    
    .metric-value {
      font-size: 2rem;
    }
    
    .executive-metric-card {
      padding: 0.75rem;
    }
    
    .executive-metric-card h3 {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .metric-value {
      font-size: 1.75rem;
    }
    
    .search-interface input,
    .search-interface select,
    .search-interface button {
      padding: 0.75rem;
      font-size: 0.875rem;
    }
  }

  /* Enhanced Glass Effects */
  .glass-card {
    background: linear-gradient(145deg,
      rgba(255,255,255,0.15) 0%,
      rgba(255,255,255,0.05) 100%);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }

  /* Improved Animations - Optimized for Performance */
  .admin-fade-in {
    animation: adminFadeIn 0.4s ease-out forwards;
  }

  .admin-slide-up {
    animation: adminSlideUp 0.5s ease-out forwards;
  }

  /* Reduced motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    .admin-fade-in,
    .admin-slide-up {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }

  @keyframes adminFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes adminSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Focus States for Accessibility */
  .admin-focus-ring:focus {
    outline: none;
    ring: 2px;
    ring-color: rgba(224,26,26,0.5);
    ring-offset: 2px;
    ring-offset-color: rgba(0,0,0,0.1);
  }

  /* Loading States */
  .admin-loading {
    position: relative;
    overflow: hidden;
  }

  .admin-loading::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'from-green-500 to-emerald-600'
    case 'warning':
      return 'from-yellow-500 to-amber-600'
    case 'critical':
      return 'from-red-500 to-rose-600'
    default:
      return 'from-gray-500 to-slate-600'
  }
}

export const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'from-red-500 to-red-600'
    case 'manager': return 'from-blue-500 to-blue-600'
    case 'employee': return 'from-green-500 to-green-600'
    default: return 'from-gray-500 to-gray-600'
  }
}

export const getUserStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500'
    case 'inactive': return 'bg-yellow-500'
    case 'suspended': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'from-green-500 to-green-600'
    case 'intermediate': return 'from-yellow-500 to-yellow-600'
    case 'advanced': return 'from-red-500 to-red-600'
    default: return 'from-gray-500 to-gray-600'
  }
}

export const getModuleStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500'
    case 'draft': return 'bg-yellow-500'
    case 'archived': return 'bg-gray-500'
    default: return 'bg-gray-500'
  }
}

export const getActivityIcon = (type: string) => {
  switch (type) {
    case 'completion': return 'CheckCircle'
    case 'warning': return 'AlertTriangle'
    case 'social': return 'Users'
    case 'achievement': return 'Trophy'
    case 'system': return 'Settings'
    default: return 'Info'
  }
}

export const getActivityColor = (type: string) => {
  switch (type) {
    case 'completion': return 'text-green-500'
    case 'warning': return 'text-yellow-500'
    case 'social': return 'text-blue-500'
    case 'achievement': return 'text-purple-500'
    case 'system': return 'text-gray-500'
    default: return 'text-slate-500'
  }
}