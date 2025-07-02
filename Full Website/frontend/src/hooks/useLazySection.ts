import { useEffect, useRef, useState } from 'react';

interface UseLazySectionOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  fallbackDelay?: number;
}

export function useLazySection(options: UseLazySectionOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px 0px',
    triggerOnce = true,
    fallbackDelay = 100
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            
            // Set loaded state with a small delay for smooth transition
            timeoutRef.current = setTimeout(() => {
              setIsLoaded(true);
              element.setAttribute('data-loaded', 'true');
            }, fallbackDelay);

            // Unobserve if triggerOnce is true
            if (triggerOnce && observerRef.current) {
              observerRef.current.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
            setIsLoaded(false);
            element.setAttribute('data-loaded', 'false');
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    // Start observing
    observerRef.current.observe(element);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce, fallbackDelay]);

  return {
    elementRef,
    isVisible,
    isLoaded,
    className: `lazy-section ${isLoaded ? 'section-loaded' : 'section-loading'}`
  };
}

// Hook for preloading content during fast scroll
export function useScrollPreloader() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [fastScroll, setFastScroll] = useState(false);
  
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  const velocityTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let requestId: number;
    let lastTime = Date.now();
    let velocity = 0;

    const handleScroll = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;
      const deltaTime = currentTime - lastTime;

      // Calculate scroll velocity
      if (deltaTime > 0) {
        velocity = Math.abs(deltaY) / deltaTime;
      }

      // Determine scroll direction
      if (deltaY > 0) {
        setScrollDirection('down');
      } else if (deltaY < 0) {
        setScrollDirection('up');
      }

      // Fast scroll detection (velocity > 2 pixels per millisecond)
      const isFastScroll = velocity > 2;
      setFastScroll(isFastScroll);

      // Apply fast scroll class to body
      if (isFastScroll) {
        document.body.classList.add('fast-scroll-mode');
      } else {
        document.body.classList.remove('fast-scroll-mode');
      }

      setIsScrolling(true);
      lastScrollY.current = currentScrollY;
      lastTime = currentTime;

      // Clear existing timers
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      if (velocityTimer.current) {
        clearTimeout(velocityTimer.current);
      }

      // Set scroll end timer
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
        setFastScroll(false);
        document.body.classList.remove('fast-scroll-mode');
      }, 150);

      // Reset velocity after a delay
      velocityTimer.current = setTimeout(() => {
        velocity = 0;
      }, 100);
    };

    const optimizedScrollHandler = () => {
      requestId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', optimizedScrollHandler);
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      if (velocityTimer.current) {
        clearTimeout(velocityTimer.current);
      }
      document.body.classList.remove('fast-scroll-mode');
    };
  }, []);

  return {
    isScrolling,
    scrollDirection,
    fastScroll
  };
}

// Hook for content preloading
export function useContentPreloader() {
  const [preloadedUrls, setPreloadedUrls] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const preloadContent = async (urlsToPreload: string[]) => {
    setLoading(true);
    
    const promises = urlsToPreload.map(async (url) => {
      if (preloadedUrls.has(url)) return;

      try {
        // For images
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              setPreloadedUrls(prev => new Set(prev).add(url));
              resolve(url);
            };
            img.onerror = reject;
            img.src = url;
          });
        }

        // For other resources
        const response = await fetch(url);
        if (response.ok) {
          setPreloadedUrls(prev => new Set(prev).add(url));
        }
      } catch (error) {
        console.warn('Failed to preload:', url, error);
      }
    });

    try {
      await Promise.allSettled(promises);
    } finally {
      setLoading(false);
    }
  };

  return {
    preloadContent,
    preloadedUrls,
    loading,
    isPreloaded: (url: string) => preloadedUrls.has(url)
  };
}