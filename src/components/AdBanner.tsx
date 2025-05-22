
import React, { useEffect, useRef, useState } from 'react';
import { DollarSign } from "lucide-react";

interface AdBannerProps {
  size: 'small' | 'medium' | 'large';
  position?: 'sidebar' | 'content' | 'footer';
  className?: string;
  adSlotId?: string; // Optional ad slot ID for different ad units
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  size, 
  position = 'content', 
  className = '',
  adSlotId = '', 
}) => {
  // Use HTMLModElement which is the correct type for <ins> elements
  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [adInitialized, setAdInitialized] = useState(false);
  
  // Determine dimensions based on size
  let dimensions = 'h-16 w-full';
  let adFormat = 'auto';
  
  if (size === 'small') {
    dimensions = 'h-16 w-full';
    adFormat = 'horizontal';
  } else if (size === 'medium') {
    dimensions = 'h-24 w-full';
    adFormat = 'rectangle';
  } else if (size === 'large') {
    dimensions = 'h-40 w-full';
    adFormat = 'vertical';
  }

  // Attempt to load Google AdSense ad (only once)
  useEffect(() => {
    // Only proceed if we're in the browser, adsbygoogle is available, and we haven't initialized yet
    if (typeof window !== 'undefined' && adRef.current && !adInitialized) {
      // Reset states
      setAdLoaded(false);
      setAdError(false);
      setAdInitialized(true);
      
      try {
        // Create timeout to handle ad not loading
        const timeout = setTimeout(() => {
          if (!adLoaded) {
            setAdError(true);
          }
        }, 3000); // 3 seconds timeout
        
        // Check if adsbygoogle is defined
        if (window.adsbygoogle) {
          // Push the ad to adsbygoogle - only push if not already initialized
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
          clearTimeout(timeout);
        }
        
        return () => clearTimeout(timeout);
      } catch (error) {
        console.error('AdSense error:', error);
        setAdError(true);
      }
    }
  }, [adRef]); // Only depend on adRef, not adLoaded

  return (
    <div 
      className={`${dimensions} ${className} bg-black/40 backdrop-blur-lg rounded-lg border border-white/10 flex items-center justify-center my-4 overflow-hidden group hover:border-noteflow-400/50 transition-all`}
      style={{ display: 'block', minWidth: '250px' }}
    >
      {!adError ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%', minWidth: '250px' }}
          data-ad-client="ca-pub-4035756937802336"
          data-ad-slot={adSlotId || 'auto'}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
          data-adtest="on" // Use test mode to avoid real ads during development
          ref={adRef}
        ></ins>
      ) : (
        // Fallback placeholder when ads fail to load
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-5 w-5 text-noteflow-400 mr-1" />
            <span className="text-sm font-medium text-white">Sponsored</span>
          </div>
          <p className="text-xs text-slate-300">Your ad could be here</p>
          <p className="text-xs text-noteflow-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Contact us for advertising</p>
        </div>
      )}
    </div>
  );
};

export default AdBanner;
