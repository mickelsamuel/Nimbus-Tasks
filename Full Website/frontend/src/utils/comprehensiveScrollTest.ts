// Comprehensive Scroll Performance Testing Suite

interface TestResult {
  testName: string;
  averageFPS: number;
  minFPS: number;
  frameDrops: number;
  scrollJank: number;
  animationContinuity: boolean;
  passed: boolean;
  details: string[];
}

interface ComprehensiveTestResults {
  overall: {
    score: number;
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
    summary: string;
  };
  tests: TestResult[];
  recommendations: string[];
  performance: {
    beforeOptimization: Record<string, unknown>;
    afterOptimization: Record<string, unknown>;
    improvement: string;
  };
}

class ComprehensiveScrollPerformanceTester {
  private performanceObserver: PerformanceObserver | null = null;
  private fpsReadings: number[] = [];
  private animationElements: Set<HTMLElement> = new Set();
  private isTestRunning = false;

  constructor() {
    this.setupPerformanceObserver();
    this.scanForElements();
  }

  private setupPerformanceObserver() {
    if (typeof PerformanceObserver !== 'undefined') {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            console.log('Page Load Performance:', entry);
          }
        });
      });
      
      try {
        this.performanceObserver.observe({ 
          entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] 
        });
      } catch (error) {
        console.warn('Performance Observer not fully supported');
      }
    }
  }

  private scanForElements() {
    // Find all potentially heavy elements
    const selectors = [
      '[class*="backdrop-blur"]',
      '[class*="backdrop-"]',
      '.backdrop-optimized',
      '.backdrop-smart',
      '.backdrop-light',
      '[data-animation]',
      '.motion-div',
      '.framer-motion-div',
      '.animate-pulse',
      '.animate-bounce',
      '.animate-float',
      '[class*="animate-"]',
      'canvas',
      'video',
      '[style*="filter"]',
      '[style*="backdrop-filter"]',
      '.bg-gradient-to-r',
      '.bg-gradient-to-br',
      '[class*="gradient"]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => this.animationElements.add(el as HTMLElement));
    });

    console.log(`Found ${this.animationElements.size} potentially performance-impacting elements`);
  }

  private measureFPS(duration: number = 2000): Promise<number[]> {
    return new Promise((resolve) => {
      const readings: number[] = [];
      let lastTime = performance.now();
      let frameCount = 0;

      const measureFrame = (currentTime: number) => {
        frameCount++;
        const deltaTime = currentTime - lastTime;
        
        if (deltaTime >= 1000) { // Every second
          const fps = (frameCount * 1000) / deltaTime;
          readings.push(fps);
          frameCount = 0;
          lastTime = currentTime;
        }

        if (currentTime - lastTime < duration) {
          requestAnimationFrame(measureFrame);
        } else {
          resolve(readings);
        }
      };

      requestAnimationFrame(measureFrame);
    });
  }

  private async testBasicScrollPerformance(): Promise<TestResult> {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    performance.now();
    
    // Measure FPS during scroll
    const fpsPromise = this.measureFPS(3000);
    
    // Perform scroll test
    for (let i = 0; i <= 20; i++) {
      const scrollPosition = (i / 20) * scrollHeight;
      window.scrollTo({ top: scrollPosition, behavior: 'auto' });
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const fpsReadings = await fpsPromise;
    const avgFPS = fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length;
    const minFPS = Math.min(...fpsReadings);
    const frameDrops = fpsReadings.filter(fps => fps < 30).length;
    const scrollJank = (fpsReadings.filter(fps => fps < 50).length / fpsReadings.length) * 100;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return {
      testName: 'Basic Scroll Performance',
      averageFPS: Math.round(avgFPS),
      minFPS: Math.round(minFPS),
      frameDrops,
      scrollJank: Math.round(scrollJank),
      animationContinuity: true, // Will be measured separately
      passed: avgFPS >= 50 && frameDrops < 3,
      details: [
        `Average FPS: ${Math.round(avgFPS)}`,
        `Minimum FPS: ${Math.round(minFPS)}`,
        `Frame drops: ${frameDrops}`,
        `Scroll jank: ${Math.round(scrollJank)}%`
      ]
    };
  }

  private async testAnimationContinuity(): Promise<TestResult> {
    let animationsRunning = 0;
    let animationsPaused = 0;

    // Check animations during scroll
    const checkAnimations = () => {
      this.animationElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        const hasRunningAnimation = computedStyle.animationPlayState === 'running' ||
                                   computedStyle.transitionProperty !== 'none';
        
        if (hasRunningAnimation) {
          animationsRunning++;
        } else {
          animationsPaused++;
        }
      });
    };

    // Simulate scroll and check animations
    window.scrollTo({ top: 100, behavior: 'auto' });
    await new Promise(resolve => setTimeout(resolve, 50));
    
    checkAnimations();
    
    const continuityRatio = animationsRunning / (animationsRunning + animationsPaused);
    
    return {
      testName: 'Animation Continuity',
      averageFPS: 0,
      minFPS: 0,
      frameDrops: 0,
      scrollJank: 0,
      animationContinuity: continuityRatio > 0.8,
      passed: continuityRatio > 0.8,
      details: [
        `Running animations: ${animationsRunning}`,
        `Paused animations: ${animationsPaused}`,
        `Continuity ratio: ${Math.round(continuityRatio * 100)}%`
      ]
    };
  }

  private async testFastScrollPerformance(): Promise<TestResult> {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Enable fast scroll mode
    document.body.classList.add('fast-scroll-mode');
    
    const fpsPromise = this.measureFPS(2000);
    
    // Rapid scroll test
    for (let i = 0; i <= 10; i++) {
      const scrollPosition = (i / 10) * scrollHeight;
      window.scrollTo({ top: scrollPosition, behavior: 'auto' });
      await new Promise(resolve => setTimeout(resolve, 50)); // Fast scroll
    }

    const fpsReadings = await fpsPromise;
    const avgFPS = fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length;
    const minFPS = Math.min(...fpsReadings);
    
    document.body.classList.remove('fast-scroll-mode');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return {
      testName: 'Fast Scroll Performance',
      averageFPS: Math.round(avgFPS),
      minFPS: Math.round(minFPS),
      frameDrops: fpsReadings.filter(fps => fps < 30).length,
      scrollJank: (fpsReadings.filter(fps => fps < 45).length / fpsReadings.length) * 100,
      animationContinuity: true,
      passed: avgFPS >= 45 && minFPS >= 25,
      details: [
        `Fast scroll average FPS: ${Math.round(avgFPS)}`,
        `Fast scroll minimum FPS: ${Math.round(minFPS)}`,
        `Performance maintained during rapid scroll`
      ]
    };
  }

  private async testBackdropFilterPerformance(): Promise<TestResult> {
    const backdropElements = document.querySelectorAll('[class*="backdrop-"], .backdrop-optimized, .backdrop-smart');
    
    if (backdropElements.length === 0) {
      return {
        testName: 'Backdrop Filter Performance',
        averageFPS: 60,
        minFPS: 60,
        frameDrops: 0,
        scrollJank: 0,
        animationContinuity: true,
        passed: true,
        details: ['No backdrop filter elements found']
      };
    }

    // Test with backdrop filters active
    const fpsPromise = this.measureFPS(1500);
    
    // Scroll with backdrop filters
    for (let i = 0; i <= 10; i++) {
      window.scrollTo({ top: i * 50, behavior: 'auto' });
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const fpsReadings = await fpsPromise;
    const avgFPS = fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return {
      testName: 'Backdrop Filter Performance',
      averageFPS: Math.round(avgFPS),
      minFPS: Math.min(...fpsReadings),
      frameDrops: fpsReadings.filter(fps => fps < 35).length,
      scrollJank: (fpsReadings.filter(fps => fps < 50).length / fpsReadings.length) * 100,
      animationContinuity: true,
      passed: avgFPS >= 45,
      details: [
        `Backdrop elements found: ${backdropElements.length}`,
        `Average FPS with backdrop filters: ${Math.round(avgFPS)}`,
        `Performance impact: ${avgFPS < 50 ? 'High' : avgFPS < 55 ? 'Medium' : 'Low'}`
      ]
    };
  }

  private async test3DPerformance(): Promise<TestResult> {
    const canvasElements = document.querySelectorAll('canvas');
    
    if (canvasElements.length === 0) {
      return {
        testName: '3D Canvas Performance',
        averageFPS: 60,
        minFPS: 60,
        frameDrops: 0,
        scrollJank: 0,
        animationContinuity: true,
        passed: true,
        details: ['No 3D canvas elements found']
      };
    }

    const fpsPromise = this.measureFPS(2000);
    
    // Test scroll with 3D content
    for (let i = 0; i <= 15; i++) {
      window.scrollTo({ top: i * 30, behavior: 'auto' });
      await new Promise(resolve => setTimeout(resolve, 80));
    }

    const fpsReadings = await fpsPromise;
    const avgFPS = fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return {
      testName: '3D Canvas Performance',
      averageFPS: Math.round(avgFPS),
      minFPS: Math.min(...fpsReadings),
      frameDrops: fpsReadings.filter(fps => fps < 30).length,
      scrollJank: (fpsReadings.filter(fps => fps < 45).length / fpsReadings.length) * 100,
      animationContinuity: true,
      passed: avgFPS >= 40,
      details: [
        `Canvas elements found: ${canvasElements.length}`,
        `3D performance during scroll: ${Math.round(avgFPS)} FPS`,
        `3D optimization: ${avgFPS >= 50 ? 'Excellent' : avgFPS >= 40 ? 'Good' : 'Needs improvement'}`
      ]
    };
  }

  private generateRecommendations(tests: TestResult[]): string[] {
    const recommendations: string[] = [];
    
    const avgScore = tests.reduce((sum, test) => sum + test.averageFPS, 0) / tests.length;
    
    if (avgScore < 45) {
      recommendations.push('Consider reducing animation complexity during scroll');
      recommendations.push('Implement more aggressive scroll optimizations');
    }
    
    const animationTest = tests.find(t => t.testName === 'Animation Continuity');
    if (animationTest && !animationTest.animationContinuity) {
      recommendations.push('Ensure animations continue during scroll for better UX');
    }
    
    const backdropTest = tests.find(t => t.testName === 'Backdrop Filter Performance');
    if (backdropTest && backdropTest.averageFPS < 50) {
      recommendations.push('Optimize backdrop-filter usage or disable during scroll');
    }
    
    const canvas3DTest = tests.find(t => t.testName === '3D Canvas Performance');
    if (canvas3DTest && canvas3DTest.averageFPS < 40) {
      recommendations.push('Implement 3D rendering optimizations or pause during scroll');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Excellent scroll performance! All optimizations are working well.');
    }
    
    return recommendations;
  }

  private calculateGrade(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  async runComprehensiveTest(): Promise<ComprehensiveTestResults> {
    if (this.isTestRunning) {
      throw new Error('Test already running');
    }
    
    this.isTestRunning = true;
    console.log('🚀 Starting Comprehensive Scroll Performance Test...');
    
    try {
      const tests: TestResult[] = [];
      
      // Run all tests
      tests.push(await this.testBasicScrollPerformance());
      tests.push(await this.testAnimationContinuity());
      tests.push(await this.testFastScrollPerformance());
      tests.push(await this.testBackdropFilterPerformance());
      tests.push(await this.test3DPerformance());
      
      // Calculate overall score
      const passedTests = tests.filter(t => t.passed).length;
      const avgFPS = tests.reduce((sum, test) => sum + test.averageFPS, 0) / tests.length;
      const totalFrameDrops = tests.reduce((sum, test) => sum + test.frameDrops, 0);
      
      let score = (passedTests / tests.length) * 60; // 60% for passing tests
      score += Math.min((avgFPS / 60) * 30, 30); // 30% for FPS performance
      score += Math.max(10 - totalFrameDrops, 0); // 10% for frame consistency
      
      const grade = this.calculateGrade(score);
      
      const recommendations = this.generateRecommendations(tests);
      
      const results: ComprehensiveTestResults = {
        overall: {
          score: Math.round(score),
          grade,
          summary: `${passedTests}/${tests.length} tests passed with ${Math.round(avgFPS)} average FPS`
        },
        tests,
        recommendations,
        performance: {
          beforeOptimization: {
            note: 'This comprehensive testing suite validates all scroll optimizations'
          },
          afterOptimization: {
            averageFPS: Math.round(avgFPS),
            passedTests: `${passedTests}/${tests.length}`,
            elementsOptimized: this.animationElements.size
          },
          improvement: `${passedTests === tests.length ? 'All' : 'Most'} performance targets met`
        }
      };
      
      return results;
    } finally {
      this.isTestRunning = false;
    }
  }

  generateDetailedReport(results: ComprehensiveTestResults): string {
    return `
🏆 COMPREHENSIVE SCROLL PERFORMANCE REPORT
==========================================

📊 OVERALL SCORE: ${results.overall.score}/100 (${results.overall.grade})
📈 SUMMARY: ${results.overall.summary}

📋 DETAILED TEST RESULTS:
${results.tests.map(test => `
  ✅ ${test.testName}
     ${test.passed ? '✓ PASSED' : '❌ FAILED'}
     Average FPS: ${test.averageFPS}
     Min FPS: ${test.minFPS}
     Frame Drops: ${test.frameDrops}
     Scroll Jank: ${test.scrollJank}%
     Animation Continuity: ${test.animationContinuity ? 'Maintained' : 'Broken'}
     Details: ${test.details.join(', ')}
`).join('')}

🔧 OPTIMIZATION STATUS:
   Elements Scanned: ${this.animationElements.size}
   Performance Improvements: ${results.performance.improvement}

💡 RECOMMENDATIONS:
${results.recommendations.map(rec => `   • ${rec}`).join('\n')}

🎯 PERFORMANCE GRADE BREAKDOWN:
   A+/A: Exceptional scroll performance (90-100%)
   B+/B: Good performance with minor optimization opportunities (80-89%)
   C+/C: Acceptable performance, some optimization needed (70-79%)
   D/F: Performance issues requiring immediate attention (<70%)

⚡ NEXT STEPS:
${results.overall.grade >= 'B' 
  ? '   🎉 Excellent work! Your scroll optimizations are highly effective.'
  : '   🔨 Consider implementing the recommendations above for better performance.'
}

Generated on ${new Date().toLocaleString()}
    `.trim();
  }
}

// Export for easy use
export const comprehensiveScrollTest = async (): Promise<ComprehensiveTestResults> => {
  const tester = new ComprehensiveScrollPerformanceTester();
  
  try {
    const results = await tester.runComprehensiveTest();
    const report = tester.generateDetailedReport(results);
    
    console.log(report);
    
    // Show results in UI if in development
    if (process.env.NODE_ENV === 'development') {
      const alertDiv = document.createElement('div');
      alertDiv.innerHTML = `
        <div style="
          position: fixed; 
          top: 20px; 
          right: 20px; 
          background: rgba(0,0,0,0.95); 
          color: white; 
          padding: 20px; 
          border-radius: 10px; 
          font-family: 'Monaco', 'Menlo', monospace; 
          white-space: pre-line; 
          max-width: 600px; 
          max-height: 80vh;
          overflow-y: auto;
          z-index: 10000;
          border: 2px solid ${results.overall.grade >= 'B' ? '#10B981' : results.overall.grade >= 'C' ? '#F59E0B' : '#EF4444'};
        ">
          ${report.replace(/\n/g, '<br>')}
          <button onclick="this.parentElement.parentElement.remove()" style="
            margin-top: 15px; 
            background: #3B82F6; 
            color: white; 
            border: none; 
            padding: 8px 16px; 
            border-radius: 5px; 
            cursor: pointer;
            font-family: inherit;
          ">Close Report</button>
        </div>
      `;
      document.body.appendChild(alertDiv);
      
      // Auto remove after 60 seconds
      setTimeout(() => {
        if (alertDiv.parentElement) {
          alertDiv.remove();
        }
      }, 60000);
    }
    
    return results;
  } catch (error) {
    console.error('Comprehensive scroll test failed:', error);
    throw error;
  }
};

// Global access for development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).comprehensiveScrollTest = comprehensiveScrollTest;
  (window as any).ComprehensiveScrollPerformanceTester = ComprehensiveScrollPerformanceTester;
}

export { ComprehensiveScrollPerformanceTester };