import React from 'react';

interface TimelineLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TimelineLoadingSpinner: React.FC<TimelineLoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`timeline-loading-spinner ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Spinning Timeline Icon */}
        <div className={`relative ${sizeClasses[size]}`}>
          <div className="absolute inset-0 border-4 border-red-200 rounded-full animate-pulse" />
          <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-2 bg-red-500 rounded-full opacity-20 animate-ping" />
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-gray-600 font-medium">Loading timeline...</p>
          <p className="text-gray-400 text-sm mt-1">Preparing your journey through history</p>
        </div>
        
        {/* Progress Dots */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }

        .timeline-loading-spinner {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default TimelineLoadingSpinner;