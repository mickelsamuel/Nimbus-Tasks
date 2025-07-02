'use client'

import React, { useEffect, useState } from 'react';

interface PagePreloaderProps {
  children: React.ReactNode;
}

export function PagePreloader({ children }: PagePreloaderProps) {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);

  useEffect(() => {
    const preloadResources = async () => {
      // Force page to render all content immediately
      const allImages = document.querySelectorAll('img');
      const allVideoElements = document.querySelectorAll('video');
      const totalResources = allImages.length + allVideoElements.length;
      let loadedResources = 0;

      // Preload all images
      const imagePromises = Array.from(allImages).map((img) => {
        return new Promise<void>((resolve) => {
          if (img.complete) {
            loadedResources++;
            setPreloadProgress((loadedResources / totalResources) * 100);
            resolve();
          } else {
            img.onload = () => {
              loadedResources++;
              setPreloadProgress((loadedResources / totalResources) * 100);
              resolve();
            };
            img.onerror = () => {
              loadedResources++;
              setPreloadProgress((loadedResources / totalResources) * 100);
              resolve();
            };
          }
        });
      });

      // Preload all videos
      const videoPromises = Array.from(allVideoElements).map((video) => {
        return new Promise<void>((resolve) => {
          if (video.readyState >= 3) {
            loadedResources++;
            setPreloadProgress((loadedResources / totalResources) * 100);
            resolve();
          } else {
            video.oncanplaythrough = () => {
              loadedResources++;
              setPreloadProgress((loadedResources / totalResources) * 100);
              resolve();
            };
            video.onerror = () => {
              loadedResources++;
              setPreloadProgress((loadedResources / totalResources) * 100);
              resolve();
            };
          }
        });
      });

      // Force all sections to be rendered (remove lazy loading)
      const lazySections = document.querySelectorAll('.lazy-section, [data-lazy]');
      lazySections.forEach(section => {
        section.classList.remove('lazy-section');
        section.removeAttribute('data-lazy');
      });

      // Force render all Framer Motion components
      const motionElements = document.querySelectorAll('[class*="motion-"], .motion-div, .framer-motion-div');
      motionElements.forEach(element => {
        // Force immediate rendering without animation
        (element as HTMLElement).style.opacity = '1';
        (element as HTMLElement).style.transform = 'none';
      });

      // Wait for all resources
      await Promise.all([...imagePromises, ...videoPromises]);

      // Reduce delay and add timeout fallback
      setTimeout(() => {
        setIsPreloaded(true);
      }, 100);
    };

    // Start preloading after a short delay to ensure DOM is ready
    const timer = setTimeout(preloadResources, 100);
    
    // Add failsafe timeout to prevent infinite loading
    const failsafeTimer = setTimeout(() => {
      setIsPreloaded(true);
    }, 3000); // Force show content after 3 seconds max

    return () => {
      clearTimeout(timer);
      clearTimeout(failsafeTimer);
    };
  }, []);

  // Force immediate rendering for critical elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Disable CSS transitions temporarily during initial load
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after {
          transition-duration: 0.01ms !important;
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
        }
      `;
      document.head.appendChild(style);

      // Remove the style after preloading
      const cleanup = () => {
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      };

      if (isPreloaded) {
        setTimeout(cleanup, 100);
      }

      return cleanup;
    }
  }, [isPreloaded]);

  if (!isPreloaded) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Loading BNC Training Platform
          </h2>
          <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
              style={{ width: `${preloadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {Math.round(preloadProgress)}% Complete
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}