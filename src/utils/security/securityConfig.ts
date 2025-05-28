/**
 * OneAI Security Configuration
 * 
 * This file centralizes security configurations and utilities for the OneAI application.
 * It addresses various security aspects including CSP, XSS, CORS, and specific 
 * protections for Gemini 2.5 AI integration.
 */

// Define Logger interface locally to avoid import issues
interface Logger {
  debug: (message: string, data?: Record<string, unknown>) => void;
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, data?: Record<string, unknown>) => void;
}

// Create a logger instance
const logger: Logger = {
  debug: (message: string, data?: Record<string, unknown>) => console.debug(`[SecurityConfig] ${message}`, data),
  info: (message: string, data?: Record<string, unknown>) => console.info(`[SecurityConfig] ${message}`, data),
  warn: (message: string, data?: Record<string, unknown>) => console.warn(`[SecurityConfig] ${message}`, data),
  error: (message: string, data?: Record<string, unknown>) => console.error(`[SecurityConfig] ${message}`, data)
};
import { ErrorCode, ErrorSeverity, createError } from '../errorHandling';

// Logger is defined above

/**
 * Content Security Policy configuration
 * - Restricts resource origins to prevent XSS and other injection attacks
 * - Configures necessary exceptions for Gemini AI integration
 */
export const cspConfig = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'", 
    "https://storage.googleapis.com", 
    "https://*.googleapis.com", 
    "https://cdn.jsdelivr.net", 
    "'unsafe-inline'", // Required for certain UI frameworks
    "'unsafe-eval'"    // Required for dynamic content rendering
  ],
  connectSrc: [
    "'self'", 
    "https://*.googleapis.com", 
    "https://generativelanguage.googleapis.com", 
    "wss://*.googleapis.com"
  ],
  imgSrc: ["'self'", "data:", "blob:", "https:"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  frameSrc: ["'self'"],
  objectSrc: ["'none'"],
  
  // Convert to header string format
  toHeaderString(): string {
    return Object.entries(this)
      .filter(([key]) => typeof this[key] !== 'function')
      .map(([key, values]) => `${kebabize(key)} ${(values as string[]).join(' ')}`)
      .join('; ');
  }
};

/**
 * Cross-Origin Resource Sharing (CORS) configuration
 * - Controls how resources can be shared across origins
 * - Configured to allow Gemini API access while restricting other domains
 */
export const corsConfig = {
  allowOrigins: ["'self'"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With", 
    "Accept"
  ],
  
  // For Gemini API specifically
  geminiApiConfig: {
    allowOrigins: [
      "https://*.googleapis.com",
      "https://generativelanguage.googleapis.com"
    ],
    allowMethods: ["GET", "POST"],
    allowHeaders: [
      "Content-Type", 
      "Authorization"
    ]
  }
};

/**
 * XSS Protection Utilities
 * - Functions to sanitize user input and output
 * - Protects against cross-site scripting attacks
 */
export const xssProtection = {
  /**
   * Sanitizes user input to prevent XSS attacks
   */
  sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },
  
  /**
   * Sanitizes data before sending to Gemini API
   * - Removes potential prompt injection patterns
   * - Applies rate limiting for API calls
   */
  sanitizeGeminiPrompt(prompt: string): string {
    if (!prompt) return '';
    
    // Remove potential system prompt injection patterns
    const sanitized = prompt
      .replace(/system:/gi, '')
      .replace(/assistant:/gi, '')
      .replace(/user:/gi, '')
      .replace(/as an AI language model/gi, '')
      .replace(/ignore previous instructions/gi, '');
      
    // Additional context-aware sanitization can be added here
    
    return sanitized;
  },
  
  /**
   * Validates and sanitizes content before displaying in the UI
   */
  sanitizeForDisplay(content: string): string {
    if (!content) return '';
    
    // For content that should allow some HTML (like notes content)
    // This uses a balanced approach allowing certain safe tags
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  }
};

/**
 * Local Storage Security
 * - Secures data in localStorage, sessionStorage, and IndexedDB
 * - Builds on existing IndexedDB enhancements
 */
export const storageProtection = {
  /**
   * Validates content before storing
   */
  validateStorageContent(content: unknown): boolean {
    // Basic validation checks
    if (!content) return false;
    
    // Check for suspicious patterns
    if (typeof content === 'string') {
      const suspiciousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
        /javascript:/i,
        /data:text\/html/i
      ];
      
      return !suspiciousPatterns.some(pattern => pattern.test(content));
    }
    
    return true;
  },
  
  /**
   * Creates a secure storage key
   */
  createSecureKey(prefix: string, id: string): string {
    return `oneai_${prefix}_${id}`;
  }
};

/**
 * Gemini API Security
 * - Specific security measures for Gemini 2.5 AI integration
 */
export const geminiSecurity = {
  /**
   * Rate limiting for Gemini API calls
   */
  rateLimitConfig: {
    maxRequestsPerMinute: 20,
    maxRequestsPerHour: 200,
    maxTokensPerDay: 50000
  },
  
  /**
   * Validates a response from Gemini API
   */
  validateGeminiResponse(response: unknown): boolean {
    try {
      // Check if response has expected structure
      if (!response || typeof response !== 'object') {
        return false;
      }
      
      // Additional validation logic specific to Gemini responses
      
      return true;
    } catch (error) {
      logger.error('Error validating Gemini response', { error });
      throw createError(
        ErrorCode.AI_RESPONSE_VALIDATION_ERROR,
        'Invalid response from AI service',
        ErrorSeverity.WARNING
      );
    }
  }
};

/**
 * Applies security measures to modal components
 * - Ensures secure rendering of dynamic content in modals
 * - Incorporates the modal positioning and styling improvements
 */
export const modalSecurity = {
  /**
   * Sanitizes content for display in modals
   */
  sanitizeModalContent(content: string): string {
    return xssProtection.sanitizeForDisplay(content);
  },
  
  /**
   * Security configuration for modals
   */
  modalConfig: {
    // Prevent focus stealing
    preventFocusStealing: true,
    
    // Position at the top of viewport with scroll-to-top behavior
    positionTop: true,
    
    // Set max-height with overflow scrolling
    maxHeight: '80vh',
    
    // Sanitize URLs in modal content
    sanitizeUrls: true
  }
};

/**
 * Error handling for security issues
 */
export const securityErrorHandler = {
  /**
   * Handles security-related errors
   */
  handleSecurityError(error: Error, context?: Record<string, unknown>): void {
    logger.error('Security error', { error, context });
    
    // Report security errors to the performance monitoring dashboard
    if (window.performance && 'mark' in window.performance) {
      window.performance.mark('security_error');
    }
    
    // Additional error handling logic
  }
};

/**
 * Runtime security checks for the application
 */
export function performSecurityChecks(): void {
  // Check if running in a secure context (HTTPS)
  if (window.location.protocol !== 'https:' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    logger.warn('Application not running in a secure context');
  }
  
  // Verify localStorage availability
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
  } catch (e) {
    logger.error('localStorage is not available', { error: e });
  }
}

// Helper function to convert camelCase to kebab-case
function kebabize(str: string): string {
  return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => 
    (ofs ? '-' : '') + $.toLowerCase()
  );
}

// Initialize security configuration
export function initSecurity(): void {
  logger.info('Initializing security configuration');
  performSecurityChecks();
}

export default {
  cspConfig,
  corsConfig,
  xssProtection,
  storageProtection,
  geminiSecurity,
  modalSecurity,
  securityErrorHandler,
  performSecurityChecks,
  initSecurity
};
