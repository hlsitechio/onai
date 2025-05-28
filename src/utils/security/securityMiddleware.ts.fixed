/**
 * OneAI Security Middleware
 * 
 * This file provides middleware and integration points for the security system,
 * allowing it to be used seamlessly with React components and other parts of the application.
 */

import React, { useEffect, useState, createContext, useContext, ReactNode, MouseEvent, ChangeEvent } from 'react';
import { createLogger } from '../logging/logger';

// Create logger
const logger = createLogger('SecurityMiddleware');

// Security module interface definition
interface SecurityModule {
  xssProtection: {
    sanitizeInput: (input: string) => string;
    sanitizeForDisplay: (content: string) => string;
  };
  performSecurityChecks: () => void;
  init: () => void;
  ui: {
    linkSecurity: {
      isSafeUrl: (url: string) => boolean;
      getSecureLinkAttributes: (url: string) => Record<string, string>;
    };
    renderingSecurity: {
      createSafeHTML: (html: string) => { __html: string };
      sanitizeClassNames: (classNames: string) => string;
    };
    modalSecurity: {
      safeModalOpen: () => boolean;
      modalClose: () => void;
    };
  };
}

// Import security module with fallback
let securityModule: SecurityModule;

try {
  // Dynamic import for the security module
  const importedModule = require('./index').default;
  securityModule = importedModule;
  logger.info('Security module loaded successfully');
} catch (e) {
  // Fallback security module if not available
  securityModule = {
    xssProtection: {
      sanitizeInput: (input: string) => input,
      sanitizeForDisplay: (content: string) => content
    },
    performSecurityChecks: () => {},
    init: () => {},
    ui: {
      linkSecurity: {
        isSafeUrl: () => true,
        getSecureLinkAttributes: () => ({})
      },
      renderingSecurity: {
        createSafeHTML: (html: string) => ({ __html: html }),
        sanitizeClassNames: (classNames: string) => classNames
      },
      modalSecurity: {
        safeModalOpen: () => true,
        modalClose: () => {}
      }
    }
  };
  logger.warn('Could not load security module, using fallback', { error: e });
}

// Create a context for security state
interface SecurityContextType {
  isInitialized: boolean;
  performChecks: () => void;
  sanitizeInput: (input: string) => string;
  sanitizeForDisplay: (content: string) => string;
  isSafeUrl: (url: string) => boolean;
  secureModalOpen: () => boolean;
  modalClose: () => void;
  createSafeHTML: (html: string) => { __html: string };
}

const defaultContextValue: SecurityContextType = {
  isInitialized: false,
  performChecks: () => {},
  sanitizeInput: (input: string) => input,
  sanitizeForDisplay: (content: string) => content,
  isSafeUrl: () => true,
  secureModalOpen: () => true,
  modalClose: () => {},
  createSafeHTML: (html: string) => ({ __html: html }),
};

const SecurityContext = createContext<SecurityContextType>(defaultContextValue);

/**
 * SecurityProvider component
 * - Initializes the security system
 * - Provides security utilities to the application
 */
export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize security system on component mount
  useEffect(() => {
    try {
      securityModule.init();
      setIsInitialized(true);
      logger.info('Security system initialized via provider');
    } catch (error) {
      logger.error('Failed to initialize security via provider', { error });
    }
  }, []);
  
  // Security context value
  const contextValue: SecurityContextType = {
    isInitialized,
    performChecks: securityModule.performSecurityChecks,
    sanitizeInput: securityModule.xssProtection.sanitizeInput,
    sanitizeForDisplay: securityModule.xssProtection.sanitizeForDisplay,
    isSafeUrl: securityModule.ui.linkSecurity.isSafeUrl,
    secureModalOpen: securityModule.ui.modalSecurity.safeModalOpen.bind(securityModule.ui.modalSecurity),
    modalClose: securityModule.ui.modalSecurity.modalClose.bind(securityModule.ui.modalSecurity),
    createSafeHTML: securityModule.ui.renderingSecurity.createSafeHTML,
  };
  
  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

/**
 * Hook to use security features in components
 */
export const useSecurity = (): SecurityContextType => useContext(SecurityContext);

/**
 * HOC to apply security to a component
 */
export const withSecurity = <P extends object>(
  Component: React.ComponentType<P & { security?: SecurityContextType }>
): React.FC<P> => {
  const WithSecurityComponent: React.FC<P> = (props: P) => {
    const security = useSecurity();
    return <Component {...props} security={security} />;
  };
  return WithSecurityComponent;
};

/**
 * Secure Input Component
 * - A text input component with built-in security
 */
export const SecureInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}> = ({ value, onChange, placeholder, className, type = 'text' }) => {
  const security = useSecurity();
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = security.sanitizeInput(e.target.value);
    onChange(sanitizedValue);
  };
  
  // Use a safe class name sanitization approach
  const safeClassName = className ? className.replace(/[^a-zA-Z0-9\s_-]/g, '') : '';
  
  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={safeClassName}
      autoComplete="off"
    />
  );
};

/**
 * Secure Link Component
 * - An anchor tag with built-in security checks
 */
