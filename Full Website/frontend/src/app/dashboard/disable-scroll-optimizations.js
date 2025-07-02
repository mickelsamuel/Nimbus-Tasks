// Disable browser scroll optimizations that pause animations
(function() {
  'use strict';
  
  // Override scroll event to prevent optimization
  const originalScrollTo = window.scrollTo;
  window.scrollTo = function(...args) {
    const result = originalScrollTo.apply(this, args);
    // Force repaint to keep animations running
    document.body.style.transform = 'translateZ(0)';
    setTimeout(() => {
      document.body.style.transform = '';
    }, 1);
    return result;
  };
  
  // Override scrollBy
  const originalScrollBy = window.scrollBy;
  window.scrollBy = function(...args) {
    const result = originalScrollBy.apply(this, args);
    document.body.style.transform = 'translateZ(0)';
    setTimeout(() => {
      document.body.style.transform = '';
    }, 1);
    return result;
  };
  
  // Force continuous repaints during scroll
  let isScrolling = false;
  let scrollTimeout;
  
  window.addEventListener('scroll', function() {
    if (!isScrolling) {
      isScrolling = true;
      // Force GPU layer creation
      document.documentElement.style.willChange = 'scroll-position';
    }
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      isScrolling = false;
      document.documentElement.style.willChange = 'auto';
    }, 100);
  }, { passive: true });
  
  // Continuously force animations to run
  setInterval(function() {
    const animatedElements = document.querySelectorAll('[class*="animate-"], [style*="animation"]');
    animatedElements.forEach(function(el) {
      if (el.style.animationPlayState !== 'running') {
        el.style.animationPlayState = 'running';
      }
    });
  }, 50);
  
  console.log('Scroll optimizations disabled, animations forced to continue');
})();