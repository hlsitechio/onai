/**
 * React Hook for Performance Monitoring
 * 
 * This hook allows React components to easily integrate with
 * our performance monitoring system to track render times and operations.
 */

import { useEffect, useRef } from 'react';
import { 
  MetricType, 
  startPerformanceMetric, 
  endPerformanceMetric, 
  trackOperationPerformance 
} from '../utils/performance/performanceMonitor';

/**
 * Options for usePerformanceMonitor hook
 */
interface UsePerformanceMonitorOptions {
  componentName: string;
  trackRenders?: boolean;
  trackMounts?: boolean;
  dependencies?: any[];
  metadata?: Record<string, any>;
}

/**
 * Result of usePerformanceMonitor hook
 */
interface UsePerformanceMonitorResult {
  trackOperation: <T>(
    operationType: MetricType,
    operation: () => Promise<T>,
    operationMetadata?: Record<string, any>
  ) => Promise<T>;
  startTracking: (
    operationType: MetricType,
    operationMetadata?: Record<string, any>
  ) => string;
  endTracking: (trackingId: string) => void;
}

/**
 * Hook for monitoring performance of React components and operations
 */
export const usePerformanceMonitor = ({
  componentName,
  trackRenders = false,
  trackMounts = true,
  dependencies = [],
  metadata = {}
}: UsePerformanceMonitorOptions): UsePerformanceMonitorResult => {
  // Ref to track render start time
  const renderStartTimeRef = useRef<number>(0);
  
  // Ref to track if component is mounted
  const isMountedRef = useRef<boolean>(false);
  
  // Track mount time
  useEffect(() => {
    if (trackMounts) {
      const mountStartTime = performance.now();
      
      // End tracking after mount is complete
      const timerId = setTimeout(() => {
        const mountDuration = performance.now() - mountStartTime;
        const trackingId = startPerformanceMetric(MetricType.EDITOR_RENDER, {
          componentName,
          operation: 'mount',
          ...metadata
        });
        
        // We simulate end of tracking with the measured duration
        const metric = endPerformanceMetric(trackingId);
        if (metric) {
          metric.duration = mountDuration;
        }
      }, 0);
      
      isMountedRef.current = true;
      
      return () => {
        clearTimeout(timerId);
        isMountedRef.current = false;
      };
    }
  }, [componentName, trackMounts]);
  
  // Track renders based on dependencies
  useEffect(() => {
    if (trackRenders && isMountedRef.current) {
      const renderTime = performance.now() - renderStartTimeRef.current;
      
      const trackingId = startPerformanceMetric(
        componentName.includes('Sidebar') ? MetricType.SIDEBAR_RENDER : MetricType.EDITOR_RENDER,
        {
          componentName,
          operation: 're-render',
          ...metadata
        }
      );
      
      // We simulate end of tracking with the measured duration
      const metric = endPerformanceMetric(trackingId);
      if (metric) {
        metric.duration = renderTime;
      }
    }
    
    // Set render start time for next render
    renderStartTimeRef.current = performance.now();
  }, dependencies);
  
  /**
   * Tracks an async operation and measures its performance
   */
  const trackOperation = <T,>(
    operationType: MetricType,
    operation: () => Promise<T>,
    operationMetadata?: Record<string, unknown>
  ): Promise<T> => {
    return trackOperationPerformance(
      operationType,
      operation,
      {
        componentName,
        ...metadata,
        ...operationMetadata
      }
    );
  };
  
  /**
   * Starts tracking an operation manually
   */
  const startTracking = (
    operationType: MetricType,
    operationMetadata?: Record<string, any>
  ): string => {
    return startPerformanceMetric(
      operationType,
      {
        componentName,
        ...metadata,
        ...operationMetadata
      }
    );
  };
  
  /**
   * Ends tracking an operation manually
   */
  const endTracking = (trackingId: string): void => {
    endPerformanceMetric(trackingId);
  };
  
  return {
    trackOperation,
    startTracking,
    endTracking
  };
};

/**
 * Example usage:
 * 
 * const { trackOperation } = usePerformanceMonitor({
 *   componentName: 'NoteEditor',
 *   trackRenders: true,
 *   dependencies: [noteId, content] // Re-run on these changes
 * });
 * 
 * // Later in your component:
 * const handleSave = async () => {
 *   await trackOperation(
 *     MetricType.NOTE_SAVE,
 *     async () => {
 *       // Your save logic here
 *       await saveNote(noteId, content);
 *     },
 *     { noteSize: content.length }
 *   );
 * };
 */
