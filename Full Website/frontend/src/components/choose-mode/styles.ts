export const globalStyles = `
  @keyframes subtle-float {
    0%, 100% { transform: translateY(0px) rotateY(0deg); }
    33% { transform: translateY(-5px) rotateY(2deg); }
    66% { transform: translateY(-2px) rotateY(-2deg); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  /* Custom scrollbar for dark mode */
  .dark ::-webkit-scrollbar {
    width: 8px;
  }
  
  .dark ::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.5);
  }
  
  .dark ::-webkit-scrollbar-thumb {
    background: rgba(224, 26, 26, 0.5);
    border-radius: 4px;
  }
  
  .dark ::-webkit-scrollbar-thumb:hover {
    background: rgba(224, 26, 26, 0.7);
  }

  /* Focus outline styling */
  .focus\\:outline-none:focus {
    outline: 2px solid #E01A1A;
    outline-offset: 2px;
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    .animate-float {
      animation: none;
    }
    
    @keyframes subtle-float {
      0%, 100% { transform: translateY(0px) rotateY(0deg); }
    }
  }
`