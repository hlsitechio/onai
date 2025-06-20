
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { sentryAPI, type SentryIssue } from '@/utils/sentryAPI';

interface ErrorContext {
  id: string;
  timestamp: Date;
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  component?: string;
  url: string;
  userAgent: string;
}

interface ErrorMonitoringContextType {
  errors: ErrorContext[];
  sentryIssues: SentryIssue[];
  addError: (error: Omit<ErrorContext, 'id' | 'timestamp' | 'userAgent' | 'url'>) => void;
  clearErrors: () => void;
  refreshSentryData: () => Promise<void>;
  isMonitoring: boolean;
  toggleMonitoring: () => void;
}

const ErrorMonitoringContext = createContext<ErrorMonitoringContextType | undefined>(undefined);

interface ErrorMonitoringProviderProps {
  children: ReactNode;
}

export const ErrorMonitoringProvider: React.FC<ErrorMonitoringProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorContext[]>([]);
  const [sentryIssues, setSentryIssues] = useState<SentryIssue[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  const addError = (errorData: Omit<ErrorContext, 'id' | 'timestamp' | 'userAgent' | 'url'>) => {
    if (!isMonitoring) return;

    const error: ErrorContext = {
      ...errorData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    setErrors(prev => {
      const updated = [...prev, error].slice(-100); // Keep last 100 errors
      
      // Store in localStorage for persistence
      try {
        localStorage.setItem('error-monitoring-data', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to store error data in localStorage:', e);
      }
      
      return updated;
    });

    // Also send to Sentry if it's an error level
    if (errorData.level === 'error') {
      Sentry.captureException(new Error(errorData.message), {
        contexts: {
          component: { name: errorData.component || 'Unknown' },
        },
        tags: {
          monitoring: 'error-dashboard',
        },
      });
    }
  };

  const clearErrors = () => {
    setErrors([]);
    localStorage.removeItem('error-monitoring-data');
  };

  const refreshSentryData = async () => {
    if (sentryAPI.isConfigured()) {
      try {
        const issues = await sentryAPI.getRecentIssues(25);
        setSentryIssues(issues);
      } catch (error) {
        console.error('Failed to refresh Sentry data:', error);
      }
    }
  };

  const toggleMonitoring = () => {
    setIsMonitoring(prev => !prev);
  };

  useEffect(() => {
    // Load persisted errors on mount
    try {
      const stored = localStorage.getItem('error-monitoring-data');
      if (stored) {
        const parsedErrors = JSON.parse(stored).map((error: any) => ({
          ...error,
          timestamp: new Date(error.timestamp),
        }));
        setErrors(parsedErrors);
      }
    } catch (e) {
      console.warn('Failed to load persisted error data:', e);
    }

    // Initial Sentry data fetch
    refreshSentryData();

    // Set up error interception
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      addError({
        level: 'error',
        message,
        stack: new Error().stack,
      });

      originalError.apply(console, args);
    };

    console.warn = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      addError({
        level: 'warn',
        message,
      });

      originalWarn.apply(console, args);
    };

    // Set up unhandled error capture
    const handleError = (event: ErrorEvent) => {
      addError({
        level: 'error',
        message: event.message,
        stack: event.error?.stack,
        component: 'Global Error Handler',
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      addError({
        level: 'error',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        component: 'Promise Rejection Handler',
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    // Cleanup
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [isMonitoring]);

  // Refresh Sentry data periodically
  useEffect(() => {
    const interval = setInterval(refreshSentryData, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const value: ErrorMonitoringContextType = {
    errors,
    sentryIssues,
    addError,
    clearErrors,
    refreshSentryData,
    isMonitoring,
    toggleMonitoring,
  };

  return (
    <ErrorMonitoringContext.Provider value={value}>
      {children}
    </ErrorMonitoringContext.Provider>
  );
};

export const useErrorMonitoring = () => {
  const context = useContext(ErrorMonitoringContext);
  if (context === undefined) {
    throw new Error('useErrorMonitoring must be used within an ErrorMonitoringProvider');
  }
  return context;
};
