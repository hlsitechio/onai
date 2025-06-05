import React from 'react';
import { Loader2, Brain, Sparkles, Zap, FileText, Save, Upload, Download } from 'lucide-react';
import ONAILogo from '../logo/ONAILogo';

/**
 * Loading Spinner Component
 * 
 * A beautiful, customizable loading spinner with various styles and sizes.
 */
export const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'default',
  className = '',
  text = null 
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variants = {
    default: 'text-blue-500',
    primary: 'text-purple-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500',
    white: 'text-white'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} ${variants[variant]} animate-spin`} />
      {text && (
        <span className={`text-sm ${variants[variant]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

/**
 * Full Screen Loading Component
 * 
 * Covers the entire screen with a beautiful loading animation.
 */
export const FullScreenLoading = ({ 
  message = 'Loading...', 
  submessage = null,
  progress = null,
  variant = 'default' 
}) => {
  const variants = {
    default: {
      bg: 'bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20',
      icon: Brain,
      iconColor: 'text-blue-400',
      accent: 'text-blue-400'
    },
    ai: {
      bg: 'bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20',
      icon: Brain,
      iconColor: 'text-purple-400',
      accent: 'text-purple-400'
    },
    save: {
      bg: 'bg-gradient-to-br from-green-900/20 via-black to-emerald-900/20',
      icon: Save,
      iconColor: 'text-green-400',
      accent: 'text-green-400'
    },
    upload: {
      bg: 'bg-gradient-to-br from-orange-900/20 via-black to-red-900/20',
      icon: Upload,
      iconColor: 'text-orange-400',
      accent: 'text-orange-400'
    },
    download: {
      bg: 'bg-gradient-to-br from-cyan-900/20 via-black to-blue-900/20',
      icon: Download,
      iconColor: 'text-cyan-400',
      accent: 'text-cyan-400'
    }
  };

  const config = variants[variant] || variants.default;
  const IconComponent = config.icon;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${config.bg} backdrop-blur-sm`}>
      <div className="text-center space-y-6 p-8">
        {/* ONAI Logo */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto animate-pulse">
            <img 
              src="/onai-logo.png" 
              alt="ONAI Logo" 
              className="w-full h-full object-contain filter drop-shadow-lg"
              onError={(e) => {
                console.error('Loading screen logo failed to load');
                // Fallback to Brain icon if logo fails
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <Brain className="w-full h-full text-blue-400 hidden" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-bounce" />
          <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-transparent border-t-current rounded-full animate-spin opacity-30"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className={`text-2xl font-bold ${config.accent}`}>
            {message}
          </h2>
          {submessage && (
            <p className="text-gray-300 text-sm">
              {submessage}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {progress !== null && (
          <div className="w-64 mx-auto space-y-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r from-${config.accent.split('-')[1]}-400 to-${config.accent.split('-')[1]}-600 transition-all duration-300`}
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 ${config.accent} rounded-full animate-pulse`}
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Inline Loading Component
 * 
 * For loading states within components.
 */
export const InlineLoading = ({ 
  message = 'Loading...', 
  size = 'md',
  variant = 'default',
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <LoadingSpinner size={size} variant={variant} text={message} />
    </div>
  );
};

/**
 * Button Loading State
 * 
 * For buttons that are in loading state.
 */
export const ButtonLoading = ({ 
  children, 
  loading = false, 
  loadingText = 'Loading...',
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`${className} ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

/**
 * Skeleton Loading Component
 * 
 * For content placeholders while loading.
 */
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-gray-700',
    light: 'bg-gray-600',
    dark: 'bg-gray-800'
  };

  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 ${variants[variant]} rounded`}
          style={{ 
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${i * 0.1}s`
          }}
        ></div>
      ))}
    </div>
  );
};

/**
 * Card Loading Component
 * 
 * For loading card-like content.
 */
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`border border-gray-700 rounded-lg p-4 space-y-4 animate-pulse ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-700 rounded w-4/6"></div>
      </div>
    </div>
  );
};

/**
 * Loading Overlay Component
 * 
 * Overlays loading state on existing content.
 */
export const LoadingOverlay = ({ 
  loading = false, 
  message = 'Loading...', 
  children,
  variant = 'default' 
}) => {
  return (
    <div className="relative">
      {children}
      {loading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center space-y-3">
            <LoadingSpinner size="lg" variant="white" />
            <p className="text-white text-sm">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Progressive Loading Component
 * 
 * Shows different loading states based on progress.
 */
export const ProgressiveLoading = ({ 
  steps = [], 
  currentStep = 0, 
  className = '' 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            index < currentStep 
              ? 'bg-green-500 text-white' 
              : index === currentStep 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-400'
          }`}>
            {index < currentStep ? (
              <Zap className="h-3 w-3" />
            ) : index === currentStep ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <span className="text-xs">{index + 1}</span>
            )}
          </div>
          <span className={`text-sm ${
            index <= currentStep ? 'text-white' : 'text-gray-400'
          }`}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Hook for managing loading states
 */
export const useLoading = (initialState = false) => {
  const [loading, setLoading] = React.useState(initialState);
  const [error, setError] = React.useState(null);

  const startLoading = () => {
    setLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const setLoadingError = (error) => {
    setLoading(false);
    setError(error);
  };

  const withLoading = async (asyncFunction) => {
    try {
      startLoading();
      const result = await asyncFunction();
      stopLoading();
      return result;
    } catch (error) {
      setLoadingError(error);
      throw error;
    }
  };

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    withLoading
  };
};

