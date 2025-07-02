'use client'

export default function FriendsPageStyles() {
  return (
    <style jsx global>{`
      /* Professional Friends Page Theme */
      .professional-dark-theme {
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0d1421 100%);
        min-height: 100vh;
      }

      .professional-light-theme {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
        min-height: 100vh;
      }

      /* Header Styles - LIGHT MODE DEFAULT */
      .social-hub-header {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 150, 136, 0.3);
        border-radius: 20px;
        margin-bottom: 2rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        color: #1e293b;
      }

      /* Header Styles - DARK MODE */
      .dark .social-hub-header {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(0, 150, 136, 0.3);
        box-shadow: none;
        color: rgba(255, 255, 255, 0.95);
      }

      /* Title - LIGHT MODE DEFAULT */
      .networking-title {
        font-size: 3rem;
        font-weight: 800;
        background: linear-gradient(135deg, #1e293b 0%, #00BCD4 50%, #009688 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-align: center;
        margin-bottom: 1rem;
        letter-spacing: -0.02em;
      }

      /* Title - DARK MODE */
      .dark .networking-title {
        background: linear-gradient(135deg, #ffffff 0%, #00BCD4 50%, #009688 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* Colleague Discovery Carousel - LIGHT MODE DEFAULT */
      .colleague-discovery-carousel {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 150, 136, 0.3);
        border-radius: 16px;
        width: 320px;
        max-height: 500px;
        overflow-y: auto;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }

      /* Colleague Discovery Carousel - DARK MODE */
      .dark .colleague-discovery-carousel {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(0, 150, 136, 0.2);
        box-shadow: none;
      }

      /* Discovery Cards - LIGHT MODE DEFAULT */
      .colleague-discovery-card {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(0, 150, 136, 0.2);
        border-radius: 12px;
        padding: 12px;
        transition: all 0.3s ease;
        color: #1e293b;
      }

      .colleague-discovery-card:hover {
        background: rgba(255, 255, 255, 1);
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      /* Discovery Cards - DARK MODE */
      .dark .colleague-discovery-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }

      .dark .colleague-discovery-card:hover {
        background: rgba(255, 255, 255, 0.08);
        box-shadow: none;
      }

      /* Achievement Dashboard - LIGHT MODE DEFAULT */
      .networking-achievement-dashboard {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 150, 136, 0.3);
        border-radius: 20px;
        padding: 24px;
        margin-top: 2rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        color: #1e293b;
      }

      /* Achievement Dashboard - DARK MODE */
      .dark .networking-achievement-dashboard {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(0, 150, 136, 0.2);
        box-shadow: none;
        color: rgba(255, 255, 255, 0.95);
      }

      /* Achievement Cards - LIGHT MODE DEFAULT */
      .achievement-ring-card {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 150, 136, 0.2);
        border-radius: 16px;
        padding: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        color: #1e293b;
      }

      .achievement-ring-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }

      /* Achievement Cards - DARK MODE */
      .dark .achievement-ring-card {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(0, 150, 136, 0.15);
        box-shadow: none;
        color: rgba(255, 255, 255, 0.95);
      }

      .dark .achievement-ring-card:hover {
        box-shadow: 0 20px 60px rgba(0, 150, 136, 0.15);
      }

      /* Professional Networking Tabs - LIGHT MODE DEFAULT */
      .professional-networking-tabs {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 150, 136, 0.3);
        border-radius: 20px;
        padding: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }

      /* Professional Networking Tabs - DARK MODE */
      .dark .professional-networking-tabs {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(0, 150, 136, 0.2);
        box-shadow: none;
      }

      /* Professional Tabs - LIGHT MODE DEFAULT */
      .professional-tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 16px 12px;
        border-radius: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        text-align: center;
        min-height: 120px;
        color: #1e293b;
      }

      .professional-tab:hover {
        transform: translateY(-2px);
        background: rgba(0, 150, 136, 0.1);
        box-shadow: 0 8px 25px rgba(0, 150, 136, 0.15);
      }

      /* Professional Tabs - DARK MODE */
      .dark .professional-tab {
        color: rgba(255, 255, 255, 0.9);
      }

      .dark .professional-tab:hover {
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 25px rgba(0, 150, 136, 0.2);
      }

      /* Colleague Card Styles - LIGHT MODE DEFAULT */
      .colleague-card {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
        backdrop-filter: blur(30px);
        border: 1px solid rgba(0, 150, 136, 0.25);
        border-radius: 20px;
        padding: 24px;
        position: relative;
        overflow: hidden;
        transform-style: preserve-3d;
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        height: auto;
        min-height: 480px;
        color: #1e293b;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }

      .colleague-card:hover {
        transform: translateY(-12px) rotateX(5deg);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 150, 136, 0.2);
      }

      /* Colleague Card Styles - DARK MODE */
      .dark .colleague-card {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(0, 150, 136, 0.2);
        color: rgba(255, 255, 255, 0.95);
        box-shadow: none;
      }

      .dark .colleague-card:hover {
        box-shadow: 0 25px 80px rgba(0, 150, 136, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
      }

      .colleague-card.expanded {
        min-height: 600px;
      }

      /* Text Elements - Ensure visibility */
      .colleague-card h3 {
        color: #1e293b;
        font-weight: 600;
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
      }

      .colleague-card p {
        color: #475569;
        font-size: 0.875rem;
        line-height: 1.5;
      }

      .colleague-card span {
        color: #64748b;
        font-size: 0.8125rem;
      }

      .dark .colleague-card h3 {
        color: rgba(255, 255, 255, 0.95);
      }

      .dark .colleague-card p {
        color: rgba(255, 255, 255, 0.8);
      }

      .dark .colleague-card span {
        color: rgba(255, 255, 255, 0.7);
      }

      /* Button and Interactive Elements - LIGHT MODE DEFAULT */
      .colleague-card button {
        background: linear-gradient(135deg, #009688 0%, #00BCD4 100%);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .colleague-card button:hover {
        background: linear-gradient(135deg, #00796B 0%, #0097A7 100%);
        transform: translateY(-1px);
        box-shadow: 0 8px 25px rgba(0, 150, 136, 0.3);
      }

      /* Skill Tags - LIGHT MODE DEFAULT */
      .skill-tag {
        background: rgba(0, 150, 136, 0.1);
        color: #00695C;
        border: 1px solid rgba(0, 150, 136, 0.2);
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .skill-tag:hover {
        background: rgba(0, 150, 136, 0.2);
        border-color: rgba(0, 150, 136, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 150, 136, 0.3);
      }

      /* Skill Tags - DARK MODE */
      .dark .skill-tag {
        background: rgba(0, 150, 136, 0.2);
        color: #4DB6AC;
        border: 1px solid rgba(0, 150, 136, 0.3);
      }

      .dark .skill-tag:hover {
        background: rgba(0, 150, 136, 0.3);
        border-color: rgba(0, 150, 136, 0.4);
      }

      /* Department Badges - LIGHT MODE DEFAULT */
      .department-badge {
        background: linear-gradient(135deg, #00BCD4 0%, #009688 100%);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 600;
        animation: departmentShimmer 4s ease-in-out infinite;
      }

      /* Status Indicators - LIGHT MODE DEFAULT */
      .status-indicator {
        border: 2px solid white;
        box-shadow: 0 0 0 2px rgba(0, 150, 136, 0.3);
        border-radius: 50%;
      }

      /* Search and Filter Styles - LIGHT MODE DEFAULT */
      .professional-discovery-engine {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 150, 136, 0.3);
        border-radius: 20px;
        padding: 24px;
        margin-bottom: 2rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        color: #1e293b;
      }

      /* Search and Filter Styles - DARK MODE */
      .dark .professional-discovery-engine {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(0, 150, 136, 0.2);
        box-shadow: none;
        color: rgba(255, 255, 255, 0.95);
      }

      /* Input Fields - LIGHT MODE DEFAULT */
      .professional-discovery-engine input,
      .professional-discovery-engine select {
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(0, 150, 136, 0.2);
        color: #1e293b;
        padding: 8px 12px;
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .professional-discovery-engine input:focus,
      .professional-discovery-engine select:focus {
        border-color: #009688;
        box-shadow: 0 0 0 3px rgba(0, 150, 136, 0.1);
        outline: none;
      }

      /* Input Fields - DARK MODE */
      .dark .professional-discovery-engine input,
      .dark .professional-discovery-engine select {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.9);
      }

      .dark .professional-discovery-engine input:focus,
      .dark .professional-discovery-engine select:focus {
        border-color: rgba(0, 150, 136, 0.5);
        box-shadow: 0 0 0 3px rgba(0, 150, 136, 0.2);
      }

      /* Network Visualization Styles - LIGHT MODE DEFAULT */
      .professional-network-visualization {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 150, 136, 0.3);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        color: #1e293b;
      }

      /* Network Visualization Styles - DARK MODE */
      .dark .professional-network-visualization {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(0, 150, 136, 0.2);
        box-shadow: none;
        color: rgba(255, 255, 255, 0.95);
      }

      .network-node {
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        transition: all 0.3s ease;
      }

      .network-node:hover {
        filter: drop-shadow(0 6px 12px rgba(0, 150, 136, 0.4));
        transform: scale(1.1);
      }

      .connection-line {
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        transition: all 0.3s ease;
      }

      /* Connection Request Styles - LIGHT MODE DEFAULT */
      .professional-requests-header {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 150, 136, 0.35);
        border-radius: 20px;
        padding: 32px;
        margin-bottom: 2rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        color: #1e293b;
      }

      /* Connection Request Styles - DARK MODE */
      .dark .professional-requests-header {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(0, 150, 136, 0.3);
        box-shadow: none;
        color: rgba(255, 255, 255, 0.95);
      }

      /* Connection Request Items - LIGHT MODE DEFAULT */
      .professional-connection-request {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(0, 150, 136, 0.25);
        border-radius: 16px;
        transition: all 0.3s ease;
        margin-bottom: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        color: #1e293b;
      }

      .professional-connection-request:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border-color: rgba(0, 150, 136, 0.4);
      }

      /* Connection Request Items - DARK MODE */
      .dark .professional-connection-request {
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
        border: 1px solid rgba(0, 150, 136, 0.2);
        box-shadow: none;
        color: rgba(255, 255, 255, 0.95);
      }

      .dark .professional-connection-request:hover {
        box-shadow: 0 20px 60px rgba(0, 150, 136, 0.15);
      }

      /* Loading States - LIGHT MODE DEFAULT */
      .loading-shimmer {
        background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }

      /* Loading States - DARK MODE */
      .dark .loading-shimmer {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      }

      /* Color Variables */
      .accent-teal,
      .text-accent-teal {
        color: #009688;
      }

      .bg-accent-teal {
        background-color: #009688;
      }

      .secondary-teal,
      .text-secondary-teal {
        color: #4CAF50;
      }

      .bg-secondary-teal {
        background-color: #4CAF50;
      }

      .professional-highlight,
      .text-professional-highlight {
        color: #00BCD4;
      }

      .bg-professional-highlight {
        background-color: #00BCD4;
      }

      /* Avatar and Status Animations */
      .avatar-container:hover .status-ring {
        animation: statusRingPulse 2s ease-in-out infinite;
      }

      .status-indicator .status-pulse {
        animation: statusPulse 2s ease-in-out infinite;
      }

      .collaboration-progress {
        animation: fillProgress 2s ease-out;
        transform-origin: left;
      }

      .connection-progress {
        animation: drawConnection 3s ease-out;
      }

      .achievement-badge {
        animation: achievementGlow 3s ease-in-out infinite;
        width: 24px;
        height: 24px;
        background: linear-gradient(135deg, #FDD835, #F57F17);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .collaboration-glow {
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .colleague-card:hover .collaboration-glow {
        opacity: 1;
        animation: collaborationPulse 2s ease-in-out infinite;
      }

      .connect-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 8px 25px rgba(0, 150, 136, 0.4);
      }

      .connection-modal {
        animation: modalSlideIn 0.3s ease-out;
      }

      /* Hover Effects */
      .hover\\:bg-accent-teal\\/80:hover {
        background-color: rgba(0, 150, 136, 0.8);
      }

      .hover\\:bg-secondary-teal\\/30:hover {
        background-color: rgba(76, 175, 80, 0.3);
      }

      .hover\\:bg-professional-highlight\\/30:hover {
        background-color: rgba(0, 188, 212, 0.3);
      }

      /* Focus States */
      .focus\\:border-accent-teal:focus {
        border-color: #009688;
        outline: none;
      }

      /* Animations */
      @keyframes statusRingPulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.1); opacity: 1; }
      }

      @keyframes statusPulse {
        0%, 100% { opacity: 0.75; }
        50% { opacity: 1; }
      }

      @keyframes fillProgress {
        0% { transform: scaleX(0); }
        100% { transform: scaleX(1); }
      }

      @keyframes drawConnection {
        0% { stroke-dasharray: 0 283; }
        100% { stroke-dasharray: var(--progress) 283; }
      }

      @keyframes achievementGlow {
        0%, 100% { box-shadow: 0 0 5px rgba(234, 179, 8, 0.3); }
        50% { box-shadow: 0 0 20px rgba(234, 179, 8, 0.6), 0 0 30px rgba(234, 179, 8, 0.4); }
      }

      @keyframes departmentShimmer {
        0%, 100% { opacity: 0.9; }
        50% { opacity: 1; transform: scale(1.05); }
      }

      @keyframes collaborationPulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
      }

      @keyframes modalSlideIn {
        0% { opacity: 0; transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
      }

      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      @keyframes professionalConnection {
        0% {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      @keyframes networkingFlow {
        0%, 100% {
          opacity: 0.3;
          transform: translateX(-10px);
        }
        50% {
          opacity: 1;
          transform: translateX(10px);
        }
      }

      @keyframes mentorshipConnect {
        0% {
          transform: rotate(0deg) scale(1);
          filter: hue-rotate(0deg);
        }
        25% {
          transform: rotate(90deg) scale(1.1);
          filter: hue-rotate(90deg);
        }
        50% {
          transform: rotate(180deg) scale(1);
          filter: hue-rotate(180deg);
        }
        75% {
          transform: rotate(270deg) scale(1.1);
          filter: hue-rotate(270deg);
        }
        100% {
          transform: rotate(360deg) scale(1);
          filter: hue-rotate(360deg);
        }
      }

      /* Enhanced Responsive Design with Text Fitting */
      @media (max-width: 1200px) {
        .networking-title {
          font-size: 2.5rem;
          line-height: 1.1;
        }
        
        .colleague-card {
          min-height: 450px;
          padding: 20px;
        }
        
        .professional-networking-tabs {
          margin: 1rem;
        }
      }
      
      @media (max-width: 768px) {
        .networking-title {
          font-size: 2rem;
          line-height: 1.2;
          word-break: break-word;
          hyphens: auto;
        }

        .colleague-discovery-carousel {
          width: 100%;
          max-height: 300px;
        }

        .colleague-card {
          min-height: 400px;
          padding: 16px;
          margin-bottom: 1rem;
        }
        
        .colleague-card h3 {
          font-size: 1.125rem;
          line-height: 1.3;
          word-break: break-word;
        }
        
        .colleague-card p {
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .professional-tab {
          min-height: 80px;
          padding: 12px 8px;
        }
        
        .professional-tab .text-sm {
          font-size: 0.75rem;
        }
        
        .skill-tag {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }
        
        .department-badge {
          font-size: 0.625rem;
          padding: 0.25rem 0.5rem;
        }
      }

      @media (max-width: 480px) {
        .networking-title {
          font-size: 1.5rem;
          line-height: 1.3;
          word-break: break-word;
          text-align: center;
          max-width: 100%;
        }

        .colleague-card {
          min-height: 350px;
          padding: 12px;
          margin-bottom: 0.75rem;
        }
        
        .colleague-card h3 {
          font-size: 1rem;
          line-height: 1.4;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        
        .colleague-card p {
          font-size: 0.8125rem;
          line-height: 1.5;
        }
        
        .professional-tab {
          min-height: 70px;
          padding: 8px 4px;
        }
        
        .professional-tab .text-sm {
          font-size: 0.6875rem;
        }
        
        .skill-tag {
          font-size: 0.6875rem;
          padding: 0.125rem 0.375rem;
        }
        
        .department-badge {
          font-size: 0.5625rem;
          padding: 0.125rem 0.375rem;
        }
        
        .social-hub-header {
          padding: 1rem;
          margin-bottom: 1rem;
        }
        
        .professional-networking-tabs {
          margin: 0.5rem;
        }
      }
      
      /* Text Overflow Handling */
      .text-truncate-multiline {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
      }
      
      .text-fit {
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
        max-width: 100%;
      }
      
      /* Ensure all text fits within containers */
      .colleague-card * {
        max-width: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      .professional-tab * {
        max-width: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      /* Accessibility */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* COMPREHENSIVE TEXT COLOR FIXES FOR LIGHT MODE */
      
      /* Fix all gray text colors that are too light for light mode */
      .text-gray-300 {
        color: #374151 !important; /* Much darker for light mode */
      }
      
      .text-gray-400 {
        color: #4B5563 !important; /* Much darker for light mode */
      }
      
      .text-gray-500 {
        color: #6B7280 !important; /* Darker for light mode */
      }
      
      .text-white {
        color: #1F2937 !important; /* Dark text for light mode */
      }
      
      /* Fix text opacity classes for light mode */
      .text-white\\/80 {
        color: rgba(31, 41, 55, 0.8) !important; /* Dark with opacity for light mode */
      }
      
      .text-white\\/90 {
        color: rgba(31, 41, 55, 0.9) !important; /* Dark with opacity for light mode */
      }
      
      /* Restore proper colors for dark mode */
      .dark .text-gray-300 {
        color: #D1D5DB !important; /* Original gray-300 for dark mode */
      }
      
      .dark .text-gray-400 {
        color: #9CA3AF !important; /* Original gray-400 for dark mode */
      }
      
      .dark .text-gray-500 {
        color: #6B7280 !important; /* Original gray-500 for dark mode */
      }
      
      .dark .text-white {
        color: #FFFFFF !important; /* White text for dark mode */
      }
      
      .dark .text-white\\/80 {
        color: rgba(255, 255, 255, 0.8) !important; /* White with opacity for dark mode */
      }
      
      .dark .text-white\\/90 {
        color: rgba(255, 255, 255, 0.9) !important; /* White with opacity for dark mode */
      }
      
      /* Fix group hover states for light mode */
      .group-hover\\:text-white:hover {
        color: #1F2937 !important; /* Dark text for light mode */
      }
      
      .group-hover\\:text-gray-200:hover {
        color: #374151 !important; /* Darker for light mode */
      }
      
      /* Restore group hover for dark mode */
      .dark .group-hover\\:text-white:hover {
        color: #FFFFFF !important; /* White for dark mode */
      }
      
      .dark .group-hover\\:text-gray-200:hover {
        color: #E5E7EB !important; /* Light gray for dark mode */
      }
      
      /* Fix placeholder text colors */
      .placeholder\\:text-gray-400::placeholder {
        color: #6B7280 !important; /* Darker for light mode */
      }
      
      .dark .placeholder\\:text-gray-400::placeholder {
        color: #9CA3AF !important; /* Original for dark mode */
      }
      
      /* Fix text opacity issues for light mode */
      .text-white\\/80 {
        color: rgba(31, 41, 55, 0.8) !important; /* Dark with opacity for light mode */
      }
      
      .text-white\\/70 {
        color: rgba(31, 41, 55, 0.7) !important; /* Dark with opacity for light mode */
      }
      
      .text-white\\/60 {
        color: rgba(31, 41, 55, 0.6) !important; /* Dark with opacity for light mode */
      }
      
      /* Restore white opacity for dark mode */
      .dark .text-white\\/80 {
        color: rgba(255, 255, 255, 0.8) !important;
      }
      
      .dark .text-white\\/70 {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      
      .dark .text-white\\/60 {
        color: rgba(255, 255, 255, 0.6) !important;
      }
      
      /* Fix icon colors specifically */
      .professional-networking-tabs .text-gray-300,
      .professional-networking-tabs .text-gray-400,
      .colleague-card .text-gray-300,
      .colleague-card .text-gray-400,
      .social-hub-header .text-gray-300,
      .social-hub-header .text-gray-400 {
        color: #374151 !important; /* Dark for light mode */
      }
      
      .dark .professional-networking-tabs .text-gray-300,
      .dark .professional-networking-tabs .text-gray-400,
      .dark .colleague-card .text-gray-300,
      .dark .colleague-card .text-gray-400,
      .dark .social-hub-header .text-gray-300,
      .dark .social-hub-header .text-gray-400 {
        color: #D1D5DB !important; /* Light for dark mode */
      }
      
      /* Fix tab navigation specifically */
      .professional-tab .text-gray-300,
      .professional-tab .text-gray-400 {
        color: #1F2937 !important; /* Very dark for light mode */
      }
      
      .dark .professional-tab .text-gray-300,
      .dark .professional-tab .text-gray-400 {
        color: #E5E7EB !important; /* Light for dark mode */
      }
      
      /* Fix search and filter text */
      .professional-discovery-engine .text-gray-300,
      .professional-discovery-engine .text-gray-400,
      .professional-discovery-engine .text-gray-500 {
        color: #374151 !important; /* Dark for light mode */
      }
      
      .dark .professional-discovery-engine .text-gray-300,
      .dark .professional-discovery-engine .text-gray-400,
      .dark .professional-discovery-engine .text-gray-500 {
        color: #D1D5DB !important; /* Light for dark mode */
      }
      
      /* Fix any remaining light text in light mode containers */
      [class*="professional-"] .text-gray-300,
      [class*="professional-"] .text-gray-400,
      [class*="colleague-"] .text-gray-300,
      [class*="colleague-"] .text-gray-400,
      [class*="networking-"] .text-gray-300,
      [class*="networking-"] .text-gray-400 {
        color: #374151 !important; /* Ensure all are dark for light mode */
      }
      
      .dark [class*="professional-"] .text-gray-300,
      .dark [class*="professional-"] .text-gray-400,
      .dark [class*="colleague-"] .text-gray-300,
      .dark [class*="colleague-"] .text-gray-400,
      .dark [class*="networking-"] .text-gray-300,
      .dark [class*="networking-"] .text-gray-400 {
        color: #D1D5DB !important; /* Light for dark mode */
      }

      /* SPECIAL CASES: Text on colored/gradient backgrounds should be WHITE */
      
      /* Active tab backgrounds and gradient containers */
      .bg-gradient-to-br .text-white,
      .bg-gradient-to-r .text-white,
      .bg-gradient-to-l .text-white,
      [class*="bg-gradient"] .text-white,
      [class*="from-cyan"] .text-white,
      [class*="from-emerald"] .text-white,
      [class*="from-orange"] .text-white,
      [class*="from-purple"] .text-white,
      [class*="from-pink"] .text-white,
      [class*="from-indigo"] .text-white,
      [class*="from-blue"] .text-white {
        color: #FFFFFF !important; /* Keep white on colored backgrounds */
      }
      
      /* Active tabs specifically */
      .professional-tab.bg-gradient-to-br .text-white,
      .professional-tab[class*="from-"] .text-white,
      .bg-gradient-to-br.professional-tab .text-white {
        color: #FFFFFF !important;
      }
      
      /* Header stats and numbers on gradient backgrounds */
      .social-hub-header [class*="bg-gradient"] .text-white,
      .social-hub-header [class*="from-"] .text-white,
      .social-hub-header [class*="to-"] .text-white {
        color: #FFFFFF !important;
      }
      
      /* Achievement and stat cards with gradients */
      .achievement-ring-card [class*="bg-gradient"] .text-white,
      .networking-achievement-dashboard [class*="bg-gradient"] .text-white {
        color: #FFFFFF !important;
      }
      
      /* Badge and pill backgrounds */
      .bg-cyan-500\\/20 .text-white,
      .bg-emerald-500\\/20 .text-white,
      .bg-green-500\\/20 .text-white,
      .bg-orange-500\\/20 .text-white,
      .bg-purple-500\\/20 .text-white,
      .bg-pink-500\\/20 .text-white,
      .bg-indigo-500\\/20 .text-white {
        color: #FFFFFF !important;
      }
      
      /* Department badges and status indicators */
      .department-badge,
      .department-badge .text-white {
        color: #FFFFFF !important;
      }
      
      /* Fix specific invisible elements */
      
      /* Header connection text */
      .social-hub-header h2,
      .social-hub-header h3,
      .social-hub-header .text-2xl,
      .social-hub-header .text-3xl,
      .social-hub-header .text-4xl,
      .social-hub-header .text-5xl {
        color: #1F2937 !important; /* Dark text for light mode */
      }
      
      .dark .social-hub-header h2,
      .dark .social-hub-header h3,
      .dark .social-hub-header .text-2xl,
      .dark .social-hub-header .text-3xl,
      .dark .social-hub-header .text-4xl,
      .dark .social-hub-header .text-5xl {
        color: #FFFFFF !important; /* White text for dark mode */
      }
      
      /* Stats numbers and labels */
      .social-hub-header .font-bold,
      .social-hub-header .font-semibold,
      .social-hub-header .font-medium {
        color: #1F2937 !important; /* Dark for light mode */
      }
      
      .dark .social-hub-header .font-bold,
      .dark .social-hub-header .font-semibold,
      .dark .social-hub-header .font-medium {
        color: #FFFFFF !important; /* White for dark mode */
      }
      
      /* Specific text that should always be visible */
      .social-hub-header p,
      .social-hub-header span:not([class*="bg-"]),
      .networking-achievement-dashboard p,
      .networking-achievement-dashboard span:not([class*="bg-"]) {
        color: #374151 !important; /* Dark for light mode */
      }
      
      .dark .social-hub-header p,
      .dark .social-hub-header span:not([class*="bg-"]),
      .dark .networking-achievement-dashboard p,
      .dark .networking-achievement-dashboard span:not([class*="bg-"]) {
        color: #E5E7EB !important; /* Light for dark mode */
      }
      
      /* Connection stats text specifically */
      [class*="colleagues"] *,
      [class*="departments"] *,
      [class*="active"] * {
        color: #1F2937 !important; /* Ensure visibility in light mode */
      }
      
      .dark [class*="colleagues"] *,
      .dark [class*="departments"] *,
      .dark [class*="active"] * {
        color: #FFFFFF !important; /* White for dark mode */
      }
      
      /* Override any remaining invisible text */
      .text-transparent {
        color: #1F2937 !important; /* Make transparent text visible in light mode */
      }
      
      .dark .text-transparent {
        color: #FFFFFF !important; /* White for dark mode */
      }
      
      /* Specific gradient text that should remain as gradient but be visible */
      .networking-title {
        background: linear-gradient(135deg, #1e293b 0%, #00BCD4 50%, #009688 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
      }
      
      .dark .networking-title {
        background: linear-gradient(135deg, #ffffff 0%, #00BCD4 50%, #009688 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
      }

      /* SPECIFIC FIX FOR HEADER STATS THAT ARE INVISIBLE */
      
      /* Header stat cards with semi-transparent white backgrounds */
      .bg-gradient-to-br.from-white\\/15.to-white\\/5 .text-white,
      [class*="from-white/15"] .text-white,
      [class*="to-white/5"] .text-white,
      .backdrop-blur-xl .text-white {
        color: #1F2937 !important; /* Dark text for light mode on light backgrounds */
      }
      
      .dark .bg-gradient-to-br.from-white\\/15.to-white\\/5 .text-white,
      .dark [class*="from-white/15"] .text-white,
      .dark [class*="to-white/5"] .text-white,
      .dark .backdrop-blur-xl .text-white {
        color: #FFFFFF !important; /* Keep white for dark mode */
      }
      
      /* Header main title and subtitle - these should be visible */
      .text-4xl.text-white,
      .text-5xl.text-white,
      .text-6xl.text-white,
      .text-xl.text-white\\/90 {
        color: #1F2937 !important; /* Dark for light mode */
      }
      
      .dark .text-4xl.text-white,
      .dark .text-5xl.text-white,
      .dark .text-6xl.text-white,
      .dark .text-xl.text-white\\/90 {
        color: #FFFFFF !important; /* White for dark mode */
      }
      
      /* Specific stat numbers and labels in header cards */
      .text-3xl.font-bold.text-white,
      .text-sm.text-white\\/80 {
        color: #1F2937 !important; /* Dark text for light mode */
      }
      
      .dark .text-3xl.font-bold.text-white,
      .dark .text-sm.text-white\\/80 {
        color: #FFFFFF !important; /* White text for dark mode */
      }
      
      /* Connection text like "Connect with 3 colleagues across 6 departments" */
      .social-hub-header .text-xl,
      .social-hub-header .text-lg,
      .social-hub-header .text-base {
        color: #374151 !important; /* Dark gray for light mode */
      }
      
      .dark .social-hub-header .text-xl,
      .dark .social-hub-header .text-lg,
      .dark .social-hub-header .text-base {
        color: #E5E7EB !important; /* Light gray for dark mode */
      }
      
      /* Hover states for header stats */
      .group-hover\\:text-cyan-200:hover {
        color: #0369A1 !important; /* Darker blue for light mode */
      }
      
      .dark .group-hover\\:text-cyan-200:hover {
        color: #67E8F9 !important; /* Cyan for dark mode */
      }
      
      /* Force visibility for any remaining invisible elements */
      .social-hub-header *:not([class*="bg-gradient"]):not([class*="from-"]):not([class*="to-"]) {
        color: #374151 !important; /* Ensure everything is visible in light mode */
      }
      
      .dark .social-hub-header *:not([class*="bg-gradient"]):not([class*="from-"]):not([class*="to-"]) {
        color: #E5E7EB !important; /* Light for dark mode */
      }
      
      /* Exception: Keep icons white on colored backgrounds */
      .social-hub-header [class*="bg-gradient"] .text-white,
      .social-hub-header [class*="from-cyan"] .text-white,
      .social-hub-header [class*="from-emerald"] .text-white,
      .social-hub-header [class*="to-blue"] .text-white {
        color: #FFFFFF !important; /* Keep white on colored icon backgrounds */
      }

      /* High contrast mode */
      @media (prefers-contrast: high) {
        .colleague-card,
        .social-hub-header,
        .networking-achievement-dashboard {
          border-width: 2px;
        }
        
        .colleague-card {
          border-color: #1e293b;
        }
        
        .dark .colleague-card,
        .dark .social-hub-header,
        .dark .networking-achievement-dashboard {
          border-color: #ffffff;
        }
      }
      
      /* PERFORMANCE OPTIMIZATIONS */
      
      /* GPU acceleration for smooth animations */
      .colleague-card,
      .professional-tab,
      .social-hub-header {
        transform: translateZ(0);
        will-change: transform, opacity;
      }
      
      /* Optimize rendering performance */
      .colleague-card:hover,
      .professional-tab:hover {
        contain: layout style paint;
      }
      
      /* Smooth scrolling */
      html {
        scroll-behavior: smooth;
      }
      
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
      }
      
      /* THEME TRANSITIONS */
      
      /* Smooth theme switching */
      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
      }
      
      /* Prevent flash during theme change */
      .colleague-card,
      .social-hub-header,
      .professional-networking-tabs {
        transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease !important;
      }
      
      /* ULTRA-WIDE SCREEN OPTIMIZATIONS */
      @media (min-width: 1800px) {
        .colleague-card {
          min-height: 520px;
          padding: 32px;
        }
        
        .networking-title {
          font-size: 4rem;
        }
        
        .professional-tab {
          min-height: 140px;
          padding: 20px 16px;
        }
      }
      
      /* PRINT STYLES */
      @media print {
        .colleague-card,
        .social-hub-header,
        .professional-networking-tabs {
          background: white !important;
          color: black !important;
          box-shadow: none !important;
          border: 1px solid #000 !important;
        }
        
        .text-white {
          color: black !important;
        }
        
        [class*="bg-gradient"] {
          background: #f5f5f5 !important;
        }
      }
      
    `}</style>
  )
}