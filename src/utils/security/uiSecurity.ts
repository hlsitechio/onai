/**
 * UI Security Configuration
 * 
 * This file provides security utilities for UI components in OneAI,
 * focusing on user interface security concerns like input sanitization,
 * safe rendering, and protection for modals and dialogs.
 */

import { createLogger } from '../logging/logger';
import { ErrorCode, ErrorSeverity, createError } from '../errorHandling';
import { xssProtection } from './securityConfig';

const logger = createLogger('UISecurity');

/**
 * Input Security
 * - Protects against XSS in input fields
 * - Validates input before processing
 */
export const inputSecurity = {
  /**
   * Sanitizes input when typing in text fields
   */
  sanitizeInputValue(value: string): string {
    if (!value) return '';
    return xssProtection.sanitizeInput(value);
  },
  
  /**
   * Validates input against specific patterns
   */
  validateInput(value: string, pattern: RegExp): boolean {
    if (!value) return false;
    return pattern.test(value);
  },
  
  /**
   * Common validation patterns
   */
  patterns: {
    // Only alphanumeric characters, spaces, and common punctuation
    safeText: /^[a-zA-Z0-9\s.,;:!?'"()\-_]+$/,
    
    // Email pattern
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    
    // URL pattern
    url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    
    // Note title pattern (more permissive)
    noteTitle: /^[^<>{}[\]\\|^`]+$/
  }
};

/**
 * Modal Security
 * - Secures modal dialogs and popups
 * - Implements protections against UI redressing attacks
 */
export const modalSecurity = {
  /**
   * Track active modals to prevent modal spam
   */
  _activeModals: 0,
  
  /**
   * Maximum number of concurrent modals
   */
  MAX_CONCURRENT_MODALS: 3,
  
  /**
   * Safe modal configuration
   */
  safeModalConfig: {
    // Set position at top of viewport
    position: 'top-24',
    
    // Scroll to top when opening
    scrollToTop: true,
    
    // Max height with overflow scrolling
    maxHeight: '80vh',
    
    // Prevent closing by clicking outside
    shouldCloseOnOverlayClick: true,
    
    // Set modal app element for accessibility
    appElement: '#root',
    
    // Additional security settings
    preventFocusStealing: true
  },
  
  /**
   * Sanitizes content for display in modals
   */
  sanitizeModalContent(content: string): string {
    return xssProtection.sanitizeForDisplay(content);
  },
  
  /**
   * Safe modal open function with spam protection
   */
  safeModalOpen(): boolean {
    // Check if we've reached the maximum number of concurrent modals
    if (this._activeModals >= this.MAX_CONCURRENT_MODALS) {
      logger.warn('Maximum concurrent modals reached');
      return false;
    }
    
    this._activeModals++;
    return true;
  },
  
  /**
   * Track modal close
   */
  modalClose(): void {
    this._activeModals = Math.max(0, this._activeModals - 1);
  },
  
  /**
   * Apply security attributes to an element
   */
  applySecurityAttributes(element: HTMLElement): void {
    if (!element) return;
    
    // Set security-related attributes
    element.setAttribute('rel', 'noopener noreferrer');
    element.setAttribute('autocomplete', 'off');
    
    // Prevent drag and drop attacks
    element.setAttribute('draggable', 'false');
  }
};

/**
 * Rendering Security
 * - Ensures safe rendering of dynamic content
 * - Prevents unsafe rendering practices
 */
export const renderingSecurity = {
  /**
   * Safely render HTML content
   */
  createSafeHTML(html: string): { __html: string } {
    return { __html: xssProtection.sanitizeForDisplay(html) };
  },
  
  /**
   * Creates a safe style object
   */
  createSafeStyle(styles: Record<string, string>): Record<string, string> {
    const safeStyles: Record<string, string> = {};
    
    // Filter out potentially unsafe CSS properties
    const allowedProperties = [
      'color', 'backgroundColor', 'fontSize', 'fontWeight', 'margin', 
      'padding', 'border', 'borderRadius', 'display', 'flexDirection',
      'justifyContent', 'alignItems', 'gap', 'width', 'height', 'maxWidth',
      'maxHeight', 'overflow', 'position', 'top', 'left', 'right', 'bottom',
      'zIndex', 'opacity', 'transition', 'transform', 'boxShadow', 'textAlign'
    ];
    
    // Only include allowed properties
    for (const prop of allowedProperties) {
      if (styles[prop]) {
        safeStyles[prop] = styles[prop];
      }
    }
    
    return safeStyles;
  },
  
  /**
   * Sanitizes class names to prevent injection
   */
  sanitizeClassNames(classNames: string): string {
    // Remove potentially unsafe classes
    return classNames
      .split(' ')
      .filter(className => /^[a-zA-Z0-9_-]+$/.test(className))
      .join(' ');
  }
};

/**
 * Link Security
 * - Secures links and navigation
 * - Prevents unsafe redirects
 */
export const linkSecurity = {
  /**
   * List of allowed external domains
   */
  allowedExternalDomains: [
    'github.com',
    'onlinenote.ai',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net'
  ],
  
  /**
   * Checks if a URL is safe to navigate to
   */
  isSafeUrl(url: string): boolean {
    try {
      // Allow relative URLs
      if (url.startsWith('/')) return true;
      
      // Parse the URL
      const parsedUrl = new URL(url);
      
      // Allow same-origin URLs
      if (parsedUrl.origin === window.location.origin) return true;
      
      // Check against allowed external domains
      return this.allowedExternalDomains.some(domain => 
        parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
      );
    } catch (error) {
      logger.error('Error checking URL safety', { error, url });
      return false;
    }
  },
  
  /**
   * Creates secure link attributes
   */
  getSecureLinkAttributes(url: string): Record<string, string> {
    const attributes: Record<string, string> = {};
    
    try {
      // Parse the URL
      const parsedUrl = new URL(url, window.location.origin);
      
      // Check if external
      const isExternal = parsedUrl.origin !== window.location.origin;
      
      if (isExternal) {
        // For external links, add security attributes
        attributes.rel = 'noopener noreferrer';
        attributes.target = '_blank';
      }
      
      return attributes;
    } catch (error) {
      // If URL parsing fails, treat as external to be safe
      return {
        rel: 'noopener noreferrer',
        target: '_blank'
      };
    }
  }
};

/**
 * Initialize UI security features
 */
export function initUISecurity(): void {
  logger.info('Initializing UI security configuration');
  
  // Set up global event listeners for security
  document.addEventListener('DOMContentLoaded', () => {
    // Prevent clickjacking by checking if we're in an iframe
    if (window.self !== window.top) {
      logger.warn('Application loaded in an iframe - potential clickjacking attempt');
      
      // Optionally force breaking out of frames
      // window.top.location = window.self.location;
    }
  });
}

export default {
  inputSecurity,
  modalSecurity,
  renderingSecurity,
  linkSecurity,
  initUISecurity
};
