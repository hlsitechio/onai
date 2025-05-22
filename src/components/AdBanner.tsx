
import React from 'react';
import { DollarSign } from "lucide-react";

interface AdBannerProps {
  size: 'small' | 'medium' | 'large';
  position?: 'sidebar' | 'content' | 'footer';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ size, position = 'content', className = '' }) => {
  // In a real implementation, this would contain actual ad code from a provider
  // For this example, we're creating a placeholder that could be replaced with real ads
  
  let dimensions = 'h-16 w-full';
  
  if (size === 'small') {
    dimensions = 'h-16 w-full';
  } else if (size === 'medium') {
    dimensions = 'h-24 w-full';
  } else if (size === 'large') {
    dimensions = 'h-40 w-full';
  }
  
  return (
    <div className={`${dimensions} ${className} bg-black/40 backdrop-blur-lg rounded-lg border border-white/10 flex items-center justify-center my-4 overflow-hidden group hover:border-noteflow-400/50 transition-all`}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <DollarSign className="h-5 w-5 text-noteflow-400 mr-1" />
          <span className="text-sm font-medium text-white">Sponsored</span>
        </div>
        <p className="text-xs text-slate-300">Your ad could be here</p>
        <p className="text-xs text-noteflow-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Contact us for advertising</p>
      </div>
    </div>
  );
};

export default AdBanner;