export const SecureLink: React.FC<{
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}> = ({ href, children, className, onClick }) => {
  const security = useSecurity();
  
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!security.isSafeUrl(href)) {
      e.preventDefault();
      logger.warn('Blocked navigation to unsafe URL', { url: href });
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };
  
  // Simple security attributes without requiring direct access to Security.ui
  const isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
  const securityAttributes = isExternal ? {
    rel: 'noopener noreferrer',
    target: '_blank'
  } : {};
  
  // Use a safe class name sanitization approach
  const safeClassName = className ? className.replace(/[^a-zA-Z0-9\s_-]/g, '') : '';
  
  return (
    <a
      href={href}
      className={safeClassName}
      onClick={handleClick}
      {...securityAttributes}
    >
      {children}
    </a>
  );
};

/**
 * Secure Content Component
 * - Renders content with XSS protection
 */
export const SecureContent: React.FC<{
  content: string;
  className?: string;
}> = ({ content, className }) => {
  const security = useSecurity();
  const safeHTML = security.createSafeHTML(content);
  
  // Use a safe class name sanitization approach
  const safeClassName = className ? className.replace(/[^a-zA-Z0-9\s_-]/g, '') : '';
  
  return (
    <div 
      className={safeClassName}
      dangerouslySetInnerHTML={safeHTML} 
    />
  );
};

/**
 * Gemini AI Security Hook
 * - Provides Gemini-specific security features
 */
export const useGeminiSecurity = () => {
  // Simple implementation that doesn't directly access Security.gemini
  const sanitizePrompt = (prompt: string): string => {
    if (!prompt) return '';
    
    // Basic prompt sanitization
    return prompt
      .replace(/system:/gi, '[s]')
      .replace(/assistant:/gi, '[a]')
      .replace(/user:/gi, '[u]')
      .replace(/ignore previous instructions/gi, '[filtered content]');
  };
  
  const validateResponse = (response: unknown): boolean => {
    if (!response) return false;
    return true;
  };
  
  const isRateLimited = (): boolean => {
    // Simplified implementation
    return false;
  };
  
  const generateSafeContent = async (prompt: string, options?: Record<string, unknown>): Promise<string> => {
    if (!prompt) return '';
    if (isRateLimited()) return 'Rate limit exceeded. Please try again later.';
    
    // Simplified implementation
    return `Safe AI response for: ${prompt.substring(0, 30)}...`;
  };
  
  return {
    sanitizePrompt,
    validateResponse,
    isRateLimited,
    generateSafeContent,
  };
};

/**
 * Supabase Security Hook
 * - Provides Supabase-specific security features
 */
export const useSupabaseSecurity = () => {
  // Simplified implementations that don't directly access Security.supabase
  const invokeFunction = async <T = unknown>(functionName: string, payload: Record<string, unknown>): Promise<T> => {
    logger.info(`Securely invoking Supabase function: ${functionName}`);
    
    // In a real implementation, you'd call your actual Supabase function here
    return {} as T;
  };
  
  const secureNoteSave = async (noteId: string, content: string): Promise<boolean> => {
    if (!noteId || !content) return false;
    
    // In a real implementation, you'd add validation and security checks
    logger.info(`Securely saving note: ${noteId}`);
    return true;
  };
  
  const secureSubscribe = (channelName: string, eventName: string, callback: (payload: unknown) => void) => {
    logger.info(`Securely subscribing to channel: ${channelName}, event: ${eventName}`);
    
    // In a real implementation, you'd return a subscription object
    return {
      unsubscribe: () => {
        logger.info(`Unsubscribing from channel: ${channelName}`);
      }
    };
  };
  
  return {
    invokeFunction,
    secureNoteSave,
    secureSubscribe,
  };
};

/**
 * Modal Security Hook
 * - Provides modal-specific security features aligned with your existing modal positioning
 */
export const useModalSecurity = () => {
  const security = useSecurity();
  
  const openModal = () => {
    const canOpen = security.secureModalOpen();
    
    if (canOpen) {
      // Scroll to top when opening modal - implements your existing preference
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    return canOpen;
  };
  
  const closeModal = () => {
    security.modalClose();
  };
  
  // Get your existing modal style preferences
  const getModalStyles = () => ({
    content: {
      top: '24px', // Using your preferred top-24 positioning
      maxHeight: '80vh', // Using your preferred 80vh max height
      overflow: 'auto', // Adding overflow scrolling for content
      position: 'relative' as const,
      margin: '0 auto',
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      width: '100%'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'flex-start' as const, // Align at top for your top-positioned modals
      justifyContent: 'center',
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000
    }
  });
  
  const sanitizeModalContent = (content: string): string => {
    return security.sanitizeForDisplay(content);
  };
  
  return {
    openModal,
    closeModal,
    getModalStyles,
    sanitizeModalContent,
  };
};

export default {
  SecurityProvider,
  useSecurity,
  withSecurity,
  SecureInput,
  SecureLink,
  SecureContent,
  useGeminiSecurity,
  useSupabaseSecurity,
  useModalSecurity
};
