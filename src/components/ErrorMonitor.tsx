
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { addPageLifecycleListeners } from '@/utils/eventListenerUtils';

interface ErrorStatus {
  corsErrors: number;
  networkErrors: number;
  tiptapWarnings: number;
  lastUpdated: Date;
}

const ErrorMonitor: React.FC = () => {
  const [errorStatus, setErrorStatus] = useState<ErrorStatus>({
    corsErrors: 0,
    networkErrors: 0,
    tiptapWarnings: 0,
    lastUpdated: new Date()
  });

  useEffect(() => {
    // Monitor console for errors
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('CORS')) {
        setErrorStatus(prev => ({ 
          ...prev, 
          corsErrors: prev.corsErrors + 1,
          lastUpdated: new Date()
        }));
      } else if (message.includes('Failed to load resource')) {
        setErrorStatus(prev => ({ 
          ...prev, 
          networkErrors: prev.networkErrors + 1,
          lastUpdated: new Date()
        }));
      }
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      if (message.includes('tiptap warn')) {
        setErrorStatus(prev => ({ 
          ...prev, 
          tiptapWarnings: prev.tiptapWarnings + 1,
          lastUpdated: new Date()
        }));
      }
      originalWarn.apply(console, args);
    };

    // Use modern page lifecycle events instead of deprecated unload
    const cleanupPageListeners = addPageLifecycleListeners({
      onPageHide: () => {
        // Save any pending error data when page is hidden
        if (errorStatus.corsErrors > 0 || errorStatus.networkErrors > 0 || errorStatus.tiptapWarnings > 0) {
          localStorage.setItem('error-monitor-status', JSON.stringify(errorStatus));
        }
      },
      onVisibilityChange: () => {
        // Refresh error status when tab becomes visible again
        if (!document.hidden) {
          setErrorStatus(prev => ({ ...prev, lastUpdated: new Date() }));
        }
      }
    });

    // Cleanup
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      cleanupPageListeners();
    };
  }, [errorStatus.corsErrors, errorStatus.networkErrors, errorStatus.tiptapWarnings]);

  const totalErrors = errorStatus.corsErrors + errorStatus.networkErrors + errorStatus.tiptapWarnings;

  if (totalErrors === 0) {
    return (
      <Alert className="mb-4 border-green-500/20 bg-green-500/10">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <AlertTitle className="text-green-300">System Status: Healthy</AlertTitle>
        <AlertDescription className="text-green-200">
          No critical errors detected. All systems functioning normally.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-amber-500/20 bg-amber-500/10">
      <AlertTriangle className="h-4 w-4 text-amber-400" />
      <AlertTitle className="text-amber-300">System Alerts Detected</AlertTitle>
      <AlertDescription className="text-amber-200 space-y-1">
        {errorStatus.corsErrors > 0 && (
          <div>• CORS Errors: {errorStatus.corsErrors}</div>
        )}
        {errorStatus.networkErrors > 0 && (
          <div>• Network Errors: {errorStatus.networkErrors}</div>
        )}
        {errorStatus.tiptapWarnings > 0 && (
          <div>• Tiptap Warnings: {errorStatus.tiptapWarnings}</div>
        )}
        <div className="text-xs mt-2">
          Last updated: {errorStatus.lastUpdated.toLocaleTimeString()}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorMonitor;
