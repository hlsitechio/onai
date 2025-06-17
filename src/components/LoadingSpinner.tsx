
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="text-center">
        <Loader2 className={cn(
          "animate-spin text-noteflow-400 mx-auto",
          sizeClasses[size],
          text && "mb-2"
        )} />
        {text && (
          <p className="text-gray-300 text-sm">{text}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
