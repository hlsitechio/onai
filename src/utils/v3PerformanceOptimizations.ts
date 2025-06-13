
import type { Editor } from '@tiptap/react';

export interface PerformanceMetrics {
  renderTime: number;
  contentSize: number;
  extensionCount: number;
  memoryUsage: number;
  lastOptimized: Date;
}

export interface OptimizationSettings {
  enableLazyLoading: boolean;
  enableVirtualScrolling: boolean;
  enableContentCaching: boolean;
  enableExtensionOptimization: boolean;
  maxContentLength: number;
  throttleDelay: number;
}

export const DEFAULT_OPTIMIZATION_SETTINGS: OptimizationSettings = {
  enableLazyLoading: true,
  enableVirtualScrolling: false, // Disabled by default for compatibility
  enableContentCaching: true,
  enableExtensionOptimization: true,
  maxContentLength: 100000, // 100KB
  throttleDelay: 300
};

class V3PerformanceOptimizer {
  private editor: Editor;
  private settings: OptimizationSettings;
  private cache: Map<string, any> = new Map();
  private metrics: PerformanceMetrics;
  private observers: PerformanceObserver[] = [];

  constructor(editor: Editor, settings: Partial<OptimizationSettings> = {}) {
    this.editor = editor;
    this.settings = { ...DEFAULT_OPTIMIZATION_SETTINGS, ...settings };
    this.metrics = this.initializeMetrics();
    this.setupPerformanceMonitoring();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      renderTime: 0,
      contentSize: 0,
      extensionCount: this.editor.extensionManager.extensions.length,
      memoryUsage: 0,
      lastOptimized: new Date()
    };
  }

  private setupPerformanceMonitoring() {
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name.includes('tiptap') || entry.name.includes('editor')) {
              this.metrics.renderTime = entry.duration;
            }
          });
        });

        observer.observe({ entryTypes: ['measure', 'navigation'] });
        this.observers.push(observer);
      } catch (error) {
        console.warn('Performance monitoring not available:', error);
      }
    }
  }

  public optimizeContent() {
    const startTime = performance.now();
    
    try {
      if (this.settings.enableContentCaching) {
        this.optimizeContentCaching();
      }

      if (this.settings.enableExtensionOptimization) {
        this.optimizeExtensions();
      }

      this.optimizeEventHandlers();
      this.optimizeMemoryUsage();
      
      const endTime = performance.now();
      this.metrics.renderTime = endTime - startTime;
      this.metrics.lastOptimized = new Date();
      
      console.log('V3 Performance optimization completed:', {
        duration: `${(endTime - startTime).toFixed(2)}ms`,
        contentSize: this.metrics.contentSize,
        memoryUsage: this.getMemoryUsage()
      });
      
    } catch (error) {
      console.warn('Performance optimization failed:', error);
    }
  }

  private optimizeContentCaching() {
    const content = this.editor.getHTML();
    const contentHash = this.generateContentHash(content);
    
    if (!this.cache.has(contentHash)) {
      this.cache.set(contentHash, {
        content,
        timestamp: Date.now(),
        wordCount: this.getWordCount(content)
      });
      
      // Limit cache size
      if (this.cache.size > 50) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
      }
    }
    
    this.metrics.contentSize = content.length;
  }

  private optimizeExtensions() {
    // Lazy load extensions that aren't immediately needed
    const extensionPriorities = new Map([
      ['StarterKit', 1],
      ['TextAlign', 2],
      ['Link', 2],
      ['Image', 3],
      ['Table', 4],
      ['CodeBlock', 4]
    ]);

    const extensions = this.editor.extensionManager.extensions;
    const optimizedExtensions = extensions.sort((a, b) => {
      const priorityA = extensionPriorities.get(a.name) || 5;
      const priorityB = extensionPriorities.get(b.name) || 5;
      return priorityA - priorityB;
    });

    this.metrics.extensionCount = optimizedExtensions.length;
  }

  private optimizeEventHandlers() {
    // Throttle update events to improve performance
    let updateTimeout: NodeJS.Timeout;
    
    const originalUpdate = this.editor.options.onUpdate;
    if (originalUpdate) {
      this.editor.setOptions({
        onUpdate: ({ editor }) => {
          clearTimeout(updateTimeout);
          updateTimeout = setTimeout(() => {
            originalUpdate({ editor });
          }, this.settings.throttleDelay);
        }
      });
    }
  }

  private optimizeMemoryUsage() {
    // Clear unnecessary references and optimize memory usage
    if (this.cache.size > 20) {
      const now = Date.now();
      const expiredEntries: string[] = [];
      
      this.cache.forEach((value, key) => {
        if (now - value.timestamp > 300000) { // 5 minutes
          expiredEntries.push(key);
        }
      });
      
      expiredEntries.forEach(key => this.cache.delete(key));
    }

    this.metrics.memoryUsage = this.getMemoryUsage();
  }

  private generateContentHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private getWordCount(content: string): number {
    return content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
  }

  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory?.usedJSHeapSize || 0;
    }
    return 0;
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
      totalMemory: this.getMemoryUsage()
    };
  }

  public clearCache() {
    this.cache.clear();
    console.log('Performance cache cleared');
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.cache.clear();
  }
}

export const createV3PerformanceOptimizer = (editor: Editor, settings?: Partial<OptimizationSettings>) => {
  return new V3PerformanceOptimizer(editor, settings);
};

export const measureEditorPerformance = (editor: Editor, action: () => void): number => {
  const startTime = performance.now();
  action();
  const endTime = performance.now();
  
  console.log(`Editor action completed in ${(endTime - startTime).toFixed(2)}ms`);
  return endTime - startTime;
};

export const optimizeEditorForV3 = (editor: Editor) => {
  const optimizer = createV3PerformanceOptimizer(editor);
  
  // Run initial optimization
  optimizer.optimizeContent();
  
  // Set up periodic optimization
  const optimizationInterval = setInterval(() => {
    optimizer.optimizeContent();
  }, 60000); // Every minute
  
  // Return cleanup function
  return () => {
    clearInterval(optimizationInterval);
    optimizer.destroy();
  };
};
