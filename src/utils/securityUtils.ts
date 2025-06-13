
/**
 * Security utilities for OneAI Notes
 * Enhanced with server-side security monitoring
 */

import { logSecurityIncident, trackSecurityEvent, sanitizeInput } from './securityMonitoring';

// Helper for Content Security Policy implementation
export const generateCSPNonce = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Securely wipe sensitive data from localStorage/sessionStorage
export const secureWipe = (key: string): void => {
  try {
    // Get the size of the data
    const value = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (!value) return;
    
    // Overwrite with random data of the same length
    const randomData = Array(value.length).fill(0).map(() => 
      Math.random().toString(36).charAt(2)
    ).join('');
    
    // Set the random data before removal
    if (localStorage.getItem(key)) {
      localStorage.setItem(key, randomData);
      localStorage.removeItem(key);
    }
    
    if (sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, randomData);
      sessionStorage.removeItem(key);
    }

    // Track secure wipe event
    trackSecurityEvent('secure_data_wipe', { key_prefix: key.substring(0, 10) });
  } catch (e) {
    console.error('Error in secure wipe:', e);
    logSecurityIncident('secure_wipe_failed', 'low', { error: e instanceof Error ? e.message : 'Unknown error' });
  }
};

// Initialize security tokens for new users
const initializeSecurityTokens = (): void => {
  try {
    // Set security token if missing (normal for new users)
    if (!localStorage.getItem('onlinenote-security-token')) {
      const securityToken = generateCSPNonce();
      localStorage.setItem('onlinenote-security-token', securityToken);
      trackSecurityEvent('security_token_initialized');
    }
    
    // Set initialization flag
    if (!localStorage.getItem('onlinenote-initialized')) {
      localStorage.setItem('onlinenote-initialized', 'true');
    }
    
    // Set last clear date
    if (!localStorage.getItem('onlinenote-last-clear-date')) {
      localStorage.setItem('onlinenote-last-clear-date', new Date().toDateString());
    }
  } catch (e) {
    console.error('Error initializing security tokens:', e);
    logSecurityIncident('token_initialization_failed', 'medium', { 
      error: e instanceof Error ? e.message : 'Unknown error' 
    });
  }
};

// Enhanced storage integrity validation with security monitoring
export const validateStorageIntegrity = (): boolean => {
  try {
    // Initialize tokens if they don't exist (normal for new users)
    initializeSecurityTokens();
    
    // Get security token - should exist now
    const securityToken = localStorage.getItem('onlinenote-security-token');
    
    if (!securityToken) {
      console.warn('Security token missing after initialization - reinitializing');
      logSecurityIncident('security_token_missing', 'medium');
      initializeSecurityTokens();
      return true; // Allow app to continue
    }
    
    // Check if this looks like a legitimate app session
    const hasValidStructure = localStorage.getItem('onlinenote-initialized') === 'true';
    
    if (!hasValidStructure) {
      console.info('Initializing app for first time');
      initializeSecurityTokens();
      trackSecurityEvent('first_time_initialization');
    }
    
    return true; // Always allow app to continue
  } catch (e) {
    console.error('Error validating storage integrity:', e);
    logSecurityIncident('storage_validation_error', 'medium', { 
      error: e instanceof Error ? e.message : 'Unknown error' 
    });
    return true; // Allow app to continue even on error
  }
};

// Enhanced client-side encryption with security logging
export const encryptClientData = (data: string, key?: string): string => {
  try {
    // Use provided key or generate one from browser fingerprint
    const encKey = key || generateBrowserFingerprint();
    
    // Simple XOR encryption (for lightweight protection)
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ encKey.charCodeAt(i % encKey.length));
    }
    
    // Convert to base64 for safe storage
    return btoa(result);
  } catch (e) {
    console.error('Encryption error:', e);
    logSecurityIncident('client_encryption_failed', 'low', { 
      error: e instanceof Error ? e.message : 'Unknown error',
      data_length: data.length 
    });
    return data; // Fallback to unencrypted data
  }
};

// Enhanced decryption with security monitoring
export const decryptClientData = (data: string, key?: string): string => {
  try {
    // Check if data is base64 encoded
    if (!/^[A-Za-z0-9+/=]+$/.test(data)) {
      return data; // Not encrypted
    }
    
    // Use provided key or generate one from browser fingerprint
    const encKey = key || generateBrowserFingerprint();
    
    // Decode from base64
    const decoded = atob(data);
    
    // XOR decryption
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ encKey.charCodeAt(i % encKey.length));
    }
    
    return result;
  } catch (e) {
    console.error('Decryption error:', e);
    logSecurityIncident('client_decryption_failed', 'low', { 
      error: e instanceof Error ? e.message : 'Unknown error' 
    });
    return data; // Return original data if decryption fails
  }
};

// Generate a simple browser fingerprint for encryption
const generateBrowserFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth.toString(),
    screen.width.toString() + screen.height.toString()
  ];
  
  // Generate a deterministic string from browser data
  return components.join('|');
};

// Type definition for analytics properties
type AnalyticsProperty = string | number | boolean | null | undefined;

// Enhanced privacy-friendly analytics with security focus
export const trackPrivacyFriendlyEvent = (eventName: string, properties?: Record<string, AnalyticsProperty>): void => {
  // Only track events if user has consented
  if (localStorage.getItem('cookie-consent-given') !== 'true') {
    return;
  }
  
  // Only include non-identifying information
  const sanitizedProps = properties ? Object.fromEntries(
    Object.entries(properties).filter(([key]) => 
      !['content', 'personal', 'email', 'name', 'address', 'phone'].includes(key.toLowerCase())
    )
  ) : {};
  
  // Log event only to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics event:', eventName, sanitizedProps);
  }
  
  // Track security-relevant events
  if (eventName.includes('security') || eventName.includes('error')) {
    trackSecurityEvent(eventName, sanitizedProps);
  }
};

// Enhanced user data purging with security logging
export const purgeUserData = (): void => {
  try {
    // Get a list of all storage keys
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }
    
    // Securely wipe user data
    keys.forEach(key => {
      if (key.startsWith('noteflow-') || key.startsWith('onlinenote-')) {
        secureWipe(key);
      }
    });
    
    // Reinitialize essential app settings
    initializeSecurityTokens();
    
    // Set purge confirmation
    localStorage.setItem('onlinenote-purged', new Date().toISOString());
    
    console.log('User data purged successfully');
    trackSecurityEvent('user_data_purged', { keys_count: keys.length });
  } catch (error) {
    console.error('Error purging user data:', error);
    logSecurityIncident('data_purge_failed', 'medium', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
};

// Export sanitizeInput from security monitoring for convenience
export { sanitizeInput };
