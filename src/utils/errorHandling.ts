/**
 * Enhanced Error Handling Utilities for OneAI
 * 
 * Provides structured error handling, logging, and recovery mechanisms
 * for improved application stability and security.
 */

import { toast } from 'sonner';

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Structured error interface
export interface StructuredError {
  code: string;
  message: string;
  severity: ErrorSeverity;
  context?: Record<string, unknown>;
  timestamp: number;
}

// Error codes enum for consistent error identification
export enum ErrorCode {
  // Storage related errors
  STORAGE_UNAVAILABLE = 'STORAGE_UNAVAILABLE',
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  STORAGE_READ_ERROR = 'STORAGE_READ_ERROR',
  STORAGE_WRITE_ERROR = 'STORAGE_WRITE_ERROR',
  
  // Encryption/security related errors
  ENCRYPTION_FAILED = 'ENCRYPTION_FAILED',
  DECRYPTION_FAILED = 'DECRYPTION_FAILED',
  HASH_MISMATCH = 'HASH_MISMATCH',
  
  // Data validation errors
  INVALID_NOTE_FORMAT = 'INVALID_NOTE_FORMAT',
  INVALID_SHARE_LINK = 'INVALID_SHARE_LINK',
  
  // App state errors
  APP_INITIALIZATION_FAILED = 'APP_INITIALIZATION_FAILED',
  COMPONENT_RENDER_ERROR = 'COMPONENT_RENDER_ERROR',
  
  // Network errors
  NETWORK_UNAVAILABLE = 'NETWORK_UNAVAILABLE',
  SHARE_LINK_GENERATION_FAILED = 'SHARE_LINK_GENERATION_FAILED',
  
  // Security system errors
  SECURITY_ERROR = 'SECURITY_ERROR',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  CSP_VIOLATION = 'CSP_VIOLATION',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CONTENT_POLICY_VIOLATION = 'CONTENT_POLICY_VIOLATION',
  
  // API security errors
  AI_ERROR = 'AI_ERROR',
  AI_RESPONSE_VALIDATION_ERROR = 'AI_RESPONSE_VALIDATION_ERROR',
  PROMPT_INJECTION_ATTEMPT = 'PROMPT_INJECTION_ATTEMPT',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  
  // Supabase security errors
  SUPABASE_FUNCTION_ERROR = 'SUPABASE_FUNCTION_ERROR',
  REALTIME_ERROR = 'REALTIME_ERROR',
  LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',
  
  // Subscription and usage tracking errors
  SUBSCRIPTION_ERROR = 'SUBSCRIPTION_ERROR',
  USAGE_TRACKING_ERROR = 'USAGE_TRACKING_ERROR',
  
  // Performance issues
  PERFORMANCE_ISSUE = 'PERFORMANCE_ISSUE',
  
  // Unknown errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Error logging options
interface ErrorLogOptions {
  notify?: boolean; // Whether to show a notification to the user
  consoleLog?: boolean; // Whether to log to console
  persistLog?: boolean; // Whether to persist the error log to storage
}

// Maximum number of errors to keep in localStorage
const MAX_ERROR_LOG_SIZE = 50;

/**
 * Creates a structured error object
 */
export const createError = (
  code: ErrorCode,
  message: string,
  severity: ErrorSeverity,
  context?: Record<string, unknown>
): StructuredError => {
  return {
    code,
    message,
    severity,
    context,
    timestamp: Date.now()
  };
};

/**
 * Logs an error with configurable options for notification and persistence
 */
export const logError = (
  error: StructuredError,
  options: ErrorLogOptions = { notify: true, consoleLog: true, persistLog: true }
): void => {
  // Always add structured data to error logs for better debugging
  const errorData = {
    ...error,
    environment: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    }
  };
  
