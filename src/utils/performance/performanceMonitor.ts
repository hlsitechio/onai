/**
 * Performance Monitoring Utilities for OneAI
 * 
 * Provides client-side performance tracking and optimization
 * without requiring external monitoring services.
 */

import { ErrorCode, ErrorSeverity, createError, logError } from '../errorHandling';

// Performance metrics thresholds
const THRESHOLDS = {
  OPERATION_SLOW_MS: 300,       // Operation considered slow if it exceeds this threshold
  OPERATION_CRITICAL_MS: 1000,  // Operation considered critically slow
  RENDER_SLOW_MS: 50,           // Render considered slow
  STORAGE_SLOW_MS: 200,         // Storage operation considered slow
  MAX_METRICS_STORED: 100,      // Maximum number of metrics to store in localStorage
};

// Performance metric types
export enum MetricType {
  NOTE_SAVE = 'note_save',
  NOTE_LOAD = 'note_load',
  NOTE_DELETE = 'note_delete',
  EDITOR_RENDER = 'editor_render',
  SIDEBAR_RENDER = 'sidebar_render',
  SEARCH_OPERATION = 'search_operation',
  SHARE_OPERATION = 'share_operation',
  ENCRYPTION = 'encryption',
  DECRYPTION = 'decryption',
  EXPORT_OPERATION = 'export_operation',
  IMPORT_OPERATION = 'import_operation',
  CUSTOM = 'custom',
}

