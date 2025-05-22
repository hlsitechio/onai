
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

/**
 * GoogleAnalytics component for handling AdSense page navigation events
 * This component reinitializes AdSense when routes change in a SPA
 */
const GoogleAnalytics = () => {
  const location = useLocation();
  const lastPath = useRef<string>(location.pathname);
  
  useEffect(() => {
    // Only trigger on actual path changes
    if (lastPath.current !== location.pathname) {
      // Update the last path 
      lastPath.current = location.pathname;
      
      // Notify AdSense of page change
      try {
        if (typeof window !== 'undefined') {
          // Log the page change for debugging
          console.log('Analytics: Page navigation to', location.pathname);
          
          // Push a new AdSense ad if available
          if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
            console.log('AdSense: Pushing new ads after navigation');
            
            // Push a new ad
            window.adsbygoogle.push({});
            
            // Additional method that some implementations use
            if ((window.adsbygoogle as any).requestNonPersonalizedAds !== undefined) {
              console.log('AdSense: Requesting refresh of non-personalized ads');
              (window.adsbygoogle as any).requestNonPersonalizedAds();
            }
          }
        }
      } catch (error) {
        console.error('AdSense navigation update error:', error);
      }
    }
  }, [location.pathname]);
  
  // This component doesn't render anything
  return null;
};

export default GoogleAnalytics;
