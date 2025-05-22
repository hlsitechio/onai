
import React, { useEffect, useRef, useState } from 'react';
import { DollarSign, AlertCircle } from "lucide-react";

interface AdBannerProps {
  size: 'small' | 'medium' | 'large';
  position?: 'sidebar' | 'content' | 'footer';
  className?: string;
  adSlotId?: string; // Ad slot ID for different ad units
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
  adSlotId = '3590071232', // Default to main ad slot
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [adInitialized, setAdInitialized] = useState(false);
  const [adTimedOut, setAdTimedOut] = useState(false);
  
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

  // Check if ad blocker might be active
  useEffect(() => {
    const checkAdBlocker = setTimeout(() => {
      // If ad hasn't loaded after 3 seconds, assume there might be an issue
      if (!adLoaded && !adError) {
        setAdTimedOut(true);
        console.log('AdSense: Ad loading timed out, possibly due to an ad blocker or account not being fully activated');
      }
    }, 3000);
    
    return () => clearTimeout(checkAdBlocker);
  }, [adLoaded, adError]);

  // Load Google AdSense ad
  useEffect(() => {
    if (typeof window !== 'undefined' && adRef.current && !adInitialized) {
      setAdInitialized(true);
      
      try {
        // Add debug information to help troubleshoot
        console.log('AdSense: Attempting to load ad with slot ID:', adSlotId);
        
        // Make sure adsbygoogle is defined before pushing
        if (window.adsbygoogle) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            console.log('AdSense: Ad push command executed');
            setAdLoaded(true);
          } catch (pushError) {
            console.error('AdSense push error:', pushError);
            setAdError(true);
          }
        } else {
          console.warn('AdSense: window.adsbygoogle is not defined');
          setAdError(true);
        }
      } catch (error) {
        console.error('AdSense initialization error:', error);
        setAdError(true);
      }
    }
  }, [adRef, adSlotId, adInitialized]);

  return (
    <div 
      className={`${dimensions} ${className} bg-black/40 backdrop-blur-lg rounded-lg border border-white/10 flex items-center justify-center my-4 overflow-hidden group hover:border-noteflow-400/50 transition-all`}
      style={{ display: 'block', minWidth: '250px' }}
    >
      {!adError && !adTimedOut ? (
        <div ref={adRef} className="w-full h-full relative">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%', minWidth: '250px' }}
            data-ad-client="ca-pub-4035756937802336"
            data-ad-slot={adSlotId}
            data-ad-format={adFormat}
            data-full-width-responsive="true"
          ></ins>
        </div>
      ) : (
        // Fallback placeholder when ads fail to load
        <div className="text-center p-2">
          <div className="flex items-center justify-center mb-2">
            {adTimedOut ? (
              <AlertCircle className="h-5 w-5 text-amber-400 mr-1" />
            ) : (
              <DollarSign className="h-5 w-5 text-noteflow-400 mr-1" />
            )}
            <span className="text-sm font-medium text-white">
              {adTimedOut ? 'Ad not showing' : 'Sponsored'}
            </span>
          </div>
          
          {adTimedOut ? (
            <>
              <p className="text-xs text-slate-300">Ads may be blocked or account is pending approval</p>
              <p className="text-xs text-noteflow-400 mt-1">Please check AdSense account status</p>
            </>
          ) : (
            <>
              <p className="text-xs text-slate-300">Your ad could be here</p>
              <p className="text-xs text-noteflow-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Contact us for advertising</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdBanner;