  // Console logging with appropriate method based on severity
  if (options.consoleLog) {
    switch (error.severity) {
      case ErrorSeverity.INFO:
        console.info(`[${error.code}]`, errorData);
        break;
      case ErrorSeverity.WARNING:
        console.warn(`[${error.code}]`, errorData);
        break;
      case ErrorSeverity.ERROR:
      case ErrorSeverity.CRITICAL:
        console.error(`[${error.code}]`, errorData);
        break;
    }
  }
  
  // User notification
  if (options.notify) {
    const variant = error.severity === ErrorSeverity.INFO 
      ? undefined 
      : (error.severity === ErrorSeverity.WARNING ? 'warning' : 'destructive');
      
    // Map severity to appropriate toast style
    if (error.severity === ErrorSeverity.WARNING) {
      toast.warning(error.message, {
        description: `Error code: ${error.code}`
      });
    } else if (error.severity === ErrorSeverity.ERROR || error.severity === ErrorSeverity.CRITICAL) {
      toast.error(error.message, {
        description: `Error code: ${error.code}`
      });
    } else {
      toast.info(error.message, {
        description: `Error code: ${error.code}`
      });
    }
  }
  
  // Persist error to local storage for later analysis
  if (options.persistLog) {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('oneai-error-log') || '[]');
      storedErrors.unshift(errorData);
      
      // Limit the number of stored errors
      while (storedErrors.length > MAX_ERROR_LOG_SIZE) {
        storedErrors.pop();
      }
      
      localStorage.setItem('oneai-error-log', JSON.stringify(storedErrors));
    } catch (e) {
      // If storing the error itself fails, just log to console
      console.error('Failed to persist error log:', e);
    }
  }
};

/**
 * Safely executes a function with comprehensive error handling
 */
export const safeExecute = async <T>(
  operation: () => Promise<T>,
  errorCode: ErrorCode,
  errorMessage: string,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  context?: Record<string, unknown>
): Promise<{ success: boolean; data?: T; error?: StructuredError }> => {
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (err) {
    const errorObj = createError(
      errorCode,
      err instanceof Error ? `${errorMessage}: ${err.message}` : errorMessage,
      severity,
      {
        ...(context || {}),
        originalError: err instanceof Error ? { 
          message: err.message,
          stack: err.stack
        } : String(err)
      }
    );
    
    logError(errorObj);
    return { success: false, error: errorObj };
  }
};

/**
 * Retrieves stored error logs for debugging
 */
export const getErrorLogs = (): StructuredError[] => {
  try {
    return JSON.parse(localStorage.getItem('oneai-error-log') || '[]');
  } catch (e) {
    console.error('Failed to retrieve error logs:', e);
    return [];
  }
};

/**
 * Clears error logs from storage
 */
export const clearErrorLogs = (): void => {
  localStorage.removeItem('oneai-error-log');
};

/**
 * Provides user-friendly error messages for common error codes
 */
export const getUserFriendlyErrorMessage = (code: ErrorCode): string => {
  switch (code) {
    case ErrorCode.STORAGE_UNAVAILABLE:
      return 'Storage is unavailable. Your browser may be in private mode or storage permissions are denied.';
    case ErrorCode.STORAGE_QUOTA_EXCEEDED:
      return 'Storage is full. Please delete some notes to free up space.';
    case ErrorCode.ENCRYPTION_FAILED:
    case ErrorCode.DECRYPTION_FAILED:
      return 'Encryption operation failed. This may be due to an unsupported browser or corrupted data.';
    case ErrorCode.NETWORK_UNAVAILABLE:
      return 'Network connection is unavailable. Some features may not work properly.';
    case ErrorCode.INVALID_SHARE_LINK:
      return 'The share link is invalid or has expired.';
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
};

/**
 * Error boundary fallback component props
 */
export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Detects if browser storage is available and functioning
 */
export const isStorageAvailable = (type: 'localStorage' | 'sessionStorage' | 'indexedDB'): boolean => {
  try {
    if (type === 'indexedDB') {
      return !!window.indexedDB;
    }
    
    const storage = window[type];
    const testKey = 'oneai-storage-test';
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};
