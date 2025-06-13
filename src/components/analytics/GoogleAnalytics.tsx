
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeAnalytics, trackPageView, GTagEvent, GTagPageView } from '../../utils/analytics';

declare global {
  interface Window {
    gtag: (command: string, action: string, params?: GTagEvent | GTagPageView) => void;
    dataLayer: unknown[];
  }
}

/**
 * GoogleAnalytics component for handling Google Analytics tracking
 * This component initializes GA4 and tracks route changes in a SPA
 */
const GoogleAnalytics = () => {
  const location = useLocation();
  const lastPath = useRef<string>(location.pathname);
  
  // Initialize Google Analytics on mount
  useEffect(() => {
    initializeAnalytics();
    // Track initial page view
    trackPageView(location.pathname, document.title);
    
    console.log('Google Analytics initialized with Measurement ID: G-LFFQYK81C6');
  }, []);
  
  // Track page views when route changes
  useEffect(() => {
    // Only trigger on actual path changes
    if (lastPath.current !== location.pathname) {
      // Update the last path
      lastPath.current = location.pathname;
      
      // Track page view in Google Analytics
      trackPageView(location.pathname, document.title);
      console.log('Analytics: Page navigation tracked', location.pathname);
    }
  }, [location]);
  
  // This component doesn't render anything
  return null;
};

export default GoogleAnalytics;
