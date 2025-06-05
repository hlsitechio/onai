import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '../ui/button';
import browserDetection from '../../utils/browserDetection';

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  async componentDidCatch(error, errorInfo) {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get modern browser info for error reporting
    const browserInfo = await browserDetection.getMinimalBrowserInfo();
    
    // Log error details
    console.error('🚨 Error Boundary Caught Error:', {
      errorId,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      browserInfo
    });

    // Update state with error details
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Report to error tracking service (if available)
    if (window.errorTracker) {
      window.errorTracker.captureException(error, {
        extra: errorInfo,
        tags: { errorId, component: 'ErrorBoundary' },
        contexts: { browser: browserInfo }
      });
    }

    // Store error in localStorage for debugging
    try {
      const errorLog = JSON.parse(localStorage.getItem('onai-error-log') || '[]');
      errorLog.push({
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        browserInfo, // Use modern browser info instead of userAgent
        url: window.location.href
      });
      
      // Keep only last 10 errors
      if (errorLog.length > 10) {
        errorLog.splice(0, errorLog.length - 10);
      }
      
      localStorage.setItem('onai-error-log', JSON.stringify(errorLog));
    } catch (e) {
      console.warn('Failed to store error log:', e);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorId } = this.state;
      const { fallback, showDetails = false } = this.props;

      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, this.handleRetry);
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900/20 via-black to-purple-900/20 p-4">
          <div className="max-w-md w-full space-y-6 text-center">
            {/* Error Icon */}
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                <Bug className="h-4 w-4 text-black" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-white">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-300">
                We encountered an unexpected error. Don't worry, your data is safe.
              </p>
              {errorId && (
                <p className="text-xs text-gray-500 font-mono">
                  Error ID: {errorId}
                </p>
              )}
            </div>

            {/* Error Details (if enabled) */}
            {showDetails && error && (
              <div className="bg-black/30 backdrop-blur-sm border border-red-500/20 rounded-lg p-4 text-left">
                <h3 className="text-sm font-semibold text-red-400 mb-2">Error Details:</h3>
                <pre className="text-xs text-gray-300 overflow-auto max-h-32">
                  {error.message}
                </pre>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button
                  onClick={this.handleRetry}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload
                </Button>
              </div>
              
              <Button
                onClick={this.handleGoHome}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white hover:bg-white/10"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>If this problem persists, try:</p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Clearing your browser cache</li>
                <li>Disabling browser extensions</li>
                <li>Using an incognito/private window</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

/**
 * Hook to manually report errors
 */
export const useErrorHandler = () => {
  const reportError = async (error, context = {}) => {
    const errorId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get modern browser info for error reporting
    const browserInfo = await browserDetection.getMinimalBrowserInfo();
    
    console.error('🚨 Manual Error Report:', {
      errorId,
      error: error.message || error,
      context,
      timestamp: new Date().toISOString(),
      browserInfo
    });

    // Store in localStorage
    try {
      const errorLog = JSON.parse(localStorage.getItem('onai-error-log') || '[]');
      errorLog.push({
        errorId,
        message: error.message || error,
        context,
        timestamp: new Date().toISOString(),
        type: 'manual',
        browserInfo, // Use modern browser info instead of userAgent
        url: window.location.href
      });
      
      if (errorLog.length > 10) {
        errorLog.splice(0, errorLog.length - 10);
      }
      
      localStorage.setItem('onai-error-log', JSON.stringify(errorLog));
    } catch (e) {
      console.warn('Failed to store manual error log:', e);
    }

    return errorId;
  };

  return { reportError };
};

export default ErrorBoundary;

