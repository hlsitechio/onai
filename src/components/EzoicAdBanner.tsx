
import React, { useEffect, useRef, useState } from 'react';
import { DollarSign, AlertCircle } from "lucide-react";

interface EzoicAdBannerProps {
  size: 'small' | 'medium' | 'large';
  position?: 'sidebar' | 'content' | 'footer';
  className?: string;
  placeholderId: number; // Unique Ezoic placeholder ID
  adName?: string; // Human-readable name for the ad
}

declare global {
  interface Window {
    ezstandalone: {
      cmd: Array<() => void>;
      showAds: (placeholderIds?: number | number[]) => void;
      destroyPlaceholders: (placeholderIds: number | number[]) => void;
      destroyAll: () => void;
    };
  }
}

const EzoicAdBanner: React.FC<EzoicAdBannerProps> = ({ 
  size, 
  position = 'content', 
  className = '',
  placeholderId,
  adName = 'Ezoic Ad'
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  const [adTimedOut, setAdTimedOut] = useState(false);
  
  // Determine dimensions based on size
  let dimensions = 'h-16 w-full';
  
  if (size === 'small') {
    // 728x90 leaderboard or smaller
    dimensions = 'h-[90px] max-w-[728px] w-full';
  } else if (size === 'medium') {
    // 300x250 rectangle
    dimensions = 'h-[250px] max-w-[300px] w-full';
  } else if (size === 'large') {
    // 336x280 large rectangle
    dimensions = 'h-[280px] max-w-[336px] w-full';
  }

  // Initialize Ezoic ads
  useEffect(() => {
    if (typeof window !== 'undefined' && adRef.current) {
      try {
        // Initialize ezstandalone if not exists with proper typing
        if (!window.ezstandalone) {
          window.ezstandalone = {
            cmd: [],
            showAds: () => {},
            destroyPlaceholders: () => {},
            destroyAll: () => {}
          };
        }
        
        if (!window.ezstandalone.cmd) {
          window.ezstandalone.cmd = [];
        }
        
        // Show this specific ad placeholder
        window.ezstandalone.cmd.push(() => {
          if (window.ezstandalone.showAds) {
            window.ezstandalone.showAds(placeholderId);
            setAdLoaded(true);
            console.log(`Ezoic: Ad placeholder ${placeholderId} loaded`);
          }
        });
      } catch (error) {
        console.error('Ezoic initialization error:', error);
        setAdError(true);
      }
    }
  }, [placeholderId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.ezstandalone?.destroyPlaceholders) {
        try {
          window.ezstandalone.destroyPlaceholders(placeholderId);
          console.log(`Ezoic: Cleaned up placeholder ${placeholderId}`);
        } catch (error) {
          console.error('Ezoic cleanup error:', error);
        }
      }
    };
  }, [placeholderId]);

  // Timeout check
  useEffect(() => {
    const checkAdBlocker = setTimeout(() => {
      if (!adLoaded && !adError) {
        setAdTimedOut(true);
        console.log('Ezoic: Ad loading timed out for placeholder', placeholderId);
      }
    }, 3000);
    
    return () => clearTimeout(checkAdBlocker);
  }, [adLoaded, adError, placeholderId]);

  return (
    <div 
      className={`${dimensions} ${className} glass-panel-dark rounded-xl flex items-center justify-center my-4 overflow-hidden group transition-all relative`}
      style={{ display: 'block', minWidth: '250px' }}
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5 opacity-40"></div>
      
      {!adError && !adTimedOut ? (
        <div ref={adRef} className="w-full h-full relative z-10">
          {/* Ezoic placeholder div */}
          <div 
            id={`ezoic-pub-ad-placeholder-${placeholderId}`}
            className="ezoic-ad"
            style={{ width: '100%', height: '100%', minWidth: '250px', textAlign: 'center' }}
          ></div>
        </div>
      ) : (
        // Fallback content when ads fail to load
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

export default EzoicAdBanner;
