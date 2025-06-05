import React, { useState, useCallback } from 'react';
import { RefreshCw, AlertTriangle, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * Retry Mechanism Hook
 * 
 * Provides automatic retry functionality with exponential backoff.
 */
export const useRetry = (maxRetries = 3, baseDelay = 1000) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastError, setLastError] = useState(null);

  const retry = useCallback(async (asyncFunction, options = {}) => {
    const { 
      maxRetries: customMaxRetries = maxRetries,
      baseDelay: customBaseDelay = baseDelay,
      onRetry = null,
      shouldRetry = (error) => true
    } = options;

    let currentRetry = 0;
    
    while (currentRetry <= customMaxRetries) {
      try {
        setIsRetrying(currentRetry > 0);
        setRetryCount(currentRetry);
        
        const result = await asyncFunction();
        
        // Success - reset state
        setRetryCount(0);
        setIsRetrying(false);
        setLastError(null);
        
        return result;
      } catch (error) {
        setLastError(error);
        
        if (currentRetry === customMaxRetries || !shouldRetry(error)) {
          setIsRetrying(false);
          throw error;
        }
        
        currentRetry++;
        
        // Call retry callback if provided
        if (onRetry) {
          onRetry(currentRetry, error);
        }
        
        // Exponential backoff delay
        const delay = customBaseDelay * Math.pow(2, currentRetry - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }, [maxRetries, baseDelay]);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
    setLastError(null);
  }, []);

  return {
    retry,
    retryCount,
    isRetrying,
    lastError,
    reset
  };
};

/**
 * Retry Button Component
 * 
 * A button that handles retry operations with visual feedback.
 */
export const RetryButton = ({ 
  onRetry, 
  loading = false, 
  disabled = false,
  retryCount = 0,
  maxRetries = 3,
  className = '',
  children = 'Retry'
}) => {
  return (
    <Button
      onClick={onRetry}
      disabled={disabled || loading}
      className={`${className} ${loading ? 'opacity-75' : ''}`}
      variant={retryCount > 0 ? 'outline' : 'default'}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Retrying...' : children}
      {retryCount > 0 && ` (${retryCount}/${maxRetries})`}
    </Button>
  );
};

/**
 * Error Display Component
 * 
 * Displays errors with retry functionality.
 */
export const ErrorDisplay = ({ 
  error, 
  onRetry = null, 
  retryCount = 0,
  maxRetries = 3,
  showDetails = false,
  className = '' 
}) => {
  const [showFullError, setShowFullError] = useState(false);

  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return 'An unexpected error occurred';
  };

  const getErrorType = (error) => {
    if (!navigator.onLine) return 'offline';
    if (error?.code === 'NETWORK_ERROR' || error?.name === 'NetworkError') return 'network';
    if (error?.response?.status >= 500) return 'server';
    if (error?.response?.status >= 400) return 'client';
    return 'unknown';
  };

  const errorType = getErrorType(error);
  const errorMessage = getErrorMessage(error);

  const errorTypeConfig = {
    offline: {
      icon: WifiOff,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      title: 'Connection Lost',
      suggestion: 'Check your internet connection and try again.'
    },
    network: {
      icon: Wifi,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      title: 'Network Error',
      suggestion: 'Unable to connect to the server. Please try again.'
    },
    server: {
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      title: 'Server Error',
      suggestion: 'The server is experiencing issues. Please try again later.'
    },
    client: {
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      title: 'Request Error',
      suggestion: 'There was an issue with your request.'
    },
    unknown: {
      icon: AlertTriangle,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/20',
      title: 'Error',
      suggestion: 'Something went wrong. Please try again.'
    }
  };

  const config = errorTypeConfig[errorType];
  const IconComponent = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <IconComponent className={`h-5 w-5 ${config.color} mt-0.5 flex-shrink-0`} />
        <div className="flex-1 space-y-2">
          <div>
            <h3 className={`font-medium ${config.color}`}>
              {config.title}
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              {errorMessage}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {config.suggestion}
            </p>
          </div>

          {/* Error Details */}
          {showDetails && error && (
            <div className="space-y-2">
              <button
                onClick={() => setShowFullError(!showFullError)}
                className="text-xs text-gray-400 hover:text-gray-300 underline"
              >
                {showFullError ? 'Hide' : 'Show'} technical details
              </button>
              
              {showFullError && (
                <div className="bg-black/30 rounded p-2 text-xs font-mono text-gray-300 overflow-auto max-h-32">
                  <pre>{JSON.stringify(error, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

          {/* Retry Button */}
          {onRetry && (
            <div className="flex items-center gap-2 pt-2">
              <RetryButton
                onRetry={onRetry}
                retryCount={retryCount}
                maxRetries={maxRetries}
                className="text-xs"
              />
              {retryCount >= maxRetries && (
                <span className="text-xs text-gray-400">
                  Maximum retries reached
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Operation Status Component
 * 
 * Shows the status of operations with loading, success, and error states.
 */
export const OperationStatus = ({ 
  status = 'idle', // idle, loading, success, error
  message = '',
  error = null,
  onRetry = null,
  autoHideSuccess = true,
  successDuration = 3000,
  className = ''
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  React.useEffect(() => {
    if (status === 'success') {
      setShowSuccess(true);
      if (autoHideSuccess) {
        const timer = setTimeout(() => {
          setShowSuccess(false);
        }, successDuration);
        return () => clearTimeout(timer);
      }
    }
  }, [status, autoHideSuccess, successDuration]);

  if (status === 'idle') return null;

  if (status === 'loading') {
    return (
      <div className={`flex items-center gap-2 text-blue-400 ${className}`}>
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span className="text-sm">{message || 'Processing...'}</span>
      </div>
    );
  }

  if (status === 'success' && showSuccess) {
    return (
      <div className={`flex items-center gap-2 text-green-400 ${className}`}>
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm">{message || 'Success!'}</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <ErrorDisplay
        error={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  return null;
};

/**
 * Async Operation Wrapper Component
 * 
 * Wraps async operations with automatic error handling and retry.
 */
export const AsyncOperationWrapper = ({ 
  children,
  operation,
  onSuccess = null,
  onError = null,
  maxRetries = 3,
  showRetryButton = true,
  loadingMessage = 'Loading...',
  className = ''
}) => {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const { retry, retryCount, isRetrying } = useRetry(maxRetries);

  const executeOperation = useCallback(async () => {
    try {
      setStatus('loading');
      setError(null);
      
      const result = await retry(operation);
      
      setStatus('success');
      if (onSuccess) onSuccess(result);
      
      return result;
    } catch (err) {
      setStatus('error');
      setError(err);
      if (onError) onError(err);
      throw err;
    }
  }, [operation, retry, onSuccess, onError]);

  const handleRetry = useCallback(() => {
    executeOperation();
  }, [executeOperation]);

  // Auto-execute on mount
  React.useEffect(() => {
    executeOperation();
  }, []);

  if (status === 'loading' || isRetrying) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center space-y-3">
          <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mx-auto" />
          <p className="text-sm text-gray-300">
            {isRetrying ? `Retrying... (${retryCount}/${maxRetries})` : loadingMessage}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className={`p-4 ${className}`}>
        <ErrorDisplay
          error={error}
          onRetry={showRetryButton ? handleRetry : null}
          retryCount={retryCount}
          maxRetries={maxRetries}
          showDetails={true}
        />
      </div>
    );
  }

  if (status === 'success') {
    return children;
  }

  return null;
};

