/**
 * Security utilities for OneAI Notes
 * These functions enhance data protection and privacy
 */

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
  } catch (e) {
    console.error('Error in secure wipe:', e);
  }
};

// Validate storage integrity to prevent tampering
export const validateStorageIntegrity = (): boolean => {
  try {
    // Get security token set during legitimate operations
    const securityToken = localStorage.getItem('onlinenote-security-token');
    
    // If token is missing, that's suspicious
    if (!securityToken) {
      console.warn('Security token missing - possible tampering');
      return false;
    }
    
    // Check expected storage properties
    const requiredKeys = [
      'onlinenote-initialized',
      'onlinenote-last-clear-date'
    ];
    
    const missingKeys = requiredKeys.filter(key => !localStorage.getItem(key));
    if (missingKeys.length > 0) {
      console.warn('Missing required storage keys:', missingKeys);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('Error validating storage integrity:', e);
    return false;
  }
};

// Encrypt data for storage (lightweight client-side encryption)
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
    return data; // Fallback to unencrypted data
  }
};

// Decrypt data from storage
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

// Privacy-friendly analytics function that respects user preferences
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
  
  // In production, this would call a privacy-friendly analytics service
};

// Remove all user data on account deletion or end of 24-hour period
export const purgeUserData = (): void => {
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
  
  // Keep only essential app settings
  localStorage.setItem('onlinenote-initialized', 'true');
  localStorage.setItem('onlinenote-last-clear-date', new Date().toDateString());
  
  // Set purge confirmation
  localStorage.setItem('onlinenote-purged', new Date().toISOString());
  
  console.log('User data purged successfully');
};