// Performance metric interface
export interface PerformanceMetric {
  id: string;
  type: MetricType;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

// Map of active performance metrics being tracked
const activeMetrics: Map<string, PerformanceMetric> = new Map();

// Generate a unique ID for a metric
const generateMetricId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Starts tracking a performance metric
 */
export const startPerformanceMetric = (
  type: MetricType,
  metadata?: Record<string, unknown>
): string => {
  const id = generateMetricId();
  const metric: PerformanceMetric = {
    id,
    type,
    startTime: performance.now(),
    metadata,
    timestamp: Date.now(),
  };
  
  activeMetrics.set(id, metric);
  return id;
};

/**
 * Ends tracking a performance metric and saves the result
 */
export const endPerformanceMetric = (id: string): PerformanceMetric | null => {
  const metric = activeMetrics.get(id);
  if (!metric) {
    console.warn(`Performance metric with ID ${id} not found`);
    return null;
  }
  
  const endTime = performance.now();
  const duration = endTime - metric.startTime;
  
  // Update metric with timing data
  metric.endTime = endTime;
  metric.duration = duration;
  
  // Remove from active metrics
  activeMetrics.delete(id);
  
  // Check if metric exceeds thresholds and log if necessary
  if (shouldLogMetric(metric)) {
    logMetricPerformanceIssue(metric);
  }
  
  // Save metric to storage
  saveMetricToStorage(metric);
  
  return metric;
};

/**
 * Utility function to track a complete operation in one call
 */
export const trackOperationPerformance = async <T>(
  type: MetricType,
  operation: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> => {
  const metricId = startPerformanceMetric(type, metadata);
  
  try {
    const result = await operation();
    endPerformanceMetric(metricId);
    return result;
  } catch (error) {
    // Still end the metric if operation fails
    endPerformanceMetric(metricId);
    throw error;
  }
};

/**
 * Checks if a metric exceeds thresholds and should be logged
 */
const shouldLogMetric = (metric: PerformanceMetric): boolean => {
  if (!metric.duration) return false;
  
  switch (metric.type) {
    case MetricType.NOTE_SAVE:
    case MetricType.NOTE_LOAD:
    case MetricType.NOTE_DELETE:
    case MetricType.IMPORT_OPERATION:
    case MetricType.EXPORT_OPERATION:
      return metric.duration > THRESHOLDS.STORAGE_SLOW_MS;
      
    case MetricType.EDITOR_RENDER:
    case MetricType.SIDEBAR_RENDER:
      return metric.duration > THRESHOLDS.RENDER_SLOW_MS;
      
    case MetricType.SEARCH_OPERATION:
    case MetricType.SHARE_OPERATION:
    case MetricType.ENCRYPTION:
    case MetricType.DECRYPTION:
      return metric.duration > THRESHOLDS.OPERATION_SLOW_MS;
      
    case MetricType.CUSTOM:
    default:
      // For custom operations, log if critically slow
      return metric.duration > THRESHOLDS.OPERATION_CRITICAL_MS;
  }
};

/**
 * Logs a performance issue for a metric
 */
const logMetricPerformanceIssue = (metric: PerformanceMetric): void => {
  if (!metric.duration) return;
  
  const severity = metric.duration > THRESHOLDS.OPERATION_CRITICAL_MS
    ? ErrorSeverity.WARNING
    : ErrorSeverity.INFO;
  
  const error = createError(
    ErrorCode.PERFORMANCE_ISSUE,
    `Slow ${metric.type} operation: ${metric.duration.toFixed(2)}ms`,
    severity,
    {
      metricType: metric.type,
      duration: metric.duration,
      ...metric.metadata
    }
  );
  
  logError(error, { notify: false, persistLog: true, consoleLog: true });
};

/**
 * Saves a metric to localStorage
 */
const saveMetricToStorage = (metric: PerformanceMetric): void => {
  try {
    // Get existing metrics
    const metricsJson = localStorage.getItem('oneai-performance-metrics');
    const metrics: PerformanceMetric[] = metricsJson ? JSON.parse(metricsJson) : [];
    
    // Add new metric
    metrics.unshift(metric);
    
    // Limit number of stored metrics
    while (metrics.length > THRESHOLDS.MAX_METRICS_STORED) {
      metrics.pop();
    }
    
    // Save back to storage
    localStorage.setItem('oneai-performance-metrics', JSON.stringify(metrics));
  } catch (error) {
    console.error('Failed to save performance metric:', error);
  }
};

/**
 * Gets all stored performance metrics
 */
export const getPerformanceMetrics = (): PerformanceMetric[] => {
  try {
    const metricsJson = localStorage.getItem('oneai-performance-metrics');
    return metricsJson ? JSON.parse(metricsJson) : [];
  } catch (error) {
    console.error('Failed to retrieve performance metrics:', error);
    return [];
  }
};

/**
 * Clears all stored performance metrics
 */
export const clearPerformanceMetrics = (): void => {
  localStorage.removeItem('oneai-performance-metrics');
};

/**
 * Gets performance metrics filtered by type
 */
export const getMetricsByType = (type: MetricType): PerformanceMetric[] => {
  const allMetrics = getPerformanceMetrics();
  return allMetrics.filter(metric => metric.type === type);
};

/**
 * Gets average duration for a specific metric type
 */
export const getAverageDuration = (type: MetricType): number | null => {
  const metrics = getMetricsByType(type);
  
  if (metrics.length === 0) return null;
  
  const totalDuration = metrics.reduce((sum, metric) => {
    return sum + (metric.duration || 0);
  }, 0);
  
  return totalDuration / metrics.length;
};

/**
 * React hook to measure component render time
 */
export const measureComponentRender = (
  componentName: string,
  renderTime: number
): void => {
  if (renderTime > THRESHOLDS.RENDER_SLOW_MS) {
    const error = createError(
      ErrorCode.PERFORMANCE_ISSUE,
      `Slow render for component ${componentName}: ${renderTime.toFixed(2)}ms`,
      renderTime > THRESHOLDS.OPERATION_SLOW_MS ? ErrorSeverity.WARNING : ErrorSeverity.INFO,
      { componentName, renderTime }
    );
    
    logError(error, { notify: false, persistLog: true, consoleLog: true });
  }
};

/**
 * Gets performance recommendations based on collected metrics
 */
export const getPerformanceRecommendations = (): string[] => {
  const recommendations: string[] = [];
  const metrics = getPerformanceMetrics();
  
  if (metrics.length === 0) {
    return ['Not enough performance data collected yet.'];
  }
  
  // Check for slow storage operations
  const storageMetrics = metrics.filter(m => 
    [MetricType.NOTE_SAVE, MetricType.NOTE_LOAD, MetricType.NOTE_DELETE].includes(m.type)
  );
  
  const slowStorageOps = storageMetrics.filter(m => 
    m.duration && m.duration > THRESHOLDS.STORAGE_SLOW_MS
  );
  
  if (slowStorageOps.length > storageMetrics.length * 0.3) {
    recommendations.push(
      'Storage operations are slow. Consider using smaller note sizes or check your browser storage.'
    );
  }
  
  // Check for slow renders
  const renderMetrics = metrics.filter(m => 
    [MetricType.EDITOR_RENDER, MetricType.SIDEBAR_RENDER].includes(m.type)
  );
  
  const slowRenders = renderMetrics.filter(m => 
    m.duration && m.duration > THRESHOLDS.RENDER_SLOW_MS
  );
  
  if (slowRenders.length > renderMetrics.length * 0.3) {
    recommendations.push(
      'UI rendering is slow. Consider using fewer notes in the sidebar or reducing editor content size.'
    );
  }
  
  // Check encryption performance
  const encryptionMetrics = metrics.filter(m => 
    m.type === MetricType.ENCRYPTION || m.type === MetricType.DECRYPTION
  );
  
  const slowEncryption = encryptionMetrics.filter(m => 
    m.duration && m.duration > THRESHOLDS.OPERATION_SLOW_MS
  );
  
  if (slowEncryption.length > encryptionMetrics.length * 0.3) {
    recommendations.push(
      'Encryption operations are slow. Consider disabling encryption for non-sensitive notes.'
    );
  }
  
  // Add general recommendations
  if (recommendations.length === 0) {
    recommendations.push('Performance is good. No specific recommendations at this time.');
  }
  
  return recommendations;
};
