
/**
 * Utilities for client-side encryption of notes
 */

// Constants
const ENCRYPTION_KEY = 'noteflow-encryption-key';

// Generate a random encryption key if one doesn't exist
export const getOrCreateEncryptionKey = (): string => {
  try {
    let key = localStorage.getItem(ENCRYPTION_KEY);
    if (!key) {
      // Generate a random 256-bit key (32 bytes, encoded as base64)
      const randomBytes = new Uint8Array(32);
      window.crypto.getRandomValues(randomBytes);
      key = btoa(String.fromCharCode.apply(null, [...randomBytes]));
      localStorage.setItem(ENCRYPTION_KEY, key);
    }
    return key;
  } catch (error) {
    console.error('Error getting/creating encryption key:', error);
    // Fallback key if localStorage fails
    return 'ZmFsbGJhY2tfa2V5X2Zvcl9lbmNyeXB0aW9uXzEyMzQ1Njc4OTA=';
  }
};

// Enhanced base64 validation with better error handling and more lenient checks
const isValidBase64 = (str: string): boolean => {
  if (!str || typeof str !== 'string' || str.length === 0) {
    return false;
  }
  
  try {
    // Remove any whitespace
    const cleanStr = str.trim();
    
    // Less strict check: just make sure it only contains valid base64 characters
    // This is more lenient than requiring proper padding
    if (!/^[A-Za-z0-9+/=]+$/.test(cleanStr)) {
      return false;
    }
    
    // Try to decode it - if this works, it's valid enough
    try {
      atob(cleanStr);
      return true;
    } catch (decodeError) {
      return false;
    }
  } catch (e) {
    return false;
  }
};

