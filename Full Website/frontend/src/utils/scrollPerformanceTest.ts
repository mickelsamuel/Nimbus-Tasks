// Scroll Performance Testing Utilities

interface PerformanceMetrics {
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  frameDrops: number;
  scrollJank: number;
  animationContinuity: boolean;
}

export class ScrollPerformanceMonitor {
  private frameCounter: number = 0;
  private lastTime: number = 0;
  private fpsReadings: number[] = [];
  private animationElements: Set<HTMLElement> = new Set();
  private isMonitoring: boolean = false;
  private animationStates: Map<HTMLElement, boolean> = new Map();
  
  constructor() {
    this.bindEvents();
  }

  private bindEvents() {
    // Track scroll events
    window.addEventListener('scroll', this.trackScrollJank.bind(this), { passive: true });
    
    // Track animation elements
    this.observeAnimationElements();
  }

  private observeAnimationElements() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            this.findAndRegisterAnimations(element);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial scan
    this.findAndRegisterAnimations(document.body);
  }

  private findAndRegisterAnimations(root: HTMLElement) {
    const animatedElements = root.querySelectorAll(
      '[data-animation], .motion-div, .framer-motion-div, .scroll-optimized, .animate-pulse-optimized, .animate-float-optimized'
    );
    
    animatedElements.forEach((el) => {
      this.animationElements.add(el as HTMLElement);
      this.animationStates.set(el as HTMLElement, true);
    });
  }

  private trackScrollJank() {
    if (!this.isMonitoring) return;

    // Check if animations are still running during scroll
    this.animationElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const isAnimating = computedStyle.animationPlayState === 'running' || 
                         computedStyle.transitionProperty !== 'none';
      
      this.animationStates.set(element, isAnimating);
    });
  }

  public startMonitoring(): Promise<PerformanceMetrics> {
    return new Promise((resolve) => {
      this.isMonitoring = true;
      this.frameCounter = 0;
      this.fpsReadings = [];
      this.lastTime = performance.now();

      const measureFrame = (currentTime: number) => {
        if (!this.isMonitoring) return;

        // Calculate FPS
        const deltaTime = currentTime - this.lastTime;
        if (deltaTime > 0) {
          const fps = 1000 / deltaTime;
          this.fpsReadings.push(fps);
          this.frameCounter++;
        }

        this.lastTime = currentTime;
        requestAnimationFrame(measureFrame);
      };

      requestAnimationFrame(measureFrame);

      // Stop monitoring after 10 seconds
      setTimeout(() => {
        this.isMonitoring = false;
        resolve(this.calculateMetrics());
      }, 10000);
    });
  }

  private calculateMetrics(): PerformanceMetrics {
    if (this.fpsReadings.length === 0) {
      return {
        averageFPS: 0,
        minFPS: 0,
        maxFPS: 0,
        frameDrops: 0,
        scrollJank: 0,
        animationContinuity: false
      };
    }

    const averageFPS = this.fpsReadings.reduce((a, b) => a + b, 0) / this.fpsReadings.length;
    const minFPS = Math.min(...this.fpsReadings);
    const maxFPS = Math.max(...this.fpsReadings);
    
    // Count frames below 30 FPS as drops
    const frameDrops = this.fpsReadings.filter(fps => fps < 30).length;
    
    // Calculate scroll jank (frames below 50 FPS during scroll)
    const scrollJank = this.fpsReadings.filter(fps => fps < 50).length / this.fpsReadings.length;
    
    // Check animation continuity
    const animationContinuity = Array.from(this.animationStates.values()).every(state => state);

    return {
      averageFPS: Math.round(averageFPS),
      minFPS: Math.round(minFPS),
      maxFPS: Math.round(maxFPS),
      frameDrops,
      scrollJank: Math.round(scrollJank * 100), // Percentage
      animationContinuity
    };
  }

  public async runScrollTest(): Promise<PerformanceMetrics> {
    // Start monitoring
    const metricsPromise = this.startMonitoring();

    // Simulate user scroll behavior
    await this.simulateScrolling();

    return metricsPromise;
  }

  private async simulateScrolling(): Promise<void> {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollSteps = 50;
    const stepSize = scrollHeight / scrollSteps;

    for (let i = 0; i <= scrollSteps; i++) {
      const scrollPosition = i * stepSize;
      window.scrollTo({ top: scrollPosition, behavior: 'auto' });
      
      // Wait between scroll steps to simulate real user behavior
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  public generateReport(metrics: PerformanceMetrics): string {
    const rating = this.getRating(metrics);
    
    return `
🚀 Scroll Performance Report
============================

📊 FPS Metrics:
   • Average FPS: ${metrics.averageFPS}
   • Min FPS: ${metrics.minFPS}
   • Max FPS: ${metrics.maxFPS}

⚡ Performance Indicators:
   • Frame Drops: ${metrics.frameDrops}
   • Scroll Jank: ${metrics.scrollJank}%
   • Animation Continuity: ${metrics.animationContinuity ? '✅ Maintained' : '❌ Broken'}

🎯 Overall Rating: ${rating.emoji} ${rating.label}
💡 Score: ${rating.score}/100

${rating.recommendations}
    `.trim();
  }

  private getRating(metrics: PerformanceMetrics) {
    let score = 100;
    
    // Penalize low average FPS
    if (metrics.averageFPS < 60) score -= (60 - metrics.averageFPS) * 2;
    if (metrics.averageFPS < 30) score -= 20;
    
    // Penalize frame drops
    score -= Math.min(metrics.frameDrops, 30);
    
    // Penalize scroll jank
    score -= metrics.scrollJank;
    
    // Penalize broken animation continuity
    if (!metrics.animationContinuity) score -= 25;
    
    score = Math.max(0, score);

    if (score >= 90) {
      return {
        emoji: '🏆',
        label: 'Excellent',
        score,
        recommendations: '✨ Perfect scroll performance! Animations are smooth and continuous.'
      };
    } else if (score >= 75) {
      return {
        emoji: '🥇',
        label: 'Very Good',
        score,
        recommendations: '👍 Great performance with minor room for improvement.'
      };
    } else if (score >= 60) {
      return {
        emoji: '🥈',
        label: 'Good',
        score,
        recommendations: '💡 Consider optimizing heavy animations or adding more GPU acceleration.'
      };
    } else if (score >= 40) {
      return {
        emoji: '🥉',
        label: 'Fair',
        score,
        recommendations: '⚠️ Performance issues detected. Consider reducing animation complexity.'
      };
    } else {
      return {
        emoji: '❌',
        label: 'Poor',
        score,
        recommendations: '🚨 Significant performance issues. Animations may be pausing during scroll.'
      };
    }
  }
}

// Quick test function for development
export async function quickScrollTest(): Promise<void> {
  console.log('🔄 Starting scroll performance test...');
  
  const monitor = new ScrollPerformanceMonitor();
  const metrics = await monitor.runScrollTest();
  const report = monitor.generateReport(metrics);
  
  console.log(report);
  
  // Also display in browser if in development
  if (process.env.NODE_ENV === 'development') {
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `
      <div style="
        position: fixed; 
        top: 20px; 
        right: 20px; 
        background: rgba(0,0,0,0.9); 
        color: white; 
        padding: 20px; 
        border-radius: 10px; 
        font-family: monospace; 
        white-space: pre-line; 
        max-width: 400px; 
        z-index: 10000;
        max-height: 80vh;
        overflow-y: auto;
      ">
        ${report.replace(/\n/g, '<br>')}
        <button onclick="this.parentElement.parentElement.remove()" style="
          margin-top: 10px; 
          background: #007bff; 
          color: white; 
          border: none; 
          padding: 5px 10px; 
          border-radius: 5px; 
          cursor: pointer;
        ">Close</button>
      </div>
    `;
    document.body.appendChild(alertDiv);
    
    // Auto remove after 30 seconds
    setTimeout(() => {
      if (alertDiv.parentElement) {
        alertDiv.remove();
      }
    }, 30000);
  }
}

// Export for global access in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).quickScrollTest = quickScrollTest;
  (window as any).ScrollPerformanceMonitor = ScrollPerformanceMonitor;
}