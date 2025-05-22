
import React, { useEffect, useRef, useState } from 'react';
import { DollarSign, AlertCircle } from "lucide-react";

interface AdBannerProps {
  size: 'small' | 'medium' | 'large';
  position?: 'sidebar' | 'content' | 'footer';
  className?: string;
  adSlotId?: string; // Ad slot ID for different ad units
  format?: 'auto' | 'horizontal' | 'rectangle' | 'vertical' | 'in-article' | 'autorelaxed'; // Added new formats
}

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  size, 
  position = 'content', 
  className = '',
  adSlotId = '3590071232', // Default to main ad slot
  format, // Allow format override
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [adInitialized, setAdInitialized] = useState(false);
  const [adTimedOut, setAdTimedOut] = useState(false);
  
  // Determine dimensions based on size - optimized for better AdSense performance
  let dimensions = 'h-16 w-full';
  let adFormat = format || 'auto'; // Use provided format or default based on size
  
  if (!format) {
    if (size === 'small') {
      // 728x90 leaderboard or smaller
      dimensions = 'h-[90px] max-w-[728px] w-full';
      adFormat = 'horizontal';
    } else if (size === 'medium') {
      // 300x250 rectangle - most effective ad size
      dimensions = 'h-[250px] max-w-[300px] w-full';
      adFormat = 'rectangle';
    } else if (size === 'large') {
      // 336x280 large rectangle - also very effective
      dimensions = 'h-[280px] max-w-[336px] w-full';
      adFormat = 'rectangle';
    }
  } else {
    // Special formats have their own dimensions
    if (format === 'in-article') {
      // In-article format (recommended height 250px)
      dimensions = 'min-h-[250px] max-w-[468px] w-full';
    } else if (format === 'autorelaxed') {
      // Auto relaxed format - more compact
      dimensions = 'min-h-[300px] max-w-[336px] w-full';
    }
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
        console.log('AdSense: Attempting to load ad with slot ID:', adSlotId, 'format:', adFormat);
        
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
  }, [adRef, adSlotId, adFormat, adInitialized]);

  return (
    <div 
      className={`${dimensions} ${className} glass-panel-dark rounded-xl flex items-center justify-center my-4 overflow-hidden group transition-all relative`}
      style={{ display: 'block', minWidth: '250px' }}
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5 opacity-40"></div>
      
      {!adError && !adTimedOut ? (
        <div ref={adRef} className="w-full h-full relative z-10">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '100%', minWidth: '250px', textAlign: format === 'in-article' ? 'center' : 'initial' }}
            data-ad-client="ca-pub-4035756937802336"
            data-ad-slot={adSlotId}
            data-ad-format={adFormat}
            {...(format === 'in-article' && { 'data-ad-layout': 'in-article' })}
            {...(format === 'autorelaxed' && { 'data-ad-format': 'autorelaxed' })}
            data-full-width-responsive="true"
          ></ins>
        </div>
      ) : (
        // Enhanced fallback content when ads fail to load
        <div className="text-center p-4 w-full relative z-10 bg-gradient-to-br from-black/30 to-gray-900/30 backdrop-blur-sm rounded-lg border border-white/5 shadow-inner mx-2">
          <div className="flex items-center justify-center mb-3">
            {adTimedOut ? (
              <AlertCircle className="h-6 w-6 text-amber-400 mr-2" />
            ) : (
              <DollarSign className="h-6 w-6 text-purple-400 mr-2" />
            )}
            <span className="text-base font-medium text-white">
              {adTimedOut ? 'Ad Content Unavailable' : 'Sponsored Content'}
            </span>
          </div>
          
          {adTimedOut ? (
            <>
              <div className="flex items-center justify-center space-x-4 mb-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-700/20 to-amber-500/20 border border-amber-500/30 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-2 bg-amber-700/20 rounded w-3/4"></div>
                  <div className="h-2 bg-amber-700/20 rounded w-1/2"></div>
                </div>
              </div>
              <p className="text-sm text-gray-300 mt-2">Ad content could not be loaded</p>
              <p className="text-xs text-amber-400/80 mt-1">Please check your ad blocker settings or try again later</p>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="h-16 bg-gradient-to-br from-purple-800/10 to-blue-800/10 rounded-lg border border-white/5 flex items-center justify-center p-2">
                  <div className="w-full h-2 bg-white/10 rounded-full"></div>
                </div>
                <div className="h-16 bg-gradient-to-br from-blue-800/10 to-purple-800/10 rounded-lg border border-white/5 flex items-center justify-center p-2">
                  <div className="w-full h-2 bg-white/10 rounded-full"></div>
                </div>
              </div>
              <p className="text-sm text-gray-300">Relevant content from our partners</p>
              <p className="text-xs text-blue-400/80 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">Interested in advertising here? Contact us</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdBanner;
