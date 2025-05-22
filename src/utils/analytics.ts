/**
 * Google Analytics tracking utility for OneAI Notes
 * This provides proper tracking for single-page application navigation
 * 
 * Configuration:
 * - Measurement ID: G-LFFQYK81C6
 * - Stream ID: 11254147432
 */

// Google Analytics Configuration
const GA_CONFIG = {
  MEASUREMENT_ID: 'G-LFFQYK81C6',
  STREAM_ID: '11254147432'
};

// Define types for Google Analytics
export interface GTagEvent {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined; // More specific than any
}

export interface GTagPageView {
  page_path: string;
  page_title?: string;
  [key: string]: string | number | boolean | undefined; // More specific than any
}

// Ensure the gtag function exists
declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: GTagEvent | GTagPageView
    ) => void;
    dataLayer: unknown[];
  }
}

/**
 * Track a page view in Google Analytics
 * Call this when navigating between pages in the SPA
 */
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Configure the tracker with both Measurement ID and Stream ID
    window.gtag('config', GA_CONFIG.MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
      stream_id: GA_CONFIG.STREAM_ID
    });
  }
};

/**
 * Initialize Google Analytics with the proper configuration
 * Call this function once when your application loads
 */
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Initialize with both measurement ID and stream ID
    window.gtag('config', GA_CONFIG.MEASUREMENT_ID, {
      stream_id: GA_CONFIG.STREAM_ID,
      send_page_view: true
    });
    
    // Set user properties if needed
    // window.gtag('set', 'user_properties', { property_name: 'value' });
  }
};

/**
 * Track a custom event in Google Analytics
 */
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      send_to: GA_CONFIG.MEASUREMENT_ID
    });
  }
};