// Check if content appears to be encrypted with better validation
const isEncryptedContent = (content: string): boolean => {
  if (!content || typeof content !== 'string' || content.length === 0) {
    return false;
  }
  
  try {
    // Check for our ENC: prefix
    if (content.startsWith('ENC:')) {
      const base64Part = content.substring(4);
      return isValidBase64(base64Part);
    }
    
    // Check if it looks like old base64 encrypted content
    // Encrypted content is typically long and contains only base64 characters
    if (content.length > 30) {
      // For legacy encryption format without prefix, we're more lenient with validation
      // as we just want to attempt decryption for content that looks encrypted
      try {
        // Just check if it generally looks like base64
        const containsOnlyBase64Chars = /^[A-Za-z0-9+/=]+$/.test(content.trim());
        
        if (containsOnlyBase64Chars) {
          // If it looks like base64, it's probably encrypted
          return true;
        }
      } catch (e) {
        // Ignore errors in regex matching
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking if content is encrypted:', error);
    return false;
  }
};

// Encrypt text using AES-GCM with enhanced error handling
export const encryptContent = async (content: string): Promise<string> => {
  try {
    // Return original content if empty or not a string
    if (!content || typeof content !== 'string') {
      return content || '';
    }
    
    // For very short content, don't encrypt to avoid overhead
    if (content.length < 10) {
      return content;
    }

    // Check if crypto API is available
    if (!window.crypto || !window.crypto.subtle) {
      console.warn('Web Crypto API not available, returning plain text');
      return content;
    }

    const key = getOrCreateEncryptionKey();
    if (!key) {
      console.warn('No encryption key available, returning plain text');
      return content;
    }

    const encodedKey = Uint8Array.from(atob(key), c => c.charCodeAt(0));
    
    // Import the raw key
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      encodedKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    // Create an initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encode the content to encrypt
    const encodedContent = new TextEncoder().encode(content);
    
    // Encrypt the content
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      cryptoKey,
      encodedContent
    );
    
    // Combine the IV and encrypted content and encode as base64
    const result = new Uint8Array(iv.length + new Uint8Array(encryptedContent).length);
    result.set(iv);
    result.set(new Uint8Array(encryptedContent), iv.length);
    
    // Add a prefix to identify encrypted content
    const encrypted = 'ENC:' + btoa(String.fromCharCode.apply(null, [...result]));
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return content; // Fallback to unencrypted content
  }
};

// Decrypt text using AES-GCM with enhanced error handling
export const decryptContent = async (encryptedContent: string): Promise<string> => {
  try {
    // Return original data if it's empty or null
    if (!encryptedContent || typeof encryptedContent !== 'string') {
      return encryptedContent || '';
    }
    
    // Check if content is actually encrypted
    if (!isEncryptedContent(encryptedContent)) {
      return encryptedContent;
    }
    
    // Check if crypto API is available
    if (!window.crypto || !window.crypto.subtle) {
      console.warn('Web Crypto API not available, returning content as-is');
      return encryptedContent;
    }
    
    // Try different decryption approaches in sequence
    let result = encryptedContent;
    
    // First try: Handle new format with ENC: prefix
    if (encryptedContent.startsWith('ENC:')) {
      try {
        result = await decryptNewFormat(encryptedContent);
        if (result !== encryptedContent) return result;
      } catch (e) {
        console.warn('New format decryption failed, trying alternative method');
      }
    }
    
    // Second try: Handle old format (base64 without prefix)
    try {
      result = await decryptLegacyFormat(encryptedContent);
      if (result !== encryptedContent) return result;
    } catch (e) {
      console.warn('Legacy decryption failed');
    }
    
    // If all decryption attempts failed but the content looks like encrypted data,
    // return a user-friendly message instead of the encrypted blob
    if (encryptedContent.length > 40 && /^[A-Za-z0-9+/=]+$/.test(encryptedContent)) {
      return '[Encrypted note - unable to decrypt. The encryption key may have changed.]';
    }
    
    return encryptedContent; // Return original content if decryption fails
  } catch (error) {
    console.warn('Decryption failed, returning content as-is:', error.message);
    return encryptedContent; // Return original content if decryption fails
  }
};

// Decrypt new format content (with ENC: prefix)
const decryptNewFormat = async (encryptedContent: string): Promise<string> => {
  try {
    // Remove the ENC: prefix
    const base64Data = encryptedContent.substring(4);
    
    // Attempt to validate base64, but continue with decryption even if not perfectly valid
    // This helps with compatibility for edge cases
    if (!isValidBase64(base64Data)) {
      console.warn('Base64 validation failed but continuing with decryption attempt');
    }
    
    const key = getOrCreateEncryptionKey();
    if (!key) {
      throw new Error('No encryption key available');
    }

    const encodedKey = Uint8Array.from(atob(key), c => c.charCodeAt(0));
    
    // Import the raw key
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      encodedKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Decode the base64 content
    const encryptedData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Extract the IV (first 12 bytes) and encrypted content
    if (encryptedData.length < 12) {
      throw new Error('Encrypted data too short');
    }
    
    const iv = encryptedData.slice(0, 12);
    const actualContent = encryptedData.slice(12);
    
    // Decrypt the content
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      cryptoKey,
      actualContent
    );
    
    return new TextDecoder().decode(decryptedContent);
  } catch (error) {
    console.error('New format decryption failed:', error);
    throw error;
  }
};

// Try to decrypt content that was encrypted with the old method
const decryptLegacyFormat = async (base64Data: string): Promise<string> => {
  try {
    const key = getOrCreateEncryptionKey();
    if (!key) {
      throw new Error('No encryption key available');
    }

    const encodedKey = Uint8Array.from(atob(key), c => c.charCodeAt(0));
    
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      encodedKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const encryptedData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    if (encryptedData.length < 12) {
      throw new Error('Data too short for legacy decryption');
    }
    
    const iv = encryptedData.slice(0, 12);
    const actualContent = encryptedData.slice(12);
    
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      cryptoKey,
      actualContent
    );
    
    return new TextDecoder().decode(decryptedContent);
  } catch (error) {
    console.error('Legacy decryption failed:', error);
    throw new Error('Legacy decryption not applicable');
  }
};

// Sanitize HTML content to prevent XSS attacks
export const sanitizeContent = (content: string): string => {
  try {
    if (!content || typeof content !== 'string') {
      return '';
    }
    
    // This is a simple implementation - for production, use a library like DOMPurify
    const tempDiv = document.createElement('div');
    tempDiv.textContent = content;
    return tempDiv.innerHTML;
  } catch (error) {
    console.error('Content sanitization error:', error);
    return content;
  }
};
