
import React from 'react';
import { cn } from '@/lib/utils';

interface ToolbarSeparatorProps {
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

const ToolbarSeparator: React.FC<ToolbarSeparatorProps> = ({ 
  orientation = 'vertical',
  className 
}) => {
  return (
    <div className={cn(
      "bg-white/10",
      orientation === 'vertical' ? "w-px h-6 mx-1" : "h-px w-6 my-1",
      className
    )} />
  );
};

export default ToolbarSeparator;
